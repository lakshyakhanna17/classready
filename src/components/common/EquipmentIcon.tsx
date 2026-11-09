import React from 'react';
import {
  Projector,
  Mic,
  MonitorCheck,
  Wind,
  Cpu,
  Volume2,
  Tv,
  Wifi,
  HelpCircle,
} from 'lucide-react';
import { EquipmentCategory } from '../../types';

interface EquipmentIconProps {
  category: EquipmentCategory;
  className?: string;
}

export const EquipmentIcon: React.FC<EquipmentIconProps> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'projector':
      return <Projector className={className} />;
    case 'microphone':
      return <Mic className={className} />;
    case 'smartboard':
      return <MonitorCheck className={className} />;
    case 'ac_fan':
      return <Wind className={className} />;
    case 'lectern_pc':
      return <Cpu className={className} />;
    case 'audio_system':
      return <Volume2 className={className} />;
    case 'hdmi_display':
      return <Tv className={className} />;
    case 'network_power':
      return <Wifi className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

