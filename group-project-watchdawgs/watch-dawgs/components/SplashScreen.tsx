'use client';

import Image from 'next/image';
import { MapPin, Bus, Navigation, Trophy, AlertTriangle } from 'lucide-react';

export function SplashScreen({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#BA0C2F] to-black flex items-center justify-center">
      <main className="text-center max-w-4xl px-6">
        <div className="mb-12">
          <h1 className="text-white text-5xl sm:text-6xl font-bold mb-4">WatchDawgs</h1>
          <p className="text-2xl text-white mb-2">UGA Traffic Navigator</p>
          <p className="text-white/80">Get to class on time • Real-time traffic & bus tracking</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <button
            onClick={() => onNavigate('map')}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="bg-linear-to-br from-red-400 to-red-600 rounded-lg p-3 inline-block mb-3 group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Real-Time Traffic</p>
          </button>

          <button
            onClick={() => onNavigate('buses')}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-lg p-3 inline-block mb-3 group-hover:scale-110 transition-transform">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Live Bus Tracking</p>
          </button>

          <button
            onClick={() => onNavigate('planner')}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="bg-linear-to-br from-green-400 to-green-600 rounded-lg p-3 inline-block mb-3 group-hover:scale-110 transition-transform">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Smart Routes</p>
          </button>

          <button
            onClick={() => onNavigate('betting')}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg p-3 inline-block mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">Bus Betting</p>
          </button>
        </div>

        {/* Main CTA */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
          <p className="text-white mb-6 text-lg leading-relaxed">
            Navigate UGA campus efficiently with real-time traffic updates, bus tracking, and smart route planning.
          </p>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-8 py-3 bg-[#BA0C2F] text-white rounded-lg font-semibold hover:bg-red-800 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <AlertTriangle className="h-5 w-5" />
            View All Features
          </button>
        </div>

        <p className="text-sm text-white/70">
          Sign in to save locations, bet on bus arrivals, and report incidents
        </p>
      </main>
    </div>
  );
}
