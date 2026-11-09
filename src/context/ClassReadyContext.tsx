import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Classroom,
  Incident,
  CampusBuilding,
  Technician,
  ReadinessStatus,
  EquipmentCategory,
  IncidentStatus,
  CampusMetrics,
  EquipmentHealth,
} from '../types';
import { mockBuildings, mockClassrooms, mockIncidents, mockTechnicians } from '../data/mockData';

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface NewIncidentInput {
  roomId: string;
  equipmentId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impactsClassNow: boolean;
  reporterName: string;
  reporterRole: 'Faculty' | 'Student' | 'Teaching Assistant' | 'IT Staff';
  reporterEmail: string;
  reporterPhone?: string;
  category: EquipmentCategory;
}

interface ClassReadyContextType {
  classrooms: Classroom[];
  incidents: Incident[];
  buildings: CampusBuilding[];
  technicians: Technician[];
  metrics: CampusMetrics;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBuildingId: string | 'all';
  setSelectedBuildingId: (id: string | 'all') => void;
  selectedFloor: number | 'all';
  setSelectedFloor: (floor: number | 'all') => void;
  selectedStatus: ReadinessStatus | 'all';
  setSelectedStatus: (status: ReadinessStatus | 'all') => void;
  selectedCategory: EquipmentCategory | 'all';
  setSelectedCategory: (cat: EquipmentCategory | 'all') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;

  // Modals & Navigation
  selectedRoom: Classroom | null;
  setSelectedRoom: (room: Classroom | null) => void;
  reportModal: {
    isOpen: boolean;
    prefillRoomId?: string;
    prefillEquipmentId?: string;
  };
  openReportModal: (roomId?: string, equipmentId?: string) => void;
  closeReportModal: () => void;
  qrModalRoom: Classroom | null;
  openQRModal: (room: Classroom) => void;
  closeQRModal: () => void;
  activeTicketDrawer: Incident | null;
  setActiveTicketDrawer: (incident: Incident | null) => void;

  // Actions
  reportIssue: (input: NewIncidentInput) => Incident;
  updateIncidentStatus: (
    incidentId: string,
    newStatus: IncidentStatus,
    notes?: string,
    resolutionDetails?: string
  ) => void;
  assignTechnician: (incidentId: string, technicianId: string, etaMinutes?: number) => void;
  simulateEquipmentTest: (roomId: string, equipmentId: string) => Promise<{ success: boolean; message: string }>;
  resetToSampleData: () => void;

  // Toast system
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
}

const STORAGE_KEY_ROOMS = 'classready_rooms_v1';
const STORAGE_KEY_INCIDENTS = 'classready_incidents_v1';

const ClassReadyContext = createContext<ClassReadyContextType | undefined>(undefined);

