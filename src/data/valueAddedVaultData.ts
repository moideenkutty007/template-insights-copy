import { 
  User, 
  Client, 
  Project, 
  Task, 
  TimeEntry 
} from "./valueAddedVaultSchema"

// Sample Users
export const users: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    role: "superAdmin",
    email: "john.smith@valueaddedvault.com",
    costRate: 75,
    department: "Management",
    position: "CEO",
    avatar: "/avatars/john-smith.jpg",
    weeklyCapacity: 40,
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    role: "manager",
    email: "sarah.johnson@valueaddedvault.com",
    costRate: 60,
    department: "Project Management",
    position: "Senior Project Manager",
    avatar: "/avatars/sarah-johnson.jpg",
    weeklyCapacity: 40,
  },
  {
    id: "user-3",
    name: "Michael Chen",
    role: "employee",
    email: "michael.chen@valueaddedvault.com",
    costRate: 45,
    department: "Development",
    position: "Senior Developer",
    avatar: "/avatars/michael-chen.jpg",
    weeklyCapacity: 40,
  },
  {
    id: "user-4",
    name: "Emily Davis",
    role: "employee",
    email: "emily.davis@valueaddedvault.com",
    costRate: 40,
    department: "Design",
    position: "UI/UX Designer",
    avatar: "/avatars/emily-davis.jpg",
    weeklyCapacity: 40,
  },
  {
    id: "user-5",
    name: "David Wilson",
    role: "employee",
    email: "david.wilson@valueaddedvault.com",
    costRate: 50,
    department: "Development",
    position: "Backend Developer",
    avatar: "/avatars/david-wilson.jpg",
    weeklyCapacity: 40,
  },
  {
    id: "user-6",
    name: "Jessica Brown",
    role: "employee",
    email: "jessica.brown@valueaddedvault.com",
    costRate: 45,
    department: "Marketing",
    position: "Marketing Specialist",
    avatar: "/avatars/jessica-brown.jpg",
    weeklyCapacity: 40,
  },
]

// Sample Clients
export const clients: Client[] = [
  {
    id: "client-1",
    name: "Acme Corporation",
    industry: "Technology",
    contactName: "Robert Johnson",
    contactEmail: "robert@acmecorp.com",
    contactPhone: "555-123-4567",
    status: "active",
  },
  {
    id: "client-2",
    name: "Global Innovations",
    industry: "Manufacturing",
    contactName: "Lisa Chen",
    contactEmail: "lisa@globalinnovations.com",
    contactPhone: "555-987-6543",
    status: "active",
  },
  {
    id: "client-3",
    name: "Bright Future Finance",
    industry: "Finance",
    contactName: "Mark Williams",
    contactEmail: "mark@brightfuture.com",
    contactPhone: "555-456-7890",
    status: "active",
  },
  {
    id: "client-4",
    name: "EcoSolutions",
    industry: "Environmental",
    contactName: "Anna Martinez",
    contactEmail: "anna@ecosolutions.com",
    contactPhone: "555-789-0123",
    status: "active",
  },
]

// Sample Projects
export const projects: Project[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    clientId: "client-1",
    managerId: "user-2",
    startDate: "2025-01-15",
    dueDate: "2025-05-30",
    status: "active",
    budget: 50000,
    revenue: 75000,
    description: "Complete redesign of the corporate website with new branding",
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    clientId: "client-1",
    managerId: "user-2",
    startDate: "2025-02-01",
    dueDate: "2025-07-15",
    status: "active",
    budget: 80000,
    revenue: 120000,
    description: "Development of a new mobile application for customer engagement",
  },
  {
    id: "project-3",
    name: "Financial System Integration",
    clientId: "client-3",
    managerId: "user-2",
    startDate: "2025-03-10",
    dueDate: "2025-06-30",
    status: "active",
    budget: 65000,
    revenue: 95000,
    description: "Integration of new financial reporting system with existing infrastructure",
  },
  {
    id: "project-4",
    name: "Marketing Campaign",
    clientId: "client-2",
    managerId: "user-2",
    startDate: "2025-01-05",
    dueDate: "2025-04-15",
    status: "completed",
    budget: 35000,
    revenue: 55000,
    description: "Q1 marketing campaign for new product launch",
  },
  {
    id: "project-5",
    name: "Sustainability Report",
    clientId: "client-4",
    managerId: "user-2",
    startDate: "2025-02-20",
    dueDate: "2025-04-30",
    status: "active",
    budget: 25000,
    revenue: 40000,
    description: "Development of annual sustainability report and dashboard",
  },
]

