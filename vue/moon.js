
class Compiler {
    constructor(vm, el, data) {
        this.vm = vm;
        this.data = data
        this.el = this.isDocument(el) ? el : document.querySelector(el);
        const fatMat = this.node2Fatmat(this.el)
        this.compiler(fatMat)
        this.el.appendChild(fatMat)

    }
    isDocument(el) {
        return el.nodeType === 1
    }
    node2Fatmat(node) {
        const listS = document.createDocumentFragment();
        let first;
        while (first = node.firstChild) {
            listS.appendChild(first)
        }
        return listS
    }
    compiler(node) {
        node.childNodes.forEach((item, index) => {
            if(this.isDocument(item)){
                this.compilerElement(item)
                this.compiler(item)
            }else{
                this.compilerText(item)
            }
        })
    }

    compilerText(item) {
        const content = item.textContent
        const pat = new RegExp(/\{\{(.+?)\}\}/)
        if(pat.test(content)){
            CompilerUtil['text'](item, this.vm, content)
        }
    }
    compilerElement(item) {
        const attributes = item.attributes
        for(let i = 0; i < attributes.length; i++) {
            let {value, name} = attributes[i]
            if(this.isDirective(name)){
                const n = name.slice(2,name.length)
                CompilerUtil[n](value, this.vm, item)

            }
        }
    }
    isText(str) {
        const pat = new RegExp(/\{\{(.+?)\}\}/)
        return pat.test(str)
    }
    isDirective(str) {
        return str.startsWith('v-')
    }
}

const CompilerUtil = {
    model(value, vm, item){
        const currentVal = this.getVal(value,vm)
        new Watcher(vm, value, (newVal)=>{
            this.update['updateModel'](item, newVal);
        })
        item.addEventListener('input',(evet) => {
            this.setVal(value, vm, evet.target.value)
        })
        this.update['updateModel'](item, currentVal);
    },
    setVal(exp, vm, value){
        const array = exp.split('.');
        let first;
        let extend = vm.$data
        while ( first = array.shift()) {
            if(array.length === 0){
                extend[first] = value
                break
            }
            extend = extend[first]

        }

    },
    getContext(content, vm){
        return content.replace(/\{\{(.+?)\}\}/g, (...arg) => {
            return this.getVal(arg[1],vm)
        })
    },
    text(item, vm, content) {
        const  text = content.replace(/\{\{(.+?)\}\}/g, (...arg) => {
            new Watcher(vm, arg[1], ()=>{
                this.update['updateHtml'](item, this.getContext(content, vm))
            })
            return this.getVal(arg[1],vm)
        })
        this.update['updateHtml'](item, text)
    },
    html() {},
    getVal(value, datas) {
       return value.split('.').reduce((data, item) => {
                return data[item]
        },datas.$data)
    },
    update: {
        updateHtml(item, value) {
            item.textContent = value
        },
        updateModel(item, value) {
            item.value = value
        },
    }
}
class Observer {
    constructor(data, vm) {
        if(this.isObject(data)){
            this.observer(data, vm)
        }
    }
    defineReactive(key, value, data){
        const dep = new Dep()
        const that = this
        Object.defineProperty(data, key, {
            get() {
                if(Dep.target){
                    dep.addSub(Dep.target)
                }
                return value
            },
            set(newValue) {
                if(newValue === value) return
                if(that.isObject(newValue)) that.observer(newValue)
                value = newValue
                dep.Notify()
            },
        })

    }
    observer(data, vm) {
        for(let key in data){
            if(data.hasOwnProperty(key)){
                if (this.isObject(data[key])) {
                    this.observer(data[key], vm)
                } else {
                    this.defineReactive(key, data[key], data)
                }
            }
        }

    }
    isObject(val) {
        return typeof val === 'object' && !(Array.isArray(val))
    }
}

class Watcher {
    constructor(vm,val,fn){
        this.vm = vm;
        this.val = val
        this.fn = fn
        this.oldVal = this.get()
    }
    get() {
        Dep.target = this
        return CompilerUtil.getVal(this.val, this.vm)
        Dep.target = null
    }
    update() {
        const newVal = CompilerUtil.getVal(this.val, this.vm)
        if(this.oldVal === newVal)return
        this.fn(newVal)
    }
}
class Dep {
    constructor(){
        this.target = null;
        this.dep = []
    }
    addSub(vm){
        this.dep.push(vm)
        let set = new Set(this.dep)
        this.dep = [...set]
    }
    Notify() {
        console.log(this.dep)
        this.dep.forEach(dep=>{
            dep.update()
        })
    }
}
class Vue {
    constructor(options) {
        // 检测有没有 new
        if(!(this instanceof Vue)) return
        const {data, el} = options;
        this.$data = data;
        this.$el = el;
        new Observer(this.$data, this)
        new Compiler(this, this.$el, this.$data)
    }
}

