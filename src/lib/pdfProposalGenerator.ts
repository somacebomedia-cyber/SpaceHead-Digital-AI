import { jsPDF } from "jspdf";
import { EstimateSummary } from "../data/estimatorConfig";

export interface ClientProposalInfo {
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  briefNotes?: string;
}

export interface ProposalAiAnalysis {
  executiveSummary?: string;
  architectureHighlights?: string[];
  projectedRoiSummary?: string;
}

export function generateBrandedProposalPDF(
  summary: EstimateSummary,
  clientInfo: ClientProposalInfo,
  aiAnalysis?: ProposalAiAnalysis
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expiryDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ================= PAGE 1 =================
  // Header Background Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 36, "F");

  // Accent Gradient Line
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(0, 36, pageWidth, 1.5, "F");

  // Header Brand Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SPACEHEAD AI", margin, 17);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("DIGITAL ARCHITECTURE & AI ENGINEERING | SOUTH AFRICA", margin, 24);
  doc.text("Web: www.spacehead.co.za | Email: hello@spacehead.co.za | WhatsApp: +27 79 448 6843", margin, 29);

  // Quote Reference Badge on right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - margin - 62, 10, 62, 18, 2, 2, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(165, 180, 252); // indigo-300
  doc.text("PROPOSAL & QUOTE REF", pageWidth - margin - 58, 16);

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(summary.referenceCode, pageWidth - margin - 58, 23);

  // Document Title
  let y = 48;
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("TECHNICAL PROPOSAL & SCOPE OF WORK", margin, y);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Issue Date: ${dateFormatted}  |  Price Guarantee Valid Until: ${expiryDate}`, margin, y + 5);

  y += 12;

  // Client Metadata Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, "FD");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(99, 102, 241);
  doc.text("PROPOSAL PREPARED FOR:", margin + 4, y + 6);
  doc.text("PROJECT TYPE / ARCHETYPE:", margin + (contentWidth / 2) + 4, y + 6);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  const clientHeading = clientInfo.businessName 
    ? `${clientInfo.name} (${clientInfo.businessName})`
    : clientInfo.name || "Valued Client";
  doc.text(clientHeading, margin + 4, y + 12);
  doc.text(summary.archetype.name, margin + (contentWidth / 2) + 4, y + 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const contactLine = `${clientInfo.email || "hello@client.co.za"}  |  ${clientInfo.phone || "Contact phone"}`;
  doc.text(contactLine, margin + 4, y + 18);
  doc.text(summary.archetype.tagline, margin + (contentWidth / 2) + 4, y + 18);

  y += 31;

  // Executive Architecture Summary
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("1. EXECUTIVE ARCHITECTURE & STRATEGY", margin, y);

  y += 5;
  const execSummaryText = aiAnalysis?.executiveSummary || 
    `SpaceHead AI proposes to engineer a bespoke ${summary.archetype.name} built for high conversion, rock-solid security, and effortless scalability. The solution couples modern responsive frontend design with resilient backend data infrastructure, delivering an automated digital experience that saves operational hours and establishes a standout brand presence in the South African market.`;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const splitExec = doc.splitTextToSize(execSummaryText, contentWidth);
  doc.text(splitExec, margin, y);
  y += splitExec.length * 4 + 4;

  // Deliverables & Scope Table
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("2. ITEMIZED SCOPE OF DELIVERABLES", margin, y);

  y += 4;
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("MODULE / DELIVERABLE", margin + 3, y + 4.8);
  doc.text("SPECIFICATIONS", margin + 65, y + 4.8);
  doc.text("TIMELINE", margin + 135, y + 4.8);
  doc.text("INVESTMENT", margin + 155, y + 4.8);

  y += 7;

  // Base Archetype Row
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(summary.archetype.name, margin + 3, y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.2);
  doc.text("Base platform architecture, responsive UX & cloud deployment", margin + 65, y + 4.5);
  doc.text(`${summary.archetype.baseDays} days`, margin + 135, y + 4.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`R ${summary.archetype.basePriceZAR.toLocaleString()}`, margin + 155, y + 4.5);

  doc.setDrawColor(241, 245, 249);
  doc.line(margin, y + 7, margin + contentWidth, y + 7);
  y += 7;

  // Selected Modules Rows
  summary.selectedModules.forEach((mod) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(mod.title, margin + 3, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.2);
    const shortDesc = doc.splitTextToSize(mod.shortDesc, 65)[0];
    doc.text(shortDesc, margin + 65, y + 4.5);
    doc.text(mod.additionalDays > 0 ? `+${mod.additionalDays} days` : "Accelerated", margin + 135, y + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`R ${mod.priceZAR.toLocaleString()}`, margin + 155, y + 4.5);

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);
    y += 7;
  });

  y += 4;

  // Investment Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("TOTAL PROJECT INVESTMENT (ZAR):", margin + 5, y + 7);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(99, 102, 241); // indigo-600
  doc.text(`R ${summary.totalPriceZAR.toLocaleString()}.00`, margin + 5, y + 14);

  // Milestone Terms
  doc.setFontSize(7.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`• 50% Initiation Milestone: R ${summary.depositAmountZAR.toLocaleString()}.00 (Required to commence Sprint 1)`, margin + 5, y + 21);
  doc.text(`• 50% Production Handover: R ${summary.balanceAmountZAR.toLocaleString()}.00 (Payable on final client QA signoff)`, margin + 5, y + 26);
  doc.text(`• Estimated Total Timeline: ${summary.totalDays} Business Days (~${summary.sprintWeeks})`, margin + 5, y + 31);

  // Status Badge on right of investment box
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(pageWidth - margin - 55, y + 5, 50, 24, 2, 2, "FD");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202);
  doc.text("COMMERCIAL SLA", pageWidth - margin - 51, y + 10);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(79, 70, 229);
  doc.text("100% IP Handover", pageWidth - margin - 51, y + 15);
  doc.text("30-Day Tech Warranty", pageWidth - margin - 51, y + 19);
  doc.text("Secure PayFast Ready", pageWidth - margin - 51, y + 23);

  // Page 1 Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("SpaceHead AI Commercial Proposal • Confidential • Page 1 of 2", margin, pageHeight - 8);
  doc.text(`Ref: ${summary.referenceCode}`, pageWidth - margin - 35, pageHeight - 8);

  // ================= PAGE 2 =================
  doc.addPage();

  // Page 2 Header Strip
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 20, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SPACEHEAD AI  |  DELIVERY ROADMAP & ENGAGEMENT TERMS", margin, 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(199, 210, 254);
  doc.text(`Ref: ${summary.referenceCode}`, pageWidth - margin - 40, 12);

  let y2 = 30;

  // Delivery Milestones
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("3. PROJECT SPRINT ROADMAP & MILESTONES", margin, y2);

  y2 += 6;

  const milestones = [
    {
      sprint: "Sprint 1: Architecture & UI Prototype",
      days: "Days 1 - 4",
      desc: "Information architecture, visual wireframing, database schema bootstrapping, and client approval of UX flows.",
    },
    {
      sprint: "Sprint 2: Core Engineering & Modules",
      days: "Days 5 - 10",
      desc: "Frontend component assembly, backend API route setup, database synchronization, and payment gateway integration.",
    },
    {
      sprint: "Sprint 3: AI Workflows, SEO & Testing",
      days: "Days 11 - 14",
      desc: "AI agent prompt tuning, automated email/WhatsApp alerts, responsive cross-device testing, and security audit.",
    },
    {
      sprint: "Sprint 4: Production Deployment & QA Signoff",
      days: "Final Stage",
      desc: "Cloud container ingress, SSL domain propagation, Google Search Console indexing, and client team walkthrough.",
    },
  ];

  milestones.forEach((m, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y2, contentWidth, 14, 1.5, 1.5, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(99, 102, 241);
    doc.text(m.sprint, margin + 4, y2 + 5.5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(m.days, margin + contentWidth - 30, y2 + 5.5);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(m.desc, margin + 4, y2 + 10.5);

    y2 += 17;
  });

  y2 += 3;

  // ROI & Business Value Impact Box
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("4. PROJECTED BUSINESS ROI & EFFICIENCY IMPACT", margin, y2);

  y2 += 6;

  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y2, contentWidth, 25, 2, 2, "FD");

  const roiCols = [
    { label: "HOURS SAVED / MO", val: `${summary.roi.hoursSavedPerMonth} hrs/mo` },
    { label: "EST. LABOR SAVINGS", val: `R ${summary.roi.estimatedLaborSavingsZAR.toLocaleString()}/mo` },
    { label: "CONVERSION LIFT", val: `+${summary.roi.projectedConversionLiftPct}%` },
    { label: "EST. PAYBACK PERIOD", val: `${summary.roi.paybackMonths} Months` },
  ];

  const colWidth = contentWidth / 4;
  roiCols.forEach((col, idx) => {
    const colX = margin + idx * colWidth + 4;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text(col.label, colX, y2 + 7);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(col.val, colX, y2 + 15);
  });

  doc.setFontSize(7.2);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(
    "* Projections calculated based on South African benchmark figures for automated customer self-service and streamlined lead capture.",
    margin + 4,
    y2 + 21
  );

  y2 += 32;

  // Terms of Engagement & Guarantees
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("5. TERMS OF ENGAGEMENT & COMMERCIAL GUARANTEES", margin, y2);

  y2 += 6;
  const terms = [
    "• Intellectual Property: Upon receipt of final payment, 100% full intellectual property, source code, and assets belong exclusively to the client.",
    "• 30-Day Post-Launch Warranty: SpaceHead AI provides 30 calendar days of complimentary bug fixes and technical adjustments post-launch.",
    "• South African POPIA Compliance: All customer database schemas and transaction data comply with South African privacy standards.",
    "• Payment Terms: 50% deposit to initiate Sprint 1. The remaining 50% balance is payable upon production deployment and client signoff.",
  ];

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  terms.forEach((term) => {
    doc.text(term, margin, y2);
    y2 += 4.8;
  });

  y2 += 8;

  // Proposal Acceptance Signatures Block
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y2, contentWidth, 38, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("PROPOSAL ACCEPTANCE & AUTHORIZATION", margin + 5, y2 + 6);

  doc.setFontSize(7.2);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("By signing below, the client accepts the proposed scope, timeline, and investment terms outlined in this document.", margin + 5, y2 + 11);

  // Client Signature Line
  const sigY = y2 + 25;
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 5, sigY, margin + 75, sigY);
  doc.line(margin + 90, sigY, margin + 140, sigY);

  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Authorized Client Signature: ${clientInfo.name || "Client Representative"}`, margin + 5, sigY + 4);
  doc.text("Date of Acceptance", margin + 90, sigY + 4);

  // Page 2 Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("SpaceHead AI (Pty) Ltd • Johannesburg, South Africa • info@spacehead.co.za", margin, pageHeight - 8);
  doc.text("Page 2 of 2", pageWidth - margin - 15, pageHeight - 8);

  return doc;
}
