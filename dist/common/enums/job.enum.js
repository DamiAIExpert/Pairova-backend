"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewStatus = exports.ApplicationStatus = exports.JobStatus = exports.JobPlacement = exports.EmploymentType = void 0;
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "FULL_TIME";
    EmploymentType["PART_TIME"] = "PART_TIME";
    EmploymentType["CONTRACT"] = "CONTRACT";
    EmploymentType["VOLUNTEER"] = "VOLUNTEER";
    EmploymentType["INTERNSHIP"] = "INTERNSHIP";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var JobPlacement;
(function (JobPlacement) {
    JobPlacement["ONSITE"] = "ONSITE";
    JobPlacement["REMOTE"] = "REMOTE";
    JobPlacement["HYBRID"] = "HYBRID";
})(JobPlacement || (exports.JobPlacement = JobPlacement = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["DRAFT"] = "DRAFT";
    JobStatus["PUBLISHED"] = "PUBLISHED";
    JobStatus["PAUSED"] = "PAUSED";
    JobStatus["CLOSED"] = "CLOSED";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ApplicationStatus["INTERVIEW"] = "INTERVIEW";
    ApplicationStatus["HIRED"] = "HIRED";
    ApplicationStatus["DENIED"] = "DENIED";
    ApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["SCHEDULED"] = "SCHEDULED";
    InterviewStatus["COMPLETED"] = "COMPLETED";
    InterviewStatus["CANCELED"] = "CANCELED";
})(InterviewStatus || (exports.InterviewStatus = InterviewStatus = {}));
//# sourceMappingURL=job.enum.js.map