import { jsxs as l, Fragment as p, jsx as t } from "react/jsx-runtime";
import { useChatLauncher as y, ChatEmbed as b, useAppApi as v } from "@kirocrew/app-sdk";
import { PageHeader as S, Card as n, CardTitle as i, StatCard as m } from "@kirocrew/app-sdk/ui";
import { useState as c, useEffect as C } from "react";
import { u as x, a as k, T, N as A } from "./chunks/model-EeN9xPbI.mjs";
const w = "system-map-design";
function E() {
  const s = v(), [o, a] = c(null), [r, d] = c(null);
  return C(() => {
    s.post("/api/chat/slots", {
      name: w
    }).then(
      (e) => a(e.key ?? e.slot_key ?? e.slot ?? e.sid ?? e.id ?? null)
    ).catch((e) => d(String(e)));
  }, [s]), { slot: o, error: r };
}
function _() {
  const { overview: s, error: o, refresh: a } = x(), [r, d] = c(null), e = k(r), { slot: h, error: u } = E(), { openChat: f } = y(), g = () => {
    e && f({
      autoSend: !1,
      message: `Using the system-map tools, look at node ${e.id} and tell me what to watch out for.`
    });
  };
  return /* @__PURE__ */ l(p, { children: [
    /* @__PURE__ */ t(S, { title: "System Map", subtitle: s ? s.manifest.repo : "One model of your system" }),
    /* @__PURE__ */ l("div", { style: { padding: "0 24px 32px", overflowY: "auto", flex: 1, minHeight: 0 }, children: [
      o && /* @__PURE__ */ l(n, { children: [
        /* @__PURE__ */ t(i, { children: "No model yet" }),
        /* @__PURE__ */ t("p", { style: { fontSize: 13 }, children: o }),
        /* @__PURE__ */ t("button", { onClick: () => void a(), children: "Retry" })
      ] }),
      s && /* @__PURE__ */ l(p, { children: [
        /* @__PURE__ */ l("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 20 }, children: [
          /* @__PURE__ */ t(m, { label: "Tables", value: String(s.tables.length), accent: !0 }),
          /* @__PURE__ */ t(m, { label: "Commit", value: s.manifest.commit.slice(0, 7) }),
          /* @__PURE__ */ t(
            m,
            {
              label: "Freshness",
              value: s.freshness.stale ? `${s.freshness.commits_behind} behind` : "Current"
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { style: { display: "grid", gridTemplateColumns: "260px minmax(0, 1fr) minmax(320px, 1fr)", gap: 14 }, children: [
          /* @__PURE__ */ l(n, { children: [
            /* @__PURE__ */ t(i, { children: "Tables" }),
            /* @__PURE__ */ t(T, { tables: s.tables, selected: r, onSelect: d })
          ] }),
          /* @__PURE__ */ l(n, { children: [
            /* @__PURE__ */ t(i, { children: e ? e.name : "Pick a table" }),
            e && /* @__PURE__ */ t(A, { node: e }),
            e && /* @__PURE__ */ t("button", { onClick: g, style: { marginTop: 12 }, children: "Ask about this table" })
          ] }),
          /* @__PURE__ */ l(n, { children: [
            /* @__PURE__ */ t(i, { children: "Design chat" }),
            u && /* @__PURE__ */ l("p", { style: { fontSize: 13 }, children: [
              "Chat is not available: ",
              u
            ] }),
            h && /* @__PURE__ */ t("div", { style: { height: 480 }, children: /* @__PURE__ */ t(b, { slotKey: h, frameless: !0, startAtBottom: !0, placeholder: "Ask about the system" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  _ as default
};
