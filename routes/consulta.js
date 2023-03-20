const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("Painel Inicial das consultas")
})

router.get('/pdvs_no_periodo',(req,res)=>{
    res.send("PDV por periodo")
})

router.get('/usuario_no_periodo',(req,res)=>{
    res.send("PDV no periodo")
})

router.get('/veiculo_no_periodo',(req,res)=>{
    res.send("PDV no periodo")
})


module.exports = router