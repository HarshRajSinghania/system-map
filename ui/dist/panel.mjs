import { jsx as t, jsxs as i, Fragment as r } from "react/jsx-runtime";
import { useState as a } from "react";
import { u as d, a as c, N as m, T as f } from "./chunks/model-D_z7m97b.mjs";
function g() {
  const { overview: e, error: s } = d(), [l, o] = a(null), n = c(l);
  return s ? /* @__PURE__ */ t("p", { style: { padding: 12, fontSize: 13 }, children: s }) : e ? /* @__PURE__ */ i("div", { style: { padding: 12, overflowY: "auto", height: "100%" }, children: [
    /* @__PURE__ */ i("p", { style: { fontSize: 13, margin: "0 0 8px", opacity: 0.7 }, children: [
      e.tables.length,
      " tables at ",
      e.manifest.commit.slice(0, 7),
      e.freshness.stale ? `, ${e.freshness.commits_behind} behind` : ""
    ] }),
    n ? /* @__PURE__ */ i(r, { children: [
      /* @__PURE__ */ t("button", { onClick: () => o(null), style: { marginBottom: 8 }, children: "Back" }),
      /* @__PURE__ */ t("p", { style: { fontWeight: 600, margin: "0 0 4px" }, children: n.name }),
      /* @__PURE__ */ t(m, { node: n })
    ] }) : /* @__PURE__ */ t(f, { tables: e.tables, selected: l, onSelect: o })
  ] }) : /* @__PURE__ */ t("p", { style: { padding: 12, fontSize: 13 }, children: "Loading" });
}
export {
  g as default
};
