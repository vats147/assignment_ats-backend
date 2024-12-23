const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    name: { type: String, required: true },
    email : { type : String },
    class: { type: String, required: true },
});

const classSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    name: { type: String, required: true },
    teacherId: { type: String, required: true },
});

const attendanceSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    classId: { type: String, required: true },
    records: [
        {
            studentId: { type: String, required: true },
            status: { type: String, enum: ['Present', 'Absent'], required: true },
        },
    ],
});

const userSchema = new mongoose.Schema({
    tenantId: { type: String},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher'] },
});

const schoolSchema = new mongoose.Schema({
    tenantId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    totalStudents: { type: Number, required: true },
    totalClasses: { type: Number, required: true },
});
module.exports = {
    Student: mongoose.model('Student', studentSchema),
    Class: mongoose.model('Class', classSchema),
    Attendance: mongoose.model('Attendance', attendanceSchema),
    User: mongoose.model('User', userSchema),
    School : mongoose.model('School',schoolSchema)
};
