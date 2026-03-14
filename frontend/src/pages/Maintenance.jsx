import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { maintenanceAPI } from '../services/api';

export function Maintenance() {
  const [charges, setCharges] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('charges');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCharges();
  }, [filterStatus]);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await maintenanceAPI.listCharges(params);
      setCharges(response.charges || []);
    } catch (error) {
      console.error('Error fetching charges:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="text-green-600" size={40} />
            Maintenance Charges
          </h1>
          <p className="text-gray-600 mt-2">Manage monthly maintenance charges and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Charges</p>
                <p className="text-3xl font-bold text-blue-600">{charges.length}</p>
              </div>
              <TrendingUp className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {charges.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="text-orange-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Paid</p>
                <p className="text-3xl font-bold text-green-600">
                  {charges.filter(c => c.status === 'paid').length}
                </p>
              </div>
              <TrendingUp className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{charges.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0).toFixed(0)}
                </p>
              </div>
              <DollarSign className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-4 flex-wrap">
            {['all', 'pending', 'paid', 'partial', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charges List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading charges...</div>
          ) : charges.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No charges found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Flat ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Month/Year</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Due Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((charge) => (
                  <tr key={charge.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{charge.flat_id}</td>
                    <td className="px-6 py-4 text-gray-600">{charge.month}/{charge.year}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{charge.amount}</td>
                    <td className="px-6 py-4 text-gray-600">{charge.due_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        charge.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : charge.status === 'pending'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">
                        {charge.status === 'paid' ? 'View' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
