import { jsxs as m, jsx as l, Fragment as F } from "react/jsx-runtime";
import { SearchInput as B, Badge as de, Modal as ce, Input as Ce, Btn as j } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as _, useEffect as k, useRef as A } from "react";
import { useAppApi as S } from "@kirocrew/app-sdk";
const ie = "system-map-chrome-css", Ie = `
.sm-page { padding: 0 16px; }
@media (min-width: 768px) { .sm-page { padding: 0 24px; } }
.sm-plain { background: none; border: 0; margin: 0; padding: 0; color: inherit; font: inherit; cursor: pointer; }
.sm-plain:disabled { cursor: default; opacity: .6; }
.sm-plain:focus-visible, .sm-focus:focus-visible { outline: 2px solid var(--accent, #2f7d5c); outline-offset: 2px; }
.sm-project { display: inline-flex; align-items: center; gap: 6px; min-width: 0; padding: 2px 8px; margin-left: -2px; border-radius: 8px; }
.sm-project:hover, .sm-project[aria-expanded="true"] { background: var(--bg-hover, #f4f4f5); }
.sm-project.sm-compact { font-size: 13px; font-weight: 600; padding: 3px 6px; margin-left: -6px; max-width: 100%; }
.sm-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.sm-pop {
  position: absolute; z-index: 60; box-sizing: border-box; padding: 6px; border-radius: 10px; outline: none;
  background: var(--bg-elevated, #fff); color: var(--text, #18181b); border: 1px solid var(--border-strong, #a1a1aa);
  box-shadow: 0 10px 28px rgba(0, 0, 0, .22); font-size: 13px; font-weight: 400; letter-spacing: normal; line-height: 1.35;
}
.sm-list { list-style: none; margin: 6px 0 0; padding: 0; max-height: 260px; overflow-y: auto; }
.sm-row { display: flex; align-items: center; gap: 8px; box-sizing: border-box; width: 100%; padding: 7px 9px; border-radius: 6px; text-align: left; font-size: 13px; cursor: pointer; }
.sm-row:hover, .sm-row[data-active="true"] { background: var(--bg-hover, #f4f4f5); }
.sm-row[aria-selected="true"] { background: var(--accent-subtle, rgba(47, 125, 92, .18)); }
.sm-rule { height: 1px; margin: 6px 2px; background: var(--border, #e4e4e7); }
.sm-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--muted, #71717a); }
.sm-dot[data-tone="ok"] { background: var(--ok, #16a34a); }
.sm-dot[data-tone="warn"] { background: var(--warn, #d97706); }
.sm-dot[data-tone="err"] { background: var(--danger, #dc2626); }
.sm-bar { display: flex; align-items: stretch; gap: 16px; border-bottom: 1px solid var(--border, #e4e4e7); min-height: 34px; }
.sm-tabs { display: flex; gap: 16px; align-items: stretch; min-width: 0; }
.sm-tab { display: inline-flex; align-items: center; gap: 5px; padding: 6px 1px 5px; margin-bottom: -1px; font-size: 13px; color: var(--muted, #71717a); border-bottom: 2px solid transparent; white-space: nowrap; }
.sm-tab:hover { color: var(--text, #18181b); }
.sm-tab[aria-selected="true"] { color: var(--text-strong, var(--text, #18181b)); font-weight: 600; border-bottom-color: var(--accent, #2f7d5c); }
.sm-tab-probe { position: absolute; visibility: hidden; height: 0; overflow: hidden; display: flex; gap: 16px; pointer-events: none; }
.sm-tab-probe .sm-tab { font-weight: 600; }
.sm-count { display: inline-block; min-width: 8px; padding: 0 5px; border-radius: 9px; font-size: 11px; font-weight: 500; text-align: center; background: var(--bg-hover, #f4f4f5); color: var(--muted, #71717a); }
.sm-chip { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid var(--border, #e4e4e7); border-radius: 14px; background: var(--card, #fff); color: var(--text, #18181b); font-size: 13px; white-space: nowrap; }
.sm-chip:hover, .sm-chip[aria-expanded="true"] { border-color: var(--border-strong, #a1a1aa); }
.sm-tools { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.sm-layers { display: flex; align-items: center; gap: 3px; padding: 3px 4px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; background: var(--bg-elevated, #fff); color: var(--text, #18181b); font-size: 12px; }
.sm-layers-label { padding: 0 5px; color: var(--muted, #71717a); }
.sm-layer { padding: 3px 8px; border-radius: 6px; color: var(--muted, #71717a); white-space: nowrap; }
.sm-layer:hover { background: var(--bg-hover, #f4f4f5); }
.sm-layer[aria-pressed="true"] { background: var(--accent-subtle, rgba(47, 125, 92, .18)); color: var(--text, #18181b); }
.sm-tool-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.sm-show-list { padding: 5px 10px; white-space: nowrap; color: var(--muted, #71717a); }
.sm-show-list:hover { color: var(--text, #18181b); border-color: var(--border-strong, #a1a1aa); }
.sm-list-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.sm-hide-list { padding: 1px 6px; border-radius: 6px; font-size: 12px; color: var(--muted, #71717a); }
.sm-hide-list:hover { background: var(--bg-hover, #f4f4f5); color: var(--text, #18181b); }
.sm-notice { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; background: var(--bg-elevated, #fff); color: var(--text, #18181b); font-size: 13px; }
.sm-manage { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.sm-manage-row { padding: 10px 12px; border: 1px solid var(--border, #e4e4e7); border-radius: 8px; font-size: 13px; }
.sm-mono { font-family: var(--mono, ui-monospace, Menlo, monospace); font-size: 12px; }
.sm-link { color: var(--accent, #2f7d5c); font-size: 13px; white-space: nowrap; }
.sm-link:hover { text-decoration: underline; }
.sm-add-list { max-height: min(340px, 46vh); margin: 0; }
.sm-add-head { padding: 8px 9px 2px; font-size: 12px; color: var(--muted, #71717a); }
.sm-row[aria-disabled="true"] { cursor: default; opacity: .6; }
.sm-row-action { display: none; color: var(--accent, #2f7d5c); font-weight: 600; white-space: nowrap; }
.sm-row[data-active="true"] .sm-row-action { display: inline; }
.sm-add-empty { display: grid; justify-items: center; gap: 10px; padding: 24px 12px; text-align: center; font-weight: 600; }
`;
if (!document.getElementById(ie)) {
  const e = document.createElement("style");
  e.id = ie, e.textContent = Ie, document.head.appendChild(e);
}
const Ne = /^API (\d{3}): ([\s\S]*)$/;
function _e(e) {
  const t = e ?? {};
  if (typeof t.status == "number") return { status: t.status, body: t.body ?? "" };
  const r = Ne.exec(typeof t.message == "string" ? t.message : "");
  return r ? { status: Number(r[1]), body: r[2] } : { status: null, body: "" };
}
function We(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.error == "string" && t.error ? t.error : null;
  } catch {
    return null;
  }
}
function L(e, t) {
  const { status: r, body: s } = _e(e);
  if (r === null) return `Couldn't ${t}. Check the dashboard is still connected, then try again.`;
  if (r === 400 || r === 404) {
    const i = We(s);
    if (i) return i;
  }
  return r === 401 || r === 403 ? `Couldn't ${t}, because System Map isn't allowed to. Check its permissions on its Details page.` : r >= 500 ? `Couldn't ${t}, because System Map's backend isn't answering. Try again in a moment.` : `Couldn't ${t}. Try again.`;
}
const x = "/apps/system-map/api";
function O(e, t) {
  return t ? `${x}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${x}${e}`;
}
const G = "system-map.repo", q = "system-map:project";
function bt() {
  var p, u;
  const e = S(), [t, r] = g([]), [s, i] = g(!1), [n, c] = g(() => localStorage.getItem(G)), a = _(async () => {
    try {
      const f = await e.get(`${x}/repos`);
      r(f.repos);
    } catch {
      r([]);
    } finally {
      i(!0);
    }
  }, [e]);
  k(() => {
    a();
  }, [a]), k(() => {
    const f = () => {
      c(localStorage.getItem(G)), a();
    };
    return window.addEventListener(q, f), () => window.removeEventListener(q, f);
  }, [a]);
  const o = _((f) => {
    localStorage.setItem(G, f), window.dispatchEvent(new Event(q));
  }, []), d = ((p = t.find((f) => f.repo_key === n)) == null ? void 0 : p.repo_key) ?? ((u = t[0]) == null ? void 0 : u.repo_key) ?? null;
  return { repos: t, active: d, loaded: s, choose: o, reload: a };
}
function yt(e) {
  const t = S(), [r, s] = g(null), [i, n] = g(null), c = A(e);
  c.current = e;
  const a = _(async () => {
    if (!e) {
      s(null);
      return;
    }
    try {
      const o = await t.get(O("/overview", e));
      if (c.current !== e) return;
      s(o), n(null);
    } catch (o) {
      if (c.current !== e) return;
      s(null), n(L(o, "load this project"));
    }
  }, [t, e]);
  return k(() => {
    n(null), a();
  }, [a]), { overview: (r == null ? void 0 : r.manifest.repo_key) === e ? r : null, error: i, refresh: a };
}
function wt(e, t, r) {
  const s = S(), [i, n] = g({ repo: t, value: null, failed: !1 });
  return k(() => {
    if (!r) return;
    let c = !0;
    return s.get(O(e, t)).then((a) => {
      c && n({ repo: t, value: a, failed: !1 });
    }).catch(() => {
      c && n({ repo: t, value: null, failed: !0 });
    }), () => {
      c = !1;
    };
  }, [s, e, t, r]), i.repo === t ? { value: i.value, failed: i.failed } : { value: null, failed: !1 };
}
function vt(e, t, r) {
  const s = S(), [i, n] = g(null);
  return k(() => {
    if (!e) {
      n(null);
      return;
    }
    let c = !0;
    return s.get(O(`/proposal?id=${encodeURIComponent(e)}`, t)).then((a) => {
      c && n(a);
    }).catch(() => {
      c && n(null);
    }), () => {
      c = !1;
    };
  }, [s, e, t, r]), i;
}
function xt(e, t, r) {
  const s = S(), [i, n] = g({ repo: t, value: null, failed: !1 }), [c, a] = g(null), o = A(t);
  o.current = t;
  const d = _(async () => {
    if (t)
      try {
        const u = await s.get(O(e, t));
        if (o.current !== t) return;
        n({ repo: t, value: u, failed: !1 }), a(Date.now());
      } catch {
        o.current === t && n({ repo: t, value: null, failed: !0 });
      }
  }, [s, e, t]);
  k(() => {
    d();
    const u = window.setInterval(() => {
      document.visibilityState === "visible" && d();
    }, r);
    return () => window.clearInterval(u);
  }, [d, r]);
  const p = i.repo === t;
  return { value: p ? i.value : null, failed: p && i.failed, checkedAt: c, refresh: d };
}
function kt(e, t = null) {
  const r = S(), [s, i] = g(null);
  return k(() => {
    if (!e) {
      i(null);
      return;
    }
    let n = !0;
    return r.get(O(`/node?id=${encodeURIComponent(e)}`, t)).then((c) => {
      n && i(c);
    }).catch(() => {
      n && i(null);
    }), () => {
      n = !1;
    };
  }, [r, e, t]), s;
}
const Y = { fontFamily: "var(--mono, ui-monospace, monospace)" }, y = { color: "var(--muted, #71717a)" }, je = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function Ee({ severity: e }) {
  return /* @__PURE__ */ l("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ l(de, { variant: je[e], children: e }) });
}
function $t({
  tables: e,
  selected: t,
  flagged: r,
  working: s,
  onSelect: i
}) {
  const [n, c] = g(""), a = e.filter((o) => o.name.includes(n.trim().toLowerCase()));
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ l(
      B,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: n,
        onChange: (o) => c(o.target.value)
      }
    ),
    /* @__PURE__ */ l("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: a.map((o) => /* @__PURE__ */ m(
      "button",
      {
        onClick: () => i(o.id),
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
          /* @__PURE__ */ l("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.name }),
          /* @__PURE__ */ m("span", { style: { ...y, display: "flex", gap: 6, flexShrink: 0 }, children: [
            s != null && s.get(o.id) ? /* @__PURE__ */ m(
              "span",
              {
                title: "Worktrees changing this table or its code",
                style: { color: (s.get(o.id) ?? 0) > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" },
                children: [
                  s.get(o.id),
                  " at work"
                ]
              }
            ) : null,
            r != null && r.get(o.id) ? /* @__PURE__ */ l("span", { title: `${r.get(o.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: r.get(o.id) }) : null,
            /* @__PURE__ */ l("span", { title: `${o.columns} columns`, children: o.columns })
          ] })
        ]
      },
      o.id
    )) })
  ] });
}
function W({ title: e, children: t }) {
  return /* @__PURE__ */ m("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ l("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const M = { margin: 0, paddingLeft: 16 };
function St({
  nodes: e,
  focus: t,
  onSelect: r
}) {
  const [s, i] = g(""), n = s.trim().toLowerCase(), c = e.filter((d) => d.kind === "area").sort((d, p) => (p.lines ?? 0) - (d.lines ?? 0)), a = e.filter((d) => d.kind === "module"), o = (d, p, u) => /* @__PURE__ */ m(
    "button",
    {
      onClick: () => r(d.id),
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
        /* @__PURE__ */ l("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u }),
        /* @__PURE__ */ l("span", { style: { ...y, fontWeight: 400, flexShrink: 0 }, title: `${d.files} files`, children: d.files })
      ]
    },
    d.id
  );
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ l(B, { "aria-label": "Filter modules", placeholder: "Filter modules", value: s, onChange: (d) => i(d.target.value) }),
    /* @__PURE__ */ l("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: c.map((d) => {
      const p = a.filter((h) => h.area === d.id && h.path !== d.path), u = p.filter((h) => h.name.toLowerCase().includes(n)), f = n !== "" || t === d.id || p.some((h) => h.id === t);
      return n && u.length === 0 && !d.name.toLowerCase().includes(n) ? null : /* @__PURE__ */ m("div", { children: [
        o(d, 0, d.path === "." ? d.name : (d.path ?? d.name).replace(/^src\//, "")),
        f && u.map((h) => o(h, 1, h.name))
      ] }, d.id);
    }) })
  ] });
}
function Ae({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ l(F, { children: e.map((r) => /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ l(Ee, { severity: r.severity }),
    /* @__PURE__ */ l("span", { style: { flex: 1 }, children: r.title }),
    t && /* @__PURE__ */ l("button", { onClick: () => t(r), style: Le, children: "Ask" })
  ] }, r.id)) });
}
const Le = {
  background: "transparent",
  border: 0,
  padding: 0,
  cursor: "pointer",
  fontSize: 12,
  color: "var(--accent, #2563eb)",
  flexShrink: 0
};
function Ct({ node: e, onAsk: t }) {
  const r = e.constraints.filter((i) => i.kind !== "check"), s = e.constraints.filter((i) => i.kind === "check");
  return /* @__PURE__ */ m("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ l("p", { style: { ...y, ...Y, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ l(W, { title: "Findings", children: /* @__PURE__ */ l(Ae, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ l(W, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ l("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ l("tbody", { children: e.columns.map((i) => /* @__PURE__ */ m("tr", { title: i.source, children: [
      /* @__PURE__ */ l("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.name }),
      /* @__PURE__ */ l("td", { style: { ...y, ...Y, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: i.type }),
      /* @__PURE__ */ l("td", { style: { ...y, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: i.nullable ? "null" : "not null" })
    ] }, i.name)) }) }) }),
    r.length > 0 && /* @__PURE__ */ l(W, { title: "Keys", children: /* @__PURE__ */ l("ul", { style: M, children: r.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.kind.replace("_", " "),
      " (",
      i.columns.join(", "),
      ")",
      i.references ? ` to ${i.references}, on delete ${i.on_delete}` : ""
    ] }, i.name)) }) }),
    s.length > 0 && /* @__PURE__ */ l(W, { title: "Checks", children: /* @__PURE__ */ l("ul", { style: M, children: s.map((i) => /* @__PURE__ */ l("li", { title: i.source, style: { ...Y, fontSize: 12, overflowWrap: "anywhere" }, children: i.expression }, i.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ l(W, { title: "Indexes", children: /* @__PURE__ */ l("ul", { style: M, children: e.indexes.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      " (",
      i.columns.join(", "),
      ")",
      i.unique ? ", unique" : "",
      i.partial ? ", partial" : ""
    ] }, i.name)) }) }),
    e.schema !== "main" && /* @__PURE__ */ l(W, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ l("ul", { style: M, children: e.policies.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      ": ",
      i.command,
      " for ",
      i.roles.join(", ")
    ] }, i.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ l(W, { title: "Triggers", children: /* @__PURE__ */ l("ul", { style: M, children: e.triggers.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      ": ",
      i.timing,
      " ",
      i.events.join(", ")
    ] }, i.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ l(W, { title: "Notes", children: e.reads.map((i, n) => /* @__PURE__ */ l("p", { style: { margin: "0 0 6px" }, children: i.text }, n)) })
  ] });
}
const ze = ["map", "data", "plan", "risk", "worktrees", "findings", "explore"];
function It(e) {
  return e.missing ? "missing" : e.error ? "unknown" : e.stale || e.map_stale ? "stale" : e.commits_behind > 0 ? "behind" : "current";
}
function Z(e, t, r) {
  switch (e) {
    case "current":
      return { tone: "ok", label: "Current", detail: `Current with ${r}`, rebuild: !1 };
    case "behind":
      return {
        tone: "muted",
        label: `${t} behind`,
        detail: `${t} ${t === 1 ? "commit" : "commits"} behind ${r}, and none change the model`,
        rebuild: !1
      };
    case "stale":
      return { tone: "warn", label: "Out of date", detail: `${r} has changes the model doesn't show yet`, rebuild: !0 };
    case "missing":
      return { tone: "err", label: "Folder missing", detail: "The folder for this project is gone", rebuild: !1 };
    case "unknown":
      return { tone: "muted", label: "Can't check", detail: `Couldn't compare the model with ${r}`, rebuild: !1 };
  }
}
function E(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
const De = { postgres: "Postgres", sqlite: "SQLite" };
function Nt(e) {
  const t = [
    e.tables ? `${E(e.tables, "table")} from ${De[e.engine ?? ""] ?? e.engine}` : "No tables found",
    e.routes ? `${E(e.routes, "route")}, ${e.route_style}` : "No routes found",
    `${E(e.code_files, "code file")}, ${E(e.links, "link")}`
  ];
  return e.git || t.push("No git history, so no churn or worktrees"), t;
}
function Re(e) {
  return e.status === "current" ? E(e.tables, "table") : Z(e.status, e.behind, e.ref).label;
}
function ue(e, t) {
  return t.filter((s) => s.name === e.name).length > 1 ? e.parent : null;
}
function Me(e, t) {
  const r = t.trim().toLowerCase();
  return r ? e.filter((s) => s.name.toLowerCase().includes(r) || s.repo.toLowerCase().includes(r)) : e;
}
function Oe(e) {
  return e.length > 1 ? e.replace(/\/+$/, "") : e;
}
function Pe(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const n = Oe(i), c = n.lastIndexOf("/");
    c > 0 && t.set(n.slice(0, c), (t.get(n.slice(0, c)) ?? 0) + 1);
  }
  let r = null, s = 0;
  for (const [i, n] of t)
    n > s && (r = i, s = n);
  return r;
}
function pe(e, t, r) {
  const s = r.trim().toLowerCase(), i = new Set(t.map((c) => c.repo_key)), n = e.filter((c) => c.name.toLowerCase().includes(s));
  return { toAdd: n.filter((c) => !i.has(c.key)), added: n.filter((c) => i.has(c.key)) };
}
function fe(e, t = 40) {
  return e.length > t ? `…${e.slice(1 - t)}` : e;
}
function Te(e, t) {
  const r = pe(e, t, "").toAdd.length;
  return r ? `Search ${E(r, "workspace")}` : "Search workspaces";
}
function Fe(e) {
  const r = [
    [e.proposals, "proposal", "proposals"],
    [e.use_cases, "use case", "use cases"],
    [e.views, "saved view", "saved views"]
  ].filter(([s]) => s > 0).map(([s, i, n]) => `${s} ${s === 1 ? i : n}`);
  return r.length === 0 ? "" : r.length === 1 ? r[0] : `${r.slice(0, -1).join(", ")} and ${r[r.length - 1]}`;
}
function he(e, t) {
  const r = Math.max(0, t - e);
  return r < 60 ? "just now" : r < 3600 ? `${Math.floor(r / 60)}m ago` : r < 86400 ? `${Math.floor(r / 3600)}h ago` : `${Math.floor(r / 86400)}d ago`;
}
const me = (e) => `system-map.view.${e}`;
function _t(e, t) {
  if (!t) return "map";
  const r = e.getItem(me(t));
  return ze.find((s) => s === r) ?? "map";
}
function Wt(e, t, r) {
  e.setItem(me(t), r);
}
const ge = "system-map.side-list";
function jt(e) {
  return e === "map" || e === "data";
}
function Et(e) {
  return e.getItem(ge) !== "hidden";
}
function At(e, t) {
  e.setItem(ge, t ? "shown" : "hidden");
}
function Be(e) {
  return `system-map-design-${e}`;
}
const be = (e) => `system-map.chat.${e}`;
function Lt(e, t) {
  return e.getItem(be(t)) === "started";
}
function zt(e, t) {
  e.setItem(be(t), "started");
}
function Dt(e, t) {
  if (!Array.isArray(e)) return !1;
  const r = Be(t);
  return e.some((s) => (s == null ? void 0 : s.key) === r && typeof s.messages == "number" && s.messages > 0);
}
const Ue = 600, se = "system-map-workspace-list", Q = (e) => `system-map-workspace-${e.key}`;
function J() {
  return /* @__PURE__ */ l(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinejoin: "round",
      style: { ...y, flex: "none" },
      "aria-hidden": "true",
      children: /* @__PURE__ */ l("path", { d: "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })
    }
  );
}
function He(e) {
  const t = S(), [r, s] = g(null), [i, n] = g(null);
  k(() => {
    if (s(null), n(null), !e) return;
    let a = !0;
    return (async () => {
      const d = await t.get(`${x}/workspaces`);
      if (d.folder !== null) return { ...d, suggested: !1 };
      const p = await t.get("/api/recent-projects").catch(() => ({ dirs: [] })), u = Array.isArray(p.dirs) ? p.dirs.filter((w) => typeof w == "string") : [], f = Pe(u);
      if (f === null) return { ...d, suggested: !1 };
      const h = await t.get(`${x}/workspaces?folder=${encodeURIComponent(f)}`).catch(() => null);
      return h ? { ...h, suggested: !0 } : { ...d, suggested: !1 };
    })().then((d) => {
      a && s(d);
    }).catch((d) => {
      a && n(L(d, "read your default folder"));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const c = _(
    async (a) => {
      n(null);
      try {
        await t.post(`${x}/default-folder`, { folder: a }), s({ ...await t.get(`${x}/workspaces`), suggested: !1 });
      } catch (o) {
        n(L(o, "save this folder"));
      }
    },
    [t]
  );
  return { list: r, error: i, saveDefault: c };
}
function Ve(e, t, r) {
  const s = S(), [i, n] = g(!1), c = A(!1), a = A({ onPicked: t, onUsePage: r });
  a.current = { onPicked: t, onUsePage: r };
  const o = _((u) => {
    c.current = u, n(u);
  }, []), d = _(() => {
    c.current && (o(!1), s.post(`${x}/folder-window-close`, {}).catch(() => {
    }));
  }, [s, o]);
  return k(() => {
    if (!i) return;
    const u = window.setInterval(() => {
      s.get(`${x}/folder-window`).then((f) => {
        !c.current || f.status === "open" || (o(!1), f.status === "picked" ? a.current.onPicked(f.path) : f.status === "failed" && a.current.onUsePage(f.message));
      }).catch(() => {
        o(!1), a.current.onUsePage(null);
      });
    }, Ue);
    return () => window.clearInterval(u);
  }, [s, i, o]), k(() => e ? d : void 0, [e, d]), { waiting: i, openWindow: async (u) => {
    try {
      (await s.post(`${x}/folder-window`, { start: u })).status === "open" ? o(!0) : a.current.onUsePage(null);
    } catch {
      a.current.onUsePage(null);
    }
  }, closeWindow: d };
}
function Ke({
  start: e,
  note: t,
  onUse: r,
  onCancel: s
}) {
  const i = S(), [n, c] = g(null), [a, o] = g(null), d = _(
    async (p) => {
      o(null);
      try {
        return c(await i.get(`${x}/browse?path=${encodeURIComponent(p)}`)), !0;
      } catch (u) {
        return o(L(u, "open this folder")), !1;
      }
    },
    [i]
  );
  return k(() => {
    d(e ?? "~").then((p) => {
      !p && e !== null && d("~");
    });
  }, [d, e]), /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "folder-list", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
      /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", disabled: !(n != null && n.parent), onClick: () => (n == null ? void 0 : n.parent) && void d(n.parent), children: "‹ Up" }),
      /* @__PURE__ */ l("span", { className: "sm-mono sm-ellipsis", title: n == null ? void 0 : n.path, "data-testid": "folder-list-path", children: n && fe(n.display, 56) })
    ] }),
    /* @__PURE__ */ m("div", { className: "sm-list sm-add-list", children: [
      n == null ? void 0 : n.dirs.map((p) => /* @__PURE__ */ m("button", { type: "button", className: "sm-plain sm-row", title: p.path, onClick: () => void d(p.path), children: [
        /* @__PURE__ */ l(J, {}),
        /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: p.name })
      ] }, p.path)),
      (n == null ? void 0 : n.dirs.length) === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No folders in here." })
    ] }),
    (t ?? a) && /* @__PURE__ */ l("p", { role: "status", style: { margin: 0, fontSize: 13 }, children: a ?? t }),
    /* @__PURE__ */ m("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
      /* @__PURE__ */ l(j, { onClick: s, children: "Cancel" }),
      /* @__PURE__ */ l(j, { primary: !0, disabled: !n, onClick: () => n && r(n.path), children: "Use this folder" })
    ] })
  ] });
}
function Ge({
  workspace: e,
  added: t,
  active: r,
  busy: s,
  now: i,
  onHover: n,
  onPick: c
}) {
  return /* @__PURE__ */ m(
    "li",
    {
      id: Q(e),
      role: "option",
      className: "sm-row",
      "aria-selected": !1,
      "aria-disabled": s,
      "data-active": r && !s,
      "data-testid": "workspace-row",
      title: e.path,
      onMouseEnter: n,
      onClick: () => {
        s || c();
      },
      children: [
        /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: t ? y : { fontWeight: 600 }, children: e.name }),
        e.worktrees > 0 && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: E(e.worktrees, "worktree") }),
        !e.git && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: "no git" }),
        /* @__PURE__ */ l("span", { style: { flex: 1 } }),
        /* @__PURE__ */ l("span", { className: "sm-row-action", children: t ? "Open" : "Add" }),
        !t && e.touched > 0 && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: he(e.touched, i) })
      ]
    }
  );
}
function qe({
  list: e,
  projects: t,
  busy: r,
  onAdd: s,
  onOpen: i
}) {
  const [n, c] = g(""), [a, o] = g(0), d = A(!1), { toAdd: p, added: u } = pe(e.repos, t, n), f = [...p, ...u], h = Math.min(a, f.length - 1), w = Date.now() / 1e3, $ = (b) => u.includes(b) ? i(b) : s(b);
  k(() => {
    var b;
    d.current && (d.current = !1, f[h] && ((b = document.getElementById(Q(f[h]))) == null || b.scrollIntoView({ block: "nearest" })));
  });
  const C = (b) => {
    if (b.key === "ArrowDown" || b.key === "ArrowUp") {
      if (b.preventDefault(), f.length === 0) return;
      d.current = !0, o((h + (b.key === "ArrowDown" ? 1 : -1) + f.length) % f.length);
    } else b.key === "Enter" && f[h] && !r && (b.preventDefault(), $(f[h]));
  }, D = (b, N, R) => /* @__PURE__ */ l(
    Ge,
    {
      workspace: b,
      added: N,
      active: R === h,
      busy: r,
      now: w,
      onHover: () => o(R),
      onPick: () => $(b)
    },
    b.path
  );
  return /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ l(
      B,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Search workspaces",
        "aria-expanded": !0,
        "aria-controls": se,
        "aria-activedescendant": f[h] ? Q(f[h]) : void 0,
        placeholder: Te(e.repos, t),
        value: n,
        disabled: r,
        onKeyDown: C,
        onChange: (b) => {
          c(b.target.value), o(0);
        }
      }
    ),
    /* @__PURE__ */ m("ul", { id: se, className: "sm-list sm-add-list", role: "listbox", "aria-label": "Workspaces", children: [
      p.map((b, N) => D(b, !1, N)),
      u.length > 0 && /* @__PURE__ */ l("li", { role: "presentation", className: "sm-add-head", children: "Already added" }),
      u.map((b, N) => D(b, !0, p.length + N))
    ] }),
    f.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "0 9px" }, children: "No workspace matches that. Only folders with git or a package.json show here." }),
    e.truncated && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, fontSize: 12 }, children: "This folder is too big to search all of it. Pick a smaller one." })
  ] });
}
function Ye({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: s
}) {
  const i = S(), { list: n, error: c, saveDefault: a } = He(e), [o, d] = g("workspaces"), [p, u] = g(null), [f, h] = g(!1), [w, $] = g(""), [C, D] = g(null), [b, N] = g(null), R = (v) => {
    u(v), d("folders");
  }, { waiting: H, openWindow: ke, closeWindow: $e } = Ve(e, (v) => void a(v), R);
  k(() => {
    e && (d("workspaces"), u(null), h(!1), $(""), N(null), D(null));
  }, [e]);
  const ne = async (v, Se) => {
    D(v), N(null);
    try {
      Se && (n != null && n.suggested) && n.folder && await i.post(`${x}/default-folder`, { folder: n.folder });
      const K = await i.post(`${x}/build`, { repo_path: v });
      s(K.repo_key);
    } catch (K) {
      N(L(K, "add this project"));
    } finally {
      D(null);
    }
  }, re = () => void ke((n == null ? void 0 : n.folder) ?? null), V = (v) => /* @__PURE__ */ m("div", { className: "sm-add-empty", "data-testid": "add-empty", children: [
    /* @__PURE__ */ l(J, {}),
    /* @__PURE__ */ l("span", { children: v }),
    /* @__PURE__ */ l(j, { primary: !0, disabled: H, onClick: re, children: "Browse…" })
  ] });
  return /* @__PURE__ */ l(ce, { open: e, onClose: r, title: o === "folders" ? "Choose folder" : "Add project", maxWidth: 520, dismissDisabled: C !== null, children: o === "folders" ? /* @__PURE__ */ l(
    Ke,
    {
      start: (n == null ? void 0 : n.folder) ?? null,
      note: p,
      onCancel: () => d("workspaces"),
      onUse: (v) => {
        d("workspaces"), a(v);
      }
    }
  ) : /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    (n == null ? void 0 : n.folder) && /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, "data-testid": "default-folder", children: [
      /* @__PURE__ */ l(J, {}),
      /* @__PURE__ */ l("span", { className: "sm-mono sm-ellipsis", style: { fontSize: 13 }, title: n.folder, children: n.display && fe(n.display) }),
      n.suggested ? /* @__PURE__ */ l(de, { variant: "aim", children: "Suggested" }) : /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12 }, children: "Default" }),
      /* @__PURE__ */ l("span", { style: { flex: 1 } }),
      /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", disabled: H || C !== null, onClick: re, children: "Browse…" })
    ] }),
    H && /* @__PURE__ */ m("div", { role: "status", className: "sm-notice", "data-testid": "window-open", children: [
      /* @__PURE__ */ l("span", { style: { flex: 1 }, children: "Pick a folder in the window that just opened." }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "sm-plain sm-link",
          onClick: () => {
            $e(), R(null);
          },
          children: "Pick here instead"
        }
      )
    ] }),
    n && n.folder === null && V("Pick the folder that holds your projects"),
    (n == null ? void 0 : n.missing) && V(`${n.display} isn't there any more`),
    (n == null ? void 0 : n.folder) && !n.missing && n.repos.length === 0 && V(`No projects in ${n.display}`),
    (n == null ? void 0 : n.folder) && n.repos.length > 0 && /* @__PURE__ */ l(
      qe,
      {
        list: n,
        projects: t,
        busy: C !== null,
        onAdd: (v) => void ne(v.path, !0),
        onOpen: (v) => s(v.key)
      },
      n.folder
    ),
    f ? /* @__PURE__ */ m(
      "form",
      {
        onSubmit: (v) => {
          v.preventDefault(), w.trim() && ne(w.trim(), !1);
        },
        children: [
          /* @__PURE__ */ l("label", { style: { display: "block", ...y, fontSize: 12, marginBottom: 4 }, htmlFor: "system-map-path", children: "Full path to a project" }),
          /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ l(
              Ce,
              {
                id: "system-map-path",
                placeholder: "/path/to/project",
                value: w,
                disabled: C !== null,
                autoFocus: !0,
                onChange: (v) => $(v.target.value),
                style: { flex: 1, minWidth: 0 }
              }
            ),
            /* @__PURE__ */ l(j, { primary: !0, type: "submit", disabled: C !== null || !w.trim(), children: "Add" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", style: { justifySelf: "start" }, disabled: C !== null, onClick: () => h(!0), children: "Use a full path" }),
    /* @__PURE__ */ l("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: C !== null ? `Building ${C.split("/").pop()}. This can take a minute.` : b ?? c })
  ] }) });
}
const Rt = 200, Mt = 58, ye = /* @__PURE__ */ new Set(["starts", "hands_off_to", "uses_model"]), Qe = /* @__PURE__ */ new Set(["planned", "partial"]), ee = "group:tables", I = "group:routes", z = "group:jobs";
function ae(e) {
  return `${e.files} ${e.files === 1 ? "file" : "files"}, ${e.lines} lines`;
}
function T(e) {
  return e === "." ? "root files" : e.replace(/^src\//, "");
}
function X(e) {
  var t, r;
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : T(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: T(e.path ?? e.name), subtitle: ae(e) };
    case "module": {
      const s = e.area === `area:${e.path}`;
      return {
        id: e.id,
        kind: "module",
        title: s ? `${e.name} (top level)` : e.name,
        subtitle: ae(e)
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
    case "agent": {
      const s = ((t = e.jobs) == null ? void 0 : t.length) ?? 0;
      return {
        id: e.id,
        kind: "agent",
        title: e.label ?? e.name,
        subtitle: `${s} ${s === 1 ? "job" : "jobs"}`,
        status: e.status === "built" ? void 0 : e.status,
        badge: (r = e.asks_you) != null && r.length ? "asks you" : void 0
      };
    }
    default:
      return { id: e.id, kind: e.kind, title: e.name };
  }
}
function U(e, t) {
  const r = e.nodes.filter((c) => c.kind === "route"), s = r.filter((c) => c.route_kind === "api").length, i = e.nodes.filter((c) => c.kind === "job").length, n = [];
  return r.length && n.push({ id: I, kind: "group", title: "Routes", subtitle: `${r.length - s} pages, ${s} API` }), t && n.push({ id: ee, kind: "group", title: "Database", subtitle: `${t} ${t === 1 ? "table" : "tables"}` }), i && n.push({ id: z, kind: "group", title: "Scheduled jobs", subtitle: `${i} jobs` }), n;
}
function Je(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const Xe = 3, Ze = 24;
function we(e, t) {
  return !!(e && t && (e === t || e.startsWith(`${t}/`)));
}
function oe(e, t) {
  if (e.startsWith("table:")) return ee;
  const r = t.byId.get(e);
  return r ? r.status === "proposed" ? e : (r.kind === "module" || r.kind === "area") && we(r.path, t.routesDir) ? I : r.kind === "module" ? r.area === t.open ? e : r.area ?? e : r.kind === "route" ? t.expanded === I ? e : I : r.kind === "job" ? t.expanded === z ? e : z : e : null;
}
function ve(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !Qe.has(e.status));
}
function te(e, t, r, s) {
  const i = /* @__PURE__ */ new Map();
  for (const n of e.edges) {
    if (ve(t.byId.get(n.source), r)) continue;
    const c = oe(n.source, t), a = oe(n.target, t);
    if (!c || !a || c === a || !s(c, a)) continue;
    const o = `${c}|${a}|${n.kind}`, d = i.get(o);
    d ? d.count += n.count : i.set(o, { id: o, source: c, target: a, kind: n.kind, count: n.count, proposed: n.proposed });
  }
  return [...i.values()];
}
function P(e, t, r) {
  const s = [];
  for (const i of e) {
    const n = r.find((a) => a.id === i), c = t.byId.get(i);
    n ? s.push(n) : c ? s.push(X(c)) : i.startsWith("table:") && s.push(Je(i));
  }
  return s;
}
function et(e, t, r, s) {
  const i = U(e, r), n = te(e, t, s, () => !0), c = n.length <= Ze ? n : n.filter((o) => o.kind !== "imports" || o.count >= Xe), a = new Set(i.map((o) => o.id));
  for (const o of e.nodes)
    o.kind === "area" && !we(o.path, t.routesDir) && a.add(o.id), o.kind === "service" && a.add(o.id), o.kind === "plan" && !ve(o, s) && a.add(o.id), o.status === "proposed" && a.add(o.id);
  return { cards: P(a, t, i), lines: c.filter((o) => a.has(o.source) && a.has(o.target)), hidden: n.length - c.length };
}
function tt(e, t, r, s) {
  const i = new Set(e.nodes.filter((a) => a.area === t.open && a.kind === "module").map((a) => a.id)), n = te(
    e,
    t,
    s,
    (a, o) => (i.has(a) || i.has(o)) && !a.startsWith("area:") && !o.startsWith("area:")
  ), c = new Set(i);
  for (const a of n)
    c.add(a.source), c.add(a.target);
  return { cards: P(c, t, U(e, r)), lines: n };
}
function nt(e, t, r, s) {
  const i = t.expanded === I ? "route" : "job", n = new Set(e.nodes.filter((o) => o.kind === i).map((o) => o.id)), c = te(e, t, s, (o, d) => n.has(o) || n.has(d)), a = new Set(n);
  for (const o of c)
    a.add(o.source), a.add(o.target);
  return { cards: P(a, t, U(e, r)), lines: c };
}
function rt(e, t, r) {
  const s = [], i = /* @__PURE__ */ new Set([r]);
  for (const n of e.edges)
    n.source !== r && n.target !== r || (i.add(n.source), i.add(n.target), s.push({ id: `${n.source}|${n.target}|${n.kind}`, source: n.source, target: n.target, kind: n.kind, count: n.count }));
  return { cards: P(i, t, []), lines: s };
}
function Ot(e, t, r) {
  const s = new Map(e.nodes.map((a) => [a.id, a])), i = new Set(t), n = /* @__PURE__ */ new Map();
  for (const a of e.edges) {
    if (!i.has(a.source) || !i.has(a.target)) continue;
    const o = `${a.source}|${a.target}|${a.kind}`;
    n.set(o, { id: o, source: a.source, target: a.target, kind: a.kind, count: a.count, proposed: a.proposed });
  }
  return { cards: P(i, { byId: s }, U(e, r)), lines: [...n.values()] };
}
function xe(e) {
  if (e.routes_dir) return e.routes_dir;
  const t = e.nodes.find((s) => s.kind === "route"), r = t == null ? void 0 : t.evidence[0];
  return r ? r.slice(0, r.lastIndexOf("/")) : null;
}
function it(e) {
  const t = new Set(e.nodes.filter((s) => s.kind === "agent").map((s) => s.id));
  if (t.size === 0) return e;
  const r = (s) => !ye.has(s.kind) && !t.has(s.source) && !t.has(s.target);
  return { ...e, nodes: e.nodes.filter((s) => !t.has(s.id)), edges: e.edges.filter(r) };
}
function st(e, t) {
  return e.trim().toLowerCase() === t.trim().toLowerCase();
}
function at(e) {
  const t = new Map(e.nodes.map((d) => [d.id, d])), r = e.nodes.filter((d) => d.kind === "agent").map((d) => d.id), s = new Set(r), i = /* @__PURE__ */ new Map();
  for (const d of e.edges) {
    if (!ye.has(d.kind) || !(t.has(d.source) && t.has(d.target)) || !r.includes(d.source) && !r.includes(d.target)) continue;
    s.add(d.source), s.add(d.target);
    const p = `${d.source}|${d.target}|${d.kind}`, u = i.get(p);
    u ? u.count += d.count : i.set(p, { id: p, source: d.source, target: d.target, kind: d.kind, count: d.count, leaves: d.leaves_region || void 0 });
  }
  const n = e.home_region ?? null, c = /* @__PURE__ */ new Map(), a = [...s].map((d) => {
    const p = t.get(d);
    return p.kind !== "service" ? X(p) : (p.region && c.set(p.region, [...c.get(p.region) ?? [], d]), { ...X(p), subtitle: p.region ?? "no region set" });
  }), o = [...c].map(([d, p]) => {
    const u = n ? st(d, n) ? "home" : "away" : "unknown";
    return { id: `band:${d}`, label: u === "home" ? `${d} · home` : d, tone: u, members: p };
  });
  return { cards: a, lines: [...i.values()], bands: o };
}
function Pt(e, t, r, s, i = !1) {
  if (i) return at(e);
  e = it(e);
  const n = new Map(e.nodes.map((u) => [u.id, u])), c = xe(e), a = t === `area:${c}` ? I : t, o = a != null && a.startsWith("area:") ? a : null, d = a === I || a === z ? a : null, p = { byId: n, open: o, expanded: d, routesDir: c };
  return a ? o ? tt(e, p, r, s) : d ? nt(e, p, r, s) : rt(e, p, a) : et(e, p, r, s);
}
function Tt(e, t, r = !1) {
  const s = [{ id: null, label: r ? "Agents" : "System" }];
  if (!t) return s;
  if (r) {
    const n = e.nodes.find((c) => c.id === t);
    return n ? [...s, { id: t, label: n.label ?? n.name }] : s;
  }
  if (t === I || t === `area:${xe(e)}`) return [...s, { id: t, label: "Routes" }];
  if (t === z) return [...s, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...s, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const i = e.nodes.find((n) => n.id === t);
  if (!i) return s;
  if (i.kind === "area") return [...s, { id: t, label: T(i.path ?? i.name) }];
  if (i.kind === "module") {
    const n = e.nodes.find((c) => c.id === i.area);
    return [
      ...s,
      { id: i.area ?? null, label: T((n == null ? void 0 : n.path) ?? "") },
      { id: t, label: i.name }
    ];
  }
  return i.kind === "route" ? [...s, { id: I, label: "Routes" }, { id: t, label: i.name }] : i.kind === "job" ? [...s, { id: z, label: "Scheduled jobs" }, { id: t, label: i.name }] : [...s, { id: t, label: i.name }];
}
const ot = {
  [ee]: "table:",
  [I]: "route:",
  [z]: "job:"
};
function Ft(e, t) {
  const r = new Set(t[e] ?? []), s = ot[e];
  if (s)
    for (const [i, n] of Object.entries(t))
      i.startsWith(s) && n.forEach((c) => r.add(c));
  return [...r].sort();
}
function Bt(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function Ut(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function Ht(e, t) {
  return t ? t.overlaps.filter((r) => [...r.schema, ...r.schema_and_code, ...r.code, ...r.modules].includes(e)) : [];
}
function Vt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [r, s] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    r.startsWith("table:") && t.set(r, s.length);
  return t;
}
function Kt(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function Gt(e, t) {
  const r = new Set(t);
  return {
    tables: e.tables.filter((s) => r.has(s.id)),
    edges: e.edges.filter((s) => r.has(s.source) && r.has(s.target))
  };
}
function qt(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
function lt({
  trigger: e,
  children: t,
  width: r,
  align: s = "left",
  popup: i = "dialog",
  label: n,
  block: c = !1
}) {
  const [a, o] = g(!1), d = A(null), p = A(null), u = _(() => {
    var f;
    o(!1), (f = p.current) == null || f.focus();
  }, []);
  return k(() => {
    if (!a) return;
    const f = (h) => {
      var w;
      (w = d.current) != null && w.contains(h.target) || o(!1);
    };
    return document.addEventListener("pointerdown", f), () => document.removeEventListener("pointerdown", f);
  }, [a]), /* @__PURE__ */ m(
    "span",
    {
      ref: d,
      style: { position: "relative", display: c ? "block" : "inline-flex", minWidth: 0, maxWidth: "100%" },
      onKeyDown: (f) => {
        f.key === "Escape" && a && (f.stopPropagation(), u());
      },
      onBlur: (f) => {
        var w;
        const h = f.relatedTarget;
        h && !((w = d.current) != null && w.contains(h)) && o(!1);
      },
      children: [
        e({
          ref: p,
          onClick: () => o((f) => !f),
          onKeyDown: (f) => {
            f.key === "ArrowDown" && !a && (f.preventDefault(), o(!0));
          },
          "aria-expanded": a,
          "aria-haspopup": i
        }),
        a && // The host's main can take focus, so a click on anything here that can't would land
        // there and close this before the click arrives. Focus stops here instead.
        /* @__PURE__ */ l(
          "div",
          {
            className: "sm-pop",
            tabIndex: -1,
            role: i === "dialog" ? "dialog" : void 0,
            "aria-label": i === "dialog" ? n : void 0,
            style: { top: "calc(100% + 6px)", [s]: 0, width: `min(${r}px, calc(100vw - 24px))` },
            children: t(u)
          }
        )
      ]
    }
  );
}
function Yt({ label: e, children: t }) {
  const r = A(null);
  return k(() => {
    var i, n;
    (n = (i = r.current) == null ? void 0 : i.querySelector('[role="menuitem"]')) == null || n.focus();
  }, []), /* @__PURE__ */ l("div", { ref: r, role: "menu", "aria-label": e, onKeyDown: (i) => {
    var o;
    const n = [...((o = r.current) == null ? void 0 : o.querySelectorAll('[role="menuitem"]')) ?? []], c = n.indexOf(document.activeElement), a = i.key === "ArrowDown" ? c + 1 : i.key === "ArrowUp" ? c - 1 : null;
    a === null || n.length === 0 || (i.preventDefault(), n[(a + n.length) % n.length].focus());
  }, children: t });
}
function dt() {
  return /* @__PURE__ */ l("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ l("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function ct({
  project: e,
  hint: t,
  onBuilt: r,
  onRemove: s
}) {
  const i = S(), [n, c] = g(!1), [a, o] = g(null), [d, p] = g(null), u = Z(e.status, e.behind, e.ref), f = Fe(e.intent), h = async () => {
    o("Rebuilding"), p(null);
    try {
      await i.post(`${x}/build`, { repo: e.repo_key }), r();
    } catch ($) {
      p(L($, "rebuild this project"));
    } finally {
      o(null);
    }
  }, w = async () => {
    o("Removing"), p(null);
    try {
      await s(e.repo_key);
    } catch ($) {
      p(L($, "remove this project")), o(null);
    }
  };
  return /* @__PURE__ */ m("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ l("span", { className: "sm-dot", "data-tone": u.tone }),
      /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: u.label }),
      /* @__PURE__ */ l("span", { style: { flex: 1 } }),
      /* @__PURE__ */ l(j, { disabled: a !== null || e.status === "missing", onClick: () => void h(), children: a === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ l(j, { danger: !0, disabled: a !== null, onClick: () => c(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ l("div", { className: "sm-mono sm-ellipsis", style: { ...y, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ m("div", { style: { ...y, fontSize: 12, marginTop: 2 }, children: [
      E(e.tables, "table"),
      ", built ",
      he(e.built_at, Date.now() / 1e3)
    ] }),
    n && /* @__PURE__ */ m("div", { role: "alert", style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border, #e4e4e7)" }, "data-testid": "confirm-remove", children: [
      /* @__PURE__ */ m("p", { style: { margin: "0 0 8px" }, children: [
        "Remove ",
        e.name,
        " from System Map? This deletes its model",
        f ? ` and ${f}` : "",
        " for good. The repo itself isn't touched."
      ] }),
      /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ l(j, { danger: !0, disabled: a !== null, onClick: () => void w(), autoFocus: !0, children: a === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ l(j, { disabled: a !== null, onClick: () => c(!1), children: "Keep it" })
      ] })
    ] }),
    d && /* @__PURE__ */ l("p", { style: { margin: "8px 0 0" }, children: d })
  ] });
}
function ut({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: s,
  onRemoved: i
}) {
  const n = S(), c = async (a) => {
    await n.post(`${x}/repo-remove`, { repo: a }), i(a);
  };
  return /* @__PURE__ */ l(ce, { open: e, onClose: r, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ m("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((a) => /* @__PURE__ */ l(ct, { project: a, hint: ue(a, t), onBuilt: s, onRemove: c }, a.repo_key)),
    t.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0 }, children: "No projects yet." })
  ] }) });
}
const le = (e) => `system-map-project-${e}`;
function pt({
  projects: e,
  activeKey: t,
  close: r,
  onPick: s,
  onAdd: i,
  onManage: n
}) {
  const [c, a] = g(""), o = Me(e, c), [d, p] = g(() => Math.max(0, o.findIndex((h) => h.repo_key === t))), u = Math.min(d, o.length - 1), f = (h) => {
    if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), o.length === 0) return;
      p((u + (h.key === "ArrowDown" ? 1 : -1) + o.length) % o.length);
    } else h.key === "Enter" && o[u] && (h.preventDefault(), r(), s(o[u].repo_key));
  };
  return /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ l(
      B,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Find a project",
        "aria-expanded": !0,
        "aria-controls": "system-map-project-list",
        "aria-activedescendant": o[u] ? le(o[u].repo_key) : void 0,
        placeholder: "Find a project",
        value: c,
        onKeyDown: f,
        onChange: (h) => {
          a(h.target.value), p(0);
        }
      }
    ),
    /* @__PURE__ */ l("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: o.map((h, w) => {
      const $ = ue(h, e);
      return /* @__PURE__ */ m(
        "li",
        {
          id: le(h.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": h.repo_key === t,
          "data-active": w === u,
          title: h.repo,
          onMouseEnter: () => p(w),
          onClick: () => {
            r(), s(h.repo_key);
          },
          children: [
            /* @__PURE__ */ l("span", { className: "sm-dot", "data-tone": Z(h.status, h.behind, h.ref).tone }),
            /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: h.name }),
            $ && /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { ...y, fontSize: 12 }, children: $ }),
            /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: Re(h) })
          ]
        },
        h.repo_key
      );
    }) }),
    o.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ l("div", { className: "sm-rule" }),
    /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-row", onClick: i, children: "Add project" }),
    /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-row", onClick: n, children: "Manage projects" })
  ] });
}
function Qt({
  projects: e,
  activeKey: t,
  compact: r = !1,
  onPick: s,
  onReload: i
}) {
  const n = e.find((u) => u.repo_key === t), [c, a] = g(null), o = () => a(null);
  return { menu: /* @__PURE__ */ l(
    lt,
    {
      width: 340,
      label: "Projects",
      block: r,
      trigger: (u) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${r ? " sm-compact" : ""}`,
          title: n == null ? void 0 : n.repo,
          "aria-label": `Project: ${(n == null ? void 0 : n.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...u,
          children: [
            /* @__PURE__ */ l("span", { className: "sm-ellipsis", children: n == null ? void 0 : n.name }),
            /* @__PURE__ */ l(dt, {})
          ]
        }
      ),
      children: (u) => /* @__PURE__ */ l(
        pt,
        {
          projects: e,
          activeKey: t,
          close: u,
          onPick: s,
          onAdd: () => {
            u(), a("add");
          },
          onManage: () => {
            u(), a("manage");
          }
        }
      )
    }
  ), dialogs: /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ l(
      Ye,
      {
        open: c === "add",
        projects: e,
        onClose: o,
        onBuilt: (u) => {
          o(), i(), s(u);
        }
      }
    ),
    /* @__PURE__ */ l(
      ut,
      {
        open: c === "manage",
        projects: e,
        onClose: o,
        onBuilt: i,
        onRemoved: (u) => {
          const f = e.find((h) => h.repo_key !== u);
          f || o(), u === t && f && s(f.repo_key), i();
        }
      }
    )
  ] }) };
}
export {
  Le as A,
  Vt as B,
  dt as C,
  lt as D,
  Kt as E,
  Gt as F,
  ee as G,
  Z as H,
  It as I,
  Qt as J,
  St as K,
  Ht as L,
  y as M,
  Ct as N,
  Be as O,
  L as P,
  x as Q,
  jt as R,
  Ee as S,
  $t as T,
  At as U,
  Lt as V,
  Dt as W,
  zt as X,
  E as Y,
  Y as a,
  he as b,
  Mt as c,
  Rt as d,
  Ot as e,
  Pt as f,
  Bt as g,
  Ut as h,
  I as i,
  z as j,
  Yt as k,
  Ye as l,
  yt as m,
  wt as n,
  xt as o,
  qt as p,
  vt as q,
  Nt as r,
  T as s,
  Tt as t,
  bt as u,
  _t as v,
  Ft as w,
  Et as x,
  Wt as y,
  kt as z
};
