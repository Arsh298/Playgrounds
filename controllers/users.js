const User = require('../models/user');

module.exports.registerForm = async (req,res) => {
    res.render('users/register');
};

module.exports.register = async(req,res,next)=>{
    try {
        const {email,username,password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash('success', "Registered Successfully");
            res.redirect('/');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.loginForm = (req,res)=>{
    res.render('users/login');
};

module.exports.login = (req,res)=>{
    const {username} = req.body;
    req.flash('success', `Welcome Back ${username}`);
    redirectUrl = res.locals.return || '/';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};