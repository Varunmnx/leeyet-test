import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs"


export const addproducts =async(req,res,next)=>{
    let arrImages = req.files
    let {productname ,description,price} = req.body
    if(!arrImages)res.status(301).json({status:"failure",message:"please enter one  image"})
    let encode_image

    let imageArray = arrImages.map(file=>{
        let img = fs.readFileSync(file.path)
        return  encode_image = img.toString('base64')
    })

    // console.log(imageArray)
   
    price = Number(parseFloat(price).toFixed(2))
    price += 25
    let prod =await prisma.product.create({
        data:{
            name:productname,
            description:description,
            Price: price
        }
    })
    console.log(prod)
    imageArray.map(async (src,index)=>{
        await prisma.productImages.create({
                          data:{
                               filename:arrImages[index].path,
                               contentType: arrImages[index].fieldname,
                               imageBase64 :src,
                               productId:prod.id
                          },
                          include:{
                            product:true
                          }
        })
        console.log("product added")
    })

    // console.log("_____mongodb___images_____")
    // console.log(productwithimages)

    res.redirect("/")
}

export const showallProducts =async(req,res,next)=>{

    let allproductswithImages = await prisma.product.findMany({
     
    })

    res.json({
        content:"all",
        allproductswithImages
    })

}

// Detailed Review Page
export const updateProduct =async(req,res,next)=>{

    let {id} = req.params
  
    let product = await prisma.product.findFirst({
        where:{
           id    
        },
        include:{
            ProductImages :true
        }
    })

    res.render("detailed.ejs",{product})
}


export const updateProductWithData = async(req,res,next)=>{


    console.log("________updating___________")
    let {id} = req.params
    let arrImages = req.files
    console.log(req.files)
    let {name, description, price ,remove  } = req.body
    price = Number(parseFloat(price).toFixed(2))

    let encode_image;
    let imageArray = arrImages.map(file=>{
        let img = fs.readFileSync(file.path)
        return  encode_image = img.toString('base64')
    })
    
    let currentproduct = await prisma.product.findFirst({
        where:{
            id
        }
    })

    name ?name :currentproduct.name
    description?description :currentproduct.description
    price?price:currentproduct.Price
    if(arrImages){
        imageArray.map(async (src,index)=>{
            await prisma.productImages.create({
                              data:{
                                   filename:arrImages[index].path,
                                   contentType: arrImages[index].fieldname,
                                   imageBase64 :src,
                                   productId:id
                              },
                              include:{
                                product:true
                              }
            })})
    }
    let updated = await prisma.product.update({
        where:{
            id
        } ,
        data:{
               name,
               Price: price,
               description
        }
    })
   res.status(200).json({
    state:"Success",
    updated
   })

}

export const deleteProduct =async(req,res,next)=>{
    console.log(req.body.id)
   let deleted = await prisma.product.delete({
        where:{
            id:req.body.id
        }
    })

  await prisma.productImages.deleteMany({
    where:{
         productId:req.body.id
    }
  })  
    console.log(deleted)
res.status(200).json({
    status:"success",
    message:"product with "+req.body.id+" deleted"
})
}


export const deleteImage = async(req,res,next)=>{
    let {id} = req.body
    console.log("___DEleting imagae______")

    let deleted = await prisma.productImages.delete({
        where:{
            id
        }
    })

    res.status(200).json({
        status:"success",
        message:"image Deleted Successfully"
    })
}