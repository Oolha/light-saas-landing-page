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
