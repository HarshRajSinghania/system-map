import { jsxs as a, jsx as r } from "react/jsx-runtime";
import { useAppApi as p } from "@kirocrew/app-sdk";
import { useState as d, useCallback as h, useEffect as c } from "react";
const u = "/apps/system-map/api";
function x() {
  const t = p(), [l, e] = d(null), [i, o] = d(null), s = h(async () => {
    try {
      e(await t.get(`${u}/overview`)), o(null);
    } catch (n) {
      o(String(n));
    }
  }, [t]);
  return c(() => {
    s();
  }, [s]), { overview: l, error: i, refresh: s };
}
function v(t) {
  const l = p(), [e, i] = d(null);
  return c(() => {
    if (!t) {
      i(null);
      return;
    }
    let o = !0;
    return l.get(`${u}/node?id=${encodeURIComponent(t)}`).then((s) => o && i(s)), () => {
      o = !1;
    };
  }, [l, t]), e;
}
const f = {
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  padding: "4px 8px",
  border: 0,
  borderRadius: 4,
  cursor: "pointer",
  textAlign: "left",
  fontSize: 13,
  color: "inherit"
};
function b({
  tables: t,
  selected: l,
  onSelect: e
}) {
  const [i, o] = d(""), s = t.filter((n) => n.name.includes(i.toLowerCase()));
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ r(
      "input",
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: i,
        onChange: (n) => o(n.target.value),
        style: { width: "100%", padding: "4px 8px", marginBottom: 8, fontSize: 13, background: "transparent", color: "inherit", border: "1px solid currentColor", borderRadius: 4, opacity: 0.8 }
      }
    ),
    s.map((n) => /* @__PURE__ */ a(
      "button",
      {
        onClick: () => e(n.id),
        style: { ...f, background: n.id === l ? "rgba(127,127,127,0.25)" : "transparent" },
        children: [
          /* @__PURE__ */ r("span", { children: n.name }),
          /* @__PURE__ */ r("span", { style: { opacity: 0.6 }, children: n.rls ? n.columns : `${n.columns}, no RLS` })
        ]
      },
      n.id
    ))
  ] });
}
function w({ node: t }) {
  const l = t.constraints.filter((e) => e.kind !== "check");
  return /* @__PURE__ */ a("div", { style: { fontSize: 13 }, children: [
    /* @__PURE__ */ r("p", { style: { opacity: 0.7, margin: "0 0 8px" }, children: t.source }),
    /* @__PURE__ */ r("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ r("tbody", { children: t.columns.map((e) => /* @__PURE__ */ a("tr", { children: [
      /* @__PURE__ */ r("td", { style: { padding: "2px 8px 2px 0" }, children: e.name }),
      /* @__PURE__ */ r("td", { style: { padding: "2px 8px", opacity: 0.7 }, children: e.type }),
      /* @__PURE__ */ r("td", { style: { padding: "2px 0", opacity: 0.7 }, children: e.nullable ? "null" : "not null" })
    ] }, e.name)) }) }),
    /* @__PURE__ */ r("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: "Constraints" }),
    /* @__PURE__ */ r("ul", { style: { margin: "0 0 12px", paddingLeft: 16 }, children: l.map((e, i) => /* @__PURE__ */ a("li", { children: [
      e.kind,
      " (",
      e.columns.join(", "),
      ")",
      e.references ? ` to ${e.references}, on delete ${e.on_delete}` : ""
    ] }, i)) }),
    /* @__PURE__ */ a("p", { style: { margin: 0 }, children: [
      t.indexes.length,
      " indexes, ",
      t.policies.length,
      " policies, RLS ",
      t.rls ? "on" : "off"
    ] })
  ] });
}
export {
  u as B,
  w as N,
  b as T,
  v as a,
  x as u
};
