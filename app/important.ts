import { headers } from "next/headers"

export  default async function getdetails(){

    const result=await fetch("http://localhost:3000/api/test",{
        method: "GET",
        headers: headers()
      })
      const data=await result.json();
    console.log("result",result)
    return data
}
