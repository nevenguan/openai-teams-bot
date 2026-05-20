export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'normal' | 'warning' | 'fault' | 'offline';
  installDate: string;
  manufacturer: string;
  model: string;
  lastMaintenance: string;
  nextMaintenance: string;
  healthScore: number;
}

export interface Fault {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  detectedAt: string;
  resolvedAt?: string;
  assignee?: string;
  location: string;
}

export interface WorkOrder {
  id: string;
  faultId: string;
  assigneeId: string;
  assigneeName: string;
  status: 'pending' | 'accepted' | 'processing' | 'completed' | 'reviewing';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  createdAt: string;
  completedAt?: string;
  description: string;
}

export interface Personnel {
  id: string;
  name: string;
  role: 'admin' | 'supervisor' | 'engineer' | 'analyst';
  department: string;
  phone: string;
  status: 'active' | 'onLeave' | 'offline';
  assignedTasks: number;
  completedTasks: number;
  totalTasks: number;
}

export interface SparePart {
  id: string;
  name: string;
  code: string;
  quantity: number;
  minStock: number;
  location: string;
  unit: string;
  category: string;
  lastStockIn: string;
  lastStockOut: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  icon?: string;
}

export interface AnalyticsData {
  labels: string[];
  faultCounts: number[];
  deviceHealth: { name: string; value: number }[];
  workEfficiency: { name: string; completed: number; total: number }[];
  monthlyData: { month: string; faults: number; resolved: number }[];
}

export type RoleType = 'admin' | 'supervisor' | 'engineer' | 'analyst';
