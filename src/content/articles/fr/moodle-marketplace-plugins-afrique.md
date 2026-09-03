---
title: "La Moodle Marketplace : des plugins pour aller plus loin que le Moodle standard"
description: "Themes, activités, intégrations : la Marketplace officielle de Moodle permet d'étendre votre plateforme sans développement sur mesure. Tour d'horizon des plugins les plus utiles pour le contexte africain."
publishDate: 2026-09-03
lang: fr
category: "Conseils"
image: "/images/actualites/Moodle Marketplace.webp"
---

Quand on installe Moodle pour la première fois, on découvre une plateforme solide mais parfois austère. Ce que beaucoup d'établissements ne savent pas, c'est qu'une Marketplace officielle recense plus de 2 000 plugins gratuits, maintenus par la communauté mondiale Moodle. Ces extensions permettent de transformer profondément l'expérience sans toucher une ligne de code.

## Qu'est-ce que la Moodle Marketplace ?

La [Moodle Marketplace](https://moodle.org/plugins/) (anciennement appelée Plugins Directory) est le catalogue officiel d'extensions pour Moodle. Chaque plugin y est noté, commenté, et sa compatibilité avec les différentes versions de Moodle est précisée. C'est la première ressource à consulter avant de commander un développement sur mesure.

## Les catégories les plus utiles

### Activités et ressources pédagogiques

Les plugins d'activités enrichissent ce que vous pouvez proposer à vos apprenants. Parmi les plus utilisés :

- **H5P** : intégré nativement depuis Moodle 3.9, il permet de créer des contenus interactifs (quiz, vidéos annotées, présentations) directement dans la plateforme, sans logiciel externe.
- **Game** : transforme des quiz Moodle classiques en activités ludiques, particulièrement apprécié dans les formations de remise à niveau.
- **Attendance** : module de suivi des présences, utile pour les formations hybrides où l'on alterne sessions en ligne et en présentiel.

### Thèmes visuels

L'apparence de Moodle est personnalisable via des thèmes. Le thème **Boost** (par défaut) est sobre et responsive. D'autres thèmes comme **Moove** ou **Classic** offrent des mises en page différentes avec options de couleurs, logo et bannières configurables sans CSS.

Pour les établissements qui souhaitent une identité visuelle forte, nous recommandons Moove : il est bien maintenu, responsive, et les options de personnalisation couvrent 90% des besoins sans développement supplémentaire.

### Authentification et accès

Dans le contexte africain, deux défis reviennent souvent : la gestion de grandes promotions et la connexion depuis des appareils partagés. Des plugins comme **LDAP Authentication** ou **OAuth2** permettent de centraliser les comptes utilisateurs et d'éviter la multiplication des identifiants.

Pour les établissements sans infrastructure Active Directory, le plugin **Email-based self-registration** avec validation manuelle reste la solution la plus simple à déployer.

### Rapports et suivi

Le suivi pédagogique est un enjeu central. Moodle propose nativement des rapports, mais ils restent limités pour une lecture rapide par un coordinateur. Le plugin **Configurable Reports** permet de créer des tableaux de bord personnalisés : taux de complétion par cours, temps passé par apprenant, notes par activité, exportables en CSV ou PDF.

## Ce que nous installons systématiquement

Sur chaque plateforme que nous déployons, nous activons par défaut :

1. **H5P** pour les contenus interactifs
2. **Attendance** pour les formations hybrides
3. **Configurable Reports** pour le suivi pédagogique
4. **Moove** ou un thème personnalisé selon l'identité de l'établissement

Ces quatre plugins répondent aux besoins les plus fréquents sans alourdir la plateforme.

## Prudence sur les plugins tiers non officiels

La Marketplace officielle applique une validation minimale de qualité. En revanche, les plugins partagés en dehors de ce catalogue (forums, GitHub) peuvent contenir du code non maintenu ou incompatible avec votre version de Moodle. Notre règle : n'installer que des plugins présents sur moodle.org/plugins avec au moins une version compatible avec la version déployée.

---

Vous hésitez entre développer une fonctionnalité sur mesure ou utiliser un plugin existant ? C'est souvent la première question à trancher avant tout projet d'extension. Nous pouvons vous aider à évaluer les options disponibles pour votre cas concret.
