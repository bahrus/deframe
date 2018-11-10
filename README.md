# deframe

## Purpose

deframe.js is a helper js library that lets you *def*ine a custom element/ web component via an invisible  i*frame* reference.

The W3C Web Component working group is taking their sweet time coming up with a proposal to import HTML documents that is acceptable to all parties.  Then it will need to be implemented.  

Focusing on the decade we are in, what are we to do when building web components that are 99% HTML / CSS and 1% JavaScript?  Many seem comfortable just joining the everything-is-a-string-anyway crowd, and just encoding everything in ~~JavaScript~~ ~~TypeScript~~ ~~JSX~~ ~~ReasonML~~ C++/Webassembly.

But what if the web component is actually a dynamic business component?  What if you have philosophical issues with giving up on HTML and CSS mime types?

deframe takes one approach to this dilemma.

It lets you reference a web component by using an invisible iframe.  Before you scoff, it might be worth remembering that iframes unleashed AJAX originally!

Consumers of deframed web components need not reference this library.  Only web component authors reference it. 

And the extra nice thing:  These web components can be tested by opening them directly in a browser individually!  I think this kind of workflow will feel quite natural to a developer not poisoned by the Stockholm Syndrom afflictng the web community, where everyone wears red RAWA hats React And Webpack are Awesome.  

<a href="http://www.youtube.com/watch?feature=player_embedded&v=JC3jlCrsYYI
" target="_blank"><img src="http://img.youtube.com/vi/JC3jlCrsYYI/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>



If this video appeals to you, I'm sorry, I just don't get it.  And I very much doubt this library will appeal to you.  


## Syntax

To create a deframed web component, follow these steps:

Step 1:

Create an html file with the following syntax:

```html
<!--  MyWebcomponent.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <script type="module">
      import {deframe} from '../../deframe.js';
      deframe('my-component');
    </script>
</head>
<body>
    I am here
</body>
</html>
```

Step 2:

Rapidly and loudly type a bunch of usesless commands in your terminal until carpel syndrome sets in.

Reference your web component

Step 1:


```html
<iframe src="MyWebcomponent.html" style="display:none"></iframe>
...
<my-compoenent></my-component>
```

How non-awesome is that?

