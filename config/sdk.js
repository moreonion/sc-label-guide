const sdkURL = 'http://localhost:8080/sdk'

export default function getSDKSnippet(params) {
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
      js.src = '${sdkURL}/sdk.js';
      var fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, 'script', 'mo-label-guide-jssdk');
</script>
`
}
