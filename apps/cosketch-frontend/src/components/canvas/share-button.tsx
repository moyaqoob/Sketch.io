'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareButtonProps {
  roomId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ roomId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/canvas/${roomId}`
      : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleShare = async () => {
    setIsProcessing(true);
    try {
      await navigator.share({
        title: 'Join My CoSketch Room!',
        text: `Let's collaborate in real time on CoSketch. Click the link to join now!`,
        url: shareUrl,
      });
      toast.success('Room link shared successfully!');
    } catch {
      toast.error('Failed to share the link.');
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  const handleCopy = async () => {
    setIsProcessing(true);
    try {
      await navigator.clipboard.writeText(
        `Join My CoSketch Room!\nLet's collaborate in real time on CoSketch. Click the link to join now!\n${shareUrl}`,
      );
      setCopied(true);
      toast.success('Room link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy the link.');
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  return (
    <div className='relative' ref={menuRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        disabled={isProcessing}
        className='bg-primary-darker hover:bg-primary-chubb flex items-center gap-2 rounded-lg px-4 py-2 text-base text-white transition disabled:opacity-50'
      >
        {isProcessing ? (
          <Loader2 className='h-5 w-5 animate-spin' />
        ) : copied ? (
          <Check className='h-5 w-5 text-green-400' />
        ) : (
          <Share2 className='h-5 w-5' />
        )}
        {isProcessing ? 'Processing...' : copied ? 'Copied!' : 'Share'}
        <ChevronDown className='h-4 w-4' />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-44 rounded-lg bg-white p-2 shadow-lg'>
          <button
            onClick={handleShare}
            disabled={isProcessing}
            className='flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50'
          >
            {isProcessing ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Share2 className='h-4 w-4' />
            )}
            {isProcessing ? 'Sharing...' : 'Share'}
          </button>
          <button
            onClick={handleCopy}
            disabled={isProcessing}
            className='flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50'
          >
            {isProcessing ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : copied ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
            {isProcessing ? 'Copying...' : copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
