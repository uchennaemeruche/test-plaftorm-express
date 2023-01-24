
export type AppError = 
| {type: 'NotFoundErr', context?: string}
| {type: 'DuplicateErr', context?: string}
| {type: 'OtherErrs', context?: string, error?: Error}
| {type: 'BadRequestErr', context?: string}
| {type: 'ConflictErr', context?: string}
| {type: 'MissingHeader'}
| {type: 'InvalidTokenErr'}
| {type: 'TokenExpiredErr'}
| {type: 'InsufficientBalanceErr', context? : string}
| {type: 'BlockedAccountErr', context? : string}
| {type: 'FailedTransactionErr', context? : string}
| {type: 'AuthenticationError', context? : string}
| {type: 'OnboardingError', context? : string}


export const NotFoundErr =(context?: string):AppError =>({
    type: 'NotFoundErr',
    context
})

export const DuplicateErr = (context?: string): AppError =>({
    type: 'DuplicateErr',
    context
})

export const OtherErrs = (context?: string, error?: Error): AppError => ({
    type: 'OtherErrs',
    context,
    error,
})

export const BadRequestErr = (context?: string): AppError =>({
    type: 'BadRequestErr',
    context
})

export const ConflictErr = (context?: string): AppError =>({
    type: 'ConflictErr',
    context
})
export const MissingHeader = (): AppError =>({
    type: 'MissingHeader'
})
export const InvalidTokenErr = (): AppError =>({
    type: 'InvalidTokenErr'
})
export const TokenExpiredErr = (): AppError =>({
    type: 'TokenExpiredErr'
})

export const InsufficientBalanceErr =(context?: string):AppError =>({
    type: 'InsufficientBalanceErr',
    context
})

export const BlockedAccountErr = (context?: string): AppError =>({
    type: 'BlockedAccountErr',
    context
})
export const FailedTransactionErr = (context?: string): AppError =>({
    type: 'FailedTransactionErr',
    context
})
export const AuthenticationError = (context?: string): AppError =>({
    type: 'AuthenticationError',
    context
})
export const OnboardingError = (context?: string): AppError =>({
    type: 'OnboardingError',
    context
})


export class HttpException extends Error{
    constructor (public statusCode: number, public message: string, public data?: any) {
        super(message)
        Error.captureStackTrace(this, this.constructor)
      }
}


