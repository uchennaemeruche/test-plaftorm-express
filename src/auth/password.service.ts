import { ConfigService } from "../config"
import { hash, compare } from "bcrypt";
import { AuthenticationError } from "../helpers/errors";

export type Salt = string | number

export class PasswordService {
    /**
     * the salt to be used to hash the password. if specified as a number then a
     * salt will be generated with the specified number of rounds and used
    */
    salt: Salt

    constructor(private configService: ConfigService) {
        const saltOrRounds = this.configService.get("BCRYPT_SALT") as number
        this.salt = parseSalt(saltOrRounds)
    }

    /**
     *
     * @param plainPassword the password to be encrypted.
     * @param encryptedPassword the encrypted password to be compared against.
     * @returns whether the password match the encrypted password
     */
    compare(plainPassword: string, encryptedPassword: string): Promise<boolean> {
        return compare(plainPassword, encryptedPassword);
    }

    /**
     * @param password the password to be encrypted
     * @return encrypted password
     */
    hash(password: string): Promise<string> {
        return hash(password, this.salt);
    }
}


/**
 * Parses a salt environment variable value.
 * If a number string value is given tries to parse it as a number of rounds to generate a salt
 * @param value salt environment variable value
 * @returns salt or number of rounds to generate a salt
 */
export function parseSalt(value: number): Salt {

    const rounds = Number(value);

    if (Number.isNaN(rounds)) {
        return value;
    }
    if (!Number.isInteger(rounds) || rounds < 0) {
        throw AuthenticationError("BCRYPT_SALT must be a positive integer or text");
    }
    return rounds;
}
