'use client';

import { useEffect, useState } from 'react';

function parseAuctionEndDate(endDate: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return new Date(`${endDate}T23:59:59.999`);
  }

  return new Date(endDate);
}

function getTimeRemaining(endDate: string, now: number) {
  const target = parseAuctionEndDate(endDate).getTime();

  if (!Number.isFinite(target)) {
    return null;
  }

  const diff = target - now;

  if (diff <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatTimePart(value: number) {
  return value.toString().padStart(2, '0');
}

type LiveCountdownProps = {
  endDate: string;
  className?: string;
  withLabel?: boolean;
};

export default function LiveCountdown({
  endDate,
  className,
  withLabel = false,
}: LiveCountdownProps) {
  const [now, setNow] = useState(() => Date.now());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, [endDate]);

  if (!hasMounted) {
    // Render nothing or a placeholder during SSR to avoid hydration mismatch
    return <span className={className}>{withLabel ? 'Ends soon' : ''}</span>;
  }

  const timeRemaining = getTimeRemaining(endDate, now);

  if (!timeRemaining) {
    return <span className={className}>Auction ended</span>;
  }

  const countdown = [
    timeRemaining.days > 0 ? `${timeRemaining.days}d` : null,
    `${formatTimePart(timeRemaining.hours)}h`,
    `${formatTimePart(timeRemaining.minutes)}m`,
    `${formatTimePart(timeRemaining.seconds)}s`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={className}>
      {withLabel ? `Ends in ${countdown}` : countdown}
    </span>
  );
}