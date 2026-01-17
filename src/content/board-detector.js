export const BOARD_TYPES = {
  CONTACTS: 'contacts',
  DEALS: 'deals',
  LEADS: 'leads',
  ACTIVITIES: 'activities',
  UNKNOWN: 'unknown'
};

export const VIEW_TYPES = {
  TABLE: 'table',
  KANBAN: 'kanban',
  UNKNOWN: 'unknown'
};

export function detectBoardType() {
  if (
    document.querySelector('.col-identifier-activity_type') &&
    document.querySelector('.col-identifier-activity_start_time')
  ) {
    return BOARD_TYPES.ACTIVITIES;
  }

  if (
    document.querySelector('.col-identifier-deal_stage') ||
    document.querySelector('.col-identifier-deal_value')
  ) {
    return BOARD_TYPES.DEALS;
  }

  if (
  document.querySelector('.col-identifier-lead_status') &&
  document.querySelector('.col-identifier-name')
  ) {
    return BOARD_TYPES.LEADS;
  }

  if (
  document.querySelector('.col-identifier-name') &&
  document.querySelector('.col-identifier-contact_email')
  ) {
    return BOARD_TYPES.CONTACTS;
  }

  const title =
    document.querySelector('[data-testid="board-header-title"]')?.textContent
      ?.toLowerCase() || '';

  if (title.includes('activity')) return BOARD_TYPES.ACTIVITIES;
  if (title.includes('deal')) return BOARD_TYPES.DEALS;
  if (title.includes('lead')) return BOARD_TYPES.LEADS;
  if (title.includes('contact')) return BOARD_TYPES.CONTACTS;

  return BOARD_TYPES.UNKNOWN;
}


export function detectViewType() {
  if (document.querySelector('[aria-roledescription="Kanban column"]')) {
    return VIEW_TYPES.KANBAN;
  }

  if (document.querySelector('[data-testid^="item-"]')) {
    return VIEW_TYPES.TABLE;
  }

  return VIEW_TYPES.UNKNOWN;
}

export function getBoardInfo() {
  const type = detectBoardType();
  const viewType = detectViewType();
  const name = detectBoardType();

  return {
    type,
    viewType,
    name,
    url: window.location.href,
    timestamp: Date.now()
  };
}

export async function waitForBoardLoad(timeout = 15000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const hasRows = document.querySelector('[data-testid^="item-"]');
      const hasHeader =
        document.querySelector('[data-testid="board-header-title"]') ||
        document.querySelector('[data-testid="text-with-highlight"]');

      if (hasRows || hasHeader) {
        clearInterval(interval);
        resolve(true);
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('Board load timeout'));
      }
    }, 300);
  });
}
