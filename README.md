# express-simple-pass

an express middleware for protecting admin UIs and dashboards with a simple password gate. perfect for securing monitoring tools, admin panels, and internal dashboards without implementing a full authentication system

## Why?

many packages like bull board, agendash, or swagger UI provide useful admin interfaces that need to be protected from public access. however, protecting these routes usually means you need to:

- build custom login pages
- handle form submissions
- manage sessions/cookies
- set up authentication routes
- create template/views

`express-simple-pass` eliminates all of this busywork. no need to build custom login pages, handle sessions, or manage authentication flows. just wrap your routes with the middleware, and you get a clean, functional password gate

## Features

- 🔒 simple password protection for any express route
- 🎨 customizable login page with custom css support
- 🍪 cookie-based authentication (no session setup needed)
- ↩️ automatic redirect after authentication
- 🔄 flexible password verification (supports any hashing method)
- 📝 no need to create views or handle form submissions

## Installation

```bash
npm install express-simple-pass
# or
yarn add express-simple-pass
# or
pnpm add express-simple-pass
```

## Usage

### basic example

```typescript
import express from "express";
import { SimplePass } from "express-simple-pass";
import Agendash from "agendash";
import agenda from "./agenda-instance"; // example agenda instance
import argon2 from "argon2";

const app = express();

const simplepass = new SimplePass({
  verify: (passkey) => argon2.verify(process.env.PASS_KEY_HASH, passkey)
});

app.use(simplepass.router());

app.use(
  "/agendash",
  (req, res, next) => simplepass.usepass(req, res, next),
  Agendash(agenda)
);

app.listen(3000);
```

### protecting routes

you can use the `usepass` middleware to guard any route or set of routes. if a request hasn’t authenticated, they’ll be redirected to the authentication page

```typescript
app.use(
  "/admin",
  (req, res, next) => simplepass.usepass(req, res, next),
  adminroutes
);
```

### configuration options

#### `SimplePassOptions`

| Option     | Type                           | Default       | Description                                                                                      |
|------------|--------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| `verify`   | `(passkey: string) => boolean or Promise<boolean>` | **required** | function to verify the passkey |
| `rootpath` | `string`                      | `/simplepass` | root path for the authentication UI                                                           |
| `cookie`   | `express.CookieOptions`               | `{ httpOnly: true, maxAge: 12 * 60 * 60 * 1000 }`          | options for the authentication cookie                                                         |
| `css`      | `string`                      | `undefined`   | optional css string or file path for custom styles                                             |
| `title`    | `string`                      | `Simple Pass`   | custom title for the authentication page                                                      |

## API

### `simplepass.router()`

returns an express router that serves the authentication page and handles passkey verification

### `simplepass.usepass(req, res, next)`

middleware to protect a route. redirects unauthenticated requests to the authentication page

### `SimplePass.passed(req)`

returns `true` if the request is authenticated

## Customization

you can provide custom css for the authentication page via the `css` option. pass a string of css or an absolute path to a `.css` file:

```typescript
const simplepass = new SimplePass({
  verify: (passkey) => passkey === "my-secret",
  css: "C:/users/john/path/to/styles.css",
  title: "Admin Access"
});
```

key css classes and ids you can target:

```css
.container {
  /* main form container */
}

.title {
  /* "authentication" title */
}

form {
  /* form element - controls layout of inputs and buttons */
}

form button {
  /* submit button */
}

#passkey {
  /* passkey input field */
}

.message.error {
  /* error message styling */
}

.message.success {
  /* success message styling */
}

.unpass {
  /* unpass/logout link */
}
```
