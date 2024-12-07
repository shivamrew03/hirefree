/* eslint-disable @next/next/no-img-element */
import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetContent,
} from "@/components/ui/Sheet";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Dropdown } from "../common";
import { ArrowUpRight, BurgerMenu, Close } from "@/icons";
import { useAccount } from "wagmi";
import ConnectButton from "./ConnectButton";

const Navbar = () => {
  const router = useRouter();
  const { address, isConnected, chainId } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Overview",
      href: "/home",
    },
    {
      name: "My projects",
      href: `/${address}/projects`,
    },
    {
      name: "Hire a freelancer",
      href: "/hire-freelancer",
    },{
      name: "Register as freelancer",
      href: "/register/freelancer"
    }
  ];
  return (
    <nav className="relative h-[80px] flex items-center pr-6 lg:pr-12 bg-white shadow-lg mb-8">
      <a
        target="_blank"
        rel="noreferrer noopener"
        href=""
        className="flex items-center h-full"
      >
        <img
          src="https://i.ibb.co/fvm0GbB/logojj.png"
          alt="HireFree Logo"
          className="h-[80px] w-auto object-contain"
        />
      </a>
      <BurgerMenu
        className="block tablet:hidden cursor-pointer hover:text-blue-500 transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      />
      <ul className="hidden tablet:flex h-full gap-8 xl:gap-12 text-[15px] font-medium">
        {links.map((link, index) => (
          <li
            className="h-full relative text-gray-800 hover:text-blue-500 transition-colors"
            key={index}
          >
            <Link href={link.href} className="flex items-center h-full px-2">
              {link.name}
            </Link>
            <div
              className={`${
                router.pathname === link.href
                  ? "h-[3px] bg-blue-500 w-full absolute bottom-0"
                  : "h-[3px] bg-transparent w-0 absolute bottom-0 transition-all duration-300 group-hover:w-full group-hover:bg-blue-500"
              }`}
            ></div>
          </li>
        ))}
      </ul>
      <div className="hidden tablet:flex items-center gap-4 ml-auto">
        <ConnectButton />
      </div>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent className="bg-white p-6">
          <SheetTitle hidden>Menu</SheetTitle>
          <SheetClose className="absolute right-5 top-5 hover:text-blue-500 transition-colors">
            <Close />
          </SheetClose>
          <ul className="flex flex-col gap-8 text-[16px] w-full mt-12">
            {links.map((link, index) => (
              <li key={index} className="hover:text-blue-500 transition-colors">
                <Link
                  className={`w-full block py-2 ${
                    router.pathname === link.href
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "border-b border-gray-100"
                  }`}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <ConnectButton />
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
