"use client";

import { useRouter } from "next/router";
import {
  Attestation,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { useEffect, useState } from "react";
import { getNetwork } from "@wagmi/core";
import { useEthersSigner } from "../../utils/ethers";
import { EASContractAddress } from "../grants";
import { ethers } from "ethers";
import MilestoneTable from "@/components/MilestoneTable";

export default function GrantDetailPage() {
  const signer = useEthersSigner();
  const [attestation, setAttestation] = useState<{
    ID: string;
    grantTitle: string;
    grantDescription: string;
    numberOfMilestones: number;
    grantAmount: number;
  }>({});

  const router = useRouter();
  const { id } = router.query as { id: string };
  // const id =
  //   "0xb8106c50b334a974b863df6dfa095eddaa5017e29c6b70e124593854c3069d10";

  const eas = new EAS(EASContractAddress);
  signer && eas.connect(signer);
  console.log(EASContractAddress);

  const headerCells = [
    "ID",
    "Grant Title",
    " Grant UID",
    "Description",
    "Milestone Number",
  ];

  const schemaEncoder = new SchemaEncoder(
    "string grantTitle,string grantDescription,string numberOfMilestones,uint256 grantAmount"
  );

  const getAttestation = async () => {
    console.log(id);

    const result =
      id &&
      (await eas.getAttestation(
        id ||
          "0xb8106c50b334a974b863df6dfa095eddaa5017e29c6b70e124593854c3069d10"
      ));
    console.log(result);

    const decoded = schemaEncoder.decodeData(result?.data);
    console.log(decoded[0].value.value);

    setAttestation({
      ID: result.uid,
      grantTitle: decoded[0].value.value,
      grantDescription: decoded[1].value.value,
      numberOfMilestones: decoded[2].value.value,
      grantAmount: decoded[3].value.value,
    });
    console.log(attestation);
  };

  useEffect(() => {
    attestation.ID || getAttestation();
  });

  return (
    <div>
      <div className="h1 -ml-8 mb-10 font-Telegraf text-4xl text-lena">
        {" "}
        <h1>{`Grant Details `}</h1>
      </div>
      <div>Grant Details - TODO</div>
      <MilestoneTable
        columns={headerCells}
        rows={[attestation]}
      ></MilestoneTable>
      <div/>
      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Title
          </label>
          <p
            id="grantTitle"
            // name="grantTitle"
            // type="text"
            // required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    
          />
        </div>
      </div>

      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Recipient
          </label>
          <p
            id="grantRecipient"
            // name="grantRecipient"
            // type="text"
            // required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          />
        </div>
      </div>

      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Description
          </label>
          <p
            // id="grant description"
            // name="grantDescription"
            // type="text"
            // required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          
          />
        </div>
      </div>

      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Number of Milestones
          </label>
          <p
            id="numberOfMilestones"
            // name="numberOfMilestones"
            // type="number"
            // required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Amount
          </label>
          <p
            id="grantAmount"
            // name="grantAmount"
            // type="number"
            // required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
}
