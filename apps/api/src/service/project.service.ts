import { prisma } from "../lib/prisma.js";
import { generateApiKey, hashApiKey } from "../utils/api-Key.js";

export async function createProject(name: string) {
  const apiKey = generateApiKey();
  const apiKeyHash = hashApiKey(apiKey);
  const project = await prisma.project.create({
    data: {
      name,
      apiKeyHash,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return { ...project, apiKey };
}
