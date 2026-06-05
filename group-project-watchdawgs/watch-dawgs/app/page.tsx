'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { RoutePlanner } from '@/components/RoutePlanner';
import { BusTracker } from '@/components/BusTracker';
import { TrafficAlerts } from '@/components/TrafficAlerts';
import { BusBetting } from '@/components/BusBetting';
import { SavedPlaces } from '@/components/SavedPlaces';
import { AuthModal } from '@/components/AuthModal';
import { UserProfile } from '@/components/UserProfile';
import { SplashScreen } from '@/components/SplashScreen';
import { Car, MapPin, Bus, AlertTriangle, Trophy, User, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('buses');
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setShowSplash(false); // Skip splash screen if user is logged in
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Show splash screen
  if (showSplash) {
    return (
      <SplashScreen
        onNavigate={(tab) => {
          setActiveTab(tab);
          setShowSplash(false);
        }}
      />
    );
  }

  // Show loading spinner after splash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA0C2F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#BA0C2F] to-black">
      {/* Header */}
      <header className="bg-[#BA0C2F] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8" />
              <div>
                <h1 className="text-white font-bold">UGA Traffic Navigator</h1>
                <p className="text-red-100 text-xs">Get to class on time • Real-time traffic & bus tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="hidden sm:flex text-white hover:bg-white/20 border border-white/30"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                  <UserProfile user={user} onSignOut={handleSignOut} />
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuth(true)}
                  variant="secondary"
                  className="bg-white text-[#BA0C2F] hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto bg-transparent">
            <TabsTrigger value="buses" className="flex items-center gap-2 text-white hover:text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Bus className="h-4 w-4" />
              <span className="hidden sm:inline">Buses</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2 text-white hover:text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2 text-white hover:text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="betting" className="flex items-center gap-2 text-white hover:text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Bet</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2 text-white hover:text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Places</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buses">
            <BusTracker user={user} />
          </TabsContent>

          <TabsContent value="planner">
            <RoutePlanner user={user} />
          </TabsContent>

          <TabsContent value="alerts">
            <TrafficAlerts />
          </TabsContent>

          <TabsContent value="betting">
            {user ? (
              <BusBetting user={user} />
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="mb-2">Sign in to Play Bus Betting</h3>
                <p className="text-gray-600 mb-4">Predict bus arrival times and earn points!</p>
                <Button onClick={() => setShowAuth(true)}>Sign In</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locations">
            {user ? (
              <SavedPlaces user={user} />
            ) : (
              <Card className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="mb-2">Sign in to Save Places</h3>
                <p className="text-gray-600 mb-4">Save your favorite places for quick access</p>
                <Button onClick={() => setShowAuth(true)}>Sign In</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-white/70">
          <p>UGA Traffic Navigator - Powered by Georgia 511, GDOT, Google Maps & Passio GO</p>
          <p className="mt-1">For emergencies, call UGA Police: (706) 542-2200</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }}
        />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
