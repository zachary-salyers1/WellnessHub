"use client";

import { DashboardMetrics } from '@/components/dashboard/metrics';
import { WelcomeHero } from '@/components/dashboard/welcome-hero';
import { UpcomingActivities } from '@/components/dashboard/upcoming-activities';
import { useAuth } from '@/components/auth/auth-provider';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-8">
      <WelcomeHero />
      <DashboardMetrics />
      <UpcomingActivities />
    </div>
  );
}