import { StructError } from "superstruct"
import {AppError} from "./errors"
import { logger } from "./logger"

export interface ServiceResponse {
    success: boolean
    error?:  AppError
    message?: string
}

export const formatErrorMessages =(errors: ServiceResponse[] | ServiceResponse | StructError | AppError, context="") => {
    let response: {success: boolean, error: any} = {
        success: false,
        error: ''
    }
    if (errors instanceof Array) {
        const errList = []
        for (let i = 0; i < errors.length; i++) {
            errList.push(errors[i].error)
        }
        response.error = errList
    } else if("success" in errors){
        if(errors.error.sqlState || errors.error.code || errors.error.message.toString().includes("TypeError")){
            logger.error(errors.error)
            response.error = "Internal Server Error"
        }else{
            response.error = errors.error
        }
    }else if(errors instanceof StructError) {
        const { key, value, type } = errors
        const err = {
            type: "ValidationError",
            context,
            cause: '',
            message: errors.message
        }
        if (value === undefined) err.cause =(`${context}_${key}_required`)
        else if (type === 'never') err.cause = `${context}_attribute_unknown`
        else err.cause = `${context}_${key}_invalid`
        response.error = err
    }else if("context" in errors){
        console.log("Context error")
        response.error = errors
    }
    else{
        response.error = "Internal Server Error"
    }
    return response
}
