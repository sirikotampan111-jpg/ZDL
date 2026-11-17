import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const d = await db.demo.create({
  data: { title: "schema-test", slug: "schema-test", description: "verify demo table works", demoUrl: "/x" },
});
console.log("created:", d.id, "accessType:", d.accessType, "published:", d.published);
await db.demo.delete({ where: { id: d.id } });
console.log("deleted OK — Demo table functional");
await db.$disconnect();
