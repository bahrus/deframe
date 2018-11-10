function init(name, options = null) {
    if (document.readyState !== 'complete') {
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        };
        return;
    }
    const par = window.parent;
    const content = document.body.innerHTML;
    const script = document.querySelector('script');
    const scriptClone = par.document.createElement('script');
    scriptClone.type = script.type;
    scriptClone.src = script.src;
    par.document.head.appendChild(scriptClone);
    //console.log(script!.src)
    class Temp extends par.HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.innerHTML = content;
        }
    }
    par.customElements.define(name, Temp);
}
export function deframe(name, options = null) {
    init(name, options);
}
//# sourceMappingURL=deframe.js.map