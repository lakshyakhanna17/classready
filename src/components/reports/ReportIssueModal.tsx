import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Projector,
  Mic,
  MonitorCheck,
  Wind,
  Cpu,
  Volume2,
  Tv,
  Wifi,
} from 'lucide-react';
import { EquipmentCategory, IncidentSeverity } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useClassReady } from '../../context/ClassReadyContext';

const COMMON_SYMPTOMS: Record<EquipmentCategory, string[]> = {
  projector: ['No display / Lamp won’t turn on', 'Overheat warning & thermal shutdown', 'Image flickering / wrong colors', 'Blurry focus / keystone distorted'],
  microphone: ['Dead mic / Won’t power on', 'Loud feedback & squealing', 'Severe audio dropouts when moving', 'Battery dead in podium charger'],
  smartboard: ['Touch screen dead zone / offset', 'Stylus not recognized', 'Screen frozen on splash screen', 'HDMI touch input cable missing'],
  ac_fan: ['Water dripping from indoor unit', 'Fan making loud grinding noise', 'No cold air / Room too hot', 'Remote control missing or dead'],
  lectern_pc: ['PC won’t power on', 'Windows login locked / reboot loop', 'USB ports not reading flash drive', 'Keyboard/mouse missing or broken'],
  audio_system: ['Loud 60Hz buzzing / ground hum', 'No audio from podium speakers', 'Volume knob crackling', 'Sound cut off in rear of hall'],
  hdmi_display: ['HDMI cable damaged / pins bent', 'USB-C adapter "No Signal"', 'Wall plate connector loose', 'Intermittent flicker when moved'],
  network_power: ['Lectern power strip tripped', 'Wi-Fi disconnects repeatedly', 'Ethernet port has no link light', 'Floor pop-up box damaged'],
};

