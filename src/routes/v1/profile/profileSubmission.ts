import express from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import ProfileSubmissionRepo from '../../../database/repository/ProfileSubmissionRepo';
import { SuccessResponse } from '../../../core/ApiResponse';
import ProfileSubmission from '../../../database/model/ProfileSubmission';
import multer from 'multer';
import CVRepo from '../../../database/repository/CVRepo';
import Logger from '../../../core/Logger';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './uploads');
    },
    filename: function (_req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

router.post('/upload', upload.any(),
    asyncHandler(async (req, res) => {
        const profileSubmission: ProfileSubmission = await ProfileSubmissionRepo.create({
            candidateName: req.body.candidateName,
            jobTitle: req.body.jobTitle,
            notes: req.body.notes,
            cvName: req.body.cvName,
            createdBy: req.body.createdBy
        } as ProfileSubmission);

        const totalProfileSubmissions = await ProfileSubmissionRepo.getAllSubmissionsNumber();
        const socket = req.app.get('socketio');
        socket.emit('count', totalProfileSubmissions);

        const userProfileSubmission: ProfileSubmission[] = await ProfileSubmissionRepo.getAllForUser(profileSubmission.createdBy);
        if (userProfileSubmission.length % 10 === 0)
        {
            socket.emit('module10', userProfileSubmission.length);
        }

        return new SuccessResponse(`Profile uploaded: ${totalProfileSubmissions}`, profileSubmission).send(res);
    })
);

router.delete('/profileSubmission',
    asyncHandler(async (_req, res) => {
        await ProfileSubmissionRepo.deleteAll();
        return new SuccessResponse('Profiles deleted', {}).send(res);
    })
);

router.get(
    '/profileSubmissions',
    asyncHandler(async (_req, res) => {
        let profileSubmissions: ProfileSubmission[] = await ProfileSubmissionRepo.findAll();
        profileSubmissions.length.toString();
        return new SuccessResponse(
            'Profiles',
            profileSubmissions).send(res);
    })
);

router.get(
    '/profileSubmission',
    asyncHandler(async (req, res) => {
        Logger.debug(`CV to be downloaded : ${req.query.cvName}`);
        const pdfFile = await CVRepo.getCV(req.query.cvName);
        res.contentType('application/pdf');
        res.write(pdfFile, 'binary');
        return res.send();
    })
);

export default router;
