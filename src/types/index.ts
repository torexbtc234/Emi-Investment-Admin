export interface Admin {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  permissions: string[] | null;
  last_login_at: string;
  last_login_ip: string;
  status: string;
}

export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  country: string | null;
  wallet_balance: number;
  total_deposited: number;
  total_withdrawn: number;
  total_profit: number;
  referral_code: string;
  kyc_status: 'pending' | 'approved' | 'rejected' | 'none';
  status: 'active' | 'banned' | 'suspended';
  email_verified: boolean;
  created_at: string;
}

export interface Deposit {
  id: number;
  user_id: number;
  username: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

export interface Withdrawal {
  id: number;
  user_id: number;
  username: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  min_amount: number;
  max_amount: number | null;
  weekly_roi: number;
  duration_weeks: number;
  is_active: boolean;
}

export interface Car {
  id: number;
  name: string;
  model: string;
  price: number;
  apy: number;
  image_url: string | null;
  is_active: boolean;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  username: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
}

export interface KYCDocument {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface DashboardStats {
  users: { total: number; new_this_month: number };
  deposits: { total: number; monthly: number; pending_count: number; pending_amount: number };
  withdrawals: { total: number; pending_count: number; pending_amount: number };
  investments: { active_count: number; active_amount: number; total_roi_paid: number };
  pending: { kyc: number; tickets: number };
  recent_activities: any[];
  charts: { deposits: any[]; withdrawals: any[] };
}
