export class CustomerEntity {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string
  ) {}

  static create(data: {
    firstName: string;
    lastName: string;
    email: string;
  }): CustomerEntity {
    return new CustomerEntity('', data.firstName, data.lastName, data.email);
  }

  validate(): boolean {
    return (
      this.firstName.trim().length > 0 &&
      this.lastName.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    );
  }
}
