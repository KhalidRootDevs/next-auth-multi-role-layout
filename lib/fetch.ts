type Options = {
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  token?: string;
  formData?: Record<string, any>;
  multipart?: boolean;
  customHeaders?: Record<string, string>;
  tags?: string[];
  revalidate?: number;
};

export type APIResponse = {
  status: 'SUCCESS' | 'ERROR';
  status_code?: number;
  data?: any;
  message?: string;
  pagination?: {
    totalDocs: number;
    totalPage: number;
    page: number;
    limit: number;
  };
  errors?: [{ field: string; message: string }];
};

export default async function fetchData(
  path: string,
  options?: Options
): Promise<APIResponse> {
  const base =
    process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
  const apiKey =
    process.env.X_API_KEY ?? process.env.NEXT_PUBLIC_X_API_KEY ?? '';

  const headers: HeadersInit = {
    'x-api-key': apiKey,
    ...(options?.token && { Authorization: `Bearer ${options.token}` }),
    ...options?.customHeaders
  };

  let body: BodyInit | null = null;

  if (options?.formData) {
    if (options.multipart) {
      body = convertToFormData(options.formData); // Use the universal converter
    } else {
      body = JSON.stringify(options.formData);
      headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const fetchOptions: RequestInit & {
      next?: { revalidate?: number; tags?: string[] };
    } = {
      method: options?.method || 'GET',
      headers,
      credentials: 'include'
    };

    // Include body only for non-GET requests
    if (
      body &&
      options?.method &&
      options.method !== 'GET' &&
      options.method !== 'HEAD'
    ) {
      fetchOptions.body = body;
    }

    const nextOptions = {
      ...(options?.revalidate !== undefined && {
        revalidate: options.revalidate
      }),
      ...(options?.tags?.length && { tags: options.tags })
    };

    if (Object.keys(nextOptions).length > 0) {
      fetchOptions.next = nextOptions;
    }

    const response = await fetch(`${base}${path}`, fetchOptions);

    return await response.json();
  } catch (e) {
    console.error(e);
    return {
      status: 'ERROR',
      message: 'Something went wrong',
      data: []
    };
  }
}

function convertToFormData(
  data: Record<string, any>,
  formData = new FormData(),
  parentKey = ''
): FormData {
  // Handle null/undefined
  if (data === null || data === undefined) {
    return formData;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const currentKey = parentKey ? `${parentKey}[${index}]` : `${index}`;

      if (
        typeof item === 'object' &&
        item !== null &&
        !(item instanceof Blob)
      ) {
        // Recursively process objects in arrays
        convertToFormData(item, formData, currentKey);
      } else {
        // Handle primitives, Blobs (Files), etc.
        formData.append(currentKey, item);
      }
    });
  }
  // Handle plain objects (excluding Files/Blobs)
  else if (typeof data === 'object' && !(data instanceof Blob)) {
    Object.keys(data).forEach((key) => {
      const currentKey = parentKey ? `${parentKey}[${key}]` : key;
      convertToFormData(data[key], formData, currentKey);
    });
  }
  // Handle primitives (string, number, boolean, File/Blob)
  else {
    if (data !== null && data !== undefined) {
      formData.append(parentKey, data);
    }
  }

  return formData;
}
