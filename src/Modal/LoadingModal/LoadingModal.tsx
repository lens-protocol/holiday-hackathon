import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import ReactLoading from 'react-loading';
import "./LoadingModal.css";
import { indigo } from "@mui/material/colors";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 300,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface LoadingModalResultProps {
  text: string
  open: boolean; // Accept open state as a prop
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Accept setOpen as a prop
}

export default function LoadingModal({ text, open }: LoadingModalResultProps) {


  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{  ...style }}>
          <Stack spacing={0} sx={{justifyItems: "center", alignItems: "center"}}>
            
            <ReactLoading type={"spin"} color={indigo[500]} height={'50px'} width={'50px'} />
            

          

          <p className="description">{text}</p>

            </Stack>
        </Box>
      </Modal>
    </div>
  );
}
