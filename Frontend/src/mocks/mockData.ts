import {
  User,
  Project,
  Task,
  ProductionOrder,
  AIInsight,
  ActivityEvent,
  Workspace
} from '@/types'

export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@pulsecore.internal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    role: 'Lead Systems Engineer',
    department: 'Engineering',
    status: 'active',
    joinedDate: '2026-01-10',
    permissions: ['Project Administration', 'Create & Edit Tasks', 'Acknowledge AI Risk Insights']
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@pulsecore.internal',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=80',
    role: 'Solutions Architect',
    department: 'Software Architecture',
    status: 'active',
    joinedDate: '2026-02-14',
    permissions: ['Project Administration', 'Create & Edit Tasks', 'View Production Telemetry']
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.v@pulsecore.internal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    role: 'Plant Operations Director',
    department: 'Production Control',
    status: 'active',
    joinedDate: '2025-11-01',
    permissions: ['Manage Equipment & Work Orders', 'View Production Telemetry', 'Create & Edit Tasks']
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.r@pulsecore.internal',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&auto=format&fit=crop&q=80',
    role: 'Senior Embedded Engineer',
    department: 'Hardware & Firmware',
    status: 'active',
    joinedDate: '2026-03-20',
    permissions: ['Create & Edit Tasks', 'View Production Telemetry']
  },
  {
    id: 'usr-5',
    name: 'Liam Patel',
    email: 'liam.p@pulsecore.internal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80',
    role: 'Quality Assurance Lead',
    department: 'Quality Engineering',
    status: 'active',
    joinedDate: '2026-04-05',
    permissions: ['Create & Edit Tasks', 'Acknowledge AI Risk Insights', 'View Production Telemetry']
  }
]

export const CURRENT_USER: User = MOCK_USERS[0]

