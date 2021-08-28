export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const corsUrl = process.env.CORS_URL;
export const db = {
    name: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PWD || ''
};

export const logDirectory = process.env.LOG_DIR;

export const dbUri: string = 'mongodb+srv://' + db.user + ':' + db.password + '@profile-submission.dwu9g.mongodb.net/' + db.name + '?retryWrites=true&w=majority';
