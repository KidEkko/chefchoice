import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils";
import { verifySession } from "@/lib/session";
import { ApiError } from "@/utils/classes/response";


const PROCESS = "Get Meal Prep";
export async function GET(req: Request) {
  return await GenericHandler(req, getMealPrep, PROCESS);
} 

async function getMealPrep(req: Request, resp: ChefResponse) {
  const recipe = await req.json();

  const session = await verifySession();
  if (!session) 
      throw new ApiError("", 400, "")
  



  
  return;
}
