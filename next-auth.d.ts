// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }

    interface Session {
        user: {
            id: string;
            firstName?: string;
            lastName?: string;
            role?: string;
        };
    }
}