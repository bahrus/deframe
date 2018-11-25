
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/deframe)

<a href="https://nodei.co/npm/deframe/"><img src="https://nodei.co/npm/deframe.png"></a>

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/deframe@0.0.11/dist/deframe.min.js?compression=gzip">

<a href="https://bahrus.github.io/deframe/dev.html">Demo</a>

# deframe

## Purpose

deframe.js is a helper js library that lets you **def**ine a custom element/ web component via an [optionally invisible  if**rame** reference](https://www.chromestatus.com/features/4692243256442880).

The W3C Web Component working group is taking their sweet time coming up with a proposal to import HTML documents that is acceptable to all parties.  Then it will need to be implemented.  

Focusing on the decade we are in, what are we to do when building web components that are 99% HTML / CSS and 1% JavaScript?  Many seem comfortable just joining the everything-is-a-string-anyway crowd, and just encoding everything in ~~JavaScript~~ ~~TypeScript~~ ~~TSX~~ ~~ReasonML~~ [BrainFuckML](https://github.com/verdie-g/brainfuck2wasm).

But what if the web component is actually a dynamic, server-centric business component built with Ruby on Rails?  What if you have philosophical issues with giving up on HTML and CSS mime types based on such quaint notions as performance optimization?

deframe takes an unorthodox approach to this dilemma.

It lets you reference a web component via an optionally invisible iframe.  Before you scoff, it might be worth remembering that iframes helped unleash AJAX originally.

I did a simple test, where I loaded a large html document as an iframe vs as a JavaScript string.  If I throttle CPU and the network, the differences are quite dramatic, particularly as it relates to first content display.  (At least visually it is dramatic.  Lighthouse gives them the same score)  

Consumers of deframed web components need not reference this library.  Only web component authors reference it. 

And the extra nice thing:  These web components can be tested by opening them directly in a browser individually!  I think this kind of workflow will feel quite natural to developers, like me, who find beauty in (recursive) simplicity.  

## Syntax

### To create a deframed web component, follow these steps:

Step 1:

Pick a [web server](https://en.wikipedia.org/wiki/Web_server) you want to work with, capable of serving static files. Any should do just fine.  [This one, my favorite, requires no installation, just a simple download of a single file](https://github.com/GoogleChromeLabs/simplehttp2server) 

Step 2:

Rapidly and loudly type a bunch of useless memorized commands in your terminal until carpel tunnel syndrome sets in.  Pretend you are Commander Data and can read the response text as it flies by.  Feel at one with your computer.  

Step 3:

Create an html file (or stream) with the following syntax:

```html
<!--  MyWebcomponent.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <script type="module">
      import {deframe} from 'https://cdn.jsdelivr.net/npm/deframe';
      deframe('my-component');
    </script>
</head>
<body>
    Hello darkness, my old friend
</body>
</html>
```

VS Code tip:  When you create an html file, type ! at the top, then tab.  VS code creates a nice starter file if you do that.

Step 4:  Open the page or stream in your browser and see how it will look in standalone mode.  The deframe function pretty much leaves well enough alone in this case.


You should see "Hello darkness, my old friend"

### Referencing your web component

Step 1:

Create an html file (or server-side stream) that references your component via an iframe tag.  Then sprinkle the web component tag throughout the application as it is needed.  Only one iFrame gets created, for the sole purpose of downloading markup dependencies (and is promptly deleted when it ceases being useful).

```html
<!DOCTYPE html>
<html lang="en">
<body>
...
<iframe src="MyWebcomponent.html"></iframe>
<my-component></my-component>
...
</body>
</html>
```

Step 2:

Open the link in your favorite (non Edge/IE11) browser.  (Polyfills are needed for Edge/IE11)

You will see the following words appear in your browser:

"Hello darkness, my old friend."

If you throttle your network, you will see an ugly style-less iframe show the text first, which will then morph into a custom element.

You can fix this by styling the iframe the way you like it, or setting display none (and you can put it your head tag if you want).

How not-awesome is that?

## Why not just use iFrames and skip the web component part? 

Because they're [iFrames](https://meowni.ca/posts/shadow-dom/).  iFrames are confined to a rectangle.  They often end up loading the same JS libraries over and over again (at least in memory), which is wasteful.  They're kind of clunky to work with when passing in objects and pushing out events.

In fact, I mentioned a few things already that I'd like to take a second look at.  One is that for heavy HTML content, the first paint time is much better than streaming it as a JS string.  I also mentioned that setting display:none may reduce unnecessary rendering.  It may be that total cpu will be increased by not setting display:none, but the user would prefer the earlier display anyway.  deframe deletes the iframe once it has been turned into a web component.  

Hopefully when (if?) HTML Modules become a thing, these difficult tradeoffs will seem laughably quaint.

NB:  iFrames are also quite a bit more restrictive as far as cross-domain integration.  

## Examples:

### Example 1:  code-pen calculator

[Click here to see it in action](https://bahrus.github.io/xtal-math/demo/dev.html).  Note that it progressively renders.  It is a basic calculator, based off the mostly css-based [code-pen](https://codepen.io/giana/pen/GJMBEv).

And not only can the iframe be used to reference the web component, you can open the reference directly as a standalone URL:  https://bahrus.github.io/xtal-math/giana-pen.html

## Script References

If your web component references other web components (or libraries) that aren't deframed web components, you will need to include script references.

To do this, add a preload tag in your web component definition:

```html
<head>
<link rel="preloadmodule" href="p-d.iife.js" as="script">
</head>
```

This arrangement works nicely:  The script tag is only loaded once -- In the referring page if there is one, otherwise in the standalone page.

## Options

The deframe function has a second argument where you can specify options.  For now, there is only setting -- whether to use Shadow DOM or not.  By default, Shadow DOM is used.  To avoid ShadowDOM, use:

deframe('my-name', {useShadow: false})

## CSS References

Things aren't so clean with css:

1.  I continue to be baffled how the link preload tag can be used programmatically with styles.  Everything I try results in duplicate downloads.
2.  In addition, last I checked, Chrome doesn't deal very well with external references to css inside a web component template (maybe other browsers handle this better, but that would be small comfort).  And even if it did, extra care would need to be taken to avoid "FOUC"

So the css really needs to be part of the html template.  Including that CSS directly in the html template file certainly works.  But that might not be so convenient if the same file needs to be used more than once, or if tooling like SCSS is used.

One can certainly make the case that if HTTP2 were 100% frictionless, the case for downloading the CSS separately could be quite strong.  HTTP3 may be even more frictionless.  But for now, I think the case for embedding the css is generally higher, in production (not dev).

So one solid solution, if using separate files for CSS  would be to use server side includes, which the most widely used web servers support.  Unfortunately, it seems to be something not supported by most node-based web servers.  So alternatively, it should then be inlined during the build process.

But now we're talking loud keyboard clacking and exotic npm installations just to produce a Hello world page.  Unacceptable!  So to make things work with minimal fuss,  you can reference deframeDev.js instead of deframe, which will properly resolve the css file.  [TODO] A recommended tool for embedding the css during optimization is forthcoming.  (Maybe polymer tools does this already?)

