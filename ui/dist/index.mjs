var jc = Object.defineProperty;
var Gc = (e, t, n) => t in e ? jc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ye = (e, t, n) => Gc(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as p, jsxs as A, Fragment as ke } from "react/jsx-runtime";
import { useTheme as Hs, useAppApi as $o, ChatEmbed as Xc } from "@kirocrew/app-sdk";
import { Btn as de, Input as Bs, Badge as me, PageHeader as Uc, Card as Rn, CardTitle as so } from "@kirocrew/app-sdk/ui";
import Io, { memo as ge, forwardRef as Vs, useState as re, createContext as sr, useCallback as De, useMemo as ae, useContext as Pt, useRef as ie, useEffect as le, useLayoutEffect as Ws } from "react";
import "react-dom";
import { M as J, a as He, A as Me, S as an, s as ln, p as ar, N as qc, b as Kc, c as Zc, r as Qc, d as Jc, w as ed, t as td, G as nd, e as rd, f as od, u as id, g as sd, h as Rt, i as ai, j as ad, k as ld, l as cd, m as dd, n as ud, o as fd, T as hd, q as pd, v as gd, B as Vt } from "./chunks/model-DY_WnPYV.mjs";
function Fs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var md = "\0", ut = "\0", li = "";
let yd = class {
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
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[ut] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = ut, this._children[t] = {}, this._children[ut][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      n = ut;
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
      if (n !== ut)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = ut) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === ut)
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
    var a = Wt(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = wd(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, ci(this._preds[n], t), ci(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? Vr(this._isDirected, arguments[0]) : Wt(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? Vr(this._isDirected, arguments[0]) : Wt(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? Vr(this._isDirected, arguments[0]) : Wt(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], di(this._preds[n], t), di(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function ci(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function di(e, t) {
  --e[t] || delete e[t];
}
function Wt(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + li + i + li + (r === void 0 ? md : r);
}
function wd(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function Vr(e, t) {
  return Wt(e, t.v, t.w, t.name);
}
var Ao = yd, xd = "2.2.4", bd = {
  Graph: Ao,
  version: xd
}, vd = Ao, _d = {
  write: kd,
  read: Nd
};
function kd(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: Ed(e),
    edges: Sd(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function Ed(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function Sd(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function Nd(e) {
  var t = new vd(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var Cd = Md;
function Md(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let $d = class {
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
var Ys = $d, Id = Ys, js = zd, Ad = () => 1;
function zd(e, t, n, r) {
  return Td(
    e,
    String(t),
    n || Ad,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function Td(e, t, n, r) {
  var o = {}, i = new Id(), s, a, l = function(c) {
    var d = c.v !== s ? c.v : c.w, f = o[d], u = n(c), h = a.distance + u;
    if (u < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + u);
    h < f.distance && (f.distance = h, f.predecessor = s, i.decrease(d, h));
  };
  for (e.nodes().forEach(function(c) {
    var d = c === t ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: d }, i.add(c, d);
  }); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY); )
    r(s).forEach(l);
  return o;
}
var Ld = js, Od = Pd;
function Pd(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = Ld(e, o, t, n), r;
  }, {});
}
var Gs = Dd;
function Dd(e) {
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
var Rd = Gs, Hd = Bd;
function Bd(e) {
  return Rd(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var Vd = Fd, Wd = () => 1;
function Fd(e, t, n) {
  return Yd(
    e,
    t || Wd,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function Yd(e, t, n) {
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
        var d = l[i], f = s[c], u = l[c], h = d.distance + f.distance;
        h < u.distance && (u.distance = h, u.predecessor = f.predecessor);
      });
    });
  }), r;
}
function Xs(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new ao();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new ao();
  return r;
}
class ao extends Error {
  constructor() {
    super(...arguments);
  }
}
var Us = Xs;
Xs.CycleException = ao;
var ui = Us, jd = Gd;
function Gd(e) {
  try {
    ui(e);
  } catch (t) {
    if (t instanceof ui.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var qs = Xd;
function Xd(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? Ud : qd, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function Ud(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), Ks(t(i[0]), (s) => o.push([s, !1])));
  }
}
function qd(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), Ks(t(i), (s) => o.push(s)));
  }
}
function Ks(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var Kd = qs, Zd = Qd;
function Qd(e, t) {
  return Kd(e, t, "post");
}
var Jd = qs, eu = tu;
function tu(e, t) {
  return Jd(e, t, "pre");
}
var nu = Ao, ru = Ys, ou = iu;
function iu(e, t) {
  var n = new nu(), r = {}, o = new ru(), i;
  function s(l) {
    var c = l.v === i ? l.w : l.v, d = o.priority(c);
    if (d !== void 0) {
      var f = t(l);
      f < d && (r[c] = i, o.decrease(c, f));
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
var su = {
  components: Cd,
  dijkstra: js,
  dijkstraAll: Od,
  findCycles: Hd,
  floydWarshall: Vd,
  isAcyclic: jd,
  postorder: Zd,
  preorder: eu,
  prim: ou,
  tarjan: Gs,
  topsort: Us
}, fi = bd, Be = {
  Graph: fi.Graph,
  json: _d,
  alg: su,
  version: fi.version
};
let au = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return hi(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && hi(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, lu)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function hi(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function lu(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var cu = au;
let du = Be.Graph, uu = cu;
var fu = pu;
let hu = () => 1;
function pu(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = mu(e, t || hu);
  return gu(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function gu(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      Wr(e, t, n, s);
    for (; s = o.dequeue(); )
      Wr(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(Wr(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function Wr(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, lo(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, lo(t, n, c);
  }), e.removeNode(r.v), i;
}
function mu(e, t) {
  let n = new du(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = yu(o + r + 3).map(() => new uu()), s = r + 1;
  return n.nodes().forEach((a) => {
    lo(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function lo(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function yu(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let Zs = Be.Graph;
var we = {
  addBorderNode: Nu,
  addDummyNode: Qs,
  applyWithChunking: lr,
  asNonCompoundGraph: xu,
  buildLayerMatrix: ku,
  intersectRect: _u,
  mapValues: Tu,
  maxRank: ea,
  normalizeRanks: Eu,
  notime: Iu,
  partition: Mu,
  pick: zu,
  predecessorWeights: vu,
  range: na,
  removeEmptyRanks: Su,
  simplify: wu,
  successorWeights: bu,
  time: $u,
  uniqueId: ta,
  zipObject: zo
};
function Qs(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = ta(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function wu(e) {
  let t = new Zs().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function xu(e) {
  let t = new Zs({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function bu(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return zo(e.nodes(), t);
}
function vu(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return zo(e.nodes(), t);
}
function _u(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function ku(e) {
  let t = na(ea(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function Eu(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = lr(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function Su(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = lr(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function Nu(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), Qs(e, "border", o, t);
}
function Cu(e, t = Js) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const Js = 65535;
function lr(e, t) {
  if (t.length > Js) {
    const n = Cu(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function ea(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return lr(Math.max, n);
}
function Mu(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function $u(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function Iu(e, t) {
  return t();
}
let Au = 0;
function ta(e) {
  var t = ++Au;
  return e + ("" + t);
}
function na(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function zu(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function Tu(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function zo(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let Lu = fu, Ou = we.uniqueId;
var Pu = {
  run: Du,
  undo: Hu
};
function Du(e) {
  (e.graph().acyclicer === "greedy" ? Lu(e, n(e)) : Ru(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, Ou("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function Ru(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function Hu(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let Bu = we;
var Vu = {
  run: Wu,
  undo: Yu
};
function Wu(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => Fu(e, t));
}
function Fu(e, t) {
  let n = t.v, r = e.node(n).rank, o = t.w, i = e.node(o).rank, s = t.name, a = e.edge(t), l = a.labelRank;
  if (i === r + 1) return;
  e.removeEdge(t);
  let c, d, f;
  for (f = 0, ++r; r < i; ++f, ++r)
    a.points = [], d = {
      width: 0,
      height: 0,
      edgeLabel: a,
      edgeObj: t,
      rank: r
    }, c = Bu.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function Yu(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: ju } = we;
var cr = {
  longestPath: Gu,
  slack: Xu
};
function Gu(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = ju(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function Xu(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Uu = Be.Graph, Gn = cr.slack, ra = qu;
function qu(e) {
  var t = new Uu({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; Ku(t, e) < r; )
    o = Zu(t, e), i = t.hasNode(o.v) ? Gn(e, o) : -Gn(e, o), Qu(t, e, i);
  return t;
}
function Ku(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !Gn(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Zu(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = Gn(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Qu(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Ju = ra, pi = cr.slack, ef = cr.longestPath, tf = Be.alg.preorder, nf = Be.alg.postorder, rf = we.simplify, of = _t;
_t.initLowLimValues = Lo;
_t.initCutValues = To;
_t.calcCutValue = oa;
_t.leaveEdge = sa;
_t.enterEdge = aa;
_t.exchangeEdges = la;
function _t(e) {
  e = rf(e), ef(e);
  var t = Ju(e);
  Lo(t), To(t, e);
  for (var n, r; n = sa(t); )
    r = aa(t, e, n), la(t, e, n, r);
}
function To(e, t) {
  var n = nf(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => sf(e, t, r));
}
function sf(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = oa(e, t, n);
}
function oa(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var f = c === i, u = t.edge(l).weight;
      if (a += f ? u : -u, lf(e, n, d)) {
        var h = e.edge(n, d).cutvalue;
        a += f ? -h : h;
      }
    }
  }), a;
}
function Lo(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), ia(e, {}, 1, t);
}
function ia(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = ia(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function sa(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function aa(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === gi(e, e.node(d.v), a) && l !== gi(e, e.node(d.w), a));
  return c.reduce((d, f) => pi(t, f) < pi(t, d) ? f : d);
}
function la(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), Lo(e), To(e, t), af(e, t);
}
function af(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = tf(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function lf(e, t, n) {
  return e.hasEdge(t, n);
}
function gi(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var cf = cr, ca = cf.longestPath, df = ra, uf = of, ff = hf;
function hf(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      mi(e);
      break;
    case "tight-tree":
      gf(e);
      break;
    case "longest-path":
      pf(e);
      break;
    case "none":
      break;
    default:
      mi(e);
  }
}
var pf = ca;
function gf(e) {
  ca(e), df(e);
}
function mi(e) {
  uf(e);
}
var mf = yf;
function yf(e) {
  let t = xf(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = wf(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
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
function wf(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function xf(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let Xn = we;
var bf = {
  run: vf,
  cleanup: Ef
};
function vf(e) {
  let t = Xn.addDummyNode(e, "root", {}, "_root"), n = _f(e), r = Object.values(n), o = Xn.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = kf(e) + 1;
  e.children().forEach((a) => da(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function da(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = Xn.addBorderNode(e, "_bt"), c = Xn.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((f) => {
    da(e, t, n, r, o, i, f);
    let u = e.node(f), h = u.borderTop ? u.borderTop : f, g = u.borderBottom ? u.borderBottom : f, v = u.borderTop ? r : 2 * r, b = h !== g ? 1 : o - i[s] + 1;
    e.setEdge(l, h, {
      weight: v,
      minlen: b,
      nestingEdge: !0
    }), e.setEdge(g, c, {
      weight: v,
      minlen: b,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function _f(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function kf(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function Ef(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let Sf = we;
var Nf = Cf;
function Cf(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        yi(e, "borderLeft", "_bl", n, o, i), yi(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function yi(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = Sf.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var Mf = {
  adjust: $f,
  undo: If
};
function $f(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && ua(e);
}
function If(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && Af(e), (t === "lr" || t === "rl") && (zf(e), ua(e));
}
function ua(e) {
  e.nodes().forEach((t) => wi(e.node(t))), e.edges().forEach((t) => wi(e.edge(t)));
}
function wi(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function Af(e) {
  e.nodes().forEach((t) => Fr(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Fr), Object.hasOwn(n, "y") && Fr(n);
  });
}
function Fr(e) {
  e.y = -e.y;
}
function zf(e) {
  e.nodes().forEach((t) => Yr(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Yr), Object.hasOwn(n, "x") && Yr(n);
  });
}
function Yr(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let xi = we;
var Tf = Lf;
function Lf(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = xi.applyWithChunking(Math.max, r), i = xi.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let Of = we.zipObject;
var Pf = Df;
function Df(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += Rf(e, t[r - 1], t[r]);
  return n;
}
function Rf(e, t, n) {
  let r = Of(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, f) => d.pos - f.pos)), i = 1;
  for (; i < n.length; ) i <<= 1;
  let s = 2 * i - 1;
  i -= 1;
  let a = new Array(s).fill(0), l = 0;
  return o.forEach((c) => {
    let d = c.pos + i;
    a[d] += c.weight;
    let f = 0;
    for (; d > 0; )
      d % 2 && (f += a[d + 1]), d = d - 1 >> 1, a[d] += c.weight;
    l += c.weight * f;
  }), l;
}
var Hf = Bf;
function Bf(e, t = []) {
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
let Vf = we;
var Wf = Ff;
function Ff(e, t) {
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
  return Yf(r);
}
function Yf(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && jf(o, i);
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
  return t.filter((o) => !o.merged).map((o) => Vf.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function jf(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let Gf = we;
var Xf = Uf;
function Uf(e, t) {
  let n = Gf.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, f) => f.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(qf(!!t)), l = bi(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = bi(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function bi(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function qf(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Kf = Hf, Zf = Wf, Qf = Xf;
var Jf = fa;
function fa(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((u) => u !== s && u !== a));
  let c = Kf(e, o);
  c.forEach((u) => {
    if (e.children(u.v).length) {
      let h = fa(e, u.v, n, r);
      l[u.v] = h, Object.hasOwn(h, "barycenter") && th(u, h);
    }
  });
  let d = Zf(c, n);
  eh(d, l);
  let f = Qf(d, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let u = e.node(e.predecessors(s)[0]), h = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + u.order + h.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function eh(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function th(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let nh = Be.Graph, rh = we;
var oh = ih;
function ih(e, t, n, r) {
  r || (r = e.nodes());
  let o = sh(e), i = new nh({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
  return r.forEach((s) => {
    let a = e.node(s), l = e.parent(s);
    (a.rank === t || a.minRank <= t && t <= a.maxRank) && (i.setNode(s), i.setParent(s, l || o), e[n](s).forEach((c) => {
      let d = c.v === s ? c.w : c.v, f = i.edge(d, s), u = f !== void 0 ? f.weight : 0;
      i.setEdge(d, s, { weight: e.edge(c).weight + u });
    }), Object.hasOwn(a, "minRank") && i.setNode(s, {
      borderLeft: a.borderLeft[t],
      borderRight: a.borderRight[t]
    }));
  }), i;
}
function sh(e) {
  for (var t; e.hasNode(t = rh.uniqueId("_root")); ) ;
  return t;
}
var ah = lh;
function lh(e, t, n) {
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
let ch = Tf, dh = Pf, uh = Jf, fh = oh, hh = ah, ph = Be.Graph, Cn = we;
var gh = ha;
function ha(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, ha);
    return;
  }
  let n = Cn.maxRank(e), r = vi(e, Cn.range(1, n + 1), "inEdges"), o = vi(e, Cn.range(n - 1, -1, -1), "outEdges"), i = ch(e);
  if (_i(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    mh(l % 2 ? r : o, l % 4 >= 2), i = Cn.buildLayerMatrix(e);
    let d = dh(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  _i(e, a);
}
function vi(e, t, n) {
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
    return fh(e, i, n, r.get(i) || []);
  });
}
function mh(e, t) {
  let n = new ph();
  e.forEach(function(r) {
    let o = r.graph().root, i = uh(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), hh(r, n, i.vs);
  });
}
function _i(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let yh = Be.Graph, Qe = we;
var wh = {
  positionX: $h
};
function xh(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, f) => {
      let u = vh(e, d), h = u ? e.node(u).order : l;
      (u || d === c) && (i.slice(a, f + 1).forEach((g) => {
        e.predecessors(g).forEach((v) => {
          let b = e.node(v), m = b.order;
          (m < s || h < m) && !(b.dummy && e.node(g).dummy) && pa(n, v, g);
        });
      }), a = f + 1, s = h);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function bh(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    Qe.range(s, a).forEach((f) => {
      d = i[f], e.node(d).dummy && e.predecessors(d).forEach((u) => {
        let h = e.node(u);
        h.dummy && (h.order < l || h.order > c) && pa(n, u, d);
      });
    });
  }
  function o(i, s) {
    let a = -1, l, c = 0;
    return s.forEach((d, f) => {
      if (e.node(d).dummy === "border") {
        let u = e.predecessors(d);
        u.length && (l = e.node(u[0]).order, r(s, c, f, a, l), c = f, a = l);
      }
      r(s, c, s.length, l, i.length);
    }), s;
  }
  return t.length && t.reduce(o), n;
}
function vh(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function pa(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function _h(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function kh(e, t, n, r) {
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
        d = d.sort((u, h) => s[u] - s[h]);
        let f = (d.length - 1) / 2;
        for (let u = Math.floor(f), h = Math.ceil(f); u <= h; ++u) {
          let g = d[u];
          i[c] === c && l < s[g] && !_h(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function Eh(e, t, n, r, o) {
  let i = {}, s = Sh(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, u) {
    let h = s.nodes(), g = h.pop(), v = {};
    for (; g; )
      v[g] ? f(g) : (v[g] = !0, h.push(g), h = h.concat(u(g))), g = h.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((u, h) => Math.max(u, i[h.v] + s.edge(h)), 0);
  }
  function d(f) {
    let u = s.outEdges(f).reduce((g, v) => Math.min(g, i[v.w] - s.edge(v)), Number.POSITIVE_INFINITY), h = e.node(f);
    u !== Number.POSITIVE_INFINITY && h.borderType !== a && (i[f] = Math.max(i[f], u));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function Sh(e, t, n, r) {
  let o = new yh(), i = e.graph(), s = Ih(i.nodesep, i.edgesep, r);
  return t.forEach((a) => {
    let l;
    a.forEach((c) => {
      let d = n[c];
      if (o.setNode(d), l) {
        var f = n[l], u = o.edge(f, d);
        o.setEdge(f, d, Math.max(s(e, c, l), u || 0));
      }
      l = c;
    });
  }), o;
}
function Nh(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = Ah(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Ch(e, t) {
  let n = Object.values(t), r = Qe.applyWithChunking(Math.min, n), o = Qe.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), d = r - Qe.applyWithChunking(Math.min, c);
      s !== "l" && (d = o - Qe.applyWithChunking(Math.max, c)), d && (e[a] = Qe.mapValues(l, (f) => f + d));
    });
  });
}
function Mh(e, t) {
  return Qe.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function $h(e) {
  let t = Qe.buildLayerMatrix(e), n = Object.assign(
    xh(e, t),
    bh(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = kh(e, o, n, l), d = Eh(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = Qe.mapValues(d, (f) => -f)), r[s + a] = d;
    });
  });
  let i = Nh(e, r);
  return Ch(r, i), Mh(r, e.graph().align);
}
function Ih(e, t, n) {
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
function Ah(e, t) {
  return e.node(t).width;
}
let ga = we, zh = wh.positionX;
var Th = Lh;
function Lh(e) {
  e = ga.asNonCompoundGraph(e), Oh(e), Object.entries(zh(e)).forEach(([t, n]) => e.node(t).x = n);
}
function Oh(e) {
  let t = ga.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let ki = Pu, Ei = Vu, Ph = ff, Dh = we.normalizeRanks, Rh = mf, Hh = we.removeEmptyRanks, Si = bf, Bh = Nf, Ni = Mf, Vh = gh, Wh = Th, Ie = we, Fh = Be.Graph;
var Yh = jh;
function jh(e, t) {
  let n = t && t.debugTiming ? Ie.time : Ie.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => tp(e));
    n("  runLayout", () => Gh(r, n, t)), n("  updateInputGraph", () => Xh(e, r));
  });
}
function Gh(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => np(e)), t("    removeSelfEdges", () => up(e)), t("    acyclic", () => ki.run(e)), t("    nestingGraph.run", () => Si.run(e)), t("    rank", () => Ph(Ie.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => rp(e)), t("    removeEmptyRanks", () => Hh(e)), t("    nestingGraph.cleanup", () => Si.cleanup(e)), t("    normalizeRanks", () => Dh(e)), t("    assignRankMinMax", () => op(e)), t("    removeEdgeLabelProxies", () => ip(e)), t("    normalize.run", () => Ei.run(e)), t("    parentDummyChains", () => Rh(e)), t("    addBorderSegments", () => Bh(e)), t("    order", () => Vh(e, n)), t("    insertSelfEdges", () => fp(e)), t("    adjustCoordinateSystem", () => Ni.adjust(e)), t("    position", () => Wh(e)), t("    positionSelfEdges", () => hp(e)), t("    removeBorderNodes", () => dp(e)), t("    normalize.undo", () => Ei.undo(e)), t("    fixupEdgeLabelCoords", () => lp(e)), t("    undoCoordinateSystem", () => Ni.undo(e)), t("    translateGraph", () => sp(e)), t("    assignNodeIntersects", () => ap(e)), t("    reversePoints", () => cp(e)), t("    acyclic.undo", () => ki.undo(e));
}
function Xh(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let Uh = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], qh = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Kh = ["acyclicer", "ranker", "rankdir", "align"], Zh = ["width", "height", "rank"], Ci = { width: 0, height: 0 }, Qh = ["minlen", "weight", "width", "height", "labeloffset"], Jh = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, ep = ["labelpos"];
function tp(e) {
  let t = new Fh({ multigraph: !0, compound: !0 }), n = Gr(e.graph());
  return t.setGraph(Object.assign(
    {},
    qh,
    jr(n, Uh),
    Ie.pick(n, Kh)
  )), e.nodes().forEach((r) => {
    let o = Gr(e.node(r));
    const i = jr(o, Zh);
    Object.keys(Ci).forEach((s) => {
      i[s] === void 0 && (i[s] = Ci[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = Gr(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Jh,
      jr(o, Qh),
      Ie.pick(o, ep)
    ));
  }), t;
}
function np(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function rp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      Ie.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function op(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function ip(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function sp(e) {
  let t = Number.POSITIVE_INFINITY, n = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function l(c) {
    let d = c.x, f = c.y, u = c.width, h = c.height;
    t = Math.min(t, d - u / 2), n = Math.max(n, d + u / 2), r = Math.min(r, f - h / 2), o = Math.max(o, f + h / 2);
  }
  e.nodes().forEach((c) => l(e.node(c))), e.edges().forEach((c) => {
    let d = e.edge(c);
    Object.hasOwn(d, "x") && l(d);
  }), t -= s, r -= a, e.nodes().forEach((c) => {
    let d = e.node(c);
    d.x -= t, d.y -= r;
  }), e.edges().forEach((c) => {
    let d = e.edge(c);
    d.points.forEach((f) => {
      f.x -= t, f.y -= r;
    }), Object.hasOwn(d, "x") && (d.x -= t), Object.hasOwn(d, "y") && (d.y -= r);
  }), i.width = n - t + s, i.height = o - r + a;
}
function ap(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(Ie.intersectRect(r, i)), n.points.push(Ie.intersectRect(o, s));
  });
}
function lp(e) {
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
function cp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function dp(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function up(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function fp(e) {
  var t = Ie.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        Ie.addDummyNode(e, "selfedge", {
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
function hp(e) {
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
function jr(e, t) {
  return Ie.mapValues(Ie.pick(e, t), Number);
}
function Gr(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let pp = we, gp = Be.Graph;
var mp = {
  debugOrdering: yp
};
function yp(e) {
  let t = pp.buildLayerMatrix(e), n = new gp({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var wp = "1.1.8", xp = {
  graphlib: Be,
  layout: Yh,
  debug: mp,
  util: {
    time: we.time,
    notime: we.notime
  },
  version: wp
};
const Un = /* @__PURE__ */ Fs(xp);
function xe(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = xe(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var bp = { value: () => {
} };
function dr() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new Hn(n);
}
function Hn(e) {
  this._ = e;
}
function vp(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
Hn.prototype = dr.prototype = {
  constructor: Hn,
  on: function(e, t) {
    var n = this._, r = vp(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = _p(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Mi(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Mi(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Hn(e);
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
function _p(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Mi(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = bp, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var co = "http://www.w3.org/1999/xhtml";
const $i = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: co,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ur(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), $i.hasOwnProperty(t) ? { space: $i[t], local: e } : e;
}
function kp(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === co && t.documentElement.namespaceURI === co ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Ep(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function ma(e) {
  var t = ur(e);
  return (t.local ? Ep : kp)(t);
}
function Sp() {
}
function Oo(e) {
  return e == null ? Sp : function() {
    return this.querySelector(e);
  };
}
function Np(e) {
  typeof e != "function" && (e = Oo(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new $e(r, this._parents);
}
function Cp(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Mp() {
  return [];
}
function ya(e) {
  return e == null ? Mp : function() {
    return this.querySelectorAll(e);
  };
}
function $p(e) {
  return function() {
    return Cp(e.apply(this, arguments));
  };
}
function Ip(e) {
  typeof e == "function" ? e = $p(e) : e = ya(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new $e(r, o);
}
function wa(e) {
  return function() {
    return this.matches(e);
  };
}
function xa(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Ap = Array.prototype.find;
function zp(e) {
  return function() {
    return Ap.call(this.children, e);
  };
}
function Tp() {
  return this.firstElementChild;
}
function Lp(e) {
  return this.select(e == null ? Tp : zp(typeof e == "function" ? e : xa(e)));
}
var Op = Array.prototype.filter;
function Pp() {
  return Array.from(this.children);
}
function Dp(e) {
  return function() {
    return Op.call(this.children, e);
  };
}
function Rp(e) {
  return this.selectAll(e == null ? Pp : Dp(typeof e == "function" ? e : xa(e)));
}
function Hp(e) {
  typeof e != "function" && (e = wa(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new $e(r, this._parents);
}
function ba(e) {
  return new Array(e.length);
}
function Bp() {
  return new $e(this._enter || this._groups.map(ba), this._parents);
}
function qn(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
qn.prototype = {
  constructor: qn,
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
function Vp(e) {
  return function() {
    return e;
  };
}
function Wp(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new qn(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function Fp(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, f = i.length, u = new Array(d), h;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (u[a] = h = s.call(l, l.__data__, a, t) + "", c.has(h) ? o[a] = l : c.set(h, l));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (l = c.get(h)) ? (r[a] = l, l.__data__ = i[a], c.delete(h)) : n[a] = new qn(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(u[a]) === l && (o[a] = l);
}
function Yp(e) {
  return e.__data__;
}
function jp(e, t) {
  if (!arguments.length) return Array.from(this, Yp);
  var n = t ? Fp : Wp, r = this._parents, o = this._groups;
  typeof e != "function" && (e = Vp(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], f = o[c], u = f.length, h = Gp(e.call(d, d && d.__data__, c, r)), g = h.length, v = a[c] = new Array(g), b = s[c] = new Array(g), m = l[c] = new Array(u);
    n(d, f, v, b, m, h, t);
    for (var _ = 0, y = 0, x, E; _ < g; ++_)
      if (x = v[_]) {
        for (_ >= y && (y = _ + 1); !(E = b[y]) && ++y < g; ) ;
        x._next = E || null;
      }
  }
  return s = new $e(s, r), s._enter = a, s._exit = l, s;
}
function Gp(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Xp() {
  return new $e(this._exit || this._groups.map(ba), this._parents);
}
function Up(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function qp(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], f = c.length, u = a[l] = new Array(f), h, g = 0; g < f; ++g)
      (h = c[g] || d[g]) && (u[g] = h);
  for (; l < o; ++l)
    a[l] = n[l];
  return new $e(a, this._parents);
}
function Kp() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function Zp(e) {
  e || (e = Qp);
  function t(f, u) {
    return f && u ? e(f.__data__, u.__data__) : !f - !u;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(t);
  }
  return new $e(o, this._parents).order();
}
function Qp(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Jp() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function eg() {
  return Array.from(this);
}
function tg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function ng() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function rg() {
  return !this.node();
}
function og(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function ig(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function sg(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function ag(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function lg(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function cg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function dg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function ug(e, t) {
  var n = ur(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? sg : ig : typeof t == "function" ? n.local ? dg : cg : n.local ? lg : ag)(n, t));
}
function va(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function fg(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function hg(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function pg(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function gg(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? fg : typeof t == "function" ? pg : hg)(e, t, n ?? "")) : Mt(this.node(), e);
}
function Mt(e, t) {
  return e.style.getPropertyValue(t) || va(e).getComputedStyle(e, null).getPropertyValue(t);
}
function mg(e) {
  return function() {
    delete this[e];
  };
}
function yg(e, t) {
  return function() {
    this[e] = t;
  };
}
function wg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function xg(e, t) {
  return arguments.length > 1 ? this.each((t == null ? mg : typeof t == "function" ? wg : yg)(e, t)) : this.node()[e];
}
function _a(e) {
  return e.trim().split(/^|\s+/);
}
function Po(e) {
  return e.classList || new ka(e);
}
function ka(e) {
  this._node = e, this._names = _a(e.getAttribute("class") || "");
}
ka.prototype = {
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
function Ea(e, t) {
  for (var n = Po(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function Sa(e, t) {
  for (var n = Po(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function bg(e) {
  return function() {
    Ea(this, e);
  };
}
function vg(e) {
  return function() {
    Sa(this, e);
  };
}
function _g(e, t) {
  return function() {
    (t.apply(this, arguments) ? Ea : Sa)(this, e);
  };
}
function kg(e, t) {
  var n = _a(e + "");
  if (arguments.length < 2) {
    for (var r = Po(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? _g : t ? bg : vg)(n, t));
}
function Eg() {
  this.textContent = "";
}
function Sg(e) {
  return function() {
    this.textContent = e;
  };
}
function Ng(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Cg(e) {
  return arguments.length ? this.each(e == null ? Eg : (typeof e == "function" ? Ng : Sg)(e)) : this.node().textContent;
}
function Mg() {
  this.innerHTML = "";
}
function $g(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Ig(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Ag(e) {
  return arguments.length ? this.each(e == null ? Mg : (typeof e == "function" ? Ig : $g)(e)) : this.node().innerHTML;
}
function zg() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Tg() {
  return this.each(zg);
}
function Lg() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Og() {
  return this.each(Lg);
}
function Pg(e) {
  var t = typeof e == "function" ? e : ma(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Dg() {
  return null;
}
function Rg(e, t) {
  var n = typeof e == "function" ? e : ma(e), r = t == null ? Dg : typeof t == "function" ? t : Oo(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Hg() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Bg() {
  return this.each(Hg);
}
function Vg() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Wg() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Fg(e) {
  return this.select(e ? Wg : Vg);
}
function Yg(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function jg(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Gg(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function Xg(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function Ug(e, t, n) {
  return function() {
    var r = this.__on, o, i = jg(t);
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
function qg(e, t, n) {
  var r = Gg(e + ""), o, i = r.length, s;
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
  for (a = t ? Ug : Xg, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function Na(e, t, n) {
  var r = va(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Kg(e, t) {
  return function() {
    return Na(this, e, t);
  };
}
function Zg(e, t) {
  return function() {
    return Na(this, e, t.apply(this, arguments));
  };
}
function Qg(e, t) {
  return this.each((typeof t == "function" ? Zg : Kg)(e, t));
}
function* Jg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Ca = [null];
function $e(e, t) {
  this._groups = e, this._parents = t;
}
function cn() {
  return new $e([[document.documentElement]], Ca);
}
function em() {
  return this;
}
$e.prototype = cn.prototype = {
  constructor: $e,
  select: Np,
  selectAll: Ip,
  selectChild: Lp,
  selectChildren: Rp,
  filter: Hp,
  data: jp,
  enter: Bp,
  exit: Xp,
  join: Up,
  merge: qp,
  selection: em,
  order: Kp,
  sort: Zp,
  call: Jp,
  nodes: eg,
  node: tg,
  size: ng,
  empty: rg,
  each: og,
  attr: ug,
  style: gg,
  property: xg,
  classed: kg,
  text: Cg,
  html: Ag,
  raise: Tg,
  lower: Og,
  append: Pg,
  insert: Rg,
  remove: Bg,
  clone: Fg,
  datum: Yg,
  on: qg,
  dispatch: Qg,
  [Symbol.iterator]: Jg
};
function Ce(e) {
  return typeof e == "string" ? new $e([[document.querySelector(e)]], [document.documentElement]) : new $e([[e]], Ca);
}
function tm(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Te(e, t) {
  if (e = tm(e), t === void 0 && (t = e.currentTarget), t) {
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
const nm = { passive: !1 }, Ut = { capture: !0, passive: !1 };
function Xr(e) {
  e.stopImmediatePropagation();
}
function Nt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ma(e) {
  var t = e.document.documentElement, n = Ce(e).on("dragstart.drag", Nt, Ut);
  "onselectstart" in t ? n.on("selectstart.drag", Nt, Ut) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function $a(e, t) {
  var n = e.document.documentElement, r = Ce(e).on("dragstart.drag", null);
  t && (r.on("click.drag", Nt, Ut), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Mn = (e) => () => e;
function uo(e, {
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
uo.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function rm(e) {
  return !e.ctrlKey && !e.button;
}
function om() {
  return this.parentNode;
}
function im(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function sm() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ia() {
  var e = rm, t = om, n = im, r = sm, o = {}, i = dr("start", "drag", "end"), s = 0, a, l, c, d, f = 0;
  function u(x) {
    x.on("mousedown.drag", h).filter(r).on("touchstart.drag", b).on("touchmove.drag", m, nm).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, E) {
    if (!(d || !e.call(this, x, E))) {
      var S = y(this, t.call(this, x, E), x, E, "mouse");
      S && (Ce(x.view).on("mousemove.drag", g, Ut).on("mouseup.drag", v, Ut), Ma(x.view), Xr(x), c = !1, a = x.clientX, l = x.clientY, S("start", x));
    }
  }
  function g(x) {
    if (Nt(x), !c) {
      var E = x.clientX - a, S = x.clientY - l;
      c = E * E + S * S > f;
    }
    o.mouse("drag", x);
  }
  function v(x) {
    Ce(x.view).on("mousemove.drag mouseup.drag", null), $a(x.view, c), Nt(x), o.mouse("end", x);
  }
  function b(x, E) {
    if (e.call(this, x, E)) {
      var S = x.changedTouches, M = t.call(this, x, E), z = S.length, I, V;
      for (I = 0; I < z; ++I)
        (V = y(this, M, x, E, S[I].identifier, S[I])) && (Xr(x), V("start", x, S[I]));
    }
  }
  function m(x) {
    var E = x.changedTouches, S = E.length, M, z;
    for (M = 0; M < S; ++M)
      (z = o[E[M].identifier]) && (Nt(x), z("drag", x, E[M]));
  }
  function _(x) {
    var E = x.changedTouches, S = E.length, M, z;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), M = 0; M < S; ++M)
      (z = o[E[M].identifier]) && (Xr(x), z("end", x, E[M]));
  }
  function y(x, E, S, M, z, I) {
    var V = i.copy(), T = Te(I || S, E), B, D, w;
    if ((w = n.call(x, new uo("beforestart", {
      sourceEvent: S,
      target: u,
      identifier: z,
      active: s,
      x: T[0],
      y: T[1],
      dx: 0,
      dy: 0,
      dispatch: V
    }), M)) != null)
      return B = w.x - T[0] || 0, D = w.y - T[1] || 0, function N(k, $, L) {
        var C = T, O;
        switch (k) {
          case "start":
            o[z] = N, O = s++;
            break;
          case "end":
            delete o[z], --s;
          case "drag":
            T = Te(L || $, E), O = s;
            break;
        }
        V.call(
          k,
          x,
          new uo(k, {
            sourceEvent: $,
            subject: w,
            target: u,
            identifier: z,
            active: O,
            x: T[0] + B,
            y: T[1] + D,
            dx: T[0] - C[0],
            dy: T[1] - C[1],
            dispatch: V
          }),
          M
        );
      };
  }
  return u.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Mn(!!x), u) : e;
  }, u.container = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Mn(x), u) : t;
  }, u.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : Mn(x), u) : n;
  }, u.touchable = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : Mn(!!x), u) : r;
  }, u.on = function() {
    var x = i.on.apply(i, arguments);
    return x === i ? u : x;
  }, u.clickDistance = function(x) {
    return arguments.length ? (f = (x = +x) * x, u) : Math.sqrt(f);
  }, u;
}
function Do(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Aa(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function dn() {
}
var qt = 0.7, Kn = 1 / qt, Ct = "\\s*([+-]?\\d+)\\s*", Kt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ue = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", am = /^#([0-9a-f]{3,8})$/, lm = new RegExp(`^rgb\\(${Ct},${Ct},${Ct}\\)$`), cm = new RegExp(`^rgb\\(${Ue},${Ue},${Ue}\\)$`), dm = new RegExp(`^rgba\\(${Ct},${Ct},${Ct},${Kt}\\)$`), um = new RegExp(`^rgba\\(${Ue},${Ue},${Ue},${Kt}\\)$`), fm = new RegExp(`^hsl\\(${Kt},${Ue},${Ue}\\)$`), hm = new RegExp(`^hsla\\(${Kt},${Ue},${Ue},${Kt}\\)$`), Ii = {
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
Do(dn, mt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ai,
  // Deprecated! Use color.formatHex.
  formatHex: Ai,
  formatHex8: pm,
  formatHsl: gm,
  formatRgb: zi,
  toString: zi
});
function Ai() {
  return this.rgb().formatHex();
}
function pm() {
  return this.rgb().formatHex8();
}
function gm() {
  return za(this).formatHsl();
}
function zi() {
  return this.rgb().formatRgb();
}
function mt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = am.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Ti(t) : n === 3 ? new _e(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? $n(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? $n(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = lm.exec(e)) ? new _e(t[1], t[2], t[3], 1) : (t = cm.exec(e)) ? new _e(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = dm.exec(e)) ? $n(t[1], t[2], t[3], t[4]) : (t = um.exec(e)) ? $n(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = fm.exec(e)) ? Pi(t[1], t[2] / 100, t[3] / 100, 1) : (t = hm.exec(e)) ? Pi(t[1], t[2] / 100, t[3] / 100, t[4]) : Ii.hasOwnProperty(e) ? Ti(Ii[e]) : e === "transparent" ? new _e(NaN, NaN, NaN, 0) : null;
}
function Ti(e) {
  return new _e(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function $n(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new _e(e, t, n, r);
}
function mm(e) {
  return e instanceof dn || (e = mt(e)), e ? (e = e.rgb(), new _e(e.r, e.g, e.b, e.opacity)) : new _e();
}
function fo(e, t, n, r) {
  return arguments.length === 1 ? mm(e) : new _e(e, t, n, r ?? 1);
}
function _e(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Do(_e, fo, Aa(dn, {
  brighter(e) {
    return e = e == null ? Kn : Math.pow(Kn, e), new _e(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? qt : Math.pow(qt, e), new _e(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new _e(pt(this.r), pt(this.g), pt(this.b), Zn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Li,
  // Deprecated! Use color.formatHex.
  formatHex: Li,
  formatHex8: ym,
  formatRgb: Oi,
  toString: Oi
}));
function Li() {
  return `#${ht(this.r)}${ht(this.g)}${ht(this.b)}`;
}
function ym() {
  return `#${ht(this.r)}${ht(this.g)}${ht(this.b)}${ht((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Oi() {
  const e = Zn(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${pt(this.r)}, ${pt(this.g)}, ${pt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Zn(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function pt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function ht(e) {
  return e = pt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Pi(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Le(e, t, n, r);
}
function za(e) {
  if (e instanceof Le) return new Le(e.h, e.s, e.l, e.opacity);
  if (e instanceof dn || (e = mt(e)), !e) return new Le();
  if (e instanceof Le) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Le(s, a, l, e.opacity);
}
function wm(e, t, n, r) {
  return arguments.length === 1 ? za(e) : new Le(e, t, n, r ?? 1);
}
function Le(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Do(Le, wm, Aa(dn, {
  brighter(e) {
    return e = e == null ? Kn : Math.pow(Kn, e), new Le(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? qt : Math.pow(qt, e), new Le(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new _e(
      Ur(e >= 240 ? e - 240 : e + 120, o, r),
      Ur(e, o, r),
      Ur(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new Le(Di(this.h), In(this.s), In(this.l), Zn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Zn(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Di(this.h)}, ${In(this.s) * 100}%, ${In(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Di(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function In(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ur(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ro = (e) => () => e;
function xm(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function bm(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function vm(e) {
  return (e = +e) == 1 ? Ta : function(t, n) {
    return n - t ? bm(t, n, e) : Ro(isNaN(t) ? n : t);
  };
}
function Ta(e, t) {
  var n = t - e;
  return n ? xm(e, n) : Ro(isNaN(e) ? t : e);
}
const Qn = function e(t) {
  var n = vm(t);
  function r(o, i) {
    var s = n((o = fo(o)).r, (i = fo(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = Ta(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function _m(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function km(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Em(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = jt(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function Sm(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Ge(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Nm(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = jt(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var ho = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, qr = new RegExp(ho.source, "g");
function Cm(e) {
  return function() {
    return e;
  };
}
function Mm(e) {
  return function(t) {
    return e(t) + "";
  };
}
function La(e, t) {
  var n = ho.lastIndex = qr.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = ho.exec(e)) && (o = qr.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Ge(r, o) })), n = qr.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? Mm(l[0].x) : Cm(t) : (t = l.length, function(c) {
    for (var d = 0, f; d < t; ++d) a[(f = l[d]).i] = f.x(c);
    return a.join("");
  });
}
function jt(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Ro(t) : (n === "number" ? Ge : n === "string" ? (r = mt(t)) ? (t = r, Qn) : La : t instanceof mt ? Qn : t instanceof Date ? Sm : km(t) ? _m : Array.isArray(t) ? Em : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Nm : Ge)(e, t);
}
var Ri = 180 / Math.PI, po = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Oa(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * Ri,
    skewX: Math.atan(l) * Ri,
    scaleX: s,
    scaleY: a
  };
}
var An;
function $m(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? po : Oa(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Im(e) {
  return e == null || (An || (An = document.createElementNS("http://www.w3.org/2000/svg", "g")), An.setAttribute("transform", e), !(e = An.transform.baseVal.consolidate())) ? po : (e = e.matrix, Oa(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Pa(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, f, u, h, g) {
    if (c !== f || d !== u) {
      var v = h.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: Ge(c, f) }, { i: v - 2, x: Ge(d, u) });
    } else (f || u) && h.push("translate(" + f + t + u + n);
  }
  function s(c, d, f, u) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), u.push({ i: f.push(o(f) + "rotate(", null, r) - 2, x: Ge(c, d) })) : d && f.push(o(f) + "rotate(" + d + r);
  }
  function a(c, d, f, u) {
    c !== d ? u.push({ i: f.push(o(f) + "skewX(", null, r) - 2, x: Ge(c, d) }) : d && f.push(o(f) + "skewX(" + d + r);
  }
  function l(c, d, f, u, h, g) {
    if (c !== f || d !== u) {
      var v = h.push(o(h) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: Ge(c, f) }, { i: v - 2, x: Ge(d, u) });
    } else (f !== 1 || u !== 1) && h.push(o(h) + "scale(" + f + "," + u + ")");
  }
  return function(c, d) {
    var f = [], u = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, f, u), s(c.rotate, d.rotate, f, u), a(c.skewX, d.skewX, f, u), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, u), c = d = null, function(h) {
      for (var g = -1, v = u.length, b; ++g < v; ) f[(b = u[g]).i] = b.x(h);
      return f.join("");
    };
  };
}
var Am = Pa($m, "px, ", "px)", "deg)"), zm = Pa(Im, ", ", ")", ")"), Tm = 1e-12;
function Hi(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Lm(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Om(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Bn = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], f = s[1], u = s[2], h = d - a, g = f - l, v = h * h + g * g, b, m;
    if (v < Tm)
      m = Math.log(u / c) / t, b = function(M) {
        return [
          a + M * h,
          l + M * g,
          c * Math.exp(t * M * m)
        ];
      };
    else {
      var _ = Math.sqrt(v), y = (u * u - c * c + r * v) / (2 * c * n * _), x = (u * u - c * c - r * v) / (2 * u * n * _), E = Math.log(Math.sqrt(y * y + 1) - y), S = Math.log(Math.sqrt(x * x + 1) - x);
      m = (S - E) / t, b = function(M) {
        var z = M * m, I = Hi(E), V = c / (n * _) * (I * Om(t * z + E) - Lm(E));
        return [
          a + V * h,
          l + V * g,
          c * I / Hi(t * z + E)
        ];
      };
    }
    return b.duration = m * 1e3 * t / Math.SQRT2, b;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var $t = 0, Ft = 0, Ht = 0, Da = 1e3, Jn, Yt, er = 0, yt = 0, fr = 0, Zt = typeof performance == "object" && performance.now ? performance : Date, Ra = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Ho() {
  return yt || (Ra(Pm), yt = Zt.now() + fr);
}
function Pm() {
  yt = 0;
}
function tr() {
  this._call = this._time = this._next = null;
}
tr.prototype = Ha.prototype = {
  constructor: tr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Ho() : +n) + (t == null ? 0 : +t), !this._next && Yt !== this && (Yt ? Yt._next = this : Jn = this, Yt = this), this._call = e, this._time = n, go();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, go());
  }
};
function Ha(e, t, n) {
  var r = new tr();
  return r.restart(e, t, n), r;
}
function Dm() {
  Ho(), ++$t;
  for (var e = Jn, t; e; )
    (t = yt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --$t;
}
function Bi() {
  yt = (er = Zt.now()) + fr, $t = Ft = 0;
  try {
    Dm();
  } finally {
    $t = 0, Hm(), yt = 0;
  }
}
function Rm() {
  var e = Zt.now(), t = e - er;
  t > Da && (fr -= t, er = e);
}
function Hm() {
  for (var e, t = Jn, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Jn = n);
  Yt = e, go(r);
}
function go(e) {
  if (!$t) {
    Ft && (Ft = clearTimeout(Ft));
    var t = e - yt;
    t > 24 ? (e < 1 / 0 && (Ft = setTimeout(Bi, e - Zt.now() - fr)), Ht && (Ht = clearInterval(Ht))) : (Ht || (er = Zt.now(), Ht = setInterval(Rm, Da)), $t = 1, Ra(Bi));
  }
}
function Vi(e, t, n) {
  var r = new tr();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var Bm = dr("start", "end", "cancel", "interrupt"), Vm = [], Ba = 0, Wi = 1, mo = 2, Vn = 3, Fi = 4, yo = 5, Wn = 6;
function hr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  Wm(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: Bm,
    tween: Vm,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: Ba
  });
}
function Bo(e, t) {
  var n = Ve(e, t);
  if (n.state > Ba) throw new Error("too late; already scheduled");
  return n;
}
function qe(e, t) {
  var n = Ve(e, t);
  if (n.state > Vn) throw new Error("too late; already running");
  return n;
}
function Ve(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function Wm(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = Ha(i, 0, n.time);
  function i(c) {
    n.state = Wi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, u, h;
    if (n.state !== Wi) return l();
    for (d in r)
      if (h = r[d], h.name === n.name) {
        if (h.state === Vn) return Vi(s);
        h.state === Fi ? (h.state = Wn, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete r[d]) : +d < t && (h.state = Wn, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete r[d]);
      }
    if (Vi(function() {
      n.state === Vn && (n.state = Fi, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = mo, n.on.call("start", e, e.__data__, n.index, n.group), n.state === mo) {
      for (n.state = Vn, o = new Array(u = n.tween.length), d = 0, f = -1; d < u; ++d)
        (h = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = h);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = yo, 1), f = -1, u = o.length; ++f < u; )
      o[f].call(e, d);
    n.state === yo && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Wn, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function Fn(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > mo && r.state < yo, r.state = Wn, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function Fm(e) {
  return this.each(function() {
    Fn(this, e);
  });
}
function Ym(e, t) {
  var n, r;
  return function() {
    var o = qe(this, e), i = o.tween;
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
function jm(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = qe(this, e), s = i.tween;
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
function Gm(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Ve(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Ym : jm)(n, e, t));
}
function Vo(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = qe(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return Ve(o, r).value[t];
  };
}
function Va(e, t) {
  var n;
  return (typeof t == "number" ? Ge : t instanceof mt ? Qn : (n = mt(t)) ? (t = n, Qn) : La)(e, t);
}
function Xm(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Um(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function qm(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function Km(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function Zm(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function Qm(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function Jm(e, t) {
  var n = ur(e), r = n === "transform" ? zm : Va;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Qm : Zm)(n, r, Vo(this, "attr." + e, t)) : t == null ? (n.local ? Um : Xm)(n) : (n.local ? Km : qm)(n, r, t));
}
function e0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function t0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function n0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && t0(e, i)), n;
  }
  return o._value = t, o;
}
function r0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && e0(e, i)), n;
  }
  return o._value = t, o;
}
function o0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = ur(e);
  return this.tween(n, (r.local ? n0 : r0)(r, t));
}
function i0(e, t) {
  return function() {
    Bo(this, e).delay = +t.apply(this, arguments);
  };
}
function s0(e, t) {
  return t = +t, function() {
    Bo(this, e).delay = t;
  };
}
function a0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? i0 : s0)(t, e)) : Ve(this.node(), t).delay;
}
function l0(e, t) {
  return function() {
    qe(this, e).duration = +t.apply(this, arguments);
  };
}
function c0(e, t) {
  return t = +t, function() {
    qe(this, e).duration = t;
  };
}
function d0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? l0 : c0)(t, e)) : Ve(this.node(), t).duration;
}
function u0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    qe(this, e).ease = t;
  };
}
function f0(e) {
  var t = this._id;
  return arguments.length ? this.each(u0(t, e)) : Ve(this.node(), t).ease;
}
function h0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    qe(this, e).ease = n;
  };
}
function p0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(h0(this._id, e));
}
function g0(e) {
  typeof e != "function" && (e = wa(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new et(r, this._parents, this._name, this._id);
}
function m0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, f = s[a] = new Array(d), u, h = 0; h < d; ++h)
      (u = l[h] || c[h]) && (f[h] = u);
  for (; a < r; ++a)
    s[a] = t[a];
  return new et(s, this._parents, this._name, this._id);
}
function y0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function w0(e, t, n) {
  var r, o, i = y0(t) ? Bo : qe;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function x0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Ve(this.node(), n).on.on(e) : this.each(w0(n, e, t));
}
function b0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function v0() {
  return this.on("end.remove", b0(this._id));
}
function _0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oo(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, f, u = 0; u < l; ++u)
      (d = a[u]) && (f = e.call(d, d.__data__, u, a)) && ("__data__" in d && (f.__data__ = d.__data__), c[u] = f, hr(c[u], t, n, u, c, Ve(d, n)));
  return new et(i, this._parents, t, n);
}
function k0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ya(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, f = 0; f < c; ++f)
      if (d = l[f]) {
        for (var u = e.call(d, d.__data__, f, l), h, g = Ve(d, n), v = 0, b = u.length; v < b; ++v)
          (h = u[v]) && hr(h, t, n, v, u, g);
        i.push(u), s.push(d);
      }
  return new et(i, s, t, n);
}
var E0 = cn.prototype.constructor;
function S0() {
  return new E0(this._groups, this._parents);
}
function N0(e, t) {
  var n, r, o;
  return function() {
    var i = Mt(this, e), s = (this.style.removeProperty(e), Mt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function Wa(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function C0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = Mt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function M0(e, t, n) {
  var r, o, i;
  return function() {
    var s = Mt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Mt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function $0(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = qe(this, e), c = l.on, d = l.value[i] == null ? a || (a = Wa(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function I0(e, t, n) {
  var r = (e += "") == "transform" ? Am : Va;
  return t == null ? this.styleTween(e, N0(e, r)).on("end.style." + e, Wa(e)) : typeof t == "function" ? this.styleTween(e, M0(e, r, Vo(this, "style." + e, t))).each($0(this._id, e)) : this.styleTween(e, C0(e, r, t), n).on("end.style." + e, null);
}
function A0(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function z0(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && A0(e, s, n)), r;
  }
  return i._value = t, i;
}
function T0(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, z0(e, t, n ?? ""));
}
function L0(e) {
  return function() {
    this.textContent = e;
  };
}
function O0(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function P0(e) {
  return this.tween("text", typeof e == "function" ? O0(Vo(this, "text", e)) : L0(e == null ? "" : e + ""));
}
function D0(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function R0(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && D0(o)), t;
  }
  return r._value = e, r;
}
function H0(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, R0(e));
}
function B0() {
  for (var e = this._name, t = this._id, n = Fa(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = Ve(l, t);
        hr(l, e, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new et(r, this._parents, e, n);
}
function V0() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = qe(this, r), d = c.on;
      d !== e && (t = (e = d).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var W0 = 0;
function et(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Fa() {
  return ++W0;
}
var Ke = cn.prototype;
et.prototype = {
  constructor: et,
  select: _0,
  selectAll: k0,
  selectChild: Ke.selectChild,
  selectChildren: Ke.selectChildren,
  filter: g0,
  merge: m0,
  selection: S0,
  transition: B0,
  call: Ke.call,
  nodes: Ke.nodes,
  node: Ke.node,
  size: Ke.size,
  empty: Ke.empty,
  each: Ke.each,
  on: x0,
  attr: Jm,
  attrTween: o0,
  style: I0,
  styleTween: T0,
  text: P0,
  textTween: H0,
  remove: v0,
  tween: Gm,
  delay: a0,
  duration: d0,
  ease: f0,
  easeVarying: p0,
  end: V0,
  [Symbol.iterator]: Ke[Symbol.iterator]
};
function F0(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Y0 = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: F0
};
function j0(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function G0(e) {
  var t, n;
  e instanceof et ? (t = e._id, e = e._name) : (t = Fa(), (n = Y0).time = Ho(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && hr(l, e, t, c, s, n || j0(l, t));
  return new et(r, this._parents, e, t);
}
cn.prototype.interrupt = Fm;
cn.prototype.transition = G0;
const zn = (e) => () => e;
function X0(e, {
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
function Je(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Je.prototype = {
  constructor: Je,
  scale: function(e) {
    return e === 1 ? this : new Je(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Je(this.k, this.x + this.k * e, this.y + this.k * t);
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
var pr = new Je(1, 0, 0);
Ya.prototype = Je.prototype;
function Ya(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return pr;
  return e.__zoom;
}
function Kr(e) {
  e.stopImmediatePropagation();
}
function Bt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function U0(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function q0() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Yi() {
  return this.__zoom || pr;
}
function K0(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Z0() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Q0(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function ja() {
  var e = U0, t = q0, n = Q0, r = K0, o = Z0, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = Bn, c = dr("start", "zoom", "end"), d, f, u, h = 500, g = 150, v = 0, b = 10;
  function m(w) {
    w.property("__zoom", Yi).on("wheel.zoom", z, { passive: !1 }).on("mousedown.zoom", I).on("dblclick.zoom", V).filter(o).on("touchstart.zoom", T).on("touchmove.zoom", B).on("touchend.zoom touchcancel.zoom", D).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(w, N, k, $) {
    var L = w.selection ? w.selection() : w;
    L.property("__zoom", Yi), w !== L ? E(w, N, k, $) : L.interrupt().each(function() {
      S(this, arguments).event($).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, m.scaleBy = function(w, N, k, $) {
    m.scaleTo(w, function() {
      var L = this.__zoom.k, C = typeof N == "function" ? N.apply(this, arguments) : N;
      return L * C;
    }, k, $);
  }, m.scaleTo = function(w, N, k, $) {
    m.transform(w, function() {
      var L = t.apply(this, arguments), C = this.__zoom, O = k == null ? x(L) : typeof k == "function" ? k.apply(this, arguments) : k, P = C.invert(O), W = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(y(_(C, W), O, P), L, s);
    }, k, $);
  }, m.translateBy = function(w, N, k, $) {
    m.transform(w, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof k == "function" ? k.apply(this, arguments) : k
      ), t.apply(this, arguments), s);
    }, null, $);
  }, m.translateTo = function(w, N, k, $, L) {
    m.transform(w, function() {
      var C = t.apply(this, arguments), O = this.__zoom, P = $ == null ? x(C) : typeof $ == "function" ? $.apply(this, arguments) : $;
      return n(pr.translate(P[0], P[1]).scale(O.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof k == "function" ? -k.apply(this, arguments) : -k
      ), C, s);
    }, $, L);
  };
  function _(w, N) {
    return N = Math.max(i[0], Math.min(i[1], N)), N === w.k ? w : new Je(N, w.x, w.y);
  }
  function y(w, N, k) {
    var $ = N[0] - k[0] * w.k, L = N[1] - k[1] * w.k;
    return $ === w.x && L === w.y ? w : new Je(w.k, $, L);
  }
  function x(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function E(w, N, k, $) {
    w.on("start.zoom", function() {
      S(this, arguments).event($).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event($).end();
    }).tween("zoom", function() {
      var L = this, C = arguments, O = S(L, C).event($), P = t.apply(L, C), W = k == null ? x(P) : typeof k == "function" ? k.apply(L, C) : k, j = Math.max(P[1][0] - P[0][0], P[1][1] - P[0][1]), Y = L.__zoom, q = typeof N == "function" ? N.apply(L, C) : N, te = l(Y.invert(W).concat(j / Y.k), q.invert(W).concat(j / q.k));
      return function(U) {
        if (U === 1) U = q;
        else {
          var R = te(U), F = j / R[2];
          U = new Je(F, W[0] - R[0] * F, W[1] - R[1] * F);
        }
        O.zoom(null, U);
      };
    });
  }
  function S(w, N, k) {
    return !k && w.__zooming || new M(w, N);
  }
  function M(w, N) {
    this.that = w, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(w, N), this.taps = 0;
  }
  M.prototype = {
    event: function(w) {
      return w && (this.sourceEvent = w), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(w, N) {
      return this.mouse && w !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && w !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && w !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(w) {
      var N = Ce(this.that).datum();
      c.call(
        w,
        this.that,
        new X0(w, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        N
      );
    }
  };
  function z(w, ...N) {
    if (!e.apply(this, arguments)) return;
    var k = S(this, N).event(w), $ = this.__zoom, L = Math.max(i[0], Math.min(i[1], $.k * Math.pow(2, r.apply(this, arguments)))), C = Te(w);
    if (k.wheel)
      (k.mouse[0][0] !== C[0] || k.mouse[0][1] !== C[1]) && (k.mouse[1] = $.invert(k.mouse[0] = C)), clearTimeout(k.wheel);
    else {
      if ($.k === L) return;
      k.mouse = [C, $.invert(C)], Fn(this), k.start();
    }
    Bt(w), k.wheel = setTimeout(O, g), k.zoom("mouse", n(y(_($, L), k.mouse[0], k.mouse[1]), k.extent, s));
    function O() {
      k.wheel = null, k.end();
    }
  }
  function I(w, ...N) {
    if (u || !e.apply(this, arguments)) return;
    var k = w.currentTarget, $ = S(this, N, !0).event(w), L = Ce(w.view).on("mousemove.zoom", W, !0).on("mouseup.zoom", j, !0), C = Te(w, k), O = w.clientX, P = w.clientY;
    Ma(w.view), Kr(w), $.mouse = [C, this.__zoom.invert(C)], Fn(this), $.start();
    function W(Y) {
      if (Bt(Y), !$.moved) {
        var q = Y.clientX - O, te = Y.clientY - P;
        $.moved = q * q + te * te > v;
      }
      $.event(Y).zoom("mouse", n(y($.that.__zoom, $.mouse[0] = Te(Y, k), $.mouse[1]), $.extent, s));
    }
    function j(Y) {
      L.on("mousemove.zoom mouseup.zoom", null), $a(Y.view, $.moved), Bt(Y), $.event(Y).end();
    }
  }
  function V(w, ...N) {
    if (e.apply(this, arguments)) {
      var k = this.__zoom, $ = Te(w.changedTouches ? w.changedTouches[0] : w, this), L = k.invert($), C = k.k * (w.shiftKey ? 0.5 : 2), O = n(y(_(k, C), $, L), t.apply(this, N), s);
      Bt(w), a > 0 ? Ce(this).transition().duration(a).call(E, O, $, w) : Ce(this).call(m.transform, O, $, w);
    }
  }
  function T(w, ...N) {
    if (e.apply(this, arguments)) {
      var k = w.touches, $ = k.length, L = S(this, N, w.changedTouches.length === $).event(w), C, O, P, W;
      for (Kr(w), O = 0; O < $; ++O)
        P = k[O], W = Te(P, this), W = [W, this.__zoom.invert(W), P.identifier], L.touch0 ? !L.touch1 && L.touch0[2] !== W[2] && (L.touch1 = W, L.taps = 0) : (L.touch0 = W, C = !0, L.taps = 1 + !!d);
      d && (d = clearTimeout(d)), C && (L.taps < 2 && (f = W[0], d = setTimeout(function() {
        d = null;
      }, h)), Fn(this), L.start());
    }
  }
  function B(w, ...N) {
    if (this.__zooming) {
      var k = S(this, N).event(w), $ = w.changedTouches, L = $.length, C, O, P, W;
      for (Bt(w), C = 0; C < L; ++C)
        O = $[C], P = Te(O, this), k.touch0 && k.touch0[2] === O.identifier ? k.touch0[0] = P : k.touch1 && k.touch1[2] === O.identifier && (k.touch1[0] = P);
      if (O = k.that.__zoom, k.touch1) {
        var j = k.touch0[0], Y = k.touch0[1], q = k.touch1[0], te = k.touch1[1], U = (U = q[0] - j[0]) * U + (U = q[1] - j[1]) * U, R = (R = te[0] - Y[0]) * R + (R = te[1] - Y[1]) * R;
        O = _(O, Math.sqrt(U / R)), P = [(j[0] + q[0]) / 2, (j[1] + q[1]) / 2], W = [(Y[0] + te[0]) / 2, (Y[1] + te[1]) / 2];
      } else if (k.touch0) P = k.touch0[0], W = k.touch0[1];
      else return;
      k.zoom("touch", n(y(O, P, W), k.extent, s));
    }
  }
  function D(w, ...N) {
    if (this.__zooming) {
      var k = S(this, N).event(w), $ = w.changedTouches, L = $.length, C, O;
      for (Kr(w), u && clearTimeout(u), u = setTimeout(function() {
        u = null;
      }, h), C = 0; C < L; ++C)
        O = $[C], k.touch0 && k.touch0[2] === O.identifier ? delete k.touch0 : k.touch1 && k.touch1[2] === O.identifier && delete k.touch1;
      if (k.touch1 && !k.touch0 && (k.touch0 = k.touch1, delete k.touch1), k.touch0) k.touch0[1] = this.__zoom.invert(k.touch0[0]);
      else if (k.end(), k.taps === 2 && (O = Te(O, this), Math.hypot(f[0] - O[0], f[1] - O[1]) < b)) {
        var P = Ce(this).on("dblclick.zoom");
        P && P.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : zn(+w), m) : r;
  }, m.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : zn(!!w), m) : e;
  }, m.touchable = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : zn(!!w), m) : o;
  }, m.extent = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : zn([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), m) : t;
  }, m.scaleExtent = function(w) {
    return arguments.length ? (i[0] = +w[0], i[1] = +w[1], m) : [i[0], i[1]];
  }, m.translateExtent = function(w) {
    return arguments.length ? (s[0][0] = +w[0][0], s[1][0] = +w[1][0], s[0][1] = +w[0][1], s[1][1] = +w[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(w) {
    return arguments.length ? (n = w, m) : n;
  }, m.duration = function(w) {
    return arguments.length ? (a = +w, m) : a;
  }, m.interpolate = function(w) {
    return arguments.length ? (l = w, m) : l;
  }, m.on = function() {
    var w = c.on.apply(c, arguments);
    return w === c ? m : w;
  }, m.clickDistance = function(w) {
    return arguments.length ? (v = (w = +w) * w, m) : Math.sqrt(v);
  }, m.tapDistance = function(w) {
    return arguments.length ? (b = +w, m) : b;
  }, m;
}
const Re = {
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
}, Qt = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Ga = ["Enter", " ", "Escape"], Xa = {
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
var It;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(It || (It = {}));
var gt;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(gt || (gt = {}));
var Jt;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Jt || (Jt = {}));
const Ua = {
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
var st;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(st || (st = {}));
var At;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(At || (At = {}));
var G;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(G || (G = {}));
const ji = {
  [G.Left]: G.Right,
  [G.Right]: G.Left,
  [G.Top]: G.Bottom,
  [G.Bottom]: G.Top
}, qa = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, J0 = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Wo = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), un = (e, t = [0, 0]) => {
  const { width: n, height: r } = We(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, ey = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Wo(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, gr(o, nr(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? mr(r) : { x: 0, y: 0, width: 0, height: 0 };
}, fn = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = gr(n, nr(o)), r = !0);
  }), r ? mr(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Fo = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, f = [];
  for (const u of e.values()) {
    const { measured: h, selectable: g = !0, hidden: v = !1 } = u;
    if (s && !g || v)
      continue;
    const b = h.width ?? u.width ?? u.initialWidth ?? 0, m = h.height ?? u.height ?? u.initialHeight ?? 0, { x: _, y } = u.internals.positionAbsolute, x = Ja(a, l, c, d, _, y, b, m), E = b * m, S = i && x > 0;
    (!u.internals.handleBounds || S || x >= E || u.dragging) && f.push(u);
  }
  return f;
}, ty = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function ny(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = We(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function ry({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = ny(e, s), l = fn(a), c = yr(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function Ka({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, d = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Re.error005());
    else {
      const { width: h, height: g } = We(a);
      h && g && (f = [
        [l, c],
        [l + h, c + g]
      ]);
    }
  else a && xt(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const u = xt(f) ? wt(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Re.error015())), {
    position: {
      x: u.x - l + (s.measured.width ?? 0) * d[0],
      y: u.y - c + (s.measured.height ?? 0) * d[1]
    },
    positionAbsolute: u
  };
}
async function oy({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((u) => u.id)), s = [];
  for (const u of n) {
    if (u.deletable === !1)
      continue;
    const h = i.has(u.id), g = !h && u.parentId && s.find((v) => v.id === u.parentId);
    (h || g) && s.push(u);
  }
  const a = new Set(t.map((u) => u.id)), l = r.filter((u) => u.deletable !== !1), d = ty(s, l);
  for (const u of l)
    a.has(u.id) && !d.find((g) => g.id === u.id) && d.push(u);
  if (!o)
    return {
      edges: d,
      nodes: s
    };
  const f = await o({
    nodes: s,
    edges: d
  });
  return typeof f == "boolean" ? f ? { edges: d, nodes: s } : { edges: [], nodes: [] } : f;
}
const zt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), wt = (e = { x: 0, y: 0 }, t, n) => ({
  x: zt(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: zt(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function Za(e, t, n) {
  const { width: r, height: o } = We(n), { x: i, y: s } = n.internals.positionAbsolute;
  return wt(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const Gi = (e, t, n) => e < t ? zt(Math.abs(e - t), 1, t) / t : e > n ? -zt(Math.abs(e - n), 1, t) / t : 0, Yo = (e, t, n = 15, r = 40) => {
  const o = Gi(e.x, r, t.width - r) * n, i = Gi(e.y, r, t.height - r) * n;
  return [o, i];
}, gr = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), wo = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), mr = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), en = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Wo(e) ? e.internals.positionAbsolute : un(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, nr = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Wo(e) ? e.internals.positionAbsolute : un(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, Qa = (e, t) => mr(gr(wo(e), wo(t))), Ja = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, rr = (e, t) => Ja(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Xi = (e) => Oe(e.width) && Oe(e.height) && Oe(e.x) && Oe(e.y), Oe = (e) => !isNaN(e) && isFinite(e), el = (e, t) => (n, r) => {
}, hn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), pn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? hn(a, s) : a;
}, Tt = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function Et(e, t) {
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
function iy(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = Et(e, n), o = Et(e, t);
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
    const r = Et(e.top ?? e.y ?? 0, n), o = Et(e.bottom ?? e.y ?? 0, n), i = Et(e.left ?? e.x ?? 0, t), s = Et(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function sy(e, t, n, r, o, i) {
  const { x: s, y: a } = Tt(e, [t, n, r]), { x: l, y: c } = Tt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(f)
  };
}
const yr = (e, t, n, r, o, i) => {
  const s = iy(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = zt(c, r, o), f = e.x + e.width / 2, u = e.y + e.height / 2, h = t / 2 - f * d, g = n / 2 - u * d, v = sy(e, h, g, d, t, n), b = {
    left: Math.min(v.left - s.left, 0),
    top: Math.min(v.top - s.top, 0),
    right: Math.min(v.right - s.right, 0),
    bottom: Math.min(v.bottom - s.bottom, 0)
  };
  return {
    x: h - b.left + b.right,
    y: g - b.top + b.bottom,
    zoom: d
  };
}, tn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function xt(e) {
  return e != null && e !== "parent";
}
function We(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function tl(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function nl(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Ui(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function ay() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function ly(e) {
  return { ...Xa, ...e || {} };
}
function rl(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function Gt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Pe(e), a = pn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? hn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const jo = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), ol = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, cy = ["INPUT", "SELECT", "TEXTAREA"];
function il(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : cy.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const sl = (e) => "clientX" in e, Pe = (e, t) => {
  var i, s;
  const n = sl(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, qi = (e, t, n, r, o) => {
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
      ...jo(s)
    };
  });
};
function al({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, d, f];
}
function Tn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Ki({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case G.Left:
      return [t - Tn(t - r, i), n];
    case G.Right:
      return [t + Tn(r - t, i), n];
    case G.Top:
      return [t, n - Tn(n - o, i)];
    case G.Bottom:
      return [t, n + Tn(o - n, i)];
  }
}
function ll({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top, curvature: s = 0.25 }) {
  const [a, l] = Ki({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = Ki({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, u, h, g] = al({
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
    f,
    u,
    h,
    g
  ];
}
function cl({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function dy({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function uy({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = gr(nr(e), nr(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return rr(s, mr(i)) > 0;
}
const fy = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, hy = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), py = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Re.error006()), t;
  const r = n.getEdgeId || fy;
  let o;
  return qa(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, hy(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function dl({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = cl({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const Zi = {
  [G.Left]: { x: -1, y: 0 },
  [G.Right]: { x: 1, y: 0 },
  [G.Top]: { x: 0, y: -1 },
  [G.Bottom]: { x: 0, y: 1 }
}, gy = ({ source: e, sourcePosition: t = G.Bottom, target: n }) => t === G.Left || t === G.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Qi = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function my({ source: e, sourcePosition: t = G.Bottom, target: n, targetPosition: r = G.Top, center: o, offset: i, stepPosition: s }) {
  const a = Zi[t], l = Zi[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, f = gy({
    source: c,
    sourcePosition: t,
    target: d
  }), u = f.x !== 0 ? "x" : "y", h = f[u];
  let g = [], v, b;
  const m = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , y, x] = cl({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[u] * l[u] === -1) {
    u === "x" ? (v = o.x ?? c.x + (d.x - c.x) * s, b = o.y ?? (c.y + d.y) / 2) : (v = o.x ?? (c.x + d.x) / 2, b = o.y ?? c.y + (d.y - c.y) * s);
    const z = [
      { x: v, y: c.y },
      { x: v, y: d.y }
    ], I = [
      { x: c.x, y: b },
      { x: d.x, y: b }
    ];
    a[u] === h ? g = u === "x" ? z : I : g = u === "x" ? I : z;
  } else {
    const z = [{ x: c.x, y: d.y }], I = [{ x: d.x, y: c.y }];
    if (u === "x" ? g = a.x === h ? I : z : g = a.y === h ? z : I, t === r) {
      const w = Math.abs(e[u] - n[u]);
      if (w <= i) {
        const N = Math.min(i - 1, i - w);
        a[u] === h ? m[u] = (c[u] > e[u] ? -1 : 1) * N : _[u] = (d[u] > n[u] ? -1 : 1) * N;
      }
    }
    if (t !== r) {
      const w = u === "x" ? "y" : "x", N = a[u] === l[w], k = c[w] > d[w], $ = c[w] < d[w];
      (a[u] === 1 && (!N && k || N && $) || a[u] !== 1 && (!N && $ || N && k)) && (g = u === "x" ? z : I);
    }
    const V = { x: c.x + m.x, y: c.y + m.y }, T = { x: d.x + _.x, y: d.y + _.y }, B = Math.max(Math.abs(V.x - g[0].x), Math.abs(T.x - g[0].x)), D = Math.max(Math.abs(V.y - g[0].y), Math.abs(T.y - g[0].y));
    B >= D ? (v = (V.x + T.x) / 2, b = g[0].y) : (v = g[0].x, b = (V.y + T.y) / 2);
  }
  const E = { x: c.x + m.x, y: c.y + m.y }, S = { x: d.x + _.x, y: d.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...E.x !== g[0].x || E.y !== g[0].y ? [E] : [],
    ...g,
    ...S.x !== g[g.length - 1].x || S.y !== g[g.length - 1].y ? [S] : [],
    n
  ], v, b, y, x];
}
function yy(e, t, n, r) {
  const o = Math.min(Qi(e, t) / 2, Qi(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * d}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function xo({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: d = 0.5 }) {
  const [f, u, h, g, v] = my({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: d
  });
  let b = `M${f[0].x} ${f[0].y}`;
  for (let m = 1; m < f.length - 1; m++)
    b += yy(f[m - 1], f[m], f[m + 1], s);
  return b += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [b, u, h, g, v];
}
function Ji(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function wy(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!Ji(t) || !Ji(n))
    return null;
  const r = t.internals.handleBounds || es(t.handles), o = n.internals.handleBounds || es(n.handles), i = ts((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = ts(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === It.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Re.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || G.Bottom, l = (s == null ? void 0 : s.position) || G.Top, c = bt(t, i, a), d = bt(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: d.x,
    targetY: d.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function es(e) {
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
function bt(e, t, n = G.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? We(e);
  if (r)
    return { x: o + s / 2, y: i + a / 2 };
  switch ((t == null ? void 0 : t.position) ?? n) {
    case G.Top:
      return { x: o + s / 2, y: i };
    case G.Right:
      return { x: o + s, y: i + a / 2 };
    case G.Bottom:
      return { x: o + s / 2, y: i + a };
    case G.Left:
      return { x: o, y: i + a / 2 };
  }
}
function ts(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function bo(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function xy(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = bo(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const ul = 1e3, by = 10, Go = {
  nodeOrigin: [0, 0],
  nodeExtent: Qt,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, vy = {
  ...Go,
  checkEquality: !0
};
function Xo(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function _y(e, t, n) {
  const r = Xo(Go, n);
  for (const o of e.values())
    if (o.parentId)
      qo(o, e, t, r);
    else {
      const i = un(o, r.nodeOrigin), s = xt(o.extent) ? o.extent : r.nodeExtent, a = wt(i, s, We(o));
      o.internals.positionAbsolute = a;
    }
}
function ky(e, t) {
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
function Uo(e) {
  return e === "manual";
}
function vo(e, t, n, r = {}) {
  var d, f;
  const o = Xo(vy, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !Uo(o.zIndexMode) ? ul : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let h = s.get(u.id);
    if (o.checkEquality && u === (h == null ? void 0 : h.internals.userNode))
      t.set(u.id, h);
    else {
      const g = un(u, o.nodeOrigin), v = xt(u.extent) ? u.extent : o.nodeExtent, b = wt(g, v, We(u));
      h = {
        ...o.defaults,
        ...u,
        measured: {
          width: (d = u.measured) == null ? void 0 : d.width,
          height: (f = u.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: b,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: ky(u, h),
          z: fl(u, a, o.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, h);
    }
    (h.measured === void 0 || h.measured.width === void 0 || h.measured.height === void 0) && !h.hidden && (l = !1), u.parentId && qo(h, t, n, r, i), c || (c = u.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Ey(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function qo(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Xo(Go, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Ey(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * by), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const f = i && !Uo(l) ? ul : 0, { x: u, y: h, z: g } = Sy(e, d, s, a, f, l), { positionAbsolute: v } = e.internals, b = u !== v.x || h !== v.y;
  (b || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: b ? { x: u, y: h } : v,
      z: g
    }
  });
}
function fl(e, t, n) {
  const r = Oe(e.zIndex) ? e.zIndex : 0;
  return Uo(n) ? r : r + (e.selected ? t : 0);
}
function Sy(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = We(e), c = un(e, n), d = xt(e.extent) ? wt(c, e.extent, l) : c;
  let f = wt({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (f = Za(f, l, t));
  const u = fl(e, o, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= u ? h + 1 : u
  };
}
function Ko(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? en(l), d = Qa(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var y;
    const d = l.internals.positionAbsolute, f = We(l), u = l.origin ?? r, h = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, v = Math.max(f.width, Math.round(a.width)), b = Math.max(f.height, Math.round(a.height)), m = (v - f.width) * u[0], _ = (b - f.height) * u[1];
    (h > 0 || g > 0 || m || _) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - h + m,
        y: l.position.y - g + _
      }
    }), (y = n.get(c)) == null || y.forEach((x) => {
      e.some((E) => E.id === x.id) || o.push({
        id: x.id,
        type: "position",
        position: {
          x: x.position.x + h,
          y: x.position.y + g
        }
      });
    })), (f.width < a.width || f.height < a.height || h || g) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: v + (h ? u[0] * h - m : 0),
        height: b + (g ? u[1] * g - _ : 0)
      }
    });
  }), o;
}
function Ny(e, t, n, r, o, i, s) {
  const a = r == null ? void 0 : r.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], d = window.getComputedStyle(a), { m22: f } = new window.DOMMatrixReadOnly(d.transform), u = [];
  for (const h of e.values()) {
    const g = t.get(h.id);
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
    const v = jo(h.nodeElement), b = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (b || !g.internals.handleBounds || h.force))) {
      const _ = h.nodeElement.getBoundingClientRect(), y = xt(g.extent) ? g.extent : i;
      let { positionAbsolute: x } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const S = t.get(g.parentId);
        S && (x = Za(x, v, S));
      } else y && (x = wt(x, y, v));
      const E = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: x,
          handleBounds: {
            source: qi("source", h.nodeElement, _, f, g.id),
            target: qi("target", h.nodeElement, _, f, g.id)
          }
        }
      };
      t.set(g.id, E), g.parentId && qo(E, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, b && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && u.push({
        id: g.id,
        parentId: g.parentId,
        rect: en(E, o)
      }));
    }
  }
  if (u.length > 0) {
    const h = Ko(u, t, n, o);
    c.push(...h);
  }
  return { changes: c, updatedInternals: l };
}
async function Cy({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function ns(e, t, n, r, o, i) {
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
function hl(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    ns("source", l, d, e, o, s), ns("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function pl(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : pl(n, t) : !1;
}
function rs(e, t, n) {
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
function My(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !pl(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function Zr({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
  var s, a, l;
  const o = [];
  for (const [c, d] of t) {
    const f = (s = n.get(c)) == null ? void 0 : s.internals.userNode;
    f && o.push({
      ...f,
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
function $y({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = hn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function Iy({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, f = !1, u = null, h = !1, g = !1, v = null;
  function b({ noDragClassName: _, handleSelector: y, domNode: x, isSelectable: E, nodeId: S, nodeClickDistance: M = 0 }) {
    u = Ce(x);
    function z({ x: B, y: D }) {
      const { nodeLookup: w, nodeExtent: N, snapGrid: k, snapToGrid: $, nodeOrigin: L, onNodeDrag: C, onSelectionDrag: O, onError: P, updateNodePositions: W } = t();
      i = { x: B, y: D };
      let j = !1;
      const Y = a.size > 1, q = Y && N ? wo(fn(a)) : null, te = Y && $ ? $y({
        dragItems: a,
        snapGrid: k,
        x: B,
        y: D
      }) : null;
      for (const [U, R] of a) {
        if (!w.has(U))
          continue;
        let F = { x: B - R.distance.x, y: D - R.distance.y };
        $ && (F = te ? {
          x: Math.round(F.x + te.x),
          y: Math.round(F.y + te.y)
        } : hn(F, k));
        let K = null;
        if (Y && N && !R.extent && q) {
          const { positionAbsolute: Q } = R.internals, ee = Q.x - q.x + N[0][0], ne = Q.x + R.measured.width - q.x2 + N[1][0], oe = Q.y - q.y + N[0][1], ce = Q.y + R.measured.height - q.y2 + N[1][1];
          K = [
            [ee, oe],
            [ne, ce]
          ];
        }
        const { position: Z, positionAbsolute: X } = Ka({
          nodeId: U,
          nextPosition: F,
          nodeLookup: w,
          nodeExtent: K || N,
          nodeOrigin: L,
          onError: P
        });
        j = j || R.position.x !== Z.x || R.position.y !== Z.y, R.position = Z, R.internals.positionAbsolute = X;
      }
      if (g = g || j, !!j && (W(a, !0), v && (r || C || !S && O))) {
        const [U, R] = Zr({
          nodeId: S,
          dragItems: a,
          nodeLookup: w
        });
        r == null || r(v, a, U, R), C == null || C(v, U, R), S || O == null || O(v, R);
      }
    }
    async function I() {
      if (!d)
        return;
      const { transform: B, panBy: D, autoPanSpeed: w, autoPanOnNodeDrag: N } = t();
      if (!N) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [k, $] = Yo(c, d, w);
      (k !== 0 || $ !== 0) && (i.x = (i.x ?? 0) - k / B[2], i.y = (i.y ?? 0) - $ / B[2], await D({ x: k, y: $ }) && z(i)), s = requestAnimationFrame(I);
    }
    function V(B) {
      var Y;
      const { nodeLookup: D, multiSelectionActive: w, nodesDraggable: N, transform: k, snapGrid: $, snapToGrid: L, selectNodesOnDrag: C, onNodeDragStart: O, onSelectionDragStart: P, unselectNodesAndEdges: W } = t();
      f = !0, (!C || !E) && !w && S && ((Y = D.get(S)) != null && Y.selected || W()), E && C && S && (e == null || e(S));
      const j = Gt(B.sourceEvent, { transform: k, snapGrid: $, snapToGrid: L, containerBounds: d });
      if (i = j, a = My(D, N, j, S), a.size > 0 && (n || O || !S && P)) {
        const [q, te] = Zr({
          nodeId: S,
          dragItems: a,
          nodeLookup: D
        });
        n == null || n(B.sourceEvent, a, q, te), O == null || O(B.sourceEvent, q, te), S || P == null || P(B.sourceEvent, te);
      }
    }
    const T = Ia().clickDistance(M).on("start", (B) => {
      const { domNode: D, nodeDragThreshold: w, transform: N, snapGrid: k, snapToGrid: $ } = t();
      d = (D == null ? void 0 : D.getBoundingClientRect()) || null, h = !1, g = !1, v = B.sourceEvent, w === 0 && V(B), i = Gt(B.sourceEvent, { transform: N, snapGrid: k, snapToGrid: $, containerBounds: d }), c = Pe(B.sourceEvent, d);
    }).on("drag", (B) => {
      const { autoPanOnNodeDrag: D, transform: w, snapGrid: N, snapToGrid: k, nodeDragThreshold: $, nodeLookup: L } = t(), C = Gt(B.sourceEvent, { transform: w, snapGrid: N, snapToGrid: k, containerBounds: d });
      if (v = B.sourceEvent, (B.sourceEvent.type === "touchmove" && B.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      S && !L.has(S)) && (h = !0), !h) {
        if (!l && D && f && (l = !0, I()), !f) {
          const O = Pe(B.sourceEvent, d), P = O.x - c.x, W = O.y - c.y;
          Math.sqrt(P * P + W * W) > $ && V(B);
        }
        (i.x !== C.xSnapped || i.y !== C.ySnapped) && a && f && (c = Pe(B.sourceEvent, d), z(C));
      }
    }).on("end", (B) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: D, updateNodePositions: w, onNodeDragStop: N, onSelectionDragStop: k } = t();
        if (g && (w(a, !1), g = !1), o || N || !S && k) {
          const [$, L] = Zr({
            nodeId: S,
            dragItems: a,
            nodeLookup: D,
            dragging: !1
          });
          o == null || o(B.sourceEvent, a, $, L), N == null || N(B.sourceEvent, $, L), S || k == null || k(B.sourceEvent, L);
        }
      }
    }).filter((B) => {
      const D = B.target;
      return !B.button && (!_ || !rs(D, `.${_}`, x)) && (!y || rs(D, y, x));
    });
    u.call(T);
  }
  function m() {
    u == null || u.on(".drag", null);
  }
  return {
    update: b,
    destroy: m
  };
}
function Ay(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    rr(o, en(i)) > 0 && r.push(i);
  return r;
}
const zy = 250;
function Ty(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = Ay(e, n, t + zy);
  for (const c of s) {
    const d = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of d) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: u, y: h } = bt(c, f, f.position, !0), g = Math.sqrt(Math.pow(u - e.x, 2) + Math.pow(h - e.y, 2));
      g > t || (g < i ? (o = [{ ...f, x: u, y: h }], i = g) : g === i && o.push({ ...f, x: u, y: h }));
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
function gl(e, t, n, r, o, i = !1) {
  var c, d, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((u) => u.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...bt(s, l, l.position, !0) } : l;
}
function ml(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function Ly(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const yl = () => !0;
function Oy(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: f, panBy: u, cancelConnection: h, onConnectStart: g, onConnect: v, onConnectEnd: b, isValidConnection: m = yl, onReconnectEnd: _, updateConnection: y, getTransform: x, getFromHandle: E, autoPanSpeed: S, dragThreshold: M = 1, handleDomNode: z }) {
  const I = ol(e.target);
  let V = 0, T;
  const { x: B, y: D } = Pe(e), w = ml(i, z), N = a == null ? void 0 : a.getBoundingClientRect();
  let k = !1;
  if (!N || !w)
    return;
  const $ = gl(o, w, r, l, t);
  if (!$)
    return;
  let L = Pe(e, N), C = !1, O = null, P = !1, W = null;
  function j() {
    if (!d || !N)
      return;
    const [Z, X] = Yo(L, N, S);
    u({ x: Z, y: X }), V = requestAnimationFrame(j);
  }
  const Y = {
    ...$,
    nodeId: o,
    type: w,
    position: $.position
  }, q = l.get(o);
  let U = {
    inProgress: !0,
    isValid: null,
    from: bt(q, Y, G.Left, !0),
    fromHandle: Y,
    fromPosition: Y.position,
    fromNode: q,
    to: L,
    toHandle: null,
    toPosition: ji[Y.position],
    toNode: null,
    pointer: L
  };
  function R() {
    k = !0, y(U), g == null || g(e, { nodeId: o, handleId: r, handleType: w });
  }
  M === 0 && R();
  function F(Z) {
    if (!k) {
      const { x: ce, y: ue } = Pe(Z), Ee = ce - B, be = ue - D;
      if (!(Ee * Ee + be * be > M * M))
        return;
      R();
    }
    if (!E() || !Y) {
      K(Z);
      return;
    }
    const X = x();
    L = Pe(Z, N), T = Ty(pn(L, X, !1, [1, 1]), n, l, Y), C || (j(), C = !0);
    const Q = wl(Z, {
      handle: T,
      connectionMode: t,
      fromNodeId: o,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: I,
      lib: c,
      flowId: f,
      nodeLookup: l
    });
    W = Q.handleDomNode, O = Q.connection, P = Ly(!!T, Q.isValid);
    const ee = l.get(o), ne = ee ? bt(ee, Y, G.Left, !0) : U.from, oe = {
      ...U,
      from: ne,
      isValid: P,
      to: Q.toHandle && P ? Tt({ x: Q.toHandle.x, y: Q.toHandle.y }, X) : L,
      toHandle: Q.toHandle,
      toPosition: P && Q.toHandle ? Q.toHandle.position : ji[Y.position],
      toNode: Q.toHandle ? l.get(Q.toHandle.nodeId) : null,
      pointer: L
    };
    y(oe), U = oe;
  }
  function K(Z) {
    if (!("touches" in Z && Z.touches.length > 0)) {
      if (k) {
        (T || W) && O && P && (v == null || v(O));
        const { inProgress: X, ...Q } = U, ee = {
          ...Q,
          toPosition: U.toHandle ? U.toPosition : null
        };
        b == null || b(Z, ee), i && (_ == null || _(Z, ee));
      }
      h(), cancelAnimationFrame(V), C = !1, P = !1, O = null, W = null, I.removeEventListener("mousemove", F), I.removeEventListener("mouseup", K), I.removeEventListener("touchmove", F), I.removeEventListener("touchend", K);
    }
  }
  I.addEventListener("mousemove", F), I.addEventListener("mouseup", K), I.addEventListener("touchmove", F), I.addEventListener("touchend", K);
}
function wl(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = yl, nodeLookup: d }) {
  const f = i === "target", u = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: h, y: g } = Pe(e), v = s.elementFromPoint(h, g), b = v != null && v.classList.contains(`${a}-flow__handle`) ? v : u, m = {
    handleDomNode: b,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (b) {
    const _ = ml(void 0, b), y = b.getAttribute("data-nodeid"), x = b.getAttribute("data-handleid"), E = b.classList.contains("connectable"), S = b.classList.contains("connectableend");
    if (!y || !_)
      return m;
    const M = {
      source: f ? y : r,
      sourceHandle: f ? x : o,
      target: f ? r : y,
      targetHandle: f ? o : x
    };
    m.connection = M;
    const I = E && S && (n === It.Strict ? f && _ === "source" || !f && _ === "target" : y !== r || x !== o);
    m.isValid = I && c(M), m.toHandle = gl(y, _, x, d, n, !0);
  }
  return m;
}
const _o = {
  onPointerDown: Oy,
  isValid: wl
};
function Py({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Ce(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: f = !0, zoomable: u = !0, inversePan: h = !1 }) {
    const g = (y) => {
      if (y.sourceEvent.type !== "wheel" || !t)
        return;
      const x = n(), E = y.sourceEvent.ctrlKey && tn() ? 10 : 1, S = -y.sourceEvent.deltaY * (y.sourceEvent.deltaMode === 1 ? 0.05 : y.sourceEvent.deltaMode ? 1 : 2e-3) * d, M = x[2] * Math.pow(2, S * E);
      t.scaleTo(M);
    };
    let v = [0, 0];
    const b = (y) => {
      (y.sourceEvent.type === "mousedown" || y.sourceEvent.type === "touchstart") && (v = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ]);
    }, m = (y) => {
      const x = n();
      if (y.sourceEvent.type !== "mousemove" && y.sourceEvent.type !== "touchmove" || !t)
        return;
      const E = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ], S = [E[0] - v[0], E[1] - v[1]];
      v = E;
      const M = r() * Math.max(x[2], Math.log(x[2])) * (h ? -1 : 1), z = {
        x: x[0] - S[0] * M,
        y: x[1] - S[1] * M
      }, I = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: z.x,
        y: z.y,
        zoom: x[2]
      }, I, a);
    }, _ = ja().on("start", b).on("zoom", f ? m : null).on("zoom.wheel", u ? g : null);
    o.call(_, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: Te
  };
}
const wr = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Qr = ({ x: e, y: t, zoom: n }) => pr.translate(e, t).scale(n), it = (e, t) => e.target.closest(`.${t}`), xl = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Dy = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Jr = (e, t = 0, n = Dy, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, bl = (e) => {
  const t = e.ctrlKey && tn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Ry({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (it(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const b = Te(d), m = bl(d), _ = f * Math.pow(2, m);
      r.scaleTo(n, _, b, d);
      return;
    }
    const u = d.deltaMode === 1 ? 20 : 1;
    let h = o === gt.Vertical ? 0 : d.deltaX * u, g = o === gt.Horizontal ? 0 : d.deltaY * u;
    !tn() && d.shiftKey && o !== gt.Vertical && (h = d.deltaY * u, g = 0), r.translateBy(
      n,
      -(h / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = wr(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, v) : (e.isPanScrolling = !0, a == null || a(d, v)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function Hy({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = it(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function By({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = wr(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function Vy({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && xl(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, wr(i.transform)));
  };
}
function Wy({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && xl(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = wr(s.transform);
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
function Fy({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: f }) {
  return (u) => {
    var m;
    const h = t || n, g = r && u.ctrlKey, v = u.type === "wheel";
    if (u.button === 1 && u.type === "mousedown" && (it(u, `${d}-flow__node`) || it(u, `${d}-flow__edge`) || it(u, `${d}-flow__selection`) || it(u, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !h && !i && !s && !r || a || f && !v || it(u, l) && v || it(u, c) && (!v || i && v && !t) || !r && u.ctrlKey && v)
      return !1;
    if (!r && u.type === "touchstart" && ((m = u.touches) == null ? void 0 : m.length) > 1)
      return u.preventDefault(), !1;
    if (!h && !i && !g && v || !o && (u.type === "mousedown" || u.type === "touchstart") || Array.isArray(o) && !o.includes(u.button) && u.type === "mousedown")
      return !1;
    const b = Array.isArray(o) && o.includes(u.button) || !u.button || u.button <= 1;
    return (!u.ctrlKey || v || e) && b;
  };
}
function Yy({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
  const c = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, d = e.getBoundingClientRect();
  let f = [
    [0, 0],
    [d.width, d.height]
  ];
  const u = typeof ResizeObserver < "u" ? new ResizeObserver((D) => {
    const w = D[0];
    w && (f = [
      [0, 0],
      [w.contentRect.width, w.contentRect.height]
    ]);
  }) : null;
  u == null || u.observe(e);
  const h = ja().extent(() => f).scaleExtent([t, n]).translateExtent(r), g = Ce(e).call(h);
  x({
    x: o.x,
    y: o.y,
    zoom: zt(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const v = g.on("wheel.zoom"), b = g.on("dblclick.zoom");
  h.wheelDelta(bl);
  async function m(D, w) {
    return g ? new Promise((N) => {
      h == null || h.interpolate((w == null ? void 0 : w.interpolate) === "linear" ? jt : Bn).transform(Jr(g, w == null ? void 0 : w.duration, w == null ? void 0 : w.ease, () => N(!0)), D);
    }) : !1;
  }
  function _({ noWheelClassName: D, noPanClassName: w, onPaneContextMenu: N, userSelectionActive: k, panOnScroll: $, panOnDrag: L, panOnScrollMode: C, panOnScrollSpeed: O, preventScrolling: P, zoomOnPinch: W, zoomOnScroll: j, zoomOnDoubleClick: Y, panActivationKeyPressed: q = !1, zoomActivationKeyPressed: te, lib: U, onTransformChange: R, connectionInProgress: F, paneClickDistance: K, selectionOnDrag: Z }) {
    k && !c.isZoomingOrPanning && y();
    const X = $ && !te && !k;
    h.clickDistance(Z ? 1 / 0 : !Oe(K) || K < 0 ? 0 : K);
    const Q = X ? Ry({
      zoomPanValues: c,
      noWheelClassName: D,
      d3Selection: g,
      d3Zoom: h,
      panOnScrollMode: C,
      panOnScrollSpeed: O,
      zoomOnPinch: W,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : Hy({
      noWheelClassName: D,
      preventScrolling: P,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", Q, { passive: !1 });
    const ee = By({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    h.on("start", ee);
    const ne = Vy({
      zoomPanValues: c,
      panOnDrag: L,
      onPaneContextMenu: !!N,
      onPanZoom: i,
      onTransformChange: R
    });
    h.on("zoom", ne);
    const oe = Wy({
      zoomPanValues: c,
      panOnDrag: L,
      panOnScroll: $,
      onPaneContextMenu: N,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    h.on("end", oe);
    const ce = Fy({
      panActivationKeyPressed: q,
      zoomActivationKeyPressed: te,
      panOnDrag: L,
      zoomOnScroll: j,
      panOnScroll: $,
      zoomOnDoubleClick: Y,
      zoomOnPinch: W,
      userSelectionActive: k,
      noPanClassName: w,
      noWheelClassName: D,
      lib: U,
      connectionInProgress: F
    });
    h.filter(ce), Y ? g.on("dblclick.zoom", b) : g.on("dblclick.zoom", null);
  }
  function y() {
    h.on("zoom", null);
  }
  async function x(D, w, N) {
    const k = Qr(D), $ = h == null ? void 0 : h.constrain()(k, w, N);
    return $ && await m($), $;
  }
  async function E(D, w) {
    const N = Qr(D);
    return await m(N, w), N;
  }
  function S(D) {
    if (g) {
      const w = Qr(D), N = g.property("__zoom");
      (N.k !== D.zoom || N.x !== D.x || N.y !== D.y) && (h == null || h.transform(g, w, null, { sync: !0 }));
    }
  }
  function M() {
    const D = g ? Ya(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: D.x, y: D.y, zoom: D.k };
  }
  async function z(D, w) {
    return g ? new Promise((N) => {
      h == null || h.interpolate((w == null ? void 0 : w.interpolate) === "linear" ? jt : Bn).scaleTo(Jr(g, w == null ? void 0 : w.duration, w == null ? void 0 : w.ease, () => N(!0)), D);
    }) : !1;
  }
  async function I(D, w) {
    return g ? new Promise((N) => {
      h == null || h.interpolate((w == null ? void 0 : w.interpolate) === "linear" ? jt : Bn).scaleBy(Jr(g, w == null ? void 0 : w.duration, w == null ? void 0 : w.ease, () => N(!0)), D);
    }) : !1;
  }
  function V(D) {
    h == null || h.scaleExtent(D);
  }
  function T(D) {
    h == null || h.translateExtent(D);
  }
  function B(D) {
    const w = !Oe(D) || D < 0 ? 0 : D;
    h == null || h.clickDistance(w);
  }
  return {
    update: _,
    destroy: y,
    setViewport: E,
    setViewportConstrained: x,
    getViewport: M,
    scaleTo: z,
    scaleBy: I,
    setScaleExtent: V,
    setTranslateExtent: T,
    syncViewport: S,
    setClickDistance: B
  };
}
var Lt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Lt || (Lt = {}));
function jy({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function os(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function rt(e, t) {
  return Math.max(0, t - e);
}
function ot(e, t) {
  return Math.max(0, e - t);
}
function Ln(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function is(e, t) {
  return e ? !t : t;
}
function Gy(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: f } = t, u = d && f, { xSnapped: h, ySnapped: g } = n, { minWidth: v, maxWidth: b, minHeight: m, maxHeight: _ } = r, { x: y, y: x, width: E, height: S, aspectRatio: M } = e;
  let z = Math.floor(d ? h - e.pointerX : 0), I = Math.floor(f ? g - e.pointerY : 0);
  const V = E + (l ? -z : z), T = S + (c ? -I : I), B = -i[0] * E, D = -i[1] * S;
  let w = Ln(V, v, b), N = Ln(T, m, _);
  if (s) {
    let L = 0, C = 0;
    l && z < 0 ? L = rt(y + z + B, s[0][0]) : !l && z > 0 && (L = ot(y + V + B, s[1][0])), c && I < 0 ? C = rt(x + I + D, s[0][1]) : !c && I > 0 && (C = ot(x + T + D, s[1][1])), w = Math.max(w, L), N = Math.max(N, C);
  }
  if (a) {
    let L = 0, C = 0;
    l && z > 0 ? L = ot(y + z, a[0][0]) : !l && z < 0 && (L = rt(y + V, a[1][0])), c && I > 0 ? C = ot(x + I, a[0][1]) : !c && I < 0 && (C = rt(x + T, a[1][1])), w = Math.max(w, L), N = Math.max(N, C);
  }
  if (o) {
    if (d) {
      const L = Ln(V / M, m, _) * M;
      if (w = Math.max(w, L), s) {
        let C = 0;
        !l && !c || l && !c && u ? C = ot(x + D + V / M, s[1][1]) * M : C = rt(x + D + (l ? z : -z) / M, s[0][1]) * M, w = Math.max(w, C);
      }
      if (a) {
        let C = 0;
        !l && !c || l && !c && u ? C = rt(x + V / M, a[1][1]) * M : C = ot(x + (l ? z : -z) / M, a[0][1]) * M, w = Math.max(w, C);
      }
    }
    if (f) {
      const L = Ln(T * M, v, b) / M;
      if (N = Math.max(N, L), s) {
        let C = 0;
        !l && !c || c && !l && u ? C = ot(y + T * M + B, s[1][0]) / M : C = rt(y + (c ? I : -I) * M + B, s[0][0]) / M, N = Math.max(N, C);
      }
      if (a) {
        let C = 0;
        !l && !c || c && !l && u ? C = rt(y + T * M, a[1][0]) / M : C = ot(y + (c ? I : -I) * M, a[0][0]) / M, N = Math.max(N, C);
      }
    }
  }
  I = I + (I < 0 ? N : -N), z = z + (z < 0 ? w : -w), o && (u ? V > T * M ? I = (is(l, c) ? -z : z) / M : z = (is(l, c) ? -I : I) * M : d ? (I = z / M, c = l) : (z = I * M, l = c));
  const k = l ? y + z : y, $ = c ? x + I : x;
  return {
    width: E + (l ? -z : z),
    height: S + (c ? -I : I),
    x: i[0] * z * (l ? -1 : 1) + k,
    y: i[1] * I * (c ? -1 : 1) + $
  };
}
const vl = { width: 0, height: 0, x: 0, y: 0 }, Xy = {
  ...vl,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function Uy(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function qy({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Ce(e);
  let s = {
    controlDirection: os("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: f, resizeDirection: u, onResizeStart: h, onResize: g, onResizeEnd: v, shouldResize: b }) {
    let m = { ...vl }, _ = { ...Xy };
    s = {
      boundaries: d,
      resizeDirection: u,
      keepAspectRatio: f,
      controlDirection: os(c)
    };
    let y, x = null, E = [], S, M, z;
    const I = Ia().on("start", (V) => {
      const { nodeLookup: T, transform: B, snapGrid: D, snapToGrid: w, nodeOrigin: N, paneDomNode: k } = n();
      if (y = T.get(t), !y)
        return;
      x = (k == null ? void 0 : k.getBoundingClientRect()) ?? null;
      const { xSnapped: $, ySnapped: L } = Gt(V.sourceEvent, {
        transform: B,
        snapGrid: D,
        snapToGrid: w,
        containerBounds: x
      });
      m = {
        width: y.measured.width ?? 0,
        height: y.measured.height ?? 0,
        x: y.position.x ?? 0,
        y: y.position.y ?? 0
      }, _ = {
        ...m,
        pointerX: $,
        pointerY: L,
        aspectRatio: m.width / m.height
      }, S = void 0, M = xt(y.extent) ? y.extent : void 0, y.parentId && (y.extent === "parent" || y.expandParent) && (S = T.get(y.parentId)), S && y.extent === "parent" && (M = [
        [0, 0],
        [S.measured.width, S.measured.height]
      ]), E = [], z = void 0;
      for (const [C, O] of T)
        if (O.parentId === t && (E.push({
          id: C,
          position: { ...O.position },
          extent: O.extent
        }), O.extent === "parent" || O.expandParent)) {
          const P = Uy(O, y, O.origin ?? N);
          z ? z = [
            [Math.min(P[0][0], z[0][0]), Math.min(P[0][1], z[0][1])],
            [Math.max(P[1][0], z[1][0]), Math.max(P[1][1], z[1][1])]
          ] : z = P;
        }
      h == null || h(V, { ...m });
    }).on("drag", (V) => {
      const { transform: T, snapGrid: B, snapToGrid: D, nodeOrigin: w } = n(), N = Gt(V.sourceEvent, {
        transform: T,
        snapGrid: B,
        snapToGrid: D,
        containerBounds: x
      }), k = [];
      if (!y)
        return;
      const { x: $, y: L, width: C, height: O } = m, P = {}, W = y.origin ?? w, { width: j, height: Y, x: q, y: te } = Gy(_, s.controlDirection, N, s.boundaries, s.keepAspectRatio, W, M, z), U = j !== C, R = Y !== O, F = q !== $ && U, K = te !== L && R;
      if (!F && !K && !U && !R)
        return;
      const Z = {
        prevValues: { ...m },
        startX: _.x,
        startY: _.y,
        childNodes: E.map((ne) => ({
          ...ne,
          position: { ...ne.position }
        }))
      };
      if ((F || K || W[0] === 1 || W[1] === 1) && (P.x = F ? q : m.x, P.y = K ? te : m.y, m.x = P.x, m.y = P.y, E.length > 0)) {
        const ne = q - $, oe = te - L;
        for (const ce of E)
          ce.position = {
            x: ce.position.x - ne + W[0] * (j - C),
            y: ce.position.y - oe + W[1] * (Y - O)
          }, k.push(ce);
      }
      if ((U || R) && (P.width = U && (!s.resizeDirection || s.resizeDirection === "horizontal") ? j : m.width, P.height = R && (!s.resizeDirection || s.resizeDirection === "vertical") ? Y : m.height, m.width = P.width, m.height = P.height), S && y.expandParent) {
        const ne = W[0] * (P.width ?? 0);
        P.x && P.x < ne && (m.x = ne, _.x = _.x - (P.x - ne));
        const oe = W[1] * (P.height ?? 0);
        P.y && P.y < oe && (m.y = oe, _.y = _.y - (P.y - oe));
      }
      const X = jy({
        width: m.width,
        prevWidth: C,
        height: m.height,
        prevHeight: O,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), Q = { ...m, direction: X };
      if ((b == null ? void 0 : b(V, Q)) === !1) {
        m = Z.prevValues, _.x = Z.startX, _.y = Z.startY, E.forEach((ne, oe) => {
          ne.position = Z.childNodes[oe].position;
        });
        return;
      }
      g == null || g(V, Q), r(P, k);
    }).on("end", (V) => {
      v == null || v(V, { ...m }), o == null || o({ ...m });
    });
    i.call(I);
  }
  function l() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: l
  };
}
var _l = { exports: {} }, kl = {}, El = { exports: {} }, Sl = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ot = Io;
function Ky(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Zy = typeof Object.is == "function" ? Object.is : Ky, Qy = Ot.useState, Jy = Ot.useEffect, ew = Ot.useLayoutEffect, tw = Ot.useDebugValue;
function nw(e, t) {
  var n = t(), r = Qy({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return ew(
    function() {
      o.value = n, o.getSnapshot = t, eo(o) && i({ inst: o });
    },
    [e, n, t]
  ), Jy(
    function() {
      return eo(o) && i({ inst: o }), e(function() {
        eo(o) && i({ inst: o });
      });
    },
    [e]
  ), tw(n), n;
}
function eo(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Zy(e, n);
  } catch {
    return !0;
  }
}
function rw(e, t) {
  return t();
}
var ow = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? rw : nw;
Sl.useSyncExternalStore = Ot.useSyncExternalStore !== void 0 ? Ot.useSyncExternalStore : ow;
El.exports = Sl;
var iw = El.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xr = Io, sw = iw;
function aw(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var lw = typeof Object.is == "function" ? Object.is : aw, cw = sw.useSyncExternalStore, dw = xr.useRef, uw = xr.useEffect, fw = xr.useMemo, hw = xr.useDebugValue;
kl.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = dw(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = fw(
    function() {
      function l(h) {
        if (!c) {
          if (c = !0, d = h, h = r(h), o !== void 0 && s.hasValue) {
            var g = s.value;
            if (o(g, h))
              return f = g;
          }
          return f = h;
        }
        if (g = f, lw(d, h)) return g;
        var v = r(h);
        return o !== void 0 && o(g, v) ? (d = h, g) : (d = h, f = v);
      }
      var c = !1, d, f, u = n === void 0 ? null : n;
      return [
        function() {
          return l(t());
        },
        u === null ? void 0 : function() {
          return l(u());
        }
      ];
    },
    [t, n, r, o]
  );
  var a = cw(e, i[0], i[1]);
  return uw(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), hw(a), a;
};
_l.exports = kl;
var pw = _l.exports;
const gw = /* @__PURE__ */ Fs(pw), mw = {}, ss = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, f) => {
    const u = typeof d == "function" ? d(t) : d;
    if (!Object.is(u, t)) {
      const h = t;
      t = f ?? (typeof u != "object" || u === null) ? u : Object.assign({}, t, u), n.forEach((g) => g(t, h));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (mw ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, yw = (e) => e ? ss(e) : ss, { useDebugValue: ww } = Io, { useSyncExternalStoreWithSelector: xw } = gw, bw = (e) => e;
function Nl(e, t = bw, n) {
  const r = xw(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return ww(r), r;
}
const as = (e, t) => {
  const n = yw(e), r = (o, i = t) => Nl(n, o, i);
  return Object.assign(r, n), r;
}, vw = (e, t) => e ? as(e, t) : as;
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
const br = sr(null), _w = br.Provider, Cl = Re.error001("react");
function se(e, t) {
  const n = Pt(br);
  if (n === null)
    throw new Error(Cl);
  return Nl(n, e, t);
}
function he() {
  const e = Pt(br);
  if (e === null)
    throw new Error(Cl);
  return ae(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const ls = { display: "none" }, kw = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Ml = "react-flow__node-desc", $l = "react-flow__edge-desc", Ew = "react-flow__aria-live", Sw = (e) => e.ariaLiveMessage, Nw = (e) => e.ariaLabelConfig;
function Cw({ rfId: e }) {
  const t = se(Sw);
  return p("div", { id: `${Ew}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: kw, children: t });
}
function Mw({ rfId: e, disableKeyboardA11y: t }) {
  const n = se(Nw);
  return A(ke, { children: [p("div", { id: `${Ml}-${e}`, style: ls, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), p("div", { id: `${$l}-${e}`, style: ls, children: n["edge.a11yDescription.default"] }), !t && p(Cw, { rfId: e })] });
}
const vt = Vs(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return p("div", { className: xe(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
vt.displayName = "Panel";
const cs = "https://reactflow.dev?utm_source=attribution";
function $w({ proOptions: e, position: t = "bottom-right" }) {
  return le(() => {
  }, []), e != null && e.hideAttribution ? null : p(vt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${cs}`, children: p("a", { href: cs, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Iw = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, On = (e) => e.id;
function Aw(e, t) {
  return pe(e.selectedNodes.map(On), t.selectedNodes.map(On)) && pe(e.selectedEdges.map(On), t.selectedEdges.map(On));
}
function zw({ onSelectionChange: e }) {
  const t = he(), { selectedNodes: n, selectedEdges: r } = se(Iw, Aw);
  return le(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const Tw = (e) => !!e.onSelectionChangeHandlers;
function Lw({ onSelectionChange: e }) {
  const t = se(Tw);
  return e || t ? p(zw, { onSelectionChange: e }) : null;
}
const Il = [0, 0], Ow = { x: 0, y: 0, zoom: 1 }, Pw = [
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
], ds = [...Pw, "rfId"], Dw = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), us = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Qt,
  nodeOrigin: Il,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Rw(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = se(Dw, pe), c = he();
  le(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = us, a();
  }), []);
  const d = ie(us);
  return le(
    () => {
      for (const f of ds) {
        const u = e[f], h = d.current[f];
        u !== h && (typeof e[f] > "u" || (f === "nodes" ? t(u) : f === "edges" ? n(u) : f === "minZoom" ? r(u) : f === "maxZoom" ? o(u) : f === "translateExtent" ? i(u) : f === "nodeExtent" ? s(u) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: ly(u) }) : f === "fitView" ? c.setState({ fitViewQueued: u }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: u }) : c.setState({ [f]: u })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    ds.map((f) => e[f])
  ), null;
}
function fs() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Hw(e) {
  var r;
  const [t, n] = re(e === "system" ? null : e);
  return le(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = fs(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = fs()) != null && r.matches ? "dark" : "light";
}
const hs = typeof document < "u" ? document : null;
function nn(e = null, t = { target: hs, actInsideInputWithModifier: !0 }) {
  const [n, r] = re(!1), o = ie(!1), i = ie(/* @__PURE__ */ new Set([])), [s, a] = ae(() => {
    if (e !== null) {
      const c = (Array.isArray(e) ? e : [e]).filter((f) => typeof f == "string").map((f) => f.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), d = c.reduce((f, u) => f.concat(...u), []);
      return [c, d];
    }
    return [[], []];
  }, [e]);
  return le(() => {
    const l = (t == null ? void 0 : t.target) ?? hs, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (h) => {
        var b, m;
        if (o.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!o.current || o.current && !c) && il(h))
          return !1;
        const v = gs(h.code, a);
        if (i.current.add(h[v]), ps(s, i.current, !1)) {
          const _ = ((m = (b = h.composedPath) == null ? void 0 : b.call(h)) == null ? void 0 : m[0]) || h.target, y = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !y) && h.preventDefault(), r(!0);
        }
      }, f = (h) => {
        const g = gs(h.code, a);
        ps(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(h[g]), h.key === "Meta" && i.current.clear(), o.current = !1;
      }, u = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", u), window.addEventListener("contextmenu", u), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", u), window.removeEventListener("contextmenu", u);
      };
    }
  }, [e, r]), n;
}
function ps(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function gs(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Bw = () => {
  const e = he();
  return ae(() => ({
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = yr(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      }, d = n.snapGrid ?? o, f = n.snapToGrid ?? i;
      return pn(c, r, f, d);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = Tt(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function Al(e, t) {
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
      Vw(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function Vw(e, t) {
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
function Ww(e, t) {
  return Al(e, t);
}
function Fw(e, t) {
  return Al(e, t);
}
function ft(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function St(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(ft(i.id, s)));
  }
  return r;
}
function ms({ items: e = [], lookup: t }) {
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
function ys(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Yw = el();
function jw(e, t, n = {}) {
  return py(e, t, {
    ...n,
    onError: n.onError ?? Yw
  });
}
const ws = (e) => J0(e), Gw = (e) => qa(e);
function zl(e) {
  return Vs(e);
}
const Tl = typeof window < "u" ? Ws : le;
function xs(e) {
  const [t, n] = re(BigInt(0)), [r] = re(() => Xw(() => n((o) => o + BigInt(1))));
  return Tl(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function Xw(e) {
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
const Ll = sr(null);
function Uw({ children: e }) {
  const t = he(), n = De((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: f, nodeLookup: u, fitViewQueued: h, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = l;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let b = ms({
      items: v,
      lookup: u
    });
    for (const m of g.values())
      b = m(b);
    d && c(v), b.length > 0 ? f == null || f(b) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: _, setNodes: y } = t.getState();
      m && y(_);
    });
  }, []), r = xs(n), o = De((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: f, edgeLookup: u } = t.getState();
    let h = l;
    for (const g of a)
      h = typeof g == "function" ? g(h) : g;
    d ? c(h) : f && f(ms({
      items: h,
      lookup: u
    }));
  }, []), i = xs(o), s = ae(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return p(Ll.Provider, { value: s, children: e });
}
function qw() {
  const e = Pt(Ll);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Kw = (e) => !!e.panZoom;
function vr() {
  const e = Bw(), t = he(), n = qw(), r = se(Kw), o = ae(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var m, _;
      const { nodeLookup: u, nodeOrigin: h } = t.getState(), g = ws(f) ? f : u.get(f.id), v = g.parentId ? nl(g.position, g.measured, g.parentId, u, h) : g.position, b = {
        ...g,
        position: v,
        width: ((m = g.measured) == null ? void 0 : m.width) ?? g.width,
        height: ((_ = g.measured) == null ? void 0 : _.height) ?? g.height
      };
      return en(b);
    }, c = (f, u, h = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === f) {
          const b = typeof u == "function" ? u(v) : u;
          return h.replace && ws(b) ? b : { ...v, ...b };
        }
        return v;
      }));
    }, d = (f, u, h = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === f) {
          const b = typeof u == "function" ? u(v) : u;
          return h.replace && Gw(b) ? b : { ...v, ...b };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((f) => ({ ...f })),
      getNode: (f) => {
        var u;
        return (u = i(f)) == null ? void 0 : u.internals.userNode;
      },
      getInternalNode: i,
      getEdges: () => {
        const { edges: f = [] } = t.getState();
        return f.map((u) => ({ ...u }));
      },
      getEdge: (f) => t.getState().edgeLookup.get(f),
      setNodes: s,
      setEdges: a,
      addNodes: (f) => {
        const u = Array.isArray(f) ? f : [f];
        n.nodeQueue.push((h) => [...h, ...u]);
      },
      addEdges: (f) => {
        const u = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((h) => [...h, ...u]);
      },
      toObject: () => {
        const { nodes: f = [], edges: u = [], transform: h } = t.getState(), [g, v, b] = h;
        return {
          nodes: f.map((m) => ({ ...m })),
          edges: u.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: v,
            zoom: b
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: u = [] }) => {
        const { nodes: h, edges: g, onNodesDelete: v, onEdgesDelete: b, triggerNodeChanges: m, triggerEdgeChanges: _, onDelete: y, onBeforeDelete: x } = t.getState(), { nodes: E, edges: S } = await oy({
          nodesToRemove: f,
          edgesToRemove: u,
          nodes: h,
          edges: g,
          onBeforeDelete: x
        }), M = S.length > 0, z = E.length > 0;
        if (M) {
          const I = S.map(ys);
          b == null || b(S), _(I);
        }
        if (z) {
          const I = E.map(ys);
          v == null || v(E), m(I);
        }
        return (z || M) && (y == null || y({ nodes: E, edges: S })), { deletedNodes: E, deletedEdges: S };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, u = !0, h) => {
        const g = Xi(f), v = g ? f : l(f), b = h !== void 0;
        return v ? (h || t.getState().nodes).filter((m) => {
          const _ = t.getState().nodeLookup.get(m.id);
          if (_ && !g && (m.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const y = en(b ? m : _), x = rr(y, v);
          return u && x > 0 || x >= y.width * y.height || x >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, u, h = !0) => {
        const v = Xi(f) ? f : l(f);
        if (!v)
          return !1;
        const b = rr(v, u);
        return h && b > 0 || b >= u.width * u.height || b >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (f, u, h = { replace: !1 }) => {
        c(f, (g) => {
          const v = typeof u == "function" ? u(g) : u;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      updateEdge: d,
      updateEdgeData: (f, u, h = { replace: !1 }) => {
        d(f, (g) => {
          const v = typeof u == "function" ? u(g) : u;
          return h.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, h);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: u, nodeOrigin: h } = t.getState();
        return ey(f, { nodeLookup: u, nodeOrigin: h });
      },
      getHandleConnections: ({ type: f, id: u, nodeId: h }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${h}-${f}${u ? `-${u}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      getNodeConnections: ({ type: f, handleId: u, nodeId: h }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${h}${f ? u ? `-${f}-${u}` : `-${f}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      fitView: async (f) => {
        const u = t.getState().fitViewResolver ?? ay();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: u }), n.nodeQueue.push((h) => [...h]), u.promise;
      }
    };
  }, []);
  return ae(() => ({
    ...o,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const bs = (e) => e.selected, Zw = typeof window < "u" ? window : void 0;
function Qw({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = he(), { deleteElements: r } = vr(), o = nn(e, { actInsideInputWithModifier: !1 }), i = nn(t, { target: Zw });
  le(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(bs), edges: s.filter(bs) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), le(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Jw(e) {
  const t = he();
  le(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = jo(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", Re.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
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
const _r = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, ex = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function tx({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = gt.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: f, maxZoom: u, zoomActivationKeyCode: h, preventScrolling: g = !0, children: v, noWheelClassName: b, noPanClassName: m, onViewportChange: _, isControlledViewport: y, paneClickDistance: x, selectionOnDrag: E }) {
  const S = he(), M = ie(null), { userSelectionActive: z, lib: I, connectionInProgress: V } = se(ex, pe), T = nn(h), B = ie();
  Jw(M);
  const D = De((w) => {
    _ == null || _({ x: w[0], y: w[1], zoom: w[2] }), y || S.setState({ transform: w });
  }, [_, y]);
  return le(() => {
    if (M.current) {
      B.current = Yy({
        domNode: M.current,
        minZoom: f,
        maxZoom: u,
        translateExtent: d,
        viewport: c,
        onDraggingChange: ($) => S.setState((L) => L.paneDragging === $ ? L : { paneDragging: $ }),
        onPanZoomStart: ($, L) => {
          const { onViewportChangeStart: C, onMoveStart: O } = S.getState();
          O == null || O($, L), C == null || C(L);
        },
        onPanZoom: ($, L) => {
          const { onViewportChange: C, onMove: O } = S.getState();
          O == null || O($, L), C == null || C(L);
        },
        onPanZoomEnd: ($, L) => {
          const { onViewportChangeEnd: C, onMoveEnd: O } = S.getState();
          O == null || O($, L), C == null || C(L);
        }
      });
      const { x: w, y: N, zoom: k } = B.current.getViewport();
      return S.setState({
        panZoom: B.current,
        transform: [w, N, k],
        domNode: M.current.closest(".react-flow")
      }), () => {
        var $;
        ($ = B.current) == null || $.destroy();
      };
    }
  }, []), le(() => {
    var w;
    (w = B.current) == null || w.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: r,
      panActivationKeyPressed: o,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: l,
      zoomActivationKeyPressed: T,
      preventScrolling: g,
      noPanClassName: m,
      userSelectionActive: z,
      noWheelClassName: b,
      lib: I,
      onTransformChange: D,
      connectionInProgress: V,
      selectionOnDrag: E,
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
    T,
    g,
    m,
    z,
    b,
    I,
    D,
    V,
    E,
    x
  ]), p("div", { className: "react-flow__renderer", ref: M, style: _r, children: v });
}
const nx = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function rx() {
  const { userSelectionActive: e, userSelectionRect: t } = se(nx, pe);
  return e && t ? p("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const to = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, ox = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function ix({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Jt.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: f, onPaneMouseEnter: u, onPaneMouseMove: h, onPaneMouseLeave: g, children: v }) {
  const b = ie(0), m = he(), { userSelectionActive: _, elementsSelectable: y, dragging: x, panBy: E, autoPanSpeed: S } = se(ox, pe), M = y && (e || _), z = ie(null), I = ie(), V = ie(/* @__PURE__ */ new Set()), T = ie(/* @__PURE__ */ new Set()), B = ie(!1), D = ie(!1), w = ie({ x: 0, y: 0 }), N = ie(!1), k = (R) => {
    if (D.current || B.current || m.getState().connection.inProgress) {
      D.current = !1, B.current = !1;
      return;
    }
    c == null || c(R), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, $ = (R) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      R.preventDefault();
      return;
    }
    d == null || d(R);
  }, L = f ? (R) => f(R) : void 0, C = (R) => {
    D.current && (R.stopPropagation(), D.current = !1);
  }, O = (R) => {
    var ce, ue;
    if (R.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: F, transform: K } = m.getState();
    if (I.current = F == null ? void 0 : F.getBoundingClientRect(), !I.current)
      return;
    const Z = R.target === z.current;
    if (!Z && !!R.target.closest(".nokey") || !e || !(s && Z || t) || R.button !== 0 || !R.isPrimary)
      return;
    (ue = (ce = R.target) == null ? void 0 : ce.setPointerCapture) == null || ue.call(ce, R.pointerId), D.current = !1;
    const { x: ee, y: ne } = Pe(R.nativeEvent, I.current), oe = pn({ x: ee, y: ne }, K);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: oe.x,
        startY: oe.y,
        x: ee,
        y: ne
      }
    }), Z || (R.stopPropagation(), R.preventDefault());
  };
  function P(R, F) {
    const { userSelectionRect: K } = m.getState();
    if (!K)
      return;
    const { transform: Z, nodeLookup: X, edgeLookup: Q, connectionLookup: ee, triggerNodeChanges: ne, triggerEdgeChanges: oe, defaultEdgeOptions: ce } = m.getState(), ue = { x: K.startX, y: K.startY }, { x: Ee, y: be } = Tt(ue, Z), ve = {
      startX: ue.x,
      startY: ue.y,
      x: R < Ee ? R : Ee,
      y: F < be ? F : be,
      width: Math.abs(R - Ee),
      height: Math.abs(F - be)
    }, tt = V.current, Fe = T.current;
    V.current = new Set(Fo(X, ve, Z, n === Jt.Partial, !0).map((Se) => Se.id)), T.current = /* @__PURE__ */ new Set();
    const Ye = (ce == null ? void 0 : ce.selectable) ?? !0;
    for (const Se of V.current) {
      const Ae = ee.get(Se);
      if (Ae)
        for (const { edgeId: ze } of Ae.values()) {
          const je = Q.get(ze);
          je && (je.selectable ?? Ye) && T.current.add(ze);
        }
    }
    if (!Ui(tt, V.current)) {
      const Se = St(X, V.current, !0);
      ne(Se);
    }
    if (!Ui(Fe, T.current)) {
      const Se = St(Q, T.current);
      oe(Se);
    }
    m.setState({
      userSelectionRect: ve,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function W() {
    if (!o || !I.current)
      return;
    const [R, F] = Yo(w.current, I.current, S);
    E({ x: R, y: F }).then((K) => {
      if (!D.current || !K) {
        b.current = requestAnimationFrame(W);
        return;
      }
      const { x: Z, y: X } = w.current;
      P(Z, X), b.current = requestAnimationFrame(W);
    });
  }
  const j = () => {
    cancelAnimationFrame(b.current), b.current = 0, N.current = !1;
  };
  le(() => () => j(), []);
  const Y = (R) => {
    const { userSelectionRect: F, transform: K, resetSelectedElements: Z } = m.getState();
    if (!I.current || !F)
      return;
    const { x: X, y: Q } = Pe(R.nativeEvent, I.current);
    w.current = { x: X, y: Q };
    const ee = Tt({ x: F.startX, y: F.startY }, K);
    if (!D.current) {
      const ne = t ? 0 : i;
      if (Math.hypot(X - ee.x, Q - ee.y) <= ne)
        return;
      Z(), a == null || a(R);
    }
    D.current = !0, N.current || (W(), N.current = !0), P(X, Q);
  }, q = (R) => {
    var F, K;
    if (!M) {
      R.target === z.current && m.getState().connection.inProgress && (B.current = !0);
      return;
    }
    R.button === 0 && ((K = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || K.call(F, R.pointerId), !_ && R.target === z.current && m.getState().userSelectionRect && (k == null || k(R)), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), D.current && (l == null || l(R), m.setState({
      nodesSelectionActive: V.current.size > 0
    })), j());
  }, te = (R) => {
    var F, K;
    (K = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || K.call(F, R.pointerId), j();
  }, U = r === !0 || Array.isArray(r) && r.includes(0);
  return A("div", { className: xe(["react-flow__pane", { draggable: U, dragging: x, selection: e }]), onClick: M ? void 0 : to(k, z), onContextMenu: to($, z), onWheel: to(L, z), onPointerEnter: M ? void 0 : u, onPointerMove: M ? Y : h, onPointerUp: q, onPointerCancel: M ? te : void 0, onPointerDownCapture: M ? O : void 0, onClickCapture: M ? C : void 0, onPointerLeave: g, ref: z, style: _r, children: [v, p(rx, {})] });
}
function ko({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", Re.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var d;
    return (d = r == null ? void 0 : r.current) == null ? void 0 : d.blur();
  })) : o([e]);
}
function Ol({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = he(), [l, c] = re(!1), d = ie();
  return le(() => {
    if (!t)
      return d.current = Iy({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          ko({
            id: f,
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
        var f;
        (f = d.current) == null || f.destroy(), d.current = void 0;
      };
  }, [t, a, e]), le(() => {
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
const sx = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function Pl() {
  const e = he();
  return De((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), f = /* @__PURE__ */ new Map(), u = sx(s), h = o ? i[0] : 5, g = o ? i[1] : 5, v = n.direction.x * h * n.factor, b = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!u(m))
        continue;
      let _ = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + b
      };
      o && (_ = hn(_, i));
      const { position: y, positionAbsolute: x } = Ka({
        nodeId: m.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: d,
        onError: a
      });
      m.position = y, m.internals.positionAbsolute = x, f.set(m.id, m);
    }
    l(f);
  }, []);
}
const Zo = sr(null), ax = Zo.Provider;
Zo.Consumer;
const Dl = () => Pt(Zo), lx = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), Rl = sr(null);
function cx({ children: e }) {
  const t = se(lx, pe);
  return p(Rl.Provider, { value: t, children: e });
}
function dx() {
  const e = Pt(Rl);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const ux = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, fx = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return ux;
  const d = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: d,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === It.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: d && c
  };
};
function hx({ type: e = "source", position: t = G.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: f, ...u }, h) {
  var N, k;
  const g = s || null, v = e === "target", b = he(), m = Dl(), { connectOnClick: _, noPanClassName: y, rfId: x } = dx(), { connectingFrom: E, connectingTo: S, clickConnecting: M, isPossibleEndHandle: z, connectionInProcess: I, clickConnectionInProcess: V, valid: T } = se(fx(m, g, e), pe);
  m || (k = (N = b.getState()).onError) == null || k.call(N, "010", Re.error010());
  const B = ($) => {
    const { defaultEdgeOptions: L, onConnect: C, hasDefaultEdges: O } = b.getState(), P = {
      ...L,
      ...$
    };
    if (O) {
      const { edges: W, setEdges: j, onError: Y } = b.getState();
      j(jw(P, W, { onError: Y }));
    }
    C == null || C(P), a == null || a(P);
  }, D = ($) => {
    if (!m)
      return;
    const L = sl($.nativeEvent);
    if (o && (L && $.button === 0 || !L)) {
      const C = b.getState();
      _o.onPointerDown($.nativeEvent, {
        handleDomNode: $.currentTarget,
        autoPanOnConnect: C.autoPanOnConnect,
        connectionMode: C.connectionMode,
        connectionRadius: C.connectionRadius,
        domNode: C.domNode,
        nodeLookup: C.nodeLookup,
        lib: C.lib,
        isTarget: v,
        handleId: g,
        nodeId: m,
        flowId: C.rfId,
        panBy: C.panBy,
        cancelConnection: C.cancelConnection,
        onConnectStart: C.onConnectStart,
        onConnectEnd: (...O) => {
          var P, W;
          return (W = (P = b.getState()).onConnectEnd) == null ? void 0 : W.call(P, ...O);
        },
        updateConnection: C.updateConnection,
        onConnect: B,
        isValidConnection: n || ((...O) => {
          var P, W;
          return ((W = (P = b.getState()).isValidConnection) == null ? void 0 : W.call(P, ...O)) ?? !0;
        }),
        getTransform: () => b.getState().transform,
        getFromHandle: () => b.getState().connection.fromHandle,
        autoPanSpeed: C.autoPanSpeed,
        dragThreshold: C.connectionDragThreshold
      });
    }
    L ? d == null || d($) : f == null || f($);
  }, w = ($) => {
    const { onClickConnectStart: L, onClickConnectEnd: C, connectionClickStartHandle: O, connectionMode: P, isValidConnection: W, lib: j, rfId: Y, nodeLookup: q, connection: te } = b.getState();
    if (!m || !O && !o)
      return;
    if (!O) {
      L == null || L($.nativeEvent, { nodeId: m, handleId: g, handleType: e }), b.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const U = ol($.target), R = n || W, { connection: F, isValid: K } = _o.isValid($.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: P,
      fromNodeId: O.nodeId,
      fromHandleId: O.id || null,
      fromType: O.type,
      isValidConnection: R,
      flowId: Y,
      doc: U,
      lib: j,
      nodeLookup: q
    });
    K && F && B(F);
    const Z = structuredClone(te);
    delete Z.inProgress, Z.toPosition = Z.toHandle ? Z.toHandle.position : null, C == null || C($, Z), b.setState({ connectionClickStartHandle: null });
  };
  return p("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${x}-${m}-${g}-${e}`, className: xe([
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
      clickconnecting: M,
      connectingfrom: E,
      connectingto: S,
      valid: T,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!I || z) && (I || V ? i : o)
    }
  ]), onMouseDown: D, onTouchStart: D, onClick: _ ? w : void 0, ref: h, ...u, children: l });
}
const ct = ge(zl(hx));
function px({ data: e, isConnectable: t, sourcePosition: n = G.Bottom }) {
  return A(ke, { children: [e == null ? void 0 : e.label, p(ct, { type: "source", position: n, isConnectable: t })] });
}
function gx({ data: e, isConnectable: t, targetPosition: n = G.Top, sourcePosition: r = G.Bottom }) {
  return A(ke, { children: [p(ct, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, p(ct, { type: "source", position: r, isConnectable: t })] });
}
function mx() {
  return null;
}
function yx({ data: e, isConnectable: t, targetPosition: n = G.Top }) {
  return A(ke, { children: [p(ct, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const or = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, vs = {
  input: px,
  default: gx,
  output: yx,
  group: mx
};
function wx(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const xx = (e) => {
  const { width: t, height: n, x: r, y: o } = fn(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: Oe(t) ? t : null,
    height: Oe(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function bx({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = he(), { width: o, height: i, transformString: s, userSelectionActive: a } = se(xx, pe), l = Pl(), c = ie(null);
  le(() => {
    var h;
    n || (h = c.current) == null || h.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (Ol({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const f = e ? (h) => {
    const g = r.getState().nodes.filter((v) => v.selected);
    e(h, g);
  } : void 0, u = (h) => {
    Object.prototype.hasOwnProperty.call(or, h.key) && (h.preventDefault(), l({
      direction: or[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return p("div", { className: xe(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: p("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : u, style: {
    width: o,
    height: i
  } }) });
}
const _s = typeof window < "u" ? window : void 0, vx = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Hl({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: f, onSelectionStart: u, onSelectionEnd: h, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: b, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: x, panOnScrollSpeed: E, panOnScrollMode: S, zoomOnDoubleClick: M, panOnDrag: z, autoPanOnSelection: I, defaultViewport: V, translateExtent: T, minZoom: B, maxZoom: D, preventScrolling: w, onSelectionContextMenu: N, noWheelClassName: k, noPanClassName: $, disableKeyboardA11y: L, onViewportChange: C, isControlledViewport: O }) {
  const { nodesSelectionActive: P, userSelectionActive: W } = se(vx, pe), j = nn(c, { target: _s }), Y = nn(v, { target: _s }), q = Y || z, te = Y || x, U = d && q !== !0, R = j || W || U;
  return Qw({ deleteKeyCode: l, multiSelectionKeyCode: g }), p(tx, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: te, panActivationKeyPressed: Y, panOnScrollSpeed: E, panOnScrollMode: S, zoomOnDoubleClick: M, panOnDrag: !j && q, defaultViewport: V, translateExtent: T, minZoom: B, maxZoom: D, zoomActivationKeyCode: b, preventScrolling: w, noWheelClassName: k, noPanClassName: $, onViewportChange: C, isControlledViewport: O, paneClickDistance: a, selectionOnDrag: U, children: A(ix, { onSelectionStart: u, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: q, autoPanOnSelection: I, isSelecting: !!R, selectionMode: f, selectionKeyPressed: j, paneClickDistance: a, selectionOnDrag: U, children: [e, P && p(bx, { onSelectionContextMenu: N, noPanClassName: $, disableKeyboardA11y: L })] }) });
}
Hl.displayName = "FlowRenderer";
const _x = ge(Hl), kx = (e) => (t) => e ? Fo(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Ex(e) {
  return se(De(kx(e), [e]), pe);
}
const Sx = (e) => e.updateNodeInternals;
function Nx() {
  const e = se(Sx), [t] = re(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
  return le(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function Cx({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = he(), i = ie(null), s = ie(null), a = ie(e.sourcePosition), l = ie(e.targetPosition), c = ie(t), d = n && !!e.internals.handleBounds;
  return le(() => {
    i.current && !e.hidden && (!d || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [d, e.hidden]), le(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), le(() => {
    if (i.current) {
      const f = c.current !== t, u = a.current !== e.sourcePosition, h = l.current !== e.targetPosition;
      (f || u || h) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function Mx({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: f, noDragClassName: u, noPanClassName: h, disableKeyboardA11y: g, rfId: v, nodeTypes: b, nodeClickDistance: m, onError: _ }) {
  const { node: y, internals: x, isParent: E } = se((R) => {
    const F = R.nodeLookup.get(e), K = R.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: K
    };
  }, pe);
  let S = y.type || "default", M = (b == null ? void 0 : b[S]) || vs[S];
  M === void 0 && (_ == null || _("003", Re.error003(S)), S = "default", M = (b == null ? void 0 : b.default) || vs.default);
  const z = !!(y.draggable || a && typeof y.draggable > "u"), I = !!(y.selectable || l && typeof y.selectable > "u"), V = !!(y.connectable || c && typeof y.connectable > "u"), T = !!(y.focusable || d && typeof y.focusable > "u"), B = he(), D = tl(y), w = Cx({ node: y, nodeType: S, hasDimensions: D, resizeObserver: f }), N = Ol({
    nodeRef: w,
    disabled: y.hidden || !z,
    noDragClassName: u,
    handleSelector: y.dragHandle,
    nodeId: e,
    isSelectable: I,
    nodeClickDistance: m
  }), k = Pl();
  if (y.hidden)
    return null;
  const $ = We(y), L = wx(y), C = I || z || t || n || r || o, O = n ? (R) => n(R, { ...x.userNode }) : void 0, P = r ? (R) => r(R, { ...x.userNode }) : void 0, W = o ? (R) => o(R, { ...x.userNode }) : void 0, j = i ? (R) => i(R, { ...x.userNode }) : void 0, Y = s ? (R) => s(R, { ...x.userNode }) : void 0, q = (R) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: K } = B.getState();
    I && (!F || !z || K > 0) && ko({
      id: e,
      store: B,
      nodeRef: w
    }), t && t(R, { ...x.userNode });
  }, te = (R) => {
    if (!(il(R.nativeEvent) || g)) {
      if (Ga.includes(R.key) && I) {
        const F = R.key === "Escape";
        ko({
          id: e,
          store: B,
          unselect: F,
          nodeRef: w
        });
      } else if (z && y.selected && Object.prototype.hasOwnProperty.call(or, R.key)) {
        R.preventDefault();
        const { ariaLabelConfig: F } = B.getState();
        B.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: R.key.replace("Arrow", "").toLowerCase(),
            x: ~~x.positionAbsolute.x,
            y: ~~x.positionAbsolute.y
          })
        }), k({
          direction: or[R.key],
          factor: R.shiftKey ? 4 : 1
        });
      }
    }
  }, U = () => {
    var ee;
    if (g || !((ee = w.current) != null && ee.matches(":focus-visible")))
      return;
    const { transform: R, width: F, height: K, autoPanOnNodeFocus: Z, setCenter: X } = B.getState();
    if (!Z)
      return;
    Fo(/* @__PURE__ */ new Map([[e, y]]), { x: 0, y: 0, width: F, height: K }, R, !0).length > 0 || X(y.position.x + $.width / 2, y.position.y + $.height / 2, {
      zoom: R[2]
    });
  };
  return p("div", { className: xe([
    "react-flow__node",
    `react-flow__node-${S}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: z
    },
    y.className,
    {
      selected: y.selected,
      selectable: I,
      parent: E,
      draggable: z,
      dragging: N
    }
  ]), ref: w, style: {
    zIndex: x.z,
    transform: `translate(${x.positionAbsolute.x}px,${x.positionAbsolute.y}px)`,
    pointerEvents: C ? "all" : "none",
    visibility: D ? "visible" : "hidden",
    ...y.style,
    ...L
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: O, onMouseMove: P, onMouseLeave: W, onContextMenu: j, onClick: q, onDoubleClick: Y, onKeyDown: T ? te : void 0, tabIndex: T ? 0 : void 0, onFocus: T ? U : void 0, role: y.ariaRole ?? (T ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${Ml}-${v}`, "aria-label": y.ariaLabel, ...y.domAttributes, children: p(ax, { value: e, children: p(M, { id: e, data: y.data, type: S, positionAbsoluteX: x.positionAbsolute.x, positionAbsoluteY: x.positionAbsolute.y, selected: y.selected ?? !1, selectable: I, draggable: z, deletable: y.deletable ?? !0, isConnectable: V, sourcePosition: y.sourcePosition, targetPosition: y.targetPosition, dragging: N, dragHandle: y.dragHandle, zIndex: x.z, parentId: y.parentId, ...$ }) }) });
}
var $x = ge(Mx);
const Ix = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function Bl(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = se(Ix, pe), i = Ex(e.onlyRenderVisibleElements), s = Nx();
  return p("div", { className: "react-flow__nodes", style: _r, children: i.map((a) => (
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
    p($x, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
Bl.displayName = "NodeRenderer";
const Ax = ge(Bl);
function zx(e) {
  return se(De((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && uy({
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
const Tx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return p("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Lx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return p("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, ks = {
  [At.Arrow]: Tx,
  [At.ArrowClosed]: Lx
};
function Ox(e) {
  const t = he();
  return ae(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(ks, e) ? ks[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Re.error009(e)), null);
  }, [e]);
}
const Px = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = Ox(t);
  return l ? p("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: p(l, { color: n, strokeWidth: s }) }) : null;
}, Vl = ({ defaultColor: e, rfId: t }) => {
  const n = se((i) => i.edges), r = se((i) => i.defaultEdgeOptions), o = ae(() => xy(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? p("svg", { className: "react-flow__marker", "aria-hidden": "true", children: p("defs", { children: o.map((i) => p(Px, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
Vl.displayName = "MarkerDefinitions";
var Dx = ge(Vl);
function Wl({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [f, u] = re({ x: 1, y: 0, width: 0, height: 0 }), h = xe(["react-flow__edge-textwrapper", c]), g = ie(null);
  return le(() => {
    if (g.current) {
      const v = g.current.getBBox();
      u({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? A("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...d, children: [o && p("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), p("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
Wl.displayName = "EdgeText";
const Rx = ge(Wl);
function kr({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return A(ke, { children: [p("path", { ...d, d: e, fill: "none", className: xe(["react-flow__edge-path", d.className]) }), c ? p("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && Oe(t) && Oe(n) ? p(Rx, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Es({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === G.Left || e === G.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function Fl({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top }) {
  const [s, a] = Es({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = Es({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, f, u, h] = al({
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
    f,
    u,
    h
  ];
}
function Yl(e) {
  return ge(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: b, interactionWidth: m }) => {
    const [_, y, x] = Fl({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), E = e.isInternal ? void 0 : t;
    return p(kr, { id: E, path: _, labelX: y, labelY: x, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: b, interactionWidth: m });
  });
}
const Hx = Yl({ isInternal: !1 }), jl = Yl({ isInternal: !0 });
Hx.displayName = "SimpleBezierEdge";
jl.displayName = "SimpleBezierEdgeInternal";
function Gl(e) {
  return ge(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, sourcePosition: h = G.Bottom, targetPosition: g = G.Top, markerEnd: v, markerStart: b, pathOptions: m, interactionWidth: _ }) => {
    const [y, x, E] = xo({
      sourceX: n,
      sourceY: r,
      sourcePosition: h,
      targetX: o,
      targetY: i,
      targetPosition: g,
      borderRadius: m == null ? void 0 : m.borderRadius,
      offset: m == null ? void 0 : m.offset,
      stepPosition: m == null ? void 0 : m.stepPosition
    }), S = e.isInternal ? void 0 : t;
    return p(kr, { id: S, path: y, labelX: x, labelY: E, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: v, markerStart: b, interactionWidth: _ });
  });
}
const Xl = Gl({ isInternal: !1 }), Ul = Gl({ isInternal: !0 });
Xl.displayName = "SmoothStepEdge";
Ul.displayName = "SmoothStepEdgeInternal";
function ql(e) {
  return ge(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return p(Xl, { ...n, id: r, pathOptions: ae(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const Bx = ql({ isInternal: !1 }), Kl = ql({ isInternal: !0 });
Bx.displayName = "StepEdge";
Kl.displayName = "StepEdgeInternal";
function Zl(e) {
  return ge(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: h, markerStart: g, interactionWidth: v }) => {
    const [b, m, _] = dl({ sourceX: n, sourceY: r, targetX: o, targetY: i }), y = e.isInternal ? void 0 : t;
    return p(kr, { id: y, path: b, labelX: m, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: h, markerStart: g, interactionWidth: v });
  });
}
const Vx = Zl({ isInternal: !1 }), Ql = Zl({ isInternal: !0 });
Vx.displayName = "StraightEdge";
Ql.displayName = "StraightEdgeInternal";
function Jl(e) {
  return ge(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = G.Bottom, targetPosition: a = G.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: b, pathOptions: m, interactionWidth: _ }) => {
    const [y, x, E] = ll({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), S = e.isInternal ? void 0 : t;
    return p(kr, { id: S, path: y, labelX: x, labelY: E, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: h, style: g, markerEnd: v, markerStart: b, interactionWidth: _ });
  });
}
const Wx = Jl({ isInternal: !1 }), ec = Jl({ isInternal: !0 });
Wx.displayName = "BezierEdge";
ec.displayName = "BezierEdgeInternal";
const Ss = {
  default: ec,
  straight: Ql,
  step: Kl,
  smoothstep: Ul,
  simplebezier: jl
}, Ns = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Fx = (e, t, n) => n === G.Left ? e - t : n === G.Right ? e + t : e, Yx = (e, t, n) => n === G.Top ? e - t : n === G.Bottom ? e + t : e, Cs = "react-flow__edgeupdater";
function Ms({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return p("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: xe([Cs, `${Cs}-${a}`]), cx: Fx(t, r, e), cy: Yx(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function jx({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: f, setReconnecting: u, setUpdateHover: h }) {
  const g = he(), v = (x, E) => {
    if (x.button !== 0)
      return;
    const { autoPanOnConnect: S, domNode: M, connectionMode: z, connectionRadius: I, lib: V, onConnectStart: T, cancelConnection: B, nodeLookup: D, rfId: w, panBy: N, updateConnection: k } = g.getState(), $ = E.type === "target", L = (P, W) => {
      u(!1), f == null || f(P, n, E.type, W);
    }, C = (P) => c == null ? void 0 : c(n, P), O = (P, W) => {
      u(!0), d == null || d(x, n, E.type), T == null || T(P, W);
    };
    _o.onPointerDown(x.nativeEvent, {
      autoPanOnConnect: S,
      connectionMode: z,
      connectionRadius: I,
      domNode: M,
      handleId: E.id,
      nodeId: E.nodeId,
      nodeLookup: D,
      isTarget: $,
      edgeUpdaterType: E.type,
      lib: V,
      flowId: w,
      cancelConnection: B,
      panBy: N,
      isValidConnection: (...P) => {
        var W, j;
        return ((j = (W = g.getState()).isValidConnection) == null ? void 0 : j.call(W, ...P)) ?? !0;
      },
      onConnect: C,
      onConnectStart: O,
      onConnectEnd: (...P) => {
        var W, j;
        return (j = (W = g.getState()).onConnectEnd) == null ? void 0 : j.call(W, ...P);
      },
      onReconnectEnd: L,
      updateConnection: k,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: x.currentTarget
    });
  }, b = (x) => v(x, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (x) => v(x, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => h(!0), y = () => h(!1);
  return A(ke, { children: [(e === !0 || e === "source") && p(Ms, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: b, onMouseEnter: _, onMouseOut: y, type: "source" }), (e === !0 || e === "target") && p(Ms, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: _, onMouseOut: y, type: "target" })] });
}
function Gx({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: f, onReconnectStart: u, onReconnectEnd: h, rfId: g, edgeTypes: v, noPanClassName: b, onError: m, disableKeyboardA11y: _ }) {
  let y = se((X) => X.edgeLookup.get(e));
  const x = se((X) => X.defaultEdgeOptions);
  y = x ? { ...x, ...y } : y;
  let E = y.type || "default", S = (v == null ? void 0 : v[E]) || Ss[E];
  S === void 0 && (m == null || m("011", Re.error011(E)), E = "default", S = (v == null ? void 0 : v.default) || Ss.default);
  const M = !!(y.focusable || t && typeof y.focusable > "u"), z = typeof f < "u" && (y.reconnectable || n && typeof y.reconnectable > "u"), I = !!(y.selectable || r && typeof y.selectable > "u"), V = ie(null), [T, B] = re(!1), [D, w] = re(!1), N = he(), { zIndex: k = y.zIndex, sourceX: $, sourceY: L, targetX: C, targetY: O, sourcePosition: P, targetPosition: W } = se(De((X) => {
    const Q = X.nodeLookup.get(y.source), ee = X.nodeLookup.get(y.target);
    if (!Q || !ee)
      return Ns;
    const ne = wy({
      id: e,
      sourceNode: Q,
      targetNode: ee,
      sourceHandle: y.sourceHandle || null,
      targetHandle: y.targetHandle || null,
      connectionMode: X.connectionMode,
      onError: m
    }), oe = dy({
      selected: y.selected,
      zIndex: y.zIndex,
      sourceNode: Q,
      targetNode: ee,
      elevateOnSelect: X.elevateEdgesOnSelect,
      zIndexMode: X.zIndexMode
    });
    return {
      ...ne || Ns,
      zIndex: oe
    };
  }, [y.source, y.target, y.sourceHandle, y.targetHandle, y.selected, y.zIndex, m]), pe), j = ae(() => y.markerStart ? `url('#${bo(y.markerStart, g)}')` : void 0, [y.markerStart, g]), Y = ae(() => y.markerEnd ? `url('#${bo(y.markerEnd, g)}')` : void 0, [y.markerEnd, g]);
  if (y.hidden || $ === null || L === null || C === null || O === null)
    return null;
  const q = (X) => {
    var oe;
    const { addSelectedEdges: Q, unselectNodesAndEdges: ee, multiSelectionActive: ne } = N.getState();
    I && (N.setState({ nodesSelectionActive: !1 }), y.selected && ne ? (ee({ nodes: [], edges: [y] }), (oe = V.current) == null || oe.blur()) : Q([e])), o && o(X, y);
  }, te = i ? (X) => {
    i(X, { ...y });
  } : void 0, U = s ? (X) => {
    s(X, { ...y });
  } : void 0, R = a ? (X) => {
    a(X, { ...y });
  } : void 0, F = l ? (X) => {
    l(X, { ...y });
  } : void 0, K = c ? (X) => {
    c(X, { ...y });
  } : void 0, Z = (X) => {
    var Q;
    if (!_ && Ga.includes(X.key) && I) {
      const { unselectNodesAndEdges: ee, addSelectedEdges: ne } = N.getState();
      X.key === "Escape" ? ((Q = V.current) == null || Q.blur(), ee({ edges: [y] })) : ne([e]);
    }
  };
  return p("svg", { style: { zIndex: k }, children: A("g", { className: xe([
    "react-flow__edge",
    `react-flow__edge-${E}`,
    y.className,
    b,
    {
      selected: y.selected,
      animated: y.animated,
      inactive: !I && !o,
      updating: T,
      selectable: I
    }
  ]), onClick: q, onDoubleClick: te, onContextMenu: U, onMouseEnter: R, onMouseMove: F, onMouseLeave: K, onKeyDown: M ? Z : void 0, tabIndex: M ? 0 : void 0, role: y.ariaRole ?? (M ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": y.ariaLabel === null ? void 0 : y.ariaLabel || `Edge from ${y.source} to ${y.target}`, "aria-describedby": M ? `${$l}-${g}` : void 0, ref: V, ...y.domAttributes, children: [!D && p(S, { id: e, source: y.source, target: y.target, type: y.type, selected: y.selected, animated: y.animated, selectable: I, deletable: y.deletable ?? !0, label: y.label, labelStyle: y.labelStyle, labelShowBg: y.labelShowBg, labelBgStyle: y.labelBgStyle, labelBgPadding: y.labelBgPadding, labelBgBorderRadius: y.labelBgBorderRadius, sourceX: $, sourceY: L, targetX: C, targetY: O, sourcePosition: P, targetPosition: W, data: y.data, style: y.style, sourceHandleId: y.sourceHandle, targetHandleId: y.targetHandle, markerStart: j, markerEnd: Y, pathOptions: "pathOptions" in y ? y.pathOptions : void 0, interactionWidth: y.interactionWidth }), z && p(jx, { edge: y, isReconnectable: z, reconnectRadius: d, onReconnect: f, onReconnectStart: u, onReconnectEnd: h, sourceX: $, sourceY: L, targetX: C, targetY: O, sourcePosition: P, targetPosition: W, setUpdateHover: B, setReconnecting: w })] }) });
}
var Xx = ge(Gx);
const Ux = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function tc({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: f, onEdgeDoubleClick: u, onReconnectStart: h, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: b, edgesReconnectable: m, elementsSelectable: _, onError: y } = se(Ux, pe), x = zx(t);
  return A("div", { className: "react-flow__edges", children: [p(Dx, { defaultColor: e, rfId: n }), x.map((E) => p(Xx, { id: E, edgesFocusable: b, edgesReconnectable: m, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: f, onDoubleClick: u, onReconnectStart: h, onReconnectEnd: g, rfId: n, onError: y, edgeTypes: r, disableKeyboardA11y: v }, E))] });
}
tc.displayName = "EdgeRenderer";
const qx = ge(tc), $s = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Kx({ children: e }) {
  const t = he(), n = ie(null), [r] = re(() => t.getState().transform);
  return Tl(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = $s(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), p("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: $s(r) }, children: e });
}
function Zx(e) {
  const t = vr(), n = ie(!1);
  le(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Qx = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Jx(e) {
  const t = se(Qx), n = he();
  return le(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function eb(e) {
  return e.connection.inProgress ? { ...e.connection, to: pn(e.connection.to, e.transform) } : { ...e.connection };
}
function tb(e) {
  return eb;
}
function nb(e) {
  const t = tb();
  return se(t, pe);
}
const rb = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function ob({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = se(rb, pe);
  return !(i && o && l) ? null : p("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: p("g", { className: xe(["react-flow__connection", rl(a)]), children: p(nc, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const nc = ({ style: e, type: t = st.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: f, toPosition: u, pointer: h } = nb();
  if (!o)
    return;
  if (n)
    return p(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: u, connectionStatus: rl(r), toNode: d, toHandle: f, pointer: h });
  let g = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: u
  };
  switch (t) {
    case st.Bezier:
      [g] = ll(v);
      break;
    case st.SimpleBezier:
      [g] = Fl(v);
      break;
    case st.Step:
      [g] = xo({
        ...v,
        borderRadius: 0
      });
      break;
    case st.SmoothStep:
      [g] = xo(v);
      break;
    default:
      [g] = dl(v);
  }
  return p("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
nc.displayName = "ConnectionLine";
const ib = {};
function Is(e = ib) {
  ie(e), he(), le(() => {
  }, [e]);
}
function sb() {
  he(), ie(!1), le(() => {
  }, []);
}
function rc({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: f, onSelectionStart: u, onSelectionEnd: h, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: b, connectionLineContainerStyle: m, selectionKeyCode: _, selectionOnDrag: y, selectionMode: x, multiSelectionKeyCode: E, panActivationKeyCode: S, zoomActivationKeyCode: M, deleteKeyCode: z, onlyRenderVisibleElements: I, elementsSelectable: V, defaultViewport: T, translateExtent: B, minZoom: D, maxZoom: w, preventScrolling: N, defaultMarkerColor: k, zoomOnScroll: $, zoomOnPinch: L, panOnScroll: C, panOnScrollSpeed: O, panOnScrollMode: P, zoomOnDoubleClick: W, panOnDrag: j, autoPanOnSelection: Y, onPaneClick: q, onPaneMouseEnter: te, onPaneMouseMove: U, onPaneMouseLeave: R, onPaneScroll: F, onPaneContextMenu: K, paneClickDistance: Z, nodeClickDistance: X, onEdgeContextMenu: Q, onEdgeMouseEnter: ee, onEdgeMouseMove: ne, onEdgeMouseLeave: oe, reconnectRadius: ce, onReconnect: ue, onReconnectStart: Ee, onReconnectEnd: be, noDragClassName: ve, noWheelClassName: tt, noPanClassName: Fe, disableKeyboardA11y: Ye, nodeExtent: Se, rfId: Ae, viewport: ze, onViewportChange: je, nodesDraggable: Ne }) {
  return Is(e), Is(t), sb(), Zx(n), Jx(ze), p(_x, { onPaneClick: q, onPaneMouseEnter: te, onPaneMouseMove: U, onPaneMouseLeave: R, onPaneContextMenu: K, onPaneScroll: F, paneClickDistance: Z, deleteKeyCode: z, selectionKeyCode: _, selectionOnDrag: y, selectionMode: x, onSelectionStart: u, onSelectionEnd: h, multiSelectionKeyCode: E, panActivationKeyCode: S, zoomActivationKeyCode: M, elementsSelectable: V, zoomOnScroll: $, zoomOnPinch: L, zoomOnDoubleClick: W, panOnScroll: C, panOnScrollSpeed: O, panOnScrollMode: P, panOnDrag: j, autoPanOnSelection: Y, defaultViewport: T, translateExtent: B, minZoom: D, maxZoom: w, onSelectionContextMenu: f, preventScrolling: N, noDragClassName: ve, noWheelClassName: tt, noPanClassName: Fe, disableKeyboardA11y: Ye, onViewportChange: je, isControlledViewport: !!ze, children: A(Kx, { children: [p(qx, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: ue, onReconnectStart: Ee, onReconnectEnd: be, onlyRenderVisibleElements: I, onEdgeContextMenu: Q, onEdgeMouseEnter: ee, onEdgeMouseMove: ne, onEdgeMouseLeave: oe, reconnectRadius: ce, defaultMarkerColor: k, noPanClassName: Fe, disableKeyboardA11y: Ye, rfId: Ae }), p(ob, { style: v, type: g, component: b, containerStyle: m }), p("div", { className: "react-flow__edgelabel-renderer" }), p(Ax, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: X, onlyRenderVisibleElements: I, noPanClassName: Fe, noDragClassName: ve, disableKeyboardA11y: Ye, nodeExtent: Se, rfId: Ae, nodesDraggable: Ne }), p("div", { className: "react-flow__viewport-portal" })] }) });
}
rc.displayName = "GraphView";
const ab = ge(rc), lb = el(), As = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: f, zIndexMode: u = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), m = r ?? t ?? [], _ = n ?? e ?? [], y = d ?? [0, 0], x = f ?? Qt;
  hl(v, b, m);
  const { nodesInitialized: E } = vo(_, h, g, {
    nodeOrigin: y,
    nodeExtent: x,
    zIndexMode: u
  });
  let S = [0, 0, 1];
  if (s && o && i) {
    const M = fn(h, {
      filter: (T) => !!((T.width || T.initialWidth) && (T.height || T.initialHeight))
    }), { x: z, y: I, zoom: V } = yr(M, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    S = [z, I, V];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: S,
    nodes: _,
    nodesInitialized: E,
    nodeLookup: h,
    parentLookup: g,
    edges: m,
    edgeLookup: b,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: Qt,
    nodeExtent: x,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: It.Strict,
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
    connection: { ...Ua },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: lb,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Xa,
    zIndexMode: u,
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
}, cb = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: f, zIndexMode: u }) => vw((h, g) => {
  async function v() {
    const { nodeLookup: b, panZoom: m, fitViewOptions: _, fitViewResolver: y, width: x, height: E, minZoom: S, maxZoom: M } = g();
    m && (await ry({
      nodes: b,
      width: x,
      height: E,
      panZoom: m,
      minZoom: S,
      maxZoom: M
    }, _), y == null || y.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...As({
      nodes: e,
      edges: t,
      width: o,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: l,
      maxZoom: c,
      nodeOrigin: d,
      nodeExtent: f,
      defaultNodes: n,
      defaultEdges: r,
      zIndexMode: u
    }),
    setNodes: (b) => {
      const { nodeLookup: m, parentLookup: _, nodeOrigin: y, nodeExtent: x, elevateNodesOnSelect: E, fitViewQueued: S, zIndexMode: M, nodesSelectionActive: z } = g(), { nodesInitialized: I, hasSelectedNodes: V } = vo(b, m, _, {
        nodeOrigin: y,
        nodeExtent: x,
        elevateNodesOnSelect: E,
        checkEquality: !0,
        zIndexMode: M
      }), T = z && V;
      S && I ? (v(), h({
        nodes: b,
        nodesInitialized: I,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: T
      })) : h({ nodes: b, nodesInitialized: I, nodesSelectionActive: T });
    },
    setEdges: (b) => {
      const { connectionLookup: m, edgeLookup: _ } = g();
      hl(m, _, b), h({ edges: b });
    },
    setDefaultNodesAndEdges: (b, m) => {
      if (b) {
        const { setNodes: _ } = g();
        _(b), h({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: _ } = g();
        _(m), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (b) => {
      const { triggerNodeChanges: m, nodeLookup: _, parentLookup: y, domNode: x, nodeOrigin: E, nodeExtent: S, debug: M, fitViewQueued: z, zIndexMode: I } = g(), { changes: V, updatedInternals: T } = Ny(b, _, y, x, E, S, I);
      T && (_y(_, y, { nodeOrigin: E, nodeExtent: S, zIndexMode: I }), z ? (v(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), (V == null ? void 0 : V.length) > 0 && (M && console.log("React Flow: trigger node changes", V), m == null || m(V)));
    },
    updateNodePositions: (b, m = !1) => {
      const _ = [];
      let y = [];
      const { nodeLookup: x, triggerNodeChanges: E, connection: S, updateConnection: M, onNodesChangeMiddlewareMap: z } = g();
      for (const [I, V] of b) {
        const T = x.get(I), B = !!(T != null && T.expandParent && (T != null && T.parentId) && (V != null && V.position)), D = {
          id: I,
          type: "position",
          position: B ? {
            x: Math.max(0, V.position.x),
            y: Math.max(0, V.position.y)
          } : V.position,
          dragging: m
        };
        if (T && S.inProgress && S.fromNode.id === T.id) {
          const w = bt(T, S.fromHandle, G.Left, !0);
          M({ ...S, from: w });
        }
        B && T.parentId && _.push({
          id: I,
          parentId: T.parentId,
          rect: {
            ...V.internals.positionAbsolute,
            width: V.measured.width ?? 0,
            height: V.measured.height ?? 0
          }
        }), y.push(D);
      }
      if (_.length > 0) {
        const { parentLookup: I, nodeOrigin: V } = g(), T = Ko(_, x, I, V);
        y.push(...T);
      }
      for (const I of z.values())
        y = I(y);
      E(y);
    },
    triggerNodeChanges: (b) => {
      const { onNodesChange: m, setNodes: _, nodes: y, hasDefaultNodes: x, debug: E } = g();
      if (b != null && b.length) {
        if (x) {
          const S = Ww(b, y);
          _(S);
        }
        E && console.log("React Flow: trigger node changes", b), m == null || m(b);
      }
    },
    triggerEdgeChanges: (b) => {
      const { onEdgesChange: m, setEdges: _, edges: y, hasDefaultEdges: x, debug: E } = g();
      if (b != null && b.length) {
        if (x) {
          const S = Fw(b, y);
          _(S);
        }
        E && console.log("React Flow: trigger edge changes", b), m == null || m(b);
      }
    },
    addSelectedNodes: (b) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: x, triggerEdgeChanges: E } = g();
      if (m) {
        const S = b.map((M) => ft(M, !0));
        x(S);
        return;
      }
      x(St(y, /* @__PURE__ */ new Set([...b]), !0)), E(St(_));
    },
    addSelectedEdges: (b) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: x, triggerEdgeChanges: E } = g();
      if (m) {
        const S = b.map((M) => ft(M, !0));
        E(S);
        return;
      }
      E(St(_, /* @__PURE__ */ new Set([...b]))), x(St(y, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: b, edges: m } = {}) => {
      const { edges: _, nodes: y, nodeLookup: x, triggerNodeChanges: E, triggerEdgeChanges: S } = g(), M = b || y, z = m || _, I = [];
      for (const T of M) {
        if (!T.selected)
          continue;
        const B = x.get(T.id);
        B && (B.selected = !1), I.push(ft(T.id, !1));
      }
      const V = [];
      for (const T of z)
        T.selected && V.push(ft(T.id, !1));
      E(I), S(V);
    },
    setMinZoom: (b) => {
      const { panZoom: m, maxZoom: _ } = g();
      m == null || m.setScaleExtent([b, _]), h({ minZoom: b });
    },
    setMaxZoom: (b) => {
      const { panZoom: m, minZoom: _ } = g();
      m == null || m.setScaleExtent([_, b]), h({ maxZoom: b });
    },
    setTranslateExtent: (b) => {
      var m;
      (m = g().panZoom) == null || m.setTranslateExtent(b), h({ translateExtent: b });
    },
    resetSelectedElements: () => {
      const { edges: b, nodes: m, triggerNodeChanges: _, triggerEdgeChanges: y, elementsSelectable: x } = g();
      if (!x)
        return;
      const E = m.reduce((M, z) => z.selected ? [...M, ft(z.id, !1)] : M, []), S = b.reduce((M, z) => z.selected ? [...M, ft(z.id, !1)] : M, []);
      _(E), y(S);
    },
    setNodeExtent: (b) => {
      const { nodes: m, nodeLookup: _, parentLookup: y, nodeOrigin: x, elevateNodesOnSelect: E, nodeExtent: S, zIndexMode: M } = g();
      b[0][0] === S[0][0] && b[0][1] === S[0][1] && b[1][0] === S[1][0] && b[1][1] === S[1][1] || (vo(m, _, y, {
        nodeOrigin: x,
        nodeExtent: b,
        elevateNodesOnSelect: E,
        checkEquality: !1,
        zIndexMode: M
      }), h({ nodeExtent: b }));
    },
    panBy: (b) => {
      const { transform: m, width: _, height: y, panZoom: x, translateExtent: E } = g();
      return Cy({ delta: b, panZoom: x, transform: m, translateExtent: E, width: _, height: y });
    },
    setCenter: async (b, m, _) => {
      const { width: y, height: x, maxZoom: E, panZoom: S } = g();
      if (!S)
        return !1;
      const M = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : E;
      return await S.setViewport({
        x: y / 2 - b * M,
        y: x / 2 - m * M,
        zoom: M
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...Ua }
      });
    },
    updateConnection: (b) => {
      h({ connection: b });
    },
    reset: () => h({ ...As() })
  };
}, Object.is);
function Qo({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: f, zIndexMode: u, children: h }) {
  const [g] = re(() => cb({
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
    nodeExtent: f,
    zIndexMode: u
  }));
  return p(_w, { value: g, children: p(Uw, { children: p(cx, { children: h }) }) });
}
function db({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: f, nodeExtent: u, zIndexMode: h }) {
  return Pt(br) ? p(ke, { children: e }) : p(Qo, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: f, nodeExtent: u, zIndexMode: h, children: e });
}
const ub = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function fb({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: f, onMoveEnd: u, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: b, onClickConnectEnd: m, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: x, onNodeContextMenu: E, onNodeDoubleClick: S, onNodeDragStart: M, onNodeDrag: z, onNodeDragStop: I, onNodesDelete: V, onEdgesDelete: T, onDelete: B, onSelectionChange: D, onSelectionDragStart: w, onSelectionDrag: N, onSelectionDragStop: k, onSelectionContextMenu: $, onSelectionStart: L, onSelectionEnd: C, onBeforeDelete: O, connectionMode: P, connectionLineType: W = st.Bezier, connectionLineStyle: j, connectionLineComponent: Y, connectionLineContainerStyle: q, deleteKeyCode: te = "Backspace", selectionKeyCode: U = "Shift", selectionOnDrag: R = !1, selectionMode: F = Jt.Full, panActivationKeyCode: K = "Space", multiSelectionKeyCode: Z = tn() ? "Meta" : "Control", zoomActivationKeyCode: X = tn() ? "Meta" : "Control", snapToGrid: Q, snapGrid: ee, onlyRenderVisibleElements: ne = !1, selectNodesOnDrag: oe, nodesDraggable: ce, autoPanOnNodeFocus: ue, nodesConnectable: Ee, nodesFocusable: be, nodeOrigin: ve = Il, edgesFocusable: tt, edgesReconnectable: Fe, elementsSelectable: Ye = !0, defaultViewport: Se = Ow, minZoom: Ae = 0.5, maxZoom: ze = 2, translateExtent: je = Qt, preventScrolling: Ne = !0, nodeExtent: kt, defaultMarkerColor: gn = "#b1b1b7", zoomOnScroll: Sr = !0, zoomOnPinch: Nr = !0, panOnScroll: mn = !1, panOnScrollSpeed: Cr = 0.5, panOnScrollMode: Mr = gt.Free, zoomOnDoubleClick: $r = !0, panOnDrag: Ir = !0, onPaneClick: Ar, onPaneMouseEnter: zr, onPaneMouseMove: Tr, onPaneMouseLeave: Lr, onPaneScroll: Or, onPaneContextMenu: yn, paneClickDistance: Pr = 1, nodeClickDistance: Dt = 0, children: dt, onReconnect: Dr, onReconnectStart: wn, onReconnectEnd: xn, onEdgeContextMenu: Rr, onEdgeDoubleClick: bn, onEdgeMouseEnter: Hr, onEdgeMouseMove: vn, onEdgeMouseLeave: _n, reconnectRadius: kn = 10, onNodesChange: En, onEdgesChange: Sn, noDragClassName: H = "nodrag", noWheelClassName: fe = "nowheel", noPanClassName: nt = "nopan", fitView: ti, fitViewOptions: ni, connectOnClick: wc, attributionPosition: xc, proOptions: bc, defaultEdgeOptions: vc, elevateNodesOnSelect: _c = !0, elevateEdgesOnSelect: kc = !1, disableKeyboardA11y: ri = !1, autoPanOnConnect: Ec, autoPanOnNodeDrag: Sc, autoPanOnSelection: Nc = !0, autoPanSpeed: Cc, connectionRadius: Mc, isValidConnection: $c, onError: Ic, style: Ac, id: oi, nodeDragThreshold: zc, connectionDragThreshold: Tc, viewport: Lc, onViewportChange: Oc, width: Pc, height: Dc, colorMode: Rc = "light", debug: Hc, onScroll: Nn, ariaLabelConfig: Bc, zIndexMode: ii = "basic", ...Vc }, Wc) {
  const Br = oi || "1", Fc = Hw(Rc), Yc = De((si) => {
    si.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Nn == null || Nn(si);
  }, [Nn]);
  return p("div", { "data-testid": "rf__wrapper", ...Vc, onScroll: Yc, style: { ...Ac, ...ub }, ref: Wc, className: xe(["react-flow", o, Fc]), id: oi, role: "application", children: A(db, { nodes: e, edges: t, width: Pc, height: Dc, fitView: ti, fitViewOptions: ni, minZoom: Ae, maxZoom: ze, nodeOrigin: ve, nodeExtent: kt, zIndexMode: ii, children: [p(Rw, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: h, onConnectStart: g, onConnectEnd: v, onClickConnectStart: b, onClickConnectEnd: m, nodesDraggable: ce, autoPanOnNodeFocus: ue, nodesConnectable: Ee, nodesFocusable: be, edgesFocusable: tt, edgesReconnectable: Fe, elementsSelectable: Ye, elevateNodesOnSelect: _c, elevateEdgesOnSelect: kc, minZoom: Ae, maxZoom: ze, nodeExtent: kt, onNodesChange: En, onEdgesChange: Sn, snapToGrid: Q, snapGrid: ee, connectionMode: P, translateExtent: je, connectOnClick: wc, defaultEdgeOptions: vc, fitView: ti, fitViewOptions: ni, onNodesDelete: V, onEdgesDelete: T, onDelete: B, onNodeDragStart: M, onNodeDrag: z, onNodeDragStop: I, onSelectionDrag: N, onSelectionDragStart: w, onSelectionDragStop: k, onMove: d, onMoveStart: f, onMoveEnd: u, noPanClassName: nt, nodeOrigin: ve, rfId: Br, autoPanOnConnect: Ec, autoPanOnNodeDrag: Sc, autoPanSpeed: Cc, onError: Ic, connectionRadius: Mc, isValidConnection: $c, selectNodesOnDrag: oe, nodeDragThreshold: zc, connectionDragThreshold: Tc, onBeforeDelete: O, debug: Hc, ariaLabelConfig: Bc, zIndexMode: ii }), p(ab, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: x, onNodeContextMenu: E, onNodeDoubleClick: S, nodeTypes: i, edgeTypes: s, connectionLineType: W, connectionLineStyle: j, connectionLineComponent: Y, connectionLineContainerStyle: q, selectionKeyCode: U, selectionOnDrag: R, selectionMode: F, deleteKeyCode: te, multiSelectionKeyCode: Z, panActivationKeyCode: K, zoomActivationKeyCode: X, onlyRenderVisibleElements: ne, defaultViewport: Se, translateExtent: je, minZoom: Ae, maxZoom: ze, preventScrolling: Ne, zoomOnScroll: Sr, zoomOnPinch: Nr, zoomOnDoubleClick: $r, panOnScroll: mn, panOnScrollSpeed: Cr, panOnScrollMode: Mr, panOnDrag: Ir, autoPanOnSelection: Nc, onPaneClick: Ar, onPaneMouseEnter: zr, onPaneMouseMove: Tr, onPaneMouseLeave: Lr, onPaneScroll: Or, onPaneContextMenu: yn, paneClickDistance: Pr, nodeClickDistance: Dt, onSelectionContextMenu: $, onSelectionStart: L, onSelectionEnd: C, onReconnect: Dr, onReconnectStart: wn, onReconnectEnd: xn, onEdgeContextMenu: Rr, onEdgeDoubleClick: bn, onEdgeMouseEnter: Hr, onEdgeMouseMove: vn, onEdgeMouseLeave: _n, reconnectRadius: kn, defaultMarkerColor: gn, noDragClassName: H, noWheelClassName: fe, noPanClassName: nt, rfId: Br, disableKeyboardA11y: ri, nodeExtent: kt, viewport: Lc, onViewportChange: Oc, nodesDraggable: ce }), p(Lw, { onSelectionChange: D }), dt, p($w, { proOptions: bc, position: xc }), p(Mw, { rfId: Br, disableKeyboardA11y: ri })] }) });
}
var oc = zl(fb);
function hb({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return p("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: xe(["react-flow__background-pattern", n, r]) });
}
function pb({ radius: e, className: t }) {
  return p("circle", { cx: e, cy: e, r: e, className: xe(["react-flow__background-pattern", "dots", t]) });
}
var lt;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(lt || (lt = {}));
const gb = {
  [lt.Dots]: 1,
  [lt.Lines]: 1,
  [lt.Cross]: 6
}, mb = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function ic({
  id: e,
  variant: t = lt.Dots,
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
  const f = ie(null), { transform: u, patternId: h } = se(mb, pe), g = r || gb[t], v = t === lt.Dots, b = t === lt.Cross, m = Array.isArray(n) ? n : [n, n], _ = [m[0] * u[2] || 1, m[1] * u[2] || 1], y = g * u[2], x = Array.isArray(i) ? i : [i, i], E = b ? [y, y] : _, S = [
    x[0] * u[2] + E[0] / 2,
    x[1] * u[2] + E[1] / 2
  ], M = `${h}${e || ""}`;
  return A("svg", { className: xe(["react-flow__background", c]), style: {
    ...l,
    ..._r,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [p("pattern", { id: M, x: u[0] % _[0], y: u[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${S[0]},-${S[1]})`, children: v ? p(pb, { radius: y / 2, className: d }) : p(hb, { dimensions: E, lineWidth: o, variant: t, className: d }) }), p("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${M})` })] });
}
ic.displayName = "Background";
const sc = ge(ic);
function yb() {
  return p("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: p("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function wb() {
  return p("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: p("path", { d: "M0 0h32v4.2H0z" }) });
}
function xb() {
  return p("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: p("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function bb() {
  return p("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: p("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function vb() {
  return p("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: p("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function Pn({ children: e, className: t, ...n }) {
  return p("button", { type: "button", className: xe(["react-flow__controls-button", t]), ...n, children: e });
}
const _b = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function ac({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: f = "bottom-left", orientation: u = "vertical", "aria-label": h }) {
  const g = he(), { isInteractive: v, minZoomReached: b, maxZoomReached: m, ariaLabelConfig: _ } = se(_b, pe), { zoomIn: y, zoomOut: x, fitView: E } = vr(), S = () => {
    y(), i == null || i();
  }, M = () => {
    x(), s == null || s();
  }, z = () => {
    E(o), a == null || a();
  }, I = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l == null || l(!v);
  };
  return A(vt, { className: xe(["react-flow__controls", u === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? _["controls.ariaLabel"], children: [t && A(ke, { children: [p(Pn, { onClick: S, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: m, children: p(yb, {}) }), p(Pn, { onClick: M, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: b, children: p(wb, {}) })] }), n && p(Pn, { className: "react-flow__controls-fitview", onClick: z, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: p(xb, {}) }), r && p(Pn, { className: "react-flow__controls-interactive", onClick: I, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? p(vb, {}) : p(bb, {}) }), d] });
}
ac.displayName = "Controls";
const lc = ge(ac);
function kb({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: f, selected: u, onClick: h }) {
  const { background: g, backgroundColor: v } = i || {}, b = s || g || v;
  return p("rect", { className: xe(["react-flow__minimap-node", { selected: u }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: b,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: h ? (m) => h(m, e) : void 0 });
}
const Eb = ge(kb), Sb = (e) => e.nodes.map((t) => t.id), no = (e) => e instanceof Function ? e : () => e;
function Nb({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Eb,
  onClick: s
}) {
  const a = se(Sb, pe), l = no(t), c = no(e), d = no(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return p(ke, { children: a.map((u) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    p(Mb, { id: u, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, u)
  )) });
}
function Cb({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: f, width: u, height: h } = se((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const b = v.internals.userNode, { x: m, y: _ } = v.internals.positionAbsolute, { width: y, height: x } = We(b);
    return {
      node: b,
      x: m,
      y: _,
      width: y,
      height: x
    };
  }, pe);
  return !c || c.hidden || !tl(c) ? null : p(a, { x: d, y: f, width: u, height: h, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const Mb = ge(Cb);
var $b = ge(Nb);
const Ib = 200, Ab = 150, zb = (e) => !e.hidden, Tb = (e) => {
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
    boundingRect: n ? Qa(fn(e.nodeLookup, { filter: zb }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, zs = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, Lb = (e, t) => zs(e.viewBB, t.viewBB) && zs(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, Ob = "react-flow__minimap-desc";
function cc({
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
  maskStrokeWidth: f,
  position: u = "bottom-right",
  onClick: h,
  onNodeClick: g,
  pannable: v = !1,
  zoomable: b = !1,
  ariaLabel: m,
  inversePan: _,
  zoomStep: y = 1,
  offsetScale: x = 5
}) {
  const E = he(), S = ie(null), { boundingRect: M, panZoom: z, viewBB: I, rfId: V, translateExtent: T, flowWidth: B, flowHeight: D, ariaLabelConfig: w } = se(Tb, Lb), N = (e == null ? void 0 : e.width) ?? Ib, k = (e == null ? void 0 : e.height) ?? Ab, $ = M.width / N, L = M.height / k, C = Math.max($, L), O = C * N, P = C * k, W = x * C, j = M.x - (O - M.width) / 2 - W, Y = M.y - (P - M.height) / 2 - W, q = O + W * 2, te = P + W * 2, U = `${Ob}-${V}`, R = ie(0), F = ie();
  R.current = C, le(() => {
    const ee = E.getState().panZoom;
    if (S.current && ee)
      return F.current = Py({
        domNode: S.current,
        panZoom: ee,
        getTransform: () => E.getState().transform,
        getViewScale: () => R.current
      }), () => {
        var ne;
        (ne = F.current) == null || ne.destroy();
      };
  }, [z]), le(() => {
    var ee;
    (ee = F.current) == null || ee.update({
      translateExtent: T,
      width: B,
      height: D,
      inversePan: _,
      pannable: v,
      zoomStep: y,
      zoomable: b
    });
  }, [v, b, _, y, T, B, D]);
  const K = h ? (ee) => {
    var ce;
    const [ne, oe] = ((ce = F.current) == null ? void 0 : ce.pointer(ee)) || [0, 0];
    h(ee, { x: ne, y: oe });
  } : void 0, Z = De((ee, ne) => {
    const oe = E.getState().nodeLookup.get(ne).internals.userNode;
    g == null || g(ee, oe);
  }, [g]), X = g ? Z : void 0, Q = m ?? w["minimap.ariaLabel"];
  return p(vt, { position: u, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * C : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: xe(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: A("svg", { width: N, height: k, viewBox: `${j} ${Y} ${q} ${te}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": U, ref: S, onClick: K, children: [Q && p("title", { id: U, children: Q }), p($b, { onClick: X, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), p("path", { className: "react-flow__minimap-mask", d: `M${j - W},${Y - W}h${q + W * 2}v${te + W * 2}h${-q - W * 2}z
        M${I.x},${I.y}h${I.width}v${I.height}h${-I.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
cc.displayName = "MiniMap";
const dc = ge(cc), Pb = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, Db = {
  [Lt.Line]: "right",
  [Lt.Handle]: "bottom-right"
};
function Rb({ nodeId: e, position: t, variant: n = Lt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: u, autoScale: h = !0, shouldResize: g, onResizeStart: v, onResize: b, onResizeEnd: m }) {
  const _ = Dl(), y = typeof e == "string" ? e : _, x = he(), E = ie(null), S = n === Lt.Handle, M = se(De(Pb(S && h), [S, h]), pe), z = ie(null), I = t ?? Db[n];
  le(() => {
    if (!(!E.current || !y))
      return z.current || (z.current = qy({
        domNode: E.current,
        nodeId: y,
        getStoreItems: () => {
          const { nodeLookup: T, transform: B, snapGrid: D, snapToGrid: w, nodeOrigin: N, domNode: k } = x.getState();
          return {
            nodeLookup: T,
            transform: B,
            snapGrid: D,
            snapToGrid: w,
            nodeOrigin: N,
            paneDomNode: k
          };
        },
        onChange: (T, B) => {
          const { triggerNodeChanges: D, nodeLookup: w, parentLookup: N, nodeOrigin: k } = x.getState(), $ = [], L = { x: T.x, y: T.y }, C = w.get(y);
          if (C && C.expandParent && C.parentId) {
            const O = C.origin ?? k, P = T.width ?? C.measured.width ?? 0, W = T.height ?? C.measured.height ?? 0, j = {
              id: C.id,
              parentId: C.parentId,
              rect: {
                width: P,
                height: W,
                ...nl({
                  x: T.x ?? C.position.x,
                  y: T.y ?? C.position.y
                }, { width: P, height: W }, C.parentId, w, O)
              }
            }, Y = Ko([j], w, N, k);
            $.push(...Y), L.x = T.x ? Math.max(O[0] * P, T.x) : void 0, L.y = T.y ? Math.max(O[1] * W, T.y) : void 0;
          }
          if (L.x !== void 0 && L.y !== void 0) {
            const O = {
              id: y,
              type: "position",
              position: { ...L }
            };
            $.push(O);
          }
          if (T.width !== void 0 && T.height !== void 0) {
            const P = {
              id: y,
              type: "dimensions",
              resizing: !0,
              setAttributes: u ? u === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: T.width,
                height: T.height
              }
            };
            $.push(P);
          }
          for (const O of B) {
            const P = {
              ...O,
              type: "position"
            };
            $.push(P);
          }
          D($);
        },
        onEnd: ({ width: T, height: B }) => {
          const D = {
            id: y,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: T,
              height: B
            }
          };
          x.getState().triggerNodeChanges([D]);
        }
      })), z.current.update({
        controlPosition: I,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: d
        },
        keepAspectRatio: f,
        resizeDirection: u,
        onResizeStart: v,
        onResize: b,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        var T;
        (T = z.current) == null || T.destroy();
      };
  }, [
    I,
    a,
    l,
    c,
    d,
    f,
    v,
    b,
    m,
    g
  ]);
  const V = I.split("-");
  return p("div", { className: xe(["react-flow__resize-control", "nodrag", ...V, n, r]), ref: E, style: {
    ...o,
    scale: M,
    ...s && { [S ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
ge(Rb);
const Hb = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", Jo = 0.05, uc = 370, Ts = "system-map-flow-css", Bb = `
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
if (!document.getElementById(Ts)) {
  const e = document.createElement("style");
  e.id = Ts, e.textContent = Hb + Bb, document.head.appendChild(e);
}
function fc(e, t) {
  const n = vr(), r = se((s) => s.width), o = se((s) => s.height), i = ie(!1);
  le(() => {
    if (!r || !o || e.length === 0) return;
    const s = Math.min(...e.map((u) => u.x)), a = Math.min(...e.map((u) => u.y)), l = Math.max(...e.map((u) => u.x + u.width)), c = Math.max(...e.map((u) => u.y + u.height)), d = Math.min(t, r * 0.5), f = yr(
      { x: s, y: a, width: l - s, height: c - a },
      r - d,
      o,
      Jo,
      1,
      0.05
    );
    n.setViewport(f, { duration: i.current ? 200 : 0 }), i.current = !0;
  }, [n, e, t, r, o]);
}
const Yn = { names: 210, keys: 240, columns: 240 }, Eo = 34, Xt = 20, Vb = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, Wb = ge(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", f = Vb[n.status], u = (f == null ? void 0 : f.color) ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ A(
    "div",
    {
      style: {
        width: l,
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${f ? 2 : 1}px ${d || f != null && f.dashed ? "dashed" : "solid"} ${a ? "var(--accent, #2563eb)" : u}`,
        boxShadow: a ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : void 0,
        fontSize: 12
      },
      children: [
        /* @__PURE__ */ p(ct, { type: "target", position: G.Left, isConnectable: !1 }),
        /* @__PURE__ */ p(ct, { type: "source", position: G.Right, isConnectable: !1 }),
        /* @__PURE__ */ A(
          "div",
          {
            style: {
              height: Eo,
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
              /* @__PURE__ */ p("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                f && /* @__PURE__ */ p("span", { style: { color: f.color, fontWeight: 600 }, children: n.status }),
                s > 0 && /* @__PURE__ */ A("span", { style: { fontWeight: s > 1 ? 600 : 400, color: s > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
                  s,
                  " at work"
                ] }),
                i > 0 && /* @__PURE__ */ p("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ p("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                d && /* @__PURE__ */ p("span", { style: J, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((h) => /* @__PURE__ */ A(
          "div",
          {
            style: { height: Xt, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ p("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: h.primary ? "PK" : h.foreign ? "FK" : h.proposed ? "new" : "" }),
              /* @__PURE__ */ p("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: h.proposed ? 600 : void 0 }, children: h.name }),
              /* @__PURE__ */ p("span", { style: { ...J, ...He, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: h.type })
            ]
          },
          h.name
        )),
        o > 0 && /* @__PURE__ */ A("div", { style: { ...J, height: Xt, padding: "0 10px", lineHeight: `${Xt}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), Fb = { table: Wb };
function hc(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function ir(e, t) {
  if (t === "names") return Eo + 2;
  const n = hc(e, t).length;
  return Eo + n * Xt + (n < e.columns.length ? Xt : 0) + 2;
}
function Yb(e, t) {
  const n = Yn[t], r = new Un.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: ir(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  Un.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - ir(a, t) / 2 });
  }
  return s;
}
function jb(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const So = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function Gb(e) {
  return (So.find(([t]) => t === e) ?? So[2])[1];
}
function Xb() {
  return /* @__PURE__ */ A(
    "div",
    {
      style: {
        display: "flex",
        gap: 10,
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        /* @__PURE__ */ p("span", { style: J, children: "On delete" }),
        So.map(([e, t]) => /* @__PURE__ */ A("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ p("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function Ub({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  onSelect: i
}) {
  const { mode: s } = Hs(), a = ae(() => t ? jb(e, t) : e, [e, t]), l = t && o === "names" ? "keys" : o, c = ae(() => Yb(a, l), [a, l]), d = ae(
    () => a.tables.map((h) => {
      const g = hc(h, l);
      return {
        id: h.id,
        type: "table",
        position: c.get(h.id) ?? { x: 0, y: 0 },
        width: Yn[l],
        height: ir(h, l),
        data: {
          table: h,
          columns: g,
          hidden: l === "names" ? 0 : h.columns.length - g.length,
          flags: n.get(h.id) ?? 0,
          working: r.get(h.id) ?? 0,
          focused: h.id === t,
          width: Yn[l],
          large: l === "names"
        }
      };
    }),
    [a, l, c, n, r, t]
  ), f = ae(
    () => a.edges.map((h) => {
      const g = Gb(h.on_delete);
      return {
        id: h.id,
        source: h.source,
        target: h.target,
        selectable: !1,
        markerEnd: { type: At.ArrowClosed, width: 14, height: 14, color: g },
        style: { stroke: g, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [a, t]
  ), u = ae(
    () => a.tables.map((h) => ({
      ...c.get(h.id) ?? { x: 0, y: 0 },
      width: Yn[l],
      height: ir(h, l)
    })),
    [a, c, l]
  );
  return fc(u, t ? uc : 0), /* @__PURE__ */ A(
    oc,
    {
      nodes: d,
      edges: f,
      nodeTypes: Fb,
      colorMode: s,
      minZoom: Jo,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (h, g) => i(g.id),
      onPaneClick: () => i(null),
      children: [
        /* @__PURE__ */ p(sc, { gap: 24, size: 1 }),
        /* @__PURE__ */ p(lc, { showInteractive: !1 }),
        /* @__PURE__ */ p(dc, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ p(vt, { position: "top-left", children: /* @__PURE__ */ p(Xb, {}) })
      ]
    }
  );
}
function qb(e) {
  return /* @__PURE__ */ p("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ p(Qo, { children: /* @__PURE__ */ p(Ub, { ...e }) }) });
}
const Kb = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], Zb = {
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
}, Qb = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], pc = { accepted: "ok", dropped: "muted", draft: "aim" }, Ls = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, ei = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, Jb = { ...ei, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, ev = { ...J, ...He, fontSize: 11, overflowWrap: "anywhere" };
function rn(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function No(e) {
  return ln(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function Co({ title: e, children: t }) {
  return /* @__PURE__ */ A("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ p("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function gc({ limit: e }) {
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ p(an, { severity: e.severity }),
    /* @__PURE__ */ A("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ p("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ p("div", { style: { ...J, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ p("div", { style: ev, children: e.evidence.join("  ") })
    ] })
  ] });
}
function Dn({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ p(Co, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ p("button", { style: { ...Me, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? No(o.id) }),
    r && /* @__PURE__ */ p("span", { style: { ...J, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function tv({
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
  return /* @__PURE__ */ A("div", { "data-testid": "proposal-detail", children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ p(de, { onClick: r, children: "Back" }),
      /* @__PURE__ */ p("strong", { style: { fontSize: 14, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ p(me, { variant: pc[e.status], children: e.status }),
      /* @__PURE__ */ p("span", { style: { flex: 1 } }),
      /* @__PURE__ */ p(de, { primary: t, onClick: () => o("map"), children: "Show on map" }),
      /* @__PURE__ */ p(de, { onClick: () => o("data"), children: "Show in data model" }),
      /* @__PURE__ */ p(de, { onClick: s, disabled: !n, children: "Ask" })
    ] }),
    e.why && /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13, margin: "6px 0 0" }, children: e.why }),
    e.closes.map((d) => /* @__PURE__ */ A("p", { style: { fontSize: 13, margin: "8px 0 0" }, "data-testid": "closes", children: [
      "Closes ",
      d.before - d.after,
      " of ",
      rn(d.before, "gap"),
      " in ",
      /* @__PURE__ */ p("strong", { children: d.title }),
      "."
    ] }, d.id)),
    Qb.map(({ kind: d, title: f }) => {
      const u = e.limits.filter((h) => h.kind === d);
      return u.length === 0 ? null : /* @__PURE__ */ p(Co, { title: `${f} (${u.length})`, children: u.map((h, g) => /* @__PURE__ */ p(gc, { limit: h }, g)) }, d);
    }),
    /* @__PURE__ */ p(Dn, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ p(Dn, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ p(Dn, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ p(Dn, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    c.length > 0 && /* @__PURE__ */ p(Co, { title: "Draft SQL", children: /* @__PURE__ */ p("pre", { style: { ...He, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
`) }) }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      e.status !== "accepted" && /* @__PURE__ */ p(de, { primary: !0, onClick: () => a("accepted"), children: "Accept" }),
      e.status !== "dropped" && /* @__PURE__ */ p(de, { onClick: () => a("dropped"), children: "Drop" }),
      e.status !== "draft" && /* @__PURE__ */ p(de, { onClick: () => a("draft"), children: "Back to draft" }),
      /* @__PURE__ */ p("span", { style: { flex: 1 } }),
      /* @__PURE__ */ p(de, { danger: !0, onClick: l, children: "Delete" })
    ] }),
    /* @__PURE__ */ p("p", { style: { ...J, fontSize: 12, marginBottom: 0 }, children: "This stays in System Map. Nothing here changes your repo." })
  ] });
}
function nv({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ p("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ A("button", { style: Jb, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ A("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ p("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ p(me, { variant: "err", children: rn(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ A(me, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ p(me, { variant: pc[n.status], children: n.status })
      ] }),
      /* @__PURE__ */ A("span", { style: { ...J, fontSize: 12 }, children: [
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
function rv(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${rn(n, "unit test")}`, t ? rn(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${ar(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function ov({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ A("div", { style: ei, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ p("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ p(me, { variant: Ls[e.state].variant, children: Ls[e.state].label }),
      /* @__PURE__ */ p("button", { style: Me, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ p("button", { style: { ...Me, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ p("p", { style: { ...J, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ p("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ p(gc, { limit: i }, s)) }),
    /* @__PURE__ */ p("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ p("tbody", { children: e.parts.map((i) => /* @__PURE__ */ A("tr", { children: [
      /* @__PURE__ */ p("td", { style: { padding: "2px 8px 2px 0", ...J }, children: i.kind }),
      /* @__PURE__ */ p("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ p("button", { style: { ...Me, textAlign: "left" }, onClick: () => n(i.id), children: No(i.id) }) : No(i.id) }),
      /* @__PURE__ */ p("td", { style: { padding: "2px 0", ...J, textAlign: "right" }, children: rv(i) })
    ] }, i.id)) }) })
  ] });
}
function iv({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ p("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ A("div", { style: { ...ei, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ p("button", { style: { ...Me, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ A("span", { style: { ...J, fontSize: 12 }, children: [
      rn(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ p("button", { style: { ...Me, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function sv({
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
  onOpenView: f,
  onNode: u
}) {
  const [h, g] = re(""), v = Zb[o], b = () => {
    h.trim() && (s(v.ask(h.trim())), g(""));
  };
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ p("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: Kb.map(([m, _]) => /* @__PURE__ */ p(de, { primary: o === m, onClick: () => i(m), children: _ }, m)) }),
    /* @__PURE__ */ A(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (m) => {
          m.preventDefault(), b();
        },
        children: [
          /* @__PURE__ */ p(Bs, { "aria-label": "Describe it", placeholder: v.placeholder, value: h, onChange: (m) => g(m.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ p(de, { primary: !0, type: "submit", disabled: !r || !h.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ A("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ p(
        tv,
        {
          proposal: t,
          shown: n === t.id,
          canAsk: r,
          onBack: () => a(null),
          onDraw: l,
          onNode: u,
          onAsk: () => s(`Use the system-map tools. Read proposal ${t.id}, say what stands in the way, and how to get past it.`),
          onStatus: (m) => c(t.id, m),
          onDelete: () => d("proposals", t.id)
        }
      ) : /* @__PURE__ */ p(nv, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ A("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((m) => /* @__PURE__ */ p(
          ov,
          {
            item: m,
            canAsk: r,
            onShow: u,
            onAsk: () => s(`Use the system-map tools. Look at use case ${m.id}, and propose what would close its gaps.`),
            onDelete: () => d("use_cases", m.id)
          },
          m.id
        ))
      ] }),
      o === "views" && /* @__PURE__ */ p(iv, { rows: e.views, onOpen: f, onDelete: (m) => d("views", m) })
    ] })
  ] });
}
const av = ["high", "medium", "low", "info"];
function lv({
  findings: e,
  onShow: t,
  onAsk: n
}) {
  const [r, o] = re(null), i = ae(() => {
    const a = /* @__PURE__ */ new Map();
    for (const l of e) a.set(l.severity, (a.get(l.severity) ?? 0) + 1);
    return a;
  }, [e]), s = r ? e.filter((a) => a.severity === r) : e;
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ A(de, { primary: r === null, onClick: () => o(null), children: [
        "All ",
        e.length
      ] }),
      av.filter((a) => i.get(a)).map((a) => /* @__PURE__ */ A(de, { primary: r === a, onClick: () => o(a), children: [
        a,
        " ",
        i.get(a)
      ] }, a))
    ] }),
    s.length === 0 && /* @__PURE__ */ p("p", { style: J, children: "No findings." }),
    s.map((a) => /* @__PURE__ */ A("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ A("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ p(an, { severity: a.severity }),
        /* @__PURE__ */ p("span", { style: { flex: 1, fontWeight: 600 }, children: a.title }),
        /* @__PURE__ */ p("button", { style: Me, onClick: () => t(a.node), children: "Show" }),
        /* @__PURE__ */ p("button", { style: Me, onClick: () => n(a), children: "Ask" })
      ] }),
      /* @__PURE__ */ p("p", { style: { margin: "4px 0 0" }, children: a.detail }),
      /* @__PURE__ */ p("p", { style: { ...J, ...He, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: a.evidence.join("  ") })
    ] }, a.id))
  ] });
}
const cv = [
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
function dv(e) {
  return ln(e.replace(/^(module|area|route|job|service|plan|table):(public\.)?/, ""));
}
function Er({ title: e, children: t }) {
  return /* @__PURE__ */ A("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ p("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function uv({ link: e, onOpen: t }) {
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
    /* @__PURE__ */ p(
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
        children: dv(e.node)
      }
    ),
    e.access && /* @__PURE__ */ p("span", { style: { ...J, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ p("span", { style: { ...J, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function fv({ node: e, onOpen: t }) {
  return /* @__PURE__ */ p(ke, { children: cv.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ p(Er, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ p(uv, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function hv({ node: e }) {
  const n = [
    ["Path", e.path],
    ["Files", e.files],
    ["Lines", e.lines],
    ["Test files", e.test_files],
    ["Schedule", e.schedule],
    ["Status", e.status]
  ].filter(([, r]) => r !== void 0 && r !== "");
  return /* @__PURE__ */ p("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ p("tbody", { children: n.map(([r, o]) => /* @__PURE__ */ A("tr", { children: [
    /* @__PURE__ */ p("td", { style: { ...J, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: r }),
    /* @__PURE__ */ p("td", { style: { overflowWrap: "anywhere" }, children: o })
  ] }, r)) }) });
}
function pv({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ p(Er, { title: `Not found (${n.length})`, children: /* @__PURE__ */ p("ul", { style: { ...He, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ p("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function gv({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${ar(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ A(Er, { title: n ? `Risk: ${n}` : "Risk", children: [
    /* @__PURE__ */ A("p", { style: { margin: "0 0 4px" }, children: [
      e.commits,
      " commits in ",
      e.window_days,
      " days, ",
      e.complexity,
      " paths, tests: ",
      t,
      "."
    ] }),
    e.worst_files.length > 0 && /* @__PURE__ */ p("ul", { style: { ...He, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ p("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: ln(r.path) }, r.path)) })
  ] });
}
function mv({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ A(Er, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ p("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ p("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ A("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ p(an, { severity: n.severity }),
      /* @__PURE__ */ p("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function yv({
  node: e,
  work: t,
  overlaps: n,
  onAsk: r,
  onOpen: o,
  onClose: i,
  canAsk: s,
  onAskFinding: a
}) {
  var c;
  const l = e.id.startsWith("table:");
  return /* @__PURE__ */ A(
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
        /* @__PURE__ */ A("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ p("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.name }),
          !l && /* @__PURE__ */ p(me, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ p(de, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ p(de, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ A("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ p(mv, { names: t, overlaps: n }),
          e.risk && /* @__PURE__ */ p(gv, { risk: e.risk }),
          l ? /* @__PURE__ */ p(qc, { node: e, onAsk: a }) : /* @__PURE__ */ p(hv, { node: e }),
          !l && /* @__PURE__ */ p(pv, { node: e }),
          /* @__PURE__ */ p(fv, { node: e, onOpen: o }),
          !l && /* @__PURE__ */ p("p", { style: { ...J, ...He, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (c = e.evidence) == null ? void 0 : c.join("  ") })
        ] })
      ]
    }
  );
}
const wv = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], xv = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, bv = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function vv({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ A("div", { style: bv, "data-testid": e.id, children: [
    /* @__PURE__ */ p("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ A("p", { style: { ...J, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      xv[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ A("ul", { style: { ...He, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ p("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ A("li", { style: J, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ p("button", { style: Me, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ p("button", { style: Me, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ p("span", { style: { flex: 1 } }),
      /* @__PURE__ */ A(
        "select",
        {
          "aria-label": `Status of ${e.name}`,
          value: e.status_source === "you" ? e.status : "",
          onChange: (i) => r(e.id, i.target.value || null),
          style: { fontSize: 11, background: "transparent", color: "var(--muted, #71717a)", border: 0 },
          children: [
            /* @__PURE__ */ p("option", { value: "", children: "Auto" }),
            /* @__PURE__ */ p("option", { value: "built", children: "Mark built" }),
            /* @__PURE__ */ p("option", { value: "partial", children: "Mark partly built" }),
            /* @__PURE__ */ p("option", { value: "planned", children: "Mark not built" })
          ]
        }
      )
    ] })
  ] });
}
function _v({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ A("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ p("strong", { children: o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ p("span", { style: { ...J, fontSize: 13 }, children: "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ p("p", { style: J, children: "No specs found in docs/specs, docs/plans or specs." }),
    /* @__PURE__ */ p("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: wv.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ A("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ A("div", { children: [
          /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ p(me, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ p("span", { style: { ...J, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ p("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ p(vv, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function kv({ count: e, on: t, onToggle: n }) {
  return /* @__PURE__ */ A(de, { primary: t, onClick: n, title: "Show unfinished plans on the map", children: [
    "Plans on map ",
    e
  ] });
}
const Ev = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], Ze = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, ro = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, Os = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function Sv({ share: e }) {
  return /* @__PURE__ */ A("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ p("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ p("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ p("span", { style: { minWidth: 32, textAlign: "right" }, children: ar(e) })
  ] });
}
function Nv({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ p(me, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ p(me, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ p(me, { variant: "muted", children: "Untested" }) : null;
}
function Cv(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function Mv({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ A(ke, { children: [
      /* @__PURE__ */ A(me, { variant: "muted", children: [
        ar(i.lines_hit / i.lines_total),
        " of lines run by tests"
      ] }),
      /* @__PURE__ */ A("span", { style: J, children: [
        i.commit ? `Report from ${i.commit.slice(0, 7)}` : "Report from an unknown commit",
        i.files_changed_since ? `, ${i.files_changed_since} files changed since` : ""
      ] })
    ] }) : /* @__PURE__ */ p("span", { style: J, children: "No coverage report yet. Showing which tests reach each file through imports." }),
    /* @__PURE__ */ p("span", { style: { flex: 1 } }),
    n && /* @__PURE__ */ p("span", { style: { color: "var(--danger, #dc2626)" }, children: n }),
    /* @__PURE__ */ p(de, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ p(de, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function $v({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = re("modules"), [c, d] = re(!0), [f, u] = re(!1), [h, g] = re("score"), v = e.coverage !== null, b = ae(() => e[a].filter((x) => a === "modules" || !f || !x.ui), [e, a, f]), m = b.filter((x) => x.hot && x.untested), _ = ae(() => {
    const x = c ? m : b;
    if (h === "score") return x;
    const E = h === "cover" ? 1 : -1;
    return [...x].sort((S, M) => E * (S[h] - M[h]));
  }, [b, c, h]), y = a === "modules" ? "module" : "file";
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ A("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "risk-summary", children: [
      /* @__PURE__ */ p("strong", { children: m.length === 0 ? "Nothing busy is short of tests." : `${m.length} busy ${y}${m.length === 1 ? " has" : "s have"} little test cover.` }),
      " ",
      /* @__PURE__ */ A("span", { style: { ...J, fontSize: 13 }, children: [
        "Busy means more commits than three in four others, over ",
        e.window_days,
        " days. Little cover means under half."
      ] })
    ] }),
    !e.history_known && /* @__PURE__ */ p("p", { style: { ...J, margin: 0, fontSize: 13 }, children: "No git history here, so commits are not counted." }),
    e.shallow && /* @__PURE__ */ p("p", { style: { ...J, margin: 0, fontSize: 13 }, children: "This is a shallow clone, so commits are undercounted." }),
    /* @__PURE__ */ p(Mv, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ p(de, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ p(de, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ p("span", { style: { width: 8 } }),
      /* @__PURE__ */ p(de, { primary: c, onClick: () => d((x) => !x), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ p(de, { primary: f, onClick: () => u((x) => !x), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ A("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ A("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ p("thead", { children: /* @__PURE__ */ A("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ p("th", { style: { ...Ze, textAlign: "left" }, children: /* @__PURE__ */ A("button", { style: ro, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          Ev.map((x) => /* @__PURE__ */ p("th", { style: Ze, children: /* @__PURE__ */ p("button", { style: { ...ro, color: h === x.key ? "var(--text, inherit)" : ro.color }, title: x.title, onClick: () => g(x.key), children: x.label }) }, x.key)),
          /* @__PURE__ */ p("th", { style: Ze })
        ] }) }),
        /* @__PURE__ */ p("tbody", { children: _.map((x) => /* @__PURE__ */ A("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ A("td", { style: { ...Ze, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ p(
              "button",
              {
                onClick: () => r(x.id ?? x.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...Os, ...He } : Os,
                children: ln(x.path)
              }
            ),
            " ",
            /* @__PURE__ */ p(Nv, { row: x })
          ] }),
          /* @__PURE__ */ p("td", { style: Ze, children: x.commits }),
          /* @__PURE__ */ p("td", { style: Ze, children: x.complexity }),
          /* @__PURE__ */ p("td", { style: Ze, children: v ? /* @__PURE__ */ p(Sv, { share: x.covered ?? 0 }) : /* @__PURE__ */ p("span", { style: J, children: Cv(x, a) }) }),
          /* @__PURE__ */ p("td", { style: Ze, children: x.lines }),
          /* @__PURE__ */ p("td", { style: Ze, children: /* @__PURE__ */ p("button", { style: Me, onClick: () => o(x.id ?? x.path), disabled: !t, children: "Ask" }) })
        ] }, x.path)) })
      ] }),
      _.length === 0 && /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
const on = 200, sn = 58, Ps = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, Iv = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)"
}, Mo = {
  imports: { color: "var(--border-strong, #a1a1aa)", label: "imports" },
  renders: { color: "var(--muted, #71717a)", label: "renders" },
  uses_table: { color: "var(--accent, #2563eb)", label: "uses table" },
  uses_service: { color: "var(--warn-text, #b45309)", label: "uses service" },
  calls: { color: "var(--text, #18181b)", label: "calls" },
  touches: { color: "var(--danger, #dc2626)", dashed: !0, label: "plan touches" }
}, jn = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, Av = ge(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i } = t, s = n.status === "proposed", a = n.kind === "plan" || s, l = n.kind === "service", c = o.length > 1, d = s ? "var(--accent, #2563eb)" : a ? Iv[n.status ?? "unclear"] : c ? "var(--warn-text, #b45309)" : void 0, f = r ? "var(--accent, #2563eb)" : d ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ A(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: on,
        height: sn,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 12px",
        borderRadius: l ? 29 : 8,
        background: n.kind === "group" ? "var(--bg-hover, #f4f4f5)" : "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${r || c ? 2 : 1}px ${a || l ? "dashed" : "solid"} ${f}`,
        boxShadow: [i ? `inset 5px 0 0 ${jn[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ p(ct, { type: "target", position: G.Left, isConnectable: !1 }),
        /* @__PURE__ */ p(ct, { type: "source", position: G.Right, isConnectable: !1 }),
        /* @__PURE__ */ A("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ p("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          a && /* @__PURE__ */ p("span", { style: { fontSize: 11, color: d, flexShrink: 0 }, children: n.status }),
          i && /* @__PURE__ */ p("span", { style: { fontSize: 11, color: jn[i].color, flexShrink: 0 }, children: jn[i].label })
        ] }),
        /* @__PURE__ */ A("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ p("span", { style: { ...J, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [Ps[n.kind] && n.kind !== "area" && n.kind !== "plan" ? Ps[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ A("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: c ? 600 : 400, color: c ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] })
        ] })
      ]
    }
  );
}), zv = { card: Av };
function Tv(e, t) {
  const n = new Un.graphlib.Graph({ multigraph: !0 });
  n.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), n.setDefaultEdgeLabel(() => ({}));
  for (const o of e.cards) n.setNode(o.id, { width: on, height: sn });
  for (const o of e.lines)
    o.source !== o.target && n.setEdge(o.source, o.target, {}, o.id);
  Un.layout(n);
  const r = /* @__PURE__ */ new Map();
  for (const o of e.cards) {
    const i = n.node(o.id);
    r.set(o.id, { x: i.x - on / 2, y: i.y - sn / 2 });
  }
  return r;
}
function Lv(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function Ov(e) {
  const t = Mo[e.kind] ?? Mo.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: At.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: Lv(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function Pv({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(Mo).filter(([o]) => e.has(o));
  return /* @__PURE__ */ A(
    "div",
    {
      style: {
        display: "flex",
        gap: 10,
        whiteSpace: "nowrap",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        r.map(([o, i]) => /* @__PURE__ */ A("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ p("span", { style: { width: 14, height: 0, borderTop: `2px ${i.dashed ? "dashed" : "solid"} ${i.color}` } }),
          i.label
        ] }, o)),
        n && Object.values(jn).map((o) => /* @__PURE__ */ A("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ p("span", { style: { width: 5, height: 12, background: o.color } }),
          o.label
        ] }, o.label)),
        t && /* @__PURE__ */ p("span", { style: J, children: "Thin links hidden" })
      ]
    }
  );
}
function Dv({ system: e, focus: t, onFocus: n }) {
  const r = td(e, t);
  return /* @__PURE__ */ p(
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
      children: r.map((o, i) => {
        const s = i === r.length - 1;
        return /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6 }, children: [
          i > 0 && /* @__PURE__ */ p("span", { style: J, children: "/" }),
          /* @__PURE__ */ p(
            "button",
            {
              onClick: () => n(o.id),
              disabled: s,
              style: {
                background: "transparent",
                border: 0,
                padding: 0,
                fontSize: 13,
                cursor: s ? "default" : "pointer",
                fontWeight: s ? 600 : 400,
                color: s ? "var(--text, inherit)" : "var(--accent, #2563eb)"
              },
              children: o.label
            }
          )
        ] }, o.label);
      })
    }
  );
}
function Rv({
  system: e,
  focus: t,
  tables: n,
  showPlans: r,
  inspecting: o,
  risk: i,
  worktrees: s,
  only: a,
  layout: l,
  onFocus: c,
  onOpenTables: d
}) {
  const { mode: f } = Hs(), u = ae(() => a ? Kc(e, a, n) : Zc(e, t, n, r), [e, a, t, n, r]), h = ae(() => Tv(u, l === "top-down" ? "TB" : "LR"), [u, l]), g = ae(() => Qc(i), [i]), v = s == null ? void 0 : s.by_node, b = ae(
    () => u.cards.map((E) => ({
      id: E.id,
      type: "card",
      position: h.get(E.id) ?? { x: 0, y: 0 },
      width: on,
      height: sn,
      data: { card: E, focused: E.id === t, work: v ? ed(E.id, v) : [], band: Jc(g.get(E.id)) }
    })),
    [u, h, t, g, v]
  ), m = ae(() => u.lines.map(Ov), [u]), _ = ae(
    () => u.cards.map((E) => ({ ...h.get(E.id) ?? { x: 0, y: 0 }, width: on, height: sn })),
    [u, h]
  );
  fc(_, o ? uc : 0);
  const y = ae(() => new Set(u.lines.map((E) => E.kind)), [u]), x = (E) => {
    if (E === nd) d();
    else {
      if (E !== rd && E !== od && E === t) return;
      c(E);
    }
  };
  return /* @__PURE__ */ A(
    oc,
    {
      nodes: b,
      edges: m,
      nodeTypes: zv,
      colorMode: f,
      minZoom: Jo,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (E, S) => x(S.id),
      children: [
        /* @__PURE__ */ p(sc, { gap: 24, size: 1 }),
        /* @__PURE__ */ p(lc, { showInteractive: !1 }),
        /* @__PURE__ */ p(dc, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ p(vt, { position: "top-left", children: /* @__PURE__ */ p(Dv, { system: e, focus: t, onFocus: c }) }),
        /* @__PURE__ */ p(vt, { position: "bottom-center", children: /* @__PURE__ */ p(Pv, { kinds: y, top: t === null, risk: i !== null }) })
      ]
    }
  );
}
function Hv(e) {
  return /* @__PURE__ */ p("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ p(Qo, { children: /* @__PURE__ */ p(Rv, { ...e }) }) });
}
const mc = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, Bv = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, Vv = { ...He, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, oo = 6;
function Wv(e) {
  return ln(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function Xe({ title: e, children: t }) {
  return /* @__PURE__ */ A("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ p("span", { style: { ...J, fontSize: 12 }, children: e }),
    t
  ] });
}
function at({ ids: e, onShow: t }) {
  return /* @__PURE__ */ p("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ p("button", { style: Bv, onClick: () => t(n), children: Wv(n) }, n)) });
}
function Ds({ files: e }) {
  return /* @__PURE__ */ A("ul", { style: Vv, children: [
    e.slice(0, oo).map((t) => /* @__PURE__ */ p("li", { children: t }, t)),
    e.length > oo && /* @__PURE__ */ A("li", { style: J, children: [
      "and ",
      e.length - oo,
      " more"
    ] })
  ] });
}
const yc = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function Fv({ row: e, canAsk: t, onAsk: n }) {
  const r = yc[e.merge];
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ p(an, { severity: e.severity }),
    /* @__PURE__ */ A("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ A("span", { style: J, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ p("button", { style: Me, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function Yv({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = yc[e.merge];
  return /* @__PURE__ */ A("div", { style: mc, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ p(an, { severity: e.severity }),
      /* @__PURE__ */ p("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ p("button", { style: Me, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ p(Xe, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ p(Ds, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ p(Xe, { title: "Both change these tables", children: /* @__PURE__ */ p(at, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ p(Xe, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ p(at, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ p(Xe, { title: "Both change code that uses these tables", children: /* @__PURE__ */ p(at, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ p(Xe, { title: "Also share", children: /* @__PURE__ */ p(Ds, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ p(Xe, { title: "Same modules", children: /* @__PURE__ */ p(at, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ p("p", { style: { ...J, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function jv({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ A("div", { style: mc, "data-testid": "worktree", children: [
    /* @__PURE__ */ p("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ p("p", { style: { ...J, ...He, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.path }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ A(me, { variant: "muted", children: [
        e.ahead,
        " ahead"
      ] }),
      e.behind > 0 && /* @__PURE__ */ A(me, { variant: "muted", children: [
        e.behind,
        " behind"
      ] }),
      e.uncommitted_files > 0 && /* @__PURE__ */ A(me, { variant: "warn", children: [
        e.uncommitted_files,
        " uncommitted"
      ] }),
      /* @__PURE__ */ A(me, { variant: "muted", children: [
        e.files.length,
        " files"
      ] })
    ] }),
    e.tables_schema.length > 0 && /* @__PURE__ */ p(Xe, { title: "Changes these tables", children: /* @__PURE__ */ p(at, { ids: e.tables_schema, onShow: t }) }),
    e.modules.length > 0 && /* @__PURE__ */ p(Xe, { title: "Modules", children: /* @__PURE__ */ p(at, { ids: e.modules, onShow: t }) }),
    e.tables_code.length > 0 && /* @__PURE__ */ p(Xe, { title: "Code that uses", children: /* @__PURE__ */ p(at, { ids: e.tables_code, onShow: t }) }),
    n.length > 0 && /* @__PURE__ */ p(Xe, { title: "Routes and plans", children: /* @__PURE__ */ p(at, { ids: n, onShow: t }) })
  ] });
}
function Gv({
  state: e,
  checkedAt: t,
  canAsk: n,
  onShow: r,
  onAsk: o
}) {
  const { high: i, medium: s } = e.counts, a = i + s, l = e.overlaps.length - a, c = e.worktrees.filter((u) => u.files.length > 0), d = e.worktrees.length - c.length, f = a === 0 ? "No collisions ahead." : `${a} collision${a === 1 ? "" : "s"} ahead.`;
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)", overflow: "hidden" }, children: [
    /* @__PURE__ */ A("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "worktree-summary", children: [
      /* @__PURE__ */ p("strong", { children: f }),
      " ",
      /* @__PURE__ */ A("span", { style: { ...J, fontSize: 13 }, children: [
        c.length,
        " of ",
        e.worktrees.length,
        " worktrees have changes",
        l ? `, with ${l} smaller overlap${l === 1 ? "" : "s"}` : "",
        ".",
        t ? ` Checked ${new Date(t).toLocaleTimeString()}.` : ""
      ] })
    ] }),
    /* @__PURE__ */ A("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }, children: [
      a > 0 && /* @__PURE__ */ p("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((u) => u.severity === "high" || u.severity === "medium").map((u) => /* @__PURE__ */ p(Yv, { row: u, canAsk: n, onShow: r, onAsk: o }, `${u.a}|${u.b}`)) }),
      /* @__PURE__ */ A("section", { children: [
        /* @__PURE__ */ p("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ p("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((u) => /* @__PURE__ */ p(jv, { tree: u, onShow: r }, u.path)) }),
        c.length === 0 && /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ A("p", { style: { ...J, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ A("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ p("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((u) => u.severity === "low" || u.severity === "info").map((u) => /* @__PURE__ */ p(Fv, { row: u, canAsk: n, onAsk: o }, `${u.a}|${u.b}`))
      ] })
    ] })
  ] });
}
const Xv = "system-map-design", Rs = 12, Uv = 2e4, qv = 8e3, Kv = [
  ["names", "Names"],
  ["keys", "Keys"],
  ["columns", "Columns"]
], io = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, Zv = [
  ["map", "Map"],
  ["data", "Data model"],
  ["plan", "Plan"],
  ["risk", "Risk"],
  ["worktrees", "Worktrees"],
  ["findings", "Findings"],
  ["explore", "Explore"]
];
function Qv(e) {
  const t = $o(), [n, r] = re(null), [o, i] = re(null);
  le(() => {
    if (!e) return;
    let a = !0;
    return (async () => {
      const c = await t.post("/api/chat/slots", { name: Xv });
      await t.post(`/api/chat/slots/${encodeURIComponent(c.key)}/project`, { project: e }), a && r(c.key);
    })().catch((c) => {
      a && i(String(c));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const s = De(
    (a) => {
      n && t.post("/api/chat?ws=1", { message: a, slot: n, agent: "" });
    },
    [t, n]
  );
  return { slot: n, error: o, send: s };
}
function Jv() {
  const e = ie(null), [t, n] = re(void 0);
  return Ws(() => {
    const r = () => {
      var i;
      const o = ((i = e.current) == null ? void 0 : i.getBoundingClientRect().top) ?? 0;
      n(Math.max(420, window.innerHeight - o - 16));
    };
    return r(), window.addEventListener("resize", r), () => window.removeEventListener("resize", r);
  }, []), { ref: e, height: t };
}
function e_({ message: e, onBuilt: t }) {
  const n = $o(), [r, o] = re(""), [i, s] = re(!1), [a, l] = re(null), c = async () => {
    s(!0), l(null);
    try {
      const d = await n.post(`${Vt}/build`, { repo_path: r.trim() });
      t(d.repo_key);
    } catch (d) {
      l(String(d));
    } finally {
      s(!1);
    }
  };
  return /* @__PURE__ */ A(Rn, { children: [
    /* @__PURE__ */ p(so, { children: "Build a model" }),
    e && /* @__PURE__ */ p("p", { style: { ...J, fontSize: 13 }, children: e }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ p(
        Bs,
        {
          "aria-label": "Repo path",
          placeholder: "/path/to/repo",
          value: r,
          onChange: (d) => o(d.target.value),
          style: { flex: 1 }
        }
      ),
      /* @__PURE__ */ p(de, { primary: !0, disabled: i || !r.trim(), onClick: () => void c(), children: i ? "Building" : "Build" })
    ] }),
    a && /* @__PURE__ */ p("p", { style: { fontSize: 13 }, children: a })
  ] });
}
function t_({ overview: e }) {
  const { stale: t, map_stale: n, commits_behind: r, ref: o, changed_inputs: i = [] } = e.freshness;
  return t ? /* @__PURE__ */ A(me, { variant: "warn", children: [
    i.length,
    " schema files changed on ",
    o
  ] }) : n ? /* @__PURE__ */ A(me, { variant: "warn", children: [
    "Code changed on ",
    o,
    ". Rebuild to update."
  ] }) : r > 0 ? /* @__PURE__ */ A(me, { variant: "muted", children: [
    "Current, ",
    r,
    " commits behind ",
    o
  ] }) : /* @__PURE__ */ A(me, { variant: "ok", children: [
    "Current with ",
    o
  ] });
}
function f_() {
  var kn, En, Sn;
  const e = $o(), { repos: t, active: n, loaded: r, choose: o, reload: i } = id(), { overview: s, error: a, refresh: l } = sd(n), c = s == null ? void 0 : s.manifest.version, [d, f] = re(0), u = c ? `${c}:${d}` : void 0, h = Rt("/graph", n, u), g = Rt("/system", n, u), v = ((kn = Rt("/plan", n, u)) == null ? void 0 : kn.plans) ?? [], b = ((En = Rt("/findings", n, u)) == null ? void 0 : En.findings) ?? [], m = Rt("/risk", n, u), _ = ai("/worktrees", n, Uv), y = _.value, x = ai("/explore", n, qv), [E, S] = re("whatif"), [M, z] = re(null), [I, V] = re(0), T = ad(M, n, I), [B, D] = re(!1), [w, N] = re(null), [k, $] = re("map"), [L, C] = re(null), [O, P] = re(null), [W, j] = re(!0), [Y, q] = re(!1), [te, U] = re(!0), [R, F] = re(null), [K, Z] = re("names"), [X, Q] = re(!1), [ee, ne] = re(null), { ref: oe, height: ce } = Jv(), ue = Qv(s ? s.manifest.repo : null), Ee = k === "map" ? O && !/^(area|group):/.test(O) ? O : null : k === "data" ? L : null, be = B && (T != null && T.diff.added.some((H) => H.id === Ee)) ? null : Ee, ve = ld(be, n), tt = ae(() => {
    const H = /* @__PURE__ */ new Map();
    for (const fe of b)
      fe.severity !== "info" && H.set(fe.node, (H.get(fe.node) ?? 0) + 1);
    return H;
  }, [b]), Fe = ae(() => cd(y), [y]), Ye = v.filter((H) => H.status === "planned" || H.status === "partial").length, Se = ((y == null ? void 0 : y.counts.high) ?? 0) + ((y == null ? void 0 : y.counts.medium) ?? 0), Ae = (m == null ? void 0 : m.modules.filter((H) => H.hot && H.untested).length) ?? 0, ze = ((Sn = x.value) == null ? void 0 : Sn.proposals.filter((H) => H.status === "draft").length) ?? 0, je = { findings: b.length, plan: Ye, risk: Ae, worktrees: Se, explore: ze }, Ne = B ? T : null, kt = ae(() => g ? dd(g, Ne) : null, [g, Ne]), gn = ae(() => {
    const H = (Ne == null ? void 0 : Ne.graph) ?? h;
    return H && (w == null ? void 0 : w.level) === "data" ? ud(H, w.resolved) : H;
  }, [h, Ne, w]), Sr = async () => {
    ne("Checking");
    try {
      const H = await e.post(gd("/build", null), { repo: s == null ? void 0 : s.manifest.repo_key });
      ne(H.unchanged ? "No changes" : "Rebuilt"), await l();
    } catch (H) {
      ne(String(H));
    }
  }, Nr = () => {
    ve && ue.send(`Use the system-map tools. Look at ${ve.id} and tell me what to watch out for.`);
  }, mn = (H) => {
    ue.send(`Use the system-map tools. Check finding ${H.id} on ${H.node}, read its evidence, and propose a fix.`);
  }, Cr = (H) => {
    ue.send(`Use the system-map tools. Look at ${H.id}, say what is left to build, and propose the next step.`);
  }, Mr = (H) => {
    ue.send(`Use the system-map tools. Look at ${H} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, $r = (H) => {
    ue.send(`Use the system-map tools. Worktrees ${H.a} and ${H.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, Ir = () => {
    ue.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, Ar = async () => {
    F(null);
    try {
      await e.post(`${Vt}/coverage`, { repo: s == null ? void 0 : s.manifest.repo_key }), f((H) => H + 1);
    } catch (H) {
      F(String(H));
    }
  }, zr = (H) => {
    D(!0), N(null), P(null);
    const fe = [...(T == null ? void 0 : T.diff.added) ?? [], ...(T == null ? void 0 : T.diff.changed) ?? []].find((nt) => nt.id.startsWith("table:"));
    C(H === "data" ? (fe == null ? void 0 : fe.id) ?? null : null), $(H);
  }, Tr = async (H, fe) => {
    await e.post(`${Vt}/proposal-status`, { repo: s == null ? void 0 : s.manifest.repo_key, id: H, status: fe }), V((nt) => nt + 1), await x.refresh();
  }, Lr = async (H, fe) => {
    await e.post(`${Vt}/intent-delete`, { repo: s == null ? void 0 : s.manifest.repo_key, kind: H, id: fe }), H === "proposals" && (z(null), D(!1)), await x.refresh();
  }, Or = (H) => {
    N(H), q(H.overlays.risk), U(H.overlays.worktrees), j(H.overlays.plans), z(H.proposal), D(H.proposal !== null), P(null), C(null), $(H.level);
  }, yn = () => {
    D(!1), N(null), C(null), P(null);
  }, Pr = async (H, fe) => {
    await e.post(`${Vt}/plan-status`, { repo: s == null ? void 0 : s.manifest.repo_key, id: H, status: fe }), f((nt) => nt + 1);
  }, Dt = (H) => {
    $("data"), C(H);
  }, dt = (H) => {
    $("map"), P(H);
  }, Dr = (H) => {
    k === "data" && H.startsWith("table:") ? C(H) : dt(H);
  }, wn = (H) => {
    H.startsWith("table:") ? Dt(H) : dt(H);
  }, xn = (H) => {
    C(null), P(null), ne(null), z(null), yn(), o(H);
  }, Rr = /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
    ee && /* @__PURE__ */ p("span", { style: { ...J, fontSize: 13 }, children: ee }),
    t.length > 1 && /* @__PURE__ */ p(
      "select",
      {
        "aria-label": "Repo",
        value: (s == null ? void 0 : s.manifest.repo_key) ?? "",
        onChange: (H) => xn(H.target.value),
        style: { fontSize: 13, background: "transparent", color: "var(--text, inherit)" },
        children: t.map((H) => /* @__PURE__ */ p("option", { value: H.repo_key, children: H.repo.split("/").pop() }, H.repo_key))
      }
    ),
    /* @__PURE__ */ p(de, { onClick: () => Q((H) => !H), children: "Add repo" }),
    s && /* @__PURE__ */ p(de, { onClick: () => void Sr(), children: "Rebuild" })
  ] }), bn = r && t.length === 0, Hr = X || bn || !s && a !== null, vn = k === "map" || k === "plan", _n = (Ne == null ? void 0 : Ne.title) ?? (w == null ? void 0 : w.title);
  return /* @__PURE__ */ A(ke, { children: [
    /* @__PURE__ */ p(Uc, { title: "System Map", subtitle: s ? s.manifest.repo : "One model of your system", actions: Rr }),
    /* @__PURE__ */ A("div", { ref: oe, style: { height: ce, display: "flex", flexDirection: "column", gap: Rs, padding: "0 16px", minHeight: 0 }, children: [
      Hr && /* @__PURE__ */ p(
        e_,
        {
          message: s ? null : bn ? "Point System Map at a repo." : a,
          onBuilt: (H) => {
            Q(!1), xn(H), i();
          }
        }
      ),
      s && /* @__PURE__ */ A(ke, { children: [
        /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
          /* @__PURE__ */ p(t_, { overview: s }),
          /* @__PURE__ */ p(me, { variant: "muted", children: s.manifest.commit.slice(0, 7) }),
          _n && (k === "map" || k === "data") && /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
            /* @__PURE__ */ A(me, { variant: "aim", children: [
              "Showing: ",
              _n
            ] }),
            /* @__PURE__ */ p(de, { onClick: yn, children: "Back to today" })
          ] }),
          /* @__PURE__ */ p("span", { style: { flex: 1 } }),
          k === "data" && Kv.map(([H, fe]) => /* @__PURE__ */ p(de, { primary: K === H, onClick: () => Z(H), children: fe }, H)),
          k === "map" && /* @__PURE__ */ A(ke, { children: [
            /* @__PURE__ */ p(kv, { count: Ye, on: W, onToggle: () => j((H) => !H) }),
            /* @__PURE__ */ p(de, { primary: Y, onClick: () => q((H) => !H), title: "Mark hot and untested code on the map", children: "Risk on map" }),
            /* @__PURE__ */ p(de, { primary: te, onClick: () => U((H) => !H), title: "Show what each worktree is changing", children: "Worktrees on map" })
          ] }),
          /* @__PURE__ */ p("span", { style: { width: 8 } }),
          Zv.map(([H, fe]) => /* @__PURE__ */ p(de, { primary: k === H, onClick: () => $(H), children: je[H] === void 0 ? fe : `${fe} ${je[H]}` }, H))
        ] }),
        /* @__PURE__ */ A(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: Rs,
              gridTemplateColumns: "220px minmax(0, 1fr) minmax(320px, 26%)",
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ A(Rn, { style: io, children: [
                /* @__PURE__ */ p(so, { children: vn ? "Modules" : "Tables" }),
                vn ? /* @__PURE__ */ p(fd, { nodes: (g == null ? void 0 : g.nodes) ?? [], focus: O, onSelect: dt }) : /* @__PURE__ */ p(hd, { tables: s.tables, selected: L, flagged: tt, working: Fe, onSelect: Dt })
              ] }),
              /* @__PURE__ */ A(Rn, { style: { ...io, padding: 0, position: "relative" }, "data-testid": "canvas", children: [
                k === "map" && kt && /* @__PURE__ */ p(
                  Hv,
                  {
                    system: kt,
                    focus: O,
                    tables: s.manifest.counts.tables,
                    showPlans: W,
                    inspecting: be !== null,
                    risk: Y ? m : null,
                    worktrees: te ? y : null,
                    only: (w == null ? void 0 : w.level) === "map" ? w.resolved : null,
                    layout: (w == null ? void 0 : w.layout) ?? "left-right",
                    onFocus: (H) => {
                      N(null), P(H);
                    },
                    onOpenTables: () => $("data")
                  }
                ),
                k === "data" && gn && /* @__PURE__ */ p(qb, { graph: gn, selected: L, flagged: tt, working: Fe, density: K, onSelect: C }),
                k === "explore" && x.value && /* @__PURE__ */ p(
                  sv,
                  {
                    data: x.value,
                    proposal: T,
                    shownProposal: B ? M : null,
                    canAsk: ue.slot !== null,
                    tab: E,
                    onTab: S,
                    onSend: ue.send,
                    onOpenProposal: z,
                    onDrawProposal: zr,
                    onStatus: (H, fe) => void Tr(H, fe),
                    onDelete: (H, fe) => void Lr(H, fe),
                    onOpenView: Or,
                    onNode: wn
                  }
                ),
                k === "plan" && /* @__PURE__ */ p(_v, { plans: v, onShow: dt, onAsk: Cr, onStatus: (H, fe) => void Pr(H, fe) }),
                k === "risk" && m && /* @__PURE__ */ p(
                  $v,
                  {
                    risk: m,
                    canAsk: ue.slot !== null,
                    error: R,
                    onShow: dt,
                    onAsk: Mr,
                    onLoad: () => void Ar(),
                    onRun: Ir
                  }
                ),
                k === "worktrees" && y && /* @__PURE__ */ p(Gv, { state: y, checkedAt: _.checkedAt, canAsk: ue.slot !== null, onShow: wn, onAsk: $r }),
                k === "findings" && /* @__PURE__ */ p(lv, { findings: b, onShow: Dt, onAsk: mn }),
                ve && be && /* @__PURE__ */ p(
                  yv,
                  {
                    node: ve,
                    work: (y == null ? void 0 : y.by_node[be]) ?? [],
                    overlaps: pd(be, y),
                    canAsk: ue.slot !== null,
                    onAsk: Nr,
                    onAskFinding: mn,
                    onOpen: Dr,
                    onClose: () => k === "data" ? C(null) : P(null)
                  }
                )
              ] }),
              /* @__PURE__ */ A(Rn, { style: io, children: [
                /* @__PURE__ */ p(so, { children: "Design chat" }),
                ue.error && /* @__PURE__ */ A("p", { style: { fontSize: 13 }, children: [
                  "Chat is not available: ",
                  ue.error
                ] }),
                /* @__PURE__ */ p("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: ue.slot && /* @__PURE__ */ p("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ p(Xc, { slotKey: ue.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  f_ as default
};