export const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'PulseCore Robotics HQ', code: 'PCR-HQ', plan: 'Enterprise Enterprise', membersCount: 42 },
  { id: 'ws-2', name: 'Plant Line 04 - Detroit', code: 'PL-04', plan: 'Manufacturing Pro', membersCount: 18 },
  { id: 'ws-3', name: 'Autonomous Systems Lab', code: 'ASL', plan: 'R&D Tier', membersCount: 12 }
]

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    key: 'ALPHA',
    name: 'Autonomous Drone Navigation Subsystem',
    description: 'Next-generation LiDAR sensor fusion, optical flow calibration, and edge obstacle avoidance stack.',
    category: 'Hardware',
    status: 'active',
    health: 'at-risk',
    owner: MOCK_USERS[0],
    startDate: '2026-09-01',
    dueDate: '2026-11-15',
    nextMilestone: 'LiDAR-IMU Sensor Sync & Bench Testing',
    tags: ['Robotics', 'LiDAR', 'Critical Path']
  },
  {
    id: 'proj-2',
    key: 'BETA',
    name: 'Shopfloor Telemetry Gateway v2.4',
    description: 'MQTT to OPC-UA streaming pipeline with real-time anomaly filtering for CNC cell arrays.',
    category: 'Plant Operations',
    status: 'active',
    health: 'on-track',
    owner: MOCK_USERS[2],
    startDate: '2026-09-15',
    dueDate: '2026-10-30',
    nextMilestone: 'Edge Gateway Firmware 2.4 Golden Image',
    tags: ['IIoT', 'Shopfloor', 'Telemetry']
  },
  {
    id: 'proj-3',
    key: 'GAMMA',
    name: 'AI Predictive Maintenance Engine',
    description: 'Vibration & thermal degradation forecasting using lightweight edge Bayesian filters.',
    category: 'Software',
    status: 'active',
    health: 'needs-review',
    owner: MOCK_USERS[1],
    startDate: '2026-08-10',
    dueDate: '2026-11-30',
    nextMilestone: 'Model Quantization & ONNX Export',
    tags: ['AI/ML', 'Predictive', 'Inference']
  },
  {
    id: 'proj-4',
    key: 'DELTA',
    name: 'Robotic Arm Controller Firmware 4.0',
    description: 'Ultra-low latency RTOS deterministic motion control kernel with CAN-FD bus communication.',
    category: 'Hardware',
    status: 'active',
    health: 'on-track',
    owner: MOCK_USERS[3],
    startDate: '2026-09-20',
    dueDate: '2026-12-10',
    nextMilestone: 'RTOS Task Jitter Benchmark Verification',
    tags: ['Firmware', 'RTOS', 'CAN-FD']
  }
]

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    key: 'ALPHA-101',
    projectId: 'proj-1',
    projectName: 'Autonomous Drone Navigation Subsystem',
    title: 'Calibrate optical flow camera with Kalman filter',
    description: 'Resolve high frequency drift when operating in low light ambient test chambers. Requires firmware rev 3.1.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: MOCK_USERS[0],
    reporter: MOCK_USERS[1],
    startDate: '2026-10-10',
    dueDate: '2026-10-15', // Tomorrow!
    labels: ['Calibration', 'Sensors', 'Urgent'],
    subtasks: [
      { id: 'st-1', title: 'Capture raw sensor frame timestamps', completed: true },
      { id: 'st-2', title: 'Tune covariance matrix weights', completed: true },
      { id: 'st-3', title: 'Validate against mock optical target array', completed: false }
    ],
    dependencies: [],
    comments: [
      {
        id: 'c-1',
        user: MOCK_USERS[3],
        text: 'Lens distortion matrices have been uploaded to the shared calibration repo.',
        createdAt: '2026-10-13T14:30:00Z'
      }
    ],
    estimatedHours: 16,
    createdAt: '2026-10-10T09:00:00Z'
  },
  {
    id: 'task-102',
    key: 'ALPHA-102',
    projectId: 'proj-1',
    projectName: 'Autonomous Drone Navigation Subsystem',
    title: 'Replace burnt PCB breakout on bench rig 3',
    description: 'Hardware bench rig 3 suffered transient overvoltage during inductive motor load testing.',
    status: 'todo',
    priority: 'high',
    assignee: MOCK_USERS[3],
    reporter: MOCK_USERS[0],
    startDate: '2026-10-12',
    dueDate: '2026-10-14', // Due Today!
    labels: ['Hardware', 'Blocker'],
    subtasks: [
      { id: 'st-4', title: 'Inspect TVS diode circuit', completed: false },
      { id: 'st-5', title: 'Resolder 3.3V LDO regulator', completed: false }
    ],
    dependencies: ['ALPHA-101'],
    comments: [],
    estimatedHours: 6,
    createdAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'task-103',
    key: 'BETA-44',
    projectId: 'proj-2',
    projectName: 'Shopfloor Telemetry Gateway v2.4',
    title: 'Configure TLS certificates for line 2 OPC-UA nodes',
    description: 'Generate 2048-bit mTLS certificates signed by the internal plant root authority.',
    status: 'in_progress',
    priority: 'medium',
    assignee: MOCK_USERS[0],
    reporter: MOCK_USERS[2],
    startDate: '2026-10-11',
    dueDate: '2026-10-16',
    labels: ['Security', 'Infra'],
    subtasks: [
      { id: 'st-6', title: 'Issue client certificates', completed: true },
      { id: 'st-7', title: 'Verify handshake latency', completed: false }
    ],
    dependencies: [],
    comments: [],
    estimatedHours: 8,
    createdAt: '2026-10-11T13:00:00Z'
  },
  {
    id: 'task-104',
    key: 'GAMMA-89',
    projectId: 'proj-3',
    projectName: 'AI Predictive Maintenance Engine',
    title: 'Verify FFT vibration frequency anomaly thresholds',
    description: 'Align bearing fault harmonics (BPFO/BPFI) with simulated spindle vibration sensor data.',
    status: 'in_review',
    priority: 'high',
    assignee: MOCK_USERS[1],
    reporter: MOCK_USERS[0],
    startDate: '2026-10-08',
    dueDate: '2026-10-18',
    labels: ['Analytics', 'Sensors'],
    subtasks: [
      { id: 'st-8', title: 'Simulate bearing inner race defect', completed: true },
      { id: 'st-9', title: 'Benchmark false positive alarm rate', completed: true }
    ],
    dependencies: [],
    comments: [
      {
        id: 'c-2',
        user: MOCK_USERS[4],
        text: 'Precision matches ISO 10816 standards across test runs 4 through 9.',
        createdAt: '2026-10-13T16:45:00Z'
      }
    ],
    estimatedHours: 20,
    createdAt: '2026-10-08T10:00:00Z'
  },
  {
    id: 'task-105',
    key: 'DELTA-12',
    projectId: 'proj-4',
    projectName: 'Robotic Arm Controller Firmware 4.0',
    title: 'Implement deterministic CAN-FD frame packetizer',
    description: 'Zero-copy ring buffer for 64-byte payload transmission at 5 Mbps baud.',
    status: 'done',
    priority: 'high',
    assignee: MOCK_USERS[0],
    reporter: MOCK_USERS[3],
    startDate: '2026-10-06',
    dueDate: '2026-10-13',
    completedAt: '2026-10-13T17:00:00Z',
    labels: ['Firmware', 'RTOS'],
    subtasks: [
      { id: 'st-10', title: 'DMA descriptor ring setup', completed: true },
      { id: 'st-11', title: 'Interrupt handler profiling', completed: true }
    ],
    dependencies: [],
    comments: [],
    estimatedHours: 12,
    createdAt: '2026-10-06T08:30:00Z'
  },
  {
    id: 'task-106',
    key: 'DELTA-15',
    projectId: 'proj-4',
    projectName: 'Robotic Arm Controller Firmware 4.0',
    title: 'Profile safety watchdog timeout during emergency halt',
    description: 'Ensure hardware interlock trips within 12 milliseconds of loss-of-pulse beacon.',
    status: 'done',
    priority: 'urgent',
    assignee: MOCK_USERS[4],
    reporter: MOCK_USERS[0],
    startDate: '2026-10-07',
    dueDate: '2026-10-12',
    completedAt: '2026-10-12T15:20:00Z',
    labels: ['Safety', 'Compliance'],
    subtasks: [
      { id: 'st-12', title: 'Oscilloscope pin timing capture', completed: true }
    ],
    dependencies: [],
    comments: [],
    estimatedHours: 14,
    createdAt: '2026-10-07T11:00:00Z'
  },
  {
    id: 'task-107',
    key: 'BETA-52',
    projectId: 'proj-2',
    projectName: 'Shopfloor Telemetry Gateway v2.4',
    title: 'Stress test buffer overflow on 10,000 tag telemetry bursts',
    description: 'Verify backpressure behavior and disk spooling when WAN uplink is disconnected.',
    status: 'todo',
    priority: 'medium',
    assignee: MOCK_USERS[4],
    reporter: MOCK_USERS[2],
    startDate: '2026-10-14',
    dueDate: '2026-10-22',
    labels: ['QA', 'Testing'],
    subtasks: [],
    dependencies: [],
    comments: [],
    estimatedHours: 10,
    createdAt: '2026-10-14T10:00:00Z'
  }
]

