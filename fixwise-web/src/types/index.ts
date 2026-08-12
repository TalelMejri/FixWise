// src/types/index.ts

export interface Category {
  name: string
  color: string
}

export interface Member {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Member' | 'Technician' | 'Viewer'
}

export interface Workspace {
  id: string
  name: string
  type: 'Personal' | 'Family' | 'Business'
  members: Member[]
}

export interface Asset {
  id: string
  workspaceId: string
  name: string
  category: string
  brand: string
  model: string
  serial: string
  purchaseDate: string
  warrantyEnd: string
  location: string
  status: 'Active' | 'UnderRepair' | 'Archived' | 'Disposed'
}

export interface MaintenanceLog {
  id: string
  workspaceId: string
  assetId: string
  title: string
  type: 'Preventive' | 'Corrective' | 'Inspection' | 'Cleaning' | 'DIY' | 'Installation' | 'Replacement'
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled'
  performedDate: string
  cost: number
  durationMinutes: number
  notes: string
  aiSummary: string
  materials: Material[]
}

export interface Material {
  id: string
  name: string
  quantity: number
  unit: string
  unitCost: number
}

export interface Reminder {
  id: string
  workspaceId: string
  assetId: string
  title: string
  frequencyType: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'EveryXMonths' | 'EveryXWeeks'
  frequencyValue: number
  dueDate: string
  completed: boolean
}

export interface DiyProject {
  id: string
  workspaceId: string
  assetId?: string
  title: string
  goal: string
  status: 'Planning' | 'InProgress' | 'Completed' | 'OnHold' | 'Cancelled'
  priority: 'Low' | 'Medium' | 'High'
  budget: number
  experience: 'Beginner' | 'Intermediate' | 'Advanced'
  aiPlan: string
  tasks: DiyTask[]
}

export interface DiyTask {
  id: string
  title: string
  status: 'Pending' | 'InProgress' | 'Completed'
  completedAt?: string
}

export interface Recommendation {
  id: string
  assetId: string
  title: string
  description: string
  action: string
  urgency: 'Low' | 'Medium' | 'High' | 'Critical'
}

export interface AppNotification {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

// Helper function for dates
const iso = (daysFromNow: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().slice(0, 10)
}

// Categories
export const CATEGORIES: Category[] = [
  { name: 'Appliances', color: '#e87a00' },
  { name: 'Vehicles', color: '#3b82f6' },
  { name: 'Electronics', color: '#8b5cf6' },
  { name: 'Tools', color: '#10b981' },
  { name: 'Furniture', color: '#f59e0b' },
  { name: 'Plumbing', color: '#06b6d4' },
  { name: 'HVAC', color: '#ec4899' },
  { name: 'Garden', color: '#84cc16' },
]

// Workspaces
export const WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Home',
    type: 'Personal',
    members: [
      { id: 'u-1', name: 'Alex Rivera', email: 'demo@fixwise.app', role: 'Owner' },
      { id: 'u-2', name: 'Sam Doe', email: 'sam@fixwise.app', role: 'Member' },
      { id: 'u-3', name: 'Toni Fix', email: 'toni@fixwise.app', role: 'Technician' },
    ],
  },
  {
    id: 'ws-2',
    name: 'Rivera Family',
    type: 'Family',
    members: [
      { id: 'u-1', name: 'Alex Rivera', email: 'demo@fixwise.app', role: 'Owner' },
    ],
  },
  {
    id: 'ws-3',
    name: 'Northside Workshop',
    type: 'Business',
    members: [
      { id: 'u-1', name: 'Alex Rivera', email: 'demo@fixwise.app', role: 'Owner' },
      { id: 'u-4', name: 'Jo Park', email: 'jo@fixwise.app', role: 'Viewer' },
    ],
  },
]

