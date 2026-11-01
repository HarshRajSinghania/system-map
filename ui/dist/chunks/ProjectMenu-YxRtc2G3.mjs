import { jsxs as m, jsx as d, Fragment as T } from "react/jsx-runtime";
import { SearchInput as F, Badge as te, Modal as Y, Input as ne, Btn as N } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as I, useEffect as x, useRef as j } from "react";
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
  position: absolute; z-index: 60; box-sizing: border-box; padding: 6px; border-radius: 10px;
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
.sm-notice { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; background: var(--bg-elevated, #fff); color: var(--text, #18181b); font-size: 13px; }
.sm-manage { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.sm-manage-row { padding: 10px 12px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; font-size: 13px; }
.sm-mono { font-family: var(--mono, ui-monospace, Menlo, monospace); font-size: 12px; }
`;
if (!document.getElementById(U)) {
  const e = document.createElement("style");
  e.id = U, e.textContent = ie, document.head.appendChild(e);
}
const O = { fontFamily: "var(--mono, ui-monospace, monospace)" }, b = { color: "var(--muted, #71717a)" }, re = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function ae({ severity: e }) {
  return /* @__PURE__ */ d("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ d(te, { variant: re[e], children: e }) });
}
function Te({
  tables: e,
  selected: t,
  flagged: n,
  working: a,
  onSelect: i
}) {
  const [r, l] = g(""), o = e.filter((s) => s.name.includes(r.trim().toLowerCase()));
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(
      F,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: r,
        onChange: (s) => l(s.target.value)
      }
    ),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: o.map((s) => /* @__PURE__ */ m(
      "button",
      {
        onClick: () => i(s.id),
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
function Fe({
  nodes: e,
  focus: t,
  onSelect: n
}) {
  const [a, i] = g(""), r = a.trim().toLowerCase(), l = e.filter((c) => c.kind === "area").sort((c, h) => (h.lines ?? 0) - (c.lines ?? 0)), o = e.filter((c) => c.kind === "module"), s = (c, h, p) => /* @__PURE__ */ m(
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
    /* @__PURE__ */ d(F, { "aria-label": "Filter modules", placeholder: "Filter modules", value: a, onChange: (c) => i(c.target.value) }),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: l.map((c) => {
      const h = o.filter((u) => u.area === c.id && u.path !== c.path), p = h.filter((u) => u.name.toLowerCase().includes(r)), f = r !== "" || t === c.id || h.some((u) => u.id === t);
      return r && p.length === 0 && !c.name.toLowerCase().includes(r) ? null : /* @__PURE__ */ m("div", { children: [
        s(c, 0, c.path === "." ? c.name : (c.path ?? c.name).replace(/^src\//, "")),
        f && p.map((u) => s(u, 1, u.name))
      ] }, c.id);
    }) })
  ] });
}
function se({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ d(T, { children: e.map((n) => /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ d(ae, { severity: n.severity }),
    /* @__PURE__ */ d("span", { style: { flex: 1 }, children: n.title }),
    t && /* @__PURE__ */ d("button", { onClick: () => t(n), style: oe, children: "Ask" })
  ] }, n.id)) });
}
const oe = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function Be({ node: e, onAsk: t }) {
  const n = e.constraints.filter((i) => i.kind !== "check"), a = e.constraints.filter((i) => i.kind === "check");
  return /* @__PURE__ */ m("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ d("p", { style: { ...b, ...O, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ d(k, { title: "Findings", children: /* @__PURE__ */ d(se, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ d(k, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ d("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ d("tbody", { children: e.columns.map((i) => /* @__PURE__ */ m("tr", { title: i.source, children: [
      /* @__PURE__ */ d("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.name }),
      /* @__PURE__ */ d("td", { style: { ...b, ...O, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: i.type }),
      /* @__PURE__ */ d("td", { style: { ...b, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: i.nullable ? "null" : "not null" })
    ] }, i.name)) }) }) }),
    n.length > 0 && /* @__PURE__ */ d(k, { title: "Keys", children: /* @__PURE__ */ d("ul", { style: E, children: n.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.kind.replace("_", " "),
      " (",
      i.columns.join(", "),
      ")",
      i.references ? ` to ${i.references}, on delete ${i.on_delete}` : ""
    ] }, i.name)) }) }),
    a.length > 0 && /* @__PURE__ */ d(k, { title: "Checks", children: /* @__PURE__ */ d("ul", { style: E, children: a.map((i) => /* @__PURE__ */ d("li", { title: i.source, style: { ...O, fontSize: 12, overflowWrap: "anywhere" }, children: i.expression }, i.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ d(k, { title: "Indexes", children: /* @__PURE__ */ d("ul", { style: E, children: e.indexes.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      " (",
      i.columns.join(", "),
      ")",
      i.unique ? ", unique" : "",
      i.partial ? ", partial" : ""
    ] }, i.name)) }) }),
    e.schema !== "main" && /* @__PURE__ */ d(k, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ d("ul", { style: E, children: e.policies.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      ": ",
      i.command,
      " for ",
      i.roles.join(", ")
    ] }, i.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ d(k, { title: "Triggers", children: /* @__PURE__ */ d("ul", { style: E, children: e.triggers.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      ": ",
      i.timing,
      " ",
      i.events.join(", ")
    ] }, i.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ d(k, { title: "Notes", children: e.reads.map((i, r) => /* @__PURE__ */ d("p", { style: { margin: "0 0 6px" }, children: i.text }, r)) })
  ] });
}
const le = /^API (\d{3}): ([\s\S]*)$/;
function de(e) {
  const t = e ?? {};
  if (typeof t.status == "number") return { status: t.status, body: t.body ?? "" };
  const n = le.exec(typeof t.message == "string" ? t.message : "");
  return n ? { status: Number(n[1]), body: n[2] } : { status: null, body: "" };
}
function ce(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.error == "string" && t.error ? t.error : null;
  } catch {
    return null;
  }
}
function L(e, t) {
  const { status: n, body: a } = de(e);
  if (n === null) return `Couldn't ${t}. Check the dashboard is still connected, then try again.`;
  if (n === 400 || n === 404) {
    const i = ce(a);
    if (i) return i;
  }
  return n === 401 || n === 403 ? `Couldn't ${t}, because System Map isn't allowed to. Check its permissions on its Details page.` : n >= 500 ? `Couldn't ${t}, because System Map's backend isn't answering. Try again in a moment.` : `Couldn't ${t}. Try again.`;
}
const ue = /* @__PURE__ */ new Set(["planned", "partial"]), B = "group:tables", y = "group:routes", S = "group:jobs";
function V(e) {
  return `${e.files} ${e.files === 1 ? "file" : "files"}, ${e.lines} lines`;
}
function W(e) {
  return e === "." ? "root files" : e.replace(/^src\//, "");
}
function pe(e) {
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : W(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: W(e.path ?? e.name), subtitle: V(e) };
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
function z(e, t) {
  const n = e.nodes.filter((l) => l.kind === "route"), a = n.filter((l) => l.route_kind === "api").length, i = e.nodes.filter((l) => l.kind === "job").length, r = [];
  return n.length && r.push({ id: y, kind: "group", title: "Routes", subtitle: `${n.length - a} pages, ${a} API` }), t && r.push({ id: B, kind: "group", title: "Database", subtitle: `${t} ${t === 1 ? "table" : "tables"}` }), i && r.push({ id: S, kind: "group", title: "Scheduled jobs", subtitle: `${i} jobs` }), r;
}
function fe(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const me = 3, he = 24;
function J(e, t) {
  return !!(e && t && (e === t || e.startsWith(`${t}/`)));
}
function G(e, t) {
  if (e.startsWith("table:")) return B;
  const n = t.byId.get(e);
  return n ? n.status === "proposed" ? e : (n.kind === "module" || n.kind === "area") && J(n.path, t.routesDir) ? y : n.kind === "module" ? n.area === t.open ? e : n.area ?? e : n.kind === "route" ? t.expanded === y ? e : y : n.kind === "job" ? t.expanded === S ? e : S : e : null;
}
function Q(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !ue.has(e.status));
}
function P(e, t, n, a) {
  const i = /* @__PURE__ */ new Map();
  for (const r of e.edges) {
    if (Q(t.byId.get(r.source), n)) continue;
    const l = G(r.source, t), o = G(r.target, t);
    if (!l || !o || l === o || !a(l, o)) continue;
    const s = `${l}|${o}|${r.kind}`, c = i.get(s);
    c ? c.count += r.count : i.set(s, { id: s, source: l, target: o, kind: r.kind, count: r.count, proposed: r.proposed });
  }
  return [...i.values()];
}
function R(e, t, n) {
  const a = [];
  for (const i of e) {
    const r = n.find((o) => o.id === i), l = t.byId.get(i);
    r ? a.push(r) : l ? a.push(pe(l)) : i.startsWith("table:") && a.push(fe(i));
  }
  return a;
}
function ge(e, t, n, a) {
  const i = z(e, n), r = P(e, t, a, () => !0), l = r.length <= he ? r : r.filter((s) => s.kind !== "imports" || s.count >= me), o = new Set(i.map((s) => s.id));
  for (const s of e.nodes)
    s.kind === "area" && !J(s.path, t.routesDir) && o.add(s.id), s.kind === "service" && o.add(s.id), s.kind === "plan" && !Q(s, a) && o.add(s.id), s.status === "proposed" && o.add(s.id);
  return { cards: R(o, t, i), lines: l.filter((s) => o.has(s.source) && o.has(s.target)), hidden: r.length - l.length };
}
function be(e, t, n, a) {
  const i = new Set(e.nodes.filter((o) => o.area === t.open && o.kind === "module").map((o) => o.id)), r = P(
    e,
    t,
    a,
    (o, s) => (i.has(o) || i.has(s)) && !o.startsWith("area:") && !s.startsWith("area:")
  ), l = new Set(i);
  for (const o of r)
    l.add(o.source), l.add(o.target);
  return { cards: R(l, t, z(e, n)), lines: r };
}
function ve(e, t, n, a) {
  const i = t.expanded === y ? "route" : "job", r = new Set(e.nodes.filter((s) => s.kind === i).map((s) => s.id)), l = P(e, t, a, (s, c) => r.has(s) || r.has(c)), o = new Set(r);
  for (const s of l)
    o.add(s.source), o.add(s.target);
  return { cards: R(o, t, z(e, n)), lines: l };
}
function xe(e, t, n) {
  const a = [], i = /* @__PURE__ */ new Set([n]);
  for (const r of e.edges)
    r.source !== n && r.target !== n || (i.add(r.source), i.add(r.target), a.push({ id: `${r.source}|${r.target}|${r.kind}`, source: r.source, target: r.target, kind: r.kind, count: r.count }));
  return { cards: R(i, t, []), lines: a };
}
function Pe(e, t, n) {
  const a = new Map(e.nodes.map((o) => [o.id, o])), i = new Set(t), r = /* @__PURE__ */ new Map();
  for (const o of e.edges) {
    if (!i.has(o.source) || !i.has(o.target)) continue;
    const s = `${o.source}|${o.target}|${o.kind}`;
    r.set(s, { id: s, source: o.source, target: o.target, kind: o.kind, count: o.count, proposed: o.proposed });
  }
  return { cards: R(i, { byId: a }, z(e, n)), lines: [...r.values()] };
}
function X(e) {
  if (e.routes_dir) return e.routes_dir;
  const t = e.nodes.find((a) => a.kind === "route"), n = t == null ? void 0 : t.evidence[0];
  return n ? n.slice(0, n.lastIndexOf("/")) : null;
}
function He(e, t, n, a) {
  const i = new Map(e.nodes.map((h) => [h.id, h])), r = X(e), l = t === `area:${r}` ? y : t, o = l != null && l.startsWith("area:") ? l : null, s = l === y || l === S ? l : null, c = { byId: i, open: o, expanded: s, routesDir: r };
  return l ? o ? be(e, c, n, a) : s ? ve(e, c, n, a) : xe(e, c, l) : ge(e, c, n, a);
}
function Ue(e, t) {
  const n = [{ id: null, label: "System" }];
  if (!t) return n;
  if (t === y || t === `area:${X(e)}`) return [...n, { id: t, label: "Routes" }];
  if (t === S) return [...n, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...n, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const a = e.nodes.find((i) => i.id === t);
  if (!a) return n;
  if (a.kind === "area") return [...n, { id: t, label: W(a.path ?? a.name) }];
  if (a.kind === "module") {
    const i = e.nodes.find((r) => r.id === a.area);
    return [
      ...n,
      { id: a.area ?? null, label: W((i == null ? void 0 : i.path) ?? "") },
      { id: t, label: a.name }
    ];
  }
  return a.kind === "route" ? [...n, { id: y, label: "Routes" }, { id: t, label: a.name }] : a.kind === "job" ? [...n, { id: S, label: "Scheduled jobs" }, { id: t, label: a.name }] : [...n, { id: t, label: a.name }];
}
const ye = {
  [B]: "table:",
  [y]: "route:",
  [S]: "job:"
};
function Ve(e, t) {
  const n = new Set(t[e] ?? []), a = ye[e];
  if (a)
    for (const [i, r] of Object.entries(t))
      i.startsWith(a) && r.forEach((l) => n.add(l));
  return [...n].sort();
}
function Ge(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function qe(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function Ke(e, t) {
  return t ? t.overlaps.filter((n) => [...n.schema, ...n.schema_and_code, ...n.code, ...n.modules].includes(e)) : [];
}
function Ye(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, a] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    n.startsWith("table:") && t.set(n, a.length);
  return t;
}
function Je(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function Qe(e, t) {
  const n = new Set(t);
  return {
    tables: e.tables.filter((a) => n.has(a.id)),
    edges: e.edges.filter((a) => n.has(a.source) && n.has(a.target))
  };
}
function Xe(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
const _ = "/apps/system-map/api";
function A(e, t) {
  return t ? `${_}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${_}${e}`;
}
const M = "system-map.repo", D = "system-map:project";
function Ze() {
  var h, p;
  const e = w(), [t, n] = g([]), [a, i] = g(!1), [r, l] = g(() => localStorage.getItem(M)), o = I(async () => {
    try {
      const f = await e.get(`${_}/repos`);
      n(f.repos);
    } catch {
      n([]);
    } finally {
      i(!0);
    }
  }, [e]);
  x(() => {
    o();
  }, [o]), x(() => {
    const f = () => {
      l(localStorage.getItem(M)), o();
    };
    return window.addEventListener(D, f), () => window.removeEventListener(D, f);
  }, [o]);
  const s = I((f) => {
    localStorage.setItem(M, f), window.dispatchEvent(new Event(D));
  }, []), c = ((h = t.find((f) => f.repo_key === r)) == null ? void 0 : h.repo_key) ?? ((p = t[0]) == null ? void 0 : p.repo_key) ?? null;
  return { repos: t, active: c, loaded: a, choose: s, reload: o };
}
function et(e) {
  const t = w(), [n, a] = g(null), [i, r] = g(null), l = j(e);
  l.current = e;
  const o = I(async () => {
    if (!e) {
      a(null);
      return;
    }
    try {
      const s = await t.get(A("/overview", e));
      if (l.current !== e) return;
      a(s), r(null);
    } catch (s) {
      if (l.current !== e) return;
      a(null), r(L(s, "load this project"));
    }
  }, [t, e]);
  return x(() => {
    r(null), o();
  }, [o]), { overview: (n == null ? void 0 : n.manifest.repo_key) === e ? n : null, error: i, refresh: o };
}
function tt(e, t, n) {
  const a = w(), [i, r] = g({ repo: t, value: null, failed: !1 });
  return x(() => {
    if (!n) return;
    let l = !0;
    return a.get(A(e, t)).then((o) => {
      l && r({ repo: t, value: o, failed: !1 });
    }).catch(() => {
      l && r({ repo: t, value: null, failed: !0 });
    }), () => {
      l = !1;
    };
  }, [a, e, t, n]), i.repo === t ? { value: i.value, failed: i.failed } : { value: null, failed: !1 };
}
function nt(e, t, n) {
  const a = w(), [i, r] = g(null);
  return x(() => {
    if (!e) {
      r(null);
      return;
    }
    let l = !0;
    return a.get(A(`/proposal?id=${encodeURIComponent(e)}`, t)).then((o) => {
      l && r(o);
    }).catch(() => {
      l && r(null);
    }), () => {
      l = !1;
    };
  }, [a, e, t, n]), i;
}
function it(e, t, n) {
  const a = w(), [i, r] = g({ repo: t, value: null, failed: !1 }), [l, o] = g(null), s = j(t);
  s.current = t;
  const c = I(async () => {
    if (t)
      try {
        const p = await a.get(A(e, t));
        if (s.current !== t) return;
        r({ repo: t, value: p, failed: !1 }), o(Date.now());
      } catch {
        s.current === t && r({ repo: t, value: null, failed: !0 });
      }
  }, [a, e, t]);
  x(() => {
    c();
    const p = window.setInterval(() => {
      document.visibilityState === "visible" && c();
    }, n);
    return () => window.clearInterval(p);
  }, [c, n]);
  const h = i.repo === t;
  return { value: h ? i.value : null, failed: h && i.failed, checkedAt: l, refresh: c };
}
function rt(e, t = null) {
  const n = w(), [a, i] = g(null);
  return x(() => {
    if (!e) {
      i(null);
      return;
    }
    let r = !0;
    return n.get(A(`/node?id=${encodeURIComponent(e)}`, t)).then((l) => {
      r && i(l);
    }).catch(() => {
      r && i(null);
    }), () => {
      r = !1;
    };
  }, [n, e, t]), a;
}
const we = ["map", "data", "plan", "risk", "worktrees", "findings", "explore"];
function at(e) {
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
const ke = { postgres: "Postgres", sqlite: "SQLite" };
function st(e) {
  const t = [
    e.tables ? `${C(e.tables, "table")} from ${ke[e.engine ?? ""] ?? e.engine}` : "No tables found",
    e.routes ? `${C(e.routes, "route")}, ${e.route_style}` : "No routes found",
    `${C(e.code_files, "code file")}, ${C(e.links, "link")}`
  ];
  return e.git || t.push("No git history, so no churn or worktrees"), t;
}
function Se(e) {
  return e.status === "current" ? C(e.tables, "table") : H(e.status, e.behind, e.ref).label;
}
function Z(e, t) {
  return t.filter((a) => a.name === e.name).length > 1 ? e.parent : null;
}
function $e(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.filter((a) => a.name.toLowerCase().includes(n) || a.repo.toLowerCase().includes(n)) : e;
}
function q(e) {
  return e.length > 1 ? e.replace(/\/+$/, "") : e;
}
function Ce(e, t) {
  const n = new Set(t.map((r) => q(r.repo))), a = /* @__PURE__ */ new Set(), i = [];
  for (const r of e) {
    const l = q(r);
    if (n.has(l) || a.has(l)) continue;
    a.add(l);
    const o = l.split("/").filter(Boolean);
    i.push({ path: l, name: o[o.length - 1] ?? l, parent: o[o.length - 2] ?? "" });
  }
  return i;
}
function _e(e) {
  const n = [
    [e.proposals, "proposal", "proposals"],
    [e.use_cases, "use case", "use cases"],
    [e.views, "saved view", "saved views"]
  ].filter(([a]) => a > 0).map(([a, i, r]) => `${a} ${a === 1 ? i : r}`);
  return n.length === 0 ? "" : n.length === 1 ? n[0] : `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}
function Ee(e, t) {
  const n = Math.max(0, t - e);
  return n < 60 ? "just now" : n < 3600 ? `${Math.floor(n / 60)}m ago` : n < 86400 ? `${Math.floor(n / 3600)}h ago` : `${Math.floor(n / 86400)}d ago`;
}
const ee = (e) => `system-map.view.${e}`;
function ot(e, t) {
  if (!t) return "map";
  const n = e.getItem(ee(t));
  return we.find((a) => a === n) ?? "map";
}
function lt(e, t, n) {
  e.setItem(ee(t), n);
}
function dt(e) {
  return `system-map-design-${e}`;
}
function Ne(e, t) {
  const n = w(), [a, i] = g([]);
  return x(() => {
    if (!e) return;
    let r = !0;
    return n.get("/api/recent-projects").then((l) => {
      r && i(Array.isArray(l.dirs) ? l.dirs.filter((o) => typeof o == "string") : []);
    }).catch(() => {
      r && i([]);
    }), () => {
      r = !1;
    };
  }, [n, e]), Ce(a, t);
}
function Ie({
  open: e,
  projects: t,
  onClose: n,
  onBuilt: a
}) {
  const i = w(), r = Ne(e, t), [l, o] = g(""), [s, c] = g(null), [h, p] = g(null);
  x(() => {
    e && (o(""), p(null), c(null));
  }, [e]);
  const f = async (u) => {
    c(u), p(null);
    try {
      const v = await i.post(`${_}/build`, { repo_path: u });
      a(v.repo_key);
    } catch (v) {
      p(L(v, "add this project"));
    } finally {
      c(null);
    }
  };
  return /* @__PURE__ */ d(Y, { open: e, onClose: n, title: "Add project", maxWidth: 520, dismissDisabled: s !== null, children: /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    r.length > 0 && /* @__PURE__ */ m("div", { children: [
      /* @__PURE__ */ d("div", { style: { ...b, fontSize: 12, marginBottom: 4 }, children: "Recent projects" }),
      /* @__PURE__ */ d("div", { style: { maxHeight: 220, overflowY: "auto" }, children: r.map((u) => /* @__PURE__ */ m(
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
              ne,
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
            /* @__PURE__ */ d(N, { primary: !0, type: "submit", disabled: s !== null || !l.trim(), children: "Add" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ d("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: s !== null ? `Building ${s.split("/").pop()}. This can take a minute.` : h })
  ] }) });
}
function je({
  project: e,
  hint: t,
  onBuilt: n,
  onRemove: a
}) {
  const i = w(), [r, l] = g(!1), [o, s] = g(null), [c, h] = g(null), p = H(e.status, e.behind, e.ref), f = _e(e.intent), u = async () => {
    s("Rebuilding"), h(null);
    try {
      await i.post(`${_}/build`, { repo: e.repo_key }), n();
    } catch ($) {
      h(L($, "rebuild this project"));
    } finally {
      s(null);
    }
  }, v = async () => {
    s("Removing"), h(null);
    try {
      await a(e.repo_key);
    } catch ($) {
      h(L($, "remove this project")), s(null);
    }
  };
  return /* @__PURE__ */ m("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": p.tone }),
      /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, whiteSpace: "nowrap" }, children: p.label }),
      /* @__PURE__ */ d("span", { style: { flex: 1 } }),
      /* @__PURE__ */ d(N, { disabled: o !== null || e.status === "missing", onClick: () => void u(), children: o === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ d(N, { danger: !0, disabled: o !== null, onClick: () => l(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ d("div", { className: "sm-mono sm-ellipsis", style: { ...b, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ m("div", { style: { ...b, fontSize: 12, marginTop: 2 }, children: [
      C(e.tables, "table"),
      ", built ",
      Ee(e.built_at, Date.now() / 1e3)
    ] }),
    r && /* @__PURE__ */ m("div", { role: "alert", style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border, #e4e4e7)" }, "data-testid": "confirm-remove", children: [
      /* @__PURE__ */ m("p", { style: { margin: "0 0 8px" }, children: [
        "Remove ",
        e.name,
        " from System Map? This deletes its model",
        f ? ` and ${f}` : "",
        " for good. The repo itself isn't touched."
      ] }),
      /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ d(N, { danger: !0, disabled: o !== null, onClick: () => void v(), autoFocus: !0, children: o === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ d(N, { disabled: o !== null, onClick: () => l(!1), children: "Keep it" })
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
  onRemoved: i
}) {
  const r = w(), l = async (o) => {
    await r.post(`${_}/repo-remove`, { repo: o }), i(o);
  };
  return /* @__PURE__ */ d(Y, { open: e, onClose: n, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ m("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((o) => /* @__PURE__ */ d(je, { project: o, hint: Z(o, t), onBuilt: a, onRemove: l }, o.repo_key)),
    t.length === 0 && /* @__PURE__ */ d("p", { style: { ...b, margin: 0 }, children: "No projects yet." })
  ] }) });
}
function Ae({
  trigger: e,
  children: t,
  width: n,
  align: a = "left",
  popup: i = "dialog",
  label: r,
  block: l = !1
}) {
  const [o, s] = g(!1), c = j(null), h = j(null), p = I(() => {
    var f;
    s(!1), (f = h.current) == null || f.focus();
  }, []);
  return x(() => {
    if (!o) return;
    const f = (u) => {
      var v;
      (v = c.current) != null && v.contains(u.target) || s(!1);
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
        var v;
        const u = f.relatedTarget;
        u && !((v = c.current) != null && v.contains(u)) && s(!1);
      },
      children: [
        e({
          ref: h,
          onClick: () => s((f) => !f),
          onKeyDown: (f) => {
            f.key === "ArrowDown" && !o && (f.preventDefault(), s(!0));
          },
          "aria-expanded": o,
          "aria-haspopup": i
        }),
        o && /* @__PURE__ */ d(
          "div",
          {
            className: "sm-pop",
            role: i === "dialog" ? "dialog" : void 0,
            "aria-label": i === "dialog" ? r : void 0,
            style: { top: "calc(100% + 6px)", [a]: 0, width: `min(${n}px, calc(100vw - 24px))` },
            children: t(p)
          }
        )
      ]
    }
  );
}
function ct({ label: e, children: t }) {
  const n = j(null);
  return x(() => {
    var i, r;
    (r = (i = n.current) == null ? void 0 : i.querySelector('[role="menuitem"]')) == null || r.focus();
  }, []), /* @__PURE__ */ d("div", { ref: n, role: "menu", "aria-label": e, onKeyDown: (i) => {
    var s;
    const r = [...((s = n.current) == null ? void 0 : s.querySelectorAll('[role="menuitem"]')) ?? []], l = r.indexOf(document.activeElement), o = i.key === "ArrowDown" ? l + 1 : i.key === "ArrowUp" ? l - 1 : null;
    o === null || r.length === 0 || (i.preventDefault(), r[(o + r.length) % r.length].focus());
  }, children: t });
}
function Le() {
  return /* @__PURE__ */ d("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ d("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
const K = (e) => `system-map-project-${e}`;
function We({
  projects: e,
  activeKey: t,
  close: n,
  onPick: a,
  onAdd: i,
  onManage: r
}) {
  const [l, o] = g(""), s = $e(e, l), [c, h] = g(() => Math.max(0, s.findIndex((u) => u.repo_key === t))), p = Math.min(c, s.length - 1), f = (u) => {
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
        "aria-activedescendant": s[p] ? K(s[p].repo_key) : void 0,
        placeholder: "Find a project",
        value: l,
        onKeyDown: f,
        onChange: (u) => {
          o(u.target.value), h(0);
        }
      }
    ),
    /* @__PURE__ */ d("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: s.map((u, v) => {
      const $ = Z(u, e);
      return /* @__PURE__ */ m(
        "li",
        {
          id: K(u.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": u.repo_key === t,
          "data-active": v === p,
          title: u.repo,
          onMouseEnter: () => h(v),
          onClick: () => {
            n(), a(u.repo_key);
          },
          children: [
            /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": H(u.status, u.behind, u.ref).tone }),
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: u.name }),
            $ && /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { ...b, fontSize: 12 }, children: $ }),
            /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: Se(u) })
          ]
        },
        u.repo_key
      );
    }) }),
    s.length === 0 && /* @__PURE__ */ d("p", { style: { ...b, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ d("div", { className: "sm-rule" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: i, children: "Add project" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: r, children: "Manage projects" })
  ] });
}
function ut({
  projects: e,
  activeKey: t,
  compact: n = !1,
  onPick: a,
  onReload: i
}) {
  const r = e.find((p) => p.repo_key === t), [l, o] = g(null), s = () => o(null);
  return { menu: /* @__PURE__ */ d(
    Ae,
    {
      width: 340,
      label: "Projects",
      block: n,
      trigger: (p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${n ? " sm-compact" : ""}`,
          title: r == null ? void 0 : r.repo,
          "aria-label": `Project: ${(r == null ? void 0 : r.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...p,
          children: [
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", children: r == null ? void 0 : r.name }),
            /* @__PURE__ */ d(Le, {})
          ]
        }
      ),
      children: (p) => /* @__PURE__ */ d(
        We,
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
      Ie,
      {
        open: l === "add",
        projects: e,
        onClose: s,
        onBuilt: (p) => {
          s(), i(), a(p);
        }
      }
    ),
    /* @__PURE__ */ d(
      Re,
      {
        open: l === "manage",
        projects: e,
        onClose: s,
        onBuilt: i,
        onRemoved: (p) => {
          const f = e.find((u) => u.repo_key !== p);
          f || s(), p === t && f && a(f.repo_key), i();
        }
      }
    )
  ] }) };
}
export {
  oe as A,
  H as B,
  Le as C,
  Ae as D,
  at as E,
  ut as F,
  B as G,
  Fe as H,
  Ke as I,
  L as J,
  _ as K,
  dt as L,
  b as M,
  Be as N,
  C as O,
  ae as S,
  Te as T,
  O as a,
  Ee as b,
  Pe as c,
  He as d,
  Ge as e,
  qe as f,
  y as g,
  S as h,
  ct as i,
  Ie as j,
  et as k,
  tt as l,
  it as m,
  nt as n,
  ot as o,
  Xe as p,
  lt as q,
  st as r,
  W as s,
  Ue as t,
  Ze as u,
  rt as v,
  Ve as w,
  Ye as x,
  Je as y,
  Qe as z
};
