import { useEffect } from 'react';
import { pinata } from '../utils/config'; // Ensure this is the correct path to your Pinata configuration

interface UploadToIPFSProps {
  base64Image: string | null;
  onUploadSuccess: (ipfsHash: string) => void; // Callback to set the URI
}

const UploadToIPFS: React.FC<UploadToIPFSProps> = ({ base64Image, onUploadSuccess }) => {

  const base64ToBlob = (base64String: string, mimeType: string = 'image/png') => {
    const byteCharacters = atob(base64String); // Decode base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  useEffect(() => {
    const handleSubmission = async () => {
      if (!base64Image) return;

      try {
        // Convert base64 to Blob
        const blob = base64ToBlob(base64Image, 'image/png');
        const file = new File([blob], 'generated-image.png', { type: 'image/png' });

        // Upload to Pinata
        const upload = await pinata.upload.file(file);
        console.log(upload);

        try {
          const data = await pinata.gateways.get(upload.IpfsHash);
          console.log("--------------------------------")
          console.log(data)
        } catch (error) {
          console.log("--------------------------------error")
          console.log(error);
        }
        console.log(upload.IpfsHash)
        onUploadSuccess(upload.IpfsHash); // Call the callback with the IPFS hash
      } catch (error) {
        console.error('Failed to upload to IPFS:', error);
      }
    };

    handleSubmission();
  }, [base64Image, onUploadSuccess]);

  return null;
};

export default UploadToIPFS;
