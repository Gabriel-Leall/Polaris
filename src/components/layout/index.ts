// Layout Components
// Structural components for page organization (Server Components by default)
// Examples: ActivityBar, DynamicSidebar, DashboardLayout

// New Activity Bar system (Obsidian-style)
export { default as ActivityBar } from "./ActivityBar";
export { default as ActivityBarNav } from "./ActivityBarNav";
export { default as DynamicSidebar } from "./DynamicSidebar";

// Legacy Sidebar (deprecated - will be removed)
export { default as Sidebar } from "./Sidebar";
export { default as SidebarNav, SidebarUser } from "./SidebarNav";

// Core Layout
export { default as BentoGrid } from "./BentoGrid";
export { default as DashboardLayout } from "./DashboardLayout";
export { default as GridColumn } from "./GridColumn";
export { default as WidgetCard } from "./WidgetCard";
export { ZenModeBlurWrapper } from "./ZenModeBlurWrapper";

// Magic UI Enhanced Components
export { PolarisGrid, GridColumn as PolarisGridColumn } from "./AxisGrid";
