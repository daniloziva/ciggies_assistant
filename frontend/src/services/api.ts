const API_URL = 'http://localhost:5000/api';

export const api = {
  getInvoices: async () => {
    const response = await fetch(`${API_URL}/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  getInvoice: async (id: string) => {
    const response = await fetch(`${API_URL}/invoices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  },

  updateInvoice: async (id: string, data: { Invoice: any, InvoiceLines: any[] }) => {
    const response = await fetch(`${API_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update invoice');
    return response.json();
  },

  deleteInvoice: async (id: string) => {
    const response = await fetch(`${API_URL}/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete invoice');
    return response.json();
  },
}; 