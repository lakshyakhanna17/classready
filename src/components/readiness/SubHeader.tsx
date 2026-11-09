import React from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import { useClassReady } from '../../context/ClassReadyContext';
import { ReadinessStatus } from '../../types';

export const SubHeader: React.FC = () => {
  const {
    metrics,
    searchQuery,
    setSearchQuery,
    selectedBuildingId,
    setSelectedBuildingId,
    selectedFloor,
    setSelectedFloor,
    selectedStatus,
    setSelectedStatus,
    buildings,
    viewMode,
    setViewMode,
  } = useClassReady();

  const activeFiltersCount =
    (selectedBuildingId !== 'all' ? 1 : 0) +
    (selectedFloor !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBuildingId('all');
    setSelectedFloor('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total Classrooms */}
        <div
          onClick={() => setSelectedStatus('all')}
          className={`p-3.5 rounded-xl border bg-white shadow-2xs cursor-pointer transition-all hover:border-slate-300 ${
            selectedStatus === 'all' ? 'ring-2 ring-slate-900/10 border-slate-400' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Rooms</span>
            <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              All Blocks
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.totalRooms}</span>
            <span className="text-xs text-slate-500">monitored</span>
          </div>
        </div>

        {/* 100% Ready */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'ready' ? 'all' : 'ready')}
          className={`p-3.5 rounded-xl border bg-white shadow-2xs cursor-pointer transition-all hover:border-emerald-300 ${
            selectedStatus === 'ready'
              ? 'ring-2 ring-emerald-500/20 border-emerald-500 bg-emerald-50/20'
              : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Ready
            </span>
            <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
              {metrics.overallReadinessPercentage}%
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 tracking-tight">{metrics.readyRooms}</span>
            <span className="text-xs text-emerald-600/80">all gear nominal</span>
          </div>
        </div>

        {/* Degraded */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'degraded' ? 'all' : 'degraded')}
          className={`p-3.5 rounded-xl border bg-white shadow-2xs cursor-pointer transition-all hover:border-amber-300 ${
            selectedStatus === 'degraded'
              ? 'ring-2 ring-amber-500/20 border-amber-500 bg-amber-50/20'
              : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Degraded
            </span>
            <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
              Minor
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700 tracking-tight">{metrics.degradedRooms}</span>
            <span className="text-xs text-amber-600/80">workaround active</span>
          </div>
        </div>

        {/* Critical */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'critical' ? 'all' : 'critical')}
          className={`p-3.5 rounded-xl border bg-white shadow-2xs cursor-pointer transition-all hover:border-rose-300 ${
            selectedStatus === 'critical'
              ? 'ring-2 ring-rose-500/20 border-rose-500 bg-rose-50/20'
              : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-medium">
            <span className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Critical Outage
            </span>
            {metrics.criticalRooms > 0 && (
              <span className="font-mono text-[11px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold animate-pulse">
                Action Req
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700 tracking-tight">{metrics.criticalRooms}</span>
            <span className="text-xs text-rose-600/80">class blocked</span>
          </div>
        </div>

        {/* Active Open Tickets */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3.5 rounded-xl border border-slate-200/80 bg-slate-900 text-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>Active Tickets</span>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded">
              MTTR 24m
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{metrics.activeIncidents}</span>
            <span className="text-xs text-slate-400">
              {metrics.urgentTickets} urgent in queue
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search room (e.g. ENG-204), equipment, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              ✕
            </button>
          )}
        </div>

        {/* Center: Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Building select */}
          <div className="flex items-center gap-1.5 text-xs">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Campus Buildings</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Floor select */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={selectedFloor}
              onChange={(e) =>
                setSelectedFloor(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Floors</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
              <option value="4">4th Floor</option>
            </select>
          </div>

          {/* Status filter pills */}
          <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
            {(['all', 'ready', 'degraded', 'critical'] as (ReadinessStatus | 'all')[]).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  selectedStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 shrink-0 self-end lg:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
