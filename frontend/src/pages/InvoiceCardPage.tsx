import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { InvoiceHeader, InvoiceLine } from '../../../backend/src/types/invoice';
import {
  InvoiceContainer,
  BillingSection,
  BillingColumn,
  SectionTitle,
  InputGroup,
  Label,
  Input,
  Separator,
  LinesSection,
  LinesSectionTitle,
  Table,
  TableHeader,
  TableCell,
  TotalsSection,
  TotalRow,
  CompanyInfo,
  TopBar,
  BackButton,
  SaveButton,
  InvHeader as StyledInvoiceHeader,
  DeleteButton,
  TableRow,
  DeleteCell,
  AddLineButton,
  PageContainer,
  LargeStatusBadge
} from '../styles/InvoiceStyles';
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export const InvoiceCardPage = () => {
  const { Id } = useParams();
  const Navigate = useNavigate();
  const [Invoice, setInvoice] = useState<InvoiceHeader | null>(null);
  const [InvoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [IsSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (Id) {
      fetchInvoice();
    }
  }, [Id]);

  const fetchInvoice = async () => {
    try {
      setIsLoading(true);
      const { HeaderData, LinesData } = await api.getInvoice(Id!);
      setInvoice(HeaderData);
      setInvoiceLines(LinesData);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderChange = (field: keyof InvoiceHeader, value: any) => {
    if (Invoice) {
      setInvoice({ ...Invoice, [field]: value });
    }
  };

  const handleLineChange = (index: number, field: keyof InvoiceLine, value: any) => {
    const newLines = [...InvoiceLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setInvoiceLines(newLines);
  };

  const handleDeleteLine = (index: number) => {
    const newLines = [...InvoiceLines];
    newLines.splice(index, 1);
    setInvoiceLines(newLines);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.updateInvoice(Id!, {
        Invoice,
        InvoiceLines
      });
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLine = () => {
    const newLine: InvoiceLine = {
      lineno: InvoiceLines.length + 1,
      header_id: Id || '',
      no: '',
      description: '',
      price: 0,
      qty: 1,
      discount: 0,
      lineamount: 0,
      uom: '',
      vatpercent: 10,
      no_mapped: '',
      desc_mapped: '',
      vatamount: 0,
    };
    setInvoiceLines([...InvoiceLines, newLine]);
  };
  
  const handleCancelSend = async () => {
    if (!Invoice) return;
    try {
      setIsSaving(true);
      
      const UpdatedInvoice = {...Invoice, status: 'cancelled'};
      await api.updateInvoice(Id!, {
        Invoice: UpdatedInvoice,
        InvoiceLines: InvoiceLines
      });
      setInvoice(UpdatedInvoice);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (IsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!Invoice) {
    return (
      <div className="text-center p-6">Faktura nije pronađena</div>
    );
  }

  return (
    <PageContainer>
      <InvoiceContainer>
        <TopBar>
          <BackButton onClick={() => Navigate('/')}>
            ← Nazad na listu
          </BackButton>
          <SaveButton onClick={handleSave} disabled={IsSaving}>
            {IsSaving ? 'Čuvanje...' : 'Sačuvaj promene'}
          </SaveButton>
        </TopBar>

        <StyledInvoiceHeader>FAKTURA {Invoice.invoicenumber}</StyledInvoiceHeader>

        <BillingSection>
          <BillingColumn>
            <InputGroup>
              <Label>Datum fakture</Label>
              <Input
                type="date"
                value={Invoice.invoicedate}
                onChange={(e) => handleHeaderChange('invoicedate', e.target.value)}
              />
            </InputGroup>
            
            <SectionTitle>Dobavljač:</SectionTitle>
            <InputGroup>
              <Label>Naziv dobavljača</Label>
              <Input
                type="text"
                value={Invoice.vendorname}
                onChange={(e) => handleHeaderChange('vendorname', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Broj dobavljača</Label>
              <Input
                type="text"
                value={Invoice.vendorno}
                onChange={(e) => handleHeaderChange('vendorno', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Matični broj</Label>
              <Input
                type="text"
                value={Invoice.registrationno}
                onChange={(e) => handleHeaderChange('registrationno', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>PIB</Label>
              <Input
                type="text"
                value={Invoice.vatno}
                onChange={(e) => handleHeaderChange('vatno', e.target.value)}
              />
            </InputGroup>
          </BillingColumn>

          <BillingColumn align="right">
            <LargeStatusBadge 
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
            </LargeStatusBadge>
            {Invoice.status === 'ready' && (
              <button onClick={handleCancelSend} style={{ marginLeft: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem' }}>
                <FiX /> Poništi
              </button>
            )}
            <SectionTitle style={{ marginTop: '1rem' }}>Preduzeće:</SectionTitle>
            <CompanyInfo>
              <p className="company-name">RIZOTO BAR DOO</p>
              <p>Svetozara Markovića 36</p>
              <p>PIB: 113436605</p>
              <p>MB: 113436605</p>
            </CompanyInfo>
          </BillingColumn>
        </BillingSection>

        <LinesSection>
          <LinesSectionTitle>Stavke</LinesSectionTitle>
          <Separator />
          
          <Table>
            <thead>
              <tr>
                <TableHeader style={{ width: '48px' }}></TableHeader>
                <TableHeader style={{ width: '30%' }}>Opis</TableHeader>
                <TableHeader>Šifra artikla</TableHeader>
                <TableHeader>Cena</TableHeader>
                <TableHeader>Količina</TableHeader>
                <TableHeader>Popust %</TableHeader>
                <TableHeader>PDV %</TableHeader>
                <TableHeader>Iznos PDV</TableHeader>
                <TableHeader>Ukupno</TableHeader>
              </tr>
            </thead>
            <tbody>
              {InvoiceLines.map((line, index) => (
                <TableRow key={line.lineno}>
                  <DeleteCell>
                    <DeleteButton
                      onClick={() => handleDeleteLine(index)}
                      title="Delete line"
                    >
                      <FiTrash2 size={16} />
                    </DeleteButton>
                  </DeleteCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="text"
                        value={line.description}
                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                        placeholder="Enter description"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="text"
                        value={line.no}
                        onChange={(e) => handleLineChange(index, 'no', e.target.value)}
                        placeholder="Enter item no"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="number"
                        value={line.price}
                        onChange={(e) => handleLineChange(index, 'price', parseFloat(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => handleLineChange(index, 'qty', parseFloat(e.target.value))}
                        className="text-right"
                        placeholder="0"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="number"
                        value={line.discount}
                        onChange={(e) => handleLineChange(index, 'discount', parseFloat(e.target.value))}
                        className="text-right"
                        placeholder="0"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="number"
                        value={line.vatpercent}
                        onChange={(e) => handleLineChange(index, 'vatpercent', parseFloat(e.target.value))}
                        className="text-right"
                        placeholder="0"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="number"
                        value={line.vatamount}
                        onChange={(e) => handleLineChange(index, 'vatamount', parseFloat(e.target.value))}
                        className="text-right"
                        placeholder="0"
                      />
                    </InputGroup>
                  </TableCell>
                  <TableCell className="right">
                    <InputGroup>
                      <Input
                        type="number"
                        value={line.lineamount}
                        onChange={(e) => handleLineChange(index, 'lineamount', parseFloat(e.target.value))}
                        className="font-medium pt-2"
                        placeholder="0"
                      />
                    </InputGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <AddLineButton onClick={handleAddLine}>
            <FiPlus size={16} />
            Novi red
          </AddLineButton>
        </LinesSection>

        <TotalsSection>
          <TotalRow>
            <span>Vrednost bez poreza</span>
            <span>{Invoice.totalamount?.toFixed(2) || '0.00'}</span>
          </TotalRow>
          <TotalRow>
            <span>PDV</span>
            <span>{(Invoice.totalamount * 0.05)?.toFixed(2) || '0.00'}</span>
          </TotalRow>
          <TotalRow className="final">
            <span>Ukupno sa porezom</span>
            <span>{(Invoice.totalamount * 1.05)?.toFixed(2) || '0.00'}</span>
          </TotalRow>
          
          <div className="flex flex-col gap-2">
            <SaveButton 
              onClick={async () => {
                // await handleSave();
                const UpdatedInvoice = {...Invoice, status: 'ready'};
                await api.updateInvoice(Id!, {
                  Invoice: UpdatedInvoice,
                  InvoiceLines: InvoiceLines
                });
                setInvoice(UpdatedInvoice);
              }} 
              disabled={IsSaving} 
              fullWidth
            >
              Potvrdi za slanje
            </SaveButton>
          </div>
        </TotalsSection>
      </InvoiceContainer>
    </PageContainer>
  );
};