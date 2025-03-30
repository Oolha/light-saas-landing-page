export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};
export interface Subscription {
  plan: "Free" | "Pro" | "Business";
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  paymentId: string | null;
  stripeSubscriptionId?: string | null;
  stripeCustomerId?: string | null;
  status?: string;
  currentPeriodEnd?: Date | string | null;
}

export type SubscriptionResponse = ApiResponse<{ subscription: Subscription }>;

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
  stripeCustomerId?: string | null;
  subscription: {
    plan: "Free" | "Pro" | "Business";
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    stripeSubscriptionId?: string | null;
    status?: string;
    currentPeriodEnd?: string | null;
  };
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
  refreshUserData: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
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

export interface StripeCheckoutSession {
  sessionId: string;
}

export interface StripePortalSession {
  url: string;
}
