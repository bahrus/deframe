
type Class = { new(...args: any[]): any; };

export interface IAttachBehavior{
    selector: string,
    attach: (target: HTMLElement, win: Window) => void;
}

export interface IDeframeOptions{
    useShadow: boolean,
    attachBehavior: IAttachBehavior | null,
}
function init(name: string, options: IDeframeOptions){
    if(document.readyState !== 'complete'){
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        }
        return;
    }
    const top = window.top;
    document.querySelectorAll('link[as="script"][rel="preloadmodule"]').forEach(link =>{
        const script = top.document.createElement('script') as HTMLScriptElement;
        script.src = (link as HTMLLinkElement).href;
        script.type = 'module';
        top.document.head!.appendChild(script);
    });
    if(window === top){
        const ab = options.attachBehavior;
        if(ab !== null){
            document.querySelectorAll(ab.selector).forEach((el: any) =>{
                ab.attach(el, top);
            })
        }
        return;      
    }
    const template = top.document.createElement('template') as HTMLTemplateElement;
    template.innerHTML = document.body.innerHTML;
    //console.log(script!.src)
    class Def extends (<any>top).HTMLElement{
        constructor(){
            super();
            if(options.useShadow){
                const clone = template.content.cloneNode(true);
                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(template.content.cloneNode(true));

            }
        }
        connectedCallback(){
            const ab = options.attachBehavior;
            if(!options.useShadow){
                const clone = template.content.cloneNode(true);
                this.appendChild(clone);
                if(ab !== null){
                    this.querySelectorAll(ab.selector).forEach((el: any) =>{
                        ab.attach(el, top);
                    })
                }
            }else{
                if(ab !== null){
                    this.shadowRoot.querySelectorAll(ab.selector).forEach((el: any) =>{
                        ab.attach(el, top);
                    })
                }
            }
        }
    }
    top.customElements.define(name, Def);

    window.parent.document.querySelectorAll('iframe').forEach(element => {
        if(element.contentWindow === window){
            element.remove();
        }
    });
}

export function deframe(name: string, options: IDeframeOptions = {useShadow: true, attachBehavior: null}){
    init(name, options)
}

