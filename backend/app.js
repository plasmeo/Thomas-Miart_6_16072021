
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15*60*1000, //15 min
  max: 100 //100 req max / IP
});


//Connexion à MongoDB


mongoose.connect(process.env.DB_URL,
{ useNewUrlParser: true,
useUnifiedTopology: true})
.then(()=> console.log('Connexion à MongoDB réussie'))
.catch(()=> console.log('Connexion à MongoDB échouée'));

//Limite le nombre de requêtes pour la création/connexion
app.use("/api/auth" ,limiter);

app.use(helmet());

//Autorise la connexion depuis toute les adresses
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;