export const ReportIssueModal: React.FC = () => {
  const { classrooms, reportModal, closeReportModal, reportIssue } = useClassReady();

  // Form State
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory>('projector');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [impactsClassNow, setImpactsClassNow] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('Prof. Sarah Jenkins');
  const [reporterRole, setReporterRole] = useState<'Faculty' | 'Student' | 'Teaching Assistant' | 'IT Staff'>('Faculty');
  const [reporterEmail, setReporterEmail] = useState<string>('sjenkins@campus.edu');
  const [reporterPhone, setReporterPhone] = useState<string>('+1 (555) 492-8810');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When modal opens or prefill changes, populate room & equipment
  useEffect(() => {
    if (reportModal.isOpen) {
      const initialRoomId = reportModal.prefillRoomId || (classrooms[0] ? classrooms[0].id : '');
      setSelectedRoomId(initialRoomId);

      const targetRoom = classrooms.find((r) => r.id === initialRoomId);
      if (targetRoom && targetRoom.equipments.length > 0) {
        if (reportModal.prefillEquipmentId) {
          const prefillEq = targetRoom.equipments.find((e) => e.id === reportModal.prefillEquipmentId);
          if (prefillEq) {
            setSelectedCategory(prefillEq.category);
            setSelectedEquipmentId(prefillEq.id);
            setTitle(`${prefillEq.name} equipment failure`);
          }
        } else {
          const firstEq = targetRoom.equipments[0];
          setSelectedCategory(firstEq.category);
          setSelectedEquipmentId(firstEq.id);
          setTitle(`${firstEq.name} malfunction`);
        }
      }
    }
  }, [reportModal, classrooms]);

  // When room changes, update equipment dropdown
  const currentRoom = classrooms.find((r) => r.id === selectedRoomId);
  const availableEquipments = currentRoom
    ? currentRoom.equipments.filter((e) => e.category === selectedCategory)
    : [];

  // Update selected equipment if category or room changes
  useEffect(() => {
    if (availableEquipments.length > 0) {
      if (!availableEquipments.some((e) => e.id === selectedEquipmentId)) {
        setSelectedEquipmentId(availableEquipments[0].id);
        if (!title || title.includes('malfunction')) {
          setTitle(`${availableEquipments[0].name} issue`);
        }
      }
    } else if (currentRoom && currentRoom.equipments.length > 0) {
      // Fallback if no equipment matches this category
      setSelectedEquipmentId(currentRoom.equipments[0].id);
    }
  }, [selectedCategory, selectedRoomId]);

  const handleSymptomClick = (symptom: string) => {
    setTitle(symptom);
    setDescription((prev) => (prev ? `${prev}\n- ${symptom}` : symptom));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!selectedRoomId) newErrors.roomId = 'Please select a classroom';
    if (!selectedEquipmentId) newErrors.equipmentId = 'Please select the affected equipment';
    if (!title.trim()) newErrors.title = 'Please provide an issue title or symptom';
    if (!description.trim()) newErrors.description = 'Please describe the problem details';
    if (!reporterName.trim()) newErrors.reporterName = 'Reporter name is required';
    if (!reporterEmail.trim()) newErrors.reporterEmail = 'Contact email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      reportIssue({
        roomId: selectedRoomId,
        equipmentId: selectedEquipmentId,
        category: selectedCategory,
        title: title.trim(),
        description: description.trim(),
        severity,
        impactsClassNow,
        reporterName: reporterName.trim(),
        reporterRole,
        reporterEmail: reporterEmail.trim(),
        reporterPhone: reporterPhone.trim(),
      });

      setIsSubmitting(false);
      closeReportModal();
    }, 400);
  };

  return (
    <Modal
      isOpen={reportModal.isOpen}
      onClose={closeReportModal}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span>Report Classroom Equipment Failure</span>
        </div>
      }
      subtitle="Immediate alert dispatched to building technicians and facilities operations."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Select Classroom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Classroom Location *
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {classrooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} — {r.name} ({r.buildingName})
                </option>
              ))}
            </select>
            {errors.roomId && <p className="text-xs text-rose-600 mt-1">{errors.roomId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Is Class In Session Right Now?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setImpactsClassNow(true);
                  setSeverity('critical');
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  impactsClassNow
                    ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Yes, Class Blocked
              </button>

              <button
                type="button"
                onClick={() => {
                  setImpactsClassNow(false);
                  setSeverity('medium');
                }}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  !impactsClassNow
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                No, Routine Fix
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Equipment Category Touch Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Equipment Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'projector', label: 'Projector', icon: Projector },
              { id: 'microphone', label: 'Microphone', icon: Mic },
              { id: 'smartboard', label: 'Smartboard', icon: MonitorCheck },
              { id: 'ac_fan', label: 'AC / Fan', icon: Wind },
              { id: 'lectern_pc', label: 'Lectern PC', icon: Cpu },
              { id: 'audio_system', label: 'Speakers', icon: Volume2 },
              { id: 'hdmi_display', label: 'HDMI / Wall Pod', icon: Tv },
              { id: 'network_power', label: 'Wi-Fi / Power', icon: Wifi },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as EquipmentCategory)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Specific Device Selector (from room inventory) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Specific Device In Room *
          </label>
          {availableEquipments.length > 0 ? (
            <select
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono text-xs"
            >
              {availableEquipments.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} — {eq.model} (SN: {eq.serialNumber})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              Note: No {selectedCategory} is cataloged in this room. Report will be logged as a general room incident.
            </p>
          )}
          {errors.equipmentId && <p className="text-xs text-rose-600 mt-1">{errors.equipmentId}</p>}
        </div>

        {/* Quick Symptoms Chips */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Common Symptoms (Click to fill)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(COMMON_SYMPTOMS[selectedCategory] || []).map((symptom, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSymptomClick(symptom)}
                className="text-[11px] bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-md transition-colors text-left"
              >
                + {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <Input
            label="Issue Summary *"
            placeholder="e.g. Projector overheating warning code 0x82"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Problem Details & Symptoms *
            </label>
            <textarea
              rows={3}
              placeholder="Describe what happened: e.g. Did it shut down? Are there error lights? How many students are present?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Severity selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Severity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'critical', label: 'Critical', desc: 'Class Blocked', color: 'border-rose-400 bg-rose-50 text-rose-900' },
              { id: 'high', label: 'High', desc: 'Major Impairment', color: 'border-orange-400 bg-orange-50 text-orange-900' },
              { id: 'medium', label: 'Medium', desc: 'Partial Workaround', color: 'border-amber-400 bg-amber-50 text-amber-900' },
              { id: 'low', label: 'Low', desc: 'Cosmetic / Minor', color: 'border-slate-300 bg-slate-50 text-slate-800' },
            ].map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => setSeverity(sev.id as IncidentSeverity)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  severity === sev.id
                    ? `${sev.color} ring-2 ring-slate-900/10 font-bold`
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">{sev.label}</div>
                <div className="text-[10px] opacity-75 font-normal truncate">{sev.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Reporter info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Reporter Information
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name *"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              error={errors.reporterName}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Role *
              </label>
              <select
                value={reporterRole}
                onChange={(e) =>
                  setReporterRole(e.target.value as 'Faculty' | 'Student' | 'Teaching Assistant' | 'IT Staff')
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value="Faculty">Faculty / Professor</option>
                <option value="Teaching Assistant">Teaching Assistant (TA)</option>
                <option value="Student">Student</option>
                <option value="IT Staff">IT Staff / Admin</option>
              </select>
            </div>
            <Input
              label="Email Address *"
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              error={errors.reporterEmail}
            />
            <Input
              label="Phone Number (for quick callback)"
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="secondary" type="button" onClick={closeReportModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            type="submit"
            isLoading={isSubmitting}
            className="font-semibold shadow-sm"
          >
            Submit Incident & Alert Technicians
          </Button>
        </div>
      </form>
    </Modal>
  );
};
