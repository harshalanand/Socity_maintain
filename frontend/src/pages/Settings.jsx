import { useState, useEffect } from 'react';
import { Save, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    organization_name: 'Aashiyana Homes',
    organization_address: '',
    notification_email: '',
    timezone: 'IST'
  });

  useEffect(() => {
    loadSystemSettings();
  }, []);

  const loadSystemSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: securityData.currentPassword,
          new_password: securityData.newPassword
        })
      });

      if (response.ok) {
        setMessage('Password changed successfully!');
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Incorrect current password');
      }
    } catch (error) {
      setMessage('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemSettings)
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and system preferences</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {[
          { id: 'profile', label: 'Profile', icon: UserIcon },
          { id: 'security', label: 'Security', icon: Lock },
          { id: 'system', label: 'System', icon: UserIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">System Settings</h2>
          <form onSubmit={handleSystemSettingsUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                value={systemSettings.organization_name}
                onChange={(e) => setSystemSettings({ ...systemSettings, organization_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Address</label>
              <textarea
                value={systemSettings.organization_address}
                onChange={(e) => setSystemSettings({ ...systemSettings, organization_address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notification Email</label>
              <input
                type="email"
                value={systemSettings.notification_email}
                onChange={(e) => setSystemSettings({ ...systemSettings, notification_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={systemSettings.timezone}
                onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IST">IST (India Standard Time)</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
