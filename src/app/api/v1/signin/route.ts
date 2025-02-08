import {NextResponse} from "next/server";
import {SignInAction} from "@/server/apiCalls";

export async function POST(req: Request) {
    const {email, password} = await req.json()
    try {
        const res = await SignInAction({email, password})
        if (!res) {
            return NextResponse.json({
                message: `an error occured whiles logging in`,
            }, {
                status: 401
            })
        }
        return NextResponse.json({
            message: `successfully logged in`,
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: `failed to sign in`,
            error: error instanceof Error ? error.message : error
        })
    }
}