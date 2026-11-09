import React from 'react';
import { Classroom } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EquipmentIcon } from '../common/EquipmentIcon';
import { getReadinessBadge } from '../../utils';
import { useClassReady } from '../../context/ClassReadyContext';
import { QrCode, ArrowRight } from 'lucide-react';

interface RoomTableViewProps {
  rooms: Classroom[];
  onOpenDetail: (room: Classroom) => void;
}

export const RoomTableView: React.FC<RoomTableViewProps> = ({ rooms, onOpenDetail }) => {
  const { openReportModal, openQRModal } = useClassReady();

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Room & Building</th>
              <th className="py-3 px-4">Readiness Status</th>
              <th className="py-3 px-4">Current Session</th>
              <th className="py-3 px-4">Equipment Health Summary</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rooms.map((room) => {
              const badge = getReadinessBadge(room.readinessStatus);

              return (
                <tr
                  key={room.id}
                  onClick={() => onOpenDetail(room)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  {/* Room code & building */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {room.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        Fl {room.floor}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{room.buildingName}</div>
                  </td>

                  {/* Readiness Status badge */}
                  <td className="py-3.5 px-4">
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
                      {badge.label}
                    </Badge>
                  </td>

                  {/* Current Session */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    {room.currentClass ? (
                      <div>
                        <div className="font-semibold text-slate-900 truncate">
                          {room.currentClass.subjectCode}: {room.currentClass.subjectTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {room.currentClass.instructor} • {room.currentClass.timeSlot}
                        </div>
                      </div>
                    ) : room.nextClass ? (
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Next Class
                        </span>
                        <div className="text-slate-700 truncate font-medium">
                          {room.nextClass.subjectCode} ({room.nextClass.timeSlot})
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No class scheduled</span>
                    )}
                  </td>

                  {/* Equipment summary badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {room.equipments.map((eq) => {
                        const isOffline = eq.health === 'offline';
                        const isDegraded = eq.health === 'degraded';

                        return (
                          <span
                            key={eq.id}
                            title={`${eq.name}: ${eq.health}`}
                            className={`p-1.5 rounded-md border flex items-center justify-center ${
                              isOffline
                                ? 'bg-rose-100 text-rose-700 border-rose-300'
                                : isDegraded
                                ? 'bg-amber-100 text-amber-700 border-amber-300'
                                : 'bg-slate-100/70 text-slate-600 border-slate-200'
                            }`}
                          >
                            <EquipmentIcon category={eq.category} className="w-3.5 h-3.5" />
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Health Score */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                        room.readinessScore === 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : room.readinessScore > 75
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {room.readinessScore}%
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQRModal(room);
                        }}
                        title="View Podium QR"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReportModal(room.id);
                        }}
                        className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                      >
                        Report
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenDetail(room)}
                        className="text-xs"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
