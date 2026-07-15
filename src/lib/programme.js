/**
 * Shared Tonight / programme helpers (Hybrid + Light).
 * day: 0 = Sunday … 6 = Saturday
 */

export function getTonight(programme, now = new Date()) {
  const day = now.getDay()
  const lineup = Array.isArray(programme?.lineup) ? programme.lineup : []
  const todays = lineup.filter((row) => Number(row.day) === day)
  const label = day === 0 ? 'Sunday' : 'Tonight'

  if (programme?.tonightOverride?.trim()) {
    return {
      day,
      label,
      short: programme.tonightOverride.trim(),
      detail: programme.tonightOverride.trim(),
      href: '#whats-on',
    }
  }

  if (todays.length) {
    const short = todays
      .map((row) => row.cue || [row.name, row.time].filter(Boolean).join(' · '))
      .join(' · ')
    const detail = todays
      .map((row) => row.detail || row.cue || [row.dayLabel, row.name, row.time].filter(Boolean).join(' · '))
      .join(' · ')
    const href = todays.find((row) => row.href)?.href || '#whats-on'
    return {
      day,
      label,
      short,
      detail,
      href,
      items: todays,
    }
  }

  return {
    day,
    label: 'This week',
    short: programme?.note || 'See what’s on below',
    detail: programme?.note || 'See what’s on below',
    href: '#whats-on',
    items: [],
  }
}

export function mergeVenue(venue, programme, menu) {
  return {
    ...venue,
    programme,
    menu,
  }
}
