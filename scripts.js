// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  function init() {

  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  program.init(domains);
});
