import type { Request, Response, RequestHandler, NextFunction } from "express";
import path from "path";

export const view = (template: string) =>
  path.join(__dirname, "..", "views", `${template}.pug`);

export const h =
  (
    handler: (req: Request, res: Response, next: NextFunction) => any
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      res.render(view("pass"), { error: (e as Error).message });
    }
  };