export const INITIAL_PRODUCTION_ORDERS: ProductionOrder[] = [
  {
    id: 'po-1',
    orderNumber: 'PO-8821',
    product: 'Subsea Optical Cable Enclosure Subassembly',
    plantLine: 'Line 02 - Precision CNC Cell',
    status: 'running',
    targetQuantity: 120,
    producedQuantity: 84,
    unit: 'units',
    plannedStart: '2026-10-12',
    plannedEnd: '2026-10-16',
    actualStart: '2026-10-12',
    responsibleTeam: 'Precision Machining Shift A',
    anomalyDetected: false,
    batchQualityScore: 99.2,
    scrapCount: 2,
    stages: [
      { id: 'stg-1', name: 'Material Ingot Pre-cutting', status: 'completed', durationHours: 6, completedPercentage: 100 },
      { id: 'stg-2', name: '5-Axis Milling & Deburring', status: 'in_progress', durationHours: 18, completedPercentage: 70 },
      { id: 'stg-3', name: 'Anodized Surface Passivation', status: 'pending', durationHours: 8, completedPercentage: 0 },
      { id: 'stg-4', name: 'CMM Coordinate Metrology Inspection', status: 'pending', durationHours: 4, completedPercentage: 0 }
    ]
  },
  {
    id: 'po-2',
    orderNumber: 'PO-8824',
    product: 'Drone Navigation Core Micro-PCB Rev 3.2',
    plantLine: 'Line 01 - SMT Pick & Place Cell',
    status: 'delayed',
    targetQuantity: 450,
    producedQuantity: 160,
    unit: 'boards',
    plannedStart: '2026-10-10',
    plannedEnd: '2026-10-15',
    actualStart: '2026-10-11',
    responsibleTeam: 'SMT Automation Team 2',
    delayReason: 'Feeder reel jam on 0402 ceramic capacitor bank #3',
    anomalyDetected: true,
    batchQualityScore: 96.4,
    scrapCount: 14,
    stages: [
      { id: 'stg-5', name: 'Solder Paste Jet Printing', status: 'completed', durationHours: 4, completedPercentage: 100 },
      { id: 'stg-6', name: 'SMT Passive & BGA Placement', status: 'delayed', durationHours: 12, completedPercentage: 35 },
      { id: 'stg-7', name: '10-Zone Nitrogen Reflow Soldering', status: 'pending', durationHours: 6, completedPercentage: 0 },
      { id: 'stg-8', name: 'Automated 3D AOI & Functional Flying Probe', status: 'pending', durationHours: 6, completedPercentage: 0 }
    ]
  },
  {
    id: 'po-3',
    orderNumber: 'PO-8829',
    product: 'High-Torque Harmonic Drive Geared Actuator',
    plantLine: 'Line 04 - Cleanroom Assembly',
    status: 'scheduled',
    targetQuantity: 75,
    producedQuantity: 0,
    unit: 'actuators',
    plannedStart: '2026-10-17',
    plannedEnd: '2026-10-23',
    responsibleTeam: 'Robotic Drive Mechanics',
    anomalyDetected: false,
    batchQualityScore: 100,
    scrapCount: 0,
    stages: [
      { id: 'stg-9', name: 'Harmonic Flexspline Laser Metrology', status: 'pending', durationHours: 8, completedPercentage: 0 },
      { id: 'stg-10', name: 'Brushless Stator Vacuum Encapsulation', status: 'pending', durationHours: 14, completedPercentage: 0 },
      { id: 'stg-11', name: 'Cleanroom Precision Bearing Assembly', status: 'pending', durationHours: 10, completedPercentage: 0 },
      { id: 'stg-12', name: 'Dyno Torque & Jitter Bench Qualification', status: 'pending', durationHours: 6, completedPercentage: 0 }
    ]
  }
]

