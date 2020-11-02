const { Schema, model } = require('mongoose')

const scCourse = Schema({
    name: String,
    language: String,
    date: String,
    name: String,
    teacher: { type: Schema.Types.ObjectId, ref: 'teacher', required: [true, 'El id del teacher es requerido'] },
}, { versionKey: !1, timestamps: true })

module.exports = model('course', scCourse)
