import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EquipmentCategory, EquipmentHealth, IncidentSeverity, IncidentStatus, ReadinessStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export function getReadinessBadge(status: ReadinessStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'ready':
      return {
        label: '100% Ready',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'degraded':
      return {
        label: 'Partially Degraded',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'critical':
      return {
        label: 'Action Required',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'maintenance':
      return {
        label: 'Scheduled Maintenance',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
      };
  }
}

export function getEquipmentHealthBadge(health: EquipmentHealth): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (health) {
    case 'operational':
      return {
        label: 'Operational',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'degraded':
      return {
        label: 'Degraded',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'offline':
      return {
        label: 'Offline / Failed',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'maintenance':
      return {
        label: 'In Repair',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
  }
}

export function getSeverityBadge(severity: IncidentSeverity): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'critical':
      return {
        label: 'Critical / Class Blocked',
        bg: 'bg-rose-100 text-rose-800',
        text: 'text-rose-800',
        border: 'border-rose-300',
      };
    case 'high':
      return {
        label: 'High Priority',
        bg: 'bg-orange-100 text-orange-800',
        text: 'text-orange-800',
        border: 'border-orange-300',
      };
    case 'medium':
      return {
        label: 'Medium',
        bg: 'bg-amber-100 text-amber-800',
        text: 'text-amber-800',
        border: 'border-amber-300',
      };
    case 'low':
      return {
        label: 'Low',
        bg: 'bg-slate-100 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-200',
      };
  }
}

export function getStatusBadge(status: IncidentStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'reported':
      return {
        label: 'New Report',
        bg: 'bg-rose-50 text-rose-700',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    case 'acknowledged':
      return {
        label: 'Acknowledged',
        bg: 'bg-indigo-50 text-indigo-700',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      };
    case 'in_progress':
      return {
        label: 'Technician Dispatched',
        bg: 'bg-blue-50 text-blue-700',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'awaiting_parts':
      return {
        label: 'Awaiting Spare/Unit',
        bg: 'bg-amber-50 text-amber-700',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        bg: 'bg-emerald-50 text-emerald-700',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'closed':
      return {
        label: 'Verified & Closed',
        bg: 'bg-slate-100 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-200',
      };
  }
}

export function getCategoryDisplayName(cat: EquipmentCategory): string {
  switch (cat) {
    case 'projector':
      return 'Projector & Display';
    case 'microphone':
      return 'Microphone & Audio Input';
    case 'smartboard':
      return 'Smart Board / Interactive Panel';
    case 'ac_fan':
      return 'AC & Ventilation';
    case 'lectern_pc':
      return 'Lectern PC & Console';
    case 'audio_system':
      return 'Speakers & PA System';
    case 'hdmi_display':
      return 'HDMI / USB-C & Wall Plates';
    case 'network_power':
      return 'Wi-Fi & Power Outlets';
  }
}

