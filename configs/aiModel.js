/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Générez un plan de voyage sur 4 jours pour Un voyage en famille voyageant de Cotonou, Bénin à Lomé, Togo avec un Budget Modéré. Inclue des détails de transports (vol, bus) avec des liens de réservation, les options d'hôtels avec le nom de l'hôtel, l'adresse de l'hôtel, le prix en CFA, les URLs d'images de l'hôtel, les coordonnées géographiques, les évaluations et des descriptions. Propose une liste de restaurants avec le nom du restaurant, l'adresse du restaurant, les spécialités, les URLs d'images des restaurants, les coordonnées géographiques, les évaluations et des descriptions. Suggère les lieux à visiter avec les détails des lieux, les URLs d'images des lieux, les coordonnées géographiques, les prix des billets et le meilleur moment pour visiter. Fournis un plan d'itinéraire durable pour 4 jours et 3 nuits avec les activités, les heurs et les lieux à visiter, le tout en format JSON",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "voyage": {\n    "titre": "Voyage en Famille de Cotonou à Lomé",\n    "duree": "4 jours / 3 nuits",\n    "budget": "Modéré",\n    "pays_depart": "Bénin",\n    "ville_depart": "Cotonou",\n    "pays_arrivee": "Togo",\n    "ville_arrivee": "Lomé"\n  },\n\n  "transport": {\n    "aller": {\n      "type": "Bus",\n      "compagnie": "Attiégbé Transport",\n      "lien_reservation": "https://www.attiégbétransport.com/",\n      "prix_estime": "5000 CFA / personne"\n    },\n    "retour": {\n      "type": "Bus",\n      "compagnie": "STM Voyageurs",\n      "lien_reservation": "https://www.stmvoyageurs.com/",\n      "prix_estime": "5000 CFA / personne"\n    }\n  },\n\n  "hebergement": {\n    "hotel": {\n      "nom": "Hôtel Ibis Lomé Centre",\n      "adresse": "Boulevard Du 13 Janvier, Lomé, Togo",\n      "prix": "40000 CFA / nuit",\n      "url_image": "https://www.accorhotels.com/ibis/lome/images/hotel-ibis-lome-centre.jpg",\n      "coordonnees": {\n        "latitude": "6.13639",\n        "longitude": "1.21111"\n      },\n      "evaluation": "4/5",\n      "description": "Hôtel moderne et confortable situé en centre-ville, idéal pour un séjour en famille."\n    }\n  },\n\n  "restauration": {\n    "restaurants": [\n      {\n        "nom": "Le Patio",\n        "adresse": "Rue du Commerce, Lomé, Togo",\n        "specialites": "Cuisine française et togolaise",\n        "url_image": "https://www.lepatio-lome.com/images/restaurant.jpg",\n        "coordonnees": {\n          "latitude": "6.14028",\n          "longitude": "1.21250"\n        },\n        "evaluation": "4.5/5",\n        "description": "Restaurant élégant offrant une ambiance chaleureuse et des plats savoureux."\n      },\n      {\n        "nom": "Chez Alice",\n        "adresse": "Avenue de la Libération, Lomé, Togo",\n        "specialites": "Cuisine togolaise traditionnelle",\n        "url_image": "https://www.chezace-lome.com/images/restaurant.jpg",\n        "coordonnees": {\n          "latitude": "6.13778",\n          "longitude": "1.20833"\n        },\n        "evaluation": "4/5",\n        "description": "Restaurant familial proposant des plats copieux et authentiques à prix abordables."\n      }\n    ]\n  },\n\n  "activites": [\n    {\n      "jour": 1,\n      "heure": "08:00",\n      "activite": "Départ de Cotonou en bus pour Lomé"\n    },\n    {\n      "jour": 1,\n      "heure": "12:00",\n      "activite": "Arrivée à Lomé, installation à l\'hôtel Ibis Lomé Centre"\n    },\n    {\n      "jour": 1,\n      "heure": "14:00",\n      "activite": "Déjeuner au restaurant Le Patio"\n    },\n    {\n      "jour": 1,\n      "heure": "16:00",\n      "activite": "Visite du Grand Marché de Lomé"\n    },\n    {\n      "jour": 2,\n      "heure": "09:00",\n      "activite": "Visite du Musée togolais de l\'art traditionnel"\n    },\n    {\n      "jour": 2,\n      "heure": "11:00",\n      "activite": "Découverte du Centre artisanal de Lomé"\n    },\n    {\n      "jour": 2,\n      "heure": "13:00",\n      "activite": "Déjeuner au restaurant Chez Alice"\n    },\n    {\n      "jour": 2,\n      "heure": "15:00",\n      "activite": "Détente sur la plage de Lomé"\n    },\n    {\n      "jour": 3,\n      "heure": "09:00",\n      "activite": "Excursion aux Cascades de Kpime",\n      "lieu": {\n        "nom": "Cascades de Kpime",\n        "url_image": "https://www.togotourism.tg/images/cascades-kpime.jpg",\n        "coordonnees": {\n          "latitude": "6.72083",\n          "longitude": "0.61944"\n        },\n        "prix_entree": "1000 CFA / personne",\n        "meilleur_moment": "Toute l\'année"\n      }\n    },\n    {\n      "jour": 4,\n      "heure": "10:00",\n      "activite": "Retour à Cotonou en bus"\n    }\n  ],\n\n  "conseils": {\n    "durabilite": "Privilégiez les transports en commun ou les taxis partagés pour vos déplacements à Lomé. N\'hésitez pas à marchander les prix au Grand Marché et au Centre artisanal. Optez pour des souvenirs fabriqués localement pour soutenir l\'artisanat togolais."\n  }\n}\n```',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
