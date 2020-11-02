const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLNonNull } = require('graphql');
const Course = require('../models/course')
const Teacher = require('../models/teacher')
const User = require('../models/user')
const { genJwt } = require('../config/jwt')

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        language: { type: GraphQLString },
        date: { type: GraphQLString },
        teacher: { type: TeacherType },
    })
})

const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        date: { type: GraphQLString },
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        nom: { type: GraphQLString },
        cor: { type: GraphQLString },
        pwd: { type: GraphQLString },
    })
})

const MsgType = new GraphQLObjectType({
    name: 'Msg',
    description: 'Respuesta de login',
    fields: () => ({
        msg: { type: GraphQLString },
        tk: { type: GraphQLString },
        err: { type: GraphQLString },
        dt: { type: UserType },
    })
})


const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        course: {
            type: CourseType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: async (parent, { id }) => await Course.findById(id)
        },
        courses: {
            type: new GraphQLList(CourseType),
            resolve: async () => await Course.find({}).populate('teacher')
        },
        teacher: {
            type: TeacherType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: async (parent, { id }) => await Teacher.findById(id)
        },
        teachers: {
            type: new GraphQLList(TeacherType),
            resolve: async () => await Teacher.find()
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: async (_, __, { valid, msg }) => {
                if (!valid) throw new Error(msg);
                return await User.find()
            }
        },
    },
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCourse: {
            type: CourseType,
            args: { ...CourseType.getFields(), teacher: { type: GraphQLString } },
            // args: {
            // name: { type: GraphQLString },
            // language: { type: GraphQLString },
            // date: { type: GraphQLString },
            // teacher: { type: GraphQLString },
            // },
            resolve: async (parent, args) => {
                const dt = await Course.create({ ...args })
                return await dt.populate('teacher').execPopulate()
            }
        },
        addTeacher: {
            type: TeacherType,
            args: { ...TeacherType.getFields() },
            resolve: async (parent, args) => await Teacher.create({ ...args })
        },
        updateTeacher: {
            type: TeacherType,
            args: { ...TeacherType.getFields() },
            resolve: async (_, args) => await Teacher.findByIdAndUpdate(args.id, { ...args }, { new: !0 })
        },
        deleteTeacher: {
            type: TeacherType,
            args: { id: { type: GraphQLID } },
            resolve: async (_, { id }) => await Teacher.findByIdAndDelete(id)
        },
        deleteAllTeacher: {
            type: TeacherType,
            resolve: async (_, __) => await Teacher.deleteMany()
        },
        addUser: {
            type: MsgType,
            args: { ...UserType.getFields() },
            resolve: async (_, args) => {
                return (await User.findOne({ cor: args.cor })) ?
                    { msg: 'El usuario ya existe' } :
                    { msg: 'Usuario creado exitosamente', dt: await User.create({ ...args }) };
            }
        },
        login: {
            type: MsgType,
            args: { cor: { type: GraphQLString }, pwd: { type: GraphQLString }, },
            resolve: async (_, { cor, pwd }) => {

                const rs = { msg: null, tk: null, err: null };
                const dt = await User.findOne({ cor }, (err, user) => {
                    if (err) return rs.err = 'Error login';
                    if (!user) return rs.err = 'No existe usuario - cor';
                    if (!user.verifyPwdSync(pwd)) return rs.err = 'No existe usuario - pwd';
                });
                if (rs.msg || rs.err) return rs;
                rs.tk = await genJwt(dt.id)
                return rs
            }

        }
    }
})

module.exports = new GraphQLSchema({ query, mutation })
