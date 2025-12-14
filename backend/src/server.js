require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

db.initialize()
  .then(() => {
    console.log('✅ Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`\n🍬 Sweet Shop API running on http://localhost:${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV}`);
      console.log('\n📋 Test Credentials:');
      console.log('   Admin: admin@gmail.com / admin');
      console.log('   User: user@gmail.com / user123\n');
    });
  })
  .catch((error) => {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  });

process.on('SIGINT', () => {
  console.log('\n📭 Shutting down gracefully...');
  db.close();
  process.exit(0);
});