import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react'
import { login, logout, onSubmit } from './utils'
import './global.css'

import getConfig from './config'
import { fetchStorage } from './api'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  const [data, setData] = useState()
  const [storage, setStorage] = useState()
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(
    () => {
      setStorage(fetchStorage('dev-1595921278956-5615156', 'testnet'))
    },
    []
  )

  console.log(storage);
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects
          to a test network ("testnet") wallet. This works just like the main
          network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
          convertible to other currencies – they're just for testing!
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
          </label>
          {' '}
          {window.accountId}!
        </h1>
        <form onSubmit={async event => {
          const newKey = event.target.elements.key.value
          const newValue = event.target.elements.value.value
          await onSubmit(event)

          // update local `greeting` variable to match persisted value
          setData(newKey, newValue)

          // show Notification
          setShowNotification(true)

          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            setShowNotification(false)
          }, 11000)
        }}>
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em'
              }}
            >
              Contract Data Entry:
            </label>
            <div style={{ display: 'flex' }}>
              <input
                autoComplete="off"
                defaultValue="key"
                id="key"
                onChange={e => setButtonDisabled(e.target.value === key)}
                style={{ flex: 1 }}
              />             
              <input
                autoComplete="off"
                defaultValue="value"
                id="value"
                onChange={e => setButtonDisabled(e.target.value === value)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Save
              </button>
            </div>
          </fieldset>
        </form>
      </main>
      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '}
      called method: 'setGreeting' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
