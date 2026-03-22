const router = require("express").Router()
const req = require("express/lib/request");
const multer = require("multer");
const Auth = require("../Middleware/Auth")
const Game = require("../Model/DummyGames");
const myTransaction = require("../Model/myTransaction");
const User = require("../Model/User");
const AdminEaring = require("../Model/AdminEaring");
const path = require("path")
const ReferralHis = require("../Model/referral")
const Transactions = require("../Model/transaction")
const sharp = require("sharp")
const fs = require("fs")
const randomstring = require("randomstring");
const config = require('config');
let userReferralPer = config.get('general.referralPer');
let InProcessSubmit = false;
let dummyTableMinCount = config.get('general.dummyTableMinCount');
let dummyTableMaxCount = config.get('general.dummyTableMaxCount');
let dummySecretToken = config.get('general.dummySecretToken');



// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/gamedoc");
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const fileFilter = (req, file, cd) => {
    if (
        (file.mimetype === "image/jpg",
            file.mimetype === "image/jpeg",
            file.mimetype === "image/png")
    ) {
        cd(null, true);
    } else {
        cd(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000000000,
    },
});



//Game_Ammount <= 10000
async function createDummyChallenge(gameAmount, duration) {
    const createdByName = await getDummyUserName();
    const acceptedByName = await getDummyUserName();


    const game = new Game({
        Game_type: 'Ludo Classics',
        Game_Ammount: gameAmount,
        Created_by: '6559fda3b7ce915f4a50d179',
        gameDuration: duration,
        createdByName: createdByName,
        acceptedByName: acceptedByName
    })
    game.save()
    console.log("Dummy Game saved");
}
async function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomGameDuration() {
    let minDuration = 15;
    let maxDuration = 25;
    let randomDuration = await getRandomInRange(minDuration, maxDuration);
    return randomDuration;
}

async function getRandomGameAmount() {
    let minAmount = 50;
    let maxAmount = 500;
    let randomAmount = await getRandomInRange(minAmount / 50, maxAmount / 50) * 50;
    return randomAmount;
}

async function deleteDummyChallenge(challenges) {
    var deletedCount = 0
        // await challenges.forEach(async(challenge) => 
    for (let i = 0; i < challenges.length; i++) {
        let challenge = challenges[i];
        let isExpired = await isDummyChallengeExpired(challenge.createdAt, challenge.gameDuration);

        if (isExpired) {
            console.log("Expired");
            console.log("Challenge ID ", challenge.id)
            try {
                await Game.findOneAndDelete({ _id: challenge._id });
                deletedCount += 1;
                console.log("Deleted")
                    // .then(function() {
                    //     deletedCount += 1;
                    //     console.log("Deleted");
                    // }).catch(function(error) {
                    //     console.log(error);
                    // });
            } catch (e) {
                console.log("Dummy Table could Removed", e)
            }

        } else {
            console.log("Not Expired");

        }
    }
    return deletedCount;
}

async function isDummyChallengeExpired(createdAt, duration) {
    let currentTime = new Date().getTime();
    let createdTime = createdAt.getTime();
    let durationMiliSeconds = duration * 60000;
    let passedMiliSeconds = currentTime - createdTime

    console.log("passedMiliSeconds  ", passedMiliSeconds);
    console.log("durationMiliSeconds", durationMiliSeconds);
    if (passedMiliSeconds > durationMiliSeconds) {
        return true;
    }
    return false
}

async function getDummyUserName() {
    const name = randomstring.generate({
        length: 5,
        charset: 'alphabetic'
    });
    return name;

}

router.get("/dummychallenge/createDummychallenge/:dummySecretToken", async(req, res) => {
    // get dummy challange
    try {
        if (req.params.dummySecretToken != dummySecretToken) {
            res.status(401).send("Invalid SecretToken");
        } else {
            const dummyChallenges = await Game.find({ $or: [{ Status: "running" }] });
            console.log("dummyTableMinCount", dummyTableMinCount)
            let deletedCount = await deleteDummyChallenge(dummyChallenges);
            console.log("deletedCount", deletedCount);
            let dummychallengesCount = dummyChallenges.length - deletedCount;
            console.log("after deleted dummychallengesCount", dummychallengesCount);
            if (dummychallengesCount < dummyTableMinCount) {
                console.log("in if condition")
                let randomCount = await getRandomInRange(dummyTableMinCount, dummyTableMaxCount);
                console.log("Random Number ", randomCount);
                let toBeCreatedCount = randomCount - dummychallengesCount;
                for (let i = 0; i < toBeCreatedCount; i++) {
                    await createDummyChallenge(await getRandomGameAmount(), await getRandomGameDuration());
                }
            }
            res.status(200).send("Done");
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/dummychallenge/running/all', Auth, async(req, res) => {
    try {
        const game = await Game.find({ $or: [{ Status: "running" }, { Status: "pending" }, { Status: "conflict" }] }).populate("Created_by", "Name Phone avatar _id").populate("Accepetd_By", "Name Phone avatar _id").populate("Winner", "Name Phone avatar _id")

        res.send(game)

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router