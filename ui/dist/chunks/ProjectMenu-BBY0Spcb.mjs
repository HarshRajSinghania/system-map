import { jsxs as m, jsx as d, Fragment as F } from "react/jsx-runtime";
import { SearchInput as B, Badge as de, Modal as ce, Input as Ce, Btn as j } from "@kirocrew/app-sdk/ui";
import { useState as g, useCallback as N, useEffect as x, useRef as E } from "react";
import { useAppApi as $ } from "@kirocrew/app-sdk";
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
const k = "/apps/system-map/api";
function R(e, t) {
  return t ? `${k}${e}${e.includes("?") ? "&" : "?"}repo=${encodeURIComponent(t)}` : `${k}${e}`;
}
const G = "system-map.repo", q = "system-map:project";
function bt() {
  var u, p;
  const e = $(), [t, r] = g([]), [s, i] = g(!1), [n, c] = g(() => localStorage.getItem(G)), a = N(async () => {
    try {
      const f = await e.get(`${k}/repos`);
      r(f.repos);
    } catch {
      r([]);
    } finally {
      i(!0);
    }
  }, [e]);
  x(() => {
    a();
  }, [a]), x(() => {
    const f = () => {
      c(localStorage.getItem(G)), a();
    };
    return window.addEventListener(q, f), () => window.removeEventListener(q, f);
  }, [a]);
  const o = N((f) => {
    localStorage.setItem(G, f), window.dispatchEvent(new Event(q));
  }, []), l = ((u = t.find((f) => f.repo_key === n)) == null ? void 0 : u.repo_key) ?? ((p = t[0]) == null ? void 0 : p.repo_key) ?? null;
  return { repos: t, active: l, loaded: s, choose: o, reload: a };
}
function yt(e) {
  const t = $(), [r, s] = g(null), [i, n] = g(null), c = E(e);
  c.current = e;
  const a = N(async () => {
    if (!e) {
      s(null);
      return;
    }
    try {
      const o = await t.get(R("/overview", e));
      if (c.current !== e) return;
      s(o), n(null);
    } catch (o) {
      if (c.current !== e) return;
      s(null), n(L(o, "load this project"));
    }
  }, [t, e]);
  return x(() => {
    n(null), a();
  }, [a]), { overview: (r == null ? void 0 : r.manifest.repo_key) === e ? r : null, error: i, refresh: a };
}
function vt(e, t, r) {
  const s = $(), [i, n] = g({ repo: t, value: null, failed: !1 });
  return x(() => {
    if (!r) return;
    let c = !0;
    return s.get(R(e, t)).then((a) => {
      c && n({ repo: t, value: a, failed: !1 });
    }).catch(() => {
      c && n({ repo: t, value: null, failed: !0 });
    }), () => {
      c = !1;
    };
  }, [s, e, t, r]), i.repo === t ? { value: i.value, failed: i.failed } : { value: null, failed: !1 };
}
function wt(e, t) {
  const r = $(), [s, i] = g({ repo: e, value: null, failed: !1 }), [n, c] = g(0);
  x(() => {
    if (!t) return;
    let l = !0;
    return r.get(R("/agents", e)).then((u) => {
      l && i({ repo: e, value: u, failed: !1 });
    }).catch(() => {
      l && i({ repo: e, value: null, failed: !0 });
    }), () => {
      l = !1;
    };
  }, [r, e, t, n]);
  const a = N(() => c((l) => l + 1), []), o = s.repo === e;
  return { value: o ? s.value : null, failed: o && s.failed, refresh: a };
}
function xt(e, t, r) {
  const s = $(), [i, n] = g(null);
  return x(() => {
    if (!e) {
      n(null);
      return;
    }
    let c = !0;
    return s.get(R(`/proposal?id=${encodeURIComponent(e)}`, t)).then((a) => {
      c && n(a);
    }).catch(() => {
      c && n(null);
    }), () => {
      c = !1;
    };
  }, [s, e, t, r]), i;
}
function kt(e, t, r) {
  const s = $(), [i, n] = g({ repo: t, value: null, failed: !1 }), [c, a] = g(null), o = E(t);
  o.current = t;
  const l = N(async () => {
    if (t)
      try {
        const p = await s.get(R(e, t));
        if (o.current !== t) return;
        n({ repo: t, value: p, failed: !1 }), a(Date.now());
      } catch {
        o.current === t && n({ repo: t, value: null, failed: !0 });
      }
  }, [s, e, t]);
  x(() => {
    l();
    const p = window.setInterval(() => {
      document.visibilityState === "visible" && l();
    }, r);
    return () => window.clearInterval(p);
  }, [l, r]);
  const u = i.repo === t;
  return { value: u ? i.value : null, failed: u && i.failed, checkedAt: c, refresh: l };
}
function $t(e, t = null, r) {
  const s = $(), [i, n] = g(null);
  return x(() => {
    if (!e) {
      n(null);
      return;
    }
    let c = !0;
    return s.get(R(`/node?id=${encodeURIComponent(e)}`, t)).then((a) => {
      c && n(a);
    }).catch(() => {
      c && n(null);
    }), () => {
      c = !1;
    };
  }, [s, e, t, r]), i;
}
const Y = { fontFamily: "var(--mono, ui-monospace, monospace)" }, y = { color: "var(--muted, #71717a)" }, je = {
  high: "err",
  medium: "warn",
  low: "muted",
  info: "aim"
};
function Ae({ severity: e }) {
  return /* @__PURE__ */ d("span", { style: { flexShrink: 0 }, children: /* @__PURE__ */ d(de, { variant: je[e], children: e }) });
}
function St({
  tables: e,
  selected: t,
  flagged: r,
  working: s,
  onSelect: i
}) {
  const [n, c] = g(""), a = e.filter((o) => o.name.includes(n.trim().toLowerCase()));
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(
      B,
      {
        "aria-label": "Filter tables",
        placeholder: "Filter tables",
        value: n,
        onChange: (o) => c(o.target.value)
      }
    ),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: a.map((o) => /* @__PURE__ */ m(
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
          /* @__PURE__ */ d("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.name }),
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
            r != null && r.get(o.id) ? /* @__PURE__ */ d("span", { title: `${r.get(o.id)} findings`, style: { color: "var(--warn-text, #b45309)" }, children: r.get(o.id) }) : null,
            /* @__PURE__ */ d("span", { title: `${o.columns} columns`, children: o.columns })
          ] })
        ]
      },
      o.id
    )) })
  ] });
}
function W({ title: e, children: t }) {
  return /* @__PURE__ */ m("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ d("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
const O = { margin: 0, paddingLeft: 16 };
function Ct({
  nodes: e,
  focus: t,
  onSelect: r
}) {
  const [s, i] = g(""), n = s.trim().toLowerCase(), c = e.filter((l) => l.kind === "area").sort((l, u) => (u.lines ?? 0) - (l.lines ?? 0)), a = e.filter((l) => l.kind === "module"), o = (l, u, p) => /* @__PURE__ */ m(
    "button",
    {
      onClick: () => r(l.id),
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
        background: l.id === t ? "var(--bg-hover, rgba(127,127,127,.2))" : "transparent"
      },
      children: [
        /* @__PURE__ */ d("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p }),
        /* @__PURE__ */ d("span", { style: { ...y, fontWeight: 400, flexShrink: 0 }, title: `${l.files} files`, children: l.files })
      ]
    },
    l.id
  );
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1, gap: 8 }, children: [
    /* @__PURE__ */ d(B, { "aria-label": "Filter modules", placeholder: "Filter modules", value: s, onChange: (l) => i(l.target.value) }),
    /* @__PURE__ */ d("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: c.map((l) => {
      const u = a.filter((h) => h.area === l.id && h.path !== l.path), p = u.filter((h) => h.name.toLowerCase().includes(n)), f = n !== "" || t === l.id || u.some((h) => h.id === t);
      return n && p.length === 0 && !l.name.toLowerCase().includes(n) ? null : /* @__PURE__ */ m("div", { children: [
        o(l, 0, l.path === "." ? l.name : (l.path ?? l.name).replace(/^src\//, "")),
        f && p.map((h) => o(h, 1, h.name))
      ] }, l.id);
    }) })
  ] });
}
function Ee({ findings: e, onAsk: t }) {
  return /* @__PURE__ */ d(F, { children: e.map((r) => /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }, children: [
    /* @__PURE__ */ d(Ae, { severity: r.severity }),
    /* @__PURE__ */ d("span", { style: { flex: 1 }, children: r.title }),
    t && /* @__PURE__ */ d("button", { onClick: () => t(r), style: Le, children: "Ask" })
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
function It({ node: e, onAsk: t }) {
  const r = e.constraints.filter((i) => i.kind !== "check"), s = e.constraints.filter((i) => i.kind === "check");
  return /* @__PURE__ */ m("div", { style: { fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ d("p", { style: { ...y, ...Y, fontSize: 12, margin: "0 0 8px", overflowWrap: "anywhere" }, children: e.source }),
    e.findings.length > 0 && /* @__PURE__ */ d(W, { title: "Findings", children: /* @__PURE__ */ d(Ee, { findings: e.findings, onAsk: t }) }),
    /* @__PURE__ */ d(W, { title: `Columns (${e.columns.length})`, children: /* @__PURE__ */ d("table", { style: { width: "100%", borderCollapse: "collapse" }, children: /* @__PURE__ */ d("tbody", { children: e.columns.map((i) => /* @__PURE__ */ m("tr", { title: i.source, children: [
      /* @__PURE__ */ d("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.name }),
      /* @__PURE__ */ d("td", { style: { ...y, ...Y, fontSize: 12, padding: "2px 8px", overflowWrap: "anywhere" }, children: i.type }),
      /* @__PURE__ */ d("td", { style: { ...y, fontSize: 12, padding: "2px 0", whiteSpace: "nowrap" }, children: i.nullable ? "null" : "not null" })
    ] }, i.name)) }) }) }),
    r.length > 0 && /* @__PURE__ */ d(W, { title: "Keys", children: /* @__PURE__ */ d("ul", { style: O, children: r.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.kind.replace("_", " "),
      " (",
      i.columns.join(", "),
      ")",
      i.references ? ` to ${i.references}, on delete ${i.on_delete}` : ""
    ] }, i.name)) }) }),
    s.length > 0 && /* @__PURE__ */ d(W, { title: "Checks", children: /* @__PURE__ */ d("ul", { style: O, children: s.map((i) => /* @__PURE__ */ d("li", { title: i.source, style: { ...Y, fontSize: 12, overflowWrap: "anywhere" }, children: i.expression }, i.name)) }) }),
    e.indexes.length > 0 && /* @__PURE__ */ d(W, { title: "Indexes", children: /* @__PURE__ */ d("ul", { style: O, children: e.indexes.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      " (",
      i.columns.join(", "),
      ")",
      i.unique ? ", unique" : "",
      i.partial ? ", partial" : ""
    ] }, i.name)) }) }),
    e.schema !== "main" && /* @__PURE__ */ d(W, { title: `Row level security: ${e.rls ? "on" : "off"}`, children: /* @__PURE__ */ d("ul", { style: O, children: e.policies.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      ": ",
      i.command,
      " for ",
      i.roles.join(", ")
    ] }, i.name)) }) }),
    e.triggers.length > 0 && /* @__PURE__ */ d(W, { title: "Triggers", children: /* @__PURE__ */ d("ul", { style: O, children: e.triggers.map((i) => /* @__PURE__ */ m("li", { title: i.source, children: [
      i.name,
      ": ",
      i.timing,
      " ",
      i.events.join(", ")
    ] }, i.name)) }) }),
    e.reads.length > 0 && /* @__PURE__ */ d(W, { title: "Notes", children: e.reads.map((i, n) => /* @__PURE__ */ d("p", { style: { margin: "0 0 6px" }, children: i.text }, n)) })
  ] });
}
const ze = ["map", "data", "plan", "risk", "worktrees", "findings", "agents", "explore"];
function Nt(e) {
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
function A(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
const De = { postgres: "Postgres", sqlite: "SQLite" };
function _t(e) {
  const t = [
    e.tables ? `${A(e.tables, "table")} from ${De[e.engine ?? ""] ?? e.engine}` : "No tables found",
    e.routes ? `${A(e.routes, "route")}, ${e.route_style}` : "No routes found",
    `${A(e.code_files, "code file")}, ${A(e.links, "link")}`
  ];
  return e.git || t.push("No git history, so no churn or worktrees"), t;
}
function Re(e) {
  return e.status === "current" ? A(e.tables, "table") : Z(e.status, e.behind, e.ref).label;
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
function Te(e) {
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
function Pe(e, t) {
  const r = pe(e, t, "").toAdd.length;
  return r ? `Search ${A(r, "workspace")}` : "Search workspaces";
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
function Wt(e, t) {
  if (!t) return "map";
  const r = e.getItem(me(t));
  return ze.find((s) => s === r) ?? "map";
}
function jt(e, t, r) {
  e.setItem(me(t), r);
}
const ge = "system-map.side-list";
function At(e) {
  return e === "map" || e === "data";
}
function Et(e) {
  return e.getItem(ge) !== "hidden";
}
function Lt(e, t) {
  e.setItem(ge, t ? "shown" : "hidden");
}
function Be(e) {
  return `system-map-design-${e}`;
}
const be = (e) => `system-map.chat.${e}`;
function zt(e, t) {
  return e.getItem(be(t)) === "started";
}
function Dt(e, t) {
  e.setItem(be(t), "started");
}
function Rt(e, t) {
  if (!Array.isArray(e)) return !1;
  const r = Be(t);
  return e.some((s) => (s == null ? void 0 : s.key) === r && typeof s.messages == "number" && s.messages > 0);
}
const Ue = 600, se = "system-map-workspace-list", Q = (e) => `system-map-workspace-${e.key}`;
function J() {
  return /* @__PURE__ */ d(
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
      children: /* @__PURE__ */ d("path", { d: "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })
    }
  );
}
function He(e) {
  const t = $(), [r, s] = g(null), [i, n] = g(null);
  x(() => {
    if (s(null), n(null), !e) return;
    let a = !0;
    return (async () => {
      const l = await t.get(`${k}/workspaces`);
      if (l.folder !== null) return { ...l, suggested: !1 };
      const u = await t.get("/api/recent-projects").catch(() => ({ dirs: [] })), p = Array.isArray(u.dirs) ? u.dirs.filter((v) => typeof v == "string") : [], f = Te(p);
      if (f === null) return { ...l, suggested: !1 };
      const h = await t.get(`${k}/workspaces?folder=${encodeURIComponent(f)}`).catch(() => null);
      return h ? { ...h, suggested: !0 } : { ...l, suggested: !1 };
    })().then((l) => {
      a && s(l);
    }).catch((l) => {
      a && n(L(l, "read your default folder"));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const c = N(
    async (a) => {
      n(null);
      try {
        await t.post(`${k}/default-folder`, { folder: a }), s({ ...await t.get(`${k}/workspaces`), suggested: !1 });
      } catch (o) {
        n(L(o, "save this folder"));
      }
    },
    [t]
  );
  return { list: r, error: i, saveDefault: c };
}
function Ve(e, t, r) {
  const s = $(), [i, n] = g(!1), c = E(!1), a = E({ onPicked: t, onUsePage: r });
  a.current = { onPicked: t, onUsePage: r };
  const o = N((p) => {
    c.current = p, n(p);
  }, []), l = N(() => {
    c.current && (o(!1), s.post(`${k}/folder-window-close`, {}).catch(() => {
    }));
  }, [s, o]);
  return x(() => {
    if (!i) return;
    const p = window.setInterval(() => {
      s.get(`${k}/folder-window`).then((f) => {
        !c.current || f.status === "open" || (o(!1), f.status === "picked" ? a.current.onPicked(f.path) : f.status === "failed" && a.current.onUsePage(f.message));
      }).catch(() => {
        o(!1), a.current.onUsePage(null);
      });
    }, Ue);
    return () => window.clearInterval(p);
  }, [s, i, o]), x(() => e ? l : void 0, [e, l]), { waiting: i, openWindow: async (p) => {
    try {
      (await s.post(`${k}/folder-window`, { start: p })).status === "open" ? o(!0) : a.current.onUsePage(null);
    } catch {
      a.current.onUsePage(null);
    }
  }, closeWindow: l };
}
function Ke({
  start: e,
  note: t,
  onUse: r,
  onCancel: s
}) {
  const i = $(), [n, c] = g(null), [a, o] = g(null), l = N(
    async (u) => {
      o(null);
      try {
        return c(await i.get(`${k}/browse?path=${encodeURIComponent(u)}`)), !0;
      } catch (p) {
        return o(L(p, "open this folder")), !1;
      }
    },
    [i]
  );
  return x(() => {
    l(e ?? "~").then((u) => {
      !u && e !== null && l("~");
    });
  }, [l, e]), /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "folder-list", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
      /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-link", disabled: !(n != null && n.parent), onClick: () => (n == null ? void 0 : n.parent) && void l(n.parent), children: "‹ Up" }),
      /* @__PURE__ */ d("span", { className: "sm-mono sm-ellipsis", title: n == null ? void 0 : n.path, "data-testid": "folder-list-path", children: n && fe(n.display, 56) })
    ] }),
    /* @__PURE__ */ m("div", { className: "sm-list sm-add-list", children: [
      n == null ? void 0 : n.dirs.map((u) => /* @__PURE__ */ m("button", { type: "button", className: "sm-plain sm-row", title: u.path, onClick: () => void l(u.path), children: [
        /* @__PURE__ */ d(J, {}),
        /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: u.name })
      ] }, u.path)),
      (n == null ? void 0 : n.dirs.length) === 0 && /* @__PURE__ */ d("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No folders in here." })
    ] }),
    (t ?? a) && /* @__PURE__ */ d("p", { role: "status", style: { margin: 0, fontSize: 13 }, children: a ?? t }),
    /* @__PURE__ */ m("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
      /* @__PURE__ */ d(j, { onClick: s, children: "Cancel" }),
      /* @__PURE__ */ d(j, { primary: !0, disabled: !n, onClick: () => n && r(n.path), children: "Use this folder" })
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
        /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: t ? y : { fontWeight: 600 }, children: e.name }),
        e.worktrees > 0 && /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: A(e.worktrees, "worktree") }),
        !e.git && /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: "no git" }),
        /* @__PURE__ */ d("span", { style: { flex: 1 } }),
        /* @__PURE__ */ d("span", { className: "sm-row-action", children: t ? "Open" : "Add" }),
        !t && e.touched > 0 && /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: he(e.touched, i) })
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
  const [n, c] = g(""), [a, o] = g(0), l = E(!1), { toAdd: u, added: p } = pe(e.repos, t, n), f = [...u, ...p], h = Math.min(a, f.length - 1), v = Date.now() / 1e3, S = (b) => p.includes(b) ? i(b) : s(b);
  x(() => {
    var b;
    l.current && (l.current = !1, f[h] && ((b = document.getElementById(Q(f[h]))) == null || b.scrollIntoView({ block: "nearest" })));
  });
  const C = (b) => {
    if (b.key === "ArrowDown" || b.key === "ArrowUp") {
      if (b.preventDefault(), f.length === 0) return;
      l.current = !0, o((h + (b.key === "ArrowDown" ? 1 : -1) + f.length) % f.length);
    } else b.key === "Enter" && f[h] && !r && (b.preventDefault(), S(f[h]));
  }, D = (b, _, M) => /* @__PURE__ */ d(
    Ge,
    {
      workspace: b,
      added: _,
      active: M === h,
      busy: r,
      now: v,
      onHover: () => o(M),
      onPick: () => S(b)
    },
    b.path
  );
  return /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ d(
      B,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Search workspaces",
        "aria-expanded": !0,
        "aria-controls": se,
        "aria-activedescendant": f[h] ? Q(f[h]) : void 0,
        placeholder: Pe(e.repos, t),
        value: n,
        disabled: r,
        onKeyDown: C,
        onChange: (b) => {
          c(b.target.value), o(0);
        }
      }
    ),
    /* @__PURE__ */ m("ul", { id: se, className: "sm-list sm-add-list", role: "listbox", "aria-label": "Workspaces", children: [
      u.map((b, _) => D(b, !1, _)),
      p.length > 0 && /* @__PURE__ */ d("li", { role: "presentation", className: "sm-add-head", children: "Already added" }),
      p.map((b, _) => D(b, !0, u.length + _))
    ] }),
    f.length === 0 && /* @__PURE__ */ d("p", { style: { ...y, margin: 0, padding: "0 9px" }, children: "No workspace matches that. Only folders with git or a package.json show here." }),
    e.truncated && /* @__PURE__ */ d("p", { style: { ...y, margin: 0, fontSize: 12 }, children: "This folder is too big to search all of it. Pick a smaller one." })
  ] });
}
function Ye({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: s
}) {
  const i = $(), { list: n, error: c, saveDefault: a } = He(e), [o, l] = g("workspaces"), [u, p] = g(null), [f, h] = g(!1), [v, S] = g(""), [C, D] = g(null), [b, _] = g(null), M = (w) => {
    p(w), l("folders");
  }, { waiting: H, openWindow: ke, closeWindow: $e } = Ve(e, (w) => void a(w), M);
  x(() => {
    e && (l("workspaces"), p(null), h(!1), S(""), _(null), D(null));
  }, [e]);
  const ne = async (w, Se) => {
    D(w), _(null);
    try {
      Se && (n != null && n.suggested) && n.folder && await i.post(`${k}/default-folder`, { folder: n.folder });
      const K = await i.post(`${k}/build`, { repo_path: w });
      s(K.repo_key);
    } catch (K) {
      _(L(K, "add this project"));
    } finally {
      D(null);
    }
  }, re = () => void ke((n == null ? void 0 : n.folder) ?? null), V = (w) => /* @__PURE__ */ m("div", { className: "sm-add-empty", "data-testid": "add-empty", children: [
    /* @__PURE__ */ d(J, {}),
    /* @__PURE__ */ d("span", { children: w }),
    /* @__PURE__ */ d(j, { primary: !0, disabled: H, onClick: re, children: "Browse…" })
  ] });
  return /* @__PURE__ */ d(ce, { open: e, onClose: r, title: o === "folders" ? "Choose folder" : "Add project", maxWidth: 520, dismissDisabled: C !== null, children: o === "folders" ? /* @__PURE__ */ d(
    Ke,
    {
      start: (n == null ? void 0 : n.folder) ?? null,
      note: u,
      onCancel: () => l("workspaces"),
      onUse: (w) => {
        l("workspaces"), a(w);
      }
    }
  ) : /* @__PURE__ */ m("div", { style: { display: "grid", gap: 12, padding: 16 }, "data-testid": "add-project", children: [
    (n == null ? void 0 : n.folder) && /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, "data-testid": "default-folder", children: [
      /* @__PURE__ */ d(J, {}),
      /* @__PURE__ */ d("span", { className: "sm-mono sm-ellipsis", style: { fontSize: 13 }, title: n.folder, children: n.display && fe(n.display) }),
      n.suggested ? /* @__PURE__ */ d(de, { variant: "aim", children: "Suggested" }) : /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12 }, children: "Default" }),
      /* @__PURE__ */ d("span", { style: { flex: 1 } }),
      /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-link", disabled: H || C !== null, onClick: re, children: "Browse…" })
    ] }),
    H && /* @__PURE__ */ m("div", { role: "status", className: "sm-notice", "data-testid": "window-open", children: [
      /* @__PURE__ */ d("span", { style: { flex: 1 }, children: "Pick a folder in the window that just opened." }),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "sm-plain sm-link",
          onClick: () => {
            $e(), M(null);
          },
          children: "Pick here instead"
        }
      )
    ] }),
    n && n.folder === null && V("Pick the folder that holds your projects"),
    (n == null ? void 0 : n.missing) && V(`${n.display} isn't there any more`),
    (n == null ? void 0 : n.folder) && !n.missing && n.repos.length === 0 && V(`No projects in ${n.display}`),
    (n == null ? void 0 : n.folder) && n.repos.length > 0 && /* @__PURE__ */ d(
      qe,
      {
        list: n,
        projects: t,
        busy: C !== null,
        onAdd: (w) => void ne(w.path, !0),
        onOpen: (w) => s(w.key)
      },
      n.folder
    ),
    f ? /* @__PURE__ */ m(
      "form",
      {
        onSubmit: (w) => {
          w.preventDefault(), v.trim() && ne(v.trim(), !1);
        },
        children: [
          /* @__PURE__ */ d("label", { style: { display: "block", ...y, fontSize: 12, marginBottom: 4 }, htmlFor: "system-map-path", children: "Full path to a project" }),
          /* @__PURE__ */ m("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ d(
              Ce,
              {
                id: "system-map-path",
                placeholder: "/path/to/project",
                value: v,
                disabled: C !== null,
                autoFocus: !0,
                onChange: (w) => S(w.target.value),
                style: { flex: 1, minWidth: 0 }
              }
            ),
            /* @__PURE__ */ d(j, { primary: !0, type: "submit", disabled: C !== null || !v.trim(), children: "Add" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-link", style: { justifySelf: "start" }, disabled: C !== null, onClick: () => h(!0), children: "Use a full path" }),
    /* @__PURE__ */ d("div", { role: "status", "aria-live": "polite", style: { fontSize: 13, minHeight: 18 }, "data-testid": "add-status", children: C !== null ? `Building ${C.split("/").pop()}. This can take a minute.` : b ?? c })
  ] }) });
}
const Mt = 200, Ot = 58, ye = /* @__PURE__ */ new Set(["starts", "hands_off_to", "uses_model"]), Qe = /* @__PURE__ */ new Set(["planned", "partial"]), ee = "group:tables", I = "group:routes", z = "group:jobs";
function ae(e) {
  return `${e.files} ${e.files === 1 ? "file" : "files"}, ${e.lines} lines`;
}
function P(e) {
  return e === "." ? "root files" : e.replace(/^src\//, "");
}
function X(e) {
  var t, r;
  if (e.status === "proposed")
    return { id: e.id, kind: e.kind, title: e.kind === "module" ? e.name : P(e.path ?? e.name), subtitle: "proposed", status: "proposed" };
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: P(e.path ?? e.name), subtitle: ae(e) };
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
function ve(e, t) {
  return !!(e && t && (e === t || e.startsWith(`${t}/`)));
}
function oe(e, t) {
  if (e.startsWith("table:")) return ee;
  const r = t.byId.get(e);
  return r ? r.status === "proposed" ? e : (r.kind === "module" || r.kind === "area") && ve(r.path, t.routesDir) ? I : r.kind === "module" ? r.area === t.open ? e : r.area ?? e : r.kind === "route" ? t.expanded === I ? e : I : r.kind === "job" ? t.expanded === z ? e : z : e : null;
}
function we(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !Qe.has(e.status));
}
function te(e, t, r, s) {
  const i = /* @__PURE__ */ new Map();
  for (const n of e.edges) {
    if (we(t.byId.get(n.source), r)) continue;
    const c = oe(n.source, t), a = oe(n.target, t);
    if (!c || !a || c === a || !s(c, a)) continue;
    const o = `${c}|${a}|${n.kind}`, l = i.get(o);
    l ? l.count += n.count : i.set(o, { id: o, source: c, target: a, kind: n.kind, count: n.count, proposed: n.proposed });
  }
  return [...i.values()];
}
function T(e, t, r) {
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
    o.kind === "area" && !ve(o.path, t.routesDir) && a.add(o.id), o.kind === "service" && a.add(o.id), o.kind === "plan" && !we(o, s) && a.add(o.id), o.status === "proposed" && a.add(o.id);
  return { cards: T(a, t, i), lines: c.filter((o) => a.has(o.source) && a.has(o.target)), hidden: n.length - c.length };
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
  return { cards: T(c, t, U(e, r)), lines: n };
}
function nt(e, t, r, s) {
  const i = t.expanded === I ? "route" : "job", n = new Set(e.nodes.filter((o) => o.kind === i).map((o) => o.id)), c = te(e, t, s, (o, l) => n.has(o) || n.has(l)), a = new Set(n);
  for (const o of c)
    a.add(o.source), a.add(o.target);
  return { cards: T(a, t, U(e, r)), lines: c };
}
function rt(e, t, r) {
  const s = [], i = /* @__PURE__ */ new Set([r]);
  for (const n of e.edges)
    n.source !== r && n.target !== r || (i.add(n.source), i.add(n.target), s.push({ id: `${n.source}|${n.target}|${n.kind}`, source: n.source, target: n.target, kind: n.kind, count: n.count }));
  return { cards: T(i, t, []), lines: s };
}
function Tt(e, t, r) {
  const s = new Map(e.nodes.map((a) => [a.id, a])), i = new Set(t), n = /* @__PURE__ */ new Map();
  for (const a of e.edges) {
    if (!i.has(a.source) || !i.has(a.target)) continue;
    const o = `${a.source}|${a.target}|${a.kind}`;
    n.set(o, { id: o, source: a.source, target: a.target, kind: a.kind, count: a.count, proposed: a.proposed });
  }
  return { cards: T(i, { byId: s }, U(e, r)), lines: [...n.values()] };
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
  const t = new Map(e.nodes.map((l) => [l.id, l])), r = e.nodes.filter((l) => l.kind === "agent").map((l) => l.id), s = new Set(r), i = /* @__PURE__ */ new Map();
  for (const l of e.edges) {
    if (!ye.has(l.kind) || !(t.has(l.source) && t.has(l.target)) || !r.includes(l.source) && !r.includes(l.target)) continue;
    s.add(l.source), s.add(l.target);
    const u = `${l.source}|${l.target}|${l.kind}`, p = i.get(u);
    p ? p.count += l.count : i.set(u, { id: u, source: l.source, target: l.target, kind: l.kind, count: l.count, leaves: l.leaves_region || void 0 });
  }
  const n = e.home_region ?? null, c = /* @__PURE__ */ new Map(), a = [...s].map((l) => {
    const u = t.get(l);
    return u.kind !== "service" ? X(u) : (u.region && c.set(u.region, [...c.get(u.region) ?? [], l]), { ...X(u), subtitle: u.region ?? "no region set", strong: !0 });
  }), o = [...c].map(([l, u]) => {
    const p = n ? st(l, n) ? "home" : "away" : "unknown";
    return { id: `band:${l}`, label: p === "home" ? `${l} · home` : l, tone: p, members: u };
  });
  return { cards: a, lines: [...i.values()], bands: o };
}
function Pt(e, t, r, s, i = !1) {
  if (i) return at(e);
  e = it(e);
  const n = new Map(e.nodes.map((p) => [p.id, p])), c = xe(e), a = t === `area:${c}` ? I : t, o = a != null && a.startsWith("area:") ? a : null, l = a === I || a === z ? a : null, u = { byId: n, open: o, expanded: l, routesDir: c };
  return a ? o ? tt(e, u, r, s) : l ? nt(e, u, r, s) : rt(e, u, a) : et(e, u, r, s);
}
function Ft(e, t, r = !1) {
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
  if (i.kind === "area") return [...s, { id: t, label: P(i.path ?? i.name) }];
  if (i.kind === "module") {
    const n = e.nodes.find((c) => c.id === i.area);
    return [
      ...s,
      { id: i.area ?? null, label: P((n == null ? void 0 : n.path) ?? "") },
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
function Bt(e, t) {
  const r = new Set(t[e] ?? []), s = ot[e];
  if (s)
    for (const [i, n] of Object.entries(t))
      i.startsWith(s) && n.forEach((c) => r.add(c));
  return [...r].sort();
}
function Ut(e) {
  return new Map([...(e == null ? void 0 : e.modules) ?? [], ...(e == null ? void 0 : e.areas) ?? []].map((t) => [t.id ?? t.path, t]));
}
function Ht(e) {
  return e != null && e.hot ? e.untested ? "hot-untested" : "hot" : null;
}
function Vt(e, t) {
  return t ? t.overlaps.filter((r) => [...r.schema, ...r.schema_and_code, ...r.code, ...r.modules].includes(e)) : [];
}
function Kt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [r, s] of Object.entries((e == null ? void 0 : e.by_node) ?? {}))
    r.startsWith("table:") && t.set(r, s.length);
  return t;
}
function Gt(e, t) {
  return t ? { ...e, nodes: [...e.nodes, ...t.overlay.nodes], edges: [...e.edges, ...t.overlay.edges] } : e;
}
function qt(e, t) {
  const r = new Set(t);
  return {
    tables: e.tables.filter((s) => r.has(s.id)),
    edges: e.edges.filter((s) => r.has(s.source) && r.has(s.target))
  };
}
function Yt(e) {
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
  const [a, o] = g(!1), l = E(null), u = E(null), p = N(() => {
    var f;
    o(!1), (f = u.current) == null || f.focus();
  }, []);
  return x(() => {
    if (!a) return;
    const f = (h) => {
      var v;
      (v = l.current) != null && v.contains(h.target) || o(!1);
    };
    return document.addEventListener("pointerdown", f), () => document.removeEventListener("pointerdown", f);
  }, [a]), /* @__PURE__ */ m(
    "span",
    {
      ref: l,
      style: { position: "relative", display: c ? "block" : "inline-flex", minWidth: 0, maxWidth: "100%" },
      onKeyDown: (f) => {
        f.key === "Escape" && a && (f.stopPropagation(), p());
      },
      onBlur: (f) => {
        var v;
        const h = f.relatedTarget;
        h && !((v = l.current) != null && v.contains(h)) && o(!1);
      },
      children: [
        e({
          ref: u,
          onClick: () => o((f) => !f),
          onKeyDown: (f) => {
            f.key === "ArrowDown" && !a && (f.preventDefault(), o(!0));
          },
          "aria-expanded": a,
          "aria-haspopup": i
        }),
        a && // The host's main can take focus, so a click on anything here that can't would land
        // there and close this before the click arrives. Focus stops here instead.
        /* @__PURE__ */ d(
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
function Qt({ label: e, children: t }) {
  const r = E(null);
  return x(() => {
    var i, n;
    (n = (i = r.current) == null ? void 0 : i.querySelector('[role="menuitem"]')) == null || n.focus();
  }, []), /* @__PURE__ */ d("div", { ref: r, role: "menu", "aria-label": e, onKeyDown: (i) => {
    var o;
    const n = [...((o = r.current) == null ? void 0 : o.querySelectorAll('[role="menuitem"]')) ?? []], c = n.indexOf(document.activeElement), a = i.key === "ArrowDown" ? c + 1 : i.key === "ArrowUp" ? c - 1 : null;
    a === null || n.length === 0 || (i.preventDefault(), n[(a + n.length) % n.length].focus());
  }, children: t });
}
function dt() {
  return /* @__PURE__ */ d("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", style: { flex: "none" }, children: /* @__PURE__ */ d("path", { d: "M2.5 4.5 6 8l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function ct({
  project: e,
  hint: t,
  onBuilt: r,
  onRemove: s
}) {
  const i = $(), [n, c] = g(!1), [a, o] = g(null), [l, u] = g(null), p = Z(e.status, e.behind, e.ref), f = Fe(e.intent), h = async () => {
    o("Rebuilding"), u(null);
    try {
      await i.post(`${k}/build`, { repo: e.repo_key }), r();
    } catch (S) {
      u(L(S, "rebuild this project"));
    } finally {
      o(null);
    }
  }, v = async () => {
    o("Removing"), u(null);
    try {
      await s(e.repo_key);
    } catch (S) {
      u(L(S, "remove this project")), o(null);
    }
  };
  return /* @__PURE__ */ m("div", { className: "sm-manage-row", "data-testid": "manage-row", children: [
    /* @__PURE__ */ m("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 }, children: [
      /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": p.tone }),
      /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, title: e.repo, children: e.name }),
      t && /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: t }),
      /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12, whiteSpace: "nowrap" }, children: p.label }),
      /* @__PURE__ */ d("span", { style: { flex: 1 } }),
      /* @__PURE__ */ d(j, { disabled: a !== null || e.status === "missing", onClick: () => void h(), children: a === "Rebuilding" ? "Rebuilding" : "Rebuild" }),
      /* @__PURE__ */ d(j, { danger: !0, disabled: a !== null, onClick: () => c(!0), children: "Remove" })
    ] }),
    /* @__PURE__ */ d("div", { className: "sm-mono sm-ellipsis", style: { ...y, marginTop: 4 }, title: e.repo, children: e.repo }),
    /* @__PURE__ */ m("div", { style: { ...y, fontSize: 12, marginTop: 2 }, children: [
      A(e.tables, "table"),
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
        /* @__PURE__ */ d(j, { danger: !0, disabled: a !== null, onClick: () => void v(), autoFocus: !0, children: a === "Removing" ? "Removing" : "Remove project" }),
        /* @__PURE__ */ d(j, { disabled: a !== null, onClick: () => c(!1), children: "Keep it" })
      ] })
    ] }),
    l && /* @__PURE__ */ d("p", { style: { margin: "8px 0 0" }, children: l })
  ] });
}
function ut({
  open: e,
  projects: t,
  onClose: r,
  onBuilt: s,
  onRemoved: i
}) {
  const n = $(), c = async (a) => {
    await n.post(`${k}/repo-remove`, { repo: a }), i(a);
  };
  return /* @__PURE__ */ d(ce, { open: e, onClose: r, title: "Manage projects", maxWidth: 620, children: /* @__PURE__ */ m("div", { className: "sm-manage", style: { padding: 16, maxHeight: "60vh", overflowY: "auto" }, "data-testid": "manage-projects", children: [
    t.map((a) => /* @__PURE__ */ d(ct, { project: a, hint: ue(a, t), onBuilt: s, onRemove: c }, a.repo_key)),
    t.length === 0 && /* @__PURE__ */ d("p", { style: { ...y, margin: 0 }, children: "No projects yet." })
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
  const [c, a] = g(""), o = Me(e, c), [l, u] = g(() => Math.max(0, o.findIndex((h) => h.repo_key === t))), p = Math.min(l, o.length - 1), f = (h) => {
    if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), o.length === 0) return;
      u((p + (h.key === "ArrowDown" ? 1 : -1) + o.length) % o.length);
    } else h.key === "Enter" && o[p] && (h.preventDefault(), r(), s(o[p].repo_key));
  };
  return /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ d(
      B,
      {
        autoFocus: !0,
        role: "combobox",
        "aria-label": "Find a project",
        "aria-expanded": !0,
        "aria-controls": "system-map-project-list",
        "aria-activedescendant": o[p] ? le(o[p].repo_key) : void 0,
        placeholder: "Find a project",
        value: c,
        onKeyDown: f,
        onChange: (h) => {
          a(h.target.value), u(0);
        }
      }
    ),
    /* @__PURE__ */ d("ul", { id: "system-map-project-list", className: "sm-list", role: "listbox", "aria-label": "Projects", children: o.map((h, v) => {
      const S = ue(h, e);
      return /* @__PURE__ */ m(
        "li",
        {
          id: le(h.repo_key),
          role: "option",
          className: "sm-row",
          "aria-selected": h.repo_key === t,
          "data-active": v === p,
          title: h.repo,
          onMouseEnter: () => u(v),
          onClick: () => {
            r(), s(h.repo_key);
          },
          children: [
            /* @__PURE__ */ d("span", { className: "sm-dot", "data-tone": Z(h.status, h.behind, h.ref).tone }),
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { fontWeight: 600 }, children: h.name }),
            S && /* @__PURE__ */ d("span", { className: "sm-ellipsis", style: { ...y, fontSize: 12 }, children: S }),
            /* @__PURE__ */ d("span", { style: { ...y, fontSize: 12, marginLeft: "auto", whiteSpace: "nowrap", paddingLeft: 8 }, children: Re(h) })
          ]
        },
        h.repo_key
      );
    }) }),
    o.length === 0 && /* @__PURE__ */ d("p", { style: { ...y, margin: 0, padding: "8px 9px" }, children: "No project matches that." }),
    /* @__PURE__ */ d("div", { className: "sm-rule" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: i, children: "Add project" }),
    /* @__PURE__ */ d("button", { type: "button", className: "sm-plain sm-row", onClick: n, children: "Manage projects" })
  ] });
}
function Jt({
  projects: e,
  activeKey: t,
  compact: r = !1,
  onPick: s,
  onReload: i
}) {
  const n = e.find((p) => p.repo_key === t), [c, a] = g(null), o = () => a(null);
  return { menu: /* @__PURE__ */ d(
    lt,
    {
      width: 340,
      label: "Projects",
      block: r,
      trigger: (p) => /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: `sm-plain sm-project sm-focus${r ? " sm-compact" : ""}`,
          title: n == null ? void 0 : n.repo,
          "aria-label": `Project: ${(n == null ? void 0 : n.name) ?? ""}. Change project`,
          "data-testid": "project-menu",
          ...p,
          children: [
            /* @__PURE__ */ d("span", { className: "sm-ellipsis", children: n == null ? void 0 : n.name }),
            /* @__PURE__ */ d(dt, {})
          ]
        }
      ),
      children: (p) => /* @__PURE__ */ d(
        pt,
        {
          projects: e,
          activeKey: t,
          close: p,
          onPick: s,
          onAdd: () => {
            p(), a("add");
          },
          onManage: () => {
            p(), a("manage");
          }
        }
      )
    }
  ), dialogs: /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ d(
      Ye,
      {
        open: c === "add",
        projects: e,
        onClose: o,
        onBuilt: (p) => {
          o(), i(), s(p);
        }
      }
    ),
    /* @__PURE__ */ d(
      ut,
      {
        open: c === "manage",
        projects: e,
        onClose: o,
        onBuilt: i,
        onRemoved: (p) => {
          const f = e.find((h) => h.repo_key !== p);
          f || o(), p === t && f && s(f.repo_key), i();
        }
      }
    )
  ] }) };
}
export {
  Le as A,
  $t as B,
  dt as C,
  lt as D,
  Kt as E,
  Gt as F,
  ee as G,
  qt as H,
  Z as I,
  Nt as J,
  Jt as K,
  Ct as L,
  y as M,
  It as N,
  Vt as O,
  Be as P,
  L as Q,
  k as R,
  Ae as S,
  St as T,
  At as U,
  Lt as V,
  zt as W,
  Rt as X,
  Dt as Y,
  A as Z,
  Y as a,
  he as b,
  Ot as c,
  Mt as d,
  Tt as e,
  Pt as f,
  Ut as g,
  Ht as h,
  I as i,
  z as j,
  Qt as k,
  Ye as l,
  yt as m,
  vt as n,
  wt as o,
  Yt as p,
  kt as q,
  _t as r,
  P as s,
  Ft as t,
  bt as u,
  xt as v,
  Bt as w,
  Wt as x,
  Et as y,
  jt as z
};
