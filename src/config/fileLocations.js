import dotenv from 'dotenv';

dotenv.config();

const FILE_LOCATIONS = {
    STUDENTS: {
        PERSONAL_DOCS: process.env.STUDENTS_PERSONAL_DOCS,
        CERTIFICATES: process.env.STUDENTS_CERTIFICATES,
        OTHERS: process.env.STUDENTS_OTHERS
    },
    STAFFS: {
        PERSONAL_DOCS: process.env.STAFFS_PERSONAL_DOCS,
        CERTIFICATES: process.env.STAFFS_CERTIFICATES,
        OTHERS: process.env.STAFFS_OTHERS
    },
}

export default FILE_LOCATIONS;