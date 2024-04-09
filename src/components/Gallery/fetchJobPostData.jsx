const fetchJobPostData = async (afterCursor = null) => {
  let hasNextPage = true;
  let endCursor = afterCursor;
  let addresses = [];

  let queryAddresses =
      `query {
        events(
          first: 4
          filter: {
            emittingModule: "0x50689ae0d93fd90e859dbe75427274041e3536b91f82d88a500744e0f7d85ffc::job_post",
          }
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            timestamp
            json
          }
        }
      }`;

  while (hasNextPage) {
    try {
      const response1 = await fetch("https://sui-mainnet.mystenlabs.com/graphql", {
        method: "POST",
        body: JSON.stringify({ query: queryAddresses }),
      });
      
      const jsonData1 = await response1.json();
      
      const nodes = jsonData1.data.events.nodes.map((node) => ({
        address: node.json.object_id,
      }));
      
      addresses.push(...nodes);
      
      hasNextPage = jsonData1.data.events.pageInfo.hasNextPage;
      if (hasNextPage) {
        endCursor = jsonData1.data.events.pageInfo.endCursor.toString();
        queryAddresses = `query {
          events(
            first: 4
            after: "${endCursor}"
            filter: {
              emittingModule: "0x50689ae0d93fd90e859dbe75427274041e3536b91f82d88a500744e0f7d85ffc::job_post",
            }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              timestamp
              json
            }
          }
        }`;
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      hasNextPage = false;
    }
  }

  const fetchedData = [];

  for (const addressObj of addresses) {
    const queryData =
      `query {
        object (address: "${addressObj.address}") {
          display {
            key,
            value
          }
        }
      }`;

    try {
      const response2 = await fetch("https://sui-mainnet.mystenlabs.com/graphql", {
        method: "POST",
        body: JSON.stringify({ query: queryData }),
      });
      
      const jsonData2 = await response2.json();
      fetchedData.push(jsonData2);
    } catch (error) {
      console.error('Error fetching data for address:', addressObj.address, error);
      // You may choose to continue fetching for other addresses despite errors
      // or handle this case differently as per your requirements.
    }
  }
  
  return fetchedData; // Return fetched data array
};

export default fetchJobPostData;
