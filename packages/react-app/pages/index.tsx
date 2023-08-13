import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        className="block h-800 w-auto  sm:block lg:block"
        src="/home-1.svg"
        width="200"
        height="100"
        alt="Homepage"
      />
      <div className="inline-flex w-80 justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-gypsum text-black hover:bg-snow">
        <Link
          href="/create-grant"
          className="inline-flex items-center   px-1 pt-1 text-sm font-medium font-Garet text-black"
        >
          Create a Grant
        </Link>
      </div>
      <Image
        className="block h-800 w-auto  sm:block lg:block"
        src="/home-2.svg"
        width="200"
        height="100"
        alt="Homepage"
      />
      <Image
        className="block h-800 w-auto  sm:block lg:block"
        src="/home-3.svg"
        width="200"
        height="100"
        alt="Homepage"
      />
    </div>
  );
}
