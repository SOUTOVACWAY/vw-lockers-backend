const http = require('http'),
      path = require('path'),
      methods = require('methods'),
      express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cors = require('cors'),
      passport = require('passport'),
      errorhandler = require('errorhandler'),
      mongoose = require('mongoose'),
      autoIncrement = require('mongoose-auto-increment'),
      mailer = require('express-mailer');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// middlewares
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'conduit',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

if (!isProduction) {
  app.use(errorhandler());
}

// database
if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://vacway-dev:vacway-dev@localhost/vacway-dev');
  mongoose.set('debug', true);
}

autoIncrement.initialize(mongoose.connection);

require('./models/User');
require('./models/Machine');
require('./models/Incidence');
require('./models/Sector');
require('./models/Contract');
require('./models/Sale');
require('./models/Report');
require('./models/Customer');
require('./models/RemoteAction');
require('./models/Update');
require('./models/Shipment');
require('./models/AuditEntry');
require('./models/ShiftEntry');
require('./models/PromoterSale');

require('./config/passport');

app.use(require('./routes'));

// mailer
mailer.extend(app, {
  from: 'noreply@vacway.com',
  host: 'smtp.mail.eu-west-1.awsapps.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user: 'noreply@vacway.com',
    pass: 'stNawUfYA6xY8Qsu'
  }
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// error handling
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!isProduction) {
    console.log(err.stack);
  }

  res.status(err.status || 500);
  res.json({ message: err.message });
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on port ' + server.address().port);
});
