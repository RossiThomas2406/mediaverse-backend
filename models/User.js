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
UserSchema.pre('save', function (next) { // <--- ELIMINAMOS 'async' DE AQUÍ
    const user = this;

    // Si la contraseña no fue modificada, pasa al siguiente middleware/guardado
    if (!user.isModified('password')) {
        return next();
    }
    
    // Usamos bcrypt.genSalt/hash con callbacks/promesas, que es más seguro en este hook
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err); // Si hay error en salt, lo pasamos a Mongoose
        
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err); // Si hay error en hash, lo pasamos a Mongoose
            
            user.password = hash;
            next(); // Continuamos la operación SÓLO cuando el hash ha terminado
        });
    });
});

module.exports = mongoose.model('User', UserSchema);