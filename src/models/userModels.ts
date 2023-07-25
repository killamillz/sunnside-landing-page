import mongoose from "mongoose";
import { Schema } from "mongoose"

export interface IUser {
     firstName: string,
     lastName: string,
     email: string,
     password: string
}

const userSchema = new Schema({
     firstName: {
          type: String,
          require:[true, `Please input your firstname`]
     },
     lastName: {
          type: String,
          require:[true, `please input your lastName`]
     },
     email: {
          type: String,
          require: [true, `please input email`]
     },
     password: {
          type: String,
          require: [false]
     }

})

const User = mongoose.model<IUser>('User', userSchema)

export default User
