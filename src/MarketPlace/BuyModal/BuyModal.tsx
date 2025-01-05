import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
import "./BuyModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface SellModalProps {
  item: {
    description: string;
    name: string;
    symbol: string;
    price: number;
    uri: string;
    seller: string;
  };
  onBuyAction: () => void;
  open: boolean; // Accept open state as a prop
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SellModal({ item, onBuyAction, open, setOpen }: SellModalProps) {

  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    onBuyAction();
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <Stack spacing={2}>
            <p className="sell-description"> Buying The NFT</p>
            <div className="sell-image-container">
              <img
                src={
                  import.meta.env.VITE_PAY_CONTRACT_ADDREESS_IPFS_CDN + item.uri
                }
                alt="Generated"
              />
            </div>

            <Typography
                component="h1"
                variant="h6">
                Name: {item.name}
              </Typography>
              <Typography
                component="h1"
                variant="h6">
                Description: {item.description}
              </Typography>
              <Typography
                component="h1"
                variant="h6">
                Seller Address: {item.seller.substring(0, 4)}...{item.seller.substring(item.seller.length - 4)}
              </Typography>


            <div className="show-priceeBuy">
            <Typography
                component="h1"
                variant="h6">
                Price:
              </Typography>
              <p>{item.price / Math.pow(10, 18)}</p>
              <p>$Grass</p>
              <img className="eth-icon" src="./grass.svg" />
            </div>

            <div className="sell-button-container">
              <Button variant="contained" color="secondary" onClick={submit}>
                Proceed to buy
              </Button>
            </div>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
