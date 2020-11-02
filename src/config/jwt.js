const jwt = require('jsonwebtoken')

const genJwt = (id) => {
    return new Promise((rs, rj) => {
        const pl = { id }
        jwt.sign(pl, process.env.TK_KEY, { expiresIn: '24h' }, (er, tk) => (er) ? rj('No Tk') : rs(tk))
    })
}

module.exports = { genJwt }
