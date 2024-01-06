import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js'
import Users from '../models/userModel.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExists = await Users.findOne({ email })

        if (userExists) {
            return res.status(400).json({ msg: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await Users.create({ name, email, password: hashedPassword })

        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
            })
        }
    } catch (error) {
        console.error(error)
        res.json({ msg: "Error occurred while signing up" });
    }
}



export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExists = await Users.findOne({ email })

        if (!userExists) {
            res.status(401).json({ msg: "Invalid email or password" })
        }

        const validPassword = await bcrypt.compare(password, userExists.password)

        if (!validPassword) {
            res.json({ msg: "Invalid email or password" })
        }

        if (userExists && validPassword) {
            res.json({
                _id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                token: generateToken(userExists._id)
            })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ msg: "Error occured while login" })
    }
}