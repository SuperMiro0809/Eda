// ----------------------------------------------------------------------

export type LaravelErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function extractErrorMessage(error: unknown): string {
  // The axios interceptor returns error.response.data directly
  if (error && typeof error === 'object') {
    const data = error as LaravelErrorResponse;

    // Laravel validation errors
    if (data.errors) {
      const firstError = Object.values(data.errors)[0];
      return firstError?.[0] || data.message || 'Validation failed';
    }

    // General Laravel error message
    if (data.message) {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An error occurred';
}

export function extractAllErrors(error: unknown): string[] {
  if (error && typeof error === 'object') {
    const data = error as LaravelErrorResponse;

    if (data.errors) {
      return Object.values(data.errors).flat();
    }

    if (data.message) {
      return [data.message];
    }
  }

  return [extractErrorMessage(error)];
}
