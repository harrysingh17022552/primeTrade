export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 flex flex-col items-center justify-center p-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">NoteNest</h1>
        <p className="text-slate-600">
          Capture your thoughts, organize your ideas, and stay productive.
        </p>
      </header>

      <section className="max-w-2xl text-center">
        <p className="text-lg text-slate-700 mb-6">
          A simple and clean note-taking app designed to help you focus on what
          matters most — your notes.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/signin"
            className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="px-6 py-3 rounded-md border font-medium text-slate-700 hover:bg-slate-100"
          >
            Learn More
          </a>
        </div>
      </section>

      <footer className="absolute bottom-2 text-sm text-slate-500">
        © {new Date().getFullYear()} NoteNest. All rights reserved.
      </footer>
    </main>
  );
}
