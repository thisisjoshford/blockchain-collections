import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)
  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()
  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getData'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['setData'],
  })
}

export async function onSubmit(event) {
  event.preventDefault()
  const { fieldset, greeting } = event.target.elements

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true

  try {
    await contract.setData({
      message: greeting.value
    })
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  } finally {
    // re-enable the form, whether the call succeeded or failed
    fieldset.disabled = false
  }
}

export function logout() {
  window.walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName)
}