export const ClassReadyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state with local storage fallback
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved classrooms from localStorage', e);
    }
    return mockClassrooms;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INCIDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved incidents from localStorage', e);
    }
    return mockIncidents;
  });

  const [buildings] = useState<CampusBuilding[]>(mockBuildings);
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | 'all'>('all');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ReadinessStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [selectedRoom, setSelectedRoom] = useState<Classroom | null>(null);
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    prefillRoomId?: string;
    prefillEquipmentId?: string;
  }>({ isOpen: false });
  const [qrModalRoom, setQrModalRoom] = useState<Classroom | null>(null);
  const [activeTicketDrawer, setActiveTicketDrawer] = useState<Incident | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (title: string, message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(classrooms));
    } catch (e) {
      console.error(e);
    }
  }, [classrooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.error(e);
    }
  }, [incidents]);

  // Keep selectedRoom in sync when classrooms state updates
  useEffect(() => {
    if (selectedRoom) {
      const refreshed = classrooms.find((r) => r.id === selectedRoom.id);
      if (refreshed) {
        setSelectedRoom(refreshed);
      }
    }
  }, [classrooms]);

  // Keep active ticket drawer in sync
  useEffect(() => {
    if (activeTicketDrawer) {
      const refreshed = incidents.find((i) => i.id === activeTicketDrawer.id);
      if (refreshed) {
        setActiveTicketDrawer(refreshed);
      }
    }
  }, [incidents]);

  const openReportModal = (roomId?: string, equipmentId?: string) => {
    setReportModal({
      isOpen: true,
      prefillRoomId: roomId,
      prefillEquipmentId: equipmentId,
    });
  };

  const closeReportModal = () => {
    setReportModal({ isOpen: false });
  };

  const openQRModal = (room: Classroom) => {
    setQrModalRoom(room);
  };

  const closeQRModal = () => {
    setQrModalRoom(null);
  };

  // Helper to re-calculate classroom status & score
  const recalculateRoomHealth = (room: Classroom): { readinessStatus: ReadinessStatus; readinessScore: number } => {
    const totalEq = room.equipments.length;
    if (totalEq === 0) return { readinessStatus: 'ready', readinessScore: 100 };

    let offlineWeight = 0;
    let degradedWeight = 0;

    room.equipments.forEach((eq) => {
      // Crucial equipment has higher weight impact
      const isCrucial = ['projector', 'microphone', 'ac_fan', 'smartboard'].includes(eq.category);
      const weight = isCrucial ? 1.5 : 1.0;

      if (eq.health === 'offline') offlineWeight += 30 * weight;
      else if (eq.health === 'degraded') degradedWeight += 15 * weight;
    });

    const penalty = Math.min(100, Math.round(offlineWeight + degradedWeight));
    const score = Math.max(0, 100 - penalty);

    const hasOfflineCrucial = room.equipments.some(
      (eq) => eq.health === 'offline' && ['projector', 'microphone'].includes(eq.category)
    );

    let status: ReadinessStatus = 'ready';
    if (hasOfflineCrucial || score < 65) {
      status = 'critical';
    } else if (score < 95) {
      status = 'degraded';
    }

    return { readinessStatus: status, readinessScore: score };
  };

  // Action: Report Issue
  const reportIssue = (input: NewIncidentInput): Incident => {
    const targetRoom = classrooms.find((r) => r.id === input.roomId);
    if (!targetRoom) {
      throw new Error(`Room with ID ${input.roomId} not found`);
    }

    const targetEq = targetRoom.equipments.find((e) => e.id === input.equipmentId);
    const eqName = targetEq ? `${targetEq.name} (${targetEq.model})` : 'Room Equipment';

    const incidentId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newEquipmentHealth: EquipmentHealth =
      input.severity === 'critical' ? 'offline' : 'degraded';

    // 1. Update Room & Equipment
    const updatedClassrooms = classrooms.map((room) => {
      if (room.id !== input.roomId) return room;

      const updatedEquipments = room.equipments.map((eq) => {
        if (eq.id === input.equipmentId) {
          return {
            ...eq,
            health: newEquipmentHealth,
            activeIncidentId: incidentId,
            lastInspected: nowIso,
          };
        }
        return eq;
      });

      const tempRoom: Classroom = {
        ...room,
        equipments: updatedEquipments,
        openIncidentsCount: room.openIncidentsCount + 1,
        criticalIssuesCount:
          input.severity === 'critical' ? room.criticalIssuesCount + 1 : room.criticalIssuesCount,
        notes: `Recent report: ${input.title}`,
      };

      const healthCalc = recalculateRoomHealth(tempRoom);
      return {
        ...tempRoom,
        ...healthCalc,
      };
    });

    // 2. Create Incident Ticket
    const newIncident: Incident = {
      id: incidentId,
      roomId: targetRoom.id,
      roomCode: targetRoom.code,
      buildingName: targetRoom.buildingName,
      floor: targetRoom.floor,
      equipmentId: input.equipmentId,
      equipmentName: eqName,
      category: input.category,
      title: input.title,
      description: input.description,
      severity: input.severity,
      status: 'reported',
      impactsClassNow: input.impactsClassNow,
      reportedBy: {
        name: input.reporterName,
        role: input.reporterRole,
        email: input.reporterEmail,
        phone: input.reporterPhone,
      },
      createdAt: nowIso,
      updatedAt: nowIso,
      tags: [
        input.severity === 'critical' ? 'Urgent' : 'Routine',
        input.impactsClassNow ? 'Class Impacted' : 'Class Safe',
        targetRoom.code,
      ],
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: 'reported',
          timestamp: nowIso,
          author: input.reporterName,
          role: input.reporterRole,
          note: `Incident registered: ${input.title}. ${input.impactsClassNow ? 'Current class session is impacted.' : 'Reported for maintenance.'}`,
        },
      ],
    };

    setClassrooms(updatedClassrooms);
    setIncidents([newIncident, ...incidents]);

    addToast(
      'Issue Reported Successfully',
      `Ticket #${incidentId} generated for ${targetRoom.code}. Dispatch team notified.`,
      'success'
    );

    return newIncident;
  };

  // Action: Update Incident Status
  const updateIncidentStatus = (
    incidentId: string,
    newStatus: IncidentStatus,
    notes?: string,
    resolutionDetails?: string
  ) => {
    const targetIncident = incidents.find((i) => i.id === incidentId);
    if (!targetIncident) return;

    const nowIso = new Date().toISOString();
    const isResolving = newStatus === 'resolved' || newStatus === 'closed';

    // 1. Update incidents list
    const updatedIncidents = incidents.map((inc) => {
      if (inc.id !== incidentId) return inc;

      const newTimelineEntry = {
        id: `tl-${Date.now()}`,
        status: newStatus,
        timestamp: nowIso,
        author: inc.assignedTechnician ? inc.assignedTechnician.name : 'Facilities Operations Desk',
        role: inc.assignedTechnician ? inc.assignedTechnician.role : 'Central Coordinator',
        note:
          notes ||
          (newStatus === 'in_progress'
            ? 'Technician on-site inspecting failure and running hardware diagnostic.'
            : newStatus === 'resolved'
            ? resolutionDetails || 'Repairs finished and operational verification passed.'
            : `Status advanced to ${newStatus}.`),
      };

      return {
        ...inc,
        status: newStatus,
        updatedAt: nowIso,
        resolvedAt: isResolving ? nowIso : inc.resolvedAt,
        resolutionNotes: resolutionDetails || inc.resolutionNotes,
        timeline: [...inc.timeline, newTimelineEntry],
      };
    });

    // 2. If resolved, restore room equipment health
    let updatedClassrooms = classrooms;
    if (isResolving) {
      updatedClassrooms = classrooms.map((room) => {
        if (room.id !== targetIncident.roomId) return room;

        const updatedEquipments = room.equipments.map((eq) => {
          if (eq.id === targetIncident.equipmentId) {
            return {
              ...eq,
              health: 'operational' as EquipmentHealth,
              activeIncidentId: undefined,
              lastInspected: nowIso,
            };
          }
          return eq;
        });

        const tempRoom: Classroom = {
          ...room,
          equipments: updatedEquipments,
          openIncidentsCount: Math.max(0, room.openIncidentsCount - 1),
          criticalIssuesCount:
            targetIncident.severity === 'critical'
              ? Math.max(0, room.criticalIssuesCount - 1)
              : room.criticalIssuesCount,
        };

        const healthCalc = recalculateRoomHealth(tempRoom);
        return {
          ...tempRoom,
          ...healthCalc,
        };
      });

      setClassrooms(updatedClassrooms);
    }

    setIncidents(updatedIncidents);

    addToast(
      `Ticket #${incidentId} Updated`,
      `Status changed to "${newStatus.replace('_', ' ').toUpperCase()}".`,
      isResolving ? 'success' : 'info'
    );
  };

  // Action: Assign Technician
  const assignTechnician = (incidentId: string, technicianId: string, etaMinutes = 15) => {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;

    const nowIso = new Date().toISOString();

    const updatedIncidents = incidents.map((inc) => {
      if (inc.id !== incidentId) return inc;

      return {
        ...inc,
        assignedTechnician: tech,
        status: (inc.status === 'reported' ? 'acknowledged' : inc.status) as IncidentStatus,
        updatedAt: nowIso,
        etaMinutes,
        timeline: [
          ...inc.timeline,
          {
            id: `tl-${Date.now()}`,
            status: inc.status === 'reported' ? 'acknowledged' : inc.status,
            timestamp: nowIso,
            author: 'Operations Coordinator',
            role: 'Dispatch Desk',
            note: `Assigned specialist ${tech.name} (${tech.specialization}). Estimated response ETA: ${etaMinutes} mins.`,
          },
        ],
      };
    });

    // Update technician ticket load
    setTechnicians((prev) =>
      prev.map((t) => (t.id === technicianId ? { ...t, activeTickets: t.activeTickets + 1 } : t))
    );

    setIncidents(updatedIncidents);

    addToast(
      'Technician Dispatched',
      `${tech.name} assigned to ticket #${incidentId} (ETA ${etaMinutes} mins).`,
      'info'
    );
  };

  // Action: Simulate interactive diagnostic test
  const simulateEquipmentTest = async (
    roomId: string,
    equipmentId: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 800));

    const room = classrooms.find((r) => r.id === roomId);
    const eq = room?.equipments.find((e) => e.id === equipmentId);

    if (!eq) return { success: false, message: 'Equipment not found' };

    if (eq.health === 'offline') {
      return {
        success: false,
        message: `Diagnostic Ping to ${eq.name} failed: Hardware link unresponsive or fault code detected.`,
      };
    }

    if (eq.health === 'degraded') {
      return {
        success: true,
        message: `Hardware responding with warnings: Calibration delta exceeded standard threshold.`,
      };
    }

    return {
      success: true,
      message: `Self-test PASSED for ${eq.name}: Signal sync 100%, telemetry normal, power rail nominal.`,
    };
  };

  // Reset to default sample state
  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEY_ROOMS);
    localStorage.removeItem(STORAGE_KEY_INCIDENTS);
    setClassrooms(mockClassrooms);
    setIncidents(mockIncidents);
    setTechnicians(mockTechnicians);
    addToast('Data Reset', 'Restored pristine campus readiness dataset.', 'info');
  };

  // Calculate live campus metrics
  const metrics: CampusMetrics = useMemo(() => {
    const totalRooms = classrooms.length;
    const readyRooms = classrooms.filter((r) => r.readinessStatus === 'ready').length;
    const degradedRooms = classrooms.filter((r) => r.readinessStatus === 'degraded').length;
    const criticalRooms = classrooms.filter((r) => r.readinessStatus === 'critical').length;
    const overallReadinessPercentage =
      totalRooms > 0 ? Math.round((readyRooms / totalRooms) * 100) : 100;

    let totalEq = 0;
    let failingEq = 0;

    classrooms.forEach((r) => {
      totalEq += r.equipments.length;
      failingEq += r.equipments.filter((e) => e.health === 'offline' || e.health === 'degraded').length;
    });

    const activeIncidents = incidents.filter(
      (i) => i.status !== 'resolved' && i.status !== 'closed'
    ).length;
    const urgentTickets = incidents.filter(
      (i) =>
        (i.status !== 'resolved' && i.status !== 'closed') &&
        (i.severity === 'critical' || i.impactsClassNow)
    ).length;

    return {
      totalRooms,
      readyRooms,
      degradedRooms,
      criticalRooms,
      overallReadinessPercentage,
      totalEquipment: totalEq,
      failingEquipment: failingEq,
      activeIncidents,
      urgentTickets,
      avgResolutionMinutes: 24,
    };
  }, [classrooms, incidents]);

  return (
    <ClassReadyContext.Provider
      value={{
        classrooms,
        incidents,
        buildings,
        technicians,
        metrics,

        searchQuery,
        setSearchQuery,
        selectedBuildingId,
        setSelectedBuildingId,
        selectedFloor,
        setSelectedFloor,
        selectedStatus,
        setSelectedStatus,
        selectedCategory,
        setSelectedCategory,
        viewMode,
        setViewMode,

        selectedRoom,
        setSelectedRoom,
        reportModal,
        openReportModal,
        closeReportModal,
        qrModalRoom,
        openQRModal,
        closeQRModal,
        activeTicketDrawer,
        setActiveTicketDrawer,

        reportIssue,
        updateIncidentStatus,
        assignTechnician,
        simulateEquipmentTest,
        resetToSampleData,

        toasts,
        dismissToast,
        addToast,
      }}
    >
      {children}
    </ClassReadyContext.Provider>
  );
};

export const useClassReady = () => {
  const context = useContext(ClassReadyContext);
  if (!context) {
    throw new Error('useClassReady must be used within a ClassReadyProvider');
  }
  return context;
};

