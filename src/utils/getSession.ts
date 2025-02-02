"use server"
import {cache} from "react";
import {auth} from "@/auth";


export const GetSession = cache(async () => {
    const session = await auth()
    if (!session) return null
    return session
})