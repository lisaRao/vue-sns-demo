/**
 * spa 单页面存储数据
 */

let cacheObj = {};

export const normalCache = {
    set: function(key, val) {
        cacheObj[key] = JSON.stringify(val);
    },
    get: function(key) {
        let value = cacheObj[key];

        if (typeof value !== 'string') {
            return undefined;
        }

        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    },
    getAll: function() {
        let obj = {};
        for (let key in cacheObj) {
            obj[key] = this.get(key);
        }

        return obj;
    },
    size: function() {
        return Object.keys(cacheObj).length;
    },

    remove: function(key) {
        delete cacheObj[key];
    },

    removeAll: function() {
        cacheObj = {};
    }
};

export const localCache = {
    storage: localStorage,
    set: function(key, val) {
        this.storage.setItem(key, JSON.stringify(val));
    },
    get: function(key) {
        let value = this.storage.getItem(key);

        if (typeof value !== 'string') {
            return undefined;
        }

        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    },

    getAll: function() {
        let obj = {};
        let len = this.storage.length;

        for (let i = 0; i < len; i++) {
            let key = this.storage.key(i);
            obj[key] = this.get(key);
        }

        return obj;
    },

    size: function() {
        return this.storage.length;
    },

    remove: function(key) {
        this.storage.removeItem(key);
    },

    removeAll: function() {
        this.storage.clear();
    }
};

export const sessionCache = {
    storage: sessionStorage,
    set: localCache.set,
    get: localCache.get,
    getAll: localCache.getAll,
    size: localCache.size,
    remove: localCache.remove,
    removeAll: localCache.removeAll
};

export const cookieCache = {
    set: function(key, value) {
        // set
    },
    get: function(key) {
        const currCookie = document.cookie;
        return getValueByKey(key, currCookie)
    }
}

function getValueByKey(key, obj) {
    if(!obj) return;
    let objvalue = '';
    if(obj.indexOf(';') > -1) {
        const newObj = obj.split(';').reduce(function(obj, cur) {
            var x = cur.split('=');
            obj[x[0]] = x[1];
            return obj;
        }, {});
        objvalue = newObj[key]
    } else {
        objvalue = obj.split('=')[1];
    }

    return objvalue;
}






