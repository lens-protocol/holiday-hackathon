// MintApp.tsx
import { useState } from "react";
import { useAccount } from "wagmi";
import { simulateContract, writeContract } from "@wagmi/core";
import { abi } from "../abi";
import ImageGenerator from "./ImageGenerator";
import TabBar from "../Tabbar/TabBar";
import "./MintApp.css";
import GeneratedModal from "../Modal/GeneratedModal/GeneratedModal";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import AppTheme from "../theme/AppTheme";
// import DismissibleAlert from "../DismissibleAlert";
import logo from "../images/logo-mini.svg";
import { config } from "./wagmi";
import MintResult from "../Modal/MintResult/MintResult";
import LoadingModal from "../Modal/LoadingModal/LoadingModal"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const MintContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function MintApp(props: { disableCustomTheme?: boolean }) {
  const account = useAccount();
  // const { connectors, connect, status, error } = useConnect();
  // const { disconnect } = useDisconnect();
  // const { writeContract } = useWriteContract();
  // const [alert, setAlert] = useState<{ type: 'success' | 'info' | 'warning' | 'error'; message: string } | null>(null);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDREESS;
  const [uri, setUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string>('');

  const [openSucccessModal, setOpenSucccessModal] = useState(false); // Manage the open state in the parent
  const [mintResultName, setMintResultName] = useState('');
  const [mintResultQuantity, setMintResultQuantite] = useState(1);
  const [mintResultIsListed, setMintResultIsListed] = useState<boolean | null>(null);


  const [loading, setOnLoading] = useState(''); // Manage the open state in the parent


  async function submit(name: string, quantity: number, uri: string, description: string){

    console.log("Minting " +"contractAddress " + contractAddress +"quantity " + quantity +"account address " + account.address +"name " + name +"description " + description +"uri " + uri +"abi " + abi)

    try {


      const { request } = await simulateContract(config, {
        abi,
        address: contractAddress,
        functionName: "createNFTContract",
        args: [name, "symbol", BigInt(quantity), uri, description],
      });

      // Proceed to write the contract if simulation succeeded
      console.log("Simulation succeeded, proceeding with transaction.");
      const hash = await writeContract(config, request);

      // Optionally, you can wait for the transaction receipt if needed
      console.log("Transaction sent, hash:", hash);
      showMintResult(name, quantity, null)
      setUri(null);
      setBase64Image("");
    } catch (error) {
      console.error("Error writing contract:", error);
    }

  }

  const handleSetImage = (uri: string, image: string) => {
    setBase64Image(image);
    setUri(uri);
  }

  const onSetQunatity = async (quantityy: number, name: string, description: string) => {


    if (!uri) {
      console.error("No URI set");
      return;
    }

    if (!account.address) {
      console.error("No account connected");
      return;
    }

    console.log("on mint processwith qunatity: "+ quantityy);
    // setAlert({ type: "success", message: "Minted Successfully" })
    try {
       await submit(name, quantityy, uri, description);
    } catch (e) {
      console.error("Error in payment process:", e);
    }
  }






  const submitSell = async (price: number, quantity: number, uri: string
    , name: string, description: string, symbol: string) => {
    if (!uri) {
      console.error("No URI set");
      return;
    }

    if (!account) {
      console.error("No account connected");
      return;
    }

    try {
      const valueInWei = BigInt(Math.floor(price * 10 ** 18));
      console.log("valueInWei " + valueInWei)

      const { request } = await simulateContract(config, {
        abi,
        address: contractAddress,
        functionName: "sellNFT",
        args: [name, symbol, description, uri, valueInWei],
      });

      // Proceed to write the contract if simulation succeeded
      console.log("Simulation succeeded, proceeding with transaction.");
      const hash = await writeContract(config, request);

      // Optionally, you can wait for the transaction receipt if needed
      console.log("Transaction sent, hash:", hash);
      showMintResult(name, quantity, true)
      setUri(null);
      setBase64Image("");
      
      // Show success modal or notification if needed
    } catch (error) {
      console.error("Error writing contract:", error);
    }
  };


// fix it
  const onSetSellNFT = async (price: number, name: string, description: string) => {
    console.log("on sell with " + " price: " + price + " name: " + name + " description: " + description);

    if (!uri) {
      console.error("No URI set");
      return;
    }

    try {
      await submitSell(price, 1, uri, name, description, "SSSB");
    } catch (e) {
      console.error("Error in payment process:", e);
    }
  }

  const showMintResult = async (name: string, quantity: number, isListed: boolean | null) => {

    setMintResultName(name)
    setMintResultQuantite(quantity)
    setMintResultIsListed(isListed)
    setOpenSucccessModal(true)
  }


  const [openModal, setOpenModal] = useState(true); // Manage the open state in the parent
  const isShowSample = false;
  const setSampleBase64 = () => {

    // setOpenSucccessModal(true)
    // setOnLoading('Generating...')
    setBase64Image('jaksdaldajdkl')
    setOpenModal(true)
    setUri('bafkreigjwuujkanbznrd4q5ully3wu7ldozb3jjocdqjou4gvl7uf5hhdu')
  }

  return (
    <AppTheme {...props}>
      <TabBar />
      <CssBaseline enableColorScheme />
      <MintContainer direction="column" justifyContent="space-between">
        <Card variant="outlined" sx={{ minWidth: 1000, maxWidth: 1000 }}>

          <img src={logo} width={"50px"} height={"50px"} />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Lens AI NFT Generator
          </Typography>

          {base64Image !== '' && (
            <GeneratedModal base64Image={base64Image}
              onSetMint={onSetQunatity}
              onSetSell={onSetSellNFT}
              open={openModal} // Pass the open state
              setOpen={setOpenModal} // Pass the setOpen function
            />
          )}

          <LoadingModal text={loading} open={loading !== ''} />
          <ImageGenerator onUriImageSet={handleSetImage} setLoading={setOnLoading} />
          <MintResult
            name={mintResultName}
            number={mintResultQuantity}
            open={openSucccessModal}
            isListed={mintResultIsListed}
            setOpen={setOpenSucccessModal}
          />


          {/* <div className="container">
            <form onSubmit={submit}>
              <label>
                Number of NFTs to mint:
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </label>
              <button type="submit">Mint NFT</button>
            </form>

            <h2>Account</h2>
            <div>
              status: {account.status}
              <br />
              addresses: {JSON.stringify(account.addresses)}
              <br />
              chainId: {account.chainId}
            </div>

            {account.status === "connected" && (
              <button type="button" onClick={() => disconnect()}>
                Disconnect
              </button>
            )}

            <div>
              <h2>Connect</h2>
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                >
                  {connector.name}
                </button>
              ))}
              <div>{status}</div>
              <div>{error?.message}</div>
            </div>
            
          </div> */}

          {/*Samplllllleeee*/}
          {isShowSample && (
          <Button onClick={setSampleBase64}>Open modal</Button>
          )}
          {/*Samplllllleeee*/}

        </Card>

        {/* {alert && (
          <Stack sx={{ width: "90%", alignItems: "center", bottom: "20" }} spacing={2}>
             <DismissibleAlert type={alert.type} message={alert.message} />
          </Stack>
        )} */}
      </MintContainer>
    </AppTheme>
  );
}
