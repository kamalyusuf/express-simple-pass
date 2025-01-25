import type { CookieOptions } from "express";

export interface SimplePassOptions<T extends PassType> {
  type: T;
  verify: T extends "passkey"
    ? PassKeyAuthenticationFunction
    : T extends "email-password"
      ? EmailPasswordAuthenticationFunction
      : never;
  cookie: { secret: string | string[] } & CookieOptions;
  rootpath?: `/${string}`;
  css?: string;
  title?: string;
  labels?: {
    title?: string;
    instruction?: string;
    passkey_placeholder?: string;
    email_placehoder?: string;
    unpass?: string;
    unpassed?: string;
  };
}

export type PassType = "passkey" | "email-password";

export type PassKeyAuthenticationFunction = (
  passkey: string
) => boolean | Promise<boolean>;

export type EmailPasswordAuthenticationFunction = (
  email: string,
  password: string
) => boolean | Promise<boolean>;
