export type Status = "FRAUD" | "DEAD" | "ZOMBIE" | "SCANDAL";

export interface YCFailure {
  id: string;
  company: string;
  founders: string[];
  batch: string; // e.g. "S19", "W14"
  sector: string;
  raised: string;
  valuation?: string;
  status: Status;
  yearFounded: number;
  yearDied?: number;
  oneLiner: string;
  description: string;
  redactedText: string;
  descriptionAfter: string;
  bodyCount?: string; // employees laid off, users affected, etc.
  imageUrl?: string;
  sources: { label: string; url: string; type: "article" | "twitter" | "video" | "sec" }[];
}

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  FRAUD: { label: "FRAUD", color: "#dc2626", bg: "#fef2f2" },
  DEAD: { label: "DEAD", color: "#000000", bg: "#f5f5f5" },
  ZOMBIE: { label: "ZOMBIE", color: "#854d0e", bg: "#fefce8" },
  SCANDAL: { label: "SCANDAL", color: "#9333ea", bg: "#faf5ff" },
};

export const FAILURES: YCFailure[] = [
  {
    id: "ftx",
    company: "FTX",
    founders: ["Sam Bankman-Fried"],
    batch: "S19",
    sector: "CRYPTO",
    raised: "$1.8B",
    valuation: "$32B",
    status: "FRAUD",
    yearFounded: 2019,
    yearDied: 2022,
    oneLiner: "Stole $8B in customer funds to gamble on shitcoins",
    description: "YC's poster child for effective altruism turned out to be effectively stealing. Built a crypto exchange, funneled",
    redactedText: "$8 billion in customer deposits to his hedge fund Alameda Research",
    descriptionAfter: "while sleeping on a beanbag in a Bahamas penthouse. Sentenced to 25 years. YC quietly scrubbed him from their website.",
    bodyCount: "1M+ customers affected",
    sources: [
      { label: "DOJ: SBF Sentenced to 25 Years", url: "https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-his-orchestration-multiple-fraudulent-schemes", type: "article" },
      { label: "YC's page on FTX (deleted)", url: "https://web.archive.org/web/2022/https://www.ycombinator.com/companies/ftx", type: "article" },
    ],
  },
  {
    id: "irl",
    company: "IRL",
    founders: ["Abraham Shafi"],
    batch: "S17",
    sector: "SOCIAL",
    raised: "$200M",
    valuation: "$1.2B",
    status: "FRAUD",
    yearFounded: 2017,
    yearDied: 2023,
    oneLiner: "95% of users were bots. Raised $170M on the lie.",
    description: "Pitched as Gen Z's social app for real-life events. Claimed 20M users. SEC investigation revealed",
    redactedText: "95% of those users were automated bots the company created itself",
    descriptionAfter: ". Board shut it down in 2023. Shafi charged with securities fraud. The 'IRL' app was anything but.",
    bodyCount: "~95% fake users",
    sources: [
      { label: "SEC: IRL Fraud Charges", url: "https://www.sec.gov/newsroom/press-releases/2023-168", type: "sec" },
      { label: "NYT: Social App IRL Shuts Down", url: "https://www.nytimes.com/2023/06/27/technology/irl-app-shut-down.html", type: "article" },
    ],
  },
  {
    id: "cruise",
    company: "Cruise",
    founders: ["Kyle Vogt", "Dan Kan"],
    batch: "W14",
    sector: "AUTONOMOUS VEHICLES",
    raised: "$10B+ (via GM)",
    valuation: "$30B",
    status: "SCANDAL",
    yearFounded: 2013,
    oneLiner: "Robotaxis that dragged pedestrians and covered it up",
    description: "GM bought Cruise for $1B, then poured in $10B more. Their self-driving cars",
    redactedText: "dragged a pedestrian 20 feet and executives initially withheld the footage from regulators",
    descriptionAfter: ". California pulled their license. GM wrote off the entire investment. The future of autonomous driving became a $10B bonfire.",
    bodyCount: "2,500+ laid off",
    sources: [
      { label: "NYT: Cruise Withheld Footage of Pedestrian Dragging", url: "https://www.nytimes.com/2023/11/03/technology/cruise-general-motors-self-driving.html", type: "article" },
      { label: "Reuters: GM Shuts Down Cruise", url: "https://www.reuters.com/business/autos-transportation/gm-close-cruise-robotaxi-business-2024-12-10/", type: "article" },
    ],
  },
  {
    id: "scalefactor",
    company: "ScaleFactor",
    founders: ["Kurt Rathmann"],
    batch: "W14",
    sector: "FINTECH",
    raised: "$100M+",
    status: "DEAD",
    yearFounded: 2014,
    yearDied: 2020,
    oneLiner: "AI bookkeeping that was actually humans in a back room",
    description: "Raised $100M claiming AI-powered bookkeeping. In reality,",
    redactedText: "the 'AI' was a room full of offshore accountants manually doing the work",
    descriptionAfter: ". Customers reported tax filing errors and missing transactions. Quietly shut down in 2020 during COVID, blaming the pandemic.",
    bodyCount: "Hundreds of SMBs affected",
    sources: [
      { label: "Forbes: ScaleFactor Shuts Down", url: "https://www.forbes.com/sites/jeffkauflin/2020/07/27/scalefactor-is-shutting-down-after-raising-100m/", type: "article" },
    ],
  },
  {
    id: "atrium",
    company: "Atrium",
    founders: ["Justin Kan"],
    batch: "S11",
    sector: "LEGALTECH",
    raised: "$75M",
    status: "DEAD",
    yearFounded: 2017,
    yearDied: 2020,
    oneLiner: "YC's golden boy burned $75M trying to disrupt lawyers",
    description: "Justin Kan, co-founder of Twitch and YC royalty, raised $75M to build an AI-powered law firm. Turns out",
    redactedText: "law is hard and AI couldn't replace lawyers",
    descriptionAfter: ". Pivoted three times, laid off all attorneys, then shut down entirely. The legal industry remained undisrupted.",
    bodyCount: "100+ employees laid off",
    sources: [
      { label: "TechCrunch: Atrium Shuts Down", url: "https://techcrunch.com/2020/03/03/legal-tech-startup-atrium-shuts-down/", type: "article" },
    ],
  },
  {
    id: "katerra",
    company: "Katerra",
    founders: ["Michael Marks", "Fritz Wolff"],
    batch: "S18",
    sector: "CONSTRUCTION",
    raised: "$2B",
    valuation: "$4B",
    status: "DEAD",
    yearFounded: 2015,
    yearDied: 2021,
    oneLiner: "Burned $2B trying to move fast and break buildings",
    description: "Raised $2B to 'disrupt construction' with a tech approach. Instead,",
    redactedText: "they hemorrhaged cash on factories they couldn't fill and projects they couldn't finish",
    descriptionAfter: ". Filed for bankruptcy in 2021 with $1.6B in debt. SoftBank lost over $1B. Turns out buildings are harder than apps.",
    bodyCount: "8,000+ employees",
    sources: [
      { label: "WSJ: Katerra Files for Bankruptcy", url: "https://www.wsj.com/articles/katerra-files-for-bankruptcy-11622583594", type: "article" },
    ],
  },
  {
    id: "homejoy",
    company: "Homejoy",
    founders: ["Adora Cheung"],
    batch: "W10",
    sector: "HOME SERVICES",
    raised: "$40M",
    status: "DEAD",
    yearFounded: 2012,
    yearDied: 2015,
    oneLiner: "Uber for house cleaning. Workers fought back.",
    description: "YC darling that raised $40M to be the 'Uber for home cleaning.' Growth looked great because",
    redactedText: "they were subsidizing every cleaning at a loss to juice the metrics",
    descriptionAfter: ". Hit with worker misclassification lawsuits. Shut down in 2015. Adora went on to become a YC partner. Failing up, YC style.",
    bodyCount: "Thousands of cleaners reclassified",
    sources: [
      { label: "Forbes: Why Homejoy Failed", url: "https://www.forbes.com/sites/ellenhuet/2015/07/23/what-really-killed-homejoy/", type: "article" },
    ],
  },
  {
    id: "flexport",
    company: "Flexport",
    founders: ["Ryan Petersen"],
    batch: "W14",
    sector: "LOGISTICS",
    raised: "$2.3B",
    valuation: "$8B",
    status: "ZOMBIE",
    yearFounded: 2013,
    oneLiner: "CEO fired, rehired, then fired everyone else",
    description: "Raised $2.3B to digitize freight forwarding. Then the governance circus began:",
    redactedText: "the board replaced Ryan Petersen with a former Amazon exec, who lasted 6 months before Petersen staged a comeback coup",
    descriptionAfter: ". Post-coup, Petersen laid off 20% of the company and pivoted strategy. Valuation cratered from $8B. The boxes keep moving, but nobody knows where this ship is headed.",
    bodyCount: "600+ laid off",
    sources: [
      { label: "Forbes: Flexport's Chaotic Leadership", url: "https://www.forbes.com/sites/kenrickcai/2023/09/14/flexport-ceo-ryan-petersen-returns/", type: "article" },
    ],
  },
  {
    id: "wework",
    company: "WeWork",
    founders: ["Adam Neumann"],
    batch: "—",
    sector: "REAL ESTATE",
    raised: "$11.6B",
    valuation: "$47B",
    status: "DEAD",
    yearFounded: 2010,
    yearDied: 2023,
    oneLiner: "Community-adjusted EBITDA. Filed for bankruptcy.",
    description: "Not technically YC, but Adam Neumann got $350M from the YC Continuity Fund. The company that invented",
    redactedText: "'community-adjusted EBITDA' and spent $13 on every $1 of revenue",
    descriptionAfter: ". IPO collapsed, Neumann ousted, filed for bankruptcy in 2023. Then Neumann raised $350M for a new startup. Silicon Valley's memory is 18 months.",
    bodyCount: "8,000+ laid off",
    sources: [
      { label: "Bloomberg: WeWork Files for Bankruptcy", url: "https://www.bloomberg.com/news/articles/2023-11-06/wework-files-for-bankruptcy-after-failed-office-sharing-bet", type: "article" },
    ],
  },
  {
    id: "instacart",
    company: "Instacart",
    founders: ["Apoorva Mehta"],
    batch: "S12",
    sector: "DELIVERY",
    raised: "$2.9B",
    valuation: "$39B → $10B",
    status: "ZOMBIE",
    yearFounded: 2012,
    oneLiner: "Lost 75% of its peak valuation. Gig workers still waiting.",
    description: "The poster child of pandemic-era hype. Peaked at $39B valuation during COVID lockdowns, then",
    redactedText: "IPO'd at a $10B valuation — a 75% haircut from peak",
    descriptionAfter: ". Still relies on gig workers with no benefits. Mehta cashed out $1.1B. The groceries got delivered; the returns did not.",
    bodyCount: "600,000+ gig workers",
    sources: [
      { label: "CNBC: Instacart IPO Valuation Drop", url: "https://www.cnbc.com/2023/09/19/instacart-ipo-stock.html", type: "article" },
    ],
  },
  {
    id: "reddit",
    company: "Reddit",
    founders: ["Steve Huffman", "Alexis Ohanian"],
    batch: "S05",
    sector: "SOCIAL MEDIA",
    raised: "$1.3B",
    status: "ZOMBIE",
    yearFounded: 2005,
    oneLiner: "Took 20 years to IPO. Content moderation is a suggestion.",
    description: "YC's second-ever startup. Took 19 years to go public. Along the way,",
    redactedText: "hosted jailbait subreddits for years, enabled election interference, and CEO Steve Huffman secretly edited user comments in the database",
    descriptionAfter: ". IPO'd in 2024 at $6.4B. The moderators who kept the site running? They work for free.",
    bodyCount: "100K+ unpaid moderators",
    sources: [
      { label: "The Verge: Reddit CEO Edited User Comments", url: "https://www.theverge.com/2016/11/23/13739026/reddit-ceo-steve-huffman-edit-comments", type: "article" },
    ],
  },
  {
    id: "delve",
    company: "Delve",
    founders: ["Selin Kocalar", "Karun Kaushik"],
    batch: "W24",
    sector: "COMPLIANCE / AI",
    raised: "$32M",
    valuation: "$300M",
    status: "SCANDAL",
    yearFounded: 2024,
    oneLiner: "Fake compliance as a service. 493+ fabricated audit reports.",
    description: "Claimed to automate SOC 2 and ISO compliance auditing with AI. Whistleblower revealed",
    redactedText: "the platform auto-generated identical passing audit reports with keyboard-mashed test data before clients even uploaded anything",
    descriptionAfter: ". CEO was caught on tape asking an auditor 'does your firm actually look at our platform?' Insight Partners scrubbed their $32M investment blog post. Also accused of taking an open source tool and passing it off as proprietary.",
    bodyCount: "493+ fabricated reports",
    sources: [
      { label: "TechCrunch: Delve Whistleblower Strikes Again", url: "https://techcrunch.com/2026/03/30/delve-whistleblower-strikes-again-with-alleged-receipts-about-fake-compliance/", type: "article" },
      { label: "Inc: The Delve Scandal", url: "https://www.inc.com/ben-sherry/the-delve-scandal-a-y-combinator-darling-just-got-hit-with-a-bombshell-fraud-accusation/", type: "article" },
      { label: "TechCrunch: Insight Partners Scrubs Investment Post", url: "https://techcrunch.com/2026/03/23/insight-partners-scrubs-investment-post-amid-fake-allegations/", type: "article" },
    ],
  },
  {
    id: "pearai",
    company: "PearAI",
    founders: ["Nang Ang", "Duke Pan"],
    batch: "W24",
    sector: "AI / DEVTOOLS",
    raised: "$1.25M",
    status: "SCANDAL",
    yearFounded: 2024,
    oneLiner: "Forked an open-source code editor, slapped their name on it, called it a startup.",
    description: "On Day 1 of YC Demo Day, the internet noticed that PearAI had",
    redactedText: "forked Continue.dev's open source code editor, mass-replaced all 'Continue' references with 'PearAI', and slapped on a fake license written by ChatGPT",
    descriptionAfter: ". The 'Pear Enterprise License' became a meme. YC had to publish a blog post 'correcting the record.' Founders apologized and pivoted. The license was generated by AI. The irony was not lost.",
    bodyCount: "YC's reputation took the hit",
    sources: [
      { label: "TechCrunch: YC Criticized for Backing Cloned Startup", url: "https://techcrunch.com/2024/09/30/y-combinator-is-being-criticized-after-it-backed-an-ai-startup-that-admits-it-basically-cloned-another-ai-startup/", type: "article" },
      { label: "YC: Correcting the Record", url: "https://www.ycombinator.com/blog/correcting-the-record", type: "article" },
      { label: "It's FOSS: AI Startup Copied Open-Source Project", url: "https://news.itsfoss.com/pearai-controversy/", type: "article" },
    ],
  },
  {
    id: "quibi",
    company: "Quibi",
    founders: ["Jeffrey Katzenberg", "Meg Whitman"],
    batch: "—",
    sector: "STREAMING",
    raised: "$1.75B",
    status: "DEAD",
    yearFounded: 2018,
    yearDied: 2020,
    oneLiner: "Burned $1.75B on shows nobody watched on phones",
    description: "Not YC-backed but a spiritual sibling. Raised $1.75B for 'quick bites' of mobile video. Launched during COVID when everyone was home with TVs and",
    redactedText: "nobody wanted to watch premium content on a phone they couldn't even screenshot",
    descriptionAfter: ". Shut down after 6 months. $1.75B for a 6-month experiment. At least they had Turnstile.",
    bodyCount: "$1.75B incinerated",
    sources: [
      { label: "WSJ: Quibi Shuts Down After Six Months", url: "https://www.wsj.com/articles/quibi-weighs-shutting-down-as-problems-mount-11603301946", type: "article" },
    ],
  },
];

// Stats computed from data
export function computeStats() {
  const totalRaised = FAILURES.reduce((sum, f) => {
    const num = parseFloat(f.raised.replace(/[^0-9.]/g, ""));
    const multiplier = f.raised.includes("B") ? 1_000_000_000 : 1_000_000;
    return sum + num * multiplier;
  }, 0);

  return {
    totalCompanies: FAILURES.length,
    totalFraud: FAILURES.filter((f) => f.status === "FRAUD").length,
    totalDead: FAILURES.filter((f) => f.status === "DEAD").length,
    totalZombie: FAILURES.filter((f) => f.status === "ZOMBIE").length,
    totalScandal: FAILURES.filter((f) => f.status === "SCANDAL").length,
    totalRaised: `$${(totalRaised / 1_000_000_000).toFixed(1)}B`,
  };
}
