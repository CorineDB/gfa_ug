# Analyse SonarQube - GFA Survey Project

## Configuration réalisée

### 📁 Fichiers créés

1. **`sonar-project.properties`** - Configuration principale de SonarQube
2. **`.sonarignore`** - Fichiers et dossiers à exclure de l'analyse
3. **`run-sonar-analysis.sh`** - Script interactif pour lancer l'analyse
4. **Scripts npm** ajoutés dans `package.json`

### ⚙️ Configuration SonarQube

Le fichier `sonar-project.properties` contient:
- Clé du projet: `gfa-survey`
- Sources analysées: répertoire `src/`
- Exclusions: `node_modules`, `dist`, fichiers de test
- Support pour Vue.js, JavaScript, TypeScript
- Configuration pour la couverture de code

## 🚀 Comment exécuter l'analyse

### Option 1: Script interactif (Recommandé)
```bash
./run-sonar-analysis.sh
```

### Option 2: Commandes npm
```bash
# Analyse avec serveur local
npm run sonar:local

# Analyse avec configuration par défaut
npm run sonar
```

### Option 3: Commande directe
```bash
sonar-scanner -Dsonar.token=YOUR_TOKEN
```

## 📋 Prérequis

### 1. Serveur SonarQube
Vous avez besoin d'un serveur SonarQube en cours d'exécution:

#### Installation locale avec Docker:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

#### Ou installation manuelle:
1. Téléchargez SonarQube depuis https://www.sonarqube.org/downloads/
2. Lancez le serveur: `bin/[OS]/sonar.sh start`
3. Accédez à http://localhost:9000
4. Connexion par défaut: admin/admin

### 2. Token d'authentification
1. Connectez-vous à SonarQube (http://localhost:9000)
2. Allez dans **My Account > Security**
3. Générez un nouveau token
4. Copiez le token pour l'utiliser dans l'analyse

## 📊 Résultats de l'analyse

Après une analyse réussie, vous pourrez consulter:

- **Code Quality Gate** - Statut global de la qualité
- **Coverage** - Couverture de code (si configurée)
- **Bugs** - Problèmes détectés
- **Vulnerabilities** - Vulnérabilités de sécurité
- **Code Smells** - Problèmes de maintenabilité
- **Duplications** - Code dupliqué

### Accès aux résultats:
- URL: http://localhost:9000/dashboard?id=gfa-survey
- Ou directement depuis l'interface SonarQube

## 🔧 Configuration avancée

### Couverture de code
Pour activer la couverture de code, ajoutez dans votre projet:

```bash
# Installation de nyc pour la couverture
npm install --save-dev nyc

# Ajout du script dans package.json
"test:coverage": "nyc --reporter=lcov npm test"
```

### Exclusions personnalisées
Modifiez `sonar-project.properties` pour ajuster:
```properties
# Exclure des fichiers spécifiques
sonar.exclusions=**/legacy/**,**/vendor/**

# Exclure des tests de la couverture
sonar.coverage.exclusions=**/*.spec.js,**/mock/**
```

### Règles de qualité
Configurez votre Quality Gate dans l'interface SonarQube:
1. **Quality Gates** > Create
2. Définissez vos seuils (coverage %, duplications, etc.)
3. Assignez le Quality Gate à votre projet

## 🐛 Dépannage

### Erreur d'authentification
```
Not authorized. Please provide a user token
```
**Solution**: Vérifiez que votre token est valide et correctement fourni

### Serveur non accessible
```
Connection refused
```
**Solution**: Vérifiez que SonarQube fonctionne sur l'URL configurée

### Fichiers non analysés
**Solution**: Vérifiez les exclusions dans `.sonarignore` et `sonar-project.properties`

## 📈 Métriques importantes pour ce projet Vue.js

- **Maintainability Rating** - Facilité de maintenance
- **Reliability Rating** - Fiabilité du code
- **Security Rating** - Niveau de sécurité
- **Coverage** - Couverture de tests
- **Duplicated Lines %** - Pourcentage de duplication

## 🔄 Intégration CI/CD

Pour intégrer dans votre pipeline:

### GitHub Actions
```yaml
- name: SonarQube Scan
  uses: sonarqube-quality-gate-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### GitLab CI
```yaml
sonarqube-check:
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
```

---

✅ **Configuration terminée!** Votre projet est maintenant prêt pour l'analyse SonarQube.