import { Router } from "express";
import { auth } from "../../Middelwares/authintaction.js";
import { asyncHandler } from "../../Utils/errorHandler.js";
import { addComment, addReply, addReplyOnReply, deletedComment } from "./comment.controller.js";

const commentRouter = Router();

commentRouter.post('/add' , auth() , asyncHandler(addComment))
commentRouter.delete('/delete/:commentId' , auth() , asyncHandler(deletedComment))

commentRouter.post('/addReply' , auth() , asyncHandler(addReply))
commentRouter.post('/addReplyOnReply' , auth() , asyncHandler(addReplyOnReply))

export default commentRouter;