import { ApiError } from "@util/classes/response";
import bcrypt from "bcryptjs-react";

bcrypt.setRandomFallback((len) => {
  const buf = new Array<number>(len);

  return buf.map(() => Math.floor(Math.random() * 256));
});

const salt = bcrypt.genSaltSync(10);
const pepper = "ba41-83rhG-3XaqLn"; // TODO: Update this.

export function SaltyPass(password: string) {
  return bcrypt.hashSync(classicCombo(password), salt);
}

export function checkPassword(input: string, saved: string) {
  if (!bcrypt.compareSync(classicCombo(input), saved))
    throw new ApiError("Incorrect email/password", 400, "");
}

function classicCombo(password: string) {
  return `${password}-${pepper}`;
}
