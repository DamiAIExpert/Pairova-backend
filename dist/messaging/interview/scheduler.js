"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewScheduler = void 0;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('InterviewScheduler');
class InterviewScheduler {
    static scheduleReminder(interviewId, reminderAt) {
        logger.log(`[Placeholder] Scheduling reminder for interview ${interviewId} at ${reminderAt.toISOString()}`);
    }
    static cancelReminder(interviewId) {
        logger.log(`[Placeholder] Cancelling reminder for interview ${interviewId}`);
    }
}
exports.InterviewScheduler = InterviewScheduler;
//# sourceMappingURL=scheduler.js.map