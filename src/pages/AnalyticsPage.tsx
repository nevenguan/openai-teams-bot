import { useState } from 'react';
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../store';

export default function AnalyticsPage() {
  const { analyticsData, faults, workOrders } = useAppStore();
  const [timeRange, setTimeRange] = useState('month');

  const resolvedCount = faults.filter(f => f.status === 'resolved').length;
  const pendingCount = faults.filter(f => f.status === 'pending').length;
  const totalWorkOrders = workOrders.length;
  const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length;

  const trendOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#374151' },
    },
    legend: {
      data: ['故障数', '已解决'],
      bottom: 0,
      textStyle: { color: '#6b7280', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: analyticsData.monthlyData.map(d => d.month),
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
        name: '故障数',
        type: 'line',
        smooth: true,
        data: analyticsData.monthlyData.map(d => d.faults),
        lineStyle: { width: 3, color: '#ef4444' },
        itemStyle: { color: '#ef4444' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0.05)' },
            ],
          },
        },
      },
      {
        name: '已解决',
        type: 'line',
        smooth: true,
        data: analyticsData.monthlyData.map(d => d.resolved),
        lineStyle: { width: 3, color: '#10b981' },
        itemStyle: { color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
            ],
          },
        },
      },
    ],
  };

  const healthOption = {
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
      type: 'value',
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#6b7280', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: analyticsData.deviceHealth.map(d => d.name),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#374151', fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        data: analyticsData.deviceHealth.map(d => ({
          value: d.value,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: d.value >= 80 ? '#10b981' : d.value >= 60 ? '#f59e0b' : '#ef4444',
          },
        })),
        barWidth: '50%',
      },
    ],
  };

  const efficiencyOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['已完成', '未完成'],
      bottom: 0,
      textStyle: { color: '#6b7280', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: analyticsData.workEfficiency.map(d => d.name),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#374151', fontSize: 12 },
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
        name: '已完成',
        type: 'bar',
        stack: 'total',
        data: analyticsData.workEfficiency.map(d => d.completed),
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
      },
      {
        name: '未完成',
        type: 'bar',
        stack: 'total',
        data: analyticsData.workEfficiency.map(d => d.total - d.completed),
        itemStyle: { color: '#e5e7eb', borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  const statsCards = [
    {
      title: '本月故障数',
      value: analyticsData.faultCounts[11],
      change: '+12%',
      changeUp: false,
      icon: Activity,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: '故障解决率',
      value: `${Math.round((resolvedCount / (resolvedCount + pendingCount)) * 100)}%`,
      change: '+5%',
      changeUp: true,
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: '工单完成率',
      value: `${Math.round((completedWorkOrders / totalWorkOrders) * 100)}%`,
      change: '+3%',
      changeUp: true,
      icon: BarChart3,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: '待处理工单',
      value: totalWorkOrders - completedWorkOrders,
      change: '-2',
      changeUp: true,
      icon: PieChart,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">数据分析</h2>
          <p className="text-gray-500 mt-1">多维度数据分析与AI预测</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年度</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-5 border border-gray-100`}
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
            <div className={`mt-4 flex items-center gap-1 text-sm ${card.changeUp ? 'text-green-600' : 'text-red-600'}`}>
              {card.changeUp ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4 rotate-180" />
              )}
              <span>{card.change}</span>
              <span className="text-gray-400 ml-1">较上期</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">故障趋势分析</h3>
          <div className="h-72">
            <ReactECharts option={trendOption} style={{ height: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">设备健康度排行</h3>
          <div className="h-72">
            <ReactECharts option={healthOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">人员工作效率</h3>
        <div className="h-72">
          <ReactECharts option={efficiencyOption} style={{ height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
