import { z } from 'zod';

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap wajib diisi (2–100 karakter, hanya huruf)')
    .max(100, 'Nama lengkap wajib diisi (2–100 karakter, hanya huruf)')
    .regex(/^[\p{L}\s'.-]+$/u, 'Nama lengkap wajib diisi (2–100 karakter, hanya huruf)'),
  email: z.string().trim().email('Email tidak valid').max(255, 'Email tidak valid')
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export function validatePhotoFile(file: File | null | undefined): string | null {
  if (!file || file.size === 0) {
    return 'Foto profil wajib diunggah';
  }

  if (!ACCEPTED_PHOTO_TYPES.includes(file.type as (typeof ACCEPTED_PHOTO_TYPES)[number])) {
    return 'Hanya file gambar (JPG/PNG/WebP, maks 5MB)';
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return 'Hanya file gambar (JPG/PNG/WebP, maks 5MB)';
  }

  return null;
}
