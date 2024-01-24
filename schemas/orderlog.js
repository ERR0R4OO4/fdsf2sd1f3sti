const mongoose = require(`mongoose`);


const schema = new mongoose.Schema({
    _id: {
        type: String,
    },
    number: {
        type: Number,

    }

})



module.exports = mongoose.model(`orderlog`, schema);