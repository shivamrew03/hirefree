import { Types, Utils } from '@requestnetwork/request-client.js';
import { ethers } from 'ethers';

export const getRequestParameters = (
  freelancerAddress: string,
  clientAddress: string,
  amount: string,
  milestoneIndex: number,
  projectTitle: string,
  projectId: string
): Types.ICreateRequestParameters => {
  return {
    requestInfo: {
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        network: "sepolia",
      },
      expectedAmount: ethers.utils.parseUnits(amount, 6).toString(),
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: freelancerAddress,
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: clientAddress,
      },
      timestamp: Utils.getCurrentTimestampInSecond()
    },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: freelancerAddress
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: "sepolia",
        paymentAddress: freelancerAddress,
        feeAddress: "0x0000000000000000000000000000000000000000",
        feeAmount: "0"
      }
    },
    contentData: {
      purpose: `Payment for milestone ${milestoneIndex} - Project: ${projectTitle} (ID: ${projectId})`
    },
  };
};