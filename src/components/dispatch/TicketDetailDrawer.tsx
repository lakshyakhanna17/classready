import React, { useState } from 'react';
import {
  X,
  Wrench,
  CheckCircle2,
  Send,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { Incident } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EquipmentIcon } from '../common/EquipmentIcon';
import { getSeverityBadge, getStatusBadge, formatDateTime, formatRelativeTime } from '../../utils';
import { useClassReady } from '../../context/ClassReadyContext';

interface TicketDetailDrawerProps {
  incident: Incident | null;
  onClose: () => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ incident, onClose }) => {
  const { technicians, assignTechnician, updateIncidentStatus } = useClassReady();

  const [selectedTechId, setSelectedTechId] = useState<string>('');
  const [eta, setEta] = useState<number>(15);
  const [newLogNote, setNewLogNote] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);

  if (!incident) return null;

  const severityBadge = getSeverityBadge(incident.severity);
  const statusBadge = getStatusBadge(incident.status);

  const handleAssign = () => {
    if (!selectedTechId) return;
    assignTechnician(incident.id, selectedTechId, eta);
  };

  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;

    updateIncidentStatus(
      incident.id,
      incident.status,
      newLogNote.trim()
    );
    setNewLogNote('');
  };

  const handleResolveTicket = () => {
    if (!resolutionNote.trim()) return;

    updateIncidentStatus(
      incident.id,
      'resolved',
      'Resolution verified by technician.',
      resolutionNote.trim()
    );
    setShowResolveModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/90 bg-slate-50/70 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base font-bold text-slate-900">{incident.id}</span>
              <Badge variant={incident.severity === 'critical' ? 'danger' : 'warning'} size="sm">
                {severityBadge.label}
              </Badge>
              <Badge variant="default" size="sm">
                {statusBadge.label}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">{incident.title}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{incident.roomCode}</span>
              <span>•</span>
              <span>{incident.buildingName} (Floor {incident.floor})</span>
              <span>•</span>
              <span>{formatRelativeTime(incident.createdAt)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Ongoing class alert */}
          {incident.impactsClassNow && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Active Lecture Blocked</span>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Instructor is currently waiting in {incident.roomCode}. High-priority dispatch SLA applies.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Problem Description & Symptoms
            </span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-sans text-xs">
              {incident.description}
            </div>
          </div>

          {/* Equipment details */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <EquipmentIcon category={incident.category} className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Faulty Equipment</span>
                <span className="font-bold text-slate-900 text-xs">{incident.equipmentName}</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {incident.category}
            </span>
          </div>

          {/* Reporter Information */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Reported By
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">{incident.reportedBy.name}</span>
                <span className="text-[11px] text-slate-500 ml-2">({incident.reportedBy.role})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <a
                  href={`mailto:${incident.reportedBy.email}`}
                  className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                  title={incident.reportedBy.email}
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                {incident.reportedBy.phone && (
                  <a
                    href={`tel:${incident.reportedBy.phone}`}
                    className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title={incident.reportedBy.phone}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Technician Assignment Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Technician Assignment
              </span>
              {incident.assignedTechnician && (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                  DISPATCHED
                </span>
              )}
            </div>

            {incident.assignedTechnician ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                <div className="flex items-center gap-3">
                  <img
                    src={incident.assignedTechnician.avatar}
                    alt={incident.assignedTechnician.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {incident.assignedTechnician.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {incident.assignedTechnician.specialization}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Contact</span>
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    {incident.assignedTechnician.phone}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Select Specialist Technician...</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.specialization} ({t.activeTickets} active)
                      </option>
                    ))}
                  </select>

                  <select
                    value={eta}
                    onChange={(e) => setEta(Number(e.target.value))}
                    className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value={10}>10 min ETA</option>
                    <option value={15}>15 min ETA</option>
                    <option value={30}>30 min ETA</option>
                    <option value={60}>60 min ETA</option>
                  </select>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAssign}
                  disabled={!selectedTechId}
                  className="w-full text-xs"
                >
                  <Wrench className="w-3.5 h-3.5 mr-1.5" />
                  Dispatch Technician Now
                </Button>
              </div>
            )}
          </div>

          {/* Quick Status Workflow Action Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Workflow Status Progression
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={incident.status === 'in_progress' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateIncidentStatus(incident.id, 'in_progress')}
                className="text-xs"
              >
                In Progress
              </Button>

              <Button
                variant={incident.status === 'awaiting_parts' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateIncidentStatus(incident.id, 'awaiting_parts')}
                className="text-xs"
              >
                Awaiting Parts
              </Button>

              <Button
                variant={incident.status === 'resolved' ? 'success' : 'outline'}
                size="sm"
                onClick={() => setShowResolveModal(true)}
                className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              >
                Resolve & Close
              </Button>
            </div>
          </div>

          {/* Resolution Details if resolved */}
          {incident.resolutionNotes && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Resolution Note</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {incident.resolutionNotes}
              </p>
              <div className="text-[10px] text-emerald-700 font-mono pt-1">
                Resolved at: {incident.resolvedAt ? formatDateTime(incident.resolvedAt) : 'Recently'}
              </div>
            </div>
          )}

          {/* Timeline Audit Log */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Activity & Dispatch Timeline ({incident.timeline.length})
            </span>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {incident.timeline.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-800">{entry.author} ({entry.role})</span>
                    <span>{formatRelativeTime(entry.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add quick note */}
          <form onSubmit={handleAddTimelineNote} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Post update note (e.g. checked HDMI matrix, ordering spare cable)..."
              value={newLogNote}
              onChange={(e) => setNewLogNote(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
            <Button variant="secondary" size="sm" type="submit" disabled={!newLogNote.trim()}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        {/* Resolve Modal Overlay */}
        {showResolveModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Certify & Resolve Ticket</h4>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Resolving this ticket will immediately restore <strong>{incident.roomCode}</strong> equipment status back to 100% Operational and update classroom readiness scores campus-wide.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Resolution Notes *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cleaned projector intake filter, replaced lamp unit, verified 4K image test pattern."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowResolveModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleResolveTicket}
                  disabled={!resolutionNote.trim()}
                >
                  Confirm & Close Ticket
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
