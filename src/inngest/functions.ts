import { inngest } from "./client.js";


export const indexRepo=inngest.createFunction(
  {id:"index-repo"},
  {event:"repository.connected"},
  async ({event,step})=>{
    
  }
)