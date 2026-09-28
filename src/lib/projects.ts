import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
export type Project = CollectionEntry<'projects'>;
export async function projectsIn(category?: Project['data']['category']) {
  return (
    await getCollection(
      'projects',
      (p) => !category || p.data.category === category,
    )
  ).sort((a, b) => a.data.order - b.data.order);
}
export const projectUrl = (project: Project) => `/projects/${project.id}/`;
export const chapterNames = { games: 'Games', apps: 'Apps', mods: 'Mods' };
