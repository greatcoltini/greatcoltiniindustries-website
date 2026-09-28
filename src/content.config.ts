import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortTitle: z.string().optional(),
      category: z.enum(['games', 'apps', 'mods']),
      summary: z.string(),
      artwork: image().optional(),
      artworkAlt: z.string().default(''),
      icon: image().optional(),
      artStyle: z
        .enum(['cover', 'boulderlog', 'shelf', 'mod'])
        .default('cover'),
      order: z.number(),
      hostGame: z.string().optional(),
      tech: z.array(z.string()).default([]),
      features: z
        .array(z.object({ title: z.string(), description: z.string() }))
        .default([]),
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      trailer: z.string().optional(),
    }),
});

export const collections = { projects };
