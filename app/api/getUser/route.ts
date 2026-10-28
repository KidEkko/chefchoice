import { ChefResponse, GenericHandler, sql } from "@/app/api/utils/_utils"; 
import { createLocalSession, verifySession } from "@/lib/session"; 

const PROCESS = "Get User Via Token";
export async function GET(req: Request) {
  return await GenericHandler(req, getUserWithToken, PROCESS);
}

async function getUserWithToken(req: Request, resp: ChefResponse) {
  const session = await verifySession();
  if (!session) {
    if (process.env.ENV === "CHEF_DEV") {
      const local = await createLocalSession();
      resp.setData(local);
    }
    return
  }

  const data = { username: session.username };

  resp.setData(data);
  return
}
