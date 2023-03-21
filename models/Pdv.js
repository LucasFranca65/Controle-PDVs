const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pdv = new Schema({

    empresa:{
        type: String,
        required: true
    },    
    nControle:{
        type: Number,
        required: true
    },
    nSerie:{
        type: Number,
        required: true
    },
    modelo:{
        type: String,
        required: true
    },    
    date: {
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        default: "disponivel"
    }    
})

mongoose.model("pdvs",Pdv)