
import { PasswordService } from "./password.service";
import * as bcrypt from "bcrypt";

const EXAMPLE_PASSWORD = "examplePassword";
const EXAMPLE_HASHED_PASSWORD = "exampleHashedPassword";

const EXAMPLE_SALT_OR_ROUNDS = 1;

const configServiceGetMock = jest.fn(() => {
  return EXAMPLE_SALT_OR_ROUNDS;
});

jest.mock("bcrypt");

//@ts-ignore
bcrypt.hash.mockImplementation(async () => EXAMPLE_HASHED_PASSWORD);

//@ts-ignore
bcrypt.compare.mockImplementation(async () => true);

describe("PasswordService", () => {
  let service: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    

    service ={
        compare:async (password:string, hashedPassword: string) => {
            return true
        },
        hash:async (password:string) => {
            return EXAMPLE_HASHED_PASSWORD
        },
        salt: EXAMPLE_SALT_OR_ROUNDS
    }
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should have salt defined", () => {
    expect(service.salt).toEqual(EXAMPLE_SALT_OR_ROUNDS);
  });

  it("should compare a password", async () => {
    const args = {
      password: EXAMPLE_PASSWORD,
      hashedPassword: EXAMPLE_HASHED_PASSWORD,
    };
    await expect(
      service.compare(args.password, args.hashedPassword)
    ).resolves.toEqual(true);
  });

  it("should hash a password", async () => {
    await expect(service.hash(EXAMPLE_PASSWORD)).resolves.toEqual(
      EXAMPLE_HASHED_PASSWORD
    );
  });
});
