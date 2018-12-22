export function define(win, name) {
    document.querySelectorAll('link[as="script"]').forEach(link => {
        const script = top.document.createElement('script');
        script.src = link.href;
        Array.from(link.attributes).forEach(attr => {
            script.setAttribute(attr.name, attr.value);
        });
        win.document.head.appendChild(script);
    });
    class Def extends win.HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            const template = document.body.firstElementChild;
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            const target = this.shadowRoot.querySelector('#content');
            this.shadowRoot.querySelector('[name="template"]').addEventListener('slotchange', (event) => {
                const sE = event.target;
                sE.assignedNodes().forEach(el => {
                    const t = el;
                    const c = this.shadowRoot.querySelector('#content');
                    c.innerHTML = '';
                    c.appendChild(t.content.cloneNode(true));
                });
            });
        }
    }
    win.customElements.define(name, Def);
}