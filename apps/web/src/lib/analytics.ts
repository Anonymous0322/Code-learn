import { getSupabase } from '@/lib/supabase';

export type AnalyticsEvent = 'signup' | 'lesson_started' | 'lesson_completed' | 'weekly_return' | 'course_completed';

export async function trackAnalyticsEvent(event: AnalyticsEvent, resourceId?: string) {
  if (typeof window === 'undefined') return;

  try {
    if (window.localStorage.getItem('codelearn-analytics-consent') !== 'granted') return;
    const { error } = await getSupabase().rpc('record_analytics_event', {
      event_name: event,
      resource_id: resourceId ?? null,
    });
    if (error) throw error;
  } catch (error) {
    console.error(`Analitika hodisasi yozilmadi (${event}).`, error);
  }
}
