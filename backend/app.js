const express = require('express');
const bodyParser = require('body-parser'); //import outil traite les requêtes post du front
const mongoose = require('mongoose');//import base de données
const path = require('path');
const sauceRoutes = require('./routes/sauce'); //import routers sauce
const userRoutes = require('./routes/user'); //import routers user
const helmet = require ('helmet'); //import helmet qui sécurise les en-tête Http
require('dotenv').config();

//on se connecte a mongoose
mongoose.connect('mongodb+srv://'+ process.env.USER_DB +':'+ process.env.PASSWORD_DB +'@'+ process.env.CLUSTER_DB +'.b0a4r.mongodb.net/'+ process.env.DATABASE_DB +'?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// permet aux 2 ports de communiquer
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

app.use(helmet());


module.exports = app;