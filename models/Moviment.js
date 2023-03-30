const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Moviment = new Schema({

    empresa:{
        type: String,
        required: true
    },    
    nControle:{
        type: Number,
        required: true
    },
    veiculo:{
        type: Number,
        required: true
    },
    matricula:{
        type: Number,
        required: true
    },
    destino:{
        type: String,
        required: true
    },        
    saida: {
        type: Date,
        default: Date.now()        
    },    
    retorno:{
        type: Date,
        default: null
    },
    date:{
        type: Date,
        default: Date.now()
    }    
})

mongoose.model("moviments",Moviment)