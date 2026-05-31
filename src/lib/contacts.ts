import { prisma } from "@/lib/prisma";

export function getContacts() {
  return prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
}

export function getContact(id: string) {
  return prisma.contact.findUnique({ where: { id } });
}
