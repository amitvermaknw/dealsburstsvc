import { NextFunction, Request, Response } from "express";
import AdminLoginServices from "../../services/db/adminLoginService";

const adminLogin = new AdminLoginServices();

class Login {
    async login(req: Request, res: Response) {
        return await adminLogin.login(req, res);
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        return await adminLogin.validateToken(req, res, next);
    }

    async addAdminLogToken(req: Request, res: Response) {
        return await adminLogin.addAdminLogToken(req, res);
    }

    async updateAdminTokenLog(req: Request, res: Response) {
        return await adminLogin.updateAdminTokenLog(req, res);
    }
}

export default Login;