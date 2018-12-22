export function define(win: Window, name: string){
    document.querySelectorAll('link[as="script"]').forEach(link => {
        const script = top.document.createElement('script') as HTMLScriptElement;
        script.src = (link as HTMLLinkElement).href;
        Array.from(link.attributes).forEach(attr=>{
            script.setAttribute(attr.name, attr.value);
        })
        win.document.head!.appendChild(script);
    });
    class Def extends (<any>win).HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            const template = document.body.firstElementChild as HTMLTemplateElement
            this.shadowRoot!.appendChild(template.content.cloneNode(true));
            const target = this.shadowRoot!.querySelector('#content');
        
            this.shadowRoot!.querySelector('[name="template"]')!.addEventListener('slotchange', (event: Event) => {
              const sE = event.target as HTMLSlotElement;
              sE.assignedNodes().forEach(el => {
                const t = el as HTMLTemplateElement;
                const c = this.shadowRoot!.querySelector('#content') as HTMLDivElement;
                c.innerHTML = '';
                c.appendChild(t.content.cloneNode(true));
              })
            });
          }
    }
    win.customElements.define(name, Def);
}