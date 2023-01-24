import { TypeOf, z } from "zod"

const DbSchema = z.object({
    BCRYPT_SALT: z.number(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.string().transform(Number),

})

const UserSchema = z.object({
    username: z.string()
})

type SchemaTypes = z.infer<typeof DbSchema>  | z.infer<typeof UserSchema>
export const getConfig = (k: keyof SchemaTypes) =>{
   const parsed = DbSchema.safeParse(process.env)
   if(!parsed.success){
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsed.error.format(), null, 4)
    )
    process.exit(1)
   }

   return parsed.data[k]
}


export class ConfigService {
    private DbSchema = z.object({
        BCRYPT_SALT: z.number(),
        DB_NAME: z.string(),
        DB_USER: z.string(),
        DB_PASSWORD: z.string(),
        DB_PORT: z.string().transform(Number),
    })

    // parseConfig<T extends z.ZodTypeAny>(schema: T, k: keyof z.infer<TypeOf<T>>){
    parseConfig<T extends z.ZodTypeAny>(schema: T, source: any){
        const parsed = schema.safeParse(source)
        if(!parsed.success){
         console.error(
             "❌ Invalid environment variables:",
             JSON.stringify(parsed.error.format(), null, 4)
         )
         process.exit(1)
        }
        return parsed.data
    }

    get(k: keyof SchemaTypes){
        const config = this.parseConfig(this.DbSchema, process.env)
        
    }
}


