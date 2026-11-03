/* Portfolio content — editable using editor.html */
window.PORTFOLIO_CONTENT = {
  email: "pallavinairsm@gmail.com",
  linkedin: "https://www.linkedin.com/in/pallavi-nair-8191a4285",
  projects: [
    {
      id: "orbit", number: "01", category: "BUSINESS INTELLIGENCE", title: "ORBIT",
      subtitle: "Automotive Components Supply Chain Risk Intelligence",
      summary: "An interactive Power BI exploration of trade dependency, concentration and governance-related supply chain exposure.",
      tools: ["Power BI", "DAX", "World Bank", "UN Comtrade", "WGI"],
      challenge: "Automotive component sourcing decisions involve overlapping trade, geographic and governance risks. ORBIT brings these dimensions into one analytical experience.",
      approach: "Built a Power BI risk intelligence dashboard combining international trade and macroeconomic indicators. Explored concentration using HHI, trade dependency, foreign direct investment context and Worldwide Governance Indicators, with drillthrough for deeper analysis.",
      outcome: "A portfolio demonstration of how interactive BI can structure supply chain risk conversations. This is an analytical project, not a claim of deployed enterprise risk scoring.",
      thumbnail: "images/orbit-thumbnail.png",
      image: "images/orbit-about.png\nimages/orbit-overview.png\nimages/orbit-market.png\nimages/orbit-governance.png\nimages/orbit-supply.png\nimages/orbit-comparison.png\nimages/orbit-attractiveness.png",
      link: ""
    },
    {
      id: "ambulance", number: "02", category: "MACHINE LEARNING", title: "Risk-Based Classification",
      subtitle: "Drug-Related Ambulance Attendances in Australia",
      summary: "Supervised classification and explainable AI to investigate patterns across demographic, substance and jurisdictional characteristics.",
      tools: ["Python", "pandas", "scikit-learn", "XGBoost", "SHAP"],
      challenge: "Descriptive reporting does not, on its own, classify attendances into differentiated risk profiles.",
      approach: "Prepared demographic, substance-type, state and year features; compared supervised classification approaches and explored feature contributions using SHAP.",
      outcome: "An interpretable risk-profiling research workflow designed to support analytical understanding. No clinical deployment or operational validation is implied.",
      thumbnail: "", image: "", link: ""
    },
    {
      id: "csr", number: "03", category: "STRATEGY & SUSTAINABILITY", title: "Strategic CSR Framework",
      subtitle: "Korea–UAE Cultural Partnerships",
      summary: "A stakeholder-informed sustainability and CSR research framework connecting cultural collaboration with strategic value.",
      tools: ["CSR", "ESG", "Stakeholder Analysis", "Research"],
      challenge: "Align cultural partnership initiatives with credible social value and long-term stakeholder interests.",
      approach: "Developed a research-led strategic framework using CSR, sustainability and stakeholder perspectives.",
      outcome: "Second-place research project recognition.",
      thumbnail: "", image: "", link: ""
    },
    {
      id: "logistics", number: "04", category: "DIGITAL TRANSFORMATION", title: "AI-Driven Logistics",
      subtitle: "Sustainability Solution Concept",
      summary: "A conceptual logistics process-improvement solution exploring AI-assisted efficiency and sustainability.",
      tools: ["Process Mapping", "SAP Concepts", "AI Strategy", "Feasibility"],
      challenge: "Identify opportunities to reduce inefficiencies in logistics workflows while considering sustainability.",
      approach: "Explored workflow optimisation, feasibility and the potential role of AI and enterprise systems in a virtual industry project.",
      outcome: "Conceptual solution and process recommendations; not a deployed software product.",
      thumbnail: "", image: "", link: ""
    }
  ],
  experience: [
    {role: "Marketing Analyst & Project Support — Digital Content", company: "CHOPS General Trading LLC", period: "2025–2026", detail: "Marketing analytics, content and project support."},
    {role: "Content, Events & Partnership Intern", company: "SOLU", period: "2025", detail: "Content, events and partnership coordination."},
    {role: "Data Specialist Intern", company: "Trioz Global", period: "2022–2024", detail: "Data-focused operational support."}
  ],
  certifications: ["Azure AI Essentials", "McKinsey Forward", "Deloitte Australia Data Analytics Simulation", "IBM Data Science 101", "Anthropic AI Fluency", "Sirocco Marketing Automation", "SAP S/4HANA coursework"]
};
