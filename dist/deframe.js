function init(name, options) {
    if (document.readyState !== 'complete') {
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        };
        return;
    }
    const top = window.top;
    document.querySelectorAll('link[as="script"][rel="preloadmodule"]').forEach(link => {
        const script = top.document.createElement('script');
        script.src = link.href;
        script.type = 'module';
        top.document.head.appendChild(script);
    });
    let preDefTempl = null;
    if (options.bodyContainsTemplate)
        preDefTempl = document.body.firstElementChild;
    if (window === top) {
        const ab = options.attachBehavior;
        if (ab !== null) {
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
    //console.log(script!.src)
    class Def extends top.HTMLElement {
        constructor() {
            super();
            if (options.useShadow) {
                const clone = preDefTempl.content.cloneNode(true);
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(preDefTempl.content.cloneNode(true));
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
    window.parent.document.querySelectorAll('iframe').forEach(element => {
        if (element.contentWindow === window) {
            element.remove();
        }
    });
}
export function deframe(name, options = {
    useShadow: true, attachBehavior: null, bodyContainsTemplate: false
}) {
    init(name, options);
}