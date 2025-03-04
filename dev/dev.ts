import express from "express";
import { SimplePass } from "../dist/index.js";

const app = express();

const simplepass = new SimplePass({
  type: "passkey",
  rootpath: "/pass",
  verify(passkey) {
    return passkey === "kamal";
  },
  cookie: {
    secret: "superduperlongsecuresecret"
  }
});

app.use(simplepass.router());

app.get("/", (_req, res) => {
  res.send("/");
});

app.get(
  "/passed",
  (req, res, next) => simplepass.usepass(req, res, next),
  (_req, res) => {
    res.send("passed");
  }
);

const port = "8000";

app.listen(+port, () => {
  console.log(`🚀 http://localhost:${port}`);
});
