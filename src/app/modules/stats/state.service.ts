import { Transaction } from "../Transaction/transaction.model"
import { IUserStatus, Role } from "../user/user.interface"
import { User } from "../user/user.model"

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

export const statService = {
    getUserState,
    getTransactionStat
}
