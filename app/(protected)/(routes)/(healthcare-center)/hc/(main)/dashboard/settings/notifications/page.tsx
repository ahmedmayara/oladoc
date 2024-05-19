import React from "react";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthcareCenterButton } from "@/components/auth/healthcare-center-button";
import { Header } from "@/components/base/healthcare-center/dashboard/header";
import { SearchButton } from "@/components/base/healthcare-center/dashboard/search-button";
import {
  MobileSidebar,
  Sidebar,
} from "@/components/base/healthcare-center/dashboard/sidebar";

export default function NotificationsHcPage() {
  return (
    <div>
      <Sidebar />
      <Header>
        <MobileSidebar />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/hc/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/hc/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchButton />
        <HealthcareCenterButton />
      </Header>
      <ScrollArea className="col-start-1 col-end-3 flex-1 md:col-start-2">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <nav className="grid gap-4 text-sm text-muted-foreground">
              <Link href="/hc/dashboard/settings">General</Link>
              <Link href="/hc/dashboard/settings/security">Security</Link>
              <Link
                href="/hc/dashboard/settings/notifications"
                className="font-semibold text-primary"
              >
                Notifications
              </Link>
            </nav>
            <div className="grid gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        Manage your notification settings.
                      </CardDescription>
                    </CardHeader>
                  </div>
                </div>
                <CardContent className="border p-7">
                  <form className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pr-5">
                      <div className="items-top flex space-x-2">
                        <div className="grid gap-1.5 leading-none">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email notifications
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Get notified by email when something happens.
                          </p>
                        </div>
                      </div>
                      <div>
                        <Checkbox />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardContent className="border p-7">
                  <form className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pr-5">
                      <div className="items-top flex space-x-2">
                        <div className="grid gap-1.5 leading-none">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            In app notifications
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                      </div>
                      <div>
                        <Checkbox checked />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
}
