import { Router } from 'express';
import { registerUser} from '../controllers/authController';
import { loginUser } from '../controllers/authController';
import { adminLogin } from '../controllers/authController';

const authRouters = Router();

authRouters.post('/register', registerUser);
authRouters.post('/login', loginUser);
authRouters.post('/admin/adminlogin', adminLogin);

export default authRouters