import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Journey to Better Health Starts Here
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Personalized workouts, nutrition planning, and health tracking all in one place.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Workout Tracking</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Log and track your workouts with detailed progress metrics
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Health Monitoring</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Keep track of vital health metrics and wellness goals
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI-Powered Plans</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Get personalized workout and nutrition recommendations
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Data Privacy</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Your health data is secure and protected
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}