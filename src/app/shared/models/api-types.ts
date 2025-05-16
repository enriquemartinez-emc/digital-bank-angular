export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateCustomerCommand {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Account {
  id: string;
  customerId: string;
  accountNumber: string;
  balance: number;
}

export interface AccountData {
  accountNumber: string;
  initialBalance: number;
}

export interface CreateAccountCommand {
  accountNumber: string;
  initialBalance: number;
}

export interface Transfer {
  id: string;
  customerId: string;
  fromAccountId: string;
  toAccountId: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  fromCustomerFullName: string;
  toCustomerFullName: string;
  amount: number;
  createdAt: string;
}

export interface CreateTransferCommand {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}
