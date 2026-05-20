import { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  Calendar, 
  User,
  AlertTriangle,
  Wrench,
  FileText,
  ChevronRight,
  X
} from 'lucide-react';
import { useAppStore } from '../store';
import { knowledgeCategories } from '../data/mockData';

export default function KnowledgeBase() {
  const { knowledgeItems } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(knowledgeItems[0]);

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case '故障处理': return <AlertTriangle className="w-5 h-5" />;
      case '设备维护': return <Wrench className="w-5 h-5" />;
      case '操作指南': return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case '故障处理': return 'bg-red-100 text-red-600';
      case '设备维护': return 'bg-green-100 text-green-600';
      case '操作指南': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">运维知识库</h2>
          <p className="text-gray-500 mt-1">运维经验与故障案例管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          发布文档
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">分类导航</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>全部文档</span>
                </button>
              </li>
              {knowledgeCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {getCategoryIcon(category.name)}
                    <span>{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索文档标题或内容..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-4 space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => { setSelectedItem(item); setShowDetail(true); }}
                >
                  <div className={`w-12 h-12 rounded-lg ${getCategoryColor(item.categoryName)} flex items-center justify-center flex-shrink-0`}>
                    {getCategoryIcon(item.categoryName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(item.categoryName)}`}>
                        {item.categoryName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mb-2">{item.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.viewCount}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(selectedItem.categoryName)}`}>
                    {selectedItem.categoryName}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedItem.title}</h3>
              </div>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedItem.authorName}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedItem.createdAt}
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  浏览次数: {selectedItem.viewCount}
                </span>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedItem.content}</p>
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">相关文档</h4>
                  <ul className="space-y-2">
                    {knowledgeItems.filter(item => item.categoryId === selectedItem.categoryId && item.id !== selectedItem.id).map(item => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
