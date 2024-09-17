const //
  { JsonRpcProvider } = require("ethers"),
  provider = new JsonRpcProvider("https://rpc2.sepolia.org"),
  //
  test = async () => {
    console.log(
      await provider.getBalance("0x7B2359fBDEe8c890cc92b138b05e52696EaE4590")
    );
    console.timeEnd("fetched in:");
  };

console.time("fetched in:");
test();
