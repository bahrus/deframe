
function init(name: string, options: any = null){
    if(document.readyState !== 'complete'){
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        }
        return;
    }
    const par = window.parent;
    const content = document.body.innerHTML;
    const script = document.querySelector('script') as HTMLScriptElement;
    const scriptClone = par.document.createElement('script') as HTMLScriptElement;
    scriptClone.type = script.type;
    scriptClone.src = script.src;
    par.document.head!.appendChild(scriptClone);
    //console.log(script!.src)
    class Temp extends (<any>par).HTMLElement{
        constructor(){
            super();
        }
        connectedCallback(){
            this.innerHTML = content;
        }
    }
    par.customElements.define(name, Temp);
}

export function deframe(name: string, options: any = null){
    init(name, options)
}

