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
    Pdv.find({status: "DISPONIVEL"}).then((pdvsDisp)=>{      
        Pdv.find({status: "EM USO"}).then((pdvsInd)=>{
            Moviment.find({retorno: null}).then((movimentos)=>{

                var i=0
                while(i < movimentos.length){
                   
                    movimentos[i]["data_exib"] = moment(movimentos[i].saida).format('DD/MM/YYYY HH:mm')
                    i++
                }
                res.render('controle/painel_controle',{pdvsDisp, pdvsInd,movimentos})
            }).catch((err)=>{
                req.flash('error_msg',"Erro de consulta 0001")
                res.redirect("/")
            })
        }).catch((err)=>{
            req.flash('error_msg',"Erro de consulta 0002")
            res.redirect("/")
        })
        
    }).catch((err)=>{
        req.flash('error_msg',"Erro de consulta 0003")
        res.redirect("/")
    })
    
})

//Rota que seleciona pdv para dar retorno
router.get('/retorno_pdv/:id',(req,res)=>{
    console.log(req.params.id)
    Pdv.findOne({_id: req.params.id}).then((pdv)=>{
        Moviment.findOne({nControle: pdv.nControle, status: "EM USO"}).then((movimento)=>{
            res.render('controle/retorno_pdv',{pdv,movimento})
        }).catch((err)=>{
            req.flash('error_msg',"Erro Interno")
        })
        
    }).catch((err)=>{
        req.flash('error_msg',"Não encontrado pdv com esse parametros")
        res.redirect('/controle')
    })
})
//rota que realiza o retorno
router.post('/retorno_pdv/retornar',(req,res)=>{
   
    Pdv.findOne({_id: req.body.pdvUtil}).then((pdv)=>{
        pdv.status = "DISPONIVEL"
            pdv.save().then(()=>{
                req.flash('success_msg',"PDV "+pdv.nControle+" Disponibilizado para uso")  
        }).catch((err)=>{
            req.flash('error_msg',"Erro interno rpdv001")
            res.redirect('/controle')
        })
    })

    Moviment.findOne({_id: req.body.movUtil}).then((movimento)=>{
        
        movimento.retorno = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        movimento.save().then(()=>{
            req.flash('success_',"Movimentação finalizada")
            res.redirect('/controle')
        }).catch((err)=>{
            req.flash('error_msg',"Erro interno rpdv002")
            res.redirect('/controle')
        })
    })

})

//Seleciona PDV Para saida
router.get('/saida_pdv/:id',(req,res)=>{
    Pdv.findOne({_id: req.params.id}).then((pdvs)=>{
        res.render('controle/saida_pdv',{pdvs})
    }).catch((err)=>{
        req.flash('error_msg',"Não encontrado pdv com esse parametros")
        res.redirect('/controle')
    })
})
//Faz a saida 
router.post('/saida_pdv/saida',(req,res)=>{
    
    Pdv.findOne({_id: req.body.pdvUtil}).then((pdvs)=>{ 
        Moviment.findOne({$and:[{retorno: null},{$or:[{matricula: req.body.matricula},{veiculo: req.body.veiculo}]}]}).then((movimento)=>{
            console.log(movimento)
            if(movimento){
                req.flash('error_msg',"Já Existe um movimento em aberto para essa matricula ou veiculo")
                res.redirect('/controle')
            }
            
            if(pdvs.status =="EM USO"){
                req.flash('error_msg',"PDV Indisponivel no momento")
                res.redirect('/controle')
            }
            else{
                const newMoviment = {
                    empresa: req.body.empresa,
                    nControle: pdvs.nControle,
                    veiculo: req.body.veiculo,
                    matricula: req.body.matricula,
                    destino: req.body.destino,
                    date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    saida: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ")                
                }
                
                new Moviment(newMoviment).save().then(()=>{
                    req.flash('success_msg',"Sucesso gravação de movimento")
                }).catch((err)=>{
                    req.flash('error_msg',"Erro Interno000003"+err)
                    res.redirect('/controle')
                })
                
            pdvs.status = "EM USO"        
            
            pdvs.save().then(()=>{
                req.flash('success_msg',"Saida Gravada com sucesso")
                res.redirect('/controle')
            }).catch((err)=>{
                req.flash('error_msg',"Erro Interno0009"+err)
                res.redirect('/controle')
            })
            }
        }).catch((err)=>{
            req.flash('error_msg',"Erro Interno0019"+err)
            res.redirect('/controle')
        })
    }).catch((err)=>{
        req.flash('error_msg',"Não foi encontrado PDV Para esses Parametros",err)
        res.redirect('/controle')
    })
    
})

module.exports = router