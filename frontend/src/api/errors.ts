type ApiErrorLike = {
  response?: {
    data?: {
      error?: unknown;
      details?: unknown;
      errors?: Record<string, unknown>;
    };
  };
  message?: unknown;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiErrorLike;
  const data = apiError.response?.data;

  if (typeof data?.error === 'string') {
    return data.error;
  }

  if (typeof data?.details === 'string') {
    return data.details;
  }

  if (data?.errors) {
    const messages = Object.values(data.errors).filter(
      (value): value is string => typeof value === 'string' && value.length > 0
    );

    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  if (typeof apiError.message === 'string' && apiError.message.length > 0) {
    return apiError.message;
  }

  return fallback;
}
