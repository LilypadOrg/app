import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { ContentType } from '~/types/types';
import { z } from 'zod';

const defaultTechnologiesSelect = Prisma.validator<Prisma.TechnologySelect>()({
  id: true,
  name: true,
  slug: true,
});

export const technologyRouter = createRouter()
  // read
  .query('all', {
    async resolve() {
      try {
        const techs = await prisma.technology.findMany({
          select: defaultTechnologiesSelect,
        });
        return techs;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('byContentTYpe', {
    input: z.object({
      contentType: z.nativeEnum(ContentType),
    }),
    async resolve({ input }) {
      try {
        const techs = await prisma.technology.findMany({
          where: {
            contents: { some: { contentType: { name: input.contentType } } },
          },
          select: defaultTechnologiesSelect,
        });
        return techs;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
