import ProfileSubmission, { ProfileSubmissionModel } from '../model/ProfileSubmission';

export default class ProfileSubmissionRepo
{
    public static async create(profileSubmission: ProfileSubmission): Promise<ProfileSubmission>
    {
        const createdProfileSubmission = await ProfileSubmissionModel.create(profileSubmission);
        return createdProfileSubmission.toObject<ProfileSubmission>();
    }

    public static async getAllSubmissionsNumber(): Promise<number>
    {
        return await ProfileSubmissionModel.count().lean().exec();
    }

    public static getAllForUser(user: string): Promise<ProfileSubmission[]>
    {
        return this.findProfileSubmissions({createdBy: user});
    }

    public static findAll(): Promise<ProfileSubmission[]>
    {
        return this.findProfileSubmissions({});
    }

    public static async deleteAll()
    {
        await ProfileSubmissionModel.remove({});
    }

    private static findProfileSubmissions(query: Record<string, unknown>): Promise<ProfileSubmission[]>
    {
        return ProfileSubmissionModel.find(query)
            .lean<ProfileSubmission[]>()
            .exec();
    }
}
