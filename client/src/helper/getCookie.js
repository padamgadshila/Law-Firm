export const getCookie = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export const getToken = () => {
  return `headers: { Authorization: Bearer ${getCookie()} }`;
};
