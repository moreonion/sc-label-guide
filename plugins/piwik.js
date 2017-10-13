/* eslint-disable */

export default ({ app }) => {
  /* Only run on client-side and only in production mode */
  if (process.env.NODE_ENV !== 'production') return

  /* Include Piwik Tracking Code */
  var _paq = _paq || [];
  _paq.push(['enableLinkTracking']);

  (function() {
    var u="//www.ci-romero.de/piwik/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', 6]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript';
    g.async=true;
    g.defer=true;
    g.src=u+'piwik.js';
    s.parentNode.insertBefore(g,s);
  })();

  /* Send page view every time the route changes (fired on initialization too) */
  app.router.afterEach((to, from) => {
    _paq.push(['trackPageView']);
  })
}
