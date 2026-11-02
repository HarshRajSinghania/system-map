import { jsx as t, jsxs as i, Fragment as v } from "react/jsx-runtime";
import { ContentSkeleton as h, Btn as x } from "@kirocrew/app-sdk/ui";
import { useState as S } from "react";
import { u as b, k, x as M, m as j, E, F as z, H as B, M as N, R as O, S as C, N as H, T as P, y as R } from "./chunks/ProjectMenu-BCAlWh2e.mjs";
const T = 3e4, w = { padding: 12, fontSize: 13 };
function A({
  repo: s,
  projects: l,
  choose: r,
  reload: c
}) {
  const { overview: e, error: d } = k(s), [f, u] = S(null), m = M(f, s), a = j("/worktrees", s, T).value, g = ((a == null ? void 0 : a.overlaps) ?? []).filter((n) => n.severity === "high" || n.severity === "medium"), o = e == null ? void 0 : e.freshness, p = o ? E(z(o), o.commits_behind, o.ref) : null, y = B({ projects: l, activeKey: s, compact: !0, onPick: r, onReload: () => void c() });
  return /* @__PURE__ */ i("div", { style: { padding: 12, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
    y.menu,
    y.dialogs,
    d && !e && /* @__PURE__ */ t("p", { style: { fontSize: 13 }, children: d }),
    !e && !d && /* @__PURE__ */ t(h, { rows: 6 }),
    e && /* @__PURE__ */ i(v, { children: [
      /* @__PURE__ */ i("p", { style: { ...N, fontSize: 13, margin: "4px 0 8px" }, "data-testid": "panel-summary", children: [
        O(e.tables.length, "table"),
        e.manifest.commit ? ` at ${e.manifest.commit.slice(0, 7)}` : "",
        ". ",
        p == null ? void 0 : p.label
      ] }),
      g.map((n) => /* @__PURE__ */ i(
        "p",
        {
          "data-testid": "panel-collision",
          style: { display: "flex", gap: 6, alignItems: "flex-start", fontSize: 13, margin: "0 0 8px", overflowWrap: "anywhere" },
          children: [
            /* @__PURE__ */ t(C, { severity: n.severity }),
            /* @__PURE__ */ t("span", { children: n.summary })
          ]
        },
        `${n.a}|${n.b}`
      )),
      m ? /* @__PURE__ */ i("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: [
        /* @__PURE__ */ i("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
          /* @__PURE__ */ t(x, { onClick: () => u(null), children: "Back" }),
          /* @__PURE__ */ t("span", { style: { fontWeight: 600 }, children: m.name })
        ] }),
        /* @__PURE__ */ t(H, { node: m })
      ] }) : /* @__PURE__ */ t(P, { tables: e.tables, selected: f, working: R(a), onSelect: u })
    ] })
  ] });
}
function F() {
  const { active: s, loaded: l, repos: r, choose: c, reload: e } = b();
  return l ? s ? /* @__PURE__ */ t(A, { repo: s, projects: r, choose: c, reload: e }, s) : /* @__PURE__ */ t("p", { style: w, children: "No projects yet. Open System Map from Apps to add one." }) : /* @__PURE__ */ t(h, { rows: 6 });
}
export {
  F as default
};
