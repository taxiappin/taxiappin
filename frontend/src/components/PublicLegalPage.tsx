import React, { useState, useMemo } from 'react';
import { FileText, Printer, ArrowLeft, Search, Mail, ShieldAlert, FileCheck, HelpCircle, ExternalLink } from 'lucide-react';
import { PlatformConfig } from '../types';

interface PublicLegalPageProps {
  config: PlatformConfig;
  initialPageId: string;
  onNavigate: (path: string) => void;
}

export const PublicLegalPage: React.FC<PublicLegalPageProps> = ({
  config,
  initialPageId,
  onNavigate,
}) => {
  const [activePageId, setActivePageId] = useState(initialPageId);
  const [searchQuery, setSearchQuery] = useState("");

  const pagesList = useMemo(() => {
    if (!config?.pages || !Array.isArray(config.pages)) return [];
    return config.pages
      .filter((p: any) => p.status === 'Active')
      .map((p: any) => {
        let icon = FileText;
        let color = 'text-indigo-500 bg-indigo-50 border-indigo-100';
        let desc = 'Review custom policy guidelines and documents.';
        
        if (p.id === 'page_1') {
          icon = FileText;
          color = 'text-rose-500 bg-rose-50 border-rose-100';
          desc = 'Review user rules, system guidelines, and agreements.';
        } else if (p.id === 'page_2') {
          icon = FileCheck;
          color = 'text-emerald-500 bg-emerald-50 border-emerald-100';
          desc = 'Learn about personal data encryption, GPS logging, and privacy shield.';
        } else if (p.id === 'page_3') {
          icon = ShieldAlert;
          color = 'text-amber-500 bg-amber-50 border-amber-100';
          desc = 'Understand cancellation fees, wrong charges, and wallet payouts.';
        }
        
        return {
          id: p.id,
          title: p.title,
          path: p.slug || `/${p.title.toLowerCase().trim()}`,
          icon,
          color,
          desc
        };
      });
  }, [config.pages]);

  const activePageData = useMemo(() => {
    const defaultPage = config.pages?.find(p => p.id === activePageId);
    if (defaultPage) return defaultPage;
    return config.pages?.find(p => p.id === initialPageId) || config.pages?.[0];
  }, [config.pages, activePageId, initialPageId]);

  const handlePageSelect = (pageId: string, path: string) => {
    setActivePageId(pageId);
    onNavigate(path);
  };

  const handlePrint = () => {
    window.print();
  };

  // Simple text search filter highlighting
  const highlightedContent = useMemo(() => {
    if (!activePageData?.content) return "";
    if (!searchQuery.trim()) return activePageData.content;

    // Escaping query for safety
    const safeQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    
    // Simple replacement outside of HTML tag boundaries where possible
    // Note: To avoid breaking HTML tags, we split by tags and match only in text nodes.
    const parts = activePageData.content.split(/(<[^>]+>)/);
    return parts.map(part => {
      if (part.startsWith("<") && part.endsWith(">")) {
        return part; // keep tag unchanged
      }
      return part.replace(regex, `<mark class="bg-yellow-200 text-slate-900 font-semibold px-0.5 rounded">$1</mark>`);
    }).join("");
  }, [activePageData, searchQuery]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      const fromSignUp = sessionStorage.getItem("taxiapp_signup_mode") === "true";
      onNavigate(fromSignUp ? "/register" : "/");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 antialiased overflow-hidden">
      {/* Compact Header for inside frame */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 px-4 h-14 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-[11px] tracking-wider uppercase text-slate-900 font-mono">
              {config.general?.platformName || "TaxiApp"}
            </span>
            <span className="text-[8px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-500 font-mono font-bold uppercase tracking-wider">
              Legal Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
            title="Print Document"
          >
            <Printer size={13} />
          </button>
          <button
            onClick={() => onNavigate("/")}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 text-white hover:bg-slate-900 transition-all cursor-pointer"
            title="Open App"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </header>

      {/* Main content viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {/* Horizontal scrollable policy tabs (Mobile/Frame friendly) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200/50 print:hidden">
          {pagesList.map((pg) => {
            const isActive = activePageId === pg.id;
            return (
              <button
                key={pg.id}
                onClick={() => handlePageSelect(pg.id, pg.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 border-slate-950 text-white shadow-3xs'
                    : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-600 hover:text-slate-800'
                }`}
              >
                <pg.icon size={11} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{pg.title}</span>
              </button>
            );
          })}
        </div>

        {/* Search bar card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-3xs space-y-2 print:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this policy..."
              className="w-full pl-9 pr-14 py-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-slate-400 transition-all bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-extrabold text-slate-400 hover:text-slate-600 bg-slate-100 px-1 py-0.5 rounded"
              >
                CLEAR
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold font-mono">
            <span>LAST UPDATE:</span>
            <span className="bg-slate-100 border border-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded">
              {activePageData?.lastUpdated || "Jan 10, 2026"}
            </span>
          </div>
        </div>

        {/* Legal Document Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs relative overflow-hidden">
          {/* Ambient subtle background accent watermark */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[40px] -z-10 flex items-center justify-center font-black text-slate-100 text-3xl select-none">
            §
          </div>

          <article className="prose prose-slate max-w-none text-slate-700 font-sans leading-relaxed text-[11px] prose-sm">
            {activePageData ? (
              <div 
                className="space-y-3 prose-headings:font-black prose-headings:text-slate-900 prose-headings:uppercase prose-headings:tracking-tight prose-headings:mt-4 prose-headings:mb-1.5 prose-p:mb-2 prose-ul:list-disc prose-ul:pl-4 prose-li:mb-1"
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
              />
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <p className="text-xs font-black">Document Not Found</p>
                <p className="text-[10px] font-medium">Please select a valid policy from the tabs above.</p>
              </div>
            )}
          </article>
        </div>

        {/* Contact support Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl text-white space-y-3 border border-slate-800 shadow-sm print:hidden">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-100">Need legal assistance?</h3>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              If you have queries regarding our policy enforcement or data privacy protection, reach our legal desk.
            </p>
          </div>
          <a
            href={`mailto:${config.general?.contactEmail || 'ops@taxiapp.com'}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-100 transition-colors cursor-pointer"
          >
            <Mail size={11} /> Contact Desk
          </a>
        </div>

        {/* Footer info inside scroll area */}
        <div className="py-4 text-center text-[9px] text-slate-400 font-bold border-t border-slate-200/60 font-mono">
          <span>© {new Date().getFullYear()} {config.general?.platformName || "TaxiApp"} • All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
};
