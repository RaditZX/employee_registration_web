import { PortalShell } from '@/components/PortalShell';

const quickLinks = [
  { label: 'Recruitment Process', href: '#process' },
  { label: 'Technical Requirements', href: '#requirements' },
  { label: 'Frequently Asked Questions', href: '#faq' }
];
const processSteps = [
  {
    icon: 'ID',
    title: 'Profile Registration',
    description: 'Create your account, provide basic contact information, and set up your secure login credentials.'
  },
  {
    icon: 'BD',
    title: 'Background Documentation',
    description: 'Upload required identification, educational certificates, and employment history documents.'
  },
  {
    icon: 'RA',
    title: 'Review & Approval',
    description: 'Our specialists will review your submitted materials and contact you with the next steps.'
  }
];
const requirements = [
  {
    icon: 'DOC',
    title: 'Accepted Document Formats',
    description: 'Upload documents as  .JPG or .PNG files so HR can review them without conversion issues.'
  },
  {
    icon: '10M',
    title: 'Maximum File Size',
    description: 'Each individual file can be up to 5 MB. Compress documents before uploading if they exceed the limit.'
  },
  {
    icon: 'SEC',
    title: 'Data Security',
    description: 'All submitted information is encrypted at rest and in transit with controlled HR access.'
  }
];
const faqs = [
  {
    question: 'What if I make a mistake in my submission?',
    answer: 'Contact HR Support as soon as possible. The team can help review your submitted data and advise the correction process.'
  },
  {
    question: 'Can I save my progress and continue later?',
    answer: 'Yes. The system automatically saves your progress at the end of each completed section.'
  },
  {
    question: 'How will I know the next step after submitting?',
    answer: 'HR will send the next instruction to the email address used during registration.'
  }
];

export default function FAQPage() {
  return (
    <PortalShell active="Help">
      <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.02em] text-slate-950">Help & Guidelines</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              Find answers to common questions, understand the recruitment process steps, and review the technical requirements before completing your employee registration.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
            <aside className="lg:sticky lg:top-6" aria-label="Guide navigation">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Guide Tab</p>
                <nav className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                  {quickLinks.map((item) => (
                    <a key={item.label} href={item.href} className="flex items-center justify-between px-4 py-4 text-sm font-semibold text-slate-950 transition hover:bg-surface-low focus:bg-primary-50 focus:text-primary-700 focus:outline-none">
                      {item.label}
                      <span className="text-primary-700" aria-hidden="true">→</span>
                    </a>
                  ))}
                </nav>
                <a href="mailto:hr-support@example.com" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
                  Contact HR Support
                </a>
              </div>
            </aside>

            <div>
          <section id="process" className="scroll-mt-8 mb-8 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-slate-950">Recruitment Process</h2>
            <div className="mt-6 space-y-6">
              {processSteps.map((step, index) => (
                <article key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 ring-1 ring-primary-200">{step.icon}</span>
                    {index < processSteps.length - 1 ? <span className="mt-3 h-full min-h-10 w-px bg-slate-200" aria-hidden="true" /> : null}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">Step {index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="requirements" className="scroll-mt-8 mb-8 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-slate-950">Technical Requirements</h2>
            <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200">
              {requirements.map((requirement) => (
                <article key={requirement.title} className="flex gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-high text-xs font-semibold text-slate-700">{requirement.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{requirement.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{requirement.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" className="scroll-mt-8 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-slate-950">Frequently Asked Questions</h2>
            <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200">
              {faqs.map((faq, index) => (
                <details key={faq.question} className="group" open={index === 1}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-surface-low">
                    {faq.question}
                    <span className="text-xl leading-none text-slate-500 group-open:hidden" aria-hidden="true">⌄</span>
                    <span className="hidden text-xl leading-none text-primary-700 group-open:inline" aria-hidden="true">⌃</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-6 text-slate-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
            </div>
          </div>
        </section>
      </main>
    </PortalShell>
  );
}
