/**
 * Firebase seed script (Phase B)
 * Run with: npx tsx firebase/seed.ts
 * Requires FIREBASE_ADMIN_* env vars
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import students from "../src/data/seed/students.json";
import interviews from "../src/data/seed/interviews.json";
import aiAnalysis from "../src/data/seed/ai-analysis.json";
import notifications from "../src/data/seed/notifications.json";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Set FIREBASE_ADMIN_* environment variables");
  process.exit(1);
}

initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});

const db = getFirestore();

async function seed() {
  for (const student of students) {
    const { id, ...data } = student as { id: string } & Record<string, unknown>;
    await db
      .collection("students")
      .doc(id)
      .set({
        ...data,
        createdAt: Timestamp.fromDate(new Date(data.createdAt as string)),
        updatedAt: Timestamp.fromDate(new Date(data.updatedAt as string)),
        lastReplyAt: Timestamp.fromDate(new Date(data.lastReplyAt as string)),
        lastInterviewAt: Timestamp.fromDate(
          new Date(data.lastInterviewAt as string)
        ),
      });
  }

  for (const interview of interviews) {
    const { id, ...data } = interview as { id: string } & Record<string, unknown>;
    await db
      .collection("interviews")
      .doc(id)
      .set({
        ...data,
        createdAt: Timestamp.fromDate(new Date(data.createdAt as string)),
      });
  }

  for (const analysis of aiAnalysis) {
    const { id, ...data } = analysis as { id: string } & Record<string, unknown>;
    await db
      .collection("ai_analysis")
      .doc(id)
      .set({
        ...data,
        createdAt: Timestamp.fromDate(new Date(data.createdAt as string)),
      });
  }

  for (const notif of notifications) {
    const { id, ...data } = notif as { id: string } & Record<string, unknown>;
    await db
      .collection("notifications")
      .doc(id)
      .set({
        ...data,
        createdAt: Timestamp.fromDate(new Date(data.createdAt as string)),
      });
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
