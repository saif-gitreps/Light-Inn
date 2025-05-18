import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { parse } from "cookie";
import http, { IncomingMessage, ServerResponse } from "http";

declare global {
   namespace Express {
      interface Request {
         userId?: string;
      }
   }
}

interface CustomIncomingMessage extends IncomingMessage {
   userId?: string;
}

export const verifyToken = (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<any> | any => {
   const token = req.cookies["auth_token"];

   if (!token) {
      return res.status(401).json({
         message: "unauthorized",
      });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      req.userId = (decoded as JwtPayload).userId;

      next();
   } catch (error) {
      console.error(error);

      return res.status(401).json({
         message: "unauthorized",
      });
   }
};

export const verifyTokenForWebSocket = (
   req: CustomIncomingMessage,
   res?: ServerResponse
): string | boolean => {
   const cookies = parse(req.headers.cookie || "");
   const token = cookies["auth_token"];

   if (!token) {
      return false;
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      return (req.userId = (decoded as JwtPayload).userId);
   } catch (error) {
      console.error(error);
      return false;
   }
};
