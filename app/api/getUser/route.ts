import { ChefResponse, GenericHandler } from "@/app/api/utils/_utils"; 
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
 
  // Return only username. Don't want the ID or role visible in network traffic.
  resp.setData({ username: session.username });
  return
}
