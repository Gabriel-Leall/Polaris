"use server";

const removedFeatureError = () =>
  new Error("Job application feature has been removed from Polaris.");

export const createJobApplication = async () => {
  throw removedFeatureError();
};

export const updateJobApplicationStatus = async () => {
  throw removedFeatureError();
};

export const updateJobApplication = async () => {
  throw removedFeatureError();
};

export const deleteJobApplication = async () => {
  throw removedFeatureError();
};

export const getJobApplications = async () => {
  throw removedFeatureError();
};
