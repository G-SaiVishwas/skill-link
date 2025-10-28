#!/bin/bash

# SkillLink Backend Quick Start Script

echo "🚀 Starting SkillLink Backend Setup..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your actual credentials."
    echo ""
    echo "Required variables:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - OPENAI_API_KEY"
    echo "  - JWT_SECRET"
    echo ""
    read -p "Press Enter after you've configured .env..."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
    echo "🎯 You can now:"
    echo "  - Start dev server: npm run dev"
    echo "  - Start production: npm start"
    echo ""
    echo "📡 Server will run on http://localhost:3001"
    echo ""
else
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi
