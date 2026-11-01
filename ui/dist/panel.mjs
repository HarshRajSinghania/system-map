import { jsx as e, jsxs as i } from "react/jsx-runtime";
import { Btn as c } from "@kirocrew/app-sdk/ui";
import { useState as m } from "react";
import { u as p, b as f, d as h, M as g, N as u, T as y } from "./chunks/model-BQD0Q2Ko.mjs";
function z() {
  const { active: s, loaded: a, repos: d } = p(), { overview: t, error: l } = f(s), [o, r] = m(null), n = h(o, s);
  return l ? /* @__PURE__ */ e("p", { style: { padding: 12, fontSize: 13 }, children: l }) : a && d.length === 0 ? /* @__PURE__ */ e("p", { style: { padding: 12, fontSize: 13 }, children: "No model yet. Open System Map from Apps to build one." }) : t ? /* @__PURE__ */ i("div", { style: { padding: 12, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
    /* @__PURE__ */ i("p", { style: { ...g, fontSize: 13, margin: "0 0 8px" }, children: [
      t.tables.length,
      " tables at ",
      t.manifest.commit.slice(0, 7),
      t.freshness.stale ? `, ${t.freshness.commits_behind} behind` : ""
    ] }),
    n ? /* @__PURE__ */ i("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: [
      /* @__PURE__ */ i("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
        /* @__PURE__ */ e(c, { onClick: () => r(null), children: "Back" }),
        /* @__PURE__ */ e("span", { style: { fontWeight: 600 }, children: n.name })
      ] }),
      /* @__PURE__ */ e(u, { node: n })
    ] }) : /* @__PURE__ */ e(y, { tables: t.tables, selected: o, onSelect: r })
  ] }) : /* @__PURE__ */ e("p", { style: { padding: 12, fontSize: 13 }, children: "Loading" });
}
export {
  z as default
};
