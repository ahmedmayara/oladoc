"use server";

import { revalidatePath } from "next/cache";
import {
  BookAppointmentSchema,
  BookAppointmentSchemaType,
  BookAppointmentWithSpecialistSchema,
  BookAppointmentWithSpecialistSchemaType,
  RescheduleAppointmentSchema,
  RescheduleAppointmentSchemaType,
  UploadDocumentSchemaType,
} from "@/schemas";
import { AppointmentStatus } from "@prisma/client";
import { add, format, startOfToday } from "date-fns";

import { db } from "@/lib/db";

import { getCurrentSession, getPatientByUserId } from "./auth";

export async function getAllPatients() {
  try {
    const patients = await db.patient.findMany({
      include: {
        user: true,
        appointments: true,
      },
    });

    return patients;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientById(id: string | undefined) {
  try {
    const patient = await db.patient.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        appointments: true,
        prescriptions: true,
      },
    });

    return patient;
  } catch (error) {
    console.error(error);
  }
}

export async function getNewPatients() {
  try {
    const newPatients = await db.patient.findMany({
      where: {
        user: {
          createdAt: {
            gt: new Date(new Date().setDate(new Date().getDate() - 3)),
          },
        },
      },
      include: {
        user: true,
        appointments: true,
      },
    });

    return newPatients;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientsWithAtLeastOneAppointment(
  healthcareProviderId: string | undefined,
) {
  try {
    const patientsWithAtLeastOneAppointment = await db.patient.findMany({
      where: {
        appointments: {
          some: {
            healthCareProviderId: healthcareProviderId,
          },
        },
      },
      include: {
        user: true,
        appointments: true,
      },
      take: 4,
    });

    return patientsWithAtLeastOneAppointment;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientsCount() {
  try {
    const patientsCount = await db.patient.count();

    return patientsCount;
  } catch (error) {
    console.error(error);
  }
}

export async function getLatestPatients() {
  try {
    const latestPatients = await db.patient.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
      take: 5,
    });

    return latestPatients;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientsByMonth() {
  const users = await db.user.findMany({
    select: {
      createdAt: true,
    },
    where: {
      role: "PATIENT",
    },
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const PatientsPerMonth = Array(12)
    .fill(0)
    .map((_, index) => ({
      month: monthNames[index],
      totalUsers: users.filter((user) => {
        const date = new Date(user.createdAt);
        return date.getMonth() === index && date.getFullYear() === 2024;
      }).length,
    }));

  return PatientsPerMonth;
}

export async function getRandomSixPatients() {
  const patients = await db.patient.findMany({
    include: {
      user: true,
    },
    take: 6,
  });
  type people = {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  return {
    people: patients.map((patient, n) => ({
      id: n,
      name: patient.user.name,
      designation: patient.user.gender,
      image: patient.user.image,
    })),
  };
}
export async function getPatientsByGender() {
  var male: number = 0;
  var female: number = 0;
  const patients = await db.patient.findMany({
    include: {
      user: true,
    },
  });

  patients.map((patient) => {
    if (patient.user.gender === "MALE") {
      male++;
    } else {
      female++;
    }
  });
  const PatientsByGender = [
    {
      data: [
        {
          id: 0,
          value: male,
          label: "Male",
        },
        {
          id: 1,
          value: female,
          label: "Female",
        },
      ],
    },
  ];
  return PatientsByGender;
}

export async function getPatientPastAppointments(id: string | undefined) {
  try {
    const currentUser = await db.user.findUnique({
      where: {
        id,
      },
    });

    const currentPatient = await db.patient.findUnique({
      where: {
        userId: currentUser?.id,
      },
    });

    const pastAppointments = await db.appointment.findMany({
      where: {
        patientId: currentPatient?.id,
        date: {
          lt: startOfToday(),
        },
      },
      include: {
        healthCareProvider: {
          include: {
            user: true,
          },
        },
      },
    });

    return pastAppointments;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientUpcomingAppointments(id: string | undefined) {
  try {
    const currentUser = await db.user.findUnique({
      where: {
        id,
      },
    });

    const currentPatient = await db.patient.findUnique({
      where: {
        userId: currentUser?.id,
      },
    });

    const upcomingAppointments = await db.appointment.findMany({
      where: {
        patientId: currentPatient?.id,
        date: {
          gte: startOfToday(),
        },
      },
      include: {
        healthCareProvider: {
          include: {
            user: true,
          },
        },
      },
    });

    return upcomingAppointments;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientAppointments(id: string | undefined) {
  try {
    const currentUser = await db.user.findUnique({
      where: {
        id,
      },
    });

    const currentPatient = await db.patient.findUnique({
      where: {
        userId: currentUser?.id,
      },
    });

    const appointments = await db.appointment.findMany({
      where: {
        patientId: currentPatient?.id,
        status: "COMPLETED",
      },
      include: {
        healthCareProvider: {
          include: {
            user: true,
          },
        },
      },
    });

    return appointments;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientDocuments(patientId: string | undefined) {
  try {
    const patientDocuments = await db.document.findMany({
      where: {
        patientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return patientDocuments;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadDocument(
  values: UploadDocumentSchemaType,
  patientId: string,
) {
  try {
    const { title: name, description, file: url } = values;

    const document = await db.document.create({
      data: {
        name,
        description,
        url,
        patientId,
      },
    });

    if (document) {
      revalidatePath("/patient/dashboard/medical-documents");
      return { success: "Document uploaded successfully" };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteDocument(id: string) {
  try {
    const document = await db.document.delete({
      where: {
        id,
      },
    });

    if (document) {
      revalidatePath("/patient/dashboard/medical-documents");
      return { success: "Document deleted successfully" };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function bookAppointment(
  values: BookAppointmentSchemaType,
  healthCareProviderId: string | undefined,
) {
  try {
    const user = await getCurrentSession();

    const patient = await getPatientByUserId(user?.id);

    const validatedFields = BookAppointmentSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      date,
      time,
      symptomsType,
      symptoms,
      symptomsDuration,
      symptomsLength,
      symptomsSeverity,
      additionalImages,
    } = validatedFields.data;

    await db.appointment.create({
      data: {
        title: `Appointment with ${patient?.user.name}`,
        description: `Appointment with ${patient?.user.name} on ${format(
          new Date(date),
          "EEEE, MMMM d yyyy",
        )} at ${format(new Date(time), "HH:mm")}`,
        date,
        startTime: new Date(time),
        endTime: add(new Date(time), { minutes: 30 }),
        symptomsType,
        symptoms,
        symptomsDuration,
        symptomsLength,
        symptomsSeverity,
        additionalImages,
        patient: {
          connect: {
            id: patient?.id,
          },
        },
        healthCareProvider: {
          connect: {
            id: healthCareProviderId,
          },
        },
      },
    });

    return { success: "Appointment booked successfully." };
  } catch (error) {
    console.error(error);
  }
}

export async function BookAppointmentWithSpecialist(
  values: BookAppointmentWithSpecialistSchemaType,
  healthCareProviderId: string | undefined,
) {
  try {
    const user = await getCurrentSession();

    const patient = await getPatientByUserId(user?.id);

    const validatedFields =
      BookAppointmentWithSpecialistSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { date, time, additionalImages } = validatedFields.data;

    await db.appointment.create({
      data: {
        title: `Appointment with ${patient?.user.name}`,
        description: `Appointment with ${patient?.user.name} on ${format(
          new Date(date),
          "EEEE, MMMM d yyyy",
        )} at ${format(new Date(time), "HH:mm")}`,
        date,
        startTime: new Date(time),
        endTime: add(new Date(time), { minutes: 30 }),
        additionalImages,
        patient: {
          connect: {
            id: patient?.id,
          },
        },
        healthCareProvider: {
          connect: {
            id: healthCareProviderId,
          },
        },
      },
    });

    return { success: "Appointment booked successfully." };
  } catch (error) {
    console.error(error);
  }
}

export async function cancelAppointment(id: string | undefined) {
  try {
    const appointment = await db.appointment.update({
      where: {
        id,
      },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });

    if (appointment) {
      revalidatePath("/patient/dashboard/appointments");
      return { success: "Appointment cancelled successfully." };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function rescheduleAppointment(
  id: string | undefined,
  values: RescheduleAppointmentSchemaType,
) {
  try {
    const validatedFields = RescheduleAppointmentSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { date, time } = validatedFields.data;

    await db.appointment.update({
      where: {
        id,
      },
      data: {
        date,
        startTime: new Date(time),
        endTime: add(new Date(time), { minutes: 30 }),
        description: `Appointment rescheduled on ${format(
          new Date(date),
          "EEEE, MMMM d yyyy",
        )} at ${format(new Date(time), "HH:mm")}`,
      },
    });

    revalidatePath("/patient/dashboard/appointments");

    return { success: "Appointment rescheduled successfully." };
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientTotalAppointments() {
  try {
    const user = await getCurrentSession();

    const patient = await getPatientByUserId(user?.id);

    const totalAppointments = await db.appointment.count({
      where: {
        patientId: patient?.id,
      },
    });

    return totalAppointments;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientTotalConsultations() {
  try {
    const user = await getCurrentSession();

    const patient = await getPatientByUserId(user?.id);

    const totalConsultations = await db.appointment.count({
      where: {
        patientId: patient?.id,
        status: AppointmentStatus.COMPLETED,
      },
    });

    return totalConsultations;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientTotalMedicalDocuments() {
  try {
    const user = await getCurrentSession();

    const patient = await getPatientByUserId(user?.id);

    const totalMedicalDocuments = await db.document.count({
      where: {
        patientId: patient?.id,
      },
    });

    return totalMedicalDocuments;
  } catch (error) {
    console.error(error);
  }
}

export async function getPatientRecentMedicalDocuments() {
  try {
    const user = await getCurrentSession();

    const patient = await getPatientByUserId(user?.id);

    const recentMedicalDocuments = await db.document.findMany({
      where: {
        patientId: patient?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return recentMedicalDocuments;
  } catch (error) {
    console.error(error);
  }
}
