import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/common/EmptyState'
import { ProductionOrderDetailModal } from './ProductionOrderDetailModal'
import { MOCK_EQUIPMENT } from '@/mocks/mockData'
import { ProductionOrder } from '@/types'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Info,
  RefreshCw,
  Gauge,
  Thermometer,
  Activity,
  Sliders,
  Check,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

export const ProductionPage: React.FC = () => {
  const { productionOrders, updateProductionOrderStatus } = useAppStore()

  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null)
  const [tempThreshold, setTempThreshold] = useState(45)
  const [vibrationThreshold, setVibrationThreshold] = useState(2.0)
  const [showThresholdSettings, setShowThresholdSettings] = useState(false)

  const activeOrders = productionOrders.filter((o) => o.status === 'running')
  const delayedOrders = productionOrders.filter((o) => o.status === 'delayed')
  const completedOrders = productionOrders.filter((o) => o.status === 'completed')

  // Prepare chart data for planned vs actual output
  const outputChartData = productionOrders.map((o) => ({
    name: o.orderNumber,
    product: o.product,
    Target: o.targetQuantity,
    Produced: o.producedQuantity
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Control & Monitoring"
        description="Autonomous shopfloor telemetry, work cell allocation, and equipment throughput monitoring."
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Plant Operations Module
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowThresholdSettings(!showThresholdSettings)}
              leftIcon={<Sliders className="w-3.5 h-3.5" />}
            >
              Alert Thresholds
            </Button>
            <Button
              size="sm"
              onClick={() => toast.info('New production order entry registered in local queue.')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Work Order
            </Button>
          </div>
        }
      />

      {/* Notice Banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Simulated Shopfloor Telemetry:</span> Production orders, pick-and-place lines, and cycle times are mocked to demonstrate real-time industrial supervision without live physical PLC/SCADA connections.
        </div>
      </div>

      {/* Configurable Thresholds Drawer */}
      {showThresholdSettings && (
        <Card className="p-4 border-blue-300 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 animate-in fade-in-0 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Configurable Telemetry Alert Thresholds
              </h4>
              <p className="text-[11px] text-slate-500">
                Equipment exceeding these limits will trigger automated visual warning states
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span>Max Temp (°C):</span>
                <input
                  type="number"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(Number(e.target.value))}
                  className="w-16 h-7 px-2 border rounded bg-white dark:bg-slate-900 text-center"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>Max Vibration (mm/s):</span>
                <input
                  type="number"
                  step="0.1"
                  value={vibrationThreshold}
                  onChange={(e) => setVibrationThreshold(Number(e.target.value))}
                  className="w-16 h-7 px-2 border rounded bg-white dark:bg-slate-900 text-center"
                />
              </div>

              <Button
                size="xs"
                onClick={() => {
                  toast.success('Threshold limits saved')
                  setShowThresholdSettings(false)
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Operational KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Batches
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {activeOrders.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Running at nominal cycle speed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Delayed Batches
            </span>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {delayedOrders.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              1 feeder jam under maintenance
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Overall Line Health
            </span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              98.4%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Calculated across 4 cells
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Mean Time Between Failures
            </span>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              420 hrs
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ISO-13849 Compliance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Output Chart: Target vs Produced */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Planned vs. Actual Production Output</span>
            </CardTitle>
            <p className="text-xs text-slate-500">
              Target batch volume versus verified shopfloor units produced
            </p>
          </div>
          <span className="text-[11px] text-slate-400">Sample Production Telemetry</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={outputChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Produced" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Equipment Status Telemetry Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>Shopfloor Equipment Telemetry & Health</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_EQUIPMENT.map((eq) => {
            const hasTempWarning = eq.temperatureC > tempThreshold
            const hasVibeWarning = eq.vibrationMmS > vibrationThreshold
            const isWarning = eq.status === 'warning' || hasTempWarning || hasVibeWarning

            return (
              <div
                key={eq.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {eq.name}
                    </h5>
                    <span className="text-[10px] text-slate-400">{eq.line}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isWarning
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : eq.status === 'operational'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {isWarning ? 'Warning' : eq.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Efficiency</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {eq.efficiency}%
                    </span>
                  </div>
                  <ProgressBar value={eq.efficiency} size="sm" variant="auto" />

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-slate-400" /> Temp:
                    </span>
                    <span className={hasTempWarning ? 'font-bold text-red-600' : 'text-slate-700 dark:text-slate-300'}>
                      {eq.temperatureC}°C
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-slate-400" /> Vibration:
                    </span>
                    <span className={hasVibeWarning ? 'font-bold text-red-600' : 'text-slate-700 dark:text-slate-300'}>
                      {eq.vibrationMmS} mm/s
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  Last Serviced: {eq.lastMaintenance}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Production Orders Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Production Work Orders</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any order to view execution stages and detailed quality metrics
            </p>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={() => toast.success('Telemetry polled: All line states refreshed')}
            leftIcon={<RefreshCw className="w-3 h-3" />}
          >
            Poll Lines
          </Button>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {productionOrders.map((order) => {
            const progress = Math.round((order.producedQuantity / order.targetQuantity) * 100)

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-5 space-y-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                      {order.orderNumber}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        {order.product}
                      </h4>
                      <div className="text-[11px] text-slate-400">
                        {order.plantLine} • {order.responsibleTeam}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.anomalyDetected && (
                      <span className="text-[11px] font-semibold text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Anomaly Flagged
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                        order.status === 'running'
                          ? 'bg-blue-50 text-blue-700'
                          : order.status === 'delayed'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {order.delayReason && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs border border-amber-200/60 dark:border-amber-900/60">
                    <span className="font-semibold">Blocker:</span> {order.delayReason}
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      Yield: {order.producedQuantity} / {order.targetQuantity} {order.unit}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {progress}%
                    </span>
                  </div>
                  <ProgressBar value={progress} size="sm" variant="auto" />
                </div>
              </div>
            )
          })}

          {productionOrders.length === 0 && (
            <EmptyState
              icon={<Cpu className="w-6 h-6" />}
              title="No active production work orders"
              description="All manufacturing lines are currently idle. No batches are in flight."
            />
          )}
        </CardContent>
      </Card>

      {/* Production Order Detail Modal */}
      <ProductionOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(orderId, status) => {
          updateProductionOrderStatus(orderId, status)
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status })
          }
        }}
      />
    </div>
  )
}
