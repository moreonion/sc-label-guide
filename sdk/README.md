# mo-label-guide-sdk

> Label Guide SDK documentation

# Introduction

The JavaScript SDK can be fetched (non-blocking) via the following snippet:

``` JavaScript
(function(d, s, id){
  if (!d.getElementById(id)) {
    var js = d.createElement(s);
    js.id = id; js.async = true;
    js.src = 'https://localhost:8080/sdk.js';
    var fjs = d.getElementsByTagName(s)[0];
    fjs.parentNode.insertBefore(js, fjs);
  }
})(document, 'script', 'mo-label-guide-jssdk');
```

When loaded the SDK will call into the global `moAsyncInit` function, which needs to be provided on the consumer side.

```JavaScript
window.moAsyncInit = function(SDK: SDKApi) {
  // SDK obj with API methods
  SDK.mount(/*...*/)
};
```

Currently, the `SDKApi` type has the following shape:

```TypeScript
interface SDKApi {
  mount(selector: string, params: SDKParams): Promise<VueInst>
}
```

# API

Although not being written in TypeScript, type annotations are provided to express the kinds of types that are involed.

# Methods

## mount

The mount method fetches the label data for the given parameters and creates and mounts a new Vue instance to the DOM.

```TypeScript
function mount(selector: string, params: SDKParams): Promise<VueInst> {
  // ...
}
```

The `selector` specifies the CSS selector of the HTML element, where the Vue component should be mounted.

The `SDKParams` parameter has the following shape:

```TypeScript
interface SDKParams {
  selected: SelectSpec[]
  search: string
  query: QuerySpec,
  orderBy: OrderBySpec,
  page: number
  limit: number
}
```

The params reflect the exact state of the component and are automatically set in the share snippet when the Share Dialog is used. Therefore types like `SelectSpec[], QuerySpec, ...`are not further described, but it is good to know that it is just a specification of the table state.

The method will return a Promise of the [Vue instance](https://vuejs.org/v2/api/#Instance-Properties) that is attachted. It's properties and methods might be usefull in a more complex embed scenario.

