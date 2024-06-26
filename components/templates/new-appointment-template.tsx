import React from "react";

import { getPatientByUserId } from "@/actions/auth";
import { Appointment, User } from "@prisma/client";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { format } from "date-fns";

interface VerifyEmailTemplateProps {
  user: User;
  patient: Awaited<ReturnType<typeof getPatientByUserId>>;
  appointment: Appointment;
}

export function NewAppointmentTemplate({
  user,
  patient,
  appointment,
}: VerifyEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>New Appointment</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="w-full max-w-[600px]">
            <Section className="flex items-center justify-center">
              <Text className="text-3xl font-bold tracking-tighter text-blue-600">
                Oladoc
              </Text>
            </Section>
            <Heading className="text-4xl font-bold text-blue-600">
              New Appointment
            </Heading>
            <Text className="mt-4 text-base text-muted-foreground">
              Hi <strong>{user.name}</strong>, You have a new appointment with{" "}
              <strong>{patient?.user.name}</strong>. The appointment is on{" "}
              <strong>
                {format(appointment?.date || new Date(), "EEEE, MMMM do, yyyy")}
              </strong>{" "}
              at{" "}
              <strong>
                {format(appointment?.startTime || new Date(), "HH:mm")}
              </strong>
            </Text>
            <Section className="mb-5 text-center">
              <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                View Appointment
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
