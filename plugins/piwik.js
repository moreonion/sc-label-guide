export default ({app}) => {
  // Only in production mode
  if (process.env.NODE_ENV !== 'production') return

  // Include Piwik Tracking Code
  var _paq = _paq || []
  _paq.push(['enableLinkTracking']);

  /* eslint-disable */
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
  /* eslint-enable */

  if(app.router) {
    // Send page view every time the route changes (fired on initialization too)
    app.router.afterEach(() => {
      _paq.push(['trackPageView'])
    })
  } else {
    // When embedded via SDK, there is no router
    _paq.push(['trackPageView'])
  }
}
