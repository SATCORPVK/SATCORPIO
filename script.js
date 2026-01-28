/* =========================================================
   ANUNNAKI ARCHIVE — script.js
   Grounded sci-fi interactions:
   - Boot overlay progress + tap to enter
   - Clock + small telemetry jitter
   - Star map canvas (lightweight)
   - Translation synth + terminal UX (copy, noise)
   - Ops log helpers
   ========================================================= */

(() => {
  "use strict";

  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // Elements
  const boot = $("#boot");
  const bootFill = $("#bootFill");

  const clockEl = $("#clock");
  const latencyEl = $("#latency");
  const resonanceEl = $("#resonance");
  const confidenceEl = $("#confidence");
  const statEl = $("#stat");

  const inputFragment = $("#inputFragment");
  const terminal = $("#terminal");

  const btnTranslate = $("#btnTranslate");
  const btnExport = $("#btnExport");
  const btnSynthesize = $("#btnSynthesize");
  const btnClear = $("#btnClear");
  const btnCopy = $("#btnCopy");
  const btnNoise = $("#btnNoise");

  const btnPing = $("#btnPing");
  const btnLog = $("#btnLog");

  const btnMode = $("#btnMode");
  const btnSeal = $("#btnSeal");

  const raEl = $("#ra");
  const decEl = $("#dec");
  const driftEl = $("#drift");

  const logs = $("#logs");

  // Canvas
  const canvas = $("#starMap");
  const ctx = canvas?.getContext?.("2d");

  // State
  const state = {
    mode: "FIELD",
    seal: "LOCK",
    bootDone: false,
    noise: false,
    lastReading: "",
    stars: [],
    w: 800,
    h: 260,
    dpr: 1,
    t0: performance.now(),
  };

  // ---------- Helpers ----------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function formatClock(d = new Date()) {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  function setStat(text, kind = "READY") {
    if (!statEl) return;
    statEl.textContent = kind === "READY" ? text : `${kind}: ${text}`;
  }

  function logLine(message) {
    if (!logs) return;
    const li = document.createElement("li");
    const ts = document.createElement("span");
    const msg = document.createElement("span");
    ts.className = "ts";
    msg.className = "msg";

    // crude elapsed style T-00:xx (not real time)
    const elapsed = Math.floor((performance.now() - state.t0) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    ts.textContent = `T+${mm}:${ss}`;
    msg.textContent = ` ${message}`;

    li.appendChild(ts);
    li.appendChild(msg);
    logs.prepend(li);
  }

  function typeToTerminal(lines, opts = {}) {
    const { speed = 14, clear = true } = opts;
    if (!terminal) return;

    const text = Array.isArray(lines) ? lines.join("\n") : String(lines);
    if (clear) terminal.textContent = "";

    let i = 0;
    setStat("WRITING", "STATE");

    const tick = () => {
      terminal.textContent = text.slice(0, i);
      i += Math.max(1, Math.floor(speed / 2));
      if (i <= text.length) {
        requestAnimationFrame(tick);
      } else {
        terminal.textContent = text;
        setStat("READY");
        state.lastReading = text;
      }
    };
    tick();
  }

  function addSignalNoise(text) {
    // subtle “field corruption”
    const glitches = ["▒", "░", "·", "•", "⟂", "⟡", "⟟", "⌁"];
    const chars = text.split("");
    const count = clamp(Math.floor(text.length * 0.015), 6, 40);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(rand(0, chars.length));
      if (chars[idx] === "\n" || chars[idx] === " ") continue;
      if (Math.random() < 0.55) chars[idx] = pick(glitches);
    }
    return chars.join("");
  }

  // ---------- Boot ----------
  function runBoot() {
    if (!boot || !bootFill) return;

    let p = 0;
    const step = () => {
      p = clamp(p + rand(2, 8), 0, 100);
      bootFill.style.width = `${p}%`;
      if (p < 100) {
        setTimeout(step, rand(60, 140));
      } else {
        state.bootDone = true;
        // let the user tap to enter, but allow auto-enter after a moment
        setTimeout(() => {
          if (boot && boot.style.display !== "none") {
            // keep it until user taps; don’t force
          }
        }, 250);
      }
    };
    step();

    const enter = () => {
      if (!state.bootDone) return;
      boot.style.opacity = "0";
      boot.style.transition = "opacity 450ms ease";
      setTimeout(() => {
        boot.style.display = "none";
      }, 500);

      logLine("Entered interface. Operator present.");
      seedTerminal();
      window.removeEventListener("pointerdown", enter);
    };

    // Tap anywhere to enter
    window.addEventListener("pointerdown", enter, { passive: true });
  }

  function seedTerminal() {
    const starter = [
      "> link verified: ORBITAL RELAY / NIBIRU-TRACE",
      "> mode: READ-ONLY FIELD",
      "> awaiting fragment…",
      "> press “Synthesize Reading”",
    ].join("\n");
    if (terminal) terminal.textContent = starter;
  }

  // ---------- Clock + Telemetry ----------
  function startClock() {
    if (!clockEl) return;
    const tick = () => {
      clockEl.textContent = formatClock();
      setTimeout(tick, 1000);
    };
    tick();
  }

  function startTelemetryJitter() {
    // Keep it subtle/credible.
    const tick = () => {
      if (latencyEl) latencyEl.textContent = `${Math.floor(rand(12, 34))}ms`;
      if (resonanceEl) resonanceEl.textContent = rand(0.62, 0.88).toFixed(2);
      if (driftEl) driftEl.textContent = rand(0.001, 0.009).toFixed(3);

      if (raEl) raEl.textContent = (14 + rand(-0.12, 0.12)).toFixed(3);
      if (decEl) decEl.textContent = (-2 + rand(-0.22, 0.22)).toFixed(3);

      setTimeout(tick, rand(1500, 2800));
    };
    tick();
  }

  // ---------- Mode / Seal ----------
  function wireModeSeal() {
    if (btnMode) {
      btnMode.addEventListener("click", () => {
        state.mode = state.mode === "FIELD" ? "ARCHIVE" : "FIELD";
        btnMode.setAttribute("aria-pressed", state.mode === "ARCHIVE" ? "true" : "false");
        btnMode.querySelector(".chip__v").textContent = state.mode;
        logLine(`Mode toggled → ${state.mode}.`);
      });
    }

    if (btnSeal) {
      btnSeal.addEventListener("click", () => {
        state.seal = state.seal === "LOCK" ? "OPEN" : "LOCK";
        btnSeal.querySelector(".chip__v").textContent = state.seal;
        logLine(`Seal state: ${state.seal}.`);
      });
    }
  }

  // ---------- Star Map Canvas ----------
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    state.w = Math.max(320, Math.floor(rect.width));
    state.h = Math.max(180, Math.floor(rect.height));

    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    // Re-seed stars on resize
    seedStars();
  }

  function seedStars() {
    if (!ctx) return;
    const count = clamp(Math.floor((state.w * state.h) / 9000), 40, 120);
    state.stars = new Array(count).fill(0).map(() => ({
      x: rand(0, state.w),
      y: rand(0, state.h),
      r: rand(0.6, 1.6),
      a: rand(0.2, 0.9),
      tw: rand(0.6, 1.8), // twinkle speed
    }));
  }

  function drawStarMap(t) {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, state.w, state.h);

    // background
    const grad = ctx.createRadialGradient(state.w * 0.6, state.h * 0.2, 10, state.w * 0.5, state.h * 0.5, state.w);
    grad.addColorStop(0, "rgba(90, 130, 255, 0.10)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, state.w, state.h);

    // faint grid
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "rgba(140,160,255,0.25)";
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x < state.w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, state.h);
      ctx.stroke();
    }
    for (let y = 0; y < state.h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(state.w, y + 0.5);
      ctx.stroke();
    }

    // stars
    ctx.globalAlpha = 1;
    for (const s of state.stars) {
      const tw = 0.35 + 0.65 * Math.abs(Math.sin((t / 1000) * s.tw + s.x * 0.01));
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = "rgba(230,235,245,1)";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // trace line (orbital path hint)
    ctx.strokeStyle = "rgba(111,227,255,0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const mid = state.h * 0.56;
    for (let x = 0; x <= state.w; x += 18) {
      const y = mid + Math.sin((x / state.w) * Math.PI * 2 + t / 3200) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    requestAnimationFrame(drawStarMap);
  }

  // ---------- Translation Synth ----------
  function synthesizeReading(fragment) {
    const frag = (fragment || "").trim();
    const has = frag.length > 0;

    const confidence = has ? rand(0.66, 0.93) : rand(0.48, 0.62);
    if (confidenceEl) confidenceEl.textContent = `${Math.round(confidence * 100)}%`;

    const tags = [
      "marker sequence",
      "star reference",
      "lineage registry",
      "oath clause",
      "construction note",
      "cargo manifest",
      "boundary warning",
      "ritual calendar",
    ];

    const headings = [
      "DRAFT READING / FIELD SUMMARY",
      "NON-AUTHORITATIVE INTERPRETATION",
      "PROVISIONAL TRANSLATION PASS",
    ];

    const keyPhrases = [
      "the watchers set the measure",
      "the vault mouth remains sealed",
      "count the cycles by the red star",
      "do not disturb the sleeping stone",
      "names are bound to the lattice",
      "the path returns when the sky aligns",
      "only the marked may record",
    ];

    const procedural = [
      "Cross-check fracture edge for repeated determinatives.",
      "Compare sign spacing against known Eridu-line tablets.",
      "Flag any astral numerals; likely coordinate shorthand.",
      "Lock this pass, then generate export brief for archive.",
    ];

    const header = `> ${pick(headings)}
> confidence: ${(confidence * 100).toFixed(1)}%
> tags: ${pick(tags)}, ${pick(tags)}, ${pick(tags)}
> ---`;

    const content = has
      ? [
          "Summary:",
          `The fragment reads as a technical note rather than myth. It references ${pick(tags)} and includes a cautionary clause: “${pick(
            keyPhrases
          )}.”`,
          "",
          "Interpretation:",
          "A registry-style passage ties an object to a location (likely subterranean) and describes a timing condition for access (astral cycle / alignment).",
          "",
          "Operator Notes:",
          `- Input fragment: "${frag.slice(0, 140)}${frag.length > 140 ? "…" : ""}"`,
          `- Repeating motif suggests ${pick(["ownership", "maintenance", "boundary", "handoff protocol"])} language.`,
          `- Recommend capture under ID A-NA/Δ-${Math.floor(rand(100, 999))}.`,
          "",
          "Next Steps:",
          ...procedural.map((s) => `- ${s}`),
        ]
      : [
          "Summary:",
          "No operator fragment provided. Generated a baseline field brief from slab pattern-matching only.",
          "",
          "Interpretation:",
          `Likely a short administrative text with a seal clause: “${pick(keyPhrases)}.”`,
          "",
          "Next Steps:",
          ...procedural.map((s) => `- ${s}`),
        ];

    let out = `${header}\n${content.join("\n")}\n`;

    if (state.noise) out = addSignalNoise(out);
    return out;
  }

  function wireTranslation() {
    const doSynth = () => {
      setStat("SYNTH", "STATE");
      logLine("Translation pass started.");
      const out = synthesizeReading(inputFragment?.value || "");
      typeToTerminal(out, { speed: 16, clear: true });
      setTimeout(() => logLine("Translation pass complete. Draft ready."), 550);
    };

    if (btnSynthesize) btnSynthesize.addEventListener("click", doSynth);
    if (btnTranslate) btnTranslate.addEventListener("click", doSynth);

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        if (inputFragment) inputFragment.value = "";
        seedTerminal();
        if (confidenceEl) confidenceEl.textContent = "—";
        logLine("Operator input cleared.");
      });
    }

    if (btnCopy) {
      btnCopy.addEventListener("click", async () => {
        try {
          const text = state.lastReading || terminal?.textContent || "";
          await navigator.clipboard.writeText(text);
          setStat("COPIED");
          logLine("Output copied to clipboard.");
          setTimeout(() => setStat("READY"), 900);
        } catch {
          setStat("COPY FAILED", "ERR");
        }
      });
    }

    if (btnNoise) {
      btnNoise.addEventListener("click", () => {
        state.noise = !state.noise;
        btnNoise.textContent = state.noise ? "Remove Signal Noise" : "Add Signal Noise";
        logLine(`Signal noise: ${state.noise ? "ENABLED" : "DISABLED"}.`);
        if (state.lastReading) {
          const updated = state.noise ? addSignalNoise(state.lastReading) : synthesizeReading(inputFragment?.value || "");
          if (terminal) terminal.textContent = updated;
          state.lastReading = updated;
        }
      });
    }

    if (btnExport) {
      btnExport.addEventListener("click", () => {
        // lightweight "export": download a txt
        const blob = new Blob([state.lastReading || terminal?.textContent || ""], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `anunnaki-archive-brief_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 500);
        logLine("Export brief generated (txt).");
      });
    }
  }

  // ---------- Ops Log Buttons ----------
  function wireLogs() {
    if (btnPing) {
      btnPing.addEventListener("click", () => {
        logLine(`Ping relay → latency ${Math.floor(rand(12, 34))}ms.`);
        setStat("PING");
        setTimeout(() => setStat("READY"), 800);
      });
    }

    if (btnLog) {
      btnLog.addEventListener("click", () => {
        const entries = [
          "Signal carrier stabilized. Minor phase drift corrected.",
          "Subsurface echo detected. Possible chamber branching.",
          "Spectral match: 0.81. Recommend second pass.",
          "Seam anomaly flagged. Capture high-res edge scan.",
          "Operator note stored. Awaiting confirmation.",
        ];
        logLine(pick(entries));
      });
    }
  }

  // ---------- Accessibility / Keyboard ----------
  function wireKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        if (btnSynthesize) btnSynthesize.click();
      }
      if (e.key === "Escape") {
        // quick clear terminal selection / focus
        if (document.activeElement === terminal) terminal.blur();
      }
    });
  }

  // ---------- Init ----------
  function init() {
    runBoot();
    startClock();
    startTelemetryJitter();
    wireModeSeal();
    wireTranslation();
    wireLogs();
    wireKeyboard();

    if (canvas && ctx) {
      // Resize after layout paint
      const after = () => {
        resizeCanvas();
        requestAnimationFrame(drawStarMap);
      };
      setTimeout(after, 60);
      window.addEventListener("resize", () => resizeCanvas(), { passive: true });
    }

    // Prevent # links from jumping
    $$('a[href="#"]').forEach((a) =>
      a.addEventListener("click", (e) => e.preventDefault())
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
