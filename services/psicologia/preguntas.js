const express = require('express');
const jwt = require('jsonwebtoken');
const PreguntaPsicologia = require('../server/models/preguntasPsicologia/preguntasPsicologia'); 
const router = express.Router();

router.post('/crear', async (req, res) => {
    try {
        
        const authHeader = req.headers['authorization'] || req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 1, response: { mensaje: 'Token requerido' } });
        }

        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ error: 1, response: { mensaje: 'Servidor sin JWT_SECRET configurado' } });

        let payload;
        try {
            payload = jwt.verify(token, secret);
        } catch (e) {
            return res.status(401).json({ error: 1, response: { mensaje: 'Token inválido o expirado' } });
        }

        const { id_usuario_creacion, preguntas } = req.body;

        if (!id_usuario_creacion || !preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
            return res.status(400).json({ error: 1, response: { mensaje: 'Faltan parámetros obligatorios o preguntas vacías' } });
        }

        
        const preguntasAGuardar = preguntas.map(p => ({
            tipo: p.tipo,
            pregunta: p.pregunta,
            estado: p.estado || 'activo',
            id_usuario_creacion
        }));

        const resultados = await PreguntaPsicologia.insertMany(preguntasAGuardar);

        return res.status(200).json({
            error: 0,
            response: {
                mensaje: 'Preguntas creadas correctamente',
                cantidad_registros: resultados.length
            }
        });

    } catch (error) {
        console.error('Error inesperado en /preguntas_psicologia/crear:', error);
        return res.status(500).json({ error: 1, response: { mensaje: 'Error inesperado', detalle: error.message } });
    }
});

router.get('/activas', async (req, res) => {
    try {
        
        const authHeader = req.headers['authorization'] || req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 1, response: { mensaje: 'Token requerido' } });
        }

        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ error: 1, response: { mensaje: 'Servidor sin JWT_SECRET configurado' } });

        let payload;
        try {
            payload = jwt.verify(token, secret);
        } catch (e) {
            return res.status(401).json({ error: 1, response: { mensaje: 'Token inválido o expirado' } });
        }

        
        const preguntasActivas = await PreguntaPsicologia.find({ estado: 'activo' }).sort({ tipo: 1 });

        return res.status(200).json({
            error: 0,
            response: {
                mensaje: 'Consulta exitosa',
                data: preguntasActivas
            }
        });

    } catch (error) {
        console.error('Error inesperado en /preguntas_psicologia/activas:', error);
        return res.status(500).json({ error: 1, response: { mensaje: 'Error inesperado' } });
    }
});

module.exports = router;
