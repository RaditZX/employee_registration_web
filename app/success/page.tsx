import Link from 'next/link';
import { PortalShell } from '@/components/PortalShell';

export default function SuccessPage() {
  return (
    <PortalShell active="Registration">
      <main className="grid min-h-[calc(100vh-145px)] place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl font-semibold text-emerald-700" aria-hidden="true">
            ✓
          </div>
          <h1 className="mt-6 text-[32px] font-semibold leading-10 tracking-[-0.02em] text-slate-950">Pendaftaran Berhasil Terkirim!</h1>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Terima kasih. Informasi pendaftaran Anda telah diterima dan akan segera ditinjau oleh tim kami. Kami akan menghubungi Anda melalui email untuk langkah selanjutnya.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-200"
          >
            Kembali ke Beranda
          </Link>
        </section>
      </main>
    </PortalShell>
  );
}
