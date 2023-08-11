import { PasswordAuth } from "@/types";

export const getAuthUrl = (url: string, auth: PasswordAuth) => {
  const authUrl = new URL(url);
  authUrl.username = auth.username;
  authUrl.password = auth.password;
  return authUrl.toString();
};
