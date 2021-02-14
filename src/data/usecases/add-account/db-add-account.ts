import { AccountModel, AddAccount, AddAccountModel, AddAccountRepo, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepo: AddAccountRepo

  constructor (encrypter: Encrypter, addAccountRepo: AddAccountRepo) {
    this.encrypter = encrypter
    this.addAccountRepo = addAccountRepo
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepo.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
