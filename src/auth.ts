import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import {UserAuth} from "@/models/schema";
import bcrypt from "bcryptjs";
import ConnectDb from "@/utils/connect";
import jwt from "jsonwebtoken";

interface UserCredentials {
    email: string;
    password: string;
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                const {email, password} = credentials as UserCredentials;

                if (!email || !password) {
                    throw new Error("Email and password are required.");
                }

                await ConnectDb(); // Ensure the database is connected
                const user = await UserAuth.findOne({email: email}).select(
                    "+password"
                );

                if (!user) {
                    throw new Error("User not found.");
                }

                if (!user.password) {
                    throw new Error("User password is missing.");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password.");
                }
                const accessToken = jwt.sign(
                    {id: user._id, name: user.name, role: user.role},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );
                return {
                    id: user._id.toString(),
                    accessToken: accessToken,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
                token.accessToken = user.accessToken
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user.id = token.id as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.role = token.role as string;
                session.user.accessToken = token.accessToken as string;

                // Don't include the email in the session
                delete session.user.email; // Ensure email is not returned
            }
            return session;
        },
    },
});
