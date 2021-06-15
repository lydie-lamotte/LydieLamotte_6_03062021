const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupère le token dans le header sans le "bearer"
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); // Vérifie le Token
        const userId = decodedToken.userId; // Vérifie user ID
        if (req.body.userId && req.body.userId !== userId) { // Vérifie la correspondance des user Id
        throw 'Invalid user ID';
        } else {
        next();
        }
    } catch {
        res.status(401).json({
        error: new Error('Requête invalide!')
        });
    }
};