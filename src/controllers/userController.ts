import { Request, Response } from "express"
import { loginInput, registerInput } from "../validations/userValidate"
import { AppError } from "../utils/appError"
import { login, register } from "../services/userService"

export const registerController = async (req : Request,res: Response) => {
    const parsed = registerInput.safeParse(req.body)
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

export const loginController = async (req : Request, res : Response) => {
    const parsed = loginInput.safeParse(req.body)
    if(!parsed.success){
        throw new AppError('Login data is invalid', 400)
    }
    const data = await login(parsed.data)
    res.status(200).json({
        status:'success',
        ...data
    })
}