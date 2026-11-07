var Gd = Object.defineProperty;
var Xd = (e, t, n) => t in e ? Gd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ye = (e, t, n) => Xd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as k, jsx as u, Fragment as me } from "react/jsx-runtime";
import { useTheme as Xa, useAppApi as Ua, ChatEmbed as Ud } from "@kirocrew/app-sdk";
import { Badge as xe, Btn as ie, Input as Vr, PageHeader as $i, ContentSkeleton as oi, EmptyState as qa, Card as zo, CardTitle as fs, SegmentedControl as qd } from "@kirocrew/app-sdk/ui";
import Ii, { useState as J, useMemo as le, memo as he, forwardRef as Ka, createContext as Fr, useCallback as $e, useContext as Jt, useRef as oe, useEffect as ce, useLayoutEffect as Ai } from "react";
import { s as en, M as Y, a as ve, A as Me, S as Pn, p as jr, N as Kd, D as Za, b as Zd, r as Qd, C as Qa, c as xn, d as _n, e as Jd, f as eu, g as tu, h as nu, w as ru, t as ou, G as iu, i as su, j as au, k as lu, u as cu, l as du, m as uu, n as Ht, o as Oo, q as fu, v as hu, x as pu, y as gu, z as mu, B as yu, E as wu, F as bu, H as vu, I as xu, J as _u, K as ku, T as Eu, L as Su, O as Nu, P as dt, Q as at, R as Cu, U as Mu, V as $u, W as Iu, X as Au } from "./chunks/ProjectMenu-Bcei-MBH.mjs";
import "react-dom";
const Ja = [
  { key: "all", label: "All", title: "Every agent" },
  { key: "model", label: "Use a model", title: "Agents that call a model" },
  { key: "leaves", label: "Can leave region", title: "Agents whose model runs outside your home region" },
  { key: "asks", label: "Asks you", title: "Agents that wait for a person" },
  { key: "planned", label: "Planned", title: "Agents a spec names that have no jobs yet" }
], el = {
  all: () => !0,
  model: (e) => e.models.length > 0,
  leaves: (e) => e.leaves_region.length > 0,
  asks: (e) => e.asks_you.length > 0,
  planned: (e) => e.status === "planned"
}, tl = { built: "built", planned: "planned", empty: "no jobs" };
function Tu(e, t) {
  return e.filter(el[t]);
}
function Lu(e) {
  const t = {};
  for (const { key: n } of Ja) t[n] = e.filter(el[n]).length;
  return t;
}
function Ti(e, t) {
  var i;
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return r === "agent" ? ((i = t.find((s) => s.id === e)) == null ? void 0 : i.label) ?? o : r === "job" ? `${o} job` : r === "module" ? en(o) : o;
}
function nl(e, t) {
  return [...new Set([...e.starts, ...e.handed_by].map((n) => Ti(n.node, t)))];
}
function zu(e, t) {
  return [...new Set(e.hands_off_to.map((n) => Ti(n.node, t)))];
}
function Li(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.models) t.has(n.node) || t.set(n.node, n);
  return [...t.values()];
}
function Ou(e, t) {
  return e.leaves ? "leaves" : e.region && t && e.region.trim().toLowerCase() === t.trim().toLowerCase() ? "home" : "unknown";
}
function Pu(e) {
  return e.region ? `${e.name} · ${e.region}` : e.name;
}
function Du(e) {
  return e.on ? { on: !1, focus: e.before, before: null, closeSavedView: !1 } : { on: !0, focus: null, before: e.focus, closeSavedView: !0 };
}
function Ru(e, t, n) {
  return { on: !0, focus: t, before: e.on ? e.before : n ? e.focus : null };
}
function Hu(e, t) {
  const n = (r) => (r ?? []).join(", ");
  return {
    list: e.list ?? "",
    jobs_key: e.jobs_key ?? t.jobs_key ?? "",
    hand_off_keys: n(e.hand_off_keys ?? t.hand_off_keys),
    model_calls: n(e.model_calls),
    asks_you_calls: n(e.asks_you_calls),
    modules: n((e.modules ?? []).map((r) => r.replace(/^module:/, ""))),
    home_region: e.home_region ?? ""
  };
}
function vt(e) {
  return [...new Set(e.split(/[\s,]+/).filter(Boolean))];
}
function Wu(e) {
  const t = {}, n = (o) => o.trim();
  n(e.list) && (t.list = n(e.list)), n(e.jobs_key) && (t.jobs_key = n(e.jobs_key)), vt(e.hand_off_keys).length && (t.hand_off_keys = vt(e.hand_off_keys)), vt(e.model_calls).length && (t.model_calls = vt(e.model_calls)), vt(e.asks_you_calls).length && (t.asks_you_calls = vt(e.asks_you_calls));
  const r = vt(e.modules).map((o) => `module:${o.replace(/^module:/, "")}`);
  return r.length && (t.modules = r), n(e.home_region) && (t.home_region = n(e.home_region)), t;
}
function Bu(e, t) {
  return { ...e, modules: [.../* @__PURE__ */ new Set([...e.modules ?? [], t])] };
}
const zi = {
  list: "Agent list",
  jobs_key: "Jobs key",
  hand_off_keys: "Hand-off keys",
  model_calls: "Model calls",
  asks_you_calls: "Asks-you calls",
  modules: "Agent modules",
  home_region: "Home region"
}, Vu = Object.keys(zi), Fu = "Use the system-map tools. Find this project's agents, following the Find my agents steps in the system-map skill. Try the settings with `draft_agents` and `dry_run: true`, fix what the result shows, then save the draft.";
function rl(e, t) {
  return e.settings.home_region || !t.home_region ? { ...e.settings } : { ...e.settings, home_region: t.home_region };
}
function hs(e, t) {
  return t === void 0 ? null : Array.isArray(t) ? (e === "modules" ? t.map((n) => n.replace(/^module:/, "")) : t).join(", ") : t;
}
function ju(e, t, n) {
  const r = rl(e, n);
  return Vu.filter((o) => e.settings[o] !== void 0 || t.includes(o)).map((o) => {
    const i = t.includes(o);
    return {
      key: o,
      label: zi[o],
      value: hs(o, r[o]),
      was: i ? hs(o, n[o]) : null,
      changed: i,
      evidence: e.evidence[o] ?? []
    };
  });
}
function Yu(e) {
  return e.count === 0 ? "With these, System Map finds no agents." : `With these, System Map finds ${e.count} agent${e.count === 1 ? "" : "s"}:`;
}
function Gu(e) {
  return `Drafted at ${e.commit ? e.commit.slice(0, 7) : "an older commit"}. The code has changed since, so check it first.`;
}
const wr = { padding: "5px 8px", textAlign: "left", verticalAlign: "top" }, Po = { ...wr, fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" };
function Xu({
  draft: e,
  changed: t,
  stale: n,
  saved: r,
  busy: o,
  error: i,
  onUse: s,
  onEdit: a,
  onDrop: l
}) {
  const c = ju(e, t, r);
  return /* @__PURE__ */ k("section", { "data-testid": "agent-draft", style: { border: "1px solid var(--accent, #2563eb)", borderRadius: 8, padding: 12, background: "var(--card, #fff)", fontSize: 13, maxWidth: 820 }, children: [
    /* @__PURE__ */ u("strong", { style: { fontSize: 14 }, children: "Drafted by the Design chat" }),
    n && /* @__PURE__ */ u("p", { "data-testid": "agent-draft-stale", style: { margin: "4px 0 0", color: "var(--warn-text, #b45309)" }, children: Gu(e) }),
    e.note && /* @__PURE__ */ u("p", { style: { margin: "6px 0 0" }, children: e.note }),
    /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", margin: "10px 0" }, children: [
      /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
        /* @__PURE__ */ u("th", { style: Po, children: "Setting" }),
        /* @__PURE__ */ u("th", { style: Po, children: "Value" }),
        /* @__PURE__ */ u("th", { style: Po, children: "Evidence" })
      ] }) }),
      /* @__PURE__ */ u("tbody", { children: c.map((d) => /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
        /* @__PURE__ */ k("td", { style: { ...wr, fontWeight: 600, whiteSpace: "nowrap" }, children: [
          d.label,
          " ",
          d.changed && /* @__PURE__ */ u(xe, { variant: "aim", children: "changed" })
        ] }),
        /* @__PURE__ */ k("td", { style: { ...wr, overflowWrap: "anywhere" }, children: [
          d.value === null ? /* @__PURE__ */ u("span", { style: Y, children: "none" }) : /* @__PURE__ */ u("span", { style: d.key === "home_region" ? void 0 : ve, children: d.value }),
          d.was !== null && /* @__PURE__ */ k("div", { style: { ...Y, fontSize: 12 }, children: [
            "was ",
            d.was
          ] })
        ] }),
        /* @__PURE__ */ u("td", { style: { ...wr, ...ve, ...Y, fontSize: 12, overflowWrap: "anywhere" }, children: d.evidence.length ? d.evidence.map((f) => /* @__PURE__ */ u("div", { children: f }, f)) : "—" })
      ] }, d.key)) })
    ] }),
    /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontWeight: 600 }, "data-testid": "agent-draft-finds", children: Yu(e) }),
    e.agents.length > 0 && /* @__PURE__ */ u("p", { style: { margin: 0 }, children: e.agents.map((d) => d.status === "built" ? d.label : `${d.label} (${tl[d.status]})`).join(", ") }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 12 }, children: [
      /* @__PURE__ */ u(ie, { primary: !0, disabled: o, onClick: s, children: o ? "Saving…" : "Use these" }),
      /* @__PURE__ */ u(ie, { disabled: o, onClick: a, children: "Edit first" }),
      /* @__PURE__ */ u(ie, { disabled: o, onClick: l, children: "Drop" }),
      i && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: i })
    ] })
  ] });
}
const Bt = { padding: "6px 8px", textAlign: "left", verticalAlign: "top" }, gn = { ...Bt, fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)", whiteSpace: "nowrap" }, Uu = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text, inherit)" }, or = { padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border-strong, #a1a1aa)", background: "var(--card, #fff)", fontSize: 12, overflowWrap: "anywhere" }, qu = { leaves: "err", home: "ok", unknown: "muted" }, Ku = { built: "var(--ok, #15803d)", planned: "var(--danger, #dc2626)", empty: "var(--warn-text, #b45309)" };
function ol({ status: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ u("span", { style: { width: 7, height: 7, borderRadius: "50%", background: Ku[e] } }),
    tl[e]
  ] });
}
function il({ models: e, home: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("span", { style: Y, children: "none" }) : /* @__PURE__ */ u("span", { style: { display: "inline-flex", flexWrap: "wrap", gap: 4 }, children: e.map((n) => /* @__PURE__ */ u(xe, { variant: qu[Ou(n, t)], title: n.leaves ? "Runs outside your home region" : n.region ? void 0 : "No region set. Set one on the service in the Map.", children: Pu(n) }, n.node)) });
}
function Do({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }, children: [
    /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: e }),
    t
  ] });
}
function Zu({ row: e, rows: t, home: n }) {
  const r = nl(e, t), o = zu(e, t), i = /* @__PURE__ */ u("span", { style: { ...Y, alignSelf: "center" }, children: "→" });
  return /* @__PURE__ */ k("div", { "data-testid": "agent-in-out", style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto auto minmax(0, 1fr)", gap: 6, margin: "10px 0" }, children: [
    /* @__PURE__ */ u(Do, { title: "Starts from", children: r.length ? r.map((s) => /* @__PURE__ */ u("span", { style: or, children: s }, s)) : /* @__PURE__ */ u("span", { style: Y, children: "nothing found" }) }),
    i,
    /* @__PURE__ */ u("span", { style: { ...or, alignSelf: "center", fontWeight: 600, border: "2px solid var(--accent, #2563eb)" }, children: e.label }),
    i,
    /* @__PURE__ */ k(Do, { title: "Then", children: [
      o.map((s) => /* @__PURE__ */ u("span", { style: or, children: s }, s)),
      e.asks_you.length > 0 && /* @__PURE__ */ u("span", { style: { ...or, border: "1px solid var(--info, #2563eb)", background: "var(--bg-elevated, #fff)" }, children: "Asks you" }),
      o.length === 0 && e.asks_you.length === 0 && /* @__PURE__ */ u("span", { style: Y, children: "nothing found" })
    ] }),
    /* @__PURE__ */ u("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ u(Do, { title: "Uses model", children: /* @__PURE__ */ u(il, { models: Li(e), home: n }) }) })
  ] });
}
function Qu({ row: e, rows: t, home: n, canAsk: r, onShow: o, onAsk: i }) {
  const s = [...e.evidence, ...Li(e).map((a) => a.evidence), ...e.asks_you, ...e.hands_off_to.map((a) => a.evidence)];
  return /* @__PURE__ */ k("div", { "data-testid": "agent-detail", style: { fontSize: 13 }, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }, children: [
      /* @__PURE__ */ u("strong", { style: { fontSize: 15 }, children: e.label }),
      /* @__PURE__ */ u(ol, { status: e.status })
    ] }),
    e.description && /* @__PURE__ */ u("p", { style: { margin: "6px 0 0" }, children: e.description }),
    /* @__PURE__ */ u(Zu, { row: e, rows: t, home: n }),
    e.jobs.length > 0 && /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k("p", { style: { margin: "8px 0 4px", fontWeight: 600 }, children: [
        "Jobs (",
        e.jobs.length,
        ")"
      ] }),
      /* @__PURE__ */ u("p", { style: { ...ve, fontSize: 12, margin: 0, overflowWrap: "anywhere" }, children: e.jobs.join("  ") })
    ] }),
    /* @__PURE__ */ u("p", { style: { margin: "10px 0 4px", fontWeight: 600 }, children: "Evidence" }),
    /* @__PURE__ */ u("ul", { style: { ...ve, ...Y, fontSize: 12, margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: [...new Set(s)].slice(0, 8).map((a) => /* @__PURE__ */ u("li", { children: a }, a)) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      /* @__PURE__ */ u(ie, { onClick: () => o(e.id), children: "Show on map" }),
      /* @__PURE__ */ u(ie, { onClick: () => i(e), disabled: !r, children: "Ask" })
    ] })
  ] });
}
const Ju = [
  { key: "list", help: "The file whose exported array lists your agents, such as src/agents/registry.ts" },
  { key: "jobs_key", help: "The property that holds each agent's jobs" },
  { key: "hand_off_keys", help: "Properties that name the agent to hand work to, such as agent" },
  { key: "model_calls", help: "Functions that call a model, such as claude" },
  { key: "asks_you_calls", help: "Functions that leave work for a person, such as addTask" },
  { key: "modules", help: "Folders to treat as one agent each, such as src/mail" },
  { key: "home_region", help: "Where your data should stay, such as Canada" }
];
function sl({ canAsk: e, onFind: t }) {
  return /* @__PURE__ */ u(ie, { onClick: t, disabled: !e, title: e ? "The Design chat reads your code and drafts these settings for you to check" : "The Design chat needs this project's folder", children: "Find my agents" });
}
function ef({
  state: e,
  start: t,
  saving: n,
  error: r,
  canAsk: o,
  onFind: i,
  onSave: s,
  onCancel: a
}) {
  const [l, c] = J(() => Hu(t ?? e.settings, e.defaults)), d = async (f) => {
    await s(f) && a && a();
  };
  return /* @__PURE__ */ k("div", { "data-testid": "agent-setup", style: { maxWidth: 640, fontSize: 13 }, children: [
    e.agents.length === 0 && !e.settings.list && /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontSize: 14, fontWeight: 600 }, children: "No agents yet." }),
      /* @__PURE__ */ u("p", { style: { ...Y, margin: "0 0 12px" }, children: "Point System Map at the file that lists your agents, or mark a module as one. Nothing is written to your repo." })
    ] }),
    e.agents.length === 0 && e.settings.list && /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k("p", { style: { margin: "0 0 4px", fontSize: 14, fontWeight: 600 }, "data-testid": "agents-not-found", children: [
        "No agents found in ",
        /* @__PURE__ */ u("span", { style: ve, children: e.settings.list }),
        "."
      ] }),
      /* @__PURE__ */ u("p", { style: { ...Y, margin: "0 0 12px" }, children: "It needs an exported list of objects that each have a name. Check the file, or mark a module instead." })
    ] }),
    e.agents.length === 0 && /* @__PURE__ */ k("div", { style: { display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }, children: [
      /* @__PURE__ */ u(sl, { canAsk: o, onFind: i }),
      /* @__PURE__ */ u("span", { style: Y, children: "The Design chat reads your code and drafts these settings for you to check." })
    ] }),
    e.agents.length === 0 && e.suggestions.length > 0 && /* @__PURE__ */ k("div", { style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600 }, children: "These modules call a model" }),
      e.suggestions.map((f) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }, children: [
        /* @__PURE__ */ u("span", { style: { ...ve, fontSize: 12, flex: 1 }, children: Ti(f, []) }),
        /* @__PURE__ */ u(ie, { disabled: n, onClick: () => void d(Bu(e.settings, f)), children: "Mark as agent" })
      ] }, f))
    ] }),
    /* @__PURE__ */ u("div", { style: { display: "grid", gridTemplateColumns: "minmax(110px, auto) minmax(0, 1fr)", gap: "8px 12px", alignItems: "start" }, children: Ju.map((f) => /* @__PURE__ */ k("label", { style: { display: "contents" }, children: [
      /* @__PURE__ */ u("span", { style: { paddingTop: 6, fontWeight: 600 }, children: zi[f.key] }),
      /* @__PURE__ */ k("span", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
        /* @__PURE__ */ u(Vr, { value: l[f.key], onChange: (h) => c({ ...l, [f.key]: h.target.value }), style: f.key === "home_region" ? void 0 : ve }),
        /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: f.help })
      ] })
    ] }, f.key)) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 14 }, children: [
      /* @__PURE__ */ u(ie, { primary: !0, disabled: n, onClick: () => void d(Wu(l)), children: n ? "Saving…" : "Save and rebuild" }),
      a && /* @__PURE__ */ u(ie, { onClick: a, children: "Cancel" }),
      r && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: r })
    ] })
  ] });
}
function tf({
  state: e,
  draft: t,
  canAsk: n,
  saving: r,
  error: o,
  draftError: i,
  onShow: s,
  onAsk: a,
  onSave: l,
  onFind: c,
  onDraft: d
}) {
  const [f, h] = J("all"), [p, g] = J(null), [v, b] = J(null), m = e.agents, _ = le(() => Lu(m), [m]), y = le(() => Tu(m, f), [m, f]), w = y.find((O) => O.id === p) ?? y[0] ?? null, N = e.home_region, E = (t == null ? void 0 : t.draft) ?? null, C = v === "draft" && E !== null, T = async (O) => {
    const L = await l(O);
    return L && await d("drop"), L;
  }, A = t && E && !C ? /* @__PURE__ */ u("div", { style: { flexShrink: 0, maxHeight: "50%", overflowY: "auto", marginBottom: m.length === 0 || v ? 16 : 0 }, children: /* @__PURE__ */ u(
    Xu,
    {
      draft: E,
      changed: t.changed,
      stale: t.stale,
      saved: e.settings,
      busy: r,
      error: i,
      onUse: () => void d("use"),
      onEdit: () => b("draft"),
      onDrop: () => void d("drop")
    }
  ) }) : null;
  if (m.length === 0 || v) {
    const O = m.length || C ? () => b(null) : void 0;
    return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, color: "var(--text, inherit)" }, children: [
      A,
      /* @__PURE__ */ u(
        ef,
        {
          state: e,
          start: C ? rl(E, e.settings) : void 0,
          saving: r,
          error: o,
          canAsk: n,
          onFind: c,
          onSave: C ? T : l,
          onCancel: O
        },
        C ? `draft:${E.drafted_at}` : "saved"
      )
    ] });
  }
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    A,
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "agents-summary", children: [
      /* @__PURE__ */ k("strong", { children: [
        m.length,
        " agent",
        m.length === 1 ? "" : "s",
        ". ",
        _.model,
        " use",
        _.model === 1 ? "s" : "",
        " a model, and ",
        _.asks,
        " ask",
        _.asks === 1 ? "s" : "",
        " you first."
      ] }),
      " ",
      /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 13 }, children: _.leaves > 0 ? `${_.leaves} can send data outside ${N}.` : N ? `Your home region is ${N}.` : "Set a home region to see where data goes." })
    ] }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      Ja.map((O) => /* @__PURE__ */ k(ie, { primary: f === O.key, title: O.title, onClick: () => h(O.key), children: [
        O.label,
        " ",
        _[O.key]
      ] }, O.key)),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(sl, { canAsk: n, onFind: c }),
      /* @__PURE__ */ u(ie, { onClick: () => b("settings"), children: "Agent settings" })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, display: "flex", gap: 16 }, children: [
      /* @__PURE__ */ k("div", { style: { flex: 1, minWidth: 0, overflow: "auto" }, children: [
        /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "agents-table", children: [
          /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
            /* @__PURE__ */ u("th", { style: gn, children: "Agent" }),
            /* @__PURE__ */ u("th", { style: gn, children: "Status" }),
            /* @__PURE__ */ u("th", { style: gn, children: "Starts from" }),
            /* @__PURE__ */ u("th", { style: gn, children: "Model" }),
            /* @__PURE__ */ u("th", { style: gn, children: "Asks you" })
          ] }) }),
          /* @__PURE__ */ u("tbody", { children: y.map((O) => /* @__PURE__ */ k("tr", { onClick: () => g(O.id), style: { borderBottom: "1px solid var(--border, #e4e4e7)", cursor: "pointer", background: O.id === (w == null ? void 0 : w.id) ? "var(--accent-subtle, rgba(37,99,235,.12))" : void 0 }, children: [
            /* @__PURE__ */ u("td", { style: Bt, children: /* @__PURE__ */ u("button", { style: Uu, "aria-pressed": O.id === (w == null ? void 0 : w.id), onClick: () => g(O.id), children: O.label }) }),
            /* @__PURE__ */ u("td", { style: Bt, children: /* @__PURE__ */ u(ol, { status: O.status }) }),
            /* @__PURE__ */ u("td", { style: { ...Bt, ...Y }, children: nl(O, m).join(", ") || "—" }),
            /* @__PURE__ */ u("td", { style: Bt, children: /* @__PURE__ */ u(il, { models: Li(O), home: N }) }),
            /* @__PURE__ */ u("td", { style: Bt, children: O.asks_you.length > 0 ? "Yes" : /* @__PURE__ */ u("span", { style: Y, children: "—" }) })
          ] }, O.id)) })
        ] }),
        y.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No agents here. Pick All to see every agent." })
      ] }),
      w && /* @__PURE__ */ u("aside", { style: { width: 320, flexShrink: 0, overflowY: "auto", paddingLeft: 16, borderLeft: "1px solid var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u(Qu, { row: w, rows: m, home: N, canAsk: n, onShow: s, onAsk: a }) })
    ] })
  ] });
}
function al(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var nf = "\0", xt = "\0", ps = "";
let rf = class {
  constructor(t) {
    ye(this, "_isDirected", !0);
    ye(this, "_isMultigraph", !1);
    ye(this, "_isCompound", !1);
    // Label for the graph itself
    ye(this, "_label");
    // Defaults to be set when creating a new node
    ye(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    ye(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    ye(this, "_nodes", {});
    // v -> edgeObj
    ye(this, "_in", {});
    // u -> v -> Number
    ye(this, "_preds", {});
    // v -> edgeObj
    ye(this, "_out", {});
    // v -> w -> Number
    ye(this, "_sucs", {});
    // e -> edgeObj
    ye(this, "_edgeObjs", {});
    // e -> label
    ye(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    ye(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    ye(this, "_edgeCount", 0);
    ye(this, "_parent");
    ye(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[xt] = {});
  }
  /* === Graph functions ========= */
  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  isDirected() {
    return this._isDirected;
  }
  /**
   * Whether graph was created with 'multigraph' flag set to true or not.
   */
  isMultigraph() {
    return this._isMultigraph;
  }
  /**
   * Whether graph was created with 'compound' flag set to true or not.
   */
  isCompound() {
    return this._isCompound;
  }
  /**
   * Sets the label of the graph.
   */
  setGraph(t) {
    return this._label = t, this;
  }
  /**
   * Gets the graph label.
   */
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  /**
   * Sets the default node label. If newDefault is a function, it will be
   * invoked ach time when setting a label for a node. Otherwise, this label
   * will be assigned as default label in case if no label was specified while
   * setting a node.
   * Complexity: O(1).
   */
  setDefaultNodeLabel(t) {
    return this._defaultNodeLabelFn = t, typeof t != "function" && (this._defaultNodeLabelFn = () => t), this;
  }
  /**
   * Gets the number of nodes in the graph.
   * Complexity: O(1).
   */
  nodeCount() {
    return this._nodeCount;
  }
  /**
   * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
   * not included in list.
   * Complexity: O(1).
   */
  nodes() {
    return Object.keys(this._nodes);
  }
  /**
   * Gets list of nodes without in-edges.
   * Complexity: O(|V|).
   */
  sources() {
    var t = this;
    return this.nodes().filter((n) => Object.keys(t._in[n]).length === 0);
  }
  /**
   * Gets list of nodes without out-edges.
   * Complexity: O(|V|).
   */
  sinks() {
    var t = this;
    return this.nodes().filter((n) => Object.keys(t._out[n]).length === 0);
  }
  /**
   * Invokes setNode method for each node in names list.
   * Complexity: O(|names|).
   */
  setNodes(t, n) {
    var r = arguments, o = this;
    return t.forEach(function(i) {
      r.length > 1 ? o.setNode(i, n) : o.setNode(i);
    }), this;
  }
  /**
   * Creates or updates the value for the node v in the graph. If label is supplied
   * it is set as the value for the node. If label is not supplied and the node was
   * created by this call then the default node label will be assigned.
   * Complexity: O(1).
   */
  setNode(t, n) {
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = xt, this._children[t] = {}, this._children[xt][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }
  /**
   * Gets the label of node with specified name.
   * Complexity: O(|V|).
   */
  node(t) {
    return this._nodes[t];
  }
  /**
   * Detects whether graph has a node with specified name or not.
   */
  hasNode(t) {
    return Object.hasOwn(this._nodes, t);
  }
  /**
   * Remove the node with the name from the graph or do nothing if the node is not in
   * the graph. If the node was removed this function also removes any incident
   * edges.
   * Complexity: O(1).
   */
  removeNode(t) {
    var n = this;
    if (Object.hasOwn(this._nodes, t)) {
      var r = (o) => n.removeEdge(n._edgeObjs[o]);
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], this.children(t).forEach(function(o) {
        n.setParent(o);
      }), delete this._children[t]), Object.keys(this._in[t]).forEach(r), delete this._in[t], delete this._preds[t], Object.keys(this._out[t]).forEach(r), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }
    return this;
  }
  /**
   * Sets node p as a parent for node v if it is defined, or removes the
   * parent for v if p is undefined. Method throws an exception in case of
   * invoking it in context of noncompound graph.
   * Average-case complexity: O(1).
   */
  setParent(t, n) {
    if (!this._isCompound)
      throw new Error("Cannot set parent in a non-compound graph");
    if (n === void 0)
      n = xt;
    else {
      n += "";
      for (var r = n; r !== void 0; r = this.parent(r))
        if (r === t)
          throw new Error("Setting " + n + " as parent of " + t + " would create a cycle");
      this.setNode(n);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = n, this._children[n][t] = !0, this;
  }
  _removeFromParentsChildList(t) {
    delete this._children[this._parent[t]][t];
  }
  /**
   * Gets parent node for node v.
   * Complexity: O(1).
   */
  parent(t) {
    if (this._isCompound) {
      var n = this._parent[t];
      if (n !== xt)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = xt) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === xt)
        return this.nodes();
      if (this.hasNode(t))
        return [];
    }
  }
  /**
   * Return all nodes that are predecessors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  predecessors(t) {
    var n = this._preds[t];
    if (n)
      return Object.keys(n);
  }
  /**
   * Return all nodes that are successors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  successors(t) {
    var n = this._sucs[t];
    if (n)
      return Object.keys(n);
  }
  /**
   * Return all nodes that are predecessors or successors of the specified node or undefined if
   * node v is not in the graph.
   * Complexity: O(|V|).
   */
  neighbors(t) {
    var n = this.predecessors(t);
    if (n) {
      const o = new Set(n);
      for (var r of this.successors(t))
        o.add(r);
      return Array.from(o.values());
    }
  }
  isLeaf(t) {
    var n;
    return this.isDirected() ? n = this.successors(t) : n = this.neighbors(t), n.length === 0;
  }
  /**
   * Creates new graph with nodes filtered via filter. Edges incident to rejected node
   * are also removed. In case of compound graph, if parent is rejected by filter,
   * than all its children are rejected too.
   * Average-case complexity: O(|E|+|V|).
   */
  filterNodes(t) {
    var n = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    n.setGraph(this.graph());
    var r = this;
    Object.entries(this._nodes).forEach(function([s, a]) {
      t(s) && n.setNode(s, a);
    }), Object.values(this._edgeObjs).forEach(function(s) {
      n.hasNode(s.v) && n.hasNode(s.w) && n.setEdge(s, r.edge(s));
    });
    var o = {};
    function i(s) {
      var a = r.parent(s);
      return a === void 0 || n.hasNode(a) ? (o[s] = a, a) : a in o ? o[a] : i(a);
    }
    return this._isCompound && n.nodes().forEach((s) => n.setParent(s, i(s))), n;
  }
  /* === Edge functions ========== */
  /**
   * Sets the default edge label or factory function. This label will be
   * assigned as default label in case if no label was specified while setting
   * an edge or this function will be invoked each time when setting an edge
   * with no label specified and returned value * will be used as a label for edge.
   * Complexity: O(1).
   */
  setDefaultEdgeLabel(t) {
    return this._defaultEdgeLabelFn = t, typeof t != "function" && (this._defaultEdgeLabelFn = () => t), this;
  }
  /**
   * Gets the number of edges in the graph.
   * Complexity: O(1).
   */
  edgeCount() {
    return this._edgeCount;
  }
  /**
   * Gets edges of the graph. In case of compound graph subgraphs are not considered.
   * Complexity: O(|E|).
   */
  edges() {
    return Object.values(this._edgeObjs);
  }
  /**
   * Establish an edges path over the nodes in nodes list. If some edge is already
   * exists, it will update its label, otherwise it will create an edge between pair
   * of nodes with label provided or default label if no label provided.
   * Complexity: O(|nodes|).
   */
  setPath(t, n) {
    var r = this, o = arguments;
    return t.reduce(function(i, s) {
      return o.length > 1 ? r.setEdge(i, s, n) : r.setEdge(i, s), s;
    }), this;
  }
  /**
   * Creates or updates the label for the edge (v, w) with the optionally supplied
   * name. If label is supplied it is set as the value for the edge. If label is not
   * supplied and the edge was created by this call then the default edge label will
   * be assigned. The name parameter is only useful with multigraphs.
   */
  setEdge() {
    var t, n, r, o, i = !1, s = arguments[0];
    typeof s == "object" && s !== null && "v" in s ? (t = s.v, n = s.w, r = s.name, arguments.length === 2 && (o = arguments[1], i = !0)) : (t = s, n = arguments[1], r = arguments[3], arguments.length > 2 && (o = arguments[2], i = !0)), t = "" + t, n = "" + n, r !== void 0 && (r = "" + r);
    var a = wn(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = of(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, gs(this._preds[n], t), gs(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? Ro(this._isDirected, arguments[0]) : wn(this._isDirected, t, n, r);
    return this._edgeLabels[o];
  }
  /**
   * Gets the label for the specified edge and converts it to an object.
   * Complexity: O(1)
   */
  edgeAsObj() {
    const t = this.edge(...arguments);
    return typeof t != "object" ? { label: t } : t;
  }
  /**
   * Detects whether the graph contains specified edge or not. No subgraphs are considered.
   * Complexity: O(1).
   */
  hasEdge(t, n, r) {
    var o = arguments.length === 1 ? Ro(this._isDirected, arguments[0]) : wn(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? Ro(this._isDirected, arguments[0]) : wn(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], ms(this._preds[n], t), ms(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
  }
  /**
   * Return all edges that point to the node v. Optionally filters those edges down to just those
   * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  inEdges(t, n) {
    var r = this._in[t];
    if (r) {
      var o = Object.values(r);
      return n ? o.filter((i) => i.v === n) : o;
    }
  }
  /**
   * Return all edges that are pointed at by node v. Optionally filters those edges down to just
   * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  outEdges(t, n) {
    var r = this._out[t];
    if (r) {
      var o = Object.values(r);
      return n ? o.filter((i) => i.w === n) : o;
    }
  }
  /**
   * Returns all edges to or from node v regardless of direction. Optionally filters those edges
   * down to just those between nodes v and w regardless of direction.
   * Complexity: O(|E|).
   */
  nodeEdges(t, n) {
    var r = this.inEdges(t, n);
    if (r)
      return r.concat(this.outEdges(t, n));
  }
};
function gs(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function ms(e, t) {
  --e[t] || delete e[t];
}
function wn(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + ps + i + ps + (r === void 0 ? nf : r);
}
function of(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function Ro(e, t) {
  return wn(e, t.v, t.w, t.name);
}
var Oi = rf, sf = "2.2.4", af = {
  Graph: Oi,
  version: sf
}, lf = Oi, cf = {
  write: df,
  read: hf
};
function df(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: uf(e),
    edges: ff(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function uf(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function ff(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function hf(e) {
  var t = new lf(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var pf = gf;
function gf(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let mf = class {
  constructor() {
    ye(this, "_arr", []);
    ye(this, "_keyIndices", {});
  }
  /**
   * Returns the number of elements in the queue. Takes `O(1)` time.
   */
  size() {
    return this._arr.length;
  }
  /**
   * Returns the keys that are in the queue. Takes `O(n)` time.
   */
  keys() {
    return this._arr.map(function(t) {
      return t.key;
    });
  }
  /**
   * Returns `true` if **key** is in the queue and `false` if not.
   */
  has(t) {
    return Object.hasOwn(this._keyIndices, t);
  }
  /**
   * Returns the priority for **key**. If **key** is not present in the queue
   * then this function returns `undefined`. Takes `O(1)` time.
   *
   * @param {Object} key
   */
  priority(t) {
    var n = this._keyIndices[t];
    if (n !== void 0)
      return this._arr[n].priority;
  }
  /**
   * Returns the key for the minimum element in this queue. If the queue is
   * empty this function throws an Error. Takes `O(1)` time.
   */
  min() {
    if (this.size() === 0)
      throw new Error("Queue underflow");
    return this._arr[0].key;
  }
  /**
   * Inserts a new key into the priority queue. If the key already exists in
   * the queue this function returns `false`; otherwise it will return `true`.
   * Takes `O(n)` time.
   *
   * @param {Object} key the key to add
   * @param {Number} priority the initial priority for the key
   */
  add(t, n) {
    var r = this._keyIndices;
    if (t = String(t), !Object.hasOwn(r, t)) {
      var o = this._arr, i = o.length;
      return r[t] = i, o.push({ key: t, priority: n }), this._decrease(i), !0;
    }
    return !1;
  }
  /**
   * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
   */
  removeMin() {
    this._swap(0, this._arr.length - 1);
    var t = this._arr.pop();
    return delete this._keyIndices[t.key], this._heapify(0), t.key;
  }
  /**
   * Decreases the priority for **key** to **priority**. If the new priority is
   * greater than the previous priority, this function will throw an Error.
   *
   * @param {Object} key the key for which to raise priority
   * @param {Number} priority the new priority for the key
   */
  decrease(t, n) {
    var r = this._keyIndices[t];
    if (n > this._arr[r].priority)
      throw new Error("New priority is greater than current priority. Key: " + t + " Old: " + this._arr[r].priority + " New: " + n);
    this._arr[r].priority = n, this._decrease(r);
  }
  _heapify(t) {
    var n = this._arr, r = 2 * t, o = r + 1, i = t;
    r < n.length && (i = n[r].priority < n[i].priority ? r : i, o < n.length && (i = n[o].priority < n[i].priority ? o : i), i !== t && (this._swap(t, i), this._heapify(i)));
  }
  _decrease(t) {
    for (var n = this._arr, r = n[t].priority, o; t !== 0 && (o = t >> 1, !(n[o].priority < r)); )
      this._swap(t, o), t = o;
  }
  _swap(t, n) {
    var r = this._arr, o = this._keyIndices, i = r[t], s = r[n];
    r[t] = s, r[n] = i, o[s.key] = t, o[i.key] = n;
  }
};
var ll = mf, yf = ll, cl = bf, wf = () => 1;
function bf(e, t, n, r) {
  return vf(
    e,
    String(t),
    n || wf,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function vf(e, t, n, r) {
  var o = {}, i = new yf(), s, a, l = function(c) {
    var d = c.v !== s ? c.v : c.w, f = o[d], h = n(c), p = a.distance + h;
    if (h < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + h);
    p < f.distance && (f.distance = p, f.predecessor = s, i.decrease(d, p));
  };
  for (e.nodes().forEach(function(c) {
    var d = c === t ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: d }, i.add(c, d);
  }); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY); )
    r(s).forEach(l);
  return o;
}
var xf = cl, _f = kf;
function kf(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = xf(e, o, t, n), r;
  }, {});
}
var dl = Ef;
function Ef(e) {
  var t = 0, n = [], r = {}, o = [];
  function i(s) {
    var a = r[s] = {
      onStack: !0,
      lowlink: t,
      index: t++
    };
    if (n.push(s), e.successors(s).forEach(function(d) {
      Object.hasOwn(r, d) ? r[d].onStack && (a.lowlink = Math.min(a.lowlink, r[d].index)) : (i(d), a.lowlink = Math.min(a.lowlink, r[d].lowlink));
    }), a.lowlink === a.index) {
      var l = [], c;
      do
        c = n.pop(), r[c].onStack = !1, l.push(c);
      while (s !== c);
      o.push(l);
    }
  }
  return e.nodes().forEach(function(s) {
    Object.hasOwn(r, s) || i(s);
  }), o;
}
var Sf = dl, Nf = Cf;
function Cf(e) {
  return Sf(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var Mf = If, $f = () => 1;
function If(e, t, n) {
  return Af(
    e,
    t || $f,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function Af(e, t, n) {
  var r = {}, o = e.nodes();
  return o.forEach(function(i) {
    r[i] = {}, r[i][i] = { distance: 0 }, o.forEach(function(s) {
      i !== s && (r[i][s] = { distance: Number.POSITIVE_INFINITY });
    }), n(i).forEach(function(s) {
      var a = s.v === i ? s.w : s.v, l = t(s);
      r[i][a] = { distance: l, predecessor: i };
    });
  }), o.forEach(function(i) {
    var s = r[i];
    o.forEach(function(a) {
      var l = r[a];
      o.forEach(function(c) {
        var d = l[i], f = s[c], h = l[c], p = d.distance + f.distance;
        p < h.distance && (h.distance = p, h.predecessor = f.predecessor);
      });
    });
  }), r;
}
function ul(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new ii();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new ii();
  return r;
}
class ii extends Error {
  constructor() {
    super(...arguments);
  }
}
var fl = ul;
ul.CycleException = ii;
var ys = fl, Tf = Lf;
function Lf(e) {
  try {
    ys(e);
  } catch (t) {
    if (t instanceof ys.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var hl = zf;
function zf(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? Of : Pf, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function Of(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), pl(t(i[0]), (s) => o.push([s, !1])));
  }
}
function Pf(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), pl(t(i), (s) => o.push(s)));
  }
}
function pl(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var Df = hl, Rf = Hf;
function Hf(e, t) {
  return Df(e, t, "post");
}
var Wf = hl, Bf = Vf;
function Vf(e, t) {
  return Wf(e, t, "pre");
}
var Ff = Oi, jf = ll, Yf = Gf;
function Gf(e, t) {
  var n = new Ff(), r = {}, o = new jf(), i;
  function s(l) {
    var c = l.v === i ? l.w : l.v, d = o.priority(c);
    if (d !== void 0) {
      var f = t(l);
      f < d && (r[c] = i, o.decrease(c, f));
    }
  }
  if (e.nodeCount() === 0)
    return n;
  e.nodes().forEach(function(l) {
    o.add(l, Number.POSITIVE_INFINITY), n.setNode(l);
  }), o.decrease(e.nodes()[0], 0);
  for (var a = !1; o.size() > 0; ) {
    if (i = o.removeMin(), Object.hasOwn(r, i))
      n.setEdge(i, r[i]);
    else {
      if (a)
        throw new Error("Input graph is not connected: " + e);
      a = !0;
    }
    e.nodeEdges(i).forEach(s);
  }
  return n;
}
var Xf = {
  components: pf,
  dijkstra: cl,
  dijkstraAll: _f,
  findCycles: Nf,
  floydWarshall: Mf,
  isAcyclic: Tf,
  postorder: Rf,
  preorder: Bf,
  prim: Yf,
  tarjan: dl,
  topsort: fl
}, ws = af, Fe = {
  Graph: ws.Graph,
  json: cf,
  alg: Xf,
  version: ws.version
};
let Uf = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return bs(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && bs(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, qf)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function bs(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function qf(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var Kf = Uf;
let Zf = Fe.Graph, Qf = Kf;
var Jf = th;
let eh = () => 1;
function th(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = rh(e, t || eh);
  return nh(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function nh(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      Ho(e, t, n, s);
    for (; s = o.dequeue(); )
      Ho(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(Ho(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function Ho(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, si(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, si(t, n, c);
  }), e.removeNode(r.v), i;
}
function rh(e, t) {
  let n = new Zf(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = oh(o + r + 3).map(() => new Qf()), s = r + 1;
  return n.nodes().forEach((a) => {
    si(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function si(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function oh(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let gl = Fe.Graph;
var we = {
  addBorderNode: hh,
  addDummyNode: ml,
  applyWithChunking: Yr,
  asNonCompoundGraph: sh,
  buildLayerMatrix: dh,
  intersectRect: ch,
  mapValues: vh,
  maxRank: wl,
  normalizeRanks: uh,
  notime: yh,
  partition: gh,
  pick: bh,
  predecessorWeights: lh,
  range: vl,
  removeEmptyRanks: fh,
  simplify: ih,
  successorWeights: ah,
  time: mh,
  uniqueId: bl,
  zipObject: Pi
};
function ml(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = bl(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function ih(e) {
  let t = new gl().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function sh(e) {
  let t = new gl({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function ah(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return Pi(e.nodes(), t);
}
function lh(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return Pi(e.nodes(), t);
}
function ch(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function dh(e) {
  let t = vl(wl(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function uh(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Yr(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function fh(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Yr(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function hh(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), ml(e, "border", o, t);
}
function ph(e, t = yl) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const yl = 65535;
function Yr(e, t) {
  if (t.length > yl) {
    const n = ph(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function wl(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Yr(Math.max, n);
}
function gh(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function mh(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function yh(e, t) {
  return t();
}
let wh = 0;
function bl(e) {
  var t = ++wh;
  return e + ("" + t);
}
function vl(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function bh(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function vh(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function Pi(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let xh = Jf, _h = we.uniqueId;
var kh = {
  run: Eh,
  undo: Nh
};
function Eh(e) {
  (e.graph().acyclicer === "greedy" ? xh(e, n(e)) : Sh(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, _h("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function Sh(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function Nh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let Ch = we;
var Mh = {
  run: $h,
  undo: Ah
};
function $h(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => Ih(e, t));
}
function Ih(e, t) {
  let n = t.v, r = e.node(n).rank, o = t.w, i = e.node(o).rank, s = t.name, a = e.edge(t), l = a.labelRank;
  if (i === r + 1) return;
  e.removeEdge(t);
  let c, d, f;
  for (f = 0, ++r; r < i; ++f, ++r)
    a.points = [], d = {
      width: 0,
      height: 0,
      edgeLabel: a,
      edgeObj: t,
      rank: r
    }, c = Ch.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function Ah(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: Th } = we;
var Gr = {
  longestPath: Lh,
  slack: zh
};
function Lh(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = Th(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function zh(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Oh = Fe.Graph, Cr = Gr.slack, xl = Ph;
function Ph(e) {
  var t = new Oh({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; Dh(t, e) < r; )
    o = Rh(t, e), i = t.hasNode(o.v) ? Cr(e, o) : -Cr(e, o), Hh(t, e, i);
  return t;
}
function Dh(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !Cr(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Rh(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = Cr(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Hh(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Wh = xl, vs = Gr.slack, Bh = Gr.longestPath, Vh = Fe.alg.preorder, Fh = Fe.alg.postorder, jh = we.simplify, Yh = Lt;
Lt.initLowLimValues = Ri;
Lt.initCutValues = Di;
Lt.calcCutValue = _l;
Lt.leaveEdge = El;
Lt.enterEdge = Sl;
Lt.exchangeEdges = Nl;
function Lt(e) {
  e = jh(e), Bh(e);
  var t = Wh(e);
  Ri(t), Di(t, e);
  for (var n, r; n = El(t); )
    r = Sl(t, e, n), Nl(t, e, n, r);
}
function Di(e, t) {
  var n = Fh(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => Gh(e, t, r));
}
function Gh(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = _l(e, t, n);
}
function _l(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var f = c === i, h = t.edge(l).weight;
      if (a += f ? h : -h, Uh(e, n, d)) {
        var p = e.edge(n, d).cutvalue;
        a += f ? -p : p;
      }
    }
  }), a;
}
function Ri(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), kl(e, {}, 1, t);
}
function kl(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = kl(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function El(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function Sl(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === xs(e, e.node(d.v), a) && l !== xs(e, e.node(d.w), a));
  return c.reduce((d, f) => vs(t, f) < vs(t, d) ? f : d);
}
function Nl(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), Ri(e), Di(e, t), Xh(e, t);
}
function Xh(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = Vh(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function Uh(e, t, n) {
  return e.hasEdge(t, n);
}
function xs(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var qh = Gr, Cl = qh.longestPath, Kh = xl, Zh = Yh, Qh = Jh;
function Jh(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      _s(e);
      break;
    case "tight-tree":
      tp(e);
      break;
    case "longest-path":
      ep(e);
      break;
    case "none":
      break;
    default:
      _s(e);
  }
}
var ep = Cl;
function tp(e) {
  Cl(e), Kh(e);
}
function _s(e) {
  Zh(e);
}
var np = rp;
function rp(e) {
  let t = ip(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = op(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
    for (; n !== o.w; ) {
      if (r = e.node(n), d) {
        for (; (c = s[l]) !== a && e.node(c).maxRank < r.rank; )
          l++;
        c === a && (d = !1);
      }
      if (!d) {
        for (; l < s.length - 1 && e.node(c = s[l + 1]).minRank <= r.rank; )
          l++;
        c = s[l];
      }
      e.setParent(n, c), n = e.successors(n)[0];
    }
  });
}
function op(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function ip(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let Mr = we;
var sp = {
  run: ap,
  cleanup: dp
};
function ap(e) {
  let t = Mr.addDummyNode(e, "root", {}, "_root"), n = lp(e), r = Object.values(n), o = Mr.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = cp(e) + 1;
  e.children().forEach((a) => Ml(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function Ml(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = Mr.addBorderNode(e, "_bt"), c = Mr.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((f) => {
    Ml(e, t, n, r, o, i, f);
    let h = e.node(f), p = h.borderTop ? h.borderTop : f, g = h.borderBottom ? h.borderBottom : f, v = h.borderTop ? r : 2 * r, b = p !== g ? 1 : o - i[s] + 1;
    e.setEdge(l, p, {
      weight: v,
      minlen: b,
      nestingEdge: !0
    }), e.setEdge(g, c, {
      weight: v,
      minlen: b,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function lp(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function cp(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function dp(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let up = we;
var fp = hp;
function hp(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        ks(e, "borderLeft", "_bl", n, o, i), ks(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function ks(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = up.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var pp = {
  adjust: gp,
  undo: mp
};
function gp(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && $l(e);
}
function mp(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && yp(e), (t === "lr" || t === "rl") && (wp(e), $l(e));
}
function $l(e) {
  e.nodes().forEach((t) => Es(e.node(t))), e.edges().forEach((t) => Es(e.edge(t)));
}
function Es(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function yp(e) {
  e.nodes().forEach((t) => Wo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Wo), Object.hasOwn(n, "y") && Wo(n);
  });
}
function Wo(e) {
  e.y = -e.y;
}
function wp(e) {
  e.nodes().forEach((t) => Bo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Bo), Object.hasOwn(n, "x") && Bo(n);
  });
}
function Bo(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let Ss = we;
var bp = vp;
function vp(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = Ss.applyWithChunking(Math.max, r), i = Ss.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let xp = we.zipObject;
var _p = kp;
function kp(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += Ep(e, t[r - 1], t[r]);
  return n;
}
function Ep(e, t, n) {
  let r = xp(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, f) => d.pos - f.pos)), i = 1;
  for (; i < n.length; ) i <<= 1;
  let s = 2 * i - 1;
  i -= 1;
  let a = new Array(s).fill(0), l = 0;
  return o.forEach((c) => {
    let d = c.pos + i;
    a[d] += c.weight;
    let f = 0;
    for (; d > 0; )
      d % 2 && (f += a[d + 1]), d = d - 1 >> 1, a[d] += c.weight;
    l += c.weight * f;
  }), l;
}
var Sp = Np;
function Np(e, t = []) {
  return t.map((n) => {
    let r = e.inEdges(n);
    if (r.length) {
      let o = r.reduce((i, s) => {
        let a = e.edge(s), l = e.node(s.v);
        return {
          sum: i.sum + a.weight * l.order,
          weight: i.weight + a.weight
        };
      }, { sum: 0, weight: 0 });
      return {
        v: n,
        barycenter: o.sum / o.weight,
        weight: o.weight
      };
    } else
      return { v: n };
  });
}
let Cp = we;
var Mp = $p;
function $p(e, t) {
  let n = {};
  e.forEach((o, i) => {
    let s = n[o.v] = {
      indegree: 0,
      in: [],
      out: [],
      vs: [o.v],
      i
    };
    o.barycenter !== void 0 && (s.barycenter = o.barycenter, s.weight = o.weight);
  }), t.edges().forEach((o) => {
    let i = n[o.v], s = n[o.w];
    i !== void 0 && s !== void 0 && (s.indegree++, i.out.push(n[o.w]));
  });
  let r = Object.values(n).filter((o) => !o.indegree);
  return Ip(r);
}
function Ip(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Ap(o, i);
    };
  }
  function r(o) {
    return (i) => {
      i.in.push(o), --i.indegree === 0 && e.push(i);
    };
  }
  for (; e.length; ) {
    let o = e.pop();
    t.push(o), o.in.reverse().forEach(n(o)), o.out.forEach(r(o));
  }
  return t.filter((o) => !o.merged).map((o) => Cp.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function Ap(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let Tp = we;
var Lp = zp;
function zp(e, t) {
  let n = Tp.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, f) => f.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(Op(!!t)), l = Ns(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = Ns(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function Ns(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function Op(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Pp = Sp, Dp = Mp, Rp = Lp;
var Hp = Il;
function Il(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((h) => h !== s && h !== a));
  let c = Pp(e, o);
  c.forEach((h) => {
    if (e.children(h.v).length) {
      let p = Il(e, h.v, n, r);
      l[h.v] = p, Object.hasOwn(p, "barycenter") && Bp(h, p);
    }
  });
  let d = Dp(c, n);
  Wp(d, l);
  let f = Rp(d, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let h = e.node(e.predecessors(s)[0]), p = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + h.order + p.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function Wp(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function Bp(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let Vp = Fe.Graph, Fp = we;
var jp = Yp;
function Yp(e, t, n, r) {
  r || (r = e.nodes());
  let o = Gp(e), i = new Vp({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
  return r.forEach((s) => {
    let a = e.node(s), l = e.parent(s);
    (a.rank === t || a.minRank <= t && t <= a.maxRank) && (i.setNode(s), i.setParent(s, l || o), e[n](s).forEach((c) => {
      let d = c.v === s ? c.w : c.v, f = i.edge(d, s), h = f !== void 0 ? f.weight : 0;
      i.setEdge(d, s, { weight: e.edge(c).weight + h });
    }), Object.hasOwn(a, "minRank") && i.setNode(s, {
      borderLeft: a.borderLeft[t],
      borderRight: a.borderRight[t]
    }));
  }), i;
}
function Gp(e) {
  for (var t; e.hasNode(t = Fp.uniqueId("_root")); ) ;
  return t;
}
var Xp = Up;
function Up(e, t, n) {
  let r = {}, o;
  n.forEach((i) => {
    let s = e.parent(i), a, l;
    for (; s; ) {
      if (a = e.parent(s), a ? (l = r[a], r[a] = s) : (l = o, o = s), l && l !== s) {
        t.setEdge(l, s);
        return;
      }
      s = a;
    }
  });
}
let qp = bp, Kp = _p, Zp = Hp, Qp = jp, Jp = Xp, eg = Fe.Graph, ir = we;
var tg = Al;
function Al(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, Al);
    return;
  }
  let n = ir.maxRank(e), r = Cs(e, ir.range(1, n + 1), "inEdges"), o = Cs(e, ir.range(n - 1, -1, -1), "outEdges"), i = qp(e);
  if (Ms(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    ng(l % 2 ? r : o, l % 4 >= 2), i = ir.buildLayerMatrix(e);
    let d = Kp(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  Ms(e, a);
}
function Cs(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (i, s) => {
    r.has(i) || r.set(i, []), r.get(i).push(s);
  };
  for (const i of e.nodes()) {
    const s = e.node(i);
    if (typeof s.rank == "number" && o(s.rank, i), typeof s.minRank == "number" && typeof s.maxRank == "number")
      for (let a = s.minRank; a <= s.maxRank; a++)
        a !== s.rank && o(a, i);
  }
  return t.map(function(i) {
    return Qp(e, i, n, r.get(i) || []);
  });
}
function ng(e, t) {
  let n = new eg();
  e.forEach(function(r) {
    let o = r.graph().root, i = Zp(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), Jp(r, n, i.vs);
  });
}
function Ms(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let rg = Fe.Graph, ot = we;
var og = {
  positionX: gg
};
function ig(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, f) => {
      let h = ag(e, d), p = h ? e.node(h).order : l;
      (h || d === c) && (i.slice(a, f + 1).forEach((g) => {
        e.predecessors(g).forEach((v) => {
          let b = e.node(v), m = b.order;
          (m < s || p < m) && !(b.dummy && e.node(g).dummy) && Tl(n, v, g);
        });
      }), a = f + 1, s = p);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function sg(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    ot.range(s, a).forEach((f) => {
      d = i[f], e.node(d).dummy && e.predecessors(d).forEach((h) => {
        let p = e.node(h);
        p.dummy && (p.order < l || p.order > c) && Tl(n, h, d);
      });
    });
  }
  function o(i, s) {
    let a = -1, l, c = 0;
    return s.forEach((d, f) => {
      if (e.node(d).dummy === "border") {
        let h = e.predecessors(d);
        h.length && (l = e.node(h[0]).order, r(s, c, f, a, l), c = f, a = l);
      }
      r(s, c, s.length, l, i.length);
    }), s;
  }
  return t.length && t.reduce(o), n;
}
function ag(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function Tl(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function lg(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function cg(e, t, n, r) {
  let o = {}, i = {}, s = {};
  return t.forEach((a) => {
    a.forEach((l, c) => {
      o[l] = l, i[l] = l, s[l] = c;
    });
  }), t.forEach((a) => {
    let l = -1;
    a.forEach((c) => {
      let d = r(c);
      if (d.length) {
        d = d.sort((h, p) => s[h] - s[p]);
        let f = (d.length - 1) / 2;
        for (let h = Math.floor(f), p = Math.ceil(f); h <= p; ++h) {
          let g = d[h];
          i[c] === c && l < s[g] && !lg(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function dg(e, t, n, r, o) {
  let i = {}, s = ug(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, h) {
    let p = s.nodes(), g = p.pop(), v = {};
    for (; g; )
      v[g] ? f(g) : (v[g] = !0, p.push(g), p = p.concat(h(g))), g = p.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((h, p) => Math.max(h, i[p.v] + s.edge(p)), 0);
  }
  function d(f) {
    let h = s.outEdges(f).reduce((g, v) => Math.min(g, i[v.w] - s.edge(v)), Number.POSITIVE_INFINITY), p = e.node(f);
    h !== Number.POSITIVE_INFINITY && p.borderType !== a && (i[f] = Math.max(i[f], h));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function ug(e, t, n, r) {
  let o = new rg(), i = e.graph(), s = mg(i.nodesep, i.edgesep, r);
  return t.forEach((a) => {
    let l;
    a.forEach((c) => {
      let d = n[c];
      if (o.setNode(d), l) {
        var f = n[l], h = o.edge(f, d);
        o.setEdge(f, d, Math.max(s(e, c, l), h || 0));
      }
      l = c;
    });
  }), o;
}
function fg(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = yg(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function hg(e, t) {
  let n = Object.values(t), r = ot.applyWithChunking(Math.min, n), o = ot.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), d = r - ot.applyWithChunking(Math.min, c);
      s !== "l" && (d = o - ot.applyWithChunking(Math.max, c)), d && (e[a] = ot.mapValues(l, (f) => f + d));
    });
  });
}
function pg(e, t) {
  return ot.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function gg(e) {
  let t = ot.buildLayerMatrix(e), n = Object.assign(
    ig(e, t),
    sg(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = cg(e, o, n, l), d = dg(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = ot.mapValues(d, (f) => -f)), r[s + a] = d;
    });
  });
  let i = fg(e, r);
  return hg(r, i), pg(r, e.graph().align);
}
function mg(e, t, n) {
  return (r, o, i) => {
    let s = r.node(o), a = r.node(i), l = 0, c;
    if (l += s.width / 2, Object.hasOwn(s, "labelpos"))
      switch (s.labelpos.toLowerCase()) {
        case "l":
          c = -s.width / 2;
          break;
        case "r":
          c = s.width / 2;
          break;
      }
    if (c && (l += n ? c : -c), c = 0, l += (s.dummy ? t : e) / 2, l += (a.dummy ? t : e) / 2, l += a.width / 2, Object.hasOwn(a, "labelpos"))
      switch (a.labelpos.toLowerCase()) {
        case "l":
          c = a.width / 2;
          break;
        case "r":
          c = -a.width / 2;
          break;
      }
    return c && (l += n ? c : -c), c = 0, l;
  };
}
function yg(e, t) {
  return e.node(t).width;
}
let Ll = we, wg = og.positionX;
var bg = vg;
function vg(e) {
  e = Ll.asNonCompoundGraph(e), xg(e), Object.entries(wg(e)).forEach(([t, n]) => e.node(t).x = n);
}
function xg(e) {
  let t = Ll.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let $s = kh, Is = Mh, _g = Qh, kg = we.normalizeRanks, Eg = np, Sg = we.removeEmptyRanks, As = sp, Ng = fp, Ts = pp, Cg = tg, Mg = bg, Le = we, $g = Fe.Graph;
var Ig = Ag;
function Ag(e, t) {
  let n = t && t.debugTiming ? Le.time : Le.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => Bg(e));
    n("  runLayout", () => Tg(r, n, t)), n("  updateInputGraph", () => Lg(e, r));
  });
}
function Tg(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => Vg(e)), t("    removeSelfEdges", () => Zg(e)), t("    acyclic", () => $s.run(e)), t("    nestingGraph.run", () => As.run(e)), t("    rank", () => _g(Le.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Fg(e)), t("    removeEmptyRanks", () => Sg(e)), t("    nestingGraph.cleanup", () => As.cleanup(e)), t("    normalizeRanks", () => kg(e)), t("    assignRankMinMax", () => jg(e)), t("    removeEdgeLabelProxies", () => Yg(e)), t("    normalize.run", () => Is.run(e)), t("    parentDummyChains", () => Eg(e)), t("    addBorderSegments", () => Ng(e)), t("    order", () => Cg(e, n)), t("    insertSelfEdges", () => Qg(e)), t("    adjustCoordinateSystem", () => Ts.adjust(e)), t("    position", () => Mg(e)), t("    positionSelfEdges", () => Jg(e)), t("    removeBorderNodes", () => Kg(e)), t("    normalize.undo", () => Is.undo(e)), t("    fixupEdgeLabelCoords", () => Ug(e)), t("    undoCoordinateSystem", () => Ts.undo(e)), t("    translateGraph", () => Gg(e)), t("    assignNodeIntersects", () => Xg(e)), t("    reversePoints", () => qg(e)), t("    acyclic.undo", () => $s.undo(e));
}
function Lg(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let zg = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], Og = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Pg = ["acyclicer", "ranker", "rankdir", "align"], Dg = ["width", "height", "rank"], Ls = { width: 0, height: 0 }, Rg = ["minlen", "weight", "width", "height", "labeloffset"], Hg = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Wg = ["labelpos"];
function Bg(e) {
  let t = new $g({ multigraph: !0, compound: !0 }), n = Fo(e.graph());
  return t.setGraph(Object.assign(
    {},
    Og,
    Vo(n, zg),
    Le.pick(n, Pg)
  )), e.nodes().forEach((r) => {
    let o = Fo(e.node(r));
    const i = Vo(o, Dg);
    Object.keys(Ls).forEach((s) => {
      i[s] === void 0 && (i[s] = Ls[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = Fo(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Hg,
      Vo(o, Rg),
      Le.pick(o, Wg)
    ));
  }), t;
}
function Vg(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Fg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      Le.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function jg(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function Yg(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Gg(e) {
  let t = Number.POSITIVE_INFINITY, n = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function l(c) {
    let d = c.x, f = c.y, h = c.width, p = c.height;
    t = Math.min(t, d - h / 2), n = Math.max(n, d + h / 2), r = Math.min(r, f - p / 2), o = Math.max(o, f + p / 2);
  }
  e.nodes().forEach((c) => l(e.node(c))), e.edges().forEach((c) => {
    let d = e.edge(c);
    Object.hasOwn(d, "x") && l(d);
  }), t -= s, r -= a, e.nodes().forEach((c) => {
    let d = e.node(c);
    d.x -= t, d.y -= r;
  }), e.edges().forEach((c) => {
    let d = e.edge(c);
    d.points.forEach((f) => {
      f.x -= t, f.y -= r;
    }), Object.hasOwn(d, "x") && (d.x -= t), Object.hasOwn(d, "y") && (d.y -= r);
  }), i.width = n - t + s, i.height = o - r + a;
}
function Xg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(Le.intersectRect(r, i)), n.points.push(Le.intersectRect(o, s));
  });
}
function Ug(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (Object.hasOwn(n, "x"))
      switch ((n.labelpos === "l" || n.labelpos === "r") && (n.width -= n.labeloffset), n.labelpos) {
        case "l":
          n.x -= n.width / 2 + n.labeloffset;
          break;
        case "r":
          n.x += n.width / 2 + n.labeloffset;
          break;
      }
  });
}
function qg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function Kg(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Zg(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function Qg(e) {
  var t = Le.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        Le.addDummyNode(e, "selfedge", {
          width: a.label.width,
          height: a.label.height,
          rank: s.rank,
          order: i + ++r,
          e: a.e,
          label: a.label
        }, "_se");
      }), delete s.selfEdges;
    });
  });
}
function Jg(e) {
  e.nodes().forEach((t) => {
    var n = e.node(t);
    if (n.dummy === "selfedge") {
      var r = e.node(n.e.v), o = r.x + r.width / 2, i = r.y, s = n.x - o, a = r.height / 2;
      e.setEdge(n.e, n.label), e.removeNode(t), n.label.points = [
        { x: o + 2 * s / 3, y: i - a },
        { x: o + 5 * s / 6, y: i - a },
        { x: o + s, y: i },
        { x: o + 5 * s / 6, y: i + a },
        { x: o + 2 * s / 3, y: i + a }
      ], n.label.x = n.x, n.label.y = n.y;
    }
  });
}
function Vo(e, t) {
  return Le.mapValues(Le.pick(e, t), Number);
}
function Fo(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let em = we, tm = Fe.Graph;
var nm = {
  debugOrdering: rm
};
function rm(e) {
  let t = em.buildLayerMatrix(e), n = new tm({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var om = "1.1.8", im = {
  graphlib: Fe,
  layout: Ig,
  debug: nm,
  util: {
    time: we.time,
    notime: we.notime
  },
  version: om
};
const $r = /* @__PURE__ */ al(im);
function be(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = be(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var sm = { value: () => {
} };
function Xr() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new br(n);
}
function br(e) {
  this._ = e;
}
function am(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
br.prototype = Xr.prototype = {
  constructor: br,
  on: function(e, t) {
    var n = this._, r = am(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = lm(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = zs(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = zs(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new br(e);
  },
  call: function(e, t) {
    if ((o = arguments.length - 2) > 0) for (var n = new Array(o), r = 0, o, i; r < o; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (i = this._[e], r = 0, o = i.length; r < o; ++r) i[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], o = 0, i = r.length; o < i; ++o) r[o].value.apply(t, n);
  }
};
function lm(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function zs(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = sm, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ai = "http://www.w3.org/1999/xhtml";
const Os = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ai,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Ur(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Os.hasOwnProperty(t) ? { space: Os[t], local: e } : e;
}
function cm(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ai && t.documentElement.namespaceURI === ai ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function dm(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function zl(e) {
  var t = Ur(e);
  return (t.local ? dm : cm)(t);
}
function um() {
}
function Hi(e) {
  return e == null ? um : function() {
    return this.querySelector(e);
  };
}
function fm(e) {
  typeof e != "function" && (e = Hi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Ie(r, this._parents);
}
function hm(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function pm() {
  return [];
}
function Ol(e) {
  return e == null ? pm : function() {
    return this.querySelectorAll(e);
  };
}
function gm(e) {
  return function() {
    return hm(e.apply(this, arguments));
  };
}
function mm(e) {
  typeof e == "function" ? e = gm(e) : e = Ol(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new Ie(r, o);
}
function Pl(e) {
  return function() {
    return this.matches(e);
  };
}
function Dl(e) {
  return function(t) {
    return t.matches(e);
  };
}
var ym = Array.prototype.find;
function wm(e) {
  return function() {
    return ym.call(this.children, e);
  };
}
function bm() {
  return this.firstElementChild;
}
function vm(e) {
  return this.select(e == null ? bm : wm(typeof e == "function" ? e : Dl(e)));
}
var xm = Array.prototype.filter;
function _m() {
  return Array.from(this.children);
}
function km(e) {
  return function() {
    return xm.call(this.children, e);
  };
}
function Em(e) {
  return this.selectAll(e == null ? _m : km(typeof e == "function" ? e : Dl(e)));
}
function Sm(e) {
  typeof e != "function" && (e = Pl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ie(r, this._parents);
}
function Rl(e) {
  return new Array(e.length);
}
function Nm() {
  return new Ie(this._enter || this._groups.map(Rl), this._parents);
}
function Ir(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Ir.prototype = {
  constructor: Ir,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Cm(e) {
  return function() {
    return e;
  };
}
function Mm(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new Ir(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function $m(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, f = i.length, h = new Array(d), p;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (h[a] = p = s.call(l, l.__data__, a, t) + "", c.has(p) ? o[a] = l : c.set(p, l));
  for (a = 0; a < f; ++a)
    p = s.call(e, i[a], a, i) + "", (l = c.get(p)) ? (r[a] = l, l.__data__ = i[a], c.delete(p)) : n[a] = new Ir(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(h[a]) === l && (o[a] = l);
}
function Im(e) {
  return e.__data__;
}
function Am(e, t) {
  if (!arguments.length) return Array.from(this, Im);
  var n = t ? $m : Mm, r = this._parents, o = this._groups;
  typeof e != "function" && (e = Cm(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], f = o[c], h = f.length, p = Tm(e.call(d, d && d.__data__, c, r)), g = p.length, v = a[c] = new Array(g), b = s[c] = new Array(g), m = l[c] = new Array(h);
    n(d, f, v, b, m, p, t);
    for (var _ = 0, y = 0, w, N; _ < g; ++_)
      if (w = v[_]) {
        for (_ >= y && (y = _ + 1); !(N = b[y]) && ++y < g; ) ;
        w._next = N || null;
      }
  }
  return s = new Ie(s, r), s._enter = a, s._exit = l, s;
}
function Tm(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Lm() {
  return new Ie(this._exit || this._groups.map(Rl), this._parents);
}
function zm(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function Om(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], f = c.length, h = a[l] = new Array(f), p, g = 0; g < f; ++g)
      (p = c[g] || d[g]) && (h[g] = p);
  for (; l < o; ++l)
    a[l] = n[l];
  return new Ie(a, this._parents);
}
function Pm() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function Dm(e) {
  e || (e = Rm);
  function t(f, h) {
    return f && h ? e(f.__data__, h.__data__) : !f - !h;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(t);
  }
  return new Ie(o, this._parents).order();
}
function Rm(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Hm() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Wm() {
  return Array.from(this);
}
function Bm() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function Vm() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Fm() {
  return !this.node();
}
function jm(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function Ym(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Gm(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Xm(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Um(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function qm(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Km(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Zm(e, t) {
  var n = Ur(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Gm : Ym : typeof t == "function" ? n.local ? Km : qm : n.local ? Um : Xm)(n, t));
}
function Hl(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Qm(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Jm(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function ey(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function ty(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Qm : typeof t == "function" ? ey : Jm)(e, t, n ?? "")) : Yt(this.node(), e);
}
function Yt(e, t) {
  return e.style.getPropertyValue(t) || Hl(e).getComputedStyle(e, null).getPropertyValue(t);
}
function ny(e) {
  return function() {
    delete this[e];
  };
}
function ry(e, t) {
  return function() {
    this[e] = t;
  };
}
function oy(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function iy(e, t) {
  return arguments.length > 1 ? this.each((t == null ? ny : typeof t == "function" ? oy : ry)(e, t)) : this.node()[e];
}
function Wl(e) {
  return e.trim().split(/^|\s+/);
}
function Wi(e) {
  return e.classList || new Bl(e);
}
function Bl(e) {
  this._node = e, this._names = Wl(e.getAttribute("class") || "");
}
Bl.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Vl(e, t) {
  for (var n = Wi(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function Fl(e, t) {
  for (var n = Wi(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function sy(e) {
  return function() {
    Vl(this, e);
  };
}
function ay(e) {
  return function() {
    Fl(this, e);
  };
}
function ly(e, t) {
  return function() {
    (t.apply(this, arguments) ? Vl : Fl)(this, e);
  };
}
function cy(e, t) {
  var n = Wl(e + "");
  if (arguments.length < 2) {
    for (var r = Wi(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? ly : t ? sy : ay)(n, t));
}
function dy() {
  this.textContent = "";
}
function uy(e) {
  return function() {
    this.textContent = e;
  };
}
function fy(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function hy(e) {
  return arguments.length ? this.each(e == null ? dy : (typeof e == "function" ? fy : uy)(e)) : this.node().textContent;
}
function py() {
  this.innerHTML = "";
}
function gy(e) {
  return function() {
    this.innerHTML = e;
  };
}
function my(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function yy(e) {
  return arguments.length ? this.each(e == null ? py : (typeof e == "function" ? my : gy)(e)) : this.node().innerHTML;
}
function wy() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function by() {
  return this.each(wy);
}
function vy() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function xy() {
  return this.each(vy);
}
function _y(e) {
  var t = typeof e == "function" ? e : zl(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function ky() {
  return null;
}
function Ey(e, t) {
  var n = typeof e == "function" ? e : zl(e), r = t == null ? ky : typeof t == "function" ? t : Hi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Sy() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Ny() {
  return this.each(Sy);
}
function Cy() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function My() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function $y(e) {
  return this.select(e ? My : Cy);
}
function Iy(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Ay(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Ty(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function Ly(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function zy(e, t, n) {
  return function() {
    var r = this.__on, o, i = Ay(t);
    if (r) {
      for (var s = 0, a = r.length; s < a; ++s)
        if ((o = r[s]).type === e.type && o.name === e.name) {
          this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, o.listener = i, o.options = n), o.value = t;
          return;
        }
    }
    this.addEventListener(e.type, i, n), o = { type: e.type, name: e.name, value: t, listener: i, options: n }, r ? r.push(o) : this.__on = [o];
  };
}
function Oy(e, t, n) {
  var r = Ty(e + ""), o, i = r.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, d; l < c; ++l)
        for (o = 0, d = a[l]; o < i; ++o)
          if ((s = r[o]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (a = t ? zy : Ly, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function jl(e, t, n) {
  var r = Hl(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Py(e, t) {
  return function() {
    return jl(this, e, t);
  };
}
function Dy(e, t) {
  return function() {
    return jl(this, e, t.apply(this, arguments));
  };
}
function Ry(e, t) {
  return this.each((typeof t == "function" ? Dy : Py)(e, t));
}
function* Hy() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Yl = [null];
function Ie(e, t) {
  this._groups = e, this._parents = t;
}
function Dn() {
  return new Ie([[document.documentElement]], Yl);
}
function Wy() {
  return this;
}
Ie.prototype = Dn.prototype = {
  constructor: Ie,
  select: fm,
  selectAll: mm,
  selectChild: vm,
  selectChildren: Em,
  filter: Sm,
  data: Am,
  enter: Nm,
  exit: Lm,
  join: zm,
  merge: Om,
  selection: Wy,
  order: Pm,
  sort: Dm,
  call: Hm,
  nodes: Wm,
  node: Bm,
  size: Vm,
  empty: Fm,
  each: jm,
  attr: Zm,
  style: ty,
  property: iy,
  classed: cy,
  text: hy,
  html: yy,
  raise: by,
  lower: xy,
  append: _y,
  insert: Ey,
  remove: Ny,
  clone: $y,
  datum: Iy,
  on: Oy,
  dispatch: Ry,
  [Symbol.iterator]: Hy
};
function Ce(e) {
  return typeof e == "string" ? new Ie([[document.querySelector(e)]], [document.documentElement]) : new Ie([[e]], Yl);
}
function By(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Re(e, t) {
  if (e = By(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
    }
    if (t.getBoundingClientRect) {
      var o = t.getBoundingClientRect();
      return [e.clientX - o.left - t.clientLeft, e.clientY - o.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const Vy = { passive: !1 }, Nn = { capture: !0, passive: !1 };
function jo(e) {
  e.stopImmediatePropagation();
}
function Ft(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Gl(e) {
  var t = e.document.documentElement, n = Ce(e).on("dragstart.drag", Ft, Nn);
  "onselectstart" in t ? n.on("selectstart.drag", Ft, Nn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Xl(e, t) {
  var n = e.document.documentElement, r = Ce(e).on("dragstart.drag", null);
  t && (r.on("click.drag", Ft, Nn), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const sr = (e) => () => e;
function li(e, {
  sourceEvent: t,
  subject: n,
  target: r,
  identifier: o,
  active: i,
  x: s,
  y: a,
  dx: l,
  dy: c,
  dispatch: d
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: o, enumerable: !0, configurable: !0 },
    active: { value: i, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
li.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Fy(e) {
  return !e.ctrlKey && !e.button;
}
function jy() {
  return this.parentNode;
}
function Yy(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Gy() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ul() {
  var e = Fy, t = jy, n = Yy, r = Gy, o = {}, i = Xr("start", "drag", "end"), s = 0, a, l, c, d, f = 0;
  function h(w) {
    w.on("mousedown.drag", p).filter(r).on("touchstart.drag", b).on("touchmove.drag", m, Vy).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(w, N) {
    if (!(d || !e.call(this, w, N))) {
      var E = y(this, t.call(this, w, N), w, N, "mouse");
      E && (Ce(w.view).on("mousemove.drag", g, Nn).on("mouseup.drag", v, Nn), Gl(w.view), jo(w), c = !1, a = w.clientX, l = w.clientY, E("start", w));
    }
  }
  function g(w) {
    if (Ft(w), !c) {
      var N = w.clientX - a, E = w.clientY - l;
      c = N * N + E * E > f;
    }
    o.mouse("drag", w);
  }
  function v(w) {
    Ce(w.view).on("mousemove.drag mouseup.drag", null), Xl(w.view, c), Ft(w), o.mouse("end", w);
  }
  function b(w, N) {
    if (e.call(this, w, N)) {
      var E = w.changedTouches, C = t.call(this, w, N), T = E.length, A, O;
      for (A = 0; A < T; ++A)
        (O = y(this, C, w, N, E[A].identifier, E[A])) && (jo(w), O("start", w, E[A]));
    }
  }
  function m(w) {
    var N = w.changedTouches, E = N.length, C, T;
    for (C = 0; C < E; ++C)
      (T = o[N[C].identifier]) && (Ft(w), T("drag", w, N[C]));
  }
  function _(w) {
    var N = w.changedTouches, E = N.length, C, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), C = 0; C < E; ++C)
      (T = o[N[C].identifier]) && (jo(w), T("end", w, N[C]));
  }
  function y(w, N, E, C, T, A) {
    var O = i.copy(), L = Re(A || E, N), B, H, x;
    if ((x = n.call(w, new li("beforestart", {
      sourceEvent: E,
      target: h,
      identifier: T,
      active: s,
      x: L[0],
      y: L[1],
      dx: 0,
      dy: 0,
      dispatch: O
    }), C)) != null)
      return B = x.x - L[0] || 0, H = x.y - L[1] || 0, function $(M, S, z) {
        var I = L, D;
        switch (M) {
          case "start":
            o[T] = $, D = s++;
            break;
          case "end":
            delete o[T], --s;
          case "drag":
            L = Re(z || S, N), D = s;
            break;
        }
        O.call(
          M,
          w,
          new li(M, {
            sourceEvent: S,
            subject: x,
            target: h,
            identifier: T,
            active: D,
            x: L[0] + B,
            y: L[1] + H,
            dx: L[0] - I[0],
            dy: L[1] - I[1],
            dispatch: O
          }),
          C
        );
      };
  }
  return h.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : sr(!!w), h) : e;
  }, h.container = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : sr(w), h) : t;
  }, h.subject = function(w) {
    return arguments.length ? (n = typeof w == "function" ? w : sr(w), h) : n;
  }, h.touchable = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : sr(!!w), h) : r;
  }, h.on = function() {
    var w = i.on.apply(i, arguments);
    return w === i ? h : w;
  }, h.clickDistance = function(w) {
    return arguments.length ? (f = (w = +w) * w, h) : Math.sqrt(f);
  }, h;
}
function Bi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ql(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Rn() {
}
var Cn = 0.7, Ar = 1 / Cn, jt = "\\s*([+-]?\\d+)\\s*", Mn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ze = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Xy = /^#([0-9a-f]{3,8})$/, Uy = new RegExp(`^rgb\\(${jt},${jt},${jt}\\)$`), qy = new RegExp(`^rgb\\(${Ze},${Ze},${Ze}\\)$`), Ky = new RegExp(`^rgba\\(${jt},${jt},${jt},${Mn}\\)$`), Zy = new RegExp(`^rgba\\(${Ze},${Ze},${Ze},${Mn}\\)$`), Qy = new RegExp(`^hsl\\(${Mn},${Ze},${Ze}\\)$`), Jy = new RegExp(`^hsla\\(${Mn},${Ze},${Ze},${Mn}\\)$`), Ps = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Bi(Rn, Nt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ds,
  // Deprecated! Use color.formatHex.
  formatHex: Ds,
  formatHex8: e0,
  formatHsl: t0,
  formatRgb: Rs,
  toString: Rs
});
function Ds() {
  return this.rgb().formatHex();
}
function e0() {
  return this.rgb().formatHex8();
}
function t0() {
  return Kl(this).formatHsl();
}
function Rs() {
  return this.rgb().formatRgb();
}
function Nt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Xy.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Hs(t) : n === 3 ? new Ee(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? ar(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? ar(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Uy.exec(e)) ? new Ee(t[1], t[2], t[3], 1) : (t = qy.exec(e)) ? new Ee(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Ky.exec(e)) ? ar(t[1], t[2], t[3], t[4]) : (t = Zy.exec(e)) ? ar(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Qy.exec(e)) ? Vs(t[1], t[2] / 100, t[3] / 100, 1) : (t = Jy.exec(e)) ? Vs(t[1], t[2] / 100, t[3] / 100, t[4]) : Ps.hasOwnProperty(e) ? Hs(Ps[e]) : e === "transparent" ? new Ee(NaN, NaN, NaN, 0) : null;
}
function Hs(e) {
  return new Ee(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function ar(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ee(e, t, n, r);
}
function n0(e) {
  return e instanceof Rn || (e = Nt(e)), e ? (e = e.rgb(), new Ee(e.r, e.g, e.b, e.opacity)) : new Ee();
}
function ci(e, t, n, r) {
  return arguments.length === 1 ? n0(e) : new Ee(e, t, n, r ?? 1);
}
function Ee(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Bi(Ee, ci, ql(Rn, {
  brighter(e) {
    return e = e == null ? Ar : Math.pow(Ar, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Cn : Math.pow(Cn, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ee(Et(this.r), Et(this.g), Et(this.b), Tr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ws,
  // Deprecated! Use color.formatHex.
  formatHex: Ws,
  formatHex8: r0,
  formatRgb: Bs,
  toString: Bs
}));
function Ws() {
  return `#${kt(this.r)}${kt(this.g)}${kt(this.b)}`;
}
function r0() {
  return `#${kt(this.r)}${kt(this.g)}${kt(this.b)}${kt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Bs() {
  const e = Tr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Et(this.r)}, ${Et(this.g)}, ${Et(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Tr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Et(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function kt(e) {
  return e = Et(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Vs(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new He(e, t, n, r);
}
function Kl(e) {
  if (e instanceof He) return new He(e.h, e.s, e.l, e.opacity);
  if (e instanceof Rn || (e = Nt(e)), !e) return new He();
  if (e instanceof He) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new He(s, a, l, e.opacity);
}
function o0(e, t, n, r) {
  return arguments.length === 1 ? Kl(e) : new He(e, t, n, r ?? 1);
}
function He(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Bi(He, o0, ql(Rn, {
  brighter(e) {
    return e = e == null ? Ar : Math.pow(Ar, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Cn : Math.pow(Cn, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new Ee(
      Yo(e >= 240 ? e - 240 : e + 120, o, r),
      Yo(e, o, r),
      Yo(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new He(Fs(this.h), lr(this.s), lr(this.l), Tr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Tr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Fs(this.h)}, ${lr(this.s) * 100}%, ${lr(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Fs(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function lr(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Yo(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Vi = (e) => () => e;
function i0(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function s0(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function a0(e) {
  return (e = +e) == 1 ? Zl : function(t, n) {
    return n - t ? s0(t, n, e) : Vi(isNaN(t) ? n : t);
  };
}
function Zl(e, t) {
  var n = t - e;
  return n ? i0(e, n) : Vi(isNaN(e) ? t : e);
}
const Lr = function e(t) {
  var n = a0(t);
  function r(o, i) {
    var s = n((o = ci(o)).r, (i = ci(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = Zl(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function l0(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function c0(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function d0(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = kn(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function u0(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function qe(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function f0(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = kn(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var di = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Go = new RegExp(di.source, "g");
function h0(e) {
  return function() {
    return e;
  };
}
function p0(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Ql(e, t) {
  var n = di.lastIndex = Go.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = di.exec(e)) && (o = Go.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: qe(r, o) })), n = Go.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? p0(l[0].x) : h0(t) : (t = l.length, function(c) {
    for (var d = 0, f; d < t; ++d) a[(f = l[d]).i] = f.x(c);
    return a.join("");
  });
}
function kn(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Vi(t) : (n === "number" ? qe : n === "string" ? (r = Nt(t)) ? (t = r, Lr) : Ql : t instanceof Nt ? Lr : t instanceof Date ? u0 : c0(t) ? l0 : Array.isArray(t) ? d0 : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? f0 : qe)(e, t);
}
var js = 180 / Math.PI, ui = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Jl(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * js,
    skewX: Math.atan(l) * js,
    scaleX: s,
    scaleY: a
  };
}
var cr;
function g0(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ui : Jl(t.a, t.b, t.c, t.d, t.e, t.f);
}
function m0(e) {
  return e == null || (cr || (cr = document.createElementNS("http://www.w3.org/2000/svg", "g")), cr.setAttribute("transform", e), !(e = cr.transform.baseVal.consolidate())) ? ui : (e = e.matrix, Jl(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ec(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, f, h, p, g) {
    if (c !== f || d !== h) {
      var v = p.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: qe(c, f) }, { i: v - 2, x: qe(d, h) });
    } else (f || h) && p.push("translate(" + f + t + h + n);
  }
  function s(c, d, f, h) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), h.push({ i: f.push(o(f) + "rotate(", null, r) - 2, x: qe(c, d) })) : d && f.push(o(f) + "rotate(" + d + r);
  }
  function a(c, d, f, h) {
    c !== d ? h.push({ i: f.push(o(f) + "skewX(", null, r) - 2, x: qe(c, d) }) : d && f.push(o(f) + "skewX(" + d + r);
  }
  function l(c, d, f, h, p, g) {
    if (c !== f || d !== h) {
      var v = p.push(o(p) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: qe(c, f) }, { i: v - 2, x: qe(d, h) });
    } else (f !== 1 || h !== 1) && p.push(o(p) + "scale(" + f + "," + h + ")");
  }
  return function(c, d) {
    var f = [], h = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, f, h), s(c.rotate, d.rotate, f, h), a(c.skewX, d.skewX, f, h), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, h), c = d = null, function(p) {
      for (var g = -1, v = h.length, b; ++g < v; ) f[(b = h[g]).i] = b.x(p);
      return f.join("");
    };
  };
}
var y0 = ec(g0, "px, ", "px)", "deg)"), w0 = ec(m0, ", ", ")", ")"), b0 = 1e-12;
function Ys(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function v0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function x0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const vr = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], f = s[1], h = s[2], p = d - a, g = f - l, v = p * p + g * g, b, m;
    if (v < b0)
      m = Math.log(h / c) / t, b = function(C) {
        return [
          a + C * p,
          l + C * g,
          c * Math.exp(t * C * m)
        ];
      };
    else {
      var _ = Math.sqrt(v), y = (h * h - c * c + r * v) / (2 * c * n * _), w = (h * h - c * c - r * v) / (2 * h * n * _), N = Math.log(Math.sqrt(y * y + 1) - y), E = Math.log(Math.sqrt(w * w + 1) - w);
      m = (E - N) / t, b = function(C) {
        var T = C * m, A = Ys(N), O = c / (n * _) * (A * x0(t * T + N) - v0(N));
        return [
          a + O * p,
          l + O * g,
          c * A / Ys(t * T + N)
        ];
      };
    }
    return b.duration = m * 1e3 * t / Math.SQRT2, b;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var Gt = 0, bn = 0, mn = 0, tc = 1e3, zr, vn, Or = 0, Ct = 0, qr = 0, $n = typeof performance == "object" && performance.now ? performance : Date, nc = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Fi() {
  return Ct || (nc(_0), Ct = $n.now() + qr);
}
function _0() {
  Ct = 0;
}
function Pr() {
  this._call = this._time = this._next = null;
}
Pr.prototype = rc.prototype = {
  constructor: Pr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Fi() : +n) + (t == null ? 0 : +t), !this._next && vn !== this && (vn ? vn._next = this : zr = this, vn = this), this._call = e, this._time = n, fi();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, fi());
  }
};
function rc(e, t, n) {
  var r = new Pr();
  return r.restart(e, t, n), r;
}
function k0() {
  Fi(), ++Gt;
  for (var e = zr, t; e; )
    (t = Ct - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Gt;
}
function Gs() {
  Ct = (Or = $n.now()) + qr, Gt = bn = 0;
  try {
    k0();
  } finally {
    Gt = 0, S0(), Ct = 0;
  }
}
function E0() {
  var e = $n.now(), t = e - Or;
  t > tc && (qr -= t, Or = e);
}
function S0() {
  for (var e, t = zr, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : zr = n);
  vn = e, fi(r);
}
function fi(e) {
  if (!Gt) {
    bn && (bn = clearTimeout(bn));
    var t = e - Ct;
    t > 24 ? (e < 1 / 0 && (bn = setTimeout(Gs, e - $n.now() - qr)), mn && (mn = clearInterval(mn))) : (mn || (Or = $n.now(), mn = setInterval(E0, tc)), Gt = 1, nc(Gs));
  }
}
function Xs(e, t, n) {
  var r = new Pr();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var N0 = Xr("start", "end", "cancel", "interrupt"), C0 = [], oc = 0, Us = 1, hi = 2, xr = 3, qs = 4, pi = 5, _r = 6;
function Kr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  M0(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: N0,
    tween: C0,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: oc
  });
}
function ji(e, t) {
  var n = je(e, t);
  if (n.state > oc) throw new Error("too late; already scheduled");
  return n;
}
function Qe(e, t) {
  var n = je(e, t);
  if (n.state > xr) throw new Error("too late; already running");
  return n;
}
function je(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function M0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = rc(i, 0, n.time);
  function i(c) {
    n.state = Us, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, h, p;
    if (n.state !== Us) return l();
    for (d in r)
      if (p = r[d], p.name === n.name) {
        if (p.state === xr) return Xs(s);
        p.state === qs ? (p.state = _r, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete r[d]) : +d < t && (p.state = _r, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete r[d]);
      }
    if (Xs(function() {
      n.state === xr && (n.state = qs, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = hi, n.on.call("start", e, e.__data__, n.index, n.group), n.state === hi) {
      for (n.state = xr, o = new Array(h = n.tween.length), d = 0, f = -1; d < h; ++d)
        (p = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = p);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = pi, 1), f = -1, h = o.length; ++f < h; )
      o[f].call(e, d);
    n.state === pi && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = _r, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function kr(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > hi && r.state < pi, r.state = _r, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function $0(e) {
  return this.each(function() {
    kr(this, e);
  });
}
function I0(e, t) {
  var n, r;
  return function() {
    var o = Qe(this, e), i = o.tween;
    if (i !== n) {
      r = n = i;
      for (var s = 0, a = r.length; s < a; ++s)
        if (r[s].name === t) {
          r = r.slice(), r.splice(s, 1);
          break;
        }
    }
    o.tween = r;
  };
}
function A0(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = Qe(this, e), s = i.tween;
    if (s !== r) {
      o = (r = s).slice();
      for (var a = { name: t, value: n }, l = 0, c = o.length; l < c; ++l)
        if (o[l].name === t) {
          o[l] = a;
          break;
        }
      l === c && o.push(a);
    }
    i.tween = o;
  };
}
function T0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = je(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? I0 : A0)(n, e, t));
}
function Yi(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = Qe(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return je(o, r).value[t];
  };
}
function ic(e, t) {
  var n;
  return (typeof t == "number" ? qe : t instanceof Nt ? Lr : (n = Nt(t)) ? (t = n, Lr) : Ql)(e, t);
}
function L0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function z0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function O0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function P0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function D0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function R0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function H0(e, t) {
  var n = Ur(e), r = n === "transform" ? w0 : ic;
  return this.attrTween(e, typeof t == "function" ? (n.local ? R0 : D0)(n, r, Yi(this, "attr." + e, t)) : t == null ? (n.local ? z0 : L0)(n) : (n.local ? P0 : O0)(n, r, t));
}
function W0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function B0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function V0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && B0(e, i)), n;
  }
  return o._value = t, o;
}
function F0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && W0(e, i)), n;
  }
  return o._value = t, o;
}
function j0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Ur(e);
  return this.tween(n, (r.local ? V0 : F0)(r, t));
}
function Y0(e, t) {
  return function() {
    ji(this, e).delay = +t.apply(this, arguments);
  };
}
function G0(e, t) {
  return t = +t, function() {
    ji(this, e).delay = t;
  };
}
function X0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Y0 : G0)(t, e)) : je(this.node(), t).delay;
}
function U0(e, t) {
  return function() {
    Qe(this, e).duration = +t.apply(this, arguments);
  };
}
function q0(e, t) {
  return t = +t, function() {
    Qe(this, e).duration = t;
  };
}
function K0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? U0 : q0)(t, e)) : je(this.node(), t).duration;
}
function Z0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Qe(this, e).ease = t;
  };
}
function Q0(e) {
  var t = this._id;
  return arguments.length ? this.each(Z0(t, e)) : je(this.node(), t).ease;
}
function J0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Qe(this, e).ease = n;
  };
}
function ew(e) {
  if (typeof e != "function") throw new Error();
  return this.each(J0(this._id, e));
}
function tw(e) {
  typeof e != "function" && (e = Pl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new st(r, this._parents, this._name, this._id);
}
function nw(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, f = s[a] = new Array(d), h, p = 0; p < d; ++p)
      (h = l[p] || c[p]) && (f[p] = h);
  for (; a < r; ++a)
    s[a] = t[a];
  return new st(s, this._parents, this._name, this._id);
}
function rw(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function ow(e, t, n) {
  var r, o, i = rw(t) ? ji : Qe;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function iw(e, t) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(e) : this.each(ow(n, e, t));
}
function sw(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function aw() {
  return this.on("end.remove", sw(this._id));
}
function lw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Hi(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, f, h = 0; h < l; ++h)
      (d = a[h]) && (f = e.call(d, d.__data__, h, a)) && ("__data__" in d && (f.__data__ = d.__data__), c[h] = f, Kr(c[h], t, n, h, c, je(d, n)));
  return new st(i, this._parents, t, n);
}
function cw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Ol(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, f = 0; f < c; ++f)
      if (d = l[f]) {
        for (var h = e.call(d, d.__data__, f, l), p, g = je(d, n), v = 0, b = h.length; v < b; ++v)
          (p = h[v]) && Kr(p, t, n, v, h, g);
        i.push(h), s.push(d);
      }
  return new st(i, s, t, n);
}
var dw = Dn.prototype.constructor;
function uw() {
  return new dw(this._groups, this._parents);
}
function fw(e, t) {
  var n, r, o;
  return function() {
    var i = Yt(this, e), s = (this.style.removeProperty(e), Yt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function sc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function hw(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = Yt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function pw(e, t, n) {
  var r, o, i;
  return function() {
    var s = Yt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Yt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function gw(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Qe(this, e), c = l.on, d = l.value[i] == null ? a || (a = sc(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function mw(e, t, n) {
  var r = (e += "") == "transform" ? y0 : ic;
  return t == null ? this.styleTween(e, fw(e, r)).on("end.style." + e, sc(e)) : typeof t == "function" ? this.styleTween(e, pw(e, r, Yi(this, "style." + e, t))).each(gw(this._id, e)) : this.styleTween(e, hw(e, r, t), n).on("end.style." + e, null);
}
function yw(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function ww(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && yw(e, s, n)), r;
  }
  return i._value = t, i;
}
function bw(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, ww(e, t, n ?? ""));
}
function vw(e) {
  return function() {
    this.textContent = e;
  };
}
function xw(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function _w(e) {
  return this.tween("text", typeof e == "function" ? xw(Yi(this, "text", e)) : vw(e == null ? "" : e + ""));
}
function kw(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Ew(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && kw(o)), t;
  }
  return r._value = e, r;
}
function Sw(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Ew(e));
}
function Nw() {
  for (var e = this._name, t = this._id, n = ac(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = je(l, t);
        Kr(l, e, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new st(r, this._parents, e, n);
}
function Cw() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = Qe(this, r), d = c.on;
      d !== e && (t = (e = d).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var Mw = 0;
function st(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function ac() {
  return ++Mw;
}
var nt = Dn.prototype;
st.prototype = {
  constructor: st,
  select: lw,
  selectAll: cw,
  selectChild: nt.selectChild,
  selectChildren: nt.selectChildren,
  filter: tw,
  merge: nw,
  selection: uw,
  transition: Nw,
  call: nt.call,
  nodes: nt.nodes,
  node: nt.node,
  size: nt.size,
  empty: nt.empty,
  each: nt.each,
  on: iw,
  attr: H0,
  attrTween: j0,
  style: mw,
  styleTween: bw,
  text: _w,
  textTween: Sw,
  remove: aw,
  tween: T0,
  delay: X0,
  duration: K0,
  ease: Q0,
  easeVarying: ew,
  end: Cw,
  [Symbol.iterator]: nt[Symbol.iterator]
};
function $w(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Iw = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: $w
};
function Aw(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Tw(e) {
  var t, n;
  e instanceof st ? (t = e._id, e = e._name) : (t = ac(), (n = Iw).time = Fi(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Kr(l, e, t, c, s, n || Aw(l, t));
  return new st(r, this._parents, e, t);
}
Dn.prototype.interrupt = $0;
Dn.prototype.transition = Tw;
const dr = (e) => () => e;
function Lw(e, {
  sourceEvent: t,
  target: n,
  transform: r,
  dispatch: o
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: o }
  });
}
function it(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
it.prototype = {
  constructor: it,
  scale: function(e) {
    return e === 1 ? this : new it(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new it(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Zr = new it(1, 0, 0);
lc.prototype = it.prototype;
function lc(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Zr;
  return e.__zoom;
}
function Xo(e) {
  e.stopImmediatePropagation();
}
function yn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function zw(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Ow() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Ks() {
  return this.__zoom || Zr;
}
function Pw(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Dw() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Rw(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function cc() {
  var e = zw, t = Ow, n = Rw, r = Pw, o = Dw, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = vr, c = Xr("start", "zoom", "end"), d, f, h, p = 500, g = 150, v = 0, b = 10;
  function m(x) {
    x.property("__zoom", Ks).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", O).filter(o).on("touchstart.zoom", L).on("touchmove.zoom", B).on("touchend.zoom touchcancel.zoom", H).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(x, $, M, S) {
    var z = x.selection ? x.selection() : x;
    z.property("__zoom", Ks), x !== z ? N(x, $, M, S) : z.interrupt().each(function() {
      E(this, arguments).event(S).start().zoom(null, typeof $ == "function" ? $.apply(this, arguments) : $).end();
    });
  }, m.scaleBy = function(x, $, M, S) {
    m.scaleTo(x, function() {
      var z = this.__zoom.k, I = typeof $ == "function" ? $.apply(this, arguments) : $;
      return z * I;
    }, M, S);
  }, m.scaleTo = function(x, $, M, S) {
    m.transform(x, function() {
      var z = t.apply(this, arguments), I = this.__zoom, D = M == null ? w(z) : typeof M == "function" ? M.apply(this, arguments) : M, P = I.invert(D), V = typeof $ == "function" ? $.apply(this, arguments) : $;
      return n(y(_(I, V), D, P), z, s);
    }, M, S);
  }, m.translateBy = function(x, $, M, S) {
    m.transform(x, function() {
      return n(this.__zoom.translate(
        typeof $ == "function" ? $.apply(this, arguments) : $,
        typeof M == "function" ? M.apply(this, arguments) : M
      ), t.apply(this, arguments), s);
    }, null, S);
  }, m.translateTo = function(x, $, M, S, z) {
    m.transform(x, function() {
      var I = t.apply(this, arguments), D = this.__zoom, P = S == null ? w(I) : typeof S == "function" ? S.apply(this, arguments) : S;
      return n(Zr.translate(P[0], P[1]).scale(D.k).translate(
        typeof $ == "function" ? -$.apply(this, arguments) : -$,
        typeof M == "function" ? -M.apply(this, arguments) : -M
      ), I, s);
    }, S, z);
  };
  function _(x, $) {
    return $ = Math.max(i[0], Math.min(i[1], $)), $ === x.k ? x : new it($, x.x, x.y);
  }
  function y(x, $, M) {
    var S = $[0] - M[0] * x.k, z = $[1] - M[1] * x.k;
    return S === x.x && z === x.y ? x : new it(x.k, S, z);
  }
  function w(x) {
    return [(+x[0][0] + +x[1][0]) / 2, (+x[0][1] + +x[1][1]) / 2];
  }
  function N(x, $, M, S) {
    x.on("start.zoom", function() {
      E(this, arguments).event(S).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event(S).end();
    }).tween("zoom", function() {
      var z = this, I = arguments, D = E(z, I).event(S), P = t.apply(z, I), V = M == null ? w(P) : typeof M == "function" ? M.apply(z, I) : M, X = Math.max(P[1][0] - P[0][0], P[1][1] - P[0][1]), F = z.__zoom, Q = typeof $ == "function" ? $.apply(z, I) : $, G = l(F.invert(V).concat(X / F.k), Q.invert(V).concat(X / Q.k));
      return function(ee) {
        if (ee === 1) ee = Q;
        else {
          var W = G(ee), j = X / W[2];
          ee = new it(j, V[0] - W[0] * j, V[1] - W[1] * j);
        }
        D.zoom(null, ee);
      };
    });
  }
  function E(x, $, M) {
    return !M && x.__zooming || new C(x, $);
  }
  function C(x, $) {
    this.that = x, this.args = $, this.active = 0, this.sourceEvent = null, this.extent = t.apply(x, $), this.taps = 0;
  }
  C.prototype = {
    event: function(x) {
      return x && (this.sourceEvent = x), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(x, $) {
      return this.mouse && x !== "mouse" && (this.mouse[1] = $.invert(this.mouse[0])), this.touch0 && x !== "touch" && (this.touch0[1] = $.invert(this.touch0[0])), this.touch1 && x !== "touch" && (this.touch1[1] = $.invert(this.touch1[0])), this.that.__zoom = $, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(x) {
      var $ = Ce(this.that).datum();
      c.call(
        x,
        this.that,
        new Lw(x, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        $
      );
    }
  };
  function T(x, ...$) {
    if (!e.apply(this, arguments)) return;
    var M = E(this, $).event(x), S = this.__zoom, z = Math.max(i[0], Math.min(i[1], S.k * Math.pow(2, r.apply(this, arguments)))), I = Re(x);
    if (M.wheel)
      (M.mouse[0][0] !== I[0] || M.mouse[0][1] !== I[1]) && (M.mouse[1] = S.invert(M.mouse[0] = I)), clearTimeout(M.wheel);
    else {
      if (S.k === z) return;
      M.mouse = [I, S.invert(I)], kr(this), M.start();
    }
    yn(x), M.wheel = setTimeout(D, g), M.zoom("mouse", n(y(_(S, z), M.mouse[0], M.mouse[1]), M.extent, s));
    function D() {
      M.wheel = null, M.end();
    }
  }
  function A(x, ...$) {
    if (h || !e.apply(this, arguments)) return;
    var M = x.currentTarget, S = E(this, $, !0).event(x), z = Ce(x.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", X, !0), I = Re(x, M), D = x.clientX, P = x.clientY;
    Gl(x.view), Xo(x), S.mouse = [I, this.__zoom.invert(I)], kr(this), S.start();
    function V(F) {
      if (yn(F), !S.moved) {
        var Q = F.clientX - D, G = F.clientY - P;
        S.moved = Q * Q + G * G > v;
      }
      S.event(F).zoom("mouse", n(y(S.that.__zoom, S.mouse[0] = Re(F, M), S.mouse[1]), S.extent, s));
    }
    function X(F) {
      z.on("mousemove.zoom mouseup.zoom", null), Xl(F.view, S.moved), yn(F), S.event(F).end();
    }
  }
  function O(x, ...$) {
    if (e.apply(this, arguments)) {
      var M = this.__zoom, S = Re(x.changedTouches ? x.changedTouches[0] : x, this), z = M.invert(S), I = M.k * (x.shiftKey ? 0.5 : 2), D = n(y(_(M, I), S, z), t.apply(this, $), s);
      yn(x), a > 0 ? Ce(this).transition().duration(a).call(N, D, S, x) : Ce(this).call(m.transform, D, S, x);
    }
  }
  function L(x, ...$) {
    if (e.apply(this, arguments)) {
      var M = x.touches, S = M.length, z = E(this, $, x.changedTouches.length === S).event(x), I, D, P, V;
      for (Xo(x), D = 0; D < S; ++D)
        P = M[D], V = Re(P, this), V = [V, this.__zoom.invert(V), P.identifier], z.touch0 ? !z.touch1 && z.touch0[2] !== V[2] && (z.touch1 = V, z.taps = 0) : (z.touch0 = V, I = !0, z.taps = 1 + !!d);
      d && (d = clearTimeout(d)), I && (z.taps < 2 && (f = V[0], d = setTimeout(function() {
        d = null;
      }, p)), kr(this), z.start());
    }
  }
  function B(x, ...$) {
    if (this.__zooming) {
      var M = E(this, $).event(x), S = x.changedTouches, z = S.length, I, D, P, V;
      for (yn(x), I = 0; I < z; ++I)
        D = S[I], P = Re(D, this), M.touch0 && M.touch0[2] === D.identifier ? M.touch0[0] = P : M.touch1 && M.touch1[2] === D.identifier && (M.touch1[0] = P);
      if (D = M.that.__zoom, M.touch1) {
        var X = M.touch0[0], F = M.touch0[1], Q = M.touch1[0], G = M.touch1[1], ee = (ee = Q[0] - X[0]) * ee + (ee = Q[1] - X[1]) * ee, W = (W = G[0] - F[0]) * W + (W = G[1] - F[1]) * W;
        D = _(D, Math.sqrt(ee / W)), P = [(X[0] + Q[0]) / 2, (X[1] + Q[1]) / 2], V = [(F[0] + G[0]) / 2, (F[1] + G[1]) / 2];
      } else if (M.touch0) P = M.touch0[0], V = M.touch0[1];
      else return;
      M.zoom("touch", n(y(D, P, V), M.extent, s));
    }
  }
  function H(x, ...$) {
    if (this.__zooming) {
      var M = E(this, $).event(x), S = x.changedTouches, z = S.length, I, D;
      for (Xo(x), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, p), I = 0; I < z; ++I)
        D = S[I], M.touch0 && M.touch0[2] === D.identifier ? delete M.touch0 : M.touch1 && M.touch1[2] === D.identifier && delete M.touch1;
      if (M.touch1 && !M.touch0 && (M.touch0 = M.touch1, delete M.touch1), M.touch0) M.touch0[1] = this.__zoom.invert(M.touch0[0]);
      else if (M.end(), M.taps === 2 && (D = Re(D, this), Math.hypot(f[0] - D[0], f[1] - D[1]) < b)) {
        var P = Ce(this).on("dblclick.zoom");
        P && P.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : dr(+x), m) : r;
  }, m.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : dr(!!x), m) : e;
  }, m.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : dr(!!x), m) : o;
  }, m.extent = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : dr([[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]]), m) : t;
  }, m.scaleExtent = function(x) {
    return arguments.length ? (i[0] = +x[0], i[1] = +x[1], m) : [i[0], i[1]];
  }, m.translateExtent = function(x) {
    return arguments.length ? (s[0][0] = +x[0][0], s[1][0] = +x[1][0], s[0][1] = +x[0][1], s[1][1] = +x[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(x) {
    return arguments.length ? (n = x, m) : n;
  }, m.duration = function(x) {
    return arguments.length ? (a = +x, m) : a;
  }, m.interpolate = function(x) {
    return arguments.length ? (l = x, m) : l;
  }, m.on = function() {
    var x = c.on.apply(c, arguments);
    return x === c ? m : x;
  }, m.clickDistance = function(x) {
    return arguments.length ? (v = (x = +x) * x, m) : Math.sqrt(v);
  }, m.tapDistance = function(x) {
    return arguments.length ? (b = +x, m) : b;
  }, m;
}
const Ve = {
  error001: (e = "react") => `Seems like you have not used ${e === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: r }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : r}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (e) => `Edge with id "${e}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, In = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], dc = ["Enter", " ", "Escape"], uc = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var Xt;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Xt || (Xt = {}));
var St;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(St || (St = {}));
var An;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(An || (An = {}));
const fc = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var ft;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(ft || (ft = {}));
var Ut;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Ut || (Ut = {}));
var U;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(U || (U = {}));
const Zs = {
  [U.Left]: U.Right,
  [U.Right]: U.Left,
  [U.Top]: U.Bottom,
  [U.Bottom]: U.Top
}, hc = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, Hw = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Gi = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Hn = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ye(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Ww = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Gi(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, Qr(o, Dr(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? Jr(r) : { x: 0, y: 0, width: 0, height: 0 };
}, Wn = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = Qr(n, Dr(o)), r = !0);
  }), r ? Jr(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Xi = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, f = [];
  for (const h of e.values()) {
    const { measured: p, selectable: g = !0, hidden: v = !1 } = h;
    if (s && !g || v)
      continue;
    const b = p.width ?? h.width ?? h.initialWidth ?? 0, m = p.height ?? h.height ?? h.initialHeight ?? 0, { x: _, y } = h.internals.positionAbsolute, w = yc(a, l, c, d, _, y, b, m), N = b * m, E = i && w > 0;
    (!h.internals.handleBounds || E || w >= N || h.dragging) && f.push(h);
  }
  return f;
}, Bw = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function Vw(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = Ye(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function Fw({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Vw(e, s), l = Wn(a), c = eo(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function pc({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, d = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Ve.error005());
    else {
      const { width: p, height: g } = Ye(a);
      p && g && (f = [
        [l, c],
        [l + p, c + g]
      ]);
    }
  else a && $t(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const h = $t(f) ? Mt(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Ve.error015())), {
    position: {
      x: h.x - l + (s.measured.width ?? 0) * d[0],
      y: h.y - c + (s.measured.height ?? 0) * d[1]
    },
    positionAbsolute: h
  };
}
async function jw({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((h) => h.id)), s = [];
  for (const h of n) {
    if (h.deletable === !1)
      continue;
    const p = i.has(h.id), g = !p && h.parentId && s.find((v) => v.id === h.parentId);
    (p || g) && s.push(h);
  }
  const a = new Set(t.map((h) => h.id)), l = r.filter((h) => h.deletable !== !1), d = Bw(s, l);
  for (const h of l)
    a.has(h.id) && !d.find((g) => g.id === h.id) && d.push(h);
  if (!o)
    return {
      edges: d,
      nodes: s
    };
  const f = await o({
    nodes: s,
    edges: d
  });
  return typeof f == "boolean" ? f ? { edges: d, nodes: s } : { edges: [], nodes: [] } : f;
}
const qt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Mt = (e = { x: 0, y: 0 }, t, n) => ({
  x: qt(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: qt(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function gc(e, t, n) {
  const { width: r, height: o } = Ye(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Mt(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const Qs = (e, t, n) => e < t ? qt(Math.abs(e - t), 1, t) / t : e > n ? -qt(Math.abs(e - n), 1, t) / t : 0, Ui = (e, t, n = 15, r = 40) => {
  const o = Qs(e.x, r, t.width - r) * n, i = Qs(e.y, r, t.height - r) * n;
  return [o, i];
}, Qr = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), gi = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), Jr = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), Tn = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Gi(e) ? e.internals.positionAbsolute : Hn(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Dr = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Gi(e) ? e.internals.positionAbsolute : Hn(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, mc = (e, t) => Jr(Qr(gi(e), gi(t))), yc = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Rr = (e, t) => yc(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Js = (e) => We(e.width) && We(e.height) && We(e.x) && We(e.y), We = (e) => !isNaN(e) && isFinite(e), wc = (e, t) => (n, r) => {
}, Bn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Vn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Bn(a, s) : a;
}, Kt = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function Wt(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Yw(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = Wt(e, n), o = Wt(e, t);
    return {
      top: r,
      right: o,
      bottom: r,
      left: o,
      x: o * 2,
      y: r * 2
    };
  }
  if (typeof e == "object") {
    const r = Wt(e.top ?? e.y ?? 0, n), o = Wt(e.bottom ?? e.y ?? 0, n), i = Wt(e.left ?? e.x ?? 0, t), s = Wt(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Gw(e, t, n, r, o, i) {
  const { x: s, y: a } = Kt(e, [t, n, r]), { x: l, y: c } = Kt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(f)
  };
}
const eo = (e, t, n, r, o, i) => {
  const s = Yw(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = qt(c, r, o), f = e.x + e.width / 2, h = e.y + e.height / 2, p = t / 2 - f * d, g = n / 2 - h * d, v = Gw(e, p, g, d, t, n), b = {
    left: Math.min(v.left - s.left, 0),
    top: Math.min(v.top - s.top, 0),
    right: Math.min(v.right - s.right, 0),
    bottom: Math.min(v.bottom - s.bottom, 0)
  };
  return {
    x: p - b.left + b.right,
    y: g - b.top + b.bottom,
    zoom: d
  };
}, Ln = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function $t(e) {
  return e != null && e !== "parent";
}
function Ye(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function bc(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function vc(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function ea(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Xw() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function Uw(e) {
  return { ...uc, ...e || {} };
}
function xc(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function En(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Be(e), a = Vn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Bn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const qi = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), _c = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, qw = ["INPUT", "SELECT", "TEXTAREA"];
function kc(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : qw.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Ec = (e) => "clientX" in e, Be = (e, t) => {
  var i, s;
  const n = Ec(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, ta = (e, t, n, r, o) => {
  const i = t.querySelectorAll(`.${e}`);
  return !i || !i.length ? null : Array.from(i).map((s) => {
    const a = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: o,
      position: s.getAttribute("data-handlepos"),
      x: (a.left - n.left) / r,
      y: (a.top - n.top) / r,
      ...qi(s)
    };
  });
};
function Sc({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, d, f];
}
function ur(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function na({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case U.Left:
      return [t - ur(t - r, i), n];
    case U.Right:
      return [t + ur(r - t, i), n];
    case U.Top:
      return [t, n - ur(n - o, i)];
    case U.Bottom:
      return [t, n + ur(o - n, i)];
  }
}
function Nc({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, curvature: s = 0.25 }) {
  const [a, l] = na({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = na({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, h, p, g] = Sc({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: o,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: c,
    targetControlY: d
  });
  return [
    `M${e},${t} C${a},${l} ${c},${d} ${r},${o}`,
    f,
    h,
    p,
    g
  ];
}
function Cc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function Kw({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function Zw({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = Qr(Dr(e), Dr(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return Rr(s, Jr(i)) > 0;
}
const Qw = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Jw = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), eb = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Ve.error006()), t;
  const r = n.getEdgeId || Qw;
  let o;
  return hc(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, Jw(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function Mc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = Cc({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const ra = {
  [U.Left]: { x: -1, y: 0 },
  [U.Right]: { x: 1, y: 0 },
  [U.Top]: { x: 0, y: -1 },
  [U.Bottom]: { x: 0, y: 1 }
}, tb = ({ source: e, sourcePosition: t = U.Bottom, target: n }) => t === U.Left || t === U.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, oa = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function nb({ source: e, sourcePosition: t = U.Bottom, target: n, targetPosition: r = U.Top, center: o, offset: i, stepPosition: s }) {
  const a = ra[t], l = ra[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, f = tb({
    source: c,
    sourcePosition: t,
    target: d
  }), h = f.x !== 0 ? "x" : "y", p = f[h];
  let g = [], v, b;
  const m = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , y, w] = Cc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[h] * l[h] === -1) {
    h === "x" ? (v = o.x ?? c.x + (d.x - c.x) * s, b = o.y ?? (c.y + d.y) / 2) : (v = o.x ?? (c.x + d.x) / 2, b = o.y ?? c.y + (d.y - c.y) * s);
    const T = [
      { x: v, y: c.y },
      { x: v, y: d.y }
    ], A = [
      { x: c.x, y: b },
      { x: d.x, y: b }
    ];
    a[h] === p ? g = h === "x" ? T : A : g = h === "x" ? A : T;
  } else {
    const T = [{ x: c.x, y: d.y }], A = [{ x: d.x, y: c.y }];
    if (h === "x" ? g = a.x === p ? A : T : g = a.y === p ? T : A, t === r) {
      const x = Math.abs(e[h] - n[h]);
      if (x <= i) {
        const $ = Math.min(i - 1, i - x);
        a[h] === p ? m[h] = (c[h] > e[h] ? -1 : 1) * $ : _[h] = (d[h] > n[h] ? -1 : 1) * $;
      }
    }
    if (t !== r) {
      const x = h === "x" ? "y" : "x", $ = a[h] === l[x], M = c[x] > d[x], S = c[x] < d[x];
      (a[h] === 1 && (!$ && M || $ && S) || a[h] !== 1 && (!$ && S || $ && M)) && (g = h === "x" ? T : A);
    }
    const O = { x: c.x + m.x, y: c.y + m.y }, L = { x: d.x + _.x, y: d.y + _.y }, B = Math.max(Math.abs(O.x - g[0].x), Math.abs(L.x - g[0].x)), H = Math.max(Math.abs(O.y - g[0].y), Math.abs(L.y - g[0].y));
    B >= H ? (v = (O.x + L.x) / 2, b = g[0].y) : (v = g[0].x, b = (O.y + L.y) / 2);
  }
  const N = { x: c.x + m.x, y: c.y + m.y }, E = { x: d.x + _.x, y: d.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...N.x !== g[0].x || N.y !== g[0].y ? [N] : [],
    ...g,
    ...E.x !== g[g.length - 1].x || E.y !== g[g.length - 1].y ? [E] : [],
    n
  ], v, b, y, w];
}
function rb(e, t, n, r) {
  const o = Math.min(oa(e, t) / 2, oa(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * d}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function mi({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: d = 0.5 }) {
  const [f, h, p, g, v] = nb({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: d
  });
  let b = `M${f[0].x} ${f[0].y}`;
  for (let m = 1; m < f.length - 1; m++)
    b += rb(f[m - 1], f[m], f[m + 1], s);
  return b += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [b, h, p, g, v];
}
function ia(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function ob(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!ia(t) || !ia(n))
    return null;
  const r = t.internals.handleBounds || sa(t.handles), o = n.internals.handleBounds || sa(n.handles), i = aa((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = aa(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Xt.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Ve.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || U.Bottom, l = (s == null ? void 0 : s.position) || U.Top, c = It(t, i, a), d = It(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: d.x,
    targetY: d.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function sa(e) {
  if (!e)
    return null;
  const t = [], n = [];
  for (const r of e)
    r.width = r.width ?? 1, r.height = r.height ?? 1, r.type === "source" ? t.push(r) : r.type === "target" && n.push(r);
  return {
    source: t,
    target: n
  };
}
function It(e, t, n = U.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ye(e);
  if (r)
    return { x: o + s / 2, y: i + a / 2 };
  switch ((t == null ? void 0 : t.position) ?? n) {
    case U.Top:
      return { x: o + s / 2, y: i };
    case U.Right:
      return { x: o + s, y: i + a / 2 };
    case U.Bottom:
      return { x: o + s / 2, y: i + a };
    case U.Left:
      return { x: o, y: i + a / 2 };
  }
}
function aa(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function yi(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function ib(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = yi(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const $c = 1e3, sb = 10, Ki = {
  nodeOrigin: [0, 0],
  nodeExtent: In,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, ab = {
  ...Ki,
  checkEquality: !0
};
function Zi(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function lb(e, t, n) {
  const r = Zi(Ki, n);
  for (const o of e.values())
    if (o.parentId)
      Ji(o, e, t, r);
    else {
      const i = Hn(o, r.nodeOrigin), s = $t(o.extent) ? o.extent : r.nodeExtent, a = Mt(i, s, Ye(o));
      o.internals.positionAbsolute = a;
    }
}
function cb(e, t) {
  if (!e.handles)
    return e.measured ? t == null ? void 0 : t.internals.handleBounds : void 0;
  const n = [], r = [];
  for (const o of e.handles) {
    const i = {
      id: o.id,
      width: o.width ?? 1,
      height: o.height ?? 1,
      nodeId: e.id,
      x: o.x,
      y: o.y,
      position: o.position,
      type: o.type
    };
    o.type === "source" ? n.push(i) : o.type === "target" && r.push(i);
  }
  return {
    source: n,
    target: r
  };
}
function Qi(e) {
  return e === "manual";
}
function wi(e, t, n, r = {}) {
  var d, f;
  const o = Zi(ab, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !Qi(o.zIndexMode) ? $c : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const h of e) {
    let p = s.get(h.id);
    if (o.checkEquality && h === (p == null ? void 0 : p.internals.userNode))
      t.set(h.id, p);
    else {
      const g = Hn(h, o.nodeOrigin), v = $t(h.extent) ? h.extent : o.nodeExtent, b = Mt(g, v, Ye(h));
      p = {
        ...o.defaults,
        ...h,
        measured: {
          width: (d = h.measured) == null ? void 0 : d.width,
          height: (f = h.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: b,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: cb(h, p),
          z: Ic(h, a, o.zIndexMode),
          userNode: h
        }
      }, t.set(h.id, p);
    }
    (p.measured === void 0 || p.measured.width === void 0 || p.measured.height === void 0) && !p.hidden && (l = !1), h.parentId && Ji(p, t, n, r, i), c || (c = h.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function db(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Ji(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Zi(Ki, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  db(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * sb), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const f = i && !Qi(l) ? $c : 0, { x: h, y: p, z: g } = ub(e, d, s, a, f, l), { positionAbsolute: v } = e.internals, b = h !== v.x || p !== v.y;
  (b || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: b ? { x: h, y: p } : v,
      z: g
    }
  });
}
function Ic(e, t, n) {
  const r = We(e.zIndex) ? e.zIndex : 0;
  return Qi(n) ? r : r + (e.selected ? t : 0);
}
function ub(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ye(e), c = Hn(e, n), d = $t(e.extent) ? Mt(c, e.extent, l) : c;
  let f = Mt({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (f = gc(f, l, t));
  const h = Ic(e, o, i), p = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: p >= h ? p + 1 : h
  };
}
function es(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? Tn(l), d = mc(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var y;
    const d = l.internals.positionAbsolute, f = Ye(l), h = l.origin ?? r, p = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, v = Math.max(f.width, Math.round(a.width)), b = Math.max(f.height, Math.round(a.height)), m = (v - f.width) * h[0], _ = (b - f.height) * h[1];
    (p > 0 || g > 0 || m || _) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - p + m,
        y: l.position.y - g + _
      }
    }), (y = n.get(c)) == null || y.forEach((w) => {
      e.some((N) => N.id === w.id) || o.push({
        id: w.id,
        type: "position",
        position: {
          x: w.position.x + p,
          y: w.position.y + g
        }
      });
    })), (f.width < a.width || f.height < a.height || p || g) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: v + (p ? h[0] * p - m : 0),
        height: b + (g ? h[1] * g - _ : 0)
      }
    });
  }), o;
}
function fb(e, t, n, r, o, i, s) {
  const a = r == null ? void 0 : r.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], d = window.getComputedStyle(a), { m22: f } = new window.DOMMatrixReadOnly(d.transform), h = [];
  for (const p of e.values()) {
    const g = t.get(p.id);
    if (!g)
      continue;
    if (g.hidden) {
      t.set(g.id, {
        ...g,
        internals: {
          ...g.internals,
          handleBounds: void 0
        }
      }), l = !0;
      continue;
    }
    const v = qi(p.nodeElement), b = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (b || !g.internals.handleBounds || p.force))) {
      const _ = p.nodeElement.getBoundingClientRect(), y = $t(g.extent) ? g.extent : i;
      let { positionAbsolute: w } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const E = t.get(g.parentId);
        E && (w = gc(w, v, E));
      } else y && (w = Mt(w, y, v));
      const N = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: w,
          handleBounds: {
            source: ta("source", p.nodeElement, _, f, g.id),
            target: ta("target", p.nodeElement, _, f, g.id)
          }
        }
      };
      t.set(g.id, N), g.parentId && Ji(N, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, b && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && h.push({
        id: g.id,
        parentId: g.parentId,
        rect: Tn(N, o)
      }));
    }
  }
  if (h.length > 0) {
    const p = es(h, t, n, o);
    c.push(...p);
  }
  return { changes: c, updatedInternals: l };
}
async function hb({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
  if (!t || !e.x && !e.y)
    return !1;
  const s = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [o, i]
  ], r);
  return !!s && (s.x !== n[0] || s.y !== n[1] || s.k !== n[2]);
}
function la(e, t, n, r, o, i) {
  let s = o;
  const a = r.get(s) || /* @__PURE__ */ new Map();
  r.set(s, a.set(n, t)), s = `${o}-${e}`;
  const l = r.get(s) || /* @__PURE__ */ new Map();
  if (r.set(s, l.set(n, t)), i) {
    s = `${o}-${e}-${i}`;
    const c = r.get(s) || /* @__PURE__ */ new Map();
    r.set(s, c.set(n, t));
  }
}
function Ac(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    la("source", l, d, e, o, s), la("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function Tc(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Tc(n, t) : !1;
}
function ca(e, t, n) {
  var o;
  let r = e;
  do {
    if ((o = r == null ? void 0 : r.matches) != null && o.call(r, t))
      return !0;
    if (r === n)
      return !1;
    r = r == null ? void 0 : r.parentElement;
  } while (r);
  return !1;
}
function pb(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !Tc(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
      const a = e.get(i);
      a && o.set(i, {
        id: i,
        position: a.position || { x: 0, y: 0 },
        distance: {
          x: n.x - a.internals.positionAbsolute.x,
          y: n.y - a.internals.positionAbsolute.y
        },
        extent: a.extent,
        parentId: a.parentId,
        origin: a.origin,
        expandParent: a.expandParent,
        internals: {
          positionAbsolute: a.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: a.measured.width ?? 0,
          height: a.measured.height ?? 0
        }
      });
    }
  return o;
}
function Uo({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
  var s, a, l;
  const o = [];
  for (const [c, d] of t) {
    const f = (s = n.get(c)) == null ? void 0 : s.internals.userNode;
    f && o.push({
      ...f,
      position: d.position,
      dragging: r
    });
  }
  if (!e)
    return [o[0], o];
  const i = (a = n.get(e)) == null ? void 0 : a.internals.userNode;
  return [
    i ? {
      ...i,
      position: ((l = t.get(e)) == null ? void 0 : l.position) || i.position,
      dragging: r
    } : o[0],
    o
  ];
}
function gb({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Bn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function mb({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, f = !1, h = null, p = !1, g = !1, v = null;
  function b({ noDragClassName: _, handleSelector: y, domNode: w, isSelectable: N, nodeId: E, nodeClickDistance: C = 0 }) {
    h = Ce(w);
    function T({ x: B, y: H }) {
      const { nodeLookup: x, nodeExtent: $, snapGrid: M, snapToGrid: S, nodeOrigin: z, onNodeDrag: I, onSelectionDrag: D, onError: P, updateNodePositions: V } = t();
      i = { x: B, y: H };
      let X = !1;
      const F = a.size > 1, Q = F && $ ? gi(Wn(a)) : null, G = F && S ? gb({
        dragItems: a,
        snapGrid: M,
        x: B,
        y: H
      }) : null;
      for (const [ee, W] of a) {
        if (!x.has(ee))
          continue;
        let j = { x: B - W.distance.x, y: H - W.distance.y };
        S && (j = G ? {
          x: Math.round(j.x + G.x),
          y: Math.round(j.y + G.y)
        } : Bn(j, M));
        let q = null;
        if (F && $ && !W.extent && Q) {
          const { positionAbsolute: te } = W.internals, ne = te.x - Q.x + $[0][0], re = te.x + W.measured.width - Q.x2 + $[1][0], se = te.y - Q.y + $[0][1], ue = te.y + W.measured.height - Q.y2 + $[1][1];
          q = [
            [ne, se],
            [re, ue]
          ];
        }
        const { position: K, positionAbsolute: Z } = pc({
          nodeId: ee,
          nextPosition: j,
          nodeLookup: x,
          nodeExtent: q || $,
          nodeOrigin: z,
          onError: P
        });
        X = X || W.position.x !== K.x || W.position.y !== K.y, W.position = K, W.internals.positionAbsolute = Z;
      }
      if (g = g || X, !!X && (V(a, !0), v && (r || I || !E && D))) {
        const [ee, W] = Uo({
          nodeId: E,
          dragItems: a,
          nodeLookup: x
        });
        r == null || r(v, a, ee, W), I == null || I(v, ee, W), E || D == null || D(v, W);
      }
    }
    async function A() {
      if (!d)
        return;
      const { transform: B, panBy: H, autoPanSpeed: x, autoPanOnNodeDrag: $ } = t();
      if (!$) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [M, S] = Ui(c, d, x);
      (M !== 0 || S !== 0) && (i.x = (i.x ?? 0) - M / B[2], i.y = (i.y ?? 0) - S / B[2], await H({ x: M, y: S }) && T(i)), s = requestAnimationFrame(A);
    }
    function O(B) {
      var F;
      const { nodeLookup: H, multiSelectionActive: x, nodesDraggable: $, transform: M, snapGrid: S, snapToGrid: z, selectNodesOnDrag: I, onNodeDragStart: D, onSelectionDragStart: P, unselectNodesAndEdges: V } = t();
      f = !0, (!I || !N) && !x && E && ((F = H.get(E)) != null && F.selected || V()), N && I && E && (e == null || e(E));
      const X = En(B.sourceEvent, { transform: M, snapGrid: S, snapToGrid: z, containerBounds: d });
      if (i = X, a = pb(H, $, X, E), a.size > 0 && (n || D || !E && P)) {
        const [Q, G] = Uo({
          nodeId: E,
          dragItems: a,
          nodeLookup: H
        });
        n == null || n(B.sourceEvent, a, Q, G), D == null || D(B.sourceEvent, Q, G), E || P == null || P(B.sourceEvent, G);
      }
    }
    const L = Ul().clickDistance(C).on("start", (B) => {
      const { domNode: H, nodeDragThreshold: x, transform: $, snapGrid: M, snapToGrid: S } = t();
      d = (H == null ? void 0 : H.getBoundingClientRect()) || null, p = !1, g = !1, v = B.sourceEvent, x === 0 && O(B), i = En(B.sourceEvent, { transform: $, snapGrid: M, snapToGrid: S, containerBounds: d }), c = Be(B.sourceEvent, d);
    }).on("drag", (B) => {
      const { autoPanOnNodeDrag: H, transform: x, snapGrid: $, snapToGrid: M, nodeDragThreshold: S, nodeLookup: z } = t(), I = En(B.sourceEvent, { transform: x, snapGrid: $, snapToGrid: M, containerBounds: d });
      if (v = B.sourceEvent, (B.sourceEvent.type === "touchmove" && B.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      E && !z.has(E)) && (p = !0), !p) {
        if (!l && H && f && (l = !0, A()), !f) {
          const D = Be(B.sourceEvent, d), P = D.x - c.x, V = D.y - c.y;
          Math.sqrt(P * P + V * V) > S && O(B);
        }
        (i.x !== I.xSnapped || i.y !== I.ySnapped) && a && f && (c = Be(B.sourceEvent, d), T(I));
      }
    }).on("end", (B) => {
      if (!f || p) {
        p && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: H, updateNodePositions: x, onNodeDragStop: $, onSelectionDragStop: M } = t();
        if (g && (x(a, !1), g = !1), o || $ || !E && M) {
          const [S, z] = Uo({
            nodeId: E,
            dragItems: a,
            nodeLookup: H,
            dragging: !1
          });
          o == null || o(B.sourceEvent, a, S, z), $ == null || $(B.sourceEvent, S, z), E || M == null || M(B.sourceEvent, z);
        }
      }
    }).filter((B) => {
      const H = B.target;
      return !B.button && (!_ || !ca(H, `.${_}`, w)) && (!y || ca(H, y, w));
    });
    h.call(L);
  }
  function m() {
    h == null || h.on(".drag", null);
  }
  return {
    update: b,
    destroy: m
  };
}
function yb(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Rr(o, Tn(i)) > 0 && r.push(i);
  return r;
}
const wb = 250;
function bb(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = yb(e, n, t + wb);
  for (const c of s) {
    const d = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of d) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: h, y: p } = It(c, f, f.position, !0), g = Math.sqrt(Math.pow(h - e.x, 2) + Math.pow(p - e.y, 2));
      g > t || (g < i ? (o = [{ ...f, x: h, y: p }], i = g) : g === i && o.push({ ...f, x: h, y: p }));
    }
  }
  if (!o.length)
    return null;
  if (o.length > 1) {
    const c = r.type === "source" ? "target" : "source";
    return o.find((d) => d.type === c) ?? o[0];
  }
  return o[0];
}
function Lc(e, t, n, r, o, i = !1) {
  var c, d, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((h) => h.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...It(s, l, l.position, !0) } : l;
}
function zc(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function vb(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Oc = () => !0;
function xb(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: f, panBy: h, cancelConnection: p, onConnectStart: g, onConnect: v, onConnectEnd: b, isValidConnection: m = Oc, onReconnectEnd: _, updateConnection: y, getTransform: w, getFromHandle: N, autoPanSpeed: E, dragThreshold: C = 1, handleDomNode: T }) {
  const A = _c(e.target);
  let O = 0, L;
  const { x: B, y: H } = Be(e), x = zc(i, T), $ = a == null ? void 0 : a.getBoundingClientRect();
  let M = !1;
  if (!$ || !x)
    return;
  const S = Lc(o, x, r, l, t);
  if (!S)
    return;
  let z = Be(e, $), I = !1, D = null, P = !1, V = null;
  function X() {
    if (!d || !$)
      return;
    const [K, Z] = Ui(z, $, E);
    h({ x: K, y: Z }), O = requestAnimationFrame(X);
  }
  const F = {
    ...S,
    nodeId: o,
    type: x,
    position: S.position
  }, Q = l.get(o);
  let ee = {
    inProgress: !0,
    isValid: null,
    from: It(Q, F, U.Left, !0),
    fromHandle: F,
    fromPosition: F.position,
    fromNode: Q,
    to: z,
    toHandle: null,
    toPosition: Zs[F.position],
    toNode: null,
    pointer: z
  };
  function W() {
    M = !0, y(ee), g == null || g(e, { nodeId: o, handleId: r, handleType: x });
  }
  C === 0 && W();
  function j(K) {
    if (!M) {
      const { x: ue, y: _e } = Be(K), Ae = ue - B, ke = _e - H;
      if (!(Ae * Ae + ke * ke > C * C))
        return;
      W();
    }
    if (!N() || !F) {
      q(K);
      return;
    }
    const Z = w();
    z = Be(K, $), L = bb(Vn(z, Z, !1, [1, 1]), n, l, F), I || (X(), I = !0);
    const te = Pc(K, {
      handle: L,
      connectionMode: t,
      fromNodeId: o,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: A,
      lib: c,
      flowId: f,
      nodeLookup: l
    });
    V = te.handleDomNode, D = te.connection, P = vb(!!L, te.isValid);
    const ne = l.get(o), re = ne ? It(ne, F, U.Left, !0) : ee.from, se = {
      ...ee,
      from: re,
      isValid: P,
      to: te.toHandle && P ? Kt({ x: te.toHandle.x, y: te.toHandle.y }, Z) : z,
      toHandle: te.toHandle,
      toPosition: P && te.toHandle ? te.toHandle.position : Zs[F.position],
      toNode: te.toHandle ? l.get(te.toHandle.nodeId) : null,
      pointer: z
    };
    y(se), ee = se;
  }
  function q(K) {
    if (!("touches" in K && K.touches.length > 0)) {
      if (M) {
        (L || V) && D && P && (v == null || v(D));
        const { inProgress: Z, ...te } = ee, ne = {
          ...te,
          toPosition: ee.toHandle ? ee.toPosition : null
        };
        b == null || b(K, ne), i && (_ == null || _(K, ne));
      }
      p(), cancelAnimationFrame(O), I = !1, P = !1, D = null, V = null, A.removeEventListener("mousemove", j), A.removeEventListener("mouseup", q), A.removeEventListener("touchmove", j), A.removeEventListener("touchend", q);
    }
  }
  A.addEventListener("mousemove", j), A.addEventListener("mouseup", q), A.addEventListener("touchmove", j), A.addEventListener("touchend", q);
}
function Pc(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Oc, nodeLookup: d }) {
  const f = i === "target", h = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: p, y: g } = Be(e), v = s.elementFromPoint(p, g), b = v != null && v.classList.contains(`${a}-flow__handle`) ? v : h, m = {
    handleDomNode: b,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (b) {
    const _ = zc(void 0, b), y = b.getAttribute("data-nodeid"), w = b.getAttribute("data-handleid"), N = b.classList.contains("connectable"), E = b.classList.contains("connectableend");
    if (!y || !_)
      return m;
    const C = {
      source: f ? y : r,
      sourceHandle: f ? w : o,
      target: f ? r : y,
      targetHandle: f ? o : w
    };
    m.connection = C;
    const A = N && E && (n === Xt.Strict ? f && _ === "source" || !f && _ === "target" : y !== r || w !== o);
    m.isValid = A && c(C), m.toHandle = Lc(y, _, w, d, n, !0);
  }
  return m;
}
const bi = {
  onPointerDown: xb,
  isValid: Pc
};
function _b({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Ce(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: f = !0, zoomable: h = !0, inversePan: p = !1 }) {
    const g = (y) => {
      if (y.sourceEvent.type !== "wheel" || !t)
        return;
      const w = n(), N = y.sourceEvent.ctrlKey && Ln() ? 10 : 1, E = -y.sourceEvent.deltaY * (y.sourceEvent.deltaMode === 1 ? 0.05 : y.sourceEvent.deltaMode ? 1 : 2e-3) * d, C = w[2] * Math.pow(2, E * N);
      t.scaleTo(C);
    };
    let v = [0, 0];
    const b = (y) => {
      (y.sourceEvent.type === "mousedown" || y.sourceEvent.type === "touchstart") && (v = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ]);
    }, m = (y) => {
      const w = n();
      if (y.sourceEvent.type !== "mousemove" && y.sourceEvent.type !== "touchmove" || !t)
        return;
      const N = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ], E = [N[0] - v[0], N[1] - v[1]];
      v = N;
      const C = r() * Math.max(w[2], Math.log(w[2])) * (p ? -1 : 1), T = {
        x: w[0] - E[0] * C,
        y: w[1] - E[1] * C
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: T.x,
        y: T.y,
        zoom: w[2]
      }, A, a);
    }, _ = cc().on("start", b).on("zoom", f ? m : null).on("zoom.wheel", h ? g : null);
    o.call(_, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: Re
  };
}
const to = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), qo = ({ x: e, y: t, zoom: n }) => Zr.translate(e, t).scale(n), ut = (e, t) => e.target.closest(`.${t}`), Dc = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), kb = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Ko = (e, t = 0, n = kb, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Rc = (e) => {
  const t = e.ctrlKey && Ln() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Eb({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (ut(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const b = Re(d), m = Rc(d), _ = f * Math.pow(2, m);
      r.scaleTo(n, _, b, d);
      return;
    }
    const h = d.deltaMode === 1 ? 20 : 1;
    let p = o === St.Vertical ? 0 : d.deltaX * h, g = o === St.Horizontal ? 0 : d.deltaY * h;
    !Ln() && d.shiftKey && o !== St.Vertical && (p = d.deltaY * h, g = 0), r.translateBy(
      n,
      -(p / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = to(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, v) : (e.isPanScrolling = !0, a == null || a(d, v)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function Sb({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = ut(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function Nb({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = to(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function Cb({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Dc(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, to(i.transform)));
  };
}
function Mb({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Dc(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = to(s.transform);
      e.prevViewport = l, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          o == null || o(s.sourceEvent, l);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function $b({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: f }) {
  return (h) => {
    var m;
    const p = t || n, g = r && h.ctrlKey, v = h.type === "wheel";
    if (h.button === 1 && h.type === "mousedown" && (ut(h, `${d}-flow__node`) || ut(h, `${d}-flow__edge`) || ut(h, `${d}-flow__selection`) || ut(h, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !p && !i && !s && !r || a || f && !v || ut(h, l) && v || ut(h, c) && (!v || i && v && !t) || !r && h.ctrlKey && v)
      return !1;
    if (!r && h.type === "touchstart" && ((m = h.touches) == null ? void 0 : m.length) > 1)
      return h.preventDefault(), !1;
    if (!p && !i && !g && v || !o && (h.type === "mousedown" || h.type === "touchstart") || Array.isArray(o) && !o.includes(h.button) && h.type === "mousedown")
      return !1;
    const b = Array.isArray(o) && o.includes(h.button) || !h.button || h.button <= 1;
    return (!h.ctrlKey || v || e) && b;
  };
}
function Ib({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
  const c = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, d = e.getBoundingClientRect();
  let f = [
    [0, 0],
    [d.width, d.height]
  ];
  const h = typeof ResizeObserver < "u" ? new ResizeObserver((H) => {
    const x = H[0];
    x && (f = [
      [0, 0],
      [x.contentRect.width, x.contentRect.height]
    ]);
  }) : null;
  h == null || h.observe(e);
  const p = cc().extent(() => f).scaleExtent([t, n]).translateExtent(r), g = Ce(e).call(p);
  w({
    x: o.x,
    y: o.y,
    zoom: qt(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const v = g.on("wheel.zoom"), b = g.on("dblclick.zoom");
  p.wheelDelta(Rc);
  async function m(H, x) {
    return g ? new Promise(($) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? kn : vr).transform(Ko(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => $(!0)), H);
    }) : !1;
  }
  function _({ noWheelClassName: H, noPanClassName: x, onPaneContextMenu: $, userSelectionActive: M, panOnScroll: S, panOnDrag: z, panOnScrollMode: I, panOnScrollSpeed: D, preventScrolling: P, zoomOnPinch: V, zoomOnScroll: X, zoomOnDoubleClick: F, panActivationKeyPressed: Q = !1, zoomActivationKeyPressed: G, lib: ee, onTransformChange: W, connectionInProgress: j, paneClickDistance: q, selectionOnDrag: K }) {
    M && !c.isZoomingOrPanning && y();
    const Z = S && !G && !M;
    p.clickDistance(K ? 1 / 0 : !We(q) || q < 0 ? 0 : q);
    const te = Z ? Eb({
      zoomPanValues: c,
      noWheelClassName: H,
      d3Selection: g,
      d3Zoom: p,
      panOnScrollMode: I,
      panOnScrollSpeed: D,
      zoomOnPinch: V,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : Sb({
      noWheelClassName: H,
      preventScrolling: P,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", te, { passive: !1 });
    const ne = Nb({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    p.on("start", ne);
    const re = Cb({
      zoomPanValues: c,
      panOnDrag: z,
      onPaneContextMenu: !!$,
      onPanZoom: i,
      onTransformChange: W
    });
    p.on("zoom", re);
    const se = Mb({
      zoomPanValues: c,
      panOnDrag: z,
      panOnScroll: S,
      onPaneContextMenu: $,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    p.on("end", se);
    const ue = $b({
      panActivationKeyPressed: Q,
      zoomActivationKeyPressed: G,
      panOnDrag: z,
      zoomOnScroll: X,
      panOnScroll: S,
      zoomOnDoubleClick: F,
      zoomOnPinch: V,
      userSelectionActive: M,
      noPanClassName: x,
      noWheelClassName: H,
      lib: ee,
      connectionInProgress: j
    });
    p.filter(ue), F ? g.on("dblclick.zoom", b) : g.on("dblclick.zoom", null);
  }
  function y() {
    p.on("zoom", null);
  }
  async function w(H, x, $) {
    const M = qo(H), S = p == null ? void 0 : p.constrain()(M, x, $);
    return S && await m(S), S;
  }
  async function N(H, x) {
    const $ = qo(H);
    return await m($, x), $;
  }
  function E(H) {
    if (g) {
      const x = qo(H), $ = g.property("__zoom");
      ($.k !== H.zoom || $.x !== H.x || $.y !== H.y) && (p == null || p.transform(g, x, null, { sync: !0 }));
    }
  }
  function C() {
    const H = g ? lc(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: H.x, y: H.y, zoom: H.k };
  }
  async function T(H, x) {
    return g ? new Promise(($) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? kn : vr).scaleTo(Ko(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => $(!0)), H);
    }) : !1;
  }
  async function A(H, x) {
    return g ? new Promise(($) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? kn : vr).scaleBy(Ko(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => $(!0)), H);
    }) : !1;
  }
  function O(H) {
    p == null || p.scaleExtent(H);
  }
  function L(H) {
    p == null || p.translateExtent(H);
  }
  function B(H) {
    const x = !We(H) || H < 0 ? 0 : H;
    p == null || p.clickDistance(x);
  }
  return {
    update: _,
    destroy: y,
    setViewport: N,
    setViewportConstrained: w,
    getViewport: C,
    scaleTo: T,
    scaleBy: A,
    setScaleExtent: O,
    setTranslateExtent: L,
    syncViewport: E,
    setClickDistance: B
  };
}
var Zt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Zt || (Zt = {}));
function Ab({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function da(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function lt(e, t) {
  return Math.max(0, t - e);
}
function ct(e, t) {
  return Math.max(0, e - t);
}
function fr(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function ua(e, t) {
  return e ? !t : t;
}
function Tb(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: f } = t, h = d && f, { xSnapped: p, ySnapped: g } = n, { minWidth: v, maxWidth: b, minHeight: m, maxHeight: _ } = r, { x: y, y: w, width: N, height: E, aspectRatio: C } = e;
  let T = Math.floor(d ? p - e.pointerX : 0), A = Math.floor(f ? g - e.pointerY : 0);
  const O = N + (l ? -T : T), L = E + (c ? -A : A), B = -i[0] * N, H = -i[1] * E;
  let x = fr(O, v, b), $ = fr(L, m, _);
  if (s) {
    let z = 0, I = 0;
    l && T < 0 ? z = lt(y + T + B, s[0][0]) : !l && T > 0 && (z = ct(y + O + B, s[1][0])), c && A < 0 ? I = lt(w + A + H, s[0][1]) : !c && A > 0 && (I = ct(w + L + H, s[1][1])), x = Math.max(x, z), $ = Math.max($, I);
  }
  if (a) {
    let z = 0, I = 0;
    l && T > 0 ? z = ct(y + T, a[0][0]) : !l && T < 0 && (z = lt(y + O, a[1][0])), c && A > 0 ? I = ct(w + A, a[0][1]) : !c && A < 0 && (I = lt(w + L, a[1][1])), x = Math.max(x, z), $ = Math.max($, I);
  }
  if (o) {
    if (d) {
      const z = fr(O / C, m, _) * C;
      if (x = Math.max(x, z), s) {
        let I = 0;
        !l && !c || l && !c && h ? I = ct(w + H + O / C, s[1][1]) * C : I = lt(w + H + (l ? T : -T) / C, s[0][1]) * C, x = Math.max(x, I);
      }
      if (a) {
        let I = 0;
        !l && !c || l && !c && h ? I = lt(w + O / C, a[1][1]) * C : I = ct(w + (l ? T : -T) / C, a[0][1]) * C, x = Math.max(x, I);
      }
    }
    if (f) {
      const z = fr(L * C, v, b) / C;
      if ($ = Math.max($, z), s) {
        let I = 0;
        !l && !c || c && !l && h ? I = ct(y + L * C + B, s[1][0]) / C : I = lt(y + (c ? A : -A) * C + B, s[0][0]) / C, $ = Math.max($, I);
      }
      if (a) {
        let I = 0;
        !l && !c || c && !l && h ? I = lt(y + L * C, a[1][0]) / C : I = ct(y + (c ? A : -A) * C, a[0][0]) / C, $ = Math.max($, I);
      }
    }
  }
  A = A + (A < 0 ? $ : -$), T = T + (T < 0 ? x : -x), o && (h ? O > L * C ? A = (ua(l, c) ? -T : T) / C : T = (ua(l, c) ? -A : A) * C : d ? (A = T / C, c = l) : (T = A * C, l = c));
  const M = l ? y + T : y, S = c ? w + A : w;
  return {
    width: N + (l ? -T : T),
    height: E + (c ? -A : A),
    x: i[0] * T * (l ? -1 : 1) + M,
    y: i[1] * A * (c ? -1 : 1) + S
  };
}
const Hc = { width: 0, height: 0, x: 0, y: 0 }, Lb = {
  ...Hc,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function zb(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function Ob({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Ce(e);
  let s = {
    controlDirection: da("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: f, resizeDirection: h, onResizeStart: p, onResize: g, onResizeEnd: v, shouldResize: b }) {
    let m = { ...Hc }, _ = { ...Lb };
    s = {
      boundaries: d,
      resizeDirection: h,
      keepAspectRatio: f,
      controlDirection: da(c)
    };
    let y, w = null, N = [], E, C, T;
    const A = Ul().on("start", (O) => {
      const { nodeLookup: L, transform: B, snapGrid: H, snapToGrid: x, nodeOrigin: $, paneDomNode: M } = n();
      if (y = L.get(t), !y)
        return;
      w = (M == null ? void 0 : M.getBoundingClientRect()) ?? null;
      const { xSnapped: S, ySnapped: z } = En(O.sourceEvent, {
        transform: B,
        snapGrid: H,
        snapToGrid: x,
        containerBounds: w
      });
      m = {
        width: y.measured.width ?? 0,
        height: y.measured.height ?? 0,
        x: y.position.x ?? 0,
        y: y.position.y ?? 0
      }, _ = {
        ...m,
        pointerX: S,
        pointerY: z,
        aspectRatio: m.width / m.height
      }, E = void 0, C = $t(y.extent) ? y.extent : void 0, y.parentId && (y.extent === "parent" || y.expandParent) && (E = L.get(y.parentId)), E && y.extent === "parent" && (C = [
        [0, 0],
        [E.measured.width, E.measured.height]
      ]), N = [], T = void 0;
      for (const [I, D] of L)
        if (D.parentId === t && (N.push({
          id: I,
          position: { ...D.position },
          extent: D.extent
        }), D.extent === "parent" || D.expandParent)) {
          const P = zb(D, y, D.origin ?? $);
          T ? T = [
            [Math.min(P[0][0], T[0][0]), Math.min(P[0][1], T[0][1])],
            [Math.max(P[1][0], T[1][0]), Math.max(P[1][1], T[1][1])]
          ] : T = P;
        }
      p == null || p(O, { ...m });
    }).on("drag", (O) => {
      const { transform: L, snapGrid: B, snapToGrid: H, nodeOrigin: x } = n(), $ = En(O.sourceEvent, {
        transform: L,
        snapGrid: B,
        snapToGrid: H,
        containerBounds: w
      }), M = [];
      if (!y)
        return;
      const { x: S, y: z, width: I, height: D } = m, P = {}, V = y.origin ?? x, { width: X, height: F, x: Q, y: G } = Tb(_, s.controlDirection, $, s.boundaries, s.keepAspectRatio, V, C, T), ee = X !== I, W = F !== D, j = Q !== S && ee, q = G !== z && W;
      if (!j && !q && !ee && !W)
        return;
      const K = {
        prevValues: { ...m },
        startX: _.x,
        startY: _.y,
        childNodes: N.map((re) => ({
          ...re,
          position: { ...re.position }
        }))
      };
      if ((j || q || V[0] === 1 || V[1] === 1) && (P.x = j ? Q : m.x, P.y = q ? G : m.y, m.x = P.x, m.y = P.y, N.length > 0)) {
        const re = Q - S, se = G - z;
        for (const ue of N)
          ue.position = {
            x: ue.position.x - re + V[0] * (X - I),
            y: ue.position.y - se + V[1] * (F - D)
          }, M.push(ue);
      }
      if ((ee || W) && (P.width = ee && (!s.resizeDirection || s.resizeDirection === "horizontal") ? X : m.width, P.height = W && (!s.resizeDirection || s.resizeDirection === "vertical") ? F : m.height, m.width = P.width, m.height = P.height), E && y.expandParent) {
        const re = V[0] * (P.width ?? 0);
        P.x && P.x < re && (m.x = re, _.x = _.x - (P.x - re));
        const se = V[1] * (P.height ?? 0);
        P.y && P.y < se && (m.y = se, _.y = _.y - (P.y - se));
      }
      const Z = Ab({
        width: m.width,
        prevWidth: I,
        height: m.height,
        prevHeight: D,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), te = { ...m, direction: Z };
      if ((b == null ? void 0 : b(O, te)) === !1) {
        m = K.prevValues, _.x = K.startX, _.y = K.startY, N.forEach((re, se) => {
          re.position = K.childNodes[se].position;
        });
        return;
      }
      g == null || g(O, te), r(P, M);
    }).on("end", (O) => {
      v == null || v(O, { ...m }), o == null || o({ ...m });
    });
    i.call(A);
  }
  function l() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: l
  };
}
var Wc = { exports: {} }, Bc = {}, Vc = { exports: {} }, Fc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qt = Ii;
function Pb(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Db = typeof Object.is == "function" ? Object.is : Pb, Rb = Qt.useState, Hb = Qt.useEffect, Wb = Qt.useLayoutEffect, Bb = Qt.useDebugValue;
function Vb(e, t) {
  var n = t(), r = Rb({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Wb(
    function() {
      o.value = n, o.getSnapshot = t, Zo(o) && i({ inst: o });
    },
    [e, n, t]
  ), Hb(
    function() {
      return Zo(o) && i({ inst: o }), e(function() {
        Zo(o) && i({ inst: o });
      });
    },
    [e]
  ), Bb(n), n;
}
function Zo(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Db(e, n);
  } catch {
    return !0;
  }
}
function Fb(e, t) {
  return t();
}
var jb = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Fb : Vb;
Fc.useSyncExternalStore = Qt.useSyncExternalStore !== void 0 ? Qt.useSyncExternalStore : jb;
Vc.exports = Fc;
var Yb = Vc.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var no = Ii, Gb = Yb;
function Xb(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Ub = typeof Object.is == "function" ? Object.is : Xb, qb = Gb.useSyncExternalStore, Kb = no.useRef, Zb = no.useEffect, Qb = no.useMemo, Jb = no.useDebugValue;
Bc.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = Kb(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = Qb(
    function() {
      function l(p) {
        if (!c) {
          if (c = !0, d = p, p = r(p), o !== void 0 && s.hasValue) {
            var g = s.value;
            if (o(g, p))
              return f = g;
          }
          return f = p;
        }
        if (g = f, Ub(d, p)) return g;
        var v = r(p);
        return o !== void 0 && o(g, v) ? (d = p, g) : (d = p, f = v);
      }
      var c = !1, d, f, h = n === void 0 ? null : n;
      return [
        function() {
          return l(t());
        },
        h === null ? void 0 : function() {
          return l(h());
        }
      ];
    },
    [t, n, r, o]
  );
  var a = qb(e, i[0], i[1]);
  return Zb(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), Jb(a), a;
};
Wc.exports = Bc;
var ev = Wc.exports;
const tv = /* @__PURE__ */ al(ev), nv = {}, fa = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, f) => {
    const h = typeof d == "function" ? d(t) : d;
    if (!Object.is(h, t)) {
      const p = t;
      t = f ?? (typeof h != "object" || h === null) ? h : Object.assign({}, t, h), n.forEach((g) => g(t, p));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (nv ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, rv = (e) => e ? fa(e) : fa, { useDebugValue: ov } = Ii, { useSyncExternalStoreWithSelector: iv } = tv, sv = (e) => e;
function jc(e, t = sv, n) {
  const r = iv(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return ov(r), r;
}
const ha = (e, t) => {
  const n = rv(e), r = (o, i = t) => jc(n, o, i);
  return Object.assign(r, n), r;
}, av = (e, t) => e ? ha(e, t) : ha;
function ge(e, t) {
  if (Object.is(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  if (e instanceof Map && t instanceof Map) {
    if (e.size !== t.size) return !1;
    for (const [r, o] of e)
      if (!Object.is(o, t.get(r)))
        return !1;
    return !0;
  }
  if (e instanceof Set && t instanceof Set) {
    if (e.size !== t.size) return !1;
    for (const r of e)
      if (!t.has(r))
        return !1;
    return !0;
  }
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length)
    return !1;
  for (const r of n)
    if (!Object.prototype.hasOwnProperty.call(t, r) || !Object.is(e[r], t[r]))
      return !1;
  return !0;
}
const ro = Fr(null), lv = ro.Provider, Yc = Ve.error001("react");
function ae(e, t) {
  const n = Jt(ro);
  if (n === null)
    throw new Error(Yc);
  return jc(n, e, t);
}
function fe() {
  const e = Jt(ro);
  if (e === null)
    throw new Error(Yc);
  return le(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const pa = { display: "none" }, cv = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Gc = "react-flow__node-desc", Xc = "react-flow__edge-desc", dv = "react-flow__aria-live", uv = (e) => e.ariaLiveMessage, fv = (e) => e.ariaLabelConfig;
function hv({ rfId: e }) {
  const t = ae(uv);
  return u("div", { id: `${dv}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: cv, children: t });
}
function pv({ rfId: e, disableKeyboardA11y: t }) {
  const n = ae(fv);
  return k(me, { children: [u("div", { id: `${Gc}-${e}`, style: pa, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), u("div", { id: `${Xc}-${e}`, style: pa, children: n["edge.a11yDescription.default"] }), !t && u(hv, { rfId: e })] });
}
const At = Ka(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return u("div", { className: be(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
At.displayName = "Panel";
const ga = "https://reactflow.dev?utm_source=attribution";
function gv({ proOptions: e, position: t = "bottom-right" }) {
  return ce(() => {
  }, []), e != null && e.hideAttribution ? null : u(At, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${ga}`, children: u("a", { href: ga, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const mv = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, hr = (e) => e.id;
function yv(e, t) {
  return ge(e.selectedNodes.map(hr), t.selectedNodes.map(hr)) && ge(e.selectedEdges.map(hr), t.selectedEdges.map(hr));
}
function wv({ onSelectionChange: e }) {
  const t = fe(), { selectedNodes: n, selectedEdges: r } = ae(mv, yv);
  return ce(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const bv = (e) => !!e.onSelectionChangeHandlers;
function vv({ onSelectionChange: e }) {
  const t = ae(bv);
  return e || t ? u(wv, { onSelectionChange: e }) : null;
}
const Uc = [0, 0], xv = { x: 0, y: 0, zoom: 1 }, _v = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], ma = [..._v, "rfId"], kv = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), ya = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: In,
  nodeOrigin: Uc,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Ev(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = ae(kv, ge), c = fe();
  ce(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = ya, a();
  }), []);
  const d = oe(ya);
  return ce(
    () => {
      for (const f of ma) {
        const h = e[f], p = d.current[f];
        h !== p && (typeof e[f] > "u" || (f === "nodes" ? t(h) : f === "edges" ? n(h) : f === "minZoom" ? r(h) : f === "maxZoom" ? o(h) : f === "translateExtent" ? i(h) : f === "nodeExtent" ? s(h) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: Uw(h) }) : f === "fitView" ? c.setState({ fitViewQueued: h }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: h }) : c.setState({ [f]: h })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    ma.map((f) => e[f])
  ), null;
}
function wa() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Sv(e) {
  var r;
  const [t, n] = J(e === "system" ? null : e);
  return ce(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = wa(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = wa()) != null && r.matches ? "dark" : "light";
}
const ba = typeof document < "u" ? document : null;
function zn(e = null, t = { target: ba, actInsideInputWithModifier: !0 }) {
  const [n, r] = J(!1), o = oe(!1), i = oe(/* @__PURE__ */ new Set([])), [s, a] = le(() => {
    if (e !== null) {
      const c = (Array.isArray(e) ? e : [e]).filter((f) => typeof f == "string").map((f) => f.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), d = c.reduce((f, h) => f.concat(...h), []);
      return [c, d];
    }
    return [[], []];
  }, [e]);
  return ce(() => {
    const l = (t == null ? void 0 : t.target) ?? ba, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (p) => {
        var b, m;
        if (o.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!o.current || o.current && !c) && kc(p))
          return !1;
        const v = xa(p.code, a);
        if (i.current.add(p[v]), va(s, i.current, !1)) {
          const _ = ((m = (b = p.composedPath) == null ? void 0 : b.call(p)) == null ? void 0 : m[0]) || p.target, y = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !y) && p.preventDefault(), r(!0);
        }
      }, f = (p) => {
        const g = xa(p.code, a);
        va(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(p[g]), p.key === "Meta" && i.current.clear(), o.current = !1;
      }, h = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", h), window.addEventListener("contextmenu", h), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", h), window.removeEventListener("contextmenu", h);
      };
    }
  }, [e, r]), n;
}
function va(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function xa(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Nv = () => {
  const e = fe();
  return le(() => ({
    zoomIn: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, t) : !1;
    },
    zoomOut: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, t) : !1;
    },
    zoomTo: async (t, n) => {
      const { panZoom: r } = e.getState();
      return r ? r.scaleTo(t, n) : !1;
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      const { transform: [r, o, i], panZoom: s } = e.getState();
      return s ? (await s.setViewport({
        x: t.x ?? r,
        y: t.y ?? o,
        zoom: t.zoom ?? i
      }, n), !0) : !1;
    },
    getViewport: () => {
      const [t, n, r] = e.getState().transform;
      return { x: t, y: n, zoom: r };
    },
    setCenter: async (t, n, r) => e.getState().setCenter(t, n, r),
    fitBounds: async (t, n) => {
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = eo(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
      return a ? (await a.setViewport(l, {
        duration: n == null ? void 0 : n.duration,
        ease: n == null ? void 0 : n.ease,
        interpolate: n == null ? void 0 : n.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: r, snapGrid: o, snapToGrid: i, domNode: s } = e.getState();
      if (!s)
        return t;
      const { x: a, y: l } = s.getBoundingClientRect(), c = {
        x: t.x - a,
        y: t.y - l
      }, d = n.snapGrid ?? o, f = n.snapToGrid ?? i;
      return Vn(c, r, f, d);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = Kt(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function qc(e, t) {
  const n = [], r = /* @__PURE__ */ new Map(), o = [];
  for (const i of e)
    if (i.type === "add") {
      o.push(i);
      continue;
    } else if (i.type === "remove" || i.type === "replace")
      r.set(i.id, [i]);
    else {
      const s = r.get(i.id);
      s ? s.push(i) : r.set(i.id, [i]);
    }
  for (const i of t) {
    const s = r.get(i.id);
    if (!s) {
      n.push(i);
      continue;
    }
    if (s[0].type === "remove")
      continue;
    if (s[0].type === "replace") {
      n.push({ ...s[0].item });
      continue;
    }
    const a = { ...i };
    for (const l of s)
      Cv(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function Cv(e, t) {
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (t.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function Mv(e, t) {
  return qc(e, t);
}
function $v(e, t) {
  return qc(e, t);
}
function _t(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Vt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(_t(i.id, s)));
  }
  return r;
}
function _a({ items: e = [], lookup: t }) {
  var o;
  const n = [], r = new Map(e.map((i) => [i.id, i]));
  for (const [i, s] of e.entries()) {
    const a = t.get(s.id), l = ((o = a == null ? void 0 : a.internals) == null ? void 0 : o.userNode) ?? a;
    l !== void 0 && l !== s && n.push({ id: s.id, item: s, type: "replace" }), l === void 0 && n.push({ item: s, type: "add", index: i });
  }
  for (const [i] of t)
    r.get(i) === void 0 && n.push({ id: i, type: "remove" });
  return n;
}
function ka(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Iv = wc();
function Av(e, t, n = {}) {
  return eb(e, t, {
    ...n,
    onError: n.onError ?? Iv
  });
}
const Ea = (e) => Hw(e), Tv = (e) => hc(e);
function Kc(e) {
  return Ka(e);
}
const Zc = typeof window < "u" ? Ai : ce;
function Sa(e) {
  const [t, n] = J(BigInt(0)), [r] = J(() => Lv(() => n((o) => o + BigInt(1))));
  return Zc(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function Lv(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const Qc = Fr(null);
function zv({ children: e }) {
  const t = fe(), n = $e((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: f, nodeLookup: h, fitViewQueued: p, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = l;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let b = _a({
      items: v,
      lookup: h
    });
    for (const m of g.values())
      b = m(b);
    d && c(v), b.length > 0 ? f == null || f(b) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: _, setNodes: y } = t.getState();
      m && y(_);
    });
  }, []), r = Sa(n), o = $e((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: f, edgeLookup: h } = t.getState();
    let p = l;
    for (const g of a)
      p = typeof g == "function" ? g(p) : g;
    d ? c(p) : f && f(_a({
      items: p,
      lookup: h
    }));
  }, []), i = Sa(o), s = le(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return u(Qc.Provider, { value: s, children: e });
}
function Ov() {
  const e = Jt(Qc);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Pv = (e) => !!e.panZoom;
function oo() {
  const e = Nv(), t = fe(), n = Ov(), r = ae(Pv), o = le(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var m, _;
      const { nodeLookup: h, nodeOrigin: p } = t.getState(), g = Ea(f) ? f : h.get(f.id), v = g.parentId ? vc(g.position, g.measured, g.parentId, h, p) : g.position, b = {
        ...g,
        position: v,
        width: ((m = g.measured) == null ? void 0 : m.width) ?? g.width,
        height: ((_ = g.measured) == null ? void 0 : _.height) ?? g.height
      };
      return Tn(b);
    }, c = (f, h, p = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === f) {
          const b = typeof h == "function" ? h(v) : h;
          return p.replace && Ea(b) ? b : { ...v, ...b };
        }
        return v;
      }));
    }, d = (f, h, p = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === f) {
          const b = typeof h == "function" ? h(v) : h;
          return p.replace && Tv(b) ? b : { ...v, ...b };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((f) => ({ ...f })),
      getNode: (f) => {
        var h;
        return (h = i(f)) == null ? void 0 : h.internals.userNode;
      },
      getInternalNode: i,
      getEdges: () => {
        const { edges: f = [] } = t.getState();
        return f.map((h) => ({ ...h }));
      },
      getEdge: (f) => t.getState().edgeLookup.get(f),
      setNodes: s,
      setEdges: a,
      addNodes: (f) => {
        const h = Array.isArray(f) ? f : [f];
        n.nodeQueue.push((p) => [...p, ...h]);
      },
      addEdges: (f) => {
        const h = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((p) => [...p, ...h]);
      },
      toObject: () => {
        const { nodes: f = [], edges: h = [], transform: p } = t.getState(), [g, v, b] = p;
        return {
          nodes: f.map((m) => ({ ...m })),
          edges: h.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: v,
            zoom: b
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: h = [] }) => {
        const { nodes: p, edges: g, onNodesDelete: v, onEdgesDelete: b, triggerNodeChanges: m, triggerEdgeChanges: _, onDelete: y, onBeforeDelete: w } = t.getState(), { nodes: N, edges: E } = await jw({
          nodesToRemove: f,
          edgesToRemove: h,
          nodes: p,
          edges: g,
          onBeforeDelete: w
        }), C = E.length > 0, T = N.length > 0;
        if (C) {
          const A = E.map(ka);
          b == null || b(E), _(A);
        }
        if (T) {
          const A = N.map(ka);
          v == null || v(N), m(A);
        }
        return (T || C) && (y == null || y({ nodes: N, edges: E })), { deletedNodes: N, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, h = !0, p) => {
        const g = Js(f), v = g ? f : l(f), b = p !== void 0;
        return v ? (p || t.getState().nodes).filter((m) => {
          const _ = t.getState().nodeLookup.get(m.id);
          if (_ && !g && (m.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const y = Tn(b ? m : _), w = Rr(y, v);
          return h && w > 0 || w >= y.width * y.height || w >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, h, p = !0) => {
        const v = Js(f) ? f : l(f);
        if (!v)
          return !1;
        const b = Rr(v, h);
        return p && b > 0 || b >= h.width * h.height || b >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (f, h, p = { replace: !1 }) => {
        c(f, (g) => {
          const v = typeof h == "function" ? h(g) : h;
          return p.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, p);
      },
      updateEdge: d,
      updateEdgeData: (f, h, p = { replace: !1 }) => {
        d(f, (g) => {
          const v = typeof h == "function" ? h(g) : h;
          return p.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, p);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: h, nodeOrigin: p } = t.getState();
        return Ww(f, { nodeLookup: h, nodeOrigin: p });
      },
      getHandleConnections: ({ type: f, id: h, nodeId: p }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${p}-${f}${h ? `-${h}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      getNodeConnections: ({ type: f, handleId: h, nodeId: p }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${p}${f ? h ? `-${f}-${h}` : `-${f}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      fitView: async (f) => {
        const h = t.getState().fitViewResolver ?? Xw();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: h }), n.nodeQueue.push((p) => [...p]), h.promise;
      }
    };
  }, []);
  return le(() => ({
    ...o,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const Na = (e) => e.selected, Dv = typeof window < "u" ? window : void 0;
function Rv({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = fe(), { deleteElements: r } = oo(), o = zn(e, { actInsideInputWithModifier: !1 }), i = zn(t, { target: Dv });
  ce(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(Na), edges: s.filter(Na) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), ce(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Hv(e) {
  const t = fe();
  ce(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = qi(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", Ve.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const r = new ResizeObserver(() => n());
      return r.observe(e.current), () => {
        window.removeEventListener("resize", n), r && e.current && r.unobserve(e.current);
      };
    }
  }, []);
}
const io = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Wv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Bv({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = St.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: f, maxZoom: h, zoomActivationKeyCode: p, preventScrolling: g = !0, children: v, noWheelClassName: b, noPanClassName: m, onViewportChange: _, isControlledViewport: y, paneClickDistance: w, selectionOnDrag: N }) {
  const E = fe(), C = oe(null), { userSelectionActive: T, lib: A, connectionInProgress: O } = ae(Wv, ge), L = zn(p), B = oe();
  Hv(C);
  const H = $e((x) => {
    _ == null || _({ x: x[0], y: x[1], zoom: x[2] }), y || E.setState({ transform: x });
  }, [_, y]);
  return ce(() => {
    if (C.current) {
      B.current = Ib({
        domNode: C.current,
        minZoom: f,
        maxZoom: h,
        translateExtent: d,
        viewport: c,
        onDraggingChange: (S) => E.setState((z) => z.paneDragging === S ? z : { paneDragging: S }),
        onPanZoomStart: (S, z) => {
          const { onViewportChangeStart: I, onMoveStart: D } = E.getState();
          D == null || D(S, z), I == null || I(z);
        },
        onPanZoom: (S, z) => {
          const { onViewportChange: I, onMove: D } = E.getState();
          D == null || D(S, z), I == null || I(z);
        },
        onPanZoomEnd: (S, z) => {
          const { onViewportChangeEnd: I, onMoveEnd: D } = E.getState();
          D == null || D(S, z), I == null || I(z);
        }
      });
      const { x, y: $, zoom: M } = B.current.getViewport();
      return E.setState({
        panZoom: B.current,
        transform: [x, $, M],
        domNode: C.current.closest(".react-flow")
      }), () => {
        var S;
        (S = B.current) == null || S.destroy();
      };
    }
  }, []), ce(() => {
    var x;
    (x = B.current) == null || x.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: r,
      panActivationKeyPressed: o,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: l,
      zoomActivationKeyPressed: L,
      preventScrolling: g,
      noPanClassName: m,
      userSelectionActive: T,
      noWheelClassName: b,
      lib: A,
      onTransformChange: H,
      connectionInProgress: O,
      selectionOnDrag: N,
      paneClickDistance: w
    });
  }, [
    e,
    t,
    n,
    r,
    o,
    i,
    s,
    a,
    l,
    L,
    g,
    m,
    T,
    b,
    A,
    H,
    O,
    N,
    w
  ]), u("div", { className: "react-flow__renderer", ref: C, style: io, children: v });
}
const Vv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Fv() {
  const { userSelectionActive: e, userSelectionRect: t } = ae(Vv, ge);
  return e && t ? u("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Qo = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, jv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Yv({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = An.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: f, onPaneMouseEnter: h, onPaneMouseMove: p, onPaneMouseLeave: g, children: v }) {
  const b = oe(0), m = fe(), { userSelectionActive: _, elementsSelectable: y, dragging: w, panBy: N, autoPanSpeed: E } = ae(jv, ge), C = y && (e || _), T = oe(null), A = oe(), O = oe(/* @__PURE__ */ new Set()), L = oe(/* @__PURE__ */ new Set()), B = oe(!1), H = oe(!1), x = oe({ x: 0, y: 0 }), $ = oe(!1), M = (W) => {
    if (H.current || B.current || m.getState().connection.inProgress) {
      H.current = !1, B.current = !1;
      return;
    }
    c == null || c(W), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, S = (W) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      W.preventDefault();
      return;
    }
    d == null || d(W);
  }, z = f ? (W) => f(W) : void 0, I = (W) => {
    H.current && (W.stopPropagation(), H.current = !1);
  }, D = (W) => {
    var ue, _e;
    if (W.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: j, transform: q } = m.getState();
    if (A.current = j == null ? void 0 : j.getBoundingClientRect(), !A.current)
      return;
    const K = W.target === T.current;
    if (!K && !!W.target.closest(".nokey") || !e || !(s && K || t) || W.button !== 0 || !W.isPrimary)
      return;
    (_e = (ue = W.target) == null ? void 0 : ue.setPointerCapture) == null || _e.call(ue, W.pointerId), H.current = !1;
    const { x: ne, y: re } = Be(W.nativeEvent, A.current), se = Vn({ x: ne, y: re }, q);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: se.x,
        startY: se.y,
        x: ne,
        y: re
      }
    }), K || (W.stopPropagation(), W.preventDefault());
  };
  function P(W, j) {
    const { userSelectionRect: q } = m.getState();
    if (!q)
      return;
    const { transform: K, nodeLookup: Z, edgeLookup: te, connectionLookup: ne, triggerNodeChanges: re, triggerEdgeChanges: se, defaultEdgeOptions: ue } = m.getState(), _e = { x: q.startX, y: q.startY }, { x: Ae, y: ke } = Kt(_e, K), ze = {
      startX: _e.x,
      startY: _e.y,
      x: W < Ae ? W : Ae,
      y: j < ke ? j : ke,
      width: Math.abs(W - Ae),
      height: Math.abs(j - ke)
    }, Ge = O.current, Je = L.current;
    O.current = new Set(Xi(Z, ze, K, n === An.Partial, !0).map((Se) => Se.id)), L.current = /* @__PURE__ */ new Set();
    const Xe = (ue == null ? void 0 : ue.selectable) ?? !0;
    for (const Se of O.current) {
      const Te = ne.get(Se);
      if (Te)
        for (const { edgeId: Oe } of Te.values()) {
          const Ue = te.get(Oe);
          Ue && (Ue.selectable ?? Xe) && L.current.add(Oe);
        }
    }
    if (!ea(Ge, O.current)) {
      const Se = Vt(Z, O.current, !0);
      re(Se);
    }
    if (!ea(Je, L.current)) {
      const Se = Vt(te, L.current);
      se(Se);
    }
    m.setState({
      userSelectionRect: ze,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function V() {
    if (!o || !A.current)
      return;
    const [W, j] = Ui(x.current, A.current, E);
    N({ x: W, y: j }).then((q) => {
      if (!H.current || !q) {
        b.current = requestAnimationFrame(V);
        return;
      }
      const { x: K, y: Z } = x.current;
      P(K, Z), b.current = requestAnimationFrame(V);
    });
  }
  const X = () => {
    cancelAnimationFrame(b.current), b.current = 0, $.current = !1;
  };
  ce(() => () => X(), []);
  const F = (W) => {
    const { userSelectionRect: j, transform: q, resetSelectedElements: K } = m.getState();
    if (!A.current || !j)
      return;
    const { x: Z, y: te } = Be(W.nativeEvent, A.current);
    x.current = { x: Z, y: te };
    const ne = Kt({ x: j.startX, y: j.startY }, q);
    if (!H.current) {
      const re = t ? 0 : i;
      if (Math.hypot(Z - ne.x, te - ne.y) <= re)
        return;
      K(), a == null || a(W);
    }
    H.current = !0, $.current || (V(), $.current = !0), P(Z, te);
  }, Q = (W) => {
    var j, q;
    if (!C) {
      W.target === T.current && m.getState().connection.inProgress && (B.current = !0);
      return;
    }
    W.button === 0 && ((q = (j = W.target) == null ? void 0 : j.releasePointerCapture) == null || q.call(j, W.pointerId), !_ && W.target === T.current && m.getState().userSelectionRect && (M == null || M(W)), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), H.current && (l == null || l(W), m.setState({
      nodesSelectionActive: O.current.size > 0
    })), X());
  }, G = (W) => {
    var j, q;
    (q = (j = W.target) == null ? void 0 : j.releasePointerCapture) == null || q.call(j, W.pointerId), X();
  }, ee = r === !0 || Array.isArray(r) && r.includes(0);
  return k("div", { className: be(["react-flow__pane", { draggable: ee, dragging: w, selection: e }]), onClick: C ? void 0 : Qo(M, T), onContextMenu: Qo(S, T), onWheel: Qo(z, T), onPointerEnter: C ? void 0 : h, onPointerMove: C ? F : p, onPointerUp: Q, onPointerCancel: C ? G : void 0, onPointerDownCapture: C ? D : void 0, onClickCapture: C ? I : void 0, onPointerLeave: g, ref: T, style: io, children: [v, u(Fv, {})] });
}
function vi({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", Ve.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var d;
    return (d = r == null ? void 0 : r.current) == null ? void 0 : d.blur();
  })) : o([e]);
}
function Jc({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = fe(), [l, c] = J(!1), d = oe();
  return ce(() => {
    if (!t)
      return d.current = mb({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          vi({
            id: f,
            store: a,
            nodeRef: e
          });
        },
        onDragStart: () => {
          c(!0);
        },
        onDragStop: () => {
          c(!1);
        }
      }), () => {
        var f;
        (f = d.current) == null || f.destroy(), d.current = void 0;
      };
  }, [t, a, e]), ce(() => {
    t || !e.current || !d.current || d.current.update({
      noDragClassName: n,
      handleSelector: r,
      domNode: e.current,
      isSelectable: i,
      nodeId: o,
      nodeClickDistance: s
    });
  }, [n, r, t, i, e, o, s]), l;
}
const Gv = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function ed() {
  const e = fe();
  return $e((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), f = /* @__PURE__ */ new Map(), h = Gv(s), p = o ? i[0] : 5, g = o ? i[1] : 5, v = n.direction.x * p * n.factor, b = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!h(m))
        continue;
      let _ = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + b
      };
      o && (_ = Bn(_, i));
      const { position: y, positionAbsolute: w } = pc({
        nodeId: m.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: d,
        onError: a
      });
      m.position = y, m.internals.positionAbsolute = w, f.set(m.id, m);
    }
    l(f);
  }, []);
}
const ts = Fr(null), Xv = ts.Provider;
ts.Consumer;
const td = () => Jt(ts), Uv = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), nd = Fr(null);
function qv({ children: e }) {
  const t = ae(Uv, ge);
  return u(nd.Provider, { value: t, children: e });
}
function Kv() {
  const e = Jt(nd);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Zv = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, Qv = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Zv;
  const d = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: d,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === Xt.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: d && c
  };
};
function Jv({ type: e = "source", position: t = U.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: f, ...h }, p) {
  var $, M;
  const g = s || null, v = e === "target", b = fe(), m = td(), { connectOnClick: _, noPanClassName: y, rfId: w } = Kv(), { connectingFrom: N, connectingTo: E, clickConnecting: C, isPossibleEndHandle: T, connectionInProcess: A, clickConnectionInProcess: O, valid: L } = ae(Qv(m, g, e), ge);
  m || (M = ($ = b.getState()).onError) == null || M.call($, "010", Ve.error010());
  const B = (S) => {
    const { defaultEdgeOptions: z, onConnect: I, hasDefaultEdges: D } = b.getState(), P = {
      ...z,
      ...S
    };
    if (D) {
      const { edges: V, setEdges: X, onError: F } = b.getState();
      X(Av(P, V, { onError: F }));
    }
    I == null || I(P), a == null || a(P);
  }, H = (S) => {
    if (!m)
      return;
    const z = Ec(S.nativeEvent);
    if (o && (z && S.button === 0 || !z)) {
      const I = b.getState();
      bi.onPointerDown(S.nativeEvent, {
        handleDomNode: S.currentTarget,
        autoPanOnConnect: I.autoPanOnConnect,
        connectionMode: I.connectionMode,
        connectionRadius: I.connectionRadius,
        domNode: I.domNode,
        nodeLookup: I.nodeLookup,
        lib: I.lib,
        isTarget: v,
        handleId: g,
        nodeId: m,
        flowId: I.rfId,
        panBy: I.panBy,
        cancelConnection: I.cancelConnection,
        onConnectStart: I.onConnectStart,
        onConnectEnd: (...D) => {
          var P, V;
          return (V = (P = b.getState()).onConnectEnd) == null ? void 0 : V.call(P, ...D);
        },
        updateConnection: I.updateConnection,
        onConnect: B,
        isValidConnection: n || ((...D) => {
          var P, V;
          return ((V = (P = b.getState()).isValidConnection) == null ? void 0 : V.call(P, ...D)) ?? !0;
        }),
        getTransform: () => b.getState().transform,
        getFromHandle: () => b.getState().connection.fromHandle,
        autoPanSpeed: I.autoPanSpeed,
        dragThreshold: I.connectionDragThreshold
      });
    }
    z ? d == null || d(S) : f == null || f(S);
  }, x = (S) => {
    const { onClickConnectStart: z, onClickConnectEnd: I, connectionClickStartHandle: D, connectionMode: P, isValidConnection: V, lib: X, rfId: F, nodeLookup: Q, connection: G } = b.getState();
    if (!m || !D && !o)
      return;
    if (!D) {
      z == null || z(S.nativeEvent, { nodeId: m, handleId: g, handleType: e }), b.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const ee = _c(S.target), W = n || V, { connection: j, isValid: q } = bi.isValid(S.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: P,
      fromNodeId: D.nodeId,
      fromHandleId: D.id || null,
      fromType: D.type,
      isValidConnection: W,
      flowId: F,
      doc: ee,
      lib: X,
      nodeLookup: Q
    });
    q && j && B(j);
    const K = structuredClone(G);
    delete K.inProgress, K.toPosition = K.toHandle ? K.toHandle.position : null, I == null || I(S, K), b.setState({ connectionClickStartHandle: null });
  };
  return u("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${w}-${m}-${g}-${e}`, className: be([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    y,
    c,
    {
      source: !v,
      target: v,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: C,
      connectingfrom: N,
      connectingto: E,
      valid: L,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!A || T) && (A || O ? i : o)
    }
  ]), onMouseDown: H, onTouchStart: H, onClick: _ ? x : void 0, ref: p, ...h, children: l });
}
const gt = he(Kc(Jv));
function ex({ data: e, isConnectable: t, sourcePosition: n = U.Bottom }) {
  return k(me, { children: [e == null ? void 0 : e.label, u(gt, { type: "source", position: n, isConnectable: t })] });
}
function tx({ data: e, isConnectable: t, targetPosition: n = U.Top, sourcePosition: r = U.Bottom }) {
  return k(me, { children: [u(gt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, u(gt, { type: "source", position: r, isConnectable: t })] });
}
function nx() {
  return null;
}
function rx({ data: e, isConnectable: t, targetPosition: n = U.Top }) {
  return k(me, { children: [u(gt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Hr = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Ca = {
  input: ex,
  default: tx,
  output: rx,
  group: nx
};
function ox(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const ix = (e) => {
  const { width: t, height: n, x: r, y: o } = Wn(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: We(t) ? t : null,
    height: We(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function sx({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = fe(), { width: o, height: i, transformString: s, userSelectionActive: a } = ae(ix, ge), l = ed(), c = oe(null);
  ce(() => {
    var p;
    n || (p = c.current) == null || p.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (Jc({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const f = e ? (p) => {
    const g = r.getState().nodes.filter((v) => v.selected);
    e(p, g);
  } : void 0, h = (p) => {
    Object.prototype.hasOwnProperty.call(Hr, p.key) && (p.preventDefault(), l({
      direction: Hr[p.key],
      factor: p.shiftKey ? 4 : 1
    }));
  };
  return u("div", { className: be(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: u("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : h, style: {
    width: o,
    height: i
  } }) });
}
const Ma = typeof window < "u" ? window : void 0, ax = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function rd({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: f, onSelectionStart: h, onSelectionEnd: p, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: b, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: w, panOnScrollSpeed: N, panOnScrollMode: E, zoomOnDoubleClick: C, panOnDrag: T, autoPanOnSelection: A, defaultViewport: O, translateExtent: L, minZoom: B, maxZoom: H, preventScrolling: x, onSelectionContextMenu: $, noWheelClassName: M, noPanClassName: S, disableKeyboardA11y: z, onViewportChange: I, isControlledViewport: D }) {
  const { nodesSelectionActive: P, userSelectionActive: V } = ae(ax, ge), X = zn(c, { target: Ma }), F = zn(v, { target: Ma }), Q = F || T, G = F || w, ee = d && Q !== !0, W = X || V || ee;
  return Rv({ deleteKeyCode: l, multiSelectionKeyCode: g }), u(Bv, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: G, panActivationKeyPressed: F, panOnScrollSpeed: N, panOnScrollMode: E, zoomOnDoubleClick: C, panOnDrag: !X && Q, defaultViewport: O, translateExtent: L, minZoom: B, maxZoom: H, zoomActivationKeyCode: b, preventScrolling: x, noWheelClassName: M, noPanClassName: S, onViewportChange: I, isControlledViewport: D, paneClickDistance: a, selectionOnDrag: ee, children: k(Yv, { onSelectionStart: h, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: Q, autoPanOnSelection: A, isSelecting: !!W, selectionMode: f, selectionKeyPressed: X, paneClickDistance: a, selectionOnDrag: ee, children: [e, P && u(sx, { onSelectionContextMenu: $, noPanClassName: S, disableKeyboardA11y: z })] }) });
}
rd.displayName = "FlowRenderer";
const lx = he(rd), cx = (e) => (t) => e ? Xi(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function dx(e) {
  return ae($e(cx(e), [e]), ge);
}
const ux = (e) => e.updateNodeInternals;
function fx() {
  const e = ae(ux), [t] = J(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const r = /* @__PURE__ */ new Map();
    n.forEach((o) => {
      const i = o.target.getAttribute("data-id");
      r.set(i, {
        id: i,
        nodeElement: o.target,
        force: !0
      });
    }), e(r);
  }));
  return ce(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function hx({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = fe(), i = oe(null), s = oe(null), a = oe(e.sourcePosition), l = oe(e.targetPosition), c = oe(t), d = n && !!e.internals.handleBounds;
  return ce(() => {
    i.current && !e.hidden && (!d || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [d, e.hidden]), ce(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), ce(() => {
    if (i.current) {
      const f = c.current !== t, h = a.current !== e.sourcePosition, p = l.current !== e.targetPosition;
      (f || h || p) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function px({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: f, noDragClassName: h, noPanClassName: p, disableKeyboardA11y: g, rfId: v, nodeTypes: b, nodeClickDistance: m, onError: _ }) {
  const { node: y, internals: w, isParent: N } = ae((W) => {
    const j = W.nodeLookup.get(e), q = W.parentLookup.has(e);
    return {
      node: j,
      internals: j.internals,
      isParent: q
    };
  }, ge);
  let E = y.type || "default", C = (b == null ? void 0 : b[E]) || Ca[E];
  C === void 0 && (_ == null || _("003", Ve.error003(E)), E = "default", C = (b == null ? void 0 : b.default) || Ca.default);
  const T = !!(y.draggable || a && typeof y.draggable > "u"), A = !!(y.selectable || l && typeof y.selectable > "u"), O = !!(y.connectable || c && typeof y.connectable > "u"), L = !!(y.focusable || d && typeof y.focusable > "u"), B = fe(), H = bc(y), x = hx({ node: y, nodeType: E, hasDimensions: H, resizeObserver: f }), $ = Jc({
    nodeRef: x,
    disabled: y.hidden || !T,
    noDragClassName: h,
    handleSelector: y.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), M = ed();
  if (y.hidden)
    return null;
  const S = Ye(y), z = ox(y), I = A || T || t || n || r || o, D = n ? (W) => n(W, { ...w.userNode }) : void 0, P = r ? (W) => r(W, { ...w.userNode }) : void 0, V = o ? (W) => o(W, { ...w.userNode }) : void 0, X = i ? (W) => i(W, { ...w.userNode }) : void 0, F = s ? (W) => s(W, { ...w.userNode }) : void 0, Q = (W) => {
    const { selectNodesOnDrag: j, nodeDragThreshold: q } = B.getState();
    A && (!j || !T || q > 0) && vi({
      id: e,
      store: B,
      nodeRef: x
    }), t && t(W, { ...w.userNode });
  }, G = (W) => {
    if (!(kc(W.nativeEvent) || g)) {
      if (dc.includes(W.key) && A) {
        const j = W.key === "Escape";
        vi({
          id: e,
          store: B,
          unselect: j,
          nodeRef: x
        });
      } else if (T && y.selected && Object.prototype.hasOwnProperty.call(Hr, W.key)) {
        W.preventDefault();
        const { ariaLabelConfig: j } = B.getState();
        B.setState({
          ariaLiveMessage: j["node.a11yDescription.ariaLiveMessage"]({
            direction: W.key.replace("Arrow", "").toLowerCase(),
            x: ~~w.positionAbsolute.x,
            y: ~~w.positionAbsolute.y
          })
        }), M({
          direction: Hr[W.key],
          factor: W.shiftKey ? 4 : 1
        });
      }
    }
  }, ee = () => {
    var ne;
    if (g || !((ne = x.current) != null && ne.matches(":focus-visible")))
      return;
    const { transform: W, width: j, height: q, autoPanOnNodeFocus: K, setCenter: Z } = B.getState();
    if (!K)
      return;
    Xi(/* @__PURE__ */ new Map([[e, y]]), { x: 0, y: 0, width: j, height: q }, W, !0).length > 0 || Z(y.position.x + S.width / 2, y.position.y + S.height / 2, {
      zoom: W[2]
    });
  };
  return u("div", { className: be([
    "react-flow__node",
    `react-flow__node-${E}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [p]: T
    },
    y.className,
    {
      selected: y.selected,
      selectable: A,
      parent: N,
      draggable: T,
      dragging: $
    }
  ]), ref: x, style: {
    zIndex: w.z,
    transform: `translate(${w.positionAbsolute.x}px,${w.positionAbsolute.y}px)`,
    pointerEvents: I ? "all" : "none",
    visibility: H ? "visible" : "hidden",
    ...y.style,
    ...z
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: D, onMouseMove: P, onMouseLeave: V, onContextMenu: X, onClick: Q, onDoubleClick: F, onKeyDown: L ? G : void 0, tabIndex: L ? 0 : void 0, onFocus: L ? ee : void 0, role: y.ariaRole ?? (L ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Gc}-${v}`, "aria-label": y.ariaLabel, ...y.domAttributes, children: u(Xv, { value: e, children: u(C, { id: e, data: y.data, type: E, positionAbsoluteX: w.positionAbsolute.x, positionAbsoluteY: w.positionAbsolute.y, selected: y.selected ?? !1, selectable: A, draggable: T, deletable: y.deletable ?? !0, isConnectable: O, sourcePosition: y.sourcePosition, targetPosition: y.targetPosition, dragging: $, dragHandle: y.dragHandle, zIndex: w.z, parentId: y.parentId, ...S }) }) });
}
var gx = he(px);
const mx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function od(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = ae(mx, ge), i = dx(e.onlyRenderVisibleElements), s = fx();
  return u("div", { className: "react-flow__nodes", style: io, children: i.map((a) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    u(gx, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
od.displayName = "NodeRenderer";
const yx = he(od);
function wx(e) {
  return ae($e((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && Zw({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(o.id);
      }
    return r;
  }, [e]), ge);
}
const bx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return u("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, vx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return u("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, $a = {
  [Ut.Arrow]: bx,
  [Ut.ArrowClosed]: vx
};
function xx(e) {
  const t = fe();
  return le(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call($a, e) ? $a[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Ve.error009(e)), null);
  }, [e]);
}
const _x = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = xx(t);
  return l ? u("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: u(l, { color: n, strokeWidth: s }) }) : null;
}, id = ({ defaultColor: e, rfId: t }) => {
  const n = ae((i) => i.edges), r = ae((i) => i.defaultEdgeOptions), o = le(() => ib(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? u("svg", { className: "react-flow__marker", "aria-hidden": "true", children: u("defs", { children: o.map((i) => u(_x, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
id.displayName = "MarkerDefinitions";
var kx = he(id);
function sd({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [f, h] = J({ x: 1, y: 0, width: 0, height: 0 }), p = be(["react-flow__edge-textwrapper", c]), g = oe(null);
  return ce(() => {
    if (g.current) {
      const v = g.current.getBBox();
      h({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? k("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: p, visibility: f.width ? "visible" : "hidden", ...d, children: [o && u("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), u("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
sd.displayName = "EdgeText";
const Ex = he(sd);
function so({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return k(me, { children: [u("path", { ...d, d: e, fill: "none", className: be(["react-flow__edge-path", d.className]) }), c ? u("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && We(t) && We(n) ? u(Ex, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Ia({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === U.Left || e === U.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function ad({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top }) {
  const [s, a] = Ia({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = Ia({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, f, h, p] = Sc({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: o,
    sourceControlX: s,
    sourceControlY: a,
    targetControlX: l,
    targetControlY: c
  });
  return [
    `M${e},${t} C${s},${a} ${l},${c} ${r},${o}`,
    d,
    f,
    h,
    p
  ];
}
function ld(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: b, interactionWidth: m }) => {
    const [_, y, w] = ad({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), N = e.isInternal ? void 0 : t;
    return u(so, { id: N, path: _, labelX: y, labelY: w, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: b, interactionWidth: m });
  });
}
const Sx = ld({ isInternal: !1 }), cd = ld({ isInternal: !0 });
Sx.displayName = "SimpleBezierEdge";
cd.displayName = "SimpleBezierEdgeInternal";
function dd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, sourcePosition: p = U.Bottom, targetPosition: g = U.Top, markerEnd: v, markerStart: b, pathOptions: m, interactionWidth: _ }) => {
    const [y, w, N] = mi({
      sourceX: n,
      sourceY: r,
      sourcePosition: p,
      targetX: o,
      targetY: i,
      targetPosition: g,
      borderRadius: m == null ? void 0 : m.borderRadius,
      offset: m == null ? void 0 : m.offset,
      stepPosition: m == null ? void 0 : m.stepPosition
    }), E = e.isInternal ? void 0 : t;
    return u(so, { id: E, path: y, labelX: w, labelY: N, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, markerEnd: v, markerStart: b, interactionWidth: _ });
  });
}
const ud = dd({ isInternal: !1 }), fd = dd({ isInternal: !0 });
ud.displayName = "SmoothStepEdge";
fd.displayName = "SmoothStepEdgeInternal";
function hd(e) {
  return he(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return u(ud, { ...n, id: r, pathOptions: le(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const Nx = hd({ isInternal: !1 }), pd = hd({ isInternal: !0 });
Nx.displayName = "StepEdge";
pd.displayName = "StepEdgeInternal";
function gd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, markerEnd: p, markerStart: g, interactionWidth: v }) => {
    const [b, m, _] = Mc({ sourceX: n, sourceY: r, targetX: o, targetY: i }), y = e.isInternal ? void 0 : t;
    return u(so, { id: y, path: b, labelX: m, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, markerEnd: p, markerStart: g, interactionWidth: v });
  });
}
const Cx = gd({ isInternal: !1 }), md = gd({ isInternal: !0 });
Cx.displayName = "StraightEdge";
md.displayName = "StraightEdgeInternal";
function yd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = U.Bottom, targetPosition: a = U.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: b, pathOptions: m, interactionWidth: _ }) => {
    const [y, w, N] = Nc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), E = e.isInternal ? void 0 : t;
    return u(so, { id: E, path: y, labelX: w, labelY: N, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: b, interactionWidth: _ });
  });
}
const Mx = yd({ isInternal: !1 }), wd = yd({ isInternal: !0 });
Mx.displayName = "BezierEdge";
wd.displayName = "BezierEdgeInternal";
const Aa = {
  default: wd,
  straight: md,
  step: pd,
  smoothstep: fd,
  simplebezier: cd
}, Ta = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, $x = (e, t, n) => n === U.Left ? e - t : n === U.Right ? e + t : e, Ix = (e, t, n) => n === U.Top ? e - t : n === U.Bottom ? e + t : e, La = "react-flow__edgeupdater";
function za({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return u("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: be([La, `${La}-${a}`]), cx: $x(t, r, e), cy: Ix(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function Ax({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: f, setReconnecting: h, setUpdateHover: p }) {
  const g = fe(), v = (w, N) => {
    if (w.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: C, connectionMode: T, connectionRadius: A, lib: O, onConnectStart: L, cancelConnection: B, nodeLookup: H, rfId: x, panBy: $, updateConnection: M } = g.getState(), S = N.type === "target", z = (P, V) => {
      h(!1), f == null || f(P, n, N.type, V);
    }, I = (P) => c == null ? void 0 : c(n, P), D = (P, V) => {
      h(!0), d == null || d(w, n, N.type), L == null || L(P, V);
    };
    bi.onPointerDown(w.nativeEvent, {
      autoPanOnConnect: E,
      connectionMode: T,
      connectionRadius: A,
      domNode: C,
      handleId: N.id,
      nodeId: N.nodeId,
      nodeLookup: H,
      isTarget: S,
      edgeUpdaterType: N.type,
      lib: O,
      flowId: x,
      cancelConnection: B,
      panBy: $,
      isValidConnection: (...P) => {
        var V, X;
        return ((X = (V = g.getState()).isValidConnection) == null ? void 0 : X.call(V, ...P)) ?? !0;
      },
      onConnect: I,
      onConnectStart: D,
      onConnectEnd: (...P) => {
        var V, X;
        return (X = (V = g.getState()).onConnectEnd) == null ? void 0 : X.call(V, ...P);
      },
      onReconnectEnd: z,
      updateConnection: M,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: w.currentTarget
    });
  }, b = (w) => v(w, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (w) => v(w, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => p(!0), y = () => p(!1);
  return k(me, { children: [(e === !0 || e === "source") && u(za, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: b, onMouseEnter: _, onMouseOut: y, type: "source" }), (e === !0 || e === "target") && u(za, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: _, onMouseOut: y, type: "target" })] });
}
function Tx({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: f, onReconnectStart: h, onReconnectEnd: p, rfId: g, edgeTypes: v, noPanClassName: b, onError: m, disableKeyboardA11y: _ }) {
  let y = ae((Z) => Z.edgeLookup.get(e));
  const w = ae((Z) => Z.defaultEdgeOptions);
  y = w ? { ...w, ...y } : y;
  let N = y.type || "default", E = (v == null ? void 0 : v[N]) || Aa[N];
  E === void 0 && (m == null || m("011", Ve.error011(N)), N = "default", E = (v == null ? void 0 : v.default) || Aa.default);
  const C = !!(y.focusable || t && typeof y.focusable > "u"), T = typeof f < "u" && (y.reconnectable || n && typeof y.reconnectable > "u"), A = !!(y.selectable || r && typeof y.selectable > "u"), O = oe(null), [L, B] = J(!1), [H, x] = J(!1), $ = fe(), { zIndex: M = y.zIndex, sourceX: S, sourceY: z, targetX: I, targetY: D, sourcePosition: P, targetPosition: V } = ae($e((Z) => {
    const te = Z.nodeLookup.get(y.source), ne = Z.nodeLookup.get(y.target);
    if (!te || !ne)
      return Ta;
    const re = ob({
      id: e,
      sourceNode: te,
      targetNode: ne,
      sourceHandle: y.sourceHandle || null,
      targetHandle: y.targetHandle || null,
      connectionMode: Z.connectionMode,
      onError: m
    }), se = Kw({
      selected: y.selected,
      zIndex: y.zIndex,
      sourceNode: te,
      targetNode: ne,
      elevateOnSelect: Z.elevateEdgesOnSelect,
      zIndexMode: Z.zIndexMode
    });
    return {
      ...re || Ta,
      zIndex: se
    };
  }, [y.source, y.target, y.sourceHandle, y.targetHandle, y.selected, y.zIndex, m]), ge), X = le(() => y.markerStart ? `url('#${yi(y.markerStart, g)}')` : void 0, [y.markerStart, g]), F = le(() => y.markerEnd ? `url('#${yi(y.markerEnd, g)}')` : void 0, [y.markerEnd, g]);
  if (y.hidden || S === null || z === null || I === null || D === null)
    return null;
  const Q = (Z) => {
    var se;
    const { addSelectedEdges: te, unselectNodesAndEdges: ne, multiSelectionActive: re } = $.getState();
    A && ($.setState({ nodesSelectionActive: !1 }), y.selected && re ? (ne({ nodes: [], edges: [y] }), (se = O.current) == null || se.blur()) : te([e])), o && o(Z, y);
  }, G = i ? (Z) => {
    i(Z, { ...y });
  } : void 0, ee = s ? (Z) => {
    s(Z, { ...y });
  } : void 0, W = a ? (Z) => {
    a(Z, { ...y });
  } : void 0, j = l ? (Z) => {
    l(Z, { ...y });
  } : void 0, q = c ? (Z) => {
    c(Z, { ...y });
  } : void 0, K = (Z) => {
    var te;
    if (!_ && dc.includes(Z.key) && A) {
      const { unselectNodesAndEdges: ne, addSelectedEdges: re } = $.getState();
      Z.key === "Escape" ? ((te = O.current) == null || te.blur(), ne({ edges: [y] })) : re([e]);
    }
  };
  return u("svg", { style: { zIndex: M }, children: k("g", { className: be([
    "react-flow__edge",
    `react-flow__edge-${N}`,
    y.className,
    b,
    {
      selected: y.selected,
      animated: y.animated,
      inactive: !A && !o,
      updating: L,
      selectable: A
    }
  ]), onClick: Q, onDoubleClick: G, onContextMenu: ee, onMouseEnter: W, onMouseMove: j, onMouseLeave: q, onKeyDown: C ? K : void 0, tabIndex: C ? 0 : void 0, role: y.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": y.ariaLabel === null ? void 0 : y.ariaLabel || `Edge from ${y.source} to ${y.target}`, "aria-describedby": C ? `${Xc}-${g}` : void 0, ref: O, ...y.domAttributes, children: [!H && u(E, { id: e, source: y.source, target: y.target, type: y.type, selected: y.selected, animated: y.animated, selectable: A, deletable: y.deletable ?? !0, label: y.label, labelStyle: y.labelStyle, labelShowBg: y.labelShowBg, labelBgStyle: y.labelBgStyle, labelBgPadding: y.labelBgPadding, labelBgBorderRadius: y.labelBgBorderRadius, sourceX: S, sourceY: z, targetX: I, targetY: D, sourcePosition: P, targetPosition: V, data: y.data, style: y.style, sourceHandleId: y.sourceHandle, targetHandleId: y.targetHandle, markerStart: X, markerEnd: F, pathOptions: "pathOptions" in y ? y.pathOptions : void 0, interactionWidth: y.interactionWidth }), T && u(Ax, { edge: y, isReconnectable: T, reconnectRadius: d, onReconnect: f, onReconnectStart: h, onReconnectEnd: p, sourceX: S, sourceY: z, targetX: I, targetY: D, sourcePosition: P, targetPosition: V, setUpdateHover: B, setReconnecting: x })] }) });
}
var Lx = he(Tx);
const zx = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function bd({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: f, onEdgeDoubleClick: h, onReconnectStart: p, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: b, edgesReconnectable: m, elementsSelectable: _, onError: y } = ae(zx, ge), w = wx(t);
  return k("div", { className: "react-flow__edges", children: [u(kx, { defaultColor: e, rfId: n }), w.map((N) => u(Lx, { id: N, edgesFocusable: b, edgesReconnectable: m, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: f, onDoubleClick: h, onReconnectStart: p, onReconnectEnd: g, rfId: n, onError: y, edgeTypes: r, disableKeyboardA11y: v }, N))] });
}
bd.displayName = "EdgeRenderer";
const Ox = he(bd), Oa = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Px({ children: e }) {
  const t = fe(), n = oe(null), [r] = J(() => t.getState().transform);
  return Zc(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = Oa(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), u("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Oa(r) }, children: e });
}
function Dx(e) {
  const t = oo(), n = oe(!1);
  ce(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Rx = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Hx(e) {
  const t = ae(Rx), n = fe();
  return ce(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Wx(e) {
  return e.connection.inProgress ? { ...e.connection, to: Vn(e.connection.to, e.transform) } : { ...e.connection };
}
function Bx(e) {
  return Wx;
}
function Vx(e) {
  const t = Bx();
  return ae(t, ge);
}
const Fx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function jx({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = ae(Fx, ge);
  return !(i && o && l) ? null : u("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: u("g", { className: be(["react-flow__connection", xc(a)]), children: u(vd, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const vd = ({ style: e, type: t = ft.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: f, toPosition: h, pointer: p } = Vx();
  if (!o)
    return;
  if (n)
    return u(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: h, connectionStatus: xc(r), toNode: d, toHandle: f, pointer: p });
  let g = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: h
  };
  switch (t) {
    case ft.Bezier:
      [g] = Nc(v);
      break;
    case ft.SimpleBezier:
      [g] = ad(v);
      break;
    case ft.Step:
      [g] = mi({
        ...v,
        borderRadius: 0
      });
      break;
    case ft.SmoothStep:
      [g] = mi(v);
      break;
    default:
      [g] = Mc(v);
  }
  return u("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
vd.displayName = "ConnectionLine";
const Yx = {};
function Pa(e = Yx) {
  oe(e), fe(), ce(() => {
  }, [e]);
}
function Gx() {
  fe(), oe(!1), ce(() => {
  }, []);
}
function xd({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: f, onSelectionStart: h, onSelectionEnd: p, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: b, connectionLineContainerStyle: m, selectionKeyCode: _, selectionOnDrag: y, selectionMode: w, multiSelectionKeyCode: N, panActivationKeyCode: E, zoomActivationKeyCode: C, deleteKeyCode: T, onlyRenderVisibleElements: A, elementsSelectable: O, defaultViewport: L, translateExtent: B, minZoom: H, maxZoom: x, preventScrolling: $, defaultMarkerColor: M, zoomOnScroll: S, zoomOnPinch: z, panOnScroll: I, panOnScrollSpeed: D, panOnScrollMode: P, zoomOnDoubleClick: V, panOnDrag: X, autoPanOnSelection: F, onPaneClick: Q, onPaneMouseEnter: G, onPaneMouseMove: ee, onPaneMouseLeave: W, onPaneScroll: j, onPaneContextMenu: q, paneClickDistance: K, nodeClickDistance: Z, onEdgeContextMenu: te, onEdgeMouseEnter: ne, onEdgeMouseMove: re, onEdgeMouseLeave: se, reconnectRadius: ue, onReconnect: _e, onReconnectStart: Ae, onReconnectEnd: ke, noDragClassName: ze, noWheelClassName: Ge, noPanClassName: Je, disableKeyboardA11y: Xe, nodeExtent: Se, rfId: Te, viewport: Oe, onViewportChange: Ue, nodesDraggable: zt }) {
  return Pa(e), Pa(t), Gx(), Dx(n), Hx(Oe), u(lx, { onPaneClick: Q, onPaneMouseEnter: G, onPaneMouseMove: ee, onPaneMouseLeave: W, onPaneContextMenu: q, onPaneScroll: j, paneClickDistance: K, deleteKeyCode: T, selectionKeyCode: _, selectionOnDrag: y, selectionMode: w, onSelectionStart: h, onSelectionEnd: p, multiSelectionKeyCode: N, panActivationKeyCode: E, zoomActivationKeyCode: C, elementsSelectable: O, zoomOnScroll: S, zoomOnPinch: z, zoomOnDoubleClick: V, panOnScroll: I, panOnScrollSpeed: D, panOnScrollMode: P, panOnDrag: X, autoPanOnSelection: F, defaultViewport: L, translateExtent: B, minZoom: H, maxZoom: x, onSelectionContextMenu: f, preventScrolling: $, noDragClassName: ze, noWheelClassName: Ge, noPanClassName: Je, disableKeyboardA11y: Xe, onViewportChange: Ue, isControlledViewport: !!Oe, children: k(Px, { children: [u(Ox, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: _e, onReconnectStart: Ae, onReconnectEnd: ke, onlyRenderVisibleElements: A, onEdgeContextMenu: te, onEdgeMouseEnter: ne, onEdgeMouseMove: re, onEdgeMouseLeave: se, reconnectRadius: ue, defaultMarkerColor: M, noPanClassName: Je, disableKeyboardA11y: Xe, rfId: Te }), u(jx, { style: v, type: g, component: b, containerStyle: m }), u("div", { className: "react-flow__edgelabel-renderer" }), u(yx, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: Z, onlyRenderVisibleElements: A, noPanClassName: Je, noDragClassName: ze, disableKeyboardA11y: Xe, nodeExtent: Se, rfId: Te, nodesDraggable: zt }), u("div", { className: "react-flow__viewport-portal" })] }) });
}
xd.displayName = "GraphView";
const Xx = he(xd), Ux = wc(), Da = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: f, zIndexMode: h = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), m = r ?? t ?? [], _ = n ?? e ?? [], y = d ?? [0, 0], w = f ?? In;
  Ac(v, b, m);
  const { nodesInitialized: N } = wi(_, p, g, {
    nodeOrigin: y,
    nodeExtent: w,
    zIndexMode: h
  });
  let E = [0, 0, 1];
  if (s && o && i) {
    const C = Wn(p, {
      filter: (L) => !!((L.width || L.initialWidth) && (L.height || L.initialHeight))
    }), { x: T, y: A, zoom: O } = eo(C, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    E = [T, A, O];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: E,
    nodes: _,
    nodesInitialized: N,
    nodeLookup: p,
    parentLookup: g,
    edges: m,
    edgeLookup: b,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: In,
    nodeExtent: w,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Xt.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: y,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: s ?? !1,
    fitViewOptions: a,
    fitViewResolver: null,
    connection: { ...fc },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Ux,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: uc,
    zIndexMode: h,
    defaultEdgeOptions: void 0,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onNodesDelete: void 0,
    onEdgesDelete: void 0,
    onDelete: void 0,
    onBeforeDelete: void 0,
    onViewportChangeStart: void 0,
    onViewportChange: void 0,
    onViewportChangeEnd: void 0,
    onNodeDragStart: void 0,
    onNodeDrag: void 0,
    onNodeDragStop: void 0,
    onSelectionDragStart: void 0,
    onSelectionDrag: void 0,
    onSelectionDragStop: void 0,
    onMoveStart: void 0,
    onMove: void 0,
    onMoveEnd: void 0,
    onConnect: void 0,
    onConnectStart: void 0,
    onConnectEnd: void 0,
    onClickConnectStart: void 0,
    onClickConnectEnd: void 0
  };
}, qx = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: f, zIndexMode: h }) => av((p, g) => {
  async function v() {
    const { nodeLookup: b, panZoom: m, fitViewOptions: _, fitViewResolver: y, width: w, height: N, minZoom: E, maxZoom: C } = g();
    m && (await Fw({
      nodes: b,
      width: w,
      height: N,
      panZoom: m,
      minZoom: E,
      maxZoom: C
    }, _), y == null || y.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...Da({
      nodes: e,
      edges: t,
      width: o,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: l,
      maxZoom: c,
      nodeOrigin: d,
      nodeExtent: f,
      defaultNodes: n,
      defaultEdges: r,
      zIndexMode: h
    }),
    setNodes: (b) => {
      const { nodeLookup: m, parentLookup: _, nodeOrigin: y, nodeExtent: w, elevateNodesOnSelect: N, fitViewQueued: E, zIndexMode: C, nodesSelectionActive: T } = g(), { nodesInitialized: A, hasSelectedNodes: O } = wi(b, m, _, {
        nodeOrigin: y,
        nodeExtent: w,
        elevateNodesOnSelect: N,
        checkEquality: !0,
        zIndexMode: C
      }), L = T && O;
      E && A ? (v(), p({
        nodes: b,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: L
      })) : p({ nodes: b, nodesInitialized: A, nodesSelectionActive: L });
    },
    setEdges: (b) => {
      const { connectionLookup: m, edgeLookup: _ } = g();
      Ac(m, _, b), p({ edges: b });
    },
    setDefaultNodesAndEdges: (b, m) => {
      if (b) {
        const { setNodes: _ } = g();
        _(b), p({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: _ } = g();
        _(m), p({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (b) => {
      const { triggerNodeChanges: m, nodeLookup: _, parentLookup: y, domNode: w, nodeOrigin: N, nodeExtent: E, debug: C, fitViewQueued: T, zIndexMode: A } = g(), { changes: O, updatedInternals: L } = fb(b, _, y, w, N, E, A);
      L && (lb(_, y, { nodeOrigin: N, nodeExtent: E, zIndexMode: A }), T ? (v(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), (O == null ? void 0 : O.length) > 0 && (C && console.log("React Flow: trigger node changes", O), m == null || m(O)));
    },
    updateNodePositions: (b, m = !1) => {
      const _ = [];
      let y = [];
      const { nodeLookup: w, triggerNodeChanges: N, connection: E, updateConnection: C, onNodesChangeMiddlewareMap: T } = g();
      for (const [A, O] of b) {
        const L = w.get(A), B = !!(L != null && L.expandParent && (L != null && L.parentId) && (O != null && O.position)), H = {
          id: A,
          type: "position",
          position: B ? {
            x: Math.max(0, O.position.x),
            y: Math.max(0, O.position.y)
          } : O.position,
          dragging: m
        };
        if (L && E.inProgress && E.fromNode.id === L.id) {
          const x = It(L, E.fromHandle, U.Left, !0);
          C({ ...E, from: x });
        }
        B && L.parentId && _.push({
          id: A,
          parentId: L.parentId,
          rect: {
            ...O.internals.positionAbsolute,
            width: O.measured.width ?? 0,
            height: O.measured.height ?? 0
          }
        }), y.push(H);
      }
      if (_.length > 0) {
        const { parentLookup: A, nodeOrigin: O } = g(), L = es(_, w, A, O);
        y.push(...L);
      }
      for (const A of T.values())
        y = A(y);
      N(y);
    },
    triggerNodeChanges: (b) => {
      const { onNodesChange: m, setNodes: _, nodes: y, hasDefaultNodes: w, debug: N } = g();
      if (b != null && b.length) {
        if (w) {
          const E = Mv(b, y);
          _(E);
        }
        N && console.log("React Flow: trigger node changes", b), m == null || m(b);
      }
    },
    triggerEdgeChanges: (b) => {
      const { onEdgesChange: m, setEdges: _, edges: y, hasDefaultEdges: w, debug: N } = g();
      if (b != null && b.length) {
        if (w) {
          const E = $v(b, y);
          _(E);
        }
        N && console.log("React Flow: trigger edge changes", b), m == null || m(b);
      }
    },
    addSelectedNodes: (b) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: w, triggerEdgeChanges: N } = g();
      if (m) {
        const E = b.map((C) => _t(C, !0));
        w(E);
        return;
      }
      w(Vt(y, /* @__PURE__ */ new Set([...b]), !0)), N(Vt(_));
    },
    addSelectedEdges: (b) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: w, triggerEdgeChanges: N } = g();
      if (m) {
        const E = b.map((C) => _t(C, !0));
        N(E);
        return;
      }
      N(Vt(_, /* @__PURE__ */ new Set([...b]))), w(Vt(y, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: b, edges: m } = {}) => {
      const { edges: _, nodes: y, nodeLookup: w, triggerNodeChanges: N, triggerEdgeChanges: E } = g(), C = b || y, T = m || _, A = [];
      for (const L of C) {
        if (!L.selected)
          continue;
        const B = w.get(L.id);
        B && (B.selected = !1), A.push(_t(L.id, !1));
      }
      const O = [];
      for (const L of T)
        L.selected && O.push(_t(L.id, !1));
      N(A), E(O);
    },
    setMinZoom: (b) => {
      const { panZoom: m, maxZoom: _ } = g();
      m == null || m.setScaleExtent([b, _]), p({ minZoom: b });
    },
    setMaxZoom: (b) => {
      const { panZoom: m, minZoom: _ } = g();
      m == null || m.setScaleExtent([_, b]), p({ maxZoom: b });
    },
    setTranslateExtent: (b) => {
      var m;
      (m = g().panZoom) == null || m.setTranslateExtent(b), p({ translateExtent: b });
    },
    resetSelectedElements: () => {
      const { edges: b, nodes: m, triggerNodeChanges: _, triggerEdgeChanges: y, elementsSelectable: w } = g();
      if (!w)
        return;
      const N = m.reduce((C, T) => T.selected ? [...C, _t(T.id, !1)] : C, []), E = b.reduce((C, T) => T.selected ? [...C, _t(T.id, !1)] : C, []);
      _(N), y(E);
    },
    setNodeExtent: (b) => {
      const { nodes: m, nodeLookup: _, parentLookup: y, nodeOrigin: w, elevateNodesOnSelect: N, nodeExtent: E, zIndexMode: C } = g();
      b[0][0] === E[0][0] && b[0][1] === E[0][1] && b[1][0] === E[1][0] && b[1][1] === E[1][1] || (wi(m, _, y, {
        nodeOrigin: w,
        nodeExtent: b,
        elevateNodesOnSelect: N,
        checkEquality: !1,
        zIndexMode: C
      }), p({ nodeExtent: b }));
    },
    panBy: (b) => {
      const { transform: m, width: _, height: y, panZoom: w, translateExtent: N } = g();
      return hb({ delta: b, panZoom: w, transform: m, translateExtent: N, width: _, height: y });
    },
    setCenter: async (b, m, _) => {
      const { width: y, height: w, maxZoom: N, panZoom: E } = g();
      if (!E)
        return !1;
      const C = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : N;
      return await E.setViewport({
        x: y / 2 - b * C,
        y: w / 2 - m * C,
        zoom: C
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...fc }
      });
    },
    updateConnection: (b) => {
      p({ connection: b });
    },
    reset: () => p({ ...Da() })
  };
}, Object.is);
function ns({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: f, zIndexMode: h, children: p }) {
  const [g] = J(() => qx({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: r,
    width: o,
    height: i,
    fitView: c,
    minZoom: s,
    maxZoom: a,
    fitViewOptions: l,
    nodeOrigin: d,
    nodeExtent: f,
    zIndexMode: h
  }));
  return u(lv, { value: g, children: u(zv, { children: u(qv, { children: p }) }) });
}
function Kx({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: f, nodeExtent: h, zIndexMode: p }) {
  return Jt(ro) ? u(me, { children: e }) : u(ns, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: f, nodeExtent: h, zIndexMode: p, children: e });
}
const Zx = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function Qx({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: f, onMoveEnd: h, onConnect: p, onConnectStart: g, onConnectEnd: v, onClickConnectStart: b, onClickConnectEnd: m, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: w, onNodeContextMenu: N, onNodeDoubleClick: E, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onNodesDelete: O, onEdgesDelete: L, onDelete: B, onSelectionChange: H, onSelectionDragStart: x, onSelectionDrag: $, onSelectionDragStop: M, onSelectionContextMenu: S, onSelectionStart: z, onSelectionEnd: I, onBeforeDelete: D, connectionMode: P, connectionLineType: V = ft.Bezier, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: Q, deleteKeyCode: G = "Backspace", selectionKeyCode: ee = "Shift", selectionOnDrag: W = !1, selectionMode: j = An.Full, panActivationKeyCode: q = "Space", multiSelectionKeyCode: K = Ln() ? "Meta" : "Control", zoomActivationKeyCode: Z = Ln() ? "Meta" : "Control", snapToGrid: te, snapGrid: ne, onlyRenderVisibleElements: re = !1, selectNodesOnDrag: se, nodesDraggable: ue, autoPanOnNodeFocus: _e, nodesConnectable: Ae, nodesFocusable: ke, nodeOrigin: ze = Uc, edgesFocusable: Ge, edgesReconnectable: Je, elementsSelectable: Xe = !0, defaultViewport: Se = xv, minZoom: Te = 0.5, maxZoom: Oe = 2, translateExtent: Ue = In, preventScrolling: zt = !0, nodeExtent: et, defaultMarkerColor: Fn = "#b1b1b7", zoomOnScroll: ao = !0, zoomOnPinch: mt = !0, panOnScroll: lo = !1, panOnScrollSpeed: tn = 0.5, panOnScrollMode: nn = St.Free, zoomOnDoubleClick: co = !0, panOnDrag: jn = !0, onPaneClick: rn, onPaneMouseEnter: on, onPaneMouseMove: uo, onPaneMouseLeave: fo, onPaneScroll: Ot, onPaneContextMenu: sn, paneClickDistance: pe = 1, nodeClickDistance: tt = 0, children: Yn, onReconnect: yt, onReconnectStart: Pt, onReconnectEnd: Gn, onEdgeContextMenu: Xn, onEdgeDoubleClick: Un, onEdgeMouseEnter: ho, onEdgeMouseMove: po, onEdgeMouseLeave: go, reconnectRadius: mo = 10, onNodesChange: Pe, onEdgesChange: an, noDragClassName: ln = "nodrag", noWheelClassName: yo = "nowheel", noPanClassName: Dt = "nopan", fitView: qn, fitViewOptions: cn, connectOnClick: wo, attributionPosition: bo, proOptions: vo, defaultEdgeOptions: xo, elevateNodesOnSelect: _o = !0, elevateEdgesOnSelect: ko = !1, disableKeyboardA11y: Kn = !1, autoPanOnConnect: Eo, autoPanOnNodeDrag: So, autoPanOnSelection: No = !0, autoPanSpeed: Co, connectionRadius: Mo, isValidConnection: $o, onError: Io, style: Ao, id: Rt, nodeDragThreshold: wt, connectionDragThreshold: dn, viewport: un, onViewportChange: To, width: Lo, height: Zn, colorMode: Qn = "light", debug: Jn, onScroll: bt, ariaLabelConfig: er, zIndexMode: fn = "basic", ...tr }, nr) {
  const hn = Rt || "1", Ne = Sv(Qn), rr = $e((pn) => {
    pn.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), bt == null || bt(pn);
  }, [bt]);
  return u("div", { "data-testid": "rf__wrapper", ...tr, onScroll: rr, style: { ...Ao, ...Zx }, ref: nr, className: be(["react-flow", o, Ne]), id: Rt, role: "application", children: k(Kx, { nodes: e, edges: t, width: Lo, height: Zn, fitView: qn, fitViewOptions: cn, minZoom: Te, maxZoom: Oe, nodeOrigin: ze, nodeExtent: et, zIndexMode: fn, children: [u(Ev, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: p, onConnectStart: g, onConnectEnd: v, onClickConnectStart: b, onClickConnectEnd: m, nodesDraggable: ue, autoPanOnNodeFocus: _e, nodesConnectable: Ae, nodesFocusable: ke, edgesFocusable: Ge, edgesReconnectable: Je, elementsSelectable: Xe, elevateNodesOnSelect: _o, elevateEdgesOnSelect: ko, minZoom: Te, maxZoom: Oe, nodeExtent: et, onNodesChange: Pe, onEdgesChange: an, snapToGrid: te, snapGrid: ne, connectionMode: P, translateExtent: Ue, connectOnClick: wo, defaultEdgeOptions: xo, fitView: qn, fitViewOptions: cn, onNodesDelete: O, onEdgesDelete: L, onDelete: B, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onSelectionDrag: $, onSelectionDragStart: x, onSelectionDragStop: M, onMove: d, onMoveStart: f, onMoveEnd: h, noPanClassName: Dt, nodeOrigin: ze, rfId: hn, autoPanOnConnect: Eo, autoPanOnNodeDrag: So, autoPanSpeed: Co, onError: Io, connectionRadius: Mo, isValidConnection: $o, selectNodesOnDrag: se, nodeDragThreshold: wt, connectionDragThreshold: dn, onBeforeDelete: D, debug: Jn, ariaLabelConfig: er, zIndexMode: fn }), u(Xx, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: w, onNodeContextMenu: N, onNodeDoubleClick: E, nodeTypes: i, edgeTypes: s, connectionLineType: V, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: Q, selectionKeyCode: ee, selectionOnDrag: W, selectionMode: j, deleteKeyCode: G, multiSelectionKeyCode: K, panActivationKeyCode: q, zoomActivationKeyCode: Z, onlyRenderVisibleElements: re, defaultViewport: Se, translateExtent: Ue, minZoom: Te, maxZoom: Oe, preventScrolling: zt, zoomOnScroll: ao, zoomOnPinch: mt, zoomOnDoubleClick: co, panOnScroll: lo, panOnScrollSpeed: tn, panOnScrollMode: nn, panOnDrag: jn, autoPanOnSelection: No, onPaneClick: rn, onPaneMouseEnter: on, onPaneMouseMove: uo, onPaneMouseLeave: fo, onPaneScroll: Ot, onPaneContextMenu: sn, paneClickDistance: pe, nodeClickDistance: tt, onSelectionContextMenu: S, onSelectionStart: z, onSelectionEnd: I, onReconnect: yt, onReconnectStart: Pt, onReconnectEnd: Gn, onEdgeContextMenu: Xn, onEdgeDoubleClick: Un, onEdgeMouseEnter: ho, onEdgeMouseMove: po, onEdgeMouseLeave: go, reconnectRadius: mo, defaultMarkerColor: Fn, noDragClassName: ln, noWheelClassName: yo, noPanClassName: Dt, rfId: hn, disableKeyboardA11y: Kn, nodeExtent: et, viewport: un, onViewportChange: To, nodesDraggable: ue }), u(vv, { onSelectionChange: H }), Yn, u(gv, { proOptions: vo, position: bo }), u(pv, { rfId: hn, disableKeyboardA11y: Kn })] }) });
}
var _d = Kc(Qx);
function Jx({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return u("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: be(["react-flow__background-pattern", n, r]) });
}
function e1({ radius: e, className: t }) {
  return u("circle", { cx: e, cy: e, r: e, className: be(["react-flow__background-pattern", "dots", t]) });
}
var pt;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(pt || (pt = {}));
const t1 = {
  [pt.Dots]: 1,
  [pt.Lines]: 1,
  [pt.Cross]: 6
}, n1 = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function kd({
  id: e,
  variant: t = pt.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: r,
  lineWidth: o = 1,
  offset: i = 0,
  color: s,
  bgColor: a,
  style: l,
  className: c,
  patternClassName: d
}) {
  const f = oe(null), { transform: h, patternId: p } = ae(n1, ge), g = r || t1[t], v = t === pt.Dots, b = t === pt.Cross, m = Array.isArray(n) ? n : [n, n], _ = [m[0] * h[2] || 1, m[1] * h[2] || 1], y = g * h[2], w = Array.isArray(i) ? i : [i, i], N = b ? [y, y] : _, E = [
    w[0] * h[2] + N[0] / 2,
    w[1] * h[2] + N[1] / 2
  ], C = `${p}${e || ""}`;
  return k("svg", { className: be(["react-flow__background", c]), style: {
    ...l,
    ...io,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [u("pattern", { id: C, x: h[0] % _[0], y: h[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: v ? u(e1, { radius: y / 2, className: d }) : u(Jx, { dimensions: N, lineWidth: o, variant: t, className: d }) }), u("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
kd.displayName = "Background";
const Ed = he(kd);
function r1() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: u("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function o1() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: u("path", { d: "M0 0h32v4.2H0z" }) });
}
function i1() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: u("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function s1() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function a1() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function pr({ children: e, className: t, ...n }) {
  return u("button", { type: "button", className: be(["react-flow__controls-button", t]), ...n, children: e });
}
const l1 = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Sd({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: f = "bottom-left", orientation: h = "vertical", "aria-label": p }) {
  const g = fe(), { isInteractive: v, minZoomReached: b, maxZoomReached: m, ariaLabelConfig: _ } = ae(l1, ge), { zoomIn: y, zoomOut: w, fitView: N } = oo(), E = () => {
    y(), i == null || i();
  }, C = () => {
    w(), s == null || s();
  }, T = () => {
    N(o), a == null || a();
  }, A = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l == null || l(!v);
  };
  return k(At, { className: be(["react-flow__controls", h === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": p ?? _["controls.ariaLabel"], children: [t && k(me, { children: [u(pr, { onClick: E, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: m, children: u(r1, {}) }), u(pr, { onClick: C, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: b, children: u(o1, {}) })] }), n && u(pr, { className: "react-flow__controls-fitview", onClick: T, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: u(i1, {}) }), r && u(pr, { className: "react-flow__controls-interactive", onClick: A, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? u(a1, {}) : u(s1, {}) }), d] });
}
Sd.displayName = "Controls";
const Nd = he(Sd);
function c1({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: f, selected: h, onClick: p }) {
  const { background: g, backgroundColor: v } = i || {}, b = s || g || v;
  return u("rect", { className: be(["react-flow__minimap-node", { selected: h }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: b,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: p ? (m) => p(m, e) : void 0 });
}
const d1 = he(c1), u1 = (e) => e.nodes.map((t) => t.id), Jo = (e) => e instanceof Function ? e : () => e;
function f1({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = d1,
  onClick: s
}) {
  const a = ae(u1, ge), l = Jo(t), c = Jo(e), d = Jo(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return u(me, { children: a.map((h) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    u(p1, { id: h, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, h)
  )) });
}
function h1({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: f, width: h, height: p } = ae((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const b = v.internals.userNode, { x: m, y: _ } = v.internals.positionAbsolute, { width: y, height: w } = Ye(b);
    return {
      node: b,
      x: m,
      y: _,
      width: y,
      height: w
    };
  }, ge);
  return !c || c.hidden || !bc(c) ? null : u(a, { x: d, y: f, width: h, height: p, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const p1 = he(h1);
var g1 = he(f1);
const m1 = 200, y1 = 150, w1 = (e) => !e.hidden, b1 = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  let n = !1;
  for (const r of e.nodeLookup.values())
    if (!r.hidden) {
      n = !0;
      break;
    }
  return {
    viewBB: t,
    boundingRect: n ? mc(Wn(e.nodeLookup, { filter: w1 }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Ra = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, v1 = (e, t) => Ra(e.viewBB, t.viewBB) && Ra(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, x1 = "react-flow__minimap-desc";
function Cd({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: r,
  nodeClassName: o = "",
  nodeBorderRadius: i = 5,
  nodeStrokeWidth: s,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a,
  bgColor: l,
  maskColor: c,
  maskStrokeColor: d,
  maskStrokeWidth: f,
  position: h = "bottom-right",
  onClick: p,
  onNodeClick: g,
  pannable: v = !1,
  zoomable: b = !1,
  ariaLabel: m,
  inversePan: _,
  zoomStep: y = 1,
  offsetScale: w = 5
}) {
  const N = fe(), E = oe(null), { boundingRect: C, panZoom: T, viewBB: A, rfId: O, translateExtent: L, flowWidth: B, flowHeight: H, ariaLabelConfig: x } = ae(b1, v1), $ = (e == null ? void 0 : e.width) ?? m1, M = (e == null ? void 0 : e.height) ?? y1, S = C.width / $, z = C.height / M, I = Math.max(S, z), D = I * $, P = I * M, V = w * I, X = C.x - (D - C.width) / 2 - V, F = C.y - (P - C.height) / 2 - V, Q = D + V * 2, G = P + V * 2, ee = `${x1}-${O}`, W = oe(0), j = oe();
  W.current = I, ce(() => {
    const ne = N.getState().panZoom;
    if (E.current && ne)
      return j.current = _b({
        domNode: E.current,
        panZoom: ne,
        getTransform: () => N.getState().transform,
        getViewScale: () => W.current
      }), () => {
        var re;
        (re = j.current) == null || re.destroy();
      };
  }, [T]), ce(() => {
    var ne;
    (ne = j.current) == null || ne.update({
      translateExtent: L,
      width: B,
      height: H,
      inversePan: _,
      pannable: v,
      zoomStep: y,
      zoomable: b
    });
  }, [v, b, _, y, L, B, H]);
  const q = p ? (ne) => {
    var ue;
    const [re, se] = ((ue = j.current) == null ? void 0 : ue.pointer(ne)) || [0, 0];
    p(ne, { x: re, y: se });
  } : void 0, K = $e((ne, re) => {
    const se = N.getState().nodeLookup.get(re).internals.userNode;
    g == null || g(ne, se);
  }, [g]), Z = g ? K : void 0, te = m ?? x["minimap.ariaLabel"];
  return u(At, { position: h, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * I : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: be(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: k("svg", { width: $, height: M, viewBox: `${X} ${F} ${Q} ${G}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": ee, ref: E, onClick: q, children: [te && u("title", { id: ee, children: te }), u(g1, { onClick: Z, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), u("path", { className: "react-flow__minimap-mask", d: `M${X - V},${F - V}h${Q + V * 2}v${G + V * 2}h${-Q - V * 2}z
        M${A.x},${A.y}h${A.width}v${A.height}h${-A.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Cd.displayName = "MiniMap";
const Md = he(Cd), _1 = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, k1 = {
  [Zt.Line]: "right",
  [Zt.Handle]: "bottom-right"
};
function E1({ nodeId: e, position: t, variant: n = Zt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: h, autoScale: p = !0, shouldResize: g, onResizeStart: v, onResize: b, onResizeEnd: m }) {
  const _ = td(), y = typeof e == "string" ? e : _, w = fe(), N = oe(null), E = n === Zt.Handle, C = ae($e(_1(E && p), [E, p]), ge), T = oe(null), A = t ?? k1[n];
  ce(() => {
    if (!(!N.current || !y))
      return T.current || (T.current = Ob({
        domNode: N.current,
        nodeId: y,
        getStoreItems: () => {
          const { nodeLookup: L, transform: B, snapGrid: H, snapToGrid: x, nodeOrigin: $, domNode: M } = w.getState();
          return {
            nodeLookup: L,
            transform: B,
            snapGrid: H,
            snapToGrid: x,
            nodeOrigin: $,
            paneDomNode: M
          };
        },
        onChange: (L, B) => {
          const { triggerNodeChanges: H, nodeLookup: x, parentLookup: $, nodeOrigin: M } = w.getState(), S = [], z = { x: L.x, y: L.y }, I = x.get(y);
          if (I && I.expandParent && I.parentId) {
            const D = I.origin ?? M, P = L.width ?? I.measured.width ?? 0, V = L.height ?? I.measured.height ?? 0, X = {
              id: I.id,
              parentId: I.parentId,
              rect: {
                width: P,
                height: V,
                ...vc({
                  x: L.x ?? I.position.x,
                  y: L.y ?? I.position.y
                }, { width: P, height: V }, I.parentId, x, D)
              }
            }, F = es([X], x, $, M);
            S.push(...F), z.x = L.x ? Math.max(D[0] * P, L.x) : void 0, z.y = L.y ? Math.max(D[1] * V, L.y) : void 0;
          }
          if (z.x !== void 0 && z.y !== void 0) {
            const D = {
              id: y,
              type: "position",
              position: { ...z }
            };
            S.push(D);
          }
          if (L.width !== void 0 && L.height !== void 0) {
            const P = {
              id: y,
              type: "dimensions",
              resizing: !0,
              setAttributes: h ? h === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: L.width,
                height: L.height
              }
            };
            S.push(P);
          }
          for (const D of B) {
            const P = {
              ...D,
              type: "position"
            };
            S.push(P);
          }
          H(S);
        },
        onEnd: ({ width: L, height: B }) => {
          const H = {
            id: y,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: L,
              height: B
            }
          };
          w.getState().triggerNodeChanges([H]);
        }
      })), T.current.update({
        controlPosition: A,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: d
        },
        keepAspectRatio: f,
        resizeDirection: h,
        onResizeStart: v,
        onResize: b,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        var L;
        (L = T.current) == null || L.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    d,
    f,
    v,
    b,
    m,
    g
  ]);
  const O = A.split("-");
  return u("div", { className: be(["react-flow__resize-control", "nodrag", ...O, n, r]), ref: N, style: {
    ...o,
    scale: C,
    ...s && { [E ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
he(E1);
const S1 = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", rs = 0.05, xi = 370, $d = 88, N1 = 44, os = 560, Ha = "system-map-flow-css", C1 = `
.system-map-flow .react-flow {
  --xy-background-color: transparent;
  --xy-edge-stroke: var(--border-strong, #a1a1aa);
  --xy-controls-button-background-color: var(--card, #fff);
  --xy-controls-button-background-color-hover: var(--bg-hover, #f4f4f5);
  --xy-controls-button-color: var(--text, #18181b);
  --xy-controls-button-border-color: var(--border, #e4e4e7);
  --xy-minimap-background-color: var(--card, #fff);
  --xy-minimap-node-background-color: var(--border-strong, #a1a1aa);
  --xy-attribution-background-color: transparent;
}
.system-map-flow .react-flow__handle { opacity: 0; pointer-events: none; min-width: 1px; min-height: 1px; }
.system-map-flow .react-flow__node { cursor: pointer; }
`;
if (!document.getElementById(Ha)) {
  const e = document.createElement("style");
  e.id = Ha, e.textContent = S1 + C1, document.head.appendChild(e);
}
function is() {
  return ae((e) => e.width);
}
function M1() {
  return ae((e) => e.height);
}
function Id(e, t, n) {
  return { width: e - Math.min(n, e * 0.5), height: Math.max(120, t - $d - N1) };
}
const $1 = 16;
function Ad(e, t, n = "center") {
  const r = oo(), o = ae((a) => a.width), i = ae((a) => a.height), s = oe(!1);
  ce(() => {
    if (!o || !i || e.length === 0) return;
    const a = Math.min(...e.map((g) => g.x)), l = Math.min(...e.map((g) => g.y)), c = Math.max(...e.map((g) => g.x + g.width)), d = Math.max(...e.map((g) => g.y + g.height)), f = Id(o, i, t), h = eo(
      { x: a, y: l, width: c - a, height: d - l },
      f.width,
      f.height,
      rs,
      1,
      0.05
    ), p = n === "top" ? Math.min(h.y, $1 - l * h.zoom) : h.y;
    r.setViewport({ ...h, y: p + $d }, { duration: s.current ? 200 : 0 }), s.current = !0;
  }, [r, e, t, o, i, n]);
}
function I1({ layers: e }) {
  return /* @__PURE__ */ k("div", { className: "sm-layers", role: "group", "aria-label": "Map layers", children: [
    /* @__PURE__ */ u("span", { className: "sm-layers-label", children: "Layers" }),
    e.map((t) => /* @__PURE__ */ u("button", { type: "button", className: "sm-plain sm-layer", "aria-pressed": t.on, title: t.title, disabled: t.disabled, onClick: t.onToggle, children: t.label }, t.key))
  ] });
}
function Td({ children: e }) {
  return /* @__PURE__ */ u("div", { className: "sm-tools", children: e });
}
function A1({ title: e, onBack: t }) {
  return /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
    /* @__PURE__ */ k(xe, { variant: "aim", children: [
      "Showing: ",
      e
    ] }),
    /* @__PURE__ */ u(ie, { onClick: t, children: "Back to today" })
  ] });
}
const Er = { names: 210, keys: 240, columns: 240 }, _i = 34, Sn = 20, T1 = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, L1 = he(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", f = T1[n.status], h = (f == null ? void 0 : f.color) ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ k(
    "div",
    {
      style: {
        width: l,
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${f ? 2 : 1}px ${d || f != null && f.dashed ? "dashed" : "solid"} ${a ? "var(--accent, #2563eb)" : h}`,
        boxShadow: a ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : void 0,
        fontSize: 12
      },
      children: [
        /* @__PURE__ */ u(gt, { type: "target", position: U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(gt, { type: "source", position: U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              height: _i,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "0 10px",
              fontSize: c ? 16 : 13,
              fontWeight: 600,
              background: r.length ? "var(--bg-hover, #f4f4f5)" : void 0
            },
            children: [
              /* @__PURE__ */ u("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                f && /* @__PURE__ */ u("span", { style: { color: f.color, fontWeight: 600 }, children: n.status }),
                s > 0 && /* @__PURE__ */ k("span", { style: { fontWeight: s > 1 ? 600 : 400, color: s > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
                  s,
                  " at work"
                ] }),
                i > 0 && /* @__PURE__ */ u("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                d && /* @__PURE__ */ u("span", { style: Y, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((p) => /* @__PURE__ */ k(
          "div",
          {
            style: { height: Sn, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ u("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: p.primary ? "PK" : p.foreign ? "FK" : p.proposed ? "new" : "" }),
              /* @__PURE__ */ u("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: p.proposed ? 600 : void 0 }, children: p.name }),
              /* @__PURE__ */ u("span", { style: { ...Y, ...ve, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.type })
            ]
          },
          p.name
        )),
        o > 0 && /* @__PURE__ */ k("div", { style: { ...Y, height: Sn, padding: "0 10px", lineHeight: `${Sn}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), z1 = { table: L1 };
function Ld(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Wr(e, t) {
  if (t === "names") return _i + 2;
  const n = Ld(e, t).length;
  return _i + n * Sn + (n < e.columns.length ? Sn : 0) + 2;
}
function O1(e, t) {
  const n = Er[t], r = new $r.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Wr(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  $r.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Wr(a, t) / 2 });
  }
  return s;
}
function P1(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const ki = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function D1(e) {
  return (ki.find(([t]) => t === e) ?? ki[2])[1];
}
function R1() {
  return /* @__PURE__ */ k(
    "div",
    {
      "data-testid": "legend",
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        /* @__PURE__ */ u("span", { style: Y, children: "On delete" }),
        ki.map(([e, t]) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function H1({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  tools: i,
  onSelect: s
}) {
  const { mode: a } = Xa(), l = is() >= os, c = le(() => t ? P1(e, t) : e, [e, t]), d = t && o === "names" ? "keys" : o, f = le(() => O1(c, d), [c, d]), h = le(
    () => c.tables.map((v) => {
      const b = Ld(v, d);
      return {
        id: v.id,
        type: "table",
        position: f.get(v.id) ?? { x: 0, y: 0 },
        width: Er[d],
        height: Wr(v, d),
        data: {
          table: v,
          columns: b,
          hidden: d === "names" ? 0 : v.columns.length - b.length,
          flags: n.get(v.id) ?? 0,
          working: r.get(v.id) ?? 0,
          focused: v.id === t,
          width: Er[d],
          large: d === "names"
        }
      };
    }),
    [c, d, f, n, r, t]
  ), p = le(
    () => c.edges.map((v) => {
      const b = D1(v.on_delete);
      return {
        id: v.id,
        source: v.source,
        target: v.target,
        selectable: !1,
        markerEnd: { type: Ut.ArrowClosed, width: 14, height: 14, color: b },
        style: { stroke: b, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [c, t]
  ), g = le(
    () => c.tables.map((v) => ({
      ...f.get(v.id) ?? { x: 0, y: 0 },
      width: Er[d],
      height: Wr(v, d)
    })),
    [c, f, d]
  );
  return Ad(g, t ? xi : 0), /* @__PURE__ */ k(
    _d,
    {
      nodes: h,
      edges: p,
      nodeTypes: z1,
      colorMode: a,
      minZoom: rs,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (v, b) => s(b.id),
      onPaneClick: () => s(null),
      children: [
        /* @__PURE__ */ u(Ed, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(Nd, { showInteractive: !1 }),
        l && /* @__PURE__ */ u(Md, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u(At, { position: "top-left", children: /* @__PURE__ */ k(Td, { children: [
          i,
          /* @__PURE__ */ u(R1, {})
        ] }) })
      ]
    }
  );
}
function W1(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ u(ns, { children: /* @__PURE__ */ u(H1, { ...e }) }) });
}
const B1 = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], V1 = {
  whatif: {
    placeholder: "What if we sent weekly reminders?",
    ask: (e) => `Use the system-map tools. Draft a proposal with \`propose\` for this idea, using the real schema, and fix what its limits show: ${e}`
  },
  cases: {
    placeholder: "A customer sees which invoices are due this week",
    ask: (e) => `Use the system-map tools. Map this use case with \`use_case\`, to the routes, tables and modules it needs, naming parts that do not exist yet: ${e}`
  },
  views: {
    placeholder: "Show everything around the users table",
    ask: (e) => `Use the system-map tools. Save this as a view with \`save_view\`: ${e}`
  }
}, F1 = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], zd = { accepted: "ok", dropped: "muted", draft: "aim" }, Wa = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, ss = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, j1 = { ...ss, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, Y1 = { ...Y, ...ve, fontSize: 11, overflowWrap: "anywhere" };
function On(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function Ei(e) {
  return en(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function Si({ title: e, children: t }) {
  return /* @__PURE__ */ k("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function Od({ limit: e }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ u(Pn, { severity: e.severity }),
    /* @__PURE__ */ k("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ u("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u("div", { style: { ...Y, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ u("div", { style: Y1, children: e.evidence.join("  ") })
    ] })
  ] });
}
function gr({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ u(Si, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ u("button", { style: { ...Me, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? Ei(o.id) }),
    r && /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function G1({
  proposal: e,
  shown: t,
  canAsk: n,
  onBack: r,
  onDraw: o,
  onNode: i,
  onAsk: s,
  onStatus: a,
  onDelete: l
}) {
  const c = e.sql.flatMap((d) => d.sql);
  return /* @__PURE__ */ k("div", { "data-testid": "proposal-detail", children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ u(ie, { onClick: r, children: "Back" }),
      /* @__PURE__ */ u("strong", { style: { fontSize: 14, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(xe, { variant: zd[e.status], children: e.status }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(ie, { primary: t, onClick: () => o("map"), children: "Show on map" }),
      /* @__PURE__ */ u(ie, { onClick: () => o("data"), children: "Show in data model" }),
      /* @__PURE__ */ u(ie, { onClick: s, disabled: !n, children: "Ask" })
    ] }),
    e.why && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13, margin: "6px 0 0" }, children: e.why }),
    e.closes.map((d) => /* @__PURE__ */ k("p", { style: { fontSize: 13, margin: "8px 0 0" }, "data-testid": "closes", children: [
      "Closes ",
      d.before - d.after,
      " of ",
      On(d.before, "gap"),
      " in ",
      /* @__PURE__ */ u("strong", { children: d.title }),
      "."
    ] }, d.id)),
    F1.map(({ kind: d, title: f }) => {
      const h = e.limits.filter((p) => p.kind === d);
      return h.length === 0 ? null : /* @__PURE__ */ u(Si, { title: `${f} (${h.length})`, children: h.map((p, g) => /* @__PURE__ */ u(Od, { limit: p }, g)) }, d);
    }),
    /* @__PURE__ */ u(gr, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ u(gr, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ u(gr, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ u(gr, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    e.limits_checked === !1 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, "data-testid": "limits-note", children: "Limits check Postgres only, so this hasn't been checked against this project's database." }),
    c.length > 0 && /* @__PURE__ */ u(Si, { title: "Draft SQL", children: /* @__PURE__ */ u("pre", { style: { ...ve, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
`) }) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      e.status !== "accepted" && /* @__PURE__ */ u(ie, { primary: !0, onClick: () => a("accepted"), children: "Accept" }),
      e.status !== "dropped" && /* @__PURE__ */ u(ie, { onClick: () => a("dropped"), children: "Drop" }),
      e.status !== "draft" && /* @__PURE__ */ u(ie, { onClick: () => a("draft"), children: "Back to draft" }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(ie, { danger: !0, onClick: l, children: "Delete" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 12, marginBottom: 0 }, children: "This stays in System Map. Nothing here changes your repo." })
  ] });
}
function X1({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ k("button", { style: j1, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ k("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ u(xe, { variant: "err", children: On(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ k(xe, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ u(xe, { variant: zd[n.status], children: n.status })
      ] }),
      /* @__PURE__ */ k("span", { style: { ...Y, fontSize: 12 }, children: [
        n.diff.added,
        " added, ",
        n.diff.changed,
        " changed, ",
        n.diff.removed,
        " removed, ",
        n.diff.touched,
        " touched"
      ] })
    ] }, n.id);
  }) });
}
function U1(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${On(n, "unit test")}`, t ? On(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${jr(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function q1({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ k("div", { style: ss, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(xe, { variant: Wa[e.state].variant, children: Wa[e.state].label }),
      /* @__PURE__ */ u("button", { style: Me, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ u("button", { style: { ...Me, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ u("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ u(Od, { limit: i }, s)) }),
    /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ u("tbody", { children: e.parts.map((i) => /* @__PURE__ */ k("tr", { children: [
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", ...Y }, children: i.kind }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ u("button", { style: { ...Me, textAlign: "left" }, onClick: () => n(i.id), children: Ei(i.id) }) : Ei(i.id) }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 0", ...Y, textAlign: "right" }, children: U1(i) })
    ] }, i.id)) }) })
  ] });
}
function K1({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ k("div", { style: { ...ss, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ u("button", { style: { ...Me, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ k("span", { style: { ...Y, fontSize: 12 }, children: [
      On(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ u("button", { style: { ...Me, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function Z1({
  data: e,
  proposal: t,
  shownProposal: n,
  canAsk: r,
  tab: o,
  onTab: i,
  onSend: s,
  onOpenProposal: a,
  onDrawProposal: l,
  onStatus: c,
  onDelete: d,
  onOpenView: f,
  onNode: h
}) {
  const [p, g] = J(""), v = V1[o], b = () => {
    p.trim() && (s(v.ask(p.trim())), g(""));
  };
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: B1.map(([m, _]) => /* @__PURE__ */ u(ie, { primary: o === m, onClick: () => i(m), children: _ }, m)) }),
    /* @__PURE__ */ k(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (m) => {
          m.preventDefault(), b();
        },
        children: [
          /* @__PURE__ */ u(Vr, { "aria-label": "Describe it", placeholder: v.placeholder, value: p, onChange: (m) => g(m.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ u(ie, { primary: !0, type: "submit", disabled: !r || !p.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ u(
        G1,
        {
          proposal: t,
          shown: n === t.id,
          canAsk: r,
          onBack: () => a(null),
          onDraw: l,
          onNode: h,
          onAsk: () => s(`Use the system-map tools. Read proposal ${t.id}, say what stands in the way, and how to get past it.`),
          onStatus: (m) => c(t.id, m),
          onDelete: () => d("proposals", t.id)
        }
      ) : /* @__PURE__ */ u(X1, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((m) => /* @__PURE__ */ u(
          q1,
          {
            item: m,
            canAsk: r,
            onShow: h,
            onAsk: () => s(`Use the system-map tools. Look at use case ${m.id}, and propose what would close its gaps.`),
            onDelete: () => d("use_cases", m.id)
          },
          m.id
        ))
      ] }),
      o === "views" && /* @__PURE__ */ u(K1, { rows: e.views, onOpen: f, onDelete: (m) => d("views", m) })
    ] })
  ] });
}
const Q1 = ["high", "medium", "low", "info"];
function J1({
  findings: e,
  noSchema: t = !1,
  onShow: n,
  onAsk: r
}) {
  const [o, i] = J(null), s = le(() => {
    const l = /* @__PURE__ */ new Map();
    for (const c of e) l.set(c.severity, (l.get(c.severity) ?? 0) + 1);
    return l;
  }, [e]), a = o ? e.filter((l) => l.severity === o) : e;
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ k(ie, { primary: o === null, onClick: () => i(null), children: [
        "All ",
        e.length
      ] }),
      Q1.filter((l) => s.get(l)).map((l) => /* @__PURE__ */ k(ie, { primary: o === l, onClick: () => i(l), children: [
        l,
        " ",
        s.get(l)
      ] }, l))
    ] }),
    a.length === 0 && /* @__PURE__ */ u("p", { style: Y, children: t ? "No schema was read, so the table rules didn't run." : "No findings." }),
    a.map((l) => /* @__PURE__ */ k("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ k("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ u(Pn, { severity: l.severity }),
        /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600 }, children: l.title }),
        /* @__PURE__ */ u("button", { style: Me, onClick: () => n(l.node), children: "Show" }),
        /* @__PURE__ */ u("button", { style: Me, onClick: () => r(l), children: "Ask" })
      ] }),
      /* @__PURE__ */ u("p", { style: { margin: "4px 0 0" }, children: l.detail }),
      /* @__PURE__ */ u("p", { style: { ...Y, ...ve, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: l.evidence.join("  ") })
    ] }, l.id))
  ] });
}
const Pd = 560, Br = 760, e_ = 1100;
function t_(e, t) {
  const n = e >= e_, r = t && e >= Br ? n ? "220px" : "170px" : null, o = n ? "minmax(320px, 26%)" : e >= Br ? "260px" : e >= Pd ? "240px" : null;
  return [r, "minmax(0, 1fr)", o].filter(Boolean).join(" ");
}
function n_(e, t, n, r, o) {
  const i = e.map((d, f) => f);
  if (e.reduce((d, f) => d + f, 0) + o * Math.max(0, e.length - 1) <= t) return { visible: i, hidden: [] };
  const a = t - n - o, l = [];
  let c = 0;
  for (const d of i) {
    const f = c + (l.length ? o : 0) + e[d];
    if (f > a) break;
    l.push(d), c = f;
  }
  if (r >= 0 && !l.includes(r)) {
    for (; l.length > 0 && c + o + e[r] > a; ) {
      const d = l.pop();
      c -= e[d] + (l.length ? o : 0);
    }
    l.push(r);
  }
  return { visible: l, hidden: i.filter((d) => !l.includes(d)) };
}
const r_ = [
  { key: "in_starts", title: "Starts from" },
  { key: "in_hands_off_to", title: "Handed work by" },
  { key: "out_hands_off_to", title: "Hands off to" },
  { key: "out_uses_model", title: "Uses model" },
  { key: "out_starts", title: "Starts agents" },
  { key: "in_uses_model", title: "Agents that use it" },
  { key: "in_renders", title: "Routes that render it" },
  { key: "out_uses_table", title: "Tables it uses" },
  { key: "in_uses_table", title: "Used by" },
  { key: "out_uses_service", title: "Outside services" },
  { key: "in_uses_service", title: "Used by" },
  { key: "out_imports", title: "Imports" },
  { key: "in_imports", title: "Imported by" },
  { key: "out_renders", title: "Renders" },
  { key: "out_calls", title: "Calls" },
  { key: "in_calls", title: "Called by" },
  { key: "in_touches", title: "Plans that touch it" },
  { key: "out_touches", title: "Touches" }
];
function Dd(e) {
  return en(e.replace(/^(module|area|route|job|service|plan|table|agent):(public\.)?/, ""));
}
function Tt({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function o_({ link: e, onOpen: t }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: () => t(e.node),
        style: {
          background: "transparent",
          border: 0,
          padding: 0,
          fontSize: 13,
          cursor: "pointer",
          textAlign: "left",
          color: "var(--accent, #2563eb)",
          overflowWrap: "anywhere"
        },
        children: Dd(e.node)
      }
    ),
    e.access && /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function i_({ node: e, onOpen: t }) {
  return /* @__PURE__ */ u(me, { children: r_.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ u(Tt, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ u(o_, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function s_({ node: e }) {
  var r;
  const n = [
    ["Path", e.path],
    ["Files", e.files],
    ["Lines", e.lines],
    ["Test files", e.test_files],
    ["Schedule", e.schedule],
    ["Jobs", (r = e.jobs) == null ? void 0 : r.join(", ")],
    ["Status", e.status]
  ].filter(([, o]) => o !== void 0 && o !== "");
  return /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ u("tbody", { children: n.map(([o, i]) => /* @__PURE__ */ k("tr", { children: [
    /* @__PURE__ */ u("td", { style: { ...Y, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: o }),
    /* @__PURE__ */ u("td", { style: { overflowWrap: "anywhere" }, children: i })
  ] }, o)) }) });
}
function a_({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ u(Tt, { title: `Not found (${n.length})`, children: /* @__PURE__ */ u("ul", { style: { ...ve, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ u("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function l_({ node: e }) {
  const t = e.asks_you ?? [], n = e.leaves_region ?? [];
  return /* @__PURE__ */ k(me, { children: [
    e.description && /* @__PURE__ */ u("p", { style: { margin: "0 0 12px" }, children: e.description }),
    n.length > 0 && /* @__PURE__ */ u(Tt, { title: "Leaves your home region", children: /* @__PURE__ */ u("p", { style: { margin: 0, color: "var(--danger, #dc2626)" }, children: n.map(Dd).join(", ") }) }),
    /* @__PURE__ */ u(Tt, { title: `Asks you (${t.length})`, children: t.length === 0 ? /* @__PURE__ */ u("p", { style: { ...Y, margin: 0 }, children: "No call that leaves work for a person was found." }) : /* @__PURE__ */ u("ul", { style: { ...ve, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: t.map((r) => /* @__PURE__ */ u("li", { children: r }, r)) }) })
  ] });
}
function c_({ node: e, onRegion: t }) {
  const [n, r] = J(e.region ?? ""), [o, i] = J(null), [s, a] = J(!1), l = async (d) => {
    a(!0), i(await t(e.id, d)), a(!1);
  }, c = n.trim() === (e.region ?? "");
  return /* @__PURE__ */ k(Tt, { title: "Region", children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6 }, children: [
      /* @__PURE__ */ u(Vr, { "aria-label": `Region of ${e.name}`, placeholder: "Where it runs, such as US", value: n, onChange: (d) => r(d.target.value), style: { flex: 1, minWidth: 0 } }),
      /* @__PURE__ */ u(ie, { disabled: s || !n.trim() || c, onClick: () => void l(n.trim()), children: "Save" }),
      e.region && /* @__PURE__ */ u(ie, { disabled: s, onClick: () => void l(null), children: "Clear" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 11, margin: "4px 0 0" }, children: "You set this. Agents that use it are checked against your home region." }),
    o && /* @__PURE__ */ u("p", { style: { color: "var(--danger, #dc2626)", margin: "4px 0 0" }, children: o })
  ] });
}
function d_({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${jr(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ k(Tt, { title: n ? `Risk: ${n}` : "Risk", children: [
    /* @__PURE__ */ k("p", { style: { margin: "0 0 4px" }, children: [
      e.commits,
      " commits in ",
      e.window_days,
      " days, ",
      e.complexity,
      " paths, tests: ",
      t,
      "."
    ] }),
    e.worst_files.length > 0 && /* @__PURE__ */ u("ul", { style: { ...ve, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ u("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: en(r.path) }, r.path)) })
  ] });
}
function u_({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ k(Tt, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ u("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ u("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ k("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ u(Pn, { severity: n.severity }),
      /* @__PURE__ */ u("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function f_({
  node: e,
  work: t,
  overlaps: n,
  onAsk: r,
  onOpen: o,
  onClose: i,
  canAsk: s,
  onAskFinding: a,
  onRegion: l
}) {
  var d;
  const c = e.id.startsWith("table:");
  return /* @__PURE__ */ k(
    "div",
    {
      "data-testid": "inspector",
      style: {
        position: "absolute",
        top: 12,
        right: 12,
        bottom: 12,
        width: 340,
        maxWidth: "60%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        boxSizing: "border-box",
        borderRadius: 8,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        boxShadow: "0 4px 16px rgba(0,0,0,.12)",
        zIndex: 5
      },
      children: [
        /* @__PURE__ */ k("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ u("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.label ?? e.name }),
          !c && /* @__PURE__ */ u(xe, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ u(ie, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ u(ie, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ k("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ u(u_, { names: t, overlaps: n }),
          e.kind === "agent" && /* @__PURE__ */ u(l_, { node: e }),
          e.kind === "service" && l && /* @__PURE__ */ u(c_, { node: e, onRegion: l }, `${e.id}|${e.region ?? ""}`),
          e.risk && /* @__PURE__ */ u(d_, { risk: e.risk }),
          c ? /* @__PURE__ */ u(Kd, { node: e, onAsk: a }) : /* @__PURE__ */ u(s_, { node: e }),
          !c && /* @__PURE__ */ u(a_, { node: e }),
          /* @__PURE__ */ u(i_, { node: e, onOpen: o }),
          !c && /* @__PURE__ */ u("p", { style: { ...Y, ...ve, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (d = e.evidence) == null ? void 0 : d.join("  ") })
        ] })
      ]
    }
  );
}
const h_ = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], p_ = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, g_ = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function m_({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ k("div", { style: g_, "data-testid": e.id, children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ k("p", { style: { ...Y, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      p_[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ k("ul", { style: { ...ve, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ u("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ k("li", { style: Y, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ u("button", { style: Me, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ u("button", { style: Me, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ k(
        "select",
        {
          "aria-label": `Status of ${e.name}`,
          value: e.status_source === "you" ? e.status : "",
          onChange: (i) => r(e.id, i.target.value || null),
          style: { fontSize: 11, background: "transparent", color: "var(--muted, #71717a)", border: 0 },
          children: [
            /* @__PURE__ */ u("option", { value: "", children: "Auto" }),
            /* @__PURE__ */ u("option", { value: "built", children: "Mark built" }),
            /* @__PURE__ */ u("option", { value: "partial", children: "Mark partly built" }),
            /* @__PURE__ */ u("option", { value: "planned", children: "Mark not built" })
          ]
        }
      )
    ] })
  ] });
}
function y_({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ u("strong", { children: i === 0 ? "Nothing here can be checked yet." : o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 13 }, children: i === 0 ? "These plans name no files, so the code can't confirm them." : "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ u("p", { style: Y, children: "No plans found. System Map looks in docs/specs, docs/plans and specs, and for a BRIEF, PLAN, ROADMAP, PRD, SPEC or TODO file at the top of the repo." }),
    /* @__PURE__ */ u("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: h_.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ k("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ k("div", { children: [
          /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ u(xe, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ u("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ u(m_, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function w_(e, t, n) {
  return { key: "plans", label: e > 0 ? `Plans ${e}` : "Plans", on: t, title: "Show unfinished plans on the map", onToggle: n };
}
const b_ = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], rt = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, ei = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, Ba = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function v_({ share: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ u("span", { style: { minWidth: 32, textAlign: "right" }, children: jr(e) })
  ] });
}
function x_({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ u(xe, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ u(xe, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ u(xe, { variant: "muted", children: "Untested" }) : null;
}
function __(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function k_({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k(xe, { variant: "muted", children: [
        jr(i.lines_hit / i.lines_total),
        " of lines run by tests"
      ] }),
      /* @__PURE__ */ k("span", { style: Y, children: [
        i.commit ? `Report from ${i.commit.slice(0, 7)}` : "Report from an unknown commit",
        i.files_changed_since ? `, ${i.files_changed_since} files changed since` : ""
      ] })
    ] }) : /* @__PURE__ */ u("span", { style: Y, children: "No coverage report yet. Showing which tests reach each file through imports." }),
    /* @__PURE__ */ u("span", { style: { flex: 1 } }),
    n && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: n }),
    /* @__PURE__ */ u(ie, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ u(ie, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function E_({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = J("modules"), [c, d] = J(!0), [f, h] = J(!1), [p, g] = J("score"), v = e.coverage !== null, b = le(() => e[a].filter((w) => a === "modules" || !f || !w.ui), [e, a, f]), m = b.filter((w) => w.hot && w.untested), _ = le(() => {
    const w = c && m.length > 0 ? m : b;
    if (p === "score") return w;
    const N = p === "cover" ? 1 : -1;
    return [...w].sort((E, C) => N * (E[p] - C[p]));
  }, [b, c, p]), y = a === "modules" ? "module" : "file";
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "risk-summary", children: [
      /* @__PURE__ */ u("strong", { children: e.test_files === 0 ? "No tests yet." : m.length === 0 ? "Nothing busy is short of tests." : `${m.length} busy ${y}${m.length === 1 ? " has" : "s have"} little test cover.` }),
      " ",
      /* @__PURE__ */ k("span", { style: { ...Y, fontSize: 13 }, children: [
        "Busy means more commits than three in four others, over ",
        e.window_days,
        " days. Little cover means under half."
      ] })
    ] }),
    e.test_files === 0 && /* @__PURE__ */ u("p", { style: { ...Y, margin: 0, fontSize: 13 }, "data-testid": "no-tests", children: "This project has no tests yet, so everything counts as untested. The list below is ranked by how complex and busy each part is." }),
    !e.history_known && /* @__PURE__ */ u("p", { style: { ...Y, margin: 0, fontSize: 13 }, children: "No git history here, so commits are not counted." }),
    e.shallow && /* @__PURE__ */ u("p", { style: { ...Y, margin: 0, fontSize: 13 }, children: "This is a shallow clone, so commits are undercounted." }),
    /* @__PURE__ */ u(k_, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ u(ie, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ u(ie, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ u("span", { style: { width: 8 } }),
      m.length > 0 && /* @__PURE__ */ u(ie, { primary: c, onClick: () => d((w) => !w), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ u(ie, { primary: f, onClick: () => h((w) => !w), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ u("th", { style: { ...rt, textAlign: "left" }, children: /* @__PURE__ */ k("button", { style: ei, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          b_.map((w) => /* @__PURE__ */ u("th", { style: rt, children: /* @__PURE__ */ u("button", { style: { ...ei, color: p === w.key ? "var(--text, inherit)" : ei.color }, title: w.title, onClick: () => g(w.key), children: w.label }) }, w.key)),
          /* @__PURE__ */ u("th", { style: rt })
        ] }) }),
        /* @__PURE__ */ u("tbody", { children: _.map((w) => /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ k("td", { style: { ...rt, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ u(
              "button",
              {
                onClick: () => r(w.id ?? w.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...Ba, ...ve } : Ba,
                children: en(w.path)
              }
            ),
            " ",
            /* @__PURE__ */ u(x_, { row: w })
          ] }),
          /* @__PURE__ */ u("td", { style: rt, children: w.commits }),
          /* @__PURE__ */ u("td", { style: rt, children: w.complexity }),
          /* @__PURE__ */ u("td", { style: rt, children: v ? /* @__PURE__ */ u(v_, { share: w.covered ?? 0 }) : /* @__PURE__ */ u("span", { style: Y, children: __(w, a) }) }),
          /* @__PURE__ */ u("td", { style: rt, children: w.lines }),
          /* @__PURE__ */ u("td", { style: rt, children: /* @__PURE__ */ u("button", { style: Me, onClick: () => o(w.id ?? w.path), disabled: !t, children: "Ask" }) })
        ] }, w.path)) })
      ] }),
      _.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
function S_({
  status: e,
  detail: t,
  commit: n,
  builtAt: r,
  read: o,
  busy: i,
  result: s,
  onRebuild: a
}) {
  const l = i ? "Rebuilding" : e.label;
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
    /* @__PURE__ */ u("span", { role: "status", style: { ...Y, fontSize: 13 }, "data-testid": "rebuild-result", children: !i && s }),
    e.rebuild && !i && /* @__PURE__ */ u(ie, { primary: !0, onClick: a, children: "Rebuild" }),
    /* @__PURE__ */ u(
      Za,
      {
        width: 270,
        align: "right",
        label: "Model status",
        trigger: (c) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-chip", "data-testid": "status-chip", ...c, children: [
          /* @__PURE__ */ u("span", { className: "sm-dot", "data-tone": i ? "muted" : e.tone }),
          l,
          /* @__PURE__ */ u(Qa, {})
        ] }),
        children: () => /* @__PURE__ */ k("div", { style: { padding: 8 }, children: [
          /* @__PURE__ */ u("div", { style: { fontWeight: 600, marginBottom: 2, overflowWrap: "anywhere" }, children: t ?? e.detail }),
          /* @__PURE__ */ k("div", { style: { ...Y, marginBottom: 10 }, children: [
            n ? /* @__PURE__ */ u("span", { className: "sm-mono", children: n.slice(0, 7) }) : "This folder",
            ", built ",
            Zd(r, Date.now() / 1e3)
          ] }),
          o && /* @__PURE__ */ k("div", { style: { marginBottom: 10 }, "data-testid": "build-read", children: [
            Qd(o).map((c) => /* @__PURE__ */ u("div", { children: c }, c)),
            o.unread.map((c) => /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
              "Not read: ",
              c.what,
              c.where && /* @__PURE__ */ u("div", { className: "sm-mono", style: { ...Y, overflowWrap: "anywhere" }, children: c.where })
            ] }, c.what))
          ] }),
          e.label !== "Folder missing" && /* @__PURE__ */ u(ie, { primary: e.rebuild, disabled: i, onClick: a, autoFocus: !0, children: i ? "Rebuilding" : "Rebuild" })
        ] })
      }
    )
  ] });
}
const mr = 10;
function Ni(e, t) {
  const n = (e.bands ?? []).filter((s) => s.members.length > 0), r = new $r.graphlib.Graph({ multigraph: !0, compound: n.length > 0 });
  r.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  for (const s of e.cards) r.setNode(s.id, { width: _n, height: xn });
  for (const s of n) {
    r.setNode(s.id, {});
    for (const a of s.members) r.setParent(a, s.id);
  }
  for (const s of e.lines)
    s.source !== s.target && r.setEdge(s.source, s.target, {}, s.id);
  $r.layout(r);
  const o = /* @__PURE__ */ new Map();
  for (const s of e.cards) {
    const a = r.node(s.id);
    o.set(s.id, { x: a.x - _n / 2, y: a.y - xn / 2 });
  }
  const i = n.map((s) => {
    const a = s.members.map((h) => o.get(h)).filter((h) => !!h), l = Math.min(...a.map((h) => h.x)) - mr, c = Math.min(...a.map((h) => h.y)) - mr, d = Math.max(...a.map((h) => h.x + _n)) + mr, f = Math.max(...a.map((h) => h.y + xn)) + mr;
    return { ...s, x: l, y: c, width: d - l, height: f - c };
  });
  return { places: o, bands: i };
}
function N_(e) {
  const t = [
    ...[...e.places.values()].map((s) => ({ x: s.x, y: s.y, width: _n, height: xn })),
    ...e.bands
  ];
  if (t.length === 0) return { width: 0, height: 0 };
  const n = Math.min(...t.map((s) => s.x)), r = Math.min(...t.map((s) => s.y)), o = Math.max(...t.map((s) => s.x + s.width)), i = Math.max(...t.map((s) => s.y + s.height));
  return { width: o - n, height: i - r };
}
const C_ = 1.15;
function Va(e, t, n) {
  const r = N_(e);
  return Math.min(1, t / Math.max(r.width, 1), n / Math.max(r.height, 1));
}
function M_(e, t, n) {
  const r = Ni(e, "LR");
  if (t <= 0 || n <= 0) return { ...r, direction: "LR" };
  const o = Ni(e, "TB");
  return Va(o, t, n) > Va(r, t, n) * C_ ? { ...o, direction: "TB" } : { ...r, direction: "LR" };
}
const Ci = _n, Mi = xn, Fa = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  agent: "agent",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, $_ = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)",
  empty: "var(--warn-text, #b45309)"
}, I_ = { empty: "no jobs" }, Sr = {
  imports: { color: "var(--border-strong, #a1a1aa)", label: "imports" },
  renders: { color: "var(--muted, #71717a)", label: "renders" },
  uses_table: { color: "var(--accent, #2563eb)", label: "uses table" },
  uses_service: { color: "var(--warn-text, #b45309)", label: "uses service" },
  calls: { color: "var(--text, #18181b)", label: "calls" },
  touches: { color: "var(--danger, #dc2626)", dashed: !0, label: "plan touches" },
  starts: { color: "var(--text, #18181b)", label: "starts" },
  hands_off_to: { color: "var(--accent, #2563eb)", label: "hands off" },
  uses_model: { color: "var(--warn-text, #b45309)", dashed: !0, label: "uses model" },
  leaves_region: { color: "var(--danger, #dc2626)", label: "leaves region" }
}, A_ = {
  home: "var(--ok, #15803d)",
  away: "var(--danger, #dc2626)",
  unknown: "var(--muted, #71717a)"
}, Nr = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, T_ = he(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i, down: s } = t, a = n.status === "proposed", l = n.kind === "plan" || a || n.kind === "agent" && n.status !== void 0, c = n.kind === "service", d = o.length > 1, f = a ? "var(--accent, #2563eb)" : l ? $_[n.status ?? "unclear"] : d ? "var(--warn-text, #b45309)" : void 0, h = r ? "var(--accent, #2563eb)" : f ?? (n.strong ? "var(--text, #18181b)" : "var(--border-strong, #a1a1aa)"), p = r || d ? 2 : n.strong ? 1.5 : 1;
  return /* @__PURE__ */ k(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: Ci,
        height: Mi,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 12px",
        borderRadius: c ? 29 : 8,
        background: n.kind === "group" ? "var(--bg-hover, #f4f4f5)" : "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${p}px ${l || c ? "dashed" : "solid"} ${h}`,
        boxShadow: [i ? `inset 5px 0 0 ${Nr[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ u(gt, { type: "target", position: s ? U.Top : U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(gt, { type: "source", position: s ? U.Bottom : U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          l && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: f, flexShrink: 0 }, children: I_[n.status ?? ""] ?? n.status }),
          i && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: Nr[i].color, flexShrink: 0 }, children: Nr[i].label })
        ] }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [Fa[n.kind] && n.kind !== "area" && n.kind !== "plan" ? Fa[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ k("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: d ? 600 : 400, color: d ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] }),
          o.length === 0 && n.badge && /* @__PURE__ */ u("span", { style: { fontSize: 11, flexShrink: 0, color: "var(--info, #2563eb)" }, children: n.badge })
        ] })
      ]
    }
  );
}), L_ = he(function({ data: t }) {
  const n = A_[t.band.tone];
  return /* @__PURE__ */ u("div", { "data-testid": t.band.id, style: { width: "100%", height: "100%", boxSizing: "border-box", borderRadius: 14, border: `1.5px dashed ${n}`, pointerEvents: "none" }, children: /* @__PURE__ */ u("span", { style: { position: "absolute", top: -9, left: 12, padding: "0 4px", fontSize: 11, fontWeight: 600, lineHeight: "16px", color: n, background: "var(--bg, #fff)" }, children: t.band.label }) });
}), z_ = { card: T_, band: L_ };
function O_(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function P_(e) {
  const t = e.leaves ? Sr.leaves_region : Sr[e.kind] ?? Sr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: Ut.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: O_(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function D_({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(Sr).filter(([i]) => e.has(i)), o = is();
  return /* @__PURE__ */ k(
    "div",
    {
      "data-testid": "legend",
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        width: "max-content",
        // Clear of the zoom buttons, and of the minimap when there is one.
        maxWidth: Math.max(120, o - (o < os ? 130 : 290)),
        whiteSpace: "nowrap",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        r.map(([i, s]) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 14, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` } }),
          s.label
        ] }, i)),
        n && Object.values(Nr).map((i) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 5, height: 12, background: i.color } }),
          i.label
        ] }, i.label)),
        t && /* @__PURE__ */ u("span", { style: Y, children: "Thin links hidden" })
      ]
    }
  );
}
function R_({ system: e, focus: t, agents: n, onFocus: r }) {
  const o = ou(e, t, n);
  return /* @__PURE__ */ u(
    "nav",
    {
      "aria-label": "Map level",
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        padding: "4px 10px",
        fontSize: 13,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: o.map((i, s) => {
        const a = s === o.length - 1;
        return /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6 }, children: [
          s > 0 && /* @__PURE__ */ u("span", { style: Y, children: "/" }),
          /* @__PURE__ */ u(
            "button",
            {
              onClick: () => r(i.id),
              disabled: a,
              style: {
                background: "transparent",
                border: 0,
                padding: 0,
                fontSize: 13,
                cursor: a ? "default" : "pointer",
                fontWeight: a ? 600 : 400,
                color: a ? "var(--text, inherit)" : "var(--accent, #2563eb)"
              },
              children: i.label
            }
          )
        ] }, i.label);
      })
    }
  );
}
function H_({
  system: e,
  focus: t,
  tables: n,
  showPlans: r,
  inspecting: o,
  risk: i,
  worktrees: s,
  only: a,
  layout: l,
  agents: c,
  tools: d,
  onFocus: f,
  onOpenTables: h
}) {
  const { mode: p } = Xa(), g = is(), v = M1(), b = g >= os, m = c ? null : t, _ = le(
    () => a ? Jd(e, a, n) : eu(e, m, n, r, c),
    [e, a, m, n, r, c]
  ), y = c && !a, w = Id(g, v, o ? xi : 0), N = y ? w.width : 0, E = y ? w.height : 0, C = le(() => {
    if (y) return M_(_, N, E);
    const S = l === "top-down" ? "TB" : "LR";
    return { ...Ni(_, S), direction: S };
  }, [_, l, y, N, E]), T = C.direction === "TB", A = C.places, O = le(() => tu(i), [i]), L = s == null ? void 0 : s.by_node, B = le(
    () => [
      ...C.bands.map((S) => ({
        id: S.id,
        type: "band",
        position: { x: S.x, y: S.y },
        width: S.width,
        height: S.height,
        zIndex: -1,
        selectable: !1,
        draggable: !1,
        focusable: !1,
        data: { band: S }
      })),
      ..._.cards.map((S) => ({
        id: S.id,
        type: "card",
        position: A.get(S.id) ?? { x: 0, y: 0 },
        width: Ci,
        height: Mi,
        data: { card: S, focused: S.id === t, work: L ? ru(S.id, L) : [], band: nu(O.get(S.id)), down: T }
      }))
    ],
    [_, C, A, t, O, L, T]
  ), H = le(() => _.lines.map(P_), [_]), x = le(
    () => [
      ..._.cards.map((S) => ({ ...A.get(S.id) ?? { x: 0, y: 0 }, width: Ci, height: Mi })),
      ...C.bands.map((S) => ({ x: S.x, y: S.y, width: S.width, height: S.height }))
    ],
    [_, A, C]
  );
  Ad(x, o ? xi : 0, c && !a ? "top" : "center");
  const $ = le(() => new Set(_.lines.map((S) => S.leaves ? "leaves_region" : S.kind)), [_]), M = (S) => {
    if (!S.startsWith("band:"))
      if (S === iu) h();
      else {
        if (S !== su && S !== au && S === t) return;
        f(S);
      }
  };
  return /* @__PURE__ */ k(
    _d,
    {
      nodes: B,
      edges: H,
      nodeTypes: z_,
      colorMode: p,
      minZoom: rs,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (S, z) => M(z.id),
      children: [
        /* @__PURE__ */ u(Ed, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(Nd, { showInteractive: !1 }),
        b && /* @__PURE__ */ u(Md, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u(At, { position: "top-left", children: /* @__PURE__ */ k(Td, { children: [
          /* @__PURE__ */ u(R_, { system: e, focus: t, agents: c && !a, onFocus: f }),
          d
        ] }) }),
        /* @__PURE__ */ u(At, { position: "bottom-center", children: /* @__PURE__ */ u(D_, { kinds: $, top: (_.hidden ?? 0) > 0, risk: i !== null }) })
      ]
    }
  );
}
function W_(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ u(ns, { children: /* @__PURE__ */ u(H_, { ...e, agents: e.agents ?? !1 }) }) });
}
const B_ = 16, V_ = 72, Rd = "system-map-view";
function ja(e) {
  return e.count === void 0 ? void 0 : `${e.count} ${e.counts ?? ""}`.trim();
}
function ti({ item: e }) {
  return /* @__PURE__ */ k(me, { children: [
    e.label,
    e.count !== void 0 && /* @__PURE__ */ u("span", { className: "sm-count", children: e.count })
  ] });
}
function F_({ items: e, value: t, onChange: n, label: r }) {
  const o = oe(null), i = oe(null), s = oe(null), [a, l] = J(Number.POSITIVE_INFINITY), [c, d] = J([]), f = e.map((_) => `${_.label}${_.count ?? ""}`).join("|");
  Ai(() => {
    const _ = () => {
      var w, N;
      l(((w = o.current) == null ? void 0 : w.clientWidth) ?? 0), d([...((N = i.current) == null ? void 0 : N.children) ?? []].map((E) => E.offsetWidth));
    };
    _();
    const y = new ResizeObserver(_);
    return o.current && y.observe(o.current), () => y.disconnect();
  }, [f]);
  const h = e.findIndex((_) => _.value === t), p = le(
    () => c.length === e.length ? n_(c, a, V_, h, B_) : { visible: e.map((_, y) => y), hidden: [] },
    [c, a, h, e]
  ), g = p.visible.map((_) => e[_]), v = p.hidden.map((_) => e[_]), b = (_) => {
    n(_), requestAnimationFrame(() => {
      var y, w;
      return (w = (y = s.current) == null ? void 0 : y.querySelector('[aria-selected="true"]')) == null ? void 0 : w.focus();
    });
  }, m = (_) => {
    const y = g.findIndex((C) => C.value === t), w = g.length, E = { ArrowRight: (y + 1) % w, ArrowLeft: (y - 1 + w) % w, Home: 0, End: w - 1 }[_.key];
    E !== void 0 && (_.preventDefault(), b(g[E].value));
  };
  return /* @__PURE__ */ k("div", { ref: o, className: "sm-bar", style: { position: "relative", flex: "none" }, children: [
    /* @__PURE__ */ u("div", { ref: i, className: "sm-tab-probe", "aria-hidden": "true", children: e.map((_) => /* @__PURE__ */ u("span", { className: "sm-tab", children: /* @__PURE__ */ u(ti, { item: _ }) }, _.value)) }),
    /* @__PURE__ */ u("div", { ref: s, className: "sm-tabs", role: "tablist", "aria-label": r, onKeyDown: m, children: g.map((_) => /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        role: "tab",
        id: `system-map-tab-${_.value}`,
        className: "sm-plain sm-tab",
        "aria-selected": _.value === t,
        "aria-controls": Rd,
        tabIndex: _.value === t ? 0 : -1,
        title: ja(_),
        onClick: () => n(_.value),
        children: /* @__PURE__ */ u(ti, { item: _ })
      },
      _.value
    )) }),
    v.length > 0 && /* @__PURE__ */ u(
      Za,
      {
        width: 200,
        popup: "menu",
        label: "More views",
        trigger: (_) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-tab", ..._, children: [
          "More ",
          /* @__PURE__ */ u(Qa, {})
        ] }),
        children: (_) => /* @__PURE__ */ u(lu, { label: "More views", children: v.map((y) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "sm-plain sm-row",
            title: ja(y),
            onClick: () => {
              _(), b(y.value);
            },
            children: /* @__PURE__ */ u(ti, { item: y })
          },
          y.value
        )) })
      }
    )
  ] });
}
const Hd = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, j_ = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, Y_ = { ...ve, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, ni = 6;
function G_(e) {
  return en(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function Ke({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12 }, children: e }),
    t
  ] });
}
function ht({ ids: e, onShow: t }) {
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ u("button", { style: j_, onClick: () => t(n), children: G_(n) }, n)) });
}
function Ya({ files: e }) {
  return /* @__PURE__ */ k("ul", { style: Y_, children: [
    e.slice(0, ni).map((t) => /* @__PURE__ */ u("li", { children: t }, t)),
    e.length > ni && /* @__PURE__ */ k("li", { style: Y, children: [
      "and ",
      e.length - ni,
      " more"
    ] })
  ] });
}
const Wd = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function X_({ row: e, canAsk: t, onAsk: n }) {
  const r = Wd[e.merge];
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ u(Pn, { severity: e.severity }),
    /* @__PURE__ */ k("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ k("span", { style: Y, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ u("button", { style: Me, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function U_({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = Wd[e.merge];
  return /* @__PURE__ */ k("div", { style: Hd, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ u(Pn, { severity: e.severity }),
      /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ u("button", { style: Me, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ u(Ke, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ u(Ya, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ u(Ke, { title: "Both change these tables", children: /* @__PURE__ */ u(ht, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ u(Ke, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ u(ht, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ u(Ke, { title: "Both change code that uses these tables", children: /* @__PURE__ */ u(ht, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ u(Ke, { title: "Also share", children: /* @__PURE__ */ u(Ya, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(Ke, { title: "Same modules", children: /* @__PURE__ */ u(ht, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ u("p", { style: { ...Y, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function q_({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ k("div", { style: Hd, "data-testid": "worktree", children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ u("p", { style: { ...Y, ...ve, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.display_path ?? e.path }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ k(xe, { variant: "muted", children: [
        e.ahead,
        " ahead"
      ] }),
      e.behind > 0 && /* @__PURE__ */ k(xe, { variant: "muted", children: [
        e.behind,
        " behind"
      ] }),
      e.uncommitted_files > 0 && /* @__PURE__ */ k(xe, { variant: "warn", children: [
        e.uncommitted_files,
        " uncommitted"
      ] }),
      /* @__PURE__ */ k(xe, { variant: "muted", children: [
        e.files.length,
        " files"
      ] })
    ] }),
    e.tables_schema.length > 0 && /* @__PURE__ */ u(Ke, { title: "Changes these tables", children: /* @__PURE__ */ u(ht, { ids: e.tables_schema, onShow: t }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(Ke, { title: "Modules", children: /* @__PURE__ */ u(ht, { ids: e.modules, onShow: t }) }),
    e.tables_code.length > 0 && /* @__PURE__ */ u(Ke, { title: "Code that uses", children: /* @__PURE__ */ u(ht, { ids: e.tables_code, onShow: t }) }),
    n.length > 0 && /* @__PURE__ */ u(Ke, { title: "Routes and plans", children: /* @__PURE__ */ u(ht, { ids: n, onShow: t }) })
  ] });
}
function K_({
  state: e,
  checkedAt: t,
  canAsk: n,
  onShow: r,
  onAsk: o
}) {
  const { high: i, medium: s } = e.counts, a = i + s, l = e.overlaps.length - a, c = e.worktrees.filter((h) => h.files.length > 0), d = e.worktrees.length - c.length, f = a === 0 ? "No collisions ahead." : `${a} collision${a === 1 ? "" : "s"} ahead.`;
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)", overflow: "hidden" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "worktree-summary", children: [
      /* @__PURE__ */ u("strong", { children: f }),
      " ",
      /* @__PURE__ */ k("span", { style: { ...Y, fontSize: 13 }, children: [
        c.length,
        " of ",
        e.worktrees.length,
        " worktrees have changes",
        l ? `, with ${l} smaller overlap${l === 1 ? "" : "s"}` : "",
        ".",
        t ? ` Checked ${new Date(t).toLocaleTimeString()}.` : ""
      ] })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }, children: [
      a > 0 && /* @__PURE__ */ u("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((h) => h.severity === "high" || h.severity === "medium").map((h) => /* @__PURE__ */ u(U_, { row: h, canAsk: n, onShow: r, onAsk: o }, `${h.a}|${h.b}`)) }),
      /* @__PURE__ */ k("section", { children: [
        /* @__PURE__ */ u("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ u("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((h) => /* @__PURE__ */ u(q_, { tree: h, onShow: r }, h.path)) }),
        c.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ k("p", { style: { ...Y, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ k("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((h) => h.severity === "low" || h.severity === "info").map((h) => /* @__PURE__ */ u(X_, { row: h, canAsk: n, onAsk: o }, `${h.a}|${h.b}`))
      ] })
    ] })
  ] });
}
const Ga = 12, Z_ = 2e4, Q_ = 8e3, J_ = 8e3, ek = 4e3, tk = [
  { key: "names", label: "Names" },
  { key: "keys", label: "Keys" },
  { key: "columns", label: "Columns" }
], ri = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, nk = [
  { value: "map", label: "Map" },
  { value: "data", label: "Data model" },
  { value: "plan", label: "Plan", counts: "unfinished plans" },
  { value: "risk", label: "Risk", counts: "hot and untested modules" },
  { value: "worktrees", label: "Worktrees", counts: "worktree collisions" },
  { value: "findings", label: "Findings", counts: "findings" },
  { value: "agents", label: "Agents", counts: "agents" },
  { value: "explore", label: "Explore", counts: "draft proposals" }
];
function rk(e, t) {
  const n = Ua(), [r, o] = J(null), [i, s] = J(null), [a, l] = J(!1), [c, d] = J(null), f = (r == null ? void 0 : r.repoKey) === t ? r.slot : null, h = $e(async () => {
    const g = await n.post("/api/chat/slots", { name: Nu(t) });
    return await n.post(`/api/chat/slots/${encodeURIComponent(g.key)}/project`, { project: e }), o({ repoKey: t, slot: g.key }), g.key;
  }, [n, e, t]);
  ce(() => {
    if (!e) return;
    let g = !0;
    return d(null), (async () => $u(localStorage, t) ? !0 : Iu(await n.get("/api/chat/slots").catch(() => []), t))().then(async (b) => {
      g && (b ? await h() : s(t));
    }).catch((b) => {
      g && d(dt(b, "open the design chat"));
    }), () => {
      g = !1;
    };
  }, [n, h, e, t]);
  const p = $e(
    (g) => {
      l(!0), d(null), (async () => {
        const b = f ?? await h();
        Au(localStorage, t), await n.post("/api/chat?ws=1", { message: g, slot: b, agent: "" });
      })().catch((b) => d(dt(b, "send that to the design chat"))).finally(() => l(!1));
    },
    [n, h, t, f]
  );
  return { slot: f, error: c, send: p, opening: a, canAsk: e !== null, startable: i === t && f === null };
}
function ok({ disabled: e, onSend: t }) {
  const [n, r] = J("");
  return /* @__PURE__ */ u(
    "form",
    {
      style: { position: "absolute", left: 0, right: 0, bottom: 0 },
      onSubmit: (o) => {
        o.preventDefault(), n.trim() && t(n.trim());
      },
      children: /* @__PURE__ */ u(
        Vr,
        {
          "aria-label": "Ask about the system",
          placeholder: "Ask about the system",
          value: n,
          disabled: e,
          onChange: (o) => r(o.target.value),
          style: { width: "100%", boxSizing: "border-box" }
        }
      )
    }
  );
}
function ik() {
  const e = oe(null), [t, n] = J(void 0), [r, o] = J(1400);
  return Ai(() => {
    const i = () => {
      var l;
      const a = (l = e.current) == null ? void 0 : l.getBoundingClientRect();
      n(Math.max(420, window.innerHeight - ((a == null ? void 0 : a.top) ?? 0) - 16)), a && o(a.width);
    };
    i();
    const s = new ResizeObserver(i);
    return e.current && s.observe(e.current), window.addEventListener("resize", i), () => {
      s.disconnect(), window.removeEventListener("resize", i);
    };
  }, []), { ref: e, height: t, width: r };
}
function yr({ children: e, onDismiss: t }) {
  return /* @__PURE__ */ k("div", { className: "sm-notice", role: "alert", "data-testid": "notice", children: [
    /* @__PURE__ */ u("span", { style: { flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: e }),
    t && /* @__PURE__ */ u(ie, { onClick: t, children: "Dismiss" })
  ] });
}
function sk({ read: e }) {
  const t = (e == null ? void 0 : e.unread) ?? [];
  return /* @__PURE__ */ u(
    qa,
    {
      testId: "no-tables",
      icon: /* @__PURE__ */ u(Bd, {}),
      title: "No tables found",
      subtitle: "System Map reads Postgres migrations and SQLite schemas, from .sql files or from code.",
      action: t.length > 0 && /* @__PURE__ */ u("div", { style: { ...Y, fontSize: 13, textAlign: "center" }, children: t.map((n) => /* @__PURE__ */ k("div", { children: [
        "Found, but not read: ",
        n.what,
        n.where ? ` (${n.where})` : ""
      ] }, n.what)) })
    }
  );
}
function Bd() {
  return /* @__PURE__ */ k("svg", { width: "40", height: "40", viewBox: "0 0 64 64", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ u("rect", { x: "10", y: "10", width: "44", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "34", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "26", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "42", y: "42", width: "12", height: "12", rx: "3" })
  ] });
}
function ak({ onBuilt: e }) {
  const [t, n] = J(!1);
  return /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u($i, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(
      qa,
      {
        testId: "first-run",
        icon: /* @__PURE__ */ u(Bd, {}),
        title: "See your system in one place",
        subtitle: "Add a project to map its code, data model, risk and plans.",
        action: /* @__PURE__ */ u(ie, { primary: !0, onClick: () => n(!0), children: "Add project" })
      }
    ) }),
    /* @__PURE__ */ u(du, { open: t, projects: [], onClose: () => n(!1), onBuilt: e })
  ] });
}
function bk() {
  const { repos: e, active: t, loaded: n, choose: r, reload: o } = cu();
  return n ? t ? /* @__PURE__ */ u(lk, { repo: t, projects: e, choose: r, reload: o }, t) : /* @__PURE__ */ u(ak, { onBuilt: r }) : /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u($i, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(oi, { rows: 6 }) })
  ] });
}
function lk({
  repo: e,
  projects: t,
  choose: n,
  reload: r
}) {
  var ds, us;
  const o = Ua(), { overview: i, error: s, refresh: a } = uu(e), l = i == null ? void 0 : i.manifest.version, [c, d] = J(0), f = l ? `${l}:${c}` : void 0, h = Ht("/graph", e, f), p = Ht("/system", e, f), g = Ht("/plan", e, f), v = Ht("/findings", e, f), b = Ht("/risk", e, f), m = Ht("/agents", e, f), _ = m.value, y = ((_ == null ? void 0 : _.agents.length) ?? 0) > 0, w = h.value, N = p.value, E = g.value, C = v.value, T = b.value, A = le(() => (E == null ? void 0 : E.plans) ?? [], [E]), O = le(() => (C == null ? void 0 : C.findings) ?? [], [C]), L = Oo("/worktrees", e, Z_), B = L.value, H = Oo("/explore", e, Q_), x = Oo("/agents/draft", e, J_), [$, M] = J("whatif"), [S, z] = J(null), [I, D] = J(0), P = fu(S, e, I), [V, X] = J(!1), [F, Q] = J(null), [G, ee] = J(() => hu(localStorage, e)), [W, j] = J(null), [q, K] = J(null), [Z, te] = J(!0), [ne, re] = J(!1), [se, ue] = J(!0), [_e, Ae] = J(!1), ke = oe(null), [ze, Ge] = J(!1), [Je, Xe] = J(null), [Se, Te] = J(null), [Oe, Ue] = J(null), [zt, et] = J(null), [Fn, ao] = J("names"), [mt, lo] = J(() => pu(localStorage)), tn = oe(null), nn = oe(!1), [co, jn] = J(!1), [rn, on] = J(null), { ref: uo, height: fo, width: Ot } = ik(), sn = (i == null ? void 0 : i.freshness.missing) === !0, pe = rk(i && !sn ? i.manifest.repo : null, e), tt = $e(
    (R) => {
      gu(localStorage, e, R), ee(R);
    },
    [e]
  );
  ce(() => {
    var R;
    nn.current && ((R = tn.current) == null || R.focus()), nn.current = !1;
  }, [mt]), ce(() => {
    if (!rn) return;
    const R = window.setTimeout(() => on(null), ek);
    return () => window.clearTimeout(R);
  }, [rn]);
  const Yn = G === "map" ? q && !/^(area|group):/.test(q) ? q : null : G === "data" ? W : null, yt = V && (P != null && P.diff.added.some((R) => R.id === Yn)) ? null : Yn, Pt = mu(yt, e, f), Gn = le(() => {
    const R = /* @__PURE__ */ new Map();
    for (const de of O)
      de.severity !== "info" && R.set(de.node, (R.get(de.node) ?? 0) + 1);
    return R;
  }, [O]), Xn = le(() => yu(B), [B]), Un = A.filter((R) => R.status === "planned" || R.status === "partial").length, ho = ((B == null ? void 0 : B.counts.high) ?? 0) + ((B == null ? void 0 : B.counts.medium) ?? 0), po = (T == null ? void 0 : T.modules.filter((R) => R.hot && R.untested).length) ?? 0, go = ((ds = H.value) == null ? void 0 : ds.proposals.filter((R) => R.status === "draft").length) ?? 0, mo = { findings: O.length, plan: Un, risk: po, worktrees: ho, explore: go, agents: _ == null ? void 0 : _.agents.length }, Pe = V ? P : null, an = le(() => N ? wu(N, Pe) : null, [N, Pe]), ln = le(() => {
    const R = (Pe == null ? void 0 : Pe.graph) ?? w;
    return R && (F == null ? void 0 : F.level) === "data" ? bu(R, F.resolved) : R;
  }, [w, Pe, F]), yo = async () => {
    jn(!0), on(null), et(null);
    try {
      const R = await o.post(`${at}/build`, { repo: e });
      await a(), await r(), on(R.unchanged ? "No changes" : "Rebuilt");
    } catch (R) {
      et(dt(R, "rebuild this project"));
    } finally {
      jn(!1);
    }
  }, Dt = async (R, de) => {
    et(null);
    try {
      await de();
    } catch (De) {
      et(dt(De, R));
    }
  }, qn = () => {
    Pt && pe.send(`Use the system-map tools. Look at ${Pt.id} and tell me what to watch out for.`);
  }, cn = (R) => {
    pe.send(`Use the system-map tools. Check finding ${R.id} on ${R.node}, read its evidence, and propose a fix.`);
  }, wo = (R) => {
    pe.send(`Use the system-map tools. Look at ${R.id}, say what is left to build, and propose the next step.`);
  }, bo = (R) => {
    pe.send(`Use the system-map tools. Look at ${R} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, vo = (R) => {
    pe.send(`Use the system-map tools. Read ${R.id} with the \`agents\` tool. Say what it does on its own, where it waits for a person, and what to watch out for.`);
  }, xo = (R) => {
    pe.send(`Use the system-map tools. Worktrees ${R.a} and ${R.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, _o = () => {
    pe.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, ko = async () => {
    Ue(null);
    try {
      await o.post(`${at}/coverage`, { repo: e }), d((R) => R + 1);
    } catch (R) {
      Ue(dt(R, "load the coverage report"));
    }
  }, Kn = (R) => {
    X(!0), Q(null), K(null);
    const de = [...(P == null ? void 0 : P.diff.added) ?? [], ...(P == null ? void 0 : P.diff.changed) ?? []].find((De) => De.id.startsWith("table:"));
    j(R === "data" ? (de == null ? void 0 : de.id) ?? null : null), tt(R);
  }, Eo = (R, de) => Dt("change this proposal", async () => {
    await o.post(`${at}/proposal-status`, { repo: e, id: R, status: de }), D((De) => De + 1), await H.refresh();
  }), So = (R, de) => Dt("delete this", async () => {
    await o.post(`${at}/intent-delete`, { repo: e, kind: R, id: de }), R === "proposals" && (z(null), X(!1)), await H.refresh();
  }), No = (R) => {
    dn({ on: !1, focus: null, before: null }), Q(R), re(R.overlays.risk), ue(R.overlays.worktrees), te(R.overlays.plans), z(R.proposal), X(R.proposal !== null), K(null), j(null), tt(R.level);
  }, Co = () => {
    X(!1), Q(null), j(null), K(null);
  }, Mo = (R, de) => Dt("change this plan", async () => {
    await o.post(`${at}/plan-status`, { repo: e, id: R, status: de }), d((De) => De + 1);
  }), $o = async (R) => {
    Ge(!0), Xe(null);
    try {
      return await o.post(`${at}/agents/settings`, { repo: e, settings: R }), await a(), d((de) => de + 1), !0;
    } catch (de) {
      return Xe(dt(de, "save the agent settings")), !1;
    } finally {
      Ge(!1);
    }
  }, Io = async (R) => {
    Ge(!0), Te(null);
    try {
      return await o.post(`${at}/agents/draft`, { repo: e, action: R }), R === "use" && (await a(), d((de) => de + 1)), !0;
    } catch (de) {
      return Te(dt(de, R === "use" ? "use the draft" : "drop the draft")), !1;
    } finally {
      Ge(!1), await x.refresh();
    }
  }, Ao = async (R, de) => {
    try {
      return await o.post(`${at}/regions`, { repo: e, id: R, region: de }), d((De) => De + 1), null;
    } catch (De) {
      return dt(De, "save the region");
    }
  }, Rt = (R) => {
    tt("data"), j(R);
  }, wt = (R) => {
    tt("map"), K(R);
  }, dn = (R) => {
    Ae(R.on), K(R.focus), ke.current = R.before;
  }, un = (R) => {
    Q(null), tt("map"), dn(Ru({ on: _e, focus: q, before: ke.current }, R, G === "map"));
  }, To = () => {
    const R = Du({ on: _e, focus: q, before: ke.current });
    R.closeSavedView && Q(null), dn(R);
  }, Lo = (R) => {
    G === "data" && R.startsWith("table:") ? j(R) : wt(R);
  }, Zn = (R) => {
    R.startsWith("table:") ? Rt(R) : wt(R);
  }, Qn = () => {
    nn.current = !0, Mu(localStorage, !mt), lo(!mt);
  }, Jn = Cu(G), bt = Jn && mt, er = G === "map" ? "modules" : "tables", fn = Jn && !mt && Ot >= Br ? /* @__PURE__ */ k("button", { ref: tn, type: "button", className: "sm-plain sm-layers sm-show-list", onClick: Qn, children: [
    "Show ",
    er
  ] }) : null, tr = (Pe == null ? void 0 : Pe.title) ?? (F == null ? void 0 : F.title), nr = tr ? /* @__PURE__ */ u(A1, { title: tr, onBack: Co }) : null, hn = nk.map((R) => ({ ...R, count: mo[R.value] || void 0 })), Ne = i == null ? void 0 : i.freshness, rr = Ne ? vu(xu(Ne), Ne.commits_behind, Ne.ref) : null, pn = ((us = Ne == null ? void 0 : Ne.changed_inputs) == null ? void 0 : us.length) ?? 0, Vd = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      fn,
      /* @__PURE__ */ u(
        I1,
        {
          layers: [
            w_(Un, Z, () => te((R) => !R)),
            { key: "risk", label: "Risk", on: ne, title: "Mark hot and untested code on the map", onToggle: () => re((R) => !R) },
            { key: "work", label: "Worktrees", on: se, title: "Show what each worktree is changing", onToggle: () => ue((R) => !R) },
            {
              key: "agents",
              label: "Agents",
              on: _e && y,
              disabled: !y,
              title: y ? "Show the agents: what starts each one, who it hands work to, and the models it uses" : "No agents yet. Point System Map at them in the Agents tab.",
              onToggle: To
            }
          ]
        }
      )
    ] }),
    nr
  ] }), Fd = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      fn,
      /* @__PURE__ */ u(
        qd,
        {
          ariaLabel: "How much of each table to show",
          layoutId: "system-map-density",
          collapse: !1,
          segments: tk,
          value: Fn,
          onChange: (R) => ao(R)
        }
      )
    ] }),
    nr
  ] }), as = {
    map: an !== null,
    data: !!ln,
    plan: E !== null,
    risk: T !== null,
    worktrees: B !== null,
    findings: C !== null,
    agents: _ !== null,
    explore: H.value !== null
  }, ls = {
    map: p.failed,
    data: h.failed,
    plan: g.failed,
    risk: b.failed,
    worktrees: L.failed,
    findings: v.failed,
    agents: m.failed,
    explore: H.failed
  }, jd = () => {
    d((R) => R + 1), L.refresh(), H.refresh();
  }, cs = _u({ projects: t, activeKey: e, onPick: n, onReload: () => void r() }), Yd = /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }, children: [
    /* @__PURE__ */ u("span", { style: { whiteSpace: "nowrap" }, children: "System Map" }),
    /* @__PURE__ */ u("span", { "aria-hidden": "true", style: { ...Y, fontWeight: 400 }, children: "/" }),
    cs.menu
  ] });
  return /* @__PURE__ */ k(me, { children: [
    cs.dialogs,
    /* @__PURE__ */ u(
      $i,
      {
        title: Yd,
        actions: i && rr ? /* @__PURE__ */ u(
          S_,
          {
            status: rr,
            detail: Ne != null && Ne.stale ? `${pn} schema ${pn === 1 ? "file" : "files"} changed on ${Ne.ref}` : void 0,
            commit: i.manifest.commit,
            builtAt: i.manifest.built_at,
            read: i.manifest.read,
            busy: co,
            result: rn,
            onRebuild: () => void yo()
          }
        ) : void 0
      }
    ),
    /* @__PURE__ */ k("div", { ref: uo, className: "sm-page", style: { height: fo, display: "flex", flexDirection: "column", gap: Ga, minHeight: 0 }, children: [
      s && !i && /* @__PURE__ */ k(yr, { children: [
        s,
        " ",
        /* @__PURE__ */ u(ie, { onClick: () => void a(), children: "Try again" })
      ] }),
      !i && !s && /* @__PURE__ */ u(oi, { rows: 6 }),
      zt && /* @__PURE__ */ u(yr, { onDismiss: () => et(null), children: zt }),
      sn && i && /* @__PURE__ */ k(yr, { children: [
        "The folder for this project is gone: ",
        /* @__PURE__ */ u("span", { className: "sm-mono", children: i.manifest.repo }),
        ". You can still read the last model. To go on, move the folder back, or remove the project from the project menu."
      ] }),
      i && /* @__PURE__ */ k(me, { children: [
        /* @__PURE__ */ u(F_, { items: hn, value: G, onChange: tt, label: "System Map views" }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: Ga,
              gridTemplateColumns: t_(Ot, bt),
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              bt && Ot >= Br && /* @__PURE__ */ k(zo, { style: ri, "data-testid": "side-list", children: [
                /* @__PURE__ */ k("div", { className: "sm-list-head", children: [
                  /* @__PURE__ */ u(fs, { children: G === "map" ? "Modules" : "Tables" }),
                  /* @__PURE__ */ u("button", { ref: tn, type: "button", className: "sm-plain sm-hide-list", "aria-label": `Hide ${er}`, onClick: Qn, children: "Hide" })
                ] }),
                G === "map" ? /* @__PURE__ */ u(ku, { nodes: (N == null ? void 0 : N.nodes) ?? [], focus: q, onSelect: wt }) : /* @__PURE__ */ u(Eu, { tables: i.tables, selected: W, flagged: Gn, working: Xn, onSelect: Rt })
              ] }),
              /* @__PURE__ */ k(
                zo,
                {
                  style: { ...ri, padding: 0, position: "relative" },
                  "data-testid": "canvas",
                  id: Rd,
                  role: "tabpanel",
                  "aria-labelledby": `system-map-tab-${G}`,
                  children: [
                    !as[G] && !ls[G] && /* @__PURE__ */ u(oi, { rows: 6 }),
                    !as[G] && ls[G] && /* @__PURE__ */ u("div", { style: { padding: 12 }, children: /* @__PURE__ */ k(yr, { children: [
                      "Couldn't load this view. ",
                      /* @__PURE__ */ u(ie, { onClick: jd, children: "Try again" })
                    ] }) }),
                    G === "map" && an && /* @__PURE__ */ u(
                      W_,
                      {
                        system: an,
                        focus: q,
                        tables: i.manifest.counts.tables,
                        showPlans: Z,
                        inspecting: yt !== null,
                        risk: ne ? T : null,
                        worktrees: se ? B : null,
                        only: (F == null ? void 0 : F.level) === "map" ? F.resolved : null,
                        layout: (F == null ? void 0 : F.layout) ?? "left-right",
                        agents: _e && y,
                        tools: Vd,
                        onFocus: (R) => {
                          Q(null), K(R);
                        },
                        onOpenTables: () => tt("data")
                      }
                    ),
                    G === "data" && i.tables.length === 0 && !V && /* @__PURE__ */ u(sk, { read: i.manifest.read }),
                    G === "data" && ln && (i.tables.length > 0 || V) && /* @__PURE__ */ u(W1, { graph: ln, selected: W, flagged: Gn, working: Xn, density: Fn, tools: Fd, onSelect: j }),
                    G === "explore" && H.value && /* @__PURE__ */ u(
                      Z1,
                      {
                        data: H.value,
                        proposal: P,
                        shownProposal: V ? S : null,
                        canAsk: pe.canAsk,
                        tab: $,
                        onTab: M,
                        onSend: pe.send,
                        onOpenProposal: z,
                        onDrawProposal: Kn,
                        onStatus: (R, de) => void Eo(R, de),
                        onDelete: (R, de) => void So(R, de),
                        onOpenView: No,
                        onNode: Zn
                      }
                    ),
                    G === "plan" && E && /* @__PURE__ */ u(y_, { plans: A, onShow: wt, onAsk: wo, onStatus: (R, de) => void Mo(R, de) }),
                    G === "risk" && T && /* @__PURE__ */ u(
                      E_,
                      {
                        risk: T,
                        canAsk: pe.canAsk,
                        error: Oe,
                        onShow: wt,
                        onAsk: bo,
                        onLoad: () => void ko(),
                        onRun: _o
                      }
                    ),
                    G === "worktrees" && B && /* @__PURE__ */ u(K_, { state: B, checkedAt: L.checkedAt, canAsk: pe.canAsk, onShow: Zn, onAsk: xo }),
                    G === "findings" && C && /* @__PURE__ */ u(
                      J1,
                      {
                        findings: O,
                        noSchema: i.tables.length === 0,
                        onShow: (R) => R.startsWith("agent:") ? un(R) : Rt(R),
                        onAsk: cn
                      }
                    ),
                    G === "agents" && _ && /* @__PURE__ */ u(
                      tf,
                      {
                        state: _,
                        draft: x.value,
                        canAsk: pe.canAsk,
                        saving: ze,
                        error: Je,
                        draftError: Se,
                        onShow: un,
                        onAsk: vo,
                        onSave: $o,
                        onFind: () => pe.send(Fu),
                        onDraft: Io
                      }
                    ),
                    Pt && yt && /* @__PURE__ */ u(
                      f_,
                      {
                        node: Pt,
                        work: (B == null ? void 0 : B.by_node[yt]) ?? [],
                        overlaps: Su(yt, B),
                        canAsk: pe.canAsk,
                        onAsk: qn,
                        onAskFinding: cn,
                        onOpen: (R) => R.startsWith("agent:") ? un(R) : Lo(R),
                        onClose: () => G === "data" ? j(null) : K(null),
                        onRegion: Ao
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ k(zo, { style: Ot >= Pd ? ri : { display: "none" }, children: [
                /* @__PURE__ */ u(fs, { children: "Design chat" }),
                pe.error && /* @__PURE__ */ u("p", { style: { fontSize: 13 }, children: pe.error }),
                sn && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "Chat needs this project's folder." }),
                /* @__PURE__ */ k("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: [
                  pe.slot && /* @__PURE__ */ u("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ u(Ud, { slotKey: pe.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }),
                  pe.startable && /* @__PURE__ */ u(ok, { disabled: pe.opening, onSend: pe.send })
                ] })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  bk as default
};
