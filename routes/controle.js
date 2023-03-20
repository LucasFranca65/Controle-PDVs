const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('controle/painel_controle')
})

router.get('/retorno_pdv',(req,res)=>{
    res.send("rota de retorno dos PDVs")
})

router.get('/saida_pdv',(req,res)=>{
    res.send("rota de saida dos PDVs")
})

module.exports = router