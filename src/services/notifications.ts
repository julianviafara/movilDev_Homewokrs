import { LocalNotifications } from "@capacitor/local-notifications";

let nextId = 1;

export async function notify(title: string, body: string) {
  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") return;
    await LocalNotifications.schedule({
      notifications: [
        {
          id: nextId++,
          title,
          body,
          schedule: { at: new Date(Date.now() + 500) },
        },
      ],
    });
  } catch {
  }
}

export async function notifyMissionCompleted(remaining: number) {
  await notify("Misiones", "Has completado una misión");
  if (remaining === 1) {
    await notify("Misiones", "Te falta 1 misión para completar");
  }
}
