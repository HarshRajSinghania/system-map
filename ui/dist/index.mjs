var Od = Object.defineProperty;
var Pd = (e, t, n) => t in e ? Od(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ye = (e, t, n) => Pd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as u, jsxs as k, Fragment as me } from "react/jsx-runtime";
import { useTheme as Ba, useAppApi as Va, ChatEmbed as Dd } from "@kirocrew/app-sdk";
import { Btn as ae, Input as jr, Badge as ve, PageHeader as Ni, ContentSkeleton as ti, EmptyState as Fa, Card as Lo, CardTitle as ss, SegmentedControl as Rd } from "@kirocrew/app-sdk/ui";
import Ci, { useState as Q, useMemo as le, memo as he, forwardRef as ja, createContext as Yr, useCallback as $e, useContext as qt, useRef as oe, useEffect as de, useLayoutEffect as Mi } from "react";
import { s as Kt, M as X, a as xe, A as Ie, S as Ln, p as Gr, N as Hd, D as Ya, b as Wd, r as Bd, C as Ga, c as wn, d as bn, e as Vd, f as Fd, g as jd, h as Yd, w as Gd, t as Xd, G as Ud, i as qd, j as Kd, k as Zd, u as Qd, l as Jd, m as eu, n as Ot, o as as, q as tu, v as nu, x as ru, y as ou, z as iu, B as su, E as au, F as lu, H as cu, I as du, J as uu, K as fu, T as hu, L as pu, O as gu, P as xt, Q as yt, R as mu, U as yu, V as wu, W as bu, X as vu } from "./chunks/ProjectMenu-FYd18wQz.mjs";
import "react-dom";
const Xa = [
  { key: "all", label: "All", title: "Every agent" },
  { key: "model", label: "Use a model", title: "Agents that call a model" },
  { key: "leaves", label: "Can leave region", title: "Agents whose model runs outside your home region" },
  { key: "asks", label: "Asks you", title: "Agents that wait for a person" },
  { key: "planned", label: "Planned", title: "Agents a spec names that have no jobs yet" }
], Ua = {
  all: () => !0,
  model: (e) => e.models.length > 0,
  leaves: (e) => e.leaves_region.length > 0,
  asks: (e) => e.asks_you.length > 0,
  planned: (e) => e.status === "planned"
}, xu = { built: "built", planned: "planned", empty: "no jobs" };
function _u(e, t) {
  return e.filter(Ua[t]);
}
function ku(e) {
  const t = {};
  for (const { key: n } of Xa) t[n] = e.filter(Ua[n]).length;
  return t;
}
function Ii(e, t) {
  var i;
  const n = e.indexOf(":"), r = e.slice(0, n), o = e.slice(n + 1);
  return r === "agent" ? ((i = t.find((s) => s.id === e)) == null ? void 0 : i.label) ?? o : r === "job" ? `${o} job` : r === "module" ? Kt(o) : o;
}
function qa(e, t) {
  return [...new Set([...e.starts, ...e.handed_by].map((n) => Ii(n.node, t)))];
}
function Eu(e, t) {
  return [...new Set(e.hands_off_to.map((n) => Ii(n.node, t)))];
}
function $i(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.models) t.has(n.node) || t.set(n.node, n);
  return [...t.values()];
}
function Su(e, t) {
  return e.leaves ? "leaves" : e.region && t && e.region.trim().toLowerCase() === t.trim().toLowerCase() ? "home" : "unknown";
}
function Nu(e) {
  return e.region ? `${e.name} · ${e.region}` : e.name;
}
function Cu(e) {
  return e.on ? { on: !1, focus: e.before, before: null, closeSavedView: !1 } : { on: !0, focus: null, before: e.focus, closeSavedView: !0 };
}
function Mu(e, t, n) {
  return { on: !0, focus: t, before: e.on ? e.before : n ? e.focus : null };
}
function Iu(e, t) {
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
function $u(e) {
  const t = {}, n = (o) => o.trim();
  n(e.list) && (t.list = n(e.list)), n(e.jobs_key) && (t.jobs_key = n(e.jobs_key)), wt(e.hand_off_keys).length && (t.hand_off_keys = wt(e.hand_off_keys)), wt(e.model_calls).length && (t.model_calls = wt(e.model_calls)), wt(e.asks_you_calls).length && (t.asks_you_calls = wt(e.asks_you_calls));
  const r = wt(e.modules).map((o) => `module:${o.replace(/^module:/, "")}`);
  return r.length && (t.modules = r), n(e.home_region) && (t.home_region = n(e.home_region)), t;
}
function Au(e, t) {
  return { ...e, modules: [.../* @__PURE__ */ new Set([...e.modules ?? [], t])] };
}
const Dt = { padding: "6px 8px", textAlign: "left", verticalAlign: "top" }, fn = { ...Dt, fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)", whiteSpace: "nowrap" }, Tu = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text, inherit)" }, ar = { padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border-strong, #a1a1aa)", background: "var(--card, #fff)", fontSize: 12, overflowWrap: "anywhere" }, Lu = { leaves: "err", home: "ok", unknown: "muted" }, zu = { built: "var(--ok, #15803d)", planned: "var(--danger, #dc2626)", empty: "var(--warn-text, #b45309)" };
function Ka({ status: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ u("span", { style: { width: 7, height: 7, borderRadius: "50%", background: zu[e] } }),
    xu[e]
  ] });
}
function Za({ models: e, home: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("span", { style: X, children: "none" }) : /* @__PURE__ */ u("span", { style: { display: "inline-flex", flexWrap: "wrap", gap: 4 }, children: e.map((n) => /* @__PURE__ */ u(ve, { variant: Lu[Su(n, t)], title: n.leaves ? "Runs outside your home region" : n.region ? void 0 : "No region set. Set one on the service in the Map.", children: Nu(n) }, n.node)) });
}
function zo({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }, children: [
    /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: e }),
    t
  ] });
}
function Ou({ row: e, rows: t, home: n }) {
  const r = qa(e, t), o = Eu(e, t), i = /* @__PURE__ */ u("span", { style: { ...X, alignSelf: "center" }, children: "→" });
  return /* @__PURE__ */ k("div", { "data-testid": "agent-in-out", style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto auto minmax(0, 1fr)", gap: 6, margin: "10px 0" }, children: [
    /* @__PURE__ */ u(zo, { title: "Starts from", children: r.length ? r.map((s) => /* @__PURE__ */ u("span", { style: ar, children: s }, s)) : /* @__PURE__ */ u("span", { style: X, children: "nothing found" }) }),
    i,
    /* @__PURE__ */ u("span", { style: { ...ar, alignSelf: "center", fontWeight: 600, border: "2px solid var(--accent, #2563eb)" }, children: e.label }),
    i,
    /* @__PURE__ */ k(zo, { title: "Then", children: [
      o.map((s) => /* @__PURE__ */ u("span", { style: ar, children: s }, s)),
      e.asks_you.length > 0 && /* @__PURE__ */ u("span", { style: { ...ar, border: "1px solid var(--info, #2563eb)", background: "var(--bg-elevated, #fff)" }, children: "Asks you" }),
      o.length === 0 && e.asks_you.length === 0 && /* @__PURE__ */ u("span", { style: X, children: "nothing found" })
    ] }),
    /* @__PURE__ */ u("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ u(zo, { title: "Uses model", children: /* @__PURE__ */ u(Za, { models: $i(e), home: n }) }) })
  ] });
}
function Pu({ row: e, rows: t, home: n, canAsk: r, onShow: o, onAsk: i }) {
  const s = [...e.evidence, ...$i(e).map((a) => a.evidence), ...e.asks_you, ...e.hands_off_to.map((a) => a.evidence)];
  return /* @__PURE__ */ k("div", { "data-testid": "agent-detail", style: { fontSize: 13 }, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }, children: [
      /* @__PURE__ */ u("strong", { style: { fontSize: 15 }, children: e.label }),
      /* @__PURE__ */ u(Ka, { status: e.status })
    ] }),
    e.description && /* @__PURE__ */ u("p", { style: { margin: "6px 0 0" }, children: e.description }),
    /* @__PURE__ */ u(Ou, { row: e, rows: t, home: n }),
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
      /* @__PURE__ */ u(ae, { onClick: () => o(e.id), children: "Show on map" }),
      /* @__PURE__ */ u(ae, { onClick: () => i(e), disabled: !r, children: "Ask" })
    ] })
  ] });
}
const Du = [
  { key: "list", label: "Agent list", help: "The file whose exported array lists your agents, such as src/agents/registry.ts" },
  { key: "jobs_key", label: "Jobs key", help: "The property that holds each agent's jobs" },
  { key: "hand_off_keys", label: "Hand-off keys", help: "Properties that name the agent to hand work to, such as agent" },
  { key: "model_calls", label: "Model calls", help: "Functions that call a model, such as claude" },
  { key: "asks_you_calls", label: "Asks-you calls", help: "Functions that leave work for a person, such as addTask" },
  { key: "modules", label: "Agent modules", help: "Folders to treat as one agent each, such as src/mail" },
  { key: "home_region", label: "Home region", help: "Where your data should stay, such as Canada" }
];
function Ru({ state: e, saving: t, error: n, onSave: r, onCancel: o }) {
  const [i, s] = Q(() => Iu(e.settings, e.defaults)), a = async (l) => {
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
        /* @__PURE__ */ u("span", { style: { ...xe, fontSize: 12, flex: 1 }, children: Ii(l, []) }),
        /* @__PURE__ */ u(ae, { disabled: t, onClick: () => void a(Au(e.settings, l)), children: "Mark as agent" })
      ] }, l))
    ] }),
    /* @__PURE__ */ u("div", { style: { display: "grid", gridTemplateColumns: "minmax(110px, auto) minmax(0, 1fr)", gap: "8px 12px", alignItems: "start" }, children: Du.map((l) => /* @__PURE__ */ k("label", { style: { display: "contents" }, children: [
      /* @__PURE__ */ u("span", { style: { paddingTop: 6, fontWeight: 600 }, children: l.label }),
      /* @__PURE__ */ k("span", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
        /* @__PURE__ */ u(jr, { value: i[l.key], onChange: (c) => s({ ...i, [l.key]: c.target.value }), style: l.key === "home_region" ? void 0 : xe }),
        /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: l.help })
      ] })
    ] }, l.key)) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 14 }, children: [
      /* @__PURE__ */ u(ae, { primary: !0, disabled: t, onClick: () => void a($u(i)), children: t ? "Saving…" : "Save and rebuild" }),
      o && /* @__PURE__ */ u(ae, { onClick: o, children: "Cancel" }),
      n && /* @__PURE__ */ u("span", { style: { color: "var(--danger, #dc2626)" }, children: n })
    ] })
  ] });
}
function Hu({
  state: e,
  canAsk: t,
  saving: n,
  error: r,
  onShow: o,
  onAsk: i,
  onSave: s
}) {
  const [a, l] = Q("all"), [c, d] = Q(null), [h, f] = Q(!1), p = e.agents, g = le(() => ku(p), [p]), v = le(() => _u(p, a), [p, a]), w = v.find((b) => b.id === c) ?? v[0] ?? null, m = e.home_region;
  return p.length === 0 || h ? /* @__PURE__ */ u("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, color: "var(--text, inherit)" }, children: /* @__PURE__ */ u(Ru, { state: e, saving: n, error: r, onSave: s, onCancel: p.length ? () => f(!1) : void 0 }) }) : /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
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
      Xa.map((b) => /* @__PURE__ */ k(ae, { primary: a === b.key, title: b.title, onClick: () => l(b.key), children: [
        b.label,
        " ",
        g[b.key]
      ] }, b.key)),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(ae, { onClick: () => f(!0), children: "Agent settings" })
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
          /* @__PURE__ */ u("tbody", { children: v.map((b) => /* @__PURE__ */ k("tr", { onClick: () => d(b.id), style: { borderBottom: "1px solid var(--border, #e4e4e7)", cursor: "pointer", background: b.id === (w == null ? void 0 : w.id) ? "var(--accent-subtle, rgba(37,99,235,.12))" : void 0 }, children: [
            /* @__PURE__ */ u("td", { style: Dt, children: /* @__PURE__ */ u("button", { style: Tu, "aria-pressed": b.id === (w == null ? void 0 : w.id), onClick: () => d(b.id), children: b.label }) }),
            /* @__PURE__ */ u("td", { style: Dt, children: /* @__PURE__ */ u(Ka, { status: b.status }) }),
            /* @__PURE__ */ u("td", { style: { ...Dt, ...X }, children: qa(b, p).join(", ") || "—" }),
            /* @__PURE__ */ u("td", { style: Dt, children: /* @__PURE__ */ u(Za, { models: $i(b), home: m }) }),
            /* @__PURE__ */ u("td", { style: Dt, children: b.asks_you.length > 0 ? "Yes" : /* @__PURE__ */ u("span", { style: X, children: "—" }) })
          ] }, b.id)) })
        ] }),
        v.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No agents here. Pick All to see every agent." })
      ] }),
      w && /* @__PURE__ */ u("aside", { style: { width: 320, flexShrink: 0, overflowY: "auto", paddingLeft: 16, borderLeft: "1px solid var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u(Pu, { row: w, rows: p, home: m, canAsk: t, onShow: o, onAsk: i }) })
    ] })
  ] });
}
function Qa(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Wu = "\0", bt = "\0", ls = "";
let Bu = class {
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
    var l = Vu(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, cs(this._preds[n], t), cs(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
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
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], ds(this._preds[n], t), ds(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function cs(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function ds(e, t) {
  --e[t] || delete e[t];
}
function gn(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + ls + i + ls + (r === void 0 ? Wu : r);
}
function Vu(e, t, n, r) {
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
var Ai = Bu, Fu = "2.2.4", ju = {
  Graph: Ai,
  version: Fu
}, Yu = Ai, Gu = {
  write: Xu,
  read: Ku
};
function Xu(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: Uu(e),
    edges: qu(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function Uu(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function qu(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function Ku(e) {
  var t = new Yu(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var Zu = Qu;
function Qu(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let Ju = class {
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
var Ja = Ju, ef = Ja, el = nf, tf = () => 1;
function nf(e, t, n, r) {
  return rf(
    e,
    String(t),
    n || tf,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function rf(e, t, n, r) {
  var o = {}, i = new ef(), s, a, l = function(c) {
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
var of = el, sf = af;
function af(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = of(e, o, t, n), r;
  }, {});
}
var tl = lf;
function lf(e) {
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
var cf = tl, df = uf;
function uf(e) {
  return cf(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var ff = pf, hf = () => 1;
function pf(e, t, n) {
  return gf(
    e,
    t || hf,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function gf(e, t, n) {
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
function nl(e) {
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
var rl = nl;
nl.CycleException = ni;
var us = rl, mf = yf;
function yf(e) {
  try {
    us(e);
  } catch (t) {
    if (t instanceof us.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var ol = wf;
function wf(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? bf : vf, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function bf(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), il(t(i[0]), (s) => o.push([s, !1])));
  }
}
function vf(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), il(t(i), (s) => o.push(s)));
  }
}
function il(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var xf = ol, _f = kf;
function kf(e, t) {
  return xf(e, t, "post");
}
var Ef = ol, Sf = Nf;
function Nf(e, t) {
  return Ef(e, t, "pre");
}
var Cf = Ai, Mf = Ja, If = $f;
function $f(e, t) {
  var n = new Cf(), r = {}, o = new Mf(), i;
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
var Af = {
  components: Zu,
  dijkstra: el,
  dijkstraAll: sf,
  findCycles: df,
  floydWarshall: ff,
  isAcyclic: mf,
  postorder: _f,
  preorder: Sf,
  prim: If,
  tarjan: tl,
  topsort: rl
}, fs = ju, Fe = {
  Graph: fs.Graph,
  json: Gu,
  alg: Af,
  version: fs.version
};
let Tf = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return hs(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && hs(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, Lf)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function hs(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function Lf(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var zf = Tf;
let Of = Fe.Graph, Pf = zf;
var Df = Hf;
let Rf = () => 1;
function Hf(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = Bf(e, t || Rf);
  return Wf(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function Wf(e, t, n) {
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
function Bf(e, t) {
  let n = new Of(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = Vf(o + r + 3).map(() => new Pf()), s = r + 1;
  return n.nodes().forEach((a) => {
    ri(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function ri(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function Vf(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let sl = Fe.Graph;
var we = {
  addBorderNode: Zf,
  addDummyNode: al,
  applyWithChunking: Xr,
  asNonCompoundGraph: jf,
  buildLayerMatrix: Uf,
  intersectRect: Xf,
  mapValues: oh,
  maxRank: cl,
  normalizeRanks: qf,
  notime: th,
  partition: Jf,
  pick: rh,
  predecessorWeights: Gf,
  range: ul,
  removeEmptyRanks: Kf,
  simplify: Ff,
  successorWeights: Yf,
  time: eh,
  uniqueId: dl,
  zipObject: Ti
};
function al(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = dl(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function Ff(e) {
  let t = new sl().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function jf(e) {
  let t = new sl({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function Yf(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return Ti(e.nodes(), t);
}
function Gf(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return Ti(e.nodes(), t);
}
function Xf(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function Uf(e) {
  let t = ul(cl(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function qf(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Xr(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function Kf(e) {
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
function Zf(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), al(e, "border", o, t);
}
function Qf(e, t = ll) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const ll = 65535;
function Xr(e, t) {
  if (t.length > ll) {
    const n = Qf(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function cl(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Xr(Math.max, n);
}
function Jf(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function eh(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function th(e, t) {
  return t();
}
let nh = 0;
function dl(e) {
  var t = ++nh;
  return e + ("" + t);
}
function ul(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function rh(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function oh(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function Ti(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let ih = Df, sh = we.uniqueId;
var ah = {
  run: lh,
  undo: dh
};
function lh(e) {
  (e.graph().acyclicer === "greedy" ? ih(e, n(e)) : ch(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, sh("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function ch(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function dh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let uh = we;
var fh = {
  run: hh,
  undo: gh
};
function hh(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => ph(e, t));
}
function ph(e, t) {
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
    }, c = uh.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), h === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function gh(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: mh } = we;
var Ur = {
  longestPath: yh,
  slack: wh
};
function yh(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = mh(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function wh(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var bh = Fe.Graph, Ir = Ur.slack, fl = vh;
function vh(e) {
  var t = new bh({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; xh(t, e) < r; )
    o = _h(t, e), i = t.hasNode(o.v) ? Ir(e, o) : -Ir(e, o), kh(t, e, i);
  return t;
}
function xh(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !Ir(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function _h(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = Ir(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function kh(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Eh = fl, ps = Ur.slack, Sh = Ur.longestPath, Nh = Fe.alg.preorder, Ch = Fe.alg.postorder, Mh = we.simplify, Ih = Tt;
Tt.initLowLimValues = zi;
Tt.initCutValues = Li;
Tt.calcCutValue = hl;
Tt.leaveEdge = gl;
Tt.enterEdge = ml;
Tt.exchangeEdges = yl;
function Tt(e) {
  e = Mh(e), Sh(e);
  var t = Eh(e);
  zi(t), Li(t, e);
  for (var n, r; n = gl(t); )
    r = ml(t, e, n), yl(t, e, n, r);
}
function Li(e, t) {
  var n = Ch(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => $h(e, t, r));
}
function $h(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = hl(e, t, n);
}
function hl(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var h = c === i, f = t.edge(l).weight;
      if (a += h ? f : -f, Th(e, n, d)) {
        var p = e.edge(n, d).cutvalue;
        a += h ? -p : p;
      }
    }
  }), a;
}
function zi(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), pl(e, {}, 1, t);
}
function pl(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = pl(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function gl(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function ml(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === gs(e, e.node(d.v), a) && l !== gs(e, e.node(d.w), a));
  return c.reduce((d, h) => ps(t, h) < ps(t, d) ? h : d);
}
function yl(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), zi(e), Li(e, t), Ah(e, t);
}
function Ah(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = Nh(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function Th(e, t, n) {
  return e.hasEdge(t, n);
}
function gs(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var Lh = Ur, wl = Lh.longestPath, zh = fl, Oh = Ih, Ph = Dh;
function Dh(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      ms(e);
      break;
    case "tight-tree":
      Hh(e);
      break;
    case "longest-path":
      Rh(e);
      break;
    case "none":
      break;
    default:
      ms(e);
  }
}
var Rh = wl;
function Hh(e) {
  wl(e), zh(e);
}
function ms(e) {
  Oh(e);
}
var Wh = Bh;
function Bh(e) {
  let t = Fh(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = Vh(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
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
function Vh(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function Fh(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let $r = we;
var jh = {
  run: Yh,
  cleanup: Uh
};
function Yh(e) {
  let t = $r.addDummyNode(e, "root", {}, "_root"), n = Gh(e), r = Object.values(n), o = $r.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = Xh(e) + 1;
  e.children().forEach((a) => bl(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function bl(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = $r.addBorderNode(e, "_bt"), c = $r.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((h) => {
    bl(e, t, n, r, o, i, h);
    let f = e.node(h), p = f.borderTop ? f.borderTop : h, g = f.borderBottom ? f.borderBottom : h, v = f.borderTop ? r : 2 * r, w = p !== g ? 1 : o - i[s] + 1;
    e.setEdge(l, p, {
      weight: v,
      minlen: w,
      nestingEdge: !0
    }), e.setEdge(g, c, {
      weight: v,
      minlen: w,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function Gh(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function Xh(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function Uh(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let qh = we;
var Kh = Zh;
function Zh(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        ys(e, "borderLeft", "_bl", n, o, i), ys(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function ys(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = qh.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var Qh = {
  adjust: Jh,
  undo: ep
};
function Jh(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && vl(e);
}
function ep(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && tp(e), (t === "lr" || t === "rl") && (np(e), vl(e));
}
function vl(e) {
  e.nodes().forEach((t) => ws(e.node(t))), e.edges().forEach((t) => ws(e.edge(t)));
}
function ws(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function tp(e) {
  e.nodes().forEach((t) => Do(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Do), Object.hasOwn(n, "y") && Do(n);
  });
}
function Do(e) {
  e.y = -e.y;
}
function np(e) {
  e.nodes().forEach((t) => Ro(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Ro), Object.hasOwn(n, "x") && Ro(n);
  });
}
function Ro(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let bs = we;
var rp = op;
function op(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = bs.applyWithChunking(Math.max, r), i = bs.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let ip = we.zipObject;
var sp = ap;
function ap(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += lp(e, t[r - 1], t[r]);
  return n;
}
function lp(e, t, n) {
  let r = ip(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, h) => d.pos - h.pos)), i = 1;
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
var cp = dp;
function dp(e, t = []) {
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
let up = we;
var fp = hp;
function hp(e, t) {
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
  return pp(r);
}
function pp(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && gp(o, i);
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
  return t.filter((o) => !o.merged).map((o) => up.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function gp(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let mp = we;
var yp = wp;
function wp(e, t) {
  let n = mp.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, h) => h.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(bp(!!t)), l = vs(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = vs(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function vs(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function bp(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let vp = cp, xp = fp, _p = yp;
var kp = xl;
function xl(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((f) => f !== s && f !== a));
  let c = vp(e, o);
  c.forEach((f) => {
    if (e.children(f.v).length) {
      let p = xl(e, f.v, n, r);
      l[f.v] = p, Object.hasOwn(p, "barycenter") && Sp(f, p);
    }
  });
  let d = xp(c, n);
  Ep(d, l);
  let h = _p(d, r);
  if (s && (h.vs = [s, h.vs, a].flat(!0), e.predecessors(s).length)) {
    let f = e.node(e.predecessors(s)[0]), p = e.node(e.predecessors(a)[0]);
    Object.hasOwn(h, "barycenter") || (h.barycenter = 0, h.weight = 0), h.barycenter = (h.barycenter * h.weight + f.order + p.order) / (h.weight + 2), h.weight += 2;
  }
  return h;
}
function Ep(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function Sp(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let Np = Fe.Graph, Cp = we;
var Mp = Ip;
function Ip(e, t, n, r) {
  r || (r = e.nodes());
  let o = $p(e), i = new Np({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
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
function $p(e) {
  for (var t; e.hasNode(t = Cp.uniqueId("_root")); ) ;
  return t;
}
var Ap = Tp;
function Tp(e, t, n) {
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
let Lp = rp, zp = sp, Op = kp, Pp = Mp, Dp = Ap, Rp = Fe.Graph, lr = we;
var Hp = _l;
function _l(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, _l);
    return;
  }
  let n = lr.maxRank(e), r = xs(e, lr.range(1, n + 1), "inEdges"), o = xs(e, lr.range(n - 1, -1, -1), "outEdges"), i = Lp(e);
  if (_s(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    Wp(l % 2 ? r : o, l % 4 >= 2), i = lr.buildLayerMatrix(e);
    let d = zp(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  _s(e, a);
}
function xs(e, t, n) {
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
    return Pp(e, i, n, r.get(i) || []);
  });
}
function Wp(e, t) {
  let n = new Rp();
  e.forEach(function(r) {
    let o = r.graph().root, i = Op(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), Dp(r, n, i.vs);
  });
}
function _s(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let Bp = Fe.Graph, rt = we;
var Vp = {
  positionX: Jp
};
function Fp(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, h) => {
      let f = Yp(e, d), p = f ? e.node(f).order : l;
      (f || d === c) && (i.slice(a, h + 1).forEach((g) => {
        e.predecessors(g).forEach((v) => {
          let w = e.node(v), m = w.order;
          (m < s || p < m) && !(w.dummy && e.node(g).dummy) && kl(n, v, g);
        });
      }), a = h + 1, s = p);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function jp(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    rt.range(s, a).forEach((h) => {
      d = i[h], e.node(d).dummy && e.predecessors(d).forEach((f) => {
        let p = e.node(f);
        p.dummy && (p.order < l || p.order > c) && kl(n, f, d);
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
function Yp(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function kl(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function Gp(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function Xp(e, t, n, r) {
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
          i[c] === c && l < s[g] && !Gp(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function Up(e, t, n, r, o) {
  let i = {}, s = qp(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(h, f) {
    let p = s.nodes(), g = p.pop(), v = {};
    for (; g; )
      v[g] ? h(g) : (v[g] = !0, p.push(g), p = p.concat(f(g))), g = p.pop();
  }
  function c(h) {
    i[h] = s.inEdges(h).reduce((f, p) => Math.max(f, i[p.v] + s.edge(p)), 0);
  }
  function d(h) {
    let f = s.outEdges(h).reduce((g, v) => Math.min(g, i[v.w] - s.edge(v)), Number.POSITIVE_INFINITY), p = e.node(h);
    f !== Number.POSITIVE_INFINITY && p.borderType !== a && (i[h] = Math.max(i[h], f));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((h) => i[h] = i[n[h]]), i;
}
function qp(e, t, n, r) {
  let o = new Bp(), i = e.graph(), s = eg(i.nodesep, i.edgesep, r);
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
function Kp(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = tg(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Zp(e, t) {
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
function Qp(e, t) {
  return rt.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function Jp(e) {
  let t = rt.buildLayerMatrix(e), n = Object.assign(
    Fp(e, t),
    jp(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((h) => Object.values(h).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = Xp(e, o, n, l), d = Up(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = rt.mapValues(d, (h) => -h)), r[s + a] = d;
    });
  });
  let i = Kp(e, r);
  return Zp(r, i), Qp(r, e.graph().align);
}
function eg(e, t, n) {
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
function tg(e, t) {
  return e.node(t).width;
}
let El = we, ng = Vp.positionX;
var rg = og;
function og(e) {
  e = El.asNonCompoundGraph(e), ig(e), Object.entries(ng(e)).forEach(([t, n]) => e.node(t).x = n);
}
function ig(e) {
  let t = El.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let ks = ah, Es = fh, sg = Ph, ag = we.normalizeRanks, lg = Wh, cg = we.removeEmptyRanks, Ss = jh, dg = Kh, Ns = Qh, ug = Hp, fg = rg, Oe = we, hg = Fe.Graph;
var pg = gg;
function gg(e, t) {
  let n = t && t.debugTiming ? Oe.time : Oe.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => Sg(e));
    n("  runLayout", () => mg(r, n, t)), n("  updateInputGraph", () => yg(e, r));
  });
}
function mg(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => Ng(e)), t("    removeSelfEdges", () => Og(e)), t("    acyclic", () => ks.run(e)), t("    nestingGraph.run", () => Ss.run(e)), t("    rank", () => sg(Oe.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Cg(e)), t("    removeEmptyRanks", () => cg(e)), t("    nestingGraph.cleanup", () => Ss.cleanup(e)), t("    normalizeRanks", () => ag(e)), t("    assignRankMinMax", () => Mg(e)), t("    removeEdgeLabelProxies", () => Ig(e)), t("    normalize.run", () => Es.run(e)), t("    parentDummyChains", () => lg(e)), t("    addBorderSegments", () => dg(e)), t("    order", () => ug(e, n)), t("    insertSelfEdges", () => Pg(e)), t("    adjustCoordinateSystem", () => Ns.adjust(e)), t("    position", () => fg(e)), t("    positionSelfEdges", () => Dg(e)), t("    removeBorderNodes", () => zg(e)), t("    normalize.undo", () => Es.undo(e)), t("    fixupEdgeLabelCoords", () => Tg(e)), t("    undoCoordinateSystem", () => Ns.undo(e)), t("    translateGraph", () => $g(e)), t("    assignNodeIntersects", () => Ag(e)), t("    reversePoints", () => Lg(e)), t("    acyclic.undo", () => ks.undo(e));
}
function yg(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let wg = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], bg = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, vg = ["acyclicer", "ranker", "rankdir", "align"], xg = ["width", "height", "rank"], Cs = { width: 0, height: 0 }, _g = ["minlen", "weight", "width", "height", "labeloffset"], kg = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Eg = ["labelpos"];
function Sg(e) {
  let t = new hg({ multigraph: !0, compound: !0 }), n = Wo(e.graph());
  return t.setGraph(Object.assign(
    {},
    bg,
    Ho(n, wg),
    Oe.pick(n, vg)
  )), e.nodes().forEach((r) => {
    let o = Wo(e.node(r));
    const i = Ho(o, xg);
    Object.keys(Cs).forEach((s) => {
      i[s] === void 0 && (i[s] = Cs[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = Wo(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      kg,
      Ho(o, _g),
      Oe.pick(o, Eg)
    ));
  }), t;
}
function Ng(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Cg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      Oe.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Mg(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function Ig(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function $g(e) {
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
function Ag(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(Oe.intersectRect(r, i)), n.points.push(Oe.intersectRect(o, s));
  });
}
function Tg(e) {
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
function Lg(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function zg(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Og(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function Pg(e) {
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
function Dg(e) {
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
let Rg = we, Hg = Fe.Graph;
var Wg = {
  debugOrdering: Bg
};
function Bg(e) {
  let t = Rg.buildLayerMatrix(e), n = new Hg({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var Vg = "1.1.8", Fg = {
  graphlib: Fe,
  layout: pg,
  debug: Wg,
  util: {
    time: we.time,
    notime: we.notime
  },
  version: Vg
};
const Ar = /* @__PURE__ */ Qa(Fg);
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
var jg = { value: () => {
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
function Yg(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
xr.prototype = qr.prototype = {
  constructor: xr,
  on: function(e, t) {
    var n = this._, r = Yg(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = Gg(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Ms(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Ms(n[o], e.name, null);
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
function Gg(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Ms(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = jg, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var oi = "http://www.w3.org/1999/xhtml";
const Is = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: oi,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Kr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Is.hasOwnProperty(t) ? { space: Is[t], local: e } : e;
}
function Xg(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === oi && t.documentElement.namespaceURI === oi ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Ug(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Sl(e) {
  var t = Kr(e);
  return (t.local ? Ug : Xg)(t);
}
function qg() {
}
function Oi(e) {
  return e == null ? qg : function() {
    return this.querySelector(e);
  };
}
function Kg(e) {
  typeof e != "function" && (e = Oi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Ae(r, this._parents);
}
function Zg(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Qg() {
  return [];
}
function Nl(e) {
  return e == null ? Qg : function() {
    return this.querySelectorAll(e);
  };
}
function Jg(e) {
  return function() {
    return Zg(e.apply(this, arguments));
  };
}
function em(e) {
  typeof e == "function" ? e = Jg(e) : e = Nl(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new Ae(r, o);
}
function Cl(e) {
  return function() {
    return this.matches(e);
  };
}
function Ml(e) {
  return function(t) {
    return t.matches(e);
  };
}
var tm = Array.prototype.find;
function nm(e) {
  return function() {
    return tm.call(this.children, e);
  };
}
function rm() {
  return this.firstElementChild;
}
function om(e) {
  return this.select(e == null ? rm : nm(typeof e == "function" ? e : Ml(e)));
}
var im = Array.prototype.filter;
function sm() {
  return Array.from(this.children);
}
function am(e) {
  return function() {
    return im.call(this.children, e);
  };
}
function lm(e) {
  return this.selectAll(e == null ? sm : am(typeof e == "function" ? e : Ml(e)));
}
function cm(e) {
  typeof e != "function" && (e = Cl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ae(r, this._parents);
}
function Il(e) {
  return new Array(e.length);
}
function dm() {
  return new Ae(this._enter || this._groups.map(Il), this._parents);
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
function um(e) {
  return function() {
    return e;
  };
}
function fm(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new Tr(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function hm(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, h = i.length, f = new Array(d), p;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (f[a] = p = s.call(l, l.__data__, a, t) + "", c.has(p) ? o[a] = l : c.set(p, l));
  for (a = 0; a < h; ++a)
    p = s.call(e, i[a], a, i) + "", (l = c.get(p)) ? (r[a] = l, l.__data__ = i[a], c.delete(p)) : n[a] = new Tr(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(f[a]) === l && (o[a] = l);
}
function pm(e) {
  return e.__data__;
}
function gm(e, t) {
  if (!arguments.length) return Array.from(this, pm);
  var n = t ? hm : fm, r = this._parents, o = this._groups;
  typeof e != "function" && (e = um(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], h = o[c], f = h.length, p = mm(e.call(d, d && d.__data__, c, r)), g = p.length, v = a[c] = new Array(g), w = s[c] = new Array(g), m = l[c] = new Array(f);
    n(d, h, v, w, m, p, t);
    for (var b = 0, y = 0, x, N; b < g; ++b)
      if (x = v[b]) {
        for (b >= y && (y = b + 1); !(N = w[y]) && ++y < g; ) ;
        x._next = N || null;
      }
  }
  return s = new Ae(s, r), s._enter = a, s._exit = l, s;
}
function mm(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function ym() {
  return new Ae(this._exit || this._groups.map(Il), this._parents);
}
function wm(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function bm(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], h = c.length, f = a[l] = new Array(h), p, g = 0; g < h; ++g)
      (p = c[g] || d[g]) && (f[g] = p);
  for (; l < o; ++l)
    a[l] = n[l];
  return new Ae(a, this._parents);
}
function vm() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function xm(e) {
  e || (e = _m);
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
function _m(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function km() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Em() {
  return Array.from(this);
}
function Sm() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function Nm() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Cm() {
  return !this.node();
}
function Mm(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function Im(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function $m(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Am(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Tm(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Lm(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function zm(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Om(e, t) {
  var n = Kr(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? $m : Im : typeof t == "function" ? n.local ? zm : Lm : n.local ? Tm : Am)(n, t));
}
function $l(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Pm(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Dm(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Rm(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function Hm(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Pm : typeof t == "function" ? Rm : Dm)(e, t, n ?? "")) : Bt(this.node(), e);
}
function Bt(e, t) {
  return e.style.getPropertyValue(t) || $l(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Wm(e) {
  return function() {
    delete this[e];
  };
}
function Bm(e, t) {
  return function() {
    this[e] = t;
  };
}
function Vm(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Fm(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Wm : typeof t == "function" ? Vm : Bm)(e, t)) : this.node()[e];
}
function Al(e) {
  return e.trim().split(/^|\s+/);
}
function Pi(e) {
  return e.classList || new Tl(e);
}
function Tl(e) {
  this._node = e, this._names = Al(e.getAttribute("class") || "");
}
Tl.prototype = {
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
function Ll(e, t) {
  for (var n = Pi(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function zl(e, t) {
  for (var n = Pi(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function jm(e) {
  return function() {
    Ll(this, e);
  };
}
function Ym(e) {
  return function() {
    zl(this, e);
  };
}
function Gm(e, t) {
  return function() {
    (t.apply(this, arguments) ? Ll : zl)(this, e);
  };
}
function Xm(e, t) {
  var n = Al(e + "");
  if (arguments.length < 2) {
    for (var r = Pi(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Gm : t ? jm : Ym)(n, t));
}
function Um() {
  this.textContent = "";
}
function qm(e) {
  return function() {
    this.textContent = e;
  };
}
function Km(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Zm(e) {
  return arguments.length ? this.each(e == null ? Um : (typeof e == "function" ? Km : qm)(e)) : this.node().textContent;
}
function Qm() {
  this.innerHTML = "";
}
function Jm(e) {
  return function() {
    this.innerHTML = e;
  };
}
function ey(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function ty(e) {
  return arguments.length ? this.each(e == null ? Qm : (typeof e == "function" ? ey : Jm)(e)) : this.node().innerHTML;
}
function ny() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function ry() {
  return this.each(ny);
}
function oy() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function iy() {
  return this.each(oy);
}
function sy(e) {
  var t = typeof e == "function" ? e : Sl(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function ay() {
  return null;
}
function ly(e, t) {
  var n = typeof e == "function" ? e : Sl(e), r = t == null ? ay : typeof t == "function" ? t : Oi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function cy() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function dy() {
  return this.each(cy);
}
function uy() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function fy() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function hy(e) {
  return this.select(e ? fy : uy);
}
function py(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function gy(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function my(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function yy(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function wy(e, t, n) {
  return function() {
    var r = this.__on, o, i = gy(t);
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
function by(e, t, n) {
  var r = my(e + ""), o, i = r.length, s;
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
  for (a = t ? wy : yy, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function Ol(e, t, n) {
  var r = $l(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function vy(e, t) {
  return function() {
    return Ol(this, e, t);
  };
}
function xy(e, t) {
  return function() {
    return Ol(this, e, t.apply(this, arguments));
  };
}
function _y(e, t) {
  return this.each((typeof t == "function" ? xy : vy)(e, t));
}
function* ky() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Pl = [null];
function Ae(e, t) {
  this._groups = e, this._parents = t;
}
function zn() {
  return new Ae([[document.documentElement]], Pl);
}
function Ey() {
  return this;
}
Ae.prototype = zn.prototype = {
  constructor: Ae,
  select: Kg,
  selectAll: em,
  selectChild: om,
  selectChildren: lm,
  filter: cm,
  data: gm,
  enter: dm,
  exit: ym,
  join: wm,
  merge: bm,
  selection: Ey,
  order: vm,
  sort: xm,
  call: km,
  nodes: Em,
  node: Sm,
  size: Nm,
  empty: Cm,
  each: Mm,
  attr: Om,
  style: Hm,
  property: Fm,
  classed: Xm,
  text: Zm,
  html: ty,
  raise: ry,
  lower: iy,
  append: sy,
  insert: ly,
  remove: dy,
  clone: hy,
  datum: py,
  on: by,
  dispatch: _y,
  [Symbol.iterator]: ky
};
function Me(e) {
  return typeof e == "string" ? new Ae([[document.querySelector(e)]], [document.documentElement]) : new Ae([[e]], Pl);
}
function Sy(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Re(e, t) {
  if (e = Sy(e), t === void 0 && (t = e.currentTarget), t) {
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
const Ny = { passive: !1 }, kn = { capture: !0, passive: !1 };
function Bo(e) {
  e.stopImmediatePropagation();
}
function Ht(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Dl(e) {
  var t = e.document.documentElement, n = Me(e).on("dragstart.drag", Ht, kn);
  "onselectstart" in t ? n.on("selectstart.drag", Ht, kn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Rl(e, t) {
  var n = e.document.documentElement, r = Me(e).on("dragstart.drag", null);
  t && (r.on("click.drag", Ht, kn), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const cr = (e) => () => e;
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
function Cy(e) {
  return !e.ctrlKey && !e.button;
}
function My() {
  return this.parentNode;
}
function Iy(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function $y() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Hl() {
  var e = Cy, t = My, n = Iy, r = $y, o = {}, i = qr("start", "drag", "end"), s = 0, a, l, c, d, h = 0;
  function f(x) {
    x.on("mousedown.drag", p).filter(r).on("touchstart.drag", w).on("touchmove.drag", m, Ny).on("touchend.drag touchcancel.drag", b).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(x, N) {
    if (!(d || !e.call(this, x, N))) {
      var S = y(this, t.call(this, x, N), x, N, "mouse");
      S && (Me(x.view).on("mousemove.drag", g, kn).on("mouseup.drag", v, kn), Dl(x.view), Bo(x), c = !1, a = x.clientX, l = x.clientY, S("start", x));
    }
  }
  function g(x) {
    if (Ht(x), !c) {
      var N = x.clientX - a, S = x.clientY - l;
      c = N * N + S * S > h;
    }
    o.mouse("drag", x);
  }
  function v(x) {
    Me(x.view).on("mousemove.drag mouseup.drag", null), Rl(x.view, c), Ht(x), o.mouse("end", x);
  }
  function w(x, N) {
    if (e.call(this, x, N)) {
      var S = x.changedTouches, C = t.call(this, x, N), T = S.length, A, B;
      for (A = 0; A < T; ++A)
        (B = y(this, C, x, N, S[A].identifier, S[A])) && (Bo(x), B("start", x, S[A]));
    }
  }
  function m(x) {
    var N = x.changedTouches, S = N.length, C, T;
    for (C = 0; C < S; ++C)
      (T = o[N[C].identifier]) && (Ht(x), T("drag", x, N[C]));
  }
  function b(x) {
    var N = x.changedTouches, S = N.length, C, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), C = 0; C < S; ++C)
      (T = o[N[C].identifier]) && (Bo(x), T("end", x, N[C]));
  }
  function y(x, N, S, C, T, A) {
    var B = i.copy(), z = Re(A || S, N), W, P, _;
    if ((_ = n.call(x, new ii("beforestart", {
      sourceEvent: S,
      target: f,
      identifier: T,
      active: s,
      x: z[0],
      y: z[1],
      dx: 0,
      dy: 0,
      dispatch: B
    }), C)) != null)
      return W = _.x - z[0] || 0, P = _.y - z[1] || 0, function I(M, E, O) {
        var $ = z, L;
        switch (M) {
          case "start":
            o[T] = I, L = s++;
            break;
          case "end":
            delete o[T], --s;
          case "drag":
            z = Re(O || E, N), L = s;
            break;
        }
        B.call(
          M,
          x,
          new ii(M, {
            sourceEvent: E,
            subject: _,
            target: f,
            identifier: T,
            active: L,
            x: z[0] + W,
            y: z[1] + P,
            dx: z[0] - $[0],
            dy: z[1] - $[1],
            dispatch: B
          }),
          C
        );
      };
  }
  return f.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : cr(!!x), f) : e;
  }, f.container = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : cr(x), f) : t;
  }, f.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : cr(x), f) : n;
  }, f.touchable = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : cr(!!x), f) : r;
  }, f.on = function() {
    var x = i.on.apply(i, arguments);
    return x === i ? f : x;
  }, f.clickDistance = function(x) {
    return arguments.length ? (h = (x = +x) * x, f) : Math.sqrt(h);
  }, f;
}
function Di(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Wl(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function On() {
}
var En = 0.7, Lr = 1 / En, Wt = "\\s*([+-]?\\d+)\\s*", Sn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ke = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Ay = /^#([0-9a-f]{3,8})$/, Ty = new RegExp(`^rgb\\(${Wt},${Wt},${Wt}\\)$`), Ly = new RegExp(`^rgb\\(${Ke},${Ke},${Ke}\\)$`), zy = new RegExp(`^rgba\\(${Wt},${Wt},${Wt},${Sn}\\)$`), Oy = new RegExp(`^rgba\\(${Ke},${Ke},${Ke},${Sn}\\)$`), Py = new RegExp(`^hsl\\(${Sn},${Ke},${Ke}\\)$`), Dy = new RegExp(`^hsla\\(${Sn},${Ke},${Ke},${Sn}\\)$`), $s = {
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
Di(On, St, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: As,
  // Deprecated! Use color.formatHex.
  formatHex: As,
  formatHex8: Ry,
  formatHsl: Hy,
  formatRgb: Ts,
  toString: Ts
});
function As() {
  return this.rgb().formatHex();
}
function Ry() {
  return this.rgb().formatHex8();
}
function Hy() {
  return Bl(this).formatHsl();
}
function Ts() {
  return this.rgb().formatRgb();
}
function St(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Ay.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Ls(t) : n === 3 ? new Ce(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? dr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? dr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Ty.exec(e)) ? new Ce(t[1], t[2], t[3], 1) : (t = Ly.exec(e)) ? new Ce(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = zy.exec(e)) ? dr(t[1], t[2], t[3], t[4]) : (t = Oy.exec(e)) ? dr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Py.exec(e)) ? Ps(t[1], t[2] / 100, t[3] / 100, 1) : (t = Dy.exec(e)) ? Ps(t[1], t[2] / 100, t[3] / 100, t[4]) : $s.hasOwnProperty(e) ? Ls($s[e]) : e === "transparent" ? new Ce(NaN, NaN, NaN, 0) : null;
}
function Ls(e) {
  return new Ce(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function dr(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ce(e, t, n, r);
}
function Wy(e) {
  return e instanceof On || (e = St(e)), e ? (e = e.rgb(), new Ce(e.r, e.g, e.b, e.opacity)) : new Ce();
}
function si(e, t, n, r) {
  return arguments.length === 1 ? Wy(e) : new Ce(e, t, n, r ?? 1);
}
function Ce(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Di(Ce, si, Wl(On, {
  brighter(e) {
    return e = e == null ? Lr : Math.pow(Lr, e), new Ce(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? En : Math.pow(En, e), new Ce(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ce(kt(this.r), kt(this.g), kt(this.b), zr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: zs,
  // Deprecated! Use color.formatHex.
  formatHex: zs,
  formatHex8: By,
  formatRgb: Os,
  toString: Os
}));
function zs() {
  return `#${_t(this.r)}${_t(this.g)}${_t(this.b)}`;
}
function By() {
  return `#${_t(this.r)}${_t(this.g)}${_t(this.b)}${_t((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Os() {
  const e = zr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${kt(this.r)}, ${kt(this.g)}, ${kt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function zr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function kt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function _t(e) {
  return e = kt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ps(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new He(e, t, n, r);
}
function Bl(e) {
  if (e instanceof He) return new He(e.h, e.s, e.l, e.opacity);
  if (e instanceof On || (e = St(e)), !e) return new He();
  if (e instanceof He) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new He(s, a, l, e.opacity);
}
function Vy(e, t, n, r) {
  return arguments.length === 1 ? Bl(e) : new He(e, t, n, r ?? 1);
}
function He(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Di(He, Vy, Wl(On, {
  brighter(e) {
    return e = e == null ? Lr : Math.pow(Lr, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? En : Math.pow(En, e), new He(this.h, this.s, this.l * e, this.opacity);
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
    return new He(Ds(this.h), ur(this.s), ur(this.l), zr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = zr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Ds(this.h)}, ${ur(this.s) * 100}%, ${ur(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Ds(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function ur(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Vo(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ri = (e) => () => e;
function Fy(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function jy(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Yy(e) {
  return (e = +e) == 1 ? Vl : function(t, n) {
    return n - t ? jy(t, n, e) : Ri(isNaN(t) ? n : t);
  };
}
function Vl(e, t) {
  var n = t - e;
  return n ? Fy(e, n) : Ri(isNaN(e) ? t : e);
}
const Or = function e(t) {
  var n = Yy(t);
  function r(o, i) {
    var s = n((o = si(o)).r, (i = si(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = Vl(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Gy(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function Xy(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Uy(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = vn(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function qy(e, t) {
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
function Ky(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = vn(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var ai = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Fo = new RegExp(ai.source, "g");
function Zy(e) {
  return function() {
    return e;
  };
}
function Qy(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Fl(e, t) {
  var n = ai.lastIndex = Fo.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = ai.exec(e)) && (o = Fo.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Ue(r, o) })), n = Fo.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? Qy(l[0].x) : Zy(t) : (t = l.length, function(c) {
    for (var d = 0, h; d < t; ++d) a[(h = l[d]).i] = h.x(c);
    return a.join("");
  });
}
function vn(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Ri(t) : (n === "number" ? Ue : n === "string" ? (r = St(t)) ? (t = r, Or) : Fl : t instanceof St ? Or : t instanceof Date ? qy : Xy(t) ? Gy : Array.isArray(t) ? Uy : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Ky : Ue)(e, t);
}
var Rs = 180 / Math.PI, li = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function jl(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * Rs,
    skewX: Math.atan(l) * Rs,
    scaleX: s,
    scaleY: a
  };
}
var fr;
function Jy(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? li : jl(t.a, t.b, t.c, t.d, t.e, t.f);
}
function e0(e) {
  return e == null || (fr || (fr = document.createElementNS("http://www.w3.org/2000/svg", "g")), fr.setAttribute("transform", e), !(e = fr.transform.baseVal.consolidate())) ? li : (e = e.matrix, jl(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Yl(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, h, f, p, g) {
    if (c !== h || d !== f) {
      var v = p.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: Ue(c, h) }, { i: v - 2, x: Ue(d, f) });
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
      var v = p.push(o(p) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: Ue(c, h) }, { i: v - 2, x: Ue(d, f) });
    } else (h !== 1 || f !== 1) && p.push(o(p) + "scale(" + h + "," + f + ")");
  }
  return function(c, d) {
    var h = [], f = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, h, f), s(c.rotate, d.rotate, h, f), a(c.skewX, d.skewX, h, f), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, h, f), c = d = null, function(p) {
      for (var g = -1, v = f.length, w; ++g < v; ) h[(w = f[g]).i] = w.x(p);
      return h.join("");
    };
  };
}
var t0 = Yl(Jy, "px, ", "px)", "deg)"), n0 = Yl(e0, ", ", ")", ")"), r0 = 1e-12;
function Hs(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function o0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function i0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const _r = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], h = s[1], f = s[2], p = d - a, g = h - l, v = p * p + g * g, w, m;
    if (v < r0)
      m = Math.log(f / c) / t, w = function(C) {
        return [
          a + C * p,
          l + C * g,
          c * Math.exp(t * C * m)
        ];
      };
    else {
      var b = Math.sqrt(v), y = (f * f - c * c + r * v) / (2 * c * n * b), x = (f * f - c * c - r * v) / (2 * f * n * b), N = Math.log(Math.sqrt(y * y + 1) - y), S = Math.log(Math.sqrt(x * x + 1) - x);
      m = (S - N) / t, w = function(C) {
        var T = C * m, A = Hs(N), B = c / (n * b) * (A * i0(t * T + N) - o0(N));
        return [
          a + B * p,
          l + B * g,
          c * A / Hs(t * T + N)
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
var Vt = 0, mn = 0, hn = 0, Gl = 1e3, Pr, yn, Dr = 0, Nt = 0, Zr = 0, Nn = typeof performance == "object" && performance.now ? performance : Date, Xl = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Hi() {
  return Nt || (Xl(s0), Nt = Nn.now() + Zr);
}
function s0() {
  Nt = 0;
}
function Rr() {
  this._call = this._time = this._next = null;
}
Rr.prototype = Ul.prototype = {
  constructor: Rr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Hi() : +n) + (t == null ? 0 : +t), !this._next && yn !== this && (yn ? yn._next = this : Pr = this, yn = this), this._call = e, this._time = n, ci();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ci());
  }
};
function Ul(e, t, n) {
  var r = new Rr();
  return r.restart(e, t, n), r;
}
function a0() {
  Hi(), ++Vt;
  for (var e = Pr, t; e; )
    (t = Nt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Vt;
}
function Ws() {
  Nt = (Dr = Nn.now()) + Zr, Vt = mn = 0;
  try {
    a0();
  } finally {
    Vt = 0, c0(), Nt = 0;
  }
}
function l0() {
  var e = Nn.now(), t = e - Dr;
  t > Gl && (Zr -= t, Dr = e);
}
function c0() {
  for (var e, t = Pr, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Pr = n);
  yn = e, ci(r);
}
function ci(e) {
  if (!Vt) {
    mn && (mn = clearTimeout(mn));
    var t = e - Nt;
    t > 24 ? (e < 1 / 0 && (mn = setTimeout(Ws, e - Nn.now() - Zr)), hn && (hn = clearInterval(hn))) : (hn || (Dr = Nn.now(), hn = setInterval(l0, Gl)), Vt = 1, Xl(Ws));
  }
}
function Bs(e, t, n) {
  var r = new Rr();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var d0 = qr("start", "end", "cancel", "interrupt"), u0 = [], ql = 0, Vs = 1, di = 2, kr = 3, Fs = 4, ui = 5, Er = 6;
function Qr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  f0(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: d0,
    tween: u0,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: ql
  });
}
function Wi(e, t) {
  var n = je(e, t);
  if (n.state > ql) throw new Error("too late; already scheduled");
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
function f0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = Ul(i, 0, n.time);
  function i(c) {
    n.state = Vs, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, h, f, p;
    if (n.state !== Vs) return l();
    for (d in r)
      if (p = r[d], p.name === n.name) {
        if (p.state === kr) return Bs(s);
        p.state === Fs ? (p.state = Er, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete r[d]) : +d < t && (p.state = Er, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete r[d]);
      }
    if (Bs(function() {
      n.state === kr && (n.state = Fs, n.timer.restart(a, n.delay, n.time), a(c));
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
function h0(e) {
  return this.each(function() {
    Sr(this, e);
  });
}
function p0(e, t) {
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
function g0(e, t, n) {
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
function m0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = je(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? p0 : g0)(n, e, t));
}
function Bi(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = Ze(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return je(o, r).value[t];
  };
}
function Kl(e, t) {
  var n;
  return (typeof t == "number" ? Ue : t instanceof St ? Or : (n = St(t)) ? (t = n, Or) : Fl)(e, t);
}
function y0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function w0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function b0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function v0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function x0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function _0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function k0(e, t) {
  var n = Kr(e), r = n === "transform" ? n0 : Kl;
  return this.attrTween(e, typeof t == "function" ? (n.local ? _0 : x0)(n, r, Bi(this, "attr." + e, t)) : t == null ? (n.local ? w0 : y0)(n) : (n.local ? v0 : b0)(n, r, t));
}
function E0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function S0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function N0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && S0(e, i)), n;
  }
  return o._value = t, o;
}
function C0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && E0(e, i)), n;
  }
  return o._value = t, o;
}
function M0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Kr(e);
  return this.tween(n, (r.local ? N0 : C0)(r, t));
}
function I0(e, t) {
  return function() {
    Wi(this, e).delay = +t.apply(this, arguments);
  };
}
function $0(e, t) {
  return t = +t, function() {
    Wi(this, e).delay = t;
  };
}
function A0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? I0 : $0)(t, e)) : je(this.node(), t).delay;
}
function T0(e, t) {
  return function() {
    Ze(this, e).duration = +t.apply(this, arguments);
  };
}
function L0(e, t) {
  return t = +t, function() {
    Ze(this, e).duration = t;
  };
}
function z0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? T0 : L0)(t, e)) : je(this.node(), t).duration;
}
function O0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ze(this, e).ease = t;
  };
}
function P0(e) {
  var t = this._id;
  return arguments.length ? this.each(O0(t, e)) : je(this.node(), t).ease;
}
function D0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ze(this, e).ease = n;
  };
}
function R0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(D0(this._id, e));
}
function H0(e) {
  typeof e != "function" && (e = Cl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new it(r, this._parents, this._name, this._id);
}
function W0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, h = s[a] = new Array(d), f, p = 0; p < d; ++p)
      (f = l[p] || c[p]) && (h[p] = f);
  for (; a < r; ++a)
    s[a] = t[a];
  return new it(s, this._parents, this._name, this._id);
}
function B0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function V0(e, t, n) {
  var r, o, i = B0(t) ? Wi : Ze;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function F0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(e) : this.each(V0(n, e, t));
}
function j0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function Y0() {
  return this.on("end.remove", j0(this._id));
}
function G0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oi(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, h, f = 0; f < l; ++f)
      (d = a[f]) && (h = e.call(d, d.__data__, f, a)) && ("__data__" in d && (h.__data__ = d.__data__), c[f] = h, Qr(c[f], t, n, f, c, je(d, n)));
  return new it(i, this._parents, t, n);
}
function X0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Nl(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, h = 0; h < c; ++h)
      if (d = l[h]) {
        for (var f = e.call(d, d.__data__, h, l), p, g = je(d, n), v = 0, w = f.length; v < w; ++v)
          (p = f[v]) && Qr(p, t, n, v, f, g);
        i.push(f), s.push(d);
      }
  return new it(i, s, t, n);
}
var U0 = zn.prototype.constructor;
function q0() {
  return new U0(this._groups, this._parents);
}
function K0(e, t) {
  var n, r, o;
  return function() {
    var i = Bt(this, e), s = (this.style.removeProperty(e), Bt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function Zl(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Z0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = Bt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function Q0(e, t, n) {
  var r, o, i;
  return function() {
    var s = Bt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Bt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function J0(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Ze(this, e), c = l.on, d = l.value[i] == null ? a || (a = Zl(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function ew(e, t, n) {
  var r = (e += "") == "transform" ? t0 : Kl;
  return t == null ? this.styleTween(e, K0(e, r)).on("end.style." + e, Zl(e)) : typeof t == "function" ? this.styleTween(e, Q0(e, r, Bi(this, "style." + e, t))).each(J0(this._id, e)) : this.styleTween(e, Z0(e, r, t), n).on("end.style." + e, null);
}
function tw(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function nw(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && tw(e, s, n)), r;
  }
  return i._value = t, i;
}
function rw(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, nw(e, t, n ?? ""));
}
function ow(e) {
  return function() {
    this.textContent = e;
  };
}
function iw(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function sw(e) {
  return this.tween("text", typeof e == "function" ? iw(Bi(this, "text", e)) : ow(e == null ? "" : e + ""));
}
function aw(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function lw(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && aw(o)), t;
  }
  return r._value = e, r;
}
function cw(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, lw(e));
}
function dw() {
  for (var e = this._name, t = this._id, n = Ql(), r = this._groups, o = r.length, i = 0; i < o; ++i)
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
function uw() {
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
var fw = 0;
function it(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ql() {
  return ++fw;
}
var tt = zn.prototype;
it.prototype = {
  constructor: it,
  select: G0,
  selectAll: X0,
  selectChild: tt.selectChild,
  selectChildren: tt.selectChildren,
  filter: H0,
  merge: W0,
  selection: q0,
  transition: dw,
  call: tt.call,
  nodes: tt.nodes,
  node: tt.node,
  size: tt.size,
  empty: tt.empty,
  each: tt.each,
  on: F0,
  attr: k0,
  attrTween: M0,
  style: ew,
  styleTween: rw,
  text: sw,
  textTween: cw,
  remove: Y0,
  tween: m0,
  delay: A0,
  duration: z0,
  ease: P0,
  easeVarying: R0,
  end: uw,
  [Symbol.iterator]: tt[Symbol.iterator]
};
function hw(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var pw = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: hw
};
function gw(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function mw(e) {
  var t, n;
  e instanceof it ? (t = e._id, e = e._name) : (t = Ql(), (n = pw).time = Hi(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Qr(l, e, t, c, s, n || gw(l, t));
  return new it(r, this._parents, e, t);
}
zn.prototype.interrupt = h0;
zn.prototype.transition = mw;
const hr = (e) => () => e;
function yw(e, {
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
Jl.prototype = ot.prototype;
function Jl(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Jr;
  return e.__zoom;
}
function jo(e) {
  e.stopImmediatePropagation();
}
function pn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function ww(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function bw() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function js() {
  return this.__zoom || Jr;
}
function vw(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function xw() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function _w(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function ec() {
  var e = ww, t = bw, n = _w, r = vw, o = xw, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = _r, c = qr("start", "zoom", "end"), d, h, f, p = 500, g = 150, v = 0, w = 10;
  function m(_) {
    _.property("__zoom", js).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", B).filter(o).on("touchstart.zoom", z).on("touchmove.zoom", W).on("touchend.zoom touchcancel.zoom", P).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(_, I, M, E) {
    var O = _.selection ? _.selection() : _;
    O.property("__zoom", js), _ !== O ? N(_, I, M, E) : O.interrupt().each(function() {
      S(this, arguments).event(E).start().zoom(null, typeof I == "function" ? I.apply(this, arguments) : I).end();
    });
  }, m.scaleBy = function(_, I, M, E) {
    m.scaleTo(_, function() {
      var O = this.__zoom.k, $ = typeof I == "function" ? I.apply(this, arguments) : I;
      return O * $;
    }, M, E);
  }, m.scaleTo = function(_, I, M, E) {
    m.transform(_, function() {
      var O = t.apply(this, arguments), $ = this.__zoom, L = M == null ? x(O) : typeof M == "function" ? M.apply(this, arguments) : M, D = $.invert(L), V = typeof I == "function" ? I.apply(this, arguments) : I;
      return n(y(b($, V), L, D), O, s);
    }, M, E);
  }, m.translateBy = function(_, I, M, E) {
    m.transform(_, function() {
      return n(this.__zoom.translate(
        typeof I == "function" ? I.apply(this, arguments) : I,
        typeof M == "function" ? M.apply(this, arguments) : M
      ), t.apply(this, arguments), s);
    }, null, E);
  }, m.translateTo = function(_, I, M, E, O) {
    m.transform(_, function() {
      var $ = t.apply(this, arguments), L = this.__zoom, D = E == null ? x($) : typeof E == "function" ? E.apply(this, arguments) : E;
      return n(Jr.translate(D[0], D[1]).scale(L.k).translate(
        typeof I == "function" ? -I.apply(this, arguments) : -I,
        typeof M == "function" ? -M.apply(this, arguments) : -M
      ), $, s);
    }, E, O);
  };
  function b(_, I) {
    return I = Math.max(i[0], Math.min(i[1], I)), I === _.k ? _ : new ot(I, _.x, _.y);
  }
  function y(_, I, M) {
    var E = I[0] - M[0] * _.k, O = I[1] - M[1] * _.k;
    return E === _.x && O === _.y ? _ : new ot(_.k, E, O);
  }
  function x(_) {
    return [(+_[0][0] + +_[1][0]) / 2, (+_[0][1] + +_[1][1]) / 2];
  }
  function N(_, I, M, E) {
    _.on("start.zoom", function() {
      S(this, arguments).event(E).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event(E).end();
    }).tween("zoom", function() {
      var O = this, $ = arguments, L = S(O, $).event(E), D = t.apply(O, $), V = M == null ? x(D) : typeof M == "function" ? M.apply(O, $) : M, j = Math.max(D[1][0] - D[0][0], D[1][1] - D[0][1]), G = O.__zoom, Y = typeof I == "function" ? I.apply(O, $) : I, ne = l(G.invert(V).concat(j / G.k), Y.invert(V).concat(j / Y.k));
      return function(Z) {
        if (Z === 1) Z = Y;
        else {
          var R = ne(Z), F = j / R[2];
          Z = new ot(F, V[0] - R[0] * F, V[1] - R[1] * F);
        }
        L.zoom(null, Z);
      };
    });
  }
  function S(_, I, M) {
    return !M && _.__zooming || new C(_, I);
  }
  function C(_, I) {
    this.that = _, this.args = I, this.active = 0, this.sourceEvent = null, this.extent = t.apply(_, I), this.taps = 0;
  }
  C.prototype = {
    event: function(_) {
      return _ && (this.sourceEvent = _), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(_, I) {
      return this.mouse && _ !== "mouse" && (this.mouse[1] = I.invert(this.mouse[0])), this.touch0 && _ !== "touch" && (this.touch0[1] = I.invert(this.touch0[0])), this.touch1 && _ !== "touch" && (this.touch1[1] = I.invert(this.touch1[0])), this.that.__zoom = I, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(_) {
      var I = Me(this.that).datum();
      c.call(
        _,
        this.that,
        new yw(_, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        I
      );
    }
  };
  function T(_, ...I) {
    if (!e.apply(this, arguments)) return;
    var M = S(this, I).event(_), E = this.__zoom, O = Math.max(i[0], Math.min(i[1], E.k * Math.pow(2, r.apply(this, arguments)))), $ = Re(_);
    if (M.wheel)
      (M.mouse[0][0] !== $[0] || M.mouse[0][1] !== $[1]) && (M.mouse[1] = E.invert(M.mouse[0] = $)), clearTimeout(M.wheel);
    else {
      if (E.k === O) return;
      M.mouse = [$, E.invert($)], Sr(this), M.start();
    }
    pn(_), M.wheel = setTimeout(L, g), M.zoom("mouse", n(y(b(E, O), M.mouse[0], M.mouse[1]), M.extent, s));
    function L() {
      M.wheel = null, M.end();
    }
  }
  function A(_, ...I) {
    if (f || !e.apply(this, arguments)) return;
    var M = _.currentTarget, E = S(this, I, !0).event(_), O = Me(_.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", j, !0), $ = Re(_, M), L = _.clientX, D = _.clientY;
    Dl(_.view), jo(_), E.mouse = [$, this.__zoom.invert($)], Sr(this), E.start();
    function V(G) {
      if (pn(G), !E.moved) {
        var Y = G.clientX - L, ne = G.clientY - D;
        E.moved = Y * Y + ne * ne > v;
      }
      E.event(G).zoom("mouse", n(y(E.that.__zoom, E.mouse[0] = Re(G, M), E.mouse[1]), E.extent, s));
    }
    function j(G) {
      O.on("mousemove.zoom mouseup.zoom", null), Rl(G.view, E.moved), pn(G), E.event(G).end();
    }
  }
  function B(_, ...I) {
    if (e.apply(this, arguments)) {
      var M = this.__zoom, E = Re(_.changedTouches ? _.changedTouches[0] : _, this), O = M.invert(E), $ = M.k * (_.shiftKey ? 0.5 : 2), L = n(y(b(M, $), E, O), t.apply(this, I), s);
      pn(_), a > 0 ? Me(this).transition().duration(a).call(N, L, E, _) : Me(this).call(m.transform, L, E, _);
    }
  }
  function z(_, ...I) {
    if (e.apply(this, arguments)) {
      var M = _.touches, E = M.length, O = S(this, I, _.changedTouches.length === E).event(_), $, L, D, V;
      for (jo(_), L = 0; L < E; ++L)
        D = M[L], V = Re(D, this), V = [V, this.__zoom.invert(V), D.identifier], O.touch0 ? !O.touch1 && O.touch0[2] !== V[2] && (O.touch1 = V, O.taps = 0) : (O.touch0 = V, $ = !0, O.taps = 1 + !!d);
      d && (d = clearTimeout(d)), $ && (O.taps < 2 && (h = V[0], d = setTimeout(function() {
        d = null;
      }, p)), Sr(this), O.start());
    }
  }
  function W(_, ...I) {
    if (this.__zooming) {
      var M = S(this, I).event(_), E = _.changedTouches, O = E.length, $, L, D, V;
      for (pn(_), $ = 0; $ < O; ++$)
        L = E[$], D = Re(L, this), M.touch0 && M.touch0[2] === L.identifier ? M.touch0[0] = D : M.touch1 && M.touch1[2] === L.identifier && (M.touch1[0] = D);
      if (L = M.that.__zoom, M.touch1) {
        var j = M.touch0[0], G = M.touch0[1], Y = M.touch1[0], ne = M.touch1[1], Z = (Z = Y[0] - j[0]) * Z + (Z = Y[1] - j[1]) * Z, R = (R = ne[0] - G[0]) * R + (R = ne[1] - G[1]) * R;
        L = b(L, Math.sqrt(Z / R)), D = [(j[0] + Y[0]) / 2, (j[1] + Y[1]) / 2], V = [(G[0] + ne[0]) / 2, (G[1] + ne[1]) / 2];
      } else if (M.touch0) D = M.touch0[0], V = M.touch0[1];
      else return;
      M.zoom("touch", n(y(L, D, V), M.extent, s));
    }
  }
  function P(_, ...I) {
    if (this.__zooming) {
      var M = S(this, I).event(_), E = _.changedTouches, O = E.length, $, L;
      for (jo(_), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, p), $ = 0; $ < O; ++$)
        L = E[$], M.touch0 && M.touch0[2] === L.identifier ? delete M.touch0 : M.touch1 && M.touch1[2] === L.identifier && delete M.touch1;
      if (M.touch1 && !M.touch0 && (M.touch0 = M.touch1, delete M.touch1), M.touch0) M.touch0[1] = this.__zoom.invert(M.touch0[0]);
      else if (M.end(), M.taps === 2 && (L = Re(L, this), Math.hypot(h[0] - L[0], h[1] - L[1]) < w)) {
        var D = Me(this).on("dblclick.zoom");
        D && D.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(_) {
    return arguments.length ? (r = typeof _ == "function" ? _ : hr(+_), m) : r;
  }, m.filter = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : hr(!!_), m) : e;
  }, m.touchable = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : hr(!!_), m) : o;
  }, m.extent = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : hr([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), m) : t;
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
    return arguments.length ? (v = (_ = +_) * _, m) : Math.sqrt(v);
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
}, Cn = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], tc = ["Enter", " ", "Escape"], nc = {
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
var Mn;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Mn || (Mn = {}));
const rc = {
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
const Ys = {
  [U.Left]: U.Right,
  [U.Right]: U.Left,
  [U.Top]: U.Bottom,
  [U.Bottom]: U.Top
}, oc = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, kw = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Vi = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Pn = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ye(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Ew = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Vi(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, eo(o, Hr(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? to(r) : { x: 0, y: 0, width: 0, height: 0 };
}, Dn = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = eo(n, Hr(o)), r = !0);
  }), r ? to(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Fi = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, h = [];
  for (const f of e.values()) {
    const { measured: p, selectable: g = !0, hidden: v = !1 } = f;
    if (s && !g || v)
      continue;
    const w = p.width ?? f.width ?? f.initialWidth ?? 0, m = p.height ?? f.height ?? f.initialHeight ?? 0, { x: b, y } = f.internals.positionAbsolute, x = lc(a, l, c, d, b, y, w, m), N = w * m, S = i && x > 0;
    (!f.internals.handleBounds || S || x >= N || f.dragging) && h.push(f);
  }
  return h;
}, Sw = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function Nw(e, t) {
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
async function Cw({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Nw(e, s), l = Dn(a), c = no(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function ic({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
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
async function Mw({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((f) => f.id)), s = [];
  for (const f of n) {
    if (f.deletable === !1)
      continue;
    const p = i.has(f.id), g = !p && f.parentId && s.find((v) => v.id === f.parentId);
    (p || g) && s.push(f);
  }
  const a = new Set(t.map((f) => f.id)), l = r.filter((f) => f.deletable !== !1), d = Sw(s, l);
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
function sc(e, t, n) {
  const { width: r, height: o } = Ye(n), { x: i, y: s } = n.internals.positionAbsolute;
  return Ct(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const Gs = (e, t, n) => e < t ? Yt(Math.abs(e - t), 1, t) / t : e > n ? -Yt(Math.abs(e - n), 1, t) / t : 0, ji = (e, t, n = 15, r = 40) => {
  const o = Gs(e.x, r, t.width - r) * n, i = Gs(e.y, r, t.height - r) * n;
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
}), In = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Vi(e) ? e.internals.positionAbsolute : Pn(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Hr = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Vi(e) ? e.internals.positionAbsolute : Pn(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, ac = (e, t) => to(eo(fi(e), fi(t))), lc = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Wr = (e, t) => lc(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Xs = (e) => We(e.width) && We(e.height) && We(e.x) && We(e.y), We = (e) => !isNaN(e) && isFinite(e), cc = (e, t) => (n, r) => {
}, Rn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Hn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Rn(a, s) : a;
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
function Iw(e, t, n) {
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
function $w(e, t, n, r, o, i) {
  const { x: s, y: a } = Gt(e, [t, n, r]), { x: l, y: c } = Gt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, h = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(h)
  };
}
const no = (e, t, n, r, o, i) => {
  const s = Iw(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = Yt(c, r, o), h = e.x + e.width / 2, f = e.y + e.height / 2, p = t / 2 - h * d, g = n / 2 - f * d, v = $w(e, p, g, d, t, n), w = {
    left: Math.min(v.left - s.left, 0),
    top: Math.min(v.top - s.top, 0),
    right: Math.min(v.right - s.right, 0),
    bottom: Math.min(v.bottom - s.bottom, 0)
  };
  return {
    x: p - w.left + w.right,
    y: g - w.top + w.bottom,
    zoom: d
  };
}, $n = () => {
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
function dc(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function uc(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Us(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Aw() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function Tw(e) {
  return { ...nc, ...e || {} };
}
function fc(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function xn(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Be(e), a = Hn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Rn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const Yi = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), hc = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, Lw = ["INPUT", "SELECT", "TEXTAREA"];
function pc(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : Lw.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const gc = (e) => "clientX" in e, Be = (e, t) => {
  var i, s;
  const n = gc(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, qs = (e, t, n, r, o) => {
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
      ...Yi(s)
    };
  });
};
function mc({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), h = Math.abs(c - t);
  return [l, c, d, h];
}
function pr(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Ks({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case U.Left:
      return [t - pr(t - r, i), n];
    case U.Right:
      return [t + pr(r - t, i), n];
    case U.Top:
      return [t, n - pr(n - o, i)];
    case U.Bottom:
      return [t, n + pr(o - n, i)];
  }
}
function yc({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top, curvature: s = 0.25 }) {
  const [a, l] = Ks({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = Ks({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [h, f, p, g] = mc({
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
function wc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function zw({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function Ow({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
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
const Pw = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Dw = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Rw = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Ve.error006()), t;
  const r = n.getEdgeId || Pw;
  let o;
  return oc(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, Dw(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function bc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = wc({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const Zs = {
  [U.Left]: { x: -1, y: 0 },
  [U.Right]: { x: 1, y: 0 },
  [U.Top]: { x: 0, y: -1 },
  [U.Bottom]: { x: 0, y: 1 }
}, Hw = ({ source: e, sourcePosition: t = U.Bottom, target: n }) => t === U.Left || t === U.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Qs = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Ww({ source: e, sourcePosition: t = U.Bottom, target: n, targetPosition: r = U.Top, center: o, offset: i, stepPosition: s }) {
  const a = Zs[t], l = Zs[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, h = Hw({
    source: c,
    sourcePosition: t,
    target: d
  }), f = h.x !== 0 ? "x" : "y", p = h[f];
  let g = [], v, w;
  const m = { x: 0, y: 0 }, b = { x: 0, y: 0 }, [, , y, x] = wc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[f] * l[f] === -1) {
    f === "x" ? (v = o.x ?? c.x + (d.x - c.x) * s, w = o.y ?? (c.y + d.y) / 2) : (v = o.x ?? (c.x + d.x) / 2, w = o.y ?? c.y + (d.y - c.y) * s);
    const T = [
      { x: v, y: c.y },
      { x: v, y: d.y }
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
        const I = Math.min(i - 1, i - _);
        a[f] === p ? m[f] = (c[f] > e[f] ? -1 : 1) * I : b[f] = (d[f] > n[f] ? -1 : 1) * I;
      }
    }
    if (t !== r) {
      const _ = f === "x" ? "y" : "x", I = a[f] === l[_], M = c[_] > d[_], E = c[_] < d[_];
      (a[f] === 1 && (!I && M || I && E) || a[f] !== 1 && (!I && E || I && M)) && (g = f === "x" ? T : A);
    }
    const B = { x: c.x + m.x, y: c.y + m.y }, z = { x: d.x + b.x, y: d.y + b.y }, W = Math.max(Math.abs(B.x - g[0].x), Math.abs(z.x - g[0].x)), P = Math.max(Math.abs(B.y - g[0].y), Math.abs(z.y - g[0].y));
    W >= P ? (v = (B.x + z.x) / 2, w = g[0].y) : (v = g[0].x, w = (B.y + z.y) / 2);
  }
  const N = { x: c.x + m.x, y: c.y + m.y }, S = { x: d.x + b.x, y: d.y + b.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...N.x !== g[0].x || N.y !== g[0].y ? [N] : [],
    ...g,
    ...S.x !== g[g.length - 1].x || S.y !== g[g.length - 1].y ? [S] : [],
    n
  ], v, w, y, x];
}
function Bw(e, t, n, r) {
  const o = Math.min(Qs(e, t) / 2, Qs(t, n) / 2, r), { x: i, y: s } = t;
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
  const [h, f, p, g, v] = Ww({
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
    w += Bw(h[m - 1], h[m], h[m + 1], s);
  return w += `L${h[h.length - 1].x} ${h[h.length - 1].y}`, [w, f, p, g, v];
}
function Js(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Vw(e) {
  var h;
  const { sourceNode: t, targetNode: n } = e;
  if (!Js(t) || !Js(n))
    return null;
  const r = t.internals.handleBounds || ea(t.handles), o = n.internals.handleBounds || ea(n.handles), i = ta((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = ta(
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
function ea(e) {
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
function ta(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function pi(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function Fw(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = pi(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const vc = 1e3, jw = 10, Gi = {
  nodeOrigin: [0, 0],
  nodeExtent: Cn,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Yw = {
  ...Gi,
  checkEquality: !0
};
function Xi(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function Gw(e, t, n) {
  const r = Xi(Gi, n);
  for (const o of e.values())
    if (o.parentId)
      qi(o, e, t, r);
    else {
      const i = Pn(o, r.nodeOrigin), s = Mt(o.extent) ? o.extent : r.nodeExtent, a = Ct(i, s, Ye(o));
      o.internals.positionAbsolute = a;
    }
}
function Xw(e, t) {
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
function Ui(e) {
  return e === "manual";
}
function gi(e, t, n, r = {}) {
  var d, h;
  const o = Xi(Yw, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !Ui(o.zIndexMode) ? vc : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const f of e) {
    let p = s.get(f.id);
    if (o.checkEquality && f === (p == null ? void 0 : p.internals.userNode))
      t.set(f.id, p);
    else {
      const g = Pn(f, o.nodeOrigin), v = Mt(f.extent) ? f.extent : o.nodeExtent, w = Ct(g, v, Ye(f));
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
          handleBounds: Xw(f, p),
          z: xc(f, a, o.zIndexMode),
          userNode: f
        }
      }, t.set(f.id, p);
    }
    (p.measured === void 0 || p.measured.width === void 0 || p.measured.height === void 0) && !p.hidden && (l = !1), f.parentId && qi(p, t, n, r, i), c || (c = f.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Uw(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function qi(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Xi(Gi, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Uw(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * jw), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const h = i && !Ui(l) ? vc : 0, { x: f, y: p, z: g } = qw(e, d, s, a, h, l), { positionAbsolute: v } = e.internals, w = f !== v.x || p !== v.y;
  (w || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: w ? { x: f, y: p } : v,
      z: g
    }
  });
}
function xc(e, t, n) {
  const r = We(e.zIndex) ? e.zIndex : 0;
  return Ui(n) ? r : r + (e.selected ? t : 0);
}
function qw(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ye(e), c = Pn(e, n), d = Mt(e.extent) ? Ct(c, e.extent, l) : c;
  let h = Ct({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (h = sc(h, l, t));
  const f = xc(e, o, i), p = t.internals.z ?? 0;
  return {
    x: h.x,
    y: h.y,
    z: p >= f ? p + 1 : f
  };
}
function Ki(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? In(l), d = ac(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var y;
    const d = l.internals.positionAbsolute, h = Ye(l), f = l.origin ?? r, p = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, v = Math.max(h.width, Math.round(a.width)), w = Math.max(h.height, Math.round(a.height)), m = (v - h.width) * f[0], b = (w - h.height) * f[1];
    (p > 0 || g > 0 || m || b) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - p + m,
        y: l.position.y - g + b
      }
    }), (y = n.get(c)) == null || y.forEach((x) => {
      e.some((N) => N.id === x.id) || o.push({
        id: x.id,
        type: "position",
        position: {
          x: x.position.x + p,
          y: x.position.y + g
        }
      });
    })), (h.width < a.width || h.height < a.height || p || g) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: v + (p ? f[0] * p - m : 0),
        height: w + (g ? f[1] * g - b : 0)
      }
    });
  }), o;
}
function Kw(e, t, n, r, o, i, s) {
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
    const v = Yi(p.nodeElement), w = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (w || !g.internals.handleBounds || p.force))) {
      const b = p.nodeElement.getBoundingClientRect(), y = Mt(g.extent) ? g.extent : i;
      let { positionAbsolute: x } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const S = t.get(g.parentId);
        S && (x = sc(x, v, S));
      } else y && (x = Ct(x, y, v));
      const N = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: x,
          handleBounds: {
            source: qs("source", p.nodeElement, b, h, g.id),
            target: qs("target", p.nodeElement, b, h, g.id)
          }
        }
      };
      t.set(g.id, N), g.parentId && qi(N, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, w && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && f.push({
        id: g.id,
        parentId: g.parentId,
        rect: In(N, o)
      }));
    }
  }
  if (f.length > 0) {
    const p = Ki(f, t, n, o);
    c.push(...p);
  }
  return { changes: c, updatedInternals: l };
}
async function Zw({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function na(e, t, n, r, o, i) {
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
function _c(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    na("source", l, d, e, o, s), na("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function kc(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : kc(n, t) : !1;
}
function ra(e, t, n) {
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
function Qw(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !kc(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function Jw({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Rn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function eb({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, h = !1, f = null, p = !1, g = !1, v = null;
  function w({ noDragClassName: b, handleSelector: y, domNode: x, isSelectable: N, nodeId: S, nodeClickDistance: C = 0 }) {
    f = Me(x);
    function T({ x: W, y: P }) {
      const { nodeLookup: _, nodeExtent: I, snapGrid: M, snapToGrid: E, nodeOrigin: O, onNodeDrag: $, onSelectionDrag: L, onError: D, updateNodePositions: V } = t();
      i = { x: W, y: P };
      let j = !1;
      const G = a.size > 1, Y = G && I ? fi(Dn(a)) : null, ne = G && E ? Jw({
        dragItems: a,
        snapGrid: M,
        x: W,
        y: P
      }) : null;
      for (const [Z, R] of a) {
        if (!_.has(Z))
          continue;
        let F = { x: W - R.distance.x, y: P - R.distance.y };
        E && (F = ne ? {
          x: Math.round(F.x + ne.x),
          y: Math.round(F.y + ne.y)
        } : Rn(F, M));
        let q = null;
        if (G && I && !R.extent && Y) {
          const { positionAbsolute: ee } = R.internals, te = ee.x - Y.x + I[0][0], re = ee.x + R.measured.width - Y.x2 + I[1][0], ie = ee.y - Y.y + I[0][1], ce = ee.y + R.measured.height - Y.y2 + I[1][1];
          q = [
            [te, ie],
            [re, ce]
          ];
        }
        const { position: J, positionAbsolute: K } = ic({
          nodeId: Z,
          nextPosition: F,
          nodeLookup: _,
          nodeExtent: q || I,
          nodeOrigin: O,
          onError: D
        });
        j = j || R.position.x !== J.x || R.position.y !== J.y, R.position = J, R.internals.positionAbsolute = K;
      }
      if (g = g || j, !!j && (V(a, !0), v && (r || $ || !S && L))) {
        const [Z, R] = Yo({
          nodeId: S,
          dragItems: a,
          nodeLookup: _
        });
        r == null || r(v, a, Z, R), $ == null || $(v, Z, R), S || L == null || L(v, R);
      }
    }
    async function A() {
      if (!d)
        return;
      const { transform: W, panBy: P, autoPanSpeed: _, autoPanOnNodeDrag: I } = t();
      if (!I) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [M, E] = ji(c, d, _);
      (M !== 0 || E !== 0) && (i.x = (i.x ?? 0) - M / W[2], i.y = (i.y ?? 0) - E / W[2], await P({ x: M, y: E }) && T(i)), s = requestAnimationFrame(A);
    }
    function B(W) {
      var G;
      const { nodeLookup: P, multiSelectionActive: _, nodesDraggable: I, transform: M, snapGrid: E, snapToGrid: O, selectNodesOnDrag: $, onNodeDragStart: L, onSelectionDragStart: D, unselectNodesAndEdges: V } = t();
      h = !0, (!$ || !N) && !_ && S && ((G = P.get(S)) != null && G.selected || V()), N && $ && S && (e == null || e(S));
      const j = xn(W.sourceEvent, { transform: M, snapGrid: E, snapToGrid: O, containerBounds: d });
      if (i = j, a = Qw(P, I, j, S), a.size > 0 && (n || L || !S && D)) {
        const [Y, ne] = Yo({
          nodeId: S,
          dragItems: a,
          nodeLookup: P
        });
        n == null || n(W.sourceEvent, a, Y, ne), L == null || L(W.sourceEvent, Y, ne), S || D == null || D(W.sourceEvent, ne);
      }
    }
    const z = Hl().clickDistance(C).on("start", (W) => {
      const { domNode: P, nodeDragThreshold: _, transform: I, snapGrid: M, snapToGrid: E } = t();
      d = (P == null ? void 0 : P.getBoundingClientRect()) || null, p = !1, g = !1, v = W.sourceEvent, _ === 0 && B(W), i = xn(W.sourceEvent, { transform: I, snapGrid: M, snapToGrid: E, containerBounds: d }), c = Be(W.sourceEvent, d);
    }).on("drag", (W) => {
      const { autoPanOnNodeDrag: P, transform: _, snapGrid: I, snapToGrid: M, nodeDragThreshold: E, nodeLookup: O } = t(), $ = xn(W.sourceEvent, { transform: _, snapGrid: I, snapToGrid: M, containerBounds: d });
      if (v = W.sourceEvent, (W.sourceEvent.type === "touchmove" && W.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      S && !O.has(S)) && (p = !0), !p) {
        if (!l && P && h && (l = !0, A()), !h) {
          const L = Be(W.sourceEvent, d), D = L.x - c.x, V = L.y - c.y;
          Math.sqrt(D * D + V * V) > E && B(W);
        }
        (i.x !== $.xSnapped || i.y !== $.ySnapped) && a && h && (c = Be(W.sourceEvent, d), T($));
      }
    }).on("end", (W) => {
      if (!h || p) {
        p && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, h = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: P, updateNodePositions: _, onNodeDragStop: I, onSelectionDragStop: M } = t();
        if (g && (_(a, !1), g = !1), o || I || !S && M) {
          const [E, O] = Yo({
            nodeId: S,
            dragItems: a,
            nodeLookup: P,
            dragging: !1
          });
          o == null || o(W.sourceEvent, a, E, O), I == null || I(W.sourceEvent, E, O), S || M == null || M(W.sourceEvent, O);
        }
      }
    }).filter((W) => {
      const P = W.target;
      return !W.button && (!b || !ra(P, `.${b}`, x)) && (!y || ra(P, y, x));
    });
    f.call(z);
  }
  function m() {
    f == null || f.on(".drag", null);
  }
  return {
    update: w,
    destroy: m
  };
}
function tb(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Wr(o, In(i)) > 0 && r.push(i);
  return r;
}
const nb = 250;
function rb(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = tb(e, n, t + nb);
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
function Ec(e, t, n, r, o, i = !1) {
  var c, d, h;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((h = s.internals.handleBounds) == null ? void 0 : h.target) ?? []], l = (n ? a == null ? void 0 : a.find((f) => f.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...It(s, l, l.position, !0) } : l;
}
function Sc(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function ob(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Nc = () => !0;
function ib(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: h, panBy: f, cancelConnection: p, onConnectStart: g, onConnect: v, onConnectEnd: w, isValidConnection: m = Nc, onReconnectEnd: b, updateConnection: y, getTransform: x, getFromHandle: N, autoPanSpeed: S, dragThreshold: C = 1, handleDomNode: T }) {
  const A = hc(e.target);
  let B = 0, z;
  const { x: W, y: P } = Be(e), _ = Sc(i, T), I = a == null ? void 0 : a.getBoundingClientRect();
  let M = !1;
  if (!I || !_)
    return;
  const E = Ec(o, _, r, l, t);
  if (!E)
    return;
  let O = Be(e, I), $ = !1, L = null, D = !1, V = null;
  function j() {
    if (!d || !I)
      return;
    const [J, K] = ji(O, I, S);
    f({ x: J, y: K }), B = requestAnimationFrame(j);
  }
  const G = {
    ...E,
    nodeId: o,
    type: _,
    position: E.position
  }, Y = l.get(o);
  let Z = {
    inProgress: !0,
    isValid: null,
    from: It(Y, G, U.Left, !0),
    fromHandle: G,
    fromPosition: G.position,
    fromNode: Y,
    to: O,
    toHandle: null,
    toPosition: Ys[G.position],
    toNode: null,
    pointer: O
  };
  function R() {
    M = !0, y(Z), g == null || g(e, { nodeId: o, handleId: r, handleType: _ });
  }
  C === 0 && R();
  function F(J) {
    if (!M) {
      const { x: ce, y: ke } = Be(J), Ee = ce - W, Te = ke - P;
      if (!(Ee * Ee + Te * Te > C * C))
        return;
      R();
    }
    if (!N() || !G) {
      q(J);
      return;
    }
    const K = x();
    O = Be(J, I), z = rb(Hn(O, K, !1, [1, 1]), n, l, G), $ || (j(), $ = !0);
    const ee = Cc(J, {
      handle: z,
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
    V = ee.handleDomNode, L = ee.connection, D = ob(!!z, ee.isValid);
    const te = l.get(o), re = te ? It(te, G, U.Left, !0) : Z.from, ie = {
      ...Z,
      from: re,
      isValid: D,
      to: ee.toHandle && D ? Gt({ x: ee.toHandle.x, y: ee.toHandle.y }, K) : O,
      toHandle: ee.toHandle,
      toPosition: D && ee.toHandle ? ee.toHandle.position : Ys[G.position],
      toNode: ee.toHandle ? l.get(ee.toHandle.nodeId) : null,
      pointer: O
    };
    y(ie), Z = ie;
  }
  function q(J) {
    if (!("touches" in J && J.touches.length > 0)) {
      if (M) {
        (z || V) && L && D && (v == null || v(L));
        const { inProgress: K, ...ee } = Z, te = {
          ...ee,
          toPosition: Z.toHandle ? Z.toPosition : null
        };
        w == null || w(J, te), i && (b == null || b(J, te));
      }
      p(), cancelAnimationFrame(B), $ = !1, D = !1, L = null, V = null, A.removeEventListener("mousemove", F), A.removeEventListener("mouseup", q), A.removeEventListener("touchmove", F), A.removeEventListener("touchend", q);
    }
  }
  A.addEventListener("mousemove", F), A.addEventListener("mouseup", q), A.addEventListener("touchmove", F), A.addEventListener("touchend", q);
}
function Cc(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Nc, nodeLookup: d }) {
  const h = i === "target", f = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: p, y: g } = Be(e), v = s.elementFromPoint(p, g), w = v != null && v.classList.contains(`${a}-flow__handle`) ? v : f, m = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const b = Sc(void 0, w), y = w.getAttribute("data-nodeid"), x = w.getAttribute("data-handleid"), N = w.classList.contains("connectable"), S = w.classList.contains("connectableend");
    if (!y || !b)
      return m;
    const C = {
      source: h ? y : r,
      sourceHandle: h ? x : o,
      target: h ? r : y,
      targetHandle: h ? o : x
    };
    m.connection = C;
    const A = N && S && (n === Ft.Strict ? h && b === "source" || !h && b === "target" : y !== r || x !== o);
    m.isValid = A && c(C), m.toHandle = Ec(y, b, x, d, n, !0);
  }
  return m;
}
const mi = {
  onPointerDown: ib,
  isValid: Cc
};
function sb({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Me(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: h = !0, zoomable: f = !0, inversePan: p = !1 }) {
    const g = (y) => {
      if (y.sourceEvent.type !== "wheel" || !t)
        return;
      const x = n(), N = y.sourceEvent.ctrlKey && $n() ? 10 : 1, S = -y.sourceEvent.deltaY * (y.sourceEvent.deltaMode === 1 ? 0.05 : y.sourceEvent.deltaMode ? 1 : 2e-3) * d, C = x[2] * Math.pow(2, S * N);
      t.scaleTo(C);
    };
    let v = [0, 0];
    const w = (y) => {
      (y.sourceEvent.type === "mousedown" || y.sourceEvent.type === "touchstart") && (v = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ]);
    }, m = (y) => {
      const x = n();
      if (y.sourceEvent.type !== "mousemove" && y.sourceEvent.type !== "touchmove" || !t)
        return;
      const N = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ], S = [N[0] - v[0], N[1] - v[1]];
      v = N;
      const C = r() * Math.max(x[2], Math.log(x[2])) * (p ? -1 : 1), T = {
        x: x[0] - S[0] * C,
        y: x[1] - S[1] * C
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: T.x,
        y: T.y,
        zoom: x[2]
      }, A, a);
    }, b = ec().on("start", w).on("zoom", h ? m : null).on("zoom.wheel", f ? g : null);
    o.call(b, {});
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
}), Go = ({ x: e, y: t, zoom: n }) => Jr.translate(e, t).scale(n), lt = (e, t) => e.target.closest(`.${t}`), Mc = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), ab = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Xo = (e, t = 0, n = ab, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Ic = (e) => {
  const t = e.ctrlKey && $n() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function lb({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (lt(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const h = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const w = Re(d), m = Ic(d), b = h * Math.pow(2, m);
      r.scaleTo(n, b, w, d);
      return;
    }
    const f = d.deltaMode === 1 ? 20 : 1;
    let p = o === Et.Vertical ? 0 : d.deltaX * f, g = o === Et.Horizontal ? 0 : d.deltaY * f;
    !$n() && d.shiftKey && o !== Et.Vertical && (p = d.deltaY * f, g = 0), r.translateBy(
      n,
      -(p / h) * i,
      -(g / h) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = ro(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, v) : (e.isPanScrolling = !0, a == null || a(d, v)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function cb({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = lt(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function db({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = ro(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function ub({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Mc(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, ro(i.transform)));
  };
}
function fb({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Mc(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
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
function hb({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: h }) {
  return (f) => {
    var m;
    const p = t || n, g = r && f.ctrlKey, v = f.type === "wheel";
    if (f.button === 1 && f.type === "mousedown" && (lt(f, `${d}-flow__node`) || lt(f, `${d}-flow__edge`) || lt(f, `${d}-flow__selection`) || lt(f, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !p && !i && !s && !r || a || h && !v || lt(f, l) && v || lt(f, c) && (!v || i && v && !t) || !r && f.ctrlKey && v)
      return !1;
    if (!r && f.type === "touchstart" && ((m = f.touches) == null ? void 0 : m.length) > 1)
      return f.preventDefault(), !1;
    if (!p && !i && !g && v || !o && (f.type === "mousedown" || f.type === "touchstart") || Array.isArray(o) && !o.includes(f.button) && f.type === "mousedown")
      return !1;
    const w = Array.isArray(o) && o.includes(f.button) || !f.button || f.button <= 1;
    return (!f.ctrlKey || v || e) && w;
  };
}
function pb({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
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
  const f = typeof ResizeObserver < "u" ? new ResizeObserver((P) => {
    const _ = P[0];
    _ && (h = [
      [0, 0],
      [_.contentRect.width, _.contentRect.height]
    ]);
  }) : null;
  f == null || f.observe(e);
  const p = ec().extent(() => h).scaleExtent([t, n]).translateExtent(r), g = Me(e).call(p);
  x({
    x: o.x,
    y: o.y,
    zoom: Yt(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const v = g.on("wheel.zoom"), w = g.on("dblclick.zoom");
  p.wheelDelta(Ic);
  async function m(P, _) {
    return g ? new Promise((I) => {
      p == null || p.interpolate((_ == null ? void 0 : _.interpolate) === "linear" ? vn : _r).transform(Xo(g, _ == null ? void 0 : _.duration, _ == null ? void 0 : _.ease, () => I(!0)), P);
    }) : !1;
  }
  function b({ noWheelClassName: P, noPanClassName: _, onPaneContextMenu: I, userSelectionActive: M, panOnScroll: E, panOnDrag: O, panOnScrollMode: $, panOnScrollSpeed: L, preventScrolling: D, zoomOnPinch: V, zoomOnScroll: j, zoomOnDoubleClick: G, panActivationKeyPressed: Y = !1, zoomActivationKeyPressed: ne, lib: Z, onTransformChange: R, connectionInProgress: F, paneClickDistance: q, selectionOnDrag: J }) {
    M && !c.isZoomingOrPanning && y();
    const K = E && !ne && !M;
    p.clickDistance(J ? 1 / 0 : !We(q) || q < 0 ? 0 : q);
    const ee = K ? lb({
      zoomPanValues: c,
      noWheelClassName: P,
      d3Selection: g,
      d3Zoom: p,
      panOnScrollMode: $,
      panOnScrollSpeed: L,
      zoomOnPinch: V,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : cb({
      noWheelClassName: P,
      preventScrolling: D,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", ee, { passive: !1 });
    const te = db({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    p.on("start", te);
    const re = ub({
      zoomPanValues: c,
      panOnDrag: O,
      onPaneContextMenu: !!I,
      onPanZoom: i,
      onTransformChange: R
    });
    p.on("zoom", re);
    const ie = fb({
      zoomPanValues: c,
      panOnDrag: O,
      panOnScroll: E,
      onPaneContextMenu: I,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    p.on("end", ie);
    const ce = hb({
      panActivationKeyPressed: Y,
      zoomActivationKeyPressed: ne,
      panOnDrag: O,
      zoomOnScroll: j,
      panOnScroll: E,
      zoomOnDoubleClick: G,
      zoomOnPinch: V,
      userSelectionActive: M,
      noPanClassName: _,
      noWheelClassName: P,
      lib: Z,
      connectionInProgress: F
    });
    p.filter(ce), G ? g.on("dblclick.zoom", w) : g.on("dblclick.zoom", null);
  }
  function y() {
    p.on("zoom", null);
  }
  async function x(P, _, I) {
    const M = Go(P), E = p == null ? void 0 : p.constrain()(M, _, I);
    return E && await m(E), E;
  }
  async function N(P, _) {
    const I = Go(P);
    return await m(I, _), I;
  }
  function S(P) {
    if (g) {
      const _ = Go(P), I = g.property("__zoom");
      (I.k !== P.zoom || I.x !== P.x || I.y !== P.y) && (p == null || p.transform(g, _, null, { sync: !0 }));
    }
  }
  function C() {
    const P = g ? Jl(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: P.x, y: P.y, zoom: P.k };
  }
  async function T(P, _) {
    return g ? new Promise((I) => {
      p == null || p.interpolate((_ == null ? void 0 : _.interpolate) === "linear" ? vn : _r).scaleTo(Xo(g, _ == null ? void 0 : _.duration, _ == null ? void 0 : _.ease, () => I(!0)), P);
    }) : !1;
  }
  async function A(P, _) {
    return g ? new Promise((I) => {
      p == null || p.interpolate((_ == null ? void 0 : _.interpolate) === "linear" ? vn : _r).scaleBy(Xo(g, _ == null ? void 0 : _.duration, _ == null ? void 0 : _.ease, () => I(!0)), P);
    }) : !1;
  }
  function B(P) {
    p == null || p.scaleExtent(P);
  }
  function z(P) {
    p == null || p.translateExtent(P);
  }
  function W(P) {
    const _ = !We(P) || P < 0 ? 0 : P;
    p == null || p.clickDistance(_);
  }
  return {
    update: b,
    destroy: y,
    setViewport: N,
    setViewportConstrained: x,
    getViewport: C,
    scaleTo: T,
    scaleBy: A,
    setScaleExtent: B,
    setTranslateExtent: z,
    syncViewport: S,
    setClickDistance: W
  };
}
var Xt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Xt || (Xt = {}));
function gb({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function oa(e) {
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
function gr(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function ia(e, t) {
  return e ? !t : t;
}
function mb(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: h } = t, f = d && h, { xSnapped: p, ySnapped: g } = n, { minWidth: v, maxWidth: w, minHeight: m, maxHeight: b } = r, { x: y, y: x, width: N, height: S, aspectRatio: C } = e;
  let T = Math.floor(d ? p - e.pointerX : 0), A = Math.floor(h ? g - e.pointerY : 0);
  const B = N + (l ? -T : T), z = S + (c ? -A : A), W = -i[0] * N, P = -i[1] * S;
  let _ = gr(B, v, w), I = gr(z, m, b);
  if (s) {
    let O = 0, $ = 0;
    l && T < 0 ? O = st(y + T + W, s[0][0]) : !l && T > 0 && (O = at(y + B + W, s[1][0])), c && A < 0 ? $ = st(x + A + P, s[0][1]) : !c && A > 0 && ($ = at(x + z + P, s[1][1])), _ = Math.max(_, O), I = Math.max(I, $);
  }
  if (a) {
    let O = 0, $ = 0;
    l && T > 0 ? O = at(y + T, a[0][0]) : !l && T < 0 && (O = st(y + B, a[1][0])), c && A > 0 ? $ = at(x + A, a[0][1]) : !c && A < 0 && ($ = st(x + z, a[1][1])), _ = Math.max(_, O), I = Math.max(I, $);
  }
  if (o) {
    if (d) {
      const O = gr(B / C, m, b) * C;
      if (_ = Math.max(_, O), s) {
        let $ = 0;
        !l && !c || l && !c && f ? $ = at(x + P + B / C, s[1][1]) * C : $ = st(x + P + (l ? T : -T) / C, s[0][1]) * C, _ = Math.max(_, $);
      }
      if (a) {
        let $ = 0;
        !l && !c || l && !c && f ? $ = st(x + B / C, a[1][1]) * C : $ = at(x + (l ? T : -T) / C, a[0][1]) * C, _ = Math.max(_, $);
      }
    }
    if (h) {
      const O = gr(z * C, v, w) / C;
      if (I = Math.max(I, O), s) {
        let $ = 0;
        !l && !c || c && !l && f ? $ = at(y + z * C + W, s[1][0]) / C : $ = st(y + (c ? A : -A) * C + W, s[0][0]) / C, I = Math.max(I, $);
      }
      if (a) {
        let $ = 0;
        !l && !c || c && !l && f ? $ = st(y + z * C, a[1][0]) / C : $ = at(y + (c ? A : -A) * C, a[0][0]) / C, I = Math.max(I, $);
      }
    }
  }
  A = A + (A < 0 ? I : -I), T = T + (T < 0 ? _ : -_), o && (f ? B > z * C ? A = (ia(l, c) ? -T : T) / C : T = (ia(l, c) ? -A : A) * C : d ? (A = T / C, c = l) : (T = A * C, l = c));
  const M = l ? y + T : y, E = c ? x + A : x;
  return {
    width: N + (l ? -T : T),
    height: S + (c ? -A : A),
    x: i[0] * T * (l ? -1 : 1) + M,
    y: i[1] * A * (c ? -1 : 1) + E
  };
}
const $c = { width: 0, height: 0, x: 0, y: 0 }, yb = {
  ...$c,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function wb(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function bb({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Me(e);
  let s = {
    controlDirection: oa("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: h, resizeDirection: f, onResizeStart: p, onResize: g, onResizeEnd: v, shouldResize: w }) {
    let m = { ...$c }, b = { ...yb };
    s = {
      boundaries: d,
      resizeDirection: f,
      keepAspectRatio: h,
      controlDirection: oa(c)
    };
    let y, x = null, N = [], S, C, T;
    const A = Hl().on("start", (B) => {
      const { nodeLookup: z, transform: W, snapGrid: P, snapToGrid: _, nodeOrigin: I, paneDomNode: M } = n();
      if (y = z.get(t), !y)
        return;
      x = (M == null ? void 0 : M.getBoundingClientRect()) ?? null;
      const { xSnapped: E, ySnapped: O } = xn(B.sourceEvent, {
        transform: W,
        snapGrid: P,
        snapToGrid: _,
        containerBounds: x
      });
      m = {
        width: y.measured.width ?? 0,
        height: y.measured.height ?? 0,
        x: y.position.x ?? 0,
        y: y.position.y ?? 0
      }, b = {
        ...m,
        pointerX: E,
        pointerY: O,
        aspectRatio: m.width / m.height
      }, S = void 0, C = Mt(y.extent) ? y.extent : void 0, y.parentId && (y.extent === "parent" || y.expandParent) && (S = z.get(y.parentId)), S && y.extent === "parent" && (C = [
        [0, 0],
        [S.measured.width, S.measured.height]
      ]), N = [], T = void 0;
      for (const [$, L] of z)
        if (L.parentId === t && (N.push({
          id: $,
          position: { ...L.position },
          extent: L.extent
        }), L.extent === "parent" || L.expandParent)) {
          const D = wb(L, y, L.origin ?? I);
          T ? T = [
            [Math.min(D[0][0], T[0][0]), Math.min(D[0][1], T[0][1])],
            [Math.max(D[1][0], T[1][0]), Math.max(D[1][1], T[1][1])]
          ] : T = D;
        }
      p == null || p(B, { ...m });
    }).on("drag", (B) => {
      const { transform: z, snapGrid: W, snapToGrid: P, nodeOrigin: _ } = n(), I = xn(B.sourceEvent, {
        transform: z,
        snapGrid: W,
        snapToGrid: P,
        containerBounds: x
      }), M = [];
      if (!y)
        return;
      const { x: E, y: O, width: $, height: L } = m, D = {}, V = y.origin ?? _, { width: j, height: G, x: Y, y: ne } = mb(b, s.controlDirection, I, s.boundaries, s.keepAspectRatio, V, C, T), Z = j !== $, R = G !== L, F = Y !== E && Z, q = ne !== O && R;
      if (!F && !q && !Z && !R)
        return;
      const J = {
        prevValues: { ...m },
        startX: b.x,
        startY: b.y,
        childNodes: N.map((re) => ({
          ...re,
          position: { ...re.position }
        }))
      };
      if ((F || q || V[0] === 1 || V[1] === 1) && (D.x = F ? Y : m.x, D.y = q ? ne : m.y, m.x = D.x, m.y = D.y, N.length > 0)) {
        const re = Y - E, ie = ne - O;
        for (const ce of N)
          ce.position = {
            x: ce.position.x - re + V[0] * (j - $),
            y: ce.position.y - ie + V[1] * (G - L)
          }, M.push(ce);
      }
      if ((Z || R) && (D.width = Z && (!s.resizeDirection || s.resizeDirection === "horizontal") ? j : m.width, D.height = R && (!s.resizeDirection || s.resizeDirection === "vertical") ? G : m.height, m.width = D.width, m.height = D.height), S && y.expandParent) {
        const re = V[0] * (D.width ?? 0);
        D.x && D.x < re && (m.x = re, b.x = b.x - (D.x - re));
        const ie = V[1] * (D.height ?? 0);
        D.y && D.y < ie && (m.y = ie, b.y = b.y - (D.y - ie));
      }
      const K = gb({
        width: m.width,
        prevWidth: $,
        height: m.height,
        prevHeight: L,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), ee = { ...m, direction: K };
      if ((w == null ? void 0 : w(B, ee)) === !1) {
        m = J.prevValues, b.x = J.startX, b.y = J.startY, N.forEach((re, ie) => {
          re.position = J.childNodes[ie].position;
        });
        return;
      }
      g == null || g(B, ee), r(D, M);
    }).on("end", (B) => {
      v == null || v(B, { ...m }), o == null || o({ ...m });
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
var Ac = { exports: {} }, Tc = {}, Lc = { exports: {} }, zc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ut = Ci;
function vb(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var xb = typeof Object.is == "function" ? Object.is : vb, _b = Ut.useState, kb = Ut.useEffect, Eb = Ut.useLayoutEffect, Sb = Ut.useDebugValue;
function Nb(e, t) {
  var n = t(), r = _b({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Eb(
    function() {
      o.value = n, o.getSnapshot = t, Uo(o) && i({ inst: o });
    },
    [e, n, t]
  ), kb(
    function() {
      return Uo(o) && i({ inst: o }), e(function() {
        Uo(o) && i({ inst: o });
      });
    },
    [e]
  ), Sb(n), n;
}
function Uo(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !xb(e, n);
  } catch {
    return !0;
  }
}
function Cb(e, t) {
  return t();
}
var Mb = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Cb : Nb;
zc.useSyncExternalStore = Ut.useSyncExternalStore !== void 0 ? Ut.useSyncExternalStore : Mb;
Lc.exports = zc;
var Ib = Lc.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oo = Ci, $b = Ib;
function Ab(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Tb = typeof Object.is == "function" ? Object.is : Ab, Lb = $b.useSyncExternalStore, zb = oo.useRef, Ob = oo.useEffect, Pb = oo.useMemo, Db = oo.useDebugValue;
Tc.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = zb(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = Pb(
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
        if (g = h, Tb(d, p)) return g;
        var v = r(p);
        return o !== void 0 && o(g, v) ? (d = p, g) : (d = p, h = v);
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
  var a = Lb(e, i[0], i[1]);
  return Ob(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), Db(a), a;
};
Ac.exports = Tc;
var Rb = Ac.exports;
const Hb = /* @__PURE__ */ Qa(Rb), Wb = {}, sa = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, h) => {
    const f = typeof d == "function" ? d(t) : d;
    if (!Object.is(f, t)) {
      const p = t;
      t = h ?? (typeof f != "object" || f === null) ? f : Object.assign({}, t, f), n.forEach((g) => g(t, p));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (Wb ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, Bb = (e) => e ? sa(e) : sa, { useDebugValue: Vb } = Ci, { useSyncExternalStoreWithSelector: Fb } = Hb, jb = (e) => e;
function Oc(e, t = jb, n) {
  const r = Fb(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Vb(r), r;
}
const aa = (e, t) => {
  const n = Bb(e), r = (o, i = t) => Oc(n, o, i);
  return Object.assign(r, n), r;
}, Yb = (e, t) => e ? aa(e, t) : aa;
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
const io = Yr(null), Gb = io.Provider, Pc = Ve.error001("react");
function se(e, t) {
  const n = qt(io);
  if (n === null)
    throw new Error(Pc);
  return Oc(n, e, t);
}
function fe() {
  const e = qt(io);
  if (e === null)
    throw new Error(Pc);
  return le(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const la = { display: "none" }, Xb = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Dc = "react-flow__node-desc", Rc = "react-flow__edge-desc", Ub = "react-flow__aria-live", qb = (e) => e.ariaLiveMessage, Kb = (e) => e.ariaLabelConfig;
function Zb({ rfId: e }) {
  const t = se(qb);
  return u("div", { id: `${Ub}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Xb, children: t });
}
function Qb({ rfId: e, disableKeyboardA11y: t }) {
  const n = se(Kb);
  return k(me, { children: [u("div", { id: `${Dc}-${e}`, style: la, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), u("div", { id: `${Rc}-${e}`, style: la, children: n["edge.a11yDescription.default"] }), !t && u(Zb, { rfId: e })] });
}
const $t = ja(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return u("div", { className: be(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
$t.displayName = "Panel";
const ca = "https://reactflow.dev?utm_source=attribution";
function Jb({ proOptions: e, position: t = "bottom-right" }) {
  return de(() => {
  }, []), e != null && e.hideAttribution ? null : u($t, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${ca}`, children: u("a", { href: ca, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const ev = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, mr = (e) => e.id;
function tv(e, t) {
  return pe(e.selectedNodes.map(mr), t.selectedNodes.map(mr)) && pe(e.selectedEdges.map(mr), t.selectedEdges.map(mr));
}
function nv({ onSelectionChange: e }) {
  const t = fe(), { selectedNodes: n, selectedEdges: r } = se(ev, tv);
  return de(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const rv = (e) => !!e.onSelectionChangeHandlers;
function ov({ onSelectionChange: e }) {
  const t = se(rv);
  return e || t ? u(nv, { onSelectionChange: e }) : null;
}
const Hc = [0, 0], iv = { x: 0, y: 0, zoom: 1 }, sv = [
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
], da = [...sv, "rfId"], av = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), ua = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Cn,
  nodeOrigin: Hc,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function lv(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = se(av, pe), c = fe();
  de(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = ua, a();
  }), []);
  const d = oe(ua);
  return de(
    () => {
      for (const h of da) {
        const f = e[h], p = d.current[h];
        f !== p && (typeof e[h] > "u" || (h === "nodes" ? t(f) : h === "edges" ? n(f) : h === "minZoom" ? r(f) : h === "maxZoom" ? o(f) : h === "translateExtent" ? i(f) : h === "nodeExtent" ? s(f) : h === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: Tw(f) }) : h === "fitView" ? c.setState({ fitViewQueued: f }) : h === "fitViewOptions" ? c.setState({ fitViewOptions: f }) : c.setState({ [h]: f })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    da.map((h) => e[h])
  ), null;
}
function fa() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function cv(e) {
  var r;
  const [t, n] = Q(e === "system" ? null : e);
  return de(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = fa(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = fa()) != null && r.matches ? "dark" : "light";
}
const ha = typeof document < "u" ? document : null;
function An(e = null, t = { target: ha, actInsideInputWithModifier: !0 }) {
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
    const l = (t == null ? void 0 : t.target) ?? ha, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (p) => {
        var w, m;
        if (o.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!o.current || o.current && !c) && pc(p))
          return !1;
        const v = ga(p.code, a);
        if (i.current.add(p[v]), pa(s, i.current, !1)) {
          const b = ((m = (w = p.composedPath) == null ? void 0 : w.call(p)) == null ? void 0 : m[0]) || p.target, y = (b == null ? void 0 : b.nodeName) === "BUTTON" || (b == null ? void 0 : b.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !y) && p.preventDefault(), r(!0);
        }
      }, h = (p) => {
        const g = ga(p.code, a);
        pa(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(p[g]), p.key === "Meta" && i.current.clear(), o.current = !1;
      }, f = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", h), window.addEventListener("blur", f), window.addEventListener("contextmenu", f), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", h), window.removeEventListener("blur", f), window.removeEventListener("contextmenu", f);
      };
    }
  }, [e, r]), n;
}
function pa(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function ga(e, t) {
  return t.includes(e) ? "code" : "key";
}
const dv = () => {
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
      return Hn(c, r, h, d);
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
function Wc(e, t) {
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
      uv(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function uv(e, t) {
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
function fv(e, t) {
  return Wc(e, t);
}
function hv(e, t) {
  return Wc(e, t);
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
function ma({ items: e = [], lookup: t }) {
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
function ya(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const pv = cc();
function gv(e, t, n = {}) {
  return Rw(e, t, {
    ...n,
    onError: n.onError ?? pv
  });
}
const wa = (e) => kw(e), mv = (e) => oc(e);
function Bc(e) {
  return ja(e);
}
const Vc = typeof window < "u" ? Mi : de;
function ba(e) {
  const [t, n] = Q(BigInt(0)), [r] = Q(() => yv(() => n((o) => o + BigInt(1))));
  return Vc(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function yv(e) {
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
const Fc = Yr(null);
function wv({ children: e }) {
  const t = fe(), n = $e((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: h, nodeLookup: f, fitViewQueued: p, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = l;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let w = ma({
      items: v,
      lookup: f
    });
    for (const m of g.values())
      w = m(w);
    d && c(v), w.length > 0 ? h == null || h(w) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: b, setNodes: y } = t.getState();
      m && y(b);
    });
  }, []), r = ba(n), o = $e((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: h, edgeLookup: f } = t.getState();
    let p = l;
    for (const g of a)
      p = typeof g == "function" ? g(p) : g;
    d ? c(p) : h && h(ma({
      items: p,
      lookup: f
    }));
  }, []), i = ba(o), s = le(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return u(Fc.Provider, { value: s, children: e });
}
function bv() {
  const e = qt(Fc);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const vv = (e) => !!e.panZoom;
function so() {
  const e = dv(), t = fe(), n = bv(), r = se(vv), o = le(() => {
    const i = (h) => t.getState().nodeLookup.get(h), s = (h) => {
      n.nodeQueue.push(h);
    }, a = (h) => {
      n.edgeQueue.push(h);
    }, l = (h) => {
      var m, b;
      const { nodeLookup: f, nodeOrigin: p } = t.getState(), g = wa(h) ? h : f.get(h.id), v = g.parentId ? uc(g.position, g.measured, g.parentId, f, p) : g.position, w = {
        ...g,
        position: v,
        width: ((m = g.measured) == null ? void 0 : m.width) ?? g.width,
        height: ((b = g.measured) == null ? void 0 : b.height) ?? g.height
      };
      return In(w);
    }, c = (h, f, p = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === h) {
          const w = typeof f == "function" ? f(v) : f;
          return p.replace && wa(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    }, d = (h, f, p = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === h) {
          const w = typeof f == "function" ? f(v) : f;
          return p.replace && mv(w) ? w : { ...v, ...w };
        }
        return v;
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
        const { nodes: h = [], edges: f = [], transform: p } = t.getState(), [g, v, w] = p;
        return {
          nodes: h.map((m) => ({ ...m })),
          edges: f.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: v,
            zoom: w
          }
        };
      },
      deleteElements: async ({ nodes: h = [], edges: f = [] }) => {
        const { nodes: p, edges: g, onNodesDelete: v, onEdgesDelete: w, triggerNodeChanges: m, triggerEdgeChanges: b, onDelete: y, onBeforeDelete: x } = t.getState(), { nodes: N, edges: S } = await Mw({
          nodesToRemove: h,
          edgesToRemove: f,
          nodes: p,
          edges: g,
          onBeforeDelete: x
        }), C = S.length > 0, T = N.length > 0;
        if (C) {
          const A = S.map(ya);
          w == null || w(S), b(A);
        }
        if (T) {
          const A = N.map(ya);
          v == null || v(N), m(A);
        }
        return (T || C) && (y == null || y({ nodes: N, edges: S })), { deletedNodes: N, deletedEdges: S };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (h, f = !0, p) => {
        const g = Xs(h), v = g ? h : l(h), w = p !== void 0;
        return v ? (p || t.getState().nodes).filter((m) => {
          const b = t.getState().nodeLookup.get(m.id);
          if (b && !g && (m.id === h.id || !b.internals.positionAbsolute))
            return !1;
          const y = In(w ? m : b), x = Wr(y, v);
          return f && x > 0 || x >= y.width * y.height || x >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (h, f, p = !0) => {
        const v = Xs(h) ? h : l(h);
        if (!v)
          return !1;
        const w = Wr(v, f);
        return p && w > 0 || w >= f.width * f.height || w >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (h, f, p = { replace: !1 }) => {
        c(h, (g) => {
          const v = typeof f == "function" ? f(g) : f;
          return p.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, p);
      },
      updateEdge: d,
      updateEdgeData: (h, f, p = { replace: !1 }) => {
        d(h, (g) => {
          const v = typeof f == "function" ? f(g) : f;
          return p.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, p);
      },
      getNodesBounds: (h) => {
        const { nodeLookup: f, nodeOrigin: p } = t.getState();
        return Ew(h, { nodeLookup: f, nodeOrigin: p });
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
        const f = t.getState().fitViewResolver ?? Aw();
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
const va = (e) => e.selected, xv = typeof window < "u" ? window : void 0;
function _v({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = fe(), { deleteElements: r } = so(), o = An(e, { actInsideInputWithModifier: !1 }), i = An(t, { target: xv });
  de(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(va), edges: s.filter(va) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), de(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function kv(e) {
  const t = fe();
  de(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = Yi(e.current);
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
}, Ev = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Sv({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = Et.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: h, maxZoom: f, zoomActivationKeyCode: p, preventScrolling: g = !0, children: v, noWheelClassName: w, noPanClassName: m, onViewportChange: b, isControlledViewport: y, paneClickDistance: x, selectionOnDrag: N }) {
  const S = fe(), C = oe(null), { userSelectionActive: T, lib: A, connectionInProgress: B } = se(Ev, pe), z = An(p), W = oe();
  kv(C);
  const P = $e((_) => {
    b == null || b({ x: _[0], y: _[1], zoom: _[2] }), y || S.setState({ transform: _ });
  }, [b, y]);
  return de(() => {
    if (C.current) {
      W.current = pb({
        domNode: C.current,
        minZoom: h,
        maxZoom: f,
        translateExtent: d,
        viewport: c,
        onDraggingChange: (E) => S.setState((O) => O.paneDragging === E ? O : { paneDragging: E }),
        onPanZoomStart: (E, O) => {
          const { onViewportChangeStart: $, onMoveStart: L } = S.getState();
          L == null || L(E, O), $ == null || $(O);
        },
        onPanZoom: (E, O) => {
          const { onViewportChange: $, onMove: L } = S.getState();
          L == null || L(E, O), $ == null || $(O);
        },
        onPanZoomEnd: (E, O) => {
          const { onViewportChangeEnd: $, onMoveEnd: L } = S.getState();
          L == null || L(E, O), $ == null || $(O);
        }
      });
      const { x: _, y: I, zoom: M } = W.current.getViewport();
      return S.setState({
        panZoom: W.current,
        transform: [_, I, M],
        domNode: C.current.closest(".react-flow")
      }), () => {
        var E;
        (E = W.current) == null || E.destroy();
      };
    }
  }, []), de(() => {
    var _;
    (_ = W.current) == null || _.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: r,
      panActivationKeyPressed: o,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: l,
      zoomActivationKeyPressed: z,
      preventScrolling: g,
      noPanClassName: m,
      userSelectionActive: T,
      noWheelClassName: w,
      lib: A,
      onTransformChange: P,
      connectionInProgress: B,
      selectionOnDrag: N,
      paneClickDistance: x
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
    z,
    g,
    m,
    T,
    w,
    A,
    P,
    B,
    N,
    x
  ]), u("div", { className: "react-flow__renderer", ref: C, style: ao, children: v });
}
const Nv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Cv() {
  const { userSelectionActive: e, userSelectionRect: t } = se(Nv, pe);
  return e && t ? u("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const qo = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Mv = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Iv({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Mn.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: h, onPaneMouseEnter: f, onPaneMouseMove: p, onPaneMouseLeave: g, children: v }) {
  const w = oe(0), m = fe(), { userSelectionActive: b, elementsSelectable: y, dragging: x, panBy: N, autoPanSpeed: S } = se(Mv, pe), C = y && (e || b), T = oe(null), A = oe(), B = oe(/* @__PURE__ */ new Set()), z = oe(/* @__PURE__ */ new Set()), W = oe(!1), P = oe(!1), _ = oe({ x: 0, y: 0 }), I = oe(!1), M = (R) => {
    if (P.current || W.current || m.getState().connection.inProgress) {
      P.current = !1, W.current = !1;
      return;
    }
    c == null || c(R), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, E = (R) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      R.preventDefault();
      return;
    }
    d == null || d(R);
  }, O = h ? (R) => h(R) : void 0, $ = (R) => {
    P.current && (R.stopPropagation(), P.current = !1);
  }, L = (R) => {
    var ce, ke;
    if (R.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: F, transform: q } = m.getState();
    if (A.current = F == null ? void 0 : F.getBoundingClientRect(), !A.current)
      return;
    const J = R.target === T.current;
    if (!J && !!R.target.closest(".nokey") || !e || !(s && J || t) || R.button !== 0 || !R.isPrimary)
      return;
    (ke = (ce = R.target) == null ? void 0 : ce.setPointerCapture) == null || ke.call(ce, R.pointerId), P.current = !1;
    const { x: te, y: re } = Be(R.nativeEvent, A.current), ie = Hn({ x: te, y: re }, q);
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
    const { transform: J, nodeLookup: K, edgeLookup: ee, connectionLookup: te, triggerNodeChanges: re, triggerEdgeChanges: ie, defaultEdgeOptions: ce } = m.getState(), ke = { x: q.startX, y: q.startY }, { x: Ee, y: Te } = Gt(ke, J), Le = {
      startX: ke.x,
      startY: ke.y,
      x: R < Ee ? R : Ee,
      y: F < Te ? F : Te,
      width: Math.abs(R - Ee),
      height: Math.abs(F - Te)
    }, ht = B.current, Ge = z.current;
    B.current = new Set(Fi(K, Le, J, n === Mn.Partial, !0).map((Se) => Se.id)), z.current = /* @__PURE__ */ new Set();
    const Qe = (ce == null ? void 0 : ce.selectable) ?? !0;
    for (const Se of B.current) {
      const ze = te.get(Se);
      if (ze)
        for (const { edgeId: _e } of ze.values()) {
          const Xe = ee.get(_e);
          Xe && (Xe.selectable ?? Qe) && z.current.add(_e);
        }
    }
    if (!Us(ht, B.current)) {
      const Se = Rt(K, B.current, !0);
      re(Se);
    }
    if (!Us(Ge, z.current)) {
      const Se = Rt(ee, z.current);
      ie(Se);
    }
    m.setState({
      userSelectionRect: Le,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function V() {
    if (!o || !A.current)
      return;
    const [R, F] = ji(_.current, A.current, S);
    N({ x: R, y: F }).then((q) => {
      if (!P.current || !q) {
        w.current = requestAnimationFrame(V);
        return;
      }
      const { x: J, y: K } = _.current;
      D(J, K), w.current = requestAnimationFrame(V);
    });
  }
  const j = () => {
    cancelAnimationFrame(w.current), w.current = 0, I.current = !1;
  };
  de(() => () => j(), []);
  const G = (R) => {
    const { userSelectionRect: F, transform: q, resetSelectedElements: J } = m.getState();
    if (!A.current || !F)
      return;
    const { x: K, y: ee } = Be(R.nativeEvent, A.current);
    _.current = { x: K, y: ee };
    const te = Gt({ x: F.startX, y: F.startY }, q);
    if (!P.current) {
      const re = t ? 0 : i;
      if (Math.hypot(K - te.x, ee - te.y) <= re)
        return;
      J(), a == null || a(R);
    }
    P.current = !0, I.current || (V(), I.current = !0), D(K, ee);
  }, Y = (R) => {
    var F, q;
    if (!C) {
      R.target === T.current && m.getState().connection.inProgress && (W.current = !0);
      return;
    }
    R.button === 0 && ((q = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || q.call(F, R.pointerId), !b && R.target === T.current && m.getState().userSelectionRect && (M == null || M(R)), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), P.current && (l == null || l(R), m.setState({
      nodesSelectionActive: B.current.size > 0
    })), j());
  }, ne = (R) => {
    var F, q;
    (q = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || q.call(F, R.pointerId), j();
  }, Z = r === !0 || Array.isArray(r) && r.includes(0);
  return k("div", { className: be(["react-flow__pane", { draggable: Z, dragging: x, selection: e }]), onClick: C ? void 0 : qo(M, T), onContextMenu: qo(E, T), onWheel: qo(O, T), onPointerEnter: C ? void 0 : f, onPointerMove: C ? G : p, onPointerUp: Y, onPointerCancel: C ? ne : void 0, onPointerDownCapture: C ? L : void 0, onClickCapture: C ? $ : void 0, onPointerLeave: g, ref: T, style: ao, children: [v, u(Cv, {})] });
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
function jc({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = fe(), [l, c] = Q(!1), d = oe();
  return de(() => {
    if (!t)
      return d.current = eb({
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
const $v = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function Yc() {
  const e = fe();
  return $e((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), h = /* @__PURE__ */ new Map(), f = $v(s), p = o ? i[0] : 5, g = o ? i[1] : 5, v = n.direction.x * p * n.factor, w = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!f(m))
        continue;
      let b = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + w
      };
      o && (b = Rn(b, i));
      const { position: y, positionAbsolute: x } = ic({
        nodeId: m.id,
        nextPosition: b,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: d,
        onError: a
      });
      m.position = y, m.internals.positionAbsolute = x, h.set(m.id, m);
    }
    l(h);
  }, []);
}
const Zi = Yr(null), Av = Zi.Provider;
Zi.Consumer;
const Gc = () => qt(Zi), Tv = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), Xc = Yr(null);
function Lv({ children: e }) {
  const t = se(Tv, pe);
  return u(Xc.Provider, { value: t, children: e });
}
function zv() {
  const e = qt(Xc);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Ov = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, Pv = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Ov;
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
function Dv({ type: e = "source", position: t = U.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: h, ...f }, p) {
  var I, M;
  const g = s || null, v = e === "target", w = fe(), m = Gc(), { connectOnClick: b, noPanClassName: y, rfId: x } = zv(), { connectingFrom: N, connectingTo: S, clickConnecting: C, isPossibleEndHandle: T, connectionInProcess: A, clickConnectionInProcess: B, valid: z } = se(Pv(m, g, e), pe);
  m || (M = (I = w.getState()).onError) == null || M.call(I, "010", Ve.error010());
  const W = (E) => {
    const { defaultEdgeOptions: O, onConnect: $, hasDefaultEdges: L } = w.getState(), D = {
      ...O,
      ...E
    };
    if (L) {
      const { edges: V, setEdges: j, onError: G } = w.getState();
      j(gv(D, V, { onError: G }));
    }
    $ == null || $(D), a == null || a(D);
  }, P = (E) => {
    if (!m)
      return;
    const O = gc(E.nativeEvent);
    if (o && (O && E.button === 0 || !O)) {
      const $ = w.getState();
      mi.onPointerDown(E.nativeEvent, {
        handleDomNode: E.currentTarget,
        autoPanOnConnect: $.autoPanOnConnect,
        connectionMode: $.connectionMode,
        connectionRadius: $.connectionRadius,
        domNode: $.domNode,
        nodeLookup: $.nodeLookup,
        lib: $.lib,
        isTarget: v,
        handleId: g,
        nodeId: m,
        flowId: $.rfId,
        panBy: $.panBy,
        cancelConnection: $.cancelConnection,
        onConnectStart: $.onConnectStart,
        onConnectEnd: (...L) => {
          var D, V;
          return (V = (D = w.getState()).onConnectEnd) == null ? void 0 : V.call(D, ...L);
        },
        updateConnection: $.updateConnection,
        onConnect: W,
        isValidConnection: n || ((...L) => {
          var D, V;
          return ((V = (D = w.getState()).isValidConnection) == null ? void 0 : V.call(D, ...L)) ?? !0;
        }),
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: $.autoPanSpeed,
        dragThreshold: $.connectionDragThreshold
      });
    }
    O ? d == null || d(E) : h == null || h(E);
  }, _ = (E) => {
    const { onClickConnectStart: O, onClickConnectEnd: $, connectionClickStartHandle: L, connectionMode: D, isValidConnection: V, lib: j, rfId: G, nodeLookup: Y, connection: ne } = w.getState();
    if (!m || !L && !o)
      return;
    if (!L) {
      O == null || O(E.nativeEvent, { nodeId: m, handleId: g, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const Z = hc(E.target), R = n || V, { connection: F, isValid: q } = mi.isValid(E.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: D,
      fromNodeId: L.nodeId,
      fromHandleId: L.id || null,
      fromType: L.type,
      isValidConnection: R,
      flowId: G,
      doc: Z,
      lib: j,
      nodeLookup: Y
    });
    q && F && W(F);
    const J = structuredClone(ne);
    delete J.inProgress, J.toPosition = J.toHandle ? J.toHandle.position : null, $ == null || $(E, J), w.setState({ connectionClickStartHandle: null });
  };
  return u("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${x}-${m}-${g}-${e}`, className: be([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    y,
    c,
    {
      source: !v,
      target: v,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: C,
      connectingfrom: N,
      connectingto: S,
      valid: z,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!A || T) && (A || B ? i : o)
    }
  ]), onMouseDown: P, onTouchStart: P, onClick: b ? _ : void 0, ref: p, ...f, children: l });
}
const ft = he(Bc(Dv));
function Rv({ data: e, isConnectable: t, sourcePosition: n = U.Bottom }) {
  return k(me, { children: [e == null ? void 0 : e.label, u(ft, { type: "source", position: n, isConnectable: t })] });
}
function Hv({ data: e, isConnectable: t, targetPosition: n = U.Top, sourcePosition: r = U.Bottom }) {
  return k(me, { children: [u(ft, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, u(ft, { type: "source", position: r, isConnectable: t })] });
}
function Wv() {
  return null;
}
function Bv({ data: e, isConnectable: t, targetPosition: n = U.Top }) {
  return k(me, { children: [u(ft, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Br = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, xa = {
  input: Rv,
  default: Hv,
  output: Bv,
  group: Wv
};
function Vv(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const Fv = (e) => {
  const { width: t, height: n, x: r, y: o } = Dn(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: We(t) ? t : null,
    height: We(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function jv({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = fe(), { width: o, height: i, transformString: s, userSelectionActive: a } = se(Fv, pe), l = Yc(), c = oe(null);
  de(() => {
    var p;
    n || (p = c.current) == null || p.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (jc({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const h = e ? (p) => {
    const g = r.getState().nodes.filter((v) => v.selected);
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
const _a = typeof window < "u" ? window : void 0, Yv = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Uc({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: h, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: w, elementsSelectable: m, zoomOnScroll: b, zoomOnPinch: y, panOnScroll: x, panOnScrollSpeed: N, panOnScrollMode: S, zoomOnDoubleClick: C, panOnDrag: T, autoPanOnSelection: A, defaultViewport: B, translateExtent: z, minZoom: W, maxZoom: P, preventScrolling: _, onSelectionContextMenu: I, noWheelClassName: M, noPanClassName: E, disableKeyboardA11y: O, onViewportChange: $, isControlledViewport: L }) {
  const { nodesSelectionActive: D, userSelectionActive: V } = se(Yv, pe), j = An(c, { target: _a }), G = An(v, { target: _a }), Y = G || T, ne = G || x, Z = d && Y !== !0, R = j || V || Z;
  return _v({ deleteKeyCode: l, multiSelectionKeyCode: g }), u(Sv, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: b, zoomOnPinch: y, panOnScroll: ne, panActivationKeyPressed: G, panOnScrollSpeed: N, panOnScrollMode: S, zoomOnDoubleClick: C, panOnDrag: !j && Y, defaultViewport: B, translateExtent: z, minZoom: W, maxZoom: P, zoomActivationKeyCode: w, preventScrolling: _, noWheelClassName: M, noPanClassName: E, onViewportChange: $, isControlledViewport: L, paneClickDistance: a, selectionOnDrag: Z, children: k(Iv, { onSelectionStart: f, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: Y, autoPanOnSelection: A, isSelecting: !!R, selectionMode: h, selectionKeyPressed: j, paneClickDistance: a, selectionOnDrag: Z, children: [e, D && u(jv, { onSelectionContextMenu: I, noPanClassName: E, disableKeyboardA11y: O })] }) });
}
Uc.displayName = "FlowRenderer";
const Gv = he(Uc), Xv = (e) => (t) => e ? Fi(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Uv(e) {
  return se($e(Xv(e), [e]), pe);
}
const qv = (e) => e.updateNodeInternals;
function Kv() {
  const e = se(qv), [t] = Q(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
function Zv({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
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
function Qv({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: h, noDragClassName: f, noPanClassName: p, disableKeyboardA11y: g, rfId: v, nodeTypes: w, nodeClickDistance: m, onError: b }) {
  const { node: y, internals: x, isParent: N } = se((R) => {
    const F = R.nodeLookup.get(e), q = R.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: q
    };
  }, pe);
  let S = y.type || "default", C = (w == null ? void 0 : w[S]) || xa[S];
  C === void 0 && (b == null || b("003", Ve.error003(S)), S = "default", C = (w == null ? void 0 : w.default) || xa.default);
  const T = !!(y.draggable || a && typeof y.draggable > "u"), A = !!(y.selectable || l && typeof y.selectable > "u"), B = !!(y.connectable || c && typeof y.connectable > "u"), z = !!(y.focusable || d && typeof y.focusable > "u"), W = fe(), P = dc(y), _ = Zv({ node: y, nodeType: S, hasDimensions: P, resizeObserver: h }), I = jc({
    nodeRef: _,
    disabled: y.hidden || !T,
    noDragClassName: f,
    handleSelector: y.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), M = Yc();
  if (y.hidden)
    return null;
  const E = Ye(y), O = Vv(y), $ = A || T || t || n || r || o, L = n ? (R) => n(R, { ...x.userNode }) : void 0, D = r ? (R) => r(R, { ...x.userNode }) : void 0, V = o ? (R) => o(R, { ...x.userNode }) : void 0, j = i ? (R) => i(R, { ...x.userNode }) : void 0, G = s ? (R) => s(R, { ...x.userNode }) : void 0, Y = (R) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: q } = W.getState();
    A && (!F || !T || q > 0) && yi({
      id: e,
      store: W,
      nodeRef: _
    }), t && t(R, { ...x.userNode });
  }, ne = (R) => {
    if (!(pc(R.nativeEvent) || g)) {
      if (tc.includes(R.key) && A) {
        const F = R.key === "Escape";
        yi({
          id: e,
          store: W,
          unselect: F,
          nodeRef: _
        });
      } else if (T && y.selected && Object.prototype.hasOwnProperty.call(Br, R.key)) {
        R.preventDefault();
        const { ariaLabelConfig: F } = W.getState();
        W.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: R.key.replace("Arrow", "").toLowerCase(),
            x: ~~x.positionAbsolute.x,
            y: ~~x.positionAbsolute.y
          })
        }), M({
          direction: Br[R.key],
          factor: R.shiftKey ? 4 : 1
        });
      }
    }
  }, Z = () => {
    var te;
    if (g || !((te = _.current) != null && te.matches(":focus-visible")))
      return;
    const { transform: R, width: F, height: q, autoPanOnNodeFocus: J, setCenter: K } = W.getState();
    if (!J)
      return;
    Fi(/* @__PURE__ */ new Map([[e, y]]), { x: 0, y: 0, width: F, height: q }, R, !0).length > 0 || K(y.position.x + E.width / 2, y.position.y + E.height / 2, {
      zoom: R[2]
    });
  };
  return u("div", { className: be([
    "react-flow__node",
    `react-flow__node-${S}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [p]: T
    },
    y.className,
    {
      selected: y.selected,
      selectable: A,
      parent: N,
      draggable: T,
      dragging: I
    }
  ]), ref: _, style: {
    zIndex: x.z,
    transform: `translate(${x.positionAbsolute.x}px,${x.positionAbsolute.y}px)`,
    pointerEvents: $ ? "all" : "none",
    visibility: P ? "visible" : "hidden",
    ...y.style,
    ...O
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: L, onMouseMove: D, onMouseLeave: V, onContextMenu: j, onClick: Y, onDoubleClick: G, onKeyDown: z ? ne : void 0, tabIndex: z ? 0 : void 0, onFocus: z ? Z : void 0, role: y.ariaRole ?? (z ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Dc}-${v}`, "aria-label": y.ariaLabel, ...y.domAttributes, children: u(Av, { value: e, children: u(C, { id: e, data: y.data, type: S, positionAbsoluteX: x.positionAbsolute.x, positionAbsoluteY: x.positionAbsolute.y, selected: y.selected ?? !1, selectable: A, draggable: T, deletable: y.deletable ?? !0, isConnectable: B, sourcePosition: y.sourcePosition, targetPosition: y.targetPosition, dragging: I, dragHandle: y.dragHandle, zIndex: x.z, parentId: y.parentId, ...E }) }) });
}
var Jv = he(Qv);
const ex = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function qc(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = se(ex, pe), i = Uv(e.onlyRenderVisibleElements), s = Kv();
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
    u(Jv, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
qc.displayName = "NodeRenderer";
const tx = he(qc);
function nx(e) {
  return se($e((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && Ow({
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
const rx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return u("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, ox = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return u("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, ka = {
  [jt.Arrow]: rx,
  [jt.ArrowClosed]: ox
};
function ix(e) {
  const t = fe();
  return le(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(ka, e) ? ka[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Ve.error009(e)), null);
  }, [e]);
}
const sx = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = ix(t);
  return l ? u("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: u(l, { color: n, strokeWidth: s }) }) : null;
}, Kc = ({ defaultColor: e, rfId: t }) => {
  const n = se((i) => i.edges), r = se((i) => i.defaultEdgeOptions), o = le(() => Fw(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? u("svg", { className: "react-flow__marker", "aria-hidden": "true", children: u("defs", { children: o.map((i) => u(sx, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
Kc.displayName = "MarkerDefinitions";
var ax = he(Kc);
function Zc({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [h, f] = Q({ x: 1, y: 0, width: 0, height: 0 }), p = be(["react-flow__edge-textwrapper", c]), g = oe(null);
  return de(() => {
    if (g.current) {
      const v = g.current.getBBox();
      f({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? k("g", { transform: `translate(${e - h.width / 2} ${t - h.height / 2})`, className: p, visibility: h.width ? "visible" : "hidden", ...d, children: [o && u("rect", { width: h.width + 2 * s[0], x: -s[0], y: -s[1], height: h.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), u("text", { className: "react-flow__edge-text", y: h.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
Zc.displayName = "EdgeText";
const lx = he(Zc);
function lo({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return k(me, { children: [u("path", { ...d, d: e, fill: "none", className: be(["react-flow__edge-path", d.className]) }), c ? u("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && We(t) && We(n) ? u(lx, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Ea({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === U.Left || e === U.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function Qc({ sourceX: e, sourceY: t, sourcePosition: n = U.Bottom, targetX: r, targetY: o, targetPosition: i = U.Top }) {
  const [s, a] = Ea({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = Ea({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, h, f, p] = mc({
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
function Jc(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, interactionWidth: m }) => {
    const [b, y, x] = Qc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), N = e.isInternal ? void 0 : t;
    return u(lo, { id: N, path: b, labelX: y, labelY: x, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, interactionWidth: m });
  });
}
const cx = Jc({ isInternal: !1 }), ed = Jc({ isInternal: !0 });
cx.displayName = "SimpleBezierEdge";
ed.displayName = "SimpleBezierEdgeInternal";
function td(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, sourcePosition: p = U.Bottom, targetPosition: g = U.Top, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: b }) => {
    const [y, x, N] = hi({
      sourceX: n,
      sourceY: r,
      sourcePosition: p,
      targetX: o,
      targetY: i,
      targetPosition: g,
      borderRadius: m == null ? void 0 : m.borderRadius,
      offset: m == null ? void 0 : m.offset,
      stepPosition: m == null ? void 0 : m.stepPosition
    }), S = e.isInternal ? void 0 : t;
    return u(lo, { id: S, path: y, labelX: x, labelY: N, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, markerEnd: v, markerStart: w, interactionWidth: b });
  });
}
const nd = td({ isInternal: !1 }), rd = td({ isInternal: !0 });
nd.displayName = "SmoothStepEdge";
rd.displayName = "SmoothStepEdgeInternal";
function od(e) {
  return he(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return u(nd, { ...n, id: r, pathOptions: le(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const dx = od({ isInternal: !1 }), id = od({ isInternal: !0 });
dx.displayName = "StepEdge";
id.displayName = "StepEdgeInternal";
function sd(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, markerEnd: p, markerStart: g, interactionWidth: v }) => {
    const [w, m, b] = bc({ sourceX: n, sourceY: r, targetX: o, targetY: i }), y = e.isInternal ? void 0 : t;
    return u(lo, { id: y, path: w, labelX: m, labelY: b, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: h, style: f, markerEnd: p, markerStart: g, interactionWidth: v });
  });
}
const ux = sd({ isInternal: !1 }), ad = sd({ isInternal: !0 });
ux.displayName = "StraightEdge";
ad.displayName = "StraightEdgeInternal";
function ld(e) {
  return he(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = U.Bottom, targetPosition: a = U.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: b }) => {
    const [y, x, N] = yc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), S = e.isInternal ? void 0 : t;
    return u(lo, { id: S, path: y, labelX: x, labelY: N, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: h, labelBgPadding: f, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, interactionWidth: b });
  });
}
const fx = ld({ isInternal: !1 }), cd = ld({ isInternal: !0 });
fx.displayName = "BezierEdge";
cd.displayName = "BezierEdgeInternal";
const Sa = {
  default: cd,
  straight: ad,
  step: id,
  smoothstep: rd,
  simplebezier: ed
}, Na = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, hx = (e, t, n) => n === U.Left ? e - t : n === U.Right ? e + t : e, px = (e, t, n) => n === U.Top ? e - t : n === U.Bottom ? e + t : e, Ca = "react-flow__edgeupdater";
function Ma({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return u("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: be([Ca, `${Ca}-${a}`]), cx: hx(t, r, e), cy: px(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function gx({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: h, setReconnecting: f, setUpdateHover: p }) {
  const g = fe(), v = (x, N) => {
    if (x.button !== 0)
      return;
    const { autoPanOnConnect: S, domNode: C, connectionMode: T, connectionRadius: A, lib: B, onConnectStart: z, cancelConnection: W, nodeLookup: P, rfId: _, panBy: I, updateConnection: M } = g.getState(), E = N.type === "target", O = (D, V) => {
      f(!1), h == null || h(D, n, N.type, V);
    }, $ = (D) => c == null ? void 0 : c(n, D), L = (D, V) => {
      f(!0), d == null || d(x, n, N.type), z == null || z(D, V);
    };
    mi.onPointerDown(x.nativeEvent, {
      autoPanOnConnect: S,
      connectionMode: T,
      connectionRadius: A,
      domNode: C,
      handleId: N.id,
      nodeId: N.nodeId,
      nodeLookup: P,
      isTarget: E,
      edgeUpdaterType: N.type,
      lib: B,
      flowId: _,
      cancelConnection: W,
      panBy: I,
      isValidConnection: (...D) => {
        var V, j;
        return ((j = (V = g.getState()).isValidConnection) == null ? void 0 : j.call(V, ...D)) ?? !0;
      },
      onConnect: $,
      onConnectStart: L,
      onConnectEnd: (...D) => {
        var V, j;
        return (j = (V = g.getState()).onConnectEnd) == null ? void 0 : j.call(V, ...D);
      },
      onReconnectEnd: O,
      updateConnection: M,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: x.currentTarget
    });
  }, w = (x) => v(x, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (x) => v(x, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), b = () => p(!0), y = () => p(!1);
  return k(me, { children: [(e === !0 || e === "source") && u(Ma, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: w, onMouseEnter: b, onMouseOut: y, type: "source" }), (e === !0 || e === "target") && u(Ma, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: b, onMouseOut: y, type: "target" })] });
}
function mx({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: h, onReconnectStart: f, onReconnectEnd: p, rfId: g, edgeTypes: v, noPanClassName: w, onError: m, disableKeyboardA11y: b }) {
  let y = se((K) => K.edgeLookup.get(e));
  const x = se((K) => K.defaultEdgeOptions);
  y = x ? { ...x, ...y } : y;
  let N = y.type || "default", S = (v == null ? void 0 : v[N]) || Sa[N];
  S === void 0 && (m == null || m("011", Ve.error011(N)), N = "default", S = (v == null ? void 0 : v.default) || Sa.default);
  const C = !!(y.focusable || t && typeof y.focusable > "u"), T = typeof h < "u" && (y.reconnectable || n && typeof y.reconnectable > "u"), A = !!(y.selectable || r && typeof y.selectable > "u"), B = oe(null), [z, W] = Q(!1), [P, _] = Q(!1), I = fe(), { zIndex: M = y.zIndex, sourceX: E, sourceY: O, targetX: $, targetY: L, sourcePosition: D, targetPosition: V } = se($e((K) => {
    const ee = K.nodeLookup.get(y.source), te = K.nodeLookup.get(y.target);
    if (!ee || !te)
      return Na;
    const re = Vw({
      id: e,
      sourceNode: ee,
      targetNode: te,
      sourceHandle: y.sourceHandle || null,
      targetHandle: y.targetHandle || null,
      connectionMode: K.connectionMode,
      onError: m
    }), ie = zw({
      selected: y.selected,
      zIndex: y.zIndex,
      sourceNode: ee,
      targetNode: te,
      elevateOnSelect: K.elevateEdgesOnSelect,
      zIndexMode: K.zIndexMode
    });
    return {
      ...re || Na,
      zIndex: ie
    };
  }, [y.source, y.target, y.sourceHandle, y.targetHandle, y.selected, y.zIndex, m]), pe), j = le(() => y.markerStart ? `url('#${pi(y.markerStart, g)}')` : void 0, [y.markerStart, g]), G = le(() => y.markerEnd ? `url('#${pi(y.markerEnd, g)}')` : void 0, [y.markerEnd, g]);
  if (y.hidden || E === null || O === null || $ === null || L === null)
    return null;
  const Y = (K) => {
    var ie;
    const { addSelectedEdges: ee, unselectNodesAndEdges: te, multiSelectionActive: re } = I.getState();
    A && (I.setState({ nodesSelectionActive: !1 }), y.selected && re ? (te({ nodes: [], edges: [y] }), (ie = B.current) == null || ie.blur()) : ee([e])), o && o(K, y);
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
    if (!b && tc.includes(K.key) && A) {
      const { unselectNodesAndEdges: te, addSelectedEdges: re } = I.getState();
      K.key === "Escape" ? ((ee = B.current) == null || ee.blur(), te({ edges: [y] })) : re([e]);
    }
  };
  return u("svg", { style: { zIndex: M }, children: k("g", { className: be([
    "react-flow__edge",
    `react-flow__edge-${N}`,
    y.className,
    w,
    {
      selected: y.selected,
      animated: y.animated,
      inactive: !A && !o,
      updating: z,
      selectable: A
    }
  ]), onClick: Y, onDoubleClick: ne, onContextMenu: Z, onMouseEnter: R, onMouseMove: F, onMouseLeave: q, onKeyDown: C ? J : void 0, tabIndex: C ? 0 : void 0, role: y.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": y.ariaLabel === null ? void 0 : y.ariaLabel || `Edge from ${y.source} to ${y.target}`, "aria-describedby": C ? `${Rc}-${g}` : void 0, ref: B, ...y.domAttributes, children: [!P && u(S, { id: e, source: y.source, target: y.target, type: y.type, selected: y.selected, animated: y.animated, selectable: A, deletable: y.deletable ?? !0, label: y.label, labelStyle: y.labelStyle, labelShowBg: y.labelShowBg, labelBgStyle: y.labelBgStyle, labelBgPadding: y.labelBgPadding, labelBgBorderRadius: y.labelBgBorderRadius, sourceX: E, sourceY: O, targetX: $, targetY: L, sourcePosition: D, targetPosition: V, data: y.data, style: y.style, sourceHandleId: y.sourceHandle, targetHandleId: y.targetHandle, markerStart: j, markerEnd: G, pathOptions: "pathOptions" in y ? y.pathOptions : void 0, interactionWidth: y.interactionWidth }), T && u(gx, { edge: y, isReconnectable: T, reconnectRadius: d, onReconnect: h, onReconnectStart: f, onReconnectEnd: p, sourceX: E, sourceY: O, targetX: $, targetY: L, sourcePosition: D, targetPosition: V, setUpdateHover: W, setReconnecting: _ })] }) });
}
var yx = he(mx);
const wx = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function dd({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: h, onEdgeDoubleClick: f, onReconnectStart: p, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: w, edgesReconnectable: m, elementsSelectable: b, onError: y } = se(wx, pe), x = nx(t);
  return k("div", { className: "react-flow__edges", children: [u(ax, { defaultColor: e, rfId: n }), x.map((N) => u(yx, { id: N, edgesFocusable: w, edgesReconnectable: m, elementsSelectable: b, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: h, onDoubleClick: f, onReconnectStart: p, onReconnectEnd: g, rfId: n, onError: y, edgeTypes: r, disableKeyboardA11y: v }, N))] });
}
dd.displayName = "EdgeRenderer";
const bx = he(dd), Ia = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function vx({ children: e }) {
  const t = fe(), n = oe(null), [r] = Q(() => t.getState().transform);
  return Vc(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = Ia(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), u("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Ia(r) }, children: e });
}
function xx(e) {
  const t = so(), n = oe(!1);
  de(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const _x = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function kx(e) {
  const t = se(_x), n = fe();
  return de(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Ex(e) {
  return e.connection.inProgress ? { ...e.connection, to: Hn(e.connection.to, e.transform) } : { ...e.connection };
}
function Sx(e) {
  return Ex;
}
function Nx(e) {
  const t = Sx();
  return se(t, pe);
}
const Cx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Mx({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = se(Cx, pe);
  return !(i && o && l) ? null : u("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: u("g", { className: be(["react-flow__connection", fc(a)]), children: u(ud, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const ud = ({ style: e, type: t = ct.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: h, toPosition: f, pointer: p } = Nx();
  if (!o)
    return;
  if (n)
    return u(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: f, connectionStatus: fc(r), toNode: d, toHandle: h, pointer: p });
  let g = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: f
  };
  switch (t) {
    case ct.Bezier:
      [g] = yc(v);
      break;
    case ct.SimpleBezier:
      [g] = Qc(v);
      break;
    case ct.Step:
      [g] = hi({
        ...v,
        borderRadius: 0
      });
      break;
    case ct.SmoothStep:
      [g] = hi(v);
      break;
    default:
      [g] = bc(v);
  }
  return u("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
ud.displayName = "ConnectionLine";
const Ix = {};
function $a(e = Ix) {
  oe(e), fe(), de(() => {
  }, [e]);
}
function $x() {
  fe(), oe(!1), de(() => {
  }, []);
}
function fd({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: h, onSelectionStart: f, onSelectionEnd: p, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: w, connectionLineContainerStyle: m, selectionKeyCode: b, selectionOnDrag: y, selectionMode: x, multiSelectionKeyCode: N, panActivationKeyCode: S, zoomActivationKeyCode: C, deleteKeyCode: T, onlyRenderVisibleElements: A, elementsSelectable: B, defaultViewport: z, translateExtent: W, minZoom: P, maxZoom: _, preventScrolling: I, defaultMarkerColor: M, zoomOnScroll: E, zoomOnPinch: O, panOnScroll: $, panOnScrollSpeed: L, panOnScrollMode: D, zoomOnDoubleClick: V, panOnDrag: j, autoPanOnSelection: G, onPaneClick: Y, onPaneMouseEnter: ne, onPaneMouseMove: Z, onPaneMouseLeave: R, onPaneScroll: F, onPaneContextMenu: q, paneClickDistance: J, nodeClickDistance: K, onEdgeContextMenu: ee, onEdgeMouseEnter: te, onEdgeMouseMove: re, onEdgeMouseLeave: ie, reconnectRadius: ce, onReconnect: ke, onReconnectStart: Ee, onReconnectEnd: Te, noDragClassName: Le, noWheelClassName: ht, noPanClassName: Ge, disableKeyboardA11y: Qe, nodeExtent: Se, rfId: ze, viewport: _e, onViewportChange: Xe, nodesDraggable: Zt }) {
  return $a(e), $a(t), $x(), xx(n), kx(_e), u(Gv, { onPaneClick: Y, onPaneMouseEnter: ne, onPaneMouseMove: Z, onPaneMouseLeave: R, onPaneContextMenu: q, onPaneScroll: F, paneClickDistance: J, deleteKeyCode: T, selectionKeyCode: b, selectionOnDrag: y, selectionMode: x, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: N, panActivationKeyCode: S, zoomActivationKeyCode: C, elementsSelectable: B, zoomOnScroll: E, zoomOnPinch: O, zoomOnDoubleClick: V, panOnScroll: $, panOnScrollSpeed: L, panOnScrollMode: D, panOnDrag: j, autoPanOnSelection: G, defaultViewport: z, translateExtent: W, minZoom: P, maxZoom: _, onSelectionContextMenu: h, preventScrolling: I, noDragClassName: Le, noWheelClassName: ht, noPanClassName: Ge, disableKeyboardA11y: Qe, onViewportChange: Xe, isControlledViewport: !!_e, children: k(vx, { children: [u(bx, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: ke, onReconnectStart: Ee, onReconnectEnd: Te, onlyRenderVisibleElements: A, onEdgeContextMenu: ee, onEdgeMouseEnter: te, onEdgeMouseMove: re, onEdgeMouseLeave: ie, reconnectRadius: ce, defaultMarkerColor: M, noPanClassName: Ge, disableKeyboardA11y: Qe, rfId: ze }), u(Mx, { style: v, type: g, component: w, containerStyle: m }), u("div", { className: "react-flow__edgelabel-renderer" }), u(tx, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: K, onlyRenderVisibleElements: A, noPanClassName: Ge, noDragClassName: Le, disableKeyboardA11y: Qe, nodeExtent: Se, rfId: ze, nodesDraggable: Zt }), u("div", { className: "react-flow__viewport-portal" })] }) });
}
fd.displayName = "GraphView";
const Ax = he(fd), Tx = cc(), Aa = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: h, zIndexMode: f = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = r ?? t ?? [], b = n ?? e ?? [], y = d ?? [0, 0], x = h ?? Cn;
  _c(v, w, m);
  const { nodesInitialized: N } = gi(b, p, g, {
    nodeOrigin: y,
    nodeExtent: x,
    zIndexMode: f
  });
  let S = [0, 0, 1];
  if (s && o && i) {
    const C = Dn(p, {
      filter: (z) => !!((z.width || z.initialWidth) && (z.height || z.initialHeight))
    }), { x: T, y: A, zoom: B } = no(C, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    S = [T, A, B];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: S,
    nodes: b,
    nodesInitialized: N,
    nodeLookup: p,
    parentLookup: g,
    edges: m,
    edgeLookup: w,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: Cn,
    nodeExtent: x,
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
    connection: { ...rc },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Tx,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: nc,
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
}, Lx = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: h, zIndexMode: f }) => Yb((p, g) => {
  async function v() {
    const { nodeLookup: w, panZoom: m, fitViewOptions: b, fitViewResolver: y, width: x, height: N, minZoom: S, maxZoom: C } = g();
    m && (await Cw({
      nodes: w,
      width: x,
      height: N,
      panZoom: m,
      minZoom: S,
      maxZoom: C
    }, b), y == null || y.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...Aa({
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
      const { nodeLookup: m, parentLookup: b, nodeOrigin: y, nodeExtent: x, elevateNodesOnSelect: N, fitViewQueued: S, zIndexMode: C, nodesSelectionActive: T } = g(), { nodesInitialized: A, hasSelectedNodes: B } = gi(w, m, b, {
        nodeOrigin: y,
        nodeExtent: x,
        elevateNodesOnSelect: N,
        checkEquality: !0,
        zIndexMode: C
      }), z = T && B;
      S && A ? (v(), p({
        nodes: w,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: z
      })) : p({ nodes: w, nodesInitialized: A, nodesSelectionActive: z });
    },
    setEdges: (w) => {
      const { connectionLookup: m, edgeLookup: b } = g();
      _c(m, b, w), p({ edges: w });
    },
    setDefaultNodesAndEdges: (w, m) => {
      if (w) {
        const { setNodes: b } = g();
        b(w), p({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: b } = g();
        b(m), p({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (w) => {
      const { triggerNodeChanges: m, nodeLookup: b, parentLookup: y, domNode: x, nodeOrigin: N, nodeExtent: S, debug: C, fitViewQueued: T, zIndexMode: A } = g(), { changes: B, updatedInternals: z } = Kw(w, b, y, x, N, S, A);
      z && (Gw(b, y, { nodeOrigin: N, nodeExtent: S, zIndexMode: A }), T ? (v(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), (B == null ? void 0 : B.length) > 0 && (C && console.log("React Flow: trigger node changes", B), m == null || m(B)));
    },
    updateNodePositions: (w, m = !1) => {
      const b = [];
      let y = [];
      const { nodeLookup: x, triggerNodeChanges: N, connection: S, updateConnection: C, onNodesChangeMiddlewareMap: T } = g();
      for (const [A, B] of w) {
        const z = x.get(A), W = !!(z != null && z.expandParent && (z != null && z.parentId) && (B != null && B.position)), P = {
          id: A,
          type: "position",
          position: W ? {
            x: Math.max(0, B.position.x),
            y: Math.max(0, B.position.y)
          } : B.position,
          dragging: m
        };
        if (z && S.inProgress && S.fromNode.id === z.id) {
          const _ = It(z, S.fromHandle, U.Left, !0);
          C({ ...S, from: _ });
        }
        W && z.parentId && b.push({
          id: A,
          parentId: z.parentId,
          rect: {
            ...B.internals.positionAbsolute,
            width: B.measured.width ?? 0,
            height: B.measured.height ?? 0
          }
        }), y.push(P);
      }
      if (b.length > 0) {
        const { parentLookup: A, nodeOrigin: B } = g(), z = Ki(b, x, A, B);
        y.push(...z);
      }
      for (const A of T.values())
        y = A(y);
      N(y);
    },
    triggerNodeChanges: (w) => {
      const { onNodesChange: m, setNodes: b, nodes: y, hasDefaultNodes: x, debug: N } = g();
      if (w != null && w.length) {
        if (x) {
          const S = fv(w, y);
          b(S);
        }
        N && console.log("React Flow: trigger node changes", w), m == null || m(w);
      }
    },
    triggerEdgeChanges: (w) => {
      const { onEdgesChange: m, setEdges: b, edges: y, hasDefaultEdges: x, debug: N } = g();
      if (w != null && w.length) {
        if (x) {
          const S = hv(w, y);
          b(S);
        }
        N && console.log("React Flow: trigger edge changes", w), m == null || m(w);
      }
    },
    addSelectedNodes: (w) => {
      const { multiSelectionActive: m, edgeLookup: b, nodeLookup: y, triggerNodeChanges: x, triggerEdgeChanges: N } = g();
      if (m) {
        const S = w.map((C) => vt(C, !0));
        x(S);
        return;
      }
      x(Rt(y, /* @__PURE__ */ new Set([...w]), !0)), N(Rt(b));
    },
    addSelectedEdges: (w) => {
      const { multiSelectionActive: m, edgeLookup: b, nodeLookup: y, triggerNodeChanges: x, triggerEdgeChanges: N } = g();
      if (m) {
        const S = w.map((C) => vt(C, !0));
        N(S);
        return;
      }
      N(Rt(b, /* @__PURE__ */ new Set([...w]))), x(Rt(y, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: w, edges: m } = {}) => {
      const { edges: b, nodes: y, nodeLookup: x, triggerNodeChanges: N, triggerEdgeChanges: S } = g(), C = w || y, T = m || b, A = [];
      for (const z of C) {
        if (!z.selected)
          continue;
        const W = x.get(z.id);
        W && (W.selected = !1), A.push(vt(z.id, !1));
      }
      const B = [];
      for (const z of T)
        z.selected && B.push(vt(z.id, !1));
      N(A), S(B);
    },
    setMinZoom: (w) => {
      const { panZoom: m, maxZoom: b } = g();
      m == null || m.setScaleExtent([w, b]), p({ minZoom: w });
    },
    setMaxZoom: (w) => {
      const { panZoom: m, minZoom: b } = g();
      m == null || m.setScaleExtent([b, w]), p({ maxZoom: w });
    },
    setTranslateExtent: (w) => {
      var m;
      (m = g().panZoom) == null || m.setTranslateExtent(w), p({ translateExtent: w });
    },
    resetSelectedElements: () => {
      const { edges: w, nodes: m, triggerNodeChanges: b, triggerEdgeChanges: y, elementsSelectable: x } = g();
      if (!x)
        return;
      const N = m.reduce((C, T) => T.selected ? [...C, vt(T.id, !1)] : C, []), S = w.reduce((C, T) => T.selected ? [...C, vt(T.id, !1)] : C, []);
      b(N), y(S);
    },
    setNodeExtent: (w) => {
      const { nodes: m, nodeLookup: b, parentLookup: y, nodeOrigin: x, elevateNodesOnSelect: N, nodeExtent: S, zIndexMode: C } = g();
      w[0][0] === S[0][0] && w[0][1] === S[0][1] && w[1][0] === S[1][0] && w[1][1] === S[1][1] || (gi(m, b, y, {
        nodeOrigin: x,
        nodeExtent: w,
        elevateNodesOnSelect: N,
        checkEquality: !1,
        zIndexMode: C
      }), p({ nodeExtent: w }));
    },
    panBy: (w) => {
      const { transform: m, width: b, height: y, panZoom: x, translateExtent: N } = g();
      return Zw({ delta: w, panZoom: x, transform: m, translateExtent: N, width: b, height: y });
    },
    setCenter: async (w, m, b) => {
      const { width: y, height: x, maxZoom: N, panZoom: S } = g();
      if (!S)
        return !1;
      const C = typeof (b == null ? void 0 : b.zoom) < "u" ? b.zoom : N;
      return await S.setViewport({
        x: y / 2 - w * C,
        y: x / 2 - m * C,
        zoom: C
      }, { duration: b == null ? void 0 : b.duration, ease: b == null ? void 0 : b.ease, interpolate: b == null ? void 0 : b.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...rc }
      });
    },
    updateConnection: (w) => {
      p({ connection: w });
    },
    reset: () => p({ ...Aa() })
  };
}, Object.is);
function Qi({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: h, zIndexMode: f, children: p }) {
  const [g] = Q(() => Lx({
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
  return u(Gb, { value: g, children: u(wv, { children: u(Lv, { children: p }) }) });
}
function zx({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: h, nodeExtent: f, zIndexMode: p }) {
  return qt(io) ? u(me, { children: e }) : u(Qi, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: h, nodeExtent: f, zIndexMode: p, children: e });
}
const Ox = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function Px({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: h, onMoveEnd: f, onConnect: p, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, onNodeMouseEnter: b, onNodeMouseMove: y, onNodeMouseLeave: x, onNodeContextMenu: N, onNodeDoubleClick: S, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onNodesDelete: B, onEdgesDelete: z, onDelete: W, onSelectionChange: P, onSelectionDragStart: _, onSelectionDrag: I, onSelectionDragStop: M, onSelectionContextMenu: E, onSelectionStart: O, onSelectionEnd: $, onBeforeDelete: L, connectionMode: D, connectionLineType: V = ct.Bezier, connectionLineStyle: j, connectionLineComponent: G, connectionLineContainerStyle: Y, deleteKeyCode: ne = "Backspace", selectionKeyCode: Z = "Shift", selectionOnDrag: R = !1, selectionMode: F = Mn.Full, panActivationKeyCode: q = "Space", multiSelectionKeyCode: J = $n() ? "Meta" : "Control", zoomActivationKeyCode: K = $n() ? "Meta" : "Control", snapToGrid: ee, snapGrid: te, onlyRenderVisibleElements: re = !1, selectNodesOnDrag: ie, nodesDraggable: ce, autoPanOnNodeFocus: ke, nodesConnectable: Ee, nodesFocusable: Te, nodeOrigin: Le = Hc, edgesFocusable: ht, edgesReconnectable: Ge, elementsSelectable: Qe = !0, defaultViewport: Se = iv, minZoom: ze = 0.5, maxZoom: _e = 2, translateExtent: Xe = Cn, preventScrolling: Zt = !0, nodeExtent: Je, defaultMarkerColor: co = "#b1b1b7", zoomOnScroll: Qt = !0, zoomOnPinch: Jt = !0, panOnScroll: uo = !1, panOnScrollSpeed: Wn = 0.5, panOnScrollMode: en = Et.Free, zoomOnDoubleClick: tn = !0, panOnDrag: fo = !0, onPaneClick: ho, onPaneMouseEnter: Lt, onPaneMouseMove: nn, onPaneMouseLeave: ge, onPaneScroll: et, onPaneContextMenu: Bn, paneClickDistance: pt = 1, nodeClickDistance: zt = 0, children: Vn, onReconnect: Fn, onReconnectStart: jn, onReconnectEnd: po, onEdgeContextMenu: go, onEdgeDoubleClick: mo, onEdgeMouseEnter: yo, onEdgeMouseMove: Pe, onEdgeMouseLeave: rn, reconnectRadius: on = 10, onNodesChange: wo, onEdgesChange: sn, noDragClassName: bo = "nodrag", noWheelClassName: Yn = "nowheel", noPanClassName: Gn = "nopan", fitView: Xn, fitViewOptions: Un, connectOnClick: vo, attributionPosition: xo, proOptions: _o, defaultEdgeOptions: ko, elevateNodesOnSelect: Eo = !0, elevateEdgesOnSelect: So = !1, disableKeyboardA11y: qn = !1, autoPanOnConnect: No, autoPanOnNodeDrag: Co, autoPanOnSelection: Mo = !0, autoPanSpeed: Io, connectionRadius: an, isValidConnection: gt, onError: ln, style: cn, id: Kn, nodeDragThreshold: $o, connectionDragThreshold: Zn, viewport: Qn, onViewportChange: Jn, width: er, height: tr, colorMode: nr = "light", debug: rr, onScroll: mt, ariaLabelConfig: Ao, zIndexMode: Ne = "basic", ...or }, ir) {
  const dn = Kn || "1", To = cv(nr), sr = $e((un) => {
    un.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), mt == null || mt(un);
  }, [mt]);
  return u("div", { "data-testid": "rf__wrapper", ...or, onScroll: sr, style: { ...cn, ...Ox }, ref: ir, className: be(["react-flow", o, To]), id: Kn, role: "application", children: k(zx, { nodes: e, edges: t, width: er, height: tr, fitView: Xn, fitViewOptions: Un, minZoom: ze, maxZoom: _e, nodeOrigin: Le, nodeExtent: Je, zIndexMode: Ne, children: [u(lv, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: p, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, nodesDraggable: ce, autoPanOnNodeFocus: ke, nodesConnectable: Ee, nodesFocusable: Te, edgesFocusable: ht, edgesReconnectable: Ge, elementsSelectable: Qe, elevateNodesOnSelect: Eo, elevateEdgesOnSelect: So, minZoom: ze, maxZoom: _e, nodeExtent: Je, onNodesChange: wo, onEdgesChange: sn, snapToGrid: ee, snapGrid: te, connectionMode: D, translateExtent: Xe, connectOnClick: vo, defaultEdgeOptions: ko, fitView: Xn, fitViewOptions: Un, onNodesDelete: B, onEdgesDelete: z, onDelete: W, onNodeDragStart: C, onNodeDrag: T, onNodeDragStop: A, onSelectionDrag: I, onSelectionDragStart: _, onSelectionDragStop: M, onMove: d, onMoveStart: h, onMoveEnd: f, noPanClassName: Gn, nodeOrigin: Le, rfId: dn, autoPanOnConnect: No, autoPanOnNodeDrag: Co, autoPanSpeed: Io, onError: ln, connectionRadius: an, isValidConnection: gt, selectNodesOnDrag: ie, nodeDragThreshold: $o, connectionDragThreshold: Zn, onBeforeDelete: L, debug: rr, ariaLabelConfig: Ao, zIndexMode: Ne }), u(Ax, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: b, onNodeMouseMove: y, onNodeMouseLeave: x, onNodeContextMenu: N, onNodeDoubleClick: S, nodeTypes: i, edgeTypes: s, connectionLineType: V, connectionLineStyle: j, connectionLineComponent: G, connectionLineContainerStyle: Y, selectionKeyCode: Z, selectionOnDrag: R, selectionMode: F, deleteKeyCode: ne, multiSelectionKeyCode: J, panActivationKeyCode: q, zoomActivationKeyCode: K, onlyRenderVisibleElements: re, defaultViewport: Se, translateExtent: Xe, minZoom: ze, maxZoom: _e, preventScrolling: Zt, zoomOnScroll: Qt, zoomOnPinch: Jt, zoomOnDoubleClick: tn, panOnScroll: uo, panOnScrollSpeed: Wn, panOnScrollMode: en, panOnDrag: fo, autoPanOnSelection: Mo, onPaneClick: ho, onPaneMouseEnter: Lt, onPaneMouseMove: nn, onPaneMouseLeave: ge, onPaneScroll: et, onPaneContextMenu: Bn, paneClickDistance: pt, nodeClickDistance: zt, onSelectionContextMenu: E, onSelectionStart: O, onSelectionEnd: $, onReconnect: Fn, onReconnectStart: jn, onReconnectEnd: po, onEdgeContextMenu: go, onEdgeDoubleClick: mo, onEdgeMouseEnter: yo, onEdgeMouseMove: Pe, onEdgeMouseLeave: rn, reconnectRadius: on, defaultMarkerColor: co, noDragClassName: bo, noWheelClassName: Yn, noPanClassName: Gn, rfId: dn, disableKeyboardA11y: qn, nodeExtent: Je, viewport: Qn, onViewportChange: Jn, nodesDraggable: ce }), u(ov, { onSelectionChange: P }), Vn, u(Jb, { proOptions: _o, position: xo }), u(Qb, { rfId: dn, disableKeyboardA11y: qn })] }) });
}
var hd = Bc(Px);
function Dx({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return u("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: be(["react-flow__background-pattern", n, r]) });
}
function Rx({ radius: e, className: t }) {
  return u("circle", { cx: e, cy: e, r: e, className: be(["react-flow__background-pattern", "dots", t]) });
}
var ut;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(ut || (ut = {}));
const Hx = {
  [ut.Dots]: 1,
  [ut.Lines]: 1,
  [ut.Cross]: 6
}, Wx = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function pd({
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
  const h = oe(null), { transform: f, patternId: p } = se(Wx, pe), g = r || Hx[t], v = t === ut.Dots, w = t === ut.Cross, m = Array.isArray(n) ? n : [n, n], b = [m[0] * f[2] || 1, m[1] * f[2] || 1], y = g * f[2], x = Array.isArray(i) ? i : [i, i], N = w ? [y, y] : b, S = [
    x[0] * f[2] + N[0] / 2,
    x[1] * f[2] + N[1] / 2
  ], C = `${p}${e || ""}`;
  return k("svg", { className: be(["react-flow__background", c]), style: {
    ...l,
    ...ao,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: h, "data-testid": "rf__background", children: [u("pattern", { id: C, x: f[0] % b[0], y: f[1] % b[1], width: b[0], height: b[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${S[0]},-${S[1]})`, children: v ? u(Rx, { radius: y / 2, className: d }) : u(Dx, { dimensions: N, lineWidth: o, variant: t, className: d }) }), u("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
pd.displayName = "Background";
const gd = he(pd);
function Bx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: u("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Vx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: u("path", { d: "M0 0h32v4.2H0z" }) });
}
function Fx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: u("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function jx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Yx() {
  return u("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: u("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function yr({ children: e, className: t, ...n }) {
  return u("button", { type: "button", className: be(["react-flow__controls-button", t]), ...n, children: e });
}
const Gx = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function md({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: h = "bottom-left", orientation: f = "vertical", "aria-label": p }) {
  const g = fe(), { isInteractive: v, minZoomReached: w, maxZoomReached: m, ariaLabelConfig: b } = se(Gx, pe), { zoomIn: y, zoomOut: x, fitView: N } = so(), S = () => {
    y(), i == null || i();
  }, C = () => {
    x(), s == null || s();
  }, T = () => {
    N(o), a == null || a();
  }, A = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l == null || l(!v);
  };
  return k($t, { className: be(["react-flow__controls", f === "horizontal" ? "horizontal" : "vertical", c]), position: h, style: e, "data-testid": "rf__controls", "aria-label": p ?? b["controls.ariaLabel"], children: [t && k(me, { children: [u(yr, { onClick: S, className: "react-flow__controls-zoomin", title: b["controls.zoomIn.ariaLabel"], "aria-label": b["controls.zoomIn.ariaLabel"], disabled: m, children: u(Bx, {}) }), u(yr, { onClick: C, className: "react-flow__controls-zoomout", title: b["controls.zoomOut.ariaLabel"], "aria-label": b["controls.zoomOut.ariaLabel"], disabled: w, children: u(Vx, {}) })] }), n && u(yr, { className: "react-flow__controls-fitview", onClick: T, title: b["controls.fitView.ariaLabel"], "aria-label": b["controls.fitView.ariaLabel"], children: u(Fx, {}) }), r && u(yr, { className: "react-flow__controls-interactive", onClick: A, title: b["controls.interactive.ariaLabel"], "aria-label": b["controls.interactive.ariaLabel"], children: v ? u(Yx, {}) : u(jx, {}) }), d] });
}
md.displayName = "Controls";
const yd = he(md);
function Xx({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: h, selected: f, onClick: p }) {
  const { background: g, backgroundColor: v } = i || {}, w = s || g || v;
  return u("rect", { className: be(["react-flow__minimap-node", { selected: f }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: w,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: h, onClick: p ? (m) => p(m, e) : void 0 });
}
const Ux = he(Xx), qx = (e) => e.nodes.map((t) => t.id), Ko = (e) => e instanceof Function ? e : () => e;
function Kx({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Ux,
  onClick: s
}) {
  const a = se(qx, pe), l = Ko(t), c = Ko(e), d = Ko(n), h = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return u(me, { children: a.map((f) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    u(Qx, { id: f, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: h }, f)
  )) });
}
function Zx({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: h, width: f, height: p } = se((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const w = v.internals.userNode, { x: m, y: b } = v.internals.positionAbsolute, { width: y, height: x } = Ye(w);
    return {
      node: w,
      x: m,
      y: b,
      width: y,
      height: x
    };
  }, pe);
  return !c || c.hidden || !dc(c) ? null : u(a, { x: d, y: h, width: f, height: p, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const Qx = he(Zx);
var Jx = he(Kx);
const e1 = 200, t1 = 150, n1 = (e) => !e.hidden, r1 = (e) => {
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
    boundingRect: n ? ac(Dn(e.nodeLookup, { filter: n1 }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Ta = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, o1 = (e, t) => Ta(e.viewBB, t.viewBB) && Ta(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, i1 = "react-flow__minimap-desc";
function wd({
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
  pannable: v = !1,
  zoomable: w = !1,
  ariaLabel: m,
  inversePan: b,
  zoomStep: y = 1,
  offsetScale: x = 5
}) {
  const N = fe(), S = oe(null), { boundingRect: C, panZoom: T, viewBB: A, rfId: B, translateExtent: z, flowWidth: W, flowHeight: P, ariaLabelConfig: _ } = se(r1, o1), I = (e == null ? void 0 : e.width) ?? e1, M = (e == null ? void 0 : e.height) ?? t1, E = C.width / I, O = C.height / M, $ = Math.max(E, O), L = $ * I, D = $ * M, V = x * $, j = C.x - (L - C.width) / 2 - V, G = C.y - (D - C.height) / 2 - V, Y = L + V * 2, ne = D + V * 2, Z = `${i1}-${B}`, R = oe(0), F = oe();
  R.current = $, de(() => {
    const te = N.getState().panZoom;
    if (S.current && te)
      return F.current = sb({
        domNode: S.current,
        panZoom: te,
        getTransform: () => N.getState().transform,
        getViewScale: () => R.current
      }), () => {
        var re;
        (re = F.current) == null || re.destroy();
      };
  }, [T]), de(() => {
    var te;
    (te = F.current) == null || te.update({
      translateExtent: z,
      width: W,
      height: P,
      inversePan: b,
      pannable: v,
      zoomStep: y,
      zoomable: w
    });
  }, [v, w, b, y, z, W, P]);
  const q = p ? (te) => {
    var ce;
    const [re, ie] = ((ce = F.current) == null ? void 0 : ce.pointer(te)) || [0, 0];
    p(te, { x: re, y: ie });
  } : void 0, J = $e((te, re) => {
    const ie = N.getState().nodeLookup.get(re).internals.userNode;
    g == null || g(te, ie);
  }, [g]), K = g ? J : void 0, ee = m ?? _["minimap.ariaLabel"];
  return u($t, { position: f, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof h == "number" ? h * $ : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: be(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: k("svg", { width: I, height: M, viewBox: `${j} ${G} ${Y} ${ne}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": Z, ref: S, onClick: q, children: [ee && u("title", { id: Z, children: ee }), u(Jx, { onClick: K, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), u("path", { className: "react-flow__minimap-mask", d: `M${j - V},${G - V}h${Y + V * 2}v${ne + V * 2}h${-Y - V * 2}z
        M${A.x},${A.y}h${A.width}v${A.height}h${-A.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
wd.displayName = "MiniMap";
const bd = he(wd), s1 = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, a1 = {
  [Xt.Line]: "right",
  [Xt.Handle]: "bottom-right"
};
function l1({ nodeId: e, position: t, variant: n = Xt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: h = !1, resizeDirection: f, autoScale: p = !0, shouldResize: g, onResizeStart: v, onResize: w, onResizeEnd: m }) {
  const b = Gc(), y = typeof e == "string" ? e : b, x = fe(), N = oe(null), S = n === Xt.Handle, C = se($e(s1(S && p), [S, p]), pe), T = oe(null), A = t ?? a1[n];
  de(() => {
    if (!(!N.current || !y))
      return T.current || (T.current = bb({
        domNode: N.current,
        nodeId: y,
        getStoreItems: () => {
          const { nodeLookup: z, transform: W, snapGrid: P, snapToGrid: _, nodeOrigin: I, domNode: M } = x.getState();
          return {
            nodeLookup: z,
            transform: W,
            snapGrid: P,
            snapToGrid: _,
            nodeOrigin: I,
            paneDomNode: M
          };
        },
        onChange: (z, W) => {
          const { triggerNodeChanges: P, nodeLookup: _, parentLookup: I, nodeOrigin: M } = x.getState(), E = [], O = { x: z.x, y: z.y }, $ = _.get(y);
          if ($ && $.expandParent && $.parentId) {
            const L = $.origin ?? M, D = z.width ?? $.measured.width ?? 0, V = z.height ?? $.measured.height ?? 0, j = {
              id: $.id,
              parentId: $.parentId,
              rect: {
                width: D,
                height: V,
                ...uc({
                  x: z.x ?? $.position.x,
                  y: z.y ?? $.position.y
                }, { width: D, height: V }, $.parentId, _, L)
              }
            }, G = Ki([j], _, I, M);
            E.push(...G), O.x = z.x ? Math.max(L[0] * D, z.x) : void 0, O.y = z.y ? Math.max(L[1] * V, z.y) : void 0;
          }
          if (O.x !== void 0 && O.y !== void 0) {
            const L = {
              id: y,
              type: "position",
              position: { ...O }
            };
            E.push(L);
          }
          if (z.width !== void 0 && z.height !== void 0) {
            const D = {
              id: y,
              type: "dimensions",
              resizing: !0,
              setAttributes: f ? f === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: z.width,
                height: z.height
              }
            };
            E.push(D);
          }
          for (const L of W) {
            const D = {
              ...L,
              type: "position"
            };
            E.push(D);
          }
          P(E);
        },
        onEnd: ({ width: z, height: W }) => {
          const P = {
            id: y,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: z,
              height: W
            }
          };
          x.getState().triggerNodeChanges([P]);
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
        onResizeStart: v,
        onResize: w,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        var z;
        (z = T.current) == null || z.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    d,
    h,
    v,
    w,
    m,
    g
  ]);
  const B = A.split("-");
  return u("div", { className: be(["react-flow__resize-control", "nodrag", ...B, n, r]), ref: N, style: {
    ...o,
    scale: C,
    ...s && { [S ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
he(l1);
const c1 = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", Ji = 0.05, wi = 370, vd = 88, d1 = 44, es = 560, La = "system-map-flow-css", u1 = `
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
if (!document.getElementById(La)) {
  const e = document.createElement("style");
  e.id = La, e.textContent = c1 + u1, document.head.appendChild(e);
}
function ts() {
  return se((e) => e.width);
}
function f1() {
  return se((e) => e.height);
}
function xd(e, t, n) {
  return { width: e - Math.min(n, e * 0.5), height: Math.max(120, t - vd - d1) };
}
const h1 = 16;
function _d(e, t, n = "center") {
  const r = so(), o = se((a) => a.width), i = se((a) => a.height), s = oe(!1);
  de(() => {
    if (!o || !i || e.length === 0) return;
    const a = Math.min(...e.map((g) => g.x)), l = Math.min(...e.map((g) => g.y)), c = Math.max(...e.map((g) => g.x + g.width)), d = Math.max(...e.map((g) => g.y + g.height)), h = xd(o, i, t), f = no(
      { x: a, y: l, width: c - a, height: d - l },
      h.width,
      h.height,
      Ji,
      1,
      0.05
    ), p = n === "top" ? Math.min(f.y, h1 - l * f.zoom) : f.y;
    r.setViewport({ ...f, y: p + vd }, { duration: s.current ? 200 : 0 }), s.current = !0;
  }, [r, e, t, o, i, n]);
}
function p1({ layers: e }) {
  return /* @__PURE__ */ k("div", { className: "sm-layers", role: "group", "aria-label": "Map layers", children: [
    /* @__PURE__ */ u("span", { className: "sm-layers-label", children: "Layers" }),
    e.map((t) => /* @__PURE__ */ u("button", { type: "button", className: "sm-plain sm-layer", "aria-pressed": t.on, title: t.title, disabled: t.disabled, onClick: t.onToggle, children: t.label }, t.key))
  ] });
}
function kd({ children: e }) {
  return /* @__PURE__ */ u("div", { className: "sm-tools", children: e });
}
function g1({ title: e, onBack: t }) {
  return /* @__PURE__ */ k("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
    /* @__PURE__ */ k(ve, { variant: "aim", children: [
      "Showing: ",
      e
    ] }),
    /* @__PURE__ */ u(ae, { onClick: t, children: "Back to today" })
  ] });
}
const Nr = { names: 210, keys: 240, columns: 240 }, bi = 34, _n = 20, m1 = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, y1 = he(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", h = m1[n.status], f = (h == null ? void 0 : h.color) ?? "var(--border-strong, #a1a1aa)";
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
              height: bi,
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
            style: { height: _n, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ u("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: p.primary ? "PK" : p.foreign ? "FK" : p.proposed ? "new" : "" }),
              /* @__PURE__ */ u("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: p.proposed ? 600 : void 0 }, children: p.name }),
              /* @__PURE__ */ u("span", { style: { ...X, ...xe, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.type })
            ]
          },
          p.name
        )),
        o > 0 && /* @__PURE__ */ k("div", { style: { ...X, height: _n, padding: "0 10px", lineHeight: `${_n}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), w1 = { table: y1 };
function Ed(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Vr(e, t) {
  if (t === "names") return bi + 2;
  const n = Ed(e, t).length;
  return bi + n * _n + (n < e.columns.length ? _n : 0) + 2;
}
function b1(e, t) {
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
function v1(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const vi = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function x1(e) {
  return (vi.find(([t]) => t === e) ?? vi[2])[1];
}
function _1() {
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
        vi.map(([e, t]) => /* @__PURE__ */ k("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ u("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function k1({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  tools: i,
  onSelect: s
}) {
  const { mode: a } = Ba(), l = ts() >= es, c = le(() => t ? v1(e, t) : e, [e, t]), d = t && o === "names" ? "keys" : o, h = le(() => b1(c, d), [c, d]), f = le(
    () => c.tables.map((v) => {
      const w = Ed(v, d);
      return {
        id: v.id,
        type: "table",
        position: h.get(v.id) ?? { x: 0, y: 0 },
        width: Nr[d],
        height: Vr(v, d),
        data: {
          table: v,
          columns: w,
          hidden: d === "names" ? 0 : v.columns.length - w.length,
          flags: n.get(v.id) ?? 0,
          working: r.get(v.id) ?? 0,
          focused: v.id === t,
          width: Nr[d],
          large: d === "names"
        }
      };
    }),
    [c, d, h, n, r, t]
  ), p = le(
    () => c.edges.map((v) => {
      const w = x1(v.on_delete);
      return {
        id: v.id,
        source: v.source,
        target: v.target,
        selectable: !1,
        markerEnd: { type: jt.ArrowClosed, width: 14, height: 14, color: w },
        style: { stroke: w, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [c, t]
  ), g = le(
    () => c.tables.map((v) => ({
      ...h.get(v.id) ?? { x: 0, y: 0 },
      width: Nr[d],
      height: Vr(v, d)
    })),
    [c, h, d]
  );
  return _d(g, t ? wi : 0), /* @__PURE__ */ k(
    hd,
    {
      nodes: f,
      edges: p,
      nodeTypes: w1,
      colorMode: a,
      minZoom: Ji,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (v, w) => s(w.id),
      onPaneClick: () => s(null),
      children: [
        /* @__PURE__ */ u(gd, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(yd, { showInteractive: !1 }),
        l && /* @__PURE__ */ u(bd, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u($t, { position: "top-left", children: /* @__PURE__ */ k(kd, { children: [
          i,
          /* @__PURE__ */ u(_1, {})
        ] }) })
      ]
    }
  );
}
function E1(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ u(Qi, { children: /* @__PURE__ */ u(k1, { ...e }) }) });
}
const S1 = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], N1 = {
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
}, C1 = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], Sd = { accepted: "ok", dropped: "muted", draft: "aim" }, za = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, ns = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, M1 = { ...ns, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, I1 = { ...X, ...xe, fontSize: 11, overflowWrap: "anywhere" };
function Tn(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function xi(e) {
  return Kt(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function _i({ title: e, children: t }) {
  return /* @__PURE__ */ k("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function Nd({ limit: e }) {
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ u(Ln, { severity: e.severity }),
    /* @__PURE__ */ k("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ u("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u("div", { style: { ...X, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ u("div", { style: I1, children: e.evidence.join("  ") })
    ] })
  ] });
}
function wr({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ u(_i, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ u("button", { style: { ...Ie, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? xi(o.id) }),
    r && /* @__PURE__ */ u("span", { style: { ...X, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function $1({
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
      /* @__PURE__ */ u(ae, { onClick: r, children: "Back" }),
      /* @__PURE__ */ u("strong", { style: { fontSize: 14, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(ve, { variant: Sd[e.status], children: e.status }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(ae, { primary: t, onClick: () => o("map"), children: "Show on map" }),
      /* @__PURE__ */ u(ae, { onClick: () => o("data"), children: "Show in data model" }),
      /* @__PURE__ */ u(ae, { onClick: s, disabled: !n, children: "Ask" })
    ] }),
    e.why && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13, margin: "6px 0 0" }, children: e.why }),
    e.closes.map((d) => /* @__PURE__ */ k("p", { style: { fontSize: 13, margin: "8px 0 0" }, "data-testid": "closes", children: [
      "Closes ",
      d.before - d.after,
      " of ",
      Tn(d.before, "gap"),
      " in ",
      /* @__PURE__ */ u("strong", { children: d.title }),
      "."
    ] }, d.id)),
    C1.map(({ kind: d, title: h }) => {
      const f = e.limits.filter((p) => p.kind === d);
      return f.length === 0 ? null : /* @__PURE__ */ u(_i, { title: `${h} (${f.length})`, children: f.map((p, g) => /* @__PURE__ */ u(Nd, { limit: p }, g)) }, d);
    }),
    /* @__PURE__ */ u(wr, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ u(wr, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ u(wr, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ u(wr, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    e.limits_checked === !1 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, "data-testid": "limits-note", children: "Limits check Postgres only, so this hasn't been checked against this project's database." }),
    c.length > 0 && /* @__PURE__ */ u(_i, { title: "Draft SQL", children: /* @__PURE__ */ u("pre", { style: { ...xe, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
`) }) }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      e.status !== "accepted" && /* @__PURE__ */ u(ae, { primary: !0, onClick: () => a("accepted"), children: "Accept" }),
      e.status !== "dropped" && /* @__PURE__ */ u(ae, { onClick: () => a("dropped"), children: "Drop" }),
      e.status !== "draft" && /* @__PURE__ */ u(ae, { onClick: () => a("draft"), children: "Back to draft" }),
      /* @__PURE__ */ u("span", { style: { flex: 1 } }),
      /* @__PURE__ */ u(ae, { danger: !0, onClick: l, children: "Delete" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...X, fontSize: 12, marginBottom: 0 }, children: "This stays in System Map. Nothing here changes your repo." })
  ] });
}
function A1({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ k("button", { style: M1, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ k("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ u(ve, { variant: "err", children: Tn(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ k(ve, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ u(ve, { variant: Sd[n.status], children: n.status })
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
function T1(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${Tn(n, "unit test")}`, t ? Tn(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${Gr(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function L1({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ k("div", { style: ns, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ u("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ u(ve, { variant: za[e.state].variant, children: za[e.state].label }),
      /* @__PURE__ */ u("button", { style: Ie, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ u("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ u("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ u(Nd, { limit: i }, s)) }),
    /* @__PURE__ */ u("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ u("tbody", { children: e.parts.map((i) => /* @__PURE__ */ k("tr", { children: [
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", ...X }, children: i.kind }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ u("button", { style: { ...Ie, textAlign: "left" }, onClick: () => n(i.id), children: xi(i.id) }) : xi(i.id) }),
      /* @__PURE__ */ u("td", { style: { padding: "2px 0", ...X, textAlign: "right" }, children: T1(i) })
    ] }, i.id)) }) })
  ] });
}
function z1({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ u("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ k("div", { style: { ...ns, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ u("button", { style: { ...Ie, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ k("span", { style: { ...X, fontSize: 12 }, children: [
      Tn(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ u("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function O1({
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
  const [p, g] = Q(""), v = N1[o], w = () => {
    p.trim() && (s(v.ask(p.trim())), g(""));
  };
  return /* @__PURE__ */ k("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ u("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: S1.map(([m, b]) => /* @__PURE__ */ u(ae, { primary: o === m, onClick: () => i(m), children: b }, m)) }),
    /* @__PURE__ */ k(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (m) => {
          m.preventDefault(), w();
        },
        children: [
          /* @__PURE__ */ u(jr, { "aria-label": "Describe it", placeholder: v.placeholder, value: p, onChange: (m) => g(m.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ u(ae, { primary: !0, type: "submit", disabled: !r || !p.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ u(
        $1,
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
      ) : /* @__PURE__ */ u(A1, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ k("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((m) => /* @__PURE__ */ u(
          L1,
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
      o === "views" && /* @__PURE__ */ u(z1, { rows: e.views, onOpen: h, onDelete: (m) => d("views", m) })
    ] })
  ] });
}
const P1 = ["high", "medium", "low", "info"];
function D1({
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
      /* @__PURE__ */ k(ae, { primary: o === null, onClick: () => i(null), children: [
        "All ",
        e.length
      ] }),
      P1.filter((l) => s.get(l)).map((l) => /* @__PURE__ */ k(ae, { primary: o === l, onClick: () => i(l), children: [
        l,
        " ",
        s.get(l)
      ] }, l))
    ] }),
    a.length === 0 && /* @__PURE__ */ u("p", { style: X, children: t ? "No schema was read, so the table rules didn't run." : "No findings." }),
    a.map((l) => /* @__PURE__ */ k("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ k("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ u(Ln, { severity: l.severity }),
        /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600 }, children: l.title }),
        /* @__PURE__ */ u("button", { style: Ie, onClick: () => n(l.node), children: "Show" }),
        /* @__PURE__ */ u("button", { style: Ie, onClick: () => r(l), children: "Ask" })
      ] }),
      /* @__PURE__ */ u("p", { style: { margin: "4px 0 0" }, children: l.detail }),
      /* @__PURE__ */ u("p", { style: { ...X, ...xe, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: l.evidence.join("  ") })
    ] }, l.id))
  ] });
}
const Cd = 560, Fr = 760, R1 = 1100;
function H1(e, t) {
  const n = e >= R1, r = t && e >= Fr ? n ? "220px" : "170px" : null, o = n ? "minmax(320px, 26%)" : e >= Fr ? "260px" : e >= Cd ? "240px" : null;
  return [r, "minmax(0, 1fr)", o].filter(Boolean).join(" ");
}
function W1(e, t, n, r, o) {
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
const B1 = [
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
function Md(e) {
  return Kt(e.replace(/^(module|area|route|job|service|plan|table|agent):(public\.)?/, ""));
}
function At({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ u("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function V1({ link: e, onOpen: t }) {
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
        children: Md(e.node)
      }
    ),
    e.access && /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ u("span", { style: { ...X, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function F1({ node: e, onOpen: t }) {
  return /* @__PURE__ */ u(me, { children: B1.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ u(At, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ u(V1, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function j1({ node: e }) {
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
function Y1({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ u(At, { title: `Not found (${n.length})`, children: /* @__PURE__ */ u("ul", { style: { ...xe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ u("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function G1({ node: e }) {
  const t = e.asks_you ?? [], n = e.leaves_region ?? [];
  return /* @__PURE__ */ k(me, { children: [
    e.description && /* @__PURE__ */ u("p", { style: { margin: "0 0 12px" }, children: e.description }),
    n.length > 0 && /* @__PURE__ */ u(At, { title: "Leaves your home region", children: /* @__PURE__ */ u("p", { style: { margin: 0, color: "var(--danger, #dc2626)" }, children: n.map(Md).join(", ") }) }),
    /* @__PURE__ */ u(At, { title: `Asks you (${t.length})`, children: t.length === 0 ? /* @__PURE__ */ u("p", { style: { ...X, margin: 0 }, children: "No call that leaves work for a person was found." }) : /* @__PURE__ */ u("ul", { style: { ...xe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: t.map((r) => /* @__PURE__ */ u("li", { children: r }, r)) }) })
  ] });
}
function X1({ node: e, onRegion: t }) {
  const [n, r] = Q(e.region ?? ""), [o, i] = Q(null), [s, a] = Q(!1), l = async (d) => {
    a(!0), i(await t(e.id, d)), a(!1);
  }, c = n.trim() === (e.region ?? "");
  return /* @__PURE__ */ k(At, { title: "Region", children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 6 }, children: [
      /* @__PURE__ */ u(jr, { "aria-label": `Region of ${e.name}`, placeholder: "Where it runs, such as US", value: n, onChange: (d) => r(d.target.value), style: { flex: 1, minWidth: 0 } }),
      /* @__PURE__ */ u(ae, { disabled: s || !n.trim() || c, onClick: () => void l(n.trim()), children: "Save" }),
      e.region && /* @__PURE__ */ u(ae, { disabled: s, onClick: () => void l(null), children: "Clear" })
    ] }),
    /* @__PURE__ */ u("p", { style: { ...X, fontSize: 11, margin: "4px 0 0" }, children: "You set this. Agents that use it are checked against your home region." }),
    o && /* @__PURE__ */ u("p", { style: { color: "var(--danger, #dc2626)", margin: "4px 0 0" }, children: o })
  ] });
}
function U1({ risk: e }) {
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
function q1({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ k(At, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ u("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ u("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ k("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ u(Ln, { severity: n.severity }),
      /* @__PURE__ */ u("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function K1({
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
          /* @__PURE__ */ u(ae, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ u(ae, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ k("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ u(q1, { names: t, overlaps: n }),
          e.kind === "agent" && /* @__PURE__ */ u(G1, { node: e }),
          e.kind === "service" && l && /* @__PURE__ */ u(X1, { node: e, onRegion: l }, `${e.id}|${e.region ?? ""}`),
          e.risk && /* @__PURE__ */ u(U1, { risk: e.risk }),
          c ? /* @__PURE__ */ u(Hd, { node: e, onAsk: a }) : /* @__PURE__ */ u(j1, { node: e }),
          !c && /* @__PURE__ */ u(Y1, { node: e }),
          /* @__PURE__ */ u(F1, { node: e, onOpen: o }),
          !c && /* @__PURE__ */ u("p", { style: { ...X, ...xe, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (d = e.evidence) == null ? void 0 : d.join("  ") })
        ] })
      ]
    }
  );
}
const Z1 = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], Q1 = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, J1 = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function e_({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ k("div", { style: J1, "data-testid": e.id, children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ k("p", { style: { ...X, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      Q1[e.status_source]
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
function t_({
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
    /* @__PURE__ */ u("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: Z1.map((s) => {
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
        /* @__PURE__ */ u("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ u(e_, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function n_(e, t, n) {
  return { key: "plans", label: e > 0 ? `Plans ${e}` : "Plans", on: t, title: "Show unfinished plans on the map", onToggle: n };
}
const r_ = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], nt = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, Zo = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, Oa = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function o_({ share: e }) {
  return /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ u("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ u("span", { style: { minWidth: 32, textAlign: "right" }, children: Gr(e) })
  ] });
}
function i_({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ u(ve, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ u(ve, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ u(ve, { variant: "muted", children: "Untested" }) : null;
}
function s_(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function a_({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
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
    /* @__PURE__ */ u(ae, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ u(ae, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function l_({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = Q("modules"), [c, d] = Q(!0), [h, f] = Q(!1), [p, g] = Q("score"), v = e.coverage !== null, w = le(() => e[a].filter((x) => a === "modules" || !h || !x.ui), [e, a, h]), m = w.filter((x) => x.hot && x.untested), b = le(() => {
    const x = c && m.length > 0 ? m : w;
    if (p === "score") return x;
    const N = p === "cover" ? 1 : -1;
    return [...x].sort((S, C) => N * (S[p] - C[p]));
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
    /* @__PURE__ */ u(a_, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ u(ae, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ u(ae, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ u("span", { style: { width: 8 } }),
      m.length > 0 && /* @__PURE__ */ u(ae, { primary: c, onClick: () => d((x) => !x), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ u(ae, { primary: h, onClick: () => f((x) => !x), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ k("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ k("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ u("thead", { children: /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ u("th", { style: { ...nt, textAlign: "left" }, children: /* @__PURE__ */ k("button", { style: Zo, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          r_.map((x) => /* @__PURE__ */ u("th", { style: nt, children: /* @__PURE__ */ u("button", { style: { ...Zo, color: p === x.key ? "var(--text, inherit)" : Zo.color }, title: x.title, onClick: () => g(x.key), children: x.label }) }, x.key)),
          /* @__PURE__ */ u("th", { style: nt })
        ] }) }),
        /* @__PURE__ */ u("tbody", { children: b.map((x) => /* @__PURE__ */ k("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ k("td", { style: { ...nt, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ u(
              "button",
              {
                onClick: () => r(x.id ?? x.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...Oa, ...xe } : Oa,
                children: Kt(x.path)
              }
            ),
            " ",
            /* @__PURE__ */ u(i_, { row: x })
          ] }),
          /* @__PURE__ */ u("td", { style: nt, children: x.commits }),
          /* @__PURE__ */ u("td", { style: nt, children: x.complexity }),
          /* @__PURE__ */ u("td", { style: nt, children: v ? /* @__PURE__ */ u(o_, { share: x.covered ?? 0 }) : /* @__PURE__ */ u("span", { style: X, children: s_(x, a) }) }),
          /* @__PURE__ */ u("td", { style: nt, children: x.lines }),
          /* @__PURE__ */ u("td", { style: nt, children: /* @__PURE__ */ u("button", { style: Ie, onClick: () => o(x.id ?? x.path), disabled: !t, children: "Ask" }) })
        ] }, x.path)) })
      ] }),
      b.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
function c_({
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
    e.rebuild && !i && /* @__PURE__ */ u(ae, { primary: !0, onClick: a, children: "Rebuild" }),
    /* @__PURE__ */ u(
      Ya,
      {
        width: 270,
        align: "right",
        label: "Model status",
        trigger: (c) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-chip", "data-testid": "status-chip", ...c, children: [
          /* @__PURE__ */ u("span", { className: "sm-dot", "data-tone": i ? "muted" : e.tone }),
          l,
          /* @__PURE__ */ u(Ga, {})
        ] }),
        children: () => /* @__PURE__ */ k("div", { style: { padding: 8 }, children: [
          /* @__PURE__ */ u("div", { style: { fontWeight: 600, marginBottom: 2, overflowWrap: "anywhere" }, children: t ?? e.detail }),
          /* @__PURE__ */ k("div", { style: { ...X, marginBottom: 10 }, children: [
            n ? /* @__PURE__ */ u("span", { className: "sm-mono", children: n.slice(0, 7) }) : "This folder",
            ", built ",
            Wd(r, Date.now() / 1e3)
          ] }),
          o && /* @__PURE__ */ k("div", { style: { marginBottom: 10 }, "data-testid": "build-read", children: [
            Bd(o).map((c) => /* @__PURE__ */ u("div", { children: c }, c)),
            o.unread.map((c) => /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
              "Not read: ",
              c.what,
              c.where && /* @__PURE__ */ u("div", { className: "sm-mono", style: { ...X, overflowWrap: "anywhere" }, children: c.where })
            ] }, c.what))
          ] }),
          e.label !== "Folder missing" && /* @__PURE__ */ u(ae, { primary: e.rebuild, disabled: i, onClick: a, autoFocus: !0, children: i ? "Rebuilding" : "Rebuild" })
        ] })
      }
    )
  ] });
}
const br = 10;
function ki(e, t) {
  const n = (e.bands ?? []).filter((s) => s.members.length > 0), r = new Ar.graphlib.Graph({ multigraph: !0, compound: n.length > 0 });
  r.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  for (const s of e.cards) r.setNode(s.id, { width: bn, height: wn });
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
    o.set(s.id, { x: a.x - bn / 2, y: a.y - wn / 2 });
  }
  const i = n.map((s) => {
    const a = s.members.map((f) => o.get(f)).filter((f) => !!f), l = Math.min(...a.map((f) => f.x)) - br, c = Math.min(...a.map((f) => f.y)) - br, d = Math.max(...a.map((f) => f.x + bn)) + br, h = Math.max(...a.map((f) => f.y + wn)) + br;
    return { ...s, x: l, y: c, width: d - l, height: h - c };
  });
  return { places: o, bands: i };
}
function d_(e) {
  const t = [
    ...[...e.places.values()].map((s) => ({ x: s.x, y: s.y, width: bn, height: wn })),
    ...e.bands
  ];
  if (t.length === 0) return { width: 0, height: 0 };
  const n = Math.min(...t.map((s) => s.x)), r = Math.min(...t.map((s) => s.y)), o = Math.max(...t.map((s) => s.x + s.width)), i = Math.max(...t.map((s) => s.y + s.height));
  return { width: o - n, height: i - r };
}
const u_ = 1.15;
function Pa(e, t, n) {
  const r = d_(e);
  return Math.min(1, t / Math.max(r.width, 1), n / Math.max(r.height, 1));
}
function f_(e, t, n) {
  const r = ki(e, "LR");
  if (t <= 0 || n <= 0) return { ...r, direction: "LR" };
  const o = ki(e, "TB");
  return Pa(o, t, n) > Pa(r, t, n) * u_ ? { ...o, direction: "TB" } : { ...r, direction: "LR" };
}
const Ei = bn, Si = wn, Da = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  agent: "agent",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, h_ = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)",
  empty: "var(--warn-text, #b45309)"
}, p_ = { empty: "no jobs" }, Cr = {
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
}, g_ = {
  home: "var(--ok, #15803d)",
  away: "var(--danger, #dc2626)",
  unknown: "var(--muted, #71717a)"
}, Mr = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, m_ = he(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i, down: s } = t, a = n.status === "proposed", l = n.kind === "plan" || a || n.kind === "agent" && n.status !== void 0, c = n.kind === "service", d = o.length > 1, h = a ? "var(--accent, #2563eb)" : l ? h_[n.status ?? "unclear"] : d ? "var(--warn-text, #b45309)" : void 0, f = r ? "var(--accent, #2563eb)" : h ?? (n.strong ? "var(--text, #18181b)" : "var(--border-strong, #a1a1aa)"), p = r || d ? 2 : n.strong ? 1.5 : 1;
  return /* @__PURE__ */ k(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: Ei,
        height: Si,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 12px",
        borderRadius: c ? 29 : 8,
        background: n.kind === "group" ? "var(--bg-hover, #f4f4f5)" : "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${p}px ${l || c ? "dashed" : "solid"} ${f}`,
        boxShadow: [i ? `inset 5px 0 0 ${Mr[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ u(ft, { type: "target", position: s ? U.Top : U.Left, isConnectable: !1 }),
        /* @__PURE__ */ u(ft, { type: "source", position: s ? U.Bottom : U.Right, isConnectable: !1 }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          l && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: h, flexShrink: 0 }, children: p_[n.status ?? ""] ?? n.status }),
          i && /* @__PURE__ */ u("span", { style: { fontSize: 11, color: Mr[i].color, flexShrink: 0 }, children: Mr[i].label })
        ] }),
        /* @__PURE__ */ k("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ u("span", { style: { ...X, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [Da[n.kind] && n.kind !== "area" && n.kind !== "plan" ? Da[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ k("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: d ? 600 : 400, color: d ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] }),
          o.length === 0 && n.badge && /* @__PURE__ */ u("span", { style: { fontSize: 11, flexShrink: 0, color: "var(--info, #2563eb)" }, children: n.badge })
        ] })
      ]
    }
  );
}), y_ = he(function({ data: t }) {
  const n = g_[t.band.tone];
  return /* @__PURE__ */ u("div", { "data-testid": t.band.id, style: { width: "100%", height: "100%", boxSizing: "border-box", borderRadius: 14, border: `1.5px dashed ${n}`, pointerEvents: "none" }, children: /* @__PURE__ */ u("span", { style: { position: "absolute", top: -9, left: 12, padding: "0 4px", fontSize: 11, fontWeight: 600, lineHeight: "16px", color: n, background: "var(--bg, #fff)" }, children: t.band.label }) });
}), w_ = { card: m_, band: y_ };
function b_(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function v_(e) {
  const t = e.leaves ? Cr.leaves_region : Cr[e.kind] ?? Cr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: jt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: b_(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function x_({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(Cr).filter(([i]) => e.has(i)), o = ts();
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
        maxWidth: Math.max(120, o - (o < es ? 130 : 290)),
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
function __({ system: e, focus: t, agents: n, onFocus: r }) {
  const o = Xd(e, t, n);
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
function k_({
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
  const { mode: p } = Ba(), g = ts(), v = f1(), w = g >= es, m = c ? null : t, b = le(
    () => a ? Vd(e, a, n) : Fd(e, m, n, r, c),
    [e, a, m, n, r, c]
  ), y = c && !a, x = xd(g, v, o ? wi : 0), N = y ? x.width : 0, S = y ? x.height : 0, C = le(() => {
    if (y) return f_(b, N, S);
    const E = l === "top-down" ? "TB" : "LR";
    return { ...ki(b, E), direction: E };
  }, [b, l, y, N, S]), T = C.direction === "TB", A = C.places, B = le(() => jd(i), [i]), z = s == null ? void 0 : s.by_node, W = le(
    () => [
      ...C.bands.map((E) => ({
        id: E.id,
        type: "band",
        position: { x: E.x, y: E.y },
        width: E.width,
        height: E.height,
        zIndex: -1,
        selectable: !1,
        draggable: !1,
        focusable: !1,
        data: { band: E }
      })),
      ...b.cards.map((E) => ({
        id: E.id,
        type: "card",
        position: A.get(E.id) ?? { x: 0, y: 0 },
        width: Ei,
        height: Si,
        data: { card: E, focused: E.id === t, work: z ? Gd(E.id, z) : [], band: Yd(B.get(E.id)), down: T }
      }))
    ],
    [b, C, A, t, B, z, T]
  ), P = le(() => b.lines.map(v_), [b]), _ = le(
    () => [
      ...b.cards.map((E) => ({ ...A.get(E.id) ?? { x: 0, y: 0 }, width: Ei, height: Si })),
      ...C.bands.map((E) => ({ x: E.x, y: E.y, width: E.width, height: E.height }))
    ],
    [b, A, C]
  );
  _d(_, o ? wi : 0, c && !a ? "top" : "center");
  const I = le(() => new Set(b.lines.map((E) => E.leaves ? "leaves_region" : E.kind)), [b]), M = (E) => {
    if (!E.startsWith("band:"))
      if (E === Ud) f();
      else {
        if (E !== qd && E !== Kd && E === t) return;
        h(E);
      }
  };
  return /* @__PURE__ */ k(
    hd,
    {
      nodes: W,
      edges: P,
      nodeTypes: w_,
      colorMode: p,
      minZoom: Ji,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (E, O) => M(O.id),
      children: [
        /* @__PURE__ */ u(gd, { gap: 24, size: 1 }),
        /* @__PURE__ */ u(yd, { showInteractive: !1 }),
        w && /* @__PURE__ */ u(bd, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ u($t, { position: "top-left", children: /* @__PURE__ */ k(kd, { children: [
          /* @__PURE__ */ u(__, { system: e, focus: t, agents: c && !a, onFocus: h }),
          d
        ] }) }),
        /* @__PURE__ */ u($t, { position: "bottom-center", children: /* @__PURE__ */ u(x_, { kinds: I, top: (b.hidden ?? 0) > 0, risk: i !== null }) })
      ]
    }
  );
}
function E_(e) {
  return /* @__PURE__ */ u("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ u(Qi, { children: /* @__PURE__ */ u(k_, { ...e, agents: e.agents ?? !1 }) }) });
}
const S_ = 16, N_ = 72, Id = "system-map-view";
function Ra(e) {
  return e.count === void 0 ? void 0 : `${e.count} ${e.counts ?? ""}`.trim();
}
function Qo({ item: e }) {
  return /* @__PURE__ */ k(me, { children: [
    e.label,
    e.count !== void 0 && /* @__PURE__ */ u("span", { className: "sm-count", children: e.count })
  ] });
}
function C_({ items: e, value: t, onChange: n, label: r }) {
  const o = oe(null), i = oe(null), s = oe(null), [a, l] = Q(Number.POSITIVE_INFINITY), [c, d] = Q([]), h = e.map((b) => `${b.label}${b.count ?? ""}`).join("|");
  Mi(() => {
    const b = () => {
      var x, N;
      l(((x = o.current) == null ? void 0 : x.clientWidth) ?? 0), d([...((N = i.current) == null ? void 0 : N.children) ?? []].map((S) => S.offsetWidth));
    };
    b();
    const y = new ResizeObserver(b);
    return o.current && y.observe(o.current), () => y.disconnect();
  }, [h]);
  const f = e.findIndex((b) => b.value === t), p = le(
    () => c.length === e.length ? W1(c, a, N_, f, S_) : { visible: e.map((b, y) => y), hidden: [] },
    [c, a, f, e]
  ), g = p.visible.map((b) => e[b]), v = p.hidden.map((b) => e[b]), w = (b) => {
    n(b), requestAnimationFrame(() => {
      var y, x;
      return (x = (y = s.current) == null ? void 0 : y.querySelector('[aria-selected="true"]')) == null ? void 0 : x.focus();
    });
  }, m = (b) => {
    const y = g.findIndex((C) => C.value === t), x = g.length, S = { ArrowRight: (y + 1) % x, ArrowLeft: (y - 1 + x) % x, Home: 0, End: x - 1 }[b.key];
    S !== void 0 && (b.preventDefault(), w(g[S].value));
  };
  return /* @__PURE__ */ k("div", { ref: o, className: "sm-bar", style: { position: "relative", flex: "none" }, children: [
    /* @__PURE__ */ u("div", { ref: i, className: "sm-tab-probe", "aria-hidden": "true", children: e.map((b) => /* @__PURE__ */ u("span", { className: "sm-tab", children: /* @__PURE__ */ u(Qo, { item: b }) }, b.value)) }),
    /* @__PURE__ */ u("div", { ref: s, className: "sm-tabs", role: "tablist", "aria-label": r, onKeyDown: m, children: g.map((b) => /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        role: "tab",
        id: `system-map-tab-${b.value}`,
        className: "sm-plain sm-tab",
        "aria-selected": b.value === t,
        "aria-controls": Id,
        tabIndex: b.value === t ? 0 : -1,
        title: Ra(b),
        onClick: () => n(b.value),
        children: /* @__PURE__ */ u(Qo, { item: b })
      },
      b.value
    )) }),
    v.length > 0 && /* @__PURE__ */ u(
      Ya,
      {
        width: 200,
        popup: "menu",
        label: "More views",
        trigger: (b) => /* @__PURE__ */ k("button", { type: "button", className: "sm-plain sm-tab", ...b, children: [
          "More ",
          /* @__PURE__ */ u(Ga, {})
        ] }),
        children: (b) => /* @__PURE__ */ u(Zd, { label: "More views", children: v.map((y) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "sm-plain sm-row",
            title: Ra(y),
            onClick: () => {
              b(), w(y.value);
            },
            children: /* @__PURE__ */ u(Qo, { item: y })
          },
          y.value
        )) })
      }
    )
  ] });
}
const $d = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, M_ = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, I_ = { ...xe, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, Jo = 6;
function $_(e) {
  return Kt(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function qe({ title: e, children: t }) {
  return /* @__PURE__ */ k("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ u("span", { style: { ...X, fontSize: 12 }, children: e }),
    t
  ] });
}
function dt({ ids: e, onShow: t }) {
  return /* @__PURE__ */ u("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ u("button", { style: M_, onClick: () => t(n), children: $_(n) }, n)) });
}
function Ha({ files: e }) {
  return /* @__PURE__ */ k("ul", { style: I_, children: [
    e.slice(0, Jo).map((t) => /* @__PURE__ */ u("li", { children: t }, t)),
    e.length > Jo && /* @__PURE__ */ k("li", { style: X, children: [
      "and ",
      e.length - Jo,
      " more"
    ] })
  ] });
}
const Ad = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function A_({ row: e, canAsk: t, onAsk: n }) {
  const r = Ad[e.merge];
  return /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ u(Ln, { severity: e.severity }),
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
function T_({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = Ad[e.merge];
  return /* @__PURE__ */ k("div", { style: $d, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ k("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ u(Ln, { severity: e.severity }),
      /* @__PURE__ */ u("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ u("button", { style: Ie, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ u(qe, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ u(Ha, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ u(qe, { title: "Both change these tables", children: /* @__PURE__ */ u(dt, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ u(qe, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ u(dt, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ u(qe, { title: "Both change code that uses these tables", children: /* @__PURE__ */ u(dt, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ u(qe, { title: "Also share", children: /* @__PURE__ */ u(Ha, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ u(qe, { title: "Same modules", children: /* @__PURE__ */ u(dt, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ u("p", { style: { ...X, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function L_({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ k("div", { style: $d, "data-testid": "worktree", children: [
    /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ u("p", { style: { ...X, ...xe, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.display_path ?? e.path }),
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
function z_({
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
      a > 0 && /* @__PURE__ */ u("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((f) => f.severity === "high" || f.severity === "medium").map((f) => /* @__PURE__ */ u(T_, { row: f, canAsk: n, onShow: r, onAsk: o }, `${f.a}|${f.b}`)) }),
      /* @__PURE__ */ k("section", { children: [
        /* @__PURE__ */ u("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ u("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((f) => /* @__PURE__ */ u(L_, { tree: f, onShow: r }, f.path)) }),
        c.length === 0 && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ k("p", { style: { ...X, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ k("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ u("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((f) => f.severity === "low" || f.severity === "info").map((f) => /* @__PURE__ */ u(A_, { row: f, canAsk: n, onAsk: o }, `${f.a}|${f.b}`))
      ] })
    ] })
  ] });
}
const Wa = 12, O_ = 2e4, P_ = 8e3, D_ = 4e3, R_ = [
  { key: "names", label: "Names" },
  { key: "keys", label: "Keys" },
  { key: "columns", label: "Columns" }
], ei = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, H_ = [
  { value: "map", label: "Map" },
  { value: "data", label: "Data model" },
  { value: "plan", label: "Plan", counts: "unfinished plans" },
  { value: "risk", label: "Risk", counts: "hot and untested modules" },
  { value: "worktrees", label: "Worktrees", counts: "worktree collisions" },
  { value: "findings", label: "Findings", counts: "findings" },
  { value: "agents", label: "Agents", counts: "agents" },
  { value: "explore", label: "Explore", counts: "draft proposals" }
];
function W_(e, t) {
  const n = Va(), [r, o] = Q(null), [i, s] = Q(null), [a, l] = Q(!1), [c, d] = Q(null), h = (r == null ? void 0 : r.repoKey) === t ? r.slot : null, f = $e(async () => {
    const g = await n.post("/api/chat/slots", { name: gu(t) });
    return await n.post(`/api/chat/slots/${encodeURIComponent(g.key)}/project`, { project: e }), o({ repoKey: t, slot: g.key }), g.key;
  }, [n, e, t]);
  de(() => {
    if (!e) return;
    let g = !0;
    return d(null), (async () => wu(localStorage, t) ? !0 : bu(await n.get("/api/chat/slots").catch(() => []), t))().then(async (w) => {
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
        vu(localStorage, t), await n.post("/api/chat?ws=1", { message: g, slot: w, agent: "" });
      })().catch((w) => d(xt(w, "send that to the design chat"))).finally(() => l(!1));
    },
    [n, f, t, h]
  );
  return { slot: h, error: c, send: p, opening: a, canAsk: e !== null, startable: i === t && h === null };
}
function B_({ disabled: e, onSend: t }) {
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
function V_() {
  const e = oe(null), [t, n] = Q(void 0), [r, o] = Q(1400);
  return Mi(() => {
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
function vr({ children: e, onDismiss: t }) {
  return /* @__PURE__ */ k("div", { className: "sm-notice", role: "alert", "data-testid": "notice", children: [
    /* @__PURE__ */ u("span", { style: { flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: e }),
    t && /* @__PURE__ */ u(ae, { onClick: t, children: "Dismiss" })
  ] });
}
function F_({ read: e }) {
  const t = (e == null ? void 0 : e.unread) ?? [];
  return /* @__PURE__ */ u(
    Fa,
    {
      testId: "no-tables",
      icon: /* @__PURE__ */ u(Td, {}),
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
function Td() {
  return /* @__PURE__ */ k("svg", { width: "40", height: "40", viewBox: "0 0 64 64", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ u("rect", { x: "10", y: "10", width: "44", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "34", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "10", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "26", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ u("rect", { x: "42", y: "42", width: "12", height: "12", rx: "3" })
  ] });
}
function j_({ onBuilt: e }) {
  const [t, n] = Q(!1);
  return /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u(Ni, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(
      Fa,
      {
        testId: "first-run",
        icon: /* @__PURE__ */ u(Td, {}),
        title: "See your system in one place",
        subtitle: "Add a project to map its code, data model, risk and plans.",
        action: /* @__PURE__ */ u(ae, { primary: !0, onClick: () => n(!0), children: "Add project" })
      }
    ) }),
    /* @__PURE__ */ u(Jd, { open: t, projects: [], onClose: () => n(!1), onBuilt: e })
  ] });
}
function nk() {
  const { repos: e, active: t, loaded: n, choose: r, reload: o } = Qd();
  return n ? t ? /* @__PURE__ */ u(Y_, { repo: t, projects: e, choose: r, reload: o }, t) : /* @__PURE__ */ u(j_, { onBuilt: r }) : /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ u(Ni, { title: "System Map" }),
    /* @__PURE__ */ u("div", { className: "sm-page", children: /* @__PURE__ */ u(ti, { rows: 6 }) })
  ] });
}
function Y_({
  repo: e,
  projects: t,
  choose: n,
  reload: r
}) {
  var os, is;
  const o = Va(), { overview: i, error: s, refresh: a } = eu(e), l = i == null ? void 0 : i.manifest.version, [c, d] = Q(0), h = l ? `${l}:${c}` : void 0, f = Ot("/graph", e, h), p = Ot("/system", e, h), g = Ot("/plan", e, h), v = Ot("/findings", e, h), w = Ot("/risk", e, h), m = Ot("/agents", e, h), b = m.value, y = ((b == null ? void 0 : b.agents.length) ?? 0) > 0, x = f.value, N = p.value, S = g.value, C = v.value, T = w.value, A = le(() => (S == null ? void 0 : S.plans) ?? [], [S]), B = le(() => (C == null ? void 0 : C.findings) ?? [], [C]), z = as("/worktrees", e, O_), W = z.value, P = as("/explore", e, P_), [_, I] = Q("whatif"), [M, E] = Q(null), [O, $] = Q(0), L = tu(M, e, O), [D, V] = Q(!1), [j, G] = Q(null), [Y, ne] = Q(() => nu(localStorage, e)), [Z, R] = Q(null), [F, q] = Q(null), [J, K] = Q(!0), [ee, te] = Q(!1), [re, ie] = Q(!0), [ce, ke] = Q(!1), Ee = oe(null), [Te, Le] = Q(!1), [ht, Ge] = Q(null), [Qe, Se] = Q(null), [ze, _e] = Q(null), [Xe, Zt] = Q("names"), [Je, co] = Q(() => ru(localStorage)), Qt = oe(null), Jt = oe(!1), [uo, Wn] = Q(!1), [en, tn] = Q(null), { ref: fo, height: ho, width: Lt } = V_(), nn = (i == null ? void 0 : i.freshness.missing) === !0, ge = W_(i && !nn ? i.manifest.repo : null, e), et = $e(
    (H) => {
      ou(localStorage, e, H), ne(H);
    },
    [e]
  );
  de(() => {
    var H;
    Jt.current && ((H = Qt.current) == null || H.focus()), Jt.current = !1;
  }, [Je]), de(() => {
    if (!en) return;
    const H = window.setTimeout(() => tn(null), D_);
    return () => window.clearTimeout(H);
  }, [en]);
  const Bn = Y === "map" ? F && !/^(area|group):/.test(F) ? F : null : Y === "data" ? Z : null, pt = D && (L != null && L.diff.added.some((H) => H.id === Bn)) ? null : Bn, zt = iu(pt, e, h), Vn = le(() => {
    const H = /* @__PURE__ */ new Map();
    for (const ue of B)
      ue.severity !== "info" && H.set(ue.node, (H.get(ue.node) ?? 0) + 1);
    return H;
  }, [B]), Fn = le(() => su(W), [W]), jn = A.filter((H) => H.status === "planned" || H.status === "partial").length, po = ((W == null ? void 0 : W.counts.high) ?? 0) + ((W == null ? void 0 : W.counts.medium) ?? 0), go = (T == null ? void 0 : T.modules.filter((H) => H.hot && H.untested).length) ?? 0, mo = ((os = P.value) == null ? void 0 : os.proposals.filter((H) => H.status === "draft").length) ?? 0, yo = { findings: B.length, plan: jn, risk: go, worktrees: po, explore: mo, agents: b == null ? void 0 : b.agents.length }, Pe = D ? L : null, rn = le(() => N ? au(N, Pe) : null, [N, Pe]), on = le(() => {
    const H = (Pe == null ? void 0 : Pe.graph) ?? x;
    return H && (j == null ? void 0 : j.level) === "data" ? lu(H, j.resolved) : H;
  }, [x, Pe, j]), wo = async () => {
    Wn(!0), tn(null), _e(null);
    try {
      const H = await o.post(`${yt}/build`, { repo: e });
      await a(), await r(), tn(H.unchanged ? "No changes" : "Rebuilt");
    } catch (H) {
      _e(xt(H, "rebuild this project"));
    } finally {
      Wn(!1);
    }
  }, sn = async (H, ue) => {
    _e(null);
    try {
      await ue();
    } catch (De) {
      _e(xt(De, H));
    }
  }, bo = () => {
    zt && ge.send(`Use the system-map tools. Look at ${zt.id} and tell me what to watch out for.`);
  }, Yn = (H) => {
    ge.send(`Use the system-map tools. Check finding ${H.id} on ${H.node}, read its evidence, and propose a fix.`);
  }, Gn = (H) => {
    ge.send(`Use the system-map tools. Look at ${H.id}, say what is left to build, and propose the next step.`);
  }, Xn = (H) => {
    ge.send(`Use the system-map tools. Look at ${H} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, Un = (H) => {
    ge.send(`Use the system-map tools. Read ${H.id} with the \`agents\` tool. Say what it does on its own, where it waits for a person, and what to watch out for.`);
  }, vo = (H) => {
    ge.send(`Use the system-map tools. Worktrees ${H.a} and ${H.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, xo = () => {
    ge.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, _o = async () => {
    Se(null);
    try {
      await o.post(`${yt}/coverage`, { repo: e }), d((H) => H + 1);
    } catch (H) {
      Se(xt(H, "load the coverage report"));
    }
  }, ko = (H) => {
    V(!0), G(null), q(null);
    const ue = [...(L == null ? void 0 : L.diff.added) ?? [], ...(L == null ? void 0 : L.diff.changed) ?? []].find((De) => De.id.startsWith("table:"));
    R(H === "data" ? (ue == null ? void 0 : ue.id) ?? null : null), et(H);
  }, Eo = (H, ue) => sn("change this proposal", async () => {
    await o.post(`${yt}/proposal-status`, { repo: e, id: H, status: ue }), $((De) => De + 1), await P.refresh();
  }), So = (H, ue) => sn("delete this", async () => {
    await o.post(`${yt}/intent-delete`, { repo: e, kind: H, id: ue }), H === "proposals" && (E(null), V(!1)), await P.refresh();
  }), qn = (H) => {
    ln({ on: !1, focus: null, before: null }), G(H), te(H.overlays.risk), ie(H.overlays.worktrees), K(H.overlays.plans), E(H.proposal), V(H.proposal !== null), q(null), R(null), et(H.level);
  }, No = () => {
    V(!1), G(null), R(null), q(null);
  }, Co = (H, ue) => sn("change this plan", async () => {
    await o.post(`${yt}/plan-status`, { repo: e, id: H, status: ue }), d((De) => De + 1);
  }), Mo = async (H) => {
    Le(!0), Ge(null);
    try {
      return await o.post(`${yt}/agents/settings`, { repo: e, settings: H }), await a(), d((ue) => ue + 1), !0;
    } catch (ue) {
      return Ge(xt(ue, "save the agent settings")), !1;
    } finally {
      Le(!1);
    }
  }, Io = async (H, ue) => {
    try {
      return await o.post(`${yt}/regions`, { repo: e, id: H, region: ue }), d((De) => De + 1), null;
    } catch (De) {
      return xt(De, "save the region");
    }
  }, an = (H) => {
    et("data"), R(H);
  }, gt = (H) => {
    et("map"), q(H);
  }, ln = (H) => {
    ke(H.on), q(H.focus), Ee.current = H.before;
  }, cn = (H) => {
    G(null), et("map"), ln(Mu({ on: ce, focus: F, before: Ee.current }, H, Y === "map"));
  }, Kn = () => {
    const H = Cu({ on: ce, focus: F, before: Ee.current });
    H.closeSavedView && G(null), ln(H);
  }, $o = (H) => {
    Y === "data" && H.startsWith("table:") ? R(H) : gt(H);
  }, Zn = (H) => {
    H.startsWith("table:") ? an(H) : gt(H);
  }, Qn = () => {
    Jt.current = !0, yu(localStorage, !Je), co(!Je);
  }, Jn = mu(Y), er = Jn && Je, tr = Y === "map" ? "modules" : "tables", nr = Jn && !Je && Lt >= Fr ? /* @__PURE__ */ k("button", { ref: Qt, type: "button", className: "sm-plain sm-layers sm-show-list", onClick: Qn, children: [
    "Show ",
    tr
  ] }) : null, rr = (Pe == null ? void 0 : Pe.title) ?? (j == null ? void 0 : j.title), mt = rr ? /* @__PURE__ */ u(g1, { title: rr, onBack: No }) : null, Ao = H_.map((H) => ({ ...H, count: yo[H.value] || void 0 })), Ne = i == null ? void 0 : i.freshness, or = Ne ? cu(du(Ne), Ne.commits_behind, Ne.ref) : null, ir = ((is = Ne == null ? void 0 : Ne.changed_inputs) == null ? void 0 : is.length) ?? 0, dn = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      nr,
      /* @__PURE__ */ u(
        p1,
        {
          layers: [
            n_(jn, J, () => K((H) => !H)),
            { key: "risk", label: "Risk", on: ee, title: "Mark hot and untested code on the map", onToggle: () => te((H) => !H) },
            { key: "work", label: "Worktrees", on: re, title: "Show what each worktree is changing", onToggle: () => ie((H) => !H) },
            {
              key: "agents",
              label: "Agents",
              on: ce && y,
              disabled: !y,
              title: y ? "Show the agents: what starts each one, who it hands work to, and the models it uses" : "No agents yet. Point System Map at them in the Agents tab.",
              onToggle: Kn
            }
          ]
        }
      )
    ] }),
    mt
  ] }), To = /* @__PURE__ */ k(me, { children: [
    /* @__PURE__ */ k("div", { className: "sm-tool-row", children: [
      nr,
      /* @__PURE__ */ u(
        Rd,
        {
          ariaLabel: "How much of each table to show",
          layoutId: "system-map-density",
          collapse: !1,
          segments: R_,
          value: Xe,
          onChange: (H) => Zt(H)
        }
      )
    ] }),
    mt
  ] }), sr = {
    map: rn !== null,
    data: !!on,
    plan: S !== null,
    risk: T !== null,
    worktrees: W !== null,
    findings: C !== null,
    agents: b !== null,
    explore: P.value !== null
  }, un = {
    map: p.failed,
    data: f.failed,
    plan: g.failed,
    risk: w.failed,
    worktrees: z.failed,
    findings: v.failed,
    agents: m.failed,
    explore: P.failed
  }, Ld = () => {
    d((H) => H + 1), z.refresh(), P.refresh();
  }, rs = uu({ projects: t, activeKey: e, onPick: n, onReload: () => void r() }), zd = /* @__PURE__ */ k("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }, children: [
    /* @__PURE__ */ u("span", { style: { whiteSpace: "nowrap" }, children: "System Map" }),
    /* @__PURE__ */ u("span", { "aria-hidden": "true", style: { ...X, fontWeight: 400 }, children: "/" }),
    rs.menu
  ] });
  return /* @__PURE__ */ k(me, { children: [
    rs.dialogs,
    /* @__PURE__ */ u(
      Ni,
      {
        title: zd,
        actions: i && or ? /* @__PURE__ */ u(
          c_,
          {
            status: or,
            detail: Ne != null && Ne.stale ? `${ir} schema ${ir === 1 ? "file" : "files"} changed on ${Ne.ref}` : void 0,
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
    /* @__PURE__ */ k("div", { ref: fo, className: "sm-page", style: { height: ho, display: "flex", flexDirection: "column", gap: Wa, minHeight: 0 }, children: [
      s && !i && /* @__PURE__ */ k(vr, { children: [
        s,
        " ",
        /* @__PURE__ */ u(ae, { onClick: () => void a(), children: "Try again" })
      ] }),
      !i && !s && /* @__PURE__ */ u(ti, { rows: 6 }),
      ze && /* @__PURE__ */ u(vr, { onDismiss: () => _e(null), children: ze }),
      nn && i && /* @__PURE__ */ k(vr, { children: [
        "The folder for this project is gone: ",
        /* @__PURE__ */ u("span", { className: "sm-mono", children: i.manifest.repo }),
        ". You can still read the last model. To go on, move the folder back, or remove the project from the project menu."
      ] }),
      i && /* @__PURE__ */ k(me, { children: [
        /* @__PURE__ */ u(C_, { items: Ao, value: Y, onChange: et, label: "System Map views" }),
        /* @__PURE__ */ k(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: Wa,
              gridTemplateColumns: H1(Lt, er),
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              er && Lt >= Fr && /* @__PURE__ */ k(Lo, { style: ei, "data-testid": "side-list", children: [
                /* @__PURE__ */ k("div", { className: "sm-list-head", children: [
                  /* @__PURE__ */ u(ss, { children: Y === "map" ? "Modules" : "Tables" }),
                  /* @__PURE__ */ u("button", { ref: Qt, type: "button", className: "sm-plain sm-hide-list", "aria-label": `Hide ${tr}`, onClick: Qn, children: "Hide" })
                ] }),
                Y === "map" ? /* @__PURE__ */ u(fu, { nodes: (N == null ? void 0 : N.nodes) ?? [], focus: F, onSelect: gt }) : /* @__PURE__ */ u(hu, { tables: i.tables, selected: Z, flagged: Vn, working: Fn, onSelect: an })
              ] }),
              /* @__PURE__ */ k(
                Lo,
                {
                  style: { ...ei, padding: 0, position: "relative" },
                  "data-testid": "canvas",
                  id: Id,
                  role: "tabpanel",
                  "aria-labelledby": `system-map-tab-${Y}`,
                  children: [
                    !sr[Y] && !un[Y] && /* @__PURE__ */ u(ti, { rows: 6 }),
                    !sr[Y] && un[Y] && /* @__PURE__ */ u("div", { style: { padding: 12 }, children: /* @__PURE__ */ k(vr, { children: [
                      "Couldn't load this view. ",
                      /* @__PURE__ */ u(ae, { onClick: Ld, children: "Try again" })
                    ] }) }),
                    Y === "map" && rn && /* @__PURE__ */ u(
                      E_,
                      {
                        system: rn,
                        focus: F,
                        tables: i.manifest.counts.tables,
                        showPlans: J,
                        inspecting: pt !== null,
                        risk: ee ? T : null,
                        worktrees: re ? W : null,
                        only: (j == null ? void 0 : j.level) === "map" ? j.resolved : null,
                        layout: (j == null ? void 0 : j.layout) ?? "left-right",
                        agents: ce && y,
                        tools: dn,
                        onFocus: (H) => {
                          G(null), q(H);
                        },
                        onOpenTables: () => et("data")
                      }
                    ),
                    Y === "data" && i.tables.length === 0 && !D && /* @__PURE__ */ u(F_, { read: i.manifest.read }),
                    Y === "data" && on && (i.tables.length > 0 || D) && /* @__PURE__ */ u(E1, { graph: on, selected: Z, flagged: Vn, working: Fn, density: Xe, tools: To, onSelect: R }),
                    Y === "explore" && P.value && /* @__PURE__ */ u(
                      O1,
                      {
                        data: P.value,
                        proposal: L,
                        shownProposal: D ? M : null,
                        canAsk: ge.canAsk,
                        tab: _,
                        onTab: I,
                        onSend: ge.send,
                        onOpenProposal: E,
                        onDrawProposal: ko,
                        onStatus: (H, ue) => void Eo(H, ue),
                        onDelete: (H, ue) => void So(H, ue),
                        onOpenView: qn,
                        onNode: Zn
                      }
                    ),
                    Y === "plan" && S && /* @__PURE__ */ u(t_, { plans: A, onShow: gt, onAsk: Gn, onStatus: (H, ue) => void Co(H, ue) }),
                    Y === "risk" && T && /* @__PURE__ */ u(
                      l_,
                      {
                        risk: T,
                        canAsk: ge.canAsk,
                        error: Qe,
                        onShow: gt,
                        onAsk: Xn,
                        onLoad: () => void _o(),
                        onRun: xo
                      }
                    ),
                    Y === "worktrees" && W && /* @__PURE__ */ u(z_, { state: W, checkedAt: z.checkedAt, canAsk: ge.canAsk, onShow: Zn, onAsk: vo }),
                    Y === "findings" && C && /* @__PURE__ */ u(
                      D1,
                      {
                        findings: B,
                        noSchema: i.tables.length === 0,
                        onShow: (H) => H.startsWith("agent:") ? cn(H) : an(H),
                        onAsk: Yn
                      }
                    ),
                    Y === "agents" && b && /* @__PURE__ */ u(Hu, { state: b, canAsk: ge.canAsk, saving: Te, error: ht, onShow: cn, onAsk: Un, onSave: Mo }),
                    zt && pt && /* @__PURE__ */ u(
                      K1,
                      {
                        node: zt,
                        work: (W == null ? void 0 : W.by_node[pt]) ?? [],
                        overlaps: pu(pt, W),
                        canAsk: ge.canAsk,
                        onAsk: bo,
                        onAskFinding: Yn,
                        onOpen: (H) => H.startsWith("agent:") ? cn(H) : $o(H),
                        onClose: () => Y === "data" ? R(null) : q(null),
                        onRegion: Io
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ k(Lo, { style: Lt >= Cd ? ei : { display: "none" }, children: [
                /* @__PURE__ */ u(ss, { children: "Design chat" }),
                ge.error && /* @__PURE__ */ u("p", { style: { fontSize: 13 }, children: ge.error }),
                nn && /* @__PURE__ */ u("p", { style: { ...X, fontSize: 13 }, children: "Chat needs this project's folder." }),
                /* @__PURE__ */ k("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: [
                  ge.slot && /* @__PURE__ */ u("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ u(Dd, { slotKey: ge.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }),
                  ge.startable && /* @__PURE__ */ u(B_, { disabled: ge.opening, onSend: ge.send })
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
  nk as default
};
