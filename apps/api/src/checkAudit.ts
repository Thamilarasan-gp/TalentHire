import mongoose from 'mongoose';
import dns from 'dns';
import { AuditLogModel } from './db/models';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

async function check() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://thamilprakasam2005:appichithamil@cluster0.qqwny.mongodb.net/TAglobal?appName=Cluster0';
  await mongoose.connect(uri);
  const logs = await AuditLogModel.find({ entityId: 'inv-1789973993530-cand-20' }).lean();
  console.log('AUDIT LOGS FOR inv-1789973993530-cand-20:', JSON.stringify(logs, null, 2));

  const allLogs = await AuditLogModel.find({ action: { $regex: 'FEEDBACK', $options: 'i' } }).sort({ createdAt: -1 }).limit(10).lean();
  console.log('FEEDBACK AUDIT LOGS:', JSON.stringify(allLogs, null, 2));
  process.exit(0);
}
check().catch(console.error);
