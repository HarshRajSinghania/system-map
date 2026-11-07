var Zd = Object.defineProperty;
var Qd = (e, t, n) => t in e ? Zd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ye = (e, t, n) => Qd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as k, jsx as u, Fragment as me } from "react/jsx-runtime";
import { useTheme as Ka, useAppApi as Za, ChatEmbed as Jd } from "@kirocrew/app-sdk";
import { Badge as xe, Btn as ie, Input as Fr, PageHeader as Ii, ContentSkeleton as ii, EmptyState as Qa, Card as Oo, CardTitle as gs, SegmentedControl as eu } from "@kirocrew/app-sdk/ui";
import Ai, { useState as J, useMemo as le, memo as he, forwardRef as Ja, createContext as jr, useCallback as Ie, useContext as en, useRef as oe, useEffect as ce, useLayoutEffect as Ti } from "react";
import { s as tn, M as Y, a as ve, A as $e, S as Dn, p as Yr, N as tu, D as el, b as nu, r as ru, C as tl, c as _n, d as kn, e as ou, f as iu, g as su, h as au, w as lu, t as cu, G as du, i as uu, j as fu, k as hu, u as pu, l as gu, m as mu, n as Wt, o as Po, q as yu, v as wu, x as bu, y as vu, z as xu, B as _u, E as ku, F as Eu, H as Su, I as Nu, J as Cu, K as Mu, T as $u, L as Iu, O as Au, P as ut, Q as lt, R as Tu, U as Lu, V as zu, W as Ou, X as Pu } from "./chunks/ProjectMenu-DnPKNLtA.mjs";
import "react-dom";
const nl = [
  { key: "all", label: "All", title: "Every agent" },
  { key: "model", label: "Use a model", title: "Agents that call a model" },
  { key: "leaves", label: "Can leave region", title: "Agents whose model runs outside your home region" },
  { key: "asks", label: "Asks you", title: "Agents that wait for a person" },
  { key: "planned", label: "Planned", title: "Agents a spec names that have no jobs yet" }
], rl = {
  all: () => !0,
  model: (e) => e.models.length > 0,
  leaves: (e) => e.leaves_region.length > 0,
  asks: (e) => e.asks_you.length > 0,
  planned: (e) => e.status === "planned"
}, ol = { built: "built", planned: "planned", empty: "no jobs" };
function Du(e, t) {
  return e.filter(rl[t]);
}
function Ru(e) {
  const t = {};
  for (const { key: n } of nl) t[n] = e.filter(rl[n]).length;
  return t;
}
function Li(e, t) {
  var i;
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return r === "agent" ? ((i = t.find((s) => s.id === e)) == null ? void 0 : i.label) ?? o : r === "job" ? `${o} job` : r === "module" ? tn(o) : o;
}
function il(e, t) {
  return [...new Set([...e.starts, ...e.handed_by].map((n) => Li(n.node, t)))];
}
function Hu(e, t) {
  return [...new Set(e.hands_off_to.map((n) => Li(n.node, t)))];
}
function zi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.models) t.has(n.node) || t.set(n.node, n);
  return [...t.values()];
}
function Wu(e, t) {
  return e.leaves ? "leaves" : e.region && t && e.region.trim().toLowerCase() === t.trim().toLowerCase() ? "home" : "unknown";
}
function Bu(e) {
  return e.region ? `${e.name} · ${e.region}` : e.name;
}
function Vu(e) {
  return e.on ? { on: !1, focus: e.before, before: null, closeSavedView: !1 } : { on: !0, focus: null, before: e.focus, closeSavedView: !0 };
}
function Fu(e, t, n) {
  return { on: !0, focus: t, before: e.on ? e.before : n ? e.focus : null };
}
function ju(e, t) {
  const n = (r) => (r ?? []).join(", ");
  return {
    list: e.list ?? "",
    jobs_key: e.jobs_key ?? t.jobs_key ?? "",
    hand_off_keys: n(e.hand_off_keys ?? t.hand_off_keys),
    hand_off_calls: n(e.hand_off_calls),
    model_calls: n(e.model_calls),
    asks_you_calls: n(e.asks_you_calls),
    modules: n((e.modules ?? []).map((r) => r.replace(/^module:/, ""))),
    home_region: e.home_region ?? ""
  };
}
function nt(e) {
  return [...new Set(e.split(/[\s,]+/).filter(Boolean))];
}
function sl(e) {
  const t = {}, n = (o) => o.trim();
  n(e.list) && (t.list = n(e.list)), n(e.jobs_key) && (t.jobs_key = n(e.jobs_key)), nt(e.hand_off_keys).length && (t.hand_off_keys = nt(e.hand_off_keys)), nt(e.hand_off_calls).length && (t.hand_off_calls = nt(e.hand_off_calls)), nt(e.model_calls).length && (t.model_calls = nt(e.model_calls)), nt(e.asks_you_calls).length && (t.asks_you_calls = nt(e.asks_you_calls));
  const r = nt(e.modules).map((o) => `module:${o.replace(/^module:/, "")}`);
  return r.length && (t.modules = r), n(e.home_region) && (t.home_region = n(e.home_region)), t;
}
function Yu(e, t) {
  return { ...e, modules: [.../* @__PURE__ */ new Set([...e.modules ?? [], t])] };
}
function Gu(e, t, n) {
  return Yu(n ? sl(n) : e, t);
}
function Xu(e, t) {
  return e ? `draft:${e}` : `saved:${JSON.stringify(t)}`;
}
function Uu(e, t) {
  return e && e.id === t ? e.text : null;
}
const Oi = "The Design chat needs this project's folder.", Pi = {
  list: "Agent list",
  jobs_key: "Jobs key",
  hand_off_keys: "Hand-off keys",
  hand_off_calls: "Hand-off calls",
  model_calls: "Model calls",
  asks_you_calls: "Asks-you calls",
  modules: "Agent modules",
  home_region: "Home region"
}, qu = {
  list: "The file whose exported array lists your agents, such as src/agents/registry.ts",
  jobs_key: "The property that holds each agent's jobs",
  hand_off_keys: "Properties that name the agent to hand work to, such as agent",
  hand_off_calls: "Functions whose first argument names the agent to start, such as queueAgent",
  model_calls: "Functions that call a model, such as claude",
  asks_you_calls: "Functions that leave work for a person, such as addTask",
  modules: "Folders to treat as one agent each, such as src/mail",
  home_region: "Where your data should stay, such as Canada"
}, al = Object.keys(Pi), Ku = "Use the system-map tools. Find this project's agents, following the Find my agents steps in the system-map skill. Try the settings with `draft_agents` and `dry_run: true`, fix what the result shows, then save the draft.";
function ll(e, t) {
  return e.settings.home_region || !t.home_region ? { ...e.settings } : { ...e.settings, home_region: t.home_region };
}
function ms(e, t) {
  return t === void 0 ? null : Array.isArray(t) ? (e === "modules" ? t.map((n) => n.replace(/^module:/, "")) : t).join(", ") : t;
}
function Zu(e, t, n) {
  const r = ll(e, n);
  return al.filter((o) => e.settings[o] !== void 0 || t.includes(o)).map((o) => {
    const i = t.includes(o);
    return {
      key: o,
      label: Pi[o],
      value: ms(o, r[o]),
      was: i ? ms(o, n[o]) : null,
      changed: i,
      evidence: e.evidence[o] ?? []
    };
  });
}
function Qu(e) {
  return e.count === 0 ? "With these, System Map finds no agents." : `With these, System Map finds ${e.count} agent${e.count === 1 ? "" : "s"}:`;
}
function Ju(e) {
  return `${e.commit ? `Drafted at ${e.commit.slice(0, 7)}.` : "Drafted before the last build."} The code has changed since, so check it first.`;
}
const br = { padding: "5px 8px", textAlign: "left", verticalAlign: "top" }, Do = { ...br, fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" };
function ef({
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
  const c = Zu(e, t, r);
  return /* @__PURE__ */ k("section", { "data-testid": "agent-draft", style: { border: "1px solid var(--accent, #2563eb)", borderRadius: 8, padding: 12, background: "var(--card, #fff)", fontSize: 13, maxWidth: 820 }, children: [
    /* @__PURE__ */ u("strong", { style: { fontSize: 14 }, children: "Drafted by the Design chat" }),
    n && /* @__PURE__ */ u("p", { "data-testid": "agent-draft-stale", style: { margin: "4px 0 0", color: "var(--warn-text, #b45309)" }, children: Ju(e) }),
    e.note && /* @__PURE__ */ u("p", { style: { margin: "6px 0 0" }, children: e.note }),
    /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", margin: "10px 0" }, children: [
      /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
        /* @__PURE__ */ u("th", { style: Do, children: "Setting" }),
        /* @__PURE__ */ u("th", { style: Do, children: "Value" }),
        /* @__PURE__ */ u("th", { style: Do, children: "Evidence" })
      ] }) }),
      /* @__PURE__ */ u("tbody", { children: c.map((d) => /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
        /* @__PURE__ */ k("td", { style: { ...br, fontWeight: 600, whiteSpace: "nowrap" }, children: [
          d.label,
          " ",
          d.changed && /* @__PURE__ */ u(xe, { variant: "aim", children: "changed" })
        ] }),
        /* @__PURE__ */ k("td", { style: { ...br, overflowWrap: "anywhere" }, children: [
          d.value === null ? /* @__PURE__ */ u("span", { style: Y, children: "none" }) : /* @__PURE__ */ u("span", { style: d.key === "home_region" ? void 0 : ve, children: d.value }),
          d.was !== null && /* @__PURE__ */ k("div", { style: { ...Y, fontSize: 12 }, children: [
            "was ",
            d.was
          ] })
        ] }),
        /* @__PURE__ */ u("td", { style: { ...br, ...ve, ...Y, fontSize: 12, overflowWrap: "anywhere" }, children: d.evidence.length ? d.evidence.map((f) => /* @__PURE__ */ u("div", { children: f }, f)) : "—" })
      ] }, d.key)) })
    ] }),
    /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontWeight: 600 }, "data-testid": "agent-draft-finds", children: Qu(e) }),
    e.agents.length > 0 && /* @__PURE__ */ u("p", { style: { margin: 0 }, children: e.agents.map((d) => d.status === "built" ? d.label : `${d.label} (${ol[d.status]})`).join(", ") }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 12 }, children: [
      /* @__PURE__ */ u(ie, { primary: !0, disabled: o, onClick: s, children: o ? "Saving…" : "Use these" }),
      /* @__PURE__ */ u(ie, { disabled: o, onClick: a, children: "Edit first" }),
      /* @__PURE__ */ u(ie, { disabled: o, onClick: l, children: "Drop" }),
      i && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: i })
    ] })
  ] });
}
const Vt = { padding: "6px 8px", textAlign: "left", verticalAlign: "top" }, mn = { ...Vt, fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)", whiteSpace: "nowrap" }, tf = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text, inherit)" }, ir = { padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border-strong, #a1a1aa)", background: "var(--card, #fff)", fontSize: 12, overflowWrap: "anywhere" }, nf = { leaves: "err", home: "ok", unknown: "muted" }, rf = { built: "var(--ok, #15803d)", planned: "var(--danger, #dc2626)", empty: "var(--warn-text, #b45309)" };
function cl({ status: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ u("span", { style: { width: 7, height: 7, borderRadius: "50%", background: rf[e] } }),
    ol[e]
  ] });
}
function dl({ models: e, home: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("span", { style: Y, children: "none" }) : /* @__PURE__ */ u("span", { style: { display: "inline-flex", flexWrap: "wrap", gap: 4 }, children: e.map((n) => /* @__PURE__ */ u(xe, { variant: nf[Wu(n, t)], title: n.leaves ? "Runs outside your home region" : n.region ? void 0 : "No region set. Set one on the service in the Map.", children: Bu(n) }, n.node)) });
}
function Ro({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }, children: [
    /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: e }),
    t
  ] });
}
function of({ row: e, rows: t, home: n }) {
  const r = il(e, t), o = Hu(e, t), i = /* @__PURE__ */ u("span", { style: { ...Y, alignSelf: "center" }, children: "→" });
  return /* @__PURE__ */ k("div", { "data-testid": "agent-in-out", style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto auto minmax(0, 1fr)", gap: 6, margin: "10px 0" }, children: [
    /* @__PURE__ */ u(Ro, { title: "Starts from", children: r.length ? r.map((s) => /* @__PURE__ */ u("span", { style: ir, children: s }, s)) : /* @__PURE__ */ u("span", { style: Y, children: "nothing found" }) }),
    i,
    /* @__PURE__ */ u("span", { style: { ...ir, alignSelf: "center", fontWeight: 600, border: "2px solid var(--accent, #2563eb)" }, children: e.label }),
    i,
    /* @__PURE__ */ k(Ro, { title: "Then", children: [
      o.map((s) => /* @__PURE__ */ u("span", { style: ir, children: s }, s)),
      e.asks_you.length > 0 && /* @__PURE__ */ u("span", { style: { ...ir, border: "1px solid var(--info, #2563eb)", background: "var(--bg-elevated, #fff)" }, children: "Asks you" }),
      o.length === 0 && e.asks_you.length === 0 && /* @__PURE__ */ u("span", { style: Y, children: "nothing found" })
    ] }),
    /* @__PURE__ */ u("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ u(Ro, { title: "Uses model", children: /* @__PURE__ */ u(dl, { models: zi(e), home: n }) }) })
  ] });
}
function sf({ row: e, rows: t, home: n, canAsk: r, onShow: o, onAsk: i }) {
  const s = [...e.evidence, ...zi(e).map((a) => a.evidence), ...e.asks_you, ...e.hands_off_to.map((a) => a.evidence)];
  return /* @__PURE__ */ k("div", { "data-testid": "agent-detail", style: { fontSize: 13 }, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }, children: [
      /* @__PURE__ */ u("strong", { style: { fontSize: 15 }, children: e.label }),
      /* @__PURE__ */ u(cl, { status: e.status })
    ] }),
    e.description && /* @__PURE__ */ u("p", { style: { margin: "6px 0 0" }, children: e.description }),
    /* @__PURE__ */ u(of, { row: e, rows: t, home: n }),
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
const af = al.map((e) => ({ key: e, help: qu[e] }));
function ul({ canAsk: e, onFind: t }) {
  return /* @__PURE__ */ u(ie, { onClick: t, disabled: !e, title: e ? "The Design chat reads your code and drafts these settings for you to check" : Oi, children: "Find my agents" });
}
function lf({
  state: e,
  start: t,
  saving: n,
  error: r,
  canAsk: o,
  onFind: i,
  onSave: s,
  onCancel: a
}) {
  const [l, c] = J(() => ju(t ?? e.settings, e.defaults)), d = async (f) => {
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
      /* @__PURE__ */ u(ul, { canAsk: o, onFind: i }),
      /* @__PURE__ */ u("span", { style: Y, "data-testid": "find-agents-why", children: o ? "The Design chat reads your code and drafts these settings for you to check." : Oi })
    ] }),
    e.agents.length === 0 && e.suggestions.length > 0 && /* @__PURE__ */ k("div", { style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600 }, children: "These modules call a model" }),
      e.suggestions.map((f) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }, children: [
        /* @__PURE__ */ u("span", { style: { ...ve, fontSize: 12, flex: 1 }, children: Li(f, []) }),
        /* @__PURE__ */ u(ie, { disabled: n, onClick: () => void d(Gu(e.settings, f, t ? l : null)), children: "Mark as agent" })
      ] }, f))
    ] }),
    /* @__PURE__ */ u("div", { style: { display: "grid", gridTemplateColumns: "minmax(110px, auto) minmax(0, 1fr)", gap: "8px 12px", alignItems: "start" }, children: af.map((f) => /* @__PURE__ */ k("label", { style: { display: "contents" }, children: [
      /* @__PURE__ */ u("span", { style: { paddingTop: 6, fontWeight: 600 }, children: Pi[f.key] }),
      /* @__PURE__ */ k("span", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
        /* @__PURE__ */ u(Fr, { value: l[f.key], onChange: (h) => c({ ...l, [f.key]: h.target.value }), style: f.key === "home_region" ? void 0 : ve }),
        /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: f.help })
      ] })
    ] }, f.key)) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 14 }, children: [
      /* @__PURE__ */ u(ie, { primary: !0, disabled: n, onClick: () => void d(sl(l)), children: n ? "Saving…" : "Save and rebuild" }),
      a && /* @__PURE__ */ u(ie, { onClick: a, children: "Cancel" }),
      r && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: r })
    ] })
  ] });
}
function cf({
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
  const [f, h] = J("all"), [p, g] = J(null), [b, v] = J(null), m = e.agents, _ = le(() => Ru(m), [m]), y = le(() => Du(m, f), [m, f]), w = y.find((O) => O.id === p) ?? y[0] ?? null, N = e.home_region, E = (t == null ? void 0 : t.draft) ?? null, C = (b == null ? void 0 : b.from) === "draft" ? b.draft : null, T = async (O) => {
    const L = await l(O);
    return L && C && await d("drop", C.id), L;
  }, A = t && E && !C ? /* @__PURE__ */ u("div", { style: { flexShrink: 0, maxHeight: "50%", overflowY: "auto", marginBottom: m.length === 0 || b ? 16 : 0 }, children: /* @__PURE__ */ u(
    ef,
    {
      draft: E,
      changed: t.changed,
      stale: t.stale,
      saved: e.settings,
      busy: r,
      error: Uu(i, E.id),
      onUse: () => void d("use", E.id),
      onEdit: () => v({ from: "draft", draft: E }),
      onDrop: () => void d("drop", E.id)
    }
  ) }) : null;
  if (m.length === 0 || b) {
    const O = m.length || C ? () => v(null) : void 0;
    return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, color: "var(--text, inherit)" }, children: [
      A,
      /* @__PURE__ */ u(
        lf,
        {
          state: e,
          start: C ? ll(C, e.settings) : void 0,
          saving: r,
          error: o,
          canAsk: n,
          onFind: c,
          onSave: C ? T : l,
          onCancel: O
        },
        Xu((C == null ? void 0 : C.id) ?? null, e.settings)
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
      nl.map((O) => /* @__PURE__ */ k(ie, { primary: f === O.key, title: O.title, onClick: () => h(O.key), children: [
        O.label,
        " ",
        _[O.key]
      ] }, O.key)),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      !n && /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12 }, "data-testid": "find-agents-why", children: Oi }),
      /* @__PURE__ */ u(ul, { canAsk: n, onFind: c }),
      /* @__PURE__ */ u(ie, { onClick: () => v({ from: "settings" }), children: "Agent settings" })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, display: "flex", gap: 16 }, children: [
      /* @__PURE__ */ k("div", { style: { flex: 1, minWidth: 0, overflow: "auto" }, children: [
        /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "agents-table", children: [
          /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
            /* @__PURE__ */ u("th", { style: mn, children: "Agent" }),
            /* @__PURE__ */ u("th", { style: mn, children: "Status" }),
            /* @__PURE__ */ u("th", { style: mn, children: "Starts from" }),
            /* @__PURE__ */ u("th", { style: mn, children: "Model" }),
            /* @__PURE__ */ u("th", { style: mn, children: "Asks you" })
          ] }) }),
          /* @__PURE__ */ u("tbody", { children: y.map((O) => /* @__PURE__ */ k("tr", { onClick: () => g(O.id), style: { borderBottom: "1px solid var(--border, #e4e4e7)", cursor: "pointer", background: O.id === (w == null ? void 0 : w.id) ? "var(--accent-subtle, rgba(37,99,235,.12))" : void 0 }, children: [
            /* @__PURE__ */ u("td", { style: Vt, children: /* @__PURE__ */ u("button", { style: tf, "aria-pressed": O.id === (w == null ? void 0 : w.id), onClick: () => g(O.id), children: O.label }) }),
            /* @__PURE__ */ u("td", { style: Vt, children: /* @__PURE__ */ u(cl, { status: O.status }) }),
            /* @__PURE__ */ u("td", { style: { ...Vt, ...Y }, children: il(O, m).join(", ") || "—" }),
            /* @__PURE__ */ u("td", { style: Vt, children: /* @__PURE__ */ u(dl, { models: zi(O), home: N }) }),
            /* @__PURE__ */ u("td", { style: Vt, children: O.asks_you.length > 0 ? "Yes" : /* @__PURE__ */ u("span", { style: Y, children: "—" }) })
          ] }, O.id)) })
        ] }),
        y.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No agents here. Pick All to see every agent." })
      ] }),
      w && /* @__PURE__ */ u("aside", { style: { width: 320, flexShrink: 0, overflowY: "auto", paddingLeft: 16, borderLeft: "1px solid var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u(sf, { row: w, rows: m, home: N, canAsk: n, onShow: s, onAsk: a }) })
    ] })
  ] });
}
function fl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var df = "\0", _t = "\0", ys = "";
let uf = class {
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
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[_t] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = _t, this._children[t] = {}, this._children[_t][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      n = _t;
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
      if (n !== _t)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = _t) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === _t)
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
    var a = bn(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = ff(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, ws(this._preds[n], t), ws(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? Ho(this._isDirected, arguments[0]) : bn(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? Ho(this._isDirected, arguments[0]) : bn(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? Ho(this._isDirected, arguments[0]) : bn(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], bs(this._preds[n], t), bs(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function ws(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function bs(e, t) {
  --e[t] || delete e[t];
}
function bn(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + ys + i + ys + (r === void 0 ? df : r);
}
function ff(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function Ho(e, t) {
  return bn(e, t.v, t.w, t.name);
}
var Di = uf, hf = "2.2.4", pf = {
  Graph: Di,
  version: hf
}, gf = Di, mf = {
  write: yf,
  read: vf
};
function yf(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: wf(e),
    edges: bf(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function wf(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function bf(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function vf(e) {
  var t = new gf(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var xf = _f;
function _f(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let kf = class {
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
var hl = kf, Ef = hl, pl = Nf, Sf = () => 1;
function Nf(e, t, n, r) {
  return Cf(
    e,
    String(t),
    n || Sf,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function Cf(e, t, n, r) {
  var o = {}, i = new Ef(), s, a, l = function(c) {
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
var Mf = pl, $f = If;
function If(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = Mf(e, o, t, n), r;
  }, {});
}
var gl = Af;
function Af(e) {
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
var Tf = gl, Lf = zf;
function zf(e) {
  return Tf(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var Of = Df, Pf = () => 1;
function Df(e, t, n) {
  return Rf(
    e,
    t || Pf,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function Rf(e, t, n) {
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
function ml(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new si();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new si();
  return r;
}
class si extends Error {
  constructor() {
    super(...arguments);
  }
}
var yl = ml;
ml.CycleException = si;
var vs = yl, Hf = Wf;
function Wf(e) {
  try {
    vs(e);
  } catch (t) {
    if (t instanceof vs.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var wl = Bf;
function Bf(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? Vf : Ff, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function Vf(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), bl(t(i[0]), (s) => o.push([s, !1])));
  }
}
function Ff(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), bl(t(i), (s) => o.push(s)));
  }
}
function bl(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var jf = wl, Yf = Gf;
function Gf(e, t) {
  return jf(e, t, "post");
}
var Xf = wl, Uf = qf;
function qf(e, t) {
  return Xf(e, t, "pre");
}
var Kf = Di, Zf = hl, Qf = Jf;
function Jf(e, t) {
  var n = new Kf(), r = {}, o = new Zf(), i;
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
var eh = {
  components: xf,
  dijkstra: pl,
  dijkstraAll: $f,
  findCycles: Lf,
  floydWarshall: Of,
  isAcyclic: Hf,
  postorder: Yf,
  preorder: Uf,
  prim: Qf,
  tarjan: gl,
  topsort: yl
}, xs = pf, Fe = {
  Graph: xs.Graph,
  json: mf,
  alg: eh,
  version: xs.version
};
let th = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return _s(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && _s(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, nh)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function _s(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function nh(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var rh = th;
let oh = Fe.Graph, ih = rh;
var sh = lh;
let ah = () => 1;
function lh(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = dh(e, t || ah);
  return ch(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function ch(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      Wo(e, t, n, s);
    for (; s = o.dequeue(); )
      Wo(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(Wo(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function Wo(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, ai(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, ai(t, n, c);
  }), e.removeNode(r.v), i;
}
function dh(e, t) {
  let n = new oh(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = uh(o + r + 3).map(() => new ih()), s = r + 1;
  return n.nodes().forEach((a) => {
    ai(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function ai(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function uh(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let vl = Fe.Graph;
var we = {
  addBorderNode: vh,
  addDummyNode: xl,
  applyWithChunking: Gr,
  asNonCompoundGraph: hh,
  buildLayerMatrix: yh,
  intersectRect: mh,
  mapValues: Ch,
  maxRank: kl,
  normalizeRanks: wh,
  notime: Eh,
  partition: _h,
  pick: Nh,
  predecessorWeights: gh,
  range: Sl,
  removeEmptyRanks: bh,
  simplify: fh,
  successorWeights: ph,
  time: kh,
  uniqueId: El,
  zipObject: Ri
};
function xl(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = El(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function fh(e) {
  let t = new vl().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function hh(e) {
  let t = new vl({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function ph(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return Ri(e.nodes(), t);
}
function gh(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return Ri(e.nodes(), t);
}
function mh(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function yh(e) {
  let t = Sl(kl(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function wh(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Gr(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function bh(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Gr(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function vh(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), xl(e, "border", o, t);
}
function xh(e, t = _l) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const _l = 65535;
function Gr(e, t) {
  if (t.length > _l) {
    const n = xh(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function kl(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Gr(Math.max, n);
}
function _h(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function kh(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function Eh(e, t) {
  return t();
}
let Sh = 0;
function El(e) {
  var t = ++Sh;
  return e + ("" + t);
}
function Sl(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function Nh(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function Ch(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function Ri(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let Mh = sh, $h = we.uniqueId;
var Ih = {
  run: Ah,
  undo: Lh
};
function Ah(e) {
  (e.graph().acyclicer === "greedy" ? Mh(e, n(e)) : Th(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, $h("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function Th(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function Lh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let zh = we;
var Oh = {
  run: Ph,
  undo: Rh
};
function Ph(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => Dh(e, t));
}
function Dh(e, t) {
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
    }, c = zh.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function Rh(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: Hh } = we;
var Xr = {
  longestPath: Wh,
  slack: Bh
};
function Wh(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = Hh(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function Bh(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Vh = Fe.Graph, Mr = Xr.slack, Nl = Fh;
function Fh(e) {
  var t = new Vh({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; jh(t, e) < r; )
    o = Yh(t, e), i = t.hasNode(o.v) ? Mr(e, o) : -Mr(e, o), Gh(t, e, i);
  return t;
}
function jh(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !Mr(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Yh(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = Mr(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Gh(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Xh = Nl, ks = Xr.slack, Uh = Xr.longestPath, qh = Fe.alg.preorder, Kh = Fe.alg.postorder, Zh = we.simplify, Qh = zt;
zt.initLowLimValues = Wi;
zt.initCutValues = Hi;
zt.calcCutValue = Cl;
zt.leaveEdge = $l;
zt.enterEdge = Il;
zt.exchangeEdges = Al;
function zt(e) {
  e = Zh(e), Uh(e);
  var t = Xh(e);
  Wi(t), Hi(t, e);
  for (var n, r; n = $l(t); )
    r = Il(t, e, n), Al(t, e, n, r);
}
function Hi(e, t) {
  var n = Kh(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => Jh(e, t, r));
}
function Jh(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = Cl(e, t, n);
}
function Cl(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var f = c === i, h = t.edge(l).weight;
      if (a += f ? h : -h, tp(e, n, d)) {
        var p = e.edge(n, d).cutvalue;
        a += f ? -p : p;
      }
    }
  }), a;
}
function Wi(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), Ml(e, {}, 1, t);
}
function Ml(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = Ml(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function $l(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function Il(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === Es(e, e.node(d.v), a) && l !== Es(e, e.node(d.w), a));
  return c.reduce((d, f) => ks(t, f) < ks(t, d) ? f : d);
}
function Al(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), Wi(e), Hi(e, t), ep(e, t);
}
function ep(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = qh(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function tp(e, t, n) {
  return e.hasEdge(t, n);
}
function Es(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var np = Xr, Tl = np.longestPath, rp = Nl, op = Qh, ip = sp;
function sp(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      Ss(e);
      break;
    case "tight-tree":
      lp(e);
      break;
    case "longest-path":
      ap(e);
      break;
    case "none":
      break;
    default:
      Ss(e);
  }
}
var ap = Tl;
function lp(e) {
  Tl(e), rp(e);
}
function Ss(e) {
  op(e);
}
var cp = dp;
function dp(e) {
  let t = fp(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = up(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
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
function up(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function fp(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let $r = we;
var hp = {
  run: pp,
  cleanup: yp
};
function pp(e) {
  let t = $r.addDummyNode(e, "root", {}, "_root"), n = gp(e), r = Object.values(n), o = $r.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = mp(e) + 1;
  e.children().forEach((a) => Ll(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function Ll(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = $r.addBorderNode(e, "_bt"), c = $r.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((f) => {
    Ll(e, t, n, r, o, i, f);
    let h = e.node(f), p = h.borderTop ? h.borderTop : f, g = h.borderBottom ? h.borderBottom : f, b = h.borderTop ? r : 2 * r, v = p !== g ? 1 : o - i[s] + 1;
    e.setEdge(l, p, {
      weight: b,
      minlen: v,
      nestingEdge: !0
    }), e.setEdge(g, c, {
      weight: b,
      minlen: v,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function gp(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function mp(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function yp(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let wp = we;
var bp = vp;
function vp(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        Ns(e, "borderLeft", "_bl", n, o, i), Ns(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function Ns(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = wp.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var xp = {
  adjust: _p,
  undo: kp
};
function _p(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && zl(e);
}
function kp(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && Ep(e), (t === "lr" || t === "rl") && (Sp(e), zl(e));
}
function zl(e) {
  e.nodes().forEach((t) => Cs(e.node(t))), e.edges().forEach((t) => Cs(e.edge(t)));
}
function Cs(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function Ep(e) {
  e.nodes().forEach((t) => Bo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Bo), Object.hasOwn(n, "y") && Bo(n);
  });
}
function Bo(e) {
  e.y = -e.y;
}
function Sp(e) {
  e.nodes().forEach((t) => Vo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Vo), Object.hasOwn(n, "x") && Vo(n);
  });
}
function Vo(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let Ms = we;
var Np = Cp;
function Cp(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = Ms.applyWithChunking(Math.max, r), i = Ms.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let Mp = we.zipObject;
var $p = Ip;
function Ip(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += Ap(e, t[r - 1], t[r]);
  return n;
}
function Ap(e, t, n) {
  let r = Mp(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, f) => d.pos - f.pos)), i = 1;
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
var Tp = Lp;
function Lp(e, t = []) {
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
let zp = we;
var Op = Pp;
function Pp(e, t) {
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
  return Dp(r);
}
function Dp(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Rp(o, i);
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
  return t.filter((o) => !o.merged).map((o) => zp.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function Rp(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let Hp = we;
var Wp = Bp;
function Bp(e, t) {
  let n = Hp.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, f) => f.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(Vp(!!t)), l = $s(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = $s(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function $s(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function Vp(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Fp = Tp, jp = Op, Yp = Wp;
var Gp = Ol;
function Ol(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((h) => h !== s && h !== a));
  let c = Fp(e, o);
  c.forEach((h) => {
    if (e.children(h.v).length) {
      let p = Ol(e, h.v, n, r);
      l[h.v] = p, Object.hasOwn(p, "barycenter") && Up(h, p);
    }
  });
  let d = jp(c, n);
  Xp(d, l);
  let f = Yp(d, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let h = e.node(e.predecessors(s)[0]), p = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + h.order + p.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function Xp(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function Up(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let qp = Fe.Graph, Kp = we;
var Zp = Qp;
function Qp(e, t, n, r) {
  r || (r = e.nodes());
  let o = Jp(e), i = new qp({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
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
function Jp(e) {
  for (var t; e.hasNode(t = Kp.uniqueId("_root")); ) ;
  return t;
}
var eg = tg;
function tg(e, t, n) {
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
let ng = Np, rg = $p, og = Gp, ig = Zp, sg = eg, ag = Fe.Graph, sr = we;
var lg = Pl;
function Pl(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, Pl);
    return;
  }
  let n = sr.maxRank(e), r = Is(e, sr.range(1, n + 1), "inEdges"), o = Is(e, sr.range(n - 1, -1, -1), "outEdges"), i = ng(e);
  if (As(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    cg(l % 2 ? r : o, l % 4 >= 2), i = sr.buildLayerMatrix(e);
    let d = rg(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  As(e, a);
}
function Is(e, t, n) {
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
    return ig(e, i, n, r.get(i) || []);
  });
}
function cg(e, t) {
  let n = new ag();
  e.forEach(function(r) {
    let o = r.graph().root, i = og(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), sg(r, n, i.vs);
  });
}
function As(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let dg = Fe.Graph, it = we;
var ug = {
  positionX: _g
};
function fg(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, f) => {
      let h = pg(e, d), p = h ? e.node(h).order : l;
      (h || d === c) && (i.slice(a, f + 1).forEach((g) => {
        e.predecessors(g).forEach((b) => {
          let v = e.node(b), m = v.order;
          (m < s || p < m) && !(v.dummy && e.node(g).dummy) && Dl(n, b, g);
        });
      }), a = f + 1, s = p);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function hg(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    it.range(s, a).forEach((f) => {
      d = i[f], e.node(d).dummy && e.predecessors(d).forEach((h) => {
        let p = e.node(h);
        p.dummy && (p.order < l || p.order > c) && Dl(n, h, d);
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
function pg(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function Dl(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function gg(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function mg(e, t, n, r) {
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
          i[c] === c && l < s[g] && !gg(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function yg(e, t, n, r, o) {
  let i = {}, s = wg(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, h) {
    let p = s.nodes(), g = p.pop(), b = {};
    for (; g; )
      b[g] ? f(g) : (b[g] = !0, p.push(g), p = p.concat(h(g))), g = p.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((h, p) => Math.max(h, i[p.v] + s.edge(p)), 0);
  }
  function d(f) {
    let h = s.outEdges(f).reduce((g, b) => Math.min(g, i[b.w] - s.edge(b)), Number.POSITIVE_INFINITY), p = e.node(f);
    h !== Number.POSITIVE_INFINITY && p.borderType !== a && (i[f] = Math.max(i[f], h));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function wg(e, t, n, r) {
  let o = new dg(), i = e.graph(), s = kg(i.nodesep, i.edgesep, r);
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
function bg(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = Eg(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function vg(e, t) {
  let n = Object.values(t), r = it.applyWithChunking(Math.min, n), o = it.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), d = r - it.applyWithChunking(Math.min, c);
      s !== "l" && (d = o - it.applyWithChunking(Math.max, c)), d && (e[a] = it.mapValues(l, (f) => f + d));
    });
  });
}
function xg(e, t) {
  return it.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function _g(e) {
  let t = it.buildLayerMatrix(e), n = Object.assign(
    fg(e, t),
    hg(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = mg(e, o, n, l), d = yg(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = it.mapValues(d, (f) => -f)), r[s + a] = d;
    });
  });
  let i = bg(e, r);
  return vg(r, i), xg(r, e.graph().align);
}
function kg(e, t, n) {
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
function Eg(e, t) {
  return e.node(t).width;
}
let Rl = we, Sg = ug.positionX;
var Ng = Cg;
function Cg(e) {
  e = Rl.asNonCompoundGraph(e), Mg(e), Object.entries(Sg(e)).forEach(([t, n]) => e.node(t).x = n);
}
function Mg(e) {
  let t = Rl.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let Ts = Ih, Ls = Oh, $g = ip, Ig = we.normalizeRanks, Ag = cp, Tg = we.removeEmptyRanks, zs = hp, Lg = bp, Os = xp, zg = lg, Og = Ng, ze = we, Pg = Fe.Graph;
var Dg = Rg;
function Rg(e, t) {
  let n = t && t.debugTiming ? ze.time : ze.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => Ug(e));
    n("  runLayout", () => Hg(r, n, t)), n("  updateInputGraph", () => Wg(e, r));
  });
}
function Hg(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => qg(e)), t("    removeSelfEdges", () => om(e)), t("    acyclic", () => Ts.run(e)), t("    nestingGraph.run", () => zs.run(e)), t("    rank", () => $g(ze.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Kg(e)), t("    removeEmptyRanks", () => Tg(e)), t("    nestingGraph.cleanup", () => zs.cleanup(e)), t("    normalizeRanks", () => Ig(e)), t("    assignRankMinMax", () => Zg(e)), t("    removeEdgeLabelProxies", () => Qg(e)), t("    normalize.run", () => Ls.run(e)), t("    parentDummyChains", () => Ag(e)), t("    addBorderSegments", () => Lg(e)), t("    order", () => zg(e, n)), t("    insertSelfEdges", () => im(e)), t("    adjustCoordinateSystem", () => Os.adjust(e)), t("    position", () => Og(e)), t("    positionSelfEdges", () => sm(e)), t("    removeBorderNodes", () => rm(e)), t("    normalize.undo", () => Ls.undo(e)), t("    fixupEdgeLabelCoords", () => tm(e)), t("    undoCoordinateSystem", () => Os.undo(e)), t("    translateGraph", () => Jg(e)), t("    assignNodeIntersects", () => em(e)), t("    reversePoints", () => nm(e)), t("    acyclic.undo", () => Ts.undo(e));
}
function Wg(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let Bg = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], Vg = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Fg = ["acyclicer", "ranker", "rankdir", "align"], jg = ["width", "height", "rank"], Ps = { width: 0, height: 0 }, Yg = ["minlen", "weight", "width", "height", "labeloffset"], Gg = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Xg = ["labelpos"];
function Ug(e) {
  let t = new Pg({ multigraph: !0, compound: !0 }), n = jo(e.graph());
  return t.setGraph(Object.assign(
    {},
    Vg,
    Fo(n, Bg),
    ze.pick(n, Fg)
  )), e.nodes().forEach((r) => {
    let o = jo(e.node(r));
    const i = Fo(o, jg);
    Object.keys(Ps).forEach((s) => {
      i[s] === void 0 && (i[s] = Ps[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = jo(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Gg,
      Fo(o, Yg),
      ze.pick(o, Xg)
    ));
  }), t;
}
function qg(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Kg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      ze.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Zg(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function Qg(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Jg(e) {
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
function em(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(ze.intersectRect(r, i)), n.points.push(ze.intersectRect(o, s));
  });
}
function tm(e) {
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
function nm(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function rm(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function om(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function im(e) {
  var t = ze.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        ze.addDummyNode(e, "selfedge", {
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
function sm(e) {
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
function Fo(e, t) {
  return ze.mapValues(ze.pick(e, t), Number);
}
function jo(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let am = we, lm = Fe.Graph;
var cm = {
  debugOrdering: dm
};
function dm(e) {
  let t = am.buildLayerMatrix(e), n = new lm({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var um = "1.1.8", fm = {
  graphlib: Fe,
  layout: Dg,
  debug: cm,
  util: {
    time: we.time,
    notime: we.notime
  },
  version: um
};
const Ir = /* @__PURE__ */ fl(fm);
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
var hm = { value: () => {
} };
function Ur() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new vr(n);
}
function vr(e) {
  this._ = e;
}
function pm(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
vr.prototype = Ur.prototype = {
  constructor: vr,
  on: function(e, t) {
    var n = this._, r = pm(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = gm(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Ds(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Ds(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new vr(e);
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
function gm(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Ds(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = hm, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var li = "http://www.w3.org/1999/xhtml";
const Rs = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: li,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function qr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Rs.hasOwnProperty(t) ? { space: Rs[t], local: e } : e;
}
function mm(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === li && t.documentElement.namespaceURI === li ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function ym(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Hl(e) {
  var t = qr(e);
  return (t.local ? ym : mm)(t);
}
function wm() {
}
function Bi(e) {
  return e == null ? wm : function() {
    return this.querySelector(e);
  };
}
function bm(e) {
  typeof e != "function" && (e = Bi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Ae(r, this._parents);
}
function vm(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function xm() {
  return [];
}
function Wl(e) {
  return e == null ? xm : function() {
    return this.querySelectorAll(e);
  };
}
function _m(e) {
  return function() {
    return vm(e.apply(this, arguments));
  };
}
function km(e) {
  typeof e == "function" ? e = _m(e) : e = Wl(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new Ae(r, o);
}
function Bl(e) {
  return function() {
    return this.matches(e);
  };
}
function Vl(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Em = Array.prototype.find;
function Sm(e) {
  return function() {
    return Em.call(this.children, e);
  };
}
function Nm() {
  return this.firstElementChild;
}
function Cm(e) {
  return this.select(e == null ? Nm : Sm(typeof e == "function" ? e : Vl(e)));
}
var Mm = Array.prototype.filter;
function $m() {
  return Array.from(this.children);
}
function Im(e) {
  return function() {
    return Mm.call(this.children, e);
  };
}
function Am(e) {
  return this.selectAll(e == null ? $m : Im(typeof e == "function" ? e : Vl(e)));
}
function Tm(e) {
  typeof e != "function" && (e = Bl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ae(r, this._parents);
}
function Fl(e) {
  return new Array(e.length);
}
function Lm() {
  return new Ae(this._enter || this._groups.map(Fl), this._parents);
}
function Ar(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Ar.prototype = {
  constructor: Ar,
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
function zm(e) {
  return function() {
    return e;
  };
}
function Om(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new Ar(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function Pm(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, f = i.length, h = new Array(d), p;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (h[a] = p = s.call(l, l.__data__, a, t) + "", c.has(p) ? o[a] = l : c.set(p, l));
  for (a = 0; a < f; ++a)
    p = s.call(e, i[a], a, i) + "", (l = c.get(p)) ? (r[a] = l, l.__data__ = i[a], c.delete(p)) : n[a] = new Ar(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(h[a]) === l && (o[a] = l);
}
function Dm(e) {
  return e.__data__;
}
function Rm(e, t) {
  if (!arguments.length) return Array.from(this, Dm);
  var n = t ? Pm : Om, r = this._parents, o = this._groups;
  typeof e != "function" && (e = zm(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], f = o[c], h = f.length, p = Hm(e.call(d, d && d.__data__, c, r)), g = p.length, b = a[c] = new Array(g), v = s[c] = new Array(g), m = l[c] = new Array(h);
    n(d, f, b, v, m, p, t);
    for (var _ = 0, y = 0, w, N; _ < g; ++_)
      if (w = b[_]) {
        for (_ >= y && (y = _ + 1); !(N = v[y]) && ++y < g; ) ;
        w._next = N || null;
      }
  }
  return s = new Ae(s, r), s._enter = a, s._exit = l, s;
}
function Hm(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Wm() {
  return new Ae(this._exit || this._groups.map(Fl), this._parents);
}
function Bm(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function Vm(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], f = c.length, h = a[l] = new Array(f), p, g = 0; g < f; ++g)
      (p = c[g] || d[g]) && (h[g] = p);
  for (; l < o; ++l)
    a[l] = n[l];
  return new Ae(a, this._parents);
}
function Fm() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function jm(e) {
  e || (e = Ym);
  function t(f, h) {
    return f && h ? e(f.__data__, h.__data__) : !f - !h;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(t);
  }
  return new Ae(o, this._parents).order();
}
function Ym(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Gm() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Xm() {
  return Array.from(this);
}
function Um() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function qm() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Km() {
  return !this.node();
}
function Zm(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function Qm(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Jm(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function ey(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function ty(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function ny(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function ry(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function oy(e, t) {
  var n = qr(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Jm : Qm : typeof t == "function" ? n.local ? ry : ny : n.local ? ty : ey)(n, t));
}
function jl(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function iy(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function sy(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function ay(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function ly(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? iy : typeof t == "function" ? ay : sy)(e, t, n ?? "")) : Gt(this.node(), e);
}
function Gt(e, t) {
  return e.style.getPropertyValue(t) || jl(e).getComputedStyle(e, null).getPropertyValue(t);
}
function cy(e) {
  return function() {
    delete this[e];
  };
}
function dy(e, t) {
  return function() {
    this[e] = t;
  };
}
function uy(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function fy(e, t) {
  return arguments.length > 1 ? this.each((t == null ? cy : typeof t == "function" ? uy : dy)(e, t)) : this.node()[e];
}
function Yl(e) {
  return e.trim().split(/^|\s+/);
}
function Vi(e) {
  return e.classList || new Gl(e);
}
function Gl(e) {
  this._node = e, this._names = Yl(e.getAttribute("class") || "");
}
Gl.prototype = {
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
function Xl(e, t) {
  for (var n = Vi(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function Ul(e, t) {
  for (var n = Vi(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function hy(e) {
  return function() {
    Xl(this, e);
  };
}
function py(e) {
  return function() {
    Ul(this, e);
  };
}
function gy(e, t) {
  return function() {
    (t.apply(this, arguments) ? Xl : Ul)(this, e);
  };
}
function my(e, t) {
  var n = Yl(e + "");
  if (arguments.length < 2) {
    for (var r = Vi(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? gy : t ? hy : py)(n, t));
}
function yy() {
  this.textContent = "";
}
function wy(e) {
  return function() {
    this.textContent = e;
  };
}
function by(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function vy(e) {
  return arguments.length ? this.each(e == null ? yy : (typeof e == "function" ? by : wy)(e)) : this.node().textContent;
}
function xy() {
  this.innerHTML = "";
}
function _y(e) {
  return function() {
    this.innerHTML = e;
  };
}
function ky(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Ey(e) {
  return arguments.length ? this.each(e == null ? xy : (typeof e == "function" ? ky : _y)(e)) : this.node().innerHTML;
}
function Sy() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ny() {
  return this.each(Sy);
}
function Cy() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function My() {
  return this.each(Cy);
}
function $y(e) {
  var t = typeof e == "function" ? e : Hl(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Iy() {
  return null;
}
function Ay(e, t) {
  var n = typeof e == "function" ? e : Hl(e), r = t == null ? Iy : typeof t == "function" ? t : Bi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Ty() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Ly() {
  return this.each(Ty);
}
function zy() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Oy() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Py(e) {
  return this.select(e ? Oy : zy);
}
function Dy(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Ry(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Hy(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function Wy(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function By(e, t, n) {
  return function() {
    var r = this.__on, o, i = Ry(t);
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
function Vy(e, t, n) {
  var r = Hy(e + ""), o, i = r.length, s;
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
  for (a = t ? By : Wy, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function ql(e, t, n) {
  var r = jl(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Fy(e, t) {
  return function() {
    return ql(this, e, t);
  };
}
function jy(e, t) {
  return function() {
    return ql(this, e, t.apply(this, arguments));
  };
}
function Yy(e, t) {
  return this.each((typeof t == "function" ? jy : Fy)(e, t));
}
function* Gy() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Kl = [null];
function Ae(e, t) {
  this._groups = e, this._parents = t;
}
function Rn() {
  return new Ae([[document.documentElement]], Kl);
}
function Xy() {
  return this;
}
Ae.prototype = Rn.prototype = {
  constructor: Ae,
  select: bm,
  selectAll: km,
  selectChild: Cm,
  selectChildren: Am,
  filter: Tm,
  data: Rm,
  enter: Lm,
  exit: Wm,
  join: Bm,
  merge: Vm,
  selection: Xy,
  order: Fm,
  sort: jm,
  call: Gm,
  nodes: Xm,
  node: Um,
  size: qm,
  empty: Km,
  each: Zm,
  attr: oy,
  style: ly,
  property: fy,
  classed: my,
  text: vy,
  html: Ey,
  raise: Ny,
  lower: My,
  append: $y,
  insert: Ay,
  remove: Ly,
  clone: Py,
  datum: Dy,
  on: Vy,
  dispatch: Yy,
  [Symbol.iterator]: Gy
};
function Me(e) {
  return typeof e == "string" ? new Ae([[document.querySelector(e)]], [document.documentElement]) : new Ae([[e]], Kl);
}
function Uy(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Re(e, t) {
  if (e = Uy(e), t === void 0 && (t = e.currentTarget), t) {
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
const qy = { passive: !1 }, Cn = { capture: !0, passive: !1 };
function Yo(e) {
  e.stopImmediatePropagation();
}
function jt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Zl(e) {
  var t = e.document.documentElement, n = Me(e).on("dragstart.drag", jt, Cn);
  "onselectstart" in t ? n.on("selectstart.drag", jt, Cn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Ql(e, t) {
  var n = e.document.documentElement, r = Me(e).on("dragstart.drag", null);
  t && (r.on("click.drag", jt, Cn), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const ar = (e) => () => e;
function ci(e, {
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
ci.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Ky(e) {
  return !e.ctrlKey && !e.button;
}
function Zy() {
  return this.parentNode;
}
function Qy(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Jy() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Jl() {
  var e = Ky, t = Zy, n = Qy, r = Jy, o = {}, i = Ur("start", "drag", "end"), s = 0, a, l, c, d, f = 0;
  function h(w) {
    w.on("mousedown.drag", p).filter(r).on("touchstart.drag", v).on("touchmove.drag", m, qy).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(w, N) {
    if (!(d || !e.call(this, w, N))) {
      var E = y(this, t.call(this, w, N), w, N, "mouse");
      E && (Me(w.view).on("mousemove.drag", g, Cn).on("mouseup.drag", b, Cn), Zl(w.view), Yo(w), c = !1, a = w.clientX, l = w.clientY, E("start", w));
    }
  }
  function g(w) {
    if (jt(w), !c) {
      var N = w.clientX - a, E = w.clientY - l;
      c = N * N + E * E > f;
    }
    o.mouse("drag", w);
  }
  function b(w) {
    Me(w.view).on("mousemove.drag mouseup.drag", null), Ql(w.view, c), jt(w), o.mouse("end", w);
  }
  function v(w, N) {
    if (e.call(this, w, N)) {
      var E = w.changedTouches, C = t.call(this, w, N), T = E.length, A, O;
      for (A = 0; A < T; ++A)
        (O = y(this, C, w, N, E[A].identifier, E[A])) && (Yo(w), O("start", w, E[A]));
    }
  }
  function m(w) {
    var N = w.changedTouches, E = N.length, C, T;
    for (C = 0; C < E; ++C)
      (T = o[N[C].identifier]) && (jt(w), T("drag", w, N[C]));
  }
  function _(w) {
    var N = w.changedTouches, E = N.length, C, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), C = 0; C < E; ++C)
      (T = o[N[C].identifier]) && (Yo(w), T("end", w, N[C]));
  }
  function y(w, N, E, C, T, A) {
    var O = i.copy(), L = Re(A || E, N), B, H, x;
    if ((x = n.call(w, new ci("beforestart", {
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
          new ci(M, {
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
    return arguments.length ? (e = typeof w == "function" ? w : ar(!!w), h) : e;
  }, h.container = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : ar(w), h) : t;
  }, h.subject = function(w) {
    return arguments.length ? (n = typeof w == "function" ? w : ar(w), h) : n;
  }, h.touchable = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : ar(!!w), h) : r;
  }, h.on = function() {
    var w = i.on.apply(i, arguments);
    return w === i ? h : w;
  }, h.clickDistance = function(w) {
    return arguments.length ? (f = (w = +w) * w, h) : Math.sqrt(f);
  }, h;
}
function Fi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ec(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Hn() {
}
var Mn = 0.7, Tr = 1 / Mn, Yt = "\\s*([+-]?\\d+)\\s*", $n = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ze = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", e0 = /^#([0-9a-f]{3,8})$/, t0 = new RegExp(`^rgb\\(${Yt},${Yt},${Yt}\\)$`), n0 = new RegExp(`^rgb\\(${Ze},${Ze},${Ze}\\)$`), r0 = new RegExp(`^rgba\\(${Yt},${Yt},${Yt},${$n}\\)$`), o0 = new RegExp(`^rgba\\(${Ze},${Ze},${Ze},${$n}\\)$`), i0 = new RegExp(`^hsl\\(${$n},${Ze},${Ze}\\)$`), s0 = new RegExp(`^hsla\\(${$n},${Ze},${Ze},${$n}\\)$`), Hs = {
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
Fi(Hn, Ct, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ws,
  // Deprecated! Use color.formatHex.
  formatHex: Ws,
  formatHex8: a0,
  formatHsl: l0,
  formatRgb: Bs,
  toString: Bs
});
function Ws() {
  return this.rgb().formatHex();
}
function a0() {
  return this.rgb().formatHex8();
}
function l0() {
  return tc(this).formatHsl();
}
function Bs() {
  return this.rgb().formatRgb();
}
function Ct(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = e0.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Vs(t) : n === 3 ? new Se(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? lr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? lr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = t0.exec(e)) ? new Se(t[1], t[2], t[3], 1) : (t = n0.exec(e)) ? new Se(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = r0.exec(e)) ? lr(t[1], t[2], t[3], t[4]) : (t = o0.exec(e)) ? lr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = i0.exec(e)) ? Ys(t[1], t[2] / 100, t[3] / 100, 1) : (t = s0.exec(e)) ? Ys(t[1], t[2] / 100, t[3] / 100, t[4]) : Hs.hasOwnProperty(e) ? Vs(Hs[e]) : e === "transparent" ? new Se(NaN, NaN, NaN, 0) : null;
}
function Vs(e) {
  return new Se(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function lr(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Se(e, t, n, r);
}
function c0(e) {
  return e instanceof Hn || (e = Ct(e)), e ? (e = e.rgb(), new Se(e.r, e.g, e.b, e.opacity)) : new Se();
}
function di(e, t, n, r) {
  return arguments.length === 1 ? c0(e) : new Se(e, t, n, r ?? 1);
}
function Se(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Fi(Se, di, ec(Hn, {
  brighter(e) {
    return e = e == null ? Tr : Math.pow(Tr, e), new Se(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Mn : Math.pow(Mn, e), new Se(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Se(St(this.r), St(this.g), St(this.b), Lr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Fs,
  // Deprecated! Use color.formatHex.
  formatHex: Fs,
  formatHex8: d0,
  formatRgb: js,
  toString: js
}));
function Fs() {
  return `#${Et(this.r)}${Et(this.g)}${Et(this.b)}`;
}
function d0() {
  return `#${Et(this.r)}${Et(this.g)}${Et(this.b)}${Et((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function js() {
  const e = Lr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${St(this.r)}, ${St(this.g)}, ${St(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Lr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function St(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Et(e) {
  return e = St(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ys(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new He(e, t, n, r);
}
function tc(e) {
  if (e instanceof He) return new He(e.h, e.s, e.l, e.opacity);
  if (e instanceof Hn || (e = Ct(e)), !e) return new He();
  if (e instanceof He) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new He(s, a, l, e.opacity);
}
function u0(e, t, n, r) {
  return arguments.length === 1 ? tc(e) : new He(e, t, n, r ?? 1);
}
function He(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Fi(He, u0, ec(Hn, {
  brighter(e) {
    return e = e == null ? Tr : Math.pow(Tr, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Mn : Math.pow(Mn, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new Se(
      Go(e >= 240 ? e - 240 : e + 120, o, r),
      Go(e, o, r),
      Go(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new He(Gs(this.h), cr(this.s), cr(this.l), Lr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Lr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Gs(this.h)}, ${cr(this.s) * 100}%, ${cr(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Gs(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function cr(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Go(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const ji = (e) => () => e;
function f0(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function h0(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function p0(e) {
  return (e = +e) == 1 ? nc : function(t, n) {
    return n - t ? h0(t, n, e) : ji(isNaN(t) ? n : t);
  };
}
function nc(e, t) {
  var n = t - e;
  return n ? f0(e, n) : ji(isNaN(e) ? t : e);
}
const zr = function e(t) {
  var n = p0(t);
  function r(o, i) {
    var s = n((o = di(o)).r, (i = di(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = nc(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function g0(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function m0(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function y0(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = En(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function w0(e, t) {
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
function b0(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = En(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var ui = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Xo = new RegExp(ui.source, "g");
function v0(e) {
  return function() {
    return e;
  };
}
function x0(e) {
  return function(t) {
    return e(t) + "";
  };
}
function rc(e, t) {
  var n = ui.lastIndex = Xo.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = ui.exec(e)) && (o = Xo.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: qe(r, o) })), n = Xo.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? x0(l[0].x) : v0(t) : (t = l.length, function(c) {
    for (var d = 0, f; d < t; ++d) a[(f = l[d]).i] = f.x(c);
    return a.join("");
  });
}
function En(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? ji(t) : (n === "number" ? qe : n === "string" ? (r = Ct(t)) ? (t = r, zr) : rc : t instanceof Ct ? zr : t instanceof Date ? w0 : m0(t) ? g0 : Array.isArray(t) ? y0 : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? b0 : qe)(e, t);
}
var Xs = 180 / Math.PI, fi = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function oc(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * Xs,
    skewX: Math.atan(l) * Xs,
    scaleX: s,
    scaleY: a
  };
}
var dr;
function _0(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? fi : oc(t.a, t.b, t.c, t.d, t.e, t.f);
}
function k0(e) {
  return e == null || (dr || (dr = document.createElementNS("http://www.w3.org/2000/svg", "g")), dr.setAttribute("transform", e), !(e = dr.transform.baseVal.consolidate())) ? fi : (e = e.matrix, oc(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ic(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, f, h, p, g) {
    if (c !== f || d !== h) {
      var b = p.push("translate(", null, t, null, n);
      g.push({ i: b - 4, x: qe(c, f) }, { i: b - 2, x: qe(d, h) });
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
      var b = p.push(o(p) + "scale(", null, ",", null, ")");
      g.push({ i: b - 4, x: qe(c, f) }, { i: b - 2, x: qe(d, h) });
    } else (f !== 1 || h !== 1) && p.push(o(p) + "scale(" + f + "," + h + ")");
  }
  return function(c, d) {
    var f = [], h = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, f, h), s(c.rotate, d.rotate, f, h), a(c.skewX, d.skewX, f, h), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, h), c = d = null, function(p) {
      for (var g = -1, b = h.length, v; ++g < b; ) f[(v = h[g]).i] = v.x(p);
      return f.join("");
    };
  };
}
var E0 = ic(_0, "px, ", "px)", "deg)"), S0 = ic(k0, ", ", ")", ")"), N0 = 1e-12;
function Us(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function C0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function M0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const xr = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], f = s[1], h = s[2], p = d - a, g = f - l, b = p * p + g * g, v, m;
    if (b < N0)
      m = Math.log(h / c) / t, v = function(C) {
        return [
          a + C * p,
          l + C * g,
          c * Math.exp(t * C * m)
        ];
      };
    else {
      var _ = Math.sqrt(b), y = (h * h - c * c + r * b) / (2 * c * n * _), w = (h * h - c * c - r * b) / (2 * h * n * _), N = Math.log(Math.sqrt(y * y + 1) - y), E = Math.log(Math.sqrt(w * w + 1) - w);
      m = (E - N) / t, v = function(C) {
        var T = C * m, A = Us(N), O = c / (n * _) * (A * M0(t * T + N) - C0(N));
        return [
          a + O * p,
          l + O * g,
          c * A / Us(t * T + N)
        ];
      };
    }
    return v.duration = m * 1e3 * t / Math.SQRT2, v;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var Xt = 0, vn = 0, yn = 0, sc = 1e3, Or, xn, Pr = 0, Mt = 0, Kr = 0, In = typeof performance == "object" && performance.now ? performance : Date, ac = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Yi() {
  return Mt || (ac($0), Mt = In.now() + Kr);
}
function $0() {
  Mt = 0;
}
function Dr() {
  this._call = this._time = this._next = null;
}
Dr.prototype = lc.prototype = {
  constructor: Dr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Yi() : +n) + (t == null ? 0 : +t), !this._next && xn !== this && (xn ? xn._next = this : Or = this, xn = this), this._call = e, this._time = n, hi();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, hi());
  }
};
function lc(e, t, n) {
  var r = new Dr();
  return r.restart(e, t, n), r;
}
function I0() {
  Yi(), ++Xt;
  for (var e = Or, t; e; )
    (t = Mt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Xt;
}
function qs() {
  Mt = (Pr = In.now()) + Kr, Xt = vn = 0;
  try {
    I0();
  } finally {
    Xt = 0, T0(), Mt = 0;
  }
}
function A0() {
  var e = In.now(), t = e - Pr;
  t > sc && (Kr -= t, Pr = e);
}
function T0() {
  for (var e, t = Or, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Or = n);
  xn = e, hi(r);
}
function hi(e) {
  if (!Xt) {
    vn && (vn = clearTimeout(vn));
    var t = e - Mt;
    t > 24 ? (e < 1 / 0 && (vn = setTimeout(qs, e - In.now() - Kr)), yn && (yn = clearInterval(yn))) : (yn || (Pr = In.now(), yn = setInterval(A0, sc)), Xt = 1, ac(qs));
  }
}
function Ks(e, t, n) {
  var r = new Dr();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var L0 = Ur("start", "end", "cancel", "interrupt"), z0 = [], cc = 0, Zs = 1, pi = 2, _r = 3, Qs = 4, gi = 5, kr = 6;
function Zr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  O0(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: L0,
    tween: z0,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: cc
  });
}
function Gi(e, t) {
  var n = je(e, t);
  if (n.state > cc) throw new Error("too late; already scheduled");
  return n;
}
function Qe(e, t) {
  var n = je(e, t);
  if (n.state > _r) throw new Error("too late; already running");
  return n;
}
function je(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function O0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = lc(i, 0, n.time);
  function i(c) {
    n.state = Zs, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, h, p;
    if (n.state !== Zs) return l();
    for (d in r)
      if (p = r[d], p.name === n.name) {
        if (p.state === _r) return Ks(s);
        p.state === Qs ? (p.state = kr, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete r[d]) : +d < t && (p.state = kr, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete r[d]);
      }
    if (Ks(function() {
      n.state === _r && (n.state = Qs, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = pi, n.on.call("start", e, e.__data__, n.index, n.group), n.state === pi) {
      for (n.state = _r, o = new Array(h = n.tween.length), d = 0, f = -1; d < h; ++d)
        (p = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = p);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = gi, 1), f = -1, h = o.length; ++f < h; )
      o[f].call(e, d);
    n.state === gi && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = kr, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function Er(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > pi && r.state < gi, r.state = kr, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function P0(e) {
  return this.each(function() {
    Er(this, e);
  });
}
function D0(e, t) {
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
function R0(e, t, n) {
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
function H0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = je(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? D0 : R0)(n, e, t));
}
function Xi(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = Qe(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return je(o, r).value[t];
  };
}
function dc(e, t) {
  var n;
  return (typeof t == "number" ? qe : t instanceof Ct ? zr : (n = Ct(t)) ? (t = n, zr) : rc)(e, t);
}
function W0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function B0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function V0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function F0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function j0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function Y0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function G0(e, t) {
  var n = qr(e), r = n === "transform" ? S0 : dc;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Y0 : j0)(n, r, Xi(this, "attr." + e, t)) : t == null ? (n.local ? B0 : W0)(n) : (n.local ? F0 : V0)(n, r, t));
}
function X0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function U0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function q0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && U0(e, i)), n;
  }
  return o._value = t, o;
}
function K0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && X0(e, i)), n;
  }
  return o._value = t, o;
}
function Z0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = qr(e);
  return this.tween(n, (r.local ? q0 : K0)(r, t));
}
function Q0(e, t) {
  return function() {
    Gi(this, e).delay = +t.apply(this, arguments);
  };
}
function J0(e, t) {
  return t = +t, function() {
    Gi(this, e).delay = t;
  };
}
function ew(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Q0 : J0)(t, e)) : je(this.node(), t).delay;
}
function tw(e, t) {
  return function() {
    Qe(this, e).duration = +t.apply(this, arguments);
  };
}
function nw(e, t) {
  return t = +t, function() {
    Qe(this, e).duration = t;
  };
}
function rw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? tw : nw)(t, e)) : je(this.node(), t).duration;
}
function ow(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Qe(this, e).ease = t;
  };
}
function iw(e) {
  var t = this._id;
  return arguments.length ? this.each(ow(t, e)) : je(this.node(), t).ease;
}
function sw(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Qe(this, e).ease = n;
  };
}
function aw(e) {
  if (typeof e != "function") throw new Error();
  return this.each(sw(this._id, e));
}
function lw(e) {
  typeof e != "function" && (e = Bl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new at(r, this._parents, this._name, this._id);
}
function cw(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, f = s[a] = new Array(d), h, p = 0; p < d; ++p)
      (h = l[p] || c[p]) && (f[p] = h);
  for (; a < r; ++a)
    s[a] = t[a];
  return new at(s, this._parents, this._name, this._id);
}
function dw(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function uw(e, t, n) {
  var r, o, i = dw(t) ? Gi : Qe;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function fw(e, t) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(e) : this.each(uw(n, e, t));
}
function hw(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function pw() {
  return this.on("end.remove", hw(this._id));
}
function gw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Bi(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, f, h = 0; h < l; ++h)
      (d = a[h]) && (f = e.call(d, d.__data__, h, a)) && ("__data__" in d && (f.__data__ = d.__data__), c[h] = f, Zr(c[h], t, n, h, c, je(d, n)));
  return new at(i, this._parents, t, n);
}
function mw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Wl(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, f = 0; f < c; ++f)
      if (d = l[f]) {
        for (var h = e.call(d, d.__data__, f, l), p, g = je(d, n), b = 0, v = h.length; b < v; ++b)
          (p = h[b]) && Zr(p, t, n, b, h, g);
        i.push(h), s.push(d);
      }
  return new at(i, s, t, n);
}
var yw = Rn.prototype.constructor;
function ww() {
  return new yw(this._groups, this._parents);
}
function bw(e, t) {
  var n, r, o;
  return function() {
    var i = Gt(this, e), s = (this.style.removeProperty(e), Gt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function uc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function vw(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = Gt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function xw(e, t, n) {
  var r, o, i;
  return function() {
    var s = Gt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Gt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function _w(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Qe(this, e), c = l.on, d = l.value[i] == null ? a || (a = uc(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function kw(e, t, n) {
  var r = (e += "") == "transform" ? E0 : dc;
  return t == null ? this.styleTween(e, bw(e, r)).on("end.style." + e, uc(e)) : typeof t == "function" ? this.styleTween(e, xw(e, r, Xi(this, "style." + e, t))).each(_w(this._id, e)) : this.styleTween(e, vw(e, r, t), n).on("end.style." + e, null);
}
function Ew(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function Sw(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && Ew(e, s, n)), r;
  }
  return i._value = t, i;
}
function Nw(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, Sw(e, t, n ?? ""));
}
function Cw(e) {
  return function() {
    this.textContent = e;
  };
}
function Mw(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function $w(e) {
  return this.tween("text", typeof e == "function" ? Mw(Xi(this, "text", e)) : Cw(e == null ? "" : e + ""));
}
function Iw(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Aw(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && Iw(o)), t;
  }
  return r._value = e, r;
}
function Tw(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Aw(e));
}
function Lw() {
  for (var e = this._name, t = this._id, n = fc(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = je(l, t);
        Zr(l, e, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new at(r, this._parents, e, n);
}
function zw() {
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
var Ow = 0;
function at(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function fc() {
  return ++Ow;
}
var rt = Rn.prototype;
at.prototype = {
  constructor: at,
  select: gw,
  selectAll: mw,
  selectChild: rt.selectChild,
  selectChildren: rt.selectChildren,
  filter: lw,
  merge: cw,
  selection: ww,
  transition: Lw,
  call: rt.call,
  nodes: rt.nodes,
  node: rt.node,
  size: rt.size,
  empty: rt.empty,
  each: rt.each,
  on: fw,
  attr: G0,
  attrTween: Z0,
  style: kw,
  styleTween: Nw,
  text: $w,
  textTween: Tw,
  remove: pw,
  tween: H0,
  delay: ew,
  duration: rw,
  ease: iw,
  easeVarying: aw,
  end: zw,
  [Symbol.iterator]: rt[Symbol.iterator]
};
function Pw(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Dw = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Pw
};
function Rw(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Hw(e) {
  var t, n;
  e instanceof at ? (t = e._id, e = e._name) : (t = fc(), (n = Dw).time = Yi(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Zr(l, e, t, c, s, n || Rw(l, t));
  return new at(r, this._parents, e, t);
}
Rn.prototype.interrupt = P0;
Rn.prototype.transition = Hw;
const ur = (e) => () => e;
function Ww(e, {
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
function st(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
st.prototype = {
  constructor: st,
  scale: function(e) {
    return e === 1 ? this : new st(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new st(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Qr = new st(1, 0, 0);
hc.prototype = st.prototype;
function hc(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Qr;
  return e.__zoom;
}
function Uo(e) {
  e.stopImmediatePropagation();
}
function wn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Bw(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Vw() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Js() {
  return this.__zoom || Qr;
}
function Fw(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function jw() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Yw(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function pc() {
  var e = Bw, t = Vw, n = Yw, r = Fw, o = jw, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = xr, c = Ur("start", "zoom", "end"), d, f, h, p = 500, g = 150, b = 0, v = 10;
  function m(x) {
    x.property("__zoom", Js).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", O).filter(o).on("touchstart.zoom", L).on("touchmove.zoom", B).on("touchend.zoom touchcancel.zoom", H).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(x, $, M, S) {
    var z = x.selection ? x.selection() : x;
    z.property("__zoom", Js), x !== z ? N(x, $, M, S) : z.interrupt().each(function() {
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
      return n(Qr.translate(P[0], P[1]).scale(D.k).translate(
        typeof $ == "function" ? -$.apply(this, arguments) : -$,
        typeof M == "function" ? -M.apply(this, arguments) : -M
      ), I, s);
    }, S, z);
  };
  function _(x, $) {
    return $ = Math.max(i[0], Math.min(i[1], $)), $ === x.k ? x : new st($, x.x, x.y);
  }
  function y(x, $, M) {
    var S = $[0] - M[0] * x.k, z = $[1] - M[1] * x.k;
    return S === x.x && z === x.y ? x : new st(x.k, S, z);
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
          ee = new st(j, V[0] - W[0] * j, V[1] - W[1] * j);
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
      var $ = Me(this.that).datum();
      c.call(
        x,
        this.that,
        new Ww(x, {
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
      M.mouse = [I, S.invert(I)], Er(this), M.start();
    }
    wn(x), M.wheel = setTimeout(D, g), M.zoom("mouse", n(y(_(S, z), M.mouse[0], M.mouse[1]), M.extent, s));
    function D() {
      M.wheel = null, M.end();
    }
  }
  function A(x, ...$) {
    if (h || !e.apply(this, arguments)) return;
    var M = x.currentTarget, S = E(this, $, !0).event(x), z = Me(x.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", X, !0), I = Re(x, M), D = x.clientX, P = x.clientY;
    Zl(x.view), Uo(x), S.mouse = [I, this.__zoom.invert(I)], Er(this), S.start();
    function V(F) {
      if (wn(F), !S.moved) {
        var Q = F.clientX - D, G = F.clientY - P;
        S.moved = Q * Q + G * G > b;
      }
      S.event(F).zoom("mouse", n(y(S.that.__zoom, S.mouse[0] = Re(F, M), S.mouse[1]), S.extent, s));
    }
    function X(F) {
      z.on("mousemove.zoom mouseup.zoom", null), Ql(F.view, S.moved), wn(F), S.event(F).end();
    }
  }
  function O(x, ...$) {
    if (e.apply(this, arguments)) {
      var M = this.__zoom, S = Re(x.changedTouches ? x.changedTouches[0] : x, this), z = M.invert(S), I = M.k * (x.shiftKey ? 0.5 : 2), D = n(y(_(M, I), S, z), t.apply(this, $), s);
      wn(x), a > 0 ? Me(this).transition().duration(a).call(N, D, S, x) : Me(this).call(m.transform, D, S, x);
    }
  }
  function L(x, ...$) {
    if (e.apply(this, arguments)) {
      var M = x.touches, S = M.length, z = E(this, $, x.changedTouches.length === S).event(x), I, D, P, V;
      for (Uo(x), D = 0; D < S; ++D)
        P = M[D], V = Re(P, this), V = [V, this.__zoom.invert(V), P.identifier], z.touch0 ? !z.touch1 && z.touch0[2] !== V[2] && (z.touch1 = V, z.taps = 0) : (z.touch0 = V, I = !0, z.taps = 1 + !!d);
      d && (d = clearTimeout(d)), I && (z.taps < 2 && (f = V[0], d = setTimeout(function() {
        d = null;
      }, p)), Er(this), z.start());
    }
  }
  function B(x, ...$) {
    if (this.__zooming) {
      var M = E(this, $).event(x), S = x.changedTouches, z = S.length, I, D, P, V;
      for (wn(x), I = 0; I < z; ++I)
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
      for (Uo(x), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, p), I = 0; I < z; ++I)
        D = S[I], M.touch0 && M.touch0[2] === D.identifier ? delete M.touch0 : M.touch1 && M.touch1[2] === D.identifier && delete M.touch1;
      if (M.touch1 && !M.touch0 && (M.touch0 = M.touch1, delete M.touch1), M.touch0) M.touch0[1] = this.__zoom.invert(M.touch0[0]);
      else if (M.end(), M.taps === 2 && (D = Re(D, this), Math.hypot(f[0] - D[0], f[1] - D[1]) < v)) {
        var P = Me(this).on("dblclick.zoom");
        P && P.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : ur(+x), m) : r;
  }, m.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : ur(!!x), m) : e;
  }, m.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : ur(!!x), m) : o;
  }, m.extent = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : ur([[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]]), m) : t;
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
    return arguments.length ? (b = (x = +x) * x, m) : Math.sqrt(b);
  }, m.tapDistance = function(x) {
    return arguments.length ? (v = +x, m) : v;
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
}, An = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], gc = ["Enter", " ", "Escape"], mc = {
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
var Ut;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Ut || (Ut = {}));
var Nt;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Nt || (Nt = {}));
var Tn;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Tn || (Tn = {}));
const yc = {
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
var ht;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(ht || (ht = {}));
var qt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(qt || (qt = {}));
var U;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(U || (U = {}));
const ea = {
  [U.Left]: U.Right,
  [U.Right]: U.Left,
  [U.Top]: U.Bottom,
  [U.Bottom]: U.Top
}, wc = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, Gw = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Ui = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Wn = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ye(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Xw = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Ui(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, Jr(o, Rr(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? eo(r) : { x: 0, y: 0, width: 0, height: 0 };
}, Bn = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = Jr(n, Rr(o)), r = !0);
  }), r ? eo(n) : { x: 0, y: 0, width: 0, height: 0 };
}, qi = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, f = [];
  for (const h of e.values()) {
    const { measured: p, selectable: g = !0, hidden: b = !1 } = h;
    if (s && !g || b)
      continue;
    const v = p.width ?? h.width ?? h.initialWidth ?? 0, m = p.height ?? h.height ?? h.initialHeight ?? 0, { x: _, y } = h.internals.positionAbsolute, w = _c(a, l, c, d, _, y, v, m), N = v * m, E = i && w > 0;
    (!h.internals.handleBounds || E || w >= N || h.dragging) && f.push(h);
  }
  return f;
}, Uw = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function qw(e, t) {
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
async function Kw({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = qw(e, s), l = Bn(a), c = to(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function bc({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
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
  else a && It(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const h = It(f) ? $t(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Ve.error015())), {
    position: {
      x: h.x - l + (s.measured.width ?? 0) * d[0],
      y: h.y - c + (s.measured.height ?? 0) * d[1]
    },
    positionAbsolute: h
  };
}
async function Zw({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((h) => h.id)), s = [];
  for (const h of n) {
    if (h.deletable === !1)
      continue;
    const p = i.has(h.id), g = !p && h.parentId && s.find((b) => b.id === h.parentId);
    (p || g) && s.push(h);
  }
  const a = new Set(t.map((h) => h.id)), l = r.filter((h) => h.deletable !== !1), d = Uw(s, l);
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
const Kt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), $t = (e = { x: 0, y: 0 }, t, n) => ({
  x: Kt(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: Kt(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function vc(e, t, n) {
  const { width: r, height: o } = Ye(n), { x: i, y: s } = n.internals.positionAbsolute;
  return $t(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const ta = (e, t, n) => e < t ? Kt(Math.abs(e - t), 1, t) / t : e > n ? -Kt(Math.abs(e - n), 1, t) / t : 0, Ki = (e, t, n = 15, r = 40) => {
  const o = ta(e.x, r, t.width - r) * n, i = ta(e.y, r, t.height - r) * n;
  return [o, i];
}, Jr = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), mi = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), eo = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), Ln = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Ui(e) ? e.internals.positionAbsolute : Wn(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Rr = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Ui(e) ? e.internals.positionAbsolute : Wn(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, xc = (e, t) => eo(Jr(mi(e), mi(t))), _c = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Hr = (e, t) => _c(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), na = (e) => We(e.width) && We(e.height) && We(e.x) && We(e.y), We = (e) => !isNaN(e) && isFinite(e), kc = (e, t) => (n, r) => {
}, Vn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Fn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Vn(a, s) : a;
}, Zt = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function Bt(e, t) {
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
function Qw(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = Bt(e, n), o = Bt(e, t);
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
    const r = Bt(e.top ?? e.y ?? 0, n), o = Bt(e.bottom ?? e.y ?? 0, n), i = Bt(e.left ?? e.x ?? 0, t), s = Bt(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Jw(e, t, n, r, o, i) {
  const { x: s, y: a } = Zt(e, [t, n, r]), { x: l, y: c } = Zt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(f)
  };
}
const to = (e, t, n, r, o, i) => {
  const s = Qw(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = Kt(c, r, o), f = e.x + e.width / 2, h = e.y + e.height / 2, p = t / 2 - f * d, g = n / 2 - h * d, b = Jw(e, p, g, d, t, n), v = {
    left: Math.min(b.left - s.left, 0),
    top: Math.min(b.top - s.top, 0),
    right: Math.min(b.right - s.right, 0),
    bottom: Math.min(b.bottom - s.bottom, 0)
  };
  return {
    x: p - v.left + v.right,
    y: g - v.top + v.bottom,
    zoom: d
  };
}, zn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function It(e) {
  return e != null && e !== "parent";
}
function Ye(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function Ec(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function Sc(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function ra(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function eb() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function tb(e) {
  return { ...mc, ...e || {} };
}
function Nc(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function Sn(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Be(e), a = Fn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Vn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const Zi = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Cc = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, nb = ["INPUT", "SELECT", "TEXTAREA"];
function Mc(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : nb.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const $c = (e) => "clientX" in e, Be = (e, t) => {
  var i, s;
  const n = $c(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, oa = (e, t, n, r, o) => {
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
      ...Zi(s)
    };
  });
};
function Ic({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, d, f];
}
function fr(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function ia({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case U.Left:
      return [t - fr(t - r, i), n];
    case U.Right:
      return [t + fr(r - t, i), n];
    case U.Top:
      return [t, n - fr(n - o, i)];
    case U.Bottom:
      return [t, n + fr(o - n, i)];
  }
}
function Ac({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, curvature: s = 0.25 }) {
  const [a, l] = ia({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = ia({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, h, p, g] = Ic({
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
function Tc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function rb({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function ob({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = Jr(Rr(e), Rr(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return Hr(s, eo(i)) > 0;
}
const ib = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, sb = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), ab = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Ve.error006()), t;
  const r = n.getEdgeId || ib;
  let o;
  return wc(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, sb(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function Lc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = Tc({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const sa = {
  [U.Left]: { x: -1, y: 0 },
  [U.Right]: { x: 1, y: 0 },
  [U.Top]: { x: 0, y: -1 },
  [U.Bottom]: { x: 0, y: 1 }
}, lb = ({ source: e, sourcePosition: t = U.Bottom, target: n }) => t === U.Left || t === U.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, aa = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function cb({ source: e, sourcePosition: t = U.Bottom, target: n, targetPosition: r = U.Top, center: o, offset: i, stepPosition: s }) {
  const a = sa[t], l = sa[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, f = lb({
    source: c,
    sourcePosition: t,
    target: d
  }), h = f.x !== 0 ? "x" : "y", p = f[h];
  let g = [], b, v;
  const m = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , y, w] = Tc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[h] * l[h] === -1) {
    h === "x" ? (b = o.x ?? c.x + (d.x - c.x) * s, v = o.y ?? (c.y + d.y) / 2) : (b = o.x ?? (c.x + d.x) / 2, v = o.y ?? c.y + (d.y - c.y) * s);
    const T = [
      { x: b, y: c.y },
      { x: b, y: d.y }
    ], A = [
      { x: c.x, y: v },
      { x: d.x, y: v }
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
    B >= H ? (b = (O.x + L.x) / 2, v = g[0].y) : (b = g[0].x, v = (O.y + L.y) / 2);
  }
  const N = { x: c.x + m.x, y: c.y + m.y }, E = { x: d.x + _.x, y: d.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...N.x !== g[0].x || N.y !== g[0].y ? [N] : [],
    ...g,
    ...E.x !== g[g.length - 1].x || E.y !== g[g.length - 1].y ? [E] : [],
    n
  ], b, v, y, w];
}
function db(e, t, n, r) {
  const o = Math.min(aa(e, t) / 2, aa(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * d}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function yi({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: d = 0.5 }) {
  const [f, h, p, g, b] = cb({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: d
  });
  let v = `M${f[0].x} ${f[0].y}`;
  for (let m = 1; m < f.length - 1; m++)
    v += db(f[m - 1], f[m], f[m + 1], s);
  return v += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [v, h, p, g, b];
}
function la(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function ub(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!la(t) || !la(n))
    return null;
  const r = t.internals.handleBounds || ca(t.handles), o = n.internals.handleBounds || ca(n.handles), i = da((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = da(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Ut.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Ve.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || U.Bottom, l = (s == null ? void 0 : s.position) || U.Top, c = At(t, i, a), d = At(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: d.x,
    targetY: d.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function ca(e) {
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
function At(e, t, n = U.Left, r = !1) {
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
function da(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function wi(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function fb(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = wi(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const zc = 1e3, hb = 10, Qi = {
  nodeOrigin: [0, 0],
  nodeExtent: An,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, pb = {
  ...Qi,
  checkEquality: !0
};
function Ji(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function gb(e, t, n) {
  const r = Ji(Qi, n);
  for (const o of e.values())
    if (o.parentId)
      ts(o, e, t, r);
    else {
      const i = Wn(o, r.nodeOrigin), s = It(o.extent) ? o.extent : r.nodeExtent, a = $t(i, s, Ye(o));
      o.internals.positionAbsolute = a;
    }
}
function mb(e, t) {
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
function es(e) {
  return e === "manual";
}
function bi(e, t, n, r = {}) {
  var d, f;
  const o = Ji(pb, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !es(o.zIndexMode) ? zc : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const h of e) {
    let p = s.get(h.id);
    if (o.checkEquality && h === (p == null ? void 0 : p.internals.userNode))
      t.set(h.id, p);
    else {
      const g = Wn(h, o.nodeOrigin), b = It(h.extent) ? h.extent : o.nodeExtent, v = $t(g, b, Ye(h));
      p = {
        ...o.defaults,
        ...h,
        measured: {
          width: (d = h.measured) == null ? void 0 : d.width,
          height: (f = h.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: v,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: mb(h, p),
          z: Oc(h, a, o.zIndexMode),
          userNode: h
        }
      }, t.set(h.id, p);
    }
    (p.measured === void 0 || p.measured.width === void 0 || p.measured.height === void 0) && !p.hidden && (l = !1), h.parentId && ts(p, t, n, r, i), c || (c = h.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function yb(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function ts(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Ji(Qi, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  yb(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * hb), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const f = i && !es(l) ? zc : 0, { x: h, y: p, z: g } = wb(e, d, s, a, f, l), { positionAbsolute: b } = e.internals, v = h !== b.x || p !== b.y;
  (v || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: v ? { x: h, y: p } : b,
      z: g
    }
  });
}
function Oc(e, t, n) {
  const r = We(e.zIndex) ? e.zIndex : 0;
  return es(n) ? r : r + (e.selected ? t : 0);
}
function wb(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ye(e), c = Wn(e, n), d = It(e.extent) ? $t(c, e.extent, l) : c;
  let f = $t({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (f = vc(f, l, t));
  const h = Oc(e, o, i), p = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: p >= h ? p + 1 : h
  };
}
function ns(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? Ln(l), d = xc(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var y;
    const d = l.internals.positionAbsolute, f = Ye(l), h = l.origin ?? r, p = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, b = Math.max(f.width, Math.round(a.width)), v = Math.max(f.height, Math.round(a.height)), m = (b - f.width) * h[0], _ = (v - f.height) * h[1];
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
        width: b + (p ? h[0] * p - m : 0),
        height: v + (g ? h[1] * g - _ : 0)
      }
    });
  }), o;
}
function bb(e, t, n, r, o, i, s) {
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
    const b = Zi(p.nodeElement), v = g.measured.width !== b.width || g.measured.height !== b.height;
    if (!!(b.width && b.height && (v || !g.internals.handleBounds || p.force))) {
      const _ = p.nodeElement.getBoundingClientRect(), y = It(g.extent) ? g.extent : i;
      let { positionAbsolute: w } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const E = t.get(g.parentId);
        E && (w = vc(w, b, E));
      } else y && (w = $t(w, y, b));
      const N = {
        ...g,
        measured: b,
        internals: {
          ...g.internals,
          positionAbsolute: w,
          handleBounds: {
            source: oa("source", p.nodeElement, _, f, g.id),
            target: oa("target", p.nodeElement, _, f, g.id)
          }
        }
      };
      t.set(g.id, N), g.parentId && ts(N, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, v && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: b
      }), g.expandParent && g.parentId && h.push({
        id: g.id,
        parentId: g.parentId,
        rect: Ln(N, o)
      }));
    }
  }
  if (h.length > 0) {
    const p = ns(h, t, n, o);
    c.push(...p);
  }
  return { changes: c, updatedInternals: l };
}
async function vb({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function ua(e, t, n, r, o, i) {
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
function Pc(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    ua("source", l, d, e, o, s), ua("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function Dc(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Dc(n, t) : !1;
}
function fa(e, t, n) {
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
function xb(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !Dc(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function qo({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
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
function _b({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Vn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function kb({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, f = !1, h = null, p = !1, g = !1, b = null;
  function v({ noDragClassName: _, handleSelector: y, domNode: w, isSelectable: N, nodeId: E, nodeClickDistance: C = 0 }) {
    h = Me(w);
    function T({ x: B, y: H }) {
      const { nodeLookup: x, nodeExtent: $, snapGrid: M, snapToGrid: S, nodeOrigin: z, onNodeDrag: I, onSelectionDrag: D, onError: P, updateNodePositions: V } = t();
      i = { x: B, y: H };
      let X = !1;
      const F = a.size > 1, Q = F && $ ? mi(Bn(a)) : null, G = F && S ? _b({
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
        } : Vn(j, M));
        let q = null;
        if (F && $ && !W.extent && Q) {
          const { positionAbsolute: te } = W.internals, ne = te.x - Q.x + $[0][0], re = te.x + W.measured.width - Q.x2 + $[1][0], se = te.y - Q.y + $[0][1], de = te.y + W.measured.height - Q.y2 + $[1][1];
          q = [
            [ne, se],
            [re, de]
          ];
        }
        const { position: K, positionAbsolute: Z } = bc({
          nodeId: ee,
          nextPosition: j,
          nodeLookup: x,
          nodeExtent: q || $,
          nodeOrigin: z,
          onError: P
        });
        X = X || W.position.x !== K.x || W.position.y !== K.y, W.position = K, W.internals.positionAbsolute = Z;
      }
      if (g = g || X, !!X && (V(a, !0), b && (r || I || !E && D))) {
        const [ee, W] = qo({
          nodeId: E,
          dragItems: a,
          nodeLookup: x
        });
        r == null || r(b, a, ee, W), I == null || I(b, ee, W), E || D == null || D(b, W);
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
      const [M, S] = Ki(c, d, x);
      (M !== 0 || S !== 0) && (i.x = (i.x ?? 0) - M / B[2], i.y = (i.y ?? 0) - S / B[2], await H({ x: M, y: S }) && T(i)), s = requestAnimationFrame(A);
    }
    function O(B) {
      var F;
      const { nodeLookup: H, multiSelectionActive: x, nodesDraggable: $, transform: M, snapGrid: S, snapToGrid: z, selectNodesOnDrag: I, onNodeDragStart: D, onSelectionDragStart: P, unselectNodesAndEdges: V } = t();
      f = !0, (!I || !N) && !x && E && ((F = H.get(E)) != null && F.selected || V()), N && I && E && (e == null || e(E));
      const X = Sn(B.sourceEvent, { transform: M, snapGrid: S, snapToGrid: z, containerBounds: d });
      if (i = X, a = xb(H, $, X, E), a.size > 0 && (n || D || !E && P)) {
        const [Q, G] = qo({
          nodeId: E,
          dragItems: a,
          nodeLookup: H
        });
        n == null || n(B.sourceEvent, a, Q, G), D == null || D(B.sourceEvent, Q, G), E || P == null || P(B.sourceEvent, G);
      }
    }
    const L = Jl().clickDistance(C).on("start", (B) => {
      const { domNode: H, nodeDragThreshold: x, transform: $, snapGrid: M, snapToGrid: S } = t();
      d = (H == null ? void 0 : H.getBoundingClientRect()) || null, p = !1, g = !1, b = B.sourceEvent, x === 0 && O(B), i = Sn(B.sourceEvent, { transform: $, snapGrid: M, snapToGrid: S, containerBounds: d }), c = Be(B.sourceEvent, d);
    }).on("drag", (B) => {
      const { autoPanOnNodeDrag: H, transform: x, snapGrid: $, snapToGrid: M, nodeDragThreshold: S, nodeLookup: z } = t(), I = Sn(B.sourceEvent, { transform: x, snapGrid: $, snapToGrid: M, containerBounds: d });
      if (b = B.sourceEvent, (B.sourceEvent.type === "touchmove" && B.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
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
          const [S, z] = qo({
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
      return !B.button && (!_ || !fa(H, `.${_}`, w)) && (!y || fa(H, y, w));
    });
    h.call(L);
  }
  function m() {
    h == null || h.on(".drag", null);
  }
  return {
    update: v,
    destroy: m
  };
}
function Eb(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Hr(o, Ln(i)) > 0 && r.push(i);
  return r;
}
const Sb = 250;
function Nb(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = Eb(e, n, t + Sb);
  for (const c of s) {
    const d = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of d) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: h, y: p } = At(c, f, f.position, !0), g = Math.sqrt(Math.pow(h - e.x, 2) + Math.pow(p - e.y, 2));
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
function Rc(e, t, n, r, o, i = !1) {
  var c, d, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((h) => h.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...At(s, l, l.position, !0) } : l;
}
function Hc(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function Cb(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Wc = () => !0;
function Mb(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: f, panBy: h, cancelConnection: p, onConnectStart: g, onConnect: b, onConnectEnd: v, isValidConnection: m = Wc, onReconnectEnd: _, updateConnection: y, getTransform: w, getFromHandle: N, autoPanSpeed: E, dragThreshold: C = 1, handleDomNode: T }) {
  const A = Cc(e.target);
  let O = 0, L;
  const { x: B, y: H } = Be(e), x = Hc(i, T), $ = a == null ? void 0 : a.getBoundingClientRect();
  let M = !1;
  if (!$ || !x)
    return;
  const S = Rc(o, x, r, l, t);
  if (!S)
    return;
  let z = Be(e, $), I = !1, D = null, P = !1, V = null;
  function X() {
    if (!d || !$)
      return;
    const [K, Z] = Ki(z, $, E);
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
    from: At(Q, F, U.Left, !0),
    fromHandle: F,
    fromPosition: F.position,
    fromNode: Q,
    to: z,
    toHandle: null,
    toPosition: ea[F.position],
    toNode: null,
    pointer: z
  };
  function W() {
    M = !0, y(ee), g == null || g(e, { nodeId: o, handleId: r, handleType: x });
  }
  C === 0 && W();
  function j(K) {
    if (!M) {
      const { x: de, y: _e } = Be(K), Te = de - B, Ee = _e - H;
      if (!(Te * Te + Ee * Ee > C * C))
        return;
      W();
    }
    if (!N() || !F) {
      q(K);
      return;
    }
    const Z = w();
    z = Be(K, $), L = Nb(Fn(z, Z, !1, [1, 1]), n, l, F), I || (X(), I = !0);
    const te = Bc(K, {
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
    V = te.handleDomNode, D = te.connection, P = Cb(!!L, te.isValid);
    const ne = l.get(o), re = ne ? At(ne, F, U.Left, !0) : ee.from, se = {
      ...ee,
      from: re,
      isValid: P,
      to: te.toHandle && P ? Zt({ x: te.toHandle.x, y: te.toHandle.y }, Z) : z,
      toHandle: te.toHandle,
      toPosition: P && te.toHandle ? te.toHandle.position : ea[F.position],
      toNode: te.toHandle ? l.get(te.toHandle.nodeId) : null,
      pointer: z
    };
    y(se), ee = se;
  }
  function q(K) {
    if (!("touches" in K && K.touches.length > 0)) {
      if (M) {
        (L || V) && D && P && (b == null || b(D));
        const { inProgress: Z, ...te } = ee, ne = {
          ...te,
          toPosition: ee.toHandle ? ee.toPosition : null
        };
        v == null || v(K, ne), i && (_ == null || _(K, ne));
      }
      p(), cancelAnimationFrame(O), I = !1, P = !1, D = null, V = null, A.removeEventListener("mousemove", j), A.removeEventListener("mouseup", q), A.removeEventListener("touchmove", j), A.removeEventListener("touchend", q);
    }
  }
  A.addEventListener("mousemove", j), A.addEventListener("mouseup", q), A.addEventListener("touchmove", j), A.addEventListener("touchend", q);
}
function Bc(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Wc, nodeLookup: d }) {
  const f = i === "target", h = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: p, y: g } = Be(e), b = s.elementFromPoint(p, g), v = b != null && b.classList.contains(`${a}-flow__handle`) ? b : h, m = {
    handleDomNode: v,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (v) {
    const _ = Hc(void 0, v), y = v.getAttribute("data-nodeid"), w = v.getAttribute("data-handleid"), N = v.classList.contains("connectable"), E = v.classList.contains("connectableend");
    if (!y || !_)
      return m;
    const C = {
      source: f ? y : r,
      sourceHandle: f ? w : o,
      target: f ? r : y,
      targetHandle: f ? o : w
    };
    m.connection = C;
    const A = N && E && (n === Ut.Strict ? f && _ === "source" || !f && _ === "target" : y !== r || w !== o);
    m.isValid = A && c(C), m.toHandle = Rc(y, _, w, d, n, !0);
  }
  return m;
}
const vi = {
  onPointerDown: Mb,
  isValid: Bc
};
function $b({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Me(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: f = !0, zoomable: h = !0, inversePan: p = !1 }) {
    const g = (y) => {
      if (y.sourceEvent.type !== "wheel" || !t)
        return;
      const w = n(), N = y.sourceEvent.ctrlKey && zn() ? 10 : 1, E = -y.sourceEvent.deltaY * (y.sourceEvent.deltaMode === 1 ? 0.05 : y.sourceEvent.deltaMode ? 1 : 2e-3) * d, C = w[2] * Math.pow(2, E * N);
      t.scaleTo(C);
    };
    let b = [0, 0];
    const v = (y) => {
      (y.sourceEvent.type === "mousedown" || y.sourceEvent.type === "touchstart") && (b = [
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
      ], E = [N[0] - b[0], N[1] - b[1]];
      b = N;
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
    }, _ = pc().on("start", v).on("zoom", f ? m : null).on("zoom.wheel", h ? g : null);
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
const no = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Ko = ({ x: e, y: t, zoom: n }) => Qr.translate(e, t).scale(n), ft = (e, t) => e.target.closest(`.${t}`), Vc = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Ib = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Zo = (e, t = 0, n = Ib, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Fc = (e) => {
  const t = e.ctrlKey && zn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Ab({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (ft(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const v = Re(d), m = Fc(d), _ = f * Math.pow(2, m);
      r.scaleTo(n, _, v, d);
      return;
    }
    const h = d.deltaMode === 1 ? 20 : 1;
    let p = o === Nt.Vertical ? 0 : d.deltaX * h, g = o === Nt.Horizontal ? 0 : d.deltaY * h;
    !zn() && d.shiftKey && o !== Nt.Vertical && (p = d.deltaY * h, g = 0), r.translateBy(
      n,
      -(p / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const b = no(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, b) : (e.isPanScrolling = !0, a == null || a(d, b)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, b), e.isPanScrolling = !1;
    }, 150);
  };
}
function Tb({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = ft(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function Lb({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = no(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function zb({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Vc(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, no(i.transform)));
  };
}
function Ob({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Vc(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = no(s.transform);
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
function Pb({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: f }) {
  return (h) => {
    var m;
    const p = t || n, g = r && h.ctrlKey, b = h.type === "wheel";
    if (h.button === 1 && h.type === "mousedown" && (ft(h, `${d}-flow__node`) || ft(h, `${d}-flow__edge`) || ft(h, `${d}-flow__selection`) || ft(h, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !p && !i && !s && !r || a || f && !b || ft(h, l) && b || ft(h, c) && (!b || i && b && !t) || !r && h.ctrlKey && b)
      return !1;
    if (!r && h.type === "touchstart" && ((m = h.touches) == null ? void 0 : m.length) > 1)
      return h.preventDefault(), !1;
    if (!p && !i && !g && b || !o && (h.type === "mousedown" || h.type === "touchstart") || Array.isArray(o) && !o.includes(h.button) && h.type === "mousedown")
      return !1;
    const v = Array.isArray(o) && o.includes(h.button) || !h.button || h.button <= 1;
    return (!h.ctrlKey || b || e) && v;
  };
}
function Db({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
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
  const p = pc().extent(() => f).scaleExtent([t, n]).translateExtent(r), g = Me(e).call(p);
  w({
    x: o.x,
    y: o.y,
    zoom: Kt(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const b = g.on("wheel.zoom"), v = g.on("dblclick.zoom");
  p.wheelDelta(Fc);
  async function m(H, x) {
    return g ? new Promise(($) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? En : xr).transform(Zo(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => $(!0)), H);
    }) : !1;
  }
  function _({ noWheelClassName: H, noPanClassName: x, onPaneContextMenu: $, userSelectionActive: M, panOnScroll: S, panOnDrag: z, panOnScrollMode: I, panOnScrollSpeed: D, preventScrolling: P, zoomOnPinch: V, zoomOnScroll: X, zoomOnDoubleClick: F, panActivationKeyPressed: Q = !1, zoomActivationKeyPressed: G, lib: ee, onTransformChange: W, connectionInProgress: j, paneClickDistance: q, selectionOnDrag: K }) {
    M && !c.isZoomingOrPanning && y();
    const Z = S && !G && !M;
    p.clickDistance(K ? 1 / 0 : !We(q) || q < 0 ? 0 : q);
    const te = Z ? Ab({
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
    }) : Tb({
      noWheelClassName: H,
      preventScrolling: P,
      d3ZoomHandler: b
    });
    g.on("wheel.zoom", te, { passive: !1 });
    const ne = Lb({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    p.on("start", ne);
    const re = zb({
      zoomPanValues: c,
      panOnDrag: z,
      onPaneContextMenu: !!$,
      onPanZoom: i,
      onTransformChange: W
    });
    p.on("zoom", re);
    const se = Ob({
      zoomPanValues: c,
      panOnDrag: z,
      panOnScroll: S,
      onPaneContextMenu: $,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    p.on("end", se);
    const de = Pb({
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
    p.filter(de), F ? g.on("dblclick.zoom", v) : g.on("dblclick.zoom", null);
  }
  function y() {
    p.on("zoom", null);
  }
  async function w(H, x, $) {
    const M = Ko(H), S = p == null ? void 0 : p.constrain()(M, x, $);
    return S && await m(S), S;
  }
  async function N(H, x) {
    const $ = Ko(H);
    return await m($, x), $;
  }
  function E(H) {
    if (g) {
      const x = Ko(H), $ = g.property("__zoom");
      ($.k !== H.zoom || $.x !== H.x || $.y !== H.y) && (p == null || p.transform(g, x, null, { sync: !0 }));
    }
  }
  function C() {
    const H = g ? hc(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: H.x, y: H.y, zoom: H.k };
  }
  async function T(H, x) {
    return g ? new Promise(($) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? En : xr).scaleTo(Zo(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => $(!0)), H);
    }) : !1;
  }
  async function A(H, x) {
    return g ? new Promise(($) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? En : xr).scaleBy(Zo(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => $(!0)), H);
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
var Qt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Qt || (Qt = {}));
function Rb({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function ha(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function ct(e, t) {
  return Math.max(0, t - e);
}
function dt(e, t) {
  return Math.max(0, e - t);
}
function hr(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function pa(e, t) {
  return e ? !t : t;
}
function Hb(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: f } = t, h = d && f, { xSnapped: p, ySnapped: g } = n, { minWidth: b, maxWidth: v, minHeight: m, maxHeight: _ } = r, { x: y, y: w, width: N, height: E, aspectRatio: C } = e;
  let T = Math.floor(d ? p - e.pointerX : 0), A = Math.floor(f ? g - e.pointerY : 0);
  const O = N + (l ? -T : T), L = E + (c ? -A : A), B = -i[0] * N, H = -i[1] * E;
  let x = hr(O, b, v), $ = hr(L, m, _);
  if (s) {
    let z = 0, I = 0;
    l && T < 0 ? z = ct(y + T + B, s[0][0]) : !l && T > 0 && (z = dt(y + O + B, s[1][0])), c && A < 0 ? I = ct(w + A + H, s[0][1]) : !c && A > 0 && (I = dt(w + L + H, s[1][1])), x = Math.max(x, z), $ = Math.max($, I);
  }
  if (a) {
    let z = 0, I = 0;
    l && T > 0 ? z = dt(y + T, a[0][0]) : !l && T < 0 && (z = ct(y + O, a[1][0])), c && A > 0 ? I = dt(w + A, a[0][1]) : !c && A < 0 && (I = ct(w + L, a[1][1])), x = Math.max(x, z), $ = Math.max($, I);
  }
  if (o) {
    if (d) {
      const z = hr(O / C, m, _) * C;
      if (x = Math.max(x, z), s) {
        let I = 0;
        !l && !c || l && !c && h ? I = dt(w + H + O / C, s[1][1]) * C : I = ct(w + H + (l ? T : -T) / C, s[0][1]) * C, x = Math.max(x, I);
      }
      if (a) {
        let I = 0;
        !l && !c || l && !c && h ? I = ct(w + O / C, a[1][1]) * C : I = dt(w + (l ? T : -T) / C, a[0][1]) * C, x = Math.max(x, I);
      }
    }
    if (f) {
      const z = hr(L * C, b, v) / C;
      if ($ = Math.max($, z), s) {
        let I = 0;
        !l && !c || c && !l && h ? I = dt(y + L * C + B, s[1][0]) / C : I = ct(y + (c ? A : -A) * C + B, s[0][0]) / C, $ = Math.max($, I);
      }
      if (a) {
        let I = 0;
        !l && !c || c && !l && h ? I = ct(y + L * C, a[1][0]) / C : I = dt(y + (c ? A : -A) * C, a[0][0]) / C, $ = Math.max($, I);
      }
    }
  }
  A = A + (A < 0 ? $ : -$), T = T + (T < 0 ? x : -x), o && (h ? O > L * C ? A = (pa(l, c) ? -T : T) / C : T = (pa(l, c) ? -A : A) * C : d ? (A = T / C, c = l) : (T = A * C, l = c));
  const M = l ? y + T : y, S = c ? w + A : w;
  return {
    width: N + (l ? -T : T),
    height: E + (c ? -A : A),
    x: i[0] * T * (l ? -1 : 1) + M,
    y: i[1] * A * (c ? -1 : 1) + S
  };
}
const jc = { width: 0, height: 0, x: 0, y: 0 }, Wb = {
  ...jc,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function Bb(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function Vb({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Me(e);
  let s = {
    controlDirection: ha("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: f, resizeDirection: h, onResizeStart: p, onResize: g, onResizeEnd: b, shouldResize: v }) {
    let m = { ...jc }, _ = { ...Wb };
    s = {
      boundaries: d,
      resizeDirection: h,
      keepAspectRatio: f,
      controlDirection: ha(c)
    };
    let y, w = null, N = [], E, C, T;
    const A = Jl().on("start", (O) => {
      const { nodeLookup: L, transform: B, snapGrid: H, snapToGrid: x, nodeOrigin: $, paneDomNode: M } = n();
      if (y = L.get(t), !y)
        return;
      w = (M == null ? void 0 : M.getBoundingClientRect()) ?? null;
      const { xSnapped: S, ySnapped: z } = Sn(O.sourceEvent, {
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
      }, E = void 0, C = It(y.extent) ? y.extent : void 0, y.parentId && (y.extent === "parent" || y.expandParent) && (E = L.get(y.parentId)), E && y.extent === "parent" && (C = [
        [0, 0],
        [E.measured.width, E.measured.height]
      ]), N = [], T = void 0;
      for (const [I, D] of L)
        if (D.parentId === t && (N.push({
          id: I,
          position: { ...D.position },
          extent: D.extent
        }), D.extent === "parent" || D.expandParent)) {
          const P = Bb(D, y, D.origin ?? $);
          T ? T = [
            [Math.min(P[0][0], T[0][0]), Math.min(P[0][1], T[0][1])],
            [Math.max(P[1][0], T[1][0]), Math.max(P[1][1], T[1][1])]
          ] : T = P;
        }
      p == null || p(O, { ...m });
    }).on("drag", (O) => {
      const { transform: L, snapGrid: B, snapToGrid: H, nodeOrigin: x } = n(), $ = Sn(O.sourceEvent, {
        transform: L,
        snapGrid: B,
        snapToGrid: H,
        containerBounds: w
      }), M = [];
      if (!y)
        return;
      const { x: S, y: z, width: I, height: D } = m, P = {}, V = y.origin ?? x, { width: X, height: F, x: Q, y: G } = Hb(_, s.controlDirection, $, s.boundaries, s.keepAspectRatio, V, C, T), ee = X !== I, W = F !== D, j = Q !== S && ee, q = G !== z && W;
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
        for (const de of N)
          de.position = {
            x: de.position.x - re + V[0] * (X - I),
            y: de.position.y - se + V[1] * (F - D)
          }, M.push(de);
      }
      if ((ee || W) && (P.width = ee && (!s.resizeDirection || s.resizeDirection === "horizontal") ? X : m.width, P.height = W && (!s.resizeDirection || s.resizeDirection === "vertical") ? F : m.height, m.width = P.width, m.height = P.height), E && y.expandParent) {
        const re = V[0] * (P.width ?? 0);
        P.x && P.x < re && (m.x = re, _.x = _.x - (P.x - re));
        const se = V[1] * (P.height ?? 0);
        P.y && P.y < se && (m.y = se, _.y = _.y - (P.y - se));
      }
      const Z = Rb({
        width: m.width,
        prevWidth: I,
        height: m.height,
        prevHeight: D,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), te = { ...m, direction: Z };
      if ((v == null ? void 0 : v(O, te)) === !1) {
        m = K.prevValues, _.x = K.startX, _.y = K.startY, N.forEach((re, se) => {
          re.position = K.childNodes[se].position;
        });
        return;
      }
      g == null || g(O, te), r(P, M);
    }).on("end", (O) => {
      b == null || b(O, { ...m }), o == null || o({ ...m });
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
var Yc = { exports: {} }, Gc = {}, Xc = { exports: {} }, Uc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Jt = Ai;
function Fb(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var jb = typeof Object.is == "function" ? Object.is : Fb, Yb = Jt.useState, Gb = Jt.useEffect, Xb = Jt.useLayoutEffect, Ub = Jt.useDebugValue;
function qb(e, t) {
  var n = t(), r = Yb({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Xb(
    function() {
      o.value = n, o.getSnapshot = t, Qo(o) && i({ inst: o });
    },
    [e, n, t]
  ), Gb(
    function() {
      return Qo(o) && i({ inst: o }), e(function() {
        Qo(o) && i({ inst: o });
      });
    },
    [e]
  ), Ub(n), n;
}
function Qo(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !jb(e, n);
  } catch {
    return !0;
  }
}
function Kb(e, t) {
  return t();
}
var Zb = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Kb : qb;
Uc.useSyncExternalStore = Jt.useSyncExternalStore !== void 0 ? Jt.useSyncExternalStore : Zb;
Xc.exports = Uc;
var Qb = Xc.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ro = Ai, Jb = Qb;
function ev(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var tv = typeof Object.is == "function" ? Object.is : ev, nv = Jb.useSyncExternalStore, rv = ro.useRef, ov = ro.useEffect, iv = ro.useMemo, sv = ro.useDebugValue;
Gc.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = rv(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = iv(
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
        if (g = f, tv(d, p)) return g;
        var b = r(p);
        return o !== void 0 && o(g, b) ? (d = p, g) : (d = p, f = b);
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
  var a = nv(e, i[0], i[1]);
  return ov(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), sv(a), a;
};
Yc.exports = Gc;
var av = Yc.exports;
const lv = /* @__PURE__ */ fl(av), cv = {}, ga = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, f) => {
    const h = typeof d == "function" ? d(t) : d;
    if (!Object.is(h, t)) {
      const p = t;
      t = f ?? (typeof h != "object" || h === null) ? h : Object.assign({}, t, h), n.forEach((g) => g(t, p));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (cv ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, dv = (e) => e ? ga(e) : ga, { useDebugValue: uv } = Ai, { useSyncExternalStoreWithSelector: fv } = lv, hv = (e) => e;
function qc(e, t = hv, n) {
  const r = fv(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return uv(r), r;
}
const ma = (e, t) => {
  const n = dv(e), r = (o, i = t) => qc(n, o, i);
  return Object.assign(r, n), r;
}, pv = (e, t) => e ? ma(e, t) : ma;
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
const oo = jr(null), gv = oo.Provider, Kc = Ve.error001("react");
function ae(e, t) {
  const n = en(oo);
  if (n === null)
    throw new Error(Kc);
  return qc(n, e, t);
}
function fe() {
  const e = en(oo);
  if (e === null)
    throw new Error(Kc);
  return le(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const ya = { display: "none" }, mv = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Zc = "react-flow__node-desc", Qc = "react-flow__edge-desc", yv = "react-flow__aria-live", wv = (e) => e.ariaLiveMessage, bv = (e) => e.ariaLabelConfig;
function vv({ rfId: e }) {
  const t = ae(wv);
  return u("div", { id: `${yv}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: mv, children: t });
}
function xv({ rfId: e, disableKeyboardA11y: t }) {
  const n = ae(bv);
  return k(me, { children: [u("div", { id: `${Zc}-${e}`, style: ya, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), u("div", { id: `${Qc}-${e}`, style: ya, children: n["edge.a11yDescription.default"] }), !t && u(vv, { rfId: e })] });
}
const Tt = Ja(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return u("div", { className: be(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
Tt.displayName = "Panel";
const wa = "https://reactflow.dev?utm_source=attribution";
function _v({ proOptions: e, position: t = "bottom-right" }) {
  return ce(() => {
  }, []), e != null && e.hideAttribution ? null : u(Tt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${wa}`, children: u("a", { href: wa, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const kv = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, pr = (e) => e.id;
function Ev(e, t) {
  return ge(e.selectedNodes.map(pr), t.selectedNodes.map(pr)) && ge(e.selectedEdges.map(pr), t.selectedEdges.map(pr));
}
function Sv({ onSelectionChange: e }) {
  const t = fe(), { selectedNodes: n, selectedEdges: r } = ae(kv, Ev);
  return ce(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const Nv = (e) => !!e.onSelectionChangeHandlers;
function Cv({ onSelectionChange: e }) {
  const t = ae(Nv);
  return e || t ? u(Sv, { onSelectionChange: e }) : null;
}
const Jc = [0, 0], Mv = { x: 0, y: 0, zoom: 1 }, $v = [
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
], ba = [...$v, "rfId"], Iv = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), va = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: An,
  nodeOrigin: Jc,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Av(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = ae(Iv, ge), c = fe();
  ce(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = va, a();
  }), []);
  const d = oe(va);
  return ce(
    () => {
      for (const f of ba) {
        const h = e[f], p = d.current[f];
        h !== p && (typeof e[f] > "u" || (f === "nodes" ? t(h) : f === "edges" ? n(h) : f === "minZoom" ? r(h) : f === "maxZoom" ? o(h) : f === "translateExtent" ? i(h) : f === "nodeExtent" ? s(h) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: tb(h) }) : f === "fitView" ? c.setState({ fitViewQueued: h }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: h }) : c.setState({ [f]: h })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    ba.map((f) => e[f])
  ), null;
}
function xa() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Tv(e) {
  var r;
  const [t, n] = J(e === "system" ? null : e);
  return ce(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = xa(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = xa()) != null && r.matches ? "dark" : "light";
}
const _a = typeof document < "u" ? document : null;
function On(e = null, t = { target: _a, actInsideInputWithModifier: !0 }) {
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
    const l = (t == null ? void 0 : t.target) ?? _a, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (p) => {
        var v, m;
        if (o.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!o.current || o.current && !c) && Mc(p))
          return !1;
        const b = Ea(p.code, a);
        if (i.current.add(p[b]), ka(s, i.current, !1)) {
          const _ = ((m = (v = p.composedPath) == null ? void 0 : v.call(p)) == null ? void 0 : m[0]) || p.target, y = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !y) && p.preventDefault(), r(!0);
        }
      }, f = (p) => {
        const g = Ea(p.code, a);
        ka(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(p[g]), p.key === "Meta" && i.current.clear(), o.current = !1;
      }, h = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", h), window.addEventListener("contextmenu", h), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", h), window.removeEventListener("contextmenu", h);
      };
    }
  }, [e, r]), n;
}
function ka(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function Ea(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Lv = () => {
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = to(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      return Fn(c, r, f, d);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = Zt(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function ed(e, t) {
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
      zv(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function zv(e, t) {
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
function Ov(e, t) {
  return ed(e, t);
}
function Pv(e, t) {
  return ed(e, t);
}
function kt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ft(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(kt(i.id, s)));
  }
  return r;
}
function Sa({ items: e = [], lookup: t }) {
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
function Na(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Dv = kc();
function Rv(e, t, n = {}) {
  return ab(e, t, {
    ...n,
    onError: n.onError ?? Dv
  });
}
const Ca = (e) => Gw(e), Hv = (e) => wc(e);
function td(e) {
  return Ja(e);
}
const nd = typeof window < "u" ? Ti : ce;
function Ma(e) {
  const [t, n] = J(BigInt(0)), [r] = J(() => Wv(() => n((o) => o + BigInt(1))));
  return nd(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function Wv(e) {
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
const rd = jr(null);
function Bv({ children: e }) {
  const t = fe(), n = Ie((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: f, nodeLookup: h, fitViewQueued: p, onNodesChangeMiddlewareMap: g } = t.getState();
    let b = l;
    for (const m of a)
      b = typeof m == "function" ? m(b) : m;
    let v = Sa({
      items: b,
      lookup: h
    });
    for (const m of g.values())
      v = m(v);
    d && c(b), v.length > 0 ? f == null || f(v) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: _, setNodes: y } = t.getState();
      m && y(_);
    });
  }, []), r = Ma(n), o = Ie((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: f, edgeLookup: h } = t.getState();
    let p = l;
    for (const g of a)
      p = typeof g == "function" ? g(p) : g;
    d ? c(p) : f && f(Sa({
      items: p,
      lookup: h
    }));
  }, []), i = Ma(o), s = le(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return u(rd.Provider, { value: s, children: e });
}
function Vv() {
  const e = en(rd);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Fv = (e) => !!e.panZoom;
function io() {
  const e = Lv(), t = fe(), n = Vv(), r = ae(Fv), o = le(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var m, _;
      const { nodeLookup: h, nodeOrigin: p } = t.getState(), g = Ca(f) ? f : h.get(f.id), b = g.parentId ? Sc(g.position, g.measured, g.parentId, h, p) : g.position, v = {
        ...g,
        position: b,
        width: ((m = g.measured) == null ? void 0 : m.width) ?? g.width,
        height: ((_ = g.measured) == null ? void 0 : _.height) ?? g.height
      };
      return Ln(v);
    }, c = (f, h, p = { replace: !1 }) => {
      s((g) => g.map((b) => {
        if (b.id === f) {
          const v = typeof h == "function" ? h(b) : h;
          return p.replace && Ca(v) ? v : { ...b, ...v };
        }
        return b;
      }));
    }, d = (f, h, p = { replace: !1 }) => {
      a((g) => g.map((b) => {
        if (b.id === f) {
          const v = typeof h == "function" ? h(b) : h;
          return p.replace && Hv(v) ? v : { ...b, ...v };
        }
        return b;
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
        const { nodes: f = [], edges: h = [], transform: p } = t.getState(), [g, b, v] = p;
        return {
          nodes: f.map((m) => ({ ...m })),
          edges: h.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: b,
            zoom: v
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: h = [] }) => {
        const { nodes: p, edges: g, onNodesDelete: b, onEdgesDelete: v, triggerNodeChanges: m, triggerEdgeChanges: _, onDelete: y, onBeforeDelete: w } = t.getState(), { nodes: N, edges: E } = await Zw({
          nodesToRemove: f,
          edgesToRemove: h,
          nodes: p,
          edges: g,
          onBeforeDelete: w
        }), C = E.length > 0, T = N.length > 0;
        if (C) {
          const A = E.map(Na);
          v == null || v(E), _(A);
        }
        if (T) {
          const A = N.map(Na);
          b == null || b(N), m(A);
        }
        return (T || C) && (y == null || y({ nodes: N, edges: E })), { deletedNodes: N, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, h = !0, p) => {
        const g = na(f), b = g ? f : l(f), v = p !== void 0;
        return b ? (p || t.getState().nodes).filter((m) => {
          const _ = t.getState().nodeLookup.get(m.id);
          if (_ && !g && (m.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const y = Ln(v ? m : _), w = Hr(y, b);
          return h && w > 0 || w >= y.width * y.height || w >= b.width * b.height;
        }) : [];
      },
      isNodeIntersecting: (f, h, p = !0) => {
        const b = na(f) ? f : l(f);
        if (!b)
          return !1;
        const v = Hr(b, h);
        return p && v > 0 || v >= h.width * h.height || v >= b.width * b.height;
      },
      updateNode: c,
      updateNodeData: (f, h, p = { replace: !1 }) => {
        c(f, (g) => {
          const b = typeof h == "function" ? h(g) : h;
          return p.replace ? { ...g, data: b } : { ...g, data: { ...g.data, ...b } };
        }, p);
      },
      updateEdge: d,
      updateEdgeData: (f, h, p = { replace: !1 }) => {
        d(f, (g) => {
          const b = typeof h == "function" ? h(g) : h;
          return p.replace ? { ...g, data: b } : { ...g, data: { ...g.data, ...b } };
        }, p);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: h, nodeOrigin: p } = t.getState();
        return Xw(f, { nodeLookup: h, nodeOrigin: p });
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
        const h = t.getState().fitViewResolver ?? eb();
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
const $a = (e) => e.selected, jv = typeof window < "u" ? window : void 0;
function Yv({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = fe(), { deleteElements: r } = io(), o = On(e, { actInsideInputWithModifier: !1 }), i = On(t, { target: jv });
  ce(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter($a), edges: s.filter($a) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), ce(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Gv(e) {
  const t = fe();
  ce(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = Zi(e.current);
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
const so = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Xv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Uv({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = Nt.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: f, maxZoom: h, zoomActivationKeyCode: p, preventScrolling: g = !0, children: b, noWheelClassName: v, noPanClassName: m, onViewportChange: _, isControlledViewport: y, paneClickDistance: w, selectionOnDrag: N }) {
  const E = fe(), C = oe(null), { userSelectionActive: T, lib: A, connectionInProgress: O } = ae(Xv, ge), L = On(p), B = oe();
  Gv(C);
  const H = Ie((x) => {
    _ == null || _({ x: x[0], y: x[1], zoom: x[2] }), y || E.setState({ transform: x });
  }, [_, y]);
  return ce(() => {
    if (C.current) {
      B.current = Db({
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
      noWheelClassName: v,
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
    v,
    A,
    H,
    O,
    N,
    w
  ]), u("div", { className: "react-flow__renderer", ref: C, style: so, children: b });
}
const qv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Kv() {
  const { userSelectionActive: e, userSelectionRect: t } = ae(qv, ge);
  return e && t ? u("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Jo = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Zv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Qv({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Tn.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: f, onPaneMouseEnter: h, onPaneMouseMove: p, onPaneMouseLeave: g, children: b }) {
  const v = oe(0), m = fe(), { userSelectionActive: _, elementsSelectable: y, dragging: w, panBy: N, autoPanSpeed: E } = ae(Zv, ge), C = y && (e || _), T = oe(null), A = oe(), O = oe(/* @__PURE__ */ new Set()), L = oe(/* @__PURE__ */ new Set()), B = oe(!1), H = oe(!1), x = oe({ x: 0, y: 0 }), $ = oe(!1), M = (W) => {
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
    var de, _e;
    if (W.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: j, transform: q } = m.getState();
    if (A.current = j == null ? void 0 : j.getBoundingClientRect(), !A.current)
      return;
    const K = W.target === T.current;
    if (!K && !!W.target.closest(".nokey") || !e || !(s && K || t) || W.button !== 0 || !W.isPrimary)
      return;
    (_e = (de = W.target) == null ? void 0 : de.setPointerCapture) == null || _e.call(de, W.pointerId), H.current = !1;
    const { x: ne, y: re } = Be(W.nativeEvent, A.current), se = Fn({ x: ne, y: re }, q);
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
    const { transform: K, nodeLookup: Z, edgeLookup: te, connectionLookup: ne, triggerNodeChanges: re, triggerEdgeChanges: se, defaultEdgeOptions: de } = m.getState(), _e = { x: q.startX, y: q.startY }, { x: Te, y: Ee } = Zt(_e, K), Oe = {
      startX: _e.x,
      startY: _e.y,
      x: W < Te ? W : Te,
      y: j < Ee ? j : Ee,
      width: Math.abs(W - Te),
      height: Math.abs(j - Ee)
    }, Ge = O.current, Je = L.current;
    O.current = new Set(qi(Z, Oe, K, n === Tn.Partial, !0).map((Ne) => Ne.id)), L.current = /* @__PURE__ */ new Set();
    const Xe = (de == null ? void 0 : de.selectable) ?? !0;
    for (const Ne of O.current) {
      const Le = ne.get(Ne);
      if (Le)
        for (const { edgeId: Pe } of Le.values()) {
          const Ue = te.get(Pe);
          Ue && (Ue.selectable ?? Xe) && L.current.add(Pe);
        }
    }
    if (!ra(Ge, O.current)) {
      const Ne = Ft(Z, O.current, !0);
      re(Ne);
    }
    if (!ra(Je, L.current)) {
      const Ne = Ft(te, L.current);
      se(Ne);
    }
    m.setState({
      userSelectionRect: Oe,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function V() {
    if (!o || !A.current)
      return;
    const [W, j] = Ki(x.current, A.current, E);
    N({ x: W, y: j }).then((q) => {
      if (!H.current || !q) {
        v.current = requestAnimationFrame(V);
        return;
      }
      const { x: K, y: Z } = x.current;
      P(K, Z), v.current = requestAnimationFrame(V);
    });
  }
  const X = () => {
    cancelAnimationFrame(v.current), v.current = 0, $.current = !1;
  };
  ce(() => () => X(), []);
  const F = (W) => {
    const { userSelectionRect: j, transform: q, resetSelectedElements: K } = m.getState();
    if (!A.current || !j)
      return;
    const { x: Z, y: te } = Be(W.nativeEvent, A.current);
    x.current = { x: Z, y: te };
    const ne = Zt({ x: j.startX, y: j.startY }, q);
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
  return k("div", { className: be(["react-flow__pane", { draggable: ee, dragging: w, selection: e }]), onClick: C ? void 0 : Jo(M, T), onContextMenu: Jo(S, T), onWheel: Jo(z, T), onPointerEnter: C ? void 0 : h, onPointerMove: C ? F : p, onPointerUp: Q, onPointerCancel: C ? G : void 0, onPointerDownCapture: C ? D : void 0, onClickCapture: C ? I : void 0, onPointerLeave: g, ref: T, style: so, children: [b, u(Kv, {})] });
}
function xi({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
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
function od({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = fe(), [l, c] = J(!1), d = oe();
  return ce(() => {
    if (!t)
      return d.current = kb({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          xi({
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
const Jv = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function id() {
  const e = fe();
  return Ie((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), f = /* @__PURE__ */ new Map(), h = Jv(s), p = o ? i[0] : 5, g = o ? i[1] : 5, b = n.direction.x * p * n.factor, v = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!h(m))
        continue;
      let _ = {
        x: m.internals.positionAbsolute.x + b,
        y: m.internals.positionAbsolute.y + v
      };
      o && (_ = Vn(_, i));
      const { position: y, positionAbsolute: w } = bc({
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
const rs = jr(null), ex = rs.Provider;
rs.Consumer;
const sd = () => en(rs), tx = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), ad = jr(null);
function nx({ children: e }) {
  const t = ae(tx, ge);
  return u(ad.Provider, { value: t, children: e });
}
function rx() {
  const e = en(ad);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const ox = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, ix = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return ox;
  const d = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: d,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === Ut.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: d && c
  };
};
function sx({ type: e = "source", position: t = U.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: f, ...h }, p) {
  var $, M;
  const g = s || null, b = e === "target", v = fe(), m = sd(), { connectOnClick: _, noPanClassName: y, rfId: w } = rx(), { connectingFrom: N, connectingTo: E, clickConnecting: C, isPossibleEndHandle: T, connectionInProcess: A, clickConnectionInProcess: O, valid: L } = ae(ix(m, g, e), ge);
  m || (M = ($ = v.getState()).onError) == null || M.call($, "010", Ve.error010());
  const B = (S) => {
    const { defaultEdgeOptions: z, onConnect: I, hasDefaultEdges: D } = v.getState(), P = {
      ...z,
      ...S
    };
    if (D) {
      const { edges: V, setEdges: X, onError: F } = v.getState();
      X(Rv(P, V, { onError: F }));
    }
    I == null || I(P), a == null || a(P);
  }, H = (S) => {
    if (!m)
      return;
    const z = $c(S.nativeEvent);
    if (o && (z && S.button === 0 || !z)) {
      const I = v.getState();
      vi.onPointerDown(S.nativeEvent, {
        handleDomNode: S.currentTarget,
        autoPanOnConnect: I.autoPanOnConnect,
        connectionMode: I.connectionMode,
        connectionRadius: I.connectionRadius,
        domNode: I.domNode,
        nodeLookup: I.nodeLookup,
        lib: I.lib,
        isTarget: b,
        handleId: g,
        nodeId: m,
        flowId: I.rfId,
        panBy: I.panBy,
        cancelConnection: I.cancelConnection,
        onConnectStart: I.onConnectStart,
        onConnectEnd: (...D) => {
          var P, V;
          return (V = (P = v.getState()).onConnectEnd) == null ? void 0 : V.call(P, ...D);
        },
        updateConnection: I.updateConnection,
        onConnect: B,
        isValidConnection: n || ((...D) => {
          var P, V;
          return ((V = (P = v.getState()).isValidConnection) == null ? void 0 : V.call(P, ...D)) ?? !0;
        }),
        getTransform: () => v.getState().transform,
        getFromHandle: () => v.getState().connection.fromHandle,
        autoPanSpeed: I.autoPanSpeed,
        dragThreshold: I.connectionDragThreshold
      });
    }
    z ? d == null || d(S) : f == null || f(S);
  }, x = (S) => {
    const { onClickConnectStart: z, onClickConnectEnd: I, connectionClickStartHandle: D, connectionMode: P, isValidConnection: V, lib: X, rfId: F, nodeLookup: Q, connection: G } = v.getState();
    if (!m || !D && !o)
      return;
    if (!D) {
      z == null || z(S.nativeEvent, { nodeId: m, handleId: g, handleType: e }), v.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const ee = Cc(S.target), W = n || V, { connection: j, isValid: q } = vi.isValid(S.nativeEvent, {
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
    delete K.inProgress, K.toPosition = K.toHandle ? K.toHandle.position : null, I == null || I(S, K), v.setState({ connectionClickStartHandle: null });
  };
  return u("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${w}-${m}-${g}-${e}`, className: be([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    y,
    c,
    {
      source: !b,
      target: b,
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
const mt = he(td(sx));
function ax({ data: e, isConnectable: t, sourcePosition: n = U.Bottom }) {
  return k(me, { children: [e == null ? void 0 : e.label, u(mt, { type: "source", position: n, isConnectable: t })] });
}
function lx({ data: e, isConnectable: t, targetPosition: n = U.Top, sourcePosition: r = U.Bottom }) {
  return k(me, { children: [u(mt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, u(mt, { type: "source", position: r, isConnectable: t })] });
}
function cx() {
  return null;
}
function dx({ data: e, isConnectable: t, targetPosition: n = U.Top }) {
  return k(me, { children: [u(mt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Wr = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Ia = {
  input: ax,
  default: lx,
  output: dx,
  group: cx
};
function ux(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const fx = (e) => {
  const { width: t, height: n, x: r, y: o } = Bn(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: We(t) ? t : null,
    height: We(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function hx({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = fe(), { width: o, height: i, transformString: s, userSelectionActive: a } = ae(fx, ge), l = id(), c = oe(null);
  ce(() => {
    var p;
    n || (p = c.current) == null || p.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (od({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const f = e ? (p) => {
    const g = r.getState().nodes.filter((b) => b.selected);
    e(p, g);
  } : void 0, h = (p) => {
    Object.prototype.hasOwnProperty.call(Wr, p.key) && (p.preventDefault(), l({
      direction: Wr[p.key],
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
const Aa = typeof window < "u" ? window : void 0, px = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function ld({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: f, onSelectionStart: h, onSelectionEnd: p, multiSelectionKeyCode: g, panActivationKeyCode: b, zoomActivationKeyCode: v, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: w, panOnScrollSpeed: N, panOnScrollMode: E, zoomOnDoubleClick: C, panOnDrag: T, autoPanOnSelection: A, defaultViewport: O, translateExtent: L, minZoom: B, maxZoom: H, preventScrolling: x, onSelectionContextMenu: $, noWheelClassName: M, noPanClassName: S, disableKeyboardA11y: z, onViewportChange: I, isControlledViewport: D }) {
  const { nodesSelectionActive: P, userSelectionActive: V } = ae(px, ge), X = On(c, { target: Aa }), F = On(b, { target: Aa }), Q = F || T, G = F || w, ee = d && Q !== !0, W = X || V || ee;
  return Yv({ deleteKeyCode: l, multiSelectionKeyCode: g }), u(Uv, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: G, panActivationKeyPressed: F, panOnScrollSpeed: N, panOnScrollMode: E, zoomOnDoubleClick: C, panOnDrag: !X && Q, defaultViewport: O, translateExtent: L, minZoom: B, maxZoom: H, zoomActivationKeyCode: v, preventScrolling: x, noWheelClassName: M, noPanClassName: S, onViewportChange: I, isControlledViewport: D, paneClickDistance: a, selectionOnDrag: ee, children: k(Qv, { onSelectionStart: h, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: Q, autoPanOnSelection: A, isSelecting: !!W, selectionMode: f, selectionKeyPressed: X, paneClickDistance: a, selectionOnDrag: ee, children: [e, P && u(hx, { onSelectionContextMenu: $, noPanClassName: S, disableKeyboardA11y: z })] }) });
}
ld.displayName = "FlowRenderer";
const gx = he(ld), mx = (e) => (t) => e ? qi(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function yx(e) {
  return ae(Ie(mx(e), [e]), ge);
}
const wx = (e) => e.updateNodeInternals;
function bx() {
  const e = ae(wx), [t] = J(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
function vx({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
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
function xx({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: f, noDragClassName: h, noPanClassName: p, disableKeyboardA11y: g, rfId: b, nodeTypes: v, nodeClickDistance: m, onError: _ }) {
  const { node: y, internals: w, isParent: N } = ae((W) => {
    const j = W.nodeLookup.get(e), q = W.parentLookup.has(e);
    return {
      node: j,
      internals: j.internals,
      isParent: q
    };
  }, ge);
  let E = y.type || "default", C = (v == null ? void 0 : v[E]) || Ia[E];
  C === void 0 && (_ == null || _("003", Ve.error003(E)), E = "default", C = (v == null ? void 0 : v.default) || Ia.default);
  const T = !!(y.draggable || a && typeof y.draggable > "u"), A = !!(y.selectable || l && typeof y.selectable > "u"), O = !!(y.connectable || c && typeof y.connectable > "u"), L = !!(y.focusable || d && typeof y.focusable > "u"), B = fe(), H = Ec(y), x = vx({ node: y, nodeType: E, hasDimensions: H, resizeObserver: f }), $ = od({
    nodeRef: x,
    disabled: y.hidden || !T,
    noDragClassName: h,
    handleSelector: y.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), M = id();
  if (y.hidden)
    return null;
  const S = Ye(y), z = ux(y), I = A || T || t || n || r || o, D = n ? (W) => n(W, { ...w.userNode }) : void 0, P = r ? (W) => r(W, { ...w.userNode }) : void 0, V = o ? (W) => o(W, { ...w.userNode }) : void 0, X = i ? (W) => i(W, { ...w.userNode }) : void 0, F = s ? (W) => s(W, { ...w.userNode }) : void 0, Q = (W) => {
    const { selectNodesOnDrag: j, nodeDragThreshold: q } = B.getState();
    A && (!j || !T || q > 0) && xi({
      id: e,
      store: B,
      nodeRef: x
    }), t && t(W, { ...w.userNode });
  }, G = (W) => {
    if (!(Mc(W.nativeEvent) || g)) {
      if (gc.includes(W.key) && A) {
        const j = W.key === "Escape";
        xi({
          id: e,
          store: B,
          unselect: j,
          nodeRef: x
        });
      } else if (T && y.selected && Object.prototype.hasOwnProperty.call(Wr, W.key)) {
        W.preventDefault();
        const { ariaLabelConfig: j } = B.getState();
        B.setState({
          ariaLiveMessage: j["node.a11yDescription.ariaLiveMessage"]({
            direction: W.key.replace("Arrow", "").toLowerCase(),
            x: ~~w.positionAbsolute.x,
            y: ~~w.positionAbsolute.y
          })
        }), M({
          direction: Wr[W.key],
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
    qi(/* @__PURE__ */ new Map([[e, y]]), { x: 0, y: 0, width: j, height: q }, W, !0).length > 0 || Z(y.position.x + S.width / 2, y.position.y + S.height / 2, {
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
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: D, onMouseMove: P, onMouseLeave: V, onContextMenu: X, onClick: Q, onDoubleClick: F, onKeyDown: L ? G : void 0, tabIndex: L ? 0 : void 0, onFocus: L ? ee : void 0, role: y.ariaRole ?? (L ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Zc}-${b}`, "aria-label": y.ariaLabel, ...y.domAttributes, children: u(ex, { value: e, children: u(C, { id: e, data: y.data, type: E, positionAbsoluteX: w.positionAbsolute.x, positionAbsoluteY: w.positionAbsolute.y, selected: y.selected ?? !1, selectable: A, draggable: T, deletable: y.deletable ?? !0, isConnectable: O, sourcePosition: y.sourcePosition, targetPosition: y.targetPosition, dragging: $, dragHandle: y.dragHandle, zIndex: w.z, parentId: y.parentId, ...S }) }) });
}
var _x = he(xx);
const kx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function cd(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = ae(kx, ge), i = yx(e.onlyRenderVisibleElements), s = bx();
  return u("div", { className: "react-flow__nodes", style: so, children: i.map((a) => (
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
    u(_x, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
cd.displayName = "NodeRenderer";
const Ex = he(cd);
function Sx(e) {
  return ae(Ie((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && ob({
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
const Nx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return u("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Cx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return u("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Ta = {
  [qt.Arrow]: Nx,
  [qt.ArrowClosed]: Cx
};
function Mx(e) {
  const t = fe();
  return le(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(Ta, e) ? Ta[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Ve.error009(e)), null);
  }, [e]);
}
const $x = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = Mx(t);
  return l ? u("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: u(l, { color: n, strokeWidth: s }) }) : null;
}, dd = ({ defaultColor: e, rfId: t }) => {
  const n = ae((i) => i.edges), r = ae((i) => i.defaultEdgeOptions), o = le(() => fb(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? u("svg", { className: "react-flow__marker", "aria-hidden": "true", children: u("defs", { children: o.map((i) => u($x, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
dd.displayName = "MarkerDefinitions";
var Ix = he(dd);
function ud({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [f, h] = J({ x: 1, y: 0, width: 0, height: 0 }), p = be(["react-flow__edge-textwrapper", c]), g = oe(null);
  return ce(() => {
    if (g.current) {
      const b = g.current.getBBox();
      h({
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height
      });
    }
  }, [n]), n ? k("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: p, visibility: f.width ? "visible" : "hidden", ...d, children: [o && u("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), u("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
ud.displayName = "EdgeText";
const Ax = he(ud);
function ao({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return k(me, { children: [u("path", { ...d, d: e, fill: "none", className: be(["react-flow__edge-path", d.className]) }), c ? u("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && We(t) && We(n) ? u(Ax, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function La({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === U.Left || e === U.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function fd({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top }) {
  const [s, a] = La({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = La({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, f, h, p] = Ic({
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
function hd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, interactionWidth: m }) => {
    const [_, y, w] = fd({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), N = e.isInternal ? void 0 : t;
    return u(ao, { id: N, path: _, labelX: y, labelY: w, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, interactionWidth: m });
  });
}
const Tx = hd({ isInternal: !1 }), pd = hd({ isInternal: !0 });
Tx.displayName = "SimpleBezierEdge";
pd.displayName = "SimpleBezierEdgeInternal";
function gd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, sourcePosition: p = U.Bottom, targetPosition: g = U.Top, markerEnd: b, markerStart: v, pathOptions: m, interactionWidth: _ }) => {
    const [y, w, N] = yi({
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
    return u(ao, { id: E, path: y, labelX: w, labelY: N, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, markerEnd: b, markerStart: v, interactionWidth: _ });
  });
}
const md = gd({ isInternal: !1 }), yd = gd({ isInternal: !0 });
md.displayName = "SmoothStepEdge";
yd.displayName = "SmoothStepEdgeInternal";
function wd(e) {
  return he(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return u(md, { ...n, id: r, pathOptions: le(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const Lx = wd({ isInternal: !1 }), bd = wd({ isInternal: !0 });
Lx.displayName = "StepEdge";
bd.displayName = "StepEdgeInternal";
function vd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, markerEnd: p, markerStart: g, interactionWidth: b }) => {
    const [v, m, _] = Lc({ sourceX: n, sourceY: r, targetX: o, targetY: i }), y = e.isInternal ? void 0 : t;
    return u(ao, { id: y, path: v, labelX: m, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: h, markerEnd: p, markerStart: g, interactionWidth: b });
  });
}
const zx = vd({ isInternal: !1 }), xd = vd({ isInternal: !0 });
zx.displayName = "StraightEdge";
xd.displayName = "StraightEdgeInternal";
function _d(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = U.Bottom, targetPosition: a = U.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, pathOptions: m, interactionWidth: _ }) => {
    const [y, w, N] = Ac({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), E = e.isInternal ? void 0 : t;
    return u(ao, { id: E, path: y, labelX: w, labelY: N, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, interactionWidth: _ });
  });
}
const Ox = _d({ isInternal: !1 }), kd = _d({ isInternal: !0 });
Ox.displayName = "BezierEdge";
kd.displayName = "BezierEdgeInternal";
const za = {
  default: kd,
  straight: xd,
  step: bd,
  smoothstep: yd,
  simplebezier: pd
}, Oa = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Px = (e, t, n) => n === U.Left ? e - t : n === U.Right ? e + t : e, Dx = (e, t, n) => n === U.Top ? e - t : n === U.Bottom ? e + t : e, Pa = "react-flow__edgeupdater";
function Da({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return u("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: be([Pa, `${Pa}-${a}`]), cx: Px(t, r, e), cy: Dx(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function Rx({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: f, setReconnecting: h, setUpdateHover: p }) {
  const g = fe(), b = (w, N) => {
    if (w.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: C, connectionMode: T, connectionRadius: A, lib: O, onConnectStart: L, cancelConnection: B, nodeLookup: H, rfId: x, panBy: $, updateConnection: M } = g.getState(), S = N.type === "target", z = (P, V) => {
      h(!1), f == null || f(P, n, N.type, V);
    }, I = (P) => c == null ? void 0 : c(n, P), D = (P, V) => {
      h(!0), d == null || d(w, n, N.type), L == null || L(P, V);
    };
    vi.onPointerDown(w.nativeEvent, {
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
  }, v = (w) => b(w, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (w) => b(w, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => p(!0), y = () => p(!1);
  return k(me, { children: [(e === !0 || e === "source") && u(Da, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: v, onMouseEnter: _, onMouseOut: y, type: "source" }), (e === !0 || e === "target") && u(Da, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: _, onMouseOut: y, type: "target" })] });
}
function Hx({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: f, onReconnectStart: h, onReconnectEnd: p, rfId: g, edgeTypes: b, noPanClassName: v, onError: m, disableKeyboardA11y: _ }) {
  let y = ae((Z) => Z.edgeLookup.get(e));
  const w = ae((Z) => Z.defaultEdgeOptions);
  y = w ? { ...w, ...y } : y;
  let N = y.type || "default", E = (b == null ? void 0 : b[N]) || za[N];
  E === void 0 && (m == null || m("011", Ve.error011(N)), N = "default", E = (b == null ? void 0 : b.default) || za.default);
  const C = !!(y.focusable || t && typeof y.focusable > "u"), T = typeof f < "u" && (y.reconnectable || n && typeof y.reconnectable > "u"), A = !!(y.selectable || r && typeof y.selectable > "u"), O = oe(null), [L, B] = J(!1), [H, x] = J(!1), $ = fe(), { zIndex: M = y.zIndex, sourceX: S, sourceY: z, targetX: I, targetY: D, sourcePosition: P, targetPosition: V } = ae(Ie((Z) => {
    const te = Z.nodeLookup.get(y.source), ne = Z.nodeLookup.get(y.target);
    if (!te || !ne)
      return Oa;
    const re = ub({
      id: e,
      sourceNode: te,
      targetNode: ne,
      sourceHandle: y.sourceHandle || null,
      targetHandle: y.targetHandle || null,
      connectionMode: Z.connectionMode,
      onError: m
    }), se = rb({
      selected: y.selected,
      zIndex: y.zIndex,
      sourceNode: te,
      targetNode: ne,
      elevateOnSelect: Z.elevateEdgesOnSelect,
      zIndexMode: Z.zIndexMode
    });
    return {
      ...re || Oa,
      zIndex: se
    };
  }, [y.source, y.target, y.sourceHandle, y.targetHandle, y.selected, y.zIndex, m]), ge), X = le(() => y.markerStart ? `url('#${wi(y.markerStart, g)}')` : void 0, [y.markerStart, g]), F = le(() => y.markerEnd ? `url('#${wi(y.markerEnd, g)}')` : void 0, [y.markerEnd, g]);
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
    if (!_ && gc.includes(Z.key) && A) {
      const { unselectNodesAndEdges: ne, addSelectedEdges: re } = $.getState();
      Z.key === "Escape" ? ((te = O.current) == null || te.blur(), ne({ edges: [y] })) : re([e]);
    }
  };
  return u("svg", { style: { zIndex: M }, children: k("g", { className: be([
    "react-flow__edge",
    `react-flow__edge-${N}`,
    y.className,
    v,
    {
      selected: y.selected,
      animated: y.animated,
      inactive: !A && !o,
      updating: L,
      selectable: A
    }
  ]), onClick: Q, onDoubleClick: G, onContextMenu: ee, onMouseEnter: W, onMouseMove: j, onMouseLeave: q, onKeyDown: C ? K : void 0, tabIndex: C ? 0 : void 0, role: y.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": y.ariaLabel === null ? void 0 : y.ariaLabel || `Edge from ${y.source} to ${y.target}`, "aria-describedby": C ? `${Qc}-${g}` : void 0, ref: O, ...y.domAttributes, children: [!H && u(E, { id: e, source: y.source, target: y.target, type: y.type, selected: y.selected, animated: y.animated, selectable: A, deletable: y.deletable ?? !0, label: y.label, labelStyle: y.labelStyle, labelShowBg: y.labelShowBg, labelBgStyle: y.labelBgStyle, labelBgPadding: y.labelBgPadding, labelBgBorderRadius: y.labelBgBorderRadius, sourceX: S, sourceY: z, targetX: I, targetY: D, sourcePosition: P, targetPosition: V, data: y.data, style: y.style, sourceHandleId: y.sourceHandle, targetHandleId: y.targetHandle, markerStart: X, markerEnd: F, pathOptions: "pathOptions" in y ? y.pathOptions : void 0, interactionWidth: y.interactionWidth }), T && u(Rx, { edge: y, isReconnectable: T, reconnectRadius: d, onReconnect: f, onReconnectStart: h, onReconnectEnd: p, sourceX: S, sourceY: z, targetX: I, targetY: D, sourcePosition: P, targetPosition: V, setUpdateHover: B, setReconnecting: x })] }) });
}
var Wx = he(Hx);
const Bx = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Ed({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: f, onEdgeDoubleClick: h, onReconnectStart: p, onReconnectEnd: g, disableKeyboardA11y: b }) {
  const { edgesFocusable: v, edgesReconnectable: m, elementsSelectable: _, onError: y } = ae(Bx, ge), w = Sx(t);
  return k("div", { className: "react-flow__edges", children: [u(Ix, { defaultColor: e, rfId: n }), w.map((N) => u(Wx, { id: N, edgesFocusable: v, edgesReconnectable: m, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: f, onDoubleClick: h, onReconnectStart: p, onReconnectEnd: g, rfId: n, onError: y, edgeTypes: r, disableKeyboardA11y: b }, N))] });
}
Ed.displayName = "EdgeRenderer";
const Vx = he(Ed), Ra = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Fx({ children: e }) {
  const t = fe(), n = oe(null), [r] = J(() => t.getState().transform);
  return nd(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = Ra(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), u("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Ra(r) }, children: e });
}
function jx(e) {
  const t = io(), n = oe(!1);
  ce(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Yx = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Gx(e) {
  const t = ae(Yx), n = fe();
  return ce(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Xx(e) {
  return e.connection.inProgress ? { ...e.connection, to: Fn(e.connection.to, e.transform) } : { ...e.connection };
}
function Ux(e) {
  return Xx;
}
function qx(e) {
  const t = Ux();
  return ae(t, ge);
}
const Kx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Zx({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = ae(Kx, ge);
  return !(i && o && l) ? null : u("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: u("g", { className: be(["react-flow__connection", Nc(a)]), children: u(Sd, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const Sd = ({ style: e, type: t = ht.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: f, toPosition: h, pointer: p } = qx();
  if (!o)
    return;
  if (n)
    return u(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: h, connectionStatus: Nc(r), toNode: d, toHandle: f, pointer: p });
  let g = "";
  const b = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: h
  };
  switch (t) {
    case ht.Bezier:
      [g] = Ac(b);
      break;
    case ht.SimpleBezier:
      [g] = fd(b);
      break;
    case ht.Step:
      [g] = yi({
        ...b,
        borderRadius: 0
      });
      break;
    case ht.SmoothStep:
      [g] = yi(b);
      break;
    default:
      [g] = Lc(b);
  }
  return u("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
Sd.displayName = "ConnectionLine";
const Qx = {};
function Ha(e = Qx) {
  oe(e), fe(), ce(() => {
  }, [e]);
}
function Jx() {
  fe(), oe(!1), ce(() => {
  }, []);
}
function Nd({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: f, onSelectionStart: h, onSelectionEnd: p, connectionLineType: g, connectionLineStyle: b, connectionLineComponent: v, connectionLineContainerStyle: m, selectionKeyCode: _, selectionOnDrag: y, selectionMode: w, multiSelectionKeyCode: N, panActivationKeyCode: E, zoomActivationKeyCode: C, deleteKeyCode: T, onlyRenderVisibleElements: A, elementsSelectable: O, defaultViewport: L, translateExtent: B, minZoom: H, maxZoom: x, preventScrolling: $, defaultMarkerColor: M, zoomOnScroll: S, zoomOnPinch: z, panOnScroll: I, panOnScrollSpeed: D, panOnScrollMode: P, zoomOnDoubleClick: V, panOnDrag: X, autoPanOnSelection: F, onPaneClick: Q, onPaneMouseEnter: G, onPaneMouseMove: ee, onPaneMouseLeave: W, onPaneScroll: j, onPaneContextMenu: q, paneClickDistance: K, nodeClickDistance: Z, onEdgeContextMenu: te, onEdgeMouseEnter: ne, onEdgeMouseMove: re, onEdgeMouseLeave: se, reconnectRadius: de, onReconnect: _e, onReconnectStart: Te, onReconnectEnd: Ee, noDragClassName: Oe, noWheelClassName: Ge, noPanClassName: Je, disableKeyboardA11y: Xe, nodeExtent: Ne, rfId: Le, viewport: Pe, onViewportChange: Ue, nodesDraggable: Ot }) {
  return Ha(e), Ha(t), Jx(), jx(n), Gx(Pe), u(gx, { onPaneClick: Q, onPaneMouseEnter: G, onPaneMouseMove: ee, onPaneMouseLeave: W, onPaneContextMenu: q, onPaneScroll: j, paneClickDistance: K, deleteKeyCode: T, selectionKeyCode: _, selectionOnDrag: y, selectionMode: w, onSelectionStart: h, onSelectionEnd: p, multiSelectionKeyCode: N, panActivationKeyCode: E, zoomActivationKeyCode: C, elementsSelectable: O, zoomOnScroll: S, zoomOnPinch: z, zoomOnDoubleClick: V, panOnScroll: I, panOnScrollSpeed: D, panOnScrollMode: P, panOnDrag: X, autoPanOnSelection: F, defaultViewport: L, translateExtent: B, minZoom: H, maxZoom: x, onSelectionContextMenu: f, preventScrolling: $, noDragClassName: Oe, noWheelClassName: Ge, noPanClassName: Je, disableKeyboardA11y: Xe, onViewportChange: Ue, isControlledViewport: !!Pe, children: k(Fx, { children: [u(Vx, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: _e, onReconnectStart: Te, onReconnectEnd: Ee, onlyRenderVisibleElements: A, onEdgeContextMenu: te, onEdgeMouseEnter: ne, onEdgeMouseMove: re, onEdgeMouseLeave: se, reconnectRadius: de, defaultMarkerColor: M, noPanClassName: Je, disableKeyboardA11y: Xe, rfId: Le }), u(Zx, { style: b, type: g, component: v, containerStyle: m }), u("div", { className: "react-flow__edgelabel-renderer" }), u(Ex, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: Z, onlyRenderVisibleElements: A, noPanClassName: Je, noDragClassName: Oe, disableKeyboardA11y: Xe, nodeExtent: Ne, rfId: Le, nodesDraggable: Ot }), u("div", { className: "react-flow__viewport-portal" })] }) });
}
Nd.displayName = "GraphView";
const e_ = he(Nd), t_ = kc(), Wa = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: f, zIndexMode: h = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), m = r ?? t ?? [], _ = n ?? e ?? [], y = d ?? [0, 0], w = f ?? An;
  Pc(b, v, m);
  const { nodesInitialized: N } = bi(_, p, g, {
    nodeOrigin: y,
    nodeExtent: w,
    zIndexMode: h
  });
  let E = [0, 0, 1];
  if (s && o && i) {
    const C = Bn(p, {
      filter: (L) => !!((L.width || L.initialWidth) && (L.height || L.initialHeight))
    }), { x: T, y: A, zoom: O } = to(C, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
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
    edgeLookup: v,
    connectionLookup: b,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: An,
    nodeExtent: w,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Ut.Strict,
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
    connection: { ...yc },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: t_,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: mc,
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
}, n_ = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: f, zIndexMode: h }) => pv((p, g) => {
  async function b() {
    const { nodeLookup: v, panZoom: m, fitViewOptions: _, fitViewResolver: y, width: w, height: N, minZoom: E, maxZoom: C } = g();
    m && (await Kw({
      nodes: v,
      width: w,
      height: N,
      panZoom: m,
      minZoom: E,
      maxZoom: C
    }, _), y == null || y.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...Wa({
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
    setNodes: (v) => {
      const { nodeLookup: m, parentLookup: _, nodeOrigin: y, nodeExtent: w, elevateNodesOnSelect: N, fitViewQueued: E, zIndexMode: C, nodesSelectionActive: T } = g(), { nodesInitialized: A, hasSelectedNodes: O } = bi(v, m, _, {
        nodeOrigin: y,
        nodeExtent: w,
        elevateNodesOnSelect: N,
        checkEquality: !0,
        zIndexMode: C
      }), L = T && O;
      E && A ? (b(), p({
        nodes: v,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: L
      })) : p({ nodes: v, nodesInitialized: A, nodesSelectionActive: L });
    },
    setEdges: (v) => {
      const { connectionLookup: m, edgeLookup: _ } = g();
      Pc(m, _, v), p({ edges: v });
    },
    setDefaultNodesAndEdges: (v, m) => {
      if (v) {
        const { setNodes: _ } = g();
        _(v), p({ hasDefaultNodes: !0 });
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
    updateNodeInternals: (v) => {
      const { triggerNodeChanges: m, nodeLookup: _, parentLookup: y, domNode: w, nodeOrigin: N, nodeExtent: E, debug: C, fitViewQueued: T, zIndexMode: A } = g(), { changes: O, updatedInternals: L } = bb(v, _, y, w, N, E, A);
      L && (gb(_, y, { nodeOrigin: N, nodeExtent: E, zIndexMode: A }), T ? (b(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), (O == null ? void 0 : O.length) > 0 && (C && console.log("React Flow: trigger node changes", O), m == null || m(O)));
    },
    updateNodePositions: (v, m = !1) => {
      const _ = [];
      let y = [];
      const { nodeLookup: w, triggerNodeChanges: N, connection: E, updateConnection: C, onNodesChangeMiddlewareMap: T } = g();
      for (const [A, O] of v) {
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
          const x = At(L, E.fromHandle, U.Left, !0);
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
        const { parentLookup: A, nodeOrigin: O } = g(), L = ns(_, w, A, O);
        y.push(...L);
      }
      for (const A of T.values())
        y = A(y);
      N(y);
    },
    triggerNodeChanges: (v) => {
      const { onNodesChange: m, setNodes: _, nodes: y, hasDefaultNodes: w, debug: N } = g();
      if (v != null && v.length) {
        if (w) {
          const E = Ov(v, y);
          _(E);
        }
        N && console.log("React Flow: trigger node changes", v), m == null || m(v);
      }
    },
    triggerEdgeChanges: (v) => {
      const { onEdgesChange: m, setEdges: _, edges: y, hasDefaultEdges: w, debug: N } = g();
      if (v != null && v.length) {
        if (w) {
          const E = Pv(v, y);
          _(E);
        }
        N && console.log("React Flow: trigger edge changes", v), m == null || m(v);
      }
    },
    addSelectedNodes: (v) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: w, triggerEdgeChanges: N } = g();
      if (m) {
        const E = v.map((C) => kt(C, !0));
        w(E);
        return;
      }
      w(Ft(y, /* @__PURE__ */ new Set([...v]), !0)), N(Ft(_));
    },
    addSelectedEdges: (v) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: w, triggerEdgeChanges: N } = g();
      if (m) {
        const E = v.map((C) => kt(C, !0));
        N(E);
        return;
      }
      N(Ft(_, /* @__PURE__ */ new Set([...v]))), w(Ft(y, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: v, edges: m } = {}) => {
      const { edges: _, nodes: y, nodeLookup: w, triggerNodeChanges: N, triggerEdgeChanges: E } = g(), C = v || y, T = m || _, A = [];
      for (const L of C) {
        if (!L.selected)
          continue;
        const B = w.get(L.id);
        B && (B.selected = !1), A.push(kt(L.id, !1));
      }
      const O = [];
      for (const L of T)
        L.selected && O.push(kt(L.id, !1));
      N(A), E(O);
    },
    setMinZoom: (v) => {
      const { panZoom: m, maxZoom: _ } = g();
      m == null || m.setScaleExtent([v, _]), p({ minZoom: v });
    },
    setMaxZoom: (v) => {
      const { panZoom: m, minZoom: _ } = g();
      m == null || m.setScaleExtent([_, v]), p({ maxZoom: v });
    },
    setTranslateExtent: (v) => {
      var m;
      (m = g().panZoom) == null || m.setTranslateExtent(v), p({ translateExtent: v });
    },
    resetSelectedElements: () => {
      const { edges: v, nodes: m, triggerNodeChanges: _, triggerEdgeChanges: y, elementsSelectable: w } = g();
      if (!w)
        return;
      const N = m.reduce((C, T) => T.selected ? [...C, kt(T.id, !1)] : C, []), E = v.reduce((C, T) => T.selected ? [...C, kt(T.id, !1)] : C, []);
      _(N), y(E);
    },
    setNodeExtent: (v) => {
      const { nodes: m, nodeLookup: _, parentLookup: y, nodeOrigin: w, elevateNodesOnSelect: N, nodeExtent: E, zIndexMode: C } = g();
      v[0][0] === E[0][0] && v[0][1] === E[0][1] && v[1][0] === E[1][0] && v[1][1] === E[1][1] || (bi(m, _, y, {
        nodeOrigin: w,
        nodeExtent: v,
        elevateNodesOnSelect: N,
        checkEquality: !1,
        zIndexMode: C
      }), p({ nodeExtent: v }));
    },
    panBy: (v) => {
      const { transform: m, width: _, height: y, panZoom: w, translateExtent: N } = g();
      return vb({ delta: v, panZoom: w, transform: m, translateExtent: N, width: _, height: y });
    },
    setCenter: async (v, m, _) => {
      const { width: y, height: w, maxZoom: N, panZoom: E } = g();
      if (!E)
        return !1;
      const C = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : N;
      return await E.setViewport({
        x: y / 2 - v * C,
        y: w / 2 - m * C,
        zoom: C
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...yc }
      });
    },
    updateConnection: (v) => {
      p({ connection: v });
    },
    reset: () => p({ ...Wa() })
  };
}, Object.is);
function os({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: f, zIndexMode: h, children: p }) {
  const [g] = J(() => n_({
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
  return u(gv, { value: g, children: u(Bv, { children: u(nx, { children: p }) }) });
}
function r_({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: f, nodeExtent: h, zIndexMode: p }) {
  return en(oo) ? u(me, { children: e }) : u(os, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: f, nodeExtent: h, zIndexMode: p, children: e });
}
const o_ = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function i_({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: f, onMoveEnd: h, onConnect: p, onConnectStart: g, onConnectEnd: b, onClickConnectStart: v, onClickConnectEnd: m, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: w, onNodeContextMenu: N, onNodeDoubleClick: E, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onNodesDelete: O, onEdgesDelete: L, onDelete: B, onSelectionChange: H, onSelectionDragStart: x, onSelectionDrag: $, onSelectionDragStop: M, onSelectionContextMenu: S, onSelectionStart: z, onSelectionEnd: I, onBeforeDelete: D, connectionMode: P, connectionLineType: V = ht.Bezier, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: Q, deleteKeyCode: G = "Backspace", selectionKeyCode: ee = "Shift", selectionOnDrag: W = !1, selectionMode: j = Tn.Full, panActivationKeyCode: q = "Space", multiSelectionKeyCode: K = zn() ? "Meta" : "Control", zoomActivationKeyCode: Z = zn() ? "Meta" : "Control", snapToGrid: te, snapGrid: ne, onlyRenderVisibleElements: re = !1, selectNodesOnDrag: se, nodesDraggable: de, autoPanOnNodeFocus: _e, nodesConnectable: Te, nodesFocusable: Ee, nodeOrigin: Oe = Jc, edgesFocusable: Ge, edgesReconnectable: Je, elementsSelectable: Xe = !0, defaultViewport: Ne = Mv, minZoom: Le = 0.5, maxZoom: Pe = 2, translateExtent: Ue = An, preventScrolling: Ot = !0, nodeExtent: et, defaultMarkerColor: jn = "#b1b1b7", zoomOnScroll: lo = !0, zoomOnPinch: yt = !0, panOnScroll: co = !1, panOnScrollSpeed: nn = 0.5, panOnScrollMode: rn = Nt.Free, zoomOnDoubleClick: uo = !0, panOnDrag: Yn = !0, onPaneClick: on, onPaneMouseEnter: sn, onPaneMouseMove: fo, onPaneMouseLeave: ho, onPaneScroll: Pt, onPaneContextMenu: an, paneClickDistance: pe = 1, nodeClickDistance: tt = 0, children: Gn, onReconnect: wt, onReconnectStart: Dt, onReconnectEnd: Xn, onEdgeContextMenu: Un, onEdgeDoubleClick: qn, onEdgeMouseEnter: po, onEdgeMouseMove: go, onEdgeMouseLeave: mo, reconnectRadius: yo = 10, onNodesChange: De, onEdgesChange: ln, noDragClassName: cn = "nodrag", noWheelClassName: wo = "nowheel", noPanClassName: Rt = "nopan", fitView: Kn, fitViewOptions: dn, connectOnClick: bo, attributionPosition: vo, proOptions: xo, defaultEdgeOptions: _o, elevateNodesOnSelect: ko = !0, elevateEdgesOnSelect: Eo = !1, disableKeyboardA11y: Zn = !1, autoPanOnConnect: So, autoPanOnNodeDrag: No, autoPanOnSelection: Co = !0, autoPanSpeed: Mo, connectionRadius: $o, isValidConnection: Io, onError: Ao, style: To, id: Ht, nodeDragThreshold: bt, connectionDragThreshold: un, viewport: fn, onViewportChange: Lo, width: zo, height: Qn, colorMode: Jn = "light", debug: er, onScroll: vt, ariaLabelConfig: tr, zIndexMode: hn = "basic", ...nr }, rr) {
  const pn = Ht || "1", Ce = Tv(Jn), or = Ie((gn) => {
    gn.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), vt == null || vt(gn);
  }, [vt]);
  return u("div", { "data-testid": "rf__wrapper", ...nr, onScroll: or, style: { ...To, ...o_ }, ref: rr, className: be(["react-flow", o, Ce]), id: Ht, role: "application", children: k(r_, { nodes: e, edges: t, width: zo, height: Qn, fitView: Kn, fitViewOptions: dn, minZoom: Le, maxZoom: Pe, nodeOrigin: Oe, nodeExtent: et, zIndexMode: hn, children: [u(Av, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: p, onConnectStart: g, onConnectEnd: b, onClickConnectStart: v, onClickConnectEnd: m, nodesDraggable: de, autoPanOnNodeFocus: _e, nodesConnectable: Te, nodesFocusable: Ee, edgesFocusable: Ge, edgesReconnectable: Je, elementsSelectable: Xe, elevateNodesOnSelect: ko, elevateEdgesOnSelect: Eo, minZoom: Le, maxZoom: Pe, nodeExtent: et, onNodesChange: De, onEdgesChange: ln, snapToGrid: te, snapGrid: ne, connectionMode: P, translateExtent: Ue, connectOnClick: bo, defaultEdgeOptions: _o, fitView: Kn, fitViewOptions: dn, onNodesDelete: O, onEdgesDelete: L, onDelete: B, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onSelectionDrag: $, onSelectionDragStart: x, onSelectionDragStop: M, onMove: d, onMoveStart: f, onMoveEnd: h, noPanClassName: Rt, nodeOrigin: Oe, rfId: pn, autoPanOnConnect: So, autoPanOnNodeDrag: No, autoPanSpeed: Mo, onError: Ao, connectionRadius: $o, isValidConnection: Io, selectNodesOnDrag: se, nodeDragThreshold: bt, connectionDragThreshold: un, onBeforeDelete: D, debug: er, ariaLabelConfig: tr, zIndexMode: hn }), u(e_, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: w, onNodeContextMenu: N, onNodeDoubleClick: E, nodeTypes: i, edgeTypes: s, connectionLineType: V, connectionLineStyle: X, connectionLineComponent: F, connectionLineContainerStyle: Q, selectionKeyCode: ee, selectionOnDrag: W, selectionMode: j, deleteKeyCode: G, multiSelectionKeyCode: K, panActivationKeyCode: q, zoomActivationKeyCode: Z, onlyRenderVisibleElements: re, defaultViewport: Ne, translateExtent: Ue, minZoom: Le, maxZoom: Pe, preventScrolling: Ot, zoomOnScroll: lo, zoomOnPinch: yt, zoomOnDoubleClick: uo, panOnScroll: co, panOnScrollSpeed: nn, panOnScrollMode: rn, panOnDrag: Yn, autoPanOnSelection: Co, onPaneClick: on, onPaneMouseEnter: sn, onPaneMouseMove: fo, onPaneMouseLeave: ho, onPaneScroll: Pt, onPaneContextMenu: an, paneClickDistance: pe, nodeClickDistance: tt, onSelectionContextMenu: S, onSelectionStart: z, onSelectionEnd: I, onReconnect: wt, onReconnectStart: Dt, onReconnectEnd: Xn, onEdgeContextMenu: Un, onEdgeDoubleClick: qn, onEdgeMouseEnter: po, onEdgeMouseMove: go, onEdgeMouseLeave: mo, reconnectRadius: yo, defaultMarkerColor: jn, noDragClassName: cn, noWheelClassName: wo, noPanClassName: Rt, rfId: pn, disableKeyboardA11y: Zn, nodeExtent: et, viewport: fn, onViewportChange: Lo, nodesDraggable: de }), u(Cv, { onSelectionChange: H }), Gn, u(_v, { proOptions: xo, position: vo }), u(xv, { rfId: pn, disableKeyboardA11y: Zn })] }) });
}
var Cd = td(i_);
function s_({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return u("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: be(["react-flow__background-pattern", n, r]) });
}
function a_({ radius: e, className: t }) {
  return u("circle", { cx: e, cy: e, r: e, className: be(["react-flow__background-pattern", "dots", t]) });
}
var gt;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(gt || (gt = {}));
const l_ = {
  [gt.Dots]: 1,
  [gt.Lines]: 1,
  [gt.Cross]: 6
}, c_ = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Md({
  id: e,
  variant: t = gt.Dots,
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
  const f = oe(null), { transform: h, patternId: p } = ae(c_, ge), g = r || l_[t], b = t === gt.Dots, v = t === gt.Cross, m = Array.isArray(n) ? n : [n, n], _ = [m[0] * h[2] || 1, m[1] * h[2] || 1], y = g * h[2], w = Array.isArray(i) ? i : [i, i], N = v ? [y, y] : _, E = [
    w[0] * h[2] + N[0] / 2,
    w[1] * h[2] + N[1] / 2
  ], C = `${p}${e || ""}`;
  return k("svg", { className: be(["react-flow__background", c]), style: {
    ...l,
    ...so,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [u("pattern", { id: C, x: h[0] % _[0], y: h[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: b ? u(a_, { radius: y / 2, className: d }) : u(s_, { dimensions: N, lineWidth: o, variant: t, className: d }) }), u("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
Md.displayName = "Background";
const $d = he(Md);
function d_() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: u("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function u_() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: u("path", { d: "M0 0h32v4.2H0z" }) });
}
function f_() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: u("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function h_() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function p_() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function gr({ children: e, className: t, ...n }) {
  return u("button", { type: "button", className: be(["react-flow__controls-button", t]), ...n, children: e });
}
const g_ = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Id({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: f = "bottom-left", orientation: h = "vertical", "aria-label": p }) {
  const g = fe(), { isInteractive: b, minZoomReached: v, maxZoomReached: m, ariaLabelConfig: _ } = ae(g_, ge), { zoomIn: y, zoomOut: w, fitView: N } = io(), E = () => {
    y(), i == null || i();
  }, C = () => {
    w(), s == null || s();
  }, T = () => {
    N(o), a == null || a();
  }, A = () => {
    g.setState({
      nodesDraggable: !b,
      nodesConnectable: !b,
      elementsSelectable: !b
    }), l == null || l(!b);
  };
  return k(Tt, { className: be(["react-flow__controls", h === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": p ?? _["controls.ariaLabel"], children: [t && k(me, { children: [u(gr, { onClick: E, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: m, children: u(d_, {}) }), u(gr, { onClick: C, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: v, children: u(u_, {}) })] }), n && u(gr, { className: "react-flow__controls-fitview", onClick: T, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: u(f_, {}) }), r && u(gr, { className: "react-flow__controls-interactive", onClick: A, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: b ? u(p_, {}) : u(h_, {}) }), d] });
}
Id.displayName = "Controls";
const Ad = he(Id);
function m_({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: f, selected: h, onClick: p }) {
  const { background: g, backgroundColor: b } = i || {}, v = s || g || b;
  return u("rect", { className: be(["react-flow__minimap-node", { selected: h }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: v,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: p ? (m) => p(m, e) : void 0 });
}
const y_ = he(m_), w_ = (e) => e.nodes.map((t) => t.id), ei = (e) => e instanceof Function ? e : () => e;
function b_({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = y_,
  onClick: s
}) {
  const a = ae(w_, ge), l = ei(t), c = ei(e), d = ei(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return u(me, { children: a.map((h) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    u(x_, { id: h, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, h)
  )) });
}
function v_({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: f, width: h, height: p } = ae((g) => {
    const b = g.nodeLookup.get(e);
    if (!b)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const v = b.internals.userNode, { x: m, y: _ } = b.internals.positionAbsolute, { width: y, height: w } = Ye(v);
    return {
      node: v,
      x: m,
      y: _,
      width: y,
      height: w
    };
  }, ge);
  return !c || c.hidden || !Ec(c) ? null : u(a, { x: d, y: f, width: h, height: p, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const x_ = he(v_);
var __ = he(b_);
const k_ = 200, E_ = 150, S_ = (e) => !e.hidden, N_ = (e) => {
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
    boundingRect: n ? xc(Bn(e.nodeLookup, { filter: S_ }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Ba = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, C_ = (e, t) => Ba(e.viewBB, t.viewBB) && Ba(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, M_ = "react-flow__minimap-desc";
function Td({
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
  pannable: b = !1,
  zoomable: v = !1,
  ariaLabel: m,
  inversePan: _,
  zoomStep: y = 1,
  offsetScale: w = 5
}) {
  const N = fe(), E = oe(null), { boundingRect: C, panZoom: T, viewBB: A, rfId: O, translateExtent: L, flowWidth: B, flowHeight: H, ariaLabelConfig: x } = ae(N_, C_), $ = (e == null ? void 0 : e.width) ?? k_, M = (e == null ? void 0 : e.height) ?? E_, S = C.width / $, z = C.height / M, I = Math.max(S, z), D = I * $, P = I * M, V = w * I, X = C.x - (D - C.width) / 2 - V, F = C.y - (P - C.height) / 2 - V, Q = D + V * 2, G = P + V * 2, ee = `${M_}-${O}`, W = oe(0), j = oe();
  W.current = I, ce(() => {
    const ne = N.getState().panZoom;
    if (E.current && ne)
      return j.current = $b({
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
      pannable: b,
      zoomStep: y,
      zoomable: v
    });
  }, [b, v, _, y, L, B, H]);
  const q = p ? (ne) => {
    var de;
    const [re, se] = ((de = j.current) == null ? void 0 : de.pointer(ne)) || [0, 0];
    p(ne, { x: re, y: se });
  } : void 0, K = Ie((ne, re) => {
    const se = N.getState().nodeLookup.get(re).internals.userNode;
    g == null || g(ne, se);
  }, [g]), Z = g ? K : void 0, te = m ?? x["minimap.ariaLabel"];
  return u(Tt, { position: h, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * I : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: be(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: k("svg", { width: $, height: M, viewBox: `${X} ${F} ${Q} ${G}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": ee, ref: E, onClick: q, children: [te && u("title", { id: ee, children: te }), u(__, { onClick: Z, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), u("path", { className: "react-flow__minimap-mask", d: `M${X - V},${F - V}h${Q + V * 2}v${G + V * 2}h${-Q - V * 2}z
        M${A.x},${A.y}h${A.width}v${A.height}h${-A.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Td.displayName = "MiniMap";
const Ld = he(Td), $_ = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, I_ = {
  [Qt.Line]: "right",
  [Qt.Handle]: "bottom-right"
};
function A_({ nodeId: e, position: t, variant: n = Qt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: h, autoScale: p = !0, shouldResize: g, onResizeStart: b, onResize: v, onResizeEnd: m }) {
  const _ = sd(), y = typeof e == "string" ? e : _, w = fe(), N = oe(null), E = n === Qt.Handle, C = ae(Ie($_(E && p), [E, p]), ge), T = oe(null), A = t ?? I_[n];
  ce(() => {
    if (!(!N.current || !y))
      return T.current || (T.current = Vb({
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
                ...Sc({
                  x: L.x ?? I.position.x,
                  y: L.y ?? I.position.y
                }, { width: P, height: V }, I.parentId, x, D)
              }
            }, F = ns([X], x, $, M);
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
        onResizeStart: b,
        onResize: v,
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
    b,
    v,
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
he(A_);
const T_ = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", is = 0.05, _i = 370, zd = 88, L_ = 44, ss = 560, Va = "system-map-flow-css", z_ = `
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
if (!document.getElementById(Va)) {
  const e = document.createElement("style");
  e.id = Va, e.textContent = T_ + z_, document.head.appendChild(e);
}
function as() {
  return ae((e) => e.width);
}
function O_() {
  return ae((e) => e.height);
}
function Od(e, t, n) {
  return { width: e - Math.min(n, e * 0.5), height: Math.max(120, t - zd - L_) };
}
const P_ = 16;
function Pd(e, t, n = "center") {
  const r = io(), o = ae((a) => a.width), i = ae((a) => a.height), s = oe(!1);
  ce(() => {
    if (!o || !i || e.length === 0) return;
    const a = Math.min(...e.map((g) => g.x)), l = Math.min(...e.map((g) => g.y)), c = Math.max(...e.map((g) => g.x + g.width)), d = Math.max(...e.map((g) => g.y + g.height)), f = Od(o, i, t), h = to(
      { x: a, y: l, width: c - a, height: d - l },
      f.width,
      f.height,
      is,
      1,
      0.05
    ), p = n === "top" ? Math.min(h.y, P_ - l * h.zoom) : h.y;
    r.setViewport({ ...h, y: p + zd }, { duration: s.current ? 200 : 0 }), s.current = !0;
  }, [r, e, t, o, i, n]);
}
function D_({ layers: e }) {
  return /* @__PURE__ */ k("div", { className: "sm-layers", role: "group", "aria-label": "Map layers", children: [
    /* @__PURE__ */ u("span", { className: "sm-layers-label", children: "Layers" }),
    e.map((t) => /* @__PURE__ */ u("button", { type: "button", className: "sm-plain sm-layer", "aria-pressed": t.on, title: t.title, disabled: t.disabled, onClick: t.onToggle, children: t.label }, t.key))
  ] });
}
function Dd({ children: e }) {
  return /* @__PURE__ */ u("div", { className: "sm-tools", children: e });
}
function R_({ title: e, onBack: t }) {
  return /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
    /* @__PURE__ */ k(xe, { variant: "aim", children: [
      "Showing: ",
      e
    ] }),
    /* @__PURE__ */ u(ie, { onClick: t, children: "Back to today" })
  ] });
}
const Sr = { names: 210, keys: 240, columns: 240 }, ki = 34, Nn = 20, H_ = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, W_ = he(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", f = H_[n.status], h = (f == null ? void 0 : f.color) ?? "var(--border-strong, #a1a1aa)";
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
        /* @__PURE__ */ u(mt, { type: "target", position: U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(mt, { type: "source", position: U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              height: ki,
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
            style: { height: Nn, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ u("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: p.primary ? "PK" : p.foreign ? "FK" : p.proposed ? "new" : "" }),
              /* @__PURE__ */ u("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: p.proposed ? 600 : void 0 }, children: p.name }),
              /* @__PURE__ */ u("span", { style: { ...Y, ...ve, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.type })
            ]
          },
          p.name
        )),
        o > 0 && /* @__PURE__ */ k("div", { style: { ...Y, height: Nn, padding: "0 10px", lineHeight: `${Nn}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), B_ = { table: W_ };
function Rd(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Br(e, t) {
  if (t === "names") return ki + 2;
  const n = Rd(e, t).length;
  return ki + n * Nn + (n < e.columns.length ? Nn : 0) + 2;
}
function V_(e, t) {
  const n = Sr[t], r = new Ir.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Br(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  Ir.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Br(a, t) / 2 });
  }
  return s;
}
function F_(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const Ei = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function j_(e) {
  return (Ei.find(([t]) => t === e) ?? Ei[2])[1];
}
function Y_() {
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
        Ei.map(([e, t]) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function G_({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  tools: i,
  onSelect: s
}) {
  const { mode: a } = Ka(), l = as() >= ss, c = le(() => t ? F_(e, t) : e, [e, t]), d = t && o === "names" ? "keys" : o, f = le(() => V_(c, d), [c, d]), h = le(
    () => c.tables.map((b) => {
      const v = Rd(b, d);
      return {
        id: b.id,
        type: "table",
        position: f.get(b.id) ?? { x: 0, y: 0 },
        width: Sr[d],
        height: Br(b, d),
        data: {
          table: b,
          columns: v,
          hidden: d === "names" ? 0 : b.columns.length - v.length,
          flags: n.get(b.id) ?? 0,
          working: r.get(b.id) ?? 0,
          focused: b.id === t,
          width: Sr[d],
          large: d === "names"
        }
      };
    }),
    [c, d, f, n, r, t]
  ), p = le(
    () => c.edges.map((b) => {
      const v = j_(b.on_delete);
      return {
        id: b.id,
        source: b.source,
        target: b.target,
        selectable: !1,
        markerEnd: { type: qt.ArrowClosed, width: 14, height: 14, color: v },
        style: { stroke: v, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [c, t]
  ), g = le(
    () => c.tables.map((b) => ({
      ...f.get(b.id) ?? { x: 0, y: 0 },
      width: Sr[d],
      height: Br(b, d)
    })),
    [c, f, d]
  );
  return Pd(g, t ? _i : 0), /* @__PURE__ */ k(
    Cd,
    {
      nodes: h,
      edges: p,
      nodeTypes: B_,
      colorMode: a,
      minZoom: is,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (b, v) => s(v.id),
      onPaneClick: () => s(null),
      children: [
        /* @__PURE__ */ u($d, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(Ad, { showInteractive: !1 }),
        l && /* @__PURE__ */ u(Ld, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u(Tt, { position: "top-left", children: /* @__PURE__ */ k(Dd, { children: [
          i,
          /* @__PURE__ */ u(Y_, {})
        ] }) })
      ]
    }
  );
}
function X_(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ u(os, { children: /* @__PURE__ */ u(G_, { ...e }) }) });
}
const U_ = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], q_ = {
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
}, K_ = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], Hd = { accepted: "ok", dropped: "muted", draft: "aim" }, Fa = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, ls = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, Z_ = { ...ls, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, Q_ = { ...Y, ...ve, fontSize: 11, overflowWrap: "anywhere" };
function Pn(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function Si(e) {
  return tn(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function Ni({ title: e, children: t }) {
  return /* @__PURE__ */ k("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function Wd({ limit: e }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ u(Dn, { severity: e.severity }),
    /* @__PURE__ */ k("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ u("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u("div", { style: { ...Y, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ u("div", { style: Q_, children: e.evidence.join("  ") })
    ] })
  ] });
}
function mr({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ u(Ni, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ u("button", { style: { ...$e, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? Si(o.id) }),
    r && /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function J_({
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
      /* @__PURE__ */ u(xe, { variant: Hd[e.status], children: e.status }),
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
      Pn(d.before, "gap"),
      " in ",
      /* @__PURE__ */ u("strong", { children: d.title }),
      "."
    ] }, d.id)),
    K_.map(({ kind: d, title: f }) => {
      const h = e.limits.filter((p) => p.kind === d);
      return h.length === 0 ? null : /* @__PURE__ */ u(Ni, { title: `${f} (${h.length})`, children: h.map((p, g) => /* @__PURE__ */ u(Wd, { limit: p }, g)) }, d);
    }),
    /* @__PURE__ */ u(mr, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ u(mr, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ u(mr, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ u(mr, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    e.limits_checked === !1 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, "data-testid": "limits-note", children: "Limits check Postgres only, so this hasn't been checked against this project's database." }),
    c.length > 0 && /* @__PURE__ */ u(Ni, { title: "Draft SQL", children: /* @__PURE__ */ u("pre", { style: { ...ve, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
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
function e1({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ k("button", { style: Z_, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ k("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ u(xe, { variant: "err", children: Pn(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ k(xe, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ u(xe, { variant: Hd[n.status], children: n.status })
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
function t1(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${Pn(n, "unit test")}`, t ? Pn(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${Yr(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function n1({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ k("div", { style: ls, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(xe, { variant: Fa[e.state].variant, children: Fa[e.state].label }),
      /* @__PURE__ */ u("button", { style: $e, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ u("button", { style: { ...$e, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ u("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ u(Wd, { limit: i }, s)) }),
    /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ u("tbody", { children: e.parts.map((i) => /* @__PURE__ */ k("tr", { children: [
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", ...Y }, children: i.kind }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ u("button", { style: { ...$e, textAlign: "left" }, onClick: () => n(i.id), children: Si(i.id) }) : Si(i.id) }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 0", ...Y, textAlign: "right" }, children: t1(i) })
    ] }, i.id)) }) })
  ] });
}
function r1({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ k("div", { style: { ...ls, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ u("button", { style: { ...$e, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ k("span", { style: { ...Y, fontSize: 12 }, children: [
      Pn(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ u("button", { style: { ...$e, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function o1({
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
  const [p, g] = J(""), b = q_[o], v = () => {
    p.trim() && (s(b.ask(p.trim())), g(""));
  };
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: U_.map(([m, _]) => /* @__PURE__ */ u(ie, { primary: o === m, onClick: () => i(m), children: _ }, m)) }),
    /* @__PURE__ */ k(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (m) => {
          m.preventDefault(), v();
        },
        children: [
          /* @__PURE__ */ u(Fr, { "aria-label": "Describe it", placeholder: b.placeholder, value: p, onChange: (m) => g(m.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ u(ie, { primary: !0, type: "submit", disabled: !r || !p.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ u(
        J_,
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
      ) : /* @__PURE__ */ u(e1, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((m) => /* @__PURE__ */ u(
          n1,
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
      o === "views" && /* @__PURE__ */ u(r1, { rows: e.views, onOpen: f, onDelete: (m) => d("views", m) })
    ] })
  ] });
}
const i1 = ["high", "medium", "low", "info"];
function s1({
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
      i1.filter((l) => s.get(l)).map((l) => /* @__PURE__ */ k(ie, { primary: o === l, onClick: () => i(l), children: [
        l,
        " ",
        s.get(l)
      ] }, l))
    ] }),
    a.length === 0 && /* @__PURE__ */ u("p", { style: Y, children: t ? "No schema was read, so the table rules didn't run." : "No findings." }),
    a.map((l) => /* @__PURE__ */ k("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ k("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ u(Dn, { severity: l.severity }),
        /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600 }, children: l.title }),
        /* @__PURE__ */ u("button", { style: $e, onClick: () => n(l.node), children: "Show" }),
        /* @__PURE__ */ u("button", { style: $e, onClick: () => r(l), children: "Ask" })
      ] }),
      /* @__PURE__ */ u("p", { style: { margin: "4px 0 0" }, children: l.detail }),
      /* @__PURE__ */ u("p", { style: { ...Y, ...ve, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: l.evidence.join("  ") })
    ] }, l.id))
  ] });
}
const Bd = 560, Vr = 760, a1 = 1100;
function l1(e, t) {
  const n = e >= a1, r = t && e >= Vr ? n ? "220px" : "170px" : null, o = n ? "minmax(320px, 26%)" : e >= Vr ? "260px" : e >= Bd ? "240px" : null;
  return [r, "minmax(0, 1fr)", o].filter(Boolean).join(" ");
}
function c1(e, t, n, r, o) {
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
const d1 = [
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
function Vd(e) {
  return tn(e.replace(/^(module|area|route|job|service|plan|table|agent):(public\.)?/, ""));
}
function Lt({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function u1({ link: e, onOpen: t }) {
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
        children: Vd(e.node)
      }
    ),
    e.access && /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function f1({ node: e, onOpen: t }) {
  return /* @__PURE__ */ u(me, { children: d1.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ u(Lt, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ u(u1, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function h1({ node: e }) {
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
function p1({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ u(Lt, { title: `Not found (${n.length})`, children: /* @__PURE__ */ u("ul", { style: { ...ve, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ u("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function g1({ node: e }) {
  const t = e.asks_you ?? [], n = e.leaves_region ?? [];
  return /* @__PURE__ */ k(me, { children: [
    e.description && /* @__PURE__ */ u("p", { style: { margin: "0 0 12px" }, children: e.description }),
    n.length > 0 && /* @__PURE__ */ u(Lt, { title: "Leaves your home region", children: /* @__PURE__ */ u("p", { style: { margin: 0, color: "var(--danger, #dc2626)" }, children: n.map(Vd).join(", ") }) }),
    /* @__PURE__ */ u(Lt, { title: `Asks you (${t.length})`, children: t.length === 0 ? /* @__PURE__ */ u("p", { style: { ...Y, margin: 0 }, children: "No call that leaves work for a person was found." }) : /* @__PURE__ */ u("ul", { style: { ...ve, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: t.map((r) => /* @__PURE__ */ u("li", { children: r }, r)) }) })
  ] });
}
function m1({ node: e, onRegion: t }) {
  const [n, r] = J(e.region ?? ""), [o, i] = J(null), [s, a] = J(!1), l = async (d) => {
    a(!0), i(await t(e.id, d)), a(!1);
  }, c = n.trim() === (e.region ?? "");
  return /* @__PURE__ */ k(Lt, { title: "Region", children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6 }, children: [
      /* @__PURE__ */ u(Fr, { "aria-label": `Region of ${e.name}`, placeholder: "Where it runs, such as US", value: n, onChange: (d) => r(d.target.value), style: { flex: 1, minWidth: 0 } }),
      /* @__PURE__ */ u(ie, { disabled: s || !n.trim() || c, onClick: () => void l(n.trim()), children: "Save" }),
      e.region && /* @__PURE__ */ u(ie, { disabled: s, onClick: () => void l(null), children: "Clear" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 11, margin: "4px 0 0" }, children: "You set this. Agents that use it are checked against your home region." }),
    o && /* @__PURE__ */ u("p", { style: { color: "var(--danger, #dc2626)", margin: "4px 0 0" }, children: o })
  ] });
}
function y1({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${Yr(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ k(Lt, { title: n ? `Risk: ${n}` : "Risk", children: [
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
    e.worst_files.length > 0 && /* @__PURE__ */ u("ul", { style: { ...ve, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ u("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: tn(r.path) }, r.path)) })
  ] });
}
function w1({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ k(Lt, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ u("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ u("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ k("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ u(Dn, { severity: n.severity }),
      /* @__PURE__ */ u("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function b1({
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
          /* @__PURE__ */ u(w1, { names: t, overlaps: n }),
          e.kind === "agent" && /* @__PURE__ */ u(g1, { node: e }),
          e.kind === "service" && l && /* @__PURE__ */ u(m1, { node: e, onRegion: l }, `${e.id}|${e.region ?? ""}`),
          e.risk && /* @__PURE__ */ u(y1, { risk: e.risk }),
          c ? /* @__PURE__ */ u(tu, { node: e, onAsk: a }) : /* @__PURE__ */ u(h1, { node: e }),
          !c && /* @__PURE__ */ u(p1, { node: e }),
          /* @__PURE__ */ u(f1, { node: e, onOpen: o }),
          !c && /* @__PURE__ */ u("p", { style: { ...Y, ...ve, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (d = e.evidence) == null ? void 0 : d.join("  ") })
        ] })
      ]
    }
  );
}
const v1 = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], x1 = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, _1 = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function k1({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ k("div", { style: _1, "data-testid": e.id, children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ k("p", { style: { ...Y, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      x1[e.status_source]
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
      /* @__PURE__ */ u("button", { style: $e, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ u("button", { style: $e, onClick: () => n(e), children: "Ask" }),
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
function E1({
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
    /* @__PURE__ */ u("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: v1.map((s) => {
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
        /* @__PURE__ */ u("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ u(k1, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function S1(e, t, n) {
  return { key: "plans", label: e > 0 ? `Plans ${e}` : "Plans", on: t, title: "Show unfinished plans on the map", onToggle: n };
}
const N1 = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], ot = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, ti = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, ja = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function C1({ share: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ u("span", { style: { minWidth: 32, textAlign: "right" }, children: Yr(e) })
  ] });
}
function M1({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ u(xe, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ u(xe, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ u(xe, { variant: "muted", children: "Untested" }) : null;
}
function $1(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function I1({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k(xe, { variant: "muted", children: [
        Yr(i.lines_hit / i.lines_total),
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
function A1({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = J("modules"), [c, d] = J(!0), [f, h] = J(!1), [p, g] = J("score"), b = e.coverage !== null, v = le(() => e[a].filter((w) => a === "modules" || !f || !w.ui), [e, a, f]), m = v.filter((w) => w.hot && w.untested), _ = le(() => {
    const w = c && m.length > 0 ? m : v;
    if (p === "score") return w;
    const N = p === "cover" ? 1 : -1;
    return [...w].sort((E, C) => N * (E[p] - C[p]));
  }, [v, c, p]), y = a === "modules" ? "module" : "file";
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
    /* @__PURE__ */ u(I1, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
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
          /* @__PURE__ */ u("th", { style: { ...ot, textAlign: "left" }, children: /* @__PURE__ */ k("button", { style: ti, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          N1.map((w) => /* @__PURE__ */ u("th", { style: ot, children: /* @__PURE__ */ u("button", { style: { ...ti, color: p === w.key ? "var(--text, inherit)" : ti.color }, title: w.title, onClick: () => g(w.key), children: w.label }) }, w.key)),
          /* @__PURE__ */ u("th", { style: ot })
        ] }) }),
        /* @__PURE__ */ u("tbody", { children: _.map((w) => /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ k("td", { style: { ...ot, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ u(
              "button",
              {
                onClick: () => r(w.id ?? w.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...ja, ...ve } : ja,
                children: tn(w.path)
              }
            ),
            " ",
            /* @__PURE__ */ u(M1, { row: w })
          ] }),
          /* @__PURE__ */ u("td", { style: ot, children: w.commits }),
          /* @__PURE__ */ u("td", { style: ot, children: w.complexity }),
          /* @__PURE__ */ u("td", { style: ot, children: b ? /* @__PURE__ */ u(C1, { share: w.covered ?? 0 }) : /* @__PURE__ */ u("span", { style: Y, children: $1(w, a) }) }),
          /* @__PURE__ */ u("td", { style: ot, children: w.lines }),
          /* @__PURE__ */ u("td", { style: ot, children: /* @__PURE__ */ u("button", { style: $e, onClick: () => o(w.id ?? w.path), disabled: !t, children: "Ask" }) })
        ] }, w.path)) })
      ] }),
      _.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
function T1({
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
      el,
      {
        width: 270,
        align: "right",
        label: "Model status",
        trigger: (c) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-chip", "data-testid": "status-chip", ...c, children: [
          /* @__PURE__ */ u("span", { className: "sm-dot", "data-tone": i ? "muted" : e.tone }),
          l,
          /* @__PURE__ */ u(tl, {})
        ] }),
        children: () => /* @__PURE__ */ k("div", { style: { padding: 8 }, children: [
          /* @__PURE__ */ u("div", { style: { fontWeight: 600, marginBottom: 2, overflowWrap: "anywhere" }, children: t ?? e.detail }),
          /* @__PURE__ */ k("div", { style: { ...Y, marginBottom: 10 }, children: [
            n ? /* @__PURE__ */ u("span", { className: "sm-mono", children: n.slice(0, 7) }) : "This folder",
            ", built ",
            nu(r, Date.now() / 1e3)
          ] }),
          o && /* @__PURE__ */ k("div", { style: { marginBottom: 10 }, "data-testid": "build-read", children: [
            ru(o).map((c) => /* @__PURE__ */ u("div", { children: c }, c)),
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
const yr = 10;
function Ci(e, t) {
  const n = (e.bands ?? []).filter((s) => s.members.length > 0), r = new Ir.graphlib.Graph({ multigraph: !0, compound: n.length > 0 });
  r.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  for (const s of e.cards) r.setNode(s.id, { width: kn, height: _n });
  for (const s of n) {
    r.setNode(s.id, {});
    for (const a of s.members) r.setParent(a, s.id);
  }
  for (const s of e.lines)
    s.source !== s.target && r.setEdge(s.source, s.target, {}, s.id);
  Ir.layout(r);
  const o = /* @__PURE__ */ new Map();
  for (const s of e.cards) {
    const a = r.node(s.id);
    o.set(s.id, { x: a.x - kn / 2, y: a.y - _n / 2 });
  }
  const i = n.map((s) => {
    const a = s.members.map((h) => o.get(h)).filter((h) => !!h), l = Math.min(...a.map((h) => h.x)) - yr, c = Math.min(...a.map((h) => h.y)) - yr, d = Math.max(...a.map((h) => h.x + kn)) + yr, f = Math.max(...a.map((h) => h.y + _n)) + yr;
    return { ...s, x: l, y: c, width: d - l, height: f - c };
  });
  return { places: o, bands: i };
}
function L1(e) {
  const t = [
    ...[...e.places.values()].map((s) => ({ x: s.x, y: s.y, width: kn, height: _n })),
    ...e.bands
  ];
  if (t.length === 0) return { width: 0, height: 0 };
  const n = Math.min(...t.map((s) => s.x)), r = Math.min(...t.map((s) => s.y)), o = Math.max(...t.map((s) => s.x + s.width)), i = Math.max(...t.map((s) => s.y + s.height));
  return { width: o - n, height: i - r };
}
const z1 = 1.15;
function Ya(e, t, n) {
  const r = L1(e);
  return Math.min(1, t / Math.max(r.width, 1), n / Math.max(r.height, 1));
}
function O1(e, t, n) {
  const r = Ci(e, "LR");
  if (t <= 0 || n <= 0) return { ...r, direction: "LR" };
  const o = Ci(e, "TB");
  return Ya(o, t, n) > Ya(r, t, n) * z1 ? { ...o, direction: "TB" } : { ...r, direction: "LR" };
}
const Mi = kn, $i = _n, Ga = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  agent: "agent",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, P1 = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)",
  empty: "var(--warn-text, #b45309)"
}, D1 = { empty: "no jobs" }, Nr = {
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
}, R1 = {
  home: "var(--ok, #15803d)",
  away: "var(--danger, #dc2626)",
  unknown: "var(--muted, #71717a)"
}, Cr = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, H1 = he(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i, down: s } = t, a = n.status === "proposed", l = n.kind === "plan" || a || n.kind === "agent" && n.status !== void 0, c = n.kind === "service", d = o.length > 1, f = a ? "var(--accent, #2563eb)" : l ? P1[n.status ?? "unclear"] : d ? "var(--warn-text, #b45309)" : void 0, h = r ? "var(--accent, #2563eb)" : f ?? (n.strong ? "var(--text, #18181b)" : "var(--border-strong, #a1a1aa)"), p = r || d ? 2 : n.strong ? 1.5 : 1;
  return /* @__PURE__ */ k(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: Mi,
        height: $i,
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
        boxShadow: [i ? `inset 5px 0 0 ${Cr[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ u(mt, { type: "target", position: s ? U.Top : U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(mt, { type: "source", position: s ? U.Bottom : U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          l && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: f, flexShrink: 0 }, children: D1[n.status ?? ""] ?? n.status }),
          i && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: Cr[i].color, flexShrink: 0 }, children: Cr[i].label })
        ] }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [Ga[n.kind] && n.kind !== "area" && n.kind !== "plan" ? Ga[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ k("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: d ? 600 : 400, color: d ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] }),
          o.length === 0 && n.badge && /* @__PURE__ */ u("span", { style: { fontSize: 11, flexShrink: 0, color: "var(--info, #2563eb)" }, children: n.badge })
        ] })
      ]
    }
  );
}), W1 = he(function({ data: t }) {
  const n = R1[t.band.tone];
  return /* @__PURE__ */ u("div", { "data-testid": t.band.id, style: { width: "100%", height: "100%", boxSizing: "border-box", borderRadius: 14, border: `1.5px dashed ${n}`, pointerEvents: "none" }, children: /* @__PURE__ */ u("span", { style: { position: "absolute", top: -9, left: 12, padding: "0 4px", fontSize: 11, fontWeight: 600, lineHeight: "16px", color: n, background: "var(--bg, #fff)" }, children: t.band.label }) });
}), B1 = { card: H1, band: W1 };
function V1(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function F1(e) {
  const t = e.leaves ? Nr.leaves_region : Nr[e.kind] ?? Nr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: qt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: V1(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function j1({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(Nr).filter(([i]) => e.has(i)), o = as();
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
        maxWidth: Math.max(120, o - (o < ss ? 130 : 290)),
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
        n && Object.values(Cr).map((i) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 5, height: 12, background: i.color } }),
          i.label
        ] }, i.label)),
        t && /* @__PURE__ */ u("span", { style: Y, children: "Thin links hidden" })
      ]
    }
  );
}
function Y1({ system: e, focus: t, agents: n, onFocus: r }) {
  const o = cu(e, t, n);
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
function G1({
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
  const { mode: p } = Ka(), g = as(), b = O_(), v = g >= ss, m = c ? null : t, _ = le(
    () => a ? ou(e, a, n) : iu(e, m, n, r, c),
    [e, a, m, n, r, c]
  ), y = c && !a, w = Od(g, b, o ? _i : 0), N = y ? w.width : 0, E = y ? w.height : 0, C = le(() => {
    if (y) return O1(_, N, E);
    const S = l === "top-down" ? "TB" : "LR";
    return { ...Ci(_, S), direction: S };
  }, [_, l, y, N, E]), T = C.direction === "TB", A = C.places, O = le(() => su(i), [i]), L = s == null ? void 0 : s.by_node, B = le(
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
        width: Mi,
        height: $i,
        data: { card: S, focused: S.id === t, work: L ? lu(S.id, L) : [], band: au(O.get(S.id)), down: T }
      }))
    ],
    [_, C, A, t, O, L, T]
  ), H = le(() => _.lines.map(F1), [_]), x = le(
    () => [
      ..._.cards.map((S) => ({ ...A.get(S.id) ?? { x: 0, y: 0 }, width: Mi, height: $i })),
      ...C.bands.map((S) => ({ x: S.x, y: S.y, width: S.width, height: S.height }))
    ],
    [_, A, C]
  );
  Pd(x, o ? _i : 0, c && !a ? "top" : "center");
  const $ = le(() => new Set(_.lines.map((S) => S.leaves ? "leaves_region" : S.kind)), [_]), M = (S) => {
    if (!S.startsWith("band:"))
      if (S === du) h();
      else {
        if (S !== uu && S !== fu && S === t) return;
        f(S);
      }
  };
  return /* @__PURE__ */ k(
    Cd,
    {
      nodes: B,
      edges: H,
      nodeTypes: B1,
      colorMode: p,
      minZoom: is,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (S, z) => M(z.id),
      children: [
        /* @__PURE__ */ u($d, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(Ad, { showInteractive: !1 }),
        v && /* @__PURE__ */ u(Ld, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u(Tt, { position: "top-left", children: /* @__PURE__ */ k(Dd, { children: [
          /* @__PURE__ */ u(Y1, { system: e, focus: t, agents: c && !a, onFocus: f }),
          d
        ] }) }),
        /* @__PURE__ */ u(Tt, { position: "bottom-center", children: /* @__PURE__ */ u(j1, { kinds: $, top: (_.hidden ?? 0) > 0, risk: i !== null }) })
      ]
    }
  );
}
function X1(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ u(os, { children: /* @__PURE__ */ u(G1, { ...e, agents: e.agents ?? !1 }) }) });
}
const U1 = 16, q1 = 72, Fd = "system-map-view";
function Xa(e) {
  return e.count === void 0 ? void 0 : `${e.count} ${e.counts ?? ""}`.trim();
}
function ni({ item: e }) {
  return /* @__PURE__ */ k(me, { children: [
    e.label,
    e.count !== void 0 && /* @__PURE__ */ u("span", { className: "sm-count", children: e.count })
  ] });
}
function K1({ items: e, value: t, onChange: n, label: r }) {
  const o = oe(null), i = oe(null), s = oe(null), [a, l] = J(Number.POSITIVE_INFINITY), [c, d] = J([]), f = e.map((_) => `${_.label}${_.count ?? ""}`).join("|");
  Ti(() => {
    const _ = () => {
      var w, N;
      l(((w = o.current) == null ? void 0 : w.clientWidth) ?? 0), d([...((N = i.current) == null ? void 0 : N.children) ?? []].map((E) => E.offsetWidth));
    };
    _();
    const y = new ResizeObserver(_);
    return o.current && y.observe(o.current), () => y.disconnect();
  }, [f]);
  const h = e.findIndex((_) => _.value === t), p = le(
    () => c.length === e.length ? c1(c, a, q1, h, U1) : { visible: e.map((_, y) => y), hidden: [] },
    [c, a, h, e]
  ), g = p.visible.map((_) => e[_]), b = p.hidden.map((_) => e[_]), v = (_) => {
    n(_), requestAnimationFrame(() => {
      var y, w;
      return (w = (y = s.current) == null ? void 0 : y.querySelector('[aria-selected="true"]')) == null ? void 0 : w.focus();
    });
  }, m = (_) => {
    const y = g.findIndex((C) => C.value === t), w = g.length, E = { ArrowRight: (y + 1) % w, ArrowLeft: (y - 1 + w) % w, Home: 0, End: w - 1 }[_.key];
    E !== void 0 && (_.preventDefault(), v(g[E].value));
  };
  return /* @__PURE__ */ k("div", { ref: o, className: "sm-bar", style: { position: "relative", flex: "none" }, children: [
    /* @__PURE__ */ u("div", { ref: i, className: "sm-tab-probe", "aria-hidden": "true", children: e.map((_) => /* @__PURE__ */ u("span", { className: "sm-tab", children: /* @__PURE__ */ u(ni, { item: _ }) }, _.value)) }),
    /* @__PURE__ */ u("div", { ref: s, className: "sm-tabs", role: "tablist", "aria-label": r, onKeyDown: m, children: g.map((_) => /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        role: "tab",
        id: `system-map-tab-${_.value}`,
        className: "sm-plain sm-tab",
        "aria-selected": _.value === t,
        "aria-controls": Fd,
        tabIndex: _.value === t ? 0 : -1,
        title: Xa(_),
        onClick: () => n(_.value),
        children: /* @__PURE__ */ u(ni, { item: _ })
      },
      _.value
    )) }),
    b.length > 0 && /* @__PURE__ */ u(
      el,
      {
        width: 200,
        popup: "menu",
        label: "More views",
        trigger: (_) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-tab", ..._, children: [
          "More ",
          /* @__PURE__ */ u(tl, {})
        ] }),
        children: (_) => /* @__PURE__ */ u(hu, { label: "More views", children: b.map((y) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "sm-plain sm-row",
            title: Xa(y),
            onClick: () => {
              _(), v(y.value);
            },
            children: /* @__PURE__ */ u(ni, { item: y })
          },
          y.value
        )) })
      }
    )
  ] });
}
const jd = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, Z1 = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, Q1 = { ...ve, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, ri = 6;
function J1(e) {
  return tn(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function Ke({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { ...Y, fontSize: 12 }, children: e }),
    t
  ] });
}
function pt({ ids: e, onShow: t }) {
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ u("button", { style: Z1, onClick: () => t(n), children: J1(n) }, n)) });
}
function Ua({ files: e }) {
  return /* @__PURE__ */ k("ul", { style: Q1, children: [
    e.slice(0, ri).map((t) => /* @__PURE__ */ u("li", { children: t }, t)),
    e.length > ri && /* @__PURE__ */ k("li", { style: Y, children: [
      "and ",
      e.length - ri,
      " more"
    ] })
  ] });
}
const Yd = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function ek({ row: e, canAsk: t, onAsk: n }) {
  const r = Yd[e.merge];
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ u(Dn, { severity: e.severity }),
    /* @__PURE__ */ k("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ k("span", { style: Y, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ u("button", { style: $e, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function tk({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = Yd[e.merge];
  return /* @__PURE__ */ k("div", { style: jd, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ u(Dn, { severity: e.severity }),
      /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ u("button", { style: $e, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ u(Ke, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ u(Ua, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ u(Ke, { title: "Both change these tables", children: /* @__PURE__ */ u(pt, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ u(Ke, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ u(pt, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ u(Ke, { title: "Both change code that uses these tables", children: /* @__PURE__ */ u(pt, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ u(Ke, { title: "Also share", children: /* @__PURE__ */ u(Ua, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(Ke, { title: "Same modules", children: /* @__PURE__ */ u(pt, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ u("p", { style: { ...Y, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function nk({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ k("div", { style: jd, "data-testid": "worktree", children: [
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
    e.tables_schema.length > 0 && /* @__PURE__ */ u(Ke, { title: "Changes these tables", children: /* @__PURE__ */ u(pt, { ids: e.tables_schema, onShow: t }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(Ke, { title: "Modules", children: /* @__PURE__ */ u(pt, { ids: e.modules, onShow: t }) }),
    e.tables_code.length > 0 && /* @__PURE__ */ u(Ke, { title: "Code that uses", children: /* @__PURE__ */ u(pt, { ids: e.tables_code, onShow: t }) }),
    n.length > 0 && /* @__PURE__ */ u(Ke, { title: "Routes and plans", children: /* @__PURE__ */ u(pt, { ids: n, onShow: t }) })
  ] });
}
function rk({
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
      a > 0 && /* @__PURE__ */ u("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((h) => h.severity === "high" || h.severity === "medium").map((h) => /* @__PURE__ */ u(tk, { row: h, canAsk: n, onShow: r, onAsk: o }, `${h.a}|${h.b}`)) }),
      /* @__PURE__ */ k("section", { children: [
        /* @__PURE__ */ u("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ u("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((h) => /* @__PURE__ */ u(nk, { tree: h, onShow: r }, h.path)) }),
        c.length === 0 && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ k("p", { style: { ...Y, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ k("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((h) => h.severity === "low" || h.severity === "info").map((h) => /* @__PURE__ */ u(ek, { row: h, canAsk: n, onAsk: o }, `${h.a}|${h.b}`))
      ] })
    ] })
  ] });
}
const qa = 12, ok = 2e4, ik = 8e3, sk = 8e3, ak = 4e3, lk = [
  { key: "names", label: "Names" },
  { key: "keys", label: "Keys" },
  { key: "columns", label: "Columns" }
], oi = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, ck = [
  { value: "map", label: "Map" },
  { value: "data", label: "Data model" },
  { value: "plan", label: "Plan", counts: "unfinished plans" },
  { value: "risk", label: "Risk", counts: "hot and untested modules" },
  { value: "worktrees", label: "Worktrees", counts: "worktree collisions" },
  { value: "findings", label: "Findings", counts: "findings" },
  { value: "agents", label: "Agents", counts: "agents" },
  { value: "explore", label: "Explore", counts: "draft proposals" }
];
function dk(e, t) {
  const n = Za(), [r, o] = J(null), [i, s] = J(null), [a, l] = J(!1), [c, d] = J(null), f = (r == null ? void 0 : r.repoKey) === t ? r.slot : null, h = Ie(async () => {
    const g = await n.post("/api/chat/slots", { name: Au(t) });
    return await n.post(`/api/chat/slots/${encodeURIComponent(g.key)}/project`, { project: e }), o({ repoKey: t, slot: g.key }), g.key;
  }, [n, e, t]);
  ce(() => {
    if (!e) return;
    let g = !0;
    return d(null), (async () => zu(localStorage, t) ? !0 : Ou(await n.get("/api/chat/slots").catch(() => []), t))().then(async (v) => {
      g && (v ? await h() : s(t));
    }).catch((v) => {
      g && d(ut(v, "open the design chat"));
    }), () => {
      g = !1;
    };
  }, [n, h, e, t]);
  const p = Ie(
    (g) => {
      l(!0), d(null), (async () => {
        const v = f ?? await h();
        Pu(localStorage, t), await n.post("/api/chat?ws=1", { message: g, slot: v, agent: "" });
      })().catch((v) => d(ut(v, "send that to the design chat"))).finally(() => l(!1));
    },
    [n, h, t, f]
  );
  return { slot: f, error: c, send: p, opening: a, canAsk: e !== null, startable: i === t && f === null };
}
function uk({ disabled: e, onSend: t }) {
  const [n, r] = J("");
  return /* @__PURE__ */ u(
    "form",
    {
      style: { position: "absolute", left: 0, right: 0, bottom: 0 },
      onSubmit: (o) => {
        o.preventDefault(), n.trim() && t(n.trim());
      },
      children: /* @__PURE__ */ u(
        Fr,
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
function fk() {
  const e = oe(null), [t, n] = J(void 0), [r, o] = J(1400);
  return Ti(() => {
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
function wr({ children: e, onDismiss: t }) {
  return /* @__PURE__ */ k("div", { className: "sm-notice", role: "alert", "data-testid": "notice", children: [
    /* @__PURE__ */ u("span", { style: { flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: e }),
    t && /* @__PURE__ */ u(ie, { onClick: t, children: "Dismiss" })
  ] });
}
function hk({ read: e }) {
  const t = (e == null ? void 0 : e.unread) ?? [];
  return /* @__PURE__ */ u(
    Qa,
    {
      testId: "no-tables",
      icon: /* @__PURE__ */ u(Gd, {}),
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
function Gd() {
  return /* @__PURE__ */ k("svg", { width: "40", height: "40", viewBox: "0 0 64 64", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ u("rect", { x: "10", y: "10", width: "44", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "34", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "26", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "42", y: "42", width: "12", height: "12", rx: "3" })
  ] });
}
function pk({ onBuilt: e }) {
  const [t, n] = J(!1);
  return /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u(Ii, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(
      Qa,
      {
        testId: "first-run",
        icon: /* @__PURE__ */ u(Gd, {}),
        title: "See your system in one place",
        subtitle: "Add a project to map its code, data model, risk and plans.",
        action: /* @__PURE__ */ u(ie, { primary: !0, onClick: () => n(!0), children: "Add project" })
      }
    ) }),
    /* @__PURE__ */ u(gu, { open: t, projects: [], onClose: () => n(!1), onBuilt: e })
  ] });
}
function Nk() {
  const { repos: e, active: t, loaded: n, choose: r, reload: o } = pu();
  return n ? t ? /* @__PURE__ */ u(gk, { repo: t, projects: e, choose: r, reload: o }, t) : /* @__PURE__ */ u(pk, { onBuilt: r }) : /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u(Ii, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(ii, { rows: 6 }) })
  ] });
}
function gk({
  repo: e,
  projects: t,
  choose: n,
  reload: r
}) {
  var fs, hs;
  const o = Za(), { overview: i, error: s, refresh: a } = mu(e), l = i == null ? void 0 : i.manifest.version, [c, d] = J(0), f = l ? `${l}:${c}` : void 0, h = Wt("/graph", e, f), p = Wt("/system", e, f), g = Wt("/plan", e, f), b = Wt("/findings", e, f), v = Wt("/risk", e, f), m = Wt("/agents", e, f), _ = m.value, y = ((_ == null ? void 0 : _.agents.length) ?? 0) > 0, w = h.value, N = p.value, E = g.value, C = b.value, T = v.value, A = le(() => (E == null ? void 0 : E.plans) ?? [], [E]), O = le(() => (C == null ? void 0 : C.findings) ?? [], [C]), L = Po("/worktrees", e, ok), B = L.value, H = Po("/explore", e, ik), x = Po("/agents/draft", e, sk), [$, M] = J("whatif"), [S, z] = J(null), [I, D] = J(0), P = yu(S, e, I), [V, X] = J(!1), [F, Q] = J(null), [G, ee] = J(() => wu(localStorage, e)), [W, j] = J(null), [q, K] = J(null), [Z, te] = J(!0), [ne, re] = J(!1), [se, de] = J(!0), [_e, Te] = J(!1), Ee = oe(null), [Oe, Ge] = J(!1), [Je, Xe] = J(null), [Ne, Le] = J(null), [Pe, Ue] = J(null), [Ot, et] = J(null), [jn, lo] = J("names"), [yt, co] = J(() => bu(localStorage)), nn = oe(null), rn = oe(!1), [uo, Yn] = J(!1), [on, sn] = J(null), { ref: fo, height: ho, width: Pt } = fk(), an = (i == null ? void 0 : i.freshness.missing) === !0, pe = dk(i && !an ? i.manifest.repo : null, e), tt = Ie(
    (R) => {
      vu(localStorage, e, R), ee(R);
    },
    [e]
  );
  ce(() => {
    var R;
    rn.current && ((R = nn.current) == null || R.focus()), rn.current = !1;
  }, [yt]), ce(() => {
    if (!on) return;
    const R = window.setTimeout(() => sn(null), ak);
    return () => window.clearTimeout(R);
  }, [on]);
  const Gn = G === "map" ? q && !/^(area|group):/.test(q) ? q : null : G === "data" ? W : null, wt = V && (P != null && P.diff.added.some((R) => R.id === Gn)) ? null : Gn, Dt = xu(wt, e, f), Xn = le(() => {
    const R = /* @__PURE__ */ new Map();
    for (const ue of O)
      ue.severity !== "info" && R.set(ue.node, (R.get(ue.node) ?? 0) + 1);
    return R;
  }, [O]), Un = le(() => _u(B), [B]), qn = A.filter((R) => R.status === "planned" || R.status === "partial").length, po = ((B == null ? void 0 : B.counts.high) ?? 0) + ((B == null ? void 0 : B.counts.medium) ?? 0), go = (T == null ? void 0 : T.modules.filter((R) => R.hot && R.untested).length) ?? 0, mo = ((fs = H.value) == null ? void 0 : fs.proposals.filter((R) => R.status === "draft").length) ?? 0, yo = { findings: O.length, plan: qn, risk: go, worktrees: po, explore: mo, agents: _ == null ? void 0 : _.agents.length }, De = V ? P : null, ln = le(() => N ? ku(N, De) : null, [N, De]), cn = le(() => {
    const R = (De == null ? void 0 : De.graph) ?? w;
    return R && (F == null ? void 0 : F.level) === "data" ? Eu(R, F.resolved) : R;
  }, [w, De, F]), wo = async () => {
    Yn(!0), sn(null), et(null);
    try {
      const R = await o.post(`${lt}/build`, { repo: e });
      await a(), await r(), sn(R.unchanged ? "No changes" : "Rebuilt");
    } catch (R) {
      et(ut(R, "rebuild this project"));
    } finally {
      Yn(!1);
    }
  }, Rt = async (R, ue) => {
    et(null);
    try {
      await ue();
    } catch (ke) {
      et(ut(ke, R));
    }
  }, Kn = () => {
    Dt && pe.send(`Use the system-map tools. Look at ${Dt.id} and tell me what to watch out for.`);
  }, dn = (R) => {
    pe.send(`Use the system-map tools. Check finding ${R.id} on ${R.node}, read its evidence, and propose a fix.`);
  }, bo = (R) => {
    pe.send(`Use the system-map tools. Look at ${R.id}, say what is left to build, and propose the next step.`);
  }, vo = (R) => {
    pe.send(`Use the system-map tools. Look at ${R} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, xo = (R) => {
    pe.send(`Use the system-map tools. Read ${R.id} with the \`agents\` tool. Say what it does on its own, where it waits for a person, and what to watch out for.`);
  }, _o = (R) => {
    pe.send(`Use the system-map tools. Worktrees ${R.a} and ${R.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, ko = () => {
    pe.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, Eo = async () => {
    Ue(null);
    try {
      await o.post(`${lt}/coverage`, { repo: e }), d((R) => R + 1);
    } catch (R) {
      Ue(ut(R, "load the coverage report"));
    }
  }, Zn = (R) => {
    X(!0), Q(null), K(null);
    const ue = [...(P == null ? void 0 : P.diff.added) ?? [], ...(P == null ? void 0 : P.diff.changed) ?? []].find((ke) => ke.id.startsWith("table:"));
    j(R === "data" ? (ue == null ? void 0 : ue.id) ?? null : null), tt(R);
  }, So = (R, ue) => Rt("change this proposal", async () => {
    await o.post(`${lt}/proposal-status`, { repo: e, id: R, status: ue }), D((ke) => ke + 1), await H.refresh();
  }), No = (R, ue) => Rt("delete this", async () => {
    await o.post(`${lt}/intent-delete`, { repo: e, kind: R, id: ue }), R === "proposals" && (z(null), X(!1)), await H.refresh();
  }), Co = (R) => {
    un({ on: !1, focus: null, before: null }), Q(R), re(R.overlays.risk), de(R.overlays.worktrees), te(R.overlays.plans), z(R.proposal), X(R.proposal !== null), K(null), j(null), tt(R.level);
  }, Mo = () => {
    X(!1), Q(null), j(null), K(null);
  }, $o = (R, ue) => Rt("change this plan", async () => {
    await o.post(`${lt}/plan-status`, { repo: e, id: R, status: ue }), d((ke) => ke + 1);
  }), Io = async (R) => {
    Ge(!0), Xe(null);
    try {
      return await o.post(`${lt}/agents/settings`, { repo: e, settings: R }), await a(), d((ue) => ue + 1), await x.refresh(), !0;
    } catch (ue) {
      return Xe(ut(ue, "save the agent settings")), !1;
    } finally {
      Ge(!1);
    }
  }, Ao = async (R, ue) => {
    var ps;
    Ge(!0), Le(null);
    let ke = null;
    try {
      return await o.post(`${lt}/agents/draft`, { repo: e, action: R, id: ue }), R === "use" && (await a(), d((xt) => xt + 1)), !0;
    } catch (xt) {
      return ke = ut(xt, R === "use" ? "use the draft" : "drop the draft"), !1;
    } finally {
      Ge(!1);
      const xt = await x.refresh();
      ke && Le({ id: ((ps = xt == null ? void 0 : xt.draft) == null ? void 0 : ps.id) ?? null, text: ke });
    }
  }, To = async (R, ue) => {
    try {
      return await o.post(`${lt}/regions`, { repo: e, id: R, region: ue }), d((ke) => ke + 1), null;
    } catch (ke) {
      return ut(ke, "save the region");
    }
  }, Ht = (R) => {
    tt("data"), j(R);
  }, bt = (R) => {
    tt("map"), K(R);
  }, un = (R) => {
    Te(R.on), K(R.focus), Ee.current = R.before;
  }, fn = (R) => {
    Q(null), tt("map"), un(Fu({ on: _e, focus: q, before: Ee.current }, R, G === "map"));
  }, Lo = () => {
    const R = Vu({ on: _e, focus: q, before: Ee.current });
    R.closeSavedView && Q(null), un(R);
  }, zo = (R) => {
    G === "data" && R.startsWith("table:") ? j(R) : bt(R);
  }, Qn = (R) => {
    R.startsWith("table:") ? Ht(R) : bt(R);
  }, Jn = () => {
    rn.current = !0, Lu(localStorage, !yt), co(!yt);
  }, er = Tu(G), vt = er && yt, tr = G === "map" ? "modules" : "tables", hn = er && !yt && Pt >= Vr ? /* @__PURE__ */ k("button", { ref: nn, type: "button", className: "sm-plain sm-layers sm-show-list", onClick: Jn, children: [
    "Show ",
    tr
  ] }) : null, nr = (De == null ? void 0 : De.title) ?? (F == null ? void 0 : F.title), rr = nr ? /* @__PURE__ */ u(R_, { title: nr, onBack: Mo }) : null, pn = ck.map((R) => ({ ...R, count: yo[R.value] || void 0 })), Ce = i == null ? void 0 : i.freshness, or = Ce ? Su(Nu(Ce), Ce.commits_behind, Ce.ref) : null, gn = ((hs = Ce == null ? void 0 : Ce.changed_inputs) == null ? void 0 : hs.length) ?? 0, Xd = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      hn,
      /* @__PURE__ */ u(
        D_,
        {
          layers: [
            S1(qn, Z, () => te((R) => !R)),
            { key: "risk", label: "Risk", on: ne, title: "Mark hot and untested code on the map", onToggle: () => re((R) => !R) },
            { key: "work", label: "Worktrees", on: se, title: "Show what each worktree is changing", onToggle: () => de((R) => !R) },
            {
              key: "agents",
              label: "Agents",
              on: _e && y,
              disabled: !y,
              title: y ? "Show the agents: what starts each one, who it hands work to, and the models it uses" : "No agents yet. Point System Map at them in the Agents tab.",
              onToggle: Lo
            }
          ]
        }
      )
    ] }),
    rr
  ] }), Ud = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      hn,
      /* @__PURE__ */ u(
        eu,
        {
          ariaLabel: "How much of each table to show",
          layoutId: "system-map-density",
          collapse: !1,
          segments: lk,
          value: jn,
          onChange: (R) => lo(R)
        }
      )
    ] }),
    rr
  ] }), cs = {
    map: ln !== null,
    data: !!cn,
    plan: E !== null,
    risk: T !== null,
    worktrees: B !== null,
    findings: C !== null,
    agents: _ !== null,
    explore: H.value !== null
  }, ds = {
    map: p.failed,
    data: h.failed,
    plan: g.failed,
    risk: v.failed,
    worktrees: L.failed,
    findings: b.failed,
    agents: m.failed,
    explore: H.failed
  }, qd = () => {
    d((R) => R + 1), L.refresh(), H.refresh();
  }, us = Cu({ projects: t, activeKey: e, onPick: n, onReload: () => void r() }), Kd = /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }, children: [
    /* @__PURE__ */ u("span", { style: { whiteSpace: "nowrap" }, children: "System Map" }),
    /* @__PURE__ */ u("span", { "aria-hidden": "true", style: { ...Y, fontWeight: 400 }, children: "/" }),
    us.menu
  ] });
  return /* @__PURE__ */ k(me, { children: [
    us.dialogs,
    /* @__PURE__ */ u(
      Ii,
      {
        title: Kd,
        actions: i && or ? /* @__PURE__ */ u(
          T1,
          {
            status: or,
            detail: Ce != null && Ce.stale ? `${gn} schema ${gn === 1 ? "file" : "files"} changed on ${Ce.ref}` : void 0,
            commit: i.manifest.commit,
            builtAt: i.manifest.built_at,
            read: i.manifest.read,
            busy: uo,
            result: on,
            onRebuild: () => void wo()
          }
        ) : void 0
      }
    ),
    /* @__PURE__ */ k("div", { ref: fo, className: "sm-page", style: { height: ho, display: "flex", flexDirection: "column", gap: qa, minHeight: 0 }, children: [
      s && !i && /* @__PURE__ */ k(wr, { children: [
        s,
        " ",
        /* @__PURE__ */ u(ie, { onClick: () => void a(), children: "Try again" })
      ] }),
      !i && !s && /* @__PURE__ */ u(ii, { rows: 6 }),
      Ot && /* @__PURE__ */ u(wr, { onDismiss: () => et(null), children: Ot }),
      an && i && /* @__PURE__ */ k(wr, { children: [
        "The folder for this project is gone: ",
        /* @__PURE__ */ u("span", { className: "sm-mono", children: i.manifest.repo }),
        ". You can still read the last model. To go on, move the folder back, or remove the project from the project menu."
      ] }),
      i && /* @__PURE__ */ k(me, { children: [
        /* @__PURE__ */ u(K1, { items: pn, value: G, onChange: tt, label: "System Map views" }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: qa,
              gridTemplateColumns: l1(Pt, vt),
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              vt && Pt >= Vr && /* @__PURE__ */ k(Oo, { style: oi, "data-testid": "side-list", children: [
                /* @__PURE__ */ k("div", { className: "sm-list-head", children: [
                  /* @__PURE__ */ u(gs, { children: G === "map" ? "Modules" : "Tables" }),
                  /* @__PURE__ */ u("button", { ref: nn, type: "button", className: "sm-plain sm-hide-list", "aria-label": `Hide ${tr}`, onClick: Jn, children: "Hide" })
                ] }),
                G === "map" ? /* @__PURE__ */ u(Mu, { nodes: (N == null ? void 0 : N.nodes) ?? [], focus: q, onSelect: bt }) : /* @__PURE__ */ u($u, { tables: i.tables, selected: W, flagged: Xn, working: Un, onSelect: Ht })
              ] }),
              /* @__PURE__ */ k(
                Oo,
                {
                  style: { ...oi, padding: 0, position: "relative" },
                  "data-testid": "canvas",
                  id: Fd,
                  role: "tabpanel",
                  "aria-labelledby": `system-map-tab-${G}`,
                  children: [
                    !cs[G] && !ds[G] && /* @__PURE__ */ u(ii, { rows: 6 }),
                    !cs[G] && ds[G] && /* @__PURE__ */ u("div", { style: { padding: 12 }, children: /* @__PURE__ */ k(wr, { children: [
                      "Couldn't load this view. ",
                      /* @__PURE__ */ u(ie, { onClick: qd, children: "Try again" })
                    ] }) }),
                    G === "map" && ln && /* @__PURE__ */ u(
                      X1,
                      {
                        system: ln,
                        focus: q,
                        tables: i.manifest.counts.tables,
                        showPlans: Z,
                        inspecting: wt !== null,
                        risk: ne ? T : null,
                        worktrees: se ? B : null,
                        only: (F == null ? void 0 : F.level) === "map" ? F.resolved : null,
                        layout: (F == null ? void 0 : F.layout) ?? "left-right",
                        agents: _e && y,
                        tools: Xd,
                        onFocus: (R) => {
                          Q(null), K(R);
                        },
                        onOpenTables: () => tt("data")
                      }
                    ),
                    G === "data" && i.tables.length === 0 && !V && /* @__PURE__ */ u(hk, { read: i.manifest.read }),
                    G === "data" && cn && (i.tables.length > 0 || V) && /* @__PURE__ */ u(X_, { graph: cn, selected: W, flagged: Xn, working: Un, density: jn, tools: Ud, onSelect: j }),
                    G === "explore" && H.value && /* @__PURE__ */ u(
                      o1,
                      {
                        data: H.value,
                        proposal: P,
                        shownProposal: V ? S : null,
                        canAsk: pe.canAsk,
                        tab: $,
                        onTab: M,
                        onSend: pe.send,
                        onOpenProposal: z,
                        onDrawProposal: Zn,
                        onStatus: (R, ue) => void So(R, ue),
                        onDelete: (R, ue) => void No(R, ue),
                        onOpenView: Co,
                        onNode: Qn
                      }
                    ),
                    G === "plan" && E && /* @__PURE__ */ u(E1, { plans: A, onShow: bt, onAsk: bo, onStatus: (R, ue) => void $o(R, ue) }),
                    G === "risk" && T && /* @__PURE__ */ u(
                      A1,
                      {
                        risk: T,
                        canAsk: pe.canAsk,
                        error: Pe,
                        onShow: bt,
                        onAsk: vo,
                        onLoad: () => void Eo(),
                        onRun: ko
                      }
                    ),
                    G === "worktrees" && B && /* @__PURE__ */ u(rk, { state: B, checkedAt: L.checkedAt, canAsk: pe.canAsk, onShow: Qn, onAsk: _o }),
                    G === "findings" && C && /* @__PURE__ */ u(
                      s1,
                      {
                        findings: O,
                        noSchema: i.tables.length === 0,
                        onShow: (R) => R.startsWith("agent:") ? fn(R) : Ht(R),
                        onAsk: dn
                      }
                    ),
                    G === "agents" && _ && /* @__PURE__ */ u(
                      cf,
                      {
                        state: _,
                        draft: x.value,
                        canAsk: pe.canAsk,
                        saving: Oe,
                        error: Je,
                        draftError: Ne,
                        onShow: fn,
                        onAsk: xo,
                        onSave: Io,
                        onFind: () => pe.send(Ku),
                        onDraft: Ao
                      }
                    ),
                    Dt && wt && /* @__PURE__ */ u(
                      b1,
                      {
                        node: Dt,
                        work: (B == null ? void 0 : B.by_node[wt]) ?? [],
                        overlaps: Iu(wt, B),
                        canAsk: pe.canAsk,
                        onAsk: Kn,
                        onAskFinding: dn,
                        onOpen: (R) => R.startsWith("agent:") ? fn(R) : zo(R),
                        onClose: () => G === "data" ? j(null) : K(null),
                        onRegion: To
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ k(Oo, { style: Pt >= Bd ? oi : { display: "none" }, children: [
                /* @__PURE__ */ u(gs, { children: "Design chat" }),
                pe.error && /* @__PURE__ */ u("p", { style: { fontSize: 13 }, children: pe.error }),
                an && /* @__PURE__ */ u("p", { style: { ...Y, fontSize: 13 }, children: "Chat needs this project's folder." }),
                /* @__PURE__ */ k("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: [
                  pe.slot && /* @__PURE__ */ u("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ u(Jd, { slotKey: pe.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }),
                  pe.startable && /* @__PURE__ */ u(uk, { disabled: pe.opening, onSend: pe.send })
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
  Nk as default
};
