import express from "express"
import {showallProducts,addproducts} from "../controller/controller.js"
let router = express.Router()
import { upload } from "../middleware/multer.js"

router.route("/add").post( upload.array('images',12), addproducts)
router.route("/all").get(showallProducts)


export default router