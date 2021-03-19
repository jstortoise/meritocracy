const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const engines = require('consolidate');

const db = require('./models');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const baseRoutes = require('./routes/base');
const clientRoutes = require('./routes/client');
const commentRoutes = require('./routes/comment');
const certRoutes = require('./routes/cert');
const legacyRoutes = require('./routes/legacy');
const socialRoutes = require('./routes/social');
const notificationRoutes = require('./routes/notification');
const voteRoutes = require('./routes/vote');
const tipRoutes = require('./routes/tip');
const badgeRoutes = require('./routes/badge');
const ratingRoutes = require('./routes/rating');
const fileRoutes = require('./routes/file');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');

db.sequelize.authenticate().then(() => {
    db.sequelize.sync();
    console.log('Database connected');
}).catch(err => {
    console.log('Error: ' + err);
});

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-timebase, Authorization, x-token, appkey"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// enable html
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', engines.mustache);

// Routes
app.use('/auth', authRoutes);
app.use('/base', baseRoutes);
app.use('/client', clientRoutes);
app.use('/comment', commentRoutes);
app.use('/cert', certRoutes);
app.use('/legacy', legacyRoutes);
app.use('/social', socialRoutes);
app.use('/notification', notificationRoutes);
app.use('/vote', voteRoutes);
app.use('/tip', tipRoutes);
app.use('/badge', badgeRoutes);
app.use('/user', userRoutes);
app.use('/rating', ratingRoutes);
app.use('/file', fileRoutes);
app.use('/wallet', walletRoutes);
app.use('/transaction', transactionRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;