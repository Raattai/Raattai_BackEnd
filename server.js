const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const cors = require('cors');
const expressMessages = require('express-messages');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Connect flash middleware
app.use(flash());

require('./config/passport')(passport); // Assuming your Passport configuration is in 'config/passport.js'

// ... other server setup code ...

app.use(passport.initialize());
app.use(passport.session());

// Express messages middleware
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// CORS middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Global variables middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
const products = require('./routes/product');
const cart = require('./routes/cart');
const users = require('./routes/user');
const adminProducts = require('./routes/admin_products.js');

app.use('/admin/products', adminProducts);
app.use('/client', products);
app.use('/user/cart', cart);
app.use('/user', users);

// Server start
const port = 3000;
app.listen(port, function () {
  console.log('Server is running on port ' + port);
});
