import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from "@mui/material/Stack";
// import UploadToIPFS from "../../MintApp/UploadToIPFS";
import Typography from "@mui/material/Typography";
import './GeneratedModal.css'
import MintModal from "../MintModal/MintModal";
import SellModal from "../SellModal/SellModal";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface NestedModalProps {
  base64Image: string;
  onSetMint: (quantity: number, name: string, description: string) => void;
  onSetSell: (price: number, name: string, description: string) => void;
  open: boolean; // Accept open state as a prop
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Accept setOpen as a prop
}

export default function NestedModal({ base64Image, onSetMint, onSetSell, open, setOpen }: NestedModalProps) {

  // const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const onSetMintParams = (number: number, name: string, description: string) => {
    console.log("------on mint processwith qunatity: "+ number);
    onSetMint(number, name, description);
    handleClose();
  };

  const onSetSellParams = (price: number, name: string, description: string) => {
    onSetSell(price, name, description);
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
        <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", textAlign: "center" }}
          >
            Generated NFT
          </Typography>

          <div className="image-container">
      <img src={base64Image} alt="Generated" />
      </div>
      
      <div className="button-container">
      <Stack spacing={2} direction="row" useFlexGap sx={{justifyContent: "space-between" }}>
        <MintModal onSetedMint={onSetMintParams} />
        <SellModal base64Image={base64Image} onSetedSell={onSetSellParams} />
      </Stack>
    </div>

    </Stack>

        </Box>
      </Modal>
    </div>
  );
}