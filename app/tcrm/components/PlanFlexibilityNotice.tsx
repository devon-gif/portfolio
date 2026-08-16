export function PlanFlexibilityNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="tl-flexibility-compact">
        <strong>CANCEL ANYTIME</strong>
        <span>
          Month-to-month through TCRM · Optional discounted
          6- or 12-month agreements available
        </span>
      </div>
    );
  }

  return (
    <div className="tl-flexibility-notice">
      <div className="tl-flexibility-icon" aria-hidden="true">
        ✓
      </div>

      <div>
        <div className="tl-cancel-anytime">
          CANCEL ANYTIME
        </div>

        <strong>Stay flexible. No long-term commitment required.</strong>

        <p>
          All monthly creative plans are month-to-month and can be canceled
          anytime through TCRM. Prefer a longer-term partnership? Optional
          discounted 6- or 12-month agreements are available.
        </p>
      </div>
    </div>
  );
}
