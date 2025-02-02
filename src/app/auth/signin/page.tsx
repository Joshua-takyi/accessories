import SignInPage from "@/app/auth/signin/signin";
import {GetSession} from "@/utils/getSession";
import {redirect} from "next/navigation";

export default async function SignIn() {
    const session = await GetSession()
    if (session?.user) {
        redirect("/")
    }
    return <div>
        <SignInPage/>
    </div>;
}