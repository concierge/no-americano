const defaultAmericanisms = [
    {
        americanism: 'y.all|yawl',
        correction: 'bros'
    },
    {
        americanism: 'color',
        correction: 'colour'
    },
    {
        americanism: 'ize',
        correction: 'ise'
    },
    {
        americanism: 'mom',
        correction: 'mum'
    },
    {
        americanism: 'that\'ll learn you',
        correction: 'that will teach you'
    },
    {
        americanism: 'I could care less',
        correction: 'I couldn\'t care less'
    },
    {
        americanism: 'howdy',
        correction: 'Kia Ora'
    },
    {
        americanism: 'dunnit',
        correction: 'doesn\'t it'
    },
    {
        americanism: 'get some gas',
        correction: 'get some petrol'
    },
    {
        americanism: 'low on gas',
        correction: 'has low petrol'
    },
    {
        americanism: 'pass some gas',
        correction: 'did a fart'
    },
    {
        americanism: 'trash',
        correction: 'rubbish'
    },
    {
        americanism: 'trunk',
        correction: 'boot'
    },
    {
        americanism: 'aluminum',
        correction: 'aluminium'
    },
    {
        americanism: 'shopping cart',
        correction: 'shopping trolley'
    },
    {
        americanism: 'train car',
        correction: 'train carriage'
    },
    {
        americanism: 'sulfur',
        correction: 'sulphur'
    },
    {
        americanism: 'coffee',
        correction: 'tea'
    },
    {
        americanism: 'automotive repair shop',
        correction: 'panel beater'
    },
    {
        americanism: 'trail',
        correction: 'track'
    },
    {
        americanism: 'hike',
        correction: 'tramp'
    },
    {
        americanism: 'trekking',
        correction: 'tramping'
    },
    {
        americanism: 'I\'m down',
        correction: 'I\'m keen'
    },
    {
        americanism: 'I\'d be up for that',
        correction: 'I\'m keen'
    },
    {
        americanism: 'I\'d',
        correction: 'I would'
    },
    {
        americanism: 'It\'s hot out$',
        correction: 'It\'s hot outside'
    },
    {
        americanism: 'It\'s cold out$',
        correction: 'It\'s cold outside'
    },
    {
        americanism: 'math$',
        correction: 'maths'
    },
    {
        americanism: 'waiting on',
        correction: 'waiting for'
    },
    {
        americanism: 'buck',
        correction: 'dollar'
    },
    {
        americanism: 'french fries',
        correction: 'hot chips'
    },
    {
        americanism: 'alcohol',
        correction: 'grog'
    },
    {
        americanism: 'gas station',
        correction: 'petrol station'
    },
    {
        americanism: 'garbage',
        correction: 'rubbish'
    },
    {
        americanism: 'deplane',
        correction: 'disembark'
    },
    {
        americanism: 'take out',
        correction: 'takeaways'
    },
    {
        americanism: 'alternate',
        correction: 'alternative'
    }
];

const ensure = (obj, def, ...args) => {
    let res = obj;
    for (let i = 0; i < args.length; i++) {
        if (!res[args[i]]) {
            if (i === args.length - 1) {
                res[args[i]] = def;
            }
            else {
                res[args[i]] = {};
            }
        }
        res = res[args[i]];
    }
    return res;
};

const middleware = (message, thread, next) => {
    if (!exports.config) {
        return next(message, thread);
    }
    const v = ensure(exports.config, [], thread, 'vetoes');
    const a = ensure(exports.config, [], thread, 'americanisms').concat(defaultAmericanisms)
        .filter(e => !v.includes(e.americanism));
    for (let am of a) {
        const r = new RegExp(am.americanism, 'gim');
        const m = [];
        let match;
        while ((match = r.exec(message)) != null) {
            m.push(match);
        }
        
        if (m.length === 0) {
            continue;
        }
        
        let offset = 0;
        for (let i of m) {
            message = message.substr(0, i.index + offset) + am.correction + message.substr(i.index + offset + i[0].length);
            offset += (am.correction.length - i[0].length);
        }
    }
    next(message, thread);
};

exports.load = platform => platform.use('after', middleware);
exports.unload = platform => platform.unuse('after', middleware);