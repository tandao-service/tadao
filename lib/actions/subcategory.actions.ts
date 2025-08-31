"use server"

import { CreateBookmarkParams, CreateCategoryParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Subcategory from "../database/models/subcategory.model"
import Category from "../database/models/category.model"
import mongoose from "mongoose"
import DynamicAd from "../database/models/dynamicAd.model"

const populateAd = (query: any) => {
  return query
    .populate({ path: 'category', model: Category, select: '_id name imageUrl' })
}

export const createSubCategory = async (categoryId: string, subcategoryName: string, imageUrl: any, fields: any) => {
  try {
    await connectToDatabase();

    const conditions = { subcategory: subcategoryName };
    const check = await Subcategory.findOne(conditions);  // Use findOne to find a single matching document
    if (check) throw new Error('Category exist')
    const Category = new Subcategory({
      category: categoryId,
      subcategory: subcategoryName,
      imageUrl: imageUrl,
      fields: fields,
    });
    const response = await Category.save();

    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    handleError(error)
  }
}
export async function updateCategory(_id: string, categoryId: string, subcategoryName: string, imageUrl: any, oldurl: any, editFields: any) {
  try {
    await connectToDatabase()
    const updatedCat = await Subcategory.findByIdAndUpdate(
      _id,
      {
        category: categoryId,
        subcategory: subcategoryName,
        imageUrl: imageUrl,
        fields: editFields,
      },
      { new: true }
    )
    if (oldurl) {
      const url = new URL(oldurl);
      const filename = url.pathname.split('/').pop();
      try {
        if (filename) {
          const utapi = new UTApi();
          await utapi.deleteFiles(filename);
        }
      } catch {

      }
    }
    return JSON.parse(JSON.stringify(updatedCat))
  } catch (error) {
    handleError(error)
  }
}
export const getallcategories = async () => {
  try {
    await connectToDatabase();


    const category = await populateAd(Subcategory.find().sort({ _id: 1 }));

    if (!category) throw new Error('category not found')
    //console.log(category)
    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}
export const getselectedsubcategories = async (categoryId: string) => {
  try {
    await connectToDatabase();
    const conditions = categoryId ? { category: categoryId } : {};
    const category = await populateAd(Subcategory.find(conditions).sort({ _id: 1 }));

    if (!category) throw new Error('category not found')
    // console.log(category)
    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}
export const getAllSubCategories = async () => {
  try {
    await connectToDatabase();

    // Step 1: Get all subcategories with their categories populated
    const subcategories = await Subcategory.find({}).sort({ _id: 1 }).populate({
      path: "category",
      model: Category,
      select: "name imageUrl"
    }).lean(); // lean() improves performance for read-only ops

    // Step 2: Aggregate ad counts grouped by data.category + data.subcategory
    const adCounts = await DynamicAd.aggregate([
      {
        $match: { adstatus: "Active" }
      },
      {
        $group: {
          _id: {
            category: "$data.category",
            subcategory: "$data.subcategory"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Step 3: Create a lookup map for fast matching
    const countMap = new Map();
    for (const item of adCounts) {
      const key = `${item._id.category}|${item._id.subcategory}`;
      countMap.set(key, item.count);
    }

    // Step 4: Attach ad count to each subcategory
    const enrichedSubcategories = subcategories.map(subcat => {
      const key = `${subcat.category?.name}|${subcat.subcategory}`;
      const adCount = countMap.get(key) || 0;

      return {
        ...subcat,
        adCount
      };
    });

    return enrichedSubcategories;
  } catch (error) {
    console.error("Error fetching subcategories with ad counts:", error);
    throw error;
  }
};


// DELETE
export async function deleteCategory(categoryId: string, iconUrl: string) {
  try {
    await connectToDatabase()

    const deletedCategory = await Subcategory.findByIdAndDelete(categoryId)

    // Delete image from uploadthing
    // if (deletedBookmark) revalidatePath(path)
    try {
      if (iconUrl) {
        const utapi = new UTApi();
        await utapi.deleteFiles(iconUrl);
      }
    } catch {

    }
  } catch (error) {
    handleError(error)
  }
}

export const getcategory = async (name: string, subcategory: string) => {
  try {
    await connectToDatabase();
    const conditions = { $and: [{ name: name }, { subcategory: subcategory }] };

    const category = await Subcategory.find(conditions).sort({ _id: 1 });
    if (!category) throw new Error('category not found')

    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}

export const removenegotiable = async () => {
  try {
    await connectToDatabase();

    const feedback = await Subcategory.updateMany(
      {},
      { $pull: { fields: { name: "negotiable" } } }
    );
    if (!feedback) throw new Error('category not found')

    return JSON.parse(JSON.stringify(feedback))
  } catch (error) {
    handleError(error)
  }
}

// Original subcategory ID to clone from
const originalSubcategoryId = '679f4cde745d352ebdef4939';

// New subcategories with new names and category IDs 

const newSubcategories = [
  { name: 'Accounting & Finance Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Advertising & Marketing Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Arts & Entertainment Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Childcare & Babysitting Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Clerical & Administrative Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Computing & IT Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Construction & Skilled Trade Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Consulting & Strategy Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Customer Services Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Driver Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Engineering & Architecture Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Farming & Veterinary Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Gardening & Landscaping Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Health & Beauty Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Healthcare & Nursing Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Hotel Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Housekeeping & Cleaning Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Human Resources Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Internship Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Legal Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Logistics & Transportation Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Management Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Manual Labour Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Manufacturing Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Mining Industry Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Office Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Part-Time & Weekend Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Quality Control & Assurance Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Research & Survey Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Restaurant & Bar Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Retail Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Sales & Telemarketing Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Security Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Sports Club Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Teaching Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Technology Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Travel & Tourism Jobs', categoryId: '678757f1d3faec08fe672915' },
  { name: 'Other Jobs', categoryId: '678757f1d3faec08fe672915' }
];


export async function duplicateSubcategories() {
  try {
    await connectToDatabase();

    const original = await Subcategory.findById(originalSubcategoryId).lean();
    if (!original) throw new Error('Original subcategory not found');

    for (const { name, categoryId } of newSubcategories) {

      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

      const exists = await Subcategory.findOne({
        subcategory: name,
        category: categoryObjectId,
      });

      if (exists) {
        console.log(`⚠️ Skipped (already exists): ${name}`);
        continue;
      }
      const cloned = {
        ...original,
        _id: new mongoose.Types.ObjectId(),
        subcategory: name,
        category: new mongoose.Types.ObjectId(categoryId),
      };

      if ('__v' in cloned) delete (cloned as any).__v;

      await Subcategory.create(cloned);
      console.log(`✅ Created: ${name}`);


    }

    console.log('✅ All subcategories duplicated successfully!');
  } catch (error) {
    console.error('❌ Duplication error:', error);
  } finally {
    // Optionally disconnect if this runs standalone
    // await mongoose.disconnect();
  }
}





