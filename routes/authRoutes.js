// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importamos el modelo User
const bcrypt = require('bcryptjs');     // Para comparar el hash de la contraseña
const jwt = require('jsonwebtoken');    // Para crear y firmar el Token

// ----------------------------------------------------
// A. Ruta de Registro (POST /api/auth/register)
// ----------------------------------------------------
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // 1. Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }

        // 2. HASHEAR LA CONTRASEÑA AQUÍ (CÓDIGO NUEVO Y CRÍTICO)
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 3. Crear una nueva instancia con la contraseña YA HASHEADA
        user = new User({ 
            email, 
            password: hashedPassword, // <-- USAMOS EL HASH
            username 
        });

        await user.save(); // Guarda el usuario hasheado en MongoDB

        // 4. Generar token y responder (sin cambios)
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, userId: user.id }); 
            }
        );

    } catch (error) {
        console.error("Error en /register:", error.message);
        res.status(500).send('Error del servidor al registrar');
    }
});

// ----------------------------------------------------
// B. Ruta de Login (POST /api/auth/login)
// ----------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario, incluyendo la contraseña para poder compararla
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña ingresada con el hash guardado
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // 3. Crear el JSON Web Token (JWT)
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al iniciar sesión');
    }
});

module.exports = router;