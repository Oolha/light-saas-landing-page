export interface PricingTier {
  _id: string;
  title: string;
  monthlyPrice: number;
  buttonText: string;
  popular: boolean;
  inverse: boolean;
  features: string[];
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
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
