import React from 'react';
import {
  Users,
  QrCode,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Classroom } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EquipmentIcon } from '../common/EquipmentIcon';
import { getReadinessBadge } from '../../utils';
import { useClassReady } from '../../context/ClassReadyContext';

interface RoomCardProps {
  room: Classroom;
  onOpenDetail: (room: Classroom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onOpenDetail }) => {
  const { openReportModal, openQRModal, incidents, setActiveTicketDrawer } = useClassReady();
  const badgeInfo = getReadinessBadge(room.readinessStatus);

  // Check if there is an active incident for this room
  const activeIncident = incidents.find(
    (i) => i.roomId === room.id && i.status !== 'resolved' && i.status !== 'closed'
  );

  return (
    <div
      onClick={() => onOpenDetail(room)}
      className="group bg-white border border-slate-200/90 rounded-2xl shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top accent bar for status */}
      <div
        className={`h-1.5 w-full ${
          room.readinessStatus === 'ready'
            ? 'bg-emerald-500'
            : room.readinessStatus === 'critical'
            ? 'bg-rose-500'
            : 'bg-amber-500'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Room code, Building, Readiness Score */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-lg font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                  {room.code}
                </h3>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                  Fl {room.floor}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5 max-w-[200px]" title={room.name}>
                {room.name}
              </p>
            </div>

            <div className="flex flex-col items-end">
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
              <span className="font-mono text-[11px] font-bold text-slate-500 mt-1">
                {room.readinessScore}% Health
              </span>
            </div>
          </div>

          {/* Building & Capacity metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 mb-4">
            <span className="truncate">{room.buildingName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {room.capacity} seats
            </span>
          </div>

          {/* Current / Next Class Session Pill */}
          {room.currentClass ? (
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80 mb-3.5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold text-blue-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  IN PROGRESS SESSION
                </span>
                <span className="text-blue-600 font-mono text-[10px]">{room.currentClass.timeSlot}</span>
              </div>
              <p className="text-xs font-semibold text-slate-900 truncate">
                {room.currentClass.subjectCode}: {room.currentClass.subjectTitle}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                Instructor: {room.currentClass.instructor} ({room.currentClass.enrolled} students)
              </p>
            </div>
          ) : room.nextClass ? (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 mb-3.5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  NEXT CLASS
                </span>
                <span className="text-slate-500 font-mono text-[10px]">{room.nextClass.timeSlot}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {room.nextClass.subjectCode}: {room.nextClass.subjectTitle}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {room.nextClass.instructor}
              </p>
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500 mb-3.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>No active class scheduled • Room open for inspection</span>
            </div>
          )}

          {/* Active Incident Urgent Banner */}
          {activeIncident && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveTicketDrawer(activeIncident);
              }}
              className="p-2.5 rounded-xl bg-rose-50/90 border border-rose-200 text-xs mb-3.5 flex items-start gap-2.5 hover:bg-rose-100/90 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-rose-800 text-[11px] tracking-tight">
                    {activeIncident.id} — {activeIncident.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {activeIncident.etaMinutes && (
                    <span className="text-[10px] font-mono font-semibold text-rose-700 bg-rose-200/70 px-1 rounded">
                      ETA {activeIncident.etaMinutes}m
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-rose-700 font-medium truncate mt-0.5">
                  {activeIncident.title}
                </p>
              </div>
            </div>
          )}

          {/* Equipment Status Mini Matrix */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
              <span>AV Equipment Health</span>
              <span>{room.equipments.length} Devices</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {room.equipments.map((eq) => {
                const isOffline = eq.health === 'offline';
                const isDegraded = eq.health === 'degraded';

                return (
                  <div
                    key={eq.id}
                    title={`${eq.name}: ${eq.health.toUpperCase()}`}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      isOffline
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        : isDegraded
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <EquipmentIcon category={eq.category} className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[80px]">
                      {eq.category === 'ac_fan'
                        ? 'AC/Fan'
                        : eq.category === 'projector'
                        ? 'Projector'
                        : eq.category === 'microphone'
                        ? 'Mic'
                        : eq.category === 'smartboard'
                        ? 'Board'
                        : eq.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Quick QR code placard preview */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQRModal(room);
            }}
            title="Generate Podium QR Placard"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Podium QR</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openReportModal(room.id);
              }}
              className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Report Failure
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenDetail(room)}
              className="text-xs group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
