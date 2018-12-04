import { constants } from "zlib";

type Class = { new(...args: any[]): any; };

export interface IAttachBehavior {
    selector: string,
    attach: (target: HTMLElement, win: Window) => void;
}

export interface IDeframeOptions {
    useShadow: boolean,
    attachBehavior: IAttachBehavior | null,
    bodyContainsTemplate: boolean,
    defineFn: ((top: Window, templ: HTMLTemplateElement, options: IDeframeOptions) => void) | null;
}
function test(win: Window){
    try{
        win.customElements.get('test-ing');
    }catch(e){
        return false;
    }

    return true;
}
function getTop(win: Window): Window{
    if((<any>win).buckStopsHere){
        return win;
    }
    if(!test(win.parent)) return win;
    if(win === win.parent) return win;
    return getTop(win.parent);
}
function init(name: string, options: IDeframeOptions) {
    if (document.readyState !== 'complete') {
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        }
        return;
    }
    const top = getTop(window);;

    document.querySelectorAll('link[as="script"][rel="preloadmodule"]').forEach(link => {
        const script = top.document.createElement('script') as HTMLScriptElement;
        script.src = (link as HTMLLinkElement).href;
        script.type = 'module';
        top.document.head!.appendChild(script);
    });
    let preDefTempl: HTMLTemplateElement | null = null;
    if (options.bodyContainsTemplate) preDefTempl = document.body.firstElementChild as HTMLTemplateElement;
    if (window === top) {
        const ab = options.attachBehavior;
        if (ab !== null) {
            document.querySelectorAll(ab.selector).forEach((el: any) => {
                ab.attach(el, top);
            })
        }
        if (preDefTempl) {
            document.body.appendChild(preDefTempl.content.cloneNode(true));
            preDefTempl.remove();
        }
        return;
    }
    if (preDefTempl === null) {
        preDefTempl = top.document.createElement('template') as HTMLTemplateElement;
        preDefTempl.innerHTML = document.body.innerHTML;
    }
    if (options.defineFn) {
        options.defineFn(top, preDefTempl, options);
    } else {
        //console.log(script!.src)
        class Def extends (<any>top).HTMLElement {
            constructor() {
                super();
                if (options.useShadow) {
                    this.attachShadow({ mode: 'open' });
                    const clone = preDefTempl!.content.cloneNode(true);
                    this.shadowRoot.appendChild(clone);

                }
            }
            connectedCallback() {
                const ab = options.attachBehavior;
                if (!options.useShadow) {
                    const clone = preDefTempl!.content.cloneNode(true);
                    this.appendChild(clone);
                    if (ab) {
                        this.querySelectorAll(ab.selector).forEach((el: any) => {
                            ab.attach(el, top);
                        })
                    }
                } else {
                    if (ab) {
                        this.shadowRoot.querySelectorAll(ab.selector).forEach((el: any) => {
                            ab.attach(el, top);
                        })
                    }
                }
            }
        }
        top.customElements.define(name, Def);
    }

    window.parent.document.querySelectorAll('iframe').forEach(element => {
        if (element.contentWindow === window) {
            element.remove();
        }
    });
}

export function deframe(name: string, options: IDeframeOptions = {
    useShadow: true, attachBehavior: null, bodyContainsTemplate: false, defineFn: null
}) {
    init(name, options)
}

