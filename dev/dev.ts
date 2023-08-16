import "express-async-errors";
import express from "express";
import cookiesession from "cookie-session";
import { simplepass, usepass } from "../src";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookiesession({
    signed: false,
    secure: false,
    maxAge: 300000
  })
);

simplepass({
  app,
  redirect: "/passed",
  passkey: "pass"
});

app.get("/", (_req, res) => res.send("/"));

app.get("/passed", usepass, (_req, res) => res.send("passed"));

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    return res.status(500).send({ error: error.message });
  }
);

// eslint-disable-next-line
require("express-list-routes")(app);

(() => {
  const port = 8000;

  app.listen(port, () => {
    console.log(`app on http://localhost:${port}`);
  });
})();
