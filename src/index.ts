import express, { Application, Request, Response } from 'express';
var cors = require('cors');

const app: Application = express();
const PORT = 3000;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Express!');
});

app.listen(PORT, () => {
