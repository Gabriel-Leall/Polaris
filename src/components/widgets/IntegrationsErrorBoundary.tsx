"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallbackText?: string;
  widgetName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class IntegrationsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in Integration Widget (${this.props.widgetName || 'Unknown'}):`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-destructive/20 bg-destructive/5 rounded-2xl space-y-4">
          <AlertCircle className="w-8 h-8 text-destructive opacity-80" />
          <div className="space-y-1 text-center">
            <h3 className="text-sm font-semibold text-destructive">
              {this.props.fallbackText || `Failed to load ${this.props.widgetName || 'widget'}`}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {this.state.error?.message || "An unexpected error occurred while communicating with the integration."}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleRetry}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
