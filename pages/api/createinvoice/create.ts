import {CreateInvoice} from '../../../services/RequestInvoice';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { requestParameters, web3SignatureProvider } = req.body;
  
  const result = await CreateInvoice(web3SignatureProvider, requestParameters);

  return res.status(200).json({ 
    success: true, 
    requestId: result.requestId 
  });
}
