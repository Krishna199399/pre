import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  CheckCircle2,
  ChefHat,
  Eye,
  Flame,
  Globe,
  GraduationCap,
  HardHat,
  HeartHandshake,
  Hotel,
  Leaf,
  Lightbulb,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Wifi,
  Wrench,
  type LucideProps,
} from 'lucide-react'
import React from 'react'

const icons = {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  CheckCircle2,
  ChefHat,
  Eye,
  Flame,
  Globe,
  GraduationCap,
  HardHat,
  HeartHandshake,
  Hotel,
  Leaf,
  Lightbulb,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Wifi,
  Wrench,
}

export type IconName = keyof typeof icons

/** Renders one of the admin-selectable icons by name (see fields/section.ts). */
export const Icon: React.FC<{ name?: string | null } & Omit<LucideProps, 'name'>> = ({ name, ...props }) => {
  const Cmp = (name && icons[name as IconName]) || Sparkles
  return <Cmp aria-hidden {...props} />
}
