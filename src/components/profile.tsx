import {Session} from "@/utils/session";
import Link from "next/link";
import {User} from "lucide-react";
import {Button} from "@/components/ui/button";

export default async function Profile() {
    const session = await Session()
    if (!session?.user) {
        return (
            <Link href={`/auth/signin`}>
                <Button>
                    Login
                </Button>
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