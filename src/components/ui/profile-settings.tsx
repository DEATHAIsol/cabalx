"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types';
import { 
  User as UserIcon, 
  Camera, 
  X, 
  Check, 
  AlertCircle,
  Save,
  X as CancelIcon,
  Shield,
  MessageCircle,
  Users,
  UserX
} from 'lucide-react';

interface ProfileSettingsProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export const ProfileSettings = ({ user, onSave, onCancel }: ProfileSettingsProps) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    displayName: user.displayName || '',
    bio: user.bio || '',
    profileImageUrl: user.profileImageUrl || '',
    dmPrefs: user.dmPrefs || { allowFrom: 'everyone' as const }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Username validation
  const validateUsername = (username: string) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-z0-9_]+$/.test(username)) {
      return 'Username can only contain lowercase letters, numbers, and underscores';
    }
    return null;
  };

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || validateUsername(username)) return;
    
    setIsCheckingUsername(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      const isAvailable = username !== 'taken' && username !== 'admin';
      setUsernameAvailable(isAvailable);
    } catch {
      console.error('Error checking username:');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username && formData.username !== user.username) {
        checkUsernameAvailability(formData.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors({ image: 'Image must be less than 5MB' });
      return;
    }

    setIsUploading(true);
    setErrors({});

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate upload - replace with actual Supabase/S3 upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const uploadedUrl = `https://example.com/uploads/${Date.now()}-${file.name}`;
      
      setFormData(prev => ({ ...prev, profileImageUrl: uploadedUrl }));
    } catch (error) {
      setErrors({ image: 'Failed to upload image. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    
    if (usernameAvailable === false) {
      newErrors.username = 'Username is already taken';
    }
    
    if (formData.bio && formData.bio.length > 280) {
      newErrors.bio = 'Bio must be less than 280 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getDmPrefsIcon = (pref: string) => {
    switch (pref) {
      case 'everyone':
        return <MessageCircle className="w-4 h-4" />;
      case 'cabal':
        return <Users className="w-4 h-4" />;
      case 'nobody':
        return <UserX className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getDmPrefsLabel = (pref: string) => {
    switch (pref) {
      case 'everyone':
        return 'Everyone can message me';
      case 'cabal':
        return 'Only cabal members can message me';
      case 'nobody':
        return 'Nobody can message me';
      default:
        return 'Everyone can message me';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
              {(imagePreview || formData.profileImageUrl) ? (
                <img
                  src={imagePreview || formData.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          
          {isUploading && (
            <div className="text-sm text-purple-400 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
              <span>Uploading image...</span>
            </div>
          )}
          
          {errors.image && (
            <div className="text-sm text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.image}</span>
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Username *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors ${
                errors.username ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Enter username"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isCheckingUsername ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
              ) : usernameAvailable === true ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : usernameAvailable === false ? (
                <X className="w-4 h-4 text-red-400" />
              ) : null}
            </div>
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.username}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            3-20 characters, lowercase letters, numbers, and underscores only
          </p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Enter display name (optional)"
            disabled={isLoading}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Bio
          </label>
          <div className="relative">
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none ${
                errors.bio ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Tell us about yourself..."
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {formData.bio.length}/280
            </div>
          </div>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.bio}</span>
            </p>
          )}
        </div>

        {/* DM Preferences */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Direct Message Privacy
          </label>
          <div className="space-y-2">
            {(['everyone', 'cabal', 'nobody'] as const).map((pref) => (
              <label
                key={pref}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.dmPrefs.allowFrom === pref
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="dmPrefs"
                  value={pref}
                  checked={formData.dmPrefs.allowFrom === pref}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dmPrefs: { allowFrom: e.target.value as 'everyone' | 'cabal' | 'nobody' }
                  }))}
                  className="sr-only"
                />
                <div className="text-purple-400">
                  {getDmPrefsIcon(pref)}
                </div>
                <div>
                  <div className="text-white font-medium capitalize">{pref}</div>
                  <div className="text-sm text-gray-400">{getDmPrefsLabel(pref)}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.general}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <CancelIcon className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={isLoading || usernameAvailable === false}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}; 