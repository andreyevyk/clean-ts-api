import { Encrypter, AccountModel, AddAccountModel } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepo } from '../../protocols/add-account-repo'

const makeAddAccountRepo = (): AddAccountRepo => {
  class AddAccountRepoStub implements AddAccountRepo {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepoStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})
interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepoStub: AddAccountRepo
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepoStub = makeAddAccountRepo()
  const sut = new DbAddAccount(encrypterStub, addAccountRepoStub)

  return {
    sut,
    encrypterStub,
    addAccountRepoStub
  }
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
  test('Should call Encripter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepo with correct values', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepoStub, 'add')

    const accountData = makeFakeAccountData()
    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepo', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    jest.spyOn(addAccountRepoStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = makeFakeAccountData()
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)

    expect(account).toEqual(makeFakeAccount())
  })
})
