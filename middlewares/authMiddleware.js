// authMiddleware.js

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Faça login para acessar esta página.');
    res.redirect('/');
};
