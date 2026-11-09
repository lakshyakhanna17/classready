import React, { useState } from 'react';
import {
  X,
  Users,
  QrCode,
  Calendar,
  AlertTriangle,
  Activity,
  Wrench,
  Clock,
  ArrowRight,
  Building,
} from 'lucide-react';
import { Classroom, Equipment } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EquipmentIcon } from '../common/EquipmentIcon';
import { getReadinessBadge, getEquipmentHealthBadge, formatDateTime, formatRelativeTime } from '../../utils';
import { useClassReady } from '../../context/ClassReadyContext';

interface RoomDetailModalProps {
  room: Classroom | null;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose }) => {
  const {
    openReportModal,
    openQRModal,
    incidents,
    setActiveTicketDrawer,
    simulateEquipmentTest,
    addToast,
  } = useClassReady();

  const [testingEqId, setTestingEqId] = useState<string | null>(null);

  if (!room) return null;

  const badgeInfo = getReadinessBadge(room.readinessStatus);
  const roomIncidents = incidents.filter((i) => i.roomId === room.id);
  const activeIncident = roomIncidents.find((i) => i.status !== 'resolved' && i.status !== 'closed');
  const pastIncidents = roomIncidents.filter((i) => i.status === 'resolved' || i.status === 'closed');

  const handleTestEquipment = async (eq: Equipment) => {
    setTestingEqId(eq.id);
    try {
      const result = await simulateEquipmentTest(room.id, eq.id);
      addToast(
        result.success ? 'Diagnostic Ping OK' : 'Hardware Ping Failed',
        result.message,
        result.success ? 'success' : 'error'
      );
    } catch {
      addToast('Diagnostic Error', 'Could not communicate with device controller', 'error');
    } finally {
      setTestingEqId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-popover border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-mono font-bold text-xl flex items-center justify-center shadow-sm shrink-0">
              {room.code.split('-')[1] || room.code}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 font-mono tracking-tight">{room.code}</h2>
                <Badge
                  variant={
                    room.readinessStatus === 'ready'
                      ? 'success'
                      : room.readinessStatus === 'critical'
                      ? 'danger'
                      : 'warning'
                  }
                  dot
                  size="sm"
                >
                  {badgeInfo.label}
                </Badge>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                  {room.readinessScore}% Readiness Score
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-700 mt-0.5">{room.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {room.buildingName} (Floor {room.floor})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Capacity: {room.capacity} seats
                </span>
                <span>•</span>
                <span className="capitalize">{room.type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openQRModal(room)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="View Podium QR Placard"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Podium QR</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Incident Warning Banner */}
          {activeIncident && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-900 text-sm tracking-tight">
                      Active Ticket #{activeIncident.id}: {activeIncident.title}
                    </span>
                    <span className="text-xs uppercase font-mono px-2 py-0.5 bg-rose-200 text-rose-800 rounded font-semibold">
                      {activeIncident.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    {activeIncident.description}
                  </p>
                  {activeIncident.assignedTechnician && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-rose-800 font-medium">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>
                        Assigned: <strong>{activeIncident.assignedTechnician.name}</strong> (
                        {activeIncident.assignedTechnician.specialization})
                      </span>
                      {activeIncident.etaMinutes && (
                        <span>• ETA ~{activeIncident.etaMinutes} mins</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClose();
                  setActiveTicketDrawer(activeIncident);
                }}
                className="shrink-0 text-xs gap-1.5"
              >
                <span>View Dispatch Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Schedule status banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Class */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Current Class Schedule
                </span>
                {room.currentClass && (
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    SESSION ACTIVE
                  </span>
                )}
              </div>

              {room.currentClass ? (
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {room.currentClass.subjectCode}: {room.currentClass.subjectTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Instructor: <strong>{room.currentClass.instructor}</strong> ({room.currentClass.instructorEmail})
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Time: {room.currentClass.timeSlot}</span>
                    <span>Enrolled: {room.currentClass.enrolled} students</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-2">
                  No class currently scheduled in this room.
                </div>
              )}
            </div>

            {/* Next Class */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Next Scheduled Session
                </span>
                {room.nextClass && (
                  <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    UPCOMING
                  </span>
                )}
              </div>

              {room.nextClass ? (
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {room.nextClass.subjectCode}: {room.nextClass.subjectTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Instructor: <strong>{room.nextClass.instructor}</strong> ({room.nextClass.instructorEmail})
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Starts: {room.nextClass.timeSlot}</span>
                    <span>Enrolled: {room.nextClass.enrolled} students</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-2">
                  No further classes scheduled today.
                </div>
              )}
            </div>
          </div>

          {/* Equipment Inventory & Live Health Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Classroom Equipment Checklist & Telemetry
                </h4>
                <p className="text-xs text-slate-500">
                  Detailed inspection state, specs and on-demand hardware diagnostic pings.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openReportModal(room.id)}
                className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 font-semibold"
              >
                + Report Defect in Room
              </Button>
            </div>

            <div className="space-y-3">
              {room.equipments.map((eq) => {
                const healthBadge = getEquipmentHealthBadge(eq.health);
                const isTesting = testingEqId === eq.id;

                return (
                  <div
                    key={eq.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 ${
                          eq.health === 'operational'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : eq.health === 'offline'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <EquipmentIcon category={eq.category} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-bold text-slate-900 truncate">{eq.name}</h5>
                          <Badge
                            variant={
                              eq.health === 'operational'
                                ? 'success'
                                : eq.health === 'offline'
                                ? 'danger'
                                : 'warning'
                            }
                            dot
                            size="sm"
                          >
                            {healthBadge.label}
                          </Badge>
                          <span className="font-mono text-[11px] text-slate-400">
                            SN: {eq.serialNumber}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium mt-0.5">{eq.model}</p>

                        {/* Specs badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {eq.specs.map((spec, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono"
                            >
                              <strong className="font-semibold text-slate-800">{spec.label}:</strong>{' '}
                              {spec.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions on this equipment */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={isTesting}
                        onClick={() => handleTestEquipment(eq)}
                        className="text-xs gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5 text-brand-600" />
                        <span>Self-Test</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReportModal(room.id, eq.id)}
                        className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                      >
                        Report Defect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Incidents / Maintenance History */}
          {pastIncidents.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
                Recent Resolution History ({pastIncidents.length})
              </h4>
              <div className="space-y-2">
                {pastIncidents.map((past) => (
                  <div
                    key={past.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{past.id}</span>
                        <span className="font-semibold text-slate-700">{past.title}</span>
                        <Badge variant="success" size="sm">
                          Resolved
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {past.resolutionNotes || 'Repairs completed and certified.'}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {past.resolvedAt ? formatRelativeTime(past.resolvedAt) : 'Recently'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Room ID: {room.id} • Last inspected {formatDateTime(room.lastInspected)}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
