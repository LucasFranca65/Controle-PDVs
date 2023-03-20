const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("Painel Inicial dos administradores")
})

router.get('/pdvs',(req,res)=>{
    res.render('admin/adm_pdvs')
})

router.post('/add_pdv',(req,res)=>{
    console.log('adição de pdv')    
})




module.exports = router