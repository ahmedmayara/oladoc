"use server";

import { db } from "@/lib/db";

import { getUserByHealthcareProviderId } from "../auth";

export async function getHealthcareProviderNotifications(
  healthcareProviderId: string | undefined,
) {
  try {
    const healthcareProvider =
      await getUserByHealthcareProviderId(healthcareProviderId);

    const notifications = await db.notification.findMany({
      where: {
        userId: healthcareProvider?.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error(error);
  }
}

export async function archiveNotification(notificationId: string) {
  try {
    const notification = await db.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        archived: true,
        read: true,
      },
    });

    return notification;
  } catch (error) {
    console.error(error);
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await db.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return notification;
  } catch (error) {
    console.error(error);
  }
}
