
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token manquant' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
return res.status(403).json({ message: 'Token invalide' });
        }

        req.user = decoded; // Sauvegarde des données de l'utilisateur dans la requête
        next();
    });
};

module.exports = authMiddleware;

    