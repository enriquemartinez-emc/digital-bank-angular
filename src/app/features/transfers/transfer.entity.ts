export class TransferEntity {
  constructor(
    public id: string,
    public customerId: string,
    public fromAccountId: string,
    public toAccountId: string,
    public amount: number,
    public date: string
  ) {}

  static create(data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
  }): TransferEntity {
    return new TransferEntity(
      '',
      '',
      data.fromAccountId,
      data.toAccountId,
      data.amount,
      ''
    );
  }

  validate(): boolean {
    return (
      this.fromAccountId.trim().length > 0 &&
      this.toAccountId.trim().length > 0 &&
      this.fromAccountId !== this.toAccountId &&
      this.amount > 0
    );
  }
}
