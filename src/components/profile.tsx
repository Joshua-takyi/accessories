import {GetSession} from "@/utils/getSession";
import Link from "next/link";
import {User} from "lucide-react";

export default async function Profile() {
    const session = await GetSession()
    if (!session?.user) {
        return (
            <Link href={`/auth/signin`}>
                <button className="btn btn-primary">
                    log in
                </button>
            </Link>
        )
    } else {
        return (
            <Link href={`/profile/${session.user.id}`}>
                <User/>
            </Link>
        )
    }
}