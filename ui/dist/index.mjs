var ad = Object.defineProperty;
var ld = (e, t, n) => t in e ? ad(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ge = (e, t, n) => ld(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as h, jsxs as A, Fragment as we } from "react/jsx-runtime";
import { useTheme as ya, useAppApi as wa, ChatEmbed as cd } from "@kirocrew/app-sdk";
import { Badge as xe, Btn as de, Input as dd, PageHeader as ii, ContentSkeleton as Do, EmptyState as ba, Card as mo, CardTitle as Pi, SegmentedControl as ud } from "@kirocrew/app-sdk/ui";
import si, { memo as pe, forwardRef as va, useState as re, createContext as Cr, useCallback as Le, useMemo as le, useContext as Vt, useRef as oe, useEffect as ce, useLayoutEffect as ai } from "react";
import { M as K, a as Fe, A as Ie, S as bn, s as vn, p as Mr, N as fd, D as xa, b as hd, r as pd, C as _a, c as gd, d as md, e as yd, f as wd, w as bd, t as vd, G as xd, g as _d, h as kd, i as Ed, u as Sd, j as Nd, k as Cd, l as Kt, m as Di, n as Md, o as Id, q as $d, v as Ad, x as Td, y as Ld, z as zd, B as Od, E as Pd, F as Dd, H as Rd, I as Hd, T as Bd, J as Wd, K as or, L as Zt, O as Vd, P as Fd, Q as jd } from "./chunks/ProjectMenu-DLd9vFcY.mjs";
import "react-dom";
function ka(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Yd = "\0", mt = "\0", Ri = "";
let Gd = class {
  constructor(t) {
    ge(this, "_isDirected", !0);
    ge(this, "_isMultigraph", !1);
    ge(this, "_isCompound", !1);
    // Label for the graph itself
    ge(this, "_label");
    // Defaults to be set when creating a new node
    ge(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    ge(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    ge(this, "_nodes", {});
    // v -> edgeObj
    ge(this, "_in", {});
    // u -> v -> Number
    ge(this, "_preds", {});
    // v -> edgeObj
    ge(this, "_out", {});
    // v -> w -> Number
    ge(this, "_sucs", {});
    // e -> edgeObj
    ge(this, "_edgeObjs", {});
    // e -> label
    ge(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    ge(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    ge(this, "_edgeCount", 0);
    ge(this, "_parent");
    ge(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[mt] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = mt, this._children[t] = {}, this._children[mt][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      n = mt;
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
      if (n !== mt)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = mt) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === mt)
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
    var a = en(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = Xd(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, Hi(this._preds[n], t), Hi(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? yo(this._isDirected, arguments[0]) : en(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? yo(this._isDirected, arguments[0]) : en(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? yo(this._isDirected, arguments[0]) : en(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], Bi(this._preds[n], t), Bi(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function Hi(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function Bi(e, t) {
  --e[t] || delete e[t];
}
function en(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + Ri + i + Ri + (r === void 0 ? Yd : r);
}
function Xd(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function yo(e, t) {
  return en(e, t.v, t.w, t.name);
}
var li = Gd, Ud = "2.2.4", qd = {
  Graph: li,
  version: Ud
}, Kd = li, Zd = {
  write: Qd,
  read: tu
};
function Qd(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: Jd(e),
    edges: eu(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function Jd(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function eu(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function tu(e) {
  var t = new Kd(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var nu = ru;
function ru(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let ou = class {
  constructor() {
    ge(this, "_arr", []);
    ge(this, "_keyIndices", {});
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
var Ea = ou, iu = Ea, Sa = au, su = () => 1;
function au(e, t, n, r) {
  return lu(
    e,
    String(t),
    n || su,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function lu(e, t, n, r) {
  var o = {}, i = new iu(), s, a, l = function(c) {
    var d = c.v !== s ? c.v : c.w, f = o[d], u = n(c), p = a.distance + u;
    if (u < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + u);
    p < f.distance && (f.distance = p, f.predecessor = s, i.decrease(d, p));
  };
  for (e.nodes().forEach(function(c) {
    var d = c === t ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: d }, i.add(c, d);
  }); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY); )
    r(s).forEach(l);
  return o;
}
var cu = Sa, du = uu;
function uu(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = cu(e, o, t, n), r;
  }, {});
}
var Na = fu;
function fu(e) {
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
var hu = Na, pu = gu;
function gu(e) {
  return hu(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var mu = wu, yu = () => 1;
function wu(e, t, n) {
  return bu(
    e,
    t || yu,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function bu(e, t, n) {
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
        var d = l[i], f = s[c], u = l[c], p = d.distance + f.distance;
        p < u.distance && (u.distance = p, u.predecessor = f.predecessor);
      });
    });
  }), r;
}
function Ca(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new Ro();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new Ro();
  return r;
}
class Ro extends Error {
  constructor() {
    super(...arguments);
  }
}
var Ma = Ca;
Ca.CycleException = Ro;
var Wi = Ma, vu = xu;
function xu(e) {
  try {
    Wi(e);
  } catch (t) {
    if (t instanceof Wi.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var Ia = _u;
function _u(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? ku : Eu, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function ku(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), $a(t(i[0]), (s) => o.push([s, !1])));
  }
}
function Eu(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), $a(t(i), (s) => o.push(s)));
  }
}
function $a(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var Su = Ia, Nu = Cu;
function Cu(e, t) {
  return Su(e, t, "post");
}
var Mu = Ia, Iu = $u;
function $u(e, t) {
  return Mu(e, t, "pre");
}
var Au = li, Tu = Ea, Lu = zu;
function zu(e, t) {
  var n = new Au(), r = {}, o = new Tu(), i;
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
var Ou = {
  components: nu,
  dijkstra: Sa,
  dijkstraAll: du,
  findCycles: pu,
  floydWarshall: mu,
  isAcyclic: vu,
  postorder: Nu,
  preorder: Iu,
  prim: Lu,
  tarjan: Na,
  topsort: Ma
}, Vi = qd, je = {
  Graph: Vi.Graph,
  json: Zd,
  alg: Ou,
  version: Vi.version
};
let Pu = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return Fi(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && Fi(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, Du)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function Fi(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function Du(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var Ru = Pu;
let Hu = je.Graph, Bu = Ru;
var Wu = Fu;
let Vu = () => 1;
function Fu(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = Yu(e, t || Vu);
  return ju(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function ju(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      wo(e, t, n, s);
    for (; s = o.dequeue(); )
      wo(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(wo(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function wo(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, Ho(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, Ho(t, n, c);
  }), e.removeNode(r.v), i;
}
function Yu(e, t) {
  let n = new Hu(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = Gu(o + r + 3).map(() => new Bu()), s = r + 1;
  return n.nodes().forEach((a) => {
    Ho(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function Ho(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function Gu(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let Aa = je.Graph;
var me = {
  addBorderNode: tf,
  addDummyNode: Ta,
  applyWithChunking: Ir,
  asNonCompoundGraph: Uu,
  buildLayerMatrix: Qu,
  intersectRect: Zu,
  mapValues: cf,
  maxRank: za,
  normalizeRanks: Ju,
  notime: sf,
  partition: rf,
  pick: lf,
  predecessorWeights: Ku,
  range: Pa,
  removeEmptyRanks: ef,
  simplify: Xu,
  successorWeights: qu,
  time: of,
  uniqueId: Oa,
  zipObject: ci
};
function Ta(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = Oa(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function Xu(e) {
  let t = new Aa().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function Uu(e) {
  let t = new Aa({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function qu(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return ci(e.nodes(), t);
}
function Ku(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return ci(e.nodes(), t);
}
function Zu(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function Qu(e) {
  let t = Pa(za(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function Ju(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Ir(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function ef(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Ir(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function tf(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), Ta(e, "border", o, t);
}
function nf(e, t = La) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const La = 65535;
function Ir(e, t) {
  if (t.length > La) {
    const n = nf(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function za(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Ir(Math.max, n);
}
function rf(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function of(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function sf(e, t) {
  return t();
}
let af = 0;
function Oa(e) {
  var t = ++af;
  return e + ("" + t);
}
function Pa(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function lf(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function cf(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function ci(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let df = Wu, uf = me.uniqueId;
var ff = {
  run: hf,
  undo: gf
};
function hf(e) {
  (e.graph().acyclicer === "greedy" ? df(e, n(e)) : pf(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, uf("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function pf(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function gf(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let mf = me;
var yf = {
  run: wf,
  undo: vf
};
function wf(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => bf(e, t));
}
function bf(e, t) {
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
    }, c = mf.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function vf(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: xf } = me;
var $r = {
  longestPath: _f,
  slack: kf
};
function _f(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = xf(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function kf(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Ef = je.Graph, fr = $r.slack, Da = Sf;
function Sf(e) {
  var t = new Ef({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; Nf(t, e) < r; )
    o = Cf(t, e), i = t.hasNode(o.v) ? fr(e, o) : -fr(e, o), Mf(t, e, i);
  return t;
}
function Nf(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !fr(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Cf(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = fr(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Mf(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var If = Da, ji = $r.slack, $f = $r.longestPath, Af = je.alg.preorder, Tf = je.alg.postorder, Lf = me.simplify, zf = Ct;
Ct.initLowLimValues = ui;
Ct.initCutValues = di;
Ct.calcCutValue = Ra;
Ct.leaveEdge = Ba;
Ct.enterEdge = Wa;
Ct.exchangeEdges = Va;
function Ct(e) {
  e = Lf(e), $f(e);
  var t = If(e);
  ui(t), di(t, e);
  for (var n, r; n = Ba(t); )
    r = Wa(t, e, n), Va(t, e, n, r);
}
function di(e, t) {
  var n = Tf(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => Of(e, t, r));
}
function Of(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = Ra(e, t, n);
}
function Ra(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var f = c === i, u = t.edge(l).weight;
      if (a += f ? u : -u, Df(e, n, d)) {
        var p = e.edge(n, d).cutvalue;
        a += f ? -p : p;
      }
    }
  }), a;
}
function ui(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), Ha(e, {}, 1, t);
}
function Ha(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = Ha(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function Ba(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function Wa(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === Yi(e, e.node(d.v), a) && l !== Yi(e, e.node(d.w), a));
  return c.reduce((d, f) => ji(t, f) < ji(t, d) ? f : d);
}
function Va(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), ui(e), di(e, t), Pf(e, t);
}
function Pf(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = Af(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function Df(e, t, n) {
  return e.hasEdge(t, n);
}
function Yi(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var Rf = $r, Fa = Rf.longestPath, Hf = Da, Bf = zf, Wf = Vf;
function Vf(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      Gi(e);
      break;
    case "tight-tree":
      jf(e);
      break;
    case "longest-path":
      Ff(e);
      break;
    case "none":
      break;
    default:
      Gi(e);
  }
}
var Ff = Fa;
function jf(e) {
  Fa(e), Hf(e);
}
function Gi(e) {
  Bf(e);
}
var Yf = Gf;
function Gf(e) {
  let t = Uf(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = Xf(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
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
function Xf(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function Uf(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let hr = me;
var qf = {
  run: Kf,
  cleanup: Jf
};
function Kf(e) {
  let t = hr.addDummyNode(e, "root", {}, "_root"), n = Zf(e), r = Object.values(n), o = hr.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = Qf(e) + 1;
  e.children().forEach((a) => ja(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function ja(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = hr.addBorderNode(e, "_bt"), c = hr.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((f) => {
    ja(e, t, n, r, o, i, f);
    let u = e.node(f), p = u.borderTop ? u.borderTop : f, g = u.borderBottom ? u.borderBottom : f, b = u.borderTop ? r : 2 * r, v = p !== g ? 1 : o - i[s] + 1;
    e.setEdge(l, p, {
      weight: b,
      minlen: v,
      nestingEdge: !0
    }), e.setEdge(g, c, {
      weight: b,
      minlen: v,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function Zf(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function Qf(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function Jf(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let eh = me;
var th = nh;
function nh(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        Xi(e, "borderLeft", "_bl", n, o, i), Xi(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function Xi(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = eh.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var rh = {
  adjust: oh,
  undo: ih
};
function oh(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && Ya(e);
}
function ih(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && sh(e), (t === "lr" || t === "rl") && (ah(e), Ya(e));
}
function Ya(e) {
  e.nodes().forEach((t) => Ui(e.node(t))), e.edges().forEach((t) => Ui(e.edge(t)));
}
function Ui(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function sh(e) {
  e.nodes().forEach((t) => bo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(bo), Object.hasOwn(n, "y") && bo(n);
  });
}
function bo(e) {
  e.y = -e.y;
}
function ah(e) {
  e.nodes().forEach((t) => vo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(vo), Object.hasOwn(n, "x") && vo(n);
  });
}
function vo(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let qi = me;
var lh = ch;
function ch(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = qi.applyWithChunking(Math.max, r), i = qi.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let dh = me.zipObject;
var uh = fh;
function fh(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += hh(e, t[r - 1], t[r]);
  return n;
}
function hh(e, t, n) {
  let r = dh(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, f) => d.pos - f.pos)), i = 1;
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
var ph = gh;
function gh(e, t = []) {
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
let mh = me;
var yh = wh;
function wh(e, t) {
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
  return bh(r);
}
function bh(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && vh(o, i);
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
  return t.filter((o) => !o.merged).map((o) => mh.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function vh(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let xh = me;
var _h = kh;
function kh(e, t) {
  let n = xh.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, f) => f.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(Eh(!!t)), l = Ki(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = Ki(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function Ki(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function Eh(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Sh = ph, Nh = yh, Ch = _h;
var Mh = Ga;
function Ga(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((u) => u !== s && u !== a));
  let c = Sh(e, o);
  c.forEach((u) => {
    if (e.children(u.v).length) {
      let p = Ga(e, u.v, n, r);
      l[u.v] = p, Object.hasOwn(p, "barycenter") && $h(u, p);
    }
  });
  let d = Nh(c, n);
  Ih(d, l);
  let f = Ch(d, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let u = e.node(e.predecessors(s)[0]), p = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + u.order + p.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function Ih(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function $h(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let Ah = je.Graph, Th = me;
var Lh = zh;
function zh(e, t, n, r) {
  r || (r = e.nodes());
  let o = Oh(e), i = new Ah({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
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
function Oh(e) {
  for (var t; e.hasNode(t = Th.uniqueId("_root")); ) ;
  return t;
}
var Ph = Dh;
function Dh(e, t, n) {
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
let Rh = lh, Hh = uh, Bh = Mh, Wh = Lh, Vh = Ph, Fh = je.Graph, Gn = me;
var jh = Xa;
function Xa(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, Xa);
    return;
  }
  let n = Gn.maxRank(e), r = Zi(e, Gn.range(1, n + 1), "inEdges"), o = Zi(e, Gn.range(n - 1, -1, -1), "outEdges"), i = Rh(e);
  if (Qi(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    Yh(l % 2 ? r : o, l % 4 >= 2), i = Gn.buildLayerMatrix(e);
    let d = Hh(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  Qi(e, a);
}
function Zi(e, t, n) {
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
    return Wh(e, i, n, r.get(i) || []);
  });
}
function Yh(e, t) {
  let n = new Fh();
  e.forEach(function(r) {
    let o = r.graph().root, i = Bh(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), Vh(r, n, i.vs);
  });
}
function Qi(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let Gh = je.Graph, nt = me;
var Xh = {
  positionX: op
};
function Uh(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, f) => {
      let u = Kh(e, d), p = u ? e.node(u).order : l;
      (u || d === c) && (i.slice(a, f + 1).forEach((g) => {
        e.predecessors(g).forEach((b) => {
          let v = e.node(b), y = v.order;
          (y < s || p < y) && !(v.dummy && e.node(g).dummy) && Ua(n, b, g);
        });
      }), a = f + 1, s = p);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function qh(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    nt.range(s, a).forEach((f) => {
      d = i[f], e.node(d).dummy && e.predecessors(d).forEach((u) => {
        let p = e.node(u);
        p.dummy && (p.order < l || p.order > c) && Ua(n, u, d);
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
function Kh(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function Ua(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function Zh(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function Qh(e, t, n, r) {
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
        d = d.sort((u, p) => s[u] - s[p]);
        let f = (d.length - 1) / 2;
        for (let u = Math.floor(f), p = Math.ceil(f); u <= p; ++u) {
          let g = d[u];
          i[c] === c && l < s[g] && !Zh(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function Jh(e, t, n, r, o) {
  let i = {}, s = ep(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, u) {
    let p = s.nodes(), g = p.pop(), b = {};
    for (; g; )
      b[g] ? f(g) : (b[g] = !0, p.push(g), p = p.concat(u(g))), g = p.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((u, p) => Math.max(u, i[p.v] + s.edge(p)), 0);
  }
  function d(f) {
    let u = s.outEdges(f).reduce((g, b) => Math.min(g, i[b.w] - s.edge(b)), Number.POSITIVE_INFINITY), p = e.node(f);
    u !== Number.POSITIVE_INFINITY && p.borderType !== a && (i[f] = Math.max(i[f], u));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function ep(e, t, n, r) {
  let o = new Gh(), i = e.graph(), s = ip(i.nodesep, i.edgesep, r);
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
function tp(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = sp(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function np(e, t) {
  let n = Object.values(t), r = nt.applyWithChunking(Math.min, n), o = nt.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), d = r - nt.applyWithChunking(Math.min, c);
      s !== "l" && (d = o - nt.applyWithChunking(Math.max, c)), d && (e[a] = nt.mapValues(l, (f) => f + d));
    });
  });
}
function rp(e, t) {
  return nt.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function op(e) {
  let t = nt.buildLayerMatrix(e), n = Object.assign(
    Uh(e, t),
    qh(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = Qh(e, o, n, l), d = Jh(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = nt.mapValues(d, (f) => -f)), r[s + a] = d;
    });
  });
  let i = tp(e, r);
  return np(r, i), rp(r, e.graph().align);
}
function ip(e, t, n) {
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
function sp(e, t) {
  return e.node(t).width;
}
let qa = me, ap = Xh.positionX;
var lp = cp;
function cp(e) {
  e = qa.asNonCompoundGraph(e), dp(e), Object.entries(ap(e)).forEach(([t, n]) => e.node(t).x = n);
}
function dp(e) {
  let t = qa.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let Ji = ff, es = yf, up = Wf, fp = me.normalizeRanks, hp = Yf, pp = me.removeEmptyRanks, ts = qf, gp = th, ns = rh, mp = jh, yp = lp, ze = me, wp = je.Graph;
var bp = vp;
function vp(e, t) {
  let n = t && t.debugTiming ? ze.time : ze.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => $p(e));
    n("  runLayout", () => xp(r, n, t)), n("  updateInputGraph", () => _p(e, r));
  });
}
function xp(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => Ap(e)), t("    removeSelfEdges", () => Bp(e)), t("    acyclic", () => Ji.run(e)), t("    nestingGraph.run", () => ts.run(e)), t("    rank", () => up(ze.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Tp(e)), t("    removeEmptyRanks", () => pp(e)), t("    nestingGraph.cleanup", () => ts.cleanup(e)), t("    normalizeRanks", () => fp(e)), t("    assignRankMinMax", () => Lp(e)), t("    removeEdgeLabelProxies", () => zp(e)), t("    normalize.run", () => es.run(e)), t("    parentDummyChains", () => hp(e)), t("    addBorderSegments", () => gp(e)), t("    order", () => mp(e, n)), t("    insertSelfEdges", () => Wp(e)), t("    adjustCoordinateSystem", () => ns.adjust(e)), t("    position", () => yp(e)), t("    positionSelfEdges", () => Vp(e)), t("    removeBorderNodes", () => Hp(e)), t("    normalize.undo", () => es.undo(e)), t("    fixupEdgeLabelCoords", () => Dp(e)), t("    undoCoordinateSystem", () => ns.undo(e)), t("    translateGraph", () => Op(e)), t("    assignNodeIntersects", () => Pp(e)), t("    reversePoints", () => Rp(e)), t("    acyclic.undo", () => Ji.undo(e));
}
function _p(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let kp = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], Ep = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Sp = ["acyclicer", "ranker", "rankdir", "align"], Np = ["width", "height", "rank"], rs = { width: 0, height: 0 }, Cp = ["minlen", "weight", "width", "height", "labeloffset"], Mp = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Ip = ["labelpos"];
function $p(e) {
  let t = new wp({ multigraph: !0, compound: !0 }), n = _o(e.graph());
  return t.setGraph(Object.assign(
    {},
    Ep,
    xo(n, kp),
    ze.pick(n, Sp)
  )), e.nodes().forEach((r) => {
    let o = _o(e.node(r));
    const i = xo(o, Np);
    Object.keys(rs).forEach((s) => {
      i[s] === void 0 && (i[s] = rs[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = _o(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Mp,
      xo(o, Cp),
      ze.pick(o, Ip)
    ));
  }), t;
}
function Ap(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Tp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      ze.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Lp(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function zp(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Op(e) {
  let t = Number.POSITIVE_INFINITY, n = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function l(c) {
    let d = c.x, f = c.y, u = c.width, p = c.height;
    t = Math.min(t, d - u / 2), n = Math.max(n, d + u / 2), r = Math.min(r, f - p / 2), o = Math.max(o, f + p / 2);
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
function Pp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(ze.intersectRect(r, i)), n.points.push(ze.intersectRect(o, s));
  });
}
function Dp(e) {
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
function Rp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function Hp(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Bp(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function Wp(e) {
  var t = ze.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        ze.addDummyNode(e, "selfedge", {
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
function Vp(e) {
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
function xo(e, t) {
  return ze.mapValues(ze.pick(e, t), Number);
}
function _o(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let Fp = me, jp = je.Graph;
var Yp = {
  debugOrdering: Gp
};
function Gp(e) {
  let t = Fp.buildLayerMatrix(e), n = new jp({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var Xp = "1.1.8", Up = {
  graphlib: je,
  layout: bp,
  debug: Yp,
  util: {
    time: me.time,
    notime: me.notime
  },
  version: Xp
};
const pr = /* @__PURE__ */ ka(Up);
function ye(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = ye(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var qp = { value: () => {
} };
function Ar() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new ir(n);
}
function ir(e) {
  this._ = e;
}
function Kp(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
ir.prototype = Ar.prototype = {
  constructor: ir,
  on: function(e, t) {
    var n = this._, r = Kp(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = Zp(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = os(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = os(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new ir(e);
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
function Zp(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function os(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = qp, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Bo = "http://www.w3.org/1999/xhtml";
const is = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Bo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Tr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), is.hasOwnProperty(t) ? { space: is[t], local: e } : e;
}
function Qp(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Bo && t.documentElement.namespaceURI === Bo ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Jp(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Ka(e) {
  var t = Tr(e);
  return (t.local ? Jp : Qp)(t);
}
function eg() {
}
function fi(e) {
  return e == null ? eg : function() {
    return this.querySelector(e);
  };
}
function tg(e) {
  typeof e != "function" && (e = fi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new $e(r, this._parents);
}
function ng(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function rg() {
  return [];
}
function Za(e) {
  return e == null ? rg : function() {
    return this.querySelectorAll(e);
  };
}
function og(e) {
  return function() {
    return ng(e.apply(this, arguments));
  };
}
function ig(e) {
  typeof e == "function" ? e = og(e) : e = Za(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new $e(r, o);
}
function Qa(e) {
  return function() {
    return this.matches(e);
  };
}
function Ja(e) {
  return function(t) {
    return t.matches(e);
  };
}
var sg = Array.prototype.find;
function ag(e) {
  return function() {
    return sg.call(this.children, e);
  };
}
function lg() {
  return this.firstElementChild;
}
function cg(e) {
  return this.select(e == null ? lg : ag(typeof e == "function" ? e : Ja(e)));
}
var dg = Array.prototype.filter;
function ug() {
  return Array.from(this.children);
}
function fg(e) {
  return function() {
    return dg.call(this.children, e);
  };
}
function hg(e) {
  return this.selectAll(e == null ? ug : fg(typeof e == "function" ? e : Ja(e)));
}
function pg(e) {
  typeof e != "function" && (e = Qa(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new $e(r, this._parents);
}
function el(e) {
  return new Array(e.length);
}
function gg() {
  return new $e(this._enter || this._groups.map(el), this._parents);
}
function gr(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
gr.prototype = {
  constructor: gr,
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
function mg(e) {
  return function() {
    return e;
  };
}
function yg(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new gr(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function wg(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, f = i.length, u = new Array(d), p;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (u[a] = p = s.call(l, l.__data__, a, t) + "", c.has(p) ? o[a] = l : c.set(p, l));
  for (a = 0; a < f; ++a)
    p = s.call(e, i[a], a, i) + "", (l = c.get(p)) ? (r[a] = l, l.__data__ = i[a], c.delete(p)) : n[a] = new gr(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(u[a]) === l && (o[a] = l);
}
function bg(e) {
  return e.__data__;
}
function vg(e, t) {
  if (!arguments.length) return Array.from(this, bg);
  var n = t ? wg : yg, r = this._parents, o = this._groups;
  typeof e != "function" && (e = mg(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], f = o[c], u = f.length, p = xg(e.call(d, d && d.__data__, c, r)), g = p.length, b = a[c] = new Array(g), v = s[c] = new Array(g), y = l[c] = new Array(u);
    n(d, f, b, v, y, p, t);
    for (var _ = 0, m = 0, w, S; _ < g; ++_)
      if (w = b[_]) {
        for (_ >= m && (m = _ + 1); !(S = v[m]) && ++m < g; ) ;
        w._next = S || null;
      }
  }
  return s = new $e(s, r), s._enter = a, s._exit = l, s;
}
function xg(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function _g() {
  return new $e(this._exit || this._groups.map(el), this._parents);
}
function kg(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function Eg(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], f = c.length, u = a[l] = new Array(f), p, g = 0; g < f; ++g)
      (p = c[g] || d[g]) && (u[g] = p);
  for (; l < o; ++l)
    a[l] = n[l];
  return new $e(a, this._parents);
}
function Sg() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function Ng(e) {
  e || (e = Cg);
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
function Cg(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Mg() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Ig() {
  return Array.from(this);
}
function $g() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function Ag() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Tg() {
  return !this.node();
}
function Lg(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function zg(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Og(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Pg(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Dg(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Rg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Hg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Bg(e, t) {
  var n = Tr(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Og : zg : typeof t == "function" ? n.local ? Hg : Rg : n.local ? Dg : Pg)(n, t));
}
function tl(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Wg(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Vg(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Fg(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function jg(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Wg : typeof t == "function" ? Fg : Vg)(e, t, n ?? "")) : zt(this.node(), e);
}
function zt(e, t) {
  return e.style.getPropertyValue(t) || tl(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Yg(e) {
  return function() {
    delete this[e];
  };
}
function Gg(e, t) {
  return function() {
    this[e] = t;
  };
}
function Xg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Ug(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Yg : typeof t == "function" ? Xg : Gg)(e, t)) : this.node()[e];
}
function nl(e) {
  return e.trim().split(/^|\s+/);
}
function hi(e) {
  return e.classList || new rl(e);
}
function rl(e) {
  this._node = e, this._names = nl(e.getAttribute("class") || "");
}
rl.prototype = {
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
function ol(e, t) {
  for (var n = hi(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function il(e, t) {
  for (var n = hi(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function qg(e) {
  return function() {
    ol(this, e);
  };
}
function Kg(e) {
  return function() {
    il(this, e);
  };
}
function Zg(e, t) {
  return function() {
    (t.apply(this, arguments) ? ol : il)(this, e);
  };
}
function Qg(e, t) {
  var n = nl(e + "");
  if (arguments.length < 2) {
    for (var r = hi(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Zg : t ? qg : Kg)(n, t));
}
function Jg() {
  this.textContent = "";
}
function em(e) {
  return function() {
    this.textContent = e;
  };
}
function tm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function nm(e) {
  return arguments.length ? this.each(e == null ? Jg : (typeof e == "function" ? tm : em)(e)) : this.node().textContent;
}
function rm() {
  this.innerHTML = "";
}
function om(e) {
  return function() {
    this.innerHTML = e;
  };
}
function im(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function sm(e) {
  return arguments.length ? this.each(e == null ? rm : (typeof e == "function" ? im : om)(e)) : this.node().innerHTML;
}
function am() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function lm() {
  return this.each(am);
}
function cm() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function dm() {
  return this.each(cm);
}
function um(e) {
  var t = typeof e == "function" ? e : Ka(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function fm() {
  return null;
}
function hm(e, t) {
  var n = typeof e == "function" ? e : Ka(e), r = t == null ? fm : typeof t == "function" ? t : fi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function pm() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function gm() {
  return this.each(pm);
}
function mm() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function ym() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function wm(e) {
  return this.select(e ? ym : mm);
}
function bm(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function vm(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function xm(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function _m(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function km(e, t, n) {
  return function() {
    var r = this.__on, o, i = vm(t);
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
function Em(e, t, n) {
  var r = xm(e + ""), o, i = r.length, s;
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
  for (a = t ? km : _m, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function sl(e, t, n) {
  var r = tl(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Sm(e, t) {
  return function() {
    return sl(this, e, t);
  };
}
function Nm(e, t) {
  return function() {
    return sl(this, e, t.apply(this, arguments));
  };
}
function Cm(e, t) {
  return this.each((typeof t == "function" ? Nm : Sm)(e, t));
}
function* Mm() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var al = [null];
function $e(e, t) {
  this._groups = e, this._parents = t;
}
function xn() {
  return new $e([[document.documentElement]], al);
}
function Im() {
  return this;
}
$e.prototype = xn.prototype = {
  constructor: $e,
  select: tg,
  selectAll: ig,
  selectChild: cg,
  selectChildren: hg,
  filter: pg,
  data: vg,
  enter: gg,
  exit: _g,
  join: kg,
  merge: Eg,
  selection: Im,
  order: Sg,
  sort: Ng,
  call: Mg,
  nodes: Ig,
  node: $g,
  size: Ag,
  empty: Tg,
  each: Lg,
  attr: Bg,
  style: jg,
  property: Ug,
  classed: Qg,
  text: nm,
  html: sm,
  raise: lm,
  lower: dm,
  append: um,
  insert: hm,
  remove: gm,
  clone: wm,
  datum: bm,
  on: Em,
  dispatch: Cm,
  [Symbol.iterator]: Mm
};
function Me(e) {
  return typeof e == "string" ? new $e([[document.querySelector(e)]], [document.documentElement]) : new $e([[e]], al);
}
function $m(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Re(e, t) {
  if (e = $m(e), t === void 0 && (t = e.currentTarget), t) {
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
const Am = { passive: !1 }, an = { capture: !0, passive: !1 };
function ko(e) {
  e.stopImmediatePropagation();
}
function Tt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function ll(e) {
  var t = e.document.documentElement, n = Me(e).on("dragstart.drag", Tt, an);
  "onselectstart" in t ? n.on("selectstart.drag", Tt, an) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function cl(e, t) {
  var n = e.document.documentElement, r = Me(e).on("dragstart.drag", null);
  t && (r.on("click.drag", Tt, an), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Xn = (e) => () => e;
function Wo(e, {
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
Wo.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Tm(e) {
  return !e.ctrlKey && !e.button;
}
function Lm() {
  return this.parentNode;
}
function zm(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Om() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function dl() {
  var e = Tm, t = Lm, n = zm, r = Om, o = {}, i = Ar("start", "drag", "end"), s = 0, a, l, c, d, f = 0;
  function u(w) {
    w.on("mousedown.drag", p).filter(r).on("touchstart.drag", v).on("touchmove.drag", y, Am).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(w, S) {
    if (!(d || !e.call(this, w, S))) {
      var k = m(this, t.call(this, w, S), w, S, "mouse");
      k && (Me(w.view).on("mousemove.drag", g, an).on("mouseup.drag", b, an), ll(w.view), ko(w), c = !1, a = w.clientX, l = w.clientY, k("start", w));
    }
  }
  function g(w) {
    if (Tt(w), !c) {
      var S = w.clientX - a, k = w.clientY - l;
      c = S * S + k * k > f;
    }
    o.mouse("drag", w);
  }
  function b(w) {
    Me(w.view).on("mousemove.drag mouseup.drag", null), cl(w.view, c), Tt(w), o.mouse("end", w);
  }
  function v(w, S) {
    if (e.call(this, w, S)) {
      var k = w.changedTouches, E = t.call(this, w, S), L = k.length, $, B;
      for ($ = 0; $ < L; ++$)
        (B = m(this, E, w, S, k[$].identifier, k[$])) && (ko(w), B("start", w, k[$]));
    }
  }
  function y(w) {
    var S = w.changedTouches, k = S.length, E, L;
    for (E = 0; E < k; ++E)
      (L = o[S[E].identifier]) && (Tt(w), L("drag", w, S[E]));
  }
  function _(w) {
    var S = w.changedTouches, k = S.length, E, L;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), E = 0; E < k; ++E)
      (L = o[S[E].identifier]) && (ko(w), L("end", w, S[E]));
  }
  function m(w, S, k, E, L, $) {
    var B = i.copy(), O = Re($ || k, S), W, H, x;
    if ((x = n.call(w, new Wo("beforestart", {
      sourceEvent: k,
      target: u,
      identifier: L,
      active: s,
      x: O[0],
      y: O[1],
      dx: 0,
      dy: 0,
      dispatch: B
    }), E)) != null)
      return W = x.x - O[0] || 0, H = x.y - O[1] || 0, function C(N, I, z) {
        var M = O, T;
        switch (N) {
          case "start":
            o[L] = C, T = s++;
            break;
          case "end":
            delete o[L], --s;
          case "drag":
            O = Re(z || I, S), T = s;
            break;
        }
        B.call(
          N,
          w,
          new Wo(N, {
            sourceEvent: I,
            subject: x,
            target: u,
            identifier: L,
            active: T,
            x: O[0] + W,
            y: O[1] + H,
            dx: O[0] - M[0],
            dy: O[1] - M[1],
            dispatch: B
          }),
          E
        );
      };
  }
  return u.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : Xn(!!w), u) : e;
  }, u.container = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : Xn(w), u) : t;
  }, u.subject = function(w) {
    return arguments.length ? (n = typeof w == "function" ? w : Xn(w), u) : n;
  }, u.touchable = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : Xn(!!w), u) : r;
  }, u.on = function() {
    var w = i.on.apply(i, arguments);
    return w === i ? u : w;
  }, u.clickDistance = function(w) {
    return arguments.length ? (f = (w = +w) * w, u) : Math.sqrt(f);
  }, u;
}
function pi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ul(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function _n() {
}
var ln = 0.7, mr = 1 / ln, Lt = "\\s*([+-]?\\d+)\\s*", cn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", qe = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Pm = /^#([0-9a-f]{3,8})$/, Dm = new RegExp(`^rgb\\(${Lt},${Lt},${Lt}\\)$`), Rm = new RegExp(`^rgb\\(${qe},${qe},${qe}\\)$`), Hm = new RegExp(`^rgba\\(${Lt},${Lt},${Lt},${cn}\\)$`), Bm = new RegExp(`^rgba\\(${qe},${qe},${qe},${cn}\\)$`), Wm = new RegExp(`^hsl\\(${cn},${qe},${qe}\\)$`), Vm = new RegExp(`^hsla\\(${cn},${qe},${qe},${cn}\\)$`), ss = {
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
pi(_n, xt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: as,
  // Deprecated! Use color.formatHex.
  formatHex: as,
  formatHex8: Fm,
  formatHsl: jm,
  formatRgb: ls,
  toString: ls
});
function as() {
  return this.rgb().formatHex();
}
function Fm() {
  return this.rgb().formatHex8();
}
function jm() {
  return fl(this).formatHsl();
}
function ls() {
  return this.rgb().formatRgb();
}
function xt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Pm.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? cs(t) : n === 3 ? new Ee(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Un(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Un(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Dm.exec(e)) ? new Ee(t[1], t[2], t[3], 1) : (t = Rm.exec(e)) ? new Ee(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Hm.exec(e)) ? Un(t[1], t[2], t[3], t[4]) : (t = Bm.exec(e)) ? Un(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Wm.exec(e)) ? fs(t[1], t[2] / 100, t[3] / 100, 1) : (t = Vm.exec(e)) ? fs(t[1], t[2] / 100, t[3] / 100, t[4]) : ss.hasOwnProperty(e) ? cs(ss[e]) : e === "transparent" ? new Ee(NaN, NaN, NaN, 0) : null;
}
function cs(e) {
  return new Ee(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Un(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ee(e, t, n, r);
}
function Ym(e) {
  return e instanceof _n || (e = xt(e)), e ? (e = e.rgb(), new Ee(e.r, e.g, e.b, e.opacity)) : new Ee();
}
function Vo(e, t, n, r) {
  return arguments.length === 1 ? Ym(e) : new Ee(e, t, n, r ?? 1);
}
function Ee(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
pi(Ee, Vo, ul(_n, {
  brighter(e) {
    return e = e == null ? mr : Math.pow(mr, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ln : Math.pow(ln, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ee(bt(this.r), bt(this.g), bt(this.b), yr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ds,
  // Deprecated! Use color.formatHex.
  formatHex: ds,
  formatHex8: Gm,
  formatRgb: us,
  toString: us
}));
function ds() {
  return `#${wt(this.r)}${wt(this.g)}${wt(this.b)}`;
}
function Gm() {
  return `#${wt(this.r)}${wt(this.g)}${wt(this.b)}${wt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function us() {
  const e = yr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${bt(this.r)}, ${bt(this.g)}, ${bt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function yr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function bt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function wt(e) {
  return e = bt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function fs(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new He(e, t, n, r);
}
function fl(e) {
  if (e instanceof He) return new He(e.h, e.s, e.l, e.opacity);
  if (e instanceof _n || (e = xt(e)), !e) return new He();
  if (e instanceof He) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new He(s, a, l, e.opacity);
}
function Xm(e, t, n, r) {
  return arguments.length === 1 ? fl(e) : new He(e, t, n, r ?? 1);
}
function He(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
pi(He, Xm, ul(_n, {
  brighter(e) {
    return e = e == null ? mr : Math.pow(mr, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ln : Math.pow(ln, e), new He(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new Ee(
      Eo(e >= 240 ? e - 240 : e + 120, o, r),
      Eo(e, o, r),
      Eo(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new He(hs(this.h), qn(this.s), qn(this.l), yr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = yr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${hs(this.h)}, ${qn(this.s) * 100}%, ${qn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function hs(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function qn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Eo(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const gi = (e) => () => e;
function Um(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function qm(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Km(e) {
  return (e = +e) == 1 ? hl : function(t, n) {
    return n - t ? qm(t, n, e) : gi(isNaN(t) ? n : t);
  };
}
function hl(e, t) {
  var n = t - e;
  return n ? Um(e, n) : gi(isNaN(e) ? t : e);
}
const wr = function e(t) {
  var n = Km(t);
  function r(o, i) {
    var s = n((o = Vo(o)).r, (i = Vo(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = hl(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Zm(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function Qm(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Jm(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = rn(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function e0(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Xe(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function t0(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = rn(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var Fo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, So = new RegExp(Fo.source, "g");
function n0(e) {
  return function() {
    return e;
  };
}
function r0(e) {
  return function(t) {
    return e(t) + "";
  };
}
function pl(e, t) {
  var n = Fo.lastIndex = So.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = Fo.exec(e)) && (o = So.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Xe(r, o) })), n = So.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? r0(l[0].x) : n0(t) : (t = l.length, function(c) {
    for (var d = 0, f; d < t; ++d) a[(f = l[d]).i] = f.x(c);
    return a.join("");
  });
}
function rn(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? gi(t) : (n === "number" ? Xe : n === "string" ? (r = xt(t)) ? (t = r, wr) : pl : t instanceof xt ? wr : t instanceof Date ? e0 : Qm(t) ? Zm : Array.isArray(t) ? Jm : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? t0 : Xe)(e, t);
}
var ps = 180 / Math.PI, jo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function gl(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * ps,
    skewX: Math.atan(l) * ps,
    scaleX: s,
    scaleY: a
  };
}
var Kn;
function o0(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? jo : gl(t.a, t.b, t.c, t.d, t.e, t.f);
}
function i0(e) {
  return e == null || (Kn || (Kn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Kn.setAttribute("transform", e), !(e = Kn.transform.baseVal.consolidate())) ? jo : (e = e.matrix, gl(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ml(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, f, u, p, g) {
    if (c !== f || d !== u) {
      var b = p.push("translate(", null, t, null, n);
      g.push({ i: b - 4, x: Xe(c, f) }, { i: b - 2, x: Xe(d, u) });
    } else (f || u) && p.push("translate(" + f + t + u + n);
  }
  function s(c, d, f, u) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), u.push({ i: f.push(o(f) + "rotate(", null, r) - 2, x: Xe(c, d) })) : d && f.push(o(f) + "rotate(" + d + r);
  }
  function a(c, d, f, u) {
    c !== d ? u.push({ i: f.push(o(f) + "skewX(", null, r) - 2, x: Xe(c, d) }) : d && f.push(o(f) + "skewX(" + d + r);
  }
  function l(c, d, f, u, p, g) {
    if (c !== f || d !== u) {
      var b = p.push(o(p) + "scale(", null, ",", null, ")");
      g.push({ i: b - 4, x: Xe(c, f) }, { i: b - 2, x: Xe(d, u) });
    } else (f !== 1 || u !== 1) && p.push(o(p) + "scale(" + f + "," + u + ")");
  }
  return function(c, d) {
    var f = [], u = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, f, u), s(c.rotate, d.rotate, f, u), a(c.skewX, d.skewX, f, u), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, u), c = d = null, function(p) {
      for (var g = -1, b = u.length, v; ++g < b; ) f[(v = u[g]).i] = v.x(p);
      return f.join("");
    };
  };
}
var s0 = ml(o0, "px, ", "px)", "deg)"), a0 = ml(i0, ", ", ")", ")"), l0 = 1e-12;
function gs(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function c0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function d0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const sr = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], f = s[1], u = s[2], p = d - a, g = f - l, b = p * p + g * g, v, y;
    if (b < l0)
      y = Math.log(u / c) / t, v = function(E) {
        return [
          a + E * p,
          l + E * g,
          c * Math.exp(t * E * y)
        ];
      };
    else {
      var _ = Math.sqrt(b), m = (u * u - c * c + r * b) / (2 * c * n * _), w = (u * u - c * c - r * b) / (2 * u * n * _), S = Math.log(Math.sqrt(m * m + 1) - m), k = Math.log(Math.sqrt(w * w + 1) - w);
      y = (k - S) / t, v = function(E) {
        var L = E * y, $ = gs(S), B = c / (n * _) * ($ * d0(t * L + S) - c0(S));
        return [
          a + B * p,
          l + B * g,
          c * $ / gs(t * L + S)
        ];
      };
    }
    return v.duration = y * 1e3 * t / Math.SQRT2, v;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var Ot = 0, tn = 0, Qt = 0, yl = 1e3, br, nn, vr = 0, _t = 0, Lr = 0, dn = typeof performance == "object" && performance.now ? performance : Date, wl = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function mi() {
  return _t || (wl(u0), _t = dn.now() + Lr);
}
function u0() {
  _t = 0;
}
function xr() {
  this._call = this._time = this._next = null;
}
xr.prototype = bl.prototype = {
  constructor: xr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? mi() : +n) + (t == null ? 0 : +t), !this._next && nn !== this && (nn ? nn._next = this : br = this, nn = this), this._call = e, this._time = n, Yo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Yo());
  }
};
function bl(e, t, n) {
  var r = new xr();
  return r.restart(e, t, n), r;
}
function f0() {
  mi(), ++Ot;
  for (var e = br, t; e; )
    (t = _t - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Ot;
}
function ms() {
  _t = (vr = dn.now()) + Lr, Ot = tn = 0;
  try {
    f0();
  } finally {
    Ot = 0, p0(), _t = 0;
  }
}
function h0() {
  var e = dn.now(), t = e - vr;
  t > yl && (Lr -= t, vr = e);
}
function p0() {
  for (var e, t = br, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : br = n);
  nn = e, Yo(r);
}
function Yo(e) {
  if (!Ot) {
    tn && (tn = clearTimeout(tn));
    var t = e - _t;
    t > 24 ? (e < 1 / 0 && (tn = setTimeout(ms, e - dn.now() - Lr)), Qt && (Qt = clearInterval(Qt))) : (Qt || (vr = dn.now(), Qt = setInterval(h0, yl)), Ot = 1, wl(ms));
  }
}
function ys(e, t, n) {
  var r = new xr();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var g0 = Ar("start", "end", "cancel", "interrupt"), m0 = [], vl = 0, ws = 1, Go = 2, ar = 3, bs = 4, Xo = 5, lr = 6;
function zr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  y0(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: g0,
    tween: m0,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: vl
  });
}
function yi(e, t) {
  var n = Ye(e, t);
  if (n.state > vl) throw new Error("too late; already scheduled");
  return n;
}
function Ke(e, t) {
  var n = Ye(e, t);
  if (n.state > ar) throw new Error("too late; already running");
  return n;
}
function Ye(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function y0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = bl(i, 0, n.time);
  function i(c) {
    n.state = ws, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, u, p;
    if (n.state !== ws) return l();
    for (d in r)
      if (p = r[d], p.name === n.name) {
        if (p.state === ar) return ys(s);
        p.state === bs ? (p.state = lr, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete r[d]) : +d < t && (p.state = lr, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete r[d]);
      }
    if (ys(function() {
      n.state === ar && (n.state = bs, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Go, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Go) {
      for (n.state = ar, o = new Array(u = n.tween.length), d = 0, f = -1; d < u; ++d)
        (p = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = p);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Xo, 1), f = -1, u = o.length; ++f < u; )
      o[f].call(e, d);
    n.state === Xo && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = lr, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function cr(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > Go && r.state < Xo, r.state = lr, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function w0(e) {
  return this.each(function() {
    cr(this, e);
  });
}
function b0(e, t) {
  var n, r;
  return function() {
    var o = Ke(this, e), i = o.tween;
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
function v0(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = Ke(this, e), s = i.tween;
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
function x0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Ye(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? b0 : v0)(n, e, t));
}
function wi(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = Ke(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return Ye(o, r).value[t];
  };
}
function xl(e, t) {
  var n;
  return (typeof t == "number" ? Xe : t instanceof xt ? wr : (n = xt(t)) ? (t = n, wr) : pl)(e, t);
}
function _0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function k0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function E0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function S0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function N0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function C0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function M0(e, t) {
  var n = Tr(e), r = n === "transform" ? a0 : xl;
  return this.attrTween(e, typeof t == "function" ? (n.local ? C0 : N0)(n, r, wi(this, "attr." + e, t)) : t == null ? (n.local ? k0 : _0)(n) : (n.local ? S0 : E0)(n, r, t));
}
function I0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function $0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function A0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && $0(e, i)), n;
  }
  return o._value = t, o;
}
function T0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && I0(e, i)), n;
  }
  return o._value = t, o;
}
function L0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Tr(e);
  return this.tween(n, (r.local ? A0 : T0)(r, t));
}
function z0(e, t) {
  return function() {
    yi(this, e).delay = +t.apply(this, arguments);
  };
}
function O0(e, t) {
  return t = +t, function() {
    yi(this, e).delay = t;
  };
}
function P0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? z0 : O0)(t, e)) : Ye(this.node(), t).delay;
}
function D0(e, t) {
  return function() {
    Ke(this, e).duration = +t.apply(this, arguments);
  };
}
function R0(e, t) {
  return t = +t, function() {
    Ke(this, e).duration = t;
  };
}
function H0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? D0 : R0)(t, e)) : Ye(this.node(), t).duration;
}
function B0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ke(this, e).ease = t;
  };
}
function W0(e) {
  var t = this._id;
  return arguments.length ? this.each(B0(t, e)) : Ye(this.node(), t).ease;
}
function V0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ke(this, e).ease = n;
  };
}
function F0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(V0(this._id, e));
}
function j0(e) {
  typeof e != "function" && (e = Qa(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new ot(r, this._parents, this._name, this._id);
}
function Y0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, f = s[a] = new Array(d), u, p = 0; p < d; ++p)
      (u = l[p] || c[p]) && (f[p] = u);
  for (; a < r; ++a)
    s[a] = t[a];
  return new ot(s, this._parents, this._name, this._id);
}
function G0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function X0(e, t, n) {
  var r, o, i = G0(t) ? yi : Ke;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function U0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Ye(this.node(), n).on.on(e) : this.each(X0(n, e, t));
}
function q0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function K0() {
  return this.on("end.remove", q0(this._id));
}
function Z0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = fi(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, f, u = 0; u < l; ++u)
      (d = a[u]) && (f = e.call(d, d.__data__, u, a)) && ("__data__" in d && (f.__data__ = d.__data__), c[u] = f, zr(c[u], t, n, u, c, Ye(d, n)));
  return new ot(i, this._parents, t, n);
}
function Q0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Za(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, f = 0; f < c; ++f)
      if (d = l[f]) {
        for (var u = e.call(d, d.__data__, f, l), p, g = Ye(d, n), b = 0, v = u.length; b < v; ++b)
          (p = u[b]) && zr(p, t, n, b, u, g);
        i.push(u), s.push(d);
      }
  return new ot(i, s, t, n);
}
var J0 = xn.prototype.constructor;
function ey() {
  return new J0(this._groups, this._parents);
}
function ty(e, t) {
  var n, r, o;
  return function() {
    var i = zt(this, e), s = (this.style.removeProperty(e), zt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function _l(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function ny(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = zt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function ry(e, t, n) {
  var r, o, i;
  return function() {
    var s = zt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), zt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function oy(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Ke(this, e), c = l.on, d = l.value[i] == null ? a || (a = _l(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function iy(e, t, n) {
  var r = (e += "") == "transform" ? s0 : xl;
  return t == null ? this.styleTween(e, ty(e, r)).on("end.style." + e, _l(e)) : typeof t == "function" ? this.styleTween(e, ry(e, r, wi(this, "style." + e, t))).each(oy(this._id, e)) : this.styleTween(e, ny(e, r, t), n).on("end.style." + e, null);
}
function sy(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function ay(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && sy(e, s, n)), r;
  }
  return i._value = t, i;
}
function ly(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, ay(e, t, n ?? ""));
}
function cy(e) {
  return function() {
    this.textContent = e;
  };
}
function dy(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function uy(e) {
  return this.tween("text", typeof e == "function" ? dy(wi(this, "text", e)) : cy(e == null ? "" : e + ""));
}
function fy(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function hy(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && fy(o)), t;
  }
  return r._value = e, r;
}
function py(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, hy(e));
}
function gy() {
  for (var e = this._name, t = this._id, n = kl(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = Ye(l, t);
        zr(l, e, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new ot(r, this._parents, e, n);
}
function my() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = Ke(this, r), d = c.on;
      d !== e && (t = (e = d).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var yy = 0;
function ot(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function kl() {
  return ++yy;
}
var et = xn.prototype;
ot.prototype = {
  constructor: ot,
  select: Z0,
  selectAll: Q0,
  selectChild: et.selectChild,
  selectChildren: et.selectChildren,
  filter: j0,
  merge: Y0,
  selection: ey,
  transition: gy,
  call: et.call,
  nodes: et.nodes,
  node: et.node,
  size: et.size,
  empty: et.empty,
  each: et.each,
  on: U0,
  attr: M0,
  attrTween: L0,
  style: iy,
  styleTween: ly,
  text: uy,
  textTween: py,
  remove: K0,
  tween: x0,
  delay: P0,
  duration: H0,
  ease: W0,
  easeVarying: F0,
  end: my,
  [Symbol.iterator]: et[Symbol.iterator]
};
function wy(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var by = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: wy
};
function vy(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function xy(e) {
  var t, n;
  e instanceof ot ? (t = e._id, e = e._name) : (t = kl(), (n = by).time = mi(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && zr(l, e, t, c, s, n || vy(l, t));
  return new ot(r, this._parents, e, t);
}
xn.prototype.interrupt = w0;
xn.prototype.transition = xy;
const Zn = (e) => () => e;
function _y(e, {
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
function rt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
rt.prototype = {
  constructor: rt,
  scale: function(e) {
    return e === 1 ? this : new rt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new rt(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Or = new rt(1, 0, 0);
El.prototype = rt.prototype;
function El(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Or;
  return e.__zoom;
}
function No(e) {
  e.stopImmediatePropagation();
}
function Jt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function ky(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Ey() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function vs() {
  return this.__zoom || Or;
}
function Sy(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Ny() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Cy(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function Sl() {
  var e = ky, t = Ey, n = Cy, r = Sy, o = Ny, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = sr, c = Ar("start", "zoom", "end"), d, f, u, p = 500, g = 150, b = 0, v = 10;
  function y(x) {
    x.property("__zoom", vs).on("wheel.zoom", L, { passive: !1 }).on("mousedown.zoom", $).on("dblclick.zoom", B).filter(o).on("touchstart.zoom", O).on("touchmove.zoom", W).on("touchend.zoom touchcancel.zoom", H).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(x, C, N, I) {
    var z = x.selection ? x.selection() : x;
    z.property("__zoom", vs), x !== z ? S(x, C, N, I) : z.interrupt().each(function() {
      k(this, arguments).event(I).start().zoom(null, typeof C == "function" ? C.apply(this, arguments) : C).end();
    });
  }, y.scaleBy = function(x, C, N, I) {
    y.scaleTo(x, function() {
      var z = this.__zoom.k, M = typeof C == "function" ? C.apply(this, arguments) : C;
      return z * M;
    }, N, I);
  }, y.scaleTo = function(x, C, N, I) {
    y.transform(x, function() {
      var z = t.apply(this, arguments), M = this.__zoom, T = N == null ? w(z) : typeof N == "function" ? N.apply(this, arguments) : N, P = M.invert(T), R = typeof C == "function" ? C.apply(this, arguments) : C;
      return n(m(_(M, R), T, P), z, s);
    }, N, I);
  }, y.translateBy = function(x, C, N, I) {
    y.transform(x, function() {
      return n(this.__zoom.translate(
        typeof C == "function" ? C.apply(this, arguments) : C,
        typeof N == "function" ? N.apply(this, arguments) : N
      ), t.apply(this, arguments), s);
    }, null, I);
  }, y.translateTo = function(x, C, N, I, z) {
    y.transform(x, function() {
      var M = t.apply(this, arguments), T = this.__zoom, P = I == null ? w(M) : typeof I == "function" ? I.apply(this, arguments) : I;
      return n(Or.translate(P[0], P[1]).scale(T.k).translate(
        typeof C == "function" ? -C.apply(this, arguments) : -C,
        typeof N == "function" ? -N.apply(this, arguments) : -N
      ), M, s);
    }, I, z);
  };
  function _(x, C) {
    return C = Math.max(i[0], Math.min(i[1], C)), C === x.k ? x : new rt(C, x.x, x.y);
  }
  function m(x, C, N) {
    var I = C[0] - N[0] * x.k, z = C[1] - N[1] * x.k;
    return I === x.x && z === x.y ? x : new rt(x.k, I, z);
  }
  function w(x) {
    return [(+x[0][0] + +x[1][0]) / 2, (+x[0][1] + +x[1][1]) / 2];
  }
  function S(x, C, N, I) {
    x.on("start.zoom", function() {
      k(this, arguments).event(I).start();
    }).on("interrupt.zoom end.zoom", function() {
      k(this, arguments).event(I).end();
    }).tween("zoom", function() {
      var z = this, M = arguments, T = k(z, M).event(I), P = t.apply(z, M), R = N == null ? w(P) : typeof N == "function" ? N.apply(z, M) : N, Y = Math.max(P[1][0] - P[0][0], P[1][1] - P[0][1]), j = z.__zoom, U = typeof C == "function" ? C.apply(z, M) : C, ee = l(j.invert(R).concat(Y / j.k), U.invert(R).concat(Y / U.k));
      return function(G) {
        if (G === 1) G = U;
        else {
          var D = ee(G), F = Y / D[2];
          G = new rt(F, R[0] - D[0] * F, R[1] - D[1] * F);
        }
        T.zoom(null, G);
      };
    });
  }
  function k(x, C, N) {
    return !N && x.__zooming || new E(x, C);
  }
  function E(x, C) {
    this.that = x, this.args = C, this.active = 0, this.sourceEvent = null, this.extent = t.apply(x, C), this.taps = 0;
  }
  E.prototype = {
    event: function(x) {
      return x && (this.sourceEvent = x), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(x, C) {
      return this.mouse && x !== "mouse" && (this.mouse[1] = C.invert(this.mouse[0])), this.touch0 && x !== "touch" && (this.touch0[1] = C.invert(this.touch0[0])), this.touch1 && x !== "touch" && (this.touch1[1] = C.invert(this.touch1[0])), this.that.__zoom = C, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(x) {
      var C = Me(this.that).datum();
      c.call(
        x,
        this.that,
        new _y(x, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: c
        }),
        C
      );
    }
  };
  function L(x, ...C) {
    if (!e.apply(this, arguments)) return;
    var N = k(this, C).event(x), I = this.__zoom, z = Math.max(i[0], Math.min(i[1], I.k * Math.pow(2, r.apply(this, arguments)))), M = Re(x);
    if (N.wheel)
      (N.mouse[0][0] !== M[0] || N.mouse[0][1] !== M[1]) && (N.mouse[1] = I.invert(N.mouse[0] = M)), clearTimeout(N.wheel);
    else {
      if (I.k === z) return;
      N.mouse = [M, I.invert(M)], cr(this), N.start();
    }
    Jt(x), N.wheel = setTimeout(T, g), N.zoom("mouse", n(m(_(I, z), N.mouse[0], N.mouse[1]), N.extent, s));
    function T() {
      N.wheel = null, N.end();
    }
  }
  function $(x, ...C) {
    if (u || !e.apply(this, arguments)) return;
    var N = x.currentTarget, I = k(this, C, !0).event(x), z = Me(x.view).on("mousemove.zoom", R, !0).on("mouseup.zoom", Y, !0), M = Re(x, N), T = x.clientX, P = x.clientY;
    ll(x.view), No(x), I.mouse = [M, this.__zoom.invert(M)], cr(this), I.start();
    function R(j) {
      if (Jt(j), !I.moved) {
        var U = j.clientX - T, ee = j.clientY - P;
        I.moved = U * U + ee * ee > b;
      }
      I.event(j).zoom("mouse", n(m(I.that.__zoom, I.mouse[0] = Re(j, N), I.mouse[1]), I.extent, s));
    }
    function Y(j) {
      z.on("mousemove.zoom mouseup.zoom", null), cl(j.view, I.moved), Jt(j), I.event(j).end();
    }
  }
  function B(x, ...C) {
    if (e.apply(this, arguments)) {
      var N = this.__zoom, I = Re(x.changedTouches ? x.changedTouches[0] : x, this), z = N.invert(I), M = N.k * (x.shiftKey ? 0.5 : 2), T = n(m(_(N, M), I, z), t.apply(this, C), s);
      Jt(x), a > 0 ? Me(this).transition().duration(a).call(S, T, I, x) : Me(this).call(y.transform, T, I, x);
    }
  }
  function O(x, ...C) {
    if (e.apply(this, arguments)) {
      var N = x.touches, I = N.length, z = k(this, C, x.changedTouches.length === I).event(x), M, T, P, R;
      for (No(x), T = 0; T < I; ++T)
        P = N[T], R = Re(P, this), R = [R, this.__zoom.invert(R), P.identifier], z.touch0 ? !z.touch1 && z.touch0[2] !== R[2] && (z.touch1 = R, z.taps = 0) : (z.touch0 = R, M = !0, z.taps = 1 + !!d);
      d && (d = clearTimeout(d)), M && (z.taps < 2 && (f = R[0], d = setTimeout(function() {
        d = null;
      }, p)), cr(this), z.start());
    }
  }
  function W(x, ...C) {
    if (this.__zooming) {
      var N = k(this, C).event(x), I = x.changedTouches, z = I.length, M, T, P, R;
      for (Jt(x), M = 0; M < z; ++M)
        T = I[M], P = Re(T, this), N.touch0 && N.touch0[2] === T.identifier ? N.touch0[0] = P : N.touch1 && N.touch1[2] === T.identifier && (N.touch1[0] = P);
      if (T = N.that.__zoom, N.touch1) {
        var Y = N.touch0[0], j = N.touch0[1], U = N.touch1[0], ee = N.touch1[1], G = (G = U[0] - Y[0]) * G + (G = U[1] - Y[1]) * G, D = (D = ee[0] - j[0]) * D + (D = ee[1] - j[1]) * D;
        T = _(T, Math.sqrt(G / D)), P = [(Y[0] + U[0]) / 2, (Y[1] + U[1]) / 2], R = [(j[0] + ee[0]) / 2, (j[1] + ee[1]) / 2];
      } else if (N.touch0) P = N.touch0[0], R = N.touch0[1];
      else return;
      N.zoom("touch", n(m(T, P, R), N.extent, s));
    }
  }
  function H(x, ...C) {
    if (this.__zooming) {
      var N = k(this, C).event(x), I = x.changedTouches, z = I.length, M, T;
      for (No(x), u && clearTimeout(u), u = setTimeout(function() {
        u = null;
      }, p), M = 0; M < z; ++M)
        T = I[M], N.touch0 && N.touch0[2] === T.identifier ? delete N.touch0 : N.touch1 && N.touch1[2] === T.identifier && delete N.touch1;
      if (N.touch1 && !N.touch0 && (N.touch0 = N.touch1, delete N.touch1), N.touch0) N.touch0[1] = this.__zoom.invert(N.touch0[0]);
      else if (N.end(), N.taps === 2 && (T = Re(T, this), Math.hypot(f[0] - T[0], f[1] - T[1]) < v)) {
        var P = Me(this).on("dblclick.zoom");
        P && P.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : Zn(+x), y) : r;
  }, y.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Zn(!!x), y) : e;
  }, y.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : Zn(!!x), y) : o;
  }, y.extent = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Zn([[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]]), y) : t;
  }, y.scaleExtent = function(x) {
    return arguments.length ? (i[0] = +x[0], i[1] = +x[1], y) : [i[0], i[1]];
  }, y.translateExtent = function(x) {
    return arguments.length ? (s[0][0] = +x[0][0], s[1][0] = +x[1][0], s[0][1] = +x[0][1], s[1][1] = +x[1][1], y) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, y.constrain = function(x) {
    return arguments.length ? (n = x, y) : n;
  }, y.duration = function(x) {
    return arguments.length ? (a = +x, y) : a;
  }, y.interpolate = function(x) {
    return arguments.length ? (l = x, y) : l;
  }, y.on = function() {
    var x = c.on.apply(c, arguments);
    return x === c ? y : x;
  }, y.clickDistance = function(x) {
    return arguments.length ? (b = (x = +x) * x, y) : Math.sqrt(b);
  }, y.tapDistance = function(x) {
    return arguments.length ? (v = +x, y) : v;
  }, y;
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
}, un = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Nl = ["Enter", " ", "Escape"], Cl = {
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
var Pt;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Pt || (Pt = {}));
var vt;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(vt || (vt = {}));
var fn;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(fn || (fn = {}));
const Ml = {
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
var ut;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(ut || (ut = {}));
var Dt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Dt || (Dt = {}));
var X;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(X || (X = {}));
const xs = {
  [X.Left]: X.Right,
  [X.Right]: X.Left,
  [X.Top]: X.Bottom,
  [X.Bottom]: X.Top
}, Il = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, My = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), bi = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), kn = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ge(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Iy = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : bi(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, Pr(o, _r(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? Dr(r) : { x: 0, y: 0, width: 0, height: 0 };
}, En = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = Pr(n, _r(o)), r = !0);
  }), r ? Dr(n) : { x: 0, y: 0, width: 0, height: 0 };
}, vi = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, f = [];
  for (const u of e.values()) {
    const { measured: p, selectable: g = !0, hidden: b = !1 } = u;
    if (s && !g || b)
      continue;
    const v = p.width ?? u.width ?? u.initialWidth ?? 0, y = p.height ?? u.height ?? u.initialHeight ?? 0, { x: _, y: m } = u.internals.positionAbsolute, w = Ll(a, l, c, d, _, m, v, y), S = v * y, k = i && w > 0;
    (!u.internals.handleBounds || k || w >= S || u.dragging) && f.push(u);
  }
  return f;
}, $y = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function Ay(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = Ge(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function Ty({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Ay(e, s), l = En(a), c = Rr(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function $l({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, d = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Ve.error005());
    else {
      const { width: p, height: g } = Ge(a);
      p && g && (f = [
        [l, c],
        [l + p, c + g]
      ]);
    }
  else a && Et(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const u = Et(f) ? kt(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Ve.error015())), {
    position: {
      x: u.x - l + (s.measured.width ?? 0) * d[0],
      y: u.y - c + (s.measured.height ?? 0) * d[1]
    },
    positionAbsolute: u
  };
}
async function Ly({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((u) => u.id)), s = [];
  for (const u of n) {
    if (u.deletable === !1)
      continue;
    const p = i.has(u.id), g = !p && u.parentId && s.find((b) => b.id === u.parentId);
    (p || g) && s.push(u);
  }
  const a = new Set(t.map((u) => u.id)), l = r.filter((u) => u.deletable !== !1), d = $y(s, l);
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
const Rt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), kt = (e = { x: 0, y: 0 }, t, n) => ({
  x: Rt(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: Rt(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function Al(e, t, n) {
  const { width: r, height: o } = Ge(n), { x: i, y: s } = n.internals.positionAbsolute;
  return kt(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const _s = (e, t, n) => e < t ? Rt(Math.abs(e - t), 1, t) / t : e > n ? -Rt(Math.abs(e - n), 1, t) / t : 0, xi = (e, t, n = 15, r = 40) => {
  const o = _s(e.x, r, t.width - r) * n, i = _s(e.y, r, t.height - r) * n;
  return [o, i];
}, Pr = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), Uo = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), Dr = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), hn = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = bi(e) ? e.internals.positionAbsolute : kn(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, _r = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = bi(e) ? e.internals.positionAbsolute : kn(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, Tl = (e, t) => Dr(Pr(Uo(e), Uo(t))), Ll = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, kr = (e, t) => Ll(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), ks = (e) => Be(e.width) && Be(e.height) && Be(e.x) && Be(e.y), Be = (e) => !isNaN(e) && isFinite(e), zl = (e, t) => (n, r) => {
}, Sn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Nn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Sn(a, s) : a;
}, Ht = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function $t(e, t) {
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
function zy(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = $t(e, n), o = $t(e, t);
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
    const r = $t(e.top ?? e.y ?? 0, n), o = $t(e.bottom ?? e.y ?? 0, n), i = $t(e.left ?? e.x ?? 0, t), s = $t(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Oy(e, t, n, r, o, i) {
  const { x: s, y: a } = Ht(e, [t, n, r]), { x: l, y: c } = Ht({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(f)
  };
}
const Rr = (e, t, n, r, o, i) => {
  const s = zy(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = Rt(c, r, o), f = e.x + e.width / 2, u = e.y + e.height / 2, p = t / 2 - f * d, g = n / 2 - u * d, b = Oy(e, p, g, d, t, n), v = {
    left: Math.min(b.left - s.left, 0),
    top: Math.min(b.top - s.top, 0),
    right: Math.min(b.right - s.right, 0),
    bottom: Math.min(b.bottom - s.bottom, 0)
  };
  return {
    x: p - v.left + v.right,
    y: g - v.top + v.bottom,
    zoom: d
  };
}, pn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Et(e) {
  return e != null && e !== "parent";
}
function Ge(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function Ol(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function Pl(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Es(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Py() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function Dy(e) {
  return { ...Cl, ...e || {} };
}
function Dl(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function on(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = We(e), a = Nn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Sn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const _i = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Rl = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, Ry = ["INPUT", "SELECT", "TEXTAREA"];
function Hl(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : Ry.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Bl = (e) => "clientX" in e, We = (e, t) => {
  var i, s;
  const n = Bl(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, Ss = (e, t, n, r, o) => {
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
      ..._i(s)
    };
  });
};
function Wl({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, d, f];
}
function Qn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Ns({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case X.Left:
      return [t - Qn(t - r, i), n];
    case X.Right:
      return [t + Qn(r - t, i), n];
    case X.Top:
      return [t, n - Qn(n - o, i)];
    case X.Bottom:
      return [t, n + Qn(o - n, i)];
  }
}
function Vl({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: o, targetPosition: i = X.Top, curvature: s = 0.25 }) {
  const [a, l] = Ns({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = Ns({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, u, p, g] = Wl({
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
    p,
    g
  ];
}
function Fl({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function Hy({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function By({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = Pr(_r(e), _r(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return kr(s, Dr(i)) > 0;
}
const Wy = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Vy = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Fy = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Ve.error006()), t;
  const r = n.getEdgeId || Wy;
  let o;
  return Il(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, Vy(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function jl({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = Fl({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const Cs = {
  [X.Left]: { x: -1, y: 0 },
  [X.Right]: { x: 1, y: 0 },
  [X.Top]: { x: 0, y: -1 },
  [X.Bottom]: { x: 0, y: 1 }
}, jy = ({ source: e, sourcePosition: t = X.Bottom, target: n }) => t === X.Left || t === X.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Ms = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Yy({ source: e, sourcePosition: t = X.Bottom, target: n, targetPosition: r = X.Top, center: o, offset: i, stepPosition: s }) {
  const a = Cs[t], l = Cs[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, f = jy({
    source: c,
    sourcePosition: t,
    target: d
  }), u = f.x !== 0 ? "x" : "y", p = f[u];
  let g = [], b, v;
  const y = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , m, w] = Fl({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[u] * l[u] === -1) {
    u === "x" ? (b = o.x ?? c.x + (d.x - c.x) * s, v = o.y ?? (c.y + d.y) / 2) : (b = o.x ?? (c.x + d.x) / 2, v = o.y ?? c.y + (d.y - c.y) * s);
    const L = [
      { x: b, y: c.y },
      { x: b, y: d.y }
    ], $ = [
      { x: c.x, y: v },
      { x: d.x, y: v }
    ];
    a[u] === p ? g = u === "x" ? L : $ : g = u === "x" ? $ : L;
  } else {
    const L = [{ x: c.x, y: d.y }], $ = [{ x: d.x, y: c.y }];
    if (u === "x" ? g = a.x === p ? $ : L : g = a.y === p ? L : $, t === r) {
      const x = Math.abs(e[u] - n[u]);
      if (x <= i) {
        const C = Math.min(i - 1, i - x);
        a[u] === p ? y[u] = (c[u] > e[u] ? -1 : 1) * C : _[u] = (d[u] > n[u] ? -1 : 1) * C;
      }
    }
    if (t !== r) {
      const x = u === "x" ? "y" : "x", C = a[u] === l[x], N = c[x] > d[x], I = c[x] < d[x];
      (a[u] === 1 && (!C && N || C && I) || a[u] !== 1 && (!C && I || C && N)) && (g = u === "x" ? L : $);
    }
    const B = { x: c.x + y.x, y: c.y + y.y }, O = { x: d.x + _.x, y: d.y + _.y }, W = Math.max(Math.abs(B.x - g[0].x), Math.abs(O.x - g[0].x)), H = Math.max(Math.abs(B.y - g[0].y), Math.abs(O.y - g[0].y));
    W >= H ? (b = (B.x + O.x) / 2, v = g[0].y) : (b = g[0].x, v = (B.y + O.y) / 2);
  }
  const S = { x: c.x + y.x, y: c.y + y.y }, k = { x: d.x + _.x, y: d.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...S.x !== g[0].x || S.y !== g[0].y ? [S] : [],
    ...g,
    ...k.x !== g[g.length - 1].x || k.y !== g[g.length - 1].y ? [k] : [],
    n
  ], b, v, m, w];
}
function Gy(e, t, n, r) {
  const o = Math.min(Ms(e, t) / 2, Ms(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * d}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function qo({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: o, targetPosition: i = X.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: d = 0.5 }) {
  const [f, u, p, g, b] = Yy({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: d
  });
  let v = `M${f[0].x} ${f[0].y}`;
  for (let y = 1; y < f.length - 1; y++)
    v += Gy(f[y - 1], f[y], f[y + 1], s);
  return v += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [v, u, p, g, b];
}
function Is(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Xy(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!Is(t) || !Is(n))
    return null;
  const r = t.internals.handleBounds || $s(t.handles), o = n.internals.handleBounds || $s(n.handles), i = As((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = As(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Pt.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Ve.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || X.Bottom, l = (s == null ? void 0 : s.position) || X.Top, c = St(t, i, a), d = St(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: d.x,
    targetY: d.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function $s(e) {
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
function St(e, t, n = X.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ge(e);
  if (r)
    return { x: o + s / 2, y: i + a / 2 };
  switch ((t == null ? void 0 : t.position) ?? n) {
    case X.Top:
      return { x: o + s / 2, y: i };
    case X.Right:
      return { x: o + s, y: i + a / 2 };
    case X.Bottom:
      return { x: o + s / 2, y: i + a };
    case X.Left:
      return { x: o, y: i + a / 2 };
  }
}
function As(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Ko(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function Uy(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = Ko(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const Yl = 1e3, qy = 10, ki = {
  nodeOrigin: [0, 0],
  nodeExtent: un,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Ky = {
  ...ki,
  checkEquality: !0
};
function Ei(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function Zy(e, t, n) {
  const r = Ei(ki, n);
  for (const o of e.values())
    if (o.parentId)
      Ni(o, e, t, r);
    else {
      const i = kn(o, r.nodeOrigin), s = Et(o.extent) ? o.extent : r.nodeExtent, a = kt(i, s, Ge(o));
      o.internals.positionAbsolute = a;
    }
}
function Qy(e, t) {
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
function Si(e) {
  return e === "manual";
}
function Zo(e, t, n, r = {}) {
  var d, f;
  const o = Ei(Ky, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !Si(o.zIndexMode) ? Yl : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let p = s.get(u.id);
    if (o.checkEquality && u === (p == null ? void 0 : p.internals.userNode))
      t.set(u.id, p);
    else {
      const g = kn(u, o.nodeOrigin), b = Et(u.extent) ? u.extent : o.nodeExtent, v = kt(g, b, Ge(u));
      p = {
        ...o.defaults,
        ...u,
        measured: {
          width: (d = u.measured) == null ? void 0 : d.width,
          height: (f = u.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: v,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Qy(u, p),
          z: Gl(u, a, o.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, p);
    }
    (p.measured === void 0 || p.measured.width === void 0 || p.measured.height === void 0) && !p.hidden && (l = !1), u.parentId && Ni(p, t, n, r, i), c || (c = u.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Jy(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Ni(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Ei(ki, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Jy(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * qy), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const f = i && !Si(l) ? Yl : 0, { x: u, y: p, z: g } = ew(e, d, s, a, f, l), { positionAbsolute: b } = e.internals, v = u !== b.x || p !== b.y;
  (v || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: v ? { x: u, y: p } : b,
      z: g
    }
  });
}
function Gl(e, t, n) {
  const r = Be(e.zIndex) ? e.zIndex : 0;
  return Si(n) ? r : r + (e.selected ? t : 0);
}
function ew(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ge(e), c = kn(e, n), d = Et(e.extent) ? kt(c, e.extent, l) : c;
  let f = kt({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (f = Al(f, l, t));
  const u = Gl(e, o, i), p = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: p >= u ? p + 1 : u
  };
}
function Ci(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? hn(l), d = Tl(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var m;
    const d = l.internals.positionAbsolute, f = Ge(l), u = l.origin ?? r, p = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, b = Math.max(f.width, Math.round(a.width)), v = Math.max(f.height, Math.round(a.height)), y = (b - f.width) * u[0], _ = (v - f.height) * u[1];
    (p > 0 || g > 0 || y || _) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - p + y,
        y: l.position.y - g + _
      }
    }), (m = n.get(c)) == null || m.forEach((w) => {
      e.some((S) => S.id === w.id) || o.push({
        id: w.id,
        type: "position",
        position: {
          x: w.position.x + p,
          y: w.position.y + g
        }
      });
    })), (f.width < a.width || f.height < a.height || p || g) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: b + (p ? u[0] * p - y : 0),
        height: v + (g ? u[1] * g - _ : 0)
      }
    });
  }), o;
}
function tw(e, t, n, r, o, i, s) {
  const a = r == null ? void 0 : r.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], d = window.getComputedStyle(a), { m22: f } = new window.DOMMatrixReadOnly(d.transform), u = [];
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
    const b = _i(p.nodeElement), v = g.measured.width !== b.width || g.measured.height !== b.height;
    if (!!(b.width && b.height && (v || !g.internals.handleBounds || p.force))) {
      const _ = p.nodeElement.getBoundingClientRect(), m = Et(g.extent) ? g.extent : i;
      let { positionAbsolute: w } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const k = t.get(g.parentId);
        k && (w = Al(w, b, k));
      } else m && (w = kt(w, m, b));
      const S = {
        ...g,
        measured: b,
        internals: {
          ...g.internals,
          positionAbsolute: w,
          handleBounds: {
            source: Ss("source", p.nodeElement, _, f, g.id),
            target: Ss("target", p.nodeElement, _, f, g.id)
          }
        }
      };
      t.set(g.id, S), g.parentId && Ni(S, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, v && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: b
      }), g.expandParent && g.parentId && u.push({
        id: g.id,
        parentId: g.parentId,
        rect: hn(S, o)
      }));
    }
  }
  if (u.length > 0) {
    const p = Ci(u, t, n, o);
    c.push(...p);
  }
  return { changes: c, updatedInternals: l };
}
async function nw({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function Ts(e, t, n, r, o, i) {
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
function Xl(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    Ts("source", l, d, e, o, s), Ts("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function Ul(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Ul(n, t) : !1;
}
function Ls(e, t, n) {
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
function rw(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !Ul(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function Co({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
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
function ow({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Sn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function iw({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, f = !1, u = null, p = !1, g = !1, b = null;
  function v({ noDragClassName: _, handleSelector: m, domNode: w, isSelectable: S, nodeId: k, nodeClickDistance: E = 0 }) {
    u = Me(w);
    function L({ x: W, y: H }) {
      const { nodeLookup: x, nodeExtent: C, snapGrid: N, snapToGrid: I, nodeOrigin: z, onNodeDrag: M, onSelectionDrag: T, onError: P, updateNodePositions: R } = t();
      i = { x: W, y: H };
      let Y = !1;
      const j = a.size > 1, U = j && C ? Uo(En(a)) : null, ee = j && I ? ow({
        dragItems: a,
        snapGrid: N,
        x: W,
        y: H
      }) : null;
      for (const [G, D] of a) {
        if (!x.has(G))
          continue;
        let F = { x: W - D.distance.x, y: H - D.distance.y };
        I && (F = ee ? {
          x: Math.round(F.x + ee.x),
          y: Math.round(F.y + ee.y)
        } : Sn(F, N));
        let Z = null;
        if (j && C && !D.extent && U) {
          const { positionAbsolute: J } = D.internals, te = J.x - U.x + C[0][0], ne = J.x + D.measured.width - U.x2 + C[1][0], ie = J.y - U.y + C[0][1], ae = J.y + D.measured.height - U.y2 + C[1][1];
          Z = [
            [te, ie],
            [ne, ae]
          ];
        }
        const { position: Q, positionAbsolute: q } = $l({
          nodeId: G,
          nextPosition: F,
          nodeLookup: x,
          nodeExtent: Z || C,
          nodeOrigin: z,
          onError: P
        });
        Y = Y || D.position.x !== Q.x || D.position.y !== Q.y, D.position = Q, D.internals.positionAbsolute = q;
      }
      if (g = g || Y, !!Y && (R(a, !0), b && (r || M || !k && T))) {
        const [G, D] = Co({
          nodeId: k,
          dragItems: a,
          nodeLookup: x
        });
        r == null || r(b, a, G, D), M == null || M(b, G, D), k || T == null || T(b, D);
      }
    }
    async function $() {
      if (!d)
        return;
      const { transform: W, panBy: H, autoPanSpeed: x, autoPanOnNodeDrag: C } = t();
      if (!C) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [N, I] = xi(c, d, x);
      (N !== 0 || I !== 0) && (i.x = (i.x ?? 0) - N / W[2], i.y = (i.y ?? 0) - I / W[2], await H({ x: N, y: I }) && L(i)), s = requestAnimationFrame($);
    }
    function B(W) {
      var j;
      const { nodeLookup: H, multiSelectionActive: x, nodesDraggable: C, transform: N, snapGrid: I, snapToGrid: z, selectNodesOnDrag: M, onNodeDragStart: T, onSelectionDragStart: P, unselectNodesAndEdges: R } = t();
      f = !0, (!M || !S) && !x && k && ((j = H.get(k)) != null && j.selected || R()), S && M && k && (e == null || e(k));
      const Y = on(W.sourceEvent, { transform: N, snapGrid: I, snapToGrid: z, containerBounds: d });
      if (i = Y, a = rw(H, C, Y, k), a.size > 0 && (n || T || !k && P)) {
        const [U, ee] = Co({
          nodeId: k,
          dragItems: a,
          nodeLookup: H
        });
        n == null || n(W.sourceEvent, a, U, ee), T == null || T(W.sourceEvent, U, ee), k || P == null || P(W.sourceEvent, ee);
      }
    }
    const O = dl().clickDistance(E).on("start", (W) => {
      const { domNode: H, nodeDragThreshold: x, transform: C, snapGrid: N, snapToGrid: I } = t();
      d = (H == null ? void 0 : H.getBoundingClientRect()) || null, p = !1, g = !1, b = W.sourceEvent, x === 0 && B(W), i = on(W.sourceEvent, { transform: C, snapGrid: N, snapToGrid: I, containerBounds: d }), c = We(W.sourceEvent, d);
    }).on("drag", (W) => {
      const { autoPanOnNodeDrag: H, transform: x, snapGrid: C, snapToGrid: N, nodeDragThreshold: I, nodeLookup: z } = t(), M = on(W.sourceEvent, { transform: x, snapGrid: C, snapToGrid: N, containerBounds: d });
      if (b = W.sourceEvent, (W.sourceEvent.type === "touchmove" && W.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      k && !z.has(k)) && (p = !0), !p) {
        if (!l && H && f && (l = !0, $()), !f) {
          const T = We(W.sourceEvent, d), P = T.x - c.x, R = T.y - c.y;
          Math.sqrt(P * P + R * R) > I && B(W);
        }
        (i.x !== M.xSnapped || i.y !== M.ySnapped) && a && f && (c = We(W.sourceEvent, d), L(M));
      }
    }).on("end", (W) => {
      if (!f || p) {
        p && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: H, updateNodePositions: x, onNodeDragStop: C, onSelectionDragStop: N } = t();
        if (g && (x(a, !1), g = !1), o || C || !k && N) {
          const [I, z] = Co({
            nodeId: k,
            dragItems: a,
            nodeLookup: H,
            dragging: !1
          });
          o == null || o(W.sourceEvent, a, I, z), C == null || C(W.sourceEvent, I, z), k || N == null || N(W.sourceEvent, z);
        }
      }
    }).filter((W) => {
      const H = W.target;
      return !W.button && (!_ || !Ls(H, `.${_}`, w)) && (!m || Ls(H, m, w));
    });
    u.call(O);
  }
  function y() {
    u == null || u.on(".drag", null);
  }
  return {
    update: v,
    destroy: y
  };
}
function sw(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    kr(o, hn(i)) > 0 && r.push(i);
  return r;
}
const aw = 250;
function lw(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = sw(e, n, t + aw);
  for (const c of s) {
    const d = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of d) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: u, y: p } = St(c, f, f.position, !0), g = Math.sqrt(Math.pow(u - e.x, 2) + Math.pow(p - e.y, 2));
      g > t || (g < i ? (o = [{ ...f, x: u, y: p }], i = g) : g === i && o.push({ ...f, x: u, y: p }));
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
function ql(e, t, n, r, o, i = !1) {
  var c, d, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((u) => u.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...St(s, l, l.position, !0) } : l;
}
function Kl(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function cw(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Zl = () => !0;
function dw(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: f, panBy: u, cancelConnection: p, onConnectStart: g, onConnect: b, onConnectEnd: v, isValidConnection: y = Zl, onReconnectEnd: _, updateConnection: m, getTransform: w, getFromHandle: S, autoPanSpeed: k, dragThreshold: E = 1, handleDomNode: L }) {
  const $ = Rl(e.target);
  let B = 0, O;
  const { x: W, y: H } = We(e), x = Kl(i, L), C = a == null ? void 0 : a.getBoundingClientRect();
  let N = !1;
  if (!C || !x)
    return;
  const I = ql(o, x, r, l, t);
  if (!I)
    return;
  let z = We(e, C), M = !1, T = null, P = !1, R = null;
  function Y() {
    if (!d || !C)
      return;
    const [Q, q] = xi(z, C, k);
    u({ x: Q, y: q }), B = requestAnimationFrame(Y);
  }
  const j = {
    ...I,
    nodeId: o,
    type: x,
    position: I.position
  }, U = l.get(o);
  let G = {
    inProgress: !0,
    isValid: null,
    from: St(U, j, X.Left, !0),
    fromHandle: j,
    fromPosition: j.position,
    fromNode: U,
    to: z,
    toHandle: null,
    toPosition: xs[j.position],
    toNode: null,
    pointer: z
  };
  function D() {
    N = !0, m(G), g == null || g(e, { nodeId: o, handleId: r, handleType: x });
  }
  E === 0 && D();
  function F(Q) {
    if (!N) {
      const { x: ae, y: _e } = We(Q), Ae = ae - W, ve = _e - H;
      if (!(Ae * Ae + ve * ve > E * E))
        return;
      D();
    }
    if (!S() || !j) {
      Z(Q);
      return;
    }
    const q = w();
    z = We(Q, C), O = lw(Nn(z, q, !1, [1, 1]), n, l, j), M || (Y(), M = !0);
    const J = Ql(Q, {
      handle: O,
      connectionMode: t,
      fromNodeId: o,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: y,
      doc: $,
      lib: c,
      flowId: f,
      nodeLookup: l
    });
    R = J.handleDomNode, T = J.connection, P = cw(!!O, J.isValid);
    const te = l.get(o), ne = te ? St(te, j, X.Left, !0) : G.from, ie = {
      ...G,
      from: ne,
      isValid: P,
      to: J.toHandle && P ? Ht({ x: J.toHandle.x, y: J.toHandle.y }, q) : z,
      toHandle: J.toHandle,
      toPosition: P && J.toHandle ? J.toHandle.position : xs[j.position],
      toNode: J.toHandle ? l.get(J.toHandle.nodeId) : null,
      pointer: z
    };
    m(ie), G = ie;
  }
  function Z(Q) {
    if (!("touches" in Q && Q.touches.length > 0)) {
      if (N) {
        (O || R) && T && P && (b == null || b(T));
        const { inProgress: q, ...J } = G, te = {
          ...J,
          toPosition: G.toHandle ? G.toPosition : null
        };
        v == null || v(Q, te), i && (_ == null || _(Q, te));
      }
      p(), cancelAnimationFrame(B), M = !1, P = !1, T = null, R = null, $.removeEventListener("mousemove", F), $.removeEventListener("mouseup", Z), $.removeEventListener("touchmove", F), $.removeEventListener("touchend", Z);
    }
  }
  $.addEventListener("mousemove", F), $.addEventListener("mouseup", Z), $.addEventListener("touchmove", F), $.addEventListener("touchend", Z);
}
function Ql(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Zl, nodeLookup: d }) {
  const f = i === "target", u = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: p, y: g } = We(e), b = s.elementFromPoint(p, g), v = b != null && b.classList.contains(`${a}-flow__handle`) ? b : u, y = {
    handleDomNode: v,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (v) {
    const _ = Kl(void 0, v), m = v.getAttribute("data-nodeid"), w = v.getAttribute("data-handleid"), S = v.classList.contains("connectable"), k = v.classList.contains("connectableend");
    if (!m || !_)
      return y;
    const E = {
      source: f ? m : r,
      sourceHandle: f ? w : o,
      target: f ? r : m,
      targetHandle: f ? o : w
    };
    y.connection = E;
    const $ = S && k && (n === Pt.Strict ? f && _ === "source" || !f && _ === "target" : m !== r || w !== o);
    y.isValid = $ && c(E), y.toHandle = ql(m, _, w, d, n, !0);
  }
  return y;
}
const Qo = {
  onPointerDown: dw,
  isValid: Ql
};
function uw({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Me(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: f = !0, zoomable: u = !0, inversePan: p = !1 }) {
    const g = (m) => {
      if (m.sourceEvent.type !== "wheel" || !t)
        return;
      const w = n(), S = m.sourceEvent.ctrlKey && pn() ? 10 : 1, k = -m.sourceEvent.deltaY * (m.sourceEvent.deltaMode === 1 ? 0.05 : m.sourceEvent.deltaMode ? 1 : 2e-3) * d, E = w[2] * Math.pow(2, k * S);
      t.scaleTo(E);
    };
    let b = [0, 0];
    const v = (m) => {
      (m.sourceEvent.type === "mousedown" || m.sourceEvent.type === "touchstart") && (b = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ]);
    }, y = (m) => {
      const w = n();
      if (m.sourceEvent.type !== "mousemove" && m.sourceEvent.type !== "touchmove" || !t)
        return;
      const S = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ], k = [S[0] - b[0], S[1] - b[1]];
      b = S;
      const E = r() * Math.max(w[2], Math.log(w[2])) * (p ? -1 : 1), L = {
        x: w[0] - k[0] * E,
        y: w[1] - k[1] * E
      }, $ = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: L.x,
        y: L.y,
        zoom: w[2]
      }, $, a);
    }, _ = Sl().on("start", v).on("zoom", f ? y : null).on("zoom.wheel", u ? g : null);
    o.call(_, {});
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
const Hr = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Mo = ({ x: e, y: t, zoom: n }) => Or.translate(e, t).scale(n), dt = (e, t) => e.target.closest(`.${t}`), Jl = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), fw = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Io = (e, t = 0, n = fw, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, ec = (e) => {
  const t = e.ctrlKey && pn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function hw({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (dt(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const v = Re(d), y = ec(d), _ = f * Math.pow(2, y);
      r.scaleTo(n, _, v, d);
      return;
    }
    const u = d.deltaMode === 1 ? 20 : 1;
    let p = o === vt.Vertical ? 0 : d.deltaX * u, g = o === vt.Horizontal ? 0 : d.deltaY * u;
    !pn() && d.shiftKey && o !== vt.Vertical && (p = d.deltaY * u, g = 0), r.translateBy(
      n,
      -(p / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const b = Hr(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, b) : (e.isPanScrolling = !0, a == null || a(d, b)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, b), e.isPanScrolling = !1;
    }, 150);
  };
}
function pw({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = dt(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function gw({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = Hr(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function mw({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Jl(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, Hr(i.transform)));
  };
}
function yw({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Jl(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = Hr(s.transform);
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
function ww({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: f }) {
  return (u) => {
    var y;
    const p = t || n, g = r && u.ctrlKey, b = u.type === "wheel";
    if (u.button === 1 && u.type === "mousedown" && (dt(u, `${d}-flow__node`) || dt(u, `${d}-flow__edge`) || dt(u, `${d}-flow__selection`) || dt(u, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !p && !i && !s && !r || a || f && !b || dt(u, l) && b || dt(u, c) && (!b || i && b && !t) || !r && u.ctrlKey && b)
      return !1;
    if (!r && u.type === "touchstart" && ((y = u.touches) == null ? void 0 : y.length) > 1)
      return u.preventDefault(), !1;
    if (!p && !i && !g && b || !o && (u.type === "mousedown" || u.type === "touchstart") || Array.isArray(o) && !o.includes(u.button) && u.type === "mousedown")
      return !1;
    const v = Array.isArray(o) && o.includes(u.button) || !u.button || u.button <= 1;
    return (!u.ctrlKey || b || e) && v;
  };
}
function bw({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
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
  const u = typeof ResizeObserver < "u" ? new ResizeObserver((H) => {
    const x = H[0];
    x && (f = [
      [0, 0],
      [x.contentRect.width, x.contentRect.height]
    ]);
  }) : null;
  u == null || u.observe(e);
  const p = Sl().extent(() => f).scaleExtent([t, n]).translateExtent(r), g = Me(e).call(p);
  w({
    x: o.x,
    y: o.y,
    zoom: Rt(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const b = g.on("wheel.zoom"), v = g.on("dblclick.zoom");
  p.wheelDelta(ec);
  async function y(H, x) {
    return g ? new Promise((C) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? rn : sr).transform(Io(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => C(!0)), H);
    }) : !1;
  }
  function _({ noWheelClassName: H, noPanClassName: x, onPaneContextMenu: C, userSelectionActive: N, panOnScroll: I, panOnDrag: z, panOnScrollMode: M, panOnScrollSpeed: T, preventScrolling: P, zoomOnPinch: R, zoomOnScroll: Y, zoomOnDoubleClick: j, panActivationKeyPressed: U = !1, zoomActivationKeyPressed: ee, lib: G, onTransformChange: D, connectionInProgress: F, paneClickDistance: Z, selectionOnDrag: Q }) {
    N && !c.isZoomingOrPanning && m();
    const q = I && !ee && !N;
    p.clickDistance(Q ? 1 / 0 : !Be(Z) || Z < 0 ? 0 : Z);
    const J = q ? hw({
      zoomPanValues: c,
      noWheelClassName: H,
      d3Selection: g,
      d3Zoom: p,
      panOnScrollMode: M,
      panOnScrollSpeed: T,
      zoomOnPinch: R,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : pw({
      noWheelClassName: H,
      preventScrolling: P,
      d3ZoomHandler: b
    });
    g.on("wheel.zoom", J, { passive: !1 });
    const te = gw({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    p.on("start", te);
    const ne = mw({
      zoomPanValues: c,
      panOnDrag: z,
      onPaneContextMenu: !!C,
      onPanZoom: i,
      onTransformChange: D
    });
    p.on("zoom", ne);
    const ie = yw({
      zoomPanValues: c,
      panOnDrag: z,
      panOnScroll: I,
      onPaneContextMenu: C,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    p.on("end", ie);
    const ae = ww({
      panActivationKeyPressed: U,
      zoomActivationKeyPressed: ee,
      panOnDrag: z,
      zoomOnScroll: Y,
      panOnScroll: I,
      zoomOnDoubleClick: j,
      zoomOnPinch: R,
      userSelectionActive: N,
      noPanClassName: x,
      noWheelClassName: H,
      lib: G,
      connectionInProgress: F
    });
    p.filter(ae), j ? g.on("dblclick.zoom", v) : g.on("dblclick.zoom", null);
  }
  function m() {
    p.on("zoom", null);
  }
  async function w(H, x, C) {
    const N = Mo(H), I = p == null ? void 0 : p.constrain()(N, x, C);
    return I && await y(I), I;
  }
  async function S(H, x) {
    const C = Mo(H);
    return await y(C, x), C;
  }
  function k(H) {
    if (g) {
      const x = Mo(H), C = g.property("__zoom");
      (C.k !== H.zoom || C.x !== H.x || C.y !== H.y) && (p == null || p.transform(g, x, null, { sync: !0 }));
    }
  }
  function E() {
    const H = g ? El(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: H.x, y: H.y, zoom: H.k };
  }
  async function L(H, x) {
    return g ? new Promise((C) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? rn : sr).scaleTo(Io(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => C(!0)), H);
    }) : !1;
  }
  async function $(H, x) {
    return g ? new Promise((C) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? rn : sr).scaleBy(Io(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => C(!0)), H);
    }) : !1;
  }
  function B(H) {
    p == null || p.scaleExtent(H);
  }
  function O(H) {
    p == null || p.translateExtent(H);
  }
  function W(H) {
    const x = !Be(H) || H < 0 ? 0 : H;
    p == null || p.clickDistance(x);
  }
  return {
    update: _,
    destroy: m,
    setViewport: S,
    setViewportConstrained: w,
    getViewport: E,
    scaleTo: L,
    scaleBy: $,
    setScaleExtent: B,
    setTranslateExtent: O,
    syncViewport: k,
    setClickDistance: W
  };
}
var Bt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Bt || (Bt = {}));
function vw({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function zs(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function lt(e, t) {
  return Math.max(0, t - e);
}
function ct(e, t) {
  return Math.max(0, e - t);
}
function Jn(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function Os(e, t) {
  return e ? !t : t;
}
function xw(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: f } = t, u = d && f, { xSnapped: p, ySnapped: g } = n, { minWidth: b, maxWidth: v, minHeight: y, maxHeight: _ } = r, { x: m, y: w, width: S, height: k, aspectRatio: E } = e;
  let L = Math.floor(d ? p - e.pointerX : 0), $ = Math.floor(f ? g - e.pointerY : 0);
  const B = S + (l ? -L : L), O = k + (c ? -$ : $), W = -i[0] * S, H = -i[1] * k;
  let x = Jn(B, b, v), C = Jn(O, y, _);
  if (s) {
    let z = 0, M = 0;
    l && L < 0 ? z = lt(m + L + W, s[0][0]) : !l && L > 0 && (z = ct(m + B + W, s[1][0])), c && $ < 0 ? M = lt(w + $ + H, s[0][1]) : !c && $ > 0 && (M = ct(w + O + H, s[1][1])), x = Math.max(x, z), C = Math.max(C, M);
  }
  if (a) {
    let z = 0, M = 0;
    l && L > 0 ? z = ct(m + L, a[0][0]) : !l && L < 0 && (z = lt(m + B, a[1][0])), c && $ > 0 ? M = ct(w + $, a[0][1]) : !c && $ < 0 && (M = lt(w + O, a[1][1])), x = Math.max(x, z), C = Math.max(C, M);
  }
  if (o) {
    if (d) {
      const z = Jn(B / E, y, _) * E;
      if (x = Math.max(x, z), s) {
        let M = 0;
        !l && !c || l && !c && u ? M = ct(w + H + B / E, s[1][1]) * E : M = lt(w + H + (l ? L : -L) / E, s[0][1]) * E, x = Math.max(x, M);
      }
      if (a) {
        let M = 0;
        !l && !c || l && !c && u ? M = lt(w + B / E, a[1][1]) * E : M = ct(w + (l ? L : -L) / E, a[0][1]) * E, x = Math.max(x, M);
      }
    }
    if (f) {
      const z = Jn(O * E, b, v) / E;
      if (C = Math.max(C, z), s) {
        let M = 0;
        !l && !c || c && !l && u ? M = ct(m + O * E + W, s[1][0]) / E : M = lt(m + (c ? $ : -$) * E + W, s[0][0]) / E, C = Math.max(C, M);
      }
      if (a) {
        let M = 0;
        !l && !c || c && !l && u ? M = lt(m + O * E, a[1][0]) / E : M = ct(m + (c ? $ : -$) * E, a[0][0]) / E, C = Math.max(C, M);
      }
    }
  }
  $ = $ + ($ < 0 ? C : -C), L = L + (L < 0 ? x : -x), o && (u ? B > O * E ? $ = (Os(l, c) ? -L : L) / E : L = (Os(l, c) ? -$ : $) * E : d ? ($ = L / E, c = l) : (L = $ * E, l = c));
  const N = l ? m + L : m, I = c ? w + $ : w;
  return {
    width: S + (l ? -L : L),
    height: k + (c ? -$ : $),
    x: i[0] * L * (l ? -1 : 1) + N,
    y: i[1] * $ * (c ? -1 : 1) + I
  };
}
const tc = { width: 0, height: 0, x: 0, y: 0 }, _w = {
  ...tc,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function kw(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function Ew({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Me(e);
  let s = {
    controlDirection: zs("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: f, resizeDirection: u, onResizeStart: p, onResize: g, onResizeEnd: b, shouldResize: v }) {
    let y = { ...tc }, _ = { ..._w };
    s = {
      boundaries: d,
      resizeDirection: u,
      keepAspectRatio: f,
      controlDirection: zs(c)
    };
    let m, w = null, S = [], k, E, L;
    const $ = dl().on("start", (B) => {
      const { nodeLookup: O, transform: W, snapGrid: H, snapToGrid: x, nodeOrigin: C, paneDomNode: N } = n();
      if (m = O.get(t), !m)
        return;
      w = (N == null ? void 0 : N.getBoundingClientRect()) ?? null;
      const { xSnapped: I, ySnapped: z } = on(B.sourceEvent, {
        transform: W,
        snapGrid: H,
        snapToGrid: x,
        containerBounds: w
      });
      y = {
        width: m.measured.width ?? 0,
        height: m.measured.height ?? 0,
        x: m.position.x ?? 0,
        y: m.position.y ?? 0
      }, _ = {
        ...y,
        pointerX: I,
        pointerY: z,
        aspectRatio: y.width / y.height
      }, k = void 0, E = Et(m.extent) ? m.extent : void 0, m.parentId && (m.extent === "parent" || m.expandParent) && (k = O.get(m.parentId)), k && m.extent === "parent" && (E = [
        [0, 0],
        [k.measured.width, k.measured.height]
      ]), S = [], L = void 0;
      for (const [M, T] of O)
        if (T.parentId === t && (S.push({
          id: M,
          position: { ...T.position },
          extent: T.extent
        }), T.extent === "parent" || T.expandParent)) {
          const P = kw(T, m, T.origin ?? C);
          L ? L = [
            [Math.min(P[0][0], L[0][0]), Math.min(P[0][1], L[0][1])],
            [Math.max(P[1][0], L[1][0]), Math.max(P[1][1], L[1][1])]
          ] : L = P;
        }
      p == null || p(B, { ...y });
    }).on("drag", (B) => {
      const { transform: O, snapGrid: W, snapToGrid: H, nodeOrigin: x } = n(), C = on(B.sourceEvent, {
        transform: O,
        snapGrid: W,
        snapToGrid: H,
        containerBounds: w
      }), N = [];
      if (!m)
        return;
      const { x: I, y: z, width: M, height: T } = y, P = {}, R = m.origin ?? x, { width: Y, height: j, x: U, y: ee } = xw(_, s.controlDirection, C, s.boundaries, s.keepAspectRatio, R, E, L), G = Y !== M, D = j !== T, F = U !== I && G, Z = ee !== z && D;
      if (!F && !Z && !G && !D)
        return;
      const Q = {
        prevValues: { ...y },
        startX: _.x,
        startY: _.y,
        childNodes: S.map((ne) => ({
          ...ne,
          position: { ...ne.position }
        }))
      };
      if ((F || Z || R[0] === 1 || R[1] === 1) && (P.x = F ? U : y.x, P.y = Z ? ee : y.y, y.x = P.x, y.y = P.y, S.length > 0)) {
        const ne = U - I, ie = ee - z;
        for (const ae of S)
          ae.position = {
            x: ae.position.x - ne + R[0] * (Y - M),
            y: ae.position.y - ie + R[1] * (j - T)
          }, N.push(ae);
      }
      if ((G || D) && (P.width = G && (!s.resizeDirection || s.resizeDirection === "horizontal") ? Y : y.width, P.height = D && (!s.resizeDirection || s.resizeDirection === "vertical") ? j : y.height, y.width = P.width, y.height = P.height), k && m.expandParent) {
        const ne = R[0] * (P.width ?? 0);
        P.x && P.x < ne && (y.x = ne, _.x = _.x - (P.x - ne));
        const ie = R[1] * (P.height ?? 0);
        P.y && P.y < ie && (y.y = ie, _.y = _.y - (P.y - ie));
      }
      const q = vw({
        width: y.width,
        prevWidth: M,
        height: y.height,
        prevHeight: T,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), J = { ...y, direction: q };
      if ((v == null ? void 0 : v(B, J)) === !1) {
        y = Q.prevValues, _.x = Q.startX, _.y = Q.startY, S.forEach((ne, ie) => {
          ne.position = Q.childNodes[ie].position;
        });
        return;
      }
      g == null || g(B, J), r(P, N);
    }).on("end", (B) => {
      b == null || b(B, { ...y }), o == null || o({ ...y });
    });
    i.call($);
  }
  function l() {
    i.on(".drag", null);
  }
  return {
    update: a,
    destroy: l
  };
}
var nc = { exports: {} }, rc = {}, oc = { exports: {} }, ic = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wt = si;
function Sw(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Nw = typeof Object.is == "function" ? Object.is : Sw, Cw = Wt.useState, Mw = Wt.useEffect, Iw = Wt.useLayoutEffect, $w = Wt.useDebugValue;
function Aw(e, t) {
  var n = t(), r = Cw({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Iw(
    function() {
      o.value = n, o.getSnapshot = t, $o(o) && i({ inst: o });
    },
    [e, n, t]
  ), Mw(
    function() {
      return $o(o) && i({ inst: o }), e(function() {
        $o(o) && i({ inst: o });
      });
    },
    [e]
  ), $w(n), n;
}
function $o(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Nw(e, n);
  } catch {
    return !0;
  }
}
function Tw(e, t) {
  return t();
}
var Lw = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Tw : Aw;
ic.useSyncExternalStore = Wt.useSyncExternalStore !== void 0 ? Wt.useSyncExternalStore : Lw;
oc.exports = ic;
var zw = oc.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Br = si, Ow = zw;
function Pw(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Dw = typeof Object.is == "function" ? Object.is : Pw, Rw = Ow.useSyncExternalStore, Hw = Br.useRef, Bw = Br.useEffect, Ww = Br.useMemo, Vw = Br.useDebugValue;
rc.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = Hw(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = Ww(
    function() {
      function l(p) {
        if (!c) {
          if (c = !0, d = p, p = r(p), o !== void 0 && s.hasValue) {
            var g = s.value;
            if (o(g, p))
              return f = g;
          }
          return f = p;
        }
        if (g = f, Dw(d, p)) return g;
        var b = r(p);
        return o !== void 0 && o(g, b) ? (d = p, g) : (d = p, f = b);
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
  var a = Rw(e, i[0], i[1]);
  return Bw(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), Vw(a), a;
};
nc.exports = rc;
var Fw = nc.exports;
const jw = /* @__PURE__ */ ka(Fw), Yw = {}, Ps = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, f) => {
    const u = typeof d == "function" ? d(t) : d;
    if (!Object.is(u, t)) {
      const p = t;
      t = f ?? (typeof u != "object" || u === null) ? u : Object.assign({}, t, u), n.forEach((g) => g(t, p));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (Yw ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, Gw = (e) => e ? Ps(e) : Ps, { useDebugValue: Xw } = si, { useSyncExternalStoreWithSelector: Uw } = jw, qw = (e) => e;
function sc(e, t = qw, n) {
  const r = Uw(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Xw(r), r;
}
const Ds = (e, t) => {
  const n = Gw(e), r = (o, i = t) => sc(n, o, i);
  return Object.assign(r, n), r;
}, Kw = (e, t) => e ? Ds(e, t) : Ds;
function he(e, t) {
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
const Wr = Cr(null), Zw = Wr.Provider, ac = Ve.error001("react");
function se(e, t) {
  const n = Vt(Wr);
  if (n === null)
    throw new Error(ac);
  return sc(n, e, t);
}
function ue() {
  const e = Vt(Wr);
  if (e === null)
    throw new Error(ac);
  return le(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const Rs = { display: "none" }, Qw = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, lc = "react-flow__node-desc", cc = "react-flow__edge-desc", Jw = "react-flow__aria-live", eb = (e) => e.ariaLiveMessage, tb = (e) => e.ariaLabelConfig;
function nb({ rfId: e }) {
  const t = se(eb);
  return h("div", { id: `${Jw}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Qw, children: t });
}
function rb({ rfId: e, disableKeyboardA11y: t }) {
  const n = se(tb);
  return A(we, { children: [h("div", { id: `${lc}-${e}`, style: Rs, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), h("div", { id: `${cc}-${e}`, style: Rs, children: n["edge.a11yDescription.default"] }), !t && h(nb, { rfId: e })] });
}
const Nt = va(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return h("div", { className: ye(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
Nt.displayName = "Panel";
const Hs = "https://reactflow.dev?utm_source=attribution";
function ob({ proOptions: e, position: t = "bottom-right" }) {
  return ce(() => {
  }, []), e != null && e.hideAttribution ? null : h(Nt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${Hs}`, children: h("a", { href: Hs, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const ib = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, er = (e) => e.id;
function sb(e, t) {
  return he(e.selectedNodes.map(er), t.selectedNodes.map(er)) && he(e.selectedEdges.map(er), t.selectedEdges.map(er));
}
function ab({ onSelectionChange: e }) {
  const t = ue(), { selectedNodes: n, selectedEdges: r } = se(ib, sb);
  return ce(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const lb = (e) => !!e.onSelectionChangeHandlers;
function cb({ onSelectionChange: e }) {
  const t = se(lb);
  return e || t ? h(ab, { onSelectionChange: e }) : null;
}
const dc = [0, 0], db = { x: 0, y: 0, zoom: 1 }, ub = [
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
], Bs = [...ub, "rfId"], fb = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), Ws = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: un,
  nodeOrigin: dc,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function hb(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = se(fb, he), c = ue();
  ce(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = Ws, a();
  }), []);
  const d = oe(Ws);
  return ce(
    () => {
      for (const f of Bs) {
        const u = e[f], p = d.current[f];
        u !== p && (typeof e[f] > "u" || (f === "nodes" ? t(u) : f === "edges" ? n(u) : f === "minZoom" ? r(u) : f === "maxZoom" ? o(u) : f === "translateExtent" ? i(u) : f === "nodeExtent" ? s(u) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: Dy(u) }) : f === "fitView" ? c.setState({ fitViewQueued: u }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: u }) : c.setState({ [f]: u })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    Bs.map((f) => e[f])
  ), null;
}
function Vs() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function pb(e) {
  var r;
  const [t, n] = re(e === "system" ? null : e);
  return ce(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Vs(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = Vs()) != null && r.matches ? "dark" : "light";
}
const Fs = typeof document < "u" ? document : null;
function gn(e = null, t = { target: Fs, actInsideInputWithModifier: !0 }) {
  const [n, r] = re(!1), o = oe(!1), i = oe(/* @__PURE__ */ new Set([])), [s, a] = le(() => {
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
  return ce(() => {
    const l = (t == null ? void 0 : t.target) ?? Fs, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (p) => {
        var v, y;
        if (o.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!o.current || o.current && !c) && Hl(p))
          return !1;
        const b = Ys(p.code, a);
        if (i.current.add(p[b]), js(s, i.current, !1)) {
          const _ = ((y = (v = p.composedPath) == null ? void 0 : v.call(p)) == null ? void 0 : y[0]) || p.target, m = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !m) && p.preventDefault(), r(!0);
        }
      }, f = (p) => {
        const g = Ys(p.code, a);
        js(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(p[g]), p.key === "Meta" && i.current.clear(), o.current = !1;
      }, u = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", u), window.addEventListener("contextmenu", u), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", u), window.removeEventListener("contextmenu", u);
      };
    }
  }, [e, r]), n;
}
function js(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function Ys(e, t) {
  return t.includes(e) ? "code" : "key";
}
const gb = () => {
  const e = ue();
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = Rr(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      return Nn(c, r, f, d);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = Ht(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function uc(e, t) {
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
      mb(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function mb(e, t) {
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
function yb(e, t) {
  return uc(e, t);
}
function wb(e, t) {
  return uc(e, t);
}
function yt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function At(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(yt(i.id, s)));
  }
  return r;
}
function Gs({ items: e = [], lookup: t }) {
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
function Xs(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const bb = zl();
function vb(e, t, n = {}) {
  return Fy(e, t, {
    ...n,
    onError: n.onError ?? bb
  });
}
const Us = (e) => My(e), xb = (e) => Il(e);
function fc(e) {
  return va(e);
}
const hc = typeof window < "u" ? ai : ce;
function qs(e) {
  const [t, n] = re(BigInt(0)), [r] = re(() => _b(() => n((o) => o + BigInt(1))));
  return hc(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function _b(e) {
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
const pc = Cr(null);
function kb({ children: e }) {
  const t = ue(), n = Le((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: f, nodeLookup: u, fitViewQueued: p, onNodesChangeMiddlewareMap: g } = t.getState();
    let b = l;
    for (const y of a)
      b = typeof y == "function" ? y(b) : y;
    let v = Gs({
      items: b,
      lookup: u
    });
    for (const y of g.values())
      v = y(v);
    d && c(b), v.length > 0 ? f == null || f(v) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: y, nodes: _, setNodes: m } = t.getState();
      y && m(_);
    });
  }, []), r = qs(n), o = Le((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: f, edgeLookup: u } = t.getState();
    let p = l;
    for (const g of a)
      p = typeof g == "function" ? g(p) : g;
    d ? c(p) : f && f(Gs({
      items: p,
      lookup: u
    }));
  }, []), i = qs(o), s = le(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return h(pc.Provider, { value: s, children: e });
}
function Eb() {
  const e = Vt(pc);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Sb = (e) => !!e.panZoom;
function Vr() {
  const e = gb(), t = ue(), n = Eb(), r = se(Sb), o = le(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var y, _;
      const { nodeLookup: u, nodeOrigin: p } = t.getState(), g = Us(f) ? f : u.get(f.id), b = g.parentId ? Pl(g.position, g.measured, g.parentId, u, p) : g.position, v = {
        ...g,
        position: b,
        width: ((y = g.measured) == null ? void 0 : y.width) ?? g.width,
        height: ((_ = g.measured) == null ? void 0 : _.height) ?? g.height
      };
      return hn(v);
    }, c = (f, u, p = { replace: !1 }) => {
      s((g) => g.map((b) => {
        if (b.id === f) {
          const v = typeof u == "function" ? u(b) : u;
          return p.replace && Us(v) ? v : { ...b, ...v };
        }
        return b;
      }));
    }, d = (f, u, p = { replace: !1 }) => {
      a((g) => g.map((b) => {
        if (b.id === f) {
          const v = typeof u == "function" ? u(b) : u;
          return p.replace && xb(v) ? v : { ...b, ...v };
        }
        return b;
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
        n.nodeQueue.push((p) => [...p, ...u]);
      },
      addEdges: (f) => {
        const u = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((p) => [...p, ...u]);
      },
      toObject: () => {
        const { nodes: f = [], edges: u = [], transform: p } = t.getState(), [g, b, v] = p;
        return {
          nodes: f.map((y) => ({ ...y })),
          edges: u.map((y) => ({ ...y })),
          viewport: {
            x: g,
            y: b,
            zoom: v
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: u = [] }) => {
        const { nodes: p, edges: g, onNodesDelete: b, onEdgesDelete: v, triggerNodeChanges: y, triggerEdgeChanges: _, onDelete: m, onBeforeDelete: w } = t.getState(), { nodes: S, edges: k } = await Ly({
          nodesToRemove: f,
          edgesToRemove: u,
          nodes: p,
          edges: g,
          onBeforeDelete: w
        }), E = k.length > 0, L = S.length > 0;
        if (E) {
          const $ = k.map(Xs);
          v == null || v(k), _($);
        }
        if (L) {
          const $ = S.map(Xs);
          b == null || b(S), y($);
        }
        return (L || E) && (m == null || m({ nodes: S, edges: k })), { deletedNodes: S, deletedEdges: k };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, u = !0, p) => {
        const g = ks(f), b = g ? f : l(f), v = p !== void 0;
        return b ? (p || t.getState().nodes).filter((y) => {
          const _ = t.getState().nodeLookup.get(y.id);
          if (_ && !g && (y.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const m = hn(v ? y : _), w = kr(m, b);
          return u && w > 0 || w >= m.width * m.height || w >= b.width * b.height;
        }) : [];
      },
      isNodeIntersecting: (f, u, p = !0) => {
        const b = ks(f) ? f : l(f);
        if (!b)
          return !1;
        const v = kr(b, u);
        return p && v > 0 || v >= u.width * u.height || v >= b.width * b.height;
      },
      updateNode: c,
      updateNodeData: (f, u, p = { replace: !1 }) => {
        c(f, (g) => {
          const b = typeof u == "function" ? u(g) : u;
          return p.replace ? { ...g, data: b } : { ...g, data: { ...g.data, ...b } };
        }, p);
      },
      updateEdge: d,
      updateEdgeData: (f, u, p = { replace: !1 }) => {
        d(f, (g) => {
          const b = typeof u == "function" ? u(g) : u;
          return p.replace ? { ...g, data: b } : { ...g, data: { ...g.data, ...b } };
        }, p);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: u, nodeOrigin: p } = t.getState();
        return Iy(f, { nodeLookup: u, nodeOrigin: p });
      },
      getHandleConnections: ({ type: f, id: u, nodeId: p }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${p}-${f}${u ? `-${u}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      getNodeConnections: ({ type: f, handleId: u, nodeId: p }) => {
        var g;
        return Array.from(((g = t.getState().connectionLookup.get(`${p}${f ? u ? `-${f}-${u}` : `-${f}` : ""}`)) == null ? void 0 : g.values()) ?? []);
      },
      fitView: async (f) => {
        const u = t.getState().fitViewResolver ?? Py();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: u }), n.nodeQueue.push((p) => [...p]), u.promise;
      }
    };
  }, []);
  return le(() => ({
    ...o,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const Ks = (e) => e.selected, Nb = typeof window < "u" ? window : void 0;
function Cb({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = ue(), { deleteElements: r } = Vr(), o = gn(e, { actInsideInputWithModifier: !1 }), i = gn(t, { target: Nb });
  ce(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(Ks), edges: s.filter(Ks) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), ce(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Mb(e) {
  const t = ue();
  ce(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = _i(e.current);
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
const Fr = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Ib = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function $b({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = vt.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: f, maxZoom: u, zoomActivationKeyCode: p, preventScrolling: g = !0, children: b, noWheelClassName: v, noPanClassName: y, onViewportChange: _, isControlledViewport: m, paneClickDistance: w, selectionOnDrag: S }) {
  const k = ue(), E = oe(null), { userSelectionActive: L, lib: $, connectionInProgress: B } = se(Ib, he), O = gn(p), W = oe();
  Mb(E);
  const H = Le((x) => {
    _ == null || _({ x: x[0], y: x[1], zoom: x[2] }), m || k.setState({ transform: x });
  }, [_, m]);
  return ce(() => {
    if (E.current) {
      W.current = bw({
        domNode: E.current,
        minZoom: f,
        maxZoom: u,
        translateExtent: d,
        viewport: c,
        onDraggingChange: (I) => k.setState((z) => z.paneDragging === I ? z : { paneDragging: I }),
        onPanZoomStart: (I, z) => {
          const { onViewportChangeStart: M, onMoveStart: T } = k.getState();
          T == null || T(I, z), M == null || M(z);
        },
        onPanZoom: (I, z) => {
          const { onViewportChange: M, onMove: T } = k.getState();
          T == null || T(I, z), M == null || M(z);
        },
        onPanZoomEnd: (I, z) => {
          const { onViewportChangeEnd: M, onMoveEnd: T } = k.getState();
          T == null || T(I, z), M == null || M(z);
        }
      });
      const { x, y: C, zoom: N } = W.current.getViewport();
      return k.setState({
        panZoom: W.current,
        transform: [x, C, N],
        domNode: E.current.closest(".react-flow")
      }), () => {
        var I;
        (I = W.current) == null || I.destroy();
      };
    }
  }, []), ce(() => {
    var x;
    (x = W.current) == null || x.update({
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
      noPanClassName: y,
      userSelectionActive: L,
      noWheelClassName: v,
      lib: $,
      onTransformChange: H,
      connectionInProgress: B,
      selectionOnDrag: S,
      paneClickDistance: w
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
    y,
    L,
    v,
    $,
    H,
    B,
    S,
    w
  ]), h("div", { className: "react-flow__renderer", ref: E, style: Fr, children: b });
}
const Ab = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Tb() {
  const { userSelectionActive: e, userSelectionRect: t } = se(Ab, he);
  return e && t ? h("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Ao = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Lb = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function zb({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = fn.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: f, onPaneMouseEnter: u, onPaneMouseMove: p, onPaneMouseLeave: g, children: b }) {
  const v = oe(0), y = ue(), { userSelectionActive: _, elementsSelectable: m, dragging: w, panBy: S, autoPanSpeed: k } = se(Lb, he), E = m && (e || _), L = oe(null), $ = oe(), B = oe(/* @__PURE__ */ new Set()), O = oe(/* @__PURE__ */ new Set()), W = oe(!1), H = oe(!1), x = oe({ x: 0, y: 0 }), C = oe(!1), N = (D) => {
    if (H.current || W.current || y.getState().connection.inProgress) {
      H.current = !1, W.current = !1;
      return;
    }
    c == null || c(D), y.getState().resetSelectedElements(), y.setState({ nodesSelectionActive: !1 });
  }, I = (D) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      D.preventDefault();
      return;
    }
    d == null || d(D);
  }, z = f ? (D) => f(D) : void 0, M = (D) => {
    H.current && (D.stopPropagation(), H.current = !1);
  }, T = (D) => {
    var ae, _e;
    if (D.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: F, transform: Z } = y.getState();
    if ($.current = F == null ? void 0 : F.getBoundingClientRect(), !$.current)
      return;
    const Q = D.target === L.current;
    if (!Q && !!D.target.closest(".nokey") || !e || !(s && Q || t) || D.button !== 0 || !D.isPrimary)
      return;
    (_e = (ae = D.target) == null ? void 0 : ae.setPointerCapture) == null || _e.call(ae, D.pointerId), H.current = !1;
    const { x: te, y: ne } = We(D.nativeEvent, $.current), ie = Nn({ x: te, y: ne }, Z);
    y.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ie.x,
        startY: ie.y,
        x: te,
        y: ne
      }
    }), Q || (D.stopPropagation(), D.preventDefault());
  };
  function P(D, F) {
    const { userSelectionRect: Z } = y.getState();
    if (!Z)
      return;
    const { transform: Q, nodeLookup: q, edgeLookup: J, connectionLookup: te, triggerNodeChanges: ne, triggerEdgeChanges: ie, defaultEdgeOptions: ae } = y.getState(), _e = { x: Z.startX, y: Z.startY }, { x: Ae, y: ve } = Ht(_e, Q), Oe = {
      startX: _e.x,
      startY: _e.y,
      x: D < Ae ? D : Ae,
      y: F < ve ? F : ve,
      width: Math.abs(D - Ae),
      height: Math.abs(F - ve)
    }, Ze = B.current, Pe = O.current;
    B.current = new Set(vi(q, Oe, Q, n === fn.Partial, !0).map((ke) => ke.id)), O.current = /* @__PURE__ */ new Set();
    const Qe = (ae == null ? void 0 : ae.selectable) ?? !0;
    for (const ke of B.current) {
      const Se = te.get(ke);
      if (Se)
        for (const { edgeId: Ne } of Se.values()) {
          const Je = J.get(Ne);
          Je && (Je.selectable ?? Qe) && O.current.add(Ne);
        }
    }
    if (!Es(Ze, B.current)) {
      const ke = At(q, B.current, !0);
      ne(ke);
    }
    if (!Es(Pe, O.current)) {
      const ke = At(J, O.current);
      ie(ke);
    }
    y.setState({
      userSelectionRect: Oe,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function R() {
    if (!o || !$.current)
      return;
    const [D, F] = xi(x.current, $.current, k);
    S({ x: D, y: F }).then((Z) => {
      if (!H.current || !Z) {
        v.current = requestAnimationFrame(R);
        return;
      }
      const { x: Q, y: q } = x.current;
      P(Q, q), v.current = requestAnimationFrame(R);
    });
  }
  const Y = () => {
    cancelAnimationFrame(v.current), v.current = 0, C.current = !1;
  };
  ce(() => () => Y(), []);
  const j = (D) => {
    const { userSelectionRect: F, transform: Z, resetSelectedElements: Q } = y.getState();
    if (!$.current || !F)
      return;
    const { x: q, y: J } = We(D.nativeEvent, $.current);
    x.current = { x: q, y: J };
    const te = Ht({ x: F.startX, y: F.startY }, Z);
    if (!H.current) {
      const ne = t ? 0 : i;
      if (Math.hypot(q - te.x, J - te.y) <= ne)
        return;
      Q(), a == null || a(D);
    }
    H.current = !0, C.current || (R(), C.current = !0), P(q, J);
  }, U = (D) => {
    var F, Z;
    if (!E) {
      D.target === L.current && y.getState().connection.inProgress && (W.current = !0);
      return;
    }
    D.button === 0 && ((Z = (F = D.target) == null ? void 0 : F.releasePointerCapture) == null || Z.call(F, D.pointerId), !_ && D.target === L.current && y.getState().userSelectionRect && (N == null || N(D)), y.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), H.current && (l == null || l(D), y.setState({
      nodesSelectionActive: B.current.size > 0
    })), Y());
  }, ee = (D) => {
    var F, Z;
    (Z = (F = D.target) == null ? void 0 : F.releasePointerCapture) == null || Z.call(F, D.pointerId), Y();
  }, G = r === !0 || Array.isArray(r) && r.includes(0);
  return A("div", { className: ye(["react-flow__pane", { draggable: G, dragging: w, selection: e }]), onClick: E ? void 0 : Ao(N, L), onContextMenu: Ao(I, L), onWheel: Ao(z, L), onPointerEnter: E ? void 0 : u, onPointerMove: E ? j : p, onPointerUp: U, onPointerCancel: E ? ee : void 0, onPointerDownCapture: E ? T : void 0, onClickCapture: E ? M : void 0, onPointerLeave: g, ref: L, style: Fr, children: [b, h(Tb, {})] });
}
function Jo({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
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
function gc({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = ue(), [l, c] = re(!1), d = oe();
  return ce(() => {
    if (!t)
      return d.current = iw({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          Jo({
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
  }, [t, a, e]), ce(() => {
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
const Ob = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function mc() {
  const e = ue();
  return Le((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), f = /* @__PURE__ */ new Map(), u = Ob(s), p = o ? i[0] : 5, g = o ? i[1] : 5, b = n.direction.x * p * n.factor, v = n.direction.y * g * n.factor;
    for (const [, y] of c) {
      if (!u(y))
        continue;
      let _ = {
        x: y.internals.positionAbsolute.x + b,
        y: y.internals.positionAbsolute.y + v
      };
      o && (_ = Sn(_, i));
      const { position: m, positionAbsolute: w } = $l({
        nodeId: y.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: d,
        onError: a
      });
      y.position = m, y.internals.positionAbsolute = w, f.set(y.id, y);
    }
    l(f);
  }, []);
}
const Mi = Cr(null), Pb = Mi.Provider;
Mi.Consumer;
const yc = () => Vt(Mi), Db = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), wc = Cr(null);
function Rb({ children: e }) {
  const t = se(Db, he);
  return h(wc.Provider, { value: t, children: e });
}
function Hb() {
  const e = Vt(wc);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Bb = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, Wb = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Bb;
  const d = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: d,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === Pt.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: d && c
  };
};
function Vb({ type: e = "source", position: t = X.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: f, ...u }, p) {
  var C, N;
  const g = s || null, b = e === "target", v = ue(), y = yc(), { connectOnClick: _, noPanClassName: m, rfId: w } = Hb(), { connectingFrom: S, connectingTo: k, clickConnecting: E, isPossibleEndHandle: L, connectionInProcess: $, clickConnectionInProcess: B, valid: O } = se(Wb(y, g, e), he);
  y || (N = (C = v.getState()).onError) == null || N.call(C, "010", Ve.error010());
  const W = (I) => {
    const { defaultEdgeOptions: z, onConnect: M, hasDefaultEdges: T } = v.getState(), P = {
      ...z,
      ...I
    };
    if (T) {
      const { edges: R, setEdges: Y, onError: j } = v.getState();
      Y(vb(P, R, { onError: j }));
    }
    M == null || M(P), a == null || a(P);
  }, H = (I) => {
    if (!y)
      return;
    const z = Bl(I.nativeEvent);
    if (o && (z && I.button === 0 || !z)) {
      const M = v.getState();
      Qo.onPointerDown(I.nativeEvent, {
        handleDomNode: I.currentTarget,
        autoPanOnConnect: M.autoPanOnConnect,
        connectionMode: M.connectionMode,
        connectionRadius: M.connectionRadius,
        domNode: M.domNode,
        nodeLookup: M.nodeLookup,
        lib: M.lib,
        isTarget: b,
        handleId: g,
        nodeId: y,
        flowId: M.rfId,
        panBy: M.panBy,
        cancelConnection: M.cancelConnection,
        onConnectStart: M.onConnectStart,
        onConnectEnd: (...T) => {
          var P, R;
          return (R = (P = v.getState()).onConnectEnd) == null ? void 0 : R.call(P, ...T);
        },
        updateConnection: M.updateConnection,
        onConnect: W,
        isValidConnection: n || ((...T) => {
          var P, R;
          return ((R = (P = v.getState()).isValidConnection) == null ? void 0 : R.call(P, ...T)) ?? !0;
        }),
        getTransform: () => v.getState().transform,
        getFromHandle: () => v.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    z ? d == null || d(I) : f == null || f(I);
  }, x = (I) => {
    const { onClickConnectStart: z, onClickConnectEnd: M, connectionClickStartHandle: T, connectionMode: P, isValidConnection: R, lib: Y, rfId: j, nodeLookup: U, connection: ee } = v.getState();
    if (!y || !T && !o)
      return;
    if (!T) {
      z == null || z(I.nativeEvent, { nodeId: y, handleId: g, handleType: e }), v.setState({ connectionClickStartHandle: { nodeId: y, type: e, id: g } });
      return;
    }
    const G = Rl(I.target), D = n || R, { connection: F, isValid: Z } = Qo.isValid(I.nativeEvent, {
      handle: {
        nodeId: y,
        id: g,
        type: e
      },
      connectionMode: P,
      fromNodeId: T.nodeId,
      fromHandleId: T.id || null,
      fromType: T.type,
      isValidConnection: D,
      flowId: j,
      doc: G,
      lib: Y,
      nodeLookup: U
    });
    Z && F && W(F);
    const Q = structuredClone(ee);
    delete Q.inProgress, Q.toPosition = Q.toHandle ? Q.toHandle.position : null, M == null || M(I, Q), v.setState({ connectionClickStartHandle: null });
  };
  return h("div", { "data-handleid": g, "data-nodeid": y, "data-handlepos": t, "data-id": `${w}-${y}-${g}-${e}`, className: ye([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    m,
    c,
    {
      source: !b,
      target: b,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: E,
      connectingfrom: S,
      connectingto: k,
      valid: O,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!$ || L) && ($ || B ? i : o)
    }
  ]), onMouseDown: H, onTouchStart: H, onClick: _ ? x : void 0, ref: p, ...u, children: l });
}
const pt = pe(fc(Vb));
function Fb({ data: e, isConnectable: t, sourcePosition: n = X.Bottom }) {
  return A(we, { children: [e == null ? void 0 : e.label, h(pt, { type: "source", position: n, isConnectable: t })] });
}
function jb({ data: e, isConnectable: t, targetPosition: n = X.Top, sourcePosition: r = X.Bottom }) {
  return A(we, { children: [h(pt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, h(pt, { type: "source", position: r, isConnectable: t })] });
}
function Yb() {
  return null;
}
function Gb({ data: e, isConnectable: t, targetPosition: n = X.Top }) {
  return A(we, { children: [h(pt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Er = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Zs = {
  input: Fb,
  default: jb,
  output: Gb,
  group: Yb
};
function Xb(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const Ub = (e) => {
  const { width: t, height: n, x: r, y: o } = En(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: Be(t) ? t : null,
    height: Be(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function qb({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = ue(), { width: o, height: i, transformString: s, userSelectionActive: a } = se(Ub, he), l = mc(), c = oe(null);
  ce(() => {
    var p;
    n || (p = c.current) == null || p.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (gc({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const f = e ? (p) => {
    const g = r.getState().nodes.filter((b) => b.selected);
    e(p, g);
  } : void 0, u = (p) => {
    Object.prototype.hasOwnProperty.call(Er, p.key) && (p.preventDefault(), l({
      direction: Er[p.key],
      factor: p.shiftKey ? 4 : 1
    }));
  };
  return h("div", { className: ye(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: h("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : u, style: {
    width: o,
    height: i
  } }) });
}
const Qs = typeof window < "u" ? window : void 0, Kb = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function bc({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: f, onSelectionStart: u, onSelectionEnd: p, multiSelectionKeyCode: g, panActivationKeyCode: b, zoomActivationKeyCode: v, elementsSelectable: y, zoomOnScroll: _, zoomOnPinch: m, panOnScroll: w, panOnScrollSpeed: S, panOnScrollMode: k, zoomOnDoubleClick: E, panOnDrag: L, autoPanOnSelection: $, defaultViewport: B, translateExtent: O, minZoom: W, maxZoom: H, preventScrolling: x, onSelectionContextMenu: C, noWheelClassName: N, noPanClassName: I, disableKeyboardA11y: z, onViewportChange: M, isControlledViewport: T }) {
  const { nodesSelectionActive: P, userSelectionActive: R } = se(Kb, he), Y = gn(c, { target: Qs }), j = gn(b, { target: Qs }), U = j || L, ee = j || w, G = d && U !== !0, D = Y || R || G;
  return Cb({ deleteKeyCode: l, multiSelectionKeyCode: g }), h($b, { onPaneContextMenu: i, elementsSelectable: y, zoomOnScroll: _, zoomOnPinch: m, panOnScroll: ee, panActivationKeyPressed: j, panOnScrollSpeed: S, panOnScrollMode: k, zoomOnDoubleClick: E, panOnDrag: !Y && U, defaultViewport: B, translateExtent: O, minZoom: W, maxZoom: H, zoomActivationKeyCode: v, preventScrolling: x, noWheelClassName: N, noPanClassName: I, onViewportChange: M, isControlledViewport: T, paneClickDistance: a, selectionOnDrag: G, children: A(zb, { onSelectionStart: u, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: U, autoPanOnSelection: $, isSelecting: !!D, selectionMode: f, selectionKeyPressed: Y, paneClickDistance: a, selectionOnDrag: G, children: [e, P && h(qb, { onSelectionContextMenu: C, noPanClassName: I, disableKeyboardA11y: z })] }) });
}
bc.displayName = "FlowRenderer";
const Zb = pe(bc), Qb = (e) => (t) => e ? vi(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Jb(e) {
  return se(Le(Qb(e), [e]), he);
}
const ev = (e) => e.updateNodeInternals;
function tv() {
  const e = se(ev), [t] = re(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
  return ce(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function nv({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = ue(), i = oe(null), s = oe(null), a = oe(e.sourcePosition), l = oe(e.targetPosition), c = oe(t), d = n && !!e.internals.handleBounds;
  return ce(() => {
    i.current && !e.hidden && (!d || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [d, e.hidden]), ce(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), ce(() => {
    if (i.current) {
      const f = c.current !== t, u = a.current !== e.sourcePosition, p = l.current !== e.targetPosition;
      (f || u || p) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function rv({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: f, noDragClassName: u, noPanClassName: p, disableKeyboardA11y: g, rfId: b, nodeTypes: v, nodeClickDistance: y, onError: _ }) {
  const { node: m, internals: w, isParent: S } = se((D) => {
    const F = D.nodeLookup.get(e), Z = D.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: Z
    };
  }, he);
  let k = m.type || "default", E = (v == null ? void 0 : v[k]) || Zs[k];
  E === void 0 && (_ == null || _("003", Ve.error003(k)), k = "default", E = (v == null ? void 0 : v.default) || Zs.default);
  const L = !!(m.draggable || a && typeof m.draggable > "u"), $ = !!(m.selectable || l && typeof m.selectable > "u"), B = !!(m.connectable || c && typeof m.connectable > "u"), O = !!(m.focusable || d && typeof m.focusable > "u"), W = ue(), H = Ol(m), x = nv({ node: m, nodeType: k, hasDimensions: H, resizeObserver: f }), C = gc({
    nodeRef: x,
    disabled: m.hidden || !L,
    noDragClassName: u,
    handleSelector: m.dragHandle,
    nodeId: e,
    isSelectable: $,
    nodeClickDistance: y
  }), N = mc();
  if (m.hidden)
    return null;
  const I = Ge(m), z = Xb(m), M = $ || L || t || n || r || o, T = n ? (D) => n(D, { ...w.userNode }) : void 0, P = r ? (D) => r(D, { ...w.userNode }) : void 0, R = o ? (D) => o(D, { ...w.userNode }) : void 0, Y = i ? (D) => i(D, { ...w.userNode }) : void 0, j = s ? (D) => s(D, { ...w.userNode }) : void 0, U = (D) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: Z } = W.getState();
    $ && (!F || !L || Z > 0) && Jo({
      id: e,
      store: W,
      nodeRef: x
    }), t && t(D, { ...w.userNode });
  }, ee = (D) => {
    if (!(Hl(D.nativeEvent) || g)) {
      if (Nl.includes(D.key) && $) {
        const F = D.key === "Escape";
        Jo({
          id: e,
          store: W,
          unselect: F,
          nodeRef: x
        });
      } else if (L && m.selected && Object.prototype.hasOwnProperty.call(Er, D.key)) {
        D.preventDefault();
        const { ariaLabelConfig: F } = W.getState();
        W.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: D.key.replace("Arrow", "").toLowerCase(),
            x: ~~w.positionAbsolute.x,
            y: ~~w.positionAbsolute.y
          })
        }), N({
          direction: Er[D.key],
          factor: D.shiftKey ? 4 : 1
        });
      }
    }
  }, G = () => {
    var te;
    if (g || !((te = x.current) != null && te.matches(":focus-visible")))
      return;
    const { transform: D, width: F, height: Z, autoPanOnNodeFocus: Q, setCenter: q } = W.getState();
    if (!Q)
      return;
    vi(/* @__PURE__ */ new Map([[e, m]]), { x: 0, y: 0, width: F, height: Z }, D, !0).length > 0 || q(m.position.x + I.width / 2, m.position.y + I.height / 2, {
      zoom: D[2]
    });
  };
  return h("div", { className: ye([
    "react-flow__node",
    `react-flow__node-${k}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [p]: L
    },
    m.className,
    {
      selected: m.selected,
      selectable: $,
      parent: S,
      draggable: L,
      dragging: C
    }
  ]), ref: x, style: {
    zIndex: w.z,
    transform: `translate(${w.positionAbsolute.x}px,${w.positionAbsolute.y}px)`,
    pointerEvents: M ? "all" : "none",
    visibility: H ? "visible" : "hidden",
    ...m.style,
    ...z
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: T, onMouseMove: P, onMouseLeave: R, onContextMenu: Y, onClick: U, onDoubleClick: j, onKeyDown: O ? ee : void 0, tabIndex: O ? 0 : void 0, onFocus: O ? G : void 0, role: m.ariaRole ?? (O ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${lc}-${b}`, "aria-label": m.ariaLabel, ...m.domAttributes, children: h(Pb, { value: e, children: h(E, { id: e, data: m.data, type: k, positionAbsoluteX: w.positionAbsolute.x, positionAbsoluteY: w.positionAbsolute.y, selected: m.selected ?? !1, selectable: $, draggable: L, deletable: m.deletable ?? !0, isConnectable: B, sourcePosition: m.sourcePosition, targetPosition: m.targetPosition, dragging: C, dragHandle: m.dragHandle, zIndex: w.z, parentId: m.parentId, ...I }) }) });
}
var ov = pe(rv);
const iv = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function vc(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = se(iv, he), i = Jb(e.onlyRenderVisibleElements), s = tv();
  return h("div", { className: "react-flow__nodes", style: Fr, children: i.map((a) => (
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
    h(ov, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
vc.displayName = "NodeRenderer";
const sv = pe(vc);
function av(e) {
  return se(Le((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && By({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(o.id);
      }
    return r;
  }, [e]), he);
}
const lv = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return h("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, cv = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return h("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Js = {
  [Dt.Arrow]: lv,
  [Dt.ArrowClosed]: cv
};
function dv(e) {
  const t = ue();
  return le(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(Js, e) ? Js[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Ve.error009(e)), null);
  }, [e]);
}
const uv = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = dv(t);
  return l ? h("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: h(l, { color: n, strokeWidth: s }) }) : null;
}, xc = ({ defaultColor: e, rfId: t }) => {
  const n = se((i) => i.edges), r = se((i) => i.defaultEdgeOptions), o = le(() => Uy(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? h("svg", { className: "react-flow__marker", "aria-hidden": "true", children: h("defs", { children: o.map((i) => h(uv, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
xc.displayName = "MarkerDefinitions";
var fv = pe(xc);
function _c({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [f, u] = re({ x: 1, y: 0, width: 0, height: 0 }), p = ye(["react-flow__edge-textwrapper", c]), g = oe(null);
  return ce(() => {
    if (g.current) {
      const b = g.current.getBBox();
      u({
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height
      });
    }
  }, [n]), n ? A("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: p, visibility: f.width ? "visible" : "hidden", ...d, children: [o && h("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), h("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
_c.displayName = "EdgeText";
const hv = pe(_c);
function jr({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return A(we, { children: [h("path", { ...d, d: e, fill: "none", className: ye(["react-flow__edge-path", d.className]) }), c ? h("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && Be(t) && Be(n) ? h(hv, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function ea({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === X.Left || e === X.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function kc({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: o, targetPosition: i = X.Top }) {
  const [s, a] = ea({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = ea({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, f, u, p] = Wl({
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
    p
  ];
}
function Ec(e) {
  return pe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, interactionWidth: y }) => {
    const [_, m, w] = kc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), S = e.isInternal ? void 0 : t;
    return h(jr, { id: S, path: _, labelX: m, labelY: w, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, interactionWidth: y });
  });
}
const pv = Ec({ isInternal: !1 }), Sc = Ec({ isInternal: !0 });
pv.displayName = "SimpleBezierEdge";
Sc.displayName = "SimpleBezierEdgeInternal";
function Nc(e) {
  return pe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, sourcePosition: p = X.Bottom, targetPosition: g = X.Top, markerEnd: b, markerStart: v, pathOptions: y, interactionWidth: _ }) => {
    const [m, w, S] = qo({
      sourceX: n,
      sourceY: r,
      sourcePosition: p,
      targetX: o,
      targetY: i,
      targetPosition: g,
      borderRadius: y == null ? void 0 : y.borderRadius,
      offset: y == null ? void 0 : y.offset,
      stepPosition: y == null ? void 0 : y.stepPosition
    }), k = e.isInternal ? void 0 : t;
    return h(jr, { id: k, path: m, labelX: w, labelY: S, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: b, markerStart: v, interactionWidth: _ });
  });
}
const Cc = Nc({ isInternal: !1 }), Mc = Nc({ isInternal: !0 });
Cc.displayName = "SmoothStepEdge";
Mc.displayName = "SmoothStepEdgeInternal";
function Ic(e) {
  return pe(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return h(Cc, { ...n, id: r, pathOptions: le(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const gv = Ic({ isInternal: !1 }), $c = Ic({ isInternal: !0 });
gv.displayName = "StepEdge";
$c.displayName = "StepEdgeInternal";
function Ac(e) {
  return pe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: p, markerStart: g, interactionWidth: b }) => {
    const [v, y, _] = jl({ sourceX: n, sourceY: r, targetX: o, targetY: i }), m = e.isInternal ? void 0 : t;
    return h(jr, { id: m, path: v, labelX: y, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: p, markerStart: g, interactionWidth: b });
  });
}
const mv = Ac({ isInternal: !1 }), Tc = Ac({ isInternal: !0 });
mv.displayName = "StraightEdge";
Tc.displayName = "StraightEdgeInternal";
function Lc(e) {
  return pe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = X.Bottom, targetPosition: a = X.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, pathOptions: y, interactionWidth: _ }) => {
    const [m, w, S] = Vl({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: y == null ? void 0 : y.curvature
    }), k = e.isInternal ? void 0 : t;
    return h(jr, { id: k, path: m, labelX: w, labelY: S, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: b, markerStart: v, interactionWidth: _ });
  });
}
const yv = Lc({ isInternal: !1 }), zc = Lc({ isInternal: !0 });
yv.displayName = "BezierEdge";
zc.displayName = "BezierEdgeInternal";
const ta = {
  default: zc,
  straight: Tc,
  step: $c,
  smoothstep: Mc,
  simplebezier: Sc
}, na = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, wv = (e, t, n) => n === X.Left ? e - t : n === X.Right ? e + t : e, bv = (e, t, n) => n === X.Top ? e - t : n === X.Bottom ? e + t : e, ra = "react-flow__edgeupdater";
function oa({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return h("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: ye([ra, `${ra}-${a}`]), cx: wv(t, r, e), cy: bv(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function vv({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: f, setReconnecting: u, setUpdateHover: p }) {
  const g = ue(), b = (w, S) => {
    if (w.button !== 0)
      return;
    const { autoPanOnConnect: k, domNode: E, connectionMode: L, connectionRadius: $, lib: B, onConnectStart: O, cancelConnection: W, nodeLookup: H, rfId: x, panBy: C, updateConnection: N } = g.getState(), I = S.type === "target", z = (P, R) => {
      u(!1), f == null || f(P, n, S.type, R);
    }, M = (P) => c == null ? void 0 : c(n, P), T = (P, R) => {
      u(!0), d == null || d(w, n, S.type), O == null || O(P, R);
    };
    Qo.onPointerDown(w.nativeEvent, {
      autoPanOnConnect: k,
      connectionMode: L,
      connectionRadius: $,
      domNode: E,
      handleId: S.id,
      nodeId: S.nodeId,
      nodeLookup: H,
      isTarget: I,
      edgeUpdaterType: S.type,
      lib: B,
      flowId: x,
      cancelConnection: W,
      panBy: C,
      isValidConnection: (...P) => {
        var R, Y;
        return ((Y = (R = g.getState()).isValidConnection) == null ? void 0 : Y.call(R, ...P)) ?? !0;
      },
      onConnect: M,
      onConnectStart: T,
      onConnectEnd: (...P) => {
        var R, Y;
        return (Y = (R = g.getState()).onConnectEnd) == null ? void 0 : Y.call(R, ...P);
      },
      onReconnectEnd: z,
      updateConnection: N,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: w.currentTarget
    });
  }, v = (w) => b(w, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), y = (w) => b(w, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => p(!0), m = () => p(!1);
  return A(we, { children: [(e === !0 || e === "source") && h(oa, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: v, onMouseEnter: _, onMouseOut: m, type: "source" }), (e === !0 || e === "target") && h(oa, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: y, onMouseEnter: _, onMouseOut: m, type: "target" })] });
}
function xv({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: f, onReconnectStart: u, onReconnectEnd: p, rfId: g, edgeTypes: b, noPanClassName: v, onError: y, disableKeyboardA11y: _ }) {
  let m = se((q) => q.edgeLookup.get(e));
  const w = se((q) => q.defaultEdgeOptions);
  m = w ? { ...w, ...m } : m;
  let S = m.type || "default", k = (b == null ? void 0 : b[S]) || ta[S];
  k === void 0 && (y == null || y("011", Ve.error011(S)), S = "default", k = (b == null ? void 0 : b.default) || ta.default);
  const E = !!(m.focusable || t && typeof m.focusable > "u"), L = typeof f < "u" && (m.reconnectable || n && typeof m.reconnectable > "u"), $ = !!(m.selectable || r && typeof m.selectable > "u"), B = oe(null), [O, W] = re(!1), [H, x] = re(!1), C = ue(), { zIndex: N = m.zIndex, sourceX: I, sourceY: z, targetX: M, targetY: T, sourcePosition: P, targetPosition: R } = se(Le((q) => {
    const J = q.nodeLookup.get(m.source), te = q.nodeLookup.get(m.target);
    if (!J || !te)
      return na;
    const ne = Xy({
      id: e,
      sourceNode: J,
      targetNode: te,
      sourceHandle: m.sourceHandle || null,
      targetHandle: m.targetHandle || null,
      connectionMode: q.connectionMode,
      onError: y
    }), ie = Hy({
      selected: m.selected,
      zIndex: m.zIndex,
      sourceNode: J,
      targetNode: te,
      elevateOnSelect: q.elevateEdgesOnSelect,
      zIndexMode: q.zIndexMode
    });
    return {
      ...ne || na,
      zIndex: ie
    };
  }, [m.source, m.target, m.sourceHandle, m.targetHandle, m.selected, m.zIndex, y]), he), Y = le(() => m.markerStart ? `url('#${Ko(m.markerStart, g)}')` : void 0, [m.markerStart, g]), j = le(() => m.markerEnd ? `url('#${Ko(m.markerEnd, g)}')` : void 0, [m.markerEnd, g]);
  if (m.hidden || I === null || z === null || M === null || T === null)
    return null;
  const U = (q) => {
    var ie;
    const { addSelectedEdges: J, unselectNodesAndEdges: te, multiSelectionActive: ne } = C.getState();
    $ && (C.setState({ nodesSelectionActive: !1 }), m.selected && ne ? (te({ nodes: [], edges: [m] }), (ie = B.current) == null || ie.blur()) : J([e])), o && o(q, m);
  }, ee = i ? (q) => {
    i(q, { ...m });
  } : void 0, G = s ? (q) => {
    s(q, { ...m });
  } : void 0, D = a ? (q) => {
    a(q, { ...m });
  } : void 0, F = l ? (q) => {
    l(q, { ...m });
  } : void 0, Z = c ? (q) => {
    c(q, { ...m });
  } : void 0, Q = (q) => {
    var J;
    if (!_ && Nl.includes(q.key) && $) {
      const { unselectNodesAndEdges: te, addSelectedEdges: ne } = C.getState();
      q.key === "Escape" ? ((J = B.current) == null || J.blur(), te({ edges: [m] })) : ne([e]);
    }
  };
  return h("svg", { style: { zIndex: N }, children: A("g", { className: ye([
    "react-flow__edge",
    `react-flow__edge-${S}`,
    m.className,
    v,
    {
      selected: m.selected,
      animated: m.animated,
      inactive: !$ && !o,
      updating: O,
      selectable: $
    }
  ]), onClick: U, onDoubleClick: ee, onContextMenu: G, onMouseEnter: D, onMouseMove: F, onMouseLeave: Z, onKeyDown: E ? Q : void 0, tabIndex: E ? 0 : void 0, role: m.ariaRole ?? (E ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": m.ariaLabel === null ? void 0 : m.ariaLabel || `Edge from ${m.source} to ${m.target}`, "aria-describedby": E ? `${cc}-${g}` : void 0, ref: B, ...m.domAttributes, children: [!H && h(k, { id: e, source: m.source, target: m.target, type: m.type, selected: m.selected, animated: m.animated, selectable: $, deletable: m.deletable ?? !0, label: m.label, labelStyle: m.labelStyle, labelShowBg: m.labelShowBg, labelBgStyle: m.labelBgStyle, labelBgPadding: m.labelBgPadding, labelBgBorderRadius: m.labelBgBorderRadius, sourceX: I, sourceY: z, targetX: M, targetY: T, sourcePosition: P, targetPosition: R, data: m.data, style: m.style, sourceHandleId: m.sourceHandle, targetHandleId: m.targetHandle, markerStart: Y, markerEnd: j, pathOptions: "pathOptions" in m ? m.pathOptions : void 0, interactionWidth: m.interactionWidth }), L && h(vv, { edge: m, isReconnectable: L, reconnectRadius: d, onReconnect: f, onReconnectStart: u, onReconnectEnd: p, sourceX: I, sourceY: z, targetX: M, targetY: T, sourcePosition: P, targetPosition: R, setUpdateHover: W, setReconnecting: x })] }) });
}
var _v = pe(xv);
const kv = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Oc({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: f, onEdgeDoubleClick: u, onReconnectStart: p, onReconnectEnd: g, disableKeyboardA11y: b }) {
  const { edgesFocusable: v, edgesReconnectable: y, elementsSelectable: _, onError: m } = se(kv, he), w = av(t);
  return A("div", { className: "react-flow__edges", children: [h(fv, { defaultColor: e, rfId: n }), w.map((S) => h(_v, { id: S, edgesFocusable: v, edgesReconnectable: y, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: f, onDoubleClick: u, onReconnectStart: p, onReconnectEnd: g, rfId: n, onError: m, edgeTypes: r, disableKeyboardA11y: b }, S))] });
}
Oc.displayName = "EdgeRenderer";
const Ev = pe(Oc), ia = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Sv({ children: e }) {
  const t = ue(), n = oe(null), [r] = re(() => t.getState().transform);
  return hc(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = ia(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), h("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: ia(r) }, children: e });
}
function Nv(e) {
  const t = Vr(), n = oe(!1);
  ce(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Cv = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Mv(e) {
  const t = se(Cv), n = ue();
  return ce(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Iv(e) {
  return e.connection.inProgress ? { ...e.connection, to: Nn(e.connection.to, e.transform) } : { ...e.connection };
}
function $v(e) {
  return Iv;
}
function Av(e) {
  const t = $v();
  return se(t, he);
}
const Tv = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Lv({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = se(Tv, he);
  return !(i && o && l) ? null : h("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: h("g", { className: ye(["react-flow__connection", Dl(a)]), children: h(Pc, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const Pc = ({ style: e, type: t = ut.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: f, toPosition: u, pointer: p } = Av();
  if (!o)
    return;
  if (n)
    return h(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: u, connectionStatus: Dl(r), toNode: d, toHandle: f, pointer: p });
  let g = "";
  const b = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: u
  };
  switch (t) {
    case ut.Bezier:
      [g] = Vl(b);
      break;
    case ut.SimpleBezier:
      [g] = kc(b);
      break;
    case ut.Step:
      [g] = qo({
        ...b,
        borderRadius: 0
      });
      break;
    case ut.SmoothStep:
      [g] = qo(b);
      break;
    default:
      [g] = jl(b);
  }
  return h("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
Pc.displayName = "ConnectionLine";
const zv = {};
function sa(e = zv) {
  oe(e), ue(), ce(() => {
  }, [e]);
}
function Ov() {
  ue(), oe(!1), ce(() => {
  }, []);
}
function Dc({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: f, onSelectionStart: u, onSelectionEnd: p, connectionLineType: g, connectionLineStyle: b, connectionLineComponent: v, connectionLineContainerStyle: y, selectionKeyCode: _, selectionOnDrag: m, selectionMode: w, multiSelectionKeyCode: S, panActivationKeyCode: k, zoomActivationKeyCode: E, deleteKeyCode: L, onlyRenderVisibleElements: $, elementsSelectable: B, defaultViewport: O, translateExtent: W, minZoom: H, maxZoom: x, preventScrolling: C, defaultMarkerColor: N, zoomOnScroll: I, zoomOnPinch: z, panOnScroll: M, panOnScrollSpeed: T, panOnScrollMode: P, zoomOnDoubleClick: R, panOnDrag: Y, autoPanOnSelection: j, onPaneClick: U, onPaneMouseEnter: ee, onPaneMouseMove: G, onPaneMouseLeave: D, onPaneScroll: F, onPaneContextMenu: Z, paneClickDistance: Q, nodeClickDistance: q, onEdgeContextMenu: J, onEdgeMouseEnter: te, onEdgeMouseMove: ne, onEdgeMouseLeave: ie, reconnectRadius: ae, onReconnect: _e, onReconnectStart: Ae, onReconnectEnd: ve, noDragClassName: Oe, noWheelClassName: Ze, noPanClassName: Pe, disableKeyboardA11y: Qe, nodeExtent: ke, rfId: Se, viewport: Ne, onViewportChange: Je, nodesDraggable: Ft }) {
  return sa(e), sa(t), Ov(), Nv(n), Mv(Ne), h(Zb, { onPaneClick: U, onPaneMouseEnter: ee, onPaneMouseMove: G, onPaneMouseLeave: D, onPaneContextMenu: Z, onPaneScroll: F, paneClickDistance: Q, deleteKeyCode: L, selectionKeyCode: _, selectionOnDrag: m, selectionMode: w, onSelectionStart: u, onSelectionEnd: p, multiSelectionKeyCode: S, panActivationKeyCode: k, zoomActivationKeyCode: E, elementsSelectable: B, zoomOnScroll: I, zoomOnPinch: z, zoomOnDoubleClick: R, panOnScroll: M, panOnScrollSpeed: T, panOnScrollMode: P, panOnDrag: Y, autoPanOnSelection: j, defaultViewport: O, translateExtent: W, minZoom: H, maxZoom: x, onSelectionContextMenu: f, preventScrolling: C, noDragClassName: Oe, noWheelClassName: Ze, noPanClassName: Pe, disableKeyboardA11y: Qe, onViewportChange: Je, isControlledViewport: !!Ne, children: A(Sv, { children: [h(Ev, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: _e, onReconnectStart: Ae, onReconnectEnd: ve, onlyRenderVisibleElements: $, onEdgeContextMenu: J, onEdgeMouseEnter: te, onEdgeMouseMove: ne, onEdgeMouseLeave: ie, reconnectRadius: ae, defaultMarkerColor: N, noPanClassName: Pe, disableKeyboardA11y: Qe, rfId: Se }), h(Lv, { style: b, type: g, component: v, containerStyle: y }), h("div", { className: "react-flow__edgelabel-renderer" }), h(sv, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: q, onlyRenderVisibleElements: $, noPanClassName: Pe, noDragClassName: Oe, disableKeyboardA11y: Qe, nodeExtent: ke, rfId: Se, nodesDraggable: Ft }), h("div", { className: "react-flow__viewport-portal" })] }) });
}
Dc.displayName = "GraphView";
const Pv = pe(Dc), Dv = zl(), aa = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: f, zIndexMode: u = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = r ?? t ?? [], _ = n ?? e ?? [], m = d ?? [0, 0], w = f ?? un;
  Xl(b, v, y);
  const { nodesInitialized: S } = Zo(_, p, g, {
    nodeOrigin: m,
    nodeExtent: w,
    zIndexMode: u
  });
  let k = [0, 0, 1];
  if (s && o && i) {
    const E = En(p, {
      filter: (O) => !!((O.width || O.initialWidth) && (O.height || O.initialHeight))
    }), { x: L, y: $, zoom: B } = Rr(E, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    k = [L, $, B];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: k,
    nodes: _,
    nodesInitialized: S,
    nodeLookup: p,
    parentLookup: g,
    edges: y,
    edgeLookup: v,
    connectionLookup: b,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: un,
    nodeExtent: w,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Pt.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: m,
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
    connection: { ...Ml },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Dv,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Cl,
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
}, Rv = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: f, zIndexMode: u }) => Kw((p, g) => {
  async function b() {
    const { nodeLookup: v, panZoom: y, fitViewOptions: _, fitViewResolver: m, width: w, height: S, minZoom: k, maxZoom: E } = g();
    y && (await Ty({
      nodes: v,
      width: w,
      height: S,
      panZoom: y,
      minZoom: k,
      maxZoom: E
    }, _), m == null || m.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...aa({
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
    setNodes: (v) => {
      const { nodeLookup: y, parentLookup: _, nodeOrigin: m, nodeExtent: w, elevateNodesOnSelect: S, fitViewQueued: k, zIndexMode: E, nodesSelectionActive: L } = g(), { nodesInitialized: $, hasSelectedNodes: B } = Zo(v, y, _, {
        nodeOrigin: m,
        nodeExtent: w,
        elevateNodesOnSelect: S,
        checkEquality: !0,
        zIndexMode: E
      }), O = L && B;
      k && $ ? (b(), p({
        nodes: v,
        nodesInitialized: $,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: O
      })) : p({ nodes: v, nodesInitialized: $, nodesSelectionActive: O });
    },
    setEdges: (v) => {
      const { connectionLookup: y, edgeLookup: _ } = g();
      Xl(y, _, v), p({ edges: v });
    },
    setDefaultNodesAndEdges: (v, y) => {
      if (v) {
        const { setNodes: _ } = g();
        _(v), p({ hasDefaultNodes: !0 });
      }
      if (y) {
        const { setEdges: _ } = g();
        _(y), p({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (v) => {
      const { triggerNodeChanges: y, nodeLookup: _, parentLookup: m, domNode: w, nodeOrigin: S, nodeExtent: k, debug: E, fitViewQueued: L, zIndexMode: $ } = g(), { changes: B, updatedInternals: O } = tw(v, _, m, w, S, k, $);
      O && (Zy(_, m, { nodeOrigin: S, nodeExtent: k, zIndexMode: $ }), L ? (b(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), (B == null ? void 0 : B.length) > 0 && (E && console.log("React Flow: trigger node changes", B), y == null || y(B)));
    },
    updateNodePositions: (v, y = !1) => {
      const _ = [];
      let m = [];
      const { nodeLookup: w, triggerNodeChanges: S, connection: k, updateConnection: E, onNodesChangeMiddlewareMap: L } = g();
      for (const [$, B] of v) {
        const O = w.get($), W = !!(O != null && O.expandParent && (O != null && O.parentId) && (B != null && B.position)), H = {
          id: $,
          type: "position",
          position: W ? {
            x: Math.max(0, B.position.x),
            y: Math.max(0, B.position.y)
          } : B.position,
          dragging: y
        };
        if (O && k.inProgress && k.fromNode.id === O.id) {
          const x = St(O, k.fromHandle, X.Left, !0);
          E({ ...k, from: x });
        }
        W && O.parentId && _.push({
          id: $,
          parentId: O.parentId,
          rect: {
            ...B.internals.positionAbsolute,
            width: B.measured.width ?? 0,
            height: B.measured.height ?? 0
          }
        }), m.push(H);
      }
      if (_.length > 0) {
        const { parentLookup: $, nodeOrigin: B } = g(), O = Ci(_, w, $, B);
        m.push(...O);
      }
      for (const $ of L.values())
        m = $(m);
      S(m);
    },
    triggerNodeChanges: (v) => {
      const { onNodesChange: y, setNodes: _, nodes: m, hasDefaultNodes: w, debug: S } = g();
      if (v != null && v.length) {
        if (w) {
          const k = yb(v, m);
          _(k);
        }
        S && console.log("React Flow: trigger node changes", v), y == null || y(v);
      }
    },
    triggerEdgeChanges: (v) => {
      const { onEdgesChange: y, setEdges: _, edges: m, hasDefaultEdges: w, debug: S } = g();
      if (v != null && v.length) {
        if (w) {
          const k = wb(v, m);
          _(k);
        }
        S && console.log("React Flow: trigger edge changes", v), y == null || y(v);
      }
    },
    addSelectedNodes: (v) => {
      const { multiSelectionActive: y, edgeLookup: _, nodeLookup: m, triggerNodeChanges: w, triggerEdgeChanges: S } = g();
      if (y) {
        const k = v.map((E) => yt(E, !0));
        w(k);
        return;
      }
      w(At(m, /* @__PURE__ */ new Set([...v]), !0)), S(At(_));
    },
    addSelectedEdges: (v) => {
      const { multiSelectionActive: y, edgeLookup: _, nodeLookup: m, triggerNodeChanges: w, triggerEdgeChanges: S } = g();
      if (y) {
        const k = v.map((E) => yt(E, !0));
        S(k);
        return;
      }
      S(At(_, /* @__PURE__ */ new Set([...v]))), w(At(m, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: v, edges: y } = {}) => {
      const { edges: _, nodes: m, nodeLookup: w, triggerNodeChanges: S, triggerEdgeChanges: k } = g(), E = v || m, L = y || _, $ = [];
      for (const O of E) {
        if (!O.selected)
          continue;
        const W = w.get(O.id);
        W && (W.selected = !1), $.push(yt(O.id, !1));
      }
      const B = [];
      for (const O of L)
        O.selected && B.push(yt(O.id, !1));
      S($), k(B);
    },
    setMinZoom: (v) => {
      const { panZoom: y, maxZoom: _ } = g();
      y == null || y.setScaleExtent([v, _]), p({ minZoom: v });
    },
    setMaxZoom: (v) => {
      const { panZoom: y, minZoom: _ } = g();
      y == null || y.setScaleExtent([_, v]), p({ maxZoom: v });
    },
    setTranslateExtent: (v) => {
      var y;
      (y = g().panZoom) == null || y.setTranslateExtent(v), p({ translateExtent: v });
    },
    resetSelectedElements: () => {
      const { edges: v, nodes: y, triggerNodeChanges: _, triggerEdgeChanges: m, elementsSelectable: w } = g();
      if (!w)
        return;
      const S = y.reduce((E, L) => L.selected ? [...E, yt(L.id, !1)] : E, []), k = v.reduce((E, L) => L.selected ? [...E, yt(L.id, !1)] : E, []);
      _(S), m(k);
    },
    setNodeExtent: (v) => {
      const { nodes: y, nodeLookup: _, parentLookup: m, nodeOrigin: w, elevateNodesOnSelect: S, nodeExtent: k, zIndexMode: E } = g();
      v[0][0] === k[0][0] && v[0][1] === k[0][1] && v[1][0] === k[1][0] && v[1][1] === k[1][1] || (Zo(y, _, m, {
        nodeOrigin: w,
        nodeExtent: v,
        elevateNodesOnSelect: S,
        checkEquality: !1,
        zIndexMode: E
      }), p({ nodeExtent: v }));
    },
    panBy: (v) => {
      const { transform: y, width: _, height: m, panZoom: w, translateExtent: S } = g();
      return nw({ delta: v, panZoom: w, transform: y, translateExtent: S, width: _, height: m });
    },
    setCenter: async (v, y, _) => {
      const { width: m, height: w, maxZoom: S, panZoom: k } = g();
      if (!k)
        return !1;
      const E = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : S;
      return await k.setViewport({
        x: m / 2 - v * E,
        y: w / 2 - y * E,
        zoom: E
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...Ml }
      });
    },
    updateConnection: (v) => {
      p({ connection: v });
    },
    reset: () => p({ ...aa() })
  };
}, Object.is);
function Ii({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: f, zIndexMode: u, children: p }) {
  const [g] = re(() => Rv({
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
  return h(Zw, { value: g, children: h(kb, { children: h(Rb, { children: p }) }) });
}
function Hv({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: f, nodeExtent: u, zIndexMode: p }) {
  return Vt(Wr) ? h(we, { children: e }) : h(Ii, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: f, nodeExtent: u, zIndexMode: p, children: e });
}
const Bv = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function Wv({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: f, onMoveEnd: u, onConnect: p, onConnectStart: g, onConnectEnd: b, onClickConnectStart: v, onClickConnectEnd: y, onNodeMouseEnter: _, onNodeMouseMove: m, onNodeMouseLeave: w, onNodeContextMenu: S, onNodeDoubleClick: k, onNodeDragStart: E, onNodeDrag: L, onNodeDragStop: $, onNodesDelete: B, onEdgesDelete: O, onDelete: W, onSelectionChange: H, onSelectionDragStart: x, onSelectionDrag: C, onSelectionDragStop: N, onSelectionContextMenu: I, onSelectionStart: z, onSelectionEnd: M, onBeforeDelete: T, connectionMode: P, connectionLineType: R = ut.Bezier, connectionLineStyle: Y, connectionLineComponent: j, connectionLineContainerStyle: U, deleteKeyCode: ee = "Backspace", selectionKeyCode: G = "Shift", selectionOnDrag: D = !1, selectionMode: F = fn.Full, panActivationKeyCode: Z = "Space", multiSelectionKeyCode: Q = pn() ? "Meta" : "Control", zoomActivationKeyCode: q = pn() ? "Meta" : "Control", snapToGrid: J, snapGrid: te, onlyRenderVisibleElements: ne = !1, selectNodesOnDrag: ie, nodesDraggable: ae, autoPanOnNodeFocus: _e, nodesConnectable: Ae, nodesFocusable: ve, nodeOrigin: Oe = dc, edgesFocusable: Ze, edgesReconnectable: Pe, elementsSelectable: Qe = !0, defaultViewport: ke = db, minZoom: Se = 0.5, maxZoom: Ne = 2, translateExtent: Je = un, preventScrolling: Ft = !0, nodeExtent: it, defaultMarkerColor: jt = "#b1b1b7", zoomOnScroll: be = !0, zoomOnPinch: st = !0, panOnScroll: Cn = !1, panOnScrollSpeed: gt = 0.5, panOnScrollMode: Mt = vt.Free, zoomOnDoubleClick: Mn = !0, panOnDrag: In = !0, onPaneClick: $n, onPaneMouseEnter: Gr, onPaneMouseMove: Xr, onPaneMouseLeave: Ur, onPaneScroll: qr, onPaneContextMenu: De, paneClickDistance: Yt = 1, nodeClickDistance: Gt = 0, children: Kr, onReconnect: Xt, onReconnectStart: Zr, onReconnectEnd: An, onEdgeContextMenu: Qr, onEdgeDoubleClick: Jr, onEdgeMouseEnter: eo, onEdgeMouseMove: to, onEdgeMouseLeave: no, reconnectRadius: ro = 10, onNodesChange: oo, onEdgesChange: io, noDragClassName: so = "nodrag", noWheelClassName: ao = "nowheel", noPanClassName: Tn = "nopan", fitView: It, fitViewOptions: at, connectOnClick: lo, attributionPosition: Ln, proOptions: zn, defaultEdgeOptions: On, elevateNodesOnSelect: Pn = !0, elevateEdgesOnSelect: Dn = !1, disableKeyboardA11y: Ut = !1, autoPanOnConnect: Rn, autoPanOnNodeDrag: Hn, autoPanOnSelection: co = !0, autoPanSpeed: Ce, connectionRadius: Bn, isValidConnection: Wn, onError: uo, style: fo, id: qt, nodeDragThreshold: Vn, connectionDragThreshold: ho, viewport: Fn, onViewportChange: po, width: jn, height: Yn, colorMode: V = "light", debug: fe, onScroll: Te, ariaLabelConfig: nd, zIndexMode: zi = "basic", ...rd }, od) {
  const go = qt || "1", id = pb(V), sd = Le((Oi) => {
    Oi.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Te == null || Te(Oi);
  }, [Te]);
  return h("div", { "data-testid": "rf__wrapper", ...rd, onScroll: sd, style: { ...fo, ...Bv }, ref: od, className: ye(["react-flow", o, id]), id: qt, role: "application", children: A(Hv, { nodes: e, edges: t, width: jn, height: Yn, fitView: It, fitViewOptions: at, minZoom: Se, maxZoom: Ne, nodeOrigin: Oe, nodeExtent: it, zIndexMode: zi, children: [h(hb, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: p, onConnectStart: g, onConnectEnd: b, onClickConnectStart: v, onClickConnectEnd: y, nodesDraggable: ae, autoPanOnNodeFocus: _e, nodesConnectable: Ae, nodesFocusable: ve, edgesFocusable: Ze, edgesReconnectable: Pe, elementsSelectable: Qe, elevateNodesOnSelect: Pn, elevateEdgesOnSelect: Dn, minZoom: Se, maxZoom: Ne, nodeExtent: it, onNodesChange: oo, onEdgesChange: io, snapToGrid: J, snapGrid: te, connectionMode: P, translateExtent: Je, connectOnClick: lo, defaultEdgeOptions: On, fitView: It, fitViewOptions: at, onNodesDelete: B, onEdgesDelete: O, onDelete: W, onNodeDragStart: E, onNodeDrag: L, onNodeDragStop: $, onSelectionDrag: C, onSelectionDragStart: x, onSelectionDragStop: N, onMove: d, onMoveStart: f, onMoveEnd: u, noPanClassName: Tn, nodeOrigin: Oe, rfId: go, autoPanOnConnect: Rn, autoPanOnNodeDrag: Hn, autoPanSpeed: Ce, onError: uo, connectionRadius: Bn, isValidConnection: Wn, selectNodesOnDrag: ie, nodeDragThreshold: Vn, connectionDragThreshold: ho, onBeforeDelete: T, debug: fe, ariaLabelConfig: nd, zIndexMode: zi }), h(Pv, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: m, onNodeMouseLeave: w, onNodeContextMenu: S, onNodeDoubleClick: k, nodeTypes: i, edgeTypes: s, connectionLineType: R, connectionLineStyle: Y, connectionLineComponent: j, connectionLineContainerStyle: U, selectionKeyCode: G, selectionOnDrag: D, selectionMode: F, deleteKeyCode: ee, multiSelectionKeyCode: Q, panActivationKeyCode: Z, zoomActivationKeyCode: q, onlyRenderVisibleElements: ne, defaultViewport: ke, translateExtent: Je, minZoom: Se, maxZoom: Ne, preventScrolling: Ft, zoomOnScroll: be, zoomOnPinch: st, zoomOnDoubleClick: Mn, panOnScroll: Cn, panOnScrollSpeed: gt, panOnScrollMode: Mt, panOnDrag: In, autoPanOnSelection: co, onPaneClick: $n, onPaneMouseEnter: Gr, onPaneMouseMove: Xr, onPaneMouseLeave: Ur, onPaneScroll: qr, onPaneContextMenu: De, paneClickDistance: Yt, nodeClickDistance: Gt, onSelectionContextMenu: I, onSelectionStart: z, onSelectionEnd: M, onReconnect: Xt, onReconnectStart: Zr, onReconnectEnd: An, onEdgeContextMenu: Qr, onEdgeDoubleClick: Jr, onEdgeMouseEnter: eo, onEdgeMouseMove: to, onEdgeMouseLeave: no, reconnectRadius: ro, defaultMarkerColor: jt, noDragClassName: so, noWheelClassName: ao, noPanClassName: Tn, rfId: go, disableKeyboardA11y: Ut, nodeExtent: it, viewport: Fn, onViewportChange: po, nodesDraggable: ae }), h(cb, { onSelectionChange: H }), Kr, h(ob, { proOptions: zn, position: Ln }), h(rb, { rfId: go, disableKeyboardA11y: Ut })] }) });
}
var Rc = fc(Wv);
function Vv({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return h("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ye(["react-flow__background-pattern", n, r]) });
}
function Fv({ radius: e, className: t }) {
  return h("circle", { cx: e, cy: e, r: e, className: ye(["react-flow__background-pattern", "dots", t]) });
}
var ht;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(ht || (ht = {}));
const jv = {
  [ht.Dots]: 1,
  [ht.Lines]: 1,
  [ht.Cross]: 6
}, Yv = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Hc({
  id: e,
  variant: t = ht.Dots,
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
  const f = oe(null), { transform: u, patternId: p } = se(Yv, he), g = r || jv[t], b = t === ht.Dots, v = t === ht.Cross, y = Array.isArray(n) ? n : [n, n], _ = [y[0] * u[2] || 1, y[1] * u[2] || 1], m = g * u[2], w = Array.isArray(i) ? i : [i, i], S = v ? [m, m] : _, k = [
    w[0] * u[2] + S[0] / 2,
    w[1] * u[2] + S[1] / 2
  ], E = `${p}${e || ""}`;
  return A("svg", { className: ye(["react-flow__background", c]), style: {
    ...l,
    ...Fr,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [h("pattern", { id: E, x: u[0] % _[0], y: u[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${k[0]},-${k[1]})`, children: b ? h(Fv, { radius: m / 2, className: d }) : h(Vv, { dimensions: S, lineWidth: o, variant: t, className: d }) }), h("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${E})` })] });
}
Hc.displayName = "Background";
const Bc = pe(Hc);
function Gv() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: h("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Xv() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: h("path", { d: "M0 0h32v4.2H0z" }) });
}
function Uv() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: h("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function qv() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: h("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Kv() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: h("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function tr({ children: e, className: t, ...n }) {
  return h("button", { type: "button", className: ye(["react-flow__controls-button", t]), ...n, children: e });
}
const Zv = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Wc({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: f = "bottom-left", orientation: u = "vertical", "aria-label": p }) {
  const g = ue(), { isInteractive: b, minZoomReached: v, maxZoomReached: y, ariaLabelConfig: _ } = se(Zv, he), { zoomIn: m, zoomOut: w, fitView: S } = Vr(), k = () => {
    m(), i == null || i();
  }, E = () => {
    w(), s == null || s();
  }, L = () => {
    S(o), a == null || a();
  }, $ = () => {
    g.setState({
      nodesDraggable: !b,
      nodesConnectable: !b,
      elementsSelectable: !b
    }), l == null || l(!b);
  };
  return A(Nt, { className: ye(["react-flow__controls", u === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": p ?? _["controls.ariaLabel"], children: [t && A(we, { children: [h(tr, { onClick: k, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: y, children: h(Gv, {}) }), h(tr, { onClick: E, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: v, children: h(Xv, {}) })] }), n && h(tr, { className: "react-flow__controls-fitview", onClick: L, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: h(Uv, {}) }), r && h(tr, { className: "react-flow__controls-interactive", onClick: $, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: b ? h(Kv, {}) : h(qv, {}) }), d] });
}
Wc.displayName = "Controls";
const Vc = pe(Wc);
function Qv({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: f, selected: u, onClick: p }) {
  const { background: g, backgroundColor: b } = i || {}, v = s || g || b;
  return h("rect", { className: ye(["react-flow__minimap-node", { selected: u }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: v,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: p ? (y) => p(y, e) : void 0 });
}
const Jv = pe(Qv), ex = (e) => e.nodes.map((t) => t.id), To = (e) => e instanceof Function ? e : () => e;
function tx({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Jv,
  onClick: s
}) {
  const a = se(ex, he), l = To(t), c = To(e), d = To(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return h(we, { children: a.map((u) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    h(rx, { id: u, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, u)
  )) });
}
function nx({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: f, width: u, height: p } = se((g) => {
    const b = g.nodeLookup.get(e);
    if (!b)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const v = b.internals.userNode, { x: y, y: _ } = b.internals.positionAbsolute, { width: m, height: w } = Ge(v);
    return {
      node: v,
      x: y,
      y: _,
      width: m,
      height: w
    };
  }, he);
  return !c || c.hidden || !Ol(c) ? null : h(a, { x: d, y: f, width: u, height: p, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const rx = pe(nx);
var ox = pe(tx);
const ix = 200, sx = 150, ax = (e) => !e.hidden, lx = (e) => {
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
    boundingRect: n ? Tl(En(e.nodeLookup, { filter: ax }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, la = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, cx = (e, t) => la(e.viewBB, t.viewBB) && la(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, dx = "react-flow__minimap-desc";
function Fc({
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
  onClick: p,
  onNodeClick: g,
  pannable: b = !1,
  zoomable: v = !1,
  ariaLabel: y,
  inversePan: _,
  zoomStep: m = 1,
  offsetScale: w = 5
}) {
  const S = ue(), k = oe(null), { boundingRect: E, panZoom: L, viewBB: $, rfId: B, translateExtent: O, flowWidth: W, flowHeight: H, ariaLabelConfig: x } = se(lx, cx), C = (e == null ? void 0 : e.width) ?? ix, N = (e == null ? void 0 : e.height) ?? sx, I = E.width / C, z = E.height / N, M = Math.max(I, z), T = M * C, P = M * N, R = w * M, Y = E.x - (T - E.width) / 2 - R, j = E.y - (P - E.height) / 2 - R, U = T + R * 2, ee = P + R * 2, G = `${dx}-${B}`, D = oe(0), F = oe();
  D.current = M, ce(() => {
    const te = S.getState().panZoom;
    if (k.current && te)
      return F.current = uw({
        domNode: k.current,
        panZoom: te,
        getTransform: () => S.getState().transform,
        getViewScale: () => D.current
      }), () => {
        var ne;
        (ne = F.current) == null || ne.destroy();
      };
  }, [L]), ce(() => {
    var te;
    (te = F.current) == null || te.update({
      translateExtent: O,
      width: W,
      height: H,
      inversePan: _,
      pannable: b,
      zoomStep: m,
      zoomable: v
    });
  }, [b, v, _, m, O, W, H]);
  const Z = p ? (te) => {
    var ae;
    const [ne, ie] = ((ae = F.current) == null ? void 0 : ae.pointer(te)) || [0, 0];
    p(te, { x: ne, y: ie });
  } : void 0, Q = Le((te, ne) => {
    const ie = S.getState().nodeLookup.get(ne).internals.userNode;
    g == null || g(te, ie);
  }, [g]), q = g ? Q : void 0, J = y ?? x["minimap.ariaLabel"];
  return h(Nt, { position: u, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * M : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: ye(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: A("svg", { width: C, height: N, viewBox: `${Y} ${j} ${U} ${ee}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": G, ref: k, onClick: Z, children: [J && h("title", { id: G, children: J }), h(ox, { onClick: q, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), h("path", { className: "react-flow__minimap-mask", d: `M${Y - R},${j - R}h${U + R * 2}v${ee + R * 2}h${-U - R * 2}z
        M${$.x},${$.y}h${$.width}v${$.height}h${-$.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Fc.displayName = "MiniMap";
const jc = pe(Fc), ux = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, fx = {
  [Bt.Line]: "right",
  [Bt.Handle]: "bottom-right"
};
function hx({ nodeId: e, position: t, variant: n = Bt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: u, autoScale: p = !0, shouldResize: g, onResizeStart: b, onResize: v, onResizeEnd: y }) {
  const _ = yc(), m = typeof e == "string" ? e : _, w = ue(), S = oe(null), k = n === Bt.Handle, E = se(Le(ux(k && p), [k, p]), he), L = oe(null), $ = t ?? fx[n];
  ce(() => {
    if (!(!S.current || !m))
      return L.current || (L.current = Ew({
        domNode: S.current,
        nodeId: m,
        getStoreItems: () => {
          const { nodeLookup: O, transform: W, snapGrid: H, snapToGrid: x, nodeOrigin: C, domNode: N } = w.getState();
          return {
            nodeLookup: O,
            transform: W,
            snapGrid: H,
            snapToGrid: x,
            nodeOrigin: C,
            paneDomNode: N
          };
        },
        onChange: (O, W) => {
          const { triggerNodeChanges: H, nodeLookup: x, parentLookup: C, nodeOrigin: N } = w.getState(), I = [], z = { x: O.x, y: O.y }, M = x.get(m);
          if (M && M.expandParent && M.parentId) {
            const T = M.origin ?? N, P = O.width ?? M.measured.width ?? 0, R = O.height ?? M.measured.height ?? 0, Y = {
              id: M.id,
              parentId: M.parentId,
              rect: {
                width: P,
                height: R,
                ...Pl({
                  x: O.x ?? M.position.x,
                  y: O.y ?? M.position.y
                }, { width: P, height: R }, M.parentId, x, T)
              }
            }, j = Ci([Y], x, C, N);
            I.push(...j), z.x = O.x ? Math.max(T[0] * P, O.x) : void 0, z.y = O.y ? Math.max(T[1] * R, O.y) : void 0;
          }
          if (z.x !== void 0 && z.y !== void 0) {
            const T = {
              id: m,
              type: "position",
              position: { ...z }
            };
            I.push(T);
          }
          if (O.width !== void 0 && O.height !== void 0) {
            const P = {
              id: m,
              type: "dimensions",
              resizing: !0,
              setAttributes: u ? u === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: O.width,
                height: O.height
              }
            };
            I.push(P);
          }
          for (const T of W) {
            const P = {
              ...T,
              type: "position"
            };
            I.push(P);
          }
          H(I);
        },
        onEnd: ({ width: O, height: W }) => {
          const H = {
            id: m,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: O,
              height: W
            }
          };
          w.getState().triggerNodeChanges([H]);
        }
      })), L.current.update({
        controlPosition: $,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: d
        },
        keepAspectRatio: f,
        resizeDirection: u,
        onResizeStart: b,
        onResize: v,
        onResizeEnd: y,
        shouldResize: g
      }), () => {
        var O;
        (O = L.current) == null || O.destroy();
      };
  }, [
    $,
    a,
    l,
    c,
    d,
    f,
    b,
    v,
    y,
    g
  ]);
  const B = $.split("-");
  return h("div", { className: ye(["react-flow__resize-control", "nodrag", ...B, n, r]), ref: S, style: {
    ...o,
    scale: E,
    ...s && { [k ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
pe(hx);
const px = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", $i = 0.05, Yc = 370, ca = 88, gx = 44, Ai = 560, da = "system-map-flow-css", mx = `
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
if (!document.getElementById(da)) {
  const e = document.createElement("style");
  e.id = da, e.textContent = px + mx, document.head.appendChild(e);
}
function Ti() {
  return se((e) => e.width);
}
function Gc(e, t) {
  const n = Vr(), r = se((s) => s.width), o = se((s) => s.height), i = oe(!1);
  ce(() => {
    if (!r || !o || e.length === 0) return;
    const s = Math.min(...e.map((u) => u.x)), a = Math.min(...e.map((u) => u.y)), l = Math.max(...e.map((u) => u.x + u.width)), c = Math.max(...e.map((u) => u.y + u.height)), d = Math.min(t, r * 0.5), f = Rr(
      { x: s, y: a, width: l - s, height: c - a },
      r - d,
      Math.max(120, o - ca - gx),
      $i,
      1,
      0.05
    );
    n.setViewport({ ...f, y: f.y + ca }, { duration: i.current ? 200 : 0 }), i.current = !0;
  }, [n, e, t, r, o]);
}
function yx({ layers: e }) {
  return /* @__PURE__ */ A("div", { className: "sm-layers", role: "group", "aria-label": "Map layers", children: [
    /* @__PURE__ */ h("span", { className: "sm-layers-label", children: "Layers" }),
    e.map((t) => /* @__PURE__ */ h("button", { type: "button", className: "sm-plain sm-layer", "aria-pressed": t.on, title: t.title, onClick: t.onToggle, children: t.label }, t.key))
  ] });
}
function Xc({ children: e }) {
  return /* @__PURE__ */ h("div", { className: "sm-tools", children: e });
}
function wx({ title: e, onBack: t }) {
  return /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
    /* @__PURE__ */ A(xe, { variant: "aim", children: [
      "Showing: ",
      e
    ] }),
    /* @__PURE__ */ h(de, { onClick: t, children: "Back to today" })
  ] });
}
const dr = { names: 210, keys: 240, columns: 240 }, ei = 34, sn = 20, bx = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, vx = pe(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", f = bx[n.status], u = (f == null ? void 0 : f.color) ?? "var(--border-strong, #a1a1aa)";
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
        /* @__PURE__ */ h(pt, { type: "target", position: X.Left, isConnectable: !1 }),
        /* @__PURE__ */ h(pt, { type: "source", position: X.Right, isConnectable: !1 }),
        /* @__PURE__ */ A(
          "div",
          {
            style: {
              height: ei,
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
              /* @__PURE__ */ h("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                f && /* @__PURE__ */ h("span", { style: { color: f.color, fontWeight: 600 }, children: n.status }),
                s > 0 && /* @__PURE__ */ A("span", { style: { fontWeight: s > 1 ? 600 : 400, color: s > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
                  s,
                  " at work"
                ] }),
                i > 0 && /* @__PURE__ */ h("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ h("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                d && /* @__PURE__ */ h("span", { style: K, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((p) => /* @__PURE__ */ A(
          "div",
          {
            style: { height: sn, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ h("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: p.primary ? "PK" : p.foreign ? "FK" : p.proposed ? "new" : "" }),
              /* @__PURE__ */ h("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: p.proposed ? 600 : void 0 }, children: p.name }),
              /* @__PURE__ */ h("span", { style: { ...K, ...Fe, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.type })
            ]
          },
          p.name
        )),
        o > 0 && /* @__PURE__ */ A("div", { style: { ...K, height: sn, padding: "0 10px", lineHeight: `${sn}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), xx = { table: vx };
function Uc(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Sr(e, t) {
  if (t === "names") return ei + 2;
  const n = Uc(e, t).length;
  return ei + n * sn + (n < e.columns.length ? sn : 0) + 2;
}
function _x(e, t) {
  const n = dr[t], r = new pr.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Sr(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  pr.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Sr(a, t) / 2 });
  }
  return s;
}
function kx(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const ti = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function Ex(e) {
  return (ti.find(([t]) => t === e) ?? ti[2])[1];
}
function Sx() {
  return /* @__PURE__ */ A(
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
        /* @__PURE__ */ h("span", { style: K, children: "On delete" }),
        ti.map(([e, t]) => /* @__PURE__ */ A("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ h("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function Nx({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  tools: i,
  onSelect: s
}) {
  const { mode: a } = ya(), l = Ti() >= Ai, c = le(() => t ? kx(e, t) : e, [e, t]), d = t && o === "names" ? "keys" : o, f = le(() => _x(c, d), [c, d]), u = le(
    () => c.tables.map((b) => {
      const v = Uc(b, d);
      return {
        id: b.id,
        type: "table",
        position: f.get(b.id) ?? { x: 0, y: 0 },
        width: dr[d],
        height: Sr(b, d),
        data: {
          table: b,
          columns: v,
          hidden: d === "names" ? 0 : b.columns.length - v.length,
          flags: n.get(b.id) ?? 0,
          working: r.get(b.id) ?? 0,
          focused: b.id === t,
          width: dr[d],
          large: d === "names"
        }
      };
    }),
    [c, d, f, n, r, t]
  ), p = le(
    () => c.edges.map((b) => {
      const v = Ex(b.on_delete);
      return {
        id: b.id,
        source: b.source,
        target: b.target,
        selectable: !1,
        markerEnd: { type: Dt.ArrowClosed, width: 14, height: 14, color: v },
        style: { stroke: v, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [c, t]
  ), g = le(
    () => c.tables.map((b) => ({
      ...f.get(b.id) ?? { x: 0, y: 0 },
      width: dr[d],
      height: Sr(b, d)
    })),
    [c, f, d]
  );
  return Gc(g, t ? Yc : 0), /* @__PURE__ */ A(
    Rc,
    {
      nodes: u,
      edges: p,
      nodeTypes: xx,
      colorMode: a,
      minZoom: $i,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (b, v) => s(v.id),
      onPaneClick: () => s(null),
      children: [
        /* @__PURE__ */ h(Bc, { gap: 24, size: 1 }),
        /* @__PURE__ */ h(Vc, { showInteractive: !1 }),
        l && /* @__PURE__ */ h(jc, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ h(Nt, { position: "top-left", children: /* @__PURE__ */ A(Xc, { children: [
          i,
          /* @__PURE__ */ h(Sx, {})
        ] }) })
      ]
    }
  );
}
function Cx(e) {
  return /* @__PURE__ */ h("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ h(Ii, { children: /* @__PURE__ */ h(Nx, { ...e }) }) });
}
const Mx = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], Ix = {
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
}, $x = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], qc = { accepted: "ok", dropped: "muted", draft: "aim" }, ua = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, Li = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, Ax = { ...Li, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, Tx = { ...K, ...Fe, fontSize: 11, overflowWrap: "anywhere" };
function mn(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function ni(e) {
  return vn(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function ri({ title: e, children: t }) {
  return /* @__PURE__ */ A("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ h("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function Kc({ limit: e }) {
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ h(bn, { severity: e.severity }),
    /* @__PURE__ */ A("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ h("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ h("div", { style: { ...K, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ h("div", { style: Tx, children: e.evidence.join("  ") })
    ] })
  ] });
}
function nr({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ h(ri, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ h("button", { style: { ...Ie, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? ni(o.id) }),
    r && /* @__PURE__ */ h("span", { style: { ...K, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function Lx({
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
      /* @__PURE__ */ h(de, { onClick: r, children: "Back" }),
      /* @__PURE__ */ h("strong", { style: { fontSize: 14, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ h(xe, { variant: qc[e.status], children: e.status }),
      /* @__PURE__ */ h("span", { style: { flex: 1 } }),
      /* @__PURE__ */ h(de, { primary: t, onClick: () => o("map"), children: "Show on map" }),
      /* @__PURE__ */ h(de, { onClick: () => o("data"), children: "Show in data model" }),
      /* @__PURE__ */ h(de, { onClick: s, disabled: !n, children: "Ask" })
    ] }),
    e.why && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13, margin: "6px 0 0" }, children: e.why }),
    e.closes.map((d) => /* @__PURE__ */ A("p", { style: { fontSize: 13, margin: "8px 0 0" }, "data-testid": "closes", children: [
      "Closes ",
      d.before - d.after,
      " of ",
      mn(d.before, "gap"),
      " in ",
      /* @__PURE__ */ h("strong", { children: d.title }),
      "."
    ] }, d.id)),
    $x.map(({ kind: d, title: f }) => {
      const u = e.limits.filter((p) => p.kind === d);
      return u.length === 0 ? null : /* @__PURE__ */ h(ri, { title: `${f} (${u.length})`, children: u.map((p, g) => /* @__PURE__ */ h(Kc, { limit: p }, g)) }, d);
    }),
    /* @__PURE__ */ h(nr, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ h(nr, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ h(nr, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ h(nr, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    e.limits_checked === !1 && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, "data-testid": "limits-note", children: "Limits check Postgres only, so this hasn't been checked against this project's database." }),
    c.length > 0 && /* @__PURE__ */ h(ri, { title: "Draft SQL", children: /* @__PURE__ */ h("pre", { style: { ...Fe, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
`) }) }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      e.status !== "accepted" && /* @__PURE__ */ h(de, { primary: !0, onClick: () => a("accepted"), children: "Accept" }),
      e.status !== "dropped" && /* @__PURE__ */ h(de, { onClick: () => a("dropped"), children: "Drop" }),
      e.status !== "draft" && /* @__PURE__ */ h(de, { onClick: () => a("draft"), children: "Back to draft" }),
      /* @__PURE__ */ h("span", { style: { flex: 1 } }),
      /* @__PURE__ */ h(de, { danger: !0, onClick: l, children: "Delete" })
    ] }),
    /* @__PURE__ */ h("p", { style: { ...K, fontSize: 12, marginBottom: 0 }, children: "This stays in System Map. Nothing here changes your repo." })
  ] });
}
function zx({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ A("button", { style: Ax, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ A("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ h("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ h(xe, { variant: "err", children: mn(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ A(xe, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ h(xe, { variant: qc[n.status], children: n.status })
      ] }),
      /* @__PURE__ */ A("span", { style: { ...K, fontSize: 12 }, children: [
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
function Ox(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${mn(n, "unit test")}`, t ? mn(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${Mr(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function Px({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ A("div", { style: Li, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ h("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ h(xe, { variant: ua[e.state].variant, children: ua[e.state].label }),
      /* @__PURE__ */ h("button", { style: Ie, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ h("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ h("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ h(Kc, { limit: i }, s)) }),
    /* @__PURE__ */ h("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ h("tbody", { children: e.parts.map((i) => /* @__PURE__ */ A("tr", { children: [
      /* @__PURE__ */ h("td", { style: { padding: "2px 8px 2px 0", ...K }, children: i.kind }),
      /* @__PURE__ */ h("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ h("button", { style: { ...Ie, textAlign: "left" }, onClick: () => n(i.id), children: ni(i.id) }) : ni(i.id) }),
      /* @__PURE__ */ h("td", { style: { padding: "2px 0", ...K, textAlign: "right" }, children: Ox(i) })
    ] }, i.id)) }) })
  ] });
}
function Dx({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ A("div", { style: { ...Li, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ h("button", { style: { ...Ie, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ A("span", { style: { ...K, fontSize: 12 }, children: [
      mn(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ h("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function Rx({
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
  const [p, g] = re(""), b = Ix[o], v = () => {
    p.trim() && (s(b.ask(p.trim())), g(""));
  };
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: Mx.map(([y, _]) => /* @__PURE__ */ h(de, { primary: o === y, onClick: () => i(y), children: _ }, y)) }),
    /* @__PURE__ */ A(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (y) => {
          y.preventDefault(), v();
        },
        children: [
          /* @__PURE__ */ h(dd, { "aria-label": "Describe it", placeholder: b.placeholder, value: p, onChange: (y) => g(y.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ h(de, { primary: !0, type: "submit", disabled: !r || !p.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ A("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ h(
        Lx,
        {
          proposal: t,
          shown: n === t.id,
          canAsk: r,
          onBack: () => a(null),
          onDraw: l,
          onNode: u,
          onAsk: () => s(`Use the system-map tools. Read proposal ${t.id}, say what stands in the way, and how to get past it.`),
          onStatus: (y) => c(t.id, y),
          onDelete: () => d("proposals", t.id)
        }
      ) : /* @__PURE__ */ h(zx, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ A("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((y) => /* @__PURE__ */ h(
          Px,
          {
            item: y,
            canAsk: r,
            onShow: u,
            onAsk: () => s(`Use the system-map tools. Look at use case ${y.id}, and propose what would close its gaps.`),
            onDelete: () => d("use_cases", y.id)
          },
          y.id
        ))
      ] }),
      o === "views" && /* @__PURE__ */ h(Dx, { rows: e.views, onOpen: f, onDelete: (y) => d("views", y) })
    ] })
  ] });
}
const Hx = ["high", "medium", "low", "info"];
function Bx({
  findings: e,
  noSchema: t = !1,
  onShow: n,
  onAsk: r
}) {
  const [o, i] = re(null), s = le(() => {
    const l = /* @__PURE__ */ new Map();
    for (const c of e) l.set(c.severity, (l.get(c.severity) ?? 0) + 1);
    return l;
  }, [e]), a = o ? e.filter((l) => l.severity === o) : e;
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ A(de, { primary: o === null, onClick: () => i(null), children: [
        "All ",
        e.length
      ] }),
      Hx.filter((l) => s.get(l)).map((l) => /* @__PURE__ */ A(de, { primary: o === l, onClick: () => i(l), children: [
        l,
        " ",
        s.get(l)
      ] }, l))
    ] }),
    a.length === 0 && /* @__PURE__ */ h("p", { style: K, children: t ? "No schema was read, so the table rules didn't run." : "No findings." }),
    a.map((l) => /* @__PURE__ */ A("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ A("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ h(bn, { severity: l.severity }),
        /* @__PURE__ */ h("span", { style: { flex: 1, fontWeight: 600 }, children: l.title }),
        /* @__PURE__ */ h("button", { style: Ie, onClick: () => n(l.node), children: "Show" }),
        /* @__PURE__ */ h("button", { style: Ie, onClick: () => r(l), children: "Ask" })
      ] }),
      /* @__PURE__ */ h("p", { style: { margin: "4px 0 0" }, children: l.detail }),
      /* @__PURE__ */ h("p", { style: { ...K, ...Fe, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: l.evidence.join("  ") })
    ] }, l.id))
  ] });
}
const Zc = 560, Nr = 760, Wx = 1100;
function Vx(e, t) {
  const n = e >= Wx, r = t && e >= Nr ? n ? "220px" : "170px" : null, o = n ? "minmax(320px, 26%)" : e >= Nr ? "260px" : e >= Zc ? "240px" : null;
  return [r, "minmax(0, 1fr)", o].filter(Boolean).join(" ");
}
function Fx(e, t, n, r, o) {
  const i = e.map((d, f) => f);
  if (e.reduce((d, f) => d + f, 0) + o * Math.max(0, e.length - 1) <= t) return { visible: i, hidden: [] };
  const a = t - n - o, l = [];
  let c = 0;
  for (const d of i) {
    const f = c + (l.length ? o : 0) + e[d];
    if (f > a) break;
    l.push(d), c = f;
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
const jx = [
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
function Yx(e) {
  return vn(e.replace(/^(module|area|route|job|service|plan|table):(public\.)?/, ""));
}
function Yr({ title: e, children: t }) {
  return /* @__PURE__ */ A("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ h("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function Gx({ link: e, onOpen: t }) {
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
    /* @__PURE__ */ h(
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
        children: Yx(e.node)
      }
    ),
    e.access && /* @__PURE__ */ h("span", { style: { ...K, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ h("span", { style: { ...K, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function Xx({ node: e, onOpen: t }) {
  return /* @__PURE__ */ h(we, { children: jx.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ h(Yr, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ h(Gx, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function Ux({ node: e }) {
  const n = [
    ["Path", e.path],
    ["Files", e.files],
    ["Lines", e.lines],
    ["Test files", e.test_files],
    ["Schedule", e.schedule],
    ["Status", e.status]
  ].filter(([, r]) => r !== void 0 && r !== "");
  return /* @__PURE__ */ h("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ h("tbody", { children: n.map(([r, o]) => /* @__PURE__ */ A("tr", { children: [
    /* @__PURE__ */ h("td", { style: { ...K, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: r }),
    /* @__PURE__ */ h("td", { style: { overflowWrap: "anywhere" }, children: o })
  ] }, r)) }) });
}
function qx({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ h(Yr, { title: `Not found (${n.length})`, children: /* @__PURE__ */ h("ul", { style: { ...Fe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ h("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function Kx({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${Mr(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ A(Yr, { title: n ? `Risk: ${n}` : "Risk", children: [
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
    e.worst_files.length > 0 && /* @__PURE__ */ h("ul", { style: { ...Fe, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ h("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: vn(r.path) }, r.path)) })
  ] });
}
function Zx({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ A(Yr, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ h("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ h("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ A("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ h(bn, { severity: n.severity }),
      /* @__PURE__ */ h("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function Qx({
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
          /* @__PURE__ */ h("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.name }),
          !l && /* @__PURE__ */ h(xe, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ h(de, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ h(de, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ A("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ h(Zx, { names: t, overlaps: n }),
          e.risk && /* @__PURE__ */ h(Kx, { risk: e.risk }),
          l ? /* @__PURE__ */ h(fd, { node: e, onAsk: a }) : /* @__PURE__ */ h(Ux, { node: e }),
          !l && /* @__PURE__ */ h(qx, { node: e }),
          /* @__PURE__ */ h(Xx, { node: e, onOpen: o }),
          !l && /* @__PURE__ */ h("p", { style: { ...K, ...Fe, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (c = e.evidence) == null ? void 0 : c.join("  ") })
        ] })
      ]
    }
  );
}
const Jx = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], e_ = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, t_ = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function n_({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ A("div", { style: t_, "data-testid": e.id, children: [
    /* @__PURE__ */ h("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ A("p", { style: { ...K, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      e_[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ A("ul", { style: { ...Fe, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ h("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ A("li", { style: K, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ h("button", { style: Ie, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ h("button", { style: Ie, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ h("span", { style: { flex: 1 } }),
      /* @__PURE__ */ A(
        "select",
        {
          "aria-label": `Status of ${e.name}`,
          value: e.status_source === "you" ? e.status : "",
          onChange: (i) => r(e.id, i.target.value || null),
          style: { fontSize: 11, background: "transparent", color: "var(--muted, #71717a)", border: 0 },
          children: [
            /* @__PURE__ */ h("option", { value: "", children: "Auto" }),
            /* @__PURE__ */ h("option", { value: "built", children: "Mark built" }),
            /* @__PURE__ */ h("option", { value: "partial", children: "Mark partly built" }),
            /* @__PURE__ */ h("option", { value: "planned", children: "Mark not built" })
          ]
        }
      )
    ] })
  ] });
}
function r_({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ A("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ h("strong", { children: i === 0 ? "Nothing here can be checked yet." : o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ h("span", { style: { ...K, fontSize: 13 }, children: i === 0 ? "These plans name no files, so the code can't confirm them." : "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ h("p", { style: K, children: "No plans found. System Map looks in docs/specs, docs/plans and specs, and for a BRIEF, PLAN, ROADMAP, PRD, SPEC or TODO file at the top of the repo." }),
    /* @__PURE__ */ h("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: Jx.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ A("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ A("div", { children: [
          /* @__PURE__ */ A("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ h(xe, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ h("span", { style: { ...K, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ h("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ h(n_, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function o_(e, t, n) {
  return { key: "plans", label: e > 0 ? `Plans ${e}` : "Plans", on: t, title: "Show unfinished plans on the map", onToggle: n };
}
const i_ = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], tt = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, Lo = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, fa = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function s_({ share: e }) {
  return /* @__PURE__ */ A("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ h("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ h("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ h("span", { style: { minWidth: 32, textAlign: "right" }, children: Mr(e) })
  ] });
}
function a_({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ h(xe, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ h(xe, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ h(xe, { variant: "muted", children: "Untested" }) : null;
}
function l_(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function c_({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ A(we, { children: [
      /* @__PURE__ */ A(xe, { variant: "muted", children: [
        Mr(i.lines_hit / i.lines_total),
        " of lines run by tests"
      ] }),
      /* @__PURE__ */ A("span", { style: K, children: [
        i.commit ? `Report from ${i.commit.slice(0, 7)}` : "Report from an unknown commit",
        i.files_changed_since ? `, ${i.files_changed_since} files changed since` : ""
      ] })
    ] }) : /* @__PURE__ */ h("span", { style: K, children: "No coverage report yet. Showing which tests reach each file through imports." }),
    /* @__PURE__ */ h("span", { style: { flex: 1 } }),
    n && /* @__PURE__ */ h("span", { style: { color: "var(--danger, #dc2626)" }, children: n }),
    /* @__PURE__ */ h(de, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ h(de, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function d_({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = re("modules"), [c, d] = re(!0), [f, u] = re(!1), [p, g] = re("score"), b = e.coverage !== null, v = le(() => e[a].filter((w) => a === "modules" || !f || !w.ui), [e, a, f]), y = v.filter((w) => w.hot && w.untested), _ = le(() => {
    const w = c && y.length > 0 ? y : v;
    if (p === "score") return w;
    const S = p === "cover" ? 1 : -1;
    return [...w].sort((k, E) => S * (k[p] - E[p]));
  }, [v, c, p]), m = a === "modules" ? "module" : "file";
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ A("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "risk-summary", children: [
      /* @__PURE__ */ h("strong", { children: e.test_files === 0 ? "No tests yet." : y.length === 0 ? "Nothing busy is short of tests." : `${y.length} busy ${m}${y.length === 1 ? " has" : "s have"} little test cover.` }),
      " ",
      /* @__PURE__ */ A("span", { style: { ...K, fontSize: 13 }, children: [
        "Busy means more commits than three in four others, over ",
        e.window_days,
        " days. Little cover means under half."
      ] })
    ] }),
    e.test_files === 0 && /* @__PURE__ */ h("p", { style: { ...K, margin: 0, fontSize: 13 }, "data-testid": "no-tests", children: "This project has no tests yet, so everything counts as untested. The list below is ranked by how complex and busy each part is." }),
    !e.history_known && /* @__PURE__ */ h("p", { style: { ...K, margin: 0, fontSize: 13 }, children: "No git history here, so commits are not counted." }),
    e.shallow && /* @__PURE__ */ h("p", { style: { ...K, margin: 0, fontSize: 13 }, children: "This is a shallow clone, so commits are undercounted." }),
    /* @__PURE__ */ h(c_, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ h(de, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ h(de, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ h("span", { style: { width: 8 } }),
      y.length > 0 && /* @__PURE__ */ h(de, { primary: c, onClick: () => d((w) => !w), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ h(de, { primary: f, onClick: () => u((w) => !w), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ A("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ A("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ h("thead", { children: /* @__PURE__ */ A("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ h("th", { style: { ...tt, textAlign: "left" }, children: /* @__PURE__ */ A("button", { style: Lo, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          i_.map((w) => /* @__PURE__ */ h("th", { style: tt, children: /* @__PURE__ */ h("button", { style: { ...Lo, color: p === w.key ? "var(--text, inherit)" : Lo.color }, title: w.title, onClick: () => g(w.key), children: w.label }) }, w.key)),
          /* @__PURE__ */ h("th", { style: tt })
        ] }) }),
        /* @__PURE__ */ h("tbody", { children: _.map((w) => /* @__PURE__ */ A("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ A("td", { style: { ...tt, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ h(
              "button",
              {
                onClick: () => r(w.id ?? w.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...fa, ...Fe } : fa,
                children: vn(w.path)
              }
            ),
            " ",
            /* @__PURE__ */ h(a_, { row: w })
          ] }),
          /* @__PURE__ */ h("td", { style: tt, children: w.commits }),
          /* @__PURE__ */ h("td", { style: tt, children: w.complexity }),
          /* @__PURE__ */ h("td", { style: tt, children: b ? /* @__PURE__ */ h(s_, { share: w.covered ?? 0 }) : /* @__PURE__ */ h("span", { style: K, children: l_(w, a) }) }),
          /* @__PURE__ */ h("td", { style: tt, children: w.lines }),
          /* @__PURE__ */ h("td", { style: tt, children: /* @__PURE__ */ h("button", { style: Ie, onClick: () => o(w.id ?? w.path), disabled: !t, children: "Ask" }) })
        ] }, w.path)) })
      ] }),
      _.length === 0 && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
function u_({
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
  return /* @__PURE__ */ A("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
    /* @__PURE__ */ h("span", { role: "status", style: { ...K, fontSize: 13 }, "data-testid": "rebuild-result", children: !i && s }),
    e.rebuild && !i && /* @__PURE__ */ h(de, { primary: !0, onClick: a, children: "Rebuild" }),
    /* @__PURE__ */ h(
      xa,
      {
        width: 270,
        align: "right",
        label: "Model status",
        trigger: (c) => /* @__PURE__ */ A("button", { type: "button", className: "sm-plain sm-chip", "data-testid": "status-chip", ...c, children: [
          /* @__PURE__ */ h("span", { className: "sm-dot", "data-tone": i ? "muted" : e.tone }),
          l,
          /* @__PURE__ */ h(_a, {})
        ] }),
        children: () => /* @__PURE__ */ A("div", { style: { padding: 8 }, children: [
          /* @__PURE__ */ h("div", { style: { fontWeight: 600, marginBottom: 2, overflowWrap: "anywhere" }, children: t ?? e.detail }),
          /* @__PURE__ */ A("div", { style: { ...K, marginBottom: 10 }, children: [
            n ? /* @__PURE__ */ h("span", { className: "sm-mono", children: n.slice(0, 7) }) : "This folder",
            ", built ",
            hd(r, Date.now() / 1e3)
          ] }),
          o && /* @__PURE__ */ A("div", { style: { marginBottom: 10 }, "data-testid": "build-read", children: [
            pd(o).map((c) => /* @__PURE__ */ h("div", { children: c }, c)),
            o.unread.map((c) => /* @__PURE__ */ A("div", { style: { marginTop: 6 }, children: [
              "Not read: ",
              c.what,
              c.where && /* @__PURE__ */ h("div", { className: "sm-mono", style: { ...K, overflowWrap: "anywhere" }, children: c.where })
            ] }, c.what))
          ] }),
          e.label !== "Folder missing" && /* @__PURE__ */ h(de, { primary: e.rebuild, disabled: i, onClick: a, autoFocus: !0, children: i ? "Rebuilding" : "Rebuild" })
        ] })
      }
    )
  ] });
}
const yn = 200, wn = 58, ha = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, f_ = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)"
}, oi = {
  imports: { color: "var(--border-strong, #a1a1aa)", label: "imports" },
  renders: { color: "var(--muted, #71717a)", label: "renders" },
  uses_table: { color: "var(--accent, #2563eb)", label: "uses table" },
  uses_service: { color: "var(--warn-text, #b45309)", label: "uses service" },
  calls: { color: "var(--text, #18181b)", label: "calls" },
  touches: { color: "var(--danger, #dc2626)", dashed: !0, label: "plan touches" }
}, ur = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, h_ = pe(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i } = t, s = n.status === "proposed", a = n.kind === "plan" || s, l = n.kind === "service", c = o.length > 1, d = s ? "var(--accent, #2563eb)" : a ? f_[n.status ?? "unclear"] : c ? "var(--warn-text, #b45309)" : void 0, f = r ? "var(--accent, #2563eb)" : d ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ A(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: yn,
        height: wn,
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
        boxShadow: [i ? `inset 5px 0 0 ${ur[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ h(pt, { type: "target", position: X.Left, isConnectable: !1 }),
        /* @__PURE__ */ h(pt, { type: "source", position: X.Right, isConnectable: !1 }),
        /* @__PURE__ */ A("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ h("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          a && /* @__PURE__ */ h("span", { style: { fontSize: 11, color: d, flexShrink: 0 }, children: n.status }),
          i && /* @__PURE__ */ h("span", { style: { fontSize: 11, color: ur[i].color, flexShrink: 0 }, children: ur[i].label })
        ] }),
        /* @__PURE__ */ A("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ h("span", { style: { ...K, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [ha[n.kind] && n.kind !== "area" && n.kind !== "plan" ? ha[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ A("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: c ? 600 : 400, color: c ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] })
        ] })
      ]
    }
  );
}), p_ = { card: h_ };
function g_(e, t) {
  const n = new pr.graphlib.Graph({ multigraph: !0 });
  n.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), n.setDefaultEdgeLabel(() => ({}));
  for (const o of e.cards) n.setNode(o.id, { width: yn, height: wn });
  for (const o of e.lines)
    o.source !== o.target && n.setEdge(o.source, o.target, {}, o.id);
  pr.layout(n);
  const r = /* @__PURE__ */ new Map();
  for (const o of e.cards) {
    const i = n.node(o.id);
    r.set(o.id, { x: i.x - yn / 2, y: i.y - wn / 2 });
  }
  return r;
}
function m_(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function y_(e) {
  const t = oi[e.kind] ?? oi.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: Dt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: m_(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function w_({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(oi).filter(([i]) => e.has(i)), o = Ti();
  return /* @__PURE__ */ A(
    "div",
    {
      "data-testid": "legend",
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        width: "max-content",
        // Clear of the zoom buttons, and of the minimap when there is one.
        maxWidth: Math.max(120, o - (o < Ai ? 130 : 290)),
        whiteSpace: "nowrap",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        r.map(([i, s]) => /* @__PURE__ */ A("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ h("span", { style: { width: 14, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` } }),
          s.label
        ] }, i)),
        n && Object.values(ur).map((i) => /* @__PURE__ */ A("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ h("span", { style: { width: 5, height: 12, background: i.color } }),
          i.label
        ] }, i.label)),
        t && /* @__PURE__ */ h("span", { style: K, children: "Thin links hidden" })
      ]
    }
  );
}
function b_({ system: e, focus: t, onFocus: n }) {
  const r = vd(e, t);
  return /* @__PURE__ */ h(
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
          i > 0 && /* @__PURE__ */ h("span", { style: K, children: "/" }),
          /* @__PURE__ */ h(
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
function v_({
  system: e,
  focus: t,
  tables: n,
  showPlans: r,
  inspecting: o,
  risk: i,
  worktrees: s,
  only: a,
  layout: l,
  tools: c,
  onFocus: d,
  onOpenTables: f
}) {
  const { mode: u } = ya(), p = Ti() >= Ai, g = le(() => a ? gd(e, a, n) : md(e, t, n, r), [e, a, t, n, r]), b = le(() => g_(g, l === "top-down" ? "TB" : "LR"), [g, l]), v = le(() => yd(i), [i]), y = s == null ? void 0 : s.by_node, _ = le(
    () => g.cards.map((E) => ({
      id: E.id,
      type: "card",
      position: b.get(E.id) ?? { x: 0, y: 0 },
      width: yn,
      height: wn,
      data: { card: E, focused: E.id === t, work: y ? bd(E.id, y) : [], band: wd(v.get(E.id)) }
    })),
    [g, b, t, v, y]
  ), m = le(() => g.lines.map(y_), [g]), w = le(
    () => g.cards.map((E) => ({ ...b.get(E.id) ?? { x: 0, y: 0 }, width: yn, height: wn })),
    [g, b]
  );
  Gc(w, o ? Yc : 0);
  const S = le(() => new Set(g.lines.map((E) => E.kind)), [g]), k = (E) => {
    if (E === xd) f();
    else {
      if (E !== _d && E !== kd && E === t) return;
      d(E);
    }
  };
  return /* @__PURE__ */ A(
    Rc,
    {
      nodes: _,
      edges: m,
      nodeTypes: p_,
      colorMode: u,
      minZoom: $i,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (E, L) => k(L.id),
      children: [
        /* @__PURE__ */ h(Bc, { gap: 24, size: 1 }),
        /* @__PURE__ */ h(Vc, { showInteractive: !1 }),
        p && /* @__PURE__ */ h(jc, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ h(Nt, { position: "top-left", children: /* @__PURE__ */ A(Xc, { children: [
          /* @__PURE__ */ h(b_, { system: e, focus: t, onFocus: d }),
          c
        ] }) }),
        /* @__PURE__ */ h(Nt, { position: "bottom-center", children: /* @__PURE__ */ h(w_, { kinds: S, top: (g.hidden ?? 0) > 0, risk: i !== null }) })
      ]
    }
  );
}
function x_(e) {
  return /* @__PURE__ */ h("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ h(Ii, { children: /* @__PURE__ */ h(v_, { ...e }) }) });
}
const __ = 16, k_ = 72, Qc = "system-map-view";
function pa(e) {
  return e.count === void 0 ? void 0 : `${e.count} ${e.counts ?? ""}`.trim();
}
function zo({ item: e }) {
  return /* @__PURE__ */ A(we, { children: [
    e.label,
    e.count !== void 0 && /* @__PURE__ */ h("span", { className: "sm-count", children: e.count })
  ] });
}
function E_({ items: e, value: t, onChange: n, label: r }) {
  const o = oe(null), i = oe(null), s = oe(null), [a, l] = re(Number.POSITIVE_INFINITY), [c, d] = re([]), f = e.map((_) => `${_.label}${_.count ?? ""}`).join("|");
  ai(() => {
    const _ = () => {
      var w, S;
      l(((w = o.current) == null ? void 0 : w.clientWidth) ?? 0), d([...((S = i.current) == null ? void 0 : S.children) ?? []].map((k) => k.offsetWidth));
    };
    _();
    const m = new ResizeObserver(_);
    return o.current && m.observe(o.current), () => m.disconnect();
  }, [f]);
  const u = e.findIndex((_) => _.value === t), p = le(
    () => c.length === e.length ? Fx(c, a, k_, u, __) : { visible: e.map((_, m) => m), hidden: [] },
    [c, a, u, e]
  ), g = p.visible.map((_) => e[_]), b = p.hidden.map((_) => e[_]), v = (_) => {
    n(_), requestAnimationFrame(() => {
      var m, w;
      return (w = (m = s.current) == null ? void 0 : m.querySelector('[aria-selected="true"]')) == null ? void 0 : w.focus();
    });
  }, y = (_) => {
    const m = g.findIndex((E) => E.value === t), w = g.length, k = { ArrowRight: (m + 1) % w, ArrowLeft: (m - 1 + w) % w, Home: 0, End: w - 1 }[_.key];
    k !== void 0 && (_.preventDefault(), v(g[k].value));
  };
  return /* @__PURE__ */ A("div", { ref: o, className: "sm-bar", style: { position: "relative", flex: "none" }, children: [
    /* @__PURE__ */ h("div", { ref: i, className: "sm-tab-probe", "aria-hidden": "true", children: e.map((_) => /* @__PURE__ */ h("span", { className: "sm-tab", children: /* @__PURE__ */ h(zo, { item: _ }) }, _.value)) }),
    /* @__PURE__ */ h("div", { ref: s, className: "sm-tabs", role: "tablist", "aria-label": r, onKeyDown: y, children: g.map((_) => /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        role: "tab",
        id: `system-map-tab-${_.value}`,
        className: "sm-plain sm-tab",
        "aria-selected": _.value === t,
        "aria-controls": Qc,
        tabIndex: _.value === t ? 0 : -1,
        title: pa(_),
        onClick: () => n(_.value),
        children: /* @__PURE__ */ h(zo, { item: _ })
      },
      _.value
    )) }),
    b.length > 0 && /* @__PURE__ */ h(
      xa,
      {
        width: 200,
        popup: "menu",
        label: "More views",
        trigger: (_) => /* @__PURE__ */ A("button", { type: "button", className: "sm-plain sm-tab", ..._, children: [
          "More ",
          /* @__PURE__ */ h(_a, {})
        ] }),
        children: (_) => /* @__PURE__ */ h(Ed, { label: "More views", children: b.map((m) => /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "sm-plain sm-row",
            title: pa(m),
            onClick: () => {
              _(), v(m.value);
            },
            children: /* @__PURE__ */ h(zo, { item: m })
          },
          m.value
        )) })
      }
    )
  ] });
}
const Jc = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, S_ = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, N_ = { ...Fe, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, Oo = 6;
function C_(e) {
  return vn(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function Ue({ title: e, children: t }) {
  return /* @__PURE__ */ A("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ h("span", { style: { ...K, fontSize: 12 }, children: e }),
    t
  ] });
}
function ft({ ids: e, onShow: t }) {
  return /* @__PURE__ */ h("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ h("button", { style: S_, onClick: () => t(n), children: C_(n) }, n)) });
}
function ga({ files: e }) {
  return /* @__PURE__ */ A("ul", { style: N_, children: [
    e.slice(0, Oo).map((t) => /* @__PURE__ */ h("li", { children: t }, t)),
    e.length > Oo && /* @__PURE__ */ A("li", { style: K, children: [
      "and ",
      e.length - Oo,
      " more"
    ] })
  ] });
}
const ed = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function M_({ row: e, canAsk: t, onAsk: n }) {
  const r = ed[e.merge];
  return /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ h(bn, { severity: e.severity }),
    /* @__PURE__ */ A("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ A("span", { style: K, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ h("button", { style: Ie, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function I_({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = ed[e.merge];
  return /* @__PURE__ */ A("div", { style: Jc, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ h(bn, { severity: e.severity }),
      /* @__PURE__ */ h("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ h("button", { style: Ie, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ h(Ue, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ h(ga, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ h(Ue, { title: "Both change these tables", children: /* @__PURE__ */ h(ft, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ h(Ue, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ h(ft, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ h(Ue, { title: "Both change code that uses these tables", children: /* @__PURE__ */ h(ft, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ h(Ue, { title: "Also share", children: /* @__PURE__ */ h(ga, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ h(Ue, { title: "Same modules", children: /* @__PURE__ */ h(ft, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ h("p", { style: { ...K, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function $_({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ A("div", { style: Jc, "data-testid": "worktree", children: [
    /* @__PURE__ */ h("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ h("p", { style: { ...K, ...Fe, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.path }),
    /* @__PURE__ */ A("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ A(xe, { variant: "muted", children: [
        e.ahead,
        " ahead"
      ] }),
      e.behind > 0 && /* @__PURE__ */ A(xe, { variant: "muted", children: [
        e.behind,
        " behind"
      ] }),
      e.uncommitted_files > 0 && /* @__PURE__ */ A(xe, { variant: "warn", children: [
        e.uncommitted_files,
        " uncommitted"
      ] }),
      /* @__PURE__ */ A(xe, { variant: "muted", children: [
        e.files.length,
        " files"
      ] })
    ] }),
    e.tables_schema.length > 0 && /* @__PURE__ */ h(Ue, { title: "Changes these tables", children: /* @__PURE__ */ h(ft, { ids: e.tables_schema, onShow: t }) }),
    e.modules.length > 0 && /* @__PURE__ */ h(Ue, { title: "Modules", children: /* @__PURE__ */ h(ft, { ids: e.modules, onShow: t }) }),
    e.tables_code.length > 0 && /* @__PURE__ */ h(Ue, { title: "Code that uses", children: /* @__PURE__ */ h(ft, { ids: e.tables_code, onShow: t }) }),
    n.length > 0 && /* @__PURE__ */ h(Ue, { title: "Routes and plans", children: /* @__PURE__ */ h(ft, { ids: n, onShow: t }) })
  ] });
}
function A_({
  state: e,
  checkedAt: t,
  canAsk: n,
  onShow: r,
  onAsk: o
}) {
  const { high: i, medium: s } = e.counts, a = i + s, l = e.overlaps.length - a, c = e.worktrees.filter((u) => u.files.length > 0), d = e.worktrees.length - c.length, f = a === 0 ? "No collisions ahead." : `${a} collision${a === 1 ? "" : "s"} ahead.`;
  return /* @__PURE__ */ A("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)", overflow: "hidden" }, children: [
    /* @__PURE__ */ A("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "worktree-summary", children: [
      /* @__PURE__ */ h("strong", { children: f }),
      " ",
      /* @__PURE__ */ A("span", { style: { ...K, fontSize: 13 }, children: [
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
      a > 0 && /* @__PURE__ */ h("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((u) => u.severity === "high" || u.severity === "medium").map((u) => /* @__PURE__ */ h(I_, { row: u, canAsk: n, onShow: r, onAsk: o }, `${u.a}|${u.b}`)) }),
      /* @__PURE__ */ A("section", { children: [
        /* @__PURE__ */ h("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ h("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((u) => /* @__PURE__ */ h($_, { tree: u, onShow: r }, u.path)) }),
        c.length === 0 && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ A("p", { style: { ...K, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ A("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ h("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((u) => u.severity === "low" || u.severity === "info").map((u) => /* @__PURE__ */ h(M_, { row: u, canAsk: n, onAsk: o }, `${u.a}|${u.b}`))
      ] })
    ] })
  ] });
}
const ma = 12, T_ = 2e4, L_ = 8e3, z_ = 4e3, O_ = [
  { key: "names", label: "Names" },
  { key: "keys", label: "Keys" },
  { key: "columns", label: "Columns" }
], Po = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, P_ = [
  { value: "map", label: "Map" },
  { value: "data", label: "Data model" },
  { value: "plan", label: "Plan", counts: "unfinished plans" },
  { value: "risk", label: "Risk", counts: "hot and untested modules" },
  { value: "worktrees", label: "Worktrees", counts: "worktree collisions" },
  { value: "findings", label: "Findings", counts: "findings" },
  { value: "explore", label: "Explore", counts: "draft proposals" }
];
function D_(e, t) {
  const n = wa(), [r, o] = re(null), [i, s] = re(null);
  ce(() => {
    if (!e) return;
    let l = !0;
    return (async () => {
      const d = await n.post("/api/chat/slots", { name: jd(t) });
      await n.post(`/api/chat/slots/${encodeURIComponent(d.key)}/project`, { project: e }), l && o(d.key);
    })().catch((d) => {
      l && s(or(d, "open the design chat"));
    }), () => {
      l = !1;
    };
  }, [n, e, t]);
  const a = Le(
    (l) => {
      r && n.post("/api/chat?ws=1", { message: l, slot: r, agent: "" });
    },
    [n, r]
  );
  return { slot: r, error: i, send: a };
}
function R_() {
  const e = oe(null), [t, n] = re(void 0), [r, o] = re(1400);
  return ai(() => {
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
function rr({ children: e, onDismiss: t }) {
  return /* @__PURE__ */ A("div", { className: "sm-notice", role: "alert", "data-testid": "notice", children: [
    /* @__PURE__ */ h("span", { style: { flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: e }),
    t && /* @__PURE__ */ h(de, { onClick: t, children: "Dismiss" })
  ] });
}
function H_({ read: e }) {
  const t = (e == null ? void 0 : e.unread) ?? [];
  return /* @__PURE__ */ h(
    ba,
    {
      testId: "no-tables",
      icon: /* @__PURE__ */ h(td, {}),
      title: "No tables found",
      subtitle: "System Map reads Postgres migrations and SQLite schemas, from .sql files or from code.",
      action: t.length > 0 && /* @__PURE__ */ h("div", { style: { ...K, fontSize: 13, textAlign: "center" }, children: t.map((n) => /* @__PURE__ */ A("div", { children: [
        "Found, but not read: ",
        n.what,
        n.where ? ` (${n.where})` : ""
      ] }, n.what)) })
    }
  );
}
function td() {
  return /* @__PURE__ */ A("svg", { width: "40", height: "40", viewBox: "0 0 64 64", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ h("rect", { x: "10", y: "10", width: "44", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "10", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "34", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "10", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "26", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "42", y: "42", width: "12", height: "12", rx: "3" })
  ] });
}
function B_({ onBuilt: e }) {
  const [t, n] = re(!1);
  return /* @__PURE__ */ A(we, { children: [
    /* @__PURE__ */ h(ii, { title: "System Map" }),
    /* @__PURE__ */ h("div", { className: "sm-page", children: /* @__PURE__ */ h(
      ba,
      {
        testId: "first-run",
        icon: /* @__PURE__ */ h(td, {}),
        title: "See your system in one place",
        subtitle: "Add a project to map its code, data model, risk and plans.",
        action: /* @__PURE__ */ h(de, { primary: !0, onClick: () => n(!0), children: "Add project" })
      }
    ) }),
    /* @__PURE__ */ h(Nd, { open: t, projects: [], onClose: () => n(!1), onBuilt: e })
  ] });
}
function Q_() {
  const { repos: e, active: t, loaded: n, choose: r, reload: o } = Sd();
  return n ? t ? /* @__PURE__ */ h(W_, { repo: t, projects: e, choose: r, reload: o }, t) : /* @__PURE__ */ h(B_, { onBuilt: r }) : /* @__PURE__ */ A(we, { children: [
    /* @__PURE__ */ h(ii, { title: "System Map" }),
    /* @__PURE__ */ h("div", { className: "sm-page", children: /* @__PURE__ */ h(Do, { rows: 6 }) })
  ] });
}
function W_({
  repo: e,
  projects: t,
  choose: n,
  reload: r
}) {
  var jn, Yn;
  const o = wa(), { overview: i, error: s, refresh: a } = Cd(e), l = i == null ? void 0 : i.manifest.version, [c, d] = re(0), f = l ? `${l}:${c}` : void 0, u = Kt("/graph", e, f), p = Kt("/system", e, f), g = Kt("/plan", e, f), b = Kt("/findings", e, f), v = Kt("/risk", e, f), y = u.value, _ = p.value, m = g.value, w = b.value, S = v.value, k = le(() => (m == null ? void 0 : m.plans) ?? [], [m]), E = le(() => (w == null ? void 0 : w.findings) ?? [], [w]), L = Di("/worktrees", e, T_), $ = L.value, B = Di("/explore", e, L_), [O, W] = re("whatif"), [H, x] = re(null), [C, N] = re(0), I = Md(H, e, C), [z, M] = re(!1), [T, P] = re(null), [R, Y] = re(() => Id(localStorage, e)), [j, U] = re(null), [ee, G] = re(null), [D, F] = re(!0), [Z, Q] = re(!1), [q, J] = re(!0), [te, ne] = re(null), [ie, ae] = re(null), [_e, Ae] = re("names"), [ve, Oe] = re(() => $d(localStorage)), Ze = oe(null), Pe = oe(!1), [Qe, ke] = re(!1), [Se, Ne] = re(null), { ref: Je, height: Ft, width: it } = R_(), jt = (i == null ? void 0 : i.freshness.missing) === !0, be = D_(i && !jt ? i.manifest.repo : null, e), st = Le(
    (V) => {
      Ad(localStorage, e, V), Y(V);
    },
    [e]
  );
  ce(() => {
    var V;
    Pe.current && ((V = Ze.current) == null || V.focus()), Pe.current = !1;
  }, [ve]), ce(() => {
    if (!Se) return;
    const V = window.setTimeout(() => Ne(null), z_);
    return () => window.clearTimeout(V);
  }, [Se]);
  const Cn = R === "map" ? ee && !/^(area|group):/.test(ee) ? ee : null : R === "data" ? j : null, gt = z && (I != null && I.diff.added.some((V) => V.id === Cn)) ? null : Cn, Mt = Td(gt, e), Mn = le(() => {
    const V = /* @__PURE__ */ new Map();
    for (const fe of E)
      fe.severity !== "info" && V.set(fe.node, (V.get(fe.node) ?? 0) + 1);
    return V;
  }, [E]), In = le(() => Ld($), [$]), $n = k.filter((V) => V.status === "planned" || V.status === "partial").length, Gr = (($ == null ? void 0 : $.counts.high) ?? 0) + (($ == null ? void 0 : $.counts.medium) ?? 0), Xr = (S == null ? void 0 : S.modules.filter((V) => V.hot && V.untested).length) ?? 0, Ur = ((jn = B.value) == null ? void 0 : jn.proposals.filter((V) => V.status === "draft").length) ?? 0, qr = { findings: E.length, plan: $n, risk: Xr, worktrees: Gr, explore: Ur }, De = z ? I : null, Yt = le(() => _ ? zd(_, De) : null, [_, De]), Gt = le(() => {
    const V = (De == null ? void 0 : De.graph) ?? y;
    return V && (T == null ? void 0 : T.level) === "data" ? Od(V, T.resolved) : V;
  }, [y, De, T]), Kr = async () => {
    ke(!0), Ne(null), ae(null);
    try {
      const V = await o.post(`${Zt}/build`, { repo: e });
      await a(), await r(), Ne(V.unchanged ? "No changes" : "Rebuilt");
    } catch (V) {
      ae(or(V, "rebuild this project"));
    } finally {
      ke(!1);
    }
  }, Xt = async (V, fe) => {
    ae(null);
    try {
      await fe();
    } catch (Te) {
      ae(or(Te, V));
    }
  }, Zr = () => {
    Mt && be.send(`Use the system-map tools. Look at ${Mt.id} and tell me what to watch out for.`);
  }, An = (V) => {
    be.send(`Use the system-map tools. Check finding ${V.id} on ${V.node}, read its evidence, and propose a fix.`);
  }, Qr = (V) => {
    be.send(`Use the system-map tools. Look at ${V.id}, say what is left to build, and propose the next step.`);
  }, Jr = (V) => {
    be.send(`Use the system-map tools. Look at ${V} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, eo = (V) => {
    be.send(`Use the system-map tools. Worktrees ${V.a} and ${V.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, to = () => {
    be.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, no = async () => {
    ne(null);
    try {
      await o.post(`${Zt}/coverage`, { repo: e }), d((V) => V + 1);
    } catch (V) {
      ne(or(V, "load the coverage report"));
    }
  }, ro = (V) => {
    M(!0), P(null), G(null);
    const fe = [...(I == null ? void 0 : I.diff.added) ?? [], ...(I == null ? void 0 : I.diff.changed) ?? []].find((Te) => Te.id.startsWith("table:"));
    U(V === "data" ? (fe == null ? void 0 : fe.id) ?? null : null), st(V);
  }, oo = (V, fe) => Xt("change this proposal", async () => {
    await o.post(`${Zt}/proposal-status`, { repo: e, id: V, status: fe }), N((Te) => Te + 1), await B.refresh();
  }), io = (V, fe) => Xt("delete this", async () => {
    await o.post(`${Zt}/intent-delete`, { repo: e, kind: V, id: fe }), V === "proposals" && (x(null), M(!1)), await B.refresh();
  }), so = (V) => {
    P(V), Q(V.overlays.risk), J(V.overlays.worktrees), F(V.overlays.plans), x(V.proposal), M(V.proposal !== null), G(null), U(null), st(V.level);
  }, ao = () => {
    M(!1), P(null), U(null), G(null);
  }, Tn = (V, fe) => Xt("change this plan", async () => {
    await o.post(`${Zt}/plan-status`, { repo: e, id: V, status: fe }), d((Te) => Te + 1);
  }), It = (V) => {
    st("data"), U(V);
  }, at = (V) => {
    st("map"), G(V);
  }, lo = (V) => {
    R === "data" && V.startsWith("table:") ? U(V) : at(V);
  }, Ln = (V) => {
    V.startsWith("table:") ? It(V) : at(V);
  }, zn = () => {
    Pe.current = !0, Fd(localStorage, !ve), Oe(!ve);
  }, On = Vd(R), Pn = On && ve, Dn = R === "map" ? "modules" : "tables", Ut = On && !ve && it >= Nr ? /* @__PURE__ */ A("button", { ref: Ze, type: "button", className: "sm-plain sm-layers sm-show-list", onClick: zn, children: [
    "Show ",
    Dn
  ] }) : null, Rn = (De == null ? void 0 : De.title) ?? (T == null ? void 0 : T.title), Hn = Rn ? /* @__PURE__ */ h(wx, { title: Rn, onBack: ao }) : null, co = P_.map((V) => ({ ...V, count: qr[V.value] || void 0 })), Ce = i == null ? void 0 : i.freshness, Bn = Ce ? Pd(Dd(Ce), Ce.commits_behind, Ce.ref) : null, Wn = ((Yn = Ce == null ? void 0 : Ce.changed_inputs) == null ? void 0 : Yn.length) ?? 0, uo = /* @__PURE__ */ A(we, { children: [
    /* @__PURE__ */ A("div", { className: "sm-tool-row", children: [
      Ut,
      /* @__PURE__ */ h(
        yx,
        {
          layers: [
            o_($n, D, () => F((V) => !V)),
            { key: "risk", label: "Risk", on: Z, title: "Mark hot and untested code on the map", onToggle: () => Q((V) => !V) },
            { key: "work", label: "Worktrees", on: q, title: "Show what each worktree is changing", onToggle: () => J((V) => !V) }
          ]
        }
      )
    ] }),
    Hn
  ] }), fo = /* @__PURE__ */ A(we, { children: [
    /* @__PURE__ */ A("div", { className: "sm-tool-row", children: [
      Ut,
      /* @__PURE__ */ h(
        ud,
        {
          ariaLabel: "How much of each table to show",
          layoutId: "system-map-density",
          collapse: !1,
          segments: O_,
          value: _e,
          onChange: (V) => Ae(V)
        }
      )
    ] }),
    Hn
  ] }), qt = {
    map: Yt !== null,
    data: !!Gt,
    plan: m !== null,
    risk: S !== null,
    worktrees: $ !== null,
    findings: w !== null,
    explore: B.value !== null
  }, Vn = {
    map: p.failed,
    data: u.failed,
    plan: g.failed,
    risk: v.failed,
    worktrees: L.failed,
    findings: b.failed,
    explore: B.failed
  }, ho = () => {
    d((V) => V + 1), L.refresh(), B.refresh();
  }, Fn = Rd({ projects: t, activeKey: e, onPick: n, onReload: () => void r() }), po = /* @__PURE__ */ A("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }, children: [
    /* @__PURE__ */ h("span", { style: { whiteSpace: "nowrap" }, children: "System Map" }),
    /* @__PURE__ */ h("span", { "aria-hidden": "true", style: { ...K, fontWeight: 400 }, children: "/" }),
    Fn.menu
  ] });
  return /* @__PURE__ */ A(we, { children: [
    Fn.dialogs,
    /* @__PURE__ */ h(
      ii,
      {
        title: po,
        actions: i && Bn ? /* @__PURE__ */ h(
          u_,
          {
            status: Bn,
            detail: Ce != null && Ce.stale ? `${Wn} schema ${Wn === 1 ? "file" : "files"} changed on ${Ce.ref}` : void 0,
            commit: i.manifest.commit,
            builtAt: i.manifest.built_at,
            read: i.manifest.read,
            busy: Qe,
            result: Se,
            onRebuild: () => void Kr()
          }
        ) : void 0
      }
    ),
    /* @__PURE__ */ A("div", { ref: Je, className: "sm-page", style: { height: Ft, display: "flex", flexDirection: "column", gap: ma, minHeight: 0 }, children: [
      s && !i && /* @__PURE__ */ A(rr, { children: [
        s,
        " ",
        /* @__PURE__ */ h(de, { onClick: () => void a(), children: "Try again" })
      ] }),
      !i && !s && /* @__PURE__ */ h(Do, { rows: 6 }),
      ie && /* @__PURE__ */ h(rr, { onDismiss: () => ae(null), children: ie }),
      jt && i && /* @__PURE__ */ A(rr, { children: [
        "The folder for this project is gone: ",
        /* @__PURE__ */ h("span", { className: "sm-mono", children: i.manifest.repo }),
        ". You can still read the last model. To go on, move the folder back, or remove the project from the project menu."
      ] }),
      i && /* @__PURE__ */ A(we, { children: [
        /* @__PURE__ */ h(E_, { items: co, value: R, onChange: st, label: "System Map views" }),
        /* @__PURE__ */ A(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: ma,
              gridTemplateColumns: Vx(it, Pn),
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              Pn && it >= Nr && /* @__PURE__ */ A(mo, { style: Po, "data-testid": "side-list", children: [
                /* @__PURE__ */ A("div", { className: "sm-list-head", children: [
                  /* @__PURE__ */ h(Pi, { children: R === "map" ? "Modules" : "Tables" }),
                  /* @__PURE__ */ h("button", { ref: Ze, type: "button", className: "sm-plain sm-hide-list", "aria-label": `Hide ${Dn}`, onClick: zn, children: "Hide" })
                ] }),
                R === "map" ? /* @__PURE__ */ h(Hd, { nodes: (_ == null ? void 0 : _.nodes) ?? [], focus: ee, onSelect: at }) : /* @__PURE__ */ h(Bd, { tables: i.tables, selected: j, flagged: Mn, working: In, onSelect: It })
              ] }),
              /* @__PURE__ */ A(
                mo,
                {
                  style: { ...Po, padding: 0, position: "relative" },
                  "data-testid": "canvas",
                  id: Qc,
                  role: "tabpanel",
                  "aria-labelledby": `system-map-tab-${R}`,
                  children: [
                    !qt[R] && !Vn[R] && /* @__PURE__ */ h(Do, { rows: 6 }),
                    !qt[R] && Vn[R] && /* @__PURE__ */ h("div", { style: { padding: 12 }, children: /* @__PURE__ */ A(rr, { children: [
                      "Couldn't load this view. ",
                      /* @__PURE__ */ h(de, { onClick: ho, children: "Try again" })
                    ] }) }),
                    R === "map" && Yt && /* @__PURE__ */ h(
                      x_,
                      {
                        system: Yt,
                        focus: ee,
                        tables: i.manifest.counts.tables,
                        showPlans: D,
                        inspecting: gt !== null,
                        risk: Z ? S : null,
                        worktrees: q ? $ : null,
                        only: (T == null ? void 0 : T.level) === "map" ? T.resolved : null,
                        layout: (T == null ? void 0 : T.layout) ?? "left-right",
                        tools: uo,
                        onFocus: (V) => {
                          P(null), G(V);
                        },
                        onOpenTables: () => st("data")
                      }
                    ),
                    R === "data" && i.tables.length === 0 && !z && /* @__PURE__ */ h(H_, { read: i.manifest.read }),
                    R === "data" && Gt && (i.tables.length > 0 || z) && /* @__PURE__ */ h(Cx, { graph: Gt, selected: j, flagged: Mn, working: In, density: _e, tools: fo, onSelect: U }),
                    R === "explore" && B.value && /* @__PURE__ */ h(
                      Rx,
                      {
                        data: B.value,
                        proposal: I,
                        shownProposal: z ? H : null,
                        canAsk: be.slot !== null,
                        tab: O,
                        onTab: W,
                        onSend: be.send,
                        onOpenProposal: x,
                        onDrawProposal: ro,
                        onStatus: (V, fe) => void oo(V, fe),
                        onDelete: (V, fe) => void io(V, fe),
                        onOpenView: so,
                        onNode: Ln
                      }
                    ),
                    R === "plan" && m && /* @__PURE__ */ h(r_, { plans: k, onShow: at, onAsk: Qr, onStatus: (V, fe) => void Tn(V, fe) }),
                    R === "risk" && S && /* @__PURE__ */ h(
                      d_,
                      {
                        risk: S,
                        canAsk: be.slot !== null,
                        error: te,
                        onShow: at,
                        onAsk: Jr,
                        onLoad: () => void no(),
                        onRun: to
                      }
                    ),
                    R === "worktrees" && $ && /* @__PURE__ */ h(A_, { state: $, checkedAt: L.checkedAt, canAsk: be.slot !== null, onShow: Ln, onAsk: eo }),
                    R === "findings" && w && /* @__PURE__ */ h(Bx, { findings: E, noSchema: i.tables.length === 0, onShow: It, onAsk: An }),
                    Mt && gt && /* @__PURE__ */ h(
                      Qx,
                      {
                        node: Mt,
                        work: ($ == null ? void 0 : $.by_node[gt]) ?? [],
                        overlaps: Wd(gt, $),
                        canAsk: be.slot !== null,
                        onAsk: Zr,
                        onAskFinding: An,
                        onOpen: lo,
                        onClose: () => R === "data" ? U(null) : G(null)
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ A(mo, { style: it >= Zc ? Po : { display: "none" }, children: [
                /* @__PURE__ */ h(Pi, { children: "Design chat" }),
                be.error && /* @__PURE__ */ h("p", { style: { fontSize: 13 }, children: be.error }),
                jt && /* @__PURE__ */ h("p", { style: { ...K, fontSize: 13 }, children: "Chat needs this project's folder." }),
                /* @__PURE__ */ h("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: be.slot && /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ h(cd, { slotKey: be.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Q_ as default
};
