# Folio — constructeur de portfolios dynamiques

Folio est un MVP SaaS qui permet à chacun de créer, personnaliser et publier un portfolio sans écrire de code. Il convient aux créatifs, développeurs, photographes, freelances, agences et profils CV.

## Fonctionnalités

- Inscription et connexion par e-mail, avec sessions sécurisées HTTP-only
- 4 modèles de départ : Studio, Lens, Career et Independent
- Éditeur dynamique avec ajout, suppression et réorganisation des sections
- Sections hero, à propos, projets/galerie, expérience, compétences, témoignages, contact et texte/image libre
- Aperçu instantané, couleurs, typographie, densité et arrondis personnalisables
- Statuts brouillon, non répertorié et publié
- URL publique `/p/[slug]` ; seuls les propriétaires peuvent accéder à l’éditeur
- Données de portfolio stockées en JSONB pour garder une structure libre

## Stack

Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM et authentification locale par sessions persistées en base. L’application suit les conventions Next.js et se déploie telle quelle sur Vercel.

## Installation locale

Prérequis : Node.js 20.9+ et une base PostgreSQL.

```bash
npm install
cp .env.example .env.local
```

Renseignez `DATABASE_URL` dans `.env.local`, puis créez les tables :

```bash
npm run db:push
```

Lancez l’application :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000), créez un compte, choisissez un modèle puis publiez votre portfolio.

## Données de démonstration

Pour créer un compte et un portfolio publié de démonstration :

```bash
npm run db:seed
```

Par défaut, le compte est `demo@atelier.local` avec le mot de passe `DemoPortfolio123!`. Définissez `DEMO_USER_EMAIL` et `DEMO_USER_PASSWORD` pour les remplacer. Ces valeurs sont uniquement des données locales de démonstration, jamais des secrets de production.

## Variables d’environnement

| Variable | Requise | Description |
| --- | --- | --- |
| `DATABASE_URL` | Oui | URL PostgreSQL compatible Neon, Supabase, Vercel Postgres ou serveur local |
| `NEXT_PUBLIC_APP_URL` | Recommandée | URL canonique de l’application |
| `DEMO_USER_EMAIL` | Non | E-mail utilisé par le seed |
| `DEMO_USER_PASSWORD` | Non | Mot de passe utilisé par le seed |

Copiez toujours `.env.example` ; ne versionnez jamais `.env` ou `.env.local`.

## Déploiement Vercel

1. Importez le dépôt dans Vercel.
2. Créez ou connectez une base PostgreSQL (Neon, Supabase ou Vercel Postgres).
3. Ajoutez `DATABASE_URL` et `NEXT_PUBLIC_APP_URL` dans les variables du projet.
4. Exécutez `npm run db:push` contre la base de production depuis un environnement sécurisé.
5. Déployez avec la commande de build par défaut `npm run build`.

Les sessions sont opaques, aléatoires, stockées en PostgreSQL et envoyées via cookie `httpOnly`, `sameSite=lax` et `secure` en production. Aucun secret d’authentification n’est codé en dur.

## Images

Le MVP accepte des URL d’images. Pour ajouter Vercel Blob, créez une route d’upload propriétaire, stockez le jeton `BLOB_READ_WRITE_TOKEN` dans Vercel et remplacez les champs URL de l’éditeur par un composant d’upload. La structure JSON actuelle (`data.image` et `data.items[].image`) ne nécessite aucune migration.

## Commandes

```bash
npm run dev       # serveur de développement
npm run build     # build de production
npm run lint      # analyse statique
npm run db:push   # synchronisation du schéma PostgreSQL
npm run db:seed   # données de démonstration
```

## Structure

- `src/app` : pages App Router et routes API
- `src/components` : éditeur, rendu public et composants d’interface
- `src/db` : schéma PostgreSQL et connexion Drizzle
- `src/lib/templates.ts` : modèles de portfolio et blocs par défaut
- `src/lib/types.ts` : modèles TypeScript `User`, `Portfolio` et `PortfolioSection`

## Limites volontaires du MVP

- Les images sont fournies par URL, sans stockage de fichiers intégré.
- Il n’y a pas encore de récupération de mot de passe ni de vérification d’e-mail.
- Le slug est unique globalement et peut être modifié par son propriétaire.
