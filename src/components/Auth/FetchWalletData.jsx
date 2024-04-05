const fetchWalletData = async (wallet) => {
  if (!wallet) return []; // Return an empty array if wallet is not available
  
  const { suiBalance } = wallet.contents;

  // Prepare an array to store wallet data
  const walletDataArray = {
    Address: wallet.address,
    Balance: suiBalance,
  };
  
  return walletDataArray;
};

export default fetchWalletData;
