const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");


const mongo_url = "mongodb://127.0.0.1:27017/Airhub";
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});


async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "67a261d0cdc1a410300a7bcd",
    }));
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();



