export type WorkspaceRole = 'Owner' | 'Member' | 'Technician' | 'Viewer'
export type WorkspaceType = 'Personal' | 'Family' | 'Business'
export type AssetStatus = 'Active' | 'UnderRepair' | 'Archived' | 'Disposed'
export type LogType = 'Preventive' | 'Corrective' | 'Inspection' | 'Cleaning' | 'DIY' | 'Installation' | 'Replacement'
export type LogStatus = 'Open' | 'InProgress' | 'Completed'
export type DiyStatus = 'Planning' | 'InProgress' | 'Completed' | 'OnHold'
export type DiyPriority = 'Low' | 'Medium' | 'High'
export type ReminderFreq = 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'EveryXDays' | 'EveryXWeeks' | 'EveryXMonths' | 'Yearly' | 'Mileage' | 'Usage'
export type ReminderStatus = 'Upcoming' | 'Overdue' | 'Completed' | 'Paused'
export type Urgency = 'Low' | 'Medium' | 'High' | 'Critical'

export interface User {
  id: string
  fullName: string
  email: string
  globalRole: 'Admin' | 'User'
  avatarColor: string
}

export interface Workspace {
  id: string
  name: string
  type: WorkspaceType
  createdByUserId: string
  createdAt: string
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: WorkspaceRole
  joinedAt: string
  fullName: string
  email: string
}

export interface AssetCategory {
  id: string
  name: string
  icon: string
  parentCategoryId?: string | null
}

export interface Asset {
  id: string
  workspaceId: string
  categoryId: string
  name: string
  brand?: string
  model?: string
  serialNo?: string
  purchaseDate?: string
  warrantyEnd?: string
  location?: string
  status: AssetStatus
  photoEmoji: string
}

export interface MaintenanceMaterial {
  id: string
  maintenanceLogId: string
  name: string
  qty: number
  unit: string
  unitCost: number
}

export interface MaintenanceLog {
  id: string
  assetId: string
  title: string
  type: LogType
  status: LogStatus
  cost: number
  durationMin?: number
  performedAt: string
  aiSummary?: string
  notes?: string
}

export interface DiyTask {
  id: string
  diyProjectId: string
  title: string
  order: number
  status: 'Todo' | 'Done'
  estDuration?: string
  completedAt?: string | null
}

export interface DiyProject {
  id: string
  workspaceId: string
  assetId?: string | null
  title: string
  goal: string
  status: DiyStatus
  priority: DiyPriority
  budget?: number
  aiGeneratedPlan?: {
    toolsRequired: string[]
    materials: { name: string; qty: string; estCost: number }[]
    safetyNotes: string[]
    budgetEstimate: number
  } | null
}

export interface Reminder {
  id: string
  assetId: string
  title: string
  freqType: ReminderFreq
  freqValue?: number
  dueDate: string
  nextDueDate: string
  lastCompleted?: string | null
  status: ReminderStatus
}

export interface FileAttachment {
  id: string
  assetId?: string
  logId?: string
  projectId?: string
  fileName: string
  category: 'Photo' | 'Invoice' | 'Document' | 'Warranty'
  fileSize: number
  createdAt: string
}

export interface AiInteraction {
  id: string
  userId: string
  workspaceId: string
  type: 'IssueAnalysis' | 'DiyPlan' | 'Summary' | 'Recommendation'
  inputText: string
  createdAt: string
}

export interface IssueAnalysisResult {
  category: string
  urgency: Urgency
  possibleCauses: string[]
  safeChecks: string[]
  requiresProfessional: boolean
  suggestedLogTitle: string
  suggestedReminder?: string
  safetyWarning?: string
}

export interface AppNotification {
  id: string
  title: string
  message: string
  type: 'reminder' | 'ai' | 'system'
  isRead: boolean
  createdAt: string
}
