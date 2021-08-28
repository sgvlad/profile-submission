import express from 'express';
import profileSubmission from 'src/routes/v1/profile/ProfileSubmission';

const router = express.Router();

/**
 * All API routes.
 */
router.use('/profile', profileSubmission);

export default router;
