export interface Notification {
    id ?: string;
    title: string;
    message: string;
    avatar: string;
    createdAt: number;
    read ?: boolean;
    sender ?: string;
    utilisateurId ?: string;
}
