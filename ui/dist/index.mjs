import { jsxs as s, Fragment as y, jsx as e } from "react/jsx-runtime";
import { useChatLauncher as v, ChatEmbed as S, useAppApi as b } from "@kirocrew/app-sdk";
import { PageHeader as x, StatCard as g, Card as p, CardTitle as h } from "@kirocrew/app-sdk/ui";
import { useState as d, useEffect as C } from "react";
import { u as k, a as B, T, N as w, B as A } from "./chunks/model-D_z7m97b.mjs";
const E = "system-map-design";
function j(t) {
  const n = b(), [c, o] = d(null), [u, l] = d(null);
  return C(() => {
    if (!t) return;
    let a = !0;
    return (async () => {
      const r = await n.post("/api/chat/slots", { name: E });
      await n.post(`/api/chat/slots/${encodeURIComponent(r.key)}/project`, { project: t }), a && o(r.key);
    })().catch((r) => a && l(String(r))), () => {
      a = !1;
    };
  }, [n, t]), { slot: c, error: u };
}
function z({ message: t, onBuilt: n }) {
  const c = b(), [o, u] = d(""), [l, a] = d(!1), [i, r] = d(null), m = async () => {
    a(!0), r(null);
    try {
      await c.post(`${A}/build`, { repo_path: o.trim() }), n();
    } catch (f) {
      r(String(f));
    } finally {
      a(!1);
    }
  };
  return /* @__PURE__ */ s(p, { children: [
    /* @__PURE__ */ e(h, { children: "Build a model" }),
    /* @__PURE__ */ e("p", { style: { fontSize: 13, opacity: 0.7 }, children: t }),
    /* @__PURE__ */ s("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ e(
        "input",
        {
          "aria-label": "Repo path",
          placeholder: "/path/to/repo",
          value: o,
          onChange: (f) => u(f.target.value),
          style: { flex: 1, padding: "4px 8px", fontSize: 13, background: "transparent", color: "inherit", border: "1px solid currentColor", borderRadius: 4 }
        }
      ),
      /* @__PURE__ */ e("button", { disabled: l || !o.trim(), onClick: () => void m(), children: l ? "Building" : "Build" })
    ] }),
    i && /* @__PURE__ */ e("p", { style: { fontSize: 13 }, children: i })
  ] });
}
function O() {
  const { overview: t, error: n, refresh: c } = k(), [o, u] = d(null), l = B(o), { slot: a, error: i } = j(t ? t.manifest.repo : null), { openChat: r } = v(), m = () => {
    l && r({
      autoSend: !1,
      message: `Using the system-map tools, look at node ${l.id} and tell me what to watch out for.`
    });
  };
  return /* @__PURE__ */ s(y, { children: [
    /* @__PURE__ */ e(x, { title: "System Map", subtitle: t ? t.manifest.repo : "One model of your system" }),
    /* @__PURE__ */ s("div", { style: { padding: "0 24px 32px", overflowY: "auto", flex: 1, minHeight: 0 }, children: [
      n && /* @__PURE__ */ e(z, { message: n, onBuilt: () => void c() }),
      t && /* @__PURE__ */ s(y, { children: [
        /* @__PURE__ */ s("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 20 }, children: [
          /* @__PURE__ */ e(g, { label: "Tables", value: String(t.tables.length), accent: !0 }),
          /* @__PURE__ */ e(g, { label: "Commit", value: t.manifest.commit.slice(0, 7) }),
          /* @__PURE__ */ e(
            g,
            {
              label: "Freshness",
              value: t.freshness.stale ? `${t.freshness.commits_behind} behind` : "Current"
            }
          )
        ] }),
        /* @__PURE__ */ s("div", { style: { display: "grid", gridTemplateColumns: "260px minmax(0, 1fr) minmax(320px, 1fr)", gap: 14 }, children: [
          /* @__PURE__ */ s(p, { children: [
            /* @__PURE__ */ e(h, { children: "Tables" }),
            /* @__PURE__ */ e(T, { tables: t.tables, selected: o, onSelect: u })
          ] }),
          /* @__PURE__ */ s(p, { children: [
            /* @__PURE__ */ e(h, { children: l ? l.name : "Pick a table" }),
            l && /* @__PURE__ */ e(w, { node: l }),
            l && /* @__PURE__ */ e("button", { onClick: m, style: { marginTop: 12 }, children: "Ask about this table" })
          ] }),
          /* @__PURE__ */ s(p, { children: [
            /* @__PURE__ */ e(h, { children: "Design chat" }),
            i && /* @__PURE__ */ s("p", { style: { fontSize: 13 }, children: [
              "Chat is not available: ",
              i
            ] }),
            a && /* @__PURE__ */ e("div", { style: { height: 480 }, children: /* @__PURE__ */ e(S, { slotKey: a, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  O as default
};
