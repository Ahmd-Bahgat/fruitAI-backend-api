import { Request, Response } from "express"
import { zUserSchema } from "../validations/userValidate"
import { AppError } from "../utils/appError"
import { register } from "../services/userService"

export const registerController = async (req : Request,res: Response) => {
    const parsed = zUserSchema.safeParse(req.body)
    console.log(parsed.data)
    if(!parsed.success){
        throw new AppError('Registration data in invalid', 400)
    }
    const data = await register(parsed.data)
    res.status(201).json({
        status: 'success',
        ...data
    })
}