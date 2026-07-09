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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="bg-white text-brand-dark rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/20"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-brand-dark/10">
          <div>
            <h1 className="text-3xl font-bold font-heading">My Profile</h1>
            <p className="text-sm text-brand-dark/60 mt-1">Manage your account details and password.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => setEditing(!editing)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl bg-white border border-brand-dark/15 hover:border-brand-dark/30 shadow-sm text-xs font-bold uppercase tracking-wider text-brand-dark transition-all"
            >
              {editing ? 'Cancel Editing' : 'Edit Profile'}
            </motion.button>
            <motion.button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl bg-white border border-brand-dark/15 hover:border-brand-dark/30 shadow-sm text-xs font-bold uppercase tracking-wider text-brand-dark transition-all"
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
          <form onSubmit={handleUpdate} className="space-y-5 bg-[#FDFBF7] p-6 md:p-8 rounded-2xl border border-brand-dark/10 shadow-inner">
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-gold text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all mt-2"
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-brand-dark/10 shadow-inner flex flex-col justify-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">Full Name</div>
              <div className="text-brand-dark font-medium text-lg">{user?.name}</div>
            </div>
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-brand-dark/10 shadow-inner flex flex-col justify-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">Email Address</div>
              <div className="text-brand-dark font-medium text-lg">{user?.email}</div>
            </div>
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-brand-dark/10 shadow-inner flex flex-col justify-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">Account Role</div>
              <div className="text-brand-gold font-bold text-lg capitalize">{user?.role}</div>
            </div>
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-brand-dark/10 shadow-inner flex flex-col justify-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 mb-1">Member Since</div>
              <div className="text-brand-dark font-medium text-lg">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        )}

        {/* Password Change Form */}
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 md:p-8 bg-[#FDFBF7] rounded-2xl border border-brand-dark/15 shadow-inner"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold font-heading">Security & Password</h3>
              <p className="text-xs text-brand-dark/60 mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-sm"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-sm"
                  required
                  minLength="6"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl bg-brand-gold text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all"
                >
                  Update Password
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setError("");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl bg-white border border-brand-dark/15 hover:border-brand-dark/30 shadow-sm text-xs font-bold uppercase tracking-wider text-brand-dark transition-all text-center"
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


