import { jsxs as h, jsx as l, Fragment as T } from "react/jsx-runtime";
import { SearchInput as B, Badge as le, Modal as de, Input as $e, Btn as E } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as W, useEffect as k, useRef as A } from "react";
import { useAppApi as S } from "@kirocrew/app-sdk";
const re = "system-map-chrome-css", Se = `
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
if (!document.getElementById(re)) {
  const e = document.createElement("style");
  e.id = re, e.textContent = Se, document.head.appendChild(e);
}
const Ce = /^API (\d{3}): ([\s\S]*)$/;
function Ie(e) {
  const t = e ?? {};
  if (typeof t.status == "number") return { status: t.status, body: t.body ?? "" };
  const r = Ce.exec(typeof t.message == "string" ? t.message : "");
  return r ? { status: Number(r[1]), body: r[2] } : { status: null, body: "" };
}
function Ne(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.error == "string" && t.error ? t.error : null;
  } catch {
    return null;
  }
}
function j(e, t) {
  const { status: r, body: s } = Ie(e);
  if (r === null) return `Couldn't ${t}. Check the dashboard is still connected, then try again.`;
  if (r === 400 || r === 404) {
    const i = Ne(s);
    if (i) return i;
  }
  return r === 401 || r === 403 ? `Couldn't ${t}, because System Map isn't allowed to. Check its permissions on its Details page.` : r >= 500 ? `Couldn't ${t}, because System Map's backend isn't answering. Try again in a moment.` : `Couldn't ${t}. Try again.`;
}
const x = "/apps/system-map/api";
function M(e, t) {
  return t ? `${x}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${x}${e}`;
}
const G = "system-map.repo", q = "system-map:project";
function ft() {
  var m, p;
  const e = S(), [t, r] = g([]), [s, i] = g(!1), [n, d] = g(() => localStorage.getItem(G)), o = W(async () => {
    try {
      const u = await e.get(`${x}/repos`);
      r(u.repos);
    } catch {
      r([]);
    } finally {
      i(!0);
    }
  }, [e]);
  k(() => {
    o();
  }, [o]), k(() => {
    const u = () => {
      d(localStorage.getItem(G)), o();
    };
    return window.addEventListener(q, u), () => window.removeEventListener(q, u);
  }, [o]);
  const a = W((u) => {
    localStorage.setItem(G, u), window.dispatchEvent(new Event(q));
  }, []), c = ((m = t.find((u) => u.repo_key === n)) == null ? void 0 : m.repo_key) ?? ((p = t[0]) == null ? void 0 : p.repo_key) ?? null;
  return { repos: t, active: c, loaded: s, choose: a, reload: o };
}
function mt(e) {
  const t = S(), [r, s] = g(null), [i, n] = g(null), d = A(e);
  d.current = e;
  const o = W(async () => {
    if (!e) {
      s(null);
      return;
    }
    try {
      const a = await t.get(M("/overview", e));
      if (d.current !== e) return;
      s(a), n(null);
    } catch (a) {
      if (d.current !== e) return;
      s(null), n(j(a, "load this project"));
    }
  }, [t, e]);
  return k(() => {
    n(null), o();
  }, [o]), { overview: (r == null ? void 0 : r.manifest.repo_key) === e ? r : null, error: i, refresh: o };
}
function ht(e, t, r) {
  const s = S(), [i, n] = g({ repo: t, value: null, failed: !1 });
  return k(() => {
    if (!r) return;
    let d = !0;
    return s.get(M(e, t)).then((o) => {
      d && n({ repo: t, value: o, failed: !1 });
    }).catch(() => {
      d && n({ repo: t, value: null, failed: !0 });
    }), () => {
      d = !1;
    };
  }, [s, e, t, r]), i.repo === t ? { value: i.value, failed: i.failed } : { value: null, failed: !1 };
}
function gt(e, t, r) {
  const s = S(), [i, n] = g(null);
  return k(() => {
    if (!e) {
      n(null);
      return;
    }
    let d = !0;
    return s.get(M(`/proposal?id=${encodeURIComponent(e)}`, t)).then((o) => {
      d && n(o);
    }).catch(() => {
      d && n(null);
    }), () => {
      d = !1;
    };
  }, [s, e, t, r]), i;
}
function bt(e, t, r) {
  const s = S(), [i, n] = g({ repo: t, value: null, failed: !1 }), [d, o] = g(null), a = A(t);
  a.current = t;
  const c = W(async () => {
    if (t)
      try {
        const p = await s.get(M(e, t));
        if (a.current !== t) return;
        n({ repo: t, value: p, failed: !1 }), o(Date.now());
      } catch {
        a.current === t && n({ repo: t, value: null, failed: !0 });
      }
  }, [s, e, t]);
  k(() => {
    c();
    const p = window.setInterval(() => {
      document.visibilityState === "visible" && c();
    }, r);
    return () => window.clearInterval(p);
  }, [c, r]);
  const m = i.repo === t;
  return { value: m ? i.value : null, failed: m && i.failed, checkedAt: d, refresh: c };
}
function yt(e, t = null) {
  const r = S(), [s, i] = g(null);
  return k(() => {
    if (!e) {
      i(null);
      return;
    }
    let n = !0;
    return r.get(M(`/node?id=${encodeURIComponent(e)}`, t)).then((d) => {
      n && i(d);
    }).catch(() => {
      n && i(null);
    }), () => {
      n = !1;
    };
  }, [r, e, t]), s;
}
const Y = { fontFamily: "var(--mono, ui-monospace, monospace)" }, y = { color: "var(--muted, #71717a)" }, We = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function _e({ severity: e }) {
  return /* @__PURE__ */ l("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ l(le, { variant: We[e], children: e }) });
}
function vt({
  tables: e,
  selected: t,
  flagged: r,
  working: s,
  onSelect: i
}) {
  const [n, d] = g(""), o = e.filter((a) => a.name.includes(n.trim().toLowerCase()));
  return /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ l(
      B,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: n,
        onChange: (a) => d(a.target.value)
      }
    ),
    /* @__PURE__ */ l("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: o.map((a) => /* @__PURE__ */ h(
      "button",
      {
        onClick: () => i(a.id),
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
          background: a.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
        },
        children: [
          /* @__PURE__ */ l("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: a.name }),
          /* @__PURE__ */ h("span", { style: { ...y, display: "flex", gap: 6, flexShrink: 0 }, children: [
            s != null && s.get(a.id) ? /* @__PURE__ */ h(
              "span",
              {
                title: "Worktrees changing this table or its code",
                style: { color: (s.get(a.id) ?? 0) > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" },
                children: [
                  s.get(a.id),
                  " at work"
                ]
              }
            ) : null,
            r != null && r.get(a.id) ? /* @__PURE__ */ l("span", { title: `${r.get(a.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: r.get(a.id) }) : null,
            /* @__PURE__ */ l("span", { title: `${a.columns} columns`, children: a.columns })
          ] })
        ]
      },
      a.id
    )) })
  ] });
}
function _({ title: e, children: t }) {
  return /* @__PURE__ */ h("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ l("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const O = { margin: 0, paddingLeft: 16 };
function wt({
  nodes: e,
  focus: t,
  onSelect: r
}) {
  const [s, i] = g(""), n = s.trim().toLowerCase(), d = e.filter((c) => c.kind === "area").sort((c, m) => (m.lines ?? 0) - (c.lines ?? 0)), o = e.filter((c) => c.kind === "module"), a = (c, m, p) => /* @__PURE__ */ h(
    "button",
    {
      onClick: () => r(c.id),
      style: {
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        padding: `3px 8px 3px ${8 + m * 14}px`,
        border: 0,
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        fontWeight: m === 0 ? 600 : 400,
        color: "var(--text, inherit)",
        background: c.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ l("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p }),
        /* @__PURE__ */ l("span", { style: { ...y, fontWeight: 400, flexShrink: 0 }, title: `${c.files} files`, children: c.files })
      ]
    },
    c.id
  );
  return /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ l(B, { "aria-label": "Filter modules", placeholder: "Filter modules", value: s, onChange: (c) => i(c.target.value) }),
    /* @__PURE__ */ l("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: d.map((c) => {
      const m = o.filter((f) => f.area === c.id && f.path !== c.path), p = m.filter((f) => f.name.toLowerCase().includes(n)), u = n !== "" || t === c.id || m.some((f) => f.id === t);
      return n && p.length === 0 && !c.name.toLowerCase().includes(n) ? null : /* @__PURE__ */ h("div", { children: [
        a(c, 0, c.path === "." ? c.name : (c.path ?? c.name).replace(/^src\//, "")),
        u && p.map((f) => a(f, 1, f.name))
      ] }, c.id);
    }) })
  ] });
}
function Ee({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ l(T, { children: e.map((r) => /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ l(_e, { severity: r.severity }),
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
function xt({ node: e, onAsk: t }) {
  const r = e.constraints.filter((i) => i.kind !== "check"), s = e.constraints.filter((i) => i.kind === "check");
  return /* @__PURE__ */ h("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ l("p", { style: { ...y, ...Y, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ l(_, { title: "Findings", children: /* @__PURE__ */ l(Ee, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ l(_, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ l("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ l("tbody", { children: e.columns.map((i) => /* @__PURE__ */ h("tr", { title: i.source, children: [
      /* @__PURE__ */ l("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.name }),
      /* @__PURE__ */ l("td", { style: { ...y, ...Y, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: i.type }),
      /* @__PURE__ */ l("td", { style: { ...y, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: i.nullable ? "null" : "not null" })
    ] }, i.name)) }) }) }),
    r.length > 0 && /* @__PURE__ */ l(_, { title: "Keys", children: /* @__PURE__ */ l("ul", { style: O, children: r.map((i) => /* @__PURE__ */ h("li", { title: i.source, children: [
      i.kind.replace("_", " "),
      " (",
      i.columns.join(", "),
      ")",
      i.references ? ` to ${i.references}, on delete ${i.on_delete}` : ""
    ] }, i.name)) }) }),
    s.length > 0 && /* @__PURE__ */ l(_, { title: "Checks", children: /* @__PURE__ */ l("ul", { style: O, children: s.map((i) => /* @__PURE__ */ l("li", { title: i.source, style: { ...Y, fontSize: 12, overflowWrap: "anywhere" }, children: i.expression }, i.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ l(_, { title: "Indexes", children: /* @__PURE__ */ l("ul", { style: O, children: e.indexes.map((i) => /* @__PURE__ */ h("li", { title: i.source, children: [
      i.name,
      " (",
      i.columns.join(", "),
      ")",
      i.unique ? ", unique" : "",
      i.partial ? ", partial" : ""
    ] }, i.name)) }) }),
    e.schema !== "main" && /* @__PURE__ */ l(_, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ l("ul", { style: O, children: e.policies.map((i) => /* @__PURE__ */ h("li", { title: i.source, children: [
      i.name,
      ": ",
      i.command,
      " for ",
      i.roles.join(", ")
    ] }, i.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ l(_, { title: "Triggers", children: /* @__PURE__ */ l("ul", { style: O, children: e.triggers.map((i) => /* @__PURE__ */ h("li", { title: i.source, children: [
      i.name,
      ": ",
      i.timing,
      " ",
      i.events.join(", ")
    ] }, i.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ l(_, { title: "Notes", children: e.reads.map((i, n) => /* @__PURE__ */ l("p", { style: { margin: "0 0 6px" }, children: i.text }, n)) })
  ] });
}
const Ae = ["map", "data", "plan", "risk", "worktrees", "findings", "explore"];
function kt(e) {
  return e.missing ? "missing" : e.error ? "unknown" : e.stale || e.map_stale ? "stale" : e.commits_behind > 0 ? "behind" : "current";
}
function X(e, t, r) {
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
function L(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
const je = { postgres: "Postgres", sqlite: "SQLite" };
function $t(e) {
  const t = [
    e.tables ? `${L(e.tables, "table")} from ${je[e.engine ?? ""] ?? e.engine}` : "No tables found",
    e.routes ? `${L(e.routes, "route")}, ${e.route_style}` : "No routes found",
    `${L(e.code_files, "code file")}, ${L(e.links, "link")}`
  ];
  return e.git || t.push("No git history, so no churn or worktrees"), t;
}
function ze(e) {
  return e.status === "current" ? L(e.tables, "table") : X(e.status, e.behind, e.ref).label;
}
function ce(e, t) {
  return t.filter((s) => s.name === e.name).length > 1 ? e.parent : null;
}
function De(e, t) {
  const r = t.trim().toLowerCase();
  return r ? e.filter((s) => s.name.toLowerCase().includes(r) || s.repo.toLowerCase().includes(r)) : e;
}
function Re(e) {
  return e.length > 1 ? e.replace(/\/+$/, "") : e;
}
function Oe(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const n = Re(i), d = n.lastIndexOf("/");
    d > 0 && t.set(n.slice(0, d), (t.get(n.slice(0, d)) ?? 0) + 1);
  }
  let r = null, s = 0;
  for (const [i, n] of t)
    n > s && (r = i, s = n);
  return r;
}
function ue(e, t, r) {
  const s = r.trim().toLowerCase(), i = new Set(t.map((d) => d.repo_key)), n = e.filter((d) => d.name.toLowerCase().includes(s));
  return { toAdd: n.filter((d) => !i.has(d.key)), added: n.filter((d) => i.has(d.key)) };
}
function pe(e, t = 40) {
  return e.length > t ? `…${e.slice(1 - t)}` : e;
}
function Me(e, t) {
  const r = ue(e, t, "").toAdd.length;
  return r ? `Search ${L(r, "workspace")}` : "Search workspaces";
}
function Pe(e) {
  const r = [
    [e.proposals, "proposal", "proposals"],
    [e.use_cases, "use case", "use cases"],
    [e.views, "saved view", "saved views"]
  ].filter(([s]) => s > 0).map(([s, i, n]) => `${s} ${s === 1 ? i : n}`);
  return r.length === 0 ? "" : r.length === 1 ? r[0] : `${r.slice(0, -1).join(", ")} and ${r[r.length - 1]}`;
}
function fe(e, t) {
  const r = Math.max(0, t - e);
  return r < 60 ? "just now" : r < 3600 ? `${Math.floor(r / 60)}m ago` : r < 86400 ? `${Math.floor(r / 3600)}h ago` : `${Math.floor(r / 86400)}d ago`;
}
const me = (e) => `system-map.view.${e}`;
function St(e, t) {
  if (!t) return "map";
  const r = e.getItem(me(t));
  return Ae.find((s) => s === r) ?? "map";
}
function Ct(e, t, r) {
  e.setItem(me(t), r);
}
const he = "system-map.side-list";
function It(e) {
  return e === "map" || e === "data";
}
function Nt(e) {
  return e.getItem(he) !== "hidden";
}
function Wt(e, t) {
  e.setItem(he, t ? "shown" : "hidden");
}
function Fe(e) {
  return `system-map-design-${e}`;
}
const ge = (e) => `system-map.chat.${e}`;
function _t(e, t) {
  return e.getItem(ge(t)) === "started";
}
function Et(e, t) {
  e.setItem(ge(t), "started");
}
function Lt(e, t) {
  if (!Array.isArray(e)) return !1;
  const r = Fe(t);
  return e.some((s) => (s == null ? void 0 : s.key) === r && typeof s.messages == "number" && s.messages > 0);
}
const Te = 600, ie = "system-map-workspace-list", Q = (e) => `system-map-workspace-${e.key}`;
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
function Be(e) {
  const t = S(), [r, s] = g(null), [i, n] = g(null);
  k(() => {
    if (s(null), n(null), !e) return;
    let o = !0;
    return (async () => {
      const c = await t.get(`${x}/workspaces`);
      if (c.folder !== null) return { ...c, suggested: !1 };
      const m = await t.get("/api/recent-projects").catch(() => ({ dirs: [] })), p = Array.isArray(m.dirs) ? m.dirs.filter((v) => typeof v == "string") : [], u = Oe(p);
      if (u === null) return { ...c, suggested: !1 };
      const f = await t.get(`${x}/workspaces?folder=${encodeURIComponent(u)}`).catch(() => null);
      return f ? { ...f, suggested: !0 } : { ...c, suggested: !1 };
    })().then((c) => {
      o && s(c);
    }).catch((c) => {
      o && n(j(c, "read your default folder"));
    }), () => {
      o = !1;
    };
  }, [t, e]);
  const d = W(
    async (o) => {
      n(null);
      try {
        await t.post(`${x}/default-folder`, { folder: o }), s({ ...await t.get(`${x}/workspaces`), suggested: !1 });
      } catch (a) {
        n(j(a, "save this folder"));
      }
    },
    [t]
  );
  return { list: r, error: i, saveDefault: d };
}
function Ue(e, t, r) {
  const s = S(), [i, n] = g(!1), d = A(!1), o = A({ onPicked: t, onUsePage: r });
  o.current = { onPicked: t, onUsePage: r };
  const a = W((p) => {
    d.current = p, n(p);
  }, []), c = W(() => {
    d.current && (a(!1), s.post(`${x}/folder-window-close`, {}).catch(() => {
    }));
  }, [s, a]);
  return k(() => {
    if (!i) return;
    const p = window.setInterval(() => {
      s.get(`${x}/folder-window`).then((u) => {
        !d.current || u.status === "open" || (a(!1), u.status === "picked" ? o.current.onPicked(u.path) : u.status === "failed" && o.current.onUsePage(u.message));
      }).catch(() => {
        a(!1), o.current.onUsePage(null);
      });
    }, Te);
    return () => window.clearInterval(p);
  }, [s, i, a]), k(() => e ? c : void 0, [e, c]), { waiting: i, openWindow: async (p) => {
    try {
      (await s.post(`${x}/folder-window`, { start: p })).status === "open" ? a(!0) : o.current.onUsePage(null);
    } catch {
      o.current.onUsePage(null);
    }
  }, closeWindow: c };
}
function He({
  start: e,
  note: t,
  onUse: r,
  onCancel: s
}) {
  const i = S(), [n, d] = g(null), [o, a] = g(null), c = W(
    async (m) => {
      a(null);
      try {
        return d(await i.get(`${x}/browse?path=${encodeURIComponent(m)}`)), !0;
      } catch (p) {
        return a(j(p, "open this folder")), !1;
      }
    },
    [i]
  );
  return k(() => {
    c(e ?? "~").then((m) => {
      !m && e !== null && c("~");
    });
  }, [c, e]), /* @__PURE__ */ h("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "folder-list", children: [
    /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
      /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", disabled: !(n != null && n.parent), onClick: () => (n == null ? void 0 : n.parent) && void c(n.parent), children: "‹ Up" }),
      /* @__PURE__ */ l("span", { className: "sm-mono sm-ellipsis", title: n == null ? void 0 : n.path, "data-testid": "folder-list-path", children: n && pe(n.display, 56) })
    ] }),
    /* @__PURE__ */ h("div", { className: "sm-list sm-add-list", children: [
      n == null ? void 0 : n.dirs.map((m) => /* @__PURE__ */ h("button", { type: "button", className: "sm-plain sm-row", title: m.path, onClick: () => void c(m.path), children: [
        /* @__PURE__ */ l(J, {}),
        /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: m.name })
      ] }, m.path)),
      (n == null ? void 0 : n.dirs.length) === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No folders in here." })
    ] }),
    (t ?? o) && /* @__PURE__ */ l("p", { role: "status", style: { margin: 0, fontSize: 13 }, children: o ?? t }),
    /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
      /* @__PURE__ */ l(E, { onClick: s, children: "Cancel" }),
      /* @__PURE__ */ l(E, { primary: !0, disabled: !n, onClick: () => n && r(n.path), children: "Use this folder" })
    ] })
  ] });
}
function Ve({
  workspace: e,
  added: t,
  active: r,
  busy: s,
  now: i,
  onHover: n,
  onPick: d
}) {
  return /* @__PURE__ */ h(
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
        s || d();
      },
      children: [
        /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: t ? y : { fontWeight: 600 }, children: e.name }),
        e.worktrees > 0 && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: L(e.worktrees, "worktree") }),
        /* @__PURE__ */ l("span", { style: { flex: 1 } }),
        /* @__PURE__ */ l("span", { className: "sm-row-action", children: t ? "Open" : "Add" }),
        !t && e.touched > 0 && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: fe(e.touched, i) })
      ]
    }
  );
}
function Ke({
  list: e,
  projects: t,
  busy: r,
  onAdd: s,
  onOpen: i
}) {
  const [n, d] = g(""), [o, a] = g(0), c = A(!1), { toAdd: m, added: p } = ue(e.repos, t, n), u = [...m, ...p], f = Math.min(o, u.length - 1), v = Date.now() / 1e3, $ = (b) => p.includes(b) ? i(b) : s(b);
  k(() => {
    var b;
    c.current && (c.current = !1, u[f] && ((b = document.getElementById(Q(u[f]))) == null || b.scrollIntoView({ block: "nearest" })));
  });
  const C = (b) => {
    if (b.key === "ArrowDown" || b.key === "ArrowUp") {
      if (b.preventDefault(), u.length === 0) return;
      c.current = !0, a((f + (b.key === "ArrowDown" ? 1 : -1) + u.length) % u.length);
    } else b.key === "Enter" && u[f] && !r && (b.preventDefault(), $(u[f]));
  }, D = (b, N, R) => /* @__PURE__ */ l(
    Ve,
    {
      workspace: b,
      added: N,
      active: R === f,
      busy: r,
      now: v,
      onHover: () => a(R),
      onPick: () => $(b)
    },
    b.path
  );
  return /* @__PURE__ */ h(T, { children: [
    /* @__PURE__ */ l(
      B,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Search workspaces",
        "aria-expanded": !0,
        "aria-controls": ie,
        "aria-activedescendant": u[f] ? Q(u[f]) : void 0,
        placeholder: Me(e.repos, t),
        value: n,
        disabled: r,
        onKeyDown: C,
        onChange: (b) => {
          d(b.target.value), a(0);
        }
      }
    ),
    /* @__PURE__ */ h("ul", { id: ie, className: "sm-list sm-add-list", role: "listbox", "aria-label": "Workspaces", children: [
      m.map((b, N) => D(b, !1, N)),
      p.length > 0 && /* @__PURE__ */ l("li", { role: "presentation", className: "sm-add-head", children: "Already added" }),
      p.map((b, N) => D(b, !0, m.length + N))
    ] }),
    u.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "0 9px" }, children: "No workspace matches that." }),
    e.truncated && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, fontSize: 12 }, children: "This folder is too big to search all of it. Pick a smaller one." })
  ] });
}
function Ge({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: s
}) {
  const i = S(), { list: n, error: d, saveDefault: o } = Be(e), [a, c] = g("workspaces"), [m, p] = g(null), [u, f] = g(!1), [v, $] = g(""), [C, D] = g(null), [b, N] = g(null), R = (w) => {
    p(w), c("folders");
  }, { waiting: H, openWindow: we, closeWindow: xe } = Ue(e, (w) => void o(w), R);
  k(() => {
    e && (c("workspaces"), p(null), f(!1), $(""), N(null), D(null));
  }, [e]);
  const te = async (w, ke) => {
    D(w), N(null);
    try {
      ke && (n != null && n.suggested) && n.folder && await i.post(`${x}/default-folder`, { folder: n.folder });
      const K = await i.post(`${x}/build`, { repo_path: w });
      s(K.repo_key);
    } catch (K) {
      N(j(K, "add this project"));
    } finally {
      D(null);
    }
  }, ne = () => void we((n == null ? void 0 : n.folder) ?? null), V = (w) => /* @__PURE__ */ h("div", { className: "sm-add-empty", "data-testid": "add-empty", children: [
    /* @__PURE__ */ l(J, {}),
    /* @__PURE__ */ l("span", { children: w }),
    /* @__PURE__ */ l(E, { primary: !0, disabled: H, onClick: ne, children: "Browse…" })
  ] });
  return /* @__PURE__ */ l(de, { open: e, onClose: r, title: a === "folders" ? "Choose folder" : "Add project", maxWidth: 520, dismissDisabled: C !== null, children: a === "folders" ? /* @__PURE__ */ l(
    He,
    {
      start: (n == null ? void 0 : n.folder) ?? null,
      note: m,
      onCancel: () => c("workspaces"),
      onUse: (w) => {
        c("workspaces"), o(w);
      }
    }
  ) : /* @__PURE__ */ h("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    (n == null ? void 0 : n.folder) && /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, "data-testid": "default-folder", children: [
      /* @__PURE__ */ l(J, {}),
      /* @__PURE__ */ l("span", { className: "sm-mono sm-ellipsis", style: { fontSize: 13 }, title: n.folder, children: n.display && pe(n.display) }),
      n.suggested ? /* @__PURE__ */ l(le, { variant: "aim", children: "Suggested" }) : /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12 }, children: "Default" }),
      /* @__PURE__ */ l("span", { style: { flex: 1 } }),
      /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", disabled: H || C !== null, onClick: ne, children: "Browse…" })
    ] }),
    H && /* @__PURE__ */ h("div", { role: "status", className: "sm-notice", "data-testid": "window-open", children: [
      /* @__PURE__ */ l("span", { style: { flex: 1 }, children: "Pick a folder in the window that just opened." }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "sm-plain sm-link",
          onClick: () => {
            xe(), R(null);
          },
          children: "Pick here instead"
        }
      )
    ] }),
    n && n.folder === null && V("Pick the folder that holds your projects"),
    (n == null ? void 0 : n.missing) && V(`${n.display} isn't there any more`),
    (n == null ? void 0 : n.folder) && !n.missing && n.repos.length === 0 && V(`No repos in ${n.display}`),
    (n == null ? void 0 : n.folder) && n.repos.length > 0 && /* @__PURE__ */ l(
      Ke,
      {
        list: n,
        projects: t,
        busy: C !== null,
        onAdd: (w) => void te(w.path, !0),
        onOpen: (w) => s(w.key)
      },
      n.folder
    ),
    u ? /* @__PURE__ */ h(
      "form",
      {
        onSubmit: (w) => {
          w.preventDefault(), v.trim() && te(v.trim(), !1);
        },
        children: [
          /* @__PURE__ */ l("label", { style: { display: "block", ...y, fontSize: 12, marginBottom: 4 }, htmlFor: "system-map-path", children: "Full path to a repo" }),
          /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ l(
              $e,
              {
                id: "system-map-path",
                placeholder: "/path/to/repo",
                value: v,
                disabled: C !== null,
                autoFocus: !0,
                onChange: (w) => $(w.target.value),
                style: { flex: 1, minWidth: 0 }
              }
            ),
            /* @__PURE__ */ l(E, { primary: !0, type: "submit", disabled: C !== null || !v.trim(), children: "Add" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-link", style: { justifySelf: "start" }, disabled: C !== null, onClick: () => f(!0), children: "Use a full path" }),
    /* @__PURE__ */ l("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: C !== null ? `Building ${C.split("/").pop()}. This can take a minute.` : b ?? d })
  ] }) });
}
const qe = /* @__PURE__ */ new Set(["planned", "partial"]), Z = "group:tables", I = "group:routes", z = "group:jobs";
function se(e) {
  return `${e.files} ${e.files === 1 ? "file" : "files"}, ${e.lines} lines`;
}
function F(e) {
  return e === "." ? "root files" : e.replace(/^src\//, "");
}
function Ye(e) {
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : F(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: F(e.path ?? e.name), subtitle: se(e) };
    case "module": {
      const t = e.area === `area:${e.path}`;
      return {
        id: e.id,
        kind: "module",
        title: t ? `${e.name} (top level)` : e.name,
        subtitle: se(e)
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
function U(e, t) {
  const r = e.nodes.filter((d) => d.kind === "route"), s = r.filter((d) => d.route_kind === "api").length, i = e.nodes.filter((d) => d.kind === "job").length, n = [];
  return r.length && n.push({ id: I, kind: "group", title: "Routes", subtitle: `${r.length - s} pages, ${s} API` }), t && n.push({ id: Z, kind: "group", title: "Database", subtitle: `${t} ${t === 1 ? "table" : "tables"}` }), i && n.push({ id: z, kind: "group", title: "Scheduled jobs", subtitle: `${i} jobs` }), n;
}
function Qe(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, "") };
}
const Je = 3, Xe = 24;
function be(e, t) {
  return !!(e && t && (e === t || e.startsWith(`${t}/`)));
}
function ae(e, t) {
  if (e.startsWith("table:")) return Z;
  const r = t.byId.get(e);
  return r ? r.status === "proposed" ? e : (r.kind === "module" || r.kind === "area") && be(r.path, t.routesDir) ? I : r.kind === "module" ? r.area === t.open ? e : r.area ?? e : r.kind === "route" ? t.expanded === I ? e : I : r.kind === "job" ? t.expanded === z ? e : z : e : null;
}
function ye(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !qe.has(e.status));
}
function ee(e, t, r, s) {
  const i = /* @__PURE__ */ new Map();
  for (const n of e.edges) {
    if (ye(t.byId.get(n.source), r)) continue;
    const d = ae(n.source, t), o = ae(n.target, t);
    if (!d || !o || d === o || !s(d, o)) continue;
    const a = `${d}|${o}|${n.kind}`, c = i.get(a);
    c ? c.count += n.count : i.set(a, { id: a, source: d, target: o, kind: n.kind, count: n.count, proposed: n.proposed });
  }
  return [...i.values()];
}
function P(e, t, r) {
  const s = [];
  for (const i of e) {
    const n = r.find((o) => o.id === i), d = t.byId.get(i);
    n ? s.push(n) : d ? s.push(Ye(d)) : i.startsWith("table:") && s.push(Qe(i));
  }
  return s;
}
function Ze(e, t, r, s) {
  const i = U(e, r), n = ee(e, t, s, () => !0), d = n.length <= Xe ? n : n.filter((a) => a.kind !== "imports" || a.count >= Je), o = new Set(i.map((a) => a.id));
  for (const a of e.nodes)
    a.kind === "area" && !be(a.path, t.routesDir) && o.add(a.id), a.kind === "service" && o.add(a.id), a.kind === "plan" && !ye(a, s) && o.add(a.id), a.status === "proposed" && o.add(a.id);
  return { cards: P(o, t, i), lines: d.filter((a) => o.has(a.source) && o.has(a.target)), hidden: n.length - d.length };
}
function et(e, t, r, s) {
  const i = new Set(e.nodes.filter((o) => o.area === t.open && o.kind === "module").map((o) => o.id)), n = ee(
    e,
    t,
    s,
    (o, a) => (i.has(o) || i.has(a)) && !o.startsWith("area:") && !a.startsWith("area:")
  ), d = new Set(i);
  for (const o of n)
    d.add(o.source), d.add(o.target);
  return { cards: P(d, t, U(e, r)), lines: n };
}
function tt(e, t, r, s) {
  const i = t.expanded === I ? "route" : "job", n = new Set(e.nodes.filter((a) => a.kind === i).map((a) => a.id)), d = ee(e, t, s, (a, c) => n.has(a) || n.has(c)), o = new Set(n);
  for (const a of d)
    o.add(a.source), o.add(a.target);
  return { cards: P(o, t, U(e, r)), lines: d };
}
function nt(e, t, r) {
  const s = [], i = /* @__PURE__ */ new Set([r]);
  for (const n of e.edges)
    n.source !== r && n.target !== r || (i.add(n.source), i.add(n.target), s.push({ id: `${n.source}|${n.target}|${n.kind}`, source: n.source, target: n.target, kind: n.kind, count: n.count }));
  return { cards: P(i, t, []), lines: s };
}
function At(e, t, r) {
  const s = new Map(e.nodes.map((o) => [o.id, o])), i = new Set(t), n = /* @__PURE__ */ new Map();
  for (const o of e.edges) {
    if (!i.has(o.source) || !i.has(o.target)) continue;
    const a = `${o.source}|${o.target}|${o.kind}`;
    n.set(a, { id: a, source: o.source, target: o.target, kind: o.kind, count: o.count, proposed: o.proposed });
  }
  return { cards: P(i, { byId: s }, U(e, r)), lines: [...n.values()] };
}
function ve(e) {
  if (e.routes_dir) return e.routes_dir;
  const t = e.nodes.find((s) => s.kind === "route"), r = t == null ? void 0 : t.evidence[0];
  return r ? r.slice(0, r.lastIndexOf("/")) : null;
}
function jt(e, t, r, s) {
  const i = new Map(e.nodes.map((m) => [m.id, m])), n = ve(e), d = t === `area:${n}` ? I : t, o = d != null && d.startsWith("area:") ? d : null, a = d === I || d === z ? d : null, c = { byId: i, open: o, expanded: a, routesDir: n };
  return d ? o ? et(e, c, r, s) : a ? tt(e, c, r, s) : nt(e, c, d) : Ze(e, c, r, s);
}
function zt(e, t) {
  const r = [{ id: null, label: "System" }];
  if (!t) return r;
  if (t === I || t === `area:${ve(e)}`) return [...r, { id: t, label: "Routes" }];
  if (t === z) return [...r, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...r, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const s = e.nodes.find((i) => i.id === t);
  if (!s) return r;
  if (s.kind === "area") return [...r, { id: t, label: F(s.path ?? s.name) }];
  if (s.kind === "module") {
    const i = e.nodes.find((n) => n.id === s.area);
    return [
      ...r,
      { id: s.area ?? null, label: F((i == null ? void 0 : i.path) ?? "") },
      { id: t, label: s.name }
    ];
  }
  return s.kind === "route" ? [...r, { id: I, label: "Routes" }, { id: t, label: s.name }] : s.kind === "job" ? [...r, { id: z, label: "Scheduled jobs" }, { id: t, label: s.name }] : [...r, { id: t, label: s.name }];
}
const rt = {
  [Z]: "table:",
  [I]: "route:",
  [z]: "job:"
};
function Dt(e, t) {
  const r = new Set(t[e] ?? []), s = rt[e];
  if (s)
    for (const [i, n] of Object.entries(t))
      i.startsWith(s) && n.forEach((d) => r.add(d));
  return [...r].sort();
}
function Rt(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function Ot(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function Mt(e, t) {
  return t ? t.overlaps.filter((r) => [...r.schema, ...r.schema_and_code, ...r.code, ...r.modules].includes(e)) : [];
}
function Pt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [r, s] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    r.startsWith("table:") && t.set(r, s.length);
  return t;
}
function Ft(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function Tt(e, t) {
  const r = new Set(t);
  return {
    tables: e.tables.filter((s) => r.has(s.id)),
    edges: e.edges.filter((s) => r.has(s.source) && r.has(s.target))
  };
}
function Bt(e) {
  return e == null ? "none" : `${Math.round(e * 100)}%`;
}
function it({
  trigger: e,
  children: t,
  width: r,
  align: s = "left",
  popup: i = "dialog",
  label: n,
  block: d = !1
}) {
  const [o, a] = g(!1), c = A(null), m = A(null), p = W(() => {
    var u;
    a(!1), (u = m.current) == null || u.focus();
  }, []);
  return k(() => {
    if (!o) return;
    const u = (f) => {
      var v;
      (v = c.current) != null && v.contains(f.target) || a(!1);
    };
    return document.addEventListener("pointerdown", u), () => document.removeEventListener("pointerdown", u);
  }, [o]), /* @__PURE__ */ h(
    "span",
    {
      ref: c,
      style: { position: "relative", display: d ? "block" : "inline-flex", minWidth: 0, maxWidth: "100%" },
      onKeyDown: (u) => {
        u.key === "Escape" && o && (u.stopPropagation(), p());
      },
      onBlur: (u) => {
        var v;
        const f = u.relatedTarget;
        f && !((v = c.current) != null && v.contains(f)) && a(!1);
      },
      children: [
        e({
          ref: m,
          onClick: () => a((u) => !u),
          onKeyDown: (u) => {
            u.key === "ArrowDown" && !o && (u.preventDefault(), a(!0));
          },
          "aria-expanded": o,
          "aria-haspopup": i
        }),
        o && // The host's main can take focus, so a click on anything here that can't would land
        // there and close this before the click arrives. Focus stops here instead.
        /* @__PURE__ */ l(
          "div",
          {
            className: "sm-pop",
            tabIndex: -1,
            role: i === "dialog" ? "dialog" : void 0,
            "aria-label": i === "dialog" ? n : void 0,
            style: { top: "calc(100% + 6px)", [s]: 0, width: `min(${r}px, calc(100vw - 24px))` },
            children: t(p)
          }
        )
      ]
    }
  );
}
function Ut({ label: e, children: t }) {
  const r = A(null);
  return k(() => {
    var i, n;
    (n = (i = r.current) == null ? void 0 : i.querySelector('[role="menuitem"]')) == null || n.focus();
  }, []), /* @__PURE__ */ l("div", { ref: r, role: "menu", "aria-label": e, onKeyDown: (i) => {
    var a;
    const n = [...((a = r.current) == null ? void 0 : a.querySelectorAll('[role="menuitem"]')) ?? []], d = n.indexOf(document.activeElement), o = i.key === "ArrowDown" ? d + 1 : i.key === "ArrowUp" ? d - 1 : null;
    o === null || n.length === 0 || (i.preventDefault(), n[(o + n.length) % n.length].focus());
  }, children: t });
}
function st() {
  return /* @__PURE__ */ l("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ l("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function at({
  project: e,
  hint: t,
  onBuilt: r,
  onRemove: s
}) {
  const i = S(), [n, d] = g(!1), [o, a] = g(null), [c, m] = g(null), p = X(e.status, e.behind, e.ref), u = Pe(e.intent), f = async () => {
    a("Rebuilding"), m(null);
    try {
      await i.post(`${x}/build`, { repo: e.repo_key }), r();
    } catch ($) {
      m(j($, "rebuild this project"));
    } finally {
      a(null);
    }
  }, v = async () => {
    a("Removing"), m(null);
    try {
      await s(e.repo_key);
    } catch ($) {
      m(j($, "remove this project")), a(null);
    }
  };
  return /* @__PURE__ */ h("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ l("span", { className: "sm-dot", "data-tone": p.tone }),
      /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: p.label }),
      /* @__PURE__ */ l("span", { style: { flex: 1 } }),
      /* @__PURE__ */ l(E, { disabled: o !== null || e.status === "missing", onClick: () => void f(), children: o === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ l(E, { danger: !0, disabled: o !== null, onClick: () => d(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ l("div", { className: "sm-mono sm-ellipsis", style: { ...y, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ h("div", { style: { ...y, fontSize: 12, marginTop: 2 }, children: [
      L(e.tables, "table"),
      ", built ",
      fe(e.built_at, Date.now() / 1e3)
    ] }),
    n && /* @__PURE__ */ h("div", { role: "alert", style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border, #e4e4e7)" }, "data-testid": "confirm-remove", children: [
      /* @__PURE__ */ h("p", { style: { margin: "0 0 8px" }, children: [
        "Remove ",
        e.name,
        " from System Map? This deletes its model",
        u ? ` and ${u}` : "",
        " for good. The repo itself isn't touched."
      ] }),
      /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ l(E, { danger: !0, disabled: o !== null, onClick: () => void v(), autoFocus: !0, children: o === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ l(E, { disabled: o !== null, onClick: () => d(!1), children: "Keep it" })
      ] })
    ] }),
    c && /* @__PURE__ */ l("p", { style: { margin: "8px 0 0" }, children: c })
  ] });
}
function ot({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: s,
  onRemoved: i
}) {
  const n = S(), d = async (o) => {
    await n.post(`${x}/repo-remove`, { repo: o }), i(o);
  };
  return /* @__PURE__ */ l(de, { open: e, onClose: r, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ h("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((o) => /* @__PURE__ */ l(at, { project: o, hint: ce(o, t), onBuilt: s, onRemove: d }, o.repo_key)),
    t.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0 }, children: "No projects yet." })
  ] }) });
}
const oe = (e) => `system-map-project-${e}`;
function lt({
  projects: e,
  activeKey: t,
  close: r,
  onPick: s,
  onAdd: i,
  onManage: n
}) {
  const [d, o] = g(""), a = De(e, d), [c, m] = g(() => Math.max(0, a.findIndex((f) => f.repo_key === t))), p = Math.min(c, a.length - 1), u = (f) => {
    if (f.key === "ArrowDown" || f.key === "ArrowUp") {
      if (f.preventDefault(), a.length === 0) return;
      m((p + (f.key === "ArrowDown" ? 1 : -1) + a.length) % a.length);
    } else f.key === "Enter" && a[p] && (f.preventDefault(), r(), s(a[p].repo_key));
  };
  return /* @__PURE__ */ h(T, { children: [
    /* @__PURE__ */ l(
      B,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Find a project",
        "aria-expanded": !0,
        "aria-controls": "system-map-project-list",
        "aria-activedescendant": a[p] ? oe(a[p].repo_key) : void 0,
        placeholder: "Find a project",
        value: d,
        onKeyDown: u,
        onChange: (f) => {
          o(f.target.value), m(0);
        }
      }
    ),
    /* @__PURE__ */ l("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: a.map((f, v) => {
      const $ = ce(f, e);
      return /* @__PURE__ */ h(
        "li",
        {
          id: oe(f.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": f.repo_key === t,
          "data-active": v === p,
          title: f.repo,
          onMouseEnter: () => m(v),
          onClick: () => {
            r(), s(f.repo_key);
          },
          children: [
            /* @__PURE__ */ l("span", { className: "sm-dot", "data-tone": X(f.status, f.behind, f.ref).tone }),
            /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: f.name }),
            $ && /* @__PURE__ */ l("span", { className: "sm-ellipsis", style: { ...y, fontSize: 12 }, children: $ }),
            /* @__PURE__ */ l("span", { style: { ...y, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: ze(f) })
          ]
        },
        f.repo_key
      );
    }) }),
    a.length === 0 && /* @__PURE__ */ l("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ l("div", { className: "sm-rule" }),
    /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-row", onClick: i, children: "Add project" }),
    /* @__PURE__ */ l("button", { type: "button", className: "sm-plain sm-row", onClick: n, children: "Manage projects" })
  ] });
}
function Ht({
  projects: e,
  activeKey: t,
  compact: r = !1,
  onPick: s,
  onReload: i
}) {
  const n = e.find((p) => p.repo_key === t), [d, o] = g(null), a = () => o(null);
  return { menu: /* @__PURE__ */ l(
    it,
    {
      width: 340,
      label: "Projects",
      block: r,
      trigger: (p) => /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${r ? " sm-compact" : ""}`,
          title: n == null ? void 0 : n.repo,
          "aria-label": `Project: ${(n == null ? void 0 : n.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...p,
          children: [
            /* @__PURE__ */ l("span", { className: "sm-ellipsis", children: n == null ? void 0 : n.name }),
            /* @__PURE__ */ l(st, {})
          ]
        }
      ),
      children: (p) => /* @__PURE__ */ l(
        lt,
        {
          projects: e,
          activeKey: t,
          close: p,
          onPick: s,
          onAdd: () => {
            p(), o("add");
          },
          onManage: () => {
            p(), o("manage");
          }
        }
      )
    }
  ), dialogs: /* @__PURE__ */ h(T, { children: [
    /* @__PURE__ */ l(
      Ge,
      {
        open: d === "add",
        projects: e,
        onClose: a,
        onBuilt: (p) => {
          a(), i(), s(p);
        }
      }
    ),
    /* @__PURE__ */ l(
      ot,
      {
        open: d === "manage",
        projects: e,
        onClose: a,
        onBuilt: i,
        onRemoved: (p) => {
          const u = e.find((f) => f.repo_key !== p);
          u || a(), p === t && u && s(u.repo_key), i();
        }
      }
    )
  ] }) };
}
export {
  Le as A,
  Tt as B,
  st as C,
  it as D,
  X as E,
  kt as F,
  Z as G,
  Ht as H,
  wt as I,
  Mt as J,
  Fe as K,
  j as L,
  y as M,
  xt as N,
  x as O,
  It as P,
  Wt as Q,
  _t as R,
  _e as S,
  vt as T,
  Lt as U,
  Et as V,
  L as W,
  Y as a,
  fe as b,
  At as c,
  jt as d,
  Rt as e,
  Ot as f,
  I as g,
  z as h,
  Ut as i,
  Ge as j,
  mt as k,
  ht as l,
  bt as m,
  gt as n,
  St as o,
  Bt as p,
  Nt as q,
  $t as r,
  F as s,
  zt as t,
  ft as u,
  Ct as v,
  Dt as w,
  yt as x,
  Pt as y,
  Ft as z
};
