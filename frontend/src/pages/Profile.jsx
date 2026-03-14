import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, User as UserIcon, Edit2 } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profileData.full_name,
          email: profileData.email
        })
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8">
        {/* Profile Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profileData?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profileData?.full_name}</h2>
            <p className="text-gray-600">@{profileData?.username}</p>
            <p className="text-sm mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                profileData?.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {profileData?.role}
              </span>
            </p>
          </div>
        </div>

        {!isEditing ? (
          <>
            {/* Display Profile Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="flex items-center gap-3">
                  <UserIcon size={20} className="text-gray-400" />
                  <p className="text-lg text-gray-900">{profileData?.username}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="flex items-center gap-3">
                  <UserIcon size={20} className="text-gray-400" />
                  <p className="text-lg text-gray-900">{profileData?.full_name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <p className="text-lg text-gray-900">{profileData?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <p className="text-lg text-gray-900">{profileData?.role === 'ADMIN' ? 'Administrator' : 'Member'}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-8"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Profile Form */}
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={profileData?.username}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData?.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData?.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
