import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import FaultManagement from './pages/FaultManagement';
import DeviceManagement from './pages/DeviceManagement';
import PersonnelManagement from './pages/PersonnelManagement';
import SparePartsManagement from './pages/SparePartsManagement';
import AnalyticsPage from './pages/AnalyticsPage';
import KnowledgeBase from './pages/KnowledgeBase';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('/');

  const pageTitleMap: Record<string, { title: string; subtitle?: string }> = {
    '/': { title: '仪表盘', subtitle: '实时监控大屏' },
    '/faults': { title: '故障管理', subtitle: '设备故障检测与工单处理' },
    '/devices': { title: '设备管理', subtitle: '设备台账与全生命周期管理' },
    '/personnel': { title: '人员管理', subtitle: '员工档案与工作派工管理' },
    '/spare-parts': { title: '备件管理', subtitle: '备品备件库存与出入库管理' },
    '/analytics': { title: '数据分析', subtitle: '多维度数据分析与AI预测' },
    '/knowledge': { title: '运维知识库', subtitle: '运维经验与故障案例管理' },
    '/settings': { title: '系统设置', subtitle: '配置系统参数与偏好设置' },
  };

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />;
      case '/faults':
        return <FaultManagement />;
      case '/devices':
        return <DeviceManagement />;
      case '/personnel':
        return <PersonnelManagement />;
      case '/spare-parts':
        return <SparePartsManagement />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/knowledge':
        return <KnowledgeBase />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const { title, subtitle } = pageTitleMap[currentPage] || { title: '仪表盘' };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        <Header title={title} subtitle={subtitle} />
        <main className="min-h-[calc(100vh-4rem)]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
