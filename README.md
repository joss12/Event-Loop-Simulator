# 🧠 Event Loop Simulator (Node.js CLI)

A professional-grade, visual **JavaScript event loop simulator** — built in **pure Node.js**, with **zero dependencies**, **no DOM**, and **full CLI control**.

> Simulate how JavaScript handles:
> - `setTimeout`, `queueMicrotask`, `Promise.then`
> - `async/await` (as microtask chains)
> - Real event loop ticks, call stack, and queues

---

## 🚀 Features

- ✅ Visual dashboard for Call Stack, Microtask Queue, and Task Queue
- ✅ Full simulation of `async/await`, microtask chaining, and nested callbacks
- ✅ Interactive CLI controls:
  - `Enter` to tick manually
  - `s` for auto-run mode
  - `q` to quit
- ✅ Flags: `--autorun`, `--ticks=N`
- ✅ Modular architecture: perfect for testing or learning

---

## 📦 Installation

### ▶️ One-time run (via npx)

```bash
npx event-loop-simulator nestedClassic

npx evloop nestedClassic

