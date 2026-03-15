import { useGitHubRelease } from "../hooks/useGitHubRelease";
import { useCommitActivity } from "../hooks/useCommitActivity";

function daysAgo(isoDate: string | null): number | null {
  if (!isoDate) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000));
}

export function ActivityStrip() {
  const { version, publishedAt, loading: releaseLoading } = useGitHubRelease();
  const { weeks, monthTotal, loading: activityLoading } = useCommitActivity();

  const days = daysAgo(publishedAt);
  const maxTotal = Math.max(...weeks.map((x) => x.total), 1);

  const showBadge = !releaseLoading && !!version;
  const showBars = !activityLoading;

  return (
    <section className="ff-activity-strip-section">
      <div className="ff-activity-strip-inner">

        {/* Left: version + date badge */}
        <div className="ff-activity-badge">
          <div className="ff-activity-dot" />
          <span className="ff-activity-version">
            {showBadge ? version : "—"}
          </span>
          {showBadge && days !== null && (
            <span className="ff-activity-ago">
              {days === 0 ? "today" : days === 1 ? "yesterday" : `${days}d ago`}
            </span>
          )}
        </div>

        <div className="ff-activity-divider" />

        {/* Right: 8 commit activity bars + month total */}
        <div className="ff-activity-bars">
          {showBars &&
            weeks.map((w, i) => {
              const heightPct = (w.total / maxTotal) * 100;
              const isRecent = i >= 4;
              return (
                <div
                  key={w.week}
                  className={`ff-activity-bar${isRecent ? " ff-activity-bar--recent" : ""}`}
                  style={{ height: `max(4px, ${heightPct}%)` }}
                  title={`${w.total} commits`}
                />
              );
            })}
        </div>
        <span className="ff-activity-month-total">{monthTotal} this month</span>

      </div>
    </section>
  );
}
