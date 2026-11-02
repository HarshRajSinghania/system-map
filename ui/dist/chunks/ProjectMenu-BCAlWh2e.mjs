import { jsxs as m, jsx as d, Fragment as T } from "react/jsx-runtime";
import { SearchInput as F, Badge as ne, Modal as q, Input as re, Btn as I } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as N, useEffect as v, useRef as j } from "react";
import { useAppApi as w } from "@kirocrew/app-sdk";
const U = "system-map-chrome-css", ie = `
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
`;
if (!document.getElementById(U)) {
  const e = document.createElement("style");
  e.id = U, e.textContent = ie, document.head.appendChild(e);
}
const W = { fontFamily: "var(--mono, ui-monospace, monospace)" }, b = { color: "var(--muted, #71717a)" }, ae = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function se({ severity: e }) {
  return /* @__PURE__ */ d("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ d(ne, { variant: ae[e], children: e }) });
}
function Fe({
  tables: e,
  selected: t,
  flagged: n,
  working: a,
  onSelect: r
}) {
  const [i, l] = g(""), o = e.filter((s) => s.name.includes(i.trim().toLowerCase()));
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(
      F,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: i,
        onChange: (s) => l(s.target.value)
      }
    ),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: o.map((s) => /* @__PURE__ */ m(
      "button",
      {
        onClick: () => r(s.id),
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
          background: s.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
        },
        children: [
          /* @__PURE__ */ d("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: s.name }),
          /* @__PURE__ */ m("span", { style: { ...b, display: "flex", gap: 6, flexShrink: 0 }, children: [
            a != null && a.get(s.id) ? /* @__PURE__ */ m(
              "span",
              {
                title: "Worktrees changing this table or its code",
                style: { color: (a.get(s.id) ?? 0) > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" },
                children: [
                  a.get(s.id),
                  " at work"
                ]
              }
            ) : null,
            n != null && n.get(s.id) ? /* @__PURE__ */ d("span", { title: `${n.get(s.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: n.get(s.id) }) : null,
            /* @__PURE__ */ d("span", { title: `${s.columns} columns`, children: s.columns })
          ] })
        ]
      },
      s.id
    )) })
  ] });
}
function k({ title: e, children: t }) {
  return /* @__PURE__ */ m("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ d("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const E = { margin: 0, paddingLeft: 16 };
function Be({
  nodes: e,
  focus: t,
  onSelect: n
}) {
  const [a, r] = g(""), i = a.trim().toLowerCase(), l = e.filter((c) => c.kind === "area").sort((c, h) => (h.lines ?? 0) - (c.lines ?? 0)), o = e.filter((c) => c.kind === "module"), s = (c, h, p) => /* @__PURE__ */ m(
    "button",
    {
      onClick: () => n(c.id),
      style: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        padding: `3px 8px 3px ${8 + h * 14}px`,
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        fontWeight: h === 0 ? 600 : 400,
        color: "var(--text, inherit)",
        background: c.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ d("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p }),
        /* @__PURE__ */ d("span", { style: { ...b, fontWeight: 400, flexShrink: 0 }, title: `${c.files} files`, children: c.files })
      ]
    },
    c.id
  );
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(F, { "aria-label": "Filter modules", placeholder: "Filter modules", value: a, onChange: (c) => r(c.target.value) }),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: l.map((c) => {
      const h = o.filter((u) => u.area === c.id && u.path !== c.path), p = h.filter((u) => u.name.toLowerCase().includes(i)), f = i !== "" || t === c.id || h.some((u) => u.id === t);
      return i && p.length === 0 && !c.name.toLowerCase().includes(i) ? null : /* @__PURE__ */ m("div", { children: [
        s(c, 0, c.path === "." ? c.name : (c.path ?? c.name).replace(/^src\//, "")),
        f && p.map((u) => s(u, 1, u.name))
      ] }, c.id);
    }) })
  ] });
}
function oe({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ d(T, { children: e.map((n) => /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ d(se, { severity: n.severity }),
    /* @__PURE__ */ d("span", { style: { flex: 1 }, children: n.title }),
    t && /* @__PURE__ */ d("button", { onClick: () => t(n), style: le, children: "Ask" })
  ] }, n.id)) });
}
const le = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function Pe({ node: e, onAsk: t }) {
  const n = e.constraints.filter((r) => r.kind !== "check"), a = e.constraints.filter((r) => r.kind === "check");
  return /* @__PURE__ */ m("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ d("p", { style: { ...b, ...W, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ d(k, { title: "Findings", children: /* @__PURE__ */ d(oe, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ d(k, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ d("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ d("tbody", { children: e.columns.map((r) => /* @__PURE__ */ m("tr", { title: r.source, children: [
      /* @__PURE__ */ d("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: r.name }),
      /* @__PURE__ */ d("td", { style: { ...b, ...W, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: r.type }),
      /* @__PURE__ */ d("td", { style: { ...b, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: r.nullable ? "null" : "not null" })
    ] }, r.name)) }) }) }),
    n.length > 0 && /* @__PURE__ */ d(k, { title: "Keys", children: /* @__PURE__ */ d("ul", { style: E, children: n.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.kind.replace("_", " "),
      " (",
      r.columns.join(", "),
      ")",
      r.references ? ` to ${r.references}, on delete ${r.on_delete}` : ""
    ] }, r.name)) }) }),
    a.length > 0 && /* @__PURE__ */ d(k, { title: "Checks", children: /* @__PURE__ */ d("ul", { style: E, children: a.map((r) => /* @__PURE__ */ d("li", { title: r.source, style: { ...W, fontSize: 12, overflowWrap: "anywhere" }, children: r.expression }, r.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ d(k, { title: "Indexes", children: /* @__PURE__ */ d("ul", { style: E, children: e.indexes.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.name,
      " (",
      r.columns.join(", "),
      ")",
      r.unique ? ", unique" : "",
      r.partial ? ", partial" : ""
    ] }, r.name)) }) }),
    e.schema !== "main" && /* @__PURE__ */ d(k, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ d("ul", { style: E, children: e.policies.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.name,
      ": ",
      r.command,
      " for ",
      r.roles.join(", ")
    ] }, r.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ d(k, { title: "Triggers", children: /* @__PURE__ */ d("ul", { style: E, children: e.triggers.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.name,
      ": ",
      r.timing,
      " ",
      r.events.join(", ")
    ] }, r.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ d(k, { title: "Notes", children: e.reads.map((r, i) => /* @__PURE__ */ d("p", { style: { margin: "0 0 6px" }, children: r.text }, i)) })
  ] });
}
const de = /^API (\d{3}): ([\s\S]*)$/;
function ce(e) {
  const t = e ?? {};
  if (typeof t.status == "number") return { status: t.status, body: t.body ?? "" };
  const n = de.exec(typeof t.message == "string" ? t.message : "");
  return n ? { status: Number(n[1]), body: n[2] } : { status: null, body: "" };
}
function ue(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.error == "string" && t.error ? t.error : null;
  } catch {
    return null;
  }
}
function z(e, t) {
  const { status: n, body: a } = ce(e);
  if (n === null) return `Couldn't ${t}. Check the dashboard is still connected, then try again.`;
  if (n === 400 || n === 404) {
    const r = ue(a);
    if (r) return r;
  }
  return n === 401 || n === 403 ? `Couldn't ${t}, because System Map isn't allowed to. Check its permissions on its Details page.` : n >= 500 ? `Couldn't ${t}, because System Map's backend isn't answering. Try again in a moment.` : `Couldn't ${t}. Try again.`;
}
const pe = /* @__PURE__ */ new Set(["planned", "partial"]), B = "group:tables", y = "group:routes", S = "group:jobs";
function V(e) {
  return `${e.files} ${e.files === 1 ? "file" : "files"}, ${e.lines} lines`;
}
function A(e) {
  return e === "." ? "root files" : e.replace(/^src\//, "");
}
function fe(e) {
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : A(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: A(e.path ?? e.name), subtitle: V(e) };
    case "module": {
      const t = e.area === `area:${e.path}`;
      return {
        id: e.id,
        kind: "module",
        title: t ? `${e.name} (top level)` : e.name,
        subtitle: V(e)
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
    default:
      return { id: e.id, kind: e.kind, title: e.name };
  }
}
function O(e, t) {
  const n = e.nodes.filter((l) => l.kind === "route"), a = n.filter((l) => l.route_kind === "api").length, r = e.nodes.filter((l) => l.kind === "job").length, i = [];
  return n.length && i.push({ id: y, kind: "group", title: "Routes", subtitle: `${n.length - a} pages, ${a} API` }), t && i.push({ id: B, kind: "group", title: "Database", subtitle: `${t} ${t === 1 ? "table" : "tables"}` }), r && i.push({ id: S, kind: "group", title: "Scheduled jobs", subtitle: `${r} jobs` }), i;
}
function me(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const he = 3, ge = 24;
function J(e, t) {
  return !!(e && t && (e === t || e.startsWith(`${t}/`)));
}
function G(e, t) {
  if (e.startsWith("table:")) return B;
  const n = t.byId.get(e);
  return n ? n.status === "proposed" ? e : (n.kind === "module" || n.kind === "area") && J(n.path, t.routesDir) ? y : n.kind === "module" ? n.area === t.open ? e : n.area ?? e : n.kind === "route" ? t.expanded === y ? e : y : n.kind === "job" ? t.expanded === S ? e : S : e : null;
}
function Q(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !pe.has(e.status));
}
function P(e, t, n, a) {
  const r = /* @__PURE__ */ new Map();
  for (const i of e.edges) {
    if (Q(t.byId.get(i.source), n)) continue;
    const l = G(i.source, t), o = G(i.target, t);
    if (!l || !o || l === o || !a(l, o)) continue;
    const s = `${l}|${o}|${i.kind}`, c = r.get(s);
    c ? c.count += i.count : r.set(s, { id: s, source: l, target: o, kind: i.kind, count: i.count, proposed: i.proposed });
  }
  return [...r.values()];
}
function L(e, t, n) {
  const a = [];
  for (const r of e) {
    const i = n.find((o) => o.id === r), l = t.byId.get(r);
    i ? a.push(i) : l ? a.push(fe(l)) : r.startsWith("table:") && a.push(me(r));
  }
  return a;
}
function be(e, t, n, a) {
  const r = O(e, n), i = P(e, t, a, () => !0), l = i.length <= ge ? i : i.filter((s) => s.kind !== "imports" || s.count >= he), o = new Set(r.map((s) => s.id));
  for (const s of e.nodes)
    s.kind === "area" && !J(s.path, t.routesDir) && o.add(s.id), s.kind === "service" && o.add(s.id), s.kind === "plan" && !Q(s, a) && o.add(s.id), s.status === "proposed" && o.add(s.id);
  return { cards: L(o, t, r), lines: l.filter((s) => o.has(s.source) && o.has(s.target)), hidden: i.length - l.length };
}
function xe(e, t, n, a) {
  const r = new Set(e.nodes.filter((o) => o.area === t.open && o.kind === "module").map((o) => o.id)), i = P(
    e,
    t,
    a,
    (o, s) => (r.has(o) || r.has(s)) && !o.startsWith("area:") && !s.startsWith("area:")
  ), l = new Set(r);
  for (const o of i)
    l.add(o.source), l.add(o.target);
  return { cards: L(l, t, O(e, n)), lines: i };
}
function ve(e, t, n, a) {
  const r = t.expanded === y ? "route" : "job", i = new Set(e.nodes.filter((s) => s.kind === r).map((s) => s.id)), l = P(e, t, a, (s, c) => i.has(s) || i.has(c)), o = new Set(i);
  for (const s of l)
    o.add(s.source), o.add(s.target);
  return { cards: L(o, t, O(e, n)), lines: l };
}
function ye(e, t, n) {
  const a = [], r = /* @__PURE__ */ new Set([n]);
  for (const i of e.edges)
    i.source !== n && i.target !== n || (r.add(i.source), r.add(i.target), a.push({ id: `${i.source}|${i.target}|${i.kind}`, source: i.source, target: i.target, kind: i.kind, count: i.count }));
  return { cards: L(r, t, []), lines: a };
}
function He(e, t, n) {
  const a = new Map(e.nodes.map((o) => [o.id, o])), r = new Set(t), i = /* @__PURE__ */ new Map();
  for (const o of e.edges) {
    if (!r.has(o.source) || !r.has(o.target)) continue;
    const s = `${o.source}|${o.target}|${o.kind}`;
    i.set(s, { id: s, source: o.source, target: o.target, kind: o.kind, count: o.count, proposed: o.proposed });
  }
  return { cards: L(r, { byId: a }, O(e, n)), lines: [...i.values()] };
}
function X(e) {
  if (e.routes_dir) return e.routes_dir;
  const t = e.nodes.find((a) => a.kind === "route"), n = t == null ? void 0 : t.evidence[0];
  return n ? n.slice(0, n.lastIndexOf("/")) : null;
}
function Ue(e, t, n, a) {
  const r = new Map(e.nodes.map((h) => [h.id, h])), i = X(e), l = t === `area:${i}` ? y : t, o = l != null && l.startsWith("area:") ? l : null, s = l === y || l === S ? l : null, c = { byId: r, open: o, expanded: s, routesDir: i };
  return l ? o ? xe(e, c, n, a) : s ? ve(e, c, n, a) : ye(e, c, l) : be(e, c, n, a);
}
function Ve(e, t) {
  const n = [{ id: null, label: "System" }];
  if (!t) return n;
  if (t === y || t === `area:${X(e)}`) return [...n, { id: t, label: "Routes" }];
  if (t === S) return [...n, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...n, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const a = e.nodes.find((r) => r.id === t);
  if (!a) return n;
  if (a.kind === "area") return [...n, { id: t, label: A(a.path ?? a.name) }];
  if (a.kind === "module") {
    const r = e.nodes.find((i) => i.id === a.area);
    return [
      ...n,
      { id: a.area ?? null, label: A((r == null ? void 0 : r.path) ?? "") },
      { id: t, label: a.name }
    ];
  }
  return a.kind === "route" ? [...n, { id: y, label: "Routes" }, { id: t, label: a.name }] : a.kind === "job" ? [...n, { id: S, label: "Scheduled jobs" }, { id: t, label: a.name }] : [...n, { id: t, label: a.name }];
}
const we = {
  [B]: "table:",
  [y]: "route:",
  [S]: "job:"
};
function Ge(e, t) {
  const n = new Set(t[e] ?? []), a = we[e];
  if (a)
    for (const [r, i] of Object.entries(t))
      r.startsWith(a) && i.forEach((l) => n.add(l));
  return [...n].sort();
}
function Ke(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function Ye(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function qe(e, t) {
  return t ? t.overlaps.filter((n) => [...n.schema, ...n.schema_and_code, ...n.code, ...n.modules].includes(e)) : [];
}
function Je(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, a] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    n.startsWith("table:") && t.set(n, a.length);
  return t;
}
function Qe(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function Xe(e, t) {
  const n = new Set(t);
  return {
    tables: e.tables.filter((a) => n.has(a.id)),
    edges: e.edges.filter((a) => n.has(a.source) && n.has(a.target))
  };
}
function Ze(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
const _ = "/apps/system-map/api";
function R(e, t) {
  return t ? `${_}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${_}${e}`;
}
const M = "system-map.repo", D = "system-map:project";
function et() {
  var h, p;
  const e = w(), [t, n] = g([]), [a, r] = g(!1), [i, l] = g(() => localStorage.getItem(M)), o = N(async () => {
    try {
      const f = await e.get(`${_}/repos`);
      n(f.repos);
    } catch {
      n([]);
    } finally {
      r(!0);
    }
  }, [e]);
  v(() => {
    o();
  }, [o]), v(() => {
    const f = () => {
      l(localStorage.getItem(M)), o();
    };
    return window.addEventListener(D, f), () => window.removeEventListener(D, f);
  }, [o]);
  const s = N((f) => {
    localStorage.setItem(M, f), window.dispatchEvent(new Event(D));
  }, []), c = ((h = t.find((f) => f.repo_key === i)) == null ? void 0 : h.repo_key) ?? ((p = t[0]) == null ? void 0 : p.repo_key) ?? null;
  return { repos: t, active: c, loaded: a, choose: s, reload: o };
}
function tt(e) {
  const t = w(), [n, a] = g(null), [r, i] = g(null), l = j(e);
  l.current = e;
  const o = N(async () => {
    if (!e) {
      a(null);
      return;
    }
    try {
      const s = await t.get(R("/overview", e));
      if (l.current !== e) return;
      a(s), i(null);
    } catch (s) {
      if (l.current !== e) return;
      a(null), i(z(s, "load this project"));
    }
  }, [t, e]);
  return v(() => {
    i(null), o();
  }, [o]), { overview: (n == null ? void 0 : n.manifest.repo_key) === e ? n : null, error: r, refresh: o };
}
function nt(e, t, n) {
  const a = w(), [r, i] = g({ repo: t, value: null, failed: !1 });
  return v(() => {
    if (!n) return;
    let l = !0;
    return a.get(R(e, t)).then((o) => {
      l && i({ repo: t, value: o, failed: !1 });
    }).catch(() => {
      l && i({ repo: t, value: null, failed: !0 });
    }), () => {
      l = !1;
    };
  }, [a, e, t, n]), r.repo === t ? { value: r.value, failed: r.failed } : { value: null, failed: !1 };
}
function rt(e, t, n) {
  const a = w(), [r, i] = g(null);
  return v(() => {
    if (!e) {
      i(null);
      return;
    }
    let l = !0;
    return a.get(R(`/proposal?id=${encodeURIComponent(e)}`, t)).then((o) => {
      l && i(o);
    }).catch(() => {
      l && i(null);
    }), () => {
      l = !1;
    };
  }, [a, e, t, n]), r;
}
function it(e, t, n) {
  const a = w(), [r, i] = g({ repo: t, value: null, failed: !1 }), [l, o] = g(null), s = j(t);
  s.current = t;
  const c = N(async () => {
    if (t)
      try {
        const p = await a.get(R(e, t));
        if (s.current !== t) return;
        i({ repo: t, value: p, failed: !1 }), o(Date.now());
      } catch {
        s.current === t && i({ repo: t, value: null, failed: !0 });
      }
  }, [a, e, t]);
  v(() => {
    c();
    const p = window.setInterval(() => {
      document.visibilityState === "visible" && c();
    }, n);
    return () => window.clearInterval(p);
  }, [c, n]);
  const h = r.repo === t;
  return { value: h ? r.value : null, failed: h && r.failed, checkedAt: l, refresh: c };
}
function at(e, t = null) {
  const n = w(), [a, r] = g(null);
  return v(() => {
    if (!e) {
      r(null);
      return;
    }
    let i = !0;
    return n.get(R(`/node?id=${encodeURIComponent(e)}`, t)).then((l) => {
      i && r(l);
    }).catch(() => {
      i && r(null);
    }), () => {
      i = !1;
    };
  }, [n, e, t]), a;
}
const ke = ["map", "data", "plan", "risk", "worktrees", "findings", "explore"];
function st(e) {
  return e.missing ? "missing" : e.error ? "unknown" : e.stale || e.map_stale ? "stale" : e.commits_behind > 0 ? "behind" : "current";
}
function H(e, t, n) {
  switch (e) {
    case "current":
      return { tone: "ok", label: "Current", detail: `Current with ${n}`, rebuild: !1 };
    case "behind":
      return {
        tone: "muted",
        label: `${t} behind`,
        detail: `${t} ${t === 1 ? "commit" : "commits"} behind ${n}, and none change the model`,
        rebuild: !1
      };
    case "stale":
      return { tone: "warn", label: "Out of date", detail: `${n} has changes the model doesn't show yet`, rebuild: !0 };
    case "missing":
      return { tone: "err", label: "Folder missing", detail: "The folder for this project is gone", rebuild: !1 };
    case "unknown":
      return { tone: "muted", label: "Can't check", detail: `Couldn't compare the model with ${n}`, rebuild: !1 };
  }
}
function C(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
const Se = { postgres: "Postgres", sqlite: "SQLite" };
function ot(e) {
  const t = [
    e.tables ? `${C(e.tables, "table")} from ${Se[e.engine ?? ""] ?? e.engine}` : "No tables found",
    e.routes ? `${C(e.routes, "route")}, ${e.route_style}` : "No routes found",
    `${C(e.code_files, "code file")}, ${C(e.links, "link")}`
  ];
  return e.git || t.push("No git history, so no churn or worktrees"), t;
}
function $e(e) {
  return e.status === "current" ? C(e.tables, "table") : H(e.status, e.behind, e.ref).label;
}
function Z(e, t) {
  return t.filter((a) => a.name === e.name).length > 1 ? e.parent : null;
}
function Ce(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.filter((a) => a.name.toLowerCase().includes(n) || a.repo.toLowerCase().includes(n)) : e;
}
function K(e) {
  return e.length > 1 ? e.replace(/\/+$/, "") : e;
}
function _e(e, t) {
  const n = new Set(t.map((i) => K(i.repo))), a = /* @__PURE__ */ new Set(), r = [];
  for (const i of e) {
    const l = K(i);
    if (n.has(l) || a.has(l)) continue;
    a.add(l);
    const o = l.split("/").filter(Boolean);
    r.push({ path: l, name: o[o.length - 1] ?? l, parent: o[o.length - 2] ?? "" });
  }
  return r;
}
function Ee(e) {
  const n = [
    [e.proposals, "proposal", "proposals"],
    [e.use_cases, "use case", "use cases"],
    [e.views, "saved view", "saved views"]
  ].filter(([a]) => a > 0).map(([a, r, i]) => `${a} ${a === 1 ? r : i}`);
  return n.length === 0 ? "" : n.length === 1 ? n[0] : `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}
function Ie(e, t) {
  const n = Math.max(0, t - e);
  return n < 60 ? "just now" : n < 3600 ? `${Math.floor(n / 60)}m ago` : n < 86400 ? `${Math.floor(n / 3600)}h ago` : `${Math.floor(n / 86400)}d ago`;
}
const ee = (e) => `system-map.view.${e}`;
function lt(e, t) {
  if (!t) return "map";
  const n = e.getItem(ee(t));
  return ke.find((a) => a === n) ?? "map";
}
function dt(e, t, n) {
  e.setItem(ee(t), n);
}
const te = "system-map.side-list";
function ct(e) {
  return e === "map" || e === "data";
}
function ut(e) {
  return e.getItem(te) !== "hidden";
}
function pt(e, t) {
  e.setItem(te, t ? "shown" : "hidden");
}
function ft(e) {
  return `system-map-design-${e}`;
}
function Ne(e, t) {
  const n = w(), [a, r] = g([]);
  return v(() => {
    if (!e) return;
    let i = !0;
    return n.get("/api/recent-projects").then((l) => {
      i && r(Array.isArray(l.dirs) ? l.dirs.filter((o) => typeof o == "string") : []);
    }).catch(() => {
      i && r([]);
    }), () => {
      i = !1;
    };
  }, [n, e]), _e(a, t);
}
function je({
  open: e,
  projects: t,
  onClose: n,
  onBuilt: a
}) {
  const r = w(), i = Ne(e, t), [l, o] = g(""), [s, c] = g(null), [h, p] = g(null);
  v(() => {
    e && (o(""), p(null), c(null));
  }, [e]);
  const f = async (u) => {
    c(u), p(null);
    try {
      const x = await r.post(`${_}/build`, { repo_path: u });
      a(x.repo_key);
    } catch (x) {
      p(z(x, "add this project"));
    } finally {
      c(null);
    }
  };
  return /* @__PURE__ */ d(q, { open: e, onClose: n, title: "Add project", maxWidth: 520, dismissDisabled: s !== null, children: /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    i.length > 0 && /* @__PURE__ */ m("div", { children: [
      /* @__PURE__ */ d("div", { style: { ...b, fontSize: 12, marginBottom: 4 }, children: "Recent projects" }),
      /* @__PURE__ */ d("div", { style: { maxHeight: 220, overflowY: "auto" }, children: i.map((u) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "sm-plain sm-row",
          title: u.path,
          disabled: s !== null,
          onClick: () => void f(u.path),
          children: [
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: u.name }),
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { ...b, marginLeft: "auto", fontSize: 12 }, children: u.parent })
          ]
        },
        u.path
      )) })
    ] }),
    /* @__PURE__ */ m(
      "form",
      {
        onSubmit: (u) => {
          u.preventDefault(), l.trim() && f(l.trim());
        },
        children: [
          /* @__PURE__ */ d("label", { style: { display: "block", ...b, fontSize: 12, marginBottom: 4 }, htmlFor: "system-map-path", children: "Or type the full path to a git repo" }),
          /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ d(
              re,
              {
                id: "system-map-path",
                placeholder: "/path/to/repo",
                value: l,
                disabled: s !== null,
                autoFocus: !0,
                onChange: (u) => o(u.target.value),
                style: { flex: 1, minWidth: 0 }
              }
            ),
            /* @__PURE__ */ d(I, { primary: !0, type: "submit", disabled: s !== null || !l.trim(), children: "Add" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ d("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: s !== null ? `Building ${s.split("/").pop()}. This can take a minute.` : h })
  ] }) });
}
function Le({
  project: e,
  hint: t,
  onBuilt: n,
  onRemove: a
}) {
  const r = w(), [i, l] = g(!1), [o, s] = g(null), [c, h] = g(null), p = H(e.status, e.behind, e.ref), f = Ee(e.intent), u = async () => {
    s("Rebuilding"), h(null);
    try {
      await r.post(`${_}/build`, { repo: e.repo_key }), n();
    } catch ($) {
      h(z($, "rebuild this project"));
    } finally {
      s(null);
    }
  }, x = async () => {
    s("Removing"), h(null);
    try {
      await a(e.repo_key);
    } catch ($) {
      h(z($, "remove this project")), s(null);
    }
  };
  return /* @__PURE__ */ m("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": p.tone }),
      /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, whiteSpace: "nowrap" }, children: p.label }),
      /* @__PURE__ */ d("span", { style: { flex: 1 } }),
      /* @__PURE__ */ d(I, { disabled: o !== null || e.status === "missing", onClick: () => void u(), children: o === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ d(I, { danger: !0, disabled: o !== null, onClick: () => l(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ d("div", { className: "sm-mono sm-ellipsis", style: { ...b, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ m("div", { style: { ...b, fontSize: 12, marginTop: 2 }, children: [
      C(e.tables, "table"),
      ", built ",
      Ie(e.built_at, Date.now() / 1e3)
    ] }),
    i && /* @__PURE__ */ m("div", { role: "alert", style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border, #e4e4e7)" }, "data-testid": "confirm-remove", children: [
      /* @__PURE__ */ m("p", { style: { margin: "0 0 8px" }, children: [
        "Remove ",
        e.name,
        " from System Map? This deletes its model",
        f ? ` and ${f}` : "",
        " for good. The repo itself isn't touched."
      ] }),
      /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ d(I, { danger: !0, disabled: o !== null, onClick: () => void x(), autoFocus: !0, children: o === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ d(I, { disabled: o !== null, onClick: () => l(!1), children: "Keep it" })
      ] })
    ] }),
    c && /* @__PURE__ */ d("p", { style: { margin: "8px 0 0" }, children: c })
  ] });
}
function Re({
  open: e,
  projects: t,
  onClose: n,
  onBuilt: a,
  onRemoved: r
}) {
  const i = w(), l = async (o) => {
    await i.post(`${_}/repo-remove`, { repo: o }), r(o);
  };
  return /* @__PURE__ */ d(q, { open: e, onClose: n, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ m("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((o) => /* @__PURE__ */ d(Le, { project: o, hint: Z(o, t), onBuilt: a, onRemove: l }, o.repo_key)),
    t.length === 0 && /* @__PURE__ */ d("p", { style: { ...b, margin: 0 }, children: "No projects yet." })
  ] }) });
}
function ze({
  trigger: e,
  children: t,
  width: n,
  align: a = "left",
  popup: r = "dialog",
  label: i,
  block: l = !1
}) {
  const [o, s] = g(!1), c = j(null), h = j(null), p = N(() => {
    var f;
    s(!1), (f = h.current) == null || f.focus();
  }, []);
  return v(() => {
    if (!o) return;
    const f = (u) => {
      var x;
      (x = c.current) != null && x.contains(u.target) || s(!1);
    };
    return document.addEventListener("pointerdown", f), () => document.removeEventListener("pointerdown", f);
  }, [o]), /* @__PURE__ */ m(
    "span",
    {
      ref: c,
      style: { position: "relative", display: l ? "block" : "inline-flex", minWidth: 0, maxWidth: "100%" },
      onKeyDown: (f) => {
        f.key === "Escape" && o && (f.stopPropagation(), p());
      },
      onBlur: (f) => {
        var x;
        const u = f.relatedTarget;
        u && !((x = c.current) != null && x.contains(u)) && s(!1);
      },
      children: [
        e({
          ref: h,
          onClick: () => s((f) => !f),
          onKeyDown: (f) => {
            f.key === "ArrowDown" && !o && (f.preventDefault(), s(!0));
          },
          "aria-expanded": o,
          "aria-haspopup": r
        }),
        o && // The host's main can take focus, so a click on anything here that can't would land
        // there and close this before the click arrives. Focus stops here instead.
        /* @__PURE__ */ d(
          "div",
          {
            className: "sm-pop",
            tabIndex: -1,
            role: r === "dialog" ? "dialog" : void 0,
            "aria-label": r === "dialog" ? i : void 0,
            style: { top: "calc(100% + 6px)", [a]: 0, width: `min(${n}px, calc(100vw - 24px))` },
            children: t(p)
          }
        )
      ]
    }
  );
}
function mt({ label: e, children: t }) {
  const n = j(null);
  return v(() => {
    var r, i;
    (i = (r = n.current) == null ? void 0 : r.querySelector('[role="menuitem"]')) == null || i.focus();
  }, []), /* @__PURE__ */ d("div", { ref: n, role: "menu", "aria-label": e, onKeyDown: (r) => {
    var s;
    const i = [...((s = n.current) == null ? void 0 : s.querySelectorAll('[role="menuitem"]')) ?? []], l = i.indexOf(document.activeElement), o = r.key === "ArrowDown" ? l + 1 : r.key === "ArrowUp" ? l - 1 : null;
    o === null || i.length === 0 || (r.preventDefault(), i[(o + i.length) % i.length].focus());
  }, children: t });
}
function Ae() {
  return /* @__PURE__ */ d("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ d("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
const Y = (e) => `system-map-project-${e}`;
function Oe({
  projects: e,
  activeKey: t,
  close: n,
  onPick: a,
  onAdd: r,
  onManage: i
}) {
  const [l, o] = g(""), s = Ce(e, l), [c, h] = g(() => Math.max(0, s.findIndex((u) => u.repo_key === t))), p = Math.min(c, s.length - 1), f = (u) => {
    if (u.key === "ArrowDown" || u.key === "ArrowUp") {
      if (u.preventDefault(), s.length === 0) return;
      h((p + (u.key === "ArrowDown" ? 1 : -1) + s.length) % s.length);
    } else u.key === "Enter" && s[p] && (u.preventDefault(), n(), a(s[p].repo_key));
  };
  return /* @__PURE__ */ m(T, { children: [
    /* @__PURE__ */ d(
      F,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Find a project",
        "aria-expanded": !0,
        "aria-controls": "system-map-project-list",
        "aria-activedescendant": s[p] ? Y(s[p].repo_key) : void 0,
        placeholder: "Find a project",
        value: l,
        onKeyDown: f,
        onChange: (u) => {
          o(u.target.value), h(0);
        }
      }
    ),
    /* @__PURE__ */ d("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: s.map((u, x) => {
      const $ = Z(u, e);
      return /* @__PURE__ */ m(
        "li",
        {
          id: Y(u.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": u.repo_key === t,
          "data-active": x === p,
          title: u.repo,
          onMouseEnter: () => h(x),
          onClick: () => {
            n(), a(u.repo_key);
          },
          children: [
            /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": H(u.status, u.behind, u.ref).tone }),
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: u.name }),
            $ && /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { ...b, fontSize: 12 }, children: $ }),
            /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: $e(u) })
          ]
        },
        u.repo_key
      );
    }) }),
    s.length === 0 && /* @__PURE__ */ d("p", { style: { ...b, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ d("div", { className: "sm-rule" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: r, children: "Add project" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: i, children: "Manage projects" })
  ] });
}
function ht({
  projects: e,
  activeKey: t,
  compact: n = !1,
  onPick: a,
  onReload: r
}) {
  const i = e.find((p) => p.repo_key === t), [l, o] = g(null), s = () => o(null);
  return { menu: /* @__PURE__ */ d(
    ze,
    {
      width: 340,
      label: "Projects",
      block: n,
      trigger: (p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${n ? " sm-compact" : ""}`,
          title: i == null ? void 0 : i.repo,
          "aria-label": `Project: ${(i == null ? void 0 : i.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...p,
          children: [
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", children: i == null ? void 0 : i.name }),
            /* @__PURE__ */ d(Ae, {})
          ]
        }
      ),
      children: (p) => /* @__PURE__ */ d(
        Oe,
        {
          projects: e,
          activeKey: t,
          close: p,
          onPick: a,
          onAdd: () => {
            p(), o("add");
          },
          onManage: () => {
            p(), o("manage");
          }
        }
      )
    }
  ), dialogs: /* @__PURE__ */ m(T, { children: [
    /* @__PURE__ */ d(
      je,
      {
        open: l === "add",
        projects: e,
        onClose: s,
        onBuilt: (p) => {
          s(), r(), a(p);
        }
      }
    ),
    /* @__PURE__ */ d(
      Re,
      {
        open: l === "manage",
        projects: e,
        onClose: s,
        onBuilt: r,
        onRemoved: (p) => {
          const f = e.find((u) => u.repo_key !== p);
          f || s(), p === t && f && a(f.repo_key), r();
        }
      }
    )
  ] }) };
}
export {
  le as A,
  Xe as B,
  Ae as C,
  ze as D,
  H as E,
  st as F,
  B as G,
  ht as H,
  Be as I,
  qe as J,
  z as K,
  _ as L,
  b as M,
  Pe as N,
  ct as O,
  pt as P,
  ft as Q,
  C as R,
  se as S,
  Fe as T,
  W as a,
  Ie as b,
  He as c,
  Ue as d,
  Ke as e,
  Ye as f,
  y as g,
  S as h,
  mt as i,
  je as j,
  tt as k,
  nt as l,
  it as m,
  rt as n,
  lt as o,
  Ze as p,
  ut as q,
  ot as r,
  A as s,
  Ve as t,
  et as u,
  dt as v,
  Ge as w,
  at as x,
  Je as y,
  Qe as z
};
