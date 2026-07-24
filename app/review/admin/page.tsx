import SimpleAdminReview from "@/components/review/SimpleAdminReview";
import { ReviewAdminGate } from "@/components/review/ReviewAdminGate";

// Devon's admin route. ReviewAdminGate only enforces a real Supabase +
// review_profiles(role = 'admin') check once Supabase is configured — when
// it isn't, it renders SimpleAdminReview directly, which keeps its own
// local "Continue as Devon" demo gate exactly as before.
export default function ReviewAdminPage() {
  return (
    <ReviewAdminGate>
      <SimpleAdminReview />
    </ReviewAdminGate>
  );
}
