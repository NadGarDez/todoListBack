// response simulations
const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis(); 
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis(); 
    return res;
};

// request simulations
const mockRequest = (params: any = {}) => {
    return {
        params,
    } as unknown as Request<{ id: string }>;
};


// functions of sequelize
const mockTask = {
    destroy: jest.fn(),
};


jest.mock('../models/task', () => ({
    initTaskModel: jest.fn(() => mockTask),
}));

jest.mock('../models', () => ({
    sequelize: {}, 
    Sequelize: {}, 
    Task: mockTask 
}));


import { deleteTask } from "../controllers/taskController";
import { Request } from "express";


describe('deleteTask', () => {
    let res: ReturnType<typeof mockResponse>;

    beforeEach(() => {
        res = mockResponse();
        jest.clearAllMocks();
    });

    it('debe eliminar la tarea y devolver estado 204 si el ID existe', async () => {
        const TASK_ID = '123';
        // 🛠️ MOCKEO: Simular que la DB eliminó 1 fila (Éxito)
        mockTask.destroy.mockResolvedValue(1); 

        const req = mockRequest({ id: TASK_ID });

        await deleteTask(req, res);

        expect(mockTask.destroy).toHaveBeenCalledWith({
            where: { id: TASK_ID }
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled(); 
    });


    it('debe devolver estado 404 si la tarea no se encuentra', async () => {
        const TASK_ID = '999';
        mockTask.destroy.mockResolvedValue(0); 

        const req = mockRequest({ id: TASK_ID });

        await deleteTask(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: `Tarea con ID ${TASK_ID} no encontrada.` });
    });

   
    it('debe devolver estado 500 si ocurre un error interno del servidor/DB', async () => {
        const error = new Error('Database connection failed');
        mockTask.destroy.mockRejectedValue(error);

        const req = mockRequest({ id: '1' });

        await deleteTask(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error interno del servidor al eliminar la tarea.' });
    });
});