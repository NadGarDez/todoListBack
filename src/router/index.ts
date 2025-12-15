import { Router } from "express"
import { deleteTask, getAllTasks, getTask, postTask, updateTask } from "../controllers/taskController";
import { validateCognitoToken } from "../middlewares/cognitoMiddleware";

const router = Router()

router.post('/',validateCognitoToken, postTask);             
router.get('/',validateCognitoToken, getAllTasks);             
router.get('/:id',validateCognitoToken, getTask);            
router.put('/:id', validateCognitoToken, updateTask);             
router.delete('/:id',validateCognitoToken, deleteTask)


export default router;