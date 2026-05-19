-- =============================================================================
-- FUNCION: Actualización automática de timestamp (Auditoría)
-- Descripción: Función propia del módulo de catálogo para mantener su
-- independencia. Actualiza el campo updated_at al modificar registros.
-- =============================================================================
CREATE OR REPLACE FUNCTION catalogs.fn_actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS DE TABLAS
-- =============================================================================

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON catalogs.products
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION catalogs.fn_actualizar_updated_at();