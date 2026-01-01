import { TaskItem } from "@/types";

const LOCAL_TASKS_KEY = "polaris-local-tasks";

export const getMockupTasks = (): TaskItem[] => [
  {
    id: "mock-1",
    label: "Review job applications",
    completed: false,
    userId: "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-2", 
    label: "Update LinkedIn profile",
    completed: true,
    userId: "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-3",
    label: "Prepare for technical interview",
    completed: false,
    userId: "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-4",
    label: "Send follow-up emails",
    completed: false,
    userId: "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-5",
    label: "Research company culture",
    completed: true,
    userId: "mock-user",
    createdAt: null,
    updatedAt: null,
  }
];

export const persistLocalTasks = (tasks: TaskItem[]) => {
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
};

export const loadLocalTasks = (): TaskItem[] => {
  if (typeof window === "undefined") {
    return getMockupTasks();
  }
  const raw = localStorage.getItem(LOCAL_TASKS_KEY);
  if (!raw) {
    return getMockupTasks();
  }
  try {
    const parsed = JSON.parse(raw) as TaskItem[];
    return parsed.length > 0 ? parsed : getMockupTasks();
  } catch {
    return getMockupTasks();
  }
};

export const generateTaskId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
};