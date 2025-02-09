const User = require("../models/user");



module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

//signup
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Airhub!");
            res.redirect("/listings");
        });
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }
};


//renderLogin
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


 module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to  Airhub ! You are logged-in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.loggedOut = (req, res, next) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "you are logged Out now!")
        res.redirect("/listings");
    });
}