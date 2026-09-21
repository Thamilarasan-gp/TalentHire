import mongoose from 'mongoose';
import dns from 'dns';
import { InterviewModel } from './db/models';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

async function check() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://thamilprakasam2005:appichithamil@cluster0.qqwny.mongodb.net/TAglobal?appName=Cluster0';
  await mongoose.connect(uri);
  const invs = await InterviewModel.find({ id: { $in: ['inv-1789973993530-cand-20', 'inv-1789972037026-cand-19'] } }).lean();
  console.log(JSON.stringify(invs, null, 2));
  process.exit(0);
}
check().catch(console.error);
