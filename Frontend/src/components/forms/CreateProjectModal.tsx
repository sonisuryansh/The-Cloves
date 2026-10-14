import React, { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAppStore } from '@/stores/useAppStore'
import { PROJECT_TEMPLATES } from '@/mocks/mockData'
import { ProjectCategory } from '@/types'
import { Check, ChevronRight, ChevronLeft, FolderPlus, Layers, Calendar, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const CreateProjectModal: React.FC = () => {
  const {
    isCreateProjectModalOpen,
    setCreateProjectModalOpen,
    createProjectFromTemplate,
    addProject,
    currentUser
  } = useAppStore()

  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(PROJECT_TEMPLATES[0].id)
  const [dueDate, setDueDate] = useState('2026-12-15')
  const [nextMilestone, setNextMilestone] = useState('')
  const [error, setError] = useState('')

  if (!isCreateProjectModalOpen) return null

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('Project name is required')
        return
      }
      setError('')
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleFinish = () => {
    let newProj
    if (selectedTemplateId && selectedTemplateId !== 'tmpl-4') {
      newProj = createProjectFromTemplate(
        selectedTemplateId,
        name.trim(),
        description.trim(),
        dueDate
      )
    } else {
      newProj = addProject({
        name: name.trim(),
        description: description.trim(),
        category: 'Software',
        status: 'active',
        owner: currentUser,
        startDate: new Date().toISOString().split('T')[0],
        dueDate,
        nextMilestone: nextMilestone.trim() || 'Phase 1 Architecture Validation',
        tags: ['Custom', 'Q4-2026']
      })
    }

    toast.success(`Project "${newProj.name}" created with starter deliverables!`)
    setCreateProjectModalOpen(false)
    setName('')
    setDescription('')
    setNextMilestone('')
    setStep(1)
    navigate(`/projects/${newProj.id}`)
  }

  return (
    <Dialog
      isOpen={isCreateProjectModalOpen}
      onClose={() => {
        setCreateProjectModalOpen(false)
        setStep(1)
      }}
      title="Create New Project"
      description={`Step ${step} of 3: ${
        step === 1 ? 'Project Details' : step === 2 ? 'Select Engineering Template' : 'Timeline & Schedule'
      }`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Step Progress Pills */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Name and Description */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Name *
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. Subsea Telemetry Gateway Subsystem"
                error={error}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Engineering Scope
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe project objectives, key hardware deliverables, or system scope..."
                className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Template Selection */}
        {step === 2 && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select an Engineering Template or start from scratch:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
              {PROJECT_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {tmpl.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {tmpl.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tmpl.category}
                      </span>
                      {tmpl.initialTaskTitles.length > 0 && (
                        <span className="text-[10px] text-slate-400">
                          +{tmpl.initialTaskTitles.length} starter tasks
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Dates & Target Milestone */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Lead
                </label>
                <Input value={currentUser.name} disabled />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Milestone (Optional)
              </label>
              <Input
                value={nextMilestone}
                onChange={(e) => setNextMilestone(e.target.value)}
                placeholder="e.g. Critical Design Review & Component Bench Test"
              />
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateProjectModalOpen(false)}
            >
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleFinish}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Initialize Project
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  )
}
