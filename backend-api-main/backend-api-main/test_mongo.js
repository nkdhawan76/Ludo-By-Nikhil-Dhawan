const mongoose = require('mongoose');

const mongoDbUrl = "mongodb+srv://ludowins:w01u9TbOujTDy7YR@cluster0.o0edfvs.mongodb.net/?appName=Cluster0";

console.log('Connecting to:', mongoDbUrl);

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected successfully to MongoDB!');
    process.exit(0);
}).catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
