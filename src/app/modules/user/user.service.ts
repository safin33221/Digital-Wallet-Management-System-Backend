import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    console.log(payload);

    const isExistUser = await User.findOne({ email: payload.email })
    if (isExistUser) {
        throw new Error("User already exist with this phone number")
    }

    const user = await User.create(payload)
    console.log(user);
    return user

}

export const userService = {
    createUser
}