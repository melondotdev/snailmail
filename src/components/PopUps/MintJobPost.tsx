import { useCallback, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { ethos, TransactionBlock } from "ethos-connect";
import SuccessMessage from './SuccessMessage';
import { JOB_POST } from '../../lib/constants';
import { NextPage } from 'next';

interface MintJobPostProps {
  setIsMintJobPost: React.Dispatch<React.SetStateAction<boolean>>;
}

const MintJobPost: NextPage<MintJobPostProps> = ({ setIsMintJobPost }) => {
  const { wallet } = ethos.useWallet();
  const [nftObjectId, setNftObjectId] = useState<string | undefined>();
  const [formInputs, setFormInputs] = useState({
    company: '',
    email: '',
    discord: '',
    twitter: '',
    name: '',
    description: '',
    reward: '',
    image_url: '',
  });
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior
    mint();
  };
  
  const mint = useCallback(async () => {
    if (!wallet?.currentAccount) return;
    
    try {
      const transactionBlock = new TransactionBlock();
      transactionBlock.moveCall({
        target: `${JOB_POST}::job_post::mint_to_sender`,
        arguments: [
          transactionBlock.pure(formInputs.company),
          transactionBlock.pure(formInputs.email),
          transactionBlock.pure(formInputs.discord),
          transactionBlock.pure(formInputs.twitter),
          transactionBlock.pure(formInputs.name),
          transactionBlock.pure(formInputs.description),
          transactionBlock.pure(formInputs.reward),
          transactionBlock.pure(formInputs.image_url),
        ]
      })
      
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showObjectChanges: true,
        }
      });
      
      if (response?.objectChanges) {
        const createdObject = response.objectChanges.find(
          (e) => e.type === "created"
        );
        if (createdObject && "objectId" in createdObject) {
          setNftObjectId(createdObject.objectId)
        }
      }  
    } catch (error) {
      console.log(error);
    }
  }, [
    formInputs.company, 
    formInputs.email, 
    formInputs.discord, 
    formInputs.twitter, 
    formInputs.name,
    formInputs.description,
    formInputs.reward,
    formInputs.image_url,
    wallet
  ]);

  const reset = useCallback(() => {
    setNftObjectId(undefined)
  }, [])
  
  useEffect(() => {
    reset()
  }, [reset])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs(prevState => ({ ...prevState, [name]: value }));
  };
  
  return (
    <div className="popup fixed top-0 left-0 z-10 w-full h-full text-white font-inter text-sm">
      <div className="popup-bg fixed w-full h-full bg-lightbox bg-cover z-10" onClick={() => setIsMintJobPost(false)}></div>
      {/* Popup content */}
      <div className="popup-container absolute w-4/6 h-5/6 bg-gray-800 rounded-3xl flex z-40" style={{top: "10%", left: "15%"}}>
        {nftObjectId && (
          <SuccessMessage reset={reset}>
            <a 
              href={`https://suiscan.xyz/devnet/object/${nftObjectId}`}
              target="_blank" 
              rel="noreferrer"
              className='underline font-blue-600' 
            >
              View Your NFT on the DevNet Explorer 
            </a>
          </SuccessMessage>
        )}
        <form className="form-container flex flex-col w-full m-4 items-center justify-evenly items-stretch" onSubmit={handleSubmit}>
          <div className='info-container flex'>
            <div className='company-info grow basis-1/3 pr-4'>
              <h1 className='text-lg font-bold mb-4'>Employer Info</h1>
              <p className="form-field mb-1">Name</p>
              <input
                type="text"
                name="company"
                value={formInputs.company}
                onChange={handleInputChange}
                placeholder="i.e. Sui Snails"
                className="form-input mb-3 p-1 bg-black w-full text-xs"
              />
              <p className="form-field mb-1">Contact Email</p>
              <input
                type="email"
                name="email"
                value={formInputs.email}
                onChange={handleInputChange}
                placeholder="i.e. suisnailsnft@gmail.com"
                className="form-input mb-3 p-1 bg-black w-full text-xs"
              />
              <p className="form-field mb-1">Discord Link</p>
              <input
                type="url"
                name="discord"
                value={formInputs.discord}
                onChange={handleInputChange}
                placeholder="i.e. Server URL"
                className="form-input mb-3 p-1 bg-black w-full text-xs"
              />
              <p className="form-field mb-1">Twitter Link</p>
              <input
                type="url"
                name="twitter"
                value={formInputs.twitter}
                onChange={handleInputChange}
                placeholder="i.e. Twitter URL"
                className="form-input mb-3 p-1 bg-black w-full text-xs"
              />
            </div>
            <div className='job-post-info grow basis-2/3'>
              <h1 className='text-lg font-bold mb-4'>Job Post Info</h1>
              <div className='flex flex-col h-full items-stretch'>
                <div className='flex flex-col grow basis-1/4'>
                  <p className="form-field mb-1">name</p>
                  <input
                    type="text"
                    name="name"
                    value={formInputs.name}
                    onChange={handleInputChange}
                    placeholder="i.e. Short job name"
                    className="form-input p-1 bg-black w-full text-xs"
                  />
                </div>
                <div className='flex flex-col grow basis-1/2 text-wrap'>
                  <p className="form-field mb-1">Description</p>
                  <textarea
                    name="description"
                    value={formInputs.description}
                    onChange={handleInputChange}
                    placeholder="i.e. Descriptive explanation of the job tasks, responsibilities, expectations, timeframe, and communication preferences"
                    className="form-input mb-3 p-1 h-full bg-black w-full text-xs"
                  ></textarea>
                </div>
                <div className='flex grow basis-1/4 items-stretch'>
                  <div className='grow basis-1/4 pr-4'>
                    <p className="form-field mb-1">Reward {`(SUI)`}</p>
                    <input
                      type="number"
                      name="reward"
                      value={formInputs.reward}
                      onChange={handleInputChange}
                      placeholder="i.e. 69"
                      className="form-input mb-3 p-1 bg-black w-full text-xs"
                    />
                  </div>
                  <div className='grow basis-3/4'>
                    <p className="form-field mb-1" data-tooltip-id="upload-instructions" data-tooltip-content="You can upload a custom image_url or gif using NFT.storage">
                      image_url URL*
                      <a 
                        href={`https://classic.nft.storage/`}
                        target="_blank" 
                        rel="noreferrer"
                      ><span className='text-ssblue text-xs ml-4'>Go to NFT.storage</span></a>
                    </p>
                    <Tooltip id="upload-instructions" />
                    <input
                      type="url"
                      name="image_url"
                      value={formInputs.image_url}
                      onChange={handleInputChange}
                      placeholder="i.e. Enter an image_url URL here for the job post"
                      className="form-input mb-3 p-1 bg-black w-full text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
                type='submit'
                className="mx-auto w-full px-5 mt-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Mint Job Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MintJobPost
