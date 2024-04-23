import React, { useCallback, useState, useEffect, useRef } from 'react';
import { HuePicker } from 'react-color';
import { SNAILMAIL, SNAILMAIL_MAINTAINER } from '../lib/constants';
import { useCurrentWallet, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Tooltip } from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import Navbar from '../components/Navbar';
import TextToImage from '../components/Mint/TextToImage';
import SuccessMessage from '../components/Mint/SuccessMessage';
import fetchWalletData from '../components/Auth/FetchWalletData';
import pinFiletoIPFS from '../components/Mint/pinFiletoIPFS';
import Frame1 from '../assets/frame1.png';
import Frame2 from '../assets/frame2.png';
import Frame3 from '../assets/frame3.png';
import Frame4 from '../assets/frame4.png';
import Frame5 from '../assets/frame5.png';
import Frame6 from '../assets/frame6.png';

const Home = () => {  
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState({});
  const [chosenTemplateIndex, setChosenTemplateIndex] = useState(0);
  const [formChanges, setFormChanges] = useState({
    address: '',
    message: ''
  });
  
  // ===== Media Queries =====
  
  const isMobile = useMediaQuery({ query: '(max-width: 900px)' });
  
  // Listener for wallet connection status
  
  const { currentWallet, connectionStatus } = useCurrentWallet();
  
  const hasFetchedRef = useRef(false);
  
  useEffect(() => {
    const checkWalletConnectionStatus = async () => {
      if (connectionStatus === 'connected') {
        if (!hasFetchedRef.current) {
          setIsWalletConnected(true);
          try {
            const walletDataSnapshot = await fetchWalletData(currentWallet.accounts[0].address);
            setWalletData(walletDataSnapshot);
            hasFetchedRef.current = true;  // Set ref to true after fetching data
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        setIsWalletConnected(false);
        hasFetchedRef.current = false;  // Reset ref when disconnected
      }
    };
  
    checkWalletConnectionStatus();

    // Introduce a way to periodically check the connection status
    const intervalId = setInterval(checkWalletConnectionStatus, 10000); // check every 10 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [connectionStatus, currentWallet]);
  
  // ===== Mail Customizers =====

  const mailTemplates = [
    Frame1,
    Frame2,
    Frame3,
    Frame4,
    Frame5,
    Frame6
  ];
  const [color, setColor] = useState('black');
  const [font, setFont] = useState('font-sans');
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

  const [isLoading, setIsLoading] = useState(false);
  const [errorLoadingContent, setErrorLoadingContent] = useState(false);
  const [errorMessageOpacity, setErrorMessageOpacity] = useState(1);
  const [blob, setBlob] = useState('');
  const [nftObjectId, setNftObjectId] = useState('');
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
  
  const mint = useCallback(async () => {
    if (connectionStatus === 'disconnected') return;
    
    setIsLoading(true); // Set loading state
    
    if (!blob) {
      setIsLoading(false);
      
      setErrorLoadingContent(true);
      setErrorMessageOpacity(1); // Immediately show the message with full opacity
  
      // Begin fade-out after 3 seconds
      setTimeout(() => {
        setErrorMessageOpacity(0); // Fade out the message
      }, 0);
      
      setTimeout(() => {
        setErrorLoadingContent(false);
      }, 3000)
      
      return;
    }
    
    const cid = await pinFiletoIPFS(blob);
    
    try {
      const transactionBlock = new TransactionBlock();

      const fee = 20000000;
      const payment = transactionBlock.splitCoins(
        transactionBlock.gas,
        [transactionBlock.pure(fee)]
      );
      const coinVec = transactionBlock.makeMoveVec({ objects: [payment] });
      
      transactionBlock.moveCall({
        target: `${SNAILMAIL}::snailmail::mint_to_recipient`,
        typeArguments: [],
        arguments: [
          transactionBlock.object(SNAILMAIL_MAINTAINER),
          coinVec,
          transactionBlock.pure('Snail Mail'),
          transactionBlock.pure(formChanges.message),
          transactionBlock.pure(`https://${cid}.ipfs.nftstorage.link`),
          transactionBlock.pure(formChanges.address),
        ]
      });
      
      signAndExecuteTransactionBlock(
        {
          transactionBlock,
          chain: 'sui:mainnet',
        },
        {
          onSuccess: (result) => {
            console.log('executed transaction block', result);
            setNftObjectId(result.digest);
          },
          onError: error => {
            console.log('error', error)
          },
        },
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }, [
    blob, connectionStatus, formChanges.address, formChanges.message, signAndExecuteTransactionBlock
  ]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
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
      {!isMobile ? (
        <>
          <div className='w-screen flex flex-col items-center'>
            <h1 className='text-4xl text-center mt-16' >Send Customized On-Chain Messages!</h1>
            <p className='font-sans text-xl text-center italic opacity-70 mb-4'>(Costs 0.02 Sui per Message + 0.004 Sui Minting Fee)</p>
            <div className='p-4 border-y-2 opacity-90 mx-48 italic'>
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
                    setBlob={setBlob}
                  />
                </div>
              </div>
              {errorLoadingContent && (
                <div 
                  className="popup fixed top-0 left-0 z-10 w-full h-full text-white" 
                  style={{opacity: errorMessageOpacity, transition: 'opacity 3s ease-in-out'}}
                >
                  <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={() => setErrorLoadingContent(false)}>
                    <div className='text-3xl text-center flex h-full justify-center items-center'>
                      {`Whoops, something went wrong! 
                      Please try again.`}
                    </div>
                  </div>
                </div>
              )}
              {isLoading ? (
                <div className="popup fixed top-0 left-0 z-10 w-full h-full text-white">
                  <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={() => setIsLoading(false)}>
                    <div className='text-6xl text-center flex h-full justify-center items-center'>Loading...</div>
                  </div>
                </div>
              ) : (
                <>
                  {nftObjectId && (
                    <SuccessMessage reset={reset}>
                      <a 
                        href={`https://suiscan.xyz/mainnet/tx/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                      >
                        View your transaction on Sui Scan
                      </a>
                    </SuccessMessage>
                  )}
                </>
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
        </>
      ) : (
        <>
          <div className='w-screen flex flex-col items-center'>
            <h1 className='text-xl text-center mt-16' >Send Customized On-Chain Messages!</h1>
            <p className='font-sans text-base text-center italic opacity-70 pb-4 px-8 border-b-2 text-wrap'>(Costs 0.02 Sui per Message + 0.004 Sui Minting Fee)</p>
            <div className='mail-container w-full my-8 flex flex-col items-center justify-center'>
              <div className='image-constructor p-4 flex flex-col w-full' style={{maxWidth: "400px"}}>
                <div className='image-option-container flex basis-1/5 overflow-y-auto'>
                  {mailTemplates.map((template, index) => (
                    <div
                      key={index}
                      className={`image-option grow basis-1/6 cursor-pointer hover:opacity-70 p-1 ${chosenTemplateIndex === index ? 'opacity-70' : ''}`}
                      onClick={() => setChosenTemplateIndex(index)}
                    >
                      <img src={template} alt={`frame${index + 1}`} />
                    </div>
                  ))}
                </div>
                <div className='selected-image p-1 relative mb-6'>
                  <TextToImage 
                    chosenTemplateIndex={chosenTemplateIndex}
                    fontColor={color}
                    fontSize={fontSize}
                    font={font}
                    fontBold={fontBold}
                    fontItalic={fontItalic}
                    text={formChanges.message}
                    setBlob={setBlob}
                  />
                </div>
              </div>
              {errorLoadingContent && (
                <div 
                  className="popup fixed top-0 left-0 z-10 w-full h-full text-white" 
                  style={{opacity: errorMessageOpacity, transition: 'opacity 3s ease-in-out'}}
                >
                  <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={() => setErrorLoadingContent(false)}>
                    <div className='text-3xl text-center flex h-full justify-center items-center'>
                      {`Whoops, something went wrong! 
                      Please try again.`}
                    </div>
                  </div>
                </div>
              )}
              {isLoading ? (
                <div className="popup fixed top-0 left-0 z-10 w-full h-full text-white">
                  <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={() => setIsLoading(false)}>
                    <div className='text-6xl text-center flex h-full justify-center items-center'>Loading...</div>
                  </div>
                </div>
              ) : (
                <>
                  {nftObjectId && (
                    <SuccessMessage reset={reset}>
                      <a 
                        href={`https://suiscan.xyz/mainnet/tx/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                      >
                        View your transaction on Sui Scan
                      </a>
                    </SuccessMessage>
                  )}
                </>
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
        </>
      )}
    </div>
  )
}

export default Home;
