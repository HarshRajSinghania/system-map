import { jsxs as h, jsx as l, Fragment as B } from "react/jsx-runtime";
import { SearchInput as U, Badge as ue, Modal as pe, Input as _e, Btn as W } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as N, useEffect as k, useRef as L } from "react";
import { useAppApi as S } from "@kirocrew/app-sdk";
const ie = "system-map-chrome-css", Ne = `
.sm-page { padding: 0 16px; }
@media (min-width: 768px) { .sm-page { padding: 0 24px; } }
.sm-plain { background: none; border: 0; margin: 0; padding: 0; color: inherit; font: inherit; cursor: pointer; }
.sm-plain:disabled { cursor: default; opacity: .6; }
.sm-plain:focus-visible, .sm-focus:focus-visible { outline: 2px solid var(--accent, #2f7d5c); outline-offset: 2px; }
.sm-project { display: inline-flex; align-items: center; gap: 6px; min-width: 0; padding: 2px 8px; margin-left: -2px; border-radius: 8px; }
.sm-project:hover, .sm-project[aria-expanded="true"] { background: var(--bg-hover, #f4f4f5); }
.sm-project.sm-compact { font-size: 13px; font-weight: 600; padding: 3px 6px; margin-left: -6px; max-width: 100%; }
.sm-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.sm-pop {
  position: absolute; z-index: 60; box-sizing: border-box; padding: 6px; border-radius: 10px; outline: none;
  background: var(--bg-elevated, #fff); color: var(--text, #18181b); border: 1px solid var(--border-strong, #a1a1aa);
  box-shadow: 0 10px 28px rgba(0, 0, 0, .22); font-size: 13px; font-weight: 400; letter-spacing: normal; line-height: 1.35;
}
.sm-list { list-style: none; margin: 6px 0 0; padding: 0; max-height: 260px; overflow-y: auto; }
.sm-row { display: flex; align-items: center; gap: 8px; box-sizing: border-box; width: 100%; padding: 7px 9px; border-radius: 6px; text-align: left; font-size: 13px; cursor: pointer; }
.sm-row:hover, .sm-row[data-active="true"] { background: var(--bg-hover, #f4f4f5); }
.sm-row[aria-selected="true"] { background: var(--accent-subtle, rgba(47, 125, 92, .18)); }
.sm-rule { height: 1px; margin: 6px 2px; background: var(--border, #e4e4e7); }
.sm-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--muted, #71717a); }
.sm-dot[data-tone="ok"] { background: var(--ok, #16a34a); }
.sm-dot[data-tone="warn"] { background: var(--warn, #d97706); }
.sm-dot[data-tone="err"] { background: var(--danger, #dc2626); }
.sm-bar { display: flex; align-items: stretch; gap: 16px; border-bottom: 1px solid var(--border, #e4e4e7); min-height: 34px; }
.sm-tabs { display: flex; gap: 16px; align-items: stretch; min-width: 0; }
.sm-tab { display: inline-flex; align-items: center; gap: 5px; padding: 6px 1px 5px; margin-bottom: -1px; font-size: 13px; color: var(--muted, #71717a); border-bottom: 2px solid transparent; white-space: nowrap; }
.sm-tab:hover { color: var(--text, #18181b); }
.sm-tab[aria-selected="true"] { color: var(--text-strong, var(--text, #18181b)); font-weight: 600; border-bottom-color: var(--accent, #2f7d5c); }
.sm-tab-probe { position: absolute; visibility: hidden; height: 0; overflow: hidden; display: flex; gap: 16px; pointer-events: none; }
.sm-tab-probe .sm-tab { font-weight: 600; }
.sm-count { display: inline-block; min-width: 8px; padding: 0 5px; border-radius: 9px; font-size: 11px; font-weight: 500; text-align: center; background: var(--bg-hover, #f4f4f5); color: var(--muted, #71717a); }
.sm-chip { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid var(--border, #e4e4e7); border-radius: 14px; background: var(--card, #fff); color: var(--text, #18181b); font-size: 13px; white-space: nowrap; }
.sm-chip:hover, .sm-chip[aria-expanded="true"] { border-color: var(--border-strong, #a1a1aa); }
.sm-tools { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.sm-layers { display: flex; align-items: center; gap: 3px; padding: 3px 4px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; background: var(--bg-elevated, #fff); color: var(--text, #18181b); font-size: 12px; }
.sm-layers-label { padding: 0 5px; color: var(--muted, #71717a); }
.sm-layer { padding: 3px 8px; border-radius: 6px; color: var(--muted, #71717a); white-space: nowrap; }
.sm-layer:hover { background: var(--bg-hover, #f4f4f5); }
.sm-layer[aria-pressed="true"] { background: var(--accent-subtle, rgba(47, 125, 92, .18)); color: var(--text, #18181b); }
.sm-layer:disabled, .sm-layer:disabled:hover { background: none; color: var(--muted, #71717a); opacity: .5; cursor: default; }
.sm-tool-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.sm-show-list { padding: 5px 10px; white-space: nowrap; color: var(--muted, #71717a); }
.sm-show-list:hover { color: var(--text, #18181b); border-color: var(--border-strong, #a1a1aa); }
.sm-list-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.sm-hide-list { padding: 1px 6px; border-radius: 6px; font-size: 12px; color: var(--muted, #71717a); }
.sm-hide-list:hover { background: var(--bg-hover, #f4f4f5); color: var(--text, #18181b); }
.sm-notice { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; background: var(--bg-elevated, #fff); color: var(--text, #18181b); font-size: 13px; }
.sm-manage { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.sm-manage-row { padding: 10px 12px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; font-size: 13px; }
.sm-mono { font-family: var(--mono, ui-monospace, Menlo, monospace); font-size: 12px; }
.sm-link { color: var(--accent, #2f7d5c); font-size: 13px; white-space: nowrap; }
.sm-link:hover { text-decoration: underline; }
.sm-add-list { max-height: min(340px, 46vh); margin: 0; }
.sm-add-head { padding: 8px 9px 2px; font-size: 12px; color: var(--muted, #71717a); }
.sm-row[aria-disabled="true"] { cursor: default; opacity: .6; }
.sm-row-action { display: none; color: var(--accent, #2f7d5c); font-weight: 600; white-space: nowrap; }
.sm-row[data-active="true"] .sm-row-action { display: inline; }
.sm-add-empty { display: grid; justify-items: center; gap: 10px; padding: 24px 12px; text-align: center; font-weight: 600; }
`;
if (!document.getElementById(ie)) {
  const e = document.createElement("style");
  e.id = ie, e.textContent = Ne, document.head.appendChild(e);
}
const Ae = /^API (\d{3}): ([\s\S]*)$/;
function We(e) {
  const t = e ?? {};
  if (typeof t.status == "number") return { status: t.status, body: t.body ?? "" };
  const r = Ae.exec(typeof t.message == "string" ? t.message : "");
  return r ? { status: Number(r[1]), body: r[2] } : { status: null, body: "" };
}
function Ee(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.error == "string" && t.error ? t.error : null;
  } catch {
    return null;
  }
}
function j(e, t) {
  const { status: r, body: i } = We(e);
  if (r === null) return `Couldn't ${t}. Check the dashboard is still connected, then try again.`;
  if (r === 400 || r === 404) {
    const s = Ee(i);
    if (s) return s;
  }
  return r === 401 || r === 403 ? `Couldn't ${t}, because System Map isn't allowed to. Check its permissions on its Details page.` : r >= 500 ? `Couldn't ${t}, because System Map's backend isn't answering. Try again in a moment.` : `Couldn't ${t}. Try again.`;
}
const x = "/apps/system-map/api";
function P(e, t) {
  return t ? `${x}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${x}${e}`;
}
const q = "system-map.repo", Y = "system-map:project";
function xt() {
  var p, u;
  const e = S(), [t, r] = g([]), [i, s] = g(!1), [n, c] = g(() => localStorage.getItem(q)), a = N(async () => {
    try {
      const f = await e.get(`${x}/repos`);
      r(f.repos);
    } catch {
      r([]);
    } finally {
      s(!0);
    }
  }, [e]);
  k(() => {
    a();
  }, [a]), k(() => {
    const f = () => {
      c(localStorage.getItem(q)), a();
    };
    return window.addEventListener(Y, f), () => window.removeEventListener(Y, f);
  }, [a]);
  const o = N((f) => {
    localStorage.setItem(q, f), window.dispatchEvent(new Event(Y));
  }, []), d = ((p = t.find((f) => f.repo_key === n)) == null ? void 0 : p.repo_key) ?? ((u = t[0]) == null ? void 0 : u.repo_key) ?? null;
  return { repos: t, active: d, loaded: i, choose: o, reload: a };
}
function kt(e) {
  const t = S(), [r, i] = g(null), [s, n] = g(null), c = L(e);
  c.current = e;
  const a = N(async () => {
    if (!e) {
      i(null);
      return;
    }
    try {
      const o = await t.get(P("/overview", e));
      if (c.current !== e) return;
      i(o), n(null);
    } catch (o) {
      if (c.current !== e) return;
      i(null), n(j(o, "load this project"));
    }
  }, [t, e]);
  return k(() => {
    n(null), a();
  }, [a]), { overview: (r == null ? void 0 : r.manifest.repo_key) === e ? r : null, error: s, refresh: a };
}
function $t(e, t, r) {
  const i = S(), [s, n] = g({ repo: t, value: null, failed: !1 });
  return k(() => {
    if (!r) return;
    let c = !0;
    return i.get(P(e, t)).then((a) => {
      c && n({ repo: t, value: a, failed: !1 });
    }).catch(() => {
      c && n({ repo: t, value: null, failed: !0 });
    }), () => {
      c = !1;
    };
  }, [i, e, t, r]), s.repo === t ? { value: s.value, failed: s.failed } : { value: null, failed: !1 };
}
function St(e, t, r) {
  const i = S(), [s, n] = g(null);
  return k(() => {
    if (!e) {
      n(null);
      return;
    }
    let c = !0;
    return i.get(P(`/proposal?id=${encodeURIComponent(e)}`, t)).then((a) => {
      c && n(a);
    }).catch(() => {
      c && n(null);
    }), () => {
      c = !1;
    };
  }, [i, e, t, r]), s;
}
function Ct(e, t, r) {
  const i = S(), [s, n] = g({ repo: t, value: null, failed: !1 }), [c, a] = g(null), o = L(t);
  o.current = t;
  const d = N(async () => {
    if (!t) return null;
    try {
      const u = await i.get(P(e, t));
      return o.current !== t ? null : (n({ repo: t, value: u, failed: !1 }), a(Date.now()), u);
    } catch {
      return o.current === t && n({ repo: t, value: null, failed: !0 }), null;
    }
  }, [i, e, t]);
  k(() => {
    d();
    const u = window.setInterval(() => {
      document.visibilityState === "visible" && d();
    }, r);
    return () => window.clearInterval(u);
  }, [d, r]);
  const p = s.repo === t;
  return { value: p ? s.value : null, failed: p && s.failed, checkedAt: c, refresh: d };
}
function It(e, t = null, r) {
  const i = S(), [s, n] = g(null);
  return k(() => {
    if (!e) {
      n(null);
      return;
    }
    let c = !0;
    return i.get(P(`/node?id=${encodeURIComponent(e)}`, t)).then((a) => {
      c && n(a);
    }).catch(() => {
      c && n(null);
    }), () => {
      c = !1;
    };
  }, [i, e, t, r]), s;
}
const _t = 200, Nt = 58, fe = /* @__PURE__ */ new Set(["starts", "hands_off_to", "uses_model"]), Le = /* @__PURE__ */ new Set(["planned", "partial"]), ee = "group:tables", I = "group:routes", D = "group:jobs", O = (e, t, r) => `${e} ${e === 1 ? t : r}`;
function ae(e) {
  const t = e.files ?? 0, r = e.test_files ?? 0;
  return t === 0 && r > 0 ? { count: r, title: O(r, "test file", "test files") } : { count: t, title: O(t, "file", "files") };
}
function oe(e) {
  const t = e.files ?? 0, r = e.test_files ?? 0;
  return t === 0 && r > 0 ? O(r, "test file", "test files") : `${O(t, "file", "files")}, ${O(e.lines ?? 0, "line", "lines")}`;
}
function F(e) {
  return e === "." ? "root files" : e.replace(/^src\//, "");
}
const je = {
  "@openai/agents": "OpenAI Agents",
  "@mastra/core": "Mastra",
  "@anthropic-ai/claude-agent-sdk": "Claude Agent SDK"
};
function De(e) {
  var r;
  if (e.source === "sdk" && e.sdk) return je[e.sdk] ?? e.sdk;
  const t = ((r = e.jobs) == null ? void 0 : r.length) ?? 0;
  return `${t} ${t === 1 ? "job" : "jobs"}`;
}
function J(e) {
  var t;
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : F(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: F(e.path ?? e.name), subtitle: oe(e) };
    case "module": {
      const r = e.area === `area:${e.path}`;
      return {
        id: e.id,
        kind: "module",
        title: r ? `${e.name} (top level)` : e.name,
        subtitle: oe(e)
      };
    }
    case "plan":
      return { id: e.id, kind: "plan", title: e.name, subtitle: `${e.missing} of ${(e.found ?? 0) + (e.missing ?? 0)} missing`, status: e.status };
    case "route":
      return { id: e.id, kind: "route", title: e.name, subtitle: e.route_kind === "api" ? "API" : "page" };
    case "job":
      return { id: e.id, kind: "job", title: e.name, subtitle: e.schedule };
    case "service":
      return { id: e.id, kind: "service", title: e.name, subtitle: "outside" };
    case "agent":
      return {
        id: e.id,
        kind: "agent",
        title: e.label ?? e.name,
        subtitle: De(e),
        status: e.status === "built" ? void 0 : e.status,
        badge: (t = e.asks_you) != null && t.length ? "asks you" : void 0
      };
    default:
      return { id: e.id, kind: e.kind, title: e.name };
  }
}
function H(e, t) {
  const r = e.nodes.filter((c) => c.kind === "route"), i = r.filter((c) => c.route_kind === "api").length, s = e.nodes.filter((c) => c.kind === "job").length, n = [];
  return r.length && n.push({ id: I, kind: "group", title: "Routes", subtitle: `${r.length - i} pages, ${i} API` }), t && n.push({ id: ee, kind: "group", title: "Database", subtitle: `${t} ${t === 1 ? "table" : "tables"}` }), s && n.push({ id: D, kind: "group", title: "Scheduled jobs", subtitle: `${s} jobs` }), n;
}
function ze(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const Me = 3, Re = 24;
function me(e, t) {
  return !!(e && t && (e === t || e.startsWith(`${t}/`)));
}
function le(e, t) {
  if (e.startsWith("table:")) return ee;
  const r = t.byId.get(e);
  return r ? r.status === "proposed" ? e : (r.kind === "module" || r.kind === "area") && me(r.path, t.routesDir) ? I : r.kind === "module" ? r.area === t.open ? e : r.area ?? e : r.kind === "route" ? t.expanded === I ? e : I : r.kind === "job" ? t.expanded === D ? e : D : e : null;
}
function he(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !Le.has(e.status));
}
function te(e, t, r, i) {
  const s = /* @__PURE__ */ new Map();
  for (const n of e.edges) {
    if (he(t.byId.get(n.source), r)) continue;
    const c = le(n.source, t), a = le(n.target, t);
    if (!c || !a || c === a || !i(c, a)) continue;
    const o = `${c}|${a}|${n.kind}`, d = s.get(o);
    d ? d.count += n.count : s.set(o, { id: o, source: c, target: a, kind: n.kind, count: n.count, proposed: n.proposed });
  }
  return [...s.values()];
}
function T(e, t, r) {
  const i = [];
  for (const s of e) {
    const n = r.find((a) => a.id === s), c = t.byId.get(s);
    n ? i.push(n) : c ? i.push(J(c)) : s.startsWith("table:") && i.push(ze(s));
  }
  return i;
}
function Oe(e, t, r, i) {
  const s = H(e, r), n = te(e, t, i, () => !0), c = n.length <= Re ? n : n.filter((o) => o.kind !== "imports" || o.count >= Me), a = new Set(s.map((o) => o.id));
  for (const o of e.nodes)
    o.kind === "area" && !me(o.path, t.routesDir) && a.add(o.id), o.kind === "service" && a.add(o.id), o.kind === "plan" && !he(o, i) && a.add(o.id), o.status === "proposed" && a.add(o.id);
  return { cards: T(a, t, s), lines: c.filter((o) => a.has(o.source) && a.has(o.target)), hidden: n.length - c.length };
}
function Pe(e, t, r, i) {
  const s = new Set(e.nodes.filter((a) => a.area === t.open && a.kind === "module").map((a) => a.id)), n = te(
    e,
    t,
    i,
    (a, o) => (s.has(a) || s.has(o)) && !a.startsWith("area:") && !o.startsWith("area:")
  ), c = new Set(s);
  for (const a of n)
    c.add(a.source), c.add(a.target);
  return { cards: T(c, t, H(e, r)), lines: n };
}
function Te(e, t, r, i) {
  const s = t.expanded === I ? "route" : "job", n = new Set(e.nodes.filter((o) => o.kind === s).map((o) => o.id)), c = te(e, t, i, (o, d) => n.has(o) || n.has(d)), a = new Set(n);
  for (const o of c)
    a.add(o.source), a.add(o.target);
  return { cards: T(a, t, H(e, r)), lines: c };
}
function Fe(e, t, r) {
  const i = [], s = /* @__PURE__ */ new Set([r]);
  for (const n of e.edges)
    n.source !== r && n.target !== r || (s.add(n.source), s.add(n.target), i.push({ id: `${n.source}|${n.target}|${n.kind}`, source: n.source, target: n.target, kind: n.kind, count: n.count }));
  return { cards: T(s, t, []), lines: i };
}
function At(e, t, r) {
  const i = new Map(e.nodes.map((a) => [a.id, a])), s = new Set(t), n = /* @__PURE__ */ new Map();
  for (const a of e.edges) {
    if (!s.has(a.source) || !s.has(a.target)) continue;
    const o = `${a.source}|${a.target}|${a.kind}`;
    n.set(o, { id: o, source: a.source, target: a.target, kind: a.kind, count: a.count, proposed: a.proposed });
  }
  return { cards: T(s, { byId: i }, H(e, r)), lines: [...n.values()] };
}
function ge(e) {
  if (e.routes_dir) return e.routes_dir;
  const t = e.nodes.find((i) => i.kind === "route"), r = t == null ? void 0 : t.evidence[0];
  return r ? r.slice(0, r.lastIndexOf("/")) : null;
}
function Be(e) {
  const t = new Set(e.nodes.filter((i) => i.kind === "agent").map((i) => i.id));
  if (t.size === 0) return e;
  const r = (i) => !fe.has(i.kind) && !t.has(i.source) && !t.has(i.target);
  return { ...e, nodes: e.nodes.filter((i) => !t.has(i.id)), edges: e.edges.filter(r) };
}
function Ue(e, t) {
  return e.trim().toLowerCase() === t.trim().toLowerCase();
}
function He(e) {
  const t = new Map(e.nodes.map((d) => [d.id, d])), r = e.nodes.filter((d) => d.kind === "agent").map((d) => d.id), i = new Set(r), s = /* @__PURE__ */ new Map();
  for (const d of e.edges) {
    if (!fe.has(d.kind) || !(t.has(d.source) && t.has(d.target)) || !r.includes(d.source) && !r.includes(d.target)) continue;
    i.add(d.source), i.add(d.target);
    const p = `${d.source}|${d.target}|${d.kind}`, u = s.get(p);
    u ? u.count += d.count : s.set(p, { id: p, source: d.source, target: d.target, kind: d.kind, count: d.count, leaves: d.leaves_region || void 0 });
  }
  const n = e.home_region ?? null, c = /* @__PURE__ */ new Map(), a = [...i].map((d) => {
    const p = t.get(d);
    if (p.kind !== "service") return J(p);
    if (p.region) {
      const u = p.region.trim().toLowerCase(), f = c.get(u) ?? { region: p.region.trim(), members: [] };
      c.set(u, { ...f, members: [...f.members, d] });
    }
    return { ...J(p), subtitle: p.region ?? "no region set", strong: !0 };
  }), o = [...c].map(([d, { region: p, members: u }]) => {
    const f = n ? Ue(p, n) ? "home" : "away" : "unknown";
    return { id: `band:${d}`, label: f === "home" ? `${p} · home` : p, tone: f, members: u };
  });
  return { cards: a, lines: [...s.values()], bands: o };
}
function Wt(e, t, r, i, s = !1) {
  if (s) return He(e);
  e = Be(e);
  const n = new Map(e.nodes.map((u) => [u.id, u])), c = ge(e), a = t === `area:${c}` ? I : t, o = a != null && a.startsWith("area:") ? a : null, d = a === I || a === D ? a : null, p = { byId: n, open: o, expanded: d, routesDir: c };
  return a ? o ? Pe(e, p, r, i) : d ? Te(e, p, r, i) : Fe(e, p, a) : Oe(e, p, r, i);
}
function Et(e, t, r = !1) {
  const i = [{ id: null, label: r ? "Agents" : "System" }];
  if (!t) return i;
  if (r) {
    const n = e.nodes.find((c) => c.id === t);
    return n ? [...i, { id: t, label: n.label ?? n.name }] : i;
  }
  if (t === I || t === `area:${ge(e)}`) return [...i, { id: t, label: "Routes" }];
  if (t === D) return [...i, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...i, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const s = e.nodes.find((n) => n.id === t);
  if (!s) return i;
  if (s.kind === "area") return [...i, { id: t, label: F(s.path ?? s.name) }];
  if (s.kind === "module") {
    const n = e.nodes.find((c) => c.id === s.area);
    return [
      ...i,
      { id: s.area ?? null, label: F((n == null ? void 0 : n.path) ?? "") },
      { id: t, label: s.name }
    ];
  }
  return s.kind === "route" ? [...i, { id: I, label: "Routes" }, { id: t, label: s.name }] : s.kind === "job" ? [...i, { id: D, label: "Scheduled jobs" }, { id: t, label: s.name }] : [...i, { id: t, label: s.name }];
}
const Q = { fontFamily: "var(--mono, ui-monospace, monospace)" }, y = { color: "var(--muted, #71717a)" }, Ke = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function Ve({ severity: e }) {
  return /* @__PURE__ */ l("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ l(ue, { variant: Ke[e], children: e }) });
}
function Lt({
  tables: e,
  selected: t,
  flagged: r,
  working: i,
  onSelect: s
}) {
  const [n, c] = g(""), a = e.filter((o) => o.name.includes(n.trim().toLowerCase()));
  return /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ l(
      U,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: n,
        onChange: (o) => c(o.target.value)
      }
    ),
    /* @__PURE__ */ l("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: a.map((o) => /* @__PURE__ */ h(
      "button",
      {
        onClick: () => s(o.id),
        style: {
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          boxSizing: "border-box",
          padding: "4px 8px",
          border: 0,
          borderRadius: 6,
          cursor: "pointer",
          textAlign: "left",
          fontSize: 13,
          color: "var(--text, inherit)",
          background: o.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
        },
        children: [
          /* @__PURE__ */ l("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.name }),
          /* @__PURE__ */ h("span", { style: { ...y, display: "flex", gap: 6, flexShrink: 0 }, children: [
            i != null && i.get(o.id) ? /* @__PURE__ */ h(
              "span",
              {
                title: "Worktrees changing this table or its code",
                style: { color: (i.get(o.id) ?? 0) > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" },
                children: [
                  i.get(o.id),
                  " at work"
                ]
              }
            ) : null,
            r != null && r.get(o.id) ? /* @__PURE__ */ l("span", { title: `${r.get(o.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: r.get(o.id) }) : null,
            /* @__PURE__ */ l("span", { title: `${o.columns} columns`, children: o.columns })
          ] })
        ]
      },
      o.id
    )) })
  ] });
}
function A({ title: e, children: t }) {
  return /* @__PURE__ */ h("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ l("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const R = { margin: 0, paddingLeft: 16 };
function jt({
  nodes: e,
  focus: t,
  onSelect: r
}) {
  const [i, s] = g(""), n = i.trim().toLowerCase(), c = e.filter((d) => d.kind === "area").sort((d, p) => (p.lines ?? 0) - (d.lines ?? 0)), a = e.filter((d) => d.kind === "module"), o = (d, p, u) => /* @__PURE__ */ h(
    "button",
    {
      onClick: () => r(d.id),
      style: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        padding: `3px 8px 3px ${8 + p * 14}px`,
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        fontWeight: p === 0 ? 600 : 400,
        color: "var(--text, inherit)",
        background: d.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ l("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u }),
        /* @__PURE__ */ l("span", { style: { ...y, fontWeight: 400, flexShrink: 0 }, title: ae(d).title, children: ae(d).count })
      ]
    },
    d.id
  );
  return /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ l(U, { "aria-label": "Filter modules", placeholder: "Filter modules", value: i, onChange: (d) => s(d.target.value) }),
    /* @__PURE__ */ l("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: c.map((d) => {
      const p = a.filter((m) => m.area === d.id && m.path !== d.path), u = p.filter((m) => m.name.toLowerCase().includes(n)), f = n !== "" || t === d.id || p.some((m) => m.id === t);
      return n && u.length === 0 && !d.name.toLowerCase().includes(n) ? null : /* @__PURE__ */ h("div", { children: [
        o(d, 0, d.path === "." ? d.name : (d.path ?? d.name).replace(/^src\//, "")),
        f && u.map((m) => o(m, 1, m.name))
      ] }, d.id);
    }) })
  ] });
}
function Ge({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ l(B, { children: e.map((r) => /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ l(Ve, { severity: r.severity }),
    /* @__PURE__ */ l("span", { style: { flex: 1 }, children: r.title }),
    t && /* @__PURE__ */ l("button", { onClick: () => t(r), style: qe, children: "Ask" })
  ] }, r.id)) });
}
const qe = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function Dt({ node: e, onAsk: t }) {
  const r = e.constraints.filter((s) => s.kind !== "check"), i = e.constraints.filter((s) => s.kind === "check");
  return /* @__PURE__ */ h("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ l("p", { style: { ...y, ...Q, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ l(A, { title: "Findings", children: /* @__PURE__ */ l(Ge, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ l(A, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ l("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ l("tbody", { children: e.columns.map((s) => /* @__PURE__ */ h("tr", { title: s.source, children: [
      /* @__PURE__ */ l("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: s.name }),
      /* @__PURE__ */ l("td", { style: { ...y, ...Q, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: s.type }),
      /* @__PURE__ */ l("td", { style: { ...y, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: s.nullable ? "null" : "not null" })
    ] }, s.name)) }) }) }),
    r.length > 0 && /* @__PURE__ */ l(A, { title: "Keys", children: /* @__PURE__ */ l("ul", { style: R, children: r.map((s) => /* @__PURE__ */ h("li", { title: s.source, children: [
      s.kind.replace("_", " "),
      " (",
      s.columns.join(", "),
      ")",
      s.references ? ` to ${s.references}, on delete ${s.on_delete}` : ""
    ] }, s.name)) }) }),
    i.length > 0 && /* @__PURE__ */ l(A, { title: "Checks", children: /* @__PURE__ */ l("ul", { style: R, children: i.map((s) => /* @__PURE__ */ l("li", { title: s.source, style: { ...Q, fontSize: 12, overflowWrap: "anywhere" }, children: s.expression }, s.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ l(A, { title: "Indexes", children: /* @__PURE__ */ l("ul", { style: R, children: e.indexes.map((s) => /* @__PURE__ */ h("li", { title: s.source, children: [
      s.name,
      " (",
      s.columns.join(", "),
      ")",
      s.unique ? ", unique" : "",
      s.partial ? ", partial" : ""
    ] }, s.name)) }) }),
    e.schema !== "main" && /* @__PURE__ */ l(A, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ l("ul", { style: R, children: e.policies.map((s) => /* @__PURE__ */ h("li", { title: s.source, children: [
      s.name,
      ": ",
      s.command,
      " for ",
      s.roles.join(", ")
    ] }, s.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ l(A, { title: "Triggers", children: /* @__PURE__ */ l("ul", { style: R, children: e.triggers.map((s) => /* @__PURE__ */ h("li", { title: s.source, children: [
      s.name,
      ": ",
      s.timing,
      " ",
      s.events.join(", ")
    ] }, s.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ l(A, { title: "Notes", children: e.reads.map((s, n) => /* @__PURE__ */ l("p", { style: { margin: "0 0 6px" }, children: s.text }, n)) })
  ] });
}
const Ye = ["map", "data", "plan", "risk", "worktrees", "findings", "agents", "explore"];
function zt(e) {
  return e.missing ? "missing" : e.error ? "unknown" : e.stale || e.map_stale ? "stale" : e.commits_behind > 0 ? "behind" : "current";
}
function ne(e, t, r) {
  switch (e) {
    case "current":
      return { tone: "ok", label: "Current", detail: `Current with ${r}`, rebuild: !1 };
    case "behind":
      return {
        tone: "muted",
        label: `${t} behind`,
        detail: `${t} ${t === 1 ? "commit" : "commits"} behind ${r}, and none change the model`,
        rebuild: !1
      };
    case "stale":
      return { tone: "warn", label: "Out of date", detail: `${r} has changes the model doesn't show yet`, rebuild: !0 };
    case "missing":
      return { tone: "err", label: "Folder missing", detail: "The folder for this project is gone", rebuild: !1 };
    case "unknown":
      return { tone: "muted", label: "Can't check", detail: `Couldn't compare the model with ${r}`, rebuild: !1 };
  }
}
function E(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
const Qe = { postgres: "Postgres", sqlite: "SQLite" };
function Mt(e) {
  const t = [
    e.tables ? `${E(e.tables, "table")} from ${Qe[e.engine ?? ""] ?? e.engine}` : "No tables found",
    e.routes ? `${E(e.routes, "route")}, ${e.route_style}` : "No routes found",
    `${E(e.code_files, "code file")}, ${E(e.links, "link")}`
  ];
  return e.git || t.push("No git history, so no churn or worktrees"), t;
}
function Rt(e) {
  return `Couldn't read ${e.file}, so it was set aside as ${e.kept_as}.`;
}
function Je(e) {
  return e.status === "current" ? E(e.tables, "table") : ne(e.status, e.behind, e.ref).label;
}
function be(e, t) {
  return t.filter((i) => i.name === e.name).length > 1 ? e.parent : null;
}
function Xe(e, t) {
  const r = t.trim().toLowerCase();
  return r ? e.filter((i) => i.name.toLowerCase().includes(r) || i.repo.toLowerCase().includes(r)) : e;
}
function Ze(e) {
  return e.length > 1 ? e.replace(/\/+$/, "") : e;
}
function et(e) {
  const t = /* @__PURE__ */ new Map();
  for (const s of e) {
    const n = Ze(s), c = n.lastIndexOf("/");
    c > 0 && t.set(n.slice(0, c), (t.get(n.slice(0, c)) ?? 0) + 1);
  }
  let r = null, i = 0;
  for (const [s, n] of t)
    n > i && (r = s, i = n);
  return r;
}
function ye(e, t, r) {
  const i = r.trim().toLowerCase(), s = new Set(t.map((c) => c.repo_key)), n = e.filter((c) => c.name.toLowerCase().includes(i));
  return { toAdd: n.filter((c) => !s.has(c.key)), added: n.filter((c) => s.has(c.key)) };
}
function we(e, t = 40) {
  return e.length > t ? `…${e.slice(1 - t)}` : e;
}
function tt(e, t) {
  const r = ye(e, t, "").toAdd.length;
  return r ? `Search ${E(r, "workspace")}` : "Search workspaces";
}
function nt(e) {
  const r = [
    [e.proposals, "proposal", "proposals"],
    [e.use_cases, "use case", "use cases"],
    [e.views, "saved view", "saved views"]
  ].filter(([i]) => i > 0).map(([i, s, n]) => `${i} ${i === 1 ? s : n}`);
  return r.length === 0 ? "" : r.length === 1 ? r[0] : `${r.slice(0, -1).join(", ")} and ${r[r.length - 1]}`;
}
function ve(e, t) {
  const r = Math.max(0, t - e);
  return r < 60 ? "just now" : r < 3600 ? `${Math.floor(r / 60)}m ago` : r < 86400 ? `${Math.floor(r / 3600)}h ago` : `${Math.floor(r / 86400)}d ago`;
}
const xe = (e) => `system-map.view.${e}`;
function Ot(e, t) {
  if (!t) return "map";
  const r = e.getItem(xe(t));
  return Ye.find((i) => i === r) ?? "map";
}
function Pt(e, t, r) {
  e.setItem(xe(t), r);
}
const ke = "system-map.side-list";
function Tt(e) {
  return e === "map" || e === "data";
}
function Ft(e) {
  return e.getItem(ke) !== "hidden";
}
function Bt(e, t) {
  e.setItem(ke, t ? "shown" : "hidden");
}
function rt(e) {
  return `system-map-design-${e}`;
}
const $e = (e) => `system-map.chat.${e}`;
function Ut(e, t) {
  return e.getItem($e(t)) === "started";
}
function Ht(e, t) {
  e.setItem($e(t), "started");
}
function Kt(e, t) {
  if (!Array.isArray(e)) return !1;
  const r = rt(t);
  return e.some((i) => (i == null ? void 0 : i.key) === r && typeof i.messages == "number" && i.messages > 0);
}
const st = 600, de = "system-map-workspace-list", X = (e) => `system-map-workspace-${e.key}`;
function Z() {
  return /* @__PURE__ */ l(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinejoin: "round",
      style: { ...y, flex: "none" },
      "aria-hidden": "true",
      children: /* @__PURE__ */ l("path", { d: "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })
    }
  );
}
function it(e) {
  const t = S(), [r, i] = g(null), [s, n] = g(null);
  k(() => {
    if (i(null), n(null), !e) return;
    let a = !0;
    return (async () => {
      const d = await t.get(`${x}/workspaces`);
      if (d.folder !== null) return { ...d, suggested: !1 };
      const p = await t.get("/api/recent-projects").catch(() => ({ dirs: [] })), u = Array.isArray(p.dirs) ? p.dirs.filter((w) => typeof w == "string") : [], f = et(u);
      if (f === null) return { ...d, suggested: !1 };
      const m = await t.get(`${x}/workspaces?folder=${encodeURIComponent(f)}`).catch(() => null);
      return m ? { ...m, suggested: !0 } : { ...d, suggested: !1 };
    })().then((d) => {
      a && i(d);
    }).catch((d) => {
      a && n(j(d, "read your default folder"));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const c = N(
    async (a) => {
      n(null);
      try {
        await t.post(`${x}/default-folder`, { folder: a }), i({ ...await t.get(`${x}/workspaces`), suggested: !1 });
      } catch (o) {
        n(j(o, "save this folder"));
      }
    },
    [t]
  );
  return { list: r, error: s, saveDefault: c };
}
function at(e, t, r) {
  const i = S(), [s, n] = g(!1), c = L(!1), a = L({ onPicked: t, onUsePage: r });
  a.current = { onPicked: t, onUsePage: r };
  const o = N((u) => {
    c.current = u, n(u);
  }, []), d = N(() => {
    c.current && (o(!1), i.post(`${x}/folder-window-close`, {}).catch(() => {
    }));
  }, [i, o]);
  return k(() => {
    if (!s) return;
    const u = window.setInterval(() => {
      i.get(`${x}/folder-window`).then((f) => {
        !c.current || f.status === "open" || (o(!1), f.status === "picked" ? a.current.onPicked(f.path) : f.status === "failed" && a.current.onUsePage(f.message));
      }).catch(() => {
        o(!1), a.current.onUsePage(null);
      });
    }, st);
    return () => window.clearInterval(u);
  }, [i, s, o]), k(() => e ? d : void 0, [e, d]), { waiting: s, openWindow: async (u) => {
    try {
      (await i.post(`${x}/folder-window`, { start: u })).status === "open" ? o(!0) : a.current.onUsePage(null);
    } catch {
      a.current.onUsePage(null);
    }
  }, closeWindow: d };
}
function ot({
  start: e,
  note: t,
  onUse: r,
  onCancel: i
}) {
  const s = S(), [n, c] = g(null), [a, o] = g(null), d = N(
    async (p) => {
      o(null);
      try {
        return c(await s.get(`${x}/browse?path=${encodeURIComponent(p)}`)), !0;
      } catch (u) {
        return o(j(u, "open this folder")), !1;
      }
    },
    [s]
  );
  return k(() => {
    d(e ?? "~").then((p) => {
      !p && e !== null && d("~");
    });
  }, [d, e]), /* @__PURE__ */ h("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "folder-list", children: [
    /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
      /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", disabled: !(n != null && n.parent), onClick: () => (n == null ? void 0 : n.parent) && void d(n.parent), children: "‹ Up" }),
      /* @__PURE__ */ l("span", { className: "sm-mono sm-ellipsis", title: n == null ? void 0 : n.path, "data-testid": "folder-list-path", children: n && we(n.display, 56) })
    ] }),
    /* @__PURE__ */ h("div", { className: "sm-list sm-add-list", children: [
      n == null ? void 0 : n.dirs.map((p) => /* @__PURE__ */ h("button", { type: "button", className: "sm-plain sm-row", title: p.path, onClick: () => void d(p.path), children: [
        /* @__PURE__ */ l(Z, {}),
        /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: p.name })
      ] }, p.path)),
      (n == null ? void 0 : n.dirs.length) === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No folders in here." })
    ] }),
    (t ?? a) && /* @__PURE__ */ l("p", { role: "status", style: { margin: 0, fontSize: 13 }, children: a ?? t }),
    /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
      /* @__PURE__ */ l(W, { onClick: i, children: "Cancel" }),
      /* @__PURE__ */ l(W, { primary: !0, disabled: !n, onClick: () => n && r(n.path), children: "Use this folder" })
    ] })
  ] });
}
function lt({
  workspace: e,
  added: t,
  active: r,
  busy: i,
  now: s,
  onHover: n,
  onPick: c
}) {
  return /* @__PURE__ */ h(
    "li",
    {
      id: X(e),
      role: "option",
      className: "sm-row",
      "aria-selected": !1,
      "aria-disabled": i,
      "data-active": r && !i,
      "data-testid": "workspace-row",
      title: e.path,
      onMouseEnter: n,
      onClick: () => {
        i || c();
      },
      children: [
        /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: t ? y : { fontWeight: 600 }, children: e.name }),
        e.worktrees > 0 && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: E(e.worktrees, "worktree") }),
        !e.git && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: "no git" }),
        /* @__PURE__ */ l("span", { style: { flex: 1 } }),
        /* @__PURE__ */ l("span", { className: "sm-row-action", children: t ? "Open" : "Add" }),
        !t && e.touched > 0 && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: ve(e.touched, s) })
      ]
    }
  );
}
function dt({
  list: e,
  projects: t,
  busy: r,
  onAdd: i,
  onOpen: s
}) {
  const [n, c] = g(""), [a, o] = g(0), d = L(!1), { toAdd: p, added: u } = ye(e.repos, t, n), f = [...p, ...u], m = Math.min(a, f.length - 1), w = Date.now() / 1e3, $ = (b) => u.includes(b) ? s(b) : i(b);
  k(() => {
    var b;
    d.current && (d.current = !1, f[m] && ((b = document.getElementById(X(f[m]))) == null || b.scrollIntoView({ block: "nearest" })));
  });
  const C = (b) => {
    if (b.key === "ArrowDown" || b.key === "ArrowUp") {
      if (b.preventDefault(), f.length === 0) return;
      d.current = !0, o((m + (b.key === "ArrowDown" ? 1 : -1) + f.length) % f.length);
    } else b.key === "Enter" && f[m] && !r && (b.preventDefault(), $(f[m]));
  }, z = (b, _, M) => /* @__PURE__ */ l(
    lt,
    {
      workspace: b,
      added: _,
      active: M === m,
      busy: r,
      now: w,
      onHover: () => o(M),
      onPick: () => $(b)
    },
    b.path
  );
  return /* @__PURE__ */ h(B, { children: [
    /* @__PURE__ */ l(
      U,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Search workspaces",
        "aria-expanded": !0,
        "aria-controls": de,
        "aria-activedescendant": f[m] ? X(f[m]) : void 0,
        placeholder: tt(e.repos, t),
        value: n,
        disabled: r,
        onKeyDown: C,
        onChange: (b) => {
          c(b.target.value), o(0);
        }
      }
    ),
    /* @__PURE__ */ h("ul", { id: de, className: "sm-list sm-add-list", role: "listbox", "aria-label": "Workspaces", children: [
      p.map((b, _) => z(b, !1, _)),
      u.length > 0 && /* @__PURE__ */ l("li", { role: "presentation", className: "sm-add-head", children: "Already added" }),
      u.map((b, _) => z(b, !0, p.length + _))
    ] }),
    f.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "0 9px" }, children: "No workspace matches that. Only folders with git or a package.json show here." }),
    e.truncated && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, fontSize: 12 }, children: "This folder is too big to search all of it. Pick a smaller one." })
  ] });
}
function ct({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: i
}) {
  const s = S(), { list: n, error: c, saveDefault: a } = it(e), [o, d] = g("workspaces"), [p, u] = g(null), [f, m] = g(!1), [w, $] = g(""), [C, z] = g(null), [b, _] = g(null), M = (v) => {
    u(v), d("folders");
  }, { waiting: K, openWindow: Se, closeWindow: Ce } = at(e, (v) => void a(v), M);
  k(() => {
    e && (d("workspaces"), u(null), m(!1), $(""), _(null), z(null));
  }, [e]);
  const re = async (v, Ie) => {
    z(v), _(null);
    try {
      Ie && (n != null && n.suggested) && n.folder && await s.post(`${x}/default-folder`, { folder: n.folder });
      const G = await s.post(`${x}/build`, { repo_path: v });
      i(G.repo_key);
    } catch (G) {
      _(j(G, "add this project"));
    } finally {
      z(null);
    }
  }, se = () => void Se((n == null ? void 0 : n.folder) ?? null), V = (v) => /* @__PURE__ */ h("div", { className: "sm-add-empty", "data-testid": "add-empty", children: [
    /* @__PURE__ */ l(Z, {}),
    /* @__PURE__ */ l("span", { children: v }),
    /* @__PURE__ */ l(W, { primary: !0, disabled: K, onClick: se, children: "Browse…" })
  ] });
  return /* @__PURE__ */ l(pe, { open: e, onClose: r, title: o === "folders" ? "Choose folder" : "Add project", maxWidth: 520, dismissDisabled: C !== null, children: o === "folders" ? /* @__PURE__ */ l(
    ot,
    {
      start: (n == null ? void 0 : n.folder) ?? null,
      note: p,
      onCancel: () => d("workspaces"),
      onUse: (v) => {
        d("workspaces"), a(v);
      }
    }
  ) : /* @__PURE__ */ h("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    (n == null ? void 0 : n.folder) && /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, "data-testid": "default-folder", children: [
      /* @__PURE__ */ l(Z, {}),
      /* @__PURE__ */ l("span", { className: "sm-mono sm-ellipsis", style: { fontSize: 13 }, title: n.folder, children: n.display && we(n.display) }),
      n.suggested ? /* @__PURE__ */ l(ue, { variant: "aim", children: "Suggested" }) : /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12 }, children: "Default" }),
      /* @__PURE__ */ l("span", { style: { flex: 1 } }),
      /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", disabled: K || C !== null, onClick: se, children: "Browse…" })
    ] }),
    K && /* @__PURE__ */ h("div", { role: "status", className: "sm-notice", "data-testid": "window-open", children: [
      /* @__PURE__ */ l("span", { style: { flex: 1 }, children: "Pick a folder in the window that just opened." }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "sm-plain sm-link",
          onClick: () => {
            Ce(), M(null);
          },
          children: "Pick here instead"
        }
      )
    ] }),
    n && n.folder === null && V("Pick the folder that holds your projects"),
    (n == null ? void 0 : n.missing) && V(`${n.display} isn't there any more`),
    (n == null ? void 0 : n.folder) && !n.missing && n.repos.length === 0 && V(`No projects in ${n.display}`),
    (n == null ? void 0 : n.folder) && n.repos.length > 0 && /* @__PURE__ */ l(
      dt,
      {
        list: n,
        projects: t,
        busy: C !== null,
        onAdd: (v) => void re(v.path, !0),
        onOpen: (v) => i(v.key)
      },
      n.folder
    ),
    f ? /* @__PURE__ */ h(
      "form",
      {
        onSubmit: (v) => {
          v.preventDefault(), w.trim() && re(w.trim(), !1);
        },
        children: [
          /* @__PURE__ */ l("label", { style: { display: "block", ...y, fontSize: 12, marginBottom: 4 }, htmlFor: "system-map-path", children: "Full path to a project" }),
          /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ l(
              _e,
              {
                id: "system-map-path",
                placeholder: "/path/to/project",
                value: w,
                disabled: C !== null,
                autoFocus: !0,
                onChange: (v) => $(v.target.value),
                style: { flex: 1, minWidth: 0 }
              }
            ),
            /* @__PURE__ */ l(W, { primary: !0, type: "submit", disabled: C !== null || !w.trim(), children: "Add" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", style: { justifySelf: "start" }, disabled: C !== null, onClick: () => m(!0), children: "Use a full path" }),
    /* @__PURE__ */ l("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: C !== null ? `Building ${C.split("/").pop()}. This can take a minute.` : b ?? c })
  ] }) });
}
const ut = {
  [ee]: "table:",
  [I]: "route:",
  [D]: "job:"
};
function Vt(e, t) {
  const r = new Set(t[e] ?? []), i = ut[e];
  if (i)
    for (const [s, n] of Object.entries(t))
      s.startsWith(i) && n.forEach((c) => r.add(c));
  return [...r].sort();
}
function Gt(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function qt(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function Yt(e, t) {
  return t ? t.overlaps.filter((r) => [...r.schema, ...r.schema_and_code, ...r.code, ...r.modules].includes(e)) : [];
}
function Qt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [r, i] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    r.startsWith("table:") && t.set(r, i.length);
  return t;
}
function Jt(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function Xt(e, t) {
  const r = new Set(t);
  return {
    tables: e.tables.filter((i) => r.has(i.id)),
    edges: e.edges.filter((i) => r.has(i.source) && r.has(i.target))
  };
}
function Zt(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
function pt({
  trigger: e,
  children: t,
  width: r,
  align: i = "left",
  popup: s = "dialog",
  label: n,
  block: c = !1
}) {
  const [a, o] = g(!1), d = L(null), p = L(null), u = N(() => {
    var f;
    o(!1), (f = p.current) == null || f.focus();
  }, []);
  return k(() => {
    if (!a) return;
    const f = (m) => {
      var w;
      (w = d.current) != null && w.contains(m.target) || o(!1);
    };
    return document.addEventListener("pointerdown", f), () => document.removeEventListener("pointerdown", f);
  }, [a]), /* @__PURE__ */ h(
    "span",
    {
      ref: d,
      style: { position: "relative", display: c ? "block" : "inline-flex", minWidth: 0, maxWidth: "100%" },
      onKeyDown: (f) => {
        f.key === "Escape" && a && (f.stopPropagation(), u());
      },
      onBlur: (f) => {
        var w;
        const m = f.relatedTarget;
        m && !((w = d.current) != null && w.contains(m)) && o(!1);
      },
      children: [
        e({
          ref: p,
          onClick: () => o((f) => !f),
          onKeyDown: (f) => {
            f.key === "ArrowDown" && !a && (f.preventDefault(), o(!0));
          },
          "aria-expanded": a,
          "aria-haspopup": s
        }),
        a && // The host's main can take focus, so a click on anything here that can't would land
        // there and close this before the click arrives. Focus stops here instead.
        /* @__PURE__ */ l(
          "div",
          {
            className: "sm-pop",
            tabIndex: -1,
            role: s === "dialog" ? "dialog" : void 0,
            "aria-label": s === "dialog" ? n : void 0,
            style: { top: "calc(100% + 6px)", [i]: 0, width: `min(${r}px, calc(100vw - 24px))` },
            children: t(u)
          }
        )
      ]
    }
  );
}
function en({ label: e, children: t }) {
  const r = L(null);
  return k(() => {
    var s, n;
    (n = (s = r.current) == null ? void 0 : s.querySelector('[role="menuitem"]')) == null || n.focus();
  }, []), /* @__PURE__ */ l("div", { ref: r, role: "menu", "aria-label": e, onKeyDown: (s) => {
    var o;
    const n = [...((o = r.current) == null ? void 0 : o.querySelectorAll('[role="menuitem"]')) ?? []], c = n.indexOf(document.activeElement), a = s.key === "ArrowDown" ? c + 1 : s.key === "ArrowUp" ? c - 1 : null;
    a === null || n.length === 0 || (s.preventDefault(), n[(a + n.length) % n.length].focus());
  }, children: t });
}
function ft() {
  return /* @__PURE__ */ l("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ l("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function mt({
  project: e,
  hint: t,
  onBuilt: r,
  onRemove: i
}) {
  const s = S(), [n, c] = g(!1), [a, o] = g(null), [d, p] = g(null), u = ne(e.status, e.behind, e.ref), f = nt(e.intent), m = async () => {
    o("Rebuilding"), p(null);
    try {
      await s.post(`${x}/build`, { repo: e.repo_key }), r();
    } catch ($) {
      p(j($, "rebuild this project"));
    } finally {
      o(null);
    }
  }, w = async () => {
    o("Removing"), p(null);
    try {
      await i(e.repo_key);
    } catch ($) {
      p(j($, "remove this project")), o(null);
    }
  };
  return /* @__PURE__ */ h("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ l("span", { className: "sm-dot", "data-tone": u.tone }),
      /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: u.label }),
      /* @__PURE__ */ l("span", { style: { flex: 1 } }),
      /* @__PURE__ */ l(W, { disabled: a !== null || e.status === "missing", onClick: () => void m(), children: a === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ l(W, { danger: !0, disabled: a !== null, onClick: () => c(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ l("div", { className: "sm-mono sm-ellipsis", style: { ...y, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ h("div", { style: { ...y, fontSize: 12, marginTop: 2 }, children: [
      E(e.tables, "table"),
      ", built ",
      ve(e.built_at, Date.now() / 1e3)
    ] }),
    n && /* @__PURE__ */ h("div", { role: "alert", style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border, #e4e4e7)" }, "data-testid": "confirm-remove", children: [
      /* @__PURE__ */ h("p", { style: { margin: "0 0 8px" }, children: [
        "Remove ",
        e.name,
        " from System Map? This deletes its model",
        f ? ` and ${f}` : "",
        " for good. The repo itself isn't touched."
      ] }),
      /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ l(W, { danger: !0, disabled: a !== null, onClick: () => void w(), autoFocus: !0, children: a === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ l(W, { disabled: a !== null, onClick: () => c(!1), children: "Keep it" })
      ] })
    ] }),
    d && /* @__PURE__ */ l("p", { style: { margin: "8px 0 0" }, children: d })
  ] });
}
function ht({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: i,
  onRemoved: s
}) {
  const n = S(), c = async (a) => {
    await n.post(`${x}/repo-remove`, { repo: a }), s(a);
  };
  return /* @__PURE__ */ l(pe, { open: e, onClose: r, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ h("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((a) => /* @__PURE__ */ l(mt, { project: a, hint: be(a, t), onBuilt: i, onRemove: c }, a.repo_key)),
    t.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0 }, children: "No projects yet." })
  ] }) });
}
const ce = (e) => `system-map-project-${e}`;
function gt({
  projects: e,
  activeKey: t,
  close: r,
  onPick: i,
  onAdd: s,
  onManage: n
}) {
  const [c, a] = g(""), o = Xe(e, c), [d, p] = g(() => Math.max(0, o.findIndex((m) => m.repo_key === t))), u = Math.min(d, o.length - 1), f = (m) => {
    if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), o.length === 0) return;
      p((u + (m.key === "ArrowDown" ? 1 : -1) + o.length) % o.length);
    } else m.key === "Enter" && o[u] && (m.preventDefault(), r(), i(o[u].repo_key));
  };
  return /* @__PURE__ */ h(B, { children: [
    /* @__PURE__ */ l(
      U,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Find a project",
        "aria-expanded": !0,
        "aria-controls": "system-map-project-list",
        "aria-activedescendant": o[u] ? ce(o[u].repo_key) : void 0,
        placeholder: "Find a project",
        value: c,
        onKeyDown: f,
        onChange: (m) => {
          a(m.target.value), p(0);
        }
      }
    ),
    /* @__PURE__ */ l("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: o.map((m, w) => {
      const $ = be(m, e);
      return /* @__PURE__ */ h(
        "li",
        {
          id: ce(m.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": m.repo_key === t,
          "data-active": w === u,
          title: m.repo,
          onMouseEnter: () => p(w),
          onClick: () => {
            r(), i(m.repo_key);
          },
          children: [
            /* @__PURE__ */ l("span", { className: "sm-dot", "data-tone": ne(m.status, m.behind, m.ref).tone }),
            /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: m.name }),
            $ && /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { ...y, fontSize: 12 }, children: $ }),
            /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: Je(m) })
          ]
        },
        m.repo_key
      );
    }) }),
    o.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ l("div", { className: "sm-rule" }),
    /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-row", onClick: s, children: "Add project" }),
    /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-row", onClick: n, children: "Manage projects" })
  ] });
}
function tn({
  projects: e,
  activeKey: t,
  compact: r = !1,
  onPick: i,
  onReload: s
}) {
  const n = e.find((u) => u.repo_key === t), [c, a] = g(null), o = () => a(null);
  return { menu: /* @__PURE__ */ l(
    pt,
    {
      width: 340,
      label: "Projects",
      block: r,
      trigger: (u) => /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${r ? " sm-compact" : ""}`,
          title: n == null ? void 0 : n.repo,
          "aria-label": `Project: ${(n == null ? void 0 : n.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...u,
          children: [
            /* @__PURE__ */ l("span", { className: "sm-ellipsis", children: n == null ? void 0 : n.name }),
            /* @__PURE__ */ l(ft, {})
          ]
        }
      ),
      children: (u) => /* @__PURE__ */ l(
        gt,
        {
          projects: e,
          activeKey: t,
          close: u,
          onPick: i,
          onAdd: () => {
            u(), a("add");
          },
          onManage: () => {
            u(), a("manage");
          }
        }
      )
    }
  ), dialogs: /* @__PURE__ */ h(B, { children: [
    /* @__PURE__ */ l(
      ct,
      {
        open: c === "add",
        projects: e,
        onClose: o,
        onBuilt: (u) => {
          o(), s(), i(u);
        }
      }
    ),
    /* @__PURE__ */ l(
      ht,
      {
        open: c === "manage",
        projects: e,
        onClose: o,
        onBuilt: s,
        onRemoved: (u) => {
          const f = e.find((m) => m.repo_key !== u);
          f || o(), u === t && f && i(f.repo_key), s();
        }
      }
    )
  ] }) };
}
export {
  qe as A,
  It as B,
  ft as C,
  pt as D,
  Qt as E,
  Jt as F,
  ee as G,
  Xt as H,
  ne as I,
  zt as J,
  tn as K,
  jt as L,
  y as M,
  Dt as N,
  Yt as O,
  rt as P,
  j as Q,
  x as R,
  Ve as S,
  Lt as T,
  Tt as U,
  Bt as V,
  Ut as W,
  Kt as X,
  Ht as Y,
  E as Z,
  Q as a,
  ve as b,
  Rt as c,
  Nt as d,
  _t as e,
  At as f,
  Wt as g,
  Gt as h,
  qt as i,
  I as j,
  D as k,
  en as l,
  ct as m,
  kt as n,
  $t as o,
  Zt as p,
  Ct as q,
  Mt as r,
  F as s,
  Et as t,
  xt as u,
  St as v,
  Vt as w,
  Ot as x,
  Ft as y,
  Pt as z
};
