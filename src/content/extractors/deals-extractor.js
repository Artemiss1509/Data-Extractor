import { extractNumber, generateId } from '../../utils/dom-helpers.js';
import { VIEW_TYPES } from '../board-detector.js';

function extractFromTableView() {
  const deals = [];
  let currentGroup = 'Ungrouped';

  const elements = document.querySelectorAll(
    '.group-name[role="heading"], [data-testid^="item-"]'
  );

  elements.forEach(el => {
    try {
      if (el.classList.contains('group-name')) {
        currentGroup = el.textContent.trim();
        return;
      }

      if (!el.dataset.testid?.startsWith('item-')) return;

      const row = el;

      const name = row.querySelector(
        '.col-identifier-name .ds-text-component-content-text'
      )?.textContent?.trim();

      if (!name) return;

      const deal = {
        id: generateId(name),
        name,
        value: null,
        stage: currentGroup,
        group: currentGroup,
        probability: null,
        closeDate: '',
        owner: '',
        contact: ''
      };

      const valueEl = row.querySelector(
        '.col-identifier-deal_value .ds-text-component-content-text'
      );
      if (valueEl) {
        deal.value = extractNumber(valueEl.textContent);
      }

      const probEl = row.querySelector(
        '.col-identifier-deal_close_probability .ds-text-component-content-text'
      );
      if (probEl) {
        deal.probability = extractNumber(probEl.textContent);
      }

      const contactEl = row.querySelector(
        '.col-identifier-deal_contact [data-testid="text"]'
      );
      if (contactEl) {
        deal.contact = contactEl.textContent.trim();
      }

      const dateEl = row.querySelector(
        '.col-identifier-deal_expected_close_date .ds-text-component-content-text'
      );
      if (dateEl) {
        deal.closeDate = dateEl.textContent.trim();
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

  await new Promise(r => setTimeout(r, 600));

  const deals = extractFromTableView();

  console.log(`Extracted ${deals.length} deals`);
  return deals;
}
