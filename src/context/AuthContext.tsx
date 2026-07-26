import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, LoginLogEntry, AdminCredentials } from '../types/auth';

interface AuthContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  loginLogs: LoginLogEntry[];
  isAdminLoggedIn: boolean;
  adminCredentials: AdminCredentials;
  registerUser: (name: string, contact: string, password: string) => { success: boolean; message: string };
  loginUser: (contact: string, password: string) => { success: boolean; message: string };
  loginAdmin: (email: string, password: string) => { success: boolean; message: string };
  changeAdminPassword: (newPassword: string) => { success: boolean; message: string };
  forgotPasswordReset: (contact: string, newPassword: string) => { success: boolean; message: string };
  logoutUser: () => void;
  logoutAdmin: () => void;
  toggleUserStatus: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
}

const DEFAULT_ADMIN: AdminCredentials = {
  email: 'vaishnavithakur7668565807@gmail.com',
  password: 'Admin@123',
  lastPasswordChange: new Date().toISOString(),
};

const SEED_USERS: UserAccount[] = [
  {
    id: 'user-001',
    name: 'Alex Smith',
    contact: 'alex.smith@company.com',
    contactType: 'email',
    password: 'User@1234',
    createdAt: '2026-07-20 10:15:00',
    lastLoginAt: '2026-07-25 18:30:00',
    totalScans: 14,
    status: 'active',
  },
  {
    id: 'user-002',
    name: 'Priya Sharma',
    contact: '+919876543210',
    contactType: 'phone',
    password: 'Priya@321',
    createdAt: '2026-07-22 14:20:00',
    lastLoginAt: '2026-07-25 12:45:00',
    totalScans: 8,
    status: 'active',
  },
  {
    id: 'user-003',
    name: 'David Miller',
    contact: 'david.m@cybersec.org',
    contactType: 'email',
    password: 'Password@1',
    createdAt: '2026-07-23 09:10:00',
    lastLoginAt: '2026-07-24 16:00:00',
    totalScans: 22,
    status: 'active',
  },
  {
    id: 'user-004',
    name: 'Rahul Verma',
    contact: '+919812345678',
    contactType: 'phone',
    password: 'Rahul@987',
    createdAt: '2026-07-24 11:05:00',
    lastLoginAt: '2026-07-25 08:12:00',
    totalScans: 3,
    status: 'active',
  }
];

