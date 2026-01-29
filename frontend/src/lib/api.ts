import { supabase } from './supabase';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = (rawApiUrl && rawApiUrl.startsWith('http'))
    ? rawApiUrl
    : 'http://localhost:8000/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return {};
    return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
    };
}

export const api = {
    async get(endpoint: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return response.json();
    },

    async post(endpoint: string, data: any) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API error: ${response.statusText}`);
        }
        return response.json();
    },

    async put(endpoint: string, data: any) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API error: ${response.statusText}`);
        }
        return response.json();
    },

    async delete(endpoint: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return response.json();
    },

    async downloadExport(entity: string, format: string = 'xlsx') {
        const headers = await getAuthHeaders();
        // Remove Content-Type for GET requests with blob response
        const { 'Content-Type': _, ...authHeaders } = headers;

        const response = await fetch(`${API_BASE_URL}/export/${entity}?format=${format}`, {
            method: 'GET',
            headers: authHeaders,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Export error: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = `${entity}_${new Date().toISOString().split('T')[0]}.${format}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    async uploadFile(entity: string, file: File) {
        const headers = await getAuthHeaders();
        // Remove Content-Type to let the browser set it with the boundary for multipart
        const { 'Content-Type': _, ...authHeaders } = headers;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload/${entity}`, {
            method: 'POST',
            headers: authHeaders,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Upload error: ${response.statusText}`);
        }

        return response.json();
    },
};
