import { NextFunction, Request, Response } from 'express';

/**
 * Utility middleware functions.
 * No need for try/catch block. Simple throw Error instance and it will be handled.
 */
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default (execution: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    execution(req, res, next).catch(next);
};
