import { PinataSDK } from "pinata-web3"

export const pinata = new PinataSDK({
  pinataJwt: process.env.VITE_PINATA_JWT as string,
  pinataGateway: process.env.VITE_GATEWAY_URL as string,
});
