const { Schema, model } = require('mongoose')

const scTeacher = Schema({
    name: String,
    age: Number,
    active: Boolean,
    date: String,
}, { versionKey: !1, timestamps: true })

module.exports = model('teacher', scTeacher)
