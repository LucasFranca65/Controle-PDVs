const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')
const Usuario = mongoose.model('users')

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'login', passwordField: 'senha'},(login, senha, done)=>{
        Usuario.findOne({login: login}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: "Conta de usuario não existe"})
            }
            bcrypt.compare(senha, usuario.senha, (erro, success)=>{
                if(success){
                    return done(null, usuario)
                }else{
                    return done(null, false,{message: 'Senha Incorreta'})
                }
            })
        })
    }))
    passport.serializeUser((usuario, done)=>{
        done(null, usuario.id)
    })
    passport.deserializeUser((id, done)=>{
        Usuario.findById(id, (err, usuario)=>{
            done(err,usuario)
        })
    })
}