const maxAge = 60 * 60 * 1000;


module.exports = {
    login_post: async (req, res, next) => {
        if (!req.user) {
            return res.redirect('/login');
        }
        const response = await fetch('https://localhost:8888/token', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({user_id: req.user.id})
        })
        console.log('fetch success')
        const token = await response.json();
        res.cookie('jwt', token, {maxAge: maxAge });
        res.redirect('/');
    }
}