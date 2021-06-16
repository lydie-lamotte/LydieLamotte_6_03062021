const bcrypt = require('bcrypt'); //import outil de cryptage
const jwt = require('jsonwebtoken'); //import outil de chiffrage
const User = require('../models/user'); //import schema user
const password = require ('../models/password_validator'); //import schema MdP
const email = require ('email-validator'); // importe module email-validator
const MaskData = require('../node_modules/maskdata'); //importe module masquage

// Methode de masquage
const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 0,
    unmaskedEndCharactersAfterAt: 0,
    maskAtTheRate: false
}


// Inscription
exports.signup = (req, res, next) => {
    // valider le mot de passe
    const isValid = password.validate(req.body.password);
    if (!isValid) {
        res.status(400).json({ error : "mot de passe non valide" });
    }
    //valider l'email
    const isEmailValid = email.validate('test@email.com');
    if (!isEmailValid) {
        res.status(400).json({ error : "email non valide" });
    }
    // crypte le mot de passe
    bcrypt.hash(req.body.password, 10) //création d'un MdP crypté salé 10 fois
        .then(hash => {
            const user = new User({ // Créé l'email et le Mdp crypté
                email: MaskData.maskEmail2(req.body.email, emailMask2Options),
                password: hash
            });
            user.save() // Enregistre dans la base de données 
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
// Connexion
exports.login = (req, res, next) => {
    User.findOne({ email: MaskData.maskEmail2(req.body.email, emailMask2Options) }) // récupère l'email créé
        .then(user => {
        if (!user) {  
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // compare le MdP avec le hash
            .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign( // encoder un nouveau token
                    { userId: user._id },
                    process.env.JWT_KEY,
                    { expiresIn: '24h' } // expire au bout de 24h
                )
            });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};