'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { User, LogOut } from 'lucide-react';
import { useState } from 'react';

export function UserProfile({
  user,
  onSignOut,
}: {
  user: any;
  onSignOut: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowMenu(!showMenu)}
        className="text-white hover:bg-white/20"
      >
        <User className="h-5 w-5" />
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-40" style={{ minWidth: 'max-content' }}>
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap px-2">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              onSignOut();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
