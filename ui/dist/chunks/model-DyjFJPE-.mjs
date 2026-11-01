import { jsxs as c, jsx as n, Fragment as E } from "react/jsx-runtime";
import { SearchInput as I, Badge as R } from "@kirocrew/app-sdk/ui";
import { useState as u, useCallback as g, useEffect as f } from "react";
import { useAppApi as y } from "@kirocrew/app-sdk";
const v = { fontFamily: "var(--mono, ui-monospace, monospace)" }, m = { color: "var(--muted, #71717a)" }, A = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function j({ severity: t }) {
  return /* @__PURE__ */ n(R, { variant: A[t], children: t });
}
function L({
  tables: t,
  selected: l,
  flagged: r,
  onSelect: s
}) {
  const [e, o] = u(""), a = t.filter((i) => i.name.includes(e.trim().toLowerCase()));
  return /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ n(
      I,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: e,
        onChange: (i) => o(i.target.value)
      }
    ),
    /* @__PURE__ */ n("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: a.map((i) => /* @__PURE__ */ c(
      "button",
      {
        onClick: () => s(i.id),
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
          background: i.id === l ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
        },
        children: [
          /* @__PURE__ */ n("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: i.name }),
          /* @__PURE__ */ c("span", { style: { ...m, display: "flex", gap: 6, flexShrink: 0 }, children: [
            r != null && r.get(i.id) ? /* @__PURE__ */ n("span", { title: `${r.get(i.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: r.get(i.id) }) : null,
            /* @__PURE__ */ n("span", { title: `${i.columns} columns`, children: i.columns })
          ] })
        ]
      },
      i.id
    )) })
  ] });
}
function d({ title: t, children: l }) {
  return /* @__PURE__ */ c("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ n("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: t }),
    l
  ] });
}
const h = { margin: 0, paddingLeft: 16 };
function z({ findings: t, onAsk: l }) {
  return /* @__PURE__ */ n(E, { children: t.map((r) => /* @__PURE__ */ c("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ n(j, { severity: r.severity }),
    /* @__PURE__ */ n("span", { style: { flex: 1 }, children: r.title }),
    l && /* @__PURE__ */ n("button", { onClick: () => l(r), style: B, children: "Ask" })
  ] }, r.id)) });
}
const B = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function T({ node: t, onAsk: l }) {
  const r = t.constraints.filter((e) => e.kind !== "check"), s = t.constraints.filter((e) => e.kind === "check");
  return /* @__PURE__ */ c("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ n("p", { style: { ...m, ...v, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: t.source }),
    t.findings.length > 0 && /* @__PURE__ */ n(d, { title: "Findings", children: /* @__PURE__ */ n(z, { findings: t.findings, onAsk: l }) }),
    /* @__PURE__ */ n(d, { title: `Columns (${t.columns.length})`, children: /* @__PURE__ */ n("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ n("tbody", { children: t.columns.map((e) => /* @__PURE__ */ c("tr", { title: e.source, children: [
      /* @__PURE__ */ n("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: e.name }),
      /* @__PURE__ */ n("td", { style: { ...m, ...v, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: e.type }),
      /* @__PURE__ */ n("td", { style: { ...m, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: e.nullable ? "null" : "not null" })
    ] }, e.name)) }) }) }),
    r.length > 0 && /* @__PURE__ */ n(d, { title: "Keys", children: /* @__PURE__ */ n("ul", { style: h, children: r.map((e) => /* @__PURE__ */ c("li", { title: e.source, children: [
      e.kind.replace("_", " "),
      " (",
      e.columns.join(", "),
      ")",
      e.references ? ` to ${e.references}, on delete ${e.on_delete}` : ""
    ] }, e.name)) }) }),
    s.length > 0 && /* @__PURE__ */ n(d, { title: "Checks", children: /* @__PURE__ */ n("ul", { style: h, children: s.map((e) => /* @__PURE__ */ n("li", { title: e.source, style: { ...v, fontSize: 12, overflowWrap: "anywhere" }, children: e.expression }, e.name)) }) }),
    t.indexes.length > 0 && /* @__PURE__ */ n(d, { title: "Indexes", children: /* @__PURE__ */ n("ul", { style: h, children: t.indexes.map((e) => /* @__PURE__ */ c("li", { title: e.source, children: [
      e.name,
      " (",
      e.columns.join(", "),
      ")",
      e.unique ? ", unique" : "",
      e.partial ? ", partial" : ""
    ] }, e.name)) }) }),
    /* @__PURE__ */ n(d, { title: `Row level security: ${t.rls ? "on" : "off"}`, children: /* @__PURE__ */ n("ul", { style: h, children: t.policies.map((e) => /* @__PURE__ */ c("li", { title: e.source, children: [
      e.name,
      ": ",
      e.command,
      " for ",
      e.roles.join(", ")
    ] }, e.name)) }) }),
    t.triggers.length > 0 && /* @__PURE__ */ n(d, { title: "Triggers", children: /* @__PURE__ */ n("ul", { style: h, children: t.triggers.map((e) => /* @__PURE__ */ c("li", { title: e.source, children: [
      e.name,
      ": ",
      e.timing,
      " ",
      e.events.join(", ")
    ] }, e.name)) }) }),
    t.reads.length > 0 && /* @__PURE__ */ n(d, { title: "Notes", children: t.reads.map((e, o) => /* @__PURE__ */ n("p", { style: { margin: "0 0 6px" }, children: e.text }, o)) })
  ] });
}
const w = "/apps/system-map/api";
function x(t, l) {
  return l ? `${w}${t}${t.includes("?") ? "&" : "?"}repo=${encodeURIComponent(l)}` : `${w}${t}`;
}
const b = "system-map.repo";
function W() {
  var S, k;
  const t = y(), [l, r] = u([]), [s, e] = u(!1), [o, a] = u(() => localStorage.getItem(b)), i = g(async () => {
    try {
      const p = await t.get(`${w}/repos`);
      r(p.repos);
    } catch {
      r([]);
    } finally {
      e(!0);
    }
  }, [t]);
  f(() => {
    i();
  }, [i]);
  const $ = g((p) => {
    localStorage.setItem(b, p), a(p);
  }, []), C = ((S = l.find((p) => p.repo_key === o)) == null ? void 0 : S.repo_key) ?? ((k = l[0]) == null ? void 0 : k.repo_key) ?? null;
  return { repos: l, active: C, loaded: s, choose: $, reload: i };
}
function D(t) {
  const l = y(), [r, s] = u(null), [e, o] = u(null), a = g(async () => {
    if (!t) {
      s(null);
      return;
    }
    try {
      s(await l.get(x("/overview", t))), o(null);
    } catch (i) {
      s(null), o(String(i));
    }
  }, [l, t]);
  return f(() => {
    a();
  }, [a]), { overview: r, error: e, refresh: a };
}
function H(t, l, r) {
  const s = y(), [e, o] = u(null);
  return f(() => {
    if (!r) return;
    let a = !0;
    return s.get(x(t, l)).then((i) => {
      a && o(i);
    }).catch(() => {
      a && o(null);
    }), () => {
      a = !1;
    };
  }, [s, t, l, r]), e;
}
function M(t, l = null) {
  const r = y(), [s, e] = u(null);
  return f(() => {
    if (!t) {
      e(null);
      return;
    }
    let o = !0;
    return r.get(x(`/node?id=${encodeURIComponent(t)}`, l)).then((a) => {
      o && e(a);
    }).catch(() => {
      o && e(null);
    }), () => {
      o = !1;
    };
  }, [r, t, l]), s;
}
export {
  B as A,
  w as B,
  m as M,
  T as N,
  j as S,
  L as T,
  v as a,
  D as b,
  H as c,
  M as d,
  W as u,
  x as w
};
