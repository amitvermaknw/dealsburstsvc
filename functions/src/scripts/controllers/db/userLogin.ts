
import { NextFunction, Request, Response } from "express";
import UserLoginServices from "../../services/db/userLoginService";

const userLogin = new UserLoginServices();

class UserLogin {
    async login(req: Request, res: Response) {
        return await userLogin.login(req, res);
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        return await userLogin.validateToken(req, res, next);
    }

    async userSignup(req: Request, res: Response) {
        return await userLogin.userSignup(req, res);
    }

    async userSignupValidate(req: Request, res: Response) {
        return await userLogin.userSignupValidation(req, res);
    }
}

export default UserLogin;