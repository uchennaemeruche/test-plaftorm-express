
import { Wallet } from "../wallet/wallet.service";
import knex from 'knex'

import { getTracker, MockClient, Tracker } from 'knex-mock-client';

jest.mock('../db/db.knex', () => {
  return {
    db: knex({ client: MockClient, dialect: 'mysql2' })
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

  const walletMockValue:Wallet = {
    id: 1,
    account_number: '2411243',
    user_id: 1,
    user_uid: 'werwrw',
    balance: 100,
    is_active: true,
    ...userPayload
  }

  let tracker: Tracker

  beforeAll(() => {
    tracker = getTracker();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should create a wallet successfully', async () => {

    tracker.on.insert('users').response([1]);
    tracker.on.insert('wallets').response(walletMockValue);

    const user = await db.table('users').insert(userPayload)

    const wallet = await db.table<Wallet>('wallets').insert({user_id: user[0]}) as Wallet

    expect(wallet.id).toEqual(walletMockValue.id)
    expect(wallet.user_id).toEqual(user[0])
    expect(wallet.balance).toEqual(100)
  })
})