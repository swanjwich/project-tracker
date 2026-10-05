import axios from 'axios';

const client = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

// Session expired (401) or CSRF token stale (419): reload, and the auth middleware
// sends the user to the login page, then back here after they sign in.
client.interceptors.response.use(undefined, (error) => {
    if ([401, 419].includes(error.response?.status)) {
        window.location.reload();
    }

    return Promise.reject(error);
});

export const getProjects = (params = {}) =>
    client.get('/projects', {params}).then((res) => res.data);

export const createProject = (data) =>
    client.post('/projects', data).then((res) => res.data.data);

export const updateProject = (id, data) =>
    client.put(`/projects/${id}`, data).then((res) => res.data.data);

export const deleteProject = (id) => client.delete(`/projects/${id}`);

// Turns a 422 response into { field: 'first message' } for the form.
export function validationErrors(error) {
    const errors = error.response?.status === 422 ? error.response.data.errors : null;

    if (!errors) return null;

    return Object.fromEntries(
        Object.entries(errors).map(([field, messages]) => [field, messages[0]]),
    );
}
