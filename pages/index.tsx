import Head from "next/head";
import dynamic from "next/dynamic";
import { config } from "@/utils/config";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";
import { rainbowKitConfig as wagmiConfig } from "@/utils/wagmiConfig";
import { Spinner } from "@/components/ui";
import { useState, useEffect } from "react";
import { Types } from "@requestnetwork/request-client.js";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

const InvoiceDashboard = dynamic(
  () => import("@requestnetwork/invoice-dashboard/react"),
  { ssr: false, loading: () => <Spinner /> }
);

export default function InvoiceDashboardPage() {
  const { requestNetwork } = useAppContext();
  const { address } = useAccount();
  const [totalExpectedAmount, setTotalExpectedAmount] = useState<string>("0");
  const [totalReceivedAmount, setTotalReceivedAmount] = useState<string>("0");
  const [requestCount, setRequestCount] = useState<number>(0);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      if (!requestNetwork || !address) return;

      try {
        const requests = await requestNetwork.fromIdentity({
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        });

        setRequestCount(requests.length);

        const { expectedTotal, receivedTotal } = requests.reduce(
          (acc, request) => {
            const data = request.getData();
            return {
              expectedTotal:
                acc.expectedTotal + BigInt(data.expectedAmount || 0),
              receivedTotal:
                acc.receivedTotal + BigInt(data.balance?.balance || 0),
            };
          },
          { expectedTotal: BigInt(0), receivedTotal: BigInt(0) }
        );

        setTotalExpectedAmount(formatUnits(expectedTotal, 18));
        setTotalReceivedAmount(formatUnits(receivedTotal, 18));
      } catch (error) {
        console.error("Failed to fetch amounts:", error);
      }
    };

    fetchTotalAmount();
  }, [requestNetwork, address]);

  return (
    <>
      <Head>
        <title>Request Invoicing</title>
      </Head>
      <div className="container m-auto w-[100%]">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Amount Expected</h2>
            <p className="text-2xl text-blue-600">{totalExpectedAmount} ETH</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Amount Received</h2>
            <p className="text-2xl text-green-600">{totalReceivedAmount} ETH</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">No of Requests</h2>
            <p className="text-2xl text-purple-600">{requestCount}</p>
          </div>
        </div>
        <InvoiceDashboard
          config={config}
          currencies={currencies}
          requestNetwork={requestNetwork}
          wagmiConfig={wagmiConfig}
        />
      </div>
    </>
  );
}
