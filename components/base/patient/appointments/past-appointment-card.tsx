import React from "react";

import { getAppointmentWithHPById } from "@/actions/appointment";
import { getHealthCareProviderById } from "@/actions/healthcare-provider";
import { AppointmentStatus } from "@prisma/client";
import { ClockIcon } from "@radix-ui/react-icons";
import { format, getDay } from "date-fns";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { AppointmentDetailsDialog } from "./dialogs/appointment-details-dialog";

interface PastAppointmentCardProps {
  appointment: Awaited<ReturnType<typeof getAppointmentWithHPById>>;
}

function getDayOfWeek(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function PastAppointmentCard({ appointment }: PastAppointmentCardProps) {
  return (
    <div className="flex rounded-xl border bg-white py-4">
      <div className="flex flex-col items-center justify-center gap-1 px-12">
        <h2 className="text-xl font-semibold">
          {getDayOfWeek(new Date(appointment?.date || new Date()))}
        </h2>
        <p className="text-4xl font-bold text-blue-600">
          {format(new Date(appointment?.date || new Date()), "dd")}
        </p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(appointment?.date || new Date()), "MMMM yyyy")}
        </p>
      </div>

      <Separator orientation="vertical" className="h-[6.5rem]" />

      <div className="flex flex-col justify-between gap-2 px-6 py-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={appointment?.healthCareProvider?.user.image || ""}
              alt={appointment?.healthCareProvider?.user.name}
            />
            <AvatarFallback>
              {appointment?.healthCareProvider?.user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">
              {appointment?.healthCareProvider?.user.name}
            </p>
            <p className="text-muted-foreground">
              {appointment?.healthCareProvider?.speciality}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <ClockIcon className="h-5 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-muted-foreground">
            <p>{format(appointment?.startTime || new Date(), "hh:mm a")} - </p>
            <p>{format(appointment?.endTime || new Date(), "hh:mm a")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 px-6 py-4">
        <div className="text-sm">
          <p className="font-medium">{appointment?.title}</p>
          <p className="text-muted-foreground">{appointment?.description}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <p className="text-muted-foreground">Status:</p>
          <span
            className={cn(
              "rounded-sm px-2.5 py-1 text-xs font-medium",
              appointment?.status === AppointmentStatus.PENDING &&
                "bg-[#FFE097] text-[#A78025]",
              appointment?.status === AppointmentStatus.CANCELLED &&
                "bg-rose-100 text-rose-600",
              appointment?.status === AppointmentStatus.UPCOMING &&
                "bg-teal-300 text-teal-600",
              appointment?.status === AppointmentStatus.COMPLETED &&
                "bg-blue-100 text-blue-600",
            )}
          >
            {appointment!.status.charAt(0).toUpperCase() +
              appointment!.status.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 px-6 py-4">
        <AppointmentDetailsDialog appointment={appointment} />
      </div>
    </div>
  );
}
