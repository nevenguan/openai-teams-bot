import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Briefcase,
  CheckCircle,
  Clock,
  X,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '../store';
import { Personnel } from '../types';

export default function PersonnelManagement() {
  const { personnel, workOrders } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);

  const filteredPersonnel = personnel.filter((person) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || person.status === statusFilter;
    const matchesRole = roleFilter === 'all' || person.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'onLeave': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'supervisor': return '运维主管';
      case 'engineer': return '运维工程师';
      case 'analyst': return '数据分析员';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'engineer': return 'bg-green-100 text-green-800';
      case 'analyst': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '在线';
      case 'onLeave': return '休假';
      case 'offline': return '离线';
      default: return status;
    }
  };

  const getPersonWorkOrders = (personId: string) => {
    return workOrders.filter(wo => wo.assigneeId === personId);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">人员管理</h2>
          <p className="text-gray-500 mt-1">员工档案与工作派工管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          添加员工
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索员工姓名或部门..."
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
                <option value="active">在线</option>
                <option value="onLeave">休假</option>
                <option value="offline">离线</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">全部角色</option>
                <option value="admin">管理员</option>
                <option value="supervisor">运维主管</option>
                <option value="engineer">运维工程师</option>
                <option value="analyst">数据分析员</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            共 {filteredPersonnel.length} 条记录
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">员工姓名</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">角色</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">部门</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">联系电话</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">待处理任务</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">完成任务</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPersonnel.map((person) => {
                const completionRate = person.totalTasks > 0 
                  ? Math.round((person.completedTasks / (person.completedTasks + person.assignedTasks)) * 100) 
                  : 0;
                return (
                  <tr 
                    key={person.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => { setSelectedPerson(person); setShowDetail(true); }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{person.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(person.role)}`}>
                        {getRoleLabel(person.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{person.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{person.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(person.status)}`}>
                        {getStatusLabel(person.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-orange-600">{person.assignedTasks}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{person.completedTasks}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        派工
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPerson.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedPerson.role)}`}>
                    {getRoleLabel(selectedPerson.role)}
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">部门</label>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {selectedPerson.department}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">联系电话</label>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {selectedPerson.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">当前状态</label>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPerson.status)}`}>
                    {selectedPerson.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {getStatusLabel(selectedPerson.status)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">工作统计</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">待处理任务</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedPerson.assignedTasks}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">已完成任务</p>
                    <p className="text-2xl font-bold text-green-600">{selectedPerson.completedTasks}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">完成率</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(selectedPerson.completedTasks / (selectedPerson.completedTasks + selectedPerson.assignedTasks) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">进行中工单</h4>
                <div className="space-y-2">
                  {getPersonWorkOrders(selectedPerson.id).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{order.description}</p>
                        <p className="text-xs text-gray-500">创建时间: {order.createdAt}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' ? 'bg-red-100 text-red-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'pending' ? '待处理' : order.status === 'processing' ? '处理中' : '已完成'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  编辑信息
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ClipboardList className="w-4 h-4" />
                  创建工单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
