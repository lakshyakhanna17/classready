import React from 'react';
import { Printer, ExternalLink, QrCode, Sparkles, Check, Copy } from 'lucide-react';
import { Classroom } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getReadinessBadge } from '../../utils';

interface QrPlacardModalProps {
  room: Classroom | null;
  onClose: () => void;
  onSimulateMobileScan: (room: Classroom) => void;
}

export const QrPlacardModal: React.FC<QrPlacardModalProps> = ({
  room,
  onClose,
  onSimulateMobileScan,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!room) return null;

  const badgeInfo = getReadinessBadge(room.readinessStatus);
  const portalUrl = `https://classready.campus.edu/scan?room=${room.code}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!room}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-slate-700" />
          <span>Podium QR Placard — {room.code}</span>
        </div>
      }
      subtitle="Classroom equipment failure reporting placard for lecterns and podiums."
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Physical Placard Preview Container */}
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-900 shadow-xl relative overflow-hidden select-none print:shadow-none print:border-black">
          {/* Header strip */}
          <div className="border-b border-slate-200 pb-4 mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-slate-950 tracking-wider">
                  {room.code}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
                  ClassReady System
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-700 mt-1">{room.name}</h4>
              <p className="text-[11px] text-slate-500">
                {room.buildingName} • Floor {room.floor} • Capacity: {room.capacity}
              </p>
            </div>

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
          </div>

          {/* QR Code graphic & instructions */}
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            {/* High visual quality simulated SVG QR code */}
            <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-sm shrink-0 flex flex-col items-center">
              <svg
                viewBox="0 0 120 120"
                className="w-36 h-36 text-slate-900"
                fill="currentColor"
              >
                {/* QR code geometric matrix simulation */}
                {/* Top-left corner */}
                <rect x="10" y="10" width="30" height="30" rx="3" fill="#0f172a" />
                <rect x="15" y="15" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="20" y="20" width="10" height="10" rx="1" fill="#0f172a" />

                {/* Top-right corner */}
                <rect x="80" y="10" width="30" height="30" rx="3" fill="#0f172a" />
                <rect x="85" y="15" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="90" y="20" width="10" height="10" rx="1" fill="#0f172a" />

                {/* Bottom-left corner */}
                <rect x="10" y="80" width="30" height="30" rx="3" fill="#0f172a" />
                <rect x="15" y="85" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="20" y="90" width="10" height="10" rx="1" fill="#0f172a" />

                {/* Central and payload grid data dots */}
                <rect x="48" y="12" width="6" height="12" fill="#0f172a" />
                <rect x="62" y="12" width="10" height="6" fill="#0f172a" />
                <rect x="48" y="28" width="8" height="8" fill="#0f172a" />
                <rect x="62" y="26" width="12" height="10" fill="#0f172a" />

                <rect x="12" y="48" width="10" height="8" fill="#0f172a" />
                <rect x="28" y="48" width="14" height="6" fill="#0f172a" />
                <rect x="12" y="62" width="12" height="12" fill="#0f172a" />
                <rect x="30" y="64" width="8" height="8" fill="#0f172a" />

                {/* Center marker */}
                <circle cx="60" cy="60" r="10" fill="#0284c7" />
                <circle cx="60" cy="60" r="5" fill="#ffffff" />

                {/* Right side data bits */}
                <rect x="80" y="48" width="14" height="6" fill="#0f172a" />
                <rect x="100" y="48" width="10" height="12" fill="#0f172a" />
                <rect x="80" y="60" width="8" height="12" fill="#0f172a" />
                <rect x="96" y="68" width="14" height="6" fill="#0f172a" />

                {/* Bottom bits */}
                <rect x="48" y="82" width="14" height="6" fill="#0f172a" />
                <rect x="68" y="82" width="8" height="12" fill="#0f172a" />
                <rect x="82" y="84" width="12" height="12" fill="#0f172a" />
                <rect x="100" y="84" width="10" height="8" fill="#0f172a" />
                <rect x="48" y="98" width="10" height="12" fill="#0f172a" />
                <rect x="64" y="102" width="16" height="8" fill="#0f172a" />
                <rect x="86" y="102" width="14" height="8" fill="#0f172a" />
              </svg>
              <span className="text-[10px] font-mono font-bold text-slate-600 mt-2 tracking-wide">
                SCAN WITH PHONE
              </span>
            </div>

            {/* Instruction list */}
            <div className="flex-1 space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Facing an equipment issue?
              </h5>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Scan code with camera to open instant report.</li>
                <li>No app download or login required for faculty.</li>
                <li>Direct dispatch to on-duty AV technician.</li>
                <li>Avg response time: <strong>12-18 mins</strong>.</li>
              </ul>
              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                Direct Helpdesk: <span className="font-semibold text-slate-800">x4357 (HELP)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>ClassReady Smart Campus Tag #CR-{room.code}</span>
            <span>Classroom AV Operations</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={copyUrl}
              className="flex-1 sm:flex-none text-xs gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied URL' : 'Copy Direct URL'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex-1 sm:flex-none text-xs gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Placard</span>
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onSimulateMobileScan(room);
            }}
            className="w-full sm:w-auto text-xs gap-2 bg-brand-600 hover:bg-brand-700"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Simulate Mobile Scan Portal</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

