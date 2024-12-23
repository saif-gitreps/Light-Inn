import { Request, Response, NextFunction } from "express";

export const asyncHandler = <T>(
   requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(requestHandler(req, res, next)).catch((error) => {
         console.error("Error in async handler:", error);

         if (res.headersSent) {
            return next(error);
         }

         const statusCode = error.statusCode || 500;
         const message = error.message || "Internal server error";

         res.status(statusCode).json({
            success: false,
            message: message,
            ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
         });
      });
   };
};
