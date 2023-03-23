const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../models/User')
const Usuario = mongoose.model('users')
const {lOgado} = require('../helpers/eAdmin')
const { serializeUser } = require('passport')

router.get('/',lOgado,(req,res)=>{
    res.redirect('/')      
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/controle',
        failureRedirect: '/',
        failureFlash: true
    })(req,res,next)
})

router.get('/logout',lOgado,(req,res,next)=>{
    req.logout((err)=>{
        if(err){ 
            return next(err)
        }
        req.flash('success_msg',"Desconectado com sucesso")
        res.redirect('/')
    })
})

//Rota de reset de senha de usuario

router.get('/reset_pass',lOgado,(req,res)=>{
    res.render('user/reset_key')  
})

router.post('/reset_pass/reset',lOgado,(req,res)=>{
    
   Usuario.findOne({_id: req.body.user_id}).then((usuario)=>{

        var error = []

        if(!req.body.senha1 || typeof req.body.senha1 == undefined || req.body.senha1 == null){
            error.push({texto:"Senha Invalida"})
        }
        if(req.body.senha1.length < 6){
            error.push({texto:"Senha Muito Curta, minimo 6 caracteres"})
        }
        if(req.body.senha1 != req.body.senha2){
            error.push({texto:"As Senhas não conferem"})
        }if(error.length > 0) {
            res.render("user/reset_key",{error: error})
        }else{

            usuario.senha = req.body.senha1
            bcrypt.genSalt(10, (erro, salt)=>{
                bcrypt.hash(usuario.senha, salt,(erro,hash)=>{
                    if(erro){
                        req.flash('error_msg',"Houve um erro Interno "+erro)
                        res.redirect('/users/reset_pass')
                    }
                    usuario.senha = hash
                    usuario.save().then(()=>{
                        req.flash('success_msg',"Senha alterada com sucesso")
                        res.redirect('/controle')
                    }).catch((err)=>{
                        req.flash('error_msg',"Erro ao alterar senha",err)
                        res.redirect('/users/reset_pass')
                    })
                })
            })


        }       

   }).catch((err)=>{
    req.flash('erro_msg',"Não foi possivel carregar informações da conta",err)
    res.redirect('/') 
   })
})

module.exports = router