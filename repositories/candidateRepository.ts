import { prisma } from '@/lib/prisma';

export type CreateCandidateInput = {
  fullName: string;
  email: string;
  photoUrl: string;
};

export async function createCandidate(data: CreateCandidateInput) {
  return prisma.candidate.create({ data });
}
