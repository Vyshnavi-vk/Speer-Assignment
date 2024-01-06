import mongoose from "mongoose"

const noteSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },

        content: {
            type: String
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        sharedWith: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    }
)

const Notes = mongoose.model("Notes", noteSchema)
export default Notes