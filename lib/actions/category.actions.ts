"use server"

import { CreateCategoryParams, DeleteCategoryParams, UpdateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"

export const createCategory = async ({ formData, path }: CreateCategoryParams) => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ ...formData });
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error)
  }
}
// UPDATE
export async function updateCategory({ _id, formData, deleteUrl,
  oldurl, path }: UpdateCategoryParams) {
  try {
    await connectToDatabase()
    const updatedCat = await Category.findByIdAndUpdate(
      _id,
      { ...formData },
      { new: true }
    )
    try {
      if (!deleteUrl) {
        const utapi = new UTApi();
        await utapi.deleteFiles(oldurl);
      }
    } catch { }
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
          from: "dynamicads",
          let: { categoryName: "$name" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$data.category", "$$categoryName"] }, // Match category field
                    { $eq: ["$adstatus", "Active"] } // Match active ads
                  ]
                }
              }
            }
          ],
          as: "dynamicads"
        }
      },
      {
        $addFields: {
          adCount: { $size: "$dynamicads" } // Count active ads
        }
      },
      {
        $project: {
          dynamicads: 0 // Exclude the dynamicAds field from the output
        }
      },
      {
        $sort: { _id: 1 } // Sort by creation order (oldest first)
      }
    ]);

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    handleError(error);
  }
};


export const getselectedCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories",
          let: { categoryid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$categoryid"] }
                  ]
                }
              }
            }
          ],
          as: "subcategories"
        }
      },
      {
        $addFields: {
          adCount: { $size: "$subcategories" } // Count active ads
        }
      },
      {
        $project: {
          dynamicads: 0 // Exclude the dynamicAds field from the output
        }
      }
    ]);

    //console.log(categories);
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    handleError(error);
  }
};


// DELETE
export async function deleteCategory({ categoryId, categoryImage, path }: DeleteCategoryParams) {
  try {
    await connectToDatabase()

    const deletedAd = await Category.findByIdAndDelete(categoryId)
    // Delete image from uploadthing
    const url = new URL(categoryImage);
    const filename = url.pathname.split('/').pop();
    try {
      if (filename) {
        const utapi = new UTApi();
        await utapi.deleteFiles(filename);
      }
    } catch {

    }
    if (deletedAd) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}


