# lendsqr-be-demo-wallet

-- Wallet
    * Create Wallet: A wallet will hold the user's account and card details.
    -- Create User
            ->
    -- User Login
        KYC 
            -> BVN
            -> upload and Verify documents
    -- Create Account
        -> Create account number for onboarded user
    -- Fund Account
    -- Transfer Funds to another user's account
    -- Withdraw funds from own account


Services:

    - User Service
    - Account Service
    


Implementation Consideration:

User can fund wallet with Debit Card. 
    -> After successfully debiting the user's card, deposit the money into the user's account.
User can fund wallet by transfering to the account number assigned to the user.


Create a **Transactions** table that will hold all transactions.
The balance of a user's wallet is the sum of money sent to the account number assigned to the user.




How to I generate an account number for the user?
    -> Do I need a prefix, If yes what would the prefix be?
    -> Do I need to use user's details as part of the parameters for generating the account number? 
        -> If yes, what user details will be needed?
    -> What is the length of the account number? 10 or something else?
    -> How many random numbers can be generated from the range selected?

What constitutes a wallet?
    -> How do I create a wallet for a user?
    -> Is the wallet directly tied to the generated account number?

Transactions?
    -> How do I integrate with payment processors?
    -> How do I fund a wallet
        -> How do I charge a user's card and credit his/wallet
        -> If a user opts in for a bank transfer, how do I handle that?
    -> How do I handle duplicate transactions (card charges)?
    -> How do I handle recurring charges/transactions?
    -> How do I handle payment processing errors?
        -> What are possible errors that can be returned by the processor?
            -> When the request times out, what happens?
            -> Do I need a webhook to receive credit events from payment processors?
                -> If a request hits the webhook endpoint what happens?
                    -> Do I save, credit/debit the user's account and send response to the processor.
                    -> Do I just send a response to the processor and do nothing else.
                





EVENTS:

Every request creates an event.