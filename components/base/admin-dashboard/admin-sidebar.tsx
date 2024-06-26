"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@radix-ui/react-icons";
import { SettingsIcon, UsersIcon } from "lucide-react";
import { BsHospital } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";

import { Logo } from "@/components/marketing/logo";

import { AdminSidebarButton } from "./admin-sidebar-button";

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="col-start-1 row-start-1 row-end-3 hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="h-6 w-6" />
            <span className="text-blue-600">Oladoc</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-y-1 px-2 py-2 text-sm font-medium lg:px-4">
            <AdminSidebarButton
              label="Dashboard"
              icon={HomeIcon}
              href="/admin/dashboard"
              isActive={pathname === "/admin/dashboard"}
            />
            <AdminSidebarButton
              label="Healthcare Providers"
              icon={FaUserDoctor}
              href="/admin/healthcare-providers"
              isActive={pathname === "/admin/healthcare-providers"}
            />
            <AdminSidebarButton
              label="Healthcare Centers"
              icon={BsHospital}
              href="/admin/healthcare-centers"
              isActive={pathname === "/admin/healthcare-centers"}
            />
            <AdminSidebarButton
              label="Patients"
              icon={UsersIcon}
              href="/admin/patients"
              isActive={pathname === "/admin/patients"}
            />
            <AdminSidebarButton
              label="Settings"
              icon={SettingsIcon}
              href="/admin/settings/general"
              isActive={pathname === "/admin/settings/general"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
