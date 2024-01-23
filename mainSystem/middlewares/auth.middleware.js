function isAuthenticated(req, res, next) {
    // console.log('req.user', req.user);
    if (req.user && req.user[0]) {
        return next()
    }
    res.redirect('/login')
}

function isNotAuthenticated(req, res, next) {
    if (req.user && req.user[0]) {
        return res.redirect('/')
    }
    next();
}

module.exports = {isAuthenticated, isNotAuthenticated}