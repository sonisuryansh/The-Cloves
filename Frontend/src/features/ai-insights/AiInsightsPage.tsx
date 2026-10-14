import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Info,
  ArrowRight,
  Filter,
  Check,
  X,
  BrainCircuit,
  TrendingDown,
  Layers,
  Clock
} from 'lucide-react'
import { formatDate } from '@/lib/dates'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { InsightCategory, InsightSeverity } from '@/types'

export const AiInsightsPage: React.FC = () => {
  const { aiInsights, markInsightReviewed, dismissInsight, projects } = useAppStore()
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all')

  const navigate = useNavigate()

  const filtered = aiInsights.filter((ins) => {
    if (severityFilter !== 'all' && ins.severity !== severityFilter) return false
    if (categoryFilter !== 'all' && ins.category !== categoryFilter) return false
    if (projectFilter !== 'all' && ins.projectReference && !ins.projectReference.includes(projectFilter)) return false
    if (statusFilter === 'unreviewed' && ins.isReviewed) return false
    if (statusFilter === 'reviewed' && !ins.isReviewed) return false
    return true
  })

  const criticalCount = aiInsights.filter((i) => i.severity === 'critical' && !i.isReviewed).length
  const highCount = aiInsights.filter((i) => i.severity === 'high' && !i.isReviewed).length
  const reviewedCount = aiInsights.filter((i) => i.isReviewed).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Intelligence & Risk Analysis"
        description="Predictive risk scoring, bottleneck detection, and simulated operational recommendations."
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Simulated Diagnostic Engine
          </span>
        }
      />

      {/* Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Deterministic Diagnostic Models:</span> Insights are derived from deterministic rules across task dependencies, milestone dates, and simulated plant cycle logs. All predictions represent sample analytics, not live neural network outputs.
        </div>
      </div>

      {/* Risk Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-red-200 dark:border-red-900/40">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Critical Risks
            </span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">
              {criticalCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Immediate blockers on critical path
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900/40">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> High Urgency
            </span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {highCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Workload and latency anomalies
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Acknowledged
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {reviewedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Marked as reviewed by engineering
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Health Index
            </span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">
              86 / 100
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Overall project schedule stability
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Dimensional Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="deadline_risk">Deadline Risk</option>
              <option value="bottleneck">Bottleneck</option>
              <option value="workload_imbalance">Workload Imbalance</option>
              <option value="production_anomaly">Production Anomaly</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="unreviewed">Active / Unreviewed</option>
              <option value="reviewed">Acknowledged</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 font-medium">
          Showing {filtered.length} of {aiInsights.length} insights
        </span>
      </div>

      {/* Detailed Insights Feed */}
      <div className="space-y-4">
        {filtered.map((insight) => (
          <Card key={insight.id} className="overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      insight.severity === 'critical'
                        ? 'bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400'
                        : insight.severity === 'high'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {insight.title}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Context: {insight.projectReference} • Generated {formatDate(insight.createdAt, 'MMM d, HH:mm')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      insight.severity === 'critical'
                        ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                        : insight.severity === 'high'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                    }`}
                  >
                    {insight.severity} risk
                  </span>

                  {insight.isReviewed && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {insight.description}
              </p>

              {/* Delineation: Detected Facts vs Predicted Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                    <span>Deterministic Telemetry & Observations</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {insight.detectedFacts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block mb-2 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Predicted Trajectory & Schedule Slippage</span>
                  </span>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    {insight.predictedImpact}
                  </p>
                </div>
              </div>

              {/* Recommendation Action Row */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-indigo-950 dark:text-indigo-200">
                  <span className="font-bold">Recommended Engineering Action: </span>
                  <span>{insight.recommendedAction}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="xs"
                    onClick={() => {
                      if (insight.actionTargetRoute) {
                        navigate(insight.actionTargetRoute)
                      } else {
                        navigate('/tasks')
                      }
                    }}
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    {insight.actionLabel}
                  </Button>

                  {!insight.isReviewed && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        markInsightReviewed(insight.id)
                        toast.success('Insight acknowledged and marked as reviewed')
                      }}
                    >
                      Acknowledge
                    </Button>
                  )}

                  <button
                    onClick={() => {
                      dismissInsight(insight.id)
                      toast.info('Insight dismissed from active feed')
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <EmptyState
            icon={<Sparkles className="w-6 h-6" />}
            title="No insights match your active filters"
            description="All monitored parameters are either within safe baseline tolerances or excluded by your filter criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setSeverityFilter('all')
              setCategoryFilter('all')
              setProjectFilter('all')
              setStatusFilter('all')
            }}
          />
        )}
      </div>
    </div>
  )
}
