import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, type Card } from "@/lib/cards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Azure Concept Flashcards — Unofficial AZ-900 Study Tool" },
      { name: "description", content: "Flip through AZ-900 flashcards on cloud concepts, Azure architecture, and security & governance." },
      { property: "og:title", content: "Azure Concept Flashcards" },
      { property: "og:description", content: "Unofficial AZ-900 flashcard study tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const names = Object.keys(CATEGORIES);

function Index() {
  const [cat, setCat] = useState(names[0]);
  const [deck, setDeck] = useState<Card[]>(CATEGORIES[names[0]]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const go = (n: number) => { setFlipped(false); setTimeout(() => setI(n), flipped ? 150 : 0); };
  const pick = (c: string) => { setCat(c); setDeck(CATEGORIES[c]); setI(0); setFlipped(false); };
  const shuffle = () => {
    const d = [...deck];
    for (let k = d.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [d[k], d[j]] = [d[j], d[k]]; }
    setFlipped(false); setDeck(d); setI(0);
  };
  const card = deck[i];

  return (
    <div className="flex min-h-screen flex-col bg-hero text-foreground">
      <header className="mx-auto w-full max-w-3xl px-4 pt-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Unofficial AZ-900 Study Tool</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Azure Concept Flashcards</h1>
        <nav className="mt-8 flex flex-wrap justify-center gap-2 rounded-xl bg-card/60 p-1.5 backdrop-blur">
          {names.map((c) => (
            <button key={c} onClick={() => pick(c)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${c === cat ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
          <span>Card {i + 1} of {deck.length}</span><span>{cat}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-primary transition-all duration-300" style={{ width: `${((i + 1) / deck.length) * 100}%` }} />
        </div>

        <div className="perspective mt-6 h-80 cursor-pointer" onClick={() => setFlipped((f) => !f)}>
          <div className={`flip-inner relative h-full w-full ${flipped ? "is-flipped" : ""}`}>
            <div className="face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
              <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Question</span>
              <p className="text-2xl font-semibold">{card.q}</p>
              <span className="mt-6 text-xs text-muted-foreground">Click to reveal answer</span>
            </div>
            <div className="face face-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-elegant">
              <span className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-80">Answer</span>
              <p className="text-lg leading-relaxed">{card.a}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button onClick={() => go(i - 1)} disabled={i === 0} className="btn-secondary">← Previous</button>
          <button onClick={shuffle} className="btn-secondary">⇄ Shuffle</button>
          <button onClick={() => go(i + 1)} disabled={i === deck.length - 1} className="btn-primary">Next →</button>
        </div>
      </main>

      <footer className="border-t border-border py-5 text-center text-sm text-muted-foreground">
        ⚠️ Unofficial study tool. Not affiliated with Microsoft.
      </footer>
    </div>
  );
}
