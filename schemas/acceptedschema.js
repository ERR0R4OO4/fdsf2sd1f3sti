const mongoose = require(`mongoose`);


const schema = new mongoose.Schema({
    _id: {
        type: String,

    },
    name: {
        type: String,
    }
})



module.exports = mongoose.model(`accepted`, schema, "accepted");