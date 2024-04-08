const fetchJobPostData = async () => {
  let query =
    `query {
      events(
        filter: {
          emittingModule: "0xd92f1a41a1c74e1ee5f294f238c81d4bb1d963a86e437f098518beb74514086e::job_post",
        }
      ) {
        nodes {
          timestamp
          json
        }
      }
    }`;

  try {
    const response1 = await fetch("https://sui-mainnet.mystenlabs.com/graphql", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    const jsonData1 = await response1.json();
    const addresses = jsonData1.data.events.nodes.map((node) => ({
      address: node.json.object_id,
    }));

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
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error for further handling or logging
  }
};

export default fetchJobPostData;
