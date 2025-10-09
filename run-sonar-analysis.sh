#!/bin/bash

# Script pour exécuter l'analyse SonarQube du projet GFA Survey

echo "======================================"
echo "Analyse SonarQube - GFA Survey Project"
echo "======================================"

# Configuration par défaut
PROJECT_KEY="gfa-survey"
PROJECT_NAME="GFA Survey Application"
SONAR_HOST_URL="http://localhost:9000"

# Vérifier si SonarQube Scanner est installé
if ! command -v sonar-scanner &> /dev/null; then
    echo "❌ SonarQube Scanner n'est pas installé."
    echo "Installez-le avec: brew install sonar-scanner"
    exit 1
fi

echo "✅ SonarQube Scanner détecté"

# Vérifier la présence du fichier de configuration
if [ ! -f "sonar-project.properties" ]; then
    echo "❌ Fichier sonar-project.properties non trouvé"
    exit 1
fi

echo "✅ Fichier de configuration trouvé"

# Options d'exécution
echo ""
echo "Options d'analyse disponibles:"
echo "1. Analyse avec serveur SonarQube local (recommandé)"
echo "2. Analyse avec serveur SonarQube distant"
echo "3. Analyse sans serveur (mode dry-run)"
echo ""

read -p "Choisissez une option (1-3): " choice

case $choice in
    1)
        echo "🔄 Lancement de l'analyse avec serveur local..."
        echo "⚠️  Assurez-vous que SonarQube fonctionne sur http://localhost:9000"
        echo ""
        read -p "Entrez votre token SonarQube: " SONAR_TOKEN
        
        if [ -z "$SONAR_TOKEN" ]; then
            echo "❌ Token requis pour l'authentification"
            exit 1
        fi
        
        sonar-scanner \
            -Dsonar.projectKey=$PROJECT_KEY \
            -Dsonar.projectName="$PROJECT_NAME" \
            -Dsonar.sources=src \
            -Dsonar.host.url=$SONAR_HOST_URL \
            -Dsonar.token=$SONAR_TOKEN
        ;;
    2)
        echo "🔄 Lancement de l'analyse avec serveur distant..."
        read -p "URL du serveur SonarQube: " SONAR_HOST_URL
        read -p "Token SonarQube: " SONAR_TOKEN
        
        if [ -z "$SONAR_TOKEN" ] || [ -z "$SONAR_HOST_URL" ]; then
            echo "❌ URL et token requis"
            exit 1
        fi
        
        sonar-scanner \
            -Dsonar.projectKey=$PROJECT_KEY \
            -Dsonar.projectName="$PROJECT_NAME" \
            -Dsonar.sources=src \
            -Dsonar.host.url=$SONAR_HOST_URL \
            -Dsonar.token=$SONAR_TOKEN
        ;;
    3)
        echo "🔄 Analyse en mode dry-run (validation de la configuration)..."
        sonar-scanner \
            -Dsonar.projectKey=$PROJECT_KEY \
            -Dsonar.projectName="$PROJECT_NAME" \
            -Dsonar.sources=src \
            -Dsonar.dryRun=true
        ;;
    *)
        echo "❌ Option invalide"
        exit 1
        ;;
esac

echo ""
if [ $? -eq 0 ]; then
    echo "✅ Analyse terminée avec succès!"
    if [ "$choice" != "3" ]; then
        echo "📊 Consultez les résultats sur: $SONAR_HOST_URL/dashboard?id=$PROJECT_KEY"
    fi
else
    echo "❌ Erreur lors de l'analyse"
    exit 1
fi