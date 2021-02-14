import { AccountModel, AddAccount, AddAccountModel, AddAccountRepo, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepo: AddAccountRepo

  constructor (encrypter: Encrypter, addAccountRepo: AddAccountRepo) {
    this.encrypter = encrypter
    this.addAccountRepo = addAccountRepo
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const mountedAccount = {
      ...account,
      password: hashedPassword
    }
    await this.addAccountRepo.add(mountedAccount)
    return new Promise(resolve => resolve(null))
  }
}
