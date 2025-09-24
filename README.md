# 🚗 CSP Chahbani Star Pneus - Site E-commerce

## 📋 Description

CSP Chahbani Star Pneus est une plateforme e-commerce moderne spécialisée dans la vente de pneus, jantes, lubrifiants, accessoires automobiles et pièces détachées. Le site offre une expérience utilisateur optimisée avec un système de gestion complet pour les administrateurs.

## 🎯 Objectif

Créer une solution e-commerce complète permettant aux clients de :
- Parcourir et acheter des produits automobiles de qualité
- Gérer leur compte client (particulier ou professionnel)
- Effectuer des commandes en ligne
- Prendre rendez-vous pour des services
- Accéder à un catalogue de produits détaillé

## ✨ Fonctionnalités Principales

### 🛍️ **E-commerce**
- **Catalogue de produits** : Pneus, jantes, lubrifiants, accessoires, pièces détachées
- **Recherche avancée** : Filtrage par marque, dimensions, compatibilité véhicule
- **Panier intelligent** : Gestion des articles avec persistance
- **Système de commande** : Processus de checkout complet
- **Gestion des stocks** : Affichage en temps réel de la disponibilité

### 👥 **Gestion des Utilisateurs**
- **Inscription/Connexion** : Système d'authentification sécurisé
- **Comptes particuliers** : Pour les clients individuels
- **Comptes professionnels** : Pour les entreprises avec informations SIRET, TVA
- **Profils complets** : Gestion des informations personnelles et professionnelles

### 🚗 **Sélection de Véhicules**
- **Sélecteur intelligent** : Trouver les pneus compatibles avec votre véhicule
- **Base de données véhicules** : Marques, modèles, années
- **Recommandations** : Suggestions de produits adaptés

### 📱 **Interface Responsive**
- **Design moderne** : Interface utilisateur intuitive et attrayante
- **Mobile-first** : Optimisé pour tous les appareils
- **Navigation fluide** : Menu et pages adaptatifs

## 🔧 **Administration**

### 📊 **Tableau de Bord Avancé**
- **Statistiques en temps réel** : Ventes, commandes, utilisateurs
- **Suivi temporel** : Évolution mensuelle et annuelle du chiffre d'affaires
- **Métriques clés** : Performance commerciale et analyse des tendances
- **Réinitialisation mensuelle** : Gestion des périodes comptables

### 📦 **Gestion des Produits**
- **Catalogue complet** : Gestion de tous les produits avec synchronisation temps réel
- **Import de données** : Support CSV et SQL pour l'importation massive
- **Gestion des stocks** : Suivi en temps réel des quantités disponibles
- **Catégorisation** : Organisation par familles et catégories
- **Prix et marges** : Gestion des tarifs et coefficients

### 👥 **Gestion des Utilisateurs**
- **Liste complète** : Vue d'ensemble de tous les utilisateurs
- **Filtrage intelligent** : Séparation particuliers/professionnels
- **Informations détaillées** : Profils complets avec données professionnelles
- **Statistiques** : Compteurs par type de compte

### 📋 **Gestion des Commandes**
- **Suivi des commandes** : Statut, détails, historique
- **Facturation** : Génération et gestion des factures
- **Gestion des livraisons** : Suivi et organisation

### 📅 **Rendez-vous**
- **Planning** : Gestion des créneaux disponibles
- **Réservations** : Système de prise de rendez-vous
- **Services** : Montage, équilibrage, géométrie

### 💬 **Messages**
- **Support client** : Gestion des demandes et réclamations
- **Communication** : Interface de messagerie intégrée

## 🛠️ **Technologies Utilisées**

### **Frontend**
- **React 18** : Framework JavaScript moderne
- **TypeScript** : Typage statique pour la robustesse
- **Vite** : Build tool rapide et moderne
- **Tailwind CSS** : Framework CSS utilitaire
- **Shadcn/ui** : Composants UI modernes et accessibles
- **React Query** : Gestion d'état et cache des données
- **React Router** : Navigation côté client

### **Backend & Base de Données**
- **Supabase** : Backend-as-a-Service avec PostgreSQL
- **Authentification** : Système de connexion sécurisé
- **Realtime** : Synchronisation en temps réel
- **Storage** : Gestion des fichiers et images

### **Déploiement**
- **Vercel** : Hébergement et déploiement automatique
- **GitHub** : Contrôle de version et CI/CD
- **Variables d'environnement** : Configuration sécurisée

## 🚀 **Installation et Démarrage**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### **Installation**
```bash
# Cloner le repository
git clone https://github.com/l1konu0/csp-gateway-hub.git

# Aller dans le dossier
cd csp-gateway-hub

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir les variables Supabase dans .env

# Démarrer le serveur de développement
npm run dev
```

### **Variables d'environnement**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 **Structure du Projet**

```
src/
├── components/          # Composants réutilisables
│   ├── admin/          # Composants d'administration
│   ├── ui/             # Composants UI de base
│   └── ...             # Autres composants
├── pages/              # Pages de l'application
├── hooks/              # Hooks personnalisés
├── integrations/       # Intégrations externes
├── data/               # Données statiques
└── lib/                # Utilitaires
```

## 🔐 **Sécurité**

- **Authentification** : Système de connexion sécurisé avec Supabase
- **Autorisation** : Gestion des rôles (admin/client)
- **Validation** : Contrôles côté client et serveur
- **HTTPS** : Communication chiffrée
- **Variables d'environnement** : Configuration sécurisée

## 📈 **Performance**

- **Lazy Loading** : Chargement à la demande des composants
- **Optimisation des images** : Compression et formats modernes
- **Cache intelligent** : Mise en cache des données avec React Query
- **Code splitting** : Division du code pour un chargement optimal

## 🎨 **Design System**

- **Couleurs** : Palette rouge professionnelle (CSP branding)
- **Typographie** : Police moderne et lisible
- **Composants** : Design system cohérent avec Shadcn/ui
- **Animations** : Transitions fluides et micro-interactions
- **Responsive** : Adaptation à tous les écrans

## 📞 **Support et Contact**

Pour toute question ou support technique :
- **Email** : support@csp-pneus.com
- **Téléphone** : +33 X XX XX XX XX
- **Adresse** : [Adresse de l'entreprise]

## 📄 **Licence**

Ce projet est propriétaire de CSP Chahbani Star Pneus. Tous droits réservés.

---

**Développé avec ❤️ pour CSP Chahbani Star Pneus**