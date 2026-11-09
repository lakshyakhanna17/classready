import React from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useClassReady } from '../../context/ClassReadyContext';
import { EquipmentIcon } from '../common/EquipmentIcon';

export const AnalyticsView: React.FC = () => {
  const { classrooms, incidents, technicians } = useClassReady();

  // Failure categories breakdown
  const categoryFailureCounts: Record<string, number> = {
    projector: 14,
    microphone: 11,
    hdmi_display: 9,
    ac_fan: 7,
    smartboard: 5,
    lectern_pc: 3,
    audio_system: 2,
    network_power: 2,
  };

  const totalFailuresTracked = Object.values(categoryFailureCounts).reduce((a, b) => a + b, 0);

  // Top failure-prone rooms
  const roomsByIncidentCount = [...classrooms]
    .map((room) => ({
      ...room,
      totalTicketsCount: incidents.filter((i) => i.roomId === room.id).length,
    }))
    .sort((a, b) => b.totalTicketsCount - a.totalTicketsCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SLA Compliance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>SLA Response Compliance</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              Target &gt;95%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              96.8%
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +1.4%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Average tech dispatch within <strong>6.2 mins</strong> of classroom failure report.
          </p>
        </div>

        {/* MTTR (Mean Time to Resolution) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Mean Time to Resolution (MTTR)</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              24.5 min
            </span>
            <span className="text-xs text-slate-500">campus avg</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Critical classes resolved in under <strong>18 mins</strong> on average.
          </p>
        </div>

        {/* First Time Fix Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>First-Trip Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              88.4%
            </span>
            <span className="text-xs text-slate-500">spares on-hand</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            88% of issues fixed without needing warehouse re-order.
          </p>
        </div>

        {/* Preventive Maintenance Audits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Morning Sweep Inspections</span>
            <ShieldCheck className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              100%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Completed</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            All 24 classrooms inspected prior to 08:00 AM class start.
          </p>
        </div>
      </div>

      {/* Two Column Section: Equipment Failure Breakdown & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequent Failure Equipment */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Equipment Vulnerability Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of {totalFailuresTracked} reported hardware failures across campus this semester.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: {totalFailuresTracked}</span>
          </div>

          <div className="space-y-3.5">
            {[
              { cat: 'projector', label: 'Laser Projectors & Displays', count: 14, color: 'bg-rose-500' },
              { cat: 'microphone', label: 'Wireless Microphones & PA', count: 11, color: 'bg-amber-500' },
              { cat: 'hdmi_display', label: 'HDMI & USB-C Wall Plates', count: 9, color: 'bg-indigo-500' },
              { cat: 'ac_fan', label: 'Climate Control AC & Fans', count: 7, color: 'bg-cyan-500' },
              { cat: 'smartboard', label: 'Interactive Smartboards', count: 5, color: 'bg-emerald-500' },
              { cat: 'lectern_pc', label: 'Lectern PCs & OS Lockups', count: 3, color: 'bg-purple-500' },
            ].map((item) => {
              const pct = Math.round((item.count / totalFailuresTracked) * 100);

              return (
                <div key={item.cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <EquipmentIcon category={item.cat as any} className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-800">{item.label}</span>
                    </div>
                    <span className="font-mono text-slate-600 font-bold">
                      {item.count} tickets ({pct}%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Reliability Leaderboard */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Classrooms Requiring Priority Attention
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequent incident hotspots and scheduled preventive maintenance backlog.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {roomsByIncidentCount.map((room) => (
                <div
                  key={room.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs">
                      {room.code.split('-')[1] || room.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">{room.code}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {room.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {room.buildingName} • Floor {room.floor}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        room.readinessStatus === 'ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : room.readinessStatus === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {room.readinessScore}% Health
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">
                      {room.openIncidentsCount > 0 ? `${room.openIncidentsCount} active issue` : 'All clear'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated Daily Calibration: Active</span>
            <span className="font-semibold text-brand-600">Download Semester Report (PDF)</span>
          </div>
        </div>
      </div>

      {/* On-Duty Technicians Performance */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          On-Duty Facilities & AV Engineering Staff
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Live assignment status and active ticket load across campus zones.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-xs block truncate">
                      {tech.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {tech.role}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80">
                  <span className="font-semibold block text-slate-700">Specialty:</span>
                  <span className="truncate block">{tech.specialization}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Load:</span>
                <span className="font-mono font-bold text-slate-800">
                  {tech.activeTickets} tickets
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
