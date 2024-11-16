import { pinata } from '../../utils/config';

const pinFileToIPFS = async (blob) => {
  try {
    // Upload file to Pinata
    const upload = await pinata.upload.file(blob);

    // Convert the IPFS hash to a gateway URL
    const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
    
    return ipfsUrl;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw new Error('Failed to upload file to Pinata');
  }
};

export default pinFileToIPFS;