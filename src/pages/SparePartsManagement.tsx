import { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle,
  Inbox,
  Archive,
  MapPin,
  X
} from 'lucide-react';
import { useAppStore } from '../store';
import { SparePart } from '../types';

export default function SparePartsManagement() {
  const { spareParts, updateSparePartQuantity } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);
  const [stockType, setStockType] = useState<'in' | 'out'>('in');
  const [stockQuantity, setStockQuantity] = useState(1);

  const categories = [...new Set(spareParts.map(sp => sp.category))];

  const filteredParts = spareParts.filter((part) => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const isLowStock = (part: SparePart) => part.quantity <= part.minStock;

  const handleStockOperation = () => {
    if (selectedPart) {
      const newQuantity = stockType === 'in' 
        ? selectedPart.quantity + stockQuantity 
        : Math.max(0, selectedPart.quantity - stockQuantity);
      updateSparePartQuantity(selectedPart.id, newQuantity);
      setSelectedPart({ ...selectedPart, quantity: newQuantity });
      setShowStockModal(false);
      setStockQuantity(1);
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">备件管理</h2>
          <p className="text-gray-500 mt-1">备品备件库存与出入库管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          添加备件
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索备件名称或编码..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">全部分类</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            共 {filteredParts.length} 条记录
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4">
          {filteredParts.map((part) => (
            <div 
              key={part.id}
              className={`rounded-xl p-4 border transition-colors cursor-pointer ${
                isLowStock(part) 
                  ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              }`}
              onClick={() => { setSelectedPart(part); setShowDetail(true); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isLowStock(part) ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Package className={`w-5 h-5 ${isLowStock(part) ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                {isLowStock(part) && (
                  <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                )}
              </div>
              <h3 className="font-medium text-gray-800 mb-1 truncate">{part.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{part.code}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-lg font-bold ${isLowStock(part) ? 'text-red-600' : 'text-gray-800'}`}>
                    {part.quantity}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{part.unit}</span>
                </div>
                <span className="text-xs text-gray-400">最低库存: {part.minStock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDetail && selectedPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isLowStock(selectedPart) ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Package className={`w-5 h-5 ${isLowStock(selectedPart) ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPart.name}</h3>
                  <p className="text-sm text-gray-500">{selectedPart.code}</p>
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">分类</label>
                  <p className="text-gray-800">{selectedPart.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">单位</label>
                  <p className="text-gray-800">{selectedPart.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">当前库存</label>
                  <p className={`text-2xl font-bold ${isLowStock(selectedPart) ? 'text-red-600' : 'text-gray-800'}`}>
                    {selectedPart.quantity} {selectedPart.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">最低库存</label>
                  <p className="text-gray-800">{selectedPart.minStock} {selectedPart.unit}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    存放位置
                  </label>
                  <p className="text-gray-800">{selectedPart.location}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">库存记录</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <Inbox className="w-4 h-4 inline mr-1" />
                      上次入库
                    </label>
                    <p className="text-gray-800">{selectedPart.lastStockIn}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <Archive className="w-4 h-4 inline mr-1" />
                      上次出库
                    </label>
                    <p className="text-gray-800">{selectedPart.lastStockOut}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  onClick={() => { setStockType('in'); setShowStockModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Inbox className="w-4 h-4" />
                  入库
                </button>
                <button 
                  onClick={() => { setStockType('out'); setShowStockModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  出库
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStockModal && selectedPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                {stockType === 'in' ? '入库操作' : '出库操作'}
              </h3>
              <button onClick={() => setShowStockModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">备件名称</label>
                <p className="text-gray-800 font-medium">{selectedPart.name}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">当前库存</label>
                <p className="text-gray-800">{selectedPart.quantity} {selectedPart.unit}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  {stockType === 'in' ? '入库数量' : '出库数量'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={stockType === 'out' ? selectedPart.quantity : 999}
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowStockModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleStockOperation}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    stockType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  确认{stockType === 'in' ? '入库' : '出库'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
