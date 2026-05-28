import type { DataRepository } from "./repository";
import { getMockRepository } from "./mock-repository";

export function getRepository(): DataRepository {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (source === "firebase") {
    // Dynamic import to avoid loading firebase-admin in mock mode
    const { getFirebaseRepository } = require("./firebase-repository") as {
      getFirebaseRepository: () => DataRepository;
    };
    return getFirebaseRepository();
  }

  return getMockRepository();
}
