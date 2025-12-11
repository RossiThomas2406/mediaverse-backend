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

// 4. Middleware: Cifrar la Contraseña antes de guardarla
// Este código se ejecuta SIEMPRE antes de que Mongoose guarde o actualice un usuario
UserSchema.pre('save', async function (next) {
    // Si la contraseña no fue modificada, pasa al siguiente middleware/guardado
    if (!this.isModified('password')) {
        return next();
    }
    
    // 1. Generar el 'salt' (el factor aleatorio para el hash)
    const salt = await bcrypt.genSalt(10); 
    
    // 2. Hashear la contraseña usando el salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Continúa con la operación de guardado
    next();
});

module.exports = mongoose.model('User', UserSchema);