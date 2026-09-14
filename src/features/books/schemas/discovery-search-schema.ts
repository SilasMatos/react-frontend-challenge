import { z } from 'zod'
import { PRINT_TYPES, SORT_ORDERS } from '../types/search'

export const discoverySearchSchema = z.object({
  q: z.string().trim().min(1).optional().catch(undefined),
  printType: z.enum(PRINT_TYPES).optional().catch(undefined),
  orderBy: z.enum(SORT_ORDERS).optional().catch(undefined),
})

export type DiscoverySearch = z.infer<typeof discoverySearchSchema>
