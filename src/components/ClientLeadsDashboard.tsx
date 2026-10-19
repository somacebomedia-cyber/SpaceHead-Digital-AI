import { useState, useMemo, useTransition, FormEvent } from "react";
import { ClientLeadInquiry, LeadStatus } from "../types";
import { 
  updateInboundLead, 
  deleteInboundLead, 
  createManualInboundLead 
} from "../lib/firebaseServices";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  MessageCircle,
  Mail,
  Phone,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  ArrowUpRight,
  X,
  FileSpreadsheet,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Send
} from "lucide-react";

interface ClientLeadsDashboardProps {
  leads: ClientLeadInquiry[];
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
}

const ALL_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "In Progress",
  "Proposal Sent",
  "Converted",
  "Archived",
  "Spam",
];

export default function ClientLeadsDashboard({
  leads,
  onRefresh,
  isLoading = false,
}: ClientLeadsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "project_brief" | "workspace_lead">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Selected Lead for Detail Modal
  const [selectedLead, setSelectedLead] = useState<ClientLeadInquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<LeadStatus>("New");
  const [savingDetails, setSavingDetails] = useState(false);

  // Manual Add Lead Modal
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    service: "Premium Website Design",
    brief: "",
    source: "workspace_lead" as "project_brief" | "workspace_lead",
    status: "New" as LeadStatus,
  });
  const [submittingManual, setSubmittingManual] = useState(false);

  // Copy feedback tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Color mappings for status badges
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
          dot: "bg-indigo-500",
        };
      case "Contacted":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
        };
      case "In Progress":
        return {
          bg: "bg-sky-50",
          text: "text-sky-700",
          border: "border-sky-200",
          dot: "bg-sky-500",
        };
      case "Proposal Sent":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          dot: "bg-purple-500",
        };
      case "Converted":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "Archived":
        return {
          bg: "bg-slate-100",
          text: "text-slate-600",
          border: "border-slate-200",
          dot: "bg-slate-400",
        };
      case "Spam":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  // Quick WhatsApp Link builder for Client
  const getWhatsAppClientLink = (lead: ClientLeadInquiry) => {
    // Sanitize phone number
    let clean = lead.phone.replace(/[^0-9+]/g, "");
    if (clean.startsWith("0") && clean.length === 10) {
      clean = "27" + clean.substring(1);
    } else if (clean.startsWith("+")) {
      clean = clean.substring(1);
    }

    const firstName = lead.name.trim().split(" ")[0] || "there";
    const msg = `Hi ${firstName}, this is SpaceHead AI regarding your inquiry for ${lead.service} (Ref: ${lead.referenceCode}). Thank you for reaching out! When would be a good time for a quick 5-minute chat about your project?`;

    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  // Quick Email Mailto builder
  const getEmailClientLink = (lead: ClientLeadInquiry) => {
    const firstName = lead.name.trim().split(" ")[0] || "Client";
    const subject = `SpaceHead AI — Proposal & Next Steps for your ${lead.service} [${lead.referenceCode}]`;
    const body = `Hi ${firstName},\n\nThank you for reaching out to SpaceHead AI regarding your ${lead.service} brief (Reference: ${lead.referenceCode}).\n\nWe have reviewed your project requirements:\n"${lead.brief.slice(0, 180)}..."\n\nWe would love to schedule a quick 10-minute consult to confirm your deliverable timeline, technical specifications, and finalized pricing.\n\nPlease let us know what day and time works best for you, or feel free to message our team directly on WhatsApp.\n\nBest regards,\nSpaceHead AI Team\nhttps://spaceheadai.co.za`;

    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered and Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Source filter
        if (sourceFilter !== "all" && lead.source !== sourceFilter) {
          return false;
        }
        // Status filter
        if (statusFilter !== "all" && lead.status !== statusFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(q);
          const matchBiz = (lead.businessName || "").toLowerCase().includes(q);
          const matchEmail = lead.email.toLowerCase().includes(q);
          const matchPhone = lead.phone.toLowerCase().includes(q);
          const matchCode = lead.referenceCode.toLowerCase().includes(q);
          const matchService = lead.service.toLowerCase().includes(q);
          const matchBrief = lead.brief.toLowerCase().includes(q);
          const matchNotes = (lead.adminNotes || "").toLowerCase().includes(q);

          return (
            matchName ||
            matchBiz ||
            matchEmail ||
            matchPhone ||
            matchCode ||
            matchService ||
            matchBrief ||
            matchNotes
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [leads, sourceFilter, statusFilter, searchQuery, sortBy]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "New").length;
    const inDiscussion = leads.filter(
      (l) => l.status === "Contacted" || l.status === "In Progress" || l.status === "Proposal Sent"
    ).length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const briefCount = leads.filter((l) => l.source === "project_brief").length;
    const consultCount = leads.filter((l) => l.source === "workspace_lead").length;

    return { total, newCount, inDiscussion, converted, briefCount, consultCount };
  }, [leads]);

  // Quick inline status change
  const handleQuickStatusChange = async (lead: ClientLeadInquiry, newStatus: LeadStatus) => {
    startTransition(async () => {
      try {
        await updateInboundLead(lead.id, lead.source, {
          status: newStatus,
          referenceCode: lead.referenceCode,
        });
        await onRefresh();
      } catch (err) {
        console.error("Status update error:", err);
      }
    });
  };

  // Open detail modal
  const openDetailModal = (lead: ClientLeadInquiry) => {
    setSelectedLead(lead);
    setSelectedLeadStatus(lead.status);
    setEditingNotes(lead.adminNotes || "");
  };

  // Save changes from detail modal
  const handleSaveLeadDetails = async () => {
    if (!selectedLead) return;
    setSavingDetails(true);
    try {
      await updateInboundLead(selectedLead.id, selectedLead.source, {
        status: selectedLeadStatus,
        adminNotes: editingNotes,
        referenceCode: selectedLead.referenceCode,
      });
      await onRefresh();
      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              status: selectedLeadStatus,
              adminNotes: editingNotes,
            }
          : null
      );
      setSelectedLead(null);
    } catch (err) {
      console.error("Failed saving lead details:", err);
      alert("Could not update lead. Check your connection or rules.");
    } finally {
      setSavingDetails(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (lead: ClientLeadInquiry) => {
    if (!window.confirm(`Are you sure you want to permanently delete lead ${lead.referenceCode} from ${lead.name}?`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteInboundLead(lead.id, lead.source);
        if (selectedLead?.id === lead.id) {
          setSelectedLead(null);
        }
        await onRefresh();
      } catch (err) {
        console.error("Delete lead error:", err);
      }
    });
  };

  // Manual Add Lead Submit
  const handleAddManualLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.email.trim() || !manualForm.phone.trim()) {
      alert("Name, email, and contact phone are required.");
      return;
    }
    setSubmittingManual(true);
    try {
      const code = `SH-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear().toString().substring(2)}`;
      await createManualInboundLead({
        source: manualForm.source,
        name: manualForm.name.trim(),
        businessName: manualForm.businessName.trim(),
        email: manualForm.email.trim(),
        phone: manualForm.phone.trim(),
        service: manualForm.service,
        brief: manualForm.brief.trim() || "Manual phone consult inquiry entry.",
        referenceCode: code,
        createdAt: new Date().toISOString(),
        status: manualForm.status,
      });
      setIsAddingLead(false);
      setManualForm({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        service: "Premium Website Design",
        brief: "",
        source: "workspace_lead",
        status: "New",
      });
      await onRefresh();
    } catch (err) {
      console.error("Error creating manual lead:", err);
      alert("Failed creating lead.");
    } finally {
      setSubmittingManual(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const listToExport = filteredLeads.length > 0 ? filteredLeads : leads;

    if (listToExport.length === 0) {
      alert("No inquiries available to export.");
      return;
    }

    const headers = [
      "Reference Code",
      "Date Submitted",
      "Source Channel",
      "Client Name",
      "Business Name",
      "Email Address",
      "WhatsApp / Phone",
      "Service Requested",
      "Current Status",
      "Admin Notes",
      "Customer Brief & Requirements",
    ];

    const escapeCsv = (val: string | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = listToExport.map((item) => [
      escapeCsv(item.referenceCode),
      escapeCsv(new Date(item.createdAt).toLocaleString("en-ZA")),
      escapeCsv(item.source === "project_brief" ? "Checkout Brief" : "Contact Inquiry"),
      escapeCsv(item.name),
      escapeCsv(item.businessName || "—"),
      escapeCsv(item.email),
      escapeCsv(item.phone),
      escapeCsv(item.service),
      escapeCsv(item.status),
      escapeCsv(item.adminNotes || "—"),
      escapeCsv(item.brief),
    ]);

    const csvContent = [headers.map((h) => `"${h}"`).join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `spacehead_client_leads_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportToast(`Exported ${listToExport.length} leads to CSV successfully.`);
    setTimeout(() => setExportToast(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center space-x-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportToast}</span>
        </div>
      )}

      {/* Top Header & Metrics Grid */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              Inbound CRM Pipeline
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Firestore: project_briefs & workspace_leads
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 mt-1">
            Client Leads & Project Inquiries
          </h2>
          <p className="text-xs text-slate-500">
            Review submissions, update deal stages, trigger one-click WhatsApp/email outreach, and export data.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onRefresh()}
            disabled={isLoading || isPending}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh Inbound Leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer hover:border-slate-300"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddingLead(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Total Leads</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-sans font-extrabold text-slate-900 mt-2">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>{stats.briefCount} checkout</span>
            <span>•</span>
            <span>{stats.consultCount} contact</span>
          </div>
        </div>

        {/* New / Action Required */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-indigo-600">
              New Submissions
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-sans font-extrabold text-indigo-600 mt-2">
            {stats.newCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Needs first outreach or consult call
          </div>
        </div>

        {/* In Discussion / Pipeline */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">In Discussion</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-sans font-extrabold text-amber-600 mt-2">
            {stats.inDiscussion}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Contacted, in progress or proposal sent
          </div>
        </div>

        {/* Converted Clients */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Converted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-sans font-extrabold text-emerald-600 mt-2">
            {stats.converted}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Won projects & active builds
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, business, phone, email, reference code, service..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Source Filter */}
          <div className="flex items-center space-x-2 min-w-[170px]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Sources ({leads.length})</option>
              <option value="project_brief">Checkout Briefs ({stats.briefCount})</option>
              <option value="workspace_lead">Contact Inquiries ({stats.consultCount})</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st} ({leads.filter((l) => l.status === st).length})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[130px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Filter Indicator Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredLeads.length}</span> of{" "}
            <span className="font-bold text-slate-800">{leads.length}</span> inquiries
            {(sourceFilter !== "all" || statusFilter !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSourceFilter("all");
                  setStatusFilter("all");
                }}
                className="ml-2 text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
            <span>Click any inquiry row to view full brief & internal notes</span>
          </div>
        </div>
      </div>

      {/* Leads Table / Cards List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No customer submissions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all" || sourceFilter !== "all"
                ? "Try adjusting your search terms or filter criteria."
                : "No client inquiries have been received yet. Use the 'Log Inbound Lead' button above to create a test record."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <th className="p-4 pl-6">Client & Service</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 pr-6 text-right">Quick Outreach Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const statusStyle = getStatusBadge(lead.status);
                  const isBrief = lead.source === "project_brief";

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => openDetailModal(lead)}
                    >
                      {/* Client & Service */}
                      <td className="p-4 pl-6 max-w-xs sm:max-w-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 font-sans text-sm">
                            {lead.name}
                          </span>
                          {lead.businessName && (
                            <span className="text-[11px] text-slate-500 truncate">
                              ({lead.businessName})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-semibold text-indigo-600">
                            {lead.service}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {lead.referenceCode}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                              isBrief
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {isBrief ? "Checkout" : "Consult"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-sans">
                          {lead.brief}
                        </p>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-800 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{lead.email}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(lead.email, `email-${lead.id}`);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy email"
                          >
                            {copiedId === `email-${lead.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center space-x-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px]">{lead.phone}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(lead.phone, `phone-${lead.id}`);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy phone"
                          >
                            {copiedId === `phone-${lead.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status Tag Selector */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleQuickStatusChange(lead, e.target.value as LeadStatus)
                            }
                            className={`text-xs font-bold pl-2.5 pr-6 py-1 rounded-full border cursor-pointer appearance-none transition-all ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                            ▼
                          </span>
                        </div>
                        {lead.adminNotes && (
                          <div className="text-[10px] text-slate-400 italic truncate max-w-[130px] mt-1">
                            Note: {lead.adminNotes}
                          </div>
                        )}
                      </td>

                      {/* Submission Date */}
                      <td className="p-4 text-xs font-mono text-slate-500">
                        <div>
                          {new Date(lead.createdAt).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Quick Outreach Actions */}
                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* WhatsApp One-Click Action */}
                          <a
                            href={getWhatsAppClientLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
                            title="Direct WhatsApp client message"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>

                          {/* Email One-Click Action */}
                          <a
                            href={getEmailClientLink(lead)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
                            title="Direct email client consult"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Email</span>
                          </a>

                          {/* View details */}
                          <button
                            onClick={() => openDetailModal(lead)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View full details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          {/* Delete Lead */}
                          <button
                            onClick={() => handleDeleteLead(lead)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Manage Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 pr-8">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      selectedLead.source === "project_brief"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {selectedLead.source === "project_brief" ? "Checkout Brief" : "Contact Page Consultation"}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Ref: {selectedLead.referenceCode}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-slate-900">
                  {selectedLead.name}
                  {selectedLead.businessName && (
                    <span className="text-slate-500 font-normal text-base block sm:inline sm:ml-2">
                      ({selectedLead.businessName})
                    </span>
                  )}
                </h3>
                <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                  <span>Specialization: {selectedLead.service}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-mono">
                    {new Date(selectedLead.createdAt).toLocaleString("en-ZA")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {/* WhatsApp Action */}
              <a
                href={getWhatsAppClientLink(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              {/* Email Action */}
              <a
                href={getEmailClientLink(selectedLead)}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email Consult</span>
              </a>

              {/* Phone Direct */}
              <a
                href={`tel:${selectedLead.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                <span>Direct Call</span>
              </a>
            </div>

            {/* Client Requirements Brief */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Client Brief & Project Specifications
                </label>
                <button
                  onClick={() => handleCopyText(selectedLead.brief, "full-brief")}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedId === "full-brief" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Brief Text</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedLead.brief}
              </div>
            </div>

            {/* Pipeline Status & Internal Admin Notes */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Pipeline Status Tag
                  </label>
                  <select
                    value={selectedLeadStatus}
                    onChange={(e) => setSelectedLeadStatus(e.target.value as LeadStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Direct Contact Phone
                  </label>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedLead.phone}</span>
                  </div>
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Internal Workspace Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record client discussion notes, custom quotes agreed upon, deposit status, or meeting follow-ups..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveLeadDetails}
                  disabled={savingDetails}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {savingDetails ? "Saving to Cloud..." : "Save Pipeline Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {isAddingLead && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsAddingLead(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
                  Manual CRM Entry
                </span>
                <h3 className="text-lg font-sans font-bold text-slate-900">
                  Log Inbound Client Lead
                </h3>
              </div>
              <button
                onClick={() => setIsAddingLead(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    placeholder="e.g. Sipho Nkosi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Business Name</label>
                  <input
                    type="text"
                    value={manualForm.businessName}
                    onChange={(e) => setManualForm({ ...manualForm, businessName: e.target.value })}
                    placeholder="e.g. Nkosi Logistics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    placeholder="client@example.co.za"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    placeholder="079 448 6843"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Service Category</label>
                  <select
                    value={manualForm.service}
                    onChange={(e) => setManualForm({ ...manualForm, service: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Premium Website Design">Premium Website Design</option>
                    <option value="High-Impact Video Ad Campaign">High-Impact Video Ad Campaign</option>
                    <option value="Custom AI App Prototype">Custom AI App Prototype</option>
                    <option value="Web Engineering & API Portal">Web Engineering & API Portal</option>
                    <option value="Other / Custom Deliverable">Other / Custom Deliverable</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Initial Status</label>
                  <select
                    value={manualForm.status}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, status: e.target.value as LeadStatus })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Inquiry Brief / Notes</label>
                <textarea
                  rows={3}
                  value={manualForm.brief}
                  onChange={(e) => setManualForm({ ...manualForm, brief: e.target.value })}
                  placeholder="Outline client discussion notes, requirements, or agreed deliverables..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submittingManual}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {submittingManual ? "Saving..." : "Save Inbound Lead"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingLead(false)}
                  className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
