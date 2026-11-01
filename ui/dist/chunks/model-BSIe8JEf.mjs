import { jsxs as u, jsx as c, Fragment as B } from "react/jsx-runtime";
import { SearchInput as E, Badge as U } from "@kirocrew/app-sdk/ui";
import { useState as p, useCallback as $, useEffect as w } from "react";
import { useAppApi as S } from "@kirocrew/app-sdk";
const I = { fontFamily: "var(--mono, ui-monospace, monospace)" }, y = { color: "var(--muted, #71717a)" }, z = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function M({ severity: e }) {
  return /* @__PURE__ */ c("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ c(U, { variant: z[e], children: e }) });
}
function ie({
  tables: e,
  selected: t,
  flagged: i,
  working: r,
  onSelect: n
}) {
  const [l, s] = p(""), a = e.filter((o) => o.name.includes(l.trim().toLowerCase()));
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ c(
      E,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: l,
        onChange: (o) => s(o.target.value)
      }
    ),
    /* @__PURE__ */ c("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: a.map((o) => /* @__PURE__ */ u(
      "button",
      {
        onClick: () => n(o.id),
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
          /* @__PURE__ */ c("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.name }),
          /* @__PURE__ */ u("span", { style: { ...y, display: "flex", gap: 6, flexShrink: 0 }, children: [
            r != null && r.get(o.id) ? /* @__PURE__ */ u(
              "span",
              {
                title: "Worktrees changing this table or its code",
                style: { color: (r.get(o.id) ?? 0) > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" },
                children: [
                  r.get(o.id),
                  " at work"
                ]
              }
            ) : null,
            i != null && i.get(o.id) ? /* @__PURE__ */ c("span", { title: `${i.get(o.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: i.get(o.id) }) : null,
            /* @__PURE__ */ c("span", { title: `${o.columns} columns`, children: o.columns })
          ] })
        ]
      },
      o.id
    )) })
  ] });
}
function b({ title: e, children: t }) {
  return /* @__PURE__ */ u("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ c("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const x = { margin: 0, paddingLeft: 16 };
function re({
  nodes: e,
  focus: t,
  onSelect: i
}) {
  const [r, n] = p(""), l = r.trim().toLowerCase(), s = e.filter((d) => d.kind === "area").sort((d, f) => (f.lines ?? 0) - (d.lines ?? 0)), a = e.filter((d) => d.kind === "module"), o = (d, f, v) => /* @__PURE__ */ u(
    "button",
    {
      onClick: () => i(d.id),
      style: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        padding: `3px 8px 3px ${8 + f * 14}px`,
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        fontWeight: f === 0 ? 600 : 400,
        color: "var(--text, inherit)",
        background: d.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ c("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: v }),
        /* @__PURE__ */ c("span", { style: { ...y, fontWeight: 400, flexShrink: 0 }, title: `${d.files} files`, children: d.files })
      ]
    },
    d.id
  );
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ c(E, { "aria-label": "Filter modules", placeholder: "Filter modules", value: r, onChange: (d) => n(d.target.value) }),
    /* @__PURE__ */ c("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: s.map((d) => {
      const f = a.filter((m) => m.area === d.id && m.path !== d.path), v = f.filter((m) => m.name.toLowerCase().includes(l)), g = l !== "" || t === d.id || f.some((m) => m.id === t);
      return l && v.length === 0 && !d.name.toLowerCase().includes(l) ? null : /* @__PURE__ */ u("div", { children: [
        o(d, 0, (d.path ?? d.name).replace(/^src\//, "")),
        g && v.map((m) => o(m, 1, m.name))
      ] }, d.id);
    }) })
  ] });
}
function P({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ c(B, { children: e.map((i) => /* @__PURE__ */ u("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ c(M, { severity: i.severity }),
    /* @__PURE__ */ c("span", { style: { flex: 1 }, children: i.title }),
    t && /* @__PURE__ */ c("button", { onClick: () => t(i), style: N, children: "Ask" })
  ] }, i.id)) });
}
const N = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function le({ node: e, onAsk: t }) {
  const i = e.constraints.filter((n) => n.kind !== "check"), r = e.constraints.filter((n) => n.kind === "check");
  return /* @__PURE__ */ u("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ c("p", { style: { ...y, ...I, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ c(b, { title: "Findings", children: /* @__PURE__ */ c(P, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ c(b, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ c("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ c("tbody", { children: e.columns.map((n) => /* @__PURE__ */ u("tr", { title: n.source, children: [
      /* @__PURE__ */ c("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: n.name }),
      /* @__PURE__ */ c("td", { style: { ...y, ...I, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: n.type }),
      /* @__PURE__ */ c("td", { style: { ...y, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: n.nullable ? "null" : "not null" })
    ] }, n.name)) }) }) }),
    i.length > 0 && /* @__PURE__ */ c(b, { title: "Keys", children: /* @__PURE__ */ c("ul", { style: x, children: i.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.kind.replace("_", " "),
      " (",
      n.columns.join(", "),
      ")",
      n.references ? ` to ${n.references}, on delete ${n.on_delete}` : ""
    ] }, n.name)) }) }),
    r.length > 0 && /* @__PURE__ */ c(b, { title: "Checks", children: /* @__PURE__ */ c("ul", { style: x, children: r.map((n) => /* @__PURE__ */ c("li", { title: n.source, style: { ...I, fontSize: 12, overflowWrap: "anywhere" }, children: n.expression }, n.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ c(b, { title: "Indexes", children: /* @__PURE__ */ c("ul", { style: x, children: e.indexes.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.name,
      " (",
      n.columns.join(", "),
      ")",
      n.unique ? ", unique" : "",
      n.partial ? ", partial" : ""
    ] }, n.name)) }) }),
    /* @__PURE__ */ c(b, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ c("ul", { style: x, children: e.policies.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.name,
      ": ",
      n.command,
      " for ",
      n.roles.join(", ")
    ] }, n.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ c(b, { title: "Triggers", children: /* @__PURE__ */ c("ul", { style: x, children: e.triggers.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.name,
      ": ",
      n.timing,
      " ",
      n.events.join(", ")
    ] }, n.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ c(b, { title: "Notes", children: e.reads.map((n, l) => /* @__PURE__ */ c("p", { style: { margin: "0 0 6px" }, children: n.text }, l)) })
  ] });
}
const G = /* @__PURE__ */ new Set(["planned", "partial"]), W = "group:tables", h = "group:routes", k = "group:jobs";
function O(e) {
  return e.replace(/^src\//, "");
}
function H(e) {
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: O(e.path ?? e.name), subtitle: `${e.files} files, ${e.lines} lines` };
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
function _(e, t) {
  const i = e.nodes.filter((s) => s.kind === "route"), r = i.filter((s) => s.route_kind === "api").length, n = e.nodes.filter((s) => s.kind === "job").length, l = [];
  return i.length && l.push({ id: h, kind: "group", title: "Routes", subtitle: `${i.length - r} pages, ${r} API` }), t && l.push({ id: W, kind: "group", title: "Database", subtitle: `${t} tables` }), n && l.push({ id: k, kind: "group", title: "Scheduled jobs", subtitle: `${n} jobs` }), l;
}
function V(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, ""), subtitle: "table" };
}
const K = 3;
function L(e, t) {
  if (e.startsWith("table:")) return W;
  const i = t.byId.get(e);
  return i ? (i.kind === "module" || i.kind === "area") && t.routesDir && i.path === t.routesDir ? h : i.kind === "module" ? i.area === t.open ? e : i.area ?? e : i.kind === "route" ? t.expanded === h ? e : h : i.kind === "job" ? t.expanded === k ? e : k : e : null;
}
function D(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !G.has(e.status));
}
function A(e, t, i, r) {
  const n = /* @__PURE__ */ new Map();
  for (const l of e.edges) {
    if (D(t.byId.get(l.source), i)) continue;
    const s = L(l.source, t), a = L(l.target, t);
    if (!s || !a || s === a || !r(s, a)) continue;
    const o = `${s}|${a}|${l.kind}`, d = n.get(o);
    d ? d.count += l.count : n.set(o, { id: o, source: s, target: a, kind: l.kind, count: l.count });
  }
  return [...n.values()];
}
function j(e, t, i) {
  const r = [];
  for (const n of e) {
    const l = i.find((a) => a.id === n), s = t.byId.get(n);
    l ? r.push(l) : s ? r.push(H(s)) : n.startsWith("table:") && r.push(V(n));
  }
  return r;
}
function Y(e, t, i, r) {
  const n = _(e, i), l = A(e, t, r, () => !0).filter((a) => a.kind !== "imports" || a.count >= K), s = new Set(n.map((a) => a.id));
  for (const a of e.nodes)
    a.kind === "area" && a.path !== t.routesDir && s.add(a.id), a.kind === "service" && s.add(a.id), a.kind === "plan" && !D(a, r) && s.add(a.id);
  return { cards: j(s, t, n), lines: l.filter((a) => s.has(a.source) && s.has(a.target)) };
}
function q(e, t, i, r) {
  const n = new Set(e.nodes.filter((a) => a.area === t.open && a.kind === "module").map((a) => a.id)), l = A(
    e,
    t,
    r,
    (a, o) => (n.has(a) || n.has(o)) && !a.startsWith("area:") && !o.startsWith("area:")
  ), s = new Set(n);
  for (const a of l)
    s.add(a.source), s.add(a.target);
  return { cards: j(s, t, _(e, i)), lines: l };
}
function J(e, t, i, r) {
  const n = t.expanded === h ? "route" : "job", l = new Set(e.nodes.filter((o) => o.kind === n).map((o) => o.id)), s = A(e, t, r, (o, d) => l.has(o) || l.has(d)), a = new Set(l);
  for (const o of s)
    a.add(o.source), a.add(o.target);
  return { cards: j(a, t, _(e, i)), lines: s };
}
function X(e, t, i) {
  const r = [], n = /* @__PURE__ */ new Set([i]);
  for (const l of e.edges)
    l.source !== i && l.target !== i || (n.add(l.source), n.add(l.target), r.push({ id: `${l.source}|${l.target}|${l.kind}`, source: l.source, target: l.target, kind: l.kind, count: l.count }));
  return { cards: j(n, t, []), lines: r };
}
function T(e) {
  const t = e.nodes.find((r) => r.kind === "route"), i = t == null ? void 0 : t.evidence[0];
  return i ? i.slice(0, i.lastIndexOf("/")) : null;
}
function se(e, t, i, r) {
  const n = new Map(e.nodes.map((f) => [f.id, f])), l = T(e), s = t === `area:${l}` ? h : t, a = s != null && s.startsWith("area:") ? s : null, o = s === h || s === k ? s : null, d = { byId: n, open: a, expanded: o, routesDir: l };
  return s ? a ? q(e, d, i, r) : o ? J(e, d, i, r) : X(e, d, s) : Y(e, d, i, r);
}
function ae(e, t) {
  const i = [{ id: null, label: "System" }];
  if (!t) return i;
  if (t === h || t === `area:${T(e)}`) return [...i, { id: t, label: "Routes" }];
  if (t === k) return [...i, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...i, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const r = e.nodes.find((n) => n.id === t);
  if (!r) return i;
  if (r.kind === "area") return [...i, { id: t, label: O(r.path ?? r.name) }];
  if (r.kind === "module") {
    const n = e.nodes.find((l) => l.id === r.area);
    return [
      ...i,
      { id: r.area ?? null, label: O((n == null ? void 0 : n.path) ?? "") },
      { id: t, label: r.name }
    ];
  }
  return r.kind === "route" ? [...i, { id: h, label: "Routes" }, { id: t, label: r.name }] : r.kind === "job" ? [...i, { id: k, label: "Scheduled jobs" }, { id: t, label: r.name }] : [...i, { id: t, label: r.name }];
}
const Q = {
  [W]: "table:",
  [h]: "route:",
  [k]: "job:"
};
function oe(e, t) {
  const i = new Set(t[e] ?? []), r = Q[e];
  if (r)
    for (const [n, l] of Object.entries(t))
      n.startsWith(r) && l.forEach((s) => i.add(s));
  return [...i].sort();
}
function ce(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function de(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function ue(e, t) {
  return t ? t.overlaps.filter((i) => [...i.schema, ...i.schema_and_code, ...i.code, ...i.modules].includes(e)) : [];
}
function fe(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [i, r] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    i.startsWith("table:") && t.set(i, r.length);
  return t;
}
function pe(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
const R = "/apps/system-map/api";
function C(e, t) {
  return t ? `${R}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${R}${e}`;
}
const F = "system-map.repo";
function he() {
  var f, v;
  const e = S(), [t, i] = p([]), [r, n] = p(!1), [l, s] = p(() => localStorage.getItem(F)), a = $(async () => {
    try {
      const g = await e.get(`${R}/repos`);
      i(g.repos);
    } catch {
      i([]);
    } finally {
      n(!0);
    }
  }, [e]);
  w(() => {
    a();
  }, [a]);
  const o = $((g) => {
    localStorage.setItem(F, g), s(g);
  }, []), d = ((f = t.find((g) => g.repo_key === l)) == null ? void 0 : f.repo_key) ?? ((v = t[0]) == null ? void 0 : v.repo_key) ?? null;
  return { repos: t, active: d, loaded: r, choose: o, reload: a };
}
function me(e) {
  const t = S(), [i, r] = p(null), [n, l] = p(null), s = $(async () => {
    if (!e) {
      r(null);
      return;
    }
    try {
      r(await t.get(C("/overview", e))), l(null);
    } catch (a) {
      r(null), l(String(a));
    }
  }, [t, e]);
  return w(() => {
    s();
  }, [s]), { overview: i, error: n, refresh: s };
}
function ge(e, t, i) {
  const r = S(), [n, l] = p(null);
  return w(() => {
    if (!i) return;
    let s = !0;
    return r.get(C(e, t)).then((a) => {
      s && l(a);
    }).catch(() => {
      s && l(null);
    }), () => {
      s = !1;
    };
  }, [r, e, t, i]), n;
}
function be(e, t, i) {
  const r = S(), [n, l] = p(null), [s, a] = p(null), o = $(async () => {
    if (t)
      try {
        l(await r.get(C(e, t))), a(Date.now());
      } catch {
        l(null);
      }
  }, [r, e, t]);
  return w(() => {
    o();
    const d = window.setInterval(() => {
      document.visibilityState === "visible" && o();
    }, i);
    return () => window.clearInterval(d);
  }, [o, i]), { value: n, checkedAt: s, refresh: o };
}
function ve(e, t = null) {
  const i = S(), [r, n] = p(null);
  return w(() => {
    if (!e) {
      n(null);
      return;
    }
    let l = !0;
    return i.get(C(`/node?id=${encodeURIComponent(e)}`, t)).then((s) => {
      l && n(s);
    }).catch(() => {
      l && n(null);
    }), () => {
      l = !1;
    };
  }, [i, e, t]), r;
}
export {
  N as A,
  R as B,
  W as G,
  y as M,
  le as N,
  M as S,
  ie as T,
  I as a,
  se as b,
  de as c,
  h as d,
  k as e,
  me as f,
  ge as g,
  be as h,
  ve as i,
  fe as j,
  re as k,
  C as l,
  ue as o,
  pe as p,
  ce as r,
  O as s,
  ae as t,
  he as u,
  oe as w
};
