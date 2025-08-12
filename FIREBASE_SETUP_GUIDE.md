# Firebase Setup Guide for CabalX

## 🚀 Complete Supabase → Firebase Migration

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `cabalx-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### **Step 2: Enable Firestore Database**

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

### **Step 3: Enable Firebase Storage**

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location
5. Click "Done"

### **Step 4: Get Firebase Configuration**

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name "CabalX Web"
5. Copy the configuration object

### **Step 5: Update Environment Variables**

Create or update your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Remove these Supabase variables (no longer needed)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### **Step 6: Deploy Firestore Security Rules**

1. Copy the contents of `firestore.rules` to your Firebase Console
2. Go to Firestore Database → Rules
3. Replace the default rules with our custom rules
4. Click "Publish"

### **Step 7: Test the Migration**

1. Start your development server: `npm run dev`
2. Connect your wallet
3. Navigate to `/chat`
4. Test world chat functionality
5. Test user search and DM creation

## 🔥 Firebase Features Implemented

### **✅ Real-time Chat**
- World chat (public)
- Direct messages (private)
- Cabal chat (private)
- Instant message delivery with `onSnapshot`

### **✅ User Management**
- Automatic user creation on wallet connection
- Profile management (username, avatar, bio)
- User search functionality

### **✅ Cabal System**
- Cabal creation and management
- Member management (join/leave)
- Cabal chat rooms

### **✅ Storage**
- Profile image uploads
- Firebase Storage integration

## 📁 Files Changed

### **Added:**
- `src/lib/firebase.ts` - Firebase configuration
- `src/lib/firebase-api.ts` - Complete Firebase API layer
- `src/hooks/useCurrentUser.ts` - Firebase user management
- `firestore.rules` - Security rules

### **Removed:**
- `src/lib/supabase.ts` - Old Supabase client
- `src/lib/supabase-api.ts` - Old Supabase API
- `src/lib/messaging-api.ts` - Old messaging API
- `src/hooks/useSupabase.ts` - Old Supabase hooks

### **Updated:**
- `src/app/chat/page.tsx` - Now uses Firebase API
- All Supabase references removed

## 🔒 Security Rules

The Firestore security rules ensure:
- Users can only edit their own profiles
- World chat is public for all authenticated users
- DMs are private to participants only
- Cabal chat is private to cabal members only
- Only cabal leaders can modify cabal settings

## 🎯 Next Steps

1. **Test thoroughly** - Verify all chat functionality works
2. **Migrate existing data** - If you have Supabase data, export and import to Firebase
3. **Update deployment** - Ensure Vercel has the new environment variables
4. **Monitor performance** - Check Firebase Console for usage and performance

## 🚨 Important Notes

- **No authentication required** - We're using wallet addresses as user IDs
- **Real-time by default** - All chat updates are real-time via Firestore
- **Automatic scaling** - Firebase handles all scaling automatically
- **Cost effective** - Firebase has generous free tier limits

## 🆘 Troubleshooting

### **If chat doesn't work:**
1. Check Firebase Console for errors
2. Verify environment variables are set correctly
3. Check browser console for Firebase errors
4. Ensure Firestore rules are published

### **If users can't be created:**
1. Check Firestore rules allow user creation
2. Verify wallet connection is working
3. Check Firebase Console for permission errors

### **If real-time doesn't work:**
1. Check `onSnapshot` subscriptions are set up correctly
2. Verify Firestore rules allow read access
3. Check browser console for subscription errors

**Firebase migration complete! 🎉** 