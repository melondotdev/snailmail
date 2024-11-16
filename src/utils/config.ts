import { PinataSDK } from "pinata-web3"

export const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT as string,
  pinataGateway: process.env.REACT_APP_GATEWAY_URL as string
});
