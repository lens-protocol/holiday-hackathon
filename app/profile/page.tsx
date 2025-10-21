'use client'

import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { LensAuth } from '../components/LensAuth'

function App() {
  const account = useAccount()
  // console.log('App component wallet status:', account)

  return (
    <div className="app-container">
      {account.status !== 'connected' && (
        <div className="lens-app-section">
          <h3 className="lens-app-title">Welcome!</h3>
          <p>Please connect a wallet on the Lens Network Sepolia Testnet</p>
          <ConnectKitButton />
        </div>
      )}

      {account.status === 'connected' && (
        <div className="lens-app-section">
          <h2 className="lens-app-title">NSI :: Test</h2>
          <LensAuth />
        </div>
      )}
    </div>
  )
}

export default App
