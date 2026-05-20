import { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  X,
  User,
  Clock,
  MapPin
} from 'lucide-react';
import { useAppStore } from '../store';

export default function FaultManagement() {
  const { faults, updateFaultStatus, personnel } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedFault, setSelectedFault] = useState(faults[0]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const filteredFaults = faults.filter((fault) => {
    const matchesSearch = fault.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fault.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fault.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || fault.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'critical': return '严重';
      case 'high': return '高';
      case 'medium': return '中';
      default: return '低';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'resolved': return '已解决';
      case 'closed': return '已关闭';
      default: return status;
    }
  };

  const handleStatusChange = (faultId: string, newStatus: string) => {
    updateFaultStatus(faultId, newStatus as any);
    if (selectedFault?.id === faultId) {
      setSelectedFault({ ...selectedFault, status: newStatus as any });
    }
  };

  const handleAssign = () => {
    if (selectedFault && selectedAssignee) {
      const faultIndex = faults.findIndex(f => f.id === selectedFault.id);
      if (faultIndex !== -1) {
        const assigneeName = personnel.find(p => p.id === selectedAssignee)?.name;
        const updatedFaults = [...faults];
        updatedFaults[faultIndex] = { ...updatedFaults[faultIndex], assignee: assigneeName, status: 'processing' };
        updateFaultStatus(selectedFault.id, 'processing');
        setSelectedFault({ ...selectedFault, assignee: assigneeName, status: 'processing' });
      }
      setShowAssignModal(false);
      setSelectedAssignee('');
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">故障管理</h2>
          <p className="text-gray-500 mt-1">设备故障检测与工单处理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          上报故障
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索设备名称或故障描述..."
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
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已解决</option>
              </select>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">全部级别</option>
                <option value="critical">严重</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            共 {filteredFaults.length} 条记录
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">设备名称</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">故障类型</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">级别</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">位置</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">处理人</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">检测时间</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFaults.map((fault) => (
                <tr 
                  key={fault.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => { setSelectedFault(fault); setShowDetail(true); }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">{fault.deviceName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fault.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getLevelColor(fault.level)}`}></span>
                      <span className="text-sm font-medium text-gray-700">{getLevelLabel(fault.level)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{fault.location}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fault.status)}`}>
                      {getStatusLabel(fault.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fault.assignee || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{fault.detectedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedFault(fault); setShowDetail(true); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedFault && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getLevelColor(selectedFault.level)}`}></div>
                <h3 className="text-xl font-semibold text-gray-800">故障详情</h3>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">设备名称</label>
                  <p className="text-gray-800 font-medium">{selectedFault.deviceName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">故障类型</label>
                  <p className="text-gray-800">{selectedFault.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">故障级别</label>
                  <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${
                    selectedFault.level === 'critical' ? 'bg-red-100 text-red-800' :
                    selectedFault.level === 'high' ? 'bg-orange-100 text-orange-800' :
                    selectedFault.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${getLevelColor(selectedFault.level)}`}></span>
                    {getLevelLabel(selectedFault.level)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">当前状态</label>
                  <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedFault.status)}`}>
                    {getStatusLabel(selectedFault.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    位置
                  </label>
                  <p className="text-gray-800">{selectedFault.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    检测时间
                  </label>
                  <p className="text-gray-800">{selectedFault.detectedAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    处理人
                  </label>
                  <p className="text-gray-800">{selectedFault.assignee || '未分配'}</p>
                </div>
                {selectedFault.resolvedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">解决时间</label>
                    <p className="text-gray-800">{selectedFault.resolvedAt}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">故障描述</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{selectedFault.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">状态变更</label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedFault.status}
                    onChange={(e) => handleStatusChange(selectedFault.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="resolved">已解决</option>
                    <option value="closed">已关闭</option>
                  </select>
                  {selectedFault.status === 'pending' && (
                    <button 
                      onClick={() => setShowAssignModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <User className="w-4 h-4" />
                      分配处理人
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">分配处理人</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">选择处理人</label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择</option>
                  {personnel.filter(p => p.status === 'active').map((person) => (
                    <option key={person.id} value={person.id}>{person.name} - {person.department}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleAssign}
                  disabled={!selectedAssignee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认分配
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
