const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    
    nome:{
        type: String,
        required: true
    },
    login:{
        type: String,
        required: true
    },    
    setor:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },    
    date:{
        type: Date,
        default: Date.now()
    },
    eAdmin:{
        type: Boolean,
        default: false
    }

})

mongoose.model("users",User)