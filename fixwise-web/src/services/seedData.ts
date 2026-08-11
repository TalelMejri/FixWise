import type {
  User, Workspace, WorkspaceMember, AssetCategory, Asset,
  MaintenanceLog, MaintenanceMaterial, DiyProject, DiyTask,
  Reminder, AppNotification
} from '../types'

export const currentUser: User = {
  id: 'u1',
  fullName: 'Sami Ben Ali',
  email: 'sami@example.com',
  globalRole: 'User',
  avatarColor: '#E85D2C',
}

export const seedWorkspaces: Workspace[] = [
  { id: 'w1', name: 'My Home', type: 'Personal', createdByUserId: 'u1', createdAt: '2026-01-04' },
  { id: 'w2', name: 'Family House', type: 'Family', createdByUserId: 'u1', createdAt: '2026-02-11' },
  { id: 'w3', name: 'Atlas Repairs Co.', type: 'Business', createdByUserId: 'u1', createdAt: '2026-03-02' },
]

export const seedMembers: WorkspaceMember[] = [
  { id: 'm1', workspaceId: 'w1', userId: 'u1', role: 'Owner', joinedAt: '2026-01-04', fullName: 'Sami Ben Ali', email: 'sami@example.com' },
  { id: 'm2', workspaceId: 'w1', userId: 'u2', role: 'Viewer', joinedAt: '2026-01-10', fullName: 'Nour Chaabane', email: 'nour@example.com' },
  { id: 'm3', workspaceId: 'w3', userId: 'u1', role: 'Owner', joinedAt: '2026-03-02', fullName: 'Sami Ben Ali', email: 'sami@example.com' },
  { id: 'm4', workspaceId: 'w3', userId: 'u3', role: 'Technician', joinedAt: '2026-03-05', fullName: 'Karim Trabelsi', email: 'karim@example.com' },
]

export const categories: AssetCategory[] = [
  { id: 'c1', name: 'Appliances', icon: 'mdi:washing-machine' },
  { id: 'c2', name: 'HVAC', icon: 'mdi:air-conditioner' },
  { id: 'c3', name: 'Vehicles', icon: 'mdi:car' },
  { id: 'c4', name: 'Plumbing', icon: 'mdi:pipe-wrench' },
  { id: 'c5', name: 'Electrical', icon: 'mdi:flash' },
  { id: 'c6', name: 'Power Tools', icon: 'mdi:tools' },
  { id: 'c7', name: 'Outdoor & Garden', icon: 'mdi:flower' },
  { id: 'c8', name: 'Furniture', icon: 'mdi:sofa' },
  { id: 'c9', name: 'Electronics', icon: 'mdi:television' },
  { id: 'c10', name: 'Structural', icon: 'mdi:home-city' },
  { id: 'c11', name: 'Other', icon: 'mdi:shape' },
]

export const seedAssets: Asset[] = [
  { id: 'a1', workspaceId: 'w1', categoryId: 'c1', name: 'Washing Machine', brand: 'Samsung', model: 'WW90T4040CE', serialNo: 'SN-88213', purchaseDate: '2023-06-12', warrantyEnd: '2026-06-12', location: 'Laundry room', status: 'UnderRepair', photoEmoji: '🧺' },
  { id: 'a2', workspaceId: 'w1', categoryId: 'c2', name: 'Split AC Unit', brand: 'LG', model: 'DualCool 12k', serialNo: 'SN-44120', purchaseDate: '2022-05-01', warrantyEnd: '2025-05-01', location: 'Living room', status: 'Active', photoEmoji: '❄️' },
  { id: 'a3', workspaceId: 'w1', categoryId: 'c3', name: 'Renault Clio 2018', brand: 'Renault', model: 'Clio IV', serialNo: 'VIN-7734KX', purchaseDate: '2018-09-20', location: 'Garage', status: 'Active', photoEmoji: '🚗' },
  { id: 'a4', workspaceId: 'w1', categoryId: 'c4', name: 'Water Heater', brand: 'Ariston', model: 'Velis 80L', purchaseDate: '2021-11-03', location: 'Bathroom', status: 'Active', photoEmoji: '🚿' },
  { id: 'a5', workspaceId: 'w1', categoryId: 'c6', name: 'Cordless Drill', brand: 'Bosch', model: 'GSR 18V', purchaseDate: '2024-02-14', location: 'Garage shelf', status: 'Active', photoEmoji: '🔧' },
  { id: 'a6', workspaceId: 'w2', categoryId: 'c1', name: 'Dishwasher', brand: 'Bosch', model: 'SMS4HVW33E', purchaseDate: '2023-01-15', location: 'Kitchen', status: 'Active', photoEmoji: '🍽️' },
  { id: 'a7', workspaceId: 'w2', categoryId: 'c7', name: 'Lawn Mower', brand: 'Husqvarna', model: 'LC 140', purchaseDate: '2022-04-09', location: 'Shed', status: 'Active', photoEmoji: '🌱' },
  { id: 'a8', workspaceId: 'w3', categoryId: 'c2', name: 'Rooftop HVAC Unit #3', brand: 'Carrier', model: '48TC', purchaseDate: '2020-08-01', location: 'Roof — Building B', status: 'Active', photoEmoji: '🏭' },
  { id: 'a9', workspaceId: 'w3', categoryId: 'c3', name: 'Delivery Van', brand: 'Ford', model: 'Transit 2021', serialNo: 'VIN-99A02', purchaseDate: '2021-03-11', location: 'Depot', status: 'Active', photoEmoji: '🚐' },
  { id: 'a10', workspaceId: 'w1', categoryId: 'c9', name: 'Home Router', brand: 'TP-Link', model: 'Archer AX55', purchaseDate: '2024-07-01', location: 'Office', status: 'Archived', photoEmoji: '📶' },
]

