import { Wallet } from "../wallet/wallet.service";
import knex from 'knex'
import { User } from "../user/user.service";
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { LocalNodeCache } from "../cache/node.cache";
import { IMemoryCache } from "../cache";
import { TransactionService } from "./transaction.service";


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
        account_number: '314121212',
        id: 1,
        user_id: 1,
        user_uid: 'werwrw',
        balance: 100,
        is_active: true,
        ...userPayload
    }

    let tracker: Tracker

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


    it('should deposit to account successfully', async () => {
        // const wallet = await walletSrv.createWallet(user[0])

        const payload = {
            account_id: 1,
            amount: 200
        }
        const result = await transactionService.deposit({...payload})
        const insertHistory = tracker.history.insert;

        expect(result).toEqual({
            success: true,
            message: 'Wallet credited successfully'
        })
        expect(insertHistory).toHaveLength(1)
        expect(insertHistory[0].method).toEqual('insert')
        expect(insertHistory[0].bindings).toContain('credit')
        expect(insertHistory[0].bindings).toContain(payload.account_id)
        expect(insertHistory[0].bindings).toContain(payload.amount)
    })
    it('should withdraw from account successfully', async () => {
        const payload = {
            account_id: 1,
            amount: 100
        }
        const result = await transactionService.withdraw({...payload})
        const insertHistory = tracker.history.insert;

        expect(result).toEqual({
            success: true,
            message: 'Wallet debited successfully'
        })
        expect(insertHistory).toHaveLength(1)
        expect(insertHistory[0].method).toEqual('insert')
        expect(insertHistory[0].bindings).toContain('withdrawal')
        expect(insertHistory[0].bindings).toContain(payload.account_id)
        expect(insertHistory[0].bindings).toContain(payload.amount)
    })
    it('should transfer money to account successfully', async () => {
        const payload = {
            to_account_id: 1,
            from_account_id: 2,
            amount: 100
        }
        const result = await transactionService.transfer(payload.amount, payload.to_account_id, payload.from_account_id)
        const insertHistory = tracker.history.insert;

        expect(result).toEqual({
            success: true,
            message: 'Transfer processed successfully'
        })
        expect(insertHistory).toHaveLength(2)
        expect(insertHistory[0].method).toEqual('insert')
        expect(insertHistory[0].bindings).toContain('transfer')
        expect(insertHistory[0].bindings).toContain(payload.amount)
    })


})