# deframe

## Purpose

deframe.js is a helper js library that turns an iframe into a web component.

The W3C Web Component working group is taking their sweet time coming up with a proposal to import HTML documents, that is acceptable to all parties.  Then it will need to be implemented.  

Focusing on the decade we are in, what are we to do when building web components that are 99% HTML / CSS and 1% JavaScript?  Many seem comfortable just joining the everything-is-a-string-anyway crowd, and just encoding everything in JavaScript.

But what if the web component is actually a dynamic business component?  What if you have philosophical issues with giving up on HTML and CSS mime types?

deframe takes one approach to this dilemma.

It lets you reference a web component by using an invisible iframe.  Before you scoff, it might be worth remembering that iframes unleashed AJAX originally!

deframe is a helper library used only by web component libraries, which converts the iframe into a web component definition.

## Syntax

To reference a
