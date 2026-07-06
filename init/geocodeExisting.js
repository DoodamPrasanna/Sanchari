const mongoose = require('mongoose');
const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

require('dotenv').config();
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = process.env.DB_URL || process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(MONGO_URL);
    console.log('connected');

    const listings = await Listing.find({ $or: [ { geometry: { $exists: false } }, { 'geometry.coordinates': { $size: 2, $all: [0, 0] } } ] });
    console.log(`Found ${listings.length} listings to geocode`);

    for(const listing of listings){
        try{
            const resp = await geocodingClient.forwardGeocode({
                query: `${listing.location}, ${listing.country}`,
                limit: 1
            }).send();
            if(resp.body.features && resp.body.features[0]){
                listing.geometry = resp.body.features[0].geometry;
                await listing.save();
                console.log(`Updated ${listing._id} -> ${JSON.stringify(listing.geometry)}`);
            } else {
                console.warn(`No geocode result for ${listing._id} (${listing.location})`);
            }
        } catch(e){
            console.error('Error geocoding', listing._id, e.message);
        }
    }

    await mongoose.disconnect();
    console.log('done');
}

main().catch(err=>{
    console.error(err);
    process.exit(1);
});
