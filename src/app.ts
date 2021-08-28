import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { corsUrl, dbUri, environment, port } from './config';
import { ApiError, InternalError, NotFoundError } from './core/ApiError';
import routesV1 from './routes/v1';
import DbConnect from './database/DBConnect';
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

DbConnect({db: dbUri});

/**
 * Create new socket.
 */
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

/**
 * Middleware Error Handler
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
        return ApiError.handle(err, res);
    } else {
        if (environment === 'development') {
            Logger.error(err);
            return res.status(500).send(err.message);
        }
        return ApiError.handle(new InternalError(), res);
    }
});

