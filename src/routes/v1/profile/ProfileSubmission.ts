import express from 'express';
import asyncHandler from '../../../helpers/AsyncHandler';
import ProfileSubmissionRepo from '../../../database/repository/ProfileSubmissionRepo';
import { SuccessResponse } from '../../../core/ApiResponse';
import ProfileSubmission from '../../../database/model/ProfileSubmission';
import multer from 'multer';
import CVRepo from '../../../database/repository/CVRepo';
import Logger from '../../../core/Logger';

const router = express.Router();
////////////////////////////////////////////////////////////
/**
 * Multer storage config.
 */
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
////////////////////////////////////////////////////////////

/**
 * Upload profile submission API.
 */
router.post('/upload', upload.any(),
    asyncHandler(async (req, res) => {
        const profileSubmission: ProfileSubmission = await ProfileSubmissionRepo.create({
            candidateName: req.body.candidateName,
            jobTitle: req.body.jobTitle,
            notes: req.body.notes,
            cvName: req.body.cvName,
            createdBy: req.body.createdBy
        } as ProfileSubmission);

        const totalProfileSubmissions = await ProfileSubmissionRepo.getAllSubmissionsCount();
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

/**
 * Delete profile submissions API.
 */
router.delete('/profileSubmissions',
    asyncHandler(async (_req, res) => {
        await ProfileSubmissionRepo.deleteAll();
        return new SuccessResponse('Profiles deleted', {}).send(res);
    })
);

/**
 * Get profile submissions API.
 */
router.get(
    '/profileSubmissions',
    asyncHandler(async (_req, res) => {
        let profileSubmissions: ProfileSubmission[] = await ProfileSubmissionRepo.getAll();
        profileSubmissions.length.toString();
        return new SuccessResponse(
            'Profiles',
            profileSubmissions).send(res);
    })
);

/**
 * Get CV based on cvName query param API.
 */
router.get(
    '/cv',
    asyncHandler(async (req, res) => {
        Logger.debug(`CV to be downloaded : ${req.query.cvName}`);
        const pdfFile = await CVRepo.getCV(req.query.cvName);
        res.contentType('application/pdf');
        res.write(pdfFile, 'binary');
        return res.send();
    })
);

export default router;
