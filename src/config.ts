import { z} from "zod"
import { EnvSchema } from "./config/env"

type SchemaTypes = z.infer<typeof EnvSchema>

export class ConfigService {

    parseSchema<T extends z.AnyZodObject>(schema: T, data: object) {
        const parsed = schema.safeParse(data)
        if (!parsed.success) {
            console.error(
                "❌ Invalid environment variables:",
                JSON.stringify(parsed.error.format(), null, 4)
            )
            process.exit(1)
        }

        return parsed.data
    }

    get(k: keyof SchemaTypes) {
       const data = this.parseSchema(EnvSchema, process.env)
        return data[k]
    }
    // get(k: keyof SchemaTypes) {
    //     const parsed = EnvSchema.safeParse(process.env)
    //     if (!parsed.success) {
    //         console.error(
    //             "❌ Invalid environment variables:",
    //             JSON.stringify(parsed.error.format(), null, 4)
    //         )
    //         process.exit(1)
    //     }

    //     return parsed.data[k]
    // }
}


