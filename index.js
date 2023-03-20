//Carregando modulos
    const express = require('express')    
    const mongoose = require('mongoose')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
//Variaveis Globais
    const PORT = 1001
    const app = express()
//Grupos de Rotas
    const admin = require('./routes/admin')
    const consulta = require('./routes/consulta')
    const controle = require('./routes/controle')

//Configurações
    ///Sessão
    app.use(session({
        secret: "keyjhglas@@dghajkhgsdfjdsf$#@%6jkbdsfhjbfgfgdf564864d8f6g4fdglnaSD@$#@$%¨)i4KYh**sjkdfhwoeu&&&hxweubx",
        resave: true,
        saveUninitialized: true
    }))
    //app.use(passport.initialize())
    //app.use(passport.session())
    app.use(flash())
//Midleware das sessões
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        //res.locals.error = req.flash("error")
        //res.locals.user = req.user || null;
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

    app.get('/',(req,res)=>{
        res.render('index')
    })


//Outros
app.listen(PORT,()=>{
    console.log("Servidor rodando na porta:,  ",PORT)
})