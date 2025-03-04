import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-visor  ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-16 w-auto sm:block lg:block"
                    src="/logo1.svg"
                    width="24"
                    height="24"
                    alt="GrantVisor Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/"
                    className="inline-flex items-center   px-1 pt-1 text-sm font-medium font-Garet text-blessing"
                  >
                    Home
                  </Link>
                  <Link
                    href="/create-grant"
                    className="inline-flex items-center   px-1 pt-1 text-sm font-medium font-Garet text-blessing"
                  >
                    Create Grant
                  </Link>
                  <Link
                    href="/create-milestone"
                    className="inline-flex items-center   px-1 pt-1 text-sm font-medium font-Garet text-blessing"
                  >
                    Create Milestone
                  </Link>
                  <Link
                    href="/grants"
                    className="inline-flex items-center   px-1 pt-1 text-sm font-medium font-Garet text-blessing"
                  >
                    Grants
                  </Link>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ConnectButton
                  showBalance={{ smallScreen: false, largeScreen: false }}
                  chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
                  accountStatus="avatar"
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4  py-2 pl-3 pr-4 text-base font-medium font-Garet text-black"
              >
                Home
              </Disclosure.Button>
              {/* Add here your custom menu elements */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
