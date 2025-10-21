'use client';

import {
  ConnectKitProvider,
} from 'connectkit';

export default function CustomConnectKitProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <ConnectKitProvider
      customTheme={{
        '--ck-connectbutton-font-size': '15px',
        '--ck-connectbutton-color': '#ffffff',
        '--ck-connectbutton-background': '#8000ff',
        '--ck-connectbutton-background-secondary': '#FFFFFF',
        '--ck-connectbutton-border-radius': '16px',
        '--ck-connectbutton-box-shadow': '0 0 0 0 #ffffff',
        '--ck-connectbutton-hover-color': '#373737',
        '--ck-connectbutton-hover-background': '#F0F2F5',
        '--ck-connectbutton-hover-box-shadow': '0 0 0 0 #ffffff',
        '--ck-connectbutton-active-color': '#373737',
        '--ck-connectbutton-active-background': '#EAECF1',
        '--ck-connectbutton-active-box-shadow': '0 0 0 0 #ffffff',
        '--ck-connectbutton-balance-color': '#373737',
        '--ck-connectbutton-balance-background': '#fff',
        '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px #F6F7F9',
        '--ck-connectbutton-balance-hover-background': '#F6F7F9',
        '--ck-connectbutton-balance-hover-box-shadow':
          'inset 0 0 0 1px #F0F2F5',
        '--ck-connectbutton-balance-active-background': '#F0F2F5',
        '--ck-connectbutton-balance-active-box-shadow':
          'inset 0 0 0 1px #EAECF1',
      }}
    >
      {children}
    </ConnectKitProvider>
  );
}
