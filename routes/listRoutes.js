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

// ----------------------------------------------------
// B. Ruta de LEER (GET /api/list)
// Trae todos los ítems de lista PERTENECIENTES al usuario autenticado.
// ----------------------------------------------------
router.get('/', auth, async (req, res) => {
    try {
        // req.user.id viene del token, lo usamos para filtrar.
        const listItems = await ListItem.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.json(listItems);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al obtener la lista');
    }
});

// ----------------------------------------------------
// C. Ruta de ACTUALIZAR (PUT /api/list/:id)
// Actualiza el estado (status) o la calificación de un ítem específico.
// ----------------------------------------------------
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        // 1. Encontrar el ítem por ID y por usuario
        let item = await ListItem.findOne({
            _id: req.params.id, 
            user: req.user.id // CRÍTICO: Solo el dueño puede editar
        });

        if (!item) {
            return res.status(404).json({ msg: 'Ítem no encontrado o no pertenece a este usuario' });
        }
        
        // 2. Aplicar los cambios
        if (status) item.status = status;

        // 3. Guardar y responder
        await item.save();
        res.json(item);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al actualizar el ítem');
    }
});

// ----------------------------------------------------
// D. Ruta de ELIMINAR (DELETE /api/list/:id)
// Elimina un ítem específico de la lista.
// ----------------------------------------------------
router.delete('/:id', auth, async (req, res) => {
    try {
        // 1. Encontrar y Eliminar el ítem por ID y por usuario
        const result = await ListItem.deleteOne({
            _id: req.params.id, 
            user: req.user.id // CRÍTICO: Solo el dueño puede eliminar
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Ítem no encontrado o no autorizado' });
        }

        res.json({ msg: 'Ítem eliminado con éxito' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor al eliminar el ítem');
    }
});

// Exportar el router
module.exports = router;