//Carregando modulos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')
//Mongoose Models
require('../models/Pdv')
const Pdv = mongoose.model('pdvs')
require('../models/Moviment')
const Moviment = mongoose.model('moviments')



router.get('/',(req,res)=>{
    Pdv.find().then((pdvs)=>{
        res.render('controle/painel_controle',{pdvs})
    }).catch((err)=>{
        req.flash('error_msg',"Erro Interno ERR000002",err)
        res.redirect('/')
    })
    
})

router.get('/retorno_pdv',(req,res)=>{
    res.send("rota de retorno dos PDVs")
})

router.get('/saida_pdv/:id',(req,res)=>{
    console.log(req.params.id)
    Pdv.findOne({_id: req.params.id}).then((pdvs)=>{
        res.render('controle/saida_pdv',{pdvs})
    }).catch((err)=>{
        req.flash('error_msg',"Não encontrado pdv com esse parametros")
        res.redirect('/controle')
    })
})

router.post('/saida_pdv/saida',(req,res)=>{
    
    Pdv.findOne({_id: req.body.pdvUtil}).then((pdvs)=>{ 
        
            const newMoviment = {
                empresa: req.body.empresa,
                nControle: pdvs.nControle,
                veiculo: req.body.veiculo,
                matricula: req.body.matricula,
                destino: req.body.destino,
                saida: moment(new Date())                 
            }
            
            new Moviment(newMoviment).save().then(()=>{
                req.flash('success_msg',"Sucesso gravação de movimento")
            }).catch((err)=>{
                req.flash('error_msg',"Erro Interno000003"+err)
                res.redirect('/controle')
            })      
        
        pdvs.status = "indisponivel"        
        
        pdvs.save().then(()=>{
            req.flash('success_msg',"Saida Gravada com sucesso")
            res.redirect('/controle')
        }).catch((err)=>{
            req.flash('error_msg',"Erro Interno0009"+err)
            res.redirect('/controle')
        })

    }).catch((err)=>{
        req.flash('error_msg',"Não foi encontrado PDV Para esses Parametros",err)
        res.redirect('/controle')
    })
    res.render('controle/saida_pdv')
})

module.exports = router