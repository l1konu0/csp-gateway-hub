-- Migration pour créer les triggers de synchronisation automatique
-- entre catalogue_produits et pneus

-- Fonction pour synchroniser un produit du catalogue vers pneus
CREATE OR REPLACE FUNCTION sync_catalogue_to_pneus()
RETURNS TRIGGER AS $$
DECLARE
    pneu_info RECORD;
    pneu_data RECORD;
BEGIN
    -- Vérifier si c'est un produit de pneus (catégorie 1)
    IF NEW.categorie_id = 1 AND NEW.actif = true THEN
        -- Extraire les informations du pneu
        pneu_info := (
            SELECT 
                split_part(NEW.designation, ' ', 1) as marque,
                CASE 
                    WHEN NEW.designation ~ '\d+/\d+R\d+' THEN
                        substring(NEW.designation from '^[A-Za-z0-9\s]+(?=\s*\d+/\d+R\d+)')
                    ELSE split_part(NEW.designation, ' ', 2) || ' ' || split_part(NEW.designation, ' ', 3)
                END as modele,
                CASE 
                    WHEN NEW.designation ~ '\d+/\d+R\d+' THEN
                        substring(NEW.designation from '\d+/\d+R\d+')
                    ELSE 'Dimensions inconnues'
                END as dimensions
        );
        
        -- Préparer les données pour insertion/mise à jour
        pneu_data := (
            SELECT 
                COALESCE(pneu_info.marque, 'Marque inconnue') as marque,
                COALESCE(pneu_info.modele, 'Modèle inconnu') as modele,
                COALESCE(pneu_info.dimensions, 'Dimensions inconnues') as dimensions,
                'pneu' as type,
                NEW.prix_vente as prix,
                NEW.stock_disponible as stock,
                NEW.designation as description,
                NULL as image_url
        );
        
        -- Insérer ou mettre à jour dans pneus
        INSERT INTO pneus (marque, modele, dimensions, type, prix, stock, description, image_url)
        VALUES (
            pneu_data.marque,
            pneu_data.modele,
            pneu_data.dimensions,
            pneu_data.type,
            pneu_data.prix,
            pneu_data.stock,
            pneu_data.description,
            pneu_data.image_url
        )
        ON CONFLICT (marque, modele, dimensions) 
        DO UPDATE SET
            prix = EXCLUDED.prix,
            stock = EXCLUDED.stock,
            description = EXCLUDED.description,
            updated_at = NOW();
            
    ELSIF OLD.categorie_id = 1 AND (NEW.actif = false OR NEW.categorie_id != 1) THEN
        -- Supprimer de pneus si le produit n'est plus actif ou n'est plus un pneu
        DELETE FROM pneus 
        WHERE marque = split_part(OLD.designation, ' ', 1)
        AND modele = CASE 
            WHEN OLD.designation ~ '\d+/\d+R\d+' THEN
                substring(OLD.designation from '^[A-Za-z0-9\s]+(?=\s*\d+/\d+R\d+)')
            ELSE split_part(OLD.designation, ' ', 2) || ' ' || split_part(OLD.designation, ' ', 3)
        END
        AND dimensions = CASE 
            WHEN OLD.designation ~ '\d+/\d+R\d+' THEN
                substring(OLD.designation from '\d+/\d+R\d+')
            ELSE 'Dimensions inconnues'
        END;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour INSERT et UPDATE
CREATE OR REPLACE TRIGGER trigger_sync_catalogue_to_pneus
    AFTER INSERT OR UPDATE ON catalogue_produits
    FOR EACH ROW
    EXECUTE FUNCTION sync_catalogue_to_pneus();

-- Trigger pour DELETE
CREATE OR REPLACE TRIGGER trigger_sync_catalogue_to_pneus_delete
    AFTER DELETE ON catalogue_produits
    FOR EACH ROW
    EXECUTE FUNCTION sync_catalogue_to_pneus();

-- Fonction pour synchronisation manuelle complète
CREATE OR REPLACE FUNCTION sync_all_catalogue_to_pneus()
RETURNS TABLE(
    success_count INTEGER,
    error_count INTEGER,
    details TEXT[]
) AS $$
DECLARE
    product RECORD;
    pneu_info RECORD;
    success_count INTEGER := 0;
    error_count INTEGER := 0;
    details TEXT[] := '{}';
    error_msg TEXT;
BEGIN
    -- Vider la table pneus d'abord
    DELETE FROM pneus;
    
    -- Parcourir tous les produits actifs de catégorie pneus
    FOR product IN 
        SELECT * FROM catalogue_produits 
        WHERE categorie_id = 1 AND actif = true
    LOOP
        BEGIN
            -- Extraire les informations du pneu
            pneu_info := (
                SELECT 
                    split_part(product.designation, ' ', 1) as marque,
                    CASE 
                        WHEN product.designation ~ '\d+/\d+R\d+' THEN
                            substring(product.designation from '^[A-Za-z0-9\s]+(?=\s*\d+/\d+R\d+)')
                        ELSE split_part(product.designation, ' ', 2) || ' ' || split_part(product.designation, ' ', 3)
                    END as modele,
                    CASE 
                        WHEN product.designation ~ '\d+/\d+R\d+' THEN
                            substring(product.designation from '\d+/\d+R\d+')
                        ELSE 'Dimensions inconnues'
                    END as dimensions
            );
            
            -- Insérer dans pneus
            INSERT INTO pneus (marque, modele, dimensions, type, prix, stock, description, image_url)
            VALUES (
                COALESCE(pneu_info.marque, 'Marque inconnue'),
                COALESCE(pneu_info.modele, 'Modèle inconnu'),
                COALESCE(pneu_info.dimensions, 'Dimensions inconnues'),
                'pneu',
                product.prix_vente,
                product.stock_disponible,
                product.designation,
                NULL
            );
            
            success_count := success_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            error_msg := 'Erreur produit ' || product.code || ': ' || SQLERRM;
            details := array_append(details, error_msg);
        END;
    END LOOP;
    
    RETURN QUERY SELECT success_count, error_count, details;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le statut de synchronisation
CREATE OR REPLACE FUNCTION get_sync_status()
RETURNS TABLE(
    catalogue_count INTEGER,
    pneus_count INTEGER,
    last_sync TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM catalogue_produits WHERE categorie_id = 1 AND actif = true) as catalogue_count,
        (SELECT COUNT(*)::INTEGER FROM pneus) as pneus_count,
        (SELECT MAX(updated_at) FROM pneus) as last_sync;
END;
$$ LANGUAGE plpgsql;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_catalogue_produits_sync 
ON catalogue_produits(categorie_id, actif) 
WHERE categorie_id = 1;

-- Créer un index composite sur pneus pour les conflits
CREATE INDEX IF NOT EXISTS idx_pneus_unique 
ON pneus(marque, modele, dimensions);
