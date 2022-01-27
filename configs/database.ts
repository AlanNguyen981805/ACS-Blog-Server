import mongoose from "mongoose";

const URI = process.env.MONGODB_URL
mongoose.connect(`${URI}`, {
    autoIndex: true,
    autoCreate: true,
}, (err) => {
    if(err) throw err
    console.log('Mongodb connection')
})