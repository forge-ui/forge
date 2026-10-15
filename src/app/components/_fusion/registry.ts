import catalog from "../../prototype/component-fusion/_catalog-data.json";

export const actionIds = ["001", "002", "004", "005", "006", "007", "008", "009", "012", "018", "022", "066", "067", "081", "049", "050", "054", "058", "070", "071", "076", "080", "083", "087", "089", "090"] as const;
export const formNavigationIds = ["014", "015", "016", "019", "021", "023", "025", "026", "028", "029", "030", "032", "033", "036", "056", "062", "063", "075", "093", "010", "011", "027", "037", "041", "042", "045", "047", "048", "074"] as const;
export const agentChartIds = ["077", "078", "084", "086", "091", "F01", "F02", "095", "096", "097", "099", "157", "163", "165"] as const;
export const compositionIds = ["057", "059", "092", "108", "110", "126", "127", "128", "129", "176", "177", "179", "180", "181", "184", "F04", "F05", "F06"] as const;
export const existingIds = ["003", "013", "031", "039", "040", "043", "044", "046", "088", "098", "178", "F03"] as const;
export type FusionCatalogItem = (typeof catalog.items)[number];
export const fusionItems = catalog.items.filter(item => item.mode !== "defer");
export const fusionFamilies = catalog.families;

const categoryOverrides: Record<string, string> = {
  "044": "grid", "058": "progress", "067": "button-link", "070": "modal", "076": "tooltip",
  "080": "progress", "083": "progress", "088": "list", "089": "modal", "090": "card",
  "126": "agent", "127": "agent", "128": "agent", "129": "agent", "179": "agent",
  "180": "card", "181": "card",
};
export function officialCategory(item: FusionCatalogItem) {
  return categoryOverrides[item.id] ?? item.family;
}
export function officialHref(item: FusionCatalogItem) {
  return `/components/${officialCategory(item)}#interaction-${item.id === "F03" ? "178" : item.id}`;
}
