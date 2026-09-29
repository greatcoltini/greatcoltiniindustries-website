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
      overviewTitle: z.string(),
      overview: z.array(z.string()),
      availability: z.object({
        label: z.string(),
        platform: z.string(),
        detail: z.string().optional(),
      }),
      listingName: z.string().optional(),
      artwork: image().optional(),
      artworkAlt: z.string().default(''),
      icon: image().optional(),
      artStyle: z
        .enum(['cover', 'boulderlog', 'shelf', 'mod'])
        .default('cover'),
      /** Blocky artwork that should scale with hard pixel edges, never smoothed. */
      pixelArt: z.boolean().default(false),
      order: z.number(),
      hostGame: z.string().optional(),
      tech: z.array(z.string()).default([]),
      features: z
        .array(z.object({ title: z.string(), description: z.string() }))
        .default([]),
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      updates: z
        .array(
          z.object({
            id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
            date: z.iso.date(),
            version: z.string().optional(),
            title: z.string(),
            changes: z.array(z.string()).min(1),
            url: z
              .url()
              .refine(
                (value) => /^https?:\/\//.test(value),
                'Use an HTTP(S) release-notes URL',
              )
              .optional(),
          }),
        )
        .default([])
        .refine(
          (updates) =>
            new Set(updates.map((update) => update.id)).size === updates.length,
          'Update IDs must be unique within a project',
        ),
      /** Steps toward release, shown as a tracker before launch. Past steps need a public source. */
      roadmap: z
        .array(
          z.object({
            title: z.string(),
            status: z.enum(['done', 'next', 'planned']),
            /** Free text, such as "31 Jul 2026" or "Q1 2027". */
            when: z.string().optional(),
            url: z.url().optional(),
          }),
        )
        .default([])
        .refine(
          (steps) => steps.filter((step) => step.status === 'next').length <= 1,
          'Only one roadmap step can be next',
        ),
      trailer: z.string().optional(),
      screenshots: z
        .array(
          z.object({ image: image(), alt: z.string(), caption: z.string() }),
        )
        .default([]),
    }),
});

export const collections = { projects };
