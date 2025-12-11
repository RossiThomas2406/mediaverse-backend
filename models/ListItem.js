// models/ListItem.js

const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
    // 1. Enlace al Usuario (CRUCIAL para la Autorización)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true,
    },
    // 2. Información del Item de la API Externa (ej. TMDb)
    itemId: { // ID único del item en la API externa
        type: String,
        required: true,
    },
    itemType: { // Ej: 'movie', 'game', 'book'
        type: String,
        required: true,
        enum: ['movie', 'game', 'book', 'other'],
    },
    // 3. Datos Personalizados del Usuario (CRUD)
    title: { // Guardamos el título para mostrarlo rápidamente
        type: String,
        required: true,
    },
    status: { // El estado del item para el usuario
        type: String,
        required: true,
        default: 'Pendiente',
        enum: ['Pendiente', 'Visto', 'En progreso', 'Favorito'],
    },
    notes: { // Notas personalizadas
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ListItem', ListItemSchema);