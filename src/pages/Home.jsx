import React, { useCallback, useState, useEffect } from 'react';
import { ethos, EthosConnectStatus, TransactionBlock } from 'ethos-connect';
import { HuePicker } from 'react-color';
import { SNAILMAIL } from '../lib/constants';
import { Tooltip } from 'react-tooltip'
import Navbar from '../components/Navbar';
import TextToImage from '../components/Mint/TextToImage';
import SuccessMessage from '../components/Mint/SuccessMessage';
import fetchWalletData from '../components/Auth/FetchWalletData';
import pinFiletoIPFS from '../components/Mint/pinFiletoIPFS';
import Frame1 from '../assets/frame1.png';
import Frame2 from '../assets/frame2.png';
import Frame3 from '../assets/frame3.png';
import Frame4 from '../assets/frame4.png';

const Home = () => {  
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState({});
  const [chosenTemplateIndex, setChosenTemplateIndex] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [formChanges, setFormChanges] = useState({
    address: '',
    message: ''
  });
  const [blob, setBlob] = useState('');
  const [nftObjectId, setNftObjectId] = useState('');
  
  // Listener for wallet connection status
  const { wallet, status } = ethos.useWallet();
  
  useEffect(() => {
    const checkWalletConnectionStatus = async () => {
      if (status === EthosConnectStatus.Connected && wallet) {
        setIsWalletConnected(true);
        try {
          const walletDataSnapshot = await fetchWalletData(wallet);
          setWalletData(walletDataSnapshot);
        } catch (error) {
          console.log("Error fetching wallet data:", error);
        }
      } else {
        setIsWalletConnected(false);
      }
    }
    
    checkWalletConnectionStatus();
  }, [wallet, status]);
  
  // ===== Mail Customizers =====

  const mailTemplates = [
    Frame1,
    Frame2,
    Frame3,
    Frame4,
  ];
  const [color, setColor] = useState('black');
  const [font, setFont] = useState('sans-serif');
  const [fontSize, setFontSize] = useState('text-3xl');
  const [fontBold, setFontBold] = useState(false);
  const [fontItalic, setFontItalic] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormChanges(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleBoldClick = (e) => {
    e.preventDefault();
    setFontBold(!fontBold);
  };
  
  const handleItalicClick = (e) => {
    e.preventDefault();
    setFontItalic(!fontItalic);
  };
  
  const handleChangeComplete = (color) => {
    setColor(color.hex);
  };
  
  // ===== Minting Function =====
  
  const mint = useCallback(async () => {
    if (!wallet?.currentAccount) return;

    const cid = await pinFiletoIPFS(blob);
    
    try {
      const transactionBlock = await new TransactionBlock()
      await transactionBlock.moveCall({
        target: `${SNAILMAIL}::snailmail::mint_to_recipient`,
        arguments: [
          transactionBlock.pure('Snail Mail'),
          transactionBlock.pure(formChanges.message),
          transactionBlock.pure(`https://${cid}.ipfs.nftstorage.link`),
          transactionBlock.pure(formChanges.address),
        ]
      })
      
      console.log(`https://${cid}.ipfs.nft.storage`);
      
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showObjectChanges: true,
        }
      });
      
      if (response?.objectChanges) {
        const createdObject = await response.objectChanges.find(
          (e) => e.type === "created"
        );
        if (createdObject && "objectId" in createdObject) {
          await setNftObjectId(createdObject.objectId)
        }
      }  
    } catch (error) {
      console.log(error);
    }
  }, [
    formChanges.message,
    blob,
    formChanges.address,
    wallet
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsMinting(true);
    mint();
  }

  const reset = useCallback(() => {
    setNftObjectId(undefined)
  }, [])
  
  useEffect(() => {
    reset()
  }, [reset])
  
  return (
    <div className='home w-screen h-screen font-anton bg-cover bg-top text-white bg-no-repeat bg-darkblue overflow-y-auto'>
      <Navbar walletData={walletData} isWalletConnected={isWalletConnected} />
      <div className='w-screen flex flex-col items-center'>
        <h1 className='text-4xl text-center mt-16 mb-4' >Send Customized On-Chain Messages!</h1>
        <div className='p-4 border-y-2 opacity-70 mx-48 italic'>
          <p className='font-sans text-xl text-center'>Appropriate for: personalized greetings, connection requests, birthday cards</p>
          <p className='font-sans text-xl text-center'>Inappropriate for: love confessions, slam poetry, cooking recipes</p>
        </div>
        <div className='mail-container flex w-full px-48 mt-4 justify-center' style={{maxWidth: "1200px"}}>
          <div className='image-constructor basis-1/2 pb-20'>
            <div className='image-option-container flex grow basis-1/5'>
              {mailTemplates.map((template, index) => (
                <div
                  key={index}
                  className={`image-option grow basis-1/4 cursor-pointer hover:opacity-70 p-1 ${chosenTemplateIndex === index ? 'opacity-70' : ''}`}
                  onClick={() => setChosenTemplateIndex(index)}
                >
                  <img src={template} alt={`frame${index + 1}`} />
                </div>
              ))}
            </div>
            <div className='selected-image grow basis-4/5 p-1 relative'>
              <TextToImage 
                chosenTemplateIndex={chosenTemplateIndex}
                fontColor={color}
                fontSize={fontSize}
                font={font}
                fontBold={fontBold}
                fontItalic={fontItalic}
                text={formChanges.message}
                isMinting={isMinting}
                setIsMinting={setIsMinting}
                setBlob={setBlob}
              />
              {/* <div className="absolute inset-0 p-16 break-all text-wrap flex items-center justify-center">
                <p className={`text-center ${fontSize} ${font} ${fontBold ? 'font-bold' : ''} ${fontItalic ? 'italic' : ''}`} style={{ color: color }}>{formChanges.message}</p>
              </div> */}
            </div>
          </div>
          {nftObjectId && (
            <SuccessMessage reset={reset}>
              <a 
                href={`https://suiscan.xyz/mainnet/object/${nftObjectId}`}
                target="_blank" 
                rel="noreferrer"
                className='underline font-blue-600' 
              >
                View Your NFT on Sui Scan 
              </a>
            </SuccessMessage>
          )}
          <form className='message-constructor basis-1/2 pl-8 flex flex-col pb-20 justify-between' onSubmit={handleSubmit}>
            <div>
              <div className='message-option-container grow basis-1/5'>
                <p className="form-field text-2xl mb-1"><span>{`Recipient Sui Address`}</span></p>
                <input
                  type="text"
                  name="address"
                  value={formChanges.address}
                  onChange={handleInputChange}
                  placeholder="i.e. 0x33...021e"
                  className="form-input font-sans mb-3 p-1 bg-black w-full text-lg"
                />
              </div>
              <p className="form-field text-2xl mt-4 mb-1"><span>{`Write Your Message`}</span></p>
              <div className='text-options flex items-center'>
                <HuePicker 
                  color={color}
                  onChangeComplete={handleChangeComplete}
                  className='basis-1/2'
                />
                {/* Font selector */}
                <p className="form-field text-xl mb-1 basis-1/6">
                  <select
                    name="font"
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="form-select font-sans p-2 bg-black w-full text-base"
                  >
                    <option value="font-sans">Sans-serif</option>
                    <option value="font-serif">Serif</option>
                    <option value="font-mono">Mono</option>
                  </select>
                </p>
                {/* Font size selector */}
                <p className="form-field text-xl mb-1 basis-1/8">
                  <select
                    name="fontSize"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="form-select font-sans p-2 bg-black w-full text-base"
                  >
                    <option value="text-3xl">L</option>
                    <option value="text-xl">M</option>
                    <option value="text-base">S</option>
                  </select>
                </p>
                {/* Bold/Italics */}
                <p className="form-field text-xl mb-1 basis-1/12">
                  <button
                    className={`font-sans p-2 font-bold ${fontBold === 'font-bold' ? 'opacity-70' : ''} w-full text-base hover:opacity-70 cursor-pointer`}
                    onClick={handleBoldClick}
                  >
                    B
                  </button>
                </p>
                <p className="form-field text-xl mb-1 basis-1/12">
                  <button
                    className={`font-sans italic p-2 ${fontItalic === 'italic' ? 'opacity-70' : ''} w-full text-base hover:opacity-70 cursor-pointer`}
                    onClick={handleItalicClick}
                  >
                    I
                  </button>
                </p>
              </div>
              <div className='message grow basis-4/5'>
                <textarea
                  name="message"
                  value={formChanges.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here"
                  className="form-textarea font-sans p-1 w-full bg-black text-lg"
                ></textarea>
              </div>
            </div>
            <button 
              type='submit' 
              disabled={!isWalletConnected} 
              className={`mint text-center w-full border-2 border-ssblue py-2 ${isWalletConnected ? 'hover:bg-ssblue cursor-pointer' : ''}`}
              data-tooltip-id="connect-first" 
              data-tooltip-content="You have to connect your wallet first!"
            >
              Mint and Send Your Message!
            </button>
            {!isWalletConnected && 
              <Tooltip id="connect-first" place="top" effect="solid" className="font-sans" />
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home;
