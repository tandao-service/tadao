'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/packages.model'
import Event from '@/lib/database/models/ad.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams, UpdateUserSetingsParams, UpdateUserToken } from '@/types'
import Verify from '../database/models/verifies.model'
import Verifies from '../database/models/verifies.model'
import Packages from '@/lib/database/models/packages.model'
import DynamicAd from '../database/models/dynamicAd.model'
import { FreePackId } from '@/constants'
import mongoose from 'mongoose'
import Transaction from '../database/models/transaction.model'
import { UTApi } from 'uploadthing/server'



export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}
export async function createUserr(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user, { verified: [{ accountverified: false, verifieddate: Date() }] },)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}
export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    // Get User
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    // Get Verification Fee
    const verifyData = await Verifies.findOne()
    const fee = verifyData?.fee || 500

    // Get Transaction and Package Info
    const status = "Active"
    const transactionConditions = {
      $and: [
        { buyer: userId },
        { status: status },
        { plan: { $ne: "Verification" } }
      ]
    }

    const recentTransaction = await Transaction.find(transactionConditions)
      .sort({ createdAt: 'desc' })
      .limit(1)
      .lean()

    let transaction = null
    let currentpack = null
    let adCount = 0
    let subscriptionStatus = 'Expired'
    if (!recentTransaction || recentTransaction.length === 0) {
      // No transaction — assign FreePack
      currentpack = await Packages.findById(FreePackId).lean()
      adCount = await DynamicAd.countDocuments({ organizer: userId })
    } else {
      // Use recent transaction's plan
      transaction = recentTransaction[0]
      const planId = transaction.planId ? new mongoose.Types.ObjectId(transaction.planId) : null
      currentpack = await Packages.findById(transaction.planId).lean()

      const adConditions = {
        $and: [
          { plan: planId },
          { createdAt: { $gte: transaction.createdAt } }
        ]
      }
      adCount = await DynamicAd.countDocuments(adConditions)
      // ======= Determine Subscription Status =======
      const periodStr = transaction.period || '7 days' // fallback
      const periodDays = parseInt(periodStr) || 7 // extract numeric days

      const createdAt = new Date(transaction.createdAt)
      const expirationDate = new Date(createdAt)
      expirationDate.setDate(createdAt.getDate() + periodDays)

      if (expirationDate > new Date()) {
        subscriptionStatus = 'Active'
      } else {
        subscriptionStatus = 'Expired'
      }
    }

    return {
      user: JSON.parse(JSON.stringify({ ...user.toObject(), fee })),
      transaction,
      ads: adCount,
      currentpack,
      subscriptionStatus
    }

  } catch (error) {
    handleError(error)
    return {
      user: null,
      transaction: null,
      ads: 0,
      currentpack: null,
      subscriptionStatus: 'Unknown'
    }
  }
}
export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDatabase()

    // Get User
    const user: any = await User.findOne({ clerkId });
    if (!user) throw new Error('User not found')
    //console.log(user)
    // Get Verification Fee
    const verifyData = await Verifies.findOne()
    const fee = verifyData?.fee || 500

    // Get Transaction and Package Info
    const status = "Active"
    const transactionConditions = {
      $and: [
        { buyer: user._id },
        { status: status },
        { plan: { $ne: "Verification" } }
      ]
    }

    const recentTransaction = await Transaction.find(transactionConditions)
      .sort({ createdAt: 'desc' })
      .limit(1)
      .lean()

    let transaction = null
    let currentpack = null
    let adCount = 0
    let subscriptionStatus = 'Expired'
    if (!recentTransaction || recentTransaction.length === 0) {
      // No transaction — assign FreePack
      currentpack = await Packages.findById(FreePackId).lean()
      adCount = await DynamicAd.countDocuments({ organizer: user._id })
    } else {
      // Use recent transaction's plan
      transaction = recentTransaction[0]
      const planId = transaction.planId ? new mongoose.Types.ObjectId(transaction.planId) : null
      currentpack = await Packages.findById(transaction.planId).lean()

      const adConditions = {
        $and: [
          { plan: planId },
          { createdAt: { $gte: transaction.createdAt } }
        ]
      }
      adCount = await DynamicAd.countDocuments(adConditions)
      // ======= Determine Subscription Status =======
      const periodStr = transaction.period || '7 days' // fallback
      const periodDays = parseInt(periodStr) || 7 // extract numeric days

      const createdAt = new Date(transaction.createdAt)
      const expirationDate = new Date(createdAt)
      expirationDate.setDate(createdAt.getDate() + periodDays)

      if (expirationDate > new Date()) {
        subscriptionStatus = 'Active'
      } else {
        subscriptionStatus = 'Expired'
      }
    }
    // console.log(JSON.parse(JSON.stringify({ ...user.toObject(), fee })))
    return {
      user: JSON.parse(JSON.stringify({ ...user.toObject(), fee })),
      transaction,
      ads: adCount,
      currentpack,
      subscriptionStatus
    }

  } catch (error) {
    handleError(error)
    return {
      user: null,
      transaction: null,
      ads: 0,
      currentpack: null,
      subscriptionStatus: 'Unknown'
    }
  }
}
export async function updateUserPhone(_id: string, phone: string) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updatephone = await User.findByIdAndUpdate(
      _id,
      { phone }, // Update only the name field
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatephone));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUserStatus(_id: string, status: string) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updateAdabused = await User.findByIdAndUpdate(
      _id,
      { status }, // Update only the name field
      { new: true }
    );

    // Revalidate the path (assuming it's a separate function)
    // revalidatePath(path);

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdabused));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
export async function updateUserPhoto(_id: string, photo: string, olderphoto: string) {
  try {

    if (olderphoto) {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(olderphoto);
      } catch (error: any) { }
    }
    await connectToDatabase();
    // Find the category by its ID and update the name field only
    const updateAdabused = await User.findByIdAndUpdate(
      _id,
      { photo }, // Update only the name field
      { new: true }
    );

    // Return the updated category
    return JSON.parse(JSON.stringify(updateAdabused));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}
