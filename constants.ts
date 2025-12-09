import { EmailItem, ProjectItem, TaskItem } from './types';

export const MOCK_EMAILS: EmailItem[] = [
  {
    id: 'e1',
    companyName: 'Stripe',
    companyDomain: 'stripe.com',
    subject: 'Interview Invitation - Frontend Engineer',
    snippet: 'Hi, we would like to invite you to the onsite interview round next Tuesday...',
    status: 'Interview',
    receivedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: 'e2',
    companyName: 'Vercel',
    companyDomain: 'vercel.com',
    subject: 'Application Received: Senior React Dev',
    snippet: 'Thanks for applying to Vercel. We have received your application and will review...',
    status: 'Applied',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: 'e3',
    companyName: 'Airbnb',
    companyDomain: 'airbnb.com',
    subject: 'Update on your application',
    snippet: 'Thank you for your interest. Unfortunately, we have decided to move forward with...',
    status: 'Rejected',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'e4',
    companyName: 'Linear',
    companyDomain: 'linear.app',
    subject: 'Coding Challenge',
    snippet: 'Here is the link to your take-home assignment. Please complete it within 48 hours.',
    status: 'Interview',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day ago
  },
  {
    id: 'e5',
    companyName: 'Netflix',
    companyDomain: 'netflix.com',
    subject: 'Thanks for applying',
    snippet: 'Your application for the Senior UI Engineer role has been submitted successfully.',
    status: 'Applied',
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];

export const MOCK_TASKS: TaskItem[] = [
  { id: 't1', label: 'Complete Linear take-home', completed: false, dueDate: 'Tomorrow' },
  { id: 't2', label: 'Reply to Stripe recruiter', completed: true },
  { id: 't3', label: 'Update portfolio with new case study', completed: false },
  { id: 't4', label: 'Research Vercel interview questions', completed: false },
];

export const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    name: 'Portfolio Redesign',
    progress: 75,
    totalTasks: 12,
    completedTasks: 9,
    deadline: 'Oct 24'
  },
  {
    id: 'p2',
    name: 'SaaS Dashboard Kit',
    progress: 30,
    totalTasks: 20,
    completedTasks: 6,
    deadline: 'Nov 01'
  }
];
