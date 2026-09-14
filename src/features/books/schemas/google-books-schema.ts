import { z } from 'zod'

const imageLinksSchema = z
  .object({
    smallThumbnail: z.string(),
    thumbnail: z.string(),
    small: z.string(),
    medium: z.string(),
    large: z.string(),
    extraLarge: z.string(),
  })
  .partial()

const volumeInfoSchema = z
  .object({
    title: z.string(),
    subtitle: z.string(),
    authors: z.array(z.string()),
    publisher: z.string(),
    publishedDate: z.string(),
    description: z.string(),
    pageCount: z.number(),
    printType: z.string(),
    categories: z.array(z.string()),
    averageRating: z.number(),
    ratingsCount: z.number(),
    language: z.string(),
    previewLink: z.string(),
    infoLink: z.string(),
    canonicalVolumeLink: z.string(),
    imageLinks: imageLinksSchema,
  })
  .partial()

export const googleVolumeSchema = z.object({
  id: z.string(),
  volumeInfo: volumeInfoSchema.default({}),
})

export const googleBooksListSchema = z.object({
  kind: z.string().optional(),
  totalItems: z.number().catch(0),
  items: z
    .array(z.unknown())
    .default([])
    .transform((rawItems) => {
      const volumes: GoogleVolume[] = []
      for (const rawItem of rawItems) {
        const parsed = googleVolumeSchema.safeParse(rawItem)
        if (parsed.success) volumes.push(parsed.data)
      }
      return volumes
    }),
})

export type GoogleVolume = z.infer<typeof googleVolumeSchema>
export type GoogleVolumeInfo = z.infer<typeof volumeInfoSchema>
export type GoogleBooksListResponse = z.infer<typeof googleBooksListSchema>
