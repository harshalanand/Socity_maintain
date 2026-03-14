import { useState, useEffect } from 'react';
import { expensesAPI } from '../services/api';
import { Plus } from 'lucide-react';

export function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState({});
  const [formData, setFormData] = useState({
    project_id: '',
    expense_type: 'maintenance',
    amount: '',
    description: '',
    narration: '',
    invoice_number: '',
    expense_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        expensesAPI.list(),
        expensesAPI.getSummary()
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.user_id || 1;
      await expensesAPI.create(formData, userId);
      setFormData({
        project_id: '',
        expense_type: 'maintenance',
        amount: '',
        description: '',
        narration: '',
        invoice_number: '',
        expense_date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading expenses...</div>;
  }

  const totalExpenses = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-2">Track and manage society expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard label="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} />
        {Object.entries(summary).slice(0, 3).map(([type, amount]) => (
          <SummaryCard
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            value={`₹${amount.toLocaleString()}`}
          />
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.expense_type}
                onChange={(e) => setFormData({...formData, expense_type: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="utilities">Utilities</option>
                <option value="staff">Staff</option>
                <option value="security">Security</option>
                <option value="landscaping">Landscaping</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Invoice Number"
                value={formData.invoice_number}
                onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              rows="2"
            ></textarea>
            <textarea
              placeholder="Narration"
              value={formData.narration}
              onChange={(e) => setFormData({...formData, narration: e.target.value})}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              rows="2"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-700">{expense.expense_date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.expense_type}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{expense.description}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{expense.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{expense.invoice_number || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
