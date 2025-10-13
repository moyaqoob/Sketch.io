# 🎨 Sketch.io — Real-Time Collaborative Drawing Platform

**Sketch.io** is a next-generation **real-time collaborative drawing tool** designed for teams, classrooms, and creators who want to **visualize ideas together instantly**.  
Built with **Next.js**, **Express**, and **WebSockets**, it delivers a seamless, low-latency experience that feels as natural as drawing side-by-side — even when users are miles apart.

---

## 🌐 Landing Experience

![Landing Page](https://github.com/user-attachments/assets/900cf7eb-b7ef-4f4b-945c-a7dbd098d76a)

The landing page greets users with a clean, minimal interface and an instant call to action — **start sketching or join a collaborative room**.  
No clutter, no distractions — just a space to think, draw, and create together.

---

## 🔑 Authentication & Workspace Access

![Login Page](https://github.com/user-attachments/assets/ef7e076e-3081-4b8e-86ed-97c7b0559413)

Secure login ensures that every user has a personalized workspace and persistent access to shared sessions.  
Once logged in, users can **create or join rooms** using unique access codes, making collaboration easy and controlled.

---

## 🏠 Room Dashboard

![Rooms Page](https://github.com/user-attachments/assets/19caa150-6b7b-4e88-8ef4-6c3bd2f5c005)

After signing in, users land on a **room management dashboard** — a central hub displaying all available rooms and access codes.  
It’s intuitive, fast, and designed for seamless entry into any collaborative sketching session.

---

## ✏️ Real-Time Drawing Canvas

![Drawing Feature](https://github.com/user-attachments/assets/93419208-bf16-4d8f-82ae-44ae9c068294)

This is where **Sketch.io truly shines.**

The collaborative canvas allows multiple users to:
- Draw freehand or use structured shapes like rectangles, ellipses, arrows, and diamonds  
- Add and edit text labels  
- Customize brush sizes, colors, and fill styles  
- Move, resize, or delete shapes dynamically  

Every stroke, line, and object updates **instantly across all connected users** — powered by a high-performance **WebSocket server** built for low latency and scale.

---

## ⚡ Core Highlights

- **Multi-User Real-Time Sync** — All participants see updates live with zero lag.  
- **Persistent Storage** — Every drawing is safely stored in **PostgreSQL** via **Prisma**, ensuring nothing is lost.  
- **Scalable Architecture** — The system is split into independent apps for the frontend, backend API, and WebSocket server — all orchestrated with **Turborepo** and **Bun**.  
- **Production-Ready Infrastructure** — Complete with Dockerized deployment and CI/CD pipelines via **GitHub Actions**.  
- **Beautiful, Minimal UI** — A clean interface that keeps the focus on ideas, not interface noise.

---

## 🧠 Why Sketch.io Stands Out

Unlike basic drawing boards, **Sketch.io** is engineered for **real-time collaboration and scalability**.  
It’s ideal for:
- Teams brainstorming product ideas  
- Designers wireframing live  
- Educators teaching visually  
- Developers planning system architecture  

With its modular monorepo design, Sketch.io can evolve from a shared whiteboard into a full-fledged collaborative design suite — with live cursors, user permissions, and cloud saving already built into its core.

---

## 🚀 “Sketch Together, Think Better.”

**Sketch.io** turns real-time creativity into a shared experience — fast, fluid, and future-ready.  
Whether you’re a solo creator or a remote team, Sketch.io brings your ideas to life — one line at a time.
