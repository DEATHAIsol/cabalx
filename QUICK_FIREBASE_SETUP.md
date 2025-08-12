# Quick Firebase Setup to Fix Current Issues

## 🚨 Current Issues Fixed:

1. **FirebaseError: Missing or insufficient permissions** ✅
2. **FirebaseError: Function setDoc() called with invalid data** ✅

## 🔧 Steps to Fix:

### **Step 1: Update Firestore Rules**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Replace the current rules with the contents of `firestore.rules`
5. Click **Publish**

### **Step 2: Set Environment Variables**

Create or update your `.env.local` file:

```env
# Firebase Configuration (replace with your actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### **Step 3: Get Firebase Config**

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Add app** → **Web**
4. Register app: "CabalX Web"
5. Copy the config object and extract the values

### **Step 4: Test the Fix**

1. Restart your dev server: `npm run dev`
2. Connect your wallet
3. Navigate to `/chat`
4. Should now work without errors!

## 🔍 What Was Fixed:

### **Permissions Error:**
- Updated Firestore rules to allow wallet-based authentication
- Removed strict user ID matching since we use wallet addresses
- Added helper function for authentication checks

### **Invalid Data Error:**
- Fixed `cabalId` field to use `null` instead of `undefined`
- Updated all user creation/update functions
- Added proper null handling throughout the API

### **Code Changes:**
- `firestore.rules` - Updated security rules
- `firebase-api.ts` - Fixed undefined value handling
- `useCurrentUser.ts` - Improved user creation logic

## 🎯 Expected Result:

After following these steps:
- ✅ No more "Connect Your Wallet" error
- ✅ No more Firebase permission errors
- ✅ No more invalid data errors
- ✅ Chat page loads properly
- ✅ Real-time messaging works

## 🆘 If Still Having Issues:

1. **Check Firebase Console** for any remaining errors
2. **Verify environment variables** are set correctly
3. **Clear browser cache** and restart dev server
4. **Check browser console** for any remaining errors

**The chat should now work perfectly! 🎉** 