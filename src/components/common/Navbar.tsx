import React from 'react';
import {
  LayoutGrid,
  Wrench,
  BarChart3,
  QrCode,
  Plus,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useClassReady } from '../../context/ClassReadyContext';
import { Button } from '../ui/Button';

export interface NavbarProps {
  currentTab: 'overview' | 'dispatch' | 'analytics' | 'kiosk';
  onSelectTab: (tab: 'overview' | 'dispatch' | 'analytics' | 'kiosk') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { metrics, openReportModal, resetToSampleData } = useClassReady();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-8">
            <div
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <span className="font-bold text-lg tracking-tight font-mono text-cyan-400">CR</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 tracking-tight">ClassReady</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Ops v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Classroom Readiness & AV Operations
                </p>
              </div>
            </div>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onSelectTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                  currentTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Classroom Readiness</span>
              </button>

              <button
                onClick={() => onSelectTab('dispatch')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all relative ${
                  currentTab === 'dispatch'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Dispatch & Kanban</span>
                {metrics.urgentTickets > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      currentTab === 'dispatch'
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {metrics.urgentTickets}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('analytics')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                  currentTab === 'analytics'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Reliability</span>
              </button>

              <button
                onClick={() => onSelectTab('kiosk')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                  currentTab === 'kiosk'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Podium QR Simulator</span>
              </button>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Live Campus Health Pill */}
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 text-xs">
              {metrics.criticalRooms > 0 ? (
                <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>{metrics.criticalRooms} Room Action Required</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Campus Readiness</span>
                </div>
              )}
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-600 font-semibold">
                {metrics.overallReadinessPercentage}% Operational
              </span>
            </div>

            {/* Reset data for testing */}
            <button
              onClick={resetToSampleData}
              title="Reset sample campus data"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Report Failure button */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => openReportModal()}
              className="shadow-sm font-semibold gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Report Equipment Failure</span>
            </Button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              currentTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Rooms ({metrics.totalRooms})
          </button>
          <button
            onClick={() => onSelectTab('dispatch')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'dispatch' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Dispatch
            {metrics.urgentTickets > 0 && (
              <span className="px-1 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {metrics.urgentTickets}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              currentTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => onSelectTab('kiosk')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              currentTab === 'kiosk' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            QR Kiosk
          </button>
        </div>
      </div>
    </header>
  );
};
