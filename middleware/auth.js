// middleware/auth.js

const jwt = require('jsonwebtoken');

// Exportamos la función middleware que toma req, res, y next
module.exports = function (req, res, next) {
    // 1. Obtener el token del encabezado de la petición
    // En el Front-End, se enviará: Headers: {'x-auth-token': 'el_token_aqui'}
    const token = req.header('x-auth-token'); 

    // 2. Verificar si NO hay token
    if (!token) {
        // Código 401: No autorizado (Unauthorized). El usuario no ha iniciado sesión.
        return res.status(401).json({ msg: 'Acceso denegado. No se proporcionó un token.' });
    }

    // 3. Verificar el token
    try {
        // Verifica el token usando la clave secreta del .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        // El token es válido. Extraemos el ID del usuario del payload decodificado.
        req.userId = decoded.user.id; 
        
        // Continuar con la siguiente función (la ruta final, ej: crear una lista)
        next();

    } catch (err) {
        // Si el token es inválido o ha expirado
        res.status(401).json({ msg: 'Token no válido o expirado.' });
    }
};