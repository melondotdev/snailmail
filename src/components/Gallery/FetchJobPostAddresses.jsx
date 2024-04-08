import React, { useState } from 'react';

const FetchJobPostAddresses = () => {
  const query =
    `query {
      transactionBlocks(filter: {changedObject: "0xd92f1a41a1c74e1ee5f294f238c81d4bb1d963a86e437f098518beb74514086e"}) {
        nodes {
          effects {
            objectChanges {
              nodes {
                address
              }
            }
          }
        }
      }
    }`;
  const [data, setData] = useState('');
  
  const fetchData = async () => {
    try {
      const response = await fetch("https://sui-mainnet.mystenlabs.com/graphql", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      const jsonData = await response.json();
      setData(jsonData);
      console.log('updated');
      console.log(data);
      console.log(data.data.transactionBlocks.nodes[0].effects.objectChanges.nodes[4]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <div>
      <button onClick={fetchData} className='bottom-0 border-2 bg-white'>Update Data</button>
    </div>
  )
};

export default FetchJobPostAddresses;
