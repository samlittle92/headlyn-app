"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveUserPreferences(interests: string[]) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { interests },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
