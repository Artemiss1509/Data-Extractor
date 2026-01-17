import {
  extractEmail,
  extractPhone,
  generateId
} from '../../utils/dom-helpers.js';

function extractFromTableView() {
  const contacts = [];
  let currentGroup = 'Ungrouped';

  const allElements = document.querySelectorAll(
    '[data-testid^="item-"], .group-name-editable-heading'
  );

  allElements.forEach(el => {
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

      const contact = {
        id: generateId(name),
        name,
        email: '',
        phone: '',
        account: '',
        title: '',
        group: currentGroup
      };

      const emailEl = row.querySelector(
        '.col-identifier-contact_email a'
      );
      if (emailEl) {
        const email = extractEmail(emailEl.textContent);
        if (email) contact.email = email;
      }

      const phoneEl =
        row.querySelector('.phone-cell-number') ||
        row.querySelector('.col-identifier-contact_phone');
      if (phoneEl) {
        const phone = extractPhone(phoneEl.textContent);
        if (phone) contact.phone = phone;
      }

      const accountEl = row.querySelector(
        '.col-identifier-contact_account [data-testid="text"]'
      );
      if (accountEl) {
        contact.account = accountEl.textContent.trim();
      }

      const titleEl = row.querySelector(
        '.col-identifier-contact_title [data-testid="text"]'
      );
      if (titleEl) {
        contact.title = titleEl.textContent.trim();
      }

      contacts.push(contact);
    } catch (error) {
      console.error('❌ Error extracting contact row:', error);
    }
  });

  return contacts;
}

export function getColumnHeader() {
  return '';
}

export async function extractContacts() {
  console.log('🔍 Extracting contacts...');

  try {
    await new Promise(resolve => setTimeout(resolve, 700));

    const contacts = extractFromTableView();

    console.log(`✅ Extracted ${contacts.length} contacts`);

    const groupCounts = contacts.reduce((acc, c) => {
      acc[c.group] = (acc[c.group] || 0) + 1;
      return acc;
    }, {});
    console.log('Contacts by group:', groupCounts);

    return contacts;
  } catch (error) {
    console.error('❌ Error extracting contacts:', error);
    throw error;
  }
}
