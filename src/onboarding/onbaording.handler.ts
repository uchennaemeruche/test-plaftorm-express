import { Request, Response, Router } from "express";
import { OnboardingService } from "./onboarding.service";
import { UserCreatePayload } from "../user/user.service";

export class OnboardingRouteHandler{
    public router:Router = Router()
    constructor(private service: OnboardingService){
        this.init()
    }

    init(){
        this.router.post('/auth/register', async(req: Request, res: Response) =>{
            try {
                const body:UserCreatePayload = req.body
                const result = await this.service.register(body)
                return res.json(result)
            } catch (error) {
                return res.json(error)
            }
        })
    }
}