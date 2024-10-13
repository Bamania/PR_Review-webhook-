import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import getdetails from "../../important"




export async function GET(req: NextRequest, res: NextResponse){
    const data=getdetails();
    return NextResponse.json({result:data})
}
// export async function GET(req:NextRequest,res:NextResponse){

//     const result=await fetch("http://localhost:3000/api/test",{
//         method: "GET",
//         headers: headers()
//       })
//       const data=await result.json();
//     console.log("result",data)
//     return NextResponse.json({result:data})
// }

// export  default async function getsession(){

//     const result=await fetch("http://localhost:3000/api/test",{
//         method: "GET",
//         headers: headers()
//       })
//     console.log("result",result)
//     return NextResponse.json({result:result})
// }


// const result=getsession();
// console.log("result",result)
