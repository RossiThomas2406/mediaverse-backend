// middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Obtener el token del encabezado (Header)
    // El Front-End lo envía como 'x-auth-token'
    const token = req.header('x-auth-token'); 

    // 2. Verificar si el token existe
    if (!token) {
        // 401 Unauthorized: El usuario no tiene permiso (no hay token)
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // 3. Verificar el token
    try {
        // jwt.verify(token, secreto, callback)
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        // 4. Adjuntar el ID del usuario decodificado a la petición (req)
        // Esto permite que la ruta de lista sepa qué usuario está haciendo la solicitud.
        req.user = decoded.user;
        
        // 5. Continuar con la ruta original
        next();

    } catch (err) {
        // Si el token no es válido o ha expirado
        res.status(401).json({ msg: 'Token no es válido' });
    }
};