class dust {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.vx = Math.random() * 2 + 2;
        this.vy = Math.random() * 2;
        this.color = '#fff';
        this.shadowBlur = Math.random() * 3;
        this.shadowX = (Math.random() * 2) - 1;
        this.shadowY = (Math.random() * 2) - 1;
        this.radiusX = Math.random() * 3;
        this.radiusY = Math.random() * 3;
        this.rotation = Math.PI * Math.floor(Math.random() * 2);
    }
}
class canvasDust {
    constructor(canvasID) {
        this.width = 300;
        this.height = 300;
        this.dustQuantity = 50;
        this.dustArr = [];
        const canvas = document.getElementById(canvasID);
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.build();
            window.addEventListener('resize', () => this.resize());
        }
        else {
            throw new Error('canvasID 无效');
        }
    }
    build() {
        this.resize();
        if (this.ctx) {
            const point = canvasDust.getPoint(this.dustQuantity);
            for (let i of point) {
                const dustObj = new dust();
                this.buildDust(i[0], i[1], dustObj);
                this.dustArr.push(dustObj);
            }
            setInterval(() => {
                this.play();
            }, 40);
        }
    }
    play() {
        var _a;
        const dustArr = this.dustArr;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
        for (let i of dustArr) {
            if (i.x < 0 || i.y < 0) {
                const x = this.width;
                const y = Math.floor(Math.random() * window.innerHeight);
                i.x = x;
                i.y = y;
                this.buildDust(x, y, i);
            }
            else {
                const x = i.x - i.vx;
                const y = i.y - i.vy;
                this.buildDust(x, y, i);
            }
        }
    }
    buildDust(x, y, dust) {
        const ctx = this.ctx;
        if (x)
            dust.x = x;
        if (y)
            dust.y = y;
        if (ctx) {
            ctx.beginPath();
            ctx.shadowBlur = dust.shadowBlur;
            ctx.shadowColor = dust.color;
            ctx.shadowOffsetX = dust.shadowX;
            ctx.shadowOffsetY = dust.shadowY;
            ctx.ellipse(dust.x, dust.y, dust.radiusX, dust.radiusY, dust.rotation, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = dust.color;
            ctx.fill();
        }
    }
    resize() {
        const canvas = this.canvas;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.width = width;
        this.height = height;
        this.dustQuantity = Math.floor((width + height) / 38);
        if (canvas !== undefined) {
            canvas.width = width;
            canvas.height = height;
        }
    }
    static getPoint(number = 1) {
        let point = [];
        for (let i = 0; i < number; i++) {
            const x = Math.floor(Math.random() * window.innerWidth);
            const y = Math.floor(Math.random() * window.innerHeight);
            point.push([x, y]);
        }
        return point;
    }
}
class indexs {
    constructor() {
        this.index = [];
        this.totop = document.getElementById('to-top');
        this.scrollID = null;
        this.scrolling = 0;
        this.tocLink = document.getElementsByClassName('toc-link');
        if (this.tocLink.length > 0) {
            this.setItem(this.tocLink.item(0));
        }
        document.addEventListener('scroll', () => {
            this.tocLink = document.getElementsByClassName('toc-link');
            if (this.tocLink.length > 0) {
                this.headerLink = document.getElementsByClassName('headerlink');
                this.postContent = document.getElementById('post-content');
                const totop = document.getElementById('to-top');
                ++this.scrolling;
                if (this.scrollID == null && this.tocLink.length > 0) {
                    this.scrollID = setInterval(this.modifyIndex.bind(this), 50);
                }
                setTimeout(() => {
                    if (--this.scrolling == 0) {
                        clearInterval(this.scrollID);
                        this.scrollID = null;
                        const totop = document.getElementById('to-top');
                        if (this.totop !== null
                            && document.getElementById('post-title').getBoundingClientRect().top < -200) {
                            totop.style.display = '';
                            setTimeout(() => totop.style.opacity = '1', 300);
                        }
                        else {
                            totop.style.opacity = '0';
                            setTimeout(() => totop.style.display = 'none', 300);
                        }
                    }
                }, 200);
            }
        }, { passive: true });
    }
    setItem(item) {
        item.classList.add('active');
        let $parent = item.parentElement, brother = $parent.children;
        for (let i = 0; i < brother.length; i++) {
            const item = brother.item(i);
            if (item.classList.contains('toc-child')) {
                item.classList.add('has-active');
                break;
            }
        }
        for (let $parent = item.parentElement; $parent.classList[0] != 'toc'; $parent = $parent.parentElement) {
            if ($parent.classList[0] == 'toc-child') {
                $parent.classList.add('has-active');
            }
        }
    }
    reset() {
        let tocs = document.getElementsByClassName('active');
        let tocTree = document.getElementsByClassName('has-active');
        for (; tocs.length;) {
            const item = tocs.item(0);
            item.classList.remove('active');
        }
        for (; tocTree.length;) {
            const item = tocTree.item(0);
            item.classList.remove('has-active');
        }
    }
    modifyIndex() {
        for (let i = 0; i < this.headerLink.length; i++) {
            const link = this.headerLink.item(i);
            if (link) {
                this.index.push(link.getBoundingClientRect().top);
            }
        }
        this.reset();
        for (let i = 0; i < this.tocLink.length; ++i) {
            const item = this.tocLink.item(i);
            if (i + 1 == this.index.length || (this.index[i + 1] > 150 && (this.index[i] <= 150 || i == 0))) {
                this.setItem(item);
                break;
            }
        }
        this.index = [];
    }
    scrolltop() {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.getElementById('to-top').style.opacity = '0';
        setTimeout(() => this.totop.style.display = 'none', 300);
    }
}
class codes {
    reverse(item, s0, s1) {
        const block = item.parentElement;
        if (block.classList.contains(s0)) {
            block.classList.remove(s0);
            block.classList.add(s1);
        }
        else {
            block.classList.remove(s1);
            block.classList.add(s0);
        }
    }
    doAsMermaid(item) {
        let Amermaid = item.getElementsByClassName('mermaid').item(0);
        item.outerHTML = '<div class="highlight mermaid">' + Amermaid.innerText + '</div>';
    }
    resetName(str) {
        if (str == 'plaintext')
            return 'TEXT';
        if (str == 'cs')
            return 'C#';
        return str.toUpperCase();
    }
    doAsCode(item) {
        const codeType = item.classList[1], lineCount = item.getElementsByClassName('gutter').item(0).children[0].childElementCount >> 1;
        item.classList.add(lineCount < 16 ? 'open' : 'fold');
        item.innerHTML =
            '<span class="code-header"><span class="code-title">\
        <div class="code-icon"></div>' +
                this.resetName(codeType) + ' 共 ' + lineCount + ' 行</span>\
        <span class="code-header-tail">\
          <button class="code-copy"></button>\
          <span class="code-space">展开</span>\
        </span>\
    </span></span>\
    <div class="code-box">' + item.innerHTML + '</div>';
        item.getElementsByClassName('code-copy').item(0).addEventListener('click', (click) => {
            const button = click.target;
            navigator.clipboard.writeText(item.getElementsByTagName('code').item(0).innerText);
            button.classList.add('copied');
            setTimeout(() => button.classList.remove('copied'), 1200);
        });
        item.getElementsByClassName('code-header').item(0).addEventListener('click', (click) => {
            if (!click.target.classList.contains('code-copy')) {
                this.reverse(click.currentTarget, 'open', 'fold');
            }
        });
    }
    findCode() {
        let codeBlocks = document.getElementsByClassName('highlight');
        for (let i = 0; i < codeBlocks.length; i++) {
            const item = codeBlocks.item(i);
            if (item.getElementsByClassName('mermaid').length > 0) {
                this.doAsMermaid(item);
            }
            else {
                this.doAsCode(item);
            }
        }
    }
    constructor() { }
}
class cursors {
    constructor() {
        this.first = true;
        this.outer = document.getElementById('cursor-outer').style;
        this.effecter = document.getElementById('cursor-effect').style;
        this.opacity = 0;
        this.ishead = true;
        this.moveEventID = null;
        this.fadeEventID = null;
        document.querySelector('header').addEventListener('mouseenter', () => this.ishead = true, { passive: true });
        document.querySelector('header').addEventListener('mouseout', () => this.ishead = false, { passive: true });
        window.addEventListener('mousemove', mouse => this.reset(mouse), { passive: true });
        window.addEventListener('click', mouse => this.Aeffect(mouse), { passive: true });
        this.pushHolders();
        const observer = new MutationObserver(this.pushHolders.bind(this));
        observer.observe(document, { childList: true, subtree: true });
    }
    move() {
        if (this.now !== undefined) {
            let SX = this.outer.left, SY = this.outer.top;
            let preX = Number(SX.substring(0, SX.length - 2)), preY = Number(SY.substring(0, SY.length - 2));
            let nxtX = this.now.x, nxtY = this.now.y;
            let delX = (nxtX - preX) / 13, delY = (nxtY - preY) / 13;
            let equal = true;
            if (Math.abs(delX) >= 0.1) {
                this.outer.left = String(preX + delX) + 'px';
                equal = false;
            }
            else {
                this.outer.left = String(nxtX) + 'px';
            }
            if (Math.abs(delY) >= 0.1) {
                this.outer.top = String(preY + delY) + 'px';
                equal = false;
            }
            else {
                this.outer.top = String(nxtY) + 'px';
            }
            if (equal) {
                clearInterval(this.moveEventID);
                this.moveEventID = null;
            }
        }
    }
    reset(mouse) {
        if (this.moveEventID === null) {
            this.moveEventID = window.setInterval(this.move.bind(this), 1);
        }
        this.now = mouse;
        if (this.first) {
            this.first = false;
            this.outer.left = String(this.now.x) + 'px';
            this.outer.top = String(this.now.y) + 'px';
        }
    }
    fadeOut() {
        if (this.opacity > 0) {
            let delta = this.opacity * 0.11;
            if (delta < 0.001) {
                delta = this.opacity;
            }
            this.effecter.transform = 'translate(-50%, -50%) scale(' + String(this.scale += delta) + ')';
            this.effecter.opacity = String((this.opacity -= delta));
        }
        else {
            clearInterval(this.fadeEventID);
            this.fadeEventID = null;
        }
    }
    Aeffect(mouse) {
        if (this.fadeEventID === null) {
            this.fadeEventID = window.setInterval(this.fadeOut.bind(this), 10);
            this.effecter.left = String(mouse.x) + 'px';
            this.effecter.top = String(mouse.y) + 'px';
            this.effecter.transform = 'translate(-50%, -50%) scale(0)';
            this.effecter.opacity = '1';
            this.scale = 0;
            this.opacity = 1;
        }
    }
    hold() {
        this.outer.height = '24px';
        this.outer.width = '24px';
        this.outer.background = "rgba(255, 255, 255, 0.5)";
    }
    relax() {
        this.outer.height = '36px';
        this.outer.width = '36px';
        this.outer.background = "unset";
    }
    pushHolder(items) {
        for (let i = 0; i < items.length; i++) {
            const item = items.item(i);
            item.addEventListener('mouseover', () => this.hold(), { passive: true });
            item.addEventListener('mouseout', () => this.relax(), { passive: true });
        }
    }
    pushHolders() {
        this.pushHolder(document.getElementsByTagName('a'));
        this.pushHolder(document.getElementsByTagName('input'));
        this.pushHolder(document.getElementsByTagName('button'));
        this.pushHolder(document.getElementsByClassName('code-header'));
        this.pushHolder(document.getElementsByClassName('gt-user-inner'));
        this.pushHolder(document.getElementsByClassName('gt-header-textarea'));
    }
}
let index = new indexs();
let code = new codes();
let cursor = new cursors();
new canvasDust('canvas-dust');
