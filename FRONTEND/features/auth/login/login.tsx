"use client";

import LoginForm from "./LoginForm";
import type { LoginProps } from "./types";

export default function Login(props: Readonly<LoginProps>) {
  return <LoginForm {...props} />;
}
