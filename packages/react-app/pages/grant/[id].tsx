"use client";

import { useRouter } from "next/router";
import {
  Attestation,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { useEffect, useState } from "react";
import { getNetwork } from "@wagmi/core";
import { Client, cacheExchange, fetchExchange, gql, useQuery } from "urql";

import { useEthersSigner } from "../../utils/ethers";
import { EASContractAddress } from "../grants";
import { ethers } from "ethers";
import MilestoneTable from "@/components/MilestoneTable";
import { useAccount } from "wagmi";

export default function GrantDetailPage() {
  // TODO: load grant attestaion into details, query grant details
  // TODO: load milestone list and input into table
  const { chain } = getNetwork();
  const signer = useEthersSigner();
  const router = useRouter();
  const { id } = router.query as { id: string };

  // const id =
  //   "0xb8106c50b334a974b863df6dfa095eddaa5017e29c6b70e124593854c3069d10";

  const eas = new EAS(EASContractAddress);
  signer && eas.connect(signer);
  console.log(EASContractAddress);
  const { address } = useAccount();
  const client = new Client({
    url: `https://${chain?.network}.easscan.org/graphql`,
    exchanges: [cacheExchange, fetchExchange],
  });

  const grantUID =
    "0xf6b3197f9bac43aed3c95a8e658eea3e7f19e315d04f87ebf222b3087a4101f9";

  const headerCells = [
    "ID",
    "Grant Title",
    "Grant UID",
    "Description",
    "Milestone Number",
  ];
  const [role, setRole] = useState(true);
  const [attestations, setAttestations] = useState<
    Array<{
      ID: string;
      grantTitle: string;
      grantUID: string;
      milestoneDescription: string;
      milestoneNumber: BigInt;
    }>
  >([]);

  const schemaEncoder = new SchemaEncoder(
    "string grantTitle,uint8 milestoneNumber,string milestoneDescription"
  );

  const getAttestations = async () => {
    // TODO: filter for refUId
    // const query = gql`
    //   query ($refUID: String) {
    //     attestations(
    //       take: 1
    //       orderBy: { time: desc }
    //       where: { refUID: { equals: $refUID } }
    //     ) {
    //       id
    //       attester
    //       recipient
    //       refUID
    //       data
    //     }
    //   }
    // `;
    const query = gql`
      query () {
        attestations(
          take: 1
          orderBy: { time: desc }
        ) {
          id
          attester
          recipient
          refUID
          data
        }
      }
    `;

    const result = await client.query(query, {}).toPromise();
    const attestationList = result.data?.attestations?.map((att: any) => {
      console.log(att.data);
      const decoded = schemaEncoder.decodeData(att?.data);

      console.log(decoded);
      // console.log(decoded[0].value.value);
      return {
        ID: att.id,
        grantTitle: decoded[0].value.value,
        grantUID,
        milestoneDescription: decoded[1].value.value.toString(),
        milestoneNumber: decoded[2].value.value.toString(),
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
        <h1>{`Grant Details `}</h1>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className=" mb-10 bg-lena border border-black p-12 rounded-xl space-y-6">
          <div className="mb-10">
            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Grant Title
                </label>
                <p id="grantTitle" className="w-full text-gray-900 ">
                  {"Research Grant"}
                </p>
              </div>
            </div>

            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Grant Description
                </label>
                <p className="w-full text-gray-900 ">{"lots of work"}</p>
              </div>
            </div>

            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Number of Milestones
                </label>
                <p className="w-full text-gray-900 ">1/2</p>
              </div>
            </div>
            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Grant Amount
                </label>
                <p id="grantAmount" className="w-full text-gray-900 ">
                  1000/2000
                </p>
              </div>
            </div>
          </div>
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Milestones
          </label>
          <MilestoneTable
            columns={headerCells}
            rows={[attestations]}
          ></MilestoneTable>
        </div>
      </div>
    </div>
  );
}
