const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');


// Função para exibir o formulário de registro
exports.showRegisterForm = (req, res) => {
    res.render('page/register'); // Assumindo que você tem um arquivo register.ejs na pasta views
};


exports.registerUser = async (req, res) => {
    // Lógica de verificação de usuário existente e registro de usuário
    const { name, email, password, team, profile } = req.body;
    
    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !password || !team || !profile) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
    }

    try {
        // Verifica se o email já está cadastrado
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Este email já está em uso.' });
        }

        // Verifica se o nome já está cadastrado
        const existingName = await User.findOne({ name });
        if (existingName) {
            return res.status(400).json({ error: 'Este nome já está em uso.' });
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
        return res.status(200).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao registrar o usuário. Por favor, tente novamente mais tarde.' });
    }
};


exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Ocorreu um erro durante o login.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ocorreu um erro durante o login.' });
            }
            return res.status(200).json({ success: 'Login realizado com sucesso.' });
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
    return res.render('page/dashboard', { user: req.user });
};
