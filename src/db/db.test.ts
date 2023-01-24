import knex from 'knex'
const knexInstance = knex({ /* configuration */ });


jest.mock('knex', () => {
    return jest.fn().mockImplementation(() => {
      return {
        transaction: jest.fn().mockImplementation(() => {
          return {
            commit: jest.fn(),
            rollback: jest.fn(),
            transactions: jest.fn().mockReturnThis(),
            insert: jest.fn()
          }
        })
      };
    });
  });

//   const trx = jest.fn(() => {
//     return {
//       commit: jest.fn(),
//       rollback: jest.fn(),
//       transactions: jest.fn().mockReturnThis(),
//       insert: jest.fn()
//     }
//   });

describe('DbTransaction', () => {
    const payload = {
        wallet_id: 1, 
        purpose: '',
        account_id: '1', 
        amount: 100, 
        txn_type:'',
        description:'', 
        reference: "uid", 
    }

    it('should perform a transaction', async() =>{
        const t = await knexInstance.transaction()
        const commitSpy = jest.spyOn(t, 'commit');
        const rollbackSpy = jest.spyOn(t, 'rollback');
        
        await t.insert(payload)

        await t.commit()

        expect(t.commit).toHaveBeenCalled()
        expect(commitSpy).toHaveBeenCalled();
        expect(rollbackSpy).not.toHaveBeenCalled();
    })
})