"use client";

import React from "react";

import { useSearchParams } from "next/navigation";
import { MapPinIcon, SearchIcon } from "lucide-react";

import { Container } from "@/components/container";
import { Logo } from "@/components/marketing/logo";

import { Button } from "./ui/button";

export function SearchResultsNavbar() {
  const searchParams = useSearchParams();

  const speciality = searchParams.get("speciality");
  const location = searchParams.get("location");
  return (
    <div className="border-b bg-muted/40">
      <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Logo className="h-8 w-8" />
          <span className="ml-3 text-xl font-bold tracking-tight text-blue-600">
            Oladoc
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <Button variant="blue" className="rounded-full">
            Sign In
          </Button>
          <Button variant="secondary" className="rounded-full">
            Get Started
          </Button>
        </div>
      </div>
      <Container className="max-w-[1600px]">
        <div className="flex items-center justify-center pb-6">
          <div className="flex h-[4rem] w-full flex-row items-center justify-center gap-x-4 rounded-full border bg-gray-50 px-6 py-3 placeholder-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
            <div className="relative flex w-full items-center">
              <SearchIcon className="absolute h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Speaciality, doctor, or center"
                className="ml-8 h-full w-full border-r bg-transparent placeholder-muted-foreground outline-none"
                defaultValue={speciality || ""}
              />
            </div>
            <div className="relative flex w-full items-center">
              <MapPinIcon className="absolute h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Location"
                className="ml-8 h-full w-full bg-transparent placeholder-muted-foreground outline-none"
                defaultValue={location || ""}
              />
            </div>
            <Button variant="blue" size="lg" className="rounded-full">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}