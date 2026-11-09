import React, { useState, useMemo } from 'react';
import { useClassReady } from './context/ClassReadyContext';
import { Navbar } from './components/common/Navbar';
import { SubHeader } from './components/readiness/SubHeader';
import { RoomCard } from './components/readiness/RoomCard';
import { RoomTableView } from './components/readiness/RoomTableView';
import { RoomDetailModal } from './components/rooms/RoomDetailModal';
import { ReportIssueModal } from './components/reports/ReportIssueModal';
import { QrPlacardModal } from './components/common/QrPlacardModal';
import { TicketDetailDrawer } from './components/dispatch/TicketDetailDrawer';
import { WorkOrdersKanban } from './components/dispatch/WorkOrdersKanban';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PodiumKioskSimulator } from './components/kiosk/PodiumKioskSimulator';
import { ToastContainer } from './components/ui/ToastContainer';
import { LayoutGrid, Plus } from 'lucide-react';
import { Button } from './components/ui/Button';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'dispatch' | 'analytics' | 'kiosk'>('overview');

  const {
    classrooms,
    searchQuery,
    selectedBuildingId,
    selectedFloor,
    selectedStatus,
    viewMode,
    selectedRoom,
    setSelectedRoom,
    qrModalRoom,
    closeQRModal,
    activeTicketDrawer,
    setActiveTicketDrawer,
    openReportModal,
  } = useClassReady();

  // Filter classrooms based on user selection
  const filteredRooms = useMemo(() => {
    return classrooms.filter((room) => {
      // Building filter
      if (selectedBuildingId !== 'all' && room.buildingId !== selectedBuildingId) {
        return false;
      }
      // Floor filter
      if (selectedFloor !== 'all' && room.floor !== selectedFloor) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && room.readinessStatus !== selectedStatus) {
        return false;
      }
      // Search query filter (matches room code, name, building, equipment, instructor)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const codeMatch = room.code.toLowerCase().includes(q);
        const nameMatch = room.name.toLowerCase().includes(q);
        const bldMatch = room.buildingName.toLowerCase().includes(q);
        const eqMatch = room.equipments.some((e) => e.name.toLowerCase().includes(q) || e.model.toLowerCase().includes(q));
        const classMatch = room.currentClass
          ? room.currentClass.subjectCode.toLowerCase().includes(q) ||
            room.currentClass.instructor.toLowerCase().includes(q)
          : false;

        if (!codeMatch && !nameMatch && !bldMatch && !eqMatch && !classMatch) {
          return false;
        }
      }
      return true;
    });
  }, [classrooms, selectedBuildingId, selectedFloor, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Main Navigation Bar */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Body Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: Classroom Readiness Grid / Table */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* SubHeader with filter pills & metric summary */}
            <SubHeader />

            {/* Content: Grid or Table View */}
            {filteredRooms.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No matching classrooms found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search keywords, clearing building filters, or selecting "All" statuses.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onOpenDetail={(r) => setSelectedRoom(r)}
                  />
                ))}
              </div>
            ) : (
              <RoomTableView
                rooms={filteredRooms}
                onOpenDetail={(r) => setSelectedRoom(r)}
              />
            )}
          </div>
        )}

        {/* TAB 2: Dispatch & Work Orders Kanban */}
        {currentTab === 'dispatch' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Technician Dispatch & Work Order Triage
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time ticket progression, specialist assignments, and on-site repair resolution logs.
                </p>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => openReportModal()}
                className="text-xs gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Incident Ticket</span>
              </Button>
            </div>

            <WorkOrdersKanban />
          </div>
        )}

        {/* TAB 3: Campus Analytics & Reliability */}
        {currentTab === 'analytics' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Campus Equipment Analytics & Reliability Metrics
              </h2>
              <p className="text-xs text-slate-500">
                Data insights on MTTR, failure-prone equipment, and classroom readiness compliance.
              </p>
            </div>

            <AnalyticsView />
          </div>
        )}

        {/* TAB 4: Lectern QR Simulator */}
        {currentTab === 'kiosk' && <PodiumKioskSimulator />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ClassReady</span>
            <span>•</span>
            <span>Campus Classroom Readiness & AV Facilities Management</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Facilities Dispatch: x4357</span>
            <span>•</span>
            <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              Server Time: 09:42 AM EST
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />

      <ReportIssueModal />

      <QrPlacardModal
        room={qrModalRoom}
        onClose={closeQRModal}
        onSimulateMobileScan={() => {
          setCurrentTab('kiosk');
        }}
      />

      <TicketDetailDrawer
        incident={activeTicketDrawer}
        onClose={() => setActiveTicketDrawer(null)}
      />

      {/* Toast Feedback System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
