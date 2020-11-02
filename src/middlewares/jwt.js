const jwt = require('jsonwebtoken')

const valJwt = (rq, rs, nx) => {
    const tk = rq.header('tk')
    if (!tk) {
        rq.auth = { valid: false, msg: 'No hay Tk' }
        return nx();
    }
    try {
        const { id } = jwt.verify(tk, process.env.TK_KEY);
        rq.auth = { valid: true, msg: 'success', id }
        return nx();
    } catch (er) {
        rq.auth = { valid: false, msg: 'Tk no válido' }
        return nx();
    }
}

module.exports = { valJwt }
