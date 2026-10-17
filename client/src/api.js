export const token = {
  get: () => localStorage.getItem('jt_token'),
  set: (t) => localStorage.setItem('jt_token', t),
  clear: () => localStorage.removeItem('jt_token'),
};

async function request(path, { method = 'GET', body } = {}) {
  const t = token.get();
  const res = await fetch(`/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(t && { Authorization: `Bearer ${t}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),
  listJobs: () => request('/jobs'),
  createJob: (body) => request('/jobs', { method: 'POST', body }),
  updateJob: (id, body) => request(`/jobs/${id}`, { method: 'PUT', body }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
};
