import { jsx as e, jsxs as s } from "react/jsx-runtime";
import { Btn as f } from "@kirocrew/app-sdk/ui";
import { useState as h } from "react";
import { u as g, f as y, i as u, h as v, M as S, S as b, N as x, T as z, j as M } from "./chunks/model-BSIe8JEf.mjs";
const k = 3e4;
function A() {
  const { active: l, loaded: c, repos: p } = g(), { overview: i, error: o } = y(l), [r, d] = h(null), a = u(r, l), n = v("/worktrees", l, k).value, m = ((n == null ? void 0 : n.overlaps) ?? []).filter((t) => t.severity === "high" || t.severity === "medium");
  return o ? /* @__PURE__ */ e("p", { style: { padding: 12, fontSize: 13 }, children: o }) : c && p.length === 0 ? /* @__PURE__ */ e("p", { style: { padding: 12, fontSize: 13 }, children: "No model yet. Open System Map from Apps to build one." }) : i ? /* @__PURE__ */ s("div", { style: { padding: 12, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
    /* @__PURE__ */ s("p", { style: { ...S, fontSize: 13, margin: "0 0 8px" }, children: [
      i.tables.length,
      " tables at ",
      i.manifest.commit.slice(0, 7),
      i.freshness.stale ? `, ${i.freshness.commits_behind} behind` : ""
    ] }),
    m.map((t) => /* @__PURE__ */ s(
      "p",
      {
        "data-testid": "panel-collision",
        style: { display: "flex", gap: 6, alignItems: "flex-start", fontSize: 13, margin: "0 0 8px", overflowWrap: "anywhere" },
        children: [
          /* @__PURE__ */ e(b, { severity: t.severity }),
          /* @__PURE__ */ e("span", { children: t.summary })
        ]
      },
      `${t.a}|${t.b}`
    )),
    a ? /* @__PURE__ */ s("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: [
      /* @__PURE__ */ s("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
        /* @__PURE__ */ e(f, { onClick: () => d(null), children: "Back" }),
        /* @__PURE__ */ e("span", { style: { fontWeight: 600 }, children: a.name })
      ] }),
      /* @__PURE__ */ e(x, { node: a })
    ] }) : /* @__PURE__ */ e(z, { tables: i.tables, selected: r, working: M(n), onSelect: d })
  ] }) : /* @__PURE__ */ e("p", { style: { padding: 12, fontSize: 13 }, children: "Loading" });
}
export {
  A as default
};
