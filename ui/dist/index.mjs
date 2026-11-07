var Td = Object.defineProperty;
var zd = (e, t, n) => t in e ? Td(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ye = (e, t, n) => zd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as u, jsxs as k, Fragment as me } from "react/jsx-runtime";
import { useTheme as Ha, useAppApi as Wa, ChatEmbed as Ld } from "@kirocrew/app-sdk";
import { Btn as se, Input as jr, Badge as ve, PageHeader as Ei, ContentSkeleton as ti, EmptyState as Ba, Card as zo, CardTitle as os, SegmentedControl as Od } from "@kirocrew/app-sdk/ui";
import Si, { useState as Q, useMemo as le, memo as he, forwardRef as Va, createContext as Yr, useCallback as $e, useContext as qt, useRef as oe, useEffect as de, useLayoutEffect as Ni } from "react";
import { s as Kt, M as X, a as xe, A as Ie, S as An, p as Gr, N as Pd, D as Fa, b as Dd, r as Rd, C as ja, c as br, d as vr, e as Hd, f as Wd, g as Bd, h as Vd, w as Fd, t as jd, G as Yd, i as Gd, j as Xd, k as Ud, u as qd, l as Kd, m as Zd, n as Ot, o as is, q as Qd, v as Jd, x as eu, y as tu, z as nu, B as ru, E as ou, F as iu, H as su, I as au, J as lu, K as cu, T as du, L as uu, O as fu, P as xt, Q as yt, R as hu, U as pu, V as gu, W as mu, X as yu } from "./chunks/ProjectMenu-FYd18wQz.mjs";
import "react-dom";
const Ya = [
  { key: "all", label: "All", title: "Every agent" },
  { key: "model", label: "Use a model", title: "Agents that call a model" },
  { key: "leaves", label: "Can leave region", title: "Agents whose model runs outside your home region" },
  { key: "asks", label: "Asks you", title: "Agents that wait for a person" },
  { key: "planned", label: "Planned", title: "Agents a spec names that have no jobs yet" }
], Ga = {
  all: () => !0,
  model: (e) => e.models.length > 0,
  leaves: (e) => e.leaves_region.length > 0,
  asks: (e) => e.asks_you.length > 0,
  planned: (e) => e.status === "planned"
}, wu = { built: "built", planned: "planned", empty: "no jobs" };
function bu(e, t) {
  return e.filter(Ga[t]);
}
function vu(e) {
  const t = {};
  for (const { key: n } of Ya) t[n] = e.filter(Ga[n]).length;
  return t;
}
function Ci(e, t) {
  var i;
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return r === "agent" ? ((i = t.find((s) => s.id === e)) == null ? void 0 : i.label) ?? o : r === "job" ? `${o} job` : r === "module" ? Kt(o) : o;
}
function Xa(e, t) {
  return [...new Set([...e.starts, ...e.handed_by].map((n) => Ci(n.node, t)))];
}
function xu(e, t) {
  return [...new Set(e.hands_off_to.map((n) => Ci(n.node, t)))];
}
function Mi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.models) t.has(n.node) || t.set(n.node, n);
  return [...t.values()];
}
function _u(e, t) {
  return e.leaves ? "leaves" : e.region && t && e.region.trim().toLowerCase() === t.trim().toLowerCase() ? "home" : "unknown";
}
function ku(e) {
  return e.region ? `${e.name} · ${e.region}` : e.name;
}
function Eu(e) {
  return e.on ? { on: !1, focus: e.before, before: null, closeSavedView: !1 } : { on: !0, focus: null, before: e.focus, closeSavedView: !0 };
}
function Su(e, t, n) {
  return { on: !0, focus: t, before: e.on ? e.before : n ? e.focus : null };
}
function Nu(e, t) {
  const n = (r) => (r ?? []).join(", ");
  return {
    list: e.list ?? "",
    jobs_key: e.jobs_key ?? t.jobs_key ?? "",
    hand_off_keys: n(e.hand_off_keys ?? t.hand_off_keys),
    model_calls: n(e.model_calls),
    asks_you_calls: n(e.asks_you_calls),
    modules: n((e.modules ?? []).map((r) => r.replace(/^module:/, ""))),
    home_region: e.home_region ?? ""
  };
}
function wt(e) {
  return [...new Set(e.split(/[\s,]+/).filter(Boolean))];
}
function Cu(e) {
  const t = {}, n = (o) => o.trim();
  n(e.list) && (t.list = n(e.list)), n(e.jobs_key) && (t.jobs_key = n(e.jobs_key)), wt(e.hand_off_keys).length && (t.hand_off_keys = wt(e.hand_off_keys)), wt(e.model_calls).length && (t.model_calls = wt(e.model_calls)), wt(e.asks_you_calls).length && (t.asks_you_calls = wt(e.asks_you_calls));
  const r = wt(e.modules).map((o) => `module:${o.replace(/^module:/, "")}`);
  return r.length && (t.modules = r), n(e.home_region) && (t.home_region = n(e.home_region)), t;
}
function Mu(e, t) {
  return { ...e, modules: [.../* @__PURE__ */ new Set([...e.modules ?? [], t])] };
}
const Dt = { padding: "6px 8px", textAlign: "left", verticalAlign: "top" }, fn = { ...Dt, fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)", whiteSpace: "nowrap" }, Iu = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text, inherit)" }, ir = { padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border-strong, #a1a1aa)", background: "var(--card, #fff)", fontSize: 12, overflowWrap: "anywhere" }, $u = { leaves: "err", home: "ok", unknown: "muted" }, Au = { built: "var(--ok, #15803d)", planned: "var(--danger, #dc2626)", empty: "var(--warn-text, #b45309)" };
function Ua({ status: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ u("span", { style: { width: 7, height: 7, borderRadius: "50%", background: Au[e] } }),
    wu[e]
  ] });
}
function qa({ models: e, home: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("span", { style: X, children: "none" }) : /* @__PURE__ */ u("span", { style: { display: "inline-flex", flexWrap: "wrap", gap: 4 }, children: e.map((n) => /* @__PURE__ */ u(ve, { variant: $u[_u(n, t)], title: n.leaves ? "Runs outside your home region" : n.region ? void 0 : "No region set. Set one on the service in the Map.", children: ku(n) }, n.node)) });
}
function Lo({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }, children: [
    /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: e }),
    t
  ] });
}
function Tu({ row: e, rows: t, home: n }) {
  const r = Xa(e, t), o = xu(e, t), i = /* @__PURE__ */ u("span", { style: { ...X, alignSelf: "center" }, children: "→" });
  return /* @__PURE__ */ k("div", { "data-testid": "agent-in-out", style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto auto minmax(0, 1fr)", gap: 6, margin: "10px 0" }, children: [
    /* @__PURE__ */ u(Lo, { title: "Starts from", children: r.length ? r.map((s) => /* @__PURE__ */ u("span", { style: ir, children: s }, s)) : /* @__PURE__ */ u("span", { style: X, children: "nothing found" }) }),
    i,
    /* @__PURE__ */ u("span", { style: { ...ir, alignSelf: "center", fontWeight: 600, border: "2px solid var(--accent, #2563eb)" }, children: e.label }),
    i,
    /* @__PURE__ */ k(Lo, { title: "Then", children: [
      o.map((s) => /* @__PURE__ */ u("span", { style: ir, children: s }, s)),
      e.asks_you.length > 0 && /* @__PURE__ */ u("span", { style: { ...ir, border: "1px solid var(--info, #2563eb)", background: "var(--bg-elevated, #fff)" }, children: "Asks you" }),
      o.length === 0 && e.asks_you.length === 0 && /* @__PURE__ */ u("span", { style: X, children: "nothing found" })
    ] }),
    /* @__PURE__ */ u("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ u(Lo, { title: "Uses model", children: /* @__PURE__ */ u(qa, { models: Mi(e), home: n }) }) })
  ] });
}
function zu({ row: e, rows: t, home: n, canAsk: r, onShow: o, onAsk: i }) {
  const s = [...e.evidence, ...Mi(e).map((a) => a.evidence), ...e.asks_you, ...e.hands_off_to.map((a) => a.evidence)];
  return /* @__PURE__ */ k("div", { "data-testid": "agent-detail", style: { fontSize: 13 }, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }, children: [
      /* @__PURE__ */ u("strong", { style: { fontSize: 15 }, children: e.label }),
      /* @__PURE__ */ u(Ua, { status: e.status })
    ] }),
    e.description && /* @__PURE__ */ u("p", { style: { margin: "6px 0 0" }, children: e.description }),
    /* @__PURE__ */ u(Tu, { row: e, rows: t, home: n }),
    e.jobs.length > 0 && /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k("p", { style: { margin: "8px 0 4px", fontWeight: 600 }, children: [
        "Jobs (",
        e.jobs.length,
        ")"
      ] }),
      /* @__PURE__ */ u("p", { style: { ...xe, fontSize: 12, margin: 0, overflowWrap: "anywhere" }, children: e.jobs.join("  ") })
    ] }),
    /* @__PURE__ */ u("p", { style: { margin: "10px 0 4px", fontWeight: 600 }, children: "Evidence" }),
    /* @__PURE__ */ u("ul", { style: { ...xe, ...X, fontSize: 12, margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: [...new Set(s)].slice(0, 8).map((a) => /* @__PURE__ */ u("li", { children: a }, a)) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      /* @__PURE__ */ u(se, { onClick: () => o(e.id), children: "Show on map" }),
      /* @__PURE__ */ u(se, { onClick: () => i(e), disabled: !r, children: "Ask" })
    ] })
  ] });
}
const Lu = [
  { key: "list", label: "Agent list", help: "The file whose exported array lists your agents, such as src/agents/registry.ts" },
  { key: "jobs_key", label: "Jobs key", help: "The property that holds each agent's jobs" },
  { key: "hand_off_keys", label: "Hand-off keys", help: "Properties that name the agent to hand work to, such as agent" },
  { key: "model_calls", label: "Model calls", help: "Functions that call a model, such as claude" },
  { key: "asks_you_calls", label: "Asks-you calls", help: "Functions that leave work for a person, such as addTask" },
  { key: "modules", label: "Agent modules", help: "Folders to treat as one agent each, such as src/mail" },
  { key: "home_region", label: "Home region", help: "Where your data should stay, such as Canada" }
];
function Ou({ state: e, saving: t, error: n, onSave: r, onCancel: o }) {
  const [i, s] = Q(() => Nu(e.settings, e.defaults)), a = async (l) => {
    await r(l) && o && o();
  };
  return /* @__PURE__ */ k("div", { "data-testid": "agent-setup", style: { maxWidth: 640, fontSize: 13 }, children: [
    e.agents.length === 0 && !e.settings.list && /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontSize: 14, fontWeight: 600 }, children: "No agents yet." }),
      /* @__PURE__ */ u("p", { style: { ...X, margin: "0 0 12px" }, children: "Point System Map at the file that lists your agents, or mark a module as one. Nothing is written to your repo." })
    ] }),
    e.agents.length === 0 && e.settings.list && /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k("p", { style: { margin: "0 0 4px", fontSize: 14, fontWeight: 600 }, "data-testid": "agents-not-found", children: [
        "No agents found in ",
        /* @__PURE__ */ u("span", { style: xe, children: e.settings.list }),
        "."
      ] }),
      /* @__PURE__ */ u("p", { style: { ...X, margin: "0 0 12px" }, children: "It needs an exported list of objects that each have a name. Check the file, or mark a module instead." })
    ] }),
    e.agents.length === 0 && e.suggestions.length > 0 && /* @__PURE__ */ k("div", { style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600 }, children: "These modules call a model" }),
      e.suggestions.map((l) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }, children: [
        /* @__PURE__ */ u("span", { style: { ...xe, fontSize: 12, flex: 1 }, children: Ci(l, []) }),
        /* @__PURE__ */ u(se, { disabled: t, onClick: () => void a(Mu(e.settings, l)), children: "Mark as agent" })
      ] }, l))
    ] }),
    /* @__PURE__ */ u("div", { style: { display: "grid", gridTemplateColumns: "minmax(110px, auto) minmax(0, 1fr)", gap: "8px 12px", alignItems: "start" }, children: Lu.map((l) => /* @__PURE__ */ k("label", { style: { display: "contents" }, children: [
      /* @__PURE__ */ u("span", { style: { paddingTop: 6, fontWeight: 600 }, children: l.label }),
      /* @__PURE__ */ k("span", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
        /* @__PURE__ */ u(jr, { value: i[l.key], onChange: (c) => s({ ...i, [l.key]: c.target.value }), style: l.key === "home_region" ? void 0 : xe }),
        /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: l.help })
      ] })
    ] }, l.key)) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 14 }, children: [
      /* @__PURE__ */ u(se, { primary: !0, disabled: t, onClick: () => void a(Cu(i)), children: t ? "Saving…" : "Save and rebuild" }),
      o && /* @__PURE__ */ u(se, { onClick: o, children: "Cancel" }),
      n && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: n })
    ] })
  ] });
}
function Pu({
  state: e,
  canAsk: t,
  saving: n,
  error: r,
  onShow: o,
  onAsk: i,
  onSave: s
}) {
  const [a, l] = Q("all"), [c, d] = Q(null), [h, f] = Q(!1), p = e.agents, g = le(() => vu(p), [p]), b = le(() => bu(p, a), [p, a]), w = b.find((x) => x.id === c) ?? b[0] ?? null, m = e.home_region;
  return p.length === 0 || h ? /* @__PURE__ */ u("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, color: "var(--text, inherit)" }, children: /* @__PURE__ */ u(Ou, { state: e, saving: n, error: r, onSave: s, onCancel: p.length ? () => f(!1) : void 0 }) }) : /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "agents-summary", children: [
      /* @__PURE__ */ k("strong", { children: [
        p.length,
        " agent",
        p.length === 1 ? "" : "s",
        ". ",
        g.model,
        " use",
        g.model === 1 ? "s" : "",
        " a model, and ",
        g.asks,
        " ask",
        g.asks === 1 ? "s" : "",
        " you first."
      ] }),
      " ",
      /* @__PURE__ */ u("span", { style: { ...X, fontSize: 13 }, children: g.leaves > 0 ? `${g.leaves} can send data outside ${m}.` : m ? `Your home region is ${m}.` : "Set a home region to see where data goes." })
    ] }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      Ya.map((x) => /* @__PURE__ */ k(se, { primary: a === x.key, title: x.title, onClick: () => l(x.key), children: [
        x.label,
        " ",
        g[x.key]
      ] }, x.key)),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(se, { onClick: () => f(!0), children: "Agent settings" })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, display: "flex", gap: 16 }, children: [
      /* @__PURE__ */ k("div", { style: { flex: 1, minWidth: 0, overflow: "auto" }, children: [
        /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "agents-table", children: [
          /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
            /* @__PURE__ */ u("th", { style: fn, children: "Agent" }),
            /* @__PURE__ */ u("th", { style: fn, children: "Status" }),
            /* @__PURE__ */ u("th", { style: fn, children: "Starts from" }),
            /* @__PURE__ */ u("th", { style: fn, children: "Model" }),
            /* @__PURE__ */ u("th", { style: fn, children: "Asks you" })
          ] }) }),
          /* @__PURE__ */ u("tbody", { children: b.map((x) => /* @__PURE__ */ k("tr", { onClick: () => d(x.id), style: { borderBottom: "1px solid var(--border, #e4e4e7)", cursor: "pointer", background: x.id === (w == null ? void 0 : w.id) ? "var(--accent-subtle, rgba(37,99,235,.12))" : void 0 }, children: [
            /* @__PURE__ */ u("td", { style: Dt, children: /* @__PURE__ */ u("button", { style: Iu, "aria-pressed": x.id === (w == null ? void 0 : w.id), onClick: () => d(x.id), children: x.label }) }),
            /* @__PURE__ */ u("td", { style: Dt, children: /* @__PURE__ */ u(Ua, { status: x.status }) }),
            /* @__PURE__ */ u("td", { style: { ...Dt, ...X }, children: Xa(x, p).join(", ") || "—" }),
            /* @__PURE__ */ u("td", { style: Dt, children: /* @__PURE__ */ u(qa, { models: Mi(x), home: m }) }),
            /* @__PURE__ */ u("td", { style: Dt, children: x.asks_you.length > 0 ? "Yes" : /* @__PURE__ */ u("span", { style: X, children: "—" }) })
          ] }, x.id)) })
        ] }),
        b.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No agents here. Pick All to see every agent." })
      ] }),
      w && /* @__PURE__ */ u("aside", { style: { width: 320, flexShrink: 0, overflowY: "auto", paddingLeft: 16, borderLeft: "1px solid var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u(zu, { row: w, rows: p, home: m, canAsk: t, onShow: o, onAsk: i }) })
    ] })
  ] });
}
function Ka(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Du = "\0", bt = "\0", ss = "";
let Ru = class {
  constructor(t) {
    ye(this, "_isDirected", !0);
    ye(this, "_isMultigraph", !1);
    ye(this, "_isCompound", !1);
    // Label for the graph itself
    ye(this, "_label");
    // Defaults to be set when creating a new node
    ye(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    ye(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    ye(this, "_nodes", {});
    // v -> edgeObj
    ye(this, "_in", {});
    // u -> v -> Number
    ye(this, "_preds", {});
    // v -> edgeObj
    ye(this, "_out", {});
    // v -> w -> Number
    ye(this, "_sucs", {});
    // e -> edgeObj
    ye(this, "_edgeObjs", {});
    // e -> label
    ye(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    ye(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    ye(this, "_edgeCount", 0);
    ye(this, "_parent");
    ye(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[bt] = {});
  }
  /* === Graph functions ========= */
  /**
   * Whether graph was created with 'directed' flag set to true or not.
   */
  isDirected() {
    return this._isDirected;
  }
  /**
   * Whether graph was created with 'multigraph' flag set to true or not.
   */
  isMultigraph() {
    return this._isMultigraph;
  }
  /**
   * Whether graph was created with 'compound' flag set to true or not.
   */
  isCompound() {
    return this._isCompound;
  }
  /**
   * Sets the label of the graph.
   */
  setGraph(t) {
    return this._label = t, this;
  }
  /**
   * Gets the graph label.
   */
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  /**
   * Sets the default node label. If newDefault is a function, it will be
   * invoked ach time when setting a label for a node. Otherwise, this label
   * will be assigned as default label in case if no label was specified while
   * setting a node.
   * Complexity: O(1).
   */
  setDefaultNodeLabel(t) {
    return this._defaultNodeLabelFn = t, typeof t != "function" && (this._defaultNodeLabelFn = () => t), this;
  }
  /**
   * Gets the number of nodes in the graph.
   * Complexity: O(1).
   */
  nodeCount() {
    return this._nodeCount;
  }
  /**
   * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
   * not included in list.
   * Complexity: O(1).
   */
  nodes() {
    return Object.keys(this._nodes);
  }
  /**
   * Gets list of nodes without in-edges.
   * Complexity: O(|V|).
   */
  sources() {
    var t = this;
    return this.nodes().filter((n) => Object.keys(t._in[n]).length === 0);
  }
  /**
   * Gets list of nodes without out-edges.
   * Complexity: O(|V|).
   */
  sinks() {
    var t = this;
    return this.nodes().filter((n) => Object.keys(t._out[n]).length === 0);
  }
  /**
   * Invokes setNode method for each node in names list.
   * Complexity: O(|names|).
   */
  setNodes(t, n) {
    var r = arguments, o = this;
    return t.forEach(function(i) {
      r.length > 1 ? o.setNode(i, n) : o.setNode(i);
    }), this;
  }
  /**
   * Creates or updates the value for the node v in the graph. If label is supplied
   * it is set as the value for the node. If label is not supplied and the node was
   * created by this call then the default node label will be assigned.
   * Complexity: O(1).
   */
  setNode(t, n) {
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = bt, this._children[t] = {}, this._children[bt][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }
  /**
   * Gets the label of node with specified name.
   * Complexity: O(|V|).
   */
  node(t) {
    return this._nodes[t];
  }
  /**
   * Detects whether graph has a node with specified name or not.
   */
  hasNode(t) {
    return Object.hasOwn(this._nodes, t);
  }
  /**
   * Remove the node with the name from the graph or do nothing if the node is not in
   * the graph. If the node was removed this function also removes any incident
   * edges.
   * Complexity: O(1).
   */
  removeNode(t) {
    var n = this;
    if (Object.hasOwn(this._nodes, t)) {
      var r = (o) => n.removeEdge(n._edgeObjs[o]);
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], this.children(t).forEach(function(o) {
        n.setParent(o);
      }), delete this._children[t]), Object.keys(this._in[t]).forEach(r), delete this._in[t], delete this._preds[t], Object.keys(this._out[t]).forEach(r), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }
    return this;
  }
  /**
   * Sets node p as a parent for node v if it is defined, or removes the
   * parent for v if p is undefined. Method throws an exception in case of
   * invoking it in context of noncompound graph.
   * Average-case complexity: O(1).
   */
  setParent(t, n) {
    if (!this._isCompound)
      throw new Error("Cannot set parent in a non-compound graph");
    if (n === void 0)
      n = bt;
    else {
      n += "";
      for (var r = n; r !== void 0; r = this.parent(r))
        if (r === t)
          throw new Error("Setting " + n + " as parent of " + t + " would create a cycle");
      this.setNode(n);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = n, this._children[n][t] = !0, this;
  }
  _removeFromParentsChildList(t) {
    delete this._children[this._parent[t]][t];
  }
  /**
   * Gets parent node for node v.
   * Complexity: O(1).
   */
  parent(t) {
    if (this._isCompound) {
      var n = this._parent[t];
      if (n !== bt)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = bt) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === bt)
        return this.nodes();
      if (this.hasNode(t))
        return [];
    }
  }
  /**
   * Return all nodes that are predecessors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  predecessors(t) {
    var n = this._preds[t];
    if (n)
      return Object.keys(n);
  }
  /**
   * Return all nodes that are successors of the specified node or undefined if node v is not in
   * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
   * Complexity: O(|V|).
   */
  successors(t) {
    var n = this._sucs[t];
    if (n)
      return Object.keys(n);
  }
  /**
   * Return all nodes that are predecessors or successors of the specified node or undefined if
   * node v is not in the graph.
   * Complexity: O(|V|).
   */
  neighbors(t) {
    var n = this.predecessors(t);
    if (n) {
      const o = new Set(n);
      for (var r of this.successors(t))
        o.add(r);
      return Array.from(o.values());
    }
  }
  isLeaf(t) {
    var n;
    return this.isDirected() ? n = this.successors(t) : n = this.neighbors(t), n.length === 0;
  }
  /**
   * Creates new graph with nodes filtered via filter. Edges incident to rejected node
   * are also removed. In case of compound graph, if parent is rejected by filter,
   * than all its children are rejected too.
   * Average-case complexity: O(|E|+|V|).
   */
  filterNodes(t) {
    var n = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    n.setGraph(this.graph());
    var r = this;
    Object.entries(this._nodes).forEach(function([s, a]) {
      t(s) && n.setNode(s, a);
    }), Object.values(this._edgeObjs).forEach(function(s) {
      n.hasNode(s.v) && n.hasNode(s.w) && n.setEdge(s, r.edge(s));
    });
    var o = {};
    function i(s) {
      var a = r.parent(s);
      return a === void 0 || n.hasNode(a) ? (o[s] = a, a) : a in o ? o[a] : i(a);
    }
    return this._isCompound && n.nodes().forEach((s) => n.setParent(s, i(s))), n;
  }
  /* === Edge functions ========== */
  /**
   * Sets the default edge label or factory function. This label will be
   * assigned as default label in case if no label was specified while setting
   * an edge or this function will be invoked each time when setting an edge
   * with no label specified and returned value * will be used as a label for edge.
   * Complexity: O(1).
   */
  setDefaultEdgeLabel(t) {
    return this._defaultEdgeLabelFn = t, typeof t != "function" && (this._defaultEdgeLabelFn = () => t), this;
  }
  /**
   * Gets the number of edges in the graph.
   * Complexity: O(1).
   */
  edgeCount() {
    return this._edgeCount;
  }
  /**
   * Gets edges of the graph. In case of compound graph subgraphs are not considered.
   * Complexity: O(|E|).
   */
  edges() {
    return Object.values(this._edgeObjs);
  }
  /**
   * Establish an edges path over the nodes in nodes list. If some edge is already
   * exists, it will update its label, otherwise it will create an edge between pair
   * of nodes with label provided or default label if no label provided.
   * Complexity: O(|nodes|).
   */
  setPath(t, n) {
    var r = this, o = arguments;
    return t.reduce(function(i, s) {
      return o.length > 1 ? r.setEdge(i, s, n) : r.setEdge(i, s), s;
    }), this;
  }
  /**
   * Creates or updates the label for the edge (v, w) with the optionally supplied
   * name. If label is supplied it is set as the value for the edge. If label is not
   * supplied and the edge was created by this call then the default edge label will
   * be assigned. The name parameter is only useful with multigraphs.
   */
  setEdge() {
    var t, n, r, o, i = !1, s = arguments[0];
    typeof s == "object" && s !== null && "v" in s ? (t = s.v, n = s.w, r = s.name, arguments.length === 2 && (o = arguments[1], i = !0)) : (t = s, n = arguments[1], r = arguments[3], arguments.length > 2 && (o = arguments[2], i = !0)), t = "" + t, n = "" + n, r !== void 0 && (r = "" + r);
    var a = gn(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = Hu(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, as(this._preds[n], t), as(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? Oo(this._isDirected, arguments[0]) : gn(this._isDirected, t, n, r);
    return this._edgeLabels[o];
  }
  /**
   * Gets the label for the specified edge and converts it to an object.
   * Complexity: O(1)
   */
  edgeAsObj() {
    const t = this.edge(...arguments);
    return typeof t != "object" ? { label: t } : t;
  }
  /**
   * Detects whether the graph contains specified edge or not. No subgraphs are considered.
   * Complexity: O(1).
   */
  hasEdge(t, n, r) {
    var o = arguments.length === 1 ? Oo(this._isDirected, arguments[0]) : gn(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? Oo(this._isDirected, arguments[0]) : gn(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], ls(this._preds[n], t), ls(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
  }
  /**
   * Return all edges that point to the node v. Optionally filters those edges down to just those
   * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  inEdges(t, n) {
    var r = this._in[t];
    if (r) {
      var o = Object.values(r);
      return n ? o.filter((i) => i.v === n) : o;
    }
  }
  /**
   * Return all edges that are pointed at by node v. Optionally filters those edges down to just
   * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
   * Complexity: O(|E|).
   */
  outEdges(t, n) {
    var r = this._out[t];
    if (r) {
      var o = Object.values(r);
      return n ? o.filter((i) => i.w === n) : o;
    }
  }
  /**
   * Returns all edges to or from node v regardless of direction. Optionally filters those edges
   * down to just those between nodes v and w regardless of direction.
   * Complexity: O(|E|).
   */
  nodeEdges(t, n) {
    var r = this.inEdges(t, n);
    if (r)
      return r.concat(this.outEdges(t, n));
  }
};
function as(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function ls(e, t) {
  --e[t] || delete e[t];
}
function gn(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + ss + i + ss + (r === void 0 ? Du : r);
}
function Hu(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function Oo(e, t) {
  return gn(e, t.v, t.w, t.name);
}
var Ii = Ru, Wu = "2.2.4", Bu = {
  Graph: Ii,
  version: Wu
}, Vu = Ii, Fu = {
  write: ju,
  read: Xu
};
function ju(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: Yu(e),
    edges: Gu(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function Yu(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function Gu(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function Xu(e) {
  var t = new Vu(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var Uu = qu;
function qu(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let Ku = class {
  constructor() {
    ye(this, "_arr", []);
    ye(this, "_keyIndices", {});
  }
  /**
   * Returns the number of elements in the queue. Takes `O(1)` time.
   */
  size() {
    return this._arr.length;
  }
  /**
   * Returns the keys that are in the queue. Takes `O(n)` time.
   */
  keys() {
    return this._arr.map(function(t) {
      return t.key;
    });
  }
  /**
   * Returns `true` if **key** is in the queue and `false` if not.
   */
  has(t) {
    return Object.hasOwn(this._keyIndices, t);
  }
  /**
   * Returns the priority for **key**. If **key** is not present in the queue
   * then this function returns `undefined`. Takes `O(1)` time.
   *
   * @param {Object} key
   */
  priority(t) {
    var n = this._keyIndices[t];
    if (n !== void 0)
      return this._arr[n].priority;
  }
  /**
   * Returns the key for the minimum element in this queue. If the queue is
   * empty this function throws an Error. Takes `O(1)` time.
   */
  min() {
    if (this.size() === 0)
      throw new Error("Queue underflow");
    return this._arr[0].key;
  }
  /**
   * Inserts a new key into the priority queue. If the key already exists in
   * the queue this function returns `false`; otherwise it will return `true`.
   * Takes `O(n)` time.
   *
   * @param {Object} key the key to add
   * @param {Number} priority the initial priority for the key
   */
  add(t, n) {
    var r = this._keyIndices;
    if (t = String(t), !Object.hasOwn(r, t)) {
      var o = this._arr, i = o.length;
      return r[t] = i, o.push({ key: t, priority: n }), this._decrease(i), !0;
    }
    return !1;
  }
  /**
   * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
   */
  removeMin() {
    this._swap(0, this._arr.length - 1);
    var t = this._arr.pop();
    return delete this._keyIndices[t.key], this._heapify(0), t.key;
  }
  /**
   * Decreases the priority for **key** to **priority**. If the new priority is
   * greater than the previous priority, this function will throw an Error.
   *
   * @param {Object} key the key for which to raise priority
   * @param {Number} priority the new priority for the key
   */
  decrease(t, n) {
    var r = this._keyIndices[t];
    if (n > this._arr[r].priority)
      throw new Error("New priority is greater than current priority. Key: " + t + " Old: " + this._arr[r].priority + " New: " + n);
    this._arr[r].priority = n, this._decrease(r);
  }
  _heapify(t) {
    var n = this._arr, r = 2 * t, o = r + 1, i = t;
    r < n.length && (i = n[r].priority < n[i].priority ? r : i, o < n.length && (i = n[o].priority < n[i].priority ? o : i), i !== t && (this._swap(t, i), this._heapify(i)));
  }
  _decrease(t) {
    for (var n = this._arr, r = n[t].priority, o; t !== 0 && (o = t >> 1, !(n[o].priority < r)); )
      this._swap(t, o), t = o;
  }
  _swap(t, n) {
    var r = this._arr, o = this._keyIndices, i = r[t], s = r[n];
    r[t] = s, r[n] = i, o[s.key] = t, o[i.key] = n;
  }
};
var Za = Ku, Zu = Za, Qa = Ju, Qu = () => 1;
function Ju(e, t, n, r) {
  return ef(
    e,
    String(t),
    n || Qu,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function ef(e, t, n, r) {
  var o = {}, i = new Zu(), s, a, l = function(c) {
    var d = c.v !== s ? c.v : c.w, h = o[d], f = n(c), p = a.distance + f;
    if (f < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + f);
    p < h.distance && (h.distance = p, h.predecessor = s, i.decrease(d, p));
  };
  for (e.nodes().forEach(function(c) {
    var d = c === t ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: d }, i.add(c, d);
  }); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY); )
    r(s).forEach(l);
  return o;
}
var tf = Qa, nf = rf;
function rf(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = tf(e, o, t, n), r;
  }, {});
}
var Ja = of;
function of(e) {
  var t = 0, n = [], r = {}, o = [];
  function i(s) {
    var a = r[s] = {
      onStack: !0,
      lowlink: t,
      index: t++
    };
    if (n.push(s), e.successors(s).forEach(function(d) {
      Object.hasOwn(r, d) ? r[d].onStack && (a.lowlink = Math.min(a.lowlink, r[d].index)) : (i(d), a.lowlink = Math.min(a.lowlink, r[d].lowlink));
    }), a.lowlink === a.index) {
      var l = [], c;
      do
        c = n.pop(), r[c].onStack = !1, l.push(c);
      while (s !== c);
      o.push(l);
    }
  }
  return e.nodes().forEach(function(s) {
    Object.hasOwn(r, s) || i(s);
  }), o;
}
var sf = Ja, af = lf;
function lf(e) {
  return sf(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var cf = uf, df = () => 1;
function uf(e, t, n) {
  return ff(
    e,
    t || df,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function ff(e, t, n) {
  var r = {}, o = e.nodes();
  return o.forEach(function(i) {
    r[i] = {}, r[i][i] = { distance: 0 }, o.forEach(function(s) {
      i !== s && (r[i][s] = { distance: Number.POSITIVE_INFINITY });
    }), n(i).forEach(function(s) {
      var a = s.v === i ? s.w : s.v, l = t(s);
      r[i][a] = { distance: l, predecessor: i };
    });
  }), o.forEach(function(i) {
    var s = r[i];
    o.forEach(function(a) {
      var l = r[a];
      o.forEach(function(c) {
        var d = l[i], h = s[c], f = l[c], p = d.distance + h.distance;
        p < f.distance && (f.distance = p, f.predecessor = h.predecessor);
      });
    });
  }), r;
}
function el(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new ni();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new ni();
  return r;
}
class ni extends Error {
  constructor() {
    super(...arguments);
  }
}
var tl = el;
el.CycleException = ni;
var cs = tl, hf = pf;
function pf(e) {
  try {
    cs(e);
  } catch (t) {
    if (t instanceof cs.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var nl = gf;
function gf(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? mf : yf, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function mf(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), rl(t(i[0]), (s) => o.push([s, !1])));
  }
}
function yf(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), rl(t(i), (s) => o.push(s)));
  }
}
function rl(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var wf = nl, bf = vf;
function vf(e, t) {
  return wf(e, t, "post");
}
var xf = nl, _f = kf;
function kf(e, t) {
  return xf(e, t, "pre");
}
var Ef = Ii, Sf = Za, Nf = Cf;
function Cf(e, t) {
  var n = new Ef(), r = {}, o = new Sf(), i;
  function s(l) {
    var c = l.v === i ? l.w : l.v, d = o.priority(c);
    if (d !== void 0) {
      var h = t(l);
      h < d && (r[c] = i, o.decrease(c, h));
    }
  }
  if (e.nodeCount() === 0)
    return n;
  e.nodes().forEach(function(l) {
    o.add(l, Number.POSITIVE_INFINITY), n.setNode(l);
  }), o.decrease(e.nodes()[0], 0);
  for (var a = !1; o.size() > 0; ) {
    if (i = o.removeMin(), Object.hasOwn(r, i))
      n.setEdge(i, r[i]);
    else {
      if (a)
        throw new Error("Input graph is not connected: " + e);
      a = !0;
    }
    e.nodeEdges(i).forEach(s);
  }
  return n;
}
var Mf = {
  components: Uu,
  dijkstra: Qa,
  dijkstraAll: nf,
  findCycles: af,
  floydWarshall: cf,
  isAcyclic: hf,
  postorder: bf,
  preorder: _f,
  prim: Nf,
  tarjan: Ja,
  topsort: tl
}, ds = Bu, Fe = {
  Graph: ds.Graph,
  json: Fu,
  alg: Mf,
  version: ds.version
};
let If = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return us(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && us(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, $f)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function us(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function $f(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var Af = If;
let Tf = Fe.Graph, zf = Af;
var Lf = Pf;
let Of = () => 1;
function Pf(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = Rf(e, t || Of);
  return Df(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function Df(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      Po(e, t, n, s);
    for (; s = o.dequeue(); )
      Po(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(Po(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function Po(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, ri(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, ri(t, n, c);
  }), e.removeNode(r.v), i;
}
function Rf(e, t) {
  let n = new Tf(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = Hf(o + r + 3).map(() => new zf()), s = r + 1;
  return n.nodes().forEach((a) => {
    ri(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function ri(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function Hf(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let ol = Fe.Graph;
var we = {
  addBorderNode: Uf,
  addDummyNode: il,
  applyWithChunking: Xr,
  asNonCompoundGraph: Bf,
  buildLayerMatrix: Yf,
  intersectRect: jf,
  mapValues: th,
  maxRank: al,
  normalizeRanks: Gf,
  notime: Qf,
  partition: Kf,
  pick: eh,
  predecessorWeights: Ff,
  range: cl,
  removeEmptyRanks: Xf,
  simplify: Wf,
  successorWeights: Vf,
  time: Zf,
  uniqueId: ll,
  zipObject: $i
};
function il(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = ll(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function Wf(e) {
  let t = new ol().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function Bf(e) {
  let t = new ol({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function Vf(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return $i(e.nodes(), t);
}
function Ff(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return $i(e.nodes(), t);
}
function jf(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function Yf(e) {
  let t = cl(al(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function Gf(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Xr(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function Xf(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Xr(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function Uf(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), il(e, "border", o, t);
}
function qf(e, t = sl) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const sl = 65535;
function Xr(e, t) {
  if (t.length > sl) {
    const n = qf(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function al(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Xr(Math.max, n);
}
function Kf(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function Zf(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function Qf(e, t) {
  return t();
}
let Jf = 0;
function ll(e) {
  var t = ++Jf;
  return e + ("" + t);
}
function cl(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function eh(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function th(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function $i(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let nh = Lf, rh = we.uniqueId;
var oh = {
  run: ih,
  undo: ah
};
function ih(e) {
  (e.graph().acyclicer === "greedy" ? nh(e, n(e)) : sh(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, rh("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function sh(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function ah(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let lh = we;
var ch = {
  run: dh,
  undo: fh
};
function dh(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => uh(e, t));
}
function uh(e, t) {
  let n = t.v, r = e.node(n).rank, o = t.w, i = e.node(o).rank, s = t.name, a = e.edge(t), l = a.labelRank;
  if (i === r + 1) return;
  e.removeEdge(t);
  let c, d, h;
  for (h = 0, ++r; r < i; ++h, ++r)
    a.points = [], d = {
      width: 0,
      height: 0,
      edgeLabel: a,
      edgeObj: t,
      rank: r
    }, c = lh.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), h === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function fh(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: hh } = we;
var Ur = {
  longestPath: ph,
  slack: gh
};
function ph(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = hh(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function gh(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var mh = Fe.Graph, Ir = Ur.slack, dl = yh;
function yh(e) {
  var t = new mh({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; wh(t, e) < r; )
    o = bh(t, e), i = t.hasNode(o.v) ? Ir(e, o) : -Ir(e, o), vh(t, e, i);
  return t;
}
function wh(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !Ir(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function bh(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = Ir(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function vh(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var xh = dl, fs = Ur.slack, _h = Ur.longestPath, kh = Fe.alg.preorder, Eh = Fe.alg.postorder, Sh = we.simplify, Nh = Tt;
Tt.initLowLimValues = Ti;
Tt.initCutValues = Ai;
Tt.calcCutValue = ul;
Tt.leaveEdge = hl;
Tt.enterEdge = pl;
Tt.exchangeEdges = gl;
function Tt(e) {
  e = Sh(e), _h(e);
  var t = xh(e);
  Ti(t), Ai(t, e);
  for (var n, r; n = hl(t); )
    r = pl(t, e, n), gl(t, e, n, r);
}
function Ai(e, t) {
  var n = Eh(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => Ch(e, t, r));
}
function Ch(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = ul(e, t, n);
}
function ul(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var h = c === i, f = t.edge(l).weight;
      if (a += h ? f : -f, Ih(e, n, d)) {
        var p = e.edge(n, d).cutvalue;
        a += h ? -p : p;
      }
    }
  }), a;
}
function Ti(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), fl(e, {}, 1, t);
}
function fl(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = fl(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function hl(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function pl(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === hs(e, e.node(d.v), a) && l !== hs(e, e.node(d.w), a));
  return c.reduce((d, h) => fs(t, h) < fs(t, d) ? h : d);
}
function gl(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), Ti(e), Ai(e, t), Mh(e, t);
}
function Mh(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = kh(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function Ih(e, t, n) {
  return e.hasEdge(t, n);
}
function hs(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var $h = Ur, ml = $h.longestPath, Ah = dl, Th = Nh, zh = Lh;
function Lh(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      ps(e);
      break;
    case "tight-tree":
      Ph(e);
      break;
    case "longest-path":
      Oh(e);
      break;
    case "none":
      break;
    default:
      ps(e);
  }
}
var Oh = ml;
function Ph(e) {
  ml(e), Ah(e);
}
function ps(e) {
  Th(e);
}
var Dh = Rh;
function Rh(e) {
  let t = Wh(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = Hh(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
    for (; n !== o.w; ) {
      if (r = e.node(n), d) {
        for (; (c = s[l]) !== a && e.node(c).maxRank < r.rank; )
          l++;
        c === a && (d = !1);
      }
      if (!d) {
        for (; l < s.length - 1 && e.node(c = s[l + 1]).minRank <= r.rank; )
          l++;
        c = s[l];
      }
      e.setParent(n, c), n = e.successors(n)[0];
    }
  });
}
function Hh(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function Wh(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let $r = we;
var Bh = {
  run: Vh,
  cleanup: Yh
};
function Vh(e) {
  let t = $r.addDummyNode(e, "root", {}, "_root"), n = Fh(e), r = Object.values(n), o = $r.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = jh(e) + 1;
  e.children().forEach((a) => yl(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function yl(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = $r.addBorderNode(e, "_bt"), c = $r.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((h) => {
    yl(e, t, n, r, o, i, h);
    let f = e.node(h), p = f.borderTop ? f.borderTop : h, g = f.borderBottom ? f.borderBottom : h, b = f.borderTop ? r : 2 * r, w = p !== g ? 1 : o - i[s] + 1;
    e.setEdge(l, p, {
      weight: b,
      minlen: w,
      nestingEdge: !0
    }), e.setEdge(g, c, {
      weight: b,
      minlen: w,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function Fh(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function jh(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function Yh(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let Gh = we;
var Xh = Uh;
function Uh(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        gs(e, "borderLeft", "_bl", n, o, i), gs(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function gs(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = Gh.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var qh = {
  adjust: Kh,
  undo: Zh
};
function Kh(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && wl(e);
}
function Zh(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && Qh(e), (t === "lr" || t === "rl") && (Jh(e), wl(e));
}
function wl(e) {
  e.nodes().forEach((t) => ms(e.node(t))), e.edges().forEach((t) => ms(e.edge(t)));
}
function ms(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function Qh(e) {
  e.nodes().forEach((t) => Do(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Do), Object.hasOwn(n, "y") && Do(n);
  });
}
function Do(e) {
  e.y = -e.y;
}
function Jh(e) {
  e.nodes().forEach((t) => Ro(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Ro), Object.hasOwn(n, "x") && Ro(n);
  });
}
function Ro(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let ys = we;
var ep = tp;
function tp(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = ys.applyWithChunking(Math.max, r), i = ys.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let np = we.zipObject;
var rp = op;
function op(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += ip(e, t[r - 1], t[r]);
  return n;
}
function ip(e, t, n) {
  let r = np(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, h) => d.pos - h.pos)), i = 1;
  for (; i < n.length; ) i <<= 1;
  let s = 2 * i - 1;
  i -= 1;
  let a = new Array(s).fill(0), l = 0;
  return o.forEach((c) => {
    let d = c.pos + i;
    a[d] += c.weight;
    let h = 0;
    for (; d > 0; )
      d % 2 && (h += a[d + 1]), d = d - 1 >> 1, a[d] += c.weight;
    l += c.weight * h;
  }), l;
}
var sp = ap;
function ap(e, t = []) {
  return t.map((n) => {
    let r = e.inEdges(n);
    if (r.length) {
      let o = r.reduce((i, s) => {
        let a = e.edge(s), l = e.node(s.v);
        return {
          sum: i.sum + a.weight * l.order,
          weight: i.weight + a.weight
        };
      }, { sum: 0, weight: 0 });
      return {
        v: n,
        barycenter: o.sum / o.weight,
        weight: o.weight
      };
    } else
      return { v: n };
  });
}
let lp = we;
var cp = dp;
function dp(e, t) {
  let n = {};
  e.forEach((o, i) => {
    let s = n[o.v] = {
      indegree: 0,
      in: [],
      out: [],
      vs: [o.v],
      i
    };
    o.barycenter !== void 0 && (s.barycenter = o.barycenter, s.weight = o.weight);
  }), t.edges().forEach((o) => {
    let i = n[o.v], s = n[o.w];
    i !== void 0 && s !== void 0 && (s.indegree++, i.out.push(n[o.w]));
  });
  let r = Object.values(n).filter((o) => !o.indegree);
  return up(r);
}
function up(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && fp(o, i);
    };
  }
  function r(o) {
    return (i) => {
      i.in.push(o), --i.indegree === 0 && e.push(i);
    };
  }
  for (; e.length; ) {
    let o = e.pop();
    t.push(o), o.in.reverse().forEach(n(o)), o.out.forEach(r(o));
  }
  return t.filter((o) => !o.merged).map((o) => lp.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function fp(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let hp = we;
var pp = gp;
function gp(e, t) {
  let n = hp.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, h) => h.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(mp(!!t)), l = ws(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = ws(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function ws(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function mp(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let yp = sp, wp = cp, bp = pp;
var vp = bl;
function bl(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((f) => f !== s && f !== a));
  let c = yp(e, o);
  c.forEach((f) => {
    if (e.children(f.v).length) {
      let p = bl(e, f.v, n, r);
      l[f.v] = p, Object.hasOwn(p, "barycenter") && _p(f, p);
    }
  });
  let d = wp(c, n);
  xp(d, l);
  let h = bp(d, r);
  if (s && (h.vs = [s, h.vs, a].flat(!0), e.predecessors(s).length)) {
    let f = e.node(e.predecessors(s)[0]), p = e.node(e.predecessors(a)[0]);
    Object.hasOwn(h, "barycenter") || (h.barycenter = 0, h.weight = 0), h.barycenter = (h.barycenter * h.weight + f.order + p.order) / (h.weight + 2), h.weight += 2;
  }
  return h;
}
function xp(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function _p(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let kp = Fe.Graph, Ep = we;
var Sp = Np;
function Np(e, t, n, r) {
  r || (r = e.nodes());
  let o = Cp(e), i = new kp({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
  return r.forEach((s) => {
    let a = e.node(s), l = e.parent(s);
    (a.rank === t || a.minRank <= t && t <= a.maxRank) && (i.setNode(s), i.setParent(s, l || o), e[n](s).forEach((c) => {
      let d = c.v === s ? c.w : c.v, h = i.edge(d, s), f = h !== void 0 ? h.weight : 0;
      i.setEdge(d, s, { weight: e.edge(c).weight + f });
    }), Object.hasOwn(a, "minRank") && i.setNode(s, {
      borderLeft: a.borderLeft[t],
      borderRight: a.borderRight[t]
    }));
  }), i;
}
function Cp(e) {
  for (var t; e.hasNode(t = Ep.uniqueId("_root")); ) ;
  return t;
}
var Mp = Ip;
function Ip(e, t, n) {
  let r = {}, o;
  n.forEach((i) => {
    let s = e.parent(i), a, l;
    for (; s; ) {
      if (a = e.parent(s), a ? (l = r[a], r[a] = s) : (l = o, o = s), l && l !== s) {
        t.setEdge(l, s);
        return;
      }
      s = a;
    }
  });
}
let $p = ep, Ap = rp, Tp = vp, zp = Sp, Lp = Mp, Op = Fe.Graph, sr = we;
var Pp = vl;
function vl(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, vl);
    return;
  }
  let n = sr.maxRank(e), r = bs(e, sr.range(1, n + 1), "inEdges"), o = bs(e, sr.range(n - 1, -1, -1), "outEdges"), i = $p(e);
  if (vs(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    Dp(l % 2 ? r : o, l % 4 >= 2), i = sr.buildLayerMatrix(e);
    let d = Ap(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  vs(e, a);
}
function bs(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (i, s) => {
    r.has(i) || r.set(i, []), r.get(i).push(s);
  };
  for (const i of e.nodes()) {
    const s = e.node(i);
    if (typeof s.rank == "number" && o(s.rank, i), typeof s.minRank == "number" && typeof s.maxRank == "number")
      for (let a = s.minRank; a <= s.maxRank; a++)
        a !== s.rank && o(a, i);
  }
  return t.map(function(i) {
    return zp(e, i, n, r.get(i) || []);
  });
}
function Dp(e, t) {
  let n = new Op();
  e.forEach(function(r) {
    let o = r.graph().root, i = Tp(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), Lp(r, n, i.vs);
  });
}
function vs(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let Rp = Fe.Graph, rt = we;
var Hp = {
  positionX: Kp
};
function Wp(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, h) => {
      let f = Vp(e, d), p = f ? e.node(f).order : l;
      (f || d === c) && (i.slice(a, h + 1).forEach((g) => {
        e.predecessors(g).forEach((b) => {
          let w = e.node(b), m = w.order;
          (m < s || p < m) && !(w.dummy && e.node(g).dummy) && xl(n, b, g);
        });
      }), a = h + 1, s = p);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function Bp(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    rt.range(s, a).forEach((h) => {
      d = i[h], e.node(d).dummy && e.predecessors(d).forEach((f) => {
        let p = e.node(f);
        p.dummy && (p.order < l || p.order > c) && xl(n, f, d);
      });
    });
  }
  function o(i, s) {
    let a = -1, l, c = 0;
    return s.forEach((d, h) => {
      if (e.node(d).dummy === "border") {
        let f = e.predecessors(d);
        f.length && (l = e.node(f[0]).order, r(s, c, h, a, l), c = h, a = l);
      }
      r(s, c, s.length, l, i.length);
    }), s;
  }
  return t.length && t.reduce(o), n;
}
function Vp(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function xl(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function Fp(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function jp(e, t, n, r) {
  let o = {}, i = {}, s = {};
  return t.forEach((a) => {
    a.forEach((l, c) => {
      o[l] = l, i[l] = l, s[l] = c;
    });
  }), t.forEach((a) => {
    let l = -1;
    a.forEach((c) => {
      let d = r(c);
      if (d.length) {
        d = d.sort((f, p) => s[f] - s[p]);
        let h = (d.length - 1) / 2;
        for (let f = Math.floor(h), p = Math.ceil(h); f <= p; ++f) {
          let g = d[f];
          i[c] === c && l < s[g] && !Fp(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function Yp(e, t, n, r, o) {
  let i = {}, s = Gp(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(h, f) {
    let p = s.nodes(), g = p.pop(), b = {};
    for (; g; )
      b[g] ? h(g) : (b[g] = !0, p.push(g), p = p.concat(f(g))), g = p.pop();
  }
  function c(h) {
    i[h] = s.inEdges(h).reduce((f, p) => Math.max(f, i[p.v] + s.edge(p)), 0);
  }
  function d(h) {
    let f = s.outEdges(h).reduce((g, b) => Math.min(g, i[b.w] - s.edge(b)), Number.POSITIVE_INFINITY), p = e.node(h);
    f !== Number.POSITIVE_INFINITY && p.borderType !== a && (i[h] = Math.max(i[h], f));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((h) => i[h] = i[n[h]]), i;
}
function Gp(e, t, n, r) {
  let o = new Rp(), i = e.graph(), s = Zp(i.nodesep, i.edgesep, r);
  return t.forEach((a) => {
    let l;
    a.forEach((c) => {
      let d = n[c];
      if (o.setNode(d), l) {
        var h = n[l], f = o.edge(h, d);
        o.setEdge(h, d, Math.max(s(e, c, l), f || 0));
      }
      l = c;
    });
  }), o;
}
function Xp(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = Qp(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Up(e, t) {
  let n = Object.values(t), r = rt.applyWithChunking(Math.min, n), o = rt.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), d = r - rt.applyWithChunking(Math.min, c);
      s !== "l" && (d = o - rt.applyWithChunking(Math.max, c)), d && (e[a] = rt.mapValues(l, (h) => h + d));
    });
  });
}
function qp(e, t) {
  return rt.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function Kp(e) {
  let t = rt.buildLayerMatrix(e), n = Object.assign(
    Wp(e, t),
    Bp(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((h) => Object.values(h).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = jp(e, o, n, l), d = Yp(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = rt.mapValues(d, (h) => -h)), r[s + a] = d;
    });
  });
  let i = Xp(e, r);
  return Up(r, i), qp(r, e.graph().align);
}
function Zp(e, t, n) {
  return (r, o, i) => {
    let s = r.node(o), a = r.node(i), l = 0, c;
    if (l += s.width / 2, Object.hasOwn(s, "labelpos"))
      switch (s.labelpos.toLowerCase()) {
        case "l":
          c = -s.width / 2;
          break;
        case "r":
          c = s.width / 2;
          break;
      }
    if (c && (l += n ? c : -c), c = 0, l += (s.dummy ? t : e) / 2, l += (a.dummy ? t : e) / 2, l += a.width / 2, Object.hasOwn(a, "labelpos"))
      switch (a.labelpos.toLowerCase()) {
        case "l":
          c = a.width / 2;
          break;
        case "r":
          c = -a.width / 2;
          break;
      }
    return c && (l += n ? c : -c), c = 0, l;
  };
}
function Qp(e, t) {
  return e.node(t).width;
}
let _l = we, Jp = Hp.positionX;
var eg = tg;
function tg(e) {
  e = _l.asNonCompoundGraph(e), ng(e), Object.entries(Jp(e)).forEach(([t, n]) => e.node(t).x = n);
}
function ng(e) {
  let t = _l.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let xs = oh, _s = ch, rg = zh, og = we.normalizeRanks, ig = Dh, sg = we.removeEmptyRanks, ks = Bh, ag = Xh, Es = qh, lg = Pp, cg = eg, Oe = we, dg = Fe.Graph;
var ug = fg;
function fg(e, t) {
  let n = t && t.debugTiming ? Oe.time : Oe.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => _g(e));
    n("  runLayout", () => hg(r, n, t)), n("  updateInputGraph", () => pg(e, r));
  });
}
function hg(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => kg(e)), t("    removeSelfEdges", () => Tg(e)), t("    acyclic", () => xs.run(e)), t("    nestingGraph.run", () => ks.run(e)), t("    rank", () => rg(Oe.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Eg(e)), t("    removeEmptyRanks", () => sg(e)), t("    nestingGraph.cleanup", () => ks.cleanup(e)), t("    normalizeRanks", () => og(e)), t("    assignRankMinMax", () => Sg(e)), t("    removeEdgeLabelProxies", () => Ng(e)), t("    normalize.run", () => _s.run(e)), t("    parentDummyChains", () => ig(e)), t("    addBorderSegments", () => ag(e)), t("    order", () => lg(e, n)), t("    insertSelfEdges", () => zg(e)), t("    adjustCoordinateSystem", () => Es.adjust(e)), t("    position", () => cg(e)), t("    positionSelfEdges", () => Lg(e)), t("    removeBorderNodes", () => Ag(e)), t("    normalize.undo", () => _s.undo(e)), t("    fixupEdgeLabelCoords", () => Ig(e)), t("    undoCoordinateSystem", () => Es.undo(e)), t("    translateGraph", () => Cg(e)), t("    assignNodeIntersects", () => Mg(e)), t("    reversePoints", () => $g(e)), t("    acyclic.undo", () => xs.undo(e));
}
function pg(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let gg = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], mg = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, yg = ["acyclicer", "ranker", "rankdir", "align"], wg = ["width", "height", "rank"], Ss = { width: 0, height: 0 }, bg = ["minlen", "weight", "width", "height", "labeloffset"], vg = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, xg = ["labelpos"];
function _g(e) {
  let t = new dg({ multigraph: !0, compound: !0 }), n = Wo(e.graph());
  return t.setGraph(Object.assign(
    {},
    mg,
    Ho(n, gg),
    Oe.pick(n, yg)
  )), e.nodes().forEach((r) => {
    let o = Wo(e.node(r));
    const i = Ho(o, wg);
    Object.keys(Ss).forEach((s) => {
      i[s] === void 0 && (i[s] = Ss[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = Wo(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      vg,
      Ho(o, bg),
      Oe.pick(o, xg)
    ));
  }), t;
}
function kg(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Eg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      Oe.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Sg(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function Ng(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Cg(e) {
  let t = Number.POSITIVE_INFINITY, n = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function l(c) {
    let d = c.x, h = c.y, f = c.width, p = c.height;
    t = Math.min(t, d - f / 2), n = Math.max(n, d + f / 2), r = Math.min(r, h - p / 2), o = Math.max(o, h + p / 2);
  }
  e.nodes().forEach((c) => l(e.node(c))), e.edges().forEach((c) => {
    let d = e.edge(c);
    Object.hasOwn(d, "x") && l(d);
  }), t -= s, r -= a, e.nodes().forEach((c) => {
    let d = e.node(c);
    d.x -= t, d.y -= r;
  }), e.edges().forEach((c) => {
    let d = e.edge(c);
    d.points.forEach((h) => {
      h.x -= t, h.y -= r;
    }), Object.hasOwn(d, "x") && (d.x -= t), Object.hasOwn(d, "y") && (d.y -= r);
  }), i.width = n - t + s, i.height = o - r + a;
}
function Mg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(Oe.intersectRect(r, i)), n.points.push(Oe.intersectRect(o, s));
  });
}
function Ig(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (Object.hasOwn(n, "x"))
      switch ((n.labelpos === "l" || n.labelpos === "r") && (n.width -= n.labeloffset), n.labelpos) {
        case "l":
          n.x -= n.width / 2 + n.labeloffset;
          break;
        case "r":
          n.x += n.width / 2 + n.labeloffset;
          break;
      }
  });
}
function $g(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function Ag(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Tg(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function zg(e) {
  var t = Oe.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        Oe.addDummyNode(e, "selfedge", {
          width: a.label.width,
          height: a.label.height,
          rank: s.rank,
          order: i + ++r,
          e: a.e,
          label: a.label
        }, "_se");
      }), delete s.selfEdges;
    });
  });
}
function Lg(e) {
  e.nodes().forEach((t) => {
    var n = e.node(t);
    if (n.dummy === "selfedge") {
      var r = e.node(n.e.v), o = r.x + r.width / 2, i = r.y, s = n.x - o, a = r.height / 2;
      e.setEdge(n.e, n.label), e.removeNode(t), n.label.points = [
        { x: o + 2 * s / 3, y: i - a },
        { x: o + 5 * s / 6, y: i - a },
        { x: o + s, y: i },
        { x: o + 5 * s / 6, y: i + a },
        { x: o + 2 * s / 3, y: i + a }
      ], n.label.x = n.x, n.label.y = n.y;
    }
  });
}
function Ho(e, t) {
  return Oe.mapValues(Oe.pick(e, t), Number);
}
function Wo(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let Og = we, Pg = Fe.Graph;
var Dg = {
  debugOrdering: Rg
};
function Rg(e) {
  let t = Og.buildLayerMatrix(e), n = new Pg({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var Hg = "1.1.8", Wg = {
  graphlib: Fe,
  layout: ug,
  debug: Dg,
  util: {
    time: we.time,
    notime: we.notime
  },
  version: Hg
};
const Ar = /* @__PURE__ */ Ka(Wg);
function be(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = be(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var Bg = { value: () => {
} };
function qr() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new xr(n);
}
function xr(e) {
  this._ = e;
}
function Vg(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
xr.prototype = qr.prototype = {
  constructor: xr,
  on: function(e, t) {
    var n = this._, r = Vg(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = Fg(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Ns(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Ns(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new xr(e);
  },
  call: function(e, t) {
    if ((o = arguments.length - 2) > 0) for (var n = new Array(o), r = 0, o, i; r < o; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (i = this._[e], r = 0, o = i.length; r < o; ++r) i[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], o = 0, i = r.length; o < i; ++o) r[o].value.apply(t, n);
  }
};
function Fg(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Ns(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = Bg, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var oi = "http://www.w3.org/1999/xhtml";
const Cs = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: oi,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Kr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Cs.hasOwnProperty(t) ? { space: Cs[t], local: e } : e;
}
function jg(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === oi && t.documentElement.namespaceURI === oi ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Yg(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function kl(e) {
  var t = Kr(e);
  return (t.local ? Yg : jg)(t);
}
function Gg() {
}
function zi(e) {
  return e == null ? Gg : function() {
    return this.querySelector(e);
  };
}
function Xg(e) {
  typeof e != "function" && (e = zi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Ae(r, this._parents);
}
function Ug(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function qg() {
  return [];
}
function El(e) {
  return e == null ? qg : function() {
    return this.querySelectorAll(e);
  };
}
function Kg(e) {
  return function() {
    return Ug(e.apply(this, arguments));
  };
}
function Zg(e) {
  typeof e == "function" ? e = Kg(e) : e = El(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new Ae(r, o);
}
function Sl(e) {
  return function() {
    return this.matches(e);
  };
}
function Nl(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Qg = Array.prototype.find;
function Jg(e) {
  return function() {
    return Qg.call(this.children, e);
  };
}
function em() {
  return this.firstElementChild;
}
function tm(e) {
  return this.select(e == null ? em : Jg(typeof e == "function" ? e : Nl(e)));
}
var nm = Array.prototype.filter;
function rm() {
  return Array.from(this.children);
}
function om(e) {
  return function() {
    return nm.call(this.children, e);
  };
}
function im(e) {
  return this.selectAll(e == null ? rm : om(typeof e == "function" ? e : Nl(e)));
}
function sm(e) {
  typeof e != "function" && (e = Sl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ae(r, this._parents);
}
function Cl(e) {
  return new Array(e.length);
}
function am() {
  return new Ae(this._enter || this._groups.map(Cl), this._parents);
}
function Tr(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Tr.prototype = {
  constructor: Tr,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function lm(e) {
  return function() {
    return e;
  };
}
function cm(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new Tr(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function dm(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, h = i.length, f = new Array(d), p;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (f[a] = p = s.call(l, l.__data__, a, t) + "", c.has(p) ? o[a] = l : c.set(p, l));
  for (a = 0; a < h; ++a)
    p = s.call(e, i[a], a, i) + "", (l = c.get(p)) ? (r[a] = l, l.__data__ = i[a], c.delete(p)) : n[a] = new Tr(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(f[a]) === l && (o[a] = l);
}
function um(e) {
  return e.__data__;
}
function fm(e, t) {
  if (!arguments.length) return Array.from(this, um);
  var n = t ? dm : cm, r = this._parents, o = this._groups;
  typeof e != "function" && (e = lm(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], h = o[c], f = h.length, p = hm(e.call(d, d && d.__data__, c, r)), g = p.length, b = a[c] = new Array(g), w = s[c] = new Array(g), m = l[c] = new Array(f);
    n(d, h, b, w, m, p, t);
    for (var x = 0, y = 0, v, S; x < g; ++x)
      if (v = b[x]) {
        for (x >= y && (y = x + 1); !(S = w[y]) && ++y < g; ) ;
        v._next = S || null;
      }
  }
  return s = new Ae(s, r), s._enter = a, s._exit = l, s;
}
function hm(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function pm() {
  return new Ae(this._exit || this._groups.map(Cl), this._parents);
}
function gm(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function mm(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], h = c.length, f = a[l] = new Array(h), p, g = 0; g < h; ++g)
      (p = c[g] || d[g]) && (f[g] = p);
  for (; l < o; ++l)
    a[l] = n[l];
  return new Ae(a, this._parents);
}
function ym() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function wm(e) {
  e || (e = bm);
  function t(h, f) {
    return h && f ? e(h.__data__, f.__data__) : !h - !f;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(t);
  }
  return new Ae(o, this._parents).order();
}
function bm(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function vm() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function xm() {
  return Array.from(this);
}
function _m() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function km() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Em() {
  return !this.node();
}
function Sm(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function Nm(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Cm(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Mm(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Im(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function $m(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Am(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Tm(e, t) {
  var n = Kr(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Cm : Nm : typeof t == "function" ? n.local ? Am : $m : n.local ? Im : Mm)(n, t));
}
function Ml(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function zm(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Lm(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Om(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function Pm(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? zm : typeof t == "function" ? Om : Lm)(e, t, n ?? "")) : Bt(this.node(), e);
}
function Bt(e, t) {
  return e.style.getPropertyValue(t) || Ml(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Dm(e) {
  return function() {
    delete this[e];
  };
}
function Rm(e, t) {
  return function() {
    this[e] = t;
  };
}
function Hm(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Wm(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Dm : typeof t == "function" ? Hm : Rm)(e, t)) : this.node()[e];
}
function Il(e) {
  return e.trim().split(/^|\s+/);
}
function Li(e) {
  return e.classList || new $l(e);
}
function $l(e) {
  this._node = e, this._names = Il(e.getAttribute("class") || "");
}
$l.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Al(e, t) {
  for (var n = Li(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function Tl(e, t) {
  for (var n = Li(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function Bm(e) {
  return function() {
    Al(this, e);
  };
}
function Vm(e) {
  return function() {
    Tl(this, e);
  };
}
function Fm(e, t) {
  return function() {
    (t.apply(this, arguments) ? Al : Tl)(this, e);
  };
}
function jm(e, t) {
  var n = Il(e + "");
  if (arguments.length < 2) {
    for (var r = Li(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Fm : t ? Bm : Vm)(n, t));
}
function Ym() {
  this.textContent = "";
}
function Gm(e) {
  return function() {
    this.textContent = e;
  };
}
function Xm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Um(e) {
  return arguments.length ? this.each(e == null ? Ym : (typeof e == "function" ? Xm : Gm)(e)) : this.node().textContent;
}
function qm() {
  this.innerHTML = "";
}
function Km(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Zm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Qm(e) {
  return arguments.length ? this.each(e == null ? qm : (typeof e == "function" ? Zm : Km)(e)) : this.node().innerHTML;
}
function Jm() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function ey() {
  return this.each(Jm);
}
function ty() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ny() {
  return this.each(ty);
}
function ry(e) {
  var t = typeof e == "function" ? e : kl(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function oy() {
  return null;
}
function iy(e, t) {
  var n = typeof e == "function" ? e : kl(e), r = t == null ? oy : typeof t == "function" ? t : zi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function sy() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function ay() {
  return this.each(sy);
}
function ly() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function cy() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function dy(e) {
  return this.select(e ? cy : ly);
}
function uy(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function fy(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function hy(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function py(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function gy(e, t, n) {
  return function() {
    var r = this.__on, o, i = fy(t);
    if (r) {
      for (var s = 0, a = r.length; s < a; ++s)
        if ((o = r[s]).type === e.type && o.name === e.name) {
          this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, o.listener = i, o.options = n), o.value = t;
          return;
        }
    }
    this.addEventListener(e.type, i, n), o = { type: e.type, name: e.name, value: t, listener: i, options: n }, r ? r.push(o) : this.__on = [o];
  };
}
function my(e, t, n) {
  var r = hy(e + ""), o, i = r.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, d; l < c; ++l)
        for (o = 0, d = a[l]; o < i; ++o)
          if ((s = r[o]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (a = t ? gy : py, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function zl(e, t, n) {
  var r = Ml(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function yy(e, t) {
  return function() {
    return zl(this, e, t);
  };
}
function wy(e, t) {
  return function() {
    return zl(this, e, t.apply(this, arguments));
  };
}
function by(e, t) {
  return this.each((typeof t == "function" ? wy : yy)(e, t));
}
function* vy() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Ll = [null];
function Ae(e, t) {
  this._groups = e, this._parents = t;
}
function Tn() {
  return new Ae([[document.documentElement]], Ll);
}
function xy() {
  return this;
}
Ae.prototype = Tn.prototype = {
  constructor: Ae,
  select: Xg,
  selectAll: Zg,
  selectChild: tm,
  selectChildren: im,
  filter: sm,
  data: fm,
  enter: am,
  exit: pm,
  join: gm,
  merge: mm,
  selection: xy,
  order: ym,
  sort: wm,
  call: vm,
  nodes: xm,
  node: _m,
  size: km,
  empty: Em,
  each: Sm,
  attr: Tm,
  style: Pm,
  property: Wm,
  classed: jm,
  text: Um,
  html: Qm,
  raise: ey,
  lower: ny,
  append: ry,
  insert: iy,
  remove: ay,
  clone: dy,
  datum: uy,
  on: my,
  dispatch: by,
  [Symbol.iterator]: vy
};
function Me(e) {
  return typeof e == "string" ? new Ae([[document.querySelector(e)]], [document.documentElement]) : new Ae([[e]], Ll);
}
function _y(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Re(e, t) {
  if (e = _y(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
    }
    if (t.getBoundingClientRect) {
      var o = t.getBoundingClientRect();
      return [e.clientX - o.left - t.clientLeft, e.clientY - o.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const ky = { passive: !1 }, xn = { capture: !0, passive: !1 };
function Bo(e) {
  e.stopImmediatePropagation();
}
function Ht(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ol(e) {
  var t = e.document.documentElement, n = Me(e).on("dragstart.drag", Ht, xn);
  "onselectstart" in t ? n.on("selectstart.drag", Ht, xn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Pl(e, t) {
  var n = e.document.documentElement, r = Me(e).on("dragstart.drag", null);
  t && (r.on("click.drag", Ht, xn), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const ar = (e) => () => e;
function ii(e, {
  sourceEvent: t,
  subject: n,
  target: r,
  identifier: o,
  active: i,
  x: s,
  y: a,
  dx: l,
  dy: c,
  dispatch: d
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: o, enumerable: !0, configurable: !0 },
    active: { value: i, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
ii.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Ey(e) {
  return !e.ctrlKey && !e.button;
}
function Sy() {
  return this.parentNode;
}
function Ny(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Cy() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Dl() {
  var e = Ey, t = Sy, n = Ny, r = Cy, o = {}, i = qr("start", "drag", "end"), s = 0, a, l, c, d, h = 0;
  function f(v) {
    v.on("mousedown.drag", p).filter(r).on("touchstart.drag", w).on("touchmove.drag", m, ky).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(v, S) {
    if (!(d || !e.call(this, v, S))) {
      var E = y(this, t.call(this, v, S), v, S, "mouse");
      E && (Me(v.view).on("mousemove.drag", g, xn).on("mouseup.drag", b, xn), Ol(v.view), Bo(v), c = !1, a = v.clientX, l = v.clientY, E("start", v));
    }
  }
  function g(v) {
    if (Ht(v), !c) {
      var S = v.clientX - a, E = v.clientY - l;
      c = S * S + E * E > h;
    }
    o.mouse("drag", v);
  }
  function b(v) {
    Me(v.view).on("mousemove.drag mouseup.drag", null), Pl(v.view, c), Ht(v), o.mouse("end", v);
  }
  function w(v, S) {
    if (e.call(this, v, S)) {
      var E = v.changedTouches, C = t.call(this, v, S), T = E.length, A, L;
      for (A = 0; A < T; ++A)
        (L = y(this, C, v, S, E[A].identifier, E[A])) && (Bo(v), L("start", v, E[A]));
    }
  }
  function m(v) {
    var S = v.changedTouches, E = S.length, C, T;
    for (C = 0; C < E; ++C)
      (T = o[S[C].identifier]) && (Ht(v), T("drag", v, S[C]));
  }
  function x(v) {
    var S = v.changedTouches, E = S.length, C, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), C = 0; C < E; ++C)
      (T = o[S[C].identifier]) && (Bo(v), T("end", v, S[C]));
  }
  function y(v, S, E, C, T, A) {
    var L = i.copy(), O = Re(A || E, S), B, H, _;
    if ((_ = n.call(v, new ii("beforestart", {
      sourceEvent: E,
      target: f,
      identifier: T,
      active: s,
      x: O[0],
      y: O[1],
      dx: 0,
      dy: 0,
      dispatch: L
    }), C)) != null)
      return B = _.x - O[0] || 0, H = _.y - O[1] || 0, function M(N, $, P) {
        var I = O, z;
        switch (N) {
          case "start":
            o[T] = M, z = s++;
            break;
          case "end":
            delete o[T], --s;
          case "drag":
            O = Re(P || $, S), z = s;
            break;
        }
        L.call(
          N,
          v,
          new ii(N, {
            sourceEvent: $,
            subject: _,
            target: f,
            identifier: T,
            active: z,
            x: O[0] + B,
            y: O[1] + H,
            dx: O[0] - I[0],
            dy: O[1] - I[1],
            dispatch: L
          }),
          C
        );
      };
  }
  return f.filter = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : ar(!!v), f) : e;
  }, f.container = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : ar(v), f) : t;
  }, f.subject = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : ar(v), f) : n;
  }, f.touchable = function(v) {
    return arguments.length ? (r = typeof v == "function" ? v : ar(!!v), f) : r;
  }, f.on = function() {
    var v = i.on.apply(i, arguments);
    return v === i ? f : v;
  }, f.clickDistance = function(v) {
    return arguments.length ? (h = (v = +v) * v, f) : Math.sqrt(h);
  }, f;
}
function Oi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Rl(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function zn() {
}
var _n = 0.7, zr = 1 / _n, Wt = "\\s*([+-]?\\d+)\\s*", kn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ke = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", My = /^#([0-9a-f]{3,8})$/, Iy = new RegExp(`^rgb\\(${Wt},${Wt},${Wt}\\)$`), $y = new RegExp(`^rgb\\(${Ke},${Ke},${Ke}\\)$`), Ay = new RegExp(`^rgba\\(${Wt},${Wt},${Wt},${kn}\\)$`), Ty = new RegExp(`^rgba\\(${Ke},${Ke},${Ke},${kn}\\)$`), zy = new RegExp(`^hsl\\(${kn},${Ke},${Ke}\\)$`), Ly = new RegExp(`^hsla\\(${kn},${Ke},${Ke},${kn}\\)$`), Ms = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Oi(zn, St, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Is,
  // Deprecated! Use color.formatHex.
  formatHex: Is,
  formatHex8: Oy,
  formatHsl: Py,
  formatRgb: $s,
  toString: $s
});
function Is() {
  return this.rgb().formatHex();
}
function Oy() {
  return this.rgb().formatHex8();
}
function Py() {
  return Hl(this).formatHsl();
}
function $s() {
  return this.rgb().formatRgb();
}
function St(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = My.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? As(t) : n === 3 ? new Ce(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? lr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? lr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Iy.exec(e)) ? new Ce(t[1], t[2], t[3], 1) : (t = $y.exec(e)) ? new Ce(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Ay.exec(e)) ? lr(t[1], t[2], t[3], t[4]) : (t = Ty.exec(e)) ? lr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = zy.exec(e)) ? Ls(t[1], t[2] / 100, t[3] / 100, 1) : (t = Ly.exec(e)) ? Ls(t[1], t[2] / 100, t[3] / 100, t[4]) : Ms.hasOwnProperty(e) ? As(Ms[e]) : e === "transparent" ? new Ce(NaN, NaN, NaN, 0) : null;
}
function As(e) {
  return new Ce(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function lr(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ce(e, t, n, r);
}
function Dy(e) {
  return e instanceof zn || (e = St(e)), e ? (e = e.rgb(), new Ce(e.r, e.g, e.b, e.opacity)) : new Ce();
}
function si(e, t, n, r) {
  return arguments.length === 1 ? Dy(e) : new Ce(e, t, n, r ?? 1);
}
function Ce(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Oi(Ce, si, Rl(zn, {
  brighter(e) {
    return e = e == null ? zr : Math.pow(zr, e), new Ce(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? _n : Math.pow(_n, e), new Ce(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ce(kt(this.r), kt(this.g), kt(this.b), Lr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ts,
  // Deprecated! Use color.formatHex.
  formatHex: Ts,
  formatHex8: Ry,
  formatRgb: zs,
  toString: zs
}));
function Ts() {
  return `#${_t(this.r)}${_t(this.g)}${_t(this.b)}`;
}
function Ry() {
  return `#${_t(this.r)}${_t(this.g)}${_t(this.b)}${_t((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function zs() {
  const e = Lr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${kt(this.r)}, ${kt(this.g)}, ${kt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Lr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function kt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function _t(e) {
  return e = kt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ls(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new He(e, t, n, r);
}
function Hl(e) {
  if (e instanceof He) return new He(e.h, e.s, e.l, e.opacity);
  if (e instanceof zn || (e = St(e)), !e) return new He();
  if (e instanceof He) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new He(s, a, l, e.opacity);
}
function Hy(e, t, n, r) {
  return arguments.length === 1 ? Hl(e) : new He(e, t, n, r ?? 1);
}
function He(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Oi(He, Hy, Rl(zn, {
  brighter(e) {
    return e = e == null ? zr : Math.pow(zr, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? _n : Math.pow(_n, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new Ce(
      Vo(e >= 240 ? e - 240 : e + 120, o, r),
      Vo(e, o, r),
      Vo(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new He(Os(this.h), cr(this.s), cr(this.l), Lr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Lr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Os(this.h)}, ${cr(this.s) * 100}%, ${cr(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Os(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function cr(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Vo(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Pi = (e) => () => e;
function Wy(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function By(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Vy(e) {
  return (e = +e) == 1 ? Wl : function(t, n) {
    return n - t ? By(t, n, e) : Pi(isNaN(t) ? n : t);
  };
}
function Wl(e, t) {
  var n = t - e;
  return n ? Wy(e, n) : Pi(isNaN(e) ? t : e);
}
const Or = function e(t) {
  var n = Vy(t);
  function r(o, i) {
    var s = n((o = si(o)).r, (i = si(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = Wl(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Fy(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function jy(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Yy(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = wn(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function Gy(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Ue(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Xy(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = wn(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var ai = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Fo = new RegExp(ai.source, "g");
function Uy(e) {
  return function() {
    return e;
  };
}
function qy(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Bl(e, t) {
  var n = ai.lastIndex = Fo.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = ai.exec(e)) && (o = Fo.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Ue(r, o) })), n = Fo.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? qy(l[0].x) : Uy(t) : (t = l.length, function(c) {
    for (var d = 0, h; d < t; ++d) a[(h = l[d]).i] = h.x(c);
    return a.join("");
  });
}
function wn(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Pi(t) : (n === "number" ? Ue : n === "string" ? (r = St(t)) ? (t = r, Or) : Bl : t instanceof St ? Or : t instanceof Date ? Gy : jy(t) ? Fy : Array.isArray(t) ? Yy : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Xy : Ue)(e, t);
}
var Ps = 180 / Math.PI, li = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Vl(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * Ps,
    skewX: Math.atan(l) * Ps,
    scaleX: s,
    scaleY: a
  };
}
var dr;
function Ky(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? li : Vl(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Zy(e) {
  return e == null || (dr || (dr = document.createElementNS("http://www.w3.org/2000/svg", "g")), dr.setAttribute("transform", e), !(e = dr.transform.baseVal.consolidate())) ? li : (e = e.matrix, Vl(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Fl(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, h, f, p, g) {
    if (c !== h || d !== f) {
      var b = p.push("translate(", null, t, null, n);
      g.push({ i: b - 4, x: Ue(c, h) }, { i: b - 2, x: Ue(d, f) });
    } else (h || f) && p.push("translate(" + h + t + f + n);
  }
  function s(c, d, h, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: h.push(o(h) + "rotate(", null, r) - 2, x: Ue(c, d) })) : d && h.push(o(h) + "rotate(" + d + r);
  }
  function a(c, d, h, f) {
    c !== d ? f.push({ i: h.push(o(h) + "skewX(", null, r) - 2, x: Ue(c, d) }) : d && h.push(o(h) + "skewX(" + d + r);
  }
  function l(c, d, h, f, p, g) {
    if (c !== h || d !== f) {
      var b = p.push(o(p) + "scale(", null, ",", null, ")");
      g.push({ i: b - 4, x: Ue(c, h) }, { i: b - 2, x: Ue(d, f) });
    } else (h !== 1 || f !== 1) && p.push(o(p) + "scale(" + h + "," + f + ")");
  }
  return function(c, d) {
    var h = [], f = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, h, f), s(c.rotate, d.rotate, h, f), a(c.skewX, d.skewX, h, f), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, h, f), c = d = null, function(p) {
      for (var g = -1, b = f.length, w; ++g < b; ) h[(w = f[g]).i] = w.x(p);
      return h.join("");
    };
  };
}
var Qy = Fl(Ky, "px, ", "px)", "deg)"), Jy = Fl(Zy, ", ", ")", ")"), e0 = 1e-12;
function Ds(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function t0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function n0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const _r = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], h = s[1], f = s[2], p = d - a, g = h - l, b = p * p + g * g, w, m;
    if (b < e0)
      m = Math.log(f / c) / t, w = function(C) {
        return [
          a + C * p,
          l + C * g,
          c * Math.exp(t * C * m)
        ];
      };
    else {
      var x = Math.sqrt(b), y = (f * f - c * c + r * b) / (2 * c * n * x), v = (f * f - c * c - r * b) / (2 * f * n * x), S = Math.log(Math.sqrt(y * y + 1) - y), E = Math.log(Math.sqrt(v * v + 1) - v);
      m = (E - S) / t, w = function(C) {
        var T = C * m, A = Ds(S), L = c / (n * x) * (A * n0(t * T + S) - t0(S));
        return [
          a + L * p,
          l + L * g,
          c * A / Ds(t * T + S)
        ];
      };
    }
    return w.duration = m * 1e3 * t / Math.SQRT2, w;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var Vt = 0, mn = 0, hn = 0, jl = 1e3, Pr, yn, Dr = 0, Nt = 0, Zr = 0, En = typeof performance == "object" && performance.now ? performance : Date, Yl = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Di() {
  return Nt || (Yl(r0), Nt = En.now() + Zr);
}
function r0() {
  Nt = 0;
}
function Rr() {
  this._call = this._time = this._next = null;
}
Rr.prototype = Gl.prototype = {
  constructor: Rr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Di() : +n) + (t == null ? 0 : +t), !this._next && yn !== this && (yn ? yn._next = this : Pr = this, yn = this), this._call = e, this._time = n, ci();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ci());
  }
};
function Gl(e, t, n) {
  var r = new Rr();
  return r.restart(e, t, n), r;
}
function o0() {
  Di(), ++Vt;
  for (var e = Pr, t; e; )
    (t = Nt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Vt;
}
function Rs() {
  Nt = (Dr = En.now()) + Zr, Vt = mn = 0;
  try {
    o0();
  } finally {
    Vt = 0, s0(), Nt = 0;
  }
}
function i0() {
  var e = En.now(), t = e - Dr;
  t > jl && (Zr -= t, Dr = e);
}
function s0() {
  for (var e, t = Pr, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Pr = n);
  yn = e, ci(r);
}
function ci(e) {
  if (!Vt) {
    mn && (mn = clearTimeout(mn));
    var t = e - Nt;
    t > 24 ? (e < 1 / 0 && (mn = setTimeout(Rs, e - En.now() - Zr)), hn && (hn = clearInterval(hn))) : (hn || (Dr = En.now(), hn = setInterval(i0, jl)), Vt = 1, Yl(Rs));
  }
}
function Hs(e, t, n) {
  var r = new Rr();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var a0 = qr("start", "end", "cancel", "interrupt"), l0 = [], Xl = 0, Ws = 1, di = 2, kr = 3, Bs = 4, ui = 5, Er = 6;
function Qr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  c0(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: a0,
    tween: l0,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: Xl
  });
}
function Ri(e, t) {
  var n = je(e, t);
  if (n.state > Xl) throw new Error("too late; already scheduled");
  return n;
}
function Ze(e, t) {
  var n = je(e, t);
  if (n.state > kr) throw new Error("too late; already running");
  return n;
}
function je(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function c0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = Gl(i, 0, n.time);
  function i(c) {
    n.state = Ws, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, h, f, p;
    if (n.state !== Ws) return l();
    for (d in r)
      if (p = r[d], p.name === n.name) {
        if (p.state === kr) return Hs(s);
        p.state === Bs ? (p.state = Er, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete r[d]) : +d < t && (p.state = Er, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete r[d]);
      }
    if (Hs(function() {
      n.state === kr && (n.state = Bs, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = di, n.on.call("start", e, e.__data__, n.index, n.group), n.state === di) {
      for (n.state = kr, o = new Array(f = n.tween.length), d = 0, h = -1; d < f; ++d)
        (p = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (o[++h] = p);
      o.length = h + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = ui, 1), h = -1, f = o.length; ++h < f; )
      o[h].call(e, d);
    n.state === ui && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Er, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function Sr(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > di && r.state < ui, r.state = Er, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function d0(e) {
  return this.each(function() {
    Sr(this, e);
  });
}
function u0(e, t) {
  var n, r;
  return function() {
    var o = Ze(this, e), i = o.tween;
    if (i !== n) {
      r = n = i;
      for (var s = 0, a = r.length; s < a; ++s)
        if (r[s].name === t) {
          r = r.slice(), r.splice(s, 1);
          break;
        }
    }
    o.tween = r;
  };
}
function f0(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = Ze(this, e), s = i.tween;
    if (s !== r) {
      o = (r = s).slice();
      for (var a = { name: t, value: n }, l = 0, c = o.length; l < c; ++l)
        if (o[l].name === t) {
          o[l] = a;
          break;
        }
      l === c && o.push(a);
    }
    i.tween = o;
  };
}
function h0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = je(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? u0 : f0)(n, e, t));
}
function Hi(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = Ze(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return je(o, r).value[t];
  };
}
function Ul(e, t) {
  var n;
  return (typeof t == "number" ? Ue : t instanceof St ? Or : (n = St(t)) ? (t = n, Or) : Bl)(e, t);
}
function p0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function g0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function m0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function y0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function w0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function b0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function v0(e, t) {
  var n = Kr(e), r = n === "transform" ? Jy : Ul;
  return this.attrTween(e, typeof t == "function" ? (n.local ? b0 : w0)(n, r, Hi(this, "attr." + e, t)) : t == null ? (n.local ? g0 : p0)(n) : (n.local ? y0 : m0)(n, r, t));
}
function x0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function _0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function k0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && _0(e, i)), n;
  }
  return o._value = t, o;
}
function E0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && x0(e, i)), n;
  }
  return o._value = t, o;
}
function S0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Kr(e);
  return this.tween(n, (r.local ? k0 : E0)(r, t));
}
function N0(e, t) {
  return function() {
    Ri(this, e).delay = +t.apply(this, arguments);
  };
}
function C0(e, t) {
  return t = +t, function() {
    Ri(this, e).delay = t;
  };
}
function M0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? N0 : C0)(t, e)) : je(this.node(), t).delay;
}
function I0(e, t) {
  return function() {
    Ze(this, e).duration = +t.apply(this, arguments);
  };
}
function $0(e, t) {
  return t = +t, function() {
    Ze(this, e).duration = t;
  };
}
function A0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? I0 : $0)(t, e)) : je(this.node(), t).duration;
}
function T0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ze(this, e).ease = t;
  };
}
function z0(e) {
  var t = this._id;
  return arguments.length ? this.each(T0(t, e)) : je(this.node(), t).ease;
}
function L0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ze(this, e).ease = n;
  };
}
function O0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(L0(this._id, e));
}
function P0(e) {
  typeof e != "function" && (e = Sl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new it(r, this._parents, this._name, this._id);
}
function D0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, h = s[a] = new Array(d), f, p = 0; p < d; ++p)
      (f = l[p] || c[p]) && (h[p] = f);
  for (; a < r; ++a)
    s[a] = t[a];
  return new it(s, this._parents, this._name, this._id);
}
function R0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function H0(e, t, n) {
  var r, o, i = R0(t) ? Ri : Ze;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function W0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(e) : this.each(H0(n, e, t));
}
function B0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function V0() {
  return this.on("end.remove", B0(this._id));
}
function F0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = zi(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, h, f = 0; f < l; ++f)
      (d = a[f]) && (h = e.call(d, d.__data__, f, a)) && ("__data__" in d && (h.__data__ = d.__data__), c[f] = h, Qr(c[f], t, n, f, c, je(d, n)));
  return new it(i, this._parents, t, n);
}
function j0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = El(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, h = 0; h < c; ++h)
      if (d = l[h]) {
        for (var f = e.call(d, d.__data__, h, l), p, g = je(d, n), b = 0, w = f.length; b < w; ++b)
          (p = f[b]) && Qr(p, t, n, b, f, g);
        i.push(f), s.push(d);
      }
  return new it(i, s, t, n);
}
var Y0 = Tn.prototype.constructor;
function G0() {
  return new Y0(this._groups, this._parents);
}
function X0(e, t) {
  var n, r, o;
  return function() {
    var i = Bt(this, e), s = (this.style.removeProperty(e), Bt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function ql(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function U0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = Bt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function q0(e, t, n) {
  var r, o, i;
  return function() {
    var s = Bt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Bt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function K0(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Ze(this, e), c = l.on, d = l.value[i] == null ? a || (a = ql(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function Z0(e, t, n) {
  var r = (e += "") == "transform" ? Qy : Ul;
  return t == null ? this.styleTween(e, X0(e, r)).on("end.style." + e, ql(e)) : typeof t == "function" ? this.styleTween(e, q0(e, r, Hi(this, "style." + e, t))).each(K0(this._id, e)) : this.styleTween(e, U0(e, r, t), n).on("end.style." + e, null);
}
function Q0(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function J0(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && Q0(e, s, n)), r;
  }
  return i._value = t, i;
}
function ew(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, J0(e, t, n ?? ""));
}
function tw(e) {
  return function() {
    this.textContent = e;
  };
}
function nw(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function rw(e) {
  return this.tween("text", typeof e == "function" ? nw(Hi(this, "text", e)) : tw(e == null ? "" : e + ""));
}
function ow(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function iw(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && ow(o)), t;
  }
  return r._value = e, r;
}
function sw(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, iw(e));
}
function aw() {
  for (var e = this._name, t = this._id, n = Kl(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = je(l, t);
        Qr(l, e, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new it(r, this._parents, e, n);
}
function lw() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = Ze(this, r), d = c.on;
      d !== e && (t = (e = d).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var cw = 0;
function it(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Kl() {
  return ++cw;
}
var tt = Tn.prototype;
it.prototype = {
  constructor: it,
  select: F0,
  selectAll: j0,
  selectChild: tt.selectChild,
  selectChildren: tt.selectChildren,
  filter: P0,
  merge: D0,
  selection: G0,
  transition: aw,
  call: tt.call,
  nodes: tt.nodes,
  node: tt.node,
  size: tt.size,
  empty: tt.empty,
  each: tt.each,
  on: W0,
  attr: v0,
  attrTween: S0,
  style: Z0,
  styleTween: ew,
  text: rw,
  textTween: sw,
  remove: V0,
  tween: h0,
  delay: M0,
  duration: A0,
  ease: z0,
  easeVarying: O0,
  end: lw,
  [Symbol.iterator]: tt[Symbol.iterator]
};
function dw(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var uw = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: dw
};
function fw(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function hw(e) {
  var t, n;
  e instanceof it ? (t = e._id, e = e._name) : (t = Kl(), (n = uw).time = Di(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Qr(l, e, t, c, s, n || fw(l, t));
  return new it(r, this._parents, e, t);
}
Tn.prototype.interrupt = d0;
Tn.prototype.transition = hw;
const ur = (e) => () => e;
function pw(e, {
  sourceEvent: t,
  target: n,
  transform: r,
  dispatch: o
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: o }
  });
}
function ot(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
ot.prototype = {
  constructor: ot,
  scale: function(e) {
    return e === 1 ? this : new ot(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new ot(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Jr = new ot(1, 0, 0);
Zl.prototype = ot.prototype;
function Zl(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Jr;
  return e.__zoom;
}
function jo(e) {
  e.stopImmediatePropagation();
}
function pn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function gw(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function mw() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Vs() {
  return this.__zoom || Jr;
}
function yw(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function ww() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function bw(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function Ql() {
  var e = gw, t = mw, n = bw, r = yw, o = ww, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = _r, c = qr("start", "zoom", "end"), d, h, f, p = 500, g = 150, b = 0, w = 10;
  function m(_) {
    _.property("__zoom", Vs).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", L).filter(o).on("touchstart.zoom", O).on("touchmove.zoom", B).on("touchend.zoom touchcancel.zoom", H).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(_, M, N, $) {
    var P = _.selection ? _.selection() : _;
    P.property("__zoom", Vs), _ !== P ? S(_, M, N, $) : P.interrupt().each(function() {
      E(this, arguments).event($).start().zoom(null, typeof M == "function" ? M.apply(this, arguments) : M).end();
    });
  }, m.scaleBy = function(_, M, N, $) {
    m.scaleTo(_, function() {
      var P = this.__zoom.k, I = typeof M == "function" ? M.apply(this, arguments) : M;
      return P * I;
    }, N, $);
  }, m.scaleTo = function(_, M, N, $) {
    m.transform(_, function() {
      var P = t.apply(this, arguments), I = this.__zoom, z = N == null ? v(P) : typeof N == "function" ? N.apply(this, arguments) : N, D = I.invert(z), V = typeof M == "function" ? M.apply(this, arguments) : M;
      return n(y(x(I, V), z, D), P, s);
    }, N, $);
  }, m.translateBy = function(_, M, N, $) {
    m.transform(_, function() {
      return n(this.__zoom.translate(
        typeof M == "function" ? M.apply(this, arguments) : M,
        typeof N == "function" ? N.apply(this, arguments) : N
      ), t.apply(this, arguments), s);
    }, null, $);
  }, m.translateTo = function(_, M, N, $, P) {
    m.transform(_, function() {
      var I = t.apply(this, arguments), z = this.__zoom, D = $ == null ? v(I) : typeof $ == "function" ? $.apply(this, arguments) : $;
      return n(Jr.translate(D[0], D[1]).scale(z.k).translate(
        typeof M == "function" ? -M.apply(this, arguments) : -M,
        typeof N == "function" ? -N.apply(this, arguments) : -N
      ), I, s);
    }, $, P);
  };
  function x(_, M) {
    return M = Math.max(i[0], Math.min(i[1], M)), M === _.k ? _ : new ot(M, _.x, _.y);
  }
  function y(_, M, N) {
    var $ = M[0] - N[0] * _.k, P = M[1] - N[1] * _.k;
    return $ === _.x && P === _.y ? _ : new ot(_.k, $, P);
  }
  function v(_) {
    return [(+_[0][0] + +_[1][0]) / 2, (+_[0][1] + +_[1][1]) / 2];
  }
  function S(_, M, N, $) {
    _.on("start.zoom", function() {
      E(this, arguments).event($).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event($).end();
    }).tween("zoom", function() {
      var P = this, I = arguments, z = E(P, I).event($), D = t.apply(P, I), V = N == null ? v(D) : typeof N == "function" ? N.apply(P, I) : N, j = Math.max(D[1][0] - D[0][0], D[1][1] - D[0][1]), G = P.__zoom, Y = typeof M == "function" ? M.apply(P, I) : M, ne = l(G.invert(V).concat(j / G.k), Y.invert(V).concat(j / Y.k));
      return function(Z) {
        if (Z === 1) Z = Y;
        else {
          var R = ne(Z), F = j / R[2];
          Z = new ot(F, V[0] - R[0] * F, V[1] - R[1] * F);
        }
        z.zoom(null, Z);
      };
    });
  }
  function E(_, M, N) {
    return !N && _.__zooming || new C(_, M);
  }
  function C(_, M) {
    this.that = _, this.args = M, this.active = 0, this.sourceEvent = null, this.extent = t.apply(_, M), this.taps = 0;
  }
  C.prototype = {
    event: function(_) {
      return _ && (this.sourceEvent = _), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(_, M) {
      return this.mouse && _ !== "mouse" && (this.mouse[1] = M.invert(this.mouse[0])), this.touch0 && _ !== "touch" && (this.touch0[1] = M.invert(this.touch0[0])), this.touch1 && _ !== "touch" && (this.touch1[1] = M.invert(this.touch1[0])), this.that.__zoom = M, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(_) {
      var M = Me(this.that).datum();
      c.call(
        _,
        this.that,
        new pw(_, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        M
      );
    }
  };
  function T(_, ...M) {
    if (!e.apply(this, arguments)) return;
    var N = E(this, M).event(_), $ = this.__zoom, P = Math.max(i[0], Math.min(i[1], $.k * Math.pow(2, r.apply(this, arguments)))), I = Re(_);
    if (N.wheel)
      (N.mouse[0][0] !== I[0] || N.mouse[0][1] !== I[1]) && (N.mouse[1] = $.invert(N.mouse[0] = I)), clearTimeout(N.wheel);
    else {
      if ($.k === P) return;
      N.mouse = [I, $.invert(I)], Sr(this), N.start();
    }
    pn(_), N.wheel = setTimeout(z, g), N.zoom("mouse", n(y(x($, P), N.mouse[0], N.mouse[1]), N.extent, s));
    function z() {
      N.wheel = null, N.end();
    }
  }
  function A(_, ...M) {
    if (f || !e.apply(this, arguments)) return;
    var N = _.currentTarget, $ = E(this, M, !0).event(_), P = Me(_.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", j, !0), I = Re(_, N), z = _.clientX, D = _.clientY;
    Ol(_.view), jo(_), $.mouse = [I, this.__zoom.invert(I)], Sr(this), $.start();
    function V(G) {
      if (pn(G), !$.moved) {
        var Y = G.clientX - z, ne = G.clientY - D;
        $.moved = Y * Y + ne * ne > b;
      }
      $.event(G).zoom("mouse", n(y($.that.__zoom, $.mouse[0] = Re(G, N), $.mouse[1]), $.extent, s));
    }
    function j(G) {
      P.on("mousemove.zoom mouseup.zoom", null), Pl(G.view, $.moved), pn(G), $.event(G).end();
    }
  }
  function L(_, ...M) {
    if (e.apply(this, arguments)) {
      var N = this.__zoom, $ = Re(_.changedTouches ? _.changedTouches[0] : _, this), P = N.invert($), I = N.k * (_.shiftKey ? 0.5 : 2), z = n(y(x(N, I), $, P), t.apply(this, M), s);
      pn(_), a > 0 ? Me(this).transition().duration(a).call(S, z, $, _) : Me(this).call(m.transform, z, $, _);
    }
  }
  function O(_, ...M) {
    if (e.apply(this, arguments)) {
      var N = _.touches, $ = N.length, P = E(this, M, _.changedTouches.length === $).event(_), I, z, D, V;
      for (jo(_), z = 0; z < $; ++z)
        D = N[z], V = Re(D, this), V = [V, this.__zoom.invert(V), D.identifier], P.touch0 ? !P.touch1 && P.touch0[2] !== V[2] && (P.touch1 = V, P.taps = 0) : (P.touch0 = V, I = !0, P.taps = 1 + !!d);
      d && (d = clearTimeout(d)), I && (P.taps < 2 && (h = V[0], d = setTimeout(function() {
        d = null;
      }, p)), Sr(this), P.start());
    }
  }
  function B(_, ...M) {
    if (this.__zooming) {
      var N = E(this, M).event(_), $ = _.changedTouches, P = $.length, I, z, D, V;
      for (pn(_), I = 0; I < P; ++I)
        z = $[I], D = Re(z, this), N.touch0 && N.touch0[2] === z.identifier ? N.touch0[0] = D : N.touch1 && N.touch1[2] === z.identifier && (N.touch1[0] = D);
      if (z = N.that.__zoom, N.touch1) {
        var j = N.touch0[0], G = N.touch0[1], Y = N.touch1[0], ne = N.touch1[1], Z = (Z = Y[0] - j[0]) * Z + (Z = Y[1] - j[1]) * Z, R = (R = ne[0] - G[0]) * R + (R = ne[1] - G[1]) * R;
        z = x(z, Math.sqrt(Z / R)), D = [(j[0] + Y[0]) / 2, (j[1] + Y[1]) / 2], V = [(G[0] + ne[0]) / 2, (G[1] + ne[1]) / 2];
      } else if (N.touch0) D = N.touch0[0], V = N.touch0[1];
      else return;
      N.zoom("touch", n(y(z, D, V), N.extent, s));
    }
  }
  function H(_, ...M) {
    if (this.__zooming) {
      var N = E(this, M).event(_), $ = _.changedTouches, P = $.length, I, z;
      for (jo(_), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, p), I = 0; I < P; ++I)
        z = $[I], N.touch0 && N.touch0[2] === z.identifier ? delete N.touch0 : N.touch1 && N.touch1[2] === z.identifier && delete N.touch1;
      if (N.touch1 && !N.touch0 && (N.touch0 = N.touch1, delete N.touch1), N.touch0) N.touch0[1] = this.__zoom.invert(N.touch0[0]);
      else if (N.end(), N.taps === 2 && (z = Re(z, this), Math.hypot(h[0] - z[0], h[1] - z[1]) < w)) {
        var D = Me(this).on("dblclick.zoom");
        D && D.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(_) {
    return arguments.length ? (r = typeof _ == "function" ? _ : ur(+_), m) : r;
  }, m.filter = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : ur(!!_), m) : e;
  }, m.touchable = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : ur(!!_), m) : o;
  }, m.extent = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : ur([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), m) : t;
  }, m.scaleExtent = function(_) {
    return arguments.length ? (i[0] = +_[0], i[1] = +_[1], m) : [i[0], i[1]];
  }, m.translateExtent = function(_) {
    return arguments.length ? (s[0][0] = +_[0][0], s[1][0] = +_[1][0], s[0][1] = +_[0][1], s[1][1] = +_[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(_) {
    return arguments.length ? (n = _, m) : n;
  }, m.duration = function(_) {
    return arguments.length ? (a = +_, m) : a;
  }, m.interpolate = function(_) {
    return arguments.length ? (l = _, m) : l;
  }, m.on = function() {
    var _ = c.on.apply(c, arguments);
    return _ === c ? m : _;
  }, m.clickDistance = function(_) {
    return arguments.length ? (b = (_ = +_) * _, m) : Math.sqrt(b);
  }, m.tapDistance = function(_) {
    return arguments.length ? (w = +_, m) : w;
  }, m;
}
const Ve = {
  error001: (e = "react") => `Seems like you have not used ${e === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: r }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : r}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (e) => `Edge with id "${e}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, Sn = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Jl = ["Enter", " ", "Escape"], ec = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var Ft;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Ft || (Ft = {}));
var Et;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Et || (Et = {}));
var Nn;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Nn || (Nn = {}));
const tc = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var ct;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(ct || (ct = {}));
var jt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(jt || (jt = {}));
var U;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(U || (U = {}));
const Fs = {
  [U.Left]: U.Right,
  [U.Right]: U.Left,
  [U.Top]: U.Bottom,
  [U.Bottom]: U.Top
}, nc = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, vw = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Wi = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Ln = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ye(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, xw = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Wi(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, eo(o, Hr(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? to(r) : { x: 0, y: 0, width: 0, height: 0 };
}, On = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = eo(n, Hr(o)), r = !0);
  }), r ? to(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Bi = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, h = [];
  for (const f of e.values()) {
    const { measured: p, selectable: g = !0, hidden: b = !1 } = f;
    if (s && !g || b)
      continue;
    const w = p.width ?? f.width ?? f.initialWidth ?? 0, m = p.height ?? f.height ?? f.initialHeight ?? 0, { x, y } = f.internals.positionAbsolute, v = sc(a, l, c, d, x, y, w, m), S = w * m, E = i && v > 0;
    (!f.internals.handleBounds || E || v >= S || f.dragging) && h.push(f);
  }
  return h;
}, _w = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function kw(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = Ye(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function Ew({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = kw(e, s), l = On(a), c = no(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function rc({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, d = s.origin ?? r;
  let h = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Ve.error005());
    else {
      const { width: p, height: g } = Ye(a);
      p && g && (h = [
        [l, c],
        [l + p, c + g]
      ]);
    }
  else a && Mt(s.extent) && (h = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const f = Mt(h) ? Ct(t, h, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Ve.error015())), {
    position: {
      x: f.x - l + (s.measured.width ?? 0) * d[0],
      y: f.y - c + (s.measured.height ?? 0) * d[1]
    },
    positionAbsolute: f
  };
}
async function Sw({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((f) => f.id)), s = [];
  for (const f of n) {
    if (f.deletable === !1)
      continue;
    const p = i.has(f.id), g = !p && f.parentId && s.find((b) => b.id === f.parentId);
    (p || g) && s.push(f);
  }
  const a = new Set(t.map((f) => f.id)), l = r.filter((f) => f.deletable !== !1), d = _w(s, l);
  for (const f of l)
    a.has(f.id) && !d.find((g) => g.id === f.id) && d.push(f);
  if (!o)
    return {
      edges: d,
      nodes: s
    };
  const h = await o({
    nodes: s,
    edges: d
  });
  return typeof h == "boolean" ? h ? { edges: d, nodes: s } : { edges: [], nodes: [] } : h;
}
const Yt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Ct = (e = { x: 0, y: 0 }, t, n) => ({
  x: Yt(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: Yt(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function oc(e, t, n) {
  const { width: r, height: o } = Ye(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Ct(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const js = (e, t, n) => e < t ? Yt(Math.abs(e - t), 1, t) / t : e > n ? -Yt(Math.abs(e - n), 1, t) / t : 0, Vi = (e, t, n = 15, r = 40) => {
  const o = js(e.x, r, t.width - r) * n, i = js(e.y, r, t.height - r) * n;
  return [o, i];
}, eo = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), fi = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), to = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), Cn = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Wi(e) ? e.internals.positionAbsolute : Ln(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Hr = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Wi(e) ? e.internals.positionAbsolute : Ln(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, ic = (e, t) => to(eo(fi(e), fi(t))), sc = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Wr = (e, t) => sc(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Ys = (e) => We(e.width) && We(e.height) && We(e.x) && We(e.y), We = (e) => !isNaN(e) && isFinite(e), ac = (e, t) => (n, r) => {
}, Pn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Dn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Pn(a, s) : a;
}, Gt = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function Pt(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Nw(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = Pt(e, n), o = Pt(e, t);
    return {
      top: r,
      right: o,
      bottom: r,
      left: o,
      x: o * 2,
      y: r * 2
    };
  }
  if (typeof e == "object") {
    const r = Pt(e.top ?? e.y ?? 0, n), o = Pt(e.bottom ?? e.y ?? 0, n), i = Pt(e.left ?? e.x ?? 0, t), s = Pt(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Cw(e, t, n, r, o, i) {
  const { x: s, y: a } = Gt(e, [t, n, r]), { x: l, y: c } = Gt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, h = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(h)
  };
}
const no = (e, t, n, r, o, i) => {
  const s = Nw(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = Yt(c, r, o), h = e.x + e.width / 2, f = e.y + e.height / 2, p = t / 2 - h * d, g = n / 2 - f * d, b = Cw(e, p, g, d, t, n), w = {
    left: Math.min(b.left - s.left, 0),
    top: Math.min(b.top - s.top, 0),
    right: Math.min(b.right - s.right, 0),
    bottom: Math.min(b.bottom - s.bottom, 0)
  };
  return {
    x: p - w.left + w.right,
    y: g - w.top + w.bottom,
    zoom: d
  };
}, Mn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Mt(e) {
  return e != null && e !== "parent";
}
function Ye(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function lc(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function cc(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Gs(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Mw() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function Iw(e) {
  return { ...ec, ...e || {} };
}
function dc(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function bn(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Be(e), a = Dn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Pn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const Fi = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), uc = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, $w = ["INPUT", "SELECT", "TEXTAREA"];
function fc(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : $w.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const hc = (e) => "clientX" in e, Be = (e, t) => {
  var i, s;
  const n = hc(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, Xs = (e, t, n, r, o) => {
  const i = t.querySelectorAll(`.${e}`);
  return !i || !i.length ? null : Array.from(i).map((s) => {
    const a = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: o,
      position: s.getAttribute("data-handlepos"),
      x: (a.left - n.left) / r,
      y: (a.top - n.top) / r,
      ...Fi(s)
    };
  });
};
function pc({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), h = Math.abs(c - t);
  return [l, c, d, h];
}
function fr(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Us({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case U.Left:
      return [t - fr(t - r, i), n];
    case U.Right:
      return [t + fr(r - t, i), n];
    case U.Top:
      return [t, n - fr(n - o, i)];
    case U.Bottom:
      return [t, n + fr(o - n, i)];
  }
}
function gc({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, curvature: s = 0.25 }) {
  const [a, l] = Us({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = Us({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [h, f, p, g] = pc({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: o,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: c,
    targetControlY: d
  });
  return [
    `M${e},${t} C${a},${l} ${c},${d} ${r},${o}`,
    h,
    f,
    p,
    g
  ];
}
function mc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function Aw({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function Tw({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = eo(Hr(e), Hr(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return Wr(s, to(i)) > 0;
}
const zw = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Lw = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Ow = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Ve.error006()), t;
  const r = n.getEdgeId || zw;
  let o;
  return nc(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, Lw(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function yc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = mc({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const qs = {
  [U.Left]: { x: -1, y: 0 },
  [U.Right]: { x: 1, y: 0 },
  [U.Top]: { x: 0, y: -1 },
  [U.Bottom]: { x: 0, y: 1 }
}, Pw = ({ source: e, sourcePosition: t = U.Bottom, target: n }) => t === U.Left || t === U.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Ks = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Dw({ source: e, sourcePosition: t = U.Bottom, target: n, targetPosition: r = U.Top, center: o, offset: i, stepPosition: s }) {
  const a = qs[t], l = qs[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, h = Pw({
    source: c,
    sourcePosition: t,
    target: d
  }), f = h.x !== 0 ? "x" : "y", p = h[f];
  let g = [], b, w;
  const m = { x: 0, y: 0 }, x = { x: 0, y: 0 }, [, , y, v] = mc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[f] * l[f] === -1) {
    f === "x" ? (b = o.x ?? c.x + (d.x - c.x) * s, w = o.y ?? (c.y + d.y) / 2) : (b = o.x ?? (c.x + d.x) / 2, w = o.y ?? c.y + (d.y - c.y) * s);
    const T = [
      { x: b, y: c.y },
      { x: b, y: d.y }
    ], A = [
      { x: c.x, y: w },
      { x: d.x, y: w }
    ];
    a[f] === p ? g = f === "x" ? T : A : g = f === "x" ? A : T;
  } else {
    const T = [{ x: c.x, y: d.y }], A = [{ x: d.x, y: c.y }];
    if (f === "x" ? g = a.x === p ? A : T : g = a.y === p ? T : A, t === r) {
      const _ = Math.abs(e[f] - n[f]);
      if (_ <= i) {
        const M = Math.min(i - 1, i - _);
        a[f] === p ? m[f] = (c[f] > e[f] ? -1 : 1) * M : x[f] = (d[f] > n[f] ? -1 : 1) * M;
      }
    }
    if (t !== r) {
      const _ = f === "x" ? "y" : "x", M = a[f] === l[_], N = c[_] > d[_], $ = c[_] < d[_];
      (a[f] === 1 && (!M && N || M && $) || a[f] !== 1 && (!M && $ || M && N)) && (g = f === "x" ? T : A);
    }
    const L = { x: c.x + m.x, y: c.y + m.y }, O = { x: d.x + x.x, y: d.y + x.y }, B = Math.max(Math.abs(L.x - g[0].x), Math.abs(O.x - g[0].x)), H = Math.max(Math.abs(L.y - g[0].y), Math.abs(O.y - g[0].y));
    B >= H ? (b = (L.x + O.x) / 2, w = g[0].y) : (b = g[0].x, w = (L.y + O.y) / 2);
  }
  const S = { x: c.x + m.x, y: c.y + m.y }, E = { x: d.x + x.x, y: d.y + x.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...S.x !== g[0].x || S.y !== g[0].y ? [S] : [],
    ...g,
    ...E.x !== g[g.length - 1].x || E.y !== g[g.length - 1].y ? [E] : [],
    n
  ], b, w, y, v];
}
function Rw(e, t, n, r) {
  const o = Math.min(Ks(e, t) / 2, Ks(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * d}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function hi({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: d = 0.5 }) {
  const [h, f, p, g, b] = Dw({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: d
  });
  let w = `M${h[0].x} ${h[0].y}`;
  for (let m = 1; m < h.length - 1; m++)
    w += Rw(h[m - 1], h[m], h[m + 1], s);
  return w += `L${h[h.length - 1].x} ${h[h.length - 1].y}`, [w, f, p, g, b];
}
function Zs(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Hw(e) {
  var h;
  const { sourceNode: t, targetNode: n } = e;
  if (!Zs(t) || !Zs(n))
    return null;
  const r = t.internals.handleBounds || Qs(t.handles), o = n.internals.handleBounds || Qs(n.handles), i = Js((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = Js(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Ft.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (h = e.onError) == null || h.call(e, "008", Ve.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || U.Bottom, l = (s == null ? void 0 : s.position) || U.Top, c = It(t, i, a), d = It(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: d.x,
    targetY: d.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function Qs(e) {
  if (!e)
    return null;
  const t = [], n = [];
  for (const r of e)
    r.width = r.width ?? 1, r.height = r.height ?? 1, r.type === "source" ? t.push(r) : r.type === "target" && n.push(r);
  return {
    source: t,
    target: n
  };
}
function It(e, t, n = U.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ye(e);
  if (r)
    return { x: o + s / 2, y: i + a / 2 };
  switch ((t == null ? void 0 : t.position) ?? n) {
    case U.Top:
      return { x: o + s / 2, y: i };
    case U.Right:
      return { x: o + s, y: i + a / 2 };
    case U.Bottom:
      return { x: o + s / 2, y: i + a };
    case U.Left:
      return { x: o, y: i + a / 2 };
  }
}
function Js(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function pi(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function Ww(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = pi(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const wc = 1e3, Bw = 10, ji = {
  nodeOrigin: [0, 0],
  nodeExtent: Sn,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Vw = {
  ...ji,
  checkEquality: !0
};
function Yi(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function Fw(e, t, n) {
  const r = Yi(ji, n);
  for (const o of e.values())
    if (o.parentId)
      Xi(o, e, t, r);
    else {
      const i = Ln(o, r.nodeOrigin), s = Mt(o.extent) ? o.extent : r.nodeExtent, a = Ct(i, s, Ye(o));
      o.internals.positionAbsolute = a;
    }
}
function jw(e, t) {
  if (!e.handles)
    return e.measured ? t == null ? void 0 : t.internals.handleBounds : void 0;
  const n = [], r = [];
  for (const o of e.handles) {
    const i = {
      id: o.id,
      width: o.width ?? 1,
      height: o.height ?? 1,
      nodeId: e.id,
      x: o.x,
      y: o.y,
      position: o.position,
      type: o.type
    };
    o.type === "source" ? n.push(i) : o.type === "target" && r.push(i);
  }
  return {
    source: n,
    target: r
  };
}
function Gi(e) {
  return e === "manual";
}
function gi(e, t, n, r = {}) {
  var d, h;
  const o = Yi(Vw, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !Gi(o.zIndexMode) ? wc : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const f of e) {
    let p = s.get(f.id);
    if (o.checkEquality && f === (p == null ? void 0 : p.internals.userNode))
      t.set(f.id, p);
    else {
      const g = Ln(f, o.nodeOrigin), b = Mt(f.extent) ? f.extent : o.nodeExtent, w = Ct(g, b, Ye(f));
      p = {
        ...o.defaults,
        ...f,
        measured: {
          width: (d = f.measured) == null ? void 0 : d.width,
          height: (h = f.measured) == null ? void 0 : h.height
        },
        internals: {
          positionAbsolute: w,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: jw(f, p),
          z: bc(f, a, o.zIndexMode),
          userNode: f
        }
      }, t.set(f.id, p);
    }
    (p.measured === void 0 || p.measured.width === void 0 || p.measured.height === void 0) && !p.hidden && (l = !1), f.parentId && Xi(p, t, n, r, i), c || (c = f.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Yw(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Xi(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Yi(ji, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Yw(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * Bw), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const h = i && !Gi(l) ? wc : 0, { x: f, y: p, z: g } = Gw(e, d, s, a, h, l), { positionAbsolute: b } = e.internals, w = f !== b.x || p !== b.y;
  (w || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: w ? { x: f, y: p } : b,
      z: g
    }
  });
}
function bc(e, t, n) {
  const r = We(e.zIndex) ? e.zIndex : 0;
  return Gi(n) ? r : r + (e.selected ? t : 0);
}
function Gw(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ye(e), c = Ln(e, n), d = Mt(e.extent) ? Ct(c, e.extent, l) : c;
  let h = Ct({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (h = oc(h, l, t));
  const f = bc(e, o, i), p = t.internals.z ?? 0;
  return {
    x: h.x,
    y: h.y,
    z: p >= f ? p + 1 : f
  };
}
function Ui(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? Cn(l), d = ic(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var y;
    const d = l.internals.positionAbsolute, h = Ye(l), f = l.origin ?? r, p = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, b = Math.max(h.width, Math.round(a.width)), w = Math.max(h.height, Math.round(a.height)), m = (b - h.width) * f[0], x = (w - h.height) * f[1];
    (p > 0 || g > 0 || m || x) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - p + m,
        y: l.position.y - g + x
      }
    }), (y = n.get(c)) == null || y.forEach((v) => {
      e.some((S) => S.id === v.id) || o.push({
        id: v.id,
        type: "position",
        position: {
          x: v.position.x + p,
          y: v.position.y + g
        }
      });
    })), (h.width < a.width || h.height < a.height || p || g) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: b + (p ? f[0] * p - m : 0),
        height: w + (g ? f[1] * g - x : 0)
      }
    });
  }), o;
}
function Xw(e, t, n, r, o, i, s) {
  const a = r == null ? void 0 : r.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], d = window.getComputedStyle(a), { m22: h } = new window.DOMMatrixReadOnly(d.transform), f = [];
  for (const p of e.values()) {
    const g = t.get(p.id);
    if (!g)
      continue;
    if (g.hidden) {
      t.set(g.id, {
        ...g,
        internals: {
          ...g.internals,
          handleBounds: void 0
        }
      }), l = !0;
      continue;
    }
    const b = Fi(p.nodeElement), w = g.measured.width !== b.width || g.measured.height !== b.height;
    if (!!(b.width && b.height && (w || !g.internals.handleBounds || p.force))) {
      const x = p.nodeElement.getBoundingClientRect(), y = Mt(g.extent) ? g.extent : i;
      let { positionAbsolute: v } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const E = t.get(g.parentId);
        E && (v = oc(v, b, E));
      } else y && (v = Ct(v, y, b));
      const S = {
        ...g,
        measured: b,
        internals: {
          ...g.internals,
          positionAbsolute: v,
          handleBounds: {
            source: Xs("source", p.nodeElement, x, h, g.id),
            target: Xs("target", p.nodeElement, x, h, g.id)
          }
        }
      };
      t.set(g.id, S), g.parentId && Xi(S, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, w && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: b
      }), g.expandParent && g.parentId && f.push({
        id: g.id,
        parentId: g.parentId,
        rect: Cn(S, o)
      }));
    }
  }
  if (f.length > 0) {
    const p = Ui(f, t, n, o);
    c.push(...p);
  }
  return { changes: c, updatedInternals: l };
}
async function Uw({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
  if (!t || !e.x && !e.y)
    return !1;
  const s = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [o, i]
  ], r);
  return !!s && (s.x !== n[0] || s.y !== n[1] || s.k !== n[2]);
}
function ea(e, t, n, r, o, i) {
  let s = o;
  const a = r.get(s) || /* @__PURE__ */ new Map();
  r.set(s, a.set(n, t)), s = `${o}-${e}`;
  const l = r.get(s) || /* @__PURE__ */ new Map();
  if (r.set(s, l.set(n, t)), i) {
    s = `${o}-${e}-${i}`;
    const c = r.get(s) || /* @__PURE__ */ new Map();
    r.set(s, c.set(n, t));
  }
}
function vc(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    ea("source", l, d, e, o, s), ea("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function xc(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : xc(n, t) : !1;
}
function ta(e, t, n) {
  var o;
  let r = e;
  do {
    if ((o = r == null ? void 0 : r.matches) != null && o.call(r, t))
      return !0;
    if (r === n)
      return !1;
    r = r == null ? void 0 : r.parentElement;
  } while (r);
  return !1;
}
function qw(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !xc(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
      const a = e.get(i);
      a && o.set(i, {
        id: i,
        position: a.position || { x: 0, y: 0 },
        distance: {
          x: n.x - a.internals.positionAbsolute.x,
          y: n.y - a.internals.positionAbsolute.y
        },
        extent: a.extent,
        parentId: a.parentId,
        origin: a.origin,
        expandParent: a.expandParent,
        internals: {
          positionAbsolute: a.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: a.measured.width ?? 0,
          height: a.measured.height ?? 0
        }
      });
    }
  return o;
}
function Yo({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
  var s, a, l;
  const o = [];
  for (const [c, d] of t) {
    const h = (s = n.get(c)) == null ? void 0 : s.internals.userNode;
    h && o.push({
      ...h,
      position: d.position,
      dragging: r
    });
  }
  if (!e)
    return [o[0], o];
  const i = (a = n.get(e)) == null ? void 0 : a.internals.userNode;
  return [
    i ? {
      ...i,
      position: ((l = t.get(e)) == null ? void 0 : l.position) || i.position,
      dragging: r
    } : o[0],
    o
  ];
}
function Kw({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Pn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function Zw({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, h = !1, f = null, p = !1, g = !1, b = null;
  function w({ noDragClassName: x, handleSelector: y, domNode: v, isSelectable: S, nodeId: E, nodeClickDistance: C = 0 }) {
    f = Me(v);
    function T({ x: B, y: H }) {
      const { nodeLookup: _, nodeExtent: M, snapGrid: N, snapToGrid: $, nodeOrigin: P, onNodeDrag: I, onSelectionDrag: z, onError: D, updateNodePositions: V } = t();
      i = { x: B, y: H };
      let j = !1;
      const G = a.size > 1, Y = G && M ? fi(On(a)) : null, ne = G && $ ? Kw({
        dragItems: a,
        snapGrid: N,
        x: B,
        y: H
      }) : null;
      for (const [Z, R] of a) {
        if (!_.has(Z))
          continue;
        let F = { x: B - R.distance.x, y: H - R.distance.y };
        $ && (F = ne ? {
          x: Math.round(F.x + ne.x),
          y: Math.round(F.y + ne.y)
        } : Pn(F, N));
        let q = null;
        if (G && M && !R.extent && Y) {
          const { positionAbsolute: ee } = R.internals, te = ee.x - Y.x + M[0][0], re = ee.x + R.measured.width - Y.x2 + M[1][0], ie = ee.y - Y.y + M[0][1], ce = ee.y + R.measured.height - Y.y2 + M[1][1];
          q = [
            [te, ie],
            [re, ce]
          ];
        }
        const { position: J, positionAbsolute: K } = rc({
          nodeId: Z,
          nextPosition: F,
          nodeLookup: _,
          nodeExtent: q || M,
          nodeOrigin: P,
          onError: D
        });
        j = j || R.position.x !== J.x || R.position.y !== J.y, R.position = J, R.internals.positionAbsolute = K;
      }
      if (g = g || j, !!j && (V(a, !0), b && (r || I || !E && z))) {
        const [Z, R] = Yo({
          nodeId: E,
          dragItems: a,
          nodeLookup: _
        });
        r == null || r(b, a, Z, R), I == null || I(b, Z, R), E || z == null || z(b, R);
      }
    }
    async function A() {
      if (!d)
        return;
      const { transform: B, panBy: H, autoPanSpeed: _, autoPanOnNodeDrag: M } = t();
      if (!M) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [N, $] = Vi(c, d, _);
      (N !== 0 || $ !== 0) && (i.x = (i.x ?? 0) - N / B[2], i.y = (i.y ?? 0) - $ / B[2], await H({ x: N, y: $ }) && T(i)), s = requestAnimationFrame(A);
    }
    function L(B) {
      var G;
      const { nodeLookup: H, multiSelectionActive: _, nodesDraggable: M, transform: N, snapGrid: $, snapToGrid: P, selectNodesOnDrag: I, onNodeDragStart: z, onSelectionDragStart: D, unselectNodesAndEdges: V } = t();
      h = !0, (!I || !S) && !_ && E && ((G = H.get(E)) != null && G.selected || V()), S && I && E && (e == null || e(E));
      const j = bn(B.sourceEvent, { transform: N, snapGrid: $, snapToGrid: P, containerBounds: d });
      if (i = j, a = qw(H, M, j, E), a.size > 0 && (n || z || !E && D)) {
        const [Y, ne] = Yo({
          nodeId: E,
          dragItems: a,
          nodeLookup: H
        });
        n == null || n(B.sourceEvent, a, Y, ne), z == null || z(B.sourceEvent, Y, ne), E || D == null || D(B.sourceEvent, ne);
      }
    }
    const O = Dl().clickDistance(C).on("start", (B) => {
      const { domNode: H, nodeDragThreshold: _, transform: M, snapGrid: N, snapToGrid: $ } = t();
      d = (H == null ? void 0 : H.getBoundingClientRect()) || null, p = !1, g = !1, b = B.sourceEvent, _ === 0 && L(B), i = bn(B.sourceEvent, { transform: M, snapGrid: N, snapToGrid: $, containerBounds: d }), c = Be(B.sourceEvent, d);
    }).on("drag", (B) => {
      const { autoPanOnNodeDrag: H, transform: _, snapGrid: M, snapToGrid: N, nodeDragThreshold: $, nodeLookup: P } = t(), I = bn(B.sourceEvent, { transform: _, snapGrid: M, snapToGrid: N, containerBounds: d });
      if (b = B.sourceEvent, (B.sourceEvent.type === "touchmove" && B.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      E && !P.has(E)) && (p = !0), !p) {
        if (!l && H && h && (l = !0, A()), !h) {
          const z = Be(B.sourceEvent, d), D = z.x - c.x, V = z.y - c.y;
          Math.sqrt(D * D + V * V) > $ && L(B);
        }
        (i.x !== I.xSnapped || i.y !== I.ySnapped) && a && h && (c = Be(B.sourceEvent, d), T(I));
      }
    }).on("end", (B) => {
      if (!h || p) {
        p && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, h = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: H, updateNodePositions: _, onNodeDragStop: M, onSelectionDragStop: N } = t();
        if (g && (_(a, !1), g = !1), o || M || !E && N) {
          const [$, P] = Yo({
            nodeId: E,
            dragItems: a,
            nodeLookup: H,
            dragging: !1
          });
          o == null || o(B.sourceEvent, a, $, P), M == null || M(B.sourceEvent, $, P), E || N == null || N(B.sourceEvent, P);
        }
      }
    }).filter((B) => {
      const H = B.target;
      return !B.button && (!x || !ta(H, `.${x}`, v)) && (!y || ta(H, y, v));
    });
    f.call(O);
  }
  function m() {
    f == null || f.on(".drag", null);
  }
  return {
    update: w,
    destroy: m
  };
}
function Qw(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Wr(o, Cn(i)) > 0 && r.push(i);
  return r;
}
const Jw = 250;
function eb(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = Qw(e, n, t + Jw);
  for (const c of s) {
    const d = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const h of d) {
      if (r.nodeId === h.nodeId && r.type === h.type && r.id === h.id)
        continue;
      const { x: f, y: p } = It(c, h, h.position, !0), g = Math.sqrt(Math.pow(f - e.x, 2) + Math.pow(p - e.y, 2));
      g > t || (g < i ? (o = [{ ...h, x: f, y: p }], i = g) : g === i && o.push({ ...h, x: f, y: p }));
    }
  }
  if (!o.length)
    return null;
  if (o.length > 1) {
    const c = r.type === "source" ? "target" : "source";
    return o.find((d) => d.type === c) ?? o[0];
  }
  return o[0];
}
function _c(e, t, n, r, o, i = !1) {
  var c, d, h;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((h = s.internals.handleBounds) == null ? void 0 : h.target) ?? []], l = (n ? a == null ? void 0 : a.find((f) => f.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...It(s, l, l.position, !0) } : l;
}
function kc(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function tb(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Ec = () => !0;
function nb(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: h, panBy: f, cancelConnection: p, onConnectStart: g, onConnect: b, onConnectEnd: w, isValidConnection: m = Ec, onReconnectEnd: x, updateConnection: y, getTransform: v, getFromHandle: S, autoPanSpeed: E, dragThreshold: C = 1, handleDomNode: T }) {
  const A = uc(e.target);
  let L = 0, O;
  const { x: B, y: H } = Be(e), _ = kc(i, T), M = a == null ? void 0 : a.getBoundingClientRect();
  let N = !1;
  if (!M || !_)
    return;
  const $ = _c(o, _, r, l, t);
  if (!$)
    return;
  let P = Be(e, M), I = !1, z = null, D = !1, V = null;
  function j() {
    if (!d || !M)
      return;
    const [J, K] = Vi(P, M, E);
    f({ x: J, y: K }), L = requestAnimationFrame(j);
  }
  const G = {
    ...$,
    nodeId: o,
    type: _,
    position: $.position
  }, Y = l.get(o);
  let Z = {
    inProgress: !0,
    isValid: null,
    from: It(Y, G, U.Left, !0),
    fromHandle: G,
    fromPosition: G.position,
    fromNode: Y,
    to: P,
    toHandle: null,
    toPosition: Fs[G.position],
    toNode: null,
    pointer: P
  };
  function R() {
    N = !0, y(Z), g == null || g(e, { nodeId: o, handleId: r, handleType: _ });
  }
  C === 0 && R();
  function F(J) {
    if (!N) {
      const { x: ce, y: ke } = Be(J), Ee = ce - B, Te = ke - H;
      if (!(Ee * Ee + Te * Te > C * C))
        return;
      R();
    }
    if (!S() || !G) {
      q(J);
      return;
    }
    const K = v();
    P = Be(J, M), O = eb(Dn(P, K, !1, [1, 1]), n, l, G), I || (j(), I = !0);
    const ee = Sc(J, {
      handle: O,
      connectionMode: t,
      fromNodeId: o,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: A,
      lib: c,
      flowId: h,
      nodeLookup: l
    });
    V = ee.handleDomNode, z = ee.connection, D = tb(!!O, ee.isValid);
    const te = l.get(o), re = te ? It(te, G, U.Left, !0) : Z.from, ie = {
      ...Z,
      from: re,
      isValid: D,
      to: ee.toHandle && D ? Gt({ x: ee.toHandle.x, y: ee.toHandle.y }, K) : P,
      toHandle: ee.toHandle,
      toPosition: D && ee.toHandle ? ee.toHandle.position : Fs[G.position],
      toNode: ee.toHandle ? l.get(ee.toHandle.nodeId) : null,
      pointer: P
    };
    y(ie), Z = ie;
  }
  function q(J) {
    if (!("touches" in J && J.touches.length > 0)) {
      if (N) {
        (O || V) && z && D && (b == null || b(z));
        const { inProgress: K, ...ee } = Z, te = {
          ...ee,
          toPosition: Z.toHandle ? Z.toPosition : null
        };
        w == null || w(J, te), i && (x == null || x(J, te));
      }
      p(), cancelAnimationFrame(L), I = !1, D = !1, z = null, V = null, A.removeEventListener("mousemove", F), A.removeEventListener("mouseup", q), A.removeEventListener("touchmove", F), A.removeEventListener("touchend", q);
    }
  }
  A.addEventListener("mousemove", F), A.addEventListener("mouseup", q), A.addEventListener("touchmove", F), A.addEventListener("touchend", q);
}
function Sc(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Ec, nodeLookup: d }) {
  const h = i === "target", f = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: p, y: g } = Be(e), b = s.elementFromPoint(p, g), w = b != null && b.classList.contains(`${a}-flow__handle`) ? b : f, m = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const x = kc(void 0, w), y = w.getAttribute("data-nodeid"), v = w.getAttribute("data-handleid"), S = w.classList.contains("connectable"), E = w.classList.contains("connectableend");
    if (!y || !x)
      return m;
    const C = {
      source: h ? y : r,
      sourceHandle: h ? v : o,
      target: h ? r : y,
      targetHandle: h ? o : v
    };
    m.connection = C;
    const A = S && E && (n === Ft.Strict ? h && x === "source" || !h && x === "target" : y !== r || v !== o);
    m.isValid = A && c(C), m.toHandle = _c(y, x, v, d, n, !0);
  }
  return m;
}
const mi = {
  onPointerDown: nb,
  isValid: Sc
};
function rb({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Me(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: h = !0, zoomable: f = !0, inversePan: p = !1 }) {
    const g = (y) => {
      if (y.sourceEvent.type !== "wheel" || !t)
        return;
      const v = n(), S = y.sourceEvent.ctrlKey && Mn() ? 10 : 1, E = -y.sourceEvent.deltaY * (y.sourceEvent.deltaMode === 1 ? 0.05 : y.sourceEvent.deltaMode ? 1 : 2e-3) * d, C = v[2] * Math.pow(2, E * S);
      t.scaleTo(C);
    };
    let b = [0, 0];
    const w = (y) => {
      (y.sourceEvent.type === "mousedown" || y.sourceEvent.type === "touchstart") && (b = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ]);
    }, m = (y) => {
      const v = n();
      if (y.sourceEvent.type !== "mousemove" && y.sourceEvent.type !== "touchmove" || !t)
        return;
      const S = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ], E = [S[0] - b[0], S[1] - b[1]];
      b = S;
      const C = r() * Math.max(v[2], Math.log(v[2])) * (p ? -1 : 1), T = {
        x: v[0] - E[0] * C,
        y: v[1] - E[1] * C
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: T.x,
        y: T.y,
        zoom: v[2]
      }, A, a);
    }, x = Ql().on("start", w).on("zoom", h ? m : null).on("zoom.wheel", f ? g : null);
    o.call(x, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: Re
  };
}
const ro = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Go = ({ x: e, y: t, zoom: n }) => Jr.translate(e, t).scale(n), lt = (e, t) => e.target.closest(`.${t}`), Nc = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), ob = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Xo = (e, t = 0, n = ob, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Cc = (e) => {
  const t = e.ctrlKey && Mn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function ib({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (lt(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const h = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const w = Re(d), m = Cc(d), x = h * Math.pow(2, m);
      r.scaleTo(n, x, w, d);
      return;
    }
    const f = d.deltaMode === 1 ? 20 : 1;
    let p = o === Et.Vertical ? 0 : d.deltaX * f, g = o === Et.Horizontal ? 0 : d.deltaY * f;
    !Mn() && d.shiftKey && o !== Et.Vertical && (p = d.deltaY * f, g = 0), r.translateBy(
      n,
      -(p / h) * i,
      -(g / h) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const b = ro(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, b) : (e.isPanScrolling = !0, a == null || a(d, b)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, b), e.isPanScrolling = !1;
    }, 150);
  };
}
function sb({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = lt(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function ab({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = ro(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function lb({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Nc(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, ro(i.transform)));
  };
}
function cb({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Nc(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = ro(s.transform);
      e.prevViewport = l, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          o == null || o(s.sourceEvent, l);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function db({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: h }) {
  return (f) => {
    var m;
    const p = t || n, g = r && f.ctrlKey, b = f.type === "wheel";
    if (f.button === 1 && f.type === "mousedown" && (lt(f, `${d}-flow__node`) || lt(f, `${d}-flow__edge`) || lt(f, `${d}-flow__selection`) || lt(f, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !p && !i && !s && !r || a || h && !b || lt(f, l) && b || lt(f, c) && (!b || i && b && !t) || !r && f.ctrlKey && b)
      return !1;
    if (!r && f.type === "touchstart" && ((m = f.touches) == null ? void 0 : m.length) > 1)
      return f.preventDefault(), !1;
    if (!p && !i && !g && b || !o && (f.type === "mousedown" || f.type === "touchstart") || Array.isArray(o) && !o.includes(f.button) && f.type === "mousedown")
      return !1;
    const w = Array.isArray(o) && o.includes(f.button) || !f.button || f.button <= 1;
    return (!f.ctrlKey || b || e) && w;
  };
}
function ub({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
  const c = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, d = e.getBoundingClientRect();
  let h = [
    [0, 0],
    [d.width, d.height]
  ];
  const f = typeof ResizeObserver < "u" ? new ResizeObserver((H) => {
    const _ = H[0];
    _ && (h = [
      [0, 0],
      [_.contentRect.width, _.contentRect.height]
    ]);
  }) : null;
  f == null || f.observe(e);
  const p = Ql().extent(() => h).scaleExtent([t, n]).translateExtent(r), g = Me(e).call(p);
  v({
    x: o.x,
    y: o.y,
    zoom: Yt(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const b = g.on("wheel.zoom"), w = g.on("dblclick.zoom");
  p.wheelDelta(Cc);
  async function m(H, _) {
    return g ? new Promise((M) => {
      p == null || p.interpolate((_ == null ? void 0 : _.interpolate) === "linear" ? wn : _r).transform(Xo(g, _ == null ? void 0 : _.duration, _ == null ? void 0 : _.ease, () => M(!0)), H);
    }) : !1;
  }
  function x({ noWheelClassName: H, noPanClassName: _, onPaneContextMenu: M, userSelectionActive: N, panOnScroll: $, panOnDrag: P, panOnScrollMode: I, panOnScrollSpeed: z, preventScrolling: D, zoomOnPinch: V, zoomOnScroll: j, zoomOnDoubleClick: G, panActivationKeyPressed: Y = !1, zoomActivationKeyPressed: ne, lib: Z, onTransformChange: R, connectionInProgress: F, paneClickDistance: q, selectionOnDrag: J }) {
    N && !c.isZoomingOrPanning && y();
    const K = $ && !ne && !N;
    p.clickDistance(J ? 1 / 0 : !We(q) || q < 0 ? 0 : q);
    const ee = K ? ib({
      zoomPanValues: c,
      noWheelClassName: H,
      d3Selection: g,
      d3Zoom: p,
      panOnScrollMode: I,
      panOnScrollSpeed: z,
      zoomOnPinch: V,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : sb({
      noWheelClassName: H,
      preventScrolling: D,
      d3ZoomHandler: b
    });
    g.on("wheel.zoom", ee, { passive: !1 });
    const te = ab({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    p.on("start", te);
    const re = lb({
      zoomPanValues: c,
      panOnDrag: P,
      onPaneContextMenu: !!M,
      onPanZoom: i,
      onTransformChange: R
    });
    p.on("zoom", re);
    const ie = cb({
      zoomPanValues: c,
      panOnDrag: P,
      panOnScroll: $,
      onPaneContextMenu: M,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    p.on("end", ie);
    const ce = db({
      panActivationKeyPressed: Y,
      zoomActivationKeyPressed: ne,
      panOnDrag: P,
      zoomOnScroll: j,
      panOnScroll: $,
      zoomOnDoubleClick: G,
      zoomOnPinch: V,
      userSelectionActive: N,
      noPanClassName: _,
      noWheelClassName: H,
      lib: Z,
      connectionInProgress: F
    });
    p.filter(ce), G ? g.on("dblclick.zoom", w) : g.on("dblclick.zoom", null);
  }
  function y() {
    p.on("zoom", null);
  }
  async function v(H, _, M) {
    const N = Go(H), $ = p == null ? void 0 : p.constrain()(N, _, M);
    return $ && await m($), $;
  }
  async function S(H, _) {
    const M = Go(H);
    return await m(M, _), M;
  }
  function E(H) {
    if (g) {
      const _ = Go(H), M = g.property("__zoom");
      (M.k !== H.zoom || M.x !== H.x || M.y !== H.y) && (p == null || p.transform(g, _, null, { sync: !0 }));
    }
  }
  function C() {
    const H = g ? Zl(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: H.x, y: H.y, zoom: H.k };
  }
  async function T(H, _) {
    return g ? new Promise((M) => {
      p == null || p.interpolate((_ == null ? void 0 : _.interpolate) === "linear" ? wn : _r).scaleTo(Xo(g, _ == null ? void 0 : _.duration, _ == null ? void 0 : _.ease, () => M(!0)), H);
    }) : !1;
  }
  async function A(H, _) {
    return g ? new Promise((M) => {
      p == null || p.interpolate((_ == null ? void 0 : _.interpolate) === "linear" ? wn : _r).scaleBy(Xo(g, _ == null ? void 0 : _.duration, _ == null ? void 0 : _.ease, () => M(!0)), H);
    }) : !1;
  }
  function L(H) {
    p == null || p.scaleExtent(H);
  }
  function O(H) {
    p == null || p.translateExtent(H);
  }
  function B(H) {
    const _ = !We(H) || H < 0 ? 0 : H;
    p == null || p.clickDistance(_);
  }
  return {
    update: x,
    destroy: y,
    setViewport: S,
    setViewportConstrained: v,
    getViewport: C,
    scaleTo: T,
    scaleBy: A,
    setScaleExtent: L,
    setTranslateExtent: O,
    syncViewport: E,
    setClickDistance: B
  };
}
var Xt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Xt || (Xt = {}));
function fb({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function na(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function st(e, t) {
  return Math.max(0, t - e);
}
function at(e, t) {
  return Math.max(0, e - t);
}
function hr(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function ra(e, t) {
  return e ? !t : t;
}
function hb(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: h } = t, f = d && h, { xSnapped: p, ySnapped: g } = n, { minWidth: b, maxWidth: w, minHeight: m, maxHeight: x } = r, { x: y, y: v, width: S, height: E, aspectRatio: C } = e;
  let T = Math.floor(d ? p - e.pointerX : 0), A = Math.floor(h ? g - e.pointerY : 0);
  const L = S + (l ? -T : T), O = E + (c ? -A : A), B = -i[0] * S, H = -i[1] * E;
  let _ = hr(L, b, w), M = hr(O, m, x);
  if (s) {
    let P = 0, I = 0;
    l && T < 0 ? P = st(y + T + B, s[0][0]) : !l && T > 0 && (P = at(y + L + B, s[1][0])), c && A < 0 ? I = st(v + A + H, s[0][1]) : !c && A > 0 && (I = at(v + O + H, s[1][1])), _ = Math.max(_, P), M = Math.max(M, I);
  }
  if (a) {
    let P = 0, I = 0;
    l && T > 0 ? P = at(y + T, a[0][0]) : !l && T < 0 && (P = st(y + L, a[1][0])), c && A > 0 ? I = at(v + A, a[0][1]) : !c && A < 0 && (I = st(v + O, a[1][1])), _ = Math.max(_, P), M = Math.max(M, I);
  }
  if (o) {
    if (d) {
      const P = hr(L / C, m, x) * C;
      if (_ = Math.max(_, P), s) {
        let I = 0;
        !l && !c || l && !c && f ? I = at(v + H + L / C, s[1][1]) * C : I = st(v + H + (l ? T : -T) / C, s[0][1]) * C, _ = Math.max(_, I);
      }
      if (a) {
        let I = 0;
        !l && !c || l && !c && f ? I = st(v + L / C, a[1][1]) * C : I = at(v + (l ? T : -T) / C, a[0][1]) * C, _ = Math.max(_, I);
      }
    }
    if (h) {
      const P = hr(O * C, b, w) / C;
      if (M = Math.max(M, P), s) {
        let I = 0;
        !l && !c || c && !l && f ? I = at(y + O * C + B, s[1][0]) / C : I = st(y + (c ? A : -A) * C + B, s[0][0]) / C, M = Math.max(M, I);
      }
      if (a) {
        let I = 0;
        !l && !c || c && !l && f ? I = st(y + O * C, a[1][0]) / C : I = at(y + (c ? A : -A) * C, a[0][0]) / C, M = Math.max(M, I);
      }
    }
  }
  A = A + (A < 0 ? M : -M), T = T + (T < 0 ? _ : -_), o && (f ? L > O * C ? A = (ra(l, c) ? -T : T) / C : T = (ra(l, c) ? -A : A) * C : d ? (A = T / C, c = l) : (T = A * C, l = c));
  const N = l ? y + T : y, $ = c ? v + A : v;
  return {
    width: S + (l ? -T : T),
    height: E + (c ? -A : A),
    x: i[0] * T * (l ? -1 : 1) + N,
    y: i[1] * A * (c ? -1 : 1) + $
  };
}
const Mc = { width: 0, height: 0, x: 0, y: 0 }, pb = {
  ...Mc,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function gb(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function mb({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Me(e);
  let s = {
    controlDirection: na("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: h, resizeDirection: f, onResizeStart: p, onResize: g, onResizeEnd: b, shouldResize: w }) {
    let m = { ...Mc }, x = { ...pb };
    s = {
      boundaries: d,
      resizeDirection: f,
      keepAspectRatio: h,
      controlDirection: na(c)
    };
    let y, v = null, S = [], E, C, T;
    const A = Dl().on("start", (L) => {
      const { nodeLookup: O, transform: B, snapGrid: H, snapToGrid: _, nodeOrigin: M, paneDomNode: N } = n();
      if (y = O.get(t), !y)
        return;
      v = (N == null ? void 0 : N.getBoundingClientRect()) ?? null;
      const { xSnapped: $, ySnapped: P } = bn(L.sourceEvent, {
        transform: B,
        snapGrid: H,
        snapToGrid: _,
        containerBounds: v
      });
      m = {
        width: y.measured.width ?? 0,
        height: y.measured.height ?? 0,
        x: y.position.x ?? 0,
        y: y.position.y ?? 0
      }, x = {
        ...m,
        pointerX: $,
        pointerY: P,
        aspectRatio: m.width / m.height
      }, E = void 0, C = Mt(y.extent) ? y.extent : void 0, y.parentId && (y.extent === "parent" || y.expandParent) && (E = O.get(y.parentId)), E && y.extent === "parent" && (C = [
        [0, 0],
        [E.measured.width, E.measured.height]
      ]), S = [], T = void 0;
      for (const [I, z] of O)
        if (z.parentId === t && (S.push({
          id: I,
          position: { ...z.position },
          extent: z.extent
        }), z.extent === "parent" || z.expandParent)) {
          const D = gb(z, y, z.origin ?? M);
          T ? T = [
            [Math.min(D[0][0], T[0][0]), Math.min(D[0][1], T[0][1])],
            [Math.max(D[1][0], T[1][0]), Math.max(D[1][1], T[1][1])]
          ] : T = D;
        }
      p == null || p(L, { ...m });
    }).on("drag", (L) => {
      const { transform: O, snapGrid: B, snapToGrid: H, nodeOrigin: _ } = n(), M = bn(L.sourceEvent, {
        transform: O,
        snapGrid: B,
        snapToGrid: H,
        containerBounds: v
      }), N = [];
      if (!y)
        return;
      const { x: $, y: P, width: I, height: z } = m, D = {}, V = y.origin ?? _, { width: j, height: G, x: Y, y: ne } = hb(x, s.controlDirection, M, s.boundaries, s.keepAspectRatio, V, C, T), Z = j !== I, R = G !== z, F = Y !== $ && Z, q = ne !== P && R;
      if (!F && !q && !Z && !R)
        return;
      const J = {
        prevValues: { ...m },
        startX: x.x,
        startY: x.y,
        childNodes: S.map((re) => ({
          ...re,
          position: { ...re.position }
        }))
      };
      if ((F || q || V[0] === 1 || V[1] === 1) && (D.x = F ? Y : m.x, D.y = q ? ne : m.y, m.x = D.x, m.y = D.y, S.length > 0)) {
        const re = Y - $, ie = ne - P;
        for (const ce of S)
          ce.position = {
            x: ce.position.x - re + V[0] * (j - I),
            y: ce.position.y - ie + V[1] * (G - z)
          }, N.push(ce);
      }
      if ((Z || R) && (D.width = Z && (!s.resizeDirection || s.resizeDirection === "horizontal") ? j : m.width, D.height = R && (!s.resizeDirection || s.resizeDirection === "vertical") ? G : m.height, m.width = D.width, m.height = D.height), E && y.expandParent) {
        const re = V[0] * (D.width ?? 0);
        D.x && D.x < re && (m.x = re, x.x = x.x - (D.x - re));
        const ie = V[1] * (D.height ?? 0);
        D.y && D.y < ie && (m.y = ie, x.y = x.y - (D.y - ie));
      }
      const K = fb({
        width: m.width,
        prevWidth: I,
        height: m.height,
        prevHeight: z,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), ee = { ...m, direction: K };
      if ((w == null ? void 0 : w(L, ee)) === !1) {
        m = J.prevValues, x.x = J.startX, x.y = J.startY, S.forEach((re, ie) => {
          re.position = J.childNodes[ie].position;
        });
        return;
      }
      g == null || g(L, ee), r(D, N);
    }).on("end", (L) => {
      b == null || b(L, { ...m }), o == null || o({ ...m });
    });
    i.call(A);
  }
  function l() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: l
  };
}
var Ic = { exports: {} }, $c = {}, Ac = { exports: {} }, Tc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ut = Si;
function yb(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var wb = typeof Object.is == "function" ? Object.is : yb, bb = Ut.useState, vb = Ut.useEffect, xb = Ut.useLayoutEffect, _b = Ut.useDebugValue;
function kb(e, t) {
  var n = t(), r = bb({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return xb(
    function() {
      o.value = n, o.getSnapshot = t, Uo(o) && i({ inst: o });
    },
    [e, n, t]
  ), vb(
    function() {
      return Uo(o) && i({ inst: o }), e(function() {
        Uo(o) && i({ inst: o });
      });
    },
    [e]
  ), _b(n), n;
}
function Uo(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !wb(e, n);
  } catch {
    return !0;
  }
}
function Eb(e, t) {
  return t();
}
var Sb = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Eb : kb;
Tc.useSyncExternalStore = Ut.useSyncExternalStore !== void 0 ? Ut.useSyncExternalStore : Sb;
Ac.exports = Tc;
var Nb = Ac.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oo = Si, Cb = Nb;
function Mb(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Ib = typeof Object.is == "function" ? Object.is : Mb, $b = Cb.useSyncExternalStore, Ab = oo.useRef, Tb = oo.useEffect, zb = oo.useMemo, Lb = oo.useDebugValue;
$c.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = Ab(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = zb(
    function() {
      function l(p) {
        if (!c) {
          if (c = !0, d = p, p = r(p), o !== void 0 && s.hasValue) {
            var g = s.value;
            if (o(g, p))
              return h = g;
          }
          return h = p;
        }
        if (g = h, Ib(d, p)) return g;
        var b = r(p);
        return o !== void 0 && o(g, b) ? (d = p, g) : (d = p, h = b);
      }
      var c = !1, d, h, f = n === void 0 ? null : n;
      return [
        function() {
          return l(t());
        },
        f === null ? void 0 : function() {
          return l(f());
        }
      ];
    },
    [t, n, r, o]
  );
  var a = $b(e, i[0], i[1]);
  return Tb(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), Lb(a), a;
};
Ic.exports = $c;
var Ob = Ic.exports;
const Pb = /* @__PURE__ */ Ka(Ob), Db = {}, oa = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, h) => {
    const f = typeof d == "function" ? d(t) : d;
    if (!Object.is(f, t)) {
      const p = t;
      t = h ?? (typeof f != "object" || f === null) ? f : Object.assign({}, t, f), n.forEach((g) => g(t, p));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (Db ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, Rb = (e) => e ? oa(e) : oa, { useDebugValue: Hb } = Si, { useSyncExternalStoreWithSelector: Wb } = Pb, Bb = (e) => e;
function zc(e, t = Bb, n) {
  const r = Wb(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Hb(r), r;
}
const ia = (e, t) => {
  const n = Rb(e), r = (o, i = t) => zc(n, o, i);
  return Object.assign(r, n), r;
}, Vb = (e, t) => e ? ia(e, t) : ia;
function pe(e, t) {
  if (Object.is(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  if (e instanceof Map && t instanceof Map) {
    if (e.size !== t.size) return !1;
    for (const [r, o] of e)
      if (!Object.is(o, t.get(r)))
        return !1;
    return !0;
  }
  if (e instanceof Set && t instanceof Set) {
    if (e.size !== t.size) return !1;
    for (const r of e)
      if (!t.has(r))
        return !1;
    return !0;
  }
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length)
    return !1;
  for (const r of n)
    if (!Object.prototype.hasOwnProperty.call(t, r) || !Object.is(e[r], t[r]))
      return !1;
  return !0;
}
const io = Yr(null), Fb = io.Provider, Lc = Ve.error001("react");
function ae(e, t) {
  const n = qt(io);
  if (n === null)
    throw new Error(Lc);
  return zc(n, e, t);
}
function fe() {
  const e = qt(io);
  if (e === null)
    throw new Error(Lc);
  return le(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const sa = { display: "none" }, jb = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Oc = "react-flow__node-desc", Pc = "react-flow__edge-desc", Yb = "react-flow__aria-live", Gb = (e) => e.ariaLiveMessage, Xb = (e) => e.ariaLabelConfig;
function Ub({ rfId: e }) {
  const t = ae(Gb);
  return u("div", { id: `${Yb}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: jb, children: t });
}
function qb({ rfId: e, disableKeyboardA11y: t }) {
  const n = ae(Xb);
  return k(me, { children: [u("div", { id: `${Oc}-${e}`, style: sa, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), u("div", { id: `${Pc}-${e}`, style: sa, children: n["edge.a11yDescription.default"] }), !t && u(Ub, { rfId: e })] });
}
const $t = Va(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return u("div", { className: be(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
$t.displayName = "Panel";
const aa = "https://reactflow.dev?utm_source=attribution";
function Kb({ proOptions: e, position: t = "bottom-right" }) {
  return de(() => {
  }, []), e != null && e.hideAttribution ? null : u($t, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${aa}`, children: u("a", { href: aa, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Zb = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, pr = (e) => e.id;
function Qb(e, t) {
  return pe(e.selectedNodes.map(pr), t.selectedNodes.map(pr)) && pe(e.selectedEdges.map(pr), t.selectedEdges.map(pr));
}
function Jb({ onSelectionChange: e }) {
  const t = fe(), { selectedNodes: n, selectedEdges: r } = ae(Zb, Qb);
  return de(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const ev = (e) => !!e.onSelectionChangeHandlers;
function tv({ onSelectionChange: e }) {
  const t = ae(ev);
  return e || t ? u(Jb, { onSelectionChange: e }) : null;
}
const Dc = [0, 0], nv = { x: 0, y: 0, zoom: 1 }, rv = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], la = [...rv, "rfId"], ov = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), ca = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Sn,
  nodeOrigin: Dc,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function iv(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = ae(ov, pe), c = fe();
  de(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = ca, a();
  }), []);
  const d = oe(ca);
  return de(
    () => {
      for (const h of la) {
        const f = e[h], p = d.current[h];
        f !== p && (typeof e[h] > "u" || (h === "nodes" ? t(f) : h === "edges" ? n(f) : h === "minZoom" ? r(f) : h === "maxZoom" ? o(f) : h === "translateExtent" ? i(f) : h === "nodeExtent" ? s(f) : h === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: Iw(f) }) : h === "fitView" ? c.setState({ fitViewQueued: f }) : h === "fitViewOptions" ? c.setState({ fitViewOptions: f }) : c.setState({ [h]: f })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    la.map((h) => e[h])
  ), null;
}
function da() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function sv(e) {
  var r;
  const [t, n] = Q(e === "system" ? null : e);
  return de(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = da(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = da()) != null && r.matches ? "dark" : "light";
}
const ua = typeof document < "u" ? document : null;
function In(e = null, t = { target: ua, actInsideInputWithModifier: !0 }) {
  const [n, r] = Q(!1), o = oe(!1), i = oe(/* @__PURE__ */ new Set([])), [s, a] = le(() => {
    if (e !== null) {
      const c = (Array.isArray(e) ? e : [e]).filter((h) => typeof h == "string").map((h) => h.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), d = c.reduce((h, f) => h.concat(...f), []);
      return [c, d];
    }
    return [[], []];
  }, [e]);
  return de(() => {
    const l = (t == null ? void 0 : t.target) ?? ua, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (p) => {
        var w, m;
        if (o.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!o.current || o.current && !c) && fc(p))
          return !1;
        const b = ha(p.code, a);
        if (i.current.add(p[b]), fa(s, i.current, !1)) {
          const x = ((m = (w = p.composedPath) == null ? void 0 : w.call(p)) == null ? void 0 : m[0]) || p.target, y = (x == null ? void 0 : x.nodeName) === "BUTTON" || (x == null ? void 0 : x.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !y) && p.preventDefault(), r(!0);
        }
      }, h = (p) => {
        const g = ha(p.code, a);
        fa(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(p[g]), p.key === "Meta" && i.current.clear(), o.current = !1;
      }, f = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", h), window.addEventListener("blur", f), window.addEventListener("contextmenu", f), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", h), window.removeEventListener("blur", f), window.removeEventListener("contextmenu", f);
      };
    }
  }, [e, r]), n;
}
function fa(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function ha(e, t) {
  return t.includes(e) ? "code" : "key";
}
const av = () => {
  const e = fe();
  return le(() => ({
    zoomIn: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, t) : !1;
    },
    zoomOut: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, t) : !1;
    },
    zoomTo: async (t, n) => {
      const { panZoom: r } = e.getState();
      return r ? r.scaleTo(t, n) : !1;
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      const { transform: [r, o, i], panZoom: s } = e.getState();
      return s ? (await s.setViewport({
        x: t.x ?? r,
        y: t.y ?? o,
        zoom: t.zoom ?? i
      }, n), !0) : !1;
    },
    getViewport: () => {
      const [t, n, r] = e.getState().transform;
      return { x: t, y: n, zoom: r };
    },
    setCenter: async (t, n, r) => e.getState().setCenter(t, n, r),
    fitBounds: async (t, n) => {
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = no(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
      return a ? (await a.setViewport(l, {
        duration: n == null ? void 0 : n.duration,
        ease: n == null ? void 0 : n.ease,
        interpolate: n == null ? void 0 : n.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: r, snapGrid: o, snapToGrid: i, domNode: s } = e.getState();
      if (!s)
        return t;
      const { x: a, y: l } = s.getBoundingClientRect(), c = {
        x: t.x - a,
        y: t.y - l
      }, d = n.snapGrid ?? o, h = n.snapToGrid ?? i;
      return Dn(c, r, h, d);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = Gt(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function Rc(e, t) {
  const n = [], r = /* @__PURE__ */ new Map(), o = [];
  for (const i of e)
    if (i.type === "add") {
      o.push(i);
      continue;
    } else if (i.type === "remove" || i.type === "replace")
      r.set(i.id, [i]);
    else {
      const s = r.get(i.id);
      s ? s.push(i) : r.set(i.id, [i]);
    }
  for (const i of t) {
    const s = r.get(i.id);
    if (!s) {
      n.push(i);
      continue;
    }
    if (s[0].type === "remove")
      continue;
    if (s[0].type === "replace") {
      n.push({ ...s[0].item });
      continue;
    }
    const a = { ...i };
    for (const l of s)
      lv(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function lv(e, t) {
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (t.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function cv(e, t) {
  return Rc(e, t);
}
function dv(e, t) {
  return Rc(e, t);
}
function vt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Rt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(vt(i.id, s)));
  }
  return r;
}
function pa({ items: e = [], lookup: t }) {
  var o;
  const n = [], r = new Map(e.map((i) => [i.id, i]));
  for (const [i, s] of e.entries()) {
    const a = t.get(s.id), l = ((o = a == null ? void 0 : a.internals) == null ? void 0 : o.userNode) ?? a;
    l !== void 0 && l !== s && n.push({ id: s.id, item: s, type: "replace" }), l === void 0 && n.push({ item: s, type: "add", index: i });
  }
  for (const [i] of t)
    r.get(i) === void 0 && n.push({ id: i, type: "remove" });
  return n;
}
function ga(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const uv = ac();
function fv(e, t, n = {}) {
  return Ow(e, t, {
    ...n,
    onError: n.onError ?? uv
  });
}
const ma = (e) => vw(e), hv = (e) => nc(e);
function Hc(e) {
  return Va(e);
}
const Wc = typeof window < "u" ? Ni : de;
function ya(e) {
  const [t, n] = Q(BigInt(0)), [r] = Q(() => pv(() => n((o) => o + BigInt(1))));
  return Wc(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function pv(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const Bc = Yr(null);
function gv({ children: e }) {
  const t = fe(), n = $e((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: h, nodeLookup: f, fitViewQueued: p, onNodesChangeMiddlewareMap: g } = t.getState();
    let b = l;
    for (const m of a)
      b = typeof m == "function" ? m(b) : m;
    let w = pa({
      items: b,
      lookup: f
    });
    for (const m of g.values())
      w = m(w);
    d && c(b), w.length > 0 ? h == null || h(w) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: x, setNodes: y } = t.getState();
      m && y(x);
    });
  }, []), r = ya(n), o = $e((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: h, edgeLookup: f } = t.getState();
    let p = l;
    for (const g of a)
      p = typeof g == "function" ? g(p) : g;
    d ? c(p) : h && h(pa({
      items: p,
      lookup: f
    }));
  }, []), i = ya(o), s = le(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return u(Bc.Provider, { value: s, children: e });
}
function mv() {
  const e = qt(Bc);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const yv = (e) => !!e.panZoom;
function so() {
  const e = av(), t = fe(), n = mv(), r = ae(yv), o = le(() => {
    const i = (h) => t.getState().nodeLookup.get(h), s = (h) => {
      n.nodeQueue.push(h);
    }, a = (h) => {
      n.edgeQueue.push(h);
    }, l = (h) => {
      var m, x;
      const { nodeLookup: f, nodeOrigin: p } = t.getState(), g = ma(h) ? h : f.get(h.id), b = g.parentId ? cc(g.position, g.measured, g.parentId, f, p) : g.position, w = {
        ...g,
        position: b,
        width: ((m = g.measured) == null ? void 0 : m.width) ?? g.width,
        height: ((x = g.measured) == null ? void 0 : x.height) ?? g.height
      };
      return Cn(w);
    }, c = (h, f, p = { replace: !1 }) => {
      s((g) => g.map((b) => {
        if (b.id === h) {
          const w = typeof f == "function" ? f(b) : f;
          return p.replace && ma(w) ? w : { ...b, ...w };
        }
        return b;
      }));
    }, d = (h, f, p = { replace: !1 }) => {
      a((g) => g.map((b) => {
        if (b.id === h) {
          const w = typeof f == "function" ? f(b) : f;
          return p.replace && hv(w) ? w : { ...b, ...w };
        }
        return b;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((h) => ({ ...h })),
      getNode: (h) => {
        var f;
        return (f = i(h)) == null ? void 0 : f.internals.userNode;
      },
      getInternalNode: i,
      getEdges: () => {
        const { edges: h = [] } = t.getState();
        return h.map((f) => ({ ...f }));
      },
      getEdge: (h) => t.getState().edgeLookup.get(h),
      setNodes: s,
      setEdges: a,
      addNodes: (h) => {
        const f = Array.isArray(h) ? h : [h];
        n.nodeQueue.push((p) => [...p, ...f]);
      },
      addEdges: (h) => {
        const f = Array.isArray(h) ? h : [h];
        n.edgeQueue.push((p) => [...p, ...f]);
      },
      toObject: () => {
        const { nodes: h = [], edges: f = [], transform: p } = t.getState(), [g, b, w] = p;
        return {
          nodes: h.map((m) => ({ ...m })),
          edges: f.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: b,
            zoom: w
          }
        };
      },
      deleteElements: async ({ nodes: h = [], edges: f = [] }) => {
        const { nodes: p, edges: g, onNodesDelete: b, onEdgesDelete: w, triggerNodeChanges: m, triggerEdgeChanges: x, onDelete: y, onBeforeDelete: v } = t.getState(), { nodes: S, edges: E } = await Sw({
          nodesToRemove: h,
          edgesToRemove: f,
          nodes: p,
          edges: g,
          onBeforeDelete: v
        }), C = E.length > 0, T = S.length > 0;
        if (C) {
          const A = E.map(ga);
          w == null || w(E), x(A);
        }
        if (T) {
          const A = S.map(ga);
          b == null || b(S), m(A);
        }
        return (T || C) && (y == null || y({ nodes: S, edges: E })), { deletedNodes: S, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (h, f = !0, p) => {
        const g = Ys(h), b = g ? h : l(h), w = p !== void 0;
        return b ? (p || t.getState().nodes).filter((m) => {
          const x = t.getState().nodeLookup.get(m.id);
          if (x && !g && (m.id === h.id || !x.internals.positionAbsolute))
            return !1;
          const y = Cn(w ? m : x), v = Wr(y, b);
          return f && v > 0 || v >= y.width * y.height || v >= b.width * b.height;
        }) : [];
      },
      isNodeIntersecting: (h, f, p = !0) => {
        const b = Ys(h) ? h : l(h);
        if (!b)
          return !1;
        const w = Wr(b, f);
        return p && w > 0 || w >= f.width * f.height || w >= b.width * b.height;
      },
      updateNode: c,
      updateNodeData: (h, f, p = { replace: !1 }) => {
        c(h, (g) => {
          const b = typeof f == "function" ? f(g) : f;
          return p.replace ? { ...g, data: b } : { ...g, data: { ...g.data, ...b } };
        }, p);
      },
      updateEdge: d,
      updateEdgeData: (h, f, p = { replace: !1 }) => {
        d(h, (g) => {
          const b = typeof f == "function" ? f(g) : f;
          return p.replace ? { ...g, data: b } : { ...g, data: { ...g.data, ...b } };
        }, p);
      },
      getNodesBounds: (h) => {
        const { nodeLookup: f, nodeOrigin: p } = t.getState();
        return xw(h, { nodeLookup: f, nodeOrigin: p });
      },
      getHandleConnections: ({ type: h, id: f, nodeId: p }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${p}-${h}${f ? `-${f}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      getNodeConnections: ({ type: h, handleId: f, nodeId: p }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${p}${h ? f ? `-${h}-${f}` : `-${h}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      fitView: async (h) => {
        const f = t.getState().fitViewResolver ?? Mw();
        return t.setState({ fitViewQueued: !0, fitViewOptions: h, fitViewResolver: f }), n.nodeQueue.push((p) => [...p]), f.promise;
      }
    };
  }, []);
  return le(() => ({
    ...o,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const wa = (e) => e.selected, wv = typeof window < "u" ? window : void 0;
function bv({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = fe(), { deleteElements: r } = so(), o = In(e, { actInsideInputWithModifier: !1 }), i = In(t, { target: wv });
  de(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(wa), edges: s.filter(wa) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), de(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function vv(e) {
  const t = fe();
  de(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = Fi(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", Ve.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const r = new ResizeObserver(() => n());
      return r.observe(e.current), () => {
        window.removeEventListener("resize", n), r && e.current && r.unobserve(e.current);
      };
    }
  }, []);
}
const ao = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, xv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function _v({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = Et.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: h, maxZoom: f, zoomActivationKeyCode: p, preventScrolling: g = !0, children: b, noWheelClassName: w, noPanClassName: m, onViewportChange: x, isControlledViewport: y, paneClickDistance: v, selectionOnDrag: S }) {
  const E = fe(), C = oe(null), { userSelectionActive: T, lib: A, connectionInProgress: L } = ae(xv, pe), O = In(p), B = oe();
  vv(C);
  const H = $e((_) => {
    x == null || x({ x: _[0], y: _[1], zoom: _[2] }), y || E.setState({ transform: _ });
  }, [x, y]);
  return de(() => {
    if (C.current) {
      B.current = ub({
        domNode: C.current,
        minZoom: h,
        maxZoom: f,
        translateExtent: d,
        viewport: c,
        onDraggingChange: ($) => E.setState((P) => P.paneDragging === $ ? P : { paneDragging: $ }),
        onPanZoomStart: ($, P) => {
          const { onViewportChangeStart: I, onMoveStart: z } = E.getState();
          z == null || z($, P), I == null || I(P);
        },
        onPanZoom: ($, P) => {
          const { onViewportChange: I, onMove: z } = E.getState();
          z == null || z($, P), I == null || I(P);
        },
        onPanZoomEnd: ($, P) => {
          const { onViewportChangeEnd: I, onMoveEnd: z } = E.getState();
          z == null || z($, P), I == null || I(P);
        }
      });
      const { x: _, y: M, zoom: N } = B.current.getViewport();
      return E.setState({
        panZoom: B.current,
        transform: [_, M, N],
        domNode: C.current.closest(".react-flow")
      }), () => {
        var $;
        ($ = B.current) == null || $.destroy();
      };
    }
  }, []), de(() => {
    var _;
    (_ = B.current) == null || _.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: r,
      panActivationKeyPressed: o,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: l,
      zoomActivationKeyPressed: O,
      preventScrolling: g,
      noPanClassName: m,
      userSelectionActive: T,
      noWheelClassName: w,
      lib: A,
      onTransformChange: H,
      connectionInProgress: L,
      selectionOnDrag: S,
      paneClickDistance: v
    });
  }, [
    e,
    t,
    n,
    r,
    o,
    i,
    s,
    a,
    l,
    O,
    g,
    m,
    T,
    w,
    A,
    H,
    L,
    S,
    v
  ]), u("div", { className: "react-flow__renderer", ref: C, style: ao, children: b });
}
const kv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Ev() {
  const { userSelectionActive: e, userSelectionRect: t } = ae(kv, pe);
  return e && t ? u("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const qo = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Sv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Nv({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Nn.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: h, onPaneMouseEnter: f, onPaneMouseMove: p, onPaneMouseLeave: g, children: b }) {
  const w = oe(0), m = fe(), { userSelectionActive: x, elementsSelectable: y, dragging: v, panBy: S, autoPanSpeed: E } = ae(Sv, pe), C = y && (e || x), T = oe(null), A = oe(), L = oe(/* @__PURE__ */ new Set()), O = oe(/* @__PURE__ */ new Set()), B = oe(!1), H = oe(!1), _ = oe({ x: 0, y: 0 }), M = oe(!1), N = (R) => {
    if (H.current || B.current || m.getState().connection.inProgress) {
      H.current = !1, B.current = !1;
      return;
    }
    c == null || c(R), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, $ = (R) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      R.preventDefault();
      return;
    }
    d == null || d(R);
  }, P = h ? (R) => h(R) : void 0, I = (R) => {
    H.current && (R.stopPropagation(), H.current = !1);
  }, z = (R) => {
    var ce, ke;
    if (R.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: F, transform: q } = m.getState();
    if (A.current = F == null ? void 0 : F.getBoundingClientRect(), !A.current)
      return;
    const J = R.target === T.current;
    if (!J && !!R.target.closest(".nokey") || !e || !(s && J || t) || R.button !== 0 || !R.isPrimary)
      return;
    (ke = (ce = R.target) == null ? void 0 : ce.setPointerCapture) == null || ke.call(ce, R.pointerId), H.current = !1;
    const { x: te, y: re } = Be(R.nativeEvent, A.current), ie = Dn({ x: te, y: re }, q);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ie.x,
        startY: ie.y,
        x: te,
        y: re
      }
    }), J || (R.stopPropagation(), R.preventDefault());
  };
  function D(R, F) {
    const { userSelectionRect: q } = m.getState();
    if (!q)
      return;
    const { transform: J, nodeLookup: K, edgeLookup: ee, connectionLookup: te, triggerNodeChanges: re, triggerEdgeChanges: ie, defaultEdgeOptions: ce } = m.getState(), ke = { x: q.startX, y: q.startY }, { x: Ee, y: Te } = Gt(ke, J), ze = {
      startX: ke.x,
      startY: ke.y,
      x: R < Ee ? R : Ee,
      y: F < Te ? F : Te,
      width: Math.abs(R - Ee),
      height: Math.abs(F - Te)
    }, ht = L.current, Ge = O.current;
    L.current = new Set(Bi(K, ze, J, n === Nn.Partial, !0).map((Se) => Se.id)), O.current = /* @__PURE__ */ new Set();
    const Qe = (ce == null ? void 0 : ce.selectable) ?? !0;
    for (const Se of L.current) {
      const Le = te.get(Se);
      if (Le)
        for (const { edgeId: _e } of Le.values()) {
          const Xe = ee.get(_e);
          Xe && (Xe.selectable ?? Qe) && O.current.add(_e);
        }
    }
    if (!Gs(ht, L.current)) {
      const Se = Rt(K, L.current, !0);
      re(Se);
    }
    if (!Gs(Ge, O.current)) {
      const Se = Rt(ee, O.current);
      ie(Se);
    }
    m.setState({
      userSelectionRect: ze,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function V() {
    if (!o || !A.current)
      return;
    const [R, F] = Vi(_.current, A.current, E);
    S({ x: R, y: F }).then((q) => {
      if (!H.current || !q) {
        w.current = requestAnimationFrame(V);
        return;
      }
      const { x: J, y: K } = _.current;
      D(J, K), w.current = requestAnimationFrame(V);
    });
  }
  const j = () => {
    cancelAnimationFrame(w.current), w.current = 0, M.current = !1;
  };
  de(() => () => j(), []);
  const G = (R) => {
    const { userSelectionRect: F, transform: q, resetSelectedElements: J } = m.getState();
    if (!A.current || !F)
      return;
    const { x: K, y: ee } = Be(R.nativeEvent, A.current);
    _.current = { x: K, y: ee };
    const te = Gt({ x: F.startX, y: F.startY }, q);
    if (!H.current) {
      const re = t ? 0 : i;
      if (Math.hypot(K - te.x, ee - te.y) <= re)
        return;
      J(), a == null || a(R);
    }
    H.current = !0, M.current || (V(), M.current = !0), D(K, ee);
  }, Y = (R) => {
    var F, q;
    if (!C) {
      R.target === T.current && m.getState().connection.inProgress && (B.current = !0);
      return;
    }
    R.button === 0 && ((q = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || q.call(F, R.pointerId), !x && R.target === T.current && m.getState().userSelectionRect && (N == null || N(R)), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), H.current && (l == null || l(R), m.setState({
      nodesSelectionActive: L.current.size > 0
    })), j());
  }, ne = (R) => {
    var F, q;
    (q = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || q.call(F, R.pointerId), j();
  }, Z = r === !0 || Array.isArray(r) && r.includes(0);
  return k("div", { className: be(["react-flow__pane", { draggable: Z, dragging: v, selection: e }]), onClick: C ? void 0 : qo(N, T), onContextMenu: qo($, T), onWheel: qo(P, T), onPointerEnter: C ? void 0 : f, onPointerMove: C ? G : p, onPointerUp: Y, onPointerCancel: C ? ne : void 0, onPointerDownCapture: C ? z : void 0, onClickCapture: C ? I : void 0, onPointerLeave: g, ref: T, style: ao, children: [b, u(Ev, {})] });
}
function yi({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", Ve.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var d;
    return (d = r == null ? void 0 : r.current) == null ? void 0 : d.blur();
  })) : o([e]);
}
function Vc({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = fe(), [l, c] = Q(!1), d = oe();
  return de(() => {
    if (!t)
      return d.current = Zw({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (h) => {
          yi({
            id: h,
            store: a,
            nodeRef: e
          });
        },
        onDragStart: () => {
          c(!0);
        },
        onDragStop: () => {
          c(!1);
        }
      }), () => {
        var h;
        (h = d.current) == null || h.destroy(), d.current = void 0;
      };
  }, [t, a, e]), de(() => {
    t || !e.current || !d.current || d.current.update({
      noDragClassName: n,
      handleSelector: r,
      domNode: e.current,
      isSelectable: i,
      nodeId: o,
      nodeClickDistance: s
    });
  }, [n, r, t, i, e, o, s]), l;
}
const Cv = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function Fc() {
  const e = fe();
  return $e((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), h = /* @__PURE__ */ new Map(), f = Cv(s), p = o ? i[0] : 5, g = o ? i[1] : 5, b = n.direction.x * p * n.factor, w = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!f(m))
        continue;
      let x = {
        x: m.internals.positionAbsolute.x + b,
        y: m.internals.positionAbsolute.y + w
      };
      o && (x = Pn(x, i));
      const { position: y, positionAbsolute: v } = rc({
        nodeId: m.id,
        nextPosition: x,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: d,
        onError: a
      });
      m.position = y, m.internals.positionAbsolute = v, h.set(m.id, m);
    }
    l(h);
  }, []);
}
const qi = Yr(null), Mv = qi.Provider;
qi.Consumer;
const jc = () => qt(qi), Iv = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), Yc = Yr(null);
function $v({ children: e }) {
  const t = ae(Iv, pe);
  return u(Yc.Provider, { value: t, children: e });
}
function Av() {
  const e = qt(Yc);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Tv = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, zv = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Tv;
  const d = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: d,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === Ft.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: d && c
  };
};
function Lv({ type: e = "source", position: t = U.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: h, ...f }, p) {
  var M, N;
  const g = s || null, b = e === "target", w = fe(), m = jc(), { connectOnClick: x, noPanClassName: y, rfId: v } = Av(), { connectingFrom: S, connectingTo: E, clickConnecting: C, isPossibleEndHandle: T, connectionInProcess: A, clickConnectionInProcess: L, valid: O } = ae(zv(m, g, e), pe);
  m || (N = (M = w.getState()).onError) == null || N.call(M, "010", Ve.error010());
  const B = ($) => {
    const { defaultEdgeOptions: P, onConnect: I, hasDefaultEdges: z } = w.getState(), D = {
      ...P,
      ...$
    };
    if (z) {
      const { edges: V, setEdges: j, onError: G } = w.getState();
      j(fv(D, V, { onError: G }));
    }
    I == null || I(D), a == null || a(D);
  }, H = ($) => {
    if (!m)
      return;
    const P = hc($.nativeEvent);
    if (o && (P && $.button === 0 || !P)) {
      const I = w.getState();
      mi.onPointerDown($.nativeEvent, {
        handleDomNode: $.currentTarget,
        autoPanOnConnect: I.autoPanOnConnect,
        connectionMode: I.connectionMode,
        connectionRadius: I.connectionRadius,
        domNode: I.domNode,
        nodeLookup: I.nodeLookup,
        lib: I.lib,
        isTarget: b,
        handleId: g,
        nodeId: m,
        flowId: I.rfId,
        panBy: I.panBy,
        cancelConnection: I.cancelConnection,
        onConnectStart: I.onConnectStart,
        onConnectEnd: (...z) => {
          var D, V;
          return (V = (D = w.getState()).onConnectEnd) == null ? void 0 : V.call(D, ...z);
        },
        updateConnection: I.updateConnection,
        onConnect: B,
        isValidConnection: n || ((...z) => {
          var D, V;
          return ((V = (D = w.getState()).isValidConnection) == null ? void 0 : V.call(D, ...z)) ?? !0;
        }),
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: I.autoPanSpeed,
        dragThreshold: I.connectionDragThreshold
      });
    }
    P ? d == null || d($) : h == null || h($);
  }, _ = ($) => {
    const { onClickConnectStart: P, onClickConnectEnd: I, connectionClickStartHandle: z, connectionMode: D, isValidConnection: V, lib: j, rfId: G, nodeLookup: Y, connection: ne } = w.getState();
    if (!m || !z && !o)
      return;
    if (!z) {
      P == null || P($.nativeEvent, { nodeId: m, handleId: g, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const Z = uc($.target), R = n || V, { connection: F, isValid: q } = mi.isValid($.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: D,
      fromNodeId: z.nodeId,
      fromHandleId: z.id || null,
      fromType: z.type,
      isValidConnection: R,
      flowId: G,
      doc: Z,
      lib: j,
      nodeLookup: Y
    });
    q && F && B(F);
    const J = structuredClone(ne);
    delete J.inProgress, J.toPosition = J.toHandle ? J.toHandle.position : null, I == null || I($, J), w.setState({ connectionClickStartHandle: null });
  };
  return u("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${v}-${m}-${g}-${e}`, className: be([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    y,
    c,
    {
      source: !b,
      target: b,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: C,
      connectingfrom: S,
      connectingto: E,
      valid: O,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!A || T) && (A || L ? i : o)
    }
  ]), onMouseDown: H, onTouchStart: H, onClick: x ? _ : void 0, ref: p, ...f, children: l });
}
const ft = he(Hc(Lv));
function Ov({ data: e, isConnectable: t, sourcePosition: n = U.Bottom }) {
  return k(me, { children: [e == null ? void 0 : e.label, u(ft, { type: "source", position: n, isConnectable: t })] });
}
function Pv({ data: e, isConnectable: t, targetPosition: n = U.Top, sourcePosition: r = U.Bottom }) {
  return k(me, { children: [u(ft, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, u(ft, { type: "source", position: r, isConnectable: t })] });
}
function Dv() {
  return null;
}
function Rv({ data: e, isConnectable: t, targetPosition: n = U.Top }) {
  return k(me, { children: [u(ft, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Br = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, ba = {
  input: Ov,
  default: Pv,
  output: Rv,
  group: Dv
};
function Hv(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const Wv = (e) => {
  const { width: t, height: n, x: r, y: o } = On(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: We(t) ? t : null,
    height: We(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function Bv({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = fe(), { width: o, height: i, transformString: s, userSelectionActive: a } = ae(Wv, pe), l = Fc(), c = oe(null);
  de(() => {
    var p;
    n || (p = c.current) == null || p.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (Vc({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const h = e ? (p) => {
    const g = r.getState().nodes.filter((b) => b.selected);
    e(p, g);
  } : void 0, f = (p) => {
    Object.prototype.hasOwnProperty.call(Br, p.key) && (p.preventDefault(), l({
      direction: Br[p.key],
      factor: p.shiftKey ? 4 : 1
    }));
  };
  return u("div", { className: be(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: u("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: h, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : f, style: {
    width: o,
    height: i
  } }) });
}
const va = typeof window < "u" ? window : void 0, Vv = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Gc({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: h, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: g, panActivationKeyCode: b, zoomActivationKeyCode: w, elementsSelectable: m, zoomOnScroll: x, zoomOnPinch: y, panOnScroll: v, panOnScrollSpeed: S, panOnScrollMode: E, zoomOnDoubleClick: C, panOnDrag: T, autoPanOnSelection: A, defaultViewport: L, translateExtent: O, minZoom: B, maxZoom: H, preventScrolling: _, onSelectionContextMenu: M, noWheelClassName: N, noPanClassName: $, disableKeyboardA11y: P, onViewportChange: I, isControlledViewport: z }) {
  const { nodesSelectionActive: D, userSelectionActive: V } = ae(Vv, pe), j = In(c, { target: va }), G = In(b, { target: va }), Y = G || T, ne = G || v, Z = d && Y !== !0, R = j || V || Z;
  return bv({ deleteKeyCode: l, multiSelectionKeyCode: g }), u(_v, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: x, zoomOnPinch: y, panOnScroll: ne, panActivationKeyPressed: G, panOnScrollSpeed: S, panOnScrollMode: E, zoomOnDoubleClick: C, panOnDrag: !j && Y, defaultViewport: L, translateExtent: O, minZoom: B, maxZoom: H, zoomActivationKeyCode: w, preventScrolling: _, noWheelClassName: N, noPanClassName: $, onViewportChange: I, isControlledViewport: z, paneClickDistance: a, selectionOnDrag: Z, children: k(Nv, { onSelectionStart: f, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: Y, autoPanOnSelection: A, isSelecting: !!R, selectionMode: h, selectionKeyPressed: j, paneClickDistance: a, selectionOnDrag: Z, children: [e, D && u(Bv, { onSelectionContextMenu: M, noPanClassName: $, disableKeyboardA11y: P })] }) });
}
Gc.displayName = "FlowRenderer";
const Fv = he(Gc), jv = (e) => (t) => e ? Bi(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Yv(e) {
  return ae($e(jv(e), [e]), pe);
}
const Gv = (e) => e.updateNodeInternals;
function Xv() {
  const e = ae(Gv), [t] = Q(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const r = /* @__PURE__ */ new Map();
    n.forEach((o) => {
      const i = o.target.getAttribute("data-id");
      r.set(i, {
        id: i,
        nodeElement: o.target,
        force: !0
      });
    }), e(r);
  }));
  return de(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function Uv({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = fe(), i = oe(null), s = oe(null), a = oe(e.sourcePosition), l = oe(e.targetPosition), c = oe(t), d = n && !!e.internals.handleBounds;
  return de(() => {
    i.current && !e.hidden && (!d || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [d, e.hidden]), de(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), de(() => {
    if (i.current) {
      const h = c.current !== t, f = a.current !== e.sourcePosition, p = l.current !== e.targetPosition;
      (h || f || p) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function qv({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: h, noDragClassName: f, noPanClassName: p, disableKeyboardA11y: g, rfId: b, nodeTypes: w, nodeClickDistance: m, onError: x }) {
  const { node: y, internals: v, isParent: S } = ae((R) => {
    const F = R.nodeLookup.get(e), q = R.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: q
    };
  }, pe);
  let E = y.type || "default", C = (w == null ? void 0 : w[E]) || ba[E];
  C === void 0 && (x == null || x("003", Ve.error003(E)), E = "default", C = (w == null ? void 0 : w.default) || ba.default);
  const T = !!(y.draggable || a && typeof y.draggable > "u"), A = !!(y.selectable || l && typeof y.selectable > "u"), L = !!(y.connectable || c && typeof y.connectable > "u"), O = !!(y.focusable || d && typeof y.focusable > "u"), B = fe(), H = lc(y), _ = Uv({ node: y, nodeType: E, hasDimensions: H, resizeObserver: h }), M = Vc({
    nodeRef: _,
    disabled: y.hidden || !T,
    noDragClassName: f,
    handleSelector: y.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), N = Fc();
  if (y.hidden)
    return null;
  const $ = Ye(y), P = Hv(y), I = A || T || t || n || r || o, z = n ? (R) => n(R, { ...v.userNode }) : void 0, D = r ? (R) => r(R, { ...v.userNode }) : void 0, V = o ? (R) => o(R, { ...v.userNode }) : void 0, j = i ? (R) => i(R, { ...v.userNode }) : void 0, G = s ? (R) => s(R, { ...v.userNode }) : void 0, Y = (R) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: q } = B.getState();
    A && (!F || !T || q > 0) && yi({
      id: e,
      store: B,
      nodeRef: _
    }), t && t(R, { ...v.userNode });
  }, ne = (R) => {
    if (!(fc(R.nativeEvent) || g)) {
      if (Jl.includes(R.key) && A) {
        const F = R.key === "Escape";
        yi({
          id: e,
          store: B,
          unselect: F,
          nodeRef: _
        });
      } else if (T && y.selected && Object.prototype.hasOwnProperty.call(Br, R.key)) {
        R.preventDefault();
        const { ariaLabelConfig: F } = B.getState();
        B.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: R.key.replace("Arrow", "").toLowerCase(),
            x: ~~v.positionAbsolute.x,
            y: ~~v.positionAbsolute.y
          })
        }), N({
          direction: Br[R.key],
          factor: R.shiftKey ? 4 : 1
        });
      }
    }
  }, Z = () => {
    var te;
    if (g || !((te = _.current) != null && te.matches(":focus-visible")))
      return;
    const { transform: R, width: F, height: q, autoPanOnNodeFocus: J, setCenter: K } = B.getState();
    if (!J)
      return;
    Bi(/* @__PURE__ */ new Map([[e, y]]), { x: 0, y: 0, width: F, height: q }, R, !0).length > 0 || K(y.position.x + $.width / 2, y.position.y + $.height / 2, {
      zoom: R[2]
    });
  };
  return u("div", { className: be([
    "react-flow__node",
    `react-flow__node-${E}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [p]: T
    },
    y.className,
    {
      selected: y.selected,
      selectable: A,
      parent: S,
      draggable: T,
      dragging: M
    }
  ]), ref: _, style: {
    zIndex: v.z,
    transform: `translate(${v.positionAbsolute.x}px,${v.positionAbsolute.y}px)`,
    pointerEvents: I ? "all" : "none",
    visibility: H ? "visible" : "hidden",
    ...y.style,
    ...P
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: z, onMouseMove: D, onMouseLeave: V, onContextMenu: j, onClick: Y, onDoubleClick: G, onKeyDown: O ? ne : void 0, tabIndex: O ? 0 : void 0, onFocus: O ? Z : void 0, role: y.ariaRole ?? (O ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Oc}-${b}`, "aria-label": y.ariaLabel, ...y.domAttributes, children: u(Mv, { value: e, children: u(C, { id: e, data: y.data, type: E, positionAbsoluteX: v.positionAbsolute.x, positionAbsoluteY: v.positionAbsolute.y, selected: y.selected ?? !1, selectable: A, draggable: T, deletable: y.deletable ?? !0, isConnectable: L, sourcePosition: y.sourcePosition, targetPosition: y.targetPosition, dragging: M, dragHandle: y.dragHandle, zIndex: v.z, parentId: y.parentId, ...$ }) }) });
}
var Kv = he(qv);
const Zv = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function Xc(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = ae(Zv, pe), i = Yv(e.onlyRenderVisibleElements), s = Xv();
  return u("div", { className: "react-flow__nodes", style: ao, children: i.map((a) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    u(Kv, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
Xc.displayName = "NodeRenderer";
const Qv = he(Xc);
function Jv(e) {
  return ae($e((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && Tw({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(o.id);
      }
    return r;
  }, [e]), pe);
}
const ex = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return u("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, tx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return u("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, xa = {
  [jt.Arrow]: ex,
  [jt.ArrowClosed]: tx
};
function nx(e) {
  const t = fe();
  return le(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(xa, e) ? xa[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Ve.error009(e)), null);
  }, [e]);
}
const rx = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = nx(t);
  return l ? u("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: u(l, { color: n, strokeWidth: s }) }) : null;
}, Uc = ({ defaultColor: e, rfId: t }) => {
  const n = ae((i) => i.edges), r = ae((i) => i.defaultEdgeOptions), o = le(() => Ww(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? u("svg", { className: "react-flow__marker", "aria-hidden": "true", children: u("defs", { children: o.map((i) => u(rx, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
Uc.displayName = "MarkerDefinitions";
var ox = he(Uc);
function qc({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [h, f] = Q({ x: 1, y: 0, width: 0, height: 0 }), p = be(["react-flow__edge-textwrapper", c]), g = oe(null);
  return de(() => {
    if (g.current) {
      const b = g.current.getBBox();
      f({
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height
      });
    }
  }, [n]), n ? k("g", { transform: `translate(${e - h.width / 2} ${t - h.height / 2})`, className: p, visibility: h.width ? "visible" : "hidden", ...d, children: [o && u("rect", { width: h.width + 2 * s[0], x: -s[0], y: -s[1], height: h.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), u("text", { className: "react-flow__edge-text", y: h.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
qc.displayName = "EdgeText";
const ix = he(qc);
function lo({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return k(me, { children: [u("path", { ...d, d: e, fill: "none", className: be(["react-flow__edge-path", d.className]) }), c ? u("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && We(t) && We(n) ? u(ix, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function _a({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === U.Left || e === U.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function Kc({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top }) {
  const [s, a] = _a({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = _a({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, h, f, p] = pc({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: o,
    sourceControlX: s,
    sourceControlY: a,
    targetControlX: l,
    targetControlY: c
  });
  return [
    `M${e},${t} C${s},${a} ${l},${c} ${r},${o}`,
    d,
    h,
    f,
    p
  ];
}
function Zc(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: w, interactionWidth: m }) => {
    const [x, y, v] = Kc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), S = e.isInternal ? void 0 : t;
    return u(lo, { id: S, path: x, labelX: y, labelY: v, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: w, interactionWidth: m });
  });
}
const sx = Zc({ isInternal: !1 }), Qc = Zc({ isInternal: !0 });
sx.displayName = "SimpleBezierEdge";
Qc.displayName = "SimpleBezierEdgeInternal";
function Jc(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, sourcePosition: p = U.Bottom, targetPosition: g = U.Top, markerEnd: b, markerStart: w, pathOptions: m, interactionWidth: x }) => {
    const [y, v, S] = hi({
      sourceX: n,
      sourceY: r,
      sourcePosition: p,
      targetX: o,
      targetY: i,
      targetPosition: g,
      borderRadius: m == null ? void 0 : m.borderRadius,
      offset: m == null ? void 0 : m.offset,
      stepPosition: m == null ? void 0 : m.stepPosition
    }), E = e.isInternal ? void 0 : t;
    return u(lo, { id: E, path: y, labelX: v, labelY: S, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, markerEnd: b, markerStart: w, interactionWidth: x });
  });
}
const ed = Jc({ isInternal: !1 }), td = Jc({ isInternal: !0 });
ed.displayName = "SmoothStepEdge";
td.displayName = "SmoothStepEdgeInternal";
function nd(e) {
  return he(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return u(ed, { ...n, id: r, pathOptions: le(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const ax = nd({ isInternal: !1 }), rd = nd({ isInternal: !0 });
ax.displayName = "StepEdge";
rd.displayName = "StepEdgeInternal";
function od(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, markerEnd: p, markerStart: g, interactionWidth: b }) => {
    const [w, m, x] = yc({ sourceX: n, sourceY: r, targetX: o, targetY: i }), y = e.isInternal ? void 0 : t;
    return u(lo, { id: y, path: w, labelX: m, labelY: x, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, markerEnd: p, markerStart: g, interactionWidth: b });
  });
}
const lx = od({ isInternal: !1 }), id = od({ isInternal: !0 });
lx.displayName = "StraightEdge";
id.displayName = "StraightEdgeInternal";
function sd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = U.Bottom, targetPosition: a = U.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: w, pathOptions: m, interactionWidth: x }) => {
    const [y, v, S] = gc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), E = e.isInternal ? void 0 : t;
    return u(lo, { id: E, path: y, labelX: v, labelY: S, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: w, interactionWidth: x });
  });
}
const cx = sd({ isInternal: !1 }), ad = sd({ isInternal: !0 });
cx.displayName = "BezierEdge";
ad.displayName = "BezierEdgeInternal";
const ka = {
  default: ad,
  straight: id,
  step: rd,
  smoothstep: td,
  simplebezier: Qc
}, Ea = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, dx = (e, t, n) => n === U.Left ? e - t : n === U.Right ? e + t : e, ux = (e, t, n) => n === U.Top ? e - t : n === U.Bottom ? e + t : e, Sa = "react-flow__edgeupdater";
function Na({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return u("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: be([Sa, `${Sa}-${a}`]), cx: dx(t, r, e), cy: ux(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function fx({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: h, setReconnecting: f, setUpdateHover: p }) {
  const g = fe(), b = (v, S) => {
    if (v.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: C, connectionMode: T, connectionRadius: A, lib: L, onConnectStart: O, cancelConnection: B, nodeLookup: H, rfId: _, panBy: M, updateConnection: N } = g.getState(), $ = S.type === "target", P = (D, V) => {
      f(!1), h == null || h(D, n, S.type, V);
    }, I = (D) => c == null ? void 0 : c(n, D), z = (D, V) => {
      f(!0), d == null || d(v, n, S.type), O == null || O(D, V);
    };
    mi.onPointerDown(v.nativeEvent, {
      autoPanOnConnect: E,
      connectionMode: T,
      connectionRadius: A,
      domNode: C,
      handleId: S.id,
      nodeId: S.nodeId,
      nodeLookup: H,
      isTarget: $,
      edgeUpdaterType: S.type,
      lib: L,
      flowId: _,
      cancelConnection: B,
      panBy: M,
      isValidConnection: (...D) => {
        var V, j;
        return ((j = (V = g.getState()).isValidConnection) == null ? void 0 : j.call(V, ...D)) ?? !0;
      },
      onConnect: I,
      onConnectStart: z,
      onConnectEnd: (...D) => {
        var V, j;
        return (j = (V = g.getState()).onConnectEnd) == null ? void 0 : j.call(V, ...D);
      },
      onReconnectEnd: P,
      updateConnection: N,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: v.currentTarget
    });
  }, w = (v) => b(v, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (v) => b(v, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), x = () => p(!0), y = () => p(!1);
  return k(me, { children: [(e === !0 || e === "source") && u(Na, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: w, onMouseEnter: x, onMouseOut: y, type: "source" }), (e === !0 || e === "target") && u(Na, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: x, onMouseOut: y, type: "target" })] });
}
function hx({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: h, onReconnectStart: f, onReconnectEnd: p, rfId: g, edgeTypes: b, noPanClassName: w, onError: m, disableKeyboardA11y: x }) {
  let y = ae((K) => K.edgeLookup.get(e));
  const v = ae((K) => K.defaultEdgeOptions);
  y = v ? { ...v, ...y } : y;
  let S = y.type || "default", E = (b == null ? void 0 : b[S]) || ka[S];
  E === void 0 && (m == null || m("011", Ve.error011(S)), S = "default", E = (b == null ? void 0 : b.default) || ka.default);
  const C = !!(y.focusable || t && typeof y.focusable > "u"), T = typeof h < "u" && (y.reconnectable || n && typeof y.reconnectable > "u"), A = !!(y.selectable || r && typeof y.selectable > "u"), L = oe(null), [O, B] = Q(!1), [H, _] = Q(!1), M = fe(), { zIndex: N = y.zIndex, sourceX: $, sourceY: P, targetX: I, targetY: z, sourcePosition: D, targetPosition: V } = ae($e((K) => {
    const ee = K.nodeLookup.get(y.source), te = K.nodeLookup.get(y.target);
    if (!ee || !te)
      return Ea;
    const re = Hw({
      id: e,
      sourceNode: ee,
      targetNode: te,
      sourceHandle: y.sourceHandle || null,
      targetHandle: y.targetHandle || null,
      connectionMode: K.connectionMode,
      onError: m
    }), ie = Aw({
      selected: y.selected,
      zIndex: y.zIndex,
      sourceNode: ee,
      targetNode: te,
      elevateOnSelect: K.elevateEdgesOnSelect,
      zIndexMode: K.zIndexMode
    });
    return {
      ...re || Ea,
      zIndex: ie
    };
  }, [y.source, y.target, y.sourceHandle, y.targetHandle, y.selected, y.zIndex, m]), pe), j = le(() => y.markerStart ? `url('#${pi(y.markerStart, g)}')` : void 0, [y.markerStart, g]), G = le(() => y.markerEnd ? `url('#${pi(y.markerEnd, g)}')` : void 0, [y.markerEnd, g]);
  if (y.hidden || $ === null || P === null || I === null || z === null)
    return null;
  const Y = (K) => {
    var ie;
    const { addSelectedEdges: ee, unselectNodesAndEdges: te, multiSelectionActive: re } = M.getState();
    A && (M.setState({ nodesSelectionActive: !1 }), y.selected && re ? (te({ nodes: [], edges: [y] }), (ie = L.current) == null || ie.blur()) : ee([e])), o && o(K, y);
  }, ne = i ? (K) => {
    i(K, { ...y });
  } : void 0, Z = s ? (K) => {
    s(K, { ...y });
  } : void 0, R = a ? (K) => {
    a(K, { ...y });
  } : void 0, F = l ? (K) => {
    l(K, { ...y });
  } : void 0, q = c ? (K) => {
    c(K, { ...y });
  } : void 0, J = (K) => {
    var ee;
    if (!x && Jl.includes(K.key) && A) {
      const { unselectNodesAndEdges: te, addSelectedEdges: re } = M.getState();
      K.key === "Escape" ? ((ee = L.current) == null || ee.blur(), te({ edges: [y] })) : re([e]);
    }
  };
  return u("svg", { style: { zIndex: N }, children: k("g", { className: be([
    "react-flow__edge",
    `react-flow__edge-${S}`,
    y.className,
    w,
    {
      selected: y.selected,
      animated: y.animated,
      inactive: !A && !o,
      updating: O,
      selectable: A
    }
  ]), onClick: Y, onDoubleClick: ne, onContextMenu: Z, onMouseEnter: R, onMouseMove: F, onMouseLeave: q, onKeyDown: C ? J : void 0, tabIndex: C ? 0 : void 0, role: y.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": y.ariaLabel === null ? void 0 : y.ariaLabel || `Edge from ${y.source} to ${y.target}`, "aria-describedby": C ? `${Pc}-${g}` : void 0, ref: L, ...y.domAttributes, children: [!H && u(E, { id: e, source: y.source, target: y.target, type: y.type, selected: y.selected, animated: y.animated, selectable: A, deletable: y.deletable ?? !0, label: y.label, labelStyle: y.labelStyle, labelShowBg: y.labelShowBg, labelBgStyle: y.labelBgStyle, labelBgPadding: y.labelBgPadding, labelBgBorderRadius: y.labelBgBorderRadius, sourceX: $, sourceY: P, targetX: I, targetY: z, sourcePosition: D, targetPosition: V, data: y.data, style: y.style, sourceHandleId: y.sourceHandle, targetHandleId: y.targetHandle, markerStart: j, markerEnd: G, pathOptions: "pathOptions" in y ? y.pathOptions : void 0, interactionWidth: y.interactionWidth }), T && u(fx, { edge: y, isReconnectable: T, reconnectRadius: d, onReconnect: h, onReconnectStart: f, onReconnectEnd: p, sourceX: $, sourceY: P, targetX: I, targetY: z, sourcePosition: D, targetPosition: V, setUpdateHover: B, setReconnecting: _ })] }) });
}
var px = he(hx);
const gx = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function ld({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: h, onEdgeDoubleClick: f, onReconnectStart: p, onReconnectEnd: g, disableKeyboardA11y: b }) {
  const { edgesFocusable: w, edgesReconnectable: m, elementsSelectable: x, onError: y } = ae(gx, pe), v = Jv(t);
  return k("div", { className: "react-flow__edges", children: [u(ox, { defaultColor: e, rfId: n }), v.map((S) => u(px, { id: S, edgesFocusable: w, edgesReconnectable: m, elementsSelectable: x, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: h, onDoubleClick: f, onReconnectStart: p, onReconnectEnd: g, rfId: n, onError: y, edgeTypes: r, disableKeyboardA11y: b }, S))] });
}
ld.displayName = "EdgeRenderer";
const mx = he(ld), Ca = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function yx({ children: e }) {
  const t = fe(), n = oe(null), [r] = Q(() => t.getState().transform);
  return Wc(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = Ca(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), u("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Ca(r) }, children: e });
}
function wx(e) {
  const t = so(), n = oe(!1);
  de(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const bx = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function vx(e) {
  const t = ae(bx), n = fe();
  return de(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function xx(e) {
  return e.connection.inProgress ? { ...e.connection, to: Dn(e.connection.to, e.transform) } : { ...e.connection };
}
function _x(e) {
  return xx;
}
function kx(e) {
  const t = _x();
  return ae(t, pe);
}
const Ex = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Sx({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = ae(Ex, pe);
  return !(i && o && l) ? null : u("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: u("g", { className: be(["react-flow__connection", dc(a)]), children: u(cd, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const cd = ({ style: e, type: t = ct.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: h, toPosition: f, pointer: p } = kx();
  if (!o)
    return;
  if (n)
    return u(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: f, connectionStatus: dc(r), toNode: d, toHandle: h, pointer: p });
  let g = "";
  const b = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: f
  };
  switch (t) {
    case ct.Bezier:
      [g] = gc(b);
      break;
    case ct.SimpleBezier:
      [g] = Kc(b);
      break;
    case ct.Step:
      [g] = hi({
        ...b,
        borderRadius: 0
      });
      break;
    case ct.SmoothStep:
      [g] = hi(b);
      break;
    default:
      [g] = yc(b);
  }
  return u("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
cd.displayName = "ConnectionLine";
const Nx = {};
function Ma(e = Nx) {
  oe(e), fe(), de(() => {
  }, [e]);
}
function Cx() {
  fe(), oe(!1), de(() => {
  }, []);
}
function dd({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: h, onSelectionStart: f, onSelectionEnd: p, connectionLineType: g, connectionLineStyle: b, connectionLineComponent: w, connectionLineContainerStyle: m, selectionKeyCode: x, selectionOnDrag: y, selectionMode: v, multiSelectionKeyCode: S, panActivationKeyCode: E, zoomActivationKeyCode: C, deleteKeyCode: T, onlyRenderVisibleElements: A, elementsSelectable: L, defaultViewport: O, translateExtent: B, minZoom: H, maxZoom: _, preventScrolling: M, defaultMarkerColor: N, zoomOnScroll: $, zoomOnPinch: P, panOnScroll: I, panOnScrollSpeed: z, panOnScrollMode: D, zoomOnDoubleClick: V, panOnDrag: j, autoPanOnSelection: G, onPaneClick: Y, onPaneMouseEnter: ne, onPaneMouseMove: Z, onPaneMouseLeave: R, onPaneScroll: F, onPaneContextMenu: q, paneClickDistance: J, nodeClickDistance: K, onEdgeContextMenu: ee, onEdgeMouseEnter: te, onEdgeMouseMove: re, onEdgeMouseLeave: ie, reconnectRadius: ce, onReconnect: ke, onReconnectStart: Ee, onReconnectEnd: Te, noDragClassName: ze, noWheelClassName: ht, noPanClassName: Ge, disableKeyboardA11y: Qe, nodeExtent: Se, rfId: Le, viewport: _e, onViewportChange: Xe, nodesDraggable: Zt }) {
  return Ma(e), Ma(t), Cx(), wx(n), vx(_e), u(Fv, { onPaneClick: Y, onPaneMouseEnter: ne, onPaneMouseMove: Z, onPaneMouseLeave: R, onPaneContextMenu: q, onPaneScroll: F, paneClickDistance: J, deleteKeyCode: T, selectionKeyCode: x, selectionOnDrag: y, selectionMode: v, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: S, panActivationKeyCode: E, zoomActivationKeyCode: C, elementsSelectable: L, zoomOnScroll: $, zoomOnPinch: P, zoomOnDoubleClick: V, panOnScroll: I, panOnScrollSpeed: z, panOnScrollMode: D, panOnDrag: j, autoPanOnSelection: G, defaultViewport: O, translateExtent: B, minZoom: H, maxZoom: _, onSelectionContextMenu: h, preventScrolling: M, noDragClassName: ze, noWheelClassName: ht, noPanClassName: Ge, disableKeyboardA11y: Qe, onViewportChange: Xe, isControlledViewport: !!_e, children: k(yx, { children: [u(mx, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: ke, onReconnectStart: Ee, onReconnectEnd: Te, onlyRenderVisibleElements: A, onEdgeContextMenu: ee, onEdgeMouseEnter: te, onEdgeMouseMove: re, onEdgeMouseLeave: ie, reconnectRadius: ce, defaultMarkerColor: N, noPanClassName: Ge, disableKeyboardA11y: Qe, rfId: Le }), u(Sx, { style: b, type: g, component: w, containerStyle: m }), u("div", { className: "react-flow__edgelabel-renderer" }), u(Qv, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: K, onlyRenderVisibleElements: A, noPanClassName: Ge, noDragClassName: ze, disableKeyboardA11y: Qe, nodeExtent: Se, rfId: Le, nodesDraggable: Zt }), u("div", { className: "react-flow__viewport-portal" })] }) });
}
dd.displayName = "GraphView";
const Mx = he(dd), Ix = ac(), Ia = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: h, zIndexMode: f = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = r ?? t ?? [], x = n ?? e ?? [], y = d ?? [0, 0], v = h ?? Sn;
  vc(b, w, m);
  const { nodesInitialized: S } = gi(x, p, g, {
    nodeOrigin: y,
    nodeExtent: v,
    zIndexMode: f
  });
  let E = [0, 0, 1];
  if (s && o && i) {
    const C = On(p, {
      filter: (O) => !!((O.width || O.initialWidth) && (O.height || O.initialHeight))
    }), { x: T, y: A, zoom: L } = no(C, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    E = [T, A, L];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: E,
    nodes: x,
    nodesInitialized: S,
    nodeLookup: p,
    parentLookup: g,
    edges: m,
    edgeLookup: w,
    connectionLookup: b,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: Sn,
    nodeExtent: v,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Ft.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: y,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: s ?? !1,
    fitViewOptions: a,
    fitViewResolver: null,
    connection: { ...tc },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Ix,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: ec,
    zIndexMode: f,
    defaultEdgeOptions: void 0,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onNodesDelete: void 0,
    onEdgesDelete: void 0,
    onDelete: void 0,
    onBeforeDelete: void 0,
    onViewportChangeStart: void 0,
    onViewportChange: void 0,
    onViewportChangeEnd: void 0,
    onNodeDragStart: void 0,
    onNodeDrag: void 0,
    onNodeDragStop: void 0,
    onSelectionDragStart: void 0,
    onSelectionDrag: void 0,
    onSelectionDragStop: void 0,
    onMoveStart: void 0,
    onMove: void 0,
    onMoveEnd: void 0,
    onConnect: void 0,
    onConnectStart: void 0,
    onConnectEnd: void 0,
    onClickConnectStart: void 0,
    onClickConnectEnd: void 0
  };
}, $x = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: h, zIndexMode: f }) => Vb((p, g) => {
  async function b() {
    const { nodeLookup: w, panZoom: m, fitViewOptions: x, fitViewResolver: y, width: v, height: S, minZoom: E, maxZoom: C } = g();
    m && (await Ew({
      nodes: w,
      width: v,
      height: S,
      panZoom: m,
      minZoom: E,
      maxZoom: C
    }, x), y == null || y.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...Ia({
      nodes: e,
      edges: t,
      width: o,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: l,
      maxZoom: c,
      nodeOrigin: d,
      nodeExtent: h,
      defaultNodes: n,
      defaultEdges: r,
      zIndexMode: f
    }),
    setNodes: (w) => {
      const { nodeLookup: m, parentLookup: x, nodeOrigin: y, nodeExtent: v, elevateNodesOnSelect: S, fitViewQueued: E, zIndexMode: C, nodesSelectionActive: T } = g(), { nodesInitialized: A, hasSelectedNodes: L } = gi(w, m, x, {
        nodeOrigin: y,
        nodeExtent: v,
        elevateNodesOnSelect: S,
        checkEquality: !0,
        zIndexMode: C
      }), O = T && L;
      E && A ? (b(), p({
        nodes: w,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: O
      })) : p({ nodes: w, nodesInitialized: A, nodesSelectionActive: O });
    },
    setEdges: (w) => {
      const { connectionLookup: m, edgeLookup: x } = g();
      vc(m, x, w), p({ edges: w });
    },
    setDefaultNodesAndEdges: (w, m) => {
      if (w) {
        const { setNodes: x } = g();
        x(w), p({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: x } = g();
        x(m), p({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (w) => {
      const { triggerNodeChanges: m, nodeLookup: x, parentLookup: y, domNode: v, nodeOrigin: S, nodeExtent: E, debug: C, fitViewQueued: T, zIndexMode: A } = g(), { changes: L, updatedInternals: O } = Xw(w, x, y, v, S, E, A);
      O && (Fw(x, y, { nodeOrigin: S, nodeExtent: E, zIndexMode: A }), T ? (b(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), (L == null ? void 0 : L.length) > 0 && (C && console.log("React Flow: trigger node changes", L), m == null || m(L)));
    },
    updateNodePositions: (w, m = !1) => {
      const x = [];
      let y = [];
      const { nodeLookup: v, triggerNodeChanges: S, connection: E, updateConnection: C, onNodesChangeMiddlewareMap: T } = g();
      for (const [A, L] of w) {
        const O = v.get(A), B = !!(O != null && O.expandParent && (O != null && O.parentId) && (L != null && L.position)), H = {
          id: A,
          type: "position",
          position: B ? {
            x: Math.max(0, L.position.x),
            y: Math.max(0, L.position.y)
          } : L.position,
          dragging: m
        };
        if (O && E.inProgress && E.fromNode.id === O.id) {
          const _ = It(O, E.fromHandle, U.Left, !0);
          C({ ...E, from: _ });
        }
        B && O.parentId && x.push({
          id: A,
          parentId: O.parentId,
          rect: {
            ...L.internals.positionAbsolute,
            width: L.measured.width ?? 0,
            height: L.measured.height ?? 0
          }
        }), y.push(H);
      }
      if (x.length > 0) {
        const { parentLookup: A, nodeOrigin: L } = g(), O = Ui(x, v, A, L);
        y.push(...O);
      }
      for (const A of T.values())
        y = A(y);
      S(y);
    },
    triggerNodeChanges: (w) => {
      const { onNodesChange: m, setNodes: x, nodes: y, hasDefaultNodes: v, debug: S } = g();
      if (w != null && w.length) {
        if (v) {
          const E = cv(w, y);
          x(E);
        }
        S && console.log("React Flow: trigger node changes", w), m == null || m(w);
      }
    },
    triggerEdgeChanges: (w) => {
      const { onEdgesChange: m, setEdges: x, edges: y, hasDefaultEdges: v, debug: S } = g();
      if (w != null && w.length) {
        if (v) {
          const E = dv(w, y);
          x(E);
        }
        S && console.log("React Flow: trigger edge changes", w), m == null || m(w);
      }
    },
    addSelectedNodes: (w) => {
      const { multiSelectionActive: m, edgeLookup: x, nodeLookup: y, triggerNodeChanges: v, triggerEdgeChanges: S } = g();
      if (m) {
        const E = w.map((C) => vt(C, !0));
        v(E);
        return;
      }
      v(Rt(y, /* @__PURE__ */ new Set([...w]), !0)), S(Rt(x));
    },
    addSelectedEdges: (w) => {
      const { multiSelectionActive: m, edgeLookup: x, nodeLookup: y, triggerNodeChanges: v, triggerEdgeChanges: S } = g();
      if (m) {
        const E = w.map((C) => vt(C, !0));
        S(E);
        return;
      }
      S(Rt(x, /* @__PURE__ */ new Set([...w]))), v(Rt(y, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: w, edges: m } = {}) => {
      const { edges: x, nodes: y, nodeLookup: v, triggerNodeChanges: S, triggerEdgeChanges: E } = g(), C = w || y, T = m || x, A = [];
      for (const O of C) {
        if (!O.selected)
          continue;
        const B = v.get(O.id);
        B && (B.selected = !1), A.push(vt(O.id, !1));
      }
      const L = [];
      for (const O of T)
        O.selected && L.push(vt(O.id, !1));
      S(A), E(L);
    },
    setMinZoom: (w) => {
      const { panZoom: m, maxZoom: x } = g();
      m == null || m.setScaleExtent([w, x]), p({ minZoom: w });
    },
    setMaxZoom: (w) => {
      const { panZoom: m, minZoom: x } = g();
      m == null || m.setScaleExtent([x, w]), p({ maxZoom: w });
    },
    setTranslateExtent: (w) => {
      var m;
      (m = g().panZoom) == null || m.setTranslateExtent(w), p({ translateExtent: w });
    },
    resetSelectedElements: () => {
      const { edges: w, nodes: m, triggerNodeChanges: x, triggerEdgeChanges: y, elementsSelectable: v } = g();
      if (!v)
        return;
      const S = m.reduce((C, T) => T.selected ? [...C, vt(T.id, !1)] : C, []), E = w.reduce((C, T) => T.selected ? [...C, vt(T.id, !1)] : C, []);
      x(S), y(E);
    },
    setNodeExtent: (w) => {
      const { nodes: m, nodeLookup: x, parentLookup: y, nodeOrigin: v, elevateNodesOnSelect: S, nodeExtent: E, zIndexMode: C } = g();
      w[0][0] === E[0][0] && w[0][1] === E[0][1] && w[1][0] === E[1][0] && w[1][1] === E[1][1] || (gi(m, x, y, {
        nodeOrigin: v,
        nodeExtent: w,
        elevateNodesOnSelect: S,
        checkEquality: !1,
        zIndexMode: C
      }), p({ nodeExtent: w }));
    },
    panBy: (w) => {
      const { transform: m, width: x, height: y, panZoom: v, translateExtent: S } = g();
      return Uw({ delta: w, panZoom: v, transform: m, translateExtent: S, width: x, height: y });
    },
    setCenter: async (w, m, x) => {
      const { width: y, height: v, maxZoom: S, panZoom: E } = g();
      if (!E)
        return !1;
      const C = typeof (x == null ? void 0 : x.zoom) < "u" ? x.zoom : S;
      return await E.setViewport({
        x: y / 2 - w * C,
        y: v / 2 - m * C,
        zoom: C
      }, { duration: x == null ? void 0 : x.duration, ease: x == null ? void 0 : x.ease, interpolate: x == null ? void 0 : x.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...tc }
      });
    },
    updateConnection: (w) => {
      p({ connection: w });
    },
    reset: () => p({ ...Ia() })
  };
}, Object.is);
function Ki({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: h, zIndexMode: f, children: p }) {
  const [g] = Q(() => $x({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: r,
    width: o,
    height: i,
    fitView: c,
    minZoom: s,
    maxZoom: a,
    fitViewOptions: l,
    nodeOrigin: d,
    nodeExtent: h,
    zIndexMode: f
  }));
  return u(Fb, { value: g, children: u(gv, { children: u($v, { children: p }) }) });
}
function Ax({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: h, nodeExtent: f, zIndexMode: p }) {
  return qt(io) ? u(me, { children: e }) : u(Ki, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: h, nodeExtent: f, zIndexMode: p, children: e });
}
const Tx = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function zx({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: h, onMoveEnd: f, onConnect: p, onConnectStart: g, onConnectEnd: b, onClickConnectStart: w, onClickConnectEnd: m, onNodeMouseEnter: x, onNodeMouseMove: y, onNodeMouseLeave: v, onNodeContextMenu: S, onNodeDoubleClick: E, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onNodesDelete: L, onEdgesDelete: O, onDelete: B, onSelectionChange: H, onSelectionDragStart: _, onSelectionDrag: M, onSelectionDragStop: N, onSelectionContextMenu: $, onSelectionStart: P, onSelectionEnd: I, onBeforeDelete: z, connectionMode: D, connectionLineType: V = ct.Bezier, connectionLineStyle: j, connectionLineComponent: G, connectionLineContainerStyle: Y, deleteKeyCode: ne = "Backspace", selectionKeyCode: Z = "Shift", selectionOnDrag: R = !1, selectionMode: F = Nn.Full, panActivationKeyCode: q = "Space", multiSelectionKeyCode: J = Mn() ? "Meta" : "Control", zoomActivationKeyCode: K = Mn() ? "Meta" : "Control", snapToGrid: ee, snapGrid: te, onlyRenderVisibleElements: re = !1, selectNodesOnDrag: ie, nodesDraggable: ce, autoPanOnNodeFocus: ke, nodesConnectable: Ee, nodesFocusable: Te, nodeOrigin: ze = Dc, edgesFocusable: ht, edgesReconnectable: Ge, elementsSelectable: Qe = !0, defaultViewport: Se = nv, minZoom: Le = 0.5, maxZoom: _e = 2, translateExtent: Xe = Sn, preventScrolling: Zt = !0, nodeExtent: Je, defaultMarkerColor: co = "#b1b1b7", zoomOnScroll: Qt = !0, zoomOnPinch: Jt = !0, panOnScroll: uo = !1, panOnScrollSpeed: Rn = 0.5, panOnScrollMode: en = Et.Free, zoomOnDoubleClick: tn = !0, panOnDrag: fo = !0, onPaneClick: ho, onPaneMouseEnter: zt, onPaneMouseMove: nn, onPaneMouseLeave: ge, onPaneScroll: et, onPaneContextMenu: Hn, paneClickDistance: pt = 1, nodeClickDistance: Lt = 0, children: Wn, onReconnect: Bn, onReconnectStart: Vn, onReconnectEnd: po, onEdgeContextMenu: go, onEdgeDoubleClick: mo, onEdgeMouseEnter: yo, onEdgeMouseMove: Pe, onEdgeMouseLeave: rn, reconnectRadius: on = 10, onNodesChange: wo, onEdgesChange: sn, noDragClassName: bo = "nodrag", noWheelClassName: Fn = "nowheel", noPanClassName: jn = "nopan", fitView: Yn, fitViewOptions: Gn, connectOnClick: vo, attributionPosition: xo, proOptions: _o, defaultEdgeOptions: ko, elevateNodesOnSelect: Eo = !0, elevateEdgesOnSelect: So = !1, disableKeyboardA11y: Xn = !1, autoPanOnConnect: No, autoPanOnNodeDrag: Co, autoPanOnSelection: Mo = !0, autoPanSpeed: Io, connectionRadius: an, isValidConnection: gt, onError: ln, style: cn, id: Un, nodeDragThreshold: $o, connectionDragThreshold: qn, viewport: Kn, onViewportChange: Zn, width: Qn, height: Jn, colorMode: er = "light", debug: tr, onScroll: mt, ariaLabelConfig: Ao, zIndexMode: Ne = "basic", ...nr }, rr) {
  const dn = Un || "1", To = sv(er), or = $e((un) => {
    un.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), mt == null || mt(un);
  }, [mt]);
  return u("div", { "data-testid": "rf__wrapper", ...nr, onScroll: or, style: { ...cn, ...Tx }, ref: rr, className: be(["react-flow", o, To]), id: Un, role: "application", children: k(Ax, { nodes: e, edges: t, width: Qn, height: Jn, fitView: Yn, fitViewOptions: Gn, minZoom: Le, maxZoom: _e, nodeOrigin: ze, nodeExtent: Je, zIndexMode: Ne, children: [u(iv, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: p, onConnectStart: g, onConnectEnd: b, onClickConnectStart: w, onClickConnectEnd: m, nodesDraggable: ce, autoPanOnNodeFocus: ke, nodesConnectable: Ee, nodesFocusable: Te, edgesFocusable: ht, edgesReconnectable: Ge, elementsSelectable: Qe, elevateNodesOnSelect: Eo, elevateEdgesOnSelect: So, minZoom: Le, maxZoom: _e, nodeExtent: Je, onNodesChange: wo, onEdgesChange: sn, snapToGrid: ee, snapGrid: te, connectionMode: D, translateExtent: Xe, connectOnClick: vo, defaultEdgeOptions: ko, fitView: Yn, fitViewOptions: Gn, onNodesDelete: L, onEdgesDelete: O, onDelete: B, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onSelectionDrag: M, onSelectionDragStart: _, onSelectionDragStop: N, onMove: d, onMoveStart: h, onMoveEnd: f, noPanClassName: jn, nodeOrigin: ze, rfId: dn, autoPanOnConnect: No, autoPanOnNodeDrag: Co, autoPanSpeed: Io, onError: ln, connectionRadius: an, isValidConnection: gt, selectNodesOnDrag: ie, nodeDragThreshold: $o, connectionDragThreshold: qn, onBeforeDelete: z, debug: tr, ariaLabelConfig: Ao, zIndexMode: Ne }), u(Mx, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: x, onNodeMouseMove: y, onNodeMouseLeave: v, onNodeContextMenu: S, onNodeDoubleClick: E, nodeTypes: i, edgeTypes: s, connectionLineType: V, connectionLineStyle: j, connectionLineComponent: G, connectionLineContainerStyle: Y, selectionKeyCode: Z, selectionOnDrag: R, selectionMode: F, deleteKeyCode: ne, multiSelectionKeyCode: J, panActivationKeyCode: q, zoomActivationKeyCode: K, onlyRenderVisibleElements: re, defaultViewport: Se, translateExtent: Xe, minZoom: Le, maxZoom: _e, preventScrolling: Zt, zoomOnScroll: Qt, zoomOnPinch: Jt, zoomOnDoubleClick: tn, panOnScroll: uo, panOnScrollSpeed: Rn, panOnScrollMode: en, panOnDrag: fo, autoPanOnSelection: Mo, onPaneClick: ho, onPaneMouseEnter: zt, onPaneMouseMove: nn, onPaneMouseLeave: ge, onPaneScroll: et, onPaneContextMenu: Hn, paneClickDistance: pt, nodeClickDistance: Lt, onSelectionContextMenu: $, onSelectionStart: P, onSelectionEnd: I, onReconnect: Bn, onReconnectStart: Vn, onReconnectEnd: po, onEdgeContextMenu: go, onEdgeDoubleClick: mo, onEdgeMouseEnter: yo, onEdgeMouseMove: Pe, onEdgeMouseLeave: rn, reconnectRadius: on, defaultMarkerColor: co, noDragClassName: bo, noWheelClassName: Fn, noPanClassName: jn, rfId: dn, disableKeyboardA11y: Xn, nodeExtent: Je, viewport: Kn, onViewportChange: Zn, nodesDraggable: ce }), u(tv, { onSelectionChange: H }), Wn, u(Kb, { proOptions: _o, position: xo }), u(qb, { rfId: dn, disableKeyboardA11y: Xn })] }) });
}
var ud = Hc(zx);
function Lx({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return u("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: be(["react-flow__background-pattern", n, r]) });
}
function Ox({ radius: e, className: t }) {
  return u("circle", { cx: e, cy: e, r: e, className: be(["react-flow__background-pattern", "dots", t]) });
}
var ut;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(ut || (ut = {}));
const Px = {
  [ut.Dots]: 1,
  [ut.Lines]: 1,
  [ut.Cross]: 6
}, Dx = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function fd({
  id: e,
  variant: t = ut.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: r,
  lineWidth: o = 1,
  offset: i = 0,
  color: s,
  bgColor: a,
  style: l,
  className: c,
  patternClassName: d
}) {
  const h = oe(null), { transform: f, patternId: p } = ae(Dx, pe), g = r || Px[t], b = t === ut.Dots, w = t === ut.Cross, m = Array.isArray(n) ? n : [n, n], x = [m[0] * f[2] || 1, m[1] * f[2] || 1], y = g * f[2], v = Array.isArray(i) ? i : [i, i], S = w ? [y, y] : x, E = [
    v[0] * f[2] + S[0] / 2,
    v[1] * f[2] + S[1] / 2
  ], C = `${p}${e || ""}`;
  return k("svg", { className: be(["react-flow__background", c]), style: {
    ...l,
    ...ao,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: h, "data-testid": "rf__background", children: [u("pattern", { id: C, x: f[0] % x[0], y: f[1] % x[1], width: x[0], height: x[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: b ? u(Ox, { radius: y / 2, className: d }) : u(Lx, { dimensions: S, lineWidth: o, variant: t, className: d }) }), u("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
fd.displayName = "Background";
const hd = he(fd);
function Rx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: u("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Hx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: u("path", { d: "M0 0h32v4.2H0z" }) });
}
function Wx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: u("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function Bx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Vx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function gr({ children: e, className: t, ...n }) {
  return u("button", { type: "button", className: be(["react-flow__controls-button", t]), ...n, children: e });
}
const Fx = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function pd({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: h = "bottom-left", orientation: f = "vertical", "aria-label": p }) {
  const g = fe(), { isInteractive: b, minZoomReached: w, maxZoomReached: m, ariaLabelConfig: x } = ae(Fx, pe), { zoomIn: y, zoomOut: v, fitView: S } = so(), E = () => {
    y(), i == null || i();
  }, C = () => {
    v(), s == null || s();
  }, T = () => {
    S(o), a == null || a();
  }, A = () => {
    g.setState({
      nodesDraggable: !b,
      nodesConnectable: !b,
      elementsSelectable: !b
    }), l == null || l(!b);
  };
  return k($t, { className: be(["react-flow__controls", f === "horizontal" ? "horizontal" : "vertical", c]), position: h, style: e, "data-testid": "rf__controls", "aria-label": p ?? x["controls.ariaLabel"], children: [t && k(me, { children: [u(gr, { onClick: E, className: "react-flow__controls-zoomin", title: x["controls.zoomIn.ariaLabel"], "aria-label": x["controls.zoomIn.ariaLabel"], disabled: m, children: u(Rx, {}) }), u(gr, { onClick: C, className: "react-flow__controls-zoomout", title: x["controls.zoomOut.ariaLabel"], "aria-label": x["controls.zoomOut.ariaLabel"], disabled: w, children: u(Hx, {}) })] }), n && u(gr, { className: "react-flow__controls-fitview", onClick: T, title: x["controls.fitView.ariaLabel"], "aria-label": x["controls.fitView.ariaLabel"], children: u(Wx, {}) }), r && u(gr, { className: "react-flow__controls-interactive", onClick: A, title: x["controls.interactive.ariaLabel"], "aria-label": x["controls.interactive.ariaLabel"], children: b ? u(Vx, {}) : u(Bx, {}) }), d] });
}
pd.displayName = "Controls";
const gd = he(pd);
function jx({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: h, selected: f, onClick: p }) {
  const { background: g, backgroundColor: b } = i || {}, w = s || g || b;
  return u("rect", { className: be(["react-flow__minimap-node", { selected: f }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: w,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: h, onClick: p ? (m) => p(m, e) : void 0 });
}
const Yx = he(jx), Gx = (e) => e.nodes.map((t) => t.id), Ko = (e) => e instanceof Function ? e : () => e;
function Xx({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Yx,
  onClick: s
}) {
  const a = ae(Gx, pe), l = Ko(t), c = Ko(e), d = Ko(n), h = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return u(me, { children: a.map((f) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    u(qx, { id: f, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: h }, f)
  )) });
}
function Ux({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: h, width: f, height: p } = ae((g) => {
    const b = g.nodeLookup.get(e);
    if (!b)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const w = b.internals.userNode, { x: m, y: x } = b.internals.positionAbsolute, { width: y, height: v } = Ye(w);
    return {
      node: w,
      x: m,
      y: x,
      width: y,
      height: v
    };
  }, pe);
  return !c || c.hidden || !lc(c) ? null : u(a, { x: d, y: h, width: f, height: p, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const qx = he(Ux);
var Kx = he(Xx);
const Zx = 200, Qx = 150, Jx = (e) => !e.hidden, e1 = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  let n = !1;
  for (const r of e.nodeLookup.values())
    if (!r.hidden) {
      n = !0;
      break;
    }
  return {
    viewBB: t,
    boundingRect: n ? ic(On(e.nodeLookup, { filter: Jx }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, $a = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, t1 = (e, t) => $a(e.viewBB, t.viewBB) && $a(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, n1 = "react-flow__minimap-desc";
function md({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: r,
  nodeClassName: o = "",
  nodeBorderRadius: i = 5,
  nodeStrokeWidth: s,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a,
  bgColor: l,
  maskColor: c,
  maskStrokeColor: d,
  maskStrokeWidth: h,
  position: f = "bottom-right",
  onClick: p,
  onNodeClick: g,
  pannable: b = !1,
  zoomable: w = !1,
  ariaLabel: m,
  inversePan: x,
  zoomStep: y = 1,
  offsetScale: v = 5
}) {
  const S = fe(), E = oe(null), { boundingRect: C, panZoom: T, viewBB: A, rfId: L, translateExtent: O, flowWidth: B, flowHeight: H, ariaLabelConfig: _ } = ae(e1, t1), M = (e == null ? void 0 : e.width) ?? Zx, N = (e == null ? void 0 : e.height) ?? Qx, $ = C.width / M, P = C.height / N, I = Math.max($, P), z = I * M, D = I * N, V = v * I, j = C.x - (z - C.width) / 2 - V, G = C.y - (D - C.height) / 2 - V, Y = z + V * 2, ne = D + V * 2, Z = `${n1}-${L}`, R = oe(0), F = oe();
  R.current = I, de(() => {
    const te = S.getState().panZoom;
    if (E.current && te)
      return F.current = rb({
        domNode: E.current,
        panZoom: te,
        getTransform: () => S.getState().transform,
        getViewScale: () => R.current
      }), () => {
        var re;
        (re = F.current) == null || re.destroy();
      };
  }, [T]), de(() => {
    var te;
    (te = F.current) == null || te.update({
      translateExtent: O,
      width: B,
      height: H,
      inversePan: x,
      pannable: b,
      zoomStep: y,
      zoomable: w
    });
  }, [b, w, x, y, O, B, H]);
  const q = p ? (te) => {
    var ce;
    const [re, ie] = ((ce = F.current) == null ? void 0 : ce.pointer(te)) || [0, 0];
    p(te, { x: re, y: ie });
  } : void 0, J = $e((te, re) => {
    const ie = S.getState().nodeLookup.get(re).internals.userNode;
    g == null || g(te, ie);
  }, [g]), K = g ? J : void 0, ee = m ?? _["minimap.ariaLabel"];
  return u($t, { position: f, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof h == "number" ? h * I : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: be(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: k("svg", { width: M, height: N, viewBox: `${j} ${G} ${Y} ${ne}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": Z, ref: E, onClick: q, children: [ee && u("title", { id: Z, children: ee }), u(Kx, { onClick: K, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), u("path", { className: "react-flow__minimap-mask", d: `M${j - V},${G - V}h${Y + V * 2}v${ne + V * 2}h${-Y - V * 2}z
        M${A.x},${A.y}h${A.width}v${A.height}h${-A.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
md.displayName = "MiniMap";
const yd = he(md), r1 = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, o1 = {
  [Xt.Line]: "right",
  [Xt.Handle]: "bottom-right"
};
function i1({ nodeId: e, position: t, variant: n = Xt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: h = !1, resizeDirection: f, autoScale: p = !0, shouldResize: g, onResizeStart: b, onResize: w, onResizeEnd: m }) {
  const x = jc(), y = typeof e == "string" ? e : x, v = fe(), S = oe(null), E = n === Xt.Handle, C = ae($e(r1(E && p), [E, p]), pe), T = oe(null), A = t ?? o1[n];
  de(() => {
    if (!(!S.current || !y))
      return T.current || (T.current = mb({
        domNode: S.current,
        nodeId: y,
        getStoreItems: () => {
          const { nodeLookup: O, transform: B, snapGrid: H, snapToGrid: _, nodeOrigin: M, domNode: N } = v.getState();
          return {
            nodeLookup: O,
            transform: B,
            snapGrid: H,
            snapToGrid: _,
            nodeOrigin: M,
            paneDomNode: N
          };
        },
        onChange: (O, B) => {
          const { triggerNodeChanges: H, nodeLookup: _, parentLookup: M, nodeOrigin: N } = v.getState(), $ = [], P = { x: O.x, y: O.y }, I = _.get(y);
          if (I && I.expandParent && I.parentId) {
            const z = I.origin ?? N, D = O.width ?? I.measured.width ?? 0, V = O.height ?? I.measured.height ?? 0, j = {
              id: I.id,
              parentId: I.parentId,
              rect: {
                width: D,
                height: V,
                ...cc({
                  x: O.x ?? I.position.x,
                  y: O.y ?? I.position.y
                }, { width: D, height: V }, I.parentId, _, z)
              }
            }, G = Ui([j], _, M, N);
            $.push(...G), P.x = O.x ? Math.max(z[0] * D, O.x) : void 0, P.y = O.y ? Math.max(z[1] * V, O.y) : void 0;
          }
          if (P.x !== void 0 && P.y !== void 0) {
            const z = {
              id: y,
              type: "position",
              position: { ...P }
            };
            $.push(z);
          }
          if (O.width !== void 0 && O.height !== void 0) {
            const D = {
              id: y,
              type: "dimensions",
              resizing: !0,
              setAttributes: f ? f === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: O.width,
                height: O.height
              }
            };
            $.push(D);
          }
          for (const z of B) {
            const D = {
              ...z,
              type: "position"
            };
            $.push(D);
          }
          H($);
        },
        onEnd: ({ width: O, height: B }) => {
          const H = {
            id: y,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: O,
              height: B
            }
          };
          v.getState().triggerNodeChanges([H]);
        }
      })), T.current.update({
        controlPosition: A,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: d
        },
        keepAspectRatio: h,
        resizeDirection: f,
        onResizeStart: b,
        onResize: w,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        var O;
        (O = T.current) == null || O.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    d,
    h,
    b,
    w,
    m,
    g
  ]);
  const L = A.split("-");
  return u("div", { className: be(["react-flow__resize-control", "nodrag", ...L, n, r]), ref: S, style: {
    ...o,
    scale: C,
    ...s && { [E ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
he(i1);
const s1 = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", Zi = 0.05, wd = 370, Aa = 88, a1 = 44, Qi = 560, Ta = "system-map-flow-css", l1 = `
.system-map-flow .react-flow {
  --xy-background-color: transparent;
  --xy-edge-stroke: var(--border-strong, #a1a1aa);
  --xy-controls-button-background-color: var(--card, #fff);
  --xy-controls-button-background-color-hover: var(--bg-hover, #f4f4f5);
  --xy-controls-button-color: var(--text, #18181b);
  --xy-controls-button-border-color: var(--border, #e4e4e7);
  --xy-minimap-background-color: var(--card, #fff);
  --xy-minimap-node-background-color: var(--border-strong, #a1a1aa);
  --xy-attribution-background-color: transparent;
}
.system-map-flow .react-flow__handle { opacity: 0; pointer-events: none; min-width: 1px; min-height: 1px; }
.system-map-flow .react-flow__node { cursor: pointer; }
`;
if (!document.getElementById(Ta)) {
  const e = document.createElement("style");
  e.id = Ta, e.textContent = s1 + l1, document.head.appendChild(e);
}
function Ji() {
  return ae((e) => e.width);
}
const c1 = 16;
function bd(e, t, n = "center") {
  const r = so(), o = ae((a) => a.width), i = ae((a) => a.height), s = oe(!1);
  de(() => {
    if (!o || !i || e.length === 0) return;
    const a = Math.min(...e.map((g) => g.x)), l = Math.min(...e.map((g) => g.y)), c = Math.max(...e.map((g) => g.x + g.width)), d = Math.max(...e.map((g) => g.y + g.height)), h = Math.min(t, o * 0.5), f = no(
      { x: a, y: l, width: c - a, height: d - l },
      o - h,
      Math.max(120, i - Aa - a1),
      Zi,
      1,
      0.05
    ), p = n === "top" ? Math.min(f.y, c1 - l * f.zoom) : f.y;
    r.setViewport({ ...f, y: p + Aa }, { duration: s.current ? 200 : 0 }), s.current = !0;
  }, [r, e, t, o, i, n]);
}
function d1({ layers: e }) {
  return /* @__PURE__ */ k("div", { className: "sm-layers", role: "group", "aria-label": "Map layers", children: [
    /* @__PURE__ */ u("span", { className: "sm-layers-label", children: "Layers" }),
    e.map((t) => /* @__PURE__ */ u("button", { type: "button", className: "sm-plain sm-layer", "aria-pressed": t.on, title: t.title, disabled: t.disabled, onClick: t.onToggle, children: t.label }, t.key))
  ] });
}
function vd({ children: e }) {
  return /* @__PURE__ */ u("div", { className: "sm-tools", children: e });
}
function u1({ title: e, onBack: t }) {
  return /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
    /* @__PURE__ */ k(ve, { variant: "aim", children: [
      "Showing: ",
      e
    ] }),
    /* @__PURE__ */ u(se, { onClick: t, children: "Back to today" })
  ] });
}
const Nr = { names: 210, keys: 240, columns: 240 }, wi = 34, vn = 20, f1 = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, h1 = he(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", h = f1[n.status], f = (h == null ? void 0 : h.color) ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ k(
    "div",
    {
      style: {
        width: l,
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${h ? 2 : 1}px ${d || h != null && h.dashed ? "dashed" : "solid"} ${a ? "var(--accent, #2563eb)" : f}`,
        boxShadow: a ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : void 0,
        fontSize: 12
      },
      children: [
        /* @__PURE__ */ u(ft, { type: "target", position: U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(ft, { type: "source", position: U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              height: wi,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "0 10px",
              fontSize: c ? 16 : 13,
              fontWeight: 600,
              background: r.length ? "var(--bg-hover, #f4f4f5)" : void 0
            },
            children: [
              /* @__PURE__ */ u("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                h && /* @__PURE__ */ u("span", { style: { color: h.color, fontWeight: 600 }, children: n.status }),
                s > 0 && /* @__PURE__ */ k("span", { style: { fontWeight: s > 1 ? 600 : 400, color: s > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
                  s,
                  " at work"
                ] }),
                i > 0 && /* @__PURE__ */ u("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                d && /* @__PURE__ */ u("span", { style: X, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((p) => /* @__PURE__ */ k(
          "div",
          {
            style: { height: vn, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ u("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: p.primary ? "PK" : p.foreign ? "FK" : p.proposed ? "new" : "" }),
              /* @__PURE__ */ u("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: p.proposed ? 600 : void 0 }, children: p.name }),
              /* @__PURE__ */ u("span", { style: { ...X, ...xe, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.type })
            ]
          },
          p.name
        )),
        o > 0 && /* @__PURE__ */ k("div", { style: { ...X, height: vn, padding: "0 10px", lineHeight: `${vn}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), p1 = { table: h1 };
function xd(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Vr(e, t) {
  if (t === "names") return wi + 2;
  const n = xd(e, t).length;
  return wi + n * vn + (n < e.columns.length ? vn : 0) + 2;
}
function g1(e, t) {
  const n = Nr[t], r = new Ar.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Vr(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  Ar.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Vr(a, t) / 2 });
  }
  return s;
}
function m1(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const bi = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function y1(e) {
  return (bi.find(([t]) => t === e) ?? bi[2])[1];
}
function w1() {
  return /* @__PURE__ */ k(
    "div",
    {
      "data-testid": "legend",
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        /* @__PURE__ */ u("span", { style: X, children: "On delete" }),
        bi.map(([e, t]) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function b1({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  tools: i,
  onSelect: s
}) {
  const { mode: a } = Ha(), l = Ji() >= Qi, c = le(() => t ? m1(e, t) : e, [e, t]), d = t && o === "names" ? "keys" : o, h = le(() => g1(c, d), [c, d]), f = le(
    () => c.tables.map((b) => {
      const w = xd(b, d);
      return {
        id: b.id,
        type: "table",
        position: h.get(b.id) ?? { x: 0, y: 0 },
        width: Nr[d],
        height: Vr(b, d),
        data: {
          table: b,
          columns: w,
          hidden: d === "names" ? 0 : b.columns.length - w.length,
          flags: n.get(b.id) ?? 0,
          working: r.get(b.id) ?? 0,
          focused: b.id === t,
          width: Nr[d],
          large: d === "names"
        }
      };
    }),
    [c, d, h, n, r, t]
  ), p = le(
    () => c.edges.map((b) => {
      const w = y1(b.on_delete);
      return {
        id: b.id,
        source: b.source,
        target: b.target,
        selectable: !1,
        markerEnd: { type: jt.ArrowClosed, width: 14, height: 14, color: w },
        style: { stroke: w, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [c, t]
  ), g = le(
    () => c.tables.map((b) => ({
      ...h.get(b.id) ?? { x: 0, y: 0 },
      width: Nr[d],
      height: Vr(b, d)
    })),
    [c, h, d]
  );
  return bd(g, t ? wd : 0), /* @__PURE__ */ k(
    ud,
    {
      nodes: f,
      edges: p,
      nodeTypes: p1,
      colorMode: a,
      minZoom: Zi,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (b, w) => s(w.id),
      onPaneClick: () => s(null),
      children: [
        /* @__PURE__ */ u(hd, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(gd, { showInteractive: !1 }),
        l && /* @__PURE__ */ u(yd, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u($t, { position: "top-left", children: /* @__PURE__ */ k(vd, { children: [
          i,
          /* @__PURE__ */ u(w1, {})
        ] }) })
      ]
    }
  );
}
function v1(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ u(Ki, { children: /* @__PURE__ */ u(b1, { ...e }) }) });
}
const x1 = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], _1 = {
  whatif: {
    placeholder: "What if we sent weekly reminders?",
    ask: (e) => `Use the system-map tools. Draft a proposal with \`propose\` for this idea, using the real schema, and fix what its limits show: ${e}`
  },
  cases: {
    placeholder: "A customer sees which invoices are due this week",
    ask: (e) => `Use the system-map tools. Map this use case with \`use_case\`, to the routes, tables and modules it needs, naming parts that do not exist yet: ${e}`
  },
  views: {
    placeholder: "Show everything around the users table",
    ask: (e) => `Use the system-map tools. Save this as a view with \`save_view\`: ${e}`
  }
}, k1 = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], _d = { accepted: "ok", dropped: "muted", draft: "aim" }, za = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, es = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, E1 = { ...es, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, S1 = { ...X, ...xe, fontSize: 11, overflowWrap: "anywhere" };
function $n(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function vi(e) {
  return Kt(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function xi({ title: e, children: t }) {
  return /* @__PURE__ */ k("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function kd({ limit: e }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ u(An, { severity: e.severity }),
    /* @__PURE__ */ k("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ u("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u("div", { style: { ...X, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ u("div", { style: S1, children: e.evidence.join("  ") })
    ] })
  ] });
}
function mr({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ u(xi, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ u("button", { style: { ...Ie, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? vi(o.id) }),
    r && /* @__PURE__ */ u("span", { style: { ...X, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function N1({
  proposal: e,
  shown: t,
  canAsk: n,
  onBack: r,
  onDraw: o,
  onNode: i,
  onAsk: s,
  onStatus: a,
  onDelete: l
}) {
  const c = e.sql.flatMap((d) => d.sql);
  return /* @__PURE__ */ k("div", { "data-testid": "proposal-detail", children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ u(se, { onClick: r, children: "Back" }),
      /* @__PURE__ */ u("strong", { style: { fontSize: 14, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(ve, { variant: _d[e.status], children: e.status }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(se, { primary: t, onClick: () => o("map"), children: "Show on map" }),
      /* @__PURE__ */ u(se, { onClick: () => o("data"), children: "Show in data model" }),
      /* @__PURE__ */ u(se, { onClick: s, disabled: !n, children: "Ask" })
    ] }),
    e.why && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13, margin: "6px 0 0" }, children: e.why }),
    e.closes.map((d) => /* @__PURE__ */ k("p", { style: { fontSize: 13, margin: "8px 0 0" }, "data-testid": "closes", children: [
      "Closes ",
      d.before - d.after,
      " of ",
      $n(d.before, "gap"),
      " in ",
      /* @__PURE__ */ u("strong", { children: d.title }),
      "."
    ] }, d.id)),
    k1.map(({ kind: d, title: h }) => {
      const f = e.limits.filter((p) => p.kind === d);
      return f.length === 0 ? null : /* @__PURE__ */ u(xi, { title: `${h} (${f.length})`, children: f.map((p, g) => /* @__PURE__ */ u(kd, { limit: p }, g)) }, d);
    }),
    /* @__PURE__ */ u(mr, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ u(mr, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ u(mr, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ u(mr, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    e.limits_checked === !1 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, "data-testid": "limits-note", children: "Limits check Postgres only, so this hasn't been checked against this project's database." }),
    c.length > 0 && /* @__PURE__ */ u(xi, { title: "Draft SQL", children: /* @__PURE__ */ u("pre", { style: { ...xe, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
`) }) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      e.status !== "accepted" && /* @__PURE__ */ u(se, { primary: !0, onClick: () => a("accepted"), children: "Accept" }),
      e.status !== "dropped" && /* @__PURE__ */ u(se, { onClick: () => a("dropped"), children: "Drop" }),
      e.status !== "draft" && /* @__PURE__ */ u(se, { onClick: () => a("draft"), children: "Back to draft" }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(se, { danger: !0, onClick: l, children: "Delete" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...X, fontSize: 12, marginBottom: 0 }, children: "This stays in System Map. Nothing here changes your repo." })
  ] });
}
function C1({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ k("button", { style: E1, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ k("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ u(ve, { variant: "err", children: $n(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ k(ve, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ u(ve, { variant: _d[n.status], children: n.status })
      ] }),
      /* @__PURE__ */ k("span", { style: { ...X, fontSize: 12 }, children: [
        n.diff.added,
        " added, ",
        n.diff.changed,
        " changed, ",
        n.diff.removed,
        " removed, ",
        n.diff.touched,
        " touched"
      ] })
    ] }, n.id);
  }) });
}
function M1(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${$n(n, "unit test")}`, t ? $n(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${Gr(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function I1({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ k("div", { style: es, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(ve, { variant: za[e.state].variant, children: za[e.state].label }),
      /* @__PURE__ */ u("button", { style: Ie, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ u("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ u("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ u(kd, { limit: i }, s)) }),
    /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ u("tbody", { children: e.parts.map((i) => /* @__PURE__ */ k("tr", { children: [
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", ...X }, children: i.kind }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ u("button", { style: { ...Ie, textAlign: "left" }, onClick: () => n(i.id), children: vi(i.id) }) : vi(i.id) }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 0", ...X, textAlign: "right" }, children: M1(i) })
    ] }, i.id)) }) })
  ] });
}
function $1({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ k("div", { style: { ...es, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ u("button", { style: { ...Ie, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ k("span", { style: { ...X, fontSize: 12 }, children: [
      $n(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ u("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function A1({
  data: e,
  proposal: t,
  shownProposal: n,
  canAsk: r,
  tab: o,
  onTab: i,
  onSend: s,
  onOpenProposal: a,
  onDrawProposal: l,
  onStatus: c,
  onDelete: d,
  onOpenView: h,
  onNode: f
}) {
  const [p, g] = Q(""), b = _1[o], w = () => {
    p.trim() && (s(b.ask(p.trim())), g(""));
  };
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: x1.map(([m, x]) => /* @__PURE__ */ u(se, { primary: o === m, onClick: () => i(m), children: x }, m)) }),
    /* @__PURE__ */ k(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (m) => {
          m.preventDefault(), w();
        },
        children: [
          /* @__PURE__ */ u(jr, { "aria-label": "Describe it", placeholder: b.placeholder, value: p, onChange: (m) => g(m.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ u(se, { primary: !0, type: "submit", disabled: !r || !p.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ u(
        N1,
        {
          proposal: t,
          shown: n === t.id,
          canAsk: r,
          onBack: () => a(null),
          onDraw: l,
          onNode: f,
          onAsk: () => s(`Use the system-map tools. Read proposal ${t.id}, say what stands in the way, and how to get past it.`),
          onStatus: (m) => c(t.id, m),
          onDelete: () => d("proposals", t.id)
        }
      ) : /* @__PURE__ */ u(C1, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((m) => /* @__PURE__ */ u(
          I1,
          {
            item: m,
            canAsk: r,
            onShow: f,
            onAsk: () => s(`Use the system-map tools. Look at use case ${m.id}, and propose what would close its gaps.`),
            onDelete: () => d("use_cases", m.id)
          },
          m.id
        ))
      ] }),
      o === "views" && /* @__PURE__ */ u($1, { rows: e.views, onOpen: h, onDelete: (m) => d("views", m) })
    ] })
  ] });
}
const T1 = ["high", "medium", "low", "info"];
function z1({
  findings: e,
  noSchema: t = !1,
  onShow: n,
  onAsk: r
}) {
  const [o, i] = Q(null), s = le(() => {
    const l = /* @__PURE__ */ new Map();
    for (const c of e) l.set(c.severity, (l.get(c.severity) ?? 0) + 1);
    return l;
  }, [e]), a = o ? e.filter((l) => l.severity === o) : e;
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ k(se, { primary: o === null, onClick: () => i(null), children: [
        "All ",
        e.length
      ] }),
      T1.filter((l) => s.get(l)).map((l) => /* @__PURE__ */ k(se, { primary: o === l, onClick: () => i(l), children: [
        l,
        " ",
        s.get(l)
      ] }, l))
    ] }),
    a.length === 0 && /* @__PURE__ */ u("p", { style: X, children: t ? "No schema was read, so the table rules didn't run." : "No findings." }),
    a.map((l) => /* @__PURE__ */ k("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ k("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ u(An, { severity: l.severity }),
        /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600 }, children: l.title }),
        /* @__PURE__ */ u("button", { style: Ie, onClick: () => n(l.node), children: "Show" }),
        /* @__PURE__ */ u("button", { style: Ie, onClick: () => r(l), children: "Ask" })
      ] }),
      /* @__PURE__ */ u("p", { style: { margin: "4px 0 0" }, children: l.detail }),
      /* @__PURE__ */ u("p", { style: { ...X, ...xe, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: l.evidence.join("  ") })
    ] }, l.id))
  ] });
}
const Ed = 560, Fr = 760, L1 = 1100;
function O1(e, t) {
  const n = e >= L1, r = t && e >= Fr ? n ? "220px" : "170px" : null, o = n ? "minmax(320px, 26%)" : e >= Fr ? "260px" : e >= Ed ? "240px" : null;
  return [r, "minmax(0, 1fr)", o].filter(Boolean).join(" ");
}
function P1(e, t, n, r, o) {
  const i = e.map((d, h) => h);
  if (e.reduce((d, h) => d + h, 0) + o * Math.max(0, e.length - 1) <= t) return { visible: i, hidden: [] };
  const a = t - n - o, l = [];
  let c = 0;
  for (const d of i) {
    const h = c + (l.length ? o : 0) + e[d];
    if (h > a) break;
    l.push(d), c = h;
  }
  if (r >= 0 && !l.includes(r)) {
    for (; l.length > 0 && c + o + e[r] > a; ) {
      const d = l.pop();
      c -= e[d] + (l.length ? o : 0);
    }
    l.push(r);
  }
  return { visible: l, hidden: i.filter((d) => !l.includes(d)) };
}
const D1 = [
  { key: "in_starts", title: "Starts from" },
  { key: "in_hands_off_to", title: "Handed work by" },
  { key: "out_hands_off_to", title: "Hands off to" },
  { key: "out_uses_model", title: "Uses model" },
  { key: "out_starts", title: "Starts agents" },
  { key: "in_uses_model", title: "Agents that use it" },
  { key: "in_renders", title: "Routes that render it" },
  { key: "out_uses_table", title: "Tables it uses" },
  { key: "in_uses_table", title: "Used by" },
  { key: "out_uses_service", title: "Outside services" },
  { key: "in_uses_service", title: "Used by" },
  { key: "out_imports", title: "Imports" },
  { key: "in_imports", title: "Imported by" },
  { key: "out_renders", title: "Renders" },
  { key: "out_calls", title: "Calls" },
  { key: "in_calls", title: "Called by" },
  { key: "in_touches", title: "Plans that touch it" },
  { key: "out_touches", title: "Touches" }
];
function Sd(e) {
  return Kt(e.replace(/^(module|area|route|job|service|plan|table|agent):(public\.)?/, ""));
}
function At({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function R1({ link: e, onOpen: t }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: () => t(e.node),
        style: {
          background: "transparent",
          border: 0,
          padding: 0,
          fontSize: 13,
          cursor: "pointer",
          textAlign: "left",
          color: "var(--accent, #2563eb)",
          overflowWrap: "anywhere"
        },
        children: Sd(e.node)
      }
    ),
    e.access && /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function H1({ node: e, onOpen: t }) {
  return /* @__PURE__ */ u(me, { children: D1.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ u(At, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ u(R1, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function W1({ node: e }) {
  var r;
  const n = [
    ["Path", e.path],
    ["Files", e.files],
    ["Lines", e.lines],
    ["Test files", e.test_files],
    ["Schedule", e.schedule],
    ["Jobs", (r = e.jobs) == null ? void 0 : r.join(", ")],
    ["Status", e.status]
  ].filter(([, o]) => o !== void 0 && o !== "");
  return /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ u("tbody", { children: n.map(([o, i]) => /* @__PURE__ */ k("tr", { children: [
    /* @__PURE__ */ u("td", { style: { ...X, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: o }),
    /* @__PURE__ */ u("td", { style: { overflowWrap: "anywhere" }, children: i })
  ] }, o)) }) });
}
function B1({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ u(At, { title: `Not found (${n.length})`, children: /* @__PURE__ */ u("ul", { style: { ...xe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ u("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function V1({ node: e }) {
  const t = e.asks_you ?? [], n = e.leaves_region ?? [];
  return /* @__PURE__ */ k(me, { children: [
    e.description && /* @__PURE__ */ u("p", { style: { margin: "0 0 12px" }, children: e.description }),
    n.length > 0 && /* @__PURE__ */ u(At, { title: "Leaves your home region", children: /* @__PURE__ */ u("p", { style: { margin: 0, color: "var(--danger, #dc2626)" }, children: n.map(Sd).join(", ") }) }),
    /* @__PURE__ */ u(At, { title: `Asks you (${t.length})`, children: t.length === 0 ? /* @__PURE__ */ u("p", { style: { ...X, margin: 0 }, children: "No call that leaves work for a person was found." }) : /* @__PURE__ */ u("ul", { style: { ...xe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: t.map((r) => /* @__PURE__ */ u("li", { children: r }, r)) }) })
  ] });
}
function F1({ node: e, onRegion: t }) {
  const [n, r] = Q(e.region ?? ""), [o, i] = Q(null), [s, a] = Q(!1), l = async (d) => {
    a(!0), i(await t(e.id, d)), a(!1);
  }, c = n.trim() === (e.region ?? "");
  return /* @__PURE__ */ k(At, { title: "Region", children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6 }, children: [
      /* @__PURE__ */ u(jr, { "aria-label": `Region of ${e.name}`, placeholder: "Where it runs, such as US", value: n, onChange: (d) => r(d.target.value), style: { flex: 1, minWidth: 0 } }),
      /* @__PURE__ */ u(se, { disabled: s || !n.trim() || c, onClick: () => void l(n.trim()), children: "Save" }),
      e.region && /* @__PURE__ */ u(se, { disabled: s, onClick: () => void l(null), children: "Clear" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...X, fontSize: 11, margin: "4px 0 0" }, children: "You set this. Agents that use it are checked against your home region." }),
    o && /* @__PURE__ */ u("p", { style: { color: "var(--danger, #dc2626)", margin: "4px 0 0" }, children: o })
  ] });
}
function j1({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${Gr(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ k(At, { title: n ? `Risk: ${n}` : "Risk", children: [
    /* @__PURE__ */ k("p", { style: { margin: "0 0 4px" }, children: [
      e.commits,
      " commits in ",
      e.window_days,
      " days, ",
      e.complexity,
      " paths, tests: ",
      t,
      "."
    ] }),
    e.worst_files.length > 0 && /* @__PURE__ */ u("ul", { style: { ...xe, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ u("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: Kt(r.path) }, r.path)) })
  ] });
}
function Y1({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ k(At, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ u("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ u("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ k("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ u(An, { severity: n.severity }),
      /* @__PURE__ */ u("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function G1({
  node: e,
  work: t,
  overlaps: n,
  onAsk: r,
  onOpen: o,
  onClose: i,
  canAsk: s,
  onAskFinding: a,
  onRegion: l
}) {
  var d;
  const c = e.id.startsWith("table:");
  return /* @__PURE__ */ k(
    "div",
    {
      "data-testid": "inspector",
      style: {
        position: "absolute",
        top: 12,
        right: 12,
        bottom: 12,
        width: 340,
        maxWidth: "60%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        boxSizing: "border-box",
        borderRadius: 8,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        boxShadow: "0 4px 16px rgba(0,0,0,.12)",
        zIndex: 5
      },
      children: [
        /* @__PURE__ */ k("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ u("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.label ?? e.name }),
          !c && /* @__PURE__ */ u(ve, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ u(se, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ u(se, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ k("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ u(Y1, { names: t, overlaps: n }),
          e.kind === "agent" && /* @__PURE__ */ u(V1, { node: e }),
          e.kind === "service" && l && /* @__PURE__ */ u(F1, { node: e, onRegion: l }, `${e.id}|${e.region ?? ""}`),
          e.risk && /* @__PURE__ */ u(j1, { risk: e.risk }),
          c ? /* @__PURE__ */ u(Pd, { node: e, onAsk: a }) : /* @__PURE__ */ u(W1, { node: e }),
          !c && /* @__PURE__ */ u(B1, { node: e }),
          /* @__PURE__ */ u(H1, { node: e, onOpen: o }),
          !c && /* @__PURE__ */ u("p", { style: { ...X, ...xe, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (d = e.evidence) == null ? void 0 : d.join("  ") })
        ] })
      ]
    }
  );
}
const X1 = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], U1 = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, q1 = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function K1({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ k("div", { style: q1, "data-testid": e.id, children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ k("p", { style: { ...X, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      U1[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ k("ul", { style: { ...xe, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ u("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ k("li", { style: X, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ u("button", { style: Ie, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ u("button", { style: Ie, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ k(
        "select",
        {
          "aria-label": `Status of ${e.name}`,
          value: e.status_source === "you" ? e.status : "",
          onChange: (i) => r(e.id, i.target.value || null),
          style: { fontSize: 11, background: "transparent", color: "var(--muted, #71717a)", border: 0 },
          children: [
            /* @__PURE__ */ u("option", { value: "", children: "Auto" }),
            /* @__PURE__ */ u("option", { value: "built", children: "Mark built" }),
            /* @__PURE__ */ u("option", { value: "partial", children: "Mark partly built" }),
            /* @__PURE__ */ u("option", { value: "planned", children: "Mark not built" })
          ]
        }
      )
    ] })
  ] });
}
function Z1({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ u("strong", { children: i === 0 ? "Nothing here can be checked yet." : o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ u("span", { style: { ...X, fontSize: 13 }, children: i === 0 ? "These plans name no files, so the code can't confirm them." : "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ u("p", { style: X, children: "No plans found. System Map looks in docs/specs, docs/plans and specs, and for a BRIEF, PLAN, ROADMAP, PRD, SPEC or TODO file at the top of the repo." }),
    /* @__PURE__ */ u("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: X1.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ k("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ k("div", { children: [
          /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ u(ve, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ u("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ u(K1, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function Q1(e, t, n) {
  return { key: "plans", label: e > 0 ? `Plans ${e}` : "Plans", on: t, title: "Show unfinished plans on the map", onToggle: n };
}
const J1 = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], nt = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, Zo = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, La = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function e_({ share: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ u("span", { style: { minWidth: 32, textAlign: "right" }, children: Gr(e) })
  ] });
}
function t_({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ u(ve, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ u(ve, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ u(ve, { variant: "muted", children: "Untested" }) : null;
}
function n_(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function r_({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ k(me, { children: [
      /* @__PURE__ */ k(ve, { variant: "muted", children: [
        Gr(i.lines_hit / i.lines_total),
        " of lines run by tests"
      ] }),
      /* @__PURE__ */ k("span", { style: X, children: [
        i.commit ? `Report from ${i.commit.slice(0, 7)}` : "Report from an unknown commit",
        i.files_changed_since ? `, ${i.files_changed_since} files changed since` : ""
      ] })
    ] }) : /* @__PURE__ */ u("span", { style: X, children: "No coverage report yet. Showing which tests reach each file through imports." }),
    /* @__PURE__ */ u("span", { style: { flex: 1 } }),
    n && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: n }),
    /* @__PURE__ */ u(se, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ u(se, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function o_({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = Q("modules"), [c, d] = Q(!0), [h, f] = Q(!1), [p, g] = Q("score"), b = e.coverage !== null, w = le(() => e[a].filter((v) => a === "modules" || !h || !v.ui), [e, a, h]), m = w.filter((v) => v.hot && v.untested), x = le(() => {
    const v = c && m.length > 0 ? m : w;
    if (p === "score") return v;
    const S = p === "cover" ? 1 : -1;
    return [...v].sort((E, C) => S * (E[p] - C[p]));
  }, [w, c, p]), y = a === "modules" ? "module" : "file";
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "risk-summary", children: [
      /* @__PURE__ */ u("strong", { children: e.test_files === 0 ? "No tests yet." : m.length === 0 ? "Nothing busy is short of tests." : `${m.length} busy ${y}${m.length === 1 ? " has" : "s have"} little test cover.` }),
      " ",
      /* @__PURE__ */ k("span", { style: { ...X, fontSize: 13 }, children: [
        "Busy means more commits than three in four others, over ",
        e.window_days,
        " days. Little cover means under half."
      ] })
    ] }),
    e.test_files === 0 && /* @__PURE__ */ u("p", { style: { ...X, margin: 0, fontSize: 13 }, "data-testid": "no-tests", children: "This project has no tests yet, so everything counts as untested. The list below is ranked by how complex and busy each part is." }),
    !e.history_known && /* @__PURE__ */ u("p", { style: { ...X, margin: 0, fontSize: 13 }, children: "No git history here, so commits are not counted." }),
    e.shallow && /* @__PURE__ */ u("p", { style: { ...X, margin: 0, fontSize: 13 }, children: "This is a shallow clone, so commits are undercounted." }),
    /* @__PURE__ */ u(r_, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ u(se, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ u(se, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ u("span", { style: { width: 8 } }),
      m.length > 0 && /* @__PURE__ */ u(se, { primary: c, onClick: () => d((v) => !v), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ u(se, { primary: h, onClick: () => f((v) => !v), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ u("th", { style: { ...nt, textAlign: "left" }, children: /* @__PURE__ */ k("button", { style: Zo, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          J1.map((v) => /* @__PURE__ */ u("th", { style: nt, children: /* @__PURE__ */ u("button", { style: { ...Zo, color: p === v.key ? "var(--text, inherit)" : Zo.color }, title: v.title, onClick: () => g(v.key), children: v.label }) }, v.key)),
          /* @__PURE__ */ u("th", { style: nt })
        ] }) }),
        /* @__PURE__ */ u("tbody", { children: x.map((v) => /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ k("td", { style: { ...nt, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ u(
              "button",
              {
                onClick: () => r(v.id ?? v.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...La, ...xe } : La,
                children: Kt(v.path)
              }
            ),
            " ",
            /* @__PURE__ */ u(t_, { row: v })
          ] }),
          /* @__PURE__ */ u("td", { style: nt, children: v.commits }),
          /* @__PURE__ */ u("td", { style: nt, children: v.complexity }),
          /* @__PURE__ */ u("td", { style: nt, children: b ? /* @__PURE__ */ u(e_, { share: v.covered ?? 0 }) : /* @__PURE__ */ u("span", { style: X, children: n_(v, a) }) }),
          /* @__PURE__ */ u("td", { style: nt, children: v.lines }),
          /* @__PURE__ */ u("td", { style: nt, children: /* @__PURE__ */ u("button", { style: Ie, onClick: () => o(v.id ?? v.path), disabled: !t, children: "Ask" }) })
        ] }, v.path)) })
      ] }),
      x.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
function i_({
  status: e,
  detail: t,
  commit: n,
  builtAt: r,
  read: o,
  busy: i,
  result: s,
  onRebuild: a
}) {
  const l = i ? "Rebuilding" : e.label;
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
    /* @__PURE__ */ u("span", { role: "status", style: { ...X, fontSize: 13 }, "data-testid": "rebuild-result", children: !i && s }),
    e.rebuild && !i && /* @__PURE__ */ u(se, { primary: !0, onClick: a, children: "Rebuild" }),
    /* @__PURE__ */ u(
      Fa,
      {
        width: 270,
        align: "right",
        label: "Model status",
        trigger: (c) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-chip", "data-testid": "status-chip", ...c, children: [
          /* @__PURE__ */ u("span", { className: "sm-dot", "data-tone": i ? "muted" : e.tone }),
          l,
          /* @__PURE__ */ u(ja, {})
        ] }),
        children: () => /* @__PURE__ */ k("div", { style: { padding: 8 }, children: [
          /* @__PURE__ */ u("div", { style: { fontWeight: 600, marginBottom: 2, overflowWrap: "anywhere" }, children: t ?? e.detail }),
          /* @__PURE__ */ k("div", { style: { ...X, marginBottom: 10 }, children: [
            n ? /* @__PURE__ */ u("span", { className: "sm-mono", children: n.slice(0, 7) }) : "This folder",
            ", built ",
            Dd(r, Date.now() / 1e3)
          ] }),
          o && /* @__PURE__ */ k("div", { style: { marginBottom: 10 }, "data-testid": "build-read", children: [
            Rd(o).map((c) => /* @__PURE__ */ u("div", { children: c }, c)),
            o.unread.map((c) => /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
              "Not read: ",
              c.what,
              c.where && /* @__PURE__ */ u("div", { className: "sm-mono", style: { ...X, overflowWrap: "anywhere" }, children: c.where })
            ] }, c.what))
          ] }),
          e.label !== "Folder missing" && /* @__PURE__ */ u(se, { primary: e.rebuild, disabled: i, onClick: a, autoFocus: !0, children: i ? "Rebuilding" : "Rebuild" })
        ] })
      }
    )
  ] });
}
const yr = 10;
function s_(e, t) {
  const n = (e.bands ?? []).filter((s) => s.members.length > 0), r = new Ar.graphlib.Graph({ multigraph: !0, compound: n.length > 0 });
  r.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  for (const s of e.cards) r.setNode(s.id, { width: vr, height: br });
  for (const s of n) {
    r.setNode(s.id, {});
    for (const a of s.members) r.setParent(a, s.id);
  }
  for (const s of e.lines)
    s.source !== s.target && r.setEdge(s.source, s.target, {}, s.id);
  Ar.layout(r);
  const o = /* @__PURE__ */ new Map();
  for (const s of e.cards) {
    const a = r.node(s.id);
    o.set(s.id, { x: a.x - vr / 2, y: a.y - br / 2 });
  }
  const i = n.map((s) => {
    const a = s.members.map((f) => o.get(f)).filter((f) => !!f), l = Math.min(...a.map((f) => f.x)) - yr, c = Math.min(...a.map((f) => f.y)) - yr, d = Math.max(...a.map((f) => f.x + vr)) + yr, h = Math.max(...a.map((f) => f.y + br)) + yr;
    return { ...s, x: l, y: c, width: d - l, height: h - c };
  });
  return { places: o, bands: i };
}
const _i = vr, ki = br, Oa = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  agent: "agent",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, a_ = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)",
  empty: "var(--warn-text, #b45309)"
}, l_ = { empty: "no jobs" }, Cr = {
  imports: { color: "var(--border-strong, #a1a1aa)", label: "imports" },
  renders: { color: "var(--muted, #71717a)", label: "renders" },
  uses_table: { color: "var(--accent, #2563eb)", label: "uses table" },
  uses_service: { color: "var(--warn-text, #b45309)", label: "uses service" },
  calls: { color: "var(--text, #18181b)", label: "calls" },
  touches: { color: "var(--danger, #dc2626)", dashed: !0, label: "plan touches" },
  starts: { color: "var(--text, #18181b)", label: "starts" },
  hands_off_to: { color: "var(--accent, #2563eb)", label: "hands off" },
  uses_model: { color: "var(--warn-text, #b45309)", dashed: !0, label: "uses model" },
  leaves_region: { color: "var(--danger, #dc2626)", label: "leaves region" }
}, c_ = {
  home: "var(--ok, #15803d)",
  away: "var(--danger, #dc2626)",
  unknown: "var(--muted, #71717a)"
}, Mr = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, d_ = he(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i } = t, s = n.status === "proposed", a = n.kind === "plan" || s || n.kind === "agent" && n.status !== void 0, l = n.kind === "service", c = o.length > 1, d = s ? "var(--accent, #2563eb)" : a ? a_[n.status ?? "unclear"] : c ? "var(--warn-text, #b45309)" : void 0, h = r ? "var(--accent, #2563eb)" : d ?? (n.strong ? "var(--text, #18181b)" : "var(--border-strong, #a1a1aa)"), f = r || c ? 2 : n.strong ? 1.5 : 1;
  return /* @__PURE__ */ k(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: _i,
        height: ki,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 12px",
        borderRadius: l ? 29 : 8,
        background: n.kind === "group" ? "var(--bg-hover, #f4f4f5)" : "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${f}px ${a || l ? "dashed" : "solid"} ${h}`,
        boxShadow: [i ? `inset 5px 0 0 ${Mr[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ u(ft, { type: "target", position: U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(ft, { type: "source", position: U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          a && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: d, flexShrink: 0 }, children: l_[n.status ?? ""] ?? n.status }),
          i && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: Mr[i].color, flexShrink: 0 }, children: Mr[i].label })
        ] }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { ...X, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [Oa[n.kind] && n.kind !== "area" && n.kind !== "plan" ? Oa[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ k("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: c ? 600 : 400, color: c ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] }),
          o.length === 0 && n.badge && /* @__PURE__ */ u("span", { style: { fontSize: 11, flexShrink: 0, color: "var(--info, #2563eb)" }, children: n.badge })
        ] })
      ]
    }
  );
}), u_ = he(function({ data: t }) {
  const n = c_[t.band.tone];
  return /* @__PURE__ */ u("div", { "data-testid": t.band.id, style: { width: "100%", height: "100%", boxSizing: "border-box", borderRadius: 14, border: `1.5px dashed ${n}`, pointerEvents: "none" }, children: /* @__PURE__ */ u("span", { style: { position: "absolute", top: -9, left: 12, padding: "0 4px", fontSize: 11, fontWeight: 600, lineHeight: "16px", color: n, background: "var(--bg, #fff)" }, children: t.band.label }) });
}), f_ = { card: d_, band: u_ };
function h_(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function p_(e) {
  const t = e.leaves ? Cr.leaves_region : Cr[e.kind] ?? Cr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: jt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: h_(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function g_({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(Cr).filter(([i]) => e.has(i)), o = Ji();
  return /* @__PURE__ */ k(
    "div",
    {
      "data-testid": "legend",
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        width: "max-content",
        // Clear of the zoom buttons, and of the minimap when there is one.
        maxWidth: Math.max(120, o - (o < Qi ? 130 : 290)),
        whiteSpace: "nowrap",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        r.map(([i, s]) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 14, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` } }),
          s.label
        ] }, i)),
        n && Object.values(Mr).map((i) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 5, height: 12, background: i.color } }),
          i.label
        ] }, i.label)),
        t && /* @__PURE__ */ u("span", { style: X, children: "Thin links hidden" })
      ]
    }
  );
}
function m_({ system: e, focus: t, agents: n, onFocus: r }) {
  const o = jd(e, t, n);
  return /* @__PURE__ */ u(
    "nav",
    {
      "aria-label": "Map level",
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        padding: "4px 10px",
        fontSize: 13,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: o.map((i, s) => {
        const a = s === o.length - 1;
        return /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6 }, children: [
          s > 0 && /* @__PURE__ */ u("span", { style: X, children: "/" }),
          /* @__PURE__ */ u(
            "button",
            {
              onClick: () => r(i.id),
              disabled: a,
              style: {
                background: "transparent",
                border: 0,
                padding: 0,
                fontSize: 13,
                cursor: a ? "default" : "pointer",
                fontWeight: a ? 600 : 400,
                color: a ? "var(--text, inherit)" : "var(--accent, #2563eb)"
              },
              children: i.label
            }
          )
        ] }, i.label);
      })
    }
  );
}
function y_({
  system: e,
  focus: t,
  tables: n,
  showPlans: r,
  inspecting: o,
  risk: i,
  worktrees: s,
  only: a,
  layout: l,
  agents: c,
  tools: d,
  onFocus: h,
  onOpenTables: f
}) {
  const { mode: p } = Ha(), g = Ji() >= Qi, b = c ? null : t, w = le(
    () => a ? Hd(e, a, n) : Wd(e, b, n, r, c),
    [e, a, b, n, r, c]
  ), m = le(() => s_(w, l === "top-down" ? "TB" : "LR"), [w, l]), x = m.places, y = le(() => Bd(i), [i]), v = s == null ? void 0 : s.by_node, S = le(
    () => [
      ...m.bands.map((L) => ({
        id: L.id,
        type: "band",
        position: { x: L.x, y: L.y },
        width: L.width,
        height: L.height,
        zIndex: -1,
        selectable: !1,
        draggable: !1,
        focusable: !1,
        data: { band: L }
      })),
      ...w.cards.map((L) => ({
        id: L.id,
        type: "card",
        position: x.get(L.id) ?? { x: 0, y: 0 },
        width: _i,
        height: ki,
        data: { card: L, focused: L.id === t, work: v ? Fd(L.id, v) : [], band: Vd(y.get(L.id)) }
      }))
    ],
    [w, m, x, t, y, v]
  ), E = le(() => w.lines.map(p_), [w]), C = le(
    () => [
      ...w.cards.map((L) => ({ ...x.get(L.id) ?? { x: 0, y: 0 }, width: _i, height: ki })),
      ...m.bands.map((L) => ({ x: L.x, y: L.y, width: L.width, height: L.height }))
    ],
    [w, x, m]
  );
  bd(C, o ? wd : 0, c && !a ? "top" : "center");
  const T = le(() => new Set(w.lines.map((L) => L.leaves ? "leaves_region" : L.kind)), [w]), A = (L) => {
    if (!L.startsWith("band:"))
      if (L === Yd) f();
      else {
        if (L !== Gd && L !== Xd && L === t) return;
        h(L);
      }
  };
  return /* @__PURE__ */ k(
    ud,
    {
      nodes: S,
      edges: E,
      nodeTypes: f_,
      colorMode: p,
      minZoom: Zi,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (L, O) => A(O.id),
      children: [
        /* @__PURE__ */ u(hd, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(gd, { showInteractive: !1 }),
        g && /* @__PURE__ */ u(yd, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u($t, { position: "top-left", children: /* @__PURE__ */ k(vd, { children: [
          /* @__PURE__ */ u(m_, { system: e, focus: t, agents: c && !a, onFocus: h }),
          d
        ] }) }),
        /* @__PURE__ */ u($t, { position: "bottom-center", children: /* @__PURE__ */ u(g_, { kinds: T, top: (w.hidden ?? 0) > 0, risk: i !== null }) })
      ]
    }
  );
}
function w_(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ u(Ki, { children: /* @__PURE__ */ u(y_, { ...e, agents: e.agents ?? !1 }) }) });
}
const b_ = 16, v_ = 72, Nd = "system-map-view";
function Pa(e) {
  return e.count === void 0 ? void 0 : `${e.count} ${e.counts ?? ""}`.trim();
}
function Qo({ item: e }) {
  return /* @__PURE__ */ k(me, { children: [
    e.label,
    e.count !== void 0 && /* @__PURE__ */ u("span", { className: "sm-count", children: e.count })
  ] });
}
function x_({ items: e, value: t, onChange: n, label: r }) {
  const o = oe(null), i = oe(null), s = oe(null), [a, l] = Q(Number.POSITIVE_INFINITY), [c, d] = Q([]), h = e.map((x) => `${x.label}${x.count ?? ""}`).join("|");
  Ni(() => {
    const x = () => {
      var v, S;
      l(((v = o.current) == null ? void 0 : v.clientWidth) ?? 0), d([...((S = i.current) == null ? void 0 : S.children) ?? []].map((E) => E.offsetWidth));
    };
    x();
    const y = new ResizeObserver(x);
    return o.current && y.observe(o.current), () => y.disconnect();
  }, [h]);
  const f = e.findIndex((x) => x.value === t), p = le(
    () => c.length === e.length ? P1(c, a, v_, f, b_) : { visible: e.map((x, y) => y), hidden: [] },
    [c, a, f, e]
  ), g = p.visible.map((x) => e[x]), b = p.hidden.map((x) => e[x]), w = (x) => {
    n(x), requestAnimationFrame(() => {
      var y, v;
      return (v = (y = s.current) == null ? void 0 : y.querySelector('[aria-selected="true"]')) == null ? void 0 : v.focus();
    });
  }, m = (x) => {
    const y = g.findIndex((C) => C.value === t), v = g.length, E = { ArrowRight: (y + 1) % v, ArrowLeft: (y - 1 + v) % v, Home: 0, End: v - 1 }[x.key];
    E !== void 0 && (x.preventDefault(), w(g[E].value));
  };
  return /* @__PURE__ */ k("div", { ref: o, className: "sm-bar", style: { position: "relative", flex: "none" }, children: [
    /* @__PURE__ */ u("div", { ref: i, className: "sm-tab-probe", "aria-hidden": "true", children: e.map((x) => /* @__PURE__ */ u("span", { className: "sm-tab", children: /* @__PURE__ */ u(Qo, { item: x }) }, x.value)) }),
    /* @__PURE__ */ u("div", { ref: s, className: "sm-tabs", role: "tablist", "aria-label": r, onKeyDown: m, children: g.map((x) => /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        role: "tab",
        id: `system-map-tab-${x.value}`,
        className: "sm-plain sm-tab",
        "aria-selected": x.value === t,
        "aria-controls": Nd,
        tabIndex: x.value === t ? 0 : -1,
        title: Pa(x),
        onClick: () => n(x.value),
        children: /* @__PURE__ */ u(Qo, { item: x })
      },
      x.value
    )) }),
    b.length > 0 && /* @__PURE__ */ u(
      Fa,
      {
        width: 200,
        popup: "menu",
        label: "More views",
        trigger: (x) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-tab", ...x, children: [
          "More ",
          /* @__PURE__ */ u(ja, {})
        ] }),
        children: (x) => /* @__PURE__ */ u(Ud, { label: "More views", children: b.map((y) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "sm-plain sm-row",
            title: Pa(y),
            onClick: () => {
              x(), w(y.value);
            },
            children: /* @__PURE__ */ u(Qo, { item: y })
          },
          y.value
        )) })
      }
    )
  ] });
}
const Cd = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, __ = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, k_ = { ...xe, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, Jo = 6;
function E_(e) {
  return Kt(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function qe({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { ...X, fontSize: 12 }, children: e }),
    t
  ] });
}
function dt({ ids: e, onShow: t }) {
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ u("button", { style: __, onClick: () => t(n), children: E_(n) }, n)) });
}
function Da({ files: e }) {
  return /* @__PURE__ */ k("ul", { style: k_, children: [
    e.slice(0, Jo).map((t) => /* @__PURE__ */ u("li", { children: t }, t)),
    e.length > Jo && /* @__PURE__ */ k("li", { style: X, children: [
      "and ",
      e.length - Jo,
      " more"
    ] })
  ] });
}
const Md = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function S_({ row: e, canAsk: t, onAsk: n }) {
  const r = Md[e.merge];
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ u(An, { severity: e.severity }),
    /* @__PURE__ */ k("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ k("span", { style: X, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ u("button", { style: Ie, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function N_({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = Md[e.merge];
  return /* @__PURE__ */ k("div", { style: Cd, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ u(An, { severity: e.severity }),
      /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ u("button", { style: Ie, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ u(qe, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ u(Da, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ u(qe, { title: "Both change these tables", children: /* @__PURE__ */ u(dt, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ u(qe, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ u(dt, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ u(qe, { title: "Both change code that uses these tables", children: /* @__PURE__ */ u(dt, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ u(qe, { title: "Also share", children: /* @__PURE__ */ u(Da, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(qe, { title: "Same modules", children: /* @__PURE__ */ u(dt, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ u("p", { style: { ...X, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function C_({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ k("div", { style: Cd, "data-testid": "worktree", children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ u("p", { style: { ...X, ...xe, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.path }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ k(ve, { variant: "muted", children: [
        e.ahead,
        " ahead"
      ] }),
      e.behind > 0 && /* @__PURE__ */ k(ve, { variant: "muted", children: [
        e.behind,
        " behind"
      ] }),
      e.uncommitted_files > 0 && /* @__PURE__ */ k(ve, { variant: "warn", children: [
        e.uncommitted_files,
        " uncommitted"
      ] }),
      /* @__PURE__ */ k(ve, { variant: "muted", children: [
        e.files.length,
        " files"
      ] })
    ] }),
    e.tables_schema.length > 0 && /* @__PURE__ */ u(qe, { title: "Changes these tables", children: /* @__PURE__ */ u(dt, { ids: e.tables_schema, onShow: t }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(qe, { title: "Modules", children: /* @__PURE__ */ u(dt, { ids: e.modules, onShow: t }) }),
    e.tables_code.length > 0 && /* @__PURE__ */ u(qe, { title: "Code that uses", children: /* @__PURE__ */ u(dt, { ids: e.tables_code, onShow: t }) }),
    n.length > 0 && /* @__PURE__ */ u(qe, { title: "Routes and plans", children: /* @__PURE__ */ u(dt, { ids: n, onShow: t }) })
  ] });
}
function M_({
  state: e,
  checkedAt: t,
  canAsk: n,
  onShow: r,
  onAsk: o
}) {
  const { high: i, medium: s } = e.counts, a = i + s, l = e.overlaps.length - a, c = e.worktrees.filter((f) => f.files.length > 0), d = e.worktrees.length - c.length, h = a === 0 ? "No collisions ahead." : `${a} collision${a === 1 ? "" : "s"} ahead.`;
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)", overflow: "hidden" }, children: [
    /* @__PURE__ */ k("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "worktree-summary", children: [
      /* @__PURE__ */ u("strong", { children: h }),
      " ",
      /* @__PURE__ */ k("span", { style: { ...X, fontSize: 13 }, children: [
        c.length,
        " of ",
        e.worktrees.length,
        " worktrees have changes",
        l ? `, with ${l} smaller overlap${l === 1 ? "" : "s"}` : "",
        ".",
        t ? ` Checked ${new Date(t).toLocaleTimeString()}.` : ""
      ] })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }, children: [
      a > 0 && /* @__PURE__ */ u("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((f) => f.severity === "high" || f.severity === "medium").map((f) => /* @__PURE__ */ u(N_, { row: f, canAsk: n, onShow: r, onAsk: o }, `${f.a}|${f.b}`)) }),
      /* @__PURE__ */ k("section", { children: [
        /* @__PURE__ */ u("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ u("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((f) => /* @__PURE__ */ u(C_, { tree: f, onShow: r }, f.path)) }),
        c.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ k("p", { style: { ...X, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ k("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((f) => f.severity === "low" || f.severity === "info").map((f) => /* @__PURE__ */ u(S_, { row: f, canAsk: n, onAsk: o }, `${f.a}|${f.b}`))
      ] })
    ] })
  ] });
}
const Ra = 12, I_ = 2e4, $_ = 8e3, A_ = 4e3, T_ = [
  { key: "names", label: "Names" },
  { key: "keys", label: "Keys" },
  { key: "columns", label: "Columns" }
], ei = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, z_ = [
  { value: "map", label: "Map" },
  { value: "data", label: "Data model" },
  { value: "plan", label: "Plan", counts: "unfinished plans" },
  { value: "risk", label: "Risk", counts: "hot and untested modules" },
  { value: "worktrees", label: "Worktrees", counts: "worktree collisions" },
  { value: "findings", label: "Findings", counts: "findings" },
  { value: "agents", label: "Agents", counts: "agents" },
  { value: "explore", label: "Explore", counts: "draft proposals" }
];
function L_(e, t) {
  const n = Wa(), [r, o] = Q(null), [i, s] = Q(null), [a, l] = Q(!1), [c, d] = Q(null), h = (r == null ? void 0 : r.repoKey) === t ? r.slot : null, f = $e(async () => {
    const g = await n.post("/api/chat/slots", { name: fu(t) });
    return await n.post(`/api/chat/slots/${encodeURIComponent(g.key)}/project`, { project: e }), o({ repoKey: t, slot: g.key }), g.key;
  }, [n, e, t]);
  de(() => {
    if (!e) return;
    let g = !0;
    return d(null), (async () => gu(localStorage, t) ? !0 : mu(await n.get("/api/chat/slots").catch(() => []), t))().then(async (w) => {
      g && (w ? await f() : s(t));
    }).catch((w) => {
      g && d(xt(w, "open the design chat"));
    }), () => {
      g = !1;
    };
  }, [n, f, e, t]);
  const p = $e(
    (g) => {
      l(!0), d(null), (async () => {
        const w = h ?? await f();
        yu(localStorage, t), await n.post("/api/chat?ws=1", { message: g, slot: w, agent: "" });
      })().catch((w) => d(xt(w, "send that to the design chat"))).finally(() => l(!1));
    },
    [n, f, t, h]
  );
  return { slot: h, error: c, send: p, opening: a, canAsk: e !== null, startable: i === t && h === null };
}
function O_({ disabled: e, onSend: t }) {
  const [n, r] = Q("");
  return /* @__PURE__ */ u(
    "form",
    {
      style: { position: "absolute", left: 0, right: 0, bottom: 0 },
      onSubmit: (o) => {
        o.preventDefault(), n.trim() && t(n.trim());
      },
      children: /* @__PURE__ */ u(
        jr,
        {
          "aria-label": "Ask about the system",
          placeholder: "Ask about the system",
          value: n,
          disabled: e,
          onChange: (o) => r(o.target.value),
          style: { width: "100%", boxSizing: "border-box" }
        }
      )
    }
  );
}
function P_() {
  const e = oe(null), [t, n] = Q(void 0), [r, o] = Q(1400);
  return Ni(() => {
    const i = () => {
      var l;
      const a = (l = e.current) == null ? void 0 : l.getBoundingClientRect();
      n(Math.max(420, window.innerHeight - ((a == null ? void 0 : a.top) ?? 0) - 16)), a && o(a.width);
    };
    i();
    const s = new ResizeObserver(i);
    return e.current && s.observe(e.current), window.addEventListener("resize", i), () => {
      s.disconnect(), window.removeEventListener("resize", i);
    };
  }, []), { ref: e, height: t, width: r };
}
function wr({ children: e, onDismiss: t }) {
  return /* @__PURE__ */ k("div", { className: "sm-notice", role: "alert", "data-testid": "notice", children: [
    /* @__PURE__ */ u("span", { style: { flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: e }),
    t && /* @__PURE__ */ u(se, { onClick: t, children: "Dismiss" })
  ] });
}
function D_({ read: e }) {
  const t = (e == null ? void 0 : e.unread) ?? [];
  return /* @__PURE__ */ u(
    Ba,
    {
      testId: "no-tables",
      icon: /* @__PURE__ */ u(Id, {}),
      title: "No tables found",
      subtitle: "System Map reads Postgres migrations and SQLite schemas, from .sql files or from code.",
      action: t.length > 0 && /* @__PURE__ */ u("div", { style: { ...X, fontSize: 13, textAlign: "center" }, children: t.map((n) => /* @__PURE__ */ k("div", { children: [
        "Found, but not read: ",
        n.what,
        n.where ? ` (${n.where})` : ""
      ] }, n.what)) })
    }
  );
}
function Id() {
  return /* @__PURE__ */ k("svg", { width: "40", height: "40", viewBox: "0 0 64 64", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ u("rect", { x: "10", y: "10", width: "44", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "34", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "26", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "42", y: "42", width: "12", height: "12", rx: "3" })
  ] });
}
function R_({ onBuilt: e }) {
  const [t, n] = Q(!1);
  return /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u(Ei, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(
      Ba,
      {
        testId: "first-run",
        icon: /* @__PURE__ */ u(Id, {}),
        title: "See your system in one place",
        subtitle: "Add a project to map its code, data model, risk and plans.",
        action: /* @__PURE__ */ u(se, { primary: !0, onClick: () => n(!0), children: "Add project" })
      }
    ) }),
    /* @__PURE__ */ u(Kd, { open: t, projects: [], onClose: () => n(!1), onBuilt: e })
  ] });
}
function K_() {
  const { repos: e, active: t, loaded: n, choose: r, reload: o } = qd();
  return n ? t ? /* @__PURE__ */ u(H_, { repo: t, projects: e, choose: r, reload: o }, t) : /* @__PURE__ */ u(R_, { onBuilt: r }) : /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u(Ei, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(ti, { rows: 6 }) })
  ] });
}
function H_({
  repo: e,
  projects: t,
  choose: n,
  reload: r
}) {
  var ns, rs;
  const o = Wa(), { overview: i, error: s, refresh: a } = Zd(e), l = i == null ? void 0 : i.manifest.version, [c, d] = Q(0), h = l ? `${l}:${c}` : void 0, f = Ot("/graph", e, h), p = Ot("/system", e, h), g = Ot("/plan", e, h), b = Ot("/findings", e, h), w = Ot("/risk", e, h), m = Ot("/agents", e, h), x = m.value, y = ((x == null ? void 0 : x.agents.length) ?? 0) > 0, v = f.value, S = p.value, E = g.value, C = b.value, T = w.value, A = le(() => (E == null ? void 0 : E.plans) ?? [], [E]), L = le(() => (C == null ? void 0 : C.findings) ?? [], [C]), O = is("/worktrees", e, I_), B = O.value, H = is("/explore", e, $_), [_, M] = Q("whatif"), [N, $] = Q(null), [P, I] = Q(0), z = Qd(N, e, P), [D, V] = Q(!1), [j, G] = Q(null), [Y, ne] = Q(() => Jd(localStorage, e)), [Z, R] = Q(null), [F, q] = Q(null), [J, K] = Q(!0), [ee, te] = Q(!1), [re, ie] = Q(!0), [ce, ke] = Q(!1), Ee = oe(null), [Te, ze] = Q(!1), [ht, Ge] = Q(null), [Qe, Se] = Q(null), [Le, _e] = Q(null), [Xe, Zt] = Q("names"), [Je, co] = Q(() => eu(localStorage)), Qt = oe(null), Jt = oe(!1), [uo, Rn] = Q(!1), [en, tn] = Q(null), { ref: fo, height: ho, width: zt } = P_(), nn = (i == null ? void 0 : i.freshness.missing) === !0, ge = L_(i && !nn ? i.manifest.repo : null, e), et = $e(
    (W) => {
      tu(localStorage, e, W), ne(W);
    },
    [e]
  );
  de(() => {
    var W;
    Jt.current && ((W = Qt.current) == null || W.focus()), Jt.current = !1;
  }, [Je]), de(() => {
    if (!en) return;
    const W = window.setTimeout(() => tn(null), A_);
    return () => window.clearTimeout(W);
  }, [en]);
  const Hn = Y === "map" ? F && !/^(area|group):/.test(F) ? F : null : Y === "data" ? Z : null, pt = D && (z != null && z.diff.added.some((W) => W.id === Hn)) ? null : Hn, Lt = nu(pt, e, h), Wn = le(() => {
    const W = /* @__PURE__ */ new Map();
    for (const ue of L)
      ue.severity !== "info" && W.set(ue.node, (W.get(ue.node) ?? 0) + 1);
    return W;
  }, [L]), Bn = le(() => ru(B), [B]), Vn = A.filter((W) => W.status === "planned" || W.status === "partial").length, po = ((B == null ? void 0 : B.counts.high) ?? 0) + ((B == null ? void 0 : B.counts.medium) ?? 0), go = (T == null ? void 0 : T.modules.filter((W) => W.hot && W.untested).length) ?? 0, mo = ((ns = H.value) == null ? void 0 : ns.proposals.filter((W) => W.status === "draft").length) ?? 0, yo = { findings: L.length, plan: Vn, risk: go, worktrees: po, explore: mo, agents: x == null ? void 0 : x.agents.length }, Pe = D ? z : null, rn = le(() => S ? ou(S, Pe) : null, [S, Pe]), on = le(() => {
    const W = (Pe == null ? void 0 : Pe.graph) ?? v;
    return W && (j == null ? void 0 : j.level) === "data" ? iu(W, j.resolved) : W;
  }, [v, Pe, j]), wo = async () => {
    Rn(!0), tn(null), _e(null);
    try {
      const W = await o.post(`${yt}/build`, { repo: e });
      await a(), await r(), tn(W.unchanged ? "No changes" : "Rebuilt");
    } catch (W) {
      _e(xt(W, "rebuild this project"));
    } finally {
      Rn(!1);
    }
  }, sn = async (W, ue) => {
    _e(null);
    try {
      await ue();
    } catch (De) {
      _e(xt(De, W));
    }
  }, bo = () => {
    Lt && ge.send(`Use the system-map tools. Look at ${Lt.id} and tell me what to watch out for.`);
  }, Fn = (W) => {
    ge.send(`Use the system-map tools. Check finding ${W.id} on ${W.node}, read its evidence, and propose a fix.`);
  }, jn = (W) => {
    ge.send(`Use the system-map tools. Look at ${W.id}, say what is left to build, and propose the next step.`);
  }, Yn = (W) => {
    ge.send(`Use the system-map tools. Look at ${W} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, Gn = (W) => {
    ge.send(`Use the system-map tools. Read ${W.id} with the \`agents\` tool. Say what it does on its own, where it waits for a person, and what to watch out for.`);
  }, vo = (W) => {
    ge.send(`Use the system-map tools. Worktrees ${W.a} and ${W.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, xo = () => {
    ge.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, _o = async () => {
    Se(null);
    try {
      await o.post(`${yt}/coverage`, { repo: e }), d((W) => W + 1);
    } catch (W) {
      Se(xt(W, "load the coverage report"));
    }
  }, ko = (W) => {
    V(!0), G(null), q(null);
    const ue = [...(z == null ? void 0 : z.diff.added) ?? [], ...(z == null ? void 0 : z.diff.changed) ?? []].find((De) => De.id.startsWith("table:"));
    R(W === "data" ? (ue == null ? void 0 : ue.id) ?? null : null), et(W);
  }, Eo = (W, ue) => sn("change this proposal", async () => {
    await o.post(`${yt}/proposal-status`, { repo: e, id: W, status: ue }), I((De) => De + 1), await H.refresh();
  }), So = (W, ue) => sn("delete this", async () => {
    await o.post(`${yt}/intent-delete`, { repo: e, kind: W, id: ue }), W === "proposals" && ($(null), V(!1)), await H.refresh();
  }), Xn = (W) => {
    ln({ on: !1, focus: null, before: null }), G(W), te(W.overlays.risk), ie(W.overlays.worktrees), K(W.overlays.plans), $(W.proposal), V(W.proposal !== null), q(null), R(null), et(W.level);
  }, No = () => {
    V(!1), G(null), R(null), q(null);
  }, Co = (W, ue) => sn("change this plan", async () => {
    await o.post(`${yt}/plan-status`, { repo: e, id: W, status: ue }), d((De) => De + 1);
  }), Mo = async (W) => {
    ze(!0), Ge(null);
    try {
      return await o.post(`${yt}/agents/settings`, { repo: e, settings: W }), await a(), d((ue) => ue + 1), !0;
    } catch (ue) {
      return Ge(xt(ue, "save the agent settings")), !1;
    } finally {
      ze(!1);
    }
  }, Io = async (W, ue) => {
    try {
      return await o.post(`${yt}/regions`, { repo: e, id: W, region: ue }), d((De) => De + 1), null;
    } catch (De) {
      return xt(De, "save the region");
    }
  }, an = (W) => {
    et("data"), R(W);
  }, gt = (W) => {
    et("map"), q(W);
  }, ln = (W) => {
    ke(W.on), q(W.focus), Ee.current = W.before;
  }, cn = (W) => {
    G(null), et("map"), ln(Su({ on: ce, focus: F, before: Ee.current }, W, Y === "map"));
  }, Un = () => {
    const W = Eu({ on: ce, focus: F, before: Ee.current });
    W.closeSavedView && G(null), ln(W);
  }, $o = (W) => {
    Y === "data" && W.startsWith("table:") ? R(W) : gt(W);
  }, qn = (W) => {
    W.startsWith("table:") ? an(W) : gt(W);
  }, Kn = () => {
    Jt.current = !0, pu(localStorage, !Je), co(!Je);
  }, Zn = hu(Y), Qn = Zn && Je, Jn = Y === "map" ? "modules" : "tables", er = Zn && !Je && zt >= Fr ? /* @__PURE__ */ k("button", { ref: Qt, type: "button", className: "sm-plain sm-layers sm-show-list", onClick: Kn, children: [
    "Show ",
    Jn
  ] }) : null, tr = (Pe == null ? void 0 : Pe.title) ?? (j == null ? void 0 : j.title), mt = tr ? /* @__PURE__ */ u(u1, { title: tr, onBack: No }) : null, Ao = z_.map((W) => ({ ...W, count: yo[W.value] || void 0 })), Ne = i == null ? void 0 : i.freshness, nr = Ne ? su(au(Ne), Ne.commits_behind, Ne.ref) : null, rr = ((rs = Ne == null ? void 0 : Ne.changed_inputs) == null ? void 0 : rs.length) ?? 0, dn = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      er,
      /* @__PURE__ */ u(
        d1,
        {
          layers: [
            Q1(Vn, J, () => K((W) => !W)),
            { key: "risk", label: "Risk", on: ee, title: "Mark hot and untested code on the map", onToggle: () => te((W) => !W) },
            { key: "work", label: "Worktrees", on: re, title: "Show what each worktree is changing", onToggle: () => ie((W) => !W) },
            {
              key: "agents",
              label: "Agents",
              on: ce && y,
              disabled: !y,
              title: y ? "Show the agents: what starts each one, who it hands work to, and the models it uses" : "No agents yet. Point System Map at them in the Agents tab.",
              onToggle: Un
            }
          ]
        }
      )
    ] }),
    mt
  ] }), To = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      er,
      /* @__PURE__ */ u(
        Od,
        {
          ariaLabel: "How much of each table to show",
          layoutId: "system-map-density",
          collapse: !1,
          segments: T_,
          value: Xe,
          onChange: (W) => Zt(W)
        }
      )
    ] }),
    mt
  ] }), or = {
    map: rn !== null,
    data: !!on,
    plan: E !== null,
    risk: T !== null,
    worktrees: B !== null,
    findings: C !== null,
    agents: x !== null,
    explore: H.value !== null
  }, un = {
    map: p.failed,
    data: f.failed,
    plan: g.failed,
    risk: w.failed,
    worktrees: O.failed,
    findings: b.failed,
    agents: m.failed,
    explore: H.failed
  }, $d = () => {
    d((W) => W + 1), O.refresh(), H.refresh();
  }, ts = lu({ projects: t, activeKey: e, onPick: n, onReload: () => void r() }), Ad = /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }, children: [
    /* @__PURE__ */ u("span", { style: { whiteSpace: "nowrap" }, children: "System Map" }),
    /* @__PURE__ */ u("span", { "aria-hidden": "true", style: { ...X, fontWeight: 400 }, children: "/" }),
    ts.menu
  ] });
  return /* @__PURE__ */ k(me, { children: [
    ts.dialogs,
    /* @__PURE__ */ u(
      Ei,
      {
        title: Ad,
        actions: i && nr ? /* @__PURE__ */ u(
          i_,
          {
            status: nr,
            detail: Ne != null && Ne.stale ? `${rr} schema ${rr === 1 ? "file" : "files"} changed on ${Ne.ref}` : void 0,
            commit: i.manifest.commit,
            builtAt: i.manifest.built_at,
            read: i.manifest.read,
            busy: uo,
            result: en,
            onRebuild: () => void wo()
          }
        ) : void 0
      }
    ),
    /* @__PURE__ */ k("div", { ref: fo, className: "sm-page", style: { height: ho, display: "flex", flexDirection: "column", gap: Ra, minHeight: 0 }, children: [
      s && !i && /* @__PURE__ */ k(wr, { children: [
        s,
        " ",
        /* @__PURE__ */ u(se, { onClick: () => void a(), children: "Try again" })
      ] }),
      !i && !s && /* @__PURE__ */ u(ti, { rows: 6 }),
      Le && /* @__PURE__ */ u(wr, { onDismiss: () => _e(null), children: Le }),
      nn && i && /* @__PURE__ */ k(wr, { children: [
        "The folder for this project is gone: ",
        /* @__PURE__ */ u("span", { className: "sm-mono", children: i.manifest.repo }),
        ". You can still read the last model. To go on, move the folder back, or remove the project from the project menu."
      ] }),
      i && /* @__PURE__ */ k(me, { children: [
        /* @__PURE__ */ u(x_, { items: Ao, value: Y, onChange: et, label: "System Map views" }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: Ra,
              gridTemplateColumns: O1(zt, Qn),
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              Qn && zt >= Fr && /* @__PURE__ */ k(zo, { style: ei, "data-testid": "side-list", children: [
                /* @__PURE__ */ k("div", { className: "sm-list-head", children: [
                  /* @__PURE__ */ u(os, { children: Y === "map" ? "Modules" : "Tables" }),
                  /* @__PURE__ */ u("button", { ref: Qt, type: "button", className: "sm-plain sm-hide-list", "aria-label": `Hide ${Jn}`, onClick: Kn, children: "Hide" })
                ] }),
                Y === "map" ? /* @__PURE__ */ u(cu, { nodes: (S == null ? void 0 : S.nodes) ?? [], focus: F, onSelect: gt }) : /* @__PURE__ */ u(du, { tables: i.tables, selected: Z, flagged: Wn, working: Bn, onSelect: an })
              ] }),
              /* @__PURE__ */ k(
                zo,
                {
                  style: { ...ei, padding: 0, position: "relative" },
                  "data-testid": "canvas",
                  id: Nd,
                  role: "tabpanel",
                  "aria-labelledby": `system-map-tab-${Y}`,
                  children: [
                    !or[Y] && !un[Y] && /* @__PURE__ */ u(ti, { rows: 6 }),
                    !or[Y] && un[Y] && /* @__PURE__ */ u("div", { style: { padding: 12 }, children: /* @__PURE__ */ k(wr, { children: [
                      "Couldn't load this view. ",
                      /* @__PURE__ */ u(se, { onClick: $d, children: "Try again" })
                    ] }) }),
                    Y === "map" && rn && /* @__PURE__ */ u(
                      w_,
                      {
                        system: rn,
                        focus: F,
                        tables: i.manifest.counts.tables,
                        showPlans: J,
                        inspecting: pt !== null,
                        risk: ee ? T : null,
                        worktrees: re ? B : null,
                        only: (j == null ? void 0 : j.level) === "map" ? j.resolved : null,
                        layout: (j == null ? void 0 : j.layout) ?? "left-right",
                        agents: ce && y,
                        tools: dn,
                        onFocus: (W) => {
                          G(null), q(W);
                        },
                        onOpenTables: () => et("data")
                      }
                    ),
                    Y === "data" && i.tables.length === 0 && !D && /* @__PURE__ */ u(D_, { read: i.manifest.read }),
                    Y === "data" && on && (i.tables.length > 0 || D) && /* @__PURE__ */ u(v1, { graph: on, selected: Z, flagged: Wn, working: Bn, density: Xe, tools: To, onSelect: R }),
                    Y === "explore" && H.value && /* @__PURE__ */ u(
                      A1,
                      {
                        data: H.value,
                        proposal: z,
                        shownProposal: D ? N : null,
                        canAsk: ge.canAsk,
                        tab: _,
                        onTab: M,
                        onSend: ge.send,
                        onOpenProposal: $,
                        onDrawProposal: ko,
                        onStatus: (W, ue) => void Eo(W, ue),
                        onDelete: (W, ue) => void So(W, ue),
                        onOpenView: Xn,
                        onNode: qn
                      }
                    ),
                    Y === "plan" && E && /* @__PURE__ */ u(Z1, { plans: A, onShow: gt, onAsk: jn, onStatus: (W, ue) => void Co(W, ue) }),
                    Y === "risk" && T && /* @__PURE__ */ u(
                      o_,
                      {
                        risk: T,
                        canAsk: ge.canAsk,
                        error: Qe,
                        onShow: gt,
                        onAsk: Yn,
                        onLoad: () => void _o(),
                        onRun: xo
                      }
                    ),
                    Y === "worktrees" && B && /* @__PURE__ */ u(M_, { state: B, checkedAt: O.checkedAt, canAsk: ge.canAsk, onShow: qn, onAsk: vo }),
                    Y === "findings" && C && /* @__PURE__ */ u(
                      z1,
                      {
                        findings: L,
                        noSchema: i.tables.length === 0,
                        onShow: (W) => W.startsWith("agent:") ? cn(W) : an(W),
                        onAsk: Fn
                      }
                    ),
                    Y === "agents" && x && /* @__PURE__ */ u(Pu, { state: x, canAsk: ge.canAsk, saving: Te, error: ht, onShow: cn, onAsk: Gn, onSave: Mo }),
                    Lt && pt && /* @__PURE__ */ u(
                      G1,
                      {
                        node: Lt,
                        work: (B == null ? void 0 : B.by_node[pt]) ?? [],
                        overlaps: uu(pt, B),
                        canAsk: ge.canAsk,
                        onAsk: bo,
                        onAskFinding: Fn,
                        onOpen: (W) => W.startsWith("agent:") ? cn(W) : $o(W),
                        onClose: () => Y === "data" ? R(null) : q(null),
                        onRegion: Io
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ k(zo, { style: zt >= Ed ? ei : { display: "none" }, children: [
                /* @__PURE__ */ u(os, { children: "Design chat" }),
                ge.error && /* @__PURE__ */ u("p", { style: { fontSize: 13 }, children: ge.error }),
                nn && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "Chat needs this project's folder." }),
                /* @__PURE__ */ k("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: [
                  ge.slot && /* @__PURE__ */ u("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ u(Ld, { slotKey: ge.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }),
                  ge.startable && /* @__PURE__ */ u(O_, { disabled: ge.opening, onSend: ge.send })
                ] })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  K_ as default
};
