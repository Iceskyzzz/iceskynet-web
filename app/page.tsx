"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  icon: string | null;
};

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("messages").insert({
      name,
      email,
      message,
    });

    if (error) {
      setNotice("Pesan gagal dikirim.");
    } else {
      setNotice("Pesan berhasil dikirim.");
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="#" className="text-2xl font-black">
            Ice<span className="text-sky-400">Skynet</span>
          </a>

          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#about" className="hover:text-sky-400">Tentang</a>
            <a href="#projects" className="hover:text-sky-400">Project</a>
            <a href="#contact" className="hover:text-sky-400">Kontak</a>
            <a href="/dashboard" className="hover:text-sky-400">Dashboard</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-300">
            ⚡ Portfolio + Dashboard
          </div>

          <h1 className="mb-6 text-5xl font-black leading-none tracking-tight md:text-7xl">
            Halo, saya <span className="text-sky-400">IceSkynet</span>
          </h1>

          <p className="mb-8 text-lg text-slate-300">
            Saya membangun solusi otomasi, integrasi WhatsApp API, deployment VPS,
            reverse proxy Nginx, dashboard admin, dan sistem digital yang cepat.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-5 py-3 text-center font-bold">
              🚀 Lihat Project
            </a>
            <a href="#contact" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center font-bold">
              ✉️ Hubungi Saya
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl">
          <div className="mb-5 grid h-24 w-24 place-items-center rounded-full border border-sky-400/30 bg-sky-400/10 text-4xl">
            👨‍💻
          </div>

          <h2 className="mb-2 text-3xl font-black">Automation & Web App</h2>
          <p className="mb-6 text-slate-400">
            Portfolio ini terhubung ke Supabase untuk database, login, dan dashboard.
          </p>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">⚙️ n8n Automation</div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">💬 WAHA WhatsApp API</div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">🗄️ Supabase Backend</div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <h2 className="mb-3 text-3xl font-black">Tentang Saya</h2>
          <p className="text-slate-400">
            Saya tertarik pada teknologi otomasi, backend ringan, integrasi API,
            dan pengelolaan server. Website ini menjadi tempat untuk menampilkan
            project dan eksperimen digital.
          </p>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-3 text-3xl font-black">Project</h2>
        <p className="mb-8 text-slate-400">
          Project di bawah ini bisa ditambah lewat dashboard admin.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {projects.length === 0 ? (
            <>
              <ProjectCard icon="⚙️" title="n8n Automation" description="Workflow automation untuk integrasi data dan proses bisnis." link="https://n8n.iceskynet.my.id" />
              <ProjectCard icon="💬" title="WAHA WhatsApp API" description="Integrasi WhatsApp API untuk bot, notifikasi, dan automation." link="https://waha.iceskynet.my.id" />
              <ProjectCard icon="🖥️" title="VPS Web Server" description="Setup VPS Linux, Nginx, SSL HTTPS, reverse proxy, domain, dan subdomain." link="#contact" />
            </>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                icon={project.icon || "🚀"}
                title={project.title}
                description={project.description}
                link={project.link || "#"}
              />
            ))
          )}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <h2 className="mb-3 text-3xl font-black">Kontak</h2>
          <p className="mb-6 text-slate-400">
            Kirim pesan lewat form ini. Pesan akan masuk ke dashboard admin.
          </p>

          <form onSubmit={sendMessage} className="grid max-w-2xl gap-4">
            <input className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <textarea className="min-h-32 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none" placeholder="Pesan" value={message} onChange={(e) => setMessage(e.target.value)} required />
            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-5 py-3 font-bold">
              Kirim Pesan
            </button>
            {notice && <p className="text-sky-300">{notice}</p>}
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-slate-500">
        © 2026 IceSkynet. All rights reserved.
      </footer>
    </main>
  );
}

function ProjectCard({
  icon,
  title,
  description,
  link,
}: {
  icon: string;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-2xl font-black">{title}</h3>
      <p className="mb-5 text-slate-400">{description}</p>
      <a href={link} target={link.startsWith("http") ? "_blank" : "_self"} className="font-bold text-sky-400">
        Buka →
      </a>
    </div>
  );
}
