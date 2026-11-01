import { jsxs as d, jsx as n, Fragment as A } from "react/jsx-runtime";
import { SearchInput as R, Badge as E } from "@kirocrew/app-sdk/ui";
import { useState as h, useCallback as k, useEffect as x } from "react";
import { useAppApi as S } from "@kirocrew/app-sdk";
const b = { fontFamily: "var(--mono, ui-monospace, monospace)" }, v = { color: "var(--muted, #71717a)" }, I = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function L({ severity: t }) {
  return /* @__PURE__ */ n(E, { variant: I[t], children: t });
}
function W({
  tables: t,
  selected: i,
  flagged: l,
  onSelect: a
}) {
  const [e, o] = h(""), c = t.filter((s) => s.name.includes(e.trim().toLowerCase()));
  return /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ n(
      R,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: e,
        onChange: (s) => o(s.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: c.map((s) => /* @__PURE__ */ d(
      "button",
      {
        onClick: () => a(s.id),
        style: {
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          padding: "4px 8px",
          border: 0,
          borderRadius: 6,
          cursor: "pointer",
          textAlign: "left",
          fontSize: 13,
          color: "var(--text, inherit)",
          background: s.id === i ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
        },
        children: [
          /* @__PURE__ */ n("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: s.name }),
          /* @__PURE__ */ d("span", { style: { ...v, display: "flex", gap: 6, flexShrink: 0 }, children: [
            l != null && l.get(s.id) ? /* @__PURE__ */ n("span", { title: `${l.get(s.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: l.get(s.id) }) : null,
            /* @__PURE__ */ n("span", { title: `${s.columns} columns`, children: s.columns })
          ] })
        ]
      },
      s.id
    )) })
  ] });
}
function m({ title: t, children: i }) {
  return /* @__PURE__ */ d("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ n("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: t }),
    i
  ] });
}
const g = { margin: 0, paddingLeft: 16 };
function _({
  nodes: t,
  focus: i,
  onSelect: l
}) {
  const [a, e] = h(""), o = a.trim().toLowerCase(), c = t.filter((r) => r.kind === "area").sort((r, u) => (u.lines ?? 0) - (r.lines ?? 0)), s = t.filter((r) => r.kind === "module"), w = (r, u, y) => /* @__PURE__ */ d(
    "button",
    {
      onClick: () => l(r.id),
      style: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        padding: `3px 8px 3px ${8 + u * 14}px`,
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        fontWeight: u === 0 ? 600 : 400,
        color: "var(--text, inherit)",
        background: r.id === i ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ n("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: y }),
        /* @__PURE__ */ n("span", { style: { ...v, fontWeight: 400, flexShrink: 0 }, title: `${r.files} files`, children: r.files })
      ]
    },
    r.id
  );
  return /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ n(R, { "aria-label": "Filter modules", placeholder: "Filter modules", value: a, onChange: (r) => e(r.target.value) }),
    /* @__PURE__ */ n("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: c.map((r) => {
      const u = s.filter((p) => p.area === r.id && p.path !== r.path), y = u.filter((p) => p.name.toLowerCase().includes(o)), f = o !== "" || i === r.id || u.some((p) => p.id === i);
      return o && y.length === 0 && !r.name.toLowerCase().includes(o) ? null : /* @__PURE__ */ d("div", { children: [
        w(r, 0, (r.path ?? r.name).replace(/^src\//, "")),
        f && y.map((p) => w(p, 1, p.name))
      ] }, r.id);
    }) })
  ] });
}
function j({ findings: t, onAsk: i }) {
  return /* @__PURE__ */ n(A, { children: t.map((l) => /* @__PURE__ */ d("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ n(L, { severity: l.severity }),
    /* @__PURE__ */ n("span", { style: { flex: 1 }, children: l.title }),
    i && /* @__PURE__ */ n("button", { onClick: () => i(l), style: z, children: "Ask" })
  ] }, l.id)) });
}
const z = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function D({ node: t, onAsk: i }) {
  const l = t.constraints.filter((e) => e.kind !== "check"), a = t.constraints.filter((e) => e.kind === "check");
  return /* @__PURE__ */ d("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ n("p", { style: { ...v, ...b, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: t.source }),
    t.findings.length > 0 && /* @__PURE__ */ n(m, { title: "Findings", children: /* @__PURE__ */ n(j, { findings: t.findings, onAsk: i }) }),
    /* @__PURE__ */ n(m, { title: `Columns (${t.columns.length})`, children: /* @__PURE__ */ n("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ n("tbody", { children: t.columns.map((e) => /* @__PURE__ */ d("tr", { title: e.source, children: [
      /* @__PURE__ */ n("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: e.name }),
      /* @__PURE__ */ n("td", { style: { ...v, ...b, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: e.type }),
      /* @__PURE__ */ n("td", { style: { ...v, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: e.nullable ? "null" : "not null" })
    ] }, e.name)) }) }) }),
    l.length > 0 && /* @__PURE__ */ n(m, { title: "Keys", children: /* @__PURE__ */ n("ul", { style: g, children: l.map((e) => /* @__PURE__ */ d("li", { title: e.source, children: [
      e.kind.replace("_", " "),
      " (",
      e.columns.join(", "),
      ")",
      e.references ? ` to ${e.references}, on delete ${e.on_delete}` : ""
    ] }, e.name)) }) }),
    a.length > 0 && /* @__PURE__ */ n(m, { title: "Checks", children: /* @__PURE__ */ n("ul", { style: g, children: a.map((e) => /* @__PURE__ */ n("li", { title: e.source, style: { ...b, fontSize: 12, overflowWrap: "anywhere" }, children: e.expression }, e.name)) }) }),
    t.indexes.length > 0 && /* @__PURE__ */ n(m, { title: "Indexes", children: /* @__PURE__ */ n("ul", { style: g, children: t.indexes.map((e) => /* @__PURE__ */ d("li", { title: e.source, children: [
      e.name,
      " (",
      e.columns.join(", "),
      ")",
      e.unique ? ", unique" : "",
      e.partial ? ", partial" : ""
    ] }, e.name)) }) }),
    /* @__PURE__ */ n(m, { title: `Row level security: ${t.rls ? "on" : "off"}`, children: /* @__PURE__ */ n("ul", { style: g, children: t.policies.map((e) => /* @__PURE__ */ d("li", { title: e.source, children: [
      e.name,
      ": ",
      e.command,
      " for ",
      e.roles.join(", ")
    ] }, e.name)) }) }),
    t.triggers.length > 0 && /* @__PURE__ */ n(m, { title: "Triggers", children: /* @__PURE__ */ n("ul", { style: g, children: t.triggers.map((e) => /* @__PURE__ */ d("li", { title: e.source, children: [
      e.name,
      ": ",
      e.timing,
      " ",
      e.events.join(", ")
    ] }, e.name)) }) }),
    t.reads.length > 0 && /* @__PURE__ */ n(m, { title: "Notes", children: t.reads.map((e, o) => /* @__PURE__ */ n("p", { style: { margin: "0 0 6px" }, children: e.text }, o)) })
  ] });
}
const C = "/apps/system-map/api";
function $(t, i) {
  return i ? `${C}${t}${t.includes("?") ? "&" : "?"}repo=${encodeURIComponent(i)}` : `${C}${t}`;
}
const F = "system-map.repo";
function H() {
  var u, y;
  const t = S(), [i, l] = h([]), [a, e] = h(!1), [o, c] = h(() => localStorage.getItem(F)), s = k(async () => {
    try {
      const f = await t.get(`${C}/repos`);
      l(f.repos);
    } catch {
      l([]);
    } finally {
      e(!0);
    }
  }, [t]);
  x(() => {
    s();
  }, [s]);
  const w = k((f) => {
    localStorage.setItem(F, f), c(f);
  }, []), r = ((u = i.find((f) => f.repo_key === o)) == null ? void 0 : u.repo_key) ?? ((y = i[0]) == null ? void 0 : y.repo_key) ?? null;
  return { repos: i, active: r, loaded: a, choose: w, reload: s };
}
function M(t) {
  const i = S(), [l, a] = h(null), [e, o] = h(null), c = k(async () => {
    if (!t) {
      a(null);
      return;
    }
    try {
      a(await i.get($("/overview", t))), o(null);
    } catch (s) {
      a(null), o(String(s));
    }
  }, [i, t]);
  return x(() => {
    c();
  }, [c]), { overview: l, error: e, refresh: c };
}
function U(t, i, l) {
  const a = S(), [e, o] = h(null);
  return x(() => {
    if (!l) return;
    let c = !0;
    return a.get($(t, i)).then((s) => {
      c && o(s);
    }).catch(() => {
      c && o(null);
    }), () => {
      c = !1;
    };
  }, [a, t, i, l]), e;
}
function V(t, i = null) {
  const l = S(), [a, e] = h(null);
  return x(() => {
    if (!t) {
      e(null);
      return;
    }
    let o = !0;
    return l.get($(`/node?id=${encodeURIComponent(t)}`, i)).then((c) => {
      o && e(c);
    }).catch(() => {
      o && e(null);
    }), () => {
      o = !1;
    };
  }, [l, t, i]), a;
}
export {
  z as A,
  C as B,
  v as M,
  D as N,
  L as S,
  W as T,
  b as a,
  M as b,
  U as c,
  V as d,
  _ as e,
  H as u,
  $ as w
};
