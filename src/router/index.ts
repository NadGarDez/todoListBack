import { Router } from "express"
import { deleteTask, getAllTasks, getTask, postTask, updateTask } from "../controllers/taskController";

const router = Router()

router.post('/', postTask);             
router.get('/', getAllTasks);             
router.get('/:id', getTask);            
router.put('/:id', updateTask);             
router.delete('/:id', deleteTask)


export default router;