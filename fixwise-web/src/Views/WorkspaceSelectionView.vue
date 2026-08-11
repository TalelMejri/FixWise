<template>
  <div class="workspace-page">
    <!-- Background Decor -->
    <div class="bg-decor">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="workspace-container">
      <!-- Header -->
      <div class="workspace-header">
        <div class="header-content">
          <div class="logo-wrapper">
            <img :src="logo" alt="FixWise" class="logo-img" />
            <span class="logo-text">FixWise</span>
          </div>

          <div class="header-text">
            <h1 class="greeting">
              Welcome back, <span class="greeting-name">{{ userName }}</span>
            </h1>
            <p class="subtitle">Manage your workspaces, members, and categories</p>
          </div>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <button class="btn-logout" @click="handleLogout">
            <LogOut class="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- Workspace Grid -->
      <div class="workspace-grid">
        <div v-for="ws in workspaces" :key="ws.id" class="workspace-card">
          <div class="card-inner" @click="openWorkspace(ws.id)">
            <FolderPreview :label="ws.name" :images="ws.images || []" size="lg" />

            <!-- Badges -->
            <div class="card-badges">
              <span class="badge-type">{{ ws.type }}</span>
              <span class="badge-members">{{ ws.members?.length || 0 }} members</span>
              <span class="badge-categories">{{ ws.categories?.length || 0 }} categories</span>
            </div>

            <!-- Hover Overlay -->
            <div class="card-hover-overlay">
              <span class="card-hover-text">Open Workspace</span>
              <ArrowRight class="w-4 h-4 card-hover-icon" />
            </div>
          </div>

          <!-- Actions (visible on hover) -->
          <div class="card-actions">
            <button v-if="isOwner(ws)" class="action-btn edit-btn" @click.stop="openEditModal(ws)"
              title="Edit Workspace">
              <Edit class="w-4 h-4" />
            </button>
            <button v-if="isOwner(ws)" class="action-btn delete-btn" @click.stop="confirmDelete(ws)"
              title="Delete Workspace">
              <Trash2 class="w-4 h-4" />
            </button>
            <button class="action-btn view-btn" @click.stop="viewWorkspaceDetails(ws)" title="View Details">
              <Eye class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Create New Workspace -->
        <div class="workspace-card create-card" @click="openCreateModal()">
          <div class="card-inner create-inner">
            <div class="create-content">
              <div class="create-icon-wrapper">
                <Plus class="create-icon" />
              </div>
              <h3 class="create-title">Create New Workspace</h3>
              <p class="create-subtitle">Start a new workspace for your projects</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-item">
          <span class="stat-value">{{ workspaces.length }}</span>
          <span class="stat-label">Total Workspaces</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ totalMembers }}</span>
          <span class="stat-label">Total Members</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ totalCategories }}</span>
          <span class="stat-label">Total Categories</span>
        </div>
      </div>
    </div>

    <!-- Create Workspace Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
          <div class="modal modal-lg">
            <div class="modal-header">
              <h2 class="modal-title">Create New Workspace</h2>
              <button class="modal-close" @click="showCreateModal = false">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="createWorkspace" class="modal-form">
              <!-- Basic Info -->
              <div class="form-section">
                <h3 class="section-title">Basic Information</h3>
                <div class="form-group">
                  <label class="form-label">Workspace Name *</label>
                  <input v-model="newWorkspace.name" type="text" placeholder="e.g., My Home, Office, Garage..."
                    class="form-input" required autofocus />
                </div>
                <div class="form-group">
                  <label class="form-label">Workspace Type *</label>
                  <div class="type-selector">
                    <button v-for="type in workspaceTypes" :key="type.value" type="button" class="type-option"
                      :class="{ active: newWorkspace.type === type.value }" @click="newWorkspace.type = type.value">
                      <span class="type-emoji">{{ type.emoji }}</span>
                      <span class="type-label">{{ type.label }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Members -->
              <div class="form-section">
                <div class="form-header">
                  <h3 class="section-title">Team Members</h3>
                  <span class="member-count">{{ newWorkspace.members.length }} members</span>
                </div>

                <div class="members-list">
                  <div v-for="(member, index) in newWorkspace.members" :key="member.id || index" class="member-item">
                    <div class="member-info">
                      <div class="member-avatar" :style="{ background: getAvatarColor(member.name) }">
                        {{ getInitials(member.name) }}
                      </div>
                      <div class="member-details">
                        <span class="member-name">{{ member.name }}</span>
                        <span class="member-email">{{ member.email }}</span>
                      </div>
                    </div>
                    <div class="member-actions">
                      <select v-model="member.role" class="role-select">
                        <option value="Owner">👑 Owner</option>
                        <option value="Member">👤 Member</option>
                        <option value="Technician">🔧 Technician</option>
                        <option value="Viewer">👁️ Viewer</option>
                      </select>
                      <button type="button" class="btn-remove-member"
                        :disabled="member.role === 'Owner' && newWorkspace.members.length === 1"
                        @click="removeMember(index)">
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="add-member">
                  <input v-model="newMemberEmail" type="email" placeholder="Enter email to invite..." class="form-input"
                    @keyup.enter="addMember" />
                  <input v-model="newMemberName" type="text" placeholder="Name" class="form-input form-input-sm"
                    @keyup.enter="addMember" />
                  <select v-model="newMemberRole" class="role-select">
                    <option value="Member">Member</option>
                    <option value="Technician">Technician</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button type="button" class="btn-add-member" @click="addMember">
                    <Plus class="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="showCreateModal = false">
                  Cancel
                </button>
                <button type="submit" class="btn-create" :disabled="isCreating || !newWorkspace.name.trim()">
                  <Loader2 v-if="isCreating" class="w-4 h-4 animate-spin" />
                  <span v-else>Create Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Workspace Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal modal-lg">
            <div class="modal-header">
              <h2 class="modal-title">Edit Workspace</h2>
              <button class="modal-close" @click="showEditModal = false">
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="updateWorkspace" class="modal-form">
              <!-- Basic Info -->
              <div class="form-section">
                <h3 class="section-title">Basic Information</h3>
                <div class="form-group">
                  <label class="form-label">Workspace Name *</label>
                  <input v-model="editWorkspace.name" type="text" placeholder="e.g., My Home, Office, Garage..."
                    class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Workspace Type *</label>
                  <div class="type-selector">
                    <button v-for="type in workspaceTypes" :key="type.value" type="button" class="type-option"
                      :class="{ active: editWorkspace.type === type.value }" @click="editWorkspace.type = type.value">
                      <span class="type-emoji">{{ type.emoji }}</span>
                      <span class="type-label">{{ type.label }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Members -->
              <div class="form-section">
                <div class="form-header">
                  <h3 class="section-title">Team Members</h3>
                  <span class="member-count">{{ editWorkspace.members.length }} members</span>
                </div>

                <div class="members-list">
                  <div v-for="(member, index) in editWorkspace.members" :key="member.id || index" class="member-item">
                    <div class="member-info">
                      <div class="member-avatar" :style="{ background: getAvatarColor(member.name) }">
                        {{ getInitials(member.name) }}
                      </div>
                      <div class="member-details">
                        <span class="member-name">{{ member.name }}</span>
                        <span class="member-email">{{ member.email }}</span>
                      </div>
                    </div>
                    <div class="member-actions">
                      <select v-model="member.role" class="role-select">
                        <option value="Owner">👑 Owner</option>
                        <option value="Member">👤 Member</option>
                        <option value="Technician">🔧 Technician</option>
                        <option value="Viewer">👁️ Viewer</option>
                      </select>
                      <button type="button" class="btn-remove-member"
                        :disabled="member.role === 'Owner' && editWorkspace.members.length === 1"
                        @click="removeEditMember(index)">
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="add-member">
                  <input v-model="editMemberEmail" type="email" placeholder="Enter email to invite..."
                    class="form-input" @keyup.enter="addEditMember" />
                  <input v-model="editMemberName" type="text" placeholder="Name" class="form-input form-input-sm"
                    @keyup.enter="addEditMember" />
                  <select v-model="editMemberRole" class="role-select">
                    <option value="Member">Member</option>
                    <option value="Technician">Technician</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button type="button" class="btn-add-member" @click="addEditMember">
                    <Plus class="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              <!-- Categories -->
              <div class="form-section">
                <div class="form-header">
                  <h3 class="section-title">Categories</h3>
                  <span class="category-count">{{ editWorkspace.categories.length }} categories</span>
                </div>

                <div class="categories-container">
                  <div class="categories-grid">
                    <div v-for="(category, index) in editWorkspace.categories" :key="index" class="category-item">
                      <span class="category-icon">{{ category.icon }}</span>
                      <span class="category-name">{{ category.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="showEditModal = false">
                  Cancel
                </button>
                <button type="submit" class="btn-create" :disabled="isUpdating || !editWorkspace.name.trim()">
                  <Loader2 v-if="isUpdating" class="w-4 h-4 animate-spin" />
                  <span v-else>Update Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- View Workspace Details Modal -->
    <!-- Update the Workspace Details Modal section -->
    <!-- View Workspace Details Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
          <div class="modal modal-details">
            <!-- Header with Workspace Info -->
            <div class="details-header">
              <div class="details-header-left">
                <div class="details-icon-wrapper">
                  <span class="details-icon">📁</span>
                </div>
                <div>
                  <h2 class="details-title">{{ selectedWorkspace?.name }}</h2>
                  <div class="details-meta">
                    <span class="details-type">{{ selectedWorkspace?.type }}</span>
                    <span class="details-dot">•</span>
                    <span class="details-variant">{{ selectedWorkspace?.variant || 'devi' }}</span>
                  </div>
                </div>
              </div>
              <button class="modal-close" @click="showDetailsModal = false">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="details-body">
              <!-- Quick Stats -->
              <div class="details-stats">
                <div class="details-stat">
                  <span class="stat-number">{{ selectedWorkspace?.members?.length || 0 }}</span>
                  <span class="stat-label">Members</span>
                </div>
                <div class="details-stat-divider"></div>
                <div class="details-stat">
                  <span class="stat-number">{{ selectedWorkspace?.categories?.length || 0 }}</span>
                  <span class="stat-label">Categories</span>
                </div>
                <div class="details-stat-divider"></div>
                <div class="details-stat">
                  <span class="stat-number">{{ selectedWorkspace?.type || 'Personal' }}</span>
                  <span class="stat-label">Type</span>
                </div>
              </div>

              <!-- Members Section -->
              <div class="details-section">
                <div class="details-section-header">
                  <h3 class="details-section-title">
                    <Users class="w-4 h-4" />
                    Members
                  </h3>
                  <span class="details-section-count">{{ selectedWorkspace?.members?.length || 0 }}</span>
                </div>
                <div class="details-members-grid">
                  <div v-for="member in selectedWorkspace?.members" :key="member.id" class="details-member-card">
                    <div class="member-avatar" :style="{ background: getAvatarColor(member.name) }">
                      {{ getInitials(member.name) }}
                    </div>
                    <div class="member-info">
                      <span class="member-name">{{ member.name }}</span>
                      <span class="member-email">{{ member.email }}</span>
                    </div>
                    <span class="member-role-badge" :class="getRoleBadgeClass(member.role)">
                      {{ member.role }}
                    </span>
                  </div>
                  <div v-if="!selectedWorkspace?.members?.length" class="empty-state">
                    <span class="empty-icon">👥</span>
                    <p class="empty-text">No members yet</p>
                  </div>
                </div>
              </div>

              <!-- Categories Section -->
              <div class="details-section">
                <div class="details-section-header">
                  <h3 class="details-section-title">
                    <Tag class="w-4 h-4" />
                    Categories
                  </h3>
                  <span class="details-section-count">{{ selectedWorkspace?.categories?.length || 0 }}</span>
                </div>
                <div class="details-categories-grid">
                  <span v-for="category in selectedWorkspace?.categories" :key="category.name"
                    class="details-category-tag">
                    <span class="category-icon">{{ category.icon }}</span>
                    {{ category.name }}
                  </span>
                  <div v-if="!selectedWorkspace?.categories?.length" class="empty-state">
                    <span class="empty-icon">🏷️</span>
                    <p class="empty-text">No categories yet</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="details-footer">
              <button class="btn-secondary" @click="showDetailsModal = false">
                Close
              </button>
              <button class="btn-primary" @click="openWorkspace(selectedWorkspace?.id)">
                <ArrowRight class="w-4 h-4" />
                Open Workspace
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal modal-sm">
            <div class="modal-header">
              <h2 class="modal-title text-red-500">Delete Workspace</h2>
              <button class="modal-close" @click="showDeleteModal = false">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="delete-content">
              <div class="delete-icon-wrapper">
                <AlertTriangle class="w-12 h-12 text-red-500" />
              </div>
              <p class="delete-message">
                Are you sure you want to delete <strong>"{{ deleteWorkspace?.name }}"</strong>?
              </p>
              <p class="delete-warning">
                This action cannot be undone. All data associated with this workspace will be permanently deleted.
              </p>
            </div>

            <div class="modal-actions">
              <button class="btn-cancel" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn-delete" @click="confirmDeleteWorkspace">
                <Trash2 class="w-4 h-4" />
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Plus, X, LogOut, ArrowRight, Loader2, Edit, Trash2, Eye, AlertTriangle } from 'lucide-vue-next'
import FolderPreview from '@/components/workspace/FolderPreview.vue'
import logo from '@/assets/logo.png'

const { t } = useI18n()
const router = useRouter()

// User
const userName = ref('Talel')
const currentUserEmail = ref('talel@example.com')

// Workspace Types
const workspaceTypes = [
  { value: 'Personal', label: 'Personal', emoji: '🏠' },
  { value: 'Family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'Business', label: 'Business', emoji: '🏢' }
]

const variantOptions = [
  { value: 'devi', label: 'Devi', emoji: '🌿' },
  { value: 'rudras', label: 'Rudras', emoji: '🔥' },
  { value: 'ardra', label: 'Ardra', emoji: '💧' },
  { value: 'shakti', label: 'Shakti', emoji: '⚡' },
  { value: 'kubera', label: 'Kubera', emoji: '💰' },
  { value: 'hari', label: 'Hari', emoji: '🌸' },
  { value: 'ravi', label: 'Ravi', emoji: '☀️' },
  { value: 'durga', label: 'Durga', emoji: '🦁' },
  { value: 'nandi', label: 'Nandi', emoji: '🐂' }
]

// Default Categories
const defaultCategories = [
  { name: 'Appliances', icon: '🏠' },
  { name: 'Vehicles', icon: '🚗' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Tools', icon: '🔧' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'Plumbing', icon: '🚰' },
  { name: 'HVAC', icon: '❄️' },
  { name: 'Garden', icon: '🌱' }
]

// State
const workspaces = ref([
  {
    id: '1',
    name: 'My Home',
    type: 'Personal',
    variant: 'devi',
    images: ['/folder-preview/user1.svg', '/folder-preview/user2.svg'],
    members: [
      { id: '1', name: 'Talel', email: 'talel@example.com', role: 'Owner' },
      { id: '2', name: 'Sarah', email: 'sarah@example.com', role: 'Member' },
      { id: '3', name: 'Ahmed', email: 'ahmed@example.com', role: 'Technician' }
    ],
    categories: defaultCategories.slice(0, 4)
  },
  {
    id: '2',
    name: 'Family House',
    type: 'Family',
    variant: 'rudras',
    images: ['/folder-preview/user3.svg', '/folder-preview/user4.svg'],
    members: [
      { id: '4', name: 'Talel', email: 'talel@example.com', role: 'Owner' },
      { id: '5', name: 'Fatma', email: 'fatma@example.com', role: 'Member' },
      { id: '6', name: 'Karim', email: 'karim@example.com', role: 'Viewer' }
    ],
    categories: defaultCategories
  },
  {
    id: '3',
    name: 'Auto Garage',
    type: 'Business',
    variant: 'ardra',
    images: ['/folder-preview/user5.svg'],
    members: [
      { id: '7', name: 'Talel', email: 'talel@example.com', role: 'Owner' }
    ],
    categories: defaultCategories.slice(0, 2)
  }
])

// Computed
const totalMembers = computed(() => {
  return workspaces.value.reduce((total, ws) => total + (ws.members?.length || 0), 0)
})

const totalCategories = computed(() => {
  const uniqueCategories = new Set()
  workspaces.value.forEach(ws => {
    ws.categories?.forEach(cat => uniqueCategories.add(cat.name))
  })
  return uniqueCategories.size
})

// Create Modal
const showCreateModal = ref(false)
const isCreating = ref(false)

const newWorkspace = ref({
  name: '',
  type: 'Personal',
  variant: 'devi',
  members: [
    { id: 'temp-1', name: 'Talel', email: 'talel@example.com', role: 'Owner' }
  ],
  categories: [...defaultCategories]
})

const newMemberEmail = ref('')
const newMemberName = ref('')
const newMemberRole = ref('Member')
const newCategoryName = ref('')
const newCategoryIcon = ref('🏠')

// Edit Modal
const showEditModal = ref(false)
const isUpdating = ref(false)
const editingWorkspaceId = ref('')

const editWorkspace = ref({
  id: '',
  name: '',
  type: 'Personal',
  variant: 'devi',
  members: [] as any[],
  categories: [] as any[]
})

const editMemberEmail = ref('')
const editMemberName = ref('')
const editMemberRole = ref('Member')
const editCategoryName = ref('')
const editCategoryIcon = ref('🏠')

// View Details Modal
const showDetailsModal = ref(false)
const selectedWorkspace = ref<any>(null)

// Delete Modal
const showDeleteModal = ref(false)
const deleteWorkspace = ref<any>(null)

// Methods
const getAvatarColor = (name: string) => {
  const colors = ['#e87a00', '#8b5cf6', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#ec4899', '#06b6d4']
  const index = name.length % colors.length
  return colors[index]
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    Owner: 'role-owner',
    Member: 'role-member',
    Technician: 'role-technician',
    Viewer: 'role-viewer'
  }
  return classes[role] || ''
}

const isOwner = (ws: any) => {
  return ws.members?.some((m: any) => m.role === 'Owner' && m.email === currentUserEmail.value)
}

// Workspace Actions
const openWorkspace = (id: string) => {
  if (!id) return
  localStorage.setItem('selectedWorkspace', id)
  router.push('/dashboard')
}

// Create Workspace Methods
const openCreateModal = () => {
  newWorkspace.value = {
    name: '',
    type: 'Personal',
    variant: 'devi',
    members: [
      { id: `temp-${Date.now()}`, name: userName.value, email: currentUserEmail.value, role: 'Owner' }
    ],
    categories: [...defaultCategories]
  }
  newMemberEmail.value = ''
  newMemberName.value = ''
  newMemberRole.value = 'Member'
  newCategoryName.value = ''
  newCategoryIcon.value = '🏠'
  showCreateModal.value = true
}

const addMember = () => {
  if (!newMemberEmail.value || !newMemberName.value) return
  if (newWorkspace.value.members.some(m => m.email === newMemberEmail.value)) {
    alert('Member already exists')
    return
  }
  newWorkspace.value.members.push({
    id: `temp-${Date.now()}`,
    name: newMemberName.value,
    email: newMemberEmail.value,
    role: newMemberRole.value
  })
  newMemberEmail.value = ''
  newMemberName.value = ''
}

const removeMember = (index: number) => {
  const member = newWorkspace.value.members[index]
  // if (member.role === 'Owner' && newWorkspace.value.members.length === 1) {
  //   alert('Cannot remove the only Owner')
  //   return
  // }
  newWorkspace.value.members.splice(index, 1)
}

const addCategory = () => {
  if (!newCategoryName.value) return
  if (newWorkspace.value.categories.some(c => c.name === newCategoryName.value)) {
    alert('Category already exists')
    return
  }
  newWorkspace.value.categories.push({
    name: newCategoryName.value,
    icon: newCategoryIcon.value
  })
  newCategoryName.value = ''
}

const removeCategory = (index: number) => {
  newWorkspace.value.categories.splice(index, 1)
}

const createWorkspace = () => {
  if (!newWorkspace.value.name.trim()) return

  isCreating.value = true

  setTimeout(() => {
    const newId = String(Date.now())
    workspaces.value.push({
      id: newId,
      name: newWorkspace.value.name,
      type: newWorkspace.value.type,
      variant: newWorkspace.value.variant,
      images: [],
      members: newWorkspace.value.members.map(m => ({
        ...m,
        id: m.id.startsWith('temp-') ? String(Date.now() + Math.random()) : m.id
      })),
      categories: newWorkspace.value.categories
    })

    isCreating.value = false
    showCreateModal.value = false
    router.push('/dashboard')
  }, 500)
}

// Edit Workspace Methods
const openEditModal = (ws: any) => {
  editWorkspace.value = {
    id: ws.id,
    name: ws.name,
    type: ws.type,
    variant: ws.variant || 'devi',
    members: [...(ws.members || [])],
    categories: [...(ws.categories || [])]
  }
  editingWorkspaceId.value = ws.id
  editMemberEmail.value = ''
  editMemberName.value = ''
  editMemberRole.value = 'Member'
  editCategoryName.value = ''
  editCategoryIcon.value = '🏠'
  showEditModal.value = true
}

const addEditMember = () => {
  if (!editMemberEmail.value || !editMemberName.value) return
  if (editWorkspace.value.members.some(m => m.email === editMemberEmail.value)) {
    alert('Member already exists')
    return
  }
  editWorkspace.value.members.push({
    id: `temp-${Date.now()}`,
    name: editMemberName.value,
    email: editMemberEmail.value,
    role: editMemberRole.value
  })
  editMemberEmail.value = ''
  editMemberName.value = ''
}

const removeEditMember = (index: number) => {
  const member = editWorkspace.value.members[index]
  if (member.role === 'Owner' && editWorkspace.value.members.length === 1) {
    alert('Cannot remove the only Owner')
    return
  }
  editWorkspace.value.members.splice(index, 1)
}

const addEditCategory = () => {
  if (!editCategoryName.value) return
  if (editWorkspace.value.categories.some(c => c.name === editCategoryName.value)) {
    alert('Category already exists')
    return
  }
  editWorkspace.value.categories.push({
    name: editCategoryName.value,
    icon: editCategoryIcon.value
  })
  editCategoryName.value = ''
}

const removeEditCategory = (index: number) => {
  editWorkspace.value.categories.splice(index, 1)
}

const updateWorkspace = () => {
  if (!editWorkspace.value.name.trim()) return

  isUpdating.value = true

  setTimeout(() => {
    const index = workspaces.value.findIndex(w => w.id === editingWorkspaceId.value)
    if (index !== -1) {
      // workspaces.value[index] = {
      //   ...workspaces.value[index],
      //   name: editWorkspace.value.name,
      //   type: editWorkspace.value.type,
      //   variant: editWorkspace.value.variant,
      //   members: editWorkspace.value.members.map(m => ({
      //     ...m,
      //     id: m.id.startsWith('temp-') ? String(Date.now() + Math.random()) : m.id
      //   })),
      //   categories: editWorkspace.value.categories
      // }
    }

    isUpdating.value = false
    showEditModal.value = false
    workspaces.value = [...workspaces.value]
  }, 500)
}

// View Details
const viewWorkspaceDetails = (ws: any) => {
  selectedWorkspace.value = ws
  showDetailsModal.value = true
}

// Delete Workspace
const confirmDelete = (ws: any) => {
  deleteWorkspace.value = ws
  showDeleteModal.value = true
}

const confirmDeleteWorkspace = () => {
  const index = workspaces.value.findIndex(w => w.id === deleteWorkspace.value.id)
  if (index !== -1) {
    workspaces.value.splice(index, 1)
  }
  showDeleteModal.value = false
  deleteWorkspace.value = null
  // Refresh the view
  workspaces.value = [...workspaces.value]
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('selectedWorkspace')
  router.push('/login')
}

// Check for saved workspace
onMounted(() => {
  const savedWorkspace = localStorage.getItem('selectedWorkspace')
  if (savedWorkspace && workspaces.value.some(w => w.id === savedWorkspace)) {
    // Uncomment to auto-redirect
    // router.push('/dashboard')
  }
})
</script>

<style scoped>
/* ... (all existing styles remain the same, plus the following additions) ... */

/* Card Actions */
.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.workspace-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-muted);
}

.action-btn:hover {
  transform: scale(1.1);
}

.edit-btn:hover {
  background: #3b82f6;
  color: white;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
}

.view-btn:hover {
  background: #8b5cf6;
  color: white;
}

/* Delete Modal */
.modal-sm {
  max-width: 440px;
}

.delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.delete-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-message {
  font-size: 1rem;
  color: var(--text-primary);
  text-align: center;
  margin: 0;
}

.delete-warning {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  margin: 0;
}

.btn-delete {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-delete:hover {
  background: #dc2626;
  transform: scale(1.02);
}

.workspace-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* ========================================
   BACKGROUND DECOR
   ======================================== */
.bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}

.orb-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  background: var(--accent-primary);
  animation: float-orb 8s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  background: #8b5cf6;
  animation: float-orb 10s ease-in-out infinite reverse;
}

@keyframes float-orb {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* ========================================
   CONTAINER
   ======================================== */
.workspace-container {
  position: relative;
  width: 100%;
  max-width: 1100px;
  z-index: 1;
}

/* ========================================
   HEADER
   ======================================== */
.workspace-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.greeting {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.greeting-wave {
  display: inline-block;
  animation: wave 2.5s ease-in-out infinite;
}

@keyframes wave {

  0%,
  100% {
    transform: rotate(0deg);
  }

  10% {
    transform: rotate(14deg);
  }

  20% {
    transform: rotate(-8deg);
  }

  30% {
    transform: rotate(14deg);
  }

  40% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(10deg);
  }
}

.greeting-name {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* ========================================
   QUICK STATS
   ======================================== */
.quick-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 1.5rem;
  background: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 2.5rem;
  background: var(--border-color);
}

/* ========================================
   WORKSPACE GRID
   ======================================== */
.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* ========================================
   WORKSPACE CARD
   ======================================== */
.workspace-card {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.workspace-card:hover {
  transform: translateY(-6px);
}

.card-inner {
  position: relative;
  background: var(--bg-card);
  border-radius: 1.5rem;
  padding: 1.5rem 1.5rem 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 220px;
}

.workspace-card:hover .card-inner {
  border-color: var(--accent-primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.card-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.badge-type {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: var(--accent-primary);
  color: white;
}

.badge-members {
  font-size: 0.6rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: var(--bg-secondary);
  color: var(--text-muted);
}

.badge-categories {
  font-size: 0.6rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: var(--bg-secondary);
  color: var(--text-muted);
}

/* Card Hover Overlay */
.card-hover-overlay {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.workspace-card:hover .card-hover-overlay {
  opacity: 1;
}

.card-hover-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.card-hover-icon {
  color: white;
  transition: transform 0.3s ease;
}

.workspace-card:hover .card-hover-icon {
  transform: translateX(4px);
}

/* ========================================
   CREATE CARD
   ======================================== */
.create-card .card-inner {
  border: 2px dashed var(--border-color);
  background: transparent;
  min-height: 220px;
  justify-content: center;
}

.create-card:hover .card-inner {
  border-color: var(--accent-primary);
  background: rgba(232, 122, 0, 0.03);
}

.create-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.create-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.create-card:hover .create-icon-wrapper {
  background: rgba(232, 122, 0, 0.1);
  transform: scale(1.05);
}

.create-icon {
  width: 28px;
  height: 28px;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.create-card:hover .create-icon {
  color: var(--accent-primary);
}

.create-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.create-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

/* ========================================
   FOOTER
   ======================================== */
.workspace-footer {
  text-align: center;
  padding-top: 1rem;
}

.footer-text {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.footer-link {
  color: var(--accent-primary);
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

/* ========================================
   MODAL
   ======================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.2);
}

.modal-lg {
  max-width: 700px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.member-count,
.category-count {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 0.15rem 0.6rem;
  border-radius: 9999px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(232, 122, 0, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
}

/* Type Selector */
.type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.type-option {
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: 2px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.type-option:hover {
  border-color: var(--text-muted);
}

.type-option.active {
  border-color: var(--accent-primary);
  background: rgba(232, 122, 0, 0.05);
}

.type-emoji {
  font-size: 1.25rem;
}

.type-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
}

.type-option.active .type-label {
  color: var(--accent-primary);
}

/* Members */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
}

.member-details {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
}

.member-email {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.member-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.7rem;
  cursor: pointer;
}

.role-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-remove-member {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-remove-member:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-remove-member:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.add-member {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-add-member {
  padding: 0.4rem 0.75rem;
  border-radius: 0.75rem;
  border: none;
  background: var(--accent-primary);
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.btn-add-member:hover {
  background: var(--accent-hover);
}

/* Categories */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  background: var(--bg-secondary);
  border-radius: 9999px;
  font-size: 0.8rem;
}

.category-icon {
  font-size: 0.9rem;
}

.category-name {
  color: var(--text-primary);
}

.btn-remove-category {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-remove-category:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.add-category {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.category-icon-select {
  padding: 0.4rem 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.8rem;
}

.btn-add-category {
  padding: 0.4rem 0.6rem;
  border-radius: 0.75rem;
  border: none;
  background: var(--accent-primary);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-add-category:hover {
  background: var(--accent-hover);
}

/* Variant Grid */
.variant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.5rem;
}

.variant-option {
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 2px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.variant-option:hover {
  border-color: var(--text-muted);
}

.variant-option.active {
  border-color: var(--accent-primary);
  background: rgba(232, 122, 0, 0.05);
}

.variant-emoji {
  font-size: 1.1rem;
}

.variant-label {
  font-size: 0.55rem;
  font-weight: 500;
  color: var(--text-muted);
}

.variant-option.active .variant-label {
  color: var(--accent-primary);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: var(--bg-secondary);
}

.btn-create {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: none;
  background: var(--accent-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-create:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.02);
}

.btn-create:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: none;
  background: var(--accent-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-secondary {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 768px) {
  .workspace-page {
    padding: 1rem;
  }

  .workspace-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .user-actions {
    justify-content: flex-end;
  }

  .greeting {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .workspace-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .card-inner {
    padding: 1rem 1rem 0.75rem;
    min-height: 180px;
  }

  .create-card .card-inner {
    min-height: 180px;
  }

  .modal {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-lg {
    max-width: 100%;
  }

  .type-selector {
    grid-template-columns: 1fr 1fr;
  }

  .variant-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }

  .quick-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .stat-divider {
    display: none;
  }

  .add-member {
    flex-direction: column;
    width: 100%;
  }

  .add-member .form-input {
    width: 100%;
  }

  .add-category {
    flex-direction: column;
    width: 100%;
  }

  .add-category .form-input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .workspace-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .card-inner {
    min-height: 160px;
    padding: 0.75rem 0.75rem 0.5rem;
  }

  .create-card .card-inner {
    min-height: 160px;
  }

  .create-icon-wrapper {
    width: 44px;
    height: 44px;
  }

  .create-icon {
    width: 22px;
    height: 22px;
  }

  .create-title {
    font-size: 0.85rem;
  }

  .create-subtitle {
    font-size: 0.7rem;
  }

  .greeting {
    font-size: 1.25rem;
  }

  .logo-img {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .member-item {
    flex-direction: column;
    align-items: stretch;
  }

  .member-actions {
    justify-content: flex-end;
  }

  .type-selector {
    grid-template-columns: 1fr;
  }
}

/* Add these styles to the existing <style> section */

/* ========================================
   DETAILS MODAL
   ======================================== */
.modal-details {
  max-width: 560px;
  padding: 0;
  overflow: hidden;
}

.details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.details-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.details-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.details-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.details-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.details-dot {
  color: var(--border-color);
}

.details-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.details-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.details-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-stat-divider {
  width: 1px;
  height: 2.5rem;
  background: var(--border-color);
}

.details-section {
  margin-bottom: 1.5rem;
}

.details-section:last-child {
  margin-bottom: 0;
}

.details-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.details-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.details-section-count {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.details-members-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.details-member-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
}

.details-member-card .member-info {
  flex: 1;
}

.details-categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.details-category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 9999px;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.5rem 0;
  width: 100%;
}

.empty-icon {
  font-size: 1.5rem;
}

.empty-text {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.details-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.details-footer .btn-primary,
.details-footer .btn-secondary {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Categories View in Edit Modal */
.categories-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.categories-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  padding: 0.25rem 0;
}
</style>