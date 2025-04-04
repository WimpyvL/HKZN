import { useContext } from 'react';
import AuthContext from './AuthContext';

// Custom hook to consume the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    // This should not happen if useAuth is used within AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

// Note: The actual implementation is now in AuthProvider.
// This hook just provides easy access to the context value.
