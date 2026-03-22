# Razorpay Integration Setup

## 1. Environment Variables (.env)
Project root me `.env` file banayein aur yeh keys add karein:
```
RAZORPAY_KEY_ID=rzp_test_XPxpStYgUZiWWa
RAZORPAY_KEY_SECRET=NxQL07DFn2al638ctAjfg8Bu
```

## 2. server.js me Changes
- File ke top par yeh line add ki gayi:
  ```js
  require('dotenv').config();
  ```
  Isse environment variables load ho jate hain.

## 3. Razorpay Integration (Routes/Gateway.js)
- Razorpay SDK import kiya:
  ```js
  const Razorpay = require('razorpay');
  ```
- Razorpay instance banaya environment variables se:
  ```js
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  ```
- Naya endpoint add kiya Razorpay order create karne ke liye:
  ```js
  router.post('/razorpay/order', async (req, res) => {
    try {
      const { amount, currency, receipt } = req.body;
      const options = {
        amount: amount * 100, // amount in paise
        currency: currency || 'INR',
        receipt: receipt || `rcptid_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      res.json({ status: 'success', order });
    } catch (err) {
      res.status(500).json({ status: 'failed', error: err.message });
    }
  });
  ```

## 4. API Usage Example
- **POST** `/razorpay/order`
  ```json
  {
    "amount": 500,
    "currency": "INR",
    "receipt": "order_rcptid_11"
  }
  ```
- Response me Razorpay order details milenge.

---

**Note:** `.env` file ko kabhi bhi git me commit na karein. Yeh sirf local machine/server par rakhein. 