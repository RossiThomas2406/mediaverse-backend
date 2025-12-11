// routes/listRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Importar el middleware de protección
const ListItem = require('../models/ListItem'); 

// ----------------------------------------------------
// Middleware: Todas las rutas en este archivo requieren autenticación
// ----------------------------------------------------
// router.use(authMiddleware); // Esto se podría hacer, pero lo dejaremos explícito en cada ruta por claridad.

// 1. CREAR un Item (POST /api/list)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newItem = new ListItem({
            userId: req.userId, // Obtiene el ID del usuario del token
            ...req.body, // Recibe itemId, itemType, title, status, etc.
        });

        const item = await newItem.save();
        res.status(201).json(item);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al crear item');
    }
});

// 2. LEER todos los Items del Usuario (GET /api/list)
router.get('/', authMiddleware, async (req, res) => {
    try {
        // ¡Sólo devuelve los items que pertenecen al usuario autenticado! (Autorización)
        const items = await ListItem.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(items);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al obtener listas');
    }
});

// 3. ACTUALIZAR un Item (PUT /api/list/:id)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Buscar y actualizar, asegurando que el item pertenezca al usuario autenticado
        let item = await ListItem.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId }, 
            { $set: req.body, updatedAt: Date.now() },   
            { new: true }                               
        );

        if (!item) {
            return res.status(404).json({ msg: 'Item no encontrado o no autorizado' });
        }

        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al actualizar');
    }
});

// 4. ELIMINAR un Item (DELETE /api/list/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Buscar y eliminar, asegurando que el item pertenezca al usuario autenticado
        const item = await ListItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!item) {
            return res.status(404).json({ msg: 'Item no encontrado o no autorizado' });
        }

        res.json({ msg: 'Item eliminado correctamente' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al eliminar');
    }
});

module.exports = router;