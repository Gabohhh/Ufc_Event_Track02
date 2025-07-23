// src/api/ufcApi.js

// La URL para la API externa real de ESPN para el marcador de la UFC.
const API_URL = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard";

// Esta función mapea el estado de la API de ESPN a un formato más amigable para el usuario.
const getEventStatus = (statusType) => {
  switch (statusType) {
    case "STATUS_SCHEDULED":
      return "Próximo";
    case "STATUS_IN_PROGRESS":
      return "En Curso";
    case "STATUS_FINAL":
      return "Finalizado";
    default:
      return "Programado";
  }
};

// esta es la función que se trae y procesa la información de la API
// Se conecta a una API externa como lo requiere la tarea.
export const fetchEvents = async () => {
  console.log("Obteniendo eventos de la API de ESPN...");
  try {
    // Usa la API Fetch para hacer una solicitud de red a la URL externa.
    const response = await fetch(API_URL);

    // Esto maneja errores en caso de que la respuesta de la API no sea exitosa (ej. 404 No Encontrado).
    if (!response.ok) {
      throw new Error(`¡Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();

    // Los datos de la API están anidados dentro de `data.events`. Verificamos si existen.
    if (!data.events) {
      return []; // Devuelve un arreglo vacío si no hay eventos.
    }

    // Procesa los datos crudos de la API al formato simplificado que usa nuestra aplicación.
    // Esto hace que el resto de nuestra aplicación sea independiente de la compleja estructura de la API.
    const processedEvents = data.events.map((event) => {
      return {
        id: event.id, // El ID único para el evento.
        name: event.name, // El nombre completo del evento, ej. "UFC 305".
        date: event.date.split("T")[0], // Conserva solo la parte de la fecha (AAAA-MM-DD).
        status: getEventStatus(event.status.type.name), // Obtiene nuestra cadena de estado personalizada.
      };
    });

    return processedEvents;

  } catch (error) {
    // Esto captura errores de red o errores de una solicitud fallida.
    console.error("Fallo al obtener eventos de la API de ESPN:", error);
    // Vuelve a lanzar el error para que el componente que llama (App.js) sepa que la solicitud falló.
    throw error;
  }
};