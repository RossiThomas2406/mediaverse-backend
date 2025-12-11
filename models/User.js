// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Necesario para hashear contraseñas

const UserSchema = new mongoose.Schema({
    // 1. Campo de Email (Obligatorio y Único)
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true, // No puede haber dos usuarios con el mismo email
        lowercase: true,
        trim: true,
    },
    // 2. Campo de Contraseña (Obligatorio)
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        select: false, // Por defecto, la contraseña NO se devuelve en las consultas (seguridad)
    },
    // 3. Otros campos
    username: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);