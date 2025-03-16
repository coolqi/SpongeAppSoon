import { create } from "zustand";
import { IDL as solanaIDL } from '@/program/solana_vault';
import { IDL as soonIDL } from '@/program/soon_vault';
import solanaIcon from '@/assets/image/solana.png';
import soon from '@/assets/image/soon.png';

export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  contractAddress: string;
  authorityPublicKey: string;
  idl: any;
  icon: any;
}

interface NetworkStore {
  networks: Network[];
  currentNetwork: Network;
  setNetwork: (networkId: string) => void;
}

const NETWORKS: Network[] = [
  // {
  //   id: "solana",
  //   name: "Solana Devnet",
  //   rpcUrl: "https://api.devnet.solana.com",
  //   contractAddress: "HoU7uBBQf1eqX2StdnCdgA7wuDZB3kyxU1EgpZ6aqPKF",
  //   authorityPublicKey: "spngKTnGPcTAauuFR7mEzYBXhCbsAsWdTUghLra91B4",
  //   idl: solanaIDL,
  //   icon: solanaIcon
  // },
  {
    id: "soon",
    name: "SOON Testnet",
    rpcUrl: "https://rpc.testnet.soo.network/rpc",
    contractAddress: "2h1ghABKLrkEPK9YengE7ZBEYep6Dj8BHVQUj3AMde9p",
    authorityPublicKey: "7mddywPSUdnsstKxEmVv54xk5ZcjAp7HsF7ExMUGJpWe",
    idl: soonIDL,
    icon: soon
  }
];

const useNetworkStore = create<NetworkStore>((set) => ({
  networks: NETWORKS,
  currentNetwork: NETWORKS[0],
  setNetwork: (networkId: string) => {
    const network = NETWORKS.find(n => n.id === networkId);
    if (network) {
      set({ currentNetwork: network });
    }
  }
}));

export default useNetworkStore;