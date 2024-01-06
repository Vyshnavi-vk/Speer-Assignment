import Notes from '../models/noteModel.js'
import Users from '../models/userModel.js'

export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body

        const note = await Notes.create({ title, content, owner: req.user._id });

        res.json(note)

    } catch (error) {
        console.error(error)

        res.json({ msg: "Error occured while creating a note" })
    }
}


export const fetchNotes = async (req, res) => {
    try {
        const allNotes = await Notes.find({ owner: req.user._id })

        res.json(allNotes)

    } catch (error) {

        console.error(error)

        res.json({ msg: "Error while fetching notes" })
    }
}


export const getNoteById = async (req, res) => {
    try {

        const note = await Notes.findOne({ _id: req.params.id, owner: req.user._id })

        if (!note) return res.status(404).json({ error: 'Note not found' });

        res.json(note)
    } catch (error) {

        console.error(error)

        res.json({ msg: "Error occured while fetching notes" })
    }

}


export const updateNode = async (req, res) => {
    try {

        const { title, content } = req.body

        const note = await Notes.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { title, content },
            { new: true }
        )

        if (!note) {
            return res.json({ msg: "Note not found" })
        }

        res.json(note)

    } catch (error) {

        console.error(error)

        res.json({ msg: "Error occured while upadting notes" })
    }
}


export const deleteNote = async (req, res) => {
    try {
        const note = await Notes.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!note) {
            return res.json({ msg: "Note not found" })
        }

        if (note) res.send('Note deleted successfully')

    } catch (error) {
        console.error(error)

        res.json({ msg: "Error occured while deleting record" })
    }
}


export const shareNote = async (req, res) => {
    try {

        const noteId = req.params.id

        const { toUserId } = req.body

        const note = await Notes.findOne({ _id: noteId, owner: req.user._id });

        if (!note) {
            res.json({ msg: "Note not found or not owned by user" })
        }

        const userToShareWith = await Users.findById(toUserId)

        if (!userToShareWith) {
            res.json({ msg: "User not found" })
        }

        if (note.sharedWith.includes(toUserId)) {
            res.json({ msg: "Note is already shared with the user" })
        }

        note.sharedWith.push(toUserId)
        // await note.save()
        res.send('note shared')

    } catch (error) {
        console.error(error)
        res.json({ msg: "Error occured while sharing note" })
    }
}



export const searchNote = async (req, res) => {
    try {
        const query = req.query.q

        const notes = await Notes.find({
            $and: [
                { $or: [{ title: { $regex: query, $options: 'i' } }, { content: { $regex: query, $options: 'i' } }] },
                { owner: req.user._id }
            ]
        })

        res.json(notes)

    } catch (error) {
        console.error(error)

        res.json({ msg: "Error occured while searching notes" })
    }
}