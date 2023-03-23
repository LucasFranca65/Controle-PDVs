module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == true){
            return next();
        }
        req.flash('error_msg',"Somente administradores")
        res.redirect('/controle')
    },
    lOgado: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg',"Faça Login")
        res.redirect('/')
    }
}

