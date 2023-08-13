import { useEffect, useState } from "react";
import { Client, cacheExchange, fetchExchange, gql, useQuery } from "urql";
import { useAccount } from "wagmi";
import { getNetwork } from "@wagmi/core";
import Table from "@/components/Table";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useEthersSigner } from "@/utils/ethers";
import { setDefaultResultOrder } from "dns";

const { chain } = getNetwork();
console.log(chain);

export const EASContractAddress =
  chain && chain.network === "base-goerli"
    ? "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A" // GoerliBase v0.26
    : "0x4200000000000000000000000000000000000021";

export default function GrantsListPage() {
  const headerCells = [
    "ID",
    "Title",
    "Recipient",
    "Description",
    "Milestones",
    "Amount",
  ];
  const { chain, chains } = getNetwork();
  const signer = useEthersSigner();
  const [role, setRole] = useState(true);

  const eas = new EAS(EASContractAddress);
  signer && eas.connect(signer);
  console.log(EASContractAddress);
  const { address } = useAccount();
  const client = new Client({
    url: `https://${chain?.network}.easscan.org/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  });
  const schemaUID =
    "0x1d949c379bc009756054090b4b06e35492b387e6892ba4fe50d72c64ff37b2ce";

  const schemaEncoder = new SchemaEncoder(
    "string grantTitle,string grantDescription,uint8 numberOfMilestones,uint256 grantAmount"
  );

  const [attestations, setAttestations] = useState<
    Array<{
      refUID: string;
      grantRecipient: string;
      // multisigWallet: string;
      grantDescription: string;
      title: string;
      milestones: BigInt;
      amount: BigInt;
    }>
  >([]);

  const getAttestations = async () => {
    // TODO: filter for schema
    //   schema(where: { id: $schemaUID }) {
    // }
    const query = role
      ? gql`
          query ($userAddress: String) {
            attestations(
              take: 1
              orderBy: { time: desc }
              where: { attester: { equals: $userAddress } }
            ) {
              id
              attester
              recipient
              refUID
              data
            }
          }
        `
      : gql`
          query ($userAddress: String) {
            attestations(
              take: 1
              orderBy: { time: asc }
              where: { recipient: { equals: $userAddress } }
            ) {
              id
              attester
              recipient
              refUID
              data
            }
          }
        `;

    const result = await client
      .query(query, { userAddress: address })
      .toPromise();
    const attestationList = result.data?.attestations?.map((att: any) => {
      console.log(att.data);
      const decoded = schemaEncoder.decodeData(att?.data);

      console.log(decoded);
      // console.log(decoded[0].value.value);
      return {
        refUID: att.id,
        grantRecipient: att.recipient,
        // multisigWallet: att.data.multisigWallet,
        title: decoded[0].value.value,
        grantDescription: decoded[1].value.value,
        numberOfMilestones: decoded[2].value.value.toString(),
        grantAmount: decoded[3].value.value.toString(),
      };
    });
    console.log(attestationList);

    if (result.error) throw result.error;
    if (result.data?.attestations) setAttestations(attestationList);
  };

  function switchMode(isGrantManager: boolean) {
    setRole(isGrantManager);
    getAttestations();
  }

  useEffect(() => {
    attestations.length === 0 && getAttestations();
  }, [attestations, role]);
  return (
    <div>
      <div className="h1 -ml-8 mb-10 font-Telegraf text-4xl text-lena">
        {" "}
        <h1>Grants List</h1>
      </div>
      <div className="flex flex-row justify-center">
        <div>
          <button
            className="text-blessing inline-flex w-80 justify-center rounded-full  px-5 my-5 py-2 text-md font-medium  text-black hover:bg-snow"
            onClick={() => switchMode(true)}
          >
            {"Grant Manager"}
          </button>
        </div>
        <div>
          <button
            className="text-blessing inline-flex w-80 justify-center rounded-full  px-5 my-5 py-2 text-md font-medium  text-black hover:bg-snow"
            onClick={() => switchMode(false)}
          >
            {"Grant Recipient"}
          </button>
        </div>
      </div>
      <Table columns={headerCells} rows={attestations} chain={chain} />
    </div>
  );
}
