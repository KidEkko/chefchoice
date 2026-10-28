import { ApiError } from "@/utils/types/response";
import bcrypt from "bcryptjs-react";

bcrypt.setRandomFallback((len) => {
  const buf = new Array<number>(len);

  return buf.map(() => Math.floor(Math.random() * 256));
});

const salt = bcrypt.genSaltSync(10);
const pepper = "xd12-yn87g-pO0l1"; // TODO: Update this.

export function SaltyPass(password: string) {
  return bcrypt.hashSync(classicCombo(password), salt);
}

export function checkPassword(input: string, saved: string) {
  if (!bcrypt.compareSync(classicCombo(input), saved))
    throw new ApiError("Incorrect email/password", 400);
}

function classicCombo(password: string) {
  return `${password}-${pepper}`;
}
