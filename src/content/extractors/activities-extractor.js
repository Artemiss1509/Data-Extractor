import { generateId } from '../../utils/dom-helpers.js';

function extractFromTableView() {
  const activities = [];
  let currentGroup = 'Ungrouped';

  const elements = document.querySelectorAll(
    '[data-testid^="item-"], .group-name-editable-heading'
  );

  elements.forEach(el => {
    try {
      if (el.classList.contains('group-name-editable-heading')) {
        const groupText = el.textContent?.trim();
        if (groupText) currentGroup = groupText;
        return;
      }

      if (!el.dataset.testid?.startsWith('item-')) return;

      const row = el;

      const activity = {
        id: '',
        type: '',
        subject: '',
        date: '',
        linkedTo: ''
      };

      const subjectEl = row.querySelector(
        '.col-identifier-name .ds-text-component-content-text'
      );
      const subject = subjectEl?.textContent?.trim();
      if (!subject) return;

      activity.subject = subject;
      activity.id = generateId(subject);

      const typeEl = row.querySelector(
        '.col-identifier-activity_type [data-testid="text"]'
      );
      if (typeEl) {
        activity.type = typeEl.textContent.trim();
      }
      const dateEl = row.querySelector(
        '.col-identifier-activity_start_time .ds-text-component-content-text'
      );
      if (dateEl) {
        activity.date = dateEl.textContent.trim();
      }

      const linkedEl = row.querySelector(
        '.col-identifier-activity_item span'
      );
      if (linkedEl) {
        activity.linkedTo = linkedEl.textContent.trim();
      }

      activities.push(activity);
    } catch (error) {
      console.error('Error extracting activity row:', error);
    }
  });

  return activities;
}

export function getColumnHeader() {
  return '';
}

export async function extractActivities() {
  console.log('🔍 Extracting activities...');

  try {
    // Allow virtualized rows to settle
    await new Promise(resolve => setTimeout(resolve, 700));

    const activities = extractFromTableView();

    console.log(`✅ Extracted ${activities.length} activities`);
    return activities;
  } catch (error) {
    console.error('❌ Error extracting activities:', error);
    throw error;
  }
}
