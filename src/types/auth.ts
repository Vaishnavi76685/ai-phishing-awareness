export interface UserAccount {
  id: string;
  name: string;
  contact: string; // Email or Phone Number
  contactType: 'email' | 'phone';
  password: string; // stored locally for client-side demo persistence
  createdAt: string;
  lastLoginAt?: string;
  totalScans: number;
  status: 'active' | 'suspended';
}

export interface LoginLogEntry {
  id: string;
  timestamp: string;
  contact: string;
  role: 'User' | 'Admin';
  status: 'Success' | 'Failed';
  ipAddress: string;
  details: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  lastPasswordChange?: string;
}
