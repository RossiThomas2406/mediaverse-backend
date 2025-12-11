// models/ListItem.js

const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
    // Referencia al usuario (CRUCIAL para saber a quién pertenece el ítem)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Hace referencia al modelo 'User'
        required: true,
    },
    // Información del ítem de TMDb
    itemId: { // ID original de la película/serie en TMDb
        type: String,
        required: true,
    },
    itemType: { // 'movie' o 'tv'
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    // Opcional: estado de seguimiento
    status: {
        type: String,
        enum: ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'],
        default: 'plan-to-watch',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ListItem', ListItemSchema);