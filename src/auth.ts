import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { UserAuth } from "@/models/schema";
import bcrypt from "bcryptjs";
import ConnectDb from "@/utils/connect";

interface UserCredentials {
    email: string;
    password: string;
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials as UserCredentials;
                if (!email || !password) {
                    return null;
                }
                await ConnectDb();
                const user = await UserAuth.findOne({ email: email })
                if (!user) {
                    return null;
                }
                const isPasswordValid = await bcrypt.compare(password.toString(), user.password.toString());
                if (!isPasswordValid) {
                    return null;
                }

                // Format the returned user object to match NextAuth's expected `User` type
                return {
                    id: user._id, // Ensure this is a string
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            }

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    }
});