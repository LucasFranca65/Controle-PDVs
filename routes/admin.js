//Carregando modulos
const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
//Mongoose Models
require('../models/Pdv')
const Pdv = mongoose.model('pdvs')
require('../models/User')
const User = mongoose.model('users')

//Conjunto de rotas


router.get('/',(req,res)=>{
    res.send("Painel Inicial dos administradores")
})

//Rotas de Administração dos PDVs
    //Rota Principal dos PDVs
    router.get('/pdvs',(req,res)=>{

        Pdv.find().lean().then((pdvs)=>{
            res.render('admin/adm_pdvs',{pdvs: pdvs})
        }).catch((err)=>{
            console.log(err)
        })
        
    })
    //Rota que adiciona pdv
    router.post('/pdvs/add_pdv',(req,res)=>{
        var error = []
        if(!req.body.nControle || typeof req.body.nControle == undefined || req.body.nControle == null){
            error.push({texto:"Número de Controle Invalido"})
        }
        if(!req.body.nSerie || typeof req.body.nSerie == undefined || req.body.nSerie == null){
            error.push({texto:"Número se Serie invalido"})
        }
        if(req.body.empresa == "selecione"){
            error.push({texto:"Selecione uma empresa"}) 
        }
        if(req.body.modelo == "selecione"){
            error.push({texto:"Selecione um modelo"}) 
        }
        if(error.length > 0){
            Pdv.find().lean().then((pdvs)=>{
                res.render('admin/adm_pdvs',{pdvs, error})
            }).catch((err)=>{
                console.log(err)
            })
            
        }else{
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

        }
       
    })
    //Rota que exclui pdvs
    router.post('/pdvs/dell_pdv',(req,res)=>{
        if(req.body.ident == undefined){
            req.flash('error_msg',"Nenhum PDV Selecionado para exclusão")
            res.redirect('/admin/pdvs')
           }else{       
               var query = {"_id":{$in:req.body.ident}}       
                   Pdv.deleteMany(query).then(()=>{
                       req.flash('success_msg',"PDVs selecionados Excluidos com sucesso")
                       res.redirect('/admin/pdvs')
                   }).catch((err)=>{
                       req.flash('error_msg',"Não foi encontrados pdvs com os parametros informados")
                       res.redirect('/admin/pdvs')
                   })
           }
    })

//Rotas de Administração de Usuarios
    //Rota Principal
    router.get('/users',(req,res)=>{
        User.find().then((users)=>{
            res.render('admin/adm_users',{users})
        })        
    })

    router.post('/users/add_user',(req,res)=>{

        var error = []
        //  Validação de usuario

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                error.push({texto:"Nome Invalido"})
            }
            if(req.body.nome.length < 5){
                error.push({texto:"Nome Muito Curto, minimo 5 caracteres"})
            }
        //  Validação de Login
            if(!req.body.login || typeof req.body.login == undefined || req.body.login == null){
                error.push({texto:"Login Invalido"})
            }
            if(req.body.login.length < 3){
                error.push({texto:"Login Muito Curto minimo 3 caracteres"})
            }
        //  Validação de Setor    
            if(!req.body.setor || typeof req.body.setor == undefined || req.body.setor == null){
                error.push({texto:"Setor Invalido"})
            }
            if(req.body.setor.length < 2){
                error.push({texto:"Nome do Setor Muito Curto, minimo 2 caracteres"})
            }
        //  Validando Senha
            if(!req.body.senha1 || typeof req.body.senha1 == undefined || req.body.senha1 == null){
                error.push({texto:"Senha Invalida"})
            }
            if(req.body.senha1.length < 6){
                error.push({texto:"Senha Muito Curta, minimo 6 caracteres"})
            }
            if(req.body.senha2 != req.body.senha1){
                error.push({texto:"As Senhas não conferem"})
            }    
        //  Verificando erros
            if(error.length > 0){
                User.find().then((users)=>{
                    res.render('admin/adm_users',{error, users})
                })
                
            }else{            
            //  Verificando se usuario é Administrador 
                if(req.body.eAdmin == "true"){ //Se campo é admin estiver marcado ele grava usuario como administrador
                    //verifica se o usuario já existe
                    User.findOne({login: req.body.login}).then((users)=>{
                        if(users){
                            req.flash('error_msg', "Já existe um usuario com esse login")
                            res.redirect('/admin/users')
                        }else{                        
                            
                            const novoUsuario = new User({
                                nome : req.body.nome,
                                login: req.body.login,
                                setor: req.body.setor,
                                senha: req.body.senha1,
                                eAdmin: true
                            })
                            bcrypt.genSalt(10, (erro, salt)=>{
                                bcrypt.hash(novoUsuario.senha, salt,(erro,hash)=>{
                                    if(erro){
                                        req.flash('error_msg',"Houve um erro ao salvar usuario Administrador")
                                        res.redirect('/admin/users/add_user')
                                    }
                                    novoUsuario.senha = hash
                                    novoUsuario.save().then(()=>{
                                        req.flash('success_msg',"Usuario Administrador Cadastrado com sucesso")
                                        res.redirect('/admin/users')
                                    }).catch((err)=>{
                                        req.flash('error_msg',"Erro ao criar usuario Administrador")
                                        res.redirect('/admin/users/add_user')
                                    })
                                })
                            })    
                        }    
                    }).catch((err)=>{
                        req.flash('error_msg',"Erro Interno", err)
                        res.redirect('/admin/users')
                    
                    })   

                }else{ //Se campo é admin não estiver marcado ele grava como usuario comun
                    User.findOne({login: req.body.login}).then((users)=>{
                        if(users){
                            req.flash('error_msg', "Já existe um usuario com esse login")
                            res.redirect('/admin/users')
                        }else{
                            
                            const novoUsuario = new User({
                                nome : req.body.nome,
                                login: req.body.login,
                                setor: req.body.setor,
                                senha: req.body.senha1
                            })
                            bcrypt.genSalt(10, (erro, salt)=>{
                                bcrypt.hash(novoUsuario.senha,salt,(erro,hash)=>{
                                    if(erro){
                                        req.flash('error_msg',"Houve um erro ao salvar usuario")
                                        res.redirect('/admin/users')
                                    }
                                    novoUsuario.senha = hash
                                    novoUsuario.save().then(()=>{
                                        req.flash('success_msg',"Usuario Cadastrado com sucesso")
                                        res.redirect('/admin/users')
                                    }).catch((err)=>{
                                        req.flash('error_msg',"Erro ao criar usuario")
                                        res.redirect('/admin/users')
                                    })
                                })
                            })    
                        }    
                    }).catch((err)=>{
                        req.flash('error_msg',"Erro Interno", err)
                        res.redirect('admin/users')
                    
                    })
                }  
            }

    })

    router.post('/users/dell_user',(req,res)=>{
        if(req.body.ident == undefined){
            req.flash('error_msg',"Nenhum Usuario Selecionado para exclusão")
            res.redirect('/admin/pdvs')
           }else{       
               var query = {"_id":{$in:req.body.ident}}       
                   User.deleteMany(query).then(()=>{
                       req.flash('success_msg',"Usuarios selecionados Excluidos com sucesso")
                       res.redirect('/admin/users')
                   }).catch((err)=>{
                       req.flash('error_msg',"Não foi encontrados usuarios com os parametros informados")
                       res.redirect('/admin/users')
                   })
           }
    })

module.exports = router