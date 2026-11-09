import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { IncidentStatus } from '../../types';
import { EquipmentIcon } from '../common/EquipmentIcon';
import { Badge } from '../ui/Badge';
import { getSeverityBadge } from '../../utils';
import { useClassReady } from '../../context/ClassReadyContext';

const KANBAN_COLUMNS: { id: IncidentStatus; title: string; color: string }[] = [
  { id: 'reported', title: 'New Reports', color: 'border-t-rose-500' },
  { id: 'acknowledged', title: 'Dispatched', color: 'border-t-indigo-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-t-blue-500' },
  { id: 'awaiting_parts', title: 'Awaiting Parts', color: 'border-t-amber-500' },
  { id: 'resolved', title: 'Resolved & Closed', color: 'border-t-emerald-500' },
];

export const WorkOrdersKanban: React.FC = () => {
  const { incidents, setActiveTicketDrawer } = useClassReady();

  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchSearch =
      inc.roomCode.toLowerCase().includes(search.toLowerCase()) ||
      inc.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase());

    const matchSeverity = filterSeverity === 'all' || inc.severity === filterSeverity;

    return matchSearch && matchSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tickets, rooms or technicians..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <strong>{filteredIncidents.length}</strong> work orders
        </div>
      </div>

      {/* 5 Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {KANBAN_COLUMNS.map((column) => {
          const colTickets = filteredIncidents.filter((i) => i.status === column.id);

          return (
            <div
              key={column.id}
              className={`bg-slate-100/70 rounded-2xl border border-slate-200/80 p-3 flex flex-col min-h-[480px] border-t-4 ${column.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                    {column.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700 shadow-2xs">
                    {colTickets.length}
                  </span>
                </div>
              </div>

              {/* Tickets list */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTickets.length === 0 ? (
                  <div className="text-center py-10 px-2 text-slate-400 text-xs italic">
                    No tickets in this lane
                  </div>
                ) : (
                  colTickets.map((ticket) => {
                    const sev = getSeverityBadge(ticket.severity);

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setActiveTicketDrawer(ticket)}
                        className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all cursor-pointer space-y-2.5 relative group"
                      >
                        {/* Top row: Ticket ID & Room */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {ticket.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={ticket.severity === 'critical' ? 'danger' : 'warning'}
                              size="sm"
                              className="text-[10px] py-0 px-1.5"
                            >
                              {sev.label.split('/')[0].trim()}
                            </Badge>
                            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
                              {ticket.roomCode}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                          {ticket.title}
                        </p>

                        {/* Equipment Tag */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <EquipmentIcon category={ticket.category} className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{ticket.equipmentName.split('(')[0]}</span>
                        </div>

                        {/* Ongoing Class Alert */}
                        {ticket.impactsClassNow && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            <span>Active Class Impacted</span>
                          </div>
                        )}

                        {/* Assigned Technician or ETA */}
                        {ticket.assignedTechnician ? (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={ticket.assignedTechnician.avatar}
                                alt={ticket.assignedTechnician.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="font-medium text-slate-700 truncate max-w-[100px]">
                                {ticket.assignedTechnician.name.split(' ')[0]}
                              </span>
                            </div>
                            {ticket.etaMinutes && (
                              <span className="text-[10px] font-mono text-slate-500">
                                ~{ticket.etaMinutes}m ETA
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Unassigned</span>
                            <span className="text-rose-600 font-semibold text-[10px]">
                              Assign tech →
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
