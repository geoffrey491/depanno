-- Migration : ajoute une colonne price (texte) à la table analyses
-- À exécuter dans l'éditeur SQL Supabase (une seule fois)

alter table analyses add column if not exists price text;
