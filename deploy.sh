#!/bin/bash

# GeneDetective Deployment Script for University Server
# Usage: ./deploy.sh

echo "🚀 Starting GeneDetective deployment to university server..."

# Configuration
SERVER="88.200.63.148"
USER="89201217"
REMOTE_DIR="/home/89201217/gene-detective"

# Remove the debug info from Dashboard component for production
echo "📝 Removing debug info from Dashboard..."
sed -i '/Debug info/,+2d' frontend/src/components/Dashboard.tsx

# Build frontend for production
echo "🔨 Building frontend for production..."
cd frontend
npm run build
cd ..

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p deploy-package
cp -r backend deploy-package/
cp -r frontend/build deploy-package/frontend-build
cp backend/.env.production deploy-package/backend/.env

# Create start script for server
cat > deploy-package/start.sh << 'EOF'
#!/bin/bash
echo "Starting GeneDetective backend server..."
cd backend
npm install --production
NODE_ENV=production npm start &
echo "Backend started on port 3001"

echo "Frontend built files are in frontend-build/"
echo "Configure your web server to serve frontend-build/ on port 80"
echo "and proxy /api requests to localhost:3001"
EOF

chmod +x deploy-package/start.sh

echo "✅ Deployment package ready in deploy-package/"
echo "📤 To deploy to server, run:"
echo "   scp -r deploy-package/* $USER@$SERVER:$REMOTE_DIR/"
echo "   ssh $USER@$SERVER 'cd $REMOTE_DIR && ./start.sh'"