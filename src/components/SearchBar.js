import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch, placeholder = "Search jewelry..." }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onSearch?.(searchQuery.trim());
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-brand-off hover:text-brand-gold transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 outline-none text-gray-900"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-gold text-white rounded hover:bg-yellow-600"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;

