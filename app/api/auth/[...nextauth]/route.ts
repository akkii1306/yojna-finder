import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// ------------------------------------------------------
// AUTH OPTIONS (exported for getServerSession usage)
// ------------------------------------------------------

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // using JWT instead of database sessions
  },

  providers: [
    // ---------------- GOOGLE LOGIN -------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ---------------- EMAIL/PASSWORD LOGIN ----------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing email or password");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        return user;
      },
    }),
  ],

  // ------------------ CALLBACKS ---------------------
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id; // include user ID in token
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id; // attach userId to session.user
      }
      return session;
    },
  },
};

// ------------------------------------------------------
// HANDLER FOR NEXTAUTH ROUTE (GET + POST)
// ------------------------------------------------------

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
