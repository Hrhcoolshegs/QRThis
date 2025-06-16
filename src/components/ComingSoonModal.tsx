
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, Bell } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function ComingSoonModal({ isOpen, onClose, feature = "Premium Features" }: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {feature} Coming Soon!
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            We're working hard to bring you amazing premium features. Stay tuned for updates!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-800 dark:text-purple-200">What's Coming</span>
            </div>
            <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>AI Art QR Code Generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Advanced Brand Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Premium Templates & Styles</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Priority Support</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify Me When Available
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              Continue with Free Version
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
