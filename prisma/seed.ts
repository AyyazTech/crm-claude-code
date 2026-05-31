import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { hashPassword } from "../src/lib/password.ts";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const contacts = [
  {
    name: "Ava Thompson",
    email: "ava.thompson@northwind.io",
    phone: "+1 (415) 555-0112",
    company: "Northwind Labs",
    status: "customer",
    notes: "Renewed annual plan in March. Champion for the analytics module.",
  },
  {
    name: "Marcus Lee",
    email: "marcus.lee@hooli.com",
    phone: "+1 (650) 555-0143",
    company: "Hooli",
    status: "active",
    notes: "Evaluating the team tier. Wants SSO before rollout.",
  },
  {
    name: "Priya Nair",
    email: "priya.nair@acme.dev",
    phone: "+44 20 7946 0321",
    company: "Acme Corp",
    status: "lead",
    notes: "Inbound from the pricing page. Booked a demo for next week.",
  },
  {
    name: "Diego Alvarez",
    email: "diego.alvarez@globex.com",
    phone: "+1 (312) 555-0198",
    company: "Globex",
    status: "customer",
    notes: "Expanded to 40 seats last quarter.",
  },
  {
    name: "Sofia Rossi",
    email: "sofia.rossi@initech.com",
    phone: "+39 02 8051 2277",
    company: "Initech",
    status: "churned",
    notes: "Downgraded then cancelled — cited budget cuts. Worth a re-engage in Q3.",
  },
  {
    name: "Liam O'Brien",
    email: "liam.obrien@umbrella.co",
    phone: "+353 1 437 2210",
    company: "Umbrella Co",
    status: "lead",
    notes: "Met at SaaStr. Forwarding to a wider buying committee.",
  },
  {
    name: "Hana Kim",
    email: "hana.kim@piedpiper.com",
    phone: "+1 (206) 555-0167",
    company: "Pied Piper",
    status: "active",
    notes: "In a 30-day trial. Heavy API usage — good upsell signal.",
  },
  {
    name: "Noah Schmidt",
    email: "noah.schmidt@vandelay.com",
    phone: "+49 30 901820",
    company: "Vandelay Industries",
    status: "lead",
    notes: "Requested a security questionnaire.",
  },
  {
    name: "Emma Dubois",
    email: "emma.dubois@soylent.com",
    phone: "+33 1 70 18 99 00",
    company: "Soylent",
    status: "customer",
    notes: "Reference customer — happy to do a case study.",
  },
  {
    name: "Yuki Tanaka",
    email: "yuki.tanaka@cyberdyne.com",
    phone: "+81 3 6743 1200",
    company: "Cyberdyne Systems",
    status: "active",
    notes: "Migrating from a competitor. Onboarding scheduled.",
  },
];

type SeedDeal = {
  title: string;
  value: number;
  stage: string;
  position: number;
  company: string;
  contactEmail?: string;
  closedAt?: string; // ISO date — set for won deals
};

// The active pipeline: 8 deals spread across the five stages. Some are tied to a
// seeded contact via their email; `position` orders cards within a stage.
const deals: SeedDeal[] = [
  { title: "Acme — Pilot rollout", value: 12000, stage: "lead", position: 0, company: "Acme Corp", contactEmail: "priya.nair@acme.dev" },
  { title: "Umbrella — Team plan", value: 8400, stage: "lead", position: 1, company: "Umbrella Co", contactEmail: "liam.obrien@umbrella.co" },
  { title: "Hooli — Enterprise SSO", value: 48000, stage: "contacted", position: 0, company: "Hooli", contactEmail: "marcus.lee@hooli.com" },
  { title: "Vandelay — Security review", value: 16500, stage: "contacted", position: 1, company: "Vandelay Industries", contactEmail: "noah.schmidt@vandelay.com" },
  { title: "Pied Piper — Usage upsell", value: 22000, stage: "proposal", position: 0, company: "Pied Piper", contactEmail: "hana.kim@piedpiper.com" },
  { title: "Cyberdyne — Migration", value: 75000, stage: "proposal", position: 1, company: "Cyberdyne Systems", contactEmail: "yuki.tanaka@cyberdyne.com" },
  { title: "Northwind — Annual renewal", value: 36000, stage: "won", position: 6, company: "Northwind Labs", contactEmail: "ava.thompson@northwind.io", closedAt: "2026-05-09" },
  { title: "Initech — Expansion", value: 9500, stage: "lost", position: 0, company: "Initech", contactEmail: "sofia.rossi@initech.com" },
];

// Historically-won deals across the last ~6 months, so the dashboard's
// revenue-by-month chart reflects a real trend. These also live in the Won
// column of the board.
const closedDeals: SeedDeal[] = [
  { title: "Northwind — Initial contract", value: 18000, stage: "won", position: 0, company: "Northwind Labs", contactEmail: "ava.thompson@northwind.io", closedAt: "2025-12-12" },
  { title: "Hooli — Q4 expansion", value: 27500, stage: "won", position: 1, company: "Hooli", contactEmail: "marcus.lee@hooli.com", closedAt: "2026-01-15" },
  { title: "Globex — Add-on seats", value: 19500, stage: "won", position: 2, company: "Globex", contactEmail: "diego.alvarez@globex.com", closedAt: "2026-02-08" },
  { title: "Soylent — Renewal", value: 22000, stage: "won", position: 3, company: "Soylent", contactEmail: "emma.dubois@soylent.com", closedAt: "2026-02-20" },
  { title: "Soylent — Onboarding package", value: 33000, stage: "won", position: 4, company: "Soylent", contactEmail: "emma.dubois@soylent.com", closedAt: "2026-03-18" },
  { title: "Globex — Platform license", value: 52000, stage: "won", position: 5, company: "Globex", contactEmail: "diego.alvarez@globex.com", closedAt: "2026-04-22" },
];

async function main() {
  // The single demo login user.
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: { username: "admin", passwordHash: await hashPassword("admin123") },
  });
  console.log("Seeded 1 user (admin / admin123).");

  // Delete deals before contacts (deals reference contacts).
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();

  const emailToId = new Map<string, string>();
  for (const contact of contacts) {
    const created = await prisma.contact.create({ data: contact });
    emailToId.set(created.email, created.id);
  }
  console.log(`Seeded ${contacts.length} contacts.`);

  const allDeals = [...deals, ...closedDeals];
  for (const { contactEmail, closedAt, ...deal } of allDeals) {
    await prisma.deal.create({
      data: {
        ...deal,
        closedAt: closedAt ? new Date(closedAt) : null,
        contactId: contactEmail ? (emailToId.get(contactEmail) ?? null) : null,
      },
    });
  }
  console.log(`Seeded ${allDeals.length} deals.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
