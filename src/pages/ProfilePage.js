import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await api.getProfile();
      setUser(userData);
      setForm({ name: userData.name, email: userData.email });
    } catch (error) {
      console.error('Error loading profile:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await api.updateProfile(form);
      setUser(updatedUser);
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      setError("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setMessage("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (error) {
      setError(error.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-brand-tealDark text-brand-off rounded-lg p-6 shadow-sm border border-brand-gold/20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setEditing(!editing)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20"
            >
              {editing ? 'Cancel' : 'Edit'}
            </motion.button>
            <motion.button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20"
            >
              Change Password
            </motion.button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-md bg-brand-gold text-brand-tealDark font-semibold"
            >
              Save Changes
            </motion.button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-1">Name</div>
              <div className="text-brand-off/80">{user?.name}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Email</div>
              <div className="text-brand-off/80">{user?.email}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Role</div>
              <div className="text-brand-off/80 capitalize">{user?.role}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Member Since</div>
              <div className="text-brand-off/80">{new Date(user?.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        )}

        {/* Password Change Form */}
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-brand-teal/20 rounded-lg border border-brand-gold/20"
          >
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
                  required
                  minLength="6"
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 rounded-md bg-brand-gold text-brand-tealDark font-semibold"
                >
                  Change Password
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setError("");
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;


