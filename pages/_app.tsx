import { WagmiProvider } from "wagmi";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { GoogleTagManager } from "@next/third-parties/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Navbar, VersionDisplay } from "@/components/common";
import { Provider } from "@/utils/context";
import { rainbowKitConfig } from "@/utils/wagmiConfig";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect } from "react";

// Import ErrorBoundary component (create this if needed)
import ErrorBoundary from "@/components/ErrorBoundary"; // Adjust the path as needed

const montserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  useEffect(() => {
    // Suppress Next.js error overlay in development
    if (process.env.NODE_ENV === "development") {
      window.addEventListener("error", (e) => {
        e.preventDefault(); // Prevent default error overlay pop-up
        console.error(e.error); // Log the error to the console
      });
      window.addEventListener("unhandledrejection", (e) => {
        e.preventDefault(); // Prevent unhandled promise rejections from showing a pop-up
        console.error(e.reason); // Log the promise rejection error
      });
    }
  }, []);

  return (
    <div className={`${montserrat.className}`}>
      <ErrorBoundary>
        <WagmiProvider config={rainbowKitConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Provider>
                <Navbar />
                <Component {...pageProps} />
              </Provider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ErrorBoundary>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
    </div>
  );
}
