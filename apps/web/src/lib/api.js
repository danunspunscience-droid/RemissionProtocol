export const api = {
  get: async (endpoint) => {
    const res = await fetch(endpoint);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to fetch');
    }
    return res.json();
  },
  post: async (endpoint, data) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to post');
    }
    return res.json();
  },
  put: async (endpoint, data) => {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to put');
    }
    return res.json();
  },
  delete: async (endpoint) => {
    const res = await fetch(endpoint, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete');
    }
    return res.json();
  },
  postForm: async (endpoint, formData) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to post form');
    }
    return res.json();
  },
  putForm: async (endpoint, formData) => {
    const res = await fetch(endpoint, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to put form');
    }
    return res.json();
  },
};