import { JwtPayload } from "jsonwebtoken"
import { Transaction } from "../Transaction/transaction.model"
import { IUserStatus, Role } from "../user/user.interface"
import { User } from "../user/user.model"
import { Wallet } from "../wallet/wallet.model"

const getUserState = async () => {
    const totalAllUserPromise = User.countDocuments()
    const totalVerifiedUserPromise = User.countDocuments({ isVerified: true })
    const totalNonVerifiedUserPromise = User.countDocuments({ isVerified: false })
    const totalBlockedUserPromise = User.countDocuments({ status: IUserStatus.BLOCKED })
    const totalNonBlockedUserPromise = User.countDocuments({ status: IUserStatus.UNBLOCK })
    const totalUserPromise = User.countDocuments({ role: Role.USER })
    const totalAgentPromise = User.countDocuments({ role: Role.AGENT })



    const [
        totalAllUser,
        totalVerifiedUser,
        totalNonVerifiedUser,
        totalBlockedUser,
        totalNonBlockedUser,
        totalUser,
        totalAgent

    ] = await Promise.all([
        totalAllUserPromise,
        totalVerifiedUserPromise,
        totalNonVerifiedUserPromise,
        totalBlockedUserPromise,
        totalNonBlockedUserPromise,
        totalUserPromise,
        totalAgentPromise
    ])
    return {
        totalAllUser,
        totalVerifiedUser,
        totalNonVerifiedUser,
        totalBlockedUser,
        totalNonBlockedUser,
        totalUser,
        totalAgent
    }
}

const getTransactionStat = async () => {
    const totalTransactionPromise = Transaction.countDocuments()

    const [
        totalTransaction
    ] = await Promise.all([
        totalTransactionPromise
    ])
    return {
        totalTransaction
    }
}


const getSingleAgentTransactionStat = async (decodedToken: JwtPayload) => {
    const user = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate("wallet");
    if (!user) throw new Error("User not found");

    const result = await Transaction.aggregate([
        { $match: { userId: user._id } },
        {
            $facet: {
                // 1️⃣ Stats grouped by type
                statsByType: [
                    {
                        $group: {
                            _id: "$type",
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],

                // 2️⃣ Recent 5 transactions (all types)
                recentTransactions: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 },
                ],
            },
        },
    ]);

    const statsByType = result[0].statsByType || [];
    const recentTransactions = result[0].recentTransactions || [];




    return {
        statsByType,
        recentTransactions,
    };
};



const getSingleUserStat = async (decodedToken: JwtPayload) => {
    const user = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate("wallet")
    if (!user) {
        throw new Error("User not found");
    }

    const walletBalancePromise = Wallet.findById(user.wallet).select("balance")

    const recentTransActionPromise = Transaction.aggregate([
        {
            $match: { userId: user._id }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $limit: 5
        }
    ])

    const [walletBalance,
        recentTransaction
    ] = await Promise.all([
        walletBalancePromise,
        recentTransActionPromise
    ])
    return {
        walletBalance,
        recentTransaction
    }
}

export const statService = {
    getUserState,
    getTransactionStat,
    getSingleAgentTransactionStat,
    getSingleUserStat,

}
