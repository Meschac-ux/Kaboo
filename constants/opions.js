export const travelList = [
  {
    id: 1,
    title: "Une Aventure en solo",
    describe: "Explorez seul le monde.",
    icon: "🧳",
    people: "1 personne",
  },
  {
    id: 2,
    title: "Une Évasion romantique",
    describe: "Voyagez à deux, main dans la main.",
    icon: "💑",
    people: "2 personnes",
  },
  {
    id: 3,
    title: "Un Voyage en famille",
    describe: "Profitez & partagez des moments en famille.",
    icon: "👨‍👩‍👧‍👦",
    people: "3-5 personnes",
  },
  {
    id: 4,
    title: "Une Virée entre amis",
    describe: "Vivez des aventures entre amis.",
    icon: "👫",
    people: "Plus de 5 personnes",
  },
];

export const budgetTypes = [
  {
    id: 1,
    title: "Petit Budget",
    describe: "Des aventures passionnantes sans se ruiner.",
    icon: "💵",
  },
  {
    id: 2,
    title: "Budget Modéré",
    describe:
      "Profitez d'un bon confort tout en maîtrisant votre budget. Le bon équilibre qualité/prix.",
    icon: "🏅",
  },
  {
    id: 3,
    title: "Budget Prestige",
    describe:
      "Voyages haut de gamme et confort. Vivez des expériences de luxe et de qualité supérieure.",
    icon: "💎",
  },
];

export const AI_PROMPT =
  "Générez un plan de voyage sur {totalDay} jours pour {traveler} voyageant de {locationOrigin} à {destination} avec un {budget}. Inclue des détails de transports (vol, bus) avec des liens de réservation, les options d'hôtels avec le nom de l'hôtel, l'adresse de l'hôtel, le prix en CFA, les URLs d'images de l'hôtel, les coordonnées géographiques, les évaluations et des descriptions. Propose une liste de restaurants avec le nom du restaurant, l'adresse du restaurant, les spécialités, les URLs d'images des restaurants, les coordonnées géographiques, les évaluations et des descriptions. Suggère les lieux à visiter avec les détails des lieux, les URLs d'images des lieux, les coordonnées géographiques, les prix des billets et le meilleur moment pour visiter. Fournis un plan d'itinéraire durable pour {totalDay} jours et {totalNight} nuits avec les activités, les heurs et les lieux à visiter, le tout en format JSON";
