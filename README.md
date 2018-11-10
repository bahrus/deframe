# deframe

## Purpose

deframe.js is a helper js library that lets you **def**ine a custom element/ web component via an [invisible  if**rame** reference](https://www.chromestatus.com/features/4692243256442880).

The W3C Web Component working group is taking their sweet time coming up with a proposal to import HTML documents that is acceptable to all parties.  Then it will need to be implemented.  

Focusing on the decade we are in, what are we to do when building web components that are 99% HTML / CSS and 1% JavaScript?  Many seem comfortable just joining the everything-is-a-string-anyway crowd, and just encoding everything in ~~JavaScript~~ ~~TypeScript~~ ~~JSX~~ ~~ReasonML~~ [Webassembly](https://github.com/verdie-g/brainfuck2wasm).

But what if the web component is actually a dynamic business component?  What if you have philosophical issues with giving up on HTML and CSS mime types, and think that the performance will be better by sticking to these quaint formats?

deframe takes an unorthodox approach to this dilemma.

It lets you reference a web component by using an invisible iframe.  Before you scoff, it might be worth remembering that iframes helped unleashed AJAX originally!

Consumers of deframed web components need not reference this library.  Only web component authors reference it. 

And the extra nice thing:  These web components can be tested by opening them directly in a browser individually!  I think this kind of workflow will feel quite natural to developers, like me, who find beauty in simplicity.  I recognize that I may be in a minority.  Take this video, by a clearly smart and competent developer, who is not alone in feeling passionate enough about the framework he was showcasing that he attached the words "awesome" to the title:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=JC3jlCrsYYI
" target="_blank"><img src="http://img.youtube.com/vi/JC3jlCrsYYI/0.jpg" 
alt="Awesome ReactJS 2017 ReactJS 01 with Babel and Webpack" width="480" height="360" border="10" /><br>Awesome ReactJS 2017 ReactJS 01 with Babel and Webpack</a>

I rarely encounter any article or video on this framework that doesn't begin or end with the salute "React (and/or Webpack) are awesome!"  If this video appeals to you, I'm sorry, I just don't get it.  And I very much doubt the library described below will appeal to you.  

There are those, like me, who like sitting on the nearest chair when we tie out shoes.  And there are those who prefer to climb to the top of Annuparna to do so.  I certainly admire, even if I don't comprehend, such individuals.  That's what makes life so [mysterious and wonderful](http://www.simpleluxeliving.com/tao-te-ching-verse-two-embracing-circle-life/).

## Why not just use iFrames? 

Because they're [iframes](https://meowni.ca/posts/shadow-dom/)  iFrames are confined to a rectangle.  They often end up loading the same JS libraries over and over again (at least in memory), which is wasteful (shortly we will be providing some solutions for this issue).  They're kind of clunky to work with when passing in objects and pushing out events.

In fact, I am thinking that there may be some benefits in showing the initial, non interactive, static view of the first instance of a deframed web component by using a *visible* iframe, which would then get promoted to the web component once the (heavy) resource dependencies (including dynamic data retrieval) are finished being retrieved.  But that is not yet supported.

## Syntax

### To create a deframed web component, follow these steps:

Step 1:

Pick a [web server](https://en.wikipedia.org/wiki/Web_server) you want to work with, capable of serving static files. Any should do just fine.  [This one, my favorite, requires no installation, just a simple download of a single file](https://github.com/GoogleChromeLabs/simplehttp2server) 

Step 2:

Rapidly and loudly type a bunch of useless memorized commands in your terminal until carpel syndrome sets in.  Pretend you are Commander Data and can read the response text as it flies by.  Feel at one with your computer.  

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
    I am here
</body>
</html>
```

Step 4:  Open the page in your browser and see how it will look in standalone mode.  The deframe function pretty much leaves well enough alone in this case.


You should see "I am here."

### Referencing your web component

Step 1:

Create an html file (or server-side stream) that references your component.  Then sprinkle the web component tag through the application as it is needed.  Only one iframe gets created, for the sole purpose of downloading markup dependencies.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <iframe src="MyWebcomponent.html" style="display:none"></iframe>
</head>
<body>
...
<my-component></my-component>
</body>
</html>
```

Step 2:

Open the link in your favorite (non Edge/IE11) browser.  (Polyfills are needed for Edge/IE11)

You will see the following words appear in your browser:

"I am here"

How not-awesome is that?

