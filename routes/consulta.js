//Carregando Modulos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')
//Mongoose Models
require('../models/Moviment')
const Moviment = mongoose.model('moviments')
require('../models/Pdv')
const Pdv = mongoose.model('pdvs')

//Rotas
router.get('/',(req,res)=>{
    res.send("Painel Inicial das consultas")
})
//PGeral por periodo
router.get('/por_periodo',(req,res)=>{
    res.render('consulta/por_periodo')
})
router.get('/por_periodo/pesquisar',(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT00:00:00.SSSZ")
    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/controle')
    }else{
        Moviment.find({date: {$gte: dateMin, $lt: dateMax}}).then((movimentos)=>{
            var i=0
            while(i < movimentos.length){                   
                movimentos[i]["data_saida"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                movimentos[i]["data_retorno"] = moment(movimentos[i].retorno).format('DD/MM/YYYY HH:mm')
                i++                      
            }
            res.render('consulta/por_periodo',{movimentos})       
        }).catch((erro)=>{
            req.flash('error_msg',"Não foi encontrado PDV para o periodo Informado")
        })
    }
    
})
//Por matricula por periodo
router.get('/por_matricula',(req,res)=>{
    res.render('consulta/por_matricula')
})
router.get('/por_matricula/pesquisar',(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT00:00:00.SSSZ")
    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/controle')
    }else{
        Moviment.find({date: {$gte: dateMin, $lt: dateMax}, matricula: req.body.matricula}).then((movimentos)=>{
            var i=0
            while(i < movimentos.length){                   
                movimentos[i]["data_saida"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                movimentos[i]["data_retorno"] = moment(movimentos[i].retorno).format('DD/MM/YYYY HH:mm')
                i++                      
            }
            res.render('consulta/por_matricula',{movimentos})       
        })
    }
})

router.get('/usuario_no_periodo',(req,res)=>{
    res.send("PDV no periodo")
})

router.get('/veiculo_no_periodo',(req,res)=>{
    res.send("PDV no periodo")
})

module.exports = router