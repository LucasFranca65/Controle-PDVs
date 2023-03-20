//Carregando modulos
const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
//Mongoose Models
require('../models/Pdv')
const Pdv = mongoose.model('pdvs')

router.get('/',(req,res)=>{
    res.send("Painel Inicial dos administradores")
})

router.get('/pdvs',(req,res)=>{

    Pdv.find().lean().then((pdvs)=>{
        res.render('admin/adm_pdvs',{pdvs: pdvs})
    }).catch((err)=>{
        console.log(err)
    })
    
})

router.post('/pdvs/add_pdv',(req,res)=>{
   Pdv.findOne({$or:[{nControle: req.body.nControle},{nSerie: req.body.nSerie}]}).then((pdvs)=>{
    console.log(pdvs)
    console.log(req.body.nControle)
    if(pdvs){
        req.flash('error_msg',"Já existe um PDV Cadastrado com esses parametros")
        res.redirect('/admin/pdvs')   
    }else{

        const newPdv = {
            nControle : req.body.nControle,
            empresa: req.body.empresa,
            nSerie: req.body.nSerie,
            modelo: req.body.modelo
        }

        new Pdv(newPdv).save().then(()=>{                
            req.flash('success_msg',"PDV Cadastrado com Sucesso")
            res.redirect('/admin/pdvs')                                   
            }).catch((err)=>{            
                req.flash('error_msg',"Erro ao cadastrar PDVS"+err)
                res.redirect('/admin/pdvs') 
            })

    }
   }).catch((err)=>{
    req.flash('error_msg',"Erro INterno(00001)"+err)
    res.redirect('/admin/pdvs') 
   })
})




module.exports = router