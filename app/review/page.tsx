import { redirect } from "next/navigation";
import SimpleClientReview from "@/components/review/SimpleClientReview";
import { ReviewConfigurationError } from "@/components/review/ReviewConfigurationError";
import { isReviewProductionEnvironment, isReviewSupabaseConfigured } from "@/lib/review/config";

// /review used to be Emma's route. Her canonical entry point is now /emma
// (real magic-link auth — see app/emma/page.tsx). Once Supabase is
// configured, this redirects there so any old bookmark/link keeps working.
// Until then (local development with no Supabase project connected), this
// keeps rendering SimpleClientReview directly with its own local demo gate,
// exactly as it did before, so nothing breaks for local-only testing.
//
// In a real deployment (isReviewProductionEnvironment()) with Supabase still
// unconfigured, this must NOT fall through to the local demo — that would
// hand out a fake "Continue as Emma" button with zero real auth to anyone
// who finds the URL. Show a clear configuration error instead.
export default function ReviewPage() {
  if (isReviewSupabaseConfigured()) {
    redirect("/emma");
  }
  if (isReviewProductionEnvironment()) {
    return <ReviewConfigurationError />;
  }
  return <SimpleClientReview />;
}
