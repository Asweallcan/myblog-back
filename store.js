const Redis = require("ioredis");
const Store = require("koa-session2/libs/store");

class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis({
            port: 6379,
            host: '127.0.0.1',
            family: 4,
            password: '',
            db: 0
        });
    }

    async get(sid) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }

    async set(session, opts) {
        if (!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session));
        return opts.sid;
    }

    async destroy(sid) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}

module.exports = RedisStore;