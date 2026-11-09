import React, { useState } from 'react';
import {
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Send,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';
import { useClassReady } from '../../context/ClassReadyContext';
import { EquipmentCategory } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EquipmentIcon } from '../common/EquipmentIcon';
import { getReadinessBadge } from '../../utils';

export const PodiumKioskSimulator: React.FC = () => {
  const { classrooms, incidents, reportIssue } = useClassReady();

  // Active simulated room
  const [activeRoomId, setActiveRoomId] = useState<string>(
    classrooms[0] ? classrooms[0].id : ''
  );

  const selectedRoom = classrooms.find((r) => r.id === activeRoomId) || classrooms[0];

  // Mobile quick form state
  const [quickCategory, setQuickCategory] = useState<EquipmentCategory>('projector');
  const [quickSymptom, setQuickSymptom] = useState<string>('Projector won’t turn on / No signal');
  const [professorName, setProfessorName] = useState<string>('Prof. Davis');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  if (!selectedRoom) return null;

  const roomIncidents = incidents.filter(
    (i) => i.roomId === selectedRoom.id && i.status !== 'resolved' && i.status !== 'closed'
  );
  const activeIncident = roomIncidents[0];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const targetEq =
        selectedRoom.equipments.find((e) => e.category === quickCategory) ||
        selectedRoom.equipments[0];

      const newTicket = reportIssue({
        roomId: selectedRoom.id,
        equipmentId: targetEq ? targetEq.id : 'eq-gen',
        category: quickCategory,
        title: quickSymptom,
        description: `Logged via Podium Mobile QR Scan by ${professorName}. Class is waiting in ${selectedRoom.code}.`,
        severity: 'critical',
        impactsClassNow: true,
        reporterName: professorName,
        reporterRole: 'Faculty',
        reporterEmail: 'faculty@campus.edu',
        reporterPhone: '+1 (555) 918-0012',
      });

      setSubmittedTicketId(newTicket.id);
      setIsSubmitting(false);
    }, 600);
  };

  const badgeInfo = getReadinessBadge(selectedRoom.readinessStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro info bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Lectern QR Code Mobile Portal Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrates the zero-login, instant mobile experience when a lecturer or student scans the desk placard.
          </p>
        </div>

        {/* Classroom selector switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold uppercase">Simulate Scanning:</span>
          <select
            value={activeRoomId}
            onChange={(e) => {
              setActiveRoomId(e.target.value);
              setSubmittedTicketId(null);
            }}
            className="py-1.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none"
          >
            {classrooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} ({r.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Realistic Mobile Device Mockup Container */}
      <div className="flex justify-center py-4">
        <div className="w-full max-w-[390px] rounded-[44px] bg-slate-900 p-3.5 shadow-2xl ring-1 ring-slate-800">
          {/* Phone Shell Inner Screen */}
          <div className="rounded-[36px] bg-white overflow-hidden border border-slate-200 flex flex-col h-[740px] text-xs">
            {/* Phone Notch & Status Bar */}
            <div className="bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono select-none">
              <span>9:41</span>
              {/* Dynamic Island / Notch */}
              <div className="w-20 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="w-4 h-2 rounded-xs border border-white inline-block bg-white" />
              </div>
            </div>

            {/* In-Browser Mobile Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-mono truncate">classready.campus.edu/scan</span>
              <button
                onClick={() => setSubmittedTicketId(null)}
                title="Reload"
                className="p-1 hover:text-slate-900"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Mobile Viewport Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Room Header Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold block">
                      LECTERN SCAN VERIFIED
                    </span>
                    <h2 className="text-xl font-bold font-mono tracking-tight text-white mt-0.5">
                      {selectedRoom.code}
                    </h2>
                    <p className="text-[11px] text-slate-300">{selectedRoom.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedRoom.buildingName} • Floor {selectedRoom.floor}
                    </p>
                  </div>

                  <Badge
                    variant={
                      selectedRoom.readinessStatus === 'ready'
                        ? 'success'
                        : selectedRoom.readinessStatus === 'critical'
                        ? 'danger'
                        : 'warning'
                    }
                    dot
                    size="sm"
                  >
                    {badgeInfo.label}
                  </Badge>
                </div>
              </div>

              {/* Active Ticket Alert on Mobile Screen */}
              {activeIncident && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Active Dispatch #{activeIncident.id}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded">
                      {activeIncident.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 font-medium">
                    {activeIncident.title}
                  </p>
                  {activeIncident.assignedTechnician && (
                    <div className="pt-1 border-t border-rose-200/60 text-[10px] text-rose-800 flex items-center justify-between">
                      <span>Tech: {activeIncident.assignedTechnician.name}</span>
                      <span className="font-bold">ETA ~{activeIncident.etaMinutes || 15}m</span>
                    </div>
                  )}
                </div>
              )}

              {/* Success Banner if user just reported */}
              {submittedTicketId && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 animate-in zoom-in-95">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ticket #{submittedTicketId} Dispatched!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Facilities AV response team has received your report. A specialist is en route to {selectedRoom.code}.
                  </p>
                </div>
              )}

              {/* Rapid One-Tap Report Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs tracking-tight">
                    Quick Incident Report
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">10s report</span>
                </div>

                <form onSubmit={handleQuickSubmit} className="space-y-3">
                  {/* Category icon pills */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'projector', label: 'Projector' },
                      { id: 'microphone', label: 'Mic / Audio' },
                      { id: 'smartboard', label: 'Smartboard' },
                      { id: 'ac_fan', label: 'AC / Fan' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setQuickCategory(cat.id as EquipmentCategory);
                          setQuickSymptom(
                            cat.id === 'projector'
                              ? 'Projector won’t turn on / No signal'
                              : cat.id === 'microphone'
                              ? 'Microphone dead / No sound through speakers'
                              : cat.id === 'smartboard'
                              ? 'Smartboard touch calibration frozen'
                              : 'AC leaking water or room uncomfortably hot'
                          );
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
                          quickCategory === cat.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <EquipmentIcon category={cat.id as any} className="w-4 h-4" />
                        <span className="truncate max-w-[60px]">{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick issue title */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Problem Details
                    </label>
                    <input
                      type="text"
                      value={quickSymptom}
                      onChange={(e) => setQuickSymptom(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Instructor / Reporter Name
                    </label>
                    <input
                      type="text"
                      value={professorName}
                      onChange={(e) => setProfessorName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full text-xs font-bold py-2.5 rounded-xl shadow-xs"
                  >
                    <span>Send Immediate AV Help Alert</span>
                    <Send className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </form>
              </div>

              {/* Direct Helpdesk Hotline Button */}
              <div className="p-3 rounded-xl border border-slate-200 text-center space-y-1 bg-white">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Emergency Phone Hotline
                </span>
                <a
                  href="tel:5554357"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Dispatch: +1 (555) 4357 (HELP)</span>
                </a>
              </div>
            </div>

            {/* Home indicator bar */}
            <div className="py-2 flex justify-center bg-white border-t border-slate-100">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
