# Règle Permanente : Génération Audio Automatique & Immédiate lors de Tout Ajout

## 🚨 Règle d'Or Absolue
Pour **TOUT contenu textuel ou audio-visuel ajouté ou modifié sur ChinoisLingo** (dialogue, histoire, article, chanson, podcast, formation, mot de vocabulaire) :

1. **Génération Immédiate et Automatique** : La génération audio ElevenLabs (modèle `eleven_v3`) DOIT être exécutée **immédiatement et automatiquement dans le même tour d'action** que l'ajout du code.
2. **Interdiction de Rendu Sans Audio** : Ne JAMAIS considérer l'ajout d'un contenu comme terminé ou présenter le résultat à Espoir Chinois sans avoir au préalable généré :
   - Le master complet (`<id>.mp3`)
   - Les clips individuels phrase par phrase / réplique par réplique (`<id>_<sentenceId>.mp3`)
   - Le fichier de métadonnées et timestamps (`<id>_meta.json`)
3. **Conformité Stricte aux 11 Règles Audio** :
   - Modèle obligatoire : `eleven_v3`
   - Voix attribuées (Guan Tao Bao / Stella Gu / 5 Narrateurs officiels selon le type)
   - Normalisation sonore EBU R128 (`loudnorm`)
   - Pause naturelle de 350ms entre répliques
   - Découpage précis avec timestamps synchronisés dans `_meta.json`
4. **Vérification Complète** : Tester que les fichiers sont bien enregistrés dans `/public/audio/readings/` et que le projet compile avec `npm run build`.
