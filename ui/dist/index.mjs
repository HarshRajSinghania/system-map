var fd = Object.defineProperty;
var hd = (e, t, n) => t in e ? fd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var me = (e, t, n) => hd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as h, jsxs as $, Fragment as be } from "react/jsx-runtime";
import { useTheme as xa, useAppApi as _a, ChatEmbed as pd } from "@kirocrew/app-sdk";
import { Badge as xe, Btn as de, Input as li, PageHeader as ci, ContentSkeleton as Ho, EmptyState as ka, Card as wo, CardTitle as Bi, SegmentedControl as gd } from "@kirocrew/app-sdk/ui";
import di, { memo as fe, forwardRef as Ea, useState as te, createContext as $r, useCallback as $e, useMemo as le, useContext as Ft, useRef as oe, useEffect as ce, useLayoutEffect as ui } from "react";
import { M as Z, a as Oe, A as Ie, S as bn, s as vn, p as Ar, N as md, D as Sa, b as yd, r as wd, C as Na, c as ir, d as sr, e as bd, f as vd, g as xd, h as _d, w as kd, t as Ed, G as Sd, i as Nd, j as Cd, k as Md, u as Id, l as $d, m as Ad, n as Kt, o as Wi, q as Td, v as zd, x as Ld, y as Od, z as Pd, B as Dd, E as Rd, F as Hd, H as Bd, I as Wd, J as Vd, K as Fd, T as jd, L as Yd, O as Gd, P as on, Q as Qt, R as Xd, U as Ud, V as qd, W as Zd, X as Kd } from "./chunks/ProjectMenu-D7XP-hB7.mjs";
import "react-dom";
function Ca(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Qd = "\0", mt = "\0", Vi = "";
let Jd = class {
  constructor(t) {
    me(this, "_isDirected", !0);
    me(this, "_isMultigraph", !1);
    me(this, "_isCompound", !1);
    // Label for the graph itself
    me(this, "_label");
    // Defaults to be set when creating a new node
    me(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    me(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    me(this, "_nodes", {});
    // v -> edgeObj
    me(this, "_in", {});
    // u -> v -> Number
    me(this, "_preds", {});
    // v -> edgeObj
    me(this, "_out", {});
    // v -> w -> Number
    me(this, "_sucs", {});
    // e -> edgeObj
    me(this, "_edgeObjs", {});
    // e -> label
    me(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    me(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    me(this, "_edgeCount", 0);
    me(this, "_parent");
    me(this, "_children");
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
    var a = tn(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = eu(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, Fi(this._preds[n], t), Fi(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? bo(this._isDirected, arguments[0]) : tn(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? bo(this._isDirected, arguments[0]) : tn(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? bo(this._isDirected, arguments[0]) : tn(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], ji(this._preds[n], t), ji(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function Fi(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function ji(e, t) {
  --e[t] || delete e[t];
}
function tn(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + Vi + i + Vi + (r === void 0 ? Qd : r);
}
function eu(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function bo(e, t) {
  return tn(e, t.v, t.w, t.name);
}
var fi = Jd, tu = "2.2.4", nu = {
  Graph: fi,
  version: tu
}, ru = fi, ou = {
  write: iu,
  read: lu
};
function iu(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: su(e),
    edges: au(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function su(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function au(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function lu(e) {
  var t = new ru(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var cu = du;
function du(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let uu = class {
  constructor() {
    me(this, "_arr", []);
    me(this, "_keyIndices", {});
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
var Ma = uu, fu = Ma, Ia = pu, hu = () => 1;
function pu(e, t, n, r) {
  return gu(
    e,
    String(t),
    n || hu,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function gu(e, t, n, r) {
  var o = {}, i = new fu(), s, a, l = function(c) {
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
var mu = Ia, yu = wu;
function wu(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = mu(e, o, t, n), r;
  }, {});
}
var $a = bu;
function bu(e) {
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
var vu = $a, xu = _u;
function _u(e) {
  return vu(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var ku = Su, Eu = () => 1;
function Su(e, t, n) {
  return Nu(
    e,
    t || Eu,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function Nu(e, t, n) {
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
function Aa(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new Bo();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new Bo();
  return r;
}
class Bo extends Error {
  constructor() {
    super(...arguments);
  }
}
var Ta = Aa;
Aa.CycleException = Bo;
var Yi = Ta, Cu = Mu;
function Mu(e) {
  try {
    Yi(e);
  } catch (t) {
    if (t instanceof Yi.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var za = Iu;
function Iu(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? $u : Au, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function $u(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), La(t(i[0]), (s) => o.push([s, !1])));
  }
}
function Au(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), La(t(i), (s) => o.push(s)));
  }
}
function La(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var Tu = za, zu = Lu;
function Lu(e, t) {
  return Tu(e, t, "post");
}
var Ou = za, Pu = Du;
function Du(e, t) {
  return Ou(e, t, "pre");
}
var Ru = fi, Hu = Ma, Bu = Wu;
function Wu(e, t) {
  var n = new Ru(), r = {}, o = new Hu(), i;
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
var Vu = {
  components: cu,
  dijkstra: Ia,
  dijkstraAll: yu,
  findCycles: xu,
  floydWarshall: ku,
  isAcyclic: Cu,
  postorder: zu,
  preorder: Pu,
  prim: Bu,
  tarjan: $a,
  topsort: Ta
}, Gi = nu, je = {
  Graph: Gi.Graph,
  json: ou,
  alg: Vu,
  version: Gi.version
};
let Fu = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return Xi(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && Xi(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, ju)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function Xi(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function ju(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var Yu = Fu;
let Gu = je.Graph, Xu = Yu;
var Uu = Zu;
let qu = () => 1;
function Zu(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = Qu(e, t || qu);
  return Ku(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function Ku(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      vo(e, t, n, s);
    for (; s = o.dequeue(); )
      vo(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(vo(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function vo(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, Wo(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, Wo(t, n, c);
  }), e.removeNode(r.v), i;
}
function Qu(e, t) {
  let n = new Gu(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), d = l + c;
    n.setEdge(a.v, a.w, d), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = Ju(o + r + 3).map(() => new Xu()), s = r + 1;
  return n.nodes().forEach((a) => {
    Wo(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function Wo(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function Ju(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let Oa = je.Graph;
var ye = {
  addBorderNode: cf,
  addDummyNode: Pa,
  applyWithChunking: Tr,
  asNonCompoundGraph: tf,
  buildLayerMatrix: sf,
  intersectRect: of,
  mapValues: mf,
  maxRank: Ra,
  normalizeRanks: af,
  notime: hf,
  partition: uf,
  pick: gf,
  predecessorWeights: rf,
  range: Ba,
  removeEmptyRanks: lf,
  simplify: ef,
  successorWeights: nf,
  time: ff,
  uniqueId: Ha,
  zipObject: hi
};
function Pa(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = Ha(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function ef(e) {
  let t = new Oa().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function tf(e) {
  let t = new Oa({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function nf(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return hi(e.nodes(), t);
}
function rf(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return hi(e.nodes(), t);
}
function of(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function sf(e) {
  let t = Ba(Ra(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function af(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Tr(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function lf(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Tr(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function cf(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), Pa(e, "border", o, t);
}
function df(e, t = Da) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const Da = 65535;
function Tr(e, t) {
  if (t.length > Da) {
    const n = df(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function Ra(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Tr(Math.max, n);
}
function uf(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function ff(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function hf(e, t) {
  return t();
}
let pf = 0;
function Ha(e) {
  var t = ++pf;
  return e + ("" + t);
}
function Ba(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function gf(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function mf(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function hi(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let yf = Uu, wf = ye.uniqueId;
var bf = {
  run: vf,
  undo: _f
};
function vf(e) {
  (e.graph().acyclicer === "greedy" ? yf(e, n(e)) : xf(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, wf("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function xf(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function _f(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let kf = ye;
var Ef = {
  run: Sf,
  undo: Cf
};
function Sf(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => Nf(e, t));
}
function Nf(e, t) {
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
    }, c = kf.addDummyNode(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function Cf(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: Mf } = ye;
var zr = {
  longestPath: If,
  slack: $f
};
function If(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = Mf(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function $f(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Af = je.Graph, gr = zr.slack, Wa = Tf;
function Tf(e) {
  var t = new Af({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; zf(t, e) < r; )
    o = Lf(t, e), i = t.hasNode(o.v) ? gr(e, o) : -gr(e, o), Of(t, e, i);
  return t;
}
function zf(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !gr(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Lf(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = gr(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Of(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Pf = Wa, Ui = zr.slack, Df = zr.longestPath, Rf = je.alg.preorder, Hf = je.alg.postorder, Bf = ye.simplify, Wf = Mt;
Mt.initLowLimValues = gi;
Mt.initCutValues = pi;
Mt.calcCutValue = Va;
Mt.leaveEdge = ja;
Mt.enterEdge = Ya;
Mt.exchangeEdges = Ga;
function Mt(e) {
  e = Bf(e), Df(e);
  var t = Pf(e);
  gi(t), pi(t, e);
  for (var n, r; n = ja(t); )
    r = Ya(t, e, n), Ga(t, e, n, r);
}
function pi(e, t) {
  var n = Hf(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => Vf(e, t, r));
}
function Vf(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = Va(e, t, n);
}
function Va(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, d = c ? l.w : l.v;
    if (d !== o) {
      var f = c === i, u = t.edge(l).weight;
      if (a += f ? u : -u, jf(e, n, d)) {
        var p = e.edge(n, d).cutvalue;
        a += f ? -p : p;
      }
    }
  }), a;
}
function gi(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), Fa(e, {}, 1, t);
}
function Fa(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = Fa(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function ja(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function Ya(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((d) => l === qi(e, e.node(d.v), a) && l !== qi(e, e.node(d.w), a));
  return c.reduce((d, f) => Ui(t, f) < Ui(t, d) ? f : d);
}
function Ga(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), gi(e), pi(e, t), Ff(e, t);
}
function Ff(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = Rf(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function jf(e, t, n) {
  return e.hasEdge(t, n);
}
function qi(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var Yf = zr, Xa = Yf.longestPath, Gf = Wa, Xf = Wf, Uf = qf;
function qf(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      Zi(e);
      break;
    case "tight-tree":
      Kf(e);
      break;
    case "longest-path":
      Zf(e);
      break;
    case "none":
      break;
    default:
      Zi(e);
  }
}
var Zf = Xa;
function Kf(e) {
  Xa(e), Gf(e);
}
function Zi(e) {
  Xf(e);
}
var Qf = Jf;
function Jf(e) {
  let t = th(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = eh(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], d = !0;
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
function eh(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function th(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let mr = ye;
var nh = {
  run: rh,
  cleanup: sh
};
function rh(e) {
  let t = mr.addDummyNode(e, "root", {}, "_root"), n = oh(e), r = Object.values(n), o = mr.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = ih(e) + 1;
  e.children().forEach((a) => Ua(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function Ua(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = mr.addBorderNode(e, "_bt"), c = mr.addBorderNode(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(c, s), d.borderBottom = c, a.forEach((f) => {
    Ua(e, t, n, r, o, i, f);
    let u = e.node(f), p = u.borderTop ? u.borderTop : f, g = u.borderBottom ? u.borderBottom : f, v = u.borderTop ? r : 2 * r, w = p !== g ? 1 : o - i[s] + 1;
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
function oh(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function ih(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function sh(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let ah = ye;
var lh = ch;
function ch(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        Ki(e, "borderLeft", "_bl", n, o, i), Ki(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function Ki(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = ah.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var dh = {
  adjust: uh,
  undo: fh
};
function uh(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && qa(e);
}
function fh(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && hh(e), (t === "lr" || t === "rl") && (ph(e), qa(e));
}
function qa(e) {
  e.nodes().forEach((t) => Qi(e.node(t))), e.edges().forEach((t) => Qi(e.edge(t)));
}
function Qi(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function hh(e) {
  e.nodes().forEach((t) => xo(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(xo), Object.hasOwn(n, "y") && xo(n);
  });
}
function xo(e) {
  e.y = -e.y;
}
function ph(e) {
  e.nodes().forEach((t) => _o(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(_o), Object.hasOwn(n, "x") && _o(n);
  });
}
function _o(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let Ji = ye;
var gh = mh;
function mh(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = Ji.applyWithChunking(Math.max, r), i = Ji.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let yh = ye.zipObject;
var wh = bh;
function bh(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += vh(e, t[r - 1], t[r]);
  return n;
}
function vh(e, t, n) {
  let r = yh(n, n.map((c, d) => d)), o = t.flatMap((c) => e.outEdges(c).map((d) => ({ pos: r[d.w], weight: e.edge(d).weight })).sort((d, f) => d.pos - f.pos)), i = 1;
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
var xh = _h;
function _h(e, t = []) {
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
let kh = ye;
var Eh = Sh;
function Sh(e, t) {
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
  return Nh(r);
}
function Nh(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Ch(o, i);
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
  return t.filter((o) => !o.merged).map((o) => kh.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function Ch(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let Mh = ye;
var Ih = $h;
function $h(e, t) {
  let n = Mh.partition(e, (d) => Object.hasOwn(d, "barycenter")), r = n.lhs, o = n.rhs.sort((d, f) => f.i - d.i), i = [], s = 0, a = 0, l = 0;
  r.sort(Ah(!!t)), l = es(i, o, l), r.forEach((d) => {
    l += d.vs.length, i.push(d.vs), s += d.barycenter * d.weight, a += d.weight, l = es(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function es(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function Ah(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Th = xh, zh = Eh, Lh = Ih;
var Oh = Za;
function Za(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((u) => u !== s && u !== a));
  let c = Th(e, o);
  c.forEach((u) => {
    if (e.children(u.v).length) {
      let p = Za(e, u.v, n, r);
      l[u.v] = p, Object.hasOwn(p, "barycenter") && Dh(u, p);
    }
  });
  let d = zh(c, n);
  Ph(d, l);
  let f = Lh(d, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let u = e.node(e.predecessors(s)[0]), p = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + u.order + p.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function Ph(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function Dh(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let Rh = je.Graph, Hh = ye;
var Bh = Wh;
function Wh(e, t, n, r) {
  r || (r = e.nodes());
  let o = Vh(e), i = new Rh({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
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
function Vh(e) {
  for (var t; e.hasNode(t = Hh.uniqueId("_root")); ) ;
  return t;
}
var Fh = jh;
function jh(e, t, n) {
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
let Yh = gh, Gh = wh, Xh = Oh, Uh = Bh, qh = Fh, Zh = je.Graph, Gn = ye;
var Kh = Ka;
function Ka(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, Ka);
    return;
  }
  let n = Gn.maxRank(e), r = ts(e, Gn.range(1, n + 1), "inEdges"), o = ts(e, Gn.range(n - 1, -1, -1), "outEdges"), i = Yh(e);
  if (ns(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    Qh(l % 2 ? r : o, l % 4 >= 2), i = Gn.buildLayerMatrix(e);
    let d = Gh(e, i);
    d < s && (c = 0, a = Object.assign({}, i), s = d);
  }
  ns(e, a);
}
function ts(e, t, n) {
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
    return Uh(e, i, n, r.get(i) || []);
  });
}
function Qh(e, t) {
  let n = new Zh();
  e.forEach(function(r) {
    let o = r.graph().root, i = Xh(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), qh(r, n, i.vs);
  });
}
function ns(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let Jh = je.Graph, nt = ye;
var ep = {
  positionX: up
};
function tp(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((d, f) => {
      let u = rp(e, d), p = u ? e.node(u).order : l;
      (u || d === c) && (i.slice(a, f + 1).forEach((g) => {
        e.predecessors(g).forEach((v) => {
          let w = e.node(v), m = w.order;
          (m < s || p < m) && !(w.dummy && e.node(g).dummy) && Qa(n, v, g);
        });
      }), a = f + 1, s = p);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function np(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let d;
    nt.range(s, a).forEach((f) => {
      d = i[f], e.node(d).dummy && e.predecessors(d).forEach((u) => {
        let p = e.node(u);
        p.dummy && (p.order < l || p.order > c) && Qa(n, u, d);
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
function rp(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function Qa(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function op(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function ip(e, t, n, r) {
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
          i[c] === c && l < s[g] && !op(n, c, g) && (i[g] = c, i[c] = o[c] = o[g], l = s[g]);
        }
      }
    });
  }), { root: o, align: i };
}
function sp(e, t, n, r, o) {
  let i = {}, s = ap(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, u) {
    let p = s.nodes(), g = p.pop(), v = {};
    for (; g; )
      v[g] ? f(g) : (v[g] = !0, p.push(g), p = p.concat(u(g))), g = p.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((u, p) => Math.max(u, i[p.v] + s.edge(p)), 0);
  }
  function d(f) {
    let u = s.outEdges(f).reduce((g, v) => Math.min(g, i[v.w] - s.edge(v)), Number.POSITIVE_INFINITY), p = e.node(f);
    u !== Number.POSITIVE_INFINITY && p.borderType !== a && (i[f] = Math.max(i[f], u));
  }
  return l(c, s.predecessors.bind(s)), l(d, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function ap(e, t, n, r) {
  let o = new Jh(), i = e.graph(), s = fp(i.nodesep, i.edgesep, r);
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
function lp(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = hp(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function cp(e, t) {
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
function dp(e, t) {
  return nt.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function up(e) {
  let t = nt.buildLayerMatrix(e), n = Object.assign(
    tp(e, t),
    np(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = ip(e, o, n, l), d = sp(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (d = nt.mapValues(d, (f) => -f)), r[s + a] = d;
    });
  });
  let i = lp(e, r);
  return cp(r, i), dp(r, e.graph().align);
}
function fp(e, t, n) {
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
function hp(e, t) {
  return e.node(t).width;
}
let Ja = ye, pp = ep.positionX;
var gp = mp;
function mp(e) {
  e = Ja.asNonCompoundGraph(e), yp(e), Object.entries(pp(e)).forEach(([t, n]) => e.node(t).x = n);
}
function yp(e) {
  let t = Ja.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let rs = bf, os = Ef, wp = Uf, bp = ye.normalizeRanks, vp = Qf, xp = ye.removeEmptyRanks, is = nh, _p = lh, ss = dh, kp = Kh, Ep = gp, Le = ye, Sp = je.Graph;
var Np = Cp;
function Cp(e, t) {
  let n = t && t.debugTiming ? Le.time : Le.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => Dp(e));
    n("  runLayout", () => Mp(r, n, t)), n("  updateInputGraph", () => Ip(e, r));
  });
}
function Mp(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => Rp(e)), t("    removeSelfEdges", () => Xp(e)), t("    acyclic", () => rs.run(e)), t("    nestingGraph.run", () => is.run(e)), t("    rank", () => wp(Le.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Hp(e)), t("    removeEmptyRanks", () => xp(e)), t("    nestingGraph.cleanup", () => is.cleanup(e)), t("    normalizeRanks", () => bp(e)), t("    assignRankMinMax", () => Bp(e)), t("    removeEdgeLabelProxies", () => Wp(e)), t("    normalize.run", () => os.run(e)), t("    parentDummyChains", () => vp(e)), t("    addBorderSegments", () => _p(e)), t("    order", () => kp(e, n)), t("    insertSelfEdges", () => Up(e)), t("    adjustCoordinateSystem", () => ss.adjust(e)), t("    position", () => Ep(e)), t("    positionSelfEdges", () => qp(e)), t("    removeBorderNodes", () => Gp(e)), t("    normalize.undo", () => os.undo(e)), t("    fixupEdgeLabelCoords", () => jp(e)), t("    undoCoordinateSystem", () => ss.undo(e)), t("    translateGraph", () => Vp(e)), t("    assignNodeIntersects", () => Fp(e)), t("    reversePoints", () => Yp(e)), t("    acyclic.undo", () => rs.undo(e));
}
function Ip(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let $p = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], Ap = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Tp = ["acyclicer", "ranker", "rankdir", "align"], zp = ["width", "height", "rank"], as = { width: 0, height: 0 }, Lp = ["minlen", "weight", "width", "height", "labeloffset"], Op = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Pp = ["labelpos"];
function Dp(e) {
  let t = new Sp({ multigraph: !0, compound: !0 }), n = Eo(e.graph());
  return t.setGraph(Object.assign(
    {},
    Ap,
    ko(n, $p),
    Le.pick(n, Tp)
  )), e.nodes().forEach((r) => {
    let o = Eo(e.node(r));
    const i = ko(o, zp);
    Object.keys(as).forEach((s) => {
      i[s] === void 0 && (i[s] = as[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = Eo(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Op,
      ko(o, Lp),
      Le.pick(o, Pp)
    ));
  }), t;
}
function Rp(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Hp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      Le.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Bp(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function Wp(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Vp(e) {
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
function Fp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(Le.intersectRect(r, i)), n.points.push(Le.intersectRect(o, s));
  });
}
function jp(e) {
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
function Yp(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function Gp(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Xp(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function Up(e) {
  var t = Le.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        Le.addDummyNode(e, "selfedge", {
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
function qp(e) {
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
function ko(e, t) {
  return Le.mapValues(Le.pick(e, t), Number);
}
function Eo(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let Zp = ye, Kp = je.Graph;
var Qp = {
  debugOrdering: Jp
};
function Jp(e) {
  let t = Zp.buildLayerMatrix(e), n = new Kp({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var eg = "1.1.8", tg = {
  graphlib: je,
  layout: Np,
  debug: Qp,
  util: {
    time: ye.time,
    notime: ye.notime
  },
  version: eg
};
const yr = /* @__PURE__ */ Ca(tg);
function we(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = we(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var ng = { value: () => {
} };
function Lr() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new ar(n);
}
function ar(e) {
  this._ = e;
}
function rg(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
ar.prototype = Lr.prototype = {
  constructor: ar,
  on: function(e, t) {
    var n = this._, r = rg(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = og(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = ls(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = ls(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new ar(e);
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
function og(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function ls(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = ng, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Vo = "http://www.w3.org/1999/xhtml";
const cs = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Vo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Or(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), cs.hasOwnProperty(t) ? { space: cs[t], local: e } : e;
}
function ig(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Vo && t.documentElement.namespaceURI === Vo ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function sg(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function el(e) {
  var t = Or(e);
  return (t.local ? sg : ig)(t);
}
function ag() {
}
function mi(e) {
  return e == null ? ag : function() {
    return this.querySelector(e);
  };
}
function lg(e) {
  typeof e != "function" && (e = mi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = i[d]) && (c = e.call(l, l.__data__, d, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Ae(r, this._parents);
}
function cg(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function dg() {
  return [];
}
function tl(e) {
  return e == null ? dg : function() {
    return this.querySelectorAll(e);
  };
}
function ug(e) {
  return function() {
    return cg(e.apply(this, arguments));
  };
}
function fg(e) {
  typeof e == "function" ? e = ug(e) : e = tl(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new Ae(r, o);
}
function nl(e) {
  return function() {
    return this.matches(e);
  };
}
function rl(e) {
  return function(t) {
    return t.matches(e);
  };
}
var hg = Array.prototype.find;
function pg(e) {
  return function() {
    return hg.call(this.children, e);
  };
}
function gg() {
  return this.firstElementChild;
}
function mg(e) {
  return this.select(e == null ? gg : pg(typeof e == "function" ? e : rl(e)));
}
var yg = Array.prototype.filter;
function wg() {
  return Array.from(this.children);
}
function bg(e) {
  return function() {
    return yg.call(this.children, e);
  };
}
function vg(e) {
  return this.selectAll(e == null ? wg : bg(typeof e == "function" ? e : rl(e)));
}
function xg(e) {
  typeof e != "function" && (e = nl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ae(r, this._parents);
}
function ol(e) {
  return new Array(e.length);
}
function _g() {
  return new Ae(this._enter || this._groups.map(ol), this._parents);
}
function wr(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
wr.prototype = {
  constructor: wr,
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
function kg(e) {
  return function() {
    return e;
  };
}
function Eg(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new wr(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function Sg(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = t.length, f = i.length, u = new Array(d), p;
  for (a = 0; a < d; ++a)
    (l = t[a]) && (u[a] = p = s.call(l, l.__data__, a, t) + "", c.has(p) ? o[a] = l : c.set(p, l));
  for (a = 0; a < f; ++a)
    p = s.call(e, i[a], a, i) + "", (l = c.get(p)) ? (r[a] = l, l.__data__ = i[a], c.delete(p)) : n[a] = new wr(e, i[a]);
  for (a = 0; a < d; ++a)
    (l = t[a]) && c.get(u[a]) === l && (o[a] = l);
}
function Ng(e) {
  return e.__data__;
}
function Cg(e, t) {
  if (!arguments.length) return Array.from(this, Ng);
  var n = t ? Sg : Eg, r = this._parents, o = this._groups;
  typeof e != "function" && (e = kg(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var d = r[c], f = o[c], u = f.length, p = Mg(e.call(d, d && d.__data__, c, r)), g = p.length, v = a[c] = new Array(g), w = s[c] = new Array(g), m = l[c] = new Array(u);
    n(d, f, v, w, m, p, t);
    for (var _ = 0, y = 0, b, E; _ < g; ++_)
      if (b = v[_]) {
        for (_ >= y && (y = _ + 1); !(E = w[y]) && ++y < g; ) ;
        b._next = E || null;
      }
  }
  return s = new Ae(s, r), s._enter = a, s._exit = l, s;
}
function Mg(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Ig() {
  return new Ae(this._exit || this._groups.map(ol), this._parents);
}
function $g(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function Ag(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], d = r[l], f = c.length, u = a[l] = new Array(f), p, g = 0; g < f; ++g)
      (p = c[g] || d[g]) && (u[g] = p);
  for (; l < o; ++l)
    a[l] = n[l];
  return new Ae(a, this._parents);
}
function Tg() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function zg(e) {
  e || (e = Lg);
  function t(f, u) {
    return f && u ? e(f.__data__, u.__data__) : !f - !u;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(t);
  }
  return new Ae(o, this._parents).order();
}
function Lg(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Og() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Pg() {
  return Array.from(this);
}
function Dg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function Rg() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Hg() {
  return !this.node();
}
function Bg(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function Wg(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Vg(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Fg(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function jg(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Yg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Gg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Xg(e, t) {
  var n = Or(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Vg : Wg : typeof t == "function" ? n.local ? Gg : Yg : n.local ? jg : Fg)(n, t));
}
function il(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Ug(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function qg(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Zg(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function Kg(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Ug : typeof t == "function" ? Zg : qg)(e, t, n ?? "")) : Ot(this.node(), e);
}
function Ot(e, t) {
  return e.style.getPropertyValue(t) || il(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Qg(e) {
  return function() {
    delete this[e];
  };
}
function Jg(e, t) {
  return function() {
    this[e] = t;
  };
}
function em(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function tm(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Qg : typeof t == "function" ? em : Jg)(e, t)) : this.node()[e];
}
function sl(e) {
  return e.trim().split(/^|\s+/);
}
function yi(e) {
  return e.classList || new al(e);
}
function al(e) {
  this._node = e, this._names = sl(e.getAttribute("class") || "");
}
al.prototype = {
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
function ll(e, t) {
  for (var n = yi(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function cl(e, t) {
  for (var n = yi(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function nm(e) {
  return function() {
    ll(this, e);
  };
}
function rm(e) {
  return function() {
    cl(this, e);
  };
}
function om(e, t) {
  return function() {
    (t.apply(this, arguments) ? ll : cl)(this, e);
  };
}
function im(e, t) {
  var n = sl(e + "");
  if (arguments.length < 2) {
    for (var r = yi(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? om : t ? nm : rm)(n, t));
}
function sm() {
  this.textContent = "";
}
function am(e) {
  return function() {
    this.textContent = e;
  };
}
function lm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function cm(e) {
  return arguments.length ? this.each(e == null ? sm : (typeof e == "function" ? lm : am)(e)) : this.node().textContent;
}
function dm() {
  this.innerHTML = "";
}
function um(e) {
  return function() {
    this.innerHTML = e;
  };
}
function fm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function hm(e) {
  return arguments.length ? this.each(e == null ? dm : (typeof e == "function" ? fm : um)(e)) : this.node().innerHTML;
}
function pm() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function gm() {
  return this.each(pm);
}
function mm() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ym() {
  return this.each(mm);
}
function wm(e) {
  var t = typeof e == "function" ? e : el(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function bm() {
  return null;
}
function vm(e, t) {
  var n = typeof e == "function" ? e : el(e), r = t == null ? bm : typeof t == "function" ? t : mi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function xm() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function _m() {
  return this.each(xm);
}
function km() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Em() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Sm(e) {
  return this.select(e ? Em : km);
}
function Nm(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Cm(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Mm(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function Im(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function $m(e, t, n) {
  return function() {
    var r = this.__on, o, i = Cm(t);
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
function Am(e, t, n) {
  var r = Mm(e + ""), o, i = r.length, s;
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
  for (a = t ? $m : Im, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function dl(e, t, n) {
  var r = il(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Tm(e, t) {
  return function() {
    return dl(this, e, t);
  };
}
function zm(e, t) {
  return function() {
    return dl(this, e, t.apply(this, arguments));
  };
}
function Lm(e, t) {
  return this.each((typeof t == "function" ? zm : Tm)(e, t));
}
function* Om() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var ul = [null];
function Ae(e, t) {
  this._groups = e, this._parents = t;
}
function xn() {
  return new Ae([[document.documentElement]], ul);
}
function Pm() {
  return this;
}
Ae.prototype = xn.prototype = {
  constructor: Ae,
  select: lg,
  selectAll: fg,
  selectChild: mg,
  selectChildren: vg,
  filter: xg,
  data: Cg,
  enter: _g,
  exit: Ig,
  join: $g,
  merge: Ag,
  selection: Pm,
  order: Tg,
  sort: zg,
  call: Og,
  nodes: Pg,
  node: Dg,
  size: Rg,
  empty: Hg,
  each: Bg,
  attr: Xg,
  style: Kg,
  property: tm,
  classed: im,
  text: cm,
  html: hm,
  raise: gm,
  lower: ym,
  append: wm,
  insert: vm,
  remove: _m,
  clone: Sm,
  datum: Nm,
  on: Am,
  dispatch: Lm,
  [Symbol.iterator]: Om
};
function Me(e) {
  return typeof e == "string" ? new Ae([[document.querySelector(e)]], [document.documentElement]) : new Ae([[e]], ul);
}
function Dm(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function He(e, t) {
  if (e = Dm(e), t === void 0 && (t = e.currentTarget), t) {
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
const Rm = { passive: !1 }, cn = { capture: !0, passive: !1 };
function So(e) {
  e.stopImmediatePropagation();
}
function zt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function fl(e) {
  var t = e.document.documentElement, n = Me(e).on("dragstart.drag", zt, cn);
  "onselectstart" in t ? n.on("selectstart.drag", zt, cn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function hl(e, t) {
  var n = e.document.documentElement, r = Me(e).on("dragstart.drag", null);
  t && (r.on("click.drag", zt, cn), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Xn = (e) => () => e;
function Fo(e, {
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
Fo.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Hm(e) {
  return !e.ctrlKey && !e.button;
}
function Bm() {
  return this.parentNode;
}
function Wm(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Vm() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function pl() {
  var e = Hm, t = Bm, n = Wm, r = Vm, o = {}, i = Lr("start", "drag", "end"), s = 0, a, l, c, d, f = 0;
  function u(b) {
    b.on("mousedown.drag", p).filter(r).on("touchstart.drag", w).on("touchmove.drag", m, Rm).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(b, E) {
    if (!(d || !e.call(this, b, E))) {
      var k = y(this, t.call(this, b, E), b, E, "mouse");
      k && (Me(b.view).on("mousemove.drag", g, cn).on("mouseup.drag", v, cn), fl(b.view), So(b), c = !1, a = b.clientX, l = b.clientY, k("start", b));
    }
  }
  function g(b) {
    if (zt(b), !c) {
      var E = b.clientX - a, k = b.clientY - l;
      c = E * E + k * k > f;
    }
    o.mouse("drag", b);
  }
  function v(b) {
    Me(b.view).on("mousemove.drag mouseup.drag", null), hl(b.view, c), zt(b), o.mouse("end", b);
  }
  function w(b, E) {
    if (e.call(this, b, E)) {
      var k = b.changedTouches, N = t.call(this, b, E), z = k.length, A, L;
      for (A = 0; A < z; ++A)
        (L = y(this, N, b, E, k[A].identifier, k[A])) && (So(b), L("start", b, k[A]));
    }
  }
  function m(b) {
    var E = b.changedTouches, k = E.length, N, z;
    for (N = 0; N < k; ++N)
      (z = o[E[N].identifier]) && (zt(b), z("drag", b, E[N]));
  }
  function _(b) {
    var E = b.changedTouches, k = E.length, N, z;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), N = 0; N < k; ++N)
      (z = o[E[N].identifier]) && (So(b), z("end", b, E[N]));
  }
  function y(b, E, k, N, z, A) {
    var L = i.copy(), P = He(A || k, E), W, B, x;
    if ((x = n.call(b, new Fo("beforestart", {
      sourceEvent: k,
      target: u,
      identifier: z,
      active: s,
      x: P[0],
      y: P[1],
      dx: 0,
      dy: 0,
      dispatch: L
    }), N)) != null)
      return W = x.x - P[0] || 0, B = x.y - P[1] || 0, function C(S, I, O) {
        var M = P, T;
        switch (S) {
          case "start":
            o[z] = C, T = s++;
            break;
          case "end":
            delete o[z], --s;
          case "drag":
            P = He(O || I, E), T = s;
            break;
        }
        L.call(
          S,
          b,
          new Fo(S, {
            sourceEvent: I,
            subject: x,
            target: u,
            identifier: z,
            active: T,
            x: P[0] + W,
            y: P[1] + B,
            dx: P[0] - M[0],
            dy: P[1] - M[1],
            dispatch: L
          }),
          N
        );
      };
  }
  return u.filter = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Xn(!!b), u) : e;
  }, u.container = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Xn(b), u) : t;
  }, u.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Xn(b), u) : n;
  }, u.touchable = function(b) {
    return arguments.length ? (r = typeof b == "function" ? b : Xn(!!b), u) : r;
  }, u.on = function() {
    var b = i.on.apply(i, arguments);
    return b === i ? u : b;
  }, u.clickDistance = function(b) {
    return arguments.length ? (f = (b = +b) * b, u) : Math.sqrt(f);
  }, u;
}
function wi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function gl(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function _n() {
}
var dn = 0.7, br = 1 / dn, Lt = "\\s*([+-]?\\d+)\\s*", un = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", qe = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Fm = /^#([0-9a-f]{3,8})$/, jm = new RegExp(`^rgb\\(${Lt},${Lt},${Lt}\\)$`), Ym = new RegExp(`^rgb\\(${qe},${qe},${qe}\\)$`), Gm = new RegExp(`^rgba\\(${Lt},${Lt},${Lt},${un}\\)$`), Xm = new RegExp(`^rgba\\(${qe},${qe},${qe},${un}\\)$`), Um = new RegExp(`^hsl\\(${un},${qe},${qe}\\)$`), qm = new RegExp(`^hsla\\(${un},${qe},${qe},${un}\\)$`), ds = {
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
wi(_n, xt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: us,
  // Deprecated! Use color.formatHex.
  formatHex: us,
  formatHex8: Zm,
  formatHsl: Km,
  formatRgb: fs,
  toString: fs
});
function us() {
  return this.rgb().formatHex();
}
function Zm() {
  return this.rgb().formatHex8();
}
function Km() {
  return ml(this).formatHsl();
}
function fs() {
  return this.rgb().formatRgb();
}
function xt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Fm.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? hs(t) : n === 3 ? new Ee(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Un(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Un(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = jm.exec(e)) ? new Ee(t[1], t[2], t[3], 1) : (t = Ym.exec(e)) ? new Ee(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Gm.exec(e)) ? Un(t[1], t[2], t[3], t[4]) : (t = Xm.exec(e)) ? Un(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Um.exec(e)) ? ms(t[1], t[2] / 100, t[3] / 100, 1) : (t = qm.exec(e)) ? ms(t[1], t[2] / 100, t[3] / 100, t[4]) : ds.hasOwnProperty(e) ? hs(ds[e]) : e === "transparent" ? new Ee(NaN, NaN, NaN, 0) : null;
}
function hs(e) {
  return new Ee(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Un(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ee(e, t, n, r);
}
function Qm(e) {
  return e instanceof _n || (e = xt(e)), e ? (e = e.rgb(), new Ee(e.r, e.g, e.b, e.opacity)) : new Ee();
}
function jo(e, t, n, r) {
  return arguments.length === 1 ? Qm(e) : new Ee(e, t, n, r ?? 1);
}
function Ee(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
wi(Ee, jo, gl(_n, {
  brighter(e) {
    return e = e == null ? br : Math.pow(br, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? dn : Math.pow(dn, e), new Ee(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ee(bt(this.r), bt(this.g), bt(this.b), vr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ps,
  // Deprecated! Use color.formatHex.
  formatHex: ps,
  formatHex8: Jm,
  formatRgb: gs,
  toString: gs
}));
function ps() {
  return `#${wt(this.r)}${wt(this.g)}${wt(this.b)}`;
}
function Jm() {
  return `#${wt(this.r)}${wt(this.g)}${wt(this.b)}${wt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function gs() {
  const e = vr(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${bt(this.r)}, ${bt(this.g)}, ${bt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function vr(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function bt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function wt(e) {
  return e = bt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function ms(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Be(e, t, n, r);
}
function ml(e) {
  if (e instanceof Be) return new Be(e.h, e.s, e.l, e.opacity);
  if (e instanceof _n || (e = xt(e)), !e) return new Be();
  if (e instanceof Be) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Be(s, a, l, e.opacity);
}
function e0(e, t, n, r) {
  return arguments.length === 1 ? ml(e) : new Be(e, t, n, r ?? 1);
}
function Be(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
wi(Be, e0, gl(_n, {
  brighter(e) {
    return e = e == null ? br : Math.pow(br, e), new Be(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? dn : Math.pow(dn, e), new Be(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new Ee(
      No(e >= 240 ? e - 240 : e + 120, o, r),
      No(e, o, r),
      No(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new Be(ys(this.h), qn(this.s), qn(this.l), vr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = vr(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${ys(this.h)}, ${qn(this.s) * 100}%, ${qn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function ys(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function qn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function No(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const bi = (e) => () => e;
function t0(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function n0(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function r0(e) {
  return (e = +e) == 1 ? yl : function(t, n) {
    return n - t ? n0(t, n, e) : bi(isNaN(t) ? n : t);
  };
}
function yl(e, t) {
  var n = t - e;
  return n ? t0(e, n) : bi(isNaN(e) ? t : e);
}
const xr = function e(t) {
  var n = r0(t);
  function r(o, i) {
    var s = n((o = jo(o)).r, (i = jo(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = yl(o.opacity, i.opacity);
    return function(d) {
      return o.r = s(d), o.g = a(d), o.b = l(d), o.opacity = c(d), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function o0(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function i0(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function s0(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = sn(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function a0(e, t) {
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
function l0(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = sn(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var Yo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Co = new RegExp(Yo.source, "g");
function c0(e) {
  return function() {
    return e;
  };
}
function d0(e) {
  return function(t) {
    return e(t) + "";
  };
}
function wl(e, t) {
  var n = Yo.lastIndex = Co.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = Yo.exec(e)) && (o = Co.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Xe(r, o) })), n = Co.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? d0(l[0].x) : c0(t) : (t = l.length, function(c) {
    for (var d = 0, f; d < t; ++d) a[(f = l[d]).i] = f.x(c);
    return a.join("");
  });
}
function sn(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? bi(t) : (n === "number" ? Xe : n === "string" ? (r = xt(t)) ? (t = r, xr) : wl : t instanceof xt ? xr : t instanceof Date ? a0 : i0(t) ? o0 : Array.isArray(t) ? s0 : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? l0 : Xe)(e, t);
}
var ws = 180 / Math.PI, Go = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function bl(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * ws,
    skewX: Math.atan(l) * ws,
    scaleX: s,
    scaleY: a
  };
}
var Zn;
function u0(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Go : bl(t.a, t.b, t.c, t.d, t.e, t.f);
}
function f0(e) {
  return e == null || (Zn || (Zn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Zn.setAttribute("transform", e), !(e = Zn.transform.baseVal.consolidate())) ? Go : (e = e.matrix, bl(e.a, e.b, e.c, e.d, e.e, e.f));
}
function vl(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, d, f, u, p, g) {
    if (c !== f || d !== u) {
      var v = p.push("translate(", null, t, null, n);
      g.push({ i: v - 4, x: Xe(c, f) }, { i: v - 2, x: Xe(d, u) });
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
      var v = p.push(o(p) + "scale(", null, ",", null, ")");
      g.push({ i: v - 4, x: Xe(c, f) }, { i: v - 2, x: Xe(d, u) });
    } else (f !== 1 || u !== 1) && p.push(o(p) + "scale(" + f + "," + u + ")");
  }
  return function(c, d) {
    var f = [], u = [];
    return c = e(c), d = e(d), i(c.translateX, c.translateY, d.translateX, d.translateY, f, u), s(c.rotate, d.rotate, f, u), a(c.skewX, d.skewX, f, u), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, u), c = d = null, function(p) {
      for (var g = -1, v = u.length, w; ++g < v; ) f[(w = u[g]).i] = w.x(p);
      return f.join("");
    };
  };
}
var h0 = vl(u0, "px, ", "px)", "deg)"), p0 = vl(f0, ", ", ")", ")"), g0 = 1e-12;
function bs(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function m0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function y0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const lr = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], d = s[0], f = s[1], u = s[2], p = d - a, g = f - l, v = p * p + g * g, w, m;
    if (v < g0)
      m = Math.log(u / c) / t, w = function(N) {
        return [
          a + N * p,
          l + N * g,
          c * Math.exp(t * N * m)
        ];
      };
    else {
      var _ = Math.sqrt(v), y = (u * u - c * c + r * v) / (2 * c * n * _), b = (u * u - c * c - r * v) / (2 * u * n * _), E = Math.log(Math.sqrt(y * y + 1) - y), k = Math.log(Math.sqrt(b * b + 1) - b);
      m = (k - E) / t, w = function(N) {
        var z = N * m, A = bs(E), L = c / (n * _) * (A * y0(t * z + E) - m0(E));
        return [
          a + L * p,
          l + L * g,
          c * A / bs(t * z + E)
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
var Pt = 0, nn = 0, Jt = 0, xl = 1e3, _r, rn, kr = 0, _t = 0, Pr = 0, fn = typeof performance == "object" && performance.now ? performance : Date, _l = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function vi() {
  return _t || (_l(w0), _t = fn.now() + Pr);
}
function w0() {
  _t = 0;
}
function Er() {
  this._call = this._time = this._next = null;
}
Er.prototype = kl.prototype = {
  constructor: Er,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? vi() : +n) + (t == null ? 0 : +t), !this._next && rn !== this && (rn ? rn._next = this : _r = this, rn = this), this._call = e, this._time = n, Xo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Xo());
  }
};
function kl(e, t, n) {
  var r = new Er();
  return r.restart(e, t, n), r;
}
function b0() {
  vi(), ++Pt;
  for (var e = _r, t; e; )
    (t = _t - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Pt;
}
function vs() {
  _t = (kr = fn.now()) + Pr, Pt = nn = 0;
  try {
    b0();
  } finally {
    Pt = 0, x0(), _t = 0;
  }
}
function v0() {
  var e = fn.now(), t = e - kr;
  t > xl && (Pr -= t, kr = e);
}
function x0() {
  for (var e, t = _r, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : _r = n);
  rn = e, Xo(r);
}
function Xo(e) {
  if (!Pt) {
    nn && (nn = clearTimeout(nn));
    var t = e - _t;
    t > 24 ? (e < 1 / 0 && (nn = setTimeout(vs, e - fn.now() - Pr)), Jt && (Jt = clearInterval(Jt))) : (Jt || (kr = fn.now(), Jt = setInterval(v0, xl)), Pt = 1, _l(vs));
  }
}
function xs(e, t, n) {
  var r = new Er();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var _0 = Lr("start", "end", "cancel", "interrupt"), k0 = [], El = 0, _s = 1, Uo = 2, cr = 3, ks = 4, qo = 5, dr = 6;
function Dr(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  E0(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: _0,
    tween: k0,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: El
  });
}
function xi(e, t) {
  var n = Ye(e, t);
  if (n.state > El) throw new Error("too late; already scheduled");
  return n;
}
function Ze(e, t) {
  var n = Ye(e, t);
  if (n.state > cr) throw new Error("too late; already running");
  return n;
}
function Ye(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function E0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = kl(i, 0, n.time);
  function i(c) {
    n.state = _s, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, u, p;
    if (n.state !== _s) return l();
    for (d in r)
      if (p = r[d], p.name === n.name) {
        if (p.state === cr) return xs(s);
        p.state === ks ? (p.state = dr, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete r[d]) : +d < t && (p.state = dr, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete r[d]);
      }
    if (xs(function() {
      n.state === cr && (n.state = ks, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Uo, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Uo) {
      for (n.state = cr, o = new Array(u = n.tween.length), d = 0, f = -1; d < u; ++d)
        (p = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = p);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = qo, 1), f = -1, u = o.length; ++f < u; )
      o[f].call(e, d);
    n.state === qo && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = dr, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function ur(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > Uo && r.state < qo, r.state = dr, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function S0(e) {
  return this.each(function() {
    ur(this, e);
  });
}
function N0(e, t) {
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
function C0(e, t, n) {
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
function M0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Ye(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? N0 : C0)(n, e, t));
}
function _i(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = Ze(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return Ye(o, r).value[t];
  };
}
function Sl(e, t) {
  var n;
  return (typeof t == "number" ? Xe : t instanceof xt ? xr : (n = xt(t)) ? (t = n, xr) : wl)(e, t);
}
function I0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function $0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function A0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function T0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function z0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function L0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function O0(e, t) {
  var n = Or(e), r = n === "transform" ? p0 : Sl;
  return this.attrTween(e, typeof t == "function" ? (n.local ? L0 : z0)(n, r, _i(this, "attr." + e, t)) : t == null ? (n.local ? $0 : I0)(n) : (n.local ? T0 : A0)(n, r, t));
}
function P0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function D0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function R0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && D0(e, i)), n;
  }
  return o._value = t, o;
}
function H0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && P0(e, i)), n;
  }
  return o._value = t, o;
}
function B0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Or(e);
  return this.tween(n, (r.local ? R0 : H0)(r, t));
}
function W0(e, t) {
  return function() {
    xi(this, e).delay = +t.apply(this, arguments);
  };
}
function V0(e, t) {
  return t = +t, function() {
    xi(this, e).delay = t;
  };
}
function F0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? W0 : V0)(t, e)) : Ye(this.node(), t).delay;
}
function j0(e, t) {
  return function() {
    Ze(this, e).duration = +t.apply(this, arguments);
  };
}
function Y0(e, t) {
  return t = +t, function() {
    Ze(this, e).duration = t;
  };
}
function G0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? j0 : Y0)(t, e)) : Ye(this.node(), t).duration;
}
function X0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ze(this, e).ease = t;
  };
}
function U0(e) {
  var t = this._id;
  return arguments.length ? this.each(X0(t, e)) : Ye(this.node(), t).ease;
}
function q0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ze(this, e).ease = n;
  };
}
function Z0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(q0(this._id, e));
}
function K0(e) {
  typeof e != "function" && (e = nl(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new ot(r, this._parents, this._name, this._id);
}
function Q0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], d = l.length, f = s[a] = new Array(d), u, p = 0; p < d; ++p)
      (u = l[p] || c[p]) && (f[p] = u);
  for (; a < r; ++a)
    s[a] = t[a];
  return new ot(s, this._parents, this._name, this._id);
}
function J0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function ey(e, t, n) {
  var r, o, i = J0(t) ? xi : Ze;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function ty(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Ye(this.node(), n).on.on(e) : this.each(ey(n, e, t));
}
function ny(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function ry() {
  return this.on("end.remove", ny(this._id));
}
function oy(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = mi(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), d, f, u = 0; u < l; ++u)
      (d = a[u]) && (f = e.call(d, d.__data__, u, a)) && ("__data__" in d && (f.__data__ = d.__data__), c[u] = f, Dr(c[u], t, n, u, c, Ye(d, n)));
  return new ot(i, this._parents, t, n);
}
function iy(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = tl(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, d, f = 0; f < c; ++f)
      if (d = l[f]) {
        for (var u = e.call(d, d.__data__, f, l), p, g = Ye(d, n), v = 0, w = u.length; v < w; ++v)
          (p = u[v]) && Dr(p, t, n, v, u, g);
        i.push(u), s.push(d);
      }
  return new ot(i, s, t, n);
}
var sy = xn.prototype.constructor;
function ay() {
  return new sy(this._groups, this._parents);
}
function ly(e, t) {
  var n, r, o;
  return function() {
    var i = Ot(this, e), s = (this.style.removeProperty(e), Ot(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function Nl(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function cy(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = Ot(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function dy(e, t, n) {
  var r, o, i;
  return function() {
    var s = Ot(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Ot(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function uy(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = Ze(this, e), c = l.on, d = l.value[i] == null ? a || (a = Nl(t)) : void 0;
    (c !== n || o !== d) && (r = (n = c).copy()).on(s, o = d), l.on = r;
  };
}
function fy(e, t, n) {
  var r = (e += "") == "transform" ? h0 : Sl;
  return t == null ? this.styleTween(e, ly(e, r)).on("end.style." + e, Nl(e)) : typeof t == "function" ? this.styleTween(e, dy(e, r, _i(this, "style." + e, t))).each(uy(this._id, e)) : this.styleTween(e, cy(e, r, t), n).on("end.style." + e, null);
}
function hy(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function py(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && hy(e, s, n)), r;
  }
  return i._value = t, i;
}
function gy(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, py(e, t, n ?? ""));
}
function my(e) {
  return function() {
    this.textContent = e;
  };
}
function yy(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function wy(e) {
  return this.tween("text", typeof e == "function" ? yy(_i(this, "text", e)) : my(e == null ? "" : e + ""));
}
function by(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function vy(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && by(o)), t;
  }
  return r._value = e, r;
}
function xy(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, vy(e));
}
function _y() {
  for (var e = this._name, t = this._id, n = Cl(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = Ye(l, t);
        Dr(l, e, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new ot(r, this._parents, e, n);
}
function ky() {
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
var Ey = 0;
function ot(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Cl() {
  return ++Ey;
}
var et = xn.prototype;
ot.prototype = {
  constructor: ot,
  select: oy,
  selectAll: iy,
  selectChild: et.selectChild,
  selectChildren: et.selectChildren,
  filter: K0,
  merge: Q0,
  selection: ay,
  transition: _y,
  call: et.call,
  nodes: et.nodes,
  node: et.node,
  size: et.size,
  empty: et.empty,
  each: et.each,
  on: ty,
  attr: O0,
  attrTween: B0,
  style: fy,
  styleTween: gy,
  text: wy,
  textTween: xy,
  remove: ry,
  tween: M0,
  delay: F0,
  duration: G0,
  ease: U0,
  easeVarying: Z0,
  end: ky,
  [Symbol.iterator]: et[Symbol.iterator]
};
function Sy(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Ny = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Sy
};
function Cy(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function My(e) {
  var t, n;
  e instanceof ot ? (t = e._id, e = e._name) : (t = Cl(), (n = Ny).time = vi(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Dr(l, e, t, c, s, n || Cy(l, t));
  return new ot(r, this._parents, e, t);
}
xn.prototype.interrupt = S0;
xn.prototype.transition = My;
const Kn = (e) => () => e;
function Iy(e, {
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
var Rr = new rt(1, 0, 0);
Ml.prototype = rt.prototype;
function Ml(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Rr;
  return e.__zoom;
}
function Mo(e) {
  e.stopImmediatePropagation();
}
function en(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function $y(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Ay() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Es() {
  return this.__zoom || Rr;
}
function Ty(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function zy() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ly(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function Il() {
  var e = $y, t = Ay, n = Ly, r = Ty, o = zy, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = lr, c = Lr("start", "zoom", "end"), d, f, u, p = 500, g = 150, v = 0, w = 10;
  function m(x) {
    x.property("__zoom", Es).on("wheel.zoom", z, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", L).filter(o).on("touchstart.zoom", P).on("touchmove.zoom", W).on("touchend.zoom touchcancel.zoom", B).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(x, C, S, I) {
    var O = x.selection ? x.selection() : x;
    O.property("__zoom", Es), x !== O ? E(x, C, S, I) : O.interrupt().each(function() {
      k(this, arguments).event(I).start().zoom(null, typeof C == "function" ? C.apply(this, arguments) : C).end();
    });
  }, m.scaleBy = function(x, C, S, I) {
    m.scaleTo(x, function() {
      var O = this.__zoom.k, M = typeof C == "function" ? C.apply(this, arguments) : C;
      return O * M;
    }, S, I);
  }, m.scaleTo = function(x, C, S, I) {
    m.transform(x, function() {
      var O = t.apply(this, arguments), M = this.__zoom, T = S == null ? b(O) : typeof S == "function" ? S.apply(this, arguments) : S, D = M.invert(T), H = typeof C == "function" ? C.apply(this, arguments) : C;
      return n(y(_(M, H), T, D), O, s);
    }, S, I);
  }, m.translateBy = function(x, C, S, I) {
    m.transform(x, function() {
      return n(this.__zoom.translate(
        typeof C == "function" ? C.apply(this, arguments) : C,
        typeof S == "function" ? S.apply(this, arguments) : S
      ), t.apply(this, arguments), s);
    }, null, I);
  }, m.translateTo = function(x, C, S, I, O) {
    m.transform(x, function() {
      var M = t.apply(this, arguments), T = this.__zoom, D = I == null ? b(M) : typeof I == "function" ? I.apply(this, arguments) : I;
      return n(Rr.translate(D[0], D[1]).scale(T.k).translate(
        typeof C == "function" ? -C.apply(this, arguments) : -C,
        typeof S == "function" ? -S.apply(this, arguments) : -S
      ), M, s);
    }, I, O);
  };
  function _(x, C) {
    return C = Math.max(i[0], Math.min(i[1], C)), C === x.k ? x : new rt(C, x.x, x.y);
  }
  function y(x, C, S) {
    var I = C[0] - S[0] * x.k, O = C[1] - S[1] * x.k;
    return I === x.x && O === x.y ? x : new rt(x.k, I, O);
  }
  function b(x) {
    return [(+x[0][0] + +x[1][0]) / 2, (+x[0][1] + +x[1][1]) / 2];
  }
  function E(x, C, S, I) {
    x.on("start.zoom", function() {
      k(this, arguments).event(I).start();
    }).on("interrupt.zoom end.zoom", function() {
      k(this, arguments).event(I).end();
    }).tween("zoom", function() {
      var O = this, M = arguments, T = k(O, M).event(I), D = t.apply(O, M), H = S == null ? b(D) : typeof S == "function" ? S.apply(O, M) : S, Y = Math.max(D[1][0] - D[0][0], D[1][1] - D[0][1]), j = O.__zoom, U = typeof C == "function" ? C.apply(O, M) : C, ee = l(j.invert(H).concat(Y / j.k), U.invert(H).concat(Y / U.k));
      return function(G) {
        if (G === 1) G = U;
        else {
          var R = ee(G), F = Y / R[2];
          G = new rt(F, H[0] - R[0] * F, H[1] - R[1] * F);
        }
        T.zoom(null, G);
      };
    });
  }
  function k(x, C, S) {
    return !S && x.__zooming || new N(x, C);
  }
  function N(x, C) {
    this.that = x, this.args = C, this.active = 0, this.sourceEvent = null, this.extent = t.apply(x, C), this.taps = 0;
  }
  N.prototype = {
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
        new Iy(x, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        C
      );
    }
  };
  function z(x, ...C) {
    if (!e.apply(this, arguments)) return;
    var S = k(this, C).event(x), I = this.__zoom, O = Math.max(i[0], Math.min(i[1], I.k * Math.pow(2, r.apply(this, arguments)))), M = He(x);
    if (S.wheel)
      (S.mouse[0][0] !== M[0] || S.mouse[0][1] !== M[1]) && (S.mouse[1] = I.invert(S.mouse[0] = M)), clearTimeout(S.wheel);
    else {
      if (I.k === O) return;
      S.mouse = [M, I.invert(M)], ur(this), S.start();
    }
    en(x), S.wheel = setTimeout(T, g), S.zoom("mouse", n(y(_(I, O), S.mouse[0], S.mouse[1]), S.extent, s));
    function T() {
      S.wheel = null, S.end();
    }
  }
  function A(x, ...C) {
    if (u || !e.apply(this, arguments)) return;
    var S = x.currentTarget, I = k(this, C, !0).event(x), O = Me(x.view).on("mousemove.zoom", H, !0).on("mouseup.zoom", Y, !0), M = He(x, S), T = x.clientX, D = x.clientY;
    fl(x.view), Mo(x), I.mouse = [M, this.__zoom.invert(M)], ur(this), I.start();
    function H(j) {
      if (en(j), !I.moved) {
        var U = j.clientX - T, ee = j.clientY - D;
        I.moved = U * U + ee * ee > v;
      }
      I.event(j).zoom("mouse", n(y(I.that.__zoom, I.mouse[0] = He(j, S), I.mouse[1]), I.extent, s));
    }
    function Y(j) {
      O.on("mousemove.zoom mouseup.zoom", null), hl(j.view, I.moved), en(j), I.event(j).end();
    }
  }
  function L(x, ...C) {
    if (e.apply(this, arguments)) {
      var S = this.__zoom, I = He(x.changedTouches ? x.changedTouches[0] : x, this), O = S.invert(I), M = S.k * (x.shiftKey ? 0.5 : 2), T = n(y(_(S, M), I, O), t.apply(this, C), s);
      en(x), a > 0 ? Me(this).transition().duration(a).call(E, T, I, x) : Me(this).call(m.transform, T, I, x);
    }
  }
  function P(x, ...C) {
    if (e.apply(this, arguments)) {
      var S = x.touches, I = S.length, O = k(this, C, x.changedTouches.length === I).event(x), M, T, D, H;
      for (Mo(x), T = 0; T < I; ++T)
        D = S[T], H = He(D, this), H = [H, this.__zoom.invert(H), D.identifier], O.touch0 ? !O.touch1 && O.touch0[2] !== H[2] && (O.touch1 = H, O.taps = 0) : (O.touch0 = H, M = !0, O.taps = 1 + !!d);
      d && (d = clearTimeout(d)), M && (O.taps < 2 && (f = H[0], d = setTimeout(function() {
        d = null;
      }, p)), ur(this), O.start());
    }
  }
  function W(x, ...C) {
    if (this.__zooming) {
      var S = k(this, C).event(x), I = x.changedTouches, O = I.length, M, T, D, H;
      for (en(x), M = 0; M < O; ++M)
        T = I[M], D = He(T, this), S.touch0 && S.touch0[2] === T.identifier ? S.touch0[0] = D : S.touch1 && S.touch1[2] === T.identifier && (S.touch1[0] = D);
      if (T = S.that.__zoom, S.touch1) {
        var Y = S.touch0[0], j = S.touch0[1], U = S.touch1[0], ee = S.touch1[1], G = (G = U[0] - Y[0]) * G + (G = U[1] - Y[1]) * G, R = (R = ee[0] - j[0]) * R + (R = ee[1] - j[1]) * R;
        T = _(T, Math.sqrt(G / R)), D = [(Y[0] + U[0]) / 2, (Y[1] + U[1]) / 2], H = [(j[0] + ee[0]) / 2, (j[1] + ee[1]) / 2];
      } else if (S.touch0) D = S.touch0[0], H = S.touch0[1];
      else return;
      S.zoom("touch", n(y(T, D, H), S.extent, s));
    }
  }
  function B(x, ...C) {
    if (this.__zooming) {
      var S = k(this, C).event(x), I = x.changedTouches, O = I.length, M, T;
      for (Mo(x), u && clearTimeout(u), u = setTimeout(function() {
        u = null;
      }, p), M = 0; M < O; ++M)
        T = I[M], S.touch0 && S.touch0[2] === T.identifier ? delete S.touch0 : S.touch1 && S.touch1[2] === T.identifier && delete S.touch1;
      if (S.touch1 && !S.touch0 && (S.touch0 = S.touch1, delete S.touch1), S.touch0) S.touch0[1] = this.__zoom.invert(S.touch0[0]);
      else if (S.end(), S.taps === 2 && (T = He(T, this), Math.hypot(f[0] - T[0], f[1] - T[1]) < w)) {
        var D = Me(this).on("dblclick.zoom");
        D && D.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : Kn(+x), m) : r;
  }, m.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Kn(!!x), m) : e;
  }, m.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : Kn(!!x), m) : o;
  }, m.extent = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Kn([[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]]), m) : t;
  }, m.scaleExtent = function(x) {
    return arguments.length ? (i[0] = +x[0], i[1] = +x[1], m) : [i[0], i[1]];
  }, m.translateExtent = function(x) {
    return arguments.length ? (s[0][0] = +x[0][0], s[1][0] = +x[1][0], s[0][1] = +x[0][1], s[1][1] = +x[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(x) {
    return arguments.length ? (n = x, m) : n;
  }, m.duration = function(x) {
    return arguments.length ? (a = +x, m) : a;
  }, m.interpolate = function(x) {
    return arguments.length ? (l = x, m) : l;
  }, m.on = function() {
    var x = c.on.apply(c, arguments);
    return x === c ? m : x;
  }, m.clickDistance = function(x) {
    return arguments.length ? (v = (x = +x) * x, m) : Math.sqrt(v);
  }, m.tapDistance = function(x) {
    return arguments.length ? (w = +x, m) : w;
  }, m;
}
const Fe = {
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
}, hn = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], $l = ["Enter", " ", "Escape"], Al = {
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
var Dt;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Dt || (Dt = {}));
var vt;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(vt || (vt = {}));
var pn;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(pn || (pn = {}));
const Tl = {
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
var Rt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Rt || (Rt = {}));
var X;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(X || (X = {}));
const Ss = {
  [X.Left]: X.Right,
  [X.Right]: X.Left,
  [X.Top]: X.Bottom,
  [X.Bottom]: X.Top
}, zl = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, Oy = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), ki = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), kn = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ge(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Py = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : ki(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, Hr(o, Sr(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? Br(r) : { x: 0, y: 0, width: 0, height: 0 };
}, En = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = Hr(n, Sr(o)), r = !0);
  }), r ? Br(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Ei = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, d = t.height / o, f = [];
  for (const u of e.values()) {
    const { measured: p, selectable: g = !0, hidden: v = !1 } = u;
    if (s && !g || v)
      continue;
    const w = p.width ?? u.width ?? u.initialWidth ?? 0, m = p.height ?? u.height ?? u.initialHeight ?? 0, { x: _, y } = u.internals.positionAbsolute, b = Dl(a, l, c, d, _, y, w, m), E = w * m, k = i && b > 0;
    (!u.internals.handleBounds || k || b >= E || u.dragging) && f.push(u);
  }
  return f;
}, Dy = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function Ry(e, t) {
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
async function Hy({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Ry(e, s), l = En(a), c = Wr(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function Ll({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, d = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Fe.error005());
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
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Fe.error015())), {
    position: {
      x: u.x - l + (s.measured.width ?? 0) * d[0],
      y: u.y - c + (s.measured.height ?? 0) * d[1]
    },
    positionAbsolute: u
  };
}
async function By({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((u) => u.id)), s = [];
  for (const u of n) {
    if (u.deletable === !1)
      continue;
    const p = i.has(u.id), g = !p && u.parentId && s.find((v) => v.id === u.parentId);
    (p || g) && s.push(u);
  }
  const a = new Set(t.map((u) => u.id)), l = r.filter((u) => u.deletable !== !1), d = Dy(s, l);
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
const Ht = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), kt = (e = { x: 0, y: 0 }, t, n) => ({
  x: Ht(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: Ht(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function Ol(e, t, n) {
  const { width: r, height: o } = Ge(n), { x: i, y: s } = n.internals.positionAbsolute;
  return kt(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const Ns = (e, t, n) => e < t ? Ht(Math.abs(e - t), 1, t) / t : e > n ? -Ht(Math.abs(e - n), 1, t) / t : 0, Si = (e, t, n = 15, r = 40) => {
  const o = Ns(e.x, r, t.width - r) * n, i = Ns(e.y, r, t.height - r) * n;
  return [o, i];
}, Hr = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), Zo = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), Br = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), gn = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = ki(e) ? e.internals.positionAbsolute : kn(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Sr = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = ki(e) ? e.internals.positionAbsolute : kn(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, Pl = (e, t) => Br(Hr(Zo(e), Zo(t))), Dl = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Nr = (e, t) => Dl(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), Cs = (e) => We(e.width) && We(e.height) && We(e.x) && We(e.y), We = (e) => !isNaN(e) && isFinite(e), Rl = (e, t) => (n, r) => {
}, Sn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Nn = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Sn(a, s) : a;
}, Bt = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function At(e, t) {
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
function Wy(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = At(e, n), o = At(e, t);
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
    const r = At(e.top ?? e.y ?? 0, n), o = At(e.bottom ?? e.y ?? 0, n), i = At(e.left ?? e.x ?? 0, t), s = At(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Vy(e, t, n, r, o, i) {
  const { x: s, y: a } = Bt(e, [t, n, r]), { x: l, y: c } = Bt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(d),
    bottom: Math.floor(f)
  };
}
const Wr = (e, t, n, r, o, i) => {
  const s = Wy(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), d = Ht(c, r, o), f = e.x + e.width / 2, u = e.y + e.height / 2, p = t / 2 - f * d, g = n / 2 - u * d, v = Vy(e, p, g, d, t, n), w = {
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
}, mn = () => {
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
function Hl(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function Bl(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Ms(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Fy() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function jy(e) {
  return { ...Al, ...e || {} };
}
function Wl(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function an(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Ve(e), a = Nn({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Sn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const Ni = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Vl = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, Yy = ["INPUT", "SELECT", "TEXTAREA"];
function Fl(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : Yy.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const jl = (e) => "clientX" in e, Ve = (e, t) => {
  var i, s;
  const n = jl(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, Is = (e, t, n, r, o) => {
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
      ...Ni(s)
    };
  });
};
function Yl({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, d = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, d, f];
}
function Qn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function $s({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
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
function Gl({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: o, targetPosition: i = X.Top, curvature: s = 0.25 }) {
  const [a, l] = $s({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, d] = $s({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, u, p, g] = Yl({
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
function Xl({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function Gy({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function Xy({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = Hr(Sr(e), Sr(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return Nr(s, Br(i)) > 0;
}
const Uy = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, qy = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Zy = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Fe.error006()), t;
  const r = n.getEdgeId || Uy;
  let o;
  return zl(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, qy(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function Ul({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = Xl({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const As = {
  [X.Left]: { x: -1, y: 0 },
  [X.Right]: { x: 1, y: 0 },
  [X.Top]: { x: 0, y: -1 },
  [X.Bottom]: { x: 0, y: 1 }
}, Ky = ({ source: e, sourcePosition: t = X.Bottom, target: n }) => t === X.Left || t === X.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Ts = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Qy({ source: e, sourcePosition: t = X.Bottom, target: n, targetPosition: r = X.Top, center: o, offset: i, stepPosition: s }) {
  const a = As[t], l = As[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, d = { x: n.x + l.x * i, y: n.y + l.y * i }, f = Ky({
    source: c,
    sourcePosition: t,
    target: d
  }), u = f.x !== 0 ? "x" : "y", p = f[u];
  let g = [], v, w;
  const m = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , y, b] = Xl({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[u] * l[u] === -1) {
    u === "x" ? (v = o.x ?? c.x + (d.x - c.x) * s, w = o.y ?? (c.y + d.y) / 2) : (v = o.x ?? (c.x + d.x) / 2, w = o.y ?? c.y + (d.y - c.y) * s);
    const z = [
      { x: v, y: c.y },
      { x: v, y: d.y }
    ], A = [
      { x: c.x, y: w },
      { x: d.x, y: w }
    ];
    a[u] === p ? g = u === "x" ? z : A : g = u === "x" ? A : z;
  } else {
    const z = [{ x: c.x, y: d.y }], A = [{ x: d.x, y: c.y }];
    if (u === "x" ? g = a.x === p ? A : z : g = a.y === p ? z : A, t === r) {
      const x = Math.abs(e[u] - n[u]);
      if (x <= i) {
        const C = Math.min(i - 1, i - x);
        a[u] === p ? m[u] = (c[u] > e[u] ? -1 : 1) * C : _[u] = (d[u] > n[u] ? -1 : 1) * C;
      }
    }
    if (t !== r) {
      const x = u === "x" ? "y" : "x", C = a[u] === l[x], S = c[x] > d[x], I = c[x] < d[x];
      (a[u] === 1 && (!C && S || C && I) || a[u] !== 1 && (!C && I || C && S)) && (g = u === "x" ? z : A);
    }
    const L = { x: c.x + m.x, y: c.y + m.y }, P = { x: d.x + _.x, y: d.y + _.y }, W = Math.max(Math.abs(L.x - g[0].x), Math.abs(P.x - g[0].x)), B = Math.max(Math.abs(L.y - g[0].y), Math.abs(P.y - g[0].y));
    W >= B ? (v = (L.x + P.x) / 2, w = g[0].y) : (v = g[0].x, w = (L.y + P.y) / 2);
  }
  const E = { x: c.x + m.x, y: c.y + m.y }, k = { x: d.x + _.x, y: d.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...E.x !== g[0].x || E.y !== g[0].y ? [E] : [],
    ...g,
    ...k.x !== g[g.length - 1].x || k.y !== g[g.length - 1].y ? [k] : [],
    n
  ], v, w, y, b];
}
function Jy(e, t, n, r) {
  const o = Math.min(Ts(e, t) / 2, Ts(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * d}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function Ko({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: o, targetPosition: i = X.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: d = 0.5 }) {
  const [f, u, p, g, v] = Qy({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: d
  });
  let w = `M${f[0].x} ${f[0].y}`;
  for (let m = 1; m < f.length - 1; m++)
    w += Jy(f[m - 1], f[m], f[m + 1], s);
  return w += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [w, u, p, g, v];
}
function zs(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function ew(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!zs(t) || !zs(n))
    return null;
  const r = t.internals.handleBounds || Ls(t.handles), o = n.internals.handleBounds || Ls(n.handles), i = Os((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = Os(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Dt.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Fe.error008(i ? "target" : "source", {
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
function Ls(e) {
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
function Os(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Qo(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function tw(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = Qo(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const ql = 1e3, nw = 10, Ci = {
  nodeOrigin: [0, 0],
  nodeExtent: hn,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, rw = {
  ...Ci,
  checkEquality: !0
};
function Mi(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function ow(e, t, n) {
  const r = Mi(Ci, n);
  for (const o of e.values())
    if (o.parentId)
      $i(o, e, t, r);
    else {
      const i = kn(o, r.nodeOrigin), s = Et(o.extent) ? o.extent : r.nodeExtent, a = kt(i, s, Ge(o));
      o.internals.positionAbsolute = a;
    }
}
function iw(e, t) {
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
function Ii(e) {
  return e === "manual";
}
function Jo(e, t, n, r = {}) {
  var d, f;
  const o = Mi(rw, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !Ii(o.zIndexMode) ? ql : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const u of e) {
    let p = s.get(u.id);
    if (o.checkEquality && u === (p == null ? void 0 : p.internals.userNode))
      t.set(u.id, p);
    else {
      const g = kn(u, o.nodeOrigin), v = Et(u.extent) ? u.extent : o.nodeExtent, w = kt(g, v, Ge(u));
      p = {
        ...o.defaults,
        ...u,
        measured: {
          width: (d = u.measured) == null ? void 0 : d.width,
          height: (f = u.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: w,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: iw(u, p),
          z: Zl(u, a, o.zIndexMode),
          userNode: u
        }
      }, t.set(u.id, p);
    }
    (p.measured === void 0 || p.measured.width === void 0 || p.measured.height === void 0) && !p.hidden && (l = !1), u.parentId && $i(p, t, n, r, i), c || (c = u.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function sw(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function $i(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = Mi(Ci, r), c = e.parentId, d = t.get(c);
  if (!d) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  sw(e, n), o && !d.parentId && d.internals.rootParentIndex === void 0 && l === "auto" && (d.internals.rootParentIndex = ++o.i, d.internals.z = d.internals.z + o.i * nw), o && d.internals.rootParentIndex !== void 0 && (o.i = d.internals.rootParentIndex);
  const f = i && !Ii(l) ? ql : 0, { x: u, y: p, z: g } = aw(e, d, s, a, f, l), { positionAbsolute: v } = e.internals, w = u !== v.x || p !== v.y;
  (w || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: w ? { x: u, y: p } : v,
      z: g
    }
  });
}
function Zl(e, t, n) {
  const r = We(e.zIndex) ? e.zIndex : 0;
  return Ii(n) ? r : r + (e.selected ? t : 0);
}
function aw(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ge(e), c = kn(e, n), d = Et(e.extent) ? kt(c, e.extent, l) : c;
  let f = kt({ x: s + d.x, y: a + d.y }, r, l);
  e.extent === "parent" && (f = Ol(f, l, t));
  const u = Zl(e, o, i), p = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: p >= u ? p + 1 : u
  };
}
function Ai(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? gn(l), d = Pl(c, a.rect);
    i.set(a.parentId, { expandedRect: d, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var y;
    const d = l.internals.positionAbsolute, f = Ge(l), u = l.origin ?? r, p = a.x < d.x ? Math.round(Math.abs(d.x - a.x)) : 0, g = a.y < d.y ? Math.round(Math.abs(d.y - a.y)) : 0, v = Math.max(f.width, Math.round(a.width)), w = Math.max(f.height, Math.round(a.height)), m = (v - f.width) * u[0], _ = (w - f.height) * u[1];
    (p > 0 || g > 0 || m || _) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - p + m,
        y: l.position.y - g + _
      }
    }), (y = n.get(c)) == null || y.forEach((b) => {
      e.some((E) => E.id === b.id) || o.push({
        id: b.id,
        type: "position",
        position: {
          x: b.position.x + p,
          y: b.position.y + g
        }
      });
    })), (f.width < a.width || f.height < a.height || p || g) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: v + (p ? u[0] * p - m : 0),
        height: w + (g ? u[1] * g - _ : 0)
      }
    });
  }), o;
}
function lw(e, t, n, r, o, i, s) {
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
    const v = Ni(p.nodeElement), w = g.measured.width !== v.width || g.measured.height !== v.height;
    if (!!(v.width && v.height && (w || !g.internals.handleBounds || p.force))) {
      const _ = p.nodeElement.getBoundingClientRect(), y = Et(g.extent) ? g.extent : i;
      let { positionAbsolute: b } = g.internals;
      if (g.parentId && g.extent === "parent") {
        const k = t.get(g.parentId);
        k && (b = Ol(b, v, k));
      } else y && (b = kt(b, y, v));
      const E = {
        ...g,
        measured: v,
        internals: {
          ...g.internals,
          positionAbsolute: b,
          handleBounds: {
            source: Is("source", p.nodeElement, _, f, g.id),
            target: Is("target", p.nodeElement, _, f, g.id)
          }
        }
      };
      t.set(g.id, E), g.parentId && $i(E, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, w && (c.push({
        id: g.id,
        type: "dimensions",
        dimensions: v
      }), g.expandParent && g.parentId && u.push({
        id: g.id,
        parentId: g.parentId,
        rect: gn(E, o)
      }));
    }
  }
  if (u.length > 0) {
    const p = Ai(u, t, n, o);
    c.push(...p);
  }
  return { changes: c, updatedInternals: l };
}
async function cw({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function Ps(e, t, n, r, o, i) {
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
function Kl(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, d = `${i}-${a}--${o}-${s}`;
    Ps("source", l, d, e, o, s), Ps("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function Ql(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Ql(n, t) : !1;
}
function Ds(e, t, n) {
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
function dw(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !Ql(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function Io({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
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
function uw({ dragItems: e, snapGrid: t, x: n, y: r }) {
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
function fw({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, d = null, f = !1, u = null, p = !1, g = !1, v = null;
  function w({ noDragClassName: _, handleSelector: y, domNode: b, isSelectable: E, nodeId: k, nodeClickDistance: N = 0 }) {
    u = Me(b);
    function z({ x: W, y: B }) {
      const { nodeLookup: x, nodeExtent: C, snapGrid: S, snapToGrid: I, nodeOrigin: O, onNodeDrag: M, onSelectionDrag: T, onError: D, updateNodePositions: H } = t();
      i = { x: W, y: B };
      let Y = !1;
      const j = a.size > 1, U = j && C ? Zo(En(a)) : null, ee = j && I ? uw({
        dragItems: a,
        snapGrid: S,
        x: W,
        y: B
      }) : null;
      for (const [G, R] of a) {
        if (!x.has(G))
          continue;
        let F = { x: W - R.distance.x, y: B - R.distance.y };
        I && (F = ee ? {
          x: Math.round(F.x + ee.x),
          y: Math.round(F.y + ee.y)
        } : Sn(F, S));
        let K = null;
        if (j && C && !R.extent && U) {
          const { positionAbsolute: J } = R.internals, ne = J.x - U.x + C[0][0], re = J.x + R.measured.width - U.x2 + C[1][0], ie = J.y - U.y + C[0][1], ae = J.y + R.measured.height - U.y2 + C[1][1];
          K = [
            [ne, ie],
            [re, ae]
          ];
        }
        const { position: Q, positionAbsolute: q } = Ll({
          nodeId: G,
          nextPosition: F,
          nodeLookup: x,
          nodeExtent: K || C,
          nodeOrigin: O,
          onError: D
        });
        Y = Y || R.position.x !== Q.x || R.position.y !== Q.y, R.position = Q, R.internals.positionAbsolute = q;
      }
      if (g = g || Y, !!Y && (H(a, !0), v && (r || M || !k && T))) {
        const [G, R] = Io({
          nodeId: k,
          dragItems: a,
          nodeLookup: x
        });
        r == null || r(v, a, G, R), M == null || M(v, G, R), k || T == null || T(v, R);
      }
    }
    async function A() {
      if (!d)
        return;
      const { transform: W, panBy: B, autoPanSpeed: x, autoPanOnNodeDrag: C } = t();
      if (!C) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [S, I] = Si(c, d, x);
      (S !== 0 || I !== 0) && (i.x = (i.x ?? 0) - S / W[2], i.y = (i.y ?? 0) - I / W[2], await B({ x: S, y: I }) && z(i)), s = requestAnimationFrame(A);
    }
    function L(W) {
      var j;
      const { nodeLookup: B, multiSelectionActive: x, nodesDraggable: C, transform: S, snapGrid: I, snapToGrid: O, selectNodesOnDrag: M, onNodeDragStart: T, onSelectionDragStart: D, unselectNodesAndEdges: H } = t();
      f = !0, (!M || !E) && !x && k && ((j = B.get(k)) != null && j.selected || H()), E && M && k && (e == null || e(k));
      const Y = an(W.sourceEvent, { transform: S, snapGrid: I, snapToGrid: O, containerBounds: d });
      if (i = Y, a = dw(B, C, Y, k), a.size > 0 && (n || T || !k && D)) {
        const [U, ee] = Io({
          nodeId: k,
          dragItems: a,
          nodeLookup: B
        });
        n == null || n(W.sourceEvent, a, U, ee), T == null || T(W.sourceEvent, U, ee), k || D == null || D(W.sourceEvent, ee);
      }
    }
    const P = pl().clickDistance(N).on("start", (W) => {
      const { domNode: B, nodeDragThreshold: x, transform: C, snapGrid: S, snapToGrid: I } = t();
      d = (B == null ? void 0 : B.getBoundingClientRect()) || null, p = !1, g = !1, v = W.sourceEvent, x === 0 && L(W), i = an(W.sourceEvent, { transform: C, snapGrid: S, snapToGrid: I, containerBounds: d }), c = Ve(W.sourceEvent, d);
    }).on("drag", (W) => {
      const { autoPanOnNodeDrag: B, transform: x, snapGrid: C, snapToGrid: S, nodeDragThreshold: I, nodeLookup: O } = t(), M = an(W.sourceEvent, { transform: x, snapGrid: C, snapToGrid: S, containerBounds: d });
      if (v = W.sourceEvent, (W.sourceEvent.type === "touchmove" && W.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      k && !O.has(k)) && (p = !0), !p) {
        if (!l && B && f && (l = !0, A()), !f) {
          const T = Ve(W.sourceEvent, d), D = T.x - c.x, H = T.y - c.y;
          Math.sqrt(D * D + H * H) > I && L(W);
        }
        (i.x !== M.xSnapped || i.y !== M.ySnapped) && a && f && (c = Ve(W.sourceEvent, d), z(M));
      }
    }).on("end", (W) => {
      if (!f || p) {
        p && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: B, updateNodePositions: x, onNodeDragStop: C, onSelectionDragStop: S } = t();
        if (g && (x(a, !1), g = !1), o || C || !k && S) {
          const [I, O] = Io({
            nodeId: k,
            dragItems: a,
            nodeLookup: B,
            dragging: !1
          });
          o == null || o(W.sourceEvent, a, I, O), C == null || C(W.sourceEvent, I, O), k || S == null || S(W.sourceEvent, O);
        }
      }
    }).filter((W) => {
      const B = W.target;
      return !W.button && (!_ || !Ds(B, `.${_}`, b)) && (!y || Ds(B, y, b));
    });
    u.call(P);
  }
  function m() {
    u == null || u.on(".drag", null);
  }
  return {
    update: w,
    destroy: m
  };
}
function hw(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Nr(o, gn(i)) > 0 && r.push(i);
  return r;
}
const pw = 250;
function gw(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = hw(e, n, t + pw);
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
function Jl(e, t, n, r, o, i = !1) {
  var c, d, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((d = s.internals.handleBounds) == null ? void 0 : d.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((u) => u.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...St(s, l, l.position, !0) } : l;
}
function ec(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function mw(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const tc = () => !0;
function yw(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: d, flowId: f, panBy: u, cancelConnection: p, onConnectStart: g, onConnect: v, onConnectEnd: w, isValidConnection: m = tc, onReconnectEnd: _, updateConnection: y, getTransform: b, getFromHandle: E, autoPanSpeed: k, dragThreshold: N = 1, handleDomNode: z }) {
  const A = Vl(e.target);
  let L = 0, P;
  const { x: W, y: B } = Ve(e), x = ec(i, z), C = a == null ? void 0 : a.getBoundingClientRect();
  let S = !1;
  if (!C || !x)
    return;
  const I = Jl(o, x, r, l, t);
  if (!I)
    return;
  let O = Ve(e, C), M = !1, T = null, D = !1, H = null;
  function Y() {
    if (!d || !C)
      return;
    const [Q, q] = Si(O, C, k);
    u({ x: Q, y: q }), L = requestAnimationFrame(Y);
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
    to: O,
    toHandle: null,
    toPosition: Ss[j.position],
    toNode: null,
    pointer: O
  };
  function R() {
    S = !0, y(G), g == null || g(e, { nodeId: o, handleId: r, handleType: x });
  }
  N === 0 && R();
  function F(Q) {
    if (!S) {
      const { x: ae, y: _e } = Ve(Q), Te = ae - W, ve = _e - B;
      if (!(Te * Te + ve * ve > N * N))
        return;
      R();
    }
    if (!E() || !j) {
      K(Q);
      return;
    }
    const q = b();
    O = Ve(Q, C), P = gw(Nn(O, q, !1, [1, 1]), n, l, j), M || (Y(), M = !0);
    const J = nc(Q, {
      handle: P,
      connectionMode: t,
      fromNodeId: o,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: m,
      doc: A,
      lib: c,
      flowId: f,
      nodeLookup: l
    });
    H = J.handleDomNode, T = J.connection, D = mw(!!P, J.isValid);
    const ne = l.get(o), re = ne ? St(ne, j, X.Left, !0) : G.from, ie = {
      ...G,
      from: re,
      isValid: D,
      to: J.toHandle && D ? Bt({ x: J.toHandle.x, y: J.toHandle.y }, q) : O,
      toHandle: J.toHandle,
      toPosition: D && J.toHandle ? J.toHandle.position : Ss[j.position],
      toNode: J.toHandle ? l.get(J.toHandle.nodeId) : null,
      pointer: O
    };
    y(ie), G = ie;
  }
  function K(Q) {
    if (!("touches" in Q && Q.touches.length > 0)) {
      if (S) {
        (P || H) && T && D && (v == null || v(T));
        const { inProgress: q, ...J } = G, ne = {
          ...J,
          toPosition: G.toHandle ? G.toPosition : null
        };
        w == null || w(Q, ne), i && (_ == null || _(Q, ne));
      }
      p(), cancelAnimationFrame(L), M = !1, D = !1, T = null, H = null, A.removeEventListener("mousemove", F), A.removeEventListener("mouseup", K), A.removeEventListener("touchmove", F), A.removeEventListener("touchend", K);
    }
  }
  A.addEventListener("mousemove", F), A.addEventListener("mouseup", K), A.addEventListener("touchmove", F), A.addEventListener("touchend", K);
}
function nc(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = tc, nodeLookup: d }) {
  const f = i === "target", u = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: p, y: g } = Ve(e), v = s.elementFromPoint(p, g), w = v != null && v.classList.contains(`${a}-flow__handle`) ? v : u, m = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const _ = ec(void 0, w), y = w.getAttribute("data-nodeid"), b = w.getAttribute("data-handleid"), E = w.classList.contains("connectable"), k = w.classList.contains("connectableend");
    if (!y || !_)
      return m;
    const N = {
      source: f ? y : r,
      sourceHandle: f ? b : o,
      target: f ? r : y,
      targetHandle: f ? o : b
    };
    m.connection = N;
    const A = E && k && (n === Dt.Strict ? f && _ === "source" || !f && _ === "target" : y !== r || b !== o);
    m.isValid = A && c(N), m.toHandle = Jl(y, _, b, d, n, !0);
  }
  return m;
}
const ei = {
  onPointerDown: yw,
  isValid: nc
};
function ww({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = Me(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: d = 1, pannable: f = !0, zoomable: u = !0, inversePan: p = !1 }) {
    const g = (y) => {
      if (y.sourceEvent.type !== "wheel" || !t)
        return;
      const b = n(), E = y.sourceEvent.ctrlKey && mn() ? 10 : 1, k = -y.sourceEvent.deltaY * (y.sourceEvent.deltaMode === 1 ? 0.05 : y.sourceEvent.deltaMode ? 1 : 2e-3) * d, N = b[2] * Math.pow(2, k * E);
      t.scaleTo(N);
    };
    let v = [0, 0];
    const w = (y) => {
      (y.sourceEvent.type === "mousedown" || y.sourceEvent.type === "touchstart") && (v = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ]);
    }, m = (y) => {
      const b = n();
      if (y.sourceEvent.type !== "mousemove" && y.sourceEvent.type !== "touchmove" || !t)
        return;
      const E = [
        y.sourceEvent.clientX ?? y.sourceEvent.touches[0].clientX,
        y.sourceEvent.clientY ?? y.sourceEvent.touches[0].clientY
      ], k = [E[0] - v[0], E[1] - v[1]];
      v = E;
      const N = r() * Math.max(b[2], Math.log(b[2])) * (p ? -1 : 1), z = {
        x: b[0] - k[0] * N,
        y: b[1] - k[1] * N
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: z.x,
        y: z.y,
        zoom: b[2]
      }, A, a);
    }, _ = Il().on("start", w).on("zoom", f ? m : null).on("zoom.wheel", u ? g : null);
    o.call(_, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: He
  };
}
const Vr = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), $o = ({ x: e, y: t, zoom: n }) => Rr.translate(e, t).scale(n), dt = (e, t) => e.target.closest(`.${t}`), rc = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), bw = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Ao = (e, t = 0, n = bw, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, oc = (e) => {
  const t = e.ctrlKey && mn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function vw({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (d) => {
    if (dt(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const w = He(d), m = oc(d), _ = f * Math.pow(2, m);
      r.scaleTo(n, _, w, d);
      return;
    }
    const u = d.deltaMode === 1 ? 20 : 1;
    let p = o === vt.Vertical ? 0 : d.deltaX * u, g = o === vt.Horizontal ? 0 : d.deltaY * u;
    !mn() && d.shiftKey && o !== vt.Vertical && (p = d.deltaY * u, g = 0), r.translateBy(
      n,
      -(p / f) * i,
      -(g / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = Vr(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(d, v) : (e.isPanScrolling = !0, a == null || a(d, v)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(d, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function xw({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = dt(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function _w({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = Vr(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function kw({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && rc(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, Vr(i.transform)));
  };
}
function Ew({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && rc(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = Vr(s.transform);
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
function Sw({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: d, connectionInProgress: f }) {
  return (u) => {
    var m;
    const p = t || n, g = r && u.ctrlKey, v = u.type === "wheel";
    if (u.button === 1 && u.type === "mousedown" && (dt(u, `${d}-flow__node`) || dt(u, `${d}-flow__edge`) || dt(u, `${d}-flow__selection`) || dt(u, `${d}-flow__nodesselection`)))
      return !0;
    if (!o && !p && !i && !s && !r || a || f && !v || dt(u, l) && v || dt(u, c) && (!v || i && v && !t) || !r && u.ctrlKey && v)
      return !1;
    if (!r && u.type === "touchstart" && ((m = u.touches) == null ? void 0 : m.length) > 1)
      return u.preventDefault(), !1;
    if (!p && !i && !g && v || !o && (u.type === "mousedown" || u.type === "touchstart") || Array.isArray(o) && !o.includes(u.button) && u.type === "mousedown")
      return !1;
    const w = Array.isArray(o) && o.includes(u.button) || !u.button || u.button <= 1;
    return (!u.ctrlKey || v || e) && w;
  };
}
function Nw({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
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
  const u = typeof ResizeObserver < "u" ? new ResizeObserver((B) => {
    const x = B[0];
    x && (f = [
      [0, 0],
      [x.contentRect.width, x.contentRect.height]
    ]);
  }) : null;
  u == null || u.observe(e);
  const p = Il().extent(() => f).scaleExtent([t, n]).translateExtent(r), g = Me(e).call(p);
  b({
    x: o.x,
    y: o.y,
    zoom: Ht(o.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const v = g.on("wheel.zoom"), w = g.on("dblclick.zoom");
  p.wheelDelta(oc);
  async function m(B, x) {
    return g ? new Promise((C) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? sn : lr).transform(Ao(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => C(!0)), B);
    }) : !1;
  }
  function _({ noWheelClassName: B, noPanClassName: x, onPaneContextMenu: C, userSelectionActive: S, panOnScroll: I, panOnDrag: O, panOnScrollMode: M, panOnScrollSpeed: T, preventScrolling: D, zoomOnPinch: H, zoomOnScroll: Y, zoomOnDoubleClick: j, panActivationKeyPressed: U = !1, zoomActivationKeyPressed: ee, lib: G, onTransformChange: R, connectionInProgress: F, paneClickDistance: K, selectionOnDrag: Q }) {
    S && !c.isZoomingOrPanning && y();
    const q = I && !ee && !S;
    p.clickDistance(Q ? 1 / 0 : !We(K) || K < 0 ? 0 : K);
    const J = q ? vw({
      zoomPanValues: c,
      noWheelClassName: B,
      d3Selection: g,
      d3Zoom: p,
      panOnScrollMode: M,
      panOnScrollSpeed: T,
      zoomOnPinch: H,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : xw({
      noWheelClassName: B,
      preventScrolling: D,
      d3ZoomHandler: v
    });
    g.on("wheel.zoom", J, { passive: !1 });
    const ne = _w({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    p.on("start", ne);
    const re = kw({
      zoomPanValues: c,
      panOnDrag: O,
      onPaneContextMenu: !!C,
      onPanZoom: i,
      onTransformChange: R
    });
    p.on("zoom", re);
    const ie = Ew({
      zoomPanValues: c,
      panOnDrag: O,
      panOnScroll: I,
      onPaneContextMenu: C,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    p.on("end", ie);
    const ae = Sw({
      panActivationKeyPressed: U,
      zoomActivationKeyPressed: ee,
      panOnDrag: O,
      zoomOnScroll: Y,
      panOnScroll: I,
      zoomOnDoubleClick: j,
      zoomOnPinch: H,
      userSelectionActive: S,
      noPanClassName: x,
      noWheelClassName: B,
      lib: G,
      connectionInProgress: F
    });
    p.filter(ae), j ? g.on("dblclick.zoom", w) : g.on("dblclick.zoom", null);
  }
  function y() {
    p.on("zoom", null);
  }
  async function b(B, x, C) {
    const S = $o(B), I = p == null ? void 0 : p.constrain()(S, x, C);
    return I && await m(I), I;
  }
  async function E(B, x) {
    const C = $o(B);
    return await m(C, x), C;
  }
  function k(B) {
    if (g) {
      const x = $o(B), C = g.property("__zoom");
      (C.k !== B.zoom || C.x !== B.x || C.y !== B.y) && (p == null || p.transform(g, x, null, { sync: !0 }));
    }
  }
  function N() {
    const B = g ? Ml(g.node()) : { x: 0, y: 0, k: 1 };
    return { x: B.x, y: B.y, zoom: B.k };
  }
  async function z(B, x) {
    return g ? new Promise((C) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? sn : lr).scaleTo(Ao(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => C(!0)), B);
    }) : !1;
  }
  async function A(B, x) {
    return g ? new Promise((C) => {
      p == null || p.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? sn : lr).scaleBy(Ao(g, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => C(!0)), B);
    }) : !1;
  }
  function L(B) {
    p == null || p.scaleExtent(B);
  }
  function P(B) {
    p == null || p.translateExtent(B);
  }
  function W(B) {
    const x = !We(B) || B < 0 ? 0 : B;
    p == null || p.clickDistance(x);
  }
  return {
    update: _,
    destroy: y,
    setViewport: E,
    setViewportConstrained: b,
    getViewport: N,
    scaleTo: z,
    scaleBy: A,
    setScaleExtent: L,
    setTranslateExtent: P,
    syncViewport: k,
    setClickDistance: W
  };
}
var Wt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Wt || (Wt = {}));
function Cw({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function Rs(e) {
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
function Hs(e, t) {
  return e ? !t : t;
}
function Mw(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: d, isVertical: f } = t, u = d && f, { xSnapped: p, ySnapped: g } = n, { minWidth: v, maxWidth: w, minHeight: m, maxHeight: _ } = r, { x: y, y: b, width: E, height: k, aspectRatio: N } = e;
  let z = Math.floor(d ? p - e.pointerX : 0), A = Math.floor(f ? g - e.pointerY : 0);
  const L = E + (l ? -z : z), P = k + (c ? -A : A), W = -i[0] * E, B = -i[1] * k;
  let x = Jn(L, v, w), C = Jn(P, m, _);
  if (s) {
    let O = 0, M = 0;
    l && z < 0 ? O = lt(y + z + W, s[0][0]) : !l && z > 0 && (O = ct(y + L + W, s[1][0])), c && A < 0 ? M = lt(b + A + B, s[0][1]) : !c && A > 0 && (M = ct(b + P + B, s[1][1])), x = Math.max(x, O), C = Math.max(C, M);
  }
  if (a) {
    let O = 0, M = 0;
    l && z > 0 ? O = ct(y + z, a[0][0]) : !l && z < 0 && (O = lt(y + L, a[1][0])), c && A > 0 ? M = ct(b + A, a[0][1]) : !c && A < 0 && (M = lt(b + P, a[1][1])), x = Math.max(x, O), C = Math.max(C, M);
  }
  if (o) {
    if (d) {
      const O = Jn(L / N, m, _) * N;
      if (x = Math.max(x, O), s) {
        let M = 0;
        !l && !c || l && !c && u ? M = ct(b + B + L / N, s[1][1]) * N : M = lt(b + B + (l ? z : -z) / N, s[0][1]) * N, x = Math.max(x, M);
      }
      if (a) {
        let M = 0;
        !l && !c || l && !c && u ? M = lt(b + L / N, a[1][1]) * N : M = ct(b + (l ? z : -z) / N, a[0][1]) * N, x = Math.max(x, M);
      }
    }
    if (f) {
      const O = Jn(P * N, v, w) / N;
      if (C = Math.max(C, O), s) {
        let M = 0;
        !l && !c || c && !l && u ? M = ct(y + P * N + W, s[1][0]) / N : M = lt(y + (c ? A : -A) * N + W, s[0][0]) / N, C = Math.max(C, M);
      }
      if (a) {
        let M = 0;
        !l && !c || c && !l && u ? M = lt(y + P * N, a[1][0]) / N : M = ct(y + (c ? A : -A) * N, a[0][0]) / N, C = Math.max(C, M);
      }
    }
  }
  A = A + (A < 0 ? C : -C), z = z + (z < 0 ? x : -x), o && (u ? L > P * N ? A = (Hs(l, c) ? -z : z) / N : z = (Hs(l, c) ? -A : A) * N : d ? (A = z / N, c = l) : (z = A * N, l = c));
  const S = l ? y + z : y, I = c ? b + A : b;
  return {
    width: E + (l ? -z : z),
    height: k + (c ? -A : A),
    x: i[0] * z * (l ? -1 : 1) + S,
    y: i[1] * A * (c ? -1 : 1) + I
  };
}
const ic = { width: 0, height: 0, x: 0, y: 0 }, Iw = {
  ...ic,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function $w(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function Aw({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = Me(e);
  let s = {
    controlDirection: Rs("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: d, keepAspectRatio: f, resizeDirection: u, onResizeStart: p, onResize: g, onResizeEnd: v, shouldResize: w }) {
    let m = { ...ic }, _ = { ...Iw };
    s = {
      boundaries: d,
      resizeDirection: u,
      keepAspectRatio: f,
      controlDirection: Rs(c)
    };
    let y, b = null, E = [], k, N, z;
    const A = pl().on("start", (L) => {
      const { nodeLookup: P, transform: W, snapGrid: B, snapToGrid: x, nodeOrigin: C, paneDomNode: S } = n();
      if (y = P.get(t), !y)
        return;
      b = (S == null ? void 0 : S.getBoundingClientRect()) ?? null;
      const { xSnapped: I, ySnapped: O } = an(L.sourceEvent, {
        transform: W,
        snapGrid: B,
        snapToGrid: x,
        containerBounds: b
      });
      m = {
        width: y.measured.width ?? 0,
        height: y.measured.height ?? 0,
        x: y.position.x ?? 0,
        y: y.position.y ?? 0
      }, _ = {
        ...m,
        pointerX: I,
        pointerY: O,
        aspectRatio: m.width / m.height
      }, k = void 0, N = Et(y.extent) ? y.extent : void 0, y.parentId && (y.extent === "parent" || y.expandParent) && (k = P.get(y.parentId)), k && y.extent === "parent" && (N = [
        [0, 0],
        [k.measured.width, k.measured.height]
      ]), E = [], z = void 0;
      for (const [M, T] of P)
        if (T.parentId === t && (E.push({
          id: M,
          position: { ...T.position },
          extent: T.extent
        }), T.extent === "parent" || T.expandParent)) {
          const D = $w(T, y, T.origin ?? C);
          z ? z = [
            [Math.min(D[0][0], z[0][0]), Math.min(D[0][1], z[0][1])],
            [Math.max(D[1][0], z[1][0]), Math.max(D[1][1], z[1][1])]
          ] : z = D;
        }
      p == null || p(L, { ...m });
    }).on("drag", (L) => {
      const { transform: P, snapGrid: W, snapToGrid: B, nodeOrigin: x } = n(), C = an(L.sourceEvent, {
        transform: P,
        snapGrid: W,
        snapToGrid: B,
        containerBounds: b
      }), S = [];
      if (!y)
        return;
      const { x: I, y: O, width: M, height: T } = m, D = {}, H = y.origin ?? x, { width: Y, height: j, x: U, y: ee } = Mw(_, s.controlDirection, C, s.boundaries, s.keepAspectRatio, H, N, z), G = Y !== M, R = j !== T, F = U !== I && G, K = ee !== O && R;
      if (!F && !K && !G && !R)
        return;
      const Q = {
        prevValues: { ...m },
        startX: _.x,
        startY: _.y,
        childNodes: E.map((re) => ({
          ...re,
          position: { ...re.position }
        }))
      };
      if ((F || K || H[0] === 1 || H[1] === 1) && (D.x = F ? U : m.x, D.y = K ? ee : m.y, m.x = D.x, m.y = D.y, E.length > 0)) {
        const re = U - I, ie = ee - O;
        for (const ae of E)
          ae.position = {
            x: ae.position.x - re + H[0] * (Y - M),
            y: ae.position.y - ie + H[1] * (j - T)
          }, S.push(ae);
      }
      if ((G || R) && (D.width = G && (!s.resizeDirection || s.resizeDirection === "horizontal") ? Y : m.width, D.height = R && (!s.resizeDirection || s.resizeDirection === "vertical") ? j : m.height, m.width = D.width, m.height = D.height), k && y.expandParent) {
        const re = H[0] * (D.width ?? 0);
        D.x && D.x < re && (m.x = re, _.x = _.x - (D.x - re));
        const ie = H[1] * (D.height ?? 0);
        D.y && D.y < ie && (m.y = ie, _.y = _.y - (D.y - ie));
      }
      const q = Cw({
        width: m.width,
        prevWidth: M,
        height: m.height,
        prevHeight: T,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), J = { ...m, direction: q };
      if ((w == null ? void 0 : w(L, J)) === !1) {
        m = Q.prevValues, _.x = Q.startX, _.y = Q.startY, E.forEach((re, ie) => {
          re.position = Q.childNodes[ie].position;
        });
        return;
      }
      g == null || g(L, J), r(D, S);
    }).on("end", (L) => {
      v == null || v(L, { ...m }), o == null || o({ ...m });
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
var sc = { exports: {} }, ac = {}, lc = { exports: {} }, cc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vt = di;
function Tw(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var zw = typeof Object.is == "function" ? Object.is : Tw, Lw = Vt.useState, Ow = Vt.useEffect, Pw = Vt.useLayoutEffect, Dw = Vt.useDebugValue;
function Rw(e, t) {
  var n = t(), r = Lw({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Pw(
    function() {
      o.value = n, o.getSnapshot = t, To(o) && i({ inst: o });
    },
    [e, n, t]
  ), Ow(
    function() {
      return To(o) && i({ inst: o }), e(function() {
        To(o) && i({ inst: o });
      });
    },
    [e]
  ), Dw(n), n;
}
function To(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !zw(e, n);
  } catch {
    return !0;
  }
}
function Hw(e, t) {
  return t();
}
var Bw = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Hw : Rw;
cc.useSyncExternalStore = Vt.useSyncExternalStore !== void 0 ? Vt.useSyncExternalStore : Bw;
lc.exports = cc;
var Ww = lc.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Fr = di, Vw = Ww;
function Fw(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var jw = typeof Object.is == "function" ? Object.is : Fw, Yw = Vw.useSyncExternalStore, Gw = Fr.useRef, Xw = Fr.useEffect, Uw = Fr.useMemo, qw = Fr.useDebugValue;
ac.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = Gw(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = Uw(
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
        if (g = f, jw(d, p)) return g;
        var v = r(p);
        return o !== void 0 && o(g, v) ? (d = p, g) : (d = p, f = v);
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
  var a = Yw(e, i[0], i[1]);
  return Xw(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), qw(a), a;
};
sc.exports = ac;
var Zw = sc.exports;
const Kw = /* @__PURE__ */ Ca(Zw), Qw = {}, Bs = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, f) => {
    const u = typeof d == "function" ? d(t) : d;
    if (!Object.is(u, t)) {
      const p = t;
      t = f ?? (typeof u != "object" || u === null) ? u : Object.assign({}, t, u), n.forEach((g) => g(t, p));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (Qw ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, Jw = (e) => e ? Bs(e) : Bs, { useDebugValue: eb } = di, { useSyncExternalStoreWithSelector: tb } = Kw, nb = (e) => e;
function dc(e, t = nb, n) {
  const r = tb(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return eb(r), r;
}
const Ws = (e, t) => {
  const n = Jw(e), r = (o, i = t) => dc(n, o, i);
  return Object.assign(r, n), r;
}, rb = (e, t) => e ? Ws(e, t) : Ws;
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
const jr = $r(null), ob = jr.Provider, uc = Fe.error001("react");
function se(e, t) {
  const n = Ft(jr);
  if (n === null)
    throw new Error(uc);
  return dc(n, e, t);
}
function ue() {
  const e = Ft(jr);
  if (e === null)
    throw new Error(uc);
  return le(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const Vs = { display: "none" }, ib = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, fc = "react-flow__node-desc", hc = "react-flow__edge-desc", sb = "react-flow__aria-live", ab = (e) => e.ariaLiveMessage, lb = (e) => e.ariaLabelConfig;
function cb({ rfId: e }) {
  const t = se(ab);
  return h("div", { id: `${sb}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: ib, children: t });
}
function db({ rfId: e, disableKeyboardA11y: t }) {
  const n = se(lb);
  return $(be, { children: [h("div", { id: `${fc}-${e}`, style: Vs, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), h("div", { id: `${hc}-${e}`, style: Vs, children: n["edge.a11yDescription.default"] }), !t && h(cb, { rfId: e })] });
}
const Nt = Ea(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return h("div", { className: we(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
Nt.displayName = "Panel";
const Fs = "https://reactflow.dev?utm_source=attribution";
function ub({ proOptions: e, position: t = "bottom-right" }) {
  return ce(() => {
  }, []), e != null && e.hideAttribution ? null : h(Nt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${Fs}`, children: h("a", { href: Fs, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const fb = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, er = (e) => e.id;
function hb(e, t) {
  return pe(e.selectedNodes.map(er), t.selectedNodes.map(er)) && pe(e.selectedEdges.map(er), t.selectedEdges.map(er));
}
function pb({ onSelectionChange: e }) {
  const t = ue(), { selectedNodes: n, selectedEdges: r } = se(fb, hb);
  return ce(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const gb = (e) => !!e.onSelectionChangeHandlers;
function mb({ onSelectionChange: e }) {
  const t = se(gb);
  return e || t ? h(pb, { onSelectionChange: e }) : null;
}
const pc = [0, 0], yb = { x: 0, y: 0, zoom: 1 }, wb = [
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
], js = [...wb, "rfId"], bb = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), Ys = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: hn,
  nodeOrigin: pc,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function vb(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = se(bb, pe), c = ue();
  ce(() => (l(e.defaultNodes, e.defaultEdges), () => {
    d.current = Ys, a();
  }), []);
  const d = oe(Ys);
  return ce(
    () => {
      for (const f of js) {
        const u = e[f], p = d.current[f];
        u !== p && (typeof e[f] > "u" || (f === "nodes" ? t(u) : f === "edges" ? n(u) : f === "minZoom" ? r(u) : f === "maxZoom" ? o(u) : f === "translateExtent" ? i(u) : f === "nodeExtent" ? s(u) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: jy(u) }) : f === "fitView" ? c.setState({ fitViewQueued: u }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: u }) : c.setState({ [f]: u })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    js.map((f) => e[f])
  ), null;
}
function Gs() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function xb(e) {
  var r;
  const [t, n] = te(e === "system" ? null : e);
  return ce(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Gs(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = Gs()) != null && r.matches ? "dark" : "light";
}
const Xs = typeof document < "u" ? document : null;
function yn(e = null, t = { target: Xs, actInsideInputWithModifier: !0 }) {
  const [n, r] = te(!1), o = oe(!1), i = oe(/* @__PURE__ */ new Set([])), [s, a] = le(() => {
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
    const l = (t == null ? void 0 : t.target) ?? Xs, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const d = (p) => {
        var w, m;
        if (o.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!o.current || o.current && !c) && Fl(p))
          return !1;
        const v = qs(p.code, a);
        if (i.current.add(p[v]), Us(s, i.current, !1)) {
          const _ = ((m = (w = p.composedPath) == null ? void 0 : w.call(p)) == null ? void 0 : m[0]) || p.target, y = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !y) && p.preventDefault(), r(!0);
        }
      }, f = (p) => {
        const g = qs(p.code, a);
        Us(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(p[g]), p.key === "Meta" && i.current.clear(), o.current = !1;
      }, u = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", d), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", u), window.addEventListener("contextmenu", u), () => {
        l == null || l.removeEventListener("keydown", d), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", u), window.removeEventListener("contextmenu", u);
      };
    }
  }, [e, r]), n;
}
function Us(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function qs(e, t) {
  return t.includes(e) ? "code" : "key";
}
const _b = () => {
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = Wr(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      const { x: o, y: i } = r.getBoundingClientRect(), s = Bt(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function gc(e, t) {
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
      kb(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function kb(e, t) {
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
function Eb(e, t) {
  return gc(e, t);
}
function Sb(e, t) {
  return gc(e, t);
}
function yt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Tt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(yt(i.id, s)));
  }
  return r;
}
function Zs({ items: e = [], lookup: t }) {
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
function Ks(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Nb = Rl();
function Cb(e, t, n = {}) {
  return Zy(e, t, {
    ...n,
    onError: n.onError ?? Nb
  });
}
const Qs = (e) => Oy(e), Mb = (e) => zl(e);
function mc(e) {
  return Ea(e);
}
const yc = typeof window < "u" ? ui : ce;
function Js(e) {
  const [t, n] = te(BigInt(0)), [r] = te(() => Ib(() => n((o) => o + BigInt(1))));
  return yc(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function Ib(e) {
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
const wc = $r(null);
function $b({ children: e }) {
  const t = ue(), n = $e((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: d, onNodesChange: f, nodeLookup: u, fitViewQueued: p, onNodesChangeMiddlewareMap: g } = t.getState();
    let v = l;
    for (const m of a)
      v = typeof m == "function" ? m(v) : m;
    let w = Zs({
      items: v,
      lookup: u
    });
    for (const m of g.values())
      w = m(w);
    d && c(v), w.length > 0 ? f == null || f(w) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: _, setNodes: y } = t.getState();
      m && y(_);
    });
  }, []), r = Js(n), o = $e((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: d, onEdgesChange: f, edgeLookup: u } = t.getState();
    let p = l;
    for (const g of a)
      p = typeof g == "function" ? g(p) : g;
    d ? c(p) : f && f(Zs({
      items: p,
      lookup: u
    }));
  }, []), i = Js(o), s = le(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return h(wc.Provider, { value: s, children: e });
}
function Ab() {
  const e = Ft(wc);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Tb = (e) => !!e.panZoom;
function Yr() {
  const e = _b(), t = ue(), n = Ab(), r = se(Tb), o = le(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var m, _;
      const { nodeLookup: u, nodeOrigin: p } = t.getState(), g = Qs(f) ? f : u.get(f.id), v = g.parentId ? Bl(g.position, g.measured, g.parentId, u, p) : g.position, w = {
        ...g,
        position: v,
        width: ((m = g.measured) == null ? void 0 : m.width) ?? g.width,
        height: ((_ = g.measured) == null ? void 0 : _.height) ?? g.height
      };
      return gn(w);
    }, c = (f, u, p = { replace: !1 }) => {
      s((g) => g.map((v) => {
        if (v.id === f) {
          const w = typeof u == "function" ? u(v) : u;
          return p.replace && Qs(w) ? w : { ...v, ...w };
        }
        return v;
      }));
    }, d = (f, u, p = { replace: !1 }) => {
      a((g) => g.map((v) => {
        if (v.id === f) {
          const w = typeof u == "function" ? u(v) : u;
          return p.replace && Mb(w) ? w : { ...v, ...w };
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
        n.nodeQueue.push((p) => [...p, ...u]);
      },
      addEdges: (f) => {
        const u = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((p) => [...p, ...u]);
      },
      toObject: () => {
        const { nodes: f = [], edges: u = [], transform: p } = t.getState(), [g, v, w] = p;
        return {
          nodes: f.map((m) => ({ ...m })),
          edges: u.map((m) => ({ ...m })),
          viewport: {
            x: g,
            y: v,
            zoom: w
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: u = [] }) => {
        const { nodes: p, edges: g, onNodesDelete: v, onEdgesDelete: w, triggerNodeChanges: m, triggerEdgeChanges: _, onDelete: y, onBeforeDelete: b } = t.getState(), { nodes: E, edges: k } = await By({
          nodesToRemove: f,
          edgesToRemove: u,
          nodes: p,
          edges: g,
          onBeforeDelete: b
        }), N = k.length > 0, z = E.length > 0;
        if (N) {
          const A = k.map(Ks);
          w == null || w(k), _(A);
        }
        if (z) {
          const A = E.map(Ks);
          v == null || v(E), m(A);
        }
        return (z || N) && (y == null || y({ nodes: E, edges: k })), { deletedNodes: E, deletedEdges: k };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, u = !0, p) => {
        const g = Cs(f), v = g ? f : l(f), w = p !== void 0;
        return v ? (p || t.getState().nodes).filter((m) => {
          const _ = t.getState().nodeLookup.get(m.id);
          if (_ && !g && (m.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const y = gn(w ? m : _), b = Nr(y, v);
          return u && b > 0 || b >= y.width * y.height || b >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, u, p = !0) => {
        const v = Cs(f) ? f : l(f);
        if (!v)
          return !1;
        const w = Nr(v, u);
        return p && w > 0 || w >= u.width * u.height || w >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (f, u, p = { replace: !1 }) => {
        c(f, (g) => {
          const v = typeof u == "function" ? u(g) : u;
          return p.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, p);
      },
      updateEdge: d,
      updateEdgeData: (f, u, p = { replace: !1 }) => {
        d(f, (g) => {
          const v = typeof u == "function" ? u(g) : u;
          return p.replace ? { ...g, data: v } : { ...g, data: { ...g.data, ...v } };
        }, p);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: u, nodeOrigin: p } = t.getState();
        return Py(f, { nodeLookup: u, nodeOrigin: p });
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
        const u = t.getState().fitViewResolver ?? Fy();
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
const ea = (e) => e.selected, zb = typeof window < "u" ? window : void 0;
function Lb({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = ue(), { deleteElements: r } = Yr(), o = yn(e, { actInsideInputWithModifier: !1 }), i = yn(t, { target: zb });
  ce(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(ea), edges: s.filter(ea) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), ce(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Ob(e) {
  const t = ue();
  ce(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = Ni(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", Fe.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
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
const Gr = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Pb = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Db({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = vt.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: d, minZoom: f, maxZoom: u, zoomActivationKeyCode: p, preventScrolling: g = !0, children: v, noWheelClassName: w, noPanClassName: m, onViewportChange: _, isControlledViewport: y, paneClickDistance: b, selectionOnDrag: E }) {
  const k = ue(), N = oe(null), { userSelectionActive: z, lib: A, connectionInProgress: L } = se(Pb, pe), P = yn(p), W = oe();
  Ob(N);
  const B = $e((x) => {
    _ == null || _({ x: x[0], y: x[1], zoom: x[2] }), y || k.setState({ transform: x });
  }, [_, y]);
  return ce(() => {
    if (N.current) {
      W.current = Nw({
        domNode: N.current,
        minZoom: f,
        maxZoom: u,
        translateExtent: d,
        viewport: c,
        onDraggingChange: (I) => k.setState((O) => O.paneDragging === I ? O : { paneDragging: I }),
        onPanZoomStart: (I, O) => {
          const { onViewportChangeStart: M, onMoveStart: T } = k.getState();
          T == null || T(I, O), M == null || M(O);
        },
        onPanZoom: (I, O) => {
          const { onViewportChange: M, onMove: T } = k.getState();
          T == null || T(I, O), M == null || M(O);
        },
        onPanZoomEnd: (I, O) => {
          const { onViewportChangeEnd: M, onMoveEnd: T } = k.getState();
          T == null || T(I, O), M == null || M(O);
        }
      });
      const { x, y: C, zoom: S } = W.current.getViewport();
      return k.setState({
        panZoom: W.current,
        transform: [x, C, S],
        domNode: N.current.closest(".react-flow")
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
      zoomActivationKeyPressed: P,
      preventScrolling: g,
      noPanClassName: m,
      userSelectionActive: z,
      noWheelClassName: w,
      lib: A,
      onTransformChange: B,
      connectionInProgress: L,
      selectionOnDrag: E,
      paneClickDistance: b
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
    P,
    g,
    m,
    z,
    w,
    A,
    B,
    L,
    E,
    b
  ]), h("div", { className: "react-flow__renderer", ref: N, style: Gr, children: v });
}
const Rb = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Hb() {
  const { userSelectionActive: e, userSelectionRect: t } = se(Rb, pe);
  return e && t ? h("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const zo = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Bb = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Wb({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = pn.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: d, onPaneScroll: f, onPaneMouseEnter: u, onPaneMouseMove: p, onPaneMouseLeave: g, children: v }) {
  const w = oe(0), m = ue(), { userSelectionActive: _, elementsSelectable: y, dragging: b, panBy: E, autoPanSpeed: k } = se(Bb, pe), N = y && (e || _), z = oe(null), A = oe(), L = oe(/* @__PURE__ */ new Set()), P = oe(/* @__PURE__ */ new Set()), W = oe(!1), B = oe(!1), x = oe({ x: 0, y: 0 }), C = oe(!1), S = (R) => {
    if (B.current || W.current || m.getState().connection.inProgress) {
      B.current = !1, W.current = !1;
      return;
    }
    c == null || c(R), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, I = (R) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      R.preventDefault();
      return;
    }
    d == null || d(R);
  }, O = f ? (R) => f(R) : void 0, M = (R) => {
    B.current && (R.stopPropagation(), B.current = !1);
  }, T = (R) => {
    var ae, _e;
    if (R.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: F, transform: K } = m.getState();
    if (A.current = F == null ? void 0 : F.getBoundingClientRect(), !A.current)
      return;
    const Q = R.target === z.current;
    if (!Q && !!R.target.closest(".nokey") || !e || !(s && Q || t) || R.button !== 0 || !R.isPrimary)
      return;
    (_e = (ae = R.target) == null ? void 0 : ae.setPointerCapture) == null || _e.call(ae, R.pointerId), B.current = !1;
    const { x: ne, y: re } = Ve(R.nativeEvent, A.current), ie = Nn({ x: ne, y: re }, K);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ie.x,
        startY: ie.y,
        x: ne,
        y: re
      }
    }), Q || (R.stopPropagation(), R.preventDefault());
  };
  function D(R, F) {
    const { userSelectionRect: K } = m.getState();
    if (!K)
      return;
    const { transform: Q, nodeLookup: q, edgeLookup: J, connectionLookup: ne, triggerNodeChanges: re, triggerEdgeChanges: ie, defaultEdgeOptions: ae } = m.getState(), _e = { x: K.startX, y: K.startY }, { x: Te, y: ve } = Bt(_e, Q), Pe = {
      startX: _e.x,
      startY: _e.y,
      x: R < Te ? R : Te,
      y: F < ve ? F : ve,
      width: Math.abs(R - Te),
      height: Math.abs(F - ve)
    }, Ke = L.current, De = P.current;
    L.current = new Set(Ei(q, Pe, Q, n === pn.Partial, !0).map((ke) => ke.id)), P.current = /* @__PURE__ */ new Set();
    const Qe = (ae == null ? void 0 : ae.selectable) ?? !0;
    for (const ke of L.current) {
      const Se = ne.get(ke);
      if (Se)
        for (const { edgeId: Ne } of Se.values()) {
          const Je = J.get(Ne);
          Je && (Je.selectable ?? Qe) && P.current.add(Ne);
        }
    }
    if (!Ms(Ke, L.current)) {
      const ke = Tt(q, L.current, !0);
      re(ke);
    }
    if (!Ms(De, P.current)) {
      const ke = Tt(J, P.current);
      ie(ke);
    }
    m.setState({
      userSelectionRect: Pe,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function H() {
    if (!o || !A.current)
      return;
    const [R, F] = Si(x.current, A.current, k);
    E({ x: R, y: F }).then((K) => {
      if (!B.current || !K) {
        w.current = requestAnimationFrame(H);
        return;
      }
      const { x: Q, y: q } = x.current;
      D(Q, q), w.current = requestAnimationFrame(H);
    });
  }
  const Y = () => {
    cancelAnimationFrame(w.current), w.current = 0, C.current = !1;
  };
  ce(() => () => Y(), []);
  const j = (R) => {
    const { userSelectionRect: F, transform: K, resetSelectedElements: Q } = m.getState();
    if (!A.current || !F)
      return;
    const { x: q, y: J } = Ve(R.nativeEvent, A.current);
    x.current = { x: q, y: J };
    const ne = Bt({ x: F.startX, y: F.startY }, K);
    if (!B.current) {
      const re = t ? 0 : i;
      if (Math.hypot(q - ne.x, J - ne.y) <= re)
        return;
      Q(), a == null || a(R);
    }
    B.current = !0, C.current || (H(), C.current = !0), D(q, J);
  }, U = (R) => {
    var F, K;
    if (!N) {
      R.target === z.current && m.getState().connection.inProgress && (W.current = !0);
      return;
    }
    R.button === 0 && ((K = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || K.call(F, R.pointerId), !_ && R.target === z.current && m.getState().userSelectionRect && (S == null || S(R)), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), B.current && (l == null || l(R), m.setState({
      nodesSelectionActive: L.current.size > 0
    })), Y());
  }, ee = (R) => {
    var F, K;
    (K = (F = R.target) == null ? void 0 : F.releasePointerCapture) == null || K.call(F, R.pointerId), Y();
  }, G = r === !0 || Array.isArray(r) && r.includes(0);
  return $("div", { className: we(["react-flow__pane", { draggable: G, dragging: b, selection: e }]), onClick: N ? void 0 : zo(S, z), onContextMenu: zo(I, z), onWheel: zo(O, z), onPointerEnter: N ? void 0 : u, onPointerMove: N ? j : p, onPointerUp: U, onPointerCancel: N ? ee : void 0, onPointerDownCapture: N ? T : void 0, onClickCapture: N ? M : void 0, onPointerLeave: g, ref: z, style: Gr, children: [v, h(Hb, {})] });
}
function ti({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", Fe.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var d;
    return (d = r == null ? void 0 : r.current) == null ? void 0 : d.blur();
  })) : o([e]);
}
function bc({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = ue(), [l, c] = te(!1), d = oe();
  return ce(() => {
    if (!t)
      return d.current = fw({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          ti({
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
const Vb = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function vc() {
  const e = ue();
  return $e((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: d } = e.getState(), f = /* @__PURE__ */ new Map(), u = Vb(s), p = o ? i[0] : 5, g = o ? i[1] : 5, v = n.direction.x * p * n.factor, w = n.direction.y * g * n.factor;
    for (const [, m] of c) {
      if (!u(m))
        continue;
      let _ = {
        x: m.internals.positionAbsolute.x + v,
        y: m.internals.positionAbsolute.y + w
      };
      o && (_ = Sn(_, i));
      const { position: y, positionAbsolute: b } = Ll({
        nodeId: m.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: d,
        onError: a
      });
      m.position = y, m.internals.positionAbsolute = b, f.set(m.id, m);
    }
    l(f);
  }, []);
}
const Ti = $r(null), Fb = Ti.Provider;
Ti.Consumer;
const xc = () => Ft(Ti), jb = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), _c = $r(null);
function Yb({ children: e }) {
  const t = se(jb, pe);
  return h(_c.Provider, { value: t, children: e });
}
function Gb() {
  const e = Ft(_c);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Xb = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, Ub = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Xb;
  const d = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: d,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === Dt.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: d && c
  };
};
function qb({ type: e = "source", position: t = X.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: d, onTouchStart: f, ...u }, p) {
  var C, S;
  const g = s || null, v = e === "target", w = ue(), m = xc(), { connectOnClick: _, noPanClassName: y, rfId: b } = Gb(), { connectingFrom: E, connectingTo: k, clickConnecting: N, isPossibleEndHandle: z, connectionInProcess: A, clickConnectionInProcess: L, valid: P } = se(Ub(m, g, e), pe);
  m || (S = (C = w.getState()).onError) == null || S.call(C, "010", Fe.error010());
  const W = (I) => {
    const { defaultEdgeOptions: O, onConnect: M, hasDefaultEdges: T } = w.getState(), D = {
      ...O,
      ...I
    };
    if (T) {
      const { edges: H, setEdges: Y, onError: j } = w.getState();
      Y(Cb(D, H, { onError: j }));
    }
    M == null || M(D), a == null || a(D);
  }, B = (I) => {
    if (!m)
      return;
    const O = jl(I.nativeEvent);
    if (o && (O && I.button === 0 || !O)) {
      const M = w.getState();
      ei.onPointerDown(I.nativeEvent, {
        handleDomNode: I.currentTarget,
        autoPanOnConnect: M.autoPanOnConnect,
        connectionMode: M.connectionMode,
        connectionRadius: M.connectionRadius,
        domNode: M.domNode,
        nodeLookup: M.nodeLookup,
        lib: M.lib,
        isTarget: v,
        handleId: g,
        nodeId: m,
        flowId: M.rfId,
        panBy: M.panBy,
        cancelConnection: M.cancelConnection,
        onConnectStart: M.onConnectStart,
        onConnectEnd: (...T) => {
          var D, H;
          return (H = (D = w.getState()).onConnectEnd) == null ? void 0 : H.call(D, ...T);
        },
        updateConnection: M.updateConnection,
        onConnect: W,
        isValidConnection: n || ((...T) => {
          var D, H;
          return ((H = (D = w.getState()).isValidConnection) == null ? void 0 : H.call(D, ...T)) ?? !0;
        }),
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    O ? d == null || d(I) : f == null || f(I);
  }, x = (I) => {
    const { onClickConnectStart: O, onClickConnectEnd: M, connectionClickStartHandle: T, connectionMode: D, isValidConnection: H, lib: Y, rfId: j, nodeLookup: U, connection: ee } = w.getState();
    if (!m || !T && !o)
      return;
    if (!T) {
      O == null || O(I.nativeEvent, { nodeId: m, handleId: g, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: g } });
      return;
    }
    const G = Vl(I.target), R = n || H, { connection: F, isValid: K } = ei.isValid(I.nativeEvent, {
      handle: {
        nodeId: m,
        id: g,
        type: e
      },
      connectionMode: D,
      fromNodeId: T.nodeId,
      fromHandleId: T.id || null,
      fromType: T.type,
      isValidConnection: R,
      flowId: j,
      doc: G,
      lib: Y,
      nodeLookup: U
    });
    K && F && W(F);
    const Q = structuredClone(ee);
    delete Q.inProgress, Q.toPosition = Q.toHandle ? Q.toHandle.position : null, M == null || M(I, Q), w.setState({ connectionClickStartHandle: null });
  };
  return h("div", { "data-handleid": g, "data-nodeid": m, "data-handlepos": t, "data-id": `${b}-${m}-${g}-${e}`, className: we([
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
      clickconnecting: N,
      connectingfrom: E,
      connectingto: k,
      valid: P,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!A || z) && (A || L ? i : o)
    }
  ]), onMouseDown: B, onTouchStart: B, onClick: _ ? x : void 0, ref: p, ...u, children: l });
}
const pt = fe(mc(qb));
function Zb({ data: e, isConnectable: t, sourcePosition: n = X.Bottom }) {
  return $(be, { children: [e == null ? void 0 : e.label, h(pt, { type: "source", position: n, isConnectable: t })] });
}
function Kb({ data: e, isConnectable: t, targetPosition: n = X.Top, sourcePosition: r = X.Bottom }) {
  return $(be, { children: [h(pt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, h(pt, { type: "source", position: r, isConnectable: t })] });
}
function Qb() {
  return null;
}
function Jb({ data: e, isConnectable: t, targetPosition: n = X.Top }) {
  return $(be, { children: [h(pt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Cr = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, ta = {
  input: Zb,
  default: Kb,
  output: Jb,
  group: Qb
};
function ev(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const tv = (e) => {
  const { width: t, height: n, x: r, y: o } = En(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: We(t) ? t : null,
    height: We(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function nv({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = ue(), { width: o, height: i, transformString: s, userSelectionActive: a } = se(tv, pe), l = vc(), c = oe(null);
  ce(() => {
    var p;
    n || (p = c.current) == null || p.focus({
      preventScroll: !0
    });
  }, [n]);
  const d = !a && o !== null && i !== null;
  if (bc({
    nodeRef: c,
    disabled: !d
  }), !d)
    return null;
  const f = e ? (p) => {
    const g = r.getState().nodes.filter((v) => v.selected);
    e(p, g);
  } : void 0, u = (p) => {
    Object.prototype.hasOwnProperty.call(Cr, p.key) && (p.preventDefault(), l({
      direction: Cr[p.key],
      factor: p.shiftKey ? 4 : 1
    }));
  };
  return h("div", { className: we(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: h("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : u, style: {
    width: o,
    height: i
  } }) });
}
const na = typeof window < "u" ? window : void 0, rv = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function kc({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: d, selectionMode: f, onSelectionStart: u, onSelectionEnd: p, multiSelectionKeyCode: g, panActivationKeyCode: v, zoomActivationKeyCode: w, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: b, panOnScrollSpeed: E, panOnScrollMode: k, zoomOnDoubleClick: N, panOnDrag: z, autoPanOnSelection: A, defaultViewport: L, translateExtent: P, minZoom: W, maxZoom: B, preventScrolling: x, onSelectionContextMenu: C, noWheelClassName: S, noPanClassName: I, disableKeyboardA11y: O, onViewportChange: M, isControlledViewport: T }) {
  const { nodesSelectionActive: D, userSelectionActive: H } = se(rv, pe), Y = yn(c, { target: na }), j = yn(v, { target: na }), U = j || z, ee = j || b, G = d && U !== !0, R = Y || H || G;
  return Lb({ deleteKeyCode: l, multiSelectionKeyCode: g }), h(Db, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: _, zoomOnPinch: y, panOnScroll: ee, panActivationKeyPressed: j, panOnScrollSpeed: E, panOnScrollMode: k, zoomOnDoubleClick: N, panOnDrag: !Y && U, defaultViewport: L, translateExtent: P, minZoom: W, maxZoom: B, zoomActivationKeyCode: w, preventScrolling: x, noWheelClassName: S, noPanClassName: I, onViewportChange: M, isControlledViewport: T, paneClickDistance: a, selectionOnDrag: G, children: $(Wb, { onSelectionStart: u, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: U, autoPanOnSelection: A, isSelecting: !!R, selectionMode: f, selectionKeyPressed: Y, paneClickDistance: a, selectionOnDrag: G, children: [e, D && h(nv, { onSelectionContextMenu: C, noPanClassName: I, disableKeyboardA11y: O })] }) });
}
kc.displayName = "FlowRenderer";
const ov = fe(kc), iv = (e) => (t) => e ? Ei(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function sv(e) {
  return se($e(iv(e), [e]), pe);
}
const av = (e) => e.updateNodeInternals;
function lv() {
  const e = se(av), [t] = te(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
function cv({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
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
function dv({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: d, resizeObserver: f, noDragClassName: u, noPanClassName: p, disableKeyboardA11y: g, rfId: v, nodeTypes: w, nodeClickDistance: m, onError: _ }) {
  const { node: y, internals: b, isParent: E } = se((R) => {
    const F = R.nodeLookup.get(e), K = R.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: K
    };
  }, pe);
  let k = y.type || "default", N = (w == null ? void 0 : w[k]) || ta[k];
  N === void 0 && (_ == null || _("003", Fe.error003(k)), k = "default", N = (w == null ? void 0 : w.default) || ta.default);
  const z = !!(y.draggable || a && typeof y.draggable > "u"), A = !!(y.selectable || l && typeof y.selectable > "u"), L = !!(y.connectable || c && typeof y.connectable > "u"), P = !!(y.focusable || d && typeof y.focusable > "u"), W = ue(), B = Hl(y), x = cv({ node: y, nodeType: k, hasDimensions: B, resizeObserver: f }), C = bc({
    nodeRef: x,
    disabled: y.hidden || !z,
    noDragClassName: u,
    handleSelector: y.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), S = vc();
  if (y.hidden)
    return null;
  const I = Ge(y), O = ev(y), M = A || z || t || n || r || o, T = n ? (R) => n(R, { ...b.userNode }) : void 0, D = r ? (R) => r(R, { ...b.userNode }) : void 0, H = o ? (R) => o(R, { ...b.userNode }) : void 0, Y = i ? (R) => i(R, { ...b.userNode }) : void 0, j = s ? (R) => s(R, { ...b.userNode }) : void 0, U = (R) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: K } = W.getState();
    A && (!F || !z || K > 0) && ti({
      id: e,
      store: W,
      nodeRef: x
    }), t && t(R, { ...b.userNode });
  }, ee = (R) => {
    if (!(Fl(R.nativeEvent) || g)) {
      if ($l.includes(R.key) && A) {
        const F = R.key === "Escape";
        ti({
          id: e,
          store: W,
          unselect: F,
          nodeRef: x
        });
      } else if (z && y.selected && Object.prototype.hasOwnProperty.call(Cr, R.key)) {
        R.preventDefault();
        const { ariaLabelConfig: F } = W.getState();
        W.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: R.key.replace("Arrow", "").toLowerCase(),
            x: ~~b.positionAbsolute.x,
            y: ~~b.positionAbsolute.y
          })
        }), S({
          direction: Cr[R.key],
          factor: R.shiftKey ? 4 : 1
        });
      }
    }
  }, G = () => {
    var ne;
    if (g || !((ne = x.current) != null && ne.matches(":focus-visible")))
      return;
    const { transform: R, width: F, height: K, autoPanOnNodeFocus: Q, setCenter: q } = W.getState();
    if (!Q)
      return;
    Ei(/* @__PURE__ */ new Map([[e, y]]), { x: 0, y: 0, width: F, height: K }, R, !0).length > 0 || q(y.position.x + I.width / 2, y.position.y + I.height / 2, {
      zoom: R[2]
    });
  };
  return h("div", { className: we([
    "react-flow__node",
    `react-flow__node-${k}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [p]: z
    },
    y.className,
    {
      selected: y.selected,
      selectable: A,
      parent: E,
      draggable: z,
      dragging: C
    }
  ]), ref: x, style: {
    zIndex: b.z,
    transform: `translate(${b.positionAbsolute.x}px,${b.positionAbsolute.y}px)`,
    pointerEvents: M ? "all" : "none",
    visibility: B ? "visible" : "hidden",
    ...y.style,
    ...O
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: T, onMouseMove: D, onMouseLeave: H, onContextMenu: Y, onClick: U, onDoubleClick: j, onKeyDown: P ? ee : void 0, tabIndex: P ? 0 : void 0, onFocus: P ? G : void 0, role: y.ariaRole ?? (P ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": g ? void 0 : `${fc}-${v}`, "aria-label": y.ariaLabel, ...y.domAttributes, children: h(Fb, { value: e, children: h(N, { id: e, data: y.data, type: k, positionAbsoluteX: b.positionAbsolute.x, positionAbsoluteY: b.positionAbsolute.y, selected: y.selected ?? !1, selectable: A, draggable: z, deletable: y.deletable ?? !0, isConnectable: L, sourcePosition: y.sourcePosition, targetPosition: y.targetPosition, dragging: C, dragHandle: y.dragHandle, zIndex: b.z, parentId: y.parentId, ...I }) }) });
}
var uv = fe(dv);
const fv = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function Ec(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = se(fv, pe), i = sv(e.onlyRenderVisibleElements), s = lv();
  return h("div", { className: "react-flow__nodes", style: Gr, children: i.map((a) => (
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
    h(uv, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
Ec.displayName = "NodeRenderer";
const hv = fe(Ec);
function pv(e) {
  return se($e((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && Xy({
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
const gv = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return h("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, mv = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return h("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, ra = {
  [Rt.Arrow]: gv,
  [Rt.ArrowClosed]: mv
};
function yv(e) {
  const t = ue();
  return le(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(ra, e) ? ra[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Fe.error009(e)), null);
  }, [e]);
}
const wv = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = yv(t);
  return l ? h("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: h(l, { color: n, strokeWidth: s }) }) : null;
}, Sc = ({ defaultColor: e, rfId: t }) => {
  const n = se((i) => i.edges), r = se((i) => i.defaultEdgeOptions), o = le(() => tw(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? h("svg", { className: "react-flow__marker", "aria-hidden": "true", children: h("defs", { children: o.map((i) => h(wv, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
Sc.displayName = "MarkerDefinitions";
var bv = fe(Sc);
function Nc({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...d }) {
  const [f, u] = te({ x: 1, y: 0, width: 0, height: 0 }), p = we(["react-flow__edge-textwrapper", c]), g = oe(null);
  return ce(() => {
    if (g.current) {
      const v = g.current.getBBox();
      u({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? $("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: p, visibility: f.width ? "visible" : "hidden", ...d, children: [o && h("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), h("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: g, style: r, children: n }), l] }) : null;
}
Nc.displayName = "EdgeText";
const vv = fe(Nc);
function Xr({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...d }) {
  return $(be, { children: [h("path", { ...d, d: e, fill: "none", className: we(["react-flow__edge-path", d.className]) }), c ? h("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && We(t) && We(n) ? h(vv, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function oa({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === X.Left || e === X.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function Cc({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: o, targetPosition: i = X.Top }) {
  const [s, a] = oa({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = oa({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [d, f, u, p] = Yl({
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
function Mc(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, interactionWidth: m }) => {
    const [_, y, b] = Cc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), E = e.isInternal ? void 0 : t;
    return h(Xr, { id: E, path: _, labelX: y, labelY: b, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, interactionWidth: m });
  });
}
const xv = Mc({ isInternal: !1 }), Ic = Mc({ isInternal: !0 });
xv.displayName = "SimpleBezierEdge";
Ic.displayName = "SimpleBezierEdgeInternal";
function $c(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, sourcePosition: p = X.Bottom, targetPosition: g = X.Top, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: _ }) => {
    const [y, b, E] = Ko({
      sourceX: n,
      sourceY: r,
      sourcePosition: p,
      targetX: o,
      targetY: i,
      targetPosition: g,
      borderRadius: m == null ? void 0 : m.borderRadius,
      offset: m == null ? void 0 : m.offset,
      stepPosition: m == null ? void 0 : m.stepPosition
    }), k = e.isInternal ? void 0 : t;
    return h(Xr, { id: k, path: y, labelX: b, labelY: E, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: v, markerStart: w, interactionWidth: _ });
  });
}
const Ac = $c({ isInternal: !1 }), Tc = $c({ isInternal: !0 });
Ac.displayName = "SmoothStepEdge";
Tc.displayName = "SmoothStepEdgeInternal";
function zc(e) {
  return fe(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return h(Ac, { ...n, id: r, pathOptions: le(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const _v = zc({ isInternal: !1 }), Lc = zc({ isInternal: !0 });
_v.displayName = "StepEdge";
Lc.displayName = "StepEdgeInternal";
function Oc(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: p, markerStart: g, interactionWidth: v }) => {
    const [w, m, _] = Ul({ sourceX: n, sourceY: r, targetX: o, targetY: i }), y = e.isInternal ? void 0 : t;
    return h(Xr, { id: y, path: w, labelX: m, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: d, labelBgBorderRadius: f, style: u, markerEnd: p, markerStart: g, interactionWidth: v });
  });
}
const kv = Oc({ isInternal: !1 }), Pc = Oc({ isInternal: !0 });
kv.displayName = "StraightEdge";
Pc.displayName = "StraightEdgeInternal";
function Dc(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = X.Bottom, targetPosition: a = X.Top, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, pathOptions: m, interactionWidth: _ }) => {
    const [y, b, E] = Gl({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), k = e.isInternal ? void 0 : t;
    return h(Xr, { id: k, path: y, labelX: b, labelY: E, label: l, labelStyle: c, labelShowBg: d, labelBgStyle: f, labelBgPadding: u, labelBgBorderRadius: p, style: g, markerEnd: v, markerStart: w, interactionWidth: _ });
  });
}
const Ev = Dc({ isInternal: !1 }), Rc = Dc({ isInternal: !0 });
Ev.displayName = "BezierEdge";
Rc.displayName = "BezierEdgeInternal";
const ia = {
  default: Rc,
  straight: Pc,
  step: Lc,
  smoothstep: Tc,
  simplebezier: Ic
}, sa = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Sv = (e, t, n) => n === X.Left ? e - t : n === X.Right ? e + t : e, Nv = (e, t, n) => n === X.Top ? e - t : n === X.Bottom ? e + t : e, aa = "react-flow__edgeupdater";
function la({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return h("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: we([aa, `${aa}-${a}`]), cx: Sv(t, r, e), cy: Nv(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function Cv({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: d, onReconnectEnd: f, setReconnecting: u, setUpdateHover: p }) {
  const g = ue(), v = (b, E) => {
    if (b.button !== 0)
      return;
    const { autoPanOnConnect: k, domNode: N, connectionMode: z, connectionRadius: A, lib: L, onConnectStart: P, cancelConnection: W, nodeLookup: B, rfId: x, panBy: C, updateConnection: S } = g.getState(), I = E.type === "target", O = (D, H) => {
      u(!1), f == null || f(D, n, E.type, H);
    }, M = (D) => c == null ? void 0 : c(n, D), T = (D, H) => {
      u(!0), d == null || d(b, n, E.type), P == null || P(D, H);
    };
    ei.onPointerDown(b.nativeEvent, {
      autoPanOnConnect: k,
      connectionMode: z,
      connectionRadius: A,
      domNode: N,
      handleId: E.id,
      nodeId: E.nodeId,
      nodeLookup: B,
      isTarget: I,
      edgeUpdaterType: E.type,
      lib: L,
      flowId: x,
      cancelConnection: W,
      panBy: C,
      isValidConnection: (...D) => {
        var H, Y;
        return ((Y = (H = g.getState()).isValidConnection) == null ? void 0 : Y.call(H, ...D)) ?? !0;
      },
      onConnect: M,
      onConnectStart: T,
      onConnectEnd: (...D) => {
        var H, Y;
        return (Y = (H = g.getState()).onConnectEnd) == null ? void 0 : Y.call(H, ...D);
      },
      onReconnectEnd: O,
      updateConnection: S,
      getTransform: () => g.getState().transform,
      getFromHandle: () => g.getState().connection.fromHandle,
      dragThreshold: g.getState().connectionDragThreshold,
      handleDomNode: b.currentTarget
    });
  }, w = (b) => v(b, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (b) => v(b, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => p(!0), y = () => p(!1);
  return $(be, { children: [(e === !0 || e === "source") && h(la, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: w, onMouseEnter: _, onMouseOut: y, type: "source" }), (e === !0 || e === "target") && h(la, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: _, onMouseOut: y, type: "target" })] });
}
function Mv({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: d, onReconnect: f, onReconnectStart: u, onReconnectEnd: p, rfId: g, edgeTypes: v, noPanClassName: w, onError: m, disableKeyboardA11y: _ }) {
  let y = se((q) => q.edgeLookup.get(e));
  const b = se((q) => q.defaultEdgeOptions);
  y = b ? { ...b, ...y } : y;
  let E = y.type || "default", k = (v == null ? void 0 : v[E]) || ia[E];
  k === void 0 && (m == null || m("011", Fe.error011(E)), E = "default", k = (v == null ? void 0 : v.default) || ia.default);
  const N = !!(y.focusable || t && typeof y.focusable > "u"), z = typeof f < "u" && (y.reconnectable || n && typeof y.reconnectable > "u"), A = !!(y.selectable || r && typeof y.selectable > "u"), L = oe(null), [P, W] = te(!1), [B, x] = te(!1), C = ue(), { zIndex: S = y.zIndex, sourceX: I, sourceY: O, targetX: M, targetY: T, sourcePosition: D, targetPosition: H } = se($e((q) => {
    const J = q.nodeLookup.get(y.source), ne = q.nodeLookup.get(y.target);
    if (!J || !ne)
      return sa;
    const re = ew({
      id: e,
      sourceNode: J,
      targetNode: ne,
      sourceHandle: y.sourceHandle || null,
      targetHandle: y.targetHandle || null,
      connectionMode: q.connectionMode,
      onError: m
    }), ie = Gy({
      selected: y.selected,
      zIndex: y.zIndex,
      sourceNode: J,
      targetNode: ne,
      elevateOnSelect: q.elevateEdgesOnSelect,
      zIndexMode: q.zIndexMode
    });
    return {
      ...re || sa,
      zIndex: ie
    };
  }, [y.source, y.target, y.sourceHandle, y.targetHandle, y.selected, y.zIndex, m]), pe), Y = le(() => y.markerStart ? `url('#${Qo(y.markerStart, g)}')` : void 0, [y.markerStart, g]), j = le(() => y.markerEnd ? `url('#${Qo(y.markerEnd, g)}')` : void 0, [y.markerEnd, g]);
  if (y.hidden || I === null || O === null || M === null || T === null)
    return null;
  const U = (q) => {
    var ie;
    const { addSelectedEdges: J, unselectNodesAndEdges: ne, multiSelectionActive: re } = C.getState();
    A && (C.setState({ nodesSelectionActive: !1 }), y.selected && re ? (ne({ nodes: [], edges: [y] }), (ie = L.current) == null || ie.blur()) : J([e])), o && o(q, y);
  }, ee = i ? (q) => {
    i(q, { ...y });
  } : void 0, G = s ? (q) => {
    s(q, { ...y });
  } : void 0, R = a ? (q) => {
    a(q, { ...y });
  } : void 0, F = l ? (q) => {
    l(q, { ...y });
  } : void 0, K = c ? (q) => {
    c(q, { ...y });
  } : void 0, Q = (q) => {
    var J;
    if (!_ && $l.includes(q.key) && A) {
      const { unselectNodesAndEdges: ne, addSelectedEdges: re } = C.getState();
      q.key === "Escape" ? ((J = L.current) == null || J.blur(), ne({ edges: [y] })) : re([e]);
    }
  };
  return h("svg", { style: { zIndex: S }, children: $("g", { className: we([
    "react-flow__edge",
    `react-flow__edge-${E}`,
    y.className,
    w,
    {
      selected: y.selected,
      animated: y.animated,
      inactive: !A && !o,
      updating: P,
      selectable: A
    }
  ]), onClick: U, onDoubleClick: ee, onContextMenu: G, onMouseEnter: R, onMouseMove: F, onMouseLeave: K, onKeyDown: N ? Q : void 0, tabIndex: N ? 0 : void 0, role: y.ariaRole ?? (N ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": y.ariaLabel === null ? void 0 : y.ariaLabel || `Edge from ${y.source} to ${y.target}`, "aria-describedby": N ? `${hc}-${g}` : void 0, ref: L, ...y.domAttributes, children: [!B && h(k, { id: e, source: y.source, target: y.target, type: y.type, selected: y.selected, animated: y.animated, selectable: A, deletable: y.deletable ?? !0, label: y.label, labelStyle: y.labelStyle, labelShowBg: y.labelShowBg, labelBgStyle: y.labelBgStyle, labelBgPadding: y.labelBgPadding, labelBgBorderRadius: y.labelBgBorderRadius, sourceX: I, sourceY: O, targetX: M, targetY: T, sourcePosition: D, targetPosition: H, data: y.data, style: y.style, sourceHandleId: y.sourceHandle, targetHandleId: y.targetHandle, markerStart: Y, markerEnd: j, pathOptions: "pathOptions" in y ? y.pathOptions : void 0, interactionWidth: y.interactionWidth }), z && h(Cv, { edge: y, isReconnectable: z, reconnectRadius: d, onReconnect: f, onReconnectStart: u, onReconnectEnd: p, sourceX: I, sourceY: O, targetX: M, targetY: T, sourcePosition: D, targetPosition: H, setUpdateHover: W, setReconnecting: x })] }) });
}
var Iv = fe(Mv);
const $v = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Hc({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: d, reconnectRadius: f, onEdgeDoubleClick: u, onReconnectStart: p, onReconnectEnd: g, disableKeyboardA11y: v }) {
  const { edgesFocusable: w, edgesReconnectable: m, elementsSelectable: _, onError: y } = se($v, pe), b = pv(t);
  return $("div", { className: "react-flow__edges", children: [h(bv, { defaultColor: e, rfId: n }), b.map((E) => h(Iv, { id: E, edgesFocusable: w, edgesReconnectable: m, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: d, reconnectRadius: f, onDoubleClick: u, onReconnectStart: p, onReconnectEnd: g, rfId: n, onError: y, edgeTypes: r, disableKeyboardA11y: v }, E))] });
}
Hc.displayName = "EdgeRenderer";
const Av = fe(Hc), ca = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Tv({ children: e }) {
  const t = ue(), n = oe(null), [r] = te(() => t.getState().transform);
  return yc(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = ca(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), h("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: ca(r) }, children: e });
}
function zv(e) {
  const t = Yr(), n = oe(!1);
  ce(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Lv = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Ov(e) {
  const t = se(Lv), n = ue();
  return ce(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Pv(e) {
  return e.connection.inProgress ? { ...e.connection, to: Nn(e.connection.to, e.transform) } : { ...e.connection };
}
function Dv(e) {
  return Pv;
}
function Rv(e) {
  const t = Dv();
  return se(t, pe);
}
const Hv = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Bv({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = se(Hv, pe);
  return !(i && o && l) ? null : h("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: h("g", { className: we(["react-flow__connection", Wl(a)]), children: h(Bc, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const Bc = ({ style: e, type: t = ut.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: d, toHandle: f, toPosition: u, pointer: p } = Rv();
  if (!o)
    return;
  if (n)
    return h(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: u, connectionStatus: Wl(r), toNode: d, toHandle: f, pointer: p });
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
    case ut.Bezier:
      [g] = Gl(v);
      break;
    case ut.SimpleBezier:
      [g] = Cc(v);
      break;
    case ut.Step:
      [g] = Ko({
        ...v,
        borderRadius: 0
      });
      break;
    case ut.SmoothStep:
      [g] = Ko(v);
      break;
    default:
      [g] = Ul(v);
  }
  return h("path", { d: g, fill: "none", className: "react-flow__connection-path", style: e });
};
Bc.displayName = "ConnectionLine";
const Wv = {};
function da(e = Wv) {
  oe(e), ue(), ce(() => {
  }, [e]);
}
function Vv() {
  ue(), oe(!1), ce(() => {
  }, []);
}
function Wc({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, onSelectionContextMenu: f, onSelectionStart: u, onSelectionEnd: p, connectionLineType: g, connectionLineStyle: v, connectionLineComponent: w, connectionLineContainerStyle: m, selectionKeyCode: _, selectionOnDrag: y, selectionMode: b, multiSelectionKeyCode: E, panActivationKeyCode: k, zoomActivationKeyCode: N, deleteKeyCode: z, onlyRenderVisibleElements: A, elementsSelectable: L, defaultViewport: P, translateExtent: W, minZoom: B, maxZoom: x, preventScrolling: C, defaultMarkerColor: S, zoomOnScroll: I, zoomOnPinch: O, panOnScroll: M, panOnScrollSpeed: T, panOnScrollMode: D, zoomOnDoubleClick: H, panOnDrag: Y, autoPanOnSelection: j, onPaneClick: U, onPaneMouseEnter: ee, onPaneMouseMove: G, onPaneMouseLeave: R, onPaneScroll: F, onPaneContextMenu: K, paneClickDistance: Q, nodeClickDistance: q, onEdgeContextMenu: J, onEdgeMouseEnter: ne, onEdgeMouseMove: re, onEdgeMouseLeave: ie, reconnectRadius: ae, onReconnect: _e, onReconnectStart: Te, onReconnectEnd: ve, noDragClassName: Pe, noWheelClassName: Ke, noPanClassName: De, disableKeyboardA11y: Qe, nodeExtent: ke, rfId: Se, viewport: Ne, onViewportChange: Je, nodesDraggable: jt }) {
  return da(e), da(t), Vv(), zv(n), Ov(Ne), h(ov, { onPaneClick: U, onPaneMouseEnter: ee, onPaneMouseMove: G, onPaneMouseLeave: R, onPaneContextMenu: K, onPaneScroll: F, paneClickDistance: Q, deleteKeyCode: z, selectionKeyCode: _, selectionOnDrag: y, selectionMode: b, onSelectionStart: u, onSelectionEnd: p, multiSelectionKeyCode: E, panActivationKeyCode: k, zoomActivationKeyCode: N, elementsSelectable: L, zoomOnScroll: I, zoomOnPinch: O, zoomOnDoubleClick: H, panOnScroll: M, panOnScrollSpeed: T, panOnScrollMode: D, panOnDrag: Y, autoPanOnSelection: j, defaultViewport: P, translateExtent: W, minZoom: B, maxZoom: x, onSelectionContextMenu: f, preventScrolling: C, noDragClassName: Pe, noWheelClassName: Ke, noPanClassName: De, disableKeyboardA11y: Qe, onViewportChange: Je, isControlledViewport: !!Ne, children: $(Tv, { children: [h(Av, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: _e, onReconnectStart: Te, onReconnectEnd: ve, onlyRenderVisibleElements: A, onEdgeContextMenu: J, onEdgeMouseEnter: ne, onEdgeMouseMove: re, onEdgeMouseLeave: ie, reconnectRadius: ae, defaultMarkerColor: S, noPanClassName: De, disableKeyboardA11y: Qe, rfId: Se }), h(Bv, { style: v, type: g, component: w, containerStyle: m }), h("div", { className: "react-flow__edgelabel-renderer" }), h(hv, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: d, nodeClickDistance: q, onlyRenderVisibleElements: A, noPanClassName: De, noDragClassName: Pe, disableKeyboardA11y: Qe, nodeExtent: ke, rfId: Se, nodesDraggable: jt }), h("div", { className: "react-flow__viewport-portal" })] }) });
}
Wc.displayName = "GraphView";
const Fv = fe(Wc), jv = Rl(), ua = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: d, nodeExtent: f, zIndexMode: u = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = r ?? t ?? [], _ = n ?? e ?? [], y = d ?? [0, 0], b = f ?? hn;
  Kl(v, w, m);
  const { nodesInitialized: E } = Jo(_, p, g, {
    nodeOrigin: y,
    nodeExtent: b,
    zIndexMode: u
  });
  let k = [0, 0, 1];
  if (s && o && i) {
    const N = En(p, {
      filter: (P) => !!((P.width || P.initialWidth) && (P.height || P.initialHeight))
    }), { x: z, y: A, zoom: L } = Wr(N, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    k = [z, A, L];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: k,
    nodes: _,
    nodesInitialized: E,
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
    translateExtent: hn,
    nodeExtent: b,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Dt.Strict,
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
    connection: { ...Tl },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: jv,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Al,
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
}, Yv = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: d, nodeExtent: f, zIndexMode: u }) => rb((p, g) => {
  async function v() {
    const { nodeLookup: w, panZoom: m, fitViewOptions: _, fitViewResolver: y, width: b, height: E, minZoom: k, maxZoom: N } = g();
    m && (await Hy({
      nodes: w,
      width: b,
      height: E,
      panZoom: m,
      minZoom: k,
      maxZoom: N
    }, _), y == null || y.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...ua({
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
    setNodes: (w) => {
      const { nodeLookup: m, parentLookup: _, nodeOrigin: y, nodeExtent: b, elevateNodesOnSelect: E, fitViewQueued: k, zIndexMode: N, nodesSelectionActive: z } = g(), { nodesInitialized: A, hasSelectedNodes: L } = Jo(w, m, _, {
        nodeOrigin: y,
        nodeExtent: b,
        elevateNodesOnSelect: E,
        checkEquality: !0,
        zIndexMode: N
      }), P = z && L;
      k && A ? (v(), p({
        nodes: w,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: P
      })) : p({ nodes: w, nodesInitialized: A, nodesSelectionActive: P });
    },
    setEdges: (w) => {
      const { connectionLookup: m, edgeLookup: _ } = g();
      Kl(m, _, w), p({ edges: w });
    },
    setDefaultNodesAndEdges: (w, m) => {
      if (w) {
        const { setNodes: _ } = g();
        _(w), p({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: _ } = g();
        _(m), p({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (w) => {
      const { triggerNodeChanges: m, nodeLookup: _, parentLookup: y, domNode: b, nodeOrigin: E, nodeExtent: k, debug: N, fitViewQueued: z, zIndexMode: A } = g(), { changes: L, updatedInternals: P } = lw(w, _, y, b, E, k, A);
      P && (ow(_, y, { nodeOrigin: E, nodeExtent: k, zIndexMode: A }), z ? (v(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), (L == null ? void 0 : L.length) > 0 && (N && console.log("React Flow: trigger node changes", L), m == null || m(L)));
    },
    updateNodePositions: (w, m = !1) => {
      const _ = [];
      let y = [];
      const { nodeLookup: b, triggerNodeChanges: E, connection: k, updateConnection: N, onNodesChangeMiddlewareMap: z } = g();
      for (const [A, L] of w) {
        const P = b.get(A), W = !!(P != null && P.expandParent && (P != null && P.parentId) && (L != null && L.position)), B = {
          id: A,
          type: "position",
          position: W ? {
            x: Math.max(0, L.position.x),
            y: Math.max(0, L.position.y)
          } : L.position,
          dragging: m
        };
        if (P && k.inProgress && k.fromNode.id === P.id) {
          const x = St(P, k.fromHandle, X.Left, !0);
          N({ ...k, from: x });
        }
        W && P.parentId && _.push({
          id: A,
          parentId: P.parentId,
          rect: {
            ...L.internals.positionAbsolute,
            width: L.measured.width ?? 0,
            height: L.measured.height ?? 0
          }
        }), y.push(B);
      }
      if (_.length > 0) {
        const { parentLookup: A, nodeOrigin: L } = g(), P = Ai(_, b, A, L);
        y.push(...P);
      }
      for (const A of z.values())
        y = A(y);
      E(y);
    },
    triggerNodeChanges: (w) => {
      const { onNodesChange: m, setNodes: _, nodes: y, hasDefaultNodes: b, debug: E } = g();
      if (w != null && w.length) {
        if (b) {
          const k = Eb(w, y);
          _(k);
        }
        E && console.log("React Flow: trigger node changes", w), m == null || m(w);
      }
    },
    triggerEdgeChanges: (w) => {
      const { onEdgesChange: m, setEdges: _, edges: y, hasDefaultEdges: b, debug: E } = g();
      if (w != null && w.length) {
        if (b) {
          const k = Sb(w, y);
          _(k);
        }
        E && console.log("React Flow: trigger edge changes", w), m == null || m(w);
      }
    },
    addSelectedNodes: (w) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: b, triggerEdgeChanges: E } = g();
      if (m) {
        const k = w.map((N) => yt(N, !0));
        b(k);
        return;
      }
      b(Tt(y, /* @__PURE__ */ new Set([...w]), !0)), E(Tt(_));
    },
    addSelectedEdges: (w) => {
      const { multiSelectionActive: m, edgeLookup: _, nodeLookup: y, triggerNodeChanges: b, triggerEdgeChanges: E } = g();
      if (m) {
        const k = w.map((N) => yt(N, !0));
        E(k);
        return;
      }
      E(Tt(_, /* @__PURE__ */ new Set([...w]))), b(Tt(y, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: w, edges: m } = {}) => {
      const { edges: _, nodes: y, nodeLookup: b, triggerNodeChanges: E, triggerEdgeChanges: k } = g(), N = w || y, z = m || _, A = [];
      for (const P of N) {
        if (!P.selected)
          continue;
        const W = b.get(P.id);
        W && (W.selected = !1), A.push(yt(P.id, !1));
      }
      const L = [];
      for (const P of z)
        P.selected && L.push(yt(P.id, !1));
      E(A), k(L);
    },
    setMinZoom: (w) => {
      const { panZoom: m, maxZoom: _ } = g();
      m == null || m.setScaleExtent([w, _]), p({ minZoom: w });
    },
    setMaxZoom: (w) => {
      const { panZoom: m, minZoom: _ } = g();
      m == null || m.setScaleExtent([_, w]), p({ maxZoom: w });
    },
    setTranslateExtent: (w) => {
      var m;
      (m = g().panZoom) == null || m.setTranslateExtent(w), p({ translateExtent: w });
    },
    resetSelectedElements: () => {
      const { edges: w, nodes: m, triggerNodeChanges: _, triggerEdgeChanges: y, elementsSelectable: b } = g();
      if (!b)
        return;
      const E = m.reduce((N, z) => z.selected ? [...N, yt(z.id, !1)] : N, []), k = w.reduce((N, z) => z.selected ? [...N, yt(z.id, !1)] : N, []);
      _(E), y(k);
    },
    setNodeExtent: (w) => {
      const { nodes: m, nodeLookup: _, parentLookup: y, nodeOrigin: b, elevateNodesOnSelect: E, nodeExtent: k, zIndexMode: N } = g();
      w[0][0] === k[0][0] && w[0][1] === k[0][1] && w[1][0] === k[1][0] && w[1][1] === k[1][1] || (Jo(m, _, y, {
        nodeOrigin: b,
        nodeExtent: w,
        elevateNodesOnSelect: E,
        checkEquality: !1,
        zIndexMode: N
      }), p({ nodeExtent: w }));
    },
    panBy: (w) => {
      const { transform: m, width: _, height: y, panZoom: b, translateExtent: E } = g();
      return cw({ delta: w, panZoom: b, transform: m, translateExtent: E, width: _, height: y });
    },
    setCenter: async (w, m, _) => {
      const { width: y, height: b, maxZoom: E, panZoom: k } = g();
      if (!k)
        return !1;
      const N = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : E;
      return await k.setViewport({
        x: y / 2 - w * N,
        y: b / 2 - m * N,
        zoom: N
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...Tl }
      });
    },
    updateConnection: (w) => {
      p({ connection: w });
    },
    reset: () => p({ ...ua() })
  };
}, Object.is);
function zi({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: d, nodeExtent: f, zIndexMode: u, children: p }) {
  const [g] = te(() => Yv({
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
  return h(ob, { value: g, children: h($b, { children: h(Yb, { children: p }) }) });
}
function Gv({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: d, nodeOrigin: f, nodeExtent: u, zIndexMode: p }) {
  return Ft(jr) ? h(be, { children: e }) : h(zi, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: d, nodeOrigin: f, nodeExtent: u, zIndexMode: p, children: e });
}
const Xv = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function Uv({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: d, onMoveStart: f, onMoveEnd: u, onConnect: p, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: b, onNodeContextMenu: E, onNodeDoubleClick: k, onNodeDragStart: N, onNodeDrag: z, onNodeDragStop: A, onNodesDelete: L, onEdgesDelete: P, onDelete: W, onSelectionChange: B, onSelectionDragStart: x, onSelectionDrag: C, onSelectionDragStop: S, onSelectionContextMenu: I, onSelectionStart: O, onSelectionEnd: M, onBeforeDelete: T, connectionMode: D, connectionLineType: H = ut.Bezier, connectionLineStyle: Y, connectionLineComponent: j, connectionLineContainerStyle: U, deleteKeyCode: ee = "Backspace", selectionKeyCode: G = "Shift", selectionOnDrag: R = !1, selectionMode: F = pn.Full, panActivationKeyCode: K = "Space", multiSelectionKeyCode: Q = mn() ? "Meta" : "Control", zoomActivationKeyCode: q = mn() ? "Meta" : "Control", snapToGrid: J, snapGrid: ne, onlyRenderVisibleElements: re = !1, selectNodesOnDrag: ie, nodesDraggable: ae, autoPanOnNodeFocus: _e, nodesConnectable: Te, nodesFocusable: ve, nodeOrigin: Pe = pc, edgesFocusable: Ke, edgesReconnectable: De, elementsSelectable: Qe = !0, defaultViewport: ke = yb, minZoom: Se = 0.5, maxZoom: Ne = 2, translateExtent: Je = hn, preventScrolling: jt = !0, nodeExtent: it, defaultMarkerColor: Yt = "#b1b1b7", zoomOnScroll: ge = !0, zoomOnPinch: st = !0, panOnScroll: Cn = !1, panOnScrollSpeed: gt = 0.5, panOnScrollMode: It = vt.Free, zoomOnDoubleClick: Mn = !0, panOnDrag: In = !0, onPaneClick: $n, onPaneMouseEnter: Ur, onPaneMouseMove: qr, onPaneMouseLeave: Zr, onPaneScroll: Kr, onPaneContextMenu: Re, paneClickDistance: Gt = 1, nodeClickDistance: Xt = 0, children: Qr, onReconnect: Ut, onReconnectStart: Jr, onReconnectEnd: An, onEdgeContextMenu: eo, onEdgeDoubleClick: to, onEdgeMouseEnter: no, onEdgeMouseMove: ro, onEdgeMouseLeave: oo, reconnectRadius: io = 10, onNodesChange: so, onEdgesChange: ao, noDragClassName: lo = "nodrag", noWheelClassName: co = "nowheel", noPanClassName: Tn = "nopan", fitView: $t, fitViewOptions: at, connectOnClick: uo, attributionPosition: zn, proOptions: Ln, defaultEdgeOptions: On, elevateNodesOnSelect: Pn = !0, elevateEdgesOnSelect: Dn = !1, disableKeyboardA11y: qt = !1, autoPanOnConnect: Rn, autoPanOnNodeDrag: Hn, autoPanOnSelection: fo = !0, autoPanSpeed: Ce, connectionRadius: Bn, isValidConnection: Wn, onError: ho, style: po, id: Zt, nodeDragThreshold: Vn, connectionDragThreshold: go, viewport: Fn, onViewportChange: mo, width: jn, height: Yn, colorMode: V = "light", debug: he, onScroll: ze, ariaLabelConfig: ad, zIndexMode: Ri = "basic", ...ld }, cd) {
  const yo = Zt || "1", dd = xb(V), ud = $e((Hi) => {
    Hi.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), ze == null || ze(Hi);
  }, [ze]);
  return h("div", { "data-testid": "rf__wrapper", ...ld, onScroll: ud, style: { ...po, ...Xv }, ref: cd, className: we(["react-flow", o, dd]), id: Zt, role: "application", children: $(Gv, { nodes: e, edges: t, width: jn, height: Yn, fitView: $t, fitViewOptions: at, minZoom: Se, maxZoom: Ne, nodeOrigin: Pe, nodeExtent: it, zIndexMode: Ri, children: [h(vb, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: p, onConnectStart: g, onConnectEnd: v, onClickConnectStart: w, onClickConnectEnd: m, nodesDraggable: ae, autoPanOnNodeFocus: _e, nodesConnectable: Te, nodesFocusable: ve, edgesFocusable: Ke, edgesReconnectable: De, elementsSelectable: Qe, elevateNodesOnSelect: Pn, elevateEdgesOnSelect: Dn, minZoom: Se, maxZoom: Ne, nodeExtent: it, onNodesChange: so, onEdgesChange: ao, snapToGrid: J, snapGrid: ne, connectionMode: D, translateExtent: Je, connectOnClick: uo, defaultEdgeOptions: On, fitView: $t, fitViewOptions: at, onNodesDelete: L, onEdgesDelete: P, onDelete: W, onNodeDragStart: N, onNodeDrag: z, onNodeDragStop: A, onSelectionDrag: C, onSelectionDragStart: x, onSelectionDragStop: S, onMove: d, onMoveStart: f, onMoveEnd: u, noPanClassName: Tn, nodeOrigin: Pe, rfId: yo, autoPanOnConnect: Rn, autoPanOnNodeDrag: Hn, autoPanSpeed: Ce, onError: ho, connectionRadius: Bn, isValidConnection: Wn, selectNodesOnDrag: ie, nodeDragThreshold: Vn, connectionDragThreshold: go, onBeforeDelete: T, debug: he, ariaLabelConfig: ad, zIndexMode: Ri }), h(Fv, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: y, onNodeMouseLeave: b, onNodeContextMenu: E, onNodeDoubleClick: k, nodeTypes: i, edgeTypes: s, connectionLineType: H, connectionLineStyle: Y, connectionLineComponent: j, connectionLineContainerStyle: U, selectionKeyCode: G, selectionOnDrag: R, selectionMode: F, deleteKeyCode: ee, multiSelectionKeyCode: Q, panActivationKeyCode: K, zoomActivationKeyCode: q, onlyRenderVisibleElements: re, defaultViewport: ke, translateExtent: Je, minZoom: Se, maxZoom: Ne, preventScrolling: jt, zoomOnScroll: ge, zoomOnPinch: st, zoomOnDoubleClick: Mn, panOnScroll: Cn, panOnScrollSpeed: gt, panOnScrollMode: It, panOnDrag: In, autoPanOnSelection: fo, onPaneClick: $n, onPaneMouseEnter: Ur, onPaneMouseMove: qr, onPaneMouseLeave: Zr, onPaneScroll: Kr, onPaneContextMenu: Re, paneClickDistance: Gt, nodeClickDistance: Xt, onSelectionContextMenu: I, onSelectionStart: O, onSelectionEnd: M, onReconnect: Ut, onReconnectStart: Jr, onReconnectEnd: An, onEdgeContextMenu: eo, onEdgeDoubleClick: to, onEdgeMouseEnter: no, onEdgeMouseMove: ro, onEdgeMouseLeave: oo, reconnectRadius: io, defaultMarkerColor: Yt, noDragClassName: lo, noWheelClassName: co, noPanClassName: Tn, rfId: yo, disableKeyboardA11y: qt, nodeExtent: it, viewport: Fn, onViewportChange: mo, nodesDraggable: ae }), h(mb, { onSelectionChange: B }), Qr, h(ub, { proOptions: Ln, position: zn }), h(db, { rfId: yo, disableKeyboardA11y: qt })] }) });
}
var Vc = mc(Uv);
function qv({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return h("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: we(["react-flow__background-pattern", n, r]) });
}
function Zv({ radius: e, className: t }) {
  return h("circle", { cx: e, cy: e, r: e, className: we(["react-flow__background-pattern", "dots", t]) });
}
var ht;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(ht || (ht = {}));
const Kv = {
  [ht.Dots]: 1,
  [ht.Lines]: 1,
  [ht.Cross]: 6
}, Qv = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Fc({
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
  const f = oe(null), { transform: u, patternId: p } = se(Qv, pe), g = r || Kv[t], v = t === ht.Dots, w = t === ht.Cross, m = Array.isArray(n) ? n : [n, n], _ = [m[0] * u[2] || 1, m[1] * u[2] || 1], y = g * u[2], b = Array.isArray(i) ? i : [i, i], E = w ? [y, y] : _, k = [
    b[0] * u[2] + E[0] / 2,
    b[1] * u[2] + E[1] / 2
  ], N = `${p}${e || ""}`;
  return $("svg", { className: we(["react-flow__background", c]), style: {
    ...l,
    ...Gr,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [h("pattern", { id: N, x: u[0] % _[0], y: u[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${k[0]},-${k[1]})`, children: v ? h(Zv, { radius: y / 2, className: d }) : h(qv, { dimensions: E, lineWidth: o, variant: t, className: d }) }), h("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${N})` })] });
}
Fc.displayName = "Background";
const jc = fe(Fc);
function Jv() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: h("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function ex() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: h("path", { d: "M0 0h32v4.2H0z" }) });
}
function tx() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: h("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function nx() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: h("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function rx() {
  return h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: h("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function tr({ children: e, className: t, ...n }) {
  return h("button", { type: "button", className: we(["react-flow__controls-button", t]), ...n, children: e });
}
const ox = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Yc({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: d, position: f = "bottom-left", orientation: u = "vertical", "aria-label": p }) {
  const g = ue(), { isInteractive: v, minZoomReached: w, maxZoomReached: m, ariaLabelConfig: _ } = se(ox, pe), { zoomIn: y, zoomOut: b, fitView: E } = Yr(), k = () => {
    y(), i == null || i();
  }, N = () => {
    b(), s == null || s();
  }, z = () => {
    E(o), a == null || a();
  }, A = () => {
    g.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l == null || l(!v);
  };
  return $(Nt, { className: we(["react-flow__controls", u === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": p ?? _["controls.ariaLabel"], children: [t && $(be, { children: [h(tr, { onClick: k, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: m, children: h(Jv, {}) }), h(tr, { onClick: N, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: w, children: h(ex, {}) })] }), n && h(tr, { className: "react-flow__controls-fitview", onClick: z, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: h(tx, {}) }), r && h(tr, { className: "react-flow__controls-interactive", onClick: A, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? h(rx, {}) : h(nx, {}) }), d] });
}
Yc.displayName = "Controls";
const Gc = fe(Yc);
function ix({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: d, shapeRendering: f, selected: u, onClick: p }) {
  const { background: g, backgroundColor: v } = i || {}, w = s || g || v;
  return h("rect", { className: we(["react-flow__minimap-node", { selected: u }, c]), x: t, y: n, rx: d, ry: d, width: r, height: o, style: {
    fill: w,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: p ? (m) => p(m, e) : void 0 });
}
const sx = fe(ix), ax = (e) => e.nodes.map((t) => t.id), Lo = (e) => e instanceof Function ? e : () => e;
function lx({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = sx,
  onClick: s
}) {
  const a = se(ax, pe), l = Lo(t), c = Lo(e), d = Lo(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return h(be, { children: a.map((u) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    h(dx, { id: u, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, u)
  )) });
}
function cx({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: d, y: f, width: u, height: p } = se((g) => {
    const v = g.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const w = v.internals.userNode, { x: m, y: _ } = v.internals.positionAbsolute, { width: y, height: b } = Ge(w);
    return {
      node: w,
      x: m,
      y: _,
      width: y,
      height: b
    };
  }, pe);
  return !c || c.hidden || !Hl(c) ? null : h(a, { x: d, y: f, width: u, height: p, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const dx = fe(cx);
var ux = fe(lx);
const fx = 200, hx = 150, px = (e) => !e.hidden, gx = (e) => {
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
    boundingRect: n ? Pl(En(e.nodeLookup, { filter: px }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, fa = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, mx = (e, t) => fa(e.viewBB, t.viewBB) && fa(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, yx = "react-flow__minimap-desc";
function Xc({
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
  pannable: v = !1,
  zoomable: w = !1,
  ariaLabel: m,
  inversePan: _,
  zoomStep: y = 1,
  offsetScale: b = 5
}) {
  const E = ue(), k = oe(null), { boundingRect: N, panZoom: z, viewBB: A, rfId: L, translateExtent: P, flowWidth: W, flowHeight: B, ariaLabelConfig: x } = se(gx, mx), C = (e == null ? void 0 : e.width) ?? fx, S = (e == null ? void 0 : e.height) ?? hx, I = N.width / C, O = N.height / S, M = Math.max(I, O), T = M * C, D = M * S, H = b * M, Y = N.x - (T - N.width) / 2 - H, j = N.y - (D - N.height) / 2 - H, U = T + H * 2, ee = D + H * 2, G = `${yx}-${L}`, R = oe(0), F = oe();
  R.current = M, ce(() => {
    const ne = E.getState().panZoom;
    if (k.current && ne)
      return F.current = ww({
        domNode: k.current,
        panZoom: ne,
        getTransform: () => E.getState().transform,
        getViewScale: () => R.current
      }), () => {
        var re;
        (re = F.current) == null || re.destroy();
      };
  }, [z]), ce(() => {
    var ne;
    (ne = F.current) == null || ne.update({
      translateExtent: P,
      width: W,
      height: B,
      inversePan: _,
      pannable: v,
      zoomStep: y,
      zoomable: w
    });
  }, [v, w, _, y, P, W, B]);
  const K = p ? (ne) => {
    var ae;
    const [re, ie] = ((ae = F.current) == null ? void 0 : ae.pointer(ne)) || [0, 0];
    p(ne, { x: re, y: ie });
  } : void 0, Q = $e((ne, re) => {
    const ie = E.getState().nodeLookup.get(re).internals.userNode;
    g == null || g(ne, ie);
  }, [g]), q = g ? Q : void 0, J = m ?? x["minimap.ariaLabel"];
  return h(Nt, { position: u, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * M : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: we(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: $("svg", { width: C, height: S, viewBox: `${Y} ${j} ${U} ${ee}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": G, ref: k, onClick: K, children: [J && h("title", { id: G, children: J }), h(ux, { onClick: q, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), h("path", { className: "react-flow__minimap-mask", d: `M${Y - H},${j - H}h${U + H * 2}v${ee + H * 2}h${-U - H * 2}z
        M${A.x},${A.y}h${A.width}v${A.height}h${-A.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Xc.displayName = "MiniMap";
const Uc = fe(Xc), wx = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, bx = {
  [Wt.Line]: "right",
  [Wt.Handle]: "bottom-right"
};
function vx({ nodeId: e, position: t, variant: n = Wt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: u, autoScale: p = !0, shouldResize: g, onResizeStart: v, onResize: w, onResizeEnd: m }) {
  const _ = xc(), y = typeof e == "string" ? e : _, b = ue(), E = oe(null), k = n === Wt.Handle, N = se($e(wx(k && p), [k, p]), pe), z = oe(null), A = t ?? bx[n];
  ce(() => {
    if (!(!E.current || !y))
      return z.current || (z.current = Aw({
        domNode: E.current,
        nodeId: y,
        getStoreItems: () => {
          const { nodeLookup: P, transform: W, snapGrid: B, snapToGrid: x, nodeOrigin: C, domNode: S } = b.getState();
          return {
            nodeLookup: P,
            transform: W,
            snapGrid: B,
            snapToGrid: x,
            nodeOrigin: C,
            paneDomNode: S
          };
        },
        onChange: (P, W) => {
          const { triggerNodeChanges: B, nodeLookup: x, parentLookup: C, nodeOrigin: S } = b.getState(), I = [], O = { x: P.x, y: P.y }, M = x.get(y);
          if (M && M.expandParent && M.parentId) {
            const T = M.origin ?? S, D = P.width ?? M.measured.width ?? 0, H = P.height ?? M.measured.height ?? 0, Y = {
              id: M.id,
              parentId: M.parentId,
              rect: {
                width: D,
                height: H,
                ...Bl({
                  x: P.x ?? M.position.x,
                  y: P.y ?? M.position.y
                }, { width: D, height: H }, M.parentId, x, T)
              }
            }, j = Ai([Y], x, C, S);
            I.push(...j), O.x = P.x ? Math.max(T[0] * D, P.x) : void 0, O.y = P.y ? Math.max(T[1] * H, P.y) : void 0;
          }
          if (O.x !== void 0 && O.y !== void 0) {
            const T = {
              id: y,
              type: "position",
              position: { ...O }
            };
            I.push(T);
          }
          if (P.width !== void 0 && P.height !== void 0) {
            const D = {
              id: y,
              type: "dimensions",
              resizing: !0,
              setAttributes: u ? u === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: P.width,
                height: P.height
              }
            };
            I.push(D);
          }
          for (const T of W) {
            const D = {
              ...T,
              type: "position"
            };
            I.push(D);
          }
          B(I);
        },
        onEnd: ({ width: P, height: W }) => {
          const B = {
            id: y,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: P,
              height: W
            }
          };
          b.getState().triggerNodeChanges([B]);
        }
      })), z.current.update({
        controlPosition: A,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: d
        },
        keepAspectRatio: f,
        resizeDirection: u,
        onResizeStart: v,
        onResize: w,
        onResizeEnd: m,
        shouldResize: g
      }), () => {
        var P;
        (P = z.current) == null || P.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    d,
    f,
    v,
    w,
    m,
    g
  ]);
  const L = A.split("-");
  return h("div", { className: we(["react-flow__resize-control", "nodrag", ...L, n, r]), ref: E, style: {
    ...o,
    scale: N,
    ...s && { [k ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
fe(vx);
const xx = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", Li = 0.05, qc = 370, ha = 88, _x = 44, Oi = 560, pa = "system-map-flow-css", kx = `
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
if (!document.getElementById(pa)) {
  const e = document.createElement("style");
  e.id = pa, e.textContent = xx + kx, document.head.appendChild(e);
}
function Pi() {
  return se((e) => e.width);
}
function Zc(e, t) {
  const n = Yr(), r = se((s) => s.width), o = se((s) => s.height), i = oe(!1);
  ce(() => {
    if (!r || !o || e.length === 0) return;
    const s = Math.min(...e.map((u) => u.x)), a = Math.min(...e.map((u) => u.y)), l = Math.max(...e.map((u) => u.x + u.width)), c = Math.max(...e.map((u) => u.y + u.height)), d = Math.min(t, r * 0.5), f = Wr(
      { x: s, y: a, width: l - s, height: c - a },
      r - d,
      Math.max(120, o - ha - _x),
      Li,
      1,
      0.05
    );
    n.setViewport({ ...f, y: f.y + ha }, { duration: i.current ? 200 : 0 }), i.current = !0;
  }, [n, e, t, r, o]);
}
function Ex({ layers: e }) {
  return /* @__PURE__ */ $("div", { className: "sm-layers", role: "group", "aria-label": "Map layers", children: [
    /* @__PURE__ */ h("span", { className: "sm-layers-label", children: "Layers" }),
    e.map((t) => /* @__PURE__ */ h("button", { type: "button", className: "sm-plain sm-layer", "aria-pressed": t.on, title: t.title, onClick: t.onToggle, children: t.label }, t.key))
  ] });
}
function Kc({ children: e }) {
  return /* @__PURE__ */ h("div", { className: "sm-tools", children: e });
}
function Sx({ title: e, onBack: t }) {
  return /* @__PURE__ */ $("span", { style: { display: "flex", gap: 6, alignItems: "center" }, "data-testid": "showing", children: [
    /* @__PURE__ */ $(xe, { variant: "aim", children: [
      "Showing: ",
      e
    ] }),
    /* @__PURE__ */ h(de, { onClick: t, children: "Back to today" })
  ] });
}
const fr = { names: 210, keys: 240, columns: 240 }, ni = 34, ln = 20, Nx = {
  proposed: { color: "var(--accent, #2563eb)", dashed: !0 },
  changed: { color: "var(--warn-text, #b45309)", dashed: !1 },
  removed: { color: "var(--danger, #dc2626)", dashed: !0 }
}, Cx = fe(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, d = n.status === "external", f = Nx[n.status], u = (f == null ? void 0 : f.color) ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ $(
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
        /* @__PURE__ */ $(
          "div",
          {
            style: {
              height: ni,
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
              /* @__PURE__ */ $("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                f && /* @__PURE__ */ h("span", { style: { color: f.color, fontWeight: 600 }, children: n.status }),
                s > 0 && /* @__PURE__ */ $("span", { style: { fontWeight: s > 1 ? 600 : 400, color: s > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
                  s,
                  " at work"
                ] }),
                i > 0 && /* @__PURE__ */ h("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ h("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                d && /* @__PURE__ */ h("span", { style: Z, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((p) => /* @__PURE__ */ $(
          "div",
          {
            style: { height: ln, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ h("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: p.primary ? "PK" : p.foreign ? "FK" : p.proposed ? "new" : "" }),
              /* @__PURE__ */ h("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: p.proposed ? 600 : void 0 }, children: p.name }),
              /* @__PURE__ */ h("span", { style: { ...Z, ...Oe, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.type })
            ]
          },
          p.name
        )),
        o > 0 && /* @__PURE__ */ $("div", { style: { ...Z, height: ln, padding: "0 10px", lineHeight: `${ln}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), Mx = { table: Cx };
function Qc(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Mr(e, t) {
  if (t === "names") return ni + 2;
  const n = Qc(e, t).length;
  return ni + n * ln + (n < e.columns.length ? ln : 0) + 2;
}
function Ix(e, t) {
  const n = fr[t], r = new yr.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Mr(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  yr.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Mr(a, t) / 2 });
  }
  return s;
}
function $x(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const ri = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function Ax(e) {
  return (ri.find(([t]) => t === e) ?? ri[2])[1];
}
function Tx() {
  return /* @__PURE__ */ $(
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
        /* @__PURE__ */ h("span", { style: Z, children: "On delete" }),
        ri.map(([e, t]) => /* @__PURE__ */ $("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ h("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function zx({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  tools: i,
  onSelect: s
}) {
  const { mode: a } = xa(), l = Pi() >= Oi, c = le(() => t ? $x(e, t) : e, [e, t]), d = t && o === "names" ? "keys" : o, f = le(() => Ix(c, d), [c, d]), u = le(
    () => c.tables.map((v) => {
      const w = Qc(v, d);
      return {
        id: v.id,
        type: "table",
        position: f.get(v.id) ?? { x: 0, y: 0 },
        width: fr[d],
        height: Mr(v, d),
        data: {
          table: v,
          columns: w,
          hidden: d === "names" ? 0 : v.columns.length - w.length,
          flags: n.get(v.id) ?? 0,
          working: r.get(v.id) ?? 0,
          focused: v.id === t,
          width: fr[d],
          large: d === "names"
        }
      };
    }),
    [c, d, f, n, r, t]
  ), p = le(
    () => c.edges.map((v) => {
      const w = Ax(v.on_delete);
      return {
        id: v.id,
        source: v.source,
        target: v.target,
        selectable: !1,
        markerEnd: { type: Rt.ArrowClosed, width: 14, height: 14, color: w },
        style: { stroke: w, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [c, t]
  ), g = le(
    () => c.tables.map((v) => ({
      ...f.get(v.id) ?? { x: 0, y: 0 },
      width: fr[d],
      height: Mr(v, d)
    })),
    [c, f, d]
  );
  return Zc(g, t ? qc : 0), /* @__PURE__ */ $(
    Vc,
    {
      nodes: u,
      edges: p,
      nodeTypes: Mx,
      colorMode: a,
      minZoom: Li,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (v, w) => s(w.id),
      onPaneClick: () => s(null),
      children: [
        /* @__PURE__ */ h(jc, { gap: 24, size: 1 }),
        /* @__PURE__ */ h(Gc, { showInteractive: !1 }),
        l && /* @__PURE__ */ h(Uc, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ h(Nt, { position: "top-left", children: /* @__PURE__ */ $(Kc, { children: [
          i,
          /* @__PURE__ */ h(Tx, {})
        ] }) })
      ]
    }
  );
}
function Lx(e) {
  return /* @__PURE__ */ h("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ h(zi, { children: /* @__PURE__ */ h(zx, { ...e }) }) });
}
const Ox = [
  ["whatif", "What if"],
  ["cases", "Use cases"],
  ["views", "Views"]
], Px = {
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
}, Dx = [
  { kind: "refused", title: "Postgres will refuse" },
  { kind: "cannot_support", title: "The schema can't hold" },
  { kind: "breaks", title: "This breaks" },
  { kind: "advice", title: "Worth knowing" }
], Jc = { accepted: "ok", dropped: "muted", draft: "aim" }, ga = {
  ready: { variant: "ok", label: "Ready" },
  gaps: { variant: "warn", label: "Has gaps" },
  missing: { variant: "err", label: "Missing parts" }
}, Di = { padding: 10, borderRadius: 8, background: "var(--card, #fff)", border: "1px solid var(--border, #e4e4e7)", fontSize: 13 }, Rx = { ...Di, display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", cursor: "pointer", color: "var(--text, inherit)" }, Hx = { ...Z, ...Oe, fontSize: 11, overflowWrap: "anywhere" };
function wn(e, t) {
  return `${e} ${t}${e === 1 ? "" : "s"}`;
}
function oi(e) {
  return vn(e.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ""));
}
function ii({ title: e, children: t }) {
  return /* @__PURE__ */ $("section", { style: { marginTop: 12 }, children: [
    /* @__PURE__ */ h("p", { style: { margin: "0 0 6px", fontWeight: 600, fontSize: 13 }, children: e }),
    t
  ] });
}
function ed({ limit: e }) {
  return /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }, "data-testid": "limit", children: [
    /* @__PURE__ */ h(bn, { severity: e.severity }),
    /* @__PURE__ */ $("div", { style: { minWidth: 0 }, children: [
      /* @__PURE__ */ h("div", { style: { overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ h("div", { style: { ...Z, fontSize: 12 }, children: e.detail }),
      e.evidence.length > 0 && /* @__PURE__ */ h("div", { style: Hx, children: e.evidence.join("  ") })
    ] })
  ] });
}
function nr({ title: e, rows: t, onShow: n, note: r }) {
  return t.length === 0 ? null : /* @__PURE__ */ h(ii, { title: `${e} (${t.length})`, children: t.map((o) => /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, marginBottom: 2 }, children: [
    /* @__PURE__ */ h("button", { style: { ...Ie, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => n(o.id), children: o.name ?? oi(o.id) }),
    r && /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 12 }, children: r(o) })
  ] }, o.id)) });
}
function Bx({
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
  return /* @__PURE__ */ $("div", { "data-testid": "proposal-detail", children: [
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ h(de, { onClick: r, children: "Back" }),
      /* @__PURE__ */ h("strong", { style: { fontSize: 14, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ h(xe, { variant: Jc[e.status], children: e.status }),
      /* @__PURE__ */ h("span", { style: { flex: 1 } }),
      /* @__PURE__ */ h(de, { primary: t, onClick: () => o("map"), children: "Show on map" }),
      /* @__PURE__ */ h(de, { onClick: () => o("data"), children: "Show in data model" }),
      /* @__PURE__ */ h(de, { onClick: s, disabled: !n, children: "Ask" })
    ] }),
    e.why && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13, margin: "6px 0 0" }, children: e.why }),
    e.closes.map((d) => /* @__PURE__ */ $("p", { style: { fontSize: 13, margin: "8px 0 0" }, "data-testid": "closes", children: [
      "Closes ",
      d.before - d.after,
      " of ",
      wn(d.before, "gap"),
      " in ",
      /* @__PURE__ */ h("strong", { children: d.title }),
      "."
    ] }, d.id)),
    Dx.map(({ kind: d, title: f }) => {
      const u = e.limits.filter((p) => p.kind === d);
      return u.length === 0 ? null : /* @__PURE__ */ h(ii, { title: `${f} (${u.length})`, children: u.map((p, g) => /* @__PURE__ */ h(ed, { limit: p }, g)) }, d);
    }),
    /* @__PURE__ */ h(nr, { title: "Adds", rows: e.diff.added, onShow: i, note: (d) => d.kind ?? "" }),
    /* @__PURE__ */ h(nr, { title: "Changes", rows: e.diff.changed, onShow: i, note: (d) => (d.what ?? []).join(", ") }),
    /* @__PURE__ */ h(nr, { title: "Removes", rows: e.diff.removed, onShow: i }),
    /* @__PURE__ */ h(nr, { title: "Touches today", rows: e.diff.touched, onShow: i, note: (d) => d.access ?? "" }),
    e.limits_checked === !1 && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, "data-testid": "limits-note", children: "Limits check Postgres only, so this hasn't been checked against this project's database." }),
    c.length > 0 && /* @__PURE__ */ h(ii, { title: "Draft SQL", children: /* @__PURE__ */ h("pre", { style: { ...Oe, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: "var(--bg-hover, #f4f4f5)", overflowX: "auto" }, children: c.join(`
`) }) }),
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [
      e.status !== "accepted" && /* @__PURE__ */ h(de, { primary: !0, onClick: () => a("accepted"), children: "Accept" }),
      e.status !== "dropped" && /* @__PURE__ */ h(de, { onClick: () => a("dropped"), children: "Drop" }),
      e.status !== "draft" && /* @__PURE__ */ h(de, { onClick: () => a("draft"), children: "Back to draft" }),
      /* @__PURE__ */ h("span", { style: { flex: 1 } }),
      /* @__PURE__ */ h(de, { danger: !0, onClick: l, children: "Delete" })
    ] }),
    /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 12, marginBottom: 0 }, children: "This stays in System Map. Nothing here changes your repo." })
  ] });
}
function Wx({ rows: e, onOpen: t }) {
  return e.length === 0 ? /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, children: "No proposals yet. Describe a change above, and the Design chat drafts one." }) : /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((n) => {
    const r = n.limits.refused + n.limits.cannot_support;
    return /* @__PURE__ */ $("button", { style: Rx, onClick: () => t(n.id), "data-testid": `proposal-${n.id}`, children: [
      /* @__PURE__ */ $("span", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
        /* @__PURE__ */ h("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: n.title }),
        r > 0 && /* @__PURE__ */ h(xe, { variant: "err", children: wn(r, "blocker") }),
        n.limits.breaks > 0 && /* @__PURE__ */ $(xe, { variant: "warn", children: [
          n.limits.breaks,
          " breaks"
        ] }),
        /* @__PURE__ */ h(xe, { variant: Jc[n.status], children: n.status })
      ] }),
      /* @__PURE__ */ $("span", { style: { ...Z, fontSize: 12 }, children: [
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
function Vx(e) {
  var o, i, s;
  if (!e.exists) return "missing";
  if (e.kind === "table") return `${((o = e.writers) == null ? void 0 : o.length) ?? 0} write, ${((i = e.readers) == null ? void 0 : i.length) ?? 0} read`;
  const t = ((s = e.browser_tests) == null ? void 0 : s.length) ?? 0, n = e.tests ?? 0, r = [`${wn(n, "unit test")}`, t ? wn(t, "browser test") : ""];
  return e.covered !== void 0 && e.covered !== null && r.push(`${Ar(e.covered)} of lines`), r.filter(Boolean).join(", ");
}
function Fx({ item: e, canAsk: t, onShow: n, onAsk: r, onDelete: o }) {
  return /* @__PURE__ */ $("div", { style: Di, "data-testid": `use-case-${e.id}`, children: [
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ h("strong", { style: { flex: 1, overflowWrap: "anywhere" }, children: e.title }),
      /* @__PURE__ */ h(xe, { variant: ga[e.state].variant, children: ga[e.state].label }),
      /* @__PURE__ */ h("button", { style: Ie, onClick: r, disabled: !t, children: "Ask" }),
      /* @__PURE__ */ h("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: o, children: "Delete" })
    ] }),
    (e.actor || e.goal) && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 12, margin: "2px 0 0" }, children: [e.actor, e.goal].filter(Boolean).join(": ") }),
    e.gaps.length > 0 && /* @__PURE__ */ h("div", { style: { marginTop: 8 }, children: e.gaps.map((i, s) => /* @__PURE__ */ h(ed, { limit: i }, s)) }),
    /* @__PURE__ */ h("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12 }, children: /* @__PURE__ */ h("tbody", { children: e.parts.map((i) => /* @__PURE__ */ $("tr", { children: [
      /* @__PURE__ */ h("td", { style: { padding: "2px 8px 2px 0", ...Z }, children: i.kind }),
      /* @__PURE__ */ h("td", { style: { padding: "2px 8px 2px 0", overflowWrap: "anywhere" }, children: i.exists ? /* @__PURE__ */ h("button", { style: { ...Ie, textAlign: "left" }, onClick: () => n(i.id), children: oi(i.id) }) : oi(i.id) }),
      /* @__PURE__ */ h("td", { style: { padding: "2px 0", ...Z, textAlign: "right" }, children: Vx(i) })
    ] }, i.id)) }) })
  ] });
}
function jx({ rows: e, onOpen: t, onDelete: n }) {
  return e.length === 0 ? /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, children: "No views yet. Ask for a picture above, and the Design chat saves it here." }) : /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.map((r) => /* @__PURE__ */ $("div", { style: { ...Di, display: "flex", gap: 8, alignItems: "center" }, "data-testid": `view-${r.id}`, children: [
    /* @__PURE__ */ h("button", { style: { ...Ie, flex: 1, fontSize: 13, textAlign: "left", overflowWrap: "anywhere" }, onClick: () => t(r), children: r.title }),
    /* @__PURE__ */ $("span", { style: { ...Z, fontSize: 12 }, children: [
      wn(r.resolved.length, "part"),
      r.missing.length ? `, ${r.missing.length} gone` : ""
    ] }),
    /* @__PURE__ */ h("button", { style: { ...Ie, color: "var(--muted, #71717a)" }, onClick: () => n(r.id), children: "Delete" })
  ] }, r.id)) });
}
function Yx({
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
  const [p, g] = te(""), v = Px[o], w = () => {
    p.trim() && (s(v.ask(p.trim())), g(""));
  };
  return /* @__PURE__ */ $("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: Ox.map(([m, _]) => /* @__PURE__ */ h(de, { primary: o === m, onClick: () => i(m), children: _ }, m)) }),
    /* @__PURE__ */ $(
      "form",
      {
        style: { display: "flex", gap: 8 },
        onSubmit: (m) => {
          m.preventDefault(), w();
        },
        children: [
          /* @__PURE__ */ h(li, { "aria-label": "Describe it", placeholder: v.placeholder, value: p, onChange: (m) => g(m.target.value), style: { flex: 1 } }),
          /* @__PURE__ */ h(de, { primary: !0, type: "submit", disabled: !r || !p.trim(), children: "Send to chat" })
        ]
      }
    ),
    /* @__PURE__ */ $("div", { style: { flex: 1, minHeight: 0, overflowY: "auto" }, children: [
      o === "whatif" && (t ? /* @__PURE__ */ h(
        Bx,
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
      ) : /* @__PURE__ */ h(Wx, { rows: e.proposals, onOpen: a })),
      o === "cases" && /* @__PURE__ */ $("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        e.use_cases.length === 0 && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, children: "No use cases yet. Describe one above, and the Design chat maps it to the system." }),
        e.use_cases.map((m) => /* @__PURE__ */ h(
          Fx,
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
      o === "views" && /* @__PURE__ */ h(jx, { rows: e.views, onOpen: f, onDelete: (m) => d("views", m) })
    ] })
  ] });
}
const Gx = ["high", "medium", "low", "info"];
function Xx({
  findings: e,
  noSchema: t = !1,
  onShow: n,
  onAsk: r
}) {
  const [o, i] = te(null), s = le(() => {
    const l = /* @__PURE__ */ new Map();
    for (const c of e) l.set(c.severity, (l.get(c.severity) ?? 0) + 1);
    return l;
  }, [e]), a = o ? e.filter((l) => l.severity === o) : e;
  return /* @__PURE__ */ $("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ $(de, { primary: o === null, onClick: () => i(null), children: [
        "All ",
        e.length
      ] }),
      Gx.filter((l) => s.get(l)).map((l) => /* @__PURE__ */ $(de, { primary: o === l, onClick: () => i(l), children: [
        l,
        " ",
        s.get(l)
      ] }, l))
    ] }),
    a.length === 0 && /* @__PURE__ */ h("p", { style: Z, children: t ? "No schema was read, so the table rules didn't run." : "No findings." }),
    a.map((l) => /* @__PURE__ */ $("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ $("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ h(bn, { severity: l.severity }),
        /* @__PURE__ */ h("span", { style: { flex: 1, fontWeight: 600 }, children: l.title }),
        /* @__PURE__ */ h("button", { style: Ie, onClick: () => n(l.node), children: "Show" }),
        /* @__PURE__ */ h("button", { style: Ie, onClick: () => r(l), children: "Ask" })
      ] }),
      /* @__PURE__ */ h("p", { style: { margin: "4px 0 0" }, children: l.detail }),
      /* @__PURE__ */ h("p", { style: { ...Z, ...Oe, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: l.evidence.join("  ") })
    ] }, l.id))
  ] });
}
const td = 560, Ir = 760, Ux = 1100;
function qx(e, t) {
  const n = e >= Ux, r = t && e >= Ir ? n ? "220px" : "170px" : null, o = n ? "minmax(320px, 26%)" : e >= Ir ? "260px" : e >= td ? "240px" : null;
  return [r, "minmax(0, 1fr)", o].filter(Boolean).join(" ");
}
function Zx(e, t, n, r, o) {
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
const Kx = [
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
function nd(e) {
  return vn(e.replace(/^(module|area|route|job|service|plan|table|agent):(public\.)?/, ""));
}
function Ct({ title: e, children: t }) {
  return /* @__PURE__ */ $("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ h("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function Qx({ link: e, onOpen: t }) {
  return /* @__PURE__ */ $("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
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
        children: nd(e.node)
      }
    ),
    e.access && /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function Jx({ node: e, onOpen: t }) {
  return /* @__PURE__ */ h(be, { children: Kx.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ h(Ct, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ h(Qx, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function e_({ node: e }) {
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
  return /* @__PURE__ */ h("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ h("tbody", { children: n.map(([o, i]) => /* @__PURE__ */ $("tr", { children: [
    /* @__PURE__ */ h("td", { style: { ...Z, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: o }),
    /* @__PURE__ */ h("td", { style: { overflowWrap: "anywhere" }, children: i })
  ] }, o)) }) });
}
function t_({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ h(Ct, { title: `Not found (${n.length})`, children: /* @__PURE__ */ h("ul", { style: { ...Oe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ h("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function n_({ node: e }) {
  const t = e.asks_you ?? [], n = e.leaves_region ?? [];
  return /* @__PURE__ */ $(be, { children: [
    e.description && /* @__PURE__ */ h("p", { style: { margin: "0 0 12px" }, children: e.description }),
    n.length > 0 && /* @__PURE__ */ h(Ct, { title: "Leaves your home region", children: /* @__PURE__ */ h("p", { style: { margin: 0, color: "var(--danger, #dc2626)" }, children: n.map(nd).join(", ") }) }),
    /* @__PURE__ */ h(Ct, { title: `Asks you (${t.length})`, children: t.length === 0 ? /* @__PURE__ */ h("p", { style: { ...Z, margin: 0 }, children: "No call that leaves work for a person was found." }) : /* @__PURE__ */ h("ul", { style: { ...Oe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: t.map((r) => /* @__PURE__ */ h("li", { children: r }, r)) }) })
  ] });
}
function r_({ node: e, onRegion: t }) {
  const [n, r] = te(e.region ?? ""), [o, i] = te(null), [s, a] = te(!1), l = async (d) => {
    a(!0), i(await t(e.id, d)), a(!1);
  }, c = n.trim() === (e.region ?? "");
  return /* @__PURE__ */ $(Ct, { title: "Region", children: [
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 6 }, children: [
      /* @__PURE__ */ h(li, { "aria-label": `Region of ${e.name}`, placeholder: "Where it runs, such as US", value: n, onChange: (d) => r(d.target.value), style: { flex: 1, minWidth: 0 } }),
      /* @__PURE__ */ h(de, { disabled: s || !n.trim() || c, onClick: () => void l(n.trim()), children: "Save" }),
      e.region && /* @__PURE__ */ h(de, { disabled: s, onClick: () => void l(null), children: "Clear" })
    ] }),
    /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 11, margin: "4px 0 0" }, children: "You set this. Agents that use it are checked against your home region." }),
    o && /* @__PURE__ */ h("p", { style: { color: "var(--danger, #dc2626)", margin: "4px 0 0" }, children: o })
  ] });
}
function o_({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${Ar(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ $(Ct, { title: n ? `Risk: ${n}` : "Risk", children: [
    /* @__PURE__ */ $("p", { style: { margin: "0 0 4px" }, children: [
      e.commits,
      " commits in ",
      e.window_days,
      " days, ",
      e.complexity,
      " paths, tests: ",
      t,
      "."
    ] }),
    e.worst_files.length > 0 && /* @__PURE__ */ h("ul", { style: { ...Oe, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ h("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: vn(r.path) }, r.path)) })
  ] });
}
function i_({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ $(Ct, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ h("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ h("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ $("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ h(bn, { severity: n.severity }),
      /* @__PURE__ */ h("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function s_({
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
  return /* @__PURE__ */ $(
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
        /* @__PURE__ */ $("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ h("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.label ?? e.name }),
          !c && /* @__PURE__ */ h(xe, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ h(de, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ h(de, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ $("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ h(i_, { names: t, overlaps: n }),
          e.kind === "agent" && /* @__PURE__ */ h(n_, { node: e }),
          e.kind === "service" && l && /* @__PURE__ */ h(r_, { node: e, onRegion: l }, `${e.id}|${e.region ?? ""}`),
          e.risk && /* @__PURE__ */ h(o_, { risk: e.risk }),
          c ? /* @__PURE__ */ h(md, { node: e, onAsk: a }) : /* @__PURE__ */ h(e_, { node: e }),
          !c && /* @__PURE__ */ h(t_, { node: e }),
          /* @__PURE__ */ h(Jx, { node: e, onOpen: o }),
          !c && /* @__PURE__ */ h("p", { style: { ...Z, ...Oe, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (d = e.evidence) == null ? void 0 : d.join("  ") })
        ] })
      ]
    }
  );
}
const a_ = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], l_ = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, c_ = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function d_({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ $("div", { style: c_, "data-testid": e.id, children: [
    /* @__PURE__ */ h("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ $("p", { style: { ...Z, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      l_[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ $("ul", { style: { ...Oe, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ h("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ $("li", { style: Z, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ h("button", { style: Ie, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ h("button", { style: Ie, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ h("span", { style: { flex: 1 } }),
      /* @__PURE__ */ $(
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
function u_({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ $("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ $("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ h("strong", { children: i === 0 ? "Nothing here can be checked yet." : o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 13 }, children: i === 0 ? "These plans name no files, so the code can't confirm them." : "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ h("p", { style: Z, children: "No plans found. System Map looks in docs/specs, docs/plans and specs, and for a BRIEF, PLAN, ROADMAP, PRD, SPEC or TODO file at the top of the repo." }),
    /* @__PURE__ */ h("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: a_.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ $("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ $("div", { children: [
          /* @__PURE__ */ $("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ h(xe, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ h("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ h(d_, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function f_(e, t, n) {
  return { key: "plans", label: e > 0 ? `Plans ${e}` : "Plans", on: t, title: "Show unfinished plans on the map", onToggle: n };
}
const h_ = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], tt = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, Oo = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, ma = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function p_({ share: e }) {
  return /* @__PURE__ */ $("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ h("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ h("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ h("span", { style: { minWidth: 32, textAlign: "right" }, children: Ar(e) })
  ] });
}
function g_({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ h(xe, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ h(xe, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ h(xe, { variant: "muted", children: "Untested" }) : null;
}
function m_(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function y_({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ $(be, { children: [
      /* @__PURE__ */ $(xe, { variant: "muted", children: [
        Ar(i.lines_hit / i.lines_total),
        " of lines run by tests"
      ] }),
      /* @__PURE__ */ $("span", { style: Z, children: [
        i.commit ? `Report from ${i.commit.slice(0, 7)}` : "Report from an unknown commit",
        i.files_changed_since ? `, ${i.files_changed_since} files changed since` : ""
      ] })
    ] }) : /* @__PURE__ */ h("span", { style: Z, children: "No coverage report yet. Showing which tests reach each file through imports." }),
    /* @__PURE__ */ h("span", { style: { flex: 1 } }),
    n && /* @__PURE__ */ h("span", { style: { color: "var(--danger, #dc2626)" }, children: n }),
    /* @__PURE__ */ h(de, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ h(de, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function w_({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = te("modules"), [c, d] = te(!0), [f, u] = te(!1), [p, g] = te("score"), v = e.coverage !== null, w = le(() => e[a].filter((b) => a === "modules" || !f || !b.ui), [e, a, f]), m = w.filter((b) => b.hot && b.untested), _ = le(() => {
    const b = c && m.length > 0 ? m : w;
    if (p === "score") return b;
    const E = p === "cover" ? 1 : -1;
    return [...b].sort((k, N) => E * (k[p] - N[p]));
  }, [w, c, p]), y = a === "modules" ? "module" : "file";
  return /* @__PURE__ */ $("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ $("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "risk-summary", children: [
      /* @__PURE__ */ h("strong", { children: e.test_files === 0 ? "No tests yet." : m.length === 0 ? "Nothing busy is short of tests." : `${m.length} busy ${y}${m.length === 1 ? " has" : "s have"} little test cover.` }),
      " ",
      /* @__PURE__ */ $("span", { style: { ...Z, fontSize: 13 }, children: [
        "Busy means more commits than three in four others, over ",
        e.window_days,
        " days. Little cover means under half."
      ] })
    ] }),
    e.test_files === 0 && /* @__PURE__ */ h("p", { style: { ...Z, margin: 0, fontSize: 13 }, "data-testid": "no-tests", children: "This project has no tests yet, so everything counts as untested. The list below is ranked by how complex and busy each part is." }),
    !e.history_known && /* @__PURE__ */ h("p", { style: { ...Z, margin: 0, fontSize: 13 }, children: "No git history here, so commits are not counted." }),
    e.shallow && /* @__PURE__ */ h("p", { style: { ...Z, margin: 0, fontSize: 13 }, children: "This is a shallow clone, so commits are undercounted." }),
    /* @__PURE__ */ h(y_, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ h(de, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ h(de, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ h("span", { style: { width: 8 } }),
      m.length > 0 && /* @__PURE__ */ h(de, { primary: c, onClick: () => d((b) => !b), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ h(de, { primary: f, onClick: () => u((b) => !b), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ $("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ $("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ h("thead", { children: /* @__PURE__ */ $("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ h("th", { style: { ...tt, textAlign: "left" }, children: /* @__PURE__ */ $("button", { style: Oo, onClick: () => g("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          h_.map((b) => /* @__PURE__ */ h("th", { style: tt, children: /* @__PURE__ */ h("button", { style: { ...Oo, color: p === b.key ? "var(--text, inherit)" : Oo.color }, title: b.title, onClick: () => g(b.key), children: b.label }) }, b.key)),
          /* @__PURE__ */ h("th", { style: tt })
        ] }) }),
        /* @__PURE__ */ h("tbody", { children: _.map((b) => /* @__PURE__ */ $("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ $("td", { style: { ...tt, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ h(
              "button",
              {
                onClick: () => r(b.id ?? b.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...ma, ...Oe } : ma,
                children: vn(b.path)
              }
            ),
            " ",
            /* @__PURE__ */ h(g_, { row: b })
          ] }),
          /* @__PURE__ */ h("td", { style: tt, children: b.commits }),
          /* @__PURE__ */ h("td", { style: tt, children: b.complexity }),
          /* @__PURE__ */ h("td", { style: tt, children: v ? /* @__PURE__ */ h(p_, { share: b.covered ?? 0 }) : /* @__PURE__ */ h("span", { style: Z, children: m_(b, a) }) }),
          /* @__PURE__ */ h("td", { style: tt, children: b.lines }),
          /* @__PURE__ */ h("td", { style: tt, children: /* @__PURE__ */ h("button", { style: Ie, onClick: () => o(b.id ?? b.path), disabled: !t, children: "Ask" }) })
        ] }, b.path)) })
      ] }),
      _.length === 0 && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
function b_({
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
  return /* @__PURE__ */ $("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
    /* @__PURE__ */ h("span", { role: "status", style: { ...Z, fontSize: 13 }, "data-testid": "rebuild-result", children: !i && s }),
    e.rebuild && !i && /* @__PURE__ */ h(de, { primary: !0, onClick: a, children: "Rebuild" }),
    /* @__PURE__ */ h(
      Sa,
      {
        width: 270,
        align: "right",
        label: "Model status",
        trigger: (c) => /* @__PURE__ */ $("button", { type: "button", className: "sm-plain sm-chip", "data-testid": "status-chip", ...c, children: [
          /* @__PURE__ */ h("span", { className: "sm-dot", "data-tone": i ? "muted" : e.tone }),
          l,
          /* @__PURE__ */ h(Na, {})
        ] }),
        children: () => /* @__PURE__ */ $("div", { style: { padding: 8 }, children: [
          /* @__PURE__ */ h("div", { style: { fontWeight: 600, marginBottom: 2, overflowWrap: "anywhere" }, children: t ?? e.detail }),
          /* @__PURE__ */ $("div", { style: { ...Z, marginBottom: 10 }, children: [
            n ? /* @__PURE__ */ h("span", { className: "sm-mono", children: n.slice(0, 7) }) : "This folder",
            ", built ",
            yd(r, Date.now() / 1e3)
          ] }),
          o && /* @__PURE__ */ $("div", { style: { marginBottom: 10 }, "data-testid": "build-read", children: [
            wd(o).map((c) => /* @__PURE__ */ h("div", { children: c }, c)),
            o.unread.map((c) => /* @__PURE__ */ $("div", { style: { marginTop: 6 }, children: [
              "Not read: ",
              c.what,
              c.where && /* @__PURE__ */ h("div", { className: "sm-mono", style: { ...Z, overflowWrap: "anywhere" }, children: c.where })
            ] }, c.what))
          ] }),
          e.label !== "Folder missing" && /* @__PURE__ */ h(de, { primary: e.rebuild, disabled: i, onClick: a, autoFocus: !0, children: i ? "Rebuilding" : "Rebuild" })
        ] })
      }
    )
  ] });
}
const rr = 10;
function v_(e, t) {
  const n = (e.bands ?? []).filter((s) => s.members.length > 0), r = new yr.graphlib.Graph({ multigraph: !0, compound: n.length > 0 });
  r.setGraph({ rankdir: t, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  for (const s of e.cards) r.setNode(s.id, { width: sr, height: ir });
  for (const s of n) {
    r.setNode(s.id, {});
    for (const a of s.members) r.setParent(a, s.id);
  }
  for (const s of e.lines)
    s.source !== s.target && r.setEdge(s.source, s.target, {}, s.id);
  yr.layout(r);
  const o = /* @__PURE__ */ new Map();
  for (const s of e.cards) {
    const a = r.node(s.id);
    o.set(s.id, { x: a.x - sr / 2, y: a.y - ir / 2 });
  }
  const i = n.map((s) => {
    const a = s.members.map((u) => o.get(u)).filter((u) => !!u), l = Math.min(...a.map((u) => u.x)) - rr, c = Math.min(...a.map((u) => u.y)) - rr, d = Math.max(...a.map((u) => u.x + sr)) + rr, f = Math.max(...a.map((u) => u.y + ir)) + rr;
    return { ...s, x: l, y: c, width: d - l, height: f - c };
  });
  return { places: o, bands: i };
}
const si = sr, ai = ir, ya = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  agent: "agent",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, x_ = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)",
  empty: "var(--warn-text, #b45309)"
}, __ = { empty: "no jobs" }, hr = {
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
}, k_ = {
  home: "var(--ok, #15803d)",
  away: "var(--danger, #dc2626)",
  unknown: "var(--muted, #71717a)"
}, pr = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, E_ = fe(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i } = t, s = n.status === "proposed", a = n.kind === "plan" || s || n.kind === "agent" && n.status !== void 0, l = n.kind === "service", c = o.length > 1, d = s ? "var(--accent, #2563eb)" : a ? x_[n.status ?? "unclear"] : c ? "var(--warn-text, #b45309)" : void 0, f = r ? "var(--accent, #2563eb)" : d ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ $(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: si,
        height: ai,
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
        boxShadow: [i ? `inset 5px 0 0 ${pr[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ h(pt, { type: "target", position: X.Left, isConnectable: !1 }),
        /* @__PURE__ */ h(pt, { type: "source", position: X.Right, isConnectable: !1 }),
        /* @__PURE__ */ $("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ h("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          a && /* @__PURE__ */ h("span", { style: { fontSize: 11, color: d, flexShrink: 0 }, children: __[n.status ?? ""] ?? n.status }),
          i && /* @__PURE__ */ h("span", { style: { fontSize: 11, color: pr[i].color, flexShrink: 0 }, children: pr[i].label })
        ] }),
        /* @__PURE__ */ $("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [ya[n.kind] && n.kind !== "area" && n.kind !== "plan" ? ya[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ $("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: c ? 600 : 400, color: c ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] }),
          o.length === 0 && n.badge && /* @__PURE__ */ h("span", { style: { fontSize: 11, flexShrink: 0, color: "var(--info, #2563eb)" }, children: n.badge })
        ] })
      ]
    }
  );
}), S_ = fe(function({ data: t }) {
  const n = k_[t.band.tone];
  return /* @__PURE__ */ h("div", { "data-testid": t.band.id, style: { width: "100%", height: "100%", boxSizing: "border-box", borderRadius: 14, border: `1.5px dashed ${n}`, pointerEvents: "none" }, children: /* @__PURE__ */ h("span", { style: { position: "absolute", top: -9, left: 12, padding: "0 4px", fontSize: 11, fontWeight: 600, lineHeight: "16px", color: n, background: "var(--bg, #fff)" }, children: t.band.label }) });
}), N_ = { card: E_, band: S_ };
function C_(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function M_(e) {
  const t = e.leaves ? hr.leaves_region : hr[e.kind] ?? hr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: Rt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: C_(e.count),
      strokeDasharray: t.dashed || e.proposed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function I_({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(hr).filter(([i]) => e.has(i)), o = Pi();
  return /* @__PURE__ */ $(
    "div",
    {
      "data-testid": "legend",
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        width: "max-content",
        // Clear of the zoom buttons, and of the minimap when there is one.
        maxWidth: Math.max(120, o - (o < Oi ? 130 : 290)),
        whiteSpace: "nowrap",
        padding: "4px 8px",
        fontSize: 11,
        borderRadius: 6,
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e4e4e7)",
        color: "var(--text, inherit)"
      },
      children: [
        r.map(([i, s]) => /* @__PURE__ */ $("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ h("span", { style: { width: 14, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` } }),
          s.label
        ] }, i)),
        n && Object.values(pr).map((i) => /* @__PURE__ */ $("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ h("span", { style: { width: 5, height: 12, background: i.color } }),
          i.label
        ] }, i.label)),
        t && /* @__PURE__ */ h("span", { style: Z, children: "Thin links hidden" })
      ]
    }
  );
}
function $_({ system: e, focus: t, agents: n, onFocus: r }) {
  const o = Ed(e, t, n);
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
      children: o.map((i, s) => {
        const a = s === o.length - 1;
        return /* @__PURE__ */ $("span", { style: { display: "flex", gap: 6 }, children: [
          s > 0 && /* @__PURE__ */ h("span", { style: Z, children: "/" }),
          /* @__PURE__ */ h(
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
function A_({
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
  onFocus: f,
  onOpenTables: u
}) {
  const { mode: p } = xa(), g = Pi() >= Oi, v = c ? null : t, w = le(
    () => a ? bd(e, a, n) : vd(e, v, n, r, c),
    [e, a, v, n, r, c]
  ), m = le(() => v_(w, l === "top-down" ? "TB" : "LR"), [w, l]), _ = m.places, y = le(() => xd(i), [i]), b = s == null ? void 0 : s.by_node, E = le(
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
        position: _.get(L.id) ?? { x: 0, y: 0 },
        width: si,
        height: ai,
        data: { card: L, focused: L.id === t, work: b ? kd(L.id, b) : [], band: _d(y.get(L.id)) }
      }))
    ],
    [w, m, _, t, y, b]
  ), k = le(() => w.lines.map(M_), [w]), N = le(
    () => [
      ...w.cards.map((L) => ({ ..._.get(L.id) ?? { x: 0, y: 0 }, width: si, height: ai })),
      ...m.bands.map((L) => ({ x: L.x, y: L.y, width: L.width, height: L.height }))
    ],
    [w, _, m]
  );
  Zc(N, o ? qc : 0);
  const z = le(() => new Set(w.lines.map((L) => L.leaves ? "leaves_region" : L.kind)), [w]), A = (L) => {
    if (!L.startsWith("band:"))
      if (L === Sd) u();
      else {
        if (L !== Nd && L !== Cd && L === t) return;
        f(L);
      }
  };
  return /* @__PURE__ */ $(
    Vc,
    {
      nodes: E,
      edges: k,
      nodeTypes: N_,
      colorMode: p,
      minZoom: Li,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (L, P) => A(P.id),
      children: [
        /* @__PURE__ */ h(jc, { gap: 24, size: 1 }),
        /* @__PURE__ */ h(Gc, { showInteractive: !1 }),
        g && /* @__PURE__ */ h(Uc, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ h(Nt, { position: "top-left", children: /* @__PURE__ */ $(Kc, { children: [
          /* @__PURE__ */ h($_, { system: e, focus: t, agents: c && !a, onFocus: f }),
          d
        ] }) }),
        /* @__PURE__ */ h(Nt, { position: "bottom-center", children: /* @__PURE__ */ h(I_, { kinds: z, top: (w.hidden ?? 0) > 0, risk: i !== null }) })
      ]
    }
  );
}
function T_(e) {
  return /* @__PURE__ */ h("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ h(zi, { children: /* @__PURE__ */ h(A_, { ...e, agents: e.agents ?? !1 }) }) });
}
const z_ = 16, L_ = 72, rd = "system-map-view";
function wa(e) {
  return e.count === void 0 ? void 0 : `${e.count} ${e.counts ?? ""}`.trim();
}
function Po({ item: e }) {
  return /* @__PURE__ */ $(be, { children: [
    e.label,
    e.count !== void 0 && /* @__PURE__ */ h("span", { className: "sm-count", children: e.count })
  ] });
}
function O_({ items: e, value: t, onChange: n, label: r }) {
  const o = oe(null), i = oe(null), s = oe(null), [a, l] = te(Number.POSITIVE_INFINITY), [c, d] = te([]), f = e.map((_) => `${_.label}${_.count ?? ""}`).join("|");
  ui(() => {
    const _ = () => {
      var b, E;
      l(((b = o.current) == null ? void 0 : b.clientWidth) ?? 0), d([...((E = i.current) == null ? void 0 : E.children) ?? []].map((k) => k.offsetWidth));
    };
    _();
    const y = new ResizeObserver(_);
    return o.current && y.observe(o.current), () => y.disconnect();
  }, [f]);
  const u = e.findIndex((_) => _.value === t), p = le(
    () => c.length === e.length ? Zx(c, a, L_, u, z_) : { visible: e.map((_, y) => y), hidden: [] },
    [c, a, u, e]
  ), g = p.visible.map((_) => e[_]), v = p.hidden.map((_) => e[_]), w = (_) => {
    n(_), requestAnimationFrame(() => {
      var y, b;
      return (b = (y = s.current) == null ? void 0 : y.querySelector('[aria-selected="true"]')) == null ? void 0 : b.focus();
    });
  }, m = (_) => {
    const y = g.findIndex((N) => N.value === t), b = g.length, k = { ArrowRight: (y + 1) % b, ArrowLeft: (y - 1 + b) % b, Home: 0, End: b - 1 }[_.key];
    k !== void 0 && (_.preventDefault(), w(g[k].value));
  };
  return /* @__PURE__ */ $("div", { ref: o, className: "sm-bar", style: { position: "relative", flex: "none" }, children: [
    /* @__PURE__ */ h("div", { ref: i, className: "sm-tab-probe", "aria-hidden": "true", children: e.map((_) => /* @__PURE__ */ h("span", { className: "sm-tab", children: /* @__PURE__ */ h(Po, { item: _ }) }, _.value)) }),
    /* @__PURE__ */ h("div", { ref: s, className: "sm-tabs", role: "tablist", "aria-label": r, onKeyDown: m, children: g.map((_) => /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        role: "tab",
        id: `system-map-tab-${_.value}`,
        className: "sm-plain sm-tab",
        "aria-selected": _.value === t,
        "aria-controls": rd,
        tabIndex: _.value === t ? 0 : -1,
        title: wa(_),
        onClick: () => n(_.value),
        children: /* @__PURE__ */ h(Po, { item: _ })
      },
      _.value
    )) }),
    v.length > 0 && /* @__PURE__ */ h(
      Sa,
      {
        width: 200,
        popup: "menu",
        label: "More views",
        trigger: (_) => /* @__PURE__ */ $("button", { type: "button", className: "sm-plain sm-tab", ..._, children: [
          "More ",
          /* @__PURE__ */ h(Na, {})
        ] }),
        children: (_) => /* @__PURE__ */ h(Md, { label: "More views", children: v.map((y) => /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "sm-plain sm-row",
            title: wa(y),
            onClick: () => {
              _(), w(y.value);
            },
            children: /* @__PURE__ */ h(Po, { item: y })
          },
          y.value
        )) })
      }
    )
  ] });
}
const od = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, P_ = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, D_ = { ...Oe, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, Do = 6;
function R_(e) {
  return vn(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function Ue({ title: e, children: t }) {
  return /* @__PURE__ */ $("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ h("span", { style: { ...Z, fontSize: 12 }, children: e }),
    t
  ] });
}
function ft({ ids: e, onShow: t }) {
  return /* @__PURE__ */ h("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ h("button", { style: P_, onClick: () => t(n), children: R_(n) }, n)) });
}
function ba({ files: e }) {
  return /* @__PURE__ */ $("ul", { style: D_, children: [
    e.slice(0, Do).map((t) => /* @__PURE__ */ h("li", { children: t }, t)),
    e.length > Do && /* @__PURE__ */ $("li", { style: Z, children: [
      "and ",
      e.length - Do,
      " more"
    ] })
  ] });
}
const id = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function H_({ row: e, canAsk: t, onAsk: n }) {
  const r = id[e.merge];
  return /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ h(bn, { severity: e.severity }),
    /* @__PURE__ */ $("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ $("span", { style: Z, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ h("button", { style: Ie, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function B_({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = id[e.merge];
  return /* @__PURE__ */ $("div", { style: od, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ h(bn, { severity: e.severity }),
      /* @__PURE__ */ h("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ h("button", { style: Ie, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ h(Ue, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ h(ba, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ h(Ue, { title: "Both change these tables", children: /* @__PURE__ */ h(ft, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ h(Ue, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ h(ft, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ h(Ue, { title: "Both change code that uses these tables", children: /* @__PURE__ */ h(ft, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ h(Ue, { title: "Also share", children: /* @__PURE__ */ h(ba, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ h(Ue, { title: "Same modules", children: /* @__PURE__ */ h(ft, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ h("p", { style: { ...Z, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function W_({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ $("div", { style: od, "data-testid": "worktree", children: [
    /* @__PURE__ */ h("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ h("p", { style: { ...Z, ...Oe, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.path }),
    /* @__PURE__ */ $("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ $(xe, { variant: "muted", children: [
        e.ahead,
        " ahead"
      ] }),
      e.behind > 0 && /* @__PURE__ */ $(xe, { variant: "muted", children: [
        e.behind,
        " behind"
      ] }),
      e.uncommitted_files > 0 && /* @__PURE__ */ $(xe, { variant: "warn", children: [
        e.uncommitted_files,
        " uncommitted"
      ] }),
      /* @__PURE__ */ $(xe, { variant: "muted", children: [
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
function V_({
  state: e,
  checkedAt: t,
  canAsk: n,
  onShow: r,
  onAsk: o
}) {
  const { high: i, medium: s } = e.counts, a = i + s, l = e.overlaps.length - a, c = e.worktrees.filter((u) => u.files.length > 0), d = e.worktrees.length - c.length, f = a === 0 ? "No collisions ahead." : `${a} collision${a === 1 ? "" : "s"} ahead.`;
  return /* @__PURE__ */ $("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)", overflow: "hidden" }, children: [
    /* @__PURE__ */ $("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "worktree-summary", children: [
      /* @__PURE__ */ h("strong", { children: f }),
      " ",
      /* @__PURE__ */ $("span", { style: { ...Z, fontSize: 13 }, children: [
        c.length,
        " of ",
        e.worktrees.length,
        " worktrees have changes",
        l ? `, with ${l} smaller overlap${l === 1 ? "" : "s"}` : "",
        ".",
        t ? ` Checked ${new Date(t).toLocaleTimeString()}.` : ""
      ] })
    ] }),
    /* @__PURE__ */ $("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }, children: [
      a > 0 && /* @__PURE__ */ h("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((u) => u.severity === "high" || u.severity === "medium").map((u) => /* @__PURE__ */ h(B_, { row: u, canAsk: n, onShow: r, onAsk: o }, `${u.a}|${u.b}`)) }),
      /* @__PURE__ */ $("section", { children: [
        /* @__PURE__ */ h("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ h("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((u) => /* @__PURE__ */ h(W_, { tree: u, onShow: r }, u.path)) }),
        c.length === 0 && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, children: "No worktree has changes." }),
        d > 0 && /* @__PURE__ */ $("p", { style: { ...Z, fontSize: 12, marginBottom: 0 }, children: [
          d,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ $("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ h("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((u) => u.severity === "low" || u.severity === "info").map((u) => /* @__PURE__ */ h(H_, { row: u, canAsk: n, onAsk: o }, `${u.a}|${u.b}`))
      ] })
    ] })
  ] });
}
const va = 12, F_ = 2e4, j_ = 8e3, Y_ = 4e3, G_ = [
  { key: "names", label: "Names" },
  { key: "keys", label: "Keys" },
  { key: "columns", label: "Columns" }
], Ro = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, X_ = [
  { value: "map", label: "Map" },
  { value: "data", label: "Data model" },
  { value: "plan", label: "Plan", counts: "unfinished plans" },
  { value: "risk", label: "Risk", counts: "hot and untested modules" },
  { value: "worktrees", label: "Worktrees", counts: "worktree collisions" },
  { value: "findings", label: "Findings", counts: "findings" },
  { value: "explore", label: "Explore", counts: "draft proposals" }
];
function U_(e, t) {
  const n = _a(), [r, o] = te(null), [i, s] = te(null), [a, l] = te(!1), [c, d] = te(null), f = (r == null ? void 0 : r.repoKey) === t ? r.slot : null, u = $e(async () => {
    const g = await n.post("/api/chat/slots", { name: Gd(t) });
    return await n.post(`/api/chat/slots/${encodeURIComponent(g.key)}/project`, { project: e }), o({ repoKey: t, slot: g.key }), g.key;
  }, [n, e, t]);
  ce(() => {
    if (!e) return;
    let g = !0;
    return d(null), (async () => qd(localStorage, t) ? !0 : Zd(await n.get("/api/chat/slots").catch(() => []), t))().then(async (w) => {
      g && (w ? await u() : s(t));
    }).catch((w) => {
      g && d(on(w, "open the design chat"));
    }), () => {
      g = !1;
    };
  }, [n, u, e, t]);
  const p = $e(
    (g) => {
      l(!0), d(null), (async () => {
        const w = f ?? await u();
        Kd(localStorage, t), await n.post("/api/chat?ws=1", { message: g, slot: w, agent: "" });
      })().catch((w) => d(on(w, "send that to the design chat"))).finally(() => l(!1));
    },
    [n, u, t, f]
  );
  return { slot: f, error: c, send: p, opening: a, canAsk: e !== null, startable: i === t && f === null };
}
function q_({ disabled: e, onSend: t }) {
  const [n, r] = te("");
  return /* @__PURE__ */ h(
    "form",
    {
      style: { position: "absolute", left: 0, right: 0, bottom: 0 },
      onSubmit: (o) => {
        o.preventDefault(), n.trim() && t(n.trim());
      },
      children: /* @__PURE__ */ h(
        li,
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
function Z_() {
  const e = oe(null), [t, n] = te(void 0), [r, o] = te(1400);
  return ui(() => {
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
function or({ children: e, onDismiss: t }) {
  return /* @__PURE__ */ $("div", { className: "sm-notice", role: "alert", "data-testid": "notice", children: [
    /* @__PURE__ */ h("span", { style: { flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: e }),
    t && /* @__PURE__ */ h(de, { onClick: t, children: "Dismiss" })
  ] });
}
function K_({ read: e }) {
  const t = (e == null ? void 0 : e.unread) ?? [];
  return /* @__PURE__ */ h(
    ka,
    {
      testId: "no-tables",
      icon: /* @__PURE__ */ h(sd, {}),
      title: "No tables found",
      subtitle: "System Map reads Postgres migrations and SQLite schemas, from .sql files or from code.",
      action: t.length > 0 && /* @__PURE__ */ h("div", { style: { ...Z, fontSize: 13, textAlign: "center" }, children: t.map((n) => /* @__PURE__ */ $("div", { children: [
        "Found, but not read: ",
        n.what,
        n.where ? ` (${n.where})` : ""
      ] }, n.what)) })
    }
  );
}
function sd() {
  return /* @__PURE__ */ $("svg", { width: "40", height: "40", viewBox: "0 0 64 64", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ h("rect", { x: "10", y: "10", width: "44", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "10", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "34", y: "26", width: "20", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "10", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "26", y: "42", width: "12", height: "12", rx: "3" }),
    /* @__PURE__ */ h("rect", { x: "42", y: "42", width: "12", height: "12", rx: "3" })
  ] });
}
function Q_({ onBuilt: e }) {
  const [t, n] = te(!1);
  return /* @__PURE__ */ $(be, { children: [
    /* @__PURE__ */ h(ci, { title: "System Map" }),
    /* @__PURE__ */ h("div", { className: "sm-page", children: /* @__PURE__ */ h(
      ka,
      {
        testId: "first-run",
        icon: /* @__PURE__ */ h(sd, {}),
        title: "See your system in one place",
        subtitle: "Add a project to map its code, data model, risk and plans.",
        action: /* @__PURE__ */ h(de, { primary: !0, onClick: () => n(!0), children: "Add project" })
      }
    ) }),
    /* @__PURE__ */ h($d, { open: t, projects: [], onClose: () => n(!1), onBuilt: e })
  ] });
}
function d1() {
  const { repos: e, active: t, loaded: n, choose: r, reload: o } = Id();
  return n ? t ? /* @__PURE__ */ h(J_, { repo: t, projects: e, choose: r, reload: o }, t) : /* @__PURE__ */ h(Q_, { onBuilt: r }) : /* @__PURE__ */ $(be, { children: [
    /* @__PURE__ */ h(ci, { title: "System Map" }),
    /* @__PURE__ */ h("div", { className: "sm-page", children: /* @__PURE__ */ h(Ho, { rows: 6 }) })
  ] });
}
function J_({
  repo: e,
  projects: t,
  choose: n,
  reload: r
}) {
  var jn, Yn;
  const o = _a(), { overview: i, error: s, refresh: a } = Ad(e), l = i == null ? void 0 : i.manifest.version, [c, d] = te(0), f = l ? `${l}:${c}` : void 0, u = Kt("/graph", e, f), p = Kt("/system", e, f), g = Kt("/plan", e, f), v = Kt("/findings", e, f), w = Kt("/risk", e, f), m = u.value, _ = p.value, y = g.value, b = v.value, E = w.value, k = le(() => (y == null ? void 0 : y.plans) ?? [], [y]), N = le(() => (b == null ? void 0 : b.findings) ?? [], [b]), z = Wi("/worktrees", e, F_), A = z.value, L = Wi("/explore", e, j_), [P, W] = te("whatif"), [B, x] = te(null), [C, S] = te(0), I = Td(B, e, C), [O, M] = te(!1), [T, D] = te(null), [H, Y] = te(() => zd(localStorage, e)), [j, U] = te(null), [ee, G] = te(null), [R, F] = te(!0), [K, Q] = te(!1), [q, J] = te(!0), [ne, re] = te(null), [ie, ae] = te(null), [_e, Te] = te("names"), [ve, Pe] = te(() => Ld(localStorage)), Ke = oe(null), De = oe(!1), [Qe, ke] = te(!1), [Se, Ne] = te(null), { ref: Je, height: jt, width: it } = Z_(), Yt = (i == null ? void 0 : i.freshness.missing) === !0, ge = U_(i && !Yt ? i.manifest.repo : null, e), st = $e(
    (V) => {
      Od(localStorage, e, V), Y(V);
    },
    [e]
  );
  ce(() => {
    var V;
    De.current && ((V = Ke.current) == null || V.focus()), De.current = !1;
  }, [ve]), ce(() => {
    if (!Se) return;
    const V = window.setTimeout(() => Ne(null), Y_);
    return () => window.clearTimeout(V);
  }, [Se]);
  const Cn = H === "map" ? ee && !/^(area|group):/.test(ee) ? ee : null : H === "data" ? j : null, gt = O && (I != null && I.diff.added.some((V) => V.id === Cn)) ? null : Cn, It = Pd(gt, e), Mn = le(() => {
    const V = /* @__PURE__ */ new Map();
    for (const he of N)
      he.severity !== "info" && V.set(he.node, (V.get(he.node) ?? 0) + 1);
    return V;
  }, [N]), In = le(() => Dd(A), [A]), $n = k.filter((V) => V.status === "planned" || V.status === "partial").length, Ur = ((A == null ? void 0 : A.counts.high) ?? 0) + ((A == null ? void 0 : A.counts.medium) ?? 0), qr = (E == null ? void 0 : E.modules.filter((V) => V.hot && V.untested).length) ?? 0, Zr = ((jn = L.value) == null ? void 0 : jn.proposals.filter((V) => V.status === "draft").length) ?? 0, Kr = { findings: N.length, plan: $n, risk: qr, worktrees: Ur, explore: Zr }, Re = O ? I : null, Gt = le(() => _ ? Rd(_, Re) : null, [_, Re]), Xt = le(() => {
    const V = (Re == null ? void 0 : Re.graph) ?? m;
    return V && (T == null ? void 0 : T.level) === "data" ? Hd(V, T.resolved) : V;
  }, [m, Re, T]), Qr = async () => {
    ke(!0), Ne(null), ae(null);
    try {
      const V = await o.post(`${Qt}/build`, { repo: e });
      await a(), await r(), Ne(V.unchanged ? "No changes" : "Rebuilt");
    } catch (V) {
      ae(on(V, "rebuild this project"));
    } finally {
      ke(!1);
    }
  }, Ut = async (V, he) => {
    ae(null);
    try {
      await he();
    } catch (ze) {
      ae(on(ze, V));
    }
  }, Jr = () => {
    It && ge.send(`Use the system-map tools. Look at ${It.id} and tell me what to watch out for.`);
  }, An = (V) => {
    ge.send(`Use the system-map tools. Check finding ${V.id} on ${V.node}, read its evidence, and propose a fix.`);
  }, eo = (V) => {
    ge.send(`Use the system-map tools. Look at ${V.id}, say what is left to build, and propose the next step.`);
  }, to = (V) => {
    ge.send(`Use the system-map tools. Look at ${V} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, no = (V) => {
    ge.send(`Use the system-map tools. Worktrees ${V.a} and ${V.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, ro = () => {
    ge.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, oo = async () => {
    re(null);
    try {
      await o.post(`${Qt}/coverage`, { repo: e }), d((V) => V + 1);
    } catch (V) {
      re(on(V, "load the coverage report"));
    }
  }, io = (V) => {
    M(!0), D(null), G(null);
    const he = [...(I == null ? void 0 : I.diff.added) ?? [], ...(I == null ? void 0 : I.diff.changed) ?? []].find((ze) => ze.id.startsWith("table:"));
    U(V === "data" ? (he == null ? void 0 : he.id) ?? null : null), st(V);
  }, so = (V, he) => Ut("change this proposal", async () => {
    await o.post(`${Qt}/proposal-status`, { repo: e, id: V, status: he }), S((ze) => ze + 1), await L.refresh();
  }), ao = (V, he) => Ut("delete this", async () => {
    await o.post(`${Qt}/intent-delete`, { repo: e, kind: V, id: he }), V === "proposals" && (x(null), M(!1)), await L.refresh();
  }), lo = (V) => {
    D(V), Q(V.overlays.risk), J(V.overlays.worktrees), F(V.overlays.plans), x(V.proposal), M(V.proposal !== null), G(null), U(null), st(V.level);
  }, co = () => {
    M(!1), D(null), U(null), G(null);
  }, Tn = (V, he) => Ut("change this plan", async () => {
    await o.post(`${Qt}/plan-status`, { repo: e, id: V, status: he }), d((ze) => ze + 1);
  }), $t = (V) => {
    st("data"), U(V);
  }, at = (V) => {
    st("map"), G(V);
  }, uo = (V) => {
    H === "data" && V.startsWith("table:") ? U(V) : at(V);
  }, zn = (V) => {
    V.startsWith("table:") ? $t(V) : at(V);
  }, Ln = () => {
    De.current = !0, Ud(localStorage, !ve), Pe(!ve);
  }, On = Xd(H), Pn = On && ve, Dn = H === "map" ? "modules" : "tables", qt = On && !ve && it >= Ir ? /* @__PURE__ */ $("button", { ref: Ke, type: "button", className: "sm-plain sm-layers sm-show-list", onClick: Ln, children: [
    "Show ",
    Dn
  ] }) : null, Rn = (Re == null ? void 0 : Re.title) ?? (T == null ? void 0 : T.title), Hn = Rn ? /* @__PURE__ */ h(Sx, { title: Rn, onBack: co }) : null, fo = X_.map((V) => ({ ...V, count: Kr[V.value] || void 0 })), Ce = i == null ? void 0 : i.freshness, Bn = Ce ? Bd(Wd(Ce), Ce.commits_behind, Ce.ref) : null, Wn = ((Yn = Ce == null ? void 0 : Ce.changed_inputs) == null ? void 0 : Yn.length) ?? 0, ho = /* @__PURE__ */ $(be, { children: [
    /* @__PURE__ */ $("div", { className: "sm-tool-row", children: [
      qt,
      /* @__PURE__ */ h(
        Ex,
        {
          layers: [
            f_($n, R, () => F((V) => !V)),
            { key: "risk", label: "Risk", on: K, title: "Mark hot and untested code on the map", onToggle: () => Q((V) => !V) },
            { key: "work", label: "Worktrees", on: q, title: "Show what each worktree is changing", onToggle: () => J((V) => !V) }
          ]
        }
      )
    ] }),
    Hn
  ] }), po = /* @__PURE__ */ $(be, { children: [
    /* @__PURE__ */ $("div", { className: "sm-tool-row", children: [
      qt,
      /* @__PURE__ */ h(
        gd,
        {
          ariaLabel: "How much of each table to show",
          layoutId: "system-map-density",
          collapse: !1,
          segments: G_,
          value: _e,
          onChange: (V) => Te(V)
        }
      )
    ] }),
    Hn
  ] }), Zt = {
    map: Gt !== null,
    data: !!Xt,
    plan: y !== null,
    risk: E !== null,
    worktrees: A !== null,
    findings: b !== null,
    explore: L.value !== null
  }, Vn = {
    map: p.failed,
    data: u.failed,
    plan: g.failed,
    risk: w.failed,
    worktrees: z.failed,
    findings: v.failed,
    explore: L.failed
  }, go = () => {
    d((V) => V + 1), z.refresh(), L.refresh();
  }, Fn = Vd({ projects: t, activeKey: e, onPick: n, onReload: () => void r() }), mo = /* @__PURE__ */ $("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }, children: [
    /* @__PURE__ */ h("span", { style: { whiteSpace: "nowrap" }, children: "System Map" }),
    /* @__PURE__ */ h("span", { "aria-hidden": "true", style: { ...Z, fontWeight: 400 }, children: "/" }),
    Fn.menu
  ] });
  return /* @__PURE__ */ $(be, { children: [
    Fn.dialogs,
    /* @__PURE__ */ h(
      ci,
      {
        title: mo,
        actions: i && Bn ? /* @__PURE__ */ h(
          b_,
          {
            status: Bn,
            detail: Ce != null && Ce.stale ? `${Wn} schema ${Wn === 1 ? "file" : "files"} changed on ${Ce.ref}` : void 0,
            commit: i.manifest.commit,
            builtAt: i.manifest.built_at,
            read: i.manifest.read,
            busy: Qe,
            result: Se,
            onRebuild: () => void Qr()
          }
        ) : void 0
      }
    ),
    /* @__PURE__ */ $("div", { ref: Je, className: "sm-page", style: { height: jt, display: "flex", flexDirection: "column", gap: va, minHeight: 0 }, children: [
      s && !i && /* @__PURE__ */ $(or, { children: [
        s,
        " ",
        /* @__PURE__ */ h(de, { onClick: () => void a(), children: "Try again" })
      ] }),
      !i && !s && /* @__PURE__ */ h(Ho, { rows: 6 }),
      ie && /* @__PURE__ */ h(or, { onDismiss: () => ae(null), children: ie }),
      Yt && i && /* @__PURE__ */ $(or, { children: [
        "The folder for this project is gone: ",
        /* @__PURE__ */ h("span", { className: "sm-mono", children: i.manifest.repo }),
        ". You can still read the last model. To go on, move the folder back, or remove the project from the project menu."
      ] }),
      i && /* @__PURE__ */ $(be, { children: [
        /* @__PURE__ */ h(O_, { items: fo, value: H, onChange: st, label: "System Map views" }),
        /* @__PURE__ */ $(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: va,
              gridTemplateColumns: qx(it, Pn),
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              Pn && it >= Ir && /* @__PURE__ */ $(wo, { style: Ro, "data-testid": "side-list", children: [
                /* @__PURE__ */ $("div", { className: "sm-list-head", children: [
                  /* @__PURE__ */ h(Bi, { children: H === "map" ? "Modules" : "Tables" }),
                  /* @__PURE__ */ h("button", { ref: Ke, type: "button", className: "sm-plain sm-hide-list", "aria-label": `Hide ${Dn}`, onClick: Ln, children: "Hide" })
                ] }),
                H === "map" ? /* @__PURE__ */ h(Fd, { nodes: (_ == null ? void 0 : _.nodes) ?? [], focus: ee, onSelect: at }) : /* @__PURE__ */ h(jd, { tables: i.tables, selected: j, flagged: Mn, working: In, onSelect: $t })
              ] }),
              /* @__PURE__ */ $(
                wo,
                {
                  style: { ...Ro, padding: 0, position: "relative" },
                  "data-testid": "canvas",
                  id: rd,
                  role: "tabpanel",
                  "aria-labelledby": `system-map-tab-${H}`,
                  children: [
                    !Zt[H] && !Vn[H] && /* @__PURE__ */ h(Ho, { rows: 6 }),
                    !Zt[H] && Vn[H] && /* @__PURE__ */ h("div", { style: { padding: 12 }, children: /* @__PURE__ */ $(or, { children: [
                      "Couldn't load this view. ",
                      /* @__PURE__ */ h(de, { onClick: go, children: "Try again" })
                    ] }) }),
                    H === "map" && Gt && /* @__PURE__ */ h(
                      T_,
                      {
                        system: Gt,
                        focus: ee,
                        tables: i.manifest.counts.tables,
                        showPlans: R,
                        inspecting: gt !== null,
                        risk: K ? E : null,
                        worktrees: q ? A : null,
                        only: (T == null ? void 0 : T.level) === "map" ? T.resolved : null,
                        layout: (T == null ? void 0 : T.layout) ?? "left-right",
                        tools: ho,
                        onFocus: (V) => {
                          D(null), G(V);
                        },
                        onOpenTables: () => st("data")
                      }
                    ),
                    H === "data" && i.tables.length === 0 && !O && /* @__PURE__ */ h(K_, { read: i.manifest.read }),
                    H === "data" && Xt && (i.tables.length > 0 || O) && /* @__PURE__ */ h(Lx, { graph: Xt, selected: j, flagged: Mn, working: In, density: _e, tools: po, onSelect: U }),
                    H === "explore" && L.value && /* @__PURE__ */ h(
                      Yx,
                      {
                        data: L.value,
                        proposal: I,
                        shownProposal: O ? B : null,
                        canAsk: ge.canAsk,
                        tab: P,
                        onTab: W,
                        onSend: ge.send,
                        onOpenProposal: x,
                        onDrawProposal: io,
                        onStatus: (V, he) => void so(V, he),
                        onDelete: (V, he) => void ao(V, he),
                        onOpenView: lo,
                        onNode: zn
                      }
                    ),
                    H === "plan" && y && /* @__PURE__ */ h(u_, { plans: k, onShow: at, onAsk: eo, onStatus: (V, he) => void Tn(V, he) }),
                    H === "risk" && E && /* @__PURE__ */ h(
                      w_,
                      {
                        risk: E,
                        canAsk: ge.canAsk,
                        error: ne,
                        onShow: at,
                        onAsk: to,
                        onLoad: () => void oo(),
                        onRun: ro
                      }
                    ),
                    H === "worktrees" && A && /* @__PURE__ */ h(V_, { state: A, checkedAt: z.checkedAt, canAsk: ge.canAsk, onShow: zn, onAsk: no }),
                    H === "findings" && b && /* @__PURE__ */ h(Xx, { findings: N, noSchema: i.tables.length === 0, onShow: $t, onAsk: An }),
                    It && gt && /* @__PURE__ */ h(
                      s_,
                      {
                        node: It,
                        work: (A == null ? void 0 : A.by_node[gt]) ?? [],
                        overlaps: Yd(gt, A),
                        canAsk: ge.canAsk,
                        onAsk: Jr,
                        onAskFinding: An,
                        onOpen: uo,
                        onClose: () => H === "data" ? U(null) : G(null)
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ $(wo, { style: it >= td ? Ro : { display: "none" }, children: [
                /* @__PURE__ */ h(Bi, { children: "Design chat" }),
                ge.error && /* @__PURE__ */ h("p", { style: { fontSize: 13 }, children: ge.error }),
                Yt && /* @__PURE__ */ h("p", { style: { ...Z, fontSize: 13 }, children: "Chat needs this project's folder." }),
                /* @__PURE__ */ $("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: [
                  ge.slot && /* @__PURE__ */ h("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ h(pd, { slotKey: ge.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }),
                  ge.startable && /* @__PURE__ */ h(q_, { disabled: ge.opening, onSend: ge.send })
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
  d1 as default
};
