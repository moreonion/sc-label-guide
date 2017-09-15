import {_DOMAIN_, _SDKURL_} from './api'

export function getSDKSnippet(params) {
  return `
<script>
  window.moAsyncInit = function(MO) {
    const params = ${JSON.stringify(params)};

    MO.mount('#label-guide', params).catch(function(err) {
      console.log('Label Guide SDK Error:' + JSON.stringify(err));
    });
  };

  (function(d, s, id){
    if (!d.getElementById(id)) {
      var js = d.createElement(s);
      js.id = id; js.async = true;
      js.src = '${_SDKURL_}/sdk.js';
      var fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, 'script', 'mo-label-guide-jssdk');
</script>
`
}

export function getIframeSnippet(encodedParams) {
  return `<iframe style="width: 100%; border: none; height: 1000px" src="${_DOMAIN_}/${encodedParams}"></iframe>`
}
