Create a wallet with the user id

wallet holds account balance

transactions will reference wallet id

Generate an account number and assign it to a wallet



Account Table:
    account_number
    wallet_id
    account_type
    bank_name
    bank_code
    account_ref
    is_active: boolean
    meta: json


Wallet Table
    user_id
    balance
    account_id
    is_active: boolan
    timestamps



Accounts and Wallet models were seperated because a new account number can be assigned to a wallet due to many reasons. E.g: 
1. If the issuing bank(the bank that issues the account numbers) changes.)
2. A wallet/user can have accounts in different currencies.



A user can fund their account:
    - Deposit
    - Card Payment




Create Error Types:
    TransactionError 
    AccountError
    UserError

Add Errors to logger