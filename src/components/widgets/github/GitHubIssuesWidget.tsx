"use client";

import { useEffect, useState } from "react";
import { fetchGitHubIssues } from "@/app/actions/integrations";
import { useActiveIntegrationsStore } from "@/store/activeIntegrationsStore";
import { GitHubIcon } from "@/components/ui/icons";
import { AlertCircle, Clock, ExternalLink } from "lucide-react";
import { usePolling } from "@/hooks/usePolling";

export function GitHubIssuesWidget() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isGithubConnected = useActiveIntegrationsStore((state) => !!state.connections["github"]);

  useEffect(() => {
    if (!isGithubConnected) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;
    (async () => {
      setLoading(true);
      const res = await fetchGitHubIssues();
      if (isMounted) {
        if (res.success) {
          setIssues(res.data || []);
          setError(null);
        } else {
          setError(res.error || "Failed to load issues");
        }
        setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [isGithubConnected]);

  usePolling(
    fetchGitHubIssues,
    60000, // Poll every minute
    (res: any) => {
      if (res.success) {
        setIssues(res.data || []);
        setError(null);
      } else {
        setError(res.error || "Failed to update issues");
      }
    },
    (err: unknown) => {
      console.error("Polling error:", err);
    },
    isGithubConnected && !loading
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/5 mb-4 -mx-6 -mt-6">
        <div className="flex items-center gap-2">
          <GitHubIcon className="w-4 h-4 text-foreground/80" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">GitHub Issues</h2>
        </div>
        <div className="px-2 py-0.5 text-[10px] font-semibold rounded-sm bg-muted/30 text-muted-foreground border border-border/50">
          Updated
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative pr-2 -mr-2">
        {!isGithubConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
            <div className="p-3 bg-muted/20 rounded-full mb-3 opacity-50">
              <GitHubIcon className="w-6 h-6 text-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Not Connected</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Connect your GitHub account in Settings to see your open issues here.
            </p>
          </div>
        )}

        {isGithubConnected && loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-muted/10 border border-border/30 animate-pulse">
                <div className="h-4 bg-muted/40 rounded w-3/4"></div>
                <div className="h-3 bg-muted/40 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {isGithubConnected && !loading && error && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        {isGithubConnected && !loading && !error && issues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
            <p className="text-sm text-foreground font-medium">No open issues</p>
            <p className="text-xs text-muted-foreground mt-1">You&apos;re all caught up!</p>
          </div>
        )}

        {isGithubConnected && !loading && !error && issues.length > 0 && (
          <div className="flex flex-col gap-2">
            {issues.map(issue => (
              <a 
                key={issue.id} 
                href={issue.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col p-3 rounded-lg bg-background/40 hover:bg-muted/30 border border-border/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h4 className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {issue.title}
                  </h4>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-auto">
                  <span className="px-1.5 py-0.5 rounded text-foreground/70 bg-muted border border-border/50 truncate max-w-[100px]">
                    {issue.repo}
                  </span>
                  <span className="flex items-center gap-1 opacity-70">
                    <Clock className="w-3 h-3" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-primary/70 font-mono opacity-80 decoration-primary/30 group-hover:underline">#{issue.number}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
