const mongoose = require(`mongoose`);


const schema = new mongoose.Schema({

    _id: {

        type: String,

    },

    deleteid: {

        type: String

    },

    order: {

        type: String,

    },

    number: {
        type: Number,

    }

})



module.exports = mongoose.model(`ordersnumber`, schema);