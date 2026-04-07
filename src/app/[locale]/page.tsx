import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default async function LandingPage() {
  const t = await getTranslations();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Navigation */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Saniatlas Logo.png" alt="Saniatlas" width={36} height={36} className="rounded-lg" />
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Saniatlas</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900"
            >
              {t('nav.register')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col">
        <section className="bg-zinc-50 px-6 py-24 text-center dark:bg-zinc-900">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {t('landing.hero.headline')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {t('landing.hero.sub')}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/register"
                className="rounded-lg bg-blue-800 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
              >
                {t('landing.hero.cta')}
              </Link>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
              >
                {t('landing.hero.login')}
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {t('landing.features.title')}
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 text-3xl">🏗️</div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('landing.features.item1_title')}
                </h3>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {t('landing.features.item1_desc')}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 text-3xl">💶</div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('landing.features.item2_title')}
                </h3>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {t('landing.features.item2_desc')}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 text-3xl">👥</div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('landing.features.item3_title')}
                </h3>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {t('landing.features.item3_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm text-zinc-500">{t('landing.compliance')}</p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-zinc-400">
            <Link href="/impressum" className="hover:text-zinc-600">Impressum</Link>
            <span>·</span>
            <Link href="/datenschutz" className="hover:text-zinc-600">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
