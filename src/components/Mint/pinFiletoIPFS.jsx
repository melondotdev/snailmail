import { NFTStorage } from 'nft.storage'

const NFT_STORAGE_KEY = process.env.REACT_APP_SNAILMAIL_NFTSTORAGE_API_KEY;

const pinFileToIPFS = async (blob) => {
  const file = await new Blob([blob]);
  
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
  
  return await nftstorage.storeBlob(file);
}

export default pinFileToIPFS;
