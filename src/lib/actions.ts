'use server'

import { increment } from 'firebase/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { revalidatePath } from 'next/cache'

// Increment view count - Fixed to use doc() directly with document path
export async function incrementView(bookId: string) {
  try {
    const statsRef = adminDb.doc('metadata_stats', bookId)
    const statsDoc = await statsRef.get()

    if (statsDoc.exists()) {
      await statsRef.update({
        viewsCount: increment(1),
        likesCount: increment(0),
        commentsCount: increment(0),
      })
    } else {
      await statsRef.set({
        viewsCount: 1,
        likesCount: 0,
        commentsCount: 0,
      })
    }

    revalidatePath(`/watch/${bookId}`)
    return { success: true }
  } catch (error) {
    console.error('Error incrementing view:', error)
    return { success: false, error: String(error) }
  }
}
