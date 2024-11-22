"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchProfile = async (currentUser: User) => {
    try {
      // First, ensure the profile exists
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(
          { 
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || '',
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'id',
            ignoreDuplicates: false // Set to false to ensure email gets updated
          }
        );

      if (upsertError) {
        console.error('Error upserting profile:', upsertError);
        return null;
      }

      // Then fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchProfile(currentUser);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);

      // Handle session changes
      if (event === 'SIGNED_IN') {
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.push('/');
        router.refresh();
      }
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchProfile(currentUser);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};