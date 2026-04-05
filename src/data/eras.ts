export const PRESIDENTS = [
  { name: "Paul Graham", start: 2005, end: 2014, color: "#22c55e", label: "Paul Graham" },
  { name: "Sam Altman", start: 2014, end: 2019, color: "#eab308", label: "Sam Altman" },
  { name: "Geoff Ralston", start: 2019, end: 2023, color: "#f97316", label: "Geoff Ralston" },
  { name: "Garry Tan", start: 2023, end: 2027, color: "#dc2626", label: "Garry Tan" },
];

export type Era = "pg" | "altman" | "ralston" | "tan";

export function getEra(year: number): Era {
  if (year < 2014) return "pg";
  if (year < 2019) return "altman";
  if (year < 2023) return "ralston";
  return "tan";
}

export function getPresident(year: number) {
  return PRESIDENTS.find((p) => year >= p.start && year < p.end);
}
