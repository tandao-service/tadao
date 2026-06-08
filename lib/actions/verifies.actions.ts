"use server"

import { CreatePackagesParams, CreateVerifiesParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams, UpdateVerifiesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Verify from "../database/models/verifies.model"
import Verifies from "../database/models/verifies.model"



export const createVerifies = async ({ verifies, path }: CreateVerifiesParams) => {
  try {
    await connectToDatabase();

    const newVerifies = await Verifies.create({ ...verifies });
    revalidatePath(path)
    return JSON.parse(JSON.stringify(newVerifies));
  } catch (error) {
    handleError(error)
  }
}

// UPDATE

export async function updateVerifiesFee(fee: string) {
  try {
    await connectToDatabase();

    const cleanedFee = String(fee || "").trim();

    if (!cleanedFee) {
      throw new Error("Fee is required");
    }

    const updatedV = await Verifies.findOneAndUpdate(
      {},
      { fee: cleanedFee },
      {
        new: true,
        upsert: true,
      }
    );

    revalidatePath("/admin/verification");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedV)),
    };
  } catch (error: any) {
    console.error("UPDATE VERIFY FEE ERROR:", error);

    return {
      success: false,
      message: error?.message || "Failed to update verification fee",
    };
  }
}
export async function updateVerifies({ verifies, path }: UpdateVerifiesParams) {
  try {
    await connectToDatabase()
    const updatedV = await Verifies.findByIdAndUpdate(
      verifies._id,
      { ...verifies },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedV))
  } catch (error) {
    handleError(error)
  }
}

export const getVerifyfee = async () => {
  try {
    await connectToDatabase();

    const verifies = await Verifies.findOne();
    return JSON.parse(JSON.stringify(verifies));
  } catch (error) {
    handleError(error)
  }
}
export const getVerfiesfee = async () => {
  try {
    await connectToDatabase();

    const verifies = await Verifies.find().limit(1);

    return JSON.parse(JSON.stringify(verifies));
  } catch (error) {
    handleError(error)
  }
}


