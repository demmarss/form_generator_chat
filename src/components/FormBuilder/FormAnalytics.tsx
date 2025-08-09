import React, { useState, useEffect } from 'react';
import { Form, FormAnalytics as Analytics } from '../../types';
import { BarChart3, Users, Eye, Clock, Smartphone, Monitor, Tablet, TrendingUp, TrendingDown } from 'lucide-react';

interface FormAnalyticsProps {
  form: Form;
}

const FormAnalytics: React.FC<FormAnalyticsProps> = ({ form }) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [form.id, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data - replace with real API call
      const mockAnalytics: Analytics = {
        id: '1',
        formId: form.id,
        views: 1247,
        submissions: 342,
        completionRate: 27.4,
        averageTime: 185, // seconds
        dropoffPoints: {
          'page_1': 15,
          'page_2': 35,
          'page_3': 22
        },
        deviceStats: {
          mobile: 45,
          desktop: 40,
          tablet: 15
        },
        createdAt: new Date().toISOString()
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No analytics data available</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Form Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.views.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.submissions.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+8.3%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600">-2.1%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(analytics.averageTime)}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">-15s</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* Device Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analytics.deviceStats.desktop}%</p>
            <p className="text-sm text-gray-600">Desktop</p>
          </div>
          <div className="text-center">
            <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analytics.deviceStats.mobile}%</p>
            <p className="text-sm text-gray-600">Mobile</p>
          </div>
          <div className="text-center">
            <Tablet className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analytics.deviceStats.tablet}%</p>
            <p className="text-sm text-gray-600">Tablet</p>
          </div>
        </div>
      </div>

      {/* Drop-off Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Drop-off Analysis</h3>
        <div className="space-y-3">
          {Object.entries(analytics.dropoffPoints).map(([page, percentage]) => (
            <div key={page} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {page.replace('_', ' ')}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormAnalytics;