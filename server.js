// server.js

// 1. Importar Módulos y Dependencias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Necesario para permitir peticiones desde el Front-End (React)

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// 2. Inicializar la Aplicación Express
const app = express();

// 3. Configurar Conexión a MongoDB
const connectDB = async () => {
    try {
        // Usa la variable de entorno MONGO_URI
        await mongoose.connect(process.env.MONGO_URI); 
        
        console.log('✅ MongoDB Atlas conectado exitosamente.');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        // Salir del proceso con fallo si no hay conexión a la DB
        process.exit(1); 
    }
};

// 4. Middlewares de Express (Configuración General)
// a) CORS: Permite que el Front-End (en otro dominio) acceda a esta API
// Si no has instalado CORS, ejecútalo: npm install cors
app.use(cors()); 

// b) Body Parser: Permite a Express leer datos JSON enviados en el body de las peticiones
app.use(express.json()); 

// 5. Definición de Rutas de la API

// Ruta de Bienvenida (Opcional, para probar que el servidor está levantado)
app.get('/', (req, res) => {
    res.send('API de MediaVerse lista para operar.');
});

// Rutas de Autenticación
app.use('/api/auth', require('./routes/authRoutes')); 

// Rutas CRUD de Listas
app.use('/api/list', require('./routes/listRoutes'));


// 6. Conectar la DB e Iniciar el Servidor
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    // El servidor solo empieza a escuchar peticiones después de que la DB se conecte
    app.listen(PORT, () => console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`));
});