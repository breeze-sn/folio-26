import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Seo from "../ui/Seo";
import { workouts } from "./workouts";
import "./gym.css";

const storageKey = "form-gym-week-v1";
const legacyExerciseIndexes = [[0, 1, 2, 3, 4], [0, 1, null, 4, null], [0, 1, 2, 3, 4], [0, 1, 2, null, null], [0, 1, 2, 3, 4], [3, null, null, 4, 5], []];
const emptyProgress = () => ({ version: 2, week: weekKey(), days: {} });
function weekKey(date = new Date()) { const d = new Date(date); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.week !== weekKey()) return emptyProgress();
    if (saved.version === 2) return saved;
    const days = Object.fromEntries(Object.entries(saved.days || {}).map(([day, completed]) => {
      const indexMap = legacyExerciseIndexes[Number(day)] || [];
      return [day, [...new Set(completed.map((index) => indexMap[index]).filter(Number.isInteger))]];
    }));
    return { ...saved, version: 2, days };
  } catch { return emptyProgress(); }
}
async function readApiJson(response, serviceName) {
  const body = await response.text();
  if (!body.trim()) throw new Error(`${serviceName} returned an empty response (HTTP ${response.status}). Confirm the latest app and API code are deployed.`);
  try { return JSON.parse(body); } catch { throw new Error(`${serviceName} returned an unexpected response (HTTP ${response.status}). Confirm the latest app and API code are deployed.`); }
}

function ExerciseRow({ exercise, index, checked, onToggle }) {
  return <label className={`gym-exercise${checked ? " is-done" : ""}`}>
    <input type="checkbox" checked={checked} onChange={onToggle} aria-label={`Mark ${exercise[0]} complete`} />
    <span className="gym-check" aria-hidden="true"><Icon icon="ph:check-bold" /></span>
    <span className="gym-exercise-copy"><span className="gym-exercise-name">{exercise[0]}</span><span className="gym-exercise-note">{exercise[1]}</span></span>
    <span className="gym-reps"><span>{exercise[2]}</span><small>{exercise[3] || "SETS / REPS"}</small></span>
    <span className="gym-index">{String(index + 1).padStart(2, "0")}</span>
  </label>;
}

function DailyNotes({ day, value, onChange }) {
  return <details className="gym-side-card gym-personal-notes">
    <summary><span className="gym-card-label">YOUR NOTES <Icon icon="ph:plus" /></span></summary>
    <label className="gym-notes-label" htmlFor="gym-daily-notes">{day} · PERSONAL LOG</label>
    <textarea
      id="gym-daily-notes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="What did you do today? Note weights, reps, how it felt, or anything to remember."
      maxLength={240}
      rows={5}
    />
    <p className="gym-notes-saved"><span><Icon icon="ph:lock-simple" /> Saved here · shared with OpenAI only when requested</span><small>{value.length}/240</small></p>
  </details>;
}

function GymAccessGate({ message = "", onUnlock }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(message);
  const configurationMissing = error.toLowerCase().includes("not configured");

  const submitCode = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/gym-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "unlock", code }),
      });
      const result = await readApiJson(response, "Gym access service");
      if (!response.ok) throw new Error(result.error || "Unable to unlock FORM.");
      setCode("");
      onUnlock();
    } catch (requestError) {
      setError(requestError.message || "Could not reach the access service. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="gym-lock-screen"><div className="gym-lock-card"><a className="gym-brand" href="/gym">FORM<span>®</span></a><p className="gym-eyebrow">A PRIVATE SPACE</p><h1>Good to see you.</h1><p className="gym-lock-copy">Enter your secret code to open your personal gym week.</p><form onSubmit={submitCode}><label htmlFor="gym-access-code">SECRET CODE</label><input id="gym-access-code" type="password" autoComplete="current-password" autoFocus value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter your code" required disabled={configurationMissing}/><button className="gym-lock-submit" type="submit" disabled={submitting || configurationMissing || !code}>{submitting ? "Checking…" : "Unlock FORM"}<Icon icon="ph:arrow-right"/></button></form>{error && <p className="gym-lock-error" role="alert">{error}</p>}<p className="gym-lock-foot">YOUR WEEK. YOUR SPACE.</p></div></main>;
}

function RestTimer() {
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return undefined; const id = window.setInterval(() => setSeconds((s) => { if (s <= 1) { setRunning(false); return 0; } return s - 1; }), 1000); return () => window.clearInterval(id); }, [running]);
  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return <section className="gym-side-card gym-timer"><div className="gym-card-label">REST TIMER <Icon icon="ph:timer" /></div><div className="gym-timer-value" aria-live="polite">{display}</div><div className="gym-timer-actions"><button onClick={() => setRunning((v) => !v)}>{running ? "Pause" : seconds === 0 ? "Start again" : "Start"}</button><button className="gym-quiet-button" onClick={() => { setRunning(false); setSeconds(90); }}>Reset</button><button className="gym-quiet-button" aria-label="Add 30 seconds" onClick={() => setSeconds((s) => s + 30)}>+30s</button></div></section>;
}

