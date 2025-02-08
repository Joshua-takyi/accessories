import {SignIn} from "@/app/auth/signin/sign-in";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function SignInPage() {
    const session = await auth()
    console.log(session)
    if (session?.user) {
        redirect("/")
    }
    return (
        <main>
            <SignIn/>
        </main>
    )
}