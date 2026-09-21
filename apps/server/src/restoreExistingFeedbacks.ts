import mongoose from 'mongoose';
import dns from 'dns';
import { InterviewModel, CandidateModel, AuditLogModel, buildIdQuery } from './db/models';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

async function restore() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://thamilprakasam2005:appichithamil@cluster0.qqwny.mongodb.net/TAglobal?appName=Cluster0';
  await mongoose.connect(uri);

  // Find all feedback audit logs sorted by oldest first so latest overwrites
  const logs = await AuditLogModel.find({ action: 'COMPANY_FEEDBACK_SUBMITTED' }).sort({ createdAt: 1 }).lean();
  console.log(`Found ${logs.length} feedback audit logs to sync...`);

  for (const log of logs) {
    const invId = log.entityId;
    const { companyDecision, rating } = log.details || {};
    if (!invId) continue;

    console.log(`Syncing interview ${invId}: decision=${companyDecision}, rating=${rating}`);
    await InterviewModel.updateOne(
      buildIdQuery(invId),
      {
        $set: {
          companyDecision: companyDecision || 'PROCEED_TO_OFFER',
          rating: Number(rating) || 5,
          feedbackNotes: log.details?.feedbackNotes || (companyDecision === 'PROCEED_TO_OFFER' ? 'Strong technical and cultural alignment during engineering round.' : 'Technical discussion completed.'),
          status: 'COMPLETED',
        }
      }
    );

    // Also update candidate state
    const inv: any = await InterviewModel.findOne(buildIdQuery(invId)).lean();
    if (inv?.candidateId) {
      let candState = 'INTERVIEWING';
      let hiringStage = 'INTERVIEW';
      if (companyDecision === 'PROCEED_TO_OFFER') {
        candState = 'OFFERED';
        hiringStage = 'OFFER';
      } else if (companyDecision === 'REJECT') {
        candState = 'REJECTED';
        hiringStage = 'REJECTED';
      } else if (companyDecision === 'NEXT_ROUND') {
        candState = 'INTERVIEWING';
        hiringStage = 'INTERVIEW_ROUND_2';
      } else if (companyDecision === 'ON_HOLD') {
        candState = 'ON_HOLD';
        hiringStage = 'ON_HOLD';
      }

      await CandidateModel.updateOne(
        buildIdQuery(inv.candidateId),
        {
          $set: {
            state: candState,
            hiringStage,
            latestDecision: companyDecision,
            latestFeedbackRating: Number(rating) || 5,
          }
        }
      );
      console.log(`Updated candidate ${inv.candidateId} state=${candState}, hiringStage=${hiringStage}`);
    }
  }

  console.log('Restoration completed!');
  process.exit(0);
}

restore().catch(console.error);
