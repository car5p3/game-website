const { spawn, spawnSync } = require("child_process");
const path = require("path");

async function waitForServer(url, timeoutMs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const next = spawn(
    "C:\\Windows\\System32\\cmd.exe",
    ["/c", "npm.cmd run dev -- --hostname 127.0.0.1 --port 4173"],
    {
      cwd: process.cwd(),
      shell: false,
      stdio: "pipe",
    }
  );

  let serverOutput = "";

  next.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  next.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer("http://127.0.0.1:4173", 30000);

    const { chromium } = require("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });

    const radiantFeature = page.getByTestId("radiant-feature");
    const radiantPanel = radiantFeature.locator(":scope > div").first();
    const radiantDescription = page.getByText(
      "A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
    );

    const collapsedBox = await radiantPanel.boundingBox();
    if (!collapsedBox) throw new Error("Missing collapsed Radiant bounding box.");

    await radiantFeature.screenshot({
      path: path.join(process.cwd(), "playwright-radiant-collapsed.png"),
    });

    const initialOpacity = await radiantDescription.evaluate(
      (node) => getComputedStyle(node).opacity
    );

    await radiantFeature.hover();
    await page.waitForTimeout(400);

    const expandedBox = await radiantPanel.boundingBox();
    if (!expandedBox) throw new Error("Missing expanded Radiant bounding box.");

    await radiantFeature.screenshot({
      path: path.join(process.cwd(), "playwright-radiant-expanded.png"),
    });

    const hoveredOpacity = await radiantDescription.evaluate(
      (node) => getComputedStyle(node).opacity
    );

    console.log(
      JSON.stringify(
        {
          collapsedHeight: collapsedBox.height,
          expandedHeight: expandedBox.height,
          initialDescriptionOpacity: initialOpacity,
          hoveredDescriptionOpacity: hoveredOpacity,
          collapsedScreenshot: "playwright-radiant-collapsed.png",
          expandedScreenshot: "playwright-radiant-expanded.png",
        },
        null,
        2
      )
    );

    await browser.close();
  } finally {
    if (next.pid) {
      spawnSync("taskkill", ["/pid", String(next.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
