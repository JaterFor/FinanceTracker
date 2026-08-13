import {
  Baby,
  Banknote,
  Briefcase,
  Bus,
  Car,
  Coffee,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  type LucideIcon,
  Package,
  PawPrint,
  PiggyBank,
  Plane,
  ShoppingCart,
  Smartphone,
  Utensils,
  Wallet,
  Wrench,
} from 'lucide-react-native';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  utensils: Utensils,
  coffee: Coffee,
  car: Car,
  bus: Bus,
  home: Home,
  heart: Heart,
  'graduation-cap': GraduationCap,
  plane: Plane,
  gift: Gift,
  smartphone: Smartphone,
  gamepad: Gamepad2,
  dumbbell: Dumbbell,
  baby: Baby,
  'paw-print': PawPrint,
  wrench: Wrench,
  wallet: Wallet,
  banknote: Banknote,
  briefcase: Briefcase,
  'piggy-bank': PiggyBank,
  package: Package,
};

export function CategoryIcon({
  name,
  size = 20,
  color = '#fff',
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const Icon = CATEGORY_ICONS[name] ?? HelpCircle;
  return <Icon size={size} color={color} />;
}