export const MOCK_EQUIPMENT = [
  {
    id: 'eq-1',
    name: '5-Axis Precision CNC Machining Center #02',
    line: 'Line 02 - Precision CNC Cell',
    status: 'operational' as const,
    efficiency: 94.6,
    temperatureC: 42.1,
    vibrationMmS: 1.2,
    operatingHours: 1240,
    lastMaintenance: '2026-10-01'
  },
  {
    id: 'eq-2',
    name: 'High-Speed SMT Pick & Place Dual-Gantry #01',
    line: 'Line 01 - SMT Pick & Place Cell',
    status: 'warning' as const,
    efficiency: 76.2,
    temperatureC: 48.5,
    vibrationMmS: 2.8,
    operatingHours: 2890,
    lastMaintenance: '2026-09-18'
  },
  {
    id: 'eq-3',
    name: 'Cleanroom Robotic Actuator Assembly Cell #04',
    line: 'Line 04 - Cleanroom Assembly',
    status: 'operational' as const,
    efficiency: 98.2,
    temperatureC: 22.4,
    vibrationMmS: 0.4,
    operatingHours: 840,
    lastMaintenance: '2026-10-08'
  },
  {
    id: 'eq-4',
    name: 'Automated 3D Optical Inspection (AOI) Rig #03',
    line: 'Line 01 - SMT Pick & Place Cell',
    status: 'idle' as const,
    efficiency: 91.0,
    temperatureC: 31.0,
    vibrationMmS: 0.6,
    operatingHours: 1450,
    lastMaintenance: '2026-09-25'
  }
]


