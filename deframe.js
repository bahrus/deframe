function init(name, options = null) {
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
    const content = document.body.innerHTML;
    //console.log(script!.src)
    class Temp extends top.HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.innerHTML = content;
        }
    }
    top.customElements.define(name, Temp);
}
export function deframe(name, options = null) {
    init(name, options);
}
//# sourceMappingURL=deframe.js.map