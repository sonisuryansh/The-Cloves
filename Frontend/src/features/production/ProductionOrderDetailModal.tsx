import React from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProductionOrder } from '@/types'
import { formatDate } from '@/lib/dates'
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react'
import { toast } from 'sonner'

export interface ProductionOrderDetailModalProps {
  order: ProductionOrder | null
  onClose: () => void
  onUpdateStatus?: (orderId: string, status: ProductionOrder['status']) => void
}

export const ProductionOrderDetailModal: React.FC<ProductionOrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus
}) => {
  if (!order) return null

  const progress = Math.round((order.producedQuantity / order.targetQuantity) * 100)

  return (
    <Dialog
      isOpen={Boolean(order)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
            {order.orderNumber}
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">
            {order.product}
          </span>
        </div>
      }
      description={`${order.plantLine} • Managed by ${order.responsibleTeam}`}
      maxWidth="lg"
      className="p-0"
    >
      <div className="p-6 space-y-6">
        {/* Blocker alert if delayed */}
        {order.delayReason && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Operational Hold / Blocker</span>
            </div>
            <p className="leading-relaxed">{order.delayReason}</p>
          </div>
        )}

        {/* Core Yield & Telemetry Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Batch Progress
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {order.producedQuantity} / {order.targetQuantity} {order.unit} ({progress}%)
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quality Yield
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {order.batchQualityScore || 98.5}%
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Planned Window
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block">
              {formatDate(order.plannedStart, 'MMM d')} – {formatDate(order.plannedEnd, 'MMM d, yyyy')}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Current Status
            </span>
            <span className="inline-block mt-0.5 text-xs font-bold capitalize px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {order.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <ProgressBar value={progress} size="md" variant="auto" />
        </div>

        {/* Production Stages Detailed Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Manufacturing Execution Stages</span>
          </h4>

          <div className="space-y-2">
            {order.stages && order.stages.map((stg, idx) => (
              <div
                key={stg.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200">
                      {stg.name}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      Standard Cycle Time: {stg.durationHours} hours
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-28">
                    <ProgressBar value={stg.completedPercentage} size="sm" variant="auto" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
                      stg.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : stg.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : stg.status === 'delayed'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {stg.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              toast.info('Exporting batch inspection record (PDF)...')
            }}
          >
            Export Batch Certificate
          </Button>

          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
