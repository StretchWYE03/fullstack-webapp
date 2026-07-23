import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

type Quest = { id: number; icon: string; title: string; category: string; xp: number; done: boolean };

const starterQuests: Quest[] = [
  { id: 1, icon: "◒", title: "Move for 20 minutes", category: "Body", xp: 25, done: false },
  { id: 2, icon: "✎", title: "Journal one page", category: "Mind", xp: 20, done: true },
  { id: 3, icon: "◌", title: "Drink 8 glasses of water", category: "Body", xp: 15, done: false },
  { id: 4, icon: "⌁", title: "Read for 15 minutes", category: "Growth", xp: 20, done: false },
];

function Home() {
  const [quests, setQuests] = useState(starterQuests);
  const [tab, setTab] = useState("Today");
  const completed = quests.filter((quest) => quest.done).length;
  const earnedXp = useMemo(() => quests.filter((quest) => quest.done).reduce((sum, quest) => sum + quest.xp, 0), [quests]);
  const toggleQuest = (id: number) => setQuests((current) => current.map((quest) => quest.id === id ? { ...quest, done: !quest.done } : quest));

  return (
    <main className="app-shell">
      <Navbar />
      <section className="hero-panel">
        <div className="sun" />
        <p className="eyebrow">TUESDAY · JULY 22</p>
        <h1>Make today<br /><em>count.</em></h1>
        <p className="hero-copy">Tiny actions, real momentum. You’re building a life you’ll be proud of.</p>
        <div className="level-chip"><span>5</span><div><strong>Level 5</strong><small>{earnedXp + 260} / 500 XP</small></div><i style={{ "--progress": `${Math.min(100, (earnedXp + 260) / 5)}%` } as React.CSSProperties} /></div>
      </section>

      <section className="dashboard">
        <div className="daily-score card">
          <div><p className="eyebrow">DAILY SCORE</p><strong>{completed}<span>/{quests.length}</span></strong><p>quests completed</p></div>
          <div className="score-ring"><span>{Math.round((completed / quests.length) * 100)}%</span></div>
        </div>

        <div className="section-heading"><div><p className="eyebrow">YOUR QUESTS</p><h2>Choose your next win</h2></div><button className="add-button" type="button" onClick={() => alert("Custom quests are the next milestone—see PROJECT_CONTEXT.md.")}>+ Add quest</button></div>
        <div className="tabs" role="tablist">{["Today", "Week", "All"].map((label) => <button key={label} type="button" className={tab === label ? "active" : ""} onClick={() => setTab(label)}>{label}</button>)}</div>
        <div className="quest-list">{quests.map((quest) => <button className={`quest ${quest.done ? "done" : ""}`} type="button" key={quest.id} onClick={() => toggleQuest(quest.id)}>
          <span className="quest-icon">{quest.icon}</span><span className="quest-text"><strong>{quest.title}</strong><small>{quest.category}</small></span><span className="xp">+{quest.xp} XP</span><span className="check">{quest.done ? "✓" : ""}</span>
        </button>)}</div>

        <section className="streak-card"><div className="streak-flame">♨</div><div><p className="eyebrow">CURRENT STREAK</p><h2>7 days on fire</h2><p>One small win keeps it alive.</p></div><div className="week">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span className={index < 2 ? "won" : index === 2 ? "today" : ""} key={`${day}-${index}`}>{day}</span>)}</div></section>
      </section>
    </main>
  );
}

export default Home;
