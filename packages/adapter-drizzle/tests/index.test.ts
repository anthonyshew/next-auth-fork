import { randomUUID, runBasicTests } from "@next-auth/adapter-test"
import { DrizzleAdapter } from "../src"
import { db, users } from '../src/schema'
import { sql } from "drizzle-orm";
import { eq } from 'drizzle-orm/expressions';


runBasicTests({
  adapter: DrizzleAdapter(db),
  db: {
    id() {
      return randomUUID()
    },
    connect: async () => {
      await Promise.all([
        db.delete(users).where(sql("*"))
      ])
    },
    disconnect: async () => {
      await Promise.all([
        db.delete(users).where(sql("*"))
      ])
    },
    user: (id) => db.select({}).from(users).where(eq(users.id, id)),
    account: (provider_providerAccountId) =>
      prisma.account.findUnique({ where: { provider_providerAccountId } }),
    session: (sessionToken) =>
      prisma.session.findUnique({ where: { sessionToken } }),
    async verificationToken(identifier_token) {
      const result = await prisma.verificationToken.findUnique({
        where: { identifier_token },
      })
      if (!result) return null
      return result
    },
  },
})
