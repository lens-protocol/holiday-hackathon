import { ConnectKitButton } from "connectkit";
// import { useAccount } from 'wagmi';

   
  export function WalletComponents() {
    // const account = useAccount();
    // const address = account.address;
    return (
      <div className="flex justify-end">
        <ConnectKitButton />
      </div>
    );
  }