import { ErrorMessages } from "@/serverConfig";
import { ApiError } from "@/utils/types/api";
import bcrypt from "bcryptjs-react";

bcrypt.setRandomFallback((len) => {
  const buf = new Array<number>(len);

  return buf.map(() => Math.floor(Math.random() * 256));
});

const salt = bcrypt.genSaltSync(10);
const pepper = "xd12-yn87g-pO0l1";

export function SaltyPass(password: string) {
  return bcrypt.hashSync(classicCombo(password), salt);
}

export function checkPassword(input: string, saved: string) {
  if (!bcrypt.compareSync(classicCombo(input), saved))
    throw new ApiError(ErrorMessages.INVALID_EMAIL_PASSWORD_ERROR, {status: 400});
}

function classicCombo(salt: string) {
  return `${salt}-${pepper}`;
}