// Assets
export const ASSETS: Asset[] = [
  {
    id: 'a-1',
    workspaceId: 'ws-1',
    name: 'Washing Machine',
    category: 'Appliances',
    brand: 'Bosch',
    model: 'WAN28281',
    serial: 'BSH-9921-KL',
    purchaseDate: '2022-03-14',
    warrantyEnd: '2027-03-14',
    location: 'Laundry room',
    status: 'Active',
  },
  {
    id: 'a-2',
    workspaceId: 'ws-1',
    name: 'Family SUV',
    category: 'Vehicles',
    brand: 'Toyota',
    model: 'RAV4 Hybrid',
    serial: 'VIN-4T3W11RF',
    purchaseDate: '2021-08-02',
    warrantyEnd: '2026-08-02',
    location: 'Garage',
    status: 'Active',
  },
  {
    id: 'a-3',
    workspaceId: 'ws-1',
    name: 'Gas Boiler',
    category: 'HVAC',
    brand: 'Vaillant',
    model: 'ecoTEC Plus',
    serial: 'VL-33-882',
    purchaseDate: '2019-11-20',
    warrantyEnd: '2024-11-20',
    location: 'Basement',
    status: 'UnderRepair',
  },
  {
    id: 'a-4',
    workspaceId: 'ws-1',
    name: 'Lawn Mower',
    category: 'Garden',
    brand: 'Honda',
    model: 'HRX217',
    serial: 'HN-2210-A',
    purchaseDate: '2020-05-09',
    warrantyEnd: '2023-05-09',
    location: 'Shed',
    status: 'Active',
  },
  {
    id: 'a-5',
    workspaceId: 'ws-1',
    name: 'Espresso Machine',
    category: 'Appliances',
    brand: 'Gaggia',
    model: 'Classic Pro',
    serial: 'GG-771-XR',
    purchaseDate: '2023-01-28',
    warrantyEnd: '2025-01-28',
    location: 'Kitchen',
    status: 'Active',
  },
  {
    id: 'a-6',
    workspaceId: 'ws-1',
    name: 'Desktop Workstation',
    category: 'Electronics',
    brand: 'Dell',
    model: 'Precision 3660',
    serial: 'DL-6603-QQ',
    purchaseDate: '2023-09-11',
    warrantyEnd: '2026-09-11',
    location: 'Office',
    status: 'Archived',
  },
]

// Maintenance Logs
export const LOGS: MaintenanceLog[] = [
  {
    id: 'l-1',
    workspaceId: 'ws-1',
    assetId: 'a-2',
    title: 'Oil and filter change',
    type: 'Preventive',
    status: 'Completed',
    performedDate: iso(-12),
    cost: 128,
    durationMinutes: 75,
    notes: 'Replaced engine oil, oil filter and cabin filter. Checked tyre pressure.',
    aiSummary: 'Routine oil service completed; next service recommended in 6 months.',
    materials: [
      { id: 'm-1', name: 'Engine oil 5W-30', quantity: 4.5, unit: 'L', unitCost: 12 },
      { id: 'm-2', name: 'Oil filter', quantity: 1, unit: 'pc', unitCost: 18 },
    ],
  },
  {
    id: 'l-2',
    workspaceId: 'ws-1',
    assetId: 'a-3',
    title: 'Boiler pressure loss inspection',
    type: 'Inspection',
    status: 'InProgress',
    performedDate: iso(-3),
    cost: 90,
    durationMinutes: 60,
    notes: 'Pressure drops to 0.6 bar overnight. Suspected expansion vessel fault.',
    aiSummary: 'Pressure issue detected. Professional inspection recommended.',
    materials: [],
  },
  {
    id: 'l-3',
    workspaceId: 'ws-1',
    assetId: 'a-1',
    title: 'Drain pump filter cleaning',
    type: 'Cleaning',
    status: 'Completed',
    performedDate: iso(-30),
    cost: 0,
    durationMinutes: 25,
    notes: 'Cleared lint and a coin from the pump filter. Drainage back to normal.',
    aiSummary: 'Filter cleaning completed successfully.',
    materials: [],
  },
  {
    id: 'l-4',
    workspaceId: 'ws-1',
    assetId: 'a-4',
    title: 'Blade replacement',
    type: 'Replacement',
    status: 'Completed',
    performedDate: iso(-55),
    cost: 46,
    durationMinutes: 40,
    notes: 'Installed new blade, sharpened spare, changed spark plug.',
    aiSummary: 'Blade replacement completed. Mower ready for use.',
    materials: [{ id: 'm-3', name: 'Mower blade', quantity: 1, unit: 'pc', unitCost: 34 }],
  },
  {
    id: 'l-5',
    workspaceId: 'ws-1',
    assetId: 'a-5',
    title: 'Descaling cycle',
    type: 'Preventive',
    status: 'Scheduled',
    performedDate: iso(6),
    cost: 15,
    durationMinutes: 45,
    notes: 'Quarterly descaling with citric solution.',
    aiSummary: 'Descaling scheduled. Prepare machine for maintenance.',
    materials: [{ id: 'm-4', name: 'Descaler', quantity: 1, unit: 'bottle', unitCost: 15 }],
  },
  {
    id: 'l-6',
    workspaceId: 'ws-1',
    assetId: 'a-2',
    title: 'Brake pads front axle',
    type: 'Corrective',
    status: 'Completed',
    performedDate: iso(-95),
    cost: 260,
    durationMinutes: 120,
    notes: 'Front pads and discs replaced after squealing noise.',
    aiSummary: 'Brake system serviced. Vehicle safe to drive.',
    materials: [{ id: 'm-5', name: 'Brake pad set', quantity: 1, unit: 'set', unitCost: 95 }],
  },
]

