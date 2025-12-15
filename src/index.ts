import express, { Application, Request, Response } from 'express';
import router from './router';
import db from './models';
var cors = require('cors');

const app: Application = express();
const PORT = 3000;

app.use(cors());

app.use('/tasks', router)


async function startServer() {
    try {
        // 1. Conectar/Autenticar Sequelize
        await db.sequelize.authenticate();
        console.log('✅ Conexión a la base de datos (AWS RDS) establecida exitosamente.');
        app.get('/test', (req: Request, res: Response) => {
            res.send('Hello, TypeScript + Express!');
        });

        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
            console.log(`Entorno de ejecución: ${process.env.NODE_ENV}`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor o conectar la base de datos:', JSON.stringify(error));
        process.exit(1);
    }
}

startServer()