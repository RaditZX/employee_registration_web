'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerCandidate, type RegistrationActionState } from '@/app/actions/registration';
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
  registrationSchema,
  type RegistrationFormValues,
  validatePhotoFile
} from '@/lib/validation/registration';

const defaultActionState: RegistrationActionState = { success: false };

type SubmitModalState = {
  type: 'success' | 'error';
  title: string;
  message: string;
} | null;

export function RegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const [actionState, setActionState] = useState<RegistrationActionState>(defaultActionState);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [submitModal, setSubmitModal] = useState<SubmitModalState>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: ''
    }
  });

  function onSubmit(values: RegistrationFormValues, event?: React.BaseSyntheticEvent) {
    const form = event?.target as HTMLFormElement | undefined;
    const photoInput = form?.elements.namedItem('photo') as HTMLInputElement | null;
    const photo = photoInput?.files?.[0] ?? null;
    const nextPhotoError = validatePhotoFile(photo);

    setActionState(defaultActionState);
    setPhotoError(nextPhotoError);

    if (!form || nextPhotoError) {
      setSubmitModal({
        type: 'error',
        title: 'Pendaftaran Gagal',
        message: nextPhotoError ?? 'Mohon periksa kembali data pendaftaran Anda.'
      });
      return;
    }

    const formData = new FormData(form);
    formData.set('fullName', values.fullName);
    formData.set('email', values.email);

    startTransition(async () => {
      const result = await registerCandidate(formData);
      setActionState(result);

      if (result.success) {
        reset();
        form.reset();
        setPhotoError(null);
        setSelectedPhoto(null);
        setSubmitModal({
          type: 'success',
          title: 'Pendaftaran Berhasil Terkirim!',
          message: result.message ?? 'Informasi pendaftaran Anda telah diterima dan akan segera ditinjau oleh tim HR.'
        });
        return;
      }

      setSubmitModal({
        type: 'error',
        title: 'Pendaftaran Gagal',
        message: result.errors?._form?.[0] ?? 'Mohon periksa kembali data pendaftaran Anda lalu coba lagi.'
      });
    });
  }

  const fieldClassName = 'mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-surface-low disabled:text-slate-500';
  const fullNameError = errors.fullName?.message ?? actionState.errors?.fullName?.[0];
  const emailError = errors.email?.message ?? actionState.errors?.email?.[0];
  const currentPhotoError = photoError ?? actionState.errors?.photo?.[0];

  return (
    <>
      <form id="registration-form" onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium text-primary-700">Employee Registration</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-10 tracking-[-0.02em] text-slate-950">Registrasi Karyawan Baru Hasil Automated Deployment (CI/CD)</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            Lengkapi data diri dan dokumen awal untuk memulai proses onboarding karyawan baru.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-slate-900">
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Contoh: Siti Aminah"
              disabled={isPending}
              aria-invalid={Boolean(fullNameError)}
              aria-describedby={fullNameError ? 'fullName-error' : undefined}
              className={fieldClassName}
              {...register('fullName')}
            />
            {fullNameError ? (
              <p id="fullName-error" className="mt-2 text-sm font-medium text-red-600">
                {fullNameError}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-900">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              disabled={isPending}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'email-error' : undefined}
              className={fieldClassName}
              {...register('email')}
            />
            {emailError ? (
              <p id="email-error" className="mt-2 text-sm font-medium text-red-600">
                {emailError}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="photo" className="text-sm font-medium text-slate-900">
              Unggah Foto Profil
            </label>
            <label
              htmlFor="photo"
              className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary-500 bg-primary-50/40 px-6 py-8 text-center transition hover:bg-primary-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-600 ring-1 ring-primary-200" aria-hidden="true">
                ↑
              </span>
              <span className="mt-4 text-sm font-semibold text-slate-950">Klik untuk memilih file atau seret ke area ini</span>
              <span id="photo-help" className="mt-2 text-sm text-slate-600">
                JPG, PNG, atau WebP. Maksimum {(MAX_PHOTO_SIZE_BYTES / 1024 / 1024).toFixed(0)}MB.
              </span>
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept={ACCEPTED_PHOTO_TYPES.join(',')}
              disabled={isPending}
              aria-invalid={Boolean(currentPhotoError)}
              aria-describedby={currentPhotoError ? 'photo-error' : 'photo-help'}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                const nextPhotoError = validatePhotoFile(file);

                setSelectedPhoto(nextPhotoError ? null : file);
                setPhotoError(nextPhotoError);
              }}
            />
            {selectedPhoto ? (
              <div className="mt-3 flex items-center justify-between gap-4 rounded-lg border border-primary-200 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{selectedPhoto.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB · File siap diupload</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Terpilih</span>
              </div>
            ) : null}
            {currentPhotoError ? (
              <p id="photo-error" className="mt-2 text-sm font-medium text-red-600">
                {currentPhotoError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-surface-low focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isPending || !isValid}
            className="flex min-h-11 items-center justify-center rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isPending ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Mengirim pendaftaran...
              </span>
            ) : (
              'Kirim Pendaftaran'
            )}
          </button>
        </div>
      </form>

      {submitModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-modal-title"
            aria-describedby="submit-modal-message"
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft sm:p-8"
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-semibold ${submitModal.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              aria-hidden="true"
            >
              {submitModal.type === 'success' ? '✓' : '!'}
            </div>
            <h2 id="submit-modal-title" className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-slate-950">
              {submitModal.title}
            </h2>
            <p id="submit-modal-message" className="mt-3 text-sm leading-6 text-slate-700">
              {submitModal.message}
            </p>
            <button
              type="button"
              onClick={() => setSubmitModal(null)}
              className={`mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 sm:w-auto ${submitModal.type === 'success'
                  ? 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-200'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
                }`}
            >
              {submitModal.type === 'success' ? 'Selesai' : 'Coba Lagi'}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
