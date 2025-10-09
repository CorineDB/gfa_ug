#!/bin/bash

echo "🔍 Analyse SonarQube - GFA Survey"
echo "================================="

read -p "📝 Collez votre token SonarQube: " SONAR_TOKEN

if [ -z "$SONAR_TOKEN" ]; then
    echo "❌ Token requis"
    exit 1
fi

echo "🚀 Lancement de l'analyse..."

sonar-scanner \
    -Dsonar.projectKey=gfa-survey \
    -Dsonar.projectName="GFA Survey Application" \
    -Dsonar.sources=src \
    -Dsonar.host.url=http://localhost:9000 \
    -Dsonar.token=$SONAR_TOKEN \
    -Dsonar.sourceEncoding=UTF-8 \
    -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/public/**" \
    -Dsonar.javascript.file.suffixes=.js,.jsx \
    -Dsonar.typescript.file.suffixes=.ts,.tsx \
    -Dsonar.vue.file.suffixes=.vue

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Analyse terminée avec succès!"
    echo "📊 Résultats disponibles sur: http://localhost:9000/dashboard?id=gfa-survey"
else
    echo "❌ Erreur lors de l'analyse"
fi