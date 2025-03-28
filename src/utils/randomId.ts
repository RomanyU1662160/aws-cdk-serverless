import { randomUUID } from "crypto"; //builtin node module

export const generateRandomId = () => {
  const randomId =  randomUUID();
  return randomId
};
