import cluster from 'cluster';
import os from 'os';

export function runInCluster(bootsrap: () => Promise<void>) {
  const cpuCount = os.cpus().length;
  if (cluster.isPrimary) {
    for (let i = 0; i < cpuCount - 7; i++) {
      cluster.fork();
    }
  } else {
    bootsrap();
  }
}
