
import { auth } from "./auth.js"
import { prisma } from "./primsa.js";

export const getGithubToken=async ()=>{
    const session=await auth.api.getSession();
    if(!session){
         throw new Error("");
    }
    const account=await prisma.account.findFirst({
        where:{
            userId:session.user.id,
            providerId:"github"

        }
    })

    if(!account?.accessToken){
     throw new Error("No github")
    }
    return account?.accessToken;
}

