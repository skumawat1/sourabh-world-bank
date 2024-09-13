import { div, a, p } from '../../scripts/dom-helpers.js';
import { moveInstrumentation, fetchLanguagePlaceholders } from '../../scripts/scripts.js';

const getShortendIndicatorName = (indicatorTag, placeholdersData) => {
  // Return Same indicator tag content if hyphen is not present
  if (indicatorTag && indicatorTag.indexOf('-') < 0) return indicatorTag;

  const indicatorKey = indicatorTag.split('-')[0].trim().replace(/[^a-zA-Z0-9]/g, '');
  return placeholdersData[indicatorKey] ? placeholdersData[indicatorKey] : indicatorKey;
};

const getColorCode = (indicatorTag, placeholdersData) => {
  if (indicatorTag && indicatorTag.indexOf('-') < 0) return '#07AB50;';
  const indicatorColorKey = indicatorTag.split('-')[1].trim().replace(/[^a-zA-Z0-9]/g, '');
  return placeholdersData[indicatorColorKey] ? placeholdersData[indicatorColorKey]
    : indicatorColorKey;
};

const getImpactCardWrapper = (impactCard, placeholdersData) => {
  const [indicatorTag, icon, title, description, cardLink] = [...impactCard.children];
  const colorCode = getColorCode(indicatorTag.textContent, placeholdersData);
  const impactCardWrapper = div({ class: 'impact-card-wrapper', style: `border-top: 2px solid ${colorCode}` });
  moveInstrumentation(impactCard, impactCardWrapper);

  const impactCardIcon = div({ class: 'impact-card-img' });
  const impactCardContent = div(
    { class: 'impact-card-content' },
    p(title.textContent),
    p(description.textContent),
  );

  const link = cardLink.textContent ? cardLink.textContent : '#';
  cardLink.remove();
  if (icon) {
    impactCardIcon.innerHTML = icon.innerHTML;
  }

  const impactCardBody = div(
    { class: 'impact-card-body-content' },
    impactCardIcon,
    impactCardContent,
  );

  impactCardWrapper.append(a(
    { href: link },
    p({ class: 'impact-indicator' }, getShortendIndicatorName(indicatorTag.textContent, placeholdersData)),
    impactCardBody,
  ));

  // Remove default one's
  impactCard.innerHTML = '';
  impactCard.remove();

  return impactCardWrapper;
};

export default async function decorate(block) {
  const impactCardList = Array.from(block.children);
  if (impactCardList && impactCardList.length > 0) {
    const placeholdersData = await fetchLanguagePlaceholders();
    impactCardList.forEach((impactCard) => {
      const impactCardContentWrapper = getImpactCardWrapper(impactCard, placeholdersData);
      block.append(impactCardContentWrapper);
    });
  }
}
