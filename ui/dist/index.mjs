var Tc = Object.defineProperty;
var Lc = (e, t, n) => t in e ? Tc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var fe = (e, t, n) => Lc(e, typeof t != "symbol" ? t + "" : t, n);
import { jsx as v, jsxs as W, Fragment as xe } from "react/jsx-runtime";
import { useTheme as Zi, useAppApi as Vr, ChatEmbed as zc } from "@kirocrew/app-sdk";
import { Btn as ze, Badge as nt, PageHeader as Oc, Card as hn, CardTitle as xr, Input as Pc } from "@kirocrew/app-sdk/ui";
import Br, { memo as de, forwardRef as Qi, useState as ae, createContext as Pn, useCallback as Ce, useMemo as ce, useContext as Nt, useRef as re, useEffect as ie, useLayoutEffect as Ji } from "react";
import "react-dom";
import { M as he, a as Xt, S as Dc, A as xn, N as Rc, u as Hc, b as Vc, c as tn, d as Bc, e as Fc, T as Wc, w as Yc, B as es } from "./chunks/model-BQD0Q2Ko.mjs";
function ts(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var jc = "\0", et = "\0", _o = "";
let Gc = class {
  constructor(t) {
    fe(this, "_isDirected", !0);
    fe(this, "_isMultigraph", !1);
    fe(this, "_isCompound", !1);
    // Label for the graph itself
    fe(this, "_label");
    // Defaults to be set when creating a new node
    fe(this, "_defaultNodeLabelFn", () => {
    });
    // Defaults to be set when creating a new edge
    fe(this, "_defaultEdgeLabelFn", () => {
    });
    // v -> label
    fe(this, "_nodes", {});
    // v -> edgeObj
    fe(this, "_in", {});
    // u -> v -> Number
    fe(this, "_preds", {});
    // v -> edgeObj
    fe(this, "_out", {});
    // v -> w -> Number
    fe(this, "_sucs", {});
    // e -> edgeObj
    fe(this, "_edgeObjs", {});
    // e -> label
    fe(this, "_edgeLabels", {});
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    fe(this, "_nodeCount", 0);
    /* Number of edges in the graph. Should only be changed by the implementation. */
    fe(this, "_edgeCount", 0);
    fe(this, "_parent");
    fe(this, "_children");
    t && (this._isDirected = Object.hasOwn(t, "directed") ? t.directed : !0, this._isMultigraph = Object.hasOwn(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.hasOwn(t, "compound") ? t.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[et] = {});
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
    return Object.hasOwn(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = et, this._children[t] = {}, this._children[et][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      n = et;
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
      if (n !== et)
        return n;
    }
  }
  /**
   * Gets list of direct children of node v.
   * Complexity: O(1).
   */
  children(t = et) {
    if (this._isCompound) {
      var n = this._children[t];
      if (n)
        return Object.keys(n);
    } else {
      if (t === et)
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
    var a = $t(this._isDirected, t, n, r);
    if (Object.hasOwn(this._edgeLabels, a))
      return i && (this._edgeLabels[a] = o), this;
    if (r !== void 0 && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[a] = i ? o : this._defaultEdgeLabelFn(t, n, r);
    var l = Xc(this._isDirected, t, n, r);
    return t = l.v, n = l.w, Object.freeze(l), this._edgeObjs[a] = l, Eo(this._preds[n], t), Eo(this._sucs[t], n), this._in[n][a] = l, this._out[t][a] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   * Complexity: O(1).
   */
  edge(t, n, r) {
    var o = arguments.length === 1 ? rr(this._isDirected, arguments[0]) : $t(this._isDirected, t, n, r);
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
    var o = arguments.length === 1 ? rr(this._isDirected, arguments[0]) : $t(this._isDirected, t, n, r);
    return Object.hasOwn(this._edgeLabels, o);
  }
  /**
   * Removes the specified edge from the graph. No subgraphs are considered.
   * Complexity: O(1).
   */
  removeEdge(t, n, r) {
    var o = arguments.length === 1 ? rr(this._isDirected, arguments[0]) : $t(this._isDirected, t, n, r), i = this._edgeObjs[o];
    return i && (t = i.v, n = i.w, delete this._edgeLabels[o], delete this._edgeObjs[o], ko(this._preds[n], t), ko(this._sucs[t], n), delete this._in[n][o], delete this._out[t][o], this._edgeCount--), this;
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
function Eo(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function ko(e, t) {
  --e[t] || delete e[t];
}
function $t(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  return o + _o + i + _o + (r === void 0 ? jc : r);
}
function Xc(e, t, n, r) {
  var o = "" + t, i = "" + n;
  if (!e && o > i) {
    var s = o;
    o = i, i = s;
  }
  var a = { v: o, w: i };
  return r && (a.name = r), a;
}
function rr(e, t) {
  return $t(e, t.v, t.w, t.name);
}
var Fr = Gc, qc = "2.2.4", Uc = {
  Graph: Fr,
  version: qc
}, Kc = Fr, Zc = {
  write: Qc,
  read: tu
};
function Qc(e) {
  var t = {
    options: {
      directed: e.isDirected(),
      multigraph: e.isMultigraph(),
      compound: e.isCompound()
    },
    nodes: Jc(e),
    edges: eu(e)
  };
  return e.graph() !== void 0 && (t.value = structuredClone(e.graph())), t;
}
function Jc(e) {
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
  var t = new Kc(e.options).setGraph(e.value);
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
    fe(this, "_arr", []);
    fe(this, "_keyIndices", {});
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
var ns = ou, iu = ns, rs = au, su = () => 1;
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
var cu = rs, uu = du;
function du(e, t, n) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = cu(e, o, t, n), r;
  }, {});
}
var os = fu;
function fu(e) {
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
var hu = os, pu = gu;
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
        var u = l[i], f = s[c], d = l[c], h = u.distance + f.distance;
        h < d.distance && (d.distance = h, d.predecessor = f.predecessor);
      });
    });
  }), r;
}
function is(e) {
  var t = {}, n = {}, r = [];
  function o(i) {
    if (Object.hasOwn(n, i))
      throw new vr();
    Object.hasOwn(t, i) || (n[i] = !0, t[i] = !0, e.predecessors(i).forEach(o), delete n[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(t).length !== e.nodeCount())
    throw new vr();
  return r;
}
class vr extends Error {
  constructor() {
    super(...arguments);
  }
}
var ss = is;
is.CycleException = vr;
var So = ss, xu = vu;
function vu(e) {
  try {
    So(e);
  } catch (t) {
    if (t instanceof So.CycleException)
      return !1;
    throw t;
  }
  return !0;
}
var as = _u;
function _u(e, t, n) {
  Array.isArray(t) || (t = [t]);
  var r = e.isDirected() ? (a) => e.successors(a) : (a) => e.neighbors(a), o = n === "post" ? Eu : ku, i = [], s = {};
  return t.forEach((a) => {
    if (!e.hasNode(a))
      throw new Error("Graph does not have node: " + a);
    o(a, r, s, i);
  }), i;
}
function Eu(e, t, n, r) {
  for (var o = [[e, !1]]; o.length > 0; ) {
    var i = o.pop();
    i[1] ? r.push(i[0]) : Object.hasOwn(n, i[0]) || (n[i[0]] = !0, o.push([i[0], !0]), ls(t(i[0]), (s) => o.push([s, !1])));
  }
}
function ku(e, t, n, r) {
  for (var o = [e]; o.length > 0; ) {
    var i = o.pop();
    Object.hasOwn(n, i) || (n[i] = !0, r.push(i), ls(t(i), (s) => o.push(s)));
  }
}
function ls(e, t) {
  for (var n = e.length; n--; )
    t(e[n], n, e);
  return e;
}
var Su = as, Nu = Cu;
function Cu(e, t) {
  return Su(e, t, "post");
}
var Mu = as, Iu = $u;
function $u(e, t) {
  return Mu(e, t, "pre");
}
var Au = Fr, Tu = ns, Lu = zu;
function zu(e, t) {
  var n = new Au(), r = {}, o = new Tu(), i;
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
var Ou = {
  components: nu,
  dijkstra: rs,
  dijkstraAll: uu,
  findCycles: pu,
  floydWarshall: mu,
  isAcyclic: xu,
  postorder: Nu,
  preorder: Iu,
  prim: Lu,
  tarjan: os,
  topsort: ss
}, No = Uc, Ie = {
  Graph: No.Graph,
  json: Zc,
  alg: Ou,
  version: No.version
};
let Pu = class {
  constructor() {
    let t = {};
    t._next = t._prev = t, this._sentinel = t;
  }
  dequeue() {
    let t = this._sentinel, n = t._prev;
    if (n !== t)
      return Co(n), n;
  }
  enqueue(t) {
    let n = this._sentinel;
    t._prev && t._next && Co(t), t._next = n._next, n._next._prev = t, n._next = t, t._prev = n;
  }
  toString() {
    let t = [], n = this._sentinel, r = n._prev;
    for (; r !== n; )
      t.push(JSON.stringify(r, Du)), r = r._prev;
    return "[" + t.join(", ") + "]";
  }
};
function Co(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function Du(e, t) {
  if (e !== "_next" && e !== "_prev")
    return t;
}
var Ru = Pu;
let Hu = Ie.Graph, Vu = Ru;
var Bu = Wu;
let Fu = () => 1;
function Wu(e, t) {
  if (e.nodeCount() <= 1)
    return [];
  let n = ju(e, t || Fu);
  return Yu(n.graph, n.buckets, n.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w));
}
function Yu(e, t, n) {
  let r = [], o = t[t.length - 1], i = t[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); )
      or(e, t, n, s);
    for (; s = o.dequeue(); )
      or(e, t, n, s);
    if (e.nodeCount()) {
      for (let a = t.length - 2; a > 0; --a)
        if (s = t[a].dequeue(), s) {
          r = r.concat(or(e, t, n, s, !0));
          break;
        }
    }
  }
  return r;
}
function or(e, t, n, r, o) {
  let i = o ? [] : void 0;
  return e.inEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = e.node(s.v);
    o && i.push({ v: s.v, w: s.w }), l.out -= a, _r(t, n, l);
  }), e.outEdges(r.v).forEach((s) => {
    let a = e.edge(s), l = s.w, c = e.node(l);
    c.in -= a, _r(t, n, c);
  }), e.removeNode(r.v), i;
}
function ju(e, t) {
  let n = new Hu(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    n.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = n.edge(a.v, a.w) || 0, c = t(a), u = l + c;
    n.setEdge(a.v, a.w, u), o = Math.max(o, n.node(a.v).out += c), r = Math.max(r, n.node(a.w).in += c);
  });
  let i = Gu(o + r + 3).map(() => new Vu()), s = r + 1;
  return n.nodes().forEach((a) => {
    _r(i, s, n.node(a));
  }), { graph: n, buckets: i, zeroIdx: s };
}
function _r(e, t, n) {
  n.out ? n.in ? e[n.out - n.in + t].enqueue(n) : e[e.length - 1].enqueue(n) : e[0].enqueue(n);
}
function Gu(e) {
  const t = [];
  for (let n = 0; n < e; n++)
    t.push(n);
  return t;
}
let cs = Ie.Graph;
var pe = {
  addBorderNode: td,
  addDummyNode: us,
  applyWithChunking: Dn,
  asNonCompoundGraph: qu,
  buildLayerMatrix: Qu,
  intersectRect: Zu,
  mapValues: ld,
  maxRank: fs,
  normalizeRanks: Ju,
  notime: id,
  partition: rd,
  pick: ad,
  predecessorWeights: Ku,
  range: ps,
  removeEmptyRanks: ed,
  simplify: Xu,
  successorWeights: Uu,
  time: od,
  uniqueId: hs,
  zipObject: Wr
};
function us(e, t, n, r) {
  for (var o = r; e.hasNode(o); )
    o = hs(r);
  return n.dummy = t, e.setNode(o, n), o;
}
function Xu(e) {
  let t = new cs().setGraph(e.graph());
  return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
    let r = t.edge(n.v, n.w) || { weight: 0, minlen: 1 }, o = e.edge(n);
    t.setEdge(n.v, n.w, {
      weight: r.weight + o.weight,
      minlen: Math.max(r.minlen, o.minlen)
    });
  }), t;
}
function qu(e) {
  let t = new cs({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((n) => {
    e.children(n).length || t.setNode(n, e.node(n));
  }), e.edges().forEach((n) => {
    t.setEdge(n, e.edge(n));
  }), t;
}
function Uu(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.outEdges(n).forEach((o) => {
      r[o.w] = (r[o.w] || 0) + e.edge(o).weight;
    }), r;
  });
  return Wr(e.nodes(), t);
}
function Ku(e) {
  let t = e.nodes().map((n) => {
    let r = {};
    return e.inEdges(n).forEach((o) => {
      r[o.v] = (r[o.v] || 0) + e.edge(o).weight;
    }), r;
  });
  return Wr(e.nodes(), t);
}
function Zu(e, t) {
  let n = e.x, r = e.y, o = t.x - n, i = t.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i)
    throw new Error("Not possible to find intersection inside of the rectangle");
  let l, c;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, c = a) : (o < 0 && (s = -s), l = s, c = s * i / o), { x: n + l, y: r + c };
}
function Qu(e) {
  let t = ps(fs(e) + 1).map(() => []);
  return e.nodes().forEach((n) => {
    let r = e.node(n), o = r.rank;
    o !== void 0 && (t[o][r.order] = n);
  }), t;
}
function Ju(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), n = Dn(Math.min, t);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= n);
  });
}
function ed(e) {
  let t = e.nodes().map((s) => e.node(s).rank), n = Dn(Math.min, t), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - n;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function td(e, t, n, r) {
  let o = {
    width: 0,
    height: 0
  };
  return arguments.length >= 4 && (o.rank = n, o.order = r), us(e, "border", o, t);
}
function nd(e, t = ds) {
  const n = [];
  for (let r = 0; r < e.length; r += t) {
    const o = e.slice(r, r + t);
    n.push(o);
  }
  return n;
}
const ds = 65535;
function Dn(e, t) {
  if (t.length > ds) {
    const n = nd(t);
    return e.apply(null, n.map((r) => e.apply(null, r)));
  } else
    return e.apply(null, t);
}
function fs(e) {
  const n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return Dn(Math.max, n);
}
function rd(e, t) {
  let n = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    t(r) ? n.lhs.push(r) : n.rhs.push(r);
  }), n;
}
function od(e, t) {
  let n = Date.now();
  try {
    return t();
  } finally {
    console.log(e + " time: " + (Date.now() - n) + "ms");
  }
}
function id(e, t) {
  return t();
}
let sd = 0;
function hs(e) {
  var t = ++sd;
  return e + ("" + t);
}
function ps(e, t, n = 1) {
  t == null && (t = e, e = 0);
  let r = (i) => i < t;
  n < 0 && (r = (i) => t < i);
  const o = [];
  for (let i = e; r(i); i += n)
    o.push(i);
  return o;
}
function ad(e, t) {
  const n = {};
  for (const r of t)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function ld(e, t) {
  let n = t;
  return typeof t == "string" && (n = (r) => r[t]), Object.entries(e).reduce((r, [o, i]) => (r[o] = n(i, o), r), {});
}
function Wr(e, t) {
  return e.reduce((n, r, o) => (n[r] = t[o], n), {});
}
let cd = Bu, ud = pe.uniqueId;
var dd = {
  run: fd,
  undo: pd
};
function fd(e) {
  (e.graph().acyclicer === "greedy" ? cd(e, n(e)) : hd(e)).forEach((r) => {
    let o = e.edge(r);
    e.removeEdge(r), o.forwardName = r.name, o.reversed = !0, e.setEdge(r.w, r.v, o, ud("rev"));
  });
  function n(r) {
    return (o) => r.edge(o).weight;
  }
}
function hd(e) {
  let t = [], n = {}, r = {};
  function o(i) {
    Object.hasOwn(r, i) || (r[i] = !0, n[i] = !0, e.outEdges(i).forEach((s) => {
      Object.hasOwn(n, s.w) ? t.push(s) : o(s.w);
    }), delete n[i]);
  }
  return e.nodes().forEach(o), t;
}
function pd(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.reversed) {
      e.removeEdge(t);
      let r = n.forwardName;
      delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
    }
  });
}
let gd = pe;
var md = {
  run: yd,
  undo: bd
};
function yd(e) {
  e.graph().dummyChains = [], e.edges().forEach((t) => wd(e, t));
}
function wd(e, t) {
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
    }, c = gd.addDummyNode(e, "edge", u, "_d"), r === l && (u.width = a.width, u.height = a.height, u.dummy = "edge-label", u.labelpos = a.labelpos), e.setEdge(n, c, { weight: a.weight }, s), f === 0 && e.graph().dummyChains.push(c), n = c;
  e.setEdge(n, o, { weight: a.weight }, s);
}
function bd(e) {
  e.graph().dummyChains.forEach((t) => {
    let n = e.node(t), r = n.edgeLabel, o;
    for (e.setEdge(n.edgeObj, r); n.dummy; )
      o = e.successors(t)[0], e.removeNode(t), r.points.push({ x: n.x, y: n.y }), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = o, n = e.node(t);
  });
}
const { applyWithChunking: xd } = pe;
var Rn = {
  longestPath: vd,
  slack: _d
};
function vd(e) {
  var t = {};
  function n(r) {
    var o = e.node(r);
    if (Object.hasOwn(t, r))
      return o.rank;
    t[r] = !0;
    let i = e.outEdges(r).map((a) => a == null ? Number.POSITIVE_INFINITY : n(a.w) - e.edge(a).minlen);
    var s = xd(Math.min, i);
    return s === Number.POSITIVE_INFINITY && (s = 0), o.rank = s;
  }
  e.sources().forEach(n);
}
function _d(e, t) {
  return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var Ed = Ie.Graph, vn = Rn.slack, gs = kd;
function kd(e) {
  var t = new Ed({ directed: !1 }), n = e.nodes()[0], r = e.nodeCount();
  t.setNode(n, {});
  for (var o, i; Sd(t, e) < r; )
    o = Nd(t, e), i = t.hasNode(o.v) ? vn(e, o) : -vn(e, o), Cd(t, e, i);
  return t;
}
function Sd(e, t) {
  function n(r) {
    t.nodeEdges(r).forEach((o) => {
      var i = o.v, s = r === i ? o.w : i;
      !e.hasNode(s) && !vn(t, o) && (e.setNode(s, {}), e.setEdge(r, s, {}), n(s));
    });
  }
  return e.nodes().forEach(n), e.nodeCount();
}
function Nd(e, t) {
  return t.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = vn(t, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function Cd(e, t, n) {
  e.nodes().forEach((r) => t.node(r).rank += n);
}
var Md = gs, Mo = Rn.slack, Id = Rn.longestPath, $d = Ie.alg.preorder, Ad = Ie.alg.postorder, Td = pe.simplify, Ld = ht;
ht.initLowLimValues = jr;
ht.initCutValues = Yr;
ht.calcCutValue = ms;
ht.leaveEdge = ws;
ht.enterEdge = bs;
ht.exchangeEdges = xs;
function ht(e) {
  e = Td(e), Id(e);
  var t = Md(e);
  jr(t), Yr(t, e);
  for (var n, r; n = ws(t); )
    r = bs(t, e, n), xs(t, e, n, r);
}
function Yr(e, t) {
  var n = Ad(e, e.nodes());
  n = n.slice(0, n.length - 1), n.forEach((r) => zd(e, t, r));
}
function zd(e, t, n) {
  var r = e.node(n), o = r.parent;
  e.edge(n, o).cutvalue = ms(e, t, n);
}
function ms(e, t, n) {
  var r = e.node(n), o = r.parent, i = !0, s = t.edge(n, o), a = 0;
  return s || (i = !1, s = t.edge(o, n)), a = s.weight, t.nodeEdges(n).forEach((l) => {
    var c = l.v === n, u = c ? l.w : l.v;
    if (u !== o) {
      var f = c === i, d = t.edge(l).weight;
      if (a += f ? d : -d, Pd(e, n, u)) {
        var h = e.edge(n, u).cutvalue;
        a += f ? -h : h;
      }
    }
  }), a;
}
function jr(e, t) {
  arguments.length < 2 && (t = e.nodes()[0]), ys(e, {}, 1, t);
}
function ys(e, t, n, r, o) {
  var i = n, s = e.node(r);
  return t[r] = !0, e.neighbors(r).forEach((a) => {
    Object.hasOwn(t, a) || (n = ys(e, t, n, a, r));
  }), s.low = i, s.lim = n++, o ? s.parent = o : delete s.parent, n;
}
function ws(e) {
  return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function bs(e, t, n) {
  var r = n.v, o = n.w;
  t.hasEdge(r, o) || (r = n.w, o = n.v);
  var i = e.node(r), s = e.node(o), a = i, l = !1;
  i.lim > s.lim && (a = s, l = !0);
  var c = t.edges().filter((u) => l === Io(e, e.node(u.v), a) && l !== Io(e, e.node(u.w), a));
  return c.reduce((u, f) => Mo(t, f) < Mo(t, u) ? f : u);
}
function xs(e, t, n, r) {
  var o = n.v, i = n.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), jr(e), Yr(e, t), Od(e, t);
}
function Od(e, t) {
  var n = e.nodes().find((o) => !t.node(o).parent), r = $d(e, n);
  r = r.slice(1), r.forEach((o) => {
    var i = e.node(o).parent, s = t.edge(o, i), a = !1;
    s || (s = t.edge(i, o), a = !0), t.node(o).rank = t.node(i).rank + (a ? s.minlen : -s.minlen);
  });
}
function Pd(e, t, n) {
  return e.hasEdge(t, n);
}
function Io(e, t, n) {
  return n.low <= t.lim && t.lim <= n.lim;
}
var Dd = Rn, vs = Dd.longestPath, Rd = gs, Hd = Ld, Vd = Bd;
function Bd(e) {
  var t = e.graph().ranker;
  if (t instanceof Function)
    return t(e);
  switch (e.graph().ranker) {
    case "network-simplex":
      $o(e);
      break;
    case "tight-tree":
      Wd(e);
      break;
    case "longest-path":
      Fd(e);
      break;
    case "none":
      break;
    default:
      $o(e);
  }
}
var Fd = vs;
function Wd(e) {
  vs(e), Rd(e);
}
function $o(e) {
  Hd(e);
}
var Yd = jd;
function jd(e) {
  let t = Xd(e);
  e.graph().dummyChains.forEach((n) => {
    let r = e.node(n), o = r.edgeObj, i = Gd(e, t, o.v, o.w), s = i.path, a = i.lca, l = 0, c = s[l], u = !0;
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
function Gd(e, t, n, r) {
  let o = [], i = [], s = Math.min(t[n].low, t[r].low), a = Math.max(t[n].lim, t[r].lim), l, c;
  l = n;
  do
    l = e.parent(l), o.push(l);
  while (l && (t[l].low > s || a > t[l].lim));
  for (c = l, l = r; (l = e.parent(l)) !== c; )
    i.push(l);
  return { path: o.concat(i.reverse()), lca: c };
}
function Xd(e) {
  let t = {}, n = 0;
  function r(o) {
    let i = n;
    e.children(o).forEach(r), t[o] = { low: i, lim: n++ };
  }
  return e.children().forEach(r), t;
}
let _n = pe;
var qd = {
  run: Ud,
  cleanup: Qd
};
function Ud(e) {
  let t = _n.addDummyNode(e, "root", {}, "_root"), n = Kd(e), r = Object.values(n), o = _n.applyWithChunking(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = t, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = Zd(e) + 1;
  e.children().forEach((a) => _s(e, t, i, s, o, n, a)), e.graph().nodeRankFactor = i;
}
function _s(e, t, n, r, o, i, s) {
  let a = e.children(s);
  if (!a.length) {
    s !== t && e.setEdge(t, s, { weight: 0, minlen: n });
    return;
  }
  let l = _n.addBorderNode(e, "_bt"), c = _n.addBorderNode(e, "_bb"), u = e.node(s);
  e.setParent(l, s), u.borderTop = l, e.setParent(c, s), u.borderBottom = c, a.forEach((f) => {
    _s(e, t, n, r, o, i, f);
    let d = e.node(f), h = d.borderTop ? d.borderTop : f, p = d.borderBottom ? d.borderBottom : f, w = d.borderTop ? r : 2 * r, b = h !== p ? 1 : o - i[s] + 1;
    e.setEdge(l, h, {
      weight: w,
      minlen: b,
      nestingEdge: !0
    }), e.setEdge(p, c, {
      weight: w,
      minlen: b,
      nestingEdge: !0
    });
  }), e.parent(s) || e.setEdge(t, l, { weight: 0, minlen: o + i[s] });
}
function Kd(e) {
  var t = {};
  function n(r, o) {
    var i = e.children(r);
    i && i.length && i.forEach((s) => n(s, o + 1)), t[r] = o;
  }
  return e.children().forEach((r) => n(r, 1)), t;
}
function Zd(e) {
  return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function Qd(e) {
  var t = e.graph();
  e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((n) => {
    var r = e.edge(n);
    r.nestingEdge && e.removeEdge(n);
  });
}
let Jd = pe;
var ef = tf;
function tf(e) {
  function t(n) {
    let r = e.children(n), o = e.node(n);
    if (r.length && r.forEach(t), Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i)
        Ao(e, "borderLeft", "_bl", n, o, i), Ao(e, "borderRight", "_br", n, o, i);
    }
  }
  e.children().forEach(t);
}
function Ao(e, t, n, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: t }, a = o[t][i - 1], l = Jd.addDummyNode(e, "border", s, n);
  o[t][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
var nf = {
  adjust: rf,
  undo: of
};
function rf(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "lr" || t === "rl") && Es(e);
}
function of(e) {
  let t = e.graph().rankdir.toLowerCase();
  (t === "bt" || t === "rl") && sf(e), (t === "lr" || t === "rl") && (af(e), Es(e));
}
function Es(e) {
  e.nodes().forEach((t) => To(e.node(t))), e.edges().forEach((t) => To(e.edge(t)));
}
function To(e) {
  let t = e.width;
  e.width = e.height, e.height = t;
}
function sf(e) {
  e.nodes().forEach((t) => ir(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(ir), Object.hasOwn(n, "y") && ir(n);
  });
}
function ir(e) {
  e.y = -e.y;
}
function af(e) {
  e.nodes().forEach((t) => sr(e.node(t))), e.edges().forEach((t) => {
    let n = e.edge(t);
    n.points.forEach(sr), Object.hasOwn(n, "x") && sr(n);
  });
}
function sr(e) {
  let t = e.x;
  e.x = e.y, e.y = t;
}
let Lo = pe;
var lf = cf;
function cf(e) {
  let t = {}, n = e.nodes().filter((l) => !e.children(l).length), r = n.map((l) => e.node(l).rank), o = Lo.applyWithChunking(Math.max, r), i = Lo.range(o + 1).map(() => []);
  function s(l) {
    if (t[l]) return;
    t[l] = !0;
    let c = e.node(l);
    i[c.rank].push(l), e.successors(l).forEach(s);
  }
  return n.sort((l, c) => e.node(l).rank - e.node(c).rank).forEach(s), i;
}
let uf = pe.zipObject;
var df = ff;
function ff(e, t) {
  let n = 0;
  for (let r = 1; r < t.length; ++r)
    n += hf(e, t[r - 1], t[r]);
  return n;
}
function hf(e, t, n) {
  let r = uf(n, n.map((c, u) => u)), o = t.flatMap((c) => e.outEdges(c).map((u) => ({ pos: r[u.w], weight: e.edge(u).weight })).sort((u, f) => u.pos - f.pos)), i = 1;
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
var pf = gf;
function gf(e, t = []) {
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
let mf = pe;
var yf = wf;
function wf(e, t) {
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
  return bf(r);
}
function bf(e) {
  let t = [];
  function n(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && xf(o, i);
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
  return t.filter((o) => !o.merged).map((o) => mf.pick(o, ["vs", "i", "barycenter", "weight"]));
}
function xf(e, t) {
  let n = 0, r = 0;
  e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
let vf = pe;
var _f = Ef;
function Ef(e, t) {
  let n = vf.partition(e, (u) => Object.hasOwn(u, "barycenter")), r = n.lhs, o = n.rhs.sort((u, f) => f.i - u.i), i = [], s = 0, a = 0, l = 0;
  r.sort(kf(!!t)), l = zo(i, o, l), r.forEach((u) => {
    l += u.vs.length, i.push(u.vs), s += u.barycenter * u.weight, a += u.weight, l = zo(i, o, l);
  });
  let c = { vs: i.flat(!0) };
  return a && (c.barycenter = s / a, c.weight = a), c;
}
function zo(e, t, n) {
  let r;
  for (; t.length && (r = t[t.length - 1]).i <= n; )
    t.pop(), e.push(r.vs), n++;
  return n;
}
function kf(e) {
  return (t, n) => t.barycenter < n.barycenter ? -1 : t.barycenter > n.barycenter ? 1 : e ? n.i - t.i : t.i - n.i;
}
let Sf = pf, Nf = yf, Cf = _f;
var Mf = ks;
function ks(e, t, n, r) {
  let o = e.children(t), i = e.node(t), s = i ? i.borderLeft : void 0, a = i ? i.borderRight : void 0, l = {};
  s && (o = o.filter((d) => d !== s && d !== a));
  let c = Sf(e, o);
  c.forEach((d) => {
    if (e.children(d.v).length) {
      let h = ks(e, d.v, n, r);
      l[d.v] = h, Object.hasOwn(h, "barycenter") && $f(d, h);
    }
  });
  let u = Nf(c, n);
  If(u, l);
  let f = Cf(u, r);
  if (s && (f.vs = [s, f.vs, a].flat(!0), e.predecessors(s).length)) {
    let d = e.node(e.predecessors(s)[0]), h = e.node(e.predecessors(a)[0]);
    Object.hasOwn(f, "barycenter") || (f.barycenter = 0, f.weight = 0), f.barycenter = (f.barycenter * f.weight + d.order + h.order) / (f.weight + 2), f.weight += 2;
  }
  return f;
}
function If(e, t) {
  e.forEach((n) => {
    n.vs = n.vs.flatMap((r) => t[r] ? t[r].vs : r);
  });
}
function $f(e, t) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight) : (e.barycenter = t.barycenter, e.weight = t.weight);
}
let Af = Ie.Graph, Tf = pe;
var Lf = zf;
function zf(e, t, n, r) {
  r || (r = e.nodes());
  let o = Of(e), i = new Af({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
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
function Of(e) {
  for (var t; e.hasNode(t = Tf.uniqueId("_root")); ) ;
  return t;
}
var Pf = Df;
function Df(e, t, n) {
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
let Rf = lf, Hf = df, Vf = Mf, Bf = Lf, Ff = Pf, Wf = Ie.Graph, nn = pe;
var Yf = Ss;
function Ss(e, t) {
  if (t && typeof t.customOrder == "function") {
    t.customOrder(e, Ss);
    return;
  }
  let n = nn.maxRank(e), r = Oo(e, nn.range(1, n + 1), "inEdges"), o = Oo(e, nn.range(n - 1, -1, -1), "outEdges"), i = Rf(e);
  if (Po(e, i), t && t.disableOptimalOrderHeuristic)
    return;
  let s = Number.POSITIVE_INFINITY, a;
  for (let l = 0, c = 0; c < 4; ++l, ++c) {
    jf(l % 2 ? r : o, l % 4 >= 2), i = nn.buildLayerMatrix(e);
    let u = Hf(e, i);
    u < s && (c = 0, a = Object.assign({}, i), s = u);
  }
  Po(e, a);
}
function Oo(e, t, n) {
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
    return Bf(e, i, n, r.get(i) || []);
  });
}
function jf(e, t) {
  let n = new Wf();
  e.forEach(function(r) {
    let o = r.graph().root, i = Vf(r, o, n, t);
    i.vs.forEach((s, a) => r.node(s).order = a), Ff(r, n, i.vs);
  });
}
function Po(e, t) {
  Object.values(t).forEach((n) => n.forEach((r, o) => e.node(r).order = o));
}
let Gf = Ie.Graph, Fe = pe;
var Xf = {
  positionX: oh
};
function qf(e, t) {
  let n = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, c = i[i.length - 1];
    return i.forEach((u, f) => {
      let d = Kf(e, u), h = d ? e.node(d).order : l;
      (d || u === c) && (i.slice(a, f + 1).forEach((p) => {
        e.predecessors(p).forEach((w) => {
          let b = e.node(w), g = b.order;
          (g < s || h < g) && !(b.dummy && e.node(p).dummy) && Ns(n, w, p);
        });
      }), a = f + 1, s = h);
    }), i;
  }
  return t.length && t.reduce(r), n;
}
function Uf(e, t) {
  let n = {};
  function r(i, s, a, l, c) {
    let u;
    Fe.range(s, a).forEach((f) => {
      u = i[f], e.node(u).dummy && e.predecessors(u).forEach((d) => {
        let h = e.node(d);
        h.dummy && (h.order < l || h.order > c) && Ns(n, d, u);
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
function Kf(e, t) {
  if (e.node(t).dummy)
    return e.predecessors(t).find((n) => e.node(n).dummy);
}
function Ns(e, t, n) {
  if (t > n) {
    let o = t;
    t = n, n = o;
  }
  let r = e[t];
  r || (e[t] = r = {}), r[n] = !0;
}
function Zf(e, t, n) {
  if (t > n) {
    let r = t;
    t = n, n = r;
  }
  return !!e[t] && Object.hasOwn(e[t], n);
}
function Qf(e, t, n, r) {
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
          i[c] === c && l < s[p] && !Zf(n, c, p) && (i[p] = c, i[c] = o[c] = o[p], l = s[p]);
        }
      }
    });
  }), { root: o, align: i };
}
function Jf(e, t, n, r, o) {
  let i = {}, s = eh(e, t, n, o), a = o ? "borderLeft" : "borderRight";
  function l(f, d) {
    let h = s.nodes(), p = h.pop(), w = {};
    for (; p; )
      w[p] ? f(p) : (w[p] = !0, h.push(p), h = h.concat(d(p))), p = h.pop();
  }
  function c(f) {
    i[f] = s.inEdges(f).reduce((d, h) => Math.max(d, i[h.v] + s.edge(h)), 0);
  }
  function u(f) {
    let d = s.outEdges(f).reduce((p, w) => Math.min(p, i[w.w] - s.edge(w)), Number.POSITIVE_INFINITY), h = e.node(f);
    d !== Number.POSITIVE_INFINITY && h.borderType !== a && (i[f] = Math.max(i[f], d));
  }
  return l(c, s.predecessors.bind(s)), l(u, s.successors.bind(s)), Object.keys(r).forEach((f) => i[f] = i[n[f]]), i;
}
function eh(e, t, n, r) {
  let o = new Gf(), i = e.graph(), s = ih(i.nodesep, i.edgesep, r);
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
function th(e, t) {
  return Object.values(t).reduce((n, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let c = sh(e, a) / 2;
      o = Math.max(l + c, o), i = Math.min(l - c, i);
    });
    const s = o - i;
    return s < n[0] && (n = [s, r]), n;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function nh(e, t) {
  let n = Object.values(t), r = Fe.applyWithChunking(Math.min, n), o = Fe.applyWithChunking(Math.max, n);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (l === t) return;
      let c = Object.values(l), u = r - Fe.applyWithChunking(Math.min, c);
      s !== "l" && (u = o - Fe.applyWithChunking(Math.max, c)), u && (e[a] = Fe.mapValues(l, (f) => f + u));
    });
  });
}
function rh(e, t) {
  return Fe.mapValues(e.ul, (n, r) => {
    if (t)
      return e[t.toLowerCase()][r];
    {
      let o = Object.values(e).map((i) => i[r]).sort((i, s) => i - s);
      return (o[1] + o[2]) / 2;
    }
  });
}
function oh(e) {
  let t = Fe.buildLayerMatrix(e), n = Object.assign(
    qf(e, t),
    Uf(e, t)
  ), r = {}, o;
  ["u", "d"].forEach((s) => {
    o = s === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((a) => {
      a === "r" && (o = o.map((f) => Object.values(f).reverse()));
      let l = (s === "u" ? e.predecessors : e.successors).bind(e), c = Qf(e, o, n, l), u = Jf(
        e,
        o,
        c.root,
        c.align,
        a === "r"
      );
      a === "r" && (u = Fe.mapValues(u, (f) => -f)), r[s + a] = u;
    });
  });
  let i = th(e, r);
  return nh(r, i), rh(r, e.graph().align);
}
function ih(e, t, n) {
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
function sh(e, t) {
  return e.node(t).width;
}
let Cs = pe, ah = Xf.positionX;
var lh = ch;
function ch(e) {
  e = Cs.asNonCompoundGraph(e), uh(e), Object.entries(ah(e)).forEach(([t, n]) => e.node(t).x = n);
}
function uh(e) {
  let t = Cs.buildLayerMatrix(e), n = e.graph().ranksep, r = 0;
  t.forEach((o) => {
    const i = o.reduce((s, a) => {
      const l = e.node(a).height;
      return s > l ? s : l;
    }, 0);
    o.forEach((s) => e.node(s).y = r + i / 2), r += i + n;
  });
}
let Do = dd, Ro = md, dh = Vd, fh = pe.normalizeRanks, hh = Yd, ph = pe.removeEmptyRanks, Ho = qd, gh = ef, Vo = nf, mh = Yf, yh = lh, ve = pe, wh = Ie.Graph;
var bh = xh;
function xh(e, t) {
  let n = t && t.debugTiming ? ve.time : ve.notime;
  n("layout", () => {
    let r = n("  buildLayoutGraph", () => $h(e));
    n("  runLayout", () => vh(r, n, t)), n("  updateInputGraph", () => _h(e, r));
  });
}
function vh(e, t, n) {
  t("    makeSpaceForEdgeLabels", () => Ah(e)), t("    removeSelfEdges", () => Vh(e)), t("    acyclic", () => Do.run(e)), t("    nestingGraph.run", () => Ho.run(e)), t("    rank", () => dh(ve.asNonCompoundGraph(e))), t("    injectEdgeLabelProxies", () => Th(e)), t("    removeEmptyRanks", () => ph(e)), t("    nestingGraph.cleanup", () => Ho.cleanup(e)), t("    normalizeRanks", () => fh(e)), t("    assignRankMinMax", () => Lh(e)), t("    removeEdgeLabelProxies", () => zh(e)), t("    normalize.run", () => Ro.run(e)), t("    parentDummyChains", () => hh(e)), t("    addBorderSegments", () => gh(e)), t("    order", () => mh(e, n)), t("    insertSelfEdges", () => Bh(e)), t("    adjustCoordinateSystem", () => Vo.adjust(e)), t("    position", () => yh(e)), t("    positionSelfEdges", () => Fh(e)), t("    removeBorderNodes", () => Hh(e)), t("    normalize.undo", () => Ro.undo(e)), t("    fixupEdgeLabelCoords", () => Dh(e)), t("    undoCoordinateSystem", () => Vo.undo(e)), t("    translateGraph", () => Oh(e)), t("    assignNodeIntersects", () => Ph(e)), t("    reversePoints", () => Rh(e)), t("    acyclic.undo", () => Do.undo(e));
}
function _h(e, t) {
  e.nodes().forEach((n) => {
    let r = e.node(n), o = t.node(n);
    r && (r.x = o.x, r.y = o.y, r.rank = o.rank, t.children(n).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((n) => {
    let r = e.edge(n), o = t.edge(n);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
let Eh = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], kh = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, Sh = ["acyclicer", "ranker", "rankdir", "align"], Nh = ["width", "height", "rank"], Bo = { width: 0, height: 0 }, Ch = ["minlen", "weight", "width", "height", "labeloffset"], Mh = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
}, Ih = ["labelpos"];
function $h(e) {
  let t = new wh({ multigraph: !0, compound: !0 }), n = lr(e.graph());
  return t.setGraph(Object.assign(
    {},
    kh,
    ar(n, Eh),
    ve.pick(n, Sh)
  )), e.nodes().forEach((r) => {
    let o = lr(e.node(r));
    const i = ar(o, Nh);
    Object.keys(Bo).forEach((s) => {
      i[s] === void 0 && (i[s] = Bo[s]);
    }), t.setNode(r, i), t.setParent(r, e.parent(r));
  }), e.edges().forEach((r) => {
    let o = lr(e.edge(r));
    t.setEdge(r, Object.assign(
      {},
      Mh,
      ar(o, Ch),
      ve.pick(o, Ih)
    ));
  }), t;
}
function Ah(e) {
  let t = e.graph();
  t.ranksep /= 2, e.edges().forEach((n) => {
    let r = e.edge(n);
    r.minlen *= 2, r.labelpos.toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function Th(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    if (n.width && n.height) {
      let r = e.node(t.v), i = { rank: (e.node(t.w).rank - r.rank) / 2 + r.rank, e: t };
      ve.addDummyNode(e, "edge-proxy", i, "_ep");
    }
  });
}
function Lh(e) {
  let t = 0;
  e.nodes().forEach((n) => {
    let r = e.node(n);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
  }), e.graph().maxRank = t;
}
function zh(e) {
  e.nodes().forEach((t) => {
    let n = e.node(t);
    n.dummy === "edge-proxy" && (e.edge(n.e).labelRank = n.rank, e.removeNode(t));
  });
}
function Oh(e) {
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
function Ph(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t), r = e.node(t.v), o = e.node(t.w), i, s;
    n.points ? (i = n.points[0], s = n.points[n.points.length - 1]) : (n.points = [], i = o, s = r), n.points.unshift(ve.intersectRect(r, i)), n.points.push(ve.intersectRect(o, s));
  });
}
function Dh(e) {
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
function Rh(e) {
  e.edges().forEach((t) => {
    let n = e.edge(t);
    n.reversed && n.points.reverse();
  });
}
function Hh(e) {
  e.nodes().forEach((t) => {
    if (e.children(t).length) {
      let n = e.node(t), r = e.node(n.borderTop), o = e.node(n.borderBottom), i = e.node(n.borderLeft[n.borderLeft.length - 1]), s = e.node(n.borderRight[n.borderRight.length - 1]);
      n.width = Math.abs(s.x - i.x), n.height = Math.abs(o.y - r.y), n.x = i.x + n.width / 2, n.y = r.y + n.height / 2;
    }
  }), e.nodes().forEach((t) => {
    e.node(t).dummy === "border" && e.removeNode(t);
  });
}
function Vh(e) {
  e.edges().forEach((t) => {
    if (t.v === t.w) {
      var n = e.node(t.v);
      n.selfEdges || (n.selfEdges = []), n.selfEdges.push({ e: t, label: e.edge(t) }), e.removeEdge(t);
    }
  });
}
function Bh(e) {
  var t = ve.buildLayerMatrix(e);
  t.forEach((n) => {
    var r = 0;
    n.forEach((o, i) => {
      var s = e.node(o);
      s.order = i + r, (s.selfEdges || []).forEach((a) => {
        ve.addDummyNode(e, "selfedge", {
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
function Fh(e) {
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
function ar(e, t) {
  return ve.mapValues(ve.pick(e, t), Number);
}
function lr(e) {
  var t = {};
  return e && Object.entries(e).forEach(([n, r]) => {
    typeof n == "string" && (n = n.toLowerCase()), t[n] = r;
  }), t;
}
let Wh = pe, Yh = Ie.Graph;
var jh = {
  debugOrdering: Gh
};
function Gh(e) {
  let t = Wh.buildLayerMatrix(e), n = new Yh({ compound: !0, multigraph: !0 }).setGraph({});
  return e.nodes().forEach((r) => {
    n.setNode(r, { label: r }), n.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => n.setEdge(r.v, r.w, {}, r.name)), t.forEach((r, o) => {
    let i = "layer" + o;
    n.setNode(i, { rank: "same" }), r.reduce((s, a) => (n.setEdge(s, a, { style: "invis" }), a));
  }), n;
}
var Xh = "1.1.8", qh = {
  graphlib: Ie,
  layout: bh,
  debug: jh,
  util: {
    time: pe.time,
    notime: pe.notime
  },
  version: Xh
};
const En = /* @__PURE__ */ ts(qh);
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
var Uh = { value: () => {
} };
function Hn() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new pn(n);
}
function pn(e) {
  this._ = e;
}
function Kh(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
pn.prototype = Hn.prototype = {
  constructor: pn,
  on: function(e, t) {
    var n = this._, r = Kh(e + "", n), o, i = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++i < s; ) if ((o = (e = r[i]).type) && (o = Zh(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < s; )
      if (o = (e = r[i]).type) n[o] = Fo(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = Fo(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new pn(e);
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
function Zh(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function Fo(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = Uh, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Er = "http://www.w3.org/1999/xhtml";
const Wo = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Er,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Vn(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Wo.hasOwnProperty(t) ? { space: Wo[t], local: e } : e;
}
function Qh(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Er && t.documentElement.namespaceURI === Er ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Jh(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Ms(e) {
  var t = Vn(e);
  return (t.local ? Jh : Qh)(t);
}
function ep() {
}
function Gr(e) {
  return e == null ? ep : function() {
    return this.querySelector(e);
  };
}
function tp(e) {
  typeof e != "function" && (e = Gr(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = new Array(s), l, c, u = 0; u < s; ++u)
      (l = i[u]) && (c = e.call(l, l.__data__, u, i)) && ("__data__" in l && (c.__data__ = l.__data__), a[u] = c);
  return new we(r, this._parents);
}
function np(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function rp() {
  return [];
}
function Is(e) {
  return e == null ? rp : function() {
    return this.querySelectorAll(e);
  };
}
function op(e) {
  return function() {
    return np(e.apply(this, arguments));
  };
}
function ip(e) {
  typeof e == "function" ? e = op(e) : e = Is(e);
  for (var t = this._groups, n = t.length, r = [], o = [], i = 0; i < n; ++i)
    for (var s = t[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (r.push(e.call(l, l.__data__, c, s)), o.push(l));
  return new we(r, o);
}
function $s(e) {
  return function() {
    return this.matches(e);
  };
}
function As(e) {
  return function(t) {
    return t.matches(e);
  };
}
var sp = Array.prototype.find;
function ap(e) {
  return function() {
    return sp.call(this.children, e);
  };
}
function lp() {
  return this.firstElementChild;
}
function cp(e) {
  return this.select(e == null ? lp : ap(typeof e == "function" ? e : As(e)));
}
var up = Array.prototype.filter;
function dp() {
  return Array.from(this.children);
}
function fp(e) {
  return function() {
    return up.call(this.children, e);
  };
}
function hp(e) {
  return this.selectAll(e == null ? dp : fp(typeof e == "function" ? e : As(e)));
}
function pp(e) {
  typeof e != "function" && (e = $s(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new we(r, this._parents);
}
function Ts(e) {
  return new Array(e.length);
}
function gp() {
  return new we(this._enter || this._groups.map(Ts), this._parents);
}
function kn(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
kn.prototype = {
  constructor: kn,
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
function mp(e) {
  return function() {
    return e;
  };
}
function yp(e, t, n, r, o, i) {
  for (var s = 0, a, l = t.length, c = i.length; s < c; ++s)
    (a = t[s]) ? (a.__data__ = i[s], r[s] = a) : n[s] = new kn(e, i[s]);
  for (; s < l; ++s)
    (a = t[s]) && (o[s] = a);
}
function wp(e, t, n, r, o, i, s) {
  var a, l, c = /* @__PURE__ */ new Map(), u = t.length, f = i.length, d = new Array(u), h;
  for (a = 0; a < u; ++a)
    (l = t[a]) && (d[a] = h = s.call(l, l.__data__, a, t) + "", c.has(h) ? o[a] = l : c.set(h, l));
  for (a = 0; a < f; ++a)
    h = s.call(e, i[a], a, i) + "", (l = c.get(h)) ? (r[a] = l, l.__data__ = i[a], c.delete(h)) : n[a] = new kn(e, i[a]);
  for (a = 0; a < u; ++a)
    (l = t[a]) && c.get(d[a]) === l && (o[a] = l);
}
function bp(e) {
  return e.__data__;
}
function xp(e, t) {
  if (!arguments.length) return Array.from(this, bp);
  var n = t ? wp : yp, r = this._parents, o = this._groups;
  typeof e != "function" && (e = mp(e));
  for (var i = o.length, s = new Array(i), a = new Array(i), l = new Array(i), c = 0; c < i; ++c) {
    var u = r[c], f = o[c], d = f.length, h = vp(e.call(u, u && u.__data__, c, r)), p = h.length, w = a[c] = new Array(p), b = s[c] = new Array(p), g = l[c] = new Array(d);
    n(u, f, w, b, g, h, t);
    for (var _ = 0, m = 0, x, k; _ < p; ++_)
      if (x = w[_]) {
        for (_ >= m && (m = _ + 1); !(k = b[m]) && ++m < p; ) ;
        x._next = k || null;
      }
  }
  return s = new we(s, r), s._enter = a, s._exit = l, s;
}
function vp(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function _p() {
  return new we(this._exit || this._groups.map(Ts), this._parents);
}
function Ep(e, t, n) {
  var r = this.enter(), o = this, i = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (o = t(o), o && (o = o.selection())), n == null ? i.remove() : n(i), r && o ? r.merge(o).order() : o;
}
function kp(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, o = n.length, i = r.length, s = Math.min(o, i), a = new Array(o), l = 0; l < s; ++l)
    for (var c = n[l], u = r[l], f = c.length, d = a[l] = new Array(f), h, p = 0; p < f; ++p)
      (h = c[p] || u[p]) && (d[p] = h);
  for (; l < o; ++l)
    a[l] = n[l];
  return new we(a, this._parents);
}
function Sp() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], o = r.length - 1, i = r[o], s; --o >= 0; )
      (s = r[o]) && (i && s.compareDocumentPosition(i) ^ 4 && i.parentNode.insertBefore(s, i), i = s);
  return this;
}
function Np(e) {
  e || (e = Cp);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, r = n.length, o = new Array(r), i = 0; i < r; ++i) {
    for (var s = n[i], a = s.length, l = o[i] = new Array(a), c, u = 0; u < a; ++u)
      (c = s[u]) && (l[u] = c);
    l.sort(t);
  }
  return new we(o, this._parents).order();
}
function Cp(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Mp() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Ip() {
  return Array.from(this);
}
function $p() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length; o < i; ++o) {
      var s = r[o];
      if (s) return s;
    }
  return null;
}
function Ap() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Tp() {
  return !this.node();
}
function Lp(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var o = t[n], i = 0, s = o.length, a; i < s; ++i)
      (a = o[i]) && e.call(a, a.__data__, i, o);
  return this;
}
function zp(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Op(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Pp(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Dp(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Rp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Hp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Vp(e, t) {
  var n = Vn(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Op : zp : typeof t == "function" ? n.local ? Hp : Rp : n.local ? Dp : Pp)(n, t));
}
function Ls(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Bp(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Fp(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Wp(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function Yp(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Bp : typeof t == "function" ? Wp : Fp)(e, t, n ?? "")) : wt(this.node(), e);
}
function wt(e, t) {
  return e.style.getPropertyValue(t) || Ls(e).getComputedStyle(e, null).getPropertyValue(t);
}
function jp(e) {
  return function() {
    delete this[e];
  };
}
function Gp(e, t) {
  return function() {
    this[e] = t;
  };
}
function Xp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function qp(e, t) {
  return arguments.length > 1 ? this.each((t == null ? jp : typeof t == "function" ? Xp : Gp)(e, t)) : this.node()[e];
}
function zs(e) {
  return e.trim().split(/^|\s+/);
}
function Xr(e) {
  return e.classList || new Os(e);
}
function Os(e) {
  this._node = e, this._names = zs(e.getAttribute("class") || "");
}
Os.prototype = {
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
function Ps(e, t) {
  for (var n = Xr(e), r = -1, o = t.length; ++r < o; ) n.add(t[r]);
}
function Ds(e, t) {
  for (var n = Xr(e), r = -1, o = t.length; ++r < o; ) n.remove(t[r]);
}
function Up(e) {
  return function() {
    Ps(this, e);
  };
}
function Kp(e) {
  return function() {
    Ds(this, e);
  };
}
function Zp(e, t) {
  return function() {
    (t.apply(this, arguments) ? Ps : Ds)(this, e);
  };
}
function Qp(e, t) {
  var n = zs(e + "");
  if (arguments.length < 2) {
    for (var r = Xr(this.node()), o = -1, i = n.length; ++o < i; ) if (!r.contains(n[o])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Zp : t ? Up : Kp)(n, t));
}
function Jp() {
  this.textContent = "";
}
function eg(e) {
  return function() {
    this.textContent = e;
  };
}
function tg(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function ng(e) {
  return arguments.length ? this.each(e == null ? Jp : (typeof e == "function" ? tg : eg)(e)) : this.node().textContent;
}
function rg() {
  this.innerHTML = "";
}
function og(e) {
  return function() {
    this.innerHTML = e;
  };
}
function ig(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function sg(e) {
  return arguments.length ? this.each(e == null ? rg : (typeof e == "function" ? ig : og)(e)) : this.node().innerHTML;
}
function ag() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function lg() {
  return this.each(ag);
}
function cg() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ug() {
  return this.each(cg);
}
function dg(e) {
  var t = typeof e == "function" ? e : Ms(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function fg() {
  return null;
}
function hg(e, t) {
  var n = typeof e == "function" ? e : Ms(e), r = t == null ? fg : typeof t == "function" ? t : Gr(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function pg() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function gg() {
  return this.each(pg);
}
function mg() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function yg() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function wg(e) {
  return this.select(e ? yg : mg);
}
function bg(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function xg(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function vg(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function _g(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, o = t.length, i; n < o; ++n)
        i = t[n], (!e.type || i.type === e.type) && i.name === e.name ? this.removeEventListener(i.type, i.listener, i.options) : t[++r] = i;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function Eg(e, t, n) {
  return function() {
    var r = this.__on, o, i = xg(t);
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
function kg(e, t, n) {
  var r = vg(e + ""), o, i = r.length, s;
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
  for (a = t ? Eg : _g, o = 0; o < i; ++o) this.each(a(r[o], t, n));
  return this;
}
function Rs(e, t, n) {
  var r = Ls(e), o = r.CustomEvent;
  typeof o == "function" ? o = new o(t, n) : (o = r.document.createEvent("Event"), n ? (o.initEvent(t, n.bubbles, n.cancelable), o.detail = n.detail) : o.initEvent(t, !1, !1)), e.dispatchEvent(o);
}
function Sg(e, t) {
  return function() {
    return Rs(this, e, t);
  };
}
function Ng(e, t) {
  return function() {
    return Rs(this, e, t.apply(this, arguments));
  };
}
function Cg(e, t) {
  return this.each((typeof t == "function" ? Ng : Sg)(e, t));
}
function* Mg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], o = 0, i = r.length, s; o < i; ++o)
      (s = r[o]) && (yield s);
}
var Hs = [null];
function we(e, t) {
  this._groups = e, this._parents = t;
}
function qt() {
  return new we([[document.documentElement]], Hs);
}
function Ig() {
  return this;
}
we.prototype = qt.prototype = {
  constructor: we,
  select: tp,
  selectAll: ip,
  selectChild: cp,
  selectChildren: hp,
  filter: pp,
  data: xp,
  enter: gp,
  exit: _p,
  join: Ep,
  merge: kp,
  selection: Ig,
  order: Sp,
  sort: Np,
  call: Mp,
  nodes: Ip,
  node: $p,
  size: Ap,
  empty: Tp,
  each: Lp,
  attr: Vp,
  style: Yp,
  property: qp,
  classed: Qp,
  text: ng,
  html: sg,
  raise: lg,
  lower: ug,
  append: dg,
  insert: hg,
  remove: gg,
  clone: wg,
  datum: bg,
  on: kg,
  dispatch: Cg,
  [Symbol.iterator]: Mg
};
function ye(e) {
  return typeof e == "string" ? new we([[document.querySelector(e)]], [document.documentElement]) : new we([[e]], Hs);
}
function $g(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Ee(e, t) {
  if (e = $g(e), t === void 0 && (t = e.currentTarget), t) {
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
const Ag = { passive: !1 }, Pt = { capture: !0, passive: !1 };
function cr(e) {
  e.stopImmediatePropagation();
}
function mt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Vs(e) {
  var t = e.document.documentElement, n = ye(e).on("dragstart.drag", mt, Pt);
  "onselectstart" in t ? n.on("selectstart.drag", mt, Pt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Bs(e, t) {
  var n = e.document.documentElement, r = ye(e).on("dragstart.drag", null);
  t && (r.on("click.drag", mt, Pt), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const rn = (e) => () => e;
function kr(e, {
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
kr.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Tg(e) {
  return !e.ctrlKey && !e.button;
}
function Lg() {
  return this.parentNode;
}
function zg(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Og() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Fs() {
  var e = Tg, t = Lg, n = zg, r = Og, o = {}, i = Hn("start", "drag", "end"), s = 0, a, l, c, u, f = 0;
  function d(x) {
    x.on("mousedown.drag", h).filter(r).on("touchstart.drag", b).on("touchmove.drag", g, Ag).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, k) {
    if (!(u || !e.call(this, x, k))) {
      var E = m(this, t.call(this, x, k), x, k, "mouse");
      E && (ye(x.view).on("mousemove.drag", p, Pt).on("mouseup.drag", w, Pt), Vs(x.view), cr(x), c = !1, a = x.clientX, l = x.clientY, E("start", x));
    }
  }
  function p(x) {
    if (mt(x), !c) {
      var k = x.clientX - a, E = x.clientY - l;
      c = k * k + E * E > f;
    }
    o.mouse("drag", x);
  }
  function w(x) {
    ye(x.view).on("mousemove.drag mouseup.drag", null), Bs(x.view, c), mt(x), o.mouse("end", x);
  }
  function b(x, k) {
    if (e.call(this, x, k)) {
      var E = x.changedTouches, I = t.call(this, x, k), A = E.length, $, R;
      for ($ = 0; $ < A; ++$)
        (R = m(this, I, x, k, E[$].identifier, E[$])) && (cr(x), R("start", x, E[$]));
    }
  }
  function g(x) {
    var k = x.changedTouches, E = k.length, I, A;
    for (I = 0; I < E; ++I)
      (A = o[k[I].identifier]) && (mt(x), A("drag", x, k[I]));
  }
  function _(x) {
    var k = x.changedTouches, E = k.length, I, A;
    for (u && clearTimeout(u), u = setTimeout(function() {
      u = null;
    }, 500), I = 0; I < E; ++I)
      (A = o[k[I].identifier]) && (cr(x), A("end", x, k[I]));
  }
  function m(x, k, E, I, A, $) {
    var R = i.copy(), L = Ee($ || E, k), H, D, y;
    if ((y = n.call(x, new kr("beforestart", {
      sourceEvent: E,
      target: d,
      identifier: A,
      active: s,
      x: L[0],
      y: L[1],
      dx: 0,
      dy: 0,
      dispatch: R
    }), I)) != null)
      return H = y.x - L[0] || 0, D = y.y - L[1] || 0, function N(S, M, T) {
        var C = L, z;
        switch (S) {
          case "start":
            o[A] = N, z = s++;
            break;
          case "end":
            delete o[A], --s;
          case "drag":
            L = Ee(T || M, k), z = s;
            break;
        }
        R.call(
          S,
          x,
          new kr(S, {
            sourceEvent: M,
            subject: y,
            target: d,
            identifier: A,
            active: z,
            x: L[0] + H,
            y: L[1] + D,
            dx: L[0] - C[0],
            dy: L[1] - C[1],
            dispatch: R
          }),
          I
        );
      };
  }
  return d.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : rn(!!x), d) : e;
  }, d.container = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : rn(x), d) : t;
  }, d.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : rn(x), d) : n;
  }, d.touchable = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : rn(!!x), d) : r;
  }, d.on = function() {
    var x = i.on.apply(i, arguments);
    return x === i ? d : x;
  }, d.clickDistance = function(x) {
    return arguments.length ? (f = (x = +x) * x, d) : Math.sqrt(f);
  }, d;
}
function qr(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ws(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Ut() {
}
var Dt = 0.7, Sn = 1 / Dt, yt = "\\s*([+-]?\\d+)\\s*", Rt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Oe = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Pg = /^#([0-9a-f]{3,8})$/, Dg = new RegExp(`^rgb\\(${yt},${yt},${yt}\\)$`), Rg = new RegExp(`^rgb\\(${Oe},${Oe},${Oe}\\)$`), Hg = new RegExp(`^rgba\\(${yt},${yt},${yt},${Rt}\\)$`), Vg = new RegExp(`^rgba\\(${Oe},${Oe},${Oe},${Rt}\\)$`), Bg = new RegExp(`^hsl\\(${Rt},${Oe},${Oe}\\)$`), Fg = new RegExp(`^hsla\\(${Rt},${Oe},${Oe},${Rt}\\)$`), Yo = {
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
qr(Ut, st, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: jo,
  // Deprecated! Use color.formatHex.
  formatHex: jo,
  formatHex8: Wg,
  formatHsl: Yg,
  formatRgb: Go,
  toString: Go
});
function jo() {
  return this.rgb().formatHex();
}
function Wg() {
  return this.rgb().formatHex8();
}
function Yg() {
  return Ys(this).formatHsl();
}
function Go() {
  return this.rgb().formatRgb();
}
function st(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Pg.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Xo(t) : n === 3 ? new me(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? on(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? on(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Dg.exec(e)) ? new me(t[1], t[2], t[3], 1) : (t = Rg.exec(e)) ? new me(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Hg.exec(e)) ? on(t[1], t[2], t[3], t[4]) : (t = Vg.exec(e)) ? on(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Bg.exec(e)) ? Ko(t[1], t[2] / 100, t[3] / 100, 1) : (t = Fg.exec(e)) ? Ko(t[1], t[2] / 100, t[3] / 100, t[4]) : Yo.hasOwnProperty(e) ? Xo(Yo[e]) : e === "transparent" ? new me(NaN, NaN, NaN, 0) : null;
}
function Xo(e) {
  return new me(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function on(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new me(e, t, n, r);
}
function jg(e) {
  return e instanceof Ut || (e = st(e)), e ? (e = e.rgb(), new me(e.r, e.g, e.b, e.opacity)) : new me();
}
function Sr(e, t, n, r) {
  return arguments.length === 1 ? jg(e) : new me(e, t, n, r ?? 1);
}
function me(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
qr(me, Sr, Ws(Ut, {
  brighter(e) {
    return e = e == null ? Sn : Math.pow(Sn, e), new me(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Dt : Math.pow(Dt, e), new me(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new me(ot(this.r), ot(this.g), ot(this.b), Nn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: qo,
  // Deprecated! Use color.formatHex.
  formatHex: qo,
  formatHex8: Gg,
  formatRgb: Uo,
  toString: Uo
}));
function qo() {
  return `#${rt(this.r)}${rt(this.g)}${rt(this.b)}`;
}
function Gg() {
  return `#${rt(this.r)}${rt(this.g)}${rt(this.b)}${rt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Uo() {
  const e = Nn(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${ot(this.r)}, ${ot(this.g)}, ${ot(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Nn(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function ot(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function rt(e) {
  return e = ot(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ko(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new ke(e, t, n, r);
}
function Ys(e) {
  if (e instanceof ke) return new ke(e.h, e.s, e.l, e.opacity);
  if (e instanceof Ut || (e = st(e)), !e) return new ke();
  if (e instanceof ke) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, o = Math.min(t, n, r), i = Math.max(t, n, r), s = NaN, a = i - o, l = (i + o) / 2;
  return a ? (t === i ? s = (n - r) / a + (n < r) * 6 : n === i ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? i + o : 2 - i - o, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new ke(s, a, l, e.opacity);
}
function Xg(e, t, n, r) {
  return arguments.length === 1 ? Ys(e) : new ke(e, t, n, r ?? 1);
}
function ke(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
qr(ke, Xg, Ws(Ut, {
  brighter(e) {
    return e = e == null ? Sn : Math.pow(Sn, e), new ke(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Dt : Math.pow(Dt, e), new ke(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, o = 2 * n - r;
    return new me(
      ur(e >= 240 ? e - 240 : e + 120, o, r),
      ur(e, o, r),
      ur(e < 120 ? e + 240 : e - 120, o, r),
      this.opacity
    );
  },
  clamp() {
    return new ke(Zo(this.h), sn(this.s), sn(this.l), Nn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Nn(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Zo(this.h)}, ${sn(this.s) * 100}%, ${sn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Zo(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function sn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function ur(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ur = (e) => () => e;
function qg(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Ug(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function Kg(e) {
  return (e = +e) == 1 ? js : function(t, n) {
    return n - t ? Ug(t, n, e) : Ur(isNaN(t) ? n : t);
  };
}
function js(e, t) {
  var n = t - e;
  return n ? qg(e, n) : Ur(isNaN(e) ? t : e);
}
const Cn = function e(t) {
  var n = Kg(t);
  function r(o, i) {
    var s = n((o = Sr(o)).r, (i = Sr(i)).r), a = n(o.g, i.g), l = n(o.b, i.b), c = js(o.opacity, i.opacity);
    return function(u) {
      return o.r = s(u), o.g = a(u), o.b = l(u), o.opacity = c(u), o + "";
    };
  }
  return r.gamma = e, r;
}(1);
function Zg(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), o;
  return function(i) {
    for (o = 0; o < n; ++o) r[o] = e[o] * (1 - i) + t[o] * i;
    return r;
  };
}
function Qg(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Jg(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, o = new Array(r), i = new Array(n), s;
  for (s = 0; s < r; ++s) o[s] = Lt(e[s], t[s]);
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
function Le(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function t0(e, t) {
  var n = {}, r = {}, o;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (o in t)
    o in e ? n[o] = Lt(e[o], t[o]) : r[o] = t[o];
  return function(i) {
    for (o in n) r[o] = n[o](i);
    return r;
  };
}
var Nr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, dr = new RegExp(Nr.source, "g");
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
function Gs(e, t) {
  var n = Nr.lastIndex = dr.lastIndex = 0, r, o, i, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (r = Nr.exec(e)) && (o = dr.exec(t)); )
    (i = o.index) > n && (i = t.slice(n, i), a[s] ? a[s] += i : a[++s] = i), (r = r[0]) === (o = o[0]) ? a[s] ? a[s] += o : a[++s] = o : (a[++s] = null, l.push({ i: s, x: Le(r, o) })), n = dr.lastIndex;
  return n < t.length && (i = t.slice(n), a[s] ? a[s] += i : a[++s] = i), a.length < 2 ? l[0] ? r0(l[0].x) : n0(t) : (t = l.length, function(c) {
    for (var u = 0, f; u < t; ++u) a[(f = l[u]).i] = f.x(c);
    return a.join("");
  });
}
function Lt(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Ur(t) : (n === "number" ? Le : n === "string" ? (r = st(t)) ? (t = r, Cn) : Gs : t instanceof st ? Cn : t instanceof Date ? e0 : Qg(t) ? Zg : Array.isArray(t) ? Jg : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? t0 : Le)(e, t);
}
var Qo = 180 / Math.PI, Cr = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Xs(e, t, n, r, o, i) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * r) && (n -= e * l, r -= t * l), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, l /= a), e * r < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: o,
    translateY: i,
    rotate: Math.atan2(t, e) * Qo,
    skewX: Math.atan(l) * Qo,
    scaleX: s,
    scaleY: a
  };
}
var an;
function o0(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Cr : Xs(t.a, t.b, t.c, t.d, t.e, t.f);
}
function i0(e) {
  return e == null || (an || (an = document.createElementNS("http://www.w3.org/2000/svg", "g")), an.setAttribute("transform", e), !(e = an.transform.baseVal.consolidate())) ? Cr : (e = e.matrix, Xs(e.a, e.b, e.c, e.d, e.e, e.f));
}
function qs(e, t, n, r) {
  function o(c) {
    return c.length ? c.pop() + " " : "";
  }
  function i(c, u, f, d, h, p) {
    if (c !== f || u !== d) {
      var w = h.push("translate(", null, t, null, n);
      p.push({ i: w - 4, x: Le(c, f) }, { i: w - 2, x: Le(u, d) });
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
      var w = h.push(o(h) + "scale(", null, ",", null, ")");
      p.push({ i: w - 4, x: Le(c, f) }, { i: w - 2, x: Le(u, d) });
    } else (f !== 1 || d !== 1) && h.push(o(h) + "scale(" + f + "," + d + ")");
  }
  return function(c, u) {
    var f = [], d = [];
    return c = e(c), u = e(u), i(c.translateX, c.translateY, u.translateX, u.translateY, f, d), s(c.rotate, u.rotate, f, d), a(c.skewX, u.skewX, f, d), l(c.scaleX, c.scaleY, u.scaleX, u.scaleY, f, d), c = u = null, function(h) {
      for (var p = -1, w = d.length, b; ++p < w; ) f[(b = d[p]).i] = b.x(h);
      return f.join("");
    };
  };
}
var s0 = qs(o0, "px, ", "px)", "deg)"), a0 = qs(i0, ", ", ")", ")"), l0 = 1e-12;
function Jo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function c0(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function u0(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const gn = function e(t, n, r) {
  function o(i, s) {
    var a = i[0], l = i[1], c = i[2], u = s[0], f = s[1], d = s[2], h = u - a, p = f - l, w = h * h + p * p, b, g;
    if (w < l0)
      g = Math.log(d / c) / t, b = function(I) {
        return [
          a + I * h,
          l + I * p,
          c * Math.exp(t * I * g)
        ];
      };
    else {
      var _ = Math.sqrt(w), m = (d * d - c * c + r * w) / (2 * c * n * _), x = (d * d - c * c - r * w) / (2 * d * n * _), k = Math.log(Math.sqrt(m * m + 1) - m), E = Math.log(Math.sqrt(x * x + 1) - x);
      g = (E - k) / t, b = function(I) {
        var A = I * g, $ = Jo(k), R = c / (n * _) * ($ * u0(t * A + k) - c0(k));
        return [
          a + R * h,
          l + R * p,
          c * $ / Jo(t * A + k)
        ];
      };
    }
    return b.duration = g * 1e3 * t / Math.SQRT2, b;
  }
  return o.rho = function(i) {
    var s = Math.max(1e-3, +i), a = s * s, l = a * a;
    return e(s, a, l);
  }, o;
}(Math.SQRT2, 2, 4);
var bt = 0, At = 0, Mt = 0, Us = 1e3, Mn, Tt, In = 0, at = 0, Bn = 0, Ht = typeof performance == "object" && performance.now ? performance : Date, Ks = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Kr() {
  return at || (Ks(d0), at = Ht.now() + Bn);
}
function d0() {
  at = 0;
}
function $n() {
  this._call = this._time = this._next = null;
}
$n.prototype = Zs.prototype = {
  constructor: $n,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Kr() : +n) + (t == null ? 0 : +t), !this._next && Tt !== this && (Tt ? Tt._next = this : Mn = this, Tt = this), this._call = e, this._time = n, Mr();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Mr());
  }
};
function Zs(e, t, n) {
  var r = new $n();
  return r.restart(e, t, n), r;
}
function f0() {
  Kr(), ++bt;
  for (var e = Mn, t; e; )
    (t = at - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --bt;
}
function ei() {
  at = (In = Ht.now()) + Bn, bt = At = 0;
  try {
    f0();
  } finally {
    bt = 0, p0(), at = 0;
  }
}
function h0() {
  var e = Ht.now(), t = e - In;
  t > Us && (Bn -= t, In = e);
}
function p0() {
  for (var e, t = Mn, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Mn = n);
  Tt = e, Mr(r);
}
function Mr(e) {
  if (!bt) {
    At && (At = clearTimeout(At));
    var t = e - at;
    t > 24 ? (e < 1 / 0 && (At = setTimeout(ei, e - Ht.now() - Bn)), Mt && (Mt = clearInterval(Mt))) : (Mt || (In = Ht.now(), Mt = setInterval(h0, Us)), bt = 1, Ks(ei));
  }
}
function ti(e, t, n) {
  var r = new $n();
  return t = t == null ? 0 : +t, r.restart((o) => {
    r.stop(), e(o + t);
  }, t, n), r;
}
var g0 = Hn("start", "end", "cancel", "interrupt"), m0 = [], Qs = 0, ni = 1, Ir = 2, mn = 3, ri = 4, $r = 5, yn = 6;
function Fn(e, t, n, r, o, i) {
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
    state: Qs
  });
}
function Zr(e, t) {
  var n = $e(e, t);
  if (n.state > Qs) throw new Error("too late; already scheduled");
  return n;
}
function De(e, t) {
  var n = $e(e, t);
  if (n.state > mn) throw new Error("too late; already running");
  return n;
}
function $e(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function y0(e, t, n) {
  var r = e.__transition, o;
  r[t] = n, n.timer = Zs(i, 0, n.time);
  function i(c) {
    n.state = ni, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var u, f, d, h;
    if (n.state !== ni) return l();
    for (u in r)
      if (h = r[u], h.name === n.name) {
        if (h.state === mn) return ti(s);
        h.state === ri ? (h.state = yn, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete r[u]) : +u < t && (h.state = yn, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete r[u]);
      }
    if (ti(function() {
      n.state === mn && (n.state = ri, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Ir, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Ir) {
      for (n.state = mn, o = new Array(d = n.tween.length), u = 0, f = -1; u < d; ++u)
        (h = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (o[++f] = h);
      o.length = f + 1;
    }
  }
  function a(c) {
    for (var u = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = $r, 1), f = -1, d = o.length; ++f < d; )
      o[f].call(e, u);
    n.state === $r && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = yn, n.timer.stop(), delete r[t];
    for (var c in r) return;
    delete e.__transition;
  }
}
function wn(e, t) {
  var n = e.__transition, r, o, i = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        i = !1;
        continue;
      }
      o = r.state > Ir && r.state < $r, r.state = yn, r.timer.stop(), r.on.call(o ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    i && delete e.__transition;
  }
}
function w0(e) {
  return this.each(function() {
    wn(this, e);
  });
}
function b0(e, t) {
  var n, r;
  return function() {
    var o = De(this, e), i = o.tween;
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
function x0(e, t, n) {
  var r, o;
  if (typeof n != "function") throw new Error();
  return function() {
    var i = De(this, e), s = i.tween;
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
function v0(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = $e(this.node(), n).tween, o = 0, i = r.length, s; o < i; ++o)
      if ((s = r[o]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? b0 : x0)(n, e, t));
}
function Qr(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var o = De(this, r);
    (o.value || (o.value = {}))[t] = n.apply(this, arguments);
  }), function(o) {
    return $e(o, r).value[t];
  };
}
function Js(e, t) {
  var n;
  return (typeof t == "number" ? Le : t instanceof st ? Cn : (n = st(t)) ? (t = n, Cn) : Gs)(e, t);
}
function _0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function E0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function k0(e, t, n) {
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
  var n = Vn(e), r = n === "transform" ? a0 : Js;
  return this.attrTween(e, typeof t == "function" ? (n.local ? C0 : N0)(n, r, Qr(this, "attr." + e, t)) : t == null ? (n.local ? E0 : _0)(n) : (n.local ? S0 : k0)(n, r, t));
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
  var r = Vn(e);
  return this.tween(n, (r.local ? A0 : T0)(r, t));
}
function z0(e, t) {
  return function() {
    Zr(this, e).delay = +t.apply(this, arguments);
  };
}
function O0(e, t) {
  return t = +t, function() {
    Zr(this, e).delay = t;
  };
}
function P0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? z0 : O0)(t, e)) : $e(this.node(), t).delay;
}
function D0(e, t) {
  return function() {
    De(this, e).duration = +t.apply(this, arguments);
  };
}
function R0(e, t) {
  return t = +t, function() {
    De(this, e).duration = t;
  };
}
function H0(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? D0 : R0)(t, e)) : $e(this.node(), t).duration;
}
function V0(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    De(this, e).ease = t;
  };
}
function B0(e) {
  var t = this._id;
  return arguments.length ? this.each(V0(t, e)) : $e(this.node(), t).ease;
}
function F0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    De(this, e).ease = n;
  };
}
function W0(e) {
  if (typeof e != "function") throw new Error();
  return this.each(F0(this._id, e));
}
function Y0(e) {
  typeof e != "function" && (e = $s(e));
  for (var t = this._groups, n = t.length, r = new Array(n), o = 0; o < n; ++o)
    for (var i = t[o], s = i.length, a = r[o] = [], l, c = 0; c < s; ++c)
      (l = i[c]) && e.call(l, l.__data__, c, i) && a.push(l);
  return new Ye(r, this._parents, this._name, this._id);
}
function j0(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, o = n.length, i = Math.min(r, o), s = new Array(r), a = 0; a < i; ++a)
    for (var l = t[a], c = n[a], u = l.length, f = s[a] = new Array(u), d, h = 0; h < u; ++h)
      (d = l[h] || c[h]) && (f[h] = d);
  for (; a < r; ++a)
    s[a] = t[a];
  return new Ye(s, this._parents, this._name, this._id);
}
function G0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function X0(e, t, n) {
  var r, o, i = G0(t) ? Zr : De;
  return function() {
    var s = i(this, e), a = s.on;
    a !== r && (o = (r = a).copy()).on(t, n), s.on = o;
  };
}
function q0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? $e(this.node(), n).on.on(e) : this.each(X0(n, e, t));
}
function U0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function K0() {
  return this.on("end.remove", U0(this._id));
}
function Z0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Gr(e));
  for (var r = this._groups, o = r.length, i = new Array(o), s = 0; s < o; ++s)
    for (var a = r[s], l = a.length, c = i[s] = new Array(l), u, f, d = 0; d < l; ++d)
      (u = a[d]) && (f = e.call(u, u.__data__, d, a)) && ("__data__" in u && (f.__data__ = u.__data__), c[d] = f, Fn(c[d], t, n, d, c, $e(u, n)));
  return new Ye(i, this._parents, t, n);
}
function Q0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Is(e));
  for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
    for (var l = r[a], c = l.length, u, f = 0; f < c; ++f)
      if (u = l[f]) {
        for (var d = e.call(u, u.__data__, f, l), h, p = $e(u, n), w = 0, b = d.length; w < b; ++w)
          (h = d[w]) && Fn(h, t, n, w, d, p);
        i.push(d), s.push(u);
      }
  return new Ye(i, s, t, n);
}
var J0 = qt.prototype.constructor;
function em() {
  return new J0(this._groups, this._parents);
}
function tm(e, t) {
  var n, r, o;
  return function() {
    var i = wt(this, e), s = (this.style.removeProperty(e), wt(this, e));
    return i === s ? null : i === n && s === r ? o : o = t(n = i, r = s);
  };
}
function ea(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function nm(e, t, n) {
  var r, o = n + "", i;
  return function() {
    var s = wt(this, e);
    return s === o ? null : s === r ? i : i = t(r = s, n);
  };
}
function rm(e, t, n) {
  var r, o, i;
  return function() {
    var s = wt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), wt(this, e))), s === l ? null : s === r && l === o ? i : (o = l, i = t(r = s, a));
  };
}
function om(e, t) {
  var n, r, o, i = "style." + t, s = "end." + i, a;
  return function() {
    var l = De(this, e), c = l.on, u = l.value[i] == null ? a || (a = ea(t)) : void 0;
    (c !== n || o !== u) && (r = (n = c).copy()).on(s, o = u), l.on = r;
  };
}
function im(e, t, n) {
  var r = (e += "") == "transform" ? s0 : Js;
  return t == null ? this.styleTween(e, tm(e, r)).on("end.style." + e, ea(e)) : typeof t == "function" ? this.styleTween(e, rm(e, r, Qr(this, "style." + e, t))).each(om(this._id, e)) : this.styleTween(e, nm(e, r, t), n).on("end.style." + e, null);
}
function sm(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function am(e, t, n) {
  var r, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (r = (o = s) && sm(e, s, n)), r;
  }
  return i._value = t, i;
}
function lm(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, am(e, t, n ?? ""));
}
function cm(e) {
  return function() {
    this.textContent = e;
  };
}
function um(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function dm(e) {
  return this.tween("text", typeof e == "function" ? um(Qr(this, "text", e)) : cm(e == null ? "" : e + ""));
}
function fm(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function hm(e) {
  var t, n;
  function r() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && fm(o)), t;
  }
  return r._value = e, r;
}
function pm(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, hm(e));
}
function gm() {
  for (var e = this._name, t = this._id, n = ta(), r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var u = $e(l, t);
        Fn(l, e, n, c, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new Ye(r, this._parents, e, n);
}
function mm() {
  var e, t, n = this, r = n._id, o = n.size();
  return new Promise(function(i, s) {
    var a = { value: s }, l = { value: function() {
      --o === 0 && i();
    } };
    n.each(function() {
      var c = De(this, r), u = c.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), c.on = t;
    }), o === 0 && i();
  });
}
var ym = 0;
function Ye(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function ta() {
  return ++ym;
}
var Be = qt.prototype;
Ye.prototype = {
  constructor: Ye,
  select: Z0,
  selectAll: Q0,
  selectChild: Be.selectChild,
  selectChildren: Be.selectChildren,
  filter: Y0,
  merge: j0,
  selection: em,
  transition: gm,
  call: Be.call,
  nodes: Be.nodes,
  node: Be.node,
  size: Be.size,
  empty: Be.empty,
  each: Be.each,
  on: q0,
  attr: M0,
  attrTween: L0,
  style: im,
  styleTween: lm,
  text: dm,
  textTween: pm,
  remove: K0,
  tween: v0,
  delay: P0,
  duration: H0,
  ease: B0,
  easeVarying: W0,
  end: mm,
  [Symbol.iterator]: Be[Symbol.iterator]
};
function wm(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var bm = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: wm
};
function xm(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function vm(e) {
  var t, n;
  e instanceof Ye ? (t = e._id, e = e._name) : (t = ta(), (n = bm).time = Kr(), e = e == null ? null : e + "");
  for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
    for (var s = r[i], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Fn(l, e, t, c, s, n || xm(l, t));
  return new Ye(r, this._parents, e, t);
}
qt.prototype.interrupt = w0;
qt.prototype.transition = vm;
const ln = (e) => () => e;
function _m(e, {
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
function We(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
We.prototype = {
  constructor: We,
  scale: function(e) {
    return e === 1 ? this : new We(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new We(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Wn = new We(1, 0, 0);
na.prototype = We.prototype;
function na(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Wn;
  return e.__zoom;
}
function fr(e) {
  e.stopImmediatePropagation();
}
function It(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Em(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function km() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function oi() {
  return this.__zoom || Wn;
}
function Sm(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Nm() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Cm(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], o = e.invertX(t[1][0]) - n[1][0], i = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function ra() {
  var e = Em, t = km, n = Cm, r = Sm, o = Nm, i = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = gn, c = Hn("start", "zoom", "end"), u, f, d, h = 500, p = 150, w = 0, b = 10;
  function g(y) {
    y.property("__zoom", oi).on("wheel.zoom", A, { passive: !1 }).on("mousedown.zoom", $).on("dblclick.zoom", R).filter(o).on("touchstart.zoom", L).on("touchmove.zoom", H).on("touchend.zoom touchcancel.zoom", D).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  g.transform = function(y, N, S, M) {
    var T = y.selection ? y.selection() : y;
    T.property("__zoom", oi), y !== T ? k(y, N, S, M) : T.interrupt().each(function() {
      E(this, arguments).event(M).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, g.scaleBy = function(y, N, S, M) {
    g.scaleTo(y, function() {
      var T = this.__zoom.k, C = typeof N == "function" ? N.apply(this, arguments) : N;
      return T * C;
    }, S, M);
  }, g.scaleTo = function(y, N, S, M) {
    g.transform(y, function() {
      var T = t.apply(this, arguments), C = this.__zoom, z = S == null ? x(T) : typeof S == "function" ? S.apply(this, arguments) : S, O = C.invert(z), V = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(m(_(C, V), z, O), T, s);
    }, S, M);
  }, g.translateBy = function(y, N, S, M) {
    g.transform(y, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof S == "function" ? S.apply(this, arguments) : S
      ), t.apply(this, arguments), s);
    }, null, M);
  }, g.translateTo = function(y, N, S, M, T) {
    g.transform(y, function() {
      var C = t.apply(this, arguments), z = this.__zoom, O = M == null ? x(C) : typeof M == "function" ? M.apply(this, arguments) : M;
      return n(Wn.translate(O[0], O[1]).scale(z.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof S == "function" ? -S.apply(this, arguments) : -S
      ), C, s);
    }, M, T);
  };
  function _(y, N) {
    return N = Math.max(i[0], Math.min(i[1], N)), N === y.k ? y : new We(N, y.x, y.y);
  }
  function m(y, N, S) {
    var M = N[0] - S[0] * y.k, T = N[1] - S[1] * y.k;
    return M === y.x && T === y.y ? y : new We(y.k, M, T);
  }
  function x(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function k(y, N, S, M) {
    y.on("start.zoom", function() {
      E(this, arguments).event(M).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event(M).end();
    }).tween("zoom", function() {
      var T = this, C = arguments, z = E(T, C).event(M), O = t.apply(T, C), V = S == null ? x(O) : typeof S == "function" ? S.apply(T, C) : S, j = Math.max(O[1][0] - O[0][0], O[1][1] - O[0][1]), Y = T.__zoom, K = typeof N == "function" ? N.apply(T, C) : N, ee = l(Y.invert(V).concat(j / Y.k), K.invert(V).concat(j / K.k));
      return function(q) {
        if (q === 1) q = K;
        else {
          var P = ee(q), F = j / P[2];
          q = new We(F, V[0] - P[0] * F, V[1] - P[1] * F);
        }
        z.zoom(null, q);
      };
    });
  }
  function E(y, N, S) {
    return !S && y.__zooming || new I(y, N);
  }
  function I(y, N) {
    this.that = y, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, N), this.taps = 0;
  }
  I.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, N) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var N = ye(this.that).datum();
      c.call(
        y,
        this.that,
        new _m(y, {
          sourceEvent: this.sourceEvent,
          target: g,
          transform: this.that.__zoom,
          dispatch: c
        }),
        N
      );
    }
  };
  function A(y, ...N) {
    if (!e.apply(this, arguments)) return;
    var S = E(this, N).event(y), M = this.__zoom, T = Math.max(i[0], Math.min(i[1], M.k * Math.pow(2, r.apply(this, arguments)))), C = Ee(y);
    if (S.wheel)
      (S.mouse[0][0] !== C[0] || S.mouse[0][1] !== C[1]) && (S.mouse[1] = M.invert(S.mouse[0] = C)), clearTimeout(S.wheel);
    else {
      if (M.k === T) return;
      S.mouse = [C, M.invert(C)], wn(this), S.start();
    }
    It(y), S.wheel = setTimeout(z, p), S.zoom("mouse", n(m(_(M, T), S.mouse[0], S.mouse[1]), S.extent, s));
    function z() {
      S.wheel = null, S.end();
    }
  }
  function $(y, ...N) {
    if (d || !e.apply(this, arguments)) return;
    var S = y.currentTarget, M = E(this, N, !0).event(y), T = ye(y.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", j, !0), C = Ee(y, S), z = y.clientX, O = y.clientY;
    Vs(y.view), fr(y), M.mouse = [C, this.__zoom.invert(C)], wn(this), M.start();
    function V(Y) {
      if (It(Y), !M.moved) {
        var K = Y.clientX - z, ee = Y.clientY - O;
        M.moved = K * K + ee * ee > w;
      }
      M.event(Y).zoom("mouse", n(m(M.that.__zoom, M.mouse[0] = Ee(Y, S), M.mouse[1]), M.extent, s));
    }
    function j(Y) {
      T.on("mousemove.zoom mouseup.zoom", null), Bs(Y.view, M.moved), It(Y), M.event(Y).end();
    }
  }
  function R(y, ...N) {
    if (e.apply(this, arguments)) {
      var S = this.__zoom, M = Ee(y.changedTouches ? y.changedTouches[0] : y, this), T = S.invert(M), C = S.k * (y.shiftKey ? 0.5 : 2), z = n(m(_(S, C), M, T), t.apply(this, N), s);
      It(y), a > 0 ? ye(this).transition().duration(a).call(k, z, M, y) : ye(this).call(g.transform, z, M, y);
    }
  }
  function L(y, ...N) {
    if (e.apply(this, arguments)) {
      var S = y.touches, M = S.length, T = E(this, N, y.changedTouches.length === M).event(y), C, z, O, V;
      for (fr(y), z = 0; z < M; ++z)
        O = S[z], V = Ee(O, this), V = [V, this.__zoom.invert(V), O.identifier], T.touch0 ? !T.touch1 && T.touch0[2] !== V[2] && (T.touch1 = V, T.taps = 0) : (T.touch0 = V, C = !0, T.taps = 1 + !!u);
      u && (u = clearTimeout(u)), C && (T.taps < 2 && (f = V[0], u = setTimeout(function() {
        u = null;
      }, h)), wn(this), T.start());
    }
  }
  function H(y, ...N) {
    if (this.__zooming) {
      var S = E(this, N).event(y), M = y.changedTouches, T = M.length, C, z, O, V;
      for (It(y), C = 0; C < T; ++C)
        z = M[C], O = Ee(z, this), S.touch0 && S.touch0[2] === z.identifier ? S.touch0[0] = O : S.touch1 && S.touch1[2] === z.identifier && (S.touch1[0] = O);
      if (z = S.that.__zoom, S.touch1) {
        var j = S.touch0[0], Y = S.touch0[1], K = S.touch1[0], ee = S.touch1[1], q = (q = K[0] - j[0]) * q + (q = K[1] - j[1]) * q, P = (P = ee[0] - Y[0]) * P + (P = ee[1] - Y[1]) * P;
        z = _(z, Math.sqrt(q / P)), O = [(j[0] + K[0]) / 2, (j[1] + K[1]) / 2], V = [(Y[0] + ee[0]) / 2, (Y[1] + ee[1]) / 2];
      } else if (S.touch0) O = S.touch0[0], V = S.touch0[1];
      else return;
      S.zoom("touch", n(m(z, O, V), S.extent, s));
    }
  }
  function D(y, ...N) {
    if (this.__zooming) {
      var S = E(this, N).event(y), M = y.changedTouches, T = M.length, C, z;
      for (fr(y), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, h), C = 0; C < T; ++C)
        z = M[C], S.touch0 && S.touch0[2] === z.identifier ? delete S.touch0 : S.touch1 && S.touch1[2] === z.identifier && delete S.touch1;
      if (S.touch1 && !S.touch0 && (S.touch0 = S.touch1, delete S.touch1), S.touch0) S.touch0[1] = this.__zoom.invert(S.touch0[0]);
      else if (S.end(), S.taps === 2 && (z = Ee(z, this), Math.hypot(f[0] - z[0], f[1] - z[1]) < b)) {
        var O = ye(this).on("dblclick.zoom");
        O && O.apply(this, arguments);
      }
    }
  }
  return g.wheelDelta = function(y) {
    return arguments.length ? (r = typeof y == "function" ? y : ln(+y), g) : r;
  }, g.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : ln(!!y), g) : e;
  }, g.touchable = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : ln(!!y), g) : o;
  }, g.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : ln([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), g) : t;
  }, g.scaleExtent = function(y) {
    return arguments.length ? (i[0] = +y[0], i[1] = +y[1], g) : [i[0], i[1]];
  }, g.translateExtent = function(y) {
    return arguments.length ? (s[0][0] = +y[0][0], s[1][0] = +y[1][0], s[0][1] = +y[0][1], s[1][1] = +y[1][1], g) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, g.constrain = function(y) {
    return arguments.length ? (n = y, g) : n;
  }, g.duration = function(y) {
    return arguments.length ? (a = +y, g) : a;
  }, g.interpolate = function(y) {
    return arguments.length ? (l = y, g) : l;
  }, g.on = function() {
    var y = c.on.apply(c, arguments);
    return y === c ? g : y;
  }, g.clickDistance = function(y) {
    return arguments.length ? (w = (y = +y) * y, g) : Math.sqrt(w);
  }, g.tapDistance = function(y) {
    return arguments.length ? (b = +y, g) : b;
  }, g;
}
const Me = {
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
}, Vt = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], oa = ["Enter", " ", "Escape"], ia = {
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
var xt;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(xt || (xt = {}));
var it;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(it || (it = {}));
var Bt;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Bt || (Bt = {}));
const sa = {
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
var qe;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(qe || (qe = {}));
var vt;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(vt || (vt = {}));
var G;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(G || (G = {}));
const ii = {
  [G.Left]: G.Right,
  [G.Right]: G.Left,
  [G.Top]: G.Bottom,
  [G.Bottom]: G.Top
}, aa = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, Mm = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Jr = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Kt = (e, t = [0, 0]) => {
  const { width: n, height: r } = Ae(e), o = e.origin ?? t, i = n * o[0], s = r * o[1];
  return {
    x: e.position.x - i,
    y: e.position.y - s
  };
}, Im = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = !1;
  const r = e.reduce((o, i) => {
    const s = typeof i == "string";
    let a = !t.nodeLookup && !s ? i : void 0;
    return t.nodeLookup && (a = s ? t.nodeLookup.get(i) : Jr(i) ? i : t.nodeLookup.get(i.id)), a ? (n = !0, Yn(o, An(a, t.nodeOrigin))) : o;
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return n ? jn(r) : { x: 0, y: 0, width: 0, height: 0 };
}, Zt = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((o) => {
    (t.filter === void 0 || t.filter(o)) && (n = Yn(n, An(o)), r = !0);
  }), r ? jn(n) : { x: 0, y: 0, width: 0, height: 0 };
}, eo = (e, t, [n, r, o] = [0, 0, 1], i = !1, s = !1) => {
  const a = (t.x - n) / o, l = (t.y - r) / o, c = t.width / o, u = t.height / o, f = [];
  for (const d of e.values()) {
    const { measured: h, selectable: p = !0, hidden: w = !1 } = d;
    if (s && !p || w)
      continue;
    const b = h.width ?? d.width ?? d.initialWidth ?? 0, g = h.height ?? d.height ?? d.initialHeight ?? 0, { x: _, y: m } = d.internals.positionAbsolute, x = da(a, l, c, u, _, m, b, g), k = b * g, E = i && x > 0;
    (!d.internals.handleBounds || E || x >= k || d.dragging) && f.push(d);
  }
  return f;
}, $m = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function Am(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((o) => o.id)) : null;
  return e.forEach((o) => {
    let i;
    if (t != null && t.includeHiddenNodes) {
      const { width: s, height: a } = Ae(o);
      i = s > 0 && a > 0;
    } else
      i = !!(o.measured.width && o.measured.height && !o.hidden);
    i && (!r || r.has(o.id)) && n.set(o.id, o);
  }), n;
}
async function Tm({ nodes: e, width: t, height: n, panZoom: r, minZoom: o, maxZoom: i }, s) {
  if (e.size === 0)
    return !0;
  const a = Am(e, s), l = Zt(a), c = Gn(l, t, n, (s == null ? void 0 : s.minZoom) ?? o, (s == null ? void 0 : s.maxZoom) ?? i, (s == null ? void 0 : s.padding) ?? 0.1);
  return await r.setViewport(c, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), !0;
}
function la({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: o, onError: i }) {
  const s = n.get(e), a = s.parentId ? n.get(s.parentId) : void 0, { x: l, y: c } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, u = s.origin ?? r;
  let f = s.extent || o;
  if (s.extent === "parent" && !s.expandParent)
    if (!a)
      i == null || i("005", Me.error005());
    else {
      const { width: h, height: p } = Ae(a);
      h && p && (f = [
        [l, c],
        [l + h, c + p]
      ]);
    }
  else a && ct(s.extent) && (f = [
    [s.extent[0][0] + l, s.extent[0][1] + c],
    [s.extent[1][0] + l, s.extent[1][1] + c]
  ]);
  const d = ct(f) ? lt(t, f, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (i == null || i("015", Me.error015())), {
    position: {
      x: d.x - l + (s.measured.width ?? 0) * u[0],
      y: d.y - c + (s.measured.height ?? 0) * u[1]
    },
    positionAbsolute: d
  };
}
async function Lm({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: o }) {
  const i = new Set(e.map((d) => d.id)), s = [];
  for (const d of n) {
    if (d.deletable === !1)
      continue;
    const h = i.has(d.id), p = !h && d.parentId && s.find((w) => w.id === d.parentId);
    (h || p) && s.push(d);
  }
  const a = new Set(t.map((d) => d.id)), l = r.filter((d) => d.deletable !== !1), u = $m(s, l);
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
const _t = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), lt = (e = { x: 0, y: 0 }, t, n) => ({
  x: _t(e.x, t[0][0], t[1][0] - ((n == null ? void 0 : n.width) ?? 0)),
  y: _t(e.y, t[0][1], t[1][1] - ((n == null ? void 0 : n.height) ?? 0))
});
function ca(e, t, n) {
  const { width: r, height: o } = Ae(n), { x: i, y: s } = n.internals.positionAbsolute;
  return lt(e, [
    [i, s],
    [i + r, s + o]
  ], t);
}
const si = (e, t, n) => e < t ? _t(Math.abs(e - t), 1, t) / t : e > n ? -_t(Math.abs(e - n), 1, t) / t : 0, to = (e, t, n = 15, r = 40) => {
  const o = si(e.x, r, t.width - r) * n, i = si(e.y, r, t.height - r) * n;
  return [o, i];
}, Yn = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), Ar = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), jn = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), Ft = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Jr(e) ? e.internals.positionAbsolute : Kt(e, t);
  return {
    x: n,
    y: r,
    width: ((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, An = (e, t = [0, 0]) => {
  var o, i;
  const { x: n, y: r } = Jr(e) ? e.internals.positionAbsolute : Kt(e, t);
  return {
    x: n,
    y: r,
    x2: n + (((o = e.measured) == null ? void 0 : o.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: r + (((i = e.measured) == null ? void 0 : i.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, ua = (e, t) => jn(Yn(Ar(e), Ar(t))), da = (e, t, n, r, o, i, s, a) => {
  const l = Math.max(0, Math.min(e + n, o + s) - Math.max(e, o)), c = Math.max(0, Math.min(t + r, i + a) - Math.max(t, i));
  return Math.ceil(l * c);
}, Tn = (e, t) => da(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), ai = (e) => Se(e.width) && Se(e.height) && Se(e.x) && Se(e.y), Se = (e) => !isNaN(e) && isFinite(e), fa = (e, t) => (n, r) => {
}, Qt = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), Jt = ({ x: e, y: t }, [n, r, o], i = !1, s = [1, 1]) => {
  const a = {
    x: (e - n) / o,
    y: (t - r) / o
  };
  return i ? Qt(a, s) : a;
}, Et = ({ x: e, y: t }, [n, r, o]) => ({
  x: e * o + n,
  y: t * o + r
});
function pt(e, t) {
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
function zm(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const r = pt(e, n), o = pt(e, t);
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
    const r = pt(e.top ?? e.y ?? 0, n), o = pt(e.bottom ?? e.y ?? 0, n), i = pt(e.left ?? e.x ?? 0, t), s = pt(e.right ?? e.x ?? 0, t);
    return { top: r, right: s, bottom: o, left: i, x: i + s, y: r + o };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Om(e, t, n, r, o, i) {
  const { x: s, y: a } = Et(e, [t, n, r]), { x: l, y: c } = Et({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), u = o - l, f = i - c;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(u),
    bottom: Math.floor(f)
  };
}
const Gn = (e, t, n, r, o, i) => {
  const s = zm(i, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, c = Math.min(a, l), u = _t(c, r, o), f = e.x + e.width / 2, d = e.y + e.height / 2, h = t / 2 - f * u, p = n / 2 - d * u, w = Om(e, h, p, u, t, n), b = {
    left: Math.min(w.left - s.left, 0),
    top: Math.min(w.top - s.top, 0),
    right: Math.min(w.right - s.right, 0),
    bottom: Math.min(w.bottom - s.bottom, 0)
  };
  return {
    x: h - b.left + b.right,
    y: p - b.top + b.bottom,
    zoom: u
  };
}, Wt = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function ct(e) {
  return e != null && e !== "parent";
}
function Ae(e) {
  var t, n;
  return {
    width: ((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function ha(e) {
  var t, n;
  return (((t = e.measured) == null ? void 0 : t.width) ?? e.width ?? e.initialWidth) !== void 0 && (((n = e.measured) == null ? void 0 : n.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function pa(e, t = { width: 0, height: 0 }, n, r, o) {
  const i = { ...e }, s = r.get(n);
  if (s) {
    const a = s.origin || o;
    i.x += s.internals.positionAbsolute.x - (t.width ?? 0) * a[0], i.y += s.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return i;
}
function li(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Pm() {
  let e, t;
  return { promise: new Promise((r, o) => {
    e = r, t = o;
  }), resolve: e, reject: t };
}
function Dm(e) {
  return { ...ia, ...e || {} };
}
function ga(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
function zt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: o }) {
  const { x: i, y: s } = Ne(e), a = Jt({ x: i - ((o == null ? void 0 : o.left) ?? 0), y: s - ((o == null ? void 0 : o.top) ?? 0) }, r), { x: l, y: c } = n ? Qt(a, t) : a;
  return {
    xSnapped: l,
    ySnapped: c,
    ...a
  };
}
const no = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), ma = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, Rm = ["INPUT", "SELECT", "TEXTAREA"];
function ya(e) {
  var r, o;
  const t = ((o = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : o[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : Rm.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const wa = (e) => "clientX" in e, Ne = (e, t) => {
  var i, s;
  const n = wa(e), r = n ? e.clientX : (i = e.touches) == null ? void 0 : i[0].clientX, o = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: o - ((t == null ? void 0 : t.top) ?? 0)
  };
}, ci = (e, t, n, r, o) => {
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
      ...no(s)
    };
  });
};
function ba({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: o, sourceControlY: i, targetControlX: s, targetControlY: a }) {
  const l = e * 0.125 + o * 0.375 + s * 0.375 + n * 0.125, c = t * 0.125 + i * 0.375 + a * 0.375 + r * 0.125, u = Math.abs(l - e), f = Math.abs(c - t);
  return [l, c, u, f];
}
function cn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function ui({ pos: e, x1: t, y1: n, x2: r, y2: o, c: i }) {
  switch (e) {
    case G.Left:
      return [t - cn(t - r, i), n];
    case G.Right:
      return [t + cn(r - t, i), n];
    case G.Top:
      return [t, n - cn(n - o, i)];
    case G.Bottom:
      return [t, n + cn(o - n, i)];
  }
}
function xa({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top, curvature: s = 0.25 }) {
  const [a, l] = ui({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o,
    c: s
  }), [c, u] = ui({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t,
    c: s
  }), [f, d, h, p] = ba({
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
function va({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const o = Math.abs(n - e) / 2, i = n < e ? n + o : n - o, s = Math.abs(r - t) / 2, a = r < t ? r + s : r - s;
  return [i, a, o, s];
}
function Hm({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: o = !1, zIndexMode: i = "basic" }) {
  if (i === "manual")
    return r;
  const s = o && n ? r + 1e3 : r, a = Math.max(e.parentId || o && e.selected ? e.internals.z : 0, t.parentId || o && t.selected ? t.internals.z : 0);
  return s + a;
}
function Vm({ sourceNode: e, targetNode: t, width: n, height: r, transform: o }) {
  const i = Yn(An(e), An(t));
  i.x === i.x2 && (i.x2 += 1), i.y === i.y2 && (i.y2 += 1);
  const s = {
    x: -o[0] / o[2],
    y: -o[1] / o[2],
    width: n / o[2],
    height: r / o[2]
  };
  return Tn(s, jn(i)) > 0;
}
const Bm = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Fm = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Wm = (e, t, n = {}) => {
  var i;
  if (!e.source || !e.target)
    return (i = n.onError) == null || i.call(n, "006", Me.error006()), t;
  const r = n.getEdgeId || Bm;
  let o;
  return aa(e) ? o = { ...e } : o = {
    ...e,
    id: r(e)
  }, Fm(o, t) ? t : (o.sourceHandle === null && delete o.sourceHandle, o.targetHandle === null && delete o.targetHandle, t.concat(o));
};
function _a({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [o, i, s, a] = va({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, o, i, s, a];
}
const di = {
  [G.Left]: { x: -1, y: 0 },
  [G.Right]: { x: 1, y: 0 },
  [G.Top]: { x: 0, y: -1 },
  [G.Bottom]: { x: 0, y: 1 }
}, Ym = ({ source: e, sourcePosition: t = G.Bottom, target: n }) => t === G.Left || t === G.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, fi = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function jm({ source: e, sourcePosition: t = G.Bottom, target: n, targetPosition: r = G.Top, center: o, offset: i, stepPosition: s }) {
  const a = di[t], l = di[r], c = { x: e.x + a.x * i, y: e.y + a.y * i }, u = { x: n.x + l.x * i, y: n.y + l.y * i }, f = Ym({
    source: c,
    sourcePosition: t,
    target: u
  }), d = f.x !== 0 ? "x" : "y", h = f[d];
  let p = [], w, b;
  const g = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [, , m, x] = va({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[d] * l[d] === -1) {
    d === "x" ? (w = o.x ?? c.x + (u.x - c.x) * s, b = o.y ?? (c.y + u.y) / 2) : (w = o.x ?? (c.x + u.x) / 2, b = o.y ?? c.y + (u.y - c.y) * s);
    const A = [
      { x: w, y: c.y },
      { x: w, y: u.y }
    ], $ = [
      { x: c.x, y: b },
      { x: u.x, y: b }
    ];
    a[d] === h ? p = d === "x" ? A : $ : p = d === "x" ? $ : A;
  } else {
    const A = [{ x: c.x, y: u.y }], $ = [{ x: u.x, y: c.y }];
    if (d === "x" ? p = a.x === h ? $ : A : p = a.y === h ? A : $, t === r) {
      const y = Math.abs(e[d] - n[d]);
      if (y <= i) {
        const N = Math.min(i - 1, i - y);
        a[d] === h ? g[d] = (c[d] > e[d] ? -1 : 1) * N : _[d] = (u[d] > n[d] ? -1 : 1) * N;
      }
    }
    if (t !== r) {
      const y = d === "x" ? "y" : "x", N = a[d] === l[y], S = c[y] > u[y], M = c[y] < u[y];
      (a[d] === 1 && (!N && S || N && M) || a[d] !== 1 && (!N && M || N && S)) && (p = d === "x" ? A : $);
    }
    const R = { x: c.x + g.x, y: c.y + g.y }, L = { x: u.x + _.x, y: u.y + _.y }, H = Math.max(Math.abs(R.x - p[0].x), Math.abs(L.x - p[0].x)), D = Math.max(Math.abs(R.y - p[0].y), Math.abs(L.y - p[0].y));
    H >= D ? (w = (R.x + L.x) / 2, b = p[0].y) : (w = p[0].x, b = (R.y + L.y) / 2);
  }
  const k = { x: c.x + g.x, y: c.y + g.y }, E = { x: u.x + _.x, y: u.y + _.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...k.x !== p[0].x || k.y !== p[0].y ? [k] : [],
    ...p,
    ...E.x !== p[p.length - 1].x || E.y !== p[p.length - 1].y ? [E] : [],
    n
  ], w, b, m, x];
}
function Gm(e, t, n, r) {
  const o = Math.min(fi(e, t) / 2, fi(t, n) / 2, r), { x: i, y: s } = t;
  if (e.x === i && i === n.x || e.y === s && s === n.y)
    return `L${i} ${s}`;
  if (e.y === s) {
    const c = e.x < n.x ? -1 : 1, u = e.y < n.y ? 1 : -1;
    return `L ${i + o * c},${s}Q ${i},${s} ${i},${s + o * u}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${i},${s + o * l}Q ${i},${s} ${i + o * a},${s}`;
}
function Tr({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top, borderRadius: s = 5, centerX: a, centerY: l, offset: c = 20, stepPosition: u = 0.5 }) {
  const [f, d, h, p, w] = jm({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: o },
    targetPosition: i,
    center: { x: a, y: l },
    offset: c,
    stepPosition: u
  });
  let b = `M${f[0].x} ${f[0].y}`;
  for (let g = 1; g < f.length - 1; g++)
    b += Gm(f[g - 1], f[g], f[g + 1], s);
  return b += `L${f[f.length - 1].x} ${f[f.length - 1].y}`, [b, d, h, p, w];
}
function hi(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Xm(e) {
  var f;
  const { sourceNode: t, targetNode: n } = e;
  if (!hi(t) || !hi(n))
    return null;
  const r = t.internals.handleBounds || pi(t.handles), o = n.internals.handleBounds || pi(n.handles), i = gi((r == null ? void 0 : r.source) ?? [], e.sourceHandle), s = gi(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === xt.Strict ? (o == null ? void 0 : o.target) ?? [] : ((o == null ? void 0 : o.target) ?? []).concat((o == null ? void 0 : o.source) ?? []),
    e.targetHandle
  );
  if (!i || !s)
    return (f = e.onError) == null || f.call(e, "008", Me.error008(i ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = (i == null ? void 0 : i.position) || G.Bottom, l = (s == null ? void 0 : s.position) || G.Top, c = ut(t, i, a), u = ut(n, s, l);
  return {
    sourceX: c.x,
    sourceY: c.y,
    targetX: u.x,
    targetY: u.y,
    sourcePosition: a,
    targetPosition: l
  };
}
function pi(e) {
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
function ut(e, t, n = G.Left, r = !1) {
  const o = ((t == null ? void 0 : t.x) ?? 0) + e.internals.positionAbsolute.x, i = ((t == null ? void 0 : t.y) ?? 0) + e.internals.positionAbsolute.y, { width: s, height: a } = t ?? Ae(e);
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
function gi(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Lr(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function qm(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: o }) {
  const i = /* @__PURE__ */ new Set();
  return e.reduce((s, a) => ([a.markerStart || r, a.markerEnd || o].forEach((l) => {
    if (l && typeof l == "object") {
      const c = Lr(l, t);
      i.has(c) || (s.push({ id: c, color: l.color || n, ...l }), i.add(c));
    }
  }), s), []).sort((s, a) => s.id.localeCompare(a.id));
}
const Ea = 1e3, Um = 10, ro = {
  nodeOrigin: [0, 0],
  nodeExtent: Vt,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Km = {
  ...ro,
  checkEquality: !0
};
function oo(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function Zm(e, t, n) {
  const r = oo(ro, n);
  for (const o of e.values())
    if (o.parentId)
      so(o, e, t, r);
    else {
      const i = Kt(o, r.nodeOrigin), s = ct(o.extent) ? o.extent : r.nodeExtent, a = lt(i, s, Ae(o));
      o.internals.positionAbsolute = a;
    }
}
function Qm(e, t) {
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
function io(e) {
  return e === "manual";
}
function zr(e, t, n, r = {}) {
  var u, f;
  const o = oo(Km, r), i = { i: 0 }, s = new Map(t), a = o != null && o.elevateNodesOnSelect && !io(o.zIndexMode) ? Ea : 0;
  let l = e.length > 0, c = !1;
  t.clear(), n.clear();
  for (const d of e) {
    let h = s.get(d.id);
    if (o.checkEquality && d === (h == null ? void 0 : h.internals.userNode))
      t.set(d.id, h);
    else {
      const p = Kt(d, o.nodeOrigin), w = ct(d.extent) ? d.extent : o.nodeExtent, b = lt(p, w, Ae(d));
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
          handleBounds: Qm(d, h),
          z: ka(d, a, o.zIndexMode),
          userNode: d
        }
      }, t.set(d.id, h);
    }
    (h.measured === void 0 || h.measured.width === void 0 || h.measured.height === void 0) && !h.hidden && (l = !1), d.parentId && so(h, t, n, r, i), c || (c = d.selected ?? !1);
  }
  return { nodesInitialized: l, hasSelectedNodes: c };
}
function Jm(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function so(e, t, n, r, o) {
  const { elevateNodesOnSelect: i, nodeOrigin: s, nodeExtent: a, zIndexMode: l } = oo(ro, r), c = e.parentId, u = t.get(c);
  if (!u) {
    console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Jm(e, n), o && !u.parentId && u.internals.rootParentIndex === void 0 && l === "auto" && (u.internals.rootParentIndex = ++o.i, u.internals.z = u.internals.z + o.i * Um), o && u.internals.rootParentIndex !== void 0 && (o.i = u.internals.rootParentIndex);
  const f = i && !io(l) ? Ea : 0, { x: d, y: h, z: p } = ey(e, u, s, a, f, l), { positionAbsolute: w } = e.internals, b = d !== w.x || h !== w.y;
  (b || p !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: b ? { x: d, y: h } : w,
      z: p
    }
  });
}
function ka(e, t, n) {
  const r = Se(e.zIndex) ? e.zIndex : 0;
  return io(n) ? r : r + (e.selected ? t : 0);
}
function ey(e, t, n, r, o, i) {
  const { x: s, y: a } = t.internals.positionAbsolute, l = Ae(e), c = Kt(e, n), u = ct(e.extent) ? lt(c, e.extent, l) : c;
  let f = lt({ x: s + u.x, y: a + u.y }, r, l);
  e.extent === "parent" && (f = ca(f, l, t));
  const d = ka(e, o, i), h = t.internals.z ?? 0;
  return {
    x: f.x,
    y: f.y,
    z: h >= d ? h + 1 : d
  };
}
function ao(e, t, n, r = [0, 0]) {
  var s;
  const o = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const c = ((s = i.get(a.parentId)) == null ? void 0 : s.expandedRect) ?? Ft(l), u = ua(c, a.rect);
    i.set(a.parentId, { expandedRect: u, parent: l });
  }
  return i.size > 0 && i.forEach(({ expandedRect: a, parent: l }, c) => {
    var m;
    const u = l.internals.positionAbsolute, f = Ae(l), d = l.origin ?? r, h = a.x < u.x ? Math.round(Math.abs(u.x - a.x)) : 0, p = a.y < u.y ? Math.round(Math.abs(u.y - a.y)) : 0, w = Math.max(f.width, Math.round(a.width)), b = Math.max(f.height, Math.round(a.height)), g = (w - f.width) * d[0], _ = (b - f.height) * d[1];
    (h > 0 || p > 0 || g || _) && (o.push({
      id: c,
      type: "position",
      position: {
        x: l.position.x - h + g,
        y: l.position.y - p + _
      }
    }), (m = n.get(c)) == null || m.forEach((x) => {
      e.some((k) => k.id === x.id) || o.push({
        id: x.id,
        type: "position",
        position: {
          x: x.position.x + h,
          y: x.position.y + p
        }
      });
    })), (f.width < a.width || f.height < a.height || h || p) && o.push({
      id: c,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: w + (h ? d[0] * h - g : 0),
        height: b + (p ? d[1] * p - _ : 0)
      }
    });
  }), o;
}
function ty(e, t, n, r, o, i, s) {
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
    const w = no(h.nodeElement), b = p.measured.width !== w.width || p.measured.height !== w.height;
    if (!!(w.width && w.height && (b || !p.internals.handleBounds || h.force))) {
      const _ = h.nodeElement.getBoundingClientRect(), m = ct(p.extent) ? p.extent : i;
      let { positionAbsolute: x } = p.internals;
      if (p.parentId && p.extent === "parent") {
        const E = t.get(p.parentId);
        E && (x = ca(x, w, E));
      } else m && (x = lt(x, m, w));
      const k = {
        ...p,
        measured: w,
        internals: {
          ...p.internals,
          positionAbsolute: x,
          handleBounds: {
            source: ci("source", h.nodeElement, _, f, p.id),
            target: ci("target", h.nodeElement, _, f, p.id)
          }
        }
      };
      t.set(p.id, k), p.parentId && so(k, t, n, { nodeOrigin: o, zIndexMode: s }), l = !0, b && (c.push({
        id: p.id,
        type: "dimensions",
        dimensions: w
      }), p.expandParent && p.parentId && d.push({
        id: p.id,
        parentId: p.parentId,
        rect: Ft(k, o)
      }));
    }
  }
  if (d.length > 0) {
    const h = ao(d, t, n, o);
    c.push(...h);
  }
  return { changes: c, updatedInternals: l };
}
async function ny({ delta: e, panZoom: t, transform: n, translateExtent: r, width: o, height: i }) {
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
function mi(e, t, n, r, o, i) {
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
function Sa(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: o, target: i, sourceHandle: s = null, targetHandle: a = null } = r, l = { edgeId: r.id, source: o, target: i, sourceHandle: s, targetHandle: a }, c = `${o}-${s}--${i}-${a}`, u = `${i}-${a}--${o}-${s}`;
    mi("source", l, u, e, o, s), mi("target", l, c, e, i, a), t.set(r.id, r);
  }
}
function Na(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : Na(n, t) : !1;
}
function yi(e, t, n) {
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
function ry(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const [i, s] of e)
    if ((s.selected || s.id === r) && (!s.parentId || !Na(s, e)) && (s.draggable || t && typeof s.draggable > "u")) {
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
function hr({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
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
function oy({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const o = e.values().next().value;
  if (!o)
    return null;
  const i = {
    x: n - o.distance.x,
    y: r - o.distance.y
  }, s = Qt(i, t);
  return {
    x: s.x - i.x,
    y: s.y - i.y
  };
}
function iy({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: o }) {
  let i = { x: null, y: null }, s = 0, a = /* @__PURE__ */ new Map(), l = !1, c = { x: 0, y: 0 }, u = null, f = !1, d = null, h = !1, p = !1, w = null;
  function b({ noDragClassName: _, handleSelector: m, domNode: x, isSelectable: k, nodeId: E, nodeClickDistance: I = 0 }) {
    d = ye(x);
    function A({ x: H, y: D }) {
      const { nodeLookup: y, nodeExtent: N, snapGrid: S, snapToGrid: M, nodeOrigin: T, onNodeDrag: C, onSelectionDrag: z, onError: O, updateNodePositions: V } = t();
      i = { x: H, y: D };
      let j = !1;
      const Y = a.size > 1, K = Y && N ? Ar(Zt(a)) : null, ee = Y && M ? oy({
        dragItems: a,
        snapGrid: S,
        x: H,
        y: D
      }) : null;
      for (const [q, P] of a) {
        if (!y.has(q))
          continue;
        let F = { x: H - P.distance.x, y: D - P.distance.y };
        M && (F = ee ? {
          x: Math.round(F.x + ee.x),
          y: Math.round(F.y + ee.y)
        } : Qt(F, S));
        let U = null;
        if (Y && N && !P.extent && K) {
          const { positionAbsolute: Q } = P.internals, J = Q.x - K.x + N[0][0], te = Q.x + P.measured.width - K.x2 + N[1][0], ne = Q.y - K.y + N[0][1], B = Q.y + P.measured.height - K.y2 + N[1][1];
          U = [
            [J, ne],
            [te, B]
          ];
        }
        const { position: Z, positionAbsolute: X } = la({
          nodeId: q,
          nextPosition: F,
          nodeLookup: y,
          nodeExtent: U || N,
          nodeOrigin: T,
          onError: O
        });
        j = j || P.position.x !== Z.x || P.position.y !== Z.y, P.position = Z, P.internals.positionAbsolute = X;
      }
      if (p = p || j, !!j && (V(a, !0), w && (r || C || !E && z))) {
        const [q, P] = hr({
          nodeId: E,
          dragItems: a,
          nodeLookup: y
        });
        r == null || r(w, a, q, P), C == null || C(w, q, P), E || z == null || z(w, P);
      }
    }
    async function $() {
      if (!u)
        return;
      const { transform: H, panBy: D, autoPanSpeed: y, autoPanOnNodeDrag: N } = t();
      if (!N) {
        l = !1, cancelAnimationFrame(s);
        return;
      }
      const [S, M] = to(c, u, y);
      (S !== 0 || M !== 0) && (i.x = (i.x ?? 0) - S / H[2], i.y = (i.y ?? 0) - M / H[2], await D({ x: S, y: M }) && A(i)), s = requestAnimationFrame($);
    }
    function R(H) {
      var Y;
      const { nodeLookup: D, multiSelectionActive: y, nodesDraggable: N, transform: S, snapGrid: M, snapToGrid: T, selectNodesOnDrag: C, onNodeDragStart: z, onSelectionDragStart: O, unselectNodesAndEdges: V } = t();
      f = !0, (!C || !k) && !y && E && ((Y = D.get(E)) != null && Y.selected || V()), k && C && E && (e == null || e(E));
      const j = zt(H.sourceEvent, { transform: S, snapGrid: M, snapToGrid: T, containerBounds: u });
      if (i = j, a = ry(D, N, j, E), a.size > 0 && (n || z || !E && O)) {
        const [K, ee] = hr({
          nodeId: E,
          dragItems: a,
          nodeLookup: D
        });
        n == null || n(H.sourceEvent, a, K, ee), z == null || z(H.sourceEvent, K, ee), E || O == null || O(H.sourceEvent, ee);
      }
    }
    const L = Fs().clickDistance(I).on("start", (H) => {
      const { domNode: D, nodeDragThreshold: y, transform: N, snapGrid: S, snapToGrid: M } = t();
      u = (D == null ? void 0 : D.getBoundingClientRect()) || null, h = !1, p = !1, w = H.sourceEvent, y === 0 && R(H), i = zt(H.sourceEvent, { transform: N, snapGrid: S, snapToGrid: M, containerBounds: u }), c = Ne(H.sourceEvent, u);
    }).on("drag", (H) => {
      const { autoPanOnNodeDrag: D, transform: y, snapGrid: N, snapToGrid: S, nodeDragThreshold: M, nodeLookup: T } = t(), C = zt(H.sourceEvent, { transform: y, snapGrid: N, snapToGrid: S, containerBounds: u });
      if (w = H.sourceEvent, (H.sourceEvent.type === "touchmove" && H.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      E && !T.has(E)) && (h = !0), !h) {
        if (!l && D && f && (l = !0, $()), !f) {
          const z = Ne(H.sourceEvent, u), O = z.x - c.x, V = z.y - c.y;
          Math.sqrt(O * O + V * V) > M && R(H);
        }
        (i.x !== C.xSnapped || i.y !== C.ySnapped) && a && f && (c = Ne(H.sourceEvent, u), A(C));
      }
    }).on("end", (H) => {
      if (!f || h) {
        h && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (l = !1, f = !1, cancelAnimationFrame(s), a.size > 0) {
        const { nodeLookup: D, updateNodePositions: y, onNodeDragStop: N, onSelectionDragStop: S } = t();
        if (p && (y(a, !1), p = !1), o || N || !E && S) {
          const [M, T] = hr({
            nodeId: E,
            dragItems: a,
            nodeLookup: D,
            dragging: !1
          });
          o == null || o(H.sourceEvent, a, M, T), N == null || N(H.sourceEvent, M, T), E || S == null || S(H.sourceEvent, T);
        }
      }
    }).filter((H) => {
      const D = H.target;
      return !H.button && (!_ || !yi(D, `.${_}`, x)) && (!m || yi(D, m, x));
    });
    d.call(L);
  }
  function g() {
    d == null || d.on(".drag", null);
  }
  return {
    update: b,
    destroy: g
  };
}
function sy(e, t, n) {
  const r = [], o = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const i of t.values())
    Tn(o, Ft(i)) > 0 && r.push(i);
  return r;
}
const ay = 250;
function ly(e, t, n, r) {
  var a, l;
  let o = [], i = 1 / 0;
  const s = sy(e, n, t + ay);
  for (const c of s) {
    const u = [...((a = c.internals.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = c.internals.handleBounds) == null ? void 0 : l.target) ?? []];
    for (const f of u) {
      if (r.nodeId === f.nodeId && r.type === f.type && r.id === f.id)
        continue;
      const { x: d, y: h } = ut(c, f, f.position, !0), p = Math.sqrt(Math.pow(d - e.x, 2) + Math.pow(h - e.y, 2));
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
function Ca(e, t, n, r, o, i = !1) {
  var c, u, f;
  const s = r.get(e);
  if (!s)
    return null;
  const a = o === "strict" ? (c = s.internals.handleBounds) == null ? void 0 : c[t] : [...((u = s.internals.handleBounds) == null ? void 0 : u.source) ?? [], ...((f = s.internals.handleBounds) == null ? void 0 : f.target) ?? []], l = (n ? a == null ? void 0 : a.find((d) => d.id === n) : a == null ? void 0 : a[0]) ?? null;
  return l && i ? { ...l, ...ut(s, l, l.position, !0) } : l;
}
function Ma(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function cy(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const Ia = () => !0;
function uy(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: o, edgeUpdaterType: i, isTarget: s, domNode: a, nodeLookup: l, lib: c, autoPanOnConnect: u, flowId: f, panBy: d, cancelConnection: h, onConnectStart: p, onConnect: w, onConnectEnd: b, isValidConnection: g = Ia, onReconnectEnd: _, updateConnection: m, getTransform: x, getFromHandle: k, autoPanSpeed: E, dragThreshold: I = 1, handleDomNode: A }) {
  const $ = ma(e.target);
  let R = 0, L;
  const { x: H, y: D } = Ne(e), y = Ma(i, A), N = a == null ? void 0 : a.getBoundingClientRect();
  let S = !1;
  if (!N || !y)
    return;
  const M = Ca(o, y, r, l, t);
  if (!M)
    return;
  let T = Ne(e, N), C = !1, z = null, O = !1, V = null;
  function j() {
    if (!u || !N)
      return;
    const [Z, X] = to(T, N, E);
    d({ x: Z, y: X }), R = requestAnimationFrame(j);
  }
  const Y = {
    ...M,
    nodeId: o,
    type: y,
    position: M.position
  }, K = l.get(o);
  let q = {
    inProgress: !0,
    isValid: null,
    from: ut(K, Y, G.Left, !0),
    fromHandle: Y,
    fromPosition: Y.position,
    fromNode: K,
    to: T,
    toHandle: null,
    toPosition: ii[Y.position],
    toNode: null,
    pointer: T
  };
  function P() {
    S = !0, m(q), p == null || p(e, { nodeId: o, handleId: r, handleType: y });
  }
  I === 0 && P();
  function F(Z) {
    if (!S) {
      const { x: B, y: se } = Ne(Z), be = B - H, Te = se - D;
      if (!(be * be + Te * Te > I * I))
        return;
      P();
    }
    if (!k() || !Y) {
      U(Z);
      return;
    }
    const X = x();
    T = Ne(Z, N), L = ly(Jt(T, X, !1, [1, 1]), n, l, Y), C || (j(), C = !0);
    const Q = $a(Z, {
      handle: L,
      connectionMode: t,
      fromNodeId: o,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: g,
      doc: $,
      lib: c,
      flowId: f,
      nodeLookup: l
    });
    V = Q.handleDomNode, z = Q.connection, O = cy(!!L, Q.isValid);
    const J = l.get(o), te = J ? ut(J, Y, G.Left, !0) : q.from, ne = {
      ...q,
      from: te,
      isValid: O,
      to: Q.toHandle && O ? Et({ x: Q.toHandle.x, y: Q.toHandle.y }, X) : T,
      toHandle: Q.toHandle,
      toPosition: O && Q.toHandle ? Q.toHandle.position : ii[Y.position],
      toNode: Q.toHandle ? l.get(Q.toHandle.nodeId) : null,
      pointer: T
    };
    m(ne), q = ne;
  }
  function U(Z) {
    if (!("touches" in Z && Z.touches.length > 0)) {
      if (S) {
        (L || V) && z && O && (w == null || w(z));
        const { inProgress: X, ...Q } = q, J = {
          ...Q,
          toPosition: q.toHandle ? q.toPosition : null
        };
        b == null || b(Z, J), i && (_ == null || _(Z, J));
      }
      h(), cancelAnimationFrame(R), C = !1, O = !1, z = null, V = null, $.removeEventListener("mousemove", F), $.removeEventListener("mouseup", U), $.removeEventListener("touchmove", F), $.removeEventListener("touchend", U);
    }
  }
  $.addEventListener("mousemove", F), $.addEventListener("mouseup", U), $.addEventListener("touchmove", F), $.addEventListener("touchend", U);
}
function $a(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: o, fromType: i, doc: s, lib: a, flowId: l, isValidConnection: c = Ia, nodeLookup: u }) {
  const f = i === "target", d = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: h, y: p } = Ne(e), w = s.elementFromPoint(h, p), b = w != null && w.classList.contains(`${a}-flow__handle`) ? w : d, g = {
    handleDomNode: b,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (b) {
    const _ = Ma(void 0, b), m = b.getAttribute("data-nodeid"), x = b.getAttribute("data-handleid"), k = b.classList.contains("connectable"), E = b.classList.contains("connectableend");
    if (!m || !_)
      return g;
    const I = {
      source: f ? m : r,
      sourceHandle: f ? x : o,
      target: f ? r : m,
      targetHandle: f ? o : x
    };
    g.connection = I;
    const $ = k && E && (n === xt.Strict ? f && _ === "source" || !f && _ === "target" : m !== r || x !== o);
    g.isValid = $ && c(I), g.toHandle = Ca(m, _, x, u, n, !0);
  }
  return g;
}
const Or = {
  onPointerDown: uy,
  isValid: $a
};
function dy({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const o = ye(e);
  function i({ translateExtent: a, width: l, height: c, zoomStep: u = 1, pannable: f = !0, zoomable: d = !0, inversePan: h = !1 }) {
    const p = (m) => {
      if (m.sourceEvent.type !== "wheel" || !t)
        return;
      const x = n(), k = m.sourceEvent.ctrlKey && Wt() ? 10 : 1, E = -m.sourceEvent.deltaY * (m.sourceEvent.deltaMode === 1 ? 0.05 : m.sourceEvent.deltaMode ? 1 : 2e-3) * u, I = x[2] * Math.pow(2, E * k);
      t.scaleTo(I);
    };
    let w = [0, 0];
    const b = (m) => {
      (m.sourceEvent.type === "mousedown" || m.sourceEvent.type === "touchstart") && (w = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ]);
    }, g = (m) => {
      const x = n();
      if (m.sourceEvent.type !== "mousemove" && m.sourceEvent.type !== "touchmove" || !t)
        return;
      const k = [
        m.sourceEvent.clientX ?? m.sourceEvent.touches[0].clientX,
        m.sourceEvent.clientY ?? m.sourceEvent.touches[0].clientY
      ], E = [k[0] - w[0], k[1] - w[1]];
      w = k;
      const I = r() * Math.max(x[2], Math.log(x[2])) * (h ? -1 : 1), A = {
        x: x[0] - E[0] * I,
        y: x[1] - E[1] * I
      }, $ = [
        [0, 0],
        [l, c]
      ];
      t.setViewportConstrained({
        x: A.x,
        y: A.y,
        zoom: x[2]
      }, $, a);
    }, _ = ra().on("start", b).on("zoom", f ? g : null).on("zoom.wheel", d ? p : null);
    o.call(_, {});
  }
  function s() {
    o.on("zoom", null);
  }
  return {
    update: i,
    destroy: s,
    pointer: Ee
  };
}
const Xn = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), pr = ({ x: e, y: t, zoom: n }) => Wn.translate(e, t).scale(n), Xe = (e, t) => e.target.closest(`.${t}`), Aa = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), fy = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, gr = (e, t = 0, n = fy, r = () => {
}) => {
  const o = typeof t == "number" && t > 0;
  return o || r(), o ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Ta = (e) => {
  const t = e.ctrlKey && Wt() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function hy({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: o, panOnScrollSpeed: i, zoomOnPinch: s, onPanZoomStart: a, onPanZoom: l, onPanZoomEnd: c }) {
  return (u) => {
    if (Xe(u, t))
      return u.ctrlKey && u.preventDefault(), !1;
    u.preventDefault(), u.stopImmediatePropagation();
    const f = n.property("__zoom").k || 1;
    if (u.ctrlKey && s) {
      const b = Ee(u), g = Ta(u), _ = f * Math.pow(2, g);
      r.scaleTo(n, _, b, u);
      return;
    }
    const d = u.deltaMode === 1 ? 20 : 1;
    let h = o === it.Vertical ? 0 : u.deltaX * d, p = o === it.Horizontal ? 0 : u.deltaY * d;
    !Wt() && u.shiftKey && o !== it.Vertical && (h = u.deltaY * d, p = 0), r.translateBy(
      n,
      -(h / f) * i,
      -(p / f) * i,
      // @ts-ignore
      { internal: !0 }
    );
    const w = Xn(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? l == null || l(u, w) : (e.isPanScrolling = !0, a == null || a(u, w)), e.panScrollTimeout = setTimeout(() => {
      c == null || c(u, w), e.isPanScrolling = !1;
    }, 150);
  };
}
function py({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, o) {
    const i = r.type === "wheel", s = !t && i && !r.ctrlKey, a = Xe(r, e);
    if (r.ctrlKey && i && a && r.preventDefault(), s || a)
      return null;
    r.preventDefault(), n.call(this, r, o);
  };
}
function gy({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var i, s, a;
    if ((i = r.sourceEvent) != null && i.internal)
      return;
    const o = Xn(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = o, ((a = r.sourceEvent) == null ? void 0 : a.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, o));
  };
}
function my({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: o }) {
  return (i) => {
    var s, a;
    e.usedRightMouseButton = !!(n && Aa(t, e.mouseButton ?? 0)), (s = i.sourceEvent) != null && s.sync || r([i.transform.x, i.transform.y, i.transform.k]), o && !((a = i.sourceEvent) != null && a.internal) && (o == null || o(i.sourceEvent, Xn(i.transform)));
  };
}
function yy({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: o, onPaneContextMenu: i }) {
  return (s) => {
    var a;
    if (!((a = s.sourceEvent) != null && a.internal) && (e.isZoomingOrPanning = !1, i && Aa(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && s.sourceEvent && i(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), o)) {
      const l = Xn(s.transform);
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
function wy({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: o, panOnScroll: i, zoomOnDoubleClick: s, userSelectionActive: a, noWheelClassName: l, noPanClassName: c, lib: u, connectionInProgress: f }) {
  return (d) => {
    var g;
    const h = t || n, p = r && d.ctrlKey, w = d.type === "wheel";
    if (d.button === 1 && d.type === "mousedown" && (Xe(d, `${u}-flow__node`) || Xe(d, `${u}-flow__edge`) || Xe(d, `${u}-flow__selection`) || Xe(d, `${u}-flow__nodesselection`)))
      return !0;
    if (!o && !h && !i && !s && !r || a || f && !w || Xe(d, l) && w || Xe(d, c) && (!w || i && w && !t) || !r && d.ctrlKey && w)
      return !1;
    if (!r && d.type === "touchstart" && ((g = d.touches) == null ? void 0 : g.length) > 1)
      return d.preventDefault(), !1;
    if (!h && !i && !p && w || !o && (d.type === "mousedown" || d.type === "touchstart") || Array.isArray(o) && !o.includes(d.button) && d.type === "mousedown")
      return !1;
    const b = Array.isArray(o) && o.includes(d.button) || !d.button || d.button <= 1;
    return (!d.ctrlKey || w || e) && b;
  };
}
function by({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: o, onPanZoom: i, onPanZoomStart: s, onPanZoomEnd: a, onDraggingChange: l }) {
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
  const d = typeof ResizeObserver < "u" ? new ResizeObserver((D) => {
    const y = D[0];
    y && (f = [
      [0, 0],
      [y.contentRect.width, y.contentRect.height]
    ]);
  }) : null;
  d == null || d.observe(e);
  const h = ra().extent(() => f).scaleExtent([t, n]).translateExtent(r), p = ye(e).call(h);
  x({
    x: o.x,
    y: o.y,
    zoom: _t(o.zoom, t, n)
  }, [
    [0, 0],
    [u.width, u.height]
  ], r);
  const w = p.on("wheel.zoom"), b = p.on("dblclick.zoom");
  h.wheelDelta(Ta);
  async function g(D, y) {
    return p ? new Promise((N) => {
      h == null || h.interpolate((y == null ? void 0 : y.interpolate) === "linear" ? Lt : gn).transform(gr(p, y == null ? void 0 : y.duration, y == null ? void 0 : y.ease, () => N(!0)), D);
    }) : !1;
  }
  function _({ noWheelClassName: D, noPanClassName: y, onPaneContextMenu: N, userSelectionActive: S, panOnScroll: M, panOnDrag: T, panOnScrollMode: C, panOnScrollSpeed: z, preventScrolling: O, zoomOnPinch: V, zoomOnScroll: j, zoomOnDoubleClick: Y, panActivationKeyPressed: K = !1, zoomActivationKeyPressed: ee, lib: q, onTransformChange: P, connectionInProgress: F, paneClickDistance: U, selectionOnDrag: Z }) {
    S && !c.isZoomingOrPanning && m();
    const X = M && !ee && !S;
    h.clickDistance(Z ? 1 / 0 : !Se(U) || U < 0 ? 0 : U);
    const Q = X ? hy({
      zoomPanValues: c,
      noWheelClassName: D,
      d3Selection: p,
      d3Zoom: h,
      panOnScrollMode: C,
      panOnScrollSpeed: z,
      zoomOnPinch: V,
      onPanZoomStart: s,
      onPanZoom: i,
      onPanZoomEnd: a
    }) : py({
      noWheelClassName: D,
      preventScrolling: O,
      d3ZoomHandler: w
    });
    p.on("wheel.zoom", Q, { passive: !1 });
    const J = gy({
      zoomPanValues: c,
      onDraggingChange: l,
      onPanZoomStart: s
    });
    h.on("start", J);
    const te = my({
      zoomPanValues: c,
      panOnDrag: T,
      onPaneContextMenu: !!N,
      onPanZoom: i,
      onTransformChange: P
    });
    h.on("zoom", te);
    const ne = yy({
      zoomPanValues: c,
      panOnDrag: T,
      panOnScroll: M,
      onPaneContextMenu: N,
      onPanZoomEnd: a,
      onDraggingChange: l
    });
    h.on("end", ne);
    const B = wy({
      panActivationKeyPressed: K,
      zoomActivationKeyPressed: ee,
      panOnDrag: T,
      zoomOnScroll: j,
      panOnScroll: M,
      zoomOnDoubleClick: Y,
      zoomOnPinch: V,
      userSelectionActive: S,
      noPanClassName: y,
      noWheelClassName: D,
      lib: q,
      connectionInProgress: F
    });
    h.filter(B), Y ? p.on("dblclick.zoom", b) : p.on("dblclick.zoom", null);
  }
  function m() {
    h.on("zoom", null);
  }
  async function x(D, y, N) {
    const S = pr(D), M = h == null ? void 0 : h.constrain()(S, y, N);
    return M && await g(M), M;
  }
  async function k(D, y) {
    const N = pr(D);
    return await g(N, y), N;
  }
  function E(D) {
    if (p) {
      const y = pr(D), N = p.property("__zoom");
      (N.k !== D.zoom || N.x !== D.x || N.y !== D.y) && (h == null || h.transform(p, y, null, { sync: !0 }));
    }
  }
  function I() {
    const D = p ? na(p.node()) : { x: 0, y: 0, k: 1 };
    return { x: D.x, y: D.y, zoom: D.k };
  }
  async function A(D, y) {
    return p ? new Promise((N) => {
      h == null || h.interpolate((y == null ? void 0 : y.interpolate) === "linear" ? Lt : gn).scaleTo(gr(p, y == null ? void 0 : y.duration, y == null ? void 0 : y.ease, () => N(!0)), D);
    }) : !1;
  }
  async function $(D, y) {
    return p ? new Promise((N) => {
      h == null || h.interpolate((y == null ? void 0 : y.interpolate) === "linear" ? Lt : gn).scaleBy(gr(p, y == null ? void 0 : y.duration, y == null ? void 0 : y.ease, () => N(!0)), D);
    }) : !1;
  }
  function R(D) {
    h == null || h.scaleExtent(D);
  }
  function L(D) {
    h == null || h.translateExtent(D);
  }
  function H(D) {
    const y = !Se(D) || D < 0 ? 0 : D;
    h == null || h.clickDistance(y);
  }
  return {
    update: _,
    destroy: m,
    setViewport: k,
    setViewportConstrained: x,
    getViewport: I,
    scaleTo: A,
    scaleBy: $,
    setScaleExtent: R,
    setTranslateExtent: L,
    syncViewport: E,
    setClickDistance: H
  };
}
var kt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(kt || (kt = {}));
function xy({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: o, affectsY: i }) {
  const s = e - t, a = n - r, l = [s > 0 ? 1 : s < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return s && o && (l[0] = l[0] * -1), a && i && (l[1] = l[1] * -1), l;
}
function wi(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), o = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: o
  };
}
function je(e, t) {
  return Math.max(0, t - e);
}
function Ge(e, t) {
  return Math.max(0, e - t);
}
function un(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function bi(e, t) {
  return e ? !t : t;
}
function vy(e, t, n, r, o, i, s, a) {
  let { affectsX: l, affectsY: c } = t;
  const { isHorizontal: u, isVertical: f } = t, d = u && f, { xSnapped: h, ySnapped: p } = n, { minWidth: w, maxWidth: b, minHeight: g, maxHeight: _ } = r, { x: m, y: x, width: k, height: E, aspectRatio: I } = e;
  let A = Math.floor(u ? h - e.pointerX : 0), $ = Math.floor(f ? p - e.pointerY : 0);
  const R = k + (l ? -A : A), L = E + (c ? -$ : $), H = -i[0] * k, D = -i[1] * E;
  let y = un(R, w, b), N = un(L, g, _);
  if (s) {
    let T = 0, C = 0;
    l && A < 0 ? T = je(m + A + H, s[0][0]) : !l && A > 0 && (T = Ge(m + R + H, s[1][0])), c && $ < 0 ? C = je(x + $ + D, s[0][1]) : !c && $ > 0 && (C = Ge(x + L + D, s[1][1])), y = Math.max(y, T), N = Math.max(N, C);
  }
  if (a) {
    let T = 0, C = 0;
    l && A > 0 ? T = Ge(m + A, a[0][0]) : !l && A < 0 && (T = je(m + R, a[1][0])), c && $ > 0 ? C = Ge(x + $, a[0][1]) : !c && $ < 0 && (C = je(x + L, a[1][1])), y = Math.max(y, T), N = Math.max(N, C);
  }
  if (o) {
    if (u) {
      const T = un(R / I, g, _) * I;
      if (y = Math.max(y, T), s) {
        let C = 0;
        !l && !c || l && !c && d ? C = Ge(x + D + R / I, s[1][1]) * I : C = je(x + D + (l ? A : -A) / I, s[0][1]) * I, y = Math.max(y, C);
      }
      if (a) {
        let C = 0;
        !l && !c || l && !c && d ? C = je(x + R / I, a[1][1]) * I : C = Ge(x + (l ? A : -A) / I, a[0][1]) * I, y = Math.max(y, C);
      }
    }
    if (f) {
      const T = un(L * I, w, b) / I;
      if (N = Math.max(N, T), s) {
        let C = 0;
        !l && !c || c && !l && d ? C = Ge(m + L * I + H, s[1][0]) / I : C = je(m + (c ? $ : -$) * I + H, s[0][0]) / I, N = Math.max(N, C);
      }
      if (a) {
        let C = 0;
        !l && !c || c && !l && d ? C = je(m + L * I, a[1][0]) / I : C = Ge(m + (c ? $ : -$) * I, a[0][0]) / I, N = Math.max(N, C);
      }
    }
  }
  $ = $ + ($ < 0 ? N : -N), A = A + (A < 0 ? y : -y), o && (d ? R > L * I ? $ = (bi(l, c) ? -A : A) / I : A = (bi(l, c) ? -$ : $) * I : u ? ($ = A / I, c = l) : (A = $ * I, l = c));
  const S = l ? m + A : m, M = c ? x + $ : x;
  return {
    width: k + (l ? -A : A),
    height: E + (c ? -$ : $),
    x: i[0] * A * (l ? -1 : 1) + S,
    y: i[1] * $ * (c ? -1 : 1) + M
  };
}
const La = { width: 0, height: 0, x: 0, y: 0 }, _y = {
  ...La,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function Ey(e, t, n) {
  const r = t.position.x + e.position.x, o = t.position.y + e.position.y, i = e.measured.width ?? 0, s = e.measured.height ?? 0, a = n[0] * i, l = n[1] * s;
  return [
    [r - a, o - l],
    [r + i - a, o + s - l]
  ];
}
function ky({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: o }) {
  const i = ye(e);
  let s = {
    controlDirection: wi("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: c, boundaries: u, keepAspectRatio: f, resizeDirection: d, onResizeStart: h, onResize: p, onResizeEnd: w, shouldResize: b }) {
    let g = { ...La }, _ = { ..._y };
    s = {
      boundaries: u,
      resizeDirection: d,
      keepAspectRatio: f,
      controlDirection: wi(c)
    };
    let m, x = null, k = [], E, I, A;
    const $ = Fs().on("start", (R) => {
      const { nodeLookup: L, transform: H, snapGrid: D, snapToGrid: y, nodeOrigin: N, paneDomNode: S } = n();
      if (m = L.get(t), !m)
        return;
      x = (S == null ? void 0 : S.getBoundingClientRect()) ?? null;
      const { xSnapped: M, ySnapped: T } = zt(R.sourceEvent, {
        transform: H,
        snapGrid: D,
        snapToGrid: y,
        containerBounds: x
      });
      g = {
        width: m.measured.width ?? 0,
        height: m.measured.height ?? 0,
        x: m.position.x ?? 0,
        y: m.position.y ?? 0
      }, _ = {
        ...g,
        pointerX: M,
        pointerY: T,
        aspectRatio: g.width / g.height
      }, E = void 0, I = ct(m.extent) ? m.extent : void 0, m.parentId && (m.extent === "parent" || m.expandParent) && (E = L.get(m.parentId)), E && m.extent === "parent" && (I = [
        [0, 0],
        [E.measured.width, E.measured.height]
      ]), k = [], A = void 0;
      for (const [C, z] of L)
        if (z.parentId === t && (k.push({
          id: C,
          position: { ...z.position },
          extent: z.extent
        }), z.extent === "parent" || z.expandParent)) {
          const O = Ey(z, m, z.origin ?? N);
          A ? A = [
            [Math.min(O[0][0], A[0][0]), Math.min(O[0][1], A[0][1])],
            [Math.max(O[1][0], A[1][0]), Math.max(O[1][1], A[1][1])]
          ] : A = O;
        }
      h == null || h(R, { ...g });
    }).on("drag", (R) => {
      const { transform: L, snapGrid: H, snapToGrid: D, nodeOrigin: y } = n(), N = zt(R.sourceEvent, {
        transform: L,
        snapGrid: H,
        snapToGrid: D,
        containerBounds: x
      }), S = [];
      if (!m)
        return;
      const { x: M, y: T, width: C, height: z } = g, O = {}, V = m.origin ?? y, { width: j, height: Y, x: K, y: ee } = vy(_, s.controlDirection, N, s.boundaries, s.keepAspectRatio, V, I, A), q = j !== C, P = Y !== z, F = K !== M && q, U = ee !== T && P;
      if (!F && !U && !q && !P)
        return;
      const Z = {
        prevValues: { ...g },
        startX: _.x,
        startY: _.y,
        childNodes: k.map((te) => ({
          ...te,
          position: { ...te.position }
        }))
      };
      if ((F || U || V[0] === 1 || V[1] === 1) && (O.x = F ? K : g.x, O.y = U ? ee : g.y, g.x = O.x, g.y = O.y, k.length > 0)) {
        const te = K - M, ne = ee - T;
        for (const B of k)
          B.position = {
            x: B.position.x - te + V[0] * (j - C),
            y: B.position.y - ne + V[1] * (Y - z)
          }, S.push(B);
      }
      if ((q || P) && (O.width = q && (!s.resizeDirection || s.resizeDirection === "horizontal") ? j : g.width, O.height = P && (!s.resizeDirection || s.resizeDirection === "vertical") ? Y : g.height, g.width = O.width, g.height = O.height), E && m.expandParent) {
        const te = V[0] * (O.width ?? 0);
        O.x && O.x < te && (g.x = te, _.x = _.x - (O.x - te));
        const ne = V[1] * (O.height ?? 0);
        O.y && O.y < ne && (g.y = ne, _.y = _.y - (O.y - ne));
      }
      const X = xy({
        width: g.width,
        prevWidth: C,
        height: g.height,
        prevHeight: z,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), Q = { ...g, direction: X };
      if ((b == null ? void 0 : b(R, Q)) === !1) {
        g = Z.prevValues, _.x = Z.startX, _.y = Z.startY, k.forEach((te, ne) => {
          te.position = Z.childNodes[ne].position;
        });
        return;
      }
      p == null || p(R, Q), r(O, S);
    }).on("end", (R) => {
      w == null || w(R, { ...g }), o == null || o({ ...g });
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
var za = { exports: {} }, Oa = {}, Pa = { exports: {} }, Da = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var St = Br;
function Sy(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Ny = typeof Object.is == "function" ? Object.is : Sy, Cy = St.useState, My = St.useEffect, Iy = St.useLayoutEffect, $y = St.useDebugValue;
function Ay(e, t) {
  var n = t(), r = Cy({ inst: { value: n, getSnapshot: t } }), o = r[0].inst, i = r[1];
  return Iy(
    function() {
      o.value = n, o.getSnapshot = t, mr(o) && i({ inst: o });
    },
    [e, n, t]
  ), My(
    function() {
      return mr(o) && i({ inst: o }), e(function() {
        mr(o) && i({ inst: o });
      });
    },
    [e]
  ), $y(n), n;
}
function mr(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Ny(e, n);
  } catch {
    return !0;
  }
}
function Ty(e, t) {
  return t();
}
var Ly = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Ty : Ay;
Da.useSyncExternalStore = St.useSyncExternalStore !== void 0 ? St.useSyncExternalStore : Ly;
Pa.exports = Da;
var zy = Pa.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qn = Br, Oy = zy;
function Py(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Dy = typeof Object.is == "function" ? Object.is : Py, Ry = Oy.useSyncExternalStore, Hy = qn.useRef, Vy = qn.useEffect, By = qn.useMemo, Fy = qn.useDebugValue;
Oa.useSyncExternalStoreWithSelector = function(e, t, n, r, o) {
  var i = Hy(null);
  if (i.current === null) {
    var s = { hasValue: !1, value: null };
    i.current = s;
  } else s = i.current;
  i = By(
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
        if (p = f, Dy(u, h)) return p;
        var w = r(h);
        return o !== void 0 && o(p, w) ? (u = h, p) : (u = h, f = w);
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
  var a = Ry(e, i[0], i[1]);
  return Vy(
    function() {
      s.hasValue = !0, s.value = a;
    },
    [a]
  ), Fy(a), a;
};
za.exports = Oa;
var Wy = za.exports;
const Yy = /* @__PURE__ */ ts(Wy), jy = {}, xi = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (u, f) => {
    const d = typeof u == "function" ? u(t) : u;
    if (!Object.is(d, t)) {
      const h = t;
      t = f ?? (typeof d != "object" || d === null) ? d : Object.assign({}, t, d), n.forEach((p) => p(t, h));
    }
  }, o = () => t, l = { setState: r, getState: o, getInitialState: () => c, subscribe: (u) => (n.add(u), () => n.delete(u)), destroy: () => {
    (jy ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, c = t = e(r, o, l);
  return l;
}, Gy = (e) => e ? xi(e) : xi, { useDebugValue: Xy } = Br, { useSyncExternalStoreWithSelector: qy } = Yy, Uy = (e) => e;
function Ra(e, t = Uy, n) {
  const r = qy(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Xy(r), r;
}
const vi = (e, t) => {
  const n = Gy(e), r = (o, i = t) => Ra(n, o, i);
  return Object.assign(r, n), r;
}, Ky = (e, t) => e ? vi(e, t) : vi;
function ue(e, t) {
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
const Un = Pn(null), Zy = Un.Provider, Ha = Me.error001("react");
function oe(e, t) {
  const n = Nt(Un);
  if (n === null)
    throw new Error(Ha);
  return Ra(n, e, t);
}
function le() {
  const e = Nt(Un);
  if (e === null)
    throw new Error(Ha);
  return ce(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const _i = { display: "none" }, Qy = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Va = "react-flow__node-desc", Ba = "react-flow__edge-desc", Jy = "react-flow__aria-live", ew = (e) => e.ariaLiveMessage, tw = (e) => e.ariaLabelConfig;
function nw({ rfId: e }) {
  const t = oe(ew);
  return v("div", { id: `${Jy}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Qy, children: t });
}
function rw({ rfId: e, disableKeyboardA11y: t }) {
  const n = oe(tw);
  return W(xe, { children: [v("div", { id: `${Va}-${e}`, style: _i, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), v("div", { id: `${Ba}-${e}`, style: _i, children: n["edge.a11yDescription.default"] }), !t && v(nw, { rfId: e })] });
}
const dt = Qi(({ position: e = "top-left", children: t, className: n, style: r, ...o }, i) => {
  const s = `${e}`.split("-");
  return v("div", { className: ge(["react-flow__panel", n, ...s]), style: r, ref: i, ...o, children: t });
});
dt.displayName = "Panel";
const Ei = "https://reactflow.dev?utm_source=attribution";
function ow({ proOptions: e, position: t = "bottom-right" }) {
  return ie(() => {
  }, []), e != null && e.hideAttribution ? null : v(dt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${Ei}`, children: v("a", { href: Ei, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const iw = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, dn = (e) => e.id;
function sw(e, t) {
  return ue(e.selectedNodes.map(dn), t.selectedNodes.map(dn)) && ue(e.selectedEdges.map(dn), t.selectedEdges.map(dn));
}
function aw({ onSelectionChange: e }) {
  const t = le(), { selectedNodes: n, selectedEdges: r } = oe(iw, sw);
  return ie(() => {
    const o = { nodes: n, edges: r };
    e == null || e(o), t.getState().onSelectionChangeHandlers.forEach((i) => i(o));
  }, [n, r, e]), null;
}
const lw = (e) => !!e.onSelectionChangeHandlers;
function cw({ onSelectionChange: e }) {
  const t = oe(lw);
  return e || t ? v(aw, { onSelectionChange: e }) : null;
}
const Fa = [0, 0], uw = { x: 0, y: 0, zoom: 1 }, dw = [
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
], ki = [...dw, "rfId"], fw = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), Si = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Vt,
  nodeOrigin: Fa,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function hw(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: o, setTranslateExtent: i, setNodeExtent: s, reset: a, setDefaultNodesAndEdges: l } = oe(fw, ue), c = le();
  ie(() => (l(e.defaultNodes, e.defaultEdges), () => {
    u.current = Si, a();
  }), []);
  const u = re(Si);
  return ie(
    () => {
      for (const f of ki) {
        const d = e[f], h = u.current[f];
        d !== h && (typeof e[f] > "u" || (f === "nodes" ? t(d) : f === "edges" ? n(d) : f === "minZoom" ? r(d) : f === "maxZoom" ? o(d) : f === "translateExtent" ? i(d) : f === "nodeExtent" ? s(d) : f === "ariaLabelConfig" ? c.setState({ ariaLabelConfig: Dm(d) }) : f === "fitView" ? c.setState({ fitViewQueued: d }) : f === "fitViewOptions" ? c.setState({ fitViewOptions: d }) : c.setState({ [f]: d })));
      }
      u.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    ki.map((f) => e[f])
  ), null;
}
function Ni() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function pw(e) {
  var r;
  const [t, n] = ae(e === "system" ? null : e);
  return ie(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Ni(), i = () => n(o != null && o.matches ? "dark" : "light");
    return i(), o == null || o.addEventListener("change", i), () => {
      o == null || o.removeEventListener("change", i);
    };
  }, [e]), t !== null ? t : (r = Ni()) != null && r.matches ? "dark" : "light";
}
const Ci = typeof document < "u" ? document : null;
function Yt(e = null, t = { target: Ci, actInsideInputWithModifier: !0 }) {
  const [n, r] = ae(!1), o = re(!1), i = re(/* @__PURE__ */ new Set([])), [s, a] = ce(() => {
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
  return ie(() => {
    const l = (t == null ? void 0 : t.target) ?? Ci, c = (t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const u = (h) => {
        var b, g;
        if (o.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!o.current || o.current && !c) && ya(h))
          return !1;
        const w = Ii(h.code, a);
        if (i.current.add(h[w]), Mi(s, i.current, !1)) {
          const _ = ((g = (b = h.composedPath) == null ? void 0 : b.call(h)) == null ? void 0 : g[0]) || h.target, m = (_ == null ? void 0 : _.nodeName) === "BUTTON" || (_ == null ? void 0 : _.nodeName) === "A";
          t.preventDefault !== !1 && (o.current || !m) && h.preventDefault(), r(!0);
        }
      }, f = (h) => {
        const p = Ii(h.code, a);
        Mi(s, i.current, !0) ? (r(!1), i.current.clear()) : i.current.delete(h[p]), h.key === "Meta" && i.current.clear(), o.current = !1;
      }, d = () => {
        i.current.clear(), r(!1);
      };
      return l == null || l.addEventListener("keydown", u), l == null || l.addEventListener("keyup", f), window.addEventListener("blur", d), window.addEventListener("contextmenu", d), () => {
        l == null || l.removeEventListener("keydown", u), l == null || l.removeEventListener("keyup", f), window.removeEventListener("blur", d), window.removeEventListener("contextmenu", d);
      };
    }
  }, [e, r]), n;
}
function Mi(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((o) => t.has(o)));
}
function Ii(e, t) {
  return t.includes(e) ? "code" : "key";
}
const gw = () => {
  const e = le();
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
      const { width: r, height: o, minZoom: i, maxZoom: s, panZoom: a } = e.getState(), l = Gn(t, r, o, i, s, (n == null ? void 0 : n.padding) ?? 0.1);
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
      return Jt(c, r, f, u);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: o, y: i } = r.getBoundingClientRect(), s = Et(t, n);
      return {
        x: s.x + o,
        y: s.y + i
      };
    }
  }), []);
};
function Wa(e, t) {
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
      mw(l, a);
    n.push(a);
  }
  return o.length && o.forEach((i) => {
    i.index !== void 0 ? n.splice(i.index, 0, { ...i.item }) : n.push({ ...i.item });
  }), n;
}
function mw(e, t) {
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
function yw(e, t) {
  return Wa(e, t);
}
function ww(e, t) {
  return Wa(e, t);
}
function tt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function gt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [o, i] of e) {
    const s = t.has(o);
    !(i.selected === void 0 && !s) && i.selected !== s && (n && (i.selected = s), r.push(tt(i.id, s)));
  }
  return r;
}
function $i({ items: e = [], lookup: t }) {
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
function Ai(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const bw = fa();
function xw(e, t, n = {}) {
  return Wm(e, t, {
    ...n,
    onError: n.onError ?? bw
  });
}
const Ti = (e) => Mm(e), vw = (e) => aa(e);
function Ya(e) {
  return Qi(e);
}
const ja = typeof window < "u" ? Ji : ie;
function Li(e) {
  const [t, n] = ae(BigInt(0)), [r] = ae(() => _w(() => n((o) => o + BigInt(1))));
  return ja(() => {
    const o = r.get();
    o.length && (e(o), r.reset());
  }, [t]), r;
}
function _w(e) {
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
const Ga = Pn(null);
function Ew({ children: e }) {
  const t = le(), n = Ce((a) => {
    const { nodes: l = [], setNodes: c, hasDefaultNodes: u, onNodesChange: f, nodeLookup: d, fitViewQueued: h, onNodesChangeMiddlewareMap: p } = t.getState();
    let w = l;
    for (const g of a)
      w = typeof g == "function" ? g(w) : g;
    let b = $i({
      items: w,
      lookup: d
    });
    for (const g of p.values())
      b = g(b);
    u && c(w), b.length > 0 ? f == null || f(b) : h && window.requestAnimationFrame(() => {
      const { fitViewQueued: g, nodes: _, setNodes: m } = t.getState();
      g && m(_);
    });
  }, []), r = Li(n), o = Ce((a) => {
    const { edges: l = [], setEdges: c, hasDefaultEdges: u, onEdgesChange: f, edgeLookup: d } = t.getState();
    let h = l;
    for (const p of a)
      h = typeof p == "function" ? p(h) : p;
    u ? c(h) : f && f($i({
      items: h,
      lookup: d
    }));
  }, []), i = Li(o), s = ce(() => ({ nodeQueue: r, edgeQueue: i }), []);
  return v(Ga.Provider, { value: s, children: e });
}
function kw() {
  const e = Nt(Ga);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Sw = (e) => !!e.panZoom;
function Kn() {
  const e = gw(), t = le(), n = kw(), r = oe(Sw), o = ce(() => {
    const i = (f) => t.getState().nodeLookup.get(f), s = (f) => {
      n.nodeQueue.push(f);
    }, a = (f) => {
      n.edgeQueue.push(f);
    }, l = (f) => {
      var g, _;
      const { nodeLookup: d, nodeOrigin: h } = t.getState(), p = Ti(f) ? f : d.get(f.id), w = p.parentId ? pa(p.position, p.measured, p.parentId, d, h) : p.position, b = {
        ...p,
        position: w,
        width: ((g = p.measured) == null ? void 0 : g.width) ?? p.width,
        height: ((_ = p.measured) == null ? void 0 : _.height) ?? p.height
      };
      return Ft(b);
    }, c = (f, d, h = { replace: !1 }) => {
      s((p) => p.map((w) => {
        if (w.id === f) {
          const b = typeof d == "function" ? d(w) : d;
          return h.replace && Ti(b) ? b : { ...w, ...b };
        }
        return w;
      }));
    }, u = (f, d, h = { replace: !1 }) => {
      a((p) => p.map((w) => {
        if (w.id === f) {
          const b = typeof d == "function" ? d(w) : d;
          return h.replace && vw(b) ? b : { ...w, ...b };
        }
        return w;
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
        const { nodes: f = [], edges: d = [], transform: h } = t.getState(), [p, w, b] = h;
        return {
          nodes: f.map((g) => ({ ...g })),
          edges: d.map((g) => ({ ...g })),
          viewport: {
            x: p,
            y: w,
            zoom: b
          }
        };
      },
      deleteElements: async ({ nodes: f = [], edges: d = [] }) => {
        const { nodes: h, edges: p, onNodesDelete: w, onEdgesDelete: b, triggerNodeChanges: g, triggerEdgeChanges: _, onDelete: m, onBeforeDelete: x } = t.getState(), { nodes: k, edges: E } = await Lm({
          nodesToRemove: f,
          edgesToRemove: d,
          nodes: h,
          edges: p,
          onBeforeDelete: x
        }), I = E.length > 0, A = k.length > 0;
        if (I) {
          const $ = E.map(Ai);
          b == null || b(E), _($);
        }
        if (A) {
          const $ = k.map(Ai);
          w == null || w(k), g($);
        }
        return (A || I) && (m == null || m({ nodes: k, edges: E })), { deletedNodes: k, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (f, d = !0, h) => {
        const p = ai(f), w = p ? f : l(f), b = h !== void 0;
        return w ? (h || t.getState().nodes).filter((g) => {
          const _ = t.getState().nodeLookup.get(g.id);
          if (_ && !p && (g.id === f.id || !_.internals.positionAbsolute))
            return !1;
          const m = Ft(b ? g : _), x = Tn(m, w);
          return d && x > 0 || x >= m.width * m.height || x >= w.width * w.height;
        }) : [];
      },
      isNodeIntersecting: (f, d, h = !0) => {
        const w = ai(f) ? f : l(f);
        if (!w)
          return !1;
        const b = Tn(w, d);
        return h && b > 0 || b >= d.width * d.height || b >= w.width * w.height;
      },
      updateNode: c,
      updateNodeData: (f, d, h = { replace: !1 }) => {
        c(f, (p) => {
          const w = typeof d == "function" ? d(p) : d;
          return h.replace ? { ...p, data: w } : { ...p, data: { ...p.data, ...w } };
        }, h);
      },
      updateEdge: u,
      updateEdgeData: (f, d, h = { replace: !1 }) => {
        u(f, (p) => {
          const w = typeof d == "function" ? d(p) : d;
          return h.replace ? { ...p, data: w } : { ...p, data: { ...p.data, ...w } };
        }, h);
      },
      getNodesBounds: (f) => {
        const { nodeLookup: d, nodeOrigin: h } = t.getState();
        return Im(f, { nodeLookup: d, nodeOrigin: h });
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
        const d = t.getState().fitViewResolver ?? Pm();
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
const zi = (e) => e.selected, Nw = typeof window < "u" ? window : void 0;
function Cw({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = le(), { deleteElements: r } = Kn(), o = Yt(e, { actInsideInputWithModifier: !1 }), i = Yt(t, { target: Nw });
  ie(() => {
    if (o) {
      const { edges: s, nodes: a } = n.getState();
      r({ nodes: a.filter(zi), edges: s.filter(zi) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [o]), ie(() => {
    n.setState({ multiSelectionActive: i });
  }, [i]);
}
function Mw(e) {
  const t = le();
  ie(() => {
    const n = () => {
      var o, i, s, a;
      if (!e.current || !(((i = (o = e.current).checkVisibility) == null ? void 0 : i.call(o)) ?? !0))
        return !1;
      const r = no(e.current);
      (r.height === 0 || r.width === 0) && ((a = (s = t.getState()).onError) == null || a.call(s, "004", Me.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
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
const Zn = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Iw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function $w({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: o, panOnScrollSpeed: i = 0.5, panOnScrollMode: s = it.Free, zoomOnDoubleClick: a = !0, panOnDrag: l = !0, defaultViewport: c, translateExtent: u, minZoom: f, maxZoom: d, zoomActivationKeyCode: h, preventScrolling: p = !0, children: w, noWheelClassName: b, noPanClassName: g, onViewportChange: _, isControlledViewport: m, paneClickDistance: x, selectionOnDrag: k }) {
  const E = le(), I = re(null), { userSelectionActive: A, lib: $, connectionInProgress: R } = oe(Iw, ue), L = Yt(h), H = re();
  Mw(I);
  const D = Ce((y) => {
    _ == null || _({ x: y[0], y: y[1], zoom: y[2] }), m || E.setState({ transform: y });
  }, [_, m]);
  return ie(() => {
    if (I.current) {
      H.current = by({
        domNode: I.current,
        minZoom: f,
        maxZoom: d,
        translateExtent: u,
        viewport: c,
        onDraggingChange: (M) => E.setState((T) => T.paneDragging === M ? T : { paneDragging: M }),
        onPanZoomStart: (M, T) => {
          const { onViewportChangeStart: C, onMoveStart: z } = E.getState();
          z == null || z(M, T), C == null || C(T);
        },
        onPanZoom: (M, T) => {
          const { onViewportChange: C, onMove: z } = E.getState();
          z == null || z(M, T), C == null || C(T);
        },
        onPanZoomEnd: (M, T) => {
          const { onViewportChangeEnd: C, onMoveEnd: z } = E.getState();
          z == null || z(M, T), C == null || C(T);
        }
      });
      const { x: y, y: N, zoom: S } = H.current.getViewport();
      return E.setState({
        panZoom: H.current,
        transform: [y, N, S],
        domNode: I.current.closest(".react-flow")
      }), () => {
        var M;
        (M = H.current) == null || M.destroy();
      };
    }
  }, []), ie(() => {
    var y;
    (y = H.current) == null || y.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: r,
      panActivationKeyPressed: o,
      panOnScrollSpeed: i,
      panOnScrollMode: s,
      zoomOnDoubleClick: a,
      panOnDrag: l,
      zoomActivationKeyPressed: L,
      preventScrolling: p,
      noPanClassName: g,
      userSelectionActive: A,
      noWheelClassName: b,
      lib: $,
      onTransformChange: D,
      connectionInProgress: R,
      selectionOnDrag: k,
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
    L,
    p,
    g,
    A,
    b,
    $,
    D,
    R,
    k,
    x
  ]), v("div", { className: "react-flow__renderer", ref: I, style: Zn, children: w });
}
const Aw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Tw() {
  const { userSelectionActive: e, userSelectionRect: t } = oe(Aw, ue);
  return e && t ? v("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const yr = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, Lw = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function zw({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Bt.Full, panOnDrag: r, autoPanOnSelection: o, paneClickDistance: i, selectionOnDrag: s, onSelectionStart: a, onSelectionEnd: l, onPaneClick: c, onPaneContextMenu: u, onPaneScroll: f, onPaneMouseEnter: d, onPaneMouseMove: h, onPaneMouseLeave: p, children: w }) {
  const b = re(0), g = le(), { userSelectionActive: _, elementsSelectable: m, dragging: x, panBy: k, autoPanSpeed: E } = oe(Lw, ue), I = m && (e || _), A = re(null), $ = re(), R = re(/* @__PURE__ */ new Set()), L = re(/* @__PURE__ */ new Set()), H = re(!1), D = re(!1), y = re({ x: 0, y: 0 }), N = re(!1), S = (P) => {
    if (D.current || H.current || g.getState().connection.inProgress) {
      D.current = !1, H.current = !1;
      return;
    }
    c == null || c(P), g.getState().resetSelectedElements(), g.setState({ nodesSelectionActive: !1 });
  }, M = (P) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      P.preventDefault();
      return;
    }
    u == null || u(P);
  }, T = f ? (P) => f(P) : void 0, C = (P) => {
    D.current && (P.stopPropagation(), D.current = !1);
  }, z = (P) => {
    var B, se;
    if (P.pointerType === "touch" && r !== !1 && !t)
      return;
    const { domNode: F, transform: U } = g.getState();
    if ($.current = F == null ? void 0 : F.getBoundingClientRect(), !$.current)
      return;
    const Z = P.target === A.current;
    if (!Z && !!P.target.closest(".nokey") || !e || !(s && Z || t) || P.button !== 0 || !P.isPrimary)
      return;
    (se = (B = P.target) == null ? void 0 : B.setPointerCapture) == null || se.call(B, P.pointerId), D.current = !1;
    const { x: J, y: te } = Ne(P.nativeEvent, $.current), ne = Jt({ x: J, y: te }, U);
    g.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: ne.x,
        startY: ne.y,
        x: J,
        y: te
      }
    }), Z || (P.stopPropagation(), P.preventDefault());
  };
  function O(P, F) {
    const { userSelectionRect: U } = g.getState();
    if (!U)
      return;
    const { transform: Z, nodeLookup: X, edgeLookup: Q, connectionLookup: J, triggerNodeChanges: te, triggerEdgeChanges: ne, defaultEdgeOptions: B } = g.getState(), se = { x: U.startX, y: U.startY }, { x: be, y: Te } = Et(se, Z), Re = {
      startX: se.x,
      startY: se.y,
      x: P < be ? P : be,
      y: F < Te ? F : Te,
      width: Math.abs(P - be),
      height: Math.abs(F - Te)
    }, Ct = R.current, Ze = L.current;
    R.current = new Set(eo(X, Re, Z, n === Bt.Partial, !0).map((_e) => _e.id)), L.current = /* @__PURE__ */ new Set();
    const Qe = (B == null ? void 0 : B.selectable) ?? !0;
    for (const _e of R.current) {
      const He = J.get(_e);
      if (He)
        for (const { edgeId: Ve } of He.values()) {
          const Je = Q.get(Ve);
          Je && (Je.selectable ?? Qe) && L.current.add(Ve);
        }
    }
    if (!li(Ct, R.current)) {
      const _e = gt(X, R.current, !0);
      te(_e);
    }
    if (!li(Ze, L.current)) {
      const _e = gt(Q, L.current);
      ne(_e);
    }
    g.setState({
      userSelectionRect: Re,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function V() {
    if (!o || !$.current)
      return;
    const [P, F] = to(y.current, $.current, E);
    k({ x: P, y: F }).then((U) => {
      if (!D.current || !U) {
        b.current = requestAnimationFrame(V);
        return;
      }
      const { x: Z, y: X } = y.current;
      O(Z, X), b.current = requestAnimationFrame(V);
    });
  }
  const j = () => {
    cancelAnimationFrame(b.current), b.current = 0, N.current = !1;
  };
  ie(() => () => j(), []);
  const Y = (P) => {
    const { userSelectionRect: F, transform: U, resetSelectedElements: Z } = g.getState();
    if (!$.current || !F)
      return;
    const { x: X, y: Q } = Ne(P.nativeEvent, $.current);
    y.current = { x: X, y: Q };
    const J = Et({ x: F.startX, y: F.startY }, U);
    if (!D.current) {
      const te = t ? 0 : i;
      if (Math.hypot(X - J.x, Q - J.y) <= te)
        return;
      Z(), a == null || a(P);
    }
    D.current = !0, N.current || (V(), N.current = !0), O(X, Q);
  }, K = (P) => {
    var F, U;
    if (!I) {
      P.target === A.current && g.getState().connection.inProgress && (H.current = !0);
      return;
    }
    P.button === 0 && ((U = (F = P.target) == null ? void 0 : F.releasePointerCapture) == null || U.call(F, P.pointerId), !_ && P.target === A.current && g.getState().userSelectionRect && (S == null || S(P)), g.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), D.current && (l == null || l(P), g.setState({
      nodesSelectionActive: R.current.size > 0
    })), j());
  }, ee = (P) => {
    var F, U;
    (U = (F = P.target) == null ? void 0 : F.releasePointerCapture) == null || U.call(F, P.pointerId), j();
  }, q = r === !0 || Array.isArray(r) && r.includes(0);
  return W("div", { className: ge(["react-flow__pane", { draggable: q, dragging: x, selection: e }]), onClick: I ? void 0 : yr(S, A), onContextMenu: yr(M, A), onWheel: yr(T, A), onPointerEnter: I ? void 0 : d, onPointerMove: I ? Y : h, onPointerUp: K, onPointerCancel: I ? ee : void 0, onPointerDownCapture: I ? z : void 0, onClickCapture: I ? C : void 0, onPointerLeave: p, ref: A, style: Zn, children: [w, v(Tw, {})] });
}
function Pr({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: o, unselectNodesAndEdges: i, multiSelectionActive: s, nodeLookup: a, onError: l } = t.getState(), c = a.get(e);
  if (!c) {
    l == null || l("012", Me.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), c.selected ? (n || c.selected && s) && (i({ nodes: [c], edges: [] }), requestAnimationFrame(() => {
    var u;
    return (u = r == null ? void 0 : r.current) == null ? void 0 : u.blur();
  })) : o([e]);
}
function Xa({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: o, isSelectable: i, nodeClickDistance: s }) {
  const a = le(), [l, c] = ae(!1), u = re();
  return ie(() => {
    if (!t)
      return u.current = iy({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (f) => {
          Pr({
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
  }, [t, a, e]), ie(() => {
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
const Ow = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function qa() {
  const e = le();
  return Ce((n) => {
    const { nodeExtent: r, snapToGrid: o, snapGrid: i, nodesDraggable: s, onError: a, updateNodePositions: l, nodeLookup: c, nodeOrigin: u } = e.getState(), f = /* @__PURE__ */ new Map(), d = Ow(s), h = o ? i[0] : 5, p = o ? i[1] : 5, w = n.direction.x * h * n.factor, b = n.direction.y * p * n.factor;
    for (const [, g] of c) {
      if (!d(g))
        continue;
      let _ = {
        x: g.internals.positionAbsolute.x + w,
        y: g.internals.positionAbsolute.y + b
      };
      o && (_ = Qt(_, i));
      const { position: m, positionAbsolute: x } = la({
        nodeId: g.id,
        nextPosition: _,
        nodeLookup: c,
        nodeExtent: r,
        nodeOrigin: u,
        onError: a
      });
      g.position = m, g.internals.positionAbsolute = x, f.set(g.id, g);
    }
    l(f);
  }, []);
}
const lo = Pn(null), Pw = lo.Provider;
lo.Consumer;
const Ua = () => Nt(lo), Dw = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), Ka = Pn(null);
function Rw({ children: e }) {
  const t = oe(Dw, ue);
  return v(Ka.Provider, { value: t, children: e });
}
function Hw() {
  const e = Nt(Ka);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Vw = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, Bw = (e, t, n) => (r) => {
  const { connectionClickStartHandle: o, connectionMode: i, connection: s } = r, { fromHandle: a, toHandle: l, isValid: c } = s;
  if (!a && !o)
    return Vw;
  const u = (l == null ? void 0 : l.nodeId) === e && (l == null ? void 0 : l.id) === t && (l == null ? void 0 : l.type) === n;
  return {
    connectingFrom: (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n,
    connectingTo: u,
    clickConnecting: (o == null ? void 0 : o.nodeId) === e && (o == null ? void 0 : o.id) === t && (o == null ? void 0 : o.type) === n,
    isPossibleEndHandle: i === xt.Strict ? (a == null ? void 0 : a.type) !== n : e !== (a == null ? void 0 : a.nodeId) || t !== (a == null ? void 0 : a.id),
    connectionInProcess: !!a,
    clickConnectionInProcess: !!o,
    valid: u && c
  };
};
function Fw({ type: e = "source", position: t = G.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: o = !0, isConnectableEnd: i = !0, id: s, onConnect: a, children: l, className: c, onMouseDown: u, onTouchStart: f, ...d }, h) {
  var N, S;
  const p = s || null, w = e === "target", b = le(), g = Ua(), { connectOnClick: _, noPanClassName: m, rfId: x } = Hw(), { connectingFrom: k, connectingTo: E, clickConnecting: I, isPossibleEndHandle: A, connectionInProcess: $, clickConnectionInProcess: R, valid: L } = oe(Bw(g, p, e), ue);
  g || (S = (N = b.getState()).onError) == null || S.call(N, "010", Me.error010());
  const H = (M) => {
    const { defaultEdgeOptions: T, onConnect: C, hasDefaultEdges: z } = b.getState(), O = {
      ...T,
      ...M
    };
    if (z) {
      const { edges: V, setEdges: j, onError: Y } = b.getState();
      j(xw(O, V, { onError: Y }));
    }
    C == null || C(O), a == null || a(O);
  }, D = (M) => {
    if (!g)
      return;
    const T = wa(M.nativeEvent);
    if (o && (T && M.button === 0 || !T)) {
      const C = b.getState();
      Or.onPointerDown(M.nativeEvent, {
        handleDomNode: M.currentTarget,
        autoPanOnConnect: C.autoPanOnConnect,
        connectionMode: C.connectionMode,
        connectionRadius: C.connectionRadius,
        domNode: C.domNode,
        nodeLookup: C.nodeLookup,
        lib: C.lib,
        isTarget: w,
        handleId: p,
        nodeId: g,
        flowId: C.rfId,
        panBy: C.panBy,
        cancelConnection: C.cancelConnection,
        onConnectStart: C.onConnectStart,
        onConnectEnd: (...z) => {
          var O, V;
          return (V = (O = b.getState()).onConnectEnd) == null ? void 0 : V.call(O, ...z);
        },
        updateConnection: C.updateConnection,
        onConnect: H,
        isValidConnection: n || ((...z) => {
          var O, V;
          return ((V = (O = b.getState()).isValidConnection) == null ? void 0 : V.call(O, ...z)) ?? !0;
        }),
        getTransform: () => b.getState().transform,
        getFromHandle: () => b.getState().connection.fromHandle,
        autoPanSpeed: C.autoPanSpeed,
        dragThreshold: C.connectionDragThreshold
      });
    }
    T ? u == null || u(M) : f == null || f(M);
  }, y = (M) => {
    const { onClickConnectStart: T, onClickConnectEnd: C, connectionClickStartHandle: z, connectionMode: O, isValidConnection: V, lib: j, rfId: Y, nodeLookup: K, connection: ee } = b.getState();
    if (!g || !z && !o)
      return;
    if (!z) {
      T == null || T(M.nativeEvent, { nodeId: g, handleId: p, handleType: e }), b.setState({ connectionClickStartHandle: { nodeId: g, type: e, id: p } });
      return;
    }
    const q = ma(M.target), P = n || V, { connection: F, isValid: U } = Or.isValid(M.nativeEvent, {
      handle: {
        nodeId: g,
        id: p,
        type: e
      },
      connectionMode: O,
      fromNodeId: z.nodeId,
      fromHandleId: z.id || null,
      fromType: z.type,
      isValidConnection: P,
      flowId: Y,
      doc: q,
      lib: j,
      nodeLookup: K
    });
    U && F && H(F);
    const Z = structuredClone(ee);
    delete Z.inProgress, Z.toPosition = Z.toHandle ? Z.toHandle.position : null, C == null || C(M, Z), b.setState({ connectionClickStartHandle: null });
  };
  return v("div", { "data-handleid": p, "data-nodeid": g, "data-handlepos": t, "data-id": `${x}-${g}-${p}-${e}`, className: ge([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    m,
    c,
    {
      source: !w,
      target: w,
      connectable: r,
      connectablestart: o,
      connectableend: i,
      clickconnecting: I,
      connectingfrom: k,
      connectingto: E,
      valid: L,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!$ || A) && ($ || R ? i : o)
    }
  ]), onMouseDown: D, onTouchStart: D, onClick: _ ? y : void 0, ref: h, ...d, children: l });
}
const Ke = de(Ya(Fw));
function Ww({ data: e, isConnectable: t, sourcePosition: n = G.Bottom }) {
  return W(xe, { children: [e == null ? void 0 : e.label, v(Ke, { type: "source", position: n, isConnectable: t })] });
}
function Yw({ data: e, isConnectable: t, targetPosition: n = G.Top, sourcePosition: r = G.Bottom }) {
  return W(xe, { children: [v(Ke, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, v(Ke, { type: "source", position: r, isConnectable: t })] });
}
function jw() {
  return null;
}
function Gw({ data: e, isConnectable: t, targetPosition: n = G.Top }) {
  return W(xe, { children: [v(Ke, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Ln = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Oi = {
  input: Ww,
  default: Yw,
  output: Gw,
  group: jw
};
function Xw(e) {
  var t, n, r, o;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((t = e.style) == null ? void 0 : t.width),
    height: e.height ?? e.initialHeight ?? ((n = e.style) == null ? void 0 : n.height)
  } : {
    width: e.width ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? ((o = e.style) == null ? void 0 : o.height)
  };
}
const qw = (e) => {
  const { width: t, height: n, x: r, y: o } = Zt(e.nodeLookup, {
    filter: (i) => !!i.selected
  });
  return {
    width: Se(t) ? t : null,
    height: Se(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${o}px)`
  };
};
function Uw({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = le(), { width: o, height: i, transformString: s, userSelectionActive: a } = oe(qw, ue), l = qa(), c = re(null);
  ie(() => {
    var h;
    n || (h = c.current) == null || h.focus({
      preventScroll: !0
    });
  }, [n]);
  const u = !a && o !== null && i !== null;
  if (Xa({
    nodeRef: c,
    disabled: !u
  }), !u)
    return null;
  const f = e ? (h) => {
    const p = r.getState().nodes.filter((w) => w.selected);
    e(h, p);
  } : void 0, d = (h) => {
    Object.prototype.hasOwnProperty.call(Ln, h.key) && (h.preventDefault(), l({
      direction: Ln[h.key],
      factor: h.shiftKey ? 4 : 1
    }));
  };
  return v("div", { className: ge(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: v("div", { ref: c, className: "react-flow__nodesselection-rect", onContextMenu: f, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : d, style: {
    width: o,
    height: i
  } }) });
}
const Pi = typeof window < "u" ? window : void 0, Kw = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Za({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, paneClickDistance: a, deleteKeyCode: l, selectionKeyCode: c, selectionOnDrag: u, selectionMode: f, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: p, panActivationKeyCode: w, zoomActivationKeyCode: b, elementsSelectable: g, zoomOnScroll: _, zoomOnPinch: m, panOnScroll: x, panOnScrollSpeed: k, panOnScrollMode: E, zoomOnDoubleClick: I, panOnDrag: A, autoPanOnSelection: $, defaultViewport: R, translateExtent: L, minZoom: H, maxZoom: D, preventScrolling: y, onSelectionContextMenu: N, noWheelClassName: S, noPanClassName: M, disableKeyboardA11y: T, onViewportChange: C, isControlledViewport: z }) {
  const { nodesSelectionActive: O, userSelectionActive: V } = oe(Kw, ue), j = Yt(c, { target: Pi }), Y = Yt(w, { target: Pi }), K = Y || A, ee = Y || x, q = u && K !== !0, P = j || V || q;
  return Cw({ deleteKeyCode: l, multiSelectionKeyCode: p }), v($w, { onPaneContextMenu: i, elementsSelectable: g, zoomOnScroll: _, zoomOnPinch: m, panOnScroll: ee, panActivationKeyPressed: Y, panOnScrollSpeed: k, panOnScrollMode: E, zoomOnDoubleClick: I, panOnDrag: !j && K, defaultViewport: R, translateExtent: L, minZoom: H, maxZoom: D, zoomActivationKeyCode: b, preventScrolling: y, noWheelClassName: S, noPanClassName: M, onViewportChange: C, isControlledViewport: z, paneClickDistance: a, selectionOnDrag: q, children: W(zw, { onSelectionStart: d, onSelectionEnd: h, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: o, onPaneContextMenu: i, onPaneScroll: s, panOnDrag: K, autoPanOnSelection: $, isSelecting: !!P, selectionMode: f, selectionKeyPressed: j, paneClickDistance: a, selectionOnDrag: q, children: [e, O && v(Uw, { onSelectionContextMenu: N, noPanClassName: M, disableKeyboardA11y: T })] }) });
}
Za.displayName = "FlowRenderer";
const Zw = de(Za), Qw = (e) => (t) => e ? eo(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function Jw(e) {
  return oe(Ce(Qw(e), [e]), ue);
}
const eb = (e) => e.updateNodeInternals;
function tb() {
  const e = oe(eb), [t] = ae(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
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
  return ie(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function nb({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const o = le(), i = re(null), s = re(null), a = re(e.sourcePosition), l = re(e.targetPosition), c = re(t), u = n && !!e.internals.handleBounds;
  return ie(() => {
    i.current && !e.hidden && (!u || s.current !== i.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(i.current), s.current = i.current);
  }, [u, e.hidden]), ie(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), ie(() => {
    if (i.current) {
      const f = c.current !== t, d = a.current !== e.sourcePosition, h = l.current !== e.targetPosition;
      (f || d || h) && (c.current = t, a.current = e.sourcePosition, l.current = e.targetPosition, o.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: i.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), i;
}
function rb({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: o, onContextMenu: i, onDoubleClick: s, nodesDraggable: a, elementsSelectable: l, nodesConnectable: c, nodesFocusable: u, resizeObserver: f, noDragClassName: d, noPanClassName: h, disableKeyboardA11y: p, rfId: w, nodeTypes: b, nodeClickDistance: g, onError: _ }) {
  const { node: m, internals: x, isParent: k } = oe((P) => {
    const F = P.nodeLookup.get(e), U = P.parentLookup.has(e);
    return {
      node: F,
      internals: F.internals,
      isParent: U
    };
  }, ue);
  let E = m.type || "default", I = (b == null ? void 0 : b[E]) || Oi[E];
  I === void 0 && (_ == null || _("003", Me.error003(E)), E = "default", I = (b == null ? void 0 : b.default) || Oi.default);
  const A = !!(m.draggable || a && typeof m.draggable > "u"), $ = !!(m.selectable || l && typeof m.selectable > "u"), R = !!(m.connectable || c && typeof m.connectable > "u"), L = !!(m.focusable || u && typeof m.focusable > "u"), H = le(), D = ha(m), y = nb({ node: m, nodeType: E, hasDimensions: D, resizeObserver: f }), N = Xa({
    nodeRef: y,
    disabled: m.hidden || !A,
    noDragClassName: d,
    handleSelector: m.dragHandle,
    nodeId: e,
    isSelectable: $,
    nodeClickDistance: g
  }), S = qa();
  if (m.hidden)
    return null;
  const M = Ae(m), T = Xw(m), C = $ || A || t || n || r || o, z = n ? (P) => n(P, { ...x.userNode }) : void 0, O = r ? (P) => r(P, { ...x.userNode }) : void 0, V = o ? (P) => o(P, { ...x.userNode }) : void 0, j = i ? (P) => i(P, { ...x.userNode }) : void 0, Y = s ? (P) => s(P, { ...x.userNode }) : void 0, K = (P) => {
    const { selectNodesOnDrag: F, nodeDragThreshold: U } = H.getState();
    $ && (!F || !A || U > 0) && Pr({
      id: e,
      store: H,
      nodeRef: y
    }), t && t(P, { ...x.userNode });
  }, ee = (P) => {
    if (!(ya(P.nativeEvent) || p)) {
      if (oa.includes(P.key) && $) {
        const F = P.key === "Escape";
        Pr({
          id: e,
          store: H,
          unselect: F,
          nodeRef: y
        });
      } else if (A && m.selected && Object.prototype.hasOwnProperty.call(Ln, P.key)) {
        P.preventDefault();
        const { ariaLabelConfig: F } = H.getState();
        H.setState({
          ariaLiveMessage: F["node.a11yDescription.ariaLiveMessage"]({
            direction: P.key.replace("Arrow", "").toLowerCase(),
            x: ~~x.positionAbsolute.x,
            y: ~~x.positionAbsolute.y
          })
        }), S({
          direction: Ln[P.key],
          factor: P.shiftKey ? 4 : 1
        });
      }
    }
  }, q = () => {
    var J;
    if (p || !((J = y.current) != null && J.matches(":focus-visible")))
      return;
    const { transform: P, width: F, height: U, autoPanOnNodeFocus: Z, setCenter: X } = H.getState();
    if (!Z)
      return;
    eo(/* @__PURE__ */ new Map([[e, m]]), { x: 0, y: 0, width: F, height: U }, P, !0).length > 0 || X(m.position.x + M.width / 2, m.position.y + M.height / 2, {
      zoom: P[2]
    });
  };
  return v("div", { className: ge([
    "react-flow__node",
    `react-flow__node-${E}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [h]: A
    },
    m.className,
    {
      selected: m.selected,
      selectable: $,
      parent: k,
      draggable: A,
      dragging: N
    }
  ]), ref: y, style: {
    zIndex: x.z,
    transform: `translate(${x.positionAbsolute.x}px,${x.positionAbsolute.y}px)`,
    pointerEvents: C ? "all" : "none",
    visibility: D ? "visible" : "hidden",
    ...m.style,
    ...T
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: z, onMouseMove: O, onMouseLeave: V, onContextMenu: j, onClick: K, onDoubleClick: Y, onKeyDown: L ? ee : void 0, tabIndex: L ? 0 : void 0, onFocus: L ? q : void 0, role: m.ariaRole ?? (L ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": p ? void 0 : `${Va}-${w}`, "aria-label": m.ariaLabel, ...m.domAttributes, children: v(Pw, { value: e, children: v(I, { id: e, data: m.data, type: E, positionAbsoluteX: x.positionAbsolute.x, positionAbsoluteY: x.positionAbsolute.y, selected: m.selected ?? !1, selectable: $, draggable: A, deletable: m.deletable ?? !0, isConnectable: R, sourcePosition: m.sourcePosition, targetPosition: m.targetPosition, dragging: N, dragHandle: m.dragHandle, zIndex: x.z, parentId: m.parentId, ...M }) }) });
}
var ob = de(rb);
const ib = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function Qa(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: o } = oe(ib, ue), i = Jw(e.onlyRenderVisibleElements), s = tb();
  return v("div", { className: "react-flow__nodes", style: Zn, children: i.map((a) => (
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
    v(ob, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: s, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
Qa.displayName = "NodeRenderer";
const sb = de(Qa);
function ab(e) {
  return oe(Ce((n) => {
    if (!e)
      return n.edges.map((o) => o.id);
    const r = [];
    if (n.width && n.height)
      for (const o of n.edges) {
        const i = n.nodeLookup.get(o.source), s = n.nodeLookup.get(o.target);
        i && s && Vm({
          sourceNode: i,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(o.id);
      }
    return r;
  }, [e]), ue);
}
const lb = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return v("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, cb = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return v("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, Di = {
  [vt.Arrow]: lb,
  [vt.ArrowClosed]: cb
};
function ub(e) {
  const t = le();
  return ce(() => {
    var o, i;
    return Object.prototype.hasOwnProperty.call(Di, e) ? Di[e] : ((i = (o = t.getState()).onError) == null || i.call(o, "009", Me.error009(e)), null);
  }, [e]);
}
const db = ({ id: e, type: t, color: n, width: r = 12.5, height: o = 12.5, markerUnits: i = "strokeWidth", strokeWidth: s, orient: a = "auto-start-reverse" }) => {
  const l = ub(t);
  return l ? v("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${o}`, viewBox: "-10 -10 20 20", markerUnits: i, orient: a, refX: "0", refY: "0", children: v(l, { color: n, strokeWidth: s }) }) : null;
}, Ja = ({ defaultColor: e, rfId: t }) => {
  const n = oe((i) => i.edges), r = oe((i) => i.defaultEdgeOptions), o = ce(() => qm(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return o.length ? v("svg", { className: "react-flow__marker", "aria-hidden": "true", children: v("defs", { children: o.map((i) => v(db, { id: i.id, type: i.type, color: i.color, width: i.width, height: i.height, markerUnits: i.markerUnits, strokeWidth: i.strokeWidth, orient: i.orient }, i.id)) }) }) : null;
};
Ja.displayName = "MarkerDefinitions";
var fb = de(Ja);
function el({ x: e, y: t, label: n, labelStyle: r, labelShowBg: o = !0, labelBgStyle: i, labelBgPadding: s = [2, 4], labelBgBorderRadius: a = 2, children: l, className: c, ...u }) {
  const [f, d] = ae({ x: 1, y: 0, width: 0, height: 0 }), h = ge(["react-flow__edge-textwrapper", c]), p = re(null);
  return ie(() => {
    if (p.current) {
      const w = p.current.getBBox();
      d({
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height
      });
    }
  }, [n]), n ? W("g", { transform: `translate(${e - f.width / 2} ${t - f.height / 2})`, className: h, visibility: f.width ? "visible" : "hidden", ...u, children: [o && v("rect", { width: f.width + 2 * s[0], x: -s[0], y: -s[1], height: f.height + 2 * s[1], className: "react-flow__edge-textbg", style: i, rx: a, ry: a }), v("text", { className: "react-flow__edge-text", y: f.height / 2, dy: "0.3em", ref: p, style: r, children: n }), l] }) : null;
}
el.displayName = "EdgeText";
const hb = de(el);
function Qn({ path: e, labelX: t, labelY: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l, interactionWidth: c = 20, ...u }) {
  return W(xe, { children: [v("path", { ...u, d: e, fill: "none", className: ge(["react-flow__edge-path", u.className]) }), c ? v("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: c, className: "react-flow__edge-interaction" }) : null, r && Se(t) && Se(n) ? v(hb, { x: t, y: n, label: r, labelStyle: o, labelShowBg: i, labelBgStyle: s, labelBgPadding: a, labelBgBorderRadius: l }) : null] });
}
function Ri({ pos: e, x1: t, y1: n, x2: r, y2: o }) {
  return e === G.Left || e === G.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + o)];
}
function tl({ sourceX: e, sourceY: t, sourcePosition: n = G.Bottom, targetX: r, targetY: o, targetPosition: i = G.Top }) {
  const [s, a] = Ri({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: o
  }), [l, c] = Ri({
    pos: i,
    x1: r,
    y1: o,
    x2: e,
    y2: t
  }), [u, f, d, h] = ba({
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
function nl(e) {
  return de(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s, targetPosition: a, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: w, markerStart: b, interactionWidth: g }) => {
    const [_, m, x] = tl({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a
    }), k = e.isInternal ? void 0 : t;
    return v(Qn, { id: k, path: _, labelX: m, labelY: x, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: w, markerStart: b, interactionWidth: g });
  });
}
const pb = nl({ isInternal: !1 }), rl = nl({ isInternal: !0 });
pb.displayName = "SimpleBezierEdge";
rl.displayName = "SimpleBezierEdgeInternal";
function ol(e) {
  return de(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, sourcePosition: h = G.Bottom, targetPosition: p = G.Top, markerEnd: w, markerStart: b, pathOptions: g, interactionWidth: _ }) => {
    const [m, x, k] = Tr({
      sourceX: n,
      sourceY: r,
      sourcePosition: h,
      targetX: o,
      targetY: i,
      targetPosition: p,
      borderRadius: g == null ? void 0 : g.borderRadius,
      offset: g == null ? void 0 : g.offset,
      stepPosition: g == null ? void 0 : g.stepPosition
    }), E = e.isInternal ? void 0 : t;
    return v(Qn, { id: E, path: m, labelX: x, labelY: k, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: w, markerStart: b, interactionWidth: _ });
  });
}
const il = ol({ isInternal: !1 }), sl = ol({ isInternal: !0 });
il.displayName = "SmoothStepEdge";
sl.displayName = "SmoothStepEdgeInternal";
function al(e) {
  return de(({ id: t, ...n }) => {
    var o;
    const r = e.isInternal ? void 0 : t;
    return v(il, { ...n, id: r, pathOptions: ce(() => {
      var i;
      return { borderRadius: 0, offset: (i = n.pathOptions) == null ? void 0 : i.offset };
    }, [(o = n.pathOptions) == null ? void 0 : o.offset]) });
  });
}
const gb = al({ isInternal: !1 }), ll = al({ isInternal: !0 });
gb.displayName = "StepEdge";
ll.displayName = "StepEdgeInternal";
function cl(e) {
  return de(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: p, interactionWidth: w }) => {
    const [b, g, _] = _a({ sourceX: n, sourceY: r, targetX: o, targetY: i }), m = e.isInternal ? void 0 : t;
    return v(Qn, { id: m, path: b, labelX: g, labelY: _, label: s, labelStyle: a, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: f, style: d, markerEnd: h, markerStart: p, interactionWidth: w });
  });
}
const mb = cl({ isInternal: !1 }), ul = cl({ isInternal: !0 });
mb.displayName = "StraightEdge";
ul.displayName = "StraightEdgeInternal";
function dl(e) {
  return de(({ id: t, sourceX: n, sourceY: r, targetX: o, targetY: i, sourcePosition: s = G.Bottom, targetPosition: a = G.Top, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: w, markerStart: b, pathOptions: g, interactionWidth: _ }) => {
    const [m, x, k] = xa({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: o,
      targetY: i,
      targetPosition: a,
      curvature: g == null ? void 0 : g.curvature
    }), E = e.isInternal ? void 0 : t;
    return v(Qn, { id: E, path: m, labelX: x, labelY: k, label: l, labelStyle: c, labelShowBg: u, labelBgStyle: f, labelBgPadding: d, labelBgBorderRadius: h, style: p, markerEnd: w, markerStart: b, interactionWidth: _ });
  });
}
const yb = dl({ isInternal: !1 }), fl = dl({ isInternal: !0 });
yb.displayName = "BezierEdge";
fl.displayName = "BezierEdgeInternal";
const Hi = {
  default: fl,
  straight: ul,
  step: ll,
  smoothstep: sl,
  simplebezier: rl
}, Vi = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, wb = (e, t, n) => n === G.Left ? e - t : n === G.Right ? e + t : e, bb = (e, t, n) => n === G.Top ? e - t : n === G.Bottom ? e + t : e, Bi = "react-flow__edgeupdater";
function Fi({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: o, onMouseEnter: i, onMouseOut: s, type: a }) {
  return v("circle", { onMouseDown: o, onMouseEnter: i, onMouseOut: s, className: ge([Bi, `${Bi}-${a}`]), cx: wb(t, r, e), cy: bb(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function xb({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: o, targetX: i, targetY: s, sourcePosition: a, targetPosition: l, onReconnect: c, onReconnectStart: u, onReconnectEnd: f, setReconnecting: d, setUpdateHover: h }) {
  const p = le(), w = (x, k) => {
    if (x.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: I, connectionMode: A, connectionRadius: $, lib: R, onConnectStart: L, cancelConnection: H, nodeLookup: D, rfId: y, panBy: N, updateConnection: S } = p.getState(), M = k.type === "target", T = (O, V) => {
      d(!1), f == null || f(O, n, k.type, V);
    }, C = (O) => c == null ? void 0 : c(n, O), z = (O, V) => {
      d(!0), u == null || u(x, n, k.type), L == null || L(O, V);
    };
    Or.onPointerDown(x.nativeEvent, {
      autoPanOnConnect: E,
      connectionMode: A,
      connectionRadius: $,
      domNode: I,
      handleId: k.id,
      nodeId: k.nodeId,
      nodeLookup: D,
      isTarget: M,
      edgeUpdaterType: k.type,
      lib: R,
      flowId: y,
      cancelConnection: H,
      panBy: N,
      isValidConnection: (...O) => {
        var V, j;
        return ((j = (V = p.getState()).isValidConnection) == null ? void 0 : j.call(V, ...O)) ?? !0;
      },
      onConnect: C,
      onConnectStart: z,
      onConnectEnd: (...O) => {
        var V, j;
        return (j = (V = p.getState()).onConnectEnd) == null ? void 0 : j.call(V, ...O);
      },
      onReconnectEnd: T,
      updateConnection: S,
      getTransform: () => p.getState().transform,
      getFromHandle: () => p.getState().connection.fromHandle,
      dragThreshold: p.getState().connectionDragThreshold,
      handleDomNode: x.currentTarget
    });
  }, b = (x) => w(x, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), g = (x) => w(x, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), _ = () => h(!0), m = () => h(!1);
  return W(xe, { children: [(e === !0 || e === "source") && v(Fi, { position: a, centerX: r, centerY: o, radius: t, onMouseDown: b, onMouseEnter: _, onMouseOut: m, type: "source" }), (e === !0 || e === "target") && v(Fi, { position: l, centerX: i, centerY: s, radius: t, onMouseDown: g, onMouseEnter: _, onMouseOut: m, type: "target" })] });
}
function vb({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: o, onDoubleClick: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, rfId: p, edgeTypes: w, noPanClassName: b, onError: g, disableKeyboardA11y: _ }) {
  let m = oe((X) => X.edgeLookup.get(e));
  const x = oe((X) => X.defaultEdgeOptions);
  m = x ? { ...x, ...m } : m;
  let k = m.type || "default", E = (w == null ? void 0 : w[k]) || Hi[k];
  E === void 0 && (g == null || g("011", Me.error011(k)), k = "default", E = (w == null ? void 0 : w.default) || Hi.default);
  const I = !!(m.focusable || t && typeof m.focusable > "u"), A = typeof f < "u" && (m.reconnectable || n && typeof m.reconnectable > "u"), $ = !!(m.selectable || r && typeof m.selectable > "u"), R = re(null), [L, H] = ae(!1), [D, y] = ae(!1), N = le(), { zIndex: S = m.zIndex, sourceX: M, sourceY: T, targetX: C, targetY: z, sourcePosition: O, targetPosition: V } = oe(Ce((X) => {
    const Q = X.nodeLookup.get(m.source), J = X.nodeLookup.get(m.target);
    if (!Q || !J)
      return Vi;
    const te = Xm({
      id: e,
      sourceNode: Q,
      targetNode: J,
      sourceHandle: m.sourceHandle || null,
      targetHandle: m.targetHandle || null,
      connectionMode: X.connectionMode,
      onError: g
    }), ne = Hm({
      selected: m.selected,
      zIndex: m.zIndex,
      sourceNode: Q,
      targetNode: J,
      elevateOnSelect: X.elevateEdgesOnSelect,
      zIndexMode: X.zIndexMode
    });
    return {
      ...te || Vi,
      zIndex: ne
    };
  }, [m.source, m.target, m.sourceHandle, m.targetHandle, m.selected, m.zIndex, g]), ue), j = ce(() => m.markerStart ? `url('#${Lr(m.markerStart, p)}')` : void 0, [m.markerStart, p]), Y = ce(() => m.markerEnd ? `url('#${Lr(m.markerEnd, p)}')` : void 0, [m.markerEnd, p]);
  if (m.hidden || M === null || T === null || C === null || z === null)
    return null;
  const K = (X) => {
    var ne;
    const { addSelectedEdges: Q, unselectNodesAndEdges: J, multiSelectionActive: te } = N.getState();
    $ && (N.setState({ nodesSelectionActive: !1 }), m.selected && te ? (J({ nodes: [], edges: [m] }), (ne = R.current) == null || ne.blur()) : Q([e])), o && o(X, m);
  }, ee = i ? (X) => {
    i(X, { ...m });
  } : void 0, q = s ? (X) => {
    s(X, { ...m });
  } : void 0, P = a ? (X) => {
    a(X, { ...m });
  } : void 0, F = l ? (X) => {
    l(X, { ...m });
  } : void 0, U = c ? (X) => {
    c(X, { ...m });
  } : void 0, Z = (X) => {
    var Q;
    if (!_ && oa.includes(X.key) && $) {
      const { unselectNodesAndEdges: J, addSelectedEdges: te } = N.getState();
      X.key === "Escape" ? ((Q = R.current) == null || Q.blur(), J({ edges: [m] })) : te([e]);
    }
  };
  return v("svg", { style: { zIndex: S }, children: W("g", { className: ge([
    "react-flow__edge",
    `react-flow__edge-${k}`,
    m.className,
    b,
    {
      selected: m.selected,
      animated: m.animated,
      inactive: !$ && !o,
      updating: L,
      selectable: $
    }
  ]), onClick: K, onDoubleClick: ee, onContextMenu: q, onMouseEnter: P, onMouseMove: F, onMouseLeave: U, onKeyDown: I ? Z : void 0, tabIndex: I ? 0 : void 0, role: m.ariaRole ?? (I ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": m.ariaLabel === null ? void 0 : m.ariaLabel || `Edge from ${m.source} to ${m.target}`, "aria-describedby": I ? `${Ba}-${p}` : void 0, ref: R, ...m.domAttributes, children: [!D && v(E, { id: e, source: m.source, target: m.target, type: m.type, selected: m.selected, animated: m.animated, selectable: $, deletable: m.deletable ?? !0, label: m.label, labelStyle: m.labelStyle, labelShowBg: m.labelShowBg, labelBgStyle: m.labelBgStyle, labelBgPadding: m.labelBgPadding, labelBgBorderRadius: m.labelBgBorderRadius, sourceX: M, sourceY: T, targetX: C, targetY: z, sourcePosition: O, targetPosition: V, data: m.data, style: m.style, sourceHandleId: m.sourceHandle, targetHandleId: m.targetHandle, markerStart: j, markerEnd: Y, pathOptions: "pathOptions" in m ? m.pathOptions : void 0, interactionWidth: m.interactionWidth }), A && v(xb, { edge: m, isReconnectable: A, reconnectRadius: u, onReconnect: f, onReconnectStart: d, onReconnectEnd: h, sourceX: M, sourceY: T, targetX: C, targetY: z, sourcePosition: O, targetPosition: V, setUpdateHover: H, setReconnecting: y })] }) });
}
var _b = de(vb);
const Eb = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function hl({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: o, onReconnect: i, onEdgeContextMenu: s, onEdgeMouseEnter: a, onEdgeMouseMove: l, onEdgeMouseLeave: c, onEdgeClick: u, reconnectRadius: f, onEdgeDoubleClick: d, onReconnectStart: h, onReconnectEnd: p, disableKeyboardA11y: w }) {
  const { edgesFocusable: b, edgesReconnectable: g, elementsSelectable: _, onError: m } = oe(Eb, ue), x = ab(t);
  return W("div", { className: "react-flow__edges", children: [v(fb, { defaultColor: e, rfId: n }), x.map((k) => v(_b, { id: k, edgesFocusable: b, edgesReconnectable: g, elementsSelectable: _, noPanClassName: o, onReconnect: i, onContextMenu: s, onMouseEnter: a, onMouseMove: l, onMouseLeave: c, onClick: u, reconnectRadius: f, onDoubleClick: d, onReconnectStart: h, onReconnectEnd: p, rfId: n, onError: m, edgeTypes: r, disableKeyboardA11y: w }, k))] });
}
hl.displayName = "EdgeRenderer";
const kb = de(hl), Wi = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Sb({ children: e }) {
  const t = le(), n = re(null), [r] = ae(() => t.getState().transform);
  return ja(() => {
    let o = null;
    const i = () => {
      const s = t.getState().transform;
      o && s[0] === o[0] && s[1] === o[1] && s[2] === o[2] || (o = s, n.current && (n.current.style.transform = Wi(s)));
    };
    return i(), t.subscribe(i);
  }, [t]), v("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Wi(r) }, children: e });
}
function Nb(e) {
  const t = Kn(), n = re(!1);
  ie(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Cb = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function Mb(e) {
  const t = oe(Cb), n = le();
  return ie(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Ib(e) {
  return e.connection.inProgress ? { ...e.connection, to: Jt(e.connection.to, e.transform) } : { ...e.connection };
}
function $b(e) {
  return Ib;
}
function Ab(e) {
  const t = $b();
  return oe(t, ue);
}
const Tb = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Lb({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: o, width: i, height: s, isValid: a, inProgress: l } = oe(Tb, ue);
  return !(i && o && l) ? null : v("svg", { style: e, width: i, height: s, className: "react-flow__connectionline react-flow__container", children: v("g", { className: ge(["react-flow__connection", ga(a)]), children: v(pl, { style: t, type: n, CustomComponent: r, isValid: a }) }) });
}
const pl = ({ style: e, type: t = qe.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: o, from: i, fromNode: s, fromHandle: a, fromPosition: l, to: c, toNode: u, toHandle: f, toPosition: d, pointer: h } = Ab();
  if (!o)
    return;
  if (n)
    return v(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: a, fromX: i.x, fromY: i.y, toX: c.x, toY: c.y, fromPosition: l, toPosition: d, connectionStatus: ga(r), toNode: u, toHandle: f, pointer: h });
  let p = "";
  const w = {
    sourceX: i.x,
    sourceY: i.y,
    sourcePosition: l,
    targetX: c.x,
    targetY: c.y,
    targetPosition: d
  };
  switch (t) {
    case qe.Bezier:
      [p] = xa(w);
      break;
    case qe.SimpleBezier:
      [p] = tl(w);
      break;
    case qe.Step:
      [p] = Tr({
        ...w,
        borderRadius: 0
      });
      break;
    case qe.SmoothStep:
      [p] = Tr(w);
      break;
    default:
      [p] = _a(w);
  }
  return v("path", { d: p, fill: "none", className: "react-flow__connection-path", style: e });
};
pl.displayName = "ConnectionLine";
const zb = {};
function Yi(e = zb) {
  re(e), le(), ie(() => {
  }, [e]);
}
function Ob() {
  le(), re(!1), ie(() => {
  }, []);
}
function gl({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: o, onNodeDoubleClick: i, onEdgeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, onSelectionContextMenu: f, onSelectionStart: d, onSelectionEnd: h, connectionLineType: p, connectionLineStyle: w, connectionLineComponent: b, connectionLineContainerStyle: g, selectionKeyCode: _, selectionOnDrag: m, selectionMode: x, multiSelectionKeyCode: k, panActivationKeyCode: E, zoomActivationKeyCode: I, deleteKeyCode: A, onlyRenderVisibleElements: $, elementsSelectable: R, defaultViewport: L, translateExtent: H, minZoom: D, maxZoom: y, preventScrolling: N, defaultMarkerColor: S, zoomOnScroll: M, zoomOnPinch: T, panOnScroll: C, panOnScrollSpeed: z, panOnScrollMode: O, zoomOnDoubleClick: V, panOnDrag: j, autoPanOnSelection: Y, onPaneClick: K, onPaneMouseEnter: ee, onPaneMouseMove: q, onPaneMouseLeave: P, onPaneScroll: F, onPaneContextMenu: U, paneClickDistance: Z, nodeClickDistance: X, onEdgeContextMenu: Q, onEdgeMouseEnter: J, onEdgeMouseMove: te, onEdgeMouseLeave: ne, reconnectRadius: B, onReconnect: se, onReconnectStart: be, onReconnectEnd: Te, noDragClassName: Re, noWheelClassName: Ct, noPanClassName: Ze, disableKeyboardA11y: Qe, nodeExtent: _e, rfId: He, viewport: Ve, onViewportChange: Je, nodesDraggable: er }) {
  return Yi(e), Yi(t), Ob(), Nb(n), Mb(Ve), v(Zw, { onPaneClick: K, onPaneMouseEnter: ee, onPaneMouseMove: q, onPaneMouseLeave: P, onPaneContextMenu: U, onPaneScroll: F, paneClickDistance: Z, deleteKeyCode: A, selectionKeyCode: _, selectionOnDrag: m, selectionMode: x, onSelectionStart: d, onSelectionEnd: h, multiSelectionKeyCode: k, panActivationKeyCode: E, zoomActivationKeyCode: I, elementsSelectable: R, zoomOnScroll: M, zoomOnPinch: T, zoomOnDoubleClick: V, panOnScroll: C, panOnScrollSpeed: z, panOnScrollMode: O, panOnDrag: j, autoPanOnSelection: Y, defaultViewport: L, translateExtent: H, minZoom: D, maxZoom: y, onSelectionContextMenu: f, preventScrolling: N, noDragClassName: Re, noWheelClassName: Ct, noPanClassName: Ze, disableKeyboardA11y: Qe, onViewportChange: Je, isControlledViewport: !!Ve, children: W(Sb, { children: [v(kb, { edgeTypes: t, onEdgeClick: o, onEdgeDoubleClick: s, onReconnect: se, onReconnectStart: be, onReconnectEnd: Te, onlyRenderVisibleElements: $, onEdgeContextMenu: Q, onEdgeMouseEnter: J, onEdgeMouseMove: te, onEdgeMouseLeave: ne, reconnectRadius: B, defaultMarkerColor: S, noPanClassName: Ze, disableKeyboardA11y: Qe, rfId: He }), v(Lb, { style: w, type: p, component: b, containerStyle: g }), v("div", { className: "react-flow__edgelabel-renderer" }), v(sb, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: l, onNodeMouseLeave: c, onNodeContextMenu: u, nodeClickDistance: X, onlyRenderVisibleElements: $, noPanClassName: Ze, noDragClassName: Re, disableKeyboardA11y: Qe, nodeExtent: _e, rfId: He, nodesDraggable: er }), v("div", { className: "react-flow__viewport-portal" })] }) });
}
gl.displayName = "GraphView";
const Pb = de(gl), Db = fa(), ji = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l = 0.5, maxZoom: c = 2, nodeOrigin: u, nodeExtent: f, zIndexMode: d = "basic" } = {}) => {
  const h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), g = r ?? t ?? [], _ = n ?? e ?? [], m = u ?? [0, 0], x = f ?? Vt;
  Sa(w, b, g);
  const { nodesInitialized: k } = zr(_, h, p, {
    nodeOrigin: m,
    nodeExtent: x,
    zIndexMode: d
  });
  let E = [0, 0, 1];
  if (s && o && i) {
    const I = Zt(h, {
      filter: (L) => !!((L.width || L.initialWidth) && (L.height || L.initialHeight))
    }), { x: A, y: $, zoom: R } = Gn(I, o, i, l, c, (a == null ? void 0 : a.padding) ?? 0.1);
    E = [A, $, R];
  }
  return {
    rfId: "1",
    width: o ?? 0,
    height: i ?? 0,
    transform: E,
    nodes: _,
    nodesInitialized: k,
    nodeLookup: h,
    parentLookup: p,
    edges: g,
    edgeLookup: b,
    connectionLookup: w,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: l,
    maxZoom: c,
    translateExtent: Vt,
    nodeExtent: x,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: xt.Strict,
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
    connection: { ...sa },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Db,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: ia,
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
}, Rb = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: o, height: i, fitView: s, fitViewOptions: a, minZoom: l, maxZoom: c, nodeOrigin: u, nodeExtent: f, zIndexMode: d }) => Ky((h, p) => {
  async function w() {
    const { nodeLookup: b, panZoom: g, fitViewOptions: _, fitViewResolver: m, width: x, height: k, minZoom: E, maxZoom: I } = p();
    g && (await Tm({
      nodes: b,
      width: x,
      height: k,
      panZoom: g,
      minZoom: E,
      maxZoom: I
    }, _), m == null || m.resolve(!0), h({ fitViewResolver: null }));
  }
  return {
    ...ji({
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
      const { nodeLookup: g, parentLookup: _, nodeOrigin: m, nodeExtent: x, elevateNodesOnSelect: k, fitViewQueued: E, zIndexMode: I, nodesSelectionActive: A } = p(), { nodesInitialized: $, hasSelectedNodes: R } = zr(b, g, _, {
        nodeOrigin: m,
        nodeExtent: x,
        elevateNodesOnSelect: k,
        checkEquality: !0,
        zIndexMode: I
      }), L = A && R;
      E && $ ? (w(), h({
        nodes: b,
        nodesInitialized: $,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: L
      })) : h({ nodes: b, nodesInitialized: $, nodesSelectionActive: L });
    },
    setEdges: (b) => {
      const { connectionLookup: g, edgeLookup: _ } = p();
      Sa(g, _, b), h({ edges: b });
    },
    setDefaultNodesAndEdges: (b, g) => {
      if (b) {
        const { setNodes: _ } = p();
        _(b), h({ hasDefaultNodes: !0 });
      }
      if (g) {
        const { setEdges: _ } = p();
        _(g), h({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (b) => {
      const { triggerNodeChanges: g, nodeLookup: _, parentLookup: m, domNode: x, nodeOrigin: k, nodeExtent: E, debug: I, fitViewQueued: A, zIndexMode: $ } = p(), { changes: R, updatedInternals: L } = ty(b, _, m, x, k, E, $);
      L && (Zm(_, m, { nodeOrigin: k, nodeExtent: E, zIndexMode: $ }), A ? (w(), h({ fitViewQueued: !1, fitViewOptions: void 0 })) : h({}), (R == null ? void 0 : R.length) > 0 && (I && console.log("React Flow: trigger node changes", R), g == null || g(R)));
    },
    updateNodePositions: (b, g = !1) => {
      const _ = [];
      let m = [];
      const { nodeLookup: x, triggerNodeChanges: k, connection: E, updateConnection: I, onNodesChangeMiddlewareMap: A } = p();
      for (const [$, R] of b) {
        const L = x.get($), H = !!(L != null && L.expandParent && (L != null && L.parentId) && (R != null && R.position)), D = {
          id: $,
          type: "position",
          position: H ? {
            x: Math.max(0, R.position.x),
            y: Math.max(0, R.position.y)
          } : R.position,
          dragging: g
        };
        if (L && E.inProgress && E.fromNode.id === L.id) {
          const y = ut(L, E.fromHandle, G.Left, !0);
          I({ ...E, from: y });
        }
        H && L.parentId && _.push({
          id: $,
          parentId: L.parentId,
          rect: {
            ...R.internals.positionAbsolute,
            width: R.measured.width ?? 0,
            height: R.measured.height ?? 0
          }
        }), m.push(D);
      }
      if (_.length > 0) {
        const { parentLookup: $, nodeOrigin: R } = p(), L = ao(_, x, $, R);
        m.push(...L);
      }
      for (const $ of A.values())
        m = $(m);
      k(m);
    },
    triggerNodeChanges: (b) => {
      const { onNodesChange: g, setNodes: _, nodes: m, hasDefaultNodes: x, debug: k } = p();
      if (b != null && b.length) {
        if (x) {
          const E = yw(b, m);
          _(E);
        }
        k && console.log("React Flow: trigger node changes", b), g == null || g(b);
      }
    },
    triggerEdgeChanges: (b) => {
      const { onEdgesChange: g, setEdges: _, edges: m, hasDefaultEdges: x, debug: k } = p();
      if (b != null && b.length) {
        if (x) {
          const E = ww(b, m);
          _(E);
        }
        k && console.log("React Flow: trigger edge changes", b), g == null || g(b);
      }
    },
    addSelectedNodes: (b) => {
      const { multiSelectionActive: g, edgeLookup: _, nodeLookup: m, triggerNodeChanges: x, triggerEdgeChanges: k } = p();
      if (g) {
        const E = b.map((I) => tt(I, !0));
        x(E);
        return;
      }
      x(gt(m, /* @__PURE__ */ new Set([...b]), !0)), k(gt(_));
    },
    addSelectedEdges: (b) => {
      const { multiSelectionActive: g, edgeLookup: _, nodeLookup: m, triggerNodeChanges: x, triggerEdgeChanges: k } = p();
      if (g) {
        const E = b.map((I) => tt(I, !0));
        k(E);
        return;
      }
      k(gt(_, /* @__PURE__ */ new Set([...b]))), x(gt(m, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: b, edges: g } = {}) => {
      const { edges: _, nodes: m, nodeLookup: x, triggerNodeChanges: k, triggerEdgeChanges: E } = p(), I = b || m, A = g || _, $ = [];
      for (const L of I) {
        if (!L.selected)
          continue;
        const H = x.get(L.id);
        H && (H.selected = !1), $.push(tt(L.id, !1));
      }
      const R = [];
      for (const L of A)
        L.selected && R.push(tt(L.id, !1));
      k($), E(R);
    },
    setMinZoom: (b) => {
      const { panZoom: g, maxZoom: _ } = p();
      g == null || g.setScaleExtent([b, _]), h({ minZoom: b });
    },
    setMaxZoom: (b) => {
      const { panZoom: g, minZoom: _ } = p();
      g == null || g.setScaleExtent([_, b]), h({ maxZoom: b });
    },
    setTranslateExtent: (b) => {
      var g;
      (g = p().panZoom) == null || g.setTranslateExtent(b), h({ translateExtent: b });
    },
    resetSelectedElements: () => {
      const { edges: b, nodes: g, triggerNodeChanges: _, triggerEdgeChanges: m, elementsSelectable: x } = p();
      if (!x)
        return;
      const k = g.reduce((I, A) => A.selected ? [...I, tt(A.id, !1)] : I, []), E = b.reduce((I, A) => A.selected ? [...I, tt(A.id, !1)] : I, []);
      _(k), m(E);
    },
    setNodeExtent: (b) => {
      const { nodes: g, nodeLookup: _, parentLookup: m, nodeOrigin: x, elevateNodesOnSelect: k, nodeExtent: E, zIndexMode: I } = p();
      b[0][0] === E[0][0] && b[0][1] === E[0][1] && b[1][0] === E[1][0] && b[1][1] === E[1][1] || (zr(g, _, m, {
        nodeOrigin: x,
        nodeExtent: b,
        elevateNodesOnSelect: k,
        checkEquality: !1,
        zIndexMode: I
      }), h({ nodeExtent: b }));
    },
    panBy: (b) => {
      const { transform: g, width: _, height: m, panZoom: x, translateExtent: k } = p();
      return ny({ delta: b, panZoom: x, transform: g, translateExtent: k, width: _, height: m });
    },
    setCenter: async (b, g, _) => {
      const { width: m, height: x, maxZoom: k, panZoom: E } = p();
      if (!E)
        return !1;
      const I = typeof (_ == null ? void 0 : _.zoom) < "u" ? _.zoom : k;
      return await E.setViewport({
        x: m / 2 - b * I,
        y: x / 2 - g * I,
        zoom: I
      }, { duration: _ == null ? void 0 : _.duration, ease: _ == null ? void 0 : _.ease, interpolate: _ == null ? void 0 : _.interpolate }), !0;
    },
    cancelConnection: () => {
      h({
        connection: { ...sa }
      });
    },
    updateConnection: (b) => {
      h({ connection: b });
    },
    reset: () => h({ ...ji() })
  };
}, Object.is);
function co({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: o, initialHeight: i, initialMinZoom: s, initialMaxZoom: a, initialFitViewOptions: l, fitView: c, nodeOrigin: u, nodeExtent: f, zIndexMode: d, children: h }) {
  const [p] = ae(() => Rb({
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
  return v(Zy, { value: p, children: v(Ew, { children: v(Rw, { children: h }) }) });
}
function Hb({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: o, width: i, height: s, fitView: a, fitViewOptions: l, minZoom: c, maxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h }) {
  return Nt(Un) ? v(xe, { children: e }) : v(co, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: o, initialWidth: i, initialHeight: s, fitView: a, initialFitViewOptions: l, initialMinZoom: c, initialMaxZoom: u, nodeOrigin: f, nodeExtent: d, zIndexMode: h, children: e });
}
const Vb = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function Bb({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: o, nodeTypes: i, edgeTypes: s, onNodeClick: a, onEdgeClick: l, onInit: c, onMove: u, onMoveStart: f, onMoveEnd: d, onConnect: h, onConnectStart: p, onConnectEnd: w, onClickConnectStart: b, onClickConnectEnd: g, onNodeMouseEnter: _, onNodeMouseMove: m, onNodeMouseLeave: x, onNodeContextMenu: k, onNodeDoubleClick: E, onNodeDragStart: I, onNodeDrag: A, onNodeDragStop: $, onNodesDelete: R, onEdgesDelete: L, onDelete: H, onSelectionChange: D, onSelectionDragStart: y, onSelectionDrag: N, onSelectionDragStop: S, onSelectionContextMenu: M, onSelectionStart: T, onSelectionEnd: C, onBeforeDelete: z, connectionMode: O, connectionLineType: V = qe.Bezier, connectionLineStyle: j, connectionLineComponent: Y, connectionLineContainerStyle: K, deleteKeyCode: ee = "Backspace", selectionKeyCode: q = "Shift", selectionOnDrag: P = !1, selectionMode: F = Bt.Full, panActivationKeyCode: U = "Space", multiSelectionKeyCode: Z = Wt() ? "Meta" : "Control", zoomActivationKeyCode: X = Wt() ? "Meta" : "Control", snapToGrid: Q, snapGrid: J, onlyRenderVisibleElements: te = !1, selectNodesOnDrag: ne, nodesDraggable: B, autoPanOnNodeFocus: se, nodesConnectable: be, nodesFocusable: Te, nodeOrigin: Re = Fa, edgesFocusable: Ct, edgesReconnectable: Ze, elementsSelectable: Qe = !0, defaultViewport: _e = uw, minZoom: He = 0.5, maxZoom: Ve = 2, translateExtent: Je = Vt, preventScrolling: er = !0, nodeExtent: tr, defaultMarkerColor: Il = "#b1b1b7", zoomOnScroll: $l = !0, zoomOnPinch: Al = !0, panOnScroll: Tl = !1, panOnScrollSpeed: Ll = 0.5, panOnScrollMode: zl = it.Free, zoomOnDoubleClick: Ol = !0, panOnDrag: Pl = !0, onPaneClick: Dl, onPaneMouseEnter: Rl, onPaneMouseMove: Hl, onPaneMouseLeave: Vl, onPaneScroll: Bl, onPaneContextMenu: Fl, paneClickDistance: Wl = 1, nodeClickDistance: Yl = 0, children: jl, onReconnect: Gl, onReconnectStart: Xl, onReconnectEnd: ql, onEdgeContextMenu: Ul, onEdgeDoubleClick: Kl, onEdgeMouseEnter: Zl, onEdgeMouseMove: Ql, onEdgeMouseLeave: Jl, reconnectRadius: ec = 10, onNodesChange: tc, onEdgesChange: nc, noDragClassName: rc = "nodrag", noWheelClassName: oc = "nowheel", noPanClassName: go = "nopan", fitView: mo, fitViewOptions: yo, connectOnClick: ic, attributionPosition: sc, proOptions: ac, defaultEdgeOptions: lc, elevateNodesOnSelect: cc = !0, elevateEdgesOnSelect: uc = !1, disableKeyboardA11y: wo = !1, autoPanOnConnect: dc, autoPanOnNodeDrag: fc, autoPanOnSelection: hc = !0, autoPanSpeed: pc, connectionRadius: gc, isValidConnection: mc, onError: yc, style: wc, id: bo, nodeDragThreshold: bc, connectionDragThreshold: xc, viewport: vc, onViewportChange: _c, width: Ec, height: kc, colorMode: Sc = "light", debug: Nc, onScroll: en, ariaLabelConfig: Cc, zIndexMode: xo = "basic", ...Mc }, Ic) {
  const nr = bo || "1", $c = pw(Sc), Ac = Ce((vo) => {
    vo.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), en == null || en(vo);
  }, [en]);
  return v("div", { "data-testid": "rf__wrapper", ...Mc, onScroll: Ac, style: { ...wc, ...Vb }, ref: Ic, className: ge(["react-flow", o, $c]), id: bo, role: "application", children: W(Hb, { nodes: e, edges: t, width: Ec, height: kc, fitView: mo, fitViewOptions: yo, minZoom: He, maxZoom: Ve, nodeOrigin: Re, nodeExtent: tr, zIndexMode: xo, children: [v(hw, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: h, onConnectStart: p, onConnectEnd: w, onClickConnectStart: b, onClickConnectEnd: g, nodesDraggable: B, autoPanOnNodeFocus: se, nodesConnectable: be, nodesFocusable: Te, edgesFocusable: Ct, edgesReconnectable: Ze, elementsSelectable: Qe, elevateNodesOnSelect: cc, elevateEdgesOnSelect: uc, minZoom: He, maxZoom: Ve, nodeExtent: tr, onNodesChange: tc, onEdgesChange: nc, snapToGrid: Q, snapGrid: J, connectionMode: O, translateExtent: Je, connectOnClick: ic, defaultEdgeOptions: lc, fitView: mo, fitViewOptions: yo, onNodesDelete: R, onEdgesDelete: L, onDelete: H, onNodeDragStart: I, onNodeDrag: A, onNodeDragStop: $, onSelectionDrag: N, onSelectionDragStart: y, onSelectionDragStop: S, onMove: u, onMoveStart: f, onMoveEnd: d, noPanClassName: go, nodeOrigin: Re, rfId: nr, autoPanOnConnect: dc, autoPanOnNodeDrag: fc, autoPanSpeed: pc, onError: yc, connectionRadius: gc, isValidConnection: mc, selectNodesOnDrag: ne, nodeDragThreshold: bc, connectionDragThreshold: xc, onBeforeDelete: z, debug: Nc, ariaLabelConfig: Cc, zIndexMode: xo }), v(Pb, { onInit: c, onNodeClick: a, onEdgeClick: l, onNodeMouseEnter: _, onNodeMouseMove: m, onNodeMouseLeave: x, onNodeContextMenu: k, onNodeDoubleClick: E, nodeTypes: i, edgeTypes: s, connectionLineType: V, connectionLineStyle: j, connectionLineComponent: Y, connectionLineContainerStyle: K, selectionKeyCode: q, selectionOnDrag: P, selectionMode: F, deleteKeyCode: ee, multiSelectionKeyCode: Z, panActivationKeyCode: U, zoomActivationKeyCode: X, onlyRenderVisibleElements: te, defaultViewport: _e, translateExtent: Je, minZoom: He, maxZoom: Ve, preventScrolling: er, zoomOnScroll: $l, zoomOnPinch: Al, zoomOnDoubleClick: Ol, panOnScroll: Tl, panOnScrollSpeed: Ll, panOnScrollMode: zl, panOnDrag: Pl, autoPanOnSelection: hc, onPaneClick: Dl, onPaneMouseEnter: Rl, onPaneMouseMove: Hl, onPaneMouseLeave: Vl, onPaneScroll: Bl, onPaneContextMenu: Fl, paneClickDistance: Wl, nodeClickDistance: Yl, onSelectionContextMenu: M, onSelectionStart: T, onSelectionEnd: C, onReconnect: Gl, onReconnectStart: Xl, onReconnectEnd: ql, onEdgeContextMenu: Ul, onEdgeDoubleClick: Kl, onEdgeMouseEnter: Zl, onEdgeMouseMove: Ql, onEdgeMouseLeave: Jl, reconnectRadius: ec, defaultMarkerColor: Il, noDragClassName: rc, noWheelClassName: oc, noPanClassName: go, rfId: nr, disableKeyboardA11y: wo, nodeExtent: tr, viewport: vc, onViewportChange: _c, nodesDraggable: B }), v(cw, { onSelectionChange: D }), jl, v(ow, { proOptions: ac, position: sc }), v(rw, { rfId: nr, disableKeyboardA11y: wo })] }) });
}
var ml = Ya(Bb);
function Fb({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return v("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ge(["react-flow__background-pattern", n, r]) });
}
function Wb({ radius: e, className: t }) {
  return v("circle", { cx: e, cy: e, r: e, className: ge(["react-flow__background-pattern", "dots", t]) });
}
var Ue;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Ue || (Ue = {}));
const Yb = {
  [Ue.Dots]: 1,
  [Ue.Lines]: 1,
  [Ue.Cross]: 6
}, jb = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function yl({
  id: e,
  variant: t = Ue.Dots,
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
  const f = re(null), { transform: d, patternId: h } = oe(jb, ue), p = r || Yb[t], w = t === Ue.Dots, b = t === Ue.Cross, g = Array.isArray(n) ? n : [n, n], _ = [g[0] * d[2] || 1, g[1] * d[2] || 1], m = p * d[2], x = Array.isArray(i) ? i : [i, i], k = b ? [m, m] : _, E = [
    x[0] * d[2] + k[0] / 2,
    x[1] * d[2] + k[1] / 2
  ], I = `${h}${e || ""}`;
  return W("svg", { className: ge(["react-flow__background", c]), style: {
    ...l,
    ...Zn,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": s
  }, ref: f, "data-testid": "rf__background", children: [v("pattern", { id: I, x: d[0] % _[0], y: d[1] % _[1], width: _[0], height: _[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: w ? v(Wb, { radius: m / 2, className: u }) : v(Fb, { dimensions: k, lineWidth: o, variant: t, className: u }) }), v("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${I})` })] });
}
yl.displayName = "Background";
const wl = de(yl);
function Gb() {
  return v("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: v("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function Xb() {
  return v("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: v("path", { d: "M0 0h32v4.2H0z" }) });
}
function qb() {
  return v("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: v("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function Ub() {
  return v("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: v("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function Kb() {
  return v("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: v("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function fn({ children: e, className: t, ...n }) {
  return v("button", { type: "button", className: ge(["react-flow__controls-button", t]), ...n, children: e });
}
const Zb = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function bl({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: o, onZoomIn: i, onZoomOut: s, onFitView: a, onInteractiveChange: l, className: c, children: u, position: f = "bottom-left", orientation: d = "vertical", "aria-label": h }) {
  const p = le(), { isInteractive: w, minZoomReached: b, maxZoomReached: g, ariaLabelConfig: _ } = oe(Zb, ue), { zoomIn: m, zoomOut: x, fitView: k } = Kn(), E = () => {
    m(), i == null || i();
  }, I = () => {
    x(), s == null || s();
  }, A = () => {
    k(o), a == null || a();
  }, $ = () => {
    p.setState({
      nodesDraggable: !w,
      nodesConnectable: !w,
      elementsSelectable: !w
    }), l == null || l(!w);
  };
  return W(dt, { className: ge(["react-flow__controls", d === "horizontal" ? "horizontal" : "vertical", c]), position: f, style: e, "data-testid": "rf__controls", "aria-label": h ?? _["controls.ariaLabel"], children: [t && W(xe, { children: [v(fn, { onClick: E, className: "react-flow__controls-zoomin", title: _["controls.zoomIn.ariaLabel"], "aria-label": _["controls.zoomIn.ariaLabel"], disabled: g, children: v(Gb, {}) }), v(fn, { onClick: I, className: "react-flow__controls-zoomout", title: _["controls.zoomOut.ariaLabel"], "aria-label": _["controls.zoomOut.ariaLabel"], disabled: b, children: v(Xb, {}) })] }), n && v(fn, { className: "react-flow__controls-fitview", onClick: A, title: _["controls.fitView.ariaLabel"], "aria-label": _["controls.fitView.ariaLabel"], children: v(qb, {}) }), r && v(fn, { className: "react-flow__controls-interactive", onClick: $, title: _["controls.interactive.ariaLabel"], "aria-label": _["controls.interactive.ariaLabel"], children: w ? v(Kb, {}) : v(Ub, {}) }), u] });
}
bl.displayName = "Controls";
const xl = de(bl);
function Qb({ id: e, x: t, y: n, width: r, height: o, style: i, color: s, strokeColor: a, strokeWidth: l, className: c, borderRadius: u, shapeRendering: f, selected: d, onClick: h }) {
  const { background: p, backgroundColor: w } = i || {}, b = s || p || w;
  return v("rect", { className: ge(["react-flow__minimap-node", { selected: d }, c]), x: t, y: n, rx: u, ry: u, width: r, height: o, style: {
    fill: b,
    stroke: a,
    strokeWidth: l
  }, shapeRendering: f, onClick: h ? (g) => h(g, e) : void 0 });
}
const Jb = de(Qb), ex = (e) => e.nodes.map((t) => t.id), wr = (e) => e instanceof Function ? e : () => e;
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
  nodeComponent: i = Jb,
  onClick: s
}) {
  const a = oe(ex, ue), l = wr(t), c = wr(e), u = wr(n), f = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return v(xe, { children: a.map((d) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    v(rx, { id: d, nodeColorFunc: l, nodeStrokeColorFunc: c, nodeClassNameFunc: u, nodeBorderRadius: r, nodeStrokeWidth: o, NodeComponent: i, onClick: s, shapeRendering: f }, d)
  )) });
}
function nx({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: o, nodeStrokeWidth: i, shapeRendering: s, NodeComponent: a, onClick: l }) {
  const { node: c, x: u, y: f, width: d, height: h } = oe((p) => {
    const w = p.nodeLookup.get(e);
    if (!w)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const b = w.internals.userNode, { x: g, y: _ } = w.internals.positionAbsolute, { width: m, height: x } = Ae(b);
    return {
      node: b,
      x: g,
      y: _,
      width: m,
      height: x
    };
  }, ue);
  return !c || c.hidden || !ha(c) ? null : v(a, { x: u, y: f, width: d, height: h, style: c.style, selected: !!c.selected, className: r(c), color: t(c), borderRadius: o, strokeColor: n(c), strokeWidth: i, shapeRendering: s, onClick: l, id: c.id });
}
const rx = de(nx);
var ox = de(tx);
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
    boundingRect: n ? ua(Zt(e.nodeLookup, { filter: ax }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Gi = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, cx = (e, t) => Gi(e.viewBB, t.viewBB) && Gi(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, ux = "react-flow__minimap-desc";
function vl({
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
  pannable: w = !1,
  zoomable: b = !1,
  ariaLabel: g,
  inversePan: _,
  zoomStep: m = 1,
  offsetScale: x = 5
}) {
  const k = le(), E = re(null), { boundingRect: I, panZoom: A, viewBB: $, rfId: R, translateExtent: L, flowWidth: H, flowHeight: D, ariaLabelConfig: y } = oe(lx, cx), N = (e == null ? void 0 : e.width) ?? ix, S = (e == null ? void 0 : e.height) ?? sx, M = I.width / N, T = I.height / S, C = Math.max(M, T), z = C * N, O = C * S, V = x * C, j = I.x - (z - I.width) / 2 - V, Y = I.y - (O - I.height) / 2 - V, K = z + V * 2, ee = O + V * 2, q = `${ux}-${R}`, P = re(0), F = re();
  P.current = C, ie(() => {
    const J = k.getState().panZoom;
    if (E.current && J)
      return F.current = dy({
        domNode: E.current,
        panZoom: J,
        getTransform: () => k.getState().transform,
        getViewScale: () => P.current
      }), () => {
        var te;
        (te = F.current) == null || te.destroy();
      };
  }, [A]), ie(() => {
    var J;
    (J = F.current) == null || J.update({
      translateExtent: L,
      width: H,
      height: D,
      inversePan: _,
      pannable: w,
      zoomStep: m,
      zoomable: b
    });
  }, [w, b, _, m, L, H, D]);
  const U = h ? (J) => {
    var B;
    const [te, ne] = ((B = F.current) == null ? void 0 : B.pointer(J)) || [0, 0];
    h(J, { x: te, y: ne });
  } : void 0, Z = Ce((J, te) => {
    const ne = k.getState().nodeLookup.get(te).internals.userNode;
    p == null || p(J, ne);
  }, [p]), X = p ? Z : void 0, Q = g ?? y["minimap.ariaLabel"];
  return v(dt, { position: d, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-background-color-props": typeof c == "string" ? c : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * C : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: ge(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: W("svg", { width: N, height: S, viewBox: `${j} ${Y} ${K} ${ee}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": q, ref: E, onClick: U, children: [Q && v("title", { id: q, children: Q }), v(ox, { onClick: X, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: i, nodeClassName: o, nodeStrokeWidth: s, nodeComponent: a }), v("path", { className: "react-flow__minimap-mask", d: `M${j - V},${Y - V}h${K + V * 2}v${ee + V * 2}h${-K - V * 2}z
        M${$.x},${$.y}h${$.width}v${$.height}h${-$.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
vl.displayName = "MiniMap";
const _l = de(vl), dx = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, fx = {
  [kt.Line]: "right",
  [kt.Handle]: "bottom-right"
};
function hx({ nodeId: e, position: t, variant: n = kt.Handle, className: r, style: o = void 0, children: i, color: s, minWidth: a = 10, minHeight: l = 10, maxWidth: c = Number.MAX_VALUE, maxHeight: u = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: d, autoScale: h = !0, shouldResize: p, onResizeStart: w, onResize: b, onResizeEnd: g }) {
  const _ = Ua(), m = typeof e == "string" ? e : _, x = le(), k = re(null), E = n === kt.Handle, I = oe(Ce(dx(E && h), [E, h]), ue), A = re(null), $ = t ?? fx[n];
  ie(() => {
    if (!(!k.current || !m))
      return A.current || (A.current = ky({
        domNode: k.current,
        nodeId: m,
        getStoreItems: () => {
          const { nodeLookup: L, transform: H, snapGrid: D, snapToGrid: y, nodeOrigin: N, domNode: S } = x.getState();
          return {
            nodeLookup: L,
            transform: H,
            snapGrid: D,
            snapToGrid: y,
            nodeOrigin: N,
            paneDomNode: S
          };
        },
        onChange: (L, H) => {
          const { triggerNodeChanges: D, nodeLookup: y, parentLookup: N, nodeOrigin: S } = x.getState(), M = [], T = { x: L.x, y: L.y }, C = y.get(m);
          if (C && C.expandParent && C.parentId) {
            const z = C.origin ?? S, O = L.width ?? C.measured.width ?? 0, V = L.height ?? C.measured.height ?? 0, j = {
              id: C.id,
              parentId: C.parentId,
              rect: {
                width: O,
                height: V,
                ...pa({
                  x: L.x ?? C.position.x,
                  y: L.y ?? C.position.y
                }, { width: O, height: V }, C.parentId, y, z)
              }
            }, Y = ao([j], y, N, S);
            M.push(...Y), T.x = L.x ? Math.max(z[0] * O, L.x) : void 0, T.y = L.y ? Math.max(z[1] * V, L.y) : void 0;
          }
          if (T.x !== void 0 && T.y !== void 0) {
            const z = {
              id: m,
              type: "position",
              position: { ...T }
            };
            M.push(z);
          }
          if (L.width !== void 0 && L.height !== void 0) {
            const O = {
              id: m,
              type: "dimensions",
              resizing: !0,
              setAttributes: d ? d === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: L.width,
                height: L.height
              }
            };
            M.push(O);
          }
          for (const z of H) {
            const O = {
              ...z,
              type: "position"
            };
            M.push(O);
          }
          D(M);
        },
        onEnd: ({ width: L, height: H }) => {
          const D = {
            id: m,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: L,
              height: H
            }
          };
          x.getState().triggerNodeChanges([D]);
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
        onResizeStart: w,
        onResize: b,
        onResizeEnd: g,
        shouldResize: p
      }), () => {
        var L;
        (L = A.current) == null || L.destroy();
      };
  }, [
    $,
    a,
    l,
    c,
    u,
    f,
    w,
    b,
    g,
    p
  ]);
  const R = $.split("-");
  return v("div", { className: ge(["react-flow__resize-control", "nodrag", ...R, n, r]), ref: k, style: {
    ...o,
    scale: I,
    ...s && { [E ? "backgroundColor" : "borderColor"]: s }
  }, children: i });
}
de(hx);
const px = ".react-flow{direction:ltr;--xy-edge-stroke-default: #b1b1b7;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #555;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(255, 255, 255, .5);--xy-minimap-background-color-default: #fff;--xy-minimap-mask-background-color-default: rgba(240, 240, 240, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #e2e2e2;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: transparent;--xy-background-pattern-dots-color-default: #91919a;--xy-background-pattern-lines-color-default: #eee;--xy-background-pattern-cross-color-default: #e2e2e2;background-color:var(--xy-background-color, var(--xy-background-color-default));--xy-node-color-default: inherit;--xy-node-border-default: 1px solid #1a192b;--xy-node-background-color-default: #fff;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #1a192b;--xy-node-border-radius-default: 3px;--xy-handle-background-color-default: #1a192b;--xy-handle-border-color-default: #fff;--xy-selection-background-color-default: rgba(0, 89, 220, .08);--xy-selection-border-default: 1px dotted rgba(0, 89, 220, .8);--xy-controls-button-background-color-default: #fefefe;--xy-controls-button-background-color-hover-default: #f4f4f4;--xy-controls-button-color-default: inherit;--xy-controls-button-color-hover-default: inherit;--xy-controls-button-border-color-default: #eee;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #ffffff;--xy-edge-label-color-default: inherit;--xy-resize-background-color-default: #3367d9}.react-flow.dark{--xy-edge-stroke-default: #3e3e3e;--xy-edge-stroke-width-default: 1;--xy-edge-stroke-selected-default: #727272;--xy-connectionline-stroke-default: #b1b1b7;--xy-connectionline-stroke-width-default: 1;--xy-attribution-background-color-default: rgba(150, 150, 150, .25);--xy-minimap-background-color-default: #141414;--xy-minimap-mask-background-color-default: rgba(60, 60, 60, .6);--xy-minimap-mask-stroke-color-default: transparent;--xy-minimap-mask-stroke-width-default: 1;--xy-minimap-node-background-color-default: #2b2b2b;--xy-minimap-node-stroke-color-default: transparent;--xy-minimap-node-stroke-width-default: 2;--xy-background-color-default: #141414;--xy-background-pattern-dots-color-default: #555;--xy-background-pattern-lines-color-default: #333;--xy-background-pattern-cross-color-default: #333;--xy-node-color-default: #f8f8f8;--xy-node-border-default: 1px solid #3c3c3c;--xy-node-background-color-default: #1e1e1e;--xy-node-group-background-color-default: rgba(240, 240, 240, .25);--xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, .08);--xy-node-boxshadow-selected-default: 0 0 0 .5px #999;--xy-handle-background-color-default: #bebebe;--xy-handle-border-color-default: #1e1e1e;--xy-selection-background-color-default: rgba(200, 200, 220, .08);--xy-selection-border-default: 1px dotted rgba(200, 200, 220, .8);--xy-controls-button-background-color-default: #2b2b2b;--xy-controls-button-background-color-hover-default: #3e3e3e;--xy-controls-button-color-default: #f8f8f8;--xy-controls-button-color-hover-default: #fff;--xy-controls-button-border-color-default: #5b5b5b;--xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, .08);--xy-edge-label-background-color-default: #141414;--xy-edge-label-color-default: #f8f8f8}.react-flow__background{background-color:var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default)));pointer-events:none;z-index:-1}.react-flow__container{position:absolute;width:100%;height:100%;top:0;left:0}.react-flow__pane{z-index:1;touch-action:none}.react-flow__pane.draggable{cursor:grab}.react-flow__pane.dragging{cursor:grabbing}.react-flow__pane.selection{cursor:pointer}.react-flow__viewport{transform-origin:0 0;z-index:2;pointer-events:none}.react-flow__renderer{z-index:4}.react-flow__selection{z-index:6}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible{outline:none}.react-flow__edge-path{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default));stroke-width:var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default));fill:none}.react-flow__connection-path{stroke:var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default));stroke-width:var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default));fill:none}.react-flow .react-flow__edges{position:absolute}.react-flow .react-flow__edges svg{overflow:visible;position:absolute;pointer-events:none}.react-flow__edge{pointer-events:visibleStroke}.react-flow__edge.selectable{cursor:pointer}.react-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.react-flow__edge.animated path.react-flow__edge-interaction{stroke-dasharray:none;animation:none}.react-flow__edge.inactive{pointer-events:none}.react-flow__edge.selected,.react-flow__edge:focus,.react-flow__edge:focus-visible{outline:none}.react-flow__edge.selected .react-flow__edge-path,.react-flow__edge.selectable:focus .react-flow__edge-path,.react-flow__edge.selectable:focus-visible .react-flow__edge-path{stroke:var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default))}.react-flow__edge-textwrapper{pointer-events:all}.react-flow__edge .react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__arrowhead polyline{stroke:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__arrowhead polyline.arrowclosed{fill:var(--xy-edge-stroke, var(--xy-edge-stroke-default))}.react-flow__connection{pointer-events:none}.react-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}svg.react-flow__connectionline{z-index:1001;overflow:visible;position:absolute}.react-flow__nodes{pointer-events:none;transform-origin:0 0}.react-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.react-flow__node.selectable{cursor:pointer}.react-flow__node.draggable{cursor:grab;pointer-events:all}.react-flow__node.draggable.dragging{cursor:grabbing}.react-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.react-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px;width:6px;height:6px;background-color:var(--xy-handle-background-color, var(--xy-handle-background-color-default));border:1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default));border-radius:100%}.react-flow__handle.connectingfrom{pointer-events:all}.react-flow__handle.connectionindicator{pointer-events:all;cursor:crosshair}.react-flow__handle-bottom{top:auto;left:50%;bottom:0;transform:translate(-50%,50%)}.react-flow__handle-top{top:0;left:50%;transform:translate(-50%,-50%)}.react-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.react-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.react-flow__edgeupdater{cursor:move;pointer-events:all}.react-flow__pane.selection .react-flow__panel{pointer-events:none}.react-flow__panel{position:absolute;z-index:5;margin:15px}.react-flow__panel.top{top:0}.react-flow__panel.bottom{bottom:0}.react-flow__panel.top.center,.react-flow__panel.bottom.center{left:50%;transform:translate(-15px) translate(-50%)}.react-flow__panel.left{left:0}.react-flow__panel.right{right:0}.react-flow__panel.left.center,.react-flow__panel.right.center{top:50%;transform:translateY(-15px) translateY(-50%)}.react-flow__attribution{font-size:10px;background:var(--xy-attribution-background-color, var(--xy-attribution-background-color-default));padding:2px 3px;margin:0}.react-flow__attribution a{text-decoration:none;color:#999}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edgelabel-renderer{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;left:0;top:0}.react-flow__viewport-portal{position:absolute;width:100%;height:100%;left:0;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__minimap{background:var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) )}.react-flow__minimap-svg{display:block}.react-flow__minimap-mask{fill:var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) );stroke:var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) );stroke-width:var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) )}.react-flow__minimap-node{fill:var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) );stroke:var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) );stroke-width:var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) )}.react-flow__background-pattern.dots{fill:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) )}.react-flow__background-pattern.lines{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) )}.react-flow__background-pattern.cross{stroke:var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) )}.react-flow__controls{display:flex;flex-direction:column;box-shadow:var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default))}.react-flow__controls.horizontal{flex-direction:row}.react-flow__controls-button{display:flex;justify-content:center;align-items:center;height:26px;width:26px;padding:4px;border:none;background:var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default));border-bottom:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) );color:var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) );cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.react-flow__controls-button svg{width:100%;max-width:12px;max-height:12px;fill:currentColor}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-text{font-size:10px}.react-flow__node.selectable:focus,.react-flow__node.selectable:focus-visible{outline:none}.react-flow__node-input,.react-flow__node-default,.react-flow__node-output,.react-flow__node-group{padding:10px;border-radius:var(--xy-node-border-radius, var(--xy-node-border-radius-default));width:150px;font-size:12px;color:var(--xy-node-color, var(--xy-node-color-default));text-align:center;border:var(--xy-node-border, var(--xy-node-border-default));background-color:var(--xy-node-background-color, var(--xy-node-background-color-default))}.react-flow__node-input.selectable:hover,.react-flow__node-default.selectable:hover,.react-flow__node-output.selectable:hover,.react-flow__node-group.selectable:hover{box-shadow:var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default))}.react-flow__node-input.selectable.selected,.react-flow__node-input.selectable:focus,.react-flow__node-input.selectable:focus-visible,.react-flow__node-default.selectable.selected,.react-flow__node-default.selectable:focus,.react-flow__node-default.selectable:focus-visible,.react-flow__node-output.selectable.selected,.react-flow__node-output.selectable:focus,.react-flow__node-output.selectable:focus-visible,.react-flow__node-group.selectable.selected,.react-flow__node-group.selectable:focus,.react-flow__node-group.selectable:focus-visible{box-shadow:var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default))}.react-flow__node-group{background-color:var(--xy-node-group-background-color, var(--xy-node-group-background-color-default))}.react-flow__nodesselection-rect,.react-flow__selection{background:var(--xy-selection-background-color, var(--xy-selection-background-color-default));border:var(--xy-selection-border, var(--xy-selection-border-default))}.react-flow__nodesselection-rect:focus,.react-flow__nodesselection-rect:focus-visible,.react-flow__selection:focus,.react-flow__selection:focus-visible{outline:none}.react-flow__controls-button:hover{background:var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) );color:var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) )}.react-flow__controls-button:disabled{pointer-events:none}.react-flow__controls-button:disabled svg{fill-opacity:.4}.react-flow__controls-button:last-child{border-bottom:none}.react-flow__controls.horizontal .react-flow__controls-button{border-bottom:none;border-right:1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) )}.react-flow__controls.horizontal .react-flow__controls-button:last-child{border-right:none}.react-flow__resize-control{position:absolute}.react-flow__resize-control.left,.react-flow__resize-control.right{cursor:ew-resize}.react-flow__resize-control.top,.react-flow__resize-control.bottom{cursor:ns-resize}.react-flow__resize-control.top.left,.react-flow__resize-control.bottom.right{cursor:nwse-resize}.react-flow__resize-control.bottom.left,.react-flow__resize-control.top.right{cursor:nesw-resize}.react-flow__resize-control.handle{width:5px;height:5px;border:1px solid #fff;border-radius:1px;background-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));translate:-50% -50%}.react-flow__resize-control.handle.left{left:0;top:50%}.react-flow__resize-control.handle.right{left:100%;top:50%}.react-flow__resize-control.handle.top{left:50%;top:0}.react-flow__resize-control.handle.bottom{left:50%;top:100%}.react-flow__resize-control.handle.top.left,.react-flow__resize-control.handle.bottom.left{left:0}.react-flow__resize-control.handle.top.right,.react-flow__resize-control.handle.bottom.right{left:100%}.react-flow__resize-control.line{border-color:var(--xy-resize-background-color, var(--xy-resize-background-color-default));border-width:0;border-style:solid}.react-flow__resize-control.line.left,.react-flow__resize-control.line.right{width:1px;transform:translate(-50%);top:0;height:100%}.react-flow__resize-control.line.left{left:0;border-left-width:1px}.react-flow__resize-control.line.right{left:100%;border-right-width:1px}.react-flow__resize-control.line.top,.react-flow__resize-control.line.bottom{height:1px;transform:translateY(-50%);left:0;width:100%}.react-flow__resize-control.line.top{top:0;border-top-width:1px}.react-flow__resize-control.line.bottom{border-bottom-width:1px;top:100%}.react-flow__edge-textbg{fill:var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default))}.react-flow__edge-text{fill:var(--xy-edge-label-color, var(--xy-edge-label-color-default))}", uo = 0.05, El = 370, Xi = "system-map-flow-css", gx = `
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
if (!document.getElementById(Xi)) {
  const e = document.createElement("style");
  e.id = Xi, e.textContent = px + gx, document.head.appendChild(e);
}
function kl(e, t) {
  const n = Kn(), r = oe((s) => s.width), o = oe((s) => s.height), i = re(!1);
  ie(() => {
    if (!r || !o || e.length === 0) return;
    const s = Math.min(...e.map((d) => d.x)), a = Math.min(...e.map((d) => d.y)), l = Math.max(...e.map((d) => d.x + d.width)), c = Math.max(...e.map((d) => d.y + d.height)), u = Math.min(t, r * 0.5), f = Gn(
      { x: s, y: a, width: l - s, height: c - a },
      r - u,
      o,
      uo,
      1,
      0.05
    );
    n.setViewport(f, { duration: i.current ? 200 : 0 }), i.current = !0;
  }, [n, e, t, r, o]);
}
const bn = { names: 210, keys: 240, columns: 240 }, Dr = 34, Ot = 20, mx = de(function({ data: t }) {
  const { table: n, columns: r, hidden: o, flags: i, focused: s, width: a, large: l } = t, c = n.status === "external";
  return /* @__PURE__ */ W(
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
        /* @__PURE__ */ v(Ke, { type: "target", position: G.Left, isConnectable: !1 }),
        /* @__PURE__ */ v(Ke, { type: "source", position: G.Right, isConnectable: !1 }),
        /* @__PURE__ */ W(
          "div",
          {
            style: {
              height: Dr,
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
              /* @__PURE__ */ v("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.name }),
              /* @__PURE__ */ W("span", { style: { display: "flex", gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }, children: [
                i > 0 && /* @__PURE__ */ v("span", { style: { color: "var(--warn-text, #b45309)" }, children: i }),
                n.rls === !1 && /* @__PURE__ */ v("span", { style: { color: "var(--danger, #dc2626)" }, children: "no RLS" }),
                c && /* @__PURE__ */ v("span", { style: he, children: "outside" })
              ] })
            ]
          }
        ),
        r.map((u) => /* @__PURE__ */ W(
          "div",
          {
            style: { height: Ot, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" },
            children: [
              /* @__PURE__ */ v("span", { style: { width: 16, color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: 10 }, children: u.primary ? "PK" : u.foreign ? "FK" : "" }),
              /* @__PURE__ */ v("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u.name }),
              /* @__PURE__ */ v("span", { style: { ...he, ...Xt, fontSize: 11, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: u.type })
            ]
          },
          u.name
        )),
        o > 0 && /* @__PURE__ */ W("div", { style: { ...he, height: Ot, padding: "0 10px", lineHeight: `${Ot}px` }, children: [
          "+",
          o,
          " more"
        ] })
      ]
    }
  );
}), yx = { table: mx };
function Sl(e, t) {
  return t === "names" ? [] : t === "columns" ? e.columns : e.columns.filter((n) => n.primary || n.foreign);
}
function zn(e, t) {
  if (t === "names") return Dr + 2;
  const n = Sl(e, t).length;
  return Dr + n * Ot + (n < e.columns.length ? Ot : 0) + 2;
}
function wx(e, t) {
  const n = bn[t], r = new En.graphlib.Graph({ multigraph: !0 }), o = t === "names";
  r.setGraph({ rankdir: "LR", nodesep: o ? 12 : 24, ranksep: o ? 70 : 110, marginx: 16, marginy: 16 }), r.setDefaultEdgeLabel(() => ({}));
  const i = new Set(e.tables.map((a) => a.id));
  for (const a of e.tables) r.setNode(a.id, { width: n, height: zn(a, t) });
  for (const a of e.edges)
    a.source !== a.target && i.has(a.target) && r.setEdge(a.source, a.target, {}, a.id);
  En.layout(r);
  const s = /* @__PURE__ */ new Map();
  for (const a of e.tables) {
    const l = r.node(a.id);
    s.set(a.id, { x: l.x - n / 2, y: l.y - zn(a, t) / 2 });
  }
  return s;
}
function bx(e, t) {
  const n = e.edges.filter((o) => o.source === t || o.target === t), r = /* @__PURE__ */ new Set([t, ...n.flatMap((o) => [o.source, o.target])]);
  return { tables: e.tables.filter((o) => r.has(o.id)), edges: n };
}
const Rr = [
  ["cascade", "var(--danger, #dc2626)"],
  ["set null", "var(--warn-text, #b45309)"],
  ["no action", "var(--border-strong, #a1a1aa)"]
];
function xx(e) {
  return (Rr.find(([t]) => t === e) ?? Rr[2])[1];
}
function vx() {
  return /* @__PURE__ */ W(
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
        /* @__PURE__ */ v("span", { style: he, children: "On delete" }),
        Rr.map(([e, t]) => /* @__PURE__ */ W("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ v("span", { style: { width: 14, height: 2, background: t } }),
          e
        ] }, e))
      ]
    }
  );
}
function _x({
  graph: e,
  selected: t,
  flagged: n,
  density: r,
  onSelect: o
}) {
  const { mode: i } = Zi(), s = ce(() => t ? bx(e, t) : e, [e, t]), a = t && r === "names" ? "keys" : r, l = ce(() => wx(s, a), [s, a]), c = ce(
    () => s.tables.map((d) => {
      const h = Sl(d, a);
      return {
        id: d.id,
        type: "table",
        position: l.get(d.id) ?? { x: 0, y: 0 },
        width: bn[a],
        height: zn(d, a),
        data: {
          table: d,
          columns: h,
          hidden: a === "names" ? 0 : d.columns.length - h.length,
          flags: n.get(d.id) ?? 0,
          focused: d.id === t,
          width: bn[a],
          large: a === "names"
        }
      };
    }),
    [s, a, l, n, t]
  ), u = ce(
    () => s.edges.map((d) => {
      const h = xx(d.on_delete);
      return {
        id: d.id,
        source: d.source,
        target: d.target,
        selectable: !1,
        markerEnd: { type: vt.ArrowClosed, width: 14, height: 14, color: h },
        style: { stroke: h, strokeWidth: t ? 2 : 1, opacity: 0.8 }
      };
    }),
    [s, t]
  ), f = ce(
    () => s.tables.map((d) => ({
      ...l.get(d.id) ?? { x: 0, y: 0 },
      width: bn[a],
      height: zn(d, a)
    })),
    [s, l, a]
  );
  return kl(f, t ? El : 0), /* @__PURE__ */ W(
    ml,
    {
      nodes: c,
      edges: u,
      nodeTypes: yx,
      colorMode: i,
      minZoom: uo,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (d, h) => o(h.id),
      onPaneClick: () => o(null),
      children: [
        /* @__PURE__ */ v(wl, { gap: 24, size: 1 }),
        /* @__PURE__ */ v(xl, { showInteractive: !1 }),
        /* @__PURE__ */ v(_l, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ v(dt, { position: "top-left", children: /* @__PURE__ */ v(vx, {}) })
      ]
    }
  );
}
function Ex(e) {
  return /* @__PURE__ */ v("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "erd", children: /* @__PURE__ */ v(co, { children: /* @__PURE__ */ v(_x, { ...e }) }) });
}
const kx = ["high", "medium", "low", "info"];
function Sx({
  findings: e,
  onShow: t,
  onAsk: n
}) {
  const [r, o] = ae(null), i = ce(() => {
    const a = /* @__PURE__ */ new Map();
    for (const l of e) a.set(l.severity, (a.get(l.severity) ?? 0) + 1);
    return a;
  }, [e]), s = r ? e.filter((a) => a.severity === r) : e;
  return /* @__PURE__ */ W("div", { style: { position: "absolute", inset: 0, overflowY: "auto", padding: 16, fontSize: 13, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ W("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ W(ze, { primary: r === null, onClick: () => o(null), children: [
        "All ",
        e.length
      ] }),
      kx.filter((a) => i.get(a)).map((a) => /* @__PURE__ */ W(ze, { primary: r === a, onClick: () => o(a), children: [
        a,
        " ",
        i.get(a)
      ] }, a))
    ] }),
    s.length === 0 && /* @__PURE__ */ v("p", { style: he, children: "No findings." }),
    s.map((a) => /* @__PURE__ */ W("div", { style: { padding: "10px 0", borderTop: "1px solid var(--border, #e4e4e7)" }, children: [
      /* @__PURE__ */ W("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ v(Dc, { severity: a.severity }),
        /* @__PURE__ */ v("span", { style: { flex: 1, fontWeight: 600 }, children: a.title }),
        /* @__PURE__ */ v("button", { style: xn, onClick: () => t(a.node), children: "Show" }),
        /* @__PURE__ */ v("button", { style: xn, onClick: () => n(a), children: "Ask" })
      ] }),
      /* @__PURE__ */ v("p", { style: { margin: "4px 0 0" }, children: a.detail }),
      /* @__PURE__ */ v("p", { style: { ...he, ...Xt, fontSize: 12, margin: "4px 0 0", overflowWrap: "anywhere" }, children: a.evidence.join("  ") })
    ] }, a.id))
  ] });
}
const Nx = /* @__PURE__ */ new Set(["planned", "partial"]), fo = "group:tables", Pe = "group:routes", ft = "group:jobs";
function On(e) {
  return e.replace(/^src\//, "");
}
function Cx(e) {
  switch (e.kind) {
    case "area":
      return { id: e.id, kind: "area", title: On(e.path ?? e.name), subtitle: `${e.files} files, ${e.lines} lines` };
    case "module": {
      const t = e.area === `area:${e.path}`;
      return {
        id: e.id,
        kind: "module",
        title: t ? `${e.name} (top level)` : e.name,
        subtitle: `${e.files} files, ${e.lines} lines`
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
function ho(e, t) {
  const n = e.nodes.filter((s) => s.kind === "route"), r = n.filter((s) => s.route_kind === "api").length, o = e.nodes.filter((s) => s.kind === "job").length, i = [];
  return n.length && i.push({ id: Pe, kind: "group", title: "Routes", subtitle: `${n.length - r} pages, ${r} API` }), t && i.push({ id: fo, kind: "group", title: "Database", subtitle: `${t} tables` }), o && i.push({ id: ft, kind: "group", title: "Scheduled jobs", subtitle: `${o} jobs` }), i;
}
function Mx(e) {
  return { id: e, kind: "table", title: e.replace(/^table:(public\.)?/, ""), subtitle: "table" };
}
const Ix = 3;
function qi(e, t) {
  if (e.startsWith("table:")) return fo;
  const n = t.byId.get(e);
  return n ? (n.kind === "module" || n.kind === "area") && t.routesDir && n.path === t.routesDir ? Pe : n.kind === "module" ? n.area === t.open ? e : n.area ?? e : n.kind === "route" ? t.expanded === Pe ? e : Pe : n.kind === "job" ? t.expanded === ft ? e : ft : e : null;
}
function Nl(e, t) {
  return (e == null ? void 0 : e.kind) === "plan" && (!t || !Nx.has(e.status));
}
function po(e, t, n, r) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e.edges) {
    if (Nl(t.byId.get(i.source), n)) continue;
    const s = qi(i.source, t), a = qi(i.target, t);
    if (!s || !a || s === a || !r(s, a)) continue;
    const l = `${s}|${a}|${i.kind}`, c = o.get(l);
    c ? c.count += i.count : o.set(l, { id: l, source: s, target: a, kind: i.kind, count: i.count });
  }
  return [...o.values()];
}
function Jn(e, t, n) {
  const r = [];
  for (const o of e) {
    const i = n.find((a) => a.id === o), s = t.byId.get(o);
    i ? r.push(i) : s ? r.push(Cx(s)) : o.startsWith("table:") && r.push(Mx(o));
  }
  return r;
}
function $x(e, t, n, r) {
  const o = ho(e, n), i = po(e, t, r, () => !0).filter((a) => a.kind !== "imports" || a.count >= Ix), s = new Set(o.map((a) => a.id));
  for (const a of e.nodes)
    a.kind === "area" && a.path !== t.routesDir && s.add(a.id), a.kind === "service" && s.add(a.id), a.kind === "plan" && !Nl(a, r) && s.add(a.id);
  return { cards: Jn(s, t, o), lines: i.filter((a) => s.has(a.source) && s.has(a.target)) };
}
function Ax(e, t, n, r) {
  const o = new Set(e.nodes.filter((a) => a.area === t.open && a.kind === "module").map((a) => a.id)), i = po(
    e,
    t,
    r,
    (a, l) => (o.has(a) || o.has(l)) && !a.startsWith("area:") && !l.startsWith("area:")
  ), s = new Set(o);
  for (const a of i)
    s.add(a.source), s.add(a.target);
  return { cards: Jn(s, t, ho(e, n)), lines: i };
}
function Tx(e, t, n, r) {
  const o = t.expanded === Pe ? "route" : "job", i = new Set(e.nodes.filter((l) => l.kind === o).map((l) => l.id)), s = po(e, t, r, (l, c) => i.has(l) || i.has(c)), a = new Set(i);
  for (const l of s)
    a.add(l.source), a.add(l.target);
  return { cards: Jn(a, t, ho(e, n)), lines: s };
}
function Lx(e, t, n) {
  const r = [], o = /* @__PURE__ */ new Set([n]);
  for (const i of e.edges)
    i.source !== n && i.target !== n || (o.add(i.source), o.add(i.target), r.push({ id: `${i.source}|${i.target}|${i.kind}`, source: i.source, target: i.target, kind: i.kind, count: i.count }));
  return { cards: Jn(o, t, []), lines: r };
}
function Cl(e) {
  const t = e.nodes.find((r) => r.kind === "route"), n = t == null ? void 0 : t.evidence[0];
  return n ? n.slice(0, n.lastIndexOf("/")) : null;
}
function zx(e, t, n, r) {
  const o = new Map(e.nodes.map((u) => [u.id, u])), i = Cl(e), s = t === `area:${i}` ? Pe : t, a = s != null && s.startsWith("area:") ? s : null, l = s === Pe || s === ft ? s : null, c = { byId: o, open: a, expanded: l, routesDir: i };
  return s ? a ? Ax(e, c, n, r) : l ? Tx(e, c, n, r) : Lx(e, c, s) : $x(e, c, n, r);
}
function Ox(e, t) {
  const n = [{ id: null, label: "System" }];
  if (!t) return n;
  if (t === Pe || t === `area:${Cl(e)}`) return [...n, { id: t, label: "Routes" }];
  if (t === ft) return [...n, { id: t, label: "Scheduled jobs" }];
  if (t.startsWith("table:")) return [...n, { id: t, label: t.replace(/^table:(public\.)?/, "") }];
  const r = e.nodes.find((o) => o.id === t);
  if (!r) return n;
  if (r.kind === "area") return [...n, { id: t, label: On(r.path ?? r.name) }];
  if (r.kind === "module") {
    const o = e.nodes.find((i) => i.id === r.area);
    return [
      ...n,
      { id: r.area ?? null, label: On((o == null ? void 0 : o.path) ?? "") },
      { id: t, label: r.name }
    ];
  }
  return r.kind === "route" ? [...n, { id: Pe, label: "Routes" }, { id: t, label: r.name }] : r.kind === "job" ? [...n, { id: ft, label: "Scheduled jobs" }, { id: t, label: r.name }] : [...n, { id: t, label: r.name }];
}
const Px = [
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
function Dx(e) {
  return On(e.replace(/^(module|area|route|job|service|plan|table):(public\.)?/, ""));
}
function Ml({ title: e, children: t }) {
  return /* @__PURE__ */ W("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ v("p", { style: { margin: "0 0 4px", fontWeight: 600 }, children: e }),
    t
  ] });
}
function Rx({ link: e, onOpen: t }) {
  return /* @__PURE__ */ W("div", { style: { display: "flex", gap: 6, alignItems: "baseline" }, title: e.evidence[0], children: [
    /* @__PURE__ */ v(
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
        children: Dx(e.node)
      }
    ),
    e.access && /* @__PURE__ */ v("span", { style: { ...he, fontSize: 11 }, children: e.access === "write" ? "writes" : "reads" }),
    /* @__PURE__ */ v("span", { style: { ...he, fontSize: 11, marginLeft: "auto" }, children: e.count })
  ] });
}
function Hx({ node: e, onOpen: t }) {
  return /* @__PURE__ */ v(xe, { children: Px.map(({ key: n, title: r }) => {
    var i;
    const o = (i = e.links) == null ? void 0 : i[n];
    return o != null && o.length ? /* @__PURE__ */ v(Ml, { title: `${r} (${o.length})`, children: o.map((s) => /* @__PURE__ */ v(Rx, { link: s, onOpen: t }, s.node)) }, n) : null;
  }) });
}
function Vx({ node: e }) {
  const n = [
    ["Path", e.path],
    ["Files", e.files],
    ["Lines", e.lines],
    ["Test files", e.test_files],
    ["Schedule", e.schedule],
    ["Status", e.status]
  ].filter(([, r]) => r !== void 0 && r !== "");
  return /* @__PURE__ */ v("table", { style: { width: "100%", borderCollapse: "collapse", marginBottom: 12 }, children: /* @__PURE__ */ v("tbody", { children: n.map(([r, o]) => /* @__PURE__ */ W("tr", { children: [
    /* @__PURE__ */ v("td", { style: { ...he, padding: "1px 8px 1px 0", whiteSpace: "nowrap" }, children: r }),
    /* @__PURE__ */ v("td", { style: { overflowWrap: "anywhere" }, children: o })
  ] }, r)) }) });
}
function Bx({ node: e }) {
  const n = (e.claims ?? []).filter((r) => !r.found);
  return n.length === 0 ? null : /* @__PURE__ */ v(Ml, { title: `Not found (${n.length})`, children: /* @__PURE__ */ v("ul", { style: { ...Xt, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: "anywhere" }, children: n.map((r) => /* @__PURE__ */ v("li", { title: r.source, children: r.claim }, r.claim)) }) });
}
function Fx({
  node: e,
  onAsk: t,
  onOpen: n,
  onClose: r,
  canAsk: o,
  onAskFinding: i
}) {
  var a;
  const s = e.id.startsWith("table:");
  return /* @__PURE__ */ W(
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
        /* @__PURE__ */ W("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ v("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: "var(--text, inherit)", overflowWrap: "anywhere" }, children: e.name }),
          !s && /* @__PURE__ */ v(nt, { variant: "muted", children: e.kind }),
          /* @__PURE__ */ v(ze, { primary: !0, onClick: t, disabled: !o, children: "Ask" }),
          /* @__PURE__ */ v(ze, { onClick: r, "aria-label": "Close", children: "Close" })
        ] }),
        /* @__PURE__ */ W("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, fontSize: 13, color: "var(--text, inherit)" }, children: [
          s ? /* @__PURE__ */ v(Rc, { node: e, onAsk: i }) : /* @__PURE__ */ v(Vx, { node: e }),
          !s && /* @__PURE__ */ v(Bx, { node: e }),
          /* @__PURE__ */ v(Hx, { node: e, onOpen: n }),
          !s && /* @__PURE__ */ v("p", { style: { ...he, ...Xt, fontSize: 11, margin: 0, overflowWrap: "anywhere" }, children: (a = e.evidence) == null ? void 0 : a.join("  ") })
        ] })
      ]
    }
  );
}
const Wx = [
  { status: "planned", title: "Not built", note: "Most of what it names does not exist" },
  { status: "partial", title: "Partly built", note: "Some of what it names exists" },
  { status: "built", title: "Built", note: "What it names exists" },
  { status: "unclear", title: "Unclear", note: "Names too little to judge" }
], Yx = {
  derived: "from the code",
  declared: "from the spec",
  you: "set by you"
}, jx = {
  padding: 10,
  borderRadius: 8,
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e4e4e7)",
  fontSize: 13
};
function Gx({
  plan: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.claims.filter((i) => !i.found);
  return /* @__PURE__ */ W("div", { style: jx, "data-testid": e.id, children: [
    /* @__PURE__ */ v("p", { style: { margin: 0, fontWeight: 600 }, children: e.name }),
    /* @__PURE__ */ W("p", { style: { ...he, margin: "2px 0 6px", fontSize: 12 }, children: [
      e.found,
      " found, ",
      e.missing,
      " missing, ",
      Yx[e.status_source]
    ] }),
    o.length > 0 && /* @__PURE__ */ W("ul", { style: { ...Xt, margin: "0 0 8px", paddingLeft: 14, fontSize: 11, overflowWrap: "anywhere" }, children: [
      o.slice(0, 8).map((i) => /* @__PURE__ */ v("li", { title: i.source, children: i.claim }, i.claim)),
      o.length > 8 && /* @__PURE__ */ W("li", { style: he, children: [
        "and ",
        o.length - 8,
        " more"
      ] })
    ] }),
    /* @__PURE__ */ W("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ v("button", { style: xn, onClick: () => t(e.id), children: "Show" }),
      /* @__PURE__ */ v("button", { style: xn, onClick: () => n(e), children: "Ask" }),
      /* @__PURE__ */ v("span", { style: { flex: 1 } }),
      /* @__PURE__ */ W(
        "select",
        {
          "aria-label": `Status of ${e.name}`,
          value: e.status_source === "you" ? e.status : "",
          onChange: (i) => r(e.id, i.target.value || null),
          style: { fontSize: 11, background: "transparent", color: "var(--muted, #71717a)", border: 0 },
          children: [
            /* @__PURE__ */ v("option", { value: "", children: "Auto" }),
            /* @__PURE__ */ v("option", { value: "built", children: "Mark built" }),
            /* @__PURE__ */ v("option", { value: "partial", children: "Mark partly built" }),
            /* @__PURE__ */ v("option", { value: "planned", children: "Mark not built" })
          ]
        }
      )
    ] })
  ] });
}
function Xx({
  plans: e,
  onShow: t,
  onAsk: n,
  onStatus: r
}) {
  const o = e.filter((s) => s.status === "planned" || s.status === "partial").length, i = e.filter((s) => s.status !== "unclear").length;
  return /* @__PURE__ */ W("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 16, gap: 12, color: "var(--text, inherit)" }, children: [
    /* @__PURE__ */ W("p", { style: { margin: 0, fontSize: 14 }, "data-testid": "plan-summary", children: [
      /* @__PURE__ */ v("strong", { children: o === 0 ? "Everything planned is built." : `${o} of ${i} planned units ${o === 1 ? "is" : "are"} not finished.` }),
      " ",
      /* @__PURE__ */ v("span", { style: { ...he, fontSize: 13 }, children: "Read from the specs, checked against the code." })
    ] }),
    e.length === 0 && /* @__PURE__ */ v("p", { style: he, children: "No specs found in docs/specs, docs/plans or specs." }),
    /* @__PURE__ */ v("div", { style: { flex: 1, minHeight: 0, display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }, children: Wx.map((s) => {
      const a = e.filter((l) => l.status === s.status);
      return /* @__PURE__ */ W("section", { style: { display: "flex", flexDirection: "column", minHeight: 0, gap: 8 }, children: [
        /* @__PURE__ */ W("div", { children: [
          /* @__PURE__ */ W("span", { style: { display: "flex", gap: 6, alignItems: "center", fontWeight: 600, fontSize: 13 }, children: [
            s.title,
            " ",
            /* @__PURE__ */ v(nt, { variant: "muted", children: a.length })
          ] }),
          /* @__PURE__ */ v("span", { style: { ...he, fontSize: 11 }, children: s.note })
        ] }),
        /* @__PURE__ */ v("div", { style: { overflowY: "auto", minHeight: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }, children: a.map((l) => /* @__PURE__ */ v(Gx, { plan: l, onShow: t, onAsk: n, onStatus: r }, l.id)) })
      ] }, s.status);
    }) })
  ] });
}
function qx({ count: e, on: t, onToggle: n }) {
  return /* @__PURE__ */ W(ze, { primary: t, onClick: n, title: "Show unfinished plans on the map", children: [
    "Plans on map ",
    e
  ] });
}
const jt = 200, Gt = 58, Ui = {
  module: "module",
  area: "area",
  route: "route",
  job: "job",
  service: "service",
  table: "table",
  group: "",
  plan: "plan"
}, Ux = {
  planned: "var(--danger, #dc2626)",
  partial: "var(--warn-text, #b45309)",
  unclear: "var(--muted, #71717a)",
  built: "var(--ok, #15803d)"
}, Hr = {
  imports: { color: "var(--border-strong, #a1a1aa)", label: "imports" },
  renders: { color: "var(--muted, #71717a)", label: "renders" },
  uses_table: { color: "var(--accent, #2563eb)", label: "uses table" },
  uses_service: { color: "var(--warn-text, #b45309)", label: "uses service" },
  calls: { color: "var(--text, #18181b)", label: "calls" },
  touches: { color: "var(--danger, #dc2626)", dashed: !0, label: "plan touches" }
}, Kx = de(function({ data: t }) {
  const { card: n, focused: r } = t, o = n.kind === "plan", i = n.kind === "service", s = o ? Ux[n.status ?? "unclear"] : void 0, a = r ? "var(--accent, #2563eb)" : s ?? "var(--border-strong, #a1a1aa)";
  return /* @__PURE__ */ W(
    "div",
    {
      style: {
        width: jt,
        height: Gt,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 12px",
        borderRadius: i ? 29 : 8,
        background: n.kind === "group" ? "var(--bg-hover, #f4f4f5)" : "var(--card, #fff)",
        color: "var(--text, #18181b)",
        border: `${r ? 2 : 1}px ${o || i ? "dashed" : "solid"} ${a}`,
        boxShadow: r ? "0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))" : void 0
      },
      children: [
        /* @__PURE__ */ v(Ke, { type: "target", position: G.Left, isConnectable: !1 }),
        /* @__PURE__ */ v(Ke, { type: "source", position: G.Right, isConnectable: !1 }),
        /* @__PURE__ */ W("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }, children: [
          /* @__PURE__ */ v("span", { style: { fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: n.title }),
          o && /* @__PURE__ */ v("span", { style: { fontSize: 11, color: s, flexShrink: 0 }, children: n.status })
        ] }),
        /* @__PURE__ */ v("span", { style: { ...he, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [Ui[n.kind] && n.kind !== "area" && n.kind !== "plan" ? Ui[n.kind] : "", n.subtitle].filter(Boolean).join(" · ") })
      ]
    }
  );
}), Zx = { card: Kx };
function Qx(e) {
  const t = new En.graphlib.Graph({ multigraph: !0 });
  t.setGraph({ rankdir: "LR", nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 }), t.setDefaultEdgeLabel(() => ({}));
  for (const r of e.cards) t.setNode(r.id, { width: jt, height: Gt });
  for (const r of e.lines)
    r.source !== r.target && t.setEdge(r.source, r.target, {}, r.id);
  En.layout(t);
  const n = /* @__PURE__ */ new Map();
  for (const r of e.cards) {
    const o = t.node(r.id);
    n.set(r.id, { x: o.x - jt / 2, y: o.y - Gt / 2 });
  }
  return n;
}
function Jx(e) {
  return Math.min(4, 1 + Math.log2(e) / 2);
}
function ev(e) {
  const t = Hr[e.kind] ?? Hr.imports;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    selectable: !1,
    markerEnd: { type: vt.ArrowClosed, width: 14, height: 14, color: t.color },
    style: {
      stroke: t.color,
      strokeWidth: Jx(e.count),
      strokeDasharray: t.dashed ? "6 4" : void 0,
      opacity: e.kind === "imports" ? 0.55 : 0.85
    }
  };
}
function tv({ kinds: e, top: t }) {
  const n = Object.entries(Hr).filter(([r]) => e.has(r));
  return /* @__PURE__ */ W(
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
        n.map(([r, o]) => /* @__PURE__ */ W("span", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ v("span", { style: { width: 14, height: 0, borderTop: `2px ${o.dashed ? "dashed" : "solid"} ${o.color}` } }),
          o.label
        ] }, r)),
        t && /* @__PURE__ */ v("span", { style: he, children: "Thin links hidden" })
      ]
    }
  );
}
function nv({ system: e, focus: t, onFocus: n }) {
  const r = Ox(e, t);
  return /* @__PURE__ */ v(
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
        return /* @__PURE__ */ W("span", { style: { display: "flex", gap: 6 }, children: [
          i > 0 && /* @__PURE__ */ v("span", { style: he, children: "/" }),
          /* @__PURE__ */ v(
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
function rv({
  system: e,
  focus: t,
  tables: n,
  showPlans: r,
  inspecting: o,
  onFocus: i,
  onOpenTables: s
}) {
  const { mode: a } = Zi(), l = ce(() => zx(e, t, n, r), [e, t, n, r]), c = ce(() => Qx(l), [l]), u = ce(
    () => l.cards.map((w) => ({
      id: w.id,
      type: "card",
      position: c.get(w.id) ?? { x: 0, y: 0 },
      width: jt,
      height: Gt,
      data: { card: w, focused: w.id === t }
    })),
    [l, c, t]
  ), f = ce(() => l.lines.map(ev), [l]), d = ce(
    () => l.cards.map((w) => ({ ...c.get(w.id) ?? { x: 0, y: 0 }, width: jt, height: Gt })),
    [l, c]
  );
  kl(d, o ? El : 0);
  const h = ce(() => new Set(l.lines.map((w) => w.kind)), [l]), p = (w) => {
    if (w === fo) s();
    else {
      if (w !== Pe && w !== ft && w === t) return;
      i(w);
    }
  };
  return /* @__PURE__ */ W(
    ml,
    {
      nodes: u,
      edges: f,
      nodeTypes: Zx,
      colorMode: a,
      minZoom: uo,
      maxZoom: 1.5,
      nodesConnectable: !1,
      onNodeClick: (w, b) => p(b.id),
      children: [
        /* @__PURE__ */ v(wl, { gap: 24, size: 1 }),
        /* @__PURE__ */ v(xl, { showInteractive: !1 }),
        /* @__PURE__ */ v(_l, { pannable: !0, zoomable: !0, style: { width: 120, height: 80 } }),
        /* @__PURE__ */ v(dt, { position: "top-left", children: /* @__PURE__ */ v(nv, { system: e, focus: t, onFocus: i }) }),
        /* @__PURE__ */ v(dt, { position: "bottom-center", children: /* @__PURE__ */ v(tv, { kinds: h, top: t === null }) })
      ]
    }
  );
}
function ov(e) {
  return /* @__PURE__ */ v("div", { className: "system-map-flow", style: { position: "absolute", inset: 0 }, "data-testid": "map", children: /* @__PURE__ */ v(co, { children: /* @__PURE__ */ v(rv, { ...e }) }) });
}
const iv = "system-map-design", Ki = 12, sv = [
  ["names", "Names"],
  ["keys", "Keys"],
  ["columns", "Columns"]
], br = { display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0, overflow: "hidden", padding: 12 }, av = [
  ["map", "Map"],
  ["data", "Data model"],
  ["plan", "Plan"],
  ["findings", "Findings"]
];
function lv(e) {
  const t = Vr(), [n, r] = ae(null), [o, i] = ae(null);
  ie(() => {
    if (!e) return;
    let a = !0;
    return (async () => {
      const c = await t.post("/api/chat/slots", { name: iv });
      await t.post(`/api/chat/slots/${encodeURIComponent(c.key)}/project`, { project: e }), a && r(c.key);
    })().catch((c) => {
      a && i(String(c));
    }), () => {
      a = !1;
    };
  }, [t, e]);
  const s = Ce(
    (a) => {
      n && t.post("/api/chat?ws=1", { message: a, slot: n, agent: "" });
    },
    [t, n]
  );
  return { slot: n, error: o, send: s };
}
function cv() {
  const e = re(null), [t, n] = ae(void 0);
  return Ji(() => {
    const r = () => {
      var i;
      const o = ((i = e.current) == null ? void 0 : i.getBoundingClientRect().top) ?? 0;
      n(Math.max(420, window.innerHeight - o - 16));
    };
    return r(), window.addEventListener("resize", r), () => window.removeEventListener("resize", r);
  }, []), { ref: e, height: t };
}
function uv({ message: e, onBuilt: t }) {
  const n = Vr(), [r, o] = ae(""), [i, s] = ae(!1), [a, l] = ae(null), c = async () => {
    s(!0), l(null);
    try {
      const u = await n.post(`${es}/build`, { repo_path: r.trim() });
      t(u.repo_key);
    } catch (u) {
      l(String(u));
    } finally {
      s(!1);
    }
  };
  return /* @__PURE__ */ W(hn, { children: [
    /* @__PURE__ */ v(xr, { children: "Build a model" }),
    e && /* @__PURE__ */ v("p", { style: { ...he, fontSize: 13 }, children: e }),
    /* @__PURE__ */ W("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ v(
        Pc,
        {
          "aria-label": "Repo path",
          placeholder: "/path/to/repo",
          value: r,
          onChange: (u) => o(u.target.value),
          style: { flex: 1 }
        }
      ),
      /* @__PURE__ */ v(ze, { primary: !0, disabled: i || !r.trim(), onClick: () => void c(), children: i ? "Building" : "Build" })
    ] }),
    a && /* @__PURE__ */ v("p", { style: { fontSize: 13 }, children: a })
  ] });
}
function dv({ overview: e }) {
  const { stale: t, map_stale: n, commits_behind: r, ref: o, changed_inputs: i = [] } = e.freshness;
  return t ? /* @__PURE__ */ W(nt, { variant: "warn", children: [
    i.length,
    " schema files changed on ",
    o
  ] }) : n ? /* @__PURE__ */ W(nt, { variant: "warn", children: [
    "Code changed on ",
    o,
    ". Rebuild to update."
  ] }) : r > 0 ? /* @__PURE__ */ W(nt, { variant: "muted", children: [
    "Current, ",
    r,
    " commits behind ",
    o
  ] }) : /* @__PURE__ */ W(nt, { variant: "ok", children: [
    "Current with ",
    o
  ] });
}
function _v() {
  var te, ne;
  const e = Vr(), { repos: t, active: n, loaded: r, choose: o, reload: i } = Hc(), { overview: s, error: a, refresh: l } = Vc(n), c = s == null ? void 0 : s.manifest.version, [u, f] = ae(0), d = c ? `${c}:${u}` : void 0, h = tn("/graph", n, d), p = tn("/system", n, d), w = ((te = tn("/plan", n, d)) == null ? void 0 : te.plans) ?? [], b = ((ne = tn("/findings", n, d)) == null ? void 0 : ne.findings) ?? [], [g, _] = ae("map"), [m, x] = ae(null), [k, E] = ae(null), [I, A] = ae(!0), [$, R] = ae("names"), [L, H] = ae(!1), [D, y] = ae(null), { ref: N, height: S } = cv(), M = lv(s ? s.manifest.repo : null), T = g === "map" ? k && !/^(area|group):/.test(k) ? k : null : g === "data" ? m : null, C = Bc(T, n), z = ce(() => {
    const B = /* @__PURE__ */ new Map();
    for (const se of b)
      se.severity !== "info" && B.set(se.node, (B.get(se.node) ?? 0) + 1);
    return B;
  }, [b]), O = w.filter((B) => B.status === "planned" || B.status === "partial").length, V = async () => {
    y("Checking");
    try {
      const B = await e.post(Yc("/build", null), { repo: s == null ? void 0 : s.manifest.repo_key });
      y(B.unchanged ? "No changes" : "Rebuilt"), await l();
    } catch (B) {
      y(String(B));
    }
  }, j = () => {
    C && M.send(`Use the system-map tools. Look at ${C.id} and tell me what to watch out for.`);
  }, Y = (B) => {
    M.send(`Use the system-map tools. Check finding ${B.id} on ${B.node}, read its evidence, and propose a fix.`);
  }, K = (B) => {
    M.send(`Use the system-map tools. Look at ${B.id}, say what is left to build, and propose the next step.`);
  }, ee = async (B, se) => {
    await e.post(`${es}/plan-status`, { repo: s == null ? void 0 : s.manifest.repo_key, id: B, status: se }), f((be) => be + 1);
  }, q = (B) => {
    _("data"), x(B);
  }, P = (B) => {
    _("map"), E(B);
  }, F = (B) => {
    g === "data" && B.startsWith("table:") ? x(B) : P(B);
  }, U = (B) => {
    x(null), E(null), y(null), o(B);
  }, Z = /* @__PURE__ */ W("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
    D && /* @__PURE__ */ v("span", { style: { ...he, fontSize: 13 }, children: D }),
    t.length > 1 && /* @__PURE__ */ v(
      "select",
      {
        "aria-label": "Repo",
        value: (s == null ? void 0 : s.manifest.repo_key) ?? "",
        onChange: (B) => U(B.target.value),
        style: { fontSize: 13, background: "transparent", color: "var(--text, inherit)" },
        children: t.map((B) => /* @__PURE__ */ v("option", { value: B.repo_key, children: B.repo.split("/").pop() }, B.repo_key))
      }
    ),
    /* @__PURE__ */ v(ze, { onClick: () => H((B) => !B), children: "Add repo" }),
    s && /* @__PURE__ */ v(ze, { onClick: () => void V(), children: "Rebuild" })
  ] }), X = r && t.length === 0, Q = L || X || !s && a !== null, J = g === "map" || g === "plan";
  return /* @__PURE__ */ W(xe, { children: [
    /* @__PURE__ */ v(Oc, { title: "System Map", subtitle: s ? s.manifest.repo : "One model of your system", actions: Z }),
    /* @__PURE__ */ W("div", { ref: N, style: { height: S, display: "flex", flexDirection: "column", gap: Ki, padding: "0 16px", minHeight: 0 }, children: [
      Q && /* @__PURE__ */ v(
        uv,
        {
          message: s ? null : X ? "Point System Map at a repo." : a,
          onBuilt: (B) => {
            H(!1), U(B), i();
          }
        }
      ),
      s && /* @__PURE__ */ W(xe, { children: [
        /* @__PURE__ */ W("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 13 }, children: [
          /* @__PURE__ */ v(dv, { overview: s }),
          /* @__PURE__ */ v(nt, { variant: "muted", children: s.manifest.commit.slice(0, 7) }),
          /* @__PURE__ */ v("span", { style: { flex: 1 } }),
          g === "data" && sv.map(([B, se]) => /* @__PURE__ */ v(ze, { primary: $ === B, onClick: () => R(B), children: se }, B)),
          g === "map" && /* @__PURE__ */ v(qx, { count: O, on: I, onToggle: () => A((B) => !B) }),
          /* @__PURE__ */ v("span", { style: { width: 8 } }),
          av.map(([B, se]) => /* @__PURE__ */ v(ze, { primary: g === B, onClick: () => _(B), children: B === "findings" ? `${se} ${b.length}` : B === "plan" ? `${se} ${O}` : se }, B))
        ] }),
        /* @__PURE__ */ W(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              display: "grid",
              gap: Ki,
              gridTemplateColumns: "220px minmax(0, 1fr) minmax(320px, 26%)",
              gridTemplateRows: "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ W(hn, { style: br, children: [
                /* @__PURE__ */ v(xr, { children: J ? "Modules" : "Tables" }),
                J ? /* @__PURE__ */ v(Fc, { nodes: (p == null ? void 0 : p.nodes) ?? [], focus: k, onSelect: P }) : /* @__PURE__ */ v(Wc, { tables: s.tables, selected: m, flagged: z, onSelect: q })
              ] }),
              /* @__PURE__ */ W(hn, { style: { ...br, padding: 0, position: "relative" }, "data-testid": "canvas", children: [
                g === "map" && p && /* @__PURE__ */ v(
                  ov,
                  {
                    system: p,
                    focus: k,
                    tables: s.manifest.counts.tables,
                    showPlans: I,
                    inspecting: T !== null,
                    onFocus: E,
                    onOpenTables: () => _("data")
                  }
                ),
                g === "data" && h && /* @__PURE__ */ v(Ex, { graph: h, selected: m, flagged: z, density: $, onSelect: x }),
                g === "plan" && /* @__PURE__ */ v(Xx, { plans: w, onShow: P, onAsk: K, onStatus: (B, se) => void ee(B, se) }),
                g === "findings" && /* @__PURE__ */ v(Sx, { findings: b, onShow: q, onAsk: Y }),
                C && T && /* @__PURE__ */ v(
                  Fx,
                  {
                    node: C,
                    canAsk: M.slot !== null,
                    onAsk: j,
                    onAskFinding: Y,
                    onOpen: F,
                    onClose: () => g === "data" ? x(null) : E(null)
                  }
                )
              ] }),
              /* @__PURE__ */ W(hn, { style: br, children: [
                /* @__PURE__ */ v(xr, { children: "Design chat" }),
                M.error && /* @__PURE__ */ W("p", { style: { fontSize: 13 }, children: [
                  "Chat is not available: ",
                  M.error
                ] }),
                /* @__PURE__ */ v("div", { style: { position: "relative", flex: 1, minHeight: 0 }, "data-testid": "chat", children: M.slot && /* @__PURE__ */ v("div", { style: { position: "absolute", inset: 0 }, children: /* @__PURE__ */ v(zc, { slotKey: M.slot, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) }) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  _v as default
};
