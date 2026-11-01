import { jsxs as u, jsx as c, Fragment as T } from "react/jsx-runtime";
import { SearchInput as E, Badge as U } from "@kirocrew/app-sdk/ui";
import { useState as f, useCallback as I, useEffect as w } from "react";
import { useAppApi as x } from "@kirocrew/app-sdk";
const R = { fontFamily: "var(--mono, ui-monospace, monospace)" }, S = { color: "var(--muted, #71717a)" }, B = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function M({ severity: e }) {
  return /* @__PURE__ */ c("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ c(U, { variant: B[e], children: e }) });
}
function ie({
  tables: e,
  selected: t,
  flagged: i,
  working: r,
  onSelect: n
}) {
  const [s, a] = f(""), l = e.filter((o) => o.name.includes(s.trim().toLowerCase()));
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ c(
      E,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: s,
        onChange: (o) => a(o.target.value)
      }
    ),
    /* @__PURE__ */ c("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: l.map((o) => /* @__PURE__ */ u(
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
          /* @__PURE__ */ u("span", { style: { ...S, display: "flex", gap: 6, flexShrink: 0 }, children: [
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
const y = { margin: 0, paddingLeft: 16 };
function re({
  nodes: e,
  focus: t,
  onSelect: i
}) {
  const [r, n] = f(""), s = r.trim().toLowerCase(), a = e.filter((d) => d.kind === "area").sort((d, p) => (p.lines ?? 0) - (d.lines ?? 0)), l = e.filter((d) => d.kind === "module"), o = (d, p, v) => /* @__PURE__ */ u(
    "button",
    {
      onClick: () => i(d.id),
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
        /* @__PURE__ */ c("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: v }),
        /* @__PURE__ */ c("span", { style: { ...S, fontWeight: 400, flexShrink: 0 }, title: `${d.files} files`, children: d.files })
      ]
    },
    d.id
  );
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ c(E, { "aria-label": "Filter modules", placeholder: "Filter modules", value: r, onChange: (d) => n(d.target.value) }),
    /* @__PURE__ */ c("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: a.map((d) => {
      const p = l.filter((m) => m.area === d.id && m.path !== d.path), v = p.filter((m) => m.name.toLowerCase().includes(s)), g = s !== "" || t === d.id || p.some((m) => m.id === t);
      return s && v.length === 0 && !d.name.toLowerCase().includes(s) ? null : /* @__PURE__ */ u("div", { children: [
        o(d, 0, (d.path ?? d.name).replace(/^src\//, "")),
        g && v.map((m) => o(m, 1, m.name))
      ] }, d.id);
    }) })
  ] });
}
function z({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ c(T, { children: e.map((i) => /* @__PURE__ */ u("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
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
function se({ node: e, onAsk: t }) {
  const i = e.constraints.filter((n) => n.kind !== "check"), r = e.constraints.filter((n) => n.kind === "check");
  return /* @__PURE__ */ u("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ c("p", { style: { ...S, ...R, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ c(b, { title: "Findings", children: /* @__PURE__ */ c(z, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ c(b, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ c("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ c("tbody", { children: e.columns.map((n) => /* @__PURE__ */ u("tr", { title: n.source, children: [
      /* @__PURE__ */ c("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: n.name }),
      /* @__PURE__ */ c("td", { style: { ...S, ...R, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: n.type }),
      /* @__PURE__ */ c("td", { style: { ...S, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: n.nullable ? "null" : "not null" })
    ] }, n.name)) }) }) }),
    i.length > 0 && /* @__PURE__ */ c(b, { title: "Keys", children: /* @__PURE__ */ c("ul", { style: y, children: i.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.kind.replace("_", " "),
      " (",
      n.columns.join(", "),
      ")",
      n.references ? ` to ${n.references}, on delete ${n.on_delete}` : ""
    ] }, n.name)) }) }),
    r.length > 0 && /* @__PURE__ */ c(b, { title: "Checks", children: /* @__PURE__ */ c("ul", { style: y, children: r.map((n) => /* @__PURE__ */ c("li", { title: n.source, style: { ...R, fontSize: 12, overflowWrap: "anywhere" }, children: n.expression }, n.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ c(b, { title: "Indexes", children: /* @__PURE__ */ c("ul", { style: y, children: e.indexes.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.name,
      " (",
      n.columns.join(", "),
      ")",
      n.unique ? ", unique" : "",
      n.partial ? ", partial" : ""
    ] }, n.name)) }) }),
    /* @__PURE__ */ c(b, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ c("ul", { style: y, children: e.policies.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.name,
      ": ",
      n.command,
      " for ",
      n.roles.join(", ")
    ] }, n.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ c(b, { title: "Triggers", children: /* @__PURE__ */ c("ul", { style: y, children: e.triggers.map((n) => /* @__PURE__ */ u("li", { title: n.source, children: [
      n.name,
      ": ",
      n.timing,
      " ",
      n.events.join(", ")
    ] }, n.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ c(b, { title: "Notes", children: e.reads.map((n, s) => /* @__PURE__ */ c("p", { style: { margin: "0 0 6px" }, children: n.text }, s)) })
  ] });
}
const G = /* @__PURE__ */ new Set(["planned", "partial"]), _ = "group:tables", h = "group:routes", k = "group:jobs";
function C(e) {
  return e.replace(/^src\//, "");
}
function H(e) {
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : C(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: C(e.path ?? e.name), subtitle: `${e.files} files, ${e.lines} lines` };
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
function O(e, t) {
  const i = e.nodes.filter((a) => a.kind === "route"), r = i.filter((a) => a.route_kind === "api").length, n = e.nodes.filter((a) => a.kind === "job").length, s = [];
  return i.length && s.push({ id: h, kind: "group", title: "Routes", subtitle: `${i.length - r} pages, ${r} API` }), t && s.push({ id: _, kind: "group", title: "Database", subtitle: `${t} tables` }), n && s.push({ id: k, kind: "group", title: "Scheduled jobs", subtitle: `${n} jobs` }), s;
}
function V(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const K = 3;
function L(e, t) {
  if (e.startsWith("table:")) return _;
  const i = t.byId.get(e);
  return i ? i.status === "proposed" ? e : (i.kind === "module" || i.kind === "area") && t.routesDir && i.path === t.routesDir ? h : i.kind === "module" ? i.area === t.open ? e : i.area ?? e : i.kind === "route" ? t.expanded === h ? e : h : i.kind === "job" ? t.expanded === k ? e : k : e : null;
}
function D(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !G.has(e.status));
}
function A(e, t, i, r) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e.edges) {
    if (D(t.byId.get(s.source), i)) continue;
    const a = L(s.source, t), l = L(s.target, t);
    if (!a || !l || a === l || !r(a, l)) continue;
    const o = `${a}|${l}|${s.kind}`, d = n.get(o);
    d ? d.count += s.count : n.set(o, { id: o, source: a, target: l, kind: s.kind, count: s.count, proposed: s.proposed });
  }
  return [...n.values()];
}
function $(e, t, i) {
  const r = [];
  for (const n of e) {
    const s = i.find((l) => l.id === n), a = t.byId.get(n);
    s ? r.push(s) : a ? r.push(H(a)) : n.startsWith("table:") && r.push(V(n));
  }
  return r;
}
function Y(e, t, i, r) {
  const n = O(e, i), s = A(e, t, r, () => !0).filter((l) => l.kind !== "imports" || l.count >= K), a = new Set(n.map((l) => l.id));
  for (const l of e.nodes)
    l.kind === "area" && l.path !== t.routesDir && a.add(l.id), l.kind === "service" && a.add(l.id), l.kind === "plan" && !D(l, r) && a.add(l.id), l.status === "proposed" && a.add(l.id);
  return { cards: $(a, t, n), lines: s.filter((l) => a.has(l.source) && a.has(l.target)) };
}
function q(e, t, i, r) {
  const n = new Set(e.nodes.filter((l) => l.area === t.open && l.kind === "module").map((l) => l.id)), s = A(
    e,
    t,
    r,
    (l, o) => (n.has(l) || n.has(o)) && !l.startsWith("area:") && !o.startsWith("area:")
  ), a = new Set(n);
  for (const l of s)
    a.add(l.source), a.add(l.target);
  return { cards: $(a, t, O(e, i)), lines: s };
}
function J(e, t, i, r) {
  const n = t.expanded === h ? "route" : "job", s = new Set(e.nodes.filter((o) => o.kind === n).map((o) => o.id)), a = A(e, t, r, (o, d) => s.has(o) || s.has(d)), l = new Set(s);
  for (const o of a)
    l.add(o.source), l.add(o.target);
  return { cards: $(l, t, O(e, i)), lines: a };
}
function X(e, t, i) {
  const r = [], n = /* @__PURE__ */ new Set([i]);
  for (const s of e.edges)
    s.source !== i && s.target !== i || (n.add(s.source), n.add(s.target), r.push({ id: `${s.source}|${s.target}|${s.kind}`, source: s.source, target: s.target, kind: s.kind, count: s.count }));
  return { cards: $(n, t, []), lines: r };
}
function le(e, t, i) {
  const r = new Map(e.nodes.map((l) => [l.id, l])), n = new Set(t), s = /* @__PURE__ */ new Map();
  for (const l of e.edges) {
    if (!n.has(l.source) || !n.has(l.target)) continue;
    const o = `${l.source}|${l.target}|${l.kind}`;
    s.set(o, { id: o, source: l.source, target: l.target, kind: l.kind, count: l.count, proposed: l.proposed });
  }
  return { cards: $(n, { byId: r }, O(e, i)), lines: [...s.values()] };
}
function P(e) {
  const t = e.nodes.find((r) => r.kind === "route"), i = t == null ? void 0 : t.evidence[0];
  return i ? i.slice(0, i.lastIndexOf("/")) : null;
}
function ae(e, t, i, r) {
  const n = new Map(e.nodes.map((p) => [p.id, p])), s = P(e), a = t === `area:${s}` ? h : t, l = a != null && a.startsWith("area:") ? a : null, o = a === h || a === k ? a : null, d = { byId: n, open: l, expanded: o, routesDir: s };
  return a ? l ? q(e, d, i, r) : o ? J(e, d, i, r) : X(e, d, a) : Y(e, d, i, r);
}
function oe(e, t) {
  const i = [{ id: null, label: "System" }];
  if (!t) return i;
  if (t === h || t === `area:${P(e)}`) return [...i, { id: t, label: "Routes" }];
  if (t === k) return [...i, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...i, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const r = e.nodes.find((n) => n.id === t);
  if (!r) return i;
  if (r.kind === "area") return [...i, { id: t, label: C(r.path ?? r.name) }];
  if (r.kind === "module") {
    const n = e.nodes.find((s) => s.id === r.area);
    return [
      ...i,
      { id: r.area ?? null, label: C((n == null ? void 0 : n.path) ?? "") },
      { id: t, label: r.name }
    ];
  }
  return r.kind === "route" ? [...i, { id: h, label: "Routes" }, { id: t, label: r.name }] : r.kind === "job" ? [...i, { id: k, label: "Scheduled jobs" }, { id: t, label: r.name }] : [...i, { id: t, label: r.name }];
}
const Q = {
  [_]: "table:",
  [h]: "route:",
  [k]: "job:"
};
function ce(e, t) {
  const i = new Set(t[e] ?? []), r = Q[e];
  if (r)
    for (const [n, s] of Object.entries(t))
      n.startsWith(r) && s.forEach((a) => i.add(a));
  return [...i].sort();
}
function de(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function ue(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function pe(e, t) {
  return t ? t.overlaps.filter((i) => [...i.schema, ...i.schema_and_code, ...i.code, ...i.modules].includes(e)) : [];
}
function fe(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [i, r] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    i.startsWith("table:") && t.set(i, r.length);
  return t;
}
function he(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function me(e, t) {
  const i = new Set(t);
  return {
    tables: e.tables.filter((r) => i.has(r.id)),
    edges: e.edges.filter((r) => i.has(r.source) && i.has(r.target))
  };
}
function ge(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
const W = "/apps/system-map/api";
function j(e, t) {
  return t ? `${W}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${W}${e}`;
}
const F = "system-map.repo";
function be() {
  var p, v;
  const e = x(), [t, i] = f([]), [r, n] = f(!1), [s, a] = f(() => localStorage.getItem(F)), l = I(async () => {
    try {
      const g = await e.get(`${W}/repos`);
      i(g.repos);
    } catch {
      i([]);
    } finally {
      n(!0);
    }
  }, [e]);
  w(() => {
    l();
  }, [l]);
  const o = I((g) => {
    localStorage.setItem(F, g), a(g);
  }, []), d = ((p = t.find((g) => g.repo_key === s)) == null ? void 0 : p.repo_key) ?? ((v = t[0]) == null ? void 0 : v.repo_key) ?? null;
  return { repos: t, active: d, loaded: r, choose: o, reload: l };
}
function ve(e) {
  const t = x(), [i, r] = f(null), [n, s] = f(null), a = I(async () => {
    if (!e) {
      r(null);
      return;
    }
    try {
      r(await t.get(j("/overview", e))), s(null);
    } catch (l) {
      r(null), s(String(l));
    }
  }, [t, e]);
  return w(() => {
    a();
  }, [a]), { overview: i, error: n, refresh: a };
}
function ke(e, t, i) {
  const r = x(), [n, s] = f(null);
  return w(() => {
    if (!i) return;
    let a = !0;
    return r.get(j(e, t)).then((l) => {
      a && s(l);
    }).catch(() => {
      a && s(null);
    }), () => {
      a = !1;
    };
  }, [r, e, t, i]), n;
}
function we(e, t, i) {
  const r = x(), [n, s] = f(null);
  return w(() => {
    if (!e) {
      s(null);
      return;
    }
    let a = !0;
    return r.get(j(`/proposal?id=${encodeURIComponent(e)}`, t)).then((l) => {
      a && s(l);
    }).catch(() => {
      a && s(null);
    }), () => {
      a = !1;
    };
  }, [r, e, t, i]), n;
}
function xe(e, t, i) {
  const r = x(), [n, s] = f(null), [a, l] = f(null), o = I(async () => {
    if (t)
      try {
        s(await r.get(j(e, t))), l(Date.now());
      } catch {
        s(null);
      }
  }, [r, e, t]);
  return w(() => {
    o();
    const d = window.setInterval(() => {
      document.visibilityState === "visible" && o();
    }, i);
    return () => window.clearInterval(d);
  }, [o, i]), { value: n, checkedAt: a, refresh: o };
}
function ye(e, t = null) {
  const i = x(), [r, n] = f(null);
  return w(() => {
    if (!e) {
      n(null);
      return;
    }
    let s = !0;
    return i.get(j(`/node?id=${encodeURIComponent(e)}`, t)).then((a) => {
      s && n(a);
    }).catch(() => {
      s && n(null);
    }), () => {
      s = !1;
    };
  }, [i, e, t]), r;
}
export {
  N as A,
  W as B,
  _ as G,
  S as M,
  se as N,
  M as S,
  ie as T,
  R as a,
  le as b,
  ae as c,
  ue as d,
  h as e,
  k as f,
  ve as g,
  ke as h,
  xe as i,
  we as j,
  ye as k,
  fe as l,
  he as m,
  me as n,
  re as o,
  ge as p,
  pe as q,
  de as r,
  C as s,
  oe as t,
  be as u,
  j as v,
  ce as w
};
