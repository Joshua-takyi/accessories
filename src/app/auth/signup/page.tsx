import Signup from "@/app/auth/signup/signup";
import {GetSession} from "@/utils/getSession";
import {redirect} from "next/navigation";

export default async function SignupPage() {
    const session = await GetSession()
    if (session?.user) {
        redirect("/")
    }
    return <div>
        <Signup/>
    </div>;
}