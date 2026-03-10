"use server"

import { CreatePackagesParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import Packages from "../database/models/packages.model"



export const createPackage = async ({ pack, path }: CreatePackagesParams) => {
  try {
    await connectToDatabase();

    const ent = (pack as any)?.entitlements || {};
    const maxListings = Number(ent?.maxListings ?? (pack as any)?.list ?? 0);
    const entPriority = Number(ent?.priority ?? (pack as any)?.priority ?? 0);

    const normalized = {
      ...pack,
      // ✅ ensure arrays exist
      features: (pack as any)?.features ?? [],
      price: (pack as any)?.price ?? [],
      price2: (pack as any)?.price2 ?? [],

      // ✅ ensure entitlements exists
      entitlements: {
        maxListings,
        priority: entPriority,
        topDays: Number(ent?.topDays ?? 0),
        featuredDays: Number(ent?.featuredDays ?? 0),
        autoRenewHours:
          ent?.autoRenewHours === null || ent?.autoRenewHours === undefined
            ? null
            : Number(ent.autoRenewHours),
      },

      // ✅ mirror legacy fields (so old code works)
      list: maxListings,
      priority: entPriority,
    };

    const newPackage = await Packages.create(normalized);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newPackage));
  } catch (error) {
    handleError(error);
  }
};

export async function updatePackage({ pack, path }: UpdatePackagesParams) {
  try {
    await connectToDatabase();

    const ent = (pack as any)?.entitlements || {};
    const maxListings = Number(ent?.maxListings ?? (pack as any)?.list ?? 0);
    const entPriority = Number(ent?.priority ?? (pack as any)?.priority ?? 0);

    const normalized = {
      ...pack,
      features: (pack as any)?.features ?? [],
      price: (pack as any)?.price ?? [],
      price2: (pack as any)?.price2 ?? [],

      entitlements: {
        maxListings,
        priority: entPriority,
        topDays: Number(ent?.topDays ?? 0),
        featuredDays: Number(ent?.featuredDays ?? 0),
        autoRenewHours:
          ent?.autoRenewHours === null || ent?.autoRenewHours === undefined
            ? null
            : Number(ent.autoRenewHours),
      },

      list: maxListings,
      priority: entPriority,
    };

    const updatedPack = await Packages.findByIdAndUpdate(pack._id, normalized, { new: true });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedPack));
  } catch (error) {
    handleError(error);
  }
}
// GET ONE Ad BY ID
export async function getPackageById(packageId: string) {
  try {
    await connectToDatabase()

    const pack = await Packages.findById(packageId)

    if (!pack) throw new Error('Package not found')

    return JSON.parse(JSON.stringify(pack))
  } catch (error) {
    handleError(error)
  }
}
export const getAllPackages = async () => {
  try {
    await connectToDatabase();

    const packages = await Packages.find().sort({ priority: 1 }); // 1 for ascending


    return JSON.parse(JSON.stringify(packages));
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deletePackage({ packageId, packageIcon, path }: DeletePackagesParams) {
  try {
    await connectToDatabase()

    const deletedAd = await Packages.findByIdAndDelete(packageId)
    // Delete image from uploadthing
    const url = new URL(packageIcon);
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