export const seedLogs: MaintenanceLog[] = [
  { id: 'l1', assetId: 'a1', title: 'Loud noise during spin cycle', type: 'Corrective', status: 'InProgress', cost: 0, performedAt: '2026-08-05', notes: 'Reported by household, investigating drum bearing.' },
  { id: 'l2', assetId: 'a2', title: 'Annual filter cleaning', type: 'Cleaning', status: 'Completed', cost: 0, durationMin: 30, performedAt: '2026-05-02', aiSummary: 'Filters cleaned, no issues found. Airflow restored to normal.' },
  { id: 'l3', assetId: 'a3', title: 'Oil change', type: 'Preventive', status: 'Completed', cost: 85, durationMin: 45, performedAt: '2026-06-20' },
  { id: 'l4', assetId: 'a3', title: 'Tyre pressure check', type: 'Inspection', status: 'Completed', cost: 0, durationMin: 10, performedAt: '2026-07-15' },
  { id: 'l5', assetId: 'a4', title: 'Anode rod replacement', type: 'Replacement', status: 'Completed', cost: 42, durationMin: 60, performedAt: '2026-03-18' },
  { id: 'l6', assetId: 'a7', title: 'Blade sharpening', type: 'Preventive', status: 'Completed', cost: 15, durationMin: 20, performedAt: '2026-04-01' },
  { id: 'l7', assetId: 'a9', title: 'Brake pad inspection', type: 'Inspection', status: 'Completed', cost: 0, durationMin: 25, performedAt: '2026-07-28' },
  { id: 'l8', assetId: 'a8', title: 'Quarterly filter replacement', type: 'Preventive', status: 'Completed', cost: 120, durationMin: 90, performedAt: '2026-06-10' },
]

export const seedMaterials: MaintenanceMaterial[] = [
  { id: 'mt1', maintenanceLogId: 'l3', name: 'Engine oil 5L', qty: 1, unit: 'unit', unitCost: 55 },
  { id: 'mt2', maintenanceLogId: 'l3', name: 'Oil filter', qty: 1, unit: 'unit', unitCost: 30 },
  { id: 'mt3', maintenanceLogId: 'l5', name: 'Magnesium anode rod', qty: 1, unit: 'unit', unitCost: 42 },
]

export const seedDiyProjects: DiyProject[] = [
  {
    id: 'd1', workspaceId: 'w1', assetId: null, title: 'Paint the bedroom', goal: 'Repaint bedroom walls in a warm neutral tone',
    status: 'InProgress', priority: 'Medium', budget: 150,
    aiGeneratedPlan: {
      toolsRequired: ['Roller + tray', 'Angled brush', 'Painter\'s tape', 'Drop cloth'],
      materials: [{ name: 'Interior paint (matte)', qty: '2 x 2.5L', estCost: 70 }, { name: 'Primer', qty: '1 x 2.5L', estCost: 25 }],
      safetyNotes: ['Ventilate the room while painting', 'Use a mask when sanding old paint'],
      budgetEstimate: 135,
    },
  },
  {
    id: 'd2', workspaceId: 'w1', assetId: 'a5', title: 'Build garage shelving', goal: 'Add wall-mounted shelves for tool storage',
    status: 'Planning', priority: 'Low', budget: 90, aiGeneratedPlan: null,
  },
  {
    id: 'd3', workspaceId: 'w2', assetId: null, title: 'Weatherproof the deck', goal: 'Reseal outdoor deck before winter',
    status: 'Completed', priority: 'Medium', budget: 60, aiGeneratedPlan: null,
  },
]