// Reminders
export const REMINDERS: Reminder[] = [
  {
    id: 'r-1',
    workspaceId: 'ws-1',
    assetId: 'a-3',
    title: 'Annual boiler service',
    frequencyType: 'Yearly',
    frequencyValue: 1,
    dueDate: iso(-8),
    completed: false,
  },
  {
    id: 'r-2',
    workspaceId: 'ws-1',
    assetId: 'a-1',
    title: 'Clean detergent drawer',
    frequencyType: 'Monthly',
    frequencyValue: 1,
    dueDate: iso(4),
    completed: false,
  },
  {
    id: 'r-3',
    workspaceId: 'ws-1',
    assetId: 'a-2',
    title: 'Tyre rotation',
    frequencyType: 'EveryXMonths',
    frequencyValue: 6,
    dueDate: iso(21),
    completed: false,
  },
  {
    id: 'r-4',
    workspaceId: 'ws-1',
    assetId: 'a-5',
    title: 'Descale espresso machine',
    frequencyType: 'EveryXWeeks',
    frequencyValue: 12,
    dueDate: iso(-2),
    completed: false,
  },
  {
    id: 'r-5',
    workspaceId: 'ws-1',
    assetId: 'a-4',
    title: 'Sharpen mower blade',
    frequencyType: 'Yearly',
    frequencyValue: 1,
    dueDate: iso(60),
    completed: true,
  },
]

// DIY Projects
export const PROJECTS: DiyProject[] = [
  {
    id: 'p-1',
    workspaceId: 'ws-1',
    title: 'Insulate the garage door',
    goal: 'Reduce heat loss in winter with reflective panels.',
    status: 'InProgress',
    priority: 'Medium',
    budget: 180,
    experience: 'Beginner',
    aiPlan: 'Measure panel bays, cut reflective foam boards to size, secure with retainer clips, seal edges with foil tape, then add a bottom weather seal.',
    tasks: [
      { id: 't-1', title: 'Measure door panels', status: 'Completed', completedAt: iso(-9) },
      { id: 't-2', title: 'Buy foam boards and tape', status: 'Completed', completedAt: iso(-6) },
      { id: 't-3', title: 'Cut panels to size', status: 'InProgress' },
      { id: 't-4', title: 'Install retainer clips', status: 'Pending' },
      { id: 't-5', title: 'Seal edges', status: 'Pending' },
    ],
  },
  {
    id: 'p-2',
    workspaceId: 'ws-1',
    title: 'Build garden tool wall rack',
    goal: 'Free up shed floor space with a wall-mounted rack.',
    status: 'Planning',
    priority: 'Low',
    budget: 90,
    experience: 'Intermediate',
    aiPlan: 'Sketch layout, cut plywood backing, install hooks and holders, mount to wall.',
    tasks: [
      { id: 't-6', title: 'Sketch layout', status: 'Pending' },
      { id: 't-7', title: 'Cut plywood backing', status: 'Pending' },
    ],
  },
]

// AI Recommendations
export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    assetId: 'a-3',
    title: 'Boiler losing pressure repeatedly',
    description: 'Repeated pressure drops usually point to a failing expansion vessel or a small system leak.',
    action: 'Book a Gas Safe engineer to test the expansion vessel before the heating season.',
    urgency: 'Critical',
  },
  {
    id: 'rec-2',
    assetId: 'a-2',
    title: 'Brake fluid due for replacement',
    description: 'Fluid was last changed over 2 years ago based on your logs.',
    action: 'Schedule a brake fluid flush at the next service.',
    urgency: 'High',
  },
  {
    id: 'rec-3',
    assetId: 'a-1',
    title: 'Run a drum maintenance wash',
    description: 'No hot maintenance cycle logged in the last 3 months.',
    action: 'Run a 90°C empty cycle with drum cleaner.',
    urgency: 'Low',
  },
]

// Notifications
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Reminder overdue',
    body: 'Annual boiler service is 8 days overdue.',
    read: false,
    createdAt: iso(-8),
  },
  {
    id: 'n-2',
    title: 'AI recommendation',
    body: 'New critical recommendation for Gas Boiler.',
    read: false,
    createdAt: iso(-3),
  },
  {
    id: 'n-3',
    title: 'Maintenance log created',
    body: 'Oil and filter change was added to Family SUV.',
    read: true,
    createdAt: iso(-12),
  },
]