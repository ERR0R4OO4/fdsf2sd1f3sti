const mongoose = require(`mongoose`);


const schema = new mongoose.Schema({
    _id: {
        type: String
    },
    serverID: {
        type: String,
    },

    number: {
        type: Number,

    }

})



module.exports = mongoose.model(`ticket`, schema);