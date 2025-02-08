import {auth} from "@/auth";
import {cache} from "react";

export const Session = cache(async () => {
    const session = await auth();
    if (!session) {
        return null;
    }
    return session;
});