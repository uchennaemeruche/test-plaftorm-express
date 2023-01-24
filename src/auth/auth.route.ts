import { Request, Response, Router } from "express";
import { AuthService, Credentials } from "./auth.service";

export class AuthRouteHandler{
    public router:Router = Router()
    constructor(private service: AuthService){
        this.init()
    }
    init(){
        this.router.post('/auth/login', async(req: Request, res: Response) =>{
            try {
                const body:Credentials = req.body
                const result = await this.service.login(body)
                return res.json(result)
            } catch (error) {
                return res.json(error)
            }
        })

        
    }
}