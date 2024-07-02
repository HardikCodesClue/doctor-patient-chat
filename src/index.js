import express from 'express';
const app = express();
import { envConfig } from '../config/env.js';
import dbConnection from '../database/db.connection.js';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRouter from '../routes/auth.routes.js';
import dashboardRouter from '../routes/dashboard.routes.js';
import {requireLogin} from '../middlewares/authguard.js';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = envConfig.NODE_PORT;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Configure session middleware
app.use(session({
  secret: envConfig.AUTH_SECRET, // Replace with a random string (used to sign the session ID cookie)
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 day (cookie expiration time)
  }
}));

app.use('/auth', authRouter);
app.use('/',requireLogin, dashboardRouter);

dbConnection();

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});