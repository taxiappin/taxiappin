import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Send, CheckCircle2 } from "lucide-react";
import { logAppError } from "../lib/errorLogger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  reportSent: boolean;
  reportNotes: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    reportSent: false,
    reportNotes: '',
  };

  public static getDerivedStateFromError(error: unknown): State {
    const err = error instanceof Error ? error : new Error(String(error || 'Unknown application error'));
    return { hasError: true, error: err, errorInfo: null, reportSent: false, reportNotes: '' };
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    const err = error instanceof Error ? error : new Error(String(error || 'Unknown application error'));
    this.setState({
      error: err,
      errorInfo,
    });
    console.warn("[App Error Boundary caught exception]:", err, errorInfo);
    try {
      logAppError({
        errorName: err.name || 'Application Render Error',
        errorMessage: err.message || 'React component render caught exception',
        stackTrace: `${err.stack || ''}\nComponent Stack:\n${errorInfo?.componentStack || ''}`,
        severity: 'critical',
        section: 'React Component Tree Render',
        source: 'Auto Application Capture'
      });
    } catch (errLog) {
      console.warn('Failed to dispatch error log:', errLog);
    }
  }

  private handleSendReportToAdmin = () => {
    if (!this.state.error) return;
    try {
      logAppError({
        errorName: this.state.error.name || 'User Reported Screen Error',
        errorMessage: this.state.error.message || 'User explicitly submitted an error report from error dialog window.',
        stackTrace: `${this.state.error.stack || ''}\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`,
        severity: 'high',
        section: 'User Screen Error Box',
        source: 'User Submitted Report',
        userNotes: this.state.reportNotes || 'User clicked "Send this report to admin" from error dialog window.'
      });
      this.setState({ reportSent: true });
    } catch (err) {
      console.error('Failed to submit user report to admin:', err);
    }
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, reportSent: false });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-root" className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
          <div className="w-full max-w-md bg-white border border-[#EBE5DB] rounded-3xl p-8 shadow-[0_24px_48px_rgba(235,229,219,0.4)] text-center space-y-6 animate-fade-in">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-amber-100/50">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                Something didn't launch right
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                An issue occurred on this screen. You can send this report directly to admin to be fixed.
              </p>
            </div>

            {/* Diagnostic Box */}
            {this.state.error && (
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 max-h-36 overflow-y-auto font-mono text-[10px] text-slate-600 space-y-1 scrollbar-thin">
                <span className="font-bold text-rose-500 text-[11px] uppercase block">
                  Error Diagnostic:
                </span>
                <span className="break-words font-medium text-slate-700">
                  {this.state.error.toString()}
                </span>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[9px] text-slate-400 mt-2 overflow-x-auto whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack.split("\n").slice(0, 4).join("\n")}
                  </pre>
                )}
              </div>
            )}

            {/* SEND REPORT TO ADMIN BUTTON / CONFIRMATION */}
            {this.state.reportSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Report sent to Admin! Listed in Admin Errors Page.</span>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <textarea
                  rows={2}
                  value={this.state.reportNotes}
                  onChange={(e) => this.setState({ reportNotes: e.target.value })}
                  placeholder="Optional: Add what you were doing when error happened..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  id="btn-send-report-admin"
                  onClick={this.handleSendReportToAdmin}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send this report to admin
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
              <button
                id="btn-error-reset"
                onClick={this.handleReset}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Application
              </button>
              <button
                id="btn-error-home"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null, reportSent: false });
                  window.location.reload();
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Try Fresh Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
