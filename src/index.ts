/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Express, RequestHandler, Request } from "express";
import { h, view } from "./utils";

let path = "/pass";

const usesession: RequestHandler = (req, res, next) => {
  if (!req.session)
    throw new Error(
      "req.session was not found. install 'cookie-session' package and add as middleware"
    );

  next();
};

export const usepass: RequestHandler = (req, res, next) => {
  if (!req.session?.pass) return res.redirect(path);

  next();
};

export const haspassed = (req: Request) => !!req.session?.pass;

export const simplepass = ({
  app,
  rootpath,
  passkey: PASS_KEY,
  redirect
}: {
  app: Express;
  rootpath?: string;
  passkey: string;
  redirect: string;
}) => {
  if (rootpath) path = rootpath;

  app.get(
    `${path}/un`,
    h((req, res, next) => usesession(req, res, next)),
    usepass,
    h((req, res) => {
      req.session = null;

      res.send("ok");
    })
  );

  app.get(
    path,
    h((req, res, next) => usesession(req, res, next)),
    (req, res, next) => {
      if (haspassed(req)) return res.redirect(redirect);

      next();
    },
    h((_req, res) => {
      res.render(view("pass"), { path });
    })
  );

  app.post(
    path,
    h((req, res, next) => usesession(req, res, next)),
    (req, res, next) => {
      if (haspassed(req)) return res.redirect(redirect);

      next();
    },
    h((req, res) => {
      const passkey = (req.body as Record<string, unknown>).passkey;

      if (typeof passkey === "undefined")
        throw new Error(
          "passkey is required. perhaps you forgot to do express.urlencoded"
        );

      if (passkey !== PASS_KEY)
        return res.render(view("pass"), { error: "incorrect pass key", path });

      if (req.session) req.session.pass = true;

      res.redirect(redirect);
    })
  );
};
