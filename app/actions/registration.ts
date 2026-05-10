'use server';

import { Prisma } from '@prisma/client';
import { registrationSchema, validatePhotoFile } from '@/lib/validation/registration';
import { createCandidate } from '@/repositories/candidateRepository';
import { deleteBlobByUrl, uploadCandidatePhoto } from '@/services/blobStorageService';

export type RegistrationActionState = {
  success: boolean;
  message?: string;
  errors?: {
    fullName?: string[];
    email?: string[];
    photo?: string[];
    _form?: string[];
  };
};

const initialFailureState: RegistrationActionState = { success: false };

export async function registerCandidate(formData: FormData): Promise<RegistrationActionState> {
  const file = formData.get('photo');
  const parsed = registrationSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email')
  });

  const errors: RegistrationActionState['errors'] = parsed.success
    ? {}
    : parsed.error.flatten().fieldErrors;

  const photoError = validatePhotoFile(file instanceof File ? file : null);

  if (photoError) {
    errors.photo = [photoError];
  }

  if (!parsed.success || photoError || !(file instanceof File)) {
    return { ...initialFailureState, errors };
  }

  let photoUrl: string | null = null;

  try {
    photoUrl = await uploadCandidatePhoto(file);
    await createCandidate({ ...parsed.data, photoUrl });

    return {
      success: true,
      message: 'Pendaftaran berhasil. Data kandidat telah diterima.'
    };
  } catch (error) {
    if (photoUrl) {
      await deleteBlobByUrl(photoUrl);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        ...initialFailureState,
        errors: { email: ['Email sudah terdaftar'] }
      };
    }
    console.error('Error during candidate registration:', error);
    return {
      ...initialFailureState,
      errors: { _form: ['Pendaftaran gagal. Silakan coba lagi.'] }
    };
  }
}
