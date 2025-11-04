'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren, Suspense, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Bprogress = (props: PropsWithChildren) => {
  return (
    <ProgressProvider
      height="4px"
      color="#7b60db"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {props.children}
    </ProgressProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const ReactQuery = (props: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

const Nuqs = (props: PropsWithChildren) => {
  return <NuqsAdapter>{props.children}</NuqsAdapter>;
};

const HotToast = () => {
  const [queryToast, setQueryToast] = useQueryState('toast', {
    defaultValue: '',
  });
  const [queryType, setQueryType] = useQueryState('type', {
    defaultValue: '',
  });
  useEffect(() => {
    if (queryToast) {
      toast[queryType as 'success' | 'error'](queryToast);
      setQueryToast('');
      setQueryType('');
    }
  }, [queryToast]);

  return <Toaster position="top-center" containerClassName="toaster-wrapper" />;
};

export const Providers = (props: PropsWithChildren) => {
  return (
    <>
      <Bprogress>
        <ReactQuery>
          <Nuqs>
            <Suspense>
              <HotToast />
              {props.children}
            </Suspense>
          </Nuqs>
        </ReactQuery>
      </Bprogress>
    </>
  );
};
