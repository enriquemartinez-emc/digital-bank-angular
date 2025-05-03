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

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}
