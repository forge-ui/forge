export const consumerScenarios = [
  { name: "next-15", next: "15.0.8" },
  { name: "next-16", next: "16.0.11" },
];

const exactVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export function createConsumerPackage(basePackage, scenario, tarballSpecifier) {
  const packageJson = structuredClone(basePackage);
  packageJson.dependencies = {
    ...packageJson.dependencies,
    "@forge-ui-official/core": tarballSpecifier,
    next: scenario.next,
  };
  return packageJson;
}

export function findUnpinnedExternalDependencies(packageJson) {
  const unpinned = [];
  for (const dependencyField of ["dependencies", "devDependencies", "optionalDependencies"]) {
    for (const [name, version] of Object.entries(packageJson[dependencyField] ?? {})) {
      if (name === "@forge-ui-official/core" && version.startsWith("file:")) continue;
      if (!exactVersionPattern.test(version)) unpinned.push(`${dependencyField}.${name}=${version}`);
    }
  }
  return unpinned.sort();
}

export function createConsumerInstallArgs(registry) {
  return [
    "install",
    "--ignore-scripts",
    "--no-package-lock",
    "--no-audit",
    "--no-fund",
    "--registry",
    registry,
  ];
}
