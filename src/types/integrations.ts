export type IntegrationProvider = "github" | "slack";

export type IntegrationStatus =
  | "connected"
  | "disconnected"
  | "loading"
  | "error";

export interface IntegrationConnection {
  id: string;
  userId: string;
  provider: IntegrationProvider;
  tokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  // We explicitly omit raw tokens from client-side types for security
}

export interface ProviderConfig {
  id: IntegrationProvider;
  name: string;
  description: string;
  iconName: string; // To match an icon component like GitHubIcon or SlackIcon
  isComingSoon?: boolean;
}

export const SUPPORTED_INTEGRATIONS: ProviderConfig[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Sync PRs, issues and activity to your workspace.",
    iconName: "GitHubIcon",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Connect channels, DMs and mentions.",
    iconName: "SlackIcon",
  },
];

export interface ExternalWidgetConfig {
  id: string;
  connectionId: string;
  widgetType: string;
  queryParams: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}
