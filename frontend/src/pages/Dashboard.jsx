import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { format } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [projectCompletion, setProjectCompletion] = useState(null);
  const [budgetVsActual, setBudgetVsActual] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, monthly, quarterly

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        summary,
        monthly,
        breakdown,
        completion,
        budgetData
      ] = await Promise.all([
        analyticsAPI.dashboardSummary(),
        analyticsAPI.monthlyExpenses(),
        analyticsAPI.expenseBreakdown(),
        analyticsAPI.projectCompletion(),
        analyticsAPI.budgetVsActual()
      ]);

      setDashboardData(summary.data);
      setMonthlyExpenses(monthly.data);
      
      // Convert expense breakdown to array for chart
      const breakdownArray = Object.entries(breakdown.data || {}).map(([type, amount]) => ({
        name: type,
        value: amount
      }));
      setExpenseBreakdown(breakdownArray);

      setProjectCompletion(completion.data);
      setBudgetVsActual(budgetData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your society overview.</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {['all', 'monthly', 'quarterly'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Projects"
          value={dashboardData?.total_projects || 0}
          icon="📊"
          trend="+12% this month"
        />
        <KPICard
          title="Active Projects"
          value={dashboardData?.active_projects || 0}
          icon="🚀"
          trend="In progress"
        />
        <KPICard
          title="Budget Utilization"
          value={`${(dashboardData?.budget_utilization_percentage || 0).toFixed(1)}%`}
          icon="💰"
          trend={`₹${(dashboardData?.total_spent || 0).toLocaleString()} spent`}
        />
        <KPICard
          title="Remaining Budget"
          value={`₹${(dashboardData?.remaining_budget || 0).toLocaleString()}`}
          icon="💵"
          trend={`Of ₹${(dashboardData?.total_budget || 0).toLocaleString()}`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Expenses Trend */}
        <ChartCard title="Monthly Expenses Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="1" stroke="#3b82f6" name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Expense Breakdown */}
        <ChartCard title="Expense Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Completion Status */}
        <ChartCard title="Project Completion Status">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Planning', value: projectCompletion?.planning || 0 },
                { name: 'In Progress', value: projectCompletion?.in_progress || 0 },
                { name: 'Completed', value: projectCompletion?.completed || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Budget vs Actual */}
        <ChartCard title="Budget vs Actual (Top Projects)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetVsActual.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project_name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
              <Bar dataKey="actual_cost" fill="#ef4444" name="Actual Cost" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Stats Table */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Total Assets" value={dashboardData?.total_assets || 0} />
          <StatItem label="Total Invoices" value={dashboardData?.total_invoices || 0} />
          <StatItem label="Total Budget" value={`₹${(dashboardData?.total_budget || 0).toLocaleString()}`} />
          <StatItem label="Total Spent" value={`₹${(dashboardData?.total_spent || 0).toLocaleString()}`} />
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-gray-500 text-xs mt-2">{trend}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="border-l-4 border-blue-600 pl-4 py-2">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
