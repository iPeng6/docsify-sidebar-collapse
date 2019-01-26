# docsify-sidebar-collapse

![](https://img.shields.io/npm/v/docsify-sidebar-collapse.svg)
![](https://img.shields.io/github/license/iPeng6/docsify-sidebar-collapse.svg)

support docsify sidebar collapsed default

## Preview

![](assets/show.gif)

## Usage

Firstly, make sure that the [loadSidebar](https://docsify.js.org/#/configuration?id=loadsidebar) config is enabled，and the Markdown file `_sidebar.md` is provided in the root directory.

Then insert script into document just like the [official plugins](https://docsify.js.org/#/plugins)'s usage

```html
 <script>
    window.$docsify = {
      loadSidebar: true,
      alias: {
        '/.*/_sidebar.md': '/_sidebar.md',
      },
      subMaxLevel: 3,
      ...
    }
  </script>
  <script src="//unpkg.com/docsify/lib/docsify.min.js"></script>

  <!-- plugins -->
  <script src="//unpkg.com/docsify-sidebar-collapse/dist/docsify-sidebar-collapse.min.js">
```
