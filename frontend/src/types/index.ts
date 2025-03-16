interface NavigationItem {
  label: string;
  sectionId: string;
}

export interface NavigationProps {
  className?: string;
  itemClassName?: string;
  withButton?: boolean;
  direction?: "horizontal" | "vertical";
  buttonText?: string;
  onButtonClick?: () => void;
  items?: NavigationItem[];
  onLinkClick?: () => void;
}
export interface PricingTier {
  _id: string;
  title: string;
  monthlyPrice: number;
  buttonText: string;
  popular: boolean;
  inverse: boolean;
  features: string[];
  order: number;
}

export interface Testimonial {
  _id: string;
  text: string;
  imageSrc: string;
  imagePublicId?: string;
  name: string;
  username: string;
}

export interface UploadResponse {
  message: string;
  imageUrl: string;
  publicId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  subscription?: Subscription;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    plan?: "Free" | "Pro" | "Business"
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export interface Subscription {
  plan: "Free" | "Pro" | "Business";
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  paymentId: string | null;
}
export interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}
