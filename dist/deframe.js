function test(win) {
    try {
        win.customElements.get('test-ing');
    }
    catch (e) {
        return false;
    }
    return true;
}
function getTop(win) {
    if (win.buckStopsHere) {
        return win;
    }
    if (!test(win.parent))
        return win;
    if (win === win.parent)
        return win;
    return getTop(win.parent);
}
function init(name, options) {
    if (document.readyState !== 'complete') {
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        };
        return;
    }
    const top = getTop(window);
    ;
    document.querySelectorAll('link[as="script"]').forEach(link => {
        const script = top.document.createElement('script');
        script.src = link.href;
        Array.from(link.attributes).forEach(attr => {
            script.setAttribute(attr.name, attr.value);
        });
        top.document.head.appendChild(script);
    });
    let preDefTempl = null;
    if (options.bodyContainsTemplate)
        preDefTempl = document.body.firstElementChild;
    if (window === top) {
        const ab = options.attachBehavior;
        if (ab) {
            document.querySelectorAll(ab.selector).forEach((el) => {
                ab.attach(el, top);
            });
        }
        if (preDefTempl) {
            document.body.appendChild(preDefTempl.content.cloneNode(true));
            preDefTempl.remove();
        }
        return;
    }
    if (preDefTempl === null) {
        preDefTempl = top.document.createElement('template');
        preDefTempl.innerHTML = document.body.innerHTML;
    }
    if (options.defineFn) {
        options.defineFn(top, preDefTempl, options);
    }
    else {
        //console.log(script!.src)
        class Def extends top.HTMLElement {
            constructor() {
                super();
                if (options.useShadow) {
                    this.attachShadow({ mode: 'open' });
                    const clone = preDefTempl.content.cloneNode(true);
                    this.shadowRoot.appendChild(clone);
                }
            }
            connectedCallback() {
                const ab = options.attachBehavior;
                if (!options.useShadow) {
                    const clone = preDefTempl.content.cloneNode(true);
                    this.appendChild(clone);
                    if (ab) {
                        this.querySelectorAll(ab.selector).forEach((el) => {
                            ab.attach(el, top);
                        });
                    }
                }
                else {
                    if (ab) {
                        this.shadowRoot.querySelectorAll(ab.selector).forEach((el) => {
                            ab.attach(el, top);
                        });
                    }
                }
            }
        }
        top.customElements.define(name, Def);
    }
    window.parent.document.querySelectorAll('iframe').forEach(element => {
        if (element.contentWindow === window) {
            //element.remove();
            element.style.display = 'none';
        }
    });
}
export function deframe(name, options = {
    useShadow: true, attachBehavior: null, bodyContainsTemplate: false, defineFn: null
}) {
    init(name, options);
}