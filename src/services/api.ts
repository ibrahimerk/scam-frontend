import axios from 'axios';
import { User } from '@/types';

const API_URL = "https://scam-project.onrender.com/api/token/";

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor - her istekte token'ı ekle
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data for scam reports
export interface ScamReport {
  id: string;
  title: string;
  description: string;
  scamType: string;
  scamUrl?: string;
  amount?: number;
  reportedBy: {
    id: string;
    name: string;
  };
  dateReported: string;
  status: 'pending' | 'verified' | 'rejected';
  evidence: {
    type: string;
    url: string;
    name: string;
  }[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    date: string;
  }[];
  votes: {
    up: number;
    down: number;
  };
  location?: string;
  ipAddress?: string;
  verificationScore?: number;
}

// Mock data for reports
const mockReports: ScamReport[] = [
  {
    id: '1',
    title: 'Fake Amazon Gift Card Email',
    description: 'I received an email claiming to be from Amazon offering a free $500 gift card. The link led to a phishing site requesting personal and credit card information.',
    scamType: 'Phishing',
    scamUrl: 'http://fake-amazon-gifts.scam/claim',
    amount: 500,
    reportedBy: {
      id: '2',
      name: 'John Doe'
    },
    dateReported: '2025-04-08',
    status: 'verified',
    evidence: [
      {
        type: 'image',
        url: 'https://placehold.co/600x400?text=Phishing+Email+Screenshot',
        name: 'email-screenshot.jpg'
      },
      {
        type: 'pdf',
        url: 'https://example.com/document.pdf',
        name: 'analysis.pdf'
      }
    ],
    comments: [
      {
        id: '101',
        userId: '3',
        userName: 'Jane Smith',
        text: 'I received the same email yesterday. Thanks for reporting it!',
        date: '2025-04-09'
      }
    ],
    votes: {
      up: 24,
      down: 2
    },
    location: 'New York, USA',
    ipAddress: '192.168.1.1',
    verificationScore: 92
  },
  {
    id: '2',
    title: 'Bitcoin Investment Scam',
    description: 'A website claiming guaranteed 300% returns on Bitcoin investments. They took my initial investment and disappeared.',
    scamType: 'Investment Fraud',
    scamUrl: 'http://bitcoin-instant-returns.scam',
    amount: 2500,
    reportedBy: {
      id: '3',
      name: 'Jane Smith'
    },
    dateReported: '2025-04-05',
    status: 'verified',
    evidence: [
      {
        type: 'image',
        url: 'https://placehold.co/600x400?text=Bitcoin+Scam+Website',
        name: 'website-screenshot.jpg'
      }
    ],
    comments: [
      {
        id: '102',
        userId: '4',
        userName: 'Bob Johnson',
        text: 'They got me too. Lost $1000 last month.',
        date: '2025-04-06'
      }
    ],
    votes: {
      up: 45,
      down: 1
    },
    location: 'London, UK',
    ipAddress: '192.168.2.2',
    verificationScore: 88
  },
  {
    id: '3',
    title: 'Fake Tech Support Call',
    description: 'Received a call claiming to be Microsoft support saying my computer had a virus. They tried to get me to install remote access software.',
    scamType: 'Tech Support Scam',
    reportedBy: {
      id: '4',
      name: 'Bob Johnson'
    },
    dateReported: '2025-04-10',
    status: 'pending',
    evidence: [
      {
        type: 'audio',
        url: 'https://example.com/audio.mp3',
        name: 'phone-call-recording.mp3'
      }
    ],
    comments: [],
    votes: {
      up: 7,
      down: 0
    },
    location: 'Toronto, Canada',
    ipAddress: '192.168.3.3',
    verificationScore: 65
  }
];

// Delay helper for simulating API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Report {
  id?: number;
  title: string;
  description: string;
  scam_type: string;
  location: string;
  date_reported?: string;
  is_verified: boolean;
  evidence?: string;
  contact_info?: string;
  user?: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<LoginResponse> => {
      const response = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      });
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data;
    },

    register: async (userData: {
      username: string;
      email: string;
      password: string;
      password2: string;
      first_name?: string;
      last_name?: string;
    }): Promise<User> => {
      const response = await axios.post(`${API_URL}/register/`, userData);
      return response.data;
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    },

    getCurrentUser: async (): Promise<User> => {
      const response = await axiosInstance.get(`${API_URL}/user/`);
      return response.data;
    },
  },

  // Raporlar API'si
  getReports: async (): Promise<Report[]> => {
    const response = await axiosInstance.get(`${API_URL}/reports/`);
    return response.data;
  },

  getReport: async (id: number): Promise<Report> => {
    const response = await axiosInstance.get(`${API_URL}/reports/${id}/`);
    return response.data;
  },

  createReport: async (reportData: Omit<Report, 'id' | 'date_reported' | 'user'>): Promise<Report> => {
    const response = await axiosInstance.post(`${API_URL}/reports/`, reportData);
    return response.data;
  },

  updateReport: async (id: number, reportData: Partial<Report>): Promise<Report> => {
    const response = await axiosInstance.put(`${API_URL}/reports/${id}/`, reportData);
    return response.data;
  },

  deleteReport: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/reports/${id}/`);
  },

  // Scam reports methods
  reports: {
    getAll: async (): Promise<ScamReport[]> => {
      await delay(800);
      return [...mockReports];
    },
    
    getById: async (id: string): Promise<ScamReport> => {
      await delay(600);
      const report = mockReports.find(r => r.id === id);
      if (!report) {
        throw new Error('Report not found');
      }
      return { ...report };
    },
    
    create: async (report: Omit<ScamReport, 'id' | 'dateReported' | 'status' | 'comments' | 'votes' | 'verificationScore'>): Promise<ScamReport> => {
      await delay(1000);
      
      const newReport: ScamReport = {
        ...report,
        id: Math.random().toString(36).substr(2, 9),
        dateReported: new Date().toISOString().split('T')[0],
        status: 'pending',
        comments: [],
        votes: { up: 0, down: 0 },
        verificationScore: Math.floor(Math.random() * 40) + 30 // Random initial score between 30-70
      };
      
      // In a real application, this would be saved to a database
      mockReports.push(newReport);
      return newReport;
    },
    
    addComment: async (reportId: string, userId: string, userName: string, text: string): Promise<{ id: string; userId: string; userName: string; text: string; date: string }> => {
      await delay(500);
      
      const report = mockReports.find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        userName,
        text,
        date: new Date().toISOString().split('T')[0]
      };
      
      report.comments.push(newComment);
      return newComment;
    },
    
    vote: async (reportId: string, voteType: 'up' | 'down'): Promise<{ up: number; down: number }> => {
      await delay(300);
      
      const report = mockReports.find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      
      if (voteType === 'up') {
        report.votes.up += 1;
      } else {
        report.votes.down += 1;
      }
      
      return { ...report.votes };
    },
    
    updateStatus: async (reportId: string, status: 'pending' | 'verified' | 'rejected'): Promise<ScamReport> => {
      await delay(700);
      
      const report = mockReports.find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      
      report.status = status;
      
      if (status === 'verified') {
        // Boost verification score for verified reports
        report.verificationScore = Math.min(100, (report.verificationScore || 0) + 30);
      } else if (status === 'rejected') {
        // Lower verification score for rejected reports
        report.verificationScore = Math.max(0, (report.verificationScore || 0) - 30);
      }
      
      return { ...report };
    }
  }
};