export async function updateNotiPreference(userId: string, value: { email: boolean; fcm: boolean }) {
  try {
    await connectToDatabase();

    // Find the category by its ID and update the name field only
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { notifications: { email: value.email, fcm: value.fcm } },
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
    // Handle error appropriately (e.g., throw or return error response)
    throw error;
  }
}

export async function updateUserToken(userId: string, currentToken: string) {
  try {
    await connectToDatabase();

    // Find the user by ID
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if the FCM token already exists
    if (existingUser.token !== currentToken) {
      // Update the user's FCM token
      existingUser.token = currentToken;
      // Save the updated user data
      const updatedUser = await existingUser.save();

      if (!updatedUser) throw new Error("User update failed");

      return JSON.parse(JSON.stringify(updatedUser));
    }

    // If the token already exists, return the existing user data
    return JSON.parse(JSON.stringify(existingUser));
  } catch (error) {
    handleError(error);
  }
}
export async function updateUserFromSettings({ user, path }: UpdateUserSetingsParams) {
  try {
    await connectToDatabase()
    //console.log(user);
    const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string, olderphoto: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }
    if (olderphoto) {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(olderphoto);
      } catch (error: any) { }
    }
    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
// USE CREDITS
export async function updateVerification(userId: string) {
  try {
    await connectToDatabase();
    //console.log("update userId: "+userId+" Date:"+Date());
    const updatedUserVerifiction = await User.findOneAndUpdate(
      { _id: userId },
      { verified: [{ accountverified: true, verifieddate: Date() }] },
      { new: true }
    )
    if (!updatedUserVerifiction) throw new Error("User Verification update failed");

    return JSON.parse(JSON.stringify(updatedUserVerifiction));
  } catch (error) {
    handleError(error);
  }
}
export async function getAllUsers(limit: number, page: number) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit;
    // Fetch filtered orders with pagination
    const user = await User.find()
      .skip(skipAmount)
      .limit(limit);
    // Get the count of documents that match the conditions
    const AdCount = await User.countDocuments();

    return { data: JSON.parse(JSON.stringify(user)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
export async function getUserAgragate(limit: number, page: number) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const usersWithAdStats = await User.aggregate([
      {
        $lookup: {
          from: 'dynamicads',
          localField: '_id',
          foreignField: 'organizer',
          as: 'ads'
        }
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'buyer',
          as: 'transactions'
        }
      },
      {
        $addFields: {
          adsCount: { $size: '$ads' },
          activeCount: {
            $size: {
              $filter: {
                input: '$ads',
                as: 'ad',
                cond: { $eq: ['$$ad.adstatus', 'Active'] }
              }
            }
          },
          pendingCount: {
            $size: {
              $filter: {
                input: '$ads',
                as: 'ad',
                cond: { $eq: ['$$ad.adstatus', 'Pending'] }
              }
            }
          },
          inactiveCount: {
            $size: {
              $filter: {
                input: '$ads',
                as: 'ad',
                cond: { $eq: ['$$ad.adstatus', 'Inactive'] }
              }
            }
          },
          totalPaid: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$transactions',
                    as: 'txn',
                    cond: { $eq: ['$$txn.status', 'Active'] }
                  }
                },
                as: 'activeTxn',
                in: { $toDouble: '$$activeTxn.amount' }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          photo: 1,
          phone: 1,
          status: 1,
          verified: 1,
          token: 1,
          notifications: 1,
          businessname: 1,
          adsCount: 1,
          activeCount: 1,
          pendingCount: 1,
          inactiveCount: 1,
          totalPaid: 1

        }
      },
      { $sort: { adsCount: -1 } },  // Sort by adsCount descending
      { $skip: skipAmount },
      { $limit: limit }
    ]);

    const totalUsers = await User.countDocuments();

    return {
      data: JSON.parse(JSON.stringify(usersWithAdStats)),
      totalPages: Math.ceil(totalUsers / limit)
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getToAdvertiser() {
  try {
    await connectToDatabase();

    const usersWithAdStats = await User.aggregate([
      {
        $lookup: {
          from: 'dynamicads',
          localField: '_id',
          foreignField: 'organizer',
          as: 'ads'
        }
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'buyer',
          as: 'transactions'
        }
      },
      {
        $addFields: {
          adsCount: { $size: '$ads' },
          activeCount: {
            $size: {
              $filter: {
                input: '$ads',
                as: 'ad',
                cond: { $eq: ['$$ad.adstatus', 'Active'] }
              }
            }
          },
          pendingCount: {
            $size: {
              $filter: {
                input: '$ads',
                as: 'ad',
                cond: { $eq: ['$$ad.adstatus', 'Pending'] }
              }
            }
          },
          inactiveCount: {
            $size: {
              $filter: {
                input: '$ads',
                as: 'ad',
                cond: { $eq: ['$$ad.adstatus', 'Inactive'] }
              }
            }
          },
          totalPaid: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$transactions',
                    as: 'txn',
                    cond: { $eq: ['$$txn.status', 'Active'] }
                  }
                },
                as: 'activeTxn',
                in: { $toDouble: '$$activeTxn.amount' }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          photo: 1,
          phone: 1,
          status: 1,
          verified: 1,
          token: 1,
          notifications: 1,
          businessname: 1,
          adsCount: 1,
          activeCount: 1,
          pendingCount: 1,
          inactiveCount: 1,
          totalPaid: 1
        }
      },
      { $sort: { adsCount: -1 } }  // Sort by adsCount descending
      //{ $skip: skipAmount },
      //{ $limit: limit }
    ]);

    const totalUsers = await User.countDocuments();

    return {
      data: JSON.parse(JSON.stringify(usersWithAdStats))
    };
  } catch (error) {
    handleError(error);
  }
}



export async function getAllContacts() {
  try {
    await connectToDatabase()

    // Fetch filtered orders with pagination
    const user = await User.find();
    // Get the count of documents that match the conditions
    const AdCount = await User.countDocuments();
    //console.log({ data: JSON.parse(JSON.stringify(user)), totalPages: Math.ceil(AdCount / limit) })
    return { data: JSON.parse(JSON.stringify(user)) }
  } catch (error) {
    handleError(error)
  }
}
