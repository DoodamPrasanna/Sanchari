if (process.env.NODE_ENV != "production") {
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
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const appReviewRoutes = require("./routes/appReviews");
const destinationRoutes = require("./routes/destinations");
const flash = require('connect-flash');

const dbUrl = process.env.DB_URL || process.env.ATLASDB_URL;

// ---------------- MONGO SESSION STORE ----------------
const session = require("express-session");
const MongoStore = require("connect-mongo");

console.log("Resolved DB URL =", dbUrl);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", function (e) {
    console.error("Session store error", e);
});

app.use(session({
    store: store,
    secret: process.env.SECRET || "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));

// ---------------- FLASH ----------------
app.use(flash());

// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------------- GLOBAL VARIABLES ----------------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ---------------- APP CONFIG ----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engine);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

// ---------------- DB CONNECT ----------------
console.log("DB URL exists:", !!dbUrl);

async function main() {
    if (!dbUrl) {
        console.error("❌ No database URL provided. Set DB_URL or ATLASDB_URL in your environment.");
        process.exit(1);
    }
    try {
        await mongoose.connect(dbUrl);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.log("❌ MongoDB Connection Failed");
        console.log(err.message);
        process.exit(1);
    }
}

main();

// ---------------- ROUTES ----------------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/appreviews", appReviewRoutes);
app.use("/destinations", destinationRoutes);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ---------------- ERROR HANDLING ----------------
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("Listings/errors.ejs", { message });
});

// ---------------- SERVER ----------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});














