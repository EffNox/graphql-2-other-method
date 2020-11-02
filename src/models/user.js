const { Schema, model } = require('mongoose')
const { isEmail } = require('validator');

const scUser = Schema({
    nom: String,
    cor: { type: String, required: true, validate: [isEmail, 'Correo Electornico mal formado'], createIndexes: { unique: true }, },
    pwd: { type: String, required: true, bcrypt: true },
}, { versionKey: !1, timestamps: true })
scUser.plugin(require('mongoose-bcrypt'), { rounds: 12 });

// scUser.pre('save', async function save(next) {
//     if (!this.isModified('pwd')) return next();
//     try {
//         const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
//         this.pwd = await bcrypt.hash(this.pwd, salt);
//         return next();
//     } catch (err) {
//         return next(err);
//     }
// });

// scUser.methods.validatePassword = async function validatePassword(data) {
//     return await bcrypt.compare(data, this.pwd);
// };


// OTRTO METODO
// UserSchema.pre("save", function (next) {
//     // store reference
//     const user = this;
//     if (user._password === undefined) {
//         return next();
//     }
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) console.log(err);
//         // hash the password using our new salt
//         bcrypt.hash(user._password, salt, function (err, hash) {
//             if (err) console.log(err);
//             user.hashed_password = hash;
//             next();
//         });
//     });
// });

// /**
//  * Methods
// */
// UserSchema.methods = {
//     comparePassword: function(candidatePassword, cb) {
//         bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//             if (err) return cb(err);
//             cb(null, isMatch);
//         });
//     };
// }

module.exports = model('user', scUser)