export const seedDiyTasks: DiyTask[] = [
  { id: 't1', diyProjectId: 'd1', title: 'Move furniture & cover floor', order: 1, status: 'Done', estDuration: '30 min', completedAt: '2026-08-01' },
  { id: 't2', diyProjectId: 'd1', title: 'Tape edges & trim', order: 2, status: 'Done', estDuration: '20 min', completedAt: '2026-08-01' },
  { id: 't3', diyProjectId: 'd1', title: 'Apply primer coat', order: 3, status: 'Todo', estDuration: '45 min' },
  { id: 't4', diyProjectId: 'd1', title: 'Apply two coats of paint', order: 4, status: 'Todo', estDuration: '2 hr' },
  { id: 't5', diyProjectId: 'd1', title: 'Remove tape & clean up', order: 5, status: 'Todo', estDuration: '20 min' },
]

const today = new Date('2026-08-10')
function daysFromToday(n: number) {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const seedReminders: Reminder[] = [
  { id: 'r1', assetId: 'a1', title: 'Clean lint filter', freqType: 'EveryXMonths', freqValue: 2, dueDate: daysFromToday(-3), nextDueDate: daysFromToday(-3), status: 'Overdue', lastCompleted: '2026-06-10' },
  { id: 'r2', assetId: 'a2', title: 'Filter cleaning', freqType: 'Yearly', dueDate: daysFromToday(265), nextDueDate: daysFromToday(265), status: 'Upcoming', lastCompleted: '2026-05-02' },
  { id: 'r3', assetId: 'a3', title: 'Next oil change', freqType: 'Mileage', dueDate: daysFromToday(120), nextDueDate: daysFromToday(120), status: 'Upcoming', lastCompleted: '2026-06-20' },
  { id: 'r4', assetId: 'a3', title: 'Tyre pressure check', freqType: 'Monthly', dueDate: daysFromToday(2), nextDueDate: daysFromToday(2), status: 'Upcoming', lastCompleted: '2026-07-15' },
  { id: 'r5', assetId: 'a4', title: 'Descale water heater', freqType: 'Yearly', dueDate: daysFromToday(-10), nextDueDate: daysFromToday(-10), status: 'Overdue', lastCompleted: '2025-03-18' },
  { id: 'r6', assetId: 'a7', title: 'Sharpen mower blade', freqType: 'EveryXMonths', freqValue: 6, dueDate: daysFromToday(35), nextDueDate: daysFromToday(35), status: 'Upcoming', lastCompleted: '2026-04-01' },
  { id: 'r7', assetId: 'a8', title: 'Replace HVAC filter', freqType: 'EveryXMonths', freqValue: 3, dueDate: daysFromToday(1), nextDueDate: daysFromToday(1), status: 'Upcoming', lastCompleted: '2026-06-10' },
  { id: 'r8', assetId: 'a9', title: 'Brake inspection', freqType: 'EveryXMonths', freqValue: 6, dueDate: daysFromToday(90), nextDueDate: daysFromToday(90), status: 'Upcoming', lastCompleted: '2026-07-28' },
]

export const seedNotifications: AppNotification[] = [
  { id: 'n1', title: 'Reminder overdue', message: 'Clean lint filter on Washing Machine is 3 days overdue.', type: 'reminder', isRead: false, createdAt: daysFromToday(0) },
  { id: 'n2', title: 'AI analysis ready', message: 'Issue analysis for Washing Machine completed.', type: 'ai', isRead: false, createdAt: daysFromToday(-1) },
  { id: 'n3', title: 'Reminder overdue', message: 'Descale water heater is 10 days overdue.', type: 'reminder', isRead: true, createdAt: daysFromToday(-2) },
  { id: 'n4', title: 'Welcome to FixWise', message: 'Your workspace "My Home" is ready to go.', type: 'system', isRead: true, createdAt: '2026-01-04' },
]
