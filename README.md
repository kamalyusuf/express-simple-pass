# express-simple-pass

An express middleware for protecting admin UIs and dashboards with a simple password gate. Perfect for securing monitoring tools, admin panels, and internal dashboards without implementing a full authentication system

## Why?

Many packages like bull board, agendash, or swagger UI provide useful admin interfaces that need to be protected from public access. However, protecting these routes usually means you need to:

- Build custom login pages
- Handle form submissions
- Manage sessions/cookies
- Set up authentication routes
- Create template/views

`express-simple-pass` eliminates all of this busywork. No need to build custom login pages, handle sessions, or manage authentication flows. Just wrap your routes with the middleware, and you get a clean, functional password gate

## Features

- 🔒 Simple password protection for any express route
- 🎨 Customizable login page with custom css support
- 🍪 Cookie-based authentication (no session setup needed)
- ↩️ Automatic redirect after authentication
- 🔄 Flexible password verification
- 📝 No need to create views or handle form submissions

## Installation

```bash
npm install express-simple-pass
# or
yarn add express-simple-pass
# or
pnpm add express-simple-pass
```

## Usage

### Basic Example

```typescript
import express from "express";
import { SimplePass } from "express-simple-pass";
import Agendash from "agendash";
import agenda from "./agenda-instance"; // example agenda instance
import argon2 from "argon2";

const app = express();

const simplepass = new SimplePass({
  verify: (passkey) => argon2.verify(process.env.PASS_KEY_HASH, passkey),
  cookie: {
    secret: "superduperlongsecuresecret"
  }
});

app.use(simplepass.router());

app.use(
  "/agendash",
  (req, res, next) => simplepass.usepass(req, res, next),
  Agendash(agenda)
);

app.listen(3000);
```

### Protecting Routes

You can use the `usepass` middleware to guard any route or set of routes. Ff a request hasn’t authenticated, they’ll be redirected to the authentication page

```typescript
app.use(
  "/admin",
  (req, res, next) => simplepass.usepass(req, res, next),
  adminroutes
);
```

### Configuration Options

#### `SimplePassOptions`

| Property   | Type                                                                                                         | Description                                                                                                                                                                     | Default Value                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verify`   | `(passkey: string) => boolean \| Promise<boolean>`                                                           | A function that takes a passkey as input and returns a boolean or a Promise that resolves to a boolean indicating whether the passkey is valid.                                 | **required**                                                                                                                                                    |
| `rootpath` | `string`                                                                                                     | An optional string that specifies the root path for the middleware. It should start with a `/`.                                                                                 | N/A                                                                                                                                                             |
| `cookie`   | `{ secret: string \| string[] } & express.CookieOptions`                                                     | An object that contains cookie options. The `secret` property is required and can be a string or an array of strings. The other properties are standard Express cookie options. | `{ maxAge: 12 * 60 * 60 * 1000 }`                                                                                                                               |
| `css`      | `string`                                                                                                     | An optional string that specifies the path to a custom CSS file to style the login page.                                                                                        | N/A                                                                                                                                                             |
| `title`    | `string`                                                                                                     | An optional string that specifies the title of the login page.                                                                                                                  | N/A                                                                                                                                                             |
| `labels`   | `{ title?: string; instruction?: string; passkey_placeholder?: string; unpass?: string; unpassed?: string }` | Customize static text displayed on the authentication page. Defaults are provided if not specified                                                                              | `{ title: "Authentication", instruction: "Enter the pass key to continue", passkey_placeholder: "Enter the pass key", unpass: "Unpass", unpassed: "Unpassed" }` |

## API

### `simplepass.router()`

Returns an express router that serves the authentication page and handles passkey verification

### `simplepass.usepass(req, res, next)`

Middleware to protect a route. redirects unauthenticated requests to the authentication page

### `SimplePass.passed(req)`

Returns `true` if the request is authenticated

## Customization

You can provide custom css for the authentication page via the `css` option. pass a string of css or an absolute path to a `.css` file:

```typescript
const simplepass = new SimplePass({
  css: "C:/users/john/path/to/styles.css",
  title: "Admin Access"
});
```

Key css classes and ids you can target:

```css
.container {
  /* Main form container */
}

.title {
  /* "Authentication" title */
}

.instruction {
  /* "Enter the pass key to continue" text */
}

form {
  /* Form element - controls layout of inputs and buttons */
}

form button {
  /* Submit button */
}

#passkey {
  /* Passkey input field */
}

.message.error {
  /* Error message styling */
}

.message.success {
  /* Success message styling */
}

.unpass {
  /* Unpass/logout link */
}
```
