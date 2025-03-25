export const getToken = (url: string) => {
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const authHeader = queryParams.get("token") || "";
  const token = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"

  return token;
};
