import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/stores/useAppStore'
import {
  getApiClientConfig,
  updateApiClientConfig,
  resetApiClientConfig,
  ApiClientConfig,
  workspaceService
} from '@/services'
import {
  User,
  Building2,
  Bell,
  ShieldCheck,
  Key,
  Database,
  Download,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Sliders,
  Laptop,
  Lock,
  Globe,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

type SettingsTab = 'profile' | 'workspace' | 'notifications' | 'appearance' | 'api' | 'security'

export const SettingsPage: React.FC = () => {
  const { currentUser, currentWorkspace, setCurrentWorkspace } = useAppStore()

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  // Profile Form state
  const [profileName, setProfileName] = useState(currentUser.name)
  const [profileRole, setProfileRole] = useState(currentUser.role)
  const [profileDept, setProfileDept] = useState(currentUser.department)
  const [timezone, setTimezone] = useState('America/New_York (EST / UTC-5)')
  const [language, setLanguage] = useState('en-US (English)')

  // Workspace Form state
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace.name)
  const [workspaceRegion, setWorkspaceRegion] = useState('us-east-1 (N. Virginia, USA)')

  // Notification Toggles
  const [notifyAiRisks, setNotifyAiRisks] = useState(true)
  const [notifyProductionHolds, setNotifyProductionHolds] = useState(true)
  const [notifyTaskMentions, setNotifyTaskMentions] = useState(true)
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false)
  const [desktopSound, setDesktopSound] = useState(true)

  // Appearance
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [accentColor, setAccentColor] = useState<'blue' | 'indigo' | 'emerald' | 'amber'>('blue')

  // API Client Configuration State
  const [apiState, setApiState] = useState<ApiClientConfig>(getApiClientConfig())
  const [copiedKey, setCopiedKey] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Sync API state if changed externally
  useEffect(() => {
    setApiState(getApiClientConfig())
  }, [])

  const handleUpdateApiConfig = (updates: Partial<ApiClientConfig>) => {
    const updated = updateApiClientConfig(updates)
    setApiState(updated)
    toast.success('API configuration updated')
  }

  const handleResetApiConfig = () => {
    const reset = resetApiClientConfig()
    setApiState(reset)
    toast.info('API configuration reset to defaults')
  }

  const handleCopyKey = () => {
    if (apiState.apiKey) {
      navigator.clipboard?.writeText(apiState.apiKey)
      setCopiedKey(true)
      toast.success('API token copied to clipboard')
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  const handleExportWorkspace = async () => {
    try {
      setIsExporting(true)
      const dataStr = await workspaceService.exportWorkspaceData()
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `thecloves_export_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Workspace JSON export downloaded')
    } catch {
      toast.error('Failed to export workspace data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile settings updated successfully')
  }

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentWorkspace({
      ...currentWorkspace,
      name: workspaceName
    })
    toast.success('Workspace details saved')
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'workspace', label: 'Workspace', icon: <Building2 className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Sliders className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'api', label: 'API & Services', icon: <Database className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Audit', icon: <ShieldCheck className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Settings & Platform Configuration"
        description="Configure user profile, appearance, workspace parameters, notification preferences, and centralized API services."
      />

      {/* Modern Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: Profile & Account */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                User Profile & Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar name={currentUser.name} src={currentUser.avatar} size="lg" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{profileName}</h4>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {profileRole}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Email (Managed by SSO)
                  </label>
                  <Input value={currentUser.email} disabled />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Title
                  </label>
                  <Input
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={profileDept}
                    onChange={(e) => setProfileDept(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Software Architecture">Software Architecture</option>
                    <option value="Production Control">Production Control</option>
                    <option value="Hardware & Firmware">Hardware & Firmware</option>
                    <option value="Quality Engineering">Quality Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Local Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York (EST / UTC-5)">America/New_York (EST / UTC-5)</option>
                    <option value="America/Los_Angeles (PST / UTC-8)">America/Los_Angeles (PST / UTC-8)</option>
                    <option value="Europe/London (BST / UTC+1)">Europe/London (BST / UTC+1)</option>
                    <option value="Europe/Berlin (CET / UTC+1)">Europe/Berlin (CET / UTC+1)</option>
                    <option value="Asia/Kolkata (IST / UTC+5:30)">Asia/Kolkata (IST / UTC+5:30)</option>
                    <option value="Asia/Tokyo (JST / UTC+9)">Asia/Tokyo (JST / UTC+9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Interface Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en-US (English)">en-US (English)</option>
                    <option value="de-DE (Deutsch)">de-DE (Deutsch)</option>
                    <option value="ja-JP (日本語)">ja-JP (日本語)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit">Save Profile Changes</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* TAB 2: Workspace & Subscription */}
      {activeTab === 'workspace' && (
        <form onSubmit={handleSaveWorkspace} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Workspace Details</span>
                <span className="text-xs font-mono font-normal text-slate-500">
                  ID: {currentWorkspace.id}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Workspace Name
                  </label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Workspace Code
                  </label>
                  <Input value={currentWorkspace.code} disabled />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Data Residency Region
                  </label>
                  <select
                    value={workspaceRegion}
                    onChange={(e) => setWorkspaceRegion(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="us-east-1 (N. Virginia, USA)">us-east-1 (N. Virginia, USA)</option>
                    <option value="eu-central-1 (Frankfurt, EU)">eu-central-1 (Frankfurt, EU)</option>
                    <option value="ap-northeast-1 (Tokyo, Japan)">ap-northeast-1 (Tokyo, Japan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Active Membership Seats
                  </label>
                  <Input value={`${currentWorkspace.membersCount} / 50 Allocated Seats`} disabled />
                </div>
              </div>

              {/* Subscription Overview */}
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Tier: {currentWorkspace.plan}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Includes real-time telemetry processing, unlimited production lines, and AI root cause models.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Billing tier is managed by organizational enterprise agreement.')}
                >
                  Manage Subscription
                </Button>
              </div>

              {/* Data Export */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Export Workspace Snapshot
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Download full JSON repository backup including tasks, projects, telemetry logs, and users.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportWorkspace}
                  disabled={isExporting}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  {isExporting ? 'Exporting...' : 'Export JSON'}
                </Button>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit">Update Workspace</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* TAB 3: Appearance & Display */}
      {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Appearance & Interface Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Layout Density */}
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Layout Density</h5>
                <p className="text-xs text-slate-500">
                  Control padding and row spacing in task lists and Kanban cards.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDensity('comfortable')
                    toast.success('Density set to Comfortable')
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    density === 'comfortable'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDensity('compact')
                    toast.success('Density set to Compact')
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                    density === 'compact'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            {/* Accent Theme */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Accent Theme
              </h5>
              <p className="text-xs text-slate-500 mb-3">
                Curated palette tailored for industrial engineering and operational dashboards.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'blue', label: 'Pulse Blue', color: 'bg-blue-600' },
                  { id: 'indigo', label: 'Indigo Electric', color: 'bg-indigo-600' },
                  { id: 'emerald', label: 'Industrial Mint', color: 'bg-emerald-600' },
                  { id: 'amber', label: 'Telemetry Amber', color: 'bg-amber-600' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAccentColor(item.id as any)
                      toast.success(`Theme accent set to ${item.label}`)
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium transition-all ${
                      accentColor === item.id
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${item.color} shrink-0`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: Notifications & Alert Routing */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Notification Preferences & Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  id: 'ai-alerts',
                  title: 'AI Anomaly & Path Delay Warnings',
                  desc: 'Immediate dispatch when AI detects critical variance in milestone delivery dates.',
                  checked: notifyAiRisks,
                  onChange: setNotifyAiRisks
                },
                {
                  id: 'prod-holds',
                  title: 'Production Plant Holds & Equipment Alarms',
                  desc: 'Notifications when sensor vibration or thermal limits breach operational tolerances.',
                  checked: notifyProductionHolds,
                  onChange: setNotifyProductionHolds
                },
                {
                  id: 'task-mentions',
                  title: 'Task Assignment & Direct Mentions',
                  desc: 'Alerts when team members tag you in task discussions or reassign deliverable items.',
                  checked: notifyTaskMentions,
                  onChange: setNotifyTaskMentions
                },
                {
                  id: 'digest',
                  title: 'Weekly Executive Summary Digest',
                  desc: 'Aggregated progress report sent every Monday at 08:00 AM.',
                  checked: notifyWeeklyDigest,
                  onChange: setNotifyWeeklyDigest
                },
                {
                  id: 'sound',
                  title: 'Interactive Audible Tone',
                  desc: 'Play subtle micro-audio cue when urgent telemetry notifications arrive.',
                  checked: desktopSound,
                  onChange: setDesktopSound
                }
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="pr-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => {
                      item.onChange(e.target.checked)
                      toast.success('Notification preference saved')
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer mt-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: Centralized API & Service Configuration (Phase 12 Architecture) */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Centralized API & Service Layer Configuration</span>
                </CardTitle>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {apiState.mode === 'mock' ? 'Mock Repository Active' : 'Live Gateway Active'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Architectural Separation:
                </span>
                <p className="text-slate-500 leading-relaxed">
                  The Cloves features access data through strongly-typed repository contracts (
                  <code className="text-blue-600 font-mono">IProjectService</code>,{' '}
                  <code className="text-blue-600 font-mono">ITaskService</code>,{' '}
                  <code className="text-blue-600 font-mono">IProductionService</code>). Switching to a live backend requires only updating the configuration below without touching any UI code.
                </p>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Data Connection Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdateApiConfig({ mode: 'mock' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      apiState.mode === 'mock'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Mock Repositories
                      </span>
                      {apiState.mode === 'mock' && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Local in-memory datasets with full CRUD simulation.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateApiConfig({ mode: 'live' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      apiState.mode === 'live'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Live Remote Backend
                      </span>
                      {apiState.mode === 'live' && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Connect to real REST API gateway with OAuth or Bearer token.
                    </p>
                  </button>
                </div>
              </div>

              {/* API Base URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API Gateway Base URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={apiState.baseUrl}
                    onChange={(e) => handleUpdateApiConfig({ baseUrl: e.target.value })}
                    placeholder="https://api.thecloves.internal/v1"
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetApiConfig}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Simulated Latency Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Simulated Network Latency (Mock Pipeline)
                  </label>
                  <span className="font-mono font-bold text-blue-600">
                    {apiState.mockLatencyMs} ms
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Add artificial delay to test asynchronous loading skeletons and user experience under realistic network conditions.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 300, 800, 1500].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      onClick={() => handleUpdateApiConfig({ mockLatencyMs: ms })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                        apiState.mockLatencyMs === ms
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {ms === 0 ? '0ms (Instant)' : `${ms}ms`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Simulation Toggle */}
              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Error Simulation Toggle (Resilience Testing)</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                    Forces simulated network faults (HTTP 503) to test ErrorState fallbacks and retry buttons.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={apiState.simulateErrors}
                  onChange={(e) => handleUpdateApiConfig({ simulateErrors: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300 cursor-pointer"
                />
              </div>

              {/* API Token Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Client Authorization Key
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={apiState.apiKey || ''}
                    readOnly
                    type="password"
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyKey}
                    leftIcon={copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedKey ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: Security & Audit Logs */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Security & Authentication Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">
                      Two-Factor Authentication (2FA)
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Mandatory hardware security key or TOTP token required for plant telemetry overrides.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Enforced
                </span>
              </div>

              {/* Active Sessions */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">
                  Active Workspace Sessions
                </h5>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    {
                      device: 'Windows 11 Workstation (Current)',
                      location: 'Detroit Plant Line 04 Internal Subnet (10.24.110.14)',
                      active: 'Active now',
                      icon: <Laptop className="w-4 h-4 text-emerald-500" />
                    },
                    {
                      device: 'Field Rugged Tablet (Panasonic Toughbook)',
                      location: 'Plant Gantry Bay C (10.24.110.89)',
                      active: '2 hours ago',
                      icon: <Laptop className="w-4 h-4 text-slate-400" />
                    }
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {s.icon}
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {s.device}
                          </span>
                          <span className="text-[11px] text-slate-500">{s.location}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        {s.active}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Security Audit Log */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">
                  Security Audit Events
                </h5>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {[
                    {
                      event: 'API Token generated for manufacturing gateway',
                      actor: 'alex.morgan@thecloves.internal',
                      time: 'Today at 14:22 UTC',
                      status: 'Success'
                    },
                    {
                      event: 'Production hold acknowledged for Order #PO-9021',
                      actor: 'marcus.v@thecloves.internal',
                      time: 'Today at 11:05 UTC',
                      status: 'Success'
                    },
                    {
                      event: 'New team member invited: Jordan Hayes',
                      actor: 'alex.morgan@thecloves.internal',
                      time: 'Yesterday at 16:45 UTC',
                      status: 'Success'
                    }
                  ].map((evt, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {evt.event}
                        </span>
                        <span className="text-slate-500">{evt.actor}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-slate-400 block">{evt.time}</span>
                        <span className="text-emerald-600 font-semibold">{evt.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
