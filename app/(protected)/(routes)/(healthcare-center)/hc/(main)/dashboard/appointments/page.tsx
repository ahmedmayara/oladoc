import React from "react";

import { Calendar } from "@/components/base/healthcare-center/calendar";
import { Header } from "@/components/base/healthcare-center/dashboard/header";
import {
  MobileSidebar,
  Sidebar,
} from "@/components/base/healthcare-center/dashboard/sidebar";

export default async function HealthcareCenterAppointmentsPage() {
  return (
    <div>
      <Sidebar />
      <Header className="lg:py-0">
        <MobileSidebar />
      </Header>
      <Calendar />
    </div>
  );
}
