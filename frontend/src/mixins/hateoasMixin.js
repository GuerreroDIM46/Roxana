export const hateoasMixin = {
    methods: {
        // Método para extraer el ID de un objeto HATEOAS, basado en el tipo de enlace (por ejemplo, "listado" o "self")
        extraerId(objeto, tipoEnlace = 'self') {
            if (!objeto || !objeto._links || !objeto._links[tipoEnlace] || !objeto._links[tipoEnlace].href) {
                return null;
            }
            return objeto._links[tipoEnlace].href.split('/').pop(); // Extraer el último segmento del href (que es el ID)
        }
    }
};
