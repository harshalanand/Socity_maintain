import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { memberAPI } from '../services/api';

export function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    flat_id: '',
    name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    owner_type: 'Owner',
    identification_type: 'Aadhar',
    identification_number: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await memberAPI.list();
      setMembers(response.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await memberAPI.create(formData);
      setShowForm(false);
      setFormData({
        flat_id: '',
        name: '',
        email: '',
        phone: '',
        alternate_phone: '',
        date_of_joining: new Date().toISOString().split('T')[0],
        owner_type: 'Owner',
        identification_type: 'Aadhar',
        identification_number: '',
      });
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-blue-600" size={40} />
              Society Members
            </h1>
            <p className="text-gray-600 mt-2">Manage all society members and their details</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {/* Add Member Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Add New Member</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Flat ID"
                value={formData.flat_id}
                onChange={(e) => setFormData({ ...formData, flat_id: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <input
                type="tel"
                placeholder="Alternate Phone"
                value={formData.alternate_phone}
                onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="date"
                value={formData.date_of_joining}
                onChange={(e) => setFormData({ ...formData, date_of_joining: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
                required
              />
              <select
                value={formData.owner_type}
                onChange={(e) => setFormData({ ...formData, owner_type: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option>Owner</option>
                <option>Tenant</option>
                <option>Co-owner</option>
              </select>
              <select
                value={formData.identification_type}
                onChange={(e) => setFormData({ ...formData, identification_type: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option>Aadhar</option>
                <option>PAN</option>
                <option>Passport</option>
              </select>
              <input
                type="text"
                placeholder="Identification Number"
                value={formData.identification_number}
                onChange={(e) => setFormData({ ...formData, identification_number: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded col-span-1 md:col-span-2 lg:col-span-3"
              >
                Save Member
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No members found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 text-gray-600">{member.email}</td>
                    <td className="px-6 py-4 text-gray-600">{member.phone}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {member.owner_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        member.member_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.member_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Members</p>
            <p className="text-3xl font-bold text-blue-600">{members.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Active Members</p>
            <p className="text-3xl font-bold text-green-600">
              {members.filter(m => m.member_status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Owners</p>
            <p className="text-3xl font-bold text-purple-600">
              {members.filter(m => m.owner_type === 'Owner').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
