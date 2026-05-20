import { useState } from 'react';
import { 
  Server, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Wrench,
  MapPin,
  X,
  CheckCircle,
  AlertTriangle,
  WifiOff
} from 'lucide-react';
import { useAppStore } from '../store';
import { Device } from '../types';

export default function DeviceManagement() {
  const { devices } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const deviceTypes = [...new Set(devices.map(d => d.type))];

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fault': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fault': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'offline': return <WifiOff className="w-5 h-5 text-gray-400" />;
      default: return <Server className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '告警';
      case 'fault': return '故障';
      case 'offline': return '离线';
      default: return status;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">设备管理</h2>
          <p className="text-gray-500 mt-1">设备台账与全生命周期管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          添加设备
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索设备名称或位置..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">全部状态</option>
                <option value="normal">正常</option>
                <option value="warning">告警</option>
                <option value="fault">故障</option>
                <option value="offline">离线</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">全部类型</option>
                {deviceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            共 {filteredDevices.length} 条记录
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4">
          {filteredDevices.map((device) => (
            <div 
              key={device.id}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
              onClick={() => { setSelectedDevice(device); setShowDetail(true); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center`}>
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                {getStatusIcon(device.status)}
              </div>
              <h3 className="font-medium text-gray-800 mb-1 truncate">{device.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{device.type}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getHealthColor(device.healthScore)}`}>
                  健康度: {device.healthScore}%
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(device.status)}`}>
                  {getStatusLabel(device.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDetail && selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center`}>
                  <Server className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedDevice.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDevice.status)}`}>
                    {getStatusIcon(selectedDevice.status)}
                    {getStatusLabel(selectedDevice.status)}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">设备类型</label>
                  <p className="text-gray-800">{selectedDevice.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">位置</label>
                  <p className="text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedDevice.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">制造商</label>
                  <p className="text-gray-800">{selectedDevice.manufacturer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">型号</label>
                  <p className="text-gray-800">{selectedDevice.model}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    安装日期
                  </label>
                  <p className="text-gray-800">{selectedDevice.installDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">健康度</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${selectedDevice.healthScore >= 80 ? 'bg-green-500' : selectedDevice.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${selectedDevice.healthScore}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium ${getHealthColor(selectedDevice.healthScore)}`}>{selectedDevice.healthScore}%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">维护记录</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <Wrench className="w-4 h-4 inline mr-1" />
                      上次维护
                    </label>
                    <p className="text-gray-800">{selectedDevice.lastMaintenance}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">下次维护</label>
                    <p className="text-gray-800">{selectedDevice.nextMaintenance}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4" />
                  编辑
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Wrench className="w-4 h-4" />
                  创建维护工单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
