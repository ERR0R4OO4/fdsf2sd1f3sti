const mongoose = require(`mongoose`);


const schema = new mongoose.Schema({
    _id: {
        type: String,

    },
    name: {
        type: String,
    },
    proof: {
        type: String
    }
})



module.exports = mongoose.model(`theif`, schema);

