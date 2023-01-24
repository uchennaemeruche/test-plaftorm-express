import { randomUUID } from "crypto"
import { creditAccount, debitAccount, TransactionPurpose, TransactionType } from "./transaction.helper"
import { Wallet, WalletService } from "../wallet/wallet.service";
import knex from 'knex'
import { User, UserService } from "../user/user.service";
import { AuthService } from "../auth/auth.service";
import { PasswordService } from "../auth/password.service";
import { ConfigService } from "../config";
import { JWTService } from "../auth/token/jwt.service";
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { LocalNodeCache } from "../cache/node.cache";
import { IMemoryCache } from "../cache";
import { TransactionService } from "./transaction.service";

const dbconfig = new ConfigService()

jest.mock('../db/db.knex', () => {
  return {
    db: knex({ client: MockClient })
  };
});

describe('TransactionHelper', () => {

  const db = knex({
    client: MockClient,
    dialect: 'mysql2', // can be any Knex valid dialect name.
  });

  const userPayload = {
    firstname: 'John',
    lastname: 'Doe',
    othernames: "K",
    address: "test address",
    email: 'test@test.com',
    phone: "080321",
    password: 'test_password',
    bvn: ""
  }

  const userMockValue: User = {
    ...userPayload,
    id: 1,
    uid: '3ieiwiwe'
  }

  const walletMockValue: Wallet = {
    id: 1,
    user_id: 1,
    account_number: '2222',
    user_uid: 'werwrw',
    balance: 100,
    is_active: true,
    ...userPayload
  }

  let tracker: Tracker

  const walletSrv = new WalletService(db)
  const userSrv = new UserService(db)
  const authSrv = new AuthService(userSrv, new PasswordService(dbconfig), new JWTService('uewiiw'))
  const cacheSrv: IMemoryCache = new LocalNodeCache()
  const transactionService = new TransactionService(cacheSrv, db)

  beforeAll(() => {
    tracker = getTracker();
  });

  afterEach(() => {
    tracker.reset();
  });

  beforeEach(async () => {

    tracker.on.insert('users').response([1]);
    tracker.on.select('users').response(userMockValue)
    tracker.on.insert('wallets').response(walletMockValue);
    tracker.on.select('wallets').response(walletMockValue)
    tracker.on.update('wallets').response(1)
    tracker.on.select('accounts').response([1])
    tracker.on.insert('transactions').response([1])

  })

  it('should credit account successfully', async () => {
    const payload = {
      account_id: 1,
      purpose: TransactionPurpose.deposit,
      amount: 100,
      txn_type: TransactionType.credit,
      description: '',
      reference: randomUUID(),
      trx: await db.transaction()
    }
    const result = await creditAccount(payload)

    const insertHistory = tracker.history.insert;

    expect(result).toEqual({
      success: true, 
      message: 'Wallet credited successfully'
    })
    expect(insertHistory).toHaveLength(1)
    expect(insertHistory[0].method).toEqual('insert')
    const {trx, ...payloadWithoutTrx} = payload
    insertHistory[0].bindings.some((binding) => Object.values(payloadWithoutTrx).includes(binding))
  })
  it('should debit an account successfully', async () => {
    const payload = {
      account_id: 1,
      purpose: TransactionPurpose.deposit,
      amount: 100,
      txn_type: TransactionType.credit,
      description: '',
      reference: randomUUID(),
      trx: await db.transaction()
    }
    const result = await debitAccount(payload)

    const insertHistory = tracker.history.insert;

    expect(result).toEqual({
      success: true, 
      message: 'Wallet debited successfully'
    })
    expect(insertHistory).toHaveLength(1)
    expect(insertHistory[0].method).toEqual('insert')
    const {trx, ...payloadWithoutTrx} = payload
    insertHistory[0].bindings.some((binding) => Object.values(payloadWithoutTrx).includes(binding))
  })


})