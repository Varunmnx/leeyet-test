import express from "express"
import {showallProducts,addproducts,updateProduct,updateProductWithData,deleteProduct,deleteImage} from "../controller/controller.js"
let router = express.Router()
import { upload } from "../middleware/multer.js"

router.route("/add").post( upload.array('images',12), addproducts)
router.route("/all").get(showallProducts)
router.route("/:id").get(updateProduct).put( upload.array('images',12),updateProductWithData).delete(deleteProduct)
router.route("/images/:id").delete(deleteImage)
export default router