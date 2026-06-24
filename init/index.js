const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a315fb88c39eaeebf438704",
        geometry: {
            type: "Point",
            coordinates: [0, 0],
        },
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

(async () => {
    try {
        await initDB();
        console.log("Seeding complete");
    } catch (e) {
        console.error("Error during seeding:", e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
})();