export default function Gym() {
  const [progress, setProgress] = useState(readProgress);
  const [todayIndex, setTodayIndex] = useState(() => (new Date().getDay() + 6) % 7);
  const [selected, setSelected] = useState(() => (new Date().getDay() + 6) % 7);
  const [started, setStarted] = useState(false);
  const [coachReview, setCoachReview] = useState(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");
  const [authStatus, setAuthStatus] = useState("checking");
  const [authMessage, setAuthMessage] = useState("");
  const lastDetectedDay = useRef(todayIndex);
  const workout = workouts[selected];
  const done = progress.days[selected] || [];
  const completeDays = useMemo(() => Object.entries(progress.days).filter(([day, items]) => workouts[Number(day)]?.exercises.length > 0 && workouts[Number(day)].exercises.length === items.length).length, [progress]);
  const isComplete = workout.exercises.length > 0 && done.length === workout.exercises.length;
  useEffect(() => {
    let alive = true;
    fetch("/api/gym-auth", { credentials: "same-origin" })
      .then(async (response) => {
        const result = await readApiJson(response, "Gym access service");
        if (!alive) return;
        if (response.ok && result.authenticated) setAuthStatus("authenticated");
        else {
          setAuthStatus("locked");
          if (response.status !== 401) setAuthMessage(result.error || "The access service is unavailable.");
        }
      })
      .catch(() => {
        if (!alive) return;
        setAuthStatus("locked");
        setAuthMessage("Could not reach the access service. Run the app server and try again.");
      });
    return () => { alive = false; };
  }, []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Storage may be unavailable. */ } }, [progress]);
  useEffect(() => {
    const updateToday = () => {
      const nextToday = (new Date().getDay() + 6) % 7;
      if (lastDetectedDay.current !== nextToday) {
        lastDetectedDay.current = nextToday;
        setTodayIndex(nextToday);
        setSelected(nextToday);
        setStarted(false);
      }
      setProgress((current) => current.week === weekKey() ? current : emptyProgress());
    };
    const interval = window.setInterval(updateToday, 60_000);
    return () => window.clearInterval(interval);
  }, []);
  const setDone = (index, checked) => setProgress((current) => { const days = { ...current.days }; const list = new Set(days[selected] || []); checked ? list.add(index) : list.delete(index); days[selected] = [...list].sort((a, b) => a - b); return { ...current, days }; });
  const resetSession = () => { if (!window.confirm(`Reset ${workout.day}'s session? This will clear its exercise progress.`)) return; setProgress((current) => { const days = { ...current.days }; delete days[selected]; return { ...current, days }; }); setStarted(false); };
  const resetWeek = () => { if (!window.confirm("Start a new week? All saved workout progress will be cleared.")) return; setProgress(emptyProgress()); setStarted(false); };
  const saveDailyNote = (note) => setProgress((current) => ({ ...current, notes: { ...current.notes, [selected]: note } }));
  const reviewProgress = async () => {
    setCoachLoading(true);
    setCoachError("");
    setCoachReview(null);
    const coachProgress = {
      weekStarting: progress.week,
      days: workouts.map((item, index) => ({
        day: item.day,
        complete: item.exercises.length > 0 && (progress.days[index] || []).length === item.exercises.length,
        completedExercises: (progress.days[index] || []).map((exerciseIndex) => item.exercises[exerciseIndex]?.[0]).filter(Boolean),
        totalExercises: item.exercises.length,
      })),
      notes: Object.entries(progress.notes || {})
        .map(([dayIndex, note]) => ({ day: workouts[Number(dayIndex)]?.day, note: String(note).trim() }))
        .filter((entry) => entry.day && entry.note),
    };
    try {
      const response = await fetch("/api/gym-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: coachProgress }),
      });
      const result = await readApiJson(response, "FORM Coach");
      if (!response.ok) throw new Error(result.error || "Could not review your progress.");
      setCoachReview(result);
    } catch (error) {
      setCoachError(error.message || "The coach is unavailable right now. Please try again.");
    } finally {
      setCoachLoading(false);
    }
  };
  const lockGym = async () => {
    try { await fetch("/api/gym-auth", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ action: "logout" }) }); } finally { setAuthStatus("locked"); setCoachReview(null); }
  };

  if (authStatus === "checking") return <div className="gym-lock-screen"><div className="gym-lock-card gym-lock-checking"><span className="gym-lock-spinner"><Icon icon="ph:circle-notch"/></span><span>Opening your space…</span></div></div>;
  if (authStatus !== "authenticated") return <GymAccessGate key={authMessage} message={authMessage} onUnlock={() => { setAuthMessage(""); setAuthStatus("authenticated"); }} />;

  return <div className="gym-app"><Seo title="FORM — Gym Planner" description="Your personal gym week, thoughtfully planned." url="https://simransn.vercel.app/gym" />
    <header className="gym-header"><a className="gym-brand" href="/gym" aria-label="FORM home">FORM<span>®</span></a><span className="gym-header-subtitle">YOUR PERSONAL GYM WEEK</span><div className="gym-week-progress"><span className="gym-progress-ring">{completeDays}<small>/6</small></span><span>SESSIONS<br/>COMPLETE</span></div><button className="gym-lock-button" onClick={lockGym}><Icon icon="ph:lock-key"/> Lock</button></header>
    <main className="gym-main">
      <section className="gym-intro"><div><p className="gym-eyebrow">A PLAN THAT MEETS YOU WHERE YOU ARE</p><h1>Stronger, in<br/><em>your own shape.</em></h1><p className="gym-intro-copy">A considered week for lower-body growth, posture, and comfortable movement. Each active day has a 60-minute target that includes rest and recovery. Move at your pace; consistency is the goal.</p></div><div className="gym-split"><div className="gym-card-label">THIS WEEK’S SPLIT</div><div><span>03</span> lower-body growth</div><div><span>03</span> strength, stability &amp; recovery</div><div><span>01</span> rest day</div></div></section>
      <section className="gym-week"><div className="gym-section-heading"><div><p className="gym-eyebrow">YOUR ROUTINE</p><h2>The week</h2></div><div className="gym-week-actions"><button className="gym-text-button" onClick={resetWeek}><Icon icon="ph:arrow-counter-clockwise"/> Start a new week</button><button className="gym-coach-trigger" onClick={reviewProgress} disabled={coachLoading}><Icon icon={coachLoading ? "ph:circle-notch" : "ph:sparkle"} className={coachLoading ? "gym-spin" : ""}/>{coachLoading ? "Reviewing" : "Ask FORM coach"}<Icon icon="ph:arrow-up-right"/></button></div></div><div className="gym-day-list" role="tablist" aria-label="Workout days">{workouts.map((item, index) => { const dayDone = item.exercises.length > 0 && (progress.days[index] || []).length === item.exercises.length; return <button key={item.day} role="tab" aria-selected={selected === index} className={`gym-day${selected === index ? " active" : ""}${dayDone ? " complete" : ""}`} onClick={() => { setSelected(index); setStarted(false); }}><span className="gym-day-name">{item.short}</span><span className="gym-day-title">{item.day}</span><span className="gym-day-indicator">{dayDone ? <Icon icon="ph:check-bold"/> : index === todayIndex ? <span className="gym-today-dot"/> : null}</span></button>; })}</div>
        {(coachReview || coachError || coachLoading) && <div className="gym-coach-card" aria-live="polite"><div className="gym-coach-mark"><Icon icon="ph:sparkle"/></div><div className="gym-coach-content">{coachLoading ? <><p className="gym-eyebrow">FORM COACH</p><h3>Looking over your week…</h3><p className="gym-coach-muted">Checking this week’s sessions and notes.</p></> : coachError ? <><p className="gym-eyebrow">FORM COACH</p><h3>Couldn’t load your review.</h3><p className="gym-coach-muted">{coachError}</p><button className="gym-text-button" onClick={reviewProgress}>Try again</button></> : <><p className="gym-eyebrow">A LOOK AT YOUR WEEK · OPENAI</p><h3>{coachReview.headline}</h3><div className="gym-coach-columns">{coachReview.observations?.length > 0 && <div><small>WHAT I NOTICE</small><ul>{coachReview.observations.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}{coachReview.nextSteps?.length > 0 && <div><small>GOOD NEXT STEPS</small><ul>{coachReview.nextSteps.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}</div><p className="gym-coach-add"><Icon icon="ph:plus-circle"/><span><strong>Something to add</strong>{coachReview.addNext}</span></p><p className="gym-coach-disclaimer">Based on your notes and check-offs for this week. Weights and effort aren’t tracked, so the coach won’t infer strength gains.</p></>}</div></div>}
      </section>
      <section className="gym-workout-layout" role="tabpanel">
        <div className="gym-workout-main"><div className="gym-workout-top"><div><p className="gym-eyebrow">{workout.day.toUpperCase()} · {workout.category.toUpperCase()}</p><h2>{workout.title}</h2><p className="gym-workout-sub">{workout.day === "Sunday" ? "Make room for recovery." : workout.day === "Thursday" || workout.day === "Saturday" ? "A little movement goes a long way." : "Steady effort. Good form. Your own pace."}</p></div>{workout.duration && <div className="gym-duration"><span>{workout.duration}</span><small>MIN TARGET</small></div>}</div>
          {workout.warmup && <div className="gym-warmup"><span className="gym-warmup-icon"><Icon icon="ph:sun-horizon"/></span><div><small>WARM UP</small><p>{workout.warmup}</p></div></div>}
          {workout.exercises.length ? <><div className="gym-exercise-heading"><h3>Main workout</h3><span>{done.length} of {workout.exercises.length} complete</span></div><div className="gym-exercise-list" id="gym-exercises" tabIndex={-1}>{workout.exercises.map((exercise, i) => <ExerciseRow key={`${selected}-${exercise[0]}`} exercise={exercise} index={i} checked={done.includes(i)} onToggle={(e) => setDone(i, e.target.checked)}/>)}</div>{workout.cooldown && <div className="gym-cooldown"><span className="gym-cooldown-label">COOL-DOWN / RECOVERY</span><p>{workout.cooldown}</p></div>}<div className={`gym-session-status${isComplete ? " is-complete" : ""}`}><span><Icon icon={isComplete ? "ph:check-circle" : "ph:circle-dashed"}/>{isComplete ? "Session complete. Nice work." : `${done.length} / ${workout.exercises.length} movements complete`}</span><div><button className="gym-reset-session" onClick={resetSession}>Reset session</button><button className="gym-start" onClick={() => { setStarted(true); document.getElementById("gym-exercises")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>{started ? "You’ve got this" : "Begin session"}<Icon icon="ph:arrow-up-right"/></button></div></div></> : <div className="gym-rest-state"><span><Icon icon="ph:moon-stars"/></span><h3>Rest, recover, rebuild.</h3><p>{workout.restMessage}</p></div>}
        </div>
        <aside className="gym-sidebar">{workout.exercises.length > 0 && <><div className="gym-side-card"><div className="gym-card-label">A NOTE FOR TODAY <Icon icon="ph:lightbulb"/></div><p>{workout.tip}</p></div><div className="gym-side-card"><div className="gym-card-label">REST BETWEEN SETS <Icon icon="ph:hourglass"/></div><p>90–120 sec after bigger lifts.<br/>45–75 sec for accessories.<br/><span>Adjust as you need.</span></p></div><RestTimer/></>}
          <details className="gym-side-card gym-guidance"><summary><span className="gym-card-label">TRAINING NOTES <Icon icon="ph:plus"/></span></summary><ul><li>Move with control in a comfortable range; do not force your joints into extreme positions.</li><li>Keep resistance light for arm and shoulder movements. Wall slides and other upper-body movements are optional if uncomfortable.</li><li>Choose a manageable resistance; there is no need to increase weight.</li><li>Allow recovery between hard lower-body sessions.</li><li>Eat regular meals, drink water, and get enough rest.</li></ul><p className="gym-safety"><strong>Joint-friendly reminder</strong><br/>Stop any movement that causes pain, instability, or increased tightness. This is general training guidance, not treatment.<br/><br/><strong>A note on asthma</strong><br/>Follow your prescribed asthma-management plan and keep your prescribed reliever accessible. Stop if you experience wheezing, chest tightness, or unusual breathlessness.</p></details>
          <DailyNotes day={workout.day} value={progress.notes?.[selected] || ""} onChange={saveDailyNote}/>
        </aside>
      </section>
      <footer className="gym-footer"><span>FORM · MADE FOR YOUR OWN PACE</span><span>ONE SESSION AT A TIME.</span></footer>
    </main>
  </div>;
}
