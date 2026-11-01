import { jsxs as m, jsx as d, Fragment as O } from "react/jsx-runtime";
import { SearchInput as T, Badge as Z, Modal as K, Input as ee, Btn as j } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as E, useEffect as x, useRef as I } from "react";
import { useAppApi as w } from "@kirocrew/app-sdk";
const H = "system-map-chrome-css", te = `
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
if (!document.getElementById(H)) {
  const e = document.createElement("style");
  e.id = H, e.textContent = te, document.head.appendChild(e);
}
const W = { fontFamily: "var(--mono, ui-monospace, monospace)" }, b = { color: "var(--muted, #71717a)" }, ne = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function re({ severity: e }) {
  return /* @__PURE__ */ d("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ d(Z, { variant: ne[e], children: e }) });
}
function We({
  tables: e,
  selected: t,
  flagged: n,
  working: s,
  onSelect: r
}) {
  const [a, l] = g(""), i = e.filter((o) => o.name.includes(a.trim().toLowerCase()));
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(
      T,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: a,
        onChange: (o) => l(o.target.value)
      }
    ),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: i.map((o) => /* @__PURE__ */ m(
      "button",
      {
        onClick: () => r(o.id),
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
          /* @__PURE__ */ d("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.name }),
          /* @__PURE__ */ m("span", { style: { ...b, display: "flex", gap: 6, flexShrink: 0 }, children: [
            s != null && s.get(o.id) ? /* @__PURE__ */ m(
              "span",
              {
                title: "Worktrees changing this table or its code",
                style: { color: (s.get(o.id) ?? 0) > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" },
                children: [
                  s.get(o.id),
                  " at work"
                ]
              }
            ) : null,
            n != null && n.get(o.id) ? /* @__PURE__ */ d("span", { title: `${n.get(o.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: n.get(o.id) }) : null,
            /* @__PURE__ */ d("span", { title: `${o.columns} columns`, children: o.columns })
          ] })
        ]
      },
      o.id
    )) })
  ] });
}
function k({ title: e, children: t }) {
  return /* @__PURE__ */ m("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ d("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const _ = { margin: 0, paddingLeft: 16 };
function Le({
  nodes: e,
  focus: t,
  onSelect: n
}) {
  const [s, r] = g(""), a = s.trim().toLowerCase(), l = e.filter((u) => u.kind === "area").sort((u, h) => (h.lines ?? 0) - (u.lines ?? 0)), i = e.filter((u) => u.kind === "module"), o = (u, h, p) => /* @__PURE__ */ m(
    "button",
    {
      onClick: () => n(u.id),
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
        background: u.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ d("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p }),
        /* @__PURE__ */ d("span", { style: { ...b, fontWeight: 400, flexShrink: 0 }, title: `${u.files} files`, children: u.files })
      ]
    },
    u.id
  );
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(T, { "aria-label": "Filter modules", placeholder: "Filter modules", value: s, onChange: (u) => r(u.target.value) }),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: l.map((u) => {
      const h = i.filter((c) => c.area === u.id && c.path !== u.path), p = h.filter((c) => c.name.toLowerCase().includes(a)), f = a !== "" || t === u.id || h.some((c) => c.id === t);
      return a && p.length === 0 && !u.name.toLowerCase().includes(a) ? null : /* @__PURE__ */ m("div", { children: [
        o(u, 0, (u.path ?? u.name).replace(/^src\//, "")),
        f && p.map((c) => o(c, 1, c.name))
      ] }, u.id);
    }) })
  ] });
}
function ie({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ d(O, { children: e.map((n) => /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ d(re, { severity: n.severity }),
    /* @__PURE__ */ d("span", { style: { flex: 1 }, children: n.title }),
    t && /* @__PURE__ */ d("button", { onClick: () => t(n), style: ae, children: "Ask" })
  ] }, n.id)) });
}
const ae = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function Me({ node: e, onAsk: t }) {
  const n = e.constraints.filter((r) => r.kind !== "check"), s = e.constraints.filter((r) => r.kind === "check");
  return /* @__PURE__ */ m("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ d("p", { style: { ...b, ...W, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ d(k, { title: "Findings", children: /* @__PURE__ */ d(ie, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ d(k, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ d("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ d("tbody", { children: e.columns.map((r) => /* @__PURE__ */ m("tr", { title: r.source, children: [
      /* @__PURE__ */ d("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: r.name }),
      /* @__PURE__ */ d("td", { style: { ...b, ...W, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: r.type }),
      /* @__PURE__ */ d("td", { style: { ...b, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: r.nullable ? "null" : "not null" })
    ] }, r.name)) }) }) }),
    n.length > 0 && /* @__PURE__ */ d(k, { title: "Keys", children: /* @__PURE__ */ d("ul", { style: _, children: n.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.kind.replace("_", " "),
      " (",
      r.columns.join(", "),
      ")",
      r.references ? ` to ${r.references}, on delete ${r.on_delete}` : ""
    ] }, r.name)) }) }),
    s.length > 0 && /* @__PURE__ */ d(k, { title: "Checks", children: /* @__PURE__ */ d("ul", { style: _, children: s.map((r) => /* @__PURE__ */ d("li", { title: r.source, style: { ...W, fontSize: 12, overflowWrap: "anywhere" }, children: r.expression }, r.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ d(k, { title: "Indexes", children: /* @__PURE__ */ d("ul", { style: _, children: e.indexes.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.name,
      " (",
      r.columns.join(", "),
      ")",
      r.unique ? ", unique" : "",
      r.partial ? ", partial" : ""
    ] }, r.name)) }) }),
    /* @__PURE__ */ d(k, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ d("ul", { style: _, children: e.policies.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.name,
      ": ",
      r.command,
      " for ",
      r.roles.join(", ")
    ] }, r.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ d(k, { title: "Triggers", children: /* @__PURE__ */ d("ul", { style: _, children: e.triggers.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: [
      r.name,
      ": ",
      r.timing,
      " ",
      r.events.join(", ")
    ] }, r.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ d(k, { title: "Notes", children: e.reads.map((r, a) => /* @__PURE__ */ d("p", { style: { margin: "0 0 6px" }, children: r.text }, a)) })
  ] });
}
const se = /^API (\d{3}): ([\s\S]*)$/;
function le(e) {
  const t = e ?? {};
  if (typeof t.status == "number") return { status: t.status, body: t.body ?? "" };
  const n = se.exec(typeof t.message == "string" ? t.message : "");
  return n ? { status: Number(n[1]), body: n[2] } : { status: null, body: "" };
}
function oe(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.error == "string" && t.error ? t.error : null;
  } catch {
    return null;
  }
}
function N(e, t) {
  const { status: n, body: s } = le(e);
  if (n === null) return `Couldn't ${t}. Check the dashboard is still connected, then try again.`;
  if (n === 400 || n === 404) {
    const r = oe(s);
    if (r) return r;
  }
  return n === 401 || n === 403 ? `Couldn't ${t}, because System Map isn't allowed to. Check its permissions on its Details page.` : n >= 500 ? `Couldn't ${t}, because System Map's backend isn't answering. Try again in a moment.` : `Couldn't ${t}. Try again.`;
}
const de = /* @__PURE__ */ new Set(["planned", "partial"]), F = "group:tables", y = "group:routes", S = "group:jobs";
function z(e) {
  return e.replace(/^src\//, "");
}
function ce(e) {
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : z(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: z(e.path ?? e.name), subtitle: `${e.files} files, ${e.lines} lines` };
    case "module": {
      const t = e.area === `area:${e.path}`;
      return {
        id: e.id,
        kind: "module",
        title: t ? `${e.name} (top level)` : e.name,
        subtitle: `${e.files} files, ${e.lines} lines`
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
function D(e, t) {
  const n = e.nodes.filter((l) => l.kind === "route"), s = n.filter((l) => l.route_kind === "api").length, r = e.nodes.filter((l) => l.kind === "job").length, a = [];
  return n.length && a.push({ id: y, kind: "group", title: "Routes", subtitle: `${n.length - s} pages, ${s} API` }), t && a.push({ id: F, kind: "group", title: "Database", subtitle: `${t} ${t === 1 ? "table" : "tables"}` }), r && a.push({ id: S, kind: "group", title: "Scheduled jobs", subtitle: `${r} jobs` }), a;
}
function ue(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const pe = 3;
function U(e, t) {
  if (e.startsWith("table:")) return F;
  const n = t.byId.get(e);
  return n ? n.status === "proposed" ? e : (n.kind === "module" || n.kind === "area") && t.routesDir && n.path === t.routesDir ? y : n.kind === "module" ? n.area === t.open ? e : n.area ?? e : n.kind === "route" ? t.expanded === y ? e : y : n.kind === "job" ? t.expanded === S ? e : S : e : null;
}
function Y(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !de.has(e.status));
}
function B(e, t, n, s) {
  const r = /* @__PURE__ */ new Map();
  for (const a of e.edges) {
    if (Y(t.byId.get(a.source), n)) continue;
    const l = U(a.source, t), i = U(a.target, t);
    if (!l || !i || l === i || !s(l, i)) continue;
    const o = `${l}|${i}|${a.kind}`, u = r.get(o);
    u ? u.count += a.count : r.set(o, { id: o, source: l, target: i, kind: a.kind, count: a.count, proposed: a.proposed });
  }
  return [...r.values()];
}
function R(e, t, n) {
  const s = [];
  for (const r of e) {
    const a = n.find((i) => i.id === r), l = t.byId.get(r);
    a ? s.push(a) : l ? s.push(ce(l)) : r.startsWith("table:") && s.push(ue(r));
  }
  return s;
}
function fe(e, t, n, s) {
  const r = D(e, n), a = B(e, t, s, () => !0).filter((i) => i.kind !== "imports" || i.count >= pe), l = new Set(r.map((i) => i.id));
  for (const i of e.nodes)
    i.kind === "area" && i.path !== t.routesDir && l.add(i.id), i.kind === "service" && l.add(i.id), i.kind === "plan" && !Y(i, s) && l.add(i.id), i.status === "proposed" && l.add(i.id);
  return { cards: R(l, t, r), lines: a.filter((i) => l.has(i.source) && l.has(i.target)) };
}
function me(e, t, n, s) {
  const r = new Set(e.nodes.filter((i) => i.area === t.open && i.kind === "module").map((i) => i.id)), a = B(
    e,
    t,
    s,
    (i, o) => (r.has(i) || r.has(o)) && !i.startsWith("area:") && !o.startsWith("area:")
  ), l = new Set(r);
  for (const i of a)
    l.add(i.source), l.add(i.target);
  return { cards: R(l, t, D(e, n)), lines: a };
}
function he(e, t, n, s) {
  const r = t.expanded === y ? "route" : "job", a = new Set(e.nodes.filter((o) => o.kind === r).map((o) => o.id)), l = B(e, t, s, (o, u) => a.has(o) || a.has(u)), i = new Set(a);
  for (const o of l)
    i.add(o.source), i.add(o.target);
  return { cards: R(i, t, D(e, n)), lines: l };
}
function ge(e, t, n) {
  const s = [], r = /* @__PURE__ */ new Set([n]);
  for (const a of e.edges)
    a.source !== n && a.target !== n || (r.add(a.source), r.add(a.target), s.push({ id: `${a.source}|${a.target}|${a.kind}`, source: a.source, target: a.target, kind: a.kind, count: a.count }));
  return { cards: R(r, t, []), lines: s };
}
function Oe(e, t, n) {
  const s = new Map(e.nodes.map((i) => [i.id, i])), r = new Set(t), a = /* @__PURE__ */ new Map();
  for (const i of e.edges) {
    if (!r.has(i.source) || !r.has(i.target)) continue;
    const o = `${i.source}|${i.target}|${i.kind}`;
    a.set(o, { id: o, source: i.source, target: i.target, kind: i.kind, count: i.count, proposed: i.proposed });
  }
  return { cards: R(r, { byId: s }, D(e, n)), lines: [...a.values()] };
}
function q(e) {
  const t = e.nodes.find((s) => s.kind === "route"), n = t == null ? void 0 : t.evidence[0];
  return n ? n.slice(0, n.lastIndexOf("/")) : null;
}
function Te(e, t, n, s) {
  const r = new Map(e.nodes.map((h) => [h.id, h])), a = q(e), l = t === `area:${a}` ? y : t, i = l != null && l.startsWith("area:") ? l : null, o = l === y || l === S ? l : null, u = { byId: r, open: i, expanded: o, routesDir: a };
  return l ? i ? me(e, u, n, s) : o ? he(e, u, n, s) : ge(e, u, l) : fe(e, u, n, s);
}
function Fe(e, t) {
  const n = [{ id: null, label: "System" }];
  if (!t) return n;
  if (t === y || t === `area:${q(e)}`) return [...n, { id: t, label: "Routes" }];
  if (t === S) return [...n, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...n, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const s = e.nodes.find((r) => r.id === t);
  if (!s) return n;
  if (s.kind === "area") return [...n, { id: t, label: z(s.path ?? s.name) }];
  if (s.kind === "module") {
    const r = e.nodes.find((a) => a.id === s.area);
    return [
      ...n,
      { id: s.area ?? null, label: z((r == null ? void 0 : r.path) ?? "") },
      { id: t, label: s.name }
    ];
  }
  return s.kind === "route" ? [...n, { id: y, label: "Routes" }, { id: t, label: s.name }] : s.kind === "job" ? [...n, { id: S, label: "Scheduled jobs" }, { id: t, label: s.name }] : [...n, { id: t, label: s.name }];
}
const be = {
  [F]: "table:",
  [y]: "route:",
  [S]: "job:"
};
function Be(e, t) {
  const n = new Set(t[e] ?? []), s = be[e];
  if (s)
    for (const [r, a] of Object.entries(t))
      r.startsWith(s) && a.forEach((l) => n.add(l));
  return [...n].sort();
}
function Pe(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function He(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function Ue(e, t) {
  return t ? t.overlaps.filter((n) => [...n.schema, ...n.schema_and_code, ...n.code, ...n.modules].includes(e)) : [];
}
function Ve(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, s] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    n.startsWith("table:") && t.set(n, s.length);
  return t;
}
function Ge(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function Ke(e, t) {
  const n = new Set(t);
  return {
    tables: e.tables.filter((s) => n.has(s.id)),
    edges: e.edges.filter((s) => n.has(s.source) && n.has(s.target))
  };
}
function Ye(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
const C = "/apps/system-map/api";
function A(e, t) {
  return t ? `${C}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${C}${e}`;
}
const L = "system-map.repo", M = "system-map:project";
function qe() {
  var h, p;
  const e = w(), [t, n] = g([]), [s, r] = g(!1), [a, l] = g(() => localStorage.getItem(L)), i = E(async () => {
    try {
      const f = await e.get(`${C}/repos`);
      n(f.repos);
    } catch {
      n([]);
    } finally {
      r(!0);
    }
  }, [e]);
  x(() => {
    i();
  }, [i]), x(() => {
    const f = () => {
      l(localStorage.getItem(L)), i();
    };
    return window.addEventListener(M, f), () => window.removeEventListener(M, f);
  }, [i]);
  const o = E((f) => {
    localStorage.setItem(L, f), window.dispatchEvent(new Event(M));
  }, []), u = ((h = t.find((f) => f.repo_key === a)) == null ? void 0 : h.repo_key) ?? ((p = t[0]) == null ? void 0 : p.repo_key) ?? null;
  return { repos: t, active: u, loaded: s, choose: o, reload: i };
}
function Je(e) {
  const t = w(), [n, s] = g(null), [r, a] = g(null), l = I(e);
  l.current = e;
  const i = E(async () => {
    if (!e) {
      s(null);
      return;
    }
    try {
      const o = await t.get(A("/overview", e));
      if (l.current !== e) return;
      s(o), a(null);
    } catch (o) {
      if (l.current !== e) return;
      s(null), a(N(o, "load this project"));
    }
  }, [t, e]);
  return x(() => {
    a(null), i();
  }, [i]), { overview: (n == null ? void 0 : n.manifest.repo_key) === e ? n : null, error: r, refresh: i };
}
function Qe(e, t, n) {
  const s = w(), [r, a] = g({ repo: t, value: null, failed: !1 });
  return x(() => {
    if (!n) return;
    let l = !0;
    return s.get(A(e, t)).then((i) => {
      l && a({ repo: t, value: i, failed: !1 });
    }).catch(() => {
      l && a({ repo: t, value: null, failed: !0 });
    }), () => {
      l = !1;
    };
  }, [s, e, t, n]), r.repo === t ? { value: r.value, failed: r.failed } : { value: null, failed: !1 };
}
function Xe(e, t, n) {
  const s = w(), [r, a] = g(null);
  return x(() => {
    if (!e) {
      a(null);
      return;
    }
    let l = !0;
    return s.get(A(`/proposal?id=${encodeURIComponent(e)}`, t)).then((i) => {
      l && a(i);
    }).catch(() => {
      l && a(null);
    }), () => {
      l = !1;
    };
  }, [s, e, t, n]), r;
}
function Ze(e, t, n) {
  const s = w(), [r, a] = g({ repo: t, value: null, failed: !1 }), [l, i] = g(null), o = I(t);
  o.current = t;
  const u = E(async () => {
    if (t)
      try {
        const p = await s.get(A(e, t));
        if (o.current !== t) return;
        a({ repo: t, value: p, failed: !1 }), i(Date.now());
      } catch {
        o.current === t && a({ repo: t, value: null, failed: !0 });
      }
  }, [s, e, t]);
  x(() => {
    u();
    const p = window.setInterval(() => {
      document.visibilityState === "visible" && u();
    }, n);
    return () => window.clearInterval(p);
  }, [u, n]);
  const h = r.repo === t;
  return { value: h ? r.value : null, failed: h && r.failed, checkedAt: l, refresh: u };
}
function et(e, t = null) {
  const n = w(), [s, r] = g(null);
  return x(() => {
    if (!e) {
      r(null);
      return;
    }
    let a = !0;
    return n.get(A(`/node?id=${encodeURIComponent(e)}`, t)).then((l) => {
      a && r(l);
    }).catch(() => {
      a && r(null);
    }), () => {
      a = !1;
    };
  }, [n, e, t]), s;
}
const ve = ["map", "data", "plan", "risk", "worktrees", "findings", "explore"];
function tt(e) {
  return e.missing ? "missing" : e.error ? "unknown" : e.stale || e.map_stale ? "stale" : e.commits_behind > 0 ? "behind" : "current";
}
function P(e, t, n) {
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
function J(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function xe(e) {
  return e.status === "current" ? J(e.tables, "table") : P(e.status, e.behind, e.ref).label;
}
function Q(e, t) {
  return t.filter((s) => s.name === e.name).length > 1 ? e.parent : null;
}
function ye(e, t) {
  const n = t.trim().toLowerCase();
  return n ? e.filter((s) => s.name.toLowerCase().includes(n) || s.repo.toLowerCase().includes(n)) : e;
}
function V(e) {
  return e.length > 1 ? e.replace(/\/+$/, "") : e;
}
function we(e, t) {
  const n = new Set(t.map((a) => V(a.repo))), s = /* @__PURE__ */ new Set(), r = [];
  for (const a of e) {
    const l = V(a);
    if (n.has(l) || s.has(l)) continue;
    s.add(l);
    const i = l.split("/").filter(Boolean);
    r.push({ path: l, name: i[i.length - 1] ?? l, parent: i[i.length - 2] ?? "" });
  }
  return r;
}
function ke(e) {
  const n = [
    [e.proposals, "proposal", "proposals"],
    [e.use_cases, "use case", "use cases"],
    [e.views, "saved view", "saved views"]
  ].filter(([s]) => s > 0).map(([s, r, a]) => `${s} ${s === 1 ? r : a}`);
  return n.length === 0 ? "" : n.length === 1 ? n[0] : `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}
function Se(e, t) {
  const n = Math.max(0, t - e);
  return n < 60 ? "just now" : n < 3600 ? `${Math.floor(n / 60)}m ago` : n < 86400 ? `${Math.floor(n / 3600)}h ago` : `${Math.floor(n / 86400)}d ago`;
}
const X = (e) => `system-map.view.${e}`;
function nt(e, t) {
  if (!t) return "map";
  const n = e.getItem(X(t));
  return ve.find((s) => s === n) ?? "map";
}
function rt(e, t, n) {
  e.setItem(X(t), n);
}
function it(e) {
  return `system-map-design-${e}`;
}
function $e(e, t) {
  const n = w(), [s, r] = g([]);
  return x(() => {
    if (!e) return;
    let a = !0;
    return n.get("/api/recent-projects").then((l) => {
      a && r(Array.isArray(l.dirs) ? l.dirs.filter((i) => typeof i == "string") : []);
    }).catch(() => {
      a && r([]);
    }), () => {
      a = !1;
    };
  }, [n, e]), we(s, t);
}
function Ce({
  open: e,
  projects: t,
  onClose: n,
  onBuilt: s
}) {
  const r = w(), a = $e(e, t), [l, i] = g(""), [o, u] = g(null), [h, p] = g(null);
  x(() => {
    e && (i(""), p(null), u(null));
  }, [e]);
  const f = async (c) => {
    u(c), p(null);
    try {
      const v = await r.post(`${C}/build`, { repo_path: c });
      s(v.repo_key);
    } catch (v) {
      p(N(v, "add this project"));
    } finally {
      u(null);
    }
  };
  return /* @__PURE__ */ d(K, { open: e, onClose: n, title: "Add project", maxWidth: 520, dismissDisabled: o !== null, children: /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    a.length > 0 && /* @__PURE__ */ m("div", { children: [
      /* @__PURE__ */ d("div", { style: { ...b, fontSize: 12, marginBottom: 4 }, children: "Recent projects" }),
      /* @__PURE__ */ d("div", { style: { maxHeight: 220, overflowY: "auto" }, children: a.map((c) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "sm-plain sm-row",
          title: c.path,
          disabled: o !== null,
          onClick: () => void f(c.path),
          children: [
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: c.name }),
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { ...b, marginLeft: "auto", fontSize: 12 }, children: c.parent })
          ]
        },
        c.path
      )) })
    ] }),
    /* @__PURE__ */ m(
      "form",
      {
        onSubmit: (c) => {
          c.preventDefault(), l.trim() && f(l.trim());
        },
        children: [
          /* @__PURE__ */ d("label", { style: { display: "block", ...b, fontSize: 12, marginBottom: 4 }, htmlFor: "system-map-path", children: "Or type the full path to a git repo" }),
          /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ d(
              ee,
              {
                id: "system-map-path",
                placeholder: "/path/to/repo",
                value: l,
                disabled: o !== null,
                autoFocus: !0,
                onChange: (c) => i(c.target.value),
                style: { flex: 1, minWidth: 0 }
              }
            ),
            /* @__PURE__ */ d(j, { primary: !0, type: "submit", disabled: o !== null || !l.trim(), children: "Add" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ d("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: o !== null ? `Building ${o.split("/").pop()}. This can take a minute.` : h })
  ] }) });
}
function _e({
  project: e,
  hint: t,
  onBuilt: n,
  onRemove: s
}) {
  const r = w(), [a, l] = g(!1), [i, o] = g(null), [u, h] = g(null), p = P(e.status, e.behind, e.ref), f = ke(e.intent), c = async () => {
    o("Rebuilding"), h(null);
    try {
      await r.post(`${C}/build`, { repo: e.repo_key }), n();
    } catch ($) {
      h(N($, "rebuild this project"));
    } finally {
      o(null);
    }
  }, v = async () => {
    o("Removing"), h(null);
    try {
      await s(e.repo_key);
    } catch ($) {
      h(N($, "remove this project")), o(null);
    }
  };
  return /* @__PURE__ */ m("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": p.tone }),
      /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, whiteSpace: "nowrap" }, children: p.label }),
      /* @__PURE__ */ d("span", { style: { flex: 1 } }),
      /* @__PURE__ */ d(j, { disabled: i !== null || e.status === "missing", onClick: () => void c(), children: i === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ d(j, { danger: !0, disabled: i !== null, onClick: () => l(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ d("div", { className: "sm-mono sm-ellipsis", style: { ...b, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ m("div", { style: { ...b, fontSize: 12, marginTop: 2 }, children: [
      J(e.tables, "table"),
      ", built ",
      Se(e.built_at, Date.now() / 1e3)
    ] }),
    a && /* @__PURE__ */ m("div", { role: "alert", style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border, #e4e4e7)" }, "data-testid": "confirm-remove", children: [
      /* @__PURE__ */ m("p", { style: { margin: "0 0 8px" }, children: [
        "Remove ",
        e.name,
        " from System Map? This deletes its model",
        f ? ` and ${f}` : "",
        " for good. The repo itself isn't touched."
      ] }),
      /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ d(j, { danger: !0, disabled: i !== null, onClick: () => void v(), autoFocus: !0, children: i === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ d(j, { disabled: i !== null, onClick: () => l(!1), children: "Keep it" })
      ] })
    ] }),
    u && /* @__PURE__ */ d("p", { style: { margin: "8px 0 0" }, children: u })
  ] });
}
function je({
  open: e,
  projects: t,
  onClose: n,
  onBuilt: s,
  onRemoved: r
}) {
  const a = w(), l = async (i) => {
    await a.post(`${C}/repo-remove`, { repo: i }), r(i);
  };
  return /* @__PURE__ */ d(K, { open: e, onClose: n, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ m("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((i) => /* @__PURE__ */ d(_e, { project: i, hint: Q(i, t), onBuilt: s, onRemove: l }, i.repo_key)),
    t.length === 0 && /* @__PURE__ */ d("p", { style: { ...b, margin: 0 }, children: "No projects yet." })
  ] }) });
}
function Ee({
  trigger: e,
  children: t,
  width: n,
  align: s = "left",
  popup: r = "dialog",
  label: a,
  block: l = !1
}) {
  const [i, o] = g(!1), u = I(null), h = I(null), p = E(() => {
    var f;
    o(!1), (f = h.current) == null || f.focus();
  }, []);
  return x(() => {
    if (!i) return;
    const f = (c) => {
      var v;
      (v = u.current) != null && v.contains(c.target) || o(!1);
    };
    return document.addEventListener("pointerdown", f), () => document.removeEventListener("pointerdown", f);
  }, [i]), /* @__PURE__ */ m(
    "span",
    {
      ref: u,
      style: { position: "relative", display: l ? "block" : "inline-flex", minWidth: 0, maxWidth: "100%" },
      onKeyDown: (f) => {
        f.key === "Escape" && i && (f.stopPropagation(), p());
      },
      onBlur: (f) => {
        var v;
        const c = f.relatedTarget;
        c && !((v = u.current) != null && v.contains(c)) && o(!1);
      },
      children: [
        e({
          ref: h,
          onClick: () => o((f) => !f),
          onKeyDown: (f) => {
            f.key === "ArrowDown" && !i && (f.preventDefault(), o(!0));
          },
          "aria-expanded": i,
          "aria-haspopup": r
        }),
        i && /* @__PURE__ */ d(
          "div",
          {
            className: "sm-pop",
            role: r === "dialog" ? "dialog" : void 0,
            "aria-label": r === "dialog" ? a : void 0,
            style: { top: "calc(100% + 6px)", [s]: 0, width: `min(${n}px, calc(100vw - 24px))` },
            children: t(p)
          }
        )
      ]
    }
  );
}
function at({ label: e, children: t }) {
  const n = I(null);
  return x(() => {
    var r, a;
    (a = (r = n.current) == null ? void 0 : r.querySelector('[role="menuitem"]')) == null || a.focus();
  }, []), /* @__PURE__ */ d("div", { ref: n, role: "menu", "aria-label": e, onKeyDown: (r) => {
    var o;
    const a = [...((o = n.current) == null ? void 0 : o.querySelectorAll('[role="menuitem"]')) ?? []], l = a.indexOf(document.activeElement), i = r.key === "ArrowDown" ? l + 1 : r.key === "ArrowUp" ? l - 1 : null;
    i === null || a.length === 0 || (r.preventDefault(), a[(i + a.length) % a.length].focus());
  }, children: t });
}
function Ie() {
  return /* @__PURE__ */ d("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ d("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
const G = (e) => `system-map-project-${e}`;
function Re({
  projects: e,
  activeKey: t,
  close: n,
  onPick: s,
  onAdd: r,
  onManage: a
}) {
  const [l, i] = g(""), o = ye(e, l), [u, h] = g(() => Math.max(0, o.findIndex((c) => c.repo_key === t))), p = Math.min(u, o.length - 1), f = (c) => {
    if (c.key === "ArrowDown" || c.key === "ArrowUp") {
      if (c.preventDefault(), o.length === 0) return;
      h((p + (c.key === "ArrowDown" ? 1 : -1) + o.length) % o.length);
    } else c.key === "Enter" && o[p] && (c.preventDefault(), n(), s(o[p].repo_key));
  };
  return /* @__PURE__ */ m(O, { children: [
    /* @__PURE__ */ d(
      T,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Find a project",
        "aria-expanded": !0,
        "aria-controls": "system-map-project-list",
        "aria-activedescendant": o[p] ? G(o[p].repo_key) : void 0,
        placeholder: "Find a project",
        value: l,
        onKeyDown: f,
        onChange: (c) => {
          i(c.target.value), h(0);
        }
      }
    ),
    /* @__PURE__ */ d("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: o.map((c, v) => {
      const $ = Q(c, e);
      return /* @__PURE__ */ m(
        "li",
        {
          id: G(c.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": c.repo_key === t,
          "data-active": v === p,
          title: c.repo,
          onMouseEnter: () => h(v),
          onClick: () => {
            n(), s(c.repo_key);
          },
          children: [
            /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": P(c.status, c.behind, c.ref).tone }),
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: c.name }),
            $ && /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { ...b, fontSize: 12 }, children: $ }),
            /* @__PURE__ */ d("span", { style: { ...b, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: xe(c) })
          ]
        },
        c.repo_key
      );
    }) }),
    o.length === 0 && /* @__PURE__ */ d("p", { style: { ...b, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ d("div", { className: "sm-rule" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: r, children: "Add project" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: a, children: "Manage projects" })
  ] });
}
function st({
  projects: e,
  activeKey: t,
  compact: n = !1,
  onPick: s,
  onReload: r
}) {
  const a = e.find((p) => p.repo_key === t), [l, i] = g(null), o = () => i(null);
  return { menu: /* @__PURE__ */ d(
    Ee,
    {
      width: 340,
      label: "Projects",
      block: n,
      trigger: (p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${n ? " sm-compact" : ""}`,
          title: a == null ? void 0 : a.repo,
          "aria-label": `Project: ${(a == null ? void 0 : a.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...p,
          children: [
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", children: a == null ? void 0 : a.name }),
            /* @__PURE__ */ d(Ie, {})
          ]
        }
      ),
      children: (p) => /* @__PURE__ */ d(
        Re,
        {
          projects: e,
          activeKey: t,
          close: p,
          onPick: s,
          onAdd: () => {
            p(), i("add");
          },
          onManage: () => {
            p(), i("manage");
          }
        }
      )
    }
  ), dialogs: /* @__PURE__ */ m(O, { children: [
    /* @__PURE__ */ d(
      Ce,
      {
        open: l === "add",
        projects: e,
        onClose: o,
        onBuilt: (p) => {
          o(), r(), s(p);
        }
      }
    ),
    /* @__PURE__ */ d(
      je,
      {
        open: l === "manage",
        projects: e,
        onClose: o,
        onBuilt: r,
        onRemoved: (p) => {
          const f = e.find((c) => c.repo_key !== p);
          f || o(), p === t && f && s(f.repo_key), r();
        }
      }
    )
  ] }) };
}
export {
  ae as A,
  tt as B,
  Ie as C,
  Ee as D,
  st as E,
  Le as F,
  F as G,
  Ue as H,
  N as I,
  C as J,
  it as K,
  J as L,
  b as M,
  Me as N,
  re as S,
  We as T,
  W as a,
  Se as b,
  Oe as c,
  Te as d,
  He as e,
  y as f,
  S as g,
  at as h,
  Ce as i,
  Je as j,
  Qe as k,
  Ze as l,
  Xe as m,
  nt as n,
  rt as o,
  Ye as p,
  et as q,
  Pe as r,
  z as s,
  Fe as t,
  qe as u,
  Ve as v,
  Be as w,
  Ge as x,
  Ke as y,
  P as z
};
