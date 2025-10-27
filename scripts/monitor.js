#!/usr/bin/env node
/**
 * DevOps Simulator - System Monitor
 * - Production is primary.
 * - Development behavior is available when NODE_ENV=development.
 * - Experimental AI features are available ONLY when FEATURE_EXPERIMENTAL=true.
 * - Experimental features are NOT production-ready. Enable only in isolated testing/staging.
 *
 * Usage examples:
 *   NODE_ENV=production node monitor.js
 *   NODE_ENV=development node monitor.js
 *   NODE_ENV=experimental FEATURE_EXPERIMENTAL=true node monitor.js
 */

const ENV = process.env.NODE_ENV || 'production';
const FEATURE_EXPERIMENTAL = (process.env.FEATURE_EXPERIMENTAL || 'false').toLowerCase() === 'true';

const baseMonitorConfig = {
  production: {
    interval: 60000,
    alertThreshold: 80,
    debugMode: false,
    verboseLogging: false,
    aiEnabled: false
  },
  development: {
    interval: 5000,
    alertThreshold: 90,
    debugMode: true,
    verboseLogging: true,
    aiEnabled: false
  }
};

// Experimental (kept separate; only applied when FEATURE_EXPERIMENTAL=true)
const experimentalOverrides = {
  interval: 30000, // 30 seconds
  alertThreshold: 75,
  metricsEndpoint: 'http://localhost:9000/metrics',
  aiEnabled: true,
  mlModelPath: './models/anomaly-detection.h5',
  cloudProviders: ['aws', 'azure', 'gcp'],
  predictiveWindow: 300 // seconds (5 minutes)
};

// Select base config according to environment
const config = { ...(baseMonitorConfig[ENV] || baseMonitorConfig.production) };

// If environment is 'experimental' and FEATURE_EXPERIMENTAL is true, merge experimental overrides
if (ENV === 'experimental' || FEATURE_EXPERIMENTAL) {
  if (!FEATURE_EXPERIMENTAL) {
    console.warn('⚠️  Experimental environment requested but FEATURE_EXPERIMENTAL is not true.');
    console.warn('   Continuing with non-experimental (safer) configuration. To enable experimental features, set FEATURE_EXPERIMENTAL=true in a testing/staging environment.');
  } else {
    Object.assign(config, experimentalOverrides);
    // mark config as experimental for logs
    config._experimental = true;
  }
}

// Logging header
console.log('================================================');
console.log('DevOps Simulator - Monitor');
console.log(`Environment : ${ENV}`);
console.log(`Experimental: ${!!config._experimental}`);
console.log('================================================');

function log(...args) {
  if (config.verboseLogging) {
    console.log(...args);
  } else {
    // keep regular logs visible
    console.log(...args);
  }
}

function predictFutureMetrics() {
  log('\n🤖 AI Prediction Engine: Analyzing historical patterns...');
  const prediction = {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    traffic: Math.random() * 1000,
    confidence: (Math.random() * 30 + 70)
  };

  console.log(`\n📊 Predicted metrics in ${config.predictiveWindow || 0}s:`);
  console.log(`   CPU: ${prediction.cpu.toFixed(2)}% (confidence: ${prediction.confidence.toFixed(2)}%)`);
  console.log(`   Memory: ${prediction.memory.toFixed(2)}% (confidence: ${prediction.confidence.toFixed(2)}%)`);
  console.log(`   Traffic: ${Math.round(prediction.traffic)} req/s (confidence: ${prediction.confidence.toFixed(2)}%)`);

  if (prediction.cpu > config.alertThreshold) {
    console.log('⚠️  PREDICTIVE ALERT: High CPU expected - consider pre-scaling');
  }

  return prediction;
}

function checkSystemHealth() {
  const timestamp = new Date().toISOString();

  if (config.debugMode) {
    console.log(`\n[${timestamp}] === DETAILED HEALTH CHECK ===`);
  } else {
    console.log(`\n[${timestamp}] Checking system health...`);
  }

  // If experimental AI is active, show multi-cloud and AI analysis
  if (config._experimental && config.aiEnabled) {
    // Simulate multi-cloud monitoring
    (config.cloudProviders || []).forEach(cloud => {
      console.log(`\n☁️  ${cloud.toUpperCase()} Status:`);
      console.log(`   ✓ Instances: ${Math.floor(Math.random() * 10 + 5)}`);
      console.log(`   ✓ Load: ${(Math.random() * 100).toFixed(2)}%`);
      console.log(`   ✓ Health: ${Math.random() > 0.1 ? 'HEALTHY' : 'DEGRADED'}`);
    });
  }

  // System metrics (simulated)
  const cpuUsage = Math.random() * 100;
  const memUsage = Math.random() * 100;
  const diskUsage = Math.random() * 100;

  console.log('\n💻 System Metrics:');
  console.log(`   CPU: ${cpuUsage.toFixed(2)}%`);
  console.log(`   Memory: ${memUsage.toFixed(2)}%`);
  console.log(`   Disk: ${diskUsage.toFixed(2)}% used`);

  // AI-powered analysis (only when explicitly enabled)
  if (config._experimental && config.aiEnabled) {
    console.log('\n🤖 AI Analysis:');
    console.log('   ✓ Pattern recognition: ACTIVE');
    console.log('   ✓ Anomaly detection: NO ANOMALIES (simulated)');
    console.log('   ✓ Performance optimization: 12 suggestions (simulated)');

    // Run prediction
    predictFutureMetrics();
  } else if (config.aiEnabled) {
    // In case someone set aiEnabled in non-experimental environment, be conservative
    console.log('\n⚠️  AI features configured but not enabled for this environment. To enable, set FEATURE_EXPERIMENTAL=true in a safe testing environment.');
  }

  // Overall status and threshold check
  const maxUsage = Math.max(cpuUsage, memUsage, diskUsage);
  if (maxUsage > config.alertThreshold) {
    console.log('\n🔴 System Status: WARNING - High resource usage');
    if (config._experimental && config.aiEnabled) {
      console.log('   AI auto-scaling suggested (simulated)');
    } else {
      console.log('   Take manual action.');
    }
  } else {
    console.log('\n🟢 System Status: OPTIMAL');
  }

  console.log('================================================');
}

// Initialize AI models only when experimental AI is enabled
if (config._experimental && config.aiEnabled) {
  console.log('Loading AI models (simulated)...');
  console.log(`✓ Model path: ${config.mlModelPath || 'N/A'}`);
  console.log('✓ Inference engine initialized (simulated)');
}

// Print chosen runtime config summary (sanitized)
console.log(`Monitoring interval: ${config.interval}ms`);
console.log(`Alert threshold   : ${config.alertThreshold}%`);
if (config._experimental) {
  console.log(`Cloud providers   : ${(config.cloudProviders || []).join(', ')}`);
  console.log(`Predictive window : ${config.predictiveWindow || 0}s`);
  console.log('AI features       : ENABLED (experimental)');
} else {
  console.log('AI features       : DISABLED');
}

// Start monitoring loop
setInterval(checkSystemHealth, config.interval);

// Run initial check immediately
checkSystemHealth();

// Background retraining loop for experimental AI (simulated)
if (config._experimental && config.aiEnabled) {
  setInterval(() => {
    console.log('\n🎓 AI Model: Retraining on new data (simulated)...');
    console.log('   Training accuracy: 94.7% (simulated)');
    console.log('   Model updated successfully (simulated)');
  }, 120000); // every 2 minutes
}
