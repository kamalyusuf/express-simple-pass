import express from "express";
import cookieparser from "cookie-parser";
import { view } from "./utils.js";
import path from "node:path";
import fs from "node:fs";

interface SimplePassOptions {
  verify: (passkey: string) => boolean | Promise<boolean>;
  rootpath?: `/${string}`;
  cookie: { secret: string | string[] } & express.CookieOptions;
  css?: string;
  title?: string;
  labels?: {
    title?: string;
    instruction?: string;
    passkey_placeholder?: string;
    unpass?: string;
    unpassed?: string;
  };
}

const COOKIE_NAME = `simplepass.passed`;

export class SimplePass {
  #rootpath: string;

  #app: express.Application;

  #verify: SimplePassOptions["verify"];

  #secret: SimplePassOptions["cookie"]["secret"];

  #cookie: express.CookieOptions;

  #css?: SimplePassOptions["css"];

  #title?: SimplePassOptions["title"];

  #labels?: SimplePassOptions["labels"];

  constructor({
    rootpath = "/simplepass",
    verify,
    css,
    title,
    labels,
    ...options
  }: SimplePassOptions) {
    const { secret, ...cookie } = options.cookie;

    this.#app = express();

    this.#rootpath = rootpath;
    this.#verify = verify;
    this.#secret = secret;
    this.#cookie = cookie;
    this.#title = title;
    this.#labels = labels;

    if (css)
      this.#css = path.isAbsolute(css) ? fs.readFileSync(css, "utf-8") : css;
  }

  static passed(req: express.Request): boolean {
    const cookies = req.signedCookies as undefined | Record<string, any>;

    if (cookies === undefined)
      throw new Error(
        "Cookies are undefined. Ensure that the cookie-parser middleware is applied"
      );

    if (!cookies[COOKIE_NAME]) return false;

    return cookies[COOKIE_NAME] === "true";
  }

  usepass(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!SimplePass.passed(req))
      return res.redirect(
        `${this.#rootpath}?redirect=${encodeURIComponent(req.originalUrl)}`
      );

    next();
  }

  router() {
    this.#initialize();
    this.#routes();

    return this.#app;
  }

  #routes() {
    this.#route({
      method: "get",
      path: `${this.#rootpath}/un`,
      handler: ({ req, res }) => {
        if (!SimplePass.passed(req)) throw new Error("Not authorized");

        res.clearCookie(COOKIE_NAME);

        res.redirect(`${this.#rootpath}?un=true`);
      }
    });

    this.#route({
      method: "get",
      path: this.#rootpath,
      handler: ({ req, res }) => {
        res.render(view("pass"), {
          redirect: req.query.redirect,
          un: req.query.un === "true"
        });
      }
    });

    this.#route({
      method: "post",
      path: this.#rootpath,
      handler: async ({ req, res }) => {
        const passkey = (req.body as Record<string, unknown>).passkey;
        const redirect = req.query.redirect as string | undefined;

        if (typeof passkey !== "string") throw new Error("Passkey is required");

        if (!(await this.#verify(passkey)))
          throw new Error("Incorrect passkey");

        if (SimplePass.passed(req)) throw new Error("Already authenticated");

        res
          .cookie(String(COOKIE_NAME), "true", {
            maxAge: 12 * 60 * 60 * 1000,
            ...this.#cookie,
            httpOnly: true,
            signed: true
          })
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          .redirect(redirect || "/");
      }
    });
  }

  #initialize() {
    this.#app.set("view engine", "pug");
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(cookieparser(this.#secret) as express.RequestHandler);

    this.#app.use((_req, res, next) => {
      res.locals.rootpath = this.#rootpath;
      res.locals.css = this.#css;
      res.locals.title = this.#title;
      res.locals.labels = this.#labels ?? {};

      next();
    });
  }

  #route({
    path,
    handler,
    method
  }: {
    method: "get" | "post";
    path: string;
    handler: (t: { req: express.Request; res: express.Response }) => any;
  }) {
    this.#app[method](path, async (req, res) => {
      try {
        await handler({ req, res });
      } catch (e) {
        res.render(view("pass"), {
          error: (e as Error).message,
          redirect: req.query.redirect
        });
      }
    });
  }
}
