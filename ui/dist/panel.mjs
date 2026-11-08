import { jsx as t, jsxs as i, Fragment as v } from "react/jsx-runtime";
import { ContentSkeleton as y, Btn as x } from "@kirocrew/app-sdk/ui";
import { useState as S } from "react";
import { u as b, m as M, z as j, o as k, H as z, I as B, J as E, M as N, Y as O, S as C, N as H, T as P, B as T } from "./chunks/ProjectMenu-D_r8rLwY.mjs";
const w = 3e4, A = { padding: 12, fontSize: 13 };
function D({
  repo: s,
  projects: l,
  choose: r,
  reload: c
}) {
  const { overview: e, error: d } = M(s), [f, u] = S(null), m = j(f, s), o = k("/worktrees", s, w).value, g = ((o == null ? void 0 : o.overlaps) ?? []).filter((n) => n.severity === "high" || n.severity === "medium"), a = e == null ? void 0 : e.freshness, p = a ? z(B(a), a.commits_behind, a.ref) : null, h = E({ projects: l, activeKey: s, compact: !0, onPick: r, onReload: () => void c() });
  return /* @__PURE__ */ i("div", { style: { padding: 12, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
    h.menu,
    h.dialogs,
    d && !e && /* @__PURE__ */ t("p", { style: { fontSize: 13 }, children: d }),
    !e && !d && /* @__PURE__ */ t(y, { rows: 6 }),
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
      ] }) : /* @__PURE__ */ t(P, { tables: e.tables, selected: f, working: T(o), onSelect: u })
    ] })
  ] });
}
function _() {
  const { active: s, loaded: l, repos: r, choose: c, reload: e } = b();
  return l ? s ? /* @__PURE__ */ t(D, { repo: s, projects: r, choose: c, reload: e }, s) : /* @__PURE__ */ t("p", { style: A, children: "No projects yet. Open System Map from Apps to add one." }) : /* @__PURE__ */ t(y, { rows: 6 });
}
export {
  _ as default
};
