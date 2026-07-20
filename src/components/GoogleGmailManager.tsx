import { useState, useEffect, useTransition, FormEvent } from "react";
import { 
  Mail, 
  Send, 
  Inbox, 
  Trash2, 
  Search, 
  PenSquare, 
  Star, 
  User, 
  Clock, 
  CornerUpLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ChevronRight,
  Sparkles,
  Paperclip,
  CheckCircle,
  FolderOpen
} from "lucide-react";
import { 
  listGmailMessages, 
  getGmailMessage, 
  parseGmailMessage, 
  sendGmailEmail, 
  deleteGmailMessage, 
  ParsedEmail,
  listGmailLabels,
  GmailLabel
} from "../lib/googleGmailService";
import { connectGoogleDrive, getCachedToken, setCachedToken } from "../lib/googleDriveService";

export default function GoogleGmailManager() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Email state list
  const [emails, setEmails] = useState<ParsedEmail[]>([]);
  const [labels, setLabels] = useState<GmailLabel[]>([]);
  const [activeLabel, setActiveLabel] = useState<string>("INBOX");
  const [searchQuery, setSearchQuery] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);

  // Selected email for viewing details
  const [selectedEmail, setSelectedEmail] = useState<ParsedEmail | null>(null);

  // Composer modal state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Confirmation modal state for destructive operations
  const [deleteTarget, setDeleteTarget] = useState<ParsedEmail | null>(null);

  const [isPending, startTransition] = useTransition();

  // Load Gmail on mount if connected
  useEffect(() => {
    const token = getCachedToken();
    if (token) {
      setIsConnected(true);
      fetchGmailData();
    }
  }, [activeLabel]);

  const fetchGmailData = async (queryOverride?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Fetch labels
      try {
        const labelsData = await listGmailLabels();
        const filteredLabels = labelsData.filter(l => 
          ["INBOX", "SENT", "STARRED", "DRAFT", "TRASH", "IMPORTANT"].includes(l.id) || l.type === "user"
        );
        setLabels(filteredLabels);
      } catch (e) {
        console.warn("Failed to fetch labels:", e);
      }

      // Build search query based on active label selection
      let q = `label:${activeLabel}`;
      if (activeLabel === "STARRED") {
        q = "is:starred";
      } else if (activeLabel === "SENT") {
        q = "is:sent";
      } else if (activeLabel === "DRAFT") {
        q = "is:draft";
      } else if (activeLabel === "TRASH") {
        q = "is:trash";
      }

      if (queryOverride) {
        q = queryOverride;
      }

      const res = await listGmailMessages(q, 15);
      setNextPageToken(res.nextPageToken);

      if (res.messages && res.messages.length > 0) {
        // Fetch detailed content of top messages in parallel
        const details = await Promise.all(
          res.messages.map(async (msg) => {
            try {
              const fullMsg = await getGmailMessage(msg.id);
              return parseGmailMessage(fullMsg);
            } catch (err) {
              console.error(`Failed to get message details for ${msg.id}:`, err);
              return null;
            }
          })
        );
        setEmails(details.filter((d): d is ParsedEmail => d !== null));
      } else {
        setEmails([]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load emails. Token may have expired.");
      if (err.message?.includes("stale") || err.message?.includes("token") || err.message?.includes("unauthorized") || err.message?.includes("connected")) {
        setIsConnected(false);
        setCachedToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const handleConnect = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const result = await connectGoogleDrive();
      if (result.token) {
        setIsConnected(true);
        setSuccessMsg("Successfully authenticated with Gmail and Google Workspace!");
        fetchGmailData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Google Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setCachedToken(null);
    setIsConnected(false);
    setEmails([]);
    setSelectedEmail(null);
    setSuccessMsg("Google Workspace credentials cleared successfully.");
  };

  // Search Action
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchGmailData();
      return;
    }
    fetchGmailData(searchQuery);
  };

  // Send Email Action
  const handleSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !body.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await sendGmailEmail(toEmail.trim(), subject.trim(), body);
      setSuccessMsg(`Email successfully sent to <${toEmail}>!`);
      setShowComposeModal(false);
      setToEmail("");
      setSubject("");
      setBody("");
      // Refresh Sent list if that's the view, otherwise refresh general Inbox
      fetchGmailData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to deliver email. Please check the recipient address.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reply Helper
  const handleReply = (email: ParsedEmail) => {
    // Extract actual email address from "Name <email@address.com>"
    let emailAddr = email.from;
    const match = email.from.match(/<([^>]+)>/);
    if (match) {
      emailAddr = match[1];
    }
    
    setToEmail(emailAddr);
    setSubject(email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`);
    setBody(`\n\nOn ${email.date}, ${email.from} wrote:\n> ${email.snippet}`);
    setShowComposeModal(true);
  };

  // Delete/Trash trigger confirmation
  const handleRequestDelete = (email: ParsedEmail) => {
    setDeleteTarget(email);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await deleteGmailMessage(deleteTarget.id);
      setSuccessMsg(`Email moved to Trash.`);
      setDeleteTarget(null);
      setSelectedEmail(null);
      fetchGmailData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to trash message.");
    } finally {
      setIsLoading(false);
    }
  };

  // One-click quick marketing/business templates
  const applyTemplate = (type: "portfolio" | "update" | "inquiry") => {
    if (type === "portfolio") {
      setSubject("SpaceHead AI - Custom Full-Stack Project Solutions");
      setBody(
        `Hi there,\n\n` +
        `This is SpaceHead AI. We craft high-performance digital marketing solutions, highly responsive React-driven web applications, and fast custom content systems tailored for South African and global businesses.\n\n` +
        `We'd love to partner with you to accelerate your digital presence.\n\n` +
        `Check out our live portfolio portal to see our latest works.\n\n` +
        `Kind regards,\nSpaceHead AI Team`
      );
    } else if (type === "update") {
      setSubject("SpaceHead Workspace - Dynamic Project Milestones & Analytics");
      setBody(
        `Hi,\n\n` +
        `We have successfully synchronized our development environment. Your portfolio workspace has been backed up securely, and live blog logs are fully updated on our cloud database.\n\n` +
        `Please let us know if you have any questions or feedback regarding the current layout update.\n\n` +
        `Best regards,\nSpaceHead AI Studio`
      );
    } else if (type === "inquiry") {
      setSubject("Business Inquiry - SpaceHead Creative Studio");
      setBody(
        `Dear Team,\n\n` +
        `I am writing to inquire about your professional digital marketing and animated video production capabilities. We have seen your work and are highly interested in partnering on an upcoming product campaign.\n\n` +
        `Could you please share your typical timelines, design assets list, and engagement rates?\n\n` +
        `Looking forward to your response.\n\n` +
        `Sincerely,\nPotential Partner`
      );
    }
  };

  return (
    <div id="gmail-manager" className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            <h2 className="text-lg font-sans font-extrabold text-slate-900 tracking-tight">
              Gmail Workspace Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Read workspace messages, filter mailboxes, and compose dynamic HTML updates with business templates.
          </p>
        </div>

        {isConnected && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComposeModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <PenSquare className="w-4 h-4" />
              <span>Compose Email</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl transition-colors bg-white"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Login & Connect Panel */}
      {!isConnected ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Mail className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm px-4">
            <h3 className="text-sm font-bold text-slate-800">Authenticate Gmail API</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable your portfolio studio to send, receive, and manage Google Workspace emails directly. Safe, secure, and authenticated via Google.
            </p>
          </div>

          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="gsi-material-button hover:scale-[1.01] transition-transform shadow-md"
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents font-sans font-bold">Sign in with Google</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left Mailbox Nav & Search Column */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick search input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0"
              >
                Find
              </button>
            </form>

            {/* Folder Labels */}
            <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-3 space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 border-b border-slate-100">
                Mailboxes
              </span>

              {[
                { id: "INBOX", label: "Inbox", icon: Inbox, color: "text-blue-500" },
                { id: "SENT", label: "Sent Mail", icon: Send, color: "text-emerald-500" },
                { id: "STARRED", label: "Starred", icon: Star, color: "text-amber-500" },
                { id: "TRASH", label: "Trash", icon: Trash2, color: "text-rose-500" }
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveLabel(item.id);
                      setSelectedEmail(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLabel === item.id 
                        ? "bg-white text-slate-900 border border-slate-200 shadow-sm" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IconComp className={`w-4.5 h-4.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    {activeLabel === item.id && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                );
              })}

              <div className="pt-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 border-b border-slate-100">
                  Labels
                </span>
                <div className="max-h-28 overflow-y-auto pt-1.5 space-y-0.5">
                  {labels.length > 0 ? (
                    labels.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setActiveLabel(l.id);
                          setSelectedEmail(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium truncate flex items-center space-x-1.5 ${
                          activeLabel === l.id 
                            ? "bg-rose-50 text-rose-800 font-bold" 
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span>{l.name}</span>
                      </button>
                    ))
                  ) : (
                    <span className="block text-[10px] text-slate-400 px-3">No custom labels</span>
                  )}
                </div>
              </div>
            </div>

            {/* Email List Column Container */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Latest messages
                </span>
                <button 
                  onClick={() => fetchGmailData()}
                  className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center space-x-1 font-mono font-bold"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                  <span>REFRESH</span>
                </button>
              </div>

              {isLoading && emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                    Syncing Mail...
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {emails.map((email) => {
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <button
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all relative ${
                          isSelected 
                            ? "bg-rose-50/40 border-rose-200 ring-1 ring-rose-100" 
                            : "bg-white border-slate-150 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-extrabold text-xs text-slate-900 truncate max-w-[120px]">
                            {email.from.split("<")[0].trim() || email.from}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0 mt-0.5">
                            {email.date.split(",")[1]?.trim().slice(0, 11) || email.date.slice(0, 10)}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate mt-1">
                          {email.subject}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {email.snippet}
                        </p>
                      </button>
                    );
                  })}

                  {emails.length === 0 && (
                    <div className="py-12 text-center text-xs text-slate-400 font-mono border border-dashed border-slate-200 rounded-2xl">
                      No emails found in this mailbox.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Message View / Details Column */}
          <div className="lg:col-span-8">
            {selectedEmail ? (
              <div className="bg-slate-50/30 border border-slate-150 rounded-3xl p-5 sm:p-6 space-y-6 animate-in fade-in duration-200">
                
                {/* Header Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-150 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmail.labels.map(l => (
                      <span key={l} className="px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-700 text-[10px] font-mono font-bold tracking-wider uppercase">
                        {l}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleReply(selectedEmail)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>

                    <button
                      onClick={() => handleRequestDelete(selectedEmail)}
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-slate-400 transition-colors"
                      title="Move to Trash"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Sender Profile details */}
                <div className="space-y-3">
                  <h1 className="text-base sm:text-lg font-sans font-extrabold text-slate-900 tracking-tight">
                    {selectedEmail.subject}
                  </h1>

                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-9 h-9 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-700 font-bold uppercase shrink-0 mt-0.5">
                      {selectedEmail.from.charAt(0)}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-extrabold text-slate-900 break-all">{selectedEmail.from}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{selectedEmail.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">to: {selectedEmail.to || "me"}</p>
                    </div>
                  </div>
                </div>

                {/* Email HTML Body content */}
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm max-h-[380px] overflow-y-auto">
                  {selectedEmail.body.includes("<div") || selectedEmail.body.includes("<p") || selectedEmail.body.includes("<br") ? (
                    <div 
                      className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-xs text-slate-700 leading-relaxed font-sans">
                      {selectedEmail.body}
                    </p>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/10">
                <Mail className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700">No Email Selected</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mt-1">
                  Select any email from the left sidebar inbox pane to read details, view tags, or send replies.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Compose Email Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <PenSquare className="w-5 h-5 text-rose-500" />
                  <span>Compose Mail Update</span>
                </h3>
                <p className="text-[10px] text-slate-400">Send an authenticated email directly from your Workspace account.</p>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates Row */}
            <div className="space-y-2">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Quick marketing templates
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate("portfolio")}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 rounded-xl text-2xs font-bold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Portfolio Pitch</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate("update")}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 rounded-xl text-2xs font-bold transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Workspace Update Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate("inquiry")}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-2xs font-bold transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Client Inquiry</span>
                </button>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Recipient Email (To)</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Subject Header</label>
                <input
                  type="text"
                  required
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">Email Message Body (Supports plain text & automatically formats paragraph lines)</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write your email content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Deliverable Mail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Discard / Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Safety Confirm Trash modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-xl">
                <AlertCircle className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-none">Confirm Destructive Action</h3>
                <p className="text-[10px] text-rose-500 font-mono font-bold uppercase tracking-wider mt-1">Permanently Trash Cloud Message</p>
              </div>
            </div>

            <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p>You are trashing email subject:</p>
              <p className="font-semibold text-slate-950 font-mono break-all">{deleteTarget.subject}</p>
              <p className="text-xs text-slate-400 mt-2">This email will be removed from your Inbox and moved to Gmail Trash. It will be deleted permanently per Google auto-trash guidelines.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Move to Gmail Trash
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Alerts */}
      {errorMsg && (
        <div className="flex items-start space-x-2 bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{successMsg}</span>
        </div>
      )}

    </div>
  );
}
