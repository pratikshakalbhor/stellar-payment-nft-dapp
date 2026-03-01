import {
  rpc,
  Address,
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  scValToNative
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new rpc.Server(RPC_URL);

const CONTRACT_ID = "CC727BIT26EWN3XINZBVCEUDZONAA34ABNUDCDW724DMSKPOBZ2H6LQZ";

export async function getBalance(userAddress) {
  try {
    const account = await server.getAccount(userAddress);

    const contract = new Contract(CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          "balance",
          new Address(userAddress).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);

    const result = simulated.result?.retval;

    if (!result) return null;

    return scValToNative(result).toString();

  } catch (error) {
    console.error("Balance error:", error);
    return null;
  }
}