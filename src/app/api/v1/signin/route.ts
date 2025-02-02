import {NextResponse} from "next/server";
import {SignInAction} from "@/server/apiCalls";
import logger from "@/utils/logger";

export async function POST(req: Request, res: Response) {
    const {email, password} = await req.json();
    if (!email || !password) {
        return NextResponse.json({
            message: "email and password is required"
        }, {
            status: 400
        })
    }
    try {
        const signInResult = await SignInAction(email, password);
        if (!signInResult) {
            return NextResponse.json({
                message: "Invalid email or password"
            }, {
                status: 401
            });
        }
        return NextResponse.json({
            message: "success",
            data: signInResult
        }, {
            status: 200
        });
    } catch (error) {
        logger.error("SignInAction failed", {error});
        return NextResponse.json({
            message: "Failed to sign in due to an internal error"
        }, {
            status: 500
        });
    }
}