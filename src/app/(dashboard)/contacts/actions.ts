"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STATUS, isContactStatus } from "@/lib/contact-status";

export type ContactFormState = {
  errors?: Record<string, string>;
  values?: {
    name: string;
    email: string;
    phone: string;
    company: string;
    status: string;
    notes: string;
  };
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function parse(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const status = isContactStatus(statusRaw) ? statusRaw : DEFAULT_STATUS;

  return {
    errors,
    values: { name, email, phone, company, status, notes },
    data: {
      name,
      email,
      phone: phone || null,
      company: company || null,
      status,
      notes: notes || null,
    },
  };
}

export async function createContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const { errors, values, data } = parse(formData);
  if (Object.keys(errors).length) return { errors, values };

  try {
    await prisma.contact.create({ data });
  } catch (error) {
    if (isUniqueEmailError(error)) {
      return { errors: { email: "A contact with this email already exists." }, values };
    }
    throw error;
  }

  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function updateContact(
  id: string,
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const { errors, values, data } = parse(formData);
  if (Object.keys(errors).length) return { errors, values };

  try {
    await prisma.contact.update({ where: { id }, data });
  } catch (error) {
    if (isUniqueEmailError(error)) {
      return { errors: { email: "A contact with this email already exists." }, values };
    }
    throw error;
  }

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}/edit`);
  redirect("/contacts");
}

export async function deleteContact(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.contact.delete({ where: { id } });
  revalidatePath("/contacts");
}

function isUniqueEmailError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
