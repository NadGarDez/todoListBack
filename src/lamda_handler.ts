import { APIGatewayProxyHandler } from 'aws-lambda';
import db from './models'
import { initTaskModel } from "./models/task";


const Task = initTaskModel(db.sequelize);

interface LambdaResponse {
    statusCode: number;
    body: string;
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
    let taskId: string | number;

    try {
        let parsedBody: any;

        if (typeof event.body === 'string' && event.body.length > 0) {
            parsedBody = JSON.parse(event.body);
        } else if (typeof event.body === 'object' && event.body !== null) {
            parsedBody = event.body;
        } else {
            parsedBody = {};
        }

        taskId = event.pathParameters?.id || parsedBody.taskId;

        if (!taskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El ID de la tarea es obligatorio.' }),
            } as LambdaResponse;
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Error al procesar la solicitud.' }),
        } as LambdaResponse;
    }

    try {
        const task = await Task.findByPk(taskId);
        
        if (!task) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: `Tarea con ID ${taskId} no encontrada.` }),
            } as LambdaResponse;
        }

        const newDoneStatus = !task.done;

        await Task.update(
            { done: newDoneStatus },
            { where: { id: taskId } }
        );

        task.done = newDoneStatus; 
        
        return {
            statusCode: 200,
            body: JSON.stringify(task),
        } as LambdaResponse;

    } catch (error: any) {
        console.error('Error de base de datos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno al actualizar la tarea.', error: error.message }),
        } as LambdaResponse;
    }
};