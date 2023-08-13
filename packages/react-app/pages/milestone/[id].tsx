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
      <div className="h1 -ml-8 mb-10 font-Telegraf text-4xl text-lena">
        {" "}
        <h1>{`Milestone Detail`}</h1>
      </div>{" "}
      <div className="flex flex-col justify-center items-center">
        <div className=" mb-10 bg-lena border border-black p-12 rounded-xl space-y-6">
          <div className="mb-10">
            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Grant Title
                </label>
                <p id="grantTitle" className="w-full text-gray-900 ">
                  {"zetstdjakdjbcjkabsdjkc"}
                  {attestation.grantTitle}
                </p>
              </div>
            </div>

            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Milestone Description
                </label>
                <p className="w-full text-gray-900 ">
                  {attestation.grantDescription}
                </p>
              </div>
            </div>

            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Milestone Number
                </label>
                <p className="w-full text-gray-900 ">
                  {attestation.milestoneNumber}
                </p>
              </div>
            </div>
            <div>
              <div className="mt-2 mr-4 flex flex-row ">
                <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                  Grant Amount
                </label>
                <p id="grantAmount" className="w-full text-gray-900 ">
                  {attestation.grantAmount}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className="inline-flex w-80 justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-gypsum text-black hover:bg-snow"
            onClick={() => createAttestation()}
          >
            {"Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
