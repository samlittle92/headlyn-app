import type { Briefing } from "@/types/intell";

/**
 * Returns the latest briefings. For now returns hardcoded data for UI testing.
 */
export function getLatestBriefings(): Briefing[] {
  return [
    {
      id: "1",
      timestamp: "2025-03-01T14:32:00Z",
      source: "Reuters",
      category: "GEOPOLITICAL",
      title: "Central bank signals shift in rate outlook amid inflation data",
      summary:
        "Officials indicated a more cautious stance on further tightening as latest figures showed cooling in core measures. Markets priced in a quarter-point cut by mid-year.",
      verificationScore: 94,
      isVoiceReady: true,
    },
    {
      id: "2",
      timestamp: "2025-03-01T12:15:00Z",
      source: "X-Intelligence",
      category: "TECH",
      title: "Major cloud provider reports outage in European region",
      summary:
        "Services were restored within two hours. Root cause is under investigation; initial reports point to a network configuration change.",
      verificationScore: 78,
      isVoiceReady: true,
    },
    {
      id: "3",
      timestamp: "2025-03-01T09:00:00Z",
      source: "Internal",
      category: "SECURITY",
      title: "New advisory on supply chain and software attestation",
      summary:
        "Agency recommends signed SBOMs and verification steps for critical dependencies. Compliance window set for next quarter.",
      verificationScore: 92,
      isVoiceReady: false,
    },
    {
      id: "4",
      timestamp: "2025-03-01T07:45:00Z",
      source: "Reuters",
      category: "MARKETS",
      title: "Equity indices open higher as earnings season continues",
      summary:
        "Strong results from several large caps supported sentiment. Traders are watching upcoming jobs data for direction on rate expectations.",
      verificationScore: 88,
      isVoiceReady: true,
    },
    {
      id: "5",
      timestamp: "2025-02-28T22:00:00Z",
      source: "X-Intelligence",
      category: "GEOPOLITICAL",
      title: "Diplomatic talks resume on trade and tariffs",
      summary:
        "Delegations met for a second round with focus on enforcement and dispute mechanisms. No timeline was given for a final agreement.",
      verificationScore: 96,
      isVoiceReady: true,
    },
  ];
}
