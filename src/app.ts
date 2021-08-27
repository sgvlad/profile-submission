import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'reflect-metadata';
import { corsUrl, port } from './config';
import { NotFoundError } from './core/ApiError';
import routesV1 from './routes/v1';
import Connect from './database/connect';
import Logger from './core/Logger';
import * as io from 'socket.io';

const app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 50000}));
app.use(cors({origin: corsUrl, optionsSuccessStatus: 200}));

// Routes
app.use('/v1', routesV1);
// catch 404 and forward to error handler
app.use((_req, _res, next) => next(new NotFoundError()));

const db = 'mongodb+srv://profileSubmissionUser:profileSubmissionUser@profile-submission.dwu9g.mongodb.net/profile-submission?retryWrites=true&w=majority';

Connect({db});

const socket = new io.Server(app
    .listen(port, () => {
        console.log(`server running on port : ${port}`);
    })
    .on('error', (e: any) => console.log(e)));

socket.on('connection', (socket) => {
    Logger.debug(`A user connected with ${socket.id}`);

    socket.on('disconnect', function () {
        Logger.debug(`A user disconnected with ${socket.id}`);
    });

});

app.set('socketio', socket);

// Middleware Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.send(err.message);
});

