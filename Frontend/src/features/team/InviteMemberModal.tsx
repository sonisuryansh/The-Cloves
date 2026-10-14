import React, { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User } from '@/types'
import { UserPlus, Shield, Info, Check } from 'lucide-react'
import { toast } from 'sonner'

export interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (user: User) => void
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Embedded Systems Engineer')
  const [department, setDepartment] = useState('Hardware & Firmware')
  const [permissions, setPermissions] = useState<string[]>([
    'Create & Edit Tasks',
    'View Production Telemetry'
  ])

  if (!isOpen) return null

  const allPermissions = [
    'Project Administration',
    'Create & Edit Tasks',
    'View Production Telemetry',
    'Manage Equipment & Work Orders',
    'Acknowledge AI Risk Insights'
  ]

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm))
    } else {
      setPermissions([...permissions, perm])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter name and email address')
      return
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
      role,
      department,
      status: 'invited',
      joinedDate: new Date().toISOString().split('T')[0],
      permissions
    }

    onInvite(newUser)
    toast.success(`Invitation generated for ${newUser.name}`)
    setName('')
    setEmail('')
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description="Add an engineer, operator, or manager to the PulseCore workspace."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notice Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <span>
            Prototype Simulation: Invitations are registered in local memory and demonstrated visually. No live emails are dispatched.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Hayes"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Work Email *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan.h@pulsecore.internal"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Role / Title
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Robotics Dev"
            />
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Assigned Roles & Access Rights
          </label>
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            {allPermissions.map((perm) => {
              const isChecked = permissions.includes(perm)
              return (
                <div
                  key={perm}
                  onClick={() => togglePermission(perm)}
                  className="flex items-center gap-2.5 text-xs cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{perm}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
