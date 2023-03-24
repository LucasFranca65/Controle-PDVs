//Carregando modulos
    const express = require('express')    
    const mongoose = require('mongoose')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const moment = require('moment')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
    //Variaveis Globais
    const PORT = 1001
    const app = express()
//Grupos de Rotas
    const admin = require('./routes/admin')
    const consulta = require('./routes/consulta')
    const controle = require('./routes/controle')
    const users = require('./routes/users')

//MOngoose Models
    require('./models/System')
    const System = mongoose.model('systens')
    require('./models/User')
    const User = mongoose.model('users')
//Configuração de autenticação
    require('./config/alth')(passport)

//Configurações
    ///Sessão
    app.use(session({
        secret: "keyjhglas@@dghajkhgsdfjdsf$#@%6jkbdsfhjbfgfgdf564864d8f6g4fdglnaSD@$#@$%¨)i4KYh**sjkdfhwoeu&&&hxweubx",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
//Midleware das sessões
    app.use((req,res,next)=>{
        //variaveis globais
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next()
    })
    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main',runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
            }
        }))
        app.set('view engine','handlebars')   
    //Mongoose
        mongoose.set("strictQuery", true)
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/ControlePDVs').then(()=>{
            console.log("Conectado ao banco de dados com sucesso")
        }).catch((err)=>{
            console.log("Erro ao se conectar com o banco"+err)
        })
    //Arquivos estaticos
        app.use(express.static(path.join(__dirname,'public')))

//Rotas
    
    app.use('/admin',admin)
    app.use('/consulta',consulta)
    app.use('/controle',controle)
    app.use('/users',users)

    app.get('/',(req,res)=>{

        System.find().then((info)=>{

            //console.log(info.length)
            if(info.length == 0){
                
                const novoInfo = new System({
                    firt_conection: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                    version: "V1.1",
                    by: "Lucas Oliveira França"
                })

                novoInfo.save().then(()=>{
                    req.flash('success_msg',"Esse é seu Primeiro Acesso")
                }).catch((err)=>{
                    req.flash('error_msg',"Erro ao cadastrar primrio acesso")
                    res.redirect('/error')
                })

                
                const novoUsuario = new User({
                    nome : "Administrador",
                    login: "admin",
                    setor: "Tecnologia",
                    senha: "admin",
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
                            req.flash('success_msg',"Usuario Administrador Cadastrado com sucesso utilise Usuario : admin, Senha: admin no seu primeiro acesso, recomendamos alterar a senha")
                            res.redirect('/')
                        }).catch((err)=>{
                            req.flash('error_msg',"Erro ao criar usuario Administrador")
                            res.redirect('/error')
                        })
                    })
                })    
                }else{
                    
                    if(req.isAuthenticated()){
                        res.redirect('/controle');
                    }else{
                        res.render('index')
                    }
                    
                }  
        }).catch((err)=>{
            req.flash('error_msg',"Erro Interno", err)
            res.redirect('/error')                
        })

    })

    app.get('/error',(req,res)=>{
        res.render('404')
    })

    app.use((req,res,next)=>{
        req.flash('error_msg',"Algo deu errado, essa rota não existe")
        res.redirect('/error')
    })

//Outros
app.listen(PORT,()=>{
    console.log("Servidor rodando na porta:,  ",PORT)
})