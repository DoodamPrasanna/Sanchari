if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const appReviewRoutes = require("./routes/appreviews");
const destinationRoutes = require("./routes/destinations");

const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currUser = req.user;
    next();
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.json());

const dbUrl = process.env.ATLASDB_URL ;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    })

const port = 3000;

app.listen(port, () => {
    console.log(`App is listening on the port ${port}`);
})
      
//Listings & Reviews
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/appreviews", appReviewRoutes);
app.use("/destinations", destinationRoutes);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})

// All routes below  
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("Listings/errors.ejs", { message });
});














