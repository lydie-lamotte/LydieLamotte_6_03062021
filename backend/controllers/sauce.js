const Sauce = require('../models/sauce'); // import modele
const fs = require('fs'); // import file system
const sauce = require('../models/sauce');

// Création de la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //récupère l'objet sauce
    delete sauceObject._id; //supprime id de l'objet sauce du frontend
    const sauce = new Sauce({ //Créé la nouvelle sauce
        ...sauceObject,   
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //http + host + image
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce crée!'}))
        .catch(error => res.status(400).json({ error}));    
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // si l'objet existe
        {
        ...JSON.parse(req.body.sauce), // Récupère l'objet sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// on traite la nouvelle image
        } : { ...req.body };  // sinon on traite simplement l'objet 
    Sauce.updateOne({_id: req.params.id},  { ...sauceObject, _id: req.params.id }) // modifie son identifiant
        .then(() => res.status(200).json({ message: 'Sauce modifiée!'}))
        .catch(error => res.status(400).json({ error: error}));        
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) // Récupère l'object avec l'id de la requête
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // Extrait le nom du fichier
            fs.unlink(`images/${filename}`, () => { // Supprime le fichier sélectionné
                Sauce.deleteOne({_id: req.params.id}) // Supprime l'objet
                    .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
                    .catch(error => res.status(400).json({ error}));
            })
        })
        .catch(error => res.status(500).json({ error}));    
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error}));
};

exports.likeSauce = (req,res,next) => {
    const sauceObject = req.body;
    const userId = sauceObject.userId;
    const like = sauceObject.like;

    Sauce.findOne({ _id: req.params.id})
        .then(sauce => { 
            switch ( like) {
                case 1: 
                    sauce.updateOne(
                        {_id: req.params.id},
                        {$push: {usersLiked: userId}, $inc: {like: + 1}}) // ajoute id dans le tableau des usersLiked et incrémente 1 like                        
                    .then(() => res.status(201).json({ message: 'sauce aimée'})) 
                    .catch(error => res.status(400).json({error}));
                    break;    
                case -1:
                    sauce.updateOne(
                        {_id: req.params.id},
                        {$push: {usersDisliked: userId}, $inc: {dislike: + 1}})                        
                    .then(() => res.status(201).json({ message: 'sauce pas aimée'})) //ajoute id dans le tableau des usersDisliked et incrémente 1 dislike                 
                    .catch(error => res.status(400).json({error}));
                    break; 
                case 0:
                    sauce.updateOne(
                        {_id: req.params.id},
                        {$pull: {usersDisliked: userId,usersLiked: userId}, $inc: {like: -1, dislike: -1}}) //Retire id du tableau et on retire le like ou le dislike
                    .then(() => res.status(201).json({ message: 'pas de préférence'}))
                    .catch(error => res.status(400).json({error}));                               
            }
        })
        .catch(error => res.status(500).json({error}));
}