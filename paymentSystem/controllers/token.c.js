const jwt = require('jsonwebtoken')

module.exports = {
    signJWT: (req, res, next) =>  {
        const user_id = req.body.user_id;
        const token = jwt.sign({user_id}, 'mySecretKey')
        // console.log(token);
        res.json(token);
    }
}