export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    title: 'Milestone 2 Bottleneck Detected',
    description: 'Bench Rig 3 failure (ALPHA-102) is on the critical path and directly blocks optical flow calibration (ALPHA-101).',
    category: 'deadline_risk',
    severity: 'critical',
    detectedFacts: [
      'Task ALPHA-102 is marked as a Blocker and is due today.',
      'Task ALPHA-101 depends on the bench hardware and is due in 24 hours.',
      'Project Autonomous Drone Navigation has only 42% task completion vs 65% target velocity.'
    ],
    predictedImpact: 'Estimated 4-day slippage on Drone Subsystem Milestone 2 delivery if unblocked within 24 hours.',
    recommendedAction: 'Reassign PCB breakout soldering to Elena Rostova and fast-track bench inspection.',
    actionLabel: 'Review Task ALPHA-102',
    actionTargetRoute: '/tasks?highlight=task-102',
    projectReference: 'Autonomous Drone Navigation Subsystem',
    isReviewed: false,
    createdAt: '2026-10-14T08:15:00Z',
    isSampleData: true
  },
  {
    id: 'ins-2',
    title: 'Workload Concentration Alert',
    description: 'Lead Systems Engineer (Alex Morgan) has 3 active urgent/high priority tasks assigned concurrently across 2 projects.',
    category: 'workload_imbalance',
    severity: 'high',
    detectedFacts: [
      'Assigned tasks count: 4 total (2 Urgent, 1 High, 1 Medium).',
      'Average team member active load is 1.4 tasks.',
      'Total estimated sprint effort for Alex Morgan exceeds 44 hours.'
    ],
    predictedImpact: 'Elevated cognitive switching penalty and risk of delayed reviews for Shopfloor Gateway certificates.',
    recommendedAction: 'Reallocate BETA-44 TLS configuration to Liam Patel or Sarah Chen.',
    actionLabel: 'Rebalance Workload',
    actionTargetRoute: '/team',
    projectReference: 'Shopfloor Telemetry Gateway v2.4',
    isReviewed: false,
    createdAt: '2026-10-14T09:30:00Z',
    isSampleData: true
  },
  {
    id: 'ins-3',
    title: 'Production Cycle Time Drift',
    description: 'SMT Pick & Place Cell (Line 01) experienced cycle time variance +18% above 60-day baseline during PO-8824.',
    category: 'production_anomaly',
    severity: 'medium',
    detectedFacts: [
      'Line 01 placement cycle increased from 1.2s to 1.42s per component.',
      '3 optical feeder retry alerts logged in last 120 minutes.'
    ],
    predictedImpact: 'Batch PO-8824 completion may extend by 6 hours if feeder nozzle wear is not checked.',
    recommendedAction: 'Schedule 15-minute optical nozzle cleaning during shift change.',
    actionLabel: 'Inspect Production Order',
    actionTargetRoute: '/production/orders',
    projectReference: 'PO-8824 Drone Navigation Core',
    isReviewed: false,
    createdAt: '2026-10-14T10:45:00Z',
    isSampleData: true
  }
]

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    user: MOCK_USERS[0],
    action: 'updated status to In Progress on',
    targetType: 'task',
    targetTitle: 'ALPHA-101: Calibrate optical flow camera',
    targetId: 'task-101',
    timestamp: '2026-10-14T11:20:00Z'
  },
  {
    id: 'act-2',
    user: MOCK_USERS[4],
    action: 'completed milestone test on',
    targetType: 'task',
    targetTitle: 'DELTA-15: Profile safety watchdog timeout',
    targetId: 'task-106',
    timestamp: '2026-10-14T09:45:00Z'
  },
  {
    id: 'act-3',
    user: MOCK_USERS[2],
    action: 'flagged anomaly on production line for',
    targetType: 'production',
    targetTitle: 'PO-8824: Drone Navigation Core Micro-PCB',
    targetId: 'po-2',
    timestamp: '2026-10-14T08:10:00Z'
  },
  {
    id: 'act-4',
    user: MOCK_USERS[1],
    action: 'added comment to',
    targetType: 'task',
    targetTitle: 'GAMMA-89: Verify FFT vibration frequency thresholds',
    targetId: 'task-104',
    timestamp: '2026-10-13T16:45:00Z'
  },
  {
    id: 'act-5',
    user: MOCK_USERS[3],
    action: 'created new project',
    targetType: 'project',
    targetTitle: 'Robotic Arm Controller Firmware 4.0',
    targetId: 'proj-4',
    timestamp: '2026-10-12T14:00:00Z'
  }
]

export const PROJECT_TEMPLATES = [
  {
    id: 'tmpl-1',
    name: 'Hardware & Firmware Subsystem',
    description: 'Structured for schematic capture, PCB bring-up, RTOS driver bring-up, and environmental qualification.',
    category: 'Hardware' as const,
    tags: ['Hardware', 'Firmware', 'Bench-Test'],
    initialTaskTitles: [
      'Schematic review and bill of materials freeze',
      'PCB layout design rule checking',
      'Bench test power rail sequencing and oscilloscope probe',
      'Flash bootloader and verify UART debug shell'
    ]
  },
  {
    id: 'tmpl-2',
    name: 'Cloud & Edge Software Service',
    description: 'Optimized for microservice APIs, containerization, unit testing, and continuous deployment.',
    category: 'Software' as const,
    tags: ['Software', 'Cloud', 'API'],
    initialTaskTitles: [
      'Define OpenAPI 3.1 contract and data schemas',
      'Implement core repository and business logic handlers',
      'Configure automated CI/CD unit and integration test pipeline',
      'Deploy canary release to staging environment'
    ]
  },
  {
    id: 'tmpl-3',
    name: 'Plant Floor IIoT Rollout',
    description: 'Designed for industrial edge nodes, PLC communication, SCADA integration, and plant qualification.',
    category: 'Plant Operations' as const,
    tags: ['IIoT', 'OPC-UA', 'SCADA'],
    initialTaskTitles: [
      'Site survey and industrial Ethernet drop audit',
      'Install and provision edge gateway nodes',
      'Map Modbus / OPC-UA register telemetry tags',
      'Validate telemetry streaming during full production run'
    ]
  },
  {
    id: 'tmpl-4',
    name: 'Blank Custom Project',
    description: 'Start with a clean slate for custom organization, ad-hoc initiatives, or research.',
    category: 'Research' as const,
    tags: ['General'],
    initialTaskTitles: []
  }
]

