if(process.env.NODE_env !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const MongoStore = require('connect-mongo');

const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');
const groundRoutes = require('./Routes/playground');
const reviewRoutes = require('./Routes/reviews');
const userRoutes = require('./Routes/users');

const DBurl = process.env.URL || 'mongodb://localhost:27017/Project';
mongoose.connect(DBurl)
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err);
})

app.engine('ejs',ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'pleasedontreadmysecret';

const store = MongoStore.create({
    mongoUrl: DBurl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function(e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly: true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.get('/', (req,res)=>{
    res.render('playground/Home');
});

app.use('/', userRoutes);
app.use('/:sport/', groundRoutes);
app.use('/:sport/:id/reviews', reviewRoutes);

app.all('*', (req,res,next)=>{
    next(new ExpressError("Page not found", 404));
})

app.use((err,req,res,next) => {
    if(!err.message){
        err.message = "Oops an unknown error";
    }
    res.render('error.ejs',{err});
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})