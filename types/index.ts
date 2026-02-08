
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    role: 'student' | 'admin' | string;
    isPremium: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface School {
    id: string;
    name: string;
    description: string;
    country: string;
    city?: string | null;
    program: string;
    price?: number | null;
    imageUrl?: string | null;
    website?: string | null;
    ranking?: number | null;
    badges: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface OrientationResponse {
    id: string;
    userId: string;
    level: string;
    country: string;
    objectives: string;
    profile: string;
    score: number;
    createdAt: string | Date;
}

export interface Recommendation {
    id: string;
    userId: string;
    schoolId: string;
    score: number;
    createdAt: string | Date;
    school?: School;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    stripeId?: string | null;
    status: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface FileUpload {
    id: string;
    userId: string;
    fileName: string;
    filePath: string;
    fileType: string;
    category?: string | null;
    createdAt: string | Date;
}

export interface Application {
    id: string;
    userId: string;
    schoolId: string;
    status: 'interested' | 'applied' | 'in_progress' | 'accepted' | 'rejected' | string;
    notes?: string | null;
    applicationDate?: string | Date | null;
    deadline?: string | Date | null;
    interviewDate?: string | Date | null;
    resultDate?: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    school?: School;
}

export interface Favorite {
    id: string;
    userId: string;
    schoolId: string;
    createdAt: string | Date;
    school?: School;
}

export interface Housing {
    id: string;
    name: string;
    description: string;
    city: string;
    country: string;
    type: string;
    price?: number | null;
    partner: string;
    imageUrl?: string | null;
    amenities: string[];
    available: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface HousingPartner {
    id: string;
    name: string;
    email: string;
    website: string;
    cities: string[];
    description?: string | null;
    imageUrl?: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
}
