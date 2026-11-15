import React from 'react';
import PropTypes from 'prop-types';

// Same rules as the ImageElement of Rocket.Chat's message renderer.
const sanitizeUrl = (href) => {
  if (!href) {
    return '#';
  }

  try {
    const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href);

    if (hasProtocol) {
      const url = new URL(href);
      const protocol = url.protocol.toLowerCase().replace(/:$/, '');
      const dangerousProtocols = ['javascript', 'data', 'vbscript'];
      return dangerousProtocols.includes(protocol) ? '#' : url.href;
    }

    return new URL(
      href.startsWith('//') ? href : `//${href}`,
      window.location.href
    ).href;
  } catch {
    return '#';
  }
};

const flattenMarkup = (markup) => {
  if (!markup) {
    return '';
  }

  if (Array.isArray(markup)) {
    return markup.map(flattenMarkup).join('');
  }

  switch (markup.type) {
    case 'PLAIN_TEXT':
      return markup.value;

    case 'ITALIC':
    case 'BOLD':
    case 'STRIKE':
      return flattenMarkup(markup.value);

    case 'INLINE_CODE':
      return flattenMarkup(markup.value);

    default:
      return '';
  }
};

const ImageElement = ({ src, alt }) => {
  const plainAlt = flattenMarkup(alt);
  const safeSrc = sanitizeUrl(src);

  return (
    <a
      href={safeSrc}
      target="_blank"
      rel="noopener noreferrer"
      title={plainAlt}
    >
      <img
        src={safeSrc}
        data-title={safeSrc}
        alt={plainAlt}
        style={{ maxWidth: '100%' }}
      />
    </a>
  );
};

export default ImageElement;

ImageElement.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.any,
};
