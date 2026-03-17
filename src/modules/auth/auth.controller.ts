import { sendResponse } from "../../helper/sendResponse";
import { TryCatch } from "../../utils/TryCatch";
import { registerService } from "./auth.service";

export const registerUser = TryCatch(async (req, res, next) => {
  const payload = req.body;
  //   console.log(payload);

  const register = await registerService(payload);

  console.log(register);

  sendResponse(res, 200, "User created successfully", register);
});