// Sample Tasks
export const tasks: Task[] = [
  // Website Redesign Tasks
  {
    id: "task-1",
    name: "Requirements Gathering",
    projectId: "project-1",
    assigneeIds: ["user-2", "user-4"],
    dueDate: "2025-02-01",
    status: "completed",
    estimatedHours: 40,
    priority: "high",
    description: "Gather and document all requirements for the website redesign",
  },
  {
    id: "task-2",
    name: "UI/UX Design",
    projectId: "project-1",
    assigneeIds: ["user-4"],
    dueDate: "2025-03-15",
    status: "completed",
    estimatedHours: 80,
    priority: "high",
    description: "Create wireframes and design mockups for all pages",
  },
  {
    id: "task-3",
    name: "Frontend Development",
    projectId: "project-1",
    assigneeIds: ["user-3"],
    dueDate: "2025-04-30",
    status: "inProgress",
    estimatedHours: 120,
    priority: "high",
    description: "Implement the frontend based on approved designs",
  },
  {
    id: "task-4",
    name: "Backend Development",
    projectId: "project-1",
    assigneeIds: ["user-5"],
    dueDate: "2025-04-30",
    status: "inProgress",
    estimatedHours: 100,
    priority: "high",
    description: "Implement backend services and APIs",
  },
  {
    id: "task-5",
    name: "Testing",
    projectId: "project-1",
    assigneeIds: ["user-3", "user-5"],
    dueDate: "2025-05-15",
    status: "todo",
    estimatedHours: 60,
    priority: "medium",
    description: "Perform comprehensive testing of the website",
  },
  
  // Mobile App Development Tasks
  {
    id: "task-6",
    name: "App Architecture Design",
    projectId: "project-2",
    assigneeIds: ["user-3", "user-5"],
    dueDate: "2025-02-28",
    status: "completed",
    estimatedHours: 60,
    priority: "high",
    description: "Design the architecture for the mobile application",
  },
  {
    id: "task-7",
    name: "UI/UX Design",
    projectId: "project-2",
    assigneeIds: ["user-4"],
    dueDate: "2025-03-30",
    status: "completed",
    estimatedHours: 100,
    priority: "high",
    description: "Create wireframes and design mockups for all app screens",
  },
  {
    id: "task-8",
    name: "iOS Development",
    projectId: "project-2",
    assigneeIds: ["user-3"],
    dueDate: "2025-05-30",
    status: "inProgress",
    estimatedHours: 200,
    priority: "high",
    description: "Develop the iOS version of the application",
  },
  {
    id: "task-9",
    name: "Android Development",
    projectId: "project-2",
    assigneeIds: ["user-5"],
    dueDate: "2025-05-30",
    status: "inProgress",
    estimatedHours: 200,
    priority: "high",
    description: "Develop the Android version of the application",
  },
  
  // Financial System Integration Tasks
  {
    id: "task-10",
    name: "Requirements Analysis",
    projectId: "project-3",
    assigneeIds: ["user-2", "user-5"],
    dueDate: "2025-03-25",
    status: "completed",
    estimatedHours: 50,
    priority: "high",
    description: "Analyze and document integration requirements",
  },
  {
    id: "task-11",
    name: "API Development",
    projectId: "project-3",
    assigneeIds: ["user-5"],
    dueDate: "2025-05-15",
    status: "inProgress",
    estimatedHours: 120,
    priority: "high",
    description: "Develop APIs for system integration",
  },
  
  // Marketing Campaign Tasks
  {
    id: "task-12",
    name: "Campaign Strategy",
    projectId: "project-4",
    assigneeIds: ["user-6"],
    dueDate: "2025-01-20",
    status: "completed",
    estimatedHours: 40,
    priority: "high",
    description: "Develop the marketing campaign strategy",
  },
  {
    id: "task-13",
    name: "Content Creation",
    projectId: "project-4",
    assigneeIds: ["user-6", "user-4"],
    dueDate: "2025-02-28",
    status: "completed",
    estimatedHours: 80,
    priority: "high",
    description: "Create all content for the campaign",
  },
  {
    id: "task-14",
    name: "Campaign Execution",
    projectId: "project-4",
    assigneeIds: ["user-6"],
    dueDate: "2025-03-31",
    status: "completed",
    estimatedHours: 60,
    priority: "high",
    description: "Execute the marketing campaign across all channels",
  },
  
  // Sustainability Report Tasks
  {
    id: "task-15",
    name: "Data Collection",
    projectId: "project-5",
    assigneeIds: ["user-2", "user-6"],
    dueDate: "2025-03-15",
    status: "completed",
    estimatedHours: 50,
    priority: "high",
    description: "Collect all required data for the sustainability report",
  },
  {
    id: "task-16",
    name: "Report Writing",
    projectId: "project-5",
    assigneeIds: ["user-6"],
    dueDate: "2025-04-15",
    status: "inProgress",
    estimatedHours: 70,
    priority: "high",
    description: "Write the sustainability report",
  },
  {
    id: "task-17",
    name: "Dashboard Development",
    projectId: "project-5",
    assigneeIds: ["user-3", "user-5"],
    dueDate: "2025-04-25",
    status: "todo",
    estimatedHours: 60,
    priority: "medium",
    description: "Develop an interactive dashboard for sustainability metrics",
  },
]

// Generate time entries for the past 30 days
const generateTimeEntries = (): TimeEntry[] => {
  const timeEntries: TimeEntry[] = [];
  const today = new Date();
  
  // For each task that's in progress or completed
  tasks
    .filter(task => task.status === "inProgress" || task.status === "completed")
    .forEach(task => {
      // For each assignee of the task
      task.assigneeIds.forEach(userId => {
        // Generate entries for the past 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          
          // Skip weekends
          if (date.getDay() === 0 || date.getDay() === 6) {
            continue;
          }
          
          // 70% chance of having a time entry for this day
          if (Math.random() < 0.7) {
            // Generate between 1-8 hours of work
            const duration = Math.max(1, Math.min(8, Math.round(Math.random() * 8)));
            
            timeEntries.push({
              id: `time-${timeEntries.length + 1}`,
              userId,
              taskId: task.id,
              projectId: task.projectId,
              date: date.toISOString().split('T')[0],
              duration,
              description: `Work on ${task.name}`,
              billable: Math.random() < 0.9, // 90% chance of being billable
            });
          }
        }
      });
    });
  
  return timeEntries;
};

export const timeEntries: TimeEntry[] = generateTimeEntries();