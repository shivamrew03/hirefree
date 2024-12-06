import { RequestNetwork } from "@requestnetwork/request-client.js";

export const CreateInvoice = async (web3SignatureProvider: any, requestParameters: any) => {
    const requestClient = new RequestNetwork({
        nodeConnectionConfig: { 
            baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
    });
    const request = await requestClient.createRequest(requestParameters);
    const confirmedRequestData = await request.waitForConfirmation();
    return confirmedRequestData;
}   