const middleware = (message, thread, next) => {
    if (!exports.config) {
        return next(message, thread);
    }
    for (let am of exports.config.americanisms) {
        const r = new RegExp(am.americanism, 'gim');
        const m = [];
        let match;
        while ((match = r.exec(message)) != null) {
            m.push(match);
        }
        
        if (m.length === 0) {
            continue;
        }
        
        const res = [message.substring(0, m[0].index)];
        for (let i = 0; i < m.length - 1; i++) {
            const c = m[i];
            while (m[i+1].index < c.index + c.length) {
                i++;
            }
            res.push(am.correction);
            res.push(message.substring(c.index + c.length, m[i+1].index));
        }
        res.push(message.substr(m[m.length - 1].index + m[m.length - 1].length));
        message = res.join('');
    }
    next(message, thread);
};

const defaultAmericanisms = [
    {
        americanism: 'y(’|`|\'|\s)all|yawl',
        correction: 'you-all'
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
    }
];

exports.load = platform => {
    if (!exports.config.americanisms) {
        exports.config.americanisms = defaultAmericanisms;
    }
    platform.use('after', middleware);
};
exports.unload = platform => platform.unuse('after', middleware);