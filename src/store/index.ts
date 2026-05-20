import { create } from 'zustand';
import { Device, Fault, WorkOrder, Personnel, SparePart, KnowledgeItem, AnalyticsData } from '../types';
import { devices as initialDevices, faults as initialFaults, workOrders as initialWorkOrders, personnel as initialPersonnel, spareParts as initialSpareParts, knowledgeItems as initialKnowledgeItems, analyticsData } from '../data/mockData';

interface AppStore {
  devices: Device[];
  faults: Fault[];
  workOrders: WorkOrder[];
  personnel: Personnel[];
  spareParts: SparePart[];
  knowledgeItems: KnowledgeItem[];
  analyticsData: AnalyticsData;
  currentPage: string;
  selectedDevice: Device | null;
  selectedFault: Fault | null;

  setCurrentPage: (page: string) => void;
  selectDevice: (device: Device | null) => void;
  selectFault: (fault: Fault | null) => void;
  updateDeviceStatus: (deviceId: string, status: Device['status']) => void;
  updateFaultStatus: (faultId: string, status: Fault['status']) => void;
  assignWorkOrder: (workOrderId: string, assigneeId: string) => void;
  updateWorkOrderStatus: (workOrderId: string, status: WorkOrder['status']) => void;
  addFault: (fault: Omit<Fault, 'id'>) => void;
  updateSparePartQuantity: (partId: string, quantity: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  devices: initialDevices,
  faults: initialFaults,
  workOrders: initialWorkOrders,
  personnel: initialPersonnel,
  spareParts: initialSpareParts,
  knowledgeItems: initialKnowledgeItems,
  analyticsData: analyticsData,
  currentPage: '/',
  selectedDevice: null,
  selectedFault: null,

  setCurrentPage: (page) => set({ currentPage: page }),
  selectDevice: (device) => set({ selectedDevice: device }),
  selectFault: (fault) => set({ selectedFault: fault }),

  updateDeviceStatus: (deviceId, status) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, status } : d
      ),
    })),

  updateFaultStatus: (faultId, status) =>
    set((state) => ({
      faults: state.faults.map((f) =>
        f.id === faultId ? { ...f, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined } : f
      ),
    })),

  assignWorkOrder: (workOrderId, assigneeId) => {
    const assignee = initialPersonnel.find((p) => p.id === assigneeId);
    set((state) => ({
      workOrders: state.workOrders.map((wo) =>
        wo.id === workOrderId ? { ...wo, assigneeId, assigneeName: assignee?.name || '' } : wo
      ),
    }));
  },

  updateWorkOrderStatus: (workOrderId, status) =>
    set((state) => ({
      workOrders: state.workOrders.map((wo) =>
        wo.id === workOrderId ? { ...wo, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined } : wo
      ),
    })),

  addFault: (fault) =>
    set((state) => ({
      faults: [...state.faults, { ...fault, id: `f${Date.now()}` }],
    })),

  updateSparePartQuantity: (partId, quantity) =>
    set((state) => ({
      spareParts: state.spareParts.map((sp) =>
        sp.id === partId ? { ...sp, quantity } : sp
      ),
    })),
}));
