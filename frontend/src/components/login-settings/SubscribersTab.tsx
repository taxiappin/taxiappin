import React, { useState } from "react";
import { Users, Download, Search, Copy, Check, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { SubscriberItem } from "./types";

interface SubscribersTabProps {
  subscribers: SubscriberItem[];
  setSubscribers: React.Dispatch<React.SetStateAction<SubscriberItem[]>>;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const SubscribersTab: React.FC<SubscribersTabProps> = ({
  subscribers,
  setSubscribers,
  setToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "rider" | "driver">("all");
  const [copied, setCopied] = useState(false);

  const filtered = subscribers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    const matchesRole = roleFilter === "all" || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Subscribed At"];
    const rows = filtered.map((s) => [s.id, s.name, s.email, s.phone, s.role, s.subscribedAt]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ show: true, message: `Exported ${filtered.length} subscribers to CSV`, type: "success" });
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `subscribers_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToast({ show: true, message: `Exported ${filtered.length} subscribers to JSON`, type: "success" });
  };

  // Copy Emails
  const handleCopyEmails = () => {
    const emails = filtered.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setToast({ show: true, message: "Copied subscriber email addresses to clipboard!", type: "info" });
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setToast({ show: true, message: "Subscriber removed", type: "info" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users size={18} className="text-amber-500" /> Promotional Offers & Updates Subscribers ({subscribers.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Users who opted into promotional communication during rider/driver registration.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyEmails}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy Emails"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-amber-500"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-amber-500"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* SEARCH & ROLE FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscribers by name, email, or phone..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <span className="text-xs font-extrabold text-slate-500 uppercase">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="rider">Riders Only</option>
              <option value="driver">Drivers Only</option>
            </select>
          </div>
        </div>

        {/* SUBSCRIBERS TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Subscriber Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Subscribed Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-900">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-extrabold">{sub.name}</td>
                  <td className="p-3.5 font-mono text-slate-700">{sub.email}</td>
                  <td className="p-3.5 font-mono text-slate-700">{sub.phone}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        sub.role === "driver" ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"
                      }`}
                    >
                      {sub.role}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{sub.subscribedAt}</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete Subscriber"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs font-bold text-slate-400">
                    No promotional subscribers found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
