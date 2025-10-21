import { useState, useEffect, useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { lensClient } from '@/utils/lensClient'
import { evmAddress, SessionClient, Context, AccountMetadata } from '@lens-protocol/client'
import {
  currentSession,
  revokeAuthentication,
  fetchAccount,
  fetchAccountsAvailable
} from '@lens-protocol/client/actions'
import { CreatePost } from './CreatePost'
import CreateLensProfile from './CreateLensProfile'
import { EditProfile } from './EditLensProfile'
import { storageClient } from '@/utils/storageClient'
import { UserPostFeed } from './UserPostFeed'
import { CreateBeacon } from './CreateBeacon'
import SendBeam from './SendBeam'

type AuthStatus = 'idle' | 'checking' | 'signing' | 'loading' | 'error'

export function LensAuth() {
  const { address, status: walletStatus } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionClient, setSessionClient] = useState<SessionClient<Context> | null>(null)
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<AccountMetadata[]>([])
  const [selectedAccount, setSelectedAccount] = useState<AccountMetadata | null>(null)
  const [loadingAccountId, setLoadingAccountId] = useState<string | null>(null)
  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [activeTab, setActiveTab] = useState<'feed' | 'post' | 'beacon' | 'edit'>('feed')

  // Existing clear auth state function
  const clearAuthState = useCallback(() => {
    setIsAuthenticated(false)
    setSessionClient(null)
    setSelectedAccount(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('lens.session.storage')
      window.localStorage.removeItem('lens.selected.account')
    }
  }, [])

  // Existing wallet connection effect
  useEffect(() => {
    if (walletStatus !== 'connected') {
      clearAuthState()
    }
  }, [walletStatus, clearAuthState])

  const checkAccounts = useCallback(async () => {
    if (!address || walletStatus !== 'connected') {
      setAccounts([])
      return
    }

    setStatus('checking')
    setShowCreateProfile(false)

    try {
      const accountsResult = await fetchAccountsAvailable(lensClient, {
        managedBy: evmAddress(address),
        includeOwned: true
      })

      if (!accountsResult.isErr() && accountsResult.value?.items) {
        const accountPromises = accountsResult.value.items.map(async (item) => {
          const accountResult = await fetchAccount(lensClient, {
            address: item.account.address
          })

          if (!accountResult.isErr() && accountResult.value !== null) {
            const account = accountResult.value
            // console.log('Account data:', account)

            return {
              __typename: 'AccountMetadata' as const,
              attributes: account.metadata?.attributes || [],
              bio: account.metadata?.bio || null,
              coverPicture: account.metadata?.coverPicture || null,
              id: account.address,
              name: account.metadata?.name || null,
              picture: account.metadata?.picture || null,
              // Add additional fields from account data
              handle: account.username?.localName || null,
              score: account.score,
              createdAt: account.createdAt,
              isFollowedByMe: account.operations?.isFollowedByMe || false,
              isFollowingMe: account.operations?.isFollowingMe || false,
              isMutedByMe: account.operations?.isMutedByMe || false,
              isBlockedByMe: account.operations?.isBlockedByMe || false,
              owner: account.owner
            }
          }
          return null
        })

        const resolvedAccounts = (await Promise.all(accountPromises)).filter(
          (
            account
          ): account is AccountMetadata & {
            handle: string | null
            score: number
            createdAt: string
            isFollowedByMe: boolean
            isFollowingMe: boolean
            isMutedByMe: boolean
            isBlockedByMe: boolean
            owner: string
          } => account !== null
        )

        setAccounts(resolvedAccounts)
      }
      setStatus('idle')
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
      setError('Failed to fetch Lens accounts')
      setStatus('error')
    }
  }, [address, walletStatus])

  // Initial accounts check
  useEffect(() => {
    checkAccounts()
  }, [checkAccounts])

  // Handle successful profile creation
  const handleProfileCreated = async () => {
    setShowCreateProfile(false)
    await checkAccounts()
  }

  // Existing account selection handler
  const handleAccountSelect = async (account: AccountMetadata) => {
    if (!address) return
    setStatus('signing')
    setError(null)
    setSelectedAccount(account)
    setLoadingAccountId(account.id)

    try {
      // Try to resume existing session first
      const resumed = await lensClient.resumeSession()
      if (!resumed.isErr()) {
        setSessionClient(resumed.value)
        setIsAuthenticated(true)
        setStatus('idle')
        return
      }

      // If resume fails, create new session
      const loginParams = {
        accountOwner: {
          account: account.id,
          app: '0xe5439696f4057aF073c0FB2dc6e5e755392922e1',
          owner: evmAddress(address)
        }
      }

      const result = await lensClient.login({
        ...loginParams,
        signMessage: (message) => signMessageAsync({ message })
      })

      if (!result.isErr()) {
        setSessionClient(result.value)
        setIsAuthenticated(true)
        setSelectedAccount(account)
      } else {
        throw new Error(result.error.message)
      }
      setStatus('idle')
      setLoadingAccountId(null)
    } catch (error) {
      console.error('Login failed:', error)
      setError('Failed to login with Lens')
      setStatus('error')
      setSelectedAccount(null)
    }
  }

  // Existing logout handler
  const handleLogout = async () => {
    if (!sessionClient) return
    setStatus('loading')
    setError(null)

    try {
      const session = await currentSession(sessionClient)
      if (!session.isErr()) {
        const revokeResult = await revokeAuthentication(sessionClient, {
          authenticationId: session.value.authenticationId
        })

        if (revokeResult.isErr()) {
          console.error('Failed to revoke authentication:', revokeResult.error)
        }
      }
    } catch (error) {
      console.error('Logout operation failed:', error)
    } finally {
      clearAuthState()
      setStatus('idle')
      await checkAccounts()
    }
  }

  const isLoading = status === 'checking' || status === 'signing' || status === 'loading'

  if (walletStatus !== 'connected') {
    return null
  }

  // Show create profile view
  if (showCreateProfile) {
    return (
      <div className="lens-auth-container">
        <button onClick={() => setShowCreateProfile(false)} className="create-profile-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Account Selection
        </button>
        <CreateLensProfile onSuccess={handleProfileCreated} onError={(error) => setError(error.message)} />
      </div>
    )
  }

  return (
    <div className="lens-auth-container">
      {error && <p className="error-message">{error}</p>}

      {accounts.length > 0 && !selectedAccount && (
        <div className="account-selection-container">
          <h3 className="account-selection-title">Select your Lens account:</h3>
          <div className="account-list">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleAccountSelect(account)}
                className="account-button"
                disabled={isLoading}
              >
                {isLoading && account.id === loadingAccountId ? (
                  <div className="account-button-loading">
                    <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    {account?.picture && (
                      <img src={storageClient.resolve(account.picture)} alt="Profile" className="profile-image" />
                    )}
                    <div className="profile-details">
                      <div className="profile-name">{account?.name || 'Unnamed Account'}</div>
                      {/* @ts-ignore */}
                      {account.id && <div className="profile-handle">@{account.handle}</div>}
                      {account.bio && <div className="profile-bio">{account.bio}</div>}
                      <div className="profile-created-date">
                        {/* @ts-ignore */}
                        Created {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Create New Profile Button */}
          <button onClick={() => setShowCreateProfile(true)} className="create-profile-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Profile
          </button>
        </div>
      )}

      {isAuthenticated && selectedAccount && (
        <>
          <div className="authenticated-profile-container">
            <div className="authenticated-profile-header">
              {selectedAccount?.picture && (
                <img
                  src={storageClient.resolve(selectedAccount.picture)}
                  alt="Profile"
                  className="authenticated-profile-image"
                />
              )}
              <div>
                <div className="authenticated-profile-name">
                  {selectedAccount?.name || selectedAccount.id || 'Unnamed Account'}
                </div>
                {/* @ts-ignore */}
                <div className="authenticated-profile-id">@{selectedAccount.handle}</div>
              </div>

              <button onClick={handleLogout} disabled={isLoading} className="logout-button">
                {status === 'loading' ? (
                  <span className="account-button-loading">
                    <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging out...
                  </span>
                ) : (
                  'Logout from Lens'
                )}
              </button>
            </div>
            <div>
              <span className="authenticated-profile-id">Essence:</span> 3020
            </div>
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => setActiveTab('feed')}
              >
                My Beacons
              </button>
              <button
                className={`tab-button ${activeTab === 'beacon' ? 'active' : ''}`}
                onClick={() => setActiveTab('beacon')}
              >
                Create Beacon
              </button>
              <button
                className={`tab-button ${activeTab === 'post' ? 'active' : ''}`}
                onClick={() => setActiveTab('post')}
              >
                Send Beam
              </button>
              <button
                className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                Edit Profile
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'feed' && <UserPostFeed profileId={selectedAccount.id} />}

              {activeTab === 'beacon' && (
                <CreateBeacon
                  profileId={selectedAccount.id}
                  // @ts-ignore
                  handle={selectedAccount.handle}
                  onSuccess={() => console.log('Beacon created!')}
                  onError={(error) => console.error('Error:', error)}
                />
              )}

              {activeTab === 'post' && (
                <SendBeam
                  profileId={selectedAccount.id}
                  onSuccess={() => {
                    console.log('Post created successfully')
                  }}
                  onError={(error) => {
                    setError(error.message)
                  }}
                />
                /*<CreatePost
                  profileId={selectedAccount.id}
                  onSuccess={() => {
                    console.log('Post created successfully')
                  }}
                  onError={(error) => {
                    setError(error.message)
                  }}
                />*/
              )}

              {activeTab === 'edit' && (
                <EditProfile
                  currentProfile={{
                    name: selectedAccount.name,
                    bio: selectedAccount.bio,
                    id: selectedAccount.id
                  }}
                  onSuccess={checkAccounts}
                  onError={(error) => setError(error.message)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
