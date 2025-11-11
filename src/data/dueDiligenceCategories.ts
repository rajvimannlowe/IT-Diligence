export interface DueDiligenceQuestion {
  id: string;
  prompt: string;
  artifacts?: string[];
}

export interface DueDiligenceSection {
  id: string;
  title: string;
  questions: DueDiligenceQuestion[];
}

export interface DueDiligenceCategory {
  id: string;
  label: string;
  title: string;
  description?: string;
  sections: DueDiligenceSection[];
}

const q = (
  id: string,
  prompt: string,
  artifacts?: string[]
): DueDiligenceQuestion => ({
  id,
  prompt,
  artifacts,
});

export const DUE_DILIGENCE_CATEGORIES: DueDiligenceCategory[] = [
  {
    id: "mf-a",
    label: "MF & A",
    title: "Management, Finance & Administration",
    description:
      "Understand how IT leadership, operating cadence, and financial stewardship align technology with business goals.",
    sections: [
      {
        id: "mf-a-value-performance",
        title: "IT Value and Performance",
        questions: [
          q(
            "it-performance-measurement",
            "How is IT’s performance measured? (Cost and value)",
            ["IT scorecards"]
          ),
          q(
            "it-performance-trend",
            "How has IT been performing recently? (Cost and value)",
            ["IT scorecards"]
          ),
          q("it-reputation", "How is IT’s reputation?", ["Customer feedback"]),
        ],
      },
      {
        id: "mf-a-strategy",
        title: "IT Strategy",
        questions: [
          q("documented-it-strategy", "Is there a documented IT strategy?", [
            "IT strategy/enterprise architecture",
          ]),
          q("strategy-alignment", "Is it aligned with the business strategy?", [
            "Business strategy",
          ]),
          q("strategic-plan", "Is there a documented IT strategic plan?", [
            "IT strategic plan",
          ]),
          q(
            "digital-approach",
            "What is the approach undertaken to date to digital transformation: transform or optimize?",
            ["Strategy/transformation plan"]
          ),
          q(
            "digital-progress",
            "To what percent has digital transformation been executed?"
          ),
        ],
      },
      {
        id: "mf-a-operations",
        title: "IT Operations",
        questions: [
          q("operating-model", "What is the IT operating model in place?"),
          q(
            "cloud-role",
            "What is the role and use of cloud and rate of shift to the cloud?"
          ),
          q(
            "delivery-model",
            "What is the preferred delivery model in place — e.g., projects vs. products?"
          ),
          q(
            "delivery-method",
            "What delivery method is preferred — e.g., waterfall vs. agile?"
          ),
        ],
      },
      {
        id: "mf-a-financial",
        title: "IT Financial Management",
        questions: [
          q(
            "budget",
            "What is the IT budget — both operating expenditure and capital expenditure?",
            ["IT budget"]
          ),
          q("budgeting-process", "How is the IT budget allocated and tracked?"),
        ],
      },
    ],
  },
  {
    id: "si-s",
    label: "SI & S",
    title: "Systems, Infrastructure & Support",
    description:
      "Map the core application landscape, hosting footprint, and support arrangements sustaining day-to-day operations.",
    sections: [
      {
        id: "si-s-systems",
        title: "Systems Landscape",
        questions: [
          q(
            "core-systems",
            "List the core applications supporting business processes.",
            ["Application inventory"]
          ),
          q(
            "integration-approach",
            "Describe the integration approach/middleware in use.",
            ["Architecture diagrams"]
          ),
          q(
            "technical-debt",
            "What technical debt exists within the core systems?"
          ),
        ],
      },
      {
        id: "si-s-infrastructure",
        title: "Infrastructure",
        questions: [
          q(
            "hosting-model",
            "Summarize the hosting model (on-premises, co-lo, cloud) and providers.",
            ["Infrastructure overview"]
          ),
          q(
            "support-model",
            "Outline support arrangements (internal vs. external).",
            ["Support contracts"]
          ),
          q("resilience", "Describe resilience, DR, and backup capabilities."),
        ],
      },
    ],
  },
  {
    id: "si-s-detail",
    label: "SI & S Detail",
    title: "Systems & Infrastructure Detail",
    description:
      "Dive deeper into architecture roadmaps, operational tooling, and service reliability for critical platforms.",
    sections: [
      {
        id: "si-s-detail-architecture",
        title: "Architecture & Roadmap",
        questions: [
          q(
            "architecture-diagrams",
            "Provide high-level architecture diagrams.",
            ["Architecture diagrams"]
          ),
          q(
            "roadmap",
            "What initiatives are in-flight or planned to modernise the landscape?",
            ["Program roadmap"]
          ),
        ],
      },
      {
        id: "si-s-detail-operations",
        title: "Operations Detail",
        questions: [
          q(
            "monitoring",
            "What tooling exists for monitoring and observability?",
            ["Tooling inventory"]
          ),
          q(
            "service-metrics",
            "Share recent operational metrics (availability, incidents, response).",
            ["Service reports"]
          ),
        ],
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    title: "Data & Analytics",
    description:
      "Review how data is governed, catalogued, and activated through analytics platforms and literacy programs.",
    sections: [
      {
        id: "data-governance",
        title: "Governance",
        questions: [
          q(
            "governance-model",
            "Describe the data governance model, roles, and committees.",
            ["Governance charter"]
          ),
          q("data-quality", "How is data quality measured and managed?", [
            "Data quality KPIs",
          ]),
          q("master-data", "What is the approach to master data management?", [
            "MDM documentation",
          ]),
        ],
      },
      {
        id: "data-analytics",
        title: "Analytics & Reporting",
        questions: [
          q("analytics-platforms", "Which analytics/BI platforms are in use?", [
            "Platform inventory",
          ]),
          q(
            "usage-examples",
            "Provide examples of analytics driving business decisions.",
            ["Use-case deck"]
          ),
          q("data-literacy", "How is data literacy promoted across teams?"),
        ],
      },
    ],
  },
  {
    id: "security-risk",
    label: "Security & Risk",
    title: "Security, Risk & Compliance",
    description:
      "Capture cyber defence posture, governance, and how technology risk and regulatory obligations are managed.",
    sections: [
      {
        id: "security-posture",
        title: "Security Posture",
        questions: [
          q("frameworks", "Which security frameworks/standards are followed?", [
            "Policies, framework mappings",
          ]),
          q(
            "team-structure",
            "Describe the security organisation and reporting lines."
          ),
          q(
            "recent-incidents",
            "Summarise notable incidents or vulnerabilities in the last 12 months.",
            ["Incident reports"]
          ),
        ],
      },
      {
        id: "risk-compliance",
        title: "Risk & Compliance",
        questions: [
          q(
            "regulatory-obligations",
            "List key regulatory obligations and current compliance status.",
            ["Compliance assessments"]
          ),
          q(
            "risk-management",
            "Describe the IT risk management process, cadence, and ownership.",
            ["Risk register"]
          ),
          q(
            "third-party-risk",
            "How are third-party/vendor risks assessed and monitored?",
            ["Vendor risk assessments"]
          ),
        ],
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    title: "Cloud & DevOps",
    description:
      "Assess cloud adoption roadmaps, guardrails, and automation maturity powering continuous delivery.",
    sections: [
      {
        id: "cloud-strategy",
        title: "Cloud Strategy",
        questions: [
          q(
            "cloud-roadmap",
            "Outline the cloud adoption strategy, preferred hyperscalers, and timelines.",
            ["Cloud strategy deck"]
          ),
          q(
            "governance",
            "Describe cloud governance (cost controls, security, provisioning).",
            ["Cloud governance playbook"]
          ),
        ],
      },
      {
        id: "devops",
        title: "DevOps & Automation",
        questions: [
          q(
            "toolchain",
            "List CI/CD, infrastructure automation, and monitoring tooling.",
            ["Toolchain inventory"]
          ),
          q(
            "deployment-cadence",
            "What is the deployment cadence and release approval workflow?"
          ),
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    title: "Programs & Projects",
    description:
      "Summarise the change portfolio, delivery governance, and how initiatives land on time, scope, and budget.",
    sections: [
      {
        id: "portfolio",
        title: "Portfolio Overview",
        questions: [
          q(
            "portfolio-summary",
            "Provide an overview of the current project/program portfolio.",
            ["Portfolio dashboard"]
          ),
          q(
            "prioritisation",
            "Explain prioritisation, funding, and approval governance.",
            ["Governance artifacts"]
          ),
        ],
      },
      {
        id: "delivery-performance",
        title: "Delivery Performance",
        questions: [
          q(
            "performance-metrics",
            "Share delivery performance metrics (on time/on budget/benefits).",
            ["PMO reports"]
          ),
          q(
            "resourcing",
            "Describe the resourcing model (internal vs. partner mix).",
            ["Resourcing plan"]
          ),
        ],
      },
    ],
  },
  {
    id: "personnel",
    label: "Personnel",
    title: "People & Organisation",
    description:
      "Understand the structure, sourcing mix, and talent programs underpinning IT capabilities and partner ecosystems.",
    sections: [
      {
        id: "organisation-structure",
        title: "Organisation Structure",
        questions: [
          q(
            "org-chart",
            "Provide a high-level IT organisation structure highlighting key roles.",
            ["Org chart"]
          ),
          q(
            "sourcing-model",
            "Describe the sourcing mix (FTE vs. contractors vs. partners).",
            ["Sourcing strategy"]
          ),
        ],
      },
      {
        id: "talent",
        title: "Talent & Capability",
        questions: [
          q(
            "skills-overview",
            "Summarise critical IT capabilities and notable skill gaps.",
            ["Skills inventory"]
          ),
          q(
            "retention",
            "Outline retention, succession, and engagement initiatives.",
            ["HR metrics"]
          ),
        ],
      },
    ],
  },
  {
    id: "implications",
    label: "Implications",
    title: "Implications & Recommendations",
    description:
      "Capture the headline findings from the diligence and the actions needed now versus later to strengthen IT value.",
    sections: [
      {
        id: "observations",
        title: "Observations",
        questions: [
          q(
            "top-observations",
            "List the top 3–5 observations arising from the due diligence.",
            ["Observation log"]
          ),
          q(
            "critical-risks",
            "Highlight critical risks requiring immediate attention.",
            ["Risk heatmap"]
          ),
        ],
      },
      {
        id: "recommendations",
        title: "Recommendations",
        questions: [
          q("short-term", "Detail short-term recommendations (0–3 months).", [
            "Action plan",
          ]),
          q(
            "long-term",
            "Detail medium/long-term opportunities to enhance IT.",
            ["Transformation roadmap"]
          ),
        ],
      },
    ],
  },
];

export const DEFAULT_CATEGORY_ID = DUE_DILIGENCE_CATEGORIES[0]?.id ?? "mf-a";
