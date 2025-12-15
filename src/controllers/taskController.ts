import { type Request, type Response } from "express";
import { TaskInput, TaskOutput } from "../types";
import db from '../models'
import { initTaskModel } from "../models/task";


const Task = initTaskModel(db.sequelize);


export const postTask = async (req: Request<{}, {}, TaskInput>, res: Response<TaskOutput | { message: string }>) => {
    try {
        console.log(req.body)

        const { title, description, labels } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'El título es obligatorio.' });
        }

        console.log('pasa por aqui si hay titulo')

        const newTask = await Task.create({
            title,
            description: description || null,
            labels: labels,
            done: false
        }) as TaskOutput;

        console.log('pasa por aqui despues de la creacion')

        return res.status(201).json(newTask);
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: 'Error interno del servidor al crear la tarea. ' + error.message });
    }
}

export const getAllTasks = async (req: Request, res: Response<TaskOutput[] | { message: string }>) => {
    try {
        const tasks = await Task.findAll({
            order: [['createdAt', 'DESC']],
        }) as TaskOutput[];

        return res.status(200).json(tasks);
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: 'Error interno del servidor al obtener las tareas.' + error.message});
    }
}

export const getTask = async (req: Request<{ id: string }>, res: Response<TaskOutput | { message: string }>) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findByPk(taskId) as TaskOutput | null;

        if (!task) {
            return res.status(404).json({ message: `Tarea con ID ${taskId} no encontrada.` });
        }

        return res.status(200).json(task);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error interno del servidor al obtener la tarea.' });
    }
}

export const updateTask = async (req: Request<{ id: string }, {}, TaskInput>, res: Response<TaskOutput | { message: string }>) => {
    try {
        const taskId = req.params.id;
        const { title, description, labels } = req.body;

        const updateData: Partial<TaskInput> = { title, description, labels };

        const [updatedRows] = await Task.update(updateData, { where: { id: taskId } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Tarea con ID ${taskId} no encontrada o no hubo cambios.` });
        }

        const updatedTask = await Task.findByPk(taskId) as TaskOutput;

        return res.status(200).json(updatedTask);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error interno del servidor al actualizar la tarea.' });
    }
}

export const deleteTask = async (req: Request<{ id: string }>, res: Response<{ message: string }>) => {
    try {
        const taskId = req.params.id;

        const deletedRows = await Task.destroy({
            where: { id: taskId }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: `Tarea con ID ${taskId} no encontrada.` });
        }

        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ message: 'Error interno del servidor al eliminar la tarea.' });
    }
}