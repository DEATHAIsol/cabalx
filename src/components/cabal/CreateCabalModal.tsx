"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, X, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { firebaseApi } from '@/lib/firebase-api';
import { User } from '@/types';

interface CreateCabalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cabalId: string) => void;
  currentUser: User;
}

export function CreateCabalModal({ isOpen, onClose, onSuccess, currentUser }: CreateCabalModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minPoints: 0,
    icon: '🏛️'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minPoints' ? parseInt(value) || 0 : value
    }));
  };

  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await firebaseApi.searchUsers(query);
      setSearchResults(results.filter(user => user.id !== currentUser.id));
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const toggleMemberSelection = (user: User) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === user.id);
      if (isSelected) {
        return prev.filter(m => m.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      // If user is already in a cabal, leave it first
      if (currentUser.cabalId) {
        await firebaseApi.leaveCabal(currentUser.cabalId, currentUser.walletAddress);
      }

      // Create cabal
      const cabalId = await firebaseApi.createCabal({
        name: formData.name,
        description: formData.description,
        minCabalPoints: formData.minPoints,
        icon: formData.icon
      }, currentUser.walletAddress);

      // Add selected members to cabal
      for (const member of selectedMembers) {
        try {
          await firebaseApi.joinCabal(cabalId, member.walletAddress);
        } catch (error) {
          console.error(`Error adding member ${member.username}:`, error);
        }
      }

      // Reset form
      setFormData({ name: '', description: '', minPoints: 0, icon: '🏛️' });
      setSelectedMembers([]);
      setSearchTerm('');
      setSearchResults([]);

      onSuccess(cabalId);
    } catch (error) {
      console.error('Error creating cabal:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Cabal">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Warning if user is already in a cabal */}
        {currentUser.cabalId && (
          <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              ⚠️ You are currently in a cabal. Creating a new cabal will automatically leave your current one.
            </p>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cabal Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter cabal name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Describe your cabal"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Cabal Points
              </label>
              <input
                type="number"
                name="minPoints"
                value={formData.minPoints}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                maxLength={2}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-center text-2xl"
                placeholder="🏛️"
              />
            </div>
          </div>
        </div>

        {/* Member Invitation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Invite Members</h3>
            <span className="text-sm text-gray-400">
              {selectedMembers.length} selected
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users to invite..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchUsers(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {searchResults.map((user) => {
                const isSelected = selectedMembers.some(m => m.id === user.id);
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-600/30 border border-purple-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => toggleMemberSelection(user)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {user.username || user.displayName || 'Unknown'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {user.cabalPoints} CP
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-400'
                    }`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Selected Members:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600/20 text-purple-300 rounded-full"
                  >
                    <span className="text-sm">{member.username || member.displayName}</span>
                    <button
                      type="button"
                      onClick={() => toggleMemberSelection(member)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Cabal'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 