const SEED_LOGS: LoginLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-07-25 18:30:12',
    contact: 'alex.smith@company.com',
    role: 'User',
    status: 'Success',
    ipAddress: '192.168.1.45',
    details: 'User standard portal authentication',
  },
  {
    id: 'log-002',
    timestamp: '2026-07-25 17:10:05',
    contact: 'vaishnavithakur7668565807@gmail.com',
    role: 'Admin',
    status: 'Success',
    ipAddress: '10.0.0.1',
    details: 'Admin Dashboard session granted',
  },
  {
    id: 'log-003',
    timestamp: '2026-07-25 15:22:40',
    contact: 'unknown@hacker.xyz',
    role: 'User',
    status: 'Failed',
    ipAddress: '185.220.101.5',
    details: 'Invalid password attempt',
  },
  {
    id: 'log-004',
    timestamp: '2026-07-25 12:45:19',
    contact: '+919876543210',
    role: 'User',
    status: 'Success',
    ipAddress: '103.21.124.9',
    details: 'Mobile phone OTP login verified',
  },
  {
    id: 'log-005',
    timestamp: '2026-07-24 16:00:00',
    contact: 'david.m@cybersec.org',
    role: 'User',
    status: 'Success',
    ipAddress: '172.16.2.88',
    details: 'Email login completed',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('phishguard_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('phishguard_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem('phishguard_admin_creds');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('phishguard_admin_logged');
    return saved === 'true';
  });

  const [loginLogs, setLoginLogs] = useState<LoginLogEntry[]>(() => {
    const saved = localStorage.getItem('phishguard_login_logs');
    return saved ? JSON.parse(saved) : SEED_LOGS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('phishguard_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('phishguard_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('phishguard_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('phishguard_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('phishguard_admin_logged', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('phishguard_login_logs', JSON.stringify(loginLogs));
  }, [loginLogs]);

  // Format timestamp helper
  const nowFormatted = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  const registerUser = (name: string, contact: string, password: string) => {
    const cleanContact = contact.trim().toLowerCase();
    const isPhone = /^[+\d\s-]{7,15}$/.test(cleanContact) && !cleanContact.includes('@');
    const contactType: 'email' | 'phone' = isPhone ? 'phone' : 'email';

    // Check if account exists
    const exists = users.some(u => u.contact.toLowerCase() === cleanContact);
    if (exists) {
      return { success: false, message: 'An account with this email or phone number already exists!' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      contact: cleanContact,
      contactType,
      password,
      createdAt: nowFormatted(),
      lastLoginAt: nowFormatted(),
      totalScans: 0,
      status: 'active',
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    // Log registration login
    const newLog: LoginLogEntry = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: nowFormatted(),
      contact: cleanContact,
      role: 'User',
      status: 'Success',
      ipAddress: '127.0.0.1',
      details: 'Account created & session started',
    };
    setLoginLogs([newLog, ...loginLogs]);

    return { success: true, message: 'Account created successfully!' };
  };

  const loginUser = (contact: string, password: string) => {
    const cleanContact = contact.trim().toLowerCase();
    const user = users.find(u => u.contact.toLowerCase() === cleanContact);

    if (!user) {
      const failLog: LoginLogEntry = {
        id: `log-${Date.now().toString().slice(-6)}`,
        timestamp: nowFormatted(),
        contact: cleanContact,
        role: 'User',
        status: 'Failed',
        ipAddress: '127.0.0.1',
        details: 'User account not found',
      };
      setLoginLogs([failLog, ...loginLogs]);
      return { success: false, message: 'Account not found. Please create an account first!' };
    }

    if (user.status === 'suspended') {
      const failLog: LoginLogEntry = {
        id: `log-${Date.now().toString().slice(-6)}`,
        timestamp: nowFormatted(),
        contact: cleanContact,
        role: 'User',
        status: 'Failed',
        ipAddress: '127.0.0.1',
        details: 'Suspended account login attempt',
      };
      setLoginLogs([failLog, ...loginLogs]);
      return { success: false, message: 'Your account has been suspended by the administrator.' };
    }

    if (user.password !== password) {
      const failLog: LoginLogEntry = {
        id: `log-${Date.now().toString().slice(-6)}`,
        timestamp: nowFormatted(),
        contact: cleanContact,
        role: 'User',
        status: 'Failed',
        ipAddress: '127.0.0.1',
        details: 'Incorrect password entered',
      };
      setLoginLogs([failLog, ...loginLogs]);
      return { success: false, message: 'Incorrect password. Please try again or use Forgot Password.' };
    }

    // Success login
    const updatedUser = { ...user, lastLoginAt: nowFormatted() };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);

    const successLog: LoginLogEntry = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: nowFormatted(),
      contact: cleanContact,
      role: 'User',
      status: 'Success',
      ipAddress: '127.0.0.1',
      details: 'User login authenticated',
    };
    setLoginLogs([successLog, ...loginLogs]);

    return { success: true, message: 'Login successful!' };
  };

  const loginAdmin = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check against admin credentials OR email match
    if (cleanEmail === adminCredentials.email.toLowerCase() || cleanEmail === 'admin@phishguard.com') {
      if (password === adminCredentials.password) {
        setIsAdminLoggedIn(true);

        const successLog: LoginLogEntry = {
          id: `log-${Date.now().toString().slice(-6)}`,
          timestamp: nowFormatted(),
          contact: cleanEmail,
          role: 'Admin',
          status: 'Success',
          ipAddress: '127.0.0.1',
          details: 'Admin authentication granted',
        };
        setLoginLogs([successLog, ...loginLogs]);

        return { success: true, message: 'Admin authentication successful!' };
      }
    }

    const failLog: LoginLogEntry = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: nowFormatted(),
      contact: cleanEmail,
      role: 'Admin',
      status: 'Failed',
      ipAddress: '127.0.0.1',
      details: 'Invalid admin credentials',
    };
    setLoginLogs([failLog, ...loginLogs]);

    return { success: false, message: 'Invalid Admin Email or Password.' };
  };

  const changeAdminPassword = (newPassword: string) => {
    const updated = {
      ...adminCredentials,
      password: newPassword,
      lastPasswordChange: nowFormatted(),
    };
    setAdminCredentials(updated);

    const log: LoginLogEntry = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: nowFormatted(),
      contact: adminCredentials.email,
      role: 'Admin',
      status: 'Success',
      ipAddress: '127.0.0.1',
      details: 'Admin password updated',
    };
    setLoginLogs([log, ...loginLogs]);

    return { success: true, message: 'Admin password updated successfully! Use new password for future logins.' };
  };

  const forgotPasswordReset = (contact: string, newPassword: string) => {
    const cleanContact = contact.trim().toLowerCase();
    const userIndex = users.findIndex(u => u.contact.toLowerCase() === cleanContact);

    if (userIndex === -1) {
      return { success: false, message: 'No registered user found with that email or phone number.' };
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex].password = newPassword;
    setUsers(updatedUsers);

    if (currentUser?.contact.toLowerCase() === cleanContact) {
      setCurrentUser(updatedUsers[userIndex]);
    }

    const log: LoginLogEntry = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: nowFormatted(),
      contact: cleanContact,
      role: 'User',
      status: 'Success',
      ipAddress: '127.0.0.1',
      details: 'Password reset completed via Forgot Password',
    };
    setLoginLogs([log, ...loginLogs]);

    return { success: true, message: 'Password reset successfully! You can now log in with your new password.' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const deleteUserAccount = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      loginLogs,
      isAdminLoggedIn,
      adminCredentials,
      registerUser,
      loginUser,
      loginAdmin,
      changeAdminPassword,
      forgotPasswordReset,
      logoutUser,
      logoutAdmin,
      toggleUserStatus,
      deleteUserAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
