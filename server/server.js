var express = require('express');
var listController = require('./lists/listController.js');
var itemController = require('./lists/itemController.js');
var budgetController = require('./budget/budgetController.js');
var aisleController = require('./lists/aisleController.js');
var firebaseAuth = require('./middleware/authFirebase.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/savagetadpole');

app.use(session({
  secret: 'savage tadpole',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  var ts = new Date();
  console.log(req.url + ' - ' + req.method);
  console.log('Time:', ts);
  next();
});

// STATIC FILE SERVING
app.use(express.static(__dirname + '/../public'));

//CORS
app.use(cors());

// DATABASE ACCESS ROUTES
app.use('/api/*', firebaseAuth.validateUserToken);

app.get('/api/list', listController.getList);

app.use('/api/item/add', itemController.createNewItem);
app.post('/api/item/add', listController.addItemToList);
app.get('/api/item/autocomplete/:name', itemController.autocomplete);

app.use('/api/item/update', itemController.createNewItem);
app.post('/api/item/update', listController.updateItem);

// app.use('/api/budget/update', itemController.createBudget);  // initialize the budget to 0 at creation
app.get('/api/budget/', budgetController.getCurrentBudget);
app.post('/api/budget/update', budgetController.updateBudget);

app.delete('/api/item/delete', listController.deleteItemFromList);
app.post('/api/item/archive', listController.addItemToArchive);

app.get('/api/aisle', aisleController);

// AUTHENTICATION ROUTES
app.use('/auth/register', firebaseAuth.createUser);
app.post('/auth/register', firebaseAuth.signIn);

app.post('/auth/login', firebaseAuth.signIn);

app.get('/auth/token', firebaseAuth.validateUserToken, function(req, res) {
  res.send(true);
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Smart Shopping listening at http://localhost:%s', port);
});
