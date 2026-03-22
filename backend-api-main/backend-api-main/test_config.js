try {
    console.log('Attempting to require config...');
    const config = require('config');
    console.log('✅ Config loaded successfully!');
    console.log('Config keys:', Object.keys(config));
    console.log('Config sources:', JSON.stringify(config.util.getConfigSources(), null, 2));
} catch (err) {
    console.error('❌ Failed to load config:', err);
    console.error('Stack trace:', err.stack);
}
