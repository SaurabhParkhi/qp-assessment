import { Router } from 'express';
import { editProduct, fetchProducts } from '../controllers/productControllers';
import { verifyToken } from '../middleware/verifytoken';
import { addProducts } from '../controllers/productControllers';
import { upload } from '../middleware/fileupload';
import { removeProduct } from '../controllers/productControllers';
import { placeOrder } from '../controllers/productControllers';
import { getOrders } from '../controllers/productControllers';
import dotenv from "dotenv"

dotenv.config();

const productRouter = Router();

const adminKey = process.env.JWT_ADM_KEY as string
const userKey = process.env.JWT_KEY as string

console.log(adminKey)
console.log(userKey)

productRouter.get("/getproducts",fetchProducts);
productRouter.post("/addproducts",verifyToken(adminKey),upload.single("productImage"),addProducts);
productRouter.post("/removeproduct",verifyToken(adminKey),removeProduct);
productRouter.post("/editproducts", verifyToken(adminKey), editProduct);
productRouter.post("/placeorder",verifyToken(userKey),placeOrder);
productRouter.get("/getorders",verifyToken(userKey),getOrders);

export default productRouter;