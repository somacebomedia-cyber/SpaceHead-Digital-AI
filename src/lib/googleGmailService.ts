import { getCachedToken } from "./googleDriveService";

export interface GmailLabel {
  id: string;
  name: string;
  type: string;
  messagesTotal?: number;
  messagesUnread?: number;
}

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  internalDate: string;
  payload?: {
    mimeType: string;
    headers: GmailMessageHeader[];
    body: {
      size: number;
      data?: string;
    };
    parts?: any[];
  };
}

export interface ParsedEmail {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
}

/**
 * Decode Base64URL-encoded strings to standard UTF-8 text
 */
export const decodeBase64Url = (base64url: string): string => {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    try {
      return atob(base64);
    } catch (err) {
      return "Unable to decode email body.";
    }
  }
};

/**
 * Parse an raw Google API message representation into a simplified clean object
 */
export const parseGmailMessage = (message: GmailMessage): ParsedEmail => {
  const headers = message.payload?.headers || [];
  const getHeader = (name: string) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "";

  let body = "";
  if (message.payload) {
    if (message.payload.body?.data) {
      body = decodeBase64Url(message.payload.body.data);
    } else if (message.payload.parts) {
      const findBody = (parts: any[]): string => {
        for (const part of parts) {
          if (part.mimeType === "text/html" && part.body?.data) {
            return decodeBase64Url(part.body.data);
          }
          if (part.mimeType === "text/plain" && part.body?.data) {
            return decodeBase64Url(part.body.data);
          }
          if (part.parts) {
            const res = findBody(part.parts);
            if (res) return res;
          }
        }
        return "";
      };
      body = findBody(message.payload.parts);
    }
  }

  return {
    id: message.id,
    threadId: message.threadId,
    subject: getHeader("subject") || "(No Subject)",
    from: getHeader("from") || "(Unknown Sender)",
    to: getHeader("to") || "",
    date: getHeader("date") || "",
    snippet: message.snippet || "",
    body: body || message.snippet || "(No Content)",
    labels: message.labelIds || []
  };
};

/**
 * List the labels available in the user's mailbox
 */
export const listGmailLabels = async (): Promise<GmailLabel[]> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google access token not available. Please connect first.");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/labels", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to list Gmail labels.");
  }

  const data = await res.json();
  return data.labels || [];
};

/**
 * List message headers and snippets from Gmail (supporting custom queries like search, category, label)
 */
export const listGmailMessages = async (
  q?: string,
  maxResults: number = 20,
  pageToken?: string
): Promise<{ messages: { id: string; threadId: string }[]; nextPageToken?: string; resultSizeEstimate?: number }> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google access token not available. Please connect first.");

  const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  url.searchParams.append("maxResults", maxResults.toString());
  if (q) url.searchParams.append("q", q);
  if (pageToken) url.searchParams.append("pageToken", pageToken);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to list Gmail messages.");
  }

  return res.json();
};

/**
 * Fetch detailed content of a single message
 */
export const getGmailMessage = async (id: string): Promise<GmailMessage> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google access token not available.");

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to retrieve email content.");
  }

  return res.json();
};

/**
 * Base64URL-encode string safely
 */
const base64urlEncode = (str: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * Send an email on behalf of the user using standard RFC 2822
 */
export const sendGmailEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<{ id: string; threadId: string }> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google access token not available.");

  // Build a clean RFC 2822 plain text/HTML raw email structure
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    `<div>${body.replace(/\n/g, "<br />")}</div>`
  ];

  const rawEmail = base64urlEncode(emailLines.join("\r\n"));

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw: rawEmail })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to send email via Gmail.");
  }

  return res.json();
};

/**
 * Trash/delete a message (Mandatory confirm logic in component UI)
 */
export const deleteGmailMessage = async (id: string): Promise<void> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google access token not available.");

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to trash Gmail message.");
  }
};
