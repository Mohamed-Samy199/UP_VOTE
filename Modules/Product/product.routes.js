import { Router } from "express";
import { auth, authoriation } from "../../Middelwares/authintaction.js";
import { myMulter } from "../../Service/multer.js";
import { asyncHandler } from "../../Utils/errorHandler.js";
import { addProduct, getAllProducts, likeProduct, softDeleted, unlikeProduct } from "./product.controller.js";
import { endPoint } from "./product.endPoints.js";

const productRouter = Router();

productRouter.post('/add' , auth() , myMulter({}).array('pic' , 2) , asyncHandler(addProduct));
productRouter.get('/' , asyncHandler(getAllProducts))

productRouter.put('/like/:productId' , auth() , asyncHandler(likeProduct))
productRouter.put('/unlike/:productId' , auth() , asyncHandler(unlikeProduct))

productRouter.patch('/soft' , auth() , authoriation(endPoint.SOFT_DELETE) , asyncHandler(softDeleted))

export default productRouter;