import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Image from "next/image";
import logo from "../logo/Untitled.png";
import Token from "../components/token";

export const Home = () => {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [3, 97],
  });

  const { chainId, account, activate, active, library, deactivate } =
    useWeb3React();

  const connectWallet = () => {
    activate(injectedConnector);
  };

  useEffect(() => {
    console.log(chainId, account, active);
  });

  const disconnectWallet = () => {
    deactivate();
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      {active ? (
        <Token
          disconnectWallet={disconnectWallet}
          chainId={chainId}
          account={account}
        />
      ) : (
        <div className="w-[70%] h-[90%] rounded-xl shadow-2xl bg-white bg-opacity-[85%] flex flex-col items-center justify-evenly p-5">
          <h1 className="text-5xl font-semibold p-2">
            Welcome To Sus Token Home Page
          </h1>

          <Image src={logo} width={250} height={250} />

          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-semibold text-[#7E7F9A] p-2">
              Get Your Sus Tokens Now!
            </h2>

            <button
              onClick={connectWallet}
              className="text-4xl font-semibold  bg-[#d2582f] bg-opacity-20 hover:border-slate-100 p-4 text-[#7E7F9A] hover:text-[#78C091] rounded-xl mt-[10%] w-[50%] hover:shadow-2xl focus:shadow-inner hover:bg-[#e1130d] hover:bg-opacity-10"
            >
              Connect!
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
