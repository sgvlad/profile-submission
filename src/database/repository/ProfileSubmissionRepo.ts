import ProfileSubmission, { ProfileSubmissionModel } from '../model/ProfileSubmission';

/**
 * Persistence layer for profile submissions.
 */
export default class ProfileSubmissionRepo
{
    /**
     * Creates a new profile submission in DB.
     * @param profileSubmission to be created
     */
    public static async create(profileSubmission: ProfileSubmission): Promise<ProfileSubmission>
    {
        const createdProfileSubmission = await ProfileSubmissionModel.create(profileSubmission);
        return createdProfileSubmission.toObject<ProfileSubmission>();
    }

    /**
     * Returns the number all of profile submissions.
     */
    public static async getAllSubmissionsCount(): Promise<number>
    {
        return await ProfileSubmissionModel.count().lean().exec();
    }

    /**
     * Returns all profile submissions for user.
     */
    public static getAllForUser(user: string): Promise<ProfileSubmission[]>
    {
        return this.getProfileSubmissions({createdBy: user});
    }

    /**
     * Returns all profile submissions.
     */
    public static getAll(): Promise<ProfileSubmission[]>
    {
        return this.getProfileSubmissions({});
    }

    /**
     * Deletes all profile submissions.
     */
    public static async deleteAll()
    {
        await ProfileSubmissionModel.remove({});
    }

    private static getProfileSubmissions(query: Record<string, unknown>): Promise<ProfileSubmission[]>
    {
        return ProfileSubmissionModel.find(query)
            .lean<ProfileSubmission[]>()
            .exec();
    }
}
