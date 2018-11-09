if(document.readyState === 'complete'){
    init();
}else{
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            init();
        }
    }
}


function init(){
    console.log('i am here');
    const par = window.parent;
    const content = document.body.innerHTML;
    class Temp extends (<any>par).HTMLElement{
        constructor(){
            super();
        }
        connectedCallback(){
            this.innerHTML = content;
        }
    }
    window.parent.customElements.define('test-1', Temp);
}

