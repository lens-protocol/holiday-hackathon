import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import './SellModal.css'

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

interface SellModalProps {
  base64Image: string;
  onSetedSell: (price: number, name: string, description: string) => void;
}

export default function SellModal({ base64Image, onSetedSell }: SellModalProps) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  // const [errorQuantity, setErrorQuantity] = React.useState(false);
  const [price, setPrice] = React.useState(0.00001);
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  // const [quantity, setQuantity] = React.useState<number>(1);
  const defVlaue = Number(0.00001);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    console.log("Sell NFT with price: " + price + " " + name + " " + description + " " )
    onSetedSell(price, name, description);
    handleClose();
  };

  const setInternalPrice = (value: number) => {
    setPrice(value)
    setError(value < defVlaue)
  }

  // const setInternalQuantity = (value: number) => {
  //   setQuantity(value)
  //   setErrorQuantity(value < 1 || value > 100)
  // }

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ width: 205 }}>Sell NFT on MarketPlace</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >


        <Box sx={{ ...style, width: 500 }}>

          <Stack spacing={2}>
          <p className="sell-description">
                {" "}
                Listing The NFT
              </p>
            <div className="sell-image-container">
              <img src={base64Image} alt="Generated" />
            </div>

            

            <Stack spacing={2} direction="row" paddingTop={5}>
              <TextField
                label="NFT name"
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="NFT description"
                variant="outlined"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>

            {/* <Stack spacing={2} >

            <TextField
                  error={errorQuantity}
                  required
                  label="NFT quantity"
                  type="number"
                  variant="outlined"
                  defaultValue="1"
                  onChange={(e) => setInternalQuantity(Number(e.target.value))}
                  />
{errorQuantity && (<p className='error'>Quantity can not be less than 1 and more than 100</p>)}
</Stack> */}

            

            <div className='price'>



              <Stack spacing={2} direction={'row'}  alignItems="center" >
                <Typography
                  component="h1"
                  variant="h6"
                  sx={{ alignItems: "center", textAlign: "center"}}
                >
                  Price:
                </Typography>

                <TextField
                  error={error}
                  required
                  type="number"
                  defaultValue="0.00001"
                  onChange={(e) => setInternalPrice(Number(e.target.value))}
                  sx={{
                    fontSize: "clamp(2rem, 10vw, 2.15rem)",
                    textAlign: "center",
                    width: "100%"
                  }} />
              </Stack>
              {error && (<p className='error'>Price Should grather than 0.0000099</p>)}
            </div>



            <div className='show-price'>
              <img className="eth-icon" src='./grass.svg' />
              <p>{price}</p>
              <p>$Grass</p>
            </div>





            <div className="sell-button-container">
              <Button 
              disabled={error}
              variant="contained"
               color="success"
               onClick={submit}> Listing</Button>
            </div>

          </Stack>

        </Box>
      </Modal>
    </div>
  );
}