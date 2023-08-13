import { Attestation } from "@ethereum-attestation-service/eas-sdk";
import { Card, Typography } from "@material-tailwind/react";
import { getNetwork } from "@wagmi/core";
import Link from "next/link";

export default function MilestoneTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<{
    ID: string;
    grantTitle: string;
    grantUID: string;
    milestoneDescription: string;
    milestoneNumber: number;
  }>;
}) {
  const { chain, chains } = getNetwork();

  return (
    <Card className="h-full w-full overflow-scroll block rounded-ml ">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {columns.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(
            (
              {
                ID,
                grantTitle,
                grantUID,
                milestoneDescription,
                milestoneNumber,
              },
              index
            ) => {
              const isLast = index === rows.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b bg-lena2 border-blue-gray-50";

              return (
                <tr key={ID}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      <a
                        href={`https://${chain?.network}.easscan.org/attestation/view/${rows.uid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {ID}
                      </a>
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {grantTitle || "Research"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {grantUID ||
                        "0x999b3693636ab6ebcc20a702617a21cb4835dee40a8fc174b062b481e6873592"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {milestoneDescription || "Milestone 1"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {milestoneNumber || 1}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <Link
                        href={{
                          pathname: "/milestone/[id]",
                          query: {
                            id:
                              ID ||
                              "0xa0b17f53dcf4f8feae7224a11553c9a3256533cd97da49a4207503b1fcd29baf",
                          },
                        }}
                      >
                        Approve
                      </Link>
                    </Typography>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </Card>
  );
}
