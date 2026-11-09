export type EquipmentCategory =
  | 'projector'
  | 'microphone'
  | 'smartboard'
  | 'ac_fan'
  | 'lectern_pc'
  | 'audio_system'
  | 'hdmi_display'
  | 'network_power';

export type EquipmentHealth = 'operational' | 'degraded' | 'offline' | 'maintenance';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  category: EquipmentCategory;
  health: EquipmentHealth;
  lastInspected: string;
  serialNumber: string;
  locationDetails?: string;
  specs: {
    label: string;
    value: string;
  }[];
  activeIncidentId?: string;
}

export type ReadinessStatus = 'ready' | 'degraded' | 'critical' | 'maintenance';

export type ClassroomType = 'lecture_hall' | 'smart_classroom' | 'seminar_room' | 'computer_lab' | 'auditorium';

export interface ScheduledClass {
  id: string;
  subjectCode: string;
  subjectTitle: string;
  instructor: string;
  instructorEmail: string;
  timeSlot: string; // e.g. "10:00 AM - 11:30 AM"
  status: 'upcoming' | 'in_progress' | 'completed';
  enrolled: number;
}

export interface Classroom {
  id: string;
  code: string; // e.g. "ENG-204"
  name: string;
  buildingId: string;
  buildingName: string;
  wing?: string;
  floor: number;
  capacity: number;
  type: ClassroomType;
  readinessStatus: ReadinessStatus;
  readinessScore: number; // 0 - 100
  equipments: Equipment[];
  currentClass?: ScheduledClass;
  nextClass?: ScheduledClass;
  lastInspected: string;
  openIncidentsCount: number;
  criticalIssuesCount: number;
  notes?: string;
}

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'reported' | 'acknowledged' | 'in_progress' | 'awaiting_parts' | 'resolved' | 'closed';

export interface IncidentTimelineEntry {
  id: string;
  status: IncidentStatus;
  timestamp: string;
  author: string;
  role: string;
  note: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  specialization: string;
  activeTickets: number;
  status: 'available' | 'busy' | 'offline';
}

export interface Incident {
  id: string; // e.g. "TKT-1082"
  roomCode: string;
  roomId: string;
  buildingName: string;
  floor: number;
  equipmentId: string;
  equipmentName: string;
  category: EquipmentCategory;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  impactsClassNow: boolean;
  reportedBy: {
    name: string;
    role: 'Faculty' | 'Student' | 'Teaching Assistant' | 'IT Staff';
    email: string;
    phone?: string;
  };
  assignedTechnician?: Technician;
  createdAt: string;
  updatedAt: string;
  etaMinutes?: number;
  timeline: IncidentTimelineEntry[];
  resolutionNotes?: string;
  resolvedAt?: string;
  tags?: string[];
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  floors: number;
  totalRooms: number;
  readyRooms: number;
  openIncidents: number;
}

export interface CampusMetrics {
  totalRooms: number;
  readyRooms: number;
  degradedRooms: number;
  criticalRooms: number;
  overallReadinessPercentage: number;
  totalEquipment: number;
  failingEquipment: number;
  activeIncidents: number;
  urgentTickets: number;
  avgResolutionMinutes: number;
}

