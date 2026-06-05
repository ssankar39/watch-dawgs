import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';

export const Toaster = () => (
  <SonnerToaster
    position="top-right"
    theme="light"
    richColors
  />
);

export { toast };
