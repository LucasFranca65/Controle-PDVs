const mongoose = require('mongoose')
const Schema = mongoose.Schema

const System = new Schema({

    firt_conection:{
        type: Date,
        default: null
    },
    version:{
        type: String,
        required: true
    },
    by:{
        type: String,
        required: true
    }

})

mongoose.model("systens",System)