// MarketPlace.tsx
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { simulateContract, writeContract } from "@wagmi/core";
import { abi } from "../abi";
import TabBar from "../Tabbar/TabBar";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../theme/AppTheme";
import MintResult from "../Modal/MintResult/MintResult";
// import LoadingModal from "../Modal/LoadingModal/LoadingModal";
import "./MarketPlace.css";
import { config } from "../MintApp/wagmi";
import Collection from "./Collection/Collection";
import BuyModal from "./BuyModal/BuyModal";

import { useReadContract } from "wagmi";

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

type SellOfferType = {
  description: string;
  name: string;
  symbol: string;
  price: number;
  uri: string;
  seller: string;
};

export default function MarketPlace(props: { disableCustomTheme?: boolean }) {
  const account = useAccount();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDREESS;

  const [openSucccessModal, setOpenSucccessModal] = useState(false); // Manage the open state in the parent

  const [mintResultName, setMintResultName] = useState('');
  const [mintResultQuantity, setMintResultQuantite] = useState(1);
  const [mintResultIsListed, setMintResultIsListed] = useState<boolean | null>(null);
  const [offers, setOffers] = useState<SellOfferType[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh

  const result = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getSellOffers",
    config
  });


  const fetchMarketPlaceData = () => {
    const offers = (result.data ?? []).map((offer) => ({
      description: offer.description,
      name: offer.name,
      symbol: offer.symbol,
      price: Number(offer.price),
      seller: offer.seller,
      uri: offer.uri,
    }));

    setOffers(offers);
  };

  // useEffect(() => {
  //   fetchMarketPlaceData(); // Call it when result changes
  // }, [result]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1); // Trigger a re-fetch every second
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Call the fetch function whenever refreshTrigger changes
  useEffect(() => {
    fetchMarketPlaceData();
  }, [refreshTrigger]);


  const buy = async () => {


    if (!account.address){
      console.error("No account connected");
      return;
    }

    if (selectedItem!= null){
      
      try{ 
        await proceedToPay(selectedItem)
      }catch (e) {
        console.error("Error in payment process:", e);
      }
    }
  };

  const proceedToPay = async (item: SellOfferType) => {

    try {
      // Simulate the contract call to check if it will succeed
      const { request } = await simulateContract(config, {
        abi,
        address: contractAddress,
        functionName: "buyNFT",
        args: [ item.uri, item.name, item.description], // Add any necessary arguments for the 'pay' function here
        value: BigInt(item.price),
      });

      // Proceed to write the contract if simulation succeeded
      console.log("Simulation succeeded, proceeding with transaction.");

      const hash = await writeContract(config, request);

      // Optionally, you can wait for the transaction receipt if needed
      console.log("Transaction sent, hash:", hash);
      showMintResult(item.name, 1, null)
  
      // setIsPay(true);
    } catch (error) {
      console.error("Error writing contract:", error);
      // setError("Transaction failed");
    }
  };

  const [openModal, setOpenModal] = useState(false); // Manage the open state in the parent
  const [selectedItem, setSelectedItem] = useState<SellOfferType | null>(null);

  const showMintResult = async (name: string, quantity: number, isListed: boolean | null) => {

    setMintResultName(name)
    setMintResultQuantite(quantity)
    setMintResultIsListed(isListed)
    setOpenSucccessModal(true)
  }
  
  const onBuyCollection = (item: SellOfferType) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  return (
    <AppTheme {...props}>
      <TabBar />
      <CssBaseline enableColorScheme />

      <MintContainer direction="column" justifyContent="space-between" alignItems="center" display="flex">
        <Stack
          sx={{
            paddingTop: "100px",
            paddingBottom: "50px",
            alignItems: "center",
          }}
          spacing={5}
        >
          <p className="typed-text">NFT Market Place</p>

          {/* {base64Image !== "" && (
            <GeneratedModal
              base64Image={base64Image}
              onSetMint={onSetQunatity}
              onSetSell={onSetSellNFT}
              open={openModal} // Pass the open state
              setOpen={setOpenModal} // Pass the setOpen function
            />
          )} */}

          {/* <LoadingModal text={loading} open={loading !== ""} /> */}

          {selectedItem != null && (
            <BuyModal
              item={selectedItem} // Pass the selected item here
              onBuyAction={buy}
              open={openModal}
              setOpen={setOpenModal}
            />
          )}

          {/* <MintResult
            name={name}
            number={quantity}
            open={openSucccessModal}
            isListed={false}
            setOpen={setOpenSucccessModal}
          /> */}

          {/*Samplllllleeee*/}
          {/* {isShowSample && (
            <Button onClick={fetchMarketPlaceData}>Open modal</Button>
          )} */}
          {/*Sampllllleeee*/}

          <Card
          // variant="outlined"
          sx={{ minWidth: 1400, maxWidth: 1400, display: 'flex'}}
        >


          <div style={{ width: '100%' , display: 'flex'}}>
          <Collection
            items={offers}
            address={account.address}
            onBuyingItem={onBuyCollection}
          />
          </div>
          </Card>
        </Stack>

        <MintResult
            name={mintResultName}
            number={mintResultQuantity}
            open={openSucccessModal}
            isListed={mintResultIsListed}
            setOpen={setOpenSucccessModal}
          />
      
          
       
      </MintContainer>
    </AppTheme>
  );
}
