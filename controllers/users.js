const User = require("../models/user.js");

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

module.exports.postSignup = async(req,res,next)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        return req.login(registeredUser, (err)=>{
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.getSignup = (req,res)=>{
    res.render('./users/signup.ejs');
};

module.exports.getLogin = (req,res)=>{
    res.render('./users/login.ejs');
};

module.exports.postLogin =  async (req,res)=>{
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
};

