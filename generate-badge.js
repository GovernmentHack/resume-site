const { makeBadge } = require("badge-maker");
const fs = require("node:fs");
const coverageReport = require("./coverage/coverage-summary.json");

// const totalBranchesPercent = coverageReport.total.branches.pct;
const totalLinePercent = coverageReport.total.lines.pct;
// const totalFunctionsPercent = coverageReport.total.functions.pct;

const lines = makeBadge({
  label: "coverage:",
  message: `% ${totalLinePercent}`,
  color:
    totalLinePercent > 90
      ? "brightGreen"
      : totalLinePercent > 80
      ? "green"
      : totalLinePercent > 70
      ? "yellow"
      : "red",
});

try {
  // fs.writeFileSync("branches.svg", content);
  fs.writeFileSync("lines.svg", lines);
  // fs.writeFileSync("functions.svg", content);
} catch (err) {
  console.error(err);
}
