import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {UserAuth} from "@/models/schema";  // Assuming this is your Mongoose model
import bcrypt from "bcryptjs";
import ConnectDb from "@/utils/connect";
import jwt from "jsonwebtoken";

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                }
            },
            async authorize(credentials) {

                try {
                    const {email, password} = credentials
                    if (!email || !password) {
                        throw new Error(`email and password are required`)
                    }
                    await ConnectDb()
                    const user = await UserAuth.findOne({email: email}).select("+password")
                    if (!user) {
                        throw new Error("user not registered")
                    }
                    if (!user.email || !user.password) {
                        return null
                    }
                    const isPasswordCorrect = bcrypt.compare(password, user.password)

                    if (!isPasswordCorrect) {
                        throw new Error("passwords do not match")
                    }
                    const accessToken = jwt.sign(
                        {id: user._id, name: user.name, role: user.role},
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1h",
                        }
                    );

                    return {
                        id: user._id,
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        accessToken
                    }
                } catch (error) {
                    throw new Error(`${error instanceof Error ? error.message : String(error)}`)
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
                token.accessToken = user.accessToken
            }
            return token
        },
        async session({session, token}) {
            // Add token data to the session
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.email = token.email;
                session.user.accessToken = token.accessToken; // Add accessToken to the session
            }
            return session;
        },
        async signIn({user, account}) {
            if (account?.provider === "credentials") {
                return true
            }
        }
    }
})