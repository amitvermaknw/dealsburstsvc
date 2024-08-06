import { NextFunction, Request, Response } from "express";
import AdminLoginServices from "../../services/db/adminLoginService";

const adminLoginSvc = new AdminLoginServices();

class AdminLogin {
    async login(req: Request, res: Response) {
        return await adminLoginSvc.login(req, res);
    }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        return await adminLoginSvc.validateToken(req, res, next);
    }

    async addAdminLogToken(req: Request, res: Response) {
        return await adminLoginSvc.addAdminLogToken(req, res);
    }

    async updateAdminTokenLog(req: Request, res: Response) {
        return await adminLoginSvc.updateAdminTokenLog(req, res);
    }

    async tokenValidation(req: Request, res: Response) {
        return await adminLoginSvc.tokenValidation(req, res);
    }
}

export default AdminLogin;