
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

    async addAdminLogToken(req: Request, res: Response) {
        return await userLogin.addAdminLogToken(req, res);
    }

    async updateAdminTokenLog(req: Request, res: Response) {
        return await userLogin.updateAdminTokenLog(req, res);
    }

    async tokenValidation(req: Request, res: Response) {
        return await userLogin.tokenValidation(req, res);
    }
}

export default UserLogin;