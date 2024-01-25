const jwt = require('jsonwebtoken')

module.exports = { 
    verifyJWT: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token);
        if (!token) {
            return res.sendStatus(401);
        }
        const decodedToken = await jwt.verify(token, 'mySecretKey');
        console.log(decodedToken);
        next()
    }
}