
import { headers } from "next/headers";

export default async function ssrpage(){
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const result=await fetch("http://localhost:3000/api/test",{
    method: "GET",
    headers: headers()
  })
console.log("result",result)
return (<div>hello</div>)

}