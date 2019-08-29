export interface Article {
    title: string;
    price: number;
    description: string;
    category: string;
    pictures: string[];
    averageStar ?: number;
    state: string;
    city: string;
    createdAt ?: number;
    id ?: string;
    utilisateurId ?: string;
    owner ?: string;
    availability: Availability;
}


export interface Availability {
    available: boolean;
    type ?: string;
    feed ?: number;
    address ?: string;
}
