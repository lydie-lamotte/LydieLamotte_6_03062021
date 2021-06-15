const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is().min(8)                                    // Minimum 8 charactères
.is().max(100)                                  // Maximum 100 charactères
.has().uppercase()                              // doit contenir des minuscules
.has().lowercase()                              // doit contenir des majuscules
.has().digits(2)                                // doit contenir au moins 2 symboles
.has().not().spaces()                           // Pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // mot de passe interdit


module.exports = schema;