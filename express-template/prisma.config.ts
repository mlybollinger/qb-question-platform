import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import { env, defineConfig } from "prisma/config"


export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL")
  }
})