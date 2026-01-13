interface UsernameNamespace {
  __typename: 'UsernameNamespace';
  address: string;
  createdAt: string;
  metadata: null;
  owner: string;
}

interface Username {
  __typename: 'Username';
  id: string;
  value: string;
  localName: string;
  linkedTo: string;
  ownedBy: string;
  timestamp: string;
  namespace: UsernameNamespace;
}

interface Account {
  __typename: 'Account';
  address: string;
  username: Username;
}

interface AccountManagerPermissions {
  __typename: 'AccountManagerPermissions';
  canExecuteTransactions: boolean;
  canSetMetadataUri: boolean;
  canTransferNative: boolean;
  canTransferTokens: boolean;
}

interface AccountOwned {
  __typename: 'AccountOwned';
  addedAt: string;
  account: Account;
}

interface AccountManaged {
  __typename: 'AccountManaged';
  addedAt: string;
  account: Account;
  permissions: AccountManagerPermissions;
}

interface PageInfo {
  __typename: 'PaginatedResultInfo';
  prev: null;
  next: null;
}

export interface AccountsResponse {
  items: (AccountOwned | AccountManaged)[];
  pageInfo: PageInfo;
}
