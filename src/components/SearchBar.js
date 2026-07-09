import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch, placeholder = "Search luxury jewelry..." }) => {
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
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-brand-dark hover:text-brand-gold transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="bg-brand-light rounded-2xl border border-brand-gold/20 shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold">Search Collection</h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-brand-dark/60 hover:text-brand-dark transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative flex items-center bg-brand-cream/30 rounded-xl border border-brand-dark/15 px-3.5 py-2.5 focus-within:border-brand-gold/40 transition">
                  <Search className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 outline-none bg-transparent text-sm text-brand-dark placeholder-brand-dark/40 w-full"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1 hover:bg-brand-cream/20 rounded-md transition text-brand-dark/60 hover:text-brand-dark"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-brand-dark/70 hover:text-brand-dark hover:bg-brand-cream/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-gold text-brand-light font-bold text-xs shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 transition"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
