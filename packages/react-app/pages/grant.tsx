"use client";

import { useRouter } from "next/navigation";

export default function ApprovedGrantPage() {
  const router = useRouter();
  console.log(router);
  return (
    <div>
      <div className="h1">Grant Page</div>
    </div>
  );
}
