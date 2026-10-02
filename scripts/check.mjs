/** Smoke checks: render every route and verify local assets; no live service calls. */
import { build } from "esbuild";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const root = process.cwd();
const temp = await mkdtemp(path.join(root, ".route-check-"));
const tests = [
  "/",
  "/about",
  "/courses",
  "/courses/digital-dentistry-foundations",
  "/courses/implant-planning",
  "/courses/dental-3d-printing",
  "/workshops",
  "/workshops/digital-workflow-workshop",
  "/instructors",
  "/instructors/sample-instructor",
  "/benefits",
  "/gallery",
  "/graduates",
  "/testimonials",
  "/faq",
  "/chat",
  "/contact",
  "/payments/success",
  "/payments/failed",
  "/payments/cancel",
  "/courses/missing",
  "/instructors/missing",
  "/workshops/missing",
  "/unknown",
];
try {
  const output = path.join(temp, "render.cjs");
  await build({
    stdin: {
      contents: `import React from 'react'; import {renderToString} from 'react-dom/server'; import App from './src/App.jsx'; export const render = () => renderToString(React.createElement(App));`,
      resolveDir: root,
      loader: "jsx",
    },
    outfile: output,
    bundle: true,
    platform: "node",
    format: "cjs",
    define: { "import.meta.env.VITE_API_BASE": '""' },
  });
  const { render } = createRequire(import.meta.url)(output);
  let count = 0;
  for (const language of ["ar", "en"])
    for (const route of tests) {
      globalThis.location = { pathname: route, search: "", hash: "" };
      globalThis.localStorage = {
        getItem: (key) => (key === "dc-language" ? language : "light"),
      };
      const html = render();
      assert(html.includes("<main"), `${route}: main landmark missing`);
      assert(html.includes("<h1"), `${route}: page heading missing`);
      assert(!html.includes("undefined"), `${route}: undefined content`);
      for (const match of html.matchAll(/src="(\/assets\/[^"?]+)"/g))
        await stat(path.join(root, "public", match[1]));
      if (route.startsWith("/payments/"))
        assert(
          !html.includes(
            language === "ar" ? "تم الدفع بنجاح" : "Payment successful",
          ),
          "Unverified payment shown as successful",
        );
      count++;
    }
  for (const status of ["success", "failed", "cancel"]) {
    globalThis.location = {
      pathname: "/payments/" + status,
      search: "?demo=1",
      hash: "",
    };
    const html = render();
    assert(
      html.includes("no payment occurred"),
      "Payment preview disclaimer missing",
    );
  }
  const css = await readFile("src/styles.css", "utf8");
  assert(/@media\s*\(max-width:\s*640px\)/.test(css), "Mobile styles missing");
  assert(
    css.includes("prefers-reduced-motion"),
    "Reduced motion support missing",
  );
  console.log(
    `PASS: ${count} bilingual route renders, 3 payment previews, local image references and responsive stylesheet checks.`,
  );
  console.log("These checks do not replace interactive browser or visual QA.");
} finally {
  await rm(temp, { recursive: true, force: true });
}
