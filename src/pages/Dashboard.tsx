import { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Server, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../store';

export default function Dashboard() {
  const { devices, faults, workOrders, analyticsData } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDevices = devices.length;
  const normalDevices = devices.filter(d => d.status === 'normal').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const faultDevices = devices.filter(d => d.status === 'fault' || d.status === 'offline').length;
  const pendingFaults = faults.filter(f => f.status === 'pending').length;
  const processingFaults = faults.filter(f => f.status === 'processing').length;
  const resolvedFaults = faults.filter(f => f.status === 'resolved').length;
  const pendingOrders = workOrders.filter(wo => wo.status === 'pending').length;

  const statusCards = [
    {
      title: '设备总数',
      value: totalDevices,
      icon: Server,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      trend: '+2',
      trendUp: true,
    },
    {
      title: '正常运行',
      value: normalDevices,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      trend: `${((normalDevices / totalDevices) * 100).toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: '待处理故障',
      value: pendingFaults,
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      trend: '+3',
      trendUp: false,
    },
    {
      title: '进行中工单',
      value: processingFaults + pendingOrders,
      icon: Activity,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      trend: '+1',
      trendUp: true,
    },
  ];

  const faultLevelDistribution = {
    critical: faults.filter(f => f.level === 'critical').length,
    high: faults.filter(f => f.level === 'high').length,
    medium: faults.filter(f => f.level === 'medium').length,
    low: faults.filter(f => f.level === 'low').length,
  };

  const faultOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: analyticsData.labels,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#6b7280', fontSize: 11 },
    },
    series: [
      {
        name: '故障数量',
        type: 'bar',
        data: analyticsData.faultCounts,
        barWidth: '50%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#60a5fa' },
            ],
          },
        },
      },
    ],
  };

  const healthOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
    },
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#ef4444'],
              [0.7, '#f59e0b'],
              [1, '#10b981'],
            ],
          },
        },
        pointer: { itemStyle: { color: '#1e40af' } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#1f2937',
          fontSize: 24,
          fontWeight: 'bold',
        },
        data: [{ value: Math.round(analyticsData.deviceHealth.reduce((sum, d) => sum + d.value, 0) / analyticsData.deviceHealth.length), name: '平均健康度' }],
      },
    ],
  };

  const pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#6b7280', fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
        labelLine: { show: false },
        data: [
          { value: faultLevelDistribution.critical, name: '严重', itemStyle: { color: '#ef4444' } },
          { value: faultLevelDistribution.high, name: '高', itemStyle: { color: '#f97316' } },
          { value: faultLevelDistribution.medium, name: '中', itemStyle: { color: '#f59e0b' } },
          { value: faultLevelDistribution.low, name: '低', itemStyle: { color: '#84cc16' } },
        ],
      },
    ],
  };

  const recentFaults = faults.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
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

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">实时监控大屏</h2>
          <p className="text-gray-500 mt-1">设备状态概览与故障预警</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg">{currentTime.toLocaleString('zh-CN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.borderColor} border rounded-xl p-5 transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              {card.trendUp ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={card.trendUp ? 'text-green-600' : 'text-red-600'}>
                {card.trend}
              </span>
              <span className="text-gray-400 ml-1">较昨日</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">月度故障趋势</h3>
            <div className="flex items-center gap-4">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">本月</button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">季度</button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">年度</button>
            </div>
          </div>
          <div className="h-64">
            <ReactECharts option={faultOption} style={{ height: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">设备平均健康度</h3>
          <div className="h-64 flex items-center justify-center">
            <ReactECharts option={healthOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">故障级别分布</h3>
          <div className="h-56">
            <ReactECharts option={pieOption} style={{ height: '100%' }} />
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">最新故障告警</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">查看全部</button>
          </div>
          <div className="space-y-3">
            {recentFaults.map((fault) => (
              <div
                key={fault.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`w-3 h-3 rounded-full ${getLevelColor(fault.level)}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{fault.deviceName}</p>
                  <p className="text-sm text-gray-500 truncate">{fault.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fault.status)}`}>
                  {fault.status === 'pending' ? '待处理' : fault.status === 'processing' ? '处理中' : '已解决'}
                </span>
                <span className="text-sm text-gray-400 whitespace-nowrap">{fault.detectedAt.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
