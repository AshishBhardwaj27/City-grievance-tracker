import cron from "node-cron";

import logger from "./logger.js";

import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";


// ───────────────────────────────────────────────────────
// Check SLA Breaches
// ───────────────────────────────────────────────────────

const checkSLABreaches = async () => {

  try {

    const now = new Date();

    const result = await Complaint.updateMany(
      {
        status: {
          $nin: [
            "RESOLVED",
            "CLOSED",
            "REJECTED",
          ],
        },

        "sla.deadline": {
          $lt: now,
        },

        "sla.breached": false,
      },

      {
        $set: {
          "sla.breached": true,
        },
      }
    );


    if (result.modifiedCount > 0) {

      logger.info(
        `SLA breach: marked ${result.modifiedCount} complaints`
      );
    }

  } catch (error) {

    logger.error(
      "SLA check error:",
      error
    );
  }
};


// ───────────────────────────────────────────────────────
// Auto Escalation
// ───────────────────────────────────────────────────────

const autoEscalate = async () => {

  try {

    // 2 hours after SLA deadline
    const escalationThreshold =
      new Date(
        Date.now() - 2 * 60 * 60 * 1000
      );


    const complaints = await Complaint.find({
      "sla.breached": true,

      "escalation.isEscalated": false,

      status: {
        $nin: [
          "RESOLVED",
          "CLOSED",
          "REJECTED",
        ],
      },

      "sla.deadline": {
        $lt: escalationThreshold,
      },
    })
    .populate(
      "submittedBy",
      "name email"
    );


    for (const complaint of complaints) {

      complaint.escalation.isEscalated = true;

      complaint.escalation.escalatedAt =
        new Date();

      complaint.escalation.escalationLevel = 1;

      complaint.escalation.reason =
        "Auto-escalated: SLA breached by 2+ hours";


      complaint.auditLog.push({
        action: "AUTO_ESCALATED",

        performedBy:
          complaint.submittedBy._id,

        note:
          "System auto-escalation due to SLA breach",
      });


      await complaint.save();


      logger.info(
        `Complaint ${complaint.ticketId} auto-escalated`
      );
    }

  } catch (error) {

    logger.error(
      "Auto-escalate error:",
      error
    );
  }
};


// ───────────────────────────────────────────────────────
// Start Cron Jobs
// ───────────────────────────────────────────────────────

const startCronJobs = () => {

  // Every 15 minutes
  cron.schedule(
    "*/15 * * * *",
    checkSLABreaches,
    {
      name: "sla-check",
    }
  );


  // Every 1 hour
  cron.schedule(
    "0 * * * *",
    autoEscalate,
    {
      name: "auto-escalate",
    }
  );


  logger.info(
    "⏰ Cron jobs started"
  );
};


export {
  startCronJobs,
  checkSLABreaches,
  autoEscalate,
};