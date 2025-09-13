export interface NotificationType {
  id: number;
  user_id: number;
  type: string;
  data: Record<string, any>;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}