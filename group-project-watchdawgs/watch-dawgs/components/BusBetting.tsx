'use client';

import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Trophy } from 'lucide-react';
import { useState } from 'react';

export function BusBetting({ user }: { user: any }) {
  const [selectedBus, setSelectedBus] = useState('');
  const [prediction, setPrediction] = useState('');

  const mockBuses = [
    { id: '1', route: '1', destination: 'North Campus' },
    { id: '2', route: '2', destination: 'South Campus' },
    { id: '3', route: '3', destination: 'Downtown' },
  ];

  const handleBet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBus || !prediction || !user?.id) {
      alert('Please select a bus and enter arrival time prediction');
      return;
    }

    try {
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          busId: selectedBus,
          predictedArrival: parseInt(prediction),
          status: 'pending',
        }),
      });

      if (response.ok) {
        console.log('Bet placed successfully');
        alert('Bet placed! Predicted arrival: ' + prediction + ' minutes');
        setSelectedBus('');
        setPrediction('');
      } else {
        alert('Failed to place bet');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Error placing bet');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bus Betting Game
          </CardTitle>
          <CardDescription>
            Predict bus arrival times and earn points!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBet} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bus Route
              </label>
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
                required
              >
                <option value="">Choose a route...</option>
                {mockBuses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    Route {bus.route} - {bus.destination}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Predict Arrival Time (minutes)
              </label>
              <input
                type="number"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                placeholder="e.g., 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA0C2F] focus:border-transparent"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#BA0C2F] hover:bg-red-800">
              Place Bet
            </Button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Your Bets</h4>
            <p className="text-sm text-purple-700">No active bets</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
