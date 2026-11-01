var Oc = Object.defineProperty;
var Pc = (e, t, n) => t in e ? Oc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var he = (e, t, n) => Pc(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as m, jsxs as D, Fragment as _e } from "react/jsx-runtime";
import { useTheme as cs, useAppApi as Jr, ChatEmbed as Dc } from "@kirocrew/app-sdk";
import { Btn as me, Badge as we, PageHeader as Rc, Card as _n, CardTitle as Lr, Input as Hc } from "@kirocrew/app-sdk/ui";
import eo, { memo as fe, forwardRef as us, useState as se, createContext as Yn, useCallback as Pe, useMemo as ce, useContext as zt, useRef as re, useEffect as le, useLayoutEffect as ds } from "react";
import "react-dom";
import { M as oe, a as Qe, S as jn, A as ft, N as Vc, p as to, s as Gn, b as Bc, r as Fc, c as Wc, w as Yc, t as jc, G as Gc, d as Xc, e as Uc, u as qc, f as Kc, g as Ot, h as Zc, i as Qc, j as Jc, k as eu, T as tu, o as nu, l as ru, B as zr } from "./chunks/model-BSIe8JEf.mjs";
function fs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ou = "\0", at = "\0", zo = "";
let iu = class {
  constructor(t) {
    he(this, "_isDirected", !0);
    he(this, "_isMultigraph", !1);
    he(this, "_isCompound", !1);
    // Label for the graph itself
    he(this, "_label");
    // Defaults to be set when creating a new node
    he(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    he(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    he(this, "_nodes", {});
    // v -> edgeObj
    he(this, "_in", {});
    // u -> v -> Number
    he(this, "_preds", {});
    // v -> edgeObj
    he(this, "_out", {});
    // v -> w -> Number
    he(this, "_sucs", {});
    // e -> edgeObj
    he(this, "_edgeObjs", {});
    // e -> label
    he(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    he(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    he(this, "_edgeCount", 0);
    he(this, "_parent");
    he(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[at] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = at, this._children[t] = {}, this._children[at][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      n = at;
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
      if (n !== at)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = at) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === at)
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
    var a = Rt(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = su(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, To(this._preds[n], t), To(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? hr(this._isDirected, arguments[0]) : Rt(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? hr(this._isDirected, arguments[0]) : Rt(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? hr(this._isDirected, arguments[0]) : Rt(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], Oo(this._preds[n], t), Oo(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function To(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function Oo(e, t) {
  --e[t] || delete e[t];
}
function Rt(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + zo + i + zo + (r === void 0 ? ou : r);
}
function su(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function hr(e, t) {
  return Rt(e, t.v, t.w, t.name);
}
var no = iu, au = "2.2.4", lu = {
  Graph: no,
  version: au
}, cu = no, uu = {
  write: du,
  read: pu
};
function du(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: fu(e),
    edges: hu(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function fu(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function hu(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function pu(e) {
  var t = new cu(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var gu = mu;
function mu(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let yu = class {
  constructor() {
    he(this, "_arr", []);
    he(this, "_keyIndices", {});
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
var hs = yu, wu = hs, ps = bu, xu = () => 1;
function bu(e, t, n, r) {
  return vu(
    e,
    String(t),
    n || xu,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function vu(e, t, n, r) {
  var o = {}, i = new wu(), s, a, l = function(c) {
    var u = c.v !== s ? c.v : c.w, f = o[u], d = n(c), h = a.distance + d;
    if (d < 0)
      throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + c + " Weight: " + d);
    h < f.distance && (f.distance = h, f.predecessor = s, i.decrease(u, h));
  };
  for (e.nodes().forEach(function(c) {
    var u = c === t ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: u }, i.add(c, u);
  }); i.size() > 0 && (s = i.removeMin(), a = o[s], a.distance !== Number.POSITIVE_INFINITY); )
    r(s).forEach(l);
  return o;
}
var _u = ps, ku = Eu;
function Eu(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = _u(e, o, t, n), r;
  }, {});
}
var gs = Su;
function Su(e) {
  var t = 0, n = [], r = {}, o = [];
  function i(s) {
    var a = r[s] = {
      onStack: !0,
      lowlink: t,
      index: t++
    };
    if (n.push(s), e.successors(s).forEach(function(u) {
      Object.hasOwn(r, u) ? r[u].onStack && (a.lowlink = Math.min(a.lowlink, r[u].index)) : (i(u), a.lowlink = Math.min(a.lowlink, r[u].lowlink));
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
var Nu = gs, Cu = Mu;
function Mu(e) {
  return Nu(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var Iu = Au, $u = () => 1;
function Au(e, t, n) {
  return Lu(
    e,
    t || $u,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function Lu(e, t, n) {
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
        var u = l[i], f = s[c], d = l[c], h = u.distance + f.distance;
        h < d.distance && (d.distance = h, d.predecessor = f.predecessor);
      });
    });
  }), r;
}
function ms(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new Tr();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new Tr();
  return r;
}
class Tr extends Error {
  constructor() {
    super(...arguments);
  }
}
var ys = ms;
ms.CycleException = Tr;
var Po = ys, zu = Tu;
function Tu(e) {
  try {
    Po(e);
  } catch (t) {
    if (t instanceof Po.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var ws = Ou;
function Ou(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? Pu : Du, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function Pu(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), xs(t(i[0]), (s) => o.push([s, !1])));
  }
}
function Du(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), xs(t(i), (s) => o.push(s)));
  }
}
function xs(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var Ru = ws, Hu = Vu;
function Vu(e, t) {
  return Ru(e, t, "post");
}
var Bu = ws, Fu = Wu;
function Wu(e, t) {
  return Bu(e, t, "pre");
}
var Yu = no, ju = hs, Gu = Xu;
function Xu(e, t) {
  var n = new Yu(), r = {}, o = new ju(), i;
  function s(l) {
    var c = l.v === i ? l.w : l.v, u = o.priority(c);
    if (u !== void 0) {
      var f = t(l);
      f < u && (r[c] = i, o.decrease(c, f));
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
var Uu = {
  components: gu,
  dijkstra: ps,
  dijkstraAll: ku,
  findCycles: Cu,
  floydWarshall: Iu,
  isAcyclic: zu,
  postorder: Hu,
  preorder: Fu,
  prim: Gu,
  tarjan: gs,
  topsort: ys
}, Do = lu, Re = {
  Graph: Do.Graph,
  json: uu,
  alg: Uu,
  version: Do.version
};
let qu = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return Ro(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && Ro(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, Ku)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function Ro(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function Ku(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var Zu = qu;
let Qu = Re.Graph, Ju = Zu;
var ed = nd;
let td = () => 1;
function nd(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = od(e, t || td);
  return rd(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function rd(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      pr(e, t, n, s);
    for (; s = o.dequeue(); )
      pr(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(pr(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function pr(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, Or(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, Or(t, n, c);
  }), e.removeNode(r.v), i;
}
function od(e, t) {
  let n = new Qu(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), u = l + c;
    n.setEdge(a.v, a.w, u), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = id(o + r + 3).map(() => new Ju()), s = r + 1;
  return n.nodes().forEach((a) => {
    Or(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function Or(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function id(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let bs = Re.Graph;
var pe = {
  addBorderNode: pd,
  addDummyNode: vs,
  applyWithChunking: Xn,
  asNonCompoundGraph: ad,
  buildLayerMatrix: dd,
  intersectRect: ud,
  mapValues: vd,
  maxRank: ks,
  normalizeRanks: fd,
  notime: wd,
  partition: md,
  pick: bd,
  predecessorWeights: cd,
  range: Ss,
  removeEmptyRanks: hd,
  simplify: sd,
  successorWeights: ld,
  time: yd,
  uniqueId: Es,
  zipObject: ro
};
function vs(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = Es(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function sd(e) {
  let t = new bs().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function ad(e) {
  let t = new bs({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function ld(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return ro(e.nodes(), t);
}
function cd(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return ro(e.nodes(), t);
}
function ud(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function dd(e) {
  let t = Ss(ks(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function fd(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Xn(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function hd(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Xn(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function pd(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), vs(e, "border", o, t);
}
function gd(e, t = _s) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const _s = 65535;
function Xn(e, t) {
  if (t.length > _s) {
    const n = gd(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function ks(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Xn(Math.max, n);
}
function md(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function yd(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function wd(e, t) {
  return t();
}
let xd = 0;
function Es(e) {
  var t = ++xd;
  return e + ("" + t);
}
function Ss(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function bd(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function vd(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function ro(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let _d = ed, kd = pe.uniqueId;
var Ed = {
  run: Sd,
  undo: Cd
};
function Sd(e) {
  (e.graph().acyclicer === "greedy" ? _d(e, n(e)) : Nd(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, kd("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function Nd(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function Cd(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let Md = pe;
var Id = {
  run: $d,
  undo: Ld
};
function $d(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => Ad(e, t));
}
function Ad(e, t) {
  let n = t.v, r = e.node(n).rank, o = t.w, i = e.node(o).rank, s = t.name, a = e.edge(t), l = a.labelRank;
  if (i === r + 1) return;
  e.removeEdge(t);
  let c, u, f;
  for (f = 0, ++r; r < i; ++f, ++r)
    a.points = [], u = {
      width: 0,
      height: 0,
      edgeLabel: a,
      edgeObj: t,
      rank: r
    }, c = Md.addDummyNode(e, "edge", u, "_d"), r === l && (u.width = a.width, u.height = a.height, u.dummy = "edge-label", u.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function Ld(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: zd } = pe;
var Un = {
  longestPath: Td,
  slack: Od
};
function Td(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = zd(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function Od(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Pd = Re.Graph, $n = Un.slack, Ns = Dd;
function Dd(e) {
  var t = new Pd({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; Rd(t, e) < r; )
    o = Hd(t, e), i = t.hasNode(o.v) ? $n(e, o) : -$n(e, o), Vd(t, e, i);
  return t;
}
function Rd(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !$n(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Hd(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = $n(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Vd(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Bd = Ns, Ho = Un.slack, Fd = Un.longestPath, Wd = Re.alg.preorder, Yd = Re.alg.postorder, jd = pe.simplify, Gd = xt;
xt.initLowLimValues = io;
xt.initCutValues = oo;
xt.calcCutValue = Cs;
xt.leaveEdge = Is;
xt.enterEdge = $s;
xt.exchangeEdges = As;
function xt(e) {
  e = jd(e), Fd(e);
  var t = Bd(e);
  io(t), oo(t, e);
  for (var n, r; n = Is(t); )
    r = $s(t, e, n), As(t, e, n, r);
}
function oo(e, t) {
  var n = Yd(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => Xd(e, t, r));
}
function Xd(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = Cs(e, t, n);
}
function Cs(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, u = c ? l.w : l.v;
    if (u !== o) {
      var f = c === i, d = t.edge(l).weight;
      if (a += f ? d : -d, qd(e, n, u)) {
        var h = e.edge(n, u).cutvalue;
        a += f ? -h : h;
      }
    }
  }), a;
}
function io(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), Ms(e, {}, 1, t);
}
function Ms(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = Ms(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function Is(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function $s(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((u) => l === Vo(e, e.node(u.v), a) && l !== Vo(e, e.node(u.w), a));
  return c.reduce((u, f) => Ho(t, f) < Ho(t, u) ? f : u);
}
function As(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), io(e), oo(e, t), Ud(e, t);
}
function Ud(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = Wd(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function qd(e, t, n) {
  return e.hasEdge(t, n);
}
function Vo(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var Kd = Un, Ls = Kd.longestPath, Zd = Ns, Qd = Gd, Jd = ef;
function ef(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      Bo(e);
      break;
    case "tight-tree":
      nf(e);
      break;
    case "longest-path":
      tf(e);
      break;
    case "none":
      break;
    default:
      Bo(e);
  }
}
var tf = Ls;
function nf(e) {
  Ls(e), Zd(e);
}
function Bo(e) {
  Qd(e);
}
var rf = of;
function of(e) {
  let t = af(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = sf(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], u = !0;
    for (; n !== o.w; ) {
      if (r = e.node(n), u) {
        for (; (c = s[l]) !== a && e.node(c).maxRank < r.rank; )
          l++;
        c === a && (u = !1);
      }
      if (!u) {
        for (; l < s.length - 1 && e.node(c = s[l + 1]).minRank <= r.rank; )
          l++;
        c = s[l];
      }
      e.setParent(n, c), n = e.successors(n)[0];
    }
  });
}
function sf(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function af(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let An = pe;
var lf = {
  run: cf,
  cleanup: ff
};
function cf(e) {
  let t = An.addDummyNode(e, "root", {}, "_root"), n = uf(e), r = Object.values(n), o = An.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = df(e) + 1;
  e.children().forEach((a) => zs(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function zs(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = An.addBorderNode(e, "_bt"), c = An.addBorderNode(e, "_bb"), u = e.node(s);
  e.setParent(l, s), u.borderTop = l, e.setParent(c, s), u.borderBottom = c, a.forEach((f) => {
    zs(e, t, n, r, o, i, f);
    let d = e.node(f), h = d.borderTop ? d.borderTop : f, p = d.borderBottom ? d.borderBottom : f, v = d.borderTop ? r : 2 * r, b = h !== p ? 1 : o - i[s] + 1;
    e.setEdge(l, h, {
      weight: v,
      minlen: b,
      nestingEdge: !0
    }), e.setEdge(p, c, {
      weight: v,
      minlen: b,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function uf(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function df(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function ff(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let hf = pe;
var pf = gf;
function gf(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        Fo(e, "borderLeft", "_bl", n, o, i), Fo(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function Fo(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = hf.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var mf = {
  adjust: yf,
  undo: wf
};
function yf(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && Ts(e);
}
function wf(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && xf(e), (t === "lr" || t === "rl") && (bf(e), Ts(e));
}
function Ts(e) {
  e.nodes().forEach((t) => Wo(e.node(t))), e.edges().forEach((t) => Wo(e.edge(t)));
}
function Wo(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function xf(e) {
  e.nodes().forEach((t) => gr(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(gr), Object.hasOwn(n, "y") && gr(n);
  });
}
function gr(e) {
  e.y = -e.y;
}
function bf(e) {
  e.nodes().forEach((t) => mr(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(mr), Object.hasOwn(n, "x") && mr(n);
  });
}
function mr(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let Yo = pe;
var vf = _f;
function _f(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = Yo.applyWithChunking(Math.max, r), i = Yo.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let kf = pe.zipObject;
var Ef = Sf;
function Sf(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += Nf(e, t[r - 1], t[r]);
  return n;
}
function Nf(e, t, n) {
  let r = kf(n, n.map((c, u) => u)), o = t.flatMap((c) => e.outEdges(c).map((u) => ({ pos: r[u.w], weight: e.edge(u).weight })).sort((u, f) => u.pos - f.pos)), i = 1;
  for (; i < n.length; ) i <<= 1;
  let s = 2 * i - 1;
  i -= 1;
  let a = new Array(s).fill(0), l = 0;
  return o.forEach((c) => {
    let u = c.pos + i;
    a[u] += c.weight;
    let f = 0;
    for (; u > 0; )
      u % 2 && (f += a[u + 1]), u = u - 1 >> 1, a[u] += c.weight;
    l += c.weight * f;
  }), l;
}
var Cf = Mf;
function Mf(e, t = []) {
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
let If = pe;
var $f = Af;
function Af(e, t) {
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
  return Lf(r);
}
function Lf(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && zf(o, i);
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
  return t.filter((o) => !o.merged).map((o) => If.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function zf(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let Tf = pe;
var Of = Pf;
function Pf(e, t) {
  let n = Tf.partition(e, (u) => Object.hasOwn(u, "barycenter")), r = n.lhs, o = n.rhs.sort((u, f) => f.i - u.i), i = [], s = 0, a = 0, l = 0;
  r.sort(Df(!!t)), l = jo(i, o, l), r.forEach((u) => {
    l += u.vs.length, i.push(u.vs), s += u.barycenter * u.weight, a += u.weight, l = jo(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function jo(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function Df(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Rf = Cf, Hf = $f, Vf = Of;
var Bf = Os;
function Os(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((d) => d !== s && d !== a));
  let c = Rf(e, o);
  c.forEach((d) => {
    if (e.children(d.v).length) {
      let h = Os(e, d.v, n, r);
      l[d.v] = h, Object.hasOwn(h, "barycenter") && Wf(d, h);
    }
  });
  let u = Hf(c, n);
  Ff(u, l);
  let f = Vf(u, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let d = e.node(e.predecessors(s)[0]), h = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + d.order + h.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function Ff(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function Wf(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let Yf = Re.Graph, jf = pe;
var Gf = Xf;
function Xf(e, t, n, r) {
  r || (r = e.nodes());
  let o = Uf(e), i = new Yf({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
  return r.forEach((s) => {
    let a = e.node(s), l = e.parent(s);
    (a.rank === t || a.minRank <= t && t <= a.maxRank) && (i.setNode(s), i.setParent(s, l || o), e[n](s).forEach((c) => {
      let u = c.v === s ? c.w : c.v, f = i.edge(u, s), d = f !== void 0 ? f.weight : 0;
      i.setEdge(u, s, { weight: e.edge(c).weight + d });
    }), Object.hasOwn(a, "minRank") && i.setNode(s, {
      borderLeft: a.borderLeft[t],
      borderRight: a.borderRight[t]
    }));
  }), i;
}
function Uf(e) {
  for (var t; e.hasNode(t = jf.uniqueId("_root")); ) ;
  return t;
}
var qf = Kf;
function Kf(e, t, n) {
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
let Zf = vf, Qf = Ef, Jf = Bf, eh = Gf, th = qf, nh = Re.Graph, fn = pe;
var rh = Ps;
function Ps(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, Ps);
    return;
  }
  let n = fn.maxRank(e), r = Go(e, fn.range(1, n + 1), "inEdges"), o = Go(e, fn.range(n - 1, -1, -1), "outEdges"), i = Zf(e);
  if (Xo(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    oh(l % 2 ? r : o, l % 4 >= 2), i = fn.buildLayerMatrix(e);
    let u = Qf(e, i);
    u < s && (c = 0, a = Object.assign({}, i), s = u);
  }
  Xo(e, a);
}
function Go(e, t, n) {
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
    return eh(e, i, n, r.get(i) || []);
  });
}
function oh(e, t) {
  let n = new nh();
  e.forEach(function(r) {
    let o = r.graph().root, i = Jf(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), th(r, n, i.vs);
  });
}
function Xo(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let ih = Re.Graph, qe = pe;
var sh = {
  positionX: yh
};
function ah(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((u, f) => {
      let d = ch(e, u), h = d ? e.node(d).order : l;
      (d || u === c) && (i.slice(a, f + 1).forEach((p) => {
        e.predecessors(p).forEach((v) => {
          let b = e.node(v), y = b.order;
          (y < s || h < y) && !(b.dummy && e.node(p).dummy) && Ds(n, v, p);
        });
      }), a = f + 1, s = h);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function lh(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let u;
    qe.range(s, a).forEach((f) => {
      u = i[f], e.node(u).dummy && e.predecessors(u).forEach((d) => {
        let h = e.node(d);
        h.dummy && (h.order < l || h.order > c) && Ds(n, d, u);
      });
    });
  }
  function o(i, s) {
    let a = -1, l, c = 0;
    return s.forEach((u, f) => {
      if (e.node(u).dummy === "border") {
        let d = e.predecessors(u);
        d.length && (l = e.node(d[0]).order, r(s, c, f, a, l), c = f, a = l);
      }
      r(s, c, s.length, l, i.length);
    }), s;
  }
  return t.length && t.reduce(o), n;
}
function ch(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function Ds(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function uh(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function dh(e, t, n, r) {
  let o = {}, i = {}, s = {};
  return t.forEach((a) => {
    a.forEach((l, c) => {
      o[l] = l, i[l] = l, s[l] = c;
    });
  }), t.forEach((a) => {
    let l = -1;
    a.forEach((c) => {
      let u = r(c);
      if (u.length) {
        u = u.sort((d, h) => s[d] - s[h]);
        let f = (u.length - 1) / 2;
        for (let d = Math.floor(f), h = Math.ceil(f); d <= h; ++d) {
          let p = u[d];
          i[c] === c && l < s[p] && !uh(n, c, p) && (i[p] = c, i[c] = o[c] = o[p], l = s[p]);
        }
      }
    });
  }), { root: o, align: i };
}
function fh(e, t, n, r, o) {
  let i = {}, s = hh(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, d) {
    let h = s.nodes(), p = h.pop(), v = {};
    for (; p; )
      v[p] ? f(p) : (v[p] = !0, h.push(p), h = h.concat(d(p))), p = h.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((d, h) => Math.max(d, i[h.v] + s.edge(h)), 0);
  }
  function u(f) {
    let d = s.outEdges(f).reduce((p, v) => Math.min(p, i[v.w] - s.edge(v)), Number.POSITIVE_INFINITY), h = e.node(f);
    d !== Number.POSITIVE_INFINITY && h.borderType !== a && (i[f] = Math.max(i[f], d));
  }
  return l(c, s.predecessors.bind(s)), l(u, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function hh(e, t, n, r) {
  let o = new ih(), i = e.graph(), s = wh(i.nodesep, i.edgesep, r);
  return t.forEach((a) => {
    let l;
    a.forEach((c) => {
      let u = n[c];
      if (o.setNode(u), l) {
        var f = n[l], d = o.edge(f, u);
        o.setEdge(f, u, Math.max(s(e, c, l), d || 0));
      }
      l = c;
    });
  }), o;
}
function ph(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = xh(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function gh(e, t) {
  let n = Object.values(t), r = qe.applyWithChunking(Math.min, n), o = qe.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), u = r - qe.applyWithChunking(Math.min, c);
      s !== "l" && (u = o - qe.applyWithChunking(Math.max, c)), u && (e[a] = qe.mapValues(l, (f) => f + u));
    });
  });
}
function mh(e, t) {
  return qe.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function yh(e) {
  let t = qe.buildLayerMatrix(e), n = Object.assign(
    ah(e, t),
    lh(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = dh(e, o, n, l), u = fh(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (u = qe.mapValues(u, (f) => -f)), r[s + a] = u;
    });
  });
  let i = ph(e, r);
  return gh(r, i), mh(r, e.graph().align);
}
function wh(e, t, n) {
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
function xh(e, t) {
  return e.node(t).width;
}
let Rs = pe, bh = sh.positionX;
var vh = _h;
function _h(e) {
  e = Rs.asNonCompoundGraph(e), kh(e), Object.entries(bh(e)).forEach(([t, n]) => e.node(t).x = n);
}
function kh(e) {
  let t = Rs.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let Uo = Ed, qo = Id, Eh = Jd, Sh = pe.normalizeRanks, Nh = rf, Ch = pe.removeEmptyRanks, Ko = lf, Mh = pf, Zo = mf, Ih = rh, $h = vh, Ce = pe, Ah = Re.Graph;
var Lh = zh;
function zh(e, t) {
  let n = t && t.debugTiming ? Ce.time : Ce.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => Wh(e));
    n("  runLayout", () => Th(r, n, t)), n("  updateInputGraph", () => Oh(e, r));
  });
}
function Th(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => Yh(e)), t("    removeSelfEdges", () => Jh(e)), t("    acyclic", () => Uo.run(e)), t("    nestingGraph.run", () => Ko.run(e)), t("    rank", () => Eh(Ce.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => jh(e)), t("    removeEmptyRanks", () => Ch(e)), t("    nestingGraph.cleanup", () => Ko.cleanup(e)), t("    normalizeRanks", () => Sh(e)), t("    assignRankMinMax", () => Gh(e)), t("    removeEdgeLabelProxies", () => Xh(e)), t("    normalize.run", () => qo.run(e)), t("    parentDummyChains", () => Nh(e)), t("    addBorderSegments", () => Mh(e)), t("    order", () => Ih(e, n)), t("    insertSelfEdges", () => ep(e)), t("    adjustCoordinateSystem", () => Zo.adjust(e)), t("    position", () => $h(e)), t("    positionSelfEdges", () => tp(e)), t("    removeBorderNodes", () => Qh(e)), t("    normalize.undo", () => qo.undo(e)), t("    fixupEdgeLabelCoords", () => Kh(e)), t("    undoCoordinateSystem", () => Zo.undo(e)), t("    translateGraph", () => Uh(e)), t("    assignNodeIntersects", () => qh(e)), t("    reversePoints", () => Zh(e)), t("    acyclic.undo", () => Uo.undo(e));
}
function Oh(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let Ph = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], Dh = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Rh = ["acyclicer", "ranker", "rankdir", "align"], Hh = ["width", "height", "rank"], Qo = { width: 0, height: 0 }, Vh = ["minlen", "weight", "width", "height", "labeloffset"], Bh = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Fh = ["labelpos"];
function Wh(e) {
  let t = new Ah({ multigraph: !0, compound: !0 }), n = wr(e.graph());
  return t.setGraph(Object.assign(
    {},
    Dh,
    yr(n, Ph),
    Ce.pick(n, Rh)
  )), e.nodes().forEach((r) => {
    let o = wr(e.node(r));
    const i = yr(o, Hh);
    Object.keys(Qo).forEach((s) => {
      i[s] === void 0 && (i[s] = Qo[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = wr(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Bh,
      yr(o, Vh),
      Ce.pick(o, Fh)
    ));
  }), t;
}
function Yh(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function jh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      Ce.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Gh(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function Xh(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Uh(e) {
  let t = Number.POSITIVE_INFINITY, n = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function l(c) {
    let u = c.x, f = c.y, d = c.width, h = c.height;
    t = Math.min(t, u - d / 2), n = Math.max(n, u + d / 2), r = Math.min(r, f - h / 2), o = Math.max(o, f + h / 2);
  }
  e.nodes().forEach((c) => l(e.node(c))), e.edges().forEach((c) => {
    let u = e.edge(c);
    Object.hasOwn(u, "x") && l(u);
  }), t -= s, r -= a, e.nodes().forEach((c) => {
    let u = e.node(c);
    u.x -= t, u.y -= r;
  }), e.edges().forEach((c) => {
    let u = e.edge(c);
    u.points.forEach((f) => {
      f.x -= t, f.y -= r;
    }), Object.hasOwn(u, "x") && (u.x -= t), Object.hasOwn(u, "y") && (u.y -= r);
  }), i.width = n - t + s, i.height = o - r + a;
}
function qh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(Ce.intersectRect(r, i)), n.points.push(Ce.intersectRect(o, s));
  });
}
function Kh(e) {
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
function Zh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function Qh(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Jh(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function ep(e) {
  var t = Ce.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        Ce.addDummyNode(e, "selfedge", {
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
function tp(e) {
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
function yr(e, t) {
  return Ce.mapValues(Ce.pick(e, t), Number);
}
function wr(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let np = pe, rp = Re.Graph;
var op = {
  debugOrdering: ip
};
function ip(e) {
  let t = np.buildLayerMatrix(e), n = new rp({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var sp = "1.1.8", ap = {
  graphlib: Re,
  layout: Lh,
  debug: op,
  util: {
    time: pe.time,
    notime: pe.notime
  },
  version: sp
};
const Ln = /* @__PURE__ */ fs(ap);
function ge(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = ge(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var lp = { value: () => {
} };
function qn() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new kn(n);
}
function kn(e) {
  this._ = e;
}
function cp(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
kn.prototype = qn.prototype = {
  constructor: kn,
  on: function(e, t) {
    var n = this._, r = cp(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = up(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Jo(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Jo(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new kn(e);
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
function up(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Jo(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = lp, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Pr = "http://www.w3.org/1999/xhtml";
const ei = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Pr,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Kn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), ei.hasOwnProperty(t) ? { space: ei[t], local: e } : e;
}
function dp(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Pr && t.documentElement.namespaceURI === Pr ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function fp(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Hs(e) {
  var t = Kn(e);
  return (t.local ? fp : dp)(t);
}
function hp() {
}
function so(e) {
  return e == null ? hp : function() {
    return this.querySelector(e);
  };
}
function pp(e) {
  typeof e != "function" && (e = so(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, u = 0; u < s; ++u)
      (l = i[u]) && (c = e.call(l, l.__data__, u, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[u] = c);
  return new Ee(r, this._parents);
}
function gp(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function mp() {
  return [];
}
function Vs(e) {
  return e == null ? mp : function() {
    return this.querySelectorAll(e);
  };
}
function yp(e) {
  return function() {
    return gp(e.apply(this, arguments));
  };
}
function wp(e) {
  typeof e == "function" ? e = yp(e) : e = Vs(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new Ee(r, o);
}
function Bs(e) {
  return function() {
    return this.matches(e);
  };
}
function Fs(e) {
  return function(t) {
    return t.matches(e);
  };
}
var xp = Array.prototype.find;
function bp(e) {
  return function() {
    return xp.call(this.children, e);
  };
}
function vp() {
  return this.firstElementChild;
}
function _p(e) {
  return this.select(e == null ? vp : bp(typeof e == "function" ? e : Fs(e)));
}
var kp = Array.prototype.filter;
function Ep() {
  return Array.from(this.children);
}
function Sp(e) {
  return function() {
    return kp.call(this.children, e);
  };
}
function Np(e) {
  return this.selectAll(e == null ? Ep : Sp(typeof e == "function" ? e : Fs(e)));
}
function Cp(e) {
  typeof e != "function" && (e = Bs(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ee(r, this._parents);
}
function Ws(e) {
  return new Array(e.length);
}
function Mp() {
  return new Ee(this._enter || this._groups.map(Ws), this._parents);
}
function zn(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
zn.prototype = {
  constructor: zn,
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
function Ip(e) {
  return function() {
    return e;
  };
}
function $p(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new zn(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function Ap(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), u = t.length, f = i.length, d = new Array(u), h;
  for (a = 0; a < u; ++a)
    (l = t[a]) && (d[a] = h = s.call(l, l.__data__, a, t) + "", c.has(h) ? o[a] = l : c.set(h, l));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (l = c.get(h)) ? (r[a] = l, l.__data__ = i[a], c.delete(h)) : n[a] = new zn(e, i[a]);
  for (a = 0; a < u; ++a)
    (l = t[a]) && c.get(d[a]) === l && (o[a] = l);
}
function Lp(e) {
  return e.__data__;
}
function zp(e, t) {
  if (!arguments.length) return Array.from(this, Lp);
  var n = t ? Ap : $p, r = this._parents, o = this._groups;
  typeof e != "function" && (e = Ip(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var u = r[c], f = o[c], d = f.length, h = Tp(e.call(u, u && u.__data__, c, r)), p = h.length, v = a[c] = new Array(p), b = s[c] = new Array(p), y = l[c] = new Array(d);
    n(u, f, v, b, y, h, t);
    for (var _ = 0, g = 0, w, E; _ < p; ++_)
      if (w = v[_]) {
        for (_ >= g && (g = _ + 1); !(E = b[g]) && ++g < p; ) ;
        w._next = E || null;
      }
  }
  return s = new Ee(s, r), s._enter = a, s._exit = l, s;
}
function Tp(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Op() {
  return new Ee(this._exit || this._groups.map(Ws), this._parents);
}
function Pp(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function Dp(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], u = r[l], f = c.length, d = a[l] = new Array(f), h, p = 0; p < f; ++p)
      (h = c[p] || u[p]) && (d[p] = h);
  for (; l < o; ++l)
    a[l] = n[l];
  return new Ee(a, this._parents);
}
function Rp() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function Hp(e) {
  e || (e = Vp);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, u = 0; u < a; ++u)
      (c = s[u]) && (l[u] = c);
    l.sort(t);
  }
  return new Ee(o, this._parents).order();
}
function Vp(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Bp() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Fp() {
  return Array.from(this);
}
function Wp() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function Yp() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function jp() {
  return !this.node();
}
function Gp(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function Xp(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Up(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function qp(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Kp(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Zp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Qp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Jp(e, t) {
  var n = Kn(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Up : Xp : typeof t == "function" ? n.local ? Qp : Zp : n.local ? Kp : qp)(n, t));
}
function Ys(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function eg(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function tg(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function ng(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function rg(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? eg : typeof t == "function" ? ng : tg)(e, t, n ?? "")) : St(this.node(), e);
}
function St(e, t) {
  return e.style.getPropertyValue(t) || Ys(e).getComputedStyle(e, null).getPropertyValue(t);
}
function og(e) {
  return function() {
    delete this[e];
  };
}
function ig(e, t) {
  return function() {
    this[e] = t;
  };
}
function sg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function ag(e, t) {
  return arguments.length > 1 ? this.each((t == null ? og : typeof t == "function" ? sg : ig)(e, t)) : this.node()[e];
}
function js(e) {
  return e.trim().split(/^|\s+/);
}
function ao(e) {
  return e.classList || new Gs(e);
}
function Gs(e) {
  this._node = e, this._names = js(e.getAttribute("class") || "");
}
Gs.prototype = {
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
function Xs(e, t) {
  for (var n = ao(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function Us(e, t) {
  for (var n = ao(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function lg(e) {
  return function() {
    Xs(this, e);
  };
}
function cg(e) {
  return function() {
    Us(this, e);
  };
}
function ug(e, t) {
  return function() {
    (t.apply(this, arguments) ? Xs : Us)(this, e);
  };
}
function dg(e, t) {
  var n = js(e + "");
  if (arguments.length < 2) {
    for (var r = ao(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? ug : t ? lg : cg)(n, t));
}
function fg() {
  this.textContent = "";
}
function hg(e) {
  return function() {
    this.textContent = e;
  };
}
function pg(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function gg(e) {
  return arguments.length ? this.each(e == null ? fg : (typeof e == "function" ? pg : hg)(e)) : this.node().textContent;
}
function mg() {
  this.innerHTML = "";
}
function yg(e) {
  return function() {
    this.innerHTML = e;
  };
}
function wg(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function xg(e) {
  return arguments.length ? this.each(e == null ? mg : (typeof e == "function" ? wg : yg)(e)) : this.node().innerHTML;
}
function bg() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function vg() {
  return this.each(bg);
}
function _g() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function kg() {
  return this.each(_g);
}
function Eg(e) {
  var t = typeof e == "function" ? e : Hs(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Sg() {
  return null;
}
function Ng(e, t) {
  var n = typeof e == "function" ? e : Hs(e), r = t == null ? Sg : typeof t == "function" ? t : so(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Cg() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Mg() {
  return this.each(Cg);
}
function Ig() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function $g() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ag(e) {
  return this.select(e ? $g : Ig);
}
function Lg(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function zg(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Tg(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function Og(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function Pg(e, t, n) {
  return function() {
    var r = this.__on, o, i = zg(t);
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
function Dg(e, t, n) {
  var r = Tg(e + ""), o, i = r.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, u; l < c; ++l)
        for (o = 0, u = a[l]; o < i; ++o)
          if ((s = r[o]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (a = t ? Pg : Og, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function qs(e, t, n) {
  var r = Ys(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Rg(e, t) {
  return function() {
    return qs(this, e, t);
  };
}
function Hg(e, t) {
  return function() {
    return qs(this, e, t.apply(this, arguments));
  };
}
function Vg(e, t) {
  return this.each((typeof t == "function" ? Hg : Rg)(e, t));
}
function* Bg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Ks = [null];
function Ee(e, t) {
  this._groups = e, this._parents = t;
}
function tn() {
  return new Ee([[document.documentElement]], Ks);
}
function Fg() {
  return this;
}
Ee.prototype = tn.prototype = {
  constructor: Ee,
  select: pp,
  selectAll: wp,
  selectChild: _p,
  selectChildren: Np,
  filter: Cp,
  data: zp,
  enter: Mp,
  exit: Op,
  join: Pp,
  merge: Dp,
  selection: Fg,
  order: Rp,
  sort: Hp,
  call: Bp,
  nodes: Fp,
  node: Wp,
  size: Yp,
  empty: jp,
  each: Gp,
  attr: Jp,
  style: rg,
  property: ag,
  classed: dg,
  text: gg,
  html: xg,
  raise: vg,
  lower: kg,
  append: Eg,
  insert: Ng,
  remove: Mg,
  clone: Ag,
  datum: Lg,
  on: Dg,
  dispatch: Vg,
  [Symbol.iterator]: Bg
};
function ke(e) {
  return typeof e == "string" ? new Ee([[document.querySelector(e)]], [document.documentElement]) : new Ee([[e]], Ks);
}
function Wg(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Le(e, t) {
  if (e = Wg(e), t === void 0 && (t = e.currentTarget), t) {
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
const Yg = { passive: !1 }, Yt = { capture: !0, passive: !1 };
function xr(e) {
  e.stopImmediatePropagation();
}
function kt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Zs(e) {
  var t = e.document.documentElement, n = ke(e).on("dragstart.drag", kt, Yt);
  "onselectstart" in t ? n.on("selectstart.drag", kt, Yt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Qs(e, t) {
  var n = e.document.documentElement, r = ke(e).on("dragstart.drag", null);
  t && (r.on("click.drag", kt, Yt), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const hn = (e) => () => e;
function Dr(e, {
  sourceEvent: t,
  subject: n,
  target: r,
  identifier: o,
  active: i,
  x: s,
  y: a,
  dx: l,
  dy: c,
  dispatch: u
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
    _: { value: u }
  });
}
Dr.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function jg(e) {
  return !e.ctrlKey && !e.button;
}
function Gg() {
  return this.parentNode;
}
function Xg(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Ug() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Js() {
  var e = jg, t = Gg, n = Xg, r = Ug, o = {}, i = qn("start", "drag", "end"), s = 0, a, l, c, u, f = 0;
  function d(w) {
    w.on("mousedown.drag", h).filter(r).on("touchstart.drag", b).on("touchmove.drag", y, Yg).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(w, E) {
    if (!(u || !e.call(this, w, E))) {
      var k = g(this, t.call(this, w, E), w, E, "mouse");
      k && (ke(w.view).on("mousemove.drag", p, Yt).on("mouseup.drag", v, Yt), Zs(w.view), xr(w), c = !1, a = w.clientX, l = w.clientY, k("start", w));
    }
  }
  function p(w) {
    if (kt(w), !c) {
      var E = w.clientX - a, k = w.clientY - l;
      c = E * E + k * k > f;
    }
    o.mouse("drag", w);
  }
  function v(w) {
    ke(w.view).on("mousemove.drag mouseup.drag", null), Qs(w.view, c), kt(w), o.mouse("end", w);
  }
  function b(w, E) {
    if (e.call(this, w, E)) {
      var k = w.changedTouches, C = t.call(this, w, E), A = k.length, $, H;
      for ($ = 0; $ < A; ++$)
        (H = g(this, C, w, E, k[$].identifier, k[$])) && (xr(w), H("start", w, k[$]));
    }
  }
  function y(w) {
    var E = w.changedTouches, k = E.length, C, A;
    for (C = 0; C < k; ++C)
      (A = o[E[C].identifier]) && (kt(w), A("drag", w, E[C]));
  }
  function _(w) {
    var E = w.changedTouches, k = E.length, C, A;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), C = 0; C < k; ++C)
      (A = o[E[C].identifier]) && (xr(w), A("end", w, E[C]));
  }
  function g(w, E, k, C, A, $) {
    var H = i.copy(), z = Le($ || k, E), V, R, x;
    if ((x = n.call(w, new Dr("beforestart", {
      sourceEvent: k,
      target: d,
      identifier: A,
      active: s,
      x: z[0],
      y: z[1],
      dx: 0,
      dy: 0,
      dispatch: H
    }), C)) != null)
      return V = x.x - z[0] || 0, R = x.y - z[1] || 0, function N(S, I, L) {
        var M = z, T;
        switch (S) {
          case "start":
            o[A] = N, T = s++;
            break;
          case "end":
            delete o[A], --s;
          case "drag":
            z = Le(L || I, E), T = s;
            break;
        }
        H.call(
          S,
          w,
          new Dr(S, {
            sourceEvent: I,
            subject: x,
            target: d,
            identifier: A,
            active: T,
            x: z[0] + V,
            y: z[1] + R,
            dx: z[0] - M[0],
            dy: z[1] - M[1],
            dispatch: H
          }),
          C
        );
      };
  }
  return d.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : hn(!!w), d) : e;
  }, d.container = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : hn(w), d) : t;
  }, d.subject = function(w) {
    return arguments.length ? (n = typeof w == "function" ? w : hn(w), d) : n;
  }, d.touchable = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : hn(!!w), d) : r;
  }, d.on = function() {
    var w = i.on.apply(i, arguments);
    return w === i ? d : w;
  }, d.clickDistance = function(w) {
    return arguments.length ? (f = (w = +w) * w, d) : Math.sqrt(f);
  }, d;
}
function lo(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function ea(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function nn() {
}
var jt = 0.7, Tn = 1 / jt, Et = "\\s*([+-]?\\d+)\\s*", Gt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ye = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", qg = /^#([0-9a-f]{3,8})$/, Kg = new RegExp(`^rgb\\(${Et},${Et},${Et}\\)$`), Zg = new RegExp(`^rgb\\(${Ye},${Ye},${Ye}\\)$`), Qg = new RegExp(`^rgba\\(${Et},${Et},${Et},${Gt}\\)$`), Jg = new RegExp(`^rgba\\(${Ye},${Ye},${Ye},${Gt}\\)$`), em = new RegExp(`^hsl\\(${Gt},${Ye},${Ye}\\)$`), tm = new RegExp(`^hsla\\(${Gt},${Ye},${Ye},${Gt}\\)$`), ti = {
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
lo(nn, ht, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ni,
  // Deprecated! Use color.formatHex.
  formatHex: ni,
  formatHex8: nm,
  formatHsl: rm,
  formatRgb: ri,
  toString: ri
});
function ni() {
  return this.rgb().formatHex();
}
function nm() {
  return this.rgb().formatHex8();
}
function rm() {
  return ta(this).formatHsl();
}
function ri() {
  return this.rgb().formatRgb();
}
function ht(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = qg.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? oi(t) : n === 3 ? new ve(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? pn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? pn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Kg.exec(e)) ? new ve(t[1], t[2], t[3], 1) : (t = Zg.exec(e)) ? new ve(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Qg.exec(e)) ? pn(t[1], t[2], t[3], t[4]) : (t = Jg.exec(e)) ? pn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = em.exec(e)) ? ai(t[1], t[2] / 100, t[3] / 100, 1) : (t = tm.exec(e)) ? ai(t[1], t[2] / 100, t[3] / 100, t[4]) : ti.hasOwnProperty(e) ? oi(ti[e]) : e === "transparent" ? new ve(NaN, NaN, NaN, 0) : null;
}
function oi(e) {
  return new ve(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function pn(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new ve(e, t, n, r);
}
function om(e) {
  return e instanceof nn || (e = ht(e)), e ? (e = e.rgb(), new ve(e.r, e.g, e.b, e.opacity)) : new ve();
}
function Rr(e, t, n, r) {
  return arguments.length === 1 ? om(e) : new ve(e, t, n, r ?? 1);
}
function ve(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
lo(ve, Rr, ea(nn, {
  brighter(e) {
    return e = e == null ? Tn : Math.pow(Tn, e), new ve(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? jt : Math.pow(jt, e), new ve(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ve(ut(this.r), ut(this.g), ut(this.b), On(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ii,
  // Deprecated! Use color.formatHex.
  formatHex: ii,
  formatHex8: im,
  formatRgb: si,
  toString: si
}));
function ii() {
  return `#${ct(this.r)}${ct(this.g)}${ct(this.b)}`;
}
function im() {
  return `#${ct(this.r)}${ct(this.g)}${ct(this.b)}${ct((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function si() {
  const e = On(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${ut(this.r)}, ${ut(this.g)}, ${ut(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function On(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function ut(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function ct(e) {
  return e = ut(e), (e < 16 ? "0" : "") + e.toString(16);
}
function ai(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new ze(e, t, n, r);
}
function ta(e) {
  if (e instanceof ze) return new ze(e.h, e.s, e.l, e.opacity);
  if (e instanceof nn || (e = ht(e)), !e) return new ze();
  if (e instanceof ze) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new ze(s, a, l, e.opacity);
}
function sm(e, t, n, r) {
  return arguments.length === 1 ? ta(e) : new ze(e, t, n, r ?? 1);
}
function ze(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
lo(ze, sm, ea(nn, {
  brighter(e) {
    return e = e == null ? Tn : Math.pow(Tn, e), new ze(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? jt : Math.pow(jt, e), new ze(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new ve(
      br(e >= 240 ? e - 240 : e + 120, o, r),
      br(e, o, r),
      br(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new ze(li(this.h), gn(this.s), gn(this.l), On(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = On(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${li(this.h)}, ${gn(this.s) * 100}%, ${gn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function li(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function gn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function br(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const co = (e) => () => e;
function am(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function lm(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function cm(e) {
  return (e = +e) == 1 ? na : function(t, n) {
    return n - t ? lm(t, n, e) : co(isNaN(t) ? n : t);
  };
}
function na(e, t) {
  var n = t - e;
  return n ? am(e, n) : co(isNaN(e) ? t : e);
}
const Pn = function e(t) {
  var n = cm(t);
  function r(o, i) {
    var s = n((o = Rr(o)).r, (i = Rr(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = na(o.opacity, i.opacity);
    return function(u) {
      return o.r = s(u), o.g = a(u), o.b = l(u), o.opacity = c(u), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function um(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function dm(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function fm(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = Bt(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function hm(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Fe(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function pm(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = Bt(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var Hr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, vr = new RegExp(Hr.source, "g");
function gm(e) {
  return function() {
    return e;
  };
}
function mm(e) {
  return function(t) {
    return e(t) + "";
  };
}
function ra(e, t) {
  var n = Hr.lastIndex = vr.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = Hr.exec(e)) && (o = vr.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Fe(r, o) })), n = vr.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? mm(l[0].x) : gm(t) : (t = l.length, function(c) {
    for (var u = 0, f; u < t; ++u) a[(f = l[u]).i] = f.x(c);
    return a.join("");
  });
}
function Bt(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? co(t) : (n === "number" ? Fe : n === "string" ? (r = ht(t)) ? (t = r, Pn) : ra : t instanceof ht ? Pn : t instanceof Date ? hm : dm(t) ? um : Array.isArray(t) ? fm : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? pm : Fe)(e, t);
}
var ci = 180 / Math.PI, Vr = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function oa(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * ci,
    skewX: Math.atan(l) * ci,
    scaleX: s,
    scaleY: a
  };
}
var mn;
function ym(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Vr : oa(t.a, t.b, t.c, t.d, t.e, t.f);
}
function wm(e) {
  return e == null || (mn || (mn = document.createElementNS("http://www.w3.org/2000/svg", "g")), mn.setAttribute("transform", e), !(e = mn.transform.baseVal.consolidate())) ? Vr : (e = e.matrix, oa(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ia(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, u, f, d, h, p) {
    if (c !== f || u !== d) {
      var v = h.push("translate(", null, t, null, n);
      p.push({ i: v - 4, x: Fe(c, f) }, { i: v - 2, x: Fe(u, d) });
    } else (f || d) && h.push("translate(" + f + t + d + n);
  }
  function s(c, u, f, d) {
    c !== u ? (c - u > 180 ? u += 360 : u - c > 180 && (c += 360), d.push({ i: f.push(o(f) + "rotate(", null, r) - 2, x: Fe(c, u) })) : u && f.push(o(f) + "rotate(" + u + r);
  }
  function a(c, u, f, d) {
    c !== u ? d.push({ i: f.push(o(f) + "skewX(", null, r) - 2, x: Fe(c, u) }) : u && f.push(o(f) + "skewX(" + u + r);
  }
  function l(c, u, f, d, h, p) {
    if (c !== f || u !== d) {
      var v = h.push(o(h) + "scale(", null, ",", null, ")");
      p.push({ i: v - 4, x: Fe(c, f) }, { i: v - 2, x: Fe(u, d) });
    } else (f !== 1 || d !== 1) && h.push(o(h) + "scale(" + f + "," + d + ")");
  }
  return function(c, u) {
    var f = [], d = [];
    return c = e(c), u = e(u), i(c.translateX, c.translateY, u.translateX, u.translateY, f, d), s(c.rotate, u.rotate, f, d), a(c.skewX, u.skewX, f, d), l(c.scaleX, c.scaleY, u.scaleX, u.scaleY, f, d), c = u = null, function(h) {
      for (var p = -1, v = d.length, b; ++p < v; ) f[(b = d[p]).i] = b.x(h);
      return f.join("");
    };
  };
}
var xm = ia(ym, "px, ", "px)", "deg)"), bm = ia(wm, ", ", ")", ")"), vm = 1e-12;
function ui(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function _m(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function km(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const En = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], u = s[0], f = s[1], d = s[2], h = u - a, p = f - l, v = h * h + p * p, b, y;
    if (v < vm)
      y = Math.log(d / c) / t, b = function(C) {
        return [
          a + C * h,
          l + C * p,
          c * Math.exp(t * C * y)
        ];
      };
    else {
      var _ = Math.sqrt(v), g = (d * d - c * c + r * v) / (2 * c * n * _), w = (d * d - c * c - r * v) / (2 * d * n * _), E = Math.log(Math.sqrt(g * g + 1) - g), k = Math.log(Math.sqrt(w * w + 1) - w);
      y = (k - E) / t, b = function(C) {
        var A = C * y, $ = ui(E), H = c / (n * _) * ($ * km(t * A + E) - _m(E));
        return [
          a + H * h,
          l + H * p,
          c * $ / ui(t * A + E)
        ];
      };
    }
    return b.duration = y * 1e3 * t / Math.SQRT2, b;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var Nt = 0, Ht = 0, Pt = 0, sa = 1e3, Dn, Vt, Rn = 0, pt = 0, Zn = 0, Xt = typeof performance == "object" && performance.now ? performance : Date, aa = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function uo() {
  return pt || (aa(Em), pt = Xt.now() + Zn);
}
function Em() {
  pt = 0;
}
function Hn() {
  this._call = this._time = this._next = null;
}
Hn.prototype = la.prototype = {
  constructor: Hn,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? uo() : +n) + (t == null ? 0 : +t), !this._next && Vt !== this && (Vt ? Vt._next = this : Dn = this, Vt = this), this._call = e, this._time = n, Br();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Br());
  }
};
function la(e, t, n) {
  var r = new Hn();
  return r.restart(e, t, n), r;
}
function Sm() {
  uo(), ++Nt;
  for (var e = Dn, t; e; )
    (t = pt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Nt;
}
function di() {
  pt = (Rn = Xt.now()) + Zn, Nt = Ht = 0;
  try {
    Sm();
  } finally {
    Nt = 0, Cm(), pt = 0;
  }
}
function Nm() {
  var e = Xt.now(), t = e - Rn;
  t > sa && (Zn -= t, Rn = e);
}
function Cm() {
  for (var e, t = Dn, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Dn = n);
  Vt = e, Br(r);
}
function Br(e) {
  if (!Nt) {
    Ht && (Ht = clearTimeout(Ht));
    var t = e - pt;
    t > 24 ? (e < 1 / 0 && (Ht = setTimeout(di, e - Xt.now() - Zn)), Pt && (Pt = clearInterval(Pt))) : (Pt || (Rn = Xt.now(), Pt = setInterval(Nm, sa)), Nt = 1, aa(di));
  }
}
function fi(e, t, n) {
  var r = new Hn();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var Mm = qn("start", "end", "cancel", "interrupt"), Im = [], ca = 0, hi = 1, Fr = 2, Sn = 3, pi = 4, Wr = 5, Nn = 6;
function Qn(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  $m(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: Mm,
    tween: Im,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: ca
  });
}
function fo(e, t) {
  var n = He(e, t);
  if (n.state > ca) throw new Error("too late; already scheduled");
  return n;
}
function je(e, t) {
  var n = He(e, t);
  if (n.state > Sn) throw new Error("too late; already running");
  return n;
}
function He(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function $m(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = la(i, 0, n.time);
  function i(c) {
    n.state = hi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var u, f, d, h;
    if (n.state !== hi) return l();
    for (u in r)
      if (h = r[u], h.name === n.name) {
        if (h.state === Sn) return fi(s);
        h.state === pi ? (h.state = Nn, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete r[u]) : +u < t && (h.state = Nn, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete r[u]);
      }
    if (fi(function() {
      n.state === Sn && (n.state = pi, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Fr, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Fr) {
      for (n.state = Sn, o = new Array(d = n.tween.length), u = 0, f = -1; u < d; ++u)
        (h = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = h);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var u = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Wr, 1), f = -1, d = o.length; ++f < d; )
      o[f].call(e, u);
    n.state === Wr && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Nn, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function Cn(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > Fr && r.state < Wr, r.state = Nn, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function Am(e) {
  return this.each(function() {
    Cn(this, e);
  });
}
function Lm(e, t) {
  var n, r;
  return function() {
    var o = je(this, e), i = o.tween;
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
function zm(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = je(this, e), s = i.tween;
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
function Tm(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = He(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Lm : zm)(n, e, t));
}
function ho(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = je(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return He(o, r).value[t];
  };
}
function ua(e, t) {
  var n;
  return (typeof t == "number" ? Fe : t instanceof ht ? Pn : (n = ht(t)) ? (t = n, Pn) : ra)(e, t);
}
function Om(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Pm(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Dm(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function Rm(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function Hm(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function Vm(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function Bm(e, t) {
  var n = Kn(e), r = n === "transform" ? bm : ua;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Vm : Hm)(n, r, ho(this, "attr." + e, t)) : t == null ? (n.local ? Pm : Om)(n) : (n.local ? Rm : Dm)(n, r, t));
}
function Fm(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Wm(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Ym(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && Wm(e, i)), n;
  }
  return o._value = t, o;
}
function jm(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && Fm(e, i)), n;
  }
  return o._value = t, o;
}
function Gm(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Kn(e);
  return this.tween(n, (r.local ? Ym : jm)(r, t));
}
function Xm(e, t) {
  return function() {
    fo(this, e).delay = +t.apply(this, arguments);
  };
}
function Um(e, t) {
  return t = +t, function() {
    fo(this, e).delay = t;
  };
}
function qm(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Xm : Um)(t, e)) : He(this.node(), t).delay;
}
function Km(e, t) {
  return function() {
    je(this, e).duration = +t.apply(this, arguments);
  };
}
function Zm(e, t) {
  return t = +t, function() {
    je(this, e).duration = t;
  };
}
function Qm(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Km : Zm)(t, e)) : He(this.node(), t).duration;
}
function Jm(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    je(this, e).ease = t;
  };
}
function e0(e) {
  var t = this._id;
  return arguments.length ? this.each(Jm(t, e)) : He(this.node(), t).ease;
}
function t0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    je(this, e).ease = n;
  };
}
function n0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(t0(this._id, e));
}
function r0(e) {
  typeof e != "function" && (e = Bs(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ze(r, this._parents, this._name, this._id);
}
function o0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], u = l.length, f = s[a] = new Array(u), d, h = 0; h < u; ++h)
      (d = l[h] || c[h]) && (f[h] = d);
  for (; a < r; ++a)
    s[a] = t[a];
  return new Ze(s, this._parents, this._name, this._id);
}
function i0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function s0(e, t, n) {
  var r, o, i = i0(t) ? fo : je;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function a0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? He(this.node(), n).on.on(e) : this.each(s0(n, e, t));
}
function l0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function c0() {
  return this.on("end.remove", l0(this._id));
}
function u0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = so(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), u, f, d = 0; d < l; ++d)
      (u = a[d]) && (f = e.call(u, u.__data__, d, a)) && ("__data__" in u && (f.__data__ = u.__data__), c[d] = f, Qn(c[d], t, n, d, c, He(u, n)));
  return new Ze(i, this._parents, t, n);
}
function d0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Vs(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, u, f = 0; f < c; ++f)
      if (u = l[f]) {
        for (var d = e.call(u, u.__data__, f, l), h, p = He(u, n), v = 0, b = d.length; v < b; ++v)
          (h = d[v]) && Qn(h, t, n, v, d, p);
        i.push(d), s.push(u);
      }
  return new Ze(i, s, t, n);
}
var f0 = tn.prototype.constructor;
function h0() {
  return new f0(this._groups, this._parents);
}
function p0(e, t) {
  var n, r, o;
  return function() {
    var i = St(this, e), s = (this.style.removeProperty(e), St(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function da(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function g0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = St(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function m0(e, t, n) {
  var r, o, i;
  return function() {
    var s = St(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), St(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function y0(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = je(this, e), c = l.on, u = l.value[i] == null ? a || (a = da(t)) : void 0;
    (c !== n || o !== u) && (r = (n = c).copy()).on(s, o = u), l.on = r;
  };
}
function w0(e, t, n) {
  var r = (e += "") == "transform" ? xm : ua;
  return t == null ? this.styleTween(e, p0(e, r)).on("end.style." + e, da(e)) : typeof t == "function" ? this.styleTween(e, m0(e, r, ho(this, "style." + e, t))).each(y0(this._id, e)) : this.styleTween(e, g0(e, r, t), n).on("end.style." + e, null);
}
function x0(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function b0(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && x0(e, s, n)), r;
  }
  return i._value = t, i;
}
function v0(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, b0(e, t, n ?? ""));
}
function _0(e) {
  return function() {
    this.textContent = e;
  };
}
function k0(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function E0(e) {
  return this.tween("text", typeof e == "function" ? k0(ho(this, "text", e)) : _0(e == null ? "" : e + ""));
}
function S0(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function N0(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && S0(o)), t;
  }
  return r._value = e, r;
}
function C0(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, N0(e));
}
function M0() {
  for (var e = this._name, t = this._id, n = fa(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var u = He(l, t);
        Qn(l, e, n, c, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new Ze(r, this._parents, e, n);
}
function I0() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = je(this, r), u = c.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var $0 = 0;
function Ze(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function fa() {
  return ++$0;
}
var Xe = tn.prototype;
Ze.prototype = {
  constructor: Ze,
  select: u0,
  selectAll: d0,
  selectChild: Xe.selectChild,
  selectChildren: Xe.selectChildren,
  filter: r0,
  merge: o0,
  selection: h0,
  transition: M0,
  call: Xe.call,
  nodes: Xe.nodes,
  node: Xe.node,
  size: Xe.size,
  empty: Xe.empty,
  each: Xe.each,
  on: a0,
  attr: Bm,
  attrTween: Gm,
  style: w0,
  styleTween: v0,
  text: E0,
  textTween: C0,
  remove: c0,
  tween: Tm,
  delay: qm,
  duration: Qm,
  ease: e0,
  easeVarying: n0,
  end: I0,
  [Symbol.iterator]: Xe[Symbol.iterator]
};
function A0(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var L0 = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: A0
};
function z0(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function T0(e) {
  var t, n;
  e instanceof Ze ? (t = e._id, e = e._name) : (t = fa(), (n = L0).time = uo(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Qn(l, e, t, c, s, n || z0(l, t));
  return new Ze(r, this._parents, e, t);
}
tn.prototype.interrupt = Am;
tn.prototype.transition = T0;
const yn = (e) => () => e;
function O0(e, {
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
function Ke(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Ke.prototype = {
  constructor: Ke,
  scale: function(e) {
    return e === 1 ? this : new Ke(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Ke(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Jn = new Ke(1, 0, 0);
ha.prototype = Ke.prototype;
function ha(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Jn;
  return e.__zoom;
}
function _r(e) {
  e.stopImmediatePropagation();
}
function Dt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function P0(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function D0() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function gi() {
  return this.__zoom || Jn;
}
function R0(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function H0() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function V0(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function pa() {
  var e = P0, t = D0, n = V0, r = R0, o = H0, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = En, c = qn("start", "zoom", "end"), u, f, d, h = 500, p = 150, v = 0, b = 10;
  function y(x) {
    x.property("__zoom", gi).on("wheel.zoom", A, { passive: !1 }).on("mousedown.zoom", $).on("dblclick.zoom", H).filter(o).on("touchstart.zoom", z).on("touchmove.zoom", V).on("touchend.zoom touchcancel.zoom", R).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(x, N, S, I) {
    var L = x.selection ? x.selection() : x;
    L.property("__zoom", gi), x !== L ? E(x, N, S, I) : L.interrupt().each(function() {
      k(this, arguments).event(I).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, y.scaleBy = function(x, N, S, I) {
    y.scaleTo(x, function() {
      var L = this.__zoom.k, M = typeof N == "function" ? N.apply(this, arguments) : N;
      return L * M;
    }, S, I);
  }, y.scaleTo = function(x, N, S, I) {
    y.transform(x, function() {
      var L = t.apply(this, arguments), M = this.__zoom, T = S == null ? w(L) : typeof S == "function" ? S.apply(this, arguments) : S, O = M.invert(T), B = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(g(_(M, B), T, O), L, s);
    }, S, I);
  }, y.translateBy = function(x, N, S, I) {
    y.transform(x, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof S == "function" ? S.apply(this, arguments) : S
      ), t.apply(this, arguments), s);
    }, null, I);
  }, y.translateTo = function(x, N, S, I, L) {
    y.transform(x, function() {
      var M = t.apply(this, arguments), T = this.__zoom, O = I == null ? w(M) : typeof I == "function" ? I.apply(this, arguments) : I;
      return n(Jn.translate(O[0], O[1]).scale(T.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof S == "function" ? -S.apply(this, arguments) : -S
      ), M, s);
    }, I, L);
  };
  function _(x, N) {
    return N = Math.max(i[0], Math.min(i[1], N)), N === x.k ? x : new Ke(N, x.x, x.y);
  }
  function g(x, N, S) {
    var I = N[0] - S[0] * x.k, L = N[1] - S[1] * x.k;
    return I === x.x && L === x.y ? x : new Ke(x.k, I, L);
  }
  function w(x) {
    return [(+x[0][0] + +x[1][0]) / 2, (+x[0][1] + +x[1][1]) / 2];
  }
  function E(x, N, S, I) {
    x.on("start.zoom", function() {
      k(this, arguments).event(I).start();
    }).on("interrupt.zoom end.zoom", function() {
      k(this, arguments).event(I).end();
    }).tween("zoom", function() {
      var L = this, M = arguments, T = k(L, M).event(I), O = t.apply(L, M), B = S == null ? w(O) : typeof S == "function" ? S.apply(L, M) : S, j = Math.max(O[1][0] - O[0][0], O[1][1] - O[0][1]), Y = L.__zoom, Q = typeof N == "function" ? N.apply(L, M) : N, U = l(Y.invert(B).concat(j / Y.k), Q.invert(B).concat(j / Q.k));
      return function(X) {
        if (X === 1) X = Q;
        else {
          var P = U(X), W = j / P[2];
          X = new Ke(W, B[0] - P[0] * W, B[1] - P[1] * W);
        }
        T.zoom(null, X);
      };
    });
  }
  function k(x, N, S) {
    return !S && x.__zooming || new C(x, N);
  }
  function C(x, N) {
    this.that = x, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(x, N), this.taps = 0;
  }
  C.prototype = {
    event: function(x) {
      return x && (this.sourceEvent = x), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(x, N) {
      return this.mouse && x !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && x !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && x !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(x) {
      var N = ke(this.that).datum();
      c.call(
        x,
        this.that,
        new O0(x, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: c
        }),
        N
      );
    }
  };
  function A(x, ...N) {
    if (!e.apply(this, arguments)) return;
    var S = k(this, N).event(x), I = this.__zoom, L = Math.max(i[0], Math.min(i[1], I.k * Math.pow(2, r.apply(this, arguments)))), M = Le(x);
    if (S.wheel)
      (S.mouse[0][0] !== M[0] || S.mouse[0][1] !== M[1]) && (S.mouse[1] = I.invert(S.mouse[0] = M)), clearTimeout(S.wheel);
    else {
      if (I.k === L) return;
      S.mouse = [M, I.invert(M)], Cn(this), S.start();
    }
    Dt(x), S.wheel = setTimeout(T, p), S.zoom("mouse", n(g(_(I, L), S.mouse[0], S.mouse[1]), S.extent, s));
    function T() {
      S.wheel = null, S.end();
    }
  }
  function $(x, ...N) {
    if (d || !e.apply(this, arguments)) return;
    var S = x.currentTarget, I = k(this, N, !0).event(x), L = ke(x.view).on("mousemove.zoom", B, !0).on("mouseup.zoom", j, !0), M = Le(x, S), T = x.clientX, O = x.clientY;
    Zs(x.view), _r(x), I.mouse = [M, this.__zoom.invert(M)], Cn(this), I.start();
    function B(Y) {
      if (Dt(Y), !I.moved) {
        var Q = Y.clientX - T, U = Y.clientY - O;
        I.moved = Q * Q + U * U > v;
      }
      I.event(Y).zoom("mouse", n(g(I.that.__zoom, I.mouse[0] = Le(Y, S), I.mouse[1]), I.extent, s));
    }
    function j(Y) {
      L.on("mousemove.zoom mouseup.zoom", null), Qs(Y.view, I.moved), Dt(Y), I.event(Y).end();
    }
  }
  function H(x, ...N) {
    if (e.apply(this, arguments)) {
      var S = this.__zoom, I = Le(x.changedTouches ? x.changedTouches[0] : x, this), L = S.invert(I), M = S.k * (x.shiftKey ? 0.5 : 2), T = n(g(_(S, M), I, L), t.apply(this, N), s);
      Dt(x), a > 0 ? ke(this).transition().duration(a).call(E, T, I, x) : ke(this).call(y.transform, T, I, x);
    }
  }
  function z(x, ...N) {
    if (e.apply(this, arguments)) {
      var S = x.touches, I = S.length, L = k(this, N, x.changedTouches.length === I).event(x), M, T, O, B;
      for (_r(x), T = 0; T < I; ++T)
        O = S[T], B = Le(O, this), B = [B, this.__zoom.invert(B), O.identifier], L.touch0 ? !L.touch1 && L.touch0[2] !== B[2] && (L.touch1 = B, L.taps = 0) : (L.touch0 = B, M = !0, L.taps = 1 + !!u);
      u && (u = clearTimeout(u)), M && (L.taps < 2 && (f = B[0], u = setTimeout(function() {
        u = null;
      }, h)), Cn(this), L.start());
    }
  }
  function V(x, ...N) {
    if (this.__zooming) {
      var S = k(this, N).event(x), I = x.changedTouches, L = I.length, M, T, O, B;
      for (Dt(x), M = 0; M < L; ++M)
        T = I[M], O = Le(T, this), S.touch0 && S.touch0[2] === T.identifier ? S.touch0[0] = O : S.touch1 && S.touch1[2] === T.identifier && (S.touch1[0] = O);
      if (T = S.that.__zoom, S.touch1) {
        var j = S.touch0[0], Y = S.touch0[1], Q = S.touch1[0], U = S.touch1[1], X = (X = Q[0] - j[0]) * X + (X = Q[1] - j[1]) * X, P = (P = U[0] - Y[0]) * P + (P = U[1] - Y[1]) * P;
        T = _(T, Math.sqrt(X / P)), O = [(j[0] + Q[0]) / 2, (j[1] + Q[1]) / 2], B = [(Y[0] + U[0]) / 2, (Y[1] + U[1]) / 2];
      } else if (S.touch0) O = S.touch0[0], B = S.touch0[1];
      else return;
      S.zoom("touch", n(g(T, O, B), S.extent, s));
    }
  }
  function R(x, ...N) {
    if (this.__zooming) {
      var S = k(this, N).event(x), I = x.changedTouches, L = I.length, M, T;
      for (_r(x), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, h), M = 0; M < L; ++M)
        T = I[M], S.touch0 && S.touch0[2] === T.identifier ? delete S.touch0 : S.touch1 && S.touch1[2] === T.identifier && delete S.touch1;
      if (S.touch1 && !S.touch0 && (S.touch0 = S.touch1, delete S.touch1), S.touch0) S.touch0[1] = this.__zoom.invert(S.touch0[0]);
      else if (S.end(), S.taps === 2 && (T = Le(T, this), Math.hypot(f[0] - T[0], f[1] - T[1]) < b)) {
        var O = ke(this).on("dblclick.zoom");
        O && O.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : yn(+x), y) : r;
  }, y.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : yn(!!x), y) : e;
  }, y.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : yn(!!x), y) : o;
  }, y.extent = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : yn([[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]]), y) : t;
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
    return arguments.length ? (v = (x = +x) * x, y) : Math.sqrt(v);
  }, y.tapDistance = function(x) {
    return arguments.length ? (b = +x, y) : b;
  }, y;
}
const De = {
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
}, Ut = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], ga = ["Enter", " ", "Escape"], ma = {
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
var Ct;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Ct || (Ct = {}));
var dt;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(dt || (dt = {}));
var qt;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(qt || (qt = {}));
const ya = {
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
var nt;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(nt || (nt = {}));
var Mt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Mt || (Mt = {}));
var G;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(G || (G = {}));
const mi = {
  [G.Left]: G.Right,
  [G.Right]: G.Left,
  [G.Top]: G.Bottom,
  [G.Bottom]: G.Top
}, wa = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, B0 = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), po = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), rn = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ve(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, F0 = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : po(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, er(o, Vn(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? tr(r) : { x: 0, y: 0, width: 0, height: 0 };
}, on = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = er(n, Vn(o)), r = !0);
  }), r ? tr(n) : { x: 0, y: 0, width: 0, height: 0 };
}, go = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, u = t.height / o, f = [];
  for (const d of e.values()) {
    const { measured: h, selectable: p = !0, hidden: v = !1 } = d;
    if (s && !p || v)
      continue;
    const b = h.width ?? d.width ?? d.initialWidth ?? 0, y = h.height ?? d.height ?? d.initialHeight ?? 0, { x: _, y: g } = d.internals.positionAbsolute, w = _a(a, l, c, u, _, g, b, y), E = b * y, k = i && w > 0;
    (!d.internals.handleBounds || k || w >= E || d.dragging) && f.push(d);
  }
  return f;
}, W0 = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function Y0(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = Ve(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function j0({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Y0(e, s), l = on(a), c = nr(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function xa({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", De.error005());
    else {
      const { width: h, height: p } = Ve(a);
      h && p && (f = [
        [l, c],
        [l + h, c + p]
      ]);
    }
  else a && mt(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const d = mt(f) ? gt(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", De.error015())), {
    position: {
      x: d.x - l + (s.measured.width ?? 0) * u[0],
      y: d.y - c + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: d
  };
}
async function G0({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((d) => d.id)), s = [];
  for (const d of n) {
    if (d.deletable === !1)
      continue;
    const h = i.has(d.id), p = !h && d.parentId && s.find((v) => v.id === d.parentId);
    (h || p) && s.push(d);
  }
  const a = new Set(t.map((d) => d.id)), l = r.filter((d) => d.deletable !== !1), u = W0(s, l);
  for (const d of l)
    a.has(d.id) && !u.find((p) => p.id === d.id) && u.push(d);
  if (!o)
    return {
      edges: u,
      nodes: s
    };
  const f = await o({
    nodes: s,
    edges: u
  });
  return typeof f == "boolean" ? f ? { edges: u, nodes: s } : { edges: [], nodes: [] } : f;
}
const It = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), gt = (e = { x: 0, y: 0 }, t, n) => ({
  x: It(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: It(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function ba(e, t, n) {
  const { width: r, height: o } = Ve(n), { x: i, y: s } = n.internals.positionAbsolute;
  return gt(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const yi = (e, t, n) => e < t ? It(Math.abs(e - t), 1, t) / t : e > n ? -It(Math.abs(e - n), 1, t) / t : 0, mo = (e, t, n = 15, r = 40) => {
  const o = yi(e.x, r, t.width - r) * n, i = yi(e.y, r, t.height - r) * n;
  return [o, i];
}, er = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), Yr = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), tr = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), Kt = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = po(e) ? e.internals.positionAbsolute : rn(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Vn = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = po(e) ? e.internals.positionAbsolute : rn(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, va = (e, t) => tr(er(Yr(e), Yr(t))), _a = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Bn = (e, t) => _a(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), wi = (e) => Te(e.width) && Te(e.height) && Te(e.x) && Te(e.y), Te = (e) => !isNaN(e) && isFinite(e), ka = (e, t) => (n, r) => {
}, sn = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), an = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? sn(a, s) : a;
}, $t = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function vt(e, t) {
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
function X0(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = vt(e, n), o = vt(e, t);
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
    const r = vt(e.top ?? e.y ?? 0, n), o = vt(e.bottom ?? e.y ?? 0, n), i = vt(e.left ?? e.x ?? 0, t), s = vt(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function U0(e, t, n, r, o, i) {
  const { x: s, y: a } = $t(e, [t, n, r]), { x: l, y: c } = $t({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), u = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(f)
  };
}
const nr = (e, t, n, r, o, i) => {
  const s = X0(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), u = It(c, r, o), f = e.x + e.width / 2, d = e.y + e.height / 2, h = t / 2 - f * u, p = n / 2 - d * u, v = U0(e, h, p, u, t, n), b = {
    left: Math.min(v.left - s.left, 0),
    top: Math.min(v.top - s.top, 0),
    right: Math.min(v.right - s.right, 0),
    bottom: Math.min(v.bottom - s.bottom, 0)
  };
  return {
    x: h - b.left + b.right,
    y: p - b.top + b.bottom,
    zoom: u
  };
}, Zt = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function mt(e) {
  return e != null && e !== "parent";
}
function Ve(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function Ea(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function Sa(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function xi(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function q0() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function K0(e) {
  return { ...ma, ...e || {} };
}
function Na(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function Ft(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Oe(e), a = an({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? sn(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const yo = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Ca = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, Z0 = ["INPUT", "SELECT", "TEXTAREA"];
function Ma(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : Z0.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const Ia = (e) => "clientX" in e, Oe = (e, t) => {
  var i, s;
  const n = Ia(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, bi = (e, t, n, r, o) => {
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
      ...yo(s)
    };
  });
};
function $a({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, u = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, u, f];
}
function wn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function vi({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case G.Left:
      return [t - wn(t - r, i), n];
    case G.Right:
      return [t + wn(r - t, i), n];
    case G.Top:
      return [t, n - wn(n - o, i)];
    case G.Bottom:
      return [t, n + wn(o - n, i)];
  }
}
function Aa({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top, curvature: s = 0.25 }) {
  const [a, l] = vi({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, u] = vi({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, d, h, p] = $a({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: o,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: c,
    targetControlY: u
  });
  return [
    `M${e},${t} C${a},${l} ${c},${u} ${r},${o}`,
    f,
    d,
    h,
    p
  ];
}
function La({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function Q0({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function J0({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = er(Vn(e), Vn(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return Bn(s, tr(i)) > 0;
}
const ey = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, ty = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), ny = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", De.error006()), t;
  const r = n.getEdgeId || ey;
  let o;
  return wa(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, ty(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function za({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = La({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const _i = {
  [G.Left]: { x: -1, y: 0 },
  [G.Right]: { x: 1, y: 0 },
  [G.Top]: { x: 0, y: -1 },
  [G.Bottom]: { x: 0, y: 1 }
}, ry = ({ source: e, sourcePosition: t = G.Bottom, target: n }) => t === G.Left || t === G.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, ki = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function oy({ source: e, sourcePosition: t = G.Bottom, target: n, targetPosition: r = G.Top, center: o, offset: i, stepPosition: s }) {
  const a = _i[t], l = _i[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + l.x * i, y: n.y + l.y * i }, f = ry({
    source: c,
    sourcePosition: t,
    target: u
  }), d = f.x !== 0 ? "x" : "y", h = f[d];
  let p = [], v, b;
  const y = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , g, w] = La({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[d] * l[d] === -1) {
    d === "x" ? (v = o.x ?? c.x + (u.x - c.x) * s, b = o.y ?? (c.y + u.y) / 2) : (v = o.x ?? (c.x + u.x) / 2, b = o.y ?? c.y + (u.y - c.y) * s);
    const A = [
      { x: v, y: c.y },
      { x: v, y: u.y }
    ], $ = [
      { x: c.x, y: b },
      { x: u.x, y: b }
    ];
    a[d] === h ? p = d === "x" ? A : $ : p = d === "x" ? $ : A;
  } else {
    const A = [{ x: c.x, y: u.y }], $ = [{ x: u.x, y: c.y }];
    if (d === "x" ? p = a.x === h ? $ : A : p = a.y === h ? A : $, t === r) {
      const x = Math.abs(e[d] - n[d]);
      if (x <= i) {
        const N = Math.min(i - 1, i - x);
        a[d] === h ? y[d] = (c[d] > e[d] ? -1 : 1) * N : _[d] = (u[d] > n[d] ? -1 : 1) * N;
      }
    }
    if (t !== r) {
      const x = d === "x" ? "y" : "x", N = a[d] === l[x], S = c[x] > u[x], I = c[x] < u[x];
      (a[d] === 1 && (!N && S || N && I) || a[d] !== 1 && (!N && I || N && S)) && (p = d === "x" ? A : $);
    }
    const H = { x: c.x + y.x, y: c.y + y.y }, z = { x: u.x + _.x, y: u.y + _.y }, V = Math.max(Math.abs(H.x - p[0].x), Math.abs(z.x - p[0].x)), R = Math.max(Math.abs(H.y - p[0].y), Math.abs(z.y - p[0].y));
    V >= R ? (v = (H.x + z.x) / 2, b = p[0].y) : (v = p[0].x, b = (H.y + z.y) / 2);
  }
  const E = { x: c.x + y.x, y: c.y + y.y }, k = { x: u.x + _.x, y: u.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...E.x !== p[0].x || E.y !== p[0].y ? [E] : [],
    ...p,
    ...k.x !== p[p.length - 1].x || k.y !== p[p.length - 1].y ? [k] : [],
    n
  ], v, b, g, w];
}
function iy(e, t, n, r) {
  const o = Math.min(ki(e, t) / 2, ki(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * u}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function jr({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: u = 0.5 }) {
  const [f, d, h, p, v] = oy({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: u
  });
  let b = `M${f[0].x} ${f[0].y}`;
  for (let y = 1; y < f.length - 1; y++)
    b += iy(f[y - 1], f[y], f[y + 1], s);
  return b += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [b, d, h, p, v];
}
function Ei(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function sy(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!Ei(t) || !Ei(n))
    return null;
  const r = t.internals.handleBounds || Si(t.handles), o = n.internals.handleBounds || Si(n.handles), i = Ni((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = Ni(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Ct.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", De.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || G.Bottom, l = (s == null ? void 0 : s.position) || G.Top, c = yt(t, i, a), u = yt(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function Si(e) {
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
function yt(e, t, n = G.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ve(e);
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
function Ni(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Gr(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function ay(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = Gr(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const Ta = 1e3, ly = 10, wo = {
  nodeOrigin: [0, 0],
  nodeExtent: Ut,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, cy = {
  ...wo,
  checkEquality: !0
};
function xo(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function uy(e, t, n) {
  const r = xo(wo, n);
  for (const o of e.values())
    if (o.parentId)
      vo(o, e, t, r);
    else {
      const i = rn(o, r.nodeOrigin), s = mt(o.extent) ? o.extent : r.nodeExtent, a = gt(i, s, Ve(o));
      o.internals.positionAbsolute = a;
    }
}
function dy(e, t) {
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
function bo(e) {
  return e === "manual";
}
function Xr(e, t, n, r = {}) {
  var u, f;
  const o = xo(cy, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !bo(o.zIndexMode) ? Ta : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const d of e) {
    let h = s.get(d.id);
    if (o.checkEquality && d === (h == null ? void 0 : h.internals.userNode))
      t.set(d.id, h);
    else {
      const p = rn(d, o.nodeOrigin), v = mt(d.extent) ? d.extent : o.nodeExtent, b = gt(p, v, Ve(d));
      h = {
        ...o.defaults,
        ...d,
        measured: {
          width: (u = d.measured) == null ? void 0 : u.width,
          height: (f = d.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: b,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: dy(d, h),
          z: Oa(d, a, o.zIndexMode),
          userNode: d
        }
      }, t.set(d.id, h);
    }
    (h.measured === void 0 || h.measured.width === void 0 || h.measured.height === void 0) && !h.hidden && (l = !1), d.parentId && vo(h, t, n, r, i), c || (c = d.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function fy(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function vo(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = xo(wo, r), c = e.parentId, u = t.get(c);
  if (!u) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  fy(e, n), o && !u.parentId && u.internals.rootParentIndex === void 0 && l === "auto" && (u.internals.rootParentIndex = ++o.i, u.internals.z = u.internals.z + o.i * ly), o && u.internals.rootParentIndex !== void 0 && (o.i = u.internals.rootParentIndex);
  const f = i && !bo(l) ? Ta : 0, { x: d, y: h, z: p } = hy(e, u, s, a, f, l), { positionAbsolute: v } = e.internals, b = d !== v.x || h !== v.y;
  (b || p !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: b ? { x: d, y: h } : v,
      z: p
    }
  });
}
function Oa(e, t, n) {
  const r = Te(e.zIndex) ? e.zIndex : 0;
  return bo(n) ? r : r + (e.selected ? t : 0);
}
function hy(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ve(e), c = rn(e, n), u = mt(e.extent) ? gt(c, e.extent, l) : c;
  let f = gt({ x: s + u.x, y: a + u.y }, r, l);
  e.extent === "parent" && (f = ba(f, l, t));
  const d = Oa(e, o, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= d ? h + 1 : d
  };
}
function _o(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? Kt(l), u = va(c, a.rect);
    i.set(a.parentId, { expandedRect: u, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var g;
    const u = l.internals.positionAbsolute, f = Ve(l), d = l.origin ?? r, h = a.x < u.x ? Math.round(Math.abs(u.x - a.x)) : 0, p = a.y < u.y ? Math.round(Math.abs(u.y - a.y)) : 0, v = Math.max(f.width, Math.round(a.width)), b = Math.max(f.height, Math.round(a.height)), y = (v - f.width) * d[0], _ = (b - f.height) * d[1];
    (h > 0 || p > 0 || y || _) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - h + y,
        y: l.position.y - p + _
      }
    }), (g = n.get(c)) == null || g.forEach((w) => {
      e.some((E) => E.id === w.id) || o.push({
        id: w.id,
        type: "position",
        position: {
          x: w.position.x + h,
          y: w.position.y + p
        }
      });
    })), (f.width < a.width || f.height < a.height || h || p) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: v + (h ? d[0] * h - y : 0),
        height: b + (p ? d[1] * p - _ : 0)
      }
    });
  }), o;
}
function py(e, t, n, r, o, i, s) {
  const a = r == null ? void 0 : r.querySelector(".xyflow__viewport");
  let l = !1;
  if (!a)
    return { changes: [], updatedInternals: l };
  const c = [], u = window.getComputedStyle(a), { m22: f } = new window.DOMMatrixReadOnly(u.transform), d = [];
  for (const h of e.values()) {
    const p = t.get(h.id);
    if (!p)
      continue;
    if (p.hidden) {
      t.set(p.id, {
        ...p,
        internals: {
          ...p.internals,
          handleBounds: void 0
        }
      }), l = !0;
      continue;
    }
    const v = yo(h.nodeElement), b = p.measured.width !== v.width || p.measured.height !== v.height;
    if (!!(v.width && v.height && (b || !p.internals.handleBounds || h.force))) {
      const _ = h.nodeElement.getBoundingClientRect(), g = mt(p.extent) ? p.extent : i;
      let { positionAbsolute: w } = p.internals;
      if (p.parentId && p.extent === "parent") {
        const k = t.get(p.parentId);
        k && (w = ba(w, v, k));
      } else g && (w = gt(w, g, v));
      const E = {
        ...p,
        measured: v,
        internals: {
          ...p.internals,
          positionAbsolute: w,
          handleBounds: {
            source: bi("source", h.nodeElement, _, f, p.id),
            target: bi("target", h.nodeElement, _, f, p.id)
          }
        }
      };
      t.set(p.id, E), p.parentId && vo(E, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, b && (c.push({
        id: p.id,
        type: "dimensions",
        dimensions: v
      }), p.expandParent && p.parentId && d.push({
        id: p.id,
        parentId: p.parentId,
        rect: Kt(E, o)
      }));
    }
  }
  if (d.length > 0) {
    const h = _o(d, t, n, o);
    c.push(...h);
  }
  return { changes: c, updatedInternals: l };
}
async function gy({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function Ci(e, t, n, r, o, i) {
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
function Pa(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, u = `${i}-${a}--${o}-${s}`;
    Ci("source", l, u, e, o, s), Ci("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function Da(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Da(n, t) : !1;
}
function Mi(e, t, n) {
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
function my(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !Da(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function kr({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
  var s, a, l;
  const o = [];
  for (const [c, u] of t) {
    const f = (s = n.get(c)) == null ? void 0 : s.internals.userNode;
    f && o.push({
      ...f,
      position: u.position,
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
function yy({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = sn(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function wy({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, u = null, f = !1, d = null, h = !1, p = !1, v = null;
  function b({ noDragClassName: _, handleSelector: g, domNode: w, isSelectable: E, nodeId: k, nodeClickDistance: C = 0 }) {
    d = ke(w);
    function A({ x: V, y: R }) {
      const { nodeLookup: x, nodeExtent: N, snapGrid: S, snapToGrid: I, nodeOrigin: L, onNodeDrag: M, onSelectionDrag: T, onError: O, updateNodePositions: B } = t();
      i = { x: V, y: R };
      let j = !1;
      const Y = a.size > 1, Q = Y && N ? Yr(on(a)) : null, U = Y && I ? yy({
        dragItems: a,
        snapGrid: S,
        x: V,
        y: R
      }) : null;
      for (const [X, P] of a) {
        if (!x.has(X))
          continue;
        let W = { x: V - P.distance.x, y: R - P.distance.y };
        I && (W = U ? {
          x: Math.round(W.x + U.x),
          y: Math.round(W.y + U.y)
        } : sn(W, S));
        let K = null;
        if (Y && N && !P.extent && Q) {
          const { positionAbsolute: J } = P.internals, ee = J.x - Q.x + N[0][0], te = J.x + P.measured.width - Q.x2 + N[1][0], ne = J.y - Q.y + N[0][1], ae = J.y + P.measured.height - Q.y2 + N[1][1];
          K = [
            [ee, ne],
            [te, ae]
          ];
        }
        const { position: Z, positionAbsolute: q } = xa({
          nodeId: X,
          nextPosition: W,
          nodeLookup: x,
          nodeExtent: K || N,
          nodeOrigin: L,
          onError: O
        });
        j = j || P.position.x !== Z.x || P.position.y !== Z.y, P.position = Z, P.internals.positionAbsolute = q;
      }
      if (p = p || j, !!j && (B(a, !0), v && (r || M || !k && T))) {
        const [X, P] = kr({
          nodeId: k,
          dragItems: a,
          nodeLookup: x
        });
        r == null || r(v, a, X, P), M == null || M(v, X, P), k || T == null || T(v, P);
      }
    }
    async function $() {
      if (!u)
        return;
      const { transform: V, panBy: R, autoPanSpeed: x, autoPanOnNodeDrag: N } = t();
      if (!N) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [S, I] = mo(c, u, x);
      (S !== 0 || I !== 0) && (i.x = (i.x ?? 0) - S / V[2], i.y = (i.y ?? 0) - I / V[2], await R({ x: S, y: I }) && A(i)), s = requestAnimationFrame($);
    }
    function H(V) {
      var Y;
      const { nodeLookup: R, multiSelectionActive: x, nodesDraggable: N, transform: S, snapGrid: I, snapToGrid: L, selectNodesOnDrag: M, onNodeDragStart: T, onSelectionDragStart: O, unselectNodesAndEdges: B } = t();
      f = !0, (!M || !E) && !x && k && ((Y = R.get(k)) != null && Y.selected || B()), E && M && k && (e == null || e(k));
      const j = Ft(V.sourceEvent, { transform: S, snapGrid: I, snapToGrid: L, containerBounds: u });
      if (i = j, a = my(R, N, j, k), a.size > 0 && (n || T || !k && O)) {
        const [Q, U] = kr({
          nodeId: k,
          dragItems: a,
          nodeLookup: R
        });
        n == null || n(V.sourceEvent, a, Q, U), T == null || T(V.sourceEvent, Q, U), k || O == null || O(V.sourceEvent, U);
      }
    }
    const z = Js().clickDistance(C).on("start", (V) => {
      const { domNode: R, nodeDragThreshold: x, transform: N, snapGrid: S, snapToGrid: I } = t();
      u = (R == null ? void 0 : R.getBoundingClientRect()) || null, h = !1, p = !1, v = V.sourceEvent, x === 0 && H(V), i = Ft(V.sourceEvent, { transform: N, snapGrid: S, snapToGrid: I, containerBounds: u }), c = Oe(V.sourceEvent, u);
    }).on("drag", (V) => {
      const { autoPanOnNodeDrag: R, transform: x, snapGrid: N, snapToGrid: S, nodeDragThreshold: I, nodeLookup: L } = t(), M = Ft(V.sourceEvent, { transform: x, snapGrid: N, snapToGrid: S, containerBounds: u });
      if (v = V.sourceEvent, (V.sourceEvent.type === "touchmove" && V.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      k && !L.has(k)) && (h = !0), !h) {
        if (!l && R && f && (l = !0, $()), !f) {
          const T = Oe(V.sourceEvent, u), O = T.x - c.x, B = T.y - c.y;
          Math.sqrt(O * O + B * B) > I && H(V);
        }
        (i.x !== M.xSnapped || i.y !== M.ySnapped) && a && f && (c = Oe(V.sourceEvent, u), A(M));
      }
    }).on("end", (V) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: R, updateNodePositions: x, onNodeDragStop: N, onSelectionDragStop: S } = t();
        if (p && (x(a, !1), p = !1), o || N || !k && S) {
          const [I, L] = kr({
            nodeId: k,
            dragItems: a,
            nodeLookup: R,
            dragging: !1
          });
          o == null || o(V.sourceEvent, a, I, L), N == null || N(V.sourceEvent, I, L), k || S == null || S(V.sourceEvent, L);
        }
      }
    }).filter((V) => {
      const R = V.target;
      return !V.button && (!_ || !Mi(R, `.${_}`, w)) && (!g || Mi(R, g, w));
    });
    d.call(z);
  }
  function y() {
    d == null || d.on(".drag", null);
  }
  return {
    update: b,
    destroy: y
  };
}
function xy(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Bn(o, Kt(i)) > 0 && r.push(i);
  return r;
}
const by = 250;
function vy(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = xy(e, n, t + by);
  for (const c of s) {
    const u = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of u) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: d, y: h } = yt(c, f, f.position, !0), p = Math.sqrt(Math.pow(d - e.x, 2) + Math.pow(h - e.y, 2));
      p > t || (p < i ? (o = [{ ...f, x: d, y: h }], i = p) : p === i && o.push({ ...f, x: d, y: h }));
    }
  }
  if (!o.length)
    return null;
  if (o.length > 1) {
    const c = r.type === "source" ? "target" : "source";
    return o.find((u) => u.type === c) ?? o[0];
  }
  return o[0];
}
function Ra(e, t, n, r, o, i = !1) {
  var c, u, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((u = s.internals.handleBounds) == null ? void 0 : u.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((d) => d.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...yt(s, l, l.position, !0) } : l;
}
function Ha(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function _y(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Va = () => !0;
function ky(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: u, flowId: f, panBy: d, cancelConnection: h, onConnectStart: p, onConnect: v, onConnectEnd: b, isValidConnection: y = Va, onReconnectEnd: _, updateConnection: g, getTransform: w, getFromHandle: E, autoPanSpeed: k, dragThreshold: C = 1, handleDomNode: A }) {
  const $ = Ca(e.target);
  let H = 0, z;
  const { x: V, y: R } = Oe(e), x = Ha(i, A), N = a == null ? void 0 : a.getBoundingClientRect();
  let S = !1;
  if (!N || !x)
    return;
  const I = Ra(o, x, r, l, t);
  if (!I)
    return;
  let L = Oe(e, N), M = !1, T = null, O = !1, B = null;
  function j() {
    if (!u || !N)
      return;
    const [Z, q] = mo(L, N, k);
    d({ x: Z, y: q }), H = requestAnimationFrame(j);
  }
  const Y = {
    ...I,
    nodeId: o,
    type: x,
    position: I.position
  }, Q = l.get(o);
  let X = {
    inProgress: !0,
    isValid: null,
    from: yt(Q, Y, G.Left, !0),
    fromHandle: Y,
    fromPosition: Y.position,
    fromNode: Q,
    to: L,
    toHandle: null,
    toPosition: mi[Y.position],
    toNode: null,
    pointer: L
  };
  function P() {
    S = !0, g(X), p == null || p(e, { nodeId: o, handleId: r, handleType: x });
  }
  C === 0 && P();
  function W(Z) {
    if (!S) {
      const { x: ae, y: xe } = Oe(Z), Se = ae - V, Ne = xe - R;
      if (!(Se * Se + Ne * Ne > C * C))
        return;
      P();
    }
    if (!E() || !Y) {
      K(Z);
      return;
    }
    const q = w();
    L = Oe(Z, N), z = vy(an(L, q, !1, [1, 1]), n, l, Y), M || (j(), M = !0);
    const J = Ba(Z, {
      handle: z,
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
    B = J.handleDomNode, T = J.connection, O = _y(!!z, J.isValid);
    const ee = l.get(o), te = ee ? yt(ee, Y, G.Left, !0) : X.from, ne = {
      ...X,
      from: te,
      isValid: O,
      to: J.toHandle && O ? $t({ x: J.toHandle.x, y: J.toHandle.y }, q) : L,
      toHandle: J.toHandle,
      toPosition: O && J.toHandle ? J.toHandle.position : mi[Y.position],
      toNode: J.toHandle ? l.get(J.toHandle.nodeId) : null,
      pointer: L
    };
    g(ne), X = ne;
  }
  function K(Z) {
    if (!("touches" in Z && Z.touches.length > 0)) {
      if (S) {
        (z || B) && T && O && (v == null || v(T));
        const { inProgress: q, ...J } = X, ee = {
          ...J,
          toPosition: X.toHandle ? X.toPosition : null
        };
        b == null || b(Z, ee), i && (_ == null || _(Z, ee));
      }
      h(), cancelAnimationFrame(H), M = !1, O = !1, T = null, B = null, $.removeEventListener("mousemove", W), $.removeEventListener("mouseup", K), $.removeEventListener("touchmove", W), $.removeEventListener("touchend", K);
    }
  }
  $.addEventListener("mousemove", W), $.addEventListener("mouseup", K), $.addEventListener("touchmove", W), $.addEventListener("touchend", K);
}
function Ba(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Va, nodeLookup: u }) {
  const f = i === "target", d = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: h, y: p } = Oe(e), v = s.elementFromPoint(h, p), b = v != null && v.classList.contains(`${a}-flow__handle`) ? v : d, y = {
    handleDomNode: b,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (b) {
    const _ = Ha(void 0, b), g = b.getAttribute("data-nodeid"), w = b.getAttribute("data-handleid"), E = b.classList.contains("connectable"), k = b.classList.contains("connectableend");
    if (!g || !_)
      return y;
    const C = {
      source: f ? g : r,
      sourceHandle: f ? w : o,
      target: f ? r : g,
      targetHandle: f ? o : w
    };
    y.connection = C;
    const $ = E && k && (n === Ct.Strict ? f && _ === "source" || !f && _ === "target" : g !== r || w !== o);
    y.isValid = $ && c(C), y.toHandle = Ra(g, _, w, u, n, !0);
  }
  return y;
}
const Ur = {
  onPointerDown: ky,
  isValid: Ba
};
function Ey({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = ke(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: u = 1, pannable: f = !0, zoomable: d = !0, inversePan: h = !1 }) {
    const p = (g) => {
      if (g.sourceEvent.type !== "wheel" || !t)
        return;
      const w = n(), E = g.sourceEvent.ctrlKey && Zt() ? 10 : 1, k = -g.sourceEvent.deltaY * (g.sourceEvent.deltaMode === 1 ? 0.05 : g.sourceEvent.deltaMode ? 1 : 2e-3) * u, C = w[2] * Math.pow(2, k * E);
      t.scaleTo(C);
    };
    let v = [0, 0];
    const b = (g) => {
      (g.sourceEvent.type === "mousedown" || g.sourceEvent.type === "touchstart") && (v = [
        g.sourceEvent.clientX ?? g.sourceEvent.touches[0].clientX,
        g.sourceEvent.clientY ?? g.sourceEvent.touches[0].clientY
      ]);
    }, y = (g) => {
      const w = n();
      if (g.sourceEvent.type !== "mousemove" && g.sourceEvent.type !== "touchmove" || !t)
        return;
      const E = [
        g.sourceEvent.clientX ?? g.sourceEvent.touches[0].clientX,
        g.sourceEvent.clientY ?? g.sourceEvent.touches[0].clientY
      ], k = [E[0] - v[0], E[1] - v[1]];
      v = E;
      const C = r() * Math.max(w[2], Math.log(w[2])) * (h ? -1 : 1), A = {
        x: w[0] - k[0] * C,
        y: w[1] - k[1] * C
      }, $ = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: A.x,
        y: A.y,
        zoom: w[2]
      }, $, a);
    }, _ = pa().on("start", b).on("zoom", f ? y : null).on("zoom.wheel", d ? p : null);
    o.call(_, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: Le
  };
}
const rr = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Er = ({ x: e, y: t, zoom: n }) => Jn.translate(e, t).scale(n), tt = (e, t) => e.target.closest(`.${t}`), Fa = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Sy = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Sr = (e, t = 0, n = Sy, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Wa = (e) => {
  const t = e.ctrlKey && Zt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Ny({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (u) => {
    if (tt(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const b = Le(u), y = Wa(u), _ = f * Math.pow(2, y);
      r.scaleTo(n, _, b, u);
      return;
    }
    const d = u.deltaMode === 1 ? 20 : 1;
    let h = o === dt.Vertical ? 0 : u.deltaX * d, p = o === dt.Horizontal ? 0 : u.deltaY * d;
    !Zt() && u.shiftKey && o !== dt.Vertical && (h = u.deltaY * d, p = 0), r.translateBy(
      n,
      -(h / f) * i,
      -(p / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const v = rr(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(u, v) : (e.isPanScrolling = !0, a == null || a(u, v)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(u, v), e.isPanScrolling = !1;
    }, 150);
  };
}
function Cy({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = tt(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function My({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = rr(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function Iy({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Fa(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, rr(i.transform)));
  };
}
function $y({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Fa(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = rr(s.transform);
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
function Ay({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: u, connectionInProgress: f }) {
  return (d) => {
    var y;
    const h = t || n, p = r && d.ctrlKey, v = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (tt(d, `${u}-flow__node`) || tt(d, `${u}-flow__edge`) || tt(d, `${u}-flow__selection`) || tt(d, `${u}-flow__nodesselection`)))
      return !0;
    if (!o && !h && !i && !s && !r || a || f && !v || tt(d, l) && v || tt(d, c) && (!v || i && v && !t) || !r && d.ctrlKey && v)
      return !1;
    if (!r && d.type === "touchstart" && ((y = d.touches) == null ? void 0 : y.length) > 1)
      return d.preventDefault(), !1;
    if (!h && !i && !p && v || !o && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(o) && !o.includes(d.button) && d.type === "mousedown")
      return !1;
    const b = Array.isArray(o) && o.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || v || e) && b;
  };
}
function Ly({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
  const c = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, u = e.getBoundingClientRect();
  let f = [
    [0, 0],
    [u.width, u.height]
  ];
  const d = typeof ResizeObserver < "u" ? new ResizeObserver((R) => {
    const x = R[0];
    x && (f = [
      [0, 0],
      [x.contentRect.width, x.contentRect.height]
    ]);
  }) : null;
  d == null || d.observe(e);
  const h = pa().extent(() => f).scaleExtent([t, n]).translateExtent(r), p = ke(e).call(h);
  w({
    x: o.x,
    y: o.y,
    zoom: It(o.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], r);
  const v = p.on("wheel.zoom"), b = p.on("dblclick.zoom");
  h.wheelDelta(Wa);
  async function y(R, x) {
    return p ? new Promise((N) => {
      h == null || h.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? Bt : En).transform(Sr(p, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => N(!0)), R);
    }) : !1;
  }
  function _({ noWheelClassName: R, noPanClassName: x, onPaneContextMenu: N, userSelectionActive: S, panOnScroll: I, panOnDrag: L, panOnScrollMode: M, panOnScrollSpeed: T, preventScrolling: O, zoomOnPinch: B, zoomOnScroll: j, zoomOnDoubleClick: Y, panActivationKeyPressed: Q = !1, zoomActivationKeyPressed: U, lib: X, onTransformChange: P, connectionInProgress: W, paneClickDistance: K, selectionOnDrag: Z }) {
    S && !c.isZoomingOrPanning && g();
    const q = I && !U && !S;
    h.clickDistance(Z ? 1 / 0 : !Te(K) || K < 0 ? 0 : K);
    const J = q ? Ny({
      zoomPanValues: c,
      noWheelClassName: R,
      d3Selection: p,
      d3Zoom: h,
      panOnScrollMode: M,
      panOnScrollSpeed: T,
      zoomOnPinch: B,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : Cy({
      noWheelClassName: R,
      preventScrolling: O,
      d3ZoomHandler: v
    });
    p.on("wheel.zoom", J, { passive: !1 });
    const ee = My({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    h.on("start", ee);
    const te = Iy({
      zoomPanValues: c,
      panOnDrag: L,
      onPaneContextMenu: !!N,
      onPanZoom: i,
      onTransformChange: P
    });
    h.on("zoom", te);
    const ne = $y({
      zoomPanValues: c,
      panOnDrag: L,
      panOnScroll: I,
      onPaneContextMenu: N,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    h.on("end", ne);
    const ae = Ay({
      panActivationKeyPressed: Q,
      zoomActivationKeyPressed: U,
      panOnDrag: L,
      zoomOnScroll: j,
      panOnScroll: I,
      zoomOnDoubleClick: Y,
      zoomOnPinch: B,
      userSelectionActive: S,
      noPanClassName: x,
      noWheelClassName: R,
      lib: X,
      connectionInProgress: W
    });
    h.filter(ae), Y ? p.on("dblclick.zoom", b) : p.on("dblclick.zoom", null);
  }
  function g() {
    h.on("zoom", null);
  }
  async function w(R, x, N) {
    const S = Er(R), I = h == null ? void 0 : h.constrain()(S, x, N);
    return I && await y(I), I;
  }
  async function E(R, x) {
    const N = Er(R);
    return await y(N, x), N;
  }
  function k(R) {
    if (p) {
      const x = Er(R), N = p.property("__zoom");
      (N.k !== R.zoom || N.x !== R.x || N.y !== R.y) && (h == null || h.transform(p, x, null, { sync: !0 }));
    }
  }
  function C() {
    const R = p ? ha(p.node()) : { x: 0, y: 0, k: 1 };
    return { x: R.x, y: R.y, zoom: R.k };
  }
  async function A(R, x) {
    return p ? new Promise((N) => {
      h == null || h.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? Bt : En).scaleTo(Sr(p, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => N(!0)), R);
    }) : !1;
  }
  async function $(R, x) {
    return p ? new Promise((N) => {
      h == null || h.interpolate((x == null ? void 0 : x.interpolate) === "linear" ? Bt : En).scaleBy(Sr(p, x == null ? void 0 : x.duration, x == null ? void 0 : x.ease, () => N(!0)), R);
    }) : !1;
  }
  function H(R) {
    h == null || h.scaleExtent(R);
  }
  function z(R) {
    h == null || h.translateExtent(R);
  }
  function V(R) {
    const x = !Te(R) || R < 0 ? 0 : R;
    h == null || h.clickDistance(x);
  }
  return {
    update: _,
    destroy: g,
    setViewport: E,
    setViewportConstrained: w,
    getViewport: C,
    scaleTo: A,
    scaleBy: $,
    setScaleExtent: H,
    setTranslateExtent: z,
    syncViewport: k,
    setClickDistance: V
  };
}
var At;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(At || (At = {}));
function zy({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function Ii(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function Je(e, t) {
  return Math.max(0, t - e);
}
function et(e, t) {
  return Math.max(0, e - t);
}
function xn(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function $i(e, t) {
  return e ? !t : t;
}
function Ty(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: u, isVertical: f } = t, d = u && f, { xSnapped: h, ySnapped: p } = n, { minWidth: v, maxWidth: b, minHeight: y, maxHeight: _ } = r, { x: g, y: w, width: E, height: k, aspectRatio: C } = e;
  let A = Math.floor(u ? h - e.pointerX : 0), $ = Math.floor(f ? p - e.pointerY : 0);
  const H = E + (l ? -A : A), z = k + (c ? -$ : $), V = -i[0] * E, R = -i[1] * k;
  let x = xn(H, v, b), N = xn(z, y, _);
  if (s) {
    let L = 0, M = 0;
    l && A < 0 ? L = Je(g + A + V, s[0][0]) : !l && A > 0 && (L = et(g + H + V, s[1][0])), c && $ < 0 ? M = Je(w + $ + R, s[0][1]) : !c && $ > 0 && (M = et(w + z + R, s[1][1])), x = Math.max(x, L), N = Math.max(N, M);
  }
  if (a) {
    let L = 0, M = 0;
    l && A > 0 ? L = et(g + A, a[0][0]) : !l && A < 0 && (L = Je(g + H, a[1][0])), c && $ > 0 ? M = et(w + $, a[0][1]) : !c && $ < 0 && (M = Je(w + z, a[1][1])), x = Math.max(x, L), N = Math.max(N, M);
  }
  if (o) {
    if (u) {
      const L = xn(H / C, y, _) * C;
      if (x = Math.max(x, L), s) {
        let M = 0;
        !l && !c || l && !c && d ? M = et(w + R + H / C, s[1][1]) * C : M = Je(w + R + (l ? A : -A) / C, s[0][1]) * C, x = Math.max(x, M);
      }
      if (a) {
        let M = 0;
        !l && !c || l && !c && d ? M = Je(w + H / C, a[1][1]) * C : M = et(w + (l ? A : -A) / C, a[0][1]) * C, x = Math.max(x, M);
      }
    }
    if (f) {
      const L = xn(z * C, v, b) / C;
      if (N = Math.max(N, L), s) {
        let M = 0;
        !l && !c || c && !l && d ? M = et(g + z * C + V, s[1][0]) / C : M = Je(g + (c ? $ : -$) * C + V, s[0][0]) / C, N = Math.max(N, M);
      }
      if (a) {
        let M = 0;
        !l && !c || c && !l && d ? M = Je(g + z * C, a[1][0]) / C : M = et(g + (c ? $ : -$) * C, a[0][0]) / C, N = Math.max(N, M);
      }
    }
  }
  $ = $ + ($ < 0 ? N : -N), A = A + (A < 0 ? x : -x), o && (d ? H > z * C ? $ = ($i(l, c) ? -A : A) / C : A = ($i(l, c) ? -$ : $) * C : u ? ($ = A / C, c = l) : (A = $ * C, l = c));
  const S = l ? g + A : g, I = c ? w + $ : w;
  return {
    width: E + (l ? -A : A),
    height: k + (c ? -$ : $),
    x: i[0] * A * (l ? -1 : 1) + S,
    y: i[1] * $ * (c ? -1 : 1) + I
  };
}
const Ya = { width: 0, height: 0, x: 0, y: 0 }, Oy = {
  ...Ya,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function Py(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function Dy({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = ke(e);
  let s = {
    controlDirection: Ii("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: u, keepAspectRatio: f, resizeDirection: d, onResizeStart: h, onResize: p, onResizeEnd: v, shouldResize: b }) {
    let y = { ...Ya }, _ = { ...Oy };
    s = {
      boundaries: u,
      resizeDirection: d,
      keepAspectRatio: f,
      controlDirection: Ii(c)
    };
    let g, w = null, E = [], k, C, A;
    const $ = Js().on("start", (H) => {
      const { nodeLookup: z, transform: V, snapGrid: R, snapToGrid: x, nodeOrigin: N, paneDomNode: S } = n();
      if (g = z.get(t), !g)
        return;
      w = (S == null ? void 0 : S.getBoundingClientRect()) ?? null;
      const { xSnapped: I, ySnapped: L } = Ft(H.sourceEvent, {
        transform: V,
        snapGrid: R,
        snapToGrid: x,
        containerBounds: w
      });
      y = {
        width: g.measured.width ?? 0,
        height: g.measured.height ?? 0,
        x: g.position.x ?? 0,
        y: g.position.y ?? 0
      }, _ = {
        ...y,
        pointerX: I,
        pointerY: L,
        aspectRatio: y.width / y.height
      }, k = void 0, C = mt(g.extent) ? g.extent : void 0, g.parentId && (g.extent === "parent" || g.expandParent) && (k = z.get(g.parentId)), k && g.extent === "parent" && (C = [
        [0, 0],
        [k.measured.width, k.measured.height]
      ]), E = [], A = void 0;
      for (const [M, T] of z)
        if (T.parentId === t && (E.push({
          id: M,
          position: { ...T.position },
          extent: T.extent
        }), T.extent === "parent" || T.expandParent)) {
          const O = Py(T, g, T.origin ?? N);
          A ? A = [
            [Math.min(O[0][0], A[0][0]), Math.min(O[0][1], A[0][1])],
            [Math.max(O[1][0], A[1][0]), Math.max(O[1][1], A[1][1])]
          ] : A = O;
        }
      h == null || h(H, { ...y });
    }).on("drag", (H) => {
      const { transform: z, snapGrid: V, snapToGrid: R, nodeOrigin: x } = n(), N = Ft(H.sourceEvent, {
        transform: z,
        snapGrid: V,
        snapToGrid: R,
        containerBounds: w
      }), S = [];
      if (!g)
        return;
      const { x: I, y: L, width: M, height: T } = y, O = {}, B = g.origin ?? x, { width: j, height: Y, x: Q, y: U } = Ty(_, s.controlDirection, N, s.boundaries, s.keepAspectRatio, B, C, A), X = j !== M, P = Y !== T, W = Q !== I && X, K = U !== L && P;
      if (!W && !K && !X && !P)
        return;
      const Z = {
        prevValues: { ...y },
        startX: _.x,
        startY: _.y,
        childNodes: E.map((te) => ({
          ...te,
          position: { ...te.position }
        }))
      };
      if ((W || K || B[0] === 1 || B[1] === 1) && (O.x = W ? Q : y.x, O.y = K ? U : y.y, y.x = O.x, y.y = O.y, E.length > 0)) {
        const te = Q - I, ne = U - L;
        for (const ae of E)
          ae.position = {
            x: ae.position.x - te + B[0] * (j - M),
            y: ae.position.y - ne + B[1] * (Y - T)
          }, S.push(ae);
      }
      if ((X || P) && (O.width = X && (!s.resizeDirection || s.resizeDirection === "horizontal") ? j : y.width, O.height = P && (!s.resizeDirection || s.resizeDirection === "vertical") ? Y : y.height, y.width = O.width, y.height = O.height), k && g.expandParent) {
        const te = B[0] * (O.width ?? 0);
        O.x && O.x < te && (y.x = te, _.x = _.x - (O.x - te));
        const ne = B[1] * (O.height ?? 0);
        O.y && O.y < ne && (y.y = ne, _.y = _.y - (O.y - ne));
      }
      const q = zy({
        width: y.width,
        prevWidth: M,
        height: y.height,
        prevHeight: T,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), J = { ...y, direction: q };
      if ((b == null ? void 0 : b(H, J)) === !1) {
        y = Z.prevValues, _.x = Z.startX, _.y = Z.startY, E.forEach((te, ne) => {
          te.position = Z.childNodes[ne].position;
        });
        return;
      }
      p == null || p(H, J), r(O, S);
    }).on("end", (H) => {
      v == null || v(H, { ...y }), o == null || o({ ...y });
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
var ja = { exports: {} }, Ga = {}, Xa = { exports: {} }, Ua = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Lt = eo;
function Ry(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Hy = typeof Object.is == "function" ? Object.is : Ry, Vy = Lt.useState, By = Lt.useEffect, Fy = Lt.useLayoutEffect, Wy = Lt.useDebugValue;
function Yy(e, t) {
  var n = t(), r = Vy({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Fy(
    function() {
      o.value = n, o.getSnapshot = t, Nr(o) && i({ inst: o });
    },
    [e, n, t]
  ), By(
    function() {
      return Nr(o) && i({ inst: o }), e(function() {
        Nr(o) && i({ inst: o });
      });
    },
    [e]
  ), Wy(n), n;
}
function Nr(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Hy(e, n);
  } catch {
    return !0;
  }
}
function jy(e, t) {
  return t();
}
var Gy = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? jy : Yy;
Ua.useSyncExternalStore = Lt.useSyncExternalStore !== void 0 ? Lt.useSyncExternalStore : Gy;
Xa.exports = Ua;
var Xy = Xa.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var or = eo, Uy = Xy;
function qy(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Ky = typeof Object.is == "function" ? Object.is : qy, Zy = Uy.useSyncExternalStore, Qy = or.useRef, Jy = or.useEffect, ew = or.useMemo, tw = or.useDebugValue;
Ga.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = Qy(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = ew(
    function() {
      function l(h) {
        if (!c) {
          if (c = !0, u = h, h = r(h), o !== void 0 && s.hasValue) {
            var p = s.value;
            if (o(p, h))
              return f = p;
          }
          return f = h;
        }
        if (p = f, Ky(u, h)) return p;
        var v = r(h);
        return o !== void 0 && o(p, v) ? (u = h, p) : (u = h, f = v);
      }
      var c = !1, u, f, d = n === void 0 ? null : n;
      return [
        function() {
          return l(t());
        },
        d === null ? void 0 : function() {
          return l(d());
        }
      ];
    },
    [t, n, r, o]
  );
  var a = Zy(e, i[0], i[1]);
  return Jy(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), tw(a), a;
};
ja.exports = Ga;
var nw = ja.exports;
const rw = /* @__PURE__ */ fs(nw), ow = {}, Ai = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (u, f) => {
    const d = typeof u == "function" ? u(t) : u;
    if (!Object.is(d, t)) {
      const h = t;
      t = f ?? (typeof d != "object" || d === null) ? d : Object.assign({}, t, d), n.forEach((p) => p(t, h));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (u) => (n.add(u), () => n.delete(u)), destroy: () => {
    (ow ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, iw = (e) => e ? Ai(e) : Ai, { useDebugValue: sw } = eo, { useSyncExternalStoreWithSelector: aw } = rw, lw = (e) => e;
function qa(e, t = lw, n) {
  const r = aw(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return sw(r), r;
}
const Li = (e, t) => {
  const n = iw(e), r = (o, i = t) => qa(n, o, i);
  return Object.assign(r, n), r;
}, cw = (e, t) => e ? Li(e, t) : Li;
function de(e, t) {
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
const ir = Yn(null), uw = ir.Provider, Ka = De.error001("react");
function ie(e, t) {
  const n = zt(ir);
  if (n === null)
    throw new Error(Ka);
  return qa(n, e, t);
}
function ue() {
  const e = zt(ir);
  if (e === null)
    throw new Error(Ka);
  return ce(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const zi = { display: "none" }, dw = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Za = "react-flow__node-desc", Qa = "react-flow__edge-desc", fw = "react-flow__aria-live", hw = (e) => e.ariaLiveMessage, pw = (e) => e.ariaLabelConfig;
function gw({ rfId: e }) {
  const t = ie(hw);
  return m("div", { id: `${fw}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: dw, children: t });
}
function mw({ rfId: e, disableKeyboardA11y: t }) {
  const n = ie(pw);
  return D(_e, { children: [m("div", { id: `${Za}-${e}`, style: zi, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), m("div", { id: `${Qa}-${e}`, style: zi, children: n["edge.a11yDescription.default"] }), !t && m(gw, { rfId: e })] });
}
const wt = us(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return m("div", { className: ge(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
wt.displayName = "Panel";
const Ti = "https://reactflow.dev?utm_source=attribution";
function yw({ proOptions: e, position: t = "bottom-right" }) {
  return le(() => {
  }, []), e != null && e.hideAttribution ? null : m(wt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${Ti}`, children: m("a", { href: Ti, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const ww = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, bn = (e) => e.id;
function xw(e, t) {
  return de(e.selectedNodes.map(bn), t.selectedNodes.map(bn)) && de(e.selectedEdges.map(bn), t.selectedEdges.map(bn));
}
function bw({ onSelectionChange: e }) {
  const t = ue(), { selectedNodes: n, selectedEdges: r } = ie(ww, xw);
  return le(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const vw = (e) => !!e.onSelectionChangeHandlers;
function _w({ onSelectionChange: e }) {
  const t = ie(vw);
  return e || t ? m(bw, { onSelectionChange: e }) : null;
}
const Ja = [0, 0], kw = { x: 0, y: 0, zoom: 1 }, Ew = [
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
], Oi = [...Ew, "rfId"], Sw = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), Pi = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Ut,
  nodeOrigin: Ja,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Nw(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = ie(Sw, de), c = ue();
  le(() => (l(e.defaultNodes, e.defaultEdges), () => {
    u.current = Pi, a();
  }), []);
  const u = re(Pi);
  return le(
    () => {
      for (const f of Oi) {
        const d = e[f], h = u.current[f];
        d !== h && (typeof e[f] > "u" || (f === "nodes" ? t(d) : f === "edges" ? n(d) : f === "minZoom" ? r(d) : f === "maxZoom" ? o(d) : f === "translateExtent" ? i(d) : f === "nodeExtent" ? s(d) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: K0(d) }) : f === "fitView" ? c.setState({ fitViewQueued: d }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: d }) : c.setState({ [f]: d })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    Oi.map((f) => e[f])
  ), null;
}
function Di() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Cw(e) {
  var r;
  const [t, n] = se(e === "system" ? null : e);
  return le(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Di(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = Di()) != null && r.matches ? "dark" : "light";
}
const Ri = typeof document < "u" ? document : null;
function Qt(e = null, t = { target: Ri, actInsideInputWithModifier: !0 }) {
  const [n, r] = se(!1), o = re(!1), i = re(/* @__PURE__ */ new Set([])), [s, a] = ce(() => {
    if (e !== null) {
      const c = (Array.isArray(e) ? e : [e]).filter((f) => typeof f == "string").map((f) => f.replace(/\+/g, `
`).replace(`

`, `
+`).split(`
`)), u = c.reduce((f, d) => f.concat(...d), []);
      return [c, u];
    }
    return [[], []];
  }, [e]);
  return le(() => {
    const l = (t == null ? void 0 : t.target) ?? Ri, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const u = (h) => {
        var b, y;
        if (o.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!o.current || o.current && !c) && Ma(h))
          return !1;
        const v = Vi(h.code, a);
        if (i.current.add(h[v]), Hi(s, i.current, !1)) {
          const _ = ((y = (b = h.composedPath) == null ? void 0 : b.call(h)) == null ? void 0 : y[0]) || h.target, g = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !g) && h.preventDefault(), r(!0);
        }
      }, f = (h) => {
        const p = Vi(h.code, a);
        Hi(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(h[p]), h.key === "Meta" && i.current.clear(), o.current = !1;
      }, d = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", u), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", d), window.addEventListener("contextmenu", d), () => {
        l == null || l.removeEventListener("keydown", u), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", d), window.removeEventListener("contextmenu", d);
      };
    }
  }, [e, r]), n;
}
function Hi(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function Vi(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Mw = () => {
  const e = ue();
  return ce(() => ({
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = nr(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      }, u = n.snapGrid ?? o, f = n.snapToGrid ?? i;
      return an(c, r, f, u);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = $t(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function el(e, t) {
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
      Iw(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function Iw(e, t) {
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
function $w(e, t) {
  return el(e, t);
}
function Aw(e, t) {
  return el(e, t);
}
function lt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function _t(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(lt(i.id, s)));
  }
  return r;
}
function Bi({ items: e = [], lookup: t }) {
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
function Fi(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Lw = ka();
function zw(e, t, n = {}) {
  return ny(e, t, {
    ...n,
    onError: n.onError ?? Lw
  });
}
const Wi = (e) => B0(e), Tw = (e) => wa(e);
function tl(e) {
  return us(e);
}
const nl = typeof window < "u" ? ds : le;
function Yi(e) {
  const [t, n] = se(BigInt(0)), [r] = se(() => Ow(() => n((o) => o + BigInt(1))));
  return nl(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function Ow(e) {
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
const rl = Yn(null);
function Pw({ children: e }) {
  const t = ue(), n = Pe((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: u, onNodesChange: f, nodeLookup: d, fitViewQueued: h, onNodesChangeMiddlewareMap: p } = t.getState();
    let v = l;
    for (const y of a)
      v = typeof y == "function" ? y(v) : y;
    let b = Bi({
      items: v,
      lookup: d
    });
    for (const y of p.values())
      b = y(b);
    u && c(v), b.length > 0 ? f == null || f(b) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: y, nodes: _, setNodes: g } = t.getState();
      y && g(_);
    });
  }, []), r = Yi(n), o = Pe((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: u, onEdgesChange: f, edgeLookup: d } = t.getState();
    let h = l;
    for (const p of a)
      h = typeof p == "function" ? p(h) : p;
    u ? c(h) : f && f(Bi({
      items: h,
      lookup: d
    }));
  }, []), i = Yi(o), s = ce(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return m(rl.Provider, { value: s, children: e });
}
function Dw() {
  const e = zt(rl);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Rw = (e) => !!e.panZoom;
function sr() {
  const e = Mw(), t = ue(), n = Dw(), r = ie(Rw), o = ce(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var y, _;
      const { nodeLookup: d, nodeOrigin: h } = t.getState(), p = Wi(f) ? f : d.get(f.id), v = p.parentId ? Sa(p.position, p.measured, p.parentId, d, h) : p.position, b = {
        ...p,
        position: v,
        width: ((y = p.measured) == null ? void 0 : y.width) ?? p.width,
        height: ((_ = p.measured) == null ? void 0 : _.height) ?? p.height
      };
      return Kt(b);
    }, c = (f, d, h = { replace: !1 }) => {
      s((p) => p.map((v) => {
        if (v.id === f) {
          const b = typeof d == "function" ? d(v) : d;
          return h.replace && Wi(b) ? b : { ...v, ...b };
        }
        return v;
      }));
    }, u = (f, d, h = { replace: !1 }) => {
      a((p) => p.map((v) => {
        if (v.id === f) {
          const b = typeof d == "function" ? d(v) : d;
          return h.replace && Tw(b) ? b : { ...v, ...b };
        }
        return v;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((f) => ({ ...f })),
      getNode: (f) => {
        var d;
        return (d = i(f)) == null ? void 0 : d.internals.userNode;
      },
      getInternalNode: i,
      getEdges: () => {
        const { edges: f = [] } = t.getState();
        return f.map((d) => ({ ...d }));
      },
      getEdge: (f) => t.getState().edgeLookup.get(f),
      setNodes: s,
      setEdges: a,
      addNodes: (f) => {
        const d = Array.isArray(f) ? f : [f];
        n.nodeQueue.push((h) => [...h, ...d]);
      },
      addEdges: (f) => {
        const d = Array.isArray(f) ? f : [f];
        n.edgeQueue.push((h) => [...h, ...d]);
      },
      toObject: () => {
        const { nodes: f = [], edges: d = [], transform: h } = t.getState(), [p, v, b] = h;
        return {
          nodes: f.map((y) => ({ ...y })),
          edges: d.map((y) => ({ ...y })),
          viewport: {
            x: p,
            y: v,
            zoom: b
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: d = [] }) => {
        const { nodes: h, edges: p, onNodesDelete: v, onEdgesDelete: b, triggerNodeChanges: y, triggerEdgeChanges: _, onDelete: g, onBeforeDelete: w } = t.getState(), { nodes: E, edges: k } = await G0({
          nodesToRemove: f,
          edgesToRemove: d,
          nodes: h,
          edges: p,
          onBeforeDelete: w
        }), C = k.length > 0, A = E.length > 0;
        if (C) {
          const $ = k.map(Fi);
          b == null || b(k), _($);
        }
        if (A) {
          const $ = E.map(Fi);
          v == null || v(E), y($);
        }
        return (A || C) && (g == null || g({ nodes: E, edges: k })), { deletedNodes: E, deletedEdges: k };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, d = !0, h) => {
        const p = wi(f), v = p ? f : l(f), b = h !== void 0;
        return v ? (h || t.getState().nodes).filter((y) => {
          const _ = t.getState().nodeLookup.get(y.id);
          if (_ && !p && (y.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const g = Kt(b ? y : _), w = Bn(g, v);
          return d && w > 0 || w >= g.width * g.height || w >= v.width * v.height;
        }) : [];
      },
      isNodeIntersecting: (f, d, h = !0) => {
        const v = wi(f) ? f : l(f);
        if (!v)
          return !1;
        const b = Bn(v, d);
        return h && b > 0 || b >= d.width * d.height || b >= v.width * v.height;
      },
      updateNode: c,
      updateNodeData: (f, d, h = { replace: !1 }) => {
        c(f, (p) => {
          const v = typeof d == "function" ? d(p) : d;
          return h.replace ? { ...p, data: v } : { ...p, data: { ...p.data, ...v } };
        }, h);
      },
      updateEdge: u,
      updateEdgeData: (f, d, h = { replace: !1 }) => {
        u(f, (p) => {
          const v = typeof d == "function" ? d(p) : d;
          return h.replace ? { ...p, data: v } : { ...p, data: { ...p.data, ...v } };
        }, h);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: d, nodeOrigin: h } = t.getState();
        return F0(f, { nodeLookup: d, nodeOrigin: h });
      },
      getHandleConnections: ({ type: f, id: d, nodeId: h }) => {
        var p;
        return Array.from(((p = t.getState().connectionLookup.get(`${h}-${f}${d ? `-${d}` : ""}`)) == null ? void 0 : p.values()) ?? []);
      },
      getNodeConnections: ({ type: f, handleId: d, nodeId: h }) => {
        var p;
        return Array.from(((p = t.getState().connectionLookup.get(`${h}${f ? d ? `-${f}-${d}` : `-${f}` : ""}`)) == null ? void 0 : p.values()) ?? []);
      },
      fitView: async (f) => {
        const d = t.getState().fitViewResolver ?? q0();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: d }), n.nodeQueue.push((h) => [...h]), d.promise;
      }
    };
  }, []);
  return ce(() => ({
    ...o,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const ji = (e) => e.selected, Hw = typeof window < "u" ? window : void 0;
function Vw({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = ue(), { deleteElements: r } = sr(), o = Qt(e, { actInsideInputWithModifier: !1 }), i = Qt(t, { target: Hw });
  le(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(ji), edges: s.filter(ji) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), le(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Bw(e) {
  const t = ue();
  le(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = yo(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", De.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
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
const ar = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Fw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Ww({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = dt.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: u, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: p = !0, children: v, noWheelClassName: b, noPanClassName: y, onViewportChange: _, isControlledViewport: g, paneClickDistance: w, selectionOnDrag: E }) {
  const k = ue(), C = re(null), { userSelectionActive: A, lib: $, connectionInProgress: H } = ie(Fw, de), z = Qt(h), V = re();
  Bw(C);
  const R = Pe((x) => {
    _ == null || _({ x: x[0], y: x[1], zoom: x[2] }), g || k.setState({ transform: x });
  }, [_, g]);
  return le(() => {
    if (C.current) {
      V.current = Ly({
        domNode: C.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: u,
        viewport: c,
        onDraggingChange: (I) => k.setState((L) => L.paneDragging === I ? L : { paneDragging: I }),
        onPanZoomStart: (I, L) => {
          const { onViewportChangeStart: M, onMoveStart: T } = k.getState();
          T == null || T(I, L), M == null || M(L);
        },
        onPanZoom: (I, L) => {
          const { onViewportChange: M, onMove: T } = k.getState();
          T == null || T(I, L), M == null || M(L);
        },
        onPanZoomEnd: (I, L) => {
          const { onViewportChangeEnd: M, onMoveEnd: T } = k.getState();
          T == null || T(I, L), M == null || M(L);
        }
      });
      const { x, y: N, zoom: S } = V.current.getViewport();
      return k.setState({
        panZoom: V.current,
        transform: [x, N, S],
        domNode: C.current.closest(".react-flow")
      }), () => {
        var I;
        (I = V.current) == null || I.destroy();
      };
    }
  }, []), le(() => {
    var x;
    (x = V.current) == null || x.update({
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
      preventScrolling: p,
      noPanClassName: y,
      userSelectionActive: A,
      noWheelClassName: b,
      lib: $,
      onTransformChange: R,
      connectionInProgress: H,
      selectionOnDrag: E,
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
    z,
    p,
    y,
    A,
    b,
    $,
    R,
    H,
    E,
    w
  ]), m("div", { className: "react-flow__renderer", ref: C, style: ar, children: v });
}
const Yw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function jw() {
  const { userSelectionActive: e, userSelectionRect: t } = ie(Yw, de);
  return e && t ? m("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Cr = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Gw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Xw({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = qt.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: u, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: p, children: v }) {
  const b = re(0), y = ue(), { userSelectionActive: _, elementsSelectable: g, dragging: w, panBy: E, autoPanSpeed: k } = ie(Gw, de), C = g && (e || _), A = re(null), $ = re(), H = re(/* @__PURE__ */ new Set()), z = re(/* @__PURE__ */ new Set()), V = re(!1), R = re(!1), x = re({ x: 0, y: 0 }), N = re(!1), S = (P) => {
    if (R.current || V.current || y.getState().connection.inProgress) {
      R.current = !1, V.current = !1;
      return;
    }
    c == null || c(P), y.getState().resetSelectedElements(), y.setState({ nodesSelectionActive: !1 });
  }, I = (P) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      P.preventDefault();
      return;
    }
    u == null || u(P);
  }, L = f ? (P) => f(P) : void 0, M = (P) => {
    R.current && (P.stopPropagation(), R.current = !1);
  }, T = (P) => {
    var ae, xe;
    if (P.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: W, transform: K } = y.getState();
    if ($.current = W == null ? void 0 : W.getBoundingClientRect(), !$.current)
      return;
    const Z = P.target === A.current;
    if (!Z && !!P.target.closest(".nokey") || !e || !(s && Z || t) || P.button !== 0 || !P.isPrimary)
      return;
    (xe = (ae = P.target) == null ? void 0 : ae.setPointerCapture) == null || xe.call(ae, P.pointerId), R.current = !1;
    const { x: ee, y: te } = Oe(P.nativeEvent, $.current), ne = an({ x: ee, y: te }, K);
    y.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ne.x,
        startY: ne.y,
        x: ee,
        y: te
      }
    }), Z || (P.stopPropagation(), P.preventDefault());
  };
  function O(P, W) {
    const { userSelectionRect: K } = y.getState();
    if (!K)
      return;
    const { transform: Z, nodeLookup: q, edgeLookup: J, connectionLookup: ee, triggerNodeChanges: te, triggerEdgeChanges: ne, defaultEdgeOptions: ae } = y.getState(), xe = { x: K.startX, y: K.startY }, { x: Se, y: Ne } = $t(xe, Z), Me = {
      startX: xe.x,
      startY: xe.y,
      x: P < Se ? P : Se,
      y: W < Ne ? W : Ne,
      width: Math.abs(P - Se),
      height: Math.abs(W - Ne)
    }, st = H.current, Ge = z.current;
    H.current = new Set(go(q, Me, Z, n === qt.Partial, !0).map((ye) => ye.id)), z.current = /* @__PURE__ */ new Set();
    const Ie = (ae == null ? void 0 : ae.selectable) ?? !0;
    for (const ye of H.current) {
      const $e = ee.get(ye);
      if ($e)
        for (const { edgeId: Ae } of $e.values()) {
          const Be = J.get(Ae);
          Be && (Be.selectable ?? Ie) && z.current.add(Ae);
        }
    }
    if (!xi(st, H.current)) {
      const ye = _t(q, H.current, !0);
      te(ye);
    }
    if (!xi(Ge, z.current)) {
      const ye = _t(J, z.current);
      ne(ye);
    }
    y.setState({
      userSelectionRect: Me,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function B() {
    if (!o || !$.current)
      return;
    const [P, W] = mo(x.current, $.current, k);
    E({ x: P, y: W }).then((K) => {
      if (!R.current || !K) {
        b.current = requestAnimationFrame(B);
        return;
      }
      const { x: Z, y: q } = x.current;
      O(Z, q), b.current = requestAnimationFrame(B);
    });
  }
  const j = () => {
    cancelAnimationFrame(b.current), b.current = 0, N.current = !1;
  };
  le(() => () => j(), []);
  const Y = (P) => {
    const { userSelectionRect: W, transform: K, resetSelectedElements: Z } = y.getState();
    if (!$.current || !W)
      return;
    const { x: q, y: J } = Oe(P.nativeEvent, $.current);
    x.current = { x: q, y: J };
    const ee = $t({ x: W.startX, y: W.startY }, K);
    if (!R.current) {
      const te = t ? 0 : i;
      if (Math.hypot(q - ee.x, J - ee.y) <= te)
        return;
      Z(), a == null || a(P);
    }
    R.current = !0, N.current || (B(), N.current = !0), O(q, J);
  }, Q = (P) => {
    var W, K;
    if (!C) {
      P.target === A.current && y.getState().connection.inProgress && (V.current = !0);
      return;
    }
    P.button === 0 && ((K = (W = P.target) == null ? void 0 : W.releasePointerCapture) == null || K.call(W, P.pointerId), !_ && P.target === A.current && y.getState().userSelectionRect && (S == null || S(P)), y.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), R.current && (l == null || l(P), y.setState({
      nodesSelectionActive: H.current.size > 0
    })), j());
  }, U = (P) => {
    var W, K;
    (K = (W = P.target) == null ? void 0 : W.releasePointerCapture) == null || K.call(W, P.pointerId), j();
  }, X = r === !0 || Array.isArray(r) && r.includes(0);
  return D("div", { className: ge(["react-flow__pane", { draggable: X, dragging: w, selection: e }]), onClick: C ? void 0 : Cr(S, A), onContextMenu: Cr(I, A), onWheel: Cr(L, A), onPointerEnter: C ? void 0 : d, onPointerMove: C ? Y : h, onPointerUp: Q, onPointerCancel: C ? U : void 0, onPointerDownCapture: C ? T : void 0, onClickCapture: C ? M : void 0, onPointerLeave: p, ref: A, style: ar, children: [v, m(jw, {})] });
}
function qr({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", De.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var u;
    return (u = r == null ? void 0 : r.current) == null ? void 0 : u.blur();
  })) : o([e]);
}
function ol({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = ue(), [l, c] = se(!1), u = re();
  return le(() => {
    if (!t)
      return u.current = wy({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          qr({
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
        (f = u.current) == null || f.destroy(), u.current = void 0;
      };
  }, [t, a, e]), le(() => {
    t || !e.current || !u.current || u.current.update({
      noDragClassName: n,
      handleSelector: r,
      domNode: e.current,
      isSelectable: i,
      nodeId: o,
      nodeClickDistance: s
    });
  }, [n, r, t, i, e, o, s]), l;
}
const Uw = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function il() {
  const e = ue();
  return Pe((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: u } = e.getState(), f = /* @__PURE__ */ new Map(), d = Uw(s), h = o ? i[0] : 5, p = o ? i[1] : 5, v = n.direction.x * h * n.factor, b = n.direction.y * p * n.factor;
    for (const [, y] of c) {
      if (!d(y))
        continue;
      let _ = {
        x: y.internals.positionAbsolute.x + v,
        y: y.internals.positionAbsolute.y + b
      };
      o && (_ = sn(_, i));
      const { position: g, positionAbsolute: w } = xa({
        nodeId: y.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: u,
        onError: a
      });
      y.position = g, y.internals.positionAbsolute = w, f.set(y.id, y);
    }
    l(f);
  }, []);
}
const ko = Yn(null), qw = ko.Provider;
ko.Consumer;
const sl = () => zt(ko), Kw = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), al = Yn(null);
function Zw({ children: e }) {
  const t = ie(Kw, de);
  return m(al.Provider, { value: t, children: e });
}
function Qw() {
  const e = zt(al);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Jw = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, ex = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Jw;
  const u = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: u,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === Ct.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: u && c
  };
};
function tx({ type: e = "source", position: t = G.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: u, onTouchStart: f, ...d }, h) {
  var N, S;
  const p = s || null, v = e === "target", b = ue(), y = sl(), { connectOnClick: _, noPanClassName: g, rfId: w } = Qw(), { connectingFrom: E, connectingTo: k, clickConnecting: C, isPossibleEndHandle: A, connectionInProcess: $, clickConnectionInProcess: H, valid: z } = ie(ex(y, p, e), de);
  y || (S = (N = b.getState()).onError) == null || S.call(N, "010", De.error010());
  const V = (I) => {
    const { defaultEdgeOptions: L, onConnect: M, hasDefaultEdges: T } = b.getState(), O = {
      ...L,
      ...I
    };
    if (T) {
      const { edges: B, setEdges: j, onError: Y } = b.getState();
      j(zw(O, B, { onError: Y }));
    }
    M == null || M(O), a == null || a(O);
  }, R = (I) => {
    if (!y)
      return;
    const L = Ia(I.nativeEvent);
    if (o && (L && I.button === 0 || !L)) {
      const M = b.getState();
      Ur.onPointerDown(I.nativeEvent, {
        handleDomNode: I.currentTarget,
        autoPanOnConnect: M.autoPanOnConnect,
        connectionMode: M.connectionMode,
        connectionRadius: M.connectionRadius,
        domNode: M.domNode,
        nodeLookup: M.nodeLookup,
        lib: M.lib,
        isTarget: v,
        handleId: p,
        nodeId: y,
        flowId: M.rfId,
        panBy: M.panBy,
        cancelConnection: M.cancelConnection,
        onConnectStart: M.onConnectStart,
        onConnectEnd: (...T) => {
          var O, B;
          return (B = (O = b.getState()).onConnectEnd) == null ? void 0 : B.call(O, ...T);
        },
        updateConnection: M.updateConnection,
        onConnect: V,
        isValidConnection: n || ((...T) => {
          var O, B;
          return ((B = (O = b.getState()).isValidConnection) == null ? void 0 : B.call(O, ...T)) ?? !0;
        }),
        getTransform: () => b.getState().transform,
        getFromHandle: () => b.getState().connection.fromHandle,
        autoPanSpeed: M.autoPanSpeed,
        dragThreshold: M.connectionDragThreshold
      });
    }
    L ? u == null || u(I) : f == null || f(I);
  }, x = (I) => {
    const { onClickConnectStart: L, onClickConnectEnd: M, connectionClickStartHandle: T, connectionMode: O, isValidConnection: B, lib: j, rfId: Y, nodeLookup: Q, connection: U } = b.getState();
    if (!y || !T && !o)
      return;
    if (!T) {
      L == null || L(I.nativeEvent, { nodeId: y, handleId: p, handleType: e }), b.setState({ connectionClickStartHandle: { nodeId: y, type: e, id: p } });
      return;
    }
    const X = Ca(I.target), P = n || B, { connection: W, isValid: K } = Ur.isValid(I.nativeEvent, {
      handle: {
        nodeId: y,
        id: p,
        type: e
      },
      connectionMode: O,
      fromNodeId: T.nodeId,
      fromHandleId: T.id || null,
      fromType: T.type,
      isValidConnection: P,
      flowId: Y,
      doc: X,
      lib: j,
      nodeLookup: Q
    });
    K && W && V(W);
    const Z = structuredClone(U);
    delete Z.inProgress, Z.toPosition = Z.toHandle ? Z.toHandle.position : null, M == null || M(I, Z), b.setState({ connectionClickStartHandle: null });
  };
  return m("div", { "data-handleid": p, "data-nodeid": y, "data-handlepos": t, "data-id": `${w}-${y}-${p}-${e}`, className: ge([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    g,
    c,
    {
      source: !v,
      target: v,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: C,
      connectingfrom: E,
      connectingto: k,
      valid: z,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!$ || A) && ($ || H ? i : o)
    }
  ]), onMouseDown: R, onTouchStart: R, onClick: _ ? x : void 0, ref: h, ...d, children: l });
}
const it = fe(tl(tx));
function nx({ data: e, isConnectable: t, sourcePosition: n = G.Bottom }) {
  return D(_e, { children: [e == null ? void 0 : e.label, m(it, { type: "source", position: n, isConnectable: t })] });
}
function rx({ data: e, isConnectable: t, targetPosition: n = G.Top, sourcePosition: r = G.Bottom }) {
  return D(_e, { children: [m(it, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, m(it, { type: "source", position: r, isConnectable: t })] });
}
function ox() {
  return null;
}
function ix({ data: e, isConnectable: t, targetPosition: n = G.Top }) {
  return D(_e, { children: [m(it, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Fn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Gi = {
  input: nx,
  default: rx,
  output: ix,
  group: ox
};
function sx(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const ax = (e) => {
  const { width: t, height: n, x: r, y: o } = on(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: Te(t) ? t : null,
    height: Te(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function lx({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = ue(), { width: o, height: i, transformString: s, userSelectionActive: a } = ie(ax, de), l = il(), c = re(null);
  le(() => {
    var h;
    n || (h = c.current) == null || h.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && o !== null && i !== null;
  if (ol({
    nodeRef: c,
    disabled: !u
  }), !u)
    return null;
  const f = e ? (h) => {
    const p = r.getState().nodes.filter((v) => v.selected);
    e(h, p);
  } : void 0, d = (h) => {
    Object.prototype.hasOwnProperty.call(Fn, h.key) && (h.preventDefault(), l({
      direction: Fn[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return m("div", { className: ge(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: m("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : d, style: {
    width: o,
    height: i
  } }) });
}
const Xi = typeof window < "u" ? window : void 0, cx = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function ll({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: u, selectionMode: f, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: p, panActivationKeyCode: v, zoomActivationKeyCode: b, elementsSelectable: y, zoomOnScroll: _, zoomOnPinch: g, panOnScroll: w, panOnScrollSpeed: E, panOnScrollMode: k, zoomOnDoubleClick: C, panOnDrag: A, autoPanOnSelection: $, defaultViewport: H, translateExtent: z, minZoom: V, maxZoom: R, preventScrolling: x, onSelectionContextMenu: N, noWheelClassName: S, noPanClassName: I, disableKeyboardA11y: L, onViewportChange: M, isControlledViewport: T }) {
  const { nodesSelectionActive: O, userSelectionActive: B } = ie(cx, de), j = Qt(c, { target: Xi }), Y = Qt(v, { target: Xi }), Q = Y || A, U = Y || w, X = u && Q !== !0, P = j || B || X;
  return Vw({ deleteKeyCode: l, multiSelectionKeyCode: p }), m(Ww, { onPaneContextMenu: i, elementsSelectable: y, zoomOnScroll: _, zoomOnPinch: g, panOnScroll: U, panActivationKeyPressed: Y, panOnScrollSpeed: E, panOnScrollMode: k, zoomOnDoubleClick: C, panOnDrag: !j && Q, defaultViewport: H, translateExtent: z, minZoom: V, maxZoom: R, zoomActivationKeyCode: b, preventScrolling: x, noWheelClassName: S, noPanClassName: I, onViewportChange: M, isControlledViewport: T, paneClickDistance: a, selectionOnDrag: X, children: D(Xw, { onSelectionStart: d, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: Q, autoPanOnSelection: $, isSelecting: !!P, selectionMode: f, selectionKeyPressed: j, paneClickDistance: a, selectionOnDrag: X, children: [e, O && m(lx, { onSelectionContextMenu: N, noPanClassName: I, disableKeyboardA11y: L })] }) });
}
ll.displayName = "FlowRenderer";
const ux = fe(ll), dx = (e) => (t) => e ? go(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function fx(e) {
  return ie(Pe(dx(e), [e]), de);
}
const hx = (e) => e.updateNodeInternals;
function px() {
  const e = ie(hx), [t] = se(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
function gx({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = ue(), i = re(null), s = re(null), a = re(e.sourcePosition), l = re(e.targetPosition), c = re(t), u = n && !!e.internals.handleBounds;
  return le(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), le(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), le(() => {
    if (i.current) {
      const f = c.current !== t, d = a.current !== e.sourcePosition, h = l.current !== e.targetPosition;
      (f || d || h) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function mx({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: u, resizeObserver: f, noDragClassName: d, noPanClassName: h, disableKeyboardA11y: p, rfId: v, nodeTypes: b, nodeClickDistance: y, onError: _ }) {
  const { node: g, internals: w, isParent: E } = ie((P) => {
    const W = P.nodeLookup.get(e), K = P.parentLookup.has(e);
    return {
      node: W,
      internals: W.internals,
      isParent: K
    };
  }, de);
  let k = g.type || "default", C = (b == null ? void 0 : b[k]) || Gi[k];
  C === void 0 && (_ == null || _("003", De.error003(k)), k = "default", C = (b == null ? void 0 : b.default) || Gi.default);
  const A = !!(g.draggable || a && typeof g.draggable > "u"), $ = !!(g.selectable || l && typeof g.selectable > "u"), H = !!(g.connectable || c && typeof g.connectable > "u"), z = !!(g.focusable || u && typeof g.focusable > "u"), V = ue(), R = Ea(g), x = gx({ node: g, nodeType: k, hasDimensions: R, resizeObserver: f }), N = ol({
    nodeRef: x,
    disabled: g.hidden || !A,
    noDragClassName: d,
    handleSelector: g.dragHandle,
    nodeId: e,
    isSelectable: $,
    nodeClickDistance: y
  }), S = il();
  if (g.hidden)
    return null;
  const I = Ve(g), L = sx(g), M = $ || A || t || n || r || o, T = n ? (P) => n(P, { ...w.userNode }) : void 0, O = r ? (P) => r(P, { ...w.userNode }) : void 0, B = o ? (P) => o(P, { ...w.userNode }) : void 0, j = i ? (P) => i(P, { ...w.userNode }) : void 0, Y = s ? (P) => s(P, { ...w.userNode }) : void 0, Q = (P) => {
    const { selectNodesOnDrag: W, nodeDragThreshold: K } = V.getState();
    $ && (!W || !A || K > 0) && qr({
      id: e,
      store: V,
      nodeRef: x
    }), t && t(P, { ...w.userNode });
  }, U = (P) => {
    if (!(Ma(P.nativeEvent) || p)) {
      if (ga.includes(P.key) && $) {
        const W = P.key === "Escape";
        qr({
          id: e,
          store: V,
          unselect: W,
          nodeRef: x
        });
      } else if (A && g.selected && Object.prototype.hasOwnProperty.call(Fn, P.key)) {
        P.preventDefault();
        const { ariaLabelConfig: W } = V.getState();
        V.setState({
          ariaLiveMessage: W["node.a11yDescription.ariaLiveMessage"]({
            direction: P.key.replace("Arrow", "").toLowerCase(),
            x: ~~w.positionAbsolute.x,
            y: ~~w.positionAbsolute.y
          })
        }), S({
          direction: Fn[P.key],
          factor: P.shiftKey ? 4 : 1
        });
      }
    }
  }, X = () => {
    var ee;
    if (p || !((ee = x.current) != null && ee.matches(":focus-visible")))
      return;
    const { transform: P, width: W, height: K, autoPanOnNodeFocus: Z, setCenter: q } = V.getState();
    if (!Z)
      return;
    go(/* @__PURE__ */ new Map([[e, g]]), { x: 0, y: 0, width: W, height: K }, P, !0).length > 0 || q(g.position.x + I.width / 2, g.position.y + I.height / 2, {
      zoom: P[2]
    });
  };
  return m("div", { className: ge([
    "react-flow__node",
    `react-flow__node-${k}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: A
    },
    g.className,
    {
      selected: g.selected,
      selectable: $,
      parent: E,
      draggable: A,
      dragging: N
    }
  ]), ref: x, style: {
    zIndex: w.z,
    transform: `translate(${w.positionAbsolute.x}px,${w.positionAbsolute.y}px)`,
    pointerEvents: M ? "all" : "none",
    visibility: R ? "visible" : "hidden",
    ...g.style,
    ...L
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: T, onMouseMove: O, onMouseLeave: B, onContextMenu: j, onClick: Q, onDoubleClick: Y, onKeyDown: z ? U : void 0, tabIndex: z ? 0 : void 0, onFocus: z ? X : void 0, role: g.ariaRole ?? (z ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": p ? void 0 : `${Za}-${v}`, "aria-label": g.ariaLabel, ...g.domAttributes, children: m(qw, { value: e, children: m(C, { id: e, data: g.data, type: k, positionAbsoluteX: w.positionAbsolute.x, positionAbsoluteY: w.positionAbsolute.y, selected: g.selected ?? !1, selectable: $, draggable: A, deletable: g.deletable ?? !0, isConnectable: H, sourcePosition: g.sourcePosition, targetPosition: g.targetPosition, dragging: N, dragHandle: g.dragHandle, zIndex: w.z, parentId: g.parentId, ...I }) }) });
}
var yx = fe(mx);
const wx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function cl(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = ie(wx, de), i = fx(e.onlyRenderVisibleElements), s = px();
  return m("div", { className: "react-flow__nodes", style: ar, children: i.map((a) => (
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
    m(yx, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
cl.displayName = "NodeRenderer";
const xx = fe(cl);
function bx(e) {
  return ie(Pe((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && J0({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(o.id);
      }
    return r;
  }, [e]), de);
}
const vx = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return m("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, _x = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return m("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Ui = {
  [Mt.Arrow]: vx,
  [Mt.ArrowClosed]: _x
};
function kx(e) {
  const t = ue();
  return ce(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(Ui, e) ? Ui[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", De.error009(e)), null);
  }, [e]);
}
const Ex = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = kx(t);
  return l ? m("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: m(l, { color: n, strokeWidth: s }) }) : null;
}, ul = ({ defaultColor: e, rfId: t }) => {
  const n = ie((i) => i.edges), r = ie((i) => i.defaultEdgeOptions), o = ce(() => ay(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? m("svg", { className: "react-flow__marker", "aria-hidden": "true", children: m("defs", { children: o.map((i) => m(Ex, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
ul.displayName = "MarkerDefinitions";
var Sx = fe(ul);
function dl({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...u }) {
  const [f, d] = se({ x: 1, y: 0, width: 0, height: 0 }), h = ge(["react-flow__edge-textwrapper", c]), p = re(null);
  return le(() => {
    if (p.current) {
      const v = p.current.getBBox();
      d({
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height
      });
    }
  }, [n]), n ? D("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...u, children: [o && m("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), m("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: p, style: r, children: n }), l] }) : null;
}
dl.displayName = "EdgeText";
const Nx = fe(dl);
function lr({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...u }) {
  return D(_e, { children: [m("path", { ...u, d: e, fill: "none", className: ge(["react-flow__edge-path", u.className]) }), c ? m("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && Te(t) && Te(n) ? m(Nx, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function qi({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === G.Left || e === G.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function fl({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top }) {
  const [s, a] = qi({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = qi({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [u, f, d, h] = $a({
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
    u,
    f,
    d,
    h
  ];
}
function hl(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: v, markerStart: b, interactionWidth: y }) => {
    const [_, g, w] = fl({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), E = e.isInternal ? void 0 : t;
    return m(lr, { id: E, path: _, labelX: g, labelY: w, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: v, markerStart: b, interactionWidth: y });
  });
}
const Cx = hl({ isInternal: !1 }), pl = hl({ isInternal: !0 });
Cx.displayName = "SimpleBezierEdge";
pl.displayName = "SimpleBezierEdgeInternal";
function gl(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, sourcePosition: h = G.Bottom, targetPosition: p = G.Top, markerEnd: v, markerStart: b, pathOptions: y, interactionWidth: _ }) => {
    const [g, w, E] = jr({
      sourceX: n,
      sourceY: r,
      sourcePosition: h,
      targetX: o,
      targetY: i,
      targetPosition: p,
      borderRadius: y == null ? void 0 : y.borderRadius,
      offset: y == null ? void 0 : y.offset,
      stepPosition: y == null ? void 0 : y.stepPosition
    }), k = e.isInternal ? void 0 : t;
    return m(lr, { id: k, path: g, labelX: w, labelY: E, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: v, markerStart: b, interactionWidth: _ });
  });
}
const ml = gl({ isInternal: !1 }), yl = gl({ isInternal: !0 });
ml.displayName = "SmoothStepEdge";
yl.displayName = "SmoothStepEdgeInternal";
function wl(e) {
  return fe(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return m(ml, { ...n, id: r, pathOptions: ce(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const Mx = wl({ isInternal: !1 }), xl = wl({ isInternal: !0 });
Mx.displayName = "StepEdge";
xl.displayName = "StepEdgeInternal";
function bl(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: p, interactionWidth: v }) => {
    const [b, y, _] = za({ sourceX: n, sourceY: r, targetX: o, targetY: i }), g = e.isInternal ? void 0 : t;
    return m(lr, { id: g, path: b, labelX: y, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: p, interactionWidth: v });
  });
}
const Ix = bl({ isInternal: !1 }), vl = bl({ isInternal: !0 });
Ix.displayName = "StraightEdge";
vl.displayName = "StraightEdgeInternal";
function _l(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = G.Bottom, targetPosition: a = G.Top, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: v, markerStart: b, pathOptions: y, interactionWidth: _ }) => {
    const [g, w, E] = Aa({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: y == null ? void 0 : y.curvature
    }), k = e.isInternal ? void 0 : t;
    return m(lr, { id: k, path: g, labelX: w, labelY: E, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: v, markerStart: b, interactionWidth: _ });
  });
}
const $x = _l({ isInternal: !1 }), kl = _l({ isInternal: !0 });
$x.displayName = "BezierEdge";
kl.displayName = "BezierEdgeInternal";
const Ki = {
  default: kl,
  straight: vl,
  step: xl,
  smoothstep: yl,
  simplebezier: pl
}, Zi = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Ax = (e, t, n) => n === G.Left ? e - t : n === G.Right ? e + t : e, Lx = (e, t, n) => n === G.Top ? e - t : n === G.Bottom ? e + t : e, Qi = "react-flow__edgeupdater";
function Ji({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return m("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: ge([Qi, `${Qi}-${a}`]), cx: Ax(t, r, e), cy: Lx(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function zx({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: u, onReconnectEnd: f, setReconnecting: d, setUpdateHover: h }) {
  const p = ue(), v = (w, E) => {
    if (w.button !== 0)
      return;
    const { autoPanOnConnect: k, domNode: C, connectionMode: A, connectionRadius: $, lib: H, onConnectStart: z, cancelConnection: V, nodeLookup: R, rfId: x, panBy: N, updateConnection: S } = p.getState(), I = E.type === "target", L = (O, B) => {
      d(!1), f == null || f(O, n, E.type, B);
    }, M = (O) => c == null ? void 0 : c(n, O), T = (O, B) => {
      d(!0), u == null || u(w, n, E.type), z == null || z(O, B);
    };
    Ur.onPointerDown(w.nativeEvent, {
      autoPanOnConnect: k,
      connectionMode: A,
      connectionRadius: $,
      domNode: C,
      handleId: E.id,
      nodeId: E.nodeId,
      nodeLookup: R,
      isTarget: I,
      edgeUpdaterType: E.type,
      lib: H,
      flowId: x,
      cancelConnection: V,
      panBy: N,
      isValidConnection: (...O) => {
        var B, j;
        return ((j = (B = p.getState()).isValidConnection) == null ? void 0 : j.call(B, ...O)) ?? !0;
      },
      onConnect: M,
      onConnectStart: T,
      onConnectEnd: (...O) => {
        var B, j;
        return (j = (B = p.getState()).onConnectEnd) == null ? void 0 : j.call(B, ...O);
      },
      onReconnectEnd: L,
      updateConnection: S,
      getTransform: () => p.getState().transform,
      getFromHandle: () => p.getState().connection.fromHandle,
      dragThreshold: p.getState().connectionDragThreshold,
      handleDomNode: w.currentTarget
    });
  }, b = (w) => v(w, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), y = (w) => v(w, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => h(!0), g = () => h(!1);
  return D(_e, { children: [(e === !0 || e === "source") && m(Ji, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: b, onMouseEnter: _, onMouseOut: g, type: "source" }), (e === !0 || e === "target") && m(Ji, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: y, onMouseEnter: _, onMouseOut: g, type: "target" })] });
}
function Tx({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, rfId: p, edgeTypes: v, noPanClassName: b, onError: y, disableKeyboardA11y: _ }) {
  let g = ie((q) => q.edgeLookup.get(e));
  const w = ie((q) => q.defaultEdgeOptions);
  g = w ? { ...w, ...g } : g;
  let E = g.type || "default", k = (v == null ? void 0 : v[E]) || Ki[E];
  k === void 0 && (y == null || y("011", De.error011(E)), E = "default", k = (v == null ? void 0 : v.default) || Ki.default);
  const C = !!(g.focusable || t && typeof g.focusable > "u"), A = typeof f < "u" && (g.reconnectable || n && typeof g.reconnectable > "u"), $ = !!(g.selectable || r && typeof g.selectable > "u"), H = re(null), [z, V] = se(!1), [R, x] = se(!1), N = ue(), { zIndex: S = g.zIndex, sourceX: I, sourceY: L, targetX: M, targetY: T, sourcePosition: O, targetPosition: B } = ie(Pe((q) => {
    const J = q.nodeLookup.get(g.source), ee = q.nodeLookup.get(g.target);
    if (!J || !ee)
      return Zi;
    const te = sy({
      id: e,
      sourceNode: J,
      targetNode: ee,
      sourceHandle: g.sourceHandle || null,
      targetHandle: g.targetHandle || null,
      connectionMode: q.connectionMode,
      onError: y
    }), ne = Q0({
      selected: g.selected,
      zIndex: g.zIndex,
      sourceNode: J,
      targetNode: ee,
      elevateOnSelect: q.elevateEdgesOnSelect,
      zIndexMode: q.zIndexMode
    });
    return {
      ...te || Zi,
      zIndex: ne
    };
  }, [g.source, g.target, g.sourceHandle, g.targetHandle, g.selected, g.zIndex, y]), de), j = ce(() => g.markerStart ? `url('#${Gr(g.markerStart, p)}')` : void 0, [g.markerStart, p]), Y = ce(() => g.markerEnd ? `url('#${Gr(g.markerEnd, p)}')` : void 0, [g.markerEnd, p]);
  if (g.hidden || I === null || L === null || M === null || T === null)
    return null;
  const Q = (q) => {
    var ne;
    const { addSelectedEdges: J, unselectNodesAndEdges: ee, multiSelectionActive: te } = N.getState();
    $ && (N.setState({ nodesSelectionActive: !1 }), g.selected && te ? (ee({ nodes: [], edges: [g] }), (ne = H.current) == null || ne.blur()) : J([e])), o && o(q, g);
  }, U = i ? (q) => {
    i(q, { ...g });
  } : void 0, X = s ? (q) => {
    s(q, { ...g });
  } : void 0, P = a ? (q) => {
    a(q, { ...g });
  } : void 0, W = l ? (q) => {
    l(q, { ...g });
  } : void 0, K = c ? (q) => {
    c(q, { ...g });
  } : void 0, Z = (q) => {
    var J;
    if (!_ && ga.includes(q.key) && $) {
      const { unselectNodesAndEdges: ee, addSelectedEdges: te } = N.getState();
      q.key === "Escape" ? ((J = H.current) == null || J.blur(), ee({ edges: [g] })) : te([e]);
    }
  };
  return m("svg", { style: { zIndex: S }, children: D("g", { className: ge([
    "react-flow__edge",
    `react-flow__edge-${E}`,
    g.className,
    b,
    {
      selected: g.selected,
      animated: g.animated,
      inactive: !$ && !o,
      updating: z,
      selectable: $
    }
  ]), onClick: Q, onDoubleClick: U, onContextMenu: X, onMouseEnter: P, onMouseMove: W, onMouseLeave: K, onKeyDown: C ? Z : void 0, tabIndex: C ? 0 : void 0, role: g.ariaRole ?? (C ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": g.ariaLabel === null ? void 0 : g.ariaLabel || `Edge from ${g.source} to ${g.target}`, "aria-describedby": C ? `${Qa}-${p}` : void 0, ref: H, ...g.domAttributes, children: [!R && m(k, { id: e, source: g.source, target: g.target, type: g.type, selected: g.selected, animated: g.animated, selectable: $, deletable: g.deletable ?? !0, label: g.label, labelStyle: g.labelStyle, labelShowBg: g.labelShowBg, labelBgStyle: g.labelBgStyle, labelBgPadding: g.labelBgPadding, labelBgBorderRadius: g.labelBgBorderRadius, sourceX: I, sourceY: L, targetX: M, targetY: T, sourcePosition: O, targetPosition: B, data: g.data, style: g.style, sourceHandleId: g.sourceHandle, targetHandleId: g.targetHandle, markerStart: j, markerEnd: Y, pathOptions: "pathOptions" in g ? g.pathOptions : void 0, interactionWidth: g.interactionWidth }), A && m(zx, { edge: g, isReconnectable: A, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, sourceX: I, sourceY: L, targetX: M, targetY: T, sourcePosition: O, targetPosition: B, setUpdateHover: V, setReconnecting: x })] }) });
}
var Ox = fe(Tx);
const Px = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function El({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: u, reconnectRadius: f, onEdgeDoubleClick: d, onReconnectStart: h, onReconnectEnd: p, disableKeyboardA11y: v }) {
  const { edgesFocusable: b, edgesReconnectable: y, elementsSelectable: _, onError: g } = ie(Px, de), w = bx(t);
  return D("div", { className: "react-flow__edges", children: [m(Sx, { defaultColor: e, rfId: n }), w.map((E) => m(Ox, { id: E, edgesFocusable: b, edgesReconnectable: y, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: u, reconnectRadius: f, onDoubleClick: d, onReconnectStart: h, onReconnectEnd: p, rfId: n, onError: g, edgeTypes: r, disableKeyboardA11y: v }, E))] });
}
El.displayName = "EdgeRenderer";
const Dx = fe(El), es = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Rx({ children: e }) {
  const t = ue(), n = re(null), [r] = se(() => t.getState().transform);
  return nl(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = es(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), m("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: es(r) }, children: e });
}
function Hx(e) {
  const t = sr(), n = re(!1);
  le(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Vx = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Bx(e) {
  const t = ie(Vx), n = ue();
  return le(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Fx(e) {
  return e.connection.inProgress ? { ...e.connection, to: an(e.connection.to, e.transform) } : { ...e.connection };
}
function Wx(e) {
  return Fx;
}
function Yx(e) {
  const t = Wx();
  return ie(t, de);
}
const jx = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Gx({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = ie(jx, de);
  return !(i && o && l) ? null : m("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: m("g", { className: ge(["react-flow__connection", Na(a)]), children: m(Sl, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const Sl = ({ style: e, type: t = nt.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: u, toHandle: f, toPosition: d, pointer: h } = Yx();
  if (!o)
    return;
  if (n)
    return m(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: d, connectionStatus: Na(r), toNode: u, toHandle: f, pointer: h });
  let p = "";
  const v = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: d
  };
  switch (t) {
    case nt.Bezier:
      [p] = Aa(v);
      break;
    case nt.SimpleBezier:
      [p] = fl(v);
      break;
    case nt.Step:
      [p] = jr({
        ...v,
        borderRadius: 0
      });
      break;
    case nt.SmoothStep:
      [p] = jr(v);
      break;
    default:
      [p] = za(v);
  }
  return m("path", { d: p, fill: "none", className: "react-flow__connection-path", style: e });
};
Sl.displayName = "ConnectionLine";
const Xx = {};
function ts(e = Xx) {
  re(e), ue(), le(() => {
  }, [e]);
}
function Ux() {
  ue(), re(!1), le(() => {
  }, []);
}
function Nl({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, onSelectionContextMenu: f, onSelectionStart: d, onSelectionEnd: h, connectionLineType: p, connectionLineStyle: v, connectionLineComponent: b, connectionLineContainerStyle: y, selectionKeyCode: _, selectionOnDrag: g, selectionMode: w, multiSelectionKeyCode: E, panActivationKeyCode: k, zoomActivationKeyCode: C, deleteKeyCode: A, onlyRenderVisibleElements: $, elementsSelectable: H, defaultViewport: z, translateExtent: V, minZoom: R, maxZoom: x, preventScrolling: N, defaultMarkerColor: S, zoomOnScroll: I, zoomOnPinch: L, panOnScroll: M, panOnScrollSpeed: T, panOnScrollMode: O, zoomOnDoubleClick: B, panOnDrag: j, autoPanOnSelection: Y, onPaneClick: Q, onPaneMouseEnter: U, onPaneMouseMove: X, onPaneMouseLeave: P, onPaneScroll: W, onPaneContextMenu: K, paneClickDistance: Z, nodeClickDistance: q, onEdgeContextMenu: J, onEdgeMouseEnter: ee, onEdgeMouseMove: te, onEdgeMouseLeave: ne, reconnectRadius: ae, onReconnect: xe, onReconnectStart: Se, onReconnectEnd: Ne, noDragClassName: Me, noWheelClassName: st, noPanClassName: Ge, disableKeyboardA11y: Ie, nodeExtent: ye, rfId: $e, viewport: Ae, onViewportChange: Be, nodesDraggable: Tt }) {
  return ts(e), ts(t), Ux(), Hx(n), Bx(Ae), m(ux, { onPaneClick: Q, onPaneMouseEnter: U, onPaneMouseMove: X, onPaneMouseLeave: P, onPaneContextMenu: K, onPaneScroll: W, paneClickDistance: Z, deleteKeyCode: A, selectionKeyCode: _, selectionOnDrag: g, selectionMode: w, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: E, panActivationKeyCode: k, zoomActivationKeyCode: C, elementsSelectable: H, zoomOnScroll: I, zoomOnPinch: L, zoomOnDoubleClick: B, panOnScroll: M, panOnScrollSpeed: T, panOnScrollMode: O, panOnDrag: j, autoPanOnSelection: Y, defaultViewport: z, translateExtent: V, minZoom: R, maxZoom: x, onSelectionContextMenu: f, preventScrolling: N, noDragClassName: Me, noWheelClassName: st, noPanClassName: Ge, disableKeyboardA11y: Ie, onViewportChange: Be, isControlledViewport: !!Ae, children: D(Rx, { children: [m(Dx, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: xe, onReconnectStart: Se, onReconnectEnd: Ne, onlyRenderVisibleElements: $, onEdgeContextMenu: J, onEdgeMouseEnter: ee, onEdgeMouseMove: te, onEdgeMouseLeave: ne, reconnectRadius: ae, defaultMarkerColor: S, noPanClassName: Ge, disableKeyboardA11y: Ie, rfId: $e }), m(Gx, { style: v, type: p, component: b, containerStyle: y }), m("div", { className: "react-flow__edgelabel-renderer" }), m(xx, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, nodeClickDistance: q, onlyRenderVisibleElements: $, noPanClassName: Ge, noDragClassName: Me, disableKeyboardA11y: Ie, nodeExtent: ye, rfId: $e, nodesDraggable: Tt }), m("div", { className: "react-flow__viewport-portal" })] }) });
}
Nl.displayName = "GraphView";
const qx = fe(Nl), Kx = ka(), ns = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: u, nodeExtent: f, zIndexMode: d = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), y = r ?? t ?? [], _ = n ?? e ?? [], g = u ?? [0, 0], w = f ?? Ut;
  Pa(v, b, y);
  const { nodesInitialized: E } = Xr(_, h, p, {
    nodeOrigin: g,
    nodeExtent: w,
    zIndexMode: d
  });
  let k = [0, 0, 1];
  if (s && o && i) {
    const C = on(h, {
      filter: (z) => !!((z.width || z.initialWidth) && (z.height || z.initialHeight))
    }), { x: A, y: $, zoom: H } = nr(C, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    k = [A, $, H];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: k,
    nodes: _,
    nodesInitialized: E,
    nodeLookup: h,
    parentLookup: p,
    edges: y,
    edgeLookup: b,
    connectionLookup: v,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: Ut,
    nodeExtent: w,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Ct.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: g,
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
    connection: { ...ya },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Kx,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: ma,
    zIndexMode: d,
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
}, Zx = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: u, nodeExtent: f, zIndexMode: d }) => cw((h, p) => {
  async function v() {
    const { nodeLookup: b, panZoom: y, fitViewOptions: _, fitViewResolver: g, width: w, height: E, minZoom: k, maxZoom: C } = p();
    y && (await j0({
      nodes: b,
      width: w,
      height: E,
      panZoom: y,
      minZoom: k,
      maxZoom: C
    }, _), g == null || g.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...ns({
      nodes: e,
      edges: t,
      width: o,
      height: i,
      fitView: s,
      fitViewOptions: a,
      minZoom: l,
      maxZoom: c,
      nodeOrigin: u,
      nodeExtent: f,
      defaultNodes: n,
      defaultEdges: r,
      zIndexMode: d
    }),
    setNodes: (b) => {
      const { nodeLookup: y, parentLookup: _, nodeOrigin: g, nodeExtent: w, elevateNodesOnSelect: E, fitViewQueued: k, zIndexMode: C, nodesSelectionActive: A } = p(), { nodesInitialized: $, hasSelectedNodes: H } = Xr(b, y, _, {
        nodeOrigin: g,
        nodeExtent: w,
        elevateNodesOnSelect: E,
        checkEquality: !0,
        zIndexMode: C
      }), z = A && H;
      k && $ ? (v(), h({
        nodes: b,
        nodesInitialized: $,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: z
      })) : h({ nodes: b, nodesInitialized: $, nodesSelectionActive: z });
    },
    setEdges: (b) => {
      const { connectionLookup: y, edgeLookup: _ } = p();
      Pa(y, _, b), h({ edges: b });
    },
    setDefaultNodesAndEdges: (b, y) => {
      if (b) {
        const { setNodes: _ } = p();
        _(b), h({ hasDefaultNodes: !0 });
      }
      if (y) {
        const { setEdges: _ } = p();
        _(y), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (b) => {
      const { triggerNodeChanges: y, nodeLookup: _, parentLookup: g, domNode: w, nodeOrigin: E, nodeExtent: k, debug: C, fitViewQueued: A, zIndexMode: $ } = p(), { changes: H, updatedInternals: z } = py(b, _, g, w, E, k, $);
      z && (uy(_, g, { nodeOrigin: E, nodeExtent: k, zIndexMode: $ }), A ? (v(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), (H == null ? void 0 : H.length) > 0 && (C && console.log("React Flow: trigger node changes", H), y == null || y(H)));
    },
    updateNodePositions: (b, y = !1) => {
      const _ = [];
      let g = [];
      const { nodeLookup: w, triggerNodeChanges: E, connection: k, updateConnection: C, onNodesChangeMiddlewareMap: A } = p();
      for (const [$, H] of b) {
        const z = w.get($), V = !!(z != null && z.expandParent && (z != null && z.parentId) && (H != null && H.position)), R = {
          id: $,
          type: "position",
          position: V ? {
            x: Math.max(0, H.position.x),
            y: Math.max(0, H.position.y)
          } : H.position,
          dragging: y
        };
        if (z && k.inProgress && k.fromNode.id === z.id) {
          const x = yt(z, k.fromHandle, G.Left, !0);
          C({ ...k, from: x });
        }
        V && z.parentId && _.push({
          id: $,
          parentId: z.parentId,
          rect: {
            ...H.internals.positionAbsolute,
            width: H.measured.width ?? 0,
            height: H.measured.height ?? 0
          }
        }), g.push(R);
      }
      if (_.length > 0) {
        const { parentLookup: $, nodeOrigin: H } = p(), z = _o(_, w, $, H);
        g.push(...z);
      }
      for (const $ of A.values())
        g = $(g);
      E(g);
    },
    triggerNodeChanges: (b) => {
      const { onNodesChange: y, setNodes: _, nodes: g, hasDefaultNodes: w, debug: E } = p();
      if (b != null && b.length) {
        if (w) {
          const k = $w(b, g);
          _(k);
        }
        E && console.log("React Flow: trigger node changes", b), y == null || y(b);
      }
    },
    triggerEdgeChanges: (b) => {
      const { onEdgesChange: y, setEdges: _, edges: g, hasDefaultEdges: w, debug: E } = p();
      if (b != null && b.length) {
        if (w) {
          const k = Aw(b, g);
          _(k);
        }
        E && console.log("React Flow: trigger edge changes", b), y == null || y(b);
      }
    },
    addSelectedNodes: (b) => {
      const { multiSelectionActive: y, edgeLookup: _, nodeLookup: g, triggerNodeChanges: w, triggerEdgeChanges: E } = p();
      if (y) {
        const k = b.map((C) => lt(C, !0));
        w(k);
        return;
      }
      w(_t(g, /* @__PURE__ */ new Set([...b]), !0)), E(_t(_));
    },
    addSelectedEdges: (b) => {
      const { multiSelectionActive: y, edgeLookup: _, nodeLookup: g, triggerNodeChanges: w, triggerEdgeChanges: E } = p();
      if (y) {
        const k = b.map((C) => lt(C, !0));
        E(k);
        return;
      }
      E(_t(_, /* @__PURE__ */ new Set([...b]))), w(_t(g, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: b, edges: y } = {}) => {
      const { edges: _, nodes: g, nodeLookup: w, triggerNodeChanges: E, triggerEdgeChanges: k } = p(), C = b || g, A = y || _, $ = [];
      for (const z of C) {
        if (!z.selected)
          continue;
        const V = w.get(z.id);
        V && (V.selected = !1), $.push(lt(z.id, !1));
      }
      const H = [];
      for (const z of A)
        z.selected && H.push(lt(z.id, !1));
      E($), k(H);
    },
    setMinZoom: (b) => {
      const { panZoom: y, maxZoom: _ } = p();
      y == null || y.setScaleExtent([b, _]), h({ minZoom: b });
    },
    setMaxZoom: (b) => {
      const { panZoom: y, minZoom: _ } = p();
      y == null || y.setScaleExtent([_, b]), h({ maxZoom: b });
    },
    setTranslateExtent: (b) => {
      var y;
      (y = p().panZoom) == null || y.setTranslateExtent(b), h({ translateExtent: b });
    },
    resetSelectedElements: () => {
      const { edges: b, nodes: y, triggerNodeChanges: _, triggerEdgeChanges: g, elementsSelectable: w } = p();
      if (!w)
        return;
      const E = y.reduce((C, A) => A.selected ? [...C, lt(A.id, !1)] : C, []), k = b.reduce((C, A) => A.selected ? [...C, lt(A.id, !1)] : C, []);
      _(E), g(k);
    },
    setNodeExtent: (b) => {
      const { nodes: y, nodeLookup: _, parentLookup: g, nodeOrigin: w, elevateNodesOnSelect: E, nodeExtent: k, zIndexMode: C } = p();
      b[0][0] === k[0][0] && b[0][1] === k[0][1] && b[1][0] === k[1][0] && b[1][1] === k[1][1] || (Xr(y, _, g, {
        nodeOrigin: w,
        nodeExtent: b,
        elevateNodesOnSelect: E,
        checkEquality: !1,
        zIndexMode: C
      }), h({ nodeExtent: b }));
    },
    panBy: (b) => {
      const { transform: y, width: _, height: g, panZoom: w, translateExtent: E } = p();
      return gy({ delta: b, panZoom: w, transform: y, translateExtent: E, width: _, height: g });
    },
    setCenter: async (b, y, _) => {
      const { width: g, height: w, maxZoom: E, panZoom: k } = p();
      if (!k)
        return !1;
      const C = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : E;
      return await k.setViewport({
        x: g / 2 - b * C,
        y: w / 2 - y * C,
        zoom: C
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...ya }
      });
    },
    updateConnection: (b) => {
      h({ connection: b });
    },
    reset: () => h({ ...ns() })
  };
}, Object.is);
function Eo({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: u, nodeExtent: f, zIndexMode: d, children: h }) {
  const [p] = se(() => Zx({
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
    nodeOrigin: u,
    nodeExtent: f,
    zIndexMode: d
  }));
  return m(uw, { value: p, children: m(Pw, { children: m(Zw, { children: h }) }) });
}
function Qx({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) {
  return zt(ir) ? m(_e, { children: e }) : m(Eo, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: e });
}
const Jx = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function eb({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: u, onMoveStart: f, onMoveEnd: d, onConnect: h, onConnectStart: p, onConnectEnd: v, onClickConnectStart: b, onClickConnectEnd: y, onNodeMouseEnter: _, onNodeMouseMove: g, onNodeMouseLeave: w, onNodeContextMenu: E, onNodeDoubleClick: k, onNodeDragStart: C, onNodeDrag: A, onNodeDragStop: $, onNodesDelete: H, onEdgesDelete: z, onDelete: V, onSelectionChange: R, onSelectionDragStart: x, onSelectionDrag: N, onSelectionDragStop: S, onSelectionContextMenu: I, onSelectionStart: L, onSelectionEnd: M, onBeforeDelete: T, connectionMode: O, connectionLineType: B = nt.Bezier, connectionLineStyle: j, connectionLineComponent: Y, connectionLineContainerStyle: Q, deleteKeyCode: U = "Backspace", selectionKeyCode: X = "Shift", selectionOnDrag: P = !1, selectionMode: W = qt.Full, panActivationKeyCode: K = "Space", multiSelectionKeyCode: Z = Zt() ? "Meta" : "Control", zoomActivationKeyCode: q = Zt() ? "Meta" : "Control", snapToGrid: J, snapGrid: ee, onlyRenderVisibleElements: te = !1, selectNodesOnDrag: ne, nodesDraggable: ae, autoPanOnNodeFocus: xe, nodesConnectable: Se, nodesFocusable: Ne, nodeOrigin: Me = Ja, edgesFocusable: st, edgesReconnectable: Ge, elementsSelectable: Ie = !0, defaultViewport: ye = kw, minZoom: $e = 0.5, maxZoom: Ae = 2, translateExtent: Be = Ut, preventScrolling: Tt = !0, nodeExtent: bt, defaultMarkerColor: ur = "#b1b1b7", zoomOnScroll: ln = !0, zoomOnPinch: cn = !0, panOnScroll: un = !1, panOnScrollSpeed: F = 0.5, panOnScrollMode: be = dt.Free, zoomOnDoubleClick: dr = !0, panOnDrag: Hl = !0, onPaneClick: Vl, onPaneMouseEnter: Bl, onPaneMouseMove: Fl, onPaneMouseLeave: Wl, onPaneScroll: Yl, onPaneContextMenu: jl, paneClickDistance: Gl = 1, nodeClickDistance: Xl = 0, children: Ul, onReconnect: ql, onReconnectStart: Kl, onReconnectEnd: Zl, onEdgeContextMenu: Ql, onEdgeDoubleClick: Jl, onEdgeMouseEnter: ec, onEdgeMouseMove: tc, onEdgeMouseLeave: nc, reconnectRadius: rc = 10, onNodesChange: oc, onEdgesChange: ic, noDragClassName: sc = "nodrag", noWheelClassName: ac = "nowheel", noPanClassName: No = "nopan", fitView: Co, fitViewOptions: Mo, connectOnClick: lc, attributionPosition: cc, proOptions: uc, defaultEdgeOptions: dc, elevateNodesOnSelect: fc = !0, elevateEdgesOnSelect: hc = !1, disableKeyboardA11y: Io = !1, autoPanOnConnect: pc, autoPanOnNodeDrag: gc, autoPanOnSelection: mc = !0, autoPanSpeed: yc, connectionRadius: wc, isValidConnection: xc, onError: bc, style: vc, id: $o, nodeDragThreshold: _c, connectionDragThreshold: kc, viewport: Ec, onViewportChange: Sc, width: Nc, height: Cc, colorMode: Mc = "light", debug: Ic, onScroll: dn, ariaLabelConfig: $c, zIndexMode: Ao = "basic", ...Ac }, Lc) {
  const fr = $o || "1", zc = Cw(Mc), Tc = Pe((Lo) => {
    Lo.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), dn == null || dn(Lo);
  }, [dn]);
  return m("div", { "data-testid": "rf__wrapper", ...Ac, onScroll: Tc, style: { ...vc, ...Jx }, ref: Lc, className: ge(["react-flow", o, zc]), id: $o, role: "application", children: D(Qx, { nodes: e, edges: t, width: Nc, height: Cc, fitView: Co, fitViewOptions: Mo, minZoom: $e, maxZoom: Ae, nodeOrigin: Me, nodeExtent: bt, zIndexMode: Ao, children: [m(Nw, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: h, onConnectStart: p, onConnectEnd: v, onClickConnectStart: b, onClickConnectEnd: y, nodesDraggable: ae, autoPanOnNodeFocus: xe, nodesConnectable: Se, nodesFocusable: Ne, edgesFocusable: st, edgesReconnectable: Ge, elementsSelectable: Ie, elevateNodesOnSelect: fc, elevateEdgesOnSelect: hc, minZoom: $e, maxZoom: Ae, nodeExtent: bt, onNodesChange: oc, onEdgesChange: ic, snapToGrid: J, snapGrid: ee, connectionMode: O, translateExtent: Be, connectOnClick: lc, defaultEdgeOptions: dc, fitView: Co, fitViewOptions: Mo, onNodesDelete: H, onEdgesDelete: z, onDelete: V, onNodeDragStart: C, onNodeDrag: A, onNodeDragStop: $, onSelectionDrag: N, onSelectionDragStart: x, onSelectionDragStop: S, onMove: u, onMoveStart: f, onMoveEnd: d, noPanClassName: No, nodeOrigin: Me, rfId: fr, autoPanOnConnect: pc, autoPanOnNodeDrag: gc, autoPanSpeed: yc, onError: bc, connectionRadius: wc, isValidConnection: xc, selectNodesOnDrag: ne, nodeDragThreshold: _c, connectionDragThreshold: kc, onBeforeDelete: T, debug: Ic, ariaLabelConfig: $c, zIndexMode: Ao }), m(qx, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: g, onNodeMouseLeave: w, onNodeContextMenu: E, onNodeDoubleClick: k, nodeTypes: i, edgeTypes: s, connectionLineType: B, connectionLineStyle: j, connectionLineComponent: Y, connectionLineContainerStyle: Q, selectionKeyCode: X, selectionOnDrag: P, selectionMode: W, deleteKeyCode: U, multiSelectionKeyCode: Z, panActivationKeyCode: K, zoomActivationKeyCode: q, onlyRenderVisibleElements: te, defaultViewport: ye, translateExtent: Be, minZoom: $e, maxZoom: Ae, preventScrolling: Tt, zoomOnScroll: ln, zoomOnPinch: cn, zoomOnDoubleClick: dr, panOnScroll: un, panOnScrollSpeed: F, panOnScrollMode: be, panOnDrag: Hl, autoPanOnSelection: mc, onPaneClick: Vl, onPaneMouseEnter: Bl, onPaneMouseMove: Fl, onPaneMouseLeave: Wl, onPaneScroll: Yl, onPaneContextMenu: jl, paneClickDistance: Gl, nodeClickDistance: Xl, onSelectionContextMenu: I, onSelectionStart: L, onSelectionEnd: M, onReconnect: ql, onReconnectStart: Kl, onReconnectEnd: Zl, onEdgeContextMenu: Ql, onEdgeDoubleClick: Jl, onEdgeMouseEnter: ec, onEdgeMouseMove: tc, onEdgeMouseLeave: nc, reconnectRadius: rc, defaultMarkerColor: ur, noDragClassName: sc, noWheelClassName: ac, noPanClassName: No, rfId: fr, disableKeyboardA11y: Io, nodeExtent: bt, viewport: Ec, onViewportChange: Sc, nodesDraggable: ae }), m(_w, { onSelectionChange: R }), Ul, m(yw, { proOptions: uc, position: cc }), m(mw, { rfId: fr, disableKeyboardA11y: Io })] }) });
}
var Cl = tl(eb);
function tb({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return m("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ge(["react-flow__background-pattern", n, r]) });
}
function nb({ radius: e, className: t }) {
  return m("circle", { cx: e, cy: e, r: e, className: ge(["react-flow__background-pattern", "dots", t]) });
}
var ot;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(ot || (ot = {}));
const rb = {
  [ot.Dots]: 1,
  [ot.Lines]: 1,
  [ot.Cross]: 6
}, ob = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Ml({
  id: e,
  variant: t = ot.Dots,
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
  patternClassName: u
}) {
  const f = re(null), { transform: d, patternId: h } = ie(ob, de), p = r || rb[t], v = t === ot.Dots, b = t === ot.Cross, y = Array.isArray(n) ? n : [n, n], _ = [y[0] * d[2] || 1, y[1] * d[2] || 1], g = p * d[2], w = Array.isArray(i) ? i : [i, i], E = b ? [g, g] : _, k = [
    w[0] * d[2] + E[0] / 2,
    w[1] * d[2] + E[1] / 2
  ], C = `${h}${e || ""}`;
  return D("svg", { className: ge(["react-flow__background", c]), style: {
    ...l,
    ...ar,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [m("pattern", { id: C, x: d[0] % _[0], y: d[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${k[0]},-${k[1]})`, children: v ? m(nb, { radius: g / 2, className: u }) : m(tb, { dimensions: E, lineWidth: o, variant: t, className: u }) }), m("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${C})` })] });
}
Ml.displayName = "Background";
const Il = fe(Ml);
function ib() {
  return m("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: m("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function sb() {
  return m("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: m("path", { d: "M0 0h32v4.2H0z" }) });
}
function ab() {
  return m("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: m("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function lb() {
  return m("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: m("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function cb() {
  return m("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: m("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function vn({ children: e, className: t, ...n }) {
  return m("button", { type: "button", className: ge(["react-flow__controls-button", t]), ...n, children: e });
}
const ub = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function $l({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: u, position: f = "bottom-left", orientation: d = "vertical", "aria-label": h }) {
  const p = ue(), { isInteractive: v, minZoomReached: b, maxZoomReached: y, ariaLabelConfig: _ } = ie(ub, de), { zoomIn: g, zoomOut: w, fitView: E } = sr(), k = () => {
    g(), i == null || i();
  }, C = () => {
    w(), s == null || s();
  }, A = () => {
    E(o), a == null || a();
  }, $ = () => {
    p.setState({
      nodesDraggable: !v,
      nodesConnectable: !v,
      elementsSelectable: !v
    }), l == null || l(!v);
  };
  return D(wt, { className: ge(["react-flow__controls", d === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? _["controls.ariaLabel"], children: [t && D(_e, { children: [m(vn, { onClick: k, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: y, children: m(ib, {}) }), m(vn, { onClick: C, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: b, children: m(sb, {}) })] }), n && m(vn, { className: "react-flow__controls-fitview", onClick: A, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: m(ab, {}) }), r && m(vn, { className: "react-flow__controls-interactive", onClick: $, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: v ? m(cb, {}) : m(lb, {}) }), u] });
}
$l.displayName = "Controls";
const Al = fe($l);
function db({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: u, shapeRendering: f, selected: d, onClick: h }) {
  const { background: p, backgroundColor: v } = i || {}, b = s || p || v;
  return m("rect", { className: ge(["react-flow__minimap-node", { selected: d }, c]), x: t, y: n, rx: u, ry: u, width: r, height: o, style: {
    fill: b,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: h ? (y) => h(y, e) : void 0 });
}
const fb = fe(db), hb = (e) => e.nodes.map((t) => t.id), Mr = (e) => e instanceof Function ? e : () => e;
function pb({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = fb,
  onClick: s
}) {
  const a = ie(hb, de), l = Mr(t), c = Mr(e), u = Mr(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return m(_e, { children: a.map((d) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    m(mb, { id: d, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: u, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, d)
  )) });
}
function gb({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: u, y: f, width: d, height: h } = ie((p) => {
    const v = p.nodeLookup.get(e);
    if (!v)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const b = v.internals.userNode, { x: y, y: _ } = v.internals.positionAbsolute, { width: g, height: w } = Ve(b);
    return {
      node: b,
      x: y,
      y: _,
      width: g,
      height: w
    };
  }, de);
  return !c || c.hidden || !Ea(c) ? null : m(a, { x: u, y: f, width: d, height: h, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const mb = fe(gb);
var yb = fe(pb);
const wb = 200, xb = 150, bb = (e) => !e.hidden, vb = (e) => {
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
    boundingRect: n ? va(on(e.nodeLookup, { filter: bb }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, rs = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, _b = (e, t) => rs(e.viewBB, t.viewBB) && rs(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, kb = "react-flow__minimap-desc";
function Ll({
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
  maskStrokeColor: u,
  maskStrokeWidth: f,
  position: d = "bottom-right",
  onClick: h,
  onNodeClick: p,
  pannable: v = !1,
  zoomable: b = !1,
  ariaLabel: y,
  inversePan: _,
  zoomStep: g = 1,
  offsetScale: w = 5
}) {
  const E = ue(), k = re(null), { boundingRect: C, panZoom: A, viewBB: $, rfId: H, translateExtent: z, flowWidth: V, flowHeight: R, ariaLabelConfig: x } = ie(vb, _b), N = (e == null ? void 0 : e.width) ?? wb, S = (e == null ? void 0 : e.height) ?? xb, I = C.width / N, L = C.height / S, M = Math.max(I, L), T = M * N, O = M * S, B = w * M, j = C.x - (T - C.width) / 2 - B, Y = C.y - (O - C.height) / 2 - B, Q = T + B * 2, U = O + B * 2, X = `${kb}-${H}`, P = re(0), W = re();
  P.current = M, le(() => {
    const ee = E.getState().panZoom;
    if (k.current && ee)
      return W.current = Ey({
        domNode: k.current,
        panZoom: ee,
        getTransform: () => E.getState().transform,
        getViewScale: () => P.current
      }), () => {
        var te;
        (te = W.current) == null || te.destroy();
      };
  }, [A]), le(() => {
    var ee;
    (ee = W.current) == null || ee.update({
      translateExtent: z,
      width: V,
      height: R,
      inversePan: _,
      pannable: v,
      zoomStep: g,
      zoomable: b
    });
  }, [v, b, _, g, z, V, R]);
  const K = h ? (ee) => {
    var ae;
    const [te, ne] = ((ae = W.current) == null ? void 0 : ae.pointer(ee)) || [0, 0];
    h(ee, { x: te, y: ne });
  } : void 0, Z = Pe((ee, te) => {
    const ne = E.getState().nodeLookup.get(te).internals.userNode;
    p == null || p(ee, ne);
  }, [p]), q = p ? Z : void 0, J = y ?? x["minimap.ariaLabel"];
  return m(wt, { position: d, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * M : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: ge(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: D("svg", { width: N, height: S, viewBox: `${j} ${Y} ${Q} ${U}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": X, ref: k, onClick: K, children: [J && m("title", { id: X, children: J }), m(yb, { onClick: q, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), m("path", { className: "react-flow__minimap-mask", d: `M${j - B},${Y - B}h${Q + B * 2}v${U + B * 2}h${-Q - B * 2}z
        M${$.x},${$.y}h${$.width}v${$.height}h${-$.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Ll.displayName = "MiniMap";
const zl = fe(Ll), Eb = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, Sb = {
  [At.Line]: "right",
  [At.Handle]: "bottom-right"
};
function Nb({ nodeId: e, position: t, variant: n = At.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: d, autoScale: h = !0, shouldResize: p, onResizeStart: v, onResize: b, onResizeEnd: y }) {
  const _ = sl(), g = typeof e == "string" ? e : _, w = ue(), E = re(null), k = n === At.Handle, C = ie(Pe(Eb(k && h), [k, h]), de), A = re(null), $ = t ?? Sb[n];
  le(() => {
    if (!(!E.current || !g))
      return A.current || (A.current = Dy({
        domNode: E.current,
        nodeId: g,
        getStoreItems: () => {
          const { nodeLookup: z, transform: V, snapGrid: R, snapToGrid: x, nodeOrigin: N, domNode: S } = w.getState();
          return {
            nodeLookup: z,
            transform: V,
            snapGrid: R,
            snapToGrid: x,
            nodeOrigin: N,
            paneDomNode: S
          };
        },
        onChange: (z, V) => {
          const { triggerNodeChanges: R, nodeLookup: x, parentLookup: N, nodeOrigin: S } = w.getState(), I = [], L = { x: z.x, y: z.y }, M = x.get(g);
          if (M && M.expandParent && M.parentId) {
            const T = M.origin ?? S, O = z.width ?? M.measured.width ?? 0, B = z.height ?? M.measured.height ?? 0, j = {
              id: M.id,
              parentId: M.parentId,
              rect: {
                width: O,
                height: B,
                ...Sa({
                  x: z.x ?? M.position.x,
                  y: z.y ?? M.position.y
                }, { width: O, height: B }, M.parentId, x, T)
              }
            }, Y = _o([j], x, N, S);
            I.push(...Y), L.x = z.x ? Math.max(T[0] * O, z.x) : void 0, L.y = z.y ? Math.max(T[1] * B, z.y) : void 0;
          }
          if (L.x !== void 0 && L.y !== void 0) {
            const T = {
              id: g,
              type: "position",
              position: { ...L }
            };
            I.push(T);
          }
          if (z.width !== void 0 && z.height !== void 0) {
            const O = {
              id: g,
              type: "dimensions",
              resizing: !0,
              setAttributes: d ? d === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: z.width,
                height: z.height
              }
            };
            I.push(O);
          }
          for (const T of V) {
            const O = {
              ...T,
              type: "position"
            };
            I.push(O);
          }
          R(I);
        },
        onEnd: ({ width: z, height: V }) => {
          const R = {
            id: g,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: z,
              height: V
            }
          };
          w.getState().triggerNodeChanges([R]);
        }
      })), A.current.update({
        controlPosition: $,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: u
        },
        keepAspectRatio: f,
        resizeDirection: d,
        onResizeStart: v,
        onResize: b,
        onResizeEnd: y,
        shouldResize: p
      }), () => {
        var z;
        (z = A.current) == null || z.destroy();
      };
  }, [
    $,
    a,
    l,
    c,
    u,
    f,
    v,
    b,
    y,
    p
  ]);
  const H = $.split("-");
  return m("div", { className: ge(["react-flow__resize-control", "nodrag", ...H, n, r]), ref: E, style: {
    ...o,
    scale: C,
    ...s && { [k ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
fe(Nb);
const Cb = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", So = 0.05, Tl = 370, os = "system-map-flow-css", Mb = `
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
if (!document.getElementById(os)) {
  const e = document.createElement("style");
  e.id = os, e.textContent = Cb + Mb, document.head.appendChild(e);
}
function Ol(e, t) {
  const n = sr(), r = ie((s) => s.width), o = ie((s) => s.height), i = re(!1);
  le(() => {
    if (!r || !o || e.length === 0) return;
    const s = Math.min(...e.map((d) => d.x)), a = Math.min(...e.map((d) => d.y)), l = Math.max(...e.map((d) => d.x + d.width)), c = Math.max(...e.map((d) => d.y + d.height)), u = Math.min(t, r * 0.5), f = nr(
      { x: s, y: a, width: l - s, height: c - a },
      r - u,
      o,
      So,
      1,
      0.05
    );
    n.setViewport(f, { duration: i.current ? 200 : 0 }), i.current = !0;
  }, [n, e, t, r, o]);
}
const Mn = { names: 210, keys: 240, columns: 240 }, Kr = 34, Wt = 20, Ib = fe(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, working: s, focused: a, width: l, large: c } = t, u = n.status === "external";
  return /* @__PURE__ */ D(
    "div",
    {
      style: {
        width: l,
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `1px ${u ? "dashed" : "solid"} ${a ? "var(--accent, #2563eb)" : "var(--border-strong, #a1a1aa)"}`,
        boxShadow: a ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : void 0,
        fontSize: 12
      },
      children: [
        /* @__PURE__ */ m(it, { type: "target", position: G.Left, isConnectable: !1 }),
        /* @__PURE__ */ m(it, { type: "source", position: G.Right, isConnectable: !1 }),
        /* @__PURE__ */ D(
          "div",
          {
            style: {
              height: Kr,
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
              /* @__PURE__ */ m("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ D("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                s > 0 && /* @__PURE__ */ D("span", { style: { fontWeight: s > 1 ? 600 : 400, color: s > 1 ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
                  s,
                  " at work"
                ] }),
                i > 0 && /* @__PURE__ */ m("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ m("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                u && /* @__PURE__ */ m("span", { style: oe, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((f) => /* @__PURE__ */ D(
          "div",
          {
            style: { height: Wt, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ m("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: f.primary ? "PK" : f.foreign ? "FK" : "" }),
              /* @__PURE__ */ m("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: f.name }),
              /* @__PURE__ */ m("span", { style: { ...oe, ...Qe, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: f.type })
            ]
          },
          f.name
        )),
        o > 0 && /* @__PURE__ */ D("div", { style: { ...oe, height: Wt, padding: "0 10px", lineHeight: `${Wt}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), $b = { table: Ib };
function Pl(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Wn(e, t) {
  if (t === "names") return Kr + 2;
  const n = Pl(e, t).length;
  return Kr + n * Wt + (n < e.columns.length ? Wt : 0) + 2;
}
function Ab(e, t) {
  const n = Mn[t], r = new Ln.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Wn(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  Ln.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Wn(a, t) / 2 });
  }
  return s;
}
function Lb(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const Zr = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function zb(e) {
  return (Zr.find(([t]) => t === e) ?? Zr[2])[1];
}
function Tb() {
  return /* @__PURE__ */ D(
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
        /* @__PURE__ */ m("span", { style: oe, children: "On delete" }),
        Zr.map(([e, t]) => /* @__PURE__ */ D("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ m("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function Ob({
  graph: e,
  selected: t,
  flagged: n,
  working: r,
  density: o,
  onSelect: i
}) {
  const { mode: s } = cs(), a = ce(() => t ? Lb(e, t) : e, [e, t]), l = t && o === "names" ? "keys" : o, c = ce(() => Ab(a, l), [a, l]), u = ce(
    () => a.tables.map((h) => {
      const p = Pl(h, l);
      return {
        id: h.id,
        type: "table",
        position: c.get(h.id) ?? { x: 0, y: 0 },
        width: Mn[l],
        height: Wn(h, l),
        data: {
          table: h,
          columns: p,
          hidden: l === "names" ? 0 : h.columns.length - p.length,
          flags: n.get(h.id) ?? 0,
          working: r.get(h.id) ?? 0,
          focused: h.id === t,
          width: Mn[l],
          large: l === "names"
        }
      };
    }),
    [a, l, c, n, r, t]
  ), f = ce(
    () => a.edges.map((h) => {
      const p = zb(h.on_delete);
      return {
        id: h.id,
        source: h.source,
        target: h.target,
        selectable: !1,
        markerEnd: { type: Mt.ArrowClosed, width: 14, height: 14, color: p },
        style: { stroke: p, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [a, t]
  ), d = ce(
    () => a.tables.map((h) => ({
      ...c.get(h.id) ?? { x: 0, y: 0 },
      width: Mn[l],
      height: Wn(h, l)
    })),
    [a, c, l]
  );
  return Ol(d, t ? Tl : 0), /* @__PURE__ */ D(
    Cl,
    {
      nodes: u,
      edges: f,
      nodeTypes: $b,
      colorMode: s,
      minZoom: So,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (h, p) => i(p.id),
      onPaneClick: () => i(null),
      children: [
        /* @__PURE__ */ m(Il, { gap: 24, size: 1 }),
        /* @__PURE__ */ m(Al, { showInteractive: !1 }),
        /* @__PURE__ */ m(zl, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ m(wt, { position: "top-left", children: /* @__PURE__ */ m(Tb, {}) })
      ]
    }
  );
}
function Pb(e) {
  return /* @__PURE__ */ m("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ m(Eo, { children: /* @__PURE__ */ m(Ob, { ...e }) }) });
}
const Db = ["high", "medium", "low", "info"];
function Rb({
  findings: e,
  onShow: t,
  onAsk: n
}) {
  const [r, o] = se(null), i = ce(() => {
    const a = /* @__PURE__ */ new Map();
    for (const l of e) a.set(l.severity, (a.get(l.severity) ?? 0) + 1);
    return a;
  }, [e]), s = r ? e.filter((a) => a.severity === r) : e;
  return /* @__PURE__ */ D("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ D(me, { primary: r === null, onClick: () => o(null), children: [
        "All ",
        e.length
      ] }),
      Db.filter((a) => i.get(a)).map((a) => /* @__PURE__ */ D(me, { primary: r === a, onClick: () => o(a), children: [
        a,
        " ",
        i.get(a)
      ] }, a))
    ] }),
    s.length === 0 && /* @__PURE__ */ m("p", { style: oe, children: "No findings." }),
    s.map((a) => /* @__PURE__ */ D("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ D("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ m(jn, { severity: a.severity }),
        /* @__PURE__ */ m("span", { style: { flex: 1, fontWeight: 600 }, children: a.title }),
        /* @__PURE__ */ m("button", { style: ft, onClick: () => t(a.node), children: "Show" }),
        /* @__PURE__ */ m("button", { style: ft, onClick: () => n(a), children: "Ask" })
      ] }),
      /* @__PURE__ */ m("p", { style: { margin: "4px 0 0" }, children: a.detail }),
      /* @__PURE__ */ m("p", { style: { ...oe, ...Qe, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: a.evidence.join("  ") })
    ] }, a.id))
  ] });
}
const Hb = [
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
function Vb(e) {
  return Gn(e.replace(/^(module|area|route|job|service|plan|table):(public\.)?/, ""));
}
function cr({ title: e, children: t }) {
  return /* @__PURE__ */ D("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ m("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function Bb({ link: e, onOpen: t }) {
  return /* @__PURE__ */ D("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
    /* @__PURE__ */ m(
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
        children: Vb(e.node)
      }
    ),
    e.access && /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function Fb({ node: e, onOpen: t }) {
  return /* @__PURE__ */ m(_e, { children: Hb.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ m(cr, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ m(Bb, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function Wb({ node: e }) {
  const n = [
    ["Path", e.path],
    ["Files", e.files],
    ["Lines", e.lines],
    ["Test files", e.test_files],
    ["Schedule", e.schedule],
    ["Status", e.status]
  ].filter(([, r]) => r !== void 0 && r !== "");
  return /* @__PURE__ */ m("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ m("tbody", { children: n.map(([r, o]) => /* @__PURE__ */ D("tr", { children: [
    /* @__PURE__ */ m("td", { style: { ...oe, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: r }),
    /* @__PURE__ */ m("td", { style: { overflowWrap: "anywhere" }, children: o })
  ] }, r)) }) });
}
function Yb({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ m(cr, { title: `Not found (${n.length})`, children: /* @__PURE__ */ m("ul", { style: { ...Qe, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ m("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function jb({ risk: e }) {
  const t = e.covered === null ? `${e.reached_files ?? 0} of ${e.files ?? 0} files reached` : `${to(e.covered)} of lines`, n = e.hot && e.untested ? "Hot and untested" : e.hot ? "Hot" : e.untested ? "Untested" : null;
  return /* @__PURE__ */ D(cr, { title: n ? `Risk: ${n}` : "Risk", children: [
    /* @__PURE__ */ D("p", { style: { margin: "0 0 4px" }, children: [
      e.commits,
      " commits in ",
      e.window_days,
      " days, ",
      e.complexity,
      " paths, tests: ",
      t,
      "."
    ] }),
    e.worst_files.length > 0 && /* @__PURE__ */ m("ul", { style: { ...Qe, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: e.worst_files.map((r) => /* @__PURE__ */ m("li", { title: `${r.commits} commits, ${r.complexity} paths`, children: Gn(r.path) }, r.path)) })
  ] });
}
function Gb({ names: e, overlaps: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ D(cr, { title: `Worktrees on it (${e.length})`, children: [
    /* @__PURE__ */ m("ul", { style: { margin: 0, paddingLeft: 14, overflowWrap: "anywhere" }, children: e.map((n) => /* @__PURE__ */ m("li", { children: n }, n)) }),
    t.map((n) => /* @__PURE__ */ D("p", { style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "6px 0 0" }, children: [
      /* @__PURE__ */ m(jn, { severity: n.severity }),
      /* @__PURE__ */ m("span", { children: n.summary })
    ] }, `${n.a}|${n.b}`))
  ] });
}
function Xb({
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
  return /* @__PURE__ */ D(
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
        /* @__PURE__ */ D("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ m("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.name }),
          !l && /* @__PURE__ */ m(we, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ m(me, { primary: !0, onClick: r, disabled: !s, children: "Ask" }),
          /* @__PURE__ */ m(me, { onClick: i, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ D("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          /* @__PURE__ */ m(Gb, { names: t, overlaps: n }),
          e.risk && /* @__PURE__ */ m(jb, { risk: e.risk }),
          l ? /* @__PURE__ */ m(Vc, { node: e, onAsk: a }) : /* @__PURE__ */ m(Wb, { node: e }),
          !l && /* @__PURE__ */ m(Yb, { node: e }),
          /* @__PURE__ */ m(Fb, { node: e, onOpen: o }),
          !l && /* @__PURE__ */ m("p", { style: { ...oe, ...Qe, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (c = e.evidence) == null ? void 0 : c.join("  ") })
        ] })
      ]
    }
  );
}
const Ub = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], qb = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, Kb = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function Zb({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ D("div", { style: Kb, "data-testid": e.id, children: [
    /* @__PURE__ */ m("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ D("p", { style: { ...oe, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      qb[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ D("ul", { style: { ...Qe, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ m("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ D("li", { style: oe, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ D("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ m("button", { style: ft, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ m("button", { style: ft, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ m("span", { style: { flex: 1 } }),
      /* @__PURE__ */ D(
        "select",
        {
          "aria-label": `Status of ${e.name}`,
          value: e.status_source === "you" ? e.status : "",
          onChange: (i) => r(e.id, i.target.value || null),
          style: { fontSize: 11, background: "transparent", color: "var(--muted, #71717a)", border: 0 },
          children: [
            /* @__PURE__ */ m("option", { value: "", children: "Auto" }),
            /* @__PURE__ */ m("option", { value: "built", children: "Mark built" }),
            /* @__PURE__ */ m("option", { value: "partial", children: "Mark partly built" }),
            /* @__PURE__ */ m("option", { value: "planned", children: "Mark not built" })
          ]
        }
      )
    ] })
  ] });
}
function Qb({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ D("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ D("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ m("strong", { children: o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 13 }, children: "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ m("p", { style: oe, children: "No specs found in docs/specs, docs/plans or specs." }),
    /* @__PURE__ */ m("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: Ub.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ D("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ D("div", { children: [
          /* @__PURE__ */ D("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ m(we, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ m("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ m(Zb, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function Jb({ count: e, on: t, onToggle: n }) {
  return /* @__PURE__ */ D(me, { primary: t, onClick: n, title: "Show unfinished plans on the map", children: [
    "Plans on map ",
    e
  ] });
}
const ev = [
  { key: "commits", label: "Commits", title: "Commits that changed it in the window" },
  { key: "complexity", label: "Paths", title: "Places the code can take a second path" },
  { key: "cover", label: "Tests", title: "Share of lines tests run. With no report, how much of it any test reaches." },
  { key: "lines", label: "Lines", title: "Lines of code" }
], Ue = { padding: "5px 8px", textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, Ir = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--muted, #71717a)" }, is = { background: "transparent", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--accent, #2563eb)" };
function tv({ share: e }) {
  return /* @__PURE__ */ D("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ m("span", { style: { width: 52, height: 6, borderRadius: 3, overflow: "hidden", background: "var(--border, #e4e4e7)" }, children: /* @__PURE__ */ m("span", { style: { display: "block", height: "100%", width: `${Math.round(e * 100)}%`, background: "var(--accent, #2563eb)" } }) }),
    /* @__PURE__ */ m("span", { style: { minWidth: 32, textAlign: "right" }, children: to(e) })
  ] });
}
function nv({ row: e }) {
  return e.hot && e.untested ? /* @__PURE__ */ m(we, { variant: "err", children: "Hot, untested" }) : e.hot ? /* @__PURE__ */ m(we, { variant: "warn", children: "Hot" }) : e.untested ? /* @__PURE__ */ m(we, { variant: "muted", children: "Untested" }) : null;
}
function rv(e, t) {
  return t === "files" ? `${e.tests ?? 0} reach it` : `${e.reached_files ?? 0} of ${e.files ?? 0} files`;
}
function ov({ risk: e, canAsk: t, error: n, onLoad: r, onRun: o }) {
  const i = e.coverage;
  return /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
    i ? /* @__PURE__ */ D(_e, { children: [
      /* @__PURE__ */ D(we, { variant: "muted", children: [
        to(i.lines_hit / i.lines_total),
        " of lines run by tests"
      ] }),
      /* @__PURE__ */ D("span", { style: oe, children: [
        i.commit ? `Report from ${i.commit.slice(0, 7)}` : "Report from an unknown commit",
        i.files_changed_since ? `, ${i.files_changed_since} files changed since` : ""
      ] })
    ] }) : /* @__PURE__ */ m("span", { style: oe, children: "No coverage report yet. Showing which tests reach each file through imports." }),
    /* @__PURE__ */ m("span", { style: { flex: 1 } }),
    n && /* @__PURE__ */ m("span", { style: { color: "var(--danger, #dc2626)" }, children: n }),
    /* @__PURE__ */ m(me, { onClick: r, children: i ? "Reload report" : "Load report" }),
    /* @__PURE__ */ m(me, { onClick: o, disabled: !t, children: "Run tests in chat" })
  ] });
}
function iv({
  risk: e,
  canAsk: t,
  error: n,
  onShow: r,
  onAsk: o,
  onLoad: i,
  onRun: s
}) {
  const [a, l] = se("modules"), [c, u] = se(!0), [f, d] = se(!1), [h, p] = se("score"), v = e.coverage !== null, b = ce(() => e[a].filter((w) => a === "modules" || !f || !w.ui), [e, a, f]), y = b.filter((w) => w.hot && w.untested), _ = ce(() => {
    const w = c ? y : b;
    if (h === "score") return w;
    const E = h === "cover" ? 1 : -1;
    return [...w].sort((k, C) => E * (k[h] - C[h]));
  }, [b, c, h]), g = a === "modules" ? "module" : "file";
  return /* @__PURE__ */ D("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 10, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ D("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "risk-summary", children: [
      /* @__PURE__ */ m("strong", { children: y.length === 0 ? "Nothing busy is short of tests." : `${y.length} busy ${g}${y.length === 1 ? " has" : "s have"} little test cover.` }),
      " ",
      /* @__PURE__ */ D("span", { style: { ...oe, fontSize: 13 }, children: [
        "Busy means more commits than three in four others, over ",
        e.window_days,
        " days. Little cover means under half."
      ] })
    ] }),
    !e.history_known && /* @__PURE__ */ m("p", { style: { ...oe, margin: 0, fontSize: 13 }, children: "No git history here, so commits are not counted." }),
    e.shallow && /* @__PURE__ */ m("p", { style: { ...oe, margin: 0, fontSize: 13 }, children: "This is a shallow clone, so commits are undercounted." }),
    /* @__PURE__ */ m(ov, { risk: e, canAsk: t, error: n, onLoad: i, onRun: s }),
    /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ m(me, { primary: a === "modules", onClick: () => l("modules"), children: "Modules" }),
      /* @__PURE__ */ m(me, { primary: a === "files", onClick: () => l("files"), children: "Files" }),
      /* @__PURE__ */ m("span", { style: { width: 8 } }),
      /* @__PURE__ */ m(me, { primary: c, onClick: () => u((w) => !w), children: "Hot and untested only" }),
      a === "files" && /* @__PURE__ */ m(me, { primary: f, onClick: () => d((w) => !w), title: "Browser tests cover screens, and they are not in this report", children: "Hide screens" })
    ] }),
    /* @__PURE__ */ D("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
      /* @__PURE__ */ D("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, "data-testid": "risk-table", children: [
        /* @__PURE__ */ m("thead", { children: /* @__PURE__ */ D("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ m("th", { style: { ...Ue, textAlign: "left" }, children: /* @__PURE__ */ D("button", { style: Ir, onClick: () => p("score"), title: "Commits, times paths, times what tests miss", children: [
            a === "modules" ? "Module" : "File",
            ", worst first"
          ] }) }),
          ev.map((w) => /* @__PURE__ */ m("th", { style: Ue, children: /* @__PURE__ */ m("button", { style: { ...Ir, color: h === w.key ? "var(--text, inherit)" : Ir.color }, title: w.title, onClick: () => p(w.key), children: w.label }) }, w.key)),
          /* @__PURE__ */ m("th", { style: Ue })
        ] }) }),
        /* @__PURE__ */ m("tbody", { children: _.map((w) => /* @__PURE__ */ D("tr", { style: { borderBottom: "1px solid var(--border, #e4e4e7)" }, children: [
          /* @__PURE__ */ D("td", { style: { ...Ue, textAlign: "left", whiteSpace: "normal", overflowWrap: "anywhere" }, children: [
            /* @__PURE__ */ m(
              "button",
              {
                onClick: () => r(w.id ?? w.module ?? ""),
                title: a === "files" ? "Show its module on the map" : "Show on the map",
                style: a === "files" ? { ...is, ...Qe } : is,
                children: Gn(w.path)
              }
            ),
            " ",
            /* @__PURE__ */ m(nv, { row: w })
          ] }),
          /* @__PURE__ */ m("td", { style: Ue, children: w.commits }),
          /* @__PURE__ */ m("td", { style: Ue, children: w.complexity }),
          /* @__PURE__ */ m("td", { style: Ue, children: v ? /* @__PURE__ */ m(tv, { share: w.covered ?? 0 }) : /* @__PURE__ */ m("span", { style: oe, children: rv(w, a) }) }),
          /* @__PURE__ */ m("td", { style: Ue, children: w.lines }),
          /* @__PURE__ */ m("td", { style: Ue, children: /* @__PURE__ */ m("button", { style: ft, onClick: () => o(w.id ?? w.path), disabled: !t, children: "Ask" }) })
        ] }, w.path)) })
      ] }),
      _.length === 0 && /* @__PURE__ */ m("p", { style: { ...oe, fontSize: 13 }, children: "Nothing to show here." })
    ] })
  ] });
}
const Jt = 200, en = 58, ss = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, sv = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)"
}, Qr = {
  imports: { color: "var(--border-strong, #a1a1aa)", label: "imports" },
  renders: { color: "var(--muted, #71717a)", label: "renders" },
  uses_table: { color: "var(--accent, #2563eb)", label: "uses table" },
  uses_service: { color: "var(--warn-text, #b45309)", label: "uses service" },
  calls: { color: "var(--text, #18181b)", label: "calls" },
  touches: { color: "var(--danger, #dc2626)", dashed: !0, label: "plan touches" }
}, In = {
  "hot-untested": { color: "var(--danger, #dc2626)", label: "hot, untested" },
  hot: { color: "var(--warn-text, #b45309)", label: "hot" }
}, av = fe(function({ data: t }) {
  const { card: n, focused: r, work: o, band: i } = t, s = n.kind === "plan", a = n.kind === "service", l = o.length > 1, c = s ? sv[n.status ?? "unclear"] : l ? "var(--warn-text, #b45309)" : void 0, u = r ? "var(--accent, #2563eb)" : c ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ D(
    "div",
    {
      title: o.length ? `Worktrees here: ${o.join(", ")}` : void 0,
      style: {
        width: Jt,
        height: en,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 12px",
        borderRadius: a ? 29 : 8,
        background: n.kind === "group" ? "var(--bg-hover, #f4f4f5)" : "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${r || l ? 2 : 1}px ${s || a ? "dashed" : "solid"} ${u}`,
        boxShadow: [i ? `inset 5px 0 0 ${In[i].color}` : "", r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : ""].filter(Boolean).join(", ") || void 0
      },
      children: [
        /* @__PURE__ */ m(it, { type: "target", position: G.Left, isConnectable: !1 }),
        /* @__PURE__ */ m(it, { type: "source", position: G.Right, isConnectable: !1 }),
        /* @__PURE__ */ D("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ m("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          s && /* @__PURE__ */ m("span", { style: { fontSize: 11, color: c, flexShrink: 0 }, children: n.status }),
          i && /* @__PURE__ */ m("span", { style: { fontSize: 11, color: In[i].color, flexShrink: 0 }, children: In[i].label })
        ] }),
        /* @__PURE__ */ D("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [ss[n.kind] && n.kind !== "area" && n.kind !== "plan" ? ss[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") }),
          o.length > 0 && /* @__PURE__ */ D("span", { style: { fontSize: 11, flexShrink: 0, fontWeight: l ? 600 : 400, color: l ? "var(--warn-text, #b45309)" : "var(--accent, #2563eb)" }, children: [
            o.length,
            " at work"
          ] })
        ] })
      ]
    }
  );
}), lv = { card: av };
function cv(e) {
  const t = new Ln.graphlib.Graph({ multigraph: !0 });
  t.setGraph({ rankdir: "LR", nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), t.setDefaultEdgeLabel(() => ({}));
  for (const r of e.cards) t.setNode(r.id, { width: Jt, height: en });
  for (const r of e.lines)
    r.source !== r.target && t.setEdge(r.source, r.target, {}, r.id);
  Ln.layout(t);
  const n = /* @__PURE__ */ new Map();
  for (const r of e.cards) {
    const o = t.node(r.id);
    n.set(r.id, { x: o.x - Jt / 2, y: o.y - en / 2 });
  }
  return n;
}
function uv(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function dv(e) {
  const t = Qr[e.kind] ?? Qr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: Mt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: uv(e.count),
      strokeDasharray: t.dashed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function fv({ kinds: e, top: t, risk: n }) {
  const r = Object.entries(Qr).filter(([o]) => e.has(o));
  return /* @__PURE__ */ D(
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
        r.map(([o, i]) => /* @__PURE__ */ D("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ m("span", { style: { width: 14, height: 0, borderTop: `2px ${i.dashed ? "dashed" : "solid"} ${i.color}` } }),
          i.label
        ] }, o)),
        n && Object.values(In).map((o) => /* @__PURE__ */ D("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ m("span", { style: { width: 5, height: 12, background: o.color } }),
          o.label
        ] }, o.label)),
        t && /* @__PURE__ */ m("span", { style: oe, children: "Thin links hidden" })
      ]
    }
  );
}
function hv({ system: e, focus: t, onFocus: n }) {
  const r = jc(e, t);
  return /* @__PURE__ */ m(
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
        return /* @__PURE__ */ D("span", { style: { display: "flex", gap: 6 }, children: [
          i > 0 && /* @__PURE__ */ m("span", { style: oe, children: "/" }),
          /* @__PURE__ */ m(
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
function pv({
  system: e,
  focus: t,
  tables: n,
  showPlans: r,
  inspecting: o,
  risk: i,
  worktrees: s,
  onFocus: a,
  onOpenTables: l
}) {
  const { mode: c } = cs(), u = ce(() => Bc(e, t, n, r), [e, t, n, r]), f = ce(() => cv(u), [u]), d = ce(() => Fc(i), [i]), h = s == null ? void 0 : s.by_node, p = ce(
    () => u.cards.map((g) => ({
      id: g.id,
      type: "card",
      position: f.get(g.id) ?? { x: 0, y: 0 },
      width: Jt,
      height: en,
      data: { card: g, focused: g.id === t, work: h ? Yc(g.id, h) : [], band: Wc(d.get(g.id)) }
    })),
    [u, f, t, d, h]
  ), v = ce(() => u.lines.map(dv), [u]), b = ce(
    () => u.cards.map((g) => ({ ...f.get(g.id) ?? { x: 0, y: 0 }, width: Jt, height: en })),
    [u, f]
  );
  Ol(b, o ? Tl : 0);
  const y = ce(() => new Set(u.lines.map((g) => g.kind)), [u]), _ = (g) => {
    if (g === Gc) l();
    else {
      if (g !== Xc && g !== Uc && g === t) return;
      a(g);
    }
  };
  return /* @__PURE__ */ D(
    Cl,
    {
      nodes: p,
      edges: v,
      nodeTypes: lv,
      colorMode: c,
      minZoom: So,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (g, w) => _(w.id),
      children: [
        /* @__PURE__ */ m(Il, { gap: 24, size: 1 }),
        /* @__PURE__ */ m(Al, { showInteractive: !1 }),
        /* @__PURE__ */ m(zl, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ m(wt, { position: "top-left", children: /* @__PURE__ */ m(hv, { system: e, focus: t, onFocus: a }) }),
        /* @__PURE__ */ m(wt, { position: "bottom-center", children: /* @__PURE__ */ m(fv, { kinds: y, top: t === null, risk: i !== null }) })
      ]
    }
  );
}
function gv(e) {
  return /* @__PURE__ */ m("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ m(Eo, { children: /* @__PURE__ */ m(pv, { ...e }) }) });
}
const Dl = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
}, mv = { background: "transparent", border: 0, padding: 0, cursor: "pointer", fontSize: 12, color: "var(--accent, #2563eb)", textAlign: "left", overflowWrap: "anywhere" }, yv = { ...Qe, margin: "2px 0 0", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, $r = 6;
function wv(e) {
  return Gn(e.replace(/^(module|table|route|plan|job):(public\.)?/, ""));
}
function We({ title: e, children: t }) {
  return /* @__PURE__ */ D("div", { style: { marginTop: 6 }, children: [
    /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 12 }, children: e }),
    t
  ] });
}
function rt({ ids: e, onShow: t }) {
  return /* @__PURE__ */ m("div", { style: { display: "flex", flexWrap: "wrap", gap: "2px 10px" }, children: e.map((n) => /* @__PURE__ */ m("button", { style: mv, onClick: () => t(n), children: wv(n) }, n)) });
}
function as({ files: e }) {
  return /* @__PURE__ */ D("ul", { style: yv, children: [
    e.slice(0, $r).map((t) => /* @__PURE__ */ m("li", { children: t }, t)),
    e.length > $r && /* @__PURE__ */ D("li", { style: oe, children: [
      "and ",
      e.length - $r,
      " more"
    ] })
  ] });
}
const Rl = {
  uncommitted: "Uncommitted work, so no trial merge yet",
  unknown: "Git could not try this merge"
};
function xv({ row: e, canAsk: t, onAsk: n }) {
  const r = Rl[e.merge];
  return /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }, title: e.files.join(`
`), "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ m(jn, { severity: e.severity }),
    /* @__PURE__ */ D("span", { style: { flex: 1, overflowWrap: "anywhere" }, children: [
      e.summary,
      r && /* @__PURE__ */ D("span", { style: oe, children: [
        ". ",
        r
      ] })
    ] }),
    /* @__PURE__ */ m("button", { style: ft, onClick: () => n(e), disabled: !t, children: "Ask" })
  ] });
}
function bv({ row: e, canAsk: t, onShow: n, onAsk: r }) {
  const o = e.files.filter((s) => !e.conflicts.includes(s)), i = Rl[e.merge];
  return /* @__PURE__ */ D("div", { style: Dl, "data-testid": `overlap-${e.severity}`, children: [
    /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" }, children: [
      /* @__PURE__ */ m(jn, { severity: e.severity }),
      /* @__PURE__ */ m("span", { style: { flex: 1, fontWeight: 600, overflowWrap: "anywhere" }, children: e.summary }),
      /* @__PURE__ */ m("button", { style: ft, onClick: () => r(e), disabled: !t, children: "Ask" })
    ] }),
    e.conflicts.length > 0 && /* @__PURE__ */ m(We, { title: "Conflicts in a trial merge", children: /* @__PURE__ */ m(as, { files: e.conflicts }) }),
    e.schema.length > 0 && /* @__PURE__ */ m(We, { title: "Both change these tables", children: /* @__PURE__ */ m(rt, { ids: e.schema, onShow: n }) }),
    e.schema_and_code.length > 0 && /* @__PURE__ */ m(We, { title: "One changes these tables, the other their code", children: /* @__PURE__ */ m(rt, { ids: e.schema_and_code, onShow: n }) }),
    e.code.length > 0 && /* @__PURE__ */ m(We, { title: "Both change code that uses these tables", children: /* @__PURE__ */ m(rt, { ids: e.code, onShow: n }) }),
    o.length > 0 && /* @__PURE__ */ m(We, { title: "Also share", children: /* @__PURE__ */ m(as, { files: o }) }),
    e.modules.length > 0 && /* @__PURE__ */ m(We, { title: "Same modules", children: /* @__PURE__ */ m(rt, { ids: e.modules, onShow: n }) }),
    i && /* @__PURE__ */ m("p", { style: { ...oe, margin: "6px 0 0", fontSize: 12 }, children: i })
  ] });
}
function vv({ tree: e, onShow: t }) {
  const n = e.other_nodes.filter((r) => !r.startsWith("job:"));
  return /* @__PURE__ */ D("div", { style: Dl, "data-testid": "worktree", children: [
    /* @__PURE__ */ m("p", { style: { margin: 0, fontWeight: 600, overflowWrap: "anywhere" }, children: e.name }),
    /* @__PURE__ */ m("p", { style: { ...oe, ...Qe, margin: "2px 0 4px", fontSize: 11, overflowWrap: "anywhere" }, children: e.path }),
    /* @__PURE__ */ D("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ D(we, { variant: "muted", children: [
        e.ahead,
        " ahead"
      ] }),
      e.behind > 0 && /* @__PURE__ */ D(we, { variant: "muted", children: [
        e.behind,
        " behind"
      ] }),
      e.uncommitted_files > 0 && /* @__PURE__ */ D(we, { variant: "warn", children: [
        e.uncommitted_files,
        " uncommitted"
      ] }),
      /* @__PURE__ */ D(we, { variant: "muted", children: [
        e.files.length,
        " files"
      ] })
    ] }),
    e.tables_schema.length > 0 && /* @__PURE__ */ m(We, { title: "Changes these tables", children: /* @__PURE__ */ m(rt, { ids: e.tables_schema, onShow: t }) }),
    e.modules.length > 0 && /* @__PURE__ */ m(We, { title: "Modules", children: /* @__PURE__ */ m(rt, { ids: e.modules, onShow: t }) }),
    e.tables_code.length > 0 && /* @__PURE__ */ m(We, { title: "Code that uses", children: /* @__PURE__ */ m(rt, { ids: e.tables_code, onShow: t }) }),
    n.length > 0 && /* @__PURE__ */ m(We, { title: "Routes and plans", children: /* @__PURE__ */ m(rt, { ids: n, onShow: t }) })
  ] });
}
function _v({
  state: e,
  checkedAt: t,
  canAsk: n,
  onShow: r,
  onAsk: o
}) {
  const { high: i, medium: s } = e.counts, a = i + s, l = e.overlaps.length - a, c = e.worktrees.filter((d) => d.files.length > 0), u = e.worktrees.length - c.length, f = a === 0 ? "No collisions ahead." : `${a} collision${a === 1 ? "" : "s"} ahead.`;
  return /* @__PURE__ */ D("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)", overflow: "hidden" }, children: [
    /* @__PURE__ */ D("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "worktree-summary", children: [
      /* @__PURE__ */ m("strong", { children: f }),
      " ",
      /* @__PURE__ */ D("span", { style: { ...oe, fontSize: 13 }, children: [
        c.length,
        " of ",
        e.worktrees.length,
        " worktrees have changes",
        l ? `, with ${l} smaller overlap${l === 1 ? "" : "s"}` : "",
        ".",
        t ? ` Checked ${new Date(t).toLocaleTimeString()}.` : ""
      ] })
    ] }),
    /* @__PURE__ */ D("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }, children: [
      a > 0 && /* @__PURE__ */ m("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: e.overlaps.filter((d) => d.severity === "high" || d.severity === "medium").map((d) => /* @__PURE__ */ m(bv, { row: d, canAsk: n, onShow: r, onAsk: o }, `${d.a}|${d.b}`)) }),
      /* @__PURE__ */ D("section", { children: [
        /* @__PURE__ */ m("p", { style: { margin: "0 0 8px", fontWeight: 600, fontSize: 13 }, children: "Worktrees with changes" }),
        /* @__PURE__ */ m("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }, children: c.map((d) => /* @__PURE__ */ m(vv, { tree: d, onShow: r }, d.path)) }),
        c.length === 0 && /* @__PURE__ */ m("p", { style: { ...oe, fontSize: 13 }, children: "No worktree has changes." }),
        u > 0 && /* @__PURE__ */ D("p", { style: { ...oe, fontSize: 12, marginBottom: 0 }, children: [
          u,
          " more with nothing to merge."
        ] })
      ] }),
      l > 0 && /* @__PURE__ */ D("section", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ m("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 }, children: "Smaller overlaps" }),
        e.overlaps.filter((d) => d.severity === "low" || d.severity === "info").map((d) => /* @__PURE__ */ m(xv, { row: d, canAsk: n, onAsk: o }, `${d.a}|${d.b}`))
      ] })
    ] })
  ] });
}
const kv = "system-map-design", ls = 12, Ev = 2e4, Sv = [
  ["names", "Names"],
  ["keys", "Keys"],
  ["columns", "Columns"]
], Ar = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, Nv = [
  ["map", "Map"],
  ["data", "Data model"],
  ["plan", "Plan"],
  ["risk", "Risk"],
  ["worktrees", "Worktrees"],
  ["findings", "Findings"]
];
function Cv(e) {
  const t = Jr(), [n, r] = se(null), [o, i] = se(null);
  le(() => {
    if (!e) return;
    let a = !0;
    return (async () => {
      const c = await t.post("/api/chat/slots", { name: kv });
      await t.post(`/api/chat/slots/${encodeURIComponent(c.key)}/project`, { project: e }), a && r(c.key);
    })().catch((c) => {
      a && i(String(c));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const s = Pe(
    (a) => {
      n && t.post("/api/chat?ws=1", { message: a, slot: n, agent: "" });
    },
    [t, n]
  );
  return { slot: n, error: o, send: s };
}
function Mv() {
  const e = re(null), [t, n] = se(void 0);
  return ds(() => {
    const r = () => {
      var i;
      const o = ((i = e.current) == null ? void 0 : i.getBoundingClientRect().top) ?? 0;
      n(Math.max(420, window.innerHeight - o - 16));
    };
    return r(), window.addEventListener("resize", r), () => window.removeEventListener("resize", r);
  }, []), { ref: e, height: t };
}
function Iv({ message: e, onBuilt: t }) {
  const n = Jr(), [r, o] = se(""), [i, s] = se(!1), [a, l] = se(null), c = async () => {
    s(!0), l(null);
    try {
      const u = await n.post(`${zr}/build`, { repo_path: r.trim() });
      t(u.repo_key);
    } catch (u) {
      l(String(u));
    } finally {
      s(!1);
    }
  };
  return /* @__PURE__ */ D(_n, { children: [
    /* @__PURE__ */ m(Lr, { children: "Build a model" }),
    e && /* @__PURE__ */ m("p", { style: { ...oe, fontSize: 13 }, children: e }),
    /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ m(
        Hc,
        {
          "aria-label": "Repo path",
          placeholder: "/path/to/repo",
          value: r,
          onChange: (u) => o(u.target.value),
          style: { flex: 1 }
        }
      ),
      /* @__PURE__ */ m(me, { primary: !0, disabled: i || !r.trim(), onClick: () => void c(), children: i ? "Building" : "Build" })
    ] }),
    a && /* @__PURE__ */ m("p", { style: { fontSize: 13 }, children: a })
  ] });
}
function $v({ overview: e }) {
  const { stale: t, map_stale: n, commits_behind: r, ref: o, changed_inputs: i = [] } = e.freshness;
  return t ? /* @__PURE__ */ D(we, { variant: "warn", children: [
    i.length,
    " schema files changed on ",
    o
  ] }) : n ? /* @__PURE__ */ D(we, { variant: "warn", children: [
    "Code changed on ",
    o,
    ". Rebuild to update."
  ] }) : r > 0 ? /* @__PURE__ */ D(we, { variant: "muted", children: [
    "Current, ",
    r,
    " commits behind ",
    o
  ] }) : /* @__PURE__ */ D(we, { variant: "ok", children: [
    "Current with ",
    o
  ] });
}
function Bv() {
  var cn, un;
  const e = Jr(), { repos: t, active: n, loaded: r, choose: o, reload: i } = qc(), { overview: s, error: a, refresh: l } = Kc(n), c = s == null ? void 0 : s.manifest.version, [u, f] = se(0), d = c ? `${c}:${u}` : void 0, h = Ot("/graph", n, d), p = Ot("/system", n, d), v = ((cn = Ot("/plan", n, d)) == null ? void 0 : cn.plans) ?? [], b = ((un = Ot("/findings", n, d)) == null ? void 0 : un.findings) ?? [], y = Ot("/risk", n, d), _ = Zc("/worktrees", n, Ev), g = _.value, [w, E] = se("map"), [k, C] = se(null), [A, $] = se(null), [H, z] = se(!0), [V, R] = se(!1), [x, N] = se(!0), [S, I] = se(null), [L, M] = se("names"), [T, O] = se(!1), [B, j] = se(null), { ref: Y, height: Q } = Mv(), U = Cv(s ? s.manifest.repo : null), X = w === "map" ? A && !/^(area|group):/.test(A) ? A : null : w === "data" ? k : null, P = Qc(X, n), W = ce(() => {
    const F = /* @__PURE__ */ new Map();
    for (const be of b)
      be.severity !== "info" && F.set(be.node, (F.get(be.node) ?? 0) + 1);
    return F;
  }, [b]), K = ce(() => Jc(g), [g]), Z = v.filter((F) => F.status === "planned" || F.status === "partial").length, q = ((g == null ? void 0 : g.counts.high) ?? 0) + ((g == null ? void 0 : g.counts.medium) ?? 0), J = (y == null ? void 0 : y.modules.filter((F) => F.hot && F.untested).length) ?? 0, ee = { findings: b.length, plan: Z, risk: J, worktrees: q }, te = async () => {
    j("Checking");
    try {
      const F = await e.post(ru("/build", null), { repo: s == null ? void 0 : s.manifest.repo_key });
      j(F.unchanged ? "No changes" : "Rebuilt"), await l();
    } catch (F) {
      j(String(F));
    }
  }, ne = () => {
    P && U.send(`Use the system-map tools. Look at ${P.id} and tell me what to watch out for.`);
  }, ae = (F) => {
    U.send(`Use the system-map tools. Check finding ${F.id} on ${F.node}, read its evidence, and propose a fix.`);
  }, xe = (F) => {
    U.send(`Use the system-map tools. Look at ${F.id}, say what is left to build, and propose the next step.`);
  }, Se = (F) => {
    U.send(`Use the system-map tools. Look at ${F} and its risk. Say what is most likely to break, and which tests would help most.`);
  }, Ne = (F) => {
    U.send(`Use the system-map tools. Worktrees ${F.a} and ${F.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`);
  }, Me = () => {
    U.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.");
  }, st = async () => {
    I(null);
    try {
      await e.post(`${zr}/coverage`, { repo: s == null ? void 0 : s.manifest.repo_key }), f((F) => F + 1);
    } catch (F) {
      I(String(F));
    }
  }, Ge = async (F, be) => {
    await e.post(`${zr}/plan-status`, { repo: s == null ? void 0 : s.manifest.repo_key, id: F, status: be }), f((dr) => dr + 1);
  }, Ie = (F) => {
    E("data"), C(F);
  }, ye = (F) => {
    E("map"), $(F);
  }, $e = (F) => {
    w === "data" && F.startsWith("table:") ? C(F) : ye(F);
  }, Ae = (F) => {
    F.startsWith("table:") ? Ie(F) : ye(F);
  }, Be = (F) => {
    C(null), $(null), j(null), o(F);
  }, Tt = /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
    B && /* @__PURE__ */ m("span", { style: { ...oe, fontSize: 13 }, children: B }),
    t.length > 1 && /* @__PURE__ */ m(
      "select",
      {
        "aria-label": "Repo",
        value: (s == null ? void 0 : s.manifest.repo_key) ?? "",
        onChange: (F) => Be(F.target.value),
        style: { fontSize: 13, background: "transparent", color: "var(--text, inherit)" },
        children: t.map((F) => /* @__PURE__ */ m("option", { value: F.repo_key, children: F.repo.split("/").pop() }, F.repo_key))
      }
    ),
    /* @__PURE__ */ m(me, { onClick: () => O((F) => !F), children: "Add repo" }),
    s && /* @__PURE__ */ m(me, { onClick: () => void te(), children: "Rebuild" })
  ] }), bt = r && t.length === 0, ur = T || bt || !s && a !== null, ln = w === "map" || w === "plan";
  return /* @__PURE__ */ D(_e, { children: [
    /* @__PURE__ */ m(Rc, { title: "System Map", subtitle: s ? s.manifest.repo : "One model of your system", actions: Tt }),
    /* @__PURE__ */ D("div", { ref: Y, style: { height: Q, display: "flex", flexDirection: "column", gap: ls, padding: "0 16px", minHeight: 0 }, children: [
      ur && /* @__PURE__ */ m(
        Iv,
        {
          message: s ? null : bt ? "Point System Map at a repo." : a,
          onBuilt: (F) => {
            O(!1), Be(F), i();
          }
        }
      ),
      s && /* @__PURE__ */ D(_e, { children: [
        /* @__PURE__ */ D("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
          /* @__PURE__ */ m($v, { overview: s }),
          /* @__PURE__ */ m(we, { variant: "muted", children: s.manifest.commit.slice(0, 7) }),
          /* @__PURE__ */ m("span", { style: { flex: 1 } }),
          w === "data" && Sv.map(([F, be]) => /* @__PURE__ */ m(me, { primary: L === F, onClick: () => M(F), children: be }, F)),
          w === "map" && /* @__PURE__ */ D(_e, { children: [
            /* @__PURE__ */ m(Jb, { count: Z, on: H, onToggle: () => z((F) => !F) }),
            /* @__PURE__ */ m(me, { primary: V, onClick: () => R((F) => !F), title: "Mark hot and untested code on the map", children: "Risk on map" }),
            /* @__PURE__ */ m(me, { primary: x, onClick: () => N((F) => !F), title: "Show what each worktree is changing", children: "Worktrees on map" })
          ] }),
          /* @__PURE__ */ m("span", { style: { width: 8 } }),
          Nv.map(([F, be]) => /* @__PURE__ */ m(me, { primary: w === F, onClick: () => E(F), children: ee[F] === void 0 ? be : `${be} ${ee[F]}` }, F))
        ] }),
        /* @__PURE__ */ D(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: ls,
              gridTemplateColumns: "220px minmax(0, 1fr) minmax(320px, 26%)",
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ D(_n, { style: Ar, children: [
                /* @__PURE__ */ m(Lr, { children: ln ? "Modules" : "Tables" }),
                ln ? /* @__PURE__ */ m(eu, { nodes: (p == null ? void 0 : p.nodes) ?? [], focus: A, onSelect: ye }) : /* @__PURE__ */ m(tu, { tables: s.tables, selected: k, flagged: W, working: K, onSelect: Ie })
              ] }),
              /* @__PURE__ */ D(_n, { style: { ...Ar, padding: 0, position: "relative" }, "data-testid": "canvas", children: [
                w === "map" && p && /* @__PURE__ */ m(
                  gv,
                  {
                    system: p,
                    focus: A,
                    tables: s.manifest.counts.tables,
                    showPlans: H,
                    inspecting: X !== null,
                    risk: V ? y : null,
                    worktrees: x ? g : null,
                    onFocus: $,
                    onOpenTables: () => E("data")
                  }
                ),
                w === "data" && h && /* @__PURE__ */ m(Pb, { graph: h, selected: k, flagged: W, working: K, density: L, onSelect: C }),
                w === "plan" && /* @__PURE__ */ m(Qb, { plans: v, onShow: ye, onAsk: xe, onStatus: (F, be) => void Ge(F, be) }),
                w === "risk" && y && /* @__PURE__ */ m(
                  iv,
                  {
                    risk: y,
                    canAsk: U.slot !== null,
                    error: S,
                    onShow: ye,
                    onAsk: Se,
                    onLoad: () => void st(),
                    onRun: Me
                  }
                ),
                w === "worktrees" && g && /* @__PURE__ */ m(_v, { state: g, checkedAt: _.checkedAt, canAsk: U.slot !== null, onShow: Ae, onAsk: Ne }),
                w === "findings" && /* @__PURE__ */ m(Rb, { findings: b, onShow: Ie, onAsk: ae }),
                P && X && /* @__PURE__ */ m(
                  Xb,
                  {
                    node: P,
                    work: (g == null ? void 0 : g.by_node[X]) ?? [],
                    overlaps: nu(X, g),
                    canAsk: U.slot !== null,
                    onAsk: ne,
                    onAskFinding: ae,
                    onOpen: $e,
                    onClose: () => w === "data" ? C(null) : $(null)
                  }
                )
              ] }),
              /* @__PURE__ */ D(_n, { style: Ar, children: [
                /* @__PURE__ */ m(Lr, { children: "Design chat" }),
                U.error && /* @__PURE__ */ D("p", { style: { fontSize: 13 }, children: [
                  "Chat is not available: ",
                  U.error
                ] }),
                /* @__PURE__ */ m("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: U.slot && /* @__PURE__ */ m("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ m(Dc, { slotKey: U.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Bv as default
};
