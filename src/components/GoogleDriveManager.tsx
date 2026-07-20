import { useState, useEffect, useRef, useTransition, DragEvent, ChangeEvent, FormEvent } from "react";
import { 
  Folder, 
  File, 
  Search, 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ArrowLeft, 
  RefreshCw, 
  Database, 
  FileJson, 
  ChevronRight, 
  DownloadCloud, 
  AlertCircle, 
  CloudCheck, 
  Loader2,
  FileText,
  Import
} from "lucide-react";
import { 
  listDriveFiles, 
  createDriveFolder, 
  deleteDriveFile, 
  uploadDriveFile, 
  uploadJsonToDrive, 
  connectGoogleDrive, 
  getCachedToken, 
  setCachedToken, 
  DriveFile,
  getDriveFileContent
} from "../lib/googleDriveService";
import { Project, BlogPost } from "../types";

interface GoogleDriveManagerProps {
  projects: Project[];
  blogs: BlogPost[];
  onImportBlog?: (title: string, content: string, summary: string) => void;
}

export default function GoogleDriveManager({ 
  projects, 
  blogs,
  onImportBlog 
}: GoogleDriveManagerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Navigation stack
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([
    { id: "root", name: "My Drive" }
  ]);
  const currentFolder = folderStack[folderStack.length - 1];

  // Files data
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modals & inputs state
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Destructive operations safety confirm
  const [deleteTarget, setDeleteTarget] = useState<DriveFile | null>(null);

  // Load state on mount/cached check
  useEffect(() => {
    const token = getCachedToken();
    if (token) {
      setIsConnected(true);
      fetchCurrentFiles(currentFolder.id);
    }
  }, [currentFolder.id]);

  // Fetch file list
  const fetchCurrentFiles = async (folderId: string, search?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await listDriveFiles(folderId, search);
      setFiles(data.files || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to retrieve files. Connection might be stale.");
      if (err.message?.includes("stale") || err.message?.includes("token") || err.message?.includes("unauthorized") || err.message?.includes("connected")) {
        setIsConnected(false);
        setCachedToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google authentication
  const handleConnect = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const result = await connectGoogleDrive();
      if (result.token) {
        setIsConnected(true);
        setSuccessMsg("Successfully authenticated with Google Drive!");
        // Fetch files for current folder path
        const folderId = currentFolder.id;
        const data = await listDriveFiles(folderId);
        setFiles(data.files || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "OAuth Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect Drive
  const handleDisconnect = () => {
    setCachedToken(null);
    setIsConnected(false);
    setFiles([]);
    setFolderStack([{ id: "root", name: "My Drive" }]);
    setSuccessMsg("Google Drive disconnected successfully.");
  };

  // Handle folder navigation click
  const handleFolderClick = (folder: DriveFile) => {
    setFolderStack([...folderStack, { id: folder.id, name: folder.name }]);
  };

  // Handle Breadcrumb jump
  const handleBreadcrumbClick = (idx: number) => {
    const updatedStack = folderStack.slice(0, idx + 1);
    setFolderStack(updatedStack);
  };

  // Create folder action
  const handleCreateFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await createDriveFolder(newFolderName.trim(), currentFolder.id);
      setNewFolderName("");
      setShowFolderModal(false);
      setSuccessMsg(`Folder "${newFolderName}" created successfully.`);
      fetchCurrentFiles(currentFolder.id);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create folder.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchCurrentFiles(currentFolder.id, searchQuery);
  };

  // Handle Drag & Drop uploading
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    await uploadMultipleFiles(droppedFiles);
  };

  // Handle manual file selection
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    await uploadMultipleFiles(selectedFiles);
  };

  // Core uploader
  const uploadMultipleFiles = async (fileList: FileList) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    let successCount = 0;
    
    try {
      for (let i = 0; i < fileList.length; i++) {
        await uploadDriveFile(fileList[i], currentFolder.id);
        successCount++;
      }
      setSuccessMsg(`Successfully uploaded ${successCount} file(s) to Google Drive.`);
      fetchCurrentFiles(currentFolder.id);
    } catch (err: any) {
      setErrorMsg(err.message || "Error uploading files.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Action triggers confirmation modal
  const handleRequestDelete = (file: DriveFile) => {
    setDeleteTarget(file);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await deleteDriveFile(deleteTarget.id);
      setSuccessMsg(`"${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchCurrentFiles(currentFolder.id);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete file.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create workspace backup
  const handleWorkspaceBackup = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const backupPayload = {
        timestamp: Date.now(),
        date: new Date().toISOString(),
        projects,
        blogs
      };
      const filename = `spacehead-workspace-backup-${new Date().toISOString().slice(0,10)}.json`;
      await uploadJsonToDrive(filename, backupPayload, currentFolder.id);
      setSuccessMsg(`Workspace index backup saved as "${filename}" in Drive.`);
      fetchCurrentFiles(currentFolder.id);
    } catch (err: any) {
      setErrorMsg(err.message || "Workspace backup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Import blog content helper
  const handleImportContent = async (file: DriveFile) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const text = await getDriveFileContent(file.id);
      
      // Basic parser
      let title = file.name.replace(/\.[^/.]+$/, ""); // strip extension
      let content = text;
      let summary = text.slice(0, 150) + "...";

      // If it looks like JSON backup, handle selectively
      if (file.mimeType === "application/json" || file.name.endsWith(".json")) {
        try {
          const parsed = JSON.parse(text);
          if (parsed.title && parsed.content) {
            title = parsed.title;
            content = parsed.content;
            summary = parsed.summary || summary;
          } else if (parsed.blogs && parsed.blogs.length > 0) {
            // Pick first blog
            title = parsed.blogs[0].title;
            content = parsed.blogs[0].content;
            summary = parsed.blogs[0].summary || summary;
          }
        } catch(e) {
          // Fallback to text parsing
        }
      }

      if (onImportBlog) {
        onImportBlog(title, content, summary);
        setSuccessMsg(`Imported file "${file.name}"! Form updated in Blogs panel.`);
      } else {
        setSuccessMsg(`Read content successfully (${text.length} chars). Paste manually or check Blog Tab.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mime types helper icons
  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      return <Folder className="w-5.5 h-5.5 text-amber-500 fill-amber-500/20 shrink-0" />;
    }
    if (mimeType.includes("json") || name.endsWith(".json")) {
      return <FileJson className="w-5.5 h-5.5 text-teal-600 shrink-0" />;
    }
    if (mimeType.includes("text") || mimeType.includes("document") || name.endsWith(".md") || name.endsWith(".txt")) {
      return <FileText className="w-5.5 h-5.5 text-blue-500 shrink-0" />;
    }
    return <File className="w-5.5 h-5.5 text-slate-400 shrink-0" />;
  };

  const formatBytes = (bytes?: string | number) => {
    if (!bytes) return "—";
    const num = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
    if (isNaN(num)) return "—";
    if (num < 1024) return num + " B";
    if (num < 1048576) return (num / 1024).toFixed(1) + " KB";
    return (num / 1048576).toFixed(1) + " MB";
  };

  return (
    <div id="drive-manager" className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            <h2 className="text-lg font-sans font-extrabold text-slate-900 tracking-tight">
              Google Drive Cloud Storage
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Export backups, store files, and import markdown assets directly from your Drive workspace.
          </p>
        </div>

        {isConnected && (
          <button
            onClick={handleDisconnect}
            className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-colors bg-white self-start"
          >
            Disconnect Drive
          </button>
        )}
      </div>

      {/* Connection State Panel */}
      {!isConnected ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <DownloadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm px-4">
            <h3 className="text-sm font-bold text-slate-800">Connect Google Workspace API</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable your portfolio studio to sync files securely. Authenticate with Google to configure workspace backups and asset imports.
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
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Action Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search current folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0"
              >
                Search
              </button>
            </form>

            {/* Studio Commands Panel */}
            <div className="flex flex-wrap gap-2 md:justify-end items-center">
              <button
                onClick={handleWorkspaceBackup}
                disabled={isLoading}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Database className="w-4 h-4" />
                <span>Backup Portfolio to Drive</span>
              </button>

              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Folder</span>
              </button>

              <button
                onClick={() => fetchCurrentFiles(currentFolder.id)}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                title="Refresh File List"
              >
                <RefreshCw className={`w-4.5 h-4.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* New Folder Modal Inlined for Cleanliness */}
          {showFolderModal && (
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl animate-in slide-in-from-top duration-200 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase">Create New Drive Directory</h4>
              <form onSubmit={handleCreateFolder} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
              dragOver 
                ? "border-blue-500 bg-blue-50/20" 
                : "border-slate-200 hover:border-slate-300 bg-slate-50/20"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className={`w-7 h-7 ${dragOver ? "text-blue-500" : "text-slate-400"}`} />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-700">
                Drag and drop files here, or <span className="text-blue-600 underline">browse</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Supports multiple uploads instantly</p>
            </div>
          </div>

          {/* Breadcrumb Path Stack */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 bg-slate-50/50 px-4 py-2.5 rounded-xl border border-slate-100">
            {folderStack.map((item, idx) => (
              <div key={item.id} className="flex items-center space-x-1">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                <button
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={`font-semibold transition-colors focus:outline-none ${
                    idx === folderStack.length - 1 
                      ? "text-slate-700 pointer-events-none" 
                      : "hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>

          {/* File Lists / Table */}
          {isLoading && files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                Accessing Cloud Index...
              </span>
            </div>
          ) : (
            <div className="bg-slate-50/20 border border-slate-150 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 pl-5">Name</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Last Modified</th>
                      <th className="p-4 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Render Folders First */}
                    {files.map((file) => {
                      const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                      const isImportable = !isFolder && (
                        file.name.endsWith(".md") || 
                        file.name.endsWith(".txt") || 
                        file.name.endsWith(".json")
                      );

                      return (
                        <tr key={file.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                          <td className="p-4 pl-5">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.mimeType, file.name)}
                              {isFolder ? (
                                <button
                                  onClick={() => handleFolderClick(file)}
                                  className="font-semibold text-slate-900 hover:text-blue-600 text-left focus:outline-none"
                                >
                                  {file.name}
                                </button>
                              ) : (
                                <span className="font-semibold text-slate-700 max-w-xs truncate">{file.name}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-xs font-mono text-slate-400">
                            {isFolder ? "Directory" : file.mimeType.split("/")[1] || "Binary"}
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {isFolder ? "—" : formatBytes(file.size)}
                          </td>
                          <td className="p-4 text-xs font-mono text-slate-500">
                            {new Date(file.modifiedTime).toLocaleDateString()}
                          </td>
                          <td className="p-4 pr-5 text-right space-x-1 shrink-0">
                            {isImportable && (
                              <button
                                onClick={() => handleImportContent(file)}
                                className="p-1.5 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-slate-400 transition-colors"
                                title="Import Content as Blog Post"
                              >
                                <Import className="w-4 h-4" />
                              </button>
                            )}

                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-1.5 hover:bg-slate-100 hover:text-blue-600 rounded-lg text-slate-400 transition-colors"
                                title="Open in Google Drive"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}

                            <button
                              onClick={() => handleRequestDelete(file)}
                              className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-colors"
                              title="Delete File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {files.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-xs text-slate-400 font-mono">
                          This directory is empty. Use backup or drop files here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Safety confirmation overlay (MANDATORY per user intent & guidelines) */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-xl">
                <AlertCircle className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-none">Confirm Destructive Deletion</h3>
                <p className="text-[10px] text-rose-500 font-mono font-bold uppercase tracking-wider mt-1">Permanently Removing Cloud File</p>
              </div>
            </div>

            <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p>You are requesting to delete:</p>
              <p className="font-semibold text-slate-950 font-mono break-all">{deleteTarget.name}</p>
              <p className="text-xs text-slate-400 mt-2">This file will be deleted from your Google Drive permanently. This operation cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Permanently Delete File
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel / Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {errorMsg && (
        <div className="flex items-start space-x-2 bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <CloudCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{successMsg}</span>
        </div>
      )}
    </div>
  );
}
