import { Document, model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'ProfileSubmission';
export const COLLECTION_NAME = 'submissions';

/**
 * Profile Submission DAO.
 */
export default interface ProfileSubmission extends Document
{
    candidateName: string;
    jobTitle: string;
    notes: string;
    cvName: string;
    createdBy: string;
}

const schema = new Schema(
    {
        candidateName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        jobTitle: {
            type: String,
            default: 'Full stack developer'
        },
        notes: {
            type: String
        },
        cvName: {
            type: String
        },
        createdBy: {
            type: String,
            required: true
        }
    }
);

export const ProfileSubmissionModel = model<ProfileSubmission>(DOCUMENT_NAME, schema, COLLECTION_NAME);
