"use server"

import { CreateCategoryParams, DeleteCategoryParams, UpdateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"


export const createCategory = async ({ category, path}: CreateCategoryParams) => {
  try {
    await connectToDatabase();
  
    const newCategory = await Category.create({ ...category});
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error)
  }
}
// UPDATE
export async function updateCategory({ category, path }: UpdateCategoryParams) {
  try {
    await connectToDatabase()
    const updatedCat = await Category.findByIdAndUpdate(
      category._id,
      { ...category},
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedCat))
  } catch (error) {
    handleError(error)
  }
}
// GET ONE Ad BY ID
export async function getCategoryById(categoryId: string) {
  try {
    await connectToDatabase()

    const cat = await Category.findById(categoryId)

    if (!cat) throw new Error('Category not found')

    return JSON.parse(JSON.stringify(cat))
  } catch (error) {
    handleError(error)
  }
}

export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "ads", // Assuming the collection name for ads is "ads"
          let: { categoryId: "$_id" }, // Use a variable for category id
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ["$category", "$$categoryId"] }, // Match the foreign category field
                    { $eq: ["$adstatus", "Active"] } // Only include active ads
                  ]
                }
              } 
            }
          ],
          as: "ads"
        }
      },
      {
        $addFields: {
          adCount: { $size: "$ads" } // Add a new field "adCount" containing the number of active ads for each category
        }
      },
      {
        $project: {
          ads: 0 // Exclude the "ads" field from the result
        }
      }
    ]);

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};

export const getAllSubCategories = async () => {
  try {
    await connectToDatabase();
    const categories = await Category.aggregate([
    //  {
     //   $lookup: {
      //    from: "ads", // Assuming the collection name for ads is "ads"
      //    localField: "_id",
     //     foreignField: "category",
     //     as: "ads"
     //   }
    //  },
      {
        $lookup: {
          from: "ads", // Assuming the collection name for ads is "ads"
          let: { categoryId: "$_id" }, // Use a variable for category id
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ["$category", "$$categoryId"] }, // Match the foreign category field
                    { $eq: ["$adstatus", "Active"] } // Only include active ads
                  ]
                }
              } 
            }
          ],
          as: "ads"
        }
      },
      {
        $unwind: "$subcategory" // Unwind to destructure subcategories array
      },
      {
        $lookup: {
          from: "ads", // Assuming the collection name for ads is "ads"
          localField: "subcategory",
          foreignField: "subcategory",
          as: "subcategory.ads"
        }
      },
      {
        $addFields: {
          "subcategory.adCount": { $size: "$subcategory.ads" } // Add a new field "adCount" containing the number of ads for each subcategory
        }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          totalAdsCount: { $sum: { $cond: [{ $isArray: "$ads" }, { $size: "$ads" }, 0] } }, // Calculate the total number of ads for the category
          subcategories: { $push: "$subcategory" }
        }
      }
    ]);


    console.log(JSON.parse(JSON.stringify(categories)))
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error)
  }
}
// DELETE
export async function deleteCategory({ categoryId,categoryImage, path }: DeleteCategoryParams) {
  try {
    await connectToDatabase()

    const deletedAd = await Category.findByIdAndDelete(categoryId)
    // Delete image from uploadthing
    const url = new URL(categoryImage);
    const filename = url.pathname.split('/').pop();
    if (filename) {
        const utapi = new UTApi();
      await utapi.deleteFiles(filename);
    }
    if (deletedAd) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}


