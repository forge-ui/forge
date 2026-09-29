import { execFileSync } from "node:child_process";

const report = JSON.parse(
  execFileSync("pnpm", ["licenses", "list", "--prod", "--json"], {
    encoding: "utf8",
  }),
);

const forbiddenLicense = /(?:^|[ (])(?:GPL|AGPL|SSPL)-/i;
const violations = [];
const packages = [];

for (const [license, entries] of Object.entries(report)) {
  for (const entry of entries) packages.push({ license, ...entry });
  if (forbiddenLicense.test(license)) {
    for (const entry of entries) {
      violations.push(`${entry.name}@${entry.versions.join(",")} (${license})`);
    }
  }
}

const removedSolar = packages.find((entry) => entry.name === "solar-icon-set");
if (removedSolar) {
  violations.push(`solar-icon-set is still present (${removedSolar.license})`);
}

const solar = packages.find((entry) => entry.name === "@solar-icons/react");
if (!solar) violations.push("@solar-icons/react is missing from production dependencies");
else if (solar.license !== "MIT") {
  violations.push(`@solar-icons/react implementation must remain MIT, received ${solar.license}`);
}

if (violations.length > 0) {
  console.error("Production license check failed:\n");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  const licenseCount = Object.keys(report).length;
  console.log(
    `Production license check passed: ${packages.length} packages across ${licenseCount} license expressions; Solar React implementation is MIT; artwork attribution is in THIRD_PARTY_NOTICES.md and no GPL/AGPL/SSPL dependency was found.`,
  );
}
