const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');
const configRoutes = require("./routes/configRoutes")
const app = express();

// Configurações do Express
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://dgmap:UvAZYbnl66Ll2LjE@mpgd.oauqahr.mongodb.net/?retryWrites=true&w=majority&appName=mpgd')
    .then(() => {
        console.log('Conectado ao MongoDB');
        app.listen(3000, () => {
            console.log('Servidor iniciado na porta 3000');
        });
    })
    .catch(err => console.error(err));


// Configurações do express-session
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false
}));

// Configurações do Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Configurações do connect-flash
app.use(flash());

// Middleware para tornar as mensagens flash acessíveis em todas as views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Rotas da aplicação
app.use('/', userRoutes);
app.use('/config', configRoutes);

// Rota raiz para a página de login
app.get('/', (req, res) => {
    if(req.user){
        res.redirect("dashboard")
    }
    res.render('page/login', { 
        message: req.flash('error'),
        success: req.flash('success')
    });
});


// Página de erro 404
app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});




