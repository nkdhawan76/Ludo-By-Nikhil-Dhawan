const express=require("express");
const GatewaySettings=require("../Model/Gateway");
const router = express.Router()
const mongoose=require("mongoose");
const multer = require("multer")
const path = require("path");
const { findById, findOne } = require("../Model/settings");
const { send } = require("process");
const Razorpay = require('razorpay');

// Function to get Razorpay keys from database
async function getRazorpayKeys() {
    try {
        const gatewaySettings = await GatewaySettings.findOne();
        if (gatewaySettings && gatewaySettings.RazorPayKey && gatewaySettings.RazorPaySecretKey) {
            return {
                key: gatewaySettings.RazorPayKey,
                secret: gatewaySettings.RazorPaySecretKey
            };
        } else {
            // Fallback to environment variables if database doesn't have keys
            return {
                key: process.env.RAZORPAY_KEY_ID || 'rzp_test_wEwkyVMPi3twxg',
                secret: process.env.RAZORPAY_KEY_SECRET || 'oUEa4OM4BwlJ1C64izsWieJz'
            };
        }
    } catch (error) {
        console.error('Error fetching Razorpay keys:', error);
        // Fallback to environment variables
        return {
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_wEwkyVMPi3twxg',
            secret: process.env.RAZORPAY_KEY_SECRET || 'oUEa4OM4BwlJ1C64izsWieJz'
        };
    }
}

// Function to get UPI keys from database
async function getUPIKeys() {
    try {
        const gatewaySettings = await GatewaySettings.findOne();
        if (gatewaySettings && gatewaySettings.UPIGatewayKey && gatewaySettings.UPIGatewaySecret) {
            return {
                key: gatewaySettings.UPIGatewayKey,
                secret: gatewaySettings.UPIGatewaySecret
            };
        } else {
            // Fallback to environment variables if database doesn't have keys
            return {
                key: process.env.UPI_GATEWAY_KEY || '',
                secret: process.env.UPI_GATEWAY_SECRET || ''
            };
        }
    } catch (error) {
        console.error('Error fetching UPI keys:', error);
        // Fallback to environment variables
        return {
            key: process.env.UPI_GATEWAY_KEY || '',
            secret: process.env.UPI_GATEWAY_SECRET || ''
        };
    }
}

router.post("/gatewaysettings",async(req, res) => {
    try{
    if(req.body.settingId){
        const updatesetting = await GatewaySettings.findById(req.body.settingId);
        updatesetting.RazorPayout=req.body.RazorPayout
        updatesetting.RazorDeposit=req.body.RazorDeposit
        updatesetting.RazorpayAuto= req.body.RazorpayAuto
        updatesetting.decentroPayout= req.body.decentroPayout
        updatesetting.decentroDeposit= req.body.decentroDeposit
        updatesetting.decentroAuto= req.body.decentroAuto
        updatesetting.RazorPayKey= req.body.RazorPayKey
        updatesetting.RazorPaySecretKey= req.body.RazorPaySecretKey
        updatesetting.AccountName= req.body.AccountName
        updatesetting.UPIEnabled= req.body.UPIEnabled
        updatesetting.UPIGatewayKey= req.body.UPIGatewayKey
        updatesetting.UPIGatewaySecret= req.body.UPIGatewaySecret

        updatesetting.save();
        res.send({status:'success', data:updatesetting});
    }
    else{
        const data = new GatewaySettings({
            RazorPayout:req.body.RazorPayout,
            RazorDeposit:req.body.RazorDeposit,
            RazorpayAuto: req.body.RazorpayAuto,
            decentroPayout: req.body.decentroPayout,
            decentroDeposit: req.body.decentroDeposit,
            decentroAuto: req.body.decentroAuto,
            RazorPayKey: req.body.RazorPayKey,
            RazorPaySecretKey: req.body.RazorPaySecretKey,
            AccountName: req.body.AccountName,
            UPIEnabled: req.body.UPIEnabled,
            UPIGatewayKey: req.body.UPIGatewayKey,
            UPIGatewaySecret: req.body.UPIGatewaySecret
        });
        
        const val= await data.save();
        res.send({status:'success', data:val});
    }} catch (err) {
        res.send(err);
        res.send({status:'failed', data:err});
    }   
})

router.post("/gatewaysettings/toggle-upi", async(req, res) => {
    try {
        const gatewaySettings = await GatewaySettings.findOne();
        if (gatewaySettings) {
            gatewaySettings.UPIEnabled = !gatewaySettings.UPIEnabled;
            await gatewaySettings.save();
            res.send({
                status: 'success', 
                data: gatewaySettings,
                message: `UPI ${gatewaySettings.UPIEnabled ? 'enabled' : 'disabled'} successfully`
            });
        } else {
            // Create new settings if none exist
            const newSettings = new GatewaySettings({
                UPIEnabled: true,
                RazorPayout: false,
                RazorDeposit: false,
                RazorpayAuto: false,
                decentroPayout: false,
                decentroDeposit: false,
                decentroAuto: false
            });
            await newSettings.save();
            res.send({
                status: 'success', 
                data: newSettings,
                message: 'UPI enabled successfully'
            });
        }
    } catch (err) {
        res.status(500).send({
            status: 'failed', 
            message: 'Failed to toggle UPI status',
            error: err.message
        });
    }
});

router.get('/gatewaysettings/data', async (req, res) => {
    try {
        const data = await GatewaySettings.findOne()
        res.send(data)
    } catch (e) {
        res.status(404).send()
    }
})

// Create Razorpay order endpoint
router.post('/razorpay/order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    // Get dynamic Razorpay keys
    const razorpayKeys = await getRazorpayKeys();
    const razorpay = new Razorpay({
      key_id: razorpayKeys.key,
      key_secret: razorpayKeys.secret,
    });
    
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: currency || 'INR',
      receipt: receipt || `rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ status: 'success', order });
  } catch (err) {
    res.status(500).json({ status: 'failed', error: err.message });
  }
});

module.exports =router;