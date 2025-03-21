'use client';

import { authorize } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ProtectRouteProps {
  children: React.ReactNode;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null | undefined>(undefined);

  const authorizeMutation = useMutation({
    mutationFn: authorize,
    onSuccess: data => {
      toast.success(data.message || 'Authentication successful');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Unauthorized access');
      router.replace('/signin');
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      router.replace('/signin');
    } else {
      setToken(storedToken);
      authorizeMutation.mutate({ token: storedToken });
    }
  }, []);

  if (token === undefined || authorizeMutation.isPending || token === null) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg font-medium'>Verifying...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectRoute;
