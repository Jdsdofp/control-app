const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');


// Função para exibir o formulário de registro
exports.showRegisterForm = (req, res) => {
    res.render('register'); // Assumindo que você tem um arquivo register.ejs na pasta views
};


exports.registerUser = async (req, res) => {

    // Lógica de verificação de usuário existente e registro de usuário
    const { name, email, password, confirmPassword, team, profile } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !password || !confirmPassword || !team || !profile) {
        req.flash('error', 'Por favor, preencha todos os campos.');
        return res.redirect('/register');
    }

    // Verifica se a senha e a confirmação de senha coincidem
    if (password !== confirmPassword) {
        req.flash('error', 'As senhas não coincidem.');
        return res.redirect('/register');
    }

    try {
        // Verifica se o email já está cadastrado
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash('error', 'Este email já está em uso.');
            return res.redirect('/register');
        }

        // Verifica se o nome já está cadastrado
        const existingName = await User.findOne({ name });
        if (existingName) {
            req.flash('error', 'Este nome já está em uso.');
            return res.redirect('/register');
        }

        // Se não houver nenhum conflito, cria um novo usuário
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            team,
            profile,
        });

        await newUser.save();
        req.flash('success', 'Usuário registrado com sucesso.');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Ocorreu um erro ao registrar o usuário. Por favor, tente novamente mais tarde.');
        res.redirect('/register');
    }
};

exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', 'Email ou senha incorretos');
            return res.redirect('/');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Login realizado com sucesso.');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
};


// userController.js
exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Ocorreu um erro ao fazer logout. Por favor, tente novamente.');
            return res.redirect('/');
        }
        req.flash('success', 'Logout realizado com sucesso.');
        return res.redirect('/');
    });
};


exports.dashboard = (req, res) => {
    // Aqui você pode adicionar a lógica para renderizar o painel do usuário
    return res.render('dashboard', { user: req.user });
};
