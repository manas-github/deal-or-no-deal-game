import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper function to determine API base URL based on environment
const getApiBaseUrl = () => {
  const isProduction = import.meta.env.PROD;
  return isProduction ? '/.netlify/functions' : '';
};

// Format API URL with proper base path in production
const formatApiUrl = (url: string) => {
  // If URL already starts with /.netlify/functions, don't modify it
  if (url.startsWith('/.netlify/functions')) {
    return url;
  }
  
  // If URL starts with /api, replace with /.netlify/functions in production
  if (url.startsWith('/api')) {
    const baseUrl = getApiBaseUrl();
    return baseUrl ? url.replace('/api', baseUrl) : url;
  }
  
  return url;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const formattedUrl = formatApiUrl(url);
  const res = await fetch(formattedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const formattedUrl = formatApiUrl(queryKey[0] as string);
    const res = await fetch(formattedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
