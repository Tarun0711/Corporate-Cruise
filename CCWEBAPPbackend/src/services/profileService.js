const Profile = require('../models/profile');
const User = require('../models/user');
const logger = require('../utils/logger');

class ProfileService {
  static async checkProfileCompletion(profile) {
    return !!(profile &&
      profile.gender &&
      profile.officeTimings &&
      profile.officeTimings.inTime &&
      profile.officeTimings.outTime &&
      profile.sharing &&
      profile.workingDays &&
      profile.workingDays.length > 0 &&
      profile.oneSideRoute
    );
  }
  
  static calculateOnboardingProgress(profile) {
    if (!profile) return 0;
    
    let totalFields = 5; // Total number of required field groups
    let completedFields = 0;
    
    if (profile.gender) completedFields++;
    if (profile.officeTimings && profile.officeTimings.inTime && profile.officeTimings.outTime) completedFields++;
    if (profile.sharing) completedFields++;
    if (profile.workingDays && profile.workingDays.length > 0) completedFields++;
    if (profile.oneSideRoute) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  }

  static async createProfile(profileData) {
    try {
      // Check if profile is completed
      const isCompleted = await this.checkProfileCompletion(profileData);
      profileData.isCompleted = isCompleted;
      
      // Calculate onboarding progress
      const onboardingProgress = this.calculateOnboardingProgress(profileData);
      profileData.onboardingProgress = onboardingProgress;

      const profile = new Profile(profileData);
      await profile.save();

      // Update user with profile reference
      await User.findOneAndUpdate(
        { userId: profileData.userId },
        { profile: profile._id }
      );
      
      logger.info(`Profile created for user ${profileData.userId}, completion: ${isCompleted}, progress: ${onboardingProgress}%`);
      return profile;
    } catch (error) {
      logger.error('Error creating profile:', error);
      throw new Error('Error creating profile: ' + error.message);
    }
  }

  static async getProfile(userId) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    } catch (error) {
      logger.error('Error fetching profile:', error);
      throw new Error('Error fetching profile: ' + error.message);
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      // Get current profile to check completion
      const currentProfile = await Profile.findOne({ userId });
      if (!currentProfile) {
        throw new Error('Profile not found');
      }

      // Merge current profile with updates
      const updatedProfile = { ...currentProfile.toObject(), ...updateData };
      
      // Check if profile is completed with new data
      const isCompleted = await this.checkProfileCompletion(updatedProfile);
      updateData.isCompleted = isCompleted;
      
      // Calculate onboarding progress
      const onboardingProgress = this.calculateOnboardingProgress(updatedProfile);
      updateData.onboardingProgress = onboardingProgress;

      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // Update user status if profile is completed
      if (isCompleted) {
        await User.findOneAndUpdate(
          { userId },
          { status: 'routing' }
        );
      }

      logger.info(`Profile updated for user ${userId}, completion: ${isCompleted}, progress: ${onboardingProgress}%`);
      return profile;
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw new Error('Error updating profile: ' + error.message);
    }
  }

  static async addDocument(userId, documentData) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $push: { documents: documentData } },
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      logger.info(`Document added to profile for user ${userId}`);
      return profile;
    } catch (error) {
      logger.error('Error adding document:', error);
      throw new Error('Error adding document: ' + error.message);
    }
  }

  static async updateDocument(userId, documentId, updateData) {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        throw new Error('Profile not found');
      }

      const document = profile.documents.id(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      Object.assign(document, updateData);
      await profile.save();

      logger.info(`Document updated for user ${userId}`);
      return profile;
    } catch (error) {
      logger.error('Error updating document:', error);
      throw new Error('Error updating document: ' + error.message);
    }
  }

  static async deleteDocument(userId, documentId) {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $pull: { documents: { _id: documentId } } },
        { new: true }
      );

      if (!profile) {
        throw new Error('Profile not found');
      }

      logger.info(`Document deleted from profile for user ${userId}`);
      return profile;
    } catch (error) {
      logger.error('Error deleting document:', error);
      throw new Error('Error deleting document: ' + error.message);
    }
  }
}

module.exports = ProfileService;