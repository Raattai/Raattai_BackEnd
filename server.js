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
const Category = require('./models/category');
const Stock = require('./models/stock');
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
app.use(express.static(path.join(__dirname, 'web')));

// Express session middleware
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, 
    },
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
app.use(cors());
app.use('/assets', express.static('web/assets'));
//get category model

Category.find({}).maxTimeMS(50000) // Adjust timeout as needed
  .then(categories => {
    app.locals.categories = categories;
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });

  //Stock

Stock.find({}).maxTimeMS(50000) // Adjust timeout as needed
.then(stocks => {
  app.locals.stock = stocks;
  console.log(stocks);
})
.catch(err => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});


// Global variables middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
const products = require('./routes/product');
const cart = require('./routes/cart');
const users = require('./routes/user');
const pages = require('./routes/pages');
const adminProducts = require('./routes/admin_products.js');
const adminBlog = require('./routes/admin_blog.js');
const adminCategories = require('./routes/admin_category.js');
const adminService = require('./routes/admin_service.js');
const feedback = require('./routes/user_feedback.js');
const stock = require('./routes/admin_stock.js');


app.use('/admin/products', adminProducts);
app.use('/admin/stock', stock);
app.use('/admin/categories',adminCategories);
app.use('/admin/service',adminService);
app.use('/admin/blog', adminBlog);
app.use('/client', products);
app.use('/user/cart', cart);
app.use('/user', users);
app.use('/feedback', feedback);
app.use('/',pages);




// Server start
const port = 3000;
app.listen(port, function () {
  console.log('Server is running on port ' + port);
});
