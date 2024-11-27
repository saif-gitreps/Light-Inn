import { Response, NextFunction, Request as ExpressRequest } from "express";
import { nanoid } from "nanoid";

interface Request extends ExpressRequest {
   id: string;
}

export const requestIdHandler = (req: Request, res: Response, next: NextFunction) => {
   req.id = nanoid() as string;
   res.setHeader("X-Request-Id", req.id);
   next();
};
