import { generateId } from '../../utils/dom-helpers.js';

function extractFromTableView() {
  const leads = [];
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

      const nameEl = row.querySelector(
        '.col-identifier-name .ds-text-component-content-text'
      );
      const name = nameEl?.textContent?.trim();
      if (!name) return;

      const lead = {
        id: generateId(name),
        name,
        company: '',
        status: '',
        email: '',
        phone: '',
        owner: ''
      };

      const statusEl = row.querySelector(
        '.col-identifier-lead_status [data-testid="text"]'
      );
      if (statusEl) {
        lead.status = statusEl.textContent.trim();
      }

      const companyEl = row.querySelector(
        '.col-identifier-lead_company [data-testid="text"]'
      );
      if (companyEl) {
        lead.company = companyEl.textContent.trim();
      }
      const emailEl = row.querySelector(
        '.col-identifier-lead_email a'
      );
      if (emailEl) {
        lead.email = emailEl.textContent.trim();
      }
      const nameCell = row.querySelector('.col-identifier-name');
      const ownerLabel = nameCell?.getAttribute('aria-label');
      if (ownerLabel && ownerLabel.includes('Select item')) {
        lead.owner = ownerLabel.replace('Select item:', '').trim();
      }

      leads.push(lead);
    } catch (error) {
      console.error('Error extracting lead row:', error);
    }
  });

  return leads;
}

export function getColumnHeader() {
  return '';
}

export async function extractLeads() {
  console.log('🔍 Extracting leads...');

  try {
    await new Promise(resolve => setTimeout(resolve, 700));

    const leads = extractFromTableView();

    console.log(`Extracted ${leads.length} leads`);
    return leads;
  } catch (error) {
    console.error('Error extracting leads:', error);
    throw error;
  }
}
