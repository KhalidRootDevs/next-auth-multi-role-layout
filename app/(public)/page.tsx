import Link from 'next/link';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <section className="mb-12 max-w-xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
          Welcome to YourAppName
        </h1>
        <p className="mb-8 text-lg text-gray-700">
          Manage your team, projects, and workflow efficiently with our
          easy-to-use platform.
        </p>
        <Link
          href="/login"
          className="inline-block rounded bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Log in to get started
        </Link>
      </section>
    </main>
  );
}
