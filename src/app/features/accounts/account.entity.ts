export class AccountEntity {
  constructor(
    public id: string,
    public customerId: string,
    public accountNumber: string,
    public balance: number
  ) {}

  static create(data: {
    customerId: string;
    accountNumber: string;
    initialBalance: number;
  }): AccountEntity {
    return new AccountEntity(
      '',
      data.customerId,
      data.accountNumber,
      data.initialBalance
    );
  }

  validate(): boolean {
    return (
      this.customerId.trim().length > 0 &&
      this.accountNumber.trim().length > 0 &&
      this.balance >= 0
    );
  }
}
