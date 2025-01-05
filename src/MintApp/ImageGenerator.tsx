// ImageGenerator.tsx
import React, { useState } from "react";
import UploadToIPFS from "./UploadToIPFS";
import PromptForm from "./Promp";
import { useAccount } from "wagmi";
// import { useProceedToPay } from "./Pay/ProceedToPay";

interface ImageGeneratorProps {
  onUriImageSet: (uri: string, image: string) => void;
  setLoading: (loading: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onUriImageSet, setLoading }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const { address } = useAccount();

  /// Pay result
  // const { proceedToPay, isPay, errorr } = useProceedToPay();
  const [error, setError] = useState<string | null>(null);
  // useEffect(() => {
  //   const handlePaymentSuccess = async () => {
  //     if (isPay) {
  //       console.log("Payment was successful!");
  //       // Call the generateImage function if payment was successful
  //       try {
  //         await generateImage();
  //         setPrompt("");
  //       } catch (error) {
  //         console.error("Error generating image:", error);
  //       }
  //     }
  //   };

  //   handlePaymentSuccess();
  // }, [isPay]);
  // useEffect(() => {
  //   if (error) {
  //     console.error("There was an error with the payment:", error);
  //     // Additional actions on error, e.g., display a notification
  //     setError(error);
  //   }
  // }, [errorr]);

  const generateImage = async () => {
    setLoading('Generating...');
    setError(null);
    setBase64Image(null);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
        requestOptions
      );
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string
          setBase64Image(res);
          setPrompt("");
          // onBase64ImageSet(res);
        };
        reader.readAsDataURL(blob);
      } else {
        setError("Failed to generate image");
      }
    } catch (error) {
      console.error(error);
      setError("Error generating image");
    } finally {
      setLoading('');
    }
  };


  const handleSubmit = async () => {
    if (!address) {
      console.error("No account connected");
      // setError("No account connected");
      return;
    }
    console.log("Start payment process");
    try {
      await generateImage();
    } catch (e) {
      console.error("Error in payment process:", e);
    }
  };

  const onUriSetDone = (uri: string) => {
    onUriImageSet(uri, base64Image || "");
    setLoading('')
  };

  return (
    <div className="centered-container">
      <PromptForm
        sendPrompt={handleSubmit}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      {base64Image && (
        <UploadToIPFS
          base64Image={base64Image.split(",")[1]}
          onUploadSuccess={onUriSetDone}
        />
      )}
    </div>
  );
};

export default ImageGenerator;
