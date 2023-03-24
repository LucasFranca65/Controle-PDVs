//Carregando Modulos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')
const {lOgado} = require('../helpers/eAdmin')
//Mongoose Models
require('../models/Moviment')
const Moviment = mongoose.model('moviments')
require('../models/Pdv')
const Pdv = mongoose.model('pdvs')

//Rotas
router.get('/',(req,res)=>{
    res.redirect('/')
})
//PGeral por periodo
router.get('/por_periodo',lOgado,(req,res)=>{
    res.render('consulta/por_periodo')
})
router.post('/por_periodo/pesquisar',lOgado,(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT23:59:59.SSSZ")

    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/consulta/por_periodo')
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
            res.redirect('/consulta/por_periodo')
        })
    }
    
})
//Por matricula por periodo
router.get('/por_matricula',lOgado,(req,res)=>{
    res.render('consulta/por_matricula')
})
router.post('/por_matricula/pesquisar',lOgado,(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT00:00:00.SSSZ")
    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/consulta/por_matricula')
    }else{
        Moviment.find({date: {$gte: dateMin, $lt: dateMax}, matricula: req.body.matricula}).then((movimentos)=>{
            var i=0
            while(i < movimentos.length){                   
                movimentos[i]["data_saida"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                movimentos[i]["data_retorno"] = moment(movimentos[i].retorno).format('DD/MM/YYYY HH:mm')
                i++                      
            }
            res.render('consulta/por_matricula',{movimentos})       
        }).catch((err)=>{
            req.flash('error_msg',"Não foi encontrado movimentos para matricula "+req.body.matricula+" no periodo informado")
            res.redirect('/consulta/por_matricula')
        })
    }
})

router.get('/por_veiculo',lOgado,(req,res)=>{
    res.render('consulta/por_veiculo')
})
router.post('/por_veiculo/pesquisar',lOgado,(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT00:00:00.SSSZ")
    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/consulta/por_veiculo')
    }else{
        Moviment.find({date: {$gte: dateMin, $lt: dateMax}, veiculo: req.body.veiculo}).then((movimentos)=>{
            var i=0
            while(i < movimentos.length){                   
                movimentos[i]["data_saida"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                movimentos[i]["data_retorno"] = moment(movimentos[i].retorno).format('DD/MM/YYYY HH:mm')
                i++                      
            }
            res.render('consulta/por_veiculo',{movimentos})       
        }).catch((err)=>{
            req.flash('error_msg',"Não foi encontrado movimentos para o veiculo "+req.body.veiculo+" no periodo informado")
            res.redirect('/consulta/por_matricula')
        })    
    }
})

router.get('/por_pdv',lOgado,(req,res)=>{
    res.render('consulta/por_pdv')
})
router.post('/por_pdv/pesquisar',lOgado,(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT00:00:00.SSSZ")
    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/consulta/por_pdv')
    }else{
        Moviment.find({date: {$gte: dateMin, $lt: dateMax}, nControle: req.body.nControle}).then((movimentos)=>{
            var i=0
            while(i < movimentos.length){                   
                movimentos[i]["data_saida"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                movimentos[i]["data_retorno"] = moment(movimentos[i].retorno).format('DD/MM/YYYY HH:mm')
                i++                      
            }
            res.render('consulta/por_veiculo',{movimentos})       
        }).catch((err)=>{
            req.flash('error_msg',"Não foi encontrado movimentos para o PDV Nº "+req.body.nControle+" no periodo informado")
            res.redirect('/consulta/por_pdv')
        })    
    }
})

router.get('/por_destino',lOgado,(req,res)=>{
    res.render('consulta/por_destino')
})
router.post('/por_destino/pesquisar',lOgado,(req,res)=>{
    
    var dateMax = moment(req.body.dateMax).format("YYYY-MM-DDT23:59:59.SSSZ")
    var dateMin = moment(req.body.dateMin).format("YYYY-MM-DDT00:00:00.SSSZ")
    if(dateMax < dateMin){
        req.flash('error_msg',"A data inicial não pode ser menor que a final")
        res.redirect('/consulta/por_destino')
    }else{
        Moviment.find({date: {$gte: dateMin, $lt: dateMax}, destino: req.body.destino}).then((movimentos)=>{
            var i=0
            while(i < movimentos.length){                   
                movimentos[i]["data_saida"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                movimentos[i]["data_retorno"] = moment(movimentos[i].retorno).format('DD/MM/YYYY HH:mm')
                i++                      
            }
            res.render('consulta/por_destino',{movimentos})       
        }).catch((err)=>{
            req.flash('error_msg',"Não foi encontrado movimentos com destino "+req.body.destino+" no periodo informado")
            res.redirect('/consulta/por_destino')
        })    
    }
})

module.exports = router