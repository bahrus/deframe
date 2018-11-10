
function init(name: string, options: any = null){
    if(document.readyState !== 'complete'){
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                init(name, options);
            }
        }
        return;
    }
    const top = window.top;
    const content = document.body.innerHTML;
    //console.log(script!.src)
    class Temp extends (<any>top).HTMLElement{
        constructor(){
            super();
        }
        connectedCallback(){
            this.innerHTML = content;
        }
    }
    top.customElements.define(name, Temp);
}

export function deframe(name: string, options: any = null){
    init(name, options)
}

