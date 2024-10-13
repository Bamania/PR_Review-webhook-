import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { headers } from "next/headers";

export default async function ssrpage(){
//@ts-ignore
const result=await fetch("http://localhost:3000/api/test",{
    method: "GET",
    headers: headers()
  })
console.log("result",result)
return (<div>hello</div>)

}