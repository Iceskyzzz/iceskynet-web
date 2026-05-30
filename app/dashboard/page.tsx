"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  icon: string | null;
  created_at: string;
};

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [icon, setIcon] = useState("🚀");

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Login gagal. Cek email dan password.");
      setLoading(false);
      return;
    }

    setUser(data.user);
    setNotice("Login berhasil.");
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProjects(data || []);
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMessages(data || []);
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    const { error } = await supabase.from("projects").insert({
      title,
      description,
      link: link || null,
      icon,
    });

    if (error) {
      setError("Gagal menambah project. Pastikan kamu sudah login dan policy Supabase benar.");
      setLoading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setLink("");
    setIcon("🚀");
    setNotice("Project berhasil ditambahkan.");
    setLoading(false);
    loadProjects();
  }

  async function deleteProject(id: string) {
    const ok = confirm("Yakin hapus project ini?");
    if (!ok) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      setError("Gagal menghapus project.");
      return;
    }

    setNotice("Project berhasil dihapus.");
    loadProjects();
  }

  async function markMessageRead(id: string) {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      setError("Gagal update pesan.");
      return;
    }

    loadMessages();
  }

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadProjects();
      loadMessages();
    }
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl">
          <a href="/" className="mb-8 inline-block text-2xl font-black">
            Ice<span className="text-sky-400">Skynet</span>
          </a>

          <div className="mb-8">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-3xl">
              🔐
            </div>
            <h1 className="text-4xl font-black">Login Admin</h1>
            <p className="mt-3 text-slate-400">
              Masuk untuk mengelola project dan melihat pesan masuk dari website.
            </p>
          </div>

          <form onSubmit={login} className="grid gap-4">
            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
              type="email"
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-5 py-3 font-bold disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>

            {notice && <p className="text-sky-300">{notice}</p>}
            {error && <p className="text-red-300">{error}</p>}
          </form>

          <a href="/" className="mt-6 inline-block font-bold text-sky-400">
            ← Kembali ke website
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/" className="text-2xl font-black">
            Ice<span className="text-sky-400">Skynet</span>
          </a>

          <div className="flex gap-3">
            <a
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold"
            >
              Website
            </a>
            <button
              onClick={logout}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-4 py-2 text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-300">
            ⚡ Admin Panel
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Dashboard Admin</h1>
          <p className="mt-3 text-slate-400">
            Kelola portfolio, project, dan pesan masuk IceSkynet.
          </p>
        </div>

        {notice && (
          <div className="mb-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sky-200">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <StatCard title="Total Project" value={projects.length.toString()} icon="🚀" />
          <StatCard title="Pesan Masuk" value={messages.length.toString()} icon="✉️" />
          <StatCard
            title="Pesan Baru"
            value={messages.filter((m) => !m.is_read).length.toString()}
            icon="🔔"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-2xl font-black">Tambah Project</h2>
            <p className="mb-6 text-slate-400">
              Project yang ditambahkan akan tampil di halaman utama.
            </p>

            <form onSubmit={addProject} className="grid gap-4">
              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
                placeholder="Icon, contoh: ⚙️"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />

              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
                placeholder="Judul project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                className="min-h-32 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
                placeholder="Deskripsi project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-sky-400"
                placeholder="Link project, contoh: https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />

              <button
                className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-5 py-3 font-bold disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Tambah Project"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-2xl font-black">Project Terbaru</h2>
            <p className="mb-6 text-slate-400">
              Daftar project yang tersimpan di Supabase.
            </p>

            <div className="grid gap-4">
              {projects.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-slate-400">
                  Belum ada project dari database.
                </div>
              )}

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 text-3xl">{project.icon || "🚀"}</div>
                      <h3 className="text-xl font-black">{project.title}</h3>
                    </div>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-bold text-red-200"
                    >
                      Hapus
                    </button>
                  </div>

                  <p className="mb-3 text-slate-400">{project.description}</p>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      className="font-bold text-sky-400"
                    >
                      Buka project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-2 text-2xl font-black">Pesan Masuk</h2>
          <p className="mb-6 text-slate-400">
            Pesan dari form kontak akan tampil di sini.
          </p>

          <div className="grid gap-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-slate-400">
                Belum ada pesan masuk.
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
              >
                <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          msg.is_read
                            ? "bg-white/10 text-slate-300"
                            : "bg-sky-400/10 text-sky-300"
                        }`}
                      >
                        {msg.is_read ? "Dibaca" : "Baru"}
                      </span>
                    </div>

                    <h3 className="text-xl font-black">{msg.name}</h3>
                    <p className="text-sm text-slate-400">{msg.email}</p>
                  </div>

                  {!msg.is_read && (
                    <button
                      onClick={() => markMessageRead(msg.id)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <p className="text-slate-300">{msg.message}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-3xl">{icon}</div>
      <div className="text-4xl font-black text-sky-400">{value}</div>
      <div className="mt-1 text-slate-400">{title}</div>
    </div>
  );
}
