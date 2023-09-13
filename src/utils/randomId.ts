import { randomUUID } from "crypto"; //builtin node module

export const generateRandomId = () => {
  return randomUUID();
};
