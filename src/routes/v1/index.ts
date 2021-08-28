import express from 'express';
import ProfileSubmission from './profile/ProfileSubmission';

const router = express.Router();

/**
 * All API routes.
 */
router.use('/profile', ProfileSubmission);

export default router;
