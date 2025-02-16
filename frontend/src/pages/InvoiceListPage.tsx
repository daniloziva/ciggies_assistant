import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { InvoiceHeader } from '../../../backend/src/types/invoice';
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
  SaveButton,
  MenuContainer,
  MenuButton,
  MenuDropdown,
  MenuItem,
} from '../styles/InvoiceStyles';
import { FiPlus, FiMoreVertical, FiTrash2 } from 'react-icons/fi';


export const InvoiceListPage = () => {
  const [Invoices, setInvoices] = useState<InvoiceHeader[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();
  const [ActiveMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await api.getInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAll = async () => {
    try {
      // TODO: Send all invoices
      
      // Refresh the invoices list
      await fetchInvoices();
    } catch (error) {
      console.error('Error sending invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (InvoiceId: string) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj račun?')) {
      return;
    }

    try {
      await api.deleteInvoice(InvoiceId);
      // Refresh the list after deletion
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
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
                <ListTableHeader style={{ width: '48px' }}></ListTableHeader>
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
                  <ListTableCell style={{ width: '48px' }}>
                    <MenuContainer>
                      <MenuButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(ActiveMenu === Invoice.id ? null : Invoice.id);
                        }}
                      >
                        <FiMoreVertical />
                      </MenuButton>
                      {ActiveMenu === Invoice.id && (
                        <MenuDropdown>
                          <MenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(Invoice.id);
                            }}
                          >
                            <FiTrash2 /> Obriši
                          </MenuItem>
                        </MenuDropdown>
                      )}
                    </MenuContainer>
                  </ListTableCell>
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
                    <StatusBadge 
                      status={
                        Invoice.status === 'new' 
                          ? 'pending' 
                          : Invoice.status === 'cancelled' 
                            ? 'cancelled' 
                            : 'processed'
                      }
                    >
                      {Invoice.status === 'new' 
                        ? 'Novo' 
                        : Invoice.status === 'ready' 
                          ? 'Za slanje' 
                          : Invoice.status === 'cancelled' 
                            ? 'Poništeno'
                            : ''}
                    </StatusBadge>
                  </ListTableCell>
                </ListTableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}

      <div style={{ 
        marginTop: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <SaveButton 
          onClick={() => {/* handle upload */}}
          style={{ width: '200px' }}
        >
          <FiPlus style={{ marginRight: '0.5rem' }} />
          Dodaj novu fakturu
        </SaveButton>

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