import React from "react";
import Button from "@mui/material/Button";
import "./PromptForm.css"; // Import the CSS file
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
interface PromptFormProps {
  sendPrompt: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  sendPrompt,
  prompt,
  setPrompt,
}) => {
  return (
    <Stack spacing={2} direction={"row"}>
      <TextField
        variant="outlined"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        label="Prompt"
        fullWidth
        slotProps={
          {
            // input: {
            //     style: {
            //       color: 'white', // Change the text color
            //       padding: '10px',
            //     },
            //   },
            //   inputLabel: {
            //     style: {
            //       color: 'white', // Change the label color
            //       padding: '10px',
            //     },
            //   },
          }
        }
        sx={
          {
            // '&:hover .MuiOutlinedInput-notchedOutline': {
            //   borderColor: 'gray', // Change border color on hover
            // },
            // '&.Mui-focused fieldset .MuiOutlinedInput-notchedOutline': {
            //   borderColor: 'red', // Change border color when focused
            // },
          }
        }
      />
      <Button
        className="prompt-button"
        type="submit"
        variant="contained"
        onClick={sendPrompt}
      >
        Generate Image
      </Button>
    </Stack>
  );
};

export default PromptForm;
