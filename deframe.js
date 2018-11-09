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
    class Temp extends par.HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.innerHTML = content;
        }
    }
    window.parent.customElements.define(name, Temp);
}
export function deframe(name, options = null) {
    init(name, options);
}
//# sourceMappingURL=deframe.js.map