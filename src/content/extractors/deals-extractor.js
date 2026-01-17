import { extractNumber, generateId } from '../../utils/dom-helpers.js';
import { VIEW_TYPES } from '../board-detector.js';

function extractFromTableView() {
  const deals = [];

  const rows = document.querySelectorAll('[data-testid^="item-"]');

  rows.forEach(row => {
    try {
      const name = row.querySelector(
        '.col-identifier-name .ds-text-component-content-text'
      )?.textContent?.trim();

      if (!name) return;

      const deal = {
        id: generateId(name),
        name,
        value: null,
        stage: '',
        probability: null,
        closeDate: '',
        owner: '',
        contact: '',
        account: ''
      };

      const valueEl = row.querySelector(
        '.col-identifier-deal_value .ds-text-component-content-text'
      );
      if (valueEl) {
        deal.value = extractNumber(valueEl.textContent);
      }

      const stageEl = row.querySelector(
        '.col-identifier-deal_stage [data-testid="text"]'
      );
      if (stageEl) {
        deal.stage = stageEl.textContent.trim();
      }

      const probEl = row.querySelector(
        '.col-identifier-deal_close_probability .ds-text-component-content-text'
      );
      if (probEl) {
        deal.probability = extractNumber(probEl.textContent);
      }

      const dateEl = row.querySelector(
        '.col-identifier-deal_expected_close_date .ds-text-component-content-text'
      );
      if (dateEl) {
        deal.closeDate = dateEl.textContent.trim();
      }

      const contactEl = row.querySelector(
        '.col-identifier-deal_contact [data-testid="text"]'
      );
      if (contactEl) {
        deal.contact = contactEl.textContent.trim();
      }

      const accountEl = row.querySelector(
        '.col-identifier-deal_account [data-testid="text"]'
      );
      if (accountEl) {
        deal.account = accountEl.textContent.trim();
      }

      const ownerImg = row.querySelector(
        '.col-identifier-deal_owner img[title]'
      );
      if (ownerImg) {
        deal.owner = ownerImg.getAttribute('title') || '';
      }

      deals.push(deal);
    } catch (err) {
      console.error('Deal extraction error:', err);
    }
  });

  return deals;
}

export async function extractDeals(viewType = VIEW_TYPES.TABLE) {
  console.log(`🔍 Extracting deals from ${viewType} view`);

  await new Promise(r => setTimeout(r, 500));

  const deals = extractFromTableView();

  console.log(`Extracted ${deals.length} deals`);
  return deals;
}
