-- Invoice Headers table
create table invoice_headers (
  Id uuid primary key default uuid_generate_v4(),
  InvoiceNumber varchar not null,
  VendorName varchar not null,
  InvoiceDate date not null,
  TotalAmount decimal(10,2) not null,
  IsProcessed boolean default false,
  CreatedAt timestamp with time zone default now(),
  UpdatedAt timestamp with time zone default now()
);

-- Invoice Lines table
create table invoice_lines (
  Id uuid primary key default uuid_generate_v4(),
  HeaderId uuid references invoice_headers(Id),
  Description varchar not null,
  Quantity decimal(10,2) not null,
  UnitPrice decimal(10,2) not null,
  LineAmount decimal(10,2) not null,
  CreatedAt timestamp with time zone default now()
); 