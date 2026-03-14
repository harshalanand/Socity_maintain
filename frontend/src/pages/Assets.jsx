import { useState, useEffect } from 'react';
import { assetsAPI } from '../services/api';
import { Plus } from 'lucide-react';

export function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [assetsByCategory, setAssetsByCategory] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    category: 'Equipment',
    description: '',
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_value: '',
    location: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const [listRes, categoryRes] = await Promise.all([
        assetsAPI.list(),
        assetsAPI.getByCategory()
      ]);
      setAssets(listRes.data);
      setAssetsByCategory(categoryRes.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assetsAPI.create(formData);
      setFormData({
        name: '',
        category: 'Equipment',
        description: '',
        purchase_date: new Date().toISOString().split('T')[0],
        purchase_value: '',
        location: ''
      });
      setShowForm(false);
      fetchAssets();
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading assets...</div>;
  }

  const totalValue = assets.reduce((sum, asset) => sum + asset.current_value, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600 mt-2">Manage society assets and inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add Asset
        </button>
      </div>

      {/* Total Value Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-green-600">
        <p className="text-gray-600 text-sm font-medium">Total Asset Value</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">₹{totalValue.toLocaleString()}</p>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Asset</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Asset Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="Equipment">Equipment</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Building">Building</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Purchase Value"
                value={formData.purchase_value}
                onChange={(e) => setFormData({...formData, purchase_value: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              rows="2"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Asset
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

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Purchase Value</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Current Value</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{asset.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{asset.category}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{asset.location}</td>
                <td className="px-6 py-4 text-sm text-gray-700">₹{asset.purchase_value.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{asset.current_value.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    asset.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
