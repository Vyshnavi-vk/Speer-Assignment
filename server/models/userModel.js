import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        }
    }
)

const Users = mongoose.model("Users", userSchema)
export default Users