import styled from '@emotion/styled';

// Add base font styles to all components
const baseFont = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 0.875rem;
`;

export const InvoiceContainer = styled.div`
  ${baseFont}
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const InvHeader = styled.h2`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
`;

export const BillingSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  gap: 4rem;
`;

export const BillingColumn = styled.div<{ align?: 'right' | 'left' }>`
  flex: 1;
  text-align: ${props => props.align || 'left'};
`;

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

export const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  background: transparent;
  transition: border-color 0.2s;
  font-size: 0.875rem;
  color: #1f2937;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const Separator = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 1.5rem 0;
`;

export const LinesSection = styled.div`
  margin-bottom: 2rem;
`;

export const LinesSectionTitle = styled.h3`
  font-size: 0.875rem;
  font-style: italic;
  color: #6b7280;
  margin-bottom: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;

  &.right {
    text-align: right;
  }
`;

export const TableCell = styled.td`
  padding: 0.75rem 1rem;
  vertical-align: top;

  &.right {
    text-align: right;
  }
`;

export const TableInputGroup = styled.div`
  margin-bottom: 0;
`;

export const TableLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const TableInput = styled.input`
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  background: transparent;
  transition: border-color 0.2s;
  font-size: 0.875rem;
  color: #1f2937;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &.text-right {
    text-align: right;
  }
`;

export const TotalsSection = styled.div`
  width: 18rem;
  margin-left: auto;
  margin-top: 2rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  
  &.final {
    border-top: 1px solid #e5e7eb;
    margin-top: 0.5rem;
    padding-top: 1rem;
    font-weight: 500;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

// Common button styles
const buttonBase = `
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const BackButton = styled.button`
  ${buttonBase}
`;

export const SaveButton = styled.button<{ fullWidth?: boolean }>`
  ${buttonBase}
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-top: ${props => props.fullWidth ? '1rem' : '0'};
`;

export const CompanyInfo = styled.div`
  color: #4b5563;
  line-height: 1.5;

  p {
    margin: 0.25rem 0;
  }

  .company-name {
    font-weight: 500;
    color: #1f2937;
  }
`;

export const DeleteButton = styled.button`
  padding: 0.5rem;
  color: #6b7280;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;

  &:hover {
    color: #ef4444;
    background: #fee2e2;
  }
`;

export const TableRow = styled.tr`
  position: relative;

  &:hover button {
    opacity: 1;
  }
`;

export const DeleteCell = styled.td`
  width: 48px;
  padding: 0.75rem 0.5rem;
  vertical-align: top;
`;

// Add new line button
export const AddLineButton = styled.button`
  ${buttonBase}
  margin: 1rem 0;
  width: 100%;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

// Add these new styled components
export const PageContainer = styled.div`
  ${baseFont}
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  ${baseFont}
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const TableHeaderRow = styled.tr`
  background: #f3f4f6;
`;

export const ListTableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;

  &.right {
    text-align: right;
  }
`;

export const ListTableRow = styled.tr`
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ListTableCell = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;

  &.right {
    text-align: right;
  }
`;

export const StatusBadge = styled.span<{ status: 'processed' | 'pending' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  ${props => props.status === 'processed' 
    ? 'background: #d1fae5; color: #047857;'
    : 'background: #fef3c7; color: #b45309;'}
`; 