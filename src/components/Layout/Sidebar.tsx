import { 
  LayoutDashboard, 
  AlertTriangle, 
  Server, 
  Users, 
  Package, 
  BarChart3, 
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: '/', icon: LayoutDashboard, label: '仪表盘' },
  { id: '/faults', icon: AlertTriangle, label: '故障管理' },
  { id: '/devices', icon: Server, label: '设备管理' },
  { id: '/personnel', icon: Users, label: '人员管理' },
  { id: '/spare-parts', icon: Package, label: '备件管理' },
  { id: '/analytics', icon: BarChart3, label: '数据分析' },
  { id: '/knowledge', icon: BookOpen, label: '知识库' },
];

export default function Sidebar({ collapsed, onToggle, currentPage, onPageChange }: SidebarProps) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-slate-800 text-white transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        {!collapsed && (
          <div className="text-lg font-bold text-blue-400">高速运维平台</div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700 p-2">
        <button
          onClick={() => onPageChange('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            currentPage === '/settings'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">系统设置</span>}
        </button>
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-slate-700 hover:bg-slate-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
