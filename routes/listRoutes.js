// routes/listRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // <-- Importar el middleware
const ListItem = require('../models/ListItem'); // <-- Importar el modelo

// ----------------------------------------------------
// A. Ruta de CREAR (POST /api/list)
// Protegida: REQUIERE un token JWT
// ----------------------------------------------------
router.post('/', auth, async (req, res) => {
    try {
        const { itemId, itemType, title, status } = req.body;

        // 1. Verificar si el ítem ya existe en la lista del usuario
        const existingItem = await ListItem.findOne({
            user: req.user.id, // ID del usuario viene del token (auth middleware)
            itemId,
            itemType,
        });

        if (existingItem) {
            return res.status(400).json({ msg: 'Este ítem ya está en tu lista.' });
        }

        // 2. Crear un nuevo ítem
        const newItem = new ListItem({
            user: req.user.id,
            itemId,
            itemType,
            title,
            status,
        });

        const listItem = await newItem.save();
        
        // 201 Created
        res.status(201).json(listItem); 

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al crear ítem de lista');
    }
});


// Exportar el router
module.exports = router;