var cc = Object.defineProperty;
var uc = (e, t, n) => t in e ? cc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ue = (e, t, n) => uc(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as E, jsxs as j, Fragment as ke } from "react/jsx-runtime";
import { useTheme as dc, useAppApi as Ir, ChatEmbed as fc } from "@kirocrew/app-sdk";
import { Btn as Te, PageHeader as hc, Badge as dt, Card as an, CardTitle as ur, Input as pc } from "@kirocrew/app-sdk/ui";
import $r, { memo as ce, forwardRef as Di, useState as ae, createContext as Cn, useCallback as Ne, useMemo as he, useContext as _t, useRef as te, useEffect as oe, useLayoutEffect as Ri } from "react";
import "react-dom";
import { M as je, a as Hi, S as gc, A as io, u as mc, b as yc, c as so, d as wc, T as xc, N as bc, w as vc, B as _c } from "./chunks/model-DyjFJPE-.mjs";
function Vi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ec = "\0", Qe = "\0", ao = "";
let kc = class {
  constructor(t) {
    ue(this, "_isDirected", !0);
    ue(this, "_isMultigraph", !1);
    ue(this, "_isCompound", !1);
    // Label for the graph itself
    ue(this, "_label");
    // Defaults to be set when creating a new node
    ue(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    ue(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    ue(this, "_nodes", {});
    // v -> edgeObj
    ue(this, "_in", {});
    // u -> v -> Number
    ue(this, "_preds", {});
    // v -> edgeObj
    ue(this, "_out", {});
    // v -> w -> Number
    ue(this, "_sucs", {});
    // e -> edgeObj
    ue(this, "_edgeObjs", {});
    // e -> label
    ue(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    ue(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    ue(this, "_edgeCount", 0);
    ue(this, "_parent");
    ue(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[Qe] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = Qe, this._children[t] = {}, this._children[Qe][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      n = Qe;
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
      if (n !== Qe)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = Qe) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === Qe)
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
    var a = St(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = Nc(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, lo(this._preds[n], t), lo(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? jn(this._isDirected, arguments[0]) : St(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? jn(this._isDirected, arguments[0]) : St(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? jn(this._isDirected, arguments[0]) : St(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], co(this._preds[n], t), co(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function lo(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function co(e, t) {
  --e[t] || delete e[t];
}
function St(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + ao + i + ao + (r === void 0 ? Ec : r);
}
function Nc(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function jn(e, t) {
  return St(e, t.v, t.w, t.name);
}
var Ar = kc, Sc = "2.2.4", Cc = {
  Graph: Ar,
  version: Sc
}, Mc = Ar, Ic = {
  write: $c,
  read: Lc
};
function $c(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: Ac(e),
    edges: Tc(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function Ac(e) {
  return e.nodes().map(function(t) {
    var n = e.node(t), r = e.parent(t), o = { v: t };
    return n !== void 0 && (o.value = n), r !== void 0 && (o.parent = r), o;
  });
}
function Tc(e) {
  return e.edges().map(function(t) {
    var n = e.edge(t), r = { v: t.v, w: t.w };
    return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
  });
}
function Lc(e) {
  var t = new Mc(e.options).setGraph(e.value);
  return e.nodes.forEach(function(n) {
    t.setNode(n.v, n.value), n.parent && t.setParent(n.v, n.parent);
  }), e.edges.forEach(function(n) {
    t.setEdge({ v: n.v, w: n.w, name: n.name }, n.value);
  }), t;
}
var Oc = zc;
function zc(e) {
  var t = {}, n = [], r;
  function o(i) {
    Object.hasOwn(t, i) || (t[i] = !0, r.push(i), e.successors(i).forEach(o), e.predecessors(i).forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && n.push(r);
  }), n;
}
let Pc = class {
  constructor() {
    ue(this, "_arr", []);
    ue(this, "_keyIndices", {});
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
var Bi = Pc, Dc = Bi, Fi = Hc, Rc = () => 1;
function Hc(e, t, n, r) {
  return Vc(
    e,
    String(t),
    n || Rc,
    r || function(o) {
      return e.outEdges(o);
    }
  );
}
function Vc(e, t, n, r) {
  var o = {}, i = new Dc(), s, a, l = function(c) {
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
var Bc = Fi, Fc = Yc;
function Yc(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = Bc(e, o, t, n), r;
  }, {});
}
var Yi = Wc;
function Wc(e) {
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
var Xc = Yi, Gc = jc;
function jc(e) {
  return Xc(e).filter(function(t) {
    return t.length > 1 || t.length === 1 && e.hasEdge(t[0], t[0]);
  });
}
var qc = Kc, Uc = () => 1;
function Kc(e, t, n) {
  return Zc(
    e,
    t || Uc,
    n || function(r) {
      return e.outEdges(r);
    }
  );
}
function Zc(e, t, n) {
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
function Wi(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new dr();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new dr();
  return r;
}
class dr extends Error {
  constructor() {
    super(...arguments);
  }
}
var Xi = Wi;
Wi.CycleException = dr;
var uo = Xi, Qc = Jc;
function Jc(e) {
  try {
    uo(e);
  } catch (t) {
    if (t instanceof uo.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var Gi = eu;
function eu(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? tu : nu, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function tu(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), ji(t(i[0]), (s) => o.push([s, !1])));
  }
}
function nu(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), ji(t(i), (s) => o.push(s)));
  }
}
function ji(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var ru = Gi, ou = iu;
function iu(e, t) {
  return ru(e, t, "post");
}
var su = Gi, au = lu;
function lu(e, t) {
  return su(e, t, "pre");
}
var cu = Ar, uu = Bi, du = fu;
function fu(e, t) {
  var n = new cu(), r = {}, o = new uu(), i;
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
var hu = {
  components: Oc,
  dijkstra: Fi,
  dijkstraAll: Fc,
  findCycles: Gc,
  floydWarshall: qc,
  isAcyclic: Qc,
  postorder: ou,
  preorder: au,
  prim: du,
  tarjan: Yi,
  topsort: Xi
}, fo = Cc, Ce = {
  Graph: fo.Graph,
  json: Ic,
  alg: hu,
  version: fo.version
};
let pu = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return ho(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && ho(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, gu)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function ho(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function gu(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var mu = pu;
let yu = Ce.Graph, wu = mu;
var xu = vu;
let bu = () => 1;
function vu(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = Eu(e, t || bu);
  return _u(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function _u(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      qn(e, t, n, s);
    for (; s = o.dequeue(); )
      qn(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(qn(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function qn(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, fr(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, fr(t, n, c);
  }), e.removeNode(r.v), i;
}
function Eu(e, t) {
  let n = new yu(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), u = l + c;
    n.setEdge(a.v, a.w, u), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = ku(o + r + 3).map(() => new wu()), s = r + 1;
  return n.nodes().forEach((a) => {
    fr(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function fr(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function ku(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let qi = Ce.Graph;
var de = {
  addBorderNode: Lu,
  addDummyNode: Ui,
  applyWithChunking: Mn,
  asNonCompoundGraph: Su,
  buildLayerMatrix: $u,
  intersectRect: Iu,
  mapValues: Vu,
  maxRank: Zi,
  normalizeRanks: Au,
  notime: Du,
  partition: zu,
  pick: Hu,
  predecessorWeights: Mu,
  range: Ji,
  removeEmptyRanks: Tu,
  simplify: Nu,
  successorWeights: Cu,
  time: Pu,
  uniqueId: Qi,
  zipObject: Tr
};
function Ui(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = Qi(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function Nu(e) {
  let t = new qi().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function Su(e) {
  let t = new qi({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function Cu(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return Tr(e.nodes(), t);
}
function Mu(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return Tr(e.nodes(), t);
}
function Iu(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function $u(e) {
  let t = Ji(Zi(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function Au(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Mn(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function Tu(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Mn(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function Lu(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), Ui(e, "border", o, t);
}
function Ou(e, t = Ki) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const Ki = 65535;
function Mn(e, t) {
  if (t.length > Ki) {
    const n = Ou(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function Zi(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Mn(Math.max, n);
}
function zu(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function Pu(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function Du(e, t) {
  return t();
}
let Ru = 0;
function Qi(e) {
  var t = ++Ru;
  return e + ("" + t);
}
function Ji(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function Hu(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function Vu(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function Tr(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let Bu = xu, Fu = de.uniqueId;
var Yu = {
  run: Wu,
  undo: Gu
};
function Wu(e) {
  (e.graph().acyclicer === "greedy" ? Bu(e, n(e)) : Xu(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, Fu("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function Xu(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function Gu(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let ju = de;
var qu = {
  run: Uu,
  undo: Zu
};
function Uu(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => Ku(e, t));
}
function Ku(e, t) {
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
    }, c = ju.addDummyNode(e, "edge", u, "_d"), r === l && (u.width = a.width, u.height = a.height, u.dummy = "edge-label", u.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function Zu(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: Qu } = de;
var In = {
  longestPath: Ju,
  slack: ed
};
function Ju(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = Qu(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function ed(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var td = Ce.Graph, pn = In.slack, es = nd;
function nd(e) {
  var t = new td({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; rd(t, e) < r; )
    o = od(t, e), i = t.hasNode(o.v) ? pn(e, o) : -pn(e, o), id(t, e, i);
  return t;
}
function rd(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !pn(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function od(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = pn(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function id(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var sd = es, po = In.slack, ad = In.longestPath, ld = Ce.alg.preorder, cd = Ce.alg.postorder, ud = de.simplify, dd = lt;
lt.initLowLimValues = Or;
lt.initCutValues = Lr;
lt.calcCutValue = ts;
lt.leaveEdge = rs;
lt.enterEdge = os;
lt.exchangeEdges = is;
function lt(e) {
  e = ud(e), ad(e);
  var t = sd(e);
  Or(t), Lr(t, e);
  for (var n, r; n = rs(t); )
    r = os(t, e, n), is(t, e, n, r);
}
function Lr(e, t) {
  var n = cd(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => fd(e, t, r));
}
function fd(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = ts(e, t, n);
}
function ts(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, u = c ? l.w : l.v;
    if (u !== o) {
      var f = c === i, d = t.edge(l).weight;
      if (a += f ? d : -d, pd(e, n, u)) {
        var h = e.edge(n, u).cutvalue;
        a += f ? -h : h;
      }
    }
  }), a;
}
function Or(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), ns(e, {}, 1, t);
}
function ns(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = ns(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function rs(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function os(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((u) => l === go(e, e.node(u.v), a) && l !== go(e, e.node(u.w), a));
  return c.reduce((u, f) => po(t, f) < po(t, u) ? f : u);
}
function is(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), Or(e), Lr(e, t), hd(e, t);
}
function hd(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = ld(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function pd(e, t, n) {
  return e.hasEdge(t, n);
}
function go(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var gd = In, ss = gd.longestPath, md = es, yd = dd, wd = xd;
function xd(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      mo(e);
      break;
    case "tight-tree":
      vd(e);
      break;
    case "longest-path":
      bd(e);
      break;
    case "none":
      break;
    default:
      mo(e);
  }
}
var bd = ss;
function vd(e) {
  ss(e), md(e);
}
function mo(e) {
  yd(e);
}
var _d = Ed;
function Ed(e) {
  let t = Nd(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = kd(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], u = !0;
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
function kd(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function Nd(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let gn = de;
var Sd = {
  run: Cd,
  cleanup: $d
};
function Cd(e) {
  let t = gn.addDummyNode(e, "root", {}, "_root"), n = Md(e), r = Object.values(n), o = gn.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = Id(e) + 1;
  e.children().forEach((a) => as(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function as(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = gn.addBorderNode(e, "_bt"), c = gn.addBorderNode(e, "_bb"), u = e.node(s);
  e.setParent(l, s), u.borderTop = l, e.setParent(c, s), u.borderBottom = c, a.forEach((f) => {
    as(e, t, n, r, o, i, f);
    let d = e.node(f), h = d.borderTop ? d.borderTop : f, p = d.borderBottom ? d.borderBottom : f, y = d.borderTop ? r : 2 * r, x = h !== p ? 1 : o - i[s] + 1;
    e.setEdge(l, h, {
      weight: y,
      minlen: x,
      nestingEdge: !0
    }), e.setEdge(p, c, {
      weight: y,
      minlen: x,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function Md(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function Id(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function $d(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let Ad = de;
var Td = Ld;
function Ld(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        yo(e, "borderLeft", "_bl", n, o, i), yo(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function yo(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = Ad.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var Od = {
  adjust: zd,
  undo: Pd
};
function zd(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && ls(e);
}
function Pd(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && Dd(e), (t === "lr" || t === "rl") && (Rd(e), ls(e));
}
function ls(e) {
  e.nodes().forEach((t) => wo(e.node(t))), e.edges().forEach((t) => wo(e.edge(t)));
}
function wo(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function Dd(e) {
  e.nodes().forEach((t) => Un(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Un), Object.hasOwn(n, "y") && Un(n);
  });
}
function Un(e) {
  e.y = -e.y;
}
function Rd(e) {
  e.nodes().forEach((t) => Kn(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(Kn), Object.hasOwn(n, "x") && Kn(n);
  });
}
function Kn(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let xo = de;
var Hd = Vd;
function Vd(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = xo.applyWithChunking(Math.max, r), i = xo.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let Bd = de.zipObject;
var Fd = Yd;
function Yd(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += Wd(e, t[r - 1], t[r]);
  return n;
}
function Wd(e, t, n) {
  let r = Bd(n, n.map((c, u) => u)), o = t.flatMap((c) => e.outEdges(c).map((u) => ({ pos: r[u.w], weight: e.edge(u).weight })).sort((u, f) => u.pos - f.pos)), i = 1;
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
var Xd = Gd;
function Gd(e, t = []) {
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
let jd = de;
var qd = Ud;
function Ud(e, t) {
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
  return Kd(r);
}
function Kd(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Zd(o, i);
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
  return t.filter((o) => !o.merged).map((o) => jd.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function Zd(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let Qd = de;
var Jd = ef;
function ef(e, t) {
  let n = Qd.partition(e, (u) => Object.hasOwn(u, "barycenter")), r = n.lhs, o = n.rhs.sort((u, f) => f.i - u.i), i = [], s = 0, a = 0, l = 0;
  r.sort(tf(!!t)), l = bo(i, o, l), r.forEach((u) => {
    l += u.vs.length, i.push(u.vs), s += u.barycenter * u.weight, a += u.weight, l = bo(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function bo(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function tf(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let nf = Xd, rf = qd, of = Jd;
var sf = cs;
function cs(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((d) => d !== s && d !== a));
  let c = nf(e, o);
  c.forEach((d) => {
    if (e.children(d.v).length) {
      let h = cs(e, d.v, n, r);
      l[d.v] = h, Object.hasOwn(h, "barycenter") && lf(d, h);
    }
  });
  let u = rf(c, n);
  af(u, l);
  let f = of(u, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let d = e.node(e.predecessors(s)[0]), h = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + d.order + h.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function af(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function lf(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let cf = Ce.Graph, uf = de;
var df = ff;
function ff(e, t, n, r) {
  r || (r = e.nodes());
  let o = hf(e), i = new cf({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
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
function hf(e) {
  for (var t; e.hasNode(t = uf.uniqueId("_root")); ) ;
  return t;
}
var pf = gf;
function gf(e, t, n) {
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
let mf = Hd, yf = Fd, wf = sf, xf = df, bf = pf, vf = Ce.Graph, Kt = de;
var _f = us;
function us(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, us);
    return;
  }
  let n = Kt.maxRank(e), r = vo(e, Kt.range(1, n + 1), "inEdges"), o = vo(e, Kt.range(n - 1, -1, -1), "outEdges"), i = mf(e);
  if (_o(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    Ef(l % 2 ? r : o, l % 4 >= 2), i = Kt.buildLayerMatrix(e);
    let u = yf(e, i);
    u < s && (c = 0, a = Object.assign({}, i), s = u);
  }
  _o(e, a);
}
function vo(e, t, n) {
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
    return xf(e, i, n, r.get(i) || []);
  });
}
function Ef(e, t) {
  let n = new vf();
  e.forEach(function(r) {
    let o = r.graph().root, i = wf(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), bf(r, n, i.vs);
  });
}
function _o(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let kf = Ce.Graph, Ve = de;
var Nf = {
  positionX: Pf
};
function Sf(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((u, f) => {
      let d = Mf(e, u), h = d ? e.node(d).order : l;
      (d || u === c) && (i.slice(a, f + 1).forEach((p) => {
        e.predecessors(p).forEach((y) => {
          let x = e.node(y), m = x.order;
          (m < s || h < m) && !(x.dummy && e.node(p).dummy) && ds(n, y, p);
        });
      }), a = f + 1, s = h);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function Cf(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let u;
    Ve.range(s, a).forEach((f) => {
      u = i[f], e.node(u).dummy && e.predecessors(u).forEach((d) => {
        let h = e.node(d);
        h.dummy && (h.order < l || h.order > c) && ds(n, d, u);
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
function Mf(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function ds(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function If(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function $f(e, t, n, r) {
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
          i[c] === c && l < s[p] && !If(n, c, p) && (i[p] = c, i[c] = o[c] = o[p], l = s[p]);
        }
      }
    });
  }), { root: o, align: i };
}
function Af(e, t, n, r, o) {
  let i = {}, s = Tf(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, d) {
    let h = s.nodes(), p = h.pop(), y = {};
    for (; p; )
      y[p] ? f(p) : (y[p] = !0, h.push(p), h = h.concat(d(p))), p = h.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((d, h) => Math.max(d, i[h.v] + s.edge(h)), 0);
  }
  function u(f) {
    let d = s.outEdges(f).reduce((p, y) => Math.min(p, i[y.w] - s.edge(y)), Number.POSITIVE_INFINITY), h = e.node(f);
    d !== Number.POSITIVE_INFINITY && h.borderType !== a && (i[f] = Math.max(i[f], d));
  }
  return l(c, s.predecessors.bind(s)), l(u, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function Tf(e, t, n, r) {
  let o = new kf(), i = e.graph(), s = Df(i.nodesep, i.edgesep, r);
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
function Lf(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = Rf(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Of(e, t) {
  let n = Object.values(t), r = Ve.applyWithChunking(Math.min, n), o = Ve.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), u = r - Ve.applyWithChunking(Math.min, c);
      s !== "l" && (u = o - Ve.applyWithChunking(Math.max, c)), u && (e[a] = Ve.mapValues(l, (f) => f + u));
    });
  });
}
function zf(e, t) {
  return Ve.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function Pf(e) {
  let t = Ve.buildLayerMatrix(e), n = Object.assign(
    Sf(e, t),
    Cf(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = $f(e, o, n, l), u = Af(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (u = Ve.mapValues(u, (f) => -f)), r[s + a] = u;
    });
  });
  let i = Lf(e, r);
  return Of(r, i), zf(r, e.graph().align);
}
function Df(e, t, n) {
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
function Rf(e, t) {
  return e.node(t).width;
}
let fs = de, Hf = Nf.positionX;
var Vf = Bf;
function Bf(e) {
  e = fs.asNonCompoundGraph(e), Ff(e), Object.entries(Hf(e)).forEach(([t, n]) => e.node(t).x = n);
}
function Ff(e) {
  let t = fs.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let Eo = Yu, ko = qu, Yf = wd, Wf = de.normalizeRanks, Xf = _d, Gf = de.removeEmptyRanks, No = Sd, jf = Td, So = Od, qf = _f, Uf = Vf, we = de, Kf = Ce.Graph;
var Zf = Qf;
function Qf(e, t) {
  let n = t && t.debugTiming ? we.time : we.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => lh(e));
    n("  runLayout", () => Jf(r, n, t)), n("  updateInputGraph", () => eh(e, r));
  });
}
function Jf(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => ch(e)), t("    removeSelfEdges", () => wh(e)), t("    acyclic", () => Eo.run(e)), t("    nestingGraph.run", () => No.run(e)), t("    rank", () => Yf(we.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => uh(e)), t("    removeEmptyRanks", () => Gf(e)), t("    nestingGraph.cleanup", () => No.cleanup(e)), t("    normalizeRanks", () => Wf(e)), t("    assignRankMinMax", () => dh(e)), t("    removeEdgeLabelProxies", () => fh(e)), t("    normalize.run", () => ko.run(e)), t("    parentDummyChains", () => Xf(e)), t("    addBorderSegments", () => jf(e)), t("    order", () => qf(e, n)), t("    insertSelfEdges", () => xh(e)), t("    adjustCoordinateSystem", () => So.adjust(e)), t("    position", () => Uf(e)), t("    positionSelfEdges", () => bh(e)), t("    removeBorderNodes", () => yh(e)), t("    normalize.undo", () => ko.undo(e)), t("    fixupEdgeLabelCoords", () => gh(e)), t("    undoCoordinateSystem", () => So.undo(e)), t("    translateGraph", () => hh(e)), t("    assignNodeIntersects", () => ph(e)), t("    reversePoints", () => mh(e)), t("    acyclic.undo", () => Eo.undo(e));
}
function eh(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let th = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], nh = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, rh = ["acyclicer", "ranker", "rankdir", "align"], oh = ["width", "height", "rank"], Co = { width: 0, height: 0 }, ih = ["minlen", "weight", "width", "height", "labeloffset"], sh = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, ah = ["labelpos"];
function lh(e) {
  let t = new Kf({ multigraph: !0, compound: !0 }), n = Qn(e.graph());
  return t.setGraph(Object.assign(
    {},
    nh,
    Zn(n, th),
    we.pick(n, rh)
  )), e.nodes().forEach((r) => {
    let o = Qn(e.node(r));
    const i = Zn(o, oh);
    Object.keys(Co).forEach((s) => {
      i[s] === void 0 && (i[s] = Co[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = Qn(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      sh,
      Zn(o, ih),
      we.pick(o, ah)
    ));
  }), t;
}
function ch(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function uh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      we.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function dh(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function fh(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function hh(e) {
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
function ph(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(we.intersectRect(r, i)), n.points.push(we.intersectRect(o, s));
  });
}
function gh(e) {
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
function mh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function yh(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function wh(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function xh(e) {
  var t = we.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        we.addDummyNode(e, "selfedge", {
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
function bh(e) {
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
function Zn(e, t) {
  return we.mapValues(we.pick(e, t), Number);
}
function Qn(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let vh = de, _h = Ce.Graph;
var Eh = {
  debugOrdering: kh
};
function kh(e) {
  let t = vh.buildLayerMatrix(e), n = new _h({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var Nh = "1.1.8", Sh = {
  graphlib: Ce,
  layout: Zf,
  debug: Eh,
  util: {
    time: de.time,
    notime: de.notime
  },
  version: Nh
};
const Mo = /* @__PURE__ */ Vi(Sh);
function fe(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = fe(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var Ch = { value: () => {
} };
function $n() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new ln(n);
}
function ln(e) {
  this._ = e;
}
function Mh(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
ln.prototype = $n.prototype = {
  constructor: ln,
  on: function(e, t) {
    var n = this._, r = Mh(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = Ih(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Io(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Io(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new ln(e);
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
function Ih(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Io(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = Ch, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var hr = "http://www.w3.org/1999/xhtml";
const $o = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: hr,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function An(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), $o.hasOwnProperty(t) ? { space: $o[t], local: e } : e;
}
function $h(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === hr && t.documentElement.namespaceURI === hr ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Ah(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function hs(e) {
  var t = An(e);
  return (t.local ? Ah : $h)(t);
}
function Th() {
}
function zr(e) {
  return e == null ? Th : function() {
    return this.querySelector(e);
  };
}
function Lh(e) {
  typeof e != "function" && (e = zr(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, u = 0; u < s; ++u)
      (l = i[u]) && (c = e.call(l, l.__data__, u, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[u] = c);
  return new me(r, this._parents);
}
function Oh(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function zh() {
  return [];
}
function ps(e) {
  return e == null ? zh : function() {
    return this.querySelectorAll(e);
  };
}
function Ph(e) {
  return function() {
    return Oh(e.apply(this, arguments));
  };
}
function Dh(e) {
  typeof e == "function" ? e = Ph(e) : e = ps(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new me(r, o);
}
function gs(e) {
  return function() {
    return this.matches(e);
  };
}
function ms(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Rh = Array.prototype.find;
function Hh(e) {
  return function() {
    return Rh.call(this.children, e);
  };
}
function Vh() {
  return this.firstElementChild;
}
function Bh(e) {
  return this.select(e == null ? Vh : Hh(typeof e == "function" ? e : ms(e)));
}
var Fh = Array.prototype.filter;
function Yh() {
  return Array.from(this.children);
}
function Wh(e) {
  return function() {
    return Fh.call(this.children, e);
  };
}
function Xh(e) {
  return this.selectAll(e == null ? Yh : Wh(typeof e == "function" ? e : ms(e)));
}
function Gh(e) {
  typeof e != "function" && (e = gs(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new me(r, this._parents);
}
function ys(e) {
  return new Array(e.length);
}
function jh() {
  return new me(this._enter || this._groups.map(ys), this._parents);
}
function mn(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
mn.prototype = {
  constructor: mn,
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
function qh(e) {
  return function() {
    return e;
  };
}
function Uh(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new mn(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function Kh(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), u = t.length, f = i.length, d = new Array(u), h;
  for (a = 0; a < u; ++a)
    (l = t[a]) && (d[a] = h = s.call(l, l.__data__, a, t) + "", c.has(h) ? o[a] = l : c.set(h, l));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (l = c.get(h)) ? (r[a] = l, l.__data__ = i[a], c.delete(h)) : n[a] = new mn(e, i[a]);
  for (a = 0; a < u; ++a)
    (l = t[a]) && c.get(d[a]) === l && (o[a] = l);
}
function Zh(e) {
  return e.__data__;
}
function Qh(e, t) {
  if (!arguments.length) return Array.from(this, Zh);
  var n = t ? Kh : Uh, r = this._parents, o = this._groups;
  typeof e != "function" && (e = qh(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var u = r[c], f = o[c], d = f.length, h = Jh(e.call(u, u && u.__data__, c, r)), p = h.length, y = a[c] = new Array(p), x = s[c] = new Array(p), m = l[c] = new Array(d);
    n(u, f, y, x, m, h, t);
    for (var v = 0, g = 0, b, N; v < p; ++v)
      if (b = y[v]) {
        for (v >= g && (g = v + 1); !(N = x[g]) && ++g < p; ) ;
        b._next = N || null;
      }
  }
  return s = new me(s, r), s._enter = a, s._exit = l, s;
}
function Jh(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function ep() {
  return new me(this._exit || this._groups.map(ys), this._parents);
}
function tp(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function np(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], u = r[l], f = c.length, d = a[l] = new Array(f), h, p = 0; p < f; ++p)
      (h = c[p] || u[p]) && (d[p] = h);
  for (; l < o; ++l)
    a[l] = n[l];
  return new me(a, this._parents);
}
function rp() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function op(e) {
  e || (e = ip);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, u = 0; u < a; ++u)
      (c = s[u]) && (l[u] = c);
    l.sort(t);
  }
  return new me(o, this._parents).order();
}
function ip(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function sp() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function ap() {
  return Array.from(this);
}
function lp() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function cp() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function up() {
  return !this.node();
}
function dp(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function fp(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function hp(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function pp(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function gp(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function mp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function yp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function wp(e, t) {
  var n = An(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? hp : fp : typeof t == "function" ? n.local ? yp : mp : n.local ? gp : pp)(n, t));
}
function ws(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function xp(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function bp(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function vp(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function _p(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? xp : typeof t == "function" ? vp : bp)(e, t, n ?? "")) : pt(this.node(), e);
}
function pt(e, t) {
  return e.style.getPropertyValue(t) || ws(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Ep(e) {
  return function() {
    delete this[e];
  };
}
function kp(e, t) {
  return function() {
    this[e] = t;
  };
}
function Np(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Sp(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Ep : typeof t == "function" ? Np : kp)(e, t)) : this.node()[e];
}
function xs(e) {
  return e.trim().split(/^|\s+/);
}
function Pr(e) {
  return e.classList || new bs(e);
}
function bs(e) {
  this._node = e, this._names = xs(e.getAttribute("class") || "");
}
bs.prototype = {
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
function vs(e, t) {
  for (var n = Pr(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function _s(e, t) {
  for (var n = Pr(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function Cp(e) {
  return function() {
    vs(this, e);
  };
}
function Mp(e) {
  return function() {
    _s(this, e);
  };
}
function Ip(e, t) {
  return function() {
    (t.apply(this, arguments) ? vs : _s)(this, e);
  };
}
function $p(e, t) {
  var n = xs(e + "");
  if (arguments.length < 2) {
    for (var r = Pr(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Ip : t ? Cp : Mp)(n, t));
}
function Ap() {
  this.textContent = "";
}
function Tp(e) {
  return function() {
    this.textContent = e;
  };
}
function Lp(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Op(e) {
  return arguments.length ? this.each(e == null ? Ap : (typeof e == "function" ? Lp : Tp)(e)) : this.node().textContent;
}
function zp() {
  this.innerHTML = "";
}
function Pp(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Dp(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Rp(e) {
  return arguments.length ? this.each(e == null ? zp : (typeof e == "function" ? Dp : Pp)(e)) : this.node().innerHTML;
}
function Hp() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Vp() {
  return this.each(Hp);
}
function Bp() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Fp() {
  return this.each(Bp);
}
function Yp(e) {
  var t = typeof e == "function" ? e : hs(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Wp() {
  return null;
}
function Xp(e, t) {
  var n = typeof e == "function" ? e : hs(e), r = t == null ? Wp : typeof t == "function" ? t : zr(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Gp() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function jp() {
  return this.each(Gp);
}
function qp() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Up() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Kp(e) {
  return this.select(e ? Up : qp);
}
function Zp(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Qp(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Jp(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function eg(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function tg(e, t, n) {
  return function() {
    var r = this.__on, o, i = Qp(t);
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
function ng(e, t, n) {
  var r = Jp(e + ""), o, i = r.length, s;
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
  for (a = t ? tg : eg, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function Es(e, t, n) {
  var r = ws(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function rg(e, t) {
  return function() {
    return Es(this, e, t);
  };
}
function og(e, t) {
  return function() {
    return Es(this, e, t.apply(this, arguments));
  };
}
function ig(e, t) {
  return this.each((typeof t == "function" ? og : rg)(e, t));
}
function* sg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var ks = [null];
function me(e, t) {
  this._groups = e, this._parents = t;
}
function Ft() {
  return new me([[document.documentElement]], ks);
}
function ag() {
  return this;
}
me.prototype = Ft.prototype = {
  constructor: me,
  select: Lh,
  selectAll: Dh,
  selectChild: Bh,
  selectChildren: Xh,
  filter: Gh,
  data: Qh,
  enter: jh,
  exit: ep,
  join: tp,
  merge: np,
  selection: ag,
  order: rp,
  sort: op,
  call: sp,
  nodes: ap,
  node: lp,
  size: cp,
  empty: up,
  each: dp,
  attr: wp,
  style: _p,
  property: Sp,
  classed: $p,
  text: Op,
  html: Rp,
  raise: Vp,
  lower: Fp,
  append: Yp,
  insert: Xp,
  remove: jp,
  clone: Kp,
  datum: Zp,
  on: ng,
  dispatch: ig,
  [Symbol.iterator]: sg
};
function ge(e) {
  return typeof e == "string" ? new me([[document.querySelector(e)]], [document.documentElement]) : new me([[e]], ks);
}
function lg(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function be(e, t) {
  if (e = lg(e), t === void 0 && (t = e.currentTarget), t) {
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
const cg = { passive: !1 }, Tt = { capture: !0, passive: !1 };
function Jn(e) {
  e.stopImmediatePropagation();
}
function ft(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Ns(e) {
  var t = e.document.documentElement, n = ge(e).on("dragstart.drag", ft, Tt);
  "onselectstart" in t ? n.on("selectstart.drag", ft, Tt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Ss(e, t) {
  var n = e.document.documentElement, r = ge(e).on("dragstart.drag", null);
  t && (r.on("click.drag", ft, Tt), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Zt = (e) => () => e;
function pr(e, {
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
pr.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function ug(e) {
  return !e.ctrlKey && !e.button;
}
function dg() {
  return this.parentNode;
}
function fg(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function hg() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Cs() {
  var e = ug, t = dg, n = fg, r = hg, o = {}, i = $n("start", "drag", "end"), s = 0, a, l, c, u, f = 0;
  function d(b) {
    b.on("mousedown.drag", h).filter(r).on("touchstart.drag", x).on("touchmove.drag", m, cg).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(b, N) {
    if (!(u || !e.call(this, b, N))) {
      var _ = g(this, t.call(this, b, N), b, N, "mouse");
      _ && (ge(b.view).on("mousemove.drag", p, Tt).on("mouseup.drag", y, Tt), Ns(b.view), Jn(b), c = !1, a = b.clientX, l = b.clientY, _("start", b));
    }
  }
  function p(b) {
    if (ft(b), !c) {
      var N = b.clientX - a, _ = b.clientY - l;
      c = N * N + _ * _ > f;
    }
    o.mouse("drag", b);
  }
  function y(b) {
    ge(b.view).on("mousemove.drag mouseup.drag", null), Ss(b.view, c), ft(b), o.mouse("end", b);
  }
  function x(b, N) {
    if (e.call(this, b, N)) {
      var _ = b.changedTouches, M = t.call(this, b, N), T = _.length, A, R;
      for (A = 0; A < T; ++A)
        (R = g(this, M, b, N, _[A].identifier, _[A])) && (Jn(b), R("start", b, _[A]));
    }
  }
  function m(b) {
    var N = b.changedTouches, _ = N.length, M, T;
    for (M = 0; M < _; ++M)
      (T = o[N[M].identifier]) && (ft(b), T("drag", b, N[M]));
  }
  function v(b) {
    var N = b.changedTouches, _ = N.length, M, T;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), M = 0; M < _; ++M)
      (T = o[N[M].identifier]) && (Jn(b), T("end", b, N[M]));
  }
  function g(b, N, _, M, T, A) {
    var R = i.copy(), O = be(A || _, N), H, P, w;
    if ((w = n.call(b, new pr("beforestart", {
      sourceEvent: _,
      target: d,
      identifier: T,
      active: s,
      x: O[0],
      y: O[1],
      dx: 0,
      dy: 0,
      dispatch: R
    }), M)) != null)
      return H = w.x - O[0] || 0, P = w.y - O[1] || 0, function S(k, $, L) {
        var C = O, I;
        switch (k) {
          case "start":
            o[T] = S, I = s++;
            break;
          case "end":
            delete o[T], --s;
          case "drag":
            O = be(L || $, N), I = s;
            break;
        }
        R.call(
          k,
          b,
          new pr(k, {
            sourceEvent: $,
            subject: w,
            target: d,
            identifier: T,
            active: I,
            x: O[0] + H,
            y: O[1] + P,
            dx: O[0] - C[0],
            dy: O[1] - C[1],
            dispatch: R
          }),
          M
        );
      };
  }
  return d.filter = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Zt(!!b), d) : e;
  }, d.container = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Zt(b), d) : t;
  }, d.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Zt(b), d) : n;
  }, d.touchable = function(b) {
    return arguments.length ? (r = typeof b == "function" ? b : Zt(!!b), d) : r;
  }, d.on = function() {
    var b = i.on.apply(i, arguments);
    return b === i ? d : b;
  }, d.clickDistance = function(b) {
    return arguments.length ? (f = (b = +b) * b, d) : Math.sqrt(f);
  }, d;
}
function Dr(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ms(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Yt() {
}
var Lt = 0.7, yn = 1 / Lt, ht = "\\s*([+-]?\\d+)\\s*", Ot = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Oe = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", pg = /^#([0-9a-f]{3,8})$/, gg = new RegExp(`^rgb\\(${ht},${ht},${ht}\\)$`), mg = new RegExp(`^rgb\\(${Oe},${Oe},${Oe}\\)$`), yg = new RegExp(`^rgba\\(${ht},${ht},${ht},${Ot}\\)$`), wg = new RegExp(`^rgba\\(${Oe},${Oe},${Oe},${Ot}\\)$`), xg = new RegExp(`^hsl\\(${Ot},${Oe},${Oe}\\)$`), bg = new RegExp(`^hsla\\(${Ot},${Oe},${Oe},${Ot}\\)$`), Ao = {
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
Dr(Yt, rt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: To,
  // Deprecated! Use color.formatHex.
  formatHex: To,
  formatHex8: vg,
  formatHsl: _g,
  formatRgb: Lo,
  toString: Lo
});
function To() {
  return this.rgb().formatHex();
}
function vg() {
  return this.rgb().formatHex8();
}
function _g() {
  return Is(this).formatHsl();
}
function Lo() {
  return this.rgb().formatRgb();
}
function rt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = pg.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Oo(t) : n === 3 ? new pe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Qt(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Qt(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = gg.exec(e)) ? new pe(t[1], t[2], t[3], 1) : (t = mg.exec(e)) ? new pe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = yg.exec(e)) ? Qt(t[1], t[2], t[3], t[4]) : (t = wg.exec(e)) ? Qt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = xg.exec(e)) ? Do(t[1], t[2] / 100, t[3] / 100, 1) : (t = bg.exec(e)) ? Do(t[1], t[2] / 100, t[3] / 100, t[4]) : Ao.hasOwnProperty(e) ? Oo(Ao[e]) : e === "transparent" ? new pe(NaN, NaN, NaN, 0) : null;
}
function Oo(e) {
  return new pe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Qt(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new pe(e, t, n, r);
}
function Eg(e) {
  return e instanceof Yt || (e = rt(e)), e ? (e = e.rgb(), new pe(e.r, e.g, e.b, e.opacity)) : new pe();
}
function gr(e, t, n, r) {
  return arguments.length === 1 ? Eg(e) : new pe(e, t, n, r ?? 1);
}
function pe(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Dr(pe, gr, Ms(Yt, {
  brighter(e) {
    return e = e == null ? yn : Math.pow(yn, e), new pe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Lt : Math.pow(Lt, e), new pe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new pe(tt(this.r), tt(this.g), tt(this.b), wn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: zo,
  // Deprecated! Use color.formatHex.
  formatHex: zo,
  formatHex8: kg,
  formatRgb: Po,
  toString: Po
}));
function zo() {
  return `#${et(this.r)}${et(this.g)}${et(this.b)}`;
}
function kg() {
  return `#${et(this.r)}${et(this.g)}${et(this.b)}${et((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Po() {
  const e = wn(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${tt(this.r)}, ${tt(this.g)}, ${tt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function wn(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function tt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function et(e) {
  return e = tt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Do(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new ve(e, t, n, r);
}
function Is(e) {
  if (e instanceof ve) return new ve(e.h, e.s, e.l, e.opacity);
  if (e instanceof Yt || (e = rt(e)), !e) return new ve();
  if (e instanceof ve) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new ve(s, a, l, e.opacity);
}
function Ng(e, t, n, r) {
  return arguments.length === 1 ? Is(e) : new ve(e, t, n, r ?? 1);
}
function ve(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Dr(ve, Ng, Ms(Yt, {
  brighter(e) {
    return e = e == null ? yn : Math.pow(yn, e), new ve(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Lt : Math.pow(Lt, e), new ve(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new pe(
      er(e >= 240 ? e - 240 : e + 120, o, r),
      er(e, o, r),
      er(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new ve(Ro(this.h), Jt(this.s), Jt(this.l), wn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = wn(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Ro(this.h)}, ${Jt(this.s) * 100}%, ${Jt(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Ro(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Jt(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function er(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Rr = (e) => () => e;
function Sg(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Cg(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Mg(e) {
  return (e = +e) == 1 ? $s : function(t, n) {
    return n - t ? Cg(t, n, e) : Rr(isNaN(t) ? n : t);
  };
}
function $s(e, t) {
  var n = t - e;
  return n ? Sg(e, n) : Rr(isNaN(e) ? t : e);
}
const xn = function e(t) {
  var n = Mg(t);
  function r(o, i) {
    var s = n((o = gr(o)).r, (i = gr(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = $s(o.opacity, i.opacity);
    return function(u) {
      return o.r = s(u), o.g = a(u), o.b = l(u), o.opacity = c(u), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Ig(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function $g(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Ag(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = It(e[s], t[s]);
  for (; s < n; ++s) i[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) i[s] = o[s](a);
    return i;
  };
}
function Tg(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Le(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Lg(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = It(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var mr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, tr = new RegExp(mr.source, "g");
function Og(e) {
  return function() {
    return e;
  };
}
function zg(e) {
  return function(t) {
    return e(t) + "";
  };
}
function As(e, t) {
  var n = mr.lastIndex = tr.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = mr.exec(e)) && (o = tr.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Le(r, o) })), n = tr.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? zg(l[0].x) : Og(t) : (t = l.length, function(c) {
    for (var u = 0, f; u < t; ++u) a[(f = l[u]).i] = f.x(c);
    return a.join("");
  });
}
function It(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Rr(t) : (n === "number" ? Le : n === "string" ? (r = rt(t)) ? (t = r, xn) : As : t instanceof rt ? xn : t instanceof Date ? Tg : $g(t) ? Ig : Array.isArray(t) ? Ag : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Lg : Le)(e, t);
}
var Ho = 180 / Math.PI, yr = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ts(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * Ho,
    skewX: Math.atan(l) * Ho,
    scaleX: s,
    scaleY: a
  };
}
var en;
function Pg(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? yr : Ts(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Dg(e) {
  return e == null || (en || (en = document.createElementNS("http://www.w3.org/2000/svg", "g")), en.setAttribute("transform", e), !(e = en.transform.baseVal.consolidate())) ? yr : (e = e.matrix, Ts(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Ls(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, u, f, d, h, p) {
    if (c !== f || u !== d) {
      var y = h.push("translate(", null, t, null, n);
      p.push({ i: y - 4, x: Le(c, f) }, { i: y - 2, x: Le(u, d) });
    } else (f || d) && h.push("translate(" + f + t + d + n);
  }
  function s(c, u, f, d) {
    c !== u ? (c - u > 180 ? u += 360 : u - c > 180 && (c += 360), d.push({ i: f.push(o(f) + "rotate(", null, r) - 2, x: Le(c, u) })) : u && f.push(o(f) + "rotate(" + u + r);
  }
  function a(c, u, f, d) {
    c !== u ? d.push({ i: f.push(o(f) + "skewX(", null, r) - 2, x: Le(c, u) }) : u && f.push(o(f) + "skewX(" + u + r);
  }
  function l(c, u, f, d, h, p) {
    if (c !== f || u !== d) {
      var y = h.push(o(h) + "scale(", null, ",", null, ")");
      p.push({ i: y - 4, x: Le(c, f) }, { i: y - 2, x: Le(u, d) });
    } else (f !== 1 || d !== 1) && h.push(o(h) + "scale(" + f + "," + d + ")");
  }
  return function(c, u) {
    var f = [], d = [];
    return c = e(c), u = e(u), i(c.translateX, c.translateY, u.translateX, u.translateY, f, d), s(c.rotate, u.rotate, f, d), a(c.skewX, u.skewX, f, d), l(c.scaleX, c.scaleY, u.scaleX, u.scaleY, f, d), c = u = null, function(h) {
      for (var p = -1, y = d.length, x; ++p < y; ) f[(x = d[p]).i] = x.x(h);
      return f.join("");
    };
  };
}
var Rg = Ls(Pg, "px, ", "px)", "deg)"), Hg = Ls(Dg, ", ", ")", ")"), Vg = 1e-12;
function Vo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Bg(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Fg(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const cn = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], u = s[0], f = s[1], d = s[2], h = u - a, p = f - l, y = h * h + p * p, x, m;
    if (y < Vg)
      m = Math.log(d / c) / t, x = function(M) {
        return [
          a + M * h,
          l + M * p,
          c * Math.exp(t * M * m)
        ];
      };
    else {
      var v = Math.sqrt(y), g = (d * d - c * c + r * y) / (2 * c * n * v), b = (d * d - c * c - r * y) / (2 * d * n * v), N = Math.log(Math.sqrt(g * g + 1) - g), _ = Math.log(Math.sqrt(b * b + 1) - b);
      m = (_ - N) / t, x = function(M) {
        var T = M * m, A = Vo(N), R = c / (n * v) * (A * Fg(t * T + N) - Bg(N));
        return [
          a + R * h,
          l + R * p,
          c * A / Vo(t * T + N)
        ];
      };
    }
    return x.duration = m * 1e3 * t / Math.SQRT2, x;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var gt = 0, Ct = 0, kt = 0, Os = 1e3, bn, Mt, vn = 0, ot = 0, Tn = 0, zt = typeof performance == "object" && performance.now ? performance : Date, zs = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Hr() {
  return ot || (zs(Yg), ot = zt.now() + Tn);
}
function Yg() {
  ot = 0;
}
function _n() {
  this._call = this._time = this._next = null;
}
_n.prototype = Ps.prototype = {
  constructor: _n,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Hr() : +n) + (t == null ? 0 : +t), !this._next && Mt !== this && (Mt ? Mt._next = this : bn = this, Mt = this), this._call = e, this._time = n, wr();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, wr());
  }
};
function Ps(e, t, n) {
  var r = new _n();
  return r.restart(e, t, n), r;
}
function Wg() {
  Hr(), ++gt;
  for (var e = bn, t; e; )
    (t = ot - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --gt;
}
function Bo() {
  ot = (vn = zt.now()) + Tn, gt = Ct = 0;
  try {
    Wg();
  } finally {
    gt = 0, Gg(), ot = 0;
  }
}
function Xg() {
  var e = zt.now(), t = e - vn;
  t > Os && (Tn -= t, vn = e);
}
function Gg() {
  for (var e, t = bn, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : bn = n);
  Mt = e, wr(r);
}
function wr(e) {
  if (!gt) {
    Ct && (Ct = clearTimeout(Ct));
    var t = e - ot;
    t > 24 ? (e < 1 / 0 && (Ct = setTimeout(Bo, e - zt.now() - Tn)), kt && (kt = clearInterval(kt))) : (kt || (vn = zt.now(), kt = setInterval(Xg, Os)), gt = 1, zs(Bo));
  }
}
function Fo(e, t, n) {
  var r = new _n();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var jg = $n("start", "end", "cancel", "interrupt"), qg = [], Ds = 0, Yo = 1, xr = 2, un = 3, Wo = 4, br = 5, dn = 6;
function Ln(e, t, n, r, o, i) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  Ug(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: o,
    // For context during callback.
    on: jg,
    tween: qg,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: Ds
  });
}
function Vr(e, t) {
  var n = Me(e, t);
  if (n.state > Ds) throw new Error("too late; already scheduled");
  return n;
}
function ze(e, t) {
  var n = Me(e, t);
  if (n.state > un) throw new Error("too late; already running");
  return n;
}
function Me(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function Ug(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = Ps(i, 0, n.time);
  function i(c) {
    n.state = Yo, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var u, f, d, h;
    if (n.state !== Yo) return l();
    for (u in r)
      if (h = r[u], h.name === n.name) {
        if (h.state === un) return Fo(s);
        h.state === Wo ? (h.state = dn, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete r[u]) : +u < t && (h.state = dn, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete r[u]);
      }
    if (Fo(function() {
      n.state === un && (n.state = Wo, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = xr, n.on.call("start", e, e.__data__, n.index, n.group), n.state === xr) {
      for (n.state = un, o = new Array(d = n.tween.length), u = 0, f = -1; u < d; ++u)
        (h = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = h);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var u = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = br, 1), f = -1, d = o.length; ++f < d; )
      o[f].call(e, u);
    n.state === br && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = dn, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function fn(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > xr && r.state < br, r.state = dn, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function Kg(e) {
  return this.each(function() {
    fn(this, e);
  });
}
function Zg(e, t) {
  var n, r;
  return function() {
    var o = ze(this, e), i = o.tween;
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
function Qg(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = ze(this, e), s = i.tween;
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
function Jg(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Me(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Zg : Qg)(n, e, t));
}
function Br(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = ze(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return Me(o, r).value[t];
  };
}
function Rs(e, t) {
  var n;
  return (typeof t == "number" ? Le : t instanceof rt ? xn : (n = rt(t)) ? (t = n, xn) : As)(e, t);
}
function e0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function t0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function n0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttribute(e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function r0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function o0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function i0(e, t, n) {
  var r, o, i;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a)));
  };
}
function s0(e, t) {
  var n = An(e), r = n === "transform" ? Hg : Rs;
  return this.attrTween(e, typeof t == "function" ? (n.local ? i0 : o0)(n, r, Br(this, "attr." + e, t)) : t == null ? (n.local ? t0 : e0)(n) : (n.local ? r0 : n0)(n, r, t));
}
function a0(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function l0(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function c0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && l0(e, i)), n;
  }
  return o._value = t, o;
}
function u0(e, t) {
  var n, r;
  function o() {
    var i = t.apply(this, arguments);
    return i !== r && (n = (r = i) && a0(e, i)), n;
  }
  return o._value = t, o;
}
function d0(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = An(e);
  return this.tween(n, (r.local ? c0 : u0)(r, t));
}
function f0(e, t) {
  return function() {
    Vr(this, e).delay = +t.apply(this, arguments);
  };
}
function h0(e, t) {
  return t = +t, function() {
    Vr(this, e).delay = t;
  };
}
function p0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? f0 : h0)(t, e)) : Me(this.node(), t).delay;
}
function g0(e, t) {
  return function() {
    ze(this, e).duration = +t.apply(this, arguments);
  };
}
function m0(e, t) {
  return t = +t, function() {
    ze(this, e).duration = t;
  };
}
function y0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? g0 : m0)(t, e)) : Me(this.node(), t).duration;
}
function w0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    ze(this, e).ease = t;
  };
}
function x0(e) {
  var t = this._id;
  return arguments.length ? this.each(w0(t, e)) : Me(this.node(), t).ease;
}
function b0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    ze(this, e).ease = n;
  };
}
function v0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(b0(this._id, e));
}
function _0(e) {
  typeof e != "function" && (e = gs(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Fe(r, this._parents, this._name, this._id);
}
function E0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], u = l.length, f = s[a] = new Array(u), d, h = 0; h < u; ++h)
      (d = l[h] || c[h]) && (f[h] = d);
  for (; a < r; ++a)
    s[a] = t[a];
  return new Fe(s, this._parents, this._name, this._id);
}
function k0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function N0(e, t, n) {
  var r, o, i = k0(t) ? Vr : ze;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function S0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Me(this.node(), n).on.on(e) : this.each(N0(n, e, t));
}
function C0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function M0() {
  return this.on("end.remove", C0(this._id));
}
function I0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = zr(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), u, f, d = 0; d < l; ++d)
      (u = a[d]) && (f = e.call(u, u.__data__, d, a)) && ("__data__" in u && (f.__data__ = u.__data__), c[d] = f, Ln(c[d], t, n, d, c, Me(u, n)));
  return new Fe(i, this._parents, t, n);
}
function $0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ps(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, u, f = 0; f < c; ++f)
      if (u = l[f]) {
        for (var d = e.call(u, u.__data__, f, l), h, p = Me(u, n), y = 0, x = d.length; y < x; ++y)
          (h = d[y]) && Ln(h, t, n, y, d, p);
        i.push(d), s.push(u);
      }
  return new Fe(i, s, t, n);
}
var A0 = Ft.prototype.constructor;
function T0() {
  return new A0(this._groups, this._parents);
}
function L0(e, t) {
  var n, r, o;
  return function() {
    var i = pt(this, e), s = (this.style.removeProperty(e), pt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function Hs(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function O0(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = pt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function z0(e, t, n) {
  var r, o, i;
  return function() {
    var s = pt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), pt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function P0(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = ze(this, e), c = l.on, u = l.value[i] == null ? a || (a = Hs(t)) : void 0;
    (c !== n || o !== u) && (r = (n = c).copy()).on(s, o = u), l.on = r;
  };
}
function D0(e, t, n) {
  var r = (e += "") == "transform" ? Rg : Rs;
  return t == null ? this.styleTween(e, L0(e, r)).on("end.style." + e, Hs(e)) : typeof t == "function" ? this.styleTween(e, z0(e, r, Br(this, "style." + e, t))).each(P0(this._id, e)) : this.styleTween(e, O0(e, r, t), n).on("end.style." + e, null);
}
function R0(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function H0(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && R0(e, s, n)), r;
  }
  return i._value = t, i;
}
function V0(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, H0(e, t, n ?? ""));
}
function B0(e) {
  return function() {
    this.textContent = e;
  };
}
function F0(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Y0(e) {
  return this.tween("text", typeof e == "function" ? F0(Br(this, "text", e)) : B0(e == null ? "" : e + ""));
}
function W0(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function X0(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && W0(o)), t;
  }
  return r._value = e, r;
}
function G0(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, X0(e));
}
function j0() {
  for (var e = this._name, t = this._id, n = Vs(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var u = Me(l, t);
        Ln(l, e, n, c, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new Fe(r, this._parents, e, n);
}
function q0() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = ze(this, r), u = c.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var U0 = 0;
function Fe(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Vs() {
  return ++U0;
}
var He = Ft.prototype;
Fe.prototype = {
  constructor: Fe,
  select: I0,
  selectAll: $0,
  selectChild: He.selectChild,
  selectChildren: He.selectChildren,
  filter: _0,
  merge: E0,
  selection: T0,
  transition: j0,
  call: He.call,
  nodes: He.nodes,
  node: He.node,
  size: He.size,
  empty: He.empty,
  each: He.each,
  on: S0,
  attr: s0,
  attrTween: d0,
  style: D0,
  styleTween: V0,
  text: Y0,
  textTween: G0,
  remove: M0,
  tween: Jg,
  delay: p0,
  duration: y0,
  ease: x0,
  easeVarying: v0,
  end: q0,
  [Symbol.iterator]: He[Symbol.iterator]
};
function K0(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Z0 = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: K0
};
function Q0(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function J0(e) {
  var t, n;
  e instanceof Fe ? (t = e._id, e = e._name) : (t = Vs(), (n = Z0).time = Hr(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Ln(l, e, t, c, s, n || Q0(l, t));
  return new Fe(r, this._parents, e, t);
}
Ft.prototype.interrupt = Kg;
Ft.prototype.transition = J0;
const tn = (e) => () => e;
function em(e, {
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
function Be(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Be.prototype = {
  constructor: Be,
  scale: function(e) {
    return e === 1 ? this : new Be(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Be(this.k, this.x + this.k * e, this.y + this.k * t);
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
var On = new Be(1, 0, 0);
Bs.prototype = Be.prototype;
function Bs(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return On;
  return e.__zoom;
}
function nr(e) {
  e.stopImmediatePropagation();
}
function Nt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function tm(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function nm() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Xo() {
  return this.__zoom || On;
}
function rm(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function om() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function im(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function Fs() {
  var e = tm, t = nm, n = im, r = rm, o = om, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = cn, c = $n("start", "zoom", "end"), u, f, d, h = 500, p = 150, y = 0, x = 10;
  function m(w) {
    w.property("__zoom", Xo).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", A).on("dblclick.zoom", R).filter(o).on("touchstart.zoom", O).on("touchmove.zoom", H).on("touchend.zoom touchcancel.zoom", P).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(w, S, k, $) {
    var L = w.selection ? w.selection() : w;
    L.property("__zoom", Xo), w !== L ? N(w, S, k, $) : L.interrupt().each(function() {
      _(this, arguments).event($).start().zoom(null, typeof S == "function" ? S.apply(this, arguments) : S).end();
    });
  }, m.scaleBy = function(w, S, k, $) {
    m.scaleTo(w, function() {
      var L = this.__zoom.k, C = typeof S == "function" ? S.apply(this, arguments) : S;
      return L * C;
    }, k, $);
  }, m.scaleTo = function(w, S, k, $) {
    m.transform(w, function() {
      var L = t.apply(this, arguments), C = this.__zoom, I = k == null ? b(L) : typeof k == "function" ? k.apply(this, arguments) : k, z = C.invert(I), V = typeof S == "function" ? S.apply(this, arguments) : S;
      return n(g(v(C, V), I, z), L, s);
    }, k, $);
  }, m.translateBy = function(w, S, k, $) {
    m.transform(w, function() {
      return n(this.__zoom.translate(
        typeof S == "function" ? S.apply(this, arguments) : S,
        typeof k == "function" ? k.apply(this, arguments) : k
      ), t.apply(this, arguments), s);
    }, null, $);
  }, m.translateTo = function(w, S, k, $, L) {
    m.transform(w, function() {
      var C = t.apply(this, arguments), I = this.__zoom, z = $ == null ? b(C) : typeof $ == "function" ? $.apply(this, arguments) : $;
      return n(On.translate(z[0], z[1]).scale(I.k).translate(
        typeof S == "function" ? -S.apply(this, arguments) : -S,
        typeof k == "function" ? -k.apply(this, arguments) : -k
      ), C, s);
    }, $, L);
  };
  function v(w, S) {
    return S = Math.max(i[0], Math.min(i[1], S)), S === w.k ? w : new Be(S, w.x, w.y);
  }
  function g(w, S, k) {
    var $ = S[0] - k[0] * w.k, L = S[1] - k[1] * w.k;
    return $ === w.x && L === w.y ? w : new Be(w.k, $, L);
  }
  function b(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function N(w, S, k, $) {
    w.on("start.zoom", function() {
      _(this, arguments).event($).start();
    }).on("interrupt.zoom end.zoom", function() {
      _(this, arguments).event($).end();
    }).tween("zoom", function() {
      var L = this, C = arguments, I = _(L, C).event($), z = t.apply(L, C), V = k == null ? b(z) : typeof k == "function" ? k.apply(L, C) : k, Y = Math.max(z[1][0] - z[0][0], z[1][1] - z[0][1]), F = L.__zoom, q = typeof S == "function" ? S.apply(L, C) : S, J = l(F.invert(V).concat(Y / F.k), q.invert(V).concat(Y / q.k));
      return function(G) {
        if (G === 1) G = q;
        else {
          var D = J(G), B = Y / D[2];
          G = new Be(B, V[0] - D[0] * B, V[1] - D[1] * B);
        }
        I.zoom(null, G);
      };
    });
  }
  function _(w, S, k) {
    return !k && w.__zooming || new M(w, S);
  }
  function M(w, S) {
    this.that = w, this.args = S, this.active = 0, this.sourceEvent = null, this.extent = t.apply(w, S), this.taps = 0;
  }
  M.prototype = {
    event: function(w) {
      return w && (this.sourceEvent = w), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(w, S) {
      return this.mouse && w !== "mouse" && (this.mouse[1] = S.invert(this.mouse[0])), this.touch0 && w !== "touch" && (this.touch0[1] = S.invert(this.touch0[0])), this.touch1 && w !== "touch" && (this.touch1[1] = S.invert(this.touch1[0])), this.that.__zoom = S, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(w) {
      var S = ge(this.that).datum();
      c.call(
        w,
        this.that,
        new em(w, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        S
      );
    }
  };
  function T(w, ...S) {
    if (!e.apply(this, arguments)) return;
    var k = _(this, S).event(w), $ = this.__zoom, L = Math.max(i[0], Math.min(i[1], $.k * Math.pow(2, r.apply(this, arguments)))), C = be(w);
    if (k.wheel)
      (k.mouse[0][0] !== C[0] || k.mouse[0][1] !== C[1]) && (k.mouse[1] = $.invert(k.mouse[0] = C)), clearTimeout(k.wheel);
    else {
      if ($.k === L) return;
      k.mouse = [C, $.invert(C)], fn(this), k.start();
    }
    Nt(w), k.wheel = setTimeout(I, p), k.zoom("mouse", n(g(v($, L), k.mouse[0], k.mouse[1]), k.extent, s));
    function I() {
      k.wheel = null, k.end();
    }
  }
  function A(w, ...S) {
    if (d || !e.apply(this, arguments)) return;
    var k = w.currentTarget, $ = _(this, S, !0).event(w), L = ge(w.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", Y, !0), C = be(w, k), I = w.clientX, z = w.clientY;
    Ns(w.view), nr(w), $.mouse = [C, this.__zoom.invert(C)], fn(this), $.start();
    function V(F) {
      if (Nt(F), !$.moved) {
        var q = F.clientX - I, J = F.clientY - z;
        $.moved = q * q + J * J > y;
      }
      $.event(F).zoom("mouse", n(g($.that.__zoom, $.mouse[0] = be(F, k), $.mouse[1]), $.extent, s));
    }
    function Y(F) {
      L.on("mousemove.zoom mouseup.zoom", null), Ss(F.view, $.moved), Nt(F), $.event(F).end();
    }
  }
  function R(w, ...S) {
    if (e.apply(this, arguments)) {
      var k = this.__zoom, $ = be(w.changedTouches ? w.changedTouches[0] : w, this), L = k.invert($), C = k.k * (w.shiftKey ? 0.5 : 2), I = n(g(v(k, C), $, L), t.apply(this, S), s);
      Nt(w), a > 0 ? ge(this).transition().duration(a).call(N, I, $, w) : ge(this).call(m.transform, I, $, w);
    }
  }
  function O(w, ...S) {
    if (e.apply(this, arguments)) {
      var k = w.touches, $ = k.length, L = _(this, S, w.changedTouches.length === $).event(w), C, I, z, V;
      for (nr(w), I = 0; I < $; ++I)
        z = k[I], V = be(z, this), V = [V, this.__zoom.invert(V), z.identifier], L.touch0 ? !L.touch1 && L.touch0[2] !== V[2] && (L.touch1 = V, L.taps = 0) : (L.touch0 = V, C = !0, L.taps = 1 + !!u);
      u && (u = clearTimeout(u)), C && (L.taps < 2 && (f = V[0], u = setTimeout(function() {
        u = null;
      }, h)), fn(this), L.start());
    }
  }
  function H(w, ...S) {
    if (this.__zooming) {
      var k = _(this, S).event(w), $ = w.changedTouches, L = $.length, C, I, z, V;
      for (Nt(w), C = 0; C < L; ++C)
        I = $[C], z = be(I, this), k.touch0 && k.touch0[2] === I.identifier ? k.touch0[0] = z : k.touch1 && k.touch1[2] === I.identifier && (k.touch1[0] = z);
      if (I = k.that.__zoom, k.touch1) {
        var Y = k.touch0[0], F = k.touch0[1], q = k.touch1[0], J = k.touch1[1], G = (G = q[0] - Y[0]) * G + (G = q[1] - Y[1]) * G, D = (D = J[0] - F[0]) * D + (D = J[1] - F[1]) * D;
        I = v(I, Math.sqrt(G / D)), z = [(Y[0] + q[0]) / 2, (Y[1] + q[1]) / 2], V = [(F[0] + J[0]) / 2, (F[1] + J[1]) / 2];
      } else if (k.touch0) z = k.touch0[0], V = k.touch0[1];
      else return;
      k.zoom("touch", n(g(I, z, V), k.extent, s));
    }
  }
  function P(w, ...S) {
    if (this.__zooming) {
      var k = _(this, S).event(w), $ = w.changedTouches, L = $.length, C, I;
      for (nr(w), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, h), C = 0; C < L; ++C)
        I = $[C], k.touch0 && k.touch0[2] === I.identifier ? delete k.touch0 : k.touch1 && k.touch1[2] === I.identifier && delete k.touch1;
      if (k.touch1 && !k.touch0 && (k.touch0 = k.touch1, delete k.touch1), k.touch0) k.touch0[1] = this.__zoom.invert(k.touch0[0]);
      else if (k.end(), k.taps === 2 && (I = be(I, this), Math.hypot(f[0] - I[0], f[1] - I[1]) < x)) {
        var z = ge(this).on("dblclick.zoom");
        z && z.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(w) {
    return arguments.length ? (r = typeof w == "function" ? w : tn(+w), m) : r;
  }, m.filter = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : tn(!!w), m) : e;
  }, m.touchable = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : tn(!!w), m) : o;
  }, m.extent = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : tn([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), m) : t;
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
    return arguments.length ? (y = (w = +w) * w, m) : Math.sqrt(y);
  }, m.tapDistance = function(w) {
    return arguments.length ? (x = +w, m) : x;
  }, m;
}
const Se = {
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
}, Pt = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Ys = ["Enter", " ", "Escape"], Ws = {
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
var mt;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(mt || (mt = {}));
var nt;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(nt || (nt = {}));
var Dt;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Dt || (Dt = {}));
const Xs = {
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
var Ge;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Ge || (Ge = {}));
var Rt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Rt || (Rt = {}));
var W;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(W || (W = {}));
const Go = {
  [W.Left]: W.Right,
  [W.Right]: W.Left,
  [W.Top]: W.Bottom,
  [W.Bottom]: W.Top
}, Gs = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, sm = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Fr = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Wt = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ie(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, am = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Fr(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, zn(o, En(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? Pn(r) : { x: 0, y: 0, width: 0, height: 0 };
}, Xt = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = zn(n, En(o)), r = !0);
  }), r ? Pn(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Yr = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, u = t.height / o, f = [];
  for (const d of e.values()) {
    const { measured: h, selectable: p = !0, hidden: y = !1 } = d;
    if (s && !p || y)
      continue;
    const x = h.width ?? d.width ?? d.initialWidth ?? 0, m = h.height ?? d.height ?? d.initialHeight ?? 0, { x: v, y: g } = d.internals.positionAbsolute, b = Ks(a, l, c, u, v, g, x, m), N = x * m, _ = i && b > 0;
    (!d.internals.handleBounds || _ || b >= N || d.dragging) && f.push(d);
  }
  return f;
}, lm = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function cm(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = Ie(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function um({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = cm(e, s), l = Xt(a), c = Dn(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function js({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Se.error005());
    else {
      const { width: h, height: p } = Ie(a);
      h && p && (f = [
        [l, c],
        [l + h, c + p]
      ]);
    }
  else a && st(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const d = st(f) ? it(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Se.error015())), {
    position: {
      x: d.x - l + (s.measured.width ?? 0) * u[0],
      y: d.y - c + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: d
  };
}
async function dm({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((d) => d.id)), s = [];
  for (const d of n) {
    if (d.deletable === !1)
      continue;
    const h = i.has(d.id), p = !h && d.parentId && s.find((y) => y.id === d.parentId);
    (h || p) && s.push(d);
  }
  const a = new Set(t.map((d) => d.id)), l = r.filter((d) => d.deletable !== !1), u = lm(s, l);
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
const yt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), it = (e = { x: 0, y: 0 }, t, n) => ({
  x: yt(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: yt(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function qs(e, t, n) {
  const { width: r, height: o } = Ie(n), { x: i, y: s } = n.internals.positionAbsolute;
  return it(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const jo = (e, t, n) => e < t ? yt(Math.abs(e - t), 1, t) / t : e > n ? -yt(Math.abs(e - n), 1, t) / t : 0, Wr = (e, t, n = 15, r = 40) => {
  const o = jo(e.x, r, t.width - r) * n, i = jo(e.y, r, t.height - r) * n;
  return [o, i];
}, zn = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), vr = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), Pn = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), Ht = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Fr(e) ? e.internals.positionAbsolute : Wt(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, En = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Fr(e) ? e.internals.positionAbsolute : Wt(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, Us = (e, t) => Pn(zn(vr(e), vr(t))), Ks = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, kn = (e, t) => Ks(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), qo = (e) => _e(e.width) && _e(e.height) && _e(e.x) && _e(e.y), _e = (e) => !isNaN(e) && isFinite(e), Zs = (e, t) => (n, r) => {
}, Gt = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), jt = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Gt(a, s) : a;
}, wt = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function ct(e, t) {
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
function fm(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = ct(e, n), o = ct(e, t);
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
    const r = ct(e.top ?? e.y ?? 0, n), o = ct(e.bottom ?? e.y ?? 0, n), i = ct(e.left ?? e.x ?? 0, t), s = ct(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function hm(e, t, n, r, o, i) {
  const { x: s, y: a } = wt(e, [t, n, r]), { x: l, y: c } = wt({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), u = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(f)
  };
}
const Dn = (e, t, n, r, o, i) => {
  const s = fm(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), u = yt(c, r, o), f = e.x + e.width / 2, d = e.y + e.height / 2, h = t / 2 - f * u, p = n / 2 - d * u, y = hm(e, h, p, u, t, n), x = {
    left: Math.min(y.left - s.left, 0),
    top: Math.min(y.top - s.top, 0),
    right: Math.min(y.right - s.right, 0),
    bottom: Math.min(y.bottom - s.bottom, 0)
  };
  return {
    x: h - x.left + x.right,
    y: p - x.top + x.bottom,
    zoom: u
  };
}, Vt = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function st(e) {
  return e != null && e !== "parent";
}
function Ie(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function Qs(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function Js(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function Uo(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function pm() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function gm(e) {
  return { ...Ws, ...e || {} };
}
function ea(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function $t(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Ee(e), a = jt({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Gt(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const Xr = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), ta = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, mm = ["INPUT", "SELECT", "TEXTAREA"];
function na(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : mm.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const ra = (e) => "clientX" in e, Ee = (e, t) => {
  var i, s;
  const n = ra(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, Ko = (e, t, n, r, o) => {
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
      ...Xr(s)
    };
  });
};
function oa({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, u = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, u, f];
}
function nn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Zo({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case W.Left:
      return [t - nn(t - r, i), n];
    case W.Right:
      return [t + nn(r - t, i), n];
    case W.Top:
      return [t, n - nn(n - o, i)];
    case W.Bottom:
      return [t, n + nn(o - n, i)];
  }
}
function ia({ sourceX: e, sourceY: t, sourcePosition: n = W.Bottom, targetX: r, targetY: o, targetPosition: i = W.Top, curvature: s = 0.25 }) {
  const [a, l] = Zo({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, u] = Zo({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, d, h, p] = oa({
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
function sa({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function ym({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function wm({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = zn(En(e), En(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return kn(s, Pn(i)) > 0;
}
const xm = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, bm = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), vm = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Se.error006()), t;
  const r = n.getEdgeId || xm;
  let o;
  return Gs(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, bm(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function aa({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = sa({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const Qo = {
  [W.Left]: { x: -1, y: 0 },
  [W.Right]: { x: 1, y: 0 },
  [W.Top]: { x: 0, y: -1 },
  [W.Bottom]: { x: 0, y: 1 }
}, _m = ({ source: e, sourcePosition: t = W.Bottom, target: n }) => t === W.Left || t === W.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Jo = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Em({ source: e, sourcePosition: t = W.Bottom, target: n, targetPosition: r = W.Top, center: o, offset: i, stepPosition: s }) {
  const a = Qo[t], l = Qo[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + l.x * i, y: n.y + l.y * i }, f = _m({
    source: c,
    sourcePosition: t,
    target: u
  }), d = f.x !== 0 ? "x" : "y", h = f[d];
  let p = [], y, x;
  const m = { x: 0, y: 0 }, v = { x: 0, y: 0 }, [, , g, b] = sa({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[d] * l[d] === -1) {
    d === "x" ? (y = o.x ?? c.x + (u.x - c.x) * s, x = o.y ?? (c.y + u.y) / 2) : (y = o.x ?? (c.x + u.x) / 2, x = o.y ?? c.y + (u.y - c.y) * s);
    const T = [
      { x: y, y: c.y },
      { x: y, y: u.y }
    ], A = [
      { x: c.x, y: x },
      { x: u.x, y: x }
    ];
    a[d] === h ? p = d === "x" ? T : A : p = d === "x" ? A : T;
  } else {
    const T = [{ x: c.x, y: u.y }], A = [{ x: u.x, y: c.y }];
    if (d === "x" ? p = a.x === h ? A : T : p = a.y === h ? T : A, t === r) {
      const w = Math.abs(e[d] - n[d]);
      if (w <= i) {
        const S = Math.min(i - 1, i - w);
        a[d] === h ? m[d] = (c[d] > e[d] ? -1 : 1) * S : v[d] = (u[d] > n[d] ? -1 : 1) * S;
      }
    }
    if (t !== r) {
      const w = d === "x" ? "y" : "x", S = a[d] === l[w], k = c[w] > u[w], $ = c[w] < u[w];
      (a[d] === 1 && (!S && k || S && $) || a[d] !== 1 && (!S && $ || S && k)) && (p = d === "x" ? T : A);
    }
    const R = { x: c.x + m.x, y: c.y + m.y }, O = { x: u.x + v.x, y: u.y + v.y }, H = Math.max(Math.abs(R.x - p[0].x), Math.abs(O.x - p[0].x)), P = Math.max(Math.abs(R.y - p[0].y), Math.abs(O.y - p[0].y));
    H >= P ? (y = (R.x + O.x) / 2, x = p[0].y) : (y = p[0].x, x = (R.y + O.y) / 2);
  }
  const N = { x: c.x + m.x, y: c.y + m.y }, _ = { x: u.x + v.x, y: u.y + v.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...N.x !== p[0].x || N.y !== p[0].y ? [N] : [],
    ...p,
    ..._.x !== p[p.length - 1].x || _.y !== p[p.length - 1].y ? [_] : [],
    n
  ], y, x, g, b];
}
function km(e, t, n, r) {
  const o = Math.min(Jo(e, t) / 2, Jo(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * u}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function _r({ sourceX: e, sourceY: t, sourcePosition: n = W.Bottom, targetX: r, targetY: o, targetPosition: i = W.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: u = 0.5 }) {
  const [f, d, h, p, y] = Em({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: u
  });
  let x = `M${f[0].x} ${f[0].y}`;
  for (let m = 1; m < f.length - 1; m++)
    x += km(f[m - 1], f[m], f[m + 1], s);
  return x += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [x, d, h, p, y];
}
function ei(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Nm(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!ei(t) || !ei(n))
    return null;
  const r = t.internals.handleBounds || ti(t.handles), o = n.internals.handleBounds || ti(n.handles), i = ni((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = ni(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === mt.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Se.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || W.Bottom, l = (s == null ? void 0 : s.position) || W.Top, c = at(t, i, a), u = at(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function ti(e) {
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
function at(e, t, n = W.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ie(e);
  if (r)
    return { x: o + s / 2, y: i + a / 2 };
  switch ((t == null ? void 0 : t.position) ?? n) {
    case W.Top:
      return { x: o + s / 2, y: i };
    case W.Right:
      return { x: o + s, y: i + a / 2 };
    case W.Bottom:
      return { x: o + s / 2, y: i + a };
    case W.Left:
      return { x: o, y: i + a / 2 };
  }
}
function ni(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Er(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function Sm(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = Er(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const la = 1e3, Cm = 10, Gr = {
  nodeOrigin: [0, 0],
  nodeExtent: Pt,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Mm = {
  ...Gr,
  checkEquality: !0
};
function jr(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function Im(e, t, n) {
  const r = jr(Gr, n);
  for (const o of e.values())
    if (o.parentId)
      Ur(o, e, t, r);
    else {
      const i = Wt(o, r.nodeOrigin), s = st(o.extent) ? o.extent : r.nodeExtent, a = it(i, s, Ie(o));
      o.internals.positionAbsolute = a;
    }
}
function $m(e, t) {
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
function qr(e) {
  return e === "manual";
}
function kr(e, t, n, r = {}) {
  var u, f;
  const o = jr(Mm, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !qr(o.zIndexMode) ? la : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const d of e) {
    let h = s.get(d.id);
    if (o.checkEquality && d === (h == null ? void 0 : h.internals.userNode))
      t.set(d.id, h);
    else {
      const p = Wt(d, o.nodeOrigin), y = st(d.extent) ? d.extent : o.nodeExtent, x = it(p, y, Ie(d));
      h = {
        ...o.defaults,
        ...d,
        measured: {
          width: (u = d.measured) == null ? void 0 : u.width,
          height: (f = d.measured) == null ? void 0 : f.height
        },
        internals: {
          positionAbsolute: x,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: $m(d, h),
          z: ca(d, a, o.zIndexMode),
          userNode: d
        }
      }, t.set(d.id, h);
    }
    (h.measured === void 0 || h.measured.width === void 0 || h.measured.height === void 0) && !h.hidden && (l = !1), d.parentId && Ur(h, t, n, r, i), c || (c = d.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Am(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Ur(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = jr(Gr, r), c = e.parentId, u = t.get(c);
  if (!u) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Am(e, n), o && !u.parentId && u.internals.rootParentIndex === void 0 && l === "auto" && (u.internals.rootParentIndex = ++o.i, u.internals.z = u.internals.z + o.i * Cm), o && u.internals.rootParentIndex !== void 0 && (o.i = u.internals.rootParentIndex);
  const f = i && !qr(l) ? la : 0, { x: d, y: h, z: p } = Tm(e, u, s, a, f, l), { positionAbsolute: y } = e.internals, x = d !== y.x || h !== y.y;
  (x || p !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: x ? { x: d, y: h } : y,
      z: p
    }
  });
}
function ca(e, t, n) {
  const r = _e(e.zIndex) ? e.zIndex : 0;
  return qr(n) ? r : r + (e.selected ? t : 0);
}
function Tm(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ie(e), c = Wt(e, n), u = st(e.extent) ? it(c, e.extent, l) : c;
  let f = it({ x: s + u.x, y: a + u.y }, r, l);
  e.extent === "parent" && (f = qs(f, l, t));
  const d = ca(e, o, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= d ? h + 1 : d
  };
}
function Kr(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? Ht(l), u = Us(c, a.rect);
    i.set(a.parentId, { expandedRect: u, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var g;
    const u = l.internals.positionAbsolute, f = Ie(l), d = l.origin ?? r, h = a.x < u.x ? Math.round(Math.abs(u.x - a.x)) : 0, p = a.y < u.y ? Math.round(Math.abs(u.y - a.y)) : 0, y = Math.max(f.width, Math.round(a.width)), x = Math.max(f.height, Math.round(a.height)), m = (y - f.width) * d[0], v = (x - f.height) * d[1];
    (h > 0 || p > 0 || m || v) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - h + m,
        y: l.position.y - p + v
      }
    }), (g = n.get(c)) == null || g.forEach((b) => {
      e.some((N) => N.id === b.id) || o.push({
        id: b.id,
        type: "position",
        position: {
          x: b.position.x + h,
          y: b.position.y + p
        }
      });
    })), (f.width < a.width || f.height < a.height || h || p) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: y + (h ? d[0] * h - m : 0),
        height: x + (p ? d[1] * p - v : 0)
      }
    });
  }), o;
}
function Lm(e, t, n, r, o, i, s) {
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
    const y = Xr(h.nodeElement), x = p.measured.width !== y.width || p.measured.height !== y.height;
    if (!!(y.width && y.height && (x || !p.internals.handleBounds || h.force))) {
      const v = h.nodeElement.getBoundingClientRect(), g = st(p.extent) ? p.extent : i;
      let { positionAbsolute: b } = p.internals;
      if (p.parentId && p.extent === "parent") {
        const _ = t.get(p.parentId);
        _ && (b = qs(b, y, _));
      } else g && (b = it(b, g, y));
      const N = {
        ...p,
        measured: y,
        internals: {
          ...p.internals,
          positionAbsolute: b,
          handleBounds: {
            source: Ko("source", h.nodeElement, v, f, p.id),
            target: Ko("target", h.nodeElement, v, f, p.id)
          }
        }
      };
      t.set(p.id, N), p.parentId && Ur(N, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, x && (c.push({
        id: p.id,
        type: "dimensions",
        dimensions: y
      }), p.expandParent && p.parentId && d.push({
        id: p.id,
        parentId: p.parentId,
        rect: Ht(N, o)
      }));
    }
  }
  if (d.length > 0) {
    const h = Kr(d, t, n, o);
    c.push(...h);
  }
  return { changes: c, updatedInternals: l };
}
async function Om({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function ri(e, t, n, r, o, i) {
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
function ua(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, u = `${i}-${a}--${o}-${s}`;
    ri("source", l, u, e, o, s), ri("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function da(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : da(n, t) : !1;
}
function oi(e, t, n) {
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
function zm(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !da(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function rr({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
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
function Pm({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Gt(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function Dm({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, u = null, f = !1, d = null, h = !1, p = !1, y = null;
  function x({ noDragClassName: v, handleSelector: g, domNode: b, isSelectable: N, nodeId: _, nodeClickDistance: M = 0 }) {
    d = ge(b);
    function T({ x: H, y: P }) {
      const { nodeLookup: w, nodeExtent: S, snapGrid: k, snapToGrid: $, nodeOrigin: L, onNodeDrag: C, onSelectionDrag: I, onError: z, updateNodePositions: V } = t();
      i = { x: H, y: P };
      let Y = !1;
      const F = a.size > 1, q = F && S ? vr(Xt(a)) : null, J = F && $ ? Pm({
        dragItems: a,
        snapGrid: k,
        x: H,
        y: P
      }) : null;
      for (const [G, D] of a) {
        if (!w.has(G))
          continue;
        let B = { x: H - D.distance.x, y: P - D.distance.y };
        $ && (B = J ? {
          x: Math.round(B.x + J.x),
          y: Math.round(B.y + J.y)
        } : Gt(B, k));
        let U = null;
        if (F && S && !D.extent && q) {
          const { positionAbsolute: Z } = D.internals, Q = Z.x - q.x + S[0][0], ee = Z.x + D.measured.width - q.x2 + S[1][0], re = Z.y - q.y + S[0][1], ie = Z.y + D.measured.height - q.y2 + S[1][1];
          U = [
            [Q, re],
            [ee, ie]
          ];
        }
        const { position: K, positionAbsolute: X } = js({
          nodeId: G,
          nextPosition: B,
          nodeLookup: w,
          nodeExtent: U || S,
          nodeOrigin: L,
          onError: z
        });
        Y = Y || D.position.x !== K.x || D.position.y !== K.y, D.position = K, D.internals.positionAbsolute = X;
      }
      if (p = p || Y, !!Y && (V(a, !0), y && (r || C || !_ && I))) {
        const [G, D] = rr({
          nodeId: _,
          dragItems: a,
          nodeLookup: w
        });
        r == null || r(y, a, G, D), C == null || C(y, G, D), _ || I == null || I(y, D);
      }
    }
    async function A() {
      if (!u)
        return;
      const { transform: H, panBy: P, autoPanSpeed: w, autoPanOnNodeDrag: S } = t();
      if (!S) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [k, $] = Wr(c, u, w);
      (k !== 0 || $ !== 0) && (i.x = (i.x ?? 0) - k / H[2], i.y = (i.y ?? 0) - $ / H[2], await P({ x: k, y: $ }) && T(i)), s = requestAnimationFrame(A);
    }
    function R(H) {
      var F;
      const { nodeLookup: P, multiSelectionActive: w, nodesDraggable: S, transform: k, snapGrid: $, snapToGrid: L, selectNodesOnDrag: C, onNodeDragStart: I, onSelectionDragStart: z, unselectNodesAndEdges: V } = t();
      f = !0, (!C || !N) && !w && _ && ((F = P.get(_)) != null && F.selected || V()), N && C && _ && (e == null || e(_));
      const Y = $t(H.sourceEvent, { transform: k, snapGrid: $, snapToGrid: L, containerBounds: u });
      if (i = Y, a = zm(P, S, Y, _), a.size > 0 && (n || I || !_ && z)) {
        const [q, J] = rr({
          nodeId: _,
          dragItems: a,
          nodeLookup: P
        });
        n == null || n(H.sourceEvent, a, q, J), I == null || I(H.sourceEvent, q, J), _ || z == null || z(H.sourceEvent, J);
      }
    }
    const O = Cs().clickDistance(M).on("start", (H) => {
      const { domNode: P, nodeDragThreshold: w, transform: S, snapGrid: k, snapToGrid: $ } = t();
      u = (P == null ? void 0 : P.getBoundingClientRect()) || null, h = !1, p = !1, y = H.sourceEvent, w === 0 && R(H), i = $t(H.sourceEvent, { transform: S, snapGrid: k, snapToGrid: $, containerBounds: u }), c = Ee(H.sourceEvent, u);
    }).on("drag", (H) => {
      const { autoPanOnNodeDrag: P, transform: w, snapGrid: S, snapToGrid: k, nodeDragThreshold: $, nodeLookup: L } = t(), C = $t(H.sourceEvent, { transform: w, snapGrid: S, snapToGrid: k, containerBounds: u });
      if (y = H.sourceEvent, (H.sourceEvent.type === "touchmove" && H.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      _ && !L.has(_)) && (h = !0), !h) {
        if (!l && P && f && (l = !0, A()), !f) {
          const I = Ee(H.sourceEvent, u), z = I.x - c.x, V = I.y - c.y;
          Math.sqrt(z * z + V * V) > $ && R(H);
        }
        (i.x !== C.xSnapped || i.y !== C.ySnapped) && a && f && (c = Ee(H.sourceEvent, u), T(C));
      }
    }).on("end", (H) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: P, updateNodePositions: w, onNodeDragStop: S, onSelectionDragStop: k } = t();
        if (p && (w(a, !1), p = !1), o || S || !_ && k) {
          const [$, L] = rr({
            nodeId: _,
            dragItems: a,
            nodeLookup: P,
            dragging: !1
          });
          o == null || o(H.sourceEvent, a, $, L), S == null || S(H.sourceEvent, $, L), _ || k == null || k(H.sourceEvent, L);
        }
      }
    }).filter((H) => {
      const P = H.target;
      return !H.button && (!v || !oi(P, `.${v}`, b)) && (!g || oi(P, g, b));
    });
    d.call(O);
  }
  function m() {
    d == null || d.on(".drag", null);
  }
  return {
    update: x,
    destroy: m
  };
}
function Rm(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    kn(o, Ht(i)) > 0 && r.push(i);
  return r;
}
const Hm = 250;
function Vm(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = Rm(e, n, t + Hm);
  for (const c of s) {
    const u = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of u) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: d, y: h } = at(c, f, f.position, !0), p = Math.sqrt(Math.pow(d - e.x, 2) + Math.pow(h - e.y, 2));
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
function fa(e, t, n, r, o, i = !1) {
  var c, u, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((u = s.internals.handleBounds) == null ? void 0 : u.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((d) => d.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...at(s, l, l.position, !0) } : l;
}
function ha(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function Bm(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const pa = () => !0;
function Fm(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: u, flowId: f, panBy: d, cancelConnection: h, onConnectStart: p, onConnect: y, onConnectEnd: x, isValidConnection: m = pa, onReconnectEnd: v, updateConnection: g, getTransform: b, getFromHandle: N, autoPanSpeed: _, dragThreshold: M = 1, handleDomNode: T }) {
  const A = ta(e.target);
  let R = 0, O;
  const { x: H, y: P } = Ee(e), w = ha(i, T), S = a == null ? void 0 : a.getBoundingClientRect();
  let k = !1;
  if (!S || !w)
    return;
  const $ = fa(o, w, r, l, t);
  if (!$)
    return;
  let L = Ee(e, S), C = !1, I = null, z = !1, V = null;
  function Y() {
    if (!u || !S)
      return;
    const [K, X] = Wr(L, S, _);
    d({ x: K, y: X }), R = requestAnimationFrame(Y);
  }
  const F = {
    ...$,
    nodeId: o,
    type: w,
    position: $.position
  }, q = l.get(o);
  let G = {
    inProgress: !0,
    isValid: null,
    from: at(q, F, W.Left, !0),
    fromHandle: F,
    fromPosition: F.position,
    fromNode: q,
    to: L,
    toHandle: null,
    toPosition: Go[F.position],
    toNode: null,
    pointer: L
  };
  function D() {
    k = !0, g(G), p == null || p(e, { nodeId: o, handleId: r, handleType: w });
  }
  M === 0 && D();
  function B(K) {
    if (!k) {
      const { x: ie, y: ye } = Ee(K), $e = ie - H, Ae = ye - P;
      if (!($e * $e + Ae * Ae > M * M))
        return;
      D();
    }
    if (!N() || !F) {
      U(K);
      return;
    }
    const X = b();
    L = Ee(K, S), O = Vm(jt(L, X, !1, [1, 1]), n, l, F), C || (Y(), C = !0);
    const Z = ga(K, {
      handle: O,
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
    V = Z.handleDomNode, I = Z.connection, z = Bm(!!O, Z.isValid);
    const Q = l.get(o), ee = Q ? at(Q, F, W.Left, !0) : G.from, re = {
      ...G,
      from: ee,
      isValid: z,
      to: Z.toHandle && z ? wt({ x: Z.toHandle.x, y: Z.toHandle.y }, X) : L,
      toHandle: Z.toHandle,
      toPosition: z && Z.toHandle ? Z.toHandle.position : Go[F.position],
      toNode: Z.toHandle ? l.get(Z.toHandle.nodeId) : null,
      pointer: L
    };
    g(re), G = re;
  }
  function U(K) {
    if (!("touches" in K && K.touches.length > 0)) {
      if (k) {
        (O || V) && I && z && (y == null || y(I));
        const { inProgress: X, ...Z } = G, Q = {
          ...Z,
          toPosition: G.toHandle ? G.toPosition : null
        };
        x == null || x(K, Q), i && (v == null || v(K, Q));
      }
      h(), cancelAnimationFrame(R), C = !1, z = !1, I = null, V = null, A.removeEventListener("mousemove", B), A.removeEventListener("mouseup", U), A.removeEventListener("touchmove", B), A.removeEventListener("touchend", U);
    }
  }
  A.addEventListener("mousemove", B), A.addEventListener("mouseup", U), A.addEventListener("touchmove", B), A.addEventListener("touchend", U);
}
function ga(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = pa, nodeLookup: u }) {
  const f = i === "target", d = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: h, y: p } = Ee(e), y = s.elementFromPoint(h, p), x = y != null && y.classList.contains(`${a}-flow__handle`) ? y : d, m = {
    handleDomNode: x,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (x) {
    const v = ha(void 0, x), g = x.getAttribute("data-nodeid"), b = x.getAttribute("data-handleid"), N = x.classList.contains("connectable"), _ = x.classList.contains("connectableend");
    if (!g || !v)
      return m;
    const M = {
      source: f ? g : r,
      sourceHandle: f ? b : o,
      target: f ? r : g,
      targetHandle: f ? o : b
    };
    m.connection = M;
    const A = N && _ && (n === mt.Strict ? f && v === "source" || !f && v === "target" : g !== r || b !== o);
    m.isValid = A && c(M), m.toHandle = fa(g, v, b, u, n, !0);
  }
  return m;
}
const Nr = {
  onPointerDown: Fm,
  isValid: ga
};
function Ym({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = ge(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: u = 1, pannable: f = !0, zoomable: d = !0, inversePan: h = !1 }) {
    const p = (g) => {
      if (g.sourceEvent.type !== "wheel" || !t)
        return;
      const b = n(), N = g.sourceEvent.ctrlKey && Vt() ? 10 : 1, _ = -g.sourceEvent.deltaY * (g.sourceEvent.deltaMode === 1 ? 0.05 : g.sourceEvent.deltaMode ? 1 : 2e-3) * u, M = b[2] * Math.pow(2, _ * N);
      t.scaleTo(M);
    };
    let y = [0, 0];
    const x = (g) => {
      (g.sourceEvent.type === "mousedown" || g.sourceEvent.type === "touchstart") && (y = [
        g.sourceEvent.clientX ?? g.sourceEvent.touches[0].clientX,
        g.sourceEvent.clientY ?? g.sourceEvent.touches[0].clientY
      ]);
    }, m = (g) => {
      const b = n();
      if (g.sourceEvent.type !== "mousemove" && g.sourceEvent.type !== "touchmove" || !t)
        return;
      const N = [
        g.sourceEvent.clientX ?? g.sourceEvent.touches[0].clientX,
        g.sourceEvent.clientY ?? g.sourceEvent.touches[0].clientY
      ], _ = [N[0] - y[0], N[1] - y[1]];
      y = N;
      const M = r() * Math.max(b[2], Math.log(b[2])) * (h ? -1 : 1), T = {
        x: b[0] - _[0] * M,
        y: b[1] - _[1] * M
      }, A = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: T.x,
        y: T.y,
        zoom: b[2]
      }, A, a);
    }, v = Fs().on("start", x).on("zoom", f ? m : null).on("zoom.wheel", d ? p : null);
    o.call(v, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: be
  };
}
const Rn = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), or = ({ x: e, y: t, zoom: n }) => On.translate(e, t).scale(n), Xe = (e, t) => e.target.closest(`.${t}`), ma = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Wm = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, ir = (e, t = 0, n = Wm, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, ya = (e) => {
  const t = e.ctrlKey && Vt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function Xm({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (u) => {
    if (Xe(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const x = be(u), m = ya(u), v = f * Math.pow(2, m);
      r.scaleTo(n, v, x, u);
      return;
    }
    const d = u.deltaMode === 1 ? 20 : 1;
    let h = o === nt.Vertical ? 0 : u.deltaX * d, p = o === nt.Horizontal ? 0 : u.deltaY * d;
    !Vt() && u.shiftKey && o !== nt.Vertical && (h = u.deltaY * d, p = 0), r.translateBy(
      n,
      -(h / f) * i,
      -(p / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const y = Rn(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(u, y) : (e.isPanScrolling = !0, a == null || a(u, y)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(u, y), e.isPanScrolling = !1;
    }, 150);
  };
}
function Gm({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = Xe(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function jm({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = Rn(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function qm({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && ma(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, Rn(i.transform)));
  };
}
function Um({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && ma(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = Rn(s.transform);
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
function Km({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: u, connectionInProgress: f }) {
  return (d) => {
    var m;
    const h = t || n, p = r && d.ctrlKey, y = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (Xe(d, `${u}-flow__node`) || Xe(d, `${u}-flow__edge`) || Xe(d, `${u}-flow__selection`) || Xe(d, `${u}-flow__nodesselection`)))
      return !0;
    if (!o && !h && !i && !s && !r || a || f && !y || Xe(d, l) && y || Xe(d, c) && (!y || i && y && !t) || !r && d.ctrlKey && y)
      return !1;
    if (!r && d.type === "touchstart" && ((m = d.touches) == null ? void 0 : m.length) > 1)
      return d.preventDefault(), !1;
    if (!h && !i && !p && y || !o && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(o) && !o.includes(d.button) && d.type === "mousedown")
      return !1;
    const x = Array.isArray(o) && o.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || y || e) && x;
  };
}
function Zm({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
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
  const d = typeof ResizeObserver < "u" ? new ResizeObserver((P) => {
    const w = P[0];
    w && (f = [
      [0, 0],
      [w.contentRect.width, w.contentRect.height]
    ]);
  }) : null;
  d == null || d.observe(e);
  const h = Fs().extent(() => f).scaleExtent([t, n]).translateExtent(r), p = ge(e).call(h);
  b({
    x: o.x,
    y: o.y,
    zoom: yt(o.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], r);
  const y = p.on("wheel.zoom"), x = p.on("dblclick.zoom");
  h.wheelDelta(ya);
  async function m(P, w) {
    return p ? new Promise((S) => {
      h == null || h.interpolate((w == null ? void 0 : w.interpolate) === "linear" ? It : cn).transform(ir(p, w == null ? void 0 : w.duration, w == null ? void 0 : w.ease, () => S(!0)), P);
    }) : !1;
  }
  function v({ noWheelClassName: P, noPanClassName: w, onPaneContextMenu: S, userSelectionActive: k, panOnScroll: $, panOnDrag: L, panOnScrollMode: C, panOnScrollSpeed: I, preventScrolling: z, zoomOnPinch: V, zoomOnScroll: Y, zoomOnDoubleClick: F, panActivationKeyPressed: q = !1, zoomActivationKeyPressed: J, lib: G, onTransformChange: D, connectionInProgress: B, paneClickDistance: U, selectionOnDrag: K }) {
    k && !c.isZoomingOrPanning && g();
    const X = $ && !J && !k;
    h.clickDistance(K ? 1 / 0 : !_e(U) || U < 0 ? 0 : U);
    const Z = X ? Xm({
      zoomPanValues: c,
      noWheelClassName: P,
      d3Selection: p,
      d3Zoom: h,
      panOnScrollMode: C,
      panOnScrollSpeed: I,
      zoomOnPinch: V,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : Gm({
      noWheelClassName: P,
      preventScrolling: z,
      d3ZoomHandler: y
    });
    p.on("wheel.zoom", Z, { passive: !1 });
    const Q = jm({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    h.on("start", Q);
    const ee = qm({
      zoomPanValues: c,
      panOnDrag: L,
      onPaneContextMenu: !!S,
      onPanZoom: i,
      onTransformChange: D
    });
    h.on("zoom", ee);
    const re = Um({
      zoomPanValues: c,
      panOnDrag: L,
      panOnScroll: $,
      onPaneContextMenu: S,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    h.on("end", re);
    const ie = Km({
      panActivationKeyPressed: q,
      zoomActivationKeyPressed: J,
      panOnDrag: L,
      zoomOnScroll: Y,
      panOnScroll: $,
      zoomOnDoubleClick: F,
      zoomOnPinch: V,
      userSelectionActive: k,
      noPanClassName: w,
      noWheelClassName: P,
      lib: G,
      connectionInProgress: B
    });
    h.filter(ie), F ? p.on("dblclick.zoom", x) : p.on("dblclick.zoom", null);
  }
  function g() {
    h.on("zoom", null);
  }
  async function b(P, w, S) {
    const k = or(P), $ = h == null ? void 0 : h.constrain()(k, w, S);
    return $ && await m($), $;
  }
  async function N(P, w) {
    const S = or(P);
    return await m(S, w), S;
  }
  function _(P) {
    if (p) {
      const w = or(P), S = p.property("__zoom");
      (S.k !== P.zoom || S.x !== P.x || S.y !== P.y) && (h == null || h.transform(p, w, null, { sync: !0 }));
    }
  }
  function M() {
    const P = p ? Bs(p.node()) : { x: 0, y: 0, k: 1 };
    return { x: P.x, y: P.y, zoom: P.k };
  }
  async function T(P, w) {
    return p ? new Promise((S) => {
      h == null || h.interpolate((w == null ? void 0 : w.interpolate) === "linear" ? It : cn).scaleTo(ir(p, w == null ? void 0 : w.duration, w == null ? void 0 : w.ease, () => S(!0)), P);
    }) : !1;
  }
  async function A(P, w) {
    return p ? new Promise((S) => {
      h == null || h.interpolate((w == null ? void 0 : w.interpolate) === "linear" ? It : cn).scaleBy(ir(p, w == null ? void 0 : w.duration, w == null ? void 0 : w.ease, () => S(!0)), P);
    }) : !1;
  }
  function R(P) {
    h == null || h.scaleExtent(P);
  }
  function O(P) {
    h == null || h.translateExtent(P);
  }
  function H(P) {
    const w = !_e(P) || P < 0 ? 0 : P;
    h == null || h.clickDistance(w);
  }
  return {
    update: v,
    destroy: g,
    setViewport: N,
    setViewportConstrained: b,
    getViewport: M,
    scaleTo: T,
    scaleBy: A,
    setScaleExtent: R,
    setTranslateExtent: O,
    syncViewport: _,
    setClickDistance: H
  };
}
var xt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(xt || (xt = {}));
function Qm({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function ii(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function Ye(e, t) {
  return Math.max(0, t - e);
}
function We(e, t) {
  return Math.max(0, e - t);
}
function rn(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function si(e, t) {
  return e ? !t : t;
}
function Jm(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: u, isVertical: f } = t, d = u && f, { xSnapped: h, ySnapped: p } = n, { minWidth: y, maxWidth: x, minHeight: m, maxHeight: v } = r, { x: g, y: b, width: N, height: _, aspectRatio: M } = e;
  let T = Math.floor(u ? h - e.pointerX : 0), A = Math.floor(f ? p - e.pointerY : 0);
  const R = N + (l ? -T : T), O = _ + (c ? -A : A), H = -i[0] * N, P = -i[1] * _;
  let w = rn(R, y, x), S = rn(O, m, v);
  if (s) {
    let L = 0, C = 0;
    l && T < 0 ? L = Ye(g + T + H, s[0][0]) : !l && T > 0 && (L = We(g + R + H, s[1][0])), c && A < 0 ? C = Ye(b + A + P, s[0][1]) : !c && A > 0 && (C = We(b + O + P, s[1][1])), w = Math.max(w, L), S = Math.max(S, C);
  }
  if (a) {
    let L = 0, C = 0;
    l && T > 0 ? L = We(g + T, a[0][0]) : !l && T < 0 && (L = Ye(g + R, a[1][0])), c && A > 0 ? C = We(b + A, a[0][1]) : !c && A < 0 && (C = Ye(b + O, a[1][1])), w = Math.max(w, L), S = Math.max(S, C);
  }
  if (o) {
    if (u) {
      const L = rn(R / M, m, v) * M;
      if (w = Math.max(w, L), s) {
        let C = 0;
        !l && !c || l && !c && d ? C = We(b + P + R / M, s[1][1]) * M : C = Ye(b + P + (l ? T : -T) / M, s[0][1]) * M, w = Math.max(w, C);
      }
      if (a) {
        let C = 0;
        !l && !c || l && !c && d ? C = Ye(b + R / M, a[1][1]) * M : C = We(b + (l ? T : -T) / M, a[0][1]) * M, w = Math.max(w, C);
      }
    }
    if (f) {
      const L = rn(O * M, y, x) / M;
      if (S = Math.max(S, L), s) {
        let C = 0;
        !l && !c || c && !l && d ? C = We(g + O * M + H, s[1][0]) / M : C = Ye(g + (c ? A : -A) * M + H, s[0][0]) / M, S = Math.max(S, C);
      }
      if (a) {
        let C = 0;
        !l && !c || c && !l && d ? C = Ye(g + O * M, a[1][0]) / M : C = We(g + (c ? A : -A) * M, a[0][0]) / M, S = Math.max(S, C);
      }
    }
  }
  A = A + (A < 0 ? S : -S), T = T + (T < 0 ? w : -w), o && (d ? R > O * M ? A = (si(l, c) ? -T : T) / M : T = (si(l, c) ? -A : A) * M : u ? (A = T / M, c = l) : (T = A * M, l = c));
  const k = l ? g + T : g, $ = c ? b + A : b;
  return {
    width: N + (l ? -T : T),
    height: _ + (c ? -A : A),
    x: i[0] * T * (l ? -1 : 1) + k,
    y: i[1] * A * (c ? -1 : 1) + $
  };
}
const wa = { width: 0, height: 0, x: 0, y: 0 }, ey = {
  ...wa,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function ty(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function ny({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = ge(e);
  let s = {
    controlDirection: ii("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: u, keepAspectRatio: f, resizeDirection: d, onResizeStart: h, onResize: p, onResizeEnd: y, shouldResize: x }) {
    let m = { ...wa }, v = { ...ey };
    s = {
      boundaries: u,
      resizeDirection: d,
      keepAspectRatio: f,
      controlDirection: ii(c)
    };
    let g, b = null, N = [], _, M, T;
    const A = Cs().on("start", (R) => {
      const { nodeLookup: O, transform: H, snapGrid: P, snapToGrid: w, nodeOrigin: S, paneDomNode: k } = n();
      if (g = O.get(t), !g)
        return;
      b = (k == null ? void 0 : k.getBoundingClientRect()) ?? null;
      const { xSnapped: $, ySnapped: L } = $t(R.sourceEvent, {
        transform: H,
        snapGrid: P,
        snapToGrid: w,
        containerBounds: b
      });
      m = {
        width: g.measured.width ?? 0,
        height: g.measured.height ?? 0,
        x: g.position.x ?? 0,
        y: g.position.y ?? 0
      }, v = {
        ...m,
        pointerX: $,
        pointerY: L,
        aspectRatio: m.width / m.height
      }, _ = void 0, M = st(g.extent) ? g.extent : void 0, g.parentId && (g.extent === "parent" || g.expandParent) && (_ = O.get(g.parentId)), _ && g.extent === "parent" && (M = [
        [0, 0],
        [_.measured.width, _.measured.height]
      ]), N = [], T = void 0;
      for (const [C, I] of O)
        if (I.parentId === t && (N.push({
          id: C,
          position: { ...I.position },
          extent: I.extent
        }), I.extent === "parent" || I.expandParent)) {
          const z = ty(I, g, I.origin ?? S);
          T ? T = [
            [Math.min(z[0][0], T[0][0]), Math.min(z[0][1], T[0][1])],
            [Math.max(z[1][0], T[1][0]), Math.max(z[1][1], T[1][1])]
          ] : T = z;
        }
      h == null || h(R, { ...m });
    }).on("drag", (R) => {
      const { transform: O, snapGrid: H, snapToGrid: P, nodeOrigin: w } = n(), S = $t(R.sourceEvent, {
        transform: O,
        snapGrid: H,
        snapToGrid: P,
        containerBounds: b
      }), k = [];
      if (!g)
        return;
      const { x: $, y: L, width: C, height: I } = m, z = {}, V = g.origin ?? w, { width: Y, height: F, x: q, y: J } = Jm(v, s.controlDirection, S, s.boundaries, s.keepAspectRatio, V, M, T), G = Y !== C, D = F !== I, B = q !== $ && G, U = J !== L && D;
      if (!B && !U && !G && !D)
        return;
      const K = {
        prevValues: { ...m },
        startX: v.x,
        startY: v.y,
        childNodes: N.map((ee) => ({
          ...ee,
          position: { ...ee.position }
        }))
      };
      if ((B || U || V[0] === 1 || V[1] === 1) && (z.x = B ? q : m.x, z.y = U ? J : m.y, m.x = z.x, m.y = z.y, N.length > 0)) {
        const ee = q - $, re = J - L;
        for (const ie of N)
          ie.position = {
            x: ie.position.x - ee + V[0] * (Y - C),
            y: ie.position.y - re + V[1] * (F - I)
          }, k.push(ie);
      }
      if ((G || D) && (z.width = G && (!s.resizeDirection || s.resizeDirection === "horizontal") ? Y : m.width, z.height = D && (!s.resizeDirection || s.resizeDirection === "vertical") ? F : m.height, m.width = z.width, m.height = z.height), _ && g.expandParent) {
        const ee = V[0] * (z.width ?? 0);
        z.x && z.x < ee && (m.x = ee, v.x = v.x - (z.x - ee));
        const re = V[1] * (z.height ?? 0);
        z.y && z.y < re && (m.y = re, v.y = v.y - (z.y - re));
      }
      const X = Qm({
        width: m.width,
        prevWidth: C,
        height: m.height,
        prevHeight: I,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), Z = { ...m, direction: X };
      if ((x == null ? void 0 : x(R, Z)) === !1) {
        m = K.prevValues, v.x = K.startX, v.y = K.startY, N.forEach((ee, re) => {
          ee.position = K.childNodes[re].position;
        });
        return;
      }
      p == null || p(R, Z), r(z, k);
    }).on("end", (R) => {
      y == null || y(R, { ...m }), o == null || o({ ...m });
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
var xa = { exports: {} }, ba = {}, va = { exports: {} }, _a = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var bt = $r;
function ry(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var oy = typeof Object.is == "function" ? Object.is : ry, iy = bt.useState, sy = bt.useEffect, ay = bt.useLayoutEffect, ly = bt.useDebugValue;
function cy(e, t) {
  var n = t(), r = iy({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return ay(
    function() {
      o.value = n, o.getSnapshot = t, sr(o) && i({ inst: o });
    },
    [e, n, t]
  ), sy(
    function() {
      return sr(o) && i({ inst: o }), e(function() {
        sr(o) && i({ inst: o });
      });
    },
    [e]
  ), ly(n), n;
}
function sr(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !oy(e, n);
  } catch {
    return !0;
  }
}
function uy(e, t) {
  return t();
}
var dy = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? uy : cy;
_a.useSyncExternalStore = bt.useSyncExternalStore !== void 0 ? bt.useSyncExternalStore : dy;
va.exports = _a;
var fy = va.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hn = $r, hy = fy;
function py(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var gy = typeof Object.is == "function" ? Object.is : py, my = hy.useSyncExternalStore, yy = Hn.useRef, wy = Hn.useEffect, xy = Hn.useMemo, by = Hn.useDebugValue;
ba.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = yy(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = xy(
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
        if (p = f, gy(u, h)) return p;
        var y = r(h);
        return o !== void 0 && o(p, y) ? (u = h, p) : (u = h, f = y);
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
  var a = my(e, i[0], i[1]);
  return wy(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), by(a), a;
};
xa.exports = ba;
var vy = xa.exports;
const _y = /* @__PURE__ */ Vi(vy), Ey = {}, ai = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (u, f) => {
    const d = typeof u == "function" ? u(t) : u;
    if (!Object.is(d, t)) {
      const h = t;
      t = f ?? (typeof d != "object" || d === null) ? d : Object.assign({}, t, d), n.forEach((p) => p(t, h));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (u) => (n.add(u), () => n.delete(u)), destroy: () => {
    (Ey ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, ky = (e) => e ? ai(e) : ai, { useDebugValue: Ny } = $r, { useSyncExternalStoreWithSelector: Sy } = _y, Cy = (e) => e;
function Ea(e, t = Cy, n) {
  const r = Sy(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Ny(r), r;
}
const li = (e, t) => {
  const n = ky(e), r = (o, i = t) => Ea(n, o, i);
  return Object.assign(r, n), r;
}, My = (e, t) => e ? li(e, t) : li;
function le(e, t) {
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
const Vn = Cn(null), Iy = Vn.Provider, ka = Se.error001("react");
function ne(e, t) {
  const n = _t(Vn);
  if (n === null)
    throw new Error(ka);
  return Ea(n, e, t);
}
function se() {
  const e = _t(Vn);
  if (e === null)
    throw new Error(ka);
  return he(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const ci = { display: "none" }, $y = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Na = "react-flow__node-desc", Sa = "react-flow__edge-desc", Ay = "react-flow__aria-live", Ty = (e) => e.ariaLiveMessage, Ly = (e) => e.ariaLabelConfig;
function Oy({ rfId: e }) {
  const t = ne(Ty);
  return E("div", { id: `${Ay}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: $y, children: t });
}
function zy({ rfId: e, disableKeyboardA11y: t }) {
  const n = ne(Ly);
  return j(ke, { children: [E("div", { id: `${Na}-${e}`, style: ci, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), E("div", { id: `${Sa}-${e}`, style: ci, children: n["edge.a11yDescription.default"] }), !t && E(Oy, { rfId: e })] });
}
const qt = Di(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return E("div", { className: fe(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
qt.displayName = "Panel";
const ui = "https://reactflow.dev?utm_source=attribution";
function Py({ proOptions: e, position: t = "bottom-right" }) {
  return oe(() => {
  }, []), e != null && e.hideAttribution ? null : E(qt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${ui}`, children: E("a", { href: ui, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Dy = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, on = (e) => e.id;
function Ry(e, t) {
  return le(e.selectedNodes.map(on), t.selectedNodes.map(on)) && le(e.selectedEdges.map(on), t.selectedEdges.map(on));
}
function Hy({ onSelectionChange: e }) {
  const t = se(), { selectedNodes: n, selectedEdges: r } = ne(Dy, Ry);
  return oe(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const Vy = (e) => !!e.onSelectionChangeHandlers;
function By({ onSelectionChange: e }) {
  const t = ne(Vy);
  return e || t ? E(Hy, { onSelectionChange: e }) : null;
}
const Ca = [0, 0], Fy = { x: 0, y: 0, zoom: 1 }, Yy = [
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
], di = [...Yy, "rfId"], Wy = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), fi = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Pt,
  nodeOrigin: Ca,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Xy(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = ne(Wy, le), c = se();
  oe(() => (l(e.defaultNodes, e.defaultEdges), () => {
    u.current = fi, a();
  }), []);
  const u = te(fi);
  return oe(
    () => {
      for (const f of di) {
        const d = e[f], h = u.current[f];
        d !== h && (typeof e[f] > "u" || (f === "nodes" ? t(d) : f === "edges" ? n(d) : f === "minZoom" ? r(d) : f === "maxZoom" ? o(d) : f === "translateExtent" ? i(d) : f === "nodeExtent" ? s(d) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: gm(d) }) : f === "fitView" ? c.setState({ fitViewQueued: d }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: d }) : c.setState({ [f]: d })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    di.map((f) => e[f])
  ), null;
}
function hi() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Gy(e) {
  var r;
  const [t, n] = ae(e === "system" ? null : e);
  return oe(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = hi(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = hi()) != null && r.matches ? "dark" : "light";
}
const pi = typeof document < "u" ? document : null;
function Bt(e = null, t = { target: pi, actInsideInputWithModifier: !0 }) {
  const [n, r] = ae(!1), o = te(!1), i = te(/* @__PURE__ */ new Set([])), [s, a] = he(() => {
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
  return oe(() => {
    const l = (t == null ? void 0 : t.target) ?? pi, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const u = (h) => {
        var x, m;
        if (o.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!o.current || o.current && !c) && na(h))
          return !1;
        const y = mi(h.code, a);
        if (i.current.add(h[y]), gi(s, i.current, !1)) {
          const v = ((m = (x = h.composedPath) == null ? void 0 : x.call(h)) == null ? void 0 : m[0]) || h.target, g = (v == null ? void 0 : v.nodeName) === "BUTTON" || (v == null ? void 0 : v.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !g) && h.preventDefault(), r(!0);
        }
      }, f = (h) => {
        const p = mi(h.code, a);
        gi(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(h[p]), h.key === "Meta" && i.current.clear(), o.current = !1;
      }, d = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", u), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", d), window.addEventListener("contextmenu", d), () => {
        l == null || l.removeEventListener("keydown", u), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", d), window.removeEventListener("contextmenu", d);
      };
    }
  }, [e, r]), n;
}
function gi(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function mi(e, t) {
  return t.includes(e) ? "code" : "key";
}
const jy = () => {
  const e = se();
  return he(() => ({
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = Dn(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      return jt(c, r, f, u);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = wt(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function Ma(e, t) {
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
      qy(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function qy(e, t) {
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
function Uy(e, t) {
  return Ma(e, t);
}
function Ky(e, t) {
  return Ma(e, t);
}
function Je(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function ut(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(Je(i.id, s)));
  }
  return r;
}
function yi({ items: e = [], lookup: t }) {
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
function wi(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Zy = Zs();
function Qy(e, t, n = {}) {
  return vm(e, t, {
    ...n,
    onError: n.onError ?? Zy
  });
}
const xi = (e) => sm(e), Jy = (e) => Gs(e);
function Ia(e) {
  return Di(e);
}
const $a = typeof window < "u" ? Ri : oe;
function bi(e) {
  const [t, n] = ae(BigInt(0)), [r] = ae(() => ew(() => n((o) => o + BigInt(1))));
  return $a(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function ew(e) {
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
const Aa = Cn(null);
function tw({ children: e }) {
  const t = se(), n = Ne((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: u, onNodesChange: f, nodeLookup: d, fitViewQueued: h, onNodesChangeMiddlewareMap: p } = t.getState();
    let y = l;
    for (const m of a)
      y = typeof m == "function" ? m(y) : m;
    let x = yi({
      items: y,
      lookup: d
    });
    for (const m of p.values())
      x = m(x);
    u && c(y), x.length > 0 ? f == null || f(x) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: m, nodes: v, setNodes: g } = t.getState();
      m && g(v);
    });
  }, []), r = bi(n), o = Ne((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: u, onEdgesChange: f, edgeLookup: d } = t.getState();
    let h = l;
    for (const p of a)
      h = typeof p == "function" ? p(h) : p;
    u ? c(h) : f && f(yi({
      items: h,
      lookup: d
    }));
  }, []), i = bi(o), s = he(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return E(Aa.Provider, { value: s, children: e });
}
function nw() {
  const e = _t(Aa);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const rw = (e) => !!e.panZoom;
function Bn() {
  const e = jy(), t = se(), n = nw(), r = ne(rw), o = he(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var m, v;
      const { nodeLookup: d, nodeOrigin: h } = t.getState(), p = xi(f) ? f : d.get(f.id), y = p.parentId ? Js(p.position, p.measured, p.parentId, d, h) : p.position, x = {
        ...p,
        position: y,
        width: ((m = p.measured) == null ? void 0 : m.width) ?? p.width,
        height: ((v = p.measured) == null ? void 0 : v.height) ?? p.height
      };
      return Ht(x);
    }, c = (f, d, h = { replace: !1 }) => {
      s((p) => p.map((y) => {
        if (y.id === f) {
          const x = typeof d == "function" ? d(y) : d;
          return h.replace && xi(x) ? x : { ...y, ...x };
        }
        return y;
      }));
    }, u = (f, d, h = { replace: !1 }) => {
      a((p) => p.map((y) => {
        if (y.id === f) {
          const x = typeof d == "function" ? d(y) : d;
          return h.replace && Jy(x) ? x : { ...y, ...x };
        }
        return y;
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
        const { nodes: f = [], edges: d = [], transform: h } = t.getState(), [p, y, x] = h;
        return {
          nodes: f.map((m) => ({ ...m })),
          edges: d.map((m) => ({ ...m })),
          viewport: {
            x: p,
            y,
            zoom: x
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: d = [] }) => {
        const { nodes: h, edges: p, onNodesDelete: y, onEdgesDelete: x, triggerNodeChanges: m, triggerEdgeChanges: v, onDelete: g, onBeforeDelete: b } = t.getState(), { nodes: N, edges: _ } = await dm({
          nodesToRemove: f,
          edgesToRemove: d,
          nodes: h,
          edges: p,
          onBeforeDelete: b
        }), M = _.length > 0, T = N.length > 0;
        if (M) {
          const A = _.map(wi);
          x == null || x(_), v(A);
        }
        if (T) {
          const A = N.map(wi);
          y == null || y(N), m(A);
        }
        return (T || M) && (g == null || g({ nodes: N, edges: _ })), { deletedNodes: N, deletedEdges: _ };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, d = !0, h) => {
        const p = qo(f), y = p ? f : l(f), x = h !== void 0;
        return y ? (h || t.getState().nodes).filter((m) => {
          const v = t.getState().nodeLookup.get(m.id);
          if (v && !p && (m.id === f.id || !v.internals.positionAbsolute))
            return !1;
          const g = Ht(x ? m : v), b = kn(g, y);
          return d && b > 0 || b >= g.width * g.height || b >= y.width * y.height;
        }) : [];
      },
      isNodeIntersecting: (f, d, h = !0) => {
        const y = qo(f) ? f : l(f);
        if (!y)
          return !1;
        const x = kn(y, d);
        return h && x > 0 || x >= d.width * d.height || x >= y.width * y.height;
      },
      updateNode: c,
      updateNodeData: (f, d, h = { replace: !1 }) => {
        c(f, (p) => {
          const y = typeof d == "function" ? d(p) : d;
          return h.replace ? { ...p, data: y } : { ...p, data: { ...p.data, ...y } };
        }, h);
      },
      updateEdge: u,
      updateEdgeData: (f, d, h = { replace: !1 }) => {
        u(f, (p) => {
          const y = typeof d == "function" ? d(p) : d;
          return h.replace ? { ...p, data: y } : { ...p, data: { ...p.data, ...y } };
        }, h);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: d, nodeOrigin: h } = t.getState();
        return am(f, { nodeLookup: d, nodeOrigin: h });
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
        const d = t.getState().fitViewResolver ?? pm();
        return t.setState({ fitViewQueued: !0, fitViewOptions: f, fitViewResolver: d }), n.nodeQueue.push((h) => [...h]), d.promise;
      }
    };
  }, []);
  return he(() => ({
    ...o,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const vi = (e) => e.selected, ow = typeof window < "u" ? window : void 0;
function iw({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = se(), { deleteElements: r } = Bn(), o = Bt(e, { actInsideInputWithModifier: !1 }), i = Bt(t, { target: ow });
  oe(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(vi), edges: s.filter(vi) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), oe(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function sw(e) {
  const t = se();
  oe(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = Xr(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", Se.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
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
const Fn = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, aw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function lw({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = nt.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: u, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: p = !0, children: y, noWheelClassName: x, noPanClassName: m, onViewportChange: v, isControlledViewport: g, paneClickDistance: b, selectionOnDrag: N }) {
  const _ = se(), M = te(null), { userSelectionActive: T, lib: A, connectionInProgress: R } = ne(aw, le), O = Bt(h), H = te();
  sw(M);
  const P = Ne((w) => {
    v == null || v({ x: w[0], y: w[1], zoom: w[2] }), g || _.setState({ transform: w });
  }, [v, g]);
  return oe(() => {
    if (M.current) {
      H.current = Zm({
        domNode: M.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: u,
        viewport: c,
        onDraggingChange: ($) => _.setState((L) => L.paneDragging === $ ? L : { paneDragging: $ }),
        onPanZoomStart: ($, L) => {
          const { onViewportChangeStart: C, onMoveStart: I } = _.getState();
          I == null || I($, L), C == null || C(L);
        },
        onPanZoom: ($, L) => {
          const { onViewportChange: C, onMove: I } = _.getState();
          I == null || I($, L), C == null || C(L);
        },
        onPanZoomEnd: ($, L) => {
          const { onViewportChangeEnd: C, onMoveEnd: I } = _.getState();
          I == null || I($, L), C == null || C(L);
        }
      });
      const { x: w, y: S, zoom: k } = H.current.getViewport();
      return _.setState({
        panZoom: H.current,
        transform: [w, S, k],
        domNode: M.current.closest(".react-flow")
      }), () => {
        var $;
        ($ = H.current) == null || $.destroy();
      };
    }
  }, []), oe(() => {
    var w;
    (w = H.current) == null || w.update({
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
      preventScrolling: p,
      noPanClassName: m,
      userSelectionActive: T,
      noWheelClassName: x,
      lib: A,
      onTransformChange: P,
      connectionInProgress: R,
      selectionOnDrag: N,
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
    O,
    p,
    m,
    T,
    x,
    A,
    P,
    R,
    N,
    b
  ]), E("div", { className: "react-flow__renderer", ref: M, style: Fn, children: y });
}
const cw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function uw() {
  const { userSelectionActive: e, userSelectionRect: t } = ne(cw, le);
  return e && t ? E("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const ar = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, dw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function fw({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Dt.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: u, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: p, children: y }) {
  const x = te(0), m = se(), { userSelectionActive: v, elementsSelectable: g, dragging: b, panBy: N, autoPanSpeed: _ } = ne(dw, le), M = g && (e || v), T = te(null), A = te(), R = te(/* @__PURE__ */ new Set()), O = te(/* @__PURE__ */ new Set()), H = te(!1), P = te(!1), w = te({ x: 0, y: 0 }), S = te(!1), k = (D) => {
    if (P.current || H.current || m.getState().connection.inProgress) {
      P.current = !1, H.current = !1;
      return;
    }
    c == null || c(D), m.getState().resetSelectedElements(), m.setState({ nodesSelectionActive: !1 });
  }, $ = (D) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      D.preventDefault();
      return;
    }
    u == null || u(D);
  }, L = f ? (D) => f(D) : void 0, C = (D) => {
    P.current && (D.stopPropagation(), P.current = !1);
  }, I = (D) => {
    var ie, ye;
    if (D.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: B, transform: U } = m.getState();
    if (A.current = B == null ? void 0 : B.getBoundingClientRect(), !A.current)
      return;
    const K = D.target === T.current;
    if (!K && !!D.target.closest(".nokey") || !e || !(s && K || t) || D.button !== 0 || !D.isPrimary)
      return;
    (ye = (ie = D.target) == null ? void 0 : ie.setPointerCapture) == null || ye.call(ie, D.pointerId), P.current = !1;
    const { x: Q, y: ee } = Ee(D.nativeEvent, A.current), re = jt({ x: Q, y: ee }, U);
    m.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: re.x,
        startY: re.y,
        x: Q,
        y: ee
      }
    }), K || (D.stopPropagation(), D.preventDefault());
  };
  function z(D, B) {
    const { userSelectionRect: U } = m.getState();
    if (!U)
      return;
    const { transform: K, nodeLookup: X, edgeLookup: Z, connectionLookup: Q, triggerNodeChanges: ee, triggerEdgeChanges: re, defaultEdgeOptions: ie } = m.getState(), ye = { x: U.startX, y: U.startY }, { x: $e, y: Ae } = wt(ye, K), Pe = {
      startX: ye.x,
      startY: ye.y,
      x: D < $e ? D : $e,
      y: B < Ae ? B : Ae,
      width: Math.abs(D - $e),
      height: Math.abs(B - Ae)
    }, Et = R.current, Ue = O.current;
    R.current = new Set(Yr(X, Pe, K, n === Dt.Partial, !0).map((xe) => xe.id)), O.current = /* @__PURE__ */ new Set();
    const Ke = (ie == null ? void 0 : ie.selectable) ?? !0;
    for (const xe of R.current) {
      const De = Q.get(xe);
      if (De)
        for (const { edgeId: Re } of De.values()) {
          const Ze = Z.get(Re);
          Ze && (Ze.selectable ?? Ke) && O.current.add(Re);
        }
    }
    if (!Uo(Et, R.current)) {
      const xe = ut(X, R.current, !0);
      ee(xe);
    }
    if (!Uo(Ue, O.current)) {
      const xe = ut(Z, O.current);
      re(xe);
    }
    m.setState({
      userSelectionRect: Pe,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function V() {
    if (!o || !A.current)
      return;
    const [D, B] = Wr(w.current, A.current, _);
    N({ x: D, y: B }).then((U) => {
      if (!P.current || !U) {
        x.current = requestAnimationFrame(V);
        return;
      }
      const { x: K, y: X } = w.current;
      z(K, X), x.current = requestAnimationFrame(V);
    });
  }
  const Y = () => {
    cancelAnimationFrame(x.current), x.current = 0, S.current = !1;
  };
  oe(() => () => Y(), []);
  const F = (D) => {
    const { userSelectionRect: B, transform: U, resetSelectedElements: K } = m.getState();
    if (!A.current || !B)
      return;
    const { x: X, y: Z } = Ee(D.nativeEvent, A.current);
    w.current = { x: X, y: Z };
    const Q = wt({ x: B.startX, y: B.startY }, U);
    if (!P.current) {
      const ee = t ? 0 : i;
      if (Math.hypot(X - Q.x, Z - Q.y) <= ee)
        return;
      K(), a == null || a(D);
    }
    P.current = !0, S.current || (V(), S.current = !0), z(X, Z);
  }, q = (D) => {
    var B, U;
    if (!M) {
      D.target === T.current && m.getState().connection.inProgress && (H.current = !0);
      return;
    }
    D.button === 0 && ((U = (B = D.target) == null ? void 0 : B.releasePointerCapture) == null || U.call(B, D.pointerId), !v && D.target === T.current && m.getState().userSelectionRect && (k == null || k(D)), m.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), P.current && (l == null || l(D), m.setState({
      nodesSelectionActive: R.current.size > 0
    })), Y());
  }, J = (D) => {
    var B, U;
    (U = (B = D.target) == null ? void 0 : B.releasePointerCapture) == null || U.call(B, D.pointerId), Y();
  }, G = r === !0 || Array.isArray(r) && r.includes(0);
  return j("div", { className: fe(["react-flow__pane", { draggable: G, dragging: b, selection: e }]), onClick: M ? void 0 : ar(k, T), onContextMenu: ar($, T), onWheel: ar(L, T), onPointerEnter: M ? void 0 : d, onPointerMove: M ? F : h, onPointerUp: q, onPointerCancel: M ? J : void 0, onPointerDownCapture: M ? I : void 0, onClickCapture: M ? C : void 0, onPointerLeave: p, ref: T, style: Fn, children: [y, E(uw, {})] });
}
function Sr({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", Se.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var u;
    return (u = r == null ? void 0 : r.current) == null ? void 0 : u.blur();
  })) : o([e]);
}
function Ta({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = se(), [l, c] = ae(!1), u = te();
  return oe(() => {
    if (!t)
      return u.current = Dm({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          Sr({
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
  }, [t, a, e]), oe(() => {
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
const hw = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function La() {
  const e = se();
  return Ne((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: u } = e.getState(), f = /* @__PURE__ */ new Map(), d = hw(s), h = o ? i[0] : 5, p = o ? i[1] : 5, y = n.direction.x * h * n.factor, x = n.direction.y * p * n.factor;
    for (const [, m] of c) {
      if (!d(m))
        continue;
      let v = {
        x: m.internals.positionAbsolute.x + y,
        y: m.internals.positionAbsolute.y + x
      };
      o && (v = Gt(v, i));
      const { position: g, positionAbsolute: b } = js({
        nodeId: m.id,
        nextPosition: v,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: u,
        onError: a
      });
      m.position = g, m.internals.positionAbsolute = b, f.set(m.id, m);
    }
    l(f);
  }, []);
}
const Zr = Cn(null), pw = Zr.Provider;
Zr.Consumer;
const Oa = () => _t(Zr), gw = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), za = Cn(null);
function mw({ children: e }) {
  const t = ne(gw, le);
  return E(za.Provider, { value: t, children: e });
}
function yw() {
  const e = _t(za);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const ww = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, xw = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return ww;
  const u = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: u,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === mt.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: u && c
  };
};
function bw({ type: e = "source", position: t = W.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: u, onTouchStart: f, ...d }, h) {
  var S, k;
  const p = s || null, y = e === "target", x = se(), m = Oa(), { connectOnClick: v, noPanClassName: g, rfId: b } = yw(), { connectingFrom: N, connectingTo: _, clickConnecting: M, isPossibleEndHandle: T, connectionInProcess: A, clickConnectionInProcess: R, valid: O } = ne(xw(m, p, e), le);
  m || (k = (S = x.getState()).onError) == null || k.call(S, "010", Se.error010());
  const H = ($) => {
    const { defaultEdgeOptions: L, onConnect: C, hasDefaultEdges: I } = x.getState(), z = {
      ...L,
      ...$
    };
    if (I) {
      const { edges: V, setEdges: Y, onError: F } = x.getState();
      Y(Qy(z, V, { onError: F }));
    }
    C == null || C(z), a == null || a(z);
  }, P = ($) => {
    if (!m)
      return;
    const L = ra($.nativeEvent);
    if (o && (L && $.button === 0 || !L)) {
      const C = x.getState();
      Nr.onPointerDown($.nativeEvent, {
        handleDomNode: $.currentTarget,
        autoPanOnConnect: C.autoPanOnConnect,
        connectionMode: C.connectionMode,
        connectionRadius: C.connectionRadius,
        domNode: C.domNode,
        nodeLookup: C.nodeLookup,
        lib: C.lib,
        isTarget: y,
        handleId: p,
        nodeId: m,
        flowId: C.rfId,
        panBy: C.panBy,
        cancelConnection: C.cancelConnection,
        onConnectStart: C.onConnectStart,
        onConnectEnd: (...I) => {
          var z, V;
          return (V = (z = x.getState()).onConnectEnd) == null ? void 0 : V.call(z, ...I);
        },
        updateConnection: C.updateConnection,
        onConnect: H,
        isValidConnection: n || ((...I) => {
          var z, V;
          return ((V = (z = x.getState()).isValidConnection) == null ? void 0 : V.call(z, ...I)) ?? !0;
        }),
        getTransform: () => x.getState().transform,
        getFromHandle: () => x.getState().connection.fromHandle,
        autoPanSpeed: C.autoPanSpeed,
        dragThreshold: C.connectionDragThreshold
      });
    }
    L ? u == null || u($) : f == null || f($);
  }, w = ($) => {
    const { onClickConnectStart: L, onClickConnectEnd: C, connectionClickStartHandle: I, connectionMode: z, isValidConnection: V, lib: Y, rfId: F, nodeLookup: q, connection: J } = x.getState();
    if (!m || !I && !o)
      return;
    if (!I) {
      L == null || L($.nativeEvent, { nodeId: m, handleId: p, handleType: e }), x.setState({ connectionClickStartHandle: { nodeId: m, type: e, id: p } });
      return;
    }
    const G = ta($.target), D = n || V, { connection: B, isValid: U } = Nr.isValid($.nativeEvent, {
      handle: {
        nodeId: m,
        id: p,
        type: e
      },
      connectionMode: z,
      fromNodeId: I.nodeId,
      fromHandleId: I.id || null,
      fromType: I.type,
      isValidConnection: D,
      flowId: F,
      doc: G,
      lib: Y,
      nodeLookup: q
    });
    U && B && H(B);
    const K = structuredClone(J);
    delete K.inProgress, K.toPosition = K.toHandle ? K.toHandle.position : null, C == null || C($, K), x.setState({ connectionClickStartHandle: null });
  };
  return E("div", { "data-handleid": p, "data-nodeid": m, "data-handlepos": t, "data-id": `${b}-${m}-${p}-${e}`, className: fe([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    g,
    c,
    {
      source: !y,
      target: y,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: M,
      connectingfrom: N,
      connectingto: _,
      valid: O,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!A || T) && (A || R ? i : o)
    }
  ]), onMouseDown: P, onTouchStart: P, onClick: v ? w : void 0, ref: h, ...d, children: l });
}
const vt = ce(Ia(bw));
function vw({ data: e, isConnectable: t, sourcePosition: n = W.Bottom }) {
  return j(ke, { children: [e == null ? void 0 : e.label, E(vt, { type: "source", position: n, isConnectable: t })] });
}
function _w({ data: e, isConnectable: t, targetPosition: n = W.Top, sourcePosition: r = W.Bottom }) {
  return j(ke, { children: [E(vt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, E(vt, { type: "source", position: r, isConnectable: t })] });
}
function Ew() {
  return null;
}
function kw({ data: e, isConnectable: t, targetPosition: n = W.Top }) {
  return j(ke, { children: [E(vt, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Nn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, _i = {
  input: vw,
  default: _w,
  output: kw,
  group: Ew
};
function Nw(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const Sw = (e) => {
  const { width: t, height: n, x: r, y: o } = Xt(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: _e(t) ? t : null,
    height: _e(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function Cw({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = se(), { width: o, height: i, transformString: s, userSelectionActive: a } = ne(Sw, le), l = La(), c = te(null);
  oe(() => {
    var h;
    n || (h = c.current) == null || h.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && o !== null && i !== null;
  if (Ta({
    nodeRef: c,
    disabled: !u
  }), !u)
    return null;
  const f = e ? (h) => {
    const p = r.getState().nodes.filter((y) => y.selected);
    e(h, p);
  } : void 0, d = (h) => {
    Object.prototype.hasOwnProperty.call(Nn, h.key) && (h.preventDefault(), l({
      direction: Nn[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return E("div", { className: fe(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: E("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : d, style: {
    width: o,
    height: i
  } }) });
}
const Ei = typeof window < "u" ? window : void 0, Mw = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Pa({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: u, selectionMode: f, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: p, panActivationKeyCode: y, zoomActivationKeyCode: x, elementsSelectable: m, zoomOnScroll: v, zoomOnPinch: g, panOnScroll: b, panOnScrollSpeed: N, panOnScrollMode: _, zoomOnDoubleClick: M, panOnDrag: T, autoPanOnSelection: A, defaultViewport: R, translateExtent: O, minZoom: H, maxZoom: P, preventScrolling: w, onSelectionContextMenu: S, noWheelClassName: k, noPanClassName: $, disableKeyboardA11y: L, onViewportChange: C, isControlledViewport: I }) {
  const { nodesSelectionActive: z, userSelectionActive: V } = ne(Mw, le), Y = Bt(c, { target: Ei }), F = Bt(y, { target: Ei }), q = F || T, J = F || b, G = u && q !== !0, D = Y || V || G;
  return iw({ deleteKeyCode: l, multiSelectionKeyCode: p }), E(lw, { onPaneContextMenu: i, elementsSelectable: m, zoomOnScroll: v, zoomOnPinch: g, panOnScroll: J, panActivationKeyPressed: F, panOnScrollSpeed: N, panOnScrollMode: _, zoomOnDoubleClick: M, panOnDrag: !Y && q, defaultViewport: R, translateExtent: O, minZoom: H, maxZoom: P, zoomActivationKeyCode: x, preventScrolling: w, noWheelClassName: k, noPanClassName: $, onViewportChange: C, isControlledViewport: I, paneClickDistance: a, selectionOnDrag: G, children: j(fw, { onSelectionStart: d, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: q, autoPanOnSelection: A, isSelecting: !!D, selectionMode: f, selectionKeyPressed: Y, paneClickDistance: a, selectionOnDrag: G, children: [e, z && E(Cw, { onSelectionContextMenu: S, noPanClassName: $, disableKeyboardA11y: L })] }) });
}
Pa.displayName = "FlowRenderer";
const Iw = ce(Pa), $w = (e) => (t) => e ? Yr(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Aw(e) {
  return ne(Ne($w(e), [e]), le);
}
const Tw = (e) => e.updateNodeInternals;
function Lw() {
  const e = ne(Tw), [t] = ae(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
  return oe(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function Ow({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = se(), i = te(null), s = te(null), a = te(e.sourcePosition), l = te(e.targetPosition), c = te(t), u = n && !!e.internals.handleBounds;
  return oe(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), oe(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), oe(() => {
    if (i.current) {
      const f = c.current !== t, d = a.current !== e.sourcePosition, h = l.current !== e.targetPosition;
      (f || d || h) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function zw({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: u, resizeObserver: f, noDragClassName: d, noPanClassName: h, disableKeyboardA11y: p, rfId: y, nodeTypes: x, nodeClickDistance: m, onError: v }) {
  const { node: g, internals: b, isParent: N } = ne((D) => {
    const B = D.nodeLookup.get(e), U = D.parentLookup.has(e);
    return {
      node: B,
      internals: B.internals,
      isParent: U
    };
  }, le);
  let _ = g.type || "default", M = (x == null ? void 0 : x[_]) || _i[_];
  M === void 0 && (v == null || v("003", Se.error003(_)), _ = "default", M = (x == null ? void 0 : x.default) || _i.default);
  const T = !!(g.draggable || a && typeof g.draggable > "u"), A = !!(g.selectable || l && typeof g.selectable > "u"), R = !!(g.connectable || c && typeof g.connectable > "u"), O = !!(g.focusable || u && typeof g.focusable > "u"), H = se(), P = Qs(g), w = Ow({ node: g, nodeType: _, hasDimensions: P, resizeObserver: f }), S = Ta({
    nodeRef: w,
    disabled: g.hidden || !T,
    noDragClassName: d,
    handleSelector: g.dragHandle,
    nodeId: e,
    isSelectable: A,
    nodeClickDistance: m
  }), k = La();
  if (g.hidden)
    return null;
  const $ = Ie(g), L = Nw(g), C = A || T || t || n || r || o, I = n ? (D) => n(D, { ...b.userNode }) : void 0, z = r ? (D) => r(D, { ...b.userNode }) : void 0, V = o ? (D) => o(D, { ...b.userNode }) : void 0, Y = i ? (D) => i(D, { ...b.userNode }) : void 0, F = s ? (D) => s(D, { ...b.userNode }) : void 0, q = (D) => {
    const { selectNodesOnDrag: B, nodeDragThreshold: U } = H.getState();
    A && (!B || !T || U > 0) && Sr({
      id: e,
      store: H,
      nodeRef: w
    }), t && t(D, { ...b.userNode });
  }, J = (D) => {
    if (!(na(D.nativeEvent) || p)) {
      if (Ys.includes(D.key) && A) {
        const B = D.key === "Escape";
        Sr({
          id: e,
          store: H,
          unselect: B,
          nodeRef: w
        });
      } else if (T && g.selected && Object.prototype.hasOwnProperty.call(Nn, D.key)) {
        D.preventDefault();
        const { ariaLabelConfig: B } = H.getState();
        H.setState({
          ariaLiveMessage: B["node.a11yDescription.ariaLiveMessage"]({
            direction: D.key.replace("Arrow", "").toLowerCase(),
            x: ~~b.positionAbsolute.x,
            y: ~~b.positionAbsolute.y
          })
        }), k({
          direction: Nn[D.key],
          factor: D.shiftKey ? 4 : 1
        });
      }
    }
  }, G = () => {
    var Q;
    if (p || !((Q = w.current) != null && Q.matches(":focus-visible")))
      return;
    const { transform: D, width: B, height: U, autoPanOnNodeFocus: K, setCenter: X } = H.getState();
    if (!K)
      return;
    Yr(/* @__PURE__ */ new Map([[e, g]]), { x: 0, y: 0, width: B, height: U }, D, !0).length > 0 || X(g.position.x + $.width / 2, g.position.y + $.height / 2, {
      zoom: D[2]
    });
  };
  return E("div", { className: fe([
    "react-flow__node",
    `react-flow__node-${_}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: T
    },
    g.className,
    {
      selected: g.selected,
      selectable: A,
      parent: N,
      draggable: T,
      dragging: S
    }
  ]), ref: w, style: {
    zIndex: b.z,
    transform: `translate(${b.positionAbsolute.x}px,${b.positionAbsolute.y}px)`,
    pointerEvents: C ? "all" : "none",
    visibility: P ? "visible" : "hidden",
    ...g.style,
    ...L
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: I, onMouseMove: z, onMouseLeave: V, onContextMenu: Y, onClick: q, onDoubleClick: F, onKeyDown: O ? J : void 0, tabIndex: O ? 0 : void 0, onFocus: O ? G : void 0, role: g.ariaRole ?? (O ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": p ? void 0 : `${Na}-${y}`, "aria-label": g.ariaLabel, ...g.domAttributes, children: E(pw, { value: e, children: E(M, { id: e, data: g.data, type: _, positionAbsoluteX: b.positionAbsolute.x, positionAbsoluteY: b.positionAbsolute.y, selected: g.selected ?? !1, selectable: A, draggable: T, deletable: g.deletable ?? !0, isConnectable: R, sourcePosition: g.sourcePosition, targetPosition: g.targetPosition, dragging: S, dragHandle: g.dragHandle, zIndex: b.z, parentId: g.parentId, ...$ }) }) });
}
var Pw = ce(zw);
const Dw = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function Da(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = ne(Dw, le), i = Aw(e.onlyRenderVisibleElements), s = Lw();
  return E("div", { className: "react-flow__nodes", style: Fn, children: i.map((a) => (
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
    E(Pw, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
Da.displayName = "NodeRenderer";
const Rw = ce(Da);
function Hw(e) {
  return ne(Ne((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && wm({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(o.id);
      }
    return r;
  }, [e]), le);
}
const Vw = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return E("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Bw = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return E("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, ki = {
  [Rt.Arrow]: Vw,
  [Rt.ArrowClosed]: Bw
};
function Fw(e) {
  const t = se();
  return he(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(ki, e) ? ki[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Se.error009(e)), null);
  }, [e]);
}
const Yw = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = Fw(t);
  return l ? E("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: E(l, { color: n, strokeWidth: s }) }) : null;
}, Ra = ({ defaultColor: e, rfId: t }) => {
  const n = ne((i) => i.edges), r = ne((i) => i.defaultEdgeOptions), o = he(() => Sm(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? E("svg", { className: "react-flow__marker", "aria-hidden": "true", children: E("defs", { children: o.map((i) => E(Yw, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
Ra.displayName = "MarkerDefinitions";
var Ww = ce(Ra);
function Ha({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...u }) {
  const [f, d] = ae({ x: 1, y: 0, width: 0, height: 0 }), h = fe(["react-flow__edge-textwrapper", c]), p = te(null);
  return oe(() => {
    if (p.current) {
      const y = p.current.getBBox();
      d({
        x: y.x,
        y: y.y,
        width: y.width,
        height: y.height
      });
    }
  }, [n]), n ? j("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...u, children: [o && E("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), E("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: p, style: r, children: n }), l] }) : null;
}
Ha.displayName = "EdgeText";
const Xw = ce(Ha);
function Yn({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...u }) {
  return j(ke, { children: [E("path", { ...u, d: e, fill: "none", className: fe(["react-flow__edge-path", u.className]) }), c ? E("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && _e(t) && _e(n) ? E(Xw, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Ni({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === W.Left || e === W.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function Va({ sourceX: e, sourceY: t, sourcePosition: n = W.Bottom, targetX: r, targetY: o, targetPosition: i = W.Top }) {
  const [s, a] = Ni({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = Ni({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [u, f, d, h] = oa({
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
function Ba(e) {
  return ce(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: y, markerStart: x, interactionWidth: m }) => {
    const [v, g, b] = Va({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), N = e.isInternal ? void 0 : t;
    return E(Yn, { id: N, path: v, labelX: g, labelY: b, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: y, markerStart: x, interactionWidth: m });
  });
}
const Gw = Ba({ isInternal: !1 }), Fa = Ba({ isInternal: !0 });
Gw.displayName = "SimpleBezierEdge";
Fa.displayName = "SimpleBezierEdgeInternal";
function Ya(e) {
  return ce(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, sourcePosition: h = W.Bottom, targetPosition: p = W.Top, markerEnd: y, markerStart: x, pathOptions: m, interactionWidth: v }) => {
    const [g, b, N] = _r({
      sourceX: n,
      sourceY: r,
      sourcePosition: h,
      targetX: o,
      targetY: i,
      targetPosition: p,
      borderRadius: m == null ? void 0 : m.borderRadius,
      offset: m == null ? void 0 : m.offset,
      stepPosition: m == null ? void 0 : m.stepPosition
    }), _ = e.isInternal ? void 0 : t;
    return E(Yn, { id: _, path: g, labelX: b, labelY: N, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: y, markerStart: x, interactionWidth: v });
  });
}
const Wa = Ya({ isInternal: !1 }), Xa = Ya({ isInternal: !0 });
Wa.displayName = "SmoothStepEdge";
Xa.displayName = "SmoothStepEdgeInternal";
function Ga(e) {
  return ce(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return E(Wa, { ...n, id: r, pathOptions: he(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const jw = Ga({ isInternal: !1 }), ja = Ga({ isInternal: !0 });
jw.displayName = "StepEdge";
ja.displayName = "StepEdgeInternal";
function qa(e) {
  return ce(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: p, interactionWidth: y }) => {
    const [x, m, v] = aa({ sourceX: n, sourceY: r, targetX: o, targetY: i }), g = e.isInternal ? void 0 : t;
    return E(Yn, { id: g, path: x, labelX: m, labelY: v, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: p, interactionWidth: y });
  });
}
const qw = qa({ isInternal: !1 }), Ua = qa({ isInternal: !0 });
qw.displayName = "StraightEdge";
Ua.displayName = "StraightEdgeInternal";
function Ka(e) {
  return ce(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = W.Bottom, targetPosition: a = W.Top, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: y, markerStart: x, pathOptions: m, interactionWidth: v }) => {
    const [g, b, N] = ia({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: m == null ? void 0 : m.curvature
    }), _ = e.isInternal ? void 0 : t;
    return E(Yn, { id: _, path: g, labelX: b, labelY: N, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: y, markerStart: x, interactionWidth: v });
  });
}
const Uw = Ka({ isInternal: !1 }), Za = Ka({ isInternal: !0 });
Uw.displayName = "BezierEdge";
Za.displayName = "BezierEdgeInternal";
const Si = {
  default: Za,
  straight: Ua,
  step: ja,
  smoothstep: Xa,
  simplebezier: Fa
}, Ci = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Kw = (e, t, n) => n === W.Left ? e - t : n === W.Right ? e + t : e, Zw = (e, t, n) => n === W.Top ? e - t : n === W.Bottom ? e + t : e, Mi = "react-flow__edgeupdater";
function Ii({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return E("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: fe([Mi, `${Mi}-${a}`]), cx: Kw(t, r, e), cy: Zw(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function Qw({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: u, onReconnectEnd: f, setReconnecting: d, setUpdateHover: h }) {
  const p = se(), y = (b, N) => {
    if (b.button !== 0)
      return;
    const { autoPanOnConnect: _, domNode: M, connectionMode: T, connectionRadius: A, lib: R, onConnectStart: O, cancelConnection: H, nodeLookup: P, rfId: w, panBy: S, updateConnection: k } = p.getState(), $ = N.type === "target", L = (z, V) => {
      d(!1), f == null || f(z, n, N.type, V);
    }, C = (z) => c == null ? void 0 : c(n, z), I = (z, V) => {
      d(!0), u == null || u(b, n, N.type), O == null || O(z, V);
    };
    Nr.onPointerDown(b.nativeEvent, {
      autoPanOnConnect: _,
      connectionMode: T,
      connectionRadius: A,
      domNode: M,
      handleId: N.id,
      nodeId: N.nodeId,
      nodeLookup: P,
      isTarget: $,
      edgeUpdaterType: N.type,
      lib: R,
      flowId: w,
      cancelConnection: H,
      panBy: S,
      isValidConnection: (...z) => {
        var V, Y;
        return ((Y = (V = p.getState()).isValidConnection) == null ? void 0 : Y.call(V, ...z)) ?? !0;
      },
      onConnect: C,
      onConnectStart: I,
      onConnectEnd: (...z) => {
        var V, Y;
        return (Y = (V = p.getState()).onConnectEnd) == null ? void 0 : Y.call(V, ...z);
      },
      onReconnectEnd: L,
      updateConnection: k,
      getTransform: () => p.getState().transform,
      getFromHandle: () => p.getState().connection.fromHandle,
      dragThreshold: p.getState().connectionDragThreshold,
      handleDomNode: b.currentTarget
    });
  }, x = (b) => y(b, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), m = (b) => y(b, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), v = () => h(!0), g = () => h(!1);
  return j(ke, { children: [(e === !0 || e === "source") && E(Ii, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: x, onMouseEnter: v, onMouseOut: g, type: "source" }), (e === !0 || e === "target") && E(Ii, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: m, onMouseEnter: v, onMouseOut: g, type: "target" })] });
}
function Jw({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, rfId: p, edgeTypes: y, noPanClassName: x, onError: m, disableKeyboardA11y: v }) {
  let g = ne((X) => X.edgeLookup.get(e));
  const b = ne((X) => X.defaultEdgeOptions);
  g = b ? { ...b, ...g } : g;
  let N = g.type || "default", _ = (y == null ? void 0 : y[N]) || Si[N];
  _ === void 0 && (m == null || m("011", Se.error011(N)), N = "default", _ = (y == null ? void 0 : y.default) || Si.default);
  const M = !!(g.focusable || t && typeof g.focusable > "u"), T = typeof f < "u" && (g.reconnectable || n && typeof g.reconnectable > "u"), A = !!(g.selectable || r && typeof g.selectable > "u"), R = te(null), [O, H] = ae(!1), [P, w] = ae(!1), S = se(), { zIndex: k = g.zIndex, sourceX: $, sourceY: L, targetX: C, targetY: I, sourcePosition: z, targetPosition: V } = ne(Ne((X) => {
    const Z = X.nodeLookup.get(g.source), Q = X.nodeLookup.get(g.target);
    if (!Z || !Q)
      return Ci;
    const ee = Nm({
      id: e,
      sourceNode: Z,
      targetNode: Q,
      sourceHandle: g.sourceHandle || null,
      targetHandle: g.targetHandle || null,
      connectionMode: X.connectionMode,
      onError: m
    }), re = ym({
      selected: g.selected,
      zIndex: g.zIndex,
      sourceNode: Z,
      targetNode: Q,
      elevateOnSelect: X.elevateEdgesOnSelect,
      zIndexMode: X.zIndexMode
    });
    return {
      ...ee || Ci,
      zIndex: re
    };
  }, [g.source, g.target, g.sourceHandle, g.targetHandle, g.selected, g.zIndex, m]), le), Y = he(() => g.markerStart ? `url('#${Er(g.markerStart, p)}')` : void 0, [g.markerStart, p]), F = he(() => g.markerEnd ? `url('#${Er(g.markerEnd, p)}')` : void 0, [g.markerEnd, p]);
  if (g.hidden || $ === null || L === null || C === null || I === null)
    return null;
  const q = (X) => {
    var re;
    const { addSelectedEdges: Z, unselectNodesAndEdges: Q, multiSelectionActive: ee } = S.getState();
    A && (S.setState({ nodesSelectionActive: !1 }), g.selected && ee ? (Q({ nodes: [], edges: [g] }), (re = R.current) == null || re.blur()) : Z([e])), o && o(X, g);
  }, J = i ? (X) => {
    i(X, { ...g });
  } : void 0, G = s ? (X) => {
    s(X, { ...g });
  } : void 0, D = a ? (X) => {
    a(X, { ...g });
  } : void 0, B = l ? (X) => {
    l(X, { ...g });
  } : void 0, U = c ? (X) => {
    c(X, { ...g });
  } : void 0, K = (X) => {
    var Z;
    if (!v && Ys.includes(X.key) && A) {
      const { unselectNodesAndEdges: Q, addSelectedEdges: ee } = S.getState();
      X.key === "Escape" ? ((Z = R.current) == null || Z.blur(), Q({ edges: [g] })) : ee([e]);
    }
  };
  return E("svg", { style: { zIndex: k }, children: j("g", { className: fe([
    "react-flow__edge",
    `react-flow__edge-${N}`,
    g.className,
    x,
    {
      selected: g.selected,
      animated: g.animated,
      inactive: !A && !o,
      updating: O,
      selectable: A
    }
  ]), onClick: q, onDoubleClick: J, onContextMenu: G, onMouseEnter: D, onMouseMove: B, onMouseLeave: U, onKeyDown: M ? K : void 0, tabIndex: M ? 0 : void 0, role: g.ariaRole ?? (M ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": g.ariaLabel === null ? void 0 : g.ariaLabel || `Edge from ${g.source} to ${g.target}`, "aria-describedby": M ? `${Sa}-${p}` : void 0, ref: R, ...g.domAttributes, children: [!P && E(_, { id: e, source: g.source, target: g.target, type: g.type, selected: g.selected, animated: g.animated, selectable: A, deletable: g.deletable ?? !0, label: g.label, labelStyle: g.labelStyle, labelShowBg: g.labelShowBg, labelBgStyle: g.labelBgStyle, labelBgPadding: g.labelBgPadding, labelBgBorderRadius: g.labelBgBorderRadius, sourceX: $, sourceY: L, targetX: C, targetY: I, sourcePosition: z, targetPosition: V, data: g.data, style: g.style, sourceHandleId: g.sourceHandle, targetHandleId: g.targetHandle, markerStart: Y, markerEnd: F, pathOptions: "pathOptions" in g ? g.pathOptions : void 0, interactionWidth: g.interactionWidth }), T && E(Qw, { edge: g, isReconnectable: T, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, sourceX: $, sourceY: L, targetX: C, targetY: I, sourcePosition: z, targetPosition: V, setUpdateHover: H, setReconnecting: w })] }) });
}
var ex = ce(Jw);
const tx = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Qa({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: u, reconnectRadius: f, onEdgeDoubleClick: d, onReconnectStart: h, onReconnectEnd: p, disableKeyboardA11y: y }) {
  const { edgesFocusable: x, edgesReconnectable: m, elementsSelectable: v, onError: g } = ne(tx, le), b = Hw(t);
  return j("div", { className: "react-flow__edges", children: [E(Ww, { defaultColor: e, rfId: n }), b.map((N) => E(ex, { id: N, edgesFocusable: x, edgesReconnectable: m, elementsSelectable: v, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: u, reconnectRadius: f, onDoubleClick: d, onReconnectStart: h, onReconnectEnd: p, rfId: n, onError: g, edgeTypes: r, disableKeyboardA11y: y }, N))] });
}
Qa.displayName = "EdgeRenderer";
const nx = ce(Qa), $i = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function rx({ children: e }) {
  const t = se(), n = te(null), [r] = ae(() => t.getState().transform);
  return $a(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = $i(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), E("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: $i(r) }, children: e });
}
function ox(e) {
  const t = Bn(), n = te(!1);
  oe(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const ix = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function sx(e) {
  const t = ne(ix), n = se();
  return oe(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function ax(e) {
  return e.connection.inProgress ? { ...e.connection, to: jt(e.connection.to, e.transform) } : { ...e.connection };
}
function lx(e) {
  return ax;
}
function cx(e) {
  const t = lx();
  return ne(t, le);
}
const ux = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function dx({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = ne(ux, le);
  return !(i && o && l) ? null : E("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: E("g", { className: fe(["react-flow__connection", ea(a)]), children: E(Ja, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const Ja = ({ style: e, type: t = Ge.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: u, toHandle: f, toPosition: d, pointer: h } = cx();
  if (!o)
    return;
  if (n)
    return E(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: d, connectionStatus: ea(r), toNode: u, toHandle: f, pointer: h });
  let p = "";
  const y = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: d
  };
  switch (t) {
    case Ge.Bezier:
      [p] = ia(y);
      break;
    case Ge.SimpleBezier:
      [p] = Va(y);
      break;
    case Ge.Step:
      [p] = _r({
        ...y,
        borderRadius: 0
      });
      break;
    case Ge.SmoothStep:
      [p] = _r(y);
      break;
    default:
      [p] = aa(y);
  }
  return E("path", { d: p, fill: "none", className: "react-flow__connection-path", style: e });
};
Ja.displayName = "ConnectionLine";
const fx = {};
function Ai(e = fx) {
  te(e), se(), oe(() => {
  }, [e]);
}
function hx() {
  se(), te(!1), oe(() => {
  }, []);
}
function el({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, onSelectionContextMenu: f, onSelectionStart: d, onSelectionEnd: h, connectionLineType: p, connectionLineStyle: y, connectionLineComponent: x, connectionLineContainerStyle: m, selectionKeyCode: v, selectionOnDrag: g, selectionMode: b, multiSelectionKeyCode: N, panActivationKeyCode: _, zoomActivationKeyCode: M, deleteKeyCode: T, onlyRenderVisibleElements: A, elementsSelectable: R, defaultViewport: O, translateExtent: H, minZoom: P, maxZoom: w, preventScrolling: S, defaultMarkerColor: k, zoomOnScroll: $, zoomOnPinch: L, panOnScroll: C, panOnScrollSpeed: I, panOnScrollMode: z, zoomOnDoubleClick: V, panOnDrag: Y, autoPanOnSelection: F, onPaneClick: q, onPaneMouseEnter: J, onPaneMouseMove: G, onPaneMouseLeave: D, onPaneScroll: B, onPaneContextMenu: U, paneClickDistance: K, nodeClickDistance: X, onEdgeContextMenu: Z, onEdgeMouseEnter: Q, onEdgeMouseMove: ee, onEdgeMouseLeave: re, reconnectRadius: ie, onReconnect: ye, onReconnectStart: $e, onReconnectEnd: Ae, noDragClassName: Pe, noWheelClassName: Et, noPanClassName: Ue, disableKeyboardA11y: Ke, nodeExtent: xe, rfId: De, viewport: Re, onViewportChange: Ze, nodesDraggable: Wn }) {
  return Ai(e), Ai(t), hx(), ox(n), sx(Re), E(Iw, { onPaneClick: q, onPaneMouseEnter: J, onPaneMouseMove: G, onPaneMouseLeave: D, onPaneContextMenu: U, onPaneScroll: B, paneClickDistance: K, deleteKeyCode: T, selectionKeyCode: v, selectionOnDrag: g, selectionMode: b, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: N, panActivationKeyCode: _, zoomActivationKeyCode: M, elementsSelectable: R, zoomOnScroll: $, zoomOnPinch: L, zoomOnDoubleClick: V, panOnScroll: C, panOnScrollSpeed: I, panOnScrollMode: z, panOnDrag: Y, autoPanOnSelection: F, defaultViewport: O, translateExtent: H, minZoom: P, maxZoom: w, onSelectionContextMenu: f, preventScrolling: S, noDragClassName: Pe, noWheelClassName: Et, noPanClassName: Ue, disableKeyboardA11y: Ke, onViewportChange: Ze, isControlledViewport: !!Re, children: j(rx, { children: [E(nx, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: ye, onReconnectStart: $e, onReconnectEnd: Ae, onlyRenderVisibleElements: A, onEdgeContextMenu: Z, onEdgeMouseEnter: Q, onEdgeMouseMove: ee, onEdgeMouseLeave: re, reconnectRadius: ie, defaultMarkerColor: k, noPanClassName: Ue, disableKeyboardA11y: Ke, rfId: De }), E(dx, { style: y, type: p, component: x, containerStyle: m }), E("div", { className: "react-flow__edgelabel-renderer" }), E(Rw, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, nodeClickDistance: X, onlyRenderVisibleElements: A, noPanClassName: Ue, noDragClassName: Pe, disableKeyboardA11y: Ke, nodeExtent: xe, rfId: De, nodesDraggable: Wn }), E("div", { className: "react-flow__viewport-portal" })] }) });
}
el.displayName = "GraphView";
const px = ce(el), gx = Zs(), Ti = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: u, nodeExtent: f, zIndexMode: d = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), m = r ?? t ?? [], v = n ?? e ?? [], g = u ?? [0, 0], b = f ?? Pt;
  ua(y, x, m);
  const { nodesInitialized: N } = kr(v, h, p, {
    nodeOrigin: g,
    nodeExtent: b,
    zIndexMode: d
  });
  let _ = [0, 0, 1];
  if (s && o && i) {
    const M = Xt(h, {
      filter: (O) => !!((O.width || O.initialWidth) && (O.height || O.initialHeight))
    }), { x: T, y: A, zoom: R } = Dn(M, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    _ = [T, A, R];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: _,
    nodes: v,
    nodesInitialized: N,
    nodeLookup: h,
    parentLookup: p,
    edges: m,
    edgeLookup: x,
    connectionLookup: y,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: Pt,
    nodeExtent: b,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: mt.Strict,
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
    connection: { ...Xs },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: gx,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Ws,
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
}, mx = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: u, nodeExtent: f, zIndexMode: d }) => My((h, p) => {
  async function y() {
    const { nodeLookup: x, panZoom: m, fitViewOptions: v, fitViewResolver: g, width: b, height: N, minZoom: _, maxZoom: M } = p();
    m && (await um({
      nodes: x,
      width: b,
      height: N,
      panZoom: m,
      minZoom: _,
      maxZoom: M
    }, v), g == null || g.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...Ti({
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
    setNodes: (x) => {
      const { nodeLookup: m, parentLookup: v, nodeOrigin: g, nodeExtent: b, elevateNodesOnSelect: N, fitViewQueued: _, zIndexMode: M, nodesSelectionActive: T } = p(), { nodesInitialized: A, hasSelectedNodes: R } = kr(x, m, v, {
        nodeOrigin: g,
        nodeExtent: b,
        elevateNodesOnSelect: N,
        checkEquality: !0,
        zIndexMode: M
      }), O = T && R;
      _ && A ? (y(), h({
        nodes: x,
        nodesInitialized: A,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: O
      })) : h({ nodes: x, nodesInitialized: A, nodesSelectionActive: O });
    },
    setEdges: (x) => {
      const { connectionLookup: m, edgeLookup: v } = p();
      ua(m, v, x), h({ edges: x });
    },
    setDefaultNodesAndEdges: (x, m) => {
      if (x) {
        const { setNodes: v } = p();
        v(x), h({ hasDefaultNodes: !0 });
      }
      if (m) {
        const { setEdges: v } = p();
        v(m), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (x) => {
      const { triggerNodeChanges: m, nodeLookup: v, parentLookup: g, domNode: b, nodeOrigin: N, nodeExtent: _, debug: M, fitViewQueued: T, zIndexMode: A } = p(), { changes: R, updatedInternals: O } = Lm(x, v, g, b, N, _, A);
      O && (Im(v, g, { nodeOrigin: N, nodeExtent: _, zIndexMode: A }), T ? (y(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), (R == null ? void 0 : R.length) > 0 && (M && console.log("React Flow: trigger node changes", R), m == null || m(R)));
    },
    updateNodePositions: (x, m = !1) => {
      const v = [];
      let g = [];
      const { nodeLookup: b, triggerNodeChanges: N, connection: _, updateConnection: M, onNodesChangeMiddlewareMap: T } = p();
      for (const [A, R] of x) {
        const O = b.get(A), H = !!(O != null && O.expandParent && (O != null && O.parentId) && (R != null && R.position)), P = {
          id: A,
          type: "position",
          position: H ? {
            x: Math.max(0, R.position.x),
            y: Math.max(0, R.position.y)
          } : R.position,
          dragging: m
        };
        if (O && _.inProgress && _.fromNode.id === O.id) {
          const w = at(O, _.fromHandle, W.Left, !0);
          M({ ..._, from: w });
        }
        H && O.parentId && v.push({
          id: A,
          parentId: O.parentId,
          rect: {
            ...R.internals.positionAbsolute,
            width: R.measured.width ?? 0,
            height: R.measured.height ?? 0
          }
        }), g.push(P);
      }
      if (v.length > 0) {
        const { parentLookup: A, nodeOrigin: R } = p(), O = Kr(v, b, A, R);
        g.push(...O);
      }
      for (const A of T.values())
        g = A(g);
      N(g);
    },
    triggerNodeChanges: (x) => {
      const { onNodesChange: m, setNodes: v, nodes: g, hasDefaultNodes: b, debug: N } = p();
      if (x != null && x.length) {
        if (b) {
          const _ = Uy(x, g);
          v(_);
        }
        N && console.log("React Flow: trigger node changes", x), m == null || m(x);
      }
    },
    triggerEdgeChanges: (x) => {
      const { onEdgesChange: m, setEdges: v, edges: g, hasDefaultEdges: b, debug: N } = p();
      if (x != null && x.length) {
        if (b) {
          const _ = Ky(x, g);
          v(_);
        }
        N && console.log("React Flow: trigger edge changes", x), m == null || m(x);
      }
    },
    addSelectedNodes: (x) => {
      const { multiSelectionActive: m, edgeLookup: v, nodeLookup: g, triggerNodeChanges: b, triggerEdgeChanges: N } = p();
      if (m) {
        const _ = x.map((M) => Je(M, !0));
        b(_);
        return;
      }
      b(ut(g, /* @__PURE__ */ new Set([...x]), !0)), N(ut(v));
    },
    addSelectedEdges: (x) => {
      const { multiSelectionActive: m, edgeLookup: v, nodeLookup: g, triggerNodeChanges: b, triggerEdgeChanges: N } = p();
      if (m) {
        const _ = x.map((M) => Je(M, !0));
        N(_);
        return;
      }
      N(ut(v, /* @__PURE__ */ new Set([...x]))), b(ut(g, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: x, edges: m } = {}) => {
      const { edges: v, nodes: g, nodeLookup: b, triggerNodeChanges: N, triggerEdgeChanges: _ } = p(), M = x || g, T = m || v, A = [];
      for (const O of M) {
        if (!O.selected)
          continue;
        const H = b.get(O.id);
        H && (H.selected = !1), A.push(Je(O.id, !1));
      }
      const R = [];
      for (const O of T)
        O.selected && R.push(Je(O.id, !1));
      N(A), _(R);
    },
    setMinZoom: (x) => {
      const { panZoom: m, maxZoom: v } = p();
      m == null || m.setScaleExtent([x, v]), h({ minZoom: x });
    },
    setMaxZoom: (x) => {
      const { panZoom: m, minZoom: v } = p();
      m == null || m.setScaleExtent([v, x]), h({ maxZoom: x });
    },
    setTranslateExtent: (x) => {
      var m;
      (m = p().panZoom) == null || m.setTranslateExtent(x), h({ translateExtent: x });
    },
    resetSelectedElements: () => {
      const { edges: x, nodes: m, triggerNodeChanges: v, triggerEdgeChanges: g, elementsSelectable: b } = p();
      if (!b)
        return;
      const N = m.reduce((M, T) => T.selected ? [...M, Je(T.id, !1)] : M, []), _ = x.reduce((M, T) => T.selected ? [...M, Je(T.id, !1)] : M, []);
      v(N), g(_);
    },
    setNodeExtent: (x) => {
      const { nodes: m, nodeLookup: v, parentLookup: g, nodeOrigin: b, elevateNodesOnSelect: N, nodeExtent: _, zIndexMode: M } = p();
      x[0][0] === _[0][0] && x[0][1] === _[0][1] && x[1][0] === _[1][0] && x[1][1] === _[1][1] || (kr(m, v, g, {
        nodeOrigin: b,
        nodeExtent: x,
        elevateNodesOnSelect: N,
        checkEquality: !1,
        zIndexMode: M
      }), h({ nodeExtent: x }));
    },
    panBy: (x) => {
      const { transform: m, width: v, height: g, panZoom: b, translateExtent: N } = p();
      return Om({ delta: x, panZoom: b, transform: m, translateExtent: N, width: v, height: g });
    },
    setCenter: async (x, m, v) => {
      const { width: g, height: b, maxZoom: N, panZoom: _ } = p();
      if (!_)
        return !1;
      const M = typeof (v == null ? void 0 : v.zoom) < "u" ? v.zoom : N;
      return await _.setViewport({
        x: g / 2 - x * M,
        y: b / 2 - m * M,
        zoom: M
      }, { duration: v == null ? void 0 : v.duration, ease: v == null ? void 0 : v.ease, interpolate: v == null ? void 0 : v.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...Xs }
      });
    },
    updateConnection: (x) => {
      h({ connection: x });
    },
    reset: () => h({ ...Ti() })
  };
}, Object.is);
function tl({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: u, nodeExtent: f, zIndexMode: d, children: h }) {
  const [p] = ae(() => mx({
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
  return E(Iy, { value: p, children: E(tw, { children: E(mw, { children: h }) }) });
}
function yx({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) {
  return _t(Vn) ? E(ke, { children: e }) : E(tl, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: e });
}
const wx = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function xx({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: u, onMoveStart: f, onMoveEnd: d, onConnect: h, onConnectStart: p, onConnectEnd: y, onClickConnectStart: x, onClickConnectEnd: m, onNodeMouseEnter: v, onNodeMouseMove: g, onNodeMouseLeave: b, onNodeContextMenu: N, onNodeDoubleClick: _, onNodeDragStart: M, onNodeDrag: T, onNodeDragStop: A, onNodesDelete: R, onEdgesDelete: O, onDelete: H, onSelectionChange: P, onSelectionDragStart: w, onSelectionDrag: S, onSelectionDragStop: k, onSelectionContextMenu: $, onSelectionStart: L, onSelectionEnd: C, onBeforeDelete: I, connectionMode: z, connectionLineType: V = Ge.Bezier, connectionLineStyle: Y, connectionLineComponent: F, connectionLineContainerStyle: q, deleteKeyCode: J = "Backspace", selectionKeyCode: G = "Shift", selectionOnDrag: D = !1, selectionMode: B = Dt.Full, panActivationKeyCode: U = "Space", multiSelectionKeyCode: K = Vt() ? "Meta" : "Control", zoomActivationKeyCode: X = Vt() ? "Meta" : "Control", snapToGrid: Z, snapGrid: Q, onlyRenderVisibleElements: ee = !1, selectNodesOnDrag: re, nodesDraggable: ie, autoPanOnNodeFocus: ye, nodesConnectable: $e, nodesFocusable: Ae, nodeOrigin: Pe = Ca, edgesFocusable: Et, edgesReconnectable: Ue, elementsSelectable: Ke = !0, defaultViewport: xe = Fy, minZoom: De = 0.5, maxZoom: Re = 2, translateExtent: Ze = Pt, preventScrolling: Wn = !0, nodeExtent: Xn, defaultMarkerColor: sl = "#b1b1b7", zoomOnScroll: al = !0, zoomOnPinch: ll = !0, panOnScroll: cl = !1, panOnScrollSpeed: ul = 0.5, panOnScrollMode: dl = nt.Free, zoomOnDoubleClick: fl = !0, panOnDrag: hl = !0, onPaneClick: pl, onPaneMouseEnter: gl, onPaneMouseMove: ml, onPaneMouseLeave: yl, onPaneScroll: wl, onPaneContextMenu: xl, paneClickDistance: bl = 1, nodeClickDistance: vl = 0, children: _l, onReconnect: El, onReconnectStart: kl, onReconnectEnd: Nl, onEdgeContextMenu: Sl, onEdgeDoubleClick: Cl, onEdgeMouseEnter: Ml, onEdgeMouseMove: Il, onEdgeMouseLeave: $l, reconnectRadius: Al = 10, onNodesChange: Tl, onEdgesChange: Ll, noDragClassName: Ol = "nodrag", noWheelClassName: zl = "nowheel", noPanClassName: Qr = "nopan", fitView: Jr, fitViewOptions: eo, connectOnClick: Pl, attributionPosition: Dl, proOptions: Rl, defaultEdgeOptions: Hl, elevateNodesOnSelect: Vl = !0, elevateEdgesOnSelect: Bl = !1, disableKeyboardA11y: to = !1, autoPanOnConnect: Fl, autoPanOnNodeDrag: Yl, autoPanOnSelection: Wl = !0, autoPanSpeed: Xl, connectionRadius: Gl, isValidConnection: jl, onError: ql, style: Ul, id: no, nodeDragThreshold: Kl, connectionDragThreshold: Zl, viewport: Ql, onViewportChange: Jl, width: ec, height: tc, colorMode: nc = "light", debug: rc, onScroll: Ut, ariaLabelConfig: oc, zIndexMode: ro = "basic", ...ic }, sc) {
  const Gn = no || "1", ac = Gy(nc), lc = Ne((oo) => {
    oo.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Ut == null || Ut(oo);
  }, [Ut]);
  return E("div", { "data-testid": "rf__wrapper", ...ic, onScroll: lc, style: { ...Ul, ...wx }, ref: sc, className: fe(["react-flow", o, ac]), id: no, role: "application", children: j(yx, { nodes: e, edges: t, width: ec, height: tc, fitView: Jr, fitViewOptions: eo, minZoom: De, maxZoom: Re, nodeOrigin: Pe, nodeExtent: Xn, zIndexMode: ro, children: [E(Xy, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: h, onConnectStart: p, onConnectEnd: y, onClickConnectStart: x, onClickConnectEnd: m, nodesDraggable: ie, autoPanOnNodeFocus: ye, nodesConnectable: $e, nodesFocusable: Ae, edgesFocusable: Et, edgesReconnectable: Ue, elementsSelectable: Ke, elevateNodesOnSelect: Vl, elevateEdgesOnSelect: Bl, minZoom: De, maxZoom: Re, nodeExtent: Xn, onNodesChange: Tl, onEdgesChange: Ll, snapToGrid: Z, snapGrid: Q, connectionMode: z, translateExtent: Ze, connectOnClick: Pl, defaultEdgeOptions: Hl, fitView: Jr, fitViewOptions: eo, onNodesDelete: R, onEdgesDelete: O, onDelete: H, onNodeDragStart: M, onNodeDrag: T, onNodeDragStop: A, onSelectionDrag: S, onSelectionDragStart: w, onSelectionDragStop: k, onMove: u, onMoveStart: f, onMoveEnd: d, noPanClassName: Qr, nodeOrigin: Pe, rfId: Gn, autoPanOnConnect: Fl, autoPanOnNodeDrag: Yl, autoPanSpeed: Xl, onError: ql, connectionRadius: Gl, isValidConnection: jl, selectNodesOnDrag: re, nodeDragThreshold: Kl, connectionDragThreshold: Zl, onBeforeDelete: I, debug: rc, ariaLabelConfig: oc, zIndexMode: ro }), E(px, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: v, onNodeMouseMove: g, onNodeMouseLeave: b, onNodeContextMenu: N, onNodeDoubleClick: _, nodeTypes: i, edgeTypes: s, connectionLineType: V, connectionLineStyle: Y, connectionLineComponent: F, connectionLineContainerStyle: q, selectionKeyCode: G, selectionOnDrag: D, selectionMode: B, deleteKeyCode: J, multiSelectionKeyCode: K, panActivationKeyCode: U, zoomActivationKeyCode: X, onlyRenderVisibleElements: ee, defaultViewport: xe, translateExtent: Ze, minZoom: De, maxZoom: Re, preventScrolling: Wn, zoomOnScroll: al, zoomOnPinch: ll, zoomOnDoubleClick: fl, panOnScroll: cl, panOnScrollSpeed: ul, panOnScrollMode: dl, panOnDrag: hl, autoPanOnSelection: Wl, onPaneClick: pl, onPaneMouseEnter: gl, onPaneMouseMove: ml, onPaneMouseLeave: yl, onPaneScroll: wl, onPaneContextMenu: xl, paneClickDistance: bl, nodeClickDistance: vl, onSelectionContextMenu: $, onSelectionStart: L, onSelectionEnd: C, onReconnect: El, onReconnectStart: kl, onReconnectEnd: Nl, onEdgeContextMenu: Sl, onEdgeDoubleClick: Cl, onEdgeMouseEnter: Ml, onEdgeMouseMove: Il, onEdgeMouseLeave: $l, reconnectRadius: Al, defaultMarkerColor: sl, noDragClassName: Ol, noWheelClassName: zl, noPanClassName: Qr, rfId: Gn, disableKeyboardA11y: to, nodeExtent: Xn, viewport: Ql, onViewportChange: Jl, nodesDraggable: ie }), E(By, { onSelectionChange: P }), _l, E(Py, { proOptions: Rl, position: Dl }), E(zy, { rfId: Gn, disableKeyboardA11y: to })] }) });
}
var bx = Ia(xx);
function vx({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return E("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: fe(["react-flow__background-pattern", n, r]) });
}
function _x({ radius: e, className: t }) {
  return E("circle", { cx: e, cy: e, r: e, className: fe(["react-flow__background-pattern", "dots", t]) });
}
var qe;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(qe || (qe = {}));
const Ex = {
  [qe.Dots]: 1,
  [qe.Lines]: 1,
  [qe.Cross]: 6
}, kx = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function nl({
  id: e,
  variant: t = qe.Dots,
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
  const f = te(null), { transform: d, patternId: h } = ne(kx, le), p = r || Ex[t], y = t === qe.Dots, x = t === qe.Cross, m = Array.isArray(n) ? n : [n, n], v = [m[0] * d[2] || 1, m[1] * d[2] || 1], g = p * d[2], b = Array.isArray(i) ? i : [i, i], N = x ? [g, g] : v, _ = [
    b[0] * d[2] + N[0] / 2,
    b[1] * d[2] + N[1] / 2
  ], M = `${h}${e || ""}`;
  return j("svg", { className: fe(["react-flow__background", c]), style: {
    ...l,
    ...Fn,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [E("pattern", { id: M, x: d[0] % v[0], y: d[1] % v[1], width: v[0], height: v[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${_[0]},-${_[1]})`, children: y ? E(_x, { radius: g / 2, className: u }) : E(vx, { dimensions: N, lineWidth: o, variant: t, className: u }) }), E("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${M})` })] });
}
nl.displayName = "Background";
const Nx = ce(nl);
function Sx() {
  return E("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: E("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Cx() {
  return E("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: E("path", { d: "M0 0h32v4.2H0z" }) });
}
function Mx() {
  return E("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: E("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function Ix() {
  return E("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: E("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function $x() {
  return E("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: E("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function sn({ children: e, className: t, ...n }) {
  return E("button", { type: "button", className: fe(["react-flow__controls-button", t]), ...n, children: e });
}
const Ax = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function rl({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: u, position: f = "bottom-left", orientation: d = "vertical", "aria-label": h }) {
  const p = se(), { isInteractive: y, minZoomReached: x, maxZoomReached: m, ariaLabelConfig: v } = ne(Ax, le), { zoomIn: g, zoomOut: b, fitView: N } = Bn(), _ = () => {
    g(), i == null || i();
  }, M = () => {
    b(), s == null || s();
  }, T = () => {
    N(o), a == null || a();
  }, A = () => {
    p.setState({
      nodesDraggable: !y,
      nodesConnectable: !y,
      elementsSelectable: !y
    }), l == null || l(!y);
  };
  return j(qt, { className: fe(["react-flow__controls", d === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? v["controls.ariaLabel"], children: [t && j(ke, { children: [E(sn, { onClick: _, className: "react-flow__controls-zoomin", title: v["controls.zoomIn.ariaLabel"], "aria-label": v["controls.zoomIn.ariaLabel"], disabled: m, children: E(Sx, {}) }), E(sn, { onClick: M, className: "react-flow__controls-zoomout", title: v["controls.zoomOut.ariaLabel"], "aria-label": v["controls.zoomOut.ariaLabel"], disabled: x, children: E(Cx, {}) })] }), n && E(sn, { className: "react-flow__controls-fitview", onClick: T, title: v["controls.fitView.ariaLabel"], "aria-label": v["controls.fitView.ariaLabel"], children: E(Mx, {}) }), r && E(sn, { className: "react-flow__controls-interactive", onClick: A, title: v["controls.interactive.ariaLabel"], "aria-label": v["controls.interactive.ariaLabel"], children: y ? E($x, {}) : E(Ix, {}) }), u] });
}
rl.displayName = "Controls";
const Tx = ce(rl);
function Lx({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: u, shapeRendering: f, selected: d, onClick: h }) {
  const { background: p, backgroundColor: y } = i || {}, x = s || p || y;
  return E("rect", { className: fe(["react-flow__minimap-node", { selected: d }, c]), x: t, y: n, rx: u, ry: u, width: r, height: o, style: {
    fill: x,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: h ? (m) => h(m, e) : void 0 });
}
const Ox = ce(Lx), zx = (e) => e.nodes.map((t) => t.id), lr = (e) => e instanceof Function ? e : () => e;
function Px({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: o,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: i = Ox,
  onClick: s
}) {
  const a = ne(zx, le), l = lr(t), c = lr(e), u = lr(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return E(ke, { children: a.map((d) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    E(Rx, { id: d, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: u, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, d)
  )) });
}
function Dx({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: u, y: f, width: d, height: h } = ne((p) => {
    const y = p.nodeLookup.get(e);
    if (!y)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const x = y.internals.userNode, { x: m, y: v } = y.internals.positionAbsolute, { width: g, height: b } = Ie(x);
    return {
      node: x,
      x: m,
      y: v,
      width: g,
      height: b
    };
  }, le);
  return !c || c.hidden || !Qs(c) ? null : E(a, { x: u, y: f, width: d, height: h, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const Rx = ce(Dx);
var Hx = ce(Px);
const Vx = 200, Bx = 150, Fx = (e) => !e.hidden, Yx = (e) => {
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
    boundingRect: n ? Us(Xt(e.nodeLookup, { filter: Fx }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Li = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, Wx = (e, t) => Li(e.viewBB, t.viewBB) && Li(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, Xx = "react-flow__minimap-desc";
function ol({
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
  pannable: y = !1,
  zoomable: x = !1,
  ariaLabel: m,
  inversePan: v,
  zoomStep: g = 1,
  offsetScale: b = 5
}) {
  const N = se(), _ = te(null), { boundingRect: M, panZoom: T, viewBB: A, rfId: R, translateExtent: O, flowWidth: H, flowHeight: P, ariaLabelConfig: w } = ne(Yx, Wx), S = (e == null ? void 0 : e.width) ?? Vx, k = (e == null ? void 0 : e.height) ?? Bx, $ = M.width / S, L = M.height / k, C = Math.max($, L), I = C * S, z = C * k, V = b * C, Y = M.x - (I - M.width) / 2 - V, F = M.y - (z - M.height) / 2 - V, q = I + V * 2, J = z + V * 2, G = `${Xx}-${R}`, D = te(0), B = te();
  D.current = C, oe(() => {
    const Q = N.getState().panZoom;
    if (_.current && Q)
      return B.current = Ym({
        domNode: _.current,
        panZoom: Q,
        getTransform: () => N.getState().transform,
        getViewScale: () => D.current
      }), () => {
        var ee;
        (ee = B.current) == null || ee.destroy();
      };
  }, [T]), oe(() => {
    var Q;
    (Q = B.current) == null || Q.update({
      translateExtent: O,
      width: H,
      height: P,
      inversePan: v,
      pannable: y,
      zoomStep: g,
      zoomable: x
    });
  }, [y, x, v, g, O, H, P]);
  const U = h ? (Q) => {
    var ie;
    const [ee, re] = ((ie = B.current) == null ? void 0 : ie.pointer(Q)) || [0, 0];
    h(Q, { x: ee, y: re });
  } : void 0, K = Ne((Q, ee) => {
    const re = N.getState().nodeLookup.get(ee).internals.userNode;
    p == null || p(Q, re);
  }, [p]), X = p ? K : void 0, Z = m ?? w["minimap.ariaLabel"];
  return E(qt, { position: d, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * C : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: fe(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: j("svg", { width: S, height: k, viewBox: `${Y} ${F} ${q} ${J}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": G, ref: _, onClick: U, children: [Z && E("title", { id: G, children: Z }), E(Hx, { onClick: X, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), E("path", { className: "react-flow__minimap-mask", d: `M${Y - V},${F - V}h${q + V * 2}v${J + V * 2}h${-q - V * 2}z
        M${A.x},${A.y}h${A.width}v${A.height}h${-A.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
ol.displayName = "MiniMap";
const Gx = ce(ol), jx = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, qx = {
  [xt.Line]: "right",
  [xt.Handle]: "bottom-right"
};
function Ux({ nodeId: e, position: t, variant: n = xt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: d, autoScale: h = !0, shouldResize: p, onResizeStart: y, onResize: x, onResizeEnd: m }) {
  const v = Oa(), g = typeof e == "string" ? e : v, b = se(), N = te(null), _ = n === xt.Handle, M = ne(Ne(jx(_ && h), [_, h]), le), T = te(null), A = t ?? qx[n];
  oe(() => {
    if (!(!N.current || !g))
      return T.current || (T.current = ny({
        domNode: N.current,
        nodeId: g,
        getStoreItems: () => {
          const { nodeLookup: O, transform: H, snapGrid: P, snapToGrid: w, nodeOrigin: S, domNode: k } = b.getState();
          return {
            nodeLookup: O,
            transform: H,
            snapGrid: P,
            snapToGrid: w,
            nodeOrigin: S,
            paneDomNode: k
          };
        },
        onChange: (O, H) => {
          const { triggerNodeChanges: P, nodeLookup: w, parentLookup: S, nodeOrigin: k } = b.getState(), $ = [], L = { x: O.x, y: O.y }, C = w.get(g);
          if (C && C.expandParent && C.parentId) {
            const I = C.origin ?? k, z = O.width ?? C.measured.width ?? 0, V = O.height ?? C.measured.height ?? 0, Y = {
              id: C.id,
              parentId: C.parentId,
              rect: {
                width: z,
                height: V,
                ...Js({
                  x: O.x ?? C.position.x,
                  y: O.y ?? C.position.y
                }, { width: z, height: V }, C.parentId, w, I)
              }
            }, F = Kr([Y], w, S, k);
            $.push(...F), L.x = O.x ? Math.max(I[0] * z, O.x) : void 0, L.y = O.y ? Math.max(I[1] * V, O.y) : void 0;
          }
          if (L.x !== void 0 && L.y !== void 0) {
            const I = {
              id: g,
              type: "position",
              position: { ...L }
            };
            $.push(I);
          }
          if (O.width !== void 0 && O.height !== void 0) {
            const z = {
              id: g,
              type: "dimensions",
              resizing: !0,
              setAttributes: d ? d === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: O.width,
                height: O.height
              }
            };
            $.push(z);
          }
          for (const I of H) {
            const z = {
              ...I,
              type: "position"
            };
            $.push(z);
          }
          P($);
        },
        onEnd: ({ width: O, height: H }) => {
          const P = {
            id: g,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: O,
              height: H
            }
          };
          b.getState().triggerNodeChanges([P]);
        }
      })), T.current.update({
        controlPosition: A,
        boundaries: {
          minWidth: a,
          minHeight: l,
          maxWidth: c,
          maxHeight: u
        },
        keepAspectRatio: f,
        resizeDirection: d,
        onResizeStart: y,
        onResize: x,
        onResizeEnd: m,
        shouldResize: p
      }), () => {
        var O;
        (O = T.current) == null || O.destroy();
      };
  }, [
    A,
    a,
    l,
    c,
    u,
    f,
    y,
    x,
    m,
    p
  ]);
  const R = A.split("-");
  return E("div", { className: fe(["react-flow__resize-control", "nodrag", ...R, n, r]), ref: N, style: {
    ...o,
    scale: M,
    ...s && { [_ ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
ce(Ux);
const Kx = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", hn = { names: 210, keys: 240, columns: 240 }, Cr = 34, At = 20, Zx = 370, Oi = 0.05, zi = "system-map-erd-css", Qx = `
.system-map-erd .react-flow {
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
.system-map-erd .react-flow__handle { opacity: 0; pointer-events: none; min-width: 1px; min-height: 1px; }
.system-map-erd .react-flow__node { cursor: pointer; }
`;
if (!document.getElementById(zi)) {
  const e = document.createElement("style");
  e.id = zi, e.textContent = Kx + Qx, document.head.appendChild(e);
}
const Jx = ce(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, focused: s, width: a, large: l } = t, c = n.status === "external";
  return /* @__PURE__ */ j(
    "div",
    {
      style: {
        width: a,
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `1px ${c ? "dashed" : "solid"} ${s ? "var(--accent, #2563eb)" : "var(--border-strong, #a1a1aa)"}`,
        boxShadow: s ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : void 0,
        fontSize: 12
      },
      children: [
        /* @__PURE__ */ E(vt, { type: "target", position: W.Left, isConnectable: !1 }),
        /* @__PURE__ */ E(vt, { type: "source", position: W.Right, isConnectable: !1 }),
        /* @__PURE__ */ j(
          "div",
          {
            style: {
              height: Cr,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "0 10px",
              fontSize: l ? 16 : 13,
              fontWeight: 600,
              background: r.length ? "var(--bg-hover, #f4f4f5)" : void 0
            },
            children: [
              /* @__PURE__ */ E("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ j("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                i > 0 && /* @__PURE__ */ E("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ E("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                c && /* @__PURE__ */ E("span", { style: je, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((u) => /* @__PURE__ */ j(
          "div",
          {
            style: { height: At, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ E("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: u.primary ? "PK" : u.foreign ? "FK" : "" }),
              /* @__PURE__ */ E("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u.name }),
              /* @__PURE__ */ E("span", { style: { ...je, ...Hi, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u.type })
            ]
          },
          u.name
        )),
        o > 0 && /* @__PURE__ */ j("div", { style: { ...je, height: At, padding: "0 10px", lineHeight: `${At}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), eb = { table: Jx };
function il(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function Sn(e, t) {
  if (t === "names") return Cr + 2;
  const n = il(e, t).length;
  return Cr + n * At + (n < e.columns.length ? At : 0) + 2;
}
function tb(e, t) {
  const n = hn[t], r = new Mo.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: Sn(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  Mo.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - Sn(a, t) / 2 });
  }
  return s;
}
function nb(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const Mr = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function rb(e) {
  return (Mr.find(([t]) => t === e) ?? Mr[2])[1];
}
function ob() {
  return /* @__PURE__ */ j(
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
        /* @__PURE__ */ E("span", { style: je, children: "On delete" }),
        Mr.map(([e, t]) => /* @__PURE__ */ j("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ E("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function ib({
  graph: e,
  selected: t,
  flagged: n,
  density: r,
  onSelect: o
}) {
  const { mode: i } = dc(), s = Bn(), a = he(() => t ? nb(e, t) : e, [e, t]), l = t && r === "names" ? "keys" : r, c = he(() => tb(a, l), [a, l]), u = he(
    () => a.tables.map((y) => {
      const x = il(y, l);
      return {
        id: y.id,
        type: "table",
        position: c.get(y.id) ?? { x: 0, y: 0 },
        width: hn[l],
        height: Sn(y, l),
        data: {
          table: y,
          columns: x,
          hidden: l === "names" ? 0 : y.columns.length - x.length,
          flags: n.get(y.id) ?? 0,
          focused: y.id === t,
          width: hn[l],
          large: l === "names"
        }
      };
    }),
    [a, l, c, n, t]
  ), f = he(
    () => a.edges.map((y) => {
      const x = rb(y.on_delete);
      return {
        id: y.id,
        source: y.source,
        target: y.target,
        selectable: !1,
        markerEnd: { type: Rt.ArrowClosed, width: 14, height: 14, color: x },
        style: { stroke: x, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [a, t]
  ), d = ne((y) => y.width), h = ne((y) => y.height), p = te(!1);
  return oe(() => {
    if (!d || !h) return;
    const y = a.tables.map((_) => ({
      ...c.get(_.id) ?? { x: 0, y: 0 },
      width: hn[l],
      height: Sn(_, l)
    })), x = Math.min(...y.map((_) => _.x)), m = Math.min(...y.map((_) => _.y)), v = Math.max(...y.map((_) => _.x + _.width)), g = Math.max(...y.map((_) => _.y + _.height)), b = t ? Math.min(Zx, d * 0.5) : 0, N = Dn(
      { x, y: m, width: v - x, height: g - m },
      d - b,
      h,
      Oi,
      1,
      0.04
    );
    s.setViewport(N, { duration: p.current ? 200 : 0 }), p.current = !0;
  }, [s, a, t, c, l, d, h]), /* @__PURE__ */ j(
    bx,
    {
      nodes: u,
      edges: f,
      nodeTypes: eb,
      colorMode: i,
      minZoom: Oi,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (y, x) => o(x.id),
      onPaneClick: () => o(null),
      children: [
        /* @__PURE__ */ E(Nx, { gap: 24, size: 1 }),
        /* @__PURE__ */ E(Tx, { showInteractive: !1 }),
        /* @__PURE__ */ E(Gx, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ E(qt, { position: "top-left", children: /* @__PURE__ */ E(ob, {}) })
      ]
    }
  );
}
function sb(e) {
  return /* @__PURE__ */ E("div", { className: "system-map-erd", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ E(tl, { children: /* @__PURE__ */ E(ib, { ...e }) }) });
}
const ab = ["high", "medium", "low", "info"];
function lb({
  findings: e,
  onShow: t,
  onAsk: n
}) {
  const [r, o] = ae(null), i = he(() => {
    const a = /* @__PURE__ */ new Map();
    for (const l of e) a.set(l.severity, (a.get(l.severity) ?? 0) + 1);
    return a;
  }, [e]), s = r ? e.filter((a) => a.severity === r) : e;
  return /* @__PURE__ */ j("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ j("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ j(Te, { primary: r === null, onClick: () => o(null), children: [
        "All ",
        e.length
      ] }),
      ab.filter((a) => i.get(a)).map((a) => /* @__PURE__ */ j(Te, { primary: r === a, onClick: () => o(a), children: [
        a,
        " ",
        i.get(a)
      ] }, a))
    ] }),
    s.length === 0 && /* @__PURE__ */ E("p", { style: je, children: "No findings." }),
    s.map((a) => /* @__PURE__ */ j("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ j("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ E(gc, { severity: a.severity }),
        /* @__PURE__ */ E("span", { style: { flex: 1, fontWeight: 600 }, children: a.title }),
        /* @__PURE__ */ E("button", { style: io, onClick: () => t(a.node), children: "Show" }),
        /* @__PURE__ */ E("button", { style: io, onClick: () => n(a), children: "Ask" })
      ] }),
      /* @__PURE__ */ E("p", { style: { margin: "4px 0 0" }, children: a.detail }),
      /* @__PURE__ */ E("p", { style: { ...je, ...Hi, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: a.evidence.join("  ") })
    ] }, a.id))
  ] });
}
const cb = "system-map-design", Pi = 12, ub = [
  ["names", "Names"],
  ["keys", "Keys"],
  ["columns", "Columns"]
], cr = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 };
function db(e) {
  const t = Ir(), [n, r] = ae(null), [o, i] = ae(null);
  oe(() => {
    if (!e) return;
    let a = !0;
    return (async () => {
      const c = await t.post("/api/chat/slots", { name: cb });
      await t.post(`/api/chat/slots/${encodeURIComponent(c.key)}/project`, { project: e }), a && r(c.key);
    })().catch((c) => {
      a && i(String(c));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const s = Ne(
    (a) => {
      n && t.post("/api/chat?ws=1", { message: a, slot: n, agent: "" });
    },
    [t, n]
  );
  return { slot: n, error: o, send: s };
}
function fb() {
  const e = te(null), [t, n] = ae(void 0);
  return Ri(() => {
    const r = () => {
      var i;
      const o = ((i = e.current) == null ? void 0 : i.getBoundingClientRect().top) ?? 0;
      n(Math.max(420, window.innerHeight - o - 16));
    };
    return r(), window.addEventListener("resize", r), () => window.removeEventListener("resize", r);
  }, []), { ref: e, height: t };
}
function hb({ message: e, onBuilt: t }) {
  const n = Ir(), [r, o] = ae(""), [i, s] = ae(!1), [a, l] = ae(null), c = async () => {
    s(!0), l(null);
    try {
      const u = await n.post(`${_c}/build`, { repo_path: r.trim() });
      t(u.repo_key);
    } catch (u) {
      l(String(u));
    } finally {
      s(!1);
    }
  };
  return /* @__PURE__ */ j(an, { children: [
    /* @__PURE__ */ E(ur, { children: "Build a model" }),
    e && /* @__PURE__ */ E("p", { style: { ...je, fontSize: 13 }, children: e }),
    /* @__PURE__ */ j("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ E(
        pc,
        {
          "aria-label": "Repo path",
          placeholder: "/path/to/repo",
          value: r,
          onChange: (u) => o(u.target.value),
          style: { flex: 1 }
        }
      ),
      /* @__PURE__ */ E(Te, { primary: !0, disabled: i || !r.trim(), onClick: () => void c(), children: i ? "Building" : "Build" })
    ] }),
    a && /* @__PURE__ */ E("p", { style: { fontSize: 13 }, children: a })
  ] });
}
function pb({ overview: e }) {
  const { stale: t, commits_behind: n, ref: r, changed_inputs: o = [] } = e.freshness;
  return t ? /* @__PURE__ */ j(dt, { variant: "warn", children: [
    o.length,
    " schema files changed on ",
    r
  ] }) : n > 0 ? /* @__PURE__ */ j(dt, { variant: "muted", children: [
    "Schema current, ",
    n,
    " commits behind ",
    r
  ] }) : /* @__PURE__ */ j(dt, { variant: "ok", children: [
    "Current with ",
    r
  ] });
}
function Nb() {
  var C;
  const e = Ir(), { repos: t, active: n, loaded: r, choose: o, reload: i } = mc(), { overview: s, error: a, refresh: l } = yc(n), c = s == null ? void 0 : s.manifest.version, u = so("/graph", n, c), f = ((C = so("/findings", n, c)) == null ? void 0 : C.findings) ?? [], [d, h] = ae(null), p = wc(d, n), [y, x] = ae("diagram"), [m, v] = ae("names"), [g, b] = ae(!1), [N, _] = ae(null), { ref: M, height: T } = fb(), A = db(s ? s.manifest.repo : null), R = he(() => {
    const I = /* @__PURE__ */ new Map();
    for (const z of f)
      z.severity !== "info" && I.set(z.node, (I.get(z.node) ?? 0) + 1);
    return I;
  }, [f]), O = async () => {
    _("Checking");
    try {
      const I = await e.post(vc("/build", null), { repo: s == null ? void 0 : s.manifest.repo_key });
      _(I.unchanged ? "No changes" : "Rebuilt"), await l();
    } catch (I) {
      _(String(I));
    }
  }, H = () => {
    p && A.send(`Use the system-map tools. Look at ${p.id} and tell me what to watch out for.`);
  }, P = (I) => {
    A.send(`Use the system-map tools. Check finding ${I.id} on ${I.node}, read its evidence, and propose a fix.`);
  }, w = (I) => {
    x("diagram"), h(I);
  }, S = (I) => {
    h(null), _(null), o(I);
  }, k = /* @__PURE__ */ j("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
    N && /* @__PURE__ */ E("span", { style: { ...je, fontSize: 13 }, children: N }),
    t.length > 1 && /* @__PURE__ */ E(
      "select",
      {
        "aria-label": "Repo",
        value: (s == null ? void 0 : s.manifest.repo_key) ?? "",
        onChange: (I) => S(I.target.value),
        style: { fontSize: 13, background: "transparent", color: "var(--text, inherit)" },
        children: t.map((I) => /* @__PURE__ */ E("option", { value: I.repo_key, children: I.repo.split("/").pop() }, I.repo_key))
      }
    ),
    /* @__PURE__ */ E(Te, { onClick: () => b((I) => !I), children: "Add repo" }),
    s && /* @__PURE__ */ E(Te, { onClick: () => void O(), children: "Rebuild" })
  ] }), $ = r && t.length === 0, L = g || $ || !s && a !== null;
  return /* @__PURE__ */ j(ke, { children: [
    /* @__PURE__ */ E(hc, { title: "System Map", subtitle: s ? s.manifest.repo : "One model of your system", actions: k }),
    /* @__PURE__ */ j("div", { ref: M, style: { height: T, display: "flex", flexDirection: "column", gap: Pi, padding: "0 16px", minHeight: 0 }, children: [
      L && /* @__PURE__ */ E(
        hb,
        {
          message: s ? null : $ ? "Point System Map at a repo with SQL migrations." : a,
          onBuilt: (I) => {
            b(!1), S(I), i();
          }
        }
      ),
      s && /* @__PURE__ */ j(ke, { children: [
        /* @__PURE__ */ j("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
          /* @__PURE__ */ E(pb, { overview: s }),
          /* @__PURE__ */ E(dt, { variant: "muted", children: s.manifest.commit.slice(0, 7) }),
          /* @__PURE__ */ j(dt, { variant: "muted", children: [
            s.manifest.counts.tables,
            " tables"
          ] }),
          /* @__PURE__ */ j(dt, { variant: "muted", children: [
            s.manifest.counts.columns,
            " columns"
          ] }),
          /* @__PURE__ */ E("span", { style: { flex: 1 } }),
          y === "diagram" && ub.map(([I, z]) => /* @__PURE__ */ E(Te, { primary: m === I, onClick: () => v(I), children: z }, I)),
          /* @__PURE__ */ E("span", { style: { width: 8 } }),
          /* @__PURE__ */ E(Te, { primary: y === "diagram", onClick: () => x("diagram"), children: "Diagram" }),
          /* @__PURE__ */ j(Te, { primary: y === "findings", onClick: () => x("findings"), children: [
            "Findings ",
            f.length
          ] })
        ] }),
        /* @__PURE__ */ j(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: Pi,
              gridTemplateColumns: "220px minmax(0, 1fr) minmax(320px, 26%)",
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ j(an, { style: cr, children: [
                /* @__PURE__ */ E(ur, { children: "Tables" }),
                /* @__PURE__ */ E(xc, { tables: s.tables, selected: d, flagged: R, onSelect: w })
              ] }),
              /* @__PURE__ */ j(an, { style: { ...cr, padding: 0, position: "relative" }, "data-testid": "canvas", children: [
                y === "diagram" && u && /* @__PURE__ */ E(sb, { graph: u, selected: d, flagged: R, density: m, onSelect: h }),
                y === "findings" && /* @__PURE__ */ E(lb, { findings: f, onShow: w, onAsk: P }),
                y === "diagram" && p && /* @__PURE__ */ j(
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
                      borderRadius: 8,
                      background: "var(--card, #fff)",
                      border: "1px solid var(--border, #e4e4e7)",
                      boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                      zIndex: 5
                    },
                    children: [
                      /* @__PURE__ */ j("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                        /* @__PURE__ */ E("span", { style: { flex: 1, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)" }, children: p.name }),
                        /* @__PURE__ */ E(Te, { primary: !0, onClick: H, disabled: !A.slot, children: "Ask" }),
                        /* @__PURE__ */ E(Te, { onClick: () => h(null), "aria-label": "Close", children: "Close" })
                      ] }),
                      /* @__PURE__ */ E("div", { style: { overflowY: "auto", minHeight: 0, flex: 1 }, children: /* @__PURE__ */ E(bc, { node: p, onAsk: P }) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ j(an, { style: cr, children: [
                /* @__PURE__ */ E(ur, { children: "Design chat" }),
                A.error && /* @__PURE__ */ j("p", { style: { fontSize: 13 }, children: [
                  "Chat is not available: ",
                  A.error
                ] }),
                /* @__PURE__ */ E("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: A.slot && /* @__PURE__ */ E("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ E(fc, { slotKey: A.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Nb as default
};
