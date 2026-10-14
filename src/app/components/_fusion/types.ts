export type FusionSettings = {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
};

export type FusionExampleProps = FusionSettings & { id: string };
