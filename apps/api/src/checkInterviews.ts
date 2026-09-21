import mongoose from 'mongoose';
import dns from 'dns';
import { InterviewModel } from './db/models';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

async function check() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://thamilprakasam2005:appichithamil@cluster0.qqwny.mongodb.net/TAglobal?appName=Cluster0';
  await mongoose.connect(uri);
  const interviews = await InterviewModel.find().lean();
  console.log('TOTAL INTERVIEWS:', interviews.length);
  for (const inv of interviews) {
    console.log(JSON.stringify({
      id: inv.id,
      companyId: inv.companyId,
      candidateId: inv.candidateId,
      candidateName: inv.candidateName,
      status: inv.status,
      rating: inv.rating,
      companyDecision: inv.companyDecision,
      feedbackNotes: inv.feedbackNotes,
    }));
  }
  process.exit(0);
}
check().catch(console.error);
