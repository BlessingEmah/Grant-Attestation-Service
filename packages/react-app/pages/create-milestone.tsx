import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useState } from "react";
import Link from "next/link";
import { useEthersSigner } from "../utils/ethers";
import { EASContractAddress } from "./grants";

export default function CreateApprovedGrantPage() {
  const signer = useEthersSigner();

  const [grantRecipient, setGrantRecipient] = useState(
    "0x99B551F0Bb2e634D726d62Bb2FF159a34964976C"
  );
  const [grantTitle, setGrantTitle] = useState("");
  const [grantUID, setGrantUID] = useState("");
  const [milestoneNumber, setMileStoneNumber] = useState(0);
  const [milestoneDescription, setMilestoneDescription] = useState("");

  const eas = new EAS(EASContractAddress);
  signer && eas.connect(signer);
  const schemaEncoder = new SchemaEncoder(
    "string grantTitle,uint8 milestoneNumber,string milestoneDescription"
  );

  //string RefUID,string grantTitle,uint256 milestoneNumber,string milestoneDescription,uint256 date,string status
  const encodedData = schemaEncoder.encodeData([
    { name: "grantTitle", value: grantTitle, type: "string" },
    { name: "milestoneNumber", value: milestoneNumber, type: "uint8" },
    {
      name: "milestoneDescription",
      value: milestoneDescription,
      type: "string",
    },
  ]);

  const schemaUID =
    "0x58af277318ecf43154ee125a1fb9046b9b517fbc6cd414438f30b8aa1cc166a5";

  const attestationUID =
    "0x5333d185ee3c27ee1a11ef4ea2b5a615cb0f3c279954c83d910f6308e4373cf8";

  const createAttestation = async () => {
    const offchainAttestation = await eas.attest(
      {
        schema: schemaUID,
        data: {
          recipient: grantRecipient,
          // Unix timestamp of when attestation expires. (0 for no expiration)
          /* eslint-disable-next-line */
          refUID: grantUID || attestationUID,
          expirationTime: BigInt(0),
          revocable: false,
          data: encodedData,
        },
      },
      {
        gasLimit: 2500000,
      }
    );

    console.log("New attestation UID:", offchainAttestation);
  };

  return (
    <div>
      <div className="h1 -ml-8 mb-10 font-Telegraf text-4xl text-lena">
        {" "}
        <h1>Create Milestone </h1>
      </div>{" "}
      <div className="flex flex-col justify-center items-center">
        <form
          className="bg-lena border border-black p-12 rounded-xl space-y-6"
          action="#"
          method="POST"
        >
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
                onChange={(e) => setGrantTitle(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="mt-2 mr-4 flex flex-row ">
              <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                Grant UID
              </label>
              <input
                id="grantTitle"
                name="grantTitle"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setGrantUID(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mt-2 mr-4 flex flex-row ">
              <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                Milestone Number
              </label>
              <input
                id="milestoneNumber"
                name="milestoneNumber"
                type="number"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setMileStoneNumber(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <div className="mt-2 mr-4 flex flex-row ">
              <label className="block w-80  text-m mr-4 mt-2 leading-6 font-medium text-gray-900">
                Milestone Description
              </label>
              <input
                id="milestoneDescription"
                name="milestoneDescription"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setMilestoneDescription(e.target.value)}
              />
            </div>
          </div>
        </form>
        <div>
          <button
            className="inline-flex w-80 justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-gypsum text-black hover:bg-snow"
            onClick={() => createAttestation()}
          >
            {"Create Attestation"}
          </button>
        </div>
        <div>
          Check out your{" "}
          <Link
            href="/grants"
            className="inline-flex items-center   px-1 pt-1 text-sm font-medium font-Garet text-blessing"
          >
            Grants
          </Link>
        </div>
      </div>
    </div>
  );
}
