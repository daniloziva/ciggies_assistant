import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { InvoiceHeader } from '../types/invoice';
import {
  PageContainer,
  PageHeader,
  Title,
  TableContainer,
  StyledTable,
  TableHeaderRow,
  ListTableHeader,
  ListTableRow,
  ListTableCell,
  StatusBadge,
  SaveButton
} from '../styles/InvoiceStyles';

export const InvoiceListPage = () => {
  const [Invoices, setInvoices] = useState<InvoiceHeader[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoice_header')
        .select('*')
        .order('invoicedate', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAll = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('invoice_header')
        .update({ status: 'sent' })
        .eq('status', 'ready');

      if (error) throw error;
      
      // Refresh the invoices list
      await fetchInvoices();
    } catch (error) {
      console.error('Error sending invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Računi</Title>
        <div className="text-sm text-gray-500">
          {Invoices.length} {Invoices.length === 1 ? 'račun' : 'računa'} ukupno
        </div>
      </PageHeader>
      
      {IsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <TableHeaderRow>
                <ListTableHeader>Broj računa</ListTableHeader>
                <ListTableHeader>Broj dobavljača</ListTableHeader>
                <ListTableHeader>Naziv dobavljača</ListTableHeader>
                <ListTableHeader>Matični broj</ListTableHeader>
                <ListTableHeader>PIB</ListTableHeader>
                <ListTableHeader>Datum</ListTableHeader>
                <ListTableHeader className="right">Iznos</ListTableHeader>
                <ListTableHeader>Status</ListTableHeader>
              </TableHeaderRow>
            </thead>
            <tbody>
              {Invoices.map((Invoice) => (
                <ListTableRow 
                  key={Invoice.id}
                  onClick={() => Navigate(`/invoices/${Invoice.id}`)}
                >
                  <ListTableCell>{Invoice.invoicenumber}</ListTableCell>
                  <ListTableCell>{Invoice.vendorno}</ListTableCell>
                  <ListTableCell>{Invoice.vendorname}</ListTableCell>
                  <ListTableCell>{Invoice.registrationno}</ListTableCell>
                  <ListTableCell>{Invoice.vatno}</ListTableCell>
                  <ListTableCell>
                    {new Date(Invoice.invoicedate).toLocaleDateString('sr-RS', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </ListTableCell>
                  <ListTableCell className="right">
                    {Invoice.totalamount 
                      ? parseFloat(Invoice.totalamount.toString()).toLocaleString('sr-RS', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      : '0,00'
                    } RSD
                  </ListTableCell>
                  <ListTableCell>
                    <StatusBadge status={Invoice.status === 'new' ? 'pending' : 'processed'}>
                      {Invoice.status === 'new' ? 'Novo' : Invoice.status === 'ready' ? 'Spremno za slanje' : ''}
                    </StatusBadge>
                  </ListTableCell>
                </ListTableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}

<div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <SaveButton 
          onClick={handleSendAll}
          disabled={IsLoading}
          style={{ width: '200px' }}
        >
          Pošalji sve spremne
        </SaveButton>
      </div>
    </PageContainer>
  );
}; 