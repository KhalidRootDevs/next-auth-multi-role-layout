'use server';

import { revalidatePath } from 'next/cache';

export async function revalidatePathHandler(path: string) {
  revalidatePath(path);
}
