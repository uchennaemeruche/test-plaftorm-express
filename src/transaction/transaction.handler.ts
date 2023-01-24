import { Request, Response, Router } from "express";
import { ITransactionPayload, TransactionService } from "./transaction.service";

export class TransactionRouteHandler{
    public router:Router = Router()
    constructor(private service: TransactionService){
        this.init()
    }

    init(){
        this.router.post('/deposit', async(req: Request, res: Response) =>{
            try {
                const body:ITransactionPayload = req.body
                const result = await this.service.deposit(body)
                return res.json(result)
            } catch (error) {
                console.log(error)
                return res.json(error)
            }
        })
        this.router.post('/withdraw', async(req: Request, res: Response) =>{
            try {
                const body:ITransactionPayload = req.body
                const result = await this.service.withdraw(body)
                return res.json(result)
            } catch (error) {
                return res.json(error)
            }
        })
        this.router.post('/transfer', async(req: Request, res: Response) =>{
            try {
                const {amount, to_account, from_account, description} = req.body
                const result = await this.service.transfer(amount, to_account, from_account, description)
                return res.json(result)
            } catch (error) {
                return res.json(error)
            }
        })
    }
}