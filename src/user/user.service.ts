import { Knex } from "knex";
import { Infer, nonempty, number, object, size, string } from "superstruct";
import { OnboardingError } from "../helpers/errors";

export const User = object({
    id: number(),
    uid: string(),
    firstname: string(),
    lastname: string(),
    othernames: string(),
    address: string(),
    phone: string(),
    email: string(),
    password: nonempty(size(string(), 5, 15)),
    bvn: string(),
})

export type User = Infer<typeof User>

export type UserCreatePayload = Omit<User, 'id' | 'uid'>

export interface IUserService{
    findOne(id: number): Promise<User | undefined>
}

type Partial<T> = {
    [P in keyof T]?: T[P]
}

type UserQueryFilter = Partial<User>

export class UserService{
    constructor(private db: Knex<User>) {}
    
    async findOne(filter:UserQueryFilter): Promise<User | undefined>{
       return await this.db('users').where(filter).first()
    }

    async create({args, trx}: {args:  Omit<User, 'id'>, trx?: Knex.Transaction}){
        let insertId = await trx!('users').insert(args)
        if(!insertId) throw OnboardingError('UserSignup')
        return insertId[0]
    }
}