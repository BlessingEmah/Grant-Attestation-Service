"use client";

import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EASContractAddress } from "../grants";
import { useEthersSigner } from "@/utils/ethers";

export default function MilestoneDetailPage() {
  const signer = useEthersSigner();
  const [attestation, setAttestation] = useState<{
    ID: string;
    grantTitle: string;
    grantDescription: string;
    numberOfMilestones: number;
    grantAmount: number;
  }>({});
  const router = useRouter();
  const { id } =
    (router?.query as { id: string }) ||
    "0xf1ce87603985c991360d3a72dafa47789c8dd0b664c83f9937762c32897d3506";

  const eas = new EAS(EASContractAddress);
  signer && eas.connect(signer);
  console.log(EASContractAddress);

  const schemaEncoder = new SchemaEncoder(
    "string grantTitle,uint256 milestoneNumber,string milestoneDescription"
  );

  const getAttestation = async () => {
    console.log(id);

    const result = await eas.getAttestation(id);
    console.log(result);

    const decoded = schemaEncoder.decodeData(result?.data);
    console.log(decoded[0].value.value);

    // setAttestation({
    //   ID: result.uid,
    //   grantTitle: decoded[0].value.value,
    //   milestoneNumber: decoded[1].value.value,
    //   milestoneDescription: decoded[2].value.value,
    //   grantUID: result.refUID,
    // });
    console.log(attestation);
  };

  useEffect(() => {
    attestation.ID || getAttestation();
  });

  return (
    <div>
      <div className="h1">Milestone Page</div>
      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Title
          </label>
          <input
            id="grantTitle"
            name="grantTitle"
            type="text"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Recipient
          </label>
          <input
            id="grantRecipient"
            name="grantRecipient"
            type="text"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Description
          </label>
          <input
            id="grant description"
            name="grantDescription"
            type="text"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Number of Milestones
          </label>
          <input
            id="numberOfMilestones"
            name="numberOfMilestones"
            type="number"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <div className="mt-2 mr-4 flex flex-row ">
          <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
            Grant Amount
          </label>
          <input
            id="grantAmount"
            name="grantAmount"
            type="number"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"          />
        </div>
      </div>
    </div>
  );
}
