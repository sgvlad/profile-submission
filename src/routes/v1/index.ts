import express from 'express';
import profileSubmission from './profile/profileSubmission';
const router = express.Router();

router.use('/profile', profileSubmission);

export default router;
