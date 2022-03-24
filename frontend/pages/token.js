import { ethers } from "ethers";
import { useEffect, useState } from "react";
import info from "../ContractInfo/susTokenUpgraded.json";
import profilePic from "../logo/pp.png";
import Image from "next/image";
import eth from "../logo/eth.png";

export const Token = ({ disconnectWallet, chainId, account }) => {
  if (window.ethereum === undefined) {
    return;
  }
  // States for displaying info
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [readContract, setReadContract] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [userEthBalance, setUserEthBalance] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);

  // States for inputs
  const [owhAddress, setOwhAddress] = useState("");
  const [buyTokenAmount, setBuyTokenAmount] = useState("");
  const [owhBalanceOf, setOwhBalanceOf] = useState("");

  // Getting sign and read providers and Contract infos
  const getContract = async () => {
    const susContractRead = await new ethers.Contract(
      info["chains"][chainId],
      info["abi"],
      provider
    );
    setReadContract(susContractRead);

    setTokenName(await susContractRead.name());
    setTokenSymbol(await susContractRead.symbol());
    const totalSupply = await susContractRead.totalSupply();
    setTokenSupply(ethers.utils.formatUnits(totalSupply, "wei"));
    const userBalanceAwait = await susContractRead.balanceOf(account);
    setUserBalance(ethers.utils.formatUnits(userBalanceAwait, "wei"));
    const tokenBalanceAwait = await susContractRead.tokenPrice();
    setTokenPrice(ethers.utils.formatUnits(tokenBalanceAwait, "ether"));
    const userBalanceEthAwait = await provider.getBalance(account);
    setUserEthBalance(ethers.utils.formatUnits(userBalanceEthAwait, "ether"));
  };

  // Refreshing info each time when user changes chains
  useEffect(() => {
    getContract();
  }, [chainId]);

  // Buy token handler
  const buyTokensHandler = async () => {
    try {
      const amount = parseInt(buyTokenAmount) * tokenPrice;
      setBuyTokenAmount("");
      const transaction = await provider.getSigner().sendTransaction({
        to: info["chains"][chainId],
        value: ethers.utils.parseEther("" + amount),
      });
      // Waiting transaction to confirm
      const waiting = await transaction.wait();
      // Updating balance infos
      await getContract();
    } catch (error) {
      console.log(error);
    }
  };

  // Owh balance check handler
  const checkOwhBalanceHandler = async () => {
    try {
      const interaction = await readContract.owhBalance(owhAddress);
      setOwhBalanceOf(ethers.utils.formatUnits(interaction, "wei"));
      console.log(owhBalanceOf);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // Left Aside
    <div className="w-[100%] h-[90%]  shadow-2xl bg-white bg-opacity-[85%] flex ">
      <aside className="border-r-[1px] w-[25%] border-[#7E7F9A] border-opacity-40  h-[100%] p-[1%] flex flex-col  items-center pt-[5%]">
        <div>
          <Image src={profilePic} width={200} height={200} />
        </div>
        <div className="w-[95%]">
          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20">
              User Address:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-xs 2xl:text-base py-2 bg-[#d2582f] bg-opacity-5">
              {account}
            </h2>
          </div>

          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20">
              User's Ethereum Balance:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-lg py-2 bg-[#d2582f] bg-opacity-5 flex justify-center items-center">
              {userEthBalance} ETH{" "}
              <span className="ml-1 flex items-center">
                <Image src={eth} width={20} height={20} />
              </span>
            </h2>
          </div>
          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20 ">
              User's SUS Balance:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-lg py-2 bg-[#d2582f] bg-opacity-5">
              {userBalance} {tokenSymbol}
            </h2>
          </div>
        </div>
      </aside>
      {/* Token Buy and OWHbalance Check */}
      <main className="w-[50%] px-[1%] pt-[5%] pb-[15%] flex flex-col justify-between">
        {/* Buying */}
        <div className="flex flex-col w-[60%] ">
          <label
            htmlFor="buyInput"
            className="text-3xl font-semibold text-[#7E7F9A] p-2"
          >
            Buy susToken
          </label>

          <input
            type="text"
            id="buyInput"
            className="outline-none p-3 mt-2 rounded-lg text-xl font-semibold text-[#7E7F9A] border-b-[1px] focus:border-b-[#e1130d]"
            placeholder="Enter Amount"
            value={buyTokenAmount}
            onChange={(e) => {
              setBuyTokenAmount(e.target.value);
            }}
          />
          <div className="flex items-center  mt-2">
            <button
              onClick={buyTokensHandler}
              className="text-3xl font-semibold  bg-[#d2582f] 
            bg-opacity-20 hover:border-slate-100 p-2 
            text-[#7E7F9A] hover:text-[#78C091] 
            rounded-xl  w-[40%]  hover:shadow-2xl focus:shadow-inner 
            hover:bg-[#e1130d] hover:bg-opacity-10"
            >
              Buy
            </button>
          </div>
        </div>
        {/* owhCheck */}
        <div className="flex flex-col w-[60%]">
          <label
            htmlFor="CheckInput"
            className="text-3xl font-semibold text-[#7E7F9A] p-2"
          >
            Check owhBalance with Address
          </label>
          <input
            type="text"
            id="CheckInput"
            className="outline-none p-3 mt-2 rounded-lg 
            text-xl font-semibold text-[#7E7F9A] border-b-[1px]
             focus:border-b-[#e1130d]"
            placeholder="Enter Address"
            value={owhAddress}
            onChange={(e) => {
              setOwhAddress(e.target.value);
            }}
          />
          <div className="flex items-center  mt-2">
            <button
              onClick={checkOwhBalanceHandler}
              className="text-3xl font-semibold  bg-[#d2582f] bg-opacity-20
               hover:border-slate-100 p-2 text-[#7E7F9A] hover:text-[#78C091] 
               rounded-xl  w-[40%]  hover:shadow-2xl focus:shadow-inner 
               hover:bg-[#e1130d] hover:bg-opacity-10"
            >
              Check
            </button>
          </div>
          {owhBalanceOf && (
            <p className="text-3xl font-semibold text-[#7E7F9A] p-2">
              OWH's balance is: {owhBalanceOf}
            </p>
          )}
        </div>
      </main>
      {/* Right Aside  */}
      <aside className="w-[25%] border-l-[1px] border-[#7E7F9A] border-opacity-40 h-[100%] p-[1%] flex flex-col  items-center pt-[5%] justify-between">
        <div className="w-[95%]">
          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20">
              Token Name:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-lg py-2 bg-[#d2582f] bg-opacity-5">
              {tokenName}
            </h2>
          </div>

          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20">
              Token Symbol:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-lg py-2 bg-[#d2582f] bg-opacity-5">
              {tokenSymbol}
            </h2>
          </div>
          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20 ">
              Token Total Supply:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-lg py-2 bg-[#d2582f] bg-opacity-5">
              {tokenSupply} {tokenSymbol}
            </h2>
          </div>
          <div className="my-2">
            <h2 className="text-lg text-center font-semibold text-[#7E7F9A] py-2 bg-[#d2582f] bg-opacity-20 ">
              Price Per Token:{" "}
            </h2>
            <h2 className="text-[#d2582f] text-center text-lg py-2 bg-[#d2582f] bg-opacity-5 flex items-center justify-center">
              {tokenPrice} ETH{" "}
              <span className="ml-1 flex items-center">
                <Image src={eth} width={20} height={20} />
              </span>
            </h2>
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="text-4xl font-semibold  bg-[#d2582f] bg-opacity-20 hover:border-slate-100 p-4 text-[rgb(126,127,154)] hover:text-[#e1130d] rounded-xl mt-[10%] w-[80%] hover:shadow-2xl focus:shadow-inner hover:bg-[#e1130d] hover:bg-opacity-10"
        >
          Disconnect!
        </button>
      </aside>
    </div>
  );
};

export default Token;
