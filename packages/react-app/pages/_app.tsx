import type { AppProps } from "next/app";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { optimism, optimismGoerli, baseGoerli } from "wagmi/chains";
import celoGroups from "@celo/rainbowkit-celo/lists";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { publicProvider } from "wagmi/providers/public";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app

const { chains, provider } = configureChains(
  [optimism, optimismGoerli, baseGoerli],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "Grant Attestation Service",
  projectId,
  chains,
});

const connectors = connectorsForWallets([...wallets]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{ appName: "Grant Attestation Service" }}
        coolMode={true}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
