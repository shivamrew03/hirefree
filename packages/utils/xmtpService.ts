import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';

class XmtpService {
  private static instance: XmtpService;
  private client: Client | null = null;
  private constructor() {}

  public static getInstance(): XmtpService {
    if (!XmtpService.instance) {
      XmtpService.instance = new XmtpService();
    }
    return XmtpService.instance;
  }

  private async initializeClient() {
    if (!this.client) {
      const signer = new ethers.Wallet(process.env.XMTP_PRIVATE_KEY!);
      this.client = await Client.create(signer, { env: 'production' });
    }
    return this.client;
  }

  public async sendMessage(recipientAddress: string, message: string) {
    try {
      const client = await this.initializeClient();
      const canMessage = await client.canMessage(recipientAddress);
      
      if (!canMessage) {
        console.log(`User ${recipientAddress} is not XMTP enabled. Skipping message.`);
        return;
      }

      const conversation = await client.conversations.newConversation(recipientAddress);
      await conversation.send(message);
      console.log(`Notification sent to ${recipientAddress}`);
    } catch (error) {
      console.error(`Error sending XMTP message:`, error);
      throw error;
    }
  }
}

export const xmtpService = XmtpService.getInstance(); 