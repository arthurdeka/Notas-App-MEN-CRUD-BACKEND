const mongoose = require('mongoose');

async function connectToDb() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('db connected');

    } catch(err) {
        console.log(err);
        
    }
}

module.exports = {
    connectToDb,